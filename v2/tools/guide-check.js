/* Contrasta cantidades y tiempos de las recetas con scratch/guia_dump.txt (ronda 2, QA-27).
   suggestedLine(): ¿la guía trae esa cantidad para ese ingrediente en las páginas de la receta?  → si no, la línea es «sugerida».
   editorialStep(): ¿la guía trae ese tiempo / temperatura en esas páginas?  → si no, el paso es «editorial».
   Es una heurística: las excepciones se declaran a mano en editorial-overrides.js y se revisan en `build-recipes.js --editorial`. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');

const strip = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function norm(s) {
  return strip(s).replace(/½/g, '1/2').replace(/¼/g, '1/4').replace(/¾/g, '3/4').replace(/\s+/g, ' ');
}

const raw = fs.readFileSync(path.join(ROOT, 'scratch', 'guia_dump.txt'), 'utf8');
const PAGES = {};
const PAGE_LINES = {};
raw.split(/={10,} PÁGINA (\d+) ={10,}/).forEach((chunk, i, arr) => {
  if (i % 2 === 1) { const body = arr[i + 1] || ''; PAGES[+chunk] = norm(body); PAGE_LINES[+chunk] = body.split('\n').map(norm).filter(l => l.trim()); }
});

function pagesOf(source) {
  const out = new Set();
  if (!source) return [];
  const re = /p\.(\d+)(?:-(\d+))?/g; let m;
  while ((m = re.exec(source))) { const a = +m[1], b = m[2] ? +m[2] : a; for (let p = a; p <= b; p++) out.add(p); }
  return [...out];
}
const WSTOP = new Set(['de', 'del', 'con', 'y', 'o', 'al', 'la', 'el', 'los', 'las', 'a', 'en', 'un', 'una', 'para']);
const words = (t) => norm(t).replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w && !WSTOP.has(w));
const stem = (w) => w.replace(/(es|s)$/, '').slice(0, 6);
const SECTIONS = {};   // id → texto de la sección de la guía (si se pudo ubicar su encabezado)
function register(list, headingOverride) {
  // 1) encabezados de cada receta: en cada página de su fuente, la línea con más palabras del título
  const heads = [];
  list.forEach(r => {
    const pg = pagesOf(r.src); if (!pg.length) return;
    const tw = words(((headingOverride && headingOverride[r.id]) || r.title).replace(/\([^)]*\)/g, ' ')).map(stem); if (!tw.length) return;
    pg.forEach(p => {
      let best = null;
      (PAGE_LINES[p] || []).forEach((line, li) => {
        const lw = new Set(words(line).map(stem));
        const sc = tw.filter(w => lw.has(w)).length / tw.length;
        if (sc >= 0.6 && (!best || sc > best.sc)) best = { sc, p, li };
      });
      if (best) heads.push({ id: r.id, p: best.p, li: best.li });
    });
  });
  // 2) sección = desde el encabezado hasta el próximo encabezado (de cualquier receta); si no hay, hasta el fin de la página siguiente
  const key = (h) => h.p * 10000 + h.li;
  const sorted = heads.slice().sort((a, b) => key(a) - key(b));
  const ids = new Set();
  heads.forEach(h => {
    const next = sorted.find(x => key(x) > key(h));
    let txt = [];
    for (let p = h.p; p <= h.p + 1; p++) {
      const lines = PAGE_LINES[p] || [];
      const from = p === h.p ? h.li : 0;
      let to = lines.length;
      if (next && next.p === p) to = next.li;
      txt = txt.concat(lines.slice(from, to));
      if (next && next.p === p) break;
      if (next && next.p > p + 1) break;
    }
    SECTIONS[h.id] = (SECTIONS[h.id] ? SECTIONS[h.id] + ' ' : '') + txt.join(' ');
    ids.add(h.id);
  });
  return ids.size;
}
const textOf = (source, id) => (id && SECTIONS[id]) || pagesOf(source).map(p => PAGES[p] || '').join(' ');

const QTY_FORMS = (q) => {
  const f = [];
  const push = (x) => f.push(x);
  if (Number.isInteger(q)) { push(String(q)); if (q === 1) { push('un'); push('una'); } if (q === 2) { push('dos'); push('un par'); } if (q === 3) push('tres'); if (q === 4) push('cuatro'); }
  else if (q === 0.5) { push('1/2'); push('medio'); push('media'); push('0,5'); }
  else if (q === 0.25) { push('1/4'); push('cuarto'); }
  else if (q === 0.75) { push('3/4'); }
  else if (Math.abs(q * 3 - Math.round(q * 3)) < 0.01 && q < 3) { push(Math.round(q * 3) + '/3'); }
  else if (Math.abs(q - 1 / 3) < 0.01) { push('1/3'); }
  else if (q === 1.5) { push('1,5'); push('1 y 1/2'); push('1 1/2'); push('2,1/2'); }
  else if (q === 2.5) { push('2,5'); push('2,1/2'); push('2 1/2'); }
  else push(String(q).replace('.', ','));
  return f;
};
const UNIT_RE = {
  cda: '(?:cdas?|cucharadas?|c)', cdita: '(?:cditas?|cucharaditas?)', taza: '(?:tazas?)', g: '(?:g|gr|gramos?)', kg: '(?:kg|k|kilos?)', ml: '(?:ml)', l: '(?:l|lt|litros?)',
  diente: '(?:dientes?)', penca: '(?:pencas?|varas?|ramas?|ramitas?)', tallo: '(?:tallos?|hojas?)', atado: '(?:atados?)', 'puñado': '(?:punados?)', pizca: '(?:pizcas?|puntitas?)',
  hoja: '(?:hojas?)', rodaja: '(?:rodajas?)', trozo: '(?:trozos?|pedazos?)', 'lámina': '(?:laminas?)', gajo: '(?:gajos?)', cabeza: '(?:cabezas?)', bulbo: '(?:bulbos?)', vaso: '(?:vasos?)', bandeja: '(?:bandejitas?|bandejas?)',
  unidad: '', diente2: ''
};
const STOP = new Set(['mar', 'sin', 'con', 'ají', 'de', 'del', 'la', 'el', 'los', 'las', 'con', 'sin', 'en', 'y', 'o', 'a', 'fresco', 'frescos', 'fresca', 'cruda', 'crudo', 'crudas', 'crudos', 'pura', 'puro', 'entero', 'entera']);

function keywordsOf(ing) {
  const ks = new Set();
  [ing.name].concat(ing.synonyms || []).forEach(s => norm(s).split(/[\s/(),]+/).forEach(w => { if (w.length >= 3 && !STOP.has(w)) ks.add(w.replace(/s$/, '')); }));
  return [...ks];
}

/* ¿La guía (páginas de `source`) trae `qty unit` de este ingrediente? */
function guideHasQty(source, qty, qtyMax, unit, ing, id) {
  const text = textOf(source, id); if (!text) return false;
  const kws = keywordsOf(ing); if (!kws.length) return false;
  const kw = '(?:' + kws.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')';
  const qf = '(?:' + [...new Set(QTY_FORMS(qty).concat(qtyMax ? QTY_FORMS(qtyMax) : []))].map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')';
  const ur = UNIT_RE[unit] || '';
  const unitPart = ur ? '\\s*' + ur + '\\b\\.?' : '';   // la unidad es obligatoria cuando la receta la tiene
  const re = new RegExp('(?:^|[^0-9/,.])' + qf + unitPart + '\\s*(?:de\\s+)?(?:[a-z0-9]+\\s+){0,3}' + kw);
  return re.test(text);
}

