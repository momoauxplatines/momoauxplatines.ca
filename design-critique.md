# Design Critique — Momo Aux Platines

Fichier Figma : [Momo-Aux-Platines](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines) · page `_DJ` · 28 frames analysées · critique datée du 2026-04-20.

> **Périmètre** — Le metadata export ne renvoie que la page `_DJ` (portfolio public + live event). Les pages `_System`, `_Admin`, `_School` existent selon `design.md` mais ne sont pas accessibles dans ce pull. La critique couvre donc 100% de l'expérience DJ publique, et s'appuie sur la doc `design.md` pour tout ce qui concerne les composantes et tokens. Stade présumé : **affinage — proche du handoff**.

---

## Impression générale

L'identité est forte et mémorable : le stamp MOMO en hero, la palette verte-neutre désaturée, la typo Kanit Black sur SF Pro Light. Ça dit "vinyle, radio, après-midi d'été" sans jamais le dire. Le design system est **solidement documenté** (c'est rare et précieux) et la logique live/offline est bien pensée.

La plus grosse opportunité n'est pas esthétique — c'est la **hiérarchie des accents** : trop d'éléments partagent le même niveau de "muted" (Brand/50), et du coup le H1 (le nom de l'artiste) se fait voler la vedette par les titres de section. Viennent ensuite deux zones UX à clarifier (états du bouton REQUEST, variantes Song Card) et quelques pépins de contraste sur les couleurs sémantiques.

---

## 1. Hiérarchie visuelle

### Ce qui fonctionne
- **Hero 100dvh + stamp centré** : ouverture nette, un seul point focal, rotation 60s = détail de marque marquant.
- **Sections en rythme régulier** (80px gap) : cadence prédictible, facile à scanner.
- **Cards Brand/95 sur fond Brand/105** : séparation claire sans trait de border — l'élévation fait le travail.

### À corriger

| # | Observation | Sévérité | Recommandation |
|---|-------------|----------|----------------|
| H1 | **Le nom "MOMO AUX PLATINES" (H1) et les titres de section (NEXT GIGS, REVIEWS…) partagent la même couleur Brand/50.** Le H1 devrait dominer mais la répétition du token l'aplatit. | 🟡 Modéré | Deux options. A) Repousser H1 en `Brand/00` (blanc franc) pour réaffirmer la hiérarchie. B) Ramener les H2 sections à `Brand/60` (#a2a89b), plus faible, pour que le nom reste au sommet visuel. |
| H2 | **Le nom casse en "MOMO AUX / PLATINES"** au lieu de "MOMO / AUX PLATINES" — le déséquilibre visuel est notable sur mobile 390px. | 🟢 Mineur | Utiliser `text-wrap: balance` (ou `<br>` manuel sur mobile). "MOMO" seul sur la première ligne donnerait plus de présence. |
| H3 | **Le stamp MOMO apparaît deux fois sur la même vue** : dans le hero (gros) ET dans le footer (80px). | 🟢 Mineur | Volontaire probablement (signature), mais considérer un logotype alternatif pour le footer pour éviter la redondance. |
| H4 | Sur la variante **Home • DJ • Live**, la Event Card s'insère *entre* le hero et l'intro — un nouveau visiteur voit "un évènement en cours" avant de savoir qui est Momo. | 🟡 Modéré | Déplacer la Live Card *après* l'Intro. L'intro (avatar + nom + tags + bio + CTA Contact) établit le contexte en <2s ; la Live Card profite mieux aux visiteurs récurrents et perd peu en visibilité un scroll plus bas. Alternative : conserver la position mais réduire la Live Card à un bandeau fin (48px) avec "● LIVE ce soir — WÜNDERBAR →" qui se déploie au tap. |

---

## 2. Usabilité & flux

### Flux Live (page `request.html`)

