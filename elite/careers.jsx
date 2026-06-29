/* ============================================================
   CAREERS PAGE — full HR landing (careers.html)
   ============================================================ */

const CAREERS_LEADS_URL = "https://script.google.com/macros/s/AKfycbw4i67Vtu9cMUjZvXxVCZ0ZdeDndAG2GqY0eS7PznuBGxZeG4PkwHbe8xN-RAoa35BW/exec";

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
    num: "01",
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
    num: "02",
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
    num: "03",
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
        <a href="#apply" className="btn btn--gold btn--lg" data-reveal data-delay="3">
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
function DeptBlock({ dept, index }) {
  const photo = CAREERS_DATA.deptPhotos?.[dept.id] || "";
  const applyUrl = CAREERS_DATA.applyUrl || "#";
  const isEven = index % 2 === 1;
  return (
    <div className={"careers-dept" + (isEven ? " careers-dept--reverse" : "")} data-reveal>
      {/* Photo side */}
      <div className="careers-dept__photo-col">
        <span className="careers-dept__num">{dept.num}</span>
        {photo
          ? <img src={photo} alt={t(dept.titleKey)} className="careers-dept__photo" />
          : <div className="careers-dept__photo-ph">
              <span className="careers-dept__ph-icon">📷</span>
              <span>{t("careers.dept.photoSoon")}</span>
            </div>
        }
      </div>

      {/* Info side */}
      <div className="careers-dept__info">
        <h3 className="careers-dept__title">{t(dept.titleKey)}</h3>
        <div className="careers-dept__desc">
          {dept.descKeys.map(k => <p key={k}>{t(k)}</p>)}
        </div>

        {dept.teamLabel && dept.teamKeys && (
          <div className="careers-dept__team">
            <p className="careers-dept__team-label">{t("careers.dept.team")}</p>
            <div className="careers-dept__tags">
              {dept.teamKeys.map(k => <span key={k} className="careers-dept__tag">{t(k)}</span>)}
            </div>
          </div>
        )}

        {dept.vacancy && (
          <div className="careers-dept__vacancy">
            <div className="careers-dept__v-head">
              <span className="careers-dept__v-badge">{t("careers.dept.open")}</span>
              <h4 className="careers-dept__v-title">{t(dept.vacancy.titleKey)}</h4>
            </div>
            <p className="careers-dept__v-label">{t("careers.dept.duties")}</p>
            <ul className="careers-dept__v-list">
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
          {DEPARTMENTS.map((d, i) => <DeptBlock key={d.id} dept={d} index={i} />)}
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

/* ---- Final CTA + Apply Form (merged) ---- */
function CareersCTA() {
  const { useState: useS } = React;
  const [sent, setSent]         = useS(false);
  const [busy, setBusy]         = useS(false);
  const [name, setName]         = useS("");
  const [phone, setPhone]       = useS("");
  const [age, setAge]           = useS("");
  const [exp, setExp]           = useS("");
  const [position, setPosition] = useS("");

  function handlePhone(e) {
    let d = e.target.value.replace(/\D/g, "");
    if (d.startsWith("996")) d = d.slice(3);
    d = d.slice(0, 9);
    if (!d) { setPhone(""); return; }
    let f = "+996(";
    if (d.length <= 3) f += d;
    else if (d.length <= 6) f += d.slice(0,3) + ")-" + d.slice(3);
    else f += d.slice(0,3) + ")-" + d.slice(3,6) + "-" + d.slice(6);
    setPhone(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy || !name || !phone || !position) return;
    setBusy(true);
    const payload = {
      sheet: "Карьера",
      name,
      phone: phone.replace(/^\+/, "").replace("(", "-").replace(")", ""),
      age,
      exp,
      position,
      time: new Date().toLocaleString("ru"),
    };
    try {
      await fetch(CAREERS_LEADS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });
    } catch (_) {}
    setBusy(false);
    setSent(true);
  }

  return (
    <section className="section careers-cta" id="apply">
      <div className="wrap careers-cta__inner">
        <h2 data-reveal>{t("careers.cta.h2")}</h2>
        <p data-reveal>{t("careers.cta.text1")}</p>
        <p data-reveal>{t("careers.cta.text2")}</p>

        <div className="careers-cta__divider" />

        {sent ? (
          <div className="careers-apply__thanks">
            <span className="careers-apply__thanks-icon">✅</span>
            <h3>{t("careers.apply.thanks.h3")}</h3>
            <p>{t("careers.apply.thanks.p")}</p>
          </div>
        ) : (
          <form className="careers-apply__form" onSubmit={handleSubmit} data-reveal>
            <div className="careers-apply__fields">
              <div className="careers-apply__field">
                <label>{t("careers.apply.f.name")}</label>
                <input type="text" placeholder="Иванов Иван Иванович" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="careers-apply__field">
                <label>{t("careers.apply.f.phone")}</label>
                <input type="tel" placeholder="+996(___)-___-___" value={phone} onChange={handlePhone} required />
              </div>
              <div className="careers-apply__field">
                <label>{t("careers.apply.f.age")}</label>
                <input type="number" placeholder="22" min="16" max="60" value={age} onChange={e => setAge(e.target.value)} />
              </div>
              <div className="careers-apply__field">
                <label>{t("careers.apply.f.exp")}</label>
                <select value={exp} onChange={e => setExp(e.target.value)}>
                  <option value="">{t("careers.apply.f.exp.ph")}</option>
                  <option value="Без опыта">{t("careers.apply.f.exp.0")}</option>
                  <option value="До 1 года">{t("careers.apply.f.exp.1")}</option>
                  <option value="1–3 года">{t("careers.apply.f.exp.2")}</option>
                  <option value="3–5 лет">{t("careers.apply.f.exp.3")}</option>
                  <option value="Более 5 лет">{t("careers.apply.f.exp.4")}</option>
                </select>
              </div>
              <div className="careers-apply__field careers-apply__field--full">
                <label>{t("careers.apply.f.position")}</label>
                <select value={position} onChange={e => setPosition(e.target.value)} required>
                  <option value="">{t("careers.apply.f.position.ph")}</option>
                  <option value="Маркетинг">{t("careers.apply.f.pos.marketing")}</option>
                  <option value="Продажи">{t("careers.apply.f.pos.sales")}</option>
                  <option value="Отдел поступления">{t("careers.apply.f.pos.admission")}</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn--gold btn--lg" disabled={busy}>
              {busy ? "..." : t("careers.apply.btn")}
            </button>
          </form>
        )}
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
