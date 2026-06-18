/* ============================================================
   ABOUT — О нас (company overview + stats + accreditations)
   ============================================================ */

const ABOUT_DEFAULT = {
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

/* Admin-edited content wins over the defaults above */
const ABOUT = window.eaContent ? window.eaContent("about", ABOUT_DEFAULT) : ABOUT_DEFAULT;
window.EA_ABOUT = ABOUT;

function AboutUs() {
  return (
    <section className="section about" id="about">
      <div className="wrap">
        <div className="about__grid">

          <div className="about__media about__media--badge" data-reveal>
            <img src={ABOUT.badge} alt={ABOUT.badgeAlt || "Аккредитация ICEF"} className="about__badge-big" />
          </div>

          <div className="about__content" data-reveal data-delay="1">
            <span className="eyebrow">О нас</span>
            <h2>Будем рядом<br/><span className="text-blue">на всех этапах твоего пути.</span></h2>
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
                          {b.label || "Сертификат →"}
                        </a>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <a href="#cta" className="btn btn--dark">Получить консультацию бесплатно →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   VISION & MISSION — из брендбука Elite Academy
   ============================================================ */
function VisionMission() {
  return (
    <section className="section section--tight dark grain vm" id="vision">
      <div className="wrap">
        <div className="vm__grid">
          <div className="vm__block" data-reveal>
            <span className="eyebrow eyebrow--light">Видение</span>
            <h2 className="vm__h">Международное образование — для каждого поколения</h2>
            <p className="vm__p">Elite Academy стремится к тому, чтобы целое поколение получило международное качественное образование: культурный обмен, передовые знания, лучшие качества развитых стран — и внесло свой вклад в развитие Кыргызстана.</p>
          </div>
          <div className="vm__block" data-reveal data-delay="1">
            <span className="eyebrow eyebrow--light">Миссия</span>
            <h2 className="vm__h">Сделать качественное образование за рубежом доступным каждому</h2>
            <p className="vm__p">Ускоряем и облегчаем процесс поступления. Создаём сильное поколение через образование и культуру. Будем рядом на всех этапах — от первой консультации до первого дня в университете.</p>
          </div>
        </div>
        <div className="vm__slogan" data-reveal data-delay="2">
          Одна виза — миллион возможностей
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ACCREDITATIONS — partner / accreditation cards (about page)
   ============================================================ */
const ACCREDS_DEFAULT = [
  { name: "ICEF", tag: "Аккредитация", logo: "../images/logos/icef.jpg", desc: "Международная сеть проверенных агентств образования. Аккредитация подтверждает стандарты работы и прозрачность для вузов-партнёров." },
  { name: "American Academy", tag: "Языковой партнёр", logo: "../images/logos/american_academy.jpg", desc: "Лицензированный центр иностранных языков в Бишкеке — партнёр Elite Academy по языковой подготовке. Курсы английского и китайского: доводим студентов до уровня, необходимого для поступления и учёбы за рубежом." },
  { name: "Shorelight", tag: "Партнёрство", logo: "../images/logos/shorelight.jpg", desc: "Официальный партнёр Shorelight — прямые соглашения с университетами США, быстрые офферы и стипендии для наших студентов." },
  { name: "Apply Wave", tag: "Платформа", logo: "../images/logos/applywave.jpg", desc: "Партнёрская платформа подачи заявок: документы уходят в приёмные комиссии напрямую, без посредников." },
  { name: "Birpofi", tag: "Переводы", logo: "../images/logos/birpofi.png", desc: "Аккредитованная переводческая компания — переводы документов, которые принимают посольства и приёмные комиссии." },
];
const ACCREDS = window.eaContent ? window.eaContent("accreds", ACCREDS_DEFAULT) : ACCREDS_DEFAULT;
window.EA_ACCREDS = ACCREDS;

function Accreditations() {
  return (
    <section className="section section--tight accreds" id="accreds">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Аккредитации и партнёры</span>
          <h2>Нам доверяют не только студенты</h2>
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
const OFFICE_DEFAULT = {
  rating: "4.8",
  reviews: "214 отзывов на 2GIS",
  address: "ул. Исы Ахунбаева 169, БЦ «Бинокль», 6 этаж",
  hours: "ПН–ПТ 10:00–19:00 · СБ 12:00–19:00",
  phone: "+996 555 720 712",
  email: "eliteacademykg@gmail.com",
  instagram: "@eliteacademy.kg",
  map: "БЦ Бинокль, Ахунбаева 169, Бишкек",
};
const OFFICE = window.eaContent ? window.eaContent("office", OFFICE_DEFAULT) : OFFICE_DEFAULT;
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
          <span className="eyebrow">Офис в Бишкеке</span>
          <h2>Приходи знакомиться лично</h2>
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
              <div className="office__row"><div><b>Адрес</b>{OFFICE.address}</div></div>
              <div className="office__row"><div><b>График</b>{OFFICE.hours}</div></div>
              <div className="office__row"><div><b>Телефон / WhatsApp</b><a href={"tel:" + OFFICE.phone.replace(/[^+\d]/g, "")}>{OFFICE.phone}</a></div></div>
              <div className="office__row"><div><b>Email</b><a href={"mailto:" + OFFICE.email}>{OFFICE.email}</a></div></div>
              <div className="office__row"><div><b>Instagram</b><a href={"https://www.instagram.com/" + OFFICE.instagram.replace("@", "") + "/"} target="_blank" rel="noopener">{OFFICE.instagram}</a></div></div>
            </div>
            <a href="#cta" className="btn btn--gold btn--block">Записаться на консультацию</a>
          </div>
          <div className="office__map card" data-reveal data-delay="1">
            <div ref={mapRef} className="office__map-canvas"></div>
            <div className="office__map-firm">
              <div className="office__map-firm-info">
                <span className="office__map-firm-name">Elite Academy</span>
                <span className="office__map-firm-meta">
                  <span className="office__map-firm-star">★ 4.9</span>
                  <span>·</span>
                  <span>6 этаж</span>
                  <span>·</span>
                  <span>БЦ Бинокль</span>
                </span>
              </div>
              <a href="https://go.2gis.com/0qrsd" target="_blank" rel="noopener" className="office__map-ext-link office__map-ext-link--primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                В 2GIS
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.AboutUs = AboutUs;
window.VisionMission = VisionMission;
window.Accreditations = Accreditations;
window.OfficeBlock = OfficeBlock;
