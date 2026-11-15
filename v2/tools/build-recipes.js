/* Genera v2/src/data/recipes.js a partir de app/detox-data.js (texto, pasos, tips) + capas de curación.
   Uso (desde la raíz del proyecto): node v2/tools/build-recipes.js [--diag] [--editorial]
   --diag imprime diagnósticos (alérgenos distintos de v1, timers); --editorial lista lo marcado como «sugerido» / «editorial».
   Capas: recipes-v1-overlay.js, recipes-new.js, recipe-tips.js, editorial-overrides.js; guide-check.js contrasta contra scratch/guia_dump.txt. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..', '..');
const { V } = require('./recipes-v1-overlay.js');
const { N } = require('./recipes-new.js');
const TIPS = require('./recipe-tips.js');
const OV = require('./editorial-overrides.js');
const G = require('./guide-check.js');

function loadV1() {
  const ctx = { window: {}, console }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'app', 'detox-data.js'), 'utf8') + ';window.DETOX_DATA=DETOX_DATA;', ctx);
  return ctx.window.DETOX_DATA;
}
function loadDX() {
  const ctx = { window: {}, console }; vm.createContext(ctx);
  for (const f of ['00-namespace.js', 'taxonomy.js', 'ingredients.js'])
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'v2', 'src', 'data', f), 'utf8'), ctx);
  return ctx.window.DX;
}
const D1 = loadV1();
const DX = loadDX();
const ING = Object.fromEntries(DX.ingredients.map(i => [i.id, i]));
const warnings = [];
const warn = (m) => { warnings.push(m); };

// ───────── parseo de cantidades ─────────
const NUM = '(\\d+(?:[.,]\\d+)?(?:\\/\\d+)?)';
function num(s) { s = s.replace(',', '.'); const r = s.includes('/') ? (() => { const [a, b] = s.split('/'); return +a / +b; })() : parseFloat(s); return Math.round(r * 1000) / 1000; }
const UNITS = [
  [/^(?:cucharadas?|cdas?\.?|C)(?![\p{L}])(?:\s+(?:soperas?|colmadas?|rasas?))*/iu, 'cda'],
  [/^(?:cucharaditas?|cditas?)(?![\p{L}])(?:\s+colmadas?)?/iu, 'cdita'],
  [/^tazas?(?![\p{L}])/iu, 'taza'], [/^kg(?![\p{L}])/iu, 'kg'], [/^(?:g|gr|gramos)(?![\p{L}])/iu, 'g'], [/^ml(?![\p{L}])/iu, 'ml'], [/^(?:litros?|lt|l)(?![\p{L}])/iu, 'l'],
  [/^dientes?(?![\p{L}])/iu, 'diente'], [/^(?:pencas?|varas?|ramas?)(?![\p{L}])/iu, 'penca'], [/^tallos?(?![\p{L}])/iu, 'tallo'], [/^atados?(?![\p{L}])/iu, 'atado'],
  [/^puñados?(?![\p{L}])/iu, 'puñado'], [/^pizcas?(?![\p{L}])/iu, 'pizca'], [/^hojas?(?![\p{L}])/iu, 'hoja'], [/^rodajas?(?![\p{L}])/iu, 'rodaja'], [/^(?:trozos?|trocitos?|pedazos?)(?![\p{L}])/iu, 'trozo'],
  [/^láminas?(?![\p{L}])/iu, 'lámina'], [/^gajos?(?![\p{L}])/iu, 'gajo'], [/^cabezas?(?![\p{L}])/iu, 'cabeza'], [/^bulbos?(?![\p{L}])/iu, 'bulbo'], [/^vasos?(?![\p{L}])/iu, 'vaso'], [/^bandej(?:a|ita)s?(?![\p{L}])/iu, 'bandeja'],
  [/^cápsulas?(?![\p{L}])/iu, 'cápsula'], [/^gotas?(?![\p{L}])/iu, 'gota']
];
function parseQty(text) {
  const t = text.replace(/^(Opcional|Variación aromática|Para servir|Para coronar|Para terminar|Acompañamiento|Guarnición recomendada|Alternativa)[^:]*:\s*/i, '');
  let m = t.match(new RegExp('^(?:Jugo|Ralladura)\\s+(?:recién exprimido\\s+|fresco\\s+|exprimido con los dedos\\s+)?de\\s+' + NUM + '\\s+(\\S+)', 'i'));
  if (m) return { qty: num(m[1]), unit: 'unidad' };
  m = t.match(new RegExp('^' + NUM + '(?:\\s*(?:a|o|-|–)\\s*' + NUM + ')?\\s+(.*)$', 'i'));
  if (!m) return { qty: null, unit: null };
  const qty = num(m[1]); const qmax = m[2] ? num(m[2]) : null; const rest = m[3]; let unit = 'unidad';
  for (const [re, u] of UNITS) if (re.test(rest)) { unit = u; break; }
  const r = { qty, unit };
  if (qmax != null) r.qtyMax = qmax;
  return r;
}

