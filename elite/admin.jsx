/* ============================================================
   ADMIN PANEL — admin.html
   Edits all site content: universities (+descriptions),
   countries (cards + profile pages), stories, videos, blog.
   Draft is stored in localStorage ("ea_content_v1") — instantly
   visible on the site in THIS browser. "Экспорт" downloads
   elite/content-data.js — replace the file to publish for everyone.

   Default password: elite2026
   To change it: run in any browser console
     crypto.subtle.digest("SHA-256", new TextEncoder().encode("НОВЫЙ_ПАРОЛЬ"))
       .then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")))
   and put the result into PASS_SHA256 below.
   ============================================================ */
const { useState, useEffect, useMemo, useRef } = React;

const LS_KEY = "ea_content_v1";
const SESSION_KEY = "ea_admin_ok";
const GH_TOKEN_KEY = "ea_gh_token";
const GH_BRANCH_KEY = "ea_gh_branch";
const GH_OWNER = "nurza777";
const GH_REPO = "Elite_website";
const GH_PATH = "elite/content-data.js";
const PASS_SHA256 = "132694353effb245b819fb7e2c0de5a0f66143f69a082d40e28367286557eb04";
const PASS_DJB2 = "3b742bc2"; // fallback when crypto.subtle is unavailable (plain http)

const FLAGS = { "Италия": "🇮🇹", "США": "🇺🇸", "Северный Кипр": "🇨🇾", "Малайзия": "🇲🇾", "Германия": "🇩🇪", "Польша": "🇵🇱", "Австрия": "🇦🇹" };
const COUNTRY_OPTS = Object.keys(FLAGS);
const FIELD_OPTS = ["IT", "Бизнес", "Медицина", "Право", "Инженерия", "Дизайн", "Экономика", "Педагогика"];
const TYPE_OPTS = ["Государственный", "Частный"];
/* Уровень, на который поступил студент («Истории»). Пустое = не показывать бейдж */
const LEVEL_OPTS = ["", "Бакалавр", "Магистр", "Foundation"];

const clone = (x) => JSON.parse(JSON.stringify(x));

function djb2(s) { let h = 5381; for (let i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; } return h.toString(16); }
async function checkPass(p) {
  if (window.crypto && crypto.subtle) {
    try {
      const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(p));
      return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("") === PASS_SHA256;
    } catch (e) { /* fall through */ }
  }
  return djb2(p) === PASS_DJB2;
}

/* ---------- GitHub one-click publish ---------- */
function utf8b64(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  const CH = 0x8000;
  for (let i = 0; i < bytes.length; i += CH) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
  }
  return btoa(bin);
}

function contentFileText(content) {
  return "/* ============================================================\n" +
    "   PUBLISHED CONTENT — published from admin.html\n" +
    "   " + new Date().toLocaleString("ru") + "\n" +
    "   ============================================================ */\n" +
    "window.EA_CONTENT_PUBLISHED = " + JSON.stringify(content, null, 2) + ";\n";
}

async function ghPublish(token, branch, fileText, expectedSha) {
  const api = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_PATH}`;
  const headers = {
    Authorization: "Bearer " + token,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
  let sha = null;
  const g = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers });
  if (g.status === 200) sha = (await g.json()).sha;
  else if (g.status === 401) throw new Error("Неверный ключ доступа (token). Проверь в «Публикации».");
  else if (g.status !== 404) throw new Error("GitHub: ошибка " + g.status);
  /* Кто-то публиковал после того, как эта админка была открыта: публикация
     перезапишет его правки нашей (устаревшей) копией всего контента. */
  if (expectedSha && sha && sha !== expectedSha &&
      !window.confirm("⚠️ Пока админка была открыта, контент уже публиковали (видимо, коллега).\n\nЕсли продолжить — ЕГО правки будут перезаписаны твоей копией.\nЕсли не уверен — нажми «Отмена», согласуй с коллегой, обнови страницу и внеси правки заново.\n\nВсё равно опубликовать?")) {
    throw new Error("Публикация отменена — контент менялся параллельно.");
  }
  const body = { message: "Обновление контента из админ-панели", content: utf8b64(fileText), branch };
  if (sha) body.sha = sha;
  const p = await fetch(api, { method: "PUT", headers, body: JSON.stringify(body) });
  if (!p.ok) {
    const j = await p.json().catch(() => ({}));
    if (p.status === 404) throw new Error("Нет доступа к репозиторию — у ключа должны быть права Contents: Read and write.");
    throw new Error("GitHub " + p.status + ": " + (j.message || "не удалось опубликовать"));
  }
  const pj = await p.json();
  return { commit: pj.commit, contentSha: pj.content && pj.content.sha };
}

/* ---------- Media upload helpers ---------- */
async function ghUploadMedia(token, branch, path, base64) {
  const api = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`;
  const headers = { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "Content-Type": "application/json" };
  /* Одна попытка: GET текущий sha файла -> PUT новый коммит. */
  async function attempt() {
    let sha = null;
    const g = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers });
    if (g.status === 200) sha = (await g.json()).sha;
    else if (g.status === 401) throw new Error("Неверный ключ доступа");
    else if (g.status !== 404) throw new Error("GitHub: ошибка " + g.status);
    const body = { message: "Медиа: " + path.split("/").pop(), content: base64, branch };
    if (sha) body.sha = sha;
    const p = await fetch(api, { method: "PUT", headers, body: JSON.stringify(body) });
    return p;
  }
  /* 409/422 = кто-то (другая вкладка/ПК) записал этот же файл между нашими
     GET и PUT: sha устарел. Перечитываем свежий sha и пробуем ещё раз —
     чтобы при параллельной работе не приходилось жать «повторить» вручную. */
  let p = await attempt();
  if (p.status === 409 || p.status === 422) p = await attempt();
  if (!p.ok) {
    const j = await p.json().catch(() => ({}));
    throw new Error("GitHub " + p.status + ": " + (j.message || "ошибка загрузки"));
  }
  return await p.json();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = () => reject(new Error("Ошибка чтения файла"));
    r.readAsDataURL(file);
  });
}

/* ---------- client-side image compression before GitHub upload ----------
   Resizes to maxDim on the longer side and re-encodes via <canvas>.
   Output format follows the target path's extension: .png stays PNG
   (lossless, but resizing alone shrinks huge originals a lot; keeps
   transparency for logos), .webp stays WebP, everything else → JPEG. */
function targetMimeFromPath(path) {
  const ext = (path.split(".").pop() || "").toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

function compressImageFile(file, path, maxDim = 1500, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file.type || !file.type.startsWith("image/")) { resolve(null); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      let width = img.naturalWidth, height = img.naturalHeight;
      if (width > maxDim || height > maxDim) {
        if (width >= height) { height = Math.round(height * maxDim / width); width = maxDim; }
        else { width = Math.round(width * maxDim / height); height = maxDim; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      const mime = targetMimeFromPath(path);
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error("Не удалось сжать изображение")); return; }
        const reader = new FileReader();
        reader.onload = () => resolve({
          dataUrl: reader.result,
          base64: reader.result.split(",")[1],
          size: blob.size,
          origSize: file.size,
          width, height,
        });
        reader.onerror = () => reject(new Error("Ошибка чтения сжатого файла"));
        reader.readAsDataURL(blob);
      }, mime, mime === "image/png" ? undefined : quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Не удалось прочитать изображение")); };
    img.src = url;
  });
}

function fmtKB(bytes) {
  return bytes >= 1024 * 1024 ? (bytes / (1024 * 1024)).toFixed(1) + " МБ" : Math.round(bytes / 1024) + " КБ";
}

/* Имя → латинское имя файла: «Айгерим Т.» → "aigerim-t". Нужно, чтобы у
   каждой записи (студента, отзыва) был свой файл — иначе при пустом пути
   несколько загрузок ушли бы в один и тот же videos/имя.mp4. */
const _TRANSLIT = {
  а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"i",к:"k",л:"l",м:"m",
  н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"c",ч:"ch",ш:"sh",щ:"sch",
  ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
  ү:"u",ұ:"u",ө:"o",ң:"ng",қ:"k",ғ:"g",һ:"h",і:"i",ә:"a",
};
function slugify(str) {
  const s = (str || "").toLowerCase().split("").map((ch) => (ch in _TRANSLIT ? _TRANSLIT[ch] : ch)).join("");
  return s.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "file";
}

/* ---------- video compression via ffmpeg.wasm ----------
   Настоящий ffmpeg (libx264 + AAC), скомпилированный в WebAssembly, — кодирует
   офлайн, поэтому рассинхрона звука, которым страдал прежний MediaRecorder-
   подход, здесь не бывает. Движок (~31 МБ, elite/vendor/ffmpeg/) подгружается
   при первом сжатии и кэшируется браузером. Кодирование однопоточное:
   минутный телефонный ролик занимает несколько минут — для редких загрузок
   в админке это приемлемо. */
var _ffmpegPromise = null;

function ffLoadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Не удалось загрузить " + src));
    document.head.appendChild(s);
  });
}

function getFFmpeg() {
  if (!_ffmpegPromise) {
    _ffmpegPromise = (async () => {
      const base = new URL("elite/vendor/ffmpeg/", window.location.href).href;
      if (!window.FFmpegWASM) await ffLoadScript(base + "ffmpeg.js");
      const ffmpeg = new window.FFmpegWASM.FFmpeg();
      /* абсолютные URL: воркер ffmpeg живёт в elite/vendor/ffmpeg/ и относительные
         пути резолвил бы неверно */
      await ffmpeg.load({ coreURL: base + "ffmpeg-core.js", wasmURL: base + "ffmpeg-core.wasm" });
      return ffmpeg;
    })();
    _ffmpegPromise.catch(() => { _ffmpegPromise = null; }); /* не кэшировать неудачную загрузку */
  }
  return _ffmpegPromise;
}

