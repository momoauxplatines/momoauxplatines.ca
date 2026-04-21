/**
 * Momo Aux Platines — Serveur de prévisualisation local
 *
 * Lance avec : npm run preview
 * Disponible à : http://localhost:3000
 *
 * Simule toutes les routes API à partir des fichiers locaux.
 * Aucune dépendance, aucun crédit Netlify.
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.mp4':  'video/mp4',
  '.mp3':  'audio/mpeg',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

function json(res, data, status = 200) {
  res.writeHead(status, CORS);
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const parsed   = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsed.pathname);

  // OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    return res.end();
  }

  // ── API ─────────────────────────────────────────────────────────────────────

  // GET /api/events  →  events.json local
  if (pathname === '/api/events' && req.method === 'GET') {
    try {
      const data = fs.readFileSync(path.join(ROOT, 'events.json'), 'utf8');
      return json(res, JSON.parse(data));
    } catch {
      return json(res, { events: [] });
    }
  }

  // GET /api/requests  →  liste vide (pas de données en preview)
  if (pathname === '/api/requests' && req.method === 'GET') {
    return json(res, []);
  }

  // POST /api/requests  →  accepte la requête, retourne un id fictif
  if (pathname === '/api/requests' && req.method === 'POST') {
    return json(res, { ok: true, id: `preview-${Date.now()}` }, 201);
  }

  // GET /api/live  →  playlist vide
  if (pathname === '/api/live') {
    return json(res, { tracks: [], session: null });
  }

  // GET /api/copy  →  fichiers copy/ locaux
  if (pathname === '/api/copy' && req.method === 'GET') {
    const lang = ['fr', 'en'].includes(parsed.query.lang) ? parsed.query.lang : 'en';
    try {
      const data = fs.readFileSync(path.join(ROOT, 'copy', `${lang}.json`), 'utf8');
      return json(res, JSON.parse(data));
    } catch {
      return json(res, {});
    }
  }

  // ── Redirects ────────────────────────────────────────────────────────────────
  const REDIRECTS = {
    '/requests':          '/request.html',
    '/demandesspeciales': '/demandespeciale.html',
    '/demandespeciale':   '/demandespeciale.html',
  };
  if (REDIRECTS[pathname]) {
    res.writeHead(302, { Location: REDIRECTS[pathname] + (parsed.search || '') });
    return res.end();
  }

  // ── Fichiers statiques ───────────────────────────────────────────────────────
  let filePath = path.join(ROOT, pathname);

  // Dossier → index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 — fichier non trouvé');
  }

  const ext         = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch {
    res.writeHead(500);
    res.end('Erreur serveur');
  }
});

server.listen(PORT, () => {
  console.log('\n🎧  Momo Aux Platines — Prévisualisation\n');
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   http://localhost:${PORT}/request.html`);
  console.log(`   http://localhost:${PORT}/admin/\n`);
  console.log('   Ctrl+C pour arrêter\n');
});
