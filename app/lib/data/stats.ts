import type { UserStats } from "../types"

// ─── Stats calculées depuis les 15 séances de MOCK_HISTORY ───────────────────
// Totaux vérifiés manuellement :
//   distances : crawl 13600 | brasse 2200 | dos 2600 | 4nages 3800 | papillon 1800 = 24 000 m
//   durée     : somme des actualDuration = 882 min
//   exports   : h06, h08, h09, h11, h13, h15 = 6

export const USER_STATS: UserStats = {
  totalSessions:     15,
  totalDistance:     24000,
  totalDuration:     882,
  favoriteStroke:    "crawl",
  currentStreak:     4,

  distanceByStroke: {
    crawl:    13600,
    brasse:    2200,
    dos:       2600,
    "4nages":  3800,
    papillon:  1800,
  },

  distanceByMonth: [
    { month: "Février 2026", distance:  5400 },
    { month: "Mars 2026",    distance:  8200 },
    { month: "Avril 2026",   distance: 10400 },
  ],

  sessionsCompleted: 15,
  exportsCount:       6,
}
