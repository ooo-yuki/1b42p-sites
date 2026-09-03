from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os, ssl, threading, urllib.request

BASE = "/root/sites"
CERT = "/etc/letsencrypt/live/chaev.bratuxa.zomb.top/fullchain.pem"
KEY = "/etc/letsencrypt/live/chaev.bratuxa.zomb.top/privkey.pem"
# Хосты, отдаваемые из подпапки сборки (Vite dist/ как корень сайта).
STATIC_ROOTS = {"chaev.bratuxa.zomb.top": "dist"}
# локальные API-бэкенды: host -> порт (прокси /api/*)
API_BACKENDS = {"miqqil.bratuxa.zomb.top": 8091}

class VHostHandler(SimpleHTTPRequestHandler):
    def _api_proxy(self):
        host = self.headers.get("Host", "").split(":")[0].lower()
        port = API_BACKENDS.get(host)
        if not port:
            return False
        if self.path != "/api" and not self.path.startswith("/api/"):
            return False
        length = int(self.headers.get("Content-Length", 0) or 0)
        body = self.rfile.read(length) if length else None
        req = urllib.request.Request(f"http://127.0.0.1:{port}{self.path}", data=body, method=self.command)
        ctype = self.headers.get("Content-Type")
        if ctype:
            req.add_header("Content-Type", ctype)
        try:
            with urllib.request.urlopen(req, timeout=15) as r:
                data = r.read()
                self.send_response(r.status)
                self.send_header("Content-Type", r.headers.get_content_type() if hasattr(r.headers, "get_content_type") else "application/json")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
        except Exception as e:
            msg = b'{"error":"api-down"}'
            self.send_response(503)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(msg)))
            self.end_headers()
            self.wfile.write(msg)
        return True

    def do_GET(self):
        if self._api_proxy():
            return
        return super().do_GET()

    def do_POST(self):
        if self._api_proxy():
            return
        return super().do_POST()
    def translate_path(self, path):
        host = self.headers.get("Host", "").split(":")[0].lower()
        for cand in [host, "chaev.bratuxa.zomb.top"]:
            d = os.path.join(BASE, cand)
            sub = STATIC_ROOTS.get(cand)
            if sub and os.path.isdir(os.path.join(d, sub)):
                d = os.path.join(d, sub)
            if os.path.isdir(d):
                rel = path.lstrip("/").split("?")[0].split("#")[0]
                if rel == "":
                    return os.path.join(d, "index.html")
                full = os.path.join(d, rel)
                return full
        return super().translate_path(path)
    def log_message(self, fmt, *args):
        pass

def serve_http():
    ThreadingHTTPServer(("0.0.0.0", 80), VHostHandler).serve_forever()

def serve_https():
    srv = ThreadingHTTPServer(("0.0.0.0", 443), VHostHandler)
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ctx.load_cert_chain(CERT, KEY)
    srv.socket = ctx.wrap_socket(srv.socket, server_side=True)
    srv.serve_forever()

if __name__ == "__main__":
    threading.Thread(target=serve_http, daemon=True).start()
    serve_https()
