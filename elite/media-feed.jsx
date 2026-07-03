/* ============================================================
   MEDIA FEED — video testimonials horizontal scroll + modal
   Trilingual via _mp(ru, en, kg). `country` stays RU (country-page filter);
   display of country/tag/uni/scholarship/quote is translated.
   ============================================================ */

const _ML = (window.__EA_LANG || "ru");
const _mp = (ru, en, kg) => _ML === "en" ? en : _ML === "kg" ? kg : ru;
const _mCountry = (c) => (window.t ? window.t("country." + c) : c);

const VIDEOS_DEFAULT = [
  { name: "Элана",     country: "Италия", src: "videos/elana.mp4",     poster: "thumbs/elana.jpg",     tag: _mp("Отзыв","Review","Пикир"),    uni: "Università degli Studi di Milano", scholarship: _mp("Грант €7 000","Grant €7,000","Грант €7 000"), quote: _mp("Я всегда мечтала учиться в Европе. Elite Academy помогли с документами, языком и нашли грант. Теперь учусь в Милане!","I always dreamed of studying in Europe. Elite Academy helped with documents, language and found a grant. Now I study in Milan!","Мен ар дайым Европада окууну кыялданчумун. Elite Academy документтер, тил менен жардам берип, грант тапты. Азыр Миланда окуп жатам!") },
  { name: "Нурсултан", country: "Италия", src: "videos/nursultan.mp4", poster: "thumbs/nursultan.jpg", tag: _mp("Отзыв","Review","Пикир"),    uni: _mp("Италия · бакалавриат","Italy · bachelor’s","Италия · бакалавриат"), quote: _mp("С Elite Academy весь путь от анкеты до визы прошёл спокойно и понятно.","With Elite Academy the whole path from application to visa went smoothly and clearly.","Elite Academy менен арыздан визага чейинки бүт жол тынч жана түшүнүктүү өттү.") },
  { name: "Анель",     country: "Италия", src: "videos/anel.mp4",      poster: "thumbs/anel.jpg",      tag: _mp("Отзыв","Review","Пикир"),    uni: "Università di Roma La Sapienza", scholarship: _mp("Грант €8 000","Grant €8,000","Грант €8 000"), quote: _mp("Команда Elite Academy — профессионалы. Они знают каждый шаг и помогают на каждом этапе. Без них я бы не справилась.","The Elite Academy team are professionals. They know every step and help at every stage. Without them I wouldn’t have managed.","Elite Academy командасы — кесипкөйлөр. Алар ар бир кадамды билишет жана ар бир этапта жардам беришет. Аларсыз мен башка алмак эмесмин.") },
  { name: "Амирхан",   country: "Италия", src: "videos/amirkhan.mp4",  poster: "thumbs/amirkhan.jpg",  tag: _mp("Отзыв","Review","Пикир"),    uni: _mp("Италия · бакалавриат","Italy · bachelor’s","Италия · бакалавриат"), quote: _mp("Поступил в итальянский вуз — то, что год назад казалось нереальным.","I got into an Italian university — something that seemed unreal a year ago.","Италия вузуна тапшырдым — бир жыл мурун мүмкүн эмес окшогон нерсе.") },
  { name: "Асема",     country: "Италия", src: "videos/asema.mp4",     poster: "thumbs/asema.jpg",     tag: _mp("Отзыв","Review","Пикир"),    uni: _mp("Италия · бакалавриат","Italy · bachelor’s","Италия · бакалавриат"), quote: _mp("Помогли с мотивационным письмом и подготовкой к экзамену — всё получилось.","They helped with my motivation letter and exam prep — everything worked out.","Мотивациялык кат жана экзаменге даярдоо менен жардам беришти — баары ишке ашты.") },
  { name: "Калия",     country: "Италия", src: "videos/kaliya.mp4",    poster: "thumbs/kaliya.jpg",    tag: _mp("Отзыв","Review","Пикир"),    uni: _mp("Италия · бакалавриат","Italy · bachelor’s","Италия · бакалавриат"), quote: _mp("Спасибо команде за поддержку на каждом этапе поступления.","Thank you to the team for support at every stage of admission.","Тапшыруунун ар бир этабындагы колдоо үчүн командага рахмат.") },
  { name: "Кенжекан",  country: "Италия", src: "videos/kenzhekan.mp4", poster: "thumbs/kenzhekan.jpg", tag: _mp("Отзыв","Review","Пикир"),    uni: _mp("Италия · бакалавриат","Italy · bachelor’s","Италия · бакалавриат"), quote: _mp("Учусь в Италии — мечта стала реальностью благодаря Elite Academy.","I study in Italy — a dream come true thanks to Elite Academy.","Италияда окуп жатам — Elite Academynin аркасында кыял чындыкка айланды.") },
  { name: "Адеми",     country: "Италия", src: "videos/ademi.mp4",     poster: "thumbs/ademi.png",     tag: _mp("Отзыв","Review","Пикир"),    uni: _mp("Италия · бакалавриат","Italy · bachelor’s","Италия · бакалавриат"), quote: _mp("Поступление прошло легче, чем я думала — спасибо за чёткий план.","Admission went easier than I expected — thanks for the clear plan.","Тапшыруу мен ойлогондон жеңилирээк өттү — так план үчүн рахмат.") },
  { name: "Нурзар",    country: "США",    src: "videos/nurzar.mp4",    poster: "thumbs/nurzar.jpg",    tag: _mp("Отзыв","Review","Пикир"),    uni: "Roosevelt University, Чикаго", scholarship: "$120 000", quote: _mp("Даже не верила, что смогу поступить в США. С Elite Academy всё оказалось реально — сейчас уже второй курс!","I didn’t even believe I could get into the US. With Elite Academy it all became real — I’m already in my second year!","АКШга тапшыра аларыма ишенген да эмесмин. Elite Academy менен баары чын болду — азыр экинчи курстамын!") },
  { name: "Амир",      country: "США",    src: "videos/amir.mp4",      poster: "thumbs/amir.jpg",      tag: _mp("Отзыв","Review","Пикир"),    uni: "Bellevue College, Сиэтл", scholarship: "$95 000", quote: _mp("Elite Academy сделали процесс поступления понятным. Без них я бы потратил годы на разбор всей этой системы.","Elite Academy made the admission process clear. Without them I’d have spent years figuring out this whole system.","Elite Academy тапшыруу процессин түшүнүктүү кылды. Аларсыз мен бул системаны түшүнүүгө жылдарды коротмокмун.") },
  { name: "Исламбек",  country: "США",    src: "videos/islambek.mp4",  poster: "thumbs/islambek.jpg",  tag: _mp("Интервью","Interview","Маек"), uni: _mp("США · бакалавриат","USA · bachelor’s","АКШ · бакалавриат"), quote: _mp("Рассказываю, как поступил в США и что дало обучение за рубежом.","I share how I got into the US and what studying abroad gave me.","АКШга кантип тапшырганымды жана чет өлкөдө окуу эмне бергенин айтып берем.") },
];

