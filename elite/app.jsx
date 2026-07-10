/* ============================================================
   APP — page-based composition driven by body[data-page]
   ============================================================ */
const { useEffect } = React;

/* local i18n selector (same pattern as other .jsx files) */
const _APL = (window.__EA_LANG || "ru");
const _apt = (ru, en, kg) => _APL === "en" ? en : _APL === "kg" ? kg : ru;

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* ============================================================
   PAGE LAYOUTS — each page composes the right sections
   ============================================================ */

function PageHome() {
  return (
    <>
      <Hero />
      <TrustBar />
      <BeyondDiploma />
      <Quiz />
      <DeadlineBanner />
      <Countries />
      <MediaFeed />
      <Stories />
      <PainSolution />
      <ClientReviews />
      <FinalCTA />
    </>
  );
}

function PageCountries() {
  return (
    <>
      <PageHero
        eyebrow={_apt("Направления", "Destinations", "Багыттар")}
        title={_apt("Куда едут учиться студенты Elite Academy", "Where Elite Academy students go to study", "Elite Academy студенттери кайда окууга барышат")}
        sub={_apt("Выбери страну — и мы покажем вузы, бюджет, визу и сроки. Карты, цены и реальные истории по каждому направлению.", "Pick a country — and we’ll show you the universities, budget, visa and timelines. Maps, prices and real stories for every destination.", "Өлкөнү танда — биз сага университеттерди, бюджетти, визаны жана мөөнөттөрдү көрсөтөбүз. Ар бир багыт боюнча карталар, баалар жана чыныгы окуялар.")}
        variant="geometric"
      />
      <Countries />
      <PainSolution />
      <FinalCTA />
    </>
  );
}

function PageUniversities() {
  return (
    <>
      <PageHero
        eyebrow={_apt("Каталог", "Catalog", "Каталог")}
        title={_apt("База университетов", "University database", "Университеттер базасы")}
        sub={_apt("Партнёрские университеты Elite Academy в США, Европе и Азии. Фильтруй по направлению, рейтингу и уровню — и сохраняй те, что нравятся.", "Elite Academy partner universities in the US, Europe and Asia. Filter by field, ranking and level — and save the ones you like.", "АКШ, Европа жана Азиядагы Elite Academyнин өнөктөш университеттери. Багыты, рейтинги жана деңгээли боюнча чыпкала — жакканын сактап кой.")}
        variant="default"
      />
      <DeadlineBanner />
      <Universities />
      <FinalCTA />
    </>
  );
}

function PagePrograms() {
  return (
    <>
      <PageHero
        eyebrow={_apt("Программы обучения", "Study programs", "Окуу программалары")}
        title={_apt("Найди формат под свою цель", "Find the format for your goal", "Максатыңа ылайык форматты тап")}
        sub={_apt("Бакалавриат, магистратура, MBA, PhD, языковые и летние школы. Стоимость, длительность, средние стипендии.", "Bachelor’s, master’s, MBA, PhD, language and summer schools. Costs, duration and average scholarships.", "Бакалавриат, магистратура, MBA, PhD, тил жана жайкы мектептер. Баасы, узактыгы, орточо стипендиялар.")}
        variant="organic"
      />
      <Programs />
      <DeadlineBanner />
      <Exams />
      <FinalCTA />
    </>
  );
}

function PageAdmission() {
  return (
    <>
      <PageHero
        eyebrow={_apt("Поступление", "Admission", "Кабыл алуу")}
        title={_apt("Поступай за рубеж вместе с Elite", "Apply abroad with Elite", "Elite менен чет өлкөгө тапшыр")}
        sub={_apt("Проверь свой английский, посчитай реальную стоимость учёбы, узнай о стипендиях и визах — а дальше приходи на консультацию и подавай заявку.", "Check your English, calculate the real cost of studying, learn about scholarships and visas — then come for a consultation and submit your application.", "Англисчеңди текшер, окуунун чыныгы баасын эсепте, стипендиялар жана визалар жөнүндө бил — андан кийин консультацияга келип, арыз тапшыр.")}
        variant="default"
      />
      <EnglishLevelTest />
      <SavingsCalculator />
      <Scholarships />
      <Visas />
      <FinalCTA />
    </>
  );
}

