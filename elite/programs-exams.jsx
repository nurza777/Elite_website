/* ============================================================
   PROGRAMS (tabs) · EXAMS (cards, Duolingo accent)
   Trilingual via _pp(ru, en, kg) selected by window.__EA_LANG.
   PROGRAMS keys stay Russian (state/logic); display is translated.
   ============================================================ */
const { useState } = React;
const LEADS_URL = "https://script.google.com/macros/s/AKfycbw4i67Vtu9cMUjZvXxVCZ0ZdeDndAG2GqY0eS7PznuBGxZeG4PkwHbe8xN-RAoa35BW/exec";

const _PL = (window.__EA_LANG || "ru");
const _pp = (ru, en, kg) => _PL === "en" ? en : _PL === "kg" ? kg : ru;
const _pCountry = (c) => c === "Глобально" ? _pp("Глобально", "Global", "Глобалдуу") : (window.t ? window.t("country." + c) : c);
const _TAB_LABELS = {
  "Бакалавриат": _pp("Бакалавриат", "Bachelor’s", "Бакалавриат"),
  "Магистратура": _pp("Магистратура", "Master’s", "Магистратура"),
  "МВА": _pp("МВА", "MBA", "MBA"),
  "PhD": "PhD",
  "Языковые": _pp("Языковые", "Language", "Тил"),
  "Летние школы": _pp("Летние школы", "Summer schools", "Жайкы мектептер"),
  "Онлайн": _pp("Онлайн", "Online", "Онлайн"),
};

