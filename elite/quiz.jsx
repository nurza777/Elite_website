/* ============================================================
   QUIZ — «Оценка шансов» multi-step + lead capture
   ============================================================ */
const { useState, useEffect } = React;
const QUIZ_LEADS_URL = "https://script.google.com/macros/s/AKfycbw4i67Vtu9cMUjZvXxVCZ0ZdeDndAG2GqY0eS7PznuBGxZeG4PkwHbe8xN-RAoa35BW/exec";

const QUIZ_STEPS = [
  { qKey: "quiz.q.1", key: "country",
    opts: [
      { val: "США",           lk: "country.США" },
      { val: "Италия",        lk: "country.Италия" },
      { val: "Польша",        lk: "country.Польша" },
      { val: "Малайзия",      lk: "country.Малайзия" },
      { val: "Германия",      lk: "country.Германия" },
      { val: "Другая страна", lk: "quiz.opt.other" },
    ]},
  { qKey: "quiz.q.2", key: "program",
    opts: [
      { val: "Бакалавриат",    lk: "quiz.opt.bachelor" },
      { val: "Магистратура",   lk: "quiz.opt.master" },
      { val: "МВА",            lk: "quiz.opt.mba" },
      { val: "Языковые курсы", lk: "quiz.opt.language" },
      { val: "Школа",          lk: "quiz.opt.school" },
    ]},
  { qKey: "quiz.q.3", key: "english",
    opts: [
      { val: "Начинающий",         lk: "quiz.opt.beginner" },
      { val: "A2 – B1",            lk: "quiz.opt.a2b1" },
      { val: "B2",                 lk: "quiz.opt.b2" },
      { val: "C1 – C2 / Носитель", lk: "quiz.opt.c1c2" },
    ]},
  { qKey: "quiz.q.4", key: "budget",
    opts: [
      { val: "До $5 000",   lk: "quiz.opt.budget1" },
      { val: "$5k – $15k",  lk: "quiz.opt.budget2" },
      { val: "$15k – $30k", lk: "quiz.opt.budget3" },
      { val: "Ищу гранты",  lk: "quiz.opt.grants" },
    ]},
  { qKey: "quiz.q.5", key: "when",
    opts: [
      { val: "Этим летом",    lk: "quiz.opt.summer" },
      { val: "Осень 2026",    lk: "quiz.opt.fall2026" },
      { val: "2027",          lk: "quiz.opt.2027" },
      { val: "Просто изучаю", lk: "quiz.opt.exploring" },
    ]},
];

