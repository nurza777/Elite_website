"""
Generate university logo placeholders locally using Pillow.
No internet required.
Saves 200x200 PNG circles to  images/logos/catalog/<key>.png
Then patches catalog.jsx with logo paths.

Run:  python scripts/generate_logos.py
"""

import os, re, sys
from PIL import Image, ImageDraw, ImageFont
import numpy as np

# ── Output folder ────────────────────────────────────────────────────────────
OUT = os.path.join(os.path.dirname(__file__), "..", "images", "logos", "catalog")
os.makedirs(OUT, exist_ok=True)

SIZE = 200   # px

# ── Helper: hex → RGB ────────────────────────────────────────────────────────
def h(hex_str):
    hex_str = hex_str.lstrip("#")
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

# ── Country color palettes ────────────────────────────────────────────────────
# (bg_color, text_color)
PAL = {
    "it": (h("b83010"), h("ffe8dc")),   # Italy – terracotta
    "us": (h("0a2b6a"), h("d0e0ff")),   # USA – navy
    "at": (h("800818"), h("ffe0e0")),   # Austria – dark red
    "de": (h("1a1a30"), h("d8d8f0")),   # Germany – dark slate
    "pl": (h("7a0820"), h("ffd8e0")),   # Poland – crimson
    "cy": (h("055050"), h("d0f4f4")),   # N. Cyprus – teal
    "my": (h("004020"), h("c8f0d8")),   # Malaysia – forest green
}

# ── University definitions: (key, initials, country_iso) ────────────────────
UNIS = [
    # Италия
    ("polimi",    "PM",  "it"),
    ("bocconi",   "UB",  "it"),
    ("unibo",     "UB",  "it"),
    ("sapienza",  "SA",  "it"),
    ("unipd",     "PD",  "it"),
    ("cafoscari", "CF",  "it"),
    ("luiss",     "LU",  "it"),
    ("polito",    "PT",  "it"),
    ("unifi",     "FI",  "it"),
    ("unimi",     "MI",  "it"),
    ("unito",     "TO",  "it"),
    ("univpm",    "UM",  "it"),
    ("lumsa",     "LS",  "it"),
    ("iulm",      "IU",  "it"),
    ("marang",    "IM",  "it"),
    ("tverga",    "TV",  "it"),
    ("roma3",     "R3",  "it"),
    ("lum",       "LU",  "it"),
    ("rufa",      "RF",  "it"),
    # США
    ("roosevelt", "RU",  "us"),
    ("bellevue",  "BC",  "us"),
    ("lasalle",   "LS",  "us"),
    ("kzoo",      "KC",  "us"),
    ("westcliff", "WU",  "us"),
    ("ub",        "UB",  "us"),
    ("ue",        "UE",  "us"),
    ("depaul",    "DP",  "us"),
    ("rowan",     "RW",  "us"),
    ("harrisu",   "HU",  "us"),
    ("ust",       "ST",  "us"),
    ("asu",       "AS",  "us"),
    ("calstate",  "CS",  "us"),
    ("sjsu",      "SJ",  "us"),
    ("ggu",       "GG",  "us"),
    ("mu",        "MU",  "us"),
    ("adelphi",   "AD",  "us"),
    ("uc",        "UC",  "us"),
    ("temple",    "TU",  "us"),
    ("drexel",    "DX",  "us"),
    ("suffolk",   "SF",  "us"),
    ("pace",      "PA",  "us"),
    ("uarizona",  "UA",  "us"),
    ("fiu",       "FI",  "us"),
    ("uconn",     "UC",  "us"),
    ("clarkson",  "CU",  "us"),
    ("colchic",   "CC",  "us"),
    ("nyfa",      "NY",  "us"),
    ("webster",   "WB",  "us"),
    ("simmons",   "SI",  "us"),
    ("floridatech","FT", "us"),
    ("nau",       "NA",  "us"),
    ("radford",   "RU",  "us"),
    ("concord",   "CU",  "us"),
    ("ualb",      "UA",  "us"),
    # Австрия
    ("uniwien",   "UW",  "at"),
    ("wu",        "WU",  "at"),
    ("tuwien",    "TW",  "at"),
    ("muw",       "MW",  "at"),
    ("mug",       "MG",  "at"),
    ("mui",       "MI",  "at"),
    ("jku",       "JK",  "at"),
    # Германия
    ("ueeurope",  "UE",  "de"),
    ("gisma",     "GI",  "de"),
    # Польша
    ("vistula",   "VI",  "pl"),
    ("uta",       "UT",  "pl"),
    ("vizja",     "VZ",  "pl"),
    ("pjatk",     "PJ",  "pl"),
    # Малайзия
    ("monash",    "MO",  "my"),
    ("unm",       "UN",  "my"),
    ("usoton",    "US",  "my"),
    ("hwu",       "HW",  "my"),
    ("sunway",    "SW",  "my"),
    ("taylors",   "TA",  "my"),
    ("apu",       "AP",  "my"),
    ("help",      "HE",  "my"),
    ("inti",      "IN",  "my"),
    ("iium",      "II",  "my"),
    ("imu",       "IM",  "my"),
    ("mmu",       "MM",  "my"),
    ("utp",       "UT",  "my"),
    ("utar",      "UT",  "my"),
    ("segi",      "SE",  "my"),
    ("msu",       "MS",  "my"),
    ("mahsa",     "MA",  "my"),
    ("uorm",      "UR",  "my"),
    ("swinburne", "SW",  "my"),
    ("uoc",       "UC",  "my"),
    ("lcb",       "LB",  "my"),
    ("uow",       "UO",  "my"),
    ("toa",       "TO",  "my"),
    ("unikl",     "UK",  "my"),
    ("uniten",    "UN",  "my"),
    ("taruc",     "TA",  "my"),
    # Северный Кипр
    ("emu",       "EM",  "cy"),
    ("eul",       "EU",  "cy"),
    ("ciu",       "CI",  "cy"),
]

