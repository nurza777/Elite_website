/* ============================================================
   STORIES (carousel + grid) · VISAS · BLOG · TEAM
   Trilingual via _sp(ru, en, kg) selected by window.__EA_LANG.
   Student names stay as-is (proper nouns); text is translated.
   ============================================================ */
const { useState, useRef } = React;

const _SL = (window.__EA_LANG || "ru");
const _sp = (ru, en, kg) => _SL === "en" ? en : _SL === "kg" ? kg : ru;
const _sCountry = (c) => (window.t ? window.t("country." + c) : c);
const _sLevel = (l) => l === "Бакалавр" ? _sp("Бакалавр", "Bachelor’s", "Бакалавр") : l === "Магистр" ? _sp("Магистр", "Master’s", "Магистр") : l;
const _sSum = (s) => (s || "").replace("Грант", _sp("Грант", "Grant", "Грант")).replace("Стипендия", _sp("Стипендия", "Scholarship", "Стипендия"));

const STORY_CARDS_DEFAULT = [
  {
    name: "Элана",
    from: "Италия",
    quote: _sp(
      "Я всегда мечтала учиться в Европе. Elite Academy помогли с документами, языком и нашли грант. Теперь учусь в Италии!",
      "I always dreamed of studying in Europe. Elite Academy helped with documents, language and found a grant. Now I study in Italy!",
      "Мен ар дайым Европада окууну кыялданчумун. Elite Academy документтер, тил менен жардам берип, грант тапты. Азыр Италияда окуп жатам!"),
    uni: "Università degli Studi di Milano",
    videoSrc: "videos/elana.mp4",
    poster: "thumbs/elana.jpg"
  },
  {
    name: "Нурзар",
    from: "США",
    quote: _sp(
      "Даже не верила, что смогу поступить в США. С Elite Academy всё оказалось реально — сейчас уже второй курс!",
      "I didn’t even believe I could get into the US. With Elite Academy it all became real — I’m already in my second year!",
      "АКШга тапшыра аларыма ишенген да эмесмин. Elite Academy менен баары чын болду — азыр экинчи курстамын!"),
    uni: "Roosevelt University, Чикаго",
    videoSrc: "videos/nurzar.mp4",
    poster: "thumbs/nurzar.jpg"
  },
  {
    name: "Анель",
    from: "Италия",
    quote: _sp(
      "Команда Elite Academy — профессионалы. Они знают каждый шаг и помогают на каждом этапе. Без них я бы не справилась.",
      "The Elite Academy team are professionals. They know every step and help at every stage. Without them I wouldn’t have managed.",
      "Elite Academy командасы — кесипкөйлөр. Алар ар бир кадамды билишет жана ар бир этапта жардам беришет. Аларсыз мен башка алмак эмесмин."),
    uni: "Università di Roma",
    videoSrc: "videos/anel.mp4",
    poster: "thumbs/anel.jpg"
  },
];