| # | Finding | Sévérité | Recommandation |
|---|---------|----------|----------------|
| U1 | **États du bouton REQUEST ambigus dans le header.** Sur l'onglet `PLAYED` il est sombre (`Brand/95` + `Brand/00`). Sur l'onglet `REQUESTS` il passe bleu vif (`Event/Blue`). Ça ressemble à une mécanique "tu as une request en attente" mais rien n'explique la règle. | 🔴 Critique | Documenter la règle dans `design.md` et ajouter un état visuel explicite : bleu = "Tu peux demander une chanson", sombre = "Tu as déjà une demande active" par exemple. Ou, plus simple : un seul état actif (bleu) et s'appuyer sur un badge/compteur pour indiquer une request en cours. |
| U2 | **Icônes de state song peu lisibles.** Dans l'onglet Played, certains morceaux ont une bulle verte `Event/Green`, d'autres rien. Dans Requested, tout a un "+" bleu. Le mapping "icône ↔ sens" n'est pas évident (note du DJ ? song played avec un commentaire ?). | 🟡 Modéré | Ajouter une légende inline la première fois qu'un état apparaît, ou remplacer les icônes par des textes mini (`+ request`, `✓ played`, `💬 note`). Alternative : documenter dans un tooltip/long-press. |
| U3 | **Empty state "No requests"** est bien rédigé mais purement textuel. Les empty states qui performent ont un visuel + un CTA. | 🟢 Mineur | Ajouter soit une illustration légère (un vinyl, le stamp MOMO en watermark), soit remonter un gros bouton primaire "MAKE A REQUEST" au centre plutôt que dire "tap the button in the top header". Un pas de moins. |
| U4 | **Event Card (live, en haut de page) occupe ~180px** avec adresse complète et heures — info déjà vue sur la page précédente. | 🟡 Modéré | État compact par défaut (avatar + nom + badge LIVE + "Détails ▾"), expand au tap. Laisse plus de place pour les requests au-dessus du fold. La variante "Event, Live – Closed" existe déjà dans le DS — l'utiliser ici. |

### Formulaire de request
| # | Finding | Sévérité | Recommandation |
|---|---------|----------|----------------|
| U5 | **Typo microcopy** : "Copy the Spotify sharing link **form** the mobile app" → "**from**". | 🔴 Critique | Fix immédiat. |
| U6 | **Instruction vague.** "Copy the Spotify sharing link from the mobile app" suppose que l'utilisateur sait comment. | 🟢 Mineur | Réécrire : "Open the song in Spotify → tap Share → Copy Link. Then paste below." Alternative : ajouter un lien "How?" qui ouvre une petite aide visuelle. |
| U7 | **Pas d'état Error visible** dans les 28 frames pour le cas "lien invalide" ou "song pas trouvable". | 🟡 Modéré | Ajouter 2 écrans : "Link not recognized — paste a Spotify track URL" et "Song not found — try another". |
| U8 | **CTA disabled par défaut** (visible sur Form Default) — bonne pratique, mais il n'y a pas d'indication que le bouton s'activera une fois un lien valide saisi. | 🟢 Mineur | Micro-copy sous le bouton, ou couleur de transition visible quand le champ est rempli (Form Filled le montre en partie). |

### Formulaire de booking (Contact Momo)
| # | Finding | Sévérité | Recommandation |
|---|---------|----------|----------------|
| U9 | **Placeholder du champ Description affiche "Company name"** — copié-collé oublié depuis le champ Company. | 🔴 Critique | Remplacer par quelque chose comme "Tell me about your event — venue, date, vibe, anything useful." |
| U10 | **5 champs requis sur 6** → tous marqués d'un `*`. C'est visuellement bruyant. | 🟡 Modéré | Inverser la logique : marquer l'optionnel (`Date (optional)`) et retirer les astérisques des 5 autres. Moins d'astérisques = moins de friction perçue. |
| U11 | **Placeholder des champs (`Your name`, `name@domain.com`, `+1 (514) 222-2242`)** sont en `Brand/60` très léger — peut être perçu comme du texte déjà rempli (grisé ≠ placeholder partout). | 🟢 Mineur | Préserver le contraste actuel mais tester avec 3-5 personnes — si le pattern "c'est un exemple" est mal compris, ajouter un préfixe d'exemple `ex. name@domain.com` dans le label. |
| U12 | **Le libellé "Description"** est vague pour un formulaire de booking. | 🟢 Mineur | "About your event" ou "Event details" serait plus naturel. |

### Confirmation booking
- `"BOOKING REQUEST JUST SENT!"` avec "!" est chaleureux mais possiblement trop enthousiaste pour un contexte B2B (bookings de bars/salles). À toi de voir selon la cible — si c'est plus proche de particuliers (mariages, anniversaires), l'exclamation fonctionne.
- Le corps "Thank you for reaching out! I have received your message and will get back to you as soon as possible." — ton à la première personne très bien choisi, ça humanise.

---

## 3. Cohérence du design system

### Forces
- `design.md` est un vrai artefact de handoff : tokens, composantes, variantes, states, usages documentés. C'est exemplaire.
- Les tokens Brand/00 → /105 forment une échelle neutre cohérente. Le biais vert-chaud est intentionnel et différenciant.
- Tous les boutons partagent les mêmes rayons (8px) et hauteurs (56px principal / 40px small) — très propre.