// ───────── timers ─────────
function parseTimer(text) {
  if (/remoj|noche/i.test(text)) return null;
  if (/^(Licuar|Agitar|Masajear|Amasar|Frotar|Mezclar)/i.test(text) && !/reposar/i.test(text)) return null;
  const re = new RegExp(NUM + '(?:\\s*(?:a|-|–|o|y)\\s*' + NUM + ')?\\s*(minutos?|min\\b|horas?|hs\\b|hrs?\\b|h\\b)', 'i');
  const m = text.match(re); if (!m) return null;
  const v = num(m[1]); const hours = /^h/i.test(m[3]);
  const sec = Math.round(v * (hours ? 3600 : 60));
  return sec > 0 && sec <= 6 * 3600 ? sec : null;
}

const SLOT_DEFAULT = { almuerzos: 'ac', ensaladas: 'ac', sopas: 'ac', caldos: 'amc', desayunos: 'dm', jugos: 'dm', dips: 'dam', alinos: 'ac', panificados: 'dm', fermentos: 'ac', leches: 'dm', infusiones: 'damc' };
const SLOT_MAP = { d: 'desayuno', a: 'almuerzo', m: 'merienda', c: 'cena' };
const PH_MAP = { m: 'monodieta', g: 'general' };
const TITLE_OVERRIDE = { 'infusion-quelante-ortiga-diente-leon': 'Infusión de ortiga y diente de león' };
const ALLERGEN_ORDER = DX.taxonomy.allergens.map(a => a.id);

function buildIngredient(rawText, spec) {
  let item, opts = {};
  if (Array.isArray(spec)) { item = spec[0]; opts = spec[1] || {}; } else item = spec;
  if (item && !ING[item]) throw new Error('item desconocido: ' + item + ' en «' + rawText + '»');
  const text = opts.text || rawText;
  const parsed = opts.qty !== undefined ? { qty: opts.qty, unit: opts.unit || null } : parseQty(text);
  if (opts.qty === undefined && opts.unit) parsed.unit = opts.unit;
  const optional = !!opts.opt || /^Opcional/i.test(rawText);
  const res = { text, qty: parsed.qty, unit: parsed.unit };
  if (parsed.qtyMax != null) res.qtyMax = parsed.qtyMax;
  res.item = item || null;
  res.role = opts.role || (item ? ING[item].role : 'condimento');
  res.optional = optional;
  if (opts.choice) res.choice = true;
  if (opts.choiceCategory) res.choiceCategory = opts.choiceCategory;
  return res;
}

function expandIngredients(lines, specs, id) {
  if (lines.length !== specs.length) throw new Error(id + ': ' + lines.length + ' líneas v1 vs ' + specs.length + ' entradas en el overlay');
  const res = [];
  lines.forEach((line, i) => {
    const s = specs[i];
    if (s && typeof s === 'object' && !Array.isArray(s) && s.split) s.split.forEach(p => res.push(buildIngredient(line, p)));
    else res.push(buildIngredient(line, s));
  });
  return res;
}

