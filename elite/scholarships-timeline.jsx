/* ============================================================
   SCHOLARSHIPS (cases + filter + countdown) · HOW WE WORK (timeline)
   Trilingual via _kp(ru, en, kg) selected by window.__EA_LANG.
   ============================================================ */
const { useState, useEffect, useRef } = React;

const _KL = (window.__EA_LANG || "ru");
const _kp = (ru, en, kg) => _KL === "en" ? en : _KL === "kg" ? kg : ru;
const _kTag = (t) => t === "академическая" ? _kp("Академическая", "Academic", "Академиялык")
  : t === "спортивная" ? _kp("Спортивная", "Sports", "Спорттук") : "need-based";

const CASES = [
  { sum: "$858 000", name: "Милана",   quote: _kp("11 университетов — все приняли", "11 universities — all accepted", "11 университет — баары кабыл алды"), uni: "Bellevue College", tag: "академическая" },
  { sum: "$312 000", name: "Анара",    quote: _kp("135 баллов по Duolingo", "135 on Duolingo", "Duolingoдон 135 упай"), uni: "Rowan University", tag: "академическая" },
  { sum: "$88 000",  name: "Нуржамал", quote: _kp("Программист, выпускница БГУ", "Programmer, BSU graduate", "Программист, БГУнун бүтүрүүчүсү"), uni: "Saint Leo University", tag: "академическая" },
  { sum: "$204 000", name: "Тимур",    quote: _kp("Спортивный грант по футболу", "Football sports grant", "Футбол боюнча спорттук грант"), uni: "Drake University", tag: "спортивная" },
  { sum: "$156 000", name: "Айпери",   quote: _kp("Из региона — онлайн-подготовка", "From a region — online prep", "Аймактан — онлайн даярдык"), uni: "Kalamazoo College", tag: "академическая" },
  { sum: "$72 000",  name: "Эрлан",    quote: _kp("Перевёлся из колледжа", "Transferred from college", "Колледжден которулган"), uni: "Roosevelt University", tag: "спортивная" },
  { sum: "€0 / год",  name: "Диана",   quote: _kp("Медицина в Италии — DSU закрыл расходы полностью", "Medicine in Italy — DSU covered all costs", "Италияда медицина — DSU чыгымдарды толук жапты"), uni: "Università di Bologna", tag: "need-based" },
  { sum: "€726 / год", name: "Асель",  quote: _kp("Право в Австрии — почти бесплатно для иностранцев", "Law in Austria — almost free for foreigners", "Австрияда укук — чет элдиктер үчүн дээрлик акысыз"), uni: "Universität Wien", tag: "need-based" },
];

