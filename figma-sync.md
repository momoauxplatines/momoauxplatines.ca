# Figma Sync

## Procédure

**Pour ajouter un écran prêt à coder :**
1. Marquer le frame "Ready for dev" dans Figma (Dev Mode)
2. Changer le statut ici de `draft` → `ready`
3. Dire à Claude "scan figma-sync" — il lit les nodes `ready`, code, et passe à `live`

**Statuts :**
| Statut | Signification |
|--------|--------------|
| `draft` | Design en cours — Claude ignore |
| `ready` | Design finalisé — Claude implémente au prochain scan |
| `live`  | Implémenté et en sync — Claude vérifie les diffs |
| `skip`  | Exclu volontairement — Claude ignore indéfiniment |

---

## Fichier Figma

`https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines`

---

## live-event-public — request.html

| Statut  | Node ID  | Screen                                    | Dernière vérification |
|---------|----------|-------------------------------------------|-----------------------|
| `live`  | 857-4553 | Header (logo + event image)               | 2026-05-21            |
| `live`  | 839-2645 | Now playing footer                        | 2026-05-21            |
| `live`  | 857-2958 | Info tab                                  | 2026-05-21            |
| `live`  | 860-1252 | Battle — no battle                        | 2026-05-21            |
| `live`  | 857-2831 | Battle — in progress, default             | 2026-05-21            |
| `live`  | 857-2848 | Battle — in progress, choice made         | 2026-05-21            |
| `live`  | 857-4631 | Battle — submitted, ongoing               | 2026-05-21            |
| `live`  | 857-4713 | Battle — submitted, ended                 | 2026-05-21            |
| `live`  | 857-3089 | Played tab                                | 2026-05-21            |
| `live`  | 833-3422 | Song card                                 | 2026-05-21            |
| `live`  | 857-3179 | Requests — default                        | 2026-05-21            |
| `live`  | 857-3267 | Requests — input active                   | 2026-05-21            |
| `live`  | 857-3422 | Requests — input confirmed                | 2026-05-21            |
| `live`  | 857-4550 | Requests — submitted                      | 2026-05-21            |
| `live`  | 867-1266 | Message — default                         | 2026-05-21            |
| `live`  | 867-1314 | Message — submitted                       | 2026-05-21            |

---

## index.html — Home page

| Statut  | Node ID  | Screen                                    | Dernière vérification |
|---------|----------|-------------------------------------------|-----------------------|
| `live`  | —        | Event cards (live / next / past)          | 2026-05-21            |

---

## À venir (ajouter ici quand prêt)

| Statut  | Node ID  | Screen                                    | Dernière vérification |
|---------|----------|-------------------------------------------|-----------------------|
| `draft` | —        | —                                         | —                     |
