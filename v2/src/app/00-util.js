/* Detox v2 — utilidades puras (sin DOM). Único global de la app: window.DXApp. */
(function (root) {
  'use strict';
  var A = root.DXApp = root.DXApp || {};
  A.version = (root.DX_BUILD && root.DX_BUILD.version) || '2.0.0';
  A.logic = A.logic || {};
  var U = A.util = {};

  /* ---------- texto ---------- */
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  U.esc = function (s) { return s == null ? '' : String(s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); };
  U.norm = function (s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  };
  U.tokens = function (s) { return U.norm(s).split(/[^a-z0-9]+/).filter(Boolean); };
  /* Formas singulares posibles de una palabra (sin tildes): nueces→nuez, limones→limon, verdes→verde. */
  U.forms = function (w) {
    var f = [w];
    if (w.length > 3 && /s$/.test(w)) f.push(w.slice(0, -1));
    if (w.length > 4 && /es$/.test(w)) f.push(w.slice(0, -2));
    if (w.length > 4 && /ces$/.test(w)) f.push(w.slice(0, -3) + 'z');
    return f;
  };
  function sameWord(a, b) {
    if (a === b) return true;
    var fa = U.forms(a), fb = U.forms(b);
    for (var i = 0; i < fa.length; i++) if (fb.indexOf(fa[i]) > -1) return true;
    return false;
  }
  U.sameWord = sameWord;
  /* Coincidencia por palabra completa (sin tildes, tolera plural): «lino» no coincide con «aliño», «almendra» sí con «almendras». */
  U.hasWords = function (text, phrase) {
    var t = U.tokens(text), p = U.tokens(phrase);
    if (!p.length || p.length > t.length) return false;
    outer: for (var i = 0; i <= t.length - p.length; i++) {
      for (var j = 0; j < p.length; j++) if (!sameWord(t[i + j], p[j])) continue outer;
      return true;
    }
    return false;
  };
  /* Búsqueda tolerante: todos los términos del query aparecen como prefijo de alguna palabra. */
  U.matchQuery = function (haystack, query) {
    var q = U.tokens(query);
    if (!q.length) return true;
    var h = U.tokens(haystack);
    return q.every(function (term) { return h.some(function (w) { return w.indexOf(term) === 0; }); });
  };
  U.cap = function (s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); };
  U.plural = function (n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); };

  /* ---------- colecciones ---------- */
  U.arr = function (x) { return Array.isArray(x) ? x : (x && typeof x === 'object' ? Object.keys(x).map(function (k) { return x[k]; }) : []); };
  U.index = function (list, key) {
    var m = Object.create(null); key = key || 'id';
    U.arr(list).forEach(function (o) { if (o && o[key] != null) m[o[key]] = o; });
    return m;
  };
  U.uniq = function (a) { var s = new Set(), out = []; (a || []).forEach(function (x) { if (!s.has(x)) { s.add(x); out.push(x); } }); return out; };
  U.clone = function (o) { return o === undefined ? undefined : JSON.parse(JSON.stringify(o)); };
  U.isObj = function (o) { return !!o && typeof o === 'object' && !Array.isArray(o); };
  U.num = function (v, def) { var n = Number(v); return isFinite(n) ? n : def; };
  U.sum = function (a) { return (a || []).reduce(function (s, x) { return s + (Number(x) || 0); }, 0); };
  U.hash = function (s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

  U.uid = function (prefix) {
    var a = '';
    var c = root.crypto;
    if (c && c.getRandomValues) { var b = new Uint8Array(6); c.getRandomValues(b); for (var i = 0; i < b.length; i++) a += (b[i] % 36).toString(36); }
    else a = Math.random().toString(36).slice(2, 8);
    return (prefix || 'id') + '_' + Date.now().toString(36) + a;
  };

  /* ---------- fechas locales 'YYYY-MM-DD' (sin horas, robustas a DST) ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  U.iso = function (d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  U.today = function () { return U.iso(new Date()); };
  U.parseISO = function (s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    if (y < 1900 || y > 2200 || mo < 1 || mo > 12 || d < 1) return null;
    var dim = new Date(Date.UTC(y, mo, 0)).getUTCDate();
    if (d > dim) return null;
    return { y: y, m: mo, d: d };
  };
  U.isValidISO = function (s) { return !!U.parseISO(s); };
  function utc(s) { var p = U.parseISO(s); return p ? Date.UTC(p.y, p.m - 1, p.d) : NaN; }
  U.diffDays = function (a, b) { return Math.round((utc(b) - utc(a)) / 86400000); };
  U.addDays = function (s, n) {
    var t = utc(s); if (isNaN(t)) return null;
    var d = new Date(t + n * 86400000);
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
  };
  U.weekday = function (s) { var t = utc(s); return isNaN(t) ? null : new Date(t).getUTCDay(); }; // 0 = domingo
  U.mondayOf = function (s) { var w = U.weekday(s); return w == null ? null : U.addDays(s, -((w + 6) % 7)); };
  U.nextMonday = function (s) { var w = U.weekday(s); return U.addDays(s, w === 1 ? 7 : ((8 - w) % 7 || 7)); };
  /* Atajos de fecha de inicio sin repetidos: un domingo «próximo lunes» = mañana, así que se ofrece el lunes siguiente. */
  U.startChoices = function (t) {
    var tom = U.addDays(t, 1), mon = U.nextMonday(t), lab = 'Próximo lunes';
    if (mon === tom) { mon = U.addDays(mon, 7); lab = 'Lunes siguiente'; }
    return [['Hoy', t], ['Mañana', tom], [lab, mon]];
  };
  U.isoFromTs = function (ts) { return U.iso(new Date(ts)); };
  U.dateObj = function (s) { var p = U.parseISO(s); return p ? new Date(p.y, p.m - 1, p.d, 12) : null; };
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  U.MESES = MESES; U.DIAS = DIAS;
  U.fmtDate = function (s, style) {
    var p = U.parseISO(s); if (!p) return '';
    var wd = DIAS[U.weekday(s)];
    if (style === 'short') return p.d + '/' + p.m;
    if (style === 'day') return wd.slice(0, 3) + ' ' + p.d;
    if (style === 'long') return U.cap(wd) + ' ' + p.d + ' de ' + MESES[p.m - 1] + ' de ' + p.y;
    return U.cap(wd) + ' ' + p.d + ' de ' + MESES[p.m - 1];
  };
  U.fmtTime = function (ts) { var d = new Date(ts); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  U.ago = function (ts, now) {
    if (!ts) return 'nunca';
    var s = Math.max(0, Math.round(((now || Date.now()) - ts) / 1000));
    if (s < 60) return 'recién';
    if (s < 3600) return 'hace ' + Math.round(s / 60) + ' min';
    if (s < 86400) return 'hace ' + Math.round(s / 3600) + ' h';
    var d = Math.round(s / 86400);
    return 'hace ' + U.plural(d, 'día');
  };
  U.fmtDuration = function (sec) {
    sec = Math.max(0, Math.round(sec));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h ? h + ':' + pad(m) : m) + ':' + pad(s);
  };
  U.fmtMin = function (min) { if (min == null) return ''; if (min < 60) return min + ' min'; var h = Math.floor(min / 60), m = min % 60; return h + ' h' + (m ? ' ' + m + ' min' : ''); };

  /* ---------- cantidades ---------- */
  var FR = [[0.125, '⅛'], [0.25, '¼'], [1 / 3, '⅓'], [0.5, '½'], [2 / 3, '⅔'], [0.75, '¾']];
  U.frac = function (n) {
    if (n == null || !isFinite(n)) return '';
    var whole = Math.floor(n + 1e-9), rest = n - whole;
    if (rest < 0.04) return String(whole);
    if (rest > 0.96) return String(whole + 1);
    for (var i = 0; i < FR.length; i++) if (Math.abs(rest - FR[i][0]) < 0.04) return (whole ? whole + ' ' : '') + FR[i][1];
    return String(Math.round(n * 10) / 10).replace('.', ',');
  };
  var ABBR = { g: 1, kg: 1, ml: 1, l: 1, cc: 1, cm: 1, mg: 1 };
  U.unitLabel = function (unit, qty) {
    if (!unit) return '';
    var u = String(unit);
    if (qty == null || qty <= 1 || ABBR[u.toLowerCase()] || /s$/.test(u) || u.indexOf(' ') > -1 && /s\b/.test(u)) return u;
    if (/^(cda|cdita|cdta)$/i.test(u)) return u + 's';
    if (/[aeiou]$/i.test(u)) return u + 's';
    if (/z$/i.test(u)) return u.slice(0, -1) + 'ces';
    return u + 'es';
  };
  U.fmtQty = function (qty, unit) {
    if (qty == null) return unit ? unit : '';
    var u = U.unitLabel(unit, qty);
    return U.frac(qty) + (u ? ' ' + u : '');
  };

  U.debounce = function (fn, ms) {
    var t = null;
    var d = function () { var a = arguments, self = this; clearTimeout(t); t = setTimeout(function () { t = null; fn.apply(self, a); }, ms); };
    d.flush = function () { if (t) { clearTimeout(t); t = null; fn(); } };
    d.cancel = function () { clearTimeout(t); t = null; };
    return d;
  };

  /* Acceso tolerante a los datos de window.DX */
  A.dx = function () { return root.DX || {}; };
})(typeof window !== 'undefined' ? window : globalThis);
