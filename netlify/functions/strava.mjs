/**
 * Netlify Function: /api/strava
 * Courses Strava du défi (par défaut : depuis le 1er novembre 2026, heure de Montréal).
 *
 * GET /api/strava[?after=2026-11-01T00:00:00-04:00]
 *   → { updated_at, total_km, count, runs: [{ id, name, start_date, start_date_local,
 *        distance_km, moving_time_s, pace_s_per_km, cadence_spm, polyline }] }
 *
 * Variables d'environnement : STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN
 * Strava peut faire tourner le refresh token : le plus récent est gardé dans Blobs.
 * Cache : 5 min. Affichage requis : « Powered by Strava ».
 */
import { getStore } from '@netlify/blobs';

const DEFAULT_AFTER = '2026-11-01T00:00:00-04:00';
const CACHE_MS = 5 * 60 * 1000;
const RUN_TYPES = new Set(['Run', 'TrailRun', 'VirtualRun']);

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=60',
};

async function getAccessToken(store) {
  const saved = await store.get('token', { type: 'json' }).catch(() => null);
  if (saved && saved.expires_at * 1000 > Date.now() + 60_000) return saved.access_token;

  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: saved?.refresh_token || process.env.STRAVA_REFRESH_TOKEN,
    }),
  });
  if (!res.ok) throw new Error(`Strava token ${res.status}`);
  const t = await res.json();
  await store.setJSON('token', {
    access_token: t.access_token,
    refresh_token: t.refresh_token,
    expires_at: t.expires_at,
  });
  return t.access_token;
}

async function fetchRuns(token, afterEpoch) {
  const all = [];
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${afterEpoch}&per_page=100&page=${page}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error(`Strava activities ${res.status}`);
    const list = await res.json();
    all.push(...list);
    if (list.length < 100) break;
  }
  return all
    .filter((a) => RUN_TYPES.has(a.sport_type || a.type))
    .map((a) => {
      const km = a.distance / 1000;
      return {
        id: a.id,
        name: a.name,
        start_date: a.start_date,
        start_date_local: a.start_date_local,
        distance_km: Math.round(km * 100) / 100,
        moving_time_s: a.moving_time,
        pace_s_per_km: km > 0 ? Math.round(a.moving_time / km) : null,
        cadence_spm: a.average_cadence ? Math.round(a.average_cadence * 2) : null,
        polyline: a.map?.summary_polyline || null,
      };
    })
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
}

export default async (req) => {
  const after = new URL(req.url).searchParams.get('after') || DEFAULT_AFTER;
  const afterEpoch = Math.floor(new Date(after).getTime() / 1000);
  if (!Number.isFinite(afterEpoch)) {
    return new Response(JSON.stringify({ error: 'Paramètre after invalide' }), { status: 400, headers: HEADERS });
  }

  const store = getStore({ name: 'strava' });
  const key = `runs-${afterEpoch}`;
  const cached = await store.get(key, { type: 'json' }).catch(() => null);
  if (cached && Date.now() - cached.fetched_at < CACHE_MS) {
    return new Response(JSON.stringify(cached.payload), { headers: HEADERS });
  }

  try {
    const runs = await fetchRuns(await getAccessToken(store), afterEpoch);
    const total_km = Math.round(runs.reduce((s, r) => s + r.distance_km, 0) * 10) / 10;
    const payload = { updated_at: new Date().toISOString(), total_km, count: runs.length, runs };
    await store.setJSON(key, { fetched_at: Date.now(), payload });
    return new Response(JSON.stringify(payload), { headers: HEADERS });
  } catch (err) {
    if (cached) return new Response(JSON.stringify({ ...cached.payload, stale: true }), { headers: HEADERS });
    return new Response(JSON.stringify({ error: String(err.message || err) }), { status: 502, headers: HEADERS });
  }
};