function PageCountry() {
  return (
    <>
      <CountryProfile />
      <PainSolution />
      <FinalCTA />
    </>
  );
}

function PageUniversity() {
  return (
    <>
      <UniversityProfile />
      <FinalCTA />
    </>
  );
}

function PageStories() {
  return (
    <>
      <PageHero
        eyebrow={_apt("Истории и блог", "Stories & blog", "Окуялар жана блог")}
        title={_apt("Они были такими же, как ты", "They were just like you", "Алар да сендей эле болушкан")}
        sub={_apt("1500+ студентов уже учатся за рубежом. Здесь — их кейсы, видео-отзывы и статьи о жизни после поступления.", "1500+ students already study abroad. Here are their cases, video reviews and articles about life after admission.", "1500+ студент чет өлкөдө окуп жатышат. Бул жерде — алардын кейстери, видео-пикирлери жана тапшыруудан кийинки жашоо тууралуу макалалар.")}
        variant="organic"
      />
      <Stories />
      <Blog />
      <FinalCTA />
    </>
  );
}

function PageAbout() {
  return (
    <>
      <PageHero
        eyebrow={_apt("О нас", "About us", "Биз жөнүндө")}
        title={_apt("Кто мы и почему нам доверяют", "Who we are and why people trust us", "Биз кимбиз жана эмнеге бизге ишенишет")}
        sub={_apt("Аккредитованное ICEF агентство из Бишкека. 1500+ студентов поступили в США, Италию и ещё 5 стран. Рейтинг 4.9 из 5 по 196 отзывам на 2GIS.", "An ICEF-accredited agency from Bishkek. 1500+ students admitted to the US, Italy and 5 more countries. Rated 4.9 out of 5 across 196 reviews on 2GIS.", "Бишкектеги ICEF аккредитациясы бар агенттик. 1500+ студент АКШ, Италия жана дагы 5 өлкөгө тапшырды. 2GISте 196 пикир боюнча рейтинг 4.9/5.")}
        variant="minimal"
      />
      <AboutUs />
      <VisionMission />
      <Team />
      <Accreditations />
      <CareersTeaser />
      <OfficeBlock />
      <FinalCTA />
    </>
  );
}

/* ============================================================
   PAGE HERO — compact intro block used on inner pages
   ============================================================ */
function PageHero({ eyebrow, title, sub, variant }) {
  return (
    <section className="page-hero grain" id="top">
      <div className="page-hero__mesh" aria-hidden="true"></div>
      <AliveBackground variant={variant} />
      <div className="wrap page-hero__inner">
        <span className="eyebrow eyebrow--light" data-reveal>{eyebrow}</span>
        <h1 data-reveal data-delay="1">{title}</h1>
        <p data-reveal data-delay="2">{sub}</p>
      </div>
      <div className="page-hero__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M 0 40 C 240 10, 480 70, 720 40 S 1200 10, 1440 40 L 1440 80 L 0 80 Z" fill="var(--white)" />
        </svg>
      </div>
    </section>
  );
}

function PageCareers() {
  return <CareersPage />;
}

const PAGES = {
  home: PageHome,
  countries: PageCountries,
  country: PageCountry,
  universities: PageUniversities,
  university: PageUniversity,
  programs: PagePrograms,
  admission: PageAdmission,
  stories: PageStories,
  about: PageAbout,
  careers: PageCareers,
};

function App() {
  useReveal();
  const pageKey = (document.body && document.body.dataset.page) || "home";
  const PageComp = PAGES[pageKey] || PageHome;
  return (
    <>
      <Navbar />
      <ScrollProgress />
      <main>
        <PageComp />
      </main>
      <Footer />
      <StickyQuizCTA />
      <FloatingChat />
      <ExitIntent />
      <GlobalFX />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);