/* Each tab maps to a catalog level (universities.html filter) where possible. */
const PROGRAMS = {
  "Бакалавриат": { level: "Бакалавр", items: [
    { name: "Computer Science", flag: "US", country: "США", dur: _pp("4 года","4 years","4 жыл"), price: _pp("от $9 000/год","from $9,000/yr","$9 000/жыл"), schol: _pp("ср. $40 000","avg. $40,000","орт. $40 000"), specs: "AI · Data · Software", field: "IT", guar: true },
    { name: "Business Administration", flag: "US", country: "США", dur: _pp("4 года","4 years","4 жыл"), price: _pp("от $10 000/год","from $10,000/yr","$10 000/жыл"), schol: _pp("ср. $32 000","avg. $32,000","орт. $32 000"), specs: _pp("Маркетинг · Финансы","Marketing · Finance","Маркетинг · Каржы"), field: "Бизнес", guar: true },
    { name: _pp("Инженерия","Engineering","Инженерия"), flag: "IT", country: "Италия", dur: _pp("3 года","3 years","3 жыл"), price: _pp("от €2 100/год","from €2,100/yr","€2 100/жыл"), schol: _pp("гранты DSU","DSU grants","DSU гранттары"), specs: _pp("Механика · Авиа · Авто","Mechanics · Aero · Auto","Механика · Авиа · Авто"), field: "Инженерия", guar: true },
    { name: _pp("Медицина","Medicine","Медицина"), flag: "IT", country: "Италия", dur: _pp("6 лет","6 years","6 жыл"), price: _pp("от €2 200/год","from €2,200/yr","€2 200/жыл"), schol: _pp("гранты DSU","DSU grants","DSU гранттары"), specs: _pp("На английском · IMAT","In English · IMAT","Англисче · IMAT"), field: "Медицина" },
    { name: _pp("Дизайн и архитектура","Design & architecture","Дизайн жана архитектура"), flag: "IT", country: "Италия", dur: _pp("3 года","3 years","3 жыл"), price: _pp("от €2 600/год","from €2,600/yr","€2 600/жыл"), schol: _pp("ср. $9 000","avg. $9,000","орт. $9 000"), specs: "Product · Interior · Fashion", field: "Дизайн" },
    { name: _pp("Право","Law","Укук"), flag: "AT", country: "Австрия", dur: _pp("3 года","3 years","3 жыл"), price: _pp("от €726/год","from €726/yr","€726/жыл"), schol: _pp("почти бесплатно","almost free","дээрлик акысыз"), specs: _pp("Международное · ЕС","International · EU","Эл аралык · ЕБ"), field: "Право", guar: true },
  ]},
  "Магистратура": { level: "Магистр", items: [
    { name: "Data Science (MSc)", flag: "US", country: "США", dur: _pp("2 года","2 years","2 жыл"), price: _pp("от $14 000/год","from $14,000/yr","$14 000/жыл"), schol: _pp("ср. $25 000","avg. $25,000","орт. $25 000"), specs: "ML · Analytics", field: "IT" },
    { name: "Engineering (MSc)", flag: "DE", country: "Германия", dur: _pp("2 года","2 years","2 жыл"), price: _pp("€0 в гос. вузах","€0 at public unis","мамл. вуздарда €0"), schol: _pp("DAAD грант","DAAD grant","DAAD гранты"), specs: "Robotics · Energy", field: "Инженерия" },
    { name: "Management (MSc)", flag: "AT", country: "Австрия", dur: _pp("2 года","2 years","2 жыл"), price: _pp("от €726/год","from €726/yr","€726/жыл"), schol: _pp("почти бесплатно","almost free","дээрлик акысыз"), specs: _pp("Стратегия · Консалтинг","Strategy · Consulting","Стратегия · Консалтинг"), field: "Бизнес", guar: true },
    { name: "Finance & Economics", flag: "IT", country: "Италия", dur: _pp("2 года","2 years","2 жыл"), price: _pp("от €2 500/год","from €2,500/yr","€2 500/жыл"), schol: _pp("гранты DSU","DSU grants","DSU гранттары"), specs: "Banking · Fintech", field: "Экономика", guar: true },
    { name: "Public Health (MPH)", flag: "US", country: "США", dur: _pp("2 года","2 years","2 жыл"), price: _pp("от $20 000/год","from $20,000/yr","$20 000/жыл"), schol: _pp("ср. $30 000","avg. $30,000","орт. $30 000"), specs: _pp("Эпидемиология","Epidemiology","Эпидемиология"), field: "Медицина" },
    { name: "Design (MA)", flag: "IT", country: "Италия", dur: _pp("2 года","2 years","2 жыл"), price: _pp("от €2 600/год","from €2,600/yr","€2 600/жыл"), schol: _pp("ср. €5 000","avg. €5,000","орт. €5 000"), specs: "Fashion · Product", field: "Дизайн" },
  ]},
  "МВА": { level: "Магистр", items: [
    { name: "Full-time MBA", flag: "US", country: "США", dur: _pp("2 года","2 years","2 жыл"), price: _pp("от $25 000/год","from $25,000/yr","$25 000/жыл"), schol: _pp("ср. $45 000","avg. $45,000","орт. $45 000"), specs: "Strategy · Finance", field: "Бизнес" },
    { name: "Global MBA", flag: "MY", country: "Малайзия", dur: _pp("1–1.5 года","1–1.5 years","1–1.5 жыл"), price: _pp("от $9 000","from $9,000","$9 000"), schol: _pp("скидки до 50%","up to 50% off","50%га чейин арзандатуу"), specs: _pp("Британский диплом","British degree","Британ диплому"), field: "Бизнес", guar: true },
    { name: "Tech MBA", flag: "US", country: "США", dur: _pp("1.5 года","1.5 years","1.5 жыл"), price: _pp("от $29 000/год","from $29,000/yr","$29 000/жыл"), schol: _pp("ср. $35 000","avg. $35,000","орт. $35 000"), specs: "Product · Startups", field: "Бизнес" },
  ]},
  "PhD": { level: "PhD", items: [
    { name: "PhD in Computer Science", flag: "US", country: "США", dur: _pp("4–5 лет","4–5 years","4–5 жыл"), price: _pp("Финансируется","Funded","Каржыланат"), schol: _pp("стипендия + стайпенд","scholarship + stipend","стипендия + стайпенд"), specs: "Research", field: "IT" },
    { name: "PhD in Engineering", flag: "DE", country: "Германия", dur: _pp("3–4 года","3–4 years","3–4 жыл"), price: _pp("Финансируется","Funded","Каржыланат"), schol: _pp("оплата позиции","paid position","кызмат акысы"), specs: "Applied research", field: "Инженерия" },
    { name: "PhD in Economics", flag: "AT", country: "Австрия", dur: _pp("3–4 года","3–4 years","3–4 жыл"), price: _pp("от €726/год","from €726/yr","€726/жыл"), schol: _pp("ассистентские позиции","assistantships","ассистенттик кызматтар"), specs: "Econometrics", field: "Экономика" },
  ]},
  "Языковые": { level: null, items: [
    { name: "Intensive English (ESL)", flag: "US", country: "США", dur: _pp("4–24 нед.","4–24 wks","4–24 жума"), price: _pp("$1 200/мес","$1,200/mo","$1 200/ай"), schol: "—", specs: _pp("Подготовка к вузу","University prep","Вузга даярдоо"), guar: true },
    { name: "English Foundation", flag: "MY", country: "Малайзия", dur: _pp("8–36 нед.","8–36 wks","8–36 жума"), price: _pp("от $400/мес","from $400/mo","$400/ай"), schol: "—", specs: _pp("Перед вузами Азии","Before Asian universities","Азия вуздарынын алдында"), guar: true },
    { name: "Italian A1–B2", flag: "IT", country: "Италия", dur: _pp("12 нед.","12 wks","12 жума"), price: _pp("$900/мес","$900/mo","$900/ай"), schol: "—", specs: _pp("Для бесплатных вузов","For free universities","Акысыз вуздар үчүн") },
  ]},
  "Летние школы": { level: null, items: [
    { name: "Summer @ Berkeley", flag: "US", country: "США", dur: _pp("6 нед.","6 wks","6 жума"), price: "$4 500", schol: _pp("частичные","partial","жарым-жартылай"), specs: "Pre-college" },
    { name: "Vienna Summer School", flag: "AT", country: "Австрия", dur: _pp("3 нед.","3 wks","3 жума"), price: "$2 800", schol: "—", specs: _pp("Немецкий + академики","German + academics","Немис + академиялык") },
    { name: "Milan Design Camp", flag: "IT", country: "Италия", dur: _pp("4 нед.","4 wks","4 жума"), price: "$3 100", schol: "—", specs: "Creative" },
  ]},
  "Онлайн": { level: null, items: [
    { name: "Online Bachelor (CS)", flag: "US", country: "США", dur: _pp("4 года","4 years","4 жыл"), price: _pp("$7 000/год","$7,000/yr","$7 000/жыл"), schol: _pp("ср. $15 000","avg. $15,000","орт. $15 000"), specs: _pp("Гибкий график","Flexible schedule","Ийкемдүү график") },
    { name: "Online MBA", flag: "US", country: "США", dur: _pp("1.5 года","1.5 years","1.5 жыл"), price: "$18 000", schol: _pp("ср. $9 000","avg. $9,000","орт. $9 000"), specs: _pp("Без отрыва","Without leaving work","Иштен ажырабай") },
    { name: "MicroMasters", flag: "WW", country: "Глобально", dur: _pp("6–12 мес.","6–12 mo","6–12 ай"), price: "$1 500", schol: "—", specs: "Credential" },
  ]},
};

