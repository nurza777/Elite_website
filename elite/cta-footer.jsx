/* ============================================================
   FINAL CTA (positive vs loss) + FOOTER
   ============================================================ */
const { useState, useEffect, useRef } = React;
const LEADS_URL = "https://script.google.com/macros/s/AKfycbw4i67Vtu9cMUjZvXxVCZ0ZdeDndAG2GqY0eS7PznuBGxZeG4PkwHbe8xN-RAoa35BW/exec";
const FOOTER_MAP_COORDS = [74.590385, 42.843700];
const FOOTER_DGIS_KEY   = "de8b758a-a208-4a05-9f30-25eb492f4364";

function FooterMap() {
  const mapRef  = useRef(null);
  const mapInst = useRef(null);
  useEffect(() => {
    if (mapInst.current || !mapRef.current) return;
    function init() {
      mapInst.current = new window.mapgl.Map(mapRef.current, {
        center: FOOTER_MAP_COORDS, zoom: 16, key: FOOTER_DGIS_KEY, lang: "ru",
      });
      new window.mapgl.Marker(mapInst.current, { coordinates: FOOTER_MAP_COORDS });
    }
    if (window.mapgl) { init(); }
    else {
      const s = document.createElement("script");
      s.src = "https://mapgl.2gis.com/api/js/v1";
      s.onload = init;
      document.head.appendChild(s);
    }
    return () => { if (mapInst.current) { mapInst.current.destroy(); mapInst.current = null; } };
  }, []);
  return <div ref={mapRef} className="footer__map"></div>;
}

