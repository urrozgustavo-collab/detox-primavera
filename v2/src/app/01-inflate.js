/* Detox v2 — descompresor DEFLATE crudo (RFC 1951), propio y sin dependencias (estilo «puff»).
   build.py comprime los datos con zlib (stdlib de Python) para que el HTML quede < 600 KB;
   acá se descomprimen de forma sincrónica al abrir. Verificado contra zlib en tests/inflate.test.js. */
(function (root) {
  'use strict';
  var LBASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
  var LEXT = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  var DBASE = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
  var DEXT = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
  var ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

  function huff(lengths, start, n) {
    var count = new Uint16Array(16), symbol = new Uint16Array(n), offs = new Uint16Array(16), s;
    for (s = 0; s < n; s++) count[lengths[start + s]]++;
    count[0] = 0;
    for (var len = 1; len < 15; len++) offs[len + 1] = offs[len] + count[len];
    for (s = 0; s < n; s++) if (lengths[start + s]) symbol[offs[lengths[start + s]]++] = s;
    return { count: count, symbol: symbol };
  }

  function inflateRaw(src) {
    var out = new Uint8Array(Math.max(1024, src.length * 4)), outLen = 0;
    var pos = 0, bitbuf = 0, bitcnt = 0;
    function grow(n) {
      if (outLen + n <= out.length) return;
      var o = new Uint8Array(Math.max(out.length * 2, outLen + n));
      o.set(out.subarray(0, outLen)); out = o;
    }
    function bits(need) {
      var val = bitbuf;
      while (bitcnt < need) {
        if (pos >= src.length) throw new Error('Datos comprimidos incompletos');
        val |= src[pos++] << bitcnt; bitcnt += 8;
      }
      bitbuf = val >>> need; bitcnt -= need;
      return val & ((1 << need) - 1);
    }
    function decode(h) {
      var code = 0, first = 0, index = 0;
      for (var len = 1; len <= 15; len++) {
        code |= bits(1);
        var c = h.count[len];
        if (code - c < first) return h.symbol[index + (code - first)];
        index += c; first += c; first <<= 1; code <<= 1;
      }
      throw new Error('Código Huffman inválido');
    }
    function codes(lc, dc) {
      for (;;) {
        var sym = decode(lc);
        if (sym < 256) { grow(1); out[outLen++] = sym; continue; }
        if (sym === 256) return;
        sym -= 257;
        if (sym >= 29) throw new Error('Longitud inválida');
        var len = LBASE[sym] + bits(LEXT[sym]);
        var ds = decode(dc);
        if (ds >= 30) throw new Error('Distancia inválida');
        var dist = DBASE[ds] + bits(DEXT[ds]);
        if (dist > outLen) throw new Error('Distancia fuera de rango');
        grow(len);
        for (var i = 0; i < len; i++) { out[outLen] = out[outLen - dist]; outLen++; }
      }
    }
    var FIXED = null;
    function fixed() {
      if (FIXED) return FIXED;
      var l = new Uint8Array(288 + 30), s;
      for (s = 0; s < 144; s++) l[s] = 8;
      for (; s < 256; s++) l[s] = 9;
      for (; s < 280; s++) l[s] = 7;
      for (; s < 288; s++) l[s] = 8;
      for (s = 288; s < 318; s++) l[s] = 5;
      FIXED = [huff(l, 0, 288), huff(l, 288, 30)];
      return FIXED;
    }
    var last;
    do {
      last = bits(1);
      var type = bits(2);
      if (type === 0) {
        bitbuf = 0; bitcnt = 0;
        if (pos + 4 > src.length) throw new Error('Bloque sin comprimir incompleto');
        var n = src[pos] | (src[pos + 1] << 8), nn = src[pos + 2] | (src[pos + 3] << 8);
        if (n !== (~nn & 0xffff)) throw new Error('Bloque sin comprimir dañado');
        pos += 4;
        if (pos + n > src.length) throw new Error('Bloque sin comprimir incompleto');
        grow(n); out.set(src.subarray(pos, pos + n), outLen); outLen += n; pos += n;
      } else if (type === 1) {
        var f = fixed(); codes(f[0], f[1]);
      } else if (type === 2) {
        var nlen = bits(5) + 257, ndist = bits(5) + 1, ncode = bits(4) + 4;
        if (nlen > 286 || ndist > 30) throw new Error('Cabecera dinámica inválida');
        var lengths = new Uint8Array(320), idx;
        for (idx = 0; idx < ncode; idx++) lengths[ORDER[idx]] = bits(3);
        var lencode = huff(lengths, 0, 19);
        var all = new Uint8Array(nlen + ndist);
        idx = 0;
        while (idx < nlen + ndist) {
          var sym = decode(lencode);
          if (sym < 16) { all[idx++] = sym; continue; }
          var val = 0, rep;
          if (sym === 16) { if (idx === 0) throw new Error('Repetición sin longitud previa'); val = all[idx - 1]; rep = 3 + bits(2); }
          else if (sym === 17) rep = 3 + bits(3);
          else rep = 11 + bits(7);
          if (idx + rep > nlen + ndist) throw new Error('Demasiadas longitudes');
          while (rep--) all[idx++] = val;
        }
        codes(huff(all, 0, nlen), huff(all, nlen, ndist));
      } else throw new Error('Tipo de bloque inválido');
    } while (!last);
    return out.subarray(0, outLen);
  }

  function b64(s) { var bin = atob(s), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
  root.DXInflate = { raw: inflateRaw, text: function (base64) { return new TextDecoder().decode(inflateRaw(b64(base64))); } };
})(typeof window !== 'undefined' ? window : globalThis);
