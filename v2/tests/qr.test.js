/* QR propio: vectores conocidos (ISO 18004 / thonky.com) + un decodificador independiente escrito acá. */
const { L } = loadApp();
const Q = L.qr;

test('Reed-Solomon: vector conocido «HELLO WORLD» 1-M', () => {
  const data = [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236, 17, 236, 17];
  assert.deepEqual(Q.rsRemainder(data, Q.rsDivisor(10)), [196, 35, 39, 119, 235, 215, 231, 226, 93, 23]);
});

test('bits de formato para nivel M (tabla del estándar)', () => {
  const M = ['101010000010010', '101000100100101', '101111001111100', '101101101001011', '100010111111001', '100000011001110', '100111110010111', '100101010100000'];
  M.forEach((s, mask) => assert.equal(Q.formatBits(mask).toString(2).padStart(15, '0'), s, 'máscara ' + mask));
});

test('bits de versión 7 a 10 (tabla del estándar)', () => {
  assert.equal(Q.versionBits(7), 0x07C94); assert.equal(Q.versionBits(8), 0x085BC);
  assert.equal(Q.versionBits(9), 0x09A99); assert.equal(Q.versionBits(10), 0x0A4D3);
});

/* ---- decodificador independiente ---- */
const EXP = [], LOG = [];
(() => { let x = 1; for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11D; } })();
const gmul = (a, b) => a && b ? EXP[(LOG[a] + LOG[b]) % 255] : 0;
// [total codewords, cantidad de bloques, ec por bloque] nivel M, versiones 1..10 (ISO 18004 tabla 9)
const SPEC = { 1: [26, 1, 10], 2: [44, 1, 16], 3: [70, 1, 26], 4: [100, 2, 18], 5: [134, 2, 24], 6: [172, 4, 16], 7: [196, 4, 18], 8: [242, 4, 22], 9: [292, 5, 22], 10: [346, 5, 26] };
const CENTERS = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50] };
function decodeQR(m) {
  const n = m.length, v = (n - 17) / 4;
  const fb = [];
  for (let i = 0; i <= 5; i++) fb.push(m[i][8]);
  fb.push(m[7][8], m[8][8], m[8][7]);
  for (let i = 9; i < 15; i++) fb.push(m[8][14 - i]);
  // segunda copia: debe coincidir
  const fb2 = [];
  for (let i = 0; i < 8; i++) fb2.push(m[8][n - 1 - i]);
  for (let i = 8; i < 15; i++) fb2.push(m[n - 15 + i][8]);
  assert.deepEqual(fb2, fb, 'las dos copias del formato coinciden');
  const raw = fb.reduce((s, b, i) => s | ((b ? 1 : 0) << i), 0) ^ 0x5412;
  const ecl = raw >> 13, mask = (raw >> 10) & 7;
  assert.equal(ecl, 0, 'nivel M');
  assert.equal(m[n - 8][8], true, 'módulo oscuro');
  const al = CENTERS[v];
  const isFn = (x, y) => {
    if ((x < 9 && y < 9) || (x >= n - 8 && y < 9) || (x < 9 && y >= n - 8)) return true;
    if (x === 6 || y === 6) return true;
    if (v >= 7 && ((x >= n - 11 && x < n - 8 && y < 6) || (y >= n - 11 && y < n - 8 && x < 6))) return true;
    for (const cy of al) for (const cx of al) {
      if ((cx === 6 && cy === 6) || (cx === 6 && cy === al[al.length - 1]) || (cx === al[al.length - 1] && cy === 6)) continue;
      if (Math.abs(x - cx) <= 2 && Math.abs(y - cy) <= 2) return true;
    }
    return false;
  };
  // patrones de búsqueda: 7×7 con centro 3×3 oscuro
  for (const [ox, oy] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
    for (let dy = 0; dy < 7; dy++) for (let dx = 0; dx < 7; dx++) {
      const ring = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
      assert.equal(m[oy + dy][ox + dx], ring !== 2, 'patrón de búsqueda');
    }
  }
  const maskFn = [(i, j) => (i + j) % 2 === 0, (i) => i % 2 === 0, (i, j) => j % 3 === 0, (i, j) => (i + j) % 3 === 0,
    (i, j) => (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0, (i, j) => (i * j) % 2 + (i * j) % 3 === 0,
    (i, j) => ((i * j) % 2 + (i * j) % 3) % 2 === 0, (i, j) => ((i + j) % 2 + (i * j) % 3) % 2 === 0][mask];
  const bits = [];
  let upward = true;
  for (let col = n - 1; col > 0; col -= 2) {
    if (col === 6) col = 5;
    for (let k = 0; k < n; k++) {
      const y = upward ? n - 1 - k : k;
      for (const x of [col, col - 1]) if (!isFn(x, y)) bits.push((m[y][x] ? 1 : 0) ^ (maskFn(y, x) ? 1 : 0));
    }
    upward = !upward;
  }
  const [total, nb, ec] = SPEC[v];
  const cw = [];
  for (let i = 0; i < total; i++) { let b = 0; for (let k = 0; k < 8; k++) b = (b << 1) | bits[i * 8 + k]; cw.push(b); }
  const dataTotal = total - nb * ec, shortLen = Math.floor(dataTotal / nb), nLong = dataTotal % nb;
  const lens = Array.from({ length: nb }, (_, i) => shortLen + (i >= nb - nLong ? 1 : 0));
  const blocks = lens.map(() => []), ecs = lens.map(() => []);
  let p = 0;
  for (let i = 0; i <= shortLen; i++) for (let b = 0; b < nb; b++) if (i < lens[b]) blocks[b].push(cw[p++]);
  for (let i = 0; i < ec; i++) for (let b = 0; b < nb; b++) ecs[b].push(cw[p++]);
  blocks.forEach((blk, b) => {
    const poly = blk.concat(ecs[b]);
    for (let i = 0; i < ec; i++) {
      let s = 0; const a = EXP[i];
      for (const c of poly) s = gmul(s, a) ^ c;
      assert.equal(s, 0, 'síndrome ' + i + ' del bloque ' + b);
    }
  });
  const data = [].concat(...blocks);
  const db = []; data.forEach(b => { for (let k = 7; k >= 0; k--) db.push((b >> k) & 1); });
  const read = (s, l) => db.slice(s, s + l).reduce((a, x) => a * 2 + x, 0);
  assert.equal(read(0, 4), 4, 'modo byte');
  const cl = v < 10 ? 8 : 16, len = read(4, cl);
  const out = []; for (let i = 0; i < len; i++) out.push(read(4 + cl + i * 8, 8));
  return { text: Buffer.from(out).toString('utf8'), version: v, mask };
}

test('decodificador independiente lee lo que genera el QR (todas las máscaras, versiones 1 a 10)', () => {
  const samples = ['A', 'ABCD-EFGH-JKMN', 'https://urrozgustavo-collab.github.io/detox-primavera/?sync=ABCDEFGHJKMN', 'ñandú 🌿 '.repeat(8), 'x'.repeat(120), 'y'.repeat(200)];
  const seen = new Set();
  for (const s of samples) {
    for (let mask = 0; mask < 8; mask++) {
      const q = Q.encode(s, mask);
      const r = decodeQR(q.modules.map(row => row.slice()));
      assert.equal(r.text, s);
      assert.equal(r.mask, mask);
      seen.add(q.version);
    }
  }
  assert.ok(seen.has(1) && seen.has(5) && seen.has(7) && seen.has(10), 'probó versiones chicas y con información de versión: ' + [...seen]);
});

test('elige la versión mínima y rechaza textos que no entran', () => {
  assert.equal(Q.encode('https://urrozgustavo-collab.github.io/detox-primavera/?sync=ABCDEFGHJKMN').version, 5); // 72 bytes: v4-M admite 62, v5-M 84
  assert.equal(Q.encode('z'.repeat(214)), null);
  assert.match(Q.svg('hola'), /^<svg viewBox="0 0 29 29"/);
});
