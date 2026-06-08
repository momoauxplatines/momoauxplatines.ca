# Momo Aux Platines — Design System

Figma source: https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines

---

## Pending

Changements Figma en attente d'application dans le code.
Format : `[ ] node-id — description` → `[x]` quand appliqué → retiré au prochain push.

_(aucun changement en attente)_

<!--
Appliqués 2026-06-06 :
[x] 71:1921 — Field/Search : radius 8px, bg brand-95/100, border brand-90→brand-80 focus
[x] 390:2756 — Field/Text : radius 8px, bg brand-95/100, border brand-90, placeholder brand-60
[x] 443:3023 — Field/Selector Radio : radius 8px, bg brand-95/100, border brand-90
[x] 473:3366 — Field/Drop Down : radius 8px, bg brand-95/100, border brand-90

Appliqués 2026-06-08 :
[x] 985:2627 — Tab Public : weight 274 (default/hover) → 510 (active), 20px/26px, brand-70/60/50, gap 0
[x] 982:5685 — Messages système : success 20px/26px brand-50 icon 24px filled, error 18px/22px brand-50, gap 8px, padding 16px, radius 8px
[x] 972:6588 / 956:2517 — Header index : logo-box 40px gauche, live pill bg brand-100/radius-72, lang-toggle display:flex/h40px/radius-72/brand-105, hover brand-100
[x] 879:4256 — Header admin tablet/desktop : logo-box 40px gauche (remplace favicon+title), tabs gap 16px centré, logout droite
-->

---

## Structure Figma

| Page Figma | ID | Contenu |
|------------|----|---------|
| `_` | `522:4072` | Couverture du fichier |
| `home-dj` | `0:1` | Portfolio DJ principal |
| `event-public-live` | `857:2830` | Event live — vue publique |
| `event-public-next` | `978:4986` | Event next — vue publique |
| `admin-dj` | `473:3188` | Panel admin DJ |
| `admin-school` | `1044:6271` | Panel admin École |
| `event-admin-next` | `972:5977` | Event next — vue admin |
| `event-admin-live` | `972:3515` | Event live — vue admin |
| `home-school` | `51:970` | Portfolio École |
| `forms` | `653:3319` | Formulaires (booking, contact, request) |
| `design-system` | `1:2` | Design system — composantes, tokens, couleurs |

---

## Screens

| Screen | Viewports |
|--------|-----------|
| DJ (main portfolio) | Mobile · Tablet · Desktop |
| DJ • Live (live event active) | Mobile · Tablet · Desktop |
| Live • Form Default | Mobile |
| Live • Form Filled | Mobile |
| Live • Form Submitted | Mobile |
| Live • Requested | Mobile |
| Live • Played | Mobile |
| Request Sent | Mobile |
| Contact • Form | Mobile |
| Contact • Confirmation | Mobile |

---

## Breakpoints

| Name | Width |
|------|-------|
| Mobile | 390px |
| Tablet | 834px |
| Desktop | 1440px |

Content padding: `32px` on all viewports.
Section gap: `80px` between sections.
Card gap within a section: `16px` (cards), `24px` (admin list items).

---

## Color Palette

### Brand (neutral scale — dark to light)

| Token | Hex | CSS var |
|-------|-----|---------|
| Brand/105 | `#111210` | `--brand-105` — page background |
| Brand/100 | `#141513` | `--brand-100` — deepest surface |
| Brand/95  | `#20221f` | `--brand-95`  — card background |
| Brand/90  | `#282a27` | `--brand-90`  — elevated surface / button bg |
| Brand/80  | `#51534e` | `--brand-80`  — borders, muted |
| Brand/70  | `#797f73` | `--brand-70`  — border hover |
| Brand/60  | `#a2a89b` | `--brand-60`  — placeholder text |
| Brand/50  | `#c9d3c0` | `--brand-50`  — H3 (card & modal titles), placeholder text, small body, inactive tabs |
| Brand/40  | `#d5dccc` | `--brand-40` |
| Brand/30  | `#dee4da` | `--brand-30`  — H2 section headings, primary body text, H4 venue names |
| Brand/20  | `#eaede5` | `--brand-20`  — primary button bg |
| Brand/10  | `#f4f6f3` | `--brand-10`  — primary button default |
| Brand/00  | `#fafbf9` | `--brand-00`  — H1 hero name, primary button hover, button text, active tab text |

