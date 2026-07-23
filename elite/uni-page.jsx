/* ============================================================
   UNIVERSITY PROFILE — university.html?u=<short>
   UniPage-style profile: photo-first, facts as chips, Google Maps.
   Photos: drop files into images/unis/<slug>/1.jpg … 4.jpg
   (slug = short name, lowercase, letters+digits only,
    e.g. "TU Wien" → images/unis/tuwien/1.jpg).
   Until real photos exist, labeled placeholders are shown.
   ============================================================ */
const { useState, useEffect, useRef } = React;

function uniSlug(short) {
  return short.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

const GALLERY_LABELS = [window.t("uni.gal.campus"), window.t("uni.gal.buildings"), window.t("uni.gal.dorm"), window.t("uni.gal.life")];

function GalleryTile({ src, fallback, label, big }) {
  const [stage, setStage] = useState(0); // 0 = src, 1 = fallback, 2 = placeholder
  const cls = "uprof__tile" + (big ? " uprof__tile--big" : "");
  if (stage === 2 || (stage === 1 && !fallback)) {
    return <div className={cls + " ph"} data-label={window.t("uni.photoOf") + label.toLowerCase()}></div>;
  }
  return (
    <div className={cls}>
      <img src={stage === 0 ? src : fallback} alt={label} loading="lazy" onError={() => setStage(stage + 1)} />
    </div>
  );
}

/* Видео-тур по кампусу: ждёт файл videos/unis/<slug>/tour.mp4,
   пока его нет — показывает заглушку в стиле остальных плейсхолдеров */
function TourVideo({ slug }) {
  const vref = useRef(null);
  const [missing, setMissing] = useState(false);
  const [playing, setPlaying] = useState(false);

  if (missing) {
    return (
      <div className="uprof__tour ph ph--dark" data-label={window.t("uni.tourSoon")}>
        <span className="uprof__tour-play" aria-hidden="true">▶</span>
      </div>
    );
  }

  const toggle = () => {
    const v = vref.current; if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div className="uprof__tour uprof__tour--video" onClick={toggle}>
      <video
        ref={vref}
        src={`videos/unis/${slug}/tour.mp4`}
        preload="metadata"
        playsInline
        onError={() => setMissing(true)}
      />
      {!playing && <span className="uprof__tour-play" aria-hidden="true">▶</span>}
    </div>
  );
}

function FactCard({ label, children }) {
  return (
    <div className="uprof__fact card">
      <div className="uprof__fact-body">
        <span className="uprof__fact-l">{label}</span>
        <div className="uprof__fact-v">{children}</div>
      </div>
    </div>
  );
}

function UniversityProfile() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get("u");
  const UNIS = window.EA_UNIS || [];
  const u = UNIS.find((x) => x.short === key);

  useEffect(() => {
    if (u) document.title = `${u.name} — Elite Academy KG`;
  }, []);

  if (!u) {
    return (
      <section className="section uprof-missing">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h1>{window.t("uni.notFound")}</h1>
          <p style={{ marginTop: 14, color: "var(--muted)" }}>{window.t("uni.notFoundSub")}</p>
          <a href="universities.html" className="btn btn--dark" style={{ marginTop: 26 }}>{window.t("uni.back")}</a>
        </div>
      </section>
    );
  }

  const slug = uniSlug(u.short);
  const iso = (window.EA_COUNTRY_ISO || {})[u.country];
  const paletteBase = (window.EA_PALETTE || {})[u.country] || "linear-gradient(135deg,#0a2463 0%,#1b4f9b 100%)";
  const palette = u.campus
    ? `linear-gradient(rgba(8,24,60,0.62),rgba(8,24,60,0.70)),url('../${u.campus}') center/cover no-repeat`
    : paletteBase;
  const fmt = (p) => "$" + p.toLocaleString("ru");
  const isBachelor = u.levels.includes("Бакалавр") || u.levels.includes("Колледж") || u.levels.includes("Foundation");
  const isMaster = u.levels.includes("Магистр");
  const mapQuery = encodeURIComponent(`${u.name}, ${u.loc}`);
  const similar = UNIS.filter((x) => x.country === u.country && x.short !== u.short).slice(0, 3);
  const det = (window.EA_UNI_DETAILS || {})[u.short];

  /* Rich "about" text — curated per-language when available, otherwise a localized template */
  const L = window.__EA_LANG || "ru";
  const cityTr = (loc) => (L === "en" && (window.EA_CITY_EN || {})[loc]) ? window.EA_CITY_EN[loc] : loc;
  const detTr = L === "en" ? (window.EA_UNI_DETAILS_EN || {})[u.short]
              : L === "kg" ? (window.EA_UNI_DETAILS_KG || {})[u.short]
              : null;
  const countryTr = window.t("country." + u.country);
  const typeLc = u.type === "Государственный"
    ? (L === "en" ? "public" : L === "kg" ? "мамлекеттик" : "государственный")
    : (L === "en" ? "private" : L === "kg" ? "жеке" : "частный");
  const fieldEn = { "IT": "IT", "Бизнес": "Business", "Дизайн": "Design", "Инженерия": "Engineering", "Медицина": "Medicine", "Педагогика": "Education", "Право": "Law", "Экономика": "Economics" };
  const levelEn = { "Бакалавр": "Bachelor’s", "Магистр": "Master’s", "Колледж": "College", "Foundation": "Foundation", "PhD": "PhD" };
  const fieldTr = fieldEn[u.field] || u.field;
  const levelsEn = u.levels.split("·").map(function (s) { s = s.trim(); return levelEn[s] || s; }).join(" · ");
  const genAbout =
    L === "en"
      ? `${u.name} is a ${typeLc} university in ${u.loc} (${countryTr}) and an official partner university of Elite Academy in ${fieldTr}. Programs available: ${levelsEn}${u.qs ? `. It ranks #${u.qs} in the QS World University Rankings` : ""}.`
      : L === "kg"
      ? `${u.name} — ${u.loc} шаарындагы (${countryTr}) ${typeLc} университет жана Elite Academy'нин расмий өнөктөш вузу. Бул жерде ${u.levels.toLowerCase()} деңгээлиндеги программалар бар${u.qs ? `, ал эми вуз QS дүйнөлүк рейтингинде #${u.qs} ордунда турат` : ""}.`
      : `${u.name} — ${typeLc} университет в городе ${u.loc} (${countryTr}) и официальный вуз-партнёр Elite Academy по направлению «${u.field}». Здесь доступны программы уровня ${u.levels.toLowerCase()}${u.qs ? `, а сам вуз входит в мировой рейтинг QS на позиции #${u.qs}` : ""}.`;
  const aboutMain = (detTr && detTr.about) ? detTr.about
    : (L === "ru" && det && det.about) ? det.about
    : genAbout;
  const aboutExtra =
    L === "en"
      ? `We guide your admission end-to-end: we match a program to your profile, prepare documents and a motivation letter, and help with the language test and student visa. ${u.dormitory ? "The university has a student dormitory. " : ""}${(u.meritBased || u.needBased) ? "Scholarships and grants are available for international students." : "We’ll tell you about available scholarships and discounts for international students."}`
      : L === "kg"
      ? `Биз тапшырууну башынан аягына чейин коштойбуз: программаны профилиңе ылайыктайбыз, документтерди жана мотивациялык катты даярдайбыз, тил тести жана студенттик виза менен жардам беребиз. ${u.dormitory ? "Вуздун студенттик жатаканасы бар. " : ""}${(u.meritBased || u.needBased) ? "Чет элдик студенттер үчүн стипендиялар жана гранттар бар." : "Чет элдик студенттер үчүн стипендиялар жана арзандатуулар жөнүндө айтып беребиз."}`
      : `Мы сопровождаем поступление под ключ: подбираем программу под твой профиль, готовим документы и мотивационное письмо, помогаем с языковым тестом и студенческой визой. ${u.dormitory ? "У вуза есть студенческое общежитие. " : ""}${(u.meritBased || u.needBased) ? "Для иностранных студентов доступны стипендии и гранты." : "Расскажем о доступных стипендиях и скидках для иностранных студентов."}`;

  return (
    <>
      {/* ===== Dark hero banner ===== */}
      <section className="uprof-hero grain" style={{ "--uprof-bg": palette }}>
        <div className="uprof-hero__mesh" aria-hidden="true"></div>
        <div className="wrap">
          <nav className="uprof__crumbs" aria-label="breadcrumbs">
            <a href="universities.html">{window.t("uni.catalog")}</a>
            <span>/</span>
            <a href={`universities.html?country=${encodeURIComponent(u.country)}`}>{u.country}</a>
          </nav>

          <div className="uprof-hero__grid">
            <div className="uprof-hero__main">
              {u.logo
                ? <img src={u.logo} className="uprof__logo" alt={u.short} />
                : <div className="uprof__logo uprof__logo--ph">{u.short.slice(0, 2).toUpperCase()}</div>
              }
              <div>
                <h1 className="uprof__name">{u.name}</h1>
                <div className="uprof__loc">
                  {iso && <img src={window.EA_FLAG_URL(iso, "20x15")} alt={u.country} />}
                  {cityTr(u.loc)} · {window.t("country." + u.country)}
                </div>
                <div className="uprof__chips">
                  {u.qs && <span className="uprof__chip uprof__chip--qs">QS #{u.qs}</span>}
                  {u.itRank && <span className="uprof__chip uprof__chip--qs">IT #{u.itRank}</span>}
                  <span className="uprof__chip">{window.t("type." + u.type)}</span>
                  <span className="uprof__chip">{window.t("field." + u.field)}</span>
                  {u.elite && <span className="uprof__chip uprof__chip--elite">{window.t("uni.eliteChoice")}</span>}
                </div>
              </div>
            </div>

            <div className="uprof-hero__aside card">
              {(u.meritBased || u.needBased) && (
                <div className="uprof__schol">
                  {u.meritBased && <span className="uprof__schol-tag">{window.t("uni.scholarship")}</span>}
                  {u.needBased && <span className="uprof__schol-tag uprof__schol-tag--grant">{window.t("uni.grant")}</span>}
                </div>
              )}
              <a href="#cta" className="btn btn--gold btn--block">{window.t("uni.applyCta")}</a>
              <div className="uprof__aside-micro">{window.t("uni.applyMicro")}</div>
            </div>
          </div>
        </div>
        <div className="uprof-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M 0 40 C 240 10, 480 70, 720 40 S 1200 10, 1440 40 L 1440 80 L 0 80 Z" fill="var(--white)" />
          </svg>
        </div>
      </section>

      {/* ===== Photo gallery ===== */}
      <section className="section section--tight uprof-gallery">
        <div className="wrap">
          <div className="uprof__gal-grid">
            {GALLERY_LABELS.map((label, i) => (
              <GalleryTile
                key={label}
                src={`images/unis/${slug}/${i + 1}.jpg`}
                fallback={i === 0 ? u.campus : null}
                label={label}
                big={i === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== About ===== */}
      <section className="section section--tight uprof-about">
        <div className="wrap">
          <div className="uprof__about-grid">
            <div className="uprof__about-main">
              <span className="eyebrow">{window.t("uni.aboutEyebrow")}</span>
              <h2 className="uprof__about-h">{window.t("uni.aboutH")}</h2>
              {/* Описание может быть длинным: пустая строка (или перенос) в тексте
                  из админки = новый абзац */}
              {String(aboutMain).split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean).map((p, i) => (
                <p className="uprof__about-text" key={i}>{p}</p>
              ))}
              <p className="uprof__about-text uprof__about-text--muted">{aboutExtra}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Google Maps ===== */}
      <section className="section section--tight uprof-map" id="map">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">{window.t("uni.locEyebrow")}</span>
            <h2>{window.t("uni.locH")}</h2>
          </div>
          <div className="uprof__map card" data-reveal>
            <iframe
              title={`${u.name} — ${window.t("uni.onMap")}`}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed&hl=ru`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <a
            className="uprof__map-link"
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank" rel="noopener"
          >{window.t("uni.openMaps")}</a>
        </div>
      </section>

      {/* ===== Video tour — сразу после карты (правка заказчика) ===== */}
      <section className="section section--tight uprof-tour">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">{window.t("uni.tourEyebrow")}</span>
            <h2>{window.t("uni.tourH")}</h2>
          </div>
          <div data-reveal>
            <TourVideo slug={slug} />
          </div>
        </div>
      </section>

      {/* ===== Similar universities ===== */}
      {similar.length > 0 && (
        <section className="section section--tight uprof-similar">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <span className="eyebrow">{window.t("uni.similarEyebrow")}</span>
              <h2>{window.t("uni.similarH")}{window.t("country." + u.country)}</h2>
            </div>
            <div className="uprof__sim-grid">
              {similar.map((s) => (
                <a key={s.short} href={`university.html?u=${encodeURIComponent(s.short)}`} className="uprof__sim card card--lift">
                  {s.logo
                    ? <img src={s.logo} className="uprof__sim-logo" alt={s.short} />
                    : <div className="uprof__sim-logo uprof__sim-logo--ph">{s.short.slice(0, 2).toUpperCase()}</div>
                  }
                  <div className="uprof__sim-info">
                    <div className="uprof__sim-name">{s.name}</div>
                    <div className="uprof__sim-meta">{cityTr(s.loc)} · {window.t("country." + s.country)}</div>
                  </div>
                  <span className="uprof__sim-arr">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

window.UniversityProfile = UniversityProfile;
