/* ============================================================
   COUNTRY PROFILE — country.html?c=<name>
   Photo-first country page: hero photo, facts, why-cards,
   gallery, education summary, top universities from catalog.
   Gallery photos: images/countries/<slug>/1.jpg … 4.jpg
   (tile 1 falls back to the main country photo).
   ============================================================ */
const { useState, useEffect } = React;

function CountryTile({ src, fallback, label, big }) {
  const [stage, setStage] = useState(0); // 0 = src, 1 = fallback, 2 = placeholder
  const cls = "cprof__tile" + (big ? " cprof__tile--big" : "");
  if (stage === 2 || (stage === 1 && !fallback)) {
    return <div className={cls + " ph"} data-label={"фото · " + label.toLowerCase()}></div>;
  }
  return (
    <div className={cls}>
      <img
        src={stage === 0 ? src : fallback}
        alt={label}
        loading="lazy"
        onError={() => setStage(stage + 1)}
      />
      <span className="cprof__tile-tag">{label}</span>
    </div>
  );
}

function CountryProfile() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("c");
  const det = (window.EA_COUNTRY_DETAILS || {})[name];
  const unis = (window.EA_UNIS || []).filter((u) => u.country === name);
  const students = (window.EA_VIDEOS || []).filter((v) => v.country === name);
  const [activeVid, setActiveVid] = useState(null);
  const VideoModal = window.VideoModal;

  useEffect(() => {
    if (det) document.title = `Обучение — ${name} — Elite Academy KG`;
  }, []);

  if (!det) {
    return (
      <section className="section cprof-missing">
        <div className="wrap" style={{ textAlign: "center" }}>
          <h1>Страна не найдена</h1>
          <p style={{ marginTop: 14, color: "var(--muted)" }}>Возможно, ссылка устарела.</p>
          <a href="countries.html" className="btn btn--dark" style={{ marginTop: 26 }}>← Все направления</a>
        </div>
      </section>
    );
  }

  const top = [...unis].sort((a, b) => (a.qs || 9999) - (b.qs || 9999)).slice(0, 6);
  const fmt = (p) => "$" + p.toLocaleString("ru") + "/год";

  return (
    <>
      {/* ===== Hero with country photo ===== */}
      <section className="cprof-hero" style={{ backgroundImage: `url(${det.photo})` }}>
        <div className="cprof-hero__shade" aria-hidden="true"></div>
        <div className="wrap cprof-hero__inner">
          <nav className="cprof__crumbs" aria-label="Хлебные крошки">
            <a href="countries.html">Направления</a>
            <span>/</span>
            <span>{name}</span>
          </nav>
          <div className="cprof-hero__flag">
            <img src={window.EA_FLAG_URL(det.iso, "48x36")} srcSet={`${window.EA_FLAG_URL(det.iso, "96x72")} 2x`} alt={name} />
          </div>
          <h1 className="cprof__name">{name}</h1>
          <p className="cprof__tagline">{det.tagline}</p>
          <div className="cprof__hero-cta">
            <a href="#cta" className="btn btn--gold btn--lg">Хочу учиться здесь →</a>
            <a href={`universities.html?country=${encodeURIComponent(name)}`} className="btn btn--ghost-light btn--lg">
              {unis.length} вузов в каталоге
            </a>
          </div>
        </div>
        <div className="cprof-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M 0 40 C 240 10, 480 70, 720 40 S 1200 10, 1440 40 L 1440 80 L 0 80 Z" fill="var(--white)" />
          </svg>
        </div>
      </section>

      {/* ===== Quick facts strip ===== */}
      <section className="section--tight cprof-facts">
        <div className="wrap">
          <div className="cprof__facts-row">
            {Object.entries(det.facts).map(([k, v]) => (
              <div className="cprof__fact" key={k}>
                <span className="cprof__fact-l">{k}</span>
                <b className="cprof__fact-v">{v}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Why this country ===== */}
      <section className="section section--tight cprof-why">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Почему {name}</span>
            <h2>Что делает эту страну особенной</h2>
          </div>
          <div className="cprof__why-grid">
            {det.why.map((w, i) => (
              <div className="cprof__why card card--lift" data-reveal data-delay={i + 1} key={w.t}>
                <span className="cprof__why-ic" aria-hidden="true">{w.ic}</span>
                <h3 className="cprof__why-t">{w.t}</h3>
                <p className="cprof__why-d">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Gallery + tourism ===== */}
      <section className="section section--tight cprof-gallery">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Жизнь и путешествия</span>
            <h2>Страна, в которую влюбляешься</h2>
            <p>{det.tourism}</p>
          </div>
          <div className="cprof__gal-grid" data-reveal>
            {det.gallery.map((label, i) => (
              <CountryTile
                key={label}
                src={`images/countries/${det.slug}/${i + 1}.jpg`}
                fallback={i === 0 ? det.photo : null}
                label={label}
                big={i === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Education ===== */}
      <section className="section section--tight cprof-edu">
        <div className="wrap cprof__edu-grid">
          <div data-reveal>
            <span className="eyebrow">Об образовании</span>
            <h2 className="cprof__edu-h">Как тут устроена учёба</h2>
            <p className="cprof__edu-text">{det.edu}</p>
            <a href="#cta" className="btn btn--dark" style={{ marginTop: 26 }}>Составить план поступления →</a>
          </div>
          <div className="cprof__edu-stats" data-reveal data-delay="1">
            <div className="cprof__edu-stat">
              <b>{unis.length}</b>
              <span>вузов-партнёров в каталоге</span>
            </div>
            <div className="cprof__edu-stat">
              <b>{det.facts["Учёба от"]}</b>
              <span>стоимость обучения</span>
            </div>
            <div className="cprof__edu-stat">
              <b>{det.facts["Язык обучения"]}</b>
              <span>язык программ</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Top universities ===== */}
      {top.length > 0 && (
        <section className="section section--tight cprof-unis">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <span className="eyebrow">Топ вузов</span>
              <h2>Лучшие университеты — {name}</h2>
            </div>
            <div className="cprof__unis-grid">
              {top.map((u, i) => (
                <a key={u.short} href={`university.html?u=${encodeURIComponent(u.short)}`}
                   className="cprof__uni card card--lift" data-reveal data-delay={(i % 3) + 1}>
                  {u.logo
                    ? <img src={u.logo} className="cprof__uni-logo" alt={u.short} />
                    : <div className="cprof__uni-logo cprof__uni-logo--ph">{u.short.slice(0, 2).toUpperCase()}</div>
                  }
                  <div className="cprof__uni-info">
                    <div className="cprof__uni-name">{u.name}</div>
                    <div className="cprof__uni-meta">{u.loc} · {fmt(u.price)}</div>
                  </div>
                  {u.qs && <span className="cprof__uni-qs">QS #{u.qs}</span>}
                </a>
              ))}
            </div>
            <div className="cprof__unis-all">
              <a href={`universities.html?country=${encodeURIComponent(name)}`} className="btn btn--ghost">
                Все вузы — {name} ({unis.length}) →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ===== Students who studied in this country ===== */}
      {students.length > 0 && (
        <section className="section section--tight cprof-students">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <span className="eyebrow">Наши студенты</span>
              <h2>Они уже учатся — {name}</h2>
              <p>Реальные видео-отзывы студентов Elite Academy, которые поступили и учатся в стране {name}.</p>
            </div>
            <div className="cprof__students-grid">
              {students.map((v, i) => (
                <button
                  key={i}
                  className="cprof__student"
                  data-reveal data-delay={(i % 4) + 1}
                  onClick={() => setActiveVid(v)}
                  aria-label={`Видео-отзыв · ${v.name}`}
                >
                  <div className="cprof__student-media">
                    <img src={v.poster} alt={v.name} loading="lazy" />
                    <span className="cprof__student-play" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M5 3.5v9l7-4.5z"/></svg>
                    </span>
                  </div>
                  <div className="cprof__student-info">
                    <div className="cprof__student-name">{v.name}</div>
                    <div className="cprof__student-uni">{v.uni}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {VideoModal && <VideoModal item={activeVid} onClose={() => setActiveVid(null)} />}
        </section>
      )}
    </>
  );
}

window.CountryProfile = CountryProfile;