### Event / Semantic

| Token | Hex | Usage |
|-------|-----|-------|
| Event/Black | `#000000` | Live event card bg |
| Event/Red   | `#d34242` | Live indicator dot & label, delete button |
| Event/Blue  | `#007aff` | Next event date badge, song request link |
| Background  | alias → `Event/Black` | `--bg: #000000` — fond des pages et formulaires |
| Event/Green | `#34c759` | Song played state |

---

## Typography

All headings use **Kanit Black (900)**. Body and UI text use **SF Pro** (system-ui as fallback). No italic.

| Token | Family | Weight | Size | Line-height | Default color |
|-------|--------|--------|------|-------------|---------------|
| H1 | Kanit Black | 900 | 52px | 52px | `Brand/00` |
| H2 | Kanit Black | 900 | 44px | 48px | `Brand/30` |
| H3 | Kanit Black | 900 | 32px | 34px | `Brand/50` |
| H4 | Kanit Black | 900 | 28px | 31px | `Brand/30` (venue names) |
| H5 | Kanit Black | 900 | 20px | 26px | `Brand/50` |
| Body | SF Pro Light | 274 | 18px | 26px | `Brand/30` |
| Small Body | SF Pro Light | 274 | 16px | 20px | `Brand/50` |
| Bold | SF Pro Bold | 700 | 18px | 100% | `Brand/30` |
| Button | SF Pro Black | 1000 | 18px | 26px | — per variant |
| Tab | SF Pro Light / Medium | 274 default · 510 active | 20px | 26px | `Brand/50` active, `Brand/70` default, `Brand/60` hover |
| Skill | SF Pro Black | 1000 | 16px | 30px | `Brand/00` |
| Link | SF Pro Light | 274 | 18px | 26px | `Brand/30` |

### Heading color hierarchy

The color stack descends with importance, reinforcing the size stepdown so hierarchy is legible on both cold (Figma) and warm (running site) readings:

