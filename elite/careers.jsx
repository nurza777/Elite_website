/* ============================================================
   CAREERS PAGE — full HR landing (careers.html)
   ============================================================ */

const CAREERS_DEFAULT = {
  heroPhoto: "",
  deptPhotos: { marketing: "", sales: "", admission: "" },
  corpPhotos: [],
  applyUrl: "#",
};
const CAREERS_DATA = window.eaContent ? window.eaContent("careers", CAREERS_DEFAULT) : CAREERS_DEFAULT;
window.EA_CAREERS = CAREERS_DATA;

const PERKS = [
  { icon: "📋", k: "careers.perks.1" },
  { icon: "🏢", k: "careers.perks.2" },
  { icon: "👥", k: "careers.perks.3" },
  { icon: "💺", k: "careers.perks.4" },
  { icon: "🌡️", k: "careers.perks.5" },
  { icon: "☕", k: "careers.perks.6" },
  { icon: "📚", k: "careers.perks.7" },
  { icon: "📈", k: "careers.perks.8" },
  { icon: "🤝", k: "careers.perks.9" },
  { icon: "🎯", k: "careers.perks.10" },
];

const WHY_QUALITIES = [
  "careers.why.q1","careers.why.q2","careers.why.q3",
  "careers.why.q4","careers.why.q5","careers.why.q6",
];

const DEPARTMENTS = [
  {
    id: "marketing",
    titleKey: "careers.dept.marketing.title",
    descKeys: ["careers.dept.marketing.p1","careers.dept.marketing.p2","careers.dept.marketing.p3","careers.dept.marketing.p4"],
    teamLabel: true,
    teamKeys: [
      "careers.dept.marketing.t1","careers.dept.marketing.t2","careers.dept.marketing.t3",
      "careers.dept.marketing.t4","careers.dept.marketing.t5","careers.dept.marketing.t6",
    ],
    vacancy: null,
  },
  {
    id: "sales",
    titleKey: "careers.dept.sales.title",
    descKeys: ["careers.dept.sales.p1","careers.dept.sales.p2","careers.dept.sales.p3","careers.dept.sales.p4","careers.dept.sales.p5"],
    teamLabel: false,
    teamKeys: null,
    vacancy: {
      titleKey: "careers.dept.sales.v.title",
      dutiesKeys: [
        "careers.dept.sales.v.d1","careers.dept.sales.v.d2","careers.dept.sales.v.d3",
        "careers.dept.sales.v.d4","careers.dept.sales.v.d5","careers.dept.sales.v.d6",
      ],
      perksKey: "careers.dept.sales.v.perks",
    },
  },
  {
    id: "admission",
    titleKey: "careers.dept.admission.title",
    descKeys: ["careers.dept.admission.p1","careers.dept.admission.p2","careers.dept.admission.p3"],
    teamLabel: false,
    teamKeys: null,
    vacancy: {
      titleKey: "careers.dept.admission.v.title",
      dutiesKeys: [
        "careers.dept.admission.v.d1","careers.dept.admission.v.d2","careers.dept.admission.v.d3",
        "careers.dept.admission.v.d4","careers.dept.admission.v.d5","careers.dept.admission.v.d6",
        "careers.dept.admission.v.d7","careers.dept.admission.v.d8","careers.dept.admission.v.d9",
      ],
      perksKey: null,
    },
  },
];

const CORP_EVENTS = [
  "careers.corp.e1","careers.corp.e2","careers.corp.e3",
  "careers.corp.e4","careers.corp.e5","careers.corp.e6",
];

/* ---- Hero ---- */
function CareersHero() {
  const d = CAREERS_DATA;
  return (
    <section className="careers-hero" style={d.heroPhoto ? { backgroundImage: `url(${d.heroPhoto})` } : {}}>
      <div className="careers-hero__overlay" />
      <div className="wrap careers-hero__inner">
        <span className="eyebrow eyebrow--light" data-reveal>{t("careers.hero.eyebrow")}</span>
        <h1 className="careers-hero__h1" data-reveal data-delay="1">{t("careers.hero.h1")}</h1>
        <p className="careers-hero__sub" data-reveal data-delay="2">{t("careers.hero.sub")}</p>
        <a href={d.applyUrl || "#"} className="btn btn--gold btn--lg" data-reveal data-delay="3">
          {t("careers.hero.btn")}
        </a>
      </div>
    </section>
  );
}

