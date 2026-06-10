/* ============================================================
   HERO — animated mesh + blue particles + waves + counters
   ============================================================ */
const { useState, useEffect, useRef } = React;

function UniParticles() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf;

    const UNIS = ["MIT","UCLA","NYU","LSE","TUM","ETH","NUS","KCL","UBC","RU","BU","UIC","HAR","YAL","COL","SCU","ANU"];
    const PAL  = [
      { s: "#4A8FC7", t: "#B8D8EC" },
      { s: "#B8D8EC", t: "#FFFFFF" },
      { s: "rgba(255,255,255,.6)", t: "#FFFFFF" },
      { s: "#F4C430", t: "#F4C430" },
    ];

    // PNG logos — put white-on-transparent files in images/logos/
    // e.g. images/logos/mit.png, images/logos/ucla.png …
    const LOGO_NAMES = ["mit","ucla","nyu","lse","tum","eth","nus","kcl","ubc","ru","bu","uic","har","yal","col","scu","anu"];
    const LOGO_IMGS = {};
    LOGO_NAMES.forEach(n => {
      const img = new Image();
      img.onload = () => { LOGO_IMGS[n] = img; };
      img.src = `images/logos/${n}.png`;
    });

    let pts = [], pulseT = -9999;
    // phase: 'float' → 'form' → 'hold' → 'scatter' → 'float'
    let phase = "float", phaseT = 0;
    const DUR = { float: 3200, form: 1700, hold: 2800, scatter: 1300 };

    function resize() {
      W = cv.clientWidth || cv.offsetWidth || window.innerWidth;
      H = cv.clientHeight || cv.offsetHeight || window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    }

    function spawn() {
      const N = Math.min(88, Math.max(48, Math.floor(W / 13)));
      pts = Array.from({ length: N }, (_, i) => {
        const c = PAL[i % PAL.length];
        return {
          x: Math.random() * W, y: Math.random() * H, // full hero width
          vx: (Math.random() - .5) * .55, vy: (Math.random() - .5) * .55,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - .5) * .032,
          label: UNIS[i % UNIS.length],
          s: c.s, t: c.t,
          r: 19 + Math.random() * 9,
          ox: 0, oy: 0, tx: 0, ty: 0,
        };
      });
    }

    function circleTargets(n) {
      // Two concentric rings — outer rotates CW, inner CCW during hold
      const zone = W < 941 ? W : W * 0.45;
      const cx = zone * 0.5, cy = H * 0.5;
      const outerR = Math.min(zone * 0.40, H * 0.38);
      const innerR = outerR * 0.52;
      const outerN = Math.ceil(n * 0.62);
      const innerN = n - outerN;
      const pts = [];
      for (let i = 0; i < outerN; i++) {
        const a = (i / outerN) * Math.PI * 2 - Math.PI / 2;
        pts.push({ x: cx + outerR * Math.cos(a), y: cy + outerR * Math.sin(a),
                   ring: 0, angle: a, ringR: outerR, cx, cy });
      }
      for (let i = 0; i < innerN; i++) {
        const a = (i / innerN) * Math.PI * 2 - Math.PI / 2;
        pts.push({ x: cx + innerR * Math.cos(a), y: cy + innerR * Math.sin(a),
                   ring: 1, angle: a, ringR: innerR, cx, cy });
      }
      return pts;
    }

    function ease3(t) {
      t = Math.min(Math.max(t, 0), 1);
      return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function badge(x, y, rot, p, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y); ctx.rotate(rot);
      ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(5,20,50,.55)"; ctx.fill();
      ctx.strokeStyle = p.s; ctx.lineWidth = 1.8; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, p.r * .7, 0, Math.PI * 2);
      ctx.globalAlpha = alpha * .28; ctx.lineWidth = .7; ctx.stroke();
      ctx.globalAlpha = alpha;
      const logoKey = p.label.toLowerCase();
      if (LOGO_IMGS[logoKey]) {
        // clip to inner circle, draw (logos are pre-processed to white)
        ctx.save();
        ctx.beginPath(); ctx.arc(0, 0, p.r * .68, 0, Math.PI * 2); ctx.clip();
        const sz = p.r * 1.2;
        ctx.drawImage(LOGO_IMGS[logoKey], -sz / 2, -sz / 2, sz, sz);
        ctx.restore();
      } else {
        ctx.fillStyle = p.t;
        ctx.font = `700 ${Math.round(p.r * .46)}px "JetBrains Mono",monospace`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(p.label, 0, 0);
      }
      ctx.restore();
    }

    function drawPulse(now) {
      const age = now - pulseT;
      if (age > 950) return;
      const t = age / 950;
      const a = Math.pow(1 - t, 1.6);
      const zone = W < 941 ? W : W * 0.45;
      const cx = zone * 0.5, cy = H * 0.5; // centre of both rings
      const r = Math.min(zone, H) * (0.15 + t * 0.90);
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grd.addColorStop(0,   `rgba(220,240,255,${0.7 * a})`);
      grd.addColorStop(0.3, `rgba(123,181,220,${0.45 * a})`);
      grd.addColorStop(0.65,`rgba(74,143,199,${0.2 * a})`);
      grd.addColorStop(1,   `rgba(10,61,104,0)`);
      ctx.save(); ctx.globalAlpha = 1;
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    function tick(now) {
      ctx.clearRect(0, 0, W, H);
      const dt = now - phaseT;

      if (phase === "float") {
        pts.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
          if (p.x < -50) p.x = W + 50; if (p.x > W + 50) p.x = -50;
          if (p.y < -50) p.y = H + 50; if (p.y > H + 50) p.y = -50;
          badge(p.x, p.y, p.rot, p, .62);
        });
        if (dt > DUR.float) {
          const tgts = circleTargets(pts.length);
          pts.forEach((p, i) => {
            p.ox = p.x; p.oy = p.y;
            p.tx     = tgts[i]?.x     ?? p.x;
            p.ty     = tgts[i]?.y     ?? p.y;
            p.ring   = tgts[i]?.ring  ?? 0;
            p.angle0 = tgts[i]?.angle ?? 0;
            p.ringR  = tgts[i]?.ringR ?? 0;
            p.ringCx = tgts[i]?.cx    ?? 0;
            p.ringCy = tgts[i]?.cy    ?? 0;
          });
          phase = "form"; phaseT = now;
        }

      } else if (phase === "form") {
        const e = ease3(dt / DUR.form);
        pts.forEach(p => {
          badge(p.ox + (p.tx - p.ox) * e, p.oy + (p.ty - p.oy) * e, p.rot * (1 - e), p, .62 + e * .38);
          p.rot += p.rotV * (1 - e);
        });
        if (dt >= DUR.form) {
          pts.forEach(p => { p.x = p.tx; p.y = p.ty; p.rot = 0; });
          pulseT = now; // fire light burst
          phase = "hold"; phaseT = now;
        }

      } else if (phase === "hold") {
        const rotSpd = 0.00052; // rad/ms ≈ full turn in ~12 s
        pts.forEach(p => {
          const dir = p.ring === 0 ? 1 : -1; // outer CW, inner CCW
          const a = p.angle0 + dir * dt * rotSpd;
          const bx = p.ringCx + p.ringR * Math.cos(a);
          const by = p.ringCy + p.ringR * Math.sin(a);
          p.tx = bx; p.ty = by; // scatter will start from final position
          badge(bx, by, 0, p, 1);
        });
        drawPulse(now);
        if (dt > DUR.hold) {
          const zone = W < 941 ? W : W * 0.47;
          pts.forEach(p => {
            p.ox = p.tx; p.oy = p.ty;
            p.tx = Math.random() * zone; p.ty = Math.random() * H;
            p.rotV = (Math.random() - .5) * .07;
          });
          phase = "scatter"; phaseT = now;
        }

      } else if (phase === "scatter") {
        const e = ease3(dt / DUR.scatter);
        pts.forEach(p => {
          p.rot += p.rotV;
          badge(p.ox + (p.tx - p.ox) * e, p.oy + (p.ty - p.oy) * e, p.rot, p, 1 - e * .38);
        });
        if (dt >= DUR.scatter) {
          pts.forEach(p => {
            p.x = p.tx; p.y = p.ty;
            p.vx = (Math.random() - .5) * .55; p.vy = (Math.random() - .5) * .55;
            p.rot = Math.random() * Math.PI * 2;
          });
          phase = "float"; phaseT = now;
        }
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    if (!reduce) { phaseT = performance.now(); raf = requestAnimationFrame(tick); }
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
  { to: 1500, suffix: "+", label: "студентов\nотправлено" },
  { to: 500,  suffix: "+", label: "партнёрских\nвузов" },
  { to: 7,    suffix: "",  label: "стран\nнаправлений" },
  { to: 5,    suffix: " лет", label: "на рынке\nобразования" },
];