const STORY_GRID_DEFAULT = [
  { n: "Элана",     u: "Università degli Studi di Milano", s: "Грант + €7 000",   t: "Италия", level: "Бакалавр", video: "videos/elana.mp4",     poster: "thumbs/elana.jpg"     },
  { n: "Нурсултан", u: "Università di Bologna",            s: "Грант + €6 500",   t: "Италия", level: "Бакалавр", video: "videos/nursultan.mp4", poster: "thumbs/nursultan.jpg" },
  { n: "Анель",     u: "Università di Roma La Sapienza",   s: "Грант + €8 000",   t: "Италия", level: "Магистр",  video: "videos/anel.mp4",      poster: "thumbs/anel.jpg"      },
  { n: "Амирхан",   u: "Politecnico di Milano",            s: "Грант + €9 000",   t: "Италия", level: "Магистр",  video: "videos/amirkhan.mp4",  poster: "thumbs/amirkhan.jpg"  },
  { n: "Асема",     u: "Università di Torino",             s: "Стипендия €5 000", t: "Италия", level: "Бакалавр", video: "videos/asema.mp4",     poster: "thumbs/asema.jpg"     },
  { n: "Калия",     u: "Università di Napoli Federico II", s: "Стипендия €4 500", t: "Италия", level: "Бакалавр", video: "videos/kaliya.mp4",    poster: "thumbs/kaliya.jpg"    },
  { n: "Нурзар",    u: "Roosevelt University, Чикаго",     s: "$120 000",          t: "США",    level: "Бакалавр", video: "videos/nurzar.mp4",    poster: "thumbs/nurzar.jpg"    },
  { n: "Амир",      u: "Bellevue College",                 s: "$95 000",           t: "США",    level: "Бакалавр", video: "videos/amir.mp4",      poster: "thumbs/amir.jpg"      },
  { n: "Исламбек",  u: "La Salle University",              s: "$88 000",           t: "США",    level: "Бакалавр", video: "videos/islambek.mp4",  poster: "thumbs/islambek.jpg"  },
  { n: "Кенжекан",  u: "Università di Padova",             s: "Грант + €7 500",   t: "Италия", level: "Магистр",  video: "videos/kenzhekan.mp4", poster: "thumbs/kenzhekan.jpg" },
  { n: "Абубакир",  u: "",                                 s: "",                  t: "США",    level: "Бакалавр", video: "videos/abubakir.mp4",  poster: "thumbs/abubakir.jpg"  },
  { n: "Автандиль", u: "Alfred University",               s: "$30 000",           t: "США",    level: "Бакалавр", video: "videos/avtandil.mp4",  poster: "thumbs/avtandil.jpg"  },
  { n: "Азирет",    u: "Lasell University",               s: "$20 000",           t: "США",    level: "Бакалавр", video: "videos/aziret.mp4",    poster: "thumbs/aziret.jpg"    },
  { n: "Аида",      u: "",                                 s: "",                  t: "США",    level: "Бакалавр", video: "videos/aida.mp4",      poster: "thumbs/aida.jpg"      },
  { n: "Айзада",    u: "University of Missouri",          s: "",                  t: "США",    level: "Бакалавр", video: "videos/aizada.mp4",    poster: "thumbs/aizada.jpg"    },
  { n: "Алтынай",   u: "Rowan University",               s: "$19 000",           t: "США",    level: "Бакалавр", video: "videos/altynay.mp4",   poster: "thumbs/altynay.jpg"   },
  { n: "Нурдамир",  u: "Rowan University",               s: "$30 000+",          t: "США",    level: "Бакалавр", video: "videos/nurdam.mp4",    poster: "thumbs/nurdam.jpg"    },
  { n: "Сардор",    u: "Saint Leo University",           s: "",                  t: "США",    level: "Бакалавр", video: "videos/sardor.mp4",    poster: "thumbs/sardor.jpg"    },
  { n: "Жаркынай",  u: "",                                s: "",                  t: "США",    level: "Бакалавр", video: "videos/zharkynai.mp4", poster: "thumbs/zharkynai.jpg" },
  { n: "Аянат",     u: "",                                s: "",                  t: "США",    level: "Бакалавр", video: null,                   poster: "thumbs/ayanat.jpg"    },
  { n: "Мадина",    u: "",                                s: "",                  t: "США",    level: "Бакалавр", video: null,                   poster: "thumbs/madina.jpg"    },
  { n: "Кыял",      u: "",                                s: "",                  t: "США",    level: "Бакалавр", video: null,                   poster: "thumbs/kyal.jpg"      },
];

/* Admin-edited content wins over the defaults above */
const STORY_CARDS = window.eaContent ? window.eaContent("storyCards", STORY_CARDS_DEFAULT) : STORY_CARDS_DEFAULT;
const STORY_GRID  = window.eaContent ? window.eaContent("storyGrid",  STORY_GRID_DEFAULT)  : STORY_GRID_DEFAULT;
window.EA_STORY_CARDS = STORY_CARDS;
window.EA_STORY_GRID = STORY_GRID;
const STORY_FILTERS = ["Все", ...new Set(STORY_GRID.map((g) => g.t))];

function SgridCard({ g, onClick }) {
  return (
    <div className="sgrid card" onClick={g.video ? onClick : undefined}
      style={g.video ? { cursor: "pointer" } : undefined}>
      <div className="sgrid__thumb">
        {g.poster
          ? <img src={g.poster} alt={g.n} className="sgrid__img" loading="lazy" />
          : <div className="ph sgrid__img" data-label={(window.t ? window.t("uni.photoOf") : "фото · ") + g.n} style={{ height: "100%" }}></div>
        }
        {g.video && (
          <span className="sgrid__play" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M5 3.5v9l7-4.5z"/></svg>
          </span>
        )}
      </div>
      <div className="sgrid__info">
        <div className="sgrid__name">{g.n}</div>
        <div className="sgrid__uni">{g.u}</div>
        <div className="sgrid__meta">
          {g.t && <span className="chip">{_sCountry(g.t)}</span>}
          {g.level && <span className="chip tag-blue">{_sLevel(g.level)}</span>}
        </div>
        <div className="sgrid__sum">{_sSum(g.s)}</div>
      </div>
    </div>
  );
}

