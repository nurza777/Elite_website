/* ============================================================
   TRUST BAR (marquee) · PAIN→SOLUTION · COUNTRIES
   ============================================================ */
const { useState } = React;

const UNI_LOGOS = [
  /* Italy */
  { src: "images/logos/catalog/polimi.png",     name: "Politecnico di Milano" },
  { src: "images/logos/catalog/polito.png",     name: "Politecnico di Torino" },
  { src: "images/logos/catalog/bocconi.png",    name: "Università Bocconi" },
  { src: "images/logos/catalog/sapienza.png",   name: "Sapienza · Рим" },
  { src: "images/logos/catalog/luiss.png",      name: "LUISS" },
  { src: "images/logos/catalog/unito.png",      name: "Università di Torino" },
  { src: "images/logos/catalog/cafoscari.png",  name: "Ca' Foscari Venezia" },
  { src: "images/logos/catalog/iulm.png",       name: "IULM Milano" },
  { src: "images/logos/catalog/lum.png",        name: "LUM University" },
  { src: "images/logos/catalog/lumsa.png",      name: "LUMSA Roma" },
  { src: "images/logos/catalog/roma3.png",      name: "Roma Tre" },
  { src: "images/logos/catalog/rufa.png",       name: "RUFA Roma" },
  { src: "images/logos/catalog/linkcu.png",     name: "Link Campus University" },
  { src: "images/logos/catalog/unibo.png",      name: "Università di Bologna" },
  { src: "images/logos/catalog/unifi.png",      name: "Università di Firenze" },
  { src: "images/logos/catalog/unimi.png",      name: "Università di Milano" },
  { src: "images/logos/catalog/unimib.png",     name: "Milano-Bicocca" },
  { src: "images/logos/catalog/unipd.png",      name: "Università di Padova" },
  { src: "images/logos/catalog/marang.png",     name: "Marangoni" },
  /* USA */
  { src: "images/logos/catalog/roosevelt.png",  name: "Roosevelt University" },
  { src: "images/logos/catalog/bellevue.png",   name: "Bellevue College" },
  { src: "images/logos/catalog/lasalle.png",    name: "La Salle University" },
  { src: "images/logos/catalog/temple.png",     name: "Temple University" },
  { src: "images/logos/catalog/depaul.png",     name: "DePaul University" },
  { src: "images/logos/catalog/drexel.png",     name: "Drexel University" },
  { src: "images/logos/catalog/asu.png",        name: "Arizona State" },
  { src: "images/logos/catalog/adelphi.png",    name: "Adelphi University" },
  { src: "images/logos/catalog/calstate.png",   name: "California State" },
  { src: "images/logos/catalog/clarkson.png",   name: "Clarkson University" },
  { src: "images/logos/catalog/concord.png",    name: "Concordia University" },
  { src: "images/logos/catalog/cwu.png",        name: "Central Washington Univ." },
  { src: "images/logos/catalog/fiu.png",        name: "Florida International" },
  { src: "images/logos/catalog/floridatech.png",name: "Florida Institute of Tech." },
  { src: "images/logos/catalog/gannon.png",     name: "Gannon University" },
  { src: "images/logos/catalog/ggu.png",        name: "Golden Gate University" },
  { src: "images/logos/catalog/harrisu.png",    name: "Harrisburg University" },
  { src: "images/logos/catalog/lynn.png",       name: "Lynn University" },
  { src: "images/logos/catalog/nau.png",        name: "Northern Arizona Univ." },
  { src: "images/logos/catalog/nyfa.png",       name: "New York Film Academy" },
  { src: "images/logos/catalog/pace.png",       name: "Pace University" },
  { src: "images/logos/catalog/radford.png",    name: "Radford University" },
  { src: "images/logos/catalog/rowan.png",      name: "Rowan University" },
  { src: "images/logos/catalog/sfbu.png",       name: "SF Bay University" },
  { src: "images/logos/catalog/sfsu.png",       name: "San Francisco State" },
  { src: "images/logos/catalog/simmons.png",    name: "Simmons University" },
  { src: "images/logos/catalog/sjsu.png",       name: "San José State" },
  { src: "images/logos/catalog/suffolk.png",    name: "Suffolk University" },
  { src: "images/logos/catalog/uarizona.png",   name: "University of Arizona" },
  { src: "images/logos/catalog/ub.png",         name: "University at Buffalo" },
  { src: "images/logos/catalog/uconn.png",      name: "University of Connecticut" },
  { src: "images/logos/catalog/unm.png",        name: "Univ. of New Mexico" },
  { src: "images/logos/catalog/usf.png",        name: "Univ. of San Francisco" },
  { src: "images/logos/catalog/uta.png",        name: "UT Arlington" },
  { src: "images/logos/catalog/utulsa.png",     name: "University of Tulsa" },
  { src: "images/logos/catalog/webster.png",    name: "Webster University" },
  { src: "images/logos/catalog/westcliff.png",  name: "Westcliff University" },
  { src: "images/logos/catalog/greenriver.png", name: "Green River College" },
  /* Austria */
  { src: "images/logos/catalog/wu.png",         name: "WU Wien" },
  { src: "images/logos/catalog/tuwien.png",     name: "TU Wien" },
  { src: "images/logos/catalog/jku.png",        name: "JKU Linz" },
  { src: "images/logos/catalog/uniwien.png",    name: "University of Vienna" },
  { src: "images/logos/catalog/mug.png",        name: "Medical Univ. Graz" },
  { src: "images/logos/catalog/muw.png",        name: "Medical Univ. Vienna" },
  /* Poland & Germany */
  { src: "images/logos/catalog/vistula.png",    name: "Vistula University" },
  { src: "images/logos/catalog/gisma.png",      name: "GISMA Business School" },
  { src: "images/logos/catalog/pjatk.png",      name: "PJATK Warsaw" },
  { src: "images/logos/catalog/vizja.png",      name: "Vizja University" },
  /* Malaysia */
  { src: "images/logos/catalog/monash.png",     name: "Monash University" },
  { src: "images/logos/catalog/sunway.png",     name: "Sunway University" },
  { src: "images/logos/catalog/taylors.png",    name: "Taylor's University" },
  { src: "images/logos/catalog/apu.png",        name: "Asia Pacific University" },
  { src: "images/logos/catalog/help.png",       name: "HELP University" },
  { src: "images/logos/catalog/hwu.png",        name: "Heriot-Watt Malaysia" },
  { src: "images/logos/catalog/iium.png",       name: "IIUM Malaysia" },
  { src: "images/logos/catalog/imu.png",        name: "Int'l Medical Univ." },
  { src: "images/logos/catalog/inti.png",       name: "INTI International" },
  { src: "images/logos/catalog/mahsa.png",      name: "MAHSA University" },
  { src: "images/logos/catalog/mmu.png",        name: "Multimedia University" },
  { src: "images/logos/catalog/segi.png",       name: "SEGI University" },
  { src: "images/logos/catalog/swinburne.png",  name: "Swinburne Malaysia" },
  { src: "images/logos/catalog/taruc.png",      name: "TAR UC" },
  { src: "images/logos/catalog/toa.png",        name: "The One Academy" },
  { src: "images/logos/catalog/unikl.png",      name: "UniKL" },
  { src: "images/logos/catalog/unitar.png",     name: "UNITAR" },
  { src: "images/logos/catalog/uniten.png",     name: "UNITEN" },
  { src: "images/logos/catalog/uow.png",        name: "Univ. of Wollongong" },
  { src: "images/logos/catalog/utar.png",       name: "UTAR" },
  { src: "images/logos/catalog/utp.png",        name: "UTP Petronas" },
  /* North Cyprus */
  { src: "images/logos/catalog/emu.png",        name: "Eastern Mediterranean" },
  { src: "images/logos/catalog/ciu.png",        name: "Cyprus Int'l University" },
  { src: "images/logos/catalog/eul.png",        name: "European Univ. of Lefke" },
];

