/* Integridad referencial de window.DX (ESPEC-V2 §2.13). Carga v2/src/data/*.js en un contexto propio: no depende de la app.
   Correr: node v2/tests/run.js data */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DATA_DIR = path.resolve(__dirname, '..', 'src', 'data');
function loadData() {
  const sandbox = { console }; sandbox.window = sandbox; sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.js')).sort().forEach(f =>
    vm.runInContext(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'), sandbox, { filename: f }));
  return JSON.parse(JSON.stringify(sandbox.DX));   // copia plana: sin prototipos del contexto vm
}
const DX = loadData();

// ids de v1 que deben conservarse (extraídos de app/detox-data.js y app/fridge-engine.js)
const V1 = {
  recipes: ['caldo-detox', 'nituke-manzana', 'hummus-mung', 'mayonesa-zanahoria', 'babaganoush', 'queso-caju', 'galletas-yamani', 'pan-centeno-masamadre', 'chucrut-casero', 'leche-almendras', 'bowl-yamani-cruciferas', 'leche-caju', 'queso-crema-tofu', 'untable-hinojo-citricos', 'pasta-remolacha-aduki', 'pesto-hongos', 'queso-caju-tomillo', 'untable-caju-basico', 'untable-caju-fermentado', 'pickle-expres-rabanitos', 'pickle-remolacha-nabo-lima', 'kimchi-artesanal', 'galletas-harina-arroz', 'pan-quinoa-amaranto', 'pan-trigo-sarraceno', 'mix-rawmesan', 'pesto-cilantro-albahaca-hinojo', 'alino-miel-mostaza', 'alino-zanahoria', 'alino-palta', 'alino-caju', 'alino-zucchini', 'criolla-con-tutti', 'temakis-nori', 'risotto-yamani-hongos', 'risotto-remolacha-brocoli', 'ensalada-quinoa-habas-brocoli', 'guiso-mung-calabaza', 'papa-burguers-horno', 'papa-horno-alino-caju', 'arroz-coliflor-salteado', 'salteado-hongos-brotes-mung', 'ensalada-repollo-jengibre-macerada', 'coleslaw-detox-macerado', 'trio-verduras-vapor-semillas', 'zanahorias-a-la-india', 'tabule-quinoa-coliflor', 'zucchinis-a-la-menta', 'colchon-de-arvejas', 'sopa-fria-pepino-cilantro', 'sopa-fria-apio-palta', 'gazpacho-verde', 'sopa-kale-brocoli-castanas', 'borsch-depurativo-caju', 'sopa-crema-coliflor-caju', 'sopa-zanahoria-jengibre-curcuma', 'sopa-berro-leche-caju', 'sopa-apio-eneldo-curry', 'sopa-crema-porotos-mung', 'caldo-de-miso', 'pudding-chia-compota', 'licuado-rojo-pasion', 'licuado-verde-depurativo', 'crema-tibia-mijo-canela', 'manzanas-asadas-canela', 'bastones-crocantes-dips', 'jugo-amo-mi-higado', 'compota-manzana-clavo-canela', 'hot-cakes-avena-coco', 'infusion-quelante-ortiga-diente-leon', 'mate-medicinal-hierbas', 'infusion-digestiva-albahaca-jengibre', 'infusion-calmante-triple-flor'],
  shopping: ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10', 'v11', 'v12', 'v13', 'v14', 'v15', 'v16', 'v17', 'v18', 'v19', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd11', 'd12', 'd13', 'd14', 'd15', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'p1', 'p2', 's1', 's2', 's3', 's4', 'pr1', 'pr2', 'pr3'],
  missions: ['limon', 'masticacion', 'infusion', 'no_estimulantes', 'hidratacion', 'plato_verde'],
  badges: ['inicio', 'monodieta', 'adios_cafeina', 'semana1', 'maestro_nituke', 'detox_champion'],
  ingredients: ['arroz_yamani', 'quinoa', 'mijo', 'porotos_mung', 'porotos_aduki', 'manzana', 'apio', 'puerro', 'repollo', 'zanahoria', 'calabaza_anco', 'berenjena', 'brocoli', 'coliflor', 'palta', 'remolacha', 'zucchini', 'espinaca', 'alcaucil', 'repollitos_bruselas', 'esparragos', 'almendras', 'castanas_caju', 'harina_arroz_integral', 'harina_centeno_integral', 'masa_madre', 'tofu', 'pescado', 'huevos', 'aceite_oliva', 'sal_marina', 'limon', 'ajo', 'cebolla', 'shoyu', 'chucrut', 'semillas_lino', 'semillas_chia', 'semillas_sesamo', 'semillas_girasol', 'albahaca', 'perejil', 'comino', 'curcuma', 'canela', 'jengibre', 'laurel', 'oregano', 'kombu', 'vinagre_manzana', 'levadura_nutricional', 'aceitunas_negras', 'agua', 'liquido_coccion']
};

const ids = (arr) => arr.map(x => x.id);
const set = (arr) => new Set(arr);
function dups(list) { const s = new Set(), d = []; list.forEach(x => { if (s.has(x)) d.push(x); s.add(x); }); return d; }
function walk(v, p, f) {
  if (v === undefined) f(p);
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, p + '[' + i + ']', f));
  else if (v && typeof v === 'object') Object.keys(v).forEach(k => walk(v[k], p + '.' + k, f));
  else if (typeof v === 'string' && /\bundefined\b|\[object Object\]|\bNaN\b/.test(v)) f(p + ' = «' + v.slice(0, 60) + '»');
}
function missing(refs, pool, label) {
  const bad = refs.filter(r => !pool.has(r));
  assert.deepEqual(bad, [], label + ': referencias que no existen: ' + bad.join(', '));
}

