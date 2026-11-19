/* Detox v2 — Progreso: resumen, mapa, gráficos, correlaciones, logros, diario, historial, comparación, informe, reintroducción. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic, K = A.kit, esc = U.esc, I = A.icon;
  var TABS = [['#/progreso', 'resumen', 'Resumen'], ['#/progreso/diario', 'diario', 'Diario'], ['#/progreso/historial', 'historial', 'Historial'], ['#/progreso/reintro', 'reintro', 'Reintroducción']];

  A.screens.progreso = {
    render: function (route) {
      var sub = route.parts[0] || 'resumen';
      if (sub === 'informe') return report(route.parts[1]);
      if (sub === 'edicion') return K.crumb() + '<header class="page-h"><h1>Progreso</h1></header>' + K.tabs(TABS, 'historial') + K.back('#/progreso/historial', 'Historial') + resumen(route.parts[1], true);
      if (sub === 'comparar') return K.crumb() + '<header class="page-h"><h1>Progreso</h1></header>' + K.tabs(TABS, 'historial') + K.back('#/progreso/historial', 'Historial') + compare();
      var body = ({ resumen: function () { return resumen(); }, diario: diario, historial: historial, reintro: reintro })[sub] || resumen;
      return K.crumb() + '<header class="page-h"><h1>Progreso</h1></header>' + K.tabs(TABS, sub, 'Secciones de progreso') + body();
    }
  };

  A.backupChip = function (always) {
    var p = A.P(), last = A.state.device.lastBackupAt;
    var st = L.backupStatus(p, last, Date.now());
    if (!st.hasData) return '';
    if (!st.due) return always || last ? '<p class="meta">' + I('check', 'sm') + ' ' + (last ? 'Última copia de seguridad: ' + esc(U.ago(last)) + '.' : 'Todavía no hiciste una copia; te lo recordamos a las dos semanas.') + '</p>' : '';
    return '<div class="banner"><span>' + I('descargar') + '</span><div class="grow"><b>' + (st.never ? 'Llevás ' + U.plural(st.days, 'día') + ' de registros sin copia de seguridad.' : 'Última copia hace ' + U.plural(st.days, 'día') + '.') + '</b>Tus datos viven en este navegador. Una copia te protege si se borra o cambiás de celular.</div><button class="btn sm" data-action="exportBackup">Exportar</button></div>';
  };

  /* ---------- resumen de una edición ---------- */
  function resumen(edId, past) {
    var p = A.P();
    edId = edId || p.activeEdition;
    if (!edId || !p.editions[edId]) return K.empty('Todavía no hay progreso', 'Empezá un programa y acá vas a ver tu constancia, tus gráficos y tus logros.', '<a class="btn primary" href="#/hoy">Ir a Hoy</a>');
    var s = A.sum(edId), ed = s.edition, prog = s.program || {};
    if (s.clock.status === 'nodate') return K.empty('Tu edición no tiene fecha', 'Elegí la fecha de inicio en Hoy.', '<a class="btn primary" href="#/hoy">Ir a Hoy</a>');
    var h = [];
    if (past) h.push('<h2 class="serif">' + esc(prog.name || '') + ' · ' + esc(U.fmtDate(ed.startDate, 'short')) + '</h2><p class="meta mb">' + esc(statusLabel(ed.status)) + '</p>');
    if (!past) h.push(A.backupChip());
    h.push('<div class="stats"><div class="stat"><b>' + (s.constancy == null ? '—' : Math.round(s.constancy * 100) + ' %') + '</b><span>constancia</span></div><div class="stat"><b>' + s.streak + '</b><span>racha · mejor ' + s.bestStreak + '</span></div><div class="stat"><b>' + s.completeDays + '<small class="meta"> / ' + s.clock.days + '</small></b><span>días completos</span></div><div class="stat"><b>' + s.points + '</b><span>puntos</span></div></div>');
    h.push('<p class="meta mt-s">La constancia es el % de días con 80 % de los hábitos o más. La racha usa hasta ' + L.GRACE_DAYS + ' días de gracia por edición' + (s.graceUsed ? ' (usaste ' + s.graceUsed + ')' : '') + '.</p>');
    h.push('<div class="grid2 mt"><section class="card"><div class="card-h"><h2>Mapa de la edición</h2></div>' + K.heatmap(s, true) + '</section>');
    var en = L.series(s, 'energy'), mo = L.series(s, 'mood');
    var hasCk = en.some(function (x) { return x.v; }) || mo.some(function (x) { return x.v; });
    h.push('<section class="card"><div class="card-h"><h2>Energía y ánimo</h2></div>' + (hasCk ? K.lineChart([{ pts: en, cls: 'l1', avg: L.avg(en.map(function (x) { return x.v; })) }, { pts: mo, cls: 'l2' }], { label: 'Energía y ánimo por día', n: s.clock.days }) +
      '<div class="legend"><span><i style="background:var(--accent)"></i>Energía</span><span><i style="background:var(--bloom)"></i>Ánimo</span><span><i style="background:var(--muted)"></i>Promedio de energía</span></div>' : '<p class="muted">Aparece cuando hagas check-ins.</p>') + '</section></div>');
    var dg = L.series(s, 'digestion'), wa = L.series(s, 'water');
    h.push('<div class="grid2 mt"><section class="card"><div class="card-h"><h2>Digestión</h2></div>' + (dg.some(function (x) { return x.v; }) ? K.lineChart([{ pts: dg, cls: 'l3' }], { min: 1, max: 4, label: 'Digestión por día', n: s.clock.days, yLabel: function (v) { return ['', 'lenta', 'gases', 'liviana', 'óptima'][v]; } }) : '<p class="muted">Sin registros de digestión todavía.</p>') + '</section>' +
      '<section class="card"><div class="card-h"><h2>Agua</h2><span class="meta">meta ' + s.waterGoal + ' ml</span></div>' + (wa.some(function (x) { return x.v; }) ? K.barChart(wa, { goal: s.waterGoal, label: 'Agua por día', fmt: function (v) { return (v / 1000).toFixed(1) + ' l'; } }) : '<p class="muted">Sin registros de agua todavía.</p>') + '</section></div>');
    var sy = L.symptomFreq(s);
    var tx = L.idx();
    var w1 = [L.weekAvg(en, 1, 7), L.weekAvg(mo, 1, 7)], w3 = [L.weekAvg(en, 15, 21), L.weekAvg(mo, 15, 21)];
    var f = function (v) { return v == null ? '—' : v.toFixed(1).replace('.', ','); };
    h.push('<div class="grid2 mt"><section class="card"><div class="card-h"><h2>Síntomas</h2></div>' + (sy.length ? K.hbars(sy.slice(0, 8).map(function (x) { return { label: x.id.charAt(0) === '~' ? x.id.slice(1) : (tx.symptoms[x.id] || {}).label || x.id, n: x.n }; })) : '<p class="muted">Sin síntomas registrados.</p>') + '</section>' +
      '<section class="card"><div class="card-h"><h2>Semana 1 vs semana 3</h2></div>' + (s.clock.days >= 15 ? '<table class="cmp-table"><thead><tr><th></th><th>Semana 1</th><th>Semana 3</th></tr></thead><tbody><tr><td>Energía media</td><td class="n">' + f(w1[0]) + '</td><td class="n">' + f(w3[0]) + '</td></tr><tr><td>Ánimo medio</td><td class="n">' + f(w1[1]) + '</td><td class="n">' + f(w3[1]) + '</td></tr></tbody></table><p class="meta mt-s">Escala de 1 a 5. Promedios de los días con check-in.</p>' : '<p class="muted">Este programa dura menos de 3 semanas.</p>') + '</section></div>');
    var cor = L.correlations(s);
    h.push('<section class="card mt"><div class="card-h"><h2>Lo que vas notando</h2></div>' + (!cor.enough ? '<p class="muted">Con al menos 6 días de check-in te mostramos qué hábitos coinciden con más energía o mejor ánimo (llevás ' + cor.n + ').</p>' :
      cor.findings.length ? cor.findings.map(function (x) {
        var m = x.metric === 'energy' ? 'energía' : 'ánimo';
        return '<div class="finding"><b>' + esc(x.label) + '</b><p>Los días que lo cumpliste tu ' + m + ' promedió ' + f(x.withAvg) + ' y los demás ' + f(x.withoutAvg) + ' (' + x.nWith + ' y ' + x.nWithout + ' días).</p></div>';
      }).join('') + '<p class="meta mt-s">' + I('info', 'sm') + ' Son coincidencias en pocos días: no implica causa.</p>' : '<p class="muted">Por ahora no hay diferencias claras. Seguí registrando.</p>') + '</section>');
    var total = L.allRecipes(p).length;
    var tried = s.recipesTried;
    h.push('<section class="card mt"><div class="card-h"><h2>Cobertura culinaria</h2><span class="meta">' + tried.all + ' de ' + total + '</span></div><div class="bar-h"><i style="width:' + Math.round(tried.all / Math.max(1, total) * 100) + '%"></i></div>' +
      (tried.ids.length ? '<div class="chips mt">' + tried.ids.slice(0, 30).map(function (id) { var r = L.recipe(id, p); return r ? '<a class="chip soft" href="#/cocina/receta/' + encodeURIComponent(id) + '">' + esc(r.title) + '</a>' : ''; }).join('') + '</div>' : '<p class="muted mt-s">Registrá comidas con recetas para ver cuántas probaste.</p>') + '</section>');
    h.push('<h2 class="section-title" id="logros" tabindex="-1">Logros</h2><div class="badges">' + s.badges.map(function (b) {
      return '<div class="bdg' + (b.unlocked ? ' on' : '') + '"><span class="ic">' + I(b.unlocked ? 'flor' : 'candado') + '</span><div><b>' + esc(b.title) + '</b><span class="meta">' + esc(b.desc) + '</span><span class="meta"> · ' + (b.unlocked ? '+' + b.points + ' puntos' : (b.progress && b.progress.n > 1 ? b.progress.cur + ' de ' + b.progress.n : 'por lograr')) + '</span></div></div>';
    }).join('') + '</div>');
    h.push('<div class="btn-row mt"><a class="btn primary" href="#/progreso/informe/' + encodeURIComponent(edId) + '">' + I('libro', 'sm') + 'Ver informe</a><a class="btn" href="#/progreso/diario">' + I('lista', 'sm') + 'Diario</a>' + (past && p.activeEdition !== edId ? '<button class="btn" data-action="makeActive" data-e="' + esc(edId) + '">Hacerla activa</button>' : '') + '</div>');
    return h.join('');
  }
  function statusLabel(st) { return ({ planned: 'Planificada', active: 'En curso', done: 'Terminada', archived: 'Archivada' })[st] || st; }
  A.actions.makeActive = function (el) { A.update(function (s, p) { p.activeEdition = el.dataset.e; }, { meta: true }); A.toast('Edición activa cambiada'); A.go('/hoy'); };

  /* ---------- diario ---------- */
  function dayBlock(s, r, p) {
    var tx = L.tx(), c = r.day && r.day.checkin, bits = [];
    if (c && c.energy) bits.push('Energía ' + c.energy + '/5');
    if (c && c.mood) bits.push('Ánimo ' + c.mood + '/5');
    if (c && c.digestion) bits.push('Digestión: ' + ((U.arr(tx.digestionStates).filter(function (x) { return x.id === c.digestion; })[0] || {}).label || c.digestion));
    var sy = c ? U.arr(c.symptoms).map(function (x) { return (L.idx().symptoms[x] || {}).label || x; }).concat(U.arr(c.customSymptoms)) : [];
    var meals = L.slots().map(function (sl) { var it = L.mealItems(r.day, sl.id); return it.length ? '<b>' + esc(sl.label) + ':</b> ' + it.map(function (m) { return esc(m.name) + (m.done ? '' : ' (pendiente)'); }).join(', ') : ''; }).filter(Boolean);
    return '<article class="journal-day" id="d-' + r.idx + '"><div class="row between"><h3>' + (r.idx === 0 ? 'Preparación' : 'Día ' + r.idx) + ' <span class="meta">' + esc(r.iso ? U.fmtDate(r.iso) : '') + '</span></h3><span class="tag ' + (r.complete ? 'accent' : '') + '">' + r.done + '/' + r.total + ' hábitos</span></div>' +
      (bits.length ? '<p>' + bits.join(' · ') + (r.water ? ' · Agua ' + r.water + ' ml' : '') + '</p>' : (r.water ? '<p>Agua ' + r.water + ' ml</p>' : '')) +
      (sy.length ? '<p class="meta">Síntomas: ' + esc(sy.join(', ')) + '</p>' : '') + (c && c.notes ? '<p class="note">' + esc(c.notes) + '</p>' : '') +
      (meals.length ? '<p class="meta mt-s">' + meals.join(' · ') + '</p>' : '') +
      (!r.future && r.iso ? '<a class="btn ghost sm" href="#/hoy/' + r.iso + '">' + I('editar', 'sm') + 'Editar</a>' : '') + '</article>';
  }
  function diario() {
    var p = A.P(), ed = A.ED();
    if (!ed || !U.isValidISO(ed.startDate)) return K.empty('El diario está vacío', 'Empezá un programa en Hoy.', '<a class="btn primary" href="#/hoy">Ir a Hoy</a>');
    var s = A.sum(), v = A.ui.jv || 'dia';
    var rows = s.days.filter(function (r) { return !r.future || L.dayHasData(r.day); });
    var h = ['<section class="toolbar-card"><div class="seg" role="group" aria-label="Vista del diario">' + [['dia', 'Día'], ['semana', 'Semana'], ['todo', 'Todo']].map(function (x) { return '<button data-action="jv" data-v="' + x[0] + '" aria-pressed="' + (v === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div>'];
    if (v === 'dia') {
      var sel = A.ui.jday != null ? A.ui.jday : (s.clock.status === 'active' ? s.clock.idx : rows.length ? rows[rows.length - 1].idx : 0);
      var r = s.days[sel] || s.days[0];
      h.push('<div class="chips scroll mt-s">' + rows.map(function (x) { return '<button class="chip' + (x.idx === r.idx ? ' on' : '') + '" data-action="jday" data-i="' + x.idx + '" aria-pressed="' + (x.idx === r.idx) + '">' + (x.idx === 0 ? 'Prep.' : 'Día ' + x.idx) + '</button>'; }).join('') + '</div></section>');
      h.push('<section class="card mt">' + dayBlock(s, r, p) + '</section>');
    } else if (v === 'semana') {
      var wk = A.ui.jweek || Math.max(1, Math.ceil((s.clock.status === 'active' ? s.clock.idx : 1) / 7));
      var weeks = Math.ceil(s.clock.days / 7);
      h.push('<div class="chips mt-s">' + Array.from({ length: weeks }, function (_, i) { return '<button class="chip' + (wk === i + 1 ? ' on' : '') + '" data-action="jweek" data-w="' + (i + 1) + '" aria-pressed="' + (wk === i + 1) + '">Semana ' + (i + 1) + '</button>'; }).join('') + '</div></section>');
      var from = (wk - 1) * 7 + 1, to = Math.min(s.clock.days, wk * 7);
      h.push('<div class="card mt table-wrap"><table class="cmp-table"><thead><tr><th>Día</th><th>Hábitos</th><th>Energía</th><th>Ánimo</th><th>Digestión</th><th>Síntomas</th><th>Comidas</th><th>Nota</th></tr></thead><tbody>' +
        s.days.slice(from, to + 1).map(function (r) {
          var c = (r.day && r.day.checkin) || {};
          var meals = L.slots().filter(function (sl) { var it = L.mealItems(r.day, sl.id); return it.length && it.every(function (m) { return m.done; }); }).length;
          return '<tr><td><a href="#/hoy/' + r.iso + '">' + r.idx + '</a><br><span class="meta">' + esc(U.fmtDate(r.iso, 'day')) + '</span></td><td class="n">' + r.done + '/' + r.total + '</td><td class="n">' + (c.energy || '—') + '</td><td class="n">' + (c.mood || '—') + '</td><td>' + esc(((U.arr(L.tx().digestionStates).filter(function (x) { return x.id === c.digestion; })[0]) || {}).label || '—') + '</td><td class="n">' + (U.arr(c.symptoms).length + U.arr(c.customSymptoms).length) + '</td><td class="n">' + meals + '/4</td><td>' + esc(String(c.notes || '').slice(0, 60)) + (String(c.notes || '').length > 60 ? '…' : '') + '</td></tr>';
        }).join('') + '</tbody></table></div>');
    } else {
      h.push('</section>');
      var withData = rows.filter(function (r) { return L.dayHasData(r.day); });
      h.push('<section class="card mt">' + (withData.length ? withData.map(function (r) { return dayBlock(s, r, p); }).join('') : '<p class="muted">Todavía no hay días con registros.</p>') + '</section>');
    }
    return h.join('');
  }
  A.actions.jv = function (el) { A.ui.jv = el.dataset.v; A.render(); };
  A.actions.jday = function (el) { A.ui.jday = +el.dataset.i; A.render(); };
  A.actions.jweek = function (el) { A.ui.jweek = +el.dataset.w; A.render(); };

  /* ---------- historial y comparación ---------- */
  function historial() {
    var p = A.P();
    var eds = Object.keys(p.editions).map(function (k) { return p.editions[k]; }).sort(function (a, b) { return (b.startDate || '').localeCompare(a.startDate || '') || b.createdAt - a.createdAt; });
    if (!eds.length) return K.empty('Sin ediciones todavía', 'Cada vez que empezás un programa se guarda acá, con sus números.', '<a class="btn primary" href="#/programas">Ver programas</a>');
    var cmp = A.ui.cmp || [];
    return '<p class="muted">Todas tus ediciones, de todos los programas. Elegí dos para compararlas.</p><ul class="list card">' + eds.map(function (e) {
      var s = A.sum(e.id), prog = s.program || {};
      var on = cmp.indexOf(e.id) > -1;
      return '<li class="li"><label class="check" style="min-height:0"><input type="checkbox" data-change="cmpPick" value="' + esc(e.id) + '"' + (on ? ' checked' : '') + ' aria-label="Comparar esta edición"></label><a class="grow" href="#/progreso/edicion/' + encodeURIComponent(e.id) + '" style="text-decoration:none;color:inherit"><b>' + esc(prog.name || e.programId) + '</b><span class="meta">' + (e.startDate ? esc(U.fmtDate(e.startDate, 'long')) : 'sin fecha') + ' · ' + esc(statusLabel(e.status)) + (e.id === p.activeEdition ? ' · activa' : '') + (e.note ? ' · ' + esc(e.note) : '') + '</span><span class="meta">Constancia ' + (s.constancy == null ? '—' : Math.round(s.constancy * 100) + ' %') + ' · ' + s.completeDays + ' días completos</span></a>' + I('chev', 'chev') + '</li>';
    }).join('') + '</ul>' + '<div class="btn-row mt"><a class="btn primary' + (cmp.length === 2 ? '' : '" aria-disabled="true') + '" href="#/progreso/comparar">' + I('progreso', 'sm') + 'Comparar ' + (cmp.length === 2 ? '' : '(elegí 2)') + '</a></div>';
  }
  A.changes.cmpPick = function (el) {
    var c = A.ui.cmp = (A.ui.cmp || []).filter(function (x) { return x !== el.value; });
    if (el.checked) { c.push(el.value); if (c.length > 2) c.shift(); }
    A.render();
  };
  function compare() {
    var c = A.ui.cmp || [], p = A.P();
    if (c.length !== 2 || !p.editions[c[0]] || !p.editions[c[1]]) return K.empty('Elegí dos ediciones', 'Marcá dos en el historial.', '<a class="btn" href="#/progreso/historial">Historial</a>');
    var S = c.map(function (id) { return A.sum(id); });
    var f = function (v, d) { return v == null ? '—' : (d ? v.toFixed(d).replace('.', ',') : v); };
    var name = function (s) { return esc((s.program || {}).name || '') + ' · ' + esc(U.fmtDate(s.edition.startDate, 'short')); };
    var rows = [
      ['Constancia', function (s) { return s.constancy == null ? '—' : Math.round(s.constancy * 100) + ' %'; }],
      ['Días completos', function (s) { return s.completeDays + ' / ' + s.clock.days; }],
      ['Mejor racha', function (s) { return s.bestStreak; }],
      ['Energía media', function (s) { return f(L.avg(L.series(s, 'energy').map(function (x) { return x.v; })), 1); }],
      ['Ánimo medio', function (s) { return f(L.avg(L.series(s, 'mood').map(function (x) { return x.v; })), 1); }],
      ['Agua media (ml)', function (s) { var v = L.avg(L.series(s, 'water').map(function (x) { return x.v; })); return v == null ? '—' : Math.round(v); }],
      ['Recetas probadas', function (s) { return s.recipesTried.all; }],
      ['Puntos', function (s) { return s.points; }]
    ];
    var n = Math.max(S[0].clock.days, S[1].clock.days);
    return '<h2 class="serif mb">Comparar ediciones</h2><div class="card table-wrap"><table class="cmp-table"><thead><tr><th></th><th>' + name(S[0]) + '</th><th>' + name(S[1]) + '</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td class="n">' + r[1](S[0]) + '</td><td class="n">' + r[1](S[1]) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<section class="card mt"><h2 class="mb">Energía, día por día</h2>' + K.lineChart([{ pts: L.series(S[0], 'energy'), cls: 'l1' }, { pts: L.series(S[1], 'energy'), cls: 'l2' }], { n: n, label: 'Energía de las dos ediciones' }) +
      '<div class="legend"><span><i style="background:var(--accent)"></i>' + name(S[0]) + '</span><span><i style="background:var(--bloom)"></i>' + name(S[1]) + '</span></div></section>';
  }

  /* ---------- reintroducción ---------- */
  function checkinsAround(p, from, to) {
    var out = [];
    Object.keys(p.editions).forEach(function (eid) {
      var e = p.editions[eid]; if (!U.isValidISO(e.startDate)) return;
      var days = p.days[eid] || {};
      Object.keys(days).forEach(function (k) {
        var iso = L.dayDate(e, +k);
        if (iso >= from && iso <= to && L.hasCheckin(days[k])) out.push({ iso: iso, c: days[k].checkin });
      });
    });
    return out.sort(function (a, b) { return a.iso.localeCompare(b.iso); });
  }
  function reintro() {
    var p = A.P(), ed = A.ED(), s = ed && U.isValidISO(ed.startDate) ? A.sum() : null;
    var finished = s && s.clock.status === 'finished';
    var foods = U.arr(A.dx().foods).filter(function (f) { return f.status !== 'green'; });
    var list = p.reintro.filter(function (r) { return !r.deleted; }).slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    var VERD = [['bien', 'Me cayó bien', 'accent'], ['dudoso', 'Dudoso', 'pollen'], ['mal', 'Me cayó mal', 'clay']];
    return (finished ? '<div class="banner info">' + I('hoja') + '<div class="grow"><b>Terminaste el programa: es momento de reintroducir.</b>De a un alimento por vez, mirando cómo te sentís las 72 horas siguientes.</div></div>' : '<p class="muted">Cuando termines el programa, sumá alimentos de a uno y anotá cómo te caen. Así sabés qué te sienta bien.</p>') +
      '<form class="card mt" data-submit="reintroAdd"><h2 class="mb">Hoy reintroduzco…</h2><div class="grid2"><label class="field"><span>Alimento</span><input class="input" name="food" list="ri-foods" required maxlength="60" placeholder="Ej.: café, pan de trigo, queso"></label><label class="field"><span>Fecha</span><input class="input" name="date" type="date" value="' + A.today() + '" required></label></div>' +
      '<datalist id="ri-foods">' + foods.map(function (f) { return '<option value="' + esc(f.name) + '">'; }).join('') + '</datalist><button class="btn primary">' + I('mas', 'sm') + 'Anotar</button></form>' +
      (list.length ? '<h2 class="section-title">Tus reintroducciones</h2>' + list.map(function (r) {
        var cks = checkinsAround(p, r.date, U.addDays(r.date, 3));
        var tx = L.tx();
        return '<section class="card" id="ri-' + esc(r.id) + '"><div class="card-h"><h3>' + esc(r.food) + '</h3><span class="meta">' + esc(U.fmtDate(r.date)) + '</span></div>' +
          (cks.length ? '<ul class="list">' + cks.map(function (x) { var sy = U.arr(x.c.symptoms).map(function (id) { return (L.idx().symptoms[id] || {}).label || id; }).concat(U.arr(x.c.customSymptoms)); return '<li class="li"><span class="tag">' + esc(U.fmtDate(x.iso, 'day')) + '</span><span class="grow">' + (x.c.energy ? 'Energía ' + x.c.energy + '/5 · ' : '') + (x.c.mood ? 'Ánimo ' + x.c.mood + '/5 · ' : '') + esc(((U.arr(tx.digestionStates).filter(function (d) { return d.id === x.c.digestion; })[0]) || {}).label || '') + (sy.length ? '<span class="meta"> · ' + esc(sy.join(', ')) + '</span>' : '') + '</span></li>'; }).join('') + '</ul>' : '<p class="muted">Hacé el check-in en Hoy estos 3 días y acá aparece cómo te sentiste.</p>') +
          '<label class="field mt-s"><span>Notas</span><textarea class="input" rows="2" data-bind="reintroNote" data-id="' + esc(r.id) + '" id="ri-note-' + esc(r.id) + '">' + esc(r.notes || '') + '</textarea></label>' +
          '<div class="row wrap"><span class="label" style="margin:0">Veredicto</span>' + VERD.map(function (v) { var on = r.verdict === v[0]; return '<button class="chip' + (on ? ' on' : '') + '" data-action="reintroVerdict" data-id="' + esc(r.id) + '" data-v="' + v[0] + '" aria-pressed="' + on + '">' + v[1] + '</button>'; }).join('') +
          '<button class="icon-btn sm" data-action="reintroDel" data-id="' + esc(r.id) + '" aria-label="Borrar ' + esc(r.food) + '">' + I('borrar', 'sm') + '</button></div></section>';
      }).join('') : '');
  }
  A.actions.reintroAdd = function (f) {
    var food = f.food.value.trim(), date = f.date.value;
    if (!food || !U.isValidISO(date)) return;
    A.update(function (s, p) { p.reintro.push({ id: U.uid('ri'), food: food, date: date, editionId: p.activeEdition, notes: '', verdict: null, updatedAt: Date.now() }); });
    A.toast('Anotado: ' + food);
  };
  A.binds.reintroNote = function (el) { var id = el.dataset.id; A.update(function (s, p) { p.reintro.forEach(function (r) { if (r.id === id) { r.notes = el.value; r.updatedAt = Date.now(); } }); }, { render: false }); };
  A.actions.reintroVerdict = function (el) { var id = el.dataset.id, v = el.dataset.v; A.update(function (s, p) { p.reintro.forEach(function (r) { if (r.id === id) { r.verdict = r.verdict === v ? null : v; r.updatedAt = Date.now(); } }); }); };
  A.actions.reintroDel = function (el) { var id = el.dataset.id; A.update(function (s, p) { p.reintro.forEach(function (r) { if (r.id === id) { r.deleted = true; r.updatedAt = Date.now(); } }); }); };

  /* ---------- informe imprimible ---------- */
  function report(edId) {
    var p = A.P();
    edId = edId || p.activeEdition;
    if (!edId || !p.editions[edId] || !U.isValidISO(p.editions[edId].startDate)) return K.back('#/progreso', 'Progreso') + K.empty('No hay informe todavía', 'Empezá un programa para generar tu informe.', '');
    var s = A.sum(edId), ed = s.edition, prog = s.program || {}, tx = L.tx();
    var lab = function (list, key, v) { var x = U.arr(list).filter(function (o) { return o[key] === v; })[0]; return x ? x.label : v || '—'; };
    var al = p.settings.allergies.map(function (a) { return L.allergenLabel(a); }).concat(p.settings.customAllergies);
    var rows = s.days.filter(function (r) { return (r.idx > 0 && !r.future) || L.dayHasData(r.day); }).map(function (r) {
      var c = (r.day && r.day.checkin) || {};
      var sy = U.arr(c.symptoms).map(function (x) { return (L.idx().symptoms[x] || {}).label || x; }).concat(U.arr(c.customSymptoms));
      var meals = L.slots().map(function (sl) { var it = L.mealItems(r.day, sl.id).filter(function (m) { return m.done; }); return it.length ? sl.label + ': ' + it.map(function (m) { return m.name; }).join(', ') : ''; }).filter(Boolean);
      return '<tr><td>' + (r.idx === 0 ? 'Prep.' : r.idx) + '<br><small>' + esc(U.fmtDate(r.iso, 'short')) + '</small></td><td>' + r.done + '/' + r.total + '</td><td>' + (c.energy || '—') + '</td><td>' + (c.mood || '—') + '</td><td>' + esc(c.digestion ? lab(tx.digestionStates, 'id', c.digestion) : '—') + '</td><td>' + esc(sy.join(', ')) + '</td><td>' + esc(c.notes || '') + (meals.length ? '<br><small>' + esc(meals.join(' · ')) + '</small>' : '') + '</td></tr>';
    }).join('');
    return '<div class="no-print">' + K.back('#/progreso', 'Progreso') + '<div class="btn-row mb"><button class="btn primary" data-action="printReport">' + I('imprimir', 'sm') + 'Imprimir o guardar PDF</button><button class="btn" data-action="copyReport" data-e="' + esc(edId) + '">' + I('copiar', 'sm') + 'Copiar texto</button><button class="btn" data-action="shareReport" data-e="' + esc(edId) + '">' + I('compartir', 'sm') + 'Compartir</button><button class="btn" data-action="dlReport" data-e="' + esc(edId) + '">' + I('descargar', 'sm') + 'Descargar .txt</button></div></div>' +
      '<article class="report print-root"><h1>Informe de seguimiento</h1><p>' + esc(prog.name || '') + ' · ' + esc(p.name || '') + '</p>' +
      '<table><tbody><tr><th>Inicio</th><td>' + esc(U.fmtDate(ed.startDate, 'long')) + '</td><th>Modo</th><td>' + esc((U.arr(prog.startModes).filter(function (m) { return m.id === ed.startMode; })[0] || {}).label || ed.startMode || '—') + '</td></tr>' +
      '<tr><th>Constancia</th><td>' + (s.constancy == null ? '—' : Math.round(s.constancy * 100) + ' %') + '</td><th>Días completos</th><td>' + s.completeDays + ' de ' + s.clock.days + '</td></tr>' +
      '<tr><th>Mejor racha</th><td>' + s.bestStreak + '</td><th>Recetas probadas</th><td>' + s.recipesTried.all + '</td></tr>' +
      (al.length ? '<tr><th>Alergias</th><td colspan="3">' + esc(al.join(', ')) + '</td></tr>' : '') + '</tbody></table>' +
      '<h2>Día por día</h2><div class="table-wrap"><table><thead><tr><th>Día</th><th>Hábitos</th><th>Energía</th><th>Ánimo</th><th>Digestión</th><th>Síntomas</th><th>Notas y comidas</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="meta" style="margin-top:16px">Detox de Primavera v' + esc(A.version) + ' · ' + esc(U.fmtDate(A.today(), 'long')) + '. Registro personal; no es un documento médico.</p></article>';
  }
  A.actions.printReport = function () { root.print(); };
  function reportTxt(edId) { var p = A.P(); return L.reportText(p, A.sum(edId)); }
  A.actions.copyReport = function (el) { A.copy(reportTxt(el.dataset.e)).then(function (ok) { A.toast(ok ? 'Informe copiado' : 'No se pudo copiar'); }); };
  A.actions.shareReport = function (el) { A.share({ title: 'Informe de seguimiento', text: reportTxt(el.dataset.e) }); };
  A.actions.dlReport = function (el) { A.download('informe-detox-' + A.today() + '.txt', reportTxt(el.dataset.e), 'text/plain;charset=utf-8'); };
})(typeof window !== 'undefined' ? window : globalThis);
