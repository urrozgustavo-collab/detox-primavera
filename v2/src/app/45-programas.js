/* Detox v2 — Programas: catálogo, ficha, empezar edición, editor de programa propio, exportar/importar. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic, K = A.kit, esc = U.esc, I = A.icon;
  var SEASONS = { primavera: 'Primavera', verano: 'Verano', otono: 'Otoño', invierno: 'Invierno' };
  function seasonNow() { var m = +A.today().slice(5, 7); return m >= 9 && m <= 11 ? 'primavera' : m === 12 || m <= 2 ? 'verano' : m <= 5 ? 'otono' : 'invierno'; }

  A.screens.programas = {
    render: function (route) {
      var a = route.parts[0];
      if (a === 'nuevo') return editor(null, route.parts[1]);
      if (a === 'editar') return editor(route.parts[1]);
      if (a) return detail(a);
      return list();
    }
  };

  function list() {
    var p = A.P(), ed = A.ED(), now = seasonNow();
    var progs = L.allPrograms(p);
    var cards = progs.map(function (x) {
      var active = ed && ed.programId === x.id && ed.status !== 'done' && ed.status !== 'archived';
      var own = String(x.id).indexOf('my-') === 0;
      return '<a class="rcard prog-card" href="#/programas/' + encodeURIComponent(x.id) + '"><span class="rc-cat">' + (own ? 'Programa propio' : x.season ? 'Para ' + esc((SEASONS[x.season] || x.season).toLowerCase()) : 'Programa') + '</span><h3>' + esc(x.name) + '</h3><span class="meta">' + esc(x.subtitle || '') + '</span>' +
        '<span class="rc-meta">' + I('calendario', 'sm') + U.plural(x.days, 'día') + ' · ' + U.plural(U.arr(x.habits).length, 'hábito') + '</span><span class="rc-tags">' + (active ? '<span class="tag bloom">' + I('planta', 'sm') + 'En curso</span>' : '') + (x.season === now ? '<span class="tag accent">De esta estación</span>' : '') + '</span></a>';
    }).join('');
    return K.crumb() + '<header class="page-h"><h1>Programas</h1><p>Cada vez que empezás uno se guarda como una edición nueva, con su historial.</p></header>' +
      '<div class="grid-cards">' + cards + '</div>' +
      '<div class="btn-row mt"><a class="btn" href="#/programas/nuevo">' + I('mas', 'sm') + 'Crear programa propio</a><button class="btn ghost" data-action="importProgram">' + I('subir', 'sm') + 'Importar programa</button></div>';
  }

  function detail(id) {
    var p = A.P(), x = L.program(id, p);
    if (!x) return K.back('#/programas', 'Programas') + K.empty('No encontramos ese programa', '', '<a class="btn" href="#/programas">Ver programas</a>', 'h1');
    var own = String(x.id).indexOf('my-') === 0;
    var ed = A.ED();
    var active = ed && ed.programId === x.id && (ed.status === 'active' || ed.status === 'planned');
    var past = Object.keys(p.editions).map(function (k) { return p.editions[k]; }).filter(function (e) { return e.programId === x.id; });
    return K.back('#/programas', 'Programas') +
      '<section class="recipe-hero"><header class="recipe-h"><p class="rc-cat">' + (own ? 'Programa propio' : esc(SEASONS[x.season] || 'Programa')) + '</p><h1 class="serif">' + esc(x.name) + '</h1><p>' + esc(x.description || x.subtitle || '') + '</p></header>' +
      '<div class="recipe-meta"><span>' + I('calendario', 'sm') + U.plural(x.days, 'día') + (x.prepDay ? ' + preparación' : '') + '</span><span>' + I('agua', 'sm') + 'Agua: ' + (x.waterGoalMl || 2000) + ' ml</span>' + (past.length ? '<span>' + I('refrescar', 'sm') + 'Lo hiciste ' + U.plural(past.length, 'vez', 'veces') + '</span>' : '') + '</div>' +
      '<div class="btn-row mt">' + (active ? '<a class="btn primary" href="#/hoy">' + I('hoy', 'sm') + 'Ir a Hoy (en curso)</a>' : '<button class="btn primary" data-action="startSheet" data-p="' + esc(x.id) + '">' + I('planta', 'sm') + 'Empezar</button>') +
      '<a class="btn" href="#/programas/nuevo/' + encodeURIComponent(x.id) + '">' + I('copiar', 'sm') + 'Duplicar y modificar</a><button class="btn" data-action="exportProgram" data-p="' + esc(x.id) + '">' + I('descargar', 'sm') + 'Exportar</button>' +
      (own ? '<a class="btn" href="#/programas/editar/' + encodeURIComponent(x.id) + '">' + I('editar', 'sm') + 'Editar</a><button class="btn danger" data-action="delProgram" data-p="' + esc(x.id) + '">' + I('borrar', 'sm') + 'Borrar</button>' : '') + '</div></section>' +
      '<h2 class="section-title">Fases</h2><div class="stack">' + U.arr(x.phases).map(function (ph) { return '<section class="card"><h3>' + esc(ph.name) + '</h3>' + (ph.desc ? '<p class="mt-s">' + esc(ph.desc) + '</p>' : '') + (U.arr(ph.tips).length ? '<ul class="list">' + ph.tips.map(function (t) { return '<li class="li">' + I('hoja', 'sm') + '<span class="grow">' + esc(t.text || t) + '</span></li>'; }).join('') + '</ul>' : '') + '</section>'; }).join('') + '</div>' +
      '<h2 class="section-title">Hábitos diarios</h2><section class="card"><ul class="list">' + U.arr(x.habits).map(function (h) { return '<li class="li"><span class="grow"><b>' + esc(h.text) + '</b>' + (h.tip ? '<span class="meta">' + esc(h.tip) + '</span>' : '') + '</span></li>'; }).join('') + (U.arr(x.habits).length ? '' : '<li class="li muted">Sin hábitos.</li>') + '</ul></section>' +
      (U.arr(x.prepHabits).length ? '<h2 class="section-title">Preparación</h2><section class="card"><ul class="list">' + x.prepHabits.map(function (h) { return '<li class="li">' + I('amanecer', 'sm') + '<span class="grow">' + esc(h.text) + '</span></li>'; }).join('') + '</ul></section>' : '') +
      (x.source ? '<p class="meta mt">' + esc(x.source) + '</p>' : '');
  }

  A.actions.startSheet = function (el) {
    var x = L.program(el.dataset.p, A.P()), today = A.today();
    A.ui.st = { p: x.id, date: today, mode: x.defaultStartMode || (U.arr(x.startModes)[0] || {}).id };
    A.openSheet({ title: 'Empezar ' + x.name, body: startBody(), foot: '<button class="btn primary wide" data-action="startConfirm">Empezar</button><button class="link" data-action="closeDialog" data-dlg="sheet">Después</button>' });
  };
  function startBody() {
    var st = A.ui.st, x = L.program(st.p, A.P()), today = A.today();
    var opts = U.startChoices(today);
    var ed = A.ED();
    var running = ed && (ed.status === 'active' || ed.status === 'planned');
    // v2.4: fecha como palabras (puntito coral) y forma de empezar como renglones con punto verde.
    var dateOpts = opts.map(function (o) { return [o[1], U.cap(o[0].replace('Próximo ', '')), U.fmtDate(o[1], 'short')]; });
    if (!opts.some(function (o) { return o[1] === st.date; })) dateOpts.push([st.date, 'Otra', U.fmtDate(st.date, 'short')]);
    return '<p class="muted c">' + U.plural(x.days, 'día') + (x.source ? ' · ' + esc(String(x.source).split('.')[0]) : '') + '</p>' +
      '<div class="g"><p class="lab c">Fecha de inicio</p>' + K.opts(dateOpts, st.date, 'stSet', 'Fecha de inicio', 'data-k="date"') +
      '<label class="field other-date"><span>Otra fecha</span><input type="date" class="input" data-change="stDate" value="' + st.date + '" aria-label="Otra fecha"></label></div>' +
      (U.arr(x.startModes).length > 1 ? '<div class="g"><p class="lab">Cómo empezar</p><div class="choices">' + x.startModes.map(function (m) { return K.choice(st.mode === m.id, 'stSet', 'data-k="mode" data-v="' + esc(m.id) + '"', m.label, m.id === x.defaultStartMode && !/recomend/i.test(m.label) ? 'Recomendado por la guía' : ''); }).join('') + '</div></div>' : '') +
      (running ? '<div class="banner mt">' + I('info') + '<div class="grow">Tenés en curso <b>' + esc((A.PROG() || {}).name || '') + '</b>. Al empezar, esa edición se archiva con todos sus datos (la ves en Progreso › Historial).</div></div>' : '');
  }
  A.actions.stSet = function (el) { A.ui.st[el.dataset.k] = el.dataset.v; document.querySelector('#sheet .sheet-b').innerHTML = startBody(); };
  A.changes.stDate = function (el) { if (U.isValidISO(el.value)) { A.ui.st.date = el.value; document.querySelector('#sheet .sheet-b').innerHTML = startBody(); } };
  A.changes.stMode = function (el) { A.ui.st.mode = el.value; };
  A.actions.startConfirm = function () {
    var st = A.ui.st;
    A.startEdition(st.p, st.date, st.mode);
    A.closeDialog();
    A.toast('Empezaste ' + L.program(st.p, A.P()).name);
    A.go('/hoy');
  };
  A.actions.exportProgram = function (el) {
    var x = L.program(el.dataset.p, A.P());
    A.download('programa-' + U.norm(x.name).replace(/[^a-z0-9]+/g, '-') + '.json', JSON.stringify({ type: 'detox-program', version: 1, program: x }, null, 2), 'application/json');
  };
  A.actions.importProgram = function () {
    A.pickFile('.json,application/json').then(function (f) {
      if (!f) return;
      var obj; try { obj = JSON.parse(f.text); } catch (e) { return A.toast('El archivo no es un JSON válido'); }
      var x = obj && obj.program ? obj.program : obj;
      if (!x || !x.name || !Array.isArray(x.habits) || !(Number(x.days) > 0)) return A.toast('El archivo no parece un programa (falta nombre, días o hábitos)');
      x = U.clone(x);
      if (!String(x.id || '').startsWith('my-') || L.program(x.id, A.P())) x.id = 'my-' + U.norm(x.name).replace(/[^a-z0-9]+/g, '-').slice(0, 24) + '-' + Date.now().toString(36).slice(-4);
      x.days = Math.max(1, Math.min(90, Math.round(Number(x.days))));
      if (!Array.isArray(x.phases) || !x.phases.length) x.phases = [{ id: 'general', name: 'Programa', desc: '', tips: [] }];
      if (!Array.isArray(x.startModes) || !x.startModes.length) x.startModes = [{ id: 'directo', label: 'Empezar directo', monoDays: 0 }];
      x.updatedAt = Date.now();
      A.update(function (s, p) { p.customPrograms.push(x); });
      A.toast('Importaste «' + x.name + '»');
      A.go('/programas/' + x.id);
    });
  };
  A.actions.delProgram = function (el) {
    var id = el.dataset.p;
    A.confirm({ title: 'Borrar programa', text: 'Se borra el programa propio. Las ediciones que hiciste con él se conservan en el historial.', ok: 'Borrar', danger: true }).then(function (ok) {
      if (!ok) return;
      A.update(function (s, p) { p.customPrograms.forEach(function (x) { if (x.id === id) { x.deleted = true; x.updatedAt = Date.now(); } }); });
      A.go('/programas');
    });
  };

  /* ---------- editor de programa propio ---------- */
  function editor(editId, fromId) {
    var p = A.P();
    var base = editId ? L.program(editId, p) : fromId ? L.program(fromId, p) : null;
    var tpl = L.programTemplate() || {};
    var x = base || { name: '', subtitle: '', days: 7, prepDay: false, phases: [{ id: 'general' }], habits: [], waterGoalMl: 2000, theme: 'primavera' };
    var lib = U.arr(tpl.habitLibrary).length ? tpl.habitLibrary : U.arr((L.idx().programs['detox-primavera-21'] || {}).habits);
    var have = U.arr(x.habits).map(function (h) { return h.id; });
    var libIds = lib.map(function (h) { return h.id; });
    var extra = U.arr(x.habits).filter(function (h) { return libIds.indexOf(h.id) < 0; }).map(function (h) { return h.text; }).join('\n');
    var mono = U.arr(x.phases).some(function (ph) { return ph.id === 'monodieta'; });
    var maxMono = Math.max.apply(null, U.arr(x.startModes).map(function (m) { return m.monoDays || 0; }).concat([0]));
    return K.back(editId ? '#/programas/' + encodeURIComponent(editId) : '#/programas', 'Volver') + '<h1 class="page-h">' + (editId ? 'Editar programa' : 'Programa propio') + '</h1>' +
      '<form class="card" data-submit="saveProgram" data-edit="' + esc(editId || '') + '">' +
      '<label class="field"><span>Nombre</span><input class="input" name="pname" required maxlength="60" value="' + esc(base && !editId ? x.name + ' (mi versión)' : x.name) + '"></label>' +
      '<label class="field"><span>Descripción breve</span><input class="input" name="sub" maxlength="90" value="' + esc(x.subtitle || '') + '"></label>' +
      '<div class="grid2"><label class="field"><span>Duración (días)</span><input class="input" name="days" type="number" min="3" max="60" required inputmode="numeric" value="' + (x.days || 7) + '"></label>' +
      '<label class="field"><span>Meta de agua (ml)</span><input class="input" name="water" type="number" min="500" max="6000" step="50" inputmode="numeric" value="' + (x.waterGoalMl || 2000) + '"></label></div>' +
      '<label class="switch"><span>Día de preparación antes de empezar</span><input type="checkbox" name="prep"' + (x.prepDay ? ' checked' : '') + '></label>' +
      '<label class="switch"><span>Incluir monodieta al inicio (manzana y arroz, según la guía)</span><input type="checkbox" name="mono"' + (mono ? ' checked' : '') + '></label>' +
      '<label class="field"><span>Días de monodieta como máximo</span><select class="input" name="monoMax">' + [1, 2, 3].map(function (n) { return '<option' + ((maxMono || 3) === n ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label>' +
      '<label class="field"><span>Color</span><select class="input" name="theme">' + Object.keys(SEASONS).map(function (k) { return '<option value="' + k + '"' + (x.theme === k ? ' selected' : '') + '>' + SEASONS[k] + '</option>'; }).join('') + '</select></label>' +
      '<fieldset class="field"><legend class="label">Hábitos de la guía</legend>' + lib.map(function (h) { return '<label class="check"><input type="checkbox" name="hab" value="' + esc(h.id) + '"' + (have.indexOf(h.id) > -1 || (!base && !editId) ? ' checked' : '') + '><span>' + esc(h.text) + '</span></label>'; }).join('') + '</fieldset>' +
      '<label class="field"><span>Hábitos propios (uno por línea)</span><textarea class="input" name="own" rows="3" placeholder="Ej.: Caminar 30 minutos">' + esc(extra) + '</textarea></label>' +
      '<button class="btn primary wide mt">Guardar programa</button></form>';
  }
  A.actions.saveProgram = function (f) {
    var el = f.elements;
    var name = el.pname.value.trim(); if (!name) return A.toast('Poné un nombre');
    var days = Math.max(3, Math.min(60, Math.round(+el.days.value || 7)));
    var tpl = L.programTemplate() || {};
    var lib = U.arr(tpl.habitLibrary).length ? tpl.habitLibrary : U.arr((L.idx().programs['detox-primavera-21'] || {}).habits);
    var picked = Array.prototype.slice.call(f.querySelectorAll('input[name="hab"]:checked')).map(function (x) { return x.value; });
    var mono = el.mono.checked, monoMax = +el.monoMax.value || 3;
    // Cada hábito conserva sus fases (p. ej. «plato verde» solo en la general); sin monodieta, se quita esa fase.
    var habits = lib.filter(function (h) { return picked.indexOf(h.id) > -1; }).map(function (h) {
      var c = U.clone(h), ph = U.arr(h.phases).filter(function (x) { return x === 'general' || (mono && x === 'monodieta'); });
      c.phases = ph.length ? ph : ['general']; return c;
    });
    el.own.value.split('\n').map(function (t) { return t.trim(); }).filter(Boolean).forEach(function (t, i) { habits.push({ id: 'own_' + U.hash(t).toString(36), text: t, tip: '', icon: 'hoja', phases: mono ? ['monodieta', 'general'] : ['general'] }); });
    if (!habits.length) return A.toast('Elegí al menos un hábito');
    var detox = L.idx().programs['detox-primavera-21'] || {};
    var phases = [];
    if (el.prep.checked) phases.push(U.clone(U.arr(detox.phases).filter(function (x) { return x.id === 'previa'; })[0] || { id: 'previa', name: 'Preparación', desc: '', tips: [] }));
    if (mono) phases.push(U.clone(U.arr(detox.phases).filter(function (x) { return x.id === 'monodieta'; })[0] || { id: 'monodieta', name: 'Monodieta', desc: '', tips: [] }));
    phases.push({ id: 'general', name: mono ? 'Menú depurativo' : 'Programa', desc: el.sub.value.trim(), tips: [] });
    var modes = [];
    if (mono) for (var n = monoMax; n >= 1; n--) modes.push({ id: 'monodieta' + n, label: U.plural(n, 'día') + ' de monodieta', monoDays: n });
    modes.push({ id: 'directo', label: 'Empezar directo', monoDays: 0 });
    var editId = f.dataset.edit;
    var id = editId || 'my-' + U.norm(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) + '-' + Date.now().toString(36).slice(-4);
    var prog = { id: id, name: name, subtitle: el.sub.value.trim() || U.plural(days, 'día'), description: el.sub.value.trim(), season: null, days: days, prepDay: el.prep.checked, theme: el.theme.value,
      startModes: modes, defaultStartMode: modes[0].id, phases: phases, habits: habits, prepHabits: el.prep.checked ? U.clone(U.arr(detox.prepHabits)) : [], waterGoalMl: Math.round(+el.water.value || 2000),
      dayNotes: [], badges: U.clone(U.arr(detox.badges).filter(function (b) { return ['inicio', 'adios_cafeina', 'hidratacion', 'bitacora'].indexOf(b.id) > -1 || (mono && b.id === 'monodieta'); })), source: 'programa propio', updatedAt: Date.now() };
    A.update(function (s, p) { var i = p.customPrograms.findIndex(function (x) { return x.id === id; }); if (i > -1) p.customPrograms[i] = prog; else p.customPrograms.push(prog); });
    A.toast('Programa guardado');
    A.go('/programas/' + id);
  };
})(typeof window !== 'undefined' ? window : globalThis);