const T = DX.taxonomy;
const ING = set(ids(DX.ingredients)), REC = set(ids(DX.recipes)), FOOD = set(ids(DX.foods)), HERB = set(ids(DX.herbs));
const SOAK = set(ids(DX.prep.soaking)), SOS = set(ids(DX.sos)), COND = set(ids(T.conditions)), ALG = set(ids(T.allergens));
const STORE = set(ids(T.stores)), SYM = set(ids(T.symptoms)), CAT = set(ids(T.recipeCategories)), ICAT = set(ids(T.ingredientCategories));
const SLOT = set(ids(T.mealSlots)), THERM = set(ids(T.thermal));
const INGBY = Object.fromEntries(DX.ingredients.map(i => [i.id, i]));

test('existen las 13 claves de DX y no hay undefined ni textos rotos', () => {
  ['taxonomy', 'ingredients', 'recipes', 'foods', 'herbs', 'sos', 'shopping', 'methods', 'prep', 'quotes', 'programs', 'taller'].forEach(k => assert.ok(DX[k], 'falta DX.' + k));
  const bad = []; walk(DX, 'DX', p => bad.push(p));
  assert.deepEqual(bad, [], 'undefined / [object Object] / NaN en: ' + bad.slice(0, 8).join(' | '));
});

test('ids únicos en cada colección', () => {
  const colls = { ingredients: DX.ingredients, recipes: DX.recipes, foods: DX.foods, herbs: DX.herbs, sos: DX.sos, shopping: DX.shopping, programs: DX.programs,
    soaking: DX.prep.soaking, batch: DX.prep.batch, ferments: DX.prep.ferments, methods: DX.methods.methods, producers: DX.taller.producers, videos: DX.taller.videos,
    recipeCategories: T.recipeCategories, stores: T.stores, allergens: T.allergens, conditions: T.conditions, symptoms: T.symptoms, digestion: T.digestionStates };
  Object.keys(colls).forEach(k => assert.deepEqual(dups(ids(colls[k])), [], 'ids repetidos en ' + k));
  DX.programs.forEach(p => {
    assert.deepEqual(dups(ids(p.habits)), [], p.id + ': hábitos repetidos');
    assert.deepEqual(dups(ids(p.badges)), [], p.id + ': logros repetidos');
  });
});

test('se conservan todos los ids de v1 (recetas, compras, misiones, medallas, ingredientes)', () => {
  const p0 = DX.programs[0];
  missing(V1.recipes, REC, 'recetas v1');
  missing(V1.shopping, set(ids(DX.shopping)), 'compras v1');
  missing(V1.missions, set(ids(p0.habits)), 'misiones v1');
  missing(V1.badges, set(ids(p0.badges)), 'medallas v1');
  missing(V1.ingredients, ING, 'ingredientes v1');
  assert.equal(V1.recipes.length, 73); assert.equal(V1.ingredients.length, 54); assert.equal(V1.shopping.length, 50);
});

test('metas de volumen: ≥120 ingredientes, ≥95 recetas, ≥90 alimentos del semáforo', () => {
  assert.ok(DX.ingredients.length >= 120, 'ingredientes: ' + DX.ingredients.length);
  assert.ok(DX.recipes.length >= 95, 'recetas: ' + DX.recipes.length);
  assert.ok(DX.foods.length >= 90, 'alimentos: ' + DX.foods.length);
  assert.ok(DX.herbs.length >= 25, 'herbario: ' + DX.herbs.length);
  assert.equal(DX.quotes.length, 22);
});

test('taxonomía: referencias internas', () => {
  T.symptoms.forEach(s => { if (s.sos) assert.ok(SOS.has(s.sos), 'síntoma ' + s.id + ' → sos ' + s.sos); });
  assert.equal(T.symptoms.filter(s => s.exclusive).length, 1);
  assert.deepEqual(ids(T.digestionStates), ['liviano', 'gases', 'lenta', 'optima']);
  assert.deepEqual(T.energyLevels.map(e => e.v), [1, 2, 3, 4, 5]); assert.deepEqual(T.moodLevels.map(e => e.v), [1, 2, 3, 4, 5]);
  T.stores.forEach(s => assert.ok(Number.isInteger(s.order)));
  ['Libre', 'Con moderación', 'Evitar'].forEach((w, i) => assert.equal(Object.values(T.statusLabels)[i], w));
  T.allergens.forEach(a => assert.ok(a.keywords.length, 'alérgeno sin keywords: ' + a.id));
});

