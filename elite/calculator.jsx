/* ============================================================
   SAVINGS CALCULATOR — interactive slider with live numbers
   Trilingual via _cp(ru, en, kg) selected by window.__EA_LANG.
   ============================================================ */
const { useState, useEffect, useRef } = React;

const _CL = (window.__EA_LANG || "ru");
const _cp = (ru, en, kg) => _CL === "en" ? en : _CL === "kg" ? kg : ru;

function coveragePct(sticker) {
  if (sticker <= 8000) return 12;
  const pct = 14 + (sticker - 8000) / 900;
  return Math.min(75, Math.round(pct));
}

const FIT_UNIS = [
  { range: [0, 14000],  list: [_cp("Bellevue College (Сиэтл)", "Bellevue College (Seattle)", "Bellevue College (Сиэтл)"), "Politecnico di Milano"] },
  { range: [14000, 25000], list: ["Roosevelt University", "Drake University", "Kalamazoo College"] },
  { range: [25000, 40000], list: ["La Salle University", "Saint Leo University", _cp("UCL (Лондон)", "UCL (London)", "UCL (Лондон)")] },
  { range: [40000, 99999], list: ["MIT", "UCL", _cp("TUM (DAAD стипендия)", "TUM (DAAD scholarship)", "TUM (DAAD стипендиясы)")] },
];

function useSmoothNumber(target, duration = 380) {
  const [val, setVal] = useState(target);
  const raf = useRef(null);
  const fromRef = useRef(target);
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const from = fromRef.current;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(from + (target - from) * eased);
      setVal(v);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

const _yr = (y) => _cp(y === 2 ? "года" : "лет", "years", "жыл");

function SavingsCalculator() {
  const [sticker, setSticker] = useState(25000);
  const [years, setYears] = useState(4);
  const pct = coveragePct(sticker);
  const saved = Math.round(sticker * pct / 100);
  const real = sticker - saved;
  const totalSaved = saved * years;

  const animSaved = useSmoothNumber(saved);
  const animReal = useSmoothNumber(real);
  const animTotal = useSmoothNumber(totalSaved, 520);

  const fit = FIT_UNIS.find((f) => sticker >= f.range[0] && sticker < f.range[1])?.list || [];

  const fmt = (n) => "$" + n.toLocaleString("ru");
  const perYear = _cp("/год", "/year", "/жыл");

  return (
    <section className="section calc" id="calc">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{_cp("Калькулятор", "Calculator", "Калькулятор")}</span>
          <h2>{_cp("Сколько реально стоит", "How much does studying", "Чет өлкөдө Elite менен")}<br/>{_cp("учёба за рубежом с Elite?", "abroad with Elite really cost?", "окуу чындыгында канча турат?")}</h2>
          <p>{_cp("Цифры по данным 1500+ студентов, поступивших с нашей помощью.", "Figures based on 1500+ students admitted with our help.", "Биздин жардам менен тапшырган 1500+ студенттин маалыматы боюнча сандар.")}</p>
        </div>

        <div className="calc__layout">
          {/* ----- Controls ----- */}
          <div className="calc__controls card" data-reveal>
            <div className="calc__ctrl">
              <div className="calc__ctrl-top">
                <label className="calc__ctrl-label">{_cp("Стоимость университета", "University cost", "Университеттин баасы")}</label>
                <div className="calc__ctrl-val">{fmt(sticker)}<span>{perYear}</span></div>
              </div>
              <input
                type="range"
                min="8000"
                max="60000"
                step="1000"
                value={sticker}
                onChange={(e) => setSticker(+e.target.value)}
                className="calc__range"
                style={{ "--p": ((sticker - 8000) / 52000 * 100) + "%" }}
              />
              <div className="calc__ctrl-marks">
                <span>$8k</span><span>$25k</span><span>$45k</span><span>$60k</span>
              </div>
            </div>

            <div className="calc__ctrl">
              <div className="calc__ctrl-top">
                <label className="calc__ctrl-label">{_cp("Длительность программы", "Program duration", "Программанын узактыгы")}</label>
              </div>
              <div className="calc__years">
                {[2, 3, 4].map((y) => (
                  <button
                    key={y}
                    className={"calc__year" + (years === y ? " is-on" : "")}
                    onClick={() => setYears(y)}
                  >
                    {y} {_yr(y)}
                  </button>
                ))}
              </div>
            </div>

            <div className="calc__hint">
              <span className="calc__hint-ic" aria-hidden="true">💡</span>
              <p>{_cp("Подвинь ползунок — увидишь, как меняется экономия. Расчёт по среднему покрытию стипендией для этой ценовой категории.", "Move the slider to see how the savings change. Calculated from the average scholarship coverage for this price range.", "Сүрөткүчтү жылдыр — үнөмдөө кантип өзгөрөрүн көрөсүң. Бул баа категориясы үчүн орточо стипендия камтуусу боюнча эсептелет.")}</p>
            </div>
          </div>

          {/* ----- Result ----- */}
          <div className="calc__result card" data-reveal data-delay="1">
            <div className="calc__bar">
              <div className="calc__bar-block calc__bar-block--real" style={{ width: (100 - pct) + "%" }}>
                <span>{_cp("Твоя цена", "Your price", "Сенин баасың")}</span>
                <b>{fmt(animReal)}{perYear}</b>
              </div>
              <div className="calc__bar-block calc__bar-block--saved" style={{ width: pct + "%" }}>
                <span>{_cp("Стипендия Elite", "Elite scholarship", "Elite стипендиясы")}</span>
                <b>{fmt(animSaved)}{perYear}</b>
              </div>
            </div>

            <div className="calc__pct">
              <span className="calc__pct-num">{pct}%</span>
              <span className="calc__pct-lab">{_cp("средняя стипендия", "average scholarship", "орточо стипендия")}<br/>{_cp("для этого профиля", "for this profile", "бул профиль үчүн")}</span>
            </div>

            <div className="calc__total">
              <span className="calc__total-lab">{_cp("Сэкономишь за", "You’ll save over", "Окуунун")} {years} {_yr(years)} {_cp("обучения", "of study", "жылында үнөмдөйсүң")}</span>
              <div className="calc__total-num">{fmt(animTotal)}</div>
              <span className="calc__total-sub">{_cp("Это новая машина, первый взнос за квартиру в Бишкеке или 4 года жизни за границей.", "That’s a new car, a down payment on a flat in Bishkek, or 4 years of living abroad.", "Бул жаңы унаа, Бишкекте батирге баштапкы төгүм же чет өлкөдө 4 жыл жашоо.")}</span>
            </div>

            {fit.length > 0 && (
              <div className="calc__fit">
                <span className="calc__fit-lab">{_cp("В эту категорию попадают:", "This category includes:", "Бул категорияга кирет:")}</span>
                <div className="calc__fit-list">
                  {fit.map((u) => <span key={u} className="chip">{u}</span>)}
                </div>
              </div>
            )}

            <a href="#cta" className="btn btn--gold btn--block btn--lg calc__cta">
              {_cp("Узнать точную сумму для тебя →", "Find out your exact amount →", "Так суммаңды билүү →")}
            </a>
            <div className="calc__micro">{_cp("Бесплатный расчёт за 30 минут на консультации", "A free calculation in 30 minutes at a consultation", "Консультацияда 30 мүнөттө акысыз эсептөө")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.SavingsCalculator = SavingsCalculator;
