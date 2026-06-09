/* ============================================================
   HERO — animated mesh + blue particles + waves + counters
   ============================================================ */
const { useState, useEffect, useRef } = React;

function ParticleField() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    let raf, w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(60, Math.round(w / 22));
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        light: Math.random() > 0.55,  // light blue vs. mid blue
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 7);
        // light accent blue vs. mid-action blue — both within palette
        ctx.fillStyle = d.light ? "rgba(184,216,236,0.55)" : "rgba(74,143,199,0.55)";
        ctx.fill();
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dx = a.x - b.x, dy = a.y - b.y, dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(123,181,220,${0.14 * (1 - dist / 120)})`;
            ctx.lineWidth = 1; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    resize(); window.addEventListener("resize", resize);
    if (!reduce) draw(); else draw(), cancelAnimationFrame(raf);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="hero__canvas" aria-hidden="true" />;
}

/* Animated SVG wave layers — three drifting paths */
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
  const [val, setVal] = useState(0);
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
  { to: 500, suffix: "+", label: "студентов\nуже в США" },
  { to: 50, suffix: "+", label: "партнёрских\nуниверситетов" },
  { to: 90, suffix: "%", label: "получили\nвизу с 1 раза" },
  { to: 5, suffix: " лет", label: "на рынке\nобразования" },
];

function Hero() {
  return (
    <section className="hero grain" id="top">
      <div className="hero__mesh" aria-hidden="true"></div>
      <ParticleField />
      <div className="wrap hero__grid">
        <div className="hero__left">
          <div className="hero__badge" data-reveal>
            <span className="hero__badge-dot"></span>
            Аккредитовано ICEF · 500+ студентов уже в США
          </div>

          <h1 className="hero__h1" data-reveal data-delay="1">
            Твой путь в <span className="grad-gold">американский университет</span> начинается здесь
          </h1>

          <p className="hero__sub" data-reveal data-delay="2">
            Помогаем студентам из Кыргызстана поступить в вузы США и Европы — со стипендиями
            до <b>$858 000</b>. Без отказов. Без лишних нервов.
          </p>

          <div className="hero__search" data-reveal data-delay="3">
            <svg width="22" height="22" viewBox="0 0 20 20"><circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            <input placeholder="Найди университет, страну или программу…" />
            <button className="btn btn--blue hero__search-btn">Искать</button>
          </div>
          <div className="hero__sugs" data-reveal data-delay="3">
            <span>Популярно:</span>
            {["США", "Италия", "Bellevue College", "Duolingo тест", "Виза"].map((s) => (
              <a key={s} href="#" className="hero__sug">{s}</a>
            ))}
          </div>

          <div className="hero__cta" data-reveal data-delay="4">
            <a href="#cta" className="btn btn--gold btn--lg">Получить консультацию бесплатно</a>
            <a href="#quiz" className="btn btn--ghost-light btn--lg">Узнать свои шансы →</a>
          </div>

          <div className="hero__stats" data-reveal data-delay="5">
            {HERO_STATS.map((s, i) => (
              <div className="hero__stat" key={i}>
                <div className="hero__stat-n">
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="hero__stat-l">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__right" data-reveal data-delay="2">
          <div className="success-card glass">
            <div className="success-card__tag">★ Успех недели</div>
            <div className="ph ph--dark success-card__photo" data-label="фото студентки — Милана"></div>
            <div className="success-card__body">
              <div className="success-card__name">Милана поступила в <b>11 университетов</b></div>
              <div className="success-card__money">
                <span className="success-card__money-label">Скидок и стипендий</span>
                <span className="success-card__money-val">$858 000</span>
              </div>
              <div className="success-card__uni">Bellevue College, США</div>
              <a href="stories.html" className="success-card__link">Читать историю →</a>
            </div>
            <div className="success-card__foot">
              <div className="ava-stack">
                {[0,1,2,3].map((i) => <span key={i} className="ava" style={{ zIndex: 4 - i }}></span>)}
              </div>
              <span><b>+23 студента</b> поступили в этом месяце</span>
            </div>
          </div>
        </div>
      </div>
      <HeroWaves />
      <div className="hero__fade"></div>
    </section>
  );
}

window.Hero = Hero;
window.Counter = Counter;
