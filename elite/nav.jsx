/* ============================================================
   NAVBAR + MEGA MENU + MOBILE DRAWER + STICKY BOTTOM CTA
   Multi-page version: top-level items link to pages, mega shows on hover
   ============================================================ */
const { useState, useEffect, useRef } = React;

const MEGA = {
  "Страны": {
    page: "countries.html",
    cols: [
      { h: "Англоговорящие", items: ["США", "Великобритания", "Канада", "Австралия"] },
      { h: "Европа", items: ["Италия", "Германия", "Франция", "Испания"] },
      { h: "Азия и Ближний Восток", items: ["ОАЭ", "Китай", "Южная Корея"] },
    ],
    cta: "Все страны →",
    ctaHref: "countries.html",
  },
  "Поступление": {
    page: "admission.html",
    cols: [
      { h: "Проверь себя", items: ["Тест английского", "Калькулятор стоимости"] },
      { h: "Экзамены", items: ["Duolingo", "TOEFL", "IELTS"] },
      { h: "Дальше", items: [["Визы", "admission.html#visas"], ["Стипендии", "admission.html#scholarships"], ["Истории студентов", "stories.html"]] },
    ],
    cta: "Получить консультацию →",
    ctaHref: "index.html#cta",
  },
  "О нас": {
    page: "about.html",
    cols: [
      { h: "Компания", items: [["О компании", "about.html"], ["Состав Elite", "about.html#team"], ["Аккредитации", "about.html#accreds"], ["Офис и контакты", "about.html#office"]] },
      { h: "Студенты", items: [["Истории студентов", "stories.html"], ["Видео-отзывы", "stories.html"], ["Кейсы стипендий", "stories.html"]] },
      { h: "Блог", items: [["Все статьи", "stories.html#blog"]] },
    ],
    cta: "Познакомиться с нами →",
    ctaHref: "about.html",
  },
};

/* Mega item can be "Label" (links to section page) or ["Label", "href"] */
function megaItem(it, fallbackHref) {
  return Array.isArray(it) ? it : [it, fallbackHref];
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
};

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
        <i>образование за рубежом</i>
      </span>
    </a>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [lang, setLang] = useState("RU");
  const closeT = useRef(null);
  const currentPage = getCurrentPage();
  const activeKey = PAGE_TO_KEY[currentPage] || null;

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

          <nav className="nav__menu" aria-label="Главное меню">
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
                {k}
                <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            ))}
          </nav>

          <div className="nav__right">
            <div className="lang">
              {["RU", "EN", "KY"].map((l) => (
                <button key={l} className={l === lang ? "is-active" : ""} onClick={() => setLang(l)}>{l}</button>
              ))}
            </div>
            <a href="index.html#cta" className="btn btn--gold pulse nav__cta">Бесплатная консультация</a>
            <button className="nav__burger" aria-label="Меню" onClick={() => setDrawer(true)}>
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
                  <div className="mega__h">{c.h}</div>
                  {c.items.map((it) => {
                    const [label, href] = megaItem(it, MEGA[open].page);
                    return <a key={label} href={href} className="mega__link">{label}</a>;
                  })}
                </div>
              ))}
              <div className="mega__feature">
                <div className="ph" data-label="промо-визуал" style={{ height: 96, borderRadius: 12, marginBottom: 14 }}></div>
                <div className="mega__feature-t">Не знаешь с чего начать?</div>
                <p>Пройди оценку шансов за 2 минуты и получи список подходящих вузов.</p>
                <a href={MEGA[open].ctaHref} className="mega__cta" onClick={() => setOpen(null)}>{MEGA[open].cta}</a>
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
            <button className="drawer__close" aria-label="Закрыть" onClick={() => setDrawer(false)}>✕</button>
          </div>
          <nav className="drawer__nav">
            {Object.keys(MEGA).map((k) => (
              <DrawerGroup key={k} title={k} cols={MEGA[k].cols} page={MEGA[k].page} isActive={activeKey === k} />
            ))}
          </nav>
          <a href="index.html#cta" className="btn btn--gold btn--block" onClick={() => setDrawer(false)}>Бесплатная консультация</a>
          <div className="drawer__lang">
            {["RU", "EN", "KY"].map((l) => (
              <button key={l} className={l === lang ? "is-active" : ""} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom CTA bar */}
      <div className="bottombar">
        <a href="tel:+996555720712" className="bottombar__btn bottombar__btn--ghost">Позвонить</a>
        <a href="https://t.me/eliteacademykg" target="_blank" rel="noopener" className="bottombar__btn bottombar__btn--tg">Telegram</a>
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
        <a href={page} style={{ fontWeight: 700, color: "var(--blue)" }}>→ Открыть раздел</a>
        {items.map((it) => {
          const [label, href] = megaItem(it, page);
          return <a key={label} href={href}>{label}</a>;
        })}
      </div>
    </div>
  );
}

window.Navbar = Navbar;
window.Logo = Logo;
