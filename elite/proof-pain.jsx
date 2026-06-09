/* ============================================================
   TRUST BAR (marquee) · PAIN→SOLUTION · COUNTRIES
   ============================================================ */
const { useState } = React;

const PARTNERS = [
  "ICEF","Shorelight","Apply Wave","Bellevue College","La Salle University",
  "Roosevelt University","Kalamazoo College","Drake University","National Louis University","Westcliff University",
];

function TrustBar() {
  return (
    <section className="trustbar">
      <div className="wrap trustbar__inner">
        <span className="trustbar__label">Нам доверяют</span>
        <div className="trustbar__track">
          <div className="trustbar__row">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <span className="trustbar__logo" key={i}>
                <span className="trustbar__dot"></span>{p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const PAIN = [
  ["Не знаешь, с чего вообще начать", "Пошаговый план с первого дня"],
  ["Месяцами ищешь стипендии вслепую", "Мы знаем, где лежат $72 000 – $858 000"],
  ["Ошибка в DS-160 = отказ в визе", "100% правильное заполнение анкеты"],
  ["Слабое эссе = отказ приёмной комиссии", "Эссе проверяет основатель лично"],
  ["Не знаешь, как вести себя на визовом интервью", "Финальный урок по интервью перед посольством"],
];

function PainSolution() {
  return (
    <section className="section pain">
      <div className="wrap">
        <div className="section-head section-head--center" data-reveal>
          <span className="eyebrow">Почему с нами</span>
          <h2>Поступить самому — это лотерея.<br/><span className="text-blue">С нами — это система.</span></h2>
        </div>

        <div className="pain__grid">
          <div className="pain__col pain__col--bad" data-reveal>
            <div className="pain__col-h">
              <span className="pain__col-badge pain__col-badge--bad">Без Elite Academy</span>
            </div>
            {PAIN.map((r, i) => (
              <div className="pain__row pain__row--bad" key={i}>
                <span className="pain__ic pain__ic--bad">✕</span>
                <span>{r[0]}</span>
              </div>
            ))}
          </div>

          <div className="pain__col pain__col--good" data-reveal data-delay="1">
            <div className="pain__col-h">
              <span className="pain__col-badge pain__col-badge--good">С Elite Academy</span>
            </div>
            {PAIN.map((r, i) => (
              <div className="pain__row pain__row--good" key={i}>
                <span className="pain__ic pain__ic--good">✓</span>
                <span>{r[1]}</span>
              </div>
            ))}
            <a href="#cta" className="btn btn--gold btn--block pain__cta">Начать с нами →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

const COUNTRIES = [
  { flag: "🇺🇸", name: "США", price: "от $8 000/год", progs: "312 программ", hot: true },
  { flag: "🇮🇹", name: "Италия", price: "от $2 000/год", progs: "148 программ" },
  { flag: "🇬🇧", name: "Великобритания", price: "от $14 000/год", progs: "210 программ" },
  { flag: "🇩🇪", name: "Германия", price: "от $0/год", progs: "96 программ", hot: true },
  { flag: "🇨🇦", name: "Канада", price: "от $11 000/год", progs: "134 программы" },
  { flag: "🇦🇺", name: "Австралия", price: "от $15 000/год", progs: "88 программ" },
  { flag: "🇦🇪", name: "ОАЭ", price: "от $9 000/год", progs: "54 программы" },
  { flag: "🇰🇷", name: "Южная Корея", price: "от $4 000/год", progs: "61 программа" },
];

function Countries() {
  return (
    <section className="section section--tight countries">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Направления</span>
          <h2>Куда едут наши студенты?</h2>
        </div>
      </div>
      <div className="wrap">
        <div className="rail">
          {COUNTRIES.map((c, i) => (
            <a href="#" className="country card card--lift" data-tilt key={i}>
              <div className="ph country__photo" data-label={"фото · " + c.name}>
                {c.hot && <span className="country__hot">🔥 Популярно</span>}
              </div>
              <div className="country__body">
                <div className="country__name"><span className="country__flag">{c.flag}</span>{c.name}</div>
                <div className="country__meta">
                  <span>{c.price}</span><span className="country__dot">·</span><span>{c.progs}</span>
                </div>
                <span className="country__link">Подробнее →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

window.TrustBar = TrustBar;
window.PainSolution = PainSolution;
window.Countries = Countries;
