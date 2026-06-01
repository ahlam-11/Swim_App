import type { ReadySession, TrainingSession, TrainingSet } from "@/app/lib/types"

type ExportSession = ReadySession | TrainingSession

const PHASE_LABELS: Record<string, string> = {
  warmup:   "Échauffement",
  drills:   "Drills",
  main:     "Principal",
  cooldown: "Retour au calme",
}

const STROKE_LABELS: Record<string, string> = {
  crawl:    "Crawl",
  dos:      "Dos",
  brasse:   "Brasse",
  papillon: "Papillon",
  "4nages": "4 Nages",
}

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function exportToPDF(session: ExportSession) {
  const { jsPDF } = await import("jspdf")
  const { autoTable } = await import("jspdf-autotable")

  const doc = new jsPDF()
  const blue = [0, 85, 164] as [number, number, number]

  // Header
  doc.setFillColor(...blue)
  doc.rect(0, 0, 210, 28, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(255, 255, 255)
  doc.text(session.title, 14, 12)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  const meta = [
    `${session.totalDistance.toLocaleString("fr-FR")} m`,
    `${session.estimatedDuration} min`,
    STROKE_LABELS[session.stroke] ?? session.stroke,
    `Bassin ${session.poolLength} m`,
  ].join("  ·  ")
  doc.text(meta, 14, 21)

  // Subtitle (generated sessions only)
  let startY = 38
  if ("subtitle" in session && session.subtitle) {
    doc.setTextColor(80, 80, 80)
    doc.setFontSize(10)
    doc.text(session.subtitle, 14, 34)
    startY = 44
  }

  autoTable(doc, {
    startY,
    head: [["Phase", "Rép.", "Distance", "Nage", "Repos", "Note / Consigne"]],
    body: session.sets.map((set: TrainingSet) => [
      PHASE_LABELS[set.phase] ?? set.phase,
      `${set.repetitions}×`,
      `${set.distance} m`,
      STROKE_LABELS[set.stroke] ?? set.stroke,
      set.restSeconds > 0 ? `${set.restSeconds} s` : "—",
      [set.equipment, set.note].filter(Boolean).join(" — ") || "",
    ]),
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: blue, fontStyle: "bold", fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 14, halign: "center" },
      2: { cellWidth: 22, halign: "right" },
      3: { cellWidth: 22 },
      4: { cellWidth: 18, halign: "center" },
      5: { cellWidth: "auto" },
    },
    alternateRowStyles: { fillColor: [244, 248, 255] },
  })

  // Footer
  const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(160, 160, 160)
    doc.text("SwimGen · swimgen.app", 14, 290)
    doc.text(`Page ${i} / ${pageCount}`, 196, 290, { align: "right" })
  }

  doc.save(`${slugify(session.title)}.pdf`)
}

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function buildTCX(session: ExportSession): string {
  let stepId = 1

  const steps = session.sets.map((set: TrainingSet) => {
    const activeId = stepId++
    const restId   = stepId++

    const activeStep = `        <Child xsi:type="Step_t">
          <StepId>${activeId}</StepId>
          <Name>${escapeXml(set.label)}</Name>
          <Duration xsi:type="Distance_t"><Meters>${set.distance}</Meters></Duration>
          <Intensity>Active</Intensity>
          <Target xsi:type="None_t"/>
        </Child>`

    const restStep = set.restSeconds > 0
      ? `\n        <Child xsi:type="Step_t">
          <StepId>${restId}</StepId>
          <Name>Repos</Name>
          <Duration xsi:type="Time_t"><Seconds>${set.restSeconds}</Seconds></Duration>
          <Intensity>Rest</Intensity>
          <Target xsi:type="None_t"/>
        </Child>`
      : ""

    if (set.repetitions > 1) {
      const repeatId = stepId++
      return `      <Step xsi:type="Repeat_t">
        <StepId>${repeatId}</StepId>
        <Repetitions>${set.repetitions}</Repetitions>
${activeStep}${restStep}
      </Step>`
    }

    return `      <Step xsi:type="Step_t">
        <StepId>${activeId}</StepId>
        <Name>${escapeXml(set.label)}</Name>
        <Duration xsi:type="Distance_t"><Meters>${set.distance}</Meters></Duration>
        <Intensity>Active</Intensity>
        <Target xsi:type="None_t"/>
      </Step>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase
  xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2
    http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd">
  <Workouts>
    <Workout Sport="Other">
      <Name>${escapeXml(session.title)}</Name>
${steps.join("\n")}
      <ScheduledOn>${new Date().toISOString().split("T")[0]}</ScheduledOn>
    </Workout>
  </Workouts>
</TrainingCenterDatabase>`
}

export function exportToGarmin(session: ExportSession) {
  const xml  = buildTCX(session)
  const blob = new Blob([xml], { type: "application/xml" })
  triggerDownload(blob, `${slugify(session.title)}-garmin.tcx`)
}

export function exportToCoros(session: ExportSession) {
  const xml  = buildTCX(session)
  const blob = new Blob([xml], { type: "application/xml" })
  triggerDownload(blob, `${slugify(session.title)}-coros.tcx`)
}