test('ingredientes: categoría, comercio, alérgenos, remojo, semáforo y rol válidos', () => {
  DX.ingredients.forEach(i => {
    assert.ok(i.name && i.name.length > 1, i.id + ': sin nombre');
    assert.ok(ICAT.has(i.category), i.id + ': categoría ' + i.category);
    assert.ok(STORE.has(i.store), i.id + ': comercio ' + i.store);
    assert.ok(['principal', 'condimento', 'basico'].includes(i.role), i.id + ': rol ' + i.role);
    missing(i.allergens, ALG, i.id + ' alérgenos');
    if (i.soak) assert.ok(SOAK.has(i.soak), i.id + ': remojo ' + i.soak);
    if (i.food) assert.ok(FOOD.has(i.food), i.id + ': semáforo ' + i.food);
    assert.ok(Array.isArray(i.synonyms) && i.synonyms.length, i.id + ': sin sinónimos');
    assert.equal(typeof i.pantry, 'boolean');
  });
  assert.ok(INGBY.agua.pantry && INGBY.sal_marina.pantry && INGBY.aceite_oliva.pantry);
});

test('recetas: estructura, referencias y curación', () => {
  const units = new Set([null, 'g', 'kg', 'ml', 'l', 'taza', 'cda', 'cdita', 'unidad', 'diente', 'penca', 'tallo', 'atado', 'puñado', 'pizca', 'hoja', 'rodaja', 'trozo', 'lámina', 'gajo', 'cabeza', 'bulbo', 'vaso', 'bandeja', 'cápsula', 'gota']);
  DX.recipes.forEach(r => {
    const w = 'receta ' + r.id;
    assert.ok(r.title && r.title.length > 3, w + ': título');
    assert.ok(CAT.has(r.category), w + ': categoría ' + r.category);
    assert.ok(r.ingredients.length >= 1 && r.steps.length >= 1, w + ': sin ingredientes o pasos');
    if (r.time) { assert.ok(Number.isFinite(r.time.total) && r.time.total > 0 && Number.isFinite(r.time.active) && r.time.active <= r.time.total, w + ': time'); }
    r.ingredients.forEach(g => {
      assert.ok(g.text && g.text.length > 2, w + ': ingrediente sin texto');
      if (g.item) assert.ok(ING.has(g.item), w + ': item inexistente ' + g.item);
      assert.ok(['principal', 'condimento', 'basico'].includes(g.role), w + ': rol');
      assert.equal(typeof g.optional, 'boolean');
      assert.ok(g.qty === null || (Number.isFinite(g.qty) && g.qty > 0), w + ': qty ' + g.qty + ' en «' + g.text + '»');
      assert.ok(units.has(g.unit), w + ': unidad ' + g.unit);
      if (g.qty !== null) assert.ok(g.unit !== null, w + ': qty sin unidad en «' + g.text + '»');
    });
    r.steps.forEach(s => { assert.ok(s.text.length > 4, w + ': paso vacío'); assert.ok(s.timer === null || (Number.isInteger(s.timer) && s.timer > 0 && s.timer <= 21600), w + ': timer ' + s.timer); });
    missing(r.allergens, ALG, w + ' alérgenos'); missing(r.mayContain, ALG, w + ' mayContain');
    assert.ok(r.phases.length && r.phases.every(p => ['monodieta', 'general'].includes(p)), w + ': fases');
    assert.ok(r.slots.length && r.slots.every(s => SLOT.has(s)), w + ': momentos');
    assert.ok(r.thermal === null || THERM.has(r.thermal), w + ': térmica');
    assert.ok(r.tags.every(t => T.recipeTags.includes(t)), w + ': tags ' + r.tags);
    assert.ok(r.limits === null || (Number.isInteger(r.limits.perWeek) && r.limits.perWeek > 0), w + ': limits');
    assert.ok(r.source && r.source.length > 3, w + ': sin fuente');
    // coherencia alérgenos: todo alérgeno de un ingrediente obligatorio figura en la receta
    r.ingredients.filter(g => g.item && !g.optional).forEach(g => INGBY[g.item].allergens.forEach(a =>
      assert.ok(r.allergens.includes(a), w + ': falta alérgeno «' + a + '» por ' + g.item)));
  });
});

test('recetas: semáforo coherente (ningún ingrediente obligatorio en rojo) y límites de la guía', () => {
  const FOODBY = Object.fromEntries(DX.foods.map(f => [f.id, f]));
  DX.recipes.forEach(r => r.ingredients.filter(g => g.item && !g.optional).forEach(g => {
    const f = INGBY[g.item].food; if (f) assert.notEqual(FOODBY[f].status, 'red', r.id + ': ' + g.item + ' está en rojo en el semáforo');
  }));
  const rb = Object.fromEntries(DX.recipes.map(r => [r.id, r]));
  ['papa-burguers-horno', 'papa-horno-alino-caju', 'batata-al-horno', 'fideos-integrales-tomate-brocoli'].forEach(id => assert.equal(rb[id].limits.perWeek, 1, id));
  assert.ok(rb['queso-crema-tofu'].limits, 'tofu con límite');
  assert.ok(/3000/.test(rb['kimchi-artesanal'].note), 'el kimchi debe advertir el dato de 3000 g');
});

