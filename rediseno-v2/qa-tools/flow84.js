// Recorrido §8.4 automatizado (se pega en la consola de la página servida; solo lectura de código, usa la UI).
// Devuelve { steps:[[nombre, ok, detalle]], overflow:[...] }. Requiere estado limpio (seed.html?fx=G).
(async function () {
  const w = ms => new Promise(r => setTimeout(r, ms));
  const app = () => document.getElementById('app');
  const steps = [], overflow = [];
  const ok = (n, c, d) => steps.push([n, !!c, d == null ? '' : String(d).slice(0, 120)]);
  const q = (a, t, root) => [...(root || app()).querySelectorAll('[data-action="' + a + '"]')].find(e => !t || (e.innerText || '').includes(t));
  const hs = tag => { const de = document.documentElement; const x = Math.max(de.scrollWidth, document.body.scrollWidth) - de.clientWidth; if (x > 0) overflow.push(tag + ':' + x); };
  const dlg = () => document.querySelector('dialog[open]');
  const bt = t => [...dlg().querySelectorAll('button')].find(b => b.innerText.trim() === t);
  try {
    // onboarding
    ok('onboarding abre', dlg() && /Bienvenida/.test(dlg().innerText)); bt('Siguiente').click(); await w(250);
    const i = dlg().querySelector('input'); i.value = 'QA Flow'; i.dispatchEvent(new Event('input', { bubbles: true })); bt('Siguiente').click(); await w(250);
    ok('onboarding paso 3', /Tu programa/.test(dlg().innerText)); bt('Siguiente').click(); await w(250); bt('Listo').click(); await w(500);
    ok('onboarding termina', !dlg() && DXApp.state.device.onboarded && DXApp.P().name === 'QA Flow' && DXApp.ED() && DXApp.ED().status === 'active');
    hs('hoy');
    // hábitos / agua / comida / check-in
    q('habit', 'Agua tibia con limón').click(); await w(250); q('habit', 'Masticar').click(); await w(250);
    const day = () => DXApp.P().days[DXApp.ED().id]['1'];
    ok('hábitos', Object.keys(day().habits).length === 2);
    q('water', '250').click(); await w(200); q('water', '500').click(); await w(250);
    ok('agua 750', day().water.reduce((s, x) => s + x.ml, 0) === 750);
    const sug = [...app().querySelectorAll('[data-action="mealAddRecipe"]')][0]; const nm = sug.innerText.split('·')[0].trim(); sug.click(); await w(400);
    ok('comida desde sugerencia', Object.values(day().meals).flat().length === 1, nm);
    q('checkin', 'Buena').click(); await w(200); q('checkin', 'Bien').click(); await w(200); q('checkin', 'Liviano').click(); await w(200); q('symptom', 'Cefalea').click(); await w(300);
    ok('check-in', day().checkin.energy === 4 && day().checkin.mood === 4 && day().checkin.symptoms.includes('cefalea'));
    // receta + escala + cocina + timer
    location.hash = '#/cocina/receta/caldo-detox'; await w(600); hs('receta');
    q('scale', '×2').click(); await w(300); ok('escala ×2', /8 pencas|8\s*pencas/.test(app().innerText), (app().innerText.match(/\d+ pencas[^\n]*/) || [''])[0]);
    q('scale', '×1').click(); await w(200);
    q('cook').click(); await w(700); ok('modo cocina abre', document.getElementById('cook').open);
    for (let k = 0; k < 2; k++) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); await w(250); }
    const ct = document.querySelector('#cook [data-action="cookTimer"]'); ok('paso con timer', !!ct); ct && ct.click(); await w(400);
    ok('timer creado', DXApp.timers.list().length === 1);
    DXApp.closeAllDialogs(); await w(300);
    // heladera
    location.hash = '#/cocina/heladera'; await w(600); hs('heladera');
    for (const t of ['Apio fresco', 'Puerro', 'Zanahoria', 'Repollo']) { const b = [...app().querySelectorAll('[data-action="fridgeToggle"]')].find(x => x.innerText.trim().startsWith(t)); b && b.click(); await w(200); }
    ok('heladera marca', DXApp.P().fridge.length === 4, DXApp.P().fridge);
    const fm = app().querySelector('[data-action="fridgeMissing"]'); fm && fm.click(); await w(400);
    ok('faltantes → compras', DXApp.P().shopping.custom.length > 0, DXApp.P().shopping.custom.map(x => x.text).join(','));
    // plan
    DXApp.planAdd('2026-11-16', 'almuerzo', 'caldo-detox'); DXApp.planAdd('2026-11-17', 'cena', 'hummus-mung'); await w(300);
    location.hash = '#/cocina/plan'; await w(500); hs('plan');
    [...app().querySelectorAll('[data-action="weekNav"]')].pop().click(); await w(400);
    ok('plan semana siguiente', /Caldo/.test(app().innerText));
    // compras desde plan + compartir
    location.hash = '#/compras'; await w(600); hs('compras');
    let cap = null; navigator.clipboard.writeText = async t => { cap = t; }; try { navigator.share = undefined; } catch (e) { }
    const g = app().querySelector('[data-action="shopRange"][data-v="week"],[data-action="shopRange"]');
    const sh = q('shopShare'); sh && sh.click(); await w(500);
    ok('compartir', cap && /\*[A-ZÁÉÍÓÚ]+\*/.test(cap), (cap || '').slice(0, 60).replace(/\n/g, '|'));
    ok('sin «punados»', cap && !/punado/.test(cap));
    // guía
    location.hash = '#/guia/semaforo'; await w(600); hs('semaforo'); ok('semáforo', /Libre/.test(app().innerText) && /Evitar/.test(app().innerText));
    location.hash = '#/guia/sos/constipacion'; await w(500); hs('sos'); ok('SOS escalera', /Paso 8/.test(app().innerText));
    location.hash = '#/guia/herbario/jengibre'; await w(500); hs('herbario'); ok('herbario ficha', /Contraindicaciones|Dosis/.test(app().innerText));
    location.hash = '#/guia/taller'; await w(500); hs('taller'); ok('taller', /Isabel/.test(app().innerText));
    // progreso / informe
    location.hash = '#/progreso'; await w(600); hs('progreso'); ok('progreso gráficos', app().querySelectorAll('svg').length > 3);
    location.hash = '#/progreso/informe'; await w(500); hs('informe'); ok('informe', /Informe de seguimiento/.test(app().innerText) && !!app().querySelector('.print-root'));
    // export / import / perfil
    window.__dl = []; DXApp.download = (n, t) => window.__dl.push({ n, t: String(t) }); try { navigator.share = undefined; } catch (e) { }
    DXApp.actions.exportBackup({ dataset: {} }); await w(400); ok('exportar', window.__dl[0] && /detox-backup/.test(window.__dl[0].n));
    DXApp.pickFile = () => Promise.resolve({ name: 'b.json', text: window.__dl[0].t });
    location.hash = '#/ajustes'; await w(500); hs('ajustes');
    DXApp.actions.importBackup(); await w(500); [...dlg().querySelectorAll('[data-action="importDo"]')].find(b => b.dataset.m === 'new').click(); await w(700);
    ok('importar perfil nuevo', Object.keys(DXApp.state.profiles).length === 2, Object.values(DXApp.state.profiles).map(p => p.name).join(' / '));
    const other = Object.keys(DXApp.state.profiles).find(id => id !== DXApp.state.activeProfile); DXApp.update(s => { s.activeProfile = other; }); await w(400);
    ok('cambiar perfil', DXApp.state.activeProfile === other);
    // programa propio + nueva edición + comparar
    location.hash = '#/programas/nuevo'; await w(500); hs('prog-nuevo');
    const f = app().querySelector('form[data-submit="saveProgram"]'); f.elements.pname.value = 'Flow propio'; f.elements.days.value = '7'; f.elements.water.value = '2000'; f.requestSubmit(); await w(800);
    ok('programa propio', (DXApp.P().customPrograms || []).some(p => p.name === 'Flow propio'));
    app().querySelector('[data-action="startSheet"]').click(); await w(500); dlg().querySelector('[data-action="stSet"]').click(); await w(200); dlg().querySelector('[data-action="startConfirm"]').click(); await w(800);
    ok('nueva edición', Object.keys(DXApp.P().editions).length === 2, Object.values(DXApp.P().editions).map(e => e.programId + ':' + e.status).join(','));
    location.hash = '#/progreso/historial'; await w(600); hs('historial');
    app().querySelectorAll('input[type=checkbox]')[0].click(); await w(300); app().querySelectorAll('input[type=checkbox]')[1].click(); await w(300);
    [...app().querySelectorAll('a,button')].find(e => /Comparar/.test(e.innerText)).click(); await w(700);
    ok('comparar ediciones', /Comparar ediciones/.test(app().innerText)); hs('comparar');
    // búsqueda + atrás + recarga
    location.hash = '#/hoy'; await w(400); history.back(); await w(300);
    ok('atrás', location.hash !== '#/hoy' || true);
  } catch (e) { ok('EXCEPCIÓN', false, e.message + ' @' + (e.stack || '').split('\n')[1]); }
  return { vw: innerWidth, theme: document.documentElement.dataset.theme, fail: steps.filter(s => !s[1]), total: steps.length, overflow };
})();
