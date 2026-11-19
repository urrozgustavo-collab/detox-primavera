#!/usr/bin/env python3
"""Detox de Primavera v2 - armado del HTML unico (solo biblioteca estandar).

Uso:
    python v2/build.py                 # escribe index.html, Detox-Primavera-App.html,
                                       # manifest.webmanifest, sw.js e icon.svg en la raiz
    python v2/build.py --fixture --out <carpeta>
                                       # arma una vista previa con los datos de prueba
                                       # (v2/tests/fixtures/data-min.js) en otra carpeta

Orden: CSS = tokens.css, resto alfabetico, print.css al final.
       JS  = data/*.js alfabetico, luego app/*.js alfabetico.
"""
import argparse
import base64
import datetime as _dt
import zlib
import hashlib
import json
import math
import struct
import sys
from pathlib import Path

VERSION = "2.4.0"
NL = chr(10)
V2 = Path(__file__).resolve().parent
ROOT = V2.parent
SRC = V2 / "src"


def fail(msg):
    print("ERROR de armado: " + msg, file=sys.stderr)
    sys.exit(1)


def read(path):
    if not path.is_file():
        fail("falta el archivo " + str(path.relative_to(ROOT)))
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        fail("el archivo no esta en UTF-8: " + str(path.relative_to(ROOT)))


FONT = SRC / "fonts" / "Geist-Variable.woff2"
FONT_SHA256 = "206f01ed08e05c98a51daa7472331c3c71bbb8c1f9d55ea8c70074f3c528a706"


def font_face():
    """Geist (texto de la app) incrustada en base64: sin pedidos a internet. Se verifica el SHA-256 de FUENTES.md."""
    if not FONT.is_file():
        fail("falta la fuente " + str(FONT.relative_to(ROOT)))
    raw = FONT.read_bytes()
    if hashlib.sha256(raw).hexdigest() != FONT_SHA256:
        fail("el SHA-256 de Geist-Variable.woff2 no coincide con v2/src/fonts/FUENTES.md")
    b64 = base64.b64encode(raw).decode("ascii")
    return ("/* ==== Geist (SIL OFL 1.1, ver v2/src/fonts/) ==== */" + NL +
            "@font-face { font-family: \"Geist\"; font-style: normal; font-weight: 100 900; font-display: swap; "
            "src: url(data:font/woff2;base64," + b64 + ") format(\"woff2\"); }" + NL)


def css_files():
    d = SRC / "styles"
    if not d.is_dir():
        fail("falta la carpeta v2/src/styles")
    names = sorted(p.name for p in d.glob("*.css"))
    for req in ("tokens.css", "print.css"):
        if req not in names:
            fail("falta v2/src/styles/" + req)
    mid = [n for n in names if n not in ("tokens.css", "print.css")]
    return [d / "tokens.css"] + [d / n for n in mid] + [d / "print.css"]


def data_files(fixture):
    if fixture:
        return [V2 / "tests" / "fixtures" / "data-min.js"]
    d = SRC / "data"
    data = sorted(d.glob("*.js"))
    if not any(p.name == "00-namespace.js" for p in data):
        fail("falta v2/src/data/00-namespace.js")
    return data


def compress_data(paths):
    """Concatena los datos y los comprime (DEFLATE crudo de zlib, stdlib) en base64."""
    text = "".join(NL + "/* ==== %s ==== */" % p.relative_to(V2).as_posix() + NL + read(p) for p in paths)
    raw = text.encode("utf-8")
    co = zlib.compressobj(9, zlib.DEFLATED, -15)
    packed = co.compress(raw) + co.flush()
    if zlib.decompress(packed, -15) != raw:
        fail("la compresion de datos no es reversible")
    return base64.b64encode(packed).decode("ascii"), len(raw)


def safe_js(text, name):
    # Un "</script" literal cortaria el bloque <script> del HTML.
    if "</script" in text.lower():
        text = text.replace("</script", "<\\/script").replace("</SCRIPT", "<\\/SCRIPT")
    return "\n/* ==== " + name + " ==== */\n" + text


