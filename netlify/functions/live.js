/**
 * Netlify Function: /api/live
 * Proxies Serato playlist data to avoid CORS.
 * Returns the most recent session's tracks as JSON.
 * Spotify artwork is looked up client-side using the credentials in request.html.
 */

const https = require('https');

const SERATO_USER = 'DJ_Muhammad_Alias';

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
  // Strip (Explicit), (feat. ...) from track names
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

exports.handler = async () => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };

  try {
    // 1. Fetch the profile page to find the most recent session slug
    const indexHtml = await get(`https://serato.com/playlists/${SERATO_USER}/live`);

    // First playlist link in the index (most recent session)
    const slugMatch = indexHtml.match(
      new RegExp(`href="\/playlists\/${SERATO_USER}\/([^"/?#]+)"`)
    );
    if (!slugMatch) {
      return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ tracks: [], session: null })
      };
    }
    const session = slugMatch[1];

    // 2. Fetch the session page
    const sessionHtml = await get(`https://serato.com/playlists/${SERATO_USER}/${session}`);

    // 3. Parse .playlist-track elements
    const tracks = [];
    const re = /id="(track_\d+)"[\s\S]*?class="playlist-trackname"[^>]*>\s*([\s\S]*?)\s*<\/div>/g;
    let m;
    while ((m = re.exec(sessionHtml)) !== null) {
      const raw = m[2].replace(/<[^>]+>/g, '').trim(); // strip any inner tags
      if (!raw) continue;
      const { artist, title } = parseTrackName(raw);
      tracks.push({ id: m[1], artist, title });
    }

    // Most recent track first
    tracks.reverse();

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ tracks, session })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message })
    };
  }
};
