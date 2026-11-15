/* Correcciones de la ronda de QA (QA-01…25): una prueba por lógica corregida. */
const NOW = Date.UTC(2026, 10, 15, 15);
const fs = require('fs');
const path = require('path');

function prof(L, start) {
  const p = L.newProfile('Gus', NOW, 0);
  const ed = L.newEdition('detox-primavera-21', start, 'monodieta3', NOW);
  p.editions[ed.id] = ed; p.activeEdition = ed.id;
  return { p, ed };
}

test('QA-01 alergias propias toleran plural/singular sin tildes', () => {
  const { U, L, DX } = loadApp();
  assert.ok(U.hasWords('4 zanahorias ralladas', 'zanahoria'));
  assert.ok(U.hasWords('1 taza de almendras', 'almendra'));
  assert.ok(U.hasWords('Nueces picadas', 'nuez'));
  assert.ok(U.hasWords('frutillas frescas', 'Frutilla'));
  assert.ok(U.hasWords('jugo de 2 limones', 'limón'));
  assert.ok(U.hasWords('una zanahoria', 'zanahorias'), 'también al revés');
  assert.equal(U.hasWords('Aliño de mostaza', 'lino'), false, 'sigue sin subcadenas');
  assert.equal(U.hasWords('apagar el fuego', 'agar'), false);
  const p = L.newProfile('x', NOW); p.settings.customAllergies = ['zanahoria'];
  const caldo = DX.recipes.find(r => r.id === 'caldo-detox');   // «2 zanahorias»
  assert.ok(L.recipeAllergyHits(caldo, p).any);
});

test('QA-03 sugerencias sin recetas contraindicadas por condición (vía herbario)', () => {
  const { L, DX } = loadApp();
  const { p, ed } = prof(L, '2026-11-08');
  const base = L.suggest({ profile: p, editionId: ed.id, program: DX.programs[0], phaseId: 'general', slot: 'merienda', dayIdx: 8, dateISO: '2026-11-15', n: 10 }).map(s => s.recipe.id);
  assert.ok(base.includes('infusion-ortiga'));
  p.settings.conditions = ['anticoagulantes'];
  const hits = L.recipeCondHits(DX.recipes.find(r => r.id === 'infusion-ortiga'), p.settings.conditions);
  assert.equal(hits[0].condition, 'anticoagulantes');
  // una contraindicación con «scope» (aceite esencial) no cuenta para la cocina
  const herb = DX.herbs.find(h => h.id === 'ortiga'); herb.contraindications.push({ condition: 'embarazo', text: 'x', scope: 'aceite esencial' });
  assert.equal(L.recipeCondHits(DX.recipes.find(r => r.id === 'infusion-ortiga'), ['embarazo']).length, 0);
  const after = L.suggest({ profile: p, editionId: ed.id, program: DX.programs[0], phaseId: 'general', slot: 'merienda', dayIdx: 8, dateISO: '2026-11-15', n: 10 }).map(s => s.recipe.id);
  assert.ok(!after.includes('infusion-ortiga'));
});

test('QA-04 heladera vacía: receta sin principales no aparece «casi lista»', () => {
  const { L } = loadApp();
  const r = { id: 'x', title: 'Solo condimentos', ingredients: [
    { text: 'limón', item: 'limon', role: 'condimento' }, { text: 'jengibre', item: 'jengibre', role: 'condimento' }, { text: 'shoyu', item: 'shoyu', role: 'condimento' }] };
  let m = L.fridgeMatch([r], [])[0];
  assert.ok(m.score <= 20, 'puntaje ' + m.score);
  assert.equal(m.tier, 'lejos');
  m = L.fridgeMatch([r], ['limon', 'jengibre', 'shoyu'])[0];
  assert.equal(m.score, 100);
  // línea «a elegir» (choice, item null): se ignora; con el resto ausente no hay puntaje alto
  const c = { id: 'y', title: 'Verduras a elección', ingredients: [{ text: '3 verduras', item: null, choice: true, role: 'principal' }, { text: 'limón', item: 'limon', role: 'condimento' }] };
  assert.equal(L.fridgeMatch([c], [])[0].tier, 'lejos');
  const withLemon = L.fridgeMatch([c], ['limon'])[0];
  assert.equal(withLemon.tier, 'casi', 'nunca «lista» sin elegir las verduras');
  assert.deepEqual(withLemon.missing.map(m => m.item), [null]);
});

