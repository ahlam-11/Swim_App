import type { ReadySession } from "../types"

// ─── Séances prêtes à l'emploi ───────────────────────────────────────────────
// 12 séances réalistes, utilisables par de vrais nageurs.
// Distances vérifiées : totalDistance = somme(repetitions × distance) de chaque set.

export const READY_SESSIONS: ReadySession[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // DÉBUTANT (4 séances)
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "s01",
    title: "Premier 1000m",
    level: "debutant",
    stroke: "crawl",
    goal: "endurance",
    totalDistance: 1000,
    estimatedDuration: 45,
    poolLength: 25,
    tags: ["crawl", "débutant", "endurance", "respirat ion"],
    sets: [
      {
        id: "s01-1", phase: "warmup", label: "Crawl très facile",
        repetitions: 2, distance: 50, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Prends le temps de sentir l'eau. Respire tous les 2 coups côté droit.",
      },
      {
        id: "s01-2", phase: "drills", label: "Position tête neutre",
        repetitions: 4, distance: 25, stroke: "crawl",
        restSeconds: 20, intensity: "easy",
        note: "Regarde le fond du bassin. Les yeux à 45°, jamais vers l'avant.",
      },
      {
        id: "s01-3", phase: "main", label: "Crawl continu",
        repetitions: 4, distance: 100, stroke: "crawl",
        restSeconds: 45, intensity: "easy",
        note: "Si tu dois t'arrêter au milieu, c'est que tu vas trop vite. Ralentis.",
      },
      {
        id: "s01-4", phase: "drills", label: "Respiration alternée",
        repetitions: 4, distance: 25, stroke: "crawl",
        restSeconds: 20, intensity: "easy",
        note: "Alterne côté droit et gauche. Expire entièrement sous l'eau avant de respirer.",
      },
      {
        id: "s01-5", phase: "main", label: "Crawl rythmé",
        repetitions: 4, distance: 50, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Compte tes coups par longueur. Essaie de maintenir le même nombre.",
      },
      {
        id: "s01-6", phase: "cooldown", label: "Dos crawlé facile",
        repetitions: 2, distance: 50, stroke: "dos",
        restSeconds: 30, intensity: "easy",
        note: "Ferme les yeux un instant. Concentre-toi sur la position horizontale.",
      },
    ],
  },

  {
    id: "s02",
    title: "Découverte Brasse",
    level: "debutant",
    stroke: "brasse",
    goal: "technique",
    totalDistance: 800,
    estimatedDuration: 40,
    poolLength: 25,
    tags: ["brasse", "débutant", "technique", "jambes"],
    sets: [
      {
        id: "s02-1", phase: "warmup", label: "Crawl d'activation",
        repetitions: 2, distance: 50, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Commence doucement, réveille les épaules.",
      },
      {
        id: "s02-2", phase: "drills", label: "Jambes brasse avec planche",
        repetitions: 4, distance: 25, stroke: "brasse jambes",
        restSeconds: 20, intensity: "easy",
        equipment: "Planche obligatoire",
        note: "Talons aux fesses, pointes en dehors, puis pousse. Pas de battement crawl entre les cycles.",
      },
      {
        id: "s02-3", phase: "main", label: "Brasse facile",
        repetitions: 4, distance: 50, stroke: "brasse",
        restSeconds: 40, intensity: "easy",
        note: "Glisse après chaque poussée. Tu dois sentir un moment de flottaison.",
      },
      {
        id: "s02-4", phase: "drills", label: "Bras brasse avec pull buoy",
        repetitions: 4, distance: 25, stroke: "brasse bras",
        restSeconds: 20, intensity: "easy",
        equipment: "Pull buoy",
        note: "Les jambes sont portées par le pull buoy. Concentre-toi uniquement sur l'entrée des mains.",
      },
      {
        id: "s02-5", phase: "main", label: "Brasse coordonnée",
        repetitions: 4, distance: 50, stroke: "brasse",
        restSeconds: 40, intensity: "easy",
        note: "Bras + jambes ensemble. Le corps doit faire une vague fluide.",
      },
      {
        id: "s02-6", phase: "cooldown", label: "Crawl retour au calme",
        repetitions: 2, distance: 50, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Très lent, respire tranquillement.",
      },
    ],
  },

  {
    id: "s03",
    title: "Endurance douce",
    level: "debutant",
    stroke: "4nages",
    goal: "endurance",
    totalDistance: 1200,
    estimatedDuration: 50,
    poolLength: 25,
    tags: ["4nages", "débutant", "endurance", "varié"],
    sets: [
      {
        id: "s03-1", phase: "warmup", label: "Crawl d'échauffement",
        repetitions: 4, distance: 50, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Augmente légèrement l'allure à chaque 50m.",
      },
      {
        id: "s03-2", phase: "main", label: "Crawl / Dos en alternance",
        repetitions: 4, distance: 50, stroke: "crawl + dos",
        restSeconds: 30, intensity: "easy",
        note: "25m crawl, retourne-toi au virage, 25m dos. Travaille la transition.",
      },
      {
        id: "s03-3", phase: "drills", label: "Dos crawlé continu",
        repetitions: 4, distance: 50, stroke: "dos",
        restSeconds: 30, intensity: "easy",
        note: "Oreilles dans l'eau, hanches hautes, regard vers le plafond.",
      },
      {
        id: "s03-4", phase: "main", label: "Brasse / Crawl en alternance",
        repetitions: 4, distance: 50, stroke: "brasse + crawl",
        restSeconds: 35, intensity: "easy",
        note: "25m brasse, 25m crawl. Récupère avec le crawl si la brasse fatigue.",
      },
      {
        id: "s03-5", phase: "main", label: "Crawl rythmé",
        repetitions: 4, distance: 50, stroke: "crawl",
        restSeconds: 30, intensity: "moderate",
        note: "Un peu plus soutenu qu'au départ. Tu peux aller un peu plus vite.",
      },
      {
        id: "s03-6", phase: "cooldown", label: "Dos facile",
        repetitions: 4, distance: 50, stroke: "dos",
        restSeconds: 30, intensity: "easy",
        note: "Étire les bras en arrière, relâche les épaules.",
      },
    ],
  },

  {
    id: "s04",
    title: "Récupération active",
    level: "debutant",
    stroke: "4nages",
    goal: "recuperation",
    totalDistance: 600,
    estimatedDuration: 30,
    poolLength: 25,
    tags: ["récupération", "tous niveaux", "léger", "court"],
    sets: [
      {
        id: "s04-1", phase: "warmup", label: "Crawl très doux",
        repetitions: 2, distance: 50, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Aussi lent que possible. Le but c'est de bouger, pas de nager vite.",
      },
      {
        id: "s04-2", phase: "main", label: "Dos crawlé facile",
        repetitions: 4, distance: 50, stroke: "dos",
        restSeconds: 30, intensity: "easy",
        note: "Le dos décompresse les épaules. Profite-en.",
      },
      {
        id: "s04-3", phase: "main", label: "Brasse lente",
        repetitions: 2, distance: 50, stroke: "brasse",
        restSeconds: 45, intensity: "easy",
        note: "Glisse longtemps entre chaque cycle. Compte jusqu'à 3 en position allongée.",
      },
      {
        id: "s04-4", phase: "main", label: "Crawl doux",
        repetitions: 2, distance: 50, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Maintiens le même rythme tranquille.",
      },
      {
        id: "s04-5", phase: "cooldown", label: "Dos retour au calme",
        repetitions: 2, distance: 50, stroke: "dos",
        restSeconds: 30, intensity: "easy",
        note: "Termine en douceur. Étire les bras au maximum à chaque coup.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INTERMÉDIAIRE (5 séances)
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "s05",
    title: "Endurance Crawl 2000m",
    level: "intermediaire",
    stroke: "crawl",
    goal: "endurance",
    totalDistance: 2000,
    estimatedDuration: 60,
    poolLength: 25,
    tags: ["crawl", "intermédiaire", "endurance", "pyramide"],
    sets: [
      {
        id: "s05-1", phase: "warmup", label: "Crawl progressif",
        repetitions: 2, distance: 200, stroke: "crawl",
        restSeconds: 45, intensity: "easy",
        note: "1er 200m facile, 2e 200m un peu plus soutenu. Active les hanches.",
      },
      {
        id: "s05-2", phase: "main", label: "Pyramide montante — 100m",
        repetitions: 1, distance: 100, stroke: "crawl",
        restSeconds: 30, intensity: "moderate",
        note: "Départ de la pyramide. Maintiens une allure constante.",
      },
      {
        id: "s05-3", phase: "main", label: "Pyramide — 200m",
        repetitions: 1, distance: 200, stroke: "crawl",
        restSeconds: 30, intensity: "moderate",
        note: "Un peu plus dur. La respiration doit rester contrôlée.",
      },
      {
        id: "s05-4", phase: "main", label: "Pyramide — sommet 400m",
        repetitions: 1, distance: 400, stroke: "crawl",
        restSeconds: 45, intensity: "moderate",
        note: "La pièce maîtresse. Pense à la rotation des hanches toutes les 100m.",
      },
      {
        id: "s05-5", phase: "main", label: "Pyramide descendante — 200m",
        repetitions: 1, distance: 200, stroke: "crawl",
        restSeconds: 30, intensity: "moderate",
        note: "Tu redescends. Économise ton énergie.",
      },
      {
        id: "s05-6", phase: "main", label: "Pyramide — 100m",
        repetitions: 1, distance: 100, stroke: "crawl",
        restSeconds: 30, intensity: "moderate",
        note: "Dernier effort de la pyramide.",
      },
      {
        id: "s05-7", phase: "main", label: "Crawl séries",
        repetitions: 4, distance: 100, stroke: "crawl",
        restSeconds: 30, intensity: "hard",
        note: "Plus d'intensité. Teste ta limite aérobie.",
      },
      {
        id: "s05-8", phase: "cooldown", label: "Dos de récupération",
        repetitions: 2, distance: 100, stroke: "dos",
        restSeconds: 45, intensity: "easy",
        note: "Relâche les épaules. Respire profondément.",
      },
    ],
  },

  {
    id: "s06",
    title: "Technique Dos",
    level: "intermediaire",
    stroke: "dos",
    goal: "technique",
    totalDistance: 1800,
    estimatedDuration: 55,
    poolLength: 25,
    tags: ["dos", "intermédiaire", "technique", "rotation"],
    sets: [
      {
        id: "s06-1", phase: "warmup", label: "Dos d'activation",
        repetitions: 4, distance: 100, stroke: "dos",
        restSeconds: 30, intensity: "easy",
        note: "Oreilles dans l'eau. Pense à garder les hanches hautes.",
      },
      {
        id: "s06-2", phase: "drills", label: "Rotation épaules isolée",
        repetitions: 4, distance: 50, stroke: "dos",
        restSeconds: 20, intensity: "easy",
        note: "Nage avec un bras seul, l'autre le long du corps. 25m droite / 25m gauche. Sens la rotation.",
      },
      {
        id: "s06-3", phase: "drills", label: "Catch-up dos",
        repetitions: 4, distance: 50, stroke: "dos",
        restSeconds: 20, intensity: "easy",
        note: "Attends que le bras avant soit tendu avant de sortir le bras arrière. Crée un rythme lent.",
      },
      {
        id: "s06-4", phase: "main", label: "Dos technique soutenu",
        repetitions: 4, distance: 200, stroke: "dos",
        restSeconds: 30, intensity: "moderate",
        note: "Applique tout ce que tu viens de travailler. Rotation, entrée des mains dans l'axe, battements réguliers.",
      },
      {
        id: "s06-5", phase: "cooldown", label: "Crawl facile",
        repetitions: 2, distance: 100, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Termine tranquillement.",
      },
    ],
  },

  {
    id: "s07",
    title: "Papillon progressif",
    level: "intermediaire",
    stroke: "papillon",
    goal: "technique",
    totalDistance: 1500,
    estimatedDuration: 50,
    poolLength: 25,
    tags: ["papillon", "intermédiaire", "technique", "ondulation"],
    sets: [
      {
        id: "s07-1", phase: "warmup", label: "Crawl d'activation",
        repetitions: 2, distance: 200, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Mobilise les épaules, des grands mouvements.",
      },
      {
        id: "s07-2", phase: "drills", label: "Ondulation corps entier",
        repetitions: 8, distance: 25, stroke: "papillon jambes",
        restSeconds: 20, intensity: "easy",
        note: "Pousse au mur, bras le long du corps, ondule de la tête aux orteils. La puissance vient des hanches.",
      },
      {
        id: "s07-3", phase: "drills", label: "Un bras papillon",
        repetitions: 4, distance: 25, stroke: "papillon",
        restSeconds: 20, intensity: "easy",
        note: "Un bras sort, l'autre reste tendu devant. 25m bras droit, 25m bras gauche.",
      },
      {
        id: "s07-4", phase: "main", label: "Papillon / Crawl par longueur",
        repetitions: 4, distance: 100, stroke: "papillon + crawl",
        restSeconds: 45, intensity: "moderate",
        note: "50m papillon, 50m crawl de récupération. Le crawl est ta récompense — nage-le bien.",
      },
      {
        id: "s07-5", phase: "main", label: "Papillon avec plaquettes",
        repetitions: 4, distance: 50, stroke: "papillon",
        restSeconds: 40, intensity: "moderate",
        equipment: "Plaquettes recommandées",
        note: "Les plaquettes amplifient les erreurs de placement de main. Sens l'appui sur l'eau.",
      },
      {
        id: "s07-6", phase: "cooldown", label: "Dos de récupération",
        repetitions: 2, distance: 100, stroke: "dos",
        restSeconds: 30, intensity: "easy",
        note: "Le dos étire les épaules dans le sens opposé au papillon.",
      },
    ],
  },

  {
    id: "s08",
    title: "Vitesse Crawl",
    level: "intermediaire",
    stroke: "crawl",
    goal: "vitesse",
    totalDistance: 1600,
    estimatedDuration: 50,
    poolLength: 25,
    tags: ["crawl", "intermédiaire", "vitesse", "sprint"],
    sets: [
      {
        id: "s08-1", phase: "warmup", label: "Crawl progressif",
        repetitions: 4, distance: 100, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Monte en intensité : 1er facile, 2e modéré, 3e soutenu, 4e presque hard.",
      },
      {
        id: "s08-2", phase: "main", label: "Sprints 50m",
        repetitions: 10, distance: 50, stroke: "crawl",
        restSeconds: 45, intensity: "sprint",
        note: "À fond sur chaque 50m. La récupération de 45s doit te permettre de repartir à 100%.",
      },
      {
        id: "s08-3", phase: "main", label: "100m soutenus",
        repetitions: 4, distance: 100, stroke: "crawl",
        restSeconds: 30, intensity: "hard",
        note: "Maintiens un rythme élevé mais contrôlé. Pas de sprint, mais pas loin non plus.",
      },
      {
        id: "s08-4", phase: "cooldown", label: "Récupération active crawl",
        repetitions: 3, distance: 100, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Très lent, laisse le corps récupérer. Pense à l'étirement.",
      },
    ],
  },

  {
    id: "s09",
    title: "4 Nages équilibrée",
    level: "intermediaire",
    stroke: "4nages",
    goal: "endurance",
    totalDistance: 2000,
    estimatedDuration: 65,
    poolLength: 25,
    tags: ["4nages", "intermédiaire", "IM", "endurance"],
    sets: [
      {
        id: "s09-1", phase: "warmup", label: "Crawl / Dos alternés",
        repetitions: 4, distance: 100, stroke: "crawl + dos",
        restSeconds: 30, intensity: "easy",
        note: "100m crawl, 100m dos en alternance. Active les deux systèmes.",
      },
      {
        id: "s09-2", phase: "main", label: "IM complet",
        repetitions: 4, distance: 200, stroke: "4 nages",
        restSeconds: 45, intensity: "moderate",
        note: "50m papillon / 50m dos / 50m brasse / 50m crawl. Transition propre à chaque virage.",
      },
      {
        id: "s09-3", phase: "main", label: "Nage de prédilection",
        repetitions: 4, distance: 100, stroke: "crawl",
        restSeconds: 30, intensity: "hard",
        note: "Ta nage forte. Donne-toi un peu plus ici.",
      },
      {
        id: "s09-4", phase: "cooldown", label: "Dos facile",
        repetitions: 4, distance: 100, stroke: "dos",
        restSeconds: 30, intensity: "easy",
        note: "Décompresse avec le dos. Longues rotations.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // AVANCÉ (3 séances)
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "s10",
    title: "Compétition Crawl",
    level: "avance",
    stroke: "crawl",
    goal: "vitesse",
    totalDistance: 3500,
    estimatedDuration: 80,
    poolLength: 25,
    tags: ["crawl", "avancé", "compétition", "volume"],
    sets: [
      {
        id: "s10-1", phase: "warmup", label: "Crawl progressif",
        repetitions: 2, distance: 400, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "1er 400m facile, 2e 400m avec quelques accélérations en fin de longueur.",
      },
      {
        id: "s10-2", phase: "main", label: "100m départ imposé",
        repetitions: 10, distance: 100, stroke: "crawl",
        restSeconds: 0, intensity: "hard",
        note: "Départ toutes les 1min30. Gère ton effort pour tenir les 10 répétitions.",
      },
      {
        id: "s10-3", phase: "main", label: "200m race pace",
        repetitions: 5, distance: 200, stroke: "crawl",
        restSeconds: 30, intensity: "hard",
        note: "Allure de compétition sur 200m. Récupération courte — ça doit faire mal.",
      },
      {
        id: "s10-4", phase: "main", label: "Sprints finaux 50m",
        repetitions: 8, distance: 50, stroke: "crawl",
        restSeconds: 30, intensity: "sprint",
        note: "Tout ce qu'il te reste. Chaque 50m est un engagement total.",
      },
      {
        id: "s10-5", phase: "cooldown", label: "Crawl retour au calme",
        repetitions: 1, distance: 300, stroke: "crawl",
        restSeconds: 0, intensity: "easy",
        note: "Long, lent. Laisse le corps comprendre que c'est fini.",
      },
    ],
  },

  {
    id: "s11",
    title: "Endurance Papillon",
    level: "avance",
    stroke: "papillon",
    goal: "endurance",
    totalDistance: 2500,
    estimatedDuration: 70,
    poolLength: 25,
    tags: ["papillon", "avancé", "endurance", "volume"],
    sets: [
      {
        id: "s11-1", phase: "warmup", label: "Crawl d'activation",
        repetitions: 4, distance: 100, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Mobilise les épaules. Des grands mouvements.",
      },
      {
        id: "s11-2", phase: "warmup", label: "Dos d'activation",
        repetitions: 4, distance: 50, stroke: "dos",
        restSeconds: 20, intensity: "easy",
        note: "Le dos prépare les épaules dans l'axe opposé. Indispensable avant le papillon.",
      },
      {
        id: "s11-3", phase: "drills", label: "Ondulation corps entier",
        repetitions: 8, distance: 50, stroke: "papillon jambes",
        restSeconds: 20, intensity: "easy",
        note: "Palmes recommandées. L'ondulation doit partir du sternum, pas des hanches.",
      },
      {
        id: "s11-4", phase: "main", label: "Papillon / Crawl mixte",
        repetitions: 4, distance: 200, stroke: "papillon + crawl",
        restSeconds: 45, intensity: "moderate",
        note: "150m papillon + 50m crawl. Le crawl n'est pas une pause — maintiens l'intensité.",
      },
      {
        id: "s11-5", phase: "main", label: "100m papillon technique",
        repetitions: 4, distance: 100, stroke: "papillon",
        restSeconds: 40, intensity: "hard",
        note: "Priorité à la technique. Un papillon propre sur 100m vaut mieux que 200m chaotiques.",
      },
      {
        id: "s11-6", phase: "cooldown", label: "Dos facile",
        repetitions: 4, distance: 75, stroke: "dos",
        restSeconds: 30, intensity: "easy",
        note: "Étirements actifs en nageant. Laisse les épaules décompresser.",
      },
    ],
  },

  {
    id: "s12",
    title: "IM Complet",
    level: "avance",
    stroke: "4nages",
    goal: "endurance",
    totalDistance: 3000,
    estimatedDuration: 75,
    poolLength: 25,
    tags: ["4nages", "avancé", "IM", "complet"],
    sets: [
      {
        id: "s12-1", phase: "warmup", label: "Crawl progressif",
        repetitions: 4, distance: 100, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Chaque 100m un peu plus vite. Active progressivement.",
      },
      {
        id: "s12-2", phase: "drills", label: "Activation technique par nage",
        repetitions: 4, distance: 50, stroke: "4 nages",
        restSeconds: 20, intensity: "easy",
        note: "50m de chaque nage dans l'ordre IM. Focus sur la transition de chaque nage.",
      },
      {
        id: "s12-3", phase: "main", label: "400m IM complet",
        repetitions: 4, distance: 400, stroke: "4 nages",
        restSeconds: 60, intensity: "hard",
        note: "100m papillon / 100m dos / 100m brasse / 100m crawl. Chaque transition est un point de contrôle technique.",
      },
      {
        id: "s12-4", phase: "main", label: "Sprints nage au choix",
        repetitions: 8, distance: 50, stroke: "choix",
        restSeconds: 30, intensity: "sprint",
        note: "Ta nage la plus forte, à fond. Les 8 répétitions doivent être aussi rapides que la 1ère.",
      },
      {
        id: "s12-5", phase: "cooldown", label: "Crawl de récupération",
        repetitions: 4, distance: 100, stroke: "crawl",
        restSeconds: 30, intensity: "easy",
        note: "Long, régulier, respirations profondes.",
      },
    ],
  },
]
