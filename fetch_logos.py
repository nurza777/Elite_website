"""
Fetch university logos from Wikipedia for unis missing from LOGO_MAP.
Uses Wikipedia API: finds logo/seal/crest images from each university page.
"""
import urllib.request, urllib.parse, json, os, time, re

OUT_DIR = "images/logos/catalog"
os.makedirs(OUT_DIR, exist_ok=True)

# (short_key, wikipedia_page_title)
UNIS = [
    # Italy
    ("bocconi",    "Bocconi University"),
    ("sapienza",   "Sapienza University of Rome"),
    ("cafoscari",  "Ca' Foscari University of Venice"),
    ("polito",     "Polytechnic University of Turin"),
    ("unito",      "University of Turin"),
    ("unifi",      "University of Florence"),
    ("unisi",      "University of Siena"),
    ("unitn",      "University of Trento"),
    ("unibs",      "University of Brescia"),
    ("iulm",       "IULM University"),
    ("unimib",     "University of Milan-Bicocca"),
    ("roma3",      "Roma Tre University"),
    ("unipa",      "University of Palermo"),
    ("unict",      "University of Catania"),
    ("unicas",     "University of Cassino and Southern Lazio"),
    ("unicamp",    "University of Campania Luigi Vanvitelli"),
    ("linkcu",     "Link Campus University"),
    ("rufa",       "Rome University of Fine Arts"),
    # USA
    ("bellevue",   "Bellevue College"),
    ("kzoo",       "Kalamazoo College"),
    ("ub",         "University at Buffalo"),
    ("depaul",     "DePaul University"),
    ("harrisu",    "Harrisburg University of Science and Technology"),
    ("asu",        "Arizona State University"),
    ("sjsu",       "San Jose State University"),
    ("mu",         "Marymount University"),
    ("uc",         "University of Cincinnati"),
    ("drexel",     "Drexel University"),
    ("pace",       "Pace University"),
    ("fiu",        "Florida International University"),
    ("clarkson",   "Clarkson University"),
    ("nyfa",       "New York Film Academy"),
    ("simmons",    "Simmons University"),
    ("nau",        "North American University"),
    ("concord",    "Concord University"),
    ("conncoll",   "Connecticut College"),
    ("greenriver", "Green River College"),
    ("smc",        "Santa Monica College"),
    ("ccc",        "City Colleges of Chicago"),
    ("ccsf",       "City College of San Francisco"),
    # Malaysia
    ("unm",        "University of Nottingham Malaysia"),
    ("hwu",        "Heriot-Watt University Malaysia"),
    ("taylors",    "Taylor's University"),
    ("help",       "HELP University"),
    ("iium",       "International Islamic University Malaysia"),
    ("mmu",        "Multimedia University"),
    ("utar",       "Universiti Tunku Abdul Rahman"),
    ("msu",        "Management and Science University"),
    ("uorm",       "University of Reading Malaysia"),
    ("uoc",        "University of Cyberjaya"),
    ("uow",        "UOW Malaysia KDU"),
    ("unikl",      "University Kuala Lumpur"),
    ("taruc",      "Tunku Abdul Rahman University of Management and Technology"),
    ("unitar",     "UNITAR International University"),
    # Austria
    ("wu",         "Vienna University of Economics and Business"),
    ("meduniwien", "Medical University of Vienna"),
    ("meduniinnsbruck", "Medical University of Innsbruck"),
    ("angewandte", "University of Applied Arts Vienna"),
    ("mdw",        "University of Music and Performing Arts Vienna"),
    # Poland
    ("uta",        "University of Technology and Humanities in Radom"),
    ("pjatk",     "Polish-Japanese Academy of Information Technology"),
    # Germany
    ("gisma",      "GISMA Business School"),
    # North Cyprus
    ("eul",        "European University of Lefke"),
]

LOGO_KEYWORDS = ["logo", "seal", "crest", "emblem", "coat", "arms", "znak", "herb"]

# Already downloaded — skip these
DONE = {"bocconi", "cafoscari", "polito", "unitn"}

def wiki_api(params):
    url = "https://en.wikipedia.org/w/api.php?" + urllib.parse.urlencode({**params, "format": "json"})
    req = urllib.request.Request(url, headers={"User-Agent": "EliteAcademyBot/1.0"})
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())

def get_logo_url(title):
    # Get all images on the page
    data = wiki_api({"action": "query", "titles": title, "prop": "images", "imlimit": "50"})
    pages = data.get("query", {}).get("pages", {})
    page = next(iter(pages.values()))
    images = page.get("images", [])

    # Filter by logo keywords
    candidates = [img["title"] for img in images
                  if any(kw in img["title"].lower() for kw in LOGO_KEYWORDS)]

    # Prefer SVG
    candidates.sort(key=lambda x: (0 if x.lower().endswith(".svg") else
                                    1 if x.lower().endswith(".png") else 2))

    if not candidates:
        # Try pageimages as fallback
        data2 = wiki_api({"action": "query", "titles": title, "prop": "pageimages",
                           "pithumbsize": "200", "piprop": "original"})
        pages2 = data2.get("query", {}).get("pages", {})
        page2 = next(iter(pages2.values()))
        orig = page2.get("original", {}).get("source")
        return orig

    # Get URL for best candidate
    img_title = candidates[0]
    data3 = wiki_api({"action": "query", "titles": img_title,
                       "prop": "imageinfo", "iiprop": "url"})
    pages3 = data3.get("query", {}).get("pages", {})
    page3 = next(iter(pages3.values()))
    info = page3.get("imageinfo", [{}])
    return info[0].get("url") if info else None

def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": "EliteAcademyBot/1.0"})
    with urllib.request.urlopen(req, timeout=15) as r:
        with open(path, "wb") as f:
            f.write(r.read())

results = {"ok": [], "fail": []}

for short, wiki_title in UNIS:
    if short in DONE:
        print(f"  skip {short}")
        continue
    try:
        logo_url = get_logo_url(wiki_title)
        if not logo_url:
            print(f"  NO IMAGE  {short} ({wiki_title})")
            results["fail"].append(short)
            time.sleep(0.3)
            continue

        ext = logo_url.split("?")[0].split(".")[-1].lower()
        if ext not in ("svg", "png", "jpg", "jpeg", "gif", "webp"):
            ext = "png"
        path = os.path.join(OUT_DIR, f"{short}.{ext}")
        download(logo_url, path)
        size = os.path.getsize(path)
        print(f"  OK {short}.{ext}  ({size//1024}KB)  <- {wiki_title}")
        results["ok"].append((short, f"{short}.{ext}"))
    except Exception as e:
        print(f"  ERR  {short}: {e}")
        results["fail"].append(short)
    time.sleep(3.0)

print(f"\n=== Done: {len(results['ok'])} downloaded, {len(results['fail'])} failed ===")
if results["fail"]:
    print("Failed:", results["fail"])