test('semáforo: estados, categorías y cobertura de la auditoría §4.4', () => {
  DX.foods.forEach(f => {
    assert.ok(['green', 'yellow', 'red'].includes(f.status), f.id + ': estado');
    assert.ok(f.why && f.why.length > 10, f.id + ': sin why'); assert.ok(f.category, f.id + ': categoría'); assert.ok(Array.isArray(f.synonyms));
    if (f.phases) Object.keys(f.phases).forEach(k => assert.ok(['previa', 'monodieta', 'general'].includes(k) && ['green', 'yellow', 'red'].includes(f.phases[k]), f.id + ': phases'));
  });
  const by = Object.fromEntries(DX.foods.map(f => [f.id, f]));
  assert.equal(by['aceite-oliva'].status, 'yellow'); assert.equal(by['cocinar-con-aceite'].status, 'red');
  ['miel', 'avena', 'papa', 'batata', 'tomate', 'hongos', 'tofu', 'pepino', 'rabanitos-nabo', 'garbanzos', 'lentejas', 'porotos-aduki', 'trigo-sarraceno', 'levadura', 'miso', 'coco', 'banana', 'mostaza-dijon'].forEach(id => assert.ok(by[id], 'falta en el semáforo: ' + id));
  ['cafe', 'mate-tradicional', 'te-negro', 'alcohol', 'lacteos', 'carnes-rojas', 'azucar', 'gaseosas', 'ultraprocesados'].forEach(id => assert.equal(by[id].status, 'red', id));
  assert.ok(DX.foods.filter(f => f.status === 'green').length >= 20 && DX.foods.filter(f => f.status === 'yellow').length >= 15 && DX.foods.filter(f => f.status === 'red').length >= 10);
});

test('herbario: fichas completas y contraindicaciones con condiciones válidas', () => {
  DX.herbs.forEach(h => {
    assert.ok(['hierba', 'alimento', 'suplemento', 'agua'].includes(h.kind), h.id + ': kind');
    assert.ok(THERM.has(h.thermal), h.id + ': térmica');
    assert.ok(h.properties.length >= 1 && h.howTo.length >= 1, h.id + ': propiedades o cómo usar');
    assert.ok(h.source && /guía/.test(h.source), h.id + ': fuente');
    h.contraindications.forEach(c => { assert.ok(COND.has(c.condition), h.id + ': condición ' + c.condition); assert.ok(c.text.length > 8); });
    h.constitutionWarn.forEach(c => assert.ok(['friolento', 'caluroso'].includes(c.constitution)));
  });
  const by = Object.fromEntries(DX.herbs.map(h => [h.id, h]));
  assert.equal(by['agua-de-mar'].unlockDay, 7);
  assert.ok(by.ortiga.contraindications.some(c => c.condition === 'anticoagulantes'));
  assert.ok(by.chlorella.contraindications.some(c => c.condition === 'hipertiroidismo') && by.espirulina.contraindications.some(c => c.condition === 'hipertiroidismo'));
  assert.ok(by.curcuma.contraindications.some(c => c.condition === 'obstruccion_biliar'));
  assert.ok(by.jengibre.contraindications.some(c => c.condition === 'ulcera_gastritis'));
  assert.ok(by.lino.contraindications.some(c => c.condition === 'diarrea') && by.chia.contraindications.some(c => c.condition === 'diarrea'));
  assert.ok(by.wheatgrass.constitutionWarn.length && by.espirulina.constitutionWarn.length);
});

test('SOS: referencias, escalera de constipación de 8 pasos y avisos', () => {
  DX.sos.forEach(s => {
    assert.ok(s.symptom && s.cause && s.steps.length >= 3 && s.whenToConsult, s.id + ': campos');
    missing(s.relatedSymptoms, SYM, s.id + ' síntomas'); missing(s.relatedHerbs, HERB, s.id + ' hierbas'); missing(s.relatedRecipes, REC, s.id + ' recetas');
    s.warnings.forEach(w => assert.ok(COND.has(w.condition), s.id + ': condición ' + w.condition));
  });
  const c = DX.sos.find(s => s.id === 'constipacion');
  assert.equal(c.steps.filter(x => x.ladder).length, 8, 'la escalera debe tener 8 pasos');
  assert.equal(DX.sos.filter(s => s.steps.some(x => x.ladder)).length, 1);
  DX.sos.forEach(s => s.steps.forEach(x => assert.equal(typeof x.ladder, 'boolean')));
  ['constipacion', 'diarrea-flojera', 'frio-corporal', 'dolor-cabeza', 'debilidad', 'acidez', 'mareos'].forEach(id => assert.ok(SOS.has(id), id));
});

test('compras: comercios, ingredientes y etapas', () => {
  DX.shopping.forEach(s => {
    assert.ok(STORE.has(s.store), s.id + ': comercio ' + s.store); assert.ok(s.item && s.qty, s.id + ': texto o cantidad'); assert.equal(typeof s.essential, 'boolean');
    assert.ok(['previa', 'general'].includes(s.stage), s.id + ': etapa'); assert.ok(s.ingredient === null || ING.has(s.ingredient), s.id + ': ingrediente ' + s.ingredient);
  });
  assert.ok(DX.shopping.filter(s => s.stage === 'previa').length >= 5);
  assert.ok(DX.shopping.filter(s => s.essential).length >= 20);
  // todo ingrediente de receta con comercio no básico debería poder comprarse: se avisa de los que no tienen ítem
  const covered = set(DX.shopping.map(s => s.ingredient).filter(Boolean));
  const used = new Set(); DX.recipes.forEach(r => r.ingredients.forEach(g => { if (g.item && INGBY[g.item].role !== 'basico' && !INGBY[g.item].pantry) used.add(g.item); }));
  const gaps = [...used].filter(i => !covered.has(i) && i !== 'mix_rawmesan');   // el rawmesan es casero (receta propia)
  assert.ok(gaps.length <= 40, 'ingredientes usados sin ítem de compra directo (se cubren por sinónimo de rubro): ' + gaps.length);
});