function TrustBar() {
  const items = [...UNI_LOGOS, ...UNI_LOGOS];
  return (
    <section className="trustbar">
      <div className="wrap trustbar__head">
        <span className="trustbar__label">{t("trust.label")}</span>
      </div>
      <div className="unibar">
        <div className="unibar__track">
          {items.map((l, i) => (
            <div className="unibar__item" key={i}>
              <div className="unibar__logo-box">
                <img src={l.src} alt={l.name} className="unibar__logo" loading="lazy" />
              </div>
              <span className="unibar__name">{l.name}</span>
            </div>
          ))}
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
          <span className="eyebrow">{t("pain.eyebrow")}</span>
          <h2>{t("pain.h2a")}<br/><span className="text-blue">{t("pain.h2b")}</span></h2>
        </div>

        <div className="pain__grid">
          <div className="pain__col pain__col--bad" data-reveal>
            <div className="pain__col-h">
              <span className="pain__col-badge pain__col-badge--bad">{t("pain.without")}</span>
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
              <span className="pain__col-badge pain__col-badge--good">{t("pain.with")}</span>
            </div>
            {PAIN.map((r, i) => (
              <div className="pain__row pain__row--good" key={i}>
                <span className="pain__ic pain__ic--good">✓</span>
                <span>{r[1]}</span>
              </div>
            ))}
            <a href="#cta" className="btn btn--gold btn--block pain__cta">{t("pain.startWith")}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

const COUNTRIES_DEFAULT = [
  {
    flagImg: "https://flagcdn.com/40x30/it.png", name: "Италия", landmark: "Рим · Флоренция · Венеция",
    desc: "Культура · Гастрономия · Дольче Вита", price: "от €2 000/год", hot: true,
    photo: "images/countries/italy/1.jpg",
    bg: "linear-gradient(160deg,#9b5e2a 0%,#6b3210 55%,#2e1005 100%)",
    accent: "#d4845a",
  },
  {
    flagImg: "https://flagcdn.com/40x30/us.png", name: "США", landmark: "Нью-Йорк · Чикаго · Лос-Анджелес",
    desc: "Карьера · Топ-кампусы · Стипендии",    price: "от $8 000/год", hot: true,
    photo: "images/countries/usa/1.jpg",
    bg: "linear-gradient(160deg,#0d2b5e 0%,#091842 55%,#030a1c 100%)",
    accent: "#4a8fc7",
  },
  {
    flagImg: "https://flagcdn.com/40x30/at.png", name: "Австрия", landmark: "Вена · Зальцбург · Инсбрук",
    desc: "Безопасность · Европа · Высокое качество", price: "от €726/год",
    photo: "images/countries/austria/1.jpg",
    bg: "linear-gradient(160deg,#1a4a2e 0%,#0d2d1a 55%,#051208 100%)",
    accent: "#4caf82",
  },
  {
    flagImg: "https://flagcdn.com/40x30/de.png", name: "Германия", landmark: "Берлин · Мюнхен · Гамбург",
    desc: "Технологии · Made in Germany · Карьера",  price: "от €0/год",
    photo: "images/countries/germany/1.jpg",
    bg: "linear-gradient(160deg,#2a2a3a 0%,#161622 55%,#07070d 100%)",
    accent: "#8a8ab0",
  },
  {
    flagImg: "https://flagcdn.com/40x30/pl.png", name: "Польша", landmark: "Варшава · Краков · Вроцлав",
    desc: "Близко · Доступно · Востребовано",        price: "от €2 000/год",
    photo: "images/countries/poland/1.jpg",
    bg: "linear-gradient(160deg,#7a1a1a 0%,#4d0d0d 55%,#1a0303 100%)",
    accent: "#e06060",
  },
  {
    flagImg: "images/flags/trnc/40x30.png",
    name: "Северный Кипр", landmark: "Фамагуста · Кирения · Никосия",
    desc: "Без языкового теста · Тёплый климат",     price: "от $3 000/год",
    photo: "images/countries/kipr/1.jpg",
    bg: "linear-gradient(160deg,#0d6b6b 0%,#074545 55%,#021818 100%)",
    accent: "#4fc4c4",
  },
  {
    flagImg: "https://flagcdn.com/40x30/my.png", name: "Малайзия", landmark: "Куала-Лумпур · Пинанг · Джохор",
    desc: "Мусульм. среда · Азия · Безопасность",    price: "от $4 000/год",
    photo: "images/countries/malasia/1.jpg",
    bg: "linear-gradient(160deg,#1a5c2e 0%,#0d3a1c 55%,#04130a 100%)",
    accent: "#5cba7a",
  },
];

/* Admin-edited content wins over the defaults above */
const COUNTRIES = window.eaContent ? window.eaContent("countryCards", COUNTRIES_DEFAULT) : COUNTRIES_DEFAULT;
window.EA_COUNTRY_CARDS = COUNTRIES;

function Countries() {
  return (
    <section className="section countries" id="countries-section">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{t("countries.eyebrow")}</span>
          <h2>{t("countries.h2a")}<br/><span className="text-blue">{t("countries.h2b")}</span></h2>
        </div>
      </div>
      <div className="wrap">
        <ScrollRail trackClass="countries__grid" loop={true} step={320}>
          {COUNTRIES.map((c, i) => (
            <a href={`country.html?c=${encodeURIComponent(c.name)}`} className="country card--lift" key={i}
               style={{ "--c-bg": c.bg, "--c-accent": c.accent }}>
              {/* Photo area */}
              <div className="country__photo"
                   style={ c.photo
                     ? { backgroundImage: `url(${c.photo})` }
                     : { background: c.bg } }>
                {c.hot && <span className="country__hot">{t("countries.hot")}</span>}
                <div className="country__photo-overlay" />
                <div className="country__photo-bottom">
                  <span className="country__flag-big">
                    {c.flagImg ? <img src={c.flagImg} alt={c.name} className="country__flag-img" /> : c.flag}
                  </span>
                  <span className="country__name-over">{t("country." + c.name) || c.name}</span>
                </div>
              </div>
              {/* Card body */}
              <div className="country__body">
                <div className="country__landmark">{c.landmark}</div>
                <div className="country__desc">{c.desc}</div>
                <div className="country__footer">
                  <span className="country__price">{c.price}</span>
                  <span className="country__link">{t("countries.more")}</span>
                </div>
              </div>
            </a>
          ))}
        </ScrollRail>
      </div>
    </section>
  );
}

/* ============================================================
   BEYOND DIPLOMA — visual bento-grid section
   "Зарубежное образование — это не только диплом"
   ============================================================ */
const BEYOND = [
  { cls: "travel",  title: "Путешествия", sub: "Новые страны каждые каникулы",       video: "videos/beyond-travel.mp4",  poster: "images/beyond/travel.jpg"  },
  { cls: "career",  title: "Карьера",     sub: "Международное резюме с первого дня",  video: "videos/beyond-career.mp4",  poster: "images/beyond/career.jpg"  },
  { cls: "friends", title: "Друзья",      sub: "Со всего мира — на всю жизнь",         video: "videos/beyond-friends.mp4", poster: "images/beyond/friends.jpg" },
  { cls: "network", title: "Знакомства",  sub: "Alumni-сеть в 40+ странах",            video: "videos/beyond-network.mp4", poster: "images/beyond/network.jpg" },
  { cls: "world",   title: "Среда",       sub: "100+ национальностей рядом",           video: "videos/beyond-world.mp4",   poster: "images/beyond/world.jpg"   },
];

function BeyondCell({ item }) {
  const ref = React.useRef(null);
  const [sound, setSound] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);

  function enter() { const v = ref.current; if (v && v.muted) { v.play().catch(() => {}); setPlaying(true); } }
  function leave() {
    const v = ref.current;
    if (v && v.muted) { v.pause(); v.currentTime = 0; setPlaying(false); } // keep playing if user turned sound on
  }
  function toggleSound(e) {
    e.stopPropagation();
    const v = ref.current; if (!v) return;
    if (v.muted) { v.muted = false; v.play().catch(() => {}); setSound(true); setPlaying(true); }
    else { v.muted = true; setSound(false); }
  }

  return (
    <div
      className={`beyond__cell beyond__cell--${item.cls}` + (sound ? " beyond__cell--sound" : "")}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onClick={toggleSound}
      role="button"
      tabIndex={0}
    >
      <img
        src={item.poster}
        alt={item.title}
        className={"beyond__poster" + (playing ? " beyond__poster--hide" : "")}
        loading="lazy"
      />
      <video
        ref={ref}
        className="beyond__video"
        src={item.video}
        muted loop playsInline preload="metadata"
      />
      <div className="beyond__scrim" />
      <div className="beyond__overlay" />
      <div className="beyond__content">
        <strong className="beyond__title">{item.title}</strong>
        <span className="beyond__sub">{item.sub}</span>
      </div>
      <span className="beyond__play" aria-hidden="true">
        {sound ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.6 7-8.8s-3-7.8-7-8.8z"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM3 3l18 18-1.4 1.4L1.6 4.4 3 3z"/></svg>
        )}
      </span>
      <span className="beyond__sound-hint" aria-hidden="true">{sound ? "Звук включён" : "Нажми для звука"}</span>
    </div>
  );
}

function BeyondDiploma() {
  return (
    <section className="beyond" id="beyond">
      <div className="wrap">
        <div className="beyond__head" data-reveal>
          <h2 className="beyond__h2"><span className="text-blue">Образование за рубежом —</span><br/>это не только диплом</h2>
        </div>
      </div>
      <div className="beyond__grid" data-reveal data-delay="1">
        {BEYOND.map((item) => <BeyondCell key={item.cls} item={item} />)}
      </div>
    </section>
  );
}

window.TrustBar = TrustBar;
window.BeyondDiploma = BeyondDiploma;
window.PainSolution = PainSolution;
window.Countries = Countries;
