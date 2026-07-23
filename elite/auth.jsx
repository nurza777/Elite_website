/* ============================================================
   AUTH GATE — login wall for the dev/internal site
   Credentials are stored as a SHA-256 hash (never plain text).
   Session is kept in sessionStorage — clears on tab/browser close.
   ============================================================ */

const AUTH_KEY  = "ea_dev_auth";        // sessionStorage key
const AUTH_HASH = "f04a03268888d3a2ba3f0e233b34fd7338d968241e69859ae1c0927abadd2976";

/* SHA-256 своими силами. Нужен потому, что crypto.subtle браузеры дают
   только в защищённом контексте (HTTPS или localhost). Когда сайт открыт
   в офисной сети по http://192.168.x.x, crypto.subtle отсутствует — без
   этого запасного варианта форма входа зависала бы навсегда. */
const SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

function sha256Fallback(bytes) {
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
           0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const len = bytes.length;
  /* дополнение: 0x80, нули, и 64-битная длина в конце — до кратности 64 байт */
  const padded = new Uint8Array((Math.floor((len + 8) / 64) + 1) * 64);
  padded.set(bytes);
  padded[len] = 0x80;
  const dv = new DataView(padded.buffer);
  const bitLen = len * 8;
  dv.setUint32(padded.length - 8, Math.floor(bitLen / 4294967296), false);
  dv.setUint32(padded.length - 4, bitLen >>> 0, false);
  const w = new Uint32Array(64);
  for (let off = 0; off < padded.length; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4, false);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    H = [(H[0] + a) >>> 0, (H[1] + b) >>> 0, (H[2] + c) >>> 0, (H[3] + d) >>> 0,
         (H[4] + e) >>> 0, (H[5] + f) >>> 0, (H[6] + g) >>> 0, (H[7] + h) >>> 0];
  }
  return H.map((x) => x.toString(16).padStart(8, "0")).join("");
}

async function sha256(str) {
  const bytes = new TextEncoder().encode(str);
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return sha256Fallback(bytes);
}

function AuthGate({ children }) {
  /* The session stores the hash it was opened with — changing AUTH_HASH
     (i.e. the password) instantly invalidates every existing session. */
  const [authed, setAuthed] = React.useState(() => sessionStorage.getItem(AUTH_KEY) === AUTH_HASH);
  const [login, setLogin]   = React.useState("");
  const [pass,  setPass]    = React.useState("");
  const [error, setError]   = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const hash = await sha256(login.trim() + ":" + pass);
      if (hash === AUTH_HASH) {
        sessionStorage.setItem(AUTH_KEY, AUTH_HASH);
        setAuthed(true);
      } else {
        setError("Неверный логин или пароль");
      }
    } catch (err) {
      /* без catch любая ошибка оставляла кнопку в «Проверяем…» навсегда */
      setError("Не удалось проверить пароль. Обнови страницу и попробуй снова.");
    }
    setLoading(false);
  }

  if (authed) return children;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #06172a 0%, #0a2d52 60%, #0e3d6e 100%)",
      padding: "20px",
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px", padding: "44px 40px 36px",
        width: "100%", maxWidth: "400px",
        boxShadow: "0 32px 80px rgba(0,0,0,.35)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <img src="images/logo.png" alt="Elite Academy" style={{ height: "48px", objectFit: "contain" }}
            onError={e => { e.target.style.display = "none"; }} />
          <div style={{ fontFamily: "Raleway, sans-serif", fontWeight: 900, fontSize: "22px",
            color: "#06172a", marginTop: "12px" }}>Elite Academy</div>
          <div style={{ fontSize: "13px", color: "#8898aa", marginTop: "4px" }}>Внутренняя панель</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#06172a" }}>Логин</label>
            <input
              type="text" autoComplete="username"
              value={login} onChange={e => setLogin(e.target.value)}
              placeholder="Введите логин"
              required
              style={{
                padding: "12px 16px", borderRadius: "10px", fontSize: "15px",
                border: "1.5px solid #e0e6ef", background: "#f8fafc", outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#06172a" }}>Пароль</label>
            <input
              type="password" autoComplete="current-password"
              value={pass} onChange={e => setPass(e.target.value)}
              placeholder="Введите пароль"
              required
              style={{
                padding: "12px 16px", borderRadius: "10px", fontSize: "15px",
                border: "1.5px solid #e0e6ef", background: "#f8fafc", outline: "none",
              }}
            />
          </div>

          {error && (
            <div style={{
              background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "8px",
              padding: "10px 14px", fontSize: "13.5px", color: "#c0392b", textAlign: "center",
            }}>{error}</div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              marginTop: "6px", padding: "14px", borderRadius: "12px", border: "none",
              background: loading ? "#8898aa" : "#c9a84c",
              color: "#fff", fontFamily: "Raleway, sans-serif",
              fontWeight: 800, fontSize: "15px", cursor: loading ? "default" : "pointer",
              transition: "background .2s",
            }}
          >
            {loading ? "Проверяем…" : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

window.AuthGate = AuthGate;