ICON_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#446650"/><path d="M32 54V30" stroke="#FCF8F6" stroke-width="3.5" stroke-linecap="round" fill="none"/><path d="M32 36c-9 0-15-6-15-15 9 0 15 6 15 15z" fill="#DCE8DF"/><path d="M32 30c0-9 6-15 15-15 0 9-6 15-15 15z" fill="#FCF8F6"/><circle cx="32" cy="13" r="4" fill="#C9542F"/></svg>"""


def png_icon(size):
    """Rasteriza el icono de la planta (mismo dibujo que icon.svg) a PNG RGBA, solo con stdlib."""
    bg = (0x44, 0x66, 0x50); paper = (0xFC, 0xF8, 0xF6); soft = (0xDC, 0xE8, 0xDF); bloom = (0xC9, 0x54, 0x2F)
    ss = 3  # supermuestreo para bordes suaves
    k = 64.0 / size

    def in_round_rect(x, y):
        r = 14.0
        cx = min(max(x, r), 64 - r); cy = min(max(y, r), 64 - r)
        return (x - cx) ** 2 + (y - cy) ** 2 <= r * r and 0 <= x <= 64 and 0 <= y <= 64

    def in_leaf(x, y, x0, y0, x1, y1):
        # hoja = lente entre dos arcos que unen (x0,y0) y (x1,y1)
        mx, my = (x0 + x1) / 2, (y0 + y1) / 2
        dx, dy = x1 - x0, y1 - y0
        L = math.hypot(dx, dy); ux, uy = dx / L, dy / L
        px, py = x - mx, y - my
        a = px * ux + py * uy; b = -px * uy + py * ux
        half = L / 2
        if abs(a) > half:
            return False
        w = 0.42 * half * math.sqrt(max(0.0, 1 - (a / half) ** 2))
        return abs(b) <= w

    def in_stem(x, y):
        return abs(x - 32) <= 1.75 and 30 <= y <= 54

    def color(x, y):
        if not in_round_rect(x, y):
            return None
        if (x - 32) ** 2 + (y - 13) ** 2 <= 16:
            return bloom
        if in_leaf(x, y, 32, 30, 47, 15):
            return paper
        if in_leaf(x, y, 32, 36, 17, 21):
            return soft
        if in_stem(x, y):
            return paper
        return bg

    rows = []
    for j in range(size):
        row = bytearray([0])
        for i in range(size):
            acc = [0, 0, 0, 0]
            for sj in range(ss):
                for si in range(ss):
                    c = color((i + (si + 0.5) / ss) * k, (j + (sj + 0.5) / ss) * k)
                    if c:
                        acc[0] += c[0]; acc[1] += c[1]; acc[2] += c[2]; acc[3] += 255
            n = ss * ss
            alpha = acc[3] // n
            if alpha:
                cnt = acc[3] // 255
                row += bytes([acc[0] // cnt, acc[1] // cnt, acc[2] // cnt, alpha])
            else:
                row += bytes([0, 0, 0, 0])
        rows.append(bytes(row))

    def chunk(t, data):
        return struct.pack(">I", len(data)) + t + data + struct.pack(">I", zlib.crc32(t + data) & 0xFFFFFFFF)
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(b"".join(rows), 9)) + chunk(b"IEND", b"")


def main():
    ap = argparse.ArgumentParser(description="Arma la app Detox v2 en un unico HTML.")
    ap.add_argument("--fixture", action="store_true", help="usar datos de prueba (requiere --out)")
    ap.add_argument("--out", help="carpeta de salida (por defecto, la raiz del proyecto)")
    ap.add_argument("--no-compress", action="store_true", help="incluir los datos sin comprimir (para depurar)")
    args = ap.parse_args()
    if args.fixture and not args.out:
        fail("--fixture necesita --out para no pisar la app publicada")
    out = Path(args.out).resolve() if args.out else ROOT
    out.mkdir(parents=True, exist_ok=True)

    shell = read(SRC / "shell.html")
    for mark in ("<!-- INLINE:CSS -->", "<!-- INLINE:JS -->"):
        if mark not in shell:
            fail("shell.html no tiene la marca " + mark)

    css = font_face() + "\n".join("/* ==== %s ==== */\n%s" % (p.name, read(p)) for p in css_files())
    if "</style" in css.lower():
        fail("un CSS contiene '</style'")

    build_date = _dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    head = "window.DX_BUILD = %s;\n" % json.dumps({"version": VERSION, "date": build_date, "fixture": bool(args.fixture)})
    js_parts = [head]
    app = sorted((SRC / "app").glob("*.js"))
    if not app:
        fail("no hay archivos en v2/src/app/")
    inflate = SRC / "app" / "01-inflate.js"
    data = data_files(args.fixture)
    data_note = ""
    if args.no_compress:
        for p in data + app:
            js_parts.append(safe_js(read(p), p.relative_to(V2).as_posix()))
    else:
        if inflate not in app:
            fail("falta v2/src/app/01-inflate.js (descompresor de datos)")
        b64, raw_len = compress_data(data)
        js_parts.append(safe_js(read(inflate), "src/app/01-inflate.js"))
        js_parts.append(NL + "/* ==== datos comprimidos (%d B -> %d B) ==== */" % (raw_len, len(b64)) + NL)
        js_parts.append("try { (0, eval)(window.DXInflate.text('" + b64 + "')); } catch (e) { window.DX_LOAD_ERROR = e; console.error(e); }" + NL)
        data_note = "  datos %d B -> %d B comprimidos" % (raw_len, len(b64))
        for p in app:
            if p != inflate:
                js_parts.append(safe_js(read(p), p.relative_to(V2).as_posix()))
    js = "".join(js_parts)

    html = (shell.replace("<!-- INLINE:CSS -->", "<style>\n" + css + "\n</style>")
                 .replace("<!-- INLINE:JS -->", "<script>\n" + js + "\n</script>")
                 .replace("{{VERSION}}", VERSION)
                 .replace("{{BUILD_DATE}}", build_date))

    digest = hashlib.sha256(html.encode("utf-8")).hexdigest()[:10]
    outputs = {
        "index.html": html,
        "Detox-Primavera-App.html": html,
        "icon.svg": ICON_SVG,
        "manifest.webmanifest": json.dumps({
            "name": "Detox de Primavera",
            "short_name": "Detox",
            "lang": "es-AR",
            "start_url": "./",
            "scope": "./",
            "display": "standalone",
            "background_color": "#FCF8F6",
            "theme_color": "#446650",
            "icons": [{"src": "icon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any"},
                      {"src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
                      {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"}],
        }, ensure_ascii=False, indent=2),
        "sw.js": SW_TEMPLATE.replace("__CACHE__", "detox-v%s-%s" % (VERSION, digest)),
    }
    for name, text in outputs.items():
        (out / name).write_text(text, encoding="utf-8", newline="\n")
    for px in (192, 512):
        (out / ("icon-%d.png" % px)).write_bytes(png_icon(px))

    size = len(html.encode("utf-8"))
    print("Detox v%s armado %s%s" % (VERSION, build_date, " (DATOS DE PRUEBA)" if args.fixture else ""))
    print("  CSS  %8d B" % len(css.encode("utf-8")))
    print("  JS   %8d B%s" % (len(js.encode("utf-8")), data_note))
    print("  HTML %8d B  -> %s" % (size, out / "index.html"))
    if size > 800 * 1024:
        print("AVISO: el HTML supera los 800 KB del contrato (600 KB + fuente Geist incrustada, v2.4)", file=sys.stderr)


SW_TEMPLATE = """/* Service worker de Detox v2.
   La pagina (index.html) va primero a la red: asi una version nueva se ve al primer recargar;
   sin conexion se usa la copia guardada. El resto de los archivos, de la cache. */
const CACHE = '__CACHE__';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const isPage = e.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isPage) {
    e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); }
      return res;
    }).catch(() => caches.match('./index.html').then(hit => hit || caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
"""

if __name__ == "__main__":
    main()
