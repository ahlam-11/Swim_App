export type Stroke = "Crawl" | "Dos" | "Brasse" | "Papillon" | "4 nages" | "Ciblé";
export type Level  = "Débutant" | "Interméd." | "Avancé" | "Élite";
export type Goal   = "Endurance" | "Vitesse" | "Technique" | "Récupération";
export type SetRow = [string, string, string]; // [quantité, description, repos]

export interface MockSession {
  title:    string;
  subtitle: string;
  warmup:   SetRow[];
  main:     SetRow[];
  cooldown: string;
}

// ── Distance par niveau ───────────────────────────────────────────────────────
const LEVEL_MULT: Record<Level, number> = {
  "Débutant":  0.70,
  "Interméd.": 1.00,
  "Avancé":    1.25,
  "Élite":     1.50,
};

// ── Templates keyed by `Stroke-Goal` ─────────────────────────────────────────
const TEMPLATES: Record<string, Omit<MockSession, "subtitle">> = {

  // ────────────────── CRAWL ──────────────────────────────────────────────────
  "Crawl-Endurance": {
    title: "Endurance Crawl",
    warmup: [
      ["4 × 50m",  "Nage libre facile · respiration naturelle",               "repos 10\""],
      ["2 × 100m", "Crawl — focus position horizontale du corps",             "repos 15\""],
    ],
    main: [
      ["6 × 200m", "Crawl @75% · inspirer tous les 3 temps · rythme régulier",  "repos 20\""],
      ["4 × 50m",  "Sprint max · départ dans l'eau · récupération complète",    "repos 30\""],
      ["2 × 100m", "Pull-buoy · bras seuls · hanches hautes",                   "repos 20\""],
    ],
    cooldown: "500m nage libre très facile · focus flottaison et allongement",
  },

  "Crawl-Vitesse": {
    title: "Sprint Crawl",
    warmup: [
      ["400m",    "Crawl facile · entrée progressive",                          "—"],
      ["8 × 25m", "Accélérations progressives 50% → 90%",                       "repos 15\""],
    ],
    main: [
      ["10 × 50m", "Sprint max · récupération complète entre chaque",           "repos 40\""],
      ["5 × 100m", "Allure course · maintenir cadence de bras haute",           "repos 45\""],
      ["4 × 25m",  "Départs plongeon · max intensité · sous-marins",            "repos 60\""],
    ],
    cooldown: "400m nage libre très facile · récupération active",
  },

  "Crawl-Technique": {
    title: "Technique Crawl",
    warmup: [
      ["300m",    "Crawl facile · focus flottaison",                            "—"],
      ["4 × 50m", "Catch-up drill · attendre l'autre bras avant la traction",   "repos 10\""],
    ],
    main: [
      ["6 × 100m", "Bras droit seul × 3 temps · puis bras gauche seul × 3 temps", "repos 15\""],
      ["4 × 75m",  "Fingertip drag · doigts rasent l'eau à la récupération",    "repos 10\""],
      ["4 × 50m",  "Respiration bilatérale · gauche aller · droite retour",     "repos 10\""],
    ],
    cooldown: "400m crawl facile · focus allongement maximal du corps",
  },

  "Crawl-Récupération": {
    title: "Récupération Crawl",
    warmup: [
      ["200m", "Nage libre très facile · au feeling",                           "—"],
    ],
    main: [
      ["6 × 100m", "Crawl allure douce · cœur <130 bpm · aucune accélération", "repos 15\""],
      ["2 × 150m", "Pull-buoy · relâchement total · respirations longues",      "repos 20\""],
    ],
    cooldown: "400m nage libre · focus détente musculaire complète",
  },

  // ────────────────── DOS ────────────────────────────────────────────────────
  "Dos-Endurance": {
    title: "Endurance Dos",
    warmup: [
      ["4 × 50m",  "Dos facile · focus positionnement horizontal",              "repos 10\""],
      ["2 × 100m", "Crawl → dos alternés · transition fluide",                  "repos 15\""],
    ],
    main: [
      ["4 × 200m", "Dos @70% · rotation des hanches · cadence régulière",       "repos 20\""],
      ["6 × 50m",  "Dos jambes seules · planche sur poitrine · kick régulier",  "repos 15\""],
      ["2 × 100m", "Pull-buoy dos · bras seuls · rotation des épaules",         "repos 20\""],
    ],
    cooldown: "400m dos très facile · bras larges · expiration lente",
  },

  "Dos-Vitesse": {
    title: "Sprint Dos",
    warmup: [
      ["300m",    "Dos facile · entrée progressive",                            "—"],
      ["6 × 25m", "Accélérations dos · bras hauts au départ",                   "repos 20\""],
    ],
    main: [
      ["8 × 50m",  "Sprint dos max · départ virage · récupération complète",    "repos 40\""],
      ["4 × 100m", "Allure course · maintenir rotation de hanche",              "repos 45\""],
      ["4 × 25m",  "Départ dos · 10m sous-marins dauphin · sortie explosive",   "repos 60\""],
    ],
    cooldown: "300m nage libre très facile",
  },

  "Dos-Technique": {
    title: "Technique Dos",
    warmup: [
      ["300m",    "Dos facile · focus équilibre",                               "—"],
      ["4 × 50m", "Rotation côté dominant · bras inactif sur la cuisse",        "repos 10\""],
    ],
    main: [
      ["8 × 50m",  "Bras droit seul dos (25m) · bras gauche seul dos (25m)",   "repos 15\""],
      ["4 × 100m", "Dos · entrée petit doigt · bras dans l'axe des épaules",   "repos 15\""],
      ["4 × 50m",  "Dos yeux fermés · proprioception · garder la ligne droite", "repos 15\""],
    ],
    cooldown: "400m dos très facile · relâchement des épaules",
  },

  "Dos-Récupération": {
    title: "Récupération Dos",
    warmup: [
      ["200m", "Dos très facile",                                               "—"],
    ],
    main: [
      ["4 × 100m", "Dos allure basse · respiration lente et profonde",         "repos 20\""],
      ["2 × 200m", "Crawl très facile en alternance",                           "repos 25\""],
    ],
    cooldown: "400m nage au choix · très facile",
  },

  // ────────────────── BRASSE ─────────────────────────────────────────────────
  "Brasse-Endurance": {
    title: "Endurance Brasse",
    warmup: [
      ["4 × 50m",  "Brasse facile · coulissé long",                            "repos 10\""],
      ["2 × 100m", "Drill 2+2 · 2 bras seuls + 2 complets · trouver le rythme", "repos 15\""],
    ],
    main: [
      ["4 × 200m", "Brasse @70% · coulissé long après traction · régulier",    "repos 25\""],
      ["4 × 100m", "Jambes brasse seules · planche · kick puissant",            "repos 20\""],
      ["4 × 50m",  "Brasse bras seuls · pull-buoy entre jambes",                "repos 15\""],
    ],
    cooldown: "400m brasse très facile · focus coulissé maximal",
  },

  "Brasse-Vitesse": {
    title: "Sprint Brasse",
    warmup: [
      ["300m",    "Brasse facile",                                              "—"],
      ["8 × 25m", "Accélérations · explosivité au déclenchement des jambes",    "repos 20\""],
    ],
    main: [
      ["8 × 50m",  "Sprint brasse max · départ bassin · récupération complète", "repos 40\""],
      ["4 × 100m", "Allure course · coulissé court · kick puissant",            "repos 50\""],
      ["4 × 25m",  "Départ plongeon · première coulée maximale · explosif",     "repos 60\""],
    ],
    cooldown: "300m très facile",
  },

  "Brasse-Technique": {
    title: "Technique Brasse",
    warmup: [
      ["300m",    "Brasse facile",                                              "—"],
      ["4 × 50m", "Bras seuls · pull-buoy · traction haute · coudes hauts",    "repos 10\""],
    ],
    main: [
      ["8 × 50m",  "Jambes seules · planche · ouverture et fermeture des pieds", "repos 15\""],
      ["4 × 100m", "Drill timing 2+2 · 2 coups bras seuls · 2 complets",       "repos 15\""],
      ["4 × 50m",  "Ondulation hanches · coudes hauts en traction · coulissé tendu", "repos 10\""],
    ],
    cooldown: "400m brasse facile · coulissé très long · 5s de glisse",
  },

  "Brasse-Récupération": {
    title: "Récupération Brasse",
    warmup: [
      ["200m", "Brasse très facile",                                            "—"],
    ],
    main: [
      ["6 × 100m", "Brasse allure douce · coulissé long · aucune intensité",   "repos 20\""],
      ["2 × 150m", "Crawl ou brasse très facile · au feeling",                 "repos 25\""],
    ],
    cooldown: "400m nage libre très facile",
  },

  // ────────────────── PAPILLON ───────────────────────────────────────────────
  "Papillon-Endurance": {
    title: "Endurance Papillon",
    warmup: [
      ["4 × 50m", "Crawl facile · préchauffer les épaules progressivement",    "repos 10\""],
      ["4 × 50m", "Dauphin sur le dos · ondulation complète du corps",          "repos 10\""],
    ],
    main: [
      ["4 × 100m", "Papillon @65% · focus ondulation hanche · bras larges",    "repos 30\""],
      ["6 × 50m",  "Bras droit seul pap (25m) · bras gauche seul (25m)",        "repos 20\""],
      ["4 × 50m",  "Crawl récupération active entre les séries papillon",       "repos 15\""],
    ],
    cooldown: "500m nage libre facile · relâchement complet des épaules",
  },

  "Papillon-Vitesse": {
    title: "Sprint Papillon",
    warmup: [
      ["300m",    "Crawl facile · épaules progressives",                        "—"],
      ["6 × 25m", "Dauphin sous-marin · sortie explosive à 10m",                "repos 20\""],
    ],
    main: [
      ["6 × 50m",  "Sprint papillon · max 1ère longueur · maintien retour",     "repos 45\""],
      ["4 × 75m",  "25m papillon max + 50m crawl récupération active",          "repos 45\""],
      ["4 × 25m",  "Départ plongeon · 10m dauphin + explosif en sortie",        "repos 60\""],
    ],
    cooldown: "500m crawl très facile · récupération active des épaules",
  },

  "Papillon-Technique": {
    title: "Technique Papillon",
    warmup: [
      ["300m",    "Crawl facile",                                               "—"],
      ["6 × 25m", "Dauphin planche · amplitude maximale · 2 dauphins par brassée", "repos 10\""],
    ],
    main: [
      ["8 × 50m",  "Bras droit seul pap (25m) · bras gauche seul (25m) · alterner", "repos 15\""],
      ["4 × 50m",  "Ondulation corps · col et hanches · bras à plat sur l'eau",  "repos 15\""],
      ["4 × 50m",  "Papillon · 2 bras + 1 dauphin · timing entrée des mains",   "repos 15\""],
    ],
    cooldown: "400m crawl facile",
  },

  "Papillon-Récupération": {
    title: "Récupération Papillon",
    warmup: [
      ["200m", "Crawl très facile",                                             "—"],
    ],
    main: [
      ["4 × 100m", "Papillon très facile · 1 brassée tous les 3 dauphins si besoin", "repos 30\""],
      ["4 × 50m",  "Dauphin avec palmes · relâchement complet des épaules",     "repos 15\""],
    ],
    cooldown: "400m crawl très facile",
  },

  // ────────────────── 4 NAGES ────────────────────────────────────────────────
  "4 nages-Endurance": {
    title: "Endurance 4 Nages",
    warmup: [
      ["100m pap + 100m dos + 100m brasse + 100m crawl", "Chaque nage facile · focus entrée dans l'eau", "—"],
    ],
    main: [
      ["4 × 200m IM", "50m pap · 50m dos · 50m brasse · 50m crawl · régulier",  "repos 30\""],
      ["4 × 100m IM", "Focus transitions · virages propres entre nages",         "repos 25\""],
      ["4 × 50m",     "Nage faible ×2 · nage forte ×2 · noter les différences", "repos 15\""],
    ],
    cooldown: "400m crawl très facile",
  },

  "4 nages-Vitesse": {
    title: "Sprint 4 Nages",
    warmup: [
      ["200m 4 nages", "Chaque nage progressive 50% → 80%",                    "—"],
      ["8 × 25m",      "Sprint nage au choix · max · départ bassin",            "repos 20\""],
    ],
    main: [
      ["4 × 100m IM", "25m pap max · 25m dos max · 25m brasse max · 25m crawl max", "repos 45\""],
      ["8 × 50m",     "Sprint par nage · alterner : pap · dos · brasse · crawl",  "repos 40\""],
      ["2 × 100m IM", "All-out · récupération complète",                        "repos 90\""],
    ],
    cooldown: "300m très facile",
  },

  "4 nages-Technique": {
    title: "Technique 4 Nages",
    warmup: [
      ["4 × 50m", "Une nage par 50m · focus entrée dans l'eau et alignement",  "repos 10\""],
    ],
    main: [
      ["2 × 50m papillon", "Bras seuls · ondulation · timing entrée",          "repos 15\""],
      ["2 × 50m dos",      "Bras seuls alternés · rotation épaules",            "repos 15\""],
      ["2 × 50m brasse",   "Jambes seules · extension maximale du coulissé",    "repos 15\""],
      ["6 × 50m crawl",    "Fingertip drag · catch-up · bilatéral alternés",    "repos 10\""],
      ["2 × 100m IM",      "Intégrer la technique · transitions propres",       "repos 20\""],
    ],
    cooldown: "400m crawl facile",
  },

  "4 nages-Récupération": {
    title: "Récupération 4 Nages",
    warmup: [
      ["200m", "Nage libre très facile",                                        "—"],
    ],
    main: [
      ["4 × 100m IM", "Très facile · chaque nage détendue · cœur bas",         "repos 25\""],
      ["4 × 100m",    "Jambes alternées · 2 nages au choix · planche",         "repos 20\""],
    ],
    cooldown: "400m nage libre très facile",
  },

  // ────────────────── CIBLÉ ──────────────────────────────────────────────────
  "Ciblé-Endurance": {
    title: "Endurance Ciblée",
    warmup: [
      ["400m",    "Nage principale facile · entrée progressive",                "—"],
      ["4 × 50m", "Drills nage faible · identifier les défauts",                "repos 10\""],
    ],
    main: [
      ["4 × 200m", "Nage faible @70% · focus point technique principal",       "repos 20\""],
      ["4 × 100m", "Alterné : 50m nage forte + 50m nage faible",               "repos 20\""],
    ],
    cooldown: "400m nage forte · facile · observer les différences de sensation",
  },

  "Ciblé-Vitesse": {
    title: "Vitesse Ciblée",
    warmup: [
      ["300m",    "Nage principale facile",                                     "—"],
      ["6 × 25m", "Sprint nage ciblée · activation musculaire explosive",       "repos 20\""],
    ],
    main: [
      ["8 × 50m",  "Sprint nage ciblée · 100% · récupération complète",        "repos 40\""],
      ["4 × 100m", "Allure course nage ciblée · technique à haute cadence",    "repos 45\""],
    ],
    cooldown: "300m facile",
  },

  "Ciblé-Technique": {
    title: "Technique Ciblée",
    warmup: [
      ["300m",    "Nage principale facile",                                     "—"],
      ["4 × 50m", "Drill d'échauffement nage faible",                           "repos 10\""],
    ],
    main: [
      ["10 × 50m", "Drill nage ciblée · focus unique sur 1 seul point technique", "repos 15\""],
      ["4 × 100m", "Nage ciblée complète · intégrer le drill en mouvement",    "repos 20\""],
      ["4 × 50m",  "Nage forte pour contraste · puis retour nage ciblée",       "repos 10\""],
    ],
    cooldown: "400m nage libre facile",
  },

  "Ciblé-Récupération": {
    title: "Récupération Ciblée",
    warmup: [
      ["200m", "Nage principale très facile",                                   "—"],
    ],
    main: [
      ["6 × 100m", "Nage faible très facile · aucune fatigue · focus flottaison", "repos 20\""],
      ["2 × 200m", "Nage forte très facile · contraste",                        "repos 30\""],
    ],
    cooldown: "400m nage libre",
  },
};

