/* ============================================================
   HOME SEARCH — UniPage-style compact search widget
   ============================================================ */
const { useState } = React;

function HomeSearch() {
  const [country, setCountry] = useState("");
  const [level,   setLevel]   = useState("");
  const [field,   setField]   = useState("");

  const HS_COUNTRIES = [
    { label: t("hs.anyCountry"), val: "" },
    { label: t("country.Италия"),       val: "Италия" },
    { label: t("country.США"),          val: "США" },
    { label: t("country.Австрия"),      val: "Австрия" },
    { label: t("country.Германия"),     val: "Германия" },
    { label: t("country.Польша"),       val: "Польша" },
    { label: t("country.Северный Кипр"),val: "Северный Кипр" },
    { label: t("country.Малайзия"),     val: "Малайзия" },
  ];
  const HS_LEVELS = [
    { label: t("hs.anyLevel"),      val: "" },
    { label: t("hs.lvl.college"),   val: "Колледж" },
    { label: "Foundation",          val: "Foundation" },
    { label: t("hs.lvl.bachelor"),  val: "Бакалавр" },
    { label: t("hs.lvl.master"),    val: "Магистр" },
    { label: "PhD",                 val: "PhD" },
  ];
  const HS_FIELDS = [
    { label: t("hs.anyField"),          val: "" },
    { label: "IT",                      val: "IT" },
    { label: t("hs.fld.business"),      val: "Бизнес" },
    { label: t("hs.fld.medicine"),      val: "Медицина" },
    { label: t("hs.fld.law"),           val: "Право" },
    { label: t("hs.fld.engineering"),   val: "Инженерия" },
    { label: t("hs.fld.economics"),     val: "Экономика" },
    { label: t("hs.fld.design"),        val: "Дизайн" },
    { label: t("hs.fld.education"),     val: "Педагогика" },
  ];

  function handleSearch(e) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (country) p.set("country", country);
    if (level)   p.set("level",   level);
    if (field)   p.set("field",   field);
    window.location.href = "#cta";
  }

  return (
    <div className="hs-wrap">
      <div className="wrap">
        <form className="hs-card card" onSubmit={handleSearch}>
          <p className="hs-label">{t("hs.label")}</p>
          <div className="hs-row">

            <div className="hs-select-wrap">
              <svg className="hs-select-icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 10 6.5a2.5 2.5 0 0 1 0 5z" fill="currentColor"/>
              </svg>
              <select value={country} onChange={e => setCountry(e.target.value)}>
                {HS_COUNTRIES.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
              <svg className="hs-chevron" width="16" height="16" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
            </div>

            <div className="hs-divider" aria-hidden="true"></div>

            <div className="hs-select-wrap">
              <svg className="hs-select-icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 2a6 6 0 1 0 0 12A6 6 0 0 0 10 2zm0 1a5 5 0 1 1 0 10A5 5 0 0 1 10 3zm-.5 2.5v5l4 2-.5.87-4.5-2.37V5.5h1z" fill="currentColor"/>
              </svg>
              <select value={level} onChange={e => setLevel(e.target.value)}>
                {HS_LEVELS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
              <svg className="hs-chevron" width="16" height="16" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
            </div>

            <div className="hs-divider" aria-hidden="true"></div>

            <div className="hs-select-wrap">
              <svg className="hs-select-icon" width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 5h12M4 10h8M4 15h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <select value={field} onChange={e => setField(e.target.value)}>
                {HS_FIELDS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
              <svg className="hs-chevron" width="16" height="16" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
            </div>

            <button type="submit" className="btn btn--gold hs-btn">
              {t("hs.btn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

window.HomeSearch = HomeSearch;