test('QA-05 unidades con ñ («puñado») en suma, texto e interpretación', () => {
  const { L } = loadApp();
  assert.equal(L.normUnit('puñados'), 'puñado');
  assert.equal(L.normUnit('Puñado'), 'puñado');
  assert.equal(L.parseIngredientLine('1 puñado de apio').unit, 'puñado');
  assert.equal(L.fmtParts({ parts: [{ qty: 3, unit: 'puñado' }], free: false }), '3 puñados');
});

test('QA-21 compras usan qtyMax como rango', () => {
  const { L } = loadApp();
  const p = L.newProfile('x', NOW);
  p.customRecipes.push({ id: 'my-r', title: 'R', ingredients: [{ text: '1 a 2 puerros', qty: 1, qtyMax: 2, unit: 'unidad', item: 'apio', role: 'principal' }], steps: [{ text: 'x' }] });
  p.plan = { '2026-11-16': { almuerzo: ['my-r'], cena: ['my-r'] }, '2026-11-17': { cena: ['my-r'] } };
  const g = L.aggregateIngredients(L.planEntries(p.plan, '2026-11-16', '2026-11-22'), p, 2)[0];
  assert.deepEqual(g.parts, [{ qty: 3, unit: 'unidad', qtyMax: 6 }]);
  assert.equal(L.fmtParts(g), '3 a 6 unidades');
});

test('QA-06 datos v1 se fusionan en el perfil activo (misma edición, sin duplicar)', () => {
  const { L, U } = loadApp();
  const { p, ed } = prof(L, '2026-11-12');
  p.settings.allergies = ['apio'];
  const d2 = L.ensureDay(p, ed.id, 2); d2.checkin.notes = 'local'; L.touchDay(d2, 'checkin', 5000);
  const mig = L.migrateV1Payload(JSON.parse(fixture('v1-kvdb-payload.json')), undefined, NOW, '2026-11-15');
  mig.state.profiles[mig.state.activeProfile].settings.allergies = ['gluten'];
  const out = L.mergeV1IntoProfile(p, mig.state.profiles[mig.state.activeProfile]);
  assert.equal(Object.keys(out.editions).length, 1, 'una sola edición');
  assert.equal(out.days[ed.id]['1'].checkin.notes, 'desde la nube');
  assert.equal(out.days[ed.id]['2'].checkin.notes, 'local');
  assert.equal(out.name, 'Gus');
  assert.deepEqual(out.settings.allergies, ['apio', 'gluten']);
  assert.equal(out.id, p.id);
});

test('QA-10 gracia: no se gasta si nunca empezaste; en orden; parcial sigue «parcial»', () => {
  const { L } = loadApp();
  let { p, ed } = prof(L, '2026-11-08');
  let s = L.summary(p, ed.id, '2026-11-15');
  assert.equal(s.graceUsed, 0);
  assert.ok(s.days.slice(1, 8).every(r => r.status === 'empty'));
  ({ p, ed } = prof(L, '2026-11-08'));
  const hs = ['limon', 'masticacion', 'infusion', 'no_estimulantes', 'hidratacion', 'plato_verde'];
  [1, 2, 4, 5, 6, 7].forEach(i => { const d = L.ensureDay(p, ed.id, i); hs.forEach(h => d.habits[h] = 'done'); });
  const d3 = L.ensureDay(p, ed.id, 3); hs.slice(0, 5).forEach(h => d3.habits[h] = 'done');
  s = L.summary(p, ed.id, '2026-11-15');
  assert.equal(s.days[3].status, 'partial');
  assert.equal(s.days[3].graced, true);
  assert.equal(s.streak, 6);
});

test('QA-11 rango de compras con semana lunes a domingo', () => {
  const { L } = loadApp();
  assert.deepEqual(L.shopRange('2026-11-15', 'esta'), { from: '2026-11-15', to: '2026-11-15', label: 'esta semana' });
  assert.deepEqual(L.shopRange('2026-11-15', 'proxima'), { from: '2026-11-16', to: '2026-11-22', label: 'la próxima semana' });
  assert.equal(L.shopRange('2026-11-15', '3').to, '2026-11-17');
  assert.equal(L.shopRange('2026-11-18', 'esta').to, '2026-11-22');
});