function derive(spec, ingredients, extraAl) {
  const tags = new Set((spec.tags || '').split(/\s+/).filter(Boolean));
  const total = spec.t ? spec.t[0] : null;
  if (total != null && total <= 20) tags.add('rapida');
  if (tags.has('cocido') && spec.th === 'calido') tags.add('friolento-ok');
  if (tags.has('crudo') || spec.th === 'fresco') tags.add('caluroso-ok');
  const al = new Set(extraAl || []), opt = new Set();
  ingredients.forEach(g => { if (g.item) ING[g.item].allergens.forEach(a => (g.optional ? opt : al).add(a)); });
  return { tags: [...tags], allergens: ALLERGEN_ORDER.filter(a => al.has(a)), mayContain: ALLERGEN_ORDER.filter(a => opt.has(a) && !al.has(a)) };
}

function recipeObj(id, title, spec, ingredients, stepsText, tip) {
  const src = spec.src || '';
  const guidePages = /guía p\./.test(src);
  // roles corregidos a mano
  const ro = OV.ROLE_OVERRIDES[id] || {};
  ingredients.forEach(g => { if (g.item && ro[g.item]) g.role = ro[g.item]; });
  // cantidades sugeridas (la guía no las trae)
  ingredients.forEach(g => {
    if (g.qty == null) return;
    const key = id + '|' + g.item;
    let sug;
    if (!guidePages || !g.item) sug = true;
    else sug = !G.guideHasQty(src, g.qty, g.qtyMax, g.unit, ING[g.item], id);
    if (OV.GUIDE_OK_LINES.has(key)) sug = false;
    if (OV.FORCE_SUGGEST.has(key)) sug = true;
    if (sug) g.suggested = true;
  });
  const d = derive(spec, ingredients, spec.alExtra);
  const may = new Set(d.mayContain.concat((OV.AL_MAY[id] || []).filter(a => !d.allergens.includes(a))));
  const mayContain = ALLERGEN_ORDER.filter(a => may.has(a));
  const steps = stepsText.map((t0, i) => {
    const key = id + '#' + (i + 1);
    const t = OV.STEP_TEXT[key] || t0;
    let ed = !guidePages || G.unsupportedTimes(src, t, id).length > 0;
    if (OV.GUIDE_OK_STEPS.has(key)) ed = false;
    if (OV.FORCE_EDITORIAL_STEPS.has(key)) ed = true;
    const o = { text: t, timer: parseTimer(t) };
    if (ed) o.editorial = true;
    return o;
  });
  let time = spec.t ? { total: spec.t[0], active: spec.t[1] } : null;
  if (time && spec.t[2]) time.wait = spec.t[2];
  let timeEstimated = false;
  if (!time && OV.TIME_FALLBACK[id]) { const f = OV.TIME_FALLBACK[id]; time = { total: f[0], active: f[1] }; if (f[2]) time.wait = f[2]; timeEstimated = true; }
  const hasServ = Object.prototype.hasOwnProperty.call(OV.SERVINGS, id);
  const servings = hasServ ? OV.SERVINGS[id] : (spec.serv === undefined ? null : spec.serv);
  const nSug = ingredients.filter(g => g.suggested).length, nEd = steps.filter(x => x.editorial).length;
  let editorialNote = null;
  if (!guidePages) editorialNote = 'Receta de la versión anterior de la app: no figura textual en la guía. Cantidades y pasos son propuesta del equipo.';
  else if (nSug || nEd) editorialNote = 'Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo.';
  return {
    id, title, category: spec.cat, time, timeEstimated, method: spec.method || null, servings, servingsEstimated: servings != null,
    ingredients, steps, tip: tip || null, allergens: d.allergens, mayContain,
    phases: [...spec.ph].map(c => PH_MAP[c]), slots: [...(spec.sl || SLOT_DEFAULT[spec.cat])].map(c => SLOT_MAP[c]),
    thermal: spec.th || null, tags: d.tags, limits: spec.limits || null, source: spec.src, note: spec.note || null, editorialNote
  };
}

