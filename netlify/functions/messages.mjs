/**
 * Netlify Function: /api/messages
 * Per-event messages store using Netlify Blobs.
 *
 * GET    /api/messages?event=slug  → return all messages (admin — requires GitHub PAT)
 * POST   /api/messages?event=slug  → add a message (public)
 * DELETE /api/messages?event=slug  → clear all messages (admin)
 */

import { getStore } from '@netlify/blobs';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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

  const url   = new URL(req.url);
  const event = url.searchParams.get('event') || 'current';
  const store = getStore({ name: 'messages', consistency: 'strong' });
  const key   = `msg_${event}`;

  // ── GET ──────────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    if (!(await isAdmin(req))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
    }
    const raw  = await store.get(key).catch(() => null);
    const msgs = raw ? JSON.parse(raw) : [];
    return new Response(JSON.stringify(msgs), { headers: CORS });
  }

  // ── POST ─────────────────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const body = await req.json().catch(() => ({}));
    const text = (body.text || body.message || '').trim().slice(0, 500);
    if (!text) {
      return new Response(JSON.stringify({ error: 'Empty message' }), { status: 400, headers: CORS });
    }
    const raw  = await store.get(key).catch(() => null);
    const msgs = raw ? JSON.parse(raw) : [];
    const newMsg = {
      id:   Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text,
      ts:   Date.now(),
    };
    msgs.unshift(newMsg);
    await store.set(key, JSON.stringify(msgs));
    return new Response(JSON.stringify({ ok: true, message: newMsg }), { headers: CORS });
  }

  // ── DELETE ───────────────────────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    if (!(await isAdmin(req))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
    }
    await store.delete(key).catch(() => null);
    return new Response(JSON.stringify({ ok: true }), { headers: CORS });
  }

  return new Response('Method Not Allowed', { status: 405 });
};

export const config = { path: '/api/messages' };