test('métodos, granos y legumbres', () => {
  assert.equal(DX.methods.methods.length, 8);
  DX.methods.methods.forEach(m => { assert.ok(m.name && m.desc && m.steps.length >= 2, m.id); });
  ['nituke', 'vapor', 'salteado_agua', 'legumbres_digestivas'].forEach(id => assert.ok(DX.methods.methods.some(m => m.id === id), id));
  assert.equal(DX.methods.grains.length, 6); DX.methods.grains.forEach(g => assert.ok(g.grain && g.ratio && g.water > 0));
  assert.ok(DX.methods.legumes.length >= 6);
});

test('prep: remojos, bases de batch y fermentos', () => {
  DX.prep.soaking.forEach(s => {
    ['id', 'ingredient', 'name', 'label', 'medium', 'why', 'purpose'].forEach(k => assert.ok(s[k], s.id + ': falta ' + k));
    assert.ok(ING.has(s.ingredient), s.id + ': ingrediente ' + s.ingredient); assert.equal(typeof s.discardWater, 'boolean');
    ['minH', 'optH', 'maxH'].forEach(k => assert.ok(s[k] === null || (Number.isFinite(s[k]) && s[k] > 0), s.id + ': ' + k));
    if (s.minH && s.optH) assert.ok(s.minH <= s.optH, s.id + ': minH > optH');
  });
  const used = DX.ingredients.map(i => i.soak).filter(Boolean); missing(used, SOAK, 'remojos usados por ingredientes');
  assert.equal(DX.prep.soaking.find(s => s.id === 'remojo-lino').discardWater, false);
  assert.ok(DX.prep.batch.length >= 6);
  DX.prep.batch.forEach(b => {
    ['name', 'icon', 'desc', 'method', 'yield'].forEach(k => assert.ok(b[k], b.id + ': falta ' + k));
    assert.ok(Number.isFinite(b.fridgeDays) && b.fridgeDays > 0 && typeof b.freezer === 'boolean' && Number.isFinite(b.freezerDays), b.id);
    assert.ok(b.steps.length >= 3 && b.recipes.length >= 3 && Number.isFinite(b.savesMin), b.id); missing(b.recipes, REC, b.id + ' recetas');
  });
  DX.prep.ferments.forEach(f => {
    assert.ok(REC.has(f.recipe), f.id + ': receta ' + f.recipe); assert.ok(f.readyDaysMin <= f.readyDaysMax && f.milestones.length >= 2, f.id);
    f.milestones.forEach((m, i) => { assert.ok(Number.isFinite(m.day) && m.text.length > 10, f.id + ' hito ' + i); if (i) assert.ok(m.day >= f.milestones[i - 1].day, f.id + ': hitos desordenados'); });
  });
  assert.ok(DX.prep.ferments.some(f => f.recipe === 'chucrut-casero' && f.readyDaysMin === 21 && f.readyDaysMax === 28));
});

test('citas: un día por cada 0..21 y atribución honesta', () => {
  assert.deepEqual(DX.quotes.map(q => q.day), Array.from({ length: 22 }, (_, i) => i));
  DX.quotes.forEach(q => {
    assert.ok(['verificada', 'atribuida', 'popular'].includes(q.attribution), 'cita ' + q.day);
    assert.ok(q.text && q.author && q.theme && q.context, 'cita ' + q.day + ': campos');
    assert.ok(!/cura|sana|elimina|tóxic|toxin|desintoxica|limpia la matriz|autofagia|cálculos/i.test(q.context), 'cita ' + q.day + ': el contexto no debe traer afirmaciones médicas');
  });
  // «verificada» solo si la fuente es la guía de Isa (con página) o una obra citada en el autor
  DX.quotes.filter(q => q.attribution === 'verificada').forEach(q => assert.ok((q.author === 'Isabel Caparra' && /pág\. \d+/.test(q.context)) || /,/.test(q.author), 'cita ' + q.day + ' verificada sin fuente clara'));
  DX.quotes.filter(q => q.author === 'Isabel Caparra').forEach(q => assert.equal(q.attribution, 'verificada'));
  assert.ok(!DX.quotes.some(q => /Edison|Sushruta|Proverbio oriental/.test(q.author)), 'citas apócrifas reemplazadas');
  DX.quotes.filter(q => q.attribution !== 'verificada').forEach(q => assert.ok(!/^(Atribuida|Dicho)/i.test(q.author), 'cita ' + q.day + ': la UI ya antepone «atribuida a»'));
});

