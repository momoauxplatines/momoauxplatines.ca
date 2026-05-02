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

function parseTracks(html) {
  const tracks = [];
  const re = /id="(track_\d+)"[\s\S]*?class="playlist-trackname"[^>]*>\s*([\s\S]*?)\s*<\/div>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[2].replace(/<[^>]+>/g, '').trim();
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

    if (targetDate) {
      // 1a. Try the date as a direct slug — live sessions are usually named YYYY-MM-DD
      const directUrl = `https://serato.com/playlists/${SERATO_USER}/${targetDate}`;
      const directHtml = await get(directUrl);
      if (directHtml.includes('playlist-trackname')) {
        session = targetDate;
      } else {
        // 1b. Scan the public listings page for a playlist whose date matches
        const listingsHtml = await get(`https://serato.com/playlists/${SERATO_USER}`);
        session = findSlugByDate(listingsHtml, targetDate);
      }
    } else {
      // Legacy / demo mode: use the most recent live session
      const indexHtml = await get(`https://serato.com/playlists/${SERATO_USER}/live`);
      const slugMatch = indexHtml.match(
        new RegExp(`href="/playlists/${SERATO_USER}/([^"/?#]+)"`)
      );
      if (slugMatch) session = slugMatch[1];
    }

    if (!session) {
      return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ tracks: [], session: null }),
      };
    }

    // 2. Fetch the session page and parse tracks
    const sessionHtml = await get(`https://serato.com/playlists/${SERATO_USER}/${session}`);
    const tracks = parseTracks(sessionHtml);

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
