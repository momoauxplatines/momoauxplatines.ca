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

// Simple HTTPS GET with redirect support
function get(url, redirects = 0) {
  if (redirects > 5) return Promise.reject(new Error('Too many redirects'));
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : `https://serato.com${res.headers.location}`;
        res.resume();
        return get(next, redirects + 1).then(resolve).catch(reject);
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
  const tracks = [];
  const re = /id="(track_\d+)"[\s\S]*?class="playlist-trackname"[^>]*>\s*([\s\S]*?)\s*<\/div>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = decodeHtmlEntities(m[2].replace(/<[^>]+>/g, '').trim());
    if (!raw) continue;
    const { artist, title } = parseTrackName(raw);
    tracks.push({ id: m[1], artist, title });
  }
  tracks.reverse(); // most recent first
  return tracks;
}

// Find a session slug matching a target ISO date by scanning the listings page.
// Split on playlist-card boundaries so slug+date are always paired correctly.
function findSlugByDate(listingsHtml, targetDate) {
  const cards = listingsHtml.split(/<div\s+id="pl-\d+"/);
  for (const card of cards.slice(1)) {
    const slugMatch = card.match(
      new RegExp(`href="/playlists/${SERATO_USER}/([^"/?#]+)"`)
    );
    const dateMatch = card.match(/<span class="playlist-start-time">([^<]+)<\/span>/);
    if (!slugMatch || !dateMatch) continue;
    const iso = seratoDateToISO(dateMatch[1]);
    if (iso === targetDate) return slugMatch[1];
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

    if (liveHtml.includes('playlist-trackname')) {
      // Active session in progress — parse tracks directly from the /live page.
      // No slug matching needed: the DJ is streaming right now.
      tracks = parseTracks(liveHtml);
      session = 'live';
    } else if (targetDate) {
      // No active session — look up a completed session by date.

      // 2a. Try the permanent date slug URL directly.
      const directHtml = await get(`https://serato.com/playlists/${SERATO_USER}/${targetDate}`);
      if (directHtml.includes('playlist-trackname')) {
        tracks = parseTracks(directHtml);
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
