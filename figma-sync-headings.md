# Figma sync — Hiérarchie headings (2026-04-20)

Le code et `design.md` ont été mis à jour pour la nouvelle hiérarchie H1/H2/H3.
Côté **Figma**, il faut répercuter les changements suivants sur la page `_System` et toutes les instances du `_DJ` page.

## Règle canonique

| Heading | Token couleur | Hex | Usage |
|---------|---------------|-----|-------|
| **H1** (52px) | `Brand/00` | `#FAFBF9` | Nom de l'artiste (hero) uniquement |
| **H2** (44-48px) | `Brand/30` | `#DEE4DA` | Titres de section (NEXT GIGS, REVIEWS, DEMOS, TIMELINE, LIVE…) |
| **H3** (32px) | `Brand/50` | `#C9D3C0` | Titres de cards (review, demo, timeline) et titres modaux (CONTACT MOMO, SEND A REQUEST, BOOKING REQUEST JUST SENT!) |
| H4 (28px) | `Brand/30` | `#DEE4DA` | Venue names sur Event Cards (inchangé) |
| H5 (20px) | `Brand/50` | `#C9D3C0` | Labels REQUESTS dans overlays admin (inchangé) |

## Instances à repeindre dans Figma

### H1 → `Brand/00`
- `Home • DJ • Mobile` (1:137) — text "MOMO AUX PLATINES" dans le bloc Intro
- `Home • DJ • Tablet` (50:386) — idem
- `Home • DJ • Desktop` (50:678) — idem
- `Home • DJ • Live • Mobile` (185:6264) — idem
- `Home • DJ • Live • Tablet` (198:6759) — idem
- `Home • DJ • Live • Desktop` (198:7046) — idem

### H2 → `Brand/30`
- Tous les frames Home • DJ • * — titres `NEXT GIGS`, `REVIEWS`, `DEMOS`, `TIMELINE`
- Home • DJ • Live • * — titre `LIVE` au-dessus de la Live Event Card (si c'est un H2 de section ; si c'est intentionnellement un H4 `Brand/50`, ne pas toucher)
- Admin frames (page `_Admin`, non auditée ici) — `LIVE`, `INTRO`, `NEXT GIGS`, `REVIEWS`, `DEMOS`, `TIMELINE` : déjà mis à Brand/30 dans `admin/index.html`, à aligner en Figma

### H3 → `Brand/50`
- Review cards — noms `SIMONE`, `TMO`, `JESSIE`, `ANTOINE` (actuellement Brand/30 dans Figma, à descendre)
- Demo cards — titres `LE BON GROOVE`, `JAZZY HOUSE`, `CHILL`, `SUNDAY BRUNCH`
- Timeline cards — noms `BUVETTE CHEZ SIMONE`, `LES YEUX BLEUS`, `TWITCH`, `DEMAIN C'EST LOIN`
- Modal `Contact • Form` (425:2853) — titre `CONTACT MOMO` (déjà Brand/50 selon doc, valider)
- Modal `Contact • Confirmation` (425:2906) — titre `BOOKING REQUEST JUST SENT!` (déjà Brand/50)
- Overlay `Live • Form Default/Filled/Submitted` (164:6192 / 164:5856 / 164:5843) — titre `SEND A REQUEST` (déjà Brand/50)

## Si Figma Tokens (plugin) est utilisé

Cherche les styles de texte `H1`, `H2`, `H3` dans la page `_System` et remplace le fill color token :

```
H1 → color/brand/00
H2 → color/brand/30
H3 → color/brand/50
```

Si les titres Figma utilisent une fill hardcodée (pas un style), il faut les convertir en styles avant de lier le token — sinon chaque instance devra être repeinte individuellement.

## Impact visuel attendu

- Le nom "MOMO AUX PLATINES" devient franchement blanc → hero plus dominant
- Les titres de section (NEXT GIGS, REVIEWS…) deviennent légèrement plus lumineux que les titres de card → stepdown clair H1 > H2 > H3
- Les card names (SIMONE, LE BON GROOVE…) s'assombrissent un peu (Brand/30 → Brand/50) → deviennent contextuels, laissant la photo et le contenu prendre le lead

## Fichiers touchés côté code

- `index.html` : `.intro-name`, `.next-events-heading`, `.section-heading`, `.review-name`
- `admin/index.html` : `.section-heading`
- `design.md` : table Typography (ajout colonne couleur par défaut), section Heading color hierarchy, références dans chaque section qui mentionne un H1/H2/H3

`request.html` et `demandespeciale.html` n'ont pas requis de changement (les headings déjà à Brand/50 = cohérent avec la nouvelle règle H3).