test('programas: fases, recetas de monodieta estrictas, hábitos, logros y plantilla custom', () => {
  const RULES = ['daysComplete', 'phaseComplete', 'habitStreak', 'daysCompleteRange', 'distinctRecipesCooked', 'waterGoalDays', 'checkinDays'];
  assert.deepEqual(DX.programs.map(p => p.id), ['detox-primavera-21', 'semana-limpia-7', 'reset-14', 'custom']);
  DX.programs.forEach(p => {
    assert.ok(p.name && p.days > 0 && p.theme && p.waterGoalMl > 0, p.id);
    assert.ok(p.startModes.some(m => m.id === p.defaultStartMode), p.id + ': modo por defecto');
    const phaseIds = set(ids(p.phases));
    p.phases.forEach(ph => { assert.ok(['previa', 'monodieta', 'general'].includes(ph.id)); if (ph.allowedRecipes) missing(ph.allowedRecipes, REC, p.id + ' allowedRecipes'); });
    p.habits.concat(p.prepHabits).forEach(h => {
      assert.ok(h.text && h.tip && h.icon, h.id); assert.ok(h.phases.every(x => phaseIds.has(x)), p.id + '/' + h.id + ': fase ' + h.phases);
      missing(h.warnFor, COND, p.id + '/' + h.id + ' warnFor'); h.warnFor.forEach(c => assert.ok(h.warn[c], h.id + ': falta texto de aviso para ' + c));
    });
    p.badges.forEach(b => { assert.ok(RULES.includes(b.rule.type), p.id + '/' + b.id + ': regla ' + b.rule.type); assert.ok(b.points > 0 && b.title && b.desc);
      if (b.rule.habit) assert.ok(p.habits.some(h => h.id === b.rule.habit), 'logro sobre hábito inexistente'); if (b.rule.phase) assert.ok(phaseIds.has(b.rule.phase)); });
    p.dayNotes.forEach(n => { assert.ok(n.day >= 0 && n.day <= p.days && n.text.length > 10, p.id + ': nota día ' + n.day); assert.ok(n.text.split(/[.!?](\s|$)/).filter(s => s && s.trim().length > 2).length <= 3, p.id + ': nota larga día ' + n.day); });
    assert.ok(p.dayNotes.every(n => n.phase === null || phaseIds.has(n.phase)));
  });
  const p21 = DX.programs[0];
  assert.equal(p21.days, 21); assert.equal(p21.defaultStartMode, 'monodieta3'); assert.deepEqual(p21.startModes.map(m => m.monoDays), [3, 2, 1, 0]);
  assert.deepEqual(p21.phases.map(f => f.id), ['previa', 'monodieta', 'general']);
  assert.equal(p21.habits.length, 6); assert.equal(p21.badges.length, 9);
  // monodieta estricta: allowedRecipes == recetas con fase «monodieta»
  const mono = DX.recipes.filter(r => r.phases.includes('monodieta')).map(r => r.id).sort();
  assert.deepEqual(p21.phases.find(f => f.id === 'monodieta').allowedRecipes.slice().sort(), mono);
  assert.ok(!DX.recipes.find(r => r.id === 'galletas-yamani').phases.includes('monodieta'), 'las galletas no están en la monodieta de la guía');
  assert.ok(p21.habits.find(h => h.id === 'plato_verde').phases.join() === 'general', 'plato verde no aplica en monodieta');
  const custom = DX.programs[3]; assert.equal(custom.template, true); assert.ok(custom.habitLibrary.length === 6);
  assert.equal(DX.programs[1].days, 7); assert.equal(DX.programs[2].days, 14);
  assert.ok(!DX.programs[1].phases.some(f => f.id === 'monodieta'), 'semana limpia sin monodieta');
});

