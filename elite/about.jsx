/* ============================================================
   ABOUT — О нас (company overview + stats + accreditations)
   Trilingual via _tp(ru, en, kg) selected by window.__EA_LANG.
   ============================================================ */

const _ABL = (window.__EA_LANG || "ru");
const _tp  = (ru, en, kg) => _ABL === "en" ? en : _ABL === "kg" ? kg : ru;

const ABOUT_RU = {
  text: "Наша миссия — сделать качественное образование за рубежом доступным каждому. Elite Academy — официально аккредитованное агентство ICEF, одной из крупнейших международных сетей образовательных агентств. Мы рядом на каждом этапе — от выбора университета до первого дня в кампусе.",
  badge: "images/icef-badge.png",
  badgeAlt: "ICEF Accredited — статус #6696",
  stats: [
    { n: "1500+", l: "студентов\nотправлено" },
    { n: "7",     l: "стран\nнаправлений" },
    { n: "500+",  l: "партнёрских\nвузов" },
    { n: "5 лет", l: "на рынке\nобразования" },
  ],
  badges: [
    "ICEF Accredited — международная аккредитация",
    "Shorelight Partner — официальный партнёр",
    "Гарантия по договору — возврат при отказе в визе",
  ],
  photo: "images/team.jpg",
};
const ABOUT_EN = {
  text: "Our mission is to make quality education abroad accessible to everyone. Elite Academy is an officially ICEF-accredited agency — one of the largest international networks of education agencies. We’re with you at every step — from choosing a university to your first day on campus.",
  badge: "images/icef-badge.png",
  badgeAlt: "ICEF Accredited — status #6696",
  stats: [
    { n: "1500+", l: "students\nplaced" },
    { n: "7",     l: "destination\ncountries" },
    { n: "500+",  l: "partner\nuniversities" },
    { n: "5 yrs",  l: "in the education\nmarket" },
  ],
  badges: [
    "ICEF Accredited — international accreditation",
    "Shorelight Partner — official partner",
    "Contract guarantee — refund if the visa is refused",
  ],
  photo: "images/team.jpg",
};
const ABOUT_KG = {
  text: "Биздин миссиябыз — чет өлкөдөгү сапаттуу билимди ар бирине жеткиликтүү кылуу. Elite Academy — билим берүү агенттиктеринин эң ири эл аралык тармактарынын бири болгон ICEFтин расмий аккредитацияланган агенттиги. Биз ар бир этапта жаныңдабыз — университет тандоодон баштап кампустагы биринчи күнгө чейин.",
  badge: "images/icef-badge.png",
  badgeAlt: "ICEF Accredited — статус #6696",
  stats: [
    { n: "1500+", l: "студент\nжөнөтүлдү" },
    { n: "7",     l: "багыт\nөлкө" },
    { n: "500+",  l: "өнөктөш\nвуз" },
    { n: "5 жыл", l: "билим\nрыногунда" },
  ],
  badges: [
    "ICEF Accredited — эл аралык аккредитация",
    "Shorelight Partner — расмий өнөктөш",
    "Келишим боюнча кепилдик — визадан баш тартканда кайтаруу",
  ],
  photo: "images/team.jpg",
};

/* Admin-edited content wins for RU; EN/KG use static translations */
const ABOUT = _ABL === "en" ? ABOUT_EN : _ABL === "kg" ? ABOUT_KG
  : (window.eaContent ? window.eaContent("about", ABOUT_RU) : ABOUT_RU);
window.EA_ABOUT = ABOUT;

