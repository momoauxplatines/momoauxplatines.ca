/**
 * Netlify Function: /api/images
 * Serve and store binary image data using Netlify Blobs.
 * No deploy needed — writes go directly to the Blob store.
 *
 * GET /api/images?key=events/venue-slug.jpg  → return raw image bytes (public)
 * PUT /api/images?key=events/venue-slug.jpg  → store image bytes   (admin — requires GitHub PAT)
 */

import { getStore } from '@netlify/blobs';

const CORS_PUBLIC = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const MIME = {
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  gif:  'image/gif',
  webp: 'image/webp',
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
    return new Response(null, { status: 204, headers: CORS_PUBLIC });
  }

  const url = new URL(req.url);
  const key = url.searchParams.get('key');
  if (!key) return new Response('Missing key', { status: 400 });

  const store = getStore('momo-images');

  // ── GET ─────────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const buf = await store.get(key, { type: 'arrayBuffer' }).catch(() => null);
    if (!buf) return new Response('Not found', { status: 404 });
    const ext = key.split('.').pop().toLowerCase();
    const ct  = MIME[ext] || 'application/octet-stream';
    return new Response(buf, {
      headers: {
        ...CORS_PUBLIC,
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // ── PUT ─────────────────────────────────────────────────────────────────────
  if (req.method === 'PUT') {
    if (!(await isAdmin(req))) {
      return new Response('Unauthorized', { status: 401, headers: CORS_PUBLIC });
    }
    const body = await req.arrayBuffer();
    if (!body.byteLength) return new Response('Empty body', { status: 400, headers: CORS_PUBLIC });
    await store.set(key, body);
    return new Response(JSON.stringify({ ok: true, key }), {
      headers: { ...CORS_PUBLIC, 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405, headers: CORS_PUBLIC });
};

export const config = { path: '/api/images' };
