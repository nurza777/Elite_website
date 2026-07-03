/* ============================================================
   COUNTRY DETAILS — ENGLISH. Keyed by the Russian country name.
   Loaded after country-data.js; country-page.jsx picks this when
   __EA_LANG === 'en'. Only translatable text fields are here;
   structural fields (iso, slug, photo) come from country-data.js.
   `facts` keeps Russian keys (for icons/lookups) with English values.
   ============================================================ */
var EA_COUNTRY_DETAILS_EN = {
  "Италия": {
    tagline: "A country where study sits beside the sea, the Alps and the world’s best cuisine",
    facts: { "Столица": "Rome", "Язык обучения": "English · Italian", "Валюта": "Euro €", "Учёба от": "€2,000/year", "Виза": "National visa D" },
    why: [
      { t: "Europe’s oldest universities", d: "Bologna, Padua, Sapienza — universities with centuries of history and degrees recognised worldwide." },
      { t: "Grants cover almost everything", d: "Regional DSU scholarships can cover tuition, housing and meals — even for international students." },
      { t: "Quality of life", d: "Sea, mountains, cuisine and open-air museum cities. Student discounts on everything — from museums to trains." },
    ],
    edu: "Italy’s public universities cost €1,000–4,000 a year, and fees often depend on family income — for students from Kyrgyzstan these are among the lowest prices in Western Europe. Hundreds of programs are fully in English, and regional DSU grants can make studying effectively free.",
    tourism: "Rome, Florence and Venice are open-air museum cities, and it’s often a couple of hours by train from campus to the sea or the ski slopes. Weekends here turn into trips.",
    gallery: ["Cities & architecture", "Campuses", "Sea & nature", "Student life"],
  },
  "США": {
    tagline: "Campus-cities, merit scholarships and a career in the land of opportunity",
    facts: { "Столица": "Washington", "Язык обучения": "English", "Валюта": "US Dollar $", "Учёба от": "$8,000/year", "Виза": "Student F-1" },
    why: [
      { t: "Generous scholarships", d: "Merit scholarships for grades and activities cover up to 50–75% of the cost. Our students have received from $72,000 to $858,000." },
      { t: "A campus is a whole city", d: "Dorms, gyms, labs, clubs. The student life you see in the movies." },
      { t: "Work after graduation", d: "The OPT program lets you work in the US for 1–3 years after graduation — the start of an international career." },
    ],
    edu: "The American system is the most flexible in the world: you don’t have to choose a major right away — you can start at a community college and transfer to a top university after two years, saving tens of thousands of dollars. What matters for admission isn’t perfect grades but a strong application, and we know how to build one.",
    tourism: "From the skyscrapers of New York to California’s beaches and national parks — there’s plenty to explore on breaks. Domestic flights and student discounts make travel affordable.",
    gallery: ["Cities", "Campuses", "Nature & parks", "Student life"],
  },
  "Австрия": {
    tagline: "Almost-free education in the most comfortable country in Europe",
    facts: { "Столица": "Vienna", "Язык обучения": "German · English", "Валюта": "Euro €", "Учёба от": "€726/year", "Виза": "Student residence permit" },
    why: [
      { t: "A symbolic fee", d: "Austria’s public universities cost about €726 per semester — even for non-EU students." },
      { t: "Vienna — the world’s best city", d: "Austria’s capital has topped rankings of the most liveable cities on the planet for years." },
      { t: "The heart of Europe", d: "Prague, Budapest, Munich and Venice are a few hours away by train. All of Europe for the weekend." },
    ],
    edu: "The University of Vienna was founded in 1365 — the oldest university in the German-speaking world, and it’s realistically possible to get into many programs without entrance exams. Studying in German is almost free, while master’s and some bachelor’s programs run in English.",
    tourism: "The Alps for skiing and hiking, Mozart’s Salzburg, Vienna’s palaces and coffee houses. Safety, cleanliness and transport that runs to the second.",
    gallery: ["Vienna", "The Alps", "Campuses", "Student life"],
  },
  "Германия": {
    tagline: "Free public universities and Europe’s strongest engineering",
    facts: { "Столица": "Berlin", "Язык обучения": "German · English", "Валюта": "Euro €", "Учёба от": "€0/year", "Виза": "National visa D" },
    why: [
      { t: "No tuition", d: "At public universities in most states you pay only a semester fee of ~€150–350 — which includes a transport pass." },
      { t: "World-class engineering", d: "BMW, Siemens, Bosch — German technical universities train talent for industry directly." },
      { t: "18 months to find a job", d: "After graduation Germany gives you a year and a half to find work — and a clear path to residency." },
    ],
    edu: "Higher education at Germany’s public universities is free — including for international students. To enrol after a Kyrgyz school you usually need a year of Studienkolleg or 1–2 years of university at home; English-taught programs exist at private universities and at master’s level.",
    tourism: "Berlin’s galleries and startups, Bavarian castles and Oktoberfest, the Rhine and the Alps. A student transport pass opens up the whole country.",
    gallery: ["Cities", "Campuses", "Castles & nature", "Student life"],
  },
  "Польша": {
    tagline: "A European degree close to home and at an affordable price",
    facts: { "Столица": "Warsaw", "Язык обучения": "English · Polish", "Валюта": "Złoty zł", "Учёба от": "€2,000/year", "Виза": "National visa D" },
    why: [
      { t: "As cheap as it gets in the EU", d: "Tuition from €2,000 a year, with housing and food noticeably cheaper than Western Europe — a comfortable student budget." },
      { t: "An EU degree", d: "A Polish degree is recognised across the EU — after graduation the whole European job market is open." },
      { t: "Easy to adapt", d: "A Slavic language environment, a large Russian-speaking community and a similar mentality — no culture shock." },
    ],
    edu: "Poland is the most budget-friendly entry into European education: private universities in Warsaw and Kraków offer English-taught programs in IT, business and design from €2,000 a year. Admission is without difficult exams, and documents are accepted year-round.",
    tourism: "Historic Kraków, Baltic Gdańsk, the Tatras in the south. Home is one cheap flight away, and you can travel Europe on low-cost airlines for €20–40.",
    gallery: ["Warsaw & Kraków", "Campuses", "Nature", "Student life"],
  },
  "Северный Кипр": {
    tagline: "Study in English by the sea — without language tests or extra bureaucracy",
    facts: { "Столица": "Nicosia", "Язык обучения": "English", "Валюта": "Turkish Lira ₺", "Учёба от": "$3,000/year", "Виза": "Student permit" },
    why: [
      { t: "Admission without tests", d: "IELTS and TOEFL aren’t required — you can prove your English with the university’s own exam." },
      { t: "300 days of sun", d: "Campuses are ten minutes from the Mediterranean. Study where others go on holiday." },
      { t: "Discounts up to 75%", d: "Universities automatically give international students substantial discounts — the final price from $3,000 a year." },
    ],
    edu: "All programs are in English, and admission takes just a few weeks: a school certificate and a passport are enough. Degrees from the leading universities are accredited in Turkey and recognised internationally; it’s the fastest and cheapest way to start studying abroad.",
    tourism: "Famagusta’s beaches, mountain monasteries, ancient cities and the port town of Kyrenia. Low prices, safety and a warm sea most of the year.",
    gallery: ["Sea & beaches", "Campuses", "Ancient cities", "Student life"],
  },
  "Малайзия": {
    tagline: "British and Australian degrees in the heart of Asia — for half the price",
    facts: { "Столица": "Kuala Lumpur", "Язык обучения": "English", "Валюта": "Ringgit RM", "Учёба от": "$4,000/year", "Виза": "Student Pass" },
    why: [
      { t: "World universities — cheaper", d: "Campuses of Monash, Nottingham and Southampton: the same degree as in Australia and Britain, but 2–3 times cheaper." },
      { t: "A comfortable environment", d: "A Muslim country with halal infrastructure, safe cities and a friendly attitude to students from Central Asia." },
      { t: "Low cost of living", d: "Housing, food and transport in Kuala Lumpur are far cheaper than Europe — $400–600 a month for everything." },
    ],
    edu: "Malaysia has gathered the campuses of top British and Australian universities: study in Kuala Lumpur and get the same degree issued in London or Melbourne. Everything is taught in English, admission is without difficult exams, and the 2+1 format lets you finish at the home campus.",
    tourism: "The Petronas Twin Towers, Penang island, the jungles and beaches of Borneo. From Kuala Lumpur there are cheap flights across Asia — from Bali to Japan.",
    gallery: ["Kuala Lumpur", "Campuses", "Islands & nature", "Student life"],
  },
};