function AboutUs() {
  return (
    <section className="section about" id="about">
      <div className="wrap">
        <div className="about__grid">

          <div className="about__media about__media--badge" data-reveal>
            <img src={ABOUT.badge} alt={ABOUT.badgeAlt || "ICEF Accredited"} className="about__badge-big" />
          </div>

          <div className="about__content" data-reveal data-delay="1">
            <span className="eyebrow">{_tp("О нас", "About us", "Биз жөнүндө")}</span>
            <h2>{_tp("Будем рядом", "We’ll be with you", "Жаныңда болобуз")}<br/><span className="text-blue">{_tp("на всех этапах твоего пути.", "at every step of your journey.", "жолуңдун ар бир этабында.")}</span></h2>
            <p className="about__text">{ABOUT.text}</p>

            <div className="about__stats-row">
              {ABOUT.stats.map((s, i) => (
                <div className="about__stat" key={i}>
                  <div className="about__stat-n">{s.n}</div>
                  <div className="about__stat-l">{s.l}</div>
                </div>
              ))}
            </div>

            <div className="about__badges">
              {ABOUT.badges.map((b, i) => {
                const text = typeof b === "string" ? b : b.text;
                return (
                  <div className="about__badge" key={i}>
                    <span className="about__badge-ic">✓</span>
                    <span>
                      {text}
                      {b.href && (
                        <a href={b.href} target="_blank" rel="noopener noreferrer" className="about__badge-link">
                          {b.label || _tp("Сертификат →", "Certificate →", "Сертификат →")}
                        </a>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <a href="#cta" className="btn btn--dark">{_tp("Получить консультацию бесплатно →", "Get a free consultation →", "Акысыз консультация алуу →")}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CLIENT REVIEWS — "Что говорят наши клиенты" (2GIS)
   ============================================================ */
const _2GIS = "https://2gis.kg/bishkek/firm/70000001083998736";
const REVIEWS_RU = [
  { name: "Айнура М.", stars: 5, text: "Elite Academy помогли мне поступить в Италию с грантом. Всё чётко: от подготовки документов до оформления визы. Огромная благодарность команде!", date: "Март 2024" },
  { name: "Тимур К.", stars: 5, text: "Поступил в США с стипендией $95 000 — это казалось нереальным. Elite Academy сделали процесс понятным и прозрачным, отвечали на любые вопросы 24/7.", date: "Февраль 2024" },
  { name: "Малика Д.", stars: 5, text: "Очень профессиональная команда. Помогли с Duolingo, эссе и подачей. Сейчас учусь в Германии и не могу не сказать спасибо Elite Academy!", date: "Январь 2024" },
  { name: "Бекзат А.", stars: 5, text: "Не верил, что можно поступить без IELTS. Менеджер всё объяснил, мы подали через Duolingo — и получили оффер. Супер агентство!", date: "Апрель 2024" },
  { name: "Диана Р.", stars: 5, text: "Поступила в Италию на медицину, DSU оплатил почти всё обучение. Elite Academy нашли этот вариант и провели по каждому шагу. Счастлива!", date: "Май 2024" },
  { name: "Азиз Н.", stars: 5, text: "Обратился в несколько агентств — Elite Academy выделились честностью и знанием. Рассказали реальные шансы, не обещали золотые горы. Поступил в Польшу!", date: "Декабрь 2023" },
  { name: "Жанара Т.", stars: 5, text: "Быстро, чётко, без лишних нервов. Сопровождение было на каждом этапе. Сейчас учусь в Австрии — мечта стала реальностью благодаря Elite Academy.", date: "Ноябрь 2023" },
  { name: "Нурсулу О.", stars: 5, text: "Агентство с душой. Не просто оформляют бумаги — реально заинтересованы в успехе студента. Мой сын поступил в Малайзию, доволен на 100%!", date: "Октябрь 2023" },
  { name: "Эрлан С.", stars: 5, text: "Спортивная стипендия в США — думал, это только для топовых спортсменов. Elite Academy доказали, что всё возможно. Сейчас играю в футбол и учусь!", date: "Сентябрь 2023" },
  { name: "Асель Б.", stars: 5, text: "Рекомендую всем! Очень внимательный подход, всегда на связи. Помогли с Northern Cyprus — оказалось бюджетно и качественно. Спасибо Elite Academy!", date: "Август 2023" },
];
const REVIEWS_EN = [
  { name: "Ainura M.", stars: 5, text: "Elite Academy helped me get into Italy with a grant. Everything was clear: from preparing documents to the visa. Huge thanks to the team!", date: "March 2024" },
  { name: "Timur K.", stars: 5, text: "I got into the US with a $95,000 scholarship — it seemed unreal. Elite Academy made the process clear and transparent, answering any questions 24/7.", date: "February 2024" },
  { name: "Malika D.", stars: 5, text: "A very professional team. They helped with Duolingo, essays and the application. I now study in Germany and can’t help but thank Elite Academy!", date: "January 2024" },
  { name: "Bekzat A.", stars: 5, text: "I didn’t believe you could get in without IELTS. The manager explained everything, we applied through Duolingo — and got the offer. Great agency!", date: "April 2024" },
  { name: "Diana R.", stars: 5, text: "I got into medicine in Italy, and DSU covered almost all the tuition. Elite Academy found this option and guided me through every step. So happy!", date: "May 2024" },
  { name: "Aziz N.", stars: 5, text: "I approached several agencies — Elite Academy stood out for honesty and knowledge. They told me my real chances, didn’t promise the moon. I got into Poland!", date: "December 2023" },
  { name: "Zhanara T.", stars: 5, text: "Fast, clear, without extra stress. There was support at every stage. I now study in Austria — a dream come true thanks to Elite Academy.", date: "November 2023" },
  { name: "Nursulu O.", stars: 5, text: "An agency with a soul. They don’t just file papers — they’re genuinely invested in the student’s success. My son got into Malaysia, 100% happy!", date: "October 2023" },
  { name: "Erlan S.", stars: 5, text: "A sports scholarship in the US — I thought that was only for top athletes. Elite Academy proved anything is possible. Now I play football and study!", date: "September 2023" },
  { name: "Asel B.", stars: 5, text: "I recommend them to everyone! Very attentive approach, always in touch. They helped with Northern Cyprus — affordable and high-quality. Thank you, Elite Academy!", date: "August 2023" },
];
const REVIEWS_KG = [
  { name: "Айнура М.", stars: 5, text: "Elite Academy Италияга грант менен тапшырууга жардам берди. Баары так: документтерди даярдоодон визага чейин. Командага чоң рахмат!", date: "Март 2024" },
  { name: "Тимур К.", stars: 5, text: "АКШга $95 000 стипендия менен тапшырдым — бул мүмкүн эмес окшоду. Elite Academy процессти түшүнүктүү жана ачык кылды, каалаган суроого 24/7 жооп берди.", date: "Февраль 2024" },
  { name: "Малика Д.", stars: 5, text: "Абдан кесипкөй команда. Duolingo, эссе жана тапшыруу менен жардам беришти. Азыр Германияда окуп жатам, Elite Academyге рахмат айтпай коё албайм!", date: "Январь 2024" },
  { name: "Бекзат А.", stars: 5, text: "IELTSсиз тапшырса болорун ишенген эмесмин. Менеджер баарын түшүндүрдү, Duolingo аркылуу тапшырдык — оффер алдык. Сонун агенттик!", date: "Апрель 2024" },
  { name: "Диана Р.", stars: 5, text: "Италияда медицинага тапшырдым, DSU окуунун дээрлик баарын төлөдү. Elite Academy бул вариантты таап, ар бир кадам менен алып жүрдү. Бактылуумун!", date: "Май 2024" },
  { name: "Азиз Н.", stars: 5, text: "Бир нече агенттикке кайрылдым — Elite Academy чынчылдыгы жана билими менен айырмаланды. Чыныгы мүмкүнчүлүктөрдү айтышты, алтын тоо убада кылышкан жок. Польшага тапшырдым!", date: "Декабрь 2023" },
  { name: "Жанара Т.", stars: 5, text: "Тез, так, ашыкча тынчсыздануусуз. Ар бир этапта коштоо болду. Азыр Австрияда окуп жатам — Elite Academynin аркасында кыял чындыкка айланды.", date: "Ноябрь 2023" },
  { name: "Нурсулу О.", stars: 5, text: "Жандуу агенттик. Кагаз жол-жоболоштуруу менен эле чектелбейт — студенттин ийгилигине чын жүрөктөн кызыкдар. Уулум Малайзияга тапшырды, 100% ыраазы!", date: "Октябрь 2023" },
  { name: "Эрлан С.", stars: 5, text: "АКШда спорттук стипендия — бул тек гана топ спортчулар үчүн деп ойлочумун. Elite Academy баары мүмкүн экенин далилдеди. Азыр футбол ойноп, окуп жатам!", date: "Сентябрь 2023" },
  { name: "Асель Б.", stars: 5, text: "Баарына сунуштайм! Абдан кылдат мамиле, дайыма байланышта. Түндүк Кипр менен жардам беришти — арзан жана сапаттуу болуп чыкты. Elite Academyге рахмат!", date: "Август 2023" },
];
const REVIEWS = (_ABL === "en" ? REVIEWS_EN : _ABL === "kg" ? REVIEWS_KG : REVIEWS_RU)
  .map(r => ({ ...r, link: _2GIS }));

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

function ClientReviews() {
  const [idx, setIdx] = React.useState(0);
  const visible = 3;
  const max = REVIEWS.length - visible;

  function prev() { setIdx(i => Math.max(0, i - 1)); }
  function next() { setIdx(i => Math.min(max, i + 1)); }

  return (
    <section className="section reviews" id="reviews">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{_tp("Отзывы", "Reviews", "Пикирлер")}</span>
          <h2>{_tp("Что говорят наши клиенты", "What our clients say", "Кардарларыбыз эмне дейт")}</h2>
          <p className="section-sub">{_tp("Рейтинг 4.8 · 214 отзывов на ", "Rating 4.8 · 214 reviews on ", "Рейтинг 4.8 · 214 пикир ")}<a href={_2GIS} target="_blank" rel="noopener" className="link-blue">2GIS</a></p>
        </div>

        <div className="reviews__slider">
          <div className="reviews__track" style={{ transform: `translateX(calc(-${idx} * (100% / ${visible}) - ${idx} * 24px))` }}>
            {REVIEWS.map((r, i) => (
              <article className="reviews__card card" key={i}>
                <div className="reviews__stars">{Array(r.stars).fill(0).map((_, j) => <StarIcon key={j} />)}</div>
                <p className="reviews__text">«{r.text}»</p>
                <div className="reviews__meta">
                  <span className="reviews__name">{r.name}</span>
                  <span className="reviews__date">{r.date}</span>
                </div>
                <a href={r.link} target="_blank" rel="noopener" className="reviews__link">{_tp("Читать на 2GIS →", "Read on 2GIS →", "2GISте окуу →")}</a>
              </article>
            ))}
          </div>
        </div>

        <div className="reviews__nav">
          <button className="reviews__arrow" onClick={prev} disabled={idx === 0} aria-label={_tp("Назад", "Previous", "Артка")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="reviews__dots">
            {Array(max + 1).fill(0).map((_, i) => (
              <button key={i} className={"reviews__dot" + (idx === i ? " is-on" : "")} onClick={() => setIdx(i)} aria-label={_tp("Страница ", "Page ", "Барак ") + (i + 1)} />
            ))}
          </div>
          <button className="reviews__arrow" onClick={next} disabled={idx === max} aria-label={_tp("Вперёд", "Next", "Алдыга")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

window.ClientReviews = ClientReviews;

/* ============================================================
   VISION & MISSION — из брендбука Elite Academy
   ============================================================ */
function VisionMission() {
  return (
    <section className="section section--tight dark grain vm" id="vision">
      <div className="wrap">
        <div className="vm__grid">
          <div className="vm__block" data-reveal>
            <span className="eyebrow eyebrow--light">{_tp("Видение", "Vision", "Көрөңгө")}</span>
            <h2 className="vm__h">{_tp("Международное образование — для каждого поколения", "International education — for every generation", "Эл аралык билим — ар бир муун үчүн")}</h2>
            <p className="vm__p">{_tp("Elite Academy стремится к тому, чтобы целое поколение получило международное качественное образование: культурный обмен, передовые знания, лучшие качества развитых стран — и внесло свой вклад в развитие Кыргызстана.", "Elite Academy strives for a whole generation to receive quality international education: cultural exchange, advanced knowledge and the best qualities of developed countries — and to contribute to the development of Kyrgyzstan.", "Elite Academy бүтүндөй муундун эл аралык сапаттуу билим алышына умтулат: маданий алмашуу, алдыңкы билим, өнүккөн өлкөлөрдүн эң мыкты сапаттары — жана Кыргызстандын өнүгүшүнө салым кошуу.")}</p>
          </div>
          <div className="vm__block" data-reveal data-delay="1">
            <span className="eyebrow eyebrow--light">{_tp("Миссия", "Mission", "Миссия")}</span>
            <h2 className="vm__h">{_tp("Сделать качественное образование за рубежом доступным каждому", "Make quality education abroad accessible to everyone", "Чет өлкөдөгү сапаттуу билимди ар бирине жеткиликтүү кылуу")}</h2>
            <p className="vm__p">{_tp("Ускоряем и облегчаем процесс поступления. Создаём сильное поколение через образование и культуру. Будем рядом на всех этапах — от первой консультации до первого дня в университете.", "We speed up and simplify the admission process. We build a strong generation through education and culture. We’ll be with you at every step — from the first consultation to your first day at university.", "Тапшыруу процессин тездетип, жеңилдетебиз. Билим жана маданият аркылуу күчтүү муун түзөбүз. Ар бир этапта жаныңда болобуз — биринчи консультациядан университеттеги биринчи күнгө чейин.")}</p>
          </div>
        </div>
        <div className="vm__slogan" data-reveal data-delay="2">
          {_tp("Одна виза — миллион возможностей", "One visa — a million opportunities", "Бир виза — миллион мүмкүнчүлүк")}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ACCREDITATIONS — partner / accreditation cards (about page)
   ============================================================ */
const ACCREDS_RU = [
  { name: "ICEF", tag: "Аккредитация", logo: "../images/logos/icef.jpg", desc: "Международная сеть проверенных агентств образования. Аккредитация подтверждает стандарты работы и прозрачность для вузов-партнёров." },
  { name: "American Academy", tag: "Языковой партнёр", logo: "../images/logos/american_academy.jpg", desc: "Лицензированный центр иностранных языков в Бишкеке — партнёр Elite Academy по языковой подготовке. Курсы английского и китайского: доводим студентов до уровня, необходимого для поступления и учёбы за рубежом." },
  { name: "Shorelight", tag: "Партнёрство", logo: "../images/logos/shorelight.jpg", desc: "Официальный партнёр Shorelight — прямые соглашения с университетами США, быстрые офферы и стипендии для наших студентов." },
  { name: "Apply Wave", tag: "Платформа", logo: "../images/logos/applywave.jpg", desc: "Партнёрская платформа подачи заявок: документы уходят в приёмные комиссии напрямую, без посредников." },
  { name: "Birpofi", tag: "Переводы", logo: "../images/logos/birpofi.png", desc: "Аккредитованная переводческая компания — переводы документов, которые принимают посольства и приёмные комиссии." },
];
const ACCREDS_EN = [
  { name: "ICEF", tag: "Accreditation", logo: "../images/logos/icef.jpg", desc: "An international network of vetted education agencies. The accreditation confirms our standards and transparency for partner universities." },
  { name: "American Academy", tag: "Language partner", logo: "../images/logos/american_academy.jpg", desc: "A licensed foreign-language centre in Bishkek — Elite Academy’s partner for language preparation. English and Chinese courses: we bring students to the level needed to enrol and study abroad." },
  { name: "Shorelight", tag: "Partnership", logo: "../images/logos/shorelight.jpg", desc: "An official Shorelight partner — direct agreements with US universities, fast offers and scholarships for our students." },
  { name: "Apply Wave", tag: "Platform", logo: "../images/logos/applywave.jpg", desc: "A partner application platform: documents go straight to admissions offices, with no intermediaries." },
  { name: "Birpofi", tag: "Translations", logo: "../images/logos/birpofi.png", desc: "An accredited translation company — document translations accepted by embassies and admissions offices." },
];
const ACCREDS_KG = [
  { name: "ICEF", tag: "Аккредитация", logo: "../images/logos/icef.jpg", desc: "Текшерилген билим берүү агенттиктеринин эл аралык тармагы. Аккредитация иштин стандарттарын жана өнөктөш вуздар үчүн ачыктыкты ырастайт." },
  { name: "American Academy", tag: "Тил өнөктөшү", logo: "../images/logos/american_academy.jpg", desc: "Бишкектеги лицензияланган чет тилдер борбору — Elite Academynin тил даярдыгы боюнча өнөктөшү. Англис жана кытай курстары: студенттерди чет өлкөгө тапшыруу жана окуу үчүн керектүү деңгээлге жеткиребиз." },
  { name: "Shorelight", tag: "Өнөктөштүк", logo: "../images/logos/shorelight.jpg", desc: "Shorelighttin расмий өнөктөшү — АКШнын университеттери менен түз келишимдер, тез офферлер жана студенттерибиз үчүн стипендиялар." },
  { name: "Apply Wave", tag: "Платформа", logo: "../images/logos/applywave.jpg", desc: "Өнөктөш тапшыруу платформасы: документтер ортомчусуз түз кабыл алуу комиссияларына жөнөтүлөт." },
  { name: "Birpofi", tag: "Котормолор", logo: "../images/logos/birpofi.png", desc: "Аккредитацияланган котормо компаниясы — элчиликтер жана кабыл алуу комиссиялары кабыл алган документтердин котормолору." },
];
const ACCREDS = _ABL === "en" ? ACCREDS_EN : _ABL === "kg" ? ACCREDS_KG
  : (window.eaContent ? window.eaContent("accreds", ACCREDS_RU) : ACCREDS_RU);
window.EA_ACCREDS = ACCREDS;

function Accreditations() {
  return (
    <section className="section section--tight accreds" id="accreds">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{_tp("Аккредитации и партнёры", "Accreditations & partners", "Аккредитациялар жана өнөктөштөр")}</span>
          <h2>{_tp("Нам доверяют не только студенты", "Not only students trust us", "Бизге студенттер гана эмес ишенет")}</h2>
        </div>
        <div className="accreds__grid">
          {ACCREDS.map((a, i) => (
            <article className="accred card card--lift" data-reveal data-delay={i + 1} key={a.name}>
              {a.logo && <img src={a.logo} alt={a.name} className="accred__logo" />}
              <span className="accred__tag">{a.tag}</span>
              <h3 className="accred__name">{a.name}</h3>
              <p className="accred__desc">{a.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   OFFICE — address, hours, rating + Google Maps embed
   ============================================================ */
const OFFICE_RU = {
  rating: "4.8", reviews: "214 отзывов на 2GIS",
  address: "ул. Исы Ахунбаева 169, БЦ «Бинокль», 6 этаж",
  hours: "ПН–ПТ 10:00–19:00 · СБ 12:00–19:00",
  phone: "+996 555 720 712", email: "eliteacademykg@gmail.com", instagram: "@eliteacademy.kg",
  map: "БЦ Бинокль, Ахунбаева 169, Бишкек",
};
const OFFICE_EN = {
  rating: "4.8", reviews: "214 reviews on 2GIS",
  address: "169 Isy Akhunbaeva St, Binokl Business Center, 6th floor",
  hours: "Mon–Fri 10:00–19:00 · Sat 12:00–19:00",
  phone: "+996 555 720 712", email: "eliteacademykg@gmail.com", instagram: "@eliteacademy.kg",
  map: "БЦ Бинокль, Ахунбаева 169, Бишкек",
};
const OFFICE_KG = {
  rating: "4.8", reviews: "2GISте 214 пикир",
  address: "Иса Ахунбаев көчөсү 169, «Бинокль» ББ, 6-кабат",
  hours: "ДҮЙ–ЖУМ 10:00–19:00 · ИШ 12:00–19:00",
  phone: "+996 555 720 712", email: "eliteacademykg@gmail.com", instagram: "@eliteacademy.kg",
  map: "БЦ Бинокль, Ахунбаева 169, Бишкек",
};
const OFFICE = _ABL === "en" ? OFFICE_EN : _ABL === "kg" ? OFFICE_KG
  : (window.eaContent ? window.eaContent("office", OFFICE_RU) : OFFICE_RU);
window.EA_OFFICE = OFFICE;

const DGIS_KEY      = "de8b758a-a208-4a05-9f30-25eb492f4364";
const OFFICE_COORDS = [74.590385, 42.843700]; // центр здания 169

function OfficeBlock() {
  const mapRef  = React.useRef(null);
  const mapInst = React.useRef(null);

  React.useEffect(() => {
    if (mapInst.current || !mapRef.current) return;
    function initMap() {
      const map = new window.mapgl.Map(mapRef.current, {
        center: OFFICE_COORDS,
        zoom: 17,
        key: DGIS_KEY,
        lang: "ru",
      });
      mapInst.current = map;
      new window.mapgl.Marker(map, {
        coordinates: OFFICE_COORDS,
      });
    }
    if (window.mapgl) {
      initMap();
    } else {
      const s = document.createElement("script");
      s.src = "https://mapgl.2gis.com/api/js/v1";
      s.onload = initMap;
      document.head.appendChild(s);
    }
    return () => { if (mapInst.current) { mapInst.current.destroy(); mapInst.current = null; } };
  }, []);

  return (
    <section className="section section--tight office" id="office">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{_tp("Офис в Бишкеке", "Office in Bishkek", "Бишкектеги офис")}</span>
          <h2>{_tp("Приходи знакомиться лично", "Come meet us in person", "Жеке таанышууга кел")}</h2>
        </div>
        <div className="office__grid">
          <div className="office__info card" data-reveal>
            <div className="office__rating">
              <b>{OFFICE.rating}</b>
              <div>
                <span className="office__stars" aria-hidden="true">★★★★★</span>
                <span className="office__rating-sub">{OFFICE.reviews}</span>
              </div>
            </div>
            <div className="office__rows">
              <div className="office__row"><div><b>{_tp("Адрес", "Address", "Дарек")}</b>{OFFICE.address}</div></div>
              <div className="office__row"><div><b>{_tp("График", "Hours", "График")}</b>{OFFICE.hours}</div></div>
              <div className="office__row"><div><b>{_tp("Телефон / WhatsApp", "Phone / WhatsApp", "Телефон / WhatsApp")}</b><a href={"tel:" + OFFICE.phone.replace(/[^+\d]/g, "")}>{OFFICE.phone}</a></div></div>
              <div className="office__row"><div><b>Email</b><a href={"mailto:" + OFFICE.email}>{OFFICE.email}</a></div></div>
              <div className="office__row"><div><b>Instagram</b><a href={"https://www.instagram.com/" + OFFICE.instagram.replace("@", "") + "/"} target="_blank" rel="noopener">{OFFICE.instagram}</a></div></div>
            </div>
            <a href="#cta" className="btn btn--gold btn--block">{_tp("Записаться на консультацию", "Book a consultation", "Консультацияга жазылуу")}</a>
          </div>
          <div className="office__map card" data-reveal data-delay="1">
            <div ref={mapRef} className="office__map-canvas"></div>
            <div className="office__map-firm">
              <div className="office__map-firm-info">
                <span className="office__map-firm-name">Elite Academy</span>
                <span className="office__map-firm-meta">
                  <span className="office__map-firm-star">★ 4.9</span>
                  <span>·</span>
                  <span>{_tp("6 этаж", "6th floor", "6-кабат")}</span>
                  <span>·</span>
                  <span>{_tp("БЦ Бинокль", "Binokl BC", "Бинокль ББ")}</span>
                </span>
              </div>
              <a href="https://2gis.kg/bishkek/geo/70000001083998736" target="_blank" rel="noopener" className="office__map-ext-link office__map-ext-link--primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {_tp("В 2GIS", "On 2GIS", "2GISте")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CAREERS TEASER — small block after Accreditations
   ============================================================ */
function CareersTeaser() {
  return (
    <section className="section careers-teaser">
      <div className="wrap careers-teaser__inner">
        <div className="careers-teaser__text" data-reveal>
          <span className="eyebrow">{t("careers.teaser.eyebrow")}</span>
          <h2 className="careers-teaser__h2">{t("careers.teaser.h2")}</h2>
          <p className="careers-teaser__sub">{t("careers.teaser.sub")}</p>
        </div>
        <div className="careers-teaser__cta" data-reveal data-delay="1">
          <a href="careers.html" className="btn btn--gold btn--lg">{t("careers.teaser.btn")}</a>
        </div>
      </div>
    </section>
  );
}

window.AboutUs = AboutUs;
window.VisionMission = VisionMission;
window.Accreditations = Accreditations;
window.OfficeBlock = OfficeBlock;
window.CareersTeaser = CareersTeaser;
