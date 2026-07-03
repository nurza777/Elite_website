/* ============================================================
   CAREERS PAGE — full HR landing (careers.html)
   ============================================================ */

const CAREERS_LEADS_URL = "https://script.google.com/macros/s/AKfycbw4i67Vtu9cMUjZvXxVCZ0ZdeDndAG2GqY0eS7PznuBGxZeG4PkwHbe8xN-RAoa35BW/exec";

const CAREERS_DEFAULT = {
  heroPhoto: "",
  deptPhotos: { marketing: "", sales: "", admission: "" },
  corpPhotos: ["images/corp1.jpg", "images/corp2.jpg"],
  applyUrl: "#apply",
};
const CAREERS_DATA = window.eaContent ? window.eaContent("careers", CAREERS_DEFAULT) : CAREERS_DEFAULT;
window.EA_CAREERS = CAREERS_DATA;

const PERKS = [
  { color: "#3b82f6", svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>, k: "careers.perks.1" },
  { color: "#8b5cf6", svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, k: "careers.perks.2" },
  { color: "#10b981", svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, k: "careers.perks.3" },
  { color: "#f59e0b", svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>, k: "careers.perks.4" },
  { color: "#06b6d4", svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>, k: "careers.perks.5" },
  { color: "#ec4899", svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>, k: "careers.perks.6" },
  { color: "#6366f1", svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, k: "careers.perks.7" },
  { color: "#10b981", svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, k: "careers.perks.8" },
  { color: "#f59e0b", svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, k: "careers.perks.9" },
  { color: "#3b82f6", svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, k: "careers.perks.10" },
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
    teamLabel: false,
    teamKeys: null,
    vacancy: {
      titleKey: "careers.dept.marketing.v.title",
      dutiesKeys: [
        "careers.dept.marketing.v.d1","careers.dept.marketing.v.d2","careers.dept.marketing.v.d3",
        "careers.dept.marketing.v.d4","careers.dept.marketing.v.d5","careers.dept.marketing.v.d6",
      ],
      perksKey: null,
    },
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
        "careers.dept.admission.v.d7","careers.dept.admission.v.d9",
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
          <p className="careers-why__invest" data-reveal data-delay="5">{t("careers.why.invest2")}</p>
          <p className="careers-why__invest" data-reveal data-delay="6">{t("careers.why.invest3")}</p>
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
              <span className="careers-perk__icon-wrap" style={{ background: p.color + "18", color: p.color }}>
                {p.svg}
              </span>
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
  const applyUrl = CAREERS_DATA.applyUrl || "#";
  return (
    <div className="careers-dept careers-dept--full" data-reveal>
      {/* Info side */}
      <div className="careers-dept__info">
        <span className="careers-dept__num">{dept.num}</span>
        <h3 className="careers-dept__title">{t(dept.titleKey)}</h3>
        <div className="careers-dept__desc">
          {dept.descKeys.map(k => t(k) ? <p key={k}>{t(k)}</p> : null)}
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
  const [lightbox, setLightbox] = React.useState(null);
  const photos = CAREERS_DATA.corpPhotos || [];

  const closeLightbox = () => setLightbox(null);

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
                <img key={i} src={p} alt="" className="careers-corp__photo"
                     style={{cursor:"zoom-in"}} onClick={() => setLightbox(p)} />
              ))}
            </div>
          : <div className="careers-corp__gallery-ph" data-reveal>📷 {t("careers.corp.photoSoon")}</div>
        }
        <p className="careers-corp__extra" data-reveal>{t("careers.corp.extra")}</p>
      </div>

      {lightbox && (
        <div
          onClick={closeLightbox}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,cursor:"zoom-out"}}
        >
          <button
            onClick={closeLightbox}
            style={{position:"absolute",top:20,right:28,background:"none",border:"none",color:"#fff",fontSize:36,lineHeight:1,cursor:"pointer",padding:0}}
            aria-label="Закрыть"
          >✕</button>
          <img
            src={lightbox}
            alt=""
            onClick={e => e.stopPropagation()}
            style={{maxWidth:"90vw",maxHeight:"90vh",objectFit:"contain",borderRadius:8,boxShadow:"0 8px 48px rgba(0,0,0,0.6)"}}
          />
        </div>
      )}
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
