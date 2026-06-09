/* ============================================================
   QUIZ — «Оценка шансов» multi-step + lead capture
   ============================================================ */
const { useState, useEffect } = React;

const QUIZ_STEPS = [
  { q: "Куда хочешь поехать?", key: "country",
    opts: [["🇺🇸","США"],["🇮🇹","Италия"],["🇬🇧","Великобритания"],["🇩🇪","Германия"],["🌍","Другая страна"]] },
  { q: "Какую программу ищешь?", key: "program",
    opts: [["🎓","Бакалавриат"],["📘","Магистратура"],["💼","МВА"],["🗣","Языковые курсы"],["🏫","Школа"]] },
  { q: "Твой текущий уровень английского?", key: "english",
    opts: [["🌱","Начинающий"],["📗","A2 – B1"],["📈","B2"],["⭐","C1 – C2 / Носитель"]] },
  { q: "Твой бюджет в год (USD)?", key: "budget",
    opts: [["💵","До $5 000"],["💸","$5k – $15k"],["💰","$15k – $30k"],["🎁","Ищу гранты"]] },
  { q: "Когда планируешь ехать?", key: "when",
    opts: [["☀️","Этим летом"],["🍂","Осень 2026"],["📅","2027"],["🔍","Просто изучаю"]] },
];

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
          <span className="eyebrow eyebrow--gold">Бесплатный инструмент</span>
          <h2>Узнай, в какой университет ты можешь поступить — за 2 минуты</h2>
          <p>Более 500 студентов уже прошли оценку шансов</p>
        </div>

        <div className="quiz card" data-reveal data-delay="1">
          <div className="quiz__bar">
            <div className="quiz__bar-fill" style={{ width: progress + "%" }}></div>
          </div>

          {resumed && (
            <div className="quiz__resume">
              <span className="quiz__resume-ic" aria-hidden="true">↻</span>
              <div className="quiz__resume-txt">
                <b>С возвращением!</b> Продолжаем с шага {step + 1} — прогресс сохранили.
              </div>
              <button className="quiz__resume-restart" onClick={restart}>Начать заново</button>
            </div>
          )}

          <div className="quiz__head">
            <span className="quiz__step-n">{isResult ? "Готово!" : `Шаг ${step + 1} из ${total}`}</span>
            {step > 0 && !isResult && <button className="quiz__back" onClick={back}>← Назад</button>}
          </div>

          <div className="quiz__stage">
            {!isResult ? (
              <div className={"quiz__panel " + (dir > 0 ? "slide-r" : "slide-l")} key={step}>
                <h3 className="quiz__q">{QUIZ_STEPS[step].q}</h3>
                <div className="quiz__opts">
                  {QUIZ_STEPS[step].opts.map(([ic, label]) => (
                    <button
                      key={label}
                      className={"quiz__opt" + (ans[QUIZ_STEPS[step].key] === label ? " is-sel" : "")}
                      onClick={() => pick(QUIZ_STEPS[step].key, label)}
                    >
                      <span className="quiz__opt-ic">{ic}</span>
                      <span className="quiz__opt-label">{label}</span>
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

function QuizResult({ ans, done, setDone, restart }) {
  const matches = [
    { name: "Bellevue College", loc: "🇺🇸 Сиэтл, США", fit: "97%" },
    { name: "Roosevelt University", loc: "🇺🇸 Чикаго, США", fit: "92%" },
    { name: "Drake University", loc: "🇺🇸 Де-Мойн, США", fit: "88%" },
  ];
  if (done) {
    return (
      <div className="quiz__panel slide-r quiz__success">
        <div className="quiz__success-ic">✓</div>
        <h3 className="quiz__q">Заявка принята!</h3>
        <p className="quiz__success-p">Мы отправили полный список из <b>23 вузов</b> и свяжемся с тобой в течение <b>1 часа</b>, чтобы обсудить план поступления.</p>
        <button className="btn btn--ghost" onClick={restart}>Пройти ещё раз</button>
      </div>
    );
  }
  return (
    <div className="quiz__panel slide-r">
      <div className="quiz__result-top">
        <div className="quiz__result-emoji">🎉</div>
        <div>
          <h3 className="quiz__q quiz__q--sm">Хорошие новости!</h3>
          <p className="quiz__result-lead">По твоему профилю подходят <b>23 университета</b>{ans.country ? " в направлении " + ans.country : ""}.</p>
        </div>
      </div>

      <div className="quiz__matches-label">Топ-3 варианта для тебя:</div>
      <div className="quiz__matches">
        {matches.map((m, i) => (
          <div className="quiz__match" key={i}>
            <div className="quiz__match-lock" aria-hidden="true">🔒</div>
            <div className="ph quiz__match-logo" data-label="лого"></div>
            <div className="quiz__match-info">
              <div className="quiz__match-name">{m.name}</div>
              <div className="quiz__match-loc">{m.loc}</div>
            </div>
            <span className="chip tag-green">Совпадение {m.fit}</span>
          </div>
        ))}
        <div className="quiz__matches-blur">+ ещё 20 университетов</div>
      </div>

      <div className="quiz__lead">
        <p className="quiz__lead-t">Введи имя и телефон, чтобы получить <b>полный список</b> и бесплатную консультацию:</p>
        <form className="quiz__form" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
          <input required placeholder="Твоё имя" />
          <input required placeholder="Телефон / WhatsApp" inputMode="tel" />
          <button type="submit" className="btn btn--gold btn--block">Получить результаты бесплатно →</button>
        </form>
        <div className="quiz__micro">✓ Без спама &nbsp; ✓ Ответим в течение 1 часа</div>
      </div>
    </div>
  );
}

window.Quiz = Quiz;
