#!/usr/bin/env node
/* Corre todos los tests de v2: `node v2/tests/run.js` (sin dependencias).
   Cada *.test.js puede usar los globales `test(nombre, fn)`, `assert` (node:assert/strict)
   y `loadApp({ data: 'fixture' | 'real' })`, que devuelve { DX, DXApp, L, U, window } en un contexto aislado.
   Un test asíncrono devuelve una promesa. Filtrar: `node v2/tests/run.js migracion`. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');

const V2 = path.resolve(__dirname, '..');
const filter = process.argv[2] || '';
const tests = [];
let current = '';

function listJs(dir) { return fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort().map(f => path.join(dir, f)) : []; }

/* Carga datos + lógica de la app (archivos 0x–2x, sin DOM) en un contexto nuevo. */
function loadApp(opts) {
  opts = opts || {};
  const sandbox = { console, TextEncoder, TextDecoder, crypto: globalThis.crypto, atob, btoa, setTimeout, clearTimeout, Date, Math, JSON, Promise, Uint8Array, URL };
  sandbox.window = sandbox; sandbox.globalThis = sandbox; sandbox.isSecureContext = true;
  vm.createContext(sandbox);
  const files = [];
  if (opts.data === 'real') files.push(...listJs(path.join(V2, 'src', 'data')));
  else if (opts.data !== 'none') files.push(path.join(V2, 'tests', 'fixtures', 'data-min.js'));
  files.push(...listJs(path.join(V2, 'src', 'app')).filter(f => /^[0-2]\d-/.test(path.basename(f))));
  for (const f of files) vm.runInContext(fs.readFileSync(f, 'utf8'), sandbox, { filename: f });
  return { window: sandbox, DX: sandbox.DX, DXApp: sandbox.DXApp, L: sandbox.DXApp.logic, U: sandbox.DXApp.util };
}

/* Los objetos creados en el contexto vm tienen otro prototipo: deepEqual compara su forma JSON. */
const plain = v => v === undefined ? v : JSON.parse(JSON.stringify(v));
const wrapped = Object.assign(function (v, m) { return assert(v, m); }, assert, {
  deepEqual: (a, b, m) => assert.deepStrictEqual(plain(a), plain(b), m),
  deepStrictEqual: (a, b, m) => assert.deepStrictEqual(plain(a), plain(b), m),
  notDeepEqual: (a, b, m) => assert.notDeepStrictEqual(plain(a), plain(b), m)
});
global.assert = wrapped;
global.loadApp = loadApp;
global.fixture = name => fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8');
global.test = (name, fn) => tests.push({ file: current, name, fn });

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js')).sort();
for (const f of files) {
  current = f;
  try { require(path.join(__dirname, f)); }
  catch (e) { tests.push({ file: f, name: '(carga del archivo)', fn: () => { throw e; } }); }
}

(async () => {
  let ok = 0, fail = 0, last = '';
  for (const t of tests) {
    if (filter && !(t.file + ' ' + t.name).toLowerCase().includes(filter.toLowerCase())) continue;
    if (t.file !== last) { console.log('\n' + t.file); last = t.file; }
    try { await t.fn(); ok++; console.log('  ✓ ' + t.name); }
    catch (e) { fail++; console.log('  ✗ ' + t.name + '\n      ' + String(e && e.stack || e).split('\n').slice(0, 4).join('\n      ')); }
  }
  console.log('\n' + ok + ' ok, ' + fail + ' con error');
  process.exitCode = fail ? 1 : 0;
})();