export function generateMockSession(
  stroke: Stroke,
  level: Level,
  goal: Goal,
  duration: number
): MockSession {
  const key = `${stroke}-${goal}`;
  const template = TEMPLATES[key] ?? TEMPLATES["Crawl-Endurance"];

  const baseDist =
    duration < 35 ? 1200 :
    duration < 45 ? 1500 :
    duration < 55 ? 2000 :
    duration < 70 ? 2500 :
    duration < 90 ? 3000 : 3500;

  const dist = Math.round((baseDist * LEVEL_MULT[level]) / 100) * 100;
  const distStr = dist >= 1000
    ? `${(dist / 1000).toFixed(1).replace(".", ",")} km`
    : `${dist} m`;

  return {
    ...template,
    subtitle: `${duration} min · ~${distStr} · ${level}`,
  };
}

// ── Library ───────────────────────────────────────────────────────────────────
export interface LibraryVideo {
  nage:  string;
  title: string;
  tag:   string;
  dur:   string;
  level: string;
}

export const LIBRARY_VIDEOS: LibraryVideo[] = [
  { nage: "Crawl",    title: "Position du corps et gainage",       tag: "Position",     dur: "2:34", level: "Débutant"      },
  { nage: "Crawl",    title: "Respiration bilatérale",              tag: "Respiration",  dur: "3:12", level: "Débutant"      },
  { nage: "Crawl",    title: "Coordination bras / battements",      tag: "Coordination", dur: "4:05", level: "Intermédiaire" },
  { nage: "Crawl",    title: "Catch-up drill et allongement",       tag: "Drill",        dur: "2:58", level: "Intermédiaire" },
  { nage: "Dos",      title: "Rotation du corps dos crawlé",        tag: "Technique",    dur: "2:50", level: "Débutant"      },
  { nage: "Dos",      title: "Virage culbute dos",                  tag: "Virage",       dur: "4:01", level: "Intermédiaire" },
  { nage: "Dos",      title: "Entrée de main et traction dos",      tag: "Traction",     dur: "3:30", level: "Avancé"        },
  { nage: "Brasse",   title: "Ondulation de hanches brasse",        tag: "Technique",    dur: "1:55", level: "Débutant"      },
  { nage: "Brasse",   title: "Timing traction / grenouille",        tag: "Coordination", dur: "3:20", level: "Intermédiaire" },
  { nage: "Brasse",   title: "Coulissé long et glisse",             tag: "Glisse",       dur: "2:10", level: "Débutant"      },
  { nage: "Brasse",   title: "Sprint à haute cadence brasse",       tag: "Vitesse",      dur: "3:45", level: "Avancé"        },
  { nage: "Papillon", title: "Ondulation complète du corps",        tag: "Technique",    dur: "5:10", level: "Avancé"        },
  { nage: "Papillon", title: "Départ plongeon papillon",            tag: "Départ",       dur: "2:48", level: "Avancé"        },
  { nage: "Papillon", title: "Bras seuls alternés pour débutants",  tag: "Drill",        dur: "3:15", level: "Intermédiaire" },
];