function TeamPhoto() {
  const [err, setErr] = useState(false);
  if (err) {
    return <div className="ph ph--dark hero__team-img" data-label="фото команды Elite Academy"></div>;
  }
  return (
    <img
      src="images/team.jpg"
      alt="Команда Elite Academy"
      className="hero__team-img"
      onError={() => setErr(true)}
    />
  );
}

function Hero() {
  return (
    <section className="hero grain" id="top">
      <div className="hero__mesh" aria-hidden="true"></div>
      <UniParticles />
      <div className="wrap hero__grid">
        <div className="hero__left">
          <div className="hero__badge" data-reveal>
            <span className="hero__badge-dot"></span>
            Аккредитовано ICEF · 1500+ студентов за рубежом
          </div>

          <h1 className="hero__h1" data-reveal data-delay="1">
            Твой путь к <span className="grad-gold">образованию за рубежом</span> начинается здесь
          </h1>

          <p className="hero__sub" data-reveal data-delay="2">
            Отправляем студентов из Кыргызстана в университеты США, Европы и Азии —
            с частичным или полным грантом. С гарантией по договору.
          </p>

          <div className="hero__cta" data-reveal data-delay="3">
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

        <div className="hero__right">
          <div className="hero__photo-frame" data-reveal data-delay="2">
            <TeamPhoto />
          </div>
          <div className="success-card glass success-card--horiz" data-reveal data-delay="4">
            <div className="success-card__tag">★ Успех недели</div>
            <div className="success-card__horiz-row">
              <div className="ph ph--dark success-card__avatar" data-label="фото"></div>
              <div className="success-card__horiz-info">
                <div className="success-card__name">Нурзар поступила в <b>США</b></div>
                <div className="success-card__uni">Roosevelt University, Чикаго</div>
                <a href="stories.html" className="success-card__link">Читать историю →</a>
              </div>
              <div className="success-card__horiz-money">
                <div className="success-card__money-label">Стипендий и грантов</div>
                <div className="success-card__money-val">$120 000</div>
              </div>
            </div>
            <div className="success-card__foot">
              <div className="ava-stack">
                {[0,1,2,3].map((i) => <span key={i} className="ava" style={{ zIndex: 4 - i }}></span>)}
              </div>
              <span><b>+18 студентов</b> поступили в этом месяце</span>
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