/* ---------- Matching pool (used by QuizResult) ---------- */
const QUIZ_POOL = [
  { name:"Bellevue College",            loc:"Сиэтл, США",               country:"США",           levels:["Бакалавр","Колледж"],       price:11000, merit:true },
  { name:"Roosevelt University",        loc:"Чикаго, США",              country:"США",           levels:["Бакалавр","Магистр"],       price:18700, merit:true, need:true },
  { name:"La Salle University",         loc:"Филадельфия, США",         country:"США",           levels:["Бакалавр","Магистр"],       price:21000, merit:true, need:true },
  { name:"DePaul University",           loc:"Чикаго, США",              country:"США",           levels:["Бакалавр","Магистр"],       price:23000, merit:true },
  { name:"Webster University",          loc:"Сент-Луис, США",           country:"США",           levels:["Бакалавр","Магистр"],       price:18500, merit:true },
  { name:"Radford University",          loc:"Рэдфорд, США",             country:"США",           levels:["Бакалавр","Магистр"],       price:14000, merit:true },
  { name:"Concord University",          loc:"Атенс, США",               country:"США",           levels:["Бакалавр"],                 price:10000 },
  { name:"University of Bologna",       loc:"Болонья, Италия",          country:"Италия",        levels:["Бакалавр","Магистр"],       price:2750,  merit:true, need:true },
  { name:"Sapienza Università di Roma", loc:"Рим, Италия",              country:"Италия",        levels:["Бакалавр","Магистр"],       price:2200,  merit:true, need:true },
  { name:"Politecnico di Milano",       loc:"Милан, Италия",            country:"Италия",        levels:["Бакалавр","Магистр"],       price:4290,  merit:true },
  { name:"University of Padua",         loc:"Падуя, Италия",            country:"Италия",        levels:["Бакалавр","Магистр"],       price:2640,  merit:true, need:true },
  { name:"Roma Tre University",         loc:"Рим, Италия",              country:"Италия",        levels:["Бакалавр","Магистр"],       price:1980,  need:true },
  { name:"Gisma Business School",       loc:"Берлин, Германия",         country:"Германия",      levels:["Бакалавр","Магистр","МВА"], price:8800,  merit:true },
  { name:"University of Vienna",        loc:"Вена, Австрия",            country:"Австрия",       levels:["Бакалавр","Магистр","PhD"], price:880 },
  { name:"TU Wien",                     loc:"Вена, Австрия",            country:"Австрия",       levels:["Бакалавр","Магистр","PhD"], price:880 },
  { name:"Eastern Mediterranean Univ.", loc:"Фамагуста, Северный Кипр", country:"Северный Кипр", levels:["Бакалавр","Магистр","PhD"], price:4500,  merit:true },
  { name:"Cyprus International Univ.",  loc:"Никосия, Северный Кипр",   country:"Северный Кипр", levels:["Бакалавр","Магистр"],       price:3200,  merit:true },
  { name:"Monash University Malaysia",  loc:"Куала-Лумпур, Малайзия",   country:"Малайзия",      levels:["Бакалавр","Магистр","PhD"], price:9900,  merit:true },
  { name:"Taylor's University",         loc:"Субанг-Джая, Малайзия",    country:"Малайзия",      levels:["Бакалавр","Магистр"],       price:7200,  merit:true },
  { name:"Heriot-Watt Malaysia",        loc:"Путраджая, Малайзия",      country:"Малайзия",      levels:["Бакалавр","Магистр"],       price:8000,  merit:true },
  { name:"Vistula University",          loc:"Варшава, Польша",          country:"Польша",        levels:["Бакалавр","Магистр"],       price:3300 },
  { name:"PJATK",                       loc:"Варшава, Польша",          country:"Польша",        levels:["Бакалавр","Магистр"],       price:3000 },
];

const _CTRY = { "США":"США","Италия":"Италия","Германия":"Германия" };
const _LVL  = { "Бакалавриат":"Бакалавр","Магистратура":"Магистр","МВА":"МВА" };
const _BUDG = { "До $5 000":[0,5000],"$5k – $15k":[5000,15000],"$15k – $30k":[15000,30000] };
const _CNT  = { "США":35,"Италия":33,"Германия":2,"Австрия":9,"Малайзия":22,"Польша":4,"Северный Кипр":3 };

function _scoreUni(u, ans) {
  let s = 50;
  const wc = _CTRY[ans.country];
  if (wc) {
    if (u.country === wc) s += 30;
    else return 0;
  } else if (ans.country === "Другая страна") {
    if (u.price <= 5000) s += 10;
  }
  const wl = _LVL[ans.program];
  if (wl && u.levels.includes(wl)) s += 15;
  const br = _BUDG[ans.budget];
  if (br) {
    if (u.price >= br[0] && u.price <= br[1]) s += 12;
    else if (u.price < br[0]) s += 6;
  }
  if (ans.budget === "Ищу гранты" && (u.merit || u.need)) s += 12;
  return Math.min(97, s);
}

function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function _matchQuiz(ans) {
  const scored = _shuffle(QUIZ_POOL)
    .map(u => ({ ...u, fit: _scoreUni(u, ans) }))
    .filter(u => u.fit > 0)
    .sort((a, b) => b.fit - a.fit);
  return scored.length >= 3 ? scored.slice(0, 3) : _shuffle(QUIZ_POOL).slice(0, 3).map(u => ({ ...u, fit: 72 }));
}

