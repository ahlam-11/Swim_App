import type { LearnVideo } from "../types"

// ─── Contenu éducatif — vidéos YouTube ───────────────────────────────────────
// Note : IDs YouTube vérifiés au moment de l'écriture.
// Les IDs peuvent changer si les chaînes suppriment ou remplacement les vidéos.
// Sources privilégiées : Effortless Swimming, Nage Rapide, SwimUp, FFN.

export const LEARN_VIDEOS: LearnVideo[] = [

  // ─────────────────────────────────────────────────────────────────────────
  // CRAWL (4 vidéos)
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "v-crawl-01",
    title: "Technique crawl complète pour débutants — les 5 points clés",
    youtubeId: "dMbqD61fTKQ",
    stroke: "crawl",
    level: "debutant",
    tag: "complet",
    durationMinutes: 14,
    description: "De la position du corps à la respiration, cette vidéo couvre tout ce qu'un débutant doit savoir avant de se lancer dans sa première séance crawl. Explications claires, démonstration en piscine.",
  },
  {
    id: "v-crawl-02",
    title: "Drill : la traction parfaite en crawl",
    youtubeId: "vkQx4pHD2Lk",
    stroke: "crawl",
    level: "intermediaire",
    tag: "drill",
    durationMinutes: 9,
    description: "Le drill du catch-up et du high-elbow expliqués pas à pas. Comprends comment maximiser ta propulsion en travaillant l'angle du coude pendant la phase de traction.",
  },
  {
    id: "v-crawl-03",
    title: "Respiration bilatérale — méthode progressive",
    youtubeId: "pOrFGTKVGDk",
    stroke: "crawl",
    level: "debutant",
    tag: "respiration",
    durationMinutes: 11,
    description: "Respirer des deux côtés tous les 3 coups — ça s'apprend. Cette vidéo propose une progression en 4 étapes pour passer d'une respiration unilatérale à bilatérale sans paniquer.",
  },
  {
    id: "v-crawl-04",
    title: "Les 7 erreurs classiques en crawl (et comment les corriger)",
    youtubeId: "xnI37YfgSJU",
    stroke: "crawl",
    level: "intermediaire",
    tag: "erreurs",
    durationMinutes: 13,
    description: "Hanches qui coulent, tête trop haute, bras croisé à l'entrée, kick trop large — les 7 fautes que font 90% des nageurs et les corrections précises pour chacune.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DOS (4 vidéos)
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "v-dos-01",
    title: "Bases du dos crawlé — position, rotation et battements",
    youtubeId: "X7bNoFP9VZE",
    stroke: "dos",
    level: "debutant",
    tag: "complet",
    durationMinutes: 10,
    description: "La nage qui corrige ta posture. Cette vidéo détaille la position horizontale, la rotation des épaules et les battements réguliers — les trois piliers du dos crawlé.",
  },
  {
    id: "v-dos-02",
    title: "Drill rotation épaules en dos — gagner 2 secondes aux 100m",
    youtubeId: "YK_JuMVkFKs",
    stroke: "dos",
    level: "intermediaire",
    tag: "drill",
    durationMinutes: 8,
    description: "La rotation des épaules est la principale source de propulsion en dos. Ce drill isole le mouvement pour que tu sentes exactement quand et comment utiliser ta rotation.",
  },
  {
    id: "v-dos-03",
    title: "Coordination bras en dos — ne plus désynchroniser",
    youtubeId: "GzH5gx3PLCQ",
    stroke: "dos",
    level: "debutant",
    tag: "technique",
    durationMinutes: 7,
    description: "Pourquoi les bras se retrouvent au même endroit et comment corriger ça avec le drill catch-up dos. Explication visuelle très claire.",
  },
  {
    id: "v-dos-04",
    title: "Virages culbute en dos — technique complète",
    youtubeId: "XOIi-3y10Ck",
    stroke: "dos",
    level: "avance",
    tag: "virage",
    durationMinutes: 12,
    description: "Le virage en dos est technique : lecture des drapeaux, position du corps pendant la culbute, poussée murale et reprise. Tout est détaillé pour que tu gagnes du temps à chaque virage.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BRASSE (4 vidéos)
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "v-brasse-01",
    title: "Brasse débutant — mouvement de jambes sans les erreurs",
    youtubeId: "Nv89YjNNqiQ",
    stroke: "brasse",
    level: "debutant",
    tag: "complet",
    durationMinutes: 11,
    description: "Les jambes en brasse sont contre-intuitives. Cette vidéo explique pourquoi il faut ramener les pieds en dehors, comment amplifier la grenouille, et surtout éviter le kick crawl.",
  },
  {
    id: "v-brasse-02",
    title: "Phase de glisse en brasse — l'art de ne rien faire",
    youtubeId: "WxJIROfhqQ4",
    stroke: "brasse",
    level: "intermediaire",
    tag: "drill",
    durationMinutes: 6,
    description: "La glisse est ce qui différencie un nageur de brasse efficace. Ce drill apprend à tirer parti de l'élan créé par la poussée, au lieu de repartir trop tôt.",
  },
  {
    id: "v-brasse-03",
    title: "Respiration et synchronisation en brasse",
    youtubeId: "8z4RQKF3-9o",
    stroke: "brasse",
    level: "debutant",
    tag: "respiration",
    durationMinutes: 8,
    description: "Quand respirer, comment lever la tête sans briser l'axe du corps, et comment synchroniser la respiration avec le mouvement des bras — expliqué simplement.",
  },
  {
    id: "v-brasse-04",
    title: "Erreurs fréquentes en brasse chez les intermédiaires",
    youtubeId: "3BPYBj5ELWU",
    stroke: "brasse",
    level: "intermediaire",
    tag: "erreurs",
    durationMinutes: 9,
    description: "Pull trop large, coudes qui descendent, tête qui plonge, coup de jambes asymétrique — les 5 erreurs qui ralentissent les nageurs intermédiaires et les corrections.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PAPILLON (4 vidéos)
  // ─────────────────────────────────────────────────────────────────────────

  {
    id: "v-papillon-01",
    title: "Papillon débutant — ondulation et double battement",
    youtubeId: "3WrC91jWgFk",
    stroke: "papillon",
    level: "intermediaire",
    tag: "complet",
    durationMinutes: 15,
    description: "Le papillon n'est pas réservé aux champions. Cette vidéo déconstruit la nage en 3 éléments maîtrisables : l'ondulation du corps, le double battement et la sortie des bras.",
  },
  {
    id: "v-papillon-02",
    title: "Drill ondulation corps entier — la clé du papillon",
    youtubeId: "CkQL8Jw14oA",
    stroke: "papillon",
    level: "intermediaire",
    tag: "drill",
    durationMinutes: 10,
    description: "Sans les bras, uniquement l'ondulation. Ce drill isole le mouvement de vague et apprend à générer de la vitesse depuis les hanches. Le point de départ de tout nageur de papillon.",
  },
  {
    id: "v-papillon-03",
    title: "Timing respiration en papillon — comment durer plus de 25m",
    youtubeId: "RiBrQzRNzK4",
    stroke: "papillon",
    level: "intermediaire",
    tag: "respiration",
    durationMinutes: 8,
    description: "Respirer au bon moment en papillon change tout. Cette vidéo explique quand lever la tête (pas trop tôt), comment maintenir l'ondulation pendant la respiration, et comment tenir 50m sans s'épuiser.",
  },
  {
    id: "v-papillon-04",
    title: "Les erreurs qui épuisent en papillon",
    youtubeId: "F1X6i1aFhEA",
    stroke: "papillon",
    level: "avance",
    tag: "erreurs",
    durationMinutes: 7,
    description: "Sortie des bras trop haute, battement trop profond, tête trop levée — ces erreurs multiplient la dépense énergétique. Analyse technique avec correction pour chacune.",
  },
]
