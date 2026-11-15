/* Migración v1 → v2 (§3.1) con fixtures de los 3 formatos de comidas, JSON roto, solo cookie y fecha inválida. */
const NOW = Date.UTC(2026, 10, 15, 15, 0, 0);
const TODAY = '2026-11-15';
const fx = n => JSON.parse(fixture(n));
function run(raw) {
  const { L } = loadApp();
  const r = L.migrateV1(raw, undefined, NOW, TODAY);
  const p = r.state.profiles[r.state.activeProfile];
  return { L, r, p, ed: p.editions[p.activeEdition], days: p.days[p.activeEdition] };
}

test('localStorage completo: edición, fecha, modo y estado', () => {
  const { r, ed } = run(fx('v1-localstorage.json'));
  assert.equal(ed.programId, 'detox-primavera-21');
  assert.equal(ed.startDate, '2026-11-10');
  assert.equal(ed.startMode, 'monodieta2');
  assert.equal(ed.status, 'active');
  assert.equal(r.state.device.theme, 'dark');
  assert.equal(r.state.device.migratedFromV1At, NOW);
  assert.ok(r.report.migrated);
});

test('misiones day_N → hábitos hechos (solo true, días fuera de rango se descartan)', () => {
  const { days } = run(fx('v1-localstorage.json'));
  assert.equal(days['0'].habits.limon, 'done');
  assert.equal(Object.keys(days['1'].habits).length, 6);
  assert.deepEqual(days['2'].habits, { limon: 'done' });
  assert.equal(days['99'], undefined);
});

test('bitácora dia_N → check-in (energía numérica, síntomas por v1, resto a libres)', () => {
  const { days } = run(fx('v1-localstorage.json'));
  const c = days['1'].checkin;
  assert.equal(c.energy, 4);
  assert.equal(c.digestion, 'optima');
  assert.deepEqual(c.symptoms, ['sed_intensa', 'cefalea']);
  assert.deepEqual(c.customSymptoms, ['Picazón rara']);
  assert.equal(c.notes, 'Dormí bien');
  assert.equal(c.updatedAt, 1790611200000);
  assert.equal(days['2'].checkin.energy, null, 'energía fuera de 1..5');
  assert.equal(days['2'].checkin.digestion, null, 'digestión desconocida');
});

test('comidas en sus 3 formatos con ids estables', () => {
  const { days } = run(fx('v1-localstorage.json'));
  const m = days['1'].meals;
  // formato {text,done,items}: ítems con name o text
  assert.equal(m.desayuno.length, 2);
  assert.deepEqual(m.desayuno.map(x => x.id), ['m_1_desayuno_0', 'm_1_desayuno_1']);
  assert.equal(m.desayuno[0].recipeId, 'nituke-manzana');
  assert.equal(m.desayuno[1].name, 'Té de jengibre');
  assert.equal(m.desayuno[1].done, false);
  // formato array (ítem con text) y resolución por título
  assert.equal(m.almuerzo.length, 2);
  assert.equal(m.almuerzo[0].recipeId, 'caldo-detox');
  assert.equal(m.almuerzo[0].done, true);
  assert.equal(m.almuerzo[1].recipeId, null);
  // formato {text,done} sin items
  assert.deepEqual(m.cena.map(x => [x.id, x.name, x.done]), [['m_1_cena_0', 'sopa de la abuela', false]]);
  // vacío no genera ítems
  assert.equal(m.merienda.length, 0);
  // repetir la migración da los mismos ids
  const again = run(fx('v1-localstorage.json')).days['1'].meals;
  assert.deepEqual(again.cena.map(x => x.id), m.cena.map(x => x.id));
});

test('alergias, compras, heladera, código de sync', () => {
  const { p } = run(fx('v1-localstorage.json'));
  assert.deepEqual(p.settings.allergies, ['frutos_secos', 'gluten']);
  assert.deepEqual(p.settings.customAllergies, ['palta']);
  assert.deepEqual(Object.keys(p.shopping.checked).sort(), ['d1', 'v1']);
  assert.deepEqual(p.fridge, ['manzana', 'arroz_yamani'], 'agua_filtro no existe en el catálogo');
  assert.equal(p.settings.sync.legacyCode, 'GUS-7Q4K');
  assert.equal(p.name, '', 'el nombre se pide en el onboarding');
});

test('cuenta días con registros', () => {
  const { r } = run(fx('v1-localstorage.json'));
  assert.equal(r.report.days, 3); // días 0, 1 y 2
});

test('JSON roto y fecha inválida: no rompe, avisa y deja la edición sin fecha', () => {
  const { r, ed, days, p } = run(fx('v1-broken.json'));
  assert.equal(ed.startDate, null);
  assert.equal(ed.status, 'planned');
  assert.equal(ed.startMode, 'monodieta3', 'modo desconocido → recomendado');
  assert.ok(r.report.warnings.length >= 3);
  assert.equal(days['1'], undefined, 'misiones con JSON roto se omiten');
  assert.deepEqual(days['3'].meals.cena.map(x => x.name), ['guiso']);
  assert.deepEqual(p.settings.allergies, ['apio']);
});

test('solo cookie (sin localStorage): lee y migra', () => {
  const { L } = loadApp();
  const raw = L.readV1Raw(() => { throw new Error('localStorage bloqueado'); }, fixture('v1-cookie.txt'));
  assert.equal(raw.detox_start_date, '2026-11-01');
  const r = L.migrateV1(raw, undefined, NOW, TODAY);
  const p = r.state.profiles[r.state.activeProfile];
  const ed = p.editions[p.activeEdition];
  assert.equal(ed.startDate, '2026-11-01');
  assert.equal(p.days[ed.id]['3'].habits.limon, 'done');
  assert.deepEqual(p.settings.allergies, ['citricos']);
  assert.equal(r.state.device.theme, 'light');
});

test('localStorage tiene prioridad sobre la cookie', () => {
  const { L } = loadApp();
  const raw = L.readV1Raw(k => k === 'detox_start_date' ? '2026-10-01' : null, fixture('v1-cookie.txt'));
  assert.equal(raw.detox_start_date, '2026-10-01');
  assert.ok(raw.detox_completed_missions.includes('day_3'));
});

test('edición vieja (más de 21 días) queda terminada', () => {
  const { ed } = run({ detox_start_date: '2026-09-28', detox_completed_missions: '{}' });
  assert.equal(ed.status, 'done');
});

test('sin datos reales (solo tema): no crea edición', () => {
  const { r, p } = run({ detox_dark_mode: 'false', detox_active_tab: 'dia' });
  assert.equal(r.report.migrated, false);
  assert.equal(p.activeEdition, null);
  assert.equal(r.state.device.theme, 'light');
});

test('payload de kvdb v1 se migra igual', () => {
  const { L } = loadApp();
  const obj = fx('v1-kvdb-payload.json');
  assert.ok(L.isV1Payload(obj));
  const r = L.migrateV1Payload(obj, undefined, NOW, TODAY);
  const p = r.state.profiles[r.state.activeProfile];
  const d1 = p.days[p.activeEdition]['1'];
  assert.equal(d1.checkin.notes, 'desde la nube');
  assert.equal(d1.meals.desayuno[0].recipeId, 'nituke-manzana');
  assert.equal(d1.habits.infusion, 'done');
});

test('el estado migrado pasa la normalización', () => {
  const { L, r } = run(fx('v1-localstorage.json'));
  const s = L.normalizeState(JSON.parse(JSON.stringify(r.state)));
  assert.equal(s.schema, 2);
  assert.ok(s.profiles[s.activeProfile]);
});
