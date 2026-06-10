/* ============================================================
   UNIVERSITY PROFILE — university.html?u=<short>
   UniPage-style profile: photo-first, facts as chips, Google Maps.
   Photos: drop files into images/unis/<slug>/1.jpg … 4.jpg
   (slug = short name, lowercase, letters+digits only,
    e.g. "TU Wien" → images/unis/tuwien/1.jpg).
   Until real photos exist, labeled placeholders are shown.
   ============================================================ */
const { useState, useEffect } = React;

function uniSlug(short) {
  return short.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

const GALLERY_LABELS = ["Кампус", "Учебные корпуса", "Общежитие", "Студенческая жизнь"];

function GalleryTile({ src, label, big }) {
  const [err, setErr] = useState(false);
  const cls = "uprof__tile" + (big ? " uprof__tile--big" : "");
  if (err) {
    return <div className={cls + " ph"} data-label={"фото · " + label.toLowerCase()}></div>;
  }
  return (
    <div className={cls}>
      <img src={src} alt={label} loading="lazy" onError={() => setErr(true)} />
      <span className="uprof__tile-tag">{label}</span>
    </div>
  );
}

function FactCard({ ic, label, children }) {
  return (
    <div className="uprof__fact card">
      <span className="uprof__fact-ic" aria-hidden="true">{ic}</span>
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
          <h1>Университет не найден</h1>
          <p style={{ marginTop: 14, color: "var(--muted)" }}>Возможно, ссылка устарела.</p>
          <a href="universities.html" className="btn btn--dark" style={{ marginTop: 26 }}>← Вернуться в каталог</a>
        </div>
      </section>
    );
  }

  const slug = uniSlug(u.short);
  const iso = (window.EA_COUNTRY_ISO || {})[u.country];
  const palette = (window.EA_PALETTE || {})[u.country] || "linear-gradient(135deg,#0a2463 0%,#1b4f9b 100%)";
  const fmt = (p) => "$" + p.toLocaleString("ru");
  const isBachelor = u.levels.includes("Бакалавр") || u.levels.includes("Колледж") || u.levels.includes("Foundation");
  const isMaster = u.levels.includes("Магистр");
  const mapQuery = encodeURIComponent(`${u.name}, ${u.loc}`);
  const similar = UNIS.filter((x) => x.country === u.country && x.short !== u.short).slice(0, 3);
  const det = (window.EA_UNI_DETAILS || {})[u.short];

  return (
    <>
      {/* ===== Dark hero banner ===== */}
      <section className="uprof-hero grain" style={{ "--uprof-bg": palette }}>
        <div className="uprof-hero__mesh" aria-hidden="true"></div>
        <div className="wrap">
          <nav className="uprof__crumbs" aria-label="Хлебные крошки">
            <a href="universities.html">Каталог</a>
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
                  {iso && <img src={`https://flagcdn.com/20x15/${iso}.png`} alt={u.country} />}
                  {u.loc} · {u.country}
                </div>
                <div className="uprof__chips">
                  {u.qs && <span className="uprof__chip uprof__chip--qs">QS #{u.qs}</span>}
                  <span className="uprof__chip">{u.type}</span>
                  <span className="uprof__chip">{u.field}</span>
                  {u.elite && <span className="uprof__chip uprof__chip--elite">★ Elite выбор</span>}
                </div>
              </div>
            </div>

            <div className="uprof-hero__aside card">
              <div className="uprof__price-l">Обучение в год</div>
              <div className="uprof__price">{fmt(u.price)}</div>
              {(u.meritBased || u.needBased) && (
                <div className="uprof__schol">
                  {u.meritBased && <span className="uprof__schol-tag">Стипендия</span>}
                  {u.needBased && <span className="uprof__schol-tag uprof__schol-tag--grant">Грант</span>}
                </div>
              )}
              <a href="#cta" className="btn btn--gold btn--block">Поступить с Elite →</a>
              <div className="uprof__aside-micro">Бесплатная консультация · план поступления</div>
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
                label={label}
                big={i === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== About ===== */}
      {det && (
        <section className="section section--tight uprof-about">
          <div className="wrap">
            <div className="uprof__about-grid">
              <div className="uprof__about-main">
                <span className="eyebrow">О университете</span>
                <h2 className="uprof__about-h">Коротко о вузе</h2>
                <p className="uprof__about-text">{det.about}</p>
                {det.site && (
                  <a className="uprof__site" href={`https://${det.site}`} target="_blank" rel="noopener">
                    Официальный сайт: {det.site} →
                  </a>
                )}
              </div>
              <div className="uprof__about-stats">
                {det.founded && (
                  <div className="uprof__about-stat">
                    <b>{det.founded}</b>
                    <span>год основания</span>
                  </div>
                )}
                {det.students && (
                  <div className="uprof__about-stat">
                    <b>{det.students}</b>
                    <span>студентов</span>
                  </div>
                )}
                {u.qs && (
                  <div className="uprof__about-stat">
                    <b>#{u.qs}</b>
                    <span>QS рейтинг</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== Key facts ===== */}
      <section className="section section--tight uprof-facts">
        <div className="wrap">
          <div className="uprof__facts-grid">
            {isBachelor && <FactCard ic="🎓" label="Бакалавриат">{fmt(u.price)}/год</FactCard>}
            {isMaster && <FactCard ic="📘" label="Магистратура">{fmt(u.price)}/год</FactCard>}
            <FactCard ic="🗓" label="Набор">
              <div className="uprof__minichips">{u.intake.map((x) => <span key={x}>{x}</span>)}</div>
            </FactCard>
            <FactCard ic="🗣" label="Языковой тест">
              <div className="uprof__minichips">{u.engTests.map((x) => <span key={x}>{x}</span>)}</div>
            </FactCard>
            {u.exams.length > 0 && (
              <FactCard ic="✍️" label="Вступительные экзамены">
                <div className="uprof__minichips">{u.exams.map((x) => <span key={x}>{x}</span>)}</div>
              </FactCard>
            )}
            <FactCard ic="📊" label="Минимальный GPA">{u.gpaMin}</FactCard>
            <FactCard ic="🛏" label="Общежитие">{u.dormitory ? "Есть" : "Нет"}</FactCard>
            <FactCard ic="🎯" label="Программы">{u.levels}</FactCard>
          </div>
        </div>
      </section>

      {/* ===== Google Maps ===== */}
      <section className="section section--tight uprof-map" id="map">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Расположение</span>
            <h2>Посмотри, где будешь учиться</h2>
          </div>
          <div className="uprof__map card" data-reveal>
            <iframe
              title={`${u.name} на карте`}
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
          >Открыть в Google Maps →</a>
        </div>
      </section>

      {/* ===== Similar universities ===== */}
      {similar.length > 0 && (
        <section className="section section--tight uprof-similar">
          <div className="wrap">
            <div className="section-head" data-reveal>
              <span className="eyebrow">Похожие</span>
              <h2>Ещё университеты — {u.country}</h2>
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
                    <div className="uprof__sim-meta">{s.loc} · {fmt(s.price)}/год</div>
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
