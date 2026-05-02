# SwimGen — Générateur de séances de natation

> Génère des entraînements de natation sur-mesure, exportables directement sur ta montre **Garmin** ou **COROS**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20TypeScript-0077cc)
![Status](https://img.shields.io/badge/status-En%20développement-f59e0b)

---

## À quoi ça sert ?

Progresser en natation seul, c'est compliqué. Les plans d'entraînement génériques ne s'adaptent pas à ton niveau, à la nage que tu veux travailler, ni au temps que tu as. Et les coachs, c'est cher.

**SwimGen résout ça en 3 étapes :**

1. Tu choisis ta nage, ton objectif et la durée disponible
2. L'app génère une séance structurée et adaptée à ton niveau
3. Tu l'exportes directement sur ta montre — et tu nages

---

## Fonctionnalités

### Cœur de l'app

| Fonctionnalité | Description |
|---|---|
| **Générateur de séances** | Séances personnalisées selon le niveau, la nage (crawl, dos, brasse, papillon), l'objectif (endurance, technique, vitesse, récupération) et la durée disponible |
| **Export Garmin & COROS** | Export de la séance en format workout structuré compatible avec Garmin Connect et l'app COROS — directement importable sur ta montre |
| **Bibliothèque éducative** | Apprends chaque nage pas à pas avec des vidéos YouTube sélectionnées et taguées par compétence : position, respiration, virage, départ, coordination |

### Pour progresser sur la durée

| Fonctionnalité | Description |
|---|---|
| **Séances prêtes à l'emploi** | Catalogue de séances pré-construites pour les débutants — aucune configuration requise, tu cliques et tu nages |
| **Suivi de progression** | Historique de tes séances, distances cumulées, nages travaillées et séances complétées au fil du temps |
| **Séances favorites** | Sauvegarde les séances qui t'ont plu pour les retrouver et les réexporter facilement |

### En bonus

- **Exercices ciblés par problème** — *"je coule les hanches en crawl"*, *"je n'arrive pas à respirer en brasse"* — des drills spécifiques pour corriger
- **Statistiques visuelles** — graphiques de progression, volume par nage, évolution dans le temps

---

## Interface

L'application est pensée **mobile-first** avec une navigation optimisée pour utiliser l'app au bord du bassin.

- **Mobile** : navigation par tab bar en bas d'écran
- **Desktop** : layout en 2 colonnes avec sidebar — formulaire de configuration à gauche, séance générée à droite
- **Design** : thème clair, palette de bleus, composants épurés

---

## Pages

```
/                  → Landing page — présentation du projet
/app/generate      → Générateur de séances — page principale
/app/library       → Bibliothèque de séances prêtes à l'emploi
/app/history       → Historique et progression
/app/learn         → Apprendre les nages (vidéos + guides)
/app/session/:id   → Détail d'une séance
```

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Style | Tailwind CSS v3 |
| Animations | Framer Motion |
| State | Zustand |
| Routing | React Router v6 |
| IA | Claude API (Anthropic) — génération des séances |
| Stockage | localStorage (pas de backend) |
| Icônes | Lucide React |

---

## Lancer le projet

```bash
# Cloner le repo
git clone https://github.com/ahlam-11/swimgen.git
cd swimgen

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Ajouter ta clé API Anthropic dans .env

# Lancer en développement
npm run dev
```

### Variables d'environnement

```env
VITE_ANTHROPIC_API_KEY=ta_clé_api_ici
```

---

## Structure du projet

```
src/
├── components/
│   ├── ui/             # Composants de base (Button, Card, Badge, Slider...)
│   ├── layout/         # Navbar, Sidebar, MobileNav
│   ├── generator/      # Formulaire + affichage de séance
│   └── session/        # Cards et timeline de séance
├── pages/              # Landing, Generate, Library, History, Learn
├── services/
│   ├── sessionGenerator.ts   # Appel API Claude
│   └── exportService.ts      # Export Garmin / COROS
├── store/
│   └── useAppStore.ts        # State global (Zustand)
└── types/
    └── index.ts              # Types TypeScript (SessionConfig, TrainingSession...)
```

---

## Comment fonctionne la génération

Le générateur envoie une requête à l'**API Anthropic** avec le profil de séance complet (niveau, nage, objectif, durée, équipement disponible, focus technique). Claude retourne un JSON structuré avec les séries détaillées, les temps de repos, les consignes techniques et les notes de coaching.

La séance générée est ensuite :
- Affichée sous forme de timeline interactive dans l'app
- Sauvegardable en local
- Exportable en format compatible Garmin Connect / COROS

---

## Export vers les montres

| Plateforme | Format | Import |
|---|---|---|
| **Garmin** | Workout structuré (.fit / JSON Garmin) | Via Garmin Connect Web ou l'app mobile |
| **COROS** | Format COROS Training Plan | Via l'app COROS |

---

## Bibliothèque éducative

Les 4 nages sont couvertes :

- **Crawl** — technique de base, respiration bilatérale, coordination bras/jambes
- **Dos crawlé** — position corps, rotation, virage culbute
- **Brasse** — traction, grenouille, timing glisse
- **Papillon** — ondulation, double traction, synchronisation

Chaque nage contient des vidéos taguées par niveau (Débutant / Technique / Drill / Compétition) et des exercices ciblés associés.

---

## Contexte

Projet développé dans le cadre d'un cursus en **cybersécurité** comme projet web passion. L'idée vient d'un vrai besoin : s'améliorer en natation sans coach, avec une montre connectée et l'envie de nager avec intention.

---

## Licence

MIT — libre d'utilisation, de modification et de distribution.