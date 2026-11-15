/* Ronda 3 de QA: QA-36 (una sola edición en curso por programa) y `choiceCategory` en la heladera. */
const NOW = Date.UTC(2026, 10, 15, 15);

test('QA-36 tras fusionar la v1 con otra fecha, queda una sola edición en curso', () => {
  const { L } = loadApp();
  const p = L.newProfile('Gus', NOW, 0);
  const ed = L.newEdition('detox-primavera-21', '2026-11-09', 'monodieta3', NOW);
  p.editions[ed.id] = ed; p.activeEdition = ed.id;
  const mig = L.migrateV1Payload(JSON.parse(fixture('v1-kvdb-payload.json')), undefined, NOW, '2026-11-15'); // inicio 12/11
  const out = L.mergeV1IntoProfile(p, mig.state.profiles[mig.state.activeProfile], '2026-11-15');
  const eds = Object.values(out.editions);
  assert.equal(eds.length, 2);
  const running = eds.filter(e => e.status === 'active' || e.status === 'planned');
  assert.equal(running.length, 1);
  assert.equal(running[0].id, ed.id, 'sigue en curso la edición activa');
  const other = eds.find(e => e.id !== ed.id);
  assert.equal(other.status, 'archived');
  assert.match(other.note, /otra edición en curso/);
  assert.ok(out.days[other.id]['1'], 'sus días se conservan');
});

test('QA-36 settleEditions: la que ya terminó por fecha queda «done»; programas distintos no se tocan', () => {
  const { L } = loadApp();
  const p = L.newProfile('x', NOW);
  const a = L.newEdition('detox-primavera-21', '2026-11-10', 'monodieta3', NOW);
  const b = L.newEdition('detox-primavera-21', '2026-09-01', 'monodieta3', NOW); b.status = 'active';
  const c = L.newEdition('semana-limpia-7', '2026-11-14', 'directo', NOW);
  [a, b, c].forEach(e => p.editions[e.id] = e); p.activeEdition = a.id;
  const changed = L.settleEditions(p, '2026-11-15');
  assert.deepEqual(changed, [b.id]);
  assert.equal(b.status, 'done');
  assert.equal(a.status, 'active');
  assert.equal(c.status, 'active');
  assert.deepEqual(L.settleEditions(p, '2026-11-15'), [], 'idempotente');
});

test('choiceCategory: «a elegir» cuenta si tenés algo de esa categoría; faltante «alguna verdura»; compras lo ignora', () => {
  const { L } = loadApp();
  const r = { id: 'trio', title: 'Trío', servings: 2, ingredients: [
    { text: '3 verduras a elección', qty: 3, unit: 'unidad', item: null, role: 'principal', choice: true, choiceCategory: 'verduras' },
    { text: '1 cda de lino', qty: 1, unit: 'cda', item: 'limon', role: 'condimento' }] };
  let m = L.fridgeMatch([r], ['limon'])[0];
  assert.equal(m.missing.length, 1);
  assert.equal(m.missing[0].name, 'alguna verdura');
  assert.equal(m.missing[0].item, null);
  m = L.fridgeMatch([r], ['limon', 'apio'])[0];
  assert.equal(m.score, 100);
  assert.equal(m.tier, 'lista');
  const p = L.newProfile('x', NOW); p.customRecipes.push(Object.assign({ steps: [{ text: 'x' }] }, r, { id: 'my-trio' }));
  p.plan = { '2026-11-16': { almuerzo: ['my-trio'] } };
  const agg = L.aggregateIngredients(L.planEntries(p.plan, '2026-11-16', '2026-11-16'), p, 2);
  assert.deepEqual(agg.map(g => g.item), ['limon']);
});
