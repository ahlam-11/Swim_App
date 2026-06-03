# API Reference — Swim

Base URL : `/api`  
Authentification : cookie de session HttpOnly géré par NextAuth v5.  
Format des erreurs : `{ error: { code: string, message: string, details?: [...] } }`

---

## Authentification

### POST /api/auth/register
Crée un nouveau compte utilisateur.

**Auth requise** : Non

**Body**
```json
{
  "email":    "user@example.com",
  "password": "motdepasse8chars",
  "name":     "Alice",
  "level":    "debutant"
}
```

| Champ | Type | Contraintes |
|-------|------|-------------|
| `email` | string | Email valide, requis |
| `password` | string | 8-128 chars, requis |
| `name` | string | max 100 chars, optionnel |
| `level` | enum | `debutant` \| `intermediaire` \| `avance`, optionnel (défaut: `debutant`) |

**Réponses**
| Code | Corps | Description |
|------|-------|-------------|
| 201 | `{ ok: true }` | Compte créé |
| 409 | `{ error: { code: "EMAIL_TAKEN" } }` | Email déjà utilisé |
| 422 | `{ error: { code: "VALIDATION_ERROR", details: [...] } }` | Données invalides |
| 429 | `{ error: { code: "RATE_LIMITED" } }` | Trop de tentatives (5/15min/IP) |

---

### POST /api/auth/signin *(géré par NextAuth)*
Connexion credentials ou OAuth Google. Voir [NextAuth docs](https://authjs.dev).

---

## Séances d'entraînement

### POST /api/sessions
Sauvegarde une séance générée.

**Auth requise** : Oui

**Body**
```json
{
  "title":             "Ma séance crawl",
  "subtitle":          "Niveau intermédiaire",
  "level":             "intermediaire",
  "stroke":            "crawl",
  "goal":              "endurance",
  "totalDistance":     2000,
  "estimatedDuration": 60,
  "poolLength":        25,
  "sets": [
    {
      "phase":       "warmup",
      "label":       "Échauffement",
      "repetitions": 1,
      "distance":    400,
      "stroke":      "crawl",
      "restSeconds": 30,
      "intensity":   "easy",
      "note":        "Nage lente"
    }
  ]
}
```

**Réponses**
| Code | Corps | Description |
|------|-------|-------------|
| 201 | `{ id: "clxxx..." }` | Séance sauvegardée, retourne l'ID |
| 400 | `{ error: { code: "INVALID_STROKE" } }` | Nage invalide |
| 401 | `{ error: { code: "UNAUTHORIZED" } }` | Non connecté |
| 422 | `{ error: { code: "VALIDATION_ERROR", details: [...] } }` | Données invalides |

---

### GET /api/sessions
Liste les séances de l'utilisateur connecté, triées par date de création décroissante.

**Auth requise** : Oui

**Query params**
| Param | Type | Défaut | Description |
|-------|------|--------|-------------|
| `page` | integer ≥ 1 | 1 | Page courante |
| `limit` | integer 1-100 | 20 | Résultats par page |

**Exemple**
```
GET /api/sessions?page=1&limit=20
```

**Réponse 200**
```json
{
  "data": [ { "id": "...", "title": "...", "sets": [...], ... } ],
  "meta": { "total": 42, "page": 1, "limit": 20, "pages": 3 }
}
```

---

### PATCH /api/sessions/:id
Renomme une séance.

**Auth requise** : Oui (propriétaire uniquement)

**Body**
```json
{ "title": "Nouveau titre" }
```

**Réponses**
| Code | Corps | Description |
|------|-------|-------------|
| 200 | `{ id: "clxxx..." }` | Titre mis à jour |
| 401 | — | Non connecté |
| 404 | — | Séance introuvable ou appartient à un autre utilisateur |
| 422 | — | Titre invalide |

---

### DELETE /api/sessions/:id
Supprime une séance et tous ses sets (cascade).

**Auth requise** : Oui (propriétaire uniquement)

**Réponses**
| Code | Corps | Description |
|------|-------|-------------|
| 204 | *(vide)* | Supprimé |
| 401 | — | Non connecté |
| 404 | — | Introuvable |

---

### POST /api/sessions/:id/complete
Enregistre une séance comme complétée (alimente les stats du dashboard).

**Auth requise** : Oui (propriétaire uniquement)

**Body**
```json
{
  "actualDuration": 58,
  "actualDistance": 1950
}
```

**Réponses**
| Code | Corps | Description |
|------|-------|-------------|
| 201 | `{ id: "clxxx..." }` | Log créé |
| 401 / 404 / 422 | — | Voir schéma standard |

---

### POST /api/sessions/:id/log
Enregistre un export (Garmin, COROS, PDF) et optionnellement les métriques réelles.

**Auth requise** : Oui (propriétaire uniquement)

**Body**
```json
{
  "exportTarget":   "coros",
  "actualDuration": 60,
  "actualDistance": 2000
}
```

| Champ | Type | Valeurs | Requis |
|-------|------|---------|--------|
| `exportTarget` | enum | `garmin` \| `coros` \| `pdf` | Non |
| `actualDuration` | integer | minutes (1-480) | Non |
| `actualDistance` | integer | mètres (1-20000) | Non |

**Réponses**
| Code | Corps |
|------|-------|
| 201 | `{ id: "clxxx..." }` |
| 401 / 404 / 422 | Voir schéma standard |
