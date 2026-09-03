from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os, ssl, threading

BASE = "/root/sites"
CERT = "/etc/letsencrypt/live/chaev.bratuxa.zomb.top/fullchain.pem"
KEY = "/etc/letsencrypt/live/chaev.bratuxa.zomb.top/privkey.pem"

class VHostHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        host = self.headers.get("Host", "").split(":")[0].lower()
        for cand in [host, "chaev.bratuxa.zomb.top"]:
            d = os.path.join(BASE, cand)
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
