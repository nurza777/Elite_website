/* ============================================================
   UNIVERSITIES — filter sidebar + grid + sort + save + load more
   ============================================================ */
const { useState } = React;

const UNIS = [
  { name: "Massachusetts Institute of Technology", short: "MIT", loc: "Кембридж, США", flag: "🇺🇸", qs: 1, price: 57000, type: "Частный", field: "IT", levels: "Бакалавр · Магистр · PhD" },
  { name: "Bellevue College", short: "BC", loc: "Сиэтл, США", flag: "🇺🇸", qs: 480, price: 11000, type: "Публичный", field: "Бизнес", levels: "Колледж · Бакалавр", elite: true },
  { name: "Roosevelt University", short: "RU", loc: "Чикаго, США", flag: "🇺🇸", qs: 390, price: 18500, type: "Частный", field: "Бизнес", levels: "Бакалавр · Магистр", elite: true },
  { name: "Drake University", short: "DU", loc: "Де-Мойн, США", flag: "🇺🇸", qs: 420, price: 22000, type: "Частный", field: "Право", levels: "Бакалавр · Магистр" },
  { name: "Politecnico di Milano", short: "PdM", loc: "Милан, Италия", flag: "🇮🇹", qs: 123, price: 3900, type: "Публичный", field: "Инженерия", levels: "Бакалавр · Магистр" },
  { name: "La Salle University", short: "LSU", loc: "Филадельфия, США", flag: "🇺🇸", qs: 510, price: 21000, type: "Частный", field: "Медицина", levels: "Бакалавр · Магистр", elite: true },
  { name: "Technical University of Munich", short: "TUM", loc: "Мюнхен, Германия", flag: "🇩🇪", qs: 37, price: 0, type: "Публичный", field: "Инженерия", levels: "Бакалавр · Магистр · PhD" },
  { name: "Kalamazoo College", short: "KC", loc: "Каламазу, США", flag: "🇺🇸", qs: 460, price: 19500, type: "Частный", field: "Арт", levels: "Бакалавр" },
  { name: "University College London", short: "UCL", loc: "Лондон, Великобритания", flag: "🇬🇧", qs: 9, price: 31000, type: "Публичный", field: "Право", levels: "Бакалавр · Магистр · PhD" },
];

const FIELDS = ["IT", "Бизнес", "Медицина", "Право", "Инженерия", "Арт"];
const LEVELS = ["Колледж", "Бакалавр", "Магистр", "PhD"];

function Universities() {
  const [q, setQ] = useState("");
  const [maxPrice, setMaxPrice] = useState(60000);
  const [fields, setFields] = useState([]);
  const [types, setTypes] = useState([]);
  const [sort, setSort] = useState("rating");
  const [shown, setShown] = useState(6);
  const [saved, setSaved] = useState({});

  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const reset = () => { setQ(""); setMaxPrice(60000); setFields([]); setTypes([]); };

  let list = UNIS.filter((u) =>
    (!q || u.name.toLowerCase().includes(q.toLowerCase()) || u.loc.toLowerCase().includes(q.toLowerCase())) &&
    u.price <= maxPrice &&
    (fields.length === 0 || fields.includes(u.field)) &&
    (types.length === 0 || types.includes(u.type))
  );
  list = [...list].sort((a, b) =>
    sort === "price" ? a.price - b.price : sort === "rating" ? a.qs - b.qs : (b.elite ? 1 : 0) - (a.elite ? 1 : 0)
  );

  return (
    <section className="section unis" id="universities">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Каталог</span>
          <h2>База университетов</h2>
          <p>Найдено <b>2 340</b> университетов по всему миру — отфильтруй под себя.</p>
        </div>

        <div className="unis__hot" data-reveal>Топ-5 вузов, куда поступили наши студенты в этом году — отмечены значком <span className="chip tag-gold">Elite выбор</span></div>

        <div className="unis__layout">
          {/* Filters */}
          <aside className="unis__filters card" data-reveal>
            <div className="filter">
              <label className="filter__label">Поиск по названию</label>
              <div className="filter__search">
                <svg width="16" height="16" viewBox="0 0 20 20"><circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="MIT, Милан…" />
              </div>
            </div>

            <div className="filter">
              <label className="filter__label">Стоимость в год: <b>до ${maxPrice.toLocaleString("ru")}</b></label>
              <input type="range" min="0" max="60000" step="1000" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="filter__range" />
              <div className="filter__range-ends"><span>$0</span><span>$60k</span></div>
            </div>

            <div className="filter">
              <label className="filter__label">Направление</label>
              <div className="filter__chips">
                {FIELDS.map((f) => (
                  <button key={f} className={"filter__chip" + (fields.includes(f) ? " is-on" : "")} onClick={() => toggle(fields, setFields, f)}>{f}</button>
                ))}
              </div>
            </div>

            <div className="filter">
              <label className="filter__label">Тип</label>
              <div className="filter__chips">
                {["Публичный","Частный"].map((t) => (
                  <button key={t} className={"filter__chip" + (types.includes(t) ? " is-on" : "")} onClick={() => toggle(types, setTypes, t)}>{t}</button>
                ))}
              </div>
            </div>

            <div className="filter__actions">
              <button className="btn btn--ghost" onClick={reset}>Сбросить</button>
              <button className="btn btn--blue">Применить</button>
            </div>
          </aside>

          {/* Results */}
          <div className="unis__results">
            <div className="unis__toolbar">
              <span className="unis__count">Найдено <b>{list.length}</b></span>
              <div className="unis__sort">
                <span>Сортировка:</span>
                {[["rating","по рейтингу"],["price","по цене"],["pop","по популярности"]].map(([k,l]) => (
                  <button key={k} className={sort === k ? "is-on" : ""} onClick={() => setSort(k)}>{l}</button>
                ))}
              </div>
            </div>

            <div className="unis__grid">
              {list.slice(0, shown).map((u, i) => (
                <article className="uni card card--lift" data-tilt key={i}>
                  {u.elite && <span className="uni__elite chip tag-gold">Elite выбор</span>}
                  <div className="uni__top">
                    <div className="ph uni__logo" data-label={u.short}></div>
                    <button className={"uni__save" + (saved[u.name] ? " is-on" : "")} aria-label="Сохранить" onClick={() => setSaved((s) => ({ ...s, [u.name]: !s[u.name] }))}>♡</button>
                  </div>
                  <h3 className="uni__name">{u.name}</h3>
                  <div className="uni__loc">{u.flag} {u.loc}</div>
                  <div className="uni__rows">
                    <div className="uni__row"><span>Рейтинг QS</span><b>#{u.qs}</b></div>
                    <div className="uni__row"><span>Стоимость</span><b>{u.price === 0 ? "Бесплатно" : "$" + u.price.toLocaleString("ru") + "/год"}</b></div>
                  </div>
                  <div className="uni__levels">{u.levels}</div>
                  <a href="#" className="btn btn--ghost btn--block uni__more">Подробнее →</a>
                </article>
              ))}
            </div>

            {shown < list.length ? (
              <button className="btn btn--dark unis__load" onClick={() => setShown((s) => s + 3)}>Загрузить ещё</button>
            ) : list.length === 0 ? (
              <div className="unis__empty">Ничего не нашлось — попробуй смягчить фильтры.</div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

window.Universities = Universities;