function useCountdown(target) {
  const [t, setT] = useState({});
  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, target - Date.now());
      setT({
        d: Math.floor(d / 86400000),
        h: Math.floor((d / 3600000) % 24),
        m: Math.floor((d / 60000) % 60),
        s: Math.floor((d / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

function FlipDigit({ value }) {
  return (
    <span className="countdown__flip">
      <span key={value} className="countdown__flip-in">{value}</span>
    </span>
  );
}

const FALL_DEADLINE = new Date("2026-08-31T23:59:00").getTime();
const _CD_LABELS = [["d", _kp("дней", "days", "күн")], ["h", _kp("часов", "hours", "саат")], ["m", _kp("минут", "minutes", "мүнөт")], ["s", _kp("секунд", "seconds", "секунд")]];

function DeadlineBanner() {
  const t = useCountdown(FALL_DEADLINE);
  return (
    <div className="deadline-banner" data-reveal>
      <div className="wrap">
        <div className="scholar__deadline glass">
          <div className="scholar__deadline-txt">
            <div className="scholar__deadline-ic">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div className="scholar__deadline-h">{_kp("Дедлайн подачи на осенний семестр", "Fall semester application deadline", "Күзгү семестрге тапшыруу дедлайны")}</div>
              <div className="scholar__deadline-sub">{_kp("Набор закрывается — успей пройти оценку и забронировать место", "Enrolment is closing — take the assessment and reserve your spot in time", "Кабыл алуу жабылып жатат — баалоодон өтүп, оруңду брондоп үлгүр")}</div>
            </div>
          </div>
          <div className="countdown">
            {_CD_LABELS.map(([k, lab]) => {
              const padded = String(t[k] ?? 0).padStart(2, "0");
              return (
                <div className="countdown__unit" key={k}>
                  <span className="countdown__num">
                    {padded.split("").map((d, i) => <FlipDigit key={i} value={d} />)}
                  </span>
                  <span className="countdown__lab">{lab}</span>
                </div>
              );
            })}
          </div>
          <a href="#cta" className="btn btn--gold">{_kp("Успеть подать", "Apply in time", "Үлгүрүп тапшыруу")}</a>
        </div>
      </div>
    </div>
  );
}

function Scholarships() {
  const [filter, setFilter] = useState("Все");
  const filters = ["Все", "академическая", "спортивная", "need-based"];
  const list = CASES.filter((c) => filter === "Все" || c.tag === filter);
  const t = useCountdown(FALL_DEADLINE);

  return (
    <section className="section scholar" id="scholarships">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow eyebrow--gold">{_kp("Стипендии и гранты", "Scholarships & grants", "Стипендиялар жана гранттар")}</span>
          <h2>{_kp("Учёба за границей может стоить дешевле,", "Studying abroad can cost less", "Чет өлкөдө окуу арзаныраак болушу мүмкүн,")}<br/>{_kp("чем в Бишкеке", "than in Bishkek", "Бишкектегиден")}</h2>
          <p>{_kp("Реальные суммы скидок и стипендий наших студентов:", "Real discount and scholarship amounts of our students:", "Биздин студенттердин чыныгы арзандатуу жана стипендия суммалары:")}</p>
        </div>

        <div className="scholar__filters" data-reveal>
          {filters.map((f) => (
            <button key={f} className={"scholar__filter" + (filter === f ? " is-on" : "")} onClick={() => setFilter(f)}>
              {f === "Все" ? _kp("Все кейсы", "All cases", "Бардык кейстер") : f === "академическая" ? _kp("Академические", "Academic", "Академиялык") : f === "спортивная" ? _kp("Спортивные", "Sports", "Спорттук") : "Need-based"}
            </button>
          ))}
        </div>

        <div className="scholar__grid stagger" key={filter}>
          {list.map((c, i) => (
            <article className="case card card--lift" key={c.name}>
              <div className="case__sum">{c.sum}</div>
              <div className="case__sum-label">{_kp("скидок и стипендий", "in discounts & scholarships", "арзандатуу жана стипендия")}</div>
              <div className="case__name">{c.name}</div>
              <p className="case__quote">«{c.quote}»</p>
              <div className="case__uni">{c.uni}</div>
              <span className={"chip " + (c.tag === "спортивная" ? "tag-blue" : c.tag === "need-based" ? "tag-green" : "tag-gold")} style={{ marginTop: 14 }}>{_kTag(c.tag)}</span>
            </article>
          ))}
        </div>

        <div className="scholar__deadline glass" data-reveal>
          <div className="scholar__deadline-txt">
            <span className="scholar__deadline-ic">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <div>
              <div className="scholar__deadline-h">{_kp("Дедлайн подачи на осенний семестр", "Fall semester application deadline", "Күзгү семестрге тапшыруу дедлайны")}</div>
              <div className="scholar__deadline-sub">{_kp("Набор закрывается — успей пройти оценку и забронировать место", "Enrolment is closing — take the assessment and reserve your spot in time", "Кабыл алуу жабылып жатат — баалоодон өтүп, оруңду брондоп үлгүр")}</div>
            </div>
          </div>
          <div className="countdown">
            {_CD_LABELS.map(([k, lab]) => {
              const padded = String(t[k] ?? 0).padStart(2, "0");
              return (
                <div className="countdown__unit" key={k}>
                  <span className="countdown__num">
                    {padded.split("").map((d, i) => <FlipDigit key={i} value={d} />)}
                  </span>
                  <span className="countdown__lab">{lab}</span>
                </div>
              );
            })}
          </div>
          <a href="#cta" className="btn btn--gold">{_kp("Забронировать место", "Reserve a spot", "Орун брондоо")}</a>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", t: _kp("Бесплатная консультация (30 мин)", "Free consultation (30 min)", "Акысыз консультация (30 мүн)"), d: _kp("Разбираем твой профиль, цели и бюджет. Честно говорим о шансах.", "We review your profile, goals and budget. We’re honest about your chances.", "Профилиңди, максаттарыңды жана бюджетиңди талдайбыз. Мүмкүнчүлүктөр жөнүндө чынын айтабыз.") },
  { n: "02", t: _kp("Подбор вузов под тебя", "Universities matched to you", "Сага ылайык вуздарды тандоо"), d: _kp("Не список из интернета, а персональный анализ 50+ университетов.", "Not a list from the internet, but a personal analysis of 50+ universities.", "Интернеттен алынган тизме эмес, 50+ университеттин жеке анализи.") },
  { n: "03", t: _kp("Подготовка к Duolingo / TOEFL", "Duolingo / TOEFL preparation", "Duolingo / TOEFLге даярдоо"), d: _kp("Наши преподаватели довели 100+ студентов до 100–140 баллов.", "Our teachers have brought 100+ students to 100–140 points.", "Биздин мугалимдер 100+ студентти 100–140 упайга жеткиришти.") },
  { n: "04", t: _kp("Документы, эссе, заявки", "Documents, essays, applications", "Документтер, эссе, арыздар"), d: _kp("Проверка основателем лично. Подаём в неограниченное кол-во вузов.", "Checked by the founder personally. We apply to an unlimited number of universities.", "Негиздөөчү өзү текшерет. Чектелбеген санда вузга тапшырабыз.") },
  { n: "05", t: _kp("Виза F-1 / Student Visa", "F-1 / Student Visa", "F-1 / Студенттик виза"), d: _kp("Заполнение DS-160 + урок по интервью от основателя. Гарантия или возврат.", "DS-160 filing + an interview lesson from the founder. Guarantee or refund.", "DS-160 толтуруу + негиздөөчүдөн интервью сабагы. Кепилдик же кайтаруу.") },
  { n: "06", t: _kp("Жизнь за границей: старт", "Life abroad: getting started", "Чет өлкөдө жашоо: старт"), d: _kp("Авиабилеты, жильё, транспорт, водительские права — разберём всё.", "Flights, housing, transport, driver’s licence — we’ll sort everything out.", "Авиабилеттер, турак жай, транспорт, айдоочулук укугу — баарын чечебиз.") },
];

function HowWeWork() {
  return (
    <section className="section dark grain how" id="how">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow eyebrow--light">{_kp("Как мы работаем", "How we work", "Биз кантип иштейбиз")}</span>
          <h2>{_kp("Твой путь из Бишкека", "Your path from Bishkek", "Бишкектен")}<br/>{_kp("в зарубежный университет — 6 шагов", "to a university abroad — 6 steps", "чет өлкөлүк университетке жолуң — 6 кадам")}</h2>
          <p className="how__motto">{_kp("Мы рядом на каждом этапе — от первой консультации до первого дня в кампусе.", "We’re with you at every step — from the first consultation to your first day on campus.", "Ар бир этапта жаныңдабыз — биринчи консультациядан кампустагы биринчи күнгө чейин.")}</p>
        </div>

        <div className="timeline">
          <div className="timeline__line"></div>
          {STEPS.map((s, i) => (
            <div className="tstep" data-reveal data-delay={(i % 3) + 1} key={s.n}>
              <div className="tstep__node">{s.n}</div>
              <div className="tstep__card glass">
                <h3 className="tstep__t">{s.t}</h3>
                <p className="tstep__d">{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="how__cta" data-reveal>
          <a href="#cta" className="btn btn--gold btn--lg">{_kp("Начать шаг 1 — это бесплатно →", "Start step 1 — it’s free →", "1-кадамды баштоо — акысыз →")}</a>
        </div>
      </div>
    </section>
  );
}

window.DeadlineBanner = DeadlineBanner;
window.Scholarships = Scholarships;
window.HowWeWork = HowWeWork;