function StorySlide({ s }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }

  return (
    <div className="story-big">
      <div className="story-big__photo story-big__photo--video" onClick={handlePlay}>
        <video ref={videoRef} src={s.videoSrc} poster={s.poster} preload="none" playsInline className="story-big__video-bg" />
        {!playing && <span className="story-big__play">▶</span>}
      </div>
      <div className="story-big__body">
        <div className="story-big__name">{s.name}</div>
        <div className="story-big__from">{_sCountry(s.from)}</div>
        <p className="story-big__quote">«{s.quote}»</p>
        <div className="story-big__uni">{s.uni}</div>
      </div>
    </div>
  );
}

function Stories() {
  const [gf, setGf] = useState("Все");
  const [activeVid, setActiveVid] = useState(null);
  const grid = STORY_GRID.filter((g) => gf === "Все" || g.t === gf);
  const VideoModal = window.VideoModal;

  return (
    <section className="section stories" id="stories">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{_sp("Наши студенты", "Our students", "Биздин студенттер")}</span>
          <h2>{_sp("Они были такими же, как ты.", "They were just like you.", "Алар дал сендей эле болушкан.")}<br/><span className="text-blue">{_sp("Теперь учатся за рубежом.", "Now they study abroad.", "Азыр чет өлкөдө окушат.")}</span></h2>
        </div>

        {/* Grid */}
        <div className="stories__filters" data-reveal>
          {STORY_FILTERS.map((f) => (
            <button key={f} className={"scholar__filter" + (gf === f ? " is-on" : "")} onClick={() => setGf(f)}>{f === "Все" ? _sp("Все", "All", "Баары") : _sCountry(f)}</button>
          ))}
        </div>
        <div className="stories__grid stagger" key={gf}>
          {grid.map((g) => (
            <SgridCard key={g.n} g={g}
              onClick={() => setActiveVid({ src: g.video, poster: g.poster, name: g.n, uni: g.u, country: g.t, scholarship: g.s, tag: g.level || _sp("Отзыв", "Review", "Пикир") })}
            />
          ))}
        </div>
      {VideoModal && <VideoModal item={activeVid} onClose={() => setActiveVid(null)} />}
      </div>
    </section>
  );
}

const VISAS = [
  { name: _sp("Виза F-1 (США)", "F-1 Visa (USA)", "F-1 визасы (АКШ)"), docs: _sp("I-20, DS-160, SEVIS, паспорт", "I-20, DS-160, SEVIS, passport", "I-20, DS-160, SEVIS, паспорт"), term: _sp("3–6 недель", "3–6 weeks", "3–6 жума"), rate: "100%" },
  { name: _sp("Студ. виза Италии", "Italy student visa", "Италиянын студ. визасы"), docs: _sp("Acceptance letter, финансы, страховка", "Acceptance letter, finances, insurance", "Acceptance letter, каржы, камсыздандыруу"), term: _sp("4–8 недель", "4–8 weeks", "4–8 жума"), rate: "100%" },
  { name: _sp("Студ. виза Германии", "Germany student visa", "Германиянын студ. визасы"), docs: _sp("Acceptance letter, финансы, страховка, языковой тест", "Acceptance letter, finances, insurance, language test", "Acceptance letter, каржы, камсыздандыруу, тил тести"), term: _sp("4–8 недель", "4–8 weeks", "4–8 жума"), rate: "100%" },
];

