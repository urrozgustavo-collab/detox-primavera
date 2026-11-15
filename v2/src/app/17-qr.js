/* Detox v2 — generador de códigos QR propio (modo byte, corrección M, versiones 1 a 10), sin servicios externos.
   Basado en ISO/IEC 18004. Verificado en tests/qr.test.js con vectores conocidos y un decodificador independiente. */
(function (root) {
  'use strict';
  var A = root.DXApp, L = A.logic;
  var QR = L.qr = {};

  /* Tablas para nivel M: [total de codewords, ec por bloque, cantidad de bloques] por versión */
  QR.TABLE_M = [null, [26, 10, 1], [44, 16, 1], [70, 26, 1], [100, 18, 2], [134, 24, 2], [172, 16, 4], [196, 18, 4], [242, 22, 4], [292, 22, 5], [346, 26, 5]];
  QR.ALIGN = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];

  function gfMul(x, y) { var z = 0; for (var i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z & 255; }
  QR.gfMul = gfMul;
  QR.rsDivisor = function (degree) {
    var res = []; for (var i = 0; i < degree - 1; i++) res.push(0); res.push(1);
    var r = 1;
    for (var k = 0; k < degree; k++) {
      for (var j = 0; j < res.length; j++) { res[j] = gfMul(res[j], r); if (j + 1 < res.length) res[j] ^= res[j + 1]; }
      r = gfMul(r, 2);
    }
    return res;
  };
  QR.rsRemainder = function (data, div) {
    var res = div.map(function () { return 0; });
    data.forEach(function (b) {
      var f = b ^ res.shift(); res.push(0);
      div.forEach(function (c, i) { res[i] ^= gfMul(c, f); });
    });
    return res;
  };
  QR.dataCodewords = function (v) { var t = QR.TABLE_M[v]; return t[0] - t[1] * t[2]; };
  QR.capacity = function (v) { return QR.dataCodewords(v) - (v < 10 ? 2 : 3); };
  function utf8(s) { return Array.from(new TextEncoder().encode(s)); }

  /* Codewords finales (datos + corrección, intercalados) */
  QR.codewords = function (bytes, v) {
    var bits = [];
    function put(val, n) { for (var i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
    var cap = QR.dataCodewords(v) * 8;
    put(4, 4); put(bytes.length, v < 10 ? 8 : 16);
    bytes.forEach(function (b) { put(b, 8); });
    put(0, Math.min(4, cap - bits.length));
    while (bits.length % 8) bits.push(0);
    var data = [];
    for (var i = 0; i < bits.length; i += 8) { var b = 0; for (var j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; data.push(b); }
    for (var pad = 0xEC; data.length < QR.dataCodewords(v); pad ^= 0xEC ^ 0x11) data.push(pad);
    var t = QR.TABLE_M[v], nb = t[2], ecl = t[1], total = QR.dataCodewords(v);
    var shortLen = Math.floor(total / nb), nLong = total % nb, nShort = nb - nLong;
    var blocks = [], eccs = [], k = 0, div = QR.rsDivisor(ecl);
    for (var bI = 0; bI < nb; bI++) {
      var len = shortLen + (bI < nShort ? 0 : 1);
      var blk = data.slice(k, k + len); k += len;
      blocks.push(blk); eccs.push(QR.rsRemainder(blk, div));
    }
    var out = [];
    for (var x = 0; x <= shortLen; x++) blocks.forEach(function (b) { if (x < b.length) out.push(b[x]); });
    for (var y = 0; y < ecl; y++) eccs.forEach(function (e) { out.push(e[y]); });
    return out;
  };
  QR.formatBits = function (mask) {
    var data = (0 << 3) | mask; // nivel M = 00
    var rem = data;
    for (var i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    return ((data << 10) | rem) ^ 0x5412;
  };
  QR.versionBits = function (v) {
    var rem = v;
    for (var i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
    return (v << 12) | rem;
  };
  var MASKS = [
    function (y, x) { return (x + y) % 2 === 0; }, function (y) { return y % 2 === 0; }, function (y, x) { return x % 3 === 0; }, function (y, x) { return (x + y) % 3 === 0; },
    function (y, x) { return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; }, function (y, x) { return x * y % 2 + x * y % 3 === 0; },
    function (y, x) { return (x * y % 2 + x * y % 3) % 2 === 0; }, function (y, x) { return ((x + y) % 2 + x * y % 3) % 2 === 0; }];
  QR.MASKS = MASKS;

  function build(v, cw, mask) {
    var n = 17 + 4 * v;
    var m = [], fn = [];
    for (var i = 0; i < n; i++) { m.push(new Array(n).fill(false)); fn.push(new Array(n).fill(false)); }
    function set(x, y, on) { m[y][x] = !!on; fn[y][x] = true; }
    function finder(cx, cy) {
      for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
        var x = cx + dx, y = cy + dy; if (x < 0 || y < 0 || x >= n || y >= n) continue;
        var d = Math.max(Math.abs(dx), Math.abs(dy));
        set(x, y, d !== 2 && d !== 4);
      }
    }
    for (i = 0; i < n; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    finder(3, 3); finder(n - 4, 3); finder(3, n - 4);
    var al = QR.ALIGN[v];
    al.forEach(function (ay, a) {
      al.forEach(function (ax, b) {
        if ((a === 0 && b === 0) || (a === 0 && b === al.length - 1) || (a === al.length - 1 && b === 0)) return;
        for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      });
    });
    function drawFormat(msk) {
      var bits = QR.formatBits(msk), bit = function (k) { return (bits >>> k) & 1; };
      for (var k = 0; k <= 5; k++) set(8, k, bit(k));
      set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
      for (k = 9; k < 15; k++) set(14 - k, 8, bit(k));
      for (k = 0; k < 8; k++) set(n - 1 - k, 8, bit(k));
      for (k = 8; k < 15; k++) set(8, n - 15 + k, bit(k));
      set(8, n - 8, true);
    }
    drawFormat(0);
    if (v >= 7) {
      var vb = QR.versionBits(v);
      for (var k2 = 0; k2 < 18; k2++) { var bt = (vb >>> k2) & 1, a1 = n - 11 + k2 % 3, b1 = Math.floor(k2 / 3); set(a1, b1, bt); set(b1, a1, bt); }
    }
    var idx = 0;
    for (var right = n - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < n; vert++) for (var j = 0; j < 2; j++) {
        var x = right - j, up = ((right + 1) & 2) === 0, y = up ? n - 1 - vert : vert;
        if (!fn[y][x] && idx < cw.length * 8) { m[y][x] = ((cw[idx >>> 3] >>> (7 - (idx & 7))) & 1) === 1; idx++; }
      }
    }
    var f = MASKS[mask];
    for (var yy = 0; yy < n; yy++) for (var xx = 0; xx < n; xx++) if (!fn[yy][xx] && f(yy, xx)) m[yy][xx] = !m[yy][xx];
    drawFormat(mask);
    return { size: n, modules: m, version: v, mask: mask };
  }
  function penalty(m) {
    var n = m.length, p = 0, x, y, run, dark = 0;
    for (y = 0; y < n; y++) { run = 1; for (x = 1; x < n; x++) { if (m[y][x] === m[y][x - 1]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
    for (x = 0; x < n; x++) { run = 1; for (y = 1; y < n; y++) { if (m[y][x] === m[y - 1][x]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
    for (y = 0; y < n - 1; y++) for (x = 0; x < n - 1; x++) { var c = m[y][x]; if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) p += 3; }
    var pat = [true, false, true, true, true, false, true];
    function find(get) {
      for (var a = 0; a < n; a++) for (var b = 0; b + 7 <= n; b++) {
        var ok = true; for (var k = 0; k < 7; k++) if (get(a, b + k) !== pat[k]) { ok = false; break; }
        if (!ok) continue;
        var before = true, after = true;
        for (k = 1; k <= 4; k++) { if (b - k >= 0 && get(a, b - k)) before = false; if (b + 6 + k < n && get(a, b + 6 + k)) after = false; }
        if (before || after) p += 40;
      }
    }
    find(function (r, c) { return m[r][c]; }); find(function (r, c) { return m[c][r]; });
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) if (m[y][x]) dark++;
    p += Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
    return p;
  }
  /* Genera el QR: { size, modules[y][x], version, mask } o null si no entra */
  QR.encode = function (text, forceMask) {
    var bytes = utf8(text), v = 1;
    while (v <= 10 && QR.capacity(v) < bytes.length) v++;
    if (v > 10) return null;
    var cw = QR.codewords(bytes, v);
    if (forceMask != null) return build(v, cw, forceMask);
    var best = null, bestP = Infinity;
    for (var mk = 0; mk < 8; mk++) { var q = build(v, cw, mk), pp = penalty(q.modules); if (pp < bestP) { best = q; bestP = pp; } }
    return best;
  };
  /* SVG con zona de silencio de 4 módulos */
  QR.svg = function (text, label) {
    var q = QR.encode(text); if (!q) return '';
    var n = q.size, d = '';
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (q.modules[y][x]) d += 'M' + (x + 4) + ' ' + (y + 4) + 'h1v1h-1z';
    return '<svg viewBox="0 0 ' + (n + 8) + ' ' + (n + 8) + '" shape-rendering="crispEdges" role="img" aria-label="' + (label || 'Código QR') + '"><rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
