/* ============================================================
   STORIES (carousel + grid) · VISAS · BLOG · TEAM
   ============================================================ */
const { useState } = React;

const STORY_CARDS = [
  { name: "Байель", from: "из Нооката — онлайн", quote: "Сдал Duolingo на 105 баллов и поступил в Bellevue College. Всё — дистанционно, не выезжая из Нооката.", uni: "🎓 Bellevue College, Сиэтл" },
  { name: "Анара", from: "из Бишкека", quote: "Думала, что грантов не существует. Получила $312 000 и место в Rowan University. Главное — правильно подать.", uni: "🎓 Rowan University, Нью-Джерси" },
  { name: "Тимур", from: "из Оша — спортсмен", quote: "Спортивный грант покрыл почти всё обучение. Команда помогла собрать видео-портфолио и связаться с тренером.", uni: "🎓 Drake University, Айова" },
];

const STORY_GRID = [
  { n: "Милана", u: "Bellevue College", s: "$858 000", t: "Из Бишкека" },
  { n: "Нуржамал", u: "Saint Leo Univ.", s: "$88 000", t: "Из регионов" },
  { n: "Айпери", u: "Kalamazoo College", s: "$156 000", t: "Из регионов" },
  { n: "Эрлан", u: "Roosevelt Univ.", s: "$72 000", t: "Спортсмены" },
  { n: "Адель", u: "Drake University", s: "$204 000", t: "До 22 лет" },
  { n: "Бектур", u: "La Salle Univ.", s: "$96 000", t: "С отказом ранее" },
  { n: "Жанель", u: "UCL", s: "$48 000", t: "Из Бишкека" },
  { n: "Данияр", u: "Roosevelt Univ.", s: "$120 000", t: "25+" },
];
const STORY_FILTERS = ["Все", "Из Бишкека", "Из регионов", "До 22 лет", "25+", "Спортсмены", "С отказом ранее"];