/* ---- Why us ---- */
function CareersWhy() {
  return (
    <section className="section careers-why">
      <div className="wrap careers-why__grid">
        {/* Left: text */}
        <div className="careers-why__left">
          <span className="eyebrow" data-reveal>{t("careers.why.eyebrow")}</span>
          <h2 className="careers-why__h2" data-reveal data-delay="1">{t("careers.why.h2")}</h2>
          <p className="careers-why__lead" data-reveal data-delay="2">{t("careers.why.text1")}</p>
          <p className="careers-why__body-p" data-reveal data-delay="3">{t("careers.why.text2")}</p>
          <p className="careers-why__invest" data-reveal data-delay="4">{t("careers.why.invest")}</p>
        </div>
        {/* Right: dark callout */}
        <div className="careers-why__callout" data-reveal data-delay="2">
          <p className="careers-why__callout-label">{t("careers.why.qualities")}</p>
          <ul className="careers-why__list">
            {WHY_QUALITIES.map(k => <li key={k}>{t(k)}</li>)}
          </ul>
          <div className="careers-why__callout-footer">
            <a href={CAREERS_DATA.applyUrl || "#"} className="btn btn--gold">{t("careers.cta.btn")}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Perks ---- */
function CareersPerks() {
  return (
    <section className="section section--gray careers-perks">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{t("careers.perks.eyebrow")}</span>
          <h2>{t("careers.perks.h2")}</h2>
        </div>
        <div className="careers-perks__grid">
          {PERKS.map((p, i) => (
            <div className="careers-perk card" key={i} data-reveal data-delay={i % 5 + 1}>
              <span className="careers-perk__icon">{p.icon}</span>
              <span className="careers-perk__text">{t(p.k)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Single department block ---- */
function DeptBlock({ dept }) {
  const photo = CAREERS_DATA.deptPhotos?.[dept.id] || "";
  const applyUrl = CAREERS_DATA.applyUrl || "#";
  return (
    <div className={"careers-dept careers-dept--" + dept.id} data-reveal>
      <div className="careers-dept__photo-col">
        {photo
          ? <img src={photo} alt={t(dept.titleKey)} className="careers-dept__photo" />
          : <div className="careers-dept__photo-ph">
              <span>📷</span>
              <span>{t("careers.dept.photoSoon")}</span>
            </div>
        }
      </div>
      <div className="careers-dept__info">
        <h3 className="careers-dept__title">{t(dept.titleKey)}</h3>
        <div className="careers-dept__desc">
          {dept.descKeys.map(k => <p key={k}>{t(k)}</p>)}
        </div>

        {dept.teamLabel && dept.teamKeys && (
          <div className="careers-dept__team">
            <p className="careers-dept__team-label">{t("careers.dept.team")}</p>
            <ul className="careers-dept__list">
              {dept.teamKeys.map(k => <li key={k}>{t(k)}</li>)}
            </ul>
          </div>
        )}

        {dept.vacancy && (
          <div className="careers-dept__vacancy">
            <span className="careers-dept__v-badge">{t("careers.dept.open")}</span>
            <h4 className="careers-dept__v-title">{t(dept.vacancy.titleKey)}</h4>
            <p className="careers-dept__v-label">{t("careers.dept.duties")}</p>
            <ul className="careers-dept__list">
              {dept.vacancy.dutiesKeys.map(k => <li key={k}>{t(k)}</li>)}
            </ul>
            {dept.vacancy.perksKey && (
              <p className="careers-dept__v-perks">{t(dept.vacancy.perksKey)}</p>
            )}
            <a href={applyUrl} className="btn btn--gold careers-dept__v-btn">{t("careers.cta.btn")}</a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Departments section ---- */
function CareersDepts() {
  return (
    <section className="section careers-depts">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{t("careers.dept.eyebrow")}</span>
          <h2>{t("careers.dept.h2")}</h2>
        </div>
        <div className="careers-depts__list">
          {DEPARTMENTS.map(d => <DeptBlock key={d.id} dept={d} />)}
        </div>
      </div>
    </section>
  );
}

/* ---- Corporate life ---- */
function CareersCorp() {
  const photos = CAREERS_DATA.corpPhotos || [];
  return (
    <section className="section section--gray careers-corp">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{t("careers.corp.eyebrow")}</span>
          <h2>{t("careers.corp.h2")}</h2>
          <p>{t("careers.corp.text1")}</p>
          <p>{t("careers.corp.text2")}</p>
        </div>
        <ul className="careers-corp__events" data-reveal>
          {CORP_EVENTS.map(k => <li key={k}>{t(k)}</li>)}
        </ul>
        {photos.filter(Boolean).length > 0
          ? <div className="careers-corp__gallery" data-reveal>
              {photos.filter(Boolean).map((p, i) => (
                <img key={i} src={p} alt="" className="careers-corp__photo" />
              ))}
            </div>
          : <div className="careers-corp__gallery-ph" data-reveal>📷 {t("careers.corp.photoSoon")}</div>
        }
        <p className="careers-corp__extra" data-reveal>{t("careers.corp.extra")}</p>
      </div>
    </section>
  );
}

/* ---- Why they stay ---- */
function CareersStay() {
  return (
    <section className="section careers-stay">
      <div className="wrap careers-stay__inner">
        <h2 data-reveal>{t("careers.stay.h2")}</h2>
        <p data-reveal>{t("careers.stay.p1")}</p>
        <p data-reveal>{t("careers.stay.p2")}</p>
        <p data-reveal>{t("careers.stay.p3")}</p>
      </div>
    </section>
  );
}

/* ---- Final CTA ---- */
function CareersCTA() {
  const applyUrl = CAREERS_DATA.applyUrl || "#";
  return (
    <section className="section careers-cta">
      <div className="wrap careers-cta__inner">
        <h2 data-reveal>{t("careers.cta.h2")}</h2>
        <p data-reveal>{t("careers.cta.text1")}</p>
        <p data-reveal>{t("careers.cta.text2")}</p>
        <a href={applyUrl} className="btn btn--gold btn--lg" data-reveal>{t("careers.cta.btn")}</a>
      </div>
    </section>
  );
}

/* ---- Full page ---- */
function CareersPage() {
  return (
    <>
      <CareersHero />
      <CareersWhy />
      <CareersPerks />
      <CareersDepts />
      <CareersCorp />
      <CareersStay />
      <CareersCTA />
    </>
  );
}

window.CareersPage = CareersPage;
