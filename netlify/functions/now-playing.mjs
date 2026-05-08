/**
 * Netlify Function: /api/now-playing
 * Allows the admin to manually set the "Now Playing" track.
 * Calls the Supabase RPC which broadcasts via Realtime to all open gig pages.
 *
 * POST /api/now-playing  (admin — requires GitHub PAT)
 *   Body: { gig_date, track_id, artist, title, image_url, spotify_url }
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

async function isAdmin(req) {
  const auth = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!auth) return false;
  try {
    const res = await fetch('https://api.github.com/repos/momoauxplatines/momoauxplatines.ca', {
      headers: { Authorization: `Bearer ${auth}`, Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.permissions?.push === true;
  } catch { return false; }
}

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: CORS });
  }

  if (!(await isAdmin(req))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
  }

  const { gig_date, track_id, artist, title, image_url, spotify_url } = await req.json();

  const sbUrl    = process.env.SUPABASE_URL;
  const sbKey    = process.env.SUPABASE_ANON_KEY;
  const sbSecret = process.env.SUPABASE_NP_SECRET;

  if (!sbUrl || !sbKey || !sbSecret) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), { status: 503, headers: CORS });
  }

  const rpcRes = await fetch(`${sbUrl}/rest/v1/rpc/update_now_playing_track`, {
    method: 'POST',
    headers: {
      'apikey': sbKey,
      'Authorization': `Bearer ${sbKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      p_secret:      sbSecret,
      p_gig_date:    gig_date    || '',
      p_track_id:    track_id   || '',
      p_artist:      artist     || '',
      p_title:       title      || '',
      p_spotify_url: spotify_url || null,
      p_image_url:   image_url  || null,
    }),
  });

  if (!rpcRes.ok) {
    const err = await rpcRes.text();
    return new Response(JSON.stringify({ error: err }), { status: 502, headers: CORS });
  }

  return new Response(JSON.stringify({ ok: true }), { headers: CORS });
};

export const config = { path: '/api/now-playing' };
