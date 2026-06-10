/* ============================================================
   PROGRAMS (tabs) · EXAMS (cards, Duolingo accent)
   ============================================================ */
const { useState } = React;

/* Each tab maps to a catalog level (universities.html filter) where possible.
   Items with `field` link to the catalog with level+field pre-filtered. */
const PROGRAMS = {
  "Бакалавриат": { level: "Бакалавр", items: [
    { name: "Computer Science", flag: "🇺🇸", country: "США", dur: "4 года", price: "от $9 000/год", schol: "ср. $40 000", specs: "AI · Data · Software", field: "IT" },
    { name: "Business Administration", flag: "🇺🇸", country: "США", dur: "4 года", price: "от $10 000/год", schol: "ср. $32 000", specs: "Маркетинг · Финансы", field: "Бизнес" },
    { name: "Инженерия", flag: "🇮🇹", country: "Италия", dur: "3 года", price: "от €2 100/год", schol: "гранты DSU", specs: "Механика · Авиа · Авто", field: "Инженерия" },
    { name: "Медицина", flag: "🇮🇹", country: "Италия", dur: "6 лет", price: "от €2 200/год", schol: "гранты DSU", specs: "На английском · IMAT", field: "Медицина" },
    { name: "Дизайн и архитектура", flag: "🇮🇹", country: "Италия", dur: "3 года", price: "от €2 600/год", schol: "ср. $9 000", specs: "Product · Interior · Fashion", field: "Дизайн" },
    { name: "Право", flag: "🇦🇹", country: "Австрия", dur: "3 года", price: "от €726/год", schol: "почти бесплатно", specs: "Международное · ЕС", field: "Право" },
  ]},
  "Магистратура": { level: "Магистр", items: [
    { name: "Data Science (MSc)", flag: "🇺🇸", country: "США", dur: "2 года", price: "от $14 000/год", schol: "ср. $25 000", specs: "ML · Analytics", field: "IT" },
    { name: "Engineering (MSc)", flag: "🇩🇪", country: "Германия", dur: "2 года", price: "€0 в гос. вузах", schol: "DAAD грант", specs: "Robotics · Energy", field: "Инженерия" },
    { name: "Management (MSc)", flag: "🇦🇹", country: "Австрия", dur: "2 года", price: "от €726/год", schol: "почти бесплатно", specs: "Стратегия · Консалтинг", field: "Бизнес" },
    { name: "Finance & Economics", flag: "🇮🇹", country: "Италия", dur: "2 года", price: "от €2 500/год", schol: "гранты DSU", specs: "Banking · Fintech", field: "Экономика" },
    { name: "Public Health (MPH)", flag: "🇺🇸", country: "США", dur: "2 года", price: "от $20 000/год", schol: "ср. $30 000", specs: "Эпидемиология", field: "Медицина" },
    { name: "Design (MA)", flag: "🇮🇹", country: "Италия", dur: "2 года", price: "от €2 600/год", schol: "ср. €5 000", specs: "Fashion · Product", field: "Дизайн" },
  ]},
  "МВА": { level: "Магистр", items: [
    { name: "Full-time MBA", flag: "🇺🇸", country: "США", dur: "2 года", price: "от $25 000/год", schol: "ср. $45 000", specs: "Strategy · Finance", field: "Бизнес" },
    { name: "Global MBA", flag: "🇲🇾", country: "Малайзия", dur: "1–1.5 года", price: "от $9 000", schol: "скидки до 50%", specs: "Британский диплом", field: "Бизнес" },
    { name: "Tech MBA", flag: "🇺🇸", country: "США", dur: "1.5 года", price: "от $29 000/год", schol: "ср. $35 000", specs: "Product · Startups", field: "Бизнес" },
  ]},
  "PhD": { level: "PhD", items: [
    { name: "PhD in Computer Science", flag: "🇺🇸", country: "США", dur: "4–5 лет", price: "Финансируется", schol: "стипендия + стайпенд", specs: "Research", field: "IT" },
    { name: "PhD in Engineering", flag: "🇩🇪", country: "Германия", dur: "3–4 года", price: "Финансируется", schol: "оплата позиции", specs: "Applied research", field: "Инженерия" },
    { name: "PhD in Economics", flag: "🇦🇹", country: "Австрия", dur: "3–4 года", price: "от €726/год", schol: "ассистентские позиции", specs: "Econometrics", field: "Экономика" },
  ]},
  "Языковые": { level: null, items: [
    { name: "Intensive English (ESL)", flag: "🇺🇸", country: "США", dur: "4–24 нед.", price: "$1 200/мес", schol: "—", specs: "Подготовка к вузу" },
    { name: "English Foundation", flag: "🇲🇾", country: "Малайзия", dur: "8–36 нед.", price: "от $400/мес", schol: "—", specs: "Перед вузами Азии" },
    { name: "Italian A1–B2", flag: "🇮🇹", country: "Италия", dur: "12 нед.", price: "$900/мес", schol: "—", specs: "Для бесплатных вузов" },
  ]},
  "Летние школы": { level: null, items: [
    { name: "Summer @ Berkeley", flag: "🇺🇸", country: "США", dur: "6 нед.", price: "$4 500", schol: "частичные", specs: "Pre-college" },
    { name: "Vienna Summer School", flag: "🇦🇹", country: "Австрия", dur: "3 нед.", price: "$2 800", schol: "—", specs: "Немецкий + академики" },
    { name: "Milan Design Camp", flag: "🇮🇹", country: "Италия", dur: "4 нед.", price: "$3 100", schol: "—", specs: "Creative" },
  ]},
  "Онлайн": { level: null, items: [
    { name: "Online Bachelor (CS)", flag: "🇺🇸", country: "США", dur: "4 года", price: "$7 000/год", schol: "ср. $15 000", specs: "Гибкий график" },
    { name: "Online MBA", flag: "🇺🇸", country: "США", dur: "1.5 года", price: "$18 000", schol: "ср. $9 000", specs: "Без отрыва" },
    { name: "MicroMasters", flag: "🌍", country: "Глобально", dur: "6–12 мес.", price: "$1 500", schol: "—", specs: "Credential" },
  ]},
};

