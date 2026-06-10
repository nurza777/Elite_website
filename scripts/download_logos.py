"""
Download university logos via Clearbit Logo API.
Usage:  python scripts/download_logos.py
Logos are saved to  images/logos/catalog/<key>.png
Then catalog.jsx logo paths are patched automatically.
"""

import os, re, time, sys, urllib.request, urllib.error
# Fix Windows console encoding
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ── Output folder ────────────────────────────────────────────
OUT = os.path.join(os.path.dirname(__file__), "..", "images", "logos", "catalog")
os.makedirs(OUT, exist_ok=True)

# ── University key → domain mapping ─────────────────────────
# Key must match the `short` field used to build the logo path in catalog.jsx
DOMAINS = {
    # Италия
    "polimi":    "polimi.it",
    "bocconi":   "unibocconi.eu",
    "unibo":     "unibo.it",
    "sapienza":  "uniroma1.it",
    "unipd":     "unipd.it",
    "cafoscari": "unive.it",
    "luiss":     "luiss.it",
    "polito":    "polito.it",
    "unifi":     "unifi.it",
    "lumsa":     "lumsa.it",
    "iulm":      "iulm.it",
    "marang":    "istitutomarangoni.com",
    # США
    "roosevelt": "roosevelt.edu",
    "bellevue":  "bellevuecollege.edu",
    "lasalle":   "lasalle.edu",
    "kzoo":      "kzoo.edu",
    "westcliff": "westcliff.edu",
    "ub":        "buffalo.edu",
    "depaul":    "depaul.edu",
    "asu":       "asu.edu",
    "temple":    "temple.edu",
    "drexel":    "drexel.edu",
    "pace":      "pace.edu",
    "uarizona":  "arizona.edu",
    "fiu":       "fiu.edu",
    "uconn":     "uconn.edu",
    "suffolk":   "suffolk.edu",
    "simmons":   "simmons.edu",
    "rowan":     "rowan.edu",
    # Австрия
    "uniwien":   "univie.ac.at",
    "wu":        "wu.ac.at",
    "tuwien":    "tuwien.ac.at",
    # Германия
    "gisma":     "gisma.com",
    # Польша
    "vistula":   "vistula.edu.pl",
    "pjatk":     "pjatk.pl",
    "vizja":     "vizja.pl",
    # Малайзия
    "monash":    "monash.edu.my",
    "unm":       "nottingham.edu.my",
    "hwu":       "hw.ac.uk",
    "sunway":    "sunway.edu.my",
    "taylors":   "taylors.edu.my",
    "apu":       "apu.edu.my",
    "help":      "help.edu.my",
    "inti":      "newinti.edu.my",
    "mmu":       "mmu.edu.my",
    "utp":       "utp.edu.my",
    # Северный Кипр
    "emu":       "emu.edu.tr",
    "eul":       "eul.edu.tr",
    "ciu":       "ciu.edu.tr",
}

# ── Download ─────────────────────────────────────────────────
BASE = "https://logo.clearbit.com/"
headers = {"User-Agent": "Mozilla/5.0"}

ok, fail = [], []

for key, domain in DOMAINS.items():
    dest = os.path.join(OUT, f"{key}.png")
    if os.path.exists(dest):
        print(f"  skip  {key} (already exists)")
        ok.append(key)
        continue

    url = BASE + domain
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as r:
            data = r.read()
        if len(data) < 200:          # empty / error response
            raise ValueError("too small")
        with open(dest, "wb") as f:
            f.write(data)
        print(f"  ✓  {key:20s}  ({len(data)//1024}KB)  ← {domain}")
        ok.append(key)
    except Exception as e:
        print(f"  ✗  {key:20s}  {e}")
        fail.append(key)

    time.sleep(0.25)   # be polite to the API

# ── Patch catalog.jsx ────────────────────────────────────────
CATALOG = os.path.join(os.path.dirname(__file__), "..", "elite", "catalog.jsx")

with open(CATALOG, encoding="utf-8") as f:
    src = f.read()

original = src

for key in ok:
    logo_path = f"images/logos/catalog/{key}.png"
    # Look for the university entry that has   short: "Key"  (case-insensitive key match)
    # and inject   logo: "images/logos/catalog/key.png"
    # Only patch if logo: null is still there and the short matches
    pattern = rf'(short:\s*"{re.escape(key)}"[^}}]*?)(logo:\s*null)'
    replacement = rf'\1logo: "{logo_path}"'
    new_src = re.sub(pattern, replacement, src, flags=re.IGNORECASE | re.DOTALL)
    if new_src != src:
        src = new_src
        print(f"  patched catalog.jsx  →  {key}")

if src != original:
    with open(CATALOG, "w", encoding="utf-8") as f:
        f.write(src)
    print("\ncatalog.jsx updated ✓")
else:
    print("\ncatalog.jsx — nothing to patch (already up to date or keys not matched)")

# ── Summary ──────────────────────────────────────────────────
print(f"\nDone:  {len(ok)} downloaded,  {len(fail)} failed")
if fail:
    print("Failed:", ", ".join(fail))
    print("For failed ones: find the domain manually and add to DOMAINS dict,")
    print("or drop the logo file into images/logos/catalog/<key>.png yourself.")
