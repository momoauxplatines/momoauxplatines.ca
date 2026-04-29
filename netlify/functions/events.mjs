/**
 * Netlify Function: /api/events
 * Serve and store events JSON using Netlify Blobs.
 * No deploy needed — writes go directly to the Blob store.
 *
 * GET  /api/events  → return events JSON (public)
 * PUT  /api/events  → save events JSON   (admin — requires GitHub PAT)
 */

import { getStore } from '@netlify/blobs';
import { readFileSync } from 'fs';
import { join } from 'path';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
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

  const store = getStore({ name: 'events', consistency: 'strong' });

  // ── GET ──────────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const raw = await store.get('events').catch(() => null);
    if (raw) {
      return new Response(raw, { headers: CORS });
    }
    // First-run fallback: serve the static file that was last deployed
    try {
      const data = readFileSync(join(process.cwd(), 'events.json'), 'utf8');
      return new Response(data, { headers: CORS });
    } catch {
      return new Response('{"events":[]}', { headers: CORS });
    }
  }

  // ── PUT ──────────────────────────────────────────────────────────────────────
  if (req.method === 'PUT') {
    if (!(await isAdmin(req))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
    }
    const body = await req.text();
    await store.set('events', body);
    return new Response(JSON.stringify({ ok: true }), { headers: CORS });
  }

  return new Response('Method Not Allowed', { status: 405, headers: CORS });
};

export const config = { path: '/api/events' };