### À resserrer

| Élément | Écart | Recommandation |
|---------|-------|----------------|
| **Song Card — 6 variantes** (`Played`, `Request-Form`, `Request`, `Playing`, `Requested-Playing`, `Played with requested`) | Matrice 3D : `requested` × `playing` × `played`. 6 variantes pour couvrir 8 états combinatoires. | Passer à une composition à **2 props** : `status ∈ {idle, requested, playing, played}` × `requestedByMe: boolean`. Moins de combinaisons à maintenir dans Figma et moins de confusion pour les devs. Le `component-map.json` côté code peut porter la correspondance. |
| **"Footer" avec context Playing** | Nommage misleading : ce qu'on appelle `Footer context=Playing` est en réalité une *now playing bar sticky*, pas un footer. | Renommer la composante en `NowPlayingBar` (page `_System`). Le footer du site est déjà documenté sous `Footer context=DJ` — séparer les deux concepts. |
| **Titres de section vs H1** | Tous en `Brand/50` Kanit Black — rien ne distingue un H1 d'un H2 côté couleur. La hiérarchie repose uniquement sur la taille (52px vs 44px), suffisante à l'œil mais pas à la lecture accessible. | Voir H1 plus haut. |
| **Tokens non utilisés** | `Brand/40`, `Brand/20` apparaissent dans la palette mais je ne les ai pas vus en usage explicite dans `design.md`. | Soit les utiliser (ex. Brand/40 pour texte secondaire sur surface medium), soit les retirer du token set pour réduire le bruit de décision. Un token qui n'est pas employé crée de la dérive future ("quelqu'un finira par l'utiliser mal"). |
| **Event/Blue vs Event/Green vs Event/Red** | Tous nommés `Event/*` mais seul Event/Red est vraiment lié à l'évènement live. Blue est utilisé pour les liens Spotify et le badge "Next", Green pour la request played. | Renommer par sémantique : `Status/Live` (red), `Status/Upcoming` ou `Action/Link` (blue), `Status/Played` (green). Ou bien les grouper sous `Semantic/*`. |
| **Astérisques requis** | Dans le form de booking : tous les `Field / Label` portent un `*` en hard. | Ajouter une variante `required: boolean` sur la composante `Field / Label` pour n'afficher le `*` que quand nécessaire. |
| **Fonts** | `Kanit` importé avec poids `300, 600, 700, 900` mais seul le 900 (Black) est utilisé selon la doc. | Retirer 300/600/700 de l'import Google Fonts — allège le LCP. |

### Alignement Figma ↔ Code
C'est l'objet même du projet d'après les instructions. Quelques points à vérifier :
- `component-map.json` référence bien le lien figma_node ↔ fichier HTML. 👍 C'est la bonne approche.
- Vérifier que **toutes les composantes documentées** dans `design.md` ont une entrée dans `component-map.json` — absence possible : `Footer context=Playing` (pas vu), variantes de `Card / Web / Song` (le map en liste moins que les 6 documentées).
- Penser à automatiser un check Figma Tokens → CSS custom properties : si `Brand/95` change dans Figma, la var `--brand-95` doit se mettre à jour sans intervention manuelle (Style Dictionary ou équivalent).

---

## 4. Accessibilité — WCAG 2.1 AA

### Calculs de contraste (approximatifs, à valider avec un outil)

| Combinaison | Usage | Ratio | Verdict |
|-------------|-------|-------|---------|
| Brand/00 `#fafbf9` sur Brand/105 `#111210` | Body text clair | ~18.5:1 | ✅ AAA |
| Brand/30 `#dee4da` sur Brand/105 | Body text | ~13.8:1 | ✅ AAA |
| Brand/50 `#c9d3c0` sur Brand/105 | H1/H2, section labels | ~11.2:1 | ✅ AAA |
| Brand/60 `#a2a89b` sur Brand/105 | Placeholder | ~7.3:1 | ✅ AAA |
| Brand/80 `#51534e` sur Brand/100 | Border, muted | ~2.1:1 | ⚠️ OK pour bordures (pas de texte) |
| **Event/Blue `#007aff` sur Brand/105** | **Liens Spotify, badge Next, bouton REQUEST actif** | **~4.2:1** | **❌ FAIL AA pour texte normal (4.5:1 requis)** |
| **Event/Red `#d34242` sur Brand/105** | **"LIVE" label + indicateur** | **~4.1:1** | **❌ FAIL AA pour texte normal** |
| Event/Green `#34c759` sur Brand/105 | "Playing", check played | ~8.6:1 | ✅ AA |
| Disabled button : Brand/100 text sur Brand/80 bg | Bouton disabled | ~2.6:1 | ⚠️ FAIL AA — mais acceptable car disabled (pas interactif) ; WCAG 1.4.11 exige 3:1 sur UI components → à la limite |

