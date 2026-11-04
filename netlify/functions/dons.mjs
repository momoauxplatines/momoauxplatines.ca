/**
 * Netlify Function: /api/dons
 * Lit les dons publics de la campagne GoFundMe « Je cours. Tu donnes. On aide. »
 * (flux non officiel utilisé par la page publique — peut changer sans préavis).
 *
 * GET /api/dons
 *   → { updated_at, count, donations: [{ id, name, initials, amount, currency, created_at, anonymous, is_new }] }
 *
 * Règle « Nouveau » : don reçu il y a moins de 1 h (aucun sinon).
 * Cache : 30 s dans Netlify Blobs (+ dernière réponse valide gardée si GoFundMe échoue).
 */
import { getStore } from '@netlify/blobs';

const SLUG = 'je-cours-tu-donnes-on-aide';
const FEED = `https://gateway.gofundme.com/web-gateway/v1/feed/${SLUG}/donations`;
const CACHE_MS = 30 * 1000;
const NEW_MS = 60 * 60 * 1000;
const PAGE = 100;
const MAX = 500;

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=15',
};

const initials = (name) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'A';

async function fetchAll() {
  const out = [];
  for (let offset = 0; offset < MAX; offset += PAGE) {
    const res = await fetch(`${FEED}?limit=${PAGE}&offset=${offset}&sort=recent`, {
      headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0 (momoauxplatines.ca)' },
    });
    if (!res.ok) throw new Error(`GoFundMe ${res.status}`);
    const data = await res.json();
    const list = data?.references?.donations || [];
    out.push(...list);
    if (!data?.meta?.has_next || list.length < PAGE) break;
  }
  return out;
}

function normalize(raw) {
  const now = Date.now();
  return raw
    .filter((d) => !d.is_offline || d.amount)
    .map((d) => {
      const anonymous = !!d.is_anonymous || !d.name;
      const name = anonymous ? 'Anonyme' : String(d.name).trim();
      const created_at = d.created_at;
      return {
        id: d.donation_id ?? d.id,
        name,
        initials: anonymous ? 'A' : initials(name),
        amount: Number(d.amount) || 0,
        currency: d.currencycode || 'CAD',
        created_at,
        anonymous,
        is_new: now - new Date(created_at).getTime() < NEW_MS,
      };
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export default async () => {
  const store = getStore({ name: 'gofundme' });
  const cached = await store.get('donations', { type: 'json' }).catch(() => null);

  if (cached && Date.now() - cached.fetched_at < CACHE_MS) {
    return new Response(JSON.stringify(cached.payload), { headers: HEADERS });
  }

  try {
    const donations = normalize(await fetchAll());
    const payload = { updated_at: new Date().toISOString(), count: donations.length, donations };
    await store.setJSON('donations', { fetched_at: Date.now(), payload });
    return new Response(JSON.stringify(payload), { headers: HEADERS });
  } catch (err) {
    if (cached) {
      // GoFundMe indisponible : on sert la dernière liste connue (is_new recalculé)
      const donations = cached.payload.donations.map((d) => ({
        ...d,
        is_new: Date.now() - new Date(d.created_at).getTime() < NEW_MS,
      }));
      return new Response(JSON.stringify({ ...cached.payload, donations, stale: true }), { headers: HEADERS });
    }
    return new Response(JSON.stringify({ error: String(err.message || err) }), { status: 502, headers: HEADERS });
  }
};
