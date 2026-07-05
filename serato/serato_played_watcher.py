#!/usr/bin/env python3
"""
Serato "bascule à l'éjection" → Supabase played_tracks
------------------------------------------------------
Surveille le fichier de session live de Serato DJ. Quand une piste est
éjectée (ou remplacée sur un deck) ET qu'elle a joué au moins
MIN_PLAYTIME secondes, elle est ajoutée à la table `played_tracks`,
enrichie via l'API Spotify (lien + pochette).

Dépendances : aucune (Python 3.9+, stdlib seulement).

Configuration : variables d'environnement ou fichier .env à côté du script.
  SUPABASE_URL              ex. https://rxypcvyvgzdercoxvqsk.supabase.co
  SUPABASE_SERVICE_KEY      clé service_role (Dashboard > Settings > API)
  SPOTIFY_CLIENT_ID         (optionnel — sans ça, pas d'enrichissement)
  SPOTIFY_CLIENT_SECRET     (optionnel)
  GIG_DATE                  défaut : date du jour (YYYY-MM-DD)
  MIN_PLAYTIME              défaut : 30 (secondes)
  SERATO_DIR                défaut : ~/Music/_Serato_
  POLL_SECONDS              défaut : 3

Lancement :  python3 serato_played_watcher.py
Arrêt     :  Ctrl+C
"""

import json
import os
import struct
import sys
import time
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

# ---------------------------------------------------------------- config

def load_dotenv():
    p = Path(__file__).parent / ".env"
    if p.exists():
        for line in p.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
SPOTIFY_CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID", "")
SPOTIFY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET", "")
GIG_DATE = os.environ.get("GIG_DATE") or date.today().isoformat()
MIN_PLAYTIME = int(os.environ.get("MIN_PLAYTIME", "30"))
SERATO_DIR = Path(os.environ.get("SERATO_DIR", str(Path.home() / "Music" / "_Serato_")))
POLL_SECONDS = float(os.environ.get("POLL_SECONDS", "3"))

SESSIONS_DIR = SERATO_DIR / "History" / "Sessions"

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    sys.exit("Config manquante: SUPABASE_URL et SUPABASE_SERVICE_KEY sont requis (.env).")

# ------------------------------------------------- parseur .session Serato
# Format: suite de chunks [tag 4 octets][longueur u32 BE][payload].
# Les entrées de piste sont des chunks 'oent' contenant un chunk 'adat'.
# 'adat' = suite de champs [id u32 BE][longueur u32 BE][valeur].
# Les chaînes sont en UTF-16 big-endian.

FIELD_ROW_ID = 1
FIELD_TITLE = 6
FIELD_ARTIST = 7
FIELD_START = 28   # unix timestamp (u32)
FIELD_END = 29     # unix timestamp (u32)
FIELD_DECK = 31
FIELD_PLAYTIME = 45  # secondes (u32)
FIELD_PLAYED = 50    # bool (u8)

def _u32(b):
    return struct.unpack(">I", b)[0] if len(b) == 4 else None

def _text(b):
    try:
        return b.decode("utf-16-be").rstrip("\x00").strip()
    except UnicodeDecodeError:
        return b.decode("latin-1", errors="replace").strip()

def parse_adat(payload):
    fields, i = {}, 0
    while i + 8 <= len(payload):
        fid = struct.unpack(">I", payload[i:i + 4])[0]
        ln = struct.unpack(">I", payload[i + 4:i + 8])[0]
        val = payload[i + 8:i + 8 + ln]
        i += 8 + ln
        fields[fid] = val
    return fields

def parse_session(data):
    """Retourne {row_id: entry_dict}, les occurrences tardives écrasent."""
    rows, i = {}, 0
    while i + 8 <= len(data):
        tag = data[i:i + 4]
        ln = struct.unpack(">I", data[i + 4:i + 8])[0]
        payload = data[i + 8:i + 8 + ln]
        i += 8 + ln
        if tag != b"oent":
            continue
        # oent contient un chunk adat
        if len(payload) >= 8 and payload[0:4] == b"adat":
            adat_len = struct.unpack(">I", payload[4:8])[0]
            f = parse_adat(payload[8:8 + adat_len])
        else:
            f = parse_adat(payload)
        row_id = _u32(f.get(FIELD_ROW_ID, b""))
        if row_id is None:
            continue
        entry = rows.setdefault(row_id, {})
        if FIELD_TITLE in f:
            entry["title"] = _text(f[FIELD_TITLE])
        if FIELD_ARTIST in f:
            entry["artist"] = _text(f[FIELD_ARTIST])
        if FIELD_START in f:
            entry["start"] = _u32(f[FIELD_START])
        if FIELD_END in f:
            entry["end"] = _u32(f[FIELD_END])
        if FIELD_DECK in f:
            entry["deck"] = _u32(f[FIELD_DECK])
        if FIELD_PLAYTIME in f:
            entry["playtime"] = _u32(f[FIELD_PLAYTIME])
        if FIELD_PLAYED in f and len(f[FIELD_PLAYED]) >= 1:
            entry["played"] = bool(f[FIELD_PLAYED][0])
    return rows

def latest_session_file():
    if not SESSIONS_DIR.exists():
        return None
    files = sorted(SESSIONS_DIR.glob("*.session"), key=lambda p: p.stat().st_mtime)
    return files[-1] if files else None

