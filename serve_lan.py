"""
Elite Academy — сервер dev-версии сайта для офисной сети (LAN).

Отличия от serve.py (тот — для работы на своей машине):
  - слушает все интерфейсы, чтобы сайт открывался с телефонов и ноутбуков
    коллег по офисному WiFi;
  - пускает ТОЛЬКО клиентов из локальной сети (10.x, 172.16–31.x, 192.168.x,
    127.x). Любой запрос с внешнего адреса получает 403 — даже если машину
    случайно выставят в интернет или пробросят порт на роутере;
  - при старте печатает готовую ссылку, которую можно скинуть команде;
  - пишет лог обращений, чтобы было видно, кто заходил.

Файл самодостаточный: его можно скопировать на сервер один, без остального
репозитория рядом (нужны только сами файлы сайта в той же папке).

Запуск:
    py -3 serve_lan.py            ->  порт 8080
    py -3 serve_lan.py 5000       ->  любой другой порт
"""
import http.server
import ipaddress
import os
import socket
import sys
from datetime import datetime

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
ROOT = os.path.dirname(os.path.abspath(__file__))


# Сети, которые считаем «офисными». Именно список, а не ip.is_private:
# is_private в Python пропускает ещё и документационные диапазоны
# (203.0.113.0/24 и т.п.), которые к локальной сети отношения не имеют.
LAN_NETWORKS = [
    ipaddress.ip_network("10.0.0.0/8"),      # частная сеть
    ipaddress.ip_network("172.16.0.0/12"),   # частная сеть
    ipaddress.ip_network("192.168.0.0/16"),  # обычный офисный роутер
    ipaddress.ip_network("127.0.0.0/8"),     # сама машина
    ipaddress.ip_network("169.254.0.0/16"),  # авто-адрес без DHCP
    ipaddress.ip_network("::1/128"),         # localhost IPv6
    ipaddress.ip_network("fc00::/7"),        # частная сеть IPv6
    ipaddress.ip_network("fe80::/10"),       # link-local IPv6
]


def is_lan_client(addr):
    """True для адресов офисной сети и localhost."""
    try:
        ip = ipaddress.ip_address(addr)
    except ValueError:
        return False
    # IPv4-mapped IPv6 (::ffff:192.168.1.5) — разворачиваем в обычный IPv4
    if getattr(ip, "ipv4_mapped", None):
        ip = ip.ipv4_mapped
    return any(ip in net for net in LAN_NETWORKS)


def lan_addresses():
    """Все локальные IP машины — чтобы показать команде рабочую ссылку."""
    found = []
    # основной адрес: наружу ничего не шлём, ядро само выбирает интерфейс
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("10.255.255.255", 1))
        found.append(s.getsockname()[0])
    except OSError:
        pass
    finally:
        s.close()
    # остальные интерфейсы (несколько сетевых карт / WiFi + Ethernet)
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            found.append(info[4][0])
    except OSError:
        pass
    uniq = []
    for a in found:
        if a not in uniq and is_lan_client(a) and not a.startswith("127."):
            uniq.append(a)
    return uniq


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    # ---- доступ только из локальной сети ----
    def _client_allowed(self):
        return is_lan_client(self.client_address[0])

    def _deny(self):
        body = "Доступ только из офисной сети".encode("utf-8")
        self.send_response(403)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        try:
            self.wfile.write(body)
        except OSError:
            pass
        self.log(self.path, "403 чужой адрес")

    def do_GET(self):
        if not self._client_allowed():
            self._deny()
            return
        raw = self.path
        path = raw.split("?", 1)[0].split("#", 1)[0]
        # "/" или "/foo/" -> index.html этой папки
        if path.endswith("/"):
            candidate = os.path.join(ROOT, path.lstrip("/"), "index.html")
            if os.path.exists(candidate):
                self.path = path + "index.html" + raw[len(path):]
        # "/universities" -> universities.html, сохраняя ?query и #hash
        elif "." not in os.path.basename(path):
            candidate = os.path.join(ROOT, path.lstrip("/") + ".html")
            if os.path.exists(candidate):
                self.path = path + ".html" + raw[len(path):]
        self.log(raw, "")
        self._safe(super().do_GET)

    def do_HEAD(self):
        if not self._client_allowed():
            self._deny()
            return
        self._safe(super().do_HEAD)

    def end_headers(self):
        # dev-версия: не кэшируем, чтобы правки были видны сразу после F5
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        # сайт внутренний — не даём встраивать его в чужие страницы
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        super().end_headers()

    def copyfile(self, source, outputfile):
        # видео могут обрывать на середине — это нормально, не роняем сервер
        self._safe(lambda: super(Handler, self).copyfile(source, outputfile))

    @staticmethod
    def _safe(fn):
        try:
            fn()
        except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
            pass  # браузер закрыл соединение (перемотка видео и т.п.)

    def log(self, path, note):
        stamp = datetime.now().strftime("%d.%m %H:%M:%S")
        print(f"{stamp}  {self.client_address[0]:<15} {path} {note}".rstrip(), flush=True)

    def log_message(self, *args):
        pass  # свой формат лога выше


try:
    ServerClass = http.server.ThreadingHTTPServer
except AttributeError:  # pragma: no cover
    import socketserver

    class ServerClass(socketserver.ThreadingMixIn, http.server.HTTPServer):
        daemon_threads = True


ServerClass.allow_reuse_address = True

if __name__ == "__main__":
    ips = lan_addresses()
    print()
    print("=" * 58)
    print("  Elite Academy — dev-версия сайта запущена")
    print("=" * 58)
    if ips:
        print("  Ссылка для команды (открывать в офисном WiFi):")
        for ip in ips:
            print(f"      http://{ip}:{PORT}")
    else:
        print("  ВНИМАНИЕ: не нашёл локальный IP — проверь, что машина")
        print("  подключена к офисной сети.")
    print(f"  На этой машине:  http://localhost:{PORT}")
    print()
    print("  Доступ разрешён только из локальной сети.")
    print("  Остановить — Ctrl+C. Окно не закрывать.")
    print("=" * 58)
    print()
    try:
        ServerClass(("", PORT), Handler).serve_forever()
    except KeyboardInterrupt:
        print("\nСервер остановлен.")
    except OSError as e:
        print(f"\nНе удалось занять порт {PORT}: {e}")
        print(f"Скорее всего он занят. Запусти с другим портом: py -3 serve_lan.py {PORT + 1}")
        sys.exit(1)