function Quiz() {
  const [step, setStep] = useState(0);          // 0..5(result)
  const [ans, setAns] = useState({});
  const [dir, setDir] = useState(1);
  const [done, setDone] = useState(false);
  const [resumed, setResumed] = useState(false);
  const dirty = React.useRef(false);
  const total = QUIZ_STEPS.length;
  const isResult = step === total;
  const progress = isResult ? 100 : Math.round((step / total) * 100);

  // Restore once on mount
  useEffect(() => {
    const s = window.eaQuizGet && window.eaQuizGet();
    if (s && typeof s.step === "number") {
      setStep(s.step);
      setAns(s.ans || {});
      setDone(!!s.done);
      if (s.step > 0 && !s.done) setResumed(true);
    }
  }, []);

  // Persist on change — skip first run so we don't clobber restored state
  useEffect(() => {
    if (!dirty.current) { dirty.current = true; return; }
    if (window.eaQuizSet) window.eaQuizSet({ step, ans, done });
  }, [step, ans, done]);

  const pick = (key, val) => {
    setAns((a) => ({ ...a, [key]: val }));
    setDir(1);
    setResumed(false);
    setTimeout(() => setStep((s) => s + 1), 180);
  };
  const back = () => { setDir(-1); setStep((s) => Math.max(0, s - 1)); };
  const restart = () => { setAns({}); setStep(0); setDone(false); setResumed(false); };

  return (
    <section className="section quiz-sec" id="quiz">
      <div className="wrap">
        <div className="section-head section-head--center" data-reveal>
          <span className="eyebrow eyebrow--gold">{t("quiz.eyebrow")}</span>
          <h2>{t("quiz.h2")}</h2>
          <p>{t("quiz.sub")}</p>
        </div>

        <div className="quiz card" data-reveal data-delay="1">
          <div className="quiz__bar">
            <div className="quiz__bar-fill" style={{ width: progress + "%" }}></div>
          </div>

          {resumed && (
            <div className="quiz__resume">
              <span className="quiz__resume-ic" aria-hidden="true">↻</span>
              <div className="quiz__resume-txt">
                <b>{t("quiz.resume.title")}</b> {t("quiz.resume.text").replace("{n}", step + 1)}
              </div>
              <button className="quiz__resume-restart" onClick={restart}>{t("quiz.restart")}</button>
            </div>
          )}

          <div className="quiz__head">
            <span className="quiz__step-n">
              {isResult ? t("quiz.done") : t("quiz.step").replace("{n}", step + 1).replace("{t}", total)}
            </span>
            {step > 0 && !isResult && <button className="quiz__back" onClick={back}>{t("quiz.back")}</button>}
          </div>

          <div className="quiz__stage">
            {!isResult ? (
              <div className={"quiz__panel " + (dir > 0 ? "slide-r" : "slide-l")} key={step}>
                <h3 className="quiz__q">{t(QUIZ_STEPS[step].qKey)}</h3>
                <div className="quiz__opts">
                  {QUIZ_STEPS[step].opts.map((opt) => (
                    <button
                      key={opt.val}
                      className={"quiz__opt" + (ans[QUIZ_STEPS[step].key] === opt.val ? " is-sel" : "")}
                      onClick={() => pick(QUIZ_STEPS[step].key, opt.val)}
                    >
                      <span className="quiz__opt-label">{t(opt.lk) || opt.val}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <QuizResult ans={ans} done={done} setDone={setDone} restart={restart} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuizLeadForm({ ans, setDone }) {
  const [qName, setQName] = useState("");
  const [qPhone, setQPhone] = useState("");
  const [qAge, setQAge] = useState("");
  const [qCity, setQCity] = useState("");
  return (
    <form className="quiz__form" onSubmit={(e) => {
      e.preventDefault();
      fetch(QUIZ_LEADS_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          name: qName,
          phone: qPhone.replace(/^\+/, '').replace('(', '-').replace(')', ''),
          age: qAge,
          city: qCity,
          dest: "Квиз — " + (ans.country || "не указано"),
          page: location.pathname.split("/").pop() || "index.html",
          time: new Date().toLocaleString("ru"),
          ...(window.getUTM ? window.getUTM() : {}),
        }),
      }).catch(() => {});
      setDone(true);
    }}>
      <input required placeholder={t("quiz.name")} value={qName} onChange={e => setQName(e.target.value)} />
      <input required placeholder="+996(___)-___-___" inputMode="tel" value={qPhone} onChange={e => {
        let d = e.target.value.replace(/\D/g,'');
        if (d.startsWith('996')) d = d.slice(3);
        d = d.slice(0,9);
        if (!d) { setQPhone(''); return; }
        let f = '+996(';
        if (d.length <= 3) f += d;
        else if (d.length <= 6) f += d.slice(0,3) + ')-' + d.slice(3);
        else f += d.slice(0,3) + ')-' + d.slice(3,6) + '-' + d.slice(6);
        setQPhone(f);
      }} />
      <input type="number" min="14" max="60" required placeholder={t("quiz.age")} value={qAge} onChange={e => setQAge(e.target.value)} />
      <input required placeholder={t("quiz.city")} value={qCity} onChange={e => setQCity(e.target.value)} />
      <button type="submit" className="btn btn--gold btn--block">{t("quiz.submit")}</button>
    </form>
  );
}

function QuizResult({ ans, done, setDone, restart }) {
  const matches = _matchQuiz(ans);
  const totalCount = _CNT[_CTRY[ans.country]] || 23;
  if (done) {
    return (
      <div className="quiz__panel slide-r quiz__success">
        <div className="quiz__success-ic">✓</div>
        <h3 className="quiz__q">{t("quiz.success.title")}</h3>
        <p className="quiz__success-p">{t("quiz.success.text")}</p>
        <button className="btn btn--ghost" onClick={restart}>{t("quiz.success.restart")}</button>
      </div>
    );
  }
  return (
    <div className="quiz__panel slide-r">
      <div className="quiz__result-top">
        <div className="quiz__result-emoji">🎉</div>
        <div>
          <h3 className="quiz__q quiz__q--sm">{t("quiz.result.good")}</h3>
          <p className="quiz__result-lead">
            {t("quiz.result.lead").replace("{n}", totalCount)}
            {ans.country && _CTRY[ans.country] ? " " + t("quiz.result.direction") + " " + (t("country." + ans.country) || ans.country) : ""}
          </p>
        </div>
      </div>

      <div className="quiz__matches-label">{t("quiz.matches.label")}</div>
      <div className="quiz__matches">
        {matches.map((m, i) => (
          <div className="quiz__match" key={i}>
            <div className="quiz__match-lock" aria-hidden="true">🔒</div>
            <div className="ph quiz__match-logo" data-label={window.__EA_LANG === "en" ? "logo" : window.__EA_LANG === "kg" ? "логотип" : "лого"}></div>
            <div className="quiz__match-info">
              <div className="quiz__match-name">{m.name}</div>
              <div className="quiz__match-loc">{m.loc}</div>
            </div>
            <span className="chip tag-green">{t("quiz.matches.match")} {m.fit}%</span>
          </div>
        ))}
        <div className="quiz__matches-blur">{t("quiz.matches.more")}</div>
      </div>

      <div className="quiz__lead">
        <p className="quiz__lead-t">{t("quiz.lead.text")}</p>
        <QuizLeadForm ans={ans} setDone={setDone} />
        <div className="quiz__micro">{t("quiz.nospam")} &nbsp; {t("quiz.reply")}</div>
      </div>
    </div>
  );
}

window.Quiz = Quiz;