// ubicar la sección de la guía de cada receta (para contrastar cantidades y tiempos)
const nHeads = G.register(D1.recipes.map(r => ({ id: r.id, title: r.titulo, src: V[r.id].src })).concat(N.map(n => ({ id: n.id, title: n.title, src: n.src }))), OV.HEADINGS);
if (process.argv.includes('--editorial')) console.log('secciones de la guía ubicadas:', nHeads, 'de', D1.recipes.length + N.length);
const out = [];
const seen = new Set();
D1.recipes.forEach(r => {
  const spec = V[r.id]; if (!spec) throw new Error('falta overlay: ' + r.id);
  spec.method = r.metodo;
  const ing = expandIngredients(r.ingredientes, spec.ing, r.id);
  const o = recipeObj(r.id, TITLE_OVERRIDE[r.id] || r.titulo, spec, ing, r.pasos.map(s => s.replace(/^\d+\.\s*/, '')), Object.prototype.hasOwnProperty.call(TIPS, r.id) ? TIPS[r.id] : r.tip);
  const v1 = new Set(r.alergenos || []); const mine = new Set(o.allergens);
  const plus = [...mine].filter(a => !v1.has(a)), minus = [...v1].filter(a => !mine.has(a));
  if (plus.length || minus.length) warn('ALERG ' + r.id + ': v1=[' + [...v1] + '] v2=[' + o.allergens + '] (+' + plus + ' -' + minus + ')');
  out.push(o); seen.add(r.id);
});
Object.keys(V).forEach(id => { if (!seen.has(id)) throw new Error('overlay sin receta v1: ' + id); });
N.forEach(n => {
  if (seen.has(n.id)) throw new Error('id duplicado ' + n.id);
  const ing = n.ing.map(g => {
    if (g.item && !ING[g.item]) throw new Error('item desconocido ' + g.item + ' en ' + n.id);
    const r = { text: g.text, qty: g.qty, unit: g.unit };
    if (g.qtyMax != null) r.qtyMax = g.qtyMax;
    r.item = g.item || null; r.role = g.role || (g.item ? ING[g.item].role : 'condimento'); r.optional = !!g.opt;
    if (g.choice) r.choice = true;
    if (g.choiceCategory) r.choiceCategory = g.choiceCategory;
    return r;
  });
  const spec = { cat: n.cat, t: n.t, ph: n.ph, sl: n.sl, th: n.th, tags: n.tags, src: n.src, method: n.method, serv: n.serv, limits: n.limits, note: n.note, alExtra: n.alExtra };
  out.push(recipeObj(n.id, n.title, spec, ing, n.steps, n.tip));
  seen.add(n.id);
});

