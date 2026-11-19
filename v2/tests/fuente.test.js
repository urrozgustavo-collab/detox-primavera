/* v2.4: la letra Geist va incrustada en el HTML armado, sin ninguna dependencia externa. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.join(__dirname, '..', '..');

test('Geist: el archivo verificado coincide con el SHA-256 de FUENTES.md', () => {
  const dir = path.join(__dirname, '..', 'src', 'fonts');
  const sha = crypto.createHash('sha256').update(fs.readFileSync(path.join(dir, 'Geist-Variable.woff2'))).digest('hex');
  assert.ok(fs.readFileSync(path.join(dir, 'FUENTES.md'), 'utf8').includes(sha), 'SHA-256 de la fuente');
  assert.ok(fs.existsSync(path.join(dir, 'Geist-OFL.txt')), 'licencia OFL');
});

test('Geist: el HTML armado trae el @font-face incrustado y ninguna URL de fuentes externas', () => {
  for (const name of ['index.html', 'Detox-Primavera-App.html']) {
    const f = path.join(ROOT, name);
    if (!fs.existsSync(f)) return;   // armado todavía no corrido
    const t = fs.readFileSync(f, 'utf8');
    assert.match(t, /@font-face \{ font-family: "Geist"; font-style: normal; font-weight: 100 900; font-display: swap; src: url\(data:font\/woff2;base64,[A-Za-z0-9+/=]{1000,}\) format\("woff2"\); \}/, name + ': @font-face de Geist');
    assert.doesNotMatch(t, /fonts\.googleapis|fonts\.gstatic/i, name + ': sin Google Fonts');
    assert.match(t, /--f-text:\s*"Geist"/, name + ': el texto usa Geist');
  }
});
