/* ============================================================
   NAVBAR + MEGA MENU + MOBILE DRAWER + STICKY BOTTOM CTA
   Multi-page version: top-level items link to pages, mega shows on hover
   ============================================================ */
const { useState, useEffect, useRef } = React;

const MEGA = {
  "Страны": {
    page: "countries.html",
    cols: [
      { h: "nav.mega.englishSpeaking", items: ["США", "Великобритания", "Канада", "Австралия"] },
      { h: "nav.mega.europe",          items: ["Италия", "Германия", "Франция", "Испания"] },
      { h: "nav.mega.asia",            items: ["ОАЭ", "Китай", "Южная Корея"] },
    ],
    cta: "nav.mega.allCountries",
    ctaHref: "countries.html",
  },
  "Поступление": {
    page: "admission.html",
    cols: [
      { h: "nav.mega.testYourself", items: ["Тест английского", "Калькулятор стоимости"] },
      { h: "nav.mega.exams",        items: ["Duolingo", "TOEFL", "IELTS"] },
      { h: "nav.mega.next",         items: [["Визы", "admission.html#visas"], ["Стипендии", "admission.html#scholarships"], ["Истории студентов", "stories.html"]] },
    ],
    cta: "nav.mega.getConsult",
    ctaHref: "index.html#cta",
  },
  "О нас": {
    page: "about.html",
    cols: [
      { h: "nav.mega.company",  items: [["О компании", "about.html"], ["Состав Elite", "about.html#team"], ["Аккредитации", "about.html#accreds"], ["Офис и контакты", "about.html#office"]] },
      { h: "nav.mega.students", items: [["Истории студентов", "stories.html"], ["Видео-отзывы", "stories.html"], ["Кейсы стипендий", "stories.html"]] },
      { h: "nav.mega.blog",     items: [["Все статьи", "stories.html#blog"], ["Все вузы", "universities.html"]] },
      { h: "nav.mega.careers",  items: [["Вакансии", "careers.html"], ["Наши отделы", "careers.html#departments"], ["Корпоративная жизнь", "careers.html#corp"]] },
    ],
    cta: "nav.mega.meetUs",
    ctaHref: "about.html",
  },
};

const NAV_KEY = {
  "Страны": "nav.countries",
  "Поступление": "nav.admission",
  "О нас": "nav.about",
};

const SIMPLE_LINKS = [
  { key: "unis", label: "nav.unis", href: "universities.html" },
];

/* Mega item can be "Label" (links to section page) or ["Label", "href"] */
function megaItem(it, fallbackHref) {
  return Array.isArray(it) ? it : [it, fallbackHref];
}

/* Translate a mega/drawer label: tries page.* then country.*, falls back to the label itself */
function tl(label) {
  let s = t("page." + label);
  if (s !== "page." + label) return s;
  s = t("country." + label);
  if (s !== "country." + label) return s;
  return label;
}

/* Detect current page from body[data-page] */
function getCurrentPage() {
  return (document.body && document.body.dataset.page) || "home";
}
const PAGE_TO_KEY = {
  countries: "Страны",
  admission: "Поступление",
  stories: "О нас",
  about: "О нас",
  universities: "unis",
};

/* ============================================================
   LANGUAGE SWITCH — RU / EN via ea_lang cookie (set by i18n.js)
   ============================================================ */
const LANGS = ["RU", "EN", "KG"];

const lang = (window.__EA_LANG || "ru").toUpperCase();