function FinalCTA() {
  const [sent, setSent]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge]     = useState("");
  const [city, setCity]   = useState("");
  const [dest, setDest]   = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const payload = {
      name, phone: phone.replace(/^\+/, '').replace('(', '-').replace(')', ''), age, city, dest,
      page: location.pathname.split("/").pop() || "index.html",
      time: new Date().toLocaleString("ru"),
      ...(window.getUTM ? window.getUTM() : {}),
    };
    try {
      await fetch(LEADS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });
    } catch (_) {}
    setBusy(false);
    setSent(true);
  }

  return (
    <section className="section dark grain finalcta" id="cta">
      <div className="finalcta__mesh" aria-hidden="true"></div>
      <div className="wrap finalcta__inner">
        <div className="finalcta__head" data-reveal>
          <span className="eyebrow eyebrow--light">{t("cta.eyebrow")}</span>
          <h2>{t("cta.h2").split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br/>}</span>)}</h2>
        </div>

        <div className="finalcta__grid">
          <div className="finalcta__pitches" data-reveal>
            <div className="pitch pitch--good">
              <div className="pitch__ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              <div>
                <h3 className="pitch__t">{t("cta.pitch1Title")}</h3>
                <p>{t("cta.pitch1Text")}</p>
              </div>
            </div>
            <div className="pitch pitch--loss">
              <div className="pitch__ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <h3 className="pitch__t">{t("cta.pitch2Title")}</h3>
                <p>{t("cta.pitch2Text")}</p>
              </div>
            </div>
            <div className="finalcta__guarantee">
              <span>✓</span> {t("cta.guarantee")}
            </div>
          </div>

          <div className="finalcta__form-wrap card" data-reveal data-delay="1">
            {!sent ? (
              <>
                <h3 className="finalcta__form-t">{t("cta.formTitle")}</h3>
                <p className="finalcta__form-sub">{t("cta.formSub")}</p>
                <form className="finalcta__form" onSubmit={handleSubmit}>
                  <input required placeholder={t("cta.namePlaceholder")} value={name} onChange={e => setName(e.target.value)} />
                  <input required placeholder="+996(___)-___-___" inputMode="tel" value={phone} onChange={e => {
                    let d = e.target.value.replace(/\D/g,'');
                    if (d.startsWith('996')) d = d.slice(3);
                    d = d.slice(0,9);
                    if (!d) { setPhone(''); return; }
                    let f = '+996(';
                    if (d.length <= 3) f += d;
                    else if (d.length <= 6) f += d.slice(0,3) + ')-' + d.slice(3);
                    else f += d.slice(0,3) + ')-' + d.slice(3,6) + '-' + d.slice(6);
                    setPhone(f);
                  }} />
                  <input type="number" min="14" max="60" required placeholder={window.__EA_LANG === "en" ? "Your age" : window.__EA_LANG === "kg" ? "Жашыңыз" : "Ваш возраст"} value={age} onChange={e => setAge(e.target.value)} />
                  <input required placeholder={t("cta.cityPlaceholder")} value={city} onChange={e => setCity(e.target.value)} />
                  <select required value={dest} onChange={e => setDest(e.target.value)}>
                    <option value="" disabled>{t("cta.destPlaceholder")}</option>
                    <option>{t("cta.dest.usa")}</option>
                    <option>{t("cta.dest.italy")}</option>
                    <option>{t("cta.dest.germany")}</option>
                    <option>{t("cta.dest.poland")}</option>
                    <option>{t("cta.dest.malaysia")}</option>
                    <option>{t("cta.dest.austria")}</option>
                    <option>{t("cta.dest.nCyprus")}</option>
                    <option>{t("cta.dest.undecided")}</option>
                  </select>
                  <button type="submit" className="btn btn--gold btn--block btn--lg" disabled={busy}>{busy ? t("cta.btnSending") : t("cta.btnSubmit")}</button>
                </form>
                <div className="finalcta__micro">
                  <span>{t("cta.micro1")}</span><span>{t("cta.micro2")}</span><span>{t("cta.micro3")}</span>
                </div>
              </>
            ) : (
              <div className="finalcta__sent">
                <div className="finalcta__sent-ic">✓</div>
                <h3>{t("cta.sentTitle")}</h3>
                <p>{t("cta.sentText")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const FOOT_DIR = [
  { key: "footer.dir.usa",       href: "country.html?c=США" },
  { key: "footer.dir.italy",     href: "country.html?c=Италия" },
  { key: "footer.dir.uk",        href: "#" },
  { key: "footer.dir.germany",   href: "country.html?c=Германия" },
  { key: "footer.dir.canada",    href: "#" },
  { key: "footer.dir.australia", href: "#" },
];
const FOOT_SRV = [
  "footer.srv.search",
  "footer.srv.assess",
  "footer.srv.duolingo",
  "footer.srv.visa",
  "footer.srv.scholar",
];

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p className="footer__about">{t("footer.about")}</p>
          <div className="footer__socials">
            <a href="https://www.instagram.com/eliteacademy.kg" className="footer__social" aria-label="Instagram" target="_blank" rel="noopener">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://www.tiktok.com/@eliteacademy.kg" className="footer__social" aria-label="TikTok" target="_blank" rel="noopener">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.01a8.16 8.16 0 0 0 4.77 1.52V7.09a4.85 4.85 0 0 1-1.01-.4z"/></svg>
            </a>
            <a href="https://t.me/eliteacademykg" className="footer__social" aria-label="Telegram" target="_blank" rel="noopener">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </div>

        <div className="footer__col">
          <div className="footer__h">{t("footer.directions")}</div>
          {FOOT_DIR.map((d) => <a key={d.key} href={d.href}>{t(d.key)}</a>)}
          <a href="countries.html" className="footer__all">{t("footer.allCountries")}</a>
        </div>

        <div className="footer__col">
          <div className="footer__h">{t("footer.services")}</div>
          {FOOT_SRV.map((s) => <a key={s} href="#">{t(s)}</a>)}
        </div>

        <div className="footer__col footer__contacts">
          <div className="footer__h">{t("footer.contacts")}</div>
          <div className="footer__contact">{window.__EA_LANG === "en" ? "Bishkek, 169 Isy Akhunbaeva St, Binokl BC, 6th floor" : window.__EA_LANG === "kg" ? "Бишкек ш., Иса Ахунбаев көчөсү 169, «Бинокль» ББ, 6-кабат" : "г. Бишкек, ул. Исы Ахунбаева 169, БЦ «Бинокль», 6 этаж"}</div>
          <a href="tel:+996555720712" className="footer__contact">+996 555 720 712</a>
          <a href="mailto:eliteacademykg@gmail.com" className="footer__contact">eliteacademykg@gmail.com</a>
          <div className="footer__contact">{t("footer.hours")}</div>
          <FooterMap />
        </div>
      </div>
      <div className="footer__bottom wrap">
        <span>{t("footer.copyright")}</span>
        <div className="footer__legal"><a href="#">{t("footer.privacy")}</a><a href="#">{t("footer.terms")}</a></div>
      </div>
    </footer>
  );
}

window.FinalCTA = FinalCTA;
window.Footer = Footer;
