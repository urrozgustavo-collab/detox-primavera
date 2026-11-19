/* Detox v2 — búsqueda global (Ctrl/⌘+K o /) y onboarding de la primera vez. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic, K = A.kit, esc = U.esc, I = A.icon;

  /* ================= búsqueda global ================= */
  A.actions.openSearch = function () {
    A.openSheet({ title: 'Buscar', cls: 'search-sheet',
      body: '<div class="search big">' + I('buscar') + '<input class="input" id="gs" type="search" role="combobox" aria-expanded="true" aria-controls="gs-results" aria-autocomplete="list" data-bind="gsearch" placeholder="Recetas, alimentos, síntomas, hierbas, notas…" autocomplete="off" aria-label="Buscar en toda la app"></div>' +
        '<p class="meta mt-s">' + (A.isMac ? '⌘K' : 'Ctrl+K') + ' o / para abrir · ↑ ↓ para elegir · Enter para ir</p><div id="gs-results" role="listbox" aria-label="Resultados"></div>', focus: '#gs' });
    A.ui.sres = []; A.ui.ssel = 0;
    var inp = document.getElementById('gs');
    inp.addEventListener('keydown', function (e) {
      var n = A.ui.sres.length; if (!n) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); A.ui.ssel = (A.ui.ssel + 1) % n; paintSel(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); A.ui.ssel = (A.ui.ssel - 1 + n) % n; paintSel(); }
      else if (e.key === 'Enter') { e.preventDefault(); goResult(A.ui.ssel); }
    });
  };
  function paintSel() {
    document.querySelectorAll('#gs-results [role="option"]').forEach(function (el, i) { el.setAttribute('aria-selected', String(i === A.ui.ssel)); if (i === A.ui.ssel) el.scrollIntoView({ block: 'nearest' }); });
    var inp = document.getElementById('gs'); if (inp) inp.setAttribute('aria-activedescendant', 'gs-' + A.ui.ssel);
  }
  function goResult(i) {
    var r = A.ui.sres[i]; if (!r) return;
    A.closeDialog();
    r.go();
  }
  A.actions.gsGo = function (el) { goResult(+el.dataset.i); };
  function nav(path, scrollId, prep) { return function () { if (prep) prep(); A.ui.scrollTo = scrollId || null; A.go(path); }; }

  A.search = function (q) {
    var p = A.P(), dx = A.dx(), out = [];
    var m = function (txt) { return U.matchQuery(txt, q); };
    var add = function (group, label, meta, go) { out.push({ group: group, label: label, meta: meta, go: go }); };
    L.allRecipes(p).forEach(function (r) { if (m(r.title + ' ' + U.arr(r.ingredients).map(function (i) { return i.text; }).join(' ') + ' ' + (r.tags || []).join(' '))) add('Recetas', r.title, L.categoryLabel(r.category), nav('/cocina/receta/' + r.id)); });
    U.arr(dx.foods).forEach(function (f) { if (m([f.name, f.category].concat(f.synonyms || []).join(' '))) add('¿Puedo comer…?', f.name, L.statusLabel(f.status), nav('/guia/semaforo', 'f-' + f.id, function () { A.ui.fdq = ''; A.ui.fdst = ''; A.ui.foodOpen = f.id; })); });
    U.arr(dx.ingredients).forEach(function (g) { if (m([g.name].concat(g.synonyms || []).join(' '))) add('Ingredientes', g.name, 'Ver en la heladera', nav('/cocina/heladera', null, function () { A.ui.fq = g.name; A.ui.fcat = ''; })); });
    U.arr(dx.sos).forEach(function (s) { if (m(s.symptom + ' ' + (s.cause || '') + ' ' + U.arr(s.steps).map(function (x) { return x.text; }).join(' '))) add('SOS', s.symptom, 'Protocolo', nav('/guia/sos/' + s.id)); });
    U.arr(dx.herbs).forEach(function (h) { if (m(h.name + ' ' + U.arr(h.properties).join(' '))) add('Herbario', h.name, 'Ficha', nav('/guia/herbario/' + h.id)); });
    var prog = A.PROG();
    if (prog) U.arr(prog.habits).concat(U.arr(prog.prepHabits)).forEach(function (h) { if (m(h.text + ' ' + (h.tip || ''))) add('Hábitos', h.text, 'En Hoy', nav('/hoy', 'h-habitos', function () { A.ui.allHabits = true; })); });
    U.arr(dx.shopping).forEach(function (s) { if (m(s.item)) add('Compras', s.item, L.storeLabel(s.store), nav('/compras/base', 'sh-' + s.id, function () { A.ui.shopStore = null; A.ui.hideBought = false; A.ui.onlyEss = false; })); });
    p.shopping.custom.forEach(function (c) { if (!c.deleted && m(c.text)) add('Compras', c.text, 'Tu lista', nav('/compras', 'sh-' + c.id, function () { A.ui.shopStore = null; A.ui.hideBought = false; })); });
    Object.keys(p.editions).forEach(function (eid) {
      var e = p.editions[eid]; if (!U.isValidISO(e.startDate)) return;
      var days = p.days[eid] || {};
      Object.keys(days).forEach(function (k) {
        var c = days[k].checkin;
        if (c && c.notes && m(c.notes)) { var iso = L.dayDate(e, +k); add('Diario', (+k === 0 ? 'Preparación' : 'Día ' + k) + ' · ' + U.fmtDate(iso, 'short'), String(c.notes).slice(0, 80), eid === p.activeEdition ? nav('/hoy/' + iso, null, function () { A.ui.afterRoute = function () { A.openLive('checkin', { focus: '#checkin-notes' }); }; }) : nav('/progreso/edicion/' + eid)); }
      });
    });
    return out;
  };
  A.binds.gsearch = U.debounce(function (el) {
    var q = el.value.trim(), box = document.getElementById('gs-results');
    if (!box) return;
    if (U.norm(q).length < 2) { box.innerHTML = ''; A.ui.sres = []; return; }
    var res = A.search(q), groups = {}, order = [];
    res.forEach(function (r) { if (!groups[r.group]) { groups[r.group] = []; order.push(r.group); } if (groups[r.group].length < 6) groups[r.group].push(r); });
    A.ui.sres = []; A.ui.ssel = 0;
    var i = 0;
    box.innerHTML = res.length ? order.map(function (g) {
      return '<div class="search-group" role="group" aria-label="' + esc(g) + '"><h3>' + esc(g) + '</h3><ul class="list">' + groups[g].map(function (r) {
        A.ui.sres.push(r);
        var n = i++;
        return '<li class="sr-item" role="option" id="gs-' + n + '" aria-selected="' + (n === 0) + '"><button class="li" data-action="gsGo" data-i="' + n + '" tabindex="-1"><span class="grow"><b>' + esc(r.label) + '</b><span class="meta">' + esc(r.meta || '') + '</span></span>' + I('chev', 'chev') + '</button></li>';
      }).join('') + '</ul></div>';
    }).join('') : '<p class="muted mt">Nada con «' + esc(q) + '». Probá con otra palabra.</p>';
  }, 110);

  /* ================= onboarding (≤ 4 pasos, salteable) ================= */
  A.onboarding = function (report) {
    A.ui.onb = { step: 1, report: report && report.migrated ? report : null, prog: 'detox-primavera-21', date: null, mode: null };  // v2.3: sin fecha preelegida; «Después» no crea edición
    paintOnb();
  };
  function onbBody() {
    var o = A.ui.onb, p = A.P(), tx = L.tx();
    var dots = '<div class="onb-steps" aria-hidden="true">' + [1, 2, 3, 4].map(function (n) { return '<i class="' + (n <= o.step ? 'on' : '') + '"></i>'; }).join('') + '</div>';
    if (o.step === 1) return dots + '<div class="center">' + K.plant(2, 110).replace('<svg', '<svg style="margin:0 auto"') + '</div><h3 class="serif center" style="font-size:1.6rem;margin:8px 0">Bienvenida, bienvenido</h3>' +
      '<p class="center">Una compañía calma para tu programa: hábitos del día, recetas de la guía, compras y un diario de cómo te sentís.</p>' +
      '<p class="note mt">' + I('info', 'sm') + ' Material educativo del taller; no reemplaza la consulta médica. Si estás embarazada, en lactancia, tomás medicación o tenés una enfermedad crónica, consultá antes de empezar.</p>';
    if (o.step === 2) return dots + '<form data-submit="onbNext"><label class="field"><span>¿Cómo te llamás?</span><input class="input" id="onb-name" value="' + esc(p.name) + '" placeholder="Por ejemplo: Gustavo" maxlength="30" autocomplete="given-name" aria-describedby="onb-name-msg"></label><p id="onb-name-msg" class="meta" aria-live="polite"></p></form>' +
      '<p class="meta">¿Alguien más usa este dispositivo? Podés sumar perfiles después en Ajustes; cada persona lleva su propio diario.</p>';
    if (o.step === 3) {
      if (o.report) {
        var ed = A.ED(), c = ed ? L.clock(ed, A.PROG(), A.today()) : null;
        return dots + '<h3 class="serif" style="font-size:1.4rem">Importamos tu progreso</h3><p>Encontramos tus datos de la versión anterior: <b>' + U.plural(o.report.days, 'día') + ' con registros</b>.</p>' +
          (c && c.status === 'active' ? '<p>Hoy es tu <b>día ' + c.idx + ' de ' + c.days + '</b>.</p>' : c && c.status === 'finished' ? '<p>Tu edición ya terminó: la vas a ver en Progreso.</p>' : '<p>Elegí la fecha de inicio en Hoy cuando quieras.</p>') +
          (o.report.warnings.length ? '<details><summary>Detalles</summary><ul>' + o.report.warnings.map(function (w) { return '<li class="meta">' + esc(w) + '</li>'; }).join('') + '</ul></details>' : '') +
          '<p class="meta mt-s">Tus datos viejos no se tocaron: quedan como respaldo.</p>';
      }
      var progs = L.allPrograms(p), prog = L.program(o.prog, p) || progs[0];
      if (!prog) return dots + '<p>No hay programas cargados.</p>';
      if (!o.mode) o.mode = prog.defaultStartMode;
      var t = A.today(), opts = U.startChoices(t).concat([['Después', '']]);
      return dots + '<label class="field"><span>Programa</span><select class="input" id="onb-prog">' + progs.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === prog.id ? ' selected' : '') + '>' + esc(x.name) + ' · ' + x.days + ' días</option>'; }).join('') + '</select></label>' +
        '<p class="label">¿Cuándo empezás?</p><div class="chips">' + opts.map(function (x) { return '<button class="chip' + (o.date === x[1] ? ' on' : '') + '" data-action="onbDate" data-d="' + x[1] + '" aria-pressed="' + (o.date === x[1]) + '">' + x[0] + (x[1] ? ' <span class="meta">' + U.fmtDate(x[1], 'short') + '</span>' : '') + '</button>'; }).join('') + '</div>' +
        (U.arr(prog.startModes).length > 1 && o.date ? '<p class="label mt">Cómo empezar</p>' + prog.startModes.map(function (m) { return '<label class="check"><input type="radio" name="onbm" data-change="onbMode" value="' + esc(m.id) + '"' + (o.mode === m.id ? ' checked' : '') + '><span>' + esc(m.label) + '</span></label>'; }).join('') : '');
    }
    return dots + '<p>Opcional: así te avisamos de alérgenos y contraindicaciones. Lo podés cambiar en Ajustes.</p><p class="label">Alergias e intolerancias</p><div class="chips">' +
      U.arr(tx.allergens).map(function (a) { var on = p.settings.allergies.indexOf(a.id) > -1; return '<button class="chip' + (on ? ' on' : '') + '" data-action="onbAllergy" data-a="' + a.id + '" aria-pressed="' + on + '">' + esc(a.label) + '</button>'; }).join('') + '</div>' +
      '<p class="label mt">Condiciones de salud</p>' + U.arr(tx.conditions).map(function (c) { return '<label class="check"><input type="checkbox" data-change="onbCond" value="' + c.id + '"' + (p.settings.conditions.indexOf(c.id) > -1 ? ' checked' : '') + '><span>' + esc(c.label) + '</span></label>'; }).join('') +
      '<p class="label mt">Constitución</p><div class="seg" role="group" aria-label="Constitución">' + [['', 'No sé'], ['friolento', 'Friolento/a'], ['caluroso', 'Caluroso/a']].map(function (c) { return '<button data-action="onbConst" data-c="' + c[0] + '" aria-pressed="' + ((p.settings.constitution || '') === c[0]) + '">' + c[1] + '</button>'; }).join('') + '</div>';
  }
  function paintOnb() {
    var o = A.ui.onb;
    if (!o) return;
    var foot = (o.step > 1 ? '<button class="btn ghost" data-action="onbBack">Atrás</button>' : '') + '<button class="btn ghost" data-action="onbSkip">Saltar</button>' +
      '<button class="btn primary" data-action="onbNext">' + (o.step === 4 ? 'Listo' : 'Siguiente') + '</button>';
    var d = document.getElementById('sheet');
    if (d.open && d.classList.contains('onb')) {
      d.querySelector('.sheet-b').innerHTML = onbBody(); d.querySelector('.sheet-f').innerHTML = foot;
      var f = d.querySelector('#onb-name') || d.querySelector('.sheet-b'); if (f) { if (f.classList.contains('sheet-b')) f.setAttribute('tabindex', '-1'); f.focus(); }
      return;
    }
    A.openSheet({ title: ['Bienvenida', 'Tu nombre', 'Tu programa', 'Tu cuerpo'][o.step - 1], cls: 'onb', body: onbBody(), foot: foot, onClose: finishOnb });
  }
  function saveStep() {
    if (!A.ui.onb) return;
    var o = A.ui.onb, d = document.getElementById('sheet');
    if (o.step === 2) { var n = d.querySelector('#onb-name'); if (n) A.update(function (s, p) { p.name = n.value.trim(); }, { meta: true, render: false }); }
    if (o.step === 3 && !o.report) { var sel = d.querySelector('#onb-prog'); if (sel && sel.value !== o.prog) { o.prog = sel.value; o.mode = null; } }
  }
  function title() { var o = A.ui.onb; var h = document.getElementById('sheet-title'); if (h) h.textContent = ['Bienvenida', 'Tu nombre', 'Tu programa', 'Tu cuerpo'][o.step - 1]; }
  A.actions.onbNext = function () {
    var o = A.ui.onb; if (!o) return;
    if (o.step === 2) {
      var nm = document.getElementById('onb-name');
      if (nm && !nm.value.trim()) { var msg = document.getElementById('onb-name-msg'); if (msg) msg.textContent = 'Escribí tu nombre (así se distinguen los perfiles). Si preferís, tocá «Saltar».'; nm.focus(); return; }
    }
    saveStep();
    if (o.step === 3 && !o.report && o.date) {
      var sel = document.querySelector('#onb-prog');
      if (sel && sel.value !== o.prog) { o.prog = sel.value; o.mode = null; paintOnb(); return; }
      if (!A.ED() || A.ED().programId !== o.prog) A.startEdition(o.prog, o.date, o.mode);
    }
    if (o.step === 4) { A.closeDialog(); return; }
    o.step++; title(); paintOnb();
  };
  A.actions.onbBack = function () { saveStep(); A.ui.onb.step--; title(); paintOnb(); };
  A.actions.onbSkip = function () { A.closeDialog(); };
  A.actions.onbDate = function (el) { saveStep(); A.ui.onb.date = el.dataset.d; paintOnb(); };
  A.changes.onbMode = function (el) { A.ui.onb.mode = el.value; };
  A.actions.onbAllergy = function (el) { A.actions.allergy(el); paintOnb(); };
  A.changes.onbCond = function (el) { A.changes.condition(el); };
  A.actions.onbConst = function (el) { A.update(function (s, p) { p.settings.constitution = el.dataset.c || null; }, { settings: true }); paintOnb(); };
  function finishOnb() {
    if (!A.ui.onb) return;
    A.ui.onb = null;
    A.update(function (s) { s.device.onboarded = true; }, { sync: false });
    if (A.ui.pendingSync && A.openSyncLink) A.openSyncLink(A.ui.pendingSync);
  }
})(typeof window !== 'undefined' ? window : globalThis);