function Logo({ light }) {
  const col = light ? "#fff" : "var(--navy)";
  return (
    <a href="index.html" className="logo" aria-label="Elite Academy KG">
      <span className="logo__mark" aria-hidden="true">
        <img
          className="logo__img-mark"
          src={light ? "images/logo-icon-white.png" : "images/logo-icon-dark.png"}
          alt=""
        />
      </span>
      <span className="logo__txt" style={{ color: col }}>
        Elite <b>Academy</b>
        <i>{lang === "EN" ? "education abroad" : lang === "KG" ? "чет өлкөдө билим" : "образование за рубежом"}</i>
      </span>
    </a>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(null);
  const [drawer, setDrawer]     = useState(false);
  const closeT                  = useRef(null);
  const currentPage             = getCurrentPage();
  const activeKey               = PAGE_TO_KEY[currentPage] || null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  const enter = (k) => { clearTimeout(closeT.current); setOpen(k); };
  const leave = () => { closeT.current = setTimeout(() => setOpen(null), 140); };

  return (
    <>
      <header className={"nav" + (scrolled ? " nav--scrolled" : "")} onMouseLeave={leave}>
        <div className="nav__inner wrap">
          <Logo light={!scrolled} />

          <nav className="nav__menu" aria-label="Main menu">
            {Object.keys(MEGA).map((k) => (
              <a
                key={k}
                href={MEGA[k].page}
                className={
                  "nav__item" +
                  (open === k ? " is-open" : "") +
                  (activeKey === k ? " is-active" : "")
                }
                onMouseEnter={() => enter(k)}
                onFocus={() => enter(k)}
              >
                <span>{t(NAV_KEY[k])}</span>
                <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            ))}
            {SIMPLE_LINKS.map(({ key, label, href }) => (
              <a key={key} href={href} className={"nav__item nav__item--plain" + (activeKey === key ? " is-active" : "")}>
                <span>{t(label)}</span>
              </a>
            ))}
          </nav>

          <div className="nav__right">
            <div className="lang">
              {LANGS.map((l) => (
                <button key={l} className={l === lang ? "is-active" : ""} onClick={() => window.setSiteLang(l.toLowerCase())}>{l}</button>
              ))}
            </div>
            <a href="index.html#cta" className="btn btn--gold pulse nav__cta">{t("nav.cta")}</a>
            <button className="nav__burger" aria-label="Menu" onClick={() => setDrawer(true)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        {/* Mega menu panel */}
        {open && open !== "__search" && (
          <div className="mega" onMouseEnter={() => enter(open)} onMouseLeave={leave}>
            <div className="wrap mega__grid">
              {MEGA[open].cols.map((c, i) => (
                <div className="mega__col" key={i}>
                  <div className="mega__h">{t(c.h)}</div>
                  {c.items.map((it) => {
                    const [label, href] = megaItem(it, MEGA[open].page);
                    return <a key={label} href={href} className="mega__link">{tl(label)}</a>;
                  })}
                </div>
              ))}
              <div className="mega__feature">
                <img src="images/promo-nav.jpg" alt="Elite Academy" style={{ width:"100%", height:96, objectFit:"cover", objectPosition:"top", borderRadius:12, marginBottom:14, display:"block" }} />
                <div className="mega__feature-t">{t("nav.mega.promoHead")}</div>
                <p>{t("nav.mega.promoText")}</p>
                <a href={MEGA[open].ctaHref} className="mega__cta" onClick={() => setOpen(null)}>{t(MEGA[open].cta)}</a>
              </div>
            </div>
          </div>
        )}

      </header>

      {/* Mobile drawer */}
      <div className={"drawer" + (drawer ? " is-open" : "")}>
        <div className="drawer__backdrop" onClick={() => setDrawer(false)}></div>
        <div className="drawer__panel">
          <div className="drawer__top">
            <Logo />
            <button className="drawer__close" aria-label="Close" onClick={() => setDrawer(false)}>✕</button>
          </div>
          <nav className="drawer__nav">
            {Object.keys(MEGA).map((k) => (
              <DrawerGroup key={k} title={t(NAV_KEY[k])} cols={MEGA[k].cols} page={MEGA[k].page} isActive={activeKey === k} />
            ))}
            {SIMPLE_LINKS.map(({ key, label, href }) => (
              <a key={key} href={href} className={"dg__h dg__h--plain" + (activeKey === key ? " is-active" : "")}>{t(label)}</a>
            ))}
          </nav>
          <a href="index.html#cta" className="btn btn--gold btn--block" onClick={() => setDrawer(false)}>{t("nav.cta")}</a>
          <div className="drawer__lang">
            {LANGS.map((l) => (
              <button key={l} className={l === lang ? "is-active" : ""} onClick={() => window.setSiteLang(l.toLowerCase())}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom CTA bar */}
      <div className="bottombar">
        <a href="tel:+996555720712" className="bottombar__btn bottombar__btn--ghost">{t("nav.call")}</a>
        <a href="https://wa.me/996555720712" target="_blank" rel="noopener" className="bottombar__btn bottombar__btn--tg">WhatsApp</a>
      </div>
    </>
  );
}

function DrawerGroup({ title, cols, page, isActive }) {
  const [o, setO] = useState(false);
  const items = cols.flatMap((c) => c.items);
  return (
    <div className={"dg" + (o ? " is-open" : "")}>
      <button className={"dg__h" + (isActive ? " is-active" : "")} onClick={() => setO(!o)}>
        {title}
        <span className="dg__plus">{o ? "–" : "+"}</span>
      </button>
      <div className="dg__body">
        <a href={page} style={{ fontWeight: 700, color: "var(--blue)" }}>{t("nav.drawer.openSection")}</a>
        {items.map((it) => {
          const [label, href] = megaItem(it, page);
          return <a key={label} href={href}>{tl(label)}</a>;
        })}
      </div>
    </div>
  );
}

window.Navbar = Navbar;
window.Logo = Logo;
