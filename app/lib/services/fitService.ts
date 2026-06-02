import type { ReadySession, TrainingSession } from "@/app/lib/types"

type ExportSession = ReadySession | TrainingSession

// FIT binary base type codes
const T_ENUM   = 0x00
const T_UINT16 = 0x84
const T_UINT32 = 0x86
const T_STRING = 0x07

// FIT global message numbers
const MESG_FILE_ID      = 0
const MESG_WORKOUT      = 26
const MESG_WORKOUT_STEP = 27

// Sport / sub-sport
const SPORT_SWIMMING     = 5
const SUB_SPORT_LAP_SWIM = 17

// WktStepDuration enum
const DUR_TIME     = 0
const DUR_DISTANCE = 1

// WktStepTarget enum
const TGT_SWIM_STROKE = 10
const TGT_NONE        = 100

// Intensity enum
const INT_ACTIVE   = 0
const INT_REST     = 1
const INT_WARMUP   = 2
const INT_COOLDOWN = 3

// SwimStroke enum
const STROKE_MAP: Record<string, number> = {
  crawl:      0, // freestyle
  dos:        1, // backstroke
  brasse:     2, // breaststroke
  papillon:   3, // butterfly
  "4nages":   6, // im (individual medley)
  four_nages: 6,
}

const PHASE_INTENSITY: Record<string, number> = {
  warmup:   INT_WARMUP,
  cooldown: INT_COOLDOWN,
  main:     INT_ACTIVE,
  drills:   INT_ACTIVE,
}

// FIT CRC-16 lookup table
const CRC_TABLE = [
  0x0000, 0xCC01, 0xD801, 0x1400, 0xF001, 0x3C00, 0x2800, 0xE401,
  0xA001, 0x6C00, 0x7800, 0xB401, 0x5000, 0x9C01, 0x8801, 0x4400,
]

function fitCRC(data: number[], seed = 0): number {
  let crc = seed
  for (const b of data) {
    let tmp = CRC_TABLE[crc & 0x0F]
    crc = ((crc >> 4) & 0x0FFF) ^ tmp ^ CRC_TABLE[b & 0x0F]
    tmp = CRC_TABLE[crc & 0x0F]
    crc = ((crc >> 4) & 0x0FFF) ^ tmp ^ CRC_TABLE[(b >> 4) & 0x0F]
  }
  return crc
}

function u16(v: number): number[] { return [v & 0xFF, (v >> 8) & 0xFF] }
function u32(v: number): number[] {
  return [v & 0xFF, (v >> 8) & 0xFF, (v >> 16) & 0xFF, (v >>> 24) & 0xFF]
}
function fixedStr(s: string, len: number): number[] {
  const out = new Array<number>(len).fill(0)
  for (let i = 0; i < Math.min(s.length, len - 1); i++) out[i] = s.charCodeAt(i) & 0xFF
  return out
}

function defMsg(
  localType: number,
  globalNum: number,
  fields: Array<[number, number, number]>,
): number[] {
  return [
    0x40 | (localType & 0x0F), 0x00, 0x00, // header, reserved, little-endian
    ...u16(globalNum),
    fields.length,
    ...fields.flatMap(f => f),
  ]
}

export function buildSwimWorkoutFIT(session: ExportSession): Uint8Array {
  interface FlatStep {
    name:      string
    durType:   number
    durVal:    number
    tgtType:   number
    tgtVal:    number
    intensity: number
  }

  // Expand repetitions into individual steps — no FIT repeat step complexity
  const flatSteps: FlatStep[] = []
  for (const set of session.sets) {
    const swimStroke = STROKE_MAP[set.stroke] ?? 5
    const intensity  = PHASE_INTENSITY[set.phase] ?? INT_ACTIVE
    for (let r = 0; r < set.repetitions; r++) {
      flatSteps.push({
        name:      set.label.slice(0, 16),
        durType:   DUR_DISTANCE,
        durVal:    set.distance * 100, // centimeters
        tgtType:   TGT_SWIM_STROKE,
        tgtVal:    swimStroke,
        intensity,
      })
      if (set.restSeconds > 0) {
        flatSteps.push({
          name:      "Repos",
          durType:   DUR_TIME,
          durVal:    set.restSeconds, // seconds
          tgtType:   TGT_NONE,
          tgtVal:    0,
          intensity: INT_REST,
        })
      }
    }
  }

  const payload: number[] = []

  // Definition: FileId (local=0, global=0)
  payload.push(...defMsg(0, MESG_FILE_ID, [
    [0, 1, T_ENUM],    // type
    [1, 2, T_UINT16],  // manufacturer
    [2, 2, T_UINT16],  // product
    [4, 4, T_UINT32],  // time_created
  ]))
  const fitEpochMs = Date.UTC(1989, 11, 31)
  const fitTime    = Math.floor((Date.now() - fitEpochMs) / 1000)
  payload.push(0x00)            // local=0 data header
  payload.push(5)               // type = workout (FileType.workout = 5)
  payload.push(...u16(255))     // manufacturer = development
  payload.push(...u16(0))       // product
  payload.push(...u32(fitTime)) // time_created

  // Definition: Workout (local=1, global=26)
  payload.push(...defMsg(1, MESG_WORKOUT, [
    [4, 1,  T_ENUM],   // sport
    [7, 1,  T_ENUM],   // sub_sport
    [6, 2,  T_UINT16], // num_valid_steps
    [8, 17, T_STRING], // wkt_name (16 chars + null)
  ]))
  payload.push(0x01)                      // local=1 data header
  payload.push(SPORT_SWIMMING)            // sport
  payload.push(SUB_SPORT_LAP_SWIM)        // sub_sport
  payload.push(...u16(flatSteps.length))  // num_valid_steps
  payload.push(...fixedStr(session.title, 17)) // wkt_name

  // Definition: WorkoutStep (local=2, global=27)
  payload.push(...defMsg(2, MESG_WORKOUT_STEP, [
    [0, 2,  T_UINT16], // message_index
    [1, 17, T_STRING], // wkt_step_name
    [3, 1,  T_ENUM],   // duration_type
    [4, 4,  T_UINT32], // duration_value
    [5, 1,  T_ENUM],   // target_type
    [6, 4,  T_UINT32], // target_value
    [9, 1,  T_ENUM],   // intensity
  ]))

  for (let i = 0; i < flatSteps.length; i++) {
    const s = flatSteps[i]
    payload.push(0x02)                   // local=2 data header
    payload.push(...u16(i))              // message_index
    payload.push(...fixedStr(s.name, 17)) // wkt_step_name
    payload.push(s.durType)              // duration_type
    payload.push(...u32(s.durVal))       // duration_value
    payload.push(s.tgtType)              // target_type
    payload.push(...u32(s.tgtVal))       // target_value
    payload.push(s.intensity)            // intensity
  }

  // File header (12 bytes before CRC)
  const header: number[] = [
    14,          // header_size
    0x20,        // protocol_version 2.0
    ...u16(2132), // profile_version 21.32
    ...u32(payload.length),
    0x2E, 0x46, 0x49, 0x54, // ".FIT"
  ]
  header.push(...u16(fitCRC(header))) // header CRC over first 12 bytes

  // File CRC over header + payload
  const allBytes = [...header, ...payload]
  allBytes.push(...u16(fitCRC(allBytes)))

  return new Uint8Array(allBytes)
}