test('taller: contacto, encuentros y productores', () => {
  const t = DX.taller;
  assert.ok(t.guide.name && /@/.test(t.guide.email) && t.guide.whatsapp && /^https:\/\/chat\.whatsapp\.com\//.test(t.guide.groupUrl) && /^https:\/\/meet\.google\.com\//.test(t.guide.meetUrl));
  t.meetings.forEach(m => { assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(m.date) && !isNaN(Date.parse(m.date)) && /^\d{2}:\d{2}$/.test(m.time) && m.topic); });
  assert.equal(t.videos.length, 2); t.videos.forEach(v => assert.ok(/^https:\/\/youtu\.be\//.test(v.url)));
  assert.equal(t.producers.length, 4);
});

test('textos de salud: ningún texto del catálogo promete curas ni usa lenguaje terapéutico ajeno a la guía', () => {
  const blob = JSON.stringify([DX.foods, DX.sos, DX.programs]).toLowerCase();
  ['ablanda posibles', 'cálculos', 'acroleína', 'autofagia', 'agota suprarrenales', 'sulforafano', 'tóxico celular', 'puede curar', 'cura el'].forEach(w => assert.ok(!blob.includes(w), 'texto no respaldado por la guía: ' + w));
  const bad = /quelan|tóxic|toxina|antiinflam|alcaliniz|oxigena|fase i|metabol|qi|bazo|citocromo|prebiótic|microbiota|fitonutr/i;
  DX.recipes.forEach(r => [r.tip, r.note].concat(r.steps.map(x => x.text)).forEach(t => { if (t) assert.ok(!bad.test(t), 'receta ' + r.id + ': afirmación de salud ajena a la guía: «' + t.slice(0, 80) + '»'); }));
});

test('ronda 2 · cantidades sugeridas y pasos editoriales marcados (QA-27)', () => {
  DX.recipes.forEach(r => {
    r.ingredients.forEach(g => { if ('suggested' in g) { assert.equal(g.suggested, true, r.id); assert.ok(g.qty !== null, r.id + ': suggested sin cantidad'); } });
    r.steps.forEach(s => { if ('editorial' in s) assert.equal(s.editorial, true, r.id); });
    const marked = r.ingredients.some(g => g.suggested) || r.steps.some(s => s.editorial);
    if (marked) assert.ok(r.editorialNote && r.editorialNote.length > 20, r.id + ': marcas editoriales sin editorialNote');
    if (!/guía p\./.test(r.source)) {
      assert.ok(r.editorialNote, r.id + ': receta fuera de la guía sin editorialNote');
      r.ingredients.filter(g => g.qty !== null).forEach(g => assert.equal(g.suggested, true, r.id + ': cantidad de receta fuera de la guía sin marcar'));
    }
  });
  const rb = Object.fromEntries(DX.recipes.map(r => [r.id, r]));
  const sug = (id, item) => rb[id].ingredients.filter(g => g.item === item).some(g => g.suggested);
  // casos concretos señalados por QA
  assert.ok(sug('babaganoush', 'comino') && sug('babaganoush', 'ajo') && sug('babaganoush', 'limon'));
  ['hongos_champi', 'rucula', 'aceite_oliva'].forEach(i => assert.ok(sug('pesto-hongos', i), 'pesto-hongos ' + i));
  assert.ok(sug('hummus-mung', 'porotos_mung') && sug('queso-crema-tofu', 'tofu') && sug('queso-crema-tofu', 'aceite_oliva'));
  assert.ok(rb['caldo-detox'].steps.some(s => s.editorial && s.timer === 2100), 'caldo détox: 35-40 min es editorial');
  assert.ok(rb['mayonesa-zanahoria'].steps.some(s => s.editorial && /4 días/.test(s.text)));
  assert.ok(!sug('kimchi-artesanal', 'akusay') && !sug('chucrut-casero', 'repollo'), 'lo que sí trae la guía no se marca');
  assert.ok(DX.recipes.reduce((n, r) => n + r.ingredients.filter(g => g.suggested).length, 0) > 100, 'el barrido marca las cantidades de v1');
});

test('ronda 2 · porciones: todas las recetas tienen servings (estimado) o null explícito (QA-28)', () => {
  DX.recipes.forEach(r => {
    assert.ok('servings' in r, r.id + ': falta servings');
    assert.ok(r.servings === null || (Number.isInteger(r.servings) && r.servings > 0 && r.servings <= 16), r.id + ': servings ' + r.servings);
    if (r.servings !== null) assert.equal(r.servingsEstimated, true, r.id + ': servings sin servingsEstimated');
  });
  const nulls = DX.recipes.filter(r => r.servings === null).map(r => r.category);
  assert.ok(nulls.every(c => ['alinos', 'fermentos', 'dips', 'panificados'].includes(c)), 'solo aliños, condimentos y conservas quedan sin porciones');
  assert.ok(DX.recipes.filter(r => r.servings !== null).length >= 90);
});

test('ronda 2 · «a elegir» (choice) y roles: ningún choice de condimento, ninguna receta de solo condimentos (QA-04/29)', () => {
  DX.recipes.forEach(r => {
    r.ingredients.forEach(g => {
      if (g.choice) { assert.equal(g.role, 'principal', r.id + ': choice debe ser principal'); assert.equal(g.item, null, r.id + ': choice sin item'); }
      if (!g.item && !g.choice) assert.ok(g.optional, r.id + ': línea sin item que no es choice debe ser opcional: «' + g.text.slice(0, 40) + '»');
    });
    const hasChoice = r.ingredients.some(g => g.choice);
    if (!hasChoice) assert.ok(r.ingredients.some(g => g.item && g.role === 'principal' && !g.optional), r.id + ': sin ingrediente principal real');
  });
  const rb = Object.fromEntries(DX.recipes.map(r => [r.id, r]));
  assert.equal(rb['trio-verduras-vapor-semillas'].ingredients.filter(g => g.choice).length, 1);
  ['mix-rawmesan', 'alino-miel-mostaza', 'caldo-de-miso', 'infusion-digestiva-albahaca-jengibre', 'gomasio', 'agua-de-lino'].forEach(id => assert.ok(rb[id].ingredients.some(g => g.role === 'principal' && g.item), id));
});

test('ronda 2 · alérgenos: barrido por palabras clave de la taxonomía (QA-26)', () => {
  const strip = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  // falsos positivos conocidos: negaciones y nombres compuestos que no son el alérgeno
  const FP = /color naranja|sin gluten|sin semillas|con coraz[oó]n y semillas|sin huevo|ni huevo|sin l[aá]cteos|queso (?:de|crema|untable|vegetal|probi[oó]tico)|leche (?:de|vegetal)|papel manteca|trigo sarraceno|harina de avena sin tacc|sin harinas[^|]*huevo|queso de ca[sj]|untable de ca/g;
  DX.recipes.forEach(r => {
    const txt = strip([r.title, r.tip || '', r.method || ''].concat(r.ingredients.map(g => g.text), r.steps.map(s => s.text)).join(' | ')).replace(FP, ' ');
    T.allergens.forEach(a => {
      if (a.id === 'lacteos') return;   // las «leches» y «quesos» de la guía son vegetales; ningún ingrediente del catálogo es lácteo
      const hit = a.keywords.filter(k => new RegExp('(^|[^a-z])' + k + '([^a-z]|$)').test(txt));
      if (hit.length) assert.ok(r.allergens.includes(a.id) || r.mayContain.includes(a.id), r.id + ': «' + hit.join(',') + '» sin marcar como ' + a.id);
    });
  });
  const rb = Object.fromEntries(DX.recipes.map(r => [r.id, r]));
  ['colchon-de-arvejas', 'arroz-coliflor-salteado', 'temakis-nori'].forEach(id => assert.ok(rb[id].allergens.includes('legumbres'), id + ' legumbres'));
  assert.ok(rb['caldo-de-miso'].mayContain.includes('gluten'), 'miso de cebada');
  ['pudding-chia-compota', 'compota-manzana-clavo-canela', 'hot-cakes-avena-coco'].forEach(id => assert.ok(rb[id].mayContain.includes('frutillas'), id + ' frutillas'));
  assert.ok(rb['hot-cakes-avena-coco'].allergens.includes('gluten'));
});

test('ronda 2 · herbario sin promesas, remojos honestos, mayúsculas, despensa y tiempos (QA-31..34)', () => {
  DX.herbs.forEach(h => h.properties.forEach(p => assert.ok(/guía/i.test(p), h.id + ': propiedad sin atribuir a la guía: ' + p.slice(0, 50))));
  const mung = DX.herbs.find(h => h.id === 'porotos-mung').properties.join(' ');
  assert.ok(!/\btrata\b|resuelve/i.test(mung));
  DX.herbs.find(h => h.id === 'albahaca').contraindications.forEach(c => assert.equal(c.scope, 'aceite esencial'));
  DX.prep.soaking.forEach(s => { assert.equal(typeof s.hoursEditorial, 'boolean', s.id); if (s.hoursEditorial) assert.ok(s.note && /orientativ/.test(s.note), s.id + ': horas editoriales sin nota'); });
  assert.deepEqual(DX.ingredients.filter(i => i.pantry).map(i => i.id).sort(), ['aceite_oliva', 'agua', 'sal_marina'], 'despensa acotada');
  DX.recipes.forEach(r => assert.ok(r.time && r.time.total > 0, r.id + ': sin time'));
  assert.equal(DX.recipes.filter(r => r.timeEstimated).length, 5);
  const caps = [];
  (function walk(v, p) {
    if (typeof v === 'string') { if (/(?:^|[\s(¿¡«])[A-ZÁÉÍÓÚÑ]{5,}(?=[\s:.,;)»]|$)/.test(v)) caps.push(p); }
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, p + '[' + i + ']'));
    else if (v && typeof v === 'object') Object.keys(v).forEach(k => walk(v[k], p + '.' + k));
  })(DX, 'DX');
  assert.deepEqual(caps, [], 'texto en mayúsculas sostenidas: ' + caps.join(', '));
});

