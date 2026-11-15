/* Calendario/fases, hábitos, racha con gracia, constancia, puntos y logros, sugerencias, heladera, compras, .ics, correlaciones. */
const NOW = Date.UTC(2026, 10, 15, 15);

function setup(start, mode) {
  const { L, U, DX } = loadApp();
  const p = L.newProfile('Test', NOW, 0);
  const ed = L.newEdition('detox-primavera-21', start, mode || 'monodieta3', NOW);
  p.editions[ed.id] = ed; p.activeEdition = ed.id;
  const all = ['limon', 'masticacion', 'infusion', 'no_estimulantes', 'hidratacion', 'plato_verde'];
  const complete = (idx) => { const d = L.ensureDay(p, ed.id, idx); all.forEach(h => d.habits[h] = 'done'); return d; };
  const partial = (idx, n) => { const d = L.ensureDay(p, ed.id, idx); all.slice(0, n).forEach(h => d.habits[h] = 'done'); return d; };
  return { L, U, DX, p, ed, complete, partial };
}

test('fechas: validación real y diferencia robusta', () => {
  const { U } = loadApp();
  assert.equal(U.isValidISO('2026-02-31'), false);
  assert.equal(U.isValidISO('2028-02-29'), true);
  assert.equal(U.isValidISO('2026-13-01'), false);
  assert.equal(U.diffDays('2026-03-28', '2026-04-05'), 8);
  assert.equal(U.addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(U.mondayOf('2026-11-15'), '2026-11-09'); // domingo
  assert.equal(U.nextMonday('2026-11-15'), '2026-11-16');
  assert.equal(U.nextMonday('2026-11-16'), '2026-11-23');
});

test('dayIndex: sin fecha, preparación, en curso y terminado', () => {
  const { L, DX } = loadApp();
  const prog = DX.programs[0];
  assert.equal(L.dayIndex({ startDate: null }, prog, '2026-11-15'), null);
  assert.equal(L.dayIndex({ startDate: '2026-11-20' }, prog, '2026-11-15'), 0);
  assert.equal(L.dayIndex({ startDate: '2026-11-15' }, prog, '2026-11-15'), 1);
  assert.equal(L.dayIndex({ startDate: '2026-11-01' }, prog, '2026-11-21'), 21);
  assert.equal(L.dayIndex({ startDate: '2026-11-01' }, prog, '2026-11-22'), 21);
  const c = L.clock({ startDate: '2026-11-20' }, prog, '2026-11-15');
  assert.equal(c.status, 'future'); assert.equal(c.daysUntil, 5);
  assert.equal(L.clock({ startDate: '2026-11-01' }, prog, '2026-11-22').status, 'finished');
});

test('fases según modo de inicio', () => {
  const { L, DX } = loadApp();
  const prog = DX.programs[0];
  assert.equal(L.phaseId(prog, 'monodieta3', 0), 'previa');
  assert.equal(L.phaseId(prog, 'monodieta3', 3), 'monodieta');
  assert.equal(L.phaseId(prog, 'monodieta3', 4), 'general');
  assert.equal(L.phaseId(prog, 'monodieta1', 2), 'general');
  assert.equal(L.phaseId(prog, 'directo', 1), 'general');
  const semana = DX.programs[1];
  assert.equal(L.phaseId(semana, 'directo', 1), 'general');
  assert.equal(L.habitsFor(prog, 'previa', 0).map(h => h.id).join(), 'cafeina_mitad,compras_iniciales');
  assert.equal(L.habitsFor(prog, 'general', 5).length, 6);
});

test('racha: hoy incompleto no corta; la gracia sostiene sin sumar', () => {
  // inicio 2026-11-08 → hoy (15) es el día 8
  const { L, p, ed, complete, partial } = setup('2026-11-08');
  [1, 2, 3, 5, 7].forEach(complete);    // 4 y 6 incompletos → gracia
  partial(8, 2);                          // hoy a medias
  const s = L.summary(p, ed.id, '2026-11-15');
  assert.equal(s.clock.idx, 8);
  assert.equal(s.days[4].status, 'grace');
  assert.equal(s.days[6].status, 'grace');
  assert.equal(s.graceUsed, 2);
  assert.equal(s.streak, 5);
  assert.equal(s.bestStreak, 5);
  assert.equal(s.completeDays, 5);
});

test('racha: una tercera falta corta (sin culpa: no es cero si hay días después)', () => {
  const { L, p, ed, complete } = setup('2026-11-08');
  [1, 5, 6, 7].forEach(complete);         // 2,3 gracia; 4 corta
  const s = L.summary(p, ed.id, '2026-11-15');
  assert.equal(s.days[4].status, 'empty');
  assert.equal(s.streak, 3);
  complete(8);
  assert.equal(L.summary(p, ed.id, '2026-11-15').streak, 4);
});

test('racha y constancia usan la fecha real, no el día mirado', () => {
  const { L, p, ed, complete } = setup('2026-11-08');
  [1, 2, 3].forEach(complete);
  const a = L.summary(p, ed.id, '2026-11-11'); // hoy = día 4
  const b = L.summary(p, ed.id, '2026-11-11');
  assert.equal(a.streak, 3); assert.equal(b.streak, 3);
});

test('constancia: % de días transcurridos con ≥ 80 %', () => {
  const { L, p, ed, complete, partial } = setup('2026-11-08');
  complete(1); partial(2, 5); partial(3, 3); // 6 hábitos: 5/6 = 83 % cuenta; 3/6 no
  const s = L.summary(p, ed.id, '2026-11-11'); // hoy día 4, sin datos: no cuenta
  assert.equal(s.elapsed, 3);
  assert.ok(Math.abs(s.constancy - 2 / 3) < 1e-9);
});

test('puntos derivados: 15 por hábito, 50 por día completo + logros (sin XP infinito)', () => {
  const { L, p, ed, complete } = setup('2026-11-08');
  complete(1);
  const s1 = L.summary(p, ed.id, '2026-11-15');
  // 6×15 + 50 + logro «inicio» 50
  assert.equal(s1.points, 90 + 50 + 50);
  // desmarcar y marcar de nuevo da lo mismo
  const d = p.days[ed.id]['1']; delete d.habits.limon; d.habits.limon = 'done';
  assert.equal(L.summary(p, ed.id, '2026-11-15').points, s1.points);
});

test('logros medibles', () => {
  const { L, p, ed, complete } = setup('2026-11-01'); // hoy día 15
  for (let i = 1; i <= 7; i++) complete(i);
  const s = L.summary(p, ed.id, '2026-11-15');
  const b = Object.fromEntries(s.badges.map(x => [x.id, x.unlocked]));
  assert.equal(b.inicio, true);
  assert.equal(b.monodieta, true);
  assert.equal(b.adios_cafeina, true);
  assert.equal(b.semana1, true);
  assert.equal(b.detox_champion, false);
});

test('logro monodieta oculto en modo directo; semana1 vale con gracia', () => {
  const { L, p, ed, complete } = setup('2026-11-01', 'directo');
  [1, 2, 3, 5, 6, 7].forEach(complete);
  const s = L.summary(p, ed.id, '2026-11-15');
  assert.equal(s.badges.some(b => b.id === 'monodieta'), false);
  assert.equal(s.badges.find(b => b.id === 'semana1').unlocked, true);
});

test('sugerencias: monodieta solo recetas permitidas, sin alérgenos, con motivo', () => {
  const { L, DX, p, ed } = setup('2026-11-15');
  p.settings.allergies = ['apio'];
  const sug = L.suggest({ profile: p, editionId: ed.id, program: DX.programs[0], phaseId: 'monodieta', slot: 'almuerzo', dayIdx: 1, dateISO: '2026-11-15' });
  const ids = sug.map(s => s.recipe.id);
  assert.ok(ids.every(id => ['nituke-manzana', 'arroz-yamani', 'caldo-detox'].includes(id)));
  assert.ok(!ids.includes('caldo-detox'), 'tiene apio');
  assert.equal(sug[0].reason, 'Aún no la probaste');
});

test('sugerencias: alergia libre por palabra completa, rotación y límite semanal', () => {
  const { L, DX, p, ed } = setup('2026-11-08');
  p.settings.customAllergies = ['limón'];
  const d = L.ensureDay(p, ed.id, 6);
  d.meals.almuerzo.push({ id: 'a', name: 'Papa al horno', recipeId: 'papa-horno', done: true, t: 1 });
  const d2 = L.ensureDay(p, ed.id, 7);
  d2.meals.almuerzo.push({ id: 'b', name: 'Arroz', recipeId: 'arroz-yamani', done: true, t: 2 });
  const sug = L.suggest({ profile: p, editionId: ed.id, program: DX.programs[0], phaseId: 'general', slot: 'almuerzo', dayIdx: 8, dateISO: '2026-11-15', n: 10 });
  const ids = sug.map(s => s.recipe.id);
  assert.ok(!ids.includes('ensalada-zanahoria') && !ids.includes('hummus-mung') && !ids.includes('bowl-yamani-cruciferas'), 'contienen limón');
  assert.ok(!ids.includes('papa-horno'), 'límite 1 por semana');
  assert.equal(ids[ids.length - 1], 'arroz-yamani', 'la ya comida va al final');
  assert.equal(sug[sug.length - 1].reason, 'Hace 1 día');
});

test('constitución friolenta prioriza cocido y baja crudos a la noche', () => {
  const { L, DX, p, ed } = setup('2026-11-08');
  p.settings.constitution = 'friolento';
  const sug = L.suggest({ profile: p, editionId: ed.id, program: DX.programs[0], phaseId: 'general', slot: 'cena', dayIdx: 8, dateISO: '2026-11-15', n: 10 });
  const ids = sug.map(s => s.recipe.id);
  assert.ok(ids.indexOf('caldo-detox') < ids.indexOf('ensalada-zanahoria'));
  assert.match(sug[0].reason, /friolentos/);
});

test('alérgenos: sin falsos positivos por subcadena', () => {
  const { U } = loadApp();
  assert.equal(U.hasWords('Aliño de mostaza', 'lino'), false);
  assert.equal(U.hasWords('apagar el fuego', 'agar'), false);
  assert.equal(U.hasWords('2 cdas de lino molido', 'lino'), true);
  assert.equal(U.hasWords('Jugo de LIMÓN', 'limon'), true);
});

test('heladera 80/20 con topes y tiers', () => {
  const { L, DX } = loadApp();
  const byId = id => DX.recipes.find(r => r.id === id);
  // caldo: 3 principales (apio, zanahoria, manzana) + 1 condimento (jengibre)
  let r = L.fridgeMatch([byId('caldo-detox')], ['apio', 'zanahoria', 'manzana', 'jengibre'])[0];
  assert.equal(r.score, 100); assert.equal(r.tier, 'lista');
  r = L.fridgeMatch([byId('caldo-detox')], ['apio', 'zanahoria', 'manzana'])[0];
  assert.equal(r.score, 80); assert.equal(r.tier, 'casi'); assert.equal(r.missing.length, 1);
  r = L.fridgeMatch([byId('caldo-detox')], ['apio', 'jengibre'])[0];
  assert.equal(r.score, 40); assert.equal(r.tier, 'lejos'); // 1/3 principales < 50 % → tope 40
  r = L.fridgeMatch([byId('caldo-detox')], ['jengibre'])[0];
  assert.equal(r.score, 20); // 0 principales → tope 20
  // aceite es básico de alacena (pantry): cuenta como presente
  r = L.fridgeMatch([byId('hummus-mung')], ['mung', 'limon'])[0];
  assert.equal(r.score, 100);
  // nituke: la sal es «basico» y no cuenta
  r = L.fridgeMatch([byId('nituke-manzana')], ['manzana'])[0];
  assert.equal(r.score, 100);
});

test('compras desde el plan: suma por ítem y unidad, escala porciones, excluye alacena', () => {
  const { L } = loadApp();
  const p = L.newProfile('x', NOW);
  p.plan = { '2026-11-16': { almuerzo: ['caldo-detox'], cena: ['caldo-detox'] }, '2026-11-17': { almuerzo: ['ensalada-zanahoria'] }, '2026-12-01': { cena: ['arroz-yamani'] } };
  const entries = L.planEntries(p.plan, '2026-11-16', '2026-11-22');
  assert.equal(entries.length, 3);
  const agg = L.aggregateIngredients(entries, p, 2);
  const zan = agg.find(g => g.item === 'zanahoria');
  // caldo (4 porciones) ×2 escalado a 2 porciones: 2×(2×0.5)=2 + ensalada (2 porciones) 3 → 5
  assert.deepEqual(zan.parts, [{ qty: 5, unit: 'unidad' }]);
  assert.equal(L.fmtParts(zan), '5 unidades');
  const jen = agg.find(g => g.item === 'jengibre');
  assert.equal(jen.free, true);
  assert.equal(L.fmtParts(jen), 'a gusto');
  assert.ok(!agg.some(g => g.item === 'sal_marina'));
  const mixed = { item: 'x', parts: [{ qty: 2, unit: 'unidad' }, { qty: 300, unit: 'g' }], free: false };
  assert.equal(L.fmtParts(mixed), '2 unidades + 300 g');
});

test('texto de compras para WhatsApp', () => {
  const { L } = loadApp();
  const t = L.shoppingText([{ label: 'Verdulería', items: [{ text: 'Apio', qty: '1 planta' }, { text: 'Limones', qty: '' }] }, { label: 'Vacío', items: [] }]);
  assert.equal(t, '*VERDULERÍA*\n• Apio (1 planta)\n• Limones');
});

test('remojos según recetas', () => {
  const { L } = loadApp();
  const s = L.soaksForRecipes(['bowl-yamani-cruciferas', 'hummus-mung'], null);
  assert.deepEqual(s.map(x => x.soak.id).sort(), ['arroz', 'mung']);
});

test('interpretar línea de ingrediente', () => {
  const { L } = loadApp();
  let r = L.parseIngredientLine('2 tazas de arroz yamaní');
  assert.equal(r.qty, 2); assert.equal(r.unit, 'taza'); assert.equal(r.item, 'arroz_yamani');
  r = L.parseIngredientLine('½ limón');
  assert.equal(r.qty, 0.5); assert.equal(r.item, 'limon');
  r = L.parseIngredientLine('sal marina a gusto');
  assert.equal(r.qty, null); assert.equal(r.item, 'sal_marina');
});

test('fracciones legibles para escalado', () => {
  const { U } = loadApp();
  assert.equal(U.frac(0.5), '½'); assert.equal(U.frac(1.25), '1 ¼'); assert.equal(U.frac(2), '2'); assert.equal(U.frac(0.333), '⅓');
  assert.equal(U.fmtQty(1.5, 'taza'), '1 ½ tazas'); assert.equal(U.fmtQty(300, 'g'), '300 g');
});

test('.ics válido con TZID y RRULE', () => {
  const { L } = loadApp();
  const ics = L.buildICS([{ title: 'Agua, con limón', date: '2026-11-16', time: '08:00', count: 21 }, { title: 'Remojo', date: '2026-11-17', time: '20:30' }], { now: NOW });
  assert.match(ics, /^BEGIN:VCALENDAR\r\nVERSION:2.0\r\n/);
  assert.match(ics, /DTSTART;TZID=America\/Argentina\/Buenos_Aires:20261116T080000\r\n/);
  assert.match(ics, /DTEND;TZID=America\/Argentina\/Buenos_Aires:20261116T081500/);
  assert.match(ics, /RRULE:FREQ=DAILY;COUNT=21/);
  assert.match(ics, /SUMMARY:Agua\\, con limón/);
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 2);
  assert.equal((ics.match(/RRULE/g) || []).length, 1);
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
});

test('correlaciones: requieren ≥ 6 días y ≥ 3 por grupo, máx. 3', () => {
  const { L, p, ed, complete, partial } = setup('2026-11-01');
  for (let i = 1; i <= 5; i++) { const d = complete(i); d.checkin.energy = 4; }
  let s = L.summary(p, ed.id, '2026-11-15');
  assert.equal(L.correlations(s).enough, false);
  for (let i = 6; i <= 9; i++) { const d = partial(i, 2); d.checkin.energy = 2; }
  s = L.summary(p, ed.id, '2026-11-15');
  const c = L.correlations(s);
  assert.equal(c.enough, true);
  assert.ok(c.findings.length > 0 && c.findings.length <= 3);
  assert.ok(c.findings[0].nWith >= 3 && c.findings[0].nWithout >= 3);
});

test('informe de texto con título y versión correctos', () => {
  const { L, p, ed, complete } = setup('2026-11-08');
  const d = complete(1); d.checkin.energy = 4; d.checkin.notes = 'bien';
  const t = L.reportText(p, L.summary(p, ed.id, '2026-11-15'));
  assert.match(t, /^INFORME DE SEGUIMIENTO/);
  assert.match(t, /v2\.0\.0/);
  assert.match(t, /Notas: bien/);
});
