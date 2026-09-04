from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os, socket, ssl, threading, urllib.request

BASE = "/root/sites"
CERT = "/etc/letsencrypt/live/chaev.bratuxa.zomb.top/fullchain.pem"
KEY = "/etc/letsencrypt/live/chaev.bratuxa.zomb.top/privkey.pem"
# Хосты, отдаваемые из подпапки сборки (Vite dist/ как корень сайта).
STATIC_ROOTS = {"chaev.bratuxa.zomb.top": "dist", "sasha.bratuxa.zomb.top": "dist"}
# локальные API-бэкенды: host -> порт (прокси /api/*, включая WS-апгрейд /api/ws)
API_BACKENDS = {"miqqil.bratuxa.zomb.top": 8091, "evaelph.bratuxa.zomb.top": 8092, "hub.bratuxa.zomb.top": 8093}

class VHostHandler(SimpleHTTPRequestHandler):
    def _ws_proxy(self):
        # прозрачный TCP-туннель для WebSocket-апгрейда: TLS терминируется тут,
        # дальше — сырой поток байт до Bun (127.0.0.1:8091), который сам ведёт WS-рукопожатие.
        if self.headers.get("Upgrade", "").lower() != "websocket":
            return False
        if self.path not in ("/api/ws", "/ws") and not self.path.startswith("/api/ws?"):
            return False
        host = self.headers.get("Host", "").split(":")[0].lower()
        port = API_BACKENDS.get(host)
        if not port:
            return False
        try:
            upstream = socket.create_connection(("127.0.0.1", port), timeout=10)
        except OSError:
            self.send_response(502); self.end_headers()
            return True
        try:
            req_line = f"{self.command} {self.path} {self.request_version}\r\n"
            upstream.sendall(req_line.encode("latin-1", "replace"))
            for k, v in self.headers.items():
                upstream.sendall(f"{k}: {v}\r\n".encode("latin-1", "replace"))
            upstream.sendall(b"\r\n")
            # Клиент по протоколу WS ждёт 101-ответ прежде чем слать фреймы, так что
            # тела запроса тут не бывает — не трогаем rfile дальше (peek() на пустом
            # буфере блокируется в ожидании байт, которых не будет, и вешает рукопожатие).
        except OSError:
            upstream.close()
            return True
        client_sock = self.connection
        self.close_connection = True

        def pipe(src, dst):
            try:
                while True:
                    data = src.recv(65536)
                    if not data:
                        break
                    dst.sendall(data)
            except OSError:
                pass
            finally:
                try: dst.shutdown(socket.SHUT_WR)
                except OSError: pass

        t1 = threading.Thread(target=pipe, args=(client_sock, upstream), daemon=True)
        t2 = threading.Thread(target=pipe, args=(upstream, client_sock), daemon=True)
        t1.start(); t2.start()
        t1.join(); t2.join()
        try: upstream.close()
        except OSError: pass
        return True

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
        if self._ws_proxy():
            return
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