# ── Draw one logo ────────────────────────────────────────────────────────────
def draw_logo(initials, bg_rgb, text_rgb):
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Outer circle (solid fill)
    margin = 4
    draw.ellipse([margin, margin, SIZE - margin - 1, SIZE - margin - 1],
                 fill=(*bg_rgb, 255))

    # Subtle inner ring
    ring_w = 3
    draw.ellipse([margin + ring_w, margin + ring_w,
                  SIZE - margin - ring_w - 1, SIZE - margin - ring_w - 1],
                 outline=(*text_rgb, 60), width=2)

    # Text — try to load a font, fall back to default
    font = None
    font_size = 72 if len(initials) <= 2 else 58
    for font_path in [
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/calibrib.ttf",
        "C:/Windows/Fonts/verdanab.ttf",
        "C:/Windows/Fonts/trebucbd.ttf",
    ]:
        if os.path.exists(font_path):
            try:
                font = ImageFont.truetype(font_path, font_size)
                break
            except Exception:
                pass

    if font is None:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), initials, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (SIZE - tw) / 2 - bbox[0]
    y = (SIZE - th) / 2 - bbox[1]
    draw.text((x, y), initials, font=font, fill=(*text_rgb, 255))

    return img

# ── Generate all ─────────────────────────────────────────────────────────────
generated = []
for key, initials, iso in UNIS:
    dest = os.path.join(OUT, f"{key}.png")
    if os.path.exists(dest):
        print(f"  skip  {key}")
        generated.append(key)
        continue
    bg, fg = PAL.get(iso, (h("1a2a4a"), h("ffffff")))
    img = draw_logo(initials, bg, fg)
    img.save(dest)
    print(f"  OK    {key}  ({initials})")
    generated.append(key)

print(f"\nGenerated {len(generated)} logos in {OUT}")

# ── Patch catalog.jsx ────────────────────────────────────────────────────────
CATALOG = os.path.join(os.path.dirname(__file__), "..", "elite", "catalog.jsx")
with open(CATALOG, encoding="utf-8") as f:
    src = f.read()

original = src
patched = 0

for key, initials, iso in UNIS:
    logo_path = f"images/logos/catalog/{key}.png"
    # Match:  short: "KEY"  ...  logo: null
    # The short field in data uses different casing/values than our key
    # So we match by key directly in the logo field assignment
    pattern = rf'(short:\s*"(?i:{re.escape(key)})"[^}}]{{0,300}}?)(logo:\s*null)'
    replacement = rf'\1logo: "{logo_path}"'
    new_src = re.sub(pattern, replacement, src, flags=re.DOTALL | re.IGNORECASE)
    if new_src != src:
        src = new_src
        patched += 1

if src != original:
    with open(CATALOG, "w", encoding="utf-8") as f:
        f.write(src)
    print(f"catalog.jsx patched: {patched} logos linked")
else:
    print("catalog.jsx: nothing patched (keys may differ from short: values)")
    print("Tip: logos are in images/logos/catalog/ — set logo: path manually if needed")
