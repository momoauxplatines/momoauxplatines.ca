/**
 * Netlify Function: /api/copy
 * Serve and store localisation copy JSON using Netlify Blobs.
 * No deploy needed — writes go directly to the Blob store.
 *
 * GET  /api/copy?lang=en  → return copy JSON (public)
 * PUT  /api/copy?lang=en  → save copy JSON   (admin — requires GitHub PAT)
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

  const url  = new URL(req.url);
  const lang = url.searchParams.get('lang') || 'en';
  if (!['en', 'fr'].includes(lang)) {
    return new Response(JSON.stringify({ error: 'Invalid lang' }), { status: 400, headers: CORS });
  }

  const store = getStore({ name: 'copy', consistency: 'strong' });

  // ── GET ──────────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    // Load static seed (always present after deploy)
    let staticData = {};
    try {
      staticData = JSON.parse(readFileSync(join(process.cwd(), 'copy', `${lang}.json`), 'utf8'));
    } catch { /* no static file — proceed with empty */ }

    // Load blob override (may be absent on first run)
    const blobRaw = await store.get(`copy-${lang}`).catch(() => null);
    const blobData = blobRaw ? JSON.parse(blobRaw) : {};

    // Shallow merge: static values are the defaults, blob values win
    const merged = { ...staticData, ...blobData };

    // Smart registry merge: union(staticIds, blobOnlyIds) minus tombstoned IDs
    const staticIds  = (staticData['demos.registry'] || '').split('|').filter(Boolean);
    const blobIds    = (blobData['demos.registry']   || '').split('|').filter(Boolean);
    const blobOnlyIds = blobIds.filter(id => !staticIds.includes(id));
    const tombstoned  = staticIds.filter(id => blobData[`demos.${id}.deleted`] === 'true');
    merged['demos.registry'] = [
      ...staticIds.filter(id => !tombstoned.includes(id)),
      ...blobOnlyIds,
    ].join('|');

    return new Response(JSON.stringify(merged), { headers: CORS });
  }

  // ── PUT ──────────────────────────────────────────────────────────────────────
  if (req.method === 'PUT') {
    if (!(await isAdmin(req))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
    }
    const body = await req.text();
    await store.set(`copy-${lang}`, body);
    return new Response(JSON.stringify({ ok: true }), { headers: CORS });
  }

  return new Response('Method Not Allowed', { status: 405, headers: CORS });
};

export const config = { path: '/api/copy' };
