/* El descompresor propio debe dar exactamente lo mismo que zlib (todas las variantes de bloque). */
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const { window: W } = loadApp({ data: 'none' });
const inflate = buf => Buffer.from(W.DXInflate.raw(new Uint8Array(buf)));

test('texto corto, vacío y bloques sin comprimir / fijos / dinámicos', () => {
  for (const s of ['', 'a', 'hola hola hola hola', 'ñandú áéíóú 🌿'.repeat(50)]) {
    for (const level of [0, 1, 6, 9]) {
      const z = zlib.deflateRawSync(Buffer.from(s), { level });
      assert.equal(inflate(z).toString('utf8'), s);
    }
  }
  const fixed = zlib.deflateRawSync(Buffer.from('abc'), { strategy: zlib.constants.Z_FIXED });
  assert.equal(inflate(fixed).toString(), 'abc');
});

test('binario aleatorio y repeticiones largas (distancias > 32 KB de salida)', () => {
  const rnd = Buffer.alloc(200000); for (let i = 0; i < rnd.length; i++) rnd[i] = (i * 2654435761 >>> 13) & 255;
  assert.ok(inflate(zlib.deflateRawSync(rnd, { level: 9 })).equals(rnd));
  const rep = Buffer.from('x'.repeat(100000) + 'yz'.repeat(70000));
  assert.ok(inflate(zlib.deflateRawSync(rep)).equals(rep));
});

test('todos los archivos de datos reales', () => {
  const dir = path.join(__dirname, '..', 'src', 'data');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    const buf = fs.readFileSync(path.join(dir, f));
    assert.ok(inflate(zlib.deflateRawSync(buf, { level: 9 })).equals(buf), f);
  }
});

test('datos dañados dan error claro (no cuelgan)', () => {
  const z = zlib.deflateRawSync(Buffer.from('hola mundo '.repeat(100)));
  assert.throws(() => inflate(z.subarray(0, z.length - 5)), /incompletos|inválid|rango/);
});

test('el index.html armado contiene datos que se descomprimen en el DX completo', () => {
  const html = path.join(__dirname, '..', '..', 'index.html');
  const t = fs.readFileSync(html, 'utf8');
  const m = /DXInflate\.text\('([A-Za-z0-9+/=]+)'\)/.exec(t);
  if (!m) return; // armado sin comprimir
  const text = W.DXInflate.text(m[1]);
  const vm = require('vm');
  const sb = {}; sb.window = sb; vm.createContext(sb);
  vm.runInContext(text, sb);
  assert.ok(Array.isArray(sb.DX.recipes) && sb.DX.recipes.length > 50, 'recetas');
  assert.ok(sb.DX.taxonomy && sb.DX.programs, 'taxonomía y programas');
});
