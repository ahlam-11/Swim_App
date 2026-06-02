import { SESSIONS_DEBUTANT }      from "./debutant"
import { SESSIONS_INTERMEDIAIRE } from "./intermediaire"
import { SESSIONS_AVANCE }        from "./avance"

export const READY_SESSIONS = [
  ...SESSIONS_DEBUTANT,
  ...SESSIONS_INTERMEDIAIRE,
  ...SESSIONS_AVANCE,
]
