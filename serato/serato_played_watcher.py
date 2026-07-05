#!/usr/bin/env python3
"""
Serato "bascule à l'éjection" → Supabase played_tracks
------------------------------------------------------
Lit l'historique moderne de Serato DJ (base SQLite
~/Library/Application Support/Serato/Library/master.sqlite).

Une piste est « jouée » quand elle est remplacée sur son deck (éjection)
et qu'elle a joué au moins MIN_PLAYTIME secondes. Elle est alors insérée
dans la table Supabase `played_tracks`, enrichie via Spotify (lien) et
iTunes (pochette en repli).

Dépendances : aucune (Python 3.9+, stdlib seulement).

Configuration : variables d'environnement ou fichier .env à côté du script.
  SUPABASE_URL              ex. https://xxxx.supabase.co
  SUPABASE_SERVICE_KEY      clé secrète (sb_secret_… ou service_role legacy)
  SPOTIFY_CLIENT_ID         (optionnel)
  SPOTIFY_CLIENT_SECRET     (optionnel)
  GIG_DATE                  fixe la date (défaut : date de fin de lecture,
                            moins 6 h — l'après-minuit reste sur la veille)
  MIN_PLAYTIME              défaut : 30 (secondes)
  SERATO_LIBRARY_DB         défaut : ~/Library/Application Support/Serato/
                            Library/master.sqlite
  POLL_SECONDS              défaut : 3
"""

import json
import os
import sqlite3
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Journal : chaque ligne est horodatée
_print = print
def print(*args, **kwargs):  # noqa: A001
    _print(datetime.now().strftime("[%Y-%m-%d %H:%M:%S]"), *args, **kwargs)

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
GIG_DATE_OVERRIDE = os.environ.get("GIG_DATE")
MIN_PLAYTIME = int(os.environ.get("MIN_PLAYTIME", "30"))
POLL_SECONDS = float(os.environ.get("POLL_SECONDS", "3"))
LIBRARY_DB = Path(os.environ.get(
    "SERATO_LIBRARY_DB",
    str(Path.home() / "Library" / "Application Support" / "Serato"
        / "Library" / "master.sqlite")))

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    sys.exit("Config manquante: SUPABASE_URL et SUPABASE_SERVICE_KEY sont requis (.env).")

def gig_date_for(end_epoch):
    """Date de l'évènement pour une piste terminée à `end_epoch`.
    Avant 6 h du matin, la piste reste rattachée à la soirée de la veille."""
    if GIG_DATE_OVERRIDE:
        return GIG_DATE_OVERRIDE
    return (datetime.fromtimestamp(end_epoch) - timedelta(hours=6)).date().isoformat()

# ------------------------------------------------- historique Serato (SQLite)

def open_library():
    uri = f"file:{urllib.parse.quote(str(LIBRARY_DB))}?mode=ro"
    con = sqlite3.connect(uri, uri=True, timeout=2)
    con.row_factory = sqlite3.Row
    return con

def latest_session(cur):
    row = cur.execute(
        "select id, name from history_session order by id desc limit 1").fetchone()
    return (row["id"], row["name"]) if row else (None, None)

def ejected_entries(cur, session_id, now_epoch):
    """Pistes remplacées sur leur deck (éjectées), terminées, assez jouées.
    Une entrée est « éjectée » quand une entrée plus récente existe sur le
    même deck — la dernière piste de chaque deck reste en attente."""
    return cur.execute("""
        select e.id, e.artist, e.name, e.start_time, e.end_time, e.deck
        from history_entry e
        where e.session_id = :sid
          and e.played = 1
          and e.end_time > e.start_time
          and e.end_time <= :now
          and exists (
            select 1 from history_entry n
            where n.session_id = e.session_id
              and n.deck = e.deck and n.id > e.id)
        order by e.end_time
    """, {"sid": session_id, "now": now_epoch}).fetchall()

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
        low = (title or "").lower()
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

def _sb_headers():
    """Nouvelles clés sb_secret_… : en-tête apikey seul.
    Clés JWT legacy (eyJ…) : apikey + Authorization Bearer."""
    h = {"apikey": SUPABASE_SERVICE_KEY}
    if not SUPABASE_SERVICE_KEY.startswith("sb_"):
        h["Authorization"] = f"Bearer {SUPABASE_SERVICE_KEY}"
    return h

def supabase_insert(row):
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/played_tracks",
        data=json.dumps(row).encode(),
        headers={
            **_sb_headers(),
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
    q = urllib.parse.urlencode({
        "select": "serato_row_id",
        "session_name": f"eq.{session_name}",
    })
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/played_tracks?{q}",
        headers=_sb_headers())
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return {row["serato_row_id"] for row in json.load(r)}
    except Exception:
        return set()

# ------------------------------------------------------------------ boucle

def main():
    print(f"Watcher Serato (bibliothèque SQLite) — seuil {MIN_PLAYTIME}s")
    print(f"Base : {LIBRARY_DB}")
    current_sid, done = None, set()

    while True:
        if not LIBRARY_DB.exists():
            print("Base Serato introuvable — en attente…")
            time.sleep(15)
            continue
        try:
            con = open_library()
            cur = con.cursor()
            sid, sname = latest_session(cur)
            if sid is None:
                con.close()
                time.sleep(POLL_SECONDS)
                continue
            if sid != current_sid:
                current_sid = sid
                done = already_inserted_ids(f"sql-{sid}")
                print(f"Session active : {sid} ({sname}) — "
                      f"{len(done)} piste(s) déjà envoyée(s)")

            now = int(time.time())
            entries = ejected_entries(cur, sid, now)
            con.close()
        except sqlite3.Error as e:
            print(f"  ! SQLite: {e}")
            time.sleep(POLL_SECONDS)
            continue

        for e in entries:
            if e["id"] in done:
                continue
            playtime = e["end_time"] - e["start_time"]
            if playtime < MIN_PLAYTIME:
                done.add(e["id"])
                continue
            artist = (e["artist"] or "").strip()
            title = (e["name"] or "").strip()
            if not title:
                done.add(e["id"])
                continue
            spotify_url, image_url = enrich(artist, title)
            row = {
                "gig_date": gig_date_for(e["end_time"]),
                "artist": artist,
                "title": title,
                "spotify_url": spotify_url,
                "image_url": image_url,
                "playtime_seconds": playtime,
                "ended_at": datetime.fromtimestamp(
                    e["end_time"], tz=timezone.utc).isoformat(),
                "session_name": f"sql-{current_sid}",
                "serato_row_id": e["id"],
            }
            if supabase_insert(row):
                done.add(e["id"])
                print(f"  ✓ Jouée : {artist} – {title} ({playtime}s, deck {e['deck']})")

        time.sleep(POLL_SECONDS)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nArrêt.")