export interface LibraryDrill {
  problem: string;
  count:   number;
  dur:     string;
}

export const LIBRARY_DRILLS: LibraryDrill[] = [
  { problem: "Je coule les hanches en crawl",           count: 3, dur: "15 min" },
  { problem: "Je n'arrive pas à respirer en brasse",    count: 4, dur: "20 min" },
  { problem: "Mes virages sont trop lents",             count: 3, dur: "12 min" },
  { problem: "Je me fatigue trop vite en papillon",     count: 5, dur: "25 min" },
  { problem: "Ma technique dos manque de rotation",     count: 3, dur: "15 min" },
  { problem: "Mon coulissé brasse est trop court",      count: 4, dur: "18 min" },
];

// ── History ───────────────────────────────────────────────────────────────────
export interface HistorySession {
  date:   string;
  name:   string;
  dist:   string;
  dur:    string;
  stroke: string;
}

export const HISTORY_STATS = {
  sessions: 12,
  distance: "28 km",
  strokes:  4,
};

export const HISTORY_WEEKLY = [40, 55, 70, 45, 85, 60, 95, 50];

export const HISTORY_SESSIONS: HistorySession[] = [
  { date: "Hier",     name: "Endurance Crawl",       dist: "2 500m", dur: "45 min", stroke: "Crawl"   },
  { date: "Lundi",    name: "Technique Dos",          dist: "1 800m", dur: "40 min", stroke: "Dos"     },
  { date: "Vendredi", name: "4 Nages récupération",   dist: "1 200m", dur: "30 min", stroke: "4 nages" },
  { date: "Mercredi", name: "Sprint Crawl",           dist: "2 000m", dur: "50 min", stroke: "Crawl"   },
  { date: "Mardi",    name: "Technique Brasse",       dist: "1 500m", dur: "35 min", stroke: "Brasse"  },
];

export const HISTORY_DIST = [
  { nage: "Crawl",    pct: 65 },
  { nage: "Dos",      pct: 20 },
  { nage: "Brasse",   pct: 10 },
  { nage: "Papillon", pct: 5  },
];
