// ─────────────────────────────────────────────────────────────────────────────
//  MOMO AUX PLATINES — Event Configuration
//
//  Add one object per event inside the array below.
//  An empty array hides the section entirely.
//
//  Fields:
//    venue      — Venue name (displayed in uppercase)
//    address    — Full address
//    hours      — Time range, e.g. "19:00 – 01:00"
//    instagram  — Full Instagram URL of the venue
//    image      — Path to venue image, relative to site root
//                 Place the file in images/events/ and reference it as
//                 "images/events/my-venue.jpg"
//    live       — true → shows the pulsing LIVE / EN DIRECT indicator
// ─────────────────────────────────────────────────────────────────────────────

window.MOMO_EVENTS = [

  // ── Active event example — edit or remove ──
  {
    venue:     "Buvette Chez Simone",
    address:   "4869 Rue Villeneuve O, Montréal, QC",
    hours:     "19:00 – 01:00",
    instagram: "https://www.instagram.com/labuvettechezsimone",
    image:     "images/timeline-buvette-simone.jpg",
    live:      true
  }

];