// ───────── salida ─────────
const q = (s) => JSON.stringify(s);
function ingLine(g) {
  const parts = ['text: ' + q(g.text), 'qty: ' + (g.qty == null ? 'null' : g.qty)];
  if (g.qtyMax != null) parts.push('qtyMax: ' + g.qtyMax);
  parts.push('unit: ' + q(g.unit), 'item: ' + q(g.item), 'role: ' + q(g.role), 'optional: ' + g.optional);
  if (g.choice) parts.push('choice: true');
  if (g.choiceCategory) parts.push('choiceCategory: ' + q(g.choiceCategory));
  if (g.suggested) parts.push('suggested: true');
  return '        { ' + parts.join(', ') + ' }';
}
function recipeBlock(r) {
  const L = [];
  L.push('    {');
  L.push('      id: ' + q(r.id) + ', title: ' + q(r.title) + ', category: ' + q(r.category) + ',');
  L.push('      time: ' + (r.time ? JSON.stringify(r.time) : 'null') + (r.timeEstimated ? ', timeEstimated: true' : '') + ', method: ' + q(r.method) +
    ', servings: ' + (r.servings == null ? 'null' : r.servings) + (r.servings != null ? ', servingsEstimated: true' : '') + ',');
  L.push('      ingredients: [');
  L.push(r.ingredients.map(ingLine).join(',\n'));
  L.push('      ],');
  L.push('      steps: [');
  L.push(r.steps.map(s => '        { text: ' + q(s.text) + ', timer: ' + (s.timer == null ? 'null' : s.timer) + (s.editorial ? ', editorial: true' : '') + ' }').join(',\n'));
  L.push('      ],');
  L.push('      tip: ' + q(r.tip) + ', allergens: ' + JSON.stringify(r.allergens) + ', mayContain: ' + JSON.stringify(r.mayContain) + ',');
  L.push('      phases: ' + JSON.stringify(r.phases) + ', slots: ' + JSON.stringify(r.slots) + ', thermal: ' + q(r.thermal) + ',');
  L.push('      tags: ' + JSON.stringify(r.tags) + ', limits: ' + (r.limits ? JSON.stringify(r.limits) : 'null') + ',');
  L.push('      source: ' + q(r.source) + ', note: ' + q(r.note) + (r.editorialNote ? ',\n      editorialNote: ' + q(r.editorialNote) : ''));
  L.push('    }');
  return L.join('\n');
}
const header = [
  '/* Detox de Primavera v2 — recetario (GENERADO por v2/tools/build-recipes.js; editar las capas de v2/tools/, no este archivo).',
  '   73 recetas de v1 (mismos ids) con ingredientes estructurados + preparaciones del menú de la guía que v1 no traía.',
  '   time.total/active en minutos; time.wait = espera pasiva (remojo, leudado, fermentación) en minutos; timeEstimated = tiempo estimado por el equipo.',
  '   steps[].timer en segundos (rango «5 a 10 min» → el menor). allergens: curados desde los ingredientes OBLIGATORIOS del catálogo; mayContain: alérgenos que aparecen solo en ingredientes opcionales o alternativas.',
  '   ingredients[].suggested = cantidad propuesta por el equipo (la guía no la da); steps[].editorial = paso, tiempo o temperatura que no viene de la guía;',
  '   ingredients[].choice = «elegir entre varios» sin ingrediente de catálogo (choiceCategory = categoría de ingrediente que lo cubre en la heladera); servings siempre estimado por el equipo (servingsEstimated). */',
  '(function (root) {', "  'use strict';", '  root.DX = root.DX || {};', '  root.DX.recipes = [', ''].join('\n');
const footer = '\n  ];\n})(typeof window !== \'undefined\' ? window : globalThis);\n';
fs.writeFileSync(path.join(ROOT, 'v2', 'src', 'data', 'recipes.js'), header + out.map(recipeBlock).join(',\n') + footer, 'utf8');
console.log('recipes.js escrito:', out.length, 'recetas');

if (process.argv.includes('--diag')) {
  warnings.forEach(w => console.log(w));
  console.log('--- timers:');
  out.forEach(r => r.steps.forEach((s, i) => { if (s.timer) console.log(r.id + '#' + (i + 1), s.timer, '|', s.text.slice(0, 110)); }));
}
if (process.argv.includes('--editorial')) {
  D1.recipes.concat(N).forEach(r => { if (!G.SECTIONS[r.id] && /guía p\./.test((V[r.id] || r).src || '')) console.log('sin sección:', r.id); });
  console.log('--- líneas SUGERIDAS (revisar: ¿la guía sí la trae?)');
  out.forEach(r => r.ingredients.forEach(g => { if (g.suggested) console.log(r.id + '|' + g.item, '|', g.text.slice(0, 80)); }));
  console.log('--- pasos EDITORIALES por tiempo/temperatura');
  out.forEach(r => r.steps.forEach((s, i) => { if (s.editorial) console.log(r.id + '#' + (i + 1), '|', s.text.slice(0, 100)); }));
}
