/* ============================================================
   ABOUT — О нас (company overview + stats + accreditations)
   ============================================================ */

const ABOUT_STATS = [
  { n: "1500+", l: "студентов\nотправлено" },
  { n: "7",     l: "стран\nнаправлений" },
  { n: "500+",  l: "партнёрских\nвузов" },
  { n: "5 лет", l: "на рынке\nобразования" },
];

const ABOUT_BADGES = [
  "ICEF Accredited — международная аккредитация",
  "Shorelight Partner — официальный партнёр",
  "Гарантия по договору — возврат при отказе в визе",
];

function AboutUs() {
  return (
    <section className="section about" id="about">
      <div className="wrap">
        <div className="about__grid">

          <div className="about__media" data-reveal>
            <div className="ph about__photo" data-label="команда Elite Academy"></div>
            <div className="about__fc glass">
              <div className="about__fc-n">1500+</div>
              <div className="about__fc-l">студентов уже учатся за рубежом</div>
            </div>
          </div>

          <div className="about__content" data-reveal data-delay="1">
            <span className="eyebrow">О нас</span>
            <h2>Мы не продаём мечту.<br/><span className="text-blue">Мы строим будущее.</span></h2>
            <p className="about__text">
              Elite Academy — аккредитованное образовательное агентство из Бишкека. Помогаем студентам
              из Кыргызстана и стран СНГ поступить в университеты США, Европы и Азии —
              с частичным или полным грантом. С гарантией по договору.
            </p>

            <div className="about__stats-row">
              {ABOUT_STATS.map((s, i) => (
                <div className="about__stat" key={i}>
                  <div className="about__stat-n">{s.n}</div>
                  <div className="about__stat-l">{s.l}</div>
                </div>
              ))}
            </div>

            <div className="about__badges">
              {ABOUT_BADGES.map((b, i) => (
                <div className="about__badge" key={i}>
                  <span className="about__badge-ic">✓</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <a href="#cta" className="btn btn--dark">Получить консультацию бесплатно →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

window.AboutUs = AboutUs;
