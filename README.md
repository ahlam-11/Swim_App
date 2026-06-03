# Swim — Générateur de séances de natation

> Swim génère des séances de natation personnalisées et les exporte vers ta montre connectée (COROS `.fit`, Garmin `.tcx`) ou en PDF imprimable.

---

## Démo en ligne

**URL** : [https://swim-app.vercel.app](https://swim-app.vercel.app) *(mettre à jour avec l'URL Vercel exacte)*

**Compte démo** :
| Email | Mot de passe |
|-------|-------------|
| `demo@demo.local` | `Demo1234!swim` |

---

## Captures d'écran

> *(Ajouter 2-3 captures d'écran : landing, page generate, export modal)*

---

## Spécifications fonctionnelles

### Pitch

Les nageurs qui s'entraînent seuls ne savent généralement pas comment structurer une séance équilibrée (échauffement, travail technique, principal, retour au calme). Swim génère automatiquement des séances adaptées au niveau, à la nage et aux objectifs de l'utilisateur, et les exporte directement vers les montres connectées du marché (COROS, Garmin) ou en PDF imprimable pour le bord du bassin.

### Personae cibles

1. **Le nageur loisir** : 2-3 séances/semaine, débutant à intermédiaire, veut des séances prêtes à nager sans réfléchir à la structure.
2. **Le nageur compétiteur** : s'entraîne régulièrement, veut ses séances sur sa montre COROS/Garmin et suivre ses statistiques de progression.
3. **L'étudiant sportif** : cherche à varier ses séances et à corriger ses défauts techniques grâce à des ressources ciblées (vidéos, exercices).

### MVP — Cas d'usage couverts

1. En tant que nageur, je veux créer un compte (email/mot de passe ou Google) afin de sauvegarder mes données de façon persistante.
2. En tant que nageur, je veux générer une séance en choisissant mon niveau, ma nage, mon objectif et la durée souhaitée afin d'obtenir un programme structuré immédiatement.
3. En tant que nageur, je veux utiliser les options avancées (focus technique, intensité 1-5, activer/désactiver l'échauffement et le retour au calme) afin de personnaliser la séance au jour.
4. En tant que nageur, je veux donner un titre personnalisé à ma séance avant de la sauvegarder afin de la retrouver facilement dans mon historique.
5. En tant que nageur avec une montre COROS, je veux exporter ma séance en fichier `.fit` natif afin de l'importer dans COROS Training Hub et la retrouver synchronisée sur ma montre.
6. En tant que nageur avec une montre Garmin, je veux exporter ma séance en fichier `.tcx` afin de l'importer dans Garmin Connect.
7. En tant que nageur, je veux exporter ma séance en PDF imprimable afin de la consulter au bord du bassin sans téléphone.
8. En tant que nageur, je veux consulter mon historique de séances sauvegardées afin de garder une trace de mon travail.
9. En tant que nageur, je veux consulter une bibliothèque de vidéos techniques et d'exercices ciblés afin de corriger mes défauts de nage.
10. En tant que nageur, je veux voir un tableau de bord avec mes statistiques (distance totale, streak hebdomadaire, nage favorite) afin de mesurer mes progrès.

### Out of scope

- **Coaching en temps réel** : la génération IA produit la séance à la demande mais ne s'adapte pas en cours de nage.
- **Planification calendrier** : le modèle `ScheduledSession` existe en base mais l'interface n'est pas connectée.
- **Partage de séances** : les séances sont privées par utilisateur, pas de partage public.
- **Application mobile native** : site web responsive uniquement, pas d'app iOS/Android.
- **Connexion Bluetooth** : pas de feedback live pendant la nage, pas de connexion temps réel avec la montre.

### Parcours utilisateur principal

1. Arrivée sur la landing page (`/`) — présentation du service avec exemples de séances
2. Clic sur "Commencer" → page connexion/inscription (`/login`)
3. Inscription (email + mot de passe) **ou** connexion Google OAuth
4. Redirection automatique vers le tableau de bord (`/dashboard`) — statistiques et séances récentes
5. Navigation vers Générer (`/generate`)
6. Sélection : niveau, nage (crawl/dos/brasse/papillon/4 nages), objectif, durée (30-90 min)
7. Options avancées : focus technique (Bras/Jambes/Respiration/Virage), intensité curseur 1-5, toggles échauffement/retour au calme
8. Clic "Générer" → aperçu de la séance avec détail des séries, distances et temps de repos
9. Renommage du titre via l'icône stylo (édition inline)
10. Clic "Sauvegarder" → séance enregistrée en base, bouton export débloqué
11. Clic "Exporter" → choix PDF / COROS (`.fit`) / Garmin (`.tcx`) avec guide d'import COROS intégré
12. Navigation vers Historique (`/history`) → onglet "Mes séances" (DB) + "Bibliothèque" (séances statiques)

---

## Architecture

```mermaid
graph TD
    A["🌐 Navigateur<br/>(React / Next.js client)"] -->|"HTTPS"| B["⚡ Next.js 16 App Router<br/>(Vercel Edge + Node.js)"]
    B -->|"SQL via Prisma 7<br/>(@neondatabase/serverless)"| C[("🐘 Neon PostgreSQL<br/>(serverless)")]
    A -->|"OAuth 2.0 redirect"| D["🔑 Google Identity"]
    D -->|"callback JWT"| B
    B -->|"Cookie HttpOnly<br/>(session JWT)"| A
    A -->|"génération client-side<br/>(dynamic import)"| E["📄 PDF .pdf<br/>(jsPDF)"]
    A -->|"génération client-side<br/>(fitService.ts)"| F["⌚ FIT .fit binaire<br/>(COROS / Garmin)"]
    A -->|"génération client-side<br/>(buildTCX)"| G["📡 TCX .tcx XML<br/>(Garmin Connect)"]
```

### Justifications des choix techniques

**Next.js 16 App Router** plutôt qu'Express + React SPA : la colocation des routes API avec les pages (App Router) évite un backend séparé, les Server Components permettent d'interroger Prisma sans JavaScript côté client (ex : dashboard), et le déploiement Vercel est zéro configuration. L'inconvénient accepté : les frontières `"use client"` demandent de la rigueur pour éviter des bundles trop lourds.

**Prisma 7** plutôt que Drizzle ou TypeORM : le schema déclaratif (`schema.prisma`), l'autocomplétion TypeScript et les migrations réversibles offrent la meilleure DX pour un projet TypeScript strict. L'inconvénient : le client généré est volumineux — il nécessite l'adaptateur `@prisma/adapter-neon` pour fonctionner sur l'Edge runtime de Vercel.

**Neon PostgreSQL** plutôt que Supabase : Neon propose un PostgreSQL standard (100 % compatible Prisma) avec un tier gratuit généreux et une mise à l'échelle à zéro. Supabase aurait fourni du realtime et du storage en bonus, mais ajoute de la complexité inutile pour ce MVP. Inconvénient : cold start de 500-1000 ms si la connexion est inactive.

**NextAuth v5** plutôt qu'une auth maison : gestion des cookies HttpOnly, signature JWT, et flows OAuth complets (Google + Credentials) sans code boilerplate. L'inconvénient : la v5 est encore en beta — l'API change parfois entre mineures, et l'invalidation de session côté serveur demande du travail supplémentaire.

**FIT binaire from scratch** plutôt qu'une bibliothèque : aucune bibliothèque npm n'implémente les *workout messages* FIT de façon complète et maintenue pour JavaScript. J'ai implémenté le générateur dans `app/lib/services/fitService.ts` (CRC-16, messages de définition/données, encodage little-endian, enums FIT 21.32). Inconvénient : la maintenance est à ma charge si le profil FIT évolue.

**TailwindCSS 3** plutôt que CSS Modules ou styled-components : utilitaires inline = pas de context-switch fichier CSS, intégration native avec Next.js. Inconvénient accepté : les classes longues dans le JSX nuisent à la lisibilité — partiellement compensé par des CSS variables pour les tokens de design.

> Modèle de données détaillé (ERD + description des colonnes) : [docs/DB.md](docs/DB.md)

### Limites connues

- **Pas de rate limiting** : `/api/auth/register` et la route NextAuth `/api/auth/signin` ne sont pas protégées contre le brute force.
- **Pas de pagination** : `GET /api/sessions` renvoie toutes les séances sans pagination. Au-delà de quelques centaines, les performances se dégraderont.
- **Dashboard basé sur CompletedLog** : les stats du tableau de bord sont calculées depuis les séances *marquées comme complétées*, pas depuis les séances sauvegardées — un utilisateur qui ne marque pas ses séances ne voit pas de statistiques.
- **Générateur algorithmique** : les séances suivent des règles fixes de distribution (20 % échauffement, 60 % principal, 20 % RC) — pas d'IA, pas d'adaptation dynamique à l'historique de l'utilisateur.
- **Calendrier non connecté** : le modèle `ScheduledSession` existe en base mais l'interface de planification n'a pas été implémentée.

---

## Stack

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | Next.js App Router | 16.2.4 |
| Langage | TypeScript | 5.x |
| Style | Tailwind CSS | 3.4 |
| ORM | Prisma | 7.8 |
| Base de données | PostgreSQL (Neon serverless) | — |
| Authentification | NextAuth v5 | 5.0.0-beta.31 |
| Export PDF | jsPDF + jspdf-autotable | 4.2 / 5.0 |
| Icônes | Lucide React | 1.14 |
| Déploiement | Vercel | — |

---

## Lancer en local

### Prérequis

- **Node.js** ≥ 20
- **npm** ≥ 10
- Une base PostgreSQL (ou un compte [Neon](https://neon.tech) gratuit — tier free suffisant)
- Un projet OAuth Google (optionnel — pour activer la connexion Google)

### Étapes

**1. Cloner le dépôt**
```bash
git clone https://github.com/ahlam-11/swimgen.git
cd swimgen
```

**2. Installer les dépendances**
```bash
npm install
```

**3. Variables d'environnement**
```bash
cp .env.example .env
# Ouvre .env et remplis DATABASE_URL et AUTH_SECRET au minimum
```

**4. Appliquer les migrations**
```bash
npx prisma migrate deploy
```

**5. Peupler la base de données (données de démo)**
```bash
npm run seed
```

**6. Lancer le serveur de développement**
```bash
npm run dev
```

**7.** L'app est disponible sur [http://localhost:3000](http://localhost:3000)

Connexion avec le compte démo : `demo@demo.local` / `Demo1234!`

---

## Variables d'environnement

Copie `.env.example` en `.env` et remplis les valeurs.

| Variable | Rôle | Exemple | Requise |
|----------|------|---------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require` | **Oui** |
| `AUTH_SECRET` | Clé secrète NextAuth pour signer les JWT — génère avec `openssl rand -base64 32` | `Abc123...` | **Oui** |
| `GOOGLE_CLIENT_ID` | ID client OAuth Google | `123456.apps.googleusercontent.com` | Non* |
| `GOOGLE_CLIENT_SECRET` | Secret OAuth Google | `GOCSPX-...` | Non* |
| `ANTHROPIC_API_KEY` | Clé API Claude pour la génération IA des séances | `sk-ant-...` | Non** |

*Si absent, le bouton "Connexion Google" ne fonctionnera pas mais l'auth par email reste opérationnelle.  
**Si absent, le générateur algorithmique prend le relais automatiquement — l'app reste 100 % fonctionnelle.

**Secrets GitHub Actions** (à ajouter dans *Settings → Secrets and variables → Actions*) :

| Secret | Rôle | Où le trouver |
|--------|------|---------------|
| `VERCEL_TOKEN` | Token d'accès Vercel pour le CD | vercel.com → Account Settings → Tokens |
| `VERCEL_ORG_ID` | ID de l'équipe/compte Vercel | `vercel env pull` ou `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | ID du projet Vercel | `.vercel/project.json` après `vercel link` |

Les 4 secrets d'app (`DATABASE_URL`, `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) doivent aussi être renseignés dans les secrets GitHub pour que le job **Build** de la CI passe.

**Créer les credentials Google OAuth :**
1. [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
2. Créer un ID client OAuth 2.0 (application web)
3. Redirect URI dev : `http://localhost:3000/api/auth/callback/google`
4. Redirect URI prod : `https://ton-domaine.vercel.app/api/auth/callback/google`

---

## Tests

```bash
npm test            # 26 tests unitaires Vitest (passe en ~500ms)
npm run test:watch  # mode watch pour le développement
npx tsc --noEmit    # vérification TypeScript
npm run lint        # ESLint
npm run build       # build de production complet
```

Voir aussi la documentation complémentaire :
- [docs/API.md](docs/API.md) — référence complète des endpoints REST
- [docs/DB.md](docs/DB.md) — modèle de données (ERD + colonnes)

---

## Choix techniques

Voir la section [Architecture](#architecture) ci-dessus pour les justifications détaillées par technologie.

---

## Licence

MIT — Libre d'utilisation et de modification.
