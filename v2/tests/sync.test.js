/* Fusión determinística y sincronización cifrada con fetch simulado (sin red real). */
function base() {
  const { L, U } = loadApp();
  const p = L.newProfile('Gus', 1000, 0);
  const ed = L.newEdition('detox-primavera-21', '2026-11-10', 'monodieta3', 1000);
  p.editions[ed.id] = ed; p.activeEdition = ed.id;
  return { L, U, p, ed };
}

test('fusión por parte del día: gana la marca más reciente', () => {
  const { L, U, p, ed } = base();
  const a = U.clone(p), b = U.clone(p);
  const da = L.ensureDay(a, ed.id, 1), db = L.ensureDay(b, ed.id, 1);
  da.habits = { limon: 'done' }; da._u.habits = 100;
  db.habits = { limon: 'done', infusion: 'done' }; db._u.habits = 200;
  da.checkin.notes = 'nota local nueva'; da._u.checkin = 300;
  db.checkin.notes = 'nota vieja'; db._u.checkin = 50;
  const m = L.mergeProfile(a, b).days[ed.id]['1'];
  assert.deepEqual(m.habits, { limon: 'done', infusion: 'done' });
  assert.equal(m.checkin.notes, 'nota local nueva');
});

test('comidas por id con lápidas', () => {
  const { L, U, p, ed } = base();
  const a = U.clone(p), b = U.clone(p);
  const da = L.ensureDay(a, ed.id, 2), db = L.ensureDay(b, ed.id, 2);
  da.meals.cena = [{ id: 'm1', name: 'Caldo', done: false, t: 10 }, { id: 'm2', name: 'Arroz', done: true, t: 11 }];
  db.meals.cena = [{ id: 'm1', name: 'Caldo', done: true, t: 10, u: 20 }, { id: 'm2', name: 'Arroz', done: true, t: 11, u: 30, deleted: true }, { id: 'm3', name: 'Té', done: false, t: 12 }];
  const cena = L.mergeProfile(a, b).days[ed.id]['2'].meals.cena;
  assert.deepEqual(cena.map(x => [x.id, x.done, !!x.deleted]), [['m1', true, false], ['m2', true, true], ['m3', false, false]]);
});

test('fusión conmutativa (mismo resultado en ambos sentidos)', () => {
  const { L, U, p, ed } = base();
  const a = U.clone(p), b = U.clone(p);
  const da = L.ensureDay(a, ed.id, 1), db = L.ensureDay(b, ed.id, 1);
  da.water = [{ t: 1, ml: 250 }]; da._u.water = 5;
  db.water = [{ t: 2, ml: 500 }]; db._u.water = 5; // empate
  a.shopping.checked = { v1: 100, v2: -300 }; b.shopping.checked = { v1: -200, v2: 250, d1: 10 };
  a.recipeLog.favorites = ['x']; b.recipeLog.favorites = ['y', 'x'];
  a.recipeLog.cooked = { x: [1, 2] }; b.recipeLog.cooked = { x: [2, 3] };
  const ab = L.mergeProfile(a, b), ba = L.mergeProfile(b, a);
  ba.id = ab.id;
  assert.deepEqual(ab.days, ba.days);
  assert.deepEqual(ab.shopping, ba.shopping);
  assert.deepEqual(ab.recipeLog, ba.recipeLog);
  assert.deepEqual(ab.shopping.checked, { d1: 10, v1: -200, v2: -300 });
  assert.deepEqual(ab.recipeLog.favorites, ['x', 'y']);
  assert.deepEqual(ab.recipeLog.cooked.x, [1, 2, 3]);
});

test('settings por updatedAt; el bloque sync siempre es el local', () => {
  const { L, U, p } = base();
  const a = U.clone(p), b = U.clone(p);
  a.settings.allergies = ['apio']; a.settings.updatedAt = 10; a.settings.sync.code = 'LOCAL';
  b.settings.allergies = ['gluten']; b.settings.updatedAt = 20; b.settings.sync.code = 'REMOTO';
  const m = L.mergeProfile(a, b);
  assert.deepEqual(m.settings.allergies, ['gluten']);
  assert.equal(m.settings.sync.code, 'LOCAL');
});

test('ediciones por id y plan por fecha', () => {
  const { L, U, p, ed } = base();
  const a = U.clone(p), b = U.clone(p);
  const e2 = L.newEdition('semana-limpia-7', '2026-12-01', 'directo', 2000); b.editions[e2.id] = e2;
  a.editions[ed.id].note = 'local'; a.editions[ed.id].updatedAt = 5000;
  a.plan = { '2026-11-20': { cena: ['caldo-detox'], u: 1 } }; b.plan = { '2026-11-20': { cena: ['arroz-yamani'], u: 2 }, '2026-11-21': { almuerzo: ['x'], u: 1 } };
  const m = L.mergeProfile(a, b);
  assert.equal(Object.keys(m.editions).length, 2);
  assert.equal(m.editions[ed.id].note, 'local');
  assert.deepEqual(m.plan['2026-11-20'].cena, ['arroz-yamani']);
  assert.ok(m.plan['2026-11-21']);
});

test('códigos nuevos: alfabeto, formato y normalización', () => {
  const { L } = loadApp();
  const c = L.newSyncCode(new Uint8Array([0, 1, 2, 31, 32, 63, 64, 100, 200, 255, 7, 8]));
  assert.equal(c.length, 12);
  assert.ok([...c].every(ch => L.SYNC_ALPHA.includes(ch)));
  assert.equal(L.fmtCode(c), c.slice(0, 4) + '-' + c.slice(4, 8) + '-' + c.slice(8));
  assert.equal(L.isNewCode('abcd-efgh-jkmn'), true);
  assert.equal(L.isNewCode('ABCD-EFGH-JKM0'), false, '0 no está en el alfabeto');
  assert.equal(L.isLegacyCode('GUS-7Q4K'), true);
  assert.equal(L.canonicalCode('abcd efgh jkmn'), 'ABCDEFGHJKMN');
});

