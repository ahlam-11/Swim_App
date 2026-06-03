import type { TrainingSet } from "@/app/lib/types"
import { PHASE_COLORS, STROKE_LABELS } from "./consts"

interface Props {
  set:     TrainingSet
  index:   number
  visible: boolean
}

export default function SessionSetRow({ set, index, visible }: Props) {
  return (
    <div style={{
      padding: "20px 0", borderBottom: "1px solid var(--ligne)",
      display: "flex", gap: 16,
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(8px)",
      transition: `opacity 300ms ease ${index * 60}ms, transform 300ms ease ${index * 60}ms`,
    }}>
      <div style={{ width: 3, borderRadius: 2, background: PHASE_COLORS[set.phase] ?? "#ccc", flexShrink: 0, minHeight: 60 }} />
      <div style={{ flex: 1 }}>
        <span style={{ display: "block", fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gris-doux)", marginBottom: 12 }}>
          {set.label}
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
          <thead>
            <tr>
              {["Rép.", "Distance", "Nage", "Repos"].map(h => (
                <th key={h} style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9CA3AF", textAlign: "left", padding: "0 0 8px", borderBottom: "1px solid var(--ligne)", fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "var(--gris-doux)", padding: "10px 0" }}>{set.repetitions}×</td>
              <td style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, color: "var(--encre)", padding: "10px 0" }}>{set.distance}m</td>
              <td style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, color: "var(--encre)", padding: "10px 0" }}>{STROKE_LABELS[set.stroke] ?? set.stroke}</td>
              <td style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, color: "var(--encre)", padding: "10px 0" }}>{set.restSeconds === 0 ? "—" : `${set.restSeconds}s`}</td>
            </tr>
          </tbody>
        </table>
        {set.note && (
          <p style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic", fontSize: 14, color: "var(--gris-doux)", lineHeight: 1.5, marginTop: 8 }}>
            {set.note}
          </p>
        )}
      </div>
    </div>
  )
}
