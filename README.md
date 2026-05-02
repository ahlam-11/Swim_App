# SwimGen — Générateur de séances de natation

Générateur d'entraînements de natation personnalisés avec export vers montres connectées (Garmin, COROS) et support d'impression PDF.

---

## Présentation

SwimGen permet de créer des séances structurées en fonction du niveau de l'utilisateur, de ses objectifs techniques et du temps dont il dispose. Initialement conçu pour un usage local, le projet intègre désormais une gestion de comptes utilisateurs pour la persistance des données et un module d'export pour l'entraînement physique hors ligne.

---

## Nouvelles Fonctionnalités

### Gestion des comptes (Authentification & Cloud)

L'application ne repose plus uniquement sur le stockage local. L'intégration d'un backend permet :

- La création de profils utilisateurs sécurisés.
- La synchronisation de l'historique des séances sur plusieurs appareils.
- La sauvegarde des séances favorites et des statistiques de progression à long terme.

### Export PDF

Un module d'exportation a été ajouté pour permettre l'impression des séances :

- Mise en page optimisée pour la lecture au bord du bassin.
- Détail des séries, des temps de repos et des consignes techniques.
- Format sobre pour limiter la consommation d'encre.

---

## Stack Technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 16 + TypeScript |
| Style | Tailwind CSS v4 |
| État | Zustand |
| IA | Claude API (Anthropic) |
| Backend & Auth | Supabase (recommandé) ou Firebase |
| Génération PDF | jsPDF / react-pdf |
| Exports Montres | fit-file-writer (format `.fit`) |

---

## Structure du Projet

```
src/
├── components/
│   ├── auth/           # Login, Inscription, Protection des routes
│   ├── generator/      # Formulaire et logique de création
│   ├── export/         # Logique d'export PDF et Garmin/COROS
│   └── ui/             # Composants réutilisables
├── pages/
│   ├── Auth.tsx        # Interface de connexion
│   ├── Dashboard.tsx   # Statistiques et profil utilisateur
│   └── ...
├── services/
│   ├── database.ts     # Interactions avec la base de données (Supabase/Firebase)
│   ├── pdfGenerator.ts # Logique de mise en forme du document PDF
│   └── claude.ts       # Appels API Anthropic
├── store/
│   └── useUserStore.ts # État de la session utilisateur
└── types/
    └── index.ts        # Interfaces TypeScript
```

---

## Installation

**1. Cloner le dépôt**

```bash
git clone https://github.com/ahlam-11/swimgen.git
cd swimgen
```

**2. Installer les dépendances**

```bash
npm install
```

**3. Configurer l'environnement**

Créer un fichier `.env` à la racine :

```env
VITE_ANTHROPIC_API_KEY=votre_cle_api
VITE_SUPABASE_URL=votre_url_projet
VITE_SUPABASE_ANON_KEY=votre_cle_publique
```

**4. Lancer**

```bash
npm run dev
```

---

## Flux de données

1. L'utilisateur s'authentifie.
2. Le formulaire envoie les paramètres à l'API Claude.
3. La séance générée est affichée et automatiquement enregistrée dans la base de données.
4. L'utilisateur exporte la séance vers sa montre ou génère un PDF pour impression.

---

## Licence

MIT — Libre d'utilisation et de modification.