function Visas() {
  return (
    <section className="section section--tight visas" id="visas">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{_sp("Визы", "Visas", "Визалар")}</span>
          <h2>{_sp("Виза — не проблема. Это система.", "A visa isn’t a problem. It’s a system.", "Виза — көйгөй эмес. Бул система.")}</h2>
        </div>

        <div className="visas__grid">
          {VISAS.map((v, i) => (
            <article className="visa card card--lift" data-reveal data-delay={i + 1} key={v.name}>
              <h3 className="visa__name">{v.name}</h3>
              <div className="visa__row"><span>{_sp("Документы", "Documents", "Документтер")}</span><b>{v.docs}</b></div>
              <div className="visa__row"><span>{_sp("Срок оформления", "Processing time", "Даярдоо мөөнөтү")}</span><b>{v.term}</b></div>
              <div className="visa__rate">
                <span>{_sp("Одобрений в Elite Academy", "Approval rate at Elite Academy", "Elite Academyде жактыруу")}</span>
                <div className="visa__rate-bar"><div style={{ width: v.rate }}></div></div>
                <b>{v.rate}</b>
              </div>
              <a href="#" className="visa__link">{_sp("Подробнее →", "Learn more →", "Толугураак →")}</a>
            </article>
          ))}
        </div>

        <div className="visas__trust card" data-reveal>
          <div className="visas__trust-h">{_sp("Нам доверяют даже те, кому отказали раньше", "Even those refused before trust us", "Мурда баш тартылгандар да бизге ишенет")}</div>
          <div className="visas__trust-grid">
            <div className="visas__trust-case">
              <span className="visas__trust-ic">↻</span>
              <p>{_sp(<><b>Афтандиль</b> — получил отказ раньше → виза с 1-й попытки с нами.</>, <><b>Aftandil</b> — refused before → visa on the first try with us.</>, <><b>Афтандиль</b> — мурда баш тартылган → биз менен 1-аракетте виза.</>)}</p>
            </div>
            <div className="visas__trust-case">
              <span className="visas__trust-ic">↻</span>
              <p>{_sp(<><b>Айдана</b> — неправильная DS-160 в другой компании → с нами получила с 1-й попытки.</>, <><b>Aidana</b> — a wrong DS-160 at another company → got it with us on the first try.</>, <><b>Айдана</b> — башка компанияда туура эмес DS-160 → биз менен 1-аракетте алды.</>)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const POSTS_DEFAULT = [
  { cat: _sp("Duolingo", "Duolingo", "Duolingo"), t: _sp("Как сдать Duolingo на 120+ баллов", "How to score 120+ on Duolingo", "Duolingoдон 120+ упай кантип алуу"), time: _sp("5 мин", "5 min", "5 мүн"), date: _sp("12 мая 2026", "May 12, 2026", "2026-жыл 12-май") },
  { cat: _sp("Виза", "Visa", "Виза"), t: _sp("DS-160: пошаговое заполнение без ошибок", "DS-160: step-by-step filling without mistakes", "DS-160: катасыз кадам-кадам толтуруу"), time: _sp("8 мин", "8 min", "8 мүн"), date: _sp("28 апр 2026", "Apr 28, 2026", "2026-жыл 28-апр") },
  { cat: _sp("Стипендии", "Scholarships", "Стипендиялар"), t: _sp("Как получить $80 000 стипендию в США", "How to get an $80,000 scholarship in the US", "АКШда $80 000 стипендияны кантип алуу"), time: _sp("6 мин", "6 min", "6 мүн"), date: _sp("15 апр 2026", "Apr 15, 2026", "2026-жыл 15-апр") },
  { cat: _sp("США", "USA", "АКШ"), t: _sp("Community colleges: дешёвый вход в топ-вузы", "Community colleges: a cheap way into top universities", "Community college'дор: топ вуздарга арзан кирүү"), time: _sp("7 мин", "7 min", "7 мүн"), date: _sp("2 апр 2026", "Apr 2, 2026", "2026-жыл 2-апр") },
  { cat: _sp("Италия", "Italy", "Италия"), t: _sp("Бесплатное обучение в Италии: реально ли", "Free study in Italy: is it real?", "Италияда акысыз окуу: чынбы"), time: _sp("5 мин", "5 min", "5 мүн"), date: _sp("20 мар 2026", "Mar 20, 2026", "2026-жыл 20-мар") },
  { cat: _sp("Жизнь", "Life", "Жашоо"), t: _sp("Первый месяц в США: чек-лист новичка", "Your first month in the US: a newcomer’s checklist", "АКШдагы биринчи ай: жаңы келгендин чек-баракчасы"), time: _sp("9 мин", "9 min", "9 мүн"), date: _sp("8 мар 2026", "Mar 8, 2026", "2026-жыл 8-мар") },
];

/* Admin-edited content wins over the defaults above */
const POSTS = window.eaContent ? window.eaContent("posts", POSTS_DEFAULT) : POSTS_DEFAULT;
window.EA_POSTS = POSTS;
const POST_CATS = [...new Set(POSTS.map((p) => p.cat))];
const _ALL = _sp("Все", "All", "Баары");

function Blog() {
  const [cat, setCat] = useState(_ALL);
  const list = POSTS.filter((p) => cat === _ALL || p.cat === cat);
  return (
    <section className="section blog" id="blog">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{_sp("Блог", "Blog", "Блог")}</span>
          <h2>{_sp("Всё, что нужно знать о поступлении", "Everything you need to know about admission", "Тапшыруу жөнүндө билүү керек болгон баары")}</h2>
        </div>
        <div className="blog__cats" data-reveal>
          <button className={"scholar__filter" + (cat === _ALL ? " is-on" : "")} onClick={() => setCat(_ALL)}>{_ALL}</button>
          {POST_CATS.map((c) => (
            <button key={c} className={"scholar__filter" + (cat === c ? " is-on" : "")} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="blog__grid stagger" key={cat}>
          {list.map((p, i) => (
            <a href="#" className="post card card--lift" key={p.t}>
              {p.cover
                ? <img src={p.cover} alt={p.t} className="post__cover" loading="lazy" />
                : <div className="ph post__cover" data-label={_sp("превью статьи", "article preview", "макаланын алдын ала көрүнүшү")}></div>
              }
              <div className="post__body">
                <div className="post__meta"><span className="chip tag-blue">{p.cat}</span><span>{p.date} · {p.time}</span></div>
                <h3 className="post__t">{p.t}</h3>
                <span className="post__link">{_sp("Читать →", "Read →", "Окуу →")}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const TEAM_DEFAULT = {
  text: _sp(
    "Наши сотрудники сами учились за рубежом — и понимают каждый страх, каждую бумагу и каждый нюанс изнутри. Основатель Elite Academy лично прошёл визовое интервью в посольстве США и сам поступил в американский университет. Именно поэтому он лично проводит финальный урок перед каждым визовым интервью — и знает, какие вопросы задают на самом деле.",
    "Our staff studied abroad themselves — and understand every fear, every document and every nuance from the inside. Elite Academy’s founder personally went through a visa interview at the US embassy and enrolled in an American university himself. That’s why he personally runs the final lesson before every visa interview — and knows what questions are really asked.",
    "Биздин кызматкерлер өздөрү чет өлкөдө окушкан — жана ар бир коркунучту, ар бир кагазды жана ар бир нюансты ичинен түшүнүшөт. Elite Academynin негиздөөчүсү АКШ элчилигинде виза интервьюсунан өзү өтүп, америкалык университетке өзү тапшырган. Ошондуктан ал ар бир виза интервьюсунун алдында акыркы сабакты өзү өткөрөт — жана чын эле кандай суроолор берилерин билет."),
  badges: ["ICEF Accredited", "Shorelight Partner", "Apply Wave"],
  photo: "",
};
const TEAM = window.eaContent ? window.eaContent("team", TEAM_DEFAULT) : TEAM_DEFAULT;
window.EA_TEAM = TEAM;

function Team() {
  return (
    <section className="section section--tight team" id="team">
      <div className="wrap team__grid">
        <div className="team__photo-wrap" data-reveal>
          <img src={TEAM.photo || "images/team.jpg"} alt={_sp("Команда Elite Academy", "Elite Academy team", "Elite Academy командасы")} className="team__photo"
            onError={e => {
              const d = document.createElement("div");
              d.className = "ph team__photo";
              d.dataset.label = _sp("фото команды Elite Academy", "Elite Academy team photo", "Elite Academy командасынын сүрөтү");
              e.currentTarget.parentNode.replaceChild(d, e.currentTarget);
            }}
          />
        </div>
        <div className="team__content" data-reveal data-delay="1">
          <span className="eyebrow">{_sp("Состав Elite", "The Elite team", "Elite курамы")}</span>
          <h2>{_sp("Мы сами прошли этот путь", "We’ve walked this path ourselves", "Биз бул жолдон өзүбүз өткөнбүз")}</h2>
          <p className="team__text">{TEAM.text}</p>
          <div className="team__badges">
            {TEAM.badges.map((b) => (
              <div className="team__badge" key={b}>
                <span className="team__badge-ic">✓</span>{b}
              </div>
            ))}
          </div>
          <a href="#cta" className="btn btn--dark">{_sp("Познакомиться на консультации →", "Meet us at a consultation →", "Консультацияда таанышуу →")}</a>
        </div>
      </div>
    </section>
  );
}

window.Stories = Stories;
window.Visas = Visas;
window.Blog = Blog;
window.Team = Team;