test('ronda 3 · choiceCategory válido y mix rawmesan bien mapeado (QA-29)', () => {
  DX.recipes.forEach(r => r.ingredients.forEach(g => {
    if (g.choice) assert.ok(g.choiceCategory && ICAT.has(g.choiceCategory), r.id + ': choice sin choiceCategory válido');
    else assert.ok(!('choiceCategory' in g), r.id + ': choiceCategory sin choice');
  }));
  const rb = Object.fromEntries(DX.recipes.map(r => [r.id, r]));
  assert.equal(rb['trio-verduras-vapor-semillas'].ingredients.find(g => g.choice).choiceCategory, 'verduras');
  ['trio-verduras-vapor-semillas', 'bowl-arroz-rawmesan'].forEach(id => assert.ok(rb[id].ingredients.some(g => g.item === 'mix_rawmesan'), id + ' usa mix_rawmesan'));
  assert.ok(!rb['trio-verduras-vapor-semillas'].ingredients.some(g => g.item === 'semillas_lino'), 'el mix rawmesan ya no se mapea a semillas de lino');
  assert.ok(INGBY.mix_rawmesan.allergens.includes('semillas') && INGBY.mix_rawmesan.allergens.includes('gluten'));
  // las recetas sin principal «de verdad» son aliños, infusiones o bebidas: su categoría es coherente
  const COND = { 'mix-rawmesan': 'alinos', 'pesto-cilantro-albahaca-hinojo': 'alinos', 'alino-miel-mostaza': 'alinos', 'gomasio': 'alinos', 'caldo-de-miso': 'caldos', 'infusion-digestiva-albahaca-jengibre': 'infusiones', 'agua-de-lino': 'infusiones' };
  Object.keys(COND).forEach(id => assert.equal(rb[id].category, COND[id], id));
});

test('ronda 3 · citas: ninguna apócrifa con nombre propio ni atribución contradictoria (QA-30)', () => {
  DX.quotes.forEach(q => {
    const todo = [q.author, q.context, q.text].join(' ');
    if (q.attribution === 'verificada') assert.ok(!/par[aá]frasis|adaptad|atribuid|popular|dicho/i.test(q.author + ' ' + q.context), 'cita ' + q.day + ': verificada y paráfrasis/atribuida a la vez');
    else assert.ok(q.author === 'Del taller', 'cita ' + q.day + ': con nombre propio y sin verificar');
    if (q.author === 'Isabel Caparra') assert.ok(/Guía del Detox de Primavera, pág\. \d+/.test(q.context), 'cita ' + q.day + ': falta la página');
    assert.ok(todo.length > 20);
  });
  assert.equal(DX.quotes.filter(q => q.attribution === 'verificada').length, 22);
  assert.equal(DX.quotes.filter(q => q.author === 'Isabel Caparra').length, 19);
});
