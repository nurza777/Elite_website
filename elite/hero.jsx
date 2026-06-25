/* ============================================================
   HERO — video background + waves + counters + student modal
   ============================================================ */
const { useState, useEffect, useRef } = React;

const FEATURED_STUDENTS = [
  {
    n: "Нурзар", country: "США", u: "Roosevelt University, Чикаго",
    s: "$120 000", quote: "Даже не верила, что смогу поступить в США. С Elite Academy всё оказалось реально — сейчас уже второй курс!",
    poster: "thumbs/nurzar.jpg", video: "videos/nurzar.mp4",
  },
  {
    n: "Элана", country: "Италия", u: "Università degli Studi di Milano",
    s: "Грант €0", quote: "Я всегда мечтала учиться в Европе. Elite Academy помогли с документами, языком и нашли грант. Теперь учусь в Милане!",
    poster: "thumbs/elana.jpg", video: "videos/elana.mp4",
  },
  {
    n: "Амир", country: "США", u: "Bellevue College, Сиэтл",
    s: "$95 000", quote: "Elite Academy сделали процесс поступления понятным. Без них я бы потратил годы на разбор всей этой системы.",
    poster: "thumbs/amir.jpg", video: "videos/amir.mp4",
  },
  {
    n: "Анель", country: "Италия", u: "Università di Roma La Sapienza",
    s: "Грант €0", quote: "Команда Elite Academy — профессионалы. Они знают каждый шаг и помогают на каждом этапе. Без них я бы не справилась.",
    poster: "thumbs/anel.jpg", video: "videos/anel.mp4",
  },
];

