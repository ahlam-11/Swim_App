import type { LearnVideo } from "../types"

// ─── Contenu éducatif — vidéos YouTube ───────────────────────────────────────
// Sources : Mon Coach de Natation (FR), GTN, Effortless Swimming, FFN.
// IDs vérifiés via recherche web — vérifier avant mise en production.

export const LEARN_VIDEOS: LearnVideo[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // CRAWL
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "v-crawl-01",
    title: "Les bases que tout le monde doit connaître",
    youtubeId: "OAvy6-XiYng",
    stroke: "crawl",
    level: "debutant",
    tag: "complet",
    durationMinutes: 12,
    description: "Position du corps, rotation, battements, entrée de main — tout ce qu'un débutant doit maîtriser avant sa première vraie séance crawl.",
  },
  {
    id: "v-crawl-02",
    title: "3 drills pour améliorer ta traction",
    youtubeId: "NshUgNuQSwc",
    stroke: "crawl",
    level: "intermediaire",
    tag: "drill",
    durationMinutes: 9,
    description: "Le catch et le high-elbow expliqués avec des drills précis. Comprends comment maximiser ta propulsion sur chaque coup de bras.",
  },
  {
    id: "v-crawl-03",
    title: "La respiration en crawl — méthode débutant",
    youtubeId: "u-hMgpVLdtI",
    stroke: "crawl",
    level: "debutant",
    tag: "respiration",
    durationMinutes: 10,
    description: "Expire sous l'eau, tourne la tête, inspire vite. Un exercice inédit pour installer le bon réflexe dès le départ.",
  },
  {
    id: "v-crawl-04",
    title: "Les 5 erreurs de tous les débutants en crawl",
    youtubeId: "NfIWNmNCn8U",
    stroke: "crawl",
    level: "intermediaire",
    tag: "erreurs",
    durationMinutes: 11,
    description: "Tête trop haute, bras croisé à l'entrée, kick trop large, mauvaise respiration — les 5 erreurs qui ralentissent 90% des nageurs et comment les corriger.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DOS
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "v-dos-01",
    title: "Technique complète du dos crawlé — guide étape par étape",
    youtubeId: "8PkF7euQZBo",
    stroke: "dos",
    level: "debutant",
    tag: "complet",
    durationMinutes: 10,
    description: "Position horizontale, rotation des épaules, battements réguliers — les trois piliers du dos crawlé expliqués avec des démonstrations claires.",
  },
  {
    id: "v-dos-02",
    title: "3 exercices pour nager le dos parfaitement",
    youtubeId: "wnFAWhXSB9Y",
    stroke: "dos",
    level: "intermediaire",
    tag: "drill",
    durationMinutes: 10,
    description: "Trois drills pour corriger la rotation, améliorer l'entrée de main et stabiliser la position du corps. À intégrer directement dans tes séances.",
  },
  {
    id: "v-dos-03",
    title: "Technique du dos crawlé — coordination et timing",
    youtubeId: "MrFt6JHii8w",
    stroke: "dos",
    level: "debutant",
    tag: "technique",
    durationMinutes: 9,
    description: "Pourquoi les bras se retrouvent désynchronisés et comment régler ça. Explication visuelle du timing entre bras et hanches.",
  },
  {
    id: "v-dos-04",
    title: "Virage culbute en dos — technique complète",
    youtubeId: "y3LKAyYUpgc",
    stroke: "dos",
    level: "avance",
    tag: "virage",
    durationMinutes: 3,
    description: "Lecture des drapeaux, rotation du corps, poussée murale et reprise en dos. Tout le virage décortiqué pour gagner du temps à chaque longueur.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BRASSE
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "v-brasse-02",
    title: "La coulée en brasse — comment la faire en 4 étapes",
    youtubeId: "XfqcGiQzvGI",
    stroke: "brasse",
    level: "intermediaire",
    tag: "drill",
    durationMinutes: 8,
    description: "La coulée est ce qui différencie un nageur de brasse efficace. Ce drill apprend à tirer parti de l'élan au lieu de repartir trop tôt.",
  },
  {
    id: "v-brasse-03",
    title: "Apprendre la brasse en 5 étapes — débutants",
    youtubeId: "4sgWzAo7Elo",
    stroke: "brasse",
    level: "debutant",
    tag: "respiration",
    durationMinutes: 13,
    description: "De zéro à une brasse complète : ciseau, bras, respiration, synchronisation. La progression la plus claire pour un débutant complet.",
  },
  {
    id: "v-brasse-04",
    title: "Les erreurs à corriger pour une brasse irréprochable",
    youtubeId: "rnCFpnI1p-s",
    stroke: "brasse",
    level: "intermediaire",
    tag: "erreurs",
    durationMinutes: 11,
    description: "Pull trop large, coudes qui descendent, kick asymétrique — les erreurs qui ralentissent les nageurs intermédiaires avec les corrections précises.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PAPILLON
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "v-papillon-01",
    title: "Apprendre le papillon — guide complet",
    youtubeId: "pSEoaoMqq2s",
    stroke: "papillon",
    level: "intermediaire",
    tag: "complet",
    durationMinutes: 15,
    description: "Le papillon déconstruit en 3 éléments maîtrisables : ondulation du corps, double battement, sortie des bras. La vidéo de référence pour débuter.",
  },
  {
    id: "v-papillon-02",
    title: "Drill ondulation corps — la clé du papillon",
    youtubeId: "4CQdMTBs5hM",
    stroke: "papillon",
    level: "intermediaire",
    tag: "drill",
    durationMinutes: 4,
    description: "Sans les bras, uniquement l'ondulation. Ce drill avec l'entraîneur olympique Tom Jager isole le mouvement de vague et apprend à générer de la vitesse depuis les hanches.",
  },
  {
    id: "v-papillon-03",
    title: "La respiration en papillon — nager sans s'épuiser",
    youtubeId: "6y3rUr6HqdM",
    stroke: "papillon",
    level: "intermediaire",
    tag: "respiration",
    durationMinutes: 10,
    description: "Quand lever la tête, comment maintenir l'ondulation pendant la respiration, et comment tenir 50m sans exploser. Le guide complet de la respiration en papillon.",
  },
  {
    id: "v-papillon-04",
    title: "Papillon — nager plus longtemps sans se fatiguer",
    youtubeId: "OAIUGMVNtFs",
    stroke: "papillon",
    level: "avance",
    tag: "erreurs",
    durationMinutes: 10,
    description: "Sortie des bras trop haute, battement trop profond, tête mal placée — les erreurs qui épuisent. Corrections techniques pour tenir la distance.",
  },
]