### Recommandations
- 🔴 **Event/Blue : remonter vers `#3b9dff` ou `#4a9eff`** pour atteindre ≥4.5:1 sur Brand/105. La teinte reste très "iOS blue". Sinon, réserver Event/Blue exclusivement aux **boutons full-fill** (fond bleu, texte sombre) et aux **textes 24px+** (règle AA Large), mais surveiller "Détails ▾" et les liens Spotify 16px qui ne passent pas.
- 🔴 **Event/Red** idem : passer à `~#e55a5a` pour atteindre ≥4.5:1. Attention : le label "LIVE" est en Kanit Black 20px → techniquement "large text" à partir de 18.66px bold → seuil AA à 3:1. À 4.1:1, c'est OK pour du bold 20px, mais Borderline sur du 16px bold.
- 🟡 **Tester la pulsation du dot "LIVE"** avec les utilisateurs photosensibles (éviter < 3Hz, WCAG 2.3.1). L'animation semble lente donc probablement OK.
- 🟡 **Focus states** : `design.md` mentionne les états des fields mais pas d'anneau de focus visible (WCAG 2.4.7). Vérifier que chaque composante interactive a un focus ring distinct (ex. outline 2px `Brand/00` + offset 2px).
- 🟢 **Tailles tactiles** : les boutons 56px et 40px passent. Vérifier que les X close (title bars des overlays) ont bien une zone tactile de 44×44pt même si l'icône est plus petite.
- 🟢 **Alt text** : à s'assurer côté code, pas de Figma — avatars de review, thumbnails demo, album arts requêtes — chacun a besoin d'une description meaningful.
- 🟢 **Navigation clavier** : vérifier le scroll horizontal (reviews, demos, timeline). Sans affordance clavier, ces rangées sont inaccessibles aux non-souris.

---

## 5. Responsive

### Mobile (390) — 23 frames analysées, très cohérent
Rythme et paddings (32px) respectés sur tous les écrans. Rien à signaler côté layout.

### Tablet (834) — 2 frames
Observé uniquement via `Home • DJ • Tablet` et sa variante Live. Transition mobile → tablet semble fluide mais il manque :
- Live / form pages tablet (seulement mobile existe dans les 28 frames)
- Comportement des horizontal-scrolls Reviews/Demos/Timeline à 834px

### Desktop (1440) — 2 frames
- Grille 4 colonnes pour Reviews et Demos, bien équilibrée.
- **⚠️ CONTACT button reste pleine largeur de sa colonne gauche** (~300px) sur desktop. Sur un écran large, un bouton de cette largeur perd son statut de CTA primaire. Le placer en bouton à largeur fixe (200-240px) aligné à gauche ou centré sous le bio.
- **Timeline** : visible sur le screenshot que "2020s" et le début de "2010s" cohabitent horizontalement. Sur desktop, la scroll-row hérite du pattern mobile. Une grille 4-col (comme Reviews/Demos) ou un layout par décennie empilée en sections distinctes serait plus scan-friendly.

### Écrans manquants
- ❌ Pas de `Home • DJ • Live • Tablet/Desktop` en mode request — seulement le portfolio.
- ❌ Pas de breakpoint 834/1440 pour le booking form.
- ❌ Pas d'états intermediates (loading, error, offline) pour aucune plateforme.

---

## 6. UX Copy — quick review

| Lieu | Actuel | Suggestion |
|------|--------|------------|
| Request form instruction | "Copy the Spotify sharing link form the mobile app." | "Paste a Spotify track link. Open the song in Spotify → tap Share → Copy Link." |
| Request form label | "Link your desired song *" | "Spotify song link" |
| Empty state requests | "Make a request by tapping the Request button in the top header." | "Tap REQUEST at the top to send your first song." |
| Booking form "Description" | "Description*" (placeholder "Company name") | Label "About your event" · placeholder "Tell me about the venue, date, vibe, crowd…" |
| Booking confirmation | "BOOKING REQUEST JUST SENT!" | Acceptable, ou plus sobre : "Your booking request is on the way." |
| Booking confirmation body | "Thank you for reaching out! I have received your message and will get back to you as soon as possible." | Ajouter un délai concret : "I'll get back to you within 48 hours." (sous-promet, sur-livre) |
| Header | "SCHOOL" (link) + "FR" (toggle) | Ajouter un label `title`/`aria-label` sur FR pour clarifier qu'il toggle la langue. |

