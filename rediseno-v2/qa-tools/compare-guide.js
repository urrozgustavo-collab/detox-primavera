// Uso: node compare-guide.js <id-receta> [<id> ...]   — imprime la receta de DX y el tramo de la guía donde aparece su título.
// Solo lectura. No modifica nada.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..', '..');
const sandbox = { window: {} }; sandbox.window = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const dir = path.join(ROOT, 'v2', 'src', 'data');
fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort().forEach(f => vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), sandbox, { filename: f }));
const DX = sandbox.DX;
const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ');
const dump = fs.readFileSync(path.join(ROOT, 'scratch', 'guia_dump.txt'), 'utf8').replace(/={20} P.GINA (\d+) ={20}/g, ' [[p.$1]] ').replace(/\s+/g, ' ');
const nd = norm(dump);
const ids = process.argv.slice(2);
if (ids[0] === '--list') { console.log(DX.recipes.map(r => r.id).join('\n')); process.exit(0); }
if (ids[0] === '--grep') { const q = norm(ids[1]); let i = -1, n = 0; while ((i = nd.indexOf(q, i + 1)) > -1 && n++ < 6) console.log('…' + dump.slice(Math.max(0, i - 200), i + 500) + '…\n'); process.exit(0); }
for (const id of ids) {
  const r = DX.recipes.find(x => x.id === id);
  if (!r) { console.log('NO EXISTE', id); continue; }
  console.log('=== ' + r.id + ' | ' + r.title + ' | ' + r.category + ' | ' + (r.source || '') + ' | time=' + JSON.stringify(r.time) + ' serv=' + r.servings + ' allerg=' + (r.allergens || []));
  console.log('ING: ' + r.ingredients.map(i => i.text).join(' ; '));
  console.log('STEPS: ' + r.steps.map((s, k) => (k + 1) + '. ' + s.text).join(' '));
  console.log('TIP: ' + r.tip + ' | note: ' + r.note);
  const key = norm(r.title).replace(/\(.*?\)/g, '').trim();
  let i = nd.indexOf(key); let tries = [key, key.split(' ').slice(0, 3).join(' ')];
  for (const k of tries) { i = nd.lastIndexOf(k); if (i > -1) break; }
  if (i > -1) console.log('GUIDE: ' + dump.slice(Math.max(0, i - 20), i + (+process.env.GL||700))); else console.log('GUIDE: (título no encontrado)');
  console.log();
}