test('QA-12 .ics con VTIMEZONE para el TZID usado', () => {
  const { L } = loadApp();
  const ics = L.buildICS([{ title: 'Agua', date: '2026-11-16', time: '08:00', count: 3 }], { now: NOW, offsetMin: -180 });
  assert.match(ics, /BEGIN:VTIMEZONE\r\nTZID:America\/Argentina\/Buenos_Aires\r\nBEGIN:STANDARD\r\nDTSTART:19700101T000000\r\nTZOFFSETFROM:-0300\r\nTZOFFSETTO:-0300/);
  assert.ok(ics.indexOf('END:VTIMEZONE') < ics.indexOf('BEGIN:VEVENT'));
});

test('QA-14 recordatorio de copia: solo con datos y más de 14 días', () => {
  const { L } = loadApp();
  const { p, ed } = prof(L, '2026-11-14');
  assert.equal(L.backupStatus(p, null, NOW).hasData, false);
  const d = L.ensureDay(p, ed.id, 1); d.water.push({ t: 1, ml: 250 }); d.updatedAt = Date.UTC(2026, 10, 14);
  assert.equal(L.backupStatus(p, null, NOW).due, false);
  assert.equal(L.backupStatus(p, null, Date.UTC(2026, 11, 5)).due, true);
  assert.equal(L.backupStatus(p, Date.UTC(2026, 11, 3), Date.UTC(2026, 11, 5)).due, false);
});

test('QA-15 los temporizadores son del dispositivo', () => {
  const { L } = loadApp();
  const s = L.newState(); const p = L.newProfile('a', NOW); p.timers = [{ id: 't1', label: 'x', endAt: 1 }];
  s.profiles[p.id] = p; s.activeProfile = p.id;
  const n = L.normalizeState(JSON.parse(JSON.stringify(s)));
  assert.deepEqual(n.device.timers.map(t => t.id), ['t1']);
  assert.deepEqual(n.profiles[p.id].timers, []);
});

test('QA-17 atajos de fecha sin repetidos un domingo', () => {
  const { U } = loadApp();
  assert.deepEqual(U.startChoices('2026-11-15').map(x => x[1]), ['2026-11-15', '2026-11-16', '2026-11-23']);
  assert.equal(U.startChoices('2026-11-18')[2][0], 'Próximo lunes');
});

test('QA-18 modo cocina: «todas las verduras» incluye las verduras de la receta', () => {
  const { L, DX } = loadApp();
  const caldo = DX.recipes.find(r => r.id === 'caldo-detox');
  const ids = L.stepIngredients(caldo, 'Colocar todas las verduras y la manzana en una olla').map(i => i.item);
  assert.ok(['apio', 'zanahoria', 'manzana'].every(x => ids.includes(x)), ids.join());
  assert.ok(!ids.includes('jengibre'));
});

test('QA-22 semáforo: primero por nombre, después por sinónimo (con «por»)', () => {
  const { L, DX } = loadApp();
  const r = L.foodSearch(DX.foods, 'aceite');
  assert.equal(r[0].id, 'aceite');
  const s = L.foodSearch(DX.foods, 'cafe');
  assert.equal(s[0].id, 'cafe');
  const v = L.foodSearch(DX.foods, 'oliva');
  assert.equal(v[0]._via, 'aceite de oliva');
});

test('QA-24 texto para compartir sin doble paréntesis', () => {
  const { L } = loadApp();
  const t = L.shoppingText([{ label: 'Verdulería', items: [{ text: 'Apio fresco (pencas y hojas)', qty: '12 pencas' }, { text: 'Limón', qty: '2' }] }]);
  assert.equal(t, '*VERDULERÍA*\n• Apio fresco (pencas y hojas): 12 pencas\n• Limón (2)');
});

test('QA-25 íconos PNG 192/512 generados con stdlib', () => {
  const root = path.join(__dirname, '..', '..');
  for (const px of [192, 512]) {
    const f = path.join(root, 'icon-' + px + '.png');
    if (!fs.existsSync(f)) return;   // armado todavía no corrido
    const b = fs.readFileSync(f);
    assert.equal(b.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(b.readUInt32BE(16), px); assert.equal(b.readUInt32BE(20), px);
  }
  const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  assert.match(sw, /fetch\(e\.request, \{ cache: 'no-cache' \}\)/, 'index.html va primero a la red');
});