# --------------------------------------------------------------- Spotify

_spotify_token = {"value": None, "expires": 0}

def spotify_token():
    if not SPOTIFY_CLIENT_ID:
        return None
    if _spotify_token["value"] and time.time() < _spotify_token["expires"] - 60:
        return _spotify_token["value"]
    body = urllib.parse.urlencode({
        "grant_type": "client_credentials",
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET,
    }).encode()
    req = urllib.request.Request(
        "https://accounts.spotify.com/api/token", data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            d = json.load(r)
        _spotify_token["value"] = d["access_token"]
        _spotify_token["expires"] = time.time() + d.get("expires_in", 3600)
        return d["access_token"]
    except Exception as e:
        print(f"  ! Spotify token: {e}")
        return None

def spotify_enrich(artist, title):
    tok = spotify_token()
    if not tok:
        return None, None
    q = urllib.parse.quote(f"track:{title} artist:{artist}")
    req = urllib.request.Request(
        f"https://api.spotify.com/v1/search?type=track&limit=1&q={q}",
        headers={"Authorization": f"Bearer {tok}"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            d = json.load(r)
        items = d.get("tracks", {}).get("items", [])
        if not items:
            return None, None
        t = items[0]
        images = t.get("album", {}).get("images", [])
        image = images[1]["url"] if len(images) > 1 else (images[0]["url"] if images else None)
        return t.get("external_urls", {}).get("spotify"), image
    except Exception as e:
        print(f"  ! Spotify search: {e}")
        return None, None

def itunes_image(artist, title):
    """Repli pochette via iTunes (gratuit, sans auth) quand Spotify échoue."""
    term = urllib.parse.quote(f"{title} {artist}".strip())
    req = urllib.request.Request(
        f"https://itunes.apple.com/search?term={term}&media=music&entity=song&limit=5")
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            d = json.load(r)
        results = d.get("results", [])
        low = title.lower()
        track = next((t for t in results
                      if low in (t.get("trackName") or "").lower()), None) \
            or (results[0] if results else None)
        if not track:
            return None
        art = track.get("artworkUrl100") or ""
        return art.replace("100x100bb", "400x400bb") or None
    except Exception as e:
        print(f"  ! iTunes search: {e}")
        return None

def enrich(artist, title):
    spotify_url, image_url = spotify_enrich(artist, title)
    if not image_url:
        image_url = itunes_image(artist, title)
    return spotify_url, image_url

# --------------------------------------------------------------- Supabase

def supabase_insert(row):
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/played_tracks",
        data=json.dumps(row).encode(),
        headers={
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
            "Content-Type": "application/json",
            # ignore les doublons (unique session_name + serato_row_id)
            "Prefer": "resolution=ignore-duplicates",
        }, method="POST")
    try:
        urllib.request.urlopen(req, timeout=10)
        return True
    except Exception as e:
        print(f"  ! Supabase: {e}")
        return False

def already_inserted_ids(session_name):
    """Au démarrage, récupère les row_ids déjà insérés pour cette session."""
    q = urllib.parse.urlencode({
        "select": "serato_row_id",
        "session_name": f"eq.{session_name}",
    })
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/played_tracks?{q}",
        headers={"apikey": SUPABASE_SERVICE_KEY,
                 "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return {row["serato_row_id"] for row in json.load(r)}
    except Exception:
        return set()

# ------------------------------------------------------------------ boucle

def is_ejected(entry):
    """Une piste compte comme « jouée » quand elle est éjectée/remplacée
    (end présent) et qu'elle a joué assez longtemps."""
    if "end" not in entry or not entry.get("end"):
        return False
    playtime = entry.get("playtime")
    if playtime is None and entry.get("start"):
        playtime = entry["end"] - entry["start"]
    entry["_playtime"] = playtime or 0
    return (playtime or 0) >= MIN_PLAYTIME

def main():
    print(f"Watcher Serato — seuil {MIN_PLAYTIME}s — gig {GIG_DATE}")
    print(f"Dossier sessions : {SESSIONS_DIR}")
    current_file, done = None, set()

    while True:
        f = latest_session_file()
        if f is None:
            print("Aucun fichier .session — en attente d'une session Serato…")
            time.sleep(10)
            continue
        if f != current_file:
            current_file = f
            done = already_inserted_ids(f.name)
            print(f"Session active : {f.name} ({len(done)} piste(s) déjà envoyée(s))")

        try:
            rows = parse_session(f.read_bytes())
        except Exception as e:
            print(f"  ! parse: {e}")
            time.sleep(POLL_SECONDS)
            continue

        for row_id, entry in sorted(rows.items()):
            if row_id in done or not is_ejected(entry):
                continue
            artist = entry.get("artist") or ""
            title = entry.get("title") or ""
            if not title:
                done.add(row_id)
                continue
            spotify_url, image_url = enrich(artist, title)
            row = {
                "gig_date": GIG_DATE,
                "artist": artist,
                "title": title,
                "spotify_url": spotify_url,
                "image_url": image_url,
                "playtime_seconds": entry["_playtime"],
                "session_name": f.name,
                "serato_row_id": row_id,
            }
            if supabase_insert(row):
                done.add(row_id)
                print(f"  ✓ Jouée : {artist} – {title} ({entry['_playtime']}s)")

        time.sleep(POLL_SECONDS)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nArrêt.")