test('clave KV: dx2_ + 32 hex de SHA-256', async () => {
  const { L } = loadApp();
  const k1 = await L.kvKey('ABCD-EFGH-JKMN'), k2 = await L.kvKey('abcdefghjkmn');
  assert.match(k1, /^dx2_[0-9a-f]{32}$/);
  assert.equal(k1, k2);
  const crypto = require('crypto');
  assert.equal(k1, 'dx2_' + crypto.createHash('sha256').update('dx2:ABCDEFGHJKMN').digest('hex').slice(0, 32));
});

test('cifrado AES-GCM ida y vuelta; código equivocado falla', async () => {
  const { L } = loadApp();
  const obj = { hola: 'mundo', n: [1, 2, 3], ñ: 'tildes áé' };
  const enc = await L.encrypt(obj, 'ABCDEFGHJKMN', { iter: 1000 });
  assert.equal(enc.v, 2);
  assert.ok(!JSON.stringify(enc).includes('mundo'));
  assert.equal(L.unb64(enc.salt).length, 16);
  assert.deepEqual(await L.decrypt(enc, 'abcd-efgh-jkmn'), obj);
  await assert.rejects(L.decrypt(enc, 'ZZZZZZZZZZZZ'), /código no coincide/);
});

function mockKV() {
  const store = new Map();
  const calls = [];
  const fetch = async (url, opt) => {
    const key = decodeURIComponent(url.split('/').pop().split('?')[0]);
    calls.push([opt.method, key]);
    if (opt.method === 'GET') return store.has(key) ? { ok: true, status: 200, text: async () => store.get(key) } : { ok: false, status: 404, text: async () => '' };
    if (opt.method === 'POST') { store.set(key, opt.body); return { ok: true, status: 200 }; }
    if (opt.method === 'DELETE') { store.delete(key); return { ok: true, status: 200 }; }
  };
  return { store, calls, fetch };
}

test('syncOnce: dos dispositivos convergen sin pisarse (fetch simulado)', async () => {
  const { L, U, p, ed } = base();
  L.PBKDF2_ITER = 1000; // más rápido en tests
  const kv = mockKV();
  const client = L.kvClient(kv.fetch, 'https://kv.test/b/');
  const code = 'ABCDEFGHJKMN';
  const pc = U.clone(p), cel = U.clone(p);
  const d1 = L.ensureDay(pc, ed.id, 1); d1.habits = { limon: 'done' }; d1._u.habits = 100;
  const r1 = await L.syncOnce({ kv: client, code, local: pc, now: 1 });
  assert.equal(r1.pulled, false);
  const d2 = L.ensureDay(cel, ed.id, 1); d2.checkin.notes = 'desde el celu'; d2._u.checkin = 200;
  const r2 = await L.syncOnce({ kv: client, code, local: cel, now: 2 });
  assert.equal(r2.pulled, true);
  assert.equal(r2.profile.days[ed.id]['1'].habits.limon, 'done');
  assert.equal(r2.profile.days[ed.id]['1'].checkin.notes, 'desde el celu');
  const r3 = await L.syncOnce({ kv: client, code, local: r1.profile, now: 3 });
  assert.equal(r3.profile.days[ed.id]['1'].checkin.notes, 'desde el celu');
  // lo guardado está cifrado
  const raw = [...kv.store.values()][0];
  assert.ok(!raw.includes('desde el celu'));
});

test('syncOnce con código viejo GUS-XXXX importa el JSON v1 legado', async () => {
  const { L, p } = base();
  L.PBKDF2_ITER = 1000;
  const kv = mockKV();
  kv.store.set('GUS-7Q4K', fixture('v1-kvdb-payload.json'));
  const client = L.kvClient(kv.fetch, 'https://kv.test/b/');
  const r = await L.syncOnce({ kv: client, code: 'GUS-7Q4K', local: p, now: 5, today: '2026-11-15' });
  assert.equal(r.legacyImported, true);
  const eds = Object.values(r.profile.editions);
  assert.equal(eds.length, 2);
  const imported = eds.find(e => e.startDate === '2026-11-12');
  assert.equal(r.profile.days[imported.id]['1'].checkin.notes, 'desde la nube');
  assert.equal(r.profile.name, 'Gus', 'no pisa el nombre local');
  assert.ok(kv.calls.some(c => c[0] === 'GET' && c[1] === 'GUS-7Q4K'));
  assert.ok(kv.calls.some(c => c[0] === 'POST' && c[1].startsWith('dx2_')));
  assert.equal(kv.store.get('GUS-7Q4K'), fixture('v1-kvdb-payload.json'), 'nunca escribe la clave vieja');
});

test('importar copia: Fusionar agrega perfiles nuevos y fusiona los existentes', () => {
  const { L, U, p } = base();
  const s1 = L.newState(); s1.profiles[p.id] = U.clone(p); s1.activeProfile = p.id;
  const other = L.newProfile('Jime', 3000, 1);
  const s2 = L.newState(); s2.profiles[other.id] = other; s2.profiles[p.id] = U.clone(p); s2.profiles[p.id].name = 'Gustavo'; s2.profiles[p.id].updatedAt = 9999;
  const m = L.mergeState(s1, s2);
  assert.equal(Object.keys(m.profiles).length, 2);
  assert.equal(m.profiles[p.id].name, 'Gustavo');
  assert.equal(m.activeProfile, p.id);
});
