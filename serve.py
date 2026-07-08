"""
Static dev server for the Elite Academy site.

Why not `python -m http.server`?
  - It 404s on extensionless URLs (e.g. /universities) — this server rewrites
    them to .html automatically.
  - It is single-threaded and crashes with ConnectionAbortedError when the
    browser cancels a video download — this server is threaded and ignores
    those harmless disconnects.

Run:
    python serve.py            ->  http://localhost:8080
    python serve.py 3456       ->  http://localhost:3456   (any port)
"""
import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        raw = self.path
        path = raw.split("?", 1)[0].split("#", 1)[0]
        # Directory request (e.g. "/" or "/foo/") -> serve that dir's
        # index.html directly instead of falling back to a file listing.
        if path.endswith("/"):
            candidate = os.path.join(ROOT, path.lstrip("/"), "index.html")
            if os.path.exists(candidate):
                self.path = path + "index.html" + raw[len(path):]
        # Extensionless path with no trailing slash -> try the .html file,
        # keeping any ?query / #hash intact.
        elif "." not in os.path.basename(path):
            candidate = os.path.join(ROOT, path.lstrip("/") + ".html")
            if os.path.exists(candidate):
                self.path = path + ".html" + raw[len(path):]
        self._safe(super().do_GET)

    def end_headers(self):
        # Dev server: never cache, so edits to .jsx/.css/.html show on reload
        # (no more "hard-refresh to see changes"). Important here because the
        # browser otherwise runs stale Babel-compiled scripts.
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()

    def copyfile(self, source, outputfile):
        # Wrap the big body-copy (videos!) so an aborted download doesn't crash.
        self._safe(lambda: super(Handler, self).copyfile(source, outputfile))

    @staticmethod
    def _safe(fn):
        try:
            fn()
        except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
            pass  # browser closed the connection — normal while scrubbing video

    def log_message(self, *args):
        pass  # quiet


# ThreadingHTTPServer exists in Python 3.7+; fall back just in case.
try:
    ServerClass = http.server.ThreadingHTTPServer
except AttributeError:  # pragma: no cover
    import socketserver
    class ServerClass(socketserver.ThreadingMixIn, http.server.HTTPServer):
        daemon_threads = True

ServerClass.allow_reuse_address = True

if __name__ == "__main__":
    print(f"Elite site -> http://localhost:{PORT}")
    print("Extensionless URLs like /universities work. Press Ctrl+C to stop.")
    try:
        ServerClass(("", PORT), Handler).serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
