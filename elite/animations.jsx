/* ============================================================
   ANIMATED BACKGROUND COMPONENTS
   - <AliveBackground variant="..." /> — floating geometric shapes
   - <SectionWave /> — animated wave divider
   ============================================================ */

/* SVG shape library — pure outlines, all use currentColor via stroke */
const SHAPES = {
  circle: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="44" />
    </svg>
  ),
  triangle: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,8 92,84 8,84" />
    </svg>
  ),
  square: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M 12 12 L 88 12 L 88 88 L 12 88 Z" />
    </svg>
  ),
  hex: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" />
    </svg>
  ),
  ring: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="44" />
      <circle cx="50" cy="50" r="28" />
    </svg>
  ),
  cross: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M 50 10 L 50 90 M 10 50 L 90 50" strokeLinecap="round" />
    </svg>
  ),
  wave: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M 5 50 Q 25 20, 50 50 T 95 50" />
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,8 92,50 50,92 8,50" />
    </svg>
  ),
};

/* Variants pick different combinations + positions */
const VARIANTS = {
  default: ["ring", "triangle", "hex", "square", "circle"],
  geometric: ["hex", "diamond", "triangle", "cross", "ring"],
  organic: ["wave", "circle", "ring", "wave", "circle"],
  minimal: ["circle", "ring", "cross"],
};

function AliveBackground({ variant = "default" }) {
  const shapes = VARIANTS[variant] || VARIANTS.default;
  return (
    <div className="alive" aria-hidden="true">
      {shapes.map((name, i) => (
        <div className={`alive__shape alive__shape--${i + 1}`} key={i}>
          {SHAPES[name]}
        </div>
      ))}
    </div>
  );
}

/* Section divider wave — between light sections */
function SectionWave({ flip = false, color = "var(--white)" }) {
  return (
    <div className={"section-wave " + (flip ? "section-wave--top" : "")} aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path
          d={
            "M 0 40 C 240 10, 480 70, 720 40 S 1200 10, 1440 40 L 1440 80 L 0 80 Z " +
            "M 1440 40 C 1680 10, 1920 70, 2160 40 S 2640 10, 2880 40 L 2880 80 L 1440 80 Z"
          }
          fill={color}
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

/* Horizontal scroll rail with prev/next arrows and optional seamless infinite loop.
   - Pass a SINGLE set of children; with loop=true the rail clones them `copies`
     times and keeps the viewport recentered in the middle copy, so scrolling
     never hits an edge and there is no visible jump (copies are pixel-identical).
   - trackClass reuses an existing flex grid (e.g. "countries__grid"). */
function ScrollRail({ children, trackClass = "", loop = false, step = 320, copies = 3 }) {
  const ref = React.useRef(null);
  const base = React.Children.toArray(children);
  const perCopy = base.length;
  const items = loop
    ? Array.from({ length: copies }).flatMap((_, k) =>
        base.map((ch, j) => React.cloneElement(ch, { key: k + "-" + j })))
    : base;

  React.useEffect(() => {
    if (!loop) return;
    const el = ref.current;
    if (!el) return;

    const period = () => {
      const kids = el.children;
      return kids.length > perCopy ? kids[perCopy].offsetLeft - kids[0].offsetLeft : 0;
    };
    const recenter = () => {
      const p = period();
      if (!p) return;
      if (el.scrollLeft < p) el.scrollLeft += p;
      else if (el.scrollLeft >= 2 * p) el.scrollLeft -= p;
    };

    // start in the middle copy once layout is ready
    const startId = requestAnimationFrame(() => { const p = period(); if (p) el.scrollLeft = p; });

    // recenter only after scrolling settles (so smooth/momentum isn't interrupted)
    let settle = 0;
    const onScroll = () => { clearTimeout(settle); settle = setTimeout(recenter, 130); };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recenter);
    el._railPeriod = period; // expose for arrow pre-centering
    return () => {
      cancelAnimationFrame(startId);
      clearTimeout(settle);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recenter);
    };
  }, [loop, perCopy, copies]);

  function scroll(dir) {
    const el = ref.current;
    if (!el) return;
    // for a looped rail, jump one copy inward BEFORE animating if the step would
    // cross an edge — keeps the smooth animation inside the safe middle band.
    if (loop && el._railPeriod) {
      const p = el._railPeriod();
      if (p) {
        if (dir > 0 && el.scrollLeft + step >= 2 * p) el.scrollLeft -= p;
        else if (dir < 0 && el.scrollLeft - step < p) el.scrollLeft += p;
      }
    }
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className="srail">
      <button type="button" className="srail__arrow srail__arrow--prev" onClick={() => scroll(-1)} aria-label={window.__EA_LANG === "en" ? "Back" : window.__EA_LANG === "kg" ? "Артка" : "Назад"}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div className={"srail__track " + trackClass} ref={ref}>
        {items}
      </div>
      <button type="button" className="srail__arrow srail__arrow--next" onClick={() => scroll(1)} aria-label={window.__EA_LANG === "en" ? "Next" : window.__EA_LANG === "kg" ? "Алдыга" : "Вперёд"}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  );
}

window.AliveBackground = AliveBackground;
window.SectionWave = SectionWave;
window.ScrollRail = ScrollRail;