/* Quick path picker: who are you → which tab fits */
const WHO = [
  { ic: "01", t: _pp("Школьник","School student","Мектеп окуучусу"), sub: _pp("9–11 класс","grades 9–11","9–11-класс"), tab: "Бакалавриат" },
  { ic: "02", t: _pp("Студент / выпускник","Student / graduate","Студент / бүтүрүүчү"), sub: _pp("после вуза","after university","вуздан кийин"), tab: "Магистратура" },
  { ic: "03", t: _pp("Работаю","Working","Иштейм"), sub: _pp("карьерный рост","career growth","карьералык өсүү"), tab: "МВА" },
  { ic: "04", t: _pp("Начну с языка","Start with language","Тилден баштайм"), sub: _pp("или летней школы","or a summer school","же жайкы мектептен"), tab: "Языковые" },
];

function Programs() {
  const tabs = Object.keys(PROGRAMS);
  const [tab, setTab] = useState(tabs[0]);
  const cur = PROGRAMS[tab];
  const catalogCount = cur.level
    ? (window.EA_UNIS || []).filter((u) => u.levels.includes(cur.level)).length
    : 0;

  const progLink = (p) =>
    p.field && cur.level
      ? `universities.html?level=${encodeURIComponent(cur.level)}&field=${encodeURIComponent(p.field)}`
      : "#cta";

  return (
    <section className="section section--tight programs" id="programs">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{_pp("Программы обучения","Study programs","Окуу программалары")}</span>
          <h2>{_pp("Найди формат под свою цель","Find the format for your goal","Максатыңа ылайык форматты тап")}</h2>
        </div>

        <div className="programs__who" data-reveal>
          {WHO.map((w) => (
            <button key={w.t}
              className={"pwho" + (tab === w.tab ? " is-on" : "")}
              onClick={() => setTab(w.tab)}>
              <span className="pwho__ic" aria-hidden="true">{w.ic}</span>
              <span className="pwho__txt">
                <b>{w.t}</b>
                <span>{w.sub}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="programs__tabs" data-reveal>
          {tabs.map((t) => (
            <button key={t} className={"programs__tab" + (tab === t ? " is-on" : "")} onClick={() => setTab(t)}>{_TAB_LABELS[t] || t}</button>
          ))}
        </div>

        <div className="programs__grid stagger" key={tab}>
          {cur.items.map((p, i) => (
            <article className="prog card card--lift" key={p.name}>
              <div className="prog__head">
                <span className="prog__flag">{p.flag}</span>
                <div>
                  <h3 className="prog__name">{p.name}</h3>
                  <div className="prog__country">{_pCountry(p.country)}</div>
                </div>
              </div>
              <div className="prog__rows">
                <div className="prog__row"><span>{_pp("Длительность","Duration","Узактыгы")}</span><b>{p.dur}</b></div>
                <div className="prog__row"><span>{_pp("Стоимость","Cost","Баасы")}</span><b>{p.price}</b></div>
                <div className="prog__row"><span>{_pp("Стипендия Elite","Elite scholarship","Elite стипендиясы")}</span><b className="prog__schol">{p.schol}</b></div>
              </div>
              {p.guar && <div className="prog__guar">{_pp("✓ Гарантия поступления по договору","✓ Admission guarantee by contract","✓ Келишим боюнча тапшыруу кепилдиги")}</div>}
              <div className="prog__specs">{p.specs}</div>
              <a href={progLink(p)} className="prog__link">
                {p.field && cur.level ? _pp("Вузы с этой программой →","Universities with this program →","Бул программасы бар вуздар →") : _pp("Узнать подробнее →","Learn more →","Толугураак билүү →")}
              </a>
            </article>
          ))}
        </div>

        {cur.level && catalogCount > 0 && (
          <div className="programs__cat-link" data-reveal>
            {_pp("В каталоге","The catalog has","Каталогдо")} <b>{catalogCount}</b> {_pp("вузов с уровнем","universities with level","деңгээлиндеги вуз")} «{window.t ? window.t("field." + cur.level) : cur.level}» —{" "}
            <a href={`universities.html?level=${encodeURIComponent(cur.level)}`}>{_pp("открыть с фильтром →","open with filter →","чыпка менен ачуу →")}</a>
          </div>
        )}
      </div>
    </section>
  );
}

const EXAMS = [
  { name: "TOEFL iBT", badge: _pp("Самый нужный","Most needed","Эң керектүү"),
    desc: _pp("Золотой стандарт для США и Канады. Принимают 11 000+ вузов по всему миру. Наши студенты получают 90–110 баллов после 6–8 недель подготовки с нами.","The gold standard for the US and Canada. Accepted by 11,000+ universities worldwide. Our students score 90–110 after 6–8 weeks of preparation with us.","АКШ жана Канада үчүн алтын стандарт. Дүйнө жүзү боюнча 11 000+ вуз кабыл алат. Биздин студенттер биз менен 6–8 жума даярдангандан кийин 90–110 упай алышат."),
    diff: _pp("Средне","Medium","Орто"), price: "$185", for: _pp("США, Канада, Австралия","USA, Canada, Australia","АКШ, Канада, Австралия") },
  { name: "IELTS", badge: "",
    desc: _pp("Открывает двери в Великобританию, Австралию и Европу. Band 6.0–6.5 достаточно для большинства программ. Работаем с Academic и General Training.","Opens doors to the UK, Australia and Europe. Band 6.0–6.5 is enough for most programs. We work with Academic and General Training.","Улуу Британия, Австралия жана Европага эшик ачат. Көпчүлүк программа үчүн Band 6.0–6.5 жетиштүү. Academic жана General Training менен иштейбиз."),
    diff: _pp("Средне","Medium","Орто"), price: "$215", for: _pp("UK, Австралия, ЕС","UK, Australia, EU","UK, Австралия, ЕБ") },
  { name: "Duolingo DET", badge: _pp("Самый дешёвый","Cheapest","Эң арзан"),
    desc: _pp("Сдаётся онлайн за $65 прямо из дома — результат через 48 часов. Принимают 5000+ вузов включая топ-100. Наша специализация: 90% студентов сдают с первой попытки.","Taken online for $65 right from home — results in 48 hours. Accepted by 5,000+ universities including the top 100. Our specialty: 90% of students pass on the first try.","Үйдөн $65га онлайн тапшырылат — жыйынтык 48 сааттан кийин. Топ-100дү кошкондо 5000+ вуз кабыл алат. Биздин адистигибиз: студенттердин 90%ы биринчи аракетте тапшырат."),
    diff: _pp("Низко","Low","Төмөн"), price: "$65", for: _pp("США, Европа, Азия","USA, Europe, Asia","АКШ, Европа, Азия") },
  { name: "SAT", badge: "",
    desc: _pp("Нужен для бакалавриата в топ-вузах США. Высокий балл (1400+) значительно увеличивает шанс на стипендию. Готовим к Math и Reading секциям.","Needed for a bachelor’s at top US universities. A high score (1400+) greatly increases scholarship chances. We prepare for the Math and Reading sections.","АКШнын топ вуздарында бакалавриат үчүн керек. Жогорку упай (1400+) стипендия мүмкүнчүлүгүн бир топ жогорулатат. Math жана Reading бөлүктөрүнө даярдайбыз."),
    diff: _pp("Высоко","High","Жогору"), price: "$103", for: _pp("США","USA","АКШ") },
  { name: "CILS / CELI", badge: _pp("Для бесплатной учёбы","For free study","Акысыз окуу үчүн"),
    desc: _pp("Итальянский B1–B2 открывает доступ к бесплатным государственным вузам Италии с грантом DSU. Это твой билет на учёбу за €0 в год в Милане, Риме или Болонье.","Italian B1–B2 opens access to Italy’s free public universities with a DSU grant. It’s your ticket to study for €0 a year in Milan, Rome or Bologna.","Италия тили B1–B2 DSU гранты менен Италиянын акысыз мамлекеттик вуздарына жол ачат. Бул Милан, Рим же Болоньяда жылына €0го окуу билетиң."),
    diff: _pp("Средне","Medium","Орто"), price: "€105–160", for: _pp("Италия","Italy","Италия") },
  { name: "GRE / GMAT", badge: "",
    desc: _pp("Для магистратуры, PhD и МВА в США. Высокий балл компенсирует менее сильное GPA и открывает дополнительные стипендии. Готовим под конкретную программу.","For master’s, PhD and MBA in the US. A high score offsets a weaker GPA and unlocks extra scholarships. We prepare for your specific program.","АКШдагы магистратура, PhD жана MBA үчүн. Жогорку упай алсызыраак GPAны толуктайт жана кошумча стипендияларды ачат. Конкреттүү программаңа даярдайбыз."),
    diff: _pp("Высоко","High","Жогору"), price: "$220–275", for: _pp("Весь мир","Worldwide","Бүт дүйнө") },
  { name: "СЕНТ-S", badge: _pp("Италия · CISIA","Italy · CISIA","Италия · CISIA"),
    desc: _pp("Единый вступительный экзамен CISIA для иностранных студентов, поступающих на англоязычные бакалаврские программы в Италии. Тестирует математику, физику и логику. Обязателен для Politecnico di Milano, Bocconi и других топ-вузов.","A unified CISIA entrance exam for international students applying to English-taught bachelor’s programs in Italy. It tests maths, physics and logic. Required for Politecnico di Milano, Bocconi and other top universities.","Италияда англис тилдүү бакалавриат программаларына тапшырган чет элдик студенттер үчүн бирдиктүү CISIA кирүү экзамени. Математика, физика жана логиканы текшерет. Politecnico di Milano, Bocconi жана башка топ вуздар үчүн милдеттүү."),
    diff: _pp("Средне","Medium","Орто"), price: "€50–80", for: _pp("Италия","Italy","Италия") },
];

function Exams() {
  return (
    <section className="section exams" id="exams">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow eyebrow--gold">{_pp("Экзамены и тесты","Exams & tests","Экзамендер жана тесттер")}</span>
          <h2>{_pp("Какой тест нужен для поступления?","Which test do you need to enrol?","Тапшыруу үчүн кайсы тест керек?")}</h2>
        </div>

        <div className="exams__hero card" data-reveal>
          <div className="exams__hero-left">
            <span className="chip tag-green">{_pp("Наша специализация","Our specialty","Биздин адистигибиз")}</span>
            <h3 className="exams__hero-name">Duolingo English Test</h3>
            <p className="exams__hero-desc">{_pp(<>105–140 баллов. Сдаётся онлайн из дома за <b>$65</b>. Наши студенты в среднем сдают с <b>1-й попытки</b> — мы доводим до нужного балла.</>, <>105–140 points. Taken online from home for <b>$65</b>. Our students pass on average on the <b>first try</b> — we get you to the needed score.</>, <>105–140 упай. Үйдөн <b>$65</b>га онлайн тапшырылат. Биздин студенттер орто эсеп менен <b>1-аракетте</b> тапшырышат — биз керектүү упайга жеткиребиз.</>)}</p>
            <div className="exams__hero-stats">
              <div><b>$65</b><span>{_pp("стоимость","cost","баасы")}</span></div>
              <div><b>~48ч</b><span>{_pp("результат","result","жыйынтык")}</span></div>
              <div><b>100+</b><span>{_pp("сдали с нами","passed with us","биз менен тапшырды")}</span></div>
            </div>
            <a href="#cta" className="btn btn--gold">{_pp("Подготовиться с нами","Prepare with us","Биз менен даярдануу")}</a>
          </div>
          <div className="exams__hero-vis"><img src="images/duolingo.webp" alt="Duolingo English Test" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"var(--r-lg)"}} /></div>
        </div>

        <div className="exams__grid">
          {EXAMS.map((e, i) => (
            <article className="exam card card--lift" data-reveal data-delay={i + 1} key={i}>
              {e.badge && <span className="chip tag-green exam__badge">{e.badge}</span>}
              <div className="exam__name">{e.name}</div>
              <p className="exam__desc">{e.desc}</p>
              <div className="exam__meta">
                <span className="chip">{_pp("Сложность","Difficulty","Татаалдыгы")}: {e.diff}</span>
                <span className="chip tag-blue">{e.price}</span>
              </div>
              <div className="exam__for">{_pp("Для стран","For countries","Өлкөлөр үчүн")}: {e.for}</div>
              <a href="#cta" className="exam__cta">{_pp("Подготовиться с нами →","Prepare with us →","Биз менен даярдануу →")}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ENGLISH LEVEL TEST — result gated behind consultation form
   ============================================================ */
function EnglishLevelTest() {
  return (
    <section className="section section--tight elt" id="english-level">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow eyebrow--gold">{_pp("Бесплатный тест","Free test","Акысыз тест")}</span>
          <h2>{_pp("Проверь свой уровень английского","Check your English level","Англис деңгээлиңди текшер")}</h2>
          <p className="section-sub">{_pp("2 минуты · результат сразу · подбор программ под твой уровень","2 minutes · instant result · programs matched to your level","2 мүнөт · жыйынтык дароо · деңгээлиңе программаларды тандоо")}</p>
        </div>
        <div className="elt__card card" data-reveal>
          <div className="elt__intro">
            <div className="elt__intro-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <h3 className="elt__intro-h">{_pp("Узнай за 2 минуты, насколько ты готов к зарубежному вузу","Find out in 2 minutes how ready you are for a university abroad","Чет өлкөлүк вузга канчалык даяр экениңди 2 мүнөттө бил")}</h3>
            <p className="elt__intro-p">{_pp("Тест определяет твой уровень английского и помогает понять, какие программы и вузы подходят именно тебе.","The test determines your English level and helps you see which programs and universities suit you.","Тест англис деңгээлиңди аныктап, кайсы программалар жана вуздар сага туура келерин түшүнүүгө жардам берет.")}</p>
            <a href="https://forms.gle/gaHquVakyfyUe9XU8" target="_blank" rel="noopener" className="btn btn--gold btn--lg">{_pp("Начать тест →","Start the test →","Тестти баштоо →")}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Programs = Programs;
window.Exams = Exams;
window.EnglishLevelTest = EnglishLevelTest;