const VIDEOS = window.eaContent ? window.eaContent("videos", VIDEOS_DEFAULT) : VIDEOS_DEFAULT;
window.EA_VIDEOS = VIDEOS;

/* ── Fullscreen review modal: video right, student info left ── */
function VideoModal({ item, onClose }) {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (!item) return;
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    const v = videoRef.current;
    if (v) { v.currentTime = 0; v.muted = false; v.play().catch(() => {}); }
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [item]);

  if (!item) return null;

  return (
    <div className="vmodal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${_mp("Видео-отзыв · ","Video review · ","Видео-пикир · ")}${item.name}`}>
      <div className="vmodal" onClick={(e) => e.stopPropagation()}>
        <button className="vmodal__close" onClick={onClose} aria-label={_mp("Закрыть","Close","Жабуу")}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3" y1="3" x2="17" y2="17"/><line x1="17" y1="3" x2="3" y2="17"/>
          </svg>
        </button>

        <div className="vmodal__info">
          <span className="vmodal__tag">★ {item.tag}</span>
          <h3 className="vmodal__name">{item.name}</h3>
          <p className="vmodal__uni">{item.uni}</p>
          <p className="vmodal__country">{_mCountry(item.country)}</p>

          {item.scholarship && (
            <div className="vmodal__money">
              <div className="vmodal__money-val">{item.scholarship}</div>
              <div className="vmodal__money-lab">{_mp("стипендий и грантов","in scholarships & grants","стипендия жана грант")}</div>
            </div>
          )}

          {item.quote && <blockquote className="vmodal__quote">«{item.quote}»</blockquote>}

          <a href="#cta" className="btn btn--gold vmodal__cta" onClick={onClose}>{_mp("Хочу так же — консультация →","I want the same — consultation →","Мен да ушундай каалайм — консультация →")}</a>
        </div>

        <div className="vmodal__video-wrap">
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            controls
            playsInline
            className="vmodal__video"
          />
        </div>
      </div>
    </div>
  );
}

function VideoCard({ item, onOpen }) {
  const videoRef = React.useRef(null);
  const [hovered, setHovered] = React.useState(false);
  const [loaded,  setLoaded]  = React.useState(false);
  const hoverTimer = React.useRef(null);

  function handleMouseEnter() {
    hoverTimer.current = setTimeout(() => {
      setLoaded(true);
      setHovered(true);
      const v = videoRef.current;
      if (v) { v.muted = true; v.play().catch(() => {}); }
    }, 120);
  }

  function handleMouseLeave() {
    clearTimeout(hoverTimer.current);
    setHovered(false);
    const v = videoRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
  }

  return (
    <div
      className={"vcard" + (hovered ? " vcard--hover" : "")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onOpen(item); }}
    >
      <div className="vcard__media">
        <img src={item.poster} alt={item.name} className={"vcard__thumb" + (hovered ? " vcard__thumb--hide" : "")} loading="lazy" />
        {loaded && (
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            preload="auto"
            playsInline
            muted
            loop
            className="vcard__video"
          />
        )}
        <div className="vcard__overlay">
          <div className="vcard__play-btn"><span>▶</span></div>
          {hovered && <div className="vcard__hint">{_mp("Нажми, чтобы открыть","Click to open","Ачуу үчүн бас")}</div>}
        </div>
        <span className="vcard__tag">{item.tag}</span>
      </div>
      <div className="vcard__info">
        <div className="vcard__name">{item.name}</div>
        <div className="vcard__country">{_mCountry(item.country)}</div>
      </div>
    </div>
  );
}

function MediaFeed() {
  const [active, setActive] = React.useState(null);
  return (
    <section className="section section--tight mediafeed" id="videos">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">{t("mediafeed.eyebrow")}</span>
          <h2>{t("mediafeed.h2a")}<br/><span className="text-blue">{t("mediafeed.h2b")}</span></h2>
          <p>{t("mediafeed.sub")}</p>
        </div>
      </div>
      <div className="mediafeed__scroll-wrap" data-reveal data-delay="1">
        <div className="mediafeed__rail">
          {VIDEOS.map((v, i) => <VideoCard key={i} item={v} onOpen={setActive} />)}
        </div>
      </div>
      <VideoModal item={active} onClose={() => setActive(null)} />
    </section>
  );
}

window.MediaFeed = MediaFeed;
window.VideoModal = VideoModal;