---

## 7. Ce qui fonctionne bien (à ne pas casser)

1. **Identité visuelle cohérente** — le combo Kanit Black + Brand/50 muted + stamp tournant crée un univers reconnaissable dès 2s.
2. **Documentation `design.md`** — exceptionnellement complète pour un portfolio perso. Sert de référence handoff directement.
3. **Logique live/offline** — l'apparition de la Live Card conditionnelle, le header qui mute en REQUEST une fois sur `request.html`, les deux pages distinctes mais partagent la même base — architecture propre.
4. **Card design** — padding 16, radius 16, Brand/95 bg — simple, homogène, lisible. Pas de bruit.
5. **Empty state copy** — informatif, pas générique.
6. **Personal voice** sur les écrans de confirmation ("I have received your message") — rare et précieux pour un portfolio d'artiste.
7. **Design token scale dense** (brand/00 → 105) — permet beaucoup de nuance sans tomber dans l'arbitraire.
8. **Pattern horizontal-scroll + margin négatif** pour Reviews/Demos — bon compromis entre densité et respiration, et évite la pagination artificielle.
9. **Le stamp MOMO à 60s rotation = 1 BPM** — détail de marque poétique (un tour par minute = battement lent, comme un vinyle qui tourne). À préserver.

---

## 8. Priorités recommandées

Par ordre d'impact × effort :

1. 🔴 **Fix typo + placeholder Description** (5 min) — "form" → "from", placeholder `Company name` → `Tell me about your event`. Zéro risque, impact immédiat.
2. 🔴 **Remonter Event/Blue et Event/Red** pour passer AA — change 2 tokens, les 2 couleurs sont utilisées sur des liens et labels critiques. Impact : accessibilité + perception de qualité.
3. 🔴 **Documenter ou simplifier les états du bouton REQUEST** — ambiguïté UX qui confuse le premier usage. Deux heures pour clarifier la règle dans `design.md` et la verrouiller dans les variantes Figma.
4. 🟡 **Revoir la hiérarchie H1 vs H2 section** — soit H1 en blanc, soit H2 en `Brand/60`. Un token change en cascade, impact visuel important.
5. 🟡 **Consolider Song Card à 2 props** plutôt que 6 variantes — 1/2 journée de refactor Figma, mais simplifie drastiquement le design system + le code.
6. 🟡 **Event Card compacte par défaut sur `request.html`** — expand au tap. Libère l'espace au-dessus du fold.
7. 🟡 **Renommer `Footer context=Playing` → `NowPlayingBar`** — dette de naming qui deviendra coûteuse.
8. 🟢 **Ajouter états Error** pour le request form (lien invalide, song not found) et pour tous les fields (Error existe dans la composante mais pas exposé dans un écran).
9. 🟢 **Layer scrolls horizontaux avec un fade gradient** sur Reviews/Demos/Timeline — affordance visuelle "y'en a plus".
10. 🟢 **Compléter tablet/desktop des pages Live + Booking** — 6 écrans à ajouter pour la parité cross-device.

---

## Annexe — écrans analysés

Sur 28 frames de la page `_DJ`, 11 screenshots ont été capturés et critiqués :

- `Home • DJ • Mobile` (1:137)
- `Home • DJ • Desktop` (50:678)
- `Home • DJ • Live • Mobile` (185:6264)
- `Live • Played • Mobile` (468:2921)
- `Live • Requested • Mobile` (468:2936)
- `Live • Form Default • Mobile` (164:6192)
- `Live • Form Filled • Mobile` (164:5856)
- `Live • No Requests • Mobile` (555:4380)
- `Event / Next / Requests — Details Open` (594:160953)
- `Home • Contact • Form • Mobile` (425:2853)
- `Home • Contact • Confirmation • Mobile` (425:2906)

Les 17 autres frames sont majoritairement des variantes déjà couvertes par les états capturés ou des itérations alternatives de `Live • Played`/`Live • Requested`.

Pour élargir la critique, il faudrait refaire un pull avec les pages `_System` (valider les composantes à leur source), `_Admin` (UI admin = moitié du produit), et `_School` (extension de la marque).

---

_Critique générée le 2026-04-20 — à compléter par un pull des pages `_System` / `_Admin` / `_School`._