function StudentModal({ student, onClose }) {
  useEffect(() => {
    if (!student) return;
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [student]);

  if (!student) return null;

  return (
    <div className="smodal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${student.n}`}>
      <div className="smodal" onClick={(e) => e.stopPropagation()}>
        <button className="smodal__close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="2" y1="2" x2="16" y2="16"/><line x1="16" y1="2" x2="2" y2="16"/>
          </svg>
        </button>

        <div className="smodal__photo-wrap">
          <StudentPhoto student={student} className="smodal__photo" />
          <div className="smodal__photo-overlay" aria-hidden="true"></div>
          <div className="smodal__photo-tag">{t("hero.successTag")}</div>
        </div>

        <div className="smodal__body">
          <div className="smodal__header">
            <div>
              <h3 className="smodal__name">{student.n}</h3>
              <p className="smodal__uni">{student.u}</p>
              <p className="smodal__country">{t("country." + student.country) || student.country}</p>
            </div>
            <div className="smodal__money">
              <div className="smodal__money-val">{student.s}</div>
              <div className="smodal__money-lab">{t("hero.scholarships")}</div>
            </div>
          </div>

          <blockquote className="smodal__quote">«{student.quote}»</blockquote>

          <div className="smodal__actions">
            <a href="stories.html" className="btn btn--gold btn--block">{t("hero.readFullStory")}</a>
            <a href="#cta" className="btn btn--ghost smodal__cta-ghost" onClick={onClose}>{t("hero.wantSame")}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentPhoto({ student, className }) {
  const [err, setErr] = useState(false);
  if (err || !student.poster) {
    return <div className={"ph ph--dark " + className} data-label={"фото · " + student.n}></div>;
  }
  return <img src={student.poster} alt={student.n} className={className} onError={() => setErr(true)} />;
}

function HeroVideo() {
  return (
    <video className="hero__video" autoPlay muted loop playsInline aria-hidden="true" preload="auto">
      <source src="videos/hero.mp4" type="video/mp4" />
    </video>
  );
}

function HeroWaves() {
  const wavePath = "M 0 60 C 240 20, 480 100, 720 60 S 1200 20, 1440 60 L 1440 100 L 0 100 Z " +
                   "M 1440 60 C 1680 20, 1920 100, 2160 60 S 2640 20, 2880 60 L 2880 100 L 1440 100 Z";
  return (
    <div className="hero__waves" aria-hidden="true">
      <svg viewBox="0 0 2880 100" preserveAspectRatio="none">
        <path className="wave-1" d={wavePath} />
        <path className="wave-2" d={wavePath} transform="translate(0,-8)" />
        <path className="wave-3" d={wavePath} transform="translate(0,-18)" />
      </svg>
    </div>
  );
}

function Counter({ to, suffix = "", duration = 1600 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(to);
  useEffect(() => {
    let started = false, raf;
    const el = ref.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          const t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(eased * to));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    if (el) io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const HERO_STATS = [
  { to: 1500, suffix: "+", key: "hero.stat.students" },
  { to: 500,  suffix: "+", key: "hero.stat.unis" },
  { to: 7,    suffix: "",  key: "hero.stat.countries" },
  { to: 5,    suffix: " " + (window.__EA_LANG === "en" ? "yrs" : window.__EA_LANG === "kg" ? "жыл" : "лет"), key: "hero.stat.years" },
];

function TeamPhoto() {
  const [err, setErr] = useState(false);
  if (err) {
    return <div className="ph ph--dark hero__team-img" data-label="Elite Academy team"></div>;
  }
  return (
    <img src="images/team.jpg" alt="Elite Academy team" className="hero__team-img" onError={() => setErr(true)} />
  );
}

function AvaBtn({ student, onClick }) {
  const [err, setErr] = useState(false);
  return (
    <button
      className="ava ava--btn"
      onClick={onClick}
      title={student.n}
      aria-label={student.n}
    >
      {(!err && student.poster)
        ? <img src={student.poster} alt={student.n} onError={() => setErr(true)} />
        : <span className="ava__init">{student.n[0]}</span>
      }
    </button>
  );
}

function Hero() {
  const [modalStudent, setModalStudent] = useState(null);
  const featured = FEATURED_STUDENTS[0];

  return (
    <section className="hero grain" id="top">
      <HeroVideo />
      <div className="hero__overlay" aria-hidden="true"></div>
      <div className="wrap hero__grid">
        <div className="hero__left">
          <div className="hero__badge" data-reveal>
            <span className="hero__badge-dot"></span>
            {t("hero.badge")}
          </div>

          <h1 className="hero__h1" data-reveal data-delay="1">
            <span className="grad-gold">{t("hero.h1a")}</span><br/>{t("hero.h1b")}
          </h1>

          <p className="hero__sub" data-reveal data-delay="2">
            {t("hero.sub")}
          </p>

          <div className="hero__cta" data-reveal data-delay="3">
            <a href="#cta" className="btn btn--gold btn--lg">{t("hero.ctaPrimary")}</a>
            <a href="#quiz" className="btn btn--ghost-light btn--lg">{t("hero.ctaSecondary")}</a>
          </div>

          <div className="hero__stats" data-reveal data-delay="5">
            {HERO_STATS.map((s, i) => (
              <div className="hero__stat" key={i}>
                <div className="hero__stat-n"><Counter to={s.to} suffix={s.suffix} /></div>
                <div className="hero__stat-l">{t(s.key)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__right">
          <div className="hero__photo-frame" data-reveal data-delay="2">
            <TeamPhoto />
          </div>

          <div
            className="success-card glass success-card--horiz success-card--clickable"
            data-reveal data-delay="4"
            role="button" tabIndex={0}
            onClick={() => setModalStudent(featured)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setModalStudent(featured); } }}
            aria-label={featured.n}
          >
            <div className="success-card__tag">{t("hero.successTag")}</div>
            <div className="success-card__horiz-row">
              <StudentPhoto student={featured} className="success-card__avatar success-card__avatar--img" />
              <div className="success-card__horiz-info">
                <div className="success-card__name">{featured.n} {t("hero.enrolledIn")} <b>{t("country." + featured.country) || featured.country}</b></div>
                <div className="success-card__uni">{featured.u}</div>
                <span className="success-card__link">{t("hero.readStory")}</span>
              </div>
              <div className="success-card__horiz-money">
                <div className="success-card__money-label">{t("hero.scholarships")}</div>
                <div className="success-card__money-val">{featured.s}</div>
              </div>
            </div>
            <div className="success-card__foot">
              <div className="ava-stack" onClick={(e) => e.stopPropagation()}>
                {FEATURED_STUDENTS.map((st) => (
                  <AvaBtn key={st.n} student={st} onClick={() => setModalStudent(st)} />
                ))}
              </div>
              <span><b>+18 {t("hero.studentsMonth")}</b></span>
            </div>
          </div>
        </div>
      </div>
      <HeroWaves />
      <div className="hero__fade"></div>

      <StudentModal student={modalStudent} onClose={() => setModalStudent(null)} />
    </section>
  );
}

window.Hero = Hero;
window.Counter = Counter;
