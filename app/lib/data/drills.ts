import type { TargetedDrill } from "../types"

// ─── Exercices ciblés par problème ───────────────────────────────────────────
// 8 problèmes fréquents avec 2-3 drills chacun.
// Descriptions au ton coach — directives claires, pas de jargon inutile.

export const TARGETED_DRILLS: TargetedDrill[] = [
  {
    id: "d01",
    problem: "Je coule les hanches en crawl",
    stroke: "crawl",
    drills: [
      {
        name: "Flottaison active",
        description: "Pousse les hanches vers la surface en tendant les orteils comme un danseur. La tête dans l'axe, regarde le fond. Si les hanches descendent, c'est que tu regardes trop en avant.",
        distance: "6×50m",
        tip: "Imagine que tu glisses sous une porte basse — ton dos ne doit pas toucher le dessus.",
      },
      {
        name: "Planche jambes",
        description: "Avec la planche devant toi, travaille uniquement les battements. Les hanches doivent rester à la surface tout le long. Si elles descendent, réduis l'amplitude des pieds.",
        distance: "8×25m",
        equipment: "Planche",
        tip: "L'effort vient des cuisses, pas des mollets. Les pieds sont détendus, pas rigides.",
      },
      {
        name: "Head-lead body rotation",
        description: "Nage sans tourner la tête pour respirer — un bras en avant, tu tournes les épaules uniquement. La rotation des épaules entraîne mécaniquement les hanches vers la surface.",
        distance: "4×25m",
        tip: "Ferme la bouche et fais 1 longueur complète sans respirer. Observe la position de tes hanches.",
      },
    ],
  },

  {
    id: "d02",
    problem: "Je n'arrive pas à respirer en crawl",
    stroke: "crawl",
    drills: [
      {
        name: "Respiration unilatérale stabilisée",
        description: "Respire toujours du même côté, tous les 2 coups. Crée d'abord un rythme stable avant de chercher la bilatérale. Expire entièrement sous l'eau avant de tourner la tête.",
        distance: "6×50m",
        tip: "Une oreille reste dans l'eau quand tu respires. Si tu sors complètement la tête, tu casses ta ligne et tu bois la tasse.",
      },
      {
        name: "Expiration sous-marine",
        description: "Pousse au mur, plonge la tête et expire lentement par la bouche. Remonte, inspire, replonge. La panique vient de retenir son souffle — ce drill élimine cette habitude.",
        distance: "5 minutes en exercice statique",
        tip: "Expire en faisant des bulles régulières. Ne souffles pas tout d'un coup.",
      },
      {
        name: "Drill planche + respiration",
        description: "Planche devant toi, battements, tête dans l'eau. Toutes les 6 secondes, tourne la tête sur le côté pour respirer sans relever les épaules.",
        distance: "4×50m",
        equipment: "Planche",
        tip: "La bouche sort juste au ras de l'eau. Si tu avales des projections, la tête est trop haute.",
      },
    ],
  },

  {
    id: "d03",
    problem: "Mes jambes coulent en dos",
    stroke: "dos",
    drills: [
      {
        name: "Battements avec pull buoy aux chevilles",
        description: "Place le pull buoy entre les chevilles (pas les cuisses). Force les jambes à travailler activement pour maintenir la position horizontale. Si les jambes coulent, tu n'utilises pas assez les cuisses.",
        distance: "4×50m",
        equipment: "Pull buoy aux chevilles",
        tip: "Les orteils pointés vers le plafond, les genoux juste sous la surface.",
      },
      {
        name: "Dos jambes seules + planche",
        description: "Planche sur le ventre, retourne-toi sur le dos. Maintiens la planche sur ta poitrine et travaille uniquement les battements. Les hanches doivent être hautes.",
        distance: "6×25m",
        equipment: "Planche",
        tip: "Si tu coules, tu as les mains sur la planche — sers-t'en comme support pour pousser les hanches vers le haut.",
      },
    ],
  },

  {
    id: "d04",
    problem: "Je manque de glisse en brasse",
    stroke: "brasse",
    drills: [
      {
        name: "Brasse 3 tempos",
        description: "Après chaque poussée, compte 1-2-3 en position allongée avant de repartir. Ce drill force ton corps à chercher la glisse au lieu de repartir immédiatement.",
        distance: "4×50m",
        tip: "Tu dois sentir que tu avances encore après le 3. Si tu t'arrêtes net, c'est que ta position n'est pas assez hydrodynamique.",
      },
      {
        name: "Un cycle + glisse",
        description: "Fais un seul cycle bras + jambes complet, puis flotte 3 secondes bras tendus devant. Recommence. Ce drill sépare l'effort de la récupération.",
        distance: "4×25m",
        tip: "Les pouces vers le bas pendant la glisse. Les mains à plat, pas inclinées.",
      },
    ],
  },

  {
    id: "d05",
    problem: "Je n'ai pas de coordination en papillon",
    stroke: "papillon",
    drills: [
      {
        name: "Ondulation corps entier sans bras",
        description: "Pousse au mur, bras le long du corps. Ondule de la tête aux pieds jusqu'à l'autre bout. Aucun mouvement de bras. Tout vient du sternum qui plonge, des hanches qui suivent.",
        distance: "10 répétitions",
        tip: "Tu dois avancer sans les bras. Si tu stagnes, l'ondulation vient des hanches et pas du corps entier.",
      },
      {
        name: "Papillon un bras",
        description: "Un bras sort, l'autre reste tendu devant. Nage 25m avec le bras droit, 25m avec le gauche. Ce drill réduit la charge et permet de se concentrer sur l'ondulation et le timing.",
        distance: "4×50m",
        tip: "Le bras qui reste devant ne doit pas tirer pendant que l'autre travaille.",
      },
      {
        name: "2 cycles papillon + 1 cycle crawl",
        description: "Alterne 2 cycles papillon complets puis 1 cycle crawl. Le crawl sert de récupération active et maintient l'ondulation du corps.",
        distance: "4×50m",
        tip: "La transition papillon → crawl doit être fluide. Ne t'arrête pas entre les deux.",
      },
    ],
  },

  {
    id: "d06",
    problem: "Je suis essoufflé trop vite",
    stroke: "crawl",
    drills: [
      {
        name: "Nage hyper-lente",
        description: "Nage aussi lentement que possible sur 50m — sans t'arrêter. Le but n'est pas la vitesse, c'est d'apprendre à gérer ton effort. Beaucoup de nageurs s'essoufflent simplement parce qu'ils partent trop vite.",
        distance: "4×50m avec longues pauses",
        tip: "Si tu finis la longueur sans avoir besoin de souffler, c'est que tu vas trop vite dans tes séances habituelles.",
      },
      {
        name: "Intervalles courts avec récupération complète",
        description: "10×25m sprints avec 1 minute de récupération entre chaque. La récupération complète apprend au corps à récupérer vite et entraîne le système cardiovasculaire sans accumulation de fatigue.",
        distance: "10×25m",
        tip: "La récupération commence quand tu n'es plus essoufflé. Ne démarre pas avant.",
      },
    ],
  },

  {
    id: "d07",
    problem: "Mon virage est trop lent",
    stroke: "crawl",
    drills: [
      {
        name: "Comptage des coups depuis les drapeaux",
        description: "Les drapeaux des 5m signalent l'approche du mur. Compte ton nombre de coups habituel entre les drapeaux et le mur — toujours le même. Ça standardise l'approche et évite les surprises.",
        distance: "10 virages seuls",
        tip: "Note ton nombre (souvent 3-4 coups). Ce nombre devient ton repère permanent.",
      },
      {
        name: "Culbute statique",
        description: "Dans la zone peu profonde, fais des culbutes sans nager. Focus sur la rotation rapide, les pieds qui placent sur le mur, la poussée puissante. Répète jusqu'à ce que le mouvement soit automatique.",
        distance: "20 répétitions",
        tip: "La culbute doit se faire en moins d'une seconde. Si c'est plus lent, tu manques de rotation abdominale.",
      },
      {
        name: "Dive + virage + 15m",
        description: "Plonge depuis le bord, nage jusqu'au mur, fais le virage, nage 15m. Répète. Cet exercice met le virage en contexte réel sans la fatigue d'une longue séance.",
        distance: "8 répétitions",
        tip: "Pousse fort sur le mur. Une poussée faible neutralise tous tes gains en rotation.",
      },
    ],
  },

  {
    id: "d08",
    problem: "Je manque de propulsion en brasse",
    stroke: "brasse",
    drills: [
      {
        name: "Pull buoy + bras brasse",
        description: "Pull buoy entre les jambes — les jambes sont passives. Travaille uniquement les bras en brasse. Sens l'appui de tes mains sur l'eau et la poussée générée par chaque cycle.",
        distance: "4×50m",
        equipment: "Pull buoy",
        tip: "Les coudes doivent rester hauts pendant le pull. Si les coudes descendent sous les poignets, tu perds toute la propulsion.",
      },
      {
        name: "Jambes brasse avec accélération",
        description: "Planche devant, jambes brasse. Sur chaque poussée, accélère les pieds dans la dernière phase (le snap). La vitesse des pieds en fin de mouvement double la propulsion.",
        distance: "6×50m",
        equipment: "Planche",
        tip: "L'accélération vient de la cheville qui se referme vite. Ce n'est pas un mouvement lent et continu.",
      },
    ],
  },
]