- **H1 → `Brand/00`** (#fafbf9) — reserved for the hero identity (artist name). Maximum brightness, maximum focus.
- **H2 → `Brand/30`** (#dee4da) — section headings (NEXT GIGS, REVIEWS, DEMOS, TIMELINE). Strong but descends visibly from H1 when both are on screen.
- **H3 → `Brand/50`** (#c9d3c0) — card titles (review names, demo titles) and overlay/modal titles (CONTACT MOMO, SEND A REQUEST). Muted: the card/modal context is framing them, so they recede to let the body content lead.

H4/H5 keep their existing contextual colors (venue names `Brand/30` on cards; small labels `Brand/50`).

Google Fonts import: `Kanit` weights `300, 600, 700, 900`.

---

## Buttons

Composante Figma : `Button` · Page `_System`

### Type=Primary
- Height: `56px` · Border-radius: `8px` · Padding: `0 16px`
- **Default** — bg: `Brand/10` (#f4f6f3) · text: `Brand/100` · font: Button (uppercase)
- **Hover** — bg: `Brand/00` (#fafbf9)
- **Disabled** — bg: `Brand/80` (#51534e) · text: `Brand/100`

### Type=Secondary
- Height: `56px` · Border-radius: `8px` · Full-width
- bg: `Brand/90` · border: `Brand/80` · text: `Brand/00` · font: Body
- Usage: Dark / Refresh / action secondaire

### Type=Tertiary
- Height: `56px` · Border-radius: `8px`
- Variante légère, sans fond solide

### Type=Admin Small
- Height: `40px` · Border-radius: `8px` · Padding: `0 16px`
- **Default** — bg: `Brand/90` (#282a27) · border: `Brand/80` · text: `Brand/00` · font: Body (Light 18px)
- **Hover** — border: `Brand/70`
- **Disabled** — bg: `Brand/100` · border: `Brand/90` · text: `Brand/80`

### Type=Admin
- Height: `56px` · Border-radius: `8px` · Full-width
- bg: `Brand/90` · border: `Brand/80` · text: `Brand/00` · font: Body

### Type=Admin Delete
- Height: `56px` · Border-radius: `8px` · Full-width · font: Body Light 18px
- **Default** — bg: `Brand/90` (#282a27) · border: `Event/Red` · text: `Event/Red`
- **Hover** — bg: `Event/Red` (solid fill) · no border · text: `Brand/00`

### Type=Tag
- Height: `40px` · Border-radius: `8px` · Padding: `4px 16px`
- bg: `Brand/90` · text: `Brand/00` · font: Skill (SF Pro Black 16px)
- Usage: skill tags sur la page Intro

### Type=Request
- States : Default · Hover
- Variante de bouton pour la page Requests (live event) — `button.event.request`
- Composante Figma : `Button` · Page `_System`

### Type=Icon
- Height: `40px` · Width: `46px` · Border-radius: `8px`
- States : Default · Hover — `button.icon`
- Usage: boutons icône seule (sans label), ex. actions rapides admin

### Type=Language
- Height: `39px` · Width: `57px` · Border-radius: `8px`
- States : Default · Hover — `button.language`
- Usage: sélecteur de langue (FR / EN) dans le header

### Type=Details
- Height: `48px` · Width: `67px` · Border-radius: `8px`
- States : Closed · Open — `button.details`
- Usage: bouton d'expansion des détails d'un événement (Event Page)

### Type=Back
- Height: `48px` · Width: `53px`
- State unique — `button.back`
- Usage: retour arrière dans les overlays admin / event

### Type=Battle
- Dimensions : `48×40px` · Border-radius: `8px`
- States : Default · Selected — `button.battle`
- Usage: bouton de vote/sélection pour le mode Battle

---

## Form Fields

Composantes Figma : `Field / Text`, `Field / Search`, `Field / Selector`, `Field / Drop Down` · Page `_System`

### Field / Text — node `390:2756`
- **Default** — bg `Brand/95` · border `Brand/90` · text `Brand/30` · placeholder `Brand/60`
- **Active/Focus** — bg `Brand/100` · border `Brand/90`
- **Filled** — bg `Brand/100` · border `Brand/90` · text `Brand/60`
- **Error** — bg `Brand/100` · border `Event/Red` · text `Event/Red`
- **Disabled** — bg `Brand/100` · border `Brand/90` · text `Brand/80`
- Border-radius: `8px` (`--radius-8`) · Padding: `16px 20px` · Font: Body Light 18px/26px

### Field / Search — node `71:1921`
- **Default** — bg `Brand/95` · border `Brand/90` · icon + placeholder `Brand/60`
- **Active/Focus** — bg `Brand/100` · border `Brand/80`
- **Filled** — bg `Brand/100` · border `Brand/90`
- **Error** — bg `Brand/100` · border `Event/Red` · text `Event/Red`
- **Disabled** — bg `Brand/100` · border `Brand/95`
- Border-radius: `8px` · Padding: `16px 20px 16px 20px` (icon left) · Gap: `16px`

### Field / Selector Radio — node `443:3023`
- **Default** — bg `Brand/95` · border `Brand/90` · radio: bg `Brand/100` border `Brand/80`
- **Selected** — bg `Brand/100` · border `Brand/90` · radio: bg+border `Event/Green` + checkmark
- **Error** — bg `Brand/100` · border `Event/Red` · radio border `Event/Red`
- **Disabled** — bg `Brand/100` · border `Brand/95`
- Border-radius: `8px` · Padding: `16px 20px` · Radio icon: `24×24px` circle

### Field / Drop Down — node `473:3366`
- **Default** — bg `Brand/95` · border `Brand/90` · text `Brand/60` · caret `Brand/50`
- **Active (open)** — bg `Brand/100` · border `Brand/90` · radius top only
- **Selected** — bg `Brand/100` · border `Brand/90` · text `Brand/50`
- **Error** — bg `Brand/100` · border `Event/Red` · text `Event/Red`
- **Disabled** — bg `Brand/100` · border `Brand/95` · text `Brand/80`
- Border-radius: `8px` (closed) · Padding: `16px 20px`

### Checkbox
- 24×24px · States : Default · Checked · Error

---

## Cards

### Card / Web / Event (composante Figma)

| Variante | Location | State |
|----------|----------|-------|
| Home, Live | Home | Live |
| Home, Next | Home | Next |
| Event, Live – Open | Event | Live, expanded |
| Event, Next – Open | Event | Next, expanded |
| Event, Live – Closed | Event | Live, compact |
| Event, Next – Closed | Event | Next, compact |

- bg: `Brand/95` · border-radius: `16px` · padding: `16px`
- Gap: `16px`
- **Top row**: 48×48px avatar (rounded-8px, border: `Brand/100`) + status badge (right-aligned)
  - Live badge: red dot (12px, pulsing) + "LIVE" Kanit Black 20px `Event/Red`
  - Next badge: date string, Kanit Black 20px `Event/Blue`
- **Copy block**: venue name H4 uppercase `Brand/30` · address Small Body `Brand/30` · hours Small Body `Brand/50` · Instagram link underlined `Brand/30`
- **Live only** — black "EVENT PAGE" button (56px, bg: `#000`, font: Button)

### Card / Web / Content — Type=Review
- bg: `Brand/95` · border-radius: `16px` · padding: `16px`
- 80×80px avatar (rounded-8px)
- Name: H3 uppercase `Brand/50` · Role: Body Light `Brand/50`
- Review text: Body Light `Brand/10`
- Instagram link: Body Light `Brand/00` underlined

### Card / Web / Content — Type=Demo
- bg: `Brand/95` · border-radius: `16px` · padding: `16px`
- Full-bleed thumbnail at top (rounded-16px) with play button overlay
- Title: H3 uppercase `Brand/50` · Description: Body Light · Link: Body Light `Event/Blue`

### Card / Web / Content — Type=Timeline
- Same as Review card structure
- Name: H3 `Brand/50` · Dates: Body Light `Brand/50` · Role description: Body Light

### Card / Web / Song

| Variante | State | Requested |
|----------|-------|-----------|
| Song | Played | No |
| Song | Request - Form | No |
| Song | Request | Yes |
| Song | Played | Yes |
| Song | Playing | No |
| Song | Requested - Playing | Yes |

- bg: `Brand/95` · border-radius: `16px` · padding: `8px`
- 64×64px album art (rounded-8px, border: `Brand/100`)
- Song title: Bold 18px `Brand/30` · Artist: Small Body `Brand/30` · Spotify: link `Event/Blue`
- Status icon (`Request Icon`): Played (green ✓) · Requested · X
- Currently playing: "Playing" label in `Event/Green`, Kanit Black 20px

### Card / Web / Song — Battle

Composante Figma : `song.battle` · Page `_System`

| Type | State |
|------|-------|
| Type=Choice | Default |
| Type=Choice | Selected |
| Type=Choice | Not Selected |
| Type=Result | Leading |
| Type=Result | Contender |

- Mêmes specs visuelles que Card / Web / Song (64×64px art, `Brand/95` bg, border-radius `16px`)
- Usage: mode Battle — les visiteurs votent pour un morceau contre un autre

### Card / Admin — Type=admin-card & admin-card live
- bg: `#000` · border: `Brand/50` · border-radius: `16px` · padding: `16px`
- 72×72px avatar (rounded-8px) + venue name (Bold 18px) / date / time (Small Body)
- Actions row: Live status dot + "LIVE" (Kanit Black 20px `Event/Red`) / Edit (Admin Small button)

### Card / Admin — Type=Request Live & Request Next
- Album art 64×64px · Title (Bold) / Artist (Small Body) · toggle switch
- 352×80px

---

## MOMO Stamp (Hero)

- Composite of 3 SVG layers: base stamp + top arc text + bottom arc text
- Container: `290×291px`, `overflow: hidden`
- Scale: `transform: translate(-50%, -50%) scale(0.6631)` centered in container
- Rotation: `60s` full rotation (1 BPM) — `animation: spin 60s linear infinite`
- Radial gradient overlay: `Brand/50` → `transparent` (fades at ~90%), full-viewport `position: absolute`

---

## Fixed Header

Composante Figma : `Header` · Page `_System`

| Viewport | Type | Live |
|----------|------|------|
| All | Main | No |
| All | Main | Yes |
| Mobile | Requests | Yes |
| Mobile | Admin | No |
| Desktop | Admin | No |
| Mobile | Event | No |
| Mobile | Event 2 | No |
| All | Form | — |

- `position: fixed` · `max-width` matches breakpoint · `z-index: 100`
- Padding: `24px`
- Hides on scroll-down, reappears after 200px upward scroll
- **Right**: Language toggle (FR / EN) — Kanit Black 20px `Brand/50`
- **Left**: "SCHOOL" text link
- **Centre (live only)**: pulsing red dot + "LIVE" / "EN DIRECT" label — Kanit Black 20px `Event/Red`, absolutely centred regardless of left/right content

---

## Event Status Badge

Composante Figma : `Event Status` · Page `_System`

| Variante | Style |
|----------|-------|
| Type=Live | Red dot (12px pulsing) + "LIVE" Kanit Black 20px `Event/Red` |
| Type=Next | Date string Kanit Black 20px `Event/Blue` |
| Type=Past | "Past" SF Pro Black 18px `Brand/00` · bg `Brand/105` |

---

## Tabs

Composante Figma : `tab-new` · Page `_System`

| Variante | Description |
|----------|-------------|
| Property 1=default | Tab au repos |
| Property 1=hover | Tab survolé |
| Property 1=active | Tab actif |

- Full-width · `Brand/95` bg · active tab text: `Brand/00` · font: Tab (SF Pro Black 18px)

---

## Switch Toggle

Composante Figma : `Switch` · Page `_System`

- Width: `36px` · Height: `20px` · Border-radius: `100px`
- **State=Off** — bg `#d2d5da` (iOS gray) · knob left `2px`
- **State=On** — bg `#2563eb` (iOS blue) · knob right `18px`
- Knob: `16px` circle, white, `box-shadow: 0 2px 4px rgba(39,39,39,0.1)`

---

## Request Icon

Composante Figma : `icon.requests` · Page `_System`

| Variante | Usage |
|----------|-------|
| Type=Played | Checkmark vert `Event/Green` |
| Type=Requested | Icône demande en attente |
| Type=Delete | Suppression / rejet |

---

## Utility Icons

Composantes Figma : `icon.radio`, `icon.caret`, `icon.check` · Page `_System`

### icon.radio
| Variante | Description |
|----------|-------------|
| Name=icon.radio.default | Radio non coché — état par défaut |
| Name=icon.radio.checked | Radio coché |
| Name=icon.radio.error | Radio en état d'erreur |

### icon.caret
| Variante | Description |
|----------|-------------|
| Name=icon.caret.up | Flèche vers le haut |
| Name=icon.caret.down | Flèche vers le bas |
| Name=icon.caret.left | Flèche vers la gauche |
| Name=icon.caret.right | Flèche vers la droite |

Usage: navigation, accordéons, sélecteurs ouverts/fermés.

### icon.messages
Composante Figma : `icon.messages` · Page `_System`

| Variante | Description |
|----------|-------------|
| Property 1=icon.check | 80×80px · Checkmark de confirmation (overlay de confirmation, état `input.field.selector.radio.filled`) |
| Property 1=icon.error | 80×80px · Icône d'erreur (overlay d'échec) |

---

## Song Control Button

Composante Figma : `button.song` · Page `_System`

| Variante | Style |
|----------|-------|
| Property 1=now-playing.on | bg `Event/Blue` · icône blanche — lecture en cours |
| Property 1=now-playing.off | bg `Brand/95` · icône blanche — non actif |
| Property 1=now-playing.played | bg `Brand/95` · icône `Event/Green` — déjà joué |

- Dimensions : `48×40px` · Border-radius: `8px`
- Usage: bouton de contrôle de lecture pour la playlist admin (`Card / Admin` Type=playlist-song)

---

## Logos

Composante Figma : `Logo/DJ`, `Logo/School` · Page `_System`

- Logo/DJ : 437×437px SVG
- Logo/School : 629×628px SVG

---

## Page Sections (Mobile, top to bottom)

### 1. Hero
- `100dvh` · full-bleed stamp + gradient
- No content padding (stamp is absolutely centred)

### 2. Live Event *(conditional — shown when event is live and `show: true`)*
- Appears between Hero and Intro
- Section label: "LIVE" — H4 Kanit Black `Brand/50`
- Contains 1 Event Card (Home, Live variant)

### 3. Intro
- Avatar: `112px` circle
- Name: H1 Kanit Black `Brand/00` uppercase
- Skill tags: Type=Tag button · `Brand/90` bg · `Brand/00` text · rounded-8px · padding `4px 16px` · Skill font
- Bio: Body Light `Brand/00`
- CTA: Type=Primary button ("CONTACT" → opens booking modal)

### 4. Next Gigs *(conditional — shown when upcoming events with `show: true` exist)*
- Heading: H2 Kanit Black `Brand/30`
- List of Event Cards (Home, Next variant) — `gap: 16px`

### 5. Reviews
- Heading: H2 Kanit Black `Brand/30`
- Horizontal scroll row of Review Cards — `margin: 0 -32px; padding: 0 32px`
- Card width: `310px`

### 6. Demos
- Heading: H2 Kanit Black `Brand/30`
- Genre filter tabs (Kanit Black, `Brand/50` inactive / `Brand/00` active)
- Horizontal scroll row of Demo Cards

### 7. Timeline
- Heading: H2 Kanit Black `Brand/30`
- Decade tabs: 1990s / 2000s / 2010s / 2020s
- Horizontal scroll row of Timeline Cards per decade

### 8. Footer
- Composante Figma : `Footer` (Context=DJ) · Page `_System`
- Background: `var(--bg)` = `#000000` (Event/Black) · padding: `80px 16px` · gap: `24px`
- **Logo stamp** : `og-image.png` · 163×80px · `object-fit: contain` · `filter: drop-shadow(4px 4px 0 #000)`
- **Links** (`.footer-btn`) : bg `Brand/90` · text `Brand/50` · height `40px` · padding `0 16px` · radius `0` · SF Pro Black 860 18px · no uppercase · `transition: opacity 0.15s`
  - Row 1 : Instagram + Twitch (flex-row, gap `8px`)
  - Row 2 : Tidal (seul)
  - Gap entre rows : `14px`
- **Copyright** : Small Body Light 16px/20px · `Brand/80` · centred

---

## Live Page (request.html)

Separate page, active when an event is live.

### Header
- Composante Figma : `Header` Type=Requests, Live=Yes
- Logo mark (left) · "REQUEST" centred · "FR" language toggle (right)

### Event Card (compact, 80px tall)
- Composante Figma : `Card / Web / Event` Location=Event, State=Live – Closed
- Venue thumbnail · "● LIVE" red badge · "Détails ▾" dropdown

### Tabs
- Composante Figma : `tab-new`
- **REQUESTS** | **PLAYED** — Tab font, full-width, `Brand/95` bg, active tab `Brand/00`

### Song Request Card
- Composante Figma : `Card / Web / Song`
- Album art 64×64px · Title (Bold) / Artist (Small Body) / Spotify link (Small Body `Event/Blue`)
- Status badge: `Request Icon` Type=Played (green checkmark) = played

### Now Playing Bar (bottom, sticky)
- Composante Figma : `Footer` Context=Playing
- Album art 64×64px · Song & artist · "▶ Playing" in `Event/Green` Kanit Black

### Request Form
- Accessible via "REQUEST" button in header
- Heading: "SEND A REQUEST" — H3 Kanit Black `Brand/50` uppercase
- `Field / Search` (Spotify link, pill shape)
- Type=Primary button: "SEND YOUR REQUEST"

---

## Contact / Booking Modal

Overlay, `position: fixed; inset: 0`.
Composante Figma : `Header` Type=Form

### Form
- Title: "CONTACT MOMO" — H3 Kanit Black `Brand/50`
- Subtitle: Body Light `Brand/50`
- Fields: Name*, Phone*, Email*, Company*, Description* (textarea), Date — tous `Field / Text`
- CTA: Type=Primary button "SEND"

### Confirmation
- Green checkmark circle (80px, `Event/Green`)
- Title: "BOOKING REQUEST JUST SENT!" — H3 Kanit Black `Brand/50` centred
- Body text: Body Light centred
- CTA: Type=Primary button "CLOSE"

---

## Admin Panel (admin/index.html)

Separate admin UI. Max content width: `800px`, centred.

### Sections
- **Live** — shows current live event card (if any)
- **Next Gigs** — list of upcoming gig cards + Add button
- **Intro** — editable intro block (`Card / Admin` Type=Intro)
- **Reviews** — list of review cards (`Card / Admin` Type=Review) + Add button
- **Demos** — list of demo cards (`Card / Admin` Type=Demo) + Add button
- **Timeline** — grouped by decade, each with Add button (`Card / Admin` Type=Timeline)

### Gig Card (admin)
- Composante Figma : `Card / Admin` Type=admin-card / Type=admin-card live
- bg: `#000` · border: `Brand/50` · border-radius: `16px` · padding: `16px`
- 72×72px avatar (rounded-8px) + venue name (Bold 18px) / date / time (Small Body)
- Actions row: Live status (red dot + "LIVE" Kanit Black 20px) on left · Edit button (Type=Admin Small) on right
- Clicking card body → opens Requests overlay
- Clicking Edit → opens edit form

### Event Message Card (admin)
- Composante Figma : `card.admin.event.message` · Page `_System`
- 352×120px — carte message/notification associée à un événement dans le panel admin

### Edit Form (overlay)
- `position: fixed; inset: 0` · `z-index: 100`
- **Mobile** — full-screen, bg: `Brand/100`, flex column (header → scrollable body → footer)
- **Desktop (≥ 860px)** — overlay becomes a dark backdrop (`rgba(0,0,0,0.72)`), inner `.edit-panel` floats centred: `max-width: 800px`, `max-height: 90vh`, `border-radius: 16px`, bg: `Brand/100`
- Header: title (H3) + close (×) button · subtitle (Body Light)
- Body: scrollable form fields
- Footer: Type=Primary Save button (disabled until first change)

### Gig Edit Form Fields
- Venue* (`Field / Text`), Address, Date*, Start*, End*, Instagram URL, Photo (image picker)
- **Show on home page** toggle — `Switch` composante (State=On/Off)
- Delete event button — Type=Admin Delete (56px)

### Requests Overlay
- Header: ← Back button (Body Light `Brand/50`) + event avatar (40×40px, right)
- Section title: "REQUESTS" — H5 Kanit Black `Brand/50` uppercase
- Request cards: `Card / Admin` Type=Request Live / Type=Request Next
  - album art 64×64px · Title (Bold) / Artist (Small Body) / Time (Small Body) · `Switch` toggle
- Footer: Type=Secondary "Refresh" button

---

## Spacing System

| Use | Value | Variable Figma |
|-----|-------|----------------|
| Content side padding | `32px` | — |
| Section gap | `80px` | — |
| Card internal gap | `16px` | — |
| Admin list item gap | `24px` | — |
| Card padding | `16px` | — |
| Form field gap | `8px` (label → input) | — |
| Form section gap | `16px` between fields | — |
| Button height (Primary / Secondary / Tertiary / Admin / Admin Delete) | `56px` | — |
| Button height (Admin Small / Tag) | `40px` | — |
| Avatar — Header | `40px` | Header Avatar |
| Avatar — Event Card | `48px` | Event Card Avatar |
| Avatar — Admin | `56px` | Admin Avatar |
| Avatar — Song Card | `64px` | Song Card Avatars |
| Avatar — Admin Gig | `72px` | Event Avatar |
| Avatar — Home Page | `80px` | Home Page Avatars |
| Avatar — Intro | `112px` | — |
| Border radius — cards | `16px` | — |
| Border radius — buttons | `8px` | — |
| Border radius — inputs | `12px` | — |
| Border radius — tags | `8px` | — |
| Border radius — avatar | `8px` (square), `560px` (circle) | — |

---

_Dernière sync Figma : 2026-06-06 — tokens ✓ · pages ✓ · composantes ✓ · --bg = Background (alias Event/Black) ✓ · footer ✓_

_Hiérarchie heading mise à jour le 2026-04-20 : H1 → Brand/00, H2 → Brand/30, H3 → Brand/50. **À répercuter côté Figma** : repeindre le texte des instances Name (H1), tous les titres de section (H2), les card titles Review/Demo/Timeline et les titres modaux Contact/Request (H3)._
