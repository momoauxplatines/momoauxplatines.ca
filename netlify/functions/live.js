/**
 * Netlify Function: /api/live
 * Proxies Serato playlist data to avoid CORS.
 *
 * Query params:
 *   date  – YYYY-MM-DD of the gig. When provided the function finds the
 *            Serato playlist whose date matches and returns its tracks.
 *            Omit for legacy/demo mode (returns the most recent live session).
 *
 * Spotify artwork is looked up client-side.
 */

const https = require('https');

const SERATO_USER = 'DJ_Muhammad_Alias';

// Month abbreviation → zero-padded number
const MONTHS = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

// "16 Apr 2026" → "2026-04-16"
function seratoDateToISO(str) {
  const parts = str.trim().split(/\s+/);
  if (parts.length !== 3) return null;
  const [day, mon, year] = parts;
  const m = MONTHS[mon];
  if (!m) return null;
  return `${year}-${m}-${day.padStart(2, '0')}`;
}

// Simple HTTPS GET with redirect support and cookie passthrough.
// cookieJar is a plain object { name: value } accumulated across redirects.
function get(url, redirects = 0, cookieJar = {}) {
  if (redirects > 5) return Promise.reject(new Error('Too many redirects'));
  return new Promise((resolve, reject) => {
    const cookieHeader = Object.entries(cookieJar).map(([k, v]) => `${k}=${v}`).join('; ');
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        ...(cookieHeader ? { 'Cookie': cookieHeader } : {}),
      }
    }, res => {
      // Capture any cookies set by this response and forward them on redirects.
      const newJar = { ...cookieJar };
      for (const raw of (res.headers['set-cookie'] || [])) {
        const kv = raw.split(';')[0].trim();
        const eq = kv.indexOf('=');
        if (eq > 0) newJar[kv.slice(0, eq)] = kv.slice(eq + 1);
      }

      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : `https://serato.com${res.headers.location}`;
        res.resume();
        return get(next, redirects + 1, newJar).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function parseTrackName(raw) {
  const clean = raw
    .replace(/\s*\(Explicit\)/gi, '')
    .replace(/\s*\(feat\.[^)]+\)/gi, '')
    .trim();
  const sep = clean.indexOf(' - ');
  if (sep === -1) return { artist: '', title: clean };
  return {
    artist: clean.substring(0, sep).trim(),
    title: clean.substring(sep + 3).trim()
  };
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'")
    .replace(/&#x27;/g, "'");
}

function parseTracks(html) {
  // Helper: strip inner tags and decode entities from a matched fragment.
  const clean = (s) => decodeHtmlEntities(s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

  let m;

  // ── Pattern A ── Original format: id="track_NNN" + class="playlist-trackname"
  {
    const re = /id="(track_\d+)"[\s\S]*?class="playlist-trackname"[^>]*>\s*([\s\S]*?)\s*<\/(?:div|td|li|span)>/g;
    const found = [];
    while ((m = re.exec(html)) !== null) {
      const raw = clean(m[2]);
      if (!raw || raw.length < 3) continue;
      found.push({ id: m[1], ...parseTrackName(raw) });
    }
    if (found.length) { found.reverse(); return found; }
  }

  // ── Pattern B ── Alternate ID format: id="pl-NNN" + class="playlist-trackname"
  {
    const re = /id="(pl-\d+)"[\s\S]*?class="playlist-trackname"[^>]*>\s*([\s\S]*?)\s*<\/(?:div|td|li|span)>/g;
    const found = [];
    while ((m = re.exec(html)) !== null) {
      const raw = clean(m[2]);
      if (!raw || raw.length < 3) continue;
      found.push({ id: m[1], ...parseTrackName(raw) });
    }
    if (found.length) { found.reverse(); return found; }
  }

  // ── Pattern C ── class="playlist-trackname" anywhere; synthetic sequential IDs
  {
    const re = /class="playlist-trackname"[^>]*>\s*([\s\S]*?)\s*<\/(?:div|td|li|span)>/g;
    const found = [];
    let idx = 0;
    while ((m = re.exec(html)) !== null) {
      const raw = clean(m[1]);
      if (!raw || raw.length < 3) continue;
      found.push({ id: `track_${idx++}`, ...parseTrackName(raw) });
    }
    if (found.length) { found.reverse(); return found; }
  }

  // ── Pattern D ── Serato may have renamed the class; match anything containing "trackname"
  {
    const re = /class="[^"]*trackname[^"]*"[^>]*>\s*([\s\S]*?)\s*<\/(?:div|td|li|span)>/g;
    const found = [];
    let idx = 0;
    while ((m = re.exec(html)) !== null) {
      const raw = clean(m[1]);
      if (!raw || raw.length < 5) continue;
      const parsed = parseTrackName(raw);
      // Only accept if the string looks like a track (contains " - " separator or has an artist)
      if (!parsed.artist && !raw.includes(' - ')) continue;
      found.push({ id: `track_${idx++}`, ...parsed });
    }
    if (found.length) { found.reverse(); return found; }
  }

  return [];
}

// Find a session slug matching a target ISO date by scanning the listings page.
// Tries multiple possible card-boundary patterns in case Serato renamed classes/ids.
function findSlugByDate(listingsHtml, targetDate) {
  // Possible card separators Serato has used over time.
  const boundaries = [
    /<div\s+id="pl-\d+"/g,
    /<li\s[^>]*class="[^"]*playlist[^"]*"/g,
    /<div\s[^>]*class="[^"]*playlist-card[^"]*"/g,
  ];

  // Date label patterns: <span class="playlist-start-time"> or <time ...> elements.
  const datePats = [
    /<span[^>]*class="playlist-start-time"[^>]*>([^<]+)<\/span>/,
    /<time[^>]*datetime="(\d{4}-\d{2}-\d{2})[^"]*"/,
    /<time[^>]*>([^<]+)<\/time>/,
  ];

  const slugRe = new RegExp(`href="/playlists/${SERATO_USER}/([^"/?#]+)"`);

  for (const boundary of boundaries) {
    const parts = listingsHtml.split(boundary);
    if (parts.length <= 1) continue;

    for (const card of parts.slice(1)) {
      const slugMatch = card.match(slugRe);
      if (!slugMatch) continue;

      for (const pat of datePats) {
        const dateMatch = card.match(pat);
        if (!dateMatch) continue;
        // datetime attr is already ISO; start-time / <time> text needs conversion.
        const iso = /^\d{4}-\d{2}-\d{2}/.test(dateMatch[1])
          ? dateMatch[1].slice(0, 10)
          : seratoDateToISO(dateMatch[1]);
        if (iso === targetDate) return slugMatch[1];
        break;
      }
    }
  }
  return null;
}

exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };

  // YYYY-MM-DD of the current gig, or null for legacy demo mode
  const qs = event.queryStringParameters || {};
  const targetDate = qs.date || null;

  try {
    let session = null;

    // 1. Always check /live first — Serato publishes the actively-streaming session
    //    there before it appears in listings or at its permanent date slug.
    const liveHtml = await get(`https://serato.com/playlists/${SERATO_USER}/live`);

    let tracks = [];

    tracks = parseTracks(liveHtml);
    if (tracks.length) {
      // Active session in progress — parse tracks directly from the /live page.
      // No slug matching needed: the DJ is streaming right now.
      session = 'live';
    } else if (targetDate) {
      // No active session — look up a completed session by date.

      // 2a. Try the permanent date slug URL directly.
      //     Pass an empty cookie jar so Serato session cookies flow through
      //     any redirect (e.g. /2026-07-01 → /live with session context).
      const directHtml = await get(`https://serato.com/playlists/${SERATO_USER}/${targetDate}`, 0, {});
      tracks = parseTracks(directHtml);
      if (tracks.length) {
        session = targetDate;
      }

      // 2b. Look for a listing entry in the /live page whose date matches targetDate.
      if (!session) {
        const slugFromLive = findSlugByDate(liveHtml, targetDate);
        if (slugFromLive) {
          const sessionHtml = await get(`https://serato.com/playlists/${SERATO_USER}/${slugFromLive}`);
          tracks  = parseTracks(sessionHtml);
          session = slugFromLive;
        }
      }

      // 2c. Scan the full public listings page as a last resort.
      if (!session) {
        const listingsHtml = await get(`https://serato.com/playlists/${SERATO_USER}`);
        const slug = findSlugByDate(listingsHtml, targetDate);
        if (slug) {
          const sessionHtml = await get(`https://serato.com/playlists/${SERATO_USER}/${slug}`);
          tracks  = parseTracks(sessionHtml);
          session = slug;
        }
      }
    } else {
      // Legacy / demo mode and no active session — use the most recent listed session.
      const slugMatch = liveHtml.match(
        new RegExp(`href="/playlists/${SERATO_USER}/([^"/?#]+)"`)
      );
      if (slugMatch) {
        session = slugMatch[1];
        const sessionHtml = await get(`https://serato.com/playlists/${SERATO_USER}/${session}`);
        tracks = parseTracks(sessionHtml);
      }
    }

    if (!session) {
      return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ tracks: [], session: null }),
      };
    }

    // 3. Push the current (most recent) track to Supabase so Realtime can
    //    broadcast it instantly to all connected gig pages.
    // Serato assigns the highest numeric id to the most recently played track.
    const nowTrack = tracks.length
      ? tracks.reduce((best, t) => {
          const nb = parseInt((best.id || '').replace(/\D/g, '')) || 0;
          const nt = parseInt((t.id    || '').replace(/\D/g, '')) || 0;
          return nt > nb ? t : best;
        })
      : null;
    if (nowTrack) {
      const sbUrl    = process.env.SUPABASE_URL;
      const sbKey    = process.env.SUPABASE_ANON_KEY;
      const sbSecret = process.env.SUPABASE_NP_SECRET;
      if (sbUrl && sbKey && sbSecret) {
        try {
          await fetch(`${sbUrl}/rest/v1/rpc/update_now_playing_track`, {
            method: 'POST',
            headers: {
              'apikey': sbKey,
              'Authorization': `Bearer ${sbKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              p_secret:      sbSecret,
              p_gig_date:    targetDate || '',
              p_track_id:    nowTrack.id,
              p_artist:      nowTrack.artist,
              p_title:       nowTrack.title,
              p_spotify_url: null,
              p_image_url:   null,
            }),
          });
        } catch { /* non-blocking — don't fail the response if Supabase is unreachable */ }
      }
    }

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ tracks, session }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
