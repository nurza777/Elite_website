/* ============================================================
   MEDIA FEED — video testimonials horizontal scroll
   ============================================================ */

const VIDEOS_DEFAULT = [
  { name: "Элана",     country: "Италия", src: "videos/elana.mp4",     poster: "thumbs/elana.jpg",     tag: "Отзыв"    },
  { name: "Нурсултан", country: "Италия", src: "videos/nursultan.mp4", poster: "thumbs/nursultan.jpg", tag: "Отзыв"    },
  { name: "Анель",     country: "Италия", src: "videos/anel.mp4",      poster: "thumbs/anel.jpg",      tag: "Отзыв"    },
  { name: "Амирхан",   country: "Италия", src: "videos/amirkhan.mp4",  poster: "thumbs/amirkhan.jpg",  tag: "Отзыв"    },
  { name: "Асема",     country: "Италия", src: "videos/asema.mp4",     poster: "thumbs/asema.jpg",     tag: "Отзыв"    },
  { name: "Калия",     country: "Италия", src: "videos/kaliya.mp4",    poster: "thumbs/kaliya.jpg",    tag: "Отзыв"    },
  { name: "Кенжекан",  country: "Италия", src: "videos/kenzhekan.mp4", poster: "thumbs/kenzhekan.jpg", tag: "Отзыв"    },
  { name: "Адеми",     country: "Италия", src: "videos/ademi.mp4",     poster: "thumbs/ademi.png",     tag: "Отзыв"    },
  { name: "Нурзар",    country: "США",    src: "videos/nurzar.mp4",    poster: "thumbs/nurzar.jpg",    tag: "Отзыв"    },
  { name: "Амир",      country: "США",    src: "videos/amir.mp4",      poster: "thumbs/amir.jpg",      tag: "Отзыв"    },
  { name: "Исламбек",  country: "США",    src: "videos/islambek.mp4",  poster: "thumbs/islambek.jpg",  tag: "Интервью" },
];

const VIDEOS = window.eaContent ? window.eaContent("videos", VIDEOS_DEFAULT) : VIDEOS_DEFAULT;
window.EA_VIDEOS = VIDEOS;

function VideoCard({ item }) {
  const videoRef = React.useRef(null);
  const [hovered, setHovered]   = React.useState(false);
  const [playing, setPlaying]   = React.useState(false);
  const [muted,   setMuted]     = React.useState(true);
  const [loaded,  setLoaded]    = React.useState(false);
  const hoverTimer = React.useRef(null);

  function handleMouseEnter() {
    hoverTimer.current = setTimeout(() => {
      setLoaded(true);
      setHovered(true);
      const v = videoRef.current;
      if (v) {
        v.muted = true;
        v.play().catch(() => {});
        setPlaying(true);
        setMuted(true);
      }
    }, 120);
  }

  function handleMouseLeave() {
    clearTimeout(hoverTimer.current);
    setHovered(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    setPlaying(false);
    setMuted(true);
  }

  function handleClick(e) {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (muted) {
      v.muted = false;
      setMuted(false);
      if (v.paused) { v.play().catch(() => {}); setPlaying(true); }
    } else {
      if (v.paused) { v.play().catch(() => {}); setPlaying(true); }
      else { v.pause(); setPlaying(false); }
    }
  }

  const showPlay  = !playing || muted;
  const playLabel = !loaded || !playing ? "▶" : muted ? "🔊" : "⏸";

  return (
    <div
      className={"vcard" + (hovered ? " vcard--hover" : "") + (playing && !muted ? " vcard--active" : "")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
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
          <div className="vcard__play-btn">
            <span>{playLabel}</span>
          </div>
          {hovered && muted && (
            <div className="vcard__hint">Нажми для звука</div>
          )}
        </div>
        <span className="vcard__tag">{item.tag}</span>
        <div className="vcard__footer">
          <div className="vcard__name">{item.name}</div>
          <div className="vcard__country">{item.country}</div>
        </div>
      </div>
      <div className="vcard__info">
        <div className="vcard__name">{item.name}</div>
        <div className="vcard__country">{item.country}</div>
      </div>
    </div>
  );
}

function MediaFeed() {
  return (
    <section className="section section--tight mediafeed" id="videos">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Живые отзывы</span>
          <h2>Они уже учатся за рубежом.<br/><span className="text-blue">Смотри и убеждайся.</span></h2>
          <p>Реальные видео-отзывы наших студентов из Италии и США — без монтажа и сценариев.</p>
        </div>
      </div>
      <div className="mediafeed__scroll-wrap" data-reveal data-delay="1">
        <div className="mediafeed__rail">
          {VIDEOS.map((v, i) => <VideoCard key={i} item={v} />)}
        </div>
      </div>
    </section>
  );
}

window.MediaFeed = MediaFeed;