function uint8ToBase64(u8) {
  let bin = "";
  const CH = 0x8000; /* String.fromCharCode падает на больших массивах — кусками */
  for (let i = 0; i < u8.length; i += CH) bin += String.fromCharCode.apply(null, u8.subarray(i, i + CH));
  return btoa(bin);
}

/* Те же настройки, что при ручной перекодировке: H.264 main + AAC, ширина
   до 900px, CFR 30fps, aresample против дрейфа звука, faststart. */
async function compressVideoFile(file, { onProgress } = {}) {
  const ffmpeg = await getFFmpeg();
  const m = file.name.match(/\.[a-z0-9]+$/i);
  const inName = "in" + (m ? m[0].toLowerCase() : ".mp4");
  await ffmpeg.writeFile(inName, new Uint8Array(await file.arrayBuffer()));
  const progressHandler = (e) => { if (onProgress) onProgress(Math.max(0, Math.min(100, Math.round((e.progress || 0) * 100)))); };
  ffmpeg.on("progress", progressHandler);
  try {
    const code = await ffmpeg.exec([
      "-i", inName,
      "-vf", "scale='min(900,iw)':-2,fps=30",
      "-c:v", "libx264", "-profile:v", "main", "-pix_fmt", "yuv420p",
      "-preset", "veryfast", "-crf", "26", "-maxrate", "1.5M", "-bufsize", "3M",
      "-c:a", "aac", "-b:a", "96k", "-ac", "2", "-af", "aresample=async=1",
      "-movflags", "+faststart",
      "out.mp4",
    ]);
    if (code !== 0) throw new Error("ffmpeg завершился с ошибкой (код " + code + ")");
    const out = await ffmpeg.readFile("out.mp4");
    if (!out || !out.length) throw new Error("Сжатие не удалось: пустой результат");
    return { data: out, size: out.length, origSize: file.size };
  } finally {
    ffmpeg.off("progress", progressHandler);
    try { await ffmpeg.deleteFile(inName); } catch (e) {}
    try { await ffmpeg.deleteFile("out.mp4"); } catch (e) {}
  }
}
window.eaCompressVideo = compressVideoFile; /* для отладки из консоли */

/* ============================================================
   ФОНОВАЯ ОЧЕРЕДЬ ЗАГРУЗКИ
   Живёт вне React, поэтому загрузка не прерывается при переходе
   между разделами админки. Позволяет поставить в очередь сразу
   несколько файлов: фото грузятся по 3 параллельно, видео — по
   одному (в памяти один экземпляр ffmpeg, два сжатия сразу нельзя).
   ============================================================ */
const IMG_PARALLEL = 3;
const VID_MAX_UPLOAD = 45 * 1024 * 1024;   // лимит GitHub API
const VID_COMPRESS_OVER = 8 * 1024 * 1024; // меньше — грузим как есть

const uploadMgr = {
  items: [],
  subs: new Set(),
  seq: 0,
  imgActive: 0,
  vidBusy: false,

  subscribe(fn) { this.subs.add(fn); return () => this.subs.delete(fn); },
  notify() { this.subs.forEach((fn) => { try { fn(); } catch (e) {} }); },
  active() { return this.items.some((i) => i.status !== "done" && i.status !== "error"); },

  enqueue({ kind, path, file, token, branch }) {
    const item = { id: ++this.seq, kind, path, file, token, branch,
      name: file.name, size: file.size, status: "queued", progress: 0, note: "", error: null };
    this.items.push(item);
    this.notify();
    this.pump();
    return item.id;
  },

  clearFinished() {
    this.items = this.items.filter((i) => i.status !== "done" && i.status !== "error");
    this.notify();
  },

  retry(id) {
    const it = this.items.find((i) => i.id === id);
    if (it && it.status === "error") { it.status = "queued"; it.error = null; it.progress = 0; this.notify(); this.pump(); }
  },

  pump() {
    for (const it of this.items) {
      if (it.status !== "queued") continue;
      if (it.kind === "video") {
        if (this.vidBusy) continue;
        this.vidBusy = true;
        this.runVideo(it);
      } else {
        if (this.imgActive >= IMG_PARALLEL) continue;
        this.imgActive++;
        this.runImage(it);
      }
    }
  },

  async runVideo(it) {
    try {
      if (!it.token) throw new Error("Нет токена — добавь его в разделе «Публикация»");
      let base64;
      const needCompress = it.size > VID_COMPRESS_OVER || !/\.mp4$/i.test(it.name);
      if (needCompress) {
        it.status = "compressing"; it.progress = 0; it.note = "готовлю кодировщик…"; this.notify();
        const c = await compressVideoFile(it.file, { onProgress: (p) => { it.progress = p; it.note = ""; this.notify(); } });
        if (c.size > VID_MAX_UPLOAD) throw new Error("после сжатия " + fmtKB(c.size) + " — всё ещё больше 45 МБ, обрежь ролик");
        it.note = "сжато: " + fmtKB(it.size) + " → " + fmtKB(c.size);
        base64 = uint8ToBase64(c.data);
      } else {
        base64 = await fileToBase64(it.file);
      }
      it.status = "uploading"; this.notify();
      await ghUploadMedia(it.token, it.branch, it.path, base64);
      it.status = "done"; it.progress = 100; this.notify();
    } catch (e) {
      it.status = "error"; it.error = e.message; this.notify();
    } finally {
      this.vidBusy = false;
      this.pump();
    }
  },

  async runImage(it) {
    try {
      if (!it.token) throw new Error("Нет токена — добавь его в разделе «Публикация»");
      it.status = "uploading"; this.notify();
      let base64;
      const c = await compressImageFile(it.file, it.path).catch(() => null);
      if (c) { base64 = c.base64; it.note = fmtKB(it.size) + " → " + fmtKB(c.size); }
      else { base64 = await fileToBase64(it.file); }
      await ghUploadMedia(it.token, it.branch, it.path, base64);
      it.status = "done"; this.notify();
    } catch (e) {
      it.status = "error"; it.error = e.message; this.notify();
    } finally {
      this.imgActive--;
      this.pump();
    }
  },
};
window.eaUploadMgr = uploadMgr; /* для отладки из консоли */

/* Хук: перерисовывать компонент при изменениях очереди */
function useUploads() {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => uploadMgr.subscribe(force), []);
  return uploadMgr.items;
}

/* Плавающая панель со статусом всех загрузок — монтируется один раз в
   корне админки, поэтому переживает переключение разделов. */
