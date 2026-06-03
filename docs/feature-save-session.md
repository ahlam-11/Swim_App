# Feature : Sauvegarde et validation d'une séance

## Vue d'ensemble

Cette fonctionnalité permet à un utilisateur connecté de :

1. **Sauvegarder** une séance générée dans la base de données
2. **Déclarer l'avoir nagée** en renseignant la durée et la distance réelles

Ces deux actions alimentent le tableau de bord (statistiques, historique).

---

## Flux utilisateur

```
/generate
    │
    ├─ [Générer ma séance]
    │       └─ generateMockSession() → session (en mémoire, côté client)
    │
    ├─ [Sauvegarder]
    │       └─ POST /api/sessions
    │               └─ TrainingSession + TrainingSet[] créés en BDD
    │               └─ → savedSessionId stocké dans le state React
    │
    └─ [J'ai nagé cette séance]
            └─ formulaire : durée réelle (min) + distance réelle (m)
            └─ POST /api/sessions/:id/complete
                    └─ CompletedLog créé en BDD
                    └─ → alimente /dashboard et /history
```

---

## API Routes

### `POST /api/sessions`

**Fichier :** `app/api/sessions/route.ts`

Crée une séance et ses blocs dans la base de données.

**Auth requise :** oui (`session.user.id` via NextAuth)

**Corps JSON attendu :**

```ts
{
  title:             string        // "Endurance Crawl — 1h00"
  subtitle:          string        // sous-titre descriptif
  level:             "debutant" | "intermediaire" | "avance"
  stroke:            "crawl" | "dos" | "brasse" | "papillon" | "4nages"
  goal:              "endurance" | "technique" | "vitesse" | "recuperation"
  totalDistance:     number        // mètres
  estimatedDuration: number        // minutes
  poolLength:        25 | 50
  sets: Array<{
    phase:       "warmup" | "drills" | "main" | "cooldown"
    label:       string
    repetitions: number
    distance:    number
    stroke:      string
    restSeconds: number
    intensity:   "easy" | "moderate" | "hard" | "sprint"
    equipment?:  string
    note?:       string
  }>
}
```

**Mapping nage :** `"4nages"` (UI) → `"four_nages"` (enum Prisma).
`"4nages"` n'est pas un identifiant SQL valide, d'où ce mapping dans la route.

**Réponse 201 :**
```json
{ "id": "clxyz..." }
```

---

### `POST /api/sessions/:id/complete`

**Fichier :** `app/api/sessions/[id]/complete/route.ts`

Enregistre qu'une séance sauvegardée a été nagée.

**Auth requise :** oui. La route vérifie que la séance appartient à l'utilisateur courant avant d'écrire.

**Corps JSON attendu :**

```ts
{
  actualDuration: number   // minutes réelles
  actualDistance: number   // mètres réels
}
```

**Réponse 201 :**
```json
{ "id": "clxyz..." }   // id du CompletedLog créé
```

---

## Modèles Prisma impliqués

### `TrainingSession`

Représente une séance (générée ou prête-à-l'emploi) sauvegardée par un utilisateur.

| Champ               | Type     | Description                        |
|---------------------|----------|------------------------------------|
| `id`                | String   | CUID généré automatiquement        |
| `userId`            | String   | Propriétaire (FK → User)           |
| `title`             | String   |                                    |
| `subtitle`          | String?  |                                    |
| `level`             | Level    | enum                               |
| `stroke`            | Stroke   | enum (`four_nages` pour 4 nages)   |
| `goal`              | Goal     | enum                               |
| `totalDistance`     | Int      | mètres                             |
| `estimatedDuration` | Int      | minutes                            |
| `poolLength`        | Int      | 25 ou 50                           |
| `source`            | String   | `"generated"` ou `"ready"`         |
| `createdAt`         | DateTime |                                    |

### `TrainingSet`

Un bloc dans une séance (échauffement, série principale, etc.).

| Champ         | Type      | Description                        |
|---------------|-----------|------------------------------------|
| `sessionId`   | String    | FK → TrainingSession               |
| `order`       | Int       | Position dans la séance            |
| `phase`       | Phase     | enum (`warmup`, `drills`, `main`, `cooldown`) |
| `repetitions` | Int       |                                    |
| `distance`    | Int       | mètres par répétition              |
| `stroke`      | String    | stocké en string (pas d'enum ici)  |
| `restSeconds` | Int       |                                    |
| `intensity`   | Intensity | enum                               |
| `equipment`   | String?   |                                    |
| `note`        | String?   |                                    |

> `stroke` dans `TrainingSet` est un `String` et non un enum Prisma, car les blocs peuvent
> mentionner des variantes libres ("crawl facile", "dos kick", etc.).

### `CompletedLog`

Une entrée par séance réellement nagée. C'est cette table qui alimente le dashboard et l'historique.

| Champ            | Type         | Description                          |
|------------------|--------------|--------------------------------------|
| `userId`         | String       | FK → User                            |
| `sessionId`      | String       | FK → TrainingSession                 |
| `completedAt`    | DateTime     | horodatage automatique               |
| `actualDuration` | Int          | minutes réelles                      |
| `actualDistance` | Int          | mètres réels                         |
| `notes`          | String?      | commentaire libre (non implémenté UI)|
| `exportTarget`   | ExportTarget?| `garmin`, `coros`, `pdf`             |
| `exportedAt`     | DateTime?    |                                      |

---

## State React — `GeneratePage`

| State              | Type             | Rôle                                               |
|--------------------|------------------|----------------------------------------------------|
| `session`          | `TrainingSession \| null` | séance générée, en mémoire uniquement jusqu'à la sauvegarde |
| `savedSessionId`   | `string \| null` | id BDD après `POST /api/sessions`                 |
| `saveLoading`      | `boolean`        | spinner bouton Sauvegarder                        |
| `saveError`        | `string \| null` | message d'erreur sauvegarde                       |
| `showCompleteForm` | `boolean`        | affiche/masque le formulaire durée+distance        |
| `actualDuration`   | `string`         | input durée réelle (converti en Number à l'envoi) |
| `actualDistance`   | `string`         | input distance réelle                             |
| `completeLoading`  | `boolean`        | spinner bouton Confirmer                          |
| `completeSuccess`  | `boolean`        | affiche la bannière verte de succès               |

**Règle :** Générer une nouvelle séance (`handleGenerate`) réinitialise tous ces states — la séance en mémoire est une ardoise vierge, sans lien avec la précédente.

---

## Ce que cette feature alimente

| Destination       | Via                                           |
|-------------------|-----------------------------------------------|
| `/dashboard`      | `getDashboardStats(userId)` lit `CompletedLog`|
| `/history`        | liste les `CompletedLog` avec leur session     |
| Statistiques      | distance par nage, par mois, streak            |

---

## Ce qui n'est pas encore implémenté

- **`/history`** : affiche encore des données mock, pas les vrais `CompletedLog`
- **Export PDF / FIT** : bouton "Exporter vers ma montre" non fonctionnel
- **Notes** : champ `notes` du `CompletedLog` non exposé dans l'UI
- **Calendrier** : `ScheduledSession` existe en BDD mais pas d'interface
