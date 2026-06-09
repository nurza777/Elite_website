/* ============================================================
   PROGRAMS (tabs) · EXAMS (cards, Duolingo accent)
   ============================================================ */
const { useState } = React;

const PROGRAMS = {
  "Бакалавриат": [
    { name: "Computer Science", flag: "🇺🇸", country: "США", dur: "4 года", price: "$12 000/год", schol: "ср. $40 000", specs: "AI · Data · Software" },
    { name: "Business Administration", flag: "🇺🇸", country: "США", dur: "4 года", price: "$11 000/год", schol: "ср. $32 000", specs: "Маркетинг · Финансы" },
    { name: "Design & Architecture", flag: "🇮🇹", country: "Италия", dur: "3 года", price: "$3 900/год", schol: "ср. $9 000", specs: "Product · Interior" },
  ],
  "Магистратура": [
    { name: "Data Science (MSc)", flag: "🇬🇧", country: "Великобритания", dur: "1 год", price: "$24 000/год", schol: "ср. $18 000", specs: "ML · Analytics" },
    { name: "Engineering (MSc)", flag: "🇩🇪", country: "Германия", dur: "2 года", price: "Бесплатно", schol: "DAAD грант", specs: "Robotics · Energy" },
    { name: "Public Health (MPH)", flag: "🇺🇸", country: "США", dur: "2 года", price: "$26 000/год", schol: "ср. $30 000", specs: "Эпидемиология" },
  ],
  "МВА": [
    { name: "Full-time MBA", flag: "🇺🇸", country: "США", dur: "2 года", price: "$32 000/год", schol: "ср. $45 000", specs: "Strategy · Finance" },
    { name: "Global MBA", flag: "🇬🇧", country: "Великобритания", dur: "1 год", price: "$38 000/год", schol: "ср. $20 000", specs: "Leadership" },
    { name: "Tech MBA", flag: "🇺🇸", country: "США", dur: "1.5 года", price: "$29 000/год", schol: "ср. $35 000", specs: "Product · Startups" },
  ],
  "PhD": [
    { name: "PhD in Computer Science", flag: "🇺🇸", country: "США", dur: "4–5 лет", price: "Финансируется", schol: "стипендия + стайпенд", specs: "Research" },
    { name: "PhD in Engineering", flag: "🇩🇪", country: "Германия", dur: "3–4 года", price: "Финансируется", schol: "оплата позиции", specs: "Applied research" },
    { name: "PhD in Economics", flag: "🇬🇧", country: "Великобритания", dur: "3–4 года", price: "Финансируется", schol: "стипендия", specs: "Econometrics" },
  ],
  "Языковые": [
    { name: "Intensive English (ESL)", flag: "🇺🇸", country: "США", dur: "4–24 нед.", price: "$1 200/мес", schol: "—", specs: "Подготовка к вузу" },
    { name: "Academic English", flag: "🇬🇧", country: "Великобритания", dur: "8–36 нед.", price: "$1 500/мес", schol: "—", specs: "IELTS prep" },
    { name: "Italian A1–B2", flag: "🇮🇹", country: "Италия", dur: "12 нед.", price: "$900/мес", schol: "—", specs: "Для бесплатных вузов" },
  ],
  "Летние школы": [
    { name: "Summer @ Berkeley", flag: "🇺🇸", country: "США", dur: "6 нед.", price: "$4 500", schol: "частичные", specs: "Pre-college" },
    { name: "Oxford Summer", flag: "🇬🇧", country: "Великобритания", dur: "3 нед.", price: "$5 200", schol: "—", specs: "Academic" },
    { name: "Milan Design Camp", flag: "🇮🇹", country: "Италия", dur: "4 нед.", price: "$3 100", schol: "—", specs: "Creative" },
  ],
  "Онлайн": [
    { name: "Online Bachelor (CS)", flag: "🇺🇸", country: "США", dur: "4 года", price: "$7 000/год", schol: "ср. $15 000", specs: "Гибкий график" },
    { name: "Online MBA", flag: "🇺🇸", country: "США", dur: "1.5 года", price: "$18 000", schol: "ср. $9 000", specs: "Без отрыва" },
    { name: "MicroMasters", flag: "🌍", country: "Глобально", dur: "6–12 мес.", price: "$1 500", schol: "—", specs: "Credential" },
  ],
};

function Programs() {
  const tabs = Object.keys(PROGRAMS);
  const [tab, setTab] = useState(tabs[0]);
  return (
    <section className="section section--tight programs" id="programs">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Программы обучения</span>
          <h2>Найди формат под свою цель</h2>
        </div>

        <div className="programs__tabs" data-reveal>
          {tabs.map((t) => (
            <button key={t} className={"programs__tab" + (tab === t ? " is-on" : "")} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        <div className="programs__grid stagger" key={tab}>
          {PROGRAMS[tab].map((p, i) => (
            <article className="prog card card--lift" key={i}>
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
              <a href="#cta" className="prog__link">Узнать подробнее →</a>
            </article>
          ))}
        </div>
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
