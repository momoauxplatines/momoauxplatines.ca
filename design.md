# Momo Aux Platines — Design System

Figma source: https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines

---

## Structure Figma

| Page Figma | Contenu |
|------------|---------|
| Cover | Couverture du fichier |
| _DJ | Portfolio DJ principal (toutes les screens) |
| _School | Section École |
| _Admin | Panel d'administration |
| _System | Design system — composantes, tokens, couleurs |

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
| Tab | SF Pro Black | 1000 | 18px | 24px | `Brand/00` active, `Brand/50` inactive |
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
- State unique : `State=All`
- Variante de bouton pour la page Requests (live event)
- Composante Figma : `Button` Type=Request · Page `_System`

---

## Form Fields

Composantes Figma : `Field / Text`, `Field / Search`, `Field / Selector`, `Field / Drop Down` · Page `_System`

### Field / Text (champ standard)
- Background: `Brand/100`
- Border: `1px solid Brand/50`
- Border-radius: `12px`
- Padding: `16px 20px`
- Font: Body (Light, 18px, `Brand/50` text)
- States : Default · Active · Filled · Error · Disabled
- Focus: border → `Brand/30`, text → `Brand/30`
- Empty/unfilled: bg: `Brand/90`, border: `Brand/80`, text: `Brand/60`
- Label (`Field / Label`): Body Light, `Brand/30`, 18px

### Field / Search
- Même specs que Field / Text + icône loupe
- Pill shape (`rounded-full`) pour la page Request
- States : Default · Active · Filled · Error · Disabled

### Field / Selector
- Même gabarit que Field / Text
- States : Default · Filled · Error · Disabled

### Field / Drop Down
- Même gabarit + état ouvert avec liste de choix
- States : Default · Active · Filled · Error · Disabled · Choice Middle · Choice Last

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
| Mobile | Event | No |
| All | Modal | Yes |

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

---

## Tabs

Composante Figma : `Tabs` · Page `_System`

| Variante | Description |
|----------|-------------|
| Activated=Left | Tab gauche actif |
| Activated=Right | Tab droit actif |

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

Composante Figma : `Request Icon` · Page `_System`

| Variante | Usage |
|----------|-------|
| Type=Played | Checkmark vert `Event/Green` |
| Type=Requested | Icône demande en attente |
| Type=X | Suppression / rejet |

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
- Logo mark (80px)
- Site name: H4 Kanit Black `Brand/30` centred
- Links: INSTAGRAM · TWITCH · SCHOOL — Type=Admin Small button style
- Copyright: Small Body Light `Brand/50` centred

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
- Composante Figma : `Tabs`
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
Composante Figma : `Header` Type=Modal, Live=Yes

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

_Dernière sync Figma : 2026-04-20 — tokens ✓ · pages ✓ · composantes ✓_

_Hiérarchie heading mise à jour le 2026-04-20 : H1 → Brand/00, H2 → Brand/30, H3 → Brand/50. **À répercuter côté Figma** : repeindre le texte des instances Name (H1), tous les titres de section (H2), les card titles Review/Demo/Timeline et les titres modaux Contact/Request (H3)._