/* Quick path picker: who are you → which tab fits */
const WHO = [
  { ic: "🎒", t: "Школьник", sub: "9–11 класс", tab: "Бакалавриат" },
  { ic: "🎓", t: "Студент / выпускник", sub: "после вуза", tab: "Магистратура" },
  { ic: "💼", t: "Работаю", sub: "карьерный рост", tab: "МВА" },
  { ic: "⚡", t: "Начну с языка", sub: "или летней школы", tab: "Языковые" },
];

function Programs() {
  const tabs = Object.keys(PROGRAMS);
  const [tab, setTab] = useState(tabs[0]);
  const cur = PROGRAMS[tab];
  const catalogCount = cur.level
    ? (window.EA_UNIS || []).filter((u) => u.levels.includes(cur.level)).length
    : 0;

  const progLink = (p) =>
    p.field && cur.level
      ? `universities.html?level=${encodeURIComponent(cur.level)}&field=${encodeURIComponent(p.field)}`
      : "#cta";

  return (
    <section className="section section--tight programs" id="programs">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Программы обучения</span>
          <h2>Найди формат под свою цель</h2>
        </div>

        <div className="programs__who" data-reveal>
          {WHO.map((w) => (
            <button key={w.t}
              className={"pwho" + (tab === w.tab ? " is-on" : "")}
              onClick={() => setTab(w.tab)}>
              <span className="pwho__ic" aria-hidden="true">{w.ic}</span>
              <span className="pwho__txt">
                <b>{w.t}</b>
                <span>{w.sub}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="programs__tabs" data-reveal>
          {tabs.map((t) => (
            <button key={t} className={"programs__tab" + (tab === t ? " is-on" : "")} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        <div className="programs__grid stagger" key={tab}>
          {cur.items.map((p, i) => (
            <article className="prog card card--lift" key={p.name}>
              <div className="prog__head">
                <span className="prog__flag">{p.flag}</span>
                <div>
                  <h3 className="prog__name">{p.name}</h3>
                  <div className="prog__country">{p.country}</div>
                </div>
              </div>
              <div className="prog__rows">
                <div className="prog__row"><span>Длительность</span><b>{p.dur}</b></div>
                <div className="prog__row"><span>Стоимость</span><b>{p.price}</b></div>
                <div className="prog__row"><span>Стипендия Elite</span><b className="prog__schol">{p.schol}</b></div>
              </div>
              <div className="prog__specs">{p.specs}</div>
              <a href={progLink(p)} className="prog__link">
                {p.field && cur.level ? "Вузы с этой программой →" : "Узнать подробнее →"}
              </a>
            </article>
          ))}
        </div>

        {cur.level && catalogCount > 0 && (
          <div className="programs__cat-link" data-reveal>
            В каталоге <b>{catalogCount}</b> вузов с уровнем «{cur.level}» —{" "}
            <a href={`universities.html?level=${encodeURIComponent(cur.level)}`}>открыть с фильтром →</a>
          </div>
        )}
      </div>
    </section>
  );
}

const EXAMS = [
  { name: "TOEFL", desc: "Признан вузами США и Канады. Формат iBT.", diff: "Средне", price: "$185", for: "🇺🇸 🇨🇦" },
  { name: "IELTS", desc: "Универсален для UK, Австралии, Европы.", diff: "Средне", price: "$215", for: "🇬🇧 🇦🇺 🇪🇺" },
  { name: "SAT", desc: "Для бакалавриата в США. Math + Reading.", diff: "Высоко", price: "$103", for: "🇺🇸" },
  { name: "GRE", desc: "Для магистратуры и PhD в США.", diff: "Высоко", price: "$220", for: "🇺🇸" },
  { name: "GMAT", desc: "Для поступления на МВА.", diff: "Высоко", price: "$275", for: "🌍" },
];

function Exams() {
  return (
    <section className="section exams" id="exams">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow eyebrow--gold">Экзамены и тесты</span>
          <h2>Какой тест нужен для поступления?</h2>
        </div>

        <div className="exams__hero card" data-reveal>
          <div className="exams__hero-left">
            <span className="chip tag-green">⭐ Наша специализация</span>
            <h3 className="exams__hero-name">Duolingo English Test</h3>
            <p className="exams__hero-desc">105–140 баллов. Сдаётся онлайн из дома за <b>$65</b>. Наши студенты в среднем сдают с <b>1-й попытки</b> — мы доводим до нужного балла.</p>
            <div className="exams__hero-stats">
              <div><b>$65</b><span>стоимость</span></div>
              <div><b>~48ч</b><span>результат</span></div>
              <div><b>100+</b><span>сдали с нами</span></div>
            </div>
            <a href="#cta" className="btn btn--gold">Подготовиться с нами</a>
          </div>
          <div className="ph exams__hero-vis" data-label="Duolingo · промо-визуал"></div>
        </div>

        <div className="exams__grid">
          {EXAMS.map((e, i) => (
            <article className="exam card card--lift" data-reveal data-delay={i + 1} key={i}>
              <div className="exam__name">{e.name}</div>
              <p className="exam__desc">{e.desc}</p>
              <div className="exam__meta">
                <span className="chip">Сложность: {e.diff}</span>
                <span className="chip tag-blue">{e.price}</span>
              </div>
              <div className="exam__for">Для стран: {e.for}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Programs = Programs;
window.Exams = Exams;