function Stories() {
  const [idx, setIdx] = useState(0);
  const [gf, setGf] = useState("Все");
  const go = (d) => setIdx((i) => (i + d + STORY_CARDS.length) % STORY_CARDS.length);
  const grid = STORY_GRID.filter((g) => gf === "Все" || g.t === gf);

  return (
    <section className="section stories" id="stories">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Истории студентов</span>
          <h2>Они были такими же, как ты.<br/>Теперь они учатся в США.</h2>
        </div>

        {/* Carousel */}
        <div className="story-carousel" data-reveal>
          <div className="story-carousel__viewport">
            <div className="story-carousel__track" style={{ transform: `translateX(-${idx * 100}%)` }}>
              {STORY_CARDS.map((s, i) => (
                <div className="story-big" key={i}>
                  <div className="ph story-big__photo" data-label={"видео-отзыв · " + s.name}>
                    <span className="story-big__play">▶</span>
                  </div>
                  <div className="story-big__body">
                    <div className="story-big__name">{s.name}</div>
                    <div className="story-big__from">{s.from}</div>
                    <p className="story-big__quote">«{s.quote}»</p>
                    <div className="story-big__uni">{s.uni}</div>
                    <a href="#" className="story-big__video">▶ Смотреть видео-отзыв</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="story-carousel__nav">
            <button onClick={() => go(-1)} aria-label="Назад">←</button>
            <div className="story-carousel__dots">
              {STORY_CARDS.map((_, i) => (
                <button key={i} className={i === idx ? "is-on" : ""} onClick={() => setIdx(i)} aria-label={"Слайд " + (i+1)}></button>
              ))}
            </div>
            <button onClick={() => go(1)} aria-label="Вперёд">→</button>
          </div>
        </div>

        {/* Grid */}
        <div className="stories__filters" data-reveal>
          {STORY_FILTERS.map((f) => (
            <button key={f} className={"scholar__filter" + (gf === f ? " is-on" : "")} onClick={() => setGf(f)}>{f}</button>
          ))}
        </div>
        <div className="stories__grid stagger" key={gf}>
          {grid.map((g, i) => (
            <div className="sgrid card" key={g.n}>
              <div className="ph sgrid__photo" data-label={"фото · " + g.n}></div>
              <div className="sgrid__hover">
                <div className="sgrid__name">{g.n}</div>
                <div className="sgrid__uni">{g.u}</div>
                <div className="sgrid__sum">{g.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const VISAS = [
  { name: "Виза F-1 (США)", docs: "I-20, DS-160, SEVIS, паспорт", term: "3–6 недель", rate: "98%" },
  { name: "Студ. виза Италии", docs: "Acceptance letter, финансы, страховка", term: "4–8 недель", rate: "95%" },
  { name: "UK Student Visa", docs: "CAS, IELTS, финансы, TB-тест", term: "3 недели", rate: "96%" },
];

function Visas() {
  return (
    <section className="section section--tight visas" id="visas">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Визы</span>
          <h2>Виза — не проблема. Это система.</h2>
        </div>

        <div className="visas__grid">
          {VISAS.map((v, i) => (
            <article className="visa card card--lift" data-reveal data-delay={i + 1} key={v.name}>
              <h3 className="visa__name">{v.name}</h3>
              <div className="visa__row"><span>Документы</span><b>{v.docs}</b></div>
              <div className="visa__row"><span>Срок оформления</span><b>{v.term}</b></div>
              <div className="visa__rate">
                <span>Одобрений в Elite Academy</span>
                <div className="visa__rate-bar"><div style={{ width: v.rate }}></div></div>
                <b>{v.rate}</b>
              </div>
              <a href="#" className="visa__link">Подробнее →</a>
            </article>
          ))}
        </div>

        <div className="visas__trust card" data-reveal>
          <div className="visas__trust-h">Нам доверяют даже те, кому отказали раньше</div>
          <div className="visas__trust-grid">
            <div className="visas__trust-case">
              <span className="visas__trust-ic">↻</span>
              <p><b>Афтандиль</b> — получил отказ раньше → виза с 1-й попытки с нами.</p>
            </div>
            <div className="visas__trust-case">
              <span className="visas__trust-ic">↻</span>
              <p><b>Айдана</b> — неправильная DS-160 в другой компании → с нами получила с 1-й попытки.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const POSTS = [
  { cat: "Duolingo", t: "Как сдать Duolingo на 120+ баллов", time: "5 мин", date: "12 мая 2026" },
  { cat: "Виза", t: "DS-160: пошаговое заполнение без ошибок", time: "8 мин", date: "28 апр 2026" },
  { cat: "Стипендии", t: "Как получить $80 000 стипендию в США", time: "6 мин", date: "15 апр 2026" },
  { cat: "США", t: "Community colleges: дешёвый вход в топ-вузы", time: "7 мин", date: "2 апр 2026" },
  { cat: "Италия", t: "Бесплатное обучение в Италии: реально ли", time: "5 мин", date: "20 мар 2026" },
  { cat: "Жизнь", t: "Первый месяц в США: чек-лист новичка", time: "9 мин", date: "8 мар 2026" },
];
const POST_CATS = ["США","Италия","Duolingo","Виза","Стипендии","Жизнь"];

function Blog() {
  const [cat, setCat] = useState("Все");
  const list = POSTS.filter((p) => cat === "Все" || p.cat === cat);
  return (
    <section className="section blog" id="blog">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Блог</span>
          <h2>Всё, что нужно знать о поступлении</h2>
        </div>
        <div className="blog__cats" data-reveal>
          <button className={"scholar__filter" + (cat === "Все" ? " is-on" : "")} onClick={() => setCat("Все")}>Все</button>
          {POST_CATS.map((c) => (
            <button key={c} className={"scholar__filter" + (cat === c ? " is-on" : "")} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="blog__grid stagger" key={cat}>
          {list.map((p, i) => (
            <a href="#" className="post card card--lift" key={p.t}>
              <div className="ph post__cover" data-label="превью статьи"></div>
              <div className="post__body">
                <div className="post__meta"><span className="chip tag-blue">{p.cat}</span><span>{p.date} · {p.time}</span></div>
                <h3 className="post__t">{p.t}</h3>
                <span className="post__link">Читать →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className="section section--tight team" id="team">
      <div className="wrap team__grid">
        <div className="team__photo-wrap" data-reveal>
          <div className="ph team__photo" data-label="фото команды Elite Academy"></div>
        </div>
        <div className="team__content" data-reveal data-delay="1">
          <span className="eyebrow">Команда и доверие</span>
          <h2>Мы сами прошли этот путь</h2>
          <p className="team__text">Основатель Elite Academy лично прошёл через визовое интервью в посольстве США. Именно поэтому он лично проводит финальный урок с каждым студентом перед визой — и знает, какие вопросы задают на самом деле.</p>
          <div className="team__badges">
            {["ICEF Accredited","Shorelight Partner","Apply Wave"].map((b) => (
              <div className="team__badge" key={b}>
                <span className="team__badge-ic">✓</span>{b}
              </div>
            ))}
          </div>
          <a href="#cta" className="btn btn--dark">Познакомиться на консультации →</a>
        </div>
      </div>
    </section>
  );
}

window.Stories = Stories;
window.Visas = Visas;
window.Blog = Blog;
window.Team = Team;
