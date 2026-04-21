/**
 * Netlify Function: /api/requests
 * Per-event song request store using Netlify Blobs.
 *
 * All endpoints accept ?event=<slug> to scope to a specific event.
 * Falls back to 'current' store key when no slug is provided.
 *
 * GET    /api/requests?event=slug  → return all requests for event (public)
 * POST   /api/requests?event=slug  → add a request for event (public)
 * PATCH  /api/requests?event=slug  → update status (admin — requires GitHub PAT)
 * DELETE /api/requests?event=slug  → clear all requests for event (admin)
 */

import { getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

async function isAdmin(req) {
  const auth  = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!auth) return false;
  try {
    const res = await fetch('https://api.github.com/repos/momoauxplatines/momoauxplatines.ca', {
      headers: { Authorization: `Bearer ${auth}`, Accept: 'application/vnd.github+json' }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.permissions?.push === true;
  } catch { return false; }
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  // Scope requests by event slug — falls back to 'current' for legacy calls
  const url      = new URL(req.url);
  const slug     = (url.searchParams.get('event') || '').replace(/[^a-z0-9-]/g, '').slice(0, 80);
  const storeKey = slug ? `event-${slug}` : 'current';

  const store = getStore({ name: 'requests', consistency: 'strong' });

  // ── GET ───────────────────────────────────────
  if (req.method === 'GET') {
    const raw  = await store.get(storeKey).catch(() => null);
    const list = raw ? JSON.parse(raw) : [];
    const isAdm = await isAdmin(req);
    const visible = isAdm ? list : list.filter(r => r.status !== 'deleted');
    return new Response(JSON.stringify(visible), { headers: CORS });
  }

  // ── POST ──────────────────────────────────────
  if (req.method === 'POST') {
    let body;
    try { body = await req.json(); } catch { return new Response('Bad JSON', { status: 400, headers: CORS }); }

    const raw  = await store.get(storeKey).catch(() => null);
    const list = raw ? JSON.parse(raw) : [];

    const entry = {
      id:     `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title:  String(body.title  || '').slice(0, 200),
      artist: String(body.artist || '').slice(0, 200),
      image:  String(body.image  || '').slice(0, 500),
      url:    String(body.url    || '').slice(0, 500),
      status: 'sent',
      ts:     Date.now(),
    };

    list.unshift(entry);
    list.splice(200); // keep last 200
    await store.set(storeKey, JSON.stringify(list));

    return new Response(JSON.stringify({ ok: true, id: entry.id }), { status: 201, headers: CORS });
  }

  // ── PATCH ─────────────────────────────────────
  if (req.method === 'PATCH') {
    if (!(await isAdmin(req))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
    }
    let body;
    try { body = await req.json(); } catch { return new Response('Bad JSON', { status: 400, headers: CORS }); }

    const raw  = await store.get(storeKey).catch(() => null);
    const list = raw ? JSON.parse(raw) : [];
    const idx  = list.findIndex(r => r.id === body.id);
    if (idx >= 0) {
      const allowed = ['played', 'sent', 'deleted'];
      list[idx].status = allowed.includes(body.status) ? body.status : 'sent';
    }
    await store.set(storeKey, JSON.stringify(list));

    return new Response(JSON.stringify({ ok: true }), { headers: CORS });
  }

  // ── DELETE ────────────────────────────────────
  if (req.method === 'DELETE') {
    if (!(await isAdmin(req))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
    }
    await store.set(storeKey, JSON.stringify([]));
    return new Response(JSON.stringify({ ok: true }), { headers: CORS });
  }

  return new Response('Method Not Allowed', { status: 405, headers: CORS });
};

export const config = { path: '/api/requests' };
