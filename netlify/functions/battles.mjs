/**
 * Netlify Function: /api/battles
 * Per-event song battle store using Netlify Blobs.
 *
 * All endpoints accept ?event=<slug> to scope to a specific event.
 *
 * GET    /api/battles?event=slug  → return all battles for event (public)
 * POST   /api/battles?event=slug  → create a battle (admin)
 * PATCH  /api/battles?event=slug  → update battle status (admin)
 * DELETE /api/battles?event=slug  → clear all battles for event (admin)
 *
 * Battle object shape:
 * {
 *   id:         string,          // unique ID
 *   status:     'pending' | 'active' | 'ended',
 *   duration:   number,          // vote window in seconds
 *   songs:      Array<{ id, title, artist, image, url }>,  // 2–5 songs
 *   started_at: number | null,   // ms timestamp
 *   ended_at:   number | null,
 *   ts:         number,          // created timestamp
 * }
 */

import { getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  const url      = new URL(req.url);
  const slug     = (url.searchParams.get('event') || '').replace(/[^a-z0-9-]/g, '').slice(0, 80);
  const storeKey = slug ? `event-${slug}` : 'current';

  const store = getStore({ name: 'battles', consistency: 'strong' });

  // ── GET ───────────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const raw  = await store.get(storeKey).catch(() => null);
    const list = raw ? JSON.parse(raw) : [];
    return new Response(JSON.stringify(list), { headers: CORS });
  }

  // ── POST ──────────────────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    if (!(await isAdmin(req))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
    }
    let body;
    try { body = await req.json(); } catch { return new Response('Bad JSON', { status: 400, headers: CORS }); }

    const songs = (body.songs || []).slice(0, 5).map((s, i) => ({
      id:     `${Date.now()}-${i}`,
      title:  String(s.title  || '').slice(0, 200),
      artist: String(s.artist || '').slice(0, 200),
      image:  String(s.image  || '').slice(0, 500),
      url:    String(s.url    || '').slice(0, 500),
    }));

    if (songs.length < 2) {
      return new Response(JSON.stringify({ error: 'At least 2 songs required' }), { status: 400, headers: CORS });
    }

    const duration = Math.max(30, Math.min(3600, parseInt(body.duration) || 300));

    const entry = {
      id:         `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status:     'pending',
      duration,
      songs,
      started_at: null,
      ended_at:   null,
      ts:         Date.now(),
    };

    const raw  = await store.get(storeKey).catch(() => null);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(entry);
    list.splice(50); // keep last 50 battles
    await store.set(storeKey, JSON.stringify(list));

    return new Response(JSON.stringify({ ok: true, id: entry.id, battle: entry }), { status: 201, headers: CORS });
  }

  // ── PATCH ─────────────────────────────────────────────────────────────────────
  if (req.method === 'PATCH') {
    if (!(await isAdmin(req))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
    }
    let body;
    try { body = await req.json(); } catch { return new Response('Bad JSON', { status: 400, headers: CORS }); }

    const raw  = await store.get(storeKey).catch(() => null);
    const list = raw ? JSON.parse(raw) : [];
    const idx  = list.findIndex(b => b.id === body.id);
    if (idx < 0) {
      return new Response(JSON.stringify({ error: 'Battle not found' }), { status: 404, headers: CORS });
    }

    const battle = list[idx];
    const allowed = ['pending', 'active', 'ended'];
    if (body.status && allowed.includes(body.status)) {
      battle.status = body.status;
      if (body.status === 'active' && !battle.started_at) {
        battle.started_at = Date.now();
      }
      if (body.status === 'ended' && !battle.ended_at) {
        battle.ended_at = Date.now();
      }
    }

    await store.set(storeKey, JSON.stringify(list));
    return new Response(JSON.stringify({ ok: true, battle }), { headers: CORS });
  }

  // ── DELETE ────────────────────────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    if (!(await isAdmin(req))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
    }
    await store.set(storeKey, JSON.stringify([]));
    return new Response(JSON.stringify({ ok: true }), { headers: CORS });
  }

  return new Response('Method Not Allowed', { status: 405, headers: CORS });
};

export const config = { path: '/api/battles' };