/* Tiempos y temperaturas de un paso; devuelve los que la guía NO trae en las páginas de la receta. */
function unsupportedTimes(source, stepText, id) {
  const text = textOf(source, id);
  const t = norm(stepText);
  const bad = [];
  const re = /(\d+(?:[.,]\d+)?)(?:\s*(?:a|-|o|y)\s*(\d+(?:[.,]\d+)?))?\s*(minutos?|min\b|horas?|hs\b|hrs?\b|h\b|dias?|°c|°|grados)/g; let m;
  while ((m = re.exec(t))) {
    const n1 = m[1], n2 = m[2], u = m[3];
    const isTemp = /^(°|grados)/.test(u);
    const unitRe = isTemp ? '(?:°c|°|grados)' : (/^(min)/.test(u) ? '(?:min|minutos?|\')' : (/^d/.test(u) ? '(?:dias?)' : '(?:horas?|hs|hrs?|h)'));
    const has = (n) => new RegExp('(?:^|[^0-9])' + n.replace('.', ',') + '\\s*' + unitRe).test(text) ||
      (n === '1' && !isTemp && /(?:una|1)\s*(?:hora|hr|h)/.test(text) && /hora|h/.test(u));
    // rangos: «4 o 5 días» en la guía vale para «4 a 5 días»
    const range = n2 && new RegExp('(?:^|[^0-9])' + n1 + '\\s*(?:a|o|-|y)\\s*' + n2 + '\\s*' + unitRe).test(text);
    const ok = range || [n1, n2].filter(Boolean).every(has);
    if (!ok) bad.push(m[0]);
  }
  return bad;
}

module.exports = { guideHasQty, unsupportedTimes, pagesOf, PAGES, norm, register, SECTIONS };