function UploadCenter() {
  const items = useUploads();
  const [min, setMin] = React.useState(false);
  if (!items.length) return null;
  const active = items.filter((i) => i.status !== "done" && i.status !== "error").length;
  const errs = items.filter((i) => i.status === "error").length;
  const label = (it) => {
    if (it.status === "queued") return "в очереди";
    if (it.status === "compressing") return it.note || ("сжимаю… " + it.progress + "%");
    if (it.status === "uploading") return "загружаю…";
    if (it.status === "done") return "✓ готово" + (it.note ? " · " + it.note : "");
    return "ошибка";
  };
  return (
    <div className="uploadctr">
      <div className="uploadctr__head" onClick={() => setMin((m) => !m)}>
        <b>{active > 0 ? `Загрузка (${active})…` : errs > 0 ? `Загрузка: ${errs} с ошибкой` : "Загрузка завершена"}</b>
        <div className="uploadctr__head-act">
          {active === 0 && <button className="uploadctr__x" onClick={(e) => { e.stopPropagation(); uploadMgr.clearFinished(); }}>Очистить</button>}
          <span className="uploadctr__toggle">{min ? "▲" : "▼"}</span>
        </div>
      </div>
      {!min && (
        <div className="uploadctr__list">
          {items.map((it) => (
            <div key={it.id} className={"uploadctr__row uploadctr__row--" + it.status}>
              <div className="uploadctr__row-top">
                <span className="uploadctr__path" title={it.path}>{it.kind === "video" ? "🎬" : "🖼"} {it.path}</span>
                <span className="uploadctr__state">{label(it)}</span>
              </div>
              {(it.status === "compressing") && (
                <div className="uploadctr__bar"><div className="uploadctr__bar-fill" style={{ width: Math.max(2, it.progress) + "%" }} /></div>
              )}
              {it.status === "error" && (
                <div className="uploadctr__err">{it.error} <button className="uploadctr__retry" onClick={() => uploadMgr.retry(it.id)}>повторить</button></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadSlot({ label, path, token, branch, accept = "image/jpeg,image/png,image/webp", hint, onSuccess, maxDim = 1500 }) {
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [compressed, setCompressed] = React.useState(null);
  const [st, setSt] = React.useState(null);
  const [err, setErr] = React.useState(null);
  const [imgOk, setImgOk] = React.useState(true);

  async function onFile(e) {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    setFile(f); setSt(null); setErr(null); setCompressed(null);
    try {
      const c = await compressImageFile(f, path, maxDim);
      if (c) { setPreview(c.dataUrl); setCompressed(c); }
      else {
        const r = new FileReader();
        r.onload = () => setPreview(r.result);
        r.readAsDataURL(f);
      }
    } catch (e2) {
      setErr(e2.message);
      const r = new FileReader();
      r.onload = () => setPreview(r.result);
      r.readAsDataURL(f);
    }
  }

  async function upload() {
    if (!file || !preview) return;
    setSt("busy"); setErr(null);
    try {
      const base64 = compressed ? compressed.base64 : preview.split(",")[1];
      await ghUploadMedia(token, branch, path, base64);
      setSt("ok"); setFile(null); setPreview(null); setCompressed(null); setImgOk(true);
      if (onSuccess) onSuccess(path);
    } catch (e2) {
      setSt("err"); setErr(e2.message);
    }
  }

  return (
    <div className="mslot">
      <div className="mslot__label">{label}</div>
      <div className="mslot__code">{path}</div>
      <div className="mslot__thumb">
        {preview
          ? <img src={preview} className="mslot__img" alt="" />
          : imgOk
            ? <img src={path} className="mslot__img" alt="" onError={() => setImgOk(false)} />
            : <div className="mslot__empty">нет файла</div>
        }
      </div>
      <div className="mslot__row">
        <label className="abtn mslot__pick">
          {file ? (file.name.length > 18 ? file.name.slice(0, 16) + "…" : file.name) : "Выбрать файл"}
          <input type="file" accept={accept} onChange={onFile} style={{ display: "none" }} />
        </label>
        {file && (
          <button className="abtn abtn--primary" onClick={upload} disabled={st === "busy"}>
            {st === "busy" ? "Идёт…" : "↑ Загрузить"}
          </button>
        )}
      </div>
      {compressed && (
        <div className="mslot__hint">
          Сжато: {fmtKB(compressed.origSize)} → {fmtKB(compressed.size)} ({compressed.width}×{compressed.height})
        </div>
      )}
      {st === "ok" && <div className="mslot__status mslot__ok">✓ Загружено</div>}
      {st === "err" && <div className="mslot__status mslot__err">{err}</div>}
      {hint && <div className="mslot__hint">{hint}</div>}
    </div>
  );
}

/* ---------- tiny form helpers ---------- */
function F({ l, children, wide }) {
  return <label className={"af" + (wide ? " af--wide" : "")}><span>{l}</span>{children}</label>;
}
function TIn({ l, v, on, ph, wide }) {
  return <F l={l} wide={wide}><input value={v ?? ""} placeholder={ph || ""} onChange={(e) => on(e.target.value)} /></F>;
}
function NIn({ l, v, on, ph }) {
  return <F l={l}><input type="number" value={v ?? ""} placeholder={ph || ""} onChange={(e) => on(e.target.value === "" ? null : +e.target.value)} /></F>;
}
function Area({ l, v, on, rows = 3 }) {
  return <F l={l} wide><textarea rows={rows} value={v ?? ""} onChange={(e) => on(e.target.value)} /></F>;
}
function Sel({ l, v, on, opts }) {
  return (
    <F l={l}>
      <select value={v ?? ""} onChange={(e) => on(e.target.value)}>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </F>
  );
}
function Chk({ l, v, on }) {
  return (
    <label className="af af--chk">
      <input type="checkbox" checked={!!v} onChange={(e) => on(e.target.checked)} />
      <span>{l}</span>
    </label>
  );
}

/* ---------- initial state from current effective content ---------- */
function buildInitial() {
  const det = window.EA_UNI_DETAILS || {};
  const unis = (window.EA_UNIS_RAW || []).map((u) => {
    const d = det[u.short] || {};
    return { ...clone(u), about: d.about || "", founded: d.founded || "", students: d.students || "", site: d.site || "" };
  });
  const cdet = window.EA_COUNTRY_DETAILS || {};
  const countries = (window.EA_COUNTRY_CARDS || []).map((c) => ({
    card: clone(c),
    det: clone(cdet[c.name] || {}),
  }));
  return {
    unis,
    countries,
    storyCards: clone(window.EA_STORY_CARDS || []),
    storyGrid: clone(window.EA_STORY_GRID || []),
    videos: clone(window.EA_VIDEOS || []),
    posts: clone(window.EA_POSTS || []),
    about: clone(window.EA_ABOUT || { text: "", fcN: "", fcL: "", stats: [], badges: [] }),
    team: clone(window.EA_TEAM || { text: "", badges: [] }),
    office: clone(window.EA_OFFICE || {}),
    accreds: clone(window.EA_ACCREDS || []),
    careers: clone(window.EA_CAREERS || { heroPhoto: "", deptPhotos: { marketing: "", sales: "", admission: "" }, corpPhotos: Array(8).fill(""), applyUrl: "" }),
    /* Главная: hero/дедлайн/finalCta — пустое поле = текст сайта по умолчанию */
    home: clone((window.eaContent && window.eaContent("home", null)) || { hero: {}, deadline: {}, finalCta: {} }),
    /* Блок «Образование за рубежом — это не только диплом» */
    beyond: clone((window.eaContent && window.eaContent("beyond", null)) || {}),
    painItems: clone(window.EA_PAIN_ITEMS || []),
    reviews: clone(window.EA_REVIEWS_STATE || { sub: "", items: [] }),
  };
}

/* ---------- state → publishable content object ---------- */
const UNI_CAT_KEYS = ["name", "short", "loc", "country", "qs", "price", "discount", "type", "field", "levels", "elite", "meritBased", "needBased", "intake", "engTests", "exams", "gpaMin"];
function buildContent(s) {
  const unis = s.unis.map((u) => {
    const o = {};
    UNI_CAT_KEYS.forEach((k) => { if (u[k] !== undefined && u[k] !== null && u[k] !== "" && u[k] !== false) o[k] = u[k]; });
    o.qs = (u.qs === "" || u.qs == null) ? null : +u.qs;
    o.price = +u.price || 0;
    o.flag = FLAGS[o.country] || "🌍";
    return o;
  });
  const uniDetails = {};
  s.unis.forEach((u) => {
    const d = {};
    if (u.about) d.about = u.about;
    if (u.founded) d.founded = isNaN(+u.founded) ? u.founded : +u.founded;
    if (u.students) d.students = u.students;
    if (u.site) d.site = u.site;
    if (Object.keys(d).length) uniDetails[u.short] = d;
  });
  const countryCards = s.countries.map((c) => c.card);
  const countryDetails = {};
  s.countries.forEach((c) => { countryDetails[c.card.name] = c.det; });
  return {
    unis, uniDetails, countryCards, countryDetails,
    storyCards: s.storyCards, storyGrid: s.storyGrid,
    videos: s.videos, posts: s.posts,
    about: s.about, team: s.team, office: s.office, accreds: s.accreds,
    careers: s.careers,
    home: s.home, painItems: s.painItems, reviews: s.reviews,
    beyond: s.beyond,
  };
}

/* ============================================================
   LOGIN
   ============================================================ */
function Login({ onOk }) {
  const [p, setP] = useState("");
  const [err, setErr] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (await checkPass(p)) {
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e2) {}
      onOk();
    } else setErr(true);
  }
  return (
    <div className="alogin">
      <form className="alogin__card" onSubmit={submit}>
        <div className="alogin__logo">EA</div>
        <h1>Админ-панель</h1>
        <p>Elite Academy KG — управление контентом</p>
        <input type="password" autoFocus placeholder="Пароль" value={p}
               onChange={(e) => { setP(e.target.value); setErr(false); }} />
        {err && <div className="alogin__err">Неверный пароль</div>}
        <button type="submit" className="abtn abtn--primary abtn--block">Войти</button>
      </form>
    </div>
  );
}

/* ============================================================
   UNIVERSITIES EDITOR
   ============================================================ */
function UnisEditor({ list, setList, token, branch }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null);
  const shown = useMemo(() => {
    const qq = q.toLowerCase();
    return list.map((u, i) => ({ u, i }))
      .filter(({ u }) => !qq || [u.name, u.short, u.loc, u.country].join(" ").toLowerCase().includes(qq));
  }, [list, q]);

  const upd = (i, k, v) => setList(list.map((u, j) => (j === i ? { ...u, [k]: v } : u)));
  const del = (i) => {
    if (!window.confirm(`Удалить «${list[i].name}»?`)) return;
    setList(list.filter((_, j) => j !== i));
    setSel(null);
  };
  const add = () => {
    const nu = { name: "Новый университет", short: "NEW" + (list.length + 1), loc: "", country: "США", qs: null, price: 10000, type: "Частный", field: "Бизнес", levels: "Бакалавр · Магистр", about: "", founded: "", students: "", site: "" };
    setList([nu, ...list]);
    setSel(0); setQ("");
  };
  const u = sel != null ? list[sel] : null;
  const uSlug = u ? u.short.toLowerCase().replace(/[^a-z0-9]+/g, "") : "";
  const logoPath = (u && u.logo) || (uSlug ? `images/logos/catalog/${uSlug}.png` : "");

  return (
    <div className="asplit">
      <div className="alist">
        <div className="alist__top">
          <input className="alist__search" placeholder={`Поиск среди ${list.length} вузов…`} value={q} onChange={(e) => { setQ(e.target.value); }} />
          <button className="abtn abtn--primary" onClick={add}>+ Вуз</button>
        </div>
        <div className="alist__scroll">
          {shown.map(({ u: x, i }) => (
            <button key={i} className={"alist__row" + (sel === i ? " is-on" : "")} onClick={() => setSel(i)}>
              <span className="alist__flag">{FLAGS[x.country] || "🌍"}</span>
              <span className="alist__name">{x.name}</span>
              <span className="alist__meta">{x.loc}</span>
            </button>
          ))}
          {shown.length === 0 && <div className="alist__empty">Ничего не найдено</div>}
        </div>
      </div>

      {u ? (
        <div className="aform">
          <div className="aform__head">
            <h3>{u.name}</h3>
            <div className="aform__head-act">
              <a href={`university.html?u=${encodeURIComponent(u.short)}`} target="_blank" rel="noopener" className="abtn">Открыть страницу ↗</a>
              <button className="abtn abtn--danger" onClick={() => del(sel)}>Удалить</button>
            </div>
          </div>
          <div className="aform__grid">
            <TIn l="Название" v={u.name} on={(v) => upd(sel, "name", v)} wide />
            <TIn l="Код (ID, латиницей)" v={u.short} on={(v) => upd(sel, "short", v)} />
            <Sel l="Страна" v={u.country} on={(v) => upd(sel, "country", v)} opts={COUNTRY_OPTS} />
            <TIn l="Город" v={u.loc} on={(v) => upd(sel, "loc", v)} />
            <NIn l="QS рейтинг (пусто = нет)" v={u.qs} on={(v) => upd(sel, "qs", v)} />
            <NIn l="Контракт $/год" v={u.price} on={(v) => upd(sel, "price", v)} />
            <NIn l="Стипендия / скидка $ (пусто = нет)" v={u.discount} on={(v) => upd(sel, "discount", v)} />
            <Sel l="Тип" v={u.type} on={(v) => upd(sel, "type", v)} opts={TYPE_OPTS} />
            <Sel l="Направление" v={u.field} on={(v) => upd(sel, "field", v)} opts={FIELD_OPTS} />
            <TIn l="Уровни (через · )" v={u.levels} on={(v) => upd(sel, "levels", v)} ph="Бакалавр · Магистр" />
            <div className="aform__checks">
              <Chk l="★ Elite выбор" v={u.elite} on={(v) => upd(sel, "elite", v)} />
              <Chk l="Merit-стипендия" v={u.meritBased} on={(v) => upd(sel, "meritBased", v)} />
              <Chk l="Need-грант" v={u.needBased} on={(v) => upd(sel, "needBased", v)} />
            </div>
            <div className="aform__divider">Условия поступления</div>
            <TIn l="Начало обучения" v={u.intake} on={(v) => upd(sel, "intake", v)} ph="Осень / Весна" />
            <TIn l="Языковые тесты (через · )" v={u.engTests} on={(v) => upd(sel, "engTests", v)} ph="IELTS · TOEFL · Duolingo" />
            <TIn l="Вступит. экзамены" v={u.exams} on={(v) => upd(sel, "exams", v)} ph="без экзаменов" />
            <TIn l="Мин. GPA (пусто = нет)" v={u.gpaMin} on={(v) => upd(sel, "gpaMin", v)} ph="2.5" />

            <div className="aform__divider">Страница вуза (university.html)</div>
            <Area l="Описание — блок «Коротко о вузе» (можно длинный текст; пустая строка = новый абзац)" v={u.about} on={(v) => upd(sel, "about", v)} rows={12} />
            <TIn l="Год основания" v={u.founded} on={(v) => upd(sel, "founded", v)} ph="1863" />
            <TIn l="Студентов" v={u.students} on={(v) => upd(sel, "students", v)} ph="≈47 000" />
            <TIn l="Официальный сайт" v={u.site} on={(v) => upd(sel, "site", v)} ph="polimi.it" />
          </div>
          <div className="aform__divider">Медиа</div>
          {token ? (
            <div>
              <div className="ahint" style={{ marginBottom: 12 }}>Логотип — PNG на прозрачном фоне, 300×300 px:</div>
              <div className="mgrid" style={{ marginBottom: 20 }}>
                <UploadSlot label="Логотип" path={logoPath} token={token} branch={branch} accept="image/png,image/webp,image/jpeg" maxDim={500} />
                <UploadSlot label="Фото для каталога" path={"images/campus/" + uSlug + ".jpg"} token={token} branch={branch} hint="1400×900 px" />
              </div>
              <div className="ahint" style={{ marginBottom: 12 }}>Галерея на странице вуза — 4 фото, 1200×800 px:</div>
              <div className="mgrid" style={{ marginBottom: 16 }}>
                {["Кампус", "Корпуса", "Общежитие", "Студ. жизнь"].map((lbl, idx) => (
                  <UploadSlot key={idx} label={lbl} path={"images/unis/" + uSlug + "/" + (idx + 1) + ".jpg"} token={token} branch={branch} />
                ))}
              </div>
              <div className="ahint">
                Видео-тур: загружай напрямую в GitHub →{" "}
                <code>videos/unis/{uSlug}/tour.mp4</code>
              </div>
            </div>
          ) : (
            <div className="ahint">
              Лого: <code>{logoPath}</code><br />
              Фото: <code>images/unis/{uSlug}/1.jpg … 4.jpg</code><br />
              Видео: <code>videos/unis/{uSlug}/tour.mp4</code><br />
              Добавь GitHub token в разделе «⚙️ Публикация» чтобы загружать файлы отсюда.
            </div>
          )}
        </div>
      ) : (
        <div className="aform aform--empty">← Выбери вуз из списка или добавь новый</div>
      )}
    </div>
  );
}

/* ============================================================
   COUNTRIES EDITOR
   ============================================================ */
function CountriesEditor({ list, setList }) {
  const [sel, setSel] = useState(0);
  const c = list[sel];
  const updCard = (k, v) => setList(list.map((x, j) => (j === sel ? { ...x, card: { ...x.card, [k]: v } } : x)));
  const updDet = (k, v) => setList(list.map((x, j) => (j === sel ? { ...x, det: { ...x.det, [k]: v } } : x)));
  const updFact = (k, v) => updDet("facts", { ...(c.det.facts || {}), [k]: v });
  const updWhy = (i, k, v) => {
    const why = clone(c.det.why || []);
    why[i] = { ...why[i], [k]: v };
    updDet("why", why);
  };

  return (
    <div className="asplit">
      <div className="alist alist--narrow">
        <div className="alist__scroll">
          {list.map((x, i) => (
            <button key={x.card.name} className={"alist__row" + (sel === i ? " is-on" : "")} onClick={() => setSel(i)}>
              <span className="alist__flag">{x.card.flag}</span>
              <span className="alist__name">{x.card.name}</span>
            </button>
          ))}
        </div>
      </div>

      {c && (
        <div className="aform">
          <div className="aform__head">
            <h3>{c.card.flag} {c.card.name}</h3>
            <a href={`country.html?c=${encodeURIComponent(c.card.name)}`} target="_blank" rel="noopener" className="abtn">Открыть страницу ↗</a>
          </div>
          <div className="aform__grid">
            <div className="aform__divider">Карточка на главной</div>
            <TIn l="Города (ориентиры)" v={c.card.landmark} on={(v) => updCard("landmark", v)} wide />
            <TIn l="Подпись (3 слова)" v={c.card.desc} on={(v) => updCard("desc", v)} wide />
            <TIn l="Цена на карточке" v={c.card.price} on={(v) => updCard("price", v)} />
            <Chk l="🔥 Метка «Популярно»" v={c.card.hot} on={(v) => updCard("hot", v)} />

            <div className="aform__divider">Страница страны</div>
            <Area l="Слоган под названием" v={c.det.tagline} on={(v) => updDet("tagline", v)} rows={2} />
            {Object.entries(c.det.facts || {}).map(([k, v]) => (
              <TIn key={k} l={"Факт: " + k} v={v} on={(nv) => updFact(k, nv)} />
            ))}
            {(c.det.why || []).map((w, i) => (
              <div className="aform__sub" key={i}>
                <div className="aform__sub-h">Почему {c.card.name} — карточка {i + 1}</div>
                <div className="aform__grid aform__grid--inner">
                  <TIn l="Эмодзи" v={w.ic} on={(v) => updWhy(i, "ic", v)} />
                  <TIn l="Заголовок" v={w.t} on={(v) => updWhy(i, "t", v)} />
                  <Area l="Текст" v={w.d} on={(v) => updWhy(i, "d", v)} rows={2} />
                </div>
              </div>
            ))}
            <Area l="Об образовании" v={c.det.edu} on={(v) => updDet("edu", v)} rows={4} />
            <Area l="Туризм и жизнь" v={c.det.tourism} on={(v) => updDet("tourism", v)} rows={3} />
          </div>
          <div className="ahint">Фото галереи: <code>images/countries/{c.det.slug}/1.jpg … 4.jpg</code></div>
        </div>
      )}
    </div>
  );
}

/* ---------- Image path field: preview + queue upload ---------- */
function ImgPathField({ l, v, on, token, branch, ph }) {
  const [imgErr, setImgErr] = React.useState(false);
  const [localPreview, setLocalPreview] = React.useState(null);
  const [msg, setMsg] = React.useState(null);
  React.useEffect(() => { setImgErr(false); }, [v]);

  function onFile(e) {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    setMsg(null);
    if (!token) { setMsg({ err: true, text: "Сначала добавь токен в разделе «Публикация»" }); return; }
    const target = v || (ph || "thumbs/имя.jpg");
    if (!v) on(target); // если путь был пуст — показать, куда уйдёт файл
    // локальное превью сразу, чтобы было видно что выбрано
    const r = new FileReader();
    r.onload = () => setLocalPreview(r.result);
    r.readAsDataURL(f);
    uploadMgr.enqueue({ kind: "image", path: target, file: f, token, branch });
    setMsg({ err: false, text: "В очереди — следи за статусом внизу." });
  }

  const thumb = localPreview || (v && !imgErr ? v : null);
  return (
    <div className="afield">
      <label className="afield__label">{l}</label>
      <div className="afield__preview-wrap" onClick={() => document.getElementById("af-img-" + l)?.click()} title="Нажми, чтобы выбрать файл">
        {thumb
          ? <img src={thumb} alt="" className={"afield__preview-img" + (localPreview ? " afield__preview-img--new" : "")} onError={() => setImgErr(true)} />
          : <div className="afield__preview-empty">нет превью · нажми чтобы загрузить</div>
        }
        <input id={"af-img-" + l} type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} style={{ display: "none" }} />
        <div className="afield__preview-overlay">Заменить</div>
      </div>
      <div className="afield__vid-row">
        <input className="ainput ainput--flex" value={v || ""} onChange={e => { on(e.target.value); setLocalPreview(null); setMsg(null); }} placeholder={ph || "thumbs/имя.jpg"} />
        <label className="abtn" title="Выбрать файл для замены" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
          📁 Загрузить <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} style={{ display: "none" }} />
        </label>
      </div>
      {msg && <div className={"afield__status " + (msg.err ? "afield__err" : "afield__ok")}>{msg.text}</div>}
    </div>
  );
}

/* ---------- Video path field: preview + queue upload ---------- */
function VidPathField({ l, v, on, token, branch, ph }) {
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState(null);
  const MAX_SOURCE = 500 * 1024 * 1024; // больше в память wasm не влезет

  function onFile(e) {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    setMsg(null);
    if (!token) { setMsg({ err: true, text: "Сначала добавь токен в разделе «Публикация»" }); return; }
    if (f.size > MAX_SOURCE) {
      setMsg({ err: true, text: "Файл " + fmtKB(f.size) + " — больше 500 МБ, обрежь или сожми вручную" });
      return;
    }
    // видео всегда сохраняем как .mp4: путь правим сразу, до постановки в очередь
    let target = v || (ph || "videos/имя.mp4");
    if (!/\.mp4$/i.test(target)) target = target.replace(/\.[a-z0-9]+$/i, "") + ".mp4";
    on(target); // поле показывает, куда уйдёт файл (и помечает форму как несохранённую)
    uploadMgr.enqueue({ kind: "video", path: target, file: f, token, branch });
    const heavy = f.size > 8 * 1024 * 1024;
    setMsg({ err: false, text: heavy
      ? "В очереди. Сжатие идёт в фоне (несколько минут) — можно работать дальше, следи снизу."
      : "В очереди — следи за статусом внизу." });
  }

  return (
    <div className="afield">
      <label className="afield__label">{l}</label>
      <div className="afield__vid-row">
        <input className="ainput ainput--flex" value={v || ""} onChange={e => { on(e.target.value); setOpen(false); setMsg(null); }} placeholder={ph || "videos/имя.mp4"} />
        {v && <button className="abtn" type="button" onClick={() => setOpen(o => !o)}>{open ? "Скрыть" : "▶ Смотреть"}</button>}
        <label className="abtn" title="Выбрать видеофайл с компьютера" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
          📁 Загрузить <input type="file" accept="video/mp4,video/quicktime,video/*" onChange={onFile} style={{ display: "none" }} />
        </label>
      </div>
      {open && v && <video key={v} src={v} controls className="afield__preview-vid" />}
      {msg && <div className={"afield__status " + (msg.err ? "afield__err" : "afield__ok")}>{msg.text}</div>}
    </div>
  );
}

/* ============================================================
   GENERIC LIST EDITOR (stories / videos / posts)
   ============================================================ */
function SimpleList({ list, setList, schema, titleKey, addTemplate, addLabel, token, branch }) {
  const [sel, setSel] = useState(null);
  const upd = (i, k, v) => setList(list.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const del = (i) => {
    if (!window.confirm("Удалить запись?")) return;
    setList(list.filter((_, j) => j !== i));
    setSel(null);
  };
  const add = () => { setList([clone(addTemplate), ...list]); setSel(0); };
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
    setSel(j);
  };
  const x = sel != null ? list[sel] : null;

  return (
    <div className="asplit">
      <div className="alist">
        <div className="alist__top">
          <span className="alist__count">{list.length} записей</span>
          <button className="abtn abtn--primary" onClick={add}>{addLabel}</button>
        </div>
        <div className="alist__scroll">
          {list.map((item, i) => (
            <button key={i} className={"alist__row" + (sel === i ? " is-on" : "")} onClick={() => setSel(i)}>
              <span className="alist__name">{item[titleKey] || "—"}</span>
            </button>
          ))}
        </div>
      </div>
      {x ? (
        <div className="aform">
          <div className="aform__head">
            <h3>{x[titleKey] || "Запись"}</h3>
            <div className="aform__head-act">
              <button className="abtn" onClick={() => move(sel, -1)}>↑</button>
              <button className="abtn" onClick={() => move(sel, 1)}>↓</button>
              <button className="abtn abtn--danger" onClick={() => del(sel)}>Удалить</button>
            </div>
          </div>
          <div className="aform__grid">
            {schema.map(([k, l, type, opts]) => {
              /* имя файла по умолчанию — из названия записи, чтобы у каждой
                 записи был свой файл (иначе загрузки перезаписывали бы одну) */
              const slug = slugify(x[titleKey]);
              return (
                type === "area"      ? <Area key={k} l={l} v={x[k]} on={(v) => upd(sel, k, v)} />
                : type === "select"  ? <Sel  key={k} l={l} v={x[k]} on={(v) => upd(sel, k, v)} opts={opts} />
                : type === "imgpath" ? <ImgPathField key={k} l={l} v={x[k]} on={(v) => upd(sel, k, v)} token={token} branch={branch} ph={"thumbs/" + slug + ".jpg"} />
                : type === "vidpath" ? <VidPathField key={k} l={l} v={x[k]} on={(v) => upd(sel, k, v)} token={token} branch={branch} ph={"videos/" + slug + ".mp4"} />
                : <TIn key={k} l={l} v={x[k]} on={(v) => upd(sel, k, v)} />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="aform aform--empty">← Выбери запись или добавь новую</div>
      )}
    </div>
  );
}

/* ============================================================
   CAREERS EDITOR
   ============================================================ */
const CORP_PHOTO_COUNT = 8;
function CareersEditor({ careers, setCareers, token, branch }) {
  const upd = (k, v) => setCareers({ ...careers, [k]: v });
  const updDept = (dept, v) => setCareers({ ...careers, deptPhotos: { ...careers.deptPhotos, [dept]: v } });
  const updCorp = (i, v) => {
    const next = [...(careers.corpPhotos || Array(CORP_PHOTO_COUNT).fill(""))];
    next[i] = v;
    setCareers({ ...careers, corpPhotos: next });
  };
  const corpPhotos = careers.corpPhotos && careers.corpPhotos.length >= CORP_PHOTO_COUNT
    ? careers.corpPhotos
    : Array(CORP_PHOTO_COUNT).fill("").map((_, i) => (careers.corpPhotos || [])[i] || "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div className="amain__note">Управление фотографиями раздела «Вакансии». Текст переводится автоматически через языковые файлы.</div>

      {/* Apply URL */}
      <div className="acard">
        <div className="acard__title">Ссылка на анкету кандидата</div>
        <TIn l="URL анкеты (появится на кнопках «Заполнить анкету»)" v={careers.applyUrl || ""} on={v => upd("applyUrl", v)} wide />
      </div>

      {/* Hero photo */}
      <div className="acard">
        <div className="acard__title">Главное фото (Hero)</div>
        <div className="amain__note">Фон первого экрана страницы вакансий. Рекомендуется: фото команды или офиса, 1920×900 px.</div>
        <UploadSlot label="Фото Hero" path="images/careers/hero.jpg" token={token} branch={branch}
          hint="1920×900 px · JPG/WebP" onSuccess={() => upd("heroPhoto", "images/careers/hero.jpg")} />
        <TIn l="Или вставь ссылку на фото" v={careers.heroPhoto || ""} on={v => upd("heroPhoto", v)} />
      </div>

      {/* Department photos */}
      <div className="acard">
        <div className="acard__title">Фото отделов</div>
        {[
          ["marketing",  "Отдел маркетинга",  "images/careers/dept-marketing.jpg"],
          ["sales",      "Отдел продаж",       "images/careers/dept-sales.jpg"],
          ["admission",  "Отдел поступления",  "images/careers/dept-admission.jpg"],
        ].map(([id, label, path]) => (
          <div key={id} style={{ marginBottom: 24 }}>
            <div className="amain__note" style={{ fontWeight: 700, marginBottom: 8 }}>{label}</div>
            <UploadSlot label={"Фото · " + label} path={path} token={token} branch={branch}
              hint="800×600 px · JPG/WebP" onSuccess={() => updDept(id, path)} />
            <TIn l="Или вставь ссылку" v={careers.deptPhotos?.[id] || ""} on={v => updDept(id, v)} />
          </div>
        ))}
      </div>

      {/* Corporate life photos */}
      <div className="acard">
        <div className="acard__title">Фотогалерея «Корпоративная жизнь» ({CORP_PHOTO_COUNT} слотов)</div>
        <div className="amain__note">Фото с корпоративов, тимбилдингов, праздников. Рекомендуется: 800×600 px.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {corpPhotos.map((val, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <UploadSlot label={"Фото " + (i + 1)} path={"images/careers/corp-" + (i + 1) + ".jpg"}
                token={token} branch={branch} hint="800×600 px"
                onSuccess={() => updCorp(i, "images/careers/corp-" + (i + 1) + ".jpg")} />
              <TIn l="Или ссылка" v={val} on={v => updCorp(i, v)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
const SECTIONS = [
  ["home", "🏠 Главная"],
  ["unis", "🎓 Вузы"],
  ["countries", "🌍 Страны"],
  ["stories", "💬 Истории"],
  ["videos", "🎬 Видео-отзывы"],
  ["reviews", "⭐ Отзывы"],
  ["posts", "📰 Блог"],
  ["about", "ℹ️ О нас"],
  ["careers", "💼 Вакансии"],
  ["media", "📸 Медиа"],
  ["publish", "⚙️ Публикация"],
];

/* ============================================================
   HOME PAGE EDITOR — hero, deadline banner, final CTA.
   Пустое поле = используется стандартный (переведённый) текст сайта.
   ============================================================ */
const BEYOND_CELLS = [
  ["travel",  "Путешествия",  "Новые страны каждые каникулы",       "большая плитка, почти квадрат — ≈ 1200×1050 px"],
  ["career",  "Карьера",      "Международное резюме с первого дня",  "квадратная плитка — ≈ 700×720 px"],
  ["friends", "Друзья",       "Со всего мира — на всю жизнь",        "квадратная плитка — ≈ 700×720 px"],
  ["network", "Знакомства",   "Alumni-сеть в 40+ странах",           "горизонтальная плитка — ≈ 700×500 px"],
  ["world",   "Среда",        "100+ национальностей рядом",          "горизонтальная плитка — ≈ 700×500 px"],
];

function HomeEditor({ home, setHome, beyond, setBeyond, token, branch }) {
  const upd = (group, k) => (v) => setHome({ ...home, [group]: { ...(home[group] || {}), [k]: v } });
  const g = (group, k) => ((home[group] || {})[k]) || "";
  const updB = (k) => (v) => setBeyond({ ...beyond, [k]: v });
  const gb = (k) => beyond[k] || "";
  return (
    <div className="aform" style={{ maxWidth: 860 }}>
      <div className="aform__head">
        <h3>Главная страница</h3>
        <a href="index.html" target="_blank" rel="noopener" className="abtn">Открыть страницу ↗</a>
      </div>
      <div className="aform__grid">
        <div className="aform__divider">Хиро (первый экран) — пустое поле = стандартный текст с переводами</div>
        <TIn l="Бейдж (строка над заголовком)" v={g("hero", "badge")} on={upd("hero", "badge")} ph="Аккредитовано ICEF · 1500+ студентов за рубежом" wide />
        <TIn l="Заголовок — строка 1 (золотая)" v={g("hero", "h1a")} on={upd("hero", "h1a")} ph="Твой путь" />
        <TIn l="Заголовок — строка 2" v={g("hero", "h1b")} on={upd("hero", "h1b")} ph="к учёбе за рубежом" />
        <Area l="Подзаголовок" v={g("hero", "sub")} on={upd("hero", "sub")} />
        <TIn l="Кнопка основная" v={g("hero", "ctaPrimary")} on={upd("hero", "ctaPrimary")} ph="Получить бесплатную консультацию" />
        <TIn l="Кнопка вторичная" v={g("hero", "ctaSecondary")} on={upd("hero", "ctaSecondary")} ph="Узнать свои шансы →" />

        <div className="aform__divider">Баннер дедлайна (на главной, в каталоге и на «Программах»)</div>
        <TIn l="Дата дедлайна (ГГГГ-ММ-ДД)" v={g("deadline", "date")} on={upd("deadline", "date")} ph="2026-08-31" />
        <TIn l="Заголовок" v={g("deadline", "title")} on={upd("deadline", "title")} ph="Дедлайн подачи на осенний семестр" wide />
        <TIn l="Подзаголовок" v={g("deadline", "sub")} on={upd("deadline", "sub")} ph="Набор закрывается — успей пройти оценку и забронировать место" wide />

        <div className="aform__divider">Финальный блок с формой (на всех страницах)</div>
        <TIn l="Строка над заголовком" v={g("finalCta", "eyebrow")} on={upd("finalCta", "eyebrow")} ph="Сделай первый шаг" wide />
        <Area l="Заголовок (перенос строки = новая строка на сайте)" v={g("finalCta", "h2")} on={upd("finalCta", "h2")} />
        <TIn l="Заголовок формы" v={g("finalCta", "formTitle")} on={upd("finalCta", "formTitle")} ph="Начни сейчас" />
        <Area l="Подзаголовок формы" v={g("finalCta", "formSub")} on={upd("finalCta", "formSub")} />

        <div className="aform__divider">Блок «Образование за рубежом — это не только диплом» (главная)</div>
        <TIn l="Заголовок — строка 1 (синяя)" v={gb("h2a")} on={updB("h2a")} ph="Образование за рубежом —" wide />
        <TIn l="Заголовок — строка 2" v={gb("h2b")} on={updB("h2b")} ph="это не только диплом" wide />
        <div className="ahint" style={{ gridColumn: "1 / -1", marginTop: -4 }}>
          У каждой плитки видео проигрывается при наведении, а фото показывается,
          пока курсор не навёл. Плитки разного размера — держи под каждую свой
          размер фото (подписан ниже), тогда ничего не обрежется криво.
        </div>
        {BEYOND_CELLS.map(([key, phTitle, phSub, sizeHint]) => (
          <React.Fragment key={key}>
            <div className="aform__sub" style={{ gridColumn: "1 / -1" }}>
              <div className="aform__sub-h">Плитка «{phTitle}» — {sizeHint}</div>
              <div className="aform__grid aform__grid--inner">
                <TIn l="Заголовок" v={gb(key + "Title")} on={updB(key + "Title")} ph={phTitle} />
                <TIn l="Подпись" v={gb(key + "Sub")} on={updB(key + "Sub")} ph={phSub} />
                <VidPathField l="Видео (при наведении)" v={gb(key + "Video")} on={updB(key + "Video")} token={token} branch={branch} ph={`videos/beyond-${key}.mp4`} />
                <ImgPathField l={`Фото — ${sizeHint}`} v={gb(key + "Poster")} on={updB(key + "Poster")} token={token} branch={branch} ph={`images/beyond/${key}.jpg`} />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   ABOUT PAGE EDITOR
   ============================================================ */
function AboutEditor({ about, setAbout, team, setTeam, office, setOffice, token, branch }) {
  const updA = (k, v) => setAbout({ ...about, [k]: v });
  const updT = (k, v) => setTeam({ ...team, [k]: v });
  const updO = (k, v) => setOffice({ ...office, [k]: v });
  const updStat = (i, k, v) => {
    const stats = clone(about.stats || []);
    stats[i] = { ...stats[i], [k]: v };
    updA("stats", stats);
  };
  return (
    <div className="aform" style={{ maxWidth: 860 }}>
      <div className="aform__head">
        <h3>Страница «О нас»</h3>
        <a href="about.html" target="_blank" rel="noopener" className="abtn">Открыть страницу ↗</a>
      </div>
      <div className="aform__grid">
        <div className="aform__divider">Блок «О нас» (также на главной)</div>
        <Area l="Текст о компании" v={about.text} on={(v) => updA("text", v)} rows={4} />
        <TIn l="Фото «О нас» (путь к файлу)" v={about.photo || ""} on={(v) => updA("photo", v)} ph="images/team.jpg" wide />
        <TIn l="Цифра на фото" v={about.fcN} on={(v) => updA("fcN", v)} ph="1500+" />
        <TIn l="Подпись к цифре" v={about.fcL} on={(v) => updA("fcL", v)} />

        <div className="aform__divider">Сертификат ICEF (крупный бейдж на странице «О нас»)</div>
        <ImgPathField l="Фото сертификата" v={about.badge} on={(v) => updA("badge", v)} token={token} branch={branch} ph="images/icef-badge.png" />
        <TIn l="Подпись/alt-текст сертификата" v={about.badgeAlt || ""} on={(v) => updA("badgeAlt", v)} ph="ICEF Accredited — статус #6696" wide />
        {(about.stats || []).map((s, i) => (
          <div className="aform__sub" key={i}>
            <div className="aform__sub-h">Статистика {i + 1}</div>
            <div className="aform__grid aform__grid--inner">
              <TIn l="Цифра" v={s.n} on={(v) => updStat(i, "n", v)} />
              <TIn l="Подпись" v={(s.l || "").replace(/\n/g, " ")} on={(v) => updStat(i, "l", v)} />
            </div>
          </div>
        ))}
        <Area l="Бейджи доверия (по одному в строке)" v={(about.badges || []).join("\n")}
              on={(v) => updA("badges", v.split("\n").filter(Boolean))} rows={3} />

        <div className="aform__divider">Команда — «Мы сами прошли этот путь»</div>
        <Area l="Текст о команде" v={team.text} on={(v) => updT("text", v)} rows={4} />
        <Area l="Бейджи (по одному в строке)" v={(team.badges || []).join("\n")}
              on={(v) => updT("badges", v.split("\n").filter(Boolean))} rows={3} />
        <TIn l="Фото команды (путь к файлу)" v={team.photo || ""} on={(v) => updT("photo", v)} ph="images/team.jpg" wide />

        <div className="aform__divider">Офис и контакты — телефон, соцсети и адрес используются по всему сайту (шапка, футер, плавающий чат)</div>
        <TIn l="Рейтинг" v={office.rating} on={(v) => updO("rating", v)} ph="4.9" />
        <TIn l="Подпись рейтинга" v={office.reviews} on={(v) => updO("reviews", v)} ph="196 отзывов на 2GIS" />
        <TIn l="Адрес" v={office.address} on={(v) => updO("address", v)} wide />
        <TIn l="График работы" v={office.hours} on={(v) => updO("hours", v)} wide />
        <TIn l="Телефон" v={office.phone} on={(v) => updO("phone", v)} />
        <TIn l="WhatsApp (если отличается от телефона)" v={office.whatsapp || ""} on={(v) => updO("whatsapp", v)} ph="+996 555 720 712" />
        <TIn l="Email" v={office.email} on={(v) => updO("email", v)} />
        <TIn l="Instagram" v={office.instagram} on={(v) => updO("instagram", v)} ph="@eliteacademy.kg" />
        <TIn l="TikTok (ссылка)" v={office.tiktok || ""} on={(v) => updO("tiktok", v)} ph="https://www.tiktok.com/@eliteacademy.kg" />
        <TIn l="Telegram (ссылка)" v={office.telegram || ""} on={(v) => updO("telegram", v)} ph="https://t.me/eliteacademykg" />
        <TIn l="Адрес для Google Maps" v={office.map} on={(v) => updO("map", v)} />
      </div>
    </div>
  );
}

/* ============================================================
   PUBLISH SETTINGS
   ============================================================ */
function PublishSettings({ token, setToken, branch, setBranch, onExport }) {
  return (
    <div className="aform" style={{ maxWidth: 720 }}>
      <div className="aform__head"><h3>⚙️ Настройка публикации</h3></div>
      <div className="aform__grid">
        <div className="aform__divider">Публикация в один клик (GitHub)</div>
        <F l="Ключ доступа (GitHub token)" wide>
          <input type="password" value={token} placeholder="github_pat_…"
                 onChange={(e) => setToken(e.target.value)} />
        </F>
        <Sel l="Ветка" v={branch} on={setBranch} opts={["for-public", "dev", "main"]} />
        <div className="ahint" style={{ gridColumn: "1 / -1", marginTop: 0 }}>
          Ключ хранится только в этом браузере. Относись к нему как к паролю.
        </div>
        <div className="aform__sub">
          <div className="aform__sub-h">Как получить ключ (делается один раз, ~3 минуты)</div>
          <ol className="asteps">
            <li>Зайди на <b>github.com</b> под аккаунтом, у которого есть доступ к репозиторию <b>{GH_OWNER}/{GH_REPO}</b></li>
            <li>Settings → Developer settings → <b>Personal access tokens → Fine-grained tokens</b> → Generate new token</li>
            <li>Repository access: <b>Only select repositories</b> → выбери <b>{GH_REPO}</b></li>
            <li>Permissions → Repository permissions → <b>Contents: Read and write</b></li>
            <li>Generate token → скопируй и вставь в поле выше</li>
          </ol>
        </div>
        <div className="aform__divider">Запасной вариант — файлом</div>
        <div style={{ gridColumn: "1 / -1" }}>
          <button className="abtn" onClick={onExport}>⬇ Экспортировать content-data.js</button>
          <div className="ahint" style={{ marginTop: 10 }}>
            Скачанный файл нужно положить в папку <code>elite/</code> сайта вместо старого.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MEDIA EDITOR — upload photos for all sections via GitHub API
   ============================================================ */
function MediaEditor({ token, branch, state, setPosts, setSection }) {
  const [tab, setTab] = React.useState("team");
  const [cSel, setCSel] = React.useState(0);
  const [uQ, setUQ] = React.useState("");
  const [uSel, setUSel] = React.useState(null);

  const TABS = [
    ["team",      "Команда"],
    ["countries", "Страны"],
    ["unis",      "Вузы"],
    ["students",  "Студенты"],
    ["blog",      "Блог"],
  ];

  const uSlug = (u) => u.short.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const filteredUnis = React.useMemo(() => {
    const q = uQ.toLowerCase();
    return state.unis
      .map((u, i) => ({ u, i }))
      .filter(({ u }) => !q || u.name.toLowerCase().includes(q) || u.short.toLowerCase().includes(q));
  }, [state.unis, uQ]);
  const selUni = uSel != null ? state.unis[uSel] : null;

  const cList = state.countries;
  const selC = cList[cSel] || null;
  const cSlug = selC
    ? (selC.det && selC.det.slug) || selC.card.name.toLowerCase().replace(/[ёе]/g, "e").replace(/[^a-z0-9]+/g, "")
    : "";

  if (!token) {
    return (
      <div className="aform" style={{ maxWidth: 600 }}>
        <div className="aform__head"><h3>📸 Медиа</h3></div>
        <p style={{ padding: "16px 0", color: "var(--muted)", fontSize: 14 }}>
          Для загрузки файлов нужен GitHub token.{" "}
          <button className="abtn" style={{ marginLeft: 8 }} onClick={() => setSection("publish")}>
            Открыть настройки публикации →
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="aform" style={{ maxWidth: 1000 }}>
      <div className="aform__head"><h3>📸 Медиа — загрузка фото</h3></div>

      <div className="mtabs">
        {TABS.map(([k, l]) => (
          <button key={k} className={"mtab" + (tab === k ? " is-on" : "")} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {/* Команда */}
      {tab === "team" && (
        <div>
          <div className="ahint" style={{ marginBottom: 16 }}>
            Фото команды используется в hero-секции главной страницы и на страницах «О нас» и «Истории».
            Рекомендуемый размер: 1400 × 900 px, JPG.
          </div>
          <div className="mgrid">
            <UploadSlot label="Фото команды" path="images/team.jpg" token={token} branch={branch} />
          </div>
        </div>
      )}

      {/* Страны */}
      {tab === "countries" && (
        <div>
          <div className="mselector">
            {cList.map((c, i) => (
              <button key={i} className={"mchip" + (cSel === i ? " is-on" : "")} onClick={() => setCSel(i)}>
                {c.card.flag} {c.card.name}
              </button>
            ))}
          </div>
          {selC && (
            <div>
              <div className="ahint" style={{ marginBottom: 16 }}>
                Папка: <code>images/countries/{cSlug}/</code> · 4 фото галереи (1.jpg … 4.jpg) · Размер: 1200 × 800 px.
              </div>
              <div className="mgrid">
                {[1, 2, 3, 4].map((n) => (
                  <UploadSlot
                    key={n}
                    label={"Фото " + n}
                    path={"images/countries/" + cSlug + "/" + n + ".jpg"}
                    token={token} branch={branch}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Вузы */}
      {tab === "unis" && (
        <div className="asplit">
          <div className="alist">
            <div className="alist__top">
              <input className="alist__search" placeholder="Поиск вуза…" value={uQ} onChange={(e) => setUQ(e.target.value)} />
            </div>
            <div className="alist__scroll">
              {filteredUnis.map(({ u, i }) => (
                <button key={i} className={"alist__row" + (uSel === i ? " is-on" : "")} onClick={() => setUSel(i)}>
                  <span className="alist__flag">{FLAGS[u.country] || "🌍"}</span>
                  <span className="alist__name">{u.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            {selUni ? (
              <div>
                <div className="aform__divider" style={{ marginTop: 0 }}>
                  {selUni.name}
                </div>
                <div className="ahint" style={{ marginBottom: 12 }}>
                  Главное фото в каталоге — отображается на карточке и в шапке страницы вуза.
                </div>
                <div className="mgrid" style={{ marginBottom: 20 }}>
                  <UploadSlot
                    label="Фото для каталога"
                    path={"images/campus/" + uSlug(selUni) + ".jpg"}
                    token={token} branch={branch}
                    hint="images/campus/<slug>.jpg · 1400×900 px"
                  />
                </div>
                <div className="ahint" style={{ marginBottom: 12 }}>
                  Галерея на странице вуза — 4 фото, 1200×800 px:
                </div>
                <div className="mgrid">
                  {["Кампус", "Корпуса", "Общежитие", "Студ. жизнь"].map((lbl, idx) => (
                    <UploadSlot
                      key={idx}
                      label={lbl}
                      path={"images/unis/" + uSlug(selUni) + "/" + (idx + 1) + ".jpg"}
                      token={token} branch={branch}
                    />
                  ))}
                </div>
                <div className="ahint" style={{ marginTop: 14 }}>
                  Видео-тур: загружай напрямую в репозиторий GitHub →{" "}
                  <code>videos/unis/{uSlug(selUni)}/tour.mp4</code>
                </div>
              </div>
            ) : (
              <div className="aform--empty">← Выбери вуз из списка</div>
            )}
          </div>
        </div>
      )}

      {/* Студенты */}
      {tab === "students" && (
        <div>
          <div className="ahint" style={{ marginBottom: 16 }}>
            Превью-фото для карточек видео-отзывов студентов. Размер: 400 × 400 px (квадрат), JPG.<br />
            Видео добавляй через раздел «Видео-отзывы», пути прописывай там же.
          </div>
          <div className="mgrid">
            {state.storyGrid.map((g, i) => (
              <UploadSlot
                key={i}
                label={g.n}
                path={g.poster || ("thumbs/" + g.n.toLowerCase() + ".jpg")}
                token={token} branch={branch}
                hint={g.video ? "Видео: " + g.video : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Блог */}
      {tab === "blog" && (
        <div>
          <div className="ahint" style={{ marginBottom: 16 }}>
            Обложки статей блога. Размер: 800 × 480 px, JPG.<br />
            После загрузки нажми <b>«💾 Сохранить»</b> вверху — путь к обложке запишется в данные статьи.
          </div>
          <div className="mgrid">
            {state.posts.map((p, i) => {
              const coverPath = p.cover || ("images/blog/" + (i + 1) + ".jpg");
              return (
                <UploadSlot
                  key={i}
                  label={p.t || "Статья " + (i + 1)}
                  path={coverPath}
                  token={token} branch={branch}
                  onSuccess={(path) => {
                    const updated = state.posts.map((pp, j) => j === i ? { ...pp, cover: path } : pp);
                    setPosts(updated);
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminApp() {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) { return false; }
  });
  const [state, setState] = useState(buildInitial);
  const [section, setSection] = useState("unis");
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const hasDraft = useMemo(() => { try { return !!localStorage.getItem(LS_KEY); } catch (e) { return false; } }, [savedAt]);
  const [ghToken, setGhTokenState] = useState(() => { try { return localStorage.getItem(GH_TOKEN_KEY) || ""; } catch (e) { return ""; } });
  const [ghBranch, setGhBranchState] = useState(() => { try { return localStorage.getItem(GH_BRANCH_KEY) || "for-public"; } catch (e) { return "for-public"; } });
  const [pub, setPub] = useState({ busy: false, ok: null, err: null });
  const setGhToken = (v) => { setGhTokenState(v); try { localStorage.setItem(GH_TOKEN_KEY, v); } catch (e) {} };
  const setGhBranch = (v) => { setGhBranchState(v); try { localStorage.setItem(GH_BRANCH_KEY, v); } catch (e) {} };

  const set = (k) => (v) => { setState((s) => ({ ...s, [k]: v })); setDirty(true); };
  const setCountries = (v) => { setState((s) => ({ ...s, countries: v })); setDirty(true); };

  /* sha опубликованного контента на момент открытия админки — чтобы поймать
     параллельную публикацию коллеги перед перезаписью (репозиторий публичный,
     GET работает без токена) */
  const loadedShaRef = useRef(null);
  useEffect(() => {
    if (!authed) return;
    fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_PATH}?ref=${encodeURIComponent(ghBranch)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (j && j.sha) loadedShaRef.current = j.sha; })
      .catch(() => {});
  }, [authed, ghBranch]);

  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(buildContent(state)));
      setDirty(false);
      setSavedAt(Date.now());
    } catch (e) { alert("Не удалось сохранить: " + e.message); }
  }

  async function publish() {
    if (!ghToken) {
      setSection("publish");
      setPub({ busy: false, ok: null, err: "Сначала вставь ключ доступа GitHub — инструкция ниже." });
      return;
    }
    if (!window.confirm(`Опубликовать изменения для всех? (репозиторий ${GH_OWNER}/${GH_REPO}, ветка ${ghBranch})`)) return;
    save();
    setPub({ busy: true, ok: null, err: null });
    try {
      const r = await ghPublish(ghToken, ghBranch, contentFileText(buildContent(state)), loadedShaRef.current);
      if (r.contentSha) loadedShaRef.current = r.contentSha;
      setPub({ busy: false, ok: "Опубликовано ✓ (" + (r.commit && r.commit.sha ? r.commit.sha.slice(0, 7) : "ok") + ")", err: null });
    } catch (e) {
      setPub({ busy: false, ok: null, err: e.message });
    }
  }

  function exportFile() {
    const txt = contentFileText(buildContent(state));
    const blob = new Blob([txt], { type: "text/javascript;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "content-data.js";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function reset() {
    if (!window.confirm("Удалить все локальные правки и вернуться к опубликованной версии?")) return;
    try { localStorage.removeItem(LS_KEY); } catch (e) {}
    location.reload();
  }

  function logout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
    setAuthed(false);
  }

  useEffect(() => {
    // предупреждаем при закрытии вкладки, если есть несохранённые правки
    // ИЛИ идёт загрузка в фоне (иначе прервётся сжатие/выгрузка видео)
    const onBeforeUnload = (e) => { if (dirty || uploadMgr.active()) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  if (!authed) return <Login onOk={() => setAuthed(true)} />;

  return (
    <div className="admin">
      <header className="atop">
        <div className="atop__brand">
          <span className="alogin__logo alogin__logo--sm">EA</span>
          <b>Админ-панель</b>
          {hasDraft && <span className="atop__draft">● локальные правки активны</span>}
          {dirty && <span className="atop__dirty">несохранённые изменения</span>}
        </div>
        <div className="atop__act">
          <a href="index.html" target="_blank" rel="noopener" className="abtn">Открыть сайт ↗</a>
          <button className="abtn" onClick={reset}>↺ Сбросить правки</button>
          <button className="abtn abtn--primary" onClick={save}>💾 Сохранить</button>
          <button className="abtn abtn--gold" onClick={publish} disabled={pub.busy}>
            {pub.busy ? "Публикуем…" : "🚀 Опубликовать"}
          </button>
          <button className="abtn" onClick={logout}>Выйти</button>
        </div>
      </header>
      {(pub.ok || pub.err) && (
        <div className={"apub " + (pub.err ? "apub--err" : "apub--ok")}>
          {pub.ok || pub.err}
          <button className="apub__x" onClick={() => setPub({ busy: false, ok: null, err: null })}>✕</button>
        </div>
      )}

      <div className="abody">
        <nav className="aside">
          {SECTIONS.map(([k, l]) => (
            <button key={k} className={"aside__item" + (section === k ? " is-on" : "")} onClick={() => setSection(k)}>{l}</button>
          ))}
          <div className="aside__help">
            <b>Как это работает</b>
            <ol>
              <li>Правишь контент</li>
              <li>«Сохранить» — предпросмотр на сайте в этом браузере</li>
              <li>«Опубликовать» — правки уходят в репозиторий и попадают на сайт</li>
            </ol>
          </div>
        </nav>

        <main className="amain">
          {section === "home" && (
            <>
              <HomeEditor home={state.home} setHome={set("home")} beyond={state.beyond} setBeyond={set("beyond")} token={ghToken} branch={ghBranch} />
              <div className="amain__note" style={{ marginTop: 26 }}>Блок «Почему Elite Academy» (аккордеон с фото):</div>
              <SimpleList
                list={state.painItems} setList={set("painItems")} titleKey="title" addLabel="+ Пункт"
                token={ghToken} branch={ghBranch}
                addTemplate={{ title: "Новый пункт", body: "", photo: "images/about1.jpg" }}
                schema={[["title", "Заголовок"], ["body", "Текст", "area"], ["photo", "Фото", "imgpath"]]}
              />
            </>
          )}
          {section === "reviews" && (
            <>
              <div className="amain__note">Блок «Что говорят наши клиенты» (2GIS) на главной.</div>
              <div className="aform" style={{ maxWidth: 860, marginBottom: 20 }}>
                <div className="aform__grid">
                  <TIn l="Строка рейтинга (текст перед ссылкой на 2GIS)" v={state.reviews.sub || ""} on={(v) => set("reviews")({ ...state.reviews, sub: v })} ph="Рейтинг 4.9 · 196 отзывов на " wide />
                </div>
              </div>
              <SimpleList
                list={state.reviews.items || []} setList={(v) => set("reviews")({ ...state.reviews, items: v })}
                titleKey="name" addLabel="+ Отзыв"
                token={ghToken} branch={ghBranch}
                addTemplate={{ name: "Имя Ф.", stars: 5, text: "", date: "" }}
                schema={[["name", "Имя"], ["stars", "Звёзды (1–5)"], ["text", "Текст отзыва", "area"], ["date", "Дата (текстом)"]]}
              />
            </>
          )}
          {section === "unis" && <UnisEditor list={state.unis} setList={set("unis")} token={ghToken} branch={ghBranch} />}
          {section === "countries" && <CountriesEditor list={state.countries} setList={setCountries} />}
          {section === "stories" && (
            <>
              <div className="amain__note">
                Карусель больших историй (главная и «Истории»). Ниже — сетка студентов.<br />
                <b>Размер фото-обложки: вертикальное, 9:16 (например 720×1280 px).</b> Видео — тоже вертикальное.
              </div>
              <SimpleList
                list={state.storyCards} setList={set("storyCards")} titleKey="name" addLabel="+ История"
                token={ghToken} branch={ghBranch}
                addTemplate={{ name: "Имя", from: "🇺🇸 США", quote: "", uni: "🎓 Университет", videoSrc: "videos/имя.mp4", poster: "thumbs/имя.jpg" }}
                schema={[["name", "Имя"], ["from", "Страна (с флагом)"], ["quote", "Цитата", "area"], ["uni", "Подпись вуза"], ["videoSrc", "Путь к видео", "vidpath"], ["poster", "Превью (обложка)", "imgpath"]]}
              />
              <div className="amain__note" style={{ marginTop: 26 }}>
                Сетка студентов (фильтруется по стране).<br />
                <b>Размер фото: горизонтальное, 4:3 (например 800×600 px), лицо ближе к верху.</b> Видео — тоже 4:3.
              </div>
              <SimpleList
                list={state.storyGrid} setList={set("storyGrid")} titleKey="n" addLabel="+ Студент"
                token={ghToken} branch={ghBranch}
                addTemplate={{ n: "Имя", u: "Университет", s: "Грант", t: "Италия", level: "", video: "", poster: "" }}
                schema={[["n", "Имя"], ["u", "Университет"], ["s", "Сумма / грант"], ["t", "Страна (для фильтра)", "select", COUNTRY_OPTS], ["level", "Куда поступил(а)", "select", LEVEL_OPTS], ["video", "Путь к видео (videos/…)", "vidpath"], ["poster", "Превью (thumbs/…)", "imgpath"]]}
              />
            </>
          )}
          {section === "videos" && (
            <>
              <div className="amain__note">
                Лента видео-отзывов на главной.<br />
                <b>Видео и фото-обложка — вертикальные, 9:16 (например 720×1280 px).</b>
              </div>
              <SimpleList
                list={state.videos} setList={set("videos")} titleKey="name" addLabel="+ Видео"
                token={ghToken} branch={ghBranch}
                addTemplate={{ name: "Имя", country: "🇺🇸 США", src: "videos/имя.mp4", poster: "thumbs/имя.jpg", tag: "Отзыв" }}
                schema={[["name", "Имя"], ["country", "Страна (с флагом)"], ["src", "Путь к видео (videos/…)", "vidpath"], ["poster", "Превью (thumbs/…)", "imgpath"], ["tag", "Метка", "select", ["Отзыв", "Интервью"]]]}
              />
            </>
          )}
          {section === "posts" && (
            <SimpleList
              list={state.posts} setList={set("posts")} titleKey="t" addLabel="+ Статья"
              addTemplate={{ cat: "США", t: "Заголовок статьи", time: "5 мин", date: "", cover: "" }}
              schema={[["t", "Заголовок"], ["cat", "Категория"], ["time", "Время чтения"], ["date", "Дата (текстом)"], ["cover", "Обложка (путь к файлу)"]]}
            />
          )}
          {section === "about" && (
            <>
              <AboutEditor
                about={state.about} setAbout={set("about")}
                team={state.team} setTeam={set("team")}
                office={state.office} setOffice={set("office")}
                token={ghToken} branch={ghBranch}
              />
              <div className="amain__note" style={{ marginTop: 26 }}>Карточки «Аккредитации и партнёры»:</div>
              <SimpleList
                list={state.accreds} setList={set("accreds")} titleKey="name" addLabel="+ Карточка"
                token={ghToken} branch={ghBranch}
                addTemplate={{ name: "Название", tag: "Партнёрство", desc: "", logo: "" }}
                schema={[["name", "Название"], ["tag", "Метка"], ["desc", "Описание", "area"], ["logo", "Логотип", "imgpath"]]}
              />
            </>
          )}
          {section === "careers" && (
            <CareersEditor careers={state.careers} setCareers={set("careers")} token={ghToken} branch={ghBranch} />
          )}
          {section === "media" && (
            <MediaEditor token={ghToken} branch={ghBranch} state={state} setPosts={set("posts")} setSection={setSection} />
          )}
          {section === "publish" && (
            <PublishSettings token={ghToken} setToken={setGhToken} branch={ghBranch} setBranch={setGhBranch} onExport={exportFile} />
          )}
        </main>
      </div>
      <UploadCenter />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AdminApp />);
