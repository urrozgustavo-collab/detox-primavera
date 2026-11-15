/* Detox v2 — pantalla «Hoy» (la estrella): día, planta, anillo, hábitos, agua, comidas, check-in, notas. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic, K = A.kit, esc = U.esc, I = A.icon;

  /* ---------- contexto del día que se mira ---------- */
  A.dayCtx = function (route) {
    var p = A.P(), ed = A.ED(), prog = A.PROG();
    if (!p || !ed || !prog) return null;
    var sum = A.sum(), c = sum.clock;
    if (c.status === 'nodate') return { p: p, ed: ed, prog: prog, sum: sum, nodate: true };
    var todayIdx = c.status === 'future' ? 0 : c.idx;
    var maxEdit = c.status === 'finished' ? c.days : todayIdx;
    var idx = c.status === 'future' ? 0 : c.idx;
    var param = route && route.parts[0];
    if (param && U.isValidISO(param)) idx = Math.max(0, Math.min(c.days, U.diffDays(ed.startDate, param) + 1));
    var row = sum.days[idx];
    return { p: p, ed: ed, prog: prog, sum: sum, clock: c, idx: idx, row: row, todayIdx: todayIdx, editable: idx <= maxEdit, iso: L.dayDate(ed, idx), phase: L.phase(prog, row.phaseId) };
  };
  function dayHref(ed, idx) { return '#/hoy/' + L.dayDate(ed, idx); }

  /* ---------- render ---------- */
  A.screens.hoy = {
    render: function (route) {
      var p = A.P();
      if (!p) return '';
      var ed = A.ED();
      if (!ed) return welcome(null);
      var ctx = A.dayCtx(route);
      if (!ctx || !ctx.prog) return '<div class="card warn">No encontramos el programa de esta edición. <a href="#/programas">Elegí otro programa</a>.</div>';
      if (ctx.nodate) return welcome(ctx);
      var h = [];
      if (ctx.clock.status === 'finished') h.push(closingCard(ctx));
      h.push(hero(ctx));
      h.push(dayStrip(ctx));
      if (ctx.clock.status === 'future' && ctx.idx === 0) h.push(countdown(ctx));
      if (!ctx.editable) h.push('<div class="banner info">' + I('calendario') + '<div class="grow"><b>Este día todavía no llegó.</b>Podés mirarlo y planificar sus comidas desde Cocina › Plan.</div></div>');
      if (ctx.idx !== ctx.todayIdx && ctx.editable && ctx.clock.status === 'active') h.push('<div class="banner info">' + I('editar') + '<div class="grow"><b>Estás completando un día anterior.</b>La racha y la constancia siempre se calculan con la fecha de hoy.</div><a class="btn sm" href="' + dayHref(ctx.ed, ctx.todayIdx) + '">Ir a hoy</a></div>');
      h.push('<div class="hoy-grid"><div class="col">' + ringCard(ctx) + habitsCard(ctx) + waterCard(ctx) + '</div><div class="col">' + mealsCard(ctx) + checkinCard(ctx) + notesCard(ctx) + '</div></div>');
      return h.join('');
    },
    mount: function () {
      var strip = document.querySelector('.daystrip .on');
      if (strip && strip.scrollIntoView) { var box = strip.parentElement; box.scrollLeft = strip.offsetLeft - box.clientWidth / 2 + strip.clientWidth / 2; }
    }
  };

  function hero(ctx) {
    var stage = K.plantStage(ctx.sum);
    var prev = A.ui.lastStage; A.ui.lastStage = stage;
    var grew = prev != null && stage > prev;
    var big = ctx.idx === 0 ? '<span class="num">Preparación</span>' : '<span class="num">Día ' + ctx.idx + '</span><small> de ' + ctx.clock.days + '</small>';
    return '<section class="hero" aria-label="Resumen del día">' +
      '<div class="hero-txt"><p class="hero-date">' + esc(ctx.iso ? U.fmtDate(ctx.iso, 'long') : '') + (ctx.idx === ctx.todayIdx && ctx.clock.status === 'active' ? ' · hoy' : '') + '</p>' +
      '<h1 class="day-num">' + big + '</h1>' +
      '<p><span class="phase-chip ph-' + esc(ctx.row.phaseId) + '">' + I(ctx.row.phaseId === 'monodieta' ? 'hoja' : ctx.row.phaseId === 'previa' ? 'amanecer' : 'planta', 'sm') + esc(ctx.phase.name) + '</span></p>' +
      (ctx.phase.desc ? '<p class="hero-desc' + (A.ui.descOpen ? ' open' : '') + '" data-action="toggleDesc" title="Tocá para ver todo">' + esc(ctx.phase.desc) + '</p>' : '') + '</div>' +
      '<div class="hero-plant' + (grew ? ' grew' : '') + '">' + K.plant(stage, 132) + '<span class="meta">' + esc(K.STAGE_NAMES[stage]) + '</span></div></section>';
  }

  function dayStrip(ctx) {
    var items = ctx.sum.days.map(function (r) {
      var cls = 'ds ds-' + r.status + (r.idx === ctx.idx ? ' on' : '') + (r.idx === ctx.todayIdx && ctx.clock.status !== 'finished' ? ' today' : '');
      var lab = (r.idx === 0 ? 'Preparación' : 'Día ' + r.idx) + (r.iso ? ', ' + U.fmtDate(r.iso) : '') + (r.idx === ctx.todayIdx ? ' (hoy)' : '') + ' — ' + ({ complete: 'completo', grace: 'día de gracia', partial: 'parcial', empty: 'sin completar', today: 'en curso', future: 'por venir' })[r.status] + (r.graced && r.status === 'partial' ? ', cubierto por un día de gracia' : '');
      return '<a class="' + cls + '" href="' + dayHref(ctx.ed, r.idx) + '" aria-label="' + esc(lab) + '"' + (r.idx === ctx.idx ? ' aria-current="date"' : '') + '><small>' + (r.idx === 0 ? 'P' : r.iso ? U.DIAS[U.weekday(r.iso)].charAt(0).toUpperCase() : '') + '</small><b>' + (r.idx === 0 ? '0' : r.idx) + '</b><i aria-hidden="true">' + (r.graced ? I('hoja', 'sm') : '') + '</i></a>';
    }).join('');
    return '<nav class="daystrip" aria-label="Días de la edición">' + items + '</nav>';
  }

  function ringCard(ctx) {
    var r = ctx.row, s = ctx.sum;
    var cons = s.constancy == null ? '—' : Math.round(s.constancy * 100) + ' %';
    return '<section class="card ring-card" aria-label="Avance del día">' + K.ring(r.total ? r.done / r.total : 0, 112, '<span><b>' + r.done + '</b><small>de ' + r.total + '</small></span>', r.done + ' de ' + r.total + ' hábitos hechos') +
      '<div class="ring-stats"><div><b class="num">' + cons + '</b><span>constancia</span></div>' +
      '<div><b class="num">' + s.streak + '</b><span>' + (s.streak === 1 ? 'día de racha' : 'días de racha') + (s.bestStreak > s.streak ? ' · mejor ' + s.bestStreak : '') + '</span></div>' +
      '<div><b class="num">' + s.points + '</b><span>puntos</span></div></div>' +
      (r.complete ? '<p class="done-line">' + I('flor', 'sm') + ' Día completo. Bien ahí.</p>' : (2 - s.graceUsed > 0 && ctx.clock.status === 'active' ? '<p class="meta grace-line">' + I('hoja', 'sm') + ' Te quedan ' + U.plural(2 - s.graceUsed, 'día') + ' de gracia: si un día no llegás, la racha no se corta.</p>' : '')) +
      '</section>';
  }

  function habitsCard(ctx) {
    var day = ctx.row.day || { habits: {} };
    var conds = ctx.p.settings.conditions || [];
    var hs = ctx.row.habits;
    if (!hs.length) return '<section class="card"><div class="card-h"><h2>Hábitos</h2></div><p class="muted">Este programa no tiene hábitos para esta fase.</p></section>';
    var dis = ctx.editable ? '' : ' disabled';
    var items = hs.map(function (h) {
      var st = day.habits && day.habits[h.id];
      var warn = L.habitWarnings(h, conds);
      var warnTxt = warn.length ? '<span class="tag warn">' + I('alerta', 'sm') + 'Consultá: ' + esc(warn.map(function (c) { var x = L.idx().conditions[c]; return x ? x.label.split(' (')[0].toLowerCase() : c; }).join(', ')) + '</span>' : '';
      return '<li class="habit' + (st === 'done' ? ' is-done' : st === 'skip' ? ' is-skip' : '') + '">' +
        '<button class="habit-main" data-action="habit" data-h="' + esc(h.id) + '" aria-pressed="' + (st === 'done') + '"' + dis + '><span class="tick">' + I('check') + '</span><span class="grow"><span class="h-t">' + esc(h.text) + '</span>' + (st === 'skip' ? '<span class="meta">Hoy no, a conciencia</span>' : '') + warnTxt + '</span></button>' +
        '<div class="habit-side">' + (h.tip ? '<button class="icon-btn sm" data-action="habitTip" data-h="' + esc(h.id) + '" aria-expanded="' + !!(A.ui.tip === h.id) + '" aria-label="Consejo">' + I('info', 'sm') + '</button>' : '') +
        (ctx.editable && st !== 'done' ? '<button class="btn ghost sm" data-action="habitSkip" data-h="' + esc(h.id) + '">' + (st === 'skip' ? 'Deshacer' : 'Hoy no') + '</button>' : '') + '</div>' +
        (A.ui.tip === h.id && h.tip ? '<p class="habit-tip">' + esc(h.tip) + '</p>' : '') + (warn.length && h.warn ? warn.map(function (c) { return h.warn[c] ? '<p class="habit-tip warn-tip">' + I('alerta', 'sm') + ' ' + esc(h.warn[c]) + '</p>' : ''; }).join('') : '') + '</li>';
    }).join('');
    return '<section class="card" aria-labelledby="h-habitos"><div class="card-h"><h2 id="h-habitos">' + (ctx.idx === 0 ? 'Para prepararte' : 'Hábitos del día') + '</h2><span class="meta">' + ctx.row.done + '/' + ctx.row.total + '</span></div><ul class="list habits">' + items + '</ul></section>';
  }

  function waterCard(ctx) {
    var total = ctx.row.water, goal = ctx.sum.waterGoal;
    var ratio = Math.min(1, total / goal);
    var lvl = (100 - ratio * 82).toFixed(1);
    var glass = '<svg class="glass" viewBox="0 0 64 88" width="56" height="77" aria-hidden="true"><defs><clipPath id="gclip"><path d="M8 6h48l-6 76H14z"/></clipPath></defs><rect class="gw" x="0" y="' + lvl + '" width="64" height="100" clip-path="url(#gclip)"/><path class="gl" d="M8 6h48l-6 76H14z"/></svg>';
    var dis = ctx.editable ? '' : ' disabled';
    return '<section class="card water" aria-labelledby="h-agua"><div class="card-h"><h2 id="h-agua">Agua</h2><button class="btn ghost sm" data-action="waterGoal">Meta: ' + (goal / 1000).toString().replace('.', ',') + ' l</button></div>' +
      '<div class="row">' + glass + '<div class="grow"><p class="water-num"><b class="num">' + total + '</b> <span class="meta">de ' + goal + ' ml</span></p>' +
      '<div class="btn-row"><button class="btn sm" data-action="water" data-ml="250"' + dis + '>' + I('mas', 'sm') + '250 ml</button><button class="btn sm" data-action="water" data-ml="500"' + dis + '>' + I('mas', 'sm') + '500 ml</button>' +
      (ctx.row.day && ctx.row.day.water.length && ctx.editable ? '<button class="btn ghost sm" data-action="waterUndo" aria-label="Deshacer el último vaso">' + I('deshacer', 'sm') + 'Deshacer</button>' : '') + '</div></div></div>' +
      '<p class="sr-only" aria-live="polite">' + total + ' mililitros de ' + goal + '</p></section>';
  }

  /* ---------- comidas ---------- */
  function mealsCard(ctx) {
    var slots = L.slots();
    var planDay = ctx.iso && ctx.p.plan[ctx.iso];
    var body = slots.map(function (s) {
      var items = L.mealItems(ctx.row.day, s.id);
      var list = items.map(function (m) {
        var r = m.recipeId ? L.recipe(m.recipeId, ctx.p) : null;
        var hits = r ? L.recipeAllergyHits(r, ctx.p) : L.textAllergyHits(m.name, null, ctx.p);
        return '<li class="meal' + (m.done ? ' is-done' : '') + '"><button class="tick sq' + (m.done ? ' on' : '') + '" data-action="mealToggle" data-slot="' + s.id + '" data-id="' + esc(m.id) + '" aria-pressed="' + !!m.done + '" aria-label="' + (m.done ? 'Desmarcar' : 'Marcar como comida') + ': ' + esc(m.name) + '"' + (ctx.editable ? '' : ' disabled') + '>' + I('check') + '</button>' +
          '<span class="grow">' + (r ? '<a href="#/cocina/receta/' + encodeURIComponent(r.id) + '">' + esc(m.name) + '</a>' : esc(m.name)) + (hits.any ? ' <span class="tag alert">' + I('alerta', 'sm') + 'alérgeno</span>' : '') + '</span>' +
          (ctx.editable ? '<button class="icon-btn sm" data-action="mealDelete" data-slot="' + s.id + '" data-id="' + esc(m.id) + '" aria-label="Quitar ' + esc(m.name) + '">' + I('borrar', 'sm') + '</button>' : '') + '</li>';
      }).join('');
      var fromPlan = U.arr(planDay && planDay[s.id]).filter(function (rid) { return !items.some(function (m) { return m.recipeId === rid; }); });
      var planChips = fromPlan.map(function (rid) { var r = L.recipe(rid, ctx.p); return r ? '<button class="chip soft" data-action="mealAddRecipe" data-slot="' + s.id + '" data-r="' + esc(rid) + '"' + (ctx.editable ? '' : ' disabled') + '>' + I('calendario', 'sm') + 'Del plan: ' + esc(r.title) + '</button>' : ''; }).join('');
      var sug = '';
      if (!items.length && !fromPlan.length && ctx.editable) {
        sug = L.suggest({ profile: ctx.p, editionId: ctx.ed.id, program: ctx.prog, phaseId: ctx.row.phaseId, slot: s.id, dayIdx: ctx.idx, dateISO: ctx.iso, n: 2 }).map(function (x) {
          return '<button class="chip soft sug" data-action="mealAddRecipe" data-slot="' + s.id + '" data-r="' + esc(x.recipe.id) + '">' + I('mas', 'sm') + esc(x.recipe.title) + ' <span class="meta">· ' + esc(x.reason) + '</span></button>';
        }).join('');
      }
      return '<div class="slot"><div class="slot-h"><h3>' + esc(s.label) + '</h3>' + (ctx.editable ? '<button class="btn ghost sm" data-action="mealAddSheet" data-slot="' + s.id + '">' + I('mas', 'sm') + 'Agregar</button>' : '') + '</div>' +
        (list ? '<ul class="list meals">' + list + '</ul>' : '') + (planChips || sug ? '<div class="chips">' + planChips + sug + '</div>' : (!list ? '<p class="meta">Sin registrar.</p>' : '')) + '</div>';
    }).join('');
    return '<section class="card" aria-labelledby="h-comidas"><div class="card-h"><h2 id="h-comidas">Comidas</h2><a class="btn ghost sm" href="#/cocina/plan">Plan</a></div>' + body + '</section>';
  }

  /* ---------- check-in ---------- */
  function checkinCard(ctx) {
    var tx = L.tx(), day = ctx.row.day, c = (day && day.checkin) || {};
    var done = L.hasCheckin(day);
    var open = A.ui.checkinOpen === ctx.ed.id + ':' + ctx.idx || !done;
    if (!ctx.editable && !done) return '<section class="card"><div class="card-h"><h2>Check-in</h2></div><p class="muted">Se completa ese día.</p></section>';
    if (!open) {
      var bits = [];
      if (c.energy) bits.push('Energía ' + esc((U.arr(tx.energyLevels).filter(function (x) { return x.v === Number(c.energy); })[0] || {}).label || c.energy));
      if (c.mood) bits.push('Ánimo ' + esc((U.arr(tx.moodLevels).filter(function (x) { return x.v === Number(c.mood); })[0] || {}).label || c.mood));
      if (c.digestion) bits.push('Digestión: ' + esc((L.tx().digestionStates.filter(function (x) { return x.id === c.digestion; })[0] || {}).label || c.digestion));
      var sy = U.arr(c.symptoms).map(function (s) { var x = L.idx().symptoms[s]; return x ? x.label : s; }).concat(U.arr(c.customSymptoms));
      return '<section class="card" aria-labelledby="h-checkin"><div class="card-h"><h2 id="h-checkin">Check-in</h2><span class="tag accent">' + I('check', 'sm') + 'Hecho</span></div><p>' + bits.join(' · ') + '</p>' + (sy.length ? '<p class="meta">Síntomas: ' + esc(sy.join(', ')) + '</p>' : '') + (c.notes ? '<p class="note">' + esc(c.notes) + '</p>' : '') +
        (ctx.editable ? '<button class="btn sm mt-s" data-action="checkinOpen">' + I('editar', 'sm') + 'Editar</button>' : '') + '</section>';
    }
    function scale(field, list) {
      return '<div class="scale" role="group" aria-label="' + (field === 'energy' ? 'Energía' : 'Ánimo') + '">' + U.arr(list).map(function (x) {
        var on = Number(c[field]) === x.v;
        return '<button class="sc' + (on ? ' on' : '') + '" data-action="checkin" data-f="' + field + '" data-v="' + x.v + '" aria-pressed="' + on + '" aria-label="' + esc(x.label) + '"><span aria-hidden="true">' + esc(x.emoji || x.v) + '</span><small>' + esc(x.label.split(' /')[0]) + '</small></button>';
      }).join('') + '</div>';
    }
    var dig = U.arr(tx.digestionStates).map(function (x) { var on = c.digestion === x.id; return '<button class="chip' + (on ? ' on' : '') + '" data-action="checkin" data-f="digestion" data-v="' + x.id + '" aria-pressed="' + on + '">' + esc((x.emoji ? x.emoji + ' ' : '') + x.label) + '</button>'; }).join('');
    var sym = U.arr(tx.symptoms).map(function (x) {
      var on = U.arr(c.symptoms).indexOf(x.id) > -1;
      return '<span class="symp"><button class="chip' + (on ? ' on' : '') + '" data-action="symptom" data-s="' + x.id + '" aria-pressed="' + on + '">' + esc(x.label) + '</button>' + (on && x.sos && L.idx().sos[x.sos] ? '<a class="sos-link" href="#/guia/sos/' + encodeURIComponent(x.sos) + '">' + I('botiquin', 'sm') + 'SOS</a>' : '') + '</span>';
    }).join('');
    var custom = U.arr(c.customSymptoms).map(function (s) { return '<button class="chip on" data-action="customSymptomDel" data-s="' + esc(s) + '" aria-label="Quitar ' + esc(s) + '">' + esc(s) + I('cerrar', 'sm x') + '</button>'; }).join('');
    return '<section class="card checkin" aria-labelledby="h-checkin"><div class="card-h"><h2 id="h-checkin">Check-in</h2><span class="meta">10 segundos</span></div>' +
      '<p class="label">Energía</p>' + scale('energy', tx.energyLevels) +
      '<p class="label">Ánimo</p>' + scale('mood', tx.moodLevels) +
      '<p class="label">Digestión</p><div class="chips">' + dig + '</div>' +
      '<p class="label">Síntomas</p><div class="chips">' + sym + custom + '</div>' +
      '<form class="row mt-s" data-submit="customSymptomAdd"><input class="input" name="s" placeholder="Otro síntoma…" aria-label="Agregar otro síntoma" maxlength="60"><button class="btn sm">Agregar</button></form>' +
      '<label class="field mt"><span>Notas del día</span><textarea class="input" id="checkin-notes" data-bind="checkinNotes" rows="3" placeholder="Cómo dormiste, qué notaste, qué te costó…">' + esc(c.notes || '') + '</textarea></label>' +
      (done ? '<button class="btn primary sm" data-action="checkinClose">Listo</button>' : '') + '<p class="meta">Se guarda solo.</p></section>';
  }

  /* ---------- notas, cita y «para mañana» ---------- */
  function notesCard(ctx) {
    var out = [];
    var notes = U.arr(ctx.prog.dayNotes).filter(function (n) { return n.day === ctx.idx; });
    var note = notes.filter(function (n) { return !n.phase || n.phase === ctx.row.phaseId; })[0] || (notes.length === 1 && !notes[0].phase ? notes[0] : null);
    if (note) out.push('<p class="day-note">' + esc(note.text) + '</p>');
    var q = U.arr(A.dx().quotes).filter(function (x) { return x.day === ctx.idx; })[0];
    if (q && ctx.prog.id === 'detox-primavera-21') {
      var who = q.attribution === 'verificada' ? q.author : q.attribution === 'popular' ? 'dicho popular' : 'atribuida a ' + q.author;
      out.push('<figure class="quote"><blockquote>' + esc(q.text) + '</blockquote><figcaption>— ' + esc(who) + (q.theme ? ' · ' + esc(q.theme) : '') + '</figcaption></figure>');
    }
    var tom = tomorrow(ctx);
    if (tom.length) out.push('<h3 class="mt">Para mañana</h3><ul class="list">' + tom.join('') + '</ul>');
    if (!out.length) return '';
    return '<section class="card notes" aria-label="Nota del día">' + out.join('') + '</section>';
  }
  function tomorrow(ctx) {
    var list = [];
    if (!ctx.iso) return list;
    var t = U.addDays(ctx.iso, 1);
    var ids = L.planEntries(ctx.p.plan, t, t).map(function (e) { return e.recipeId; });
    L.soaksForRecipes(ids, ctx.p).forEach(function (s) {
      list.push('<li class="li">' + I('frasco') + '<span class="grow"><b>Remojar ' + esc(s.soak.name.toLowerCase()) + '</b><span class="meta">' + esc(s.soak.label || (s.soak.optH + ' h')) + ' · ' + (s.soak.discardWater ? 'descartar el agua' : 'no descartar el agua') + '</span></span><a class="btn ghost sm" href="#/cocina/remojos">Ver</a></li>');
    });
    var next = ctx.sum.days[ctx.idx + 1];
    if (next && next.phaseId !== ctx.row.phaseId) list.push('<li class="li">' + I('hoja') + '<span class="grow"><b>Mañana empieza: ' + esc(L.phase(ctx.prog, next.phaseId).name) + '</b><span class="meta">' + esc(L.phase(ctx.prog, next.phaseId).desc || '') + '</span></span></li>');
    var fer = U.arr(A.dx().prep && A.dx().prep.ferments);
    U.arr(ctx.p.ferments).forEach(function (f) {
      if (f.deleted) return;
      var def = fer.filter(function (x) { return x.id === f.recipe || x.recipe === f.recipe; })[0];
      if (!def) return;
      var d = U.diffDays(U.isoFromTs(f.startedAt), t);
      U.arr(def.milestones).forEach(function (m) { if (m.day === d) list.push('<li class="li">' + I('frasco') + '<span class="grow"><b>Fermento: día ' + d + '</b><span class="meta">' + esc(m.text) + '</span></span></li>'); });
      if (d === def.readyDaysMin) list.push('<li class="li">' + I('chispa') + '<span class="grow"><b>Tu fermento podría estar listo</b><span class="meta">Probalo: entre ' + def.readyDaysMin + ' y ' + def.readyDaysMax + ' días.</span></span></li>');
    });
    return list;
  }

  /* ---------- estados especiales ---------- */
  function welcome(ctx) {
    var progs = L.allPrograms(A.P());
    var sel = A.ui.wProg || (ctx ? ctx.prog.id : 'detox-primavera-21');
    var prog = L.program(sel, A.P()) || progs[0];
    if (!prog) return K.empty('No hay programas cargados', 'Faltan los datos de la app.', '');
    var mode = A.ui.wMode || (ctx ? ctx.ed.startMode : null) || prog.defaultStartMode;
    var today = A.today();
    var opts = U.startChoices(today).map(function (o) { return [o[0], o[0], o[1]]; });
    var dsel = A.ui.wDate || today;
    var modes = U.arr(prog.startModes);
    return '<section class="welcome card">' + '<div class="welcome-art">' + K.plant(0, 120) + '</div>' +
      '<h1>' + (ctx ? 'Elegí cuándo empezar' : 'Empezá tu programa') + '</h1><p class="muted">' + (ctx ? 'Tu edición importada no tiene una fecha válida. Elegila y seguimos.' : 'Un paso por vez: elegí el programa, la fecha y cómo arrancar. Podés cambiarlo después.') + '</p>' +
      (ctx ? '' : '<label class="field"><span>Programa</span><select class="input" data-change="wProg">' + progs.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === prog.id ? ' selected' : '') + '>' + esc(x.name + (x.days ? ' · ' + x.days + ' días' : '')) + '</option>'; }).join('') + '</select></label>') +
      '<p class="label">Fecha de inicio</p><div class="chips">' + opts.map(function (o) { return '<button class="chip' + (dsel === o[2] ? ' on' : '') + '" data-action="wDate" data-d="' + o[2] + '" aria-pressed="' + (dsel === o[2]) + '">' + o[1] + ' <span class="meta">' + U.fmtDate(o[2], 'short') + '</span></button>'; }).join('') + '</div>' +
      '<label class="field mt-s"><span class="sr-only">Otra fecha</span><input type="date" class="input" data-change="wDateInput" value="' + esc(dsel) + '" aria-label="Elegir otra fecha"></label>' +
      (modes.length > 1 ? '<p class="label">Cómo empezar</p><div class="stack-s">' + modes.map(function (m) { return '<label class="check"><input type="radio" name="wmode" value="' + esc(m.id) + '" data-change="wMode"' + (m.id === mode ? ' checked' : '') + '><span>' + esc(m.label) + '</span></label>'; }).join('') + '</div>' : '') +
      '<div class="btn-row mt"><button class="btn primary" data-action="startEdition">' + I('planta', 'sm') + (ctx ? 'Guardar fecha' : 'Empezar') + '</button><a class="btn ghost" href="#/programas">Ver programas</a></div>' +
      K.healthNote() + '</section>';
  }
  A.changes.wProg = function (el) { A.ui.wProg = el.value; A.ui.wMode = null; A.render(); };
  A.changes.wMode = function (el) { A.ui.wMode = el.value; };
  A.actions.wDate = function (el) { A.ui.wDate = el.dataset.d; A.render(); };
  A.changes.wDateInput = function (el) { if (U.isValidISO(el.value)) { A.ui.wDate = el.value; A.render(); } };
  A.actions.startEdition = function () {
    var ed = A.ED();
    var date = A.ui.wDate || A.today();
    if (ed && !U.isValidISO(ed.startDate)) {
      A.update(function (s, p) { var e = p.editions[ed.id]; e.startDate = date; e.startMode = A.ui.wMode || e.startMode; e.status = 'active'; e.updatedAt = Date.now(); });
    } else {
      var progId = A.ui.wProg || 'detox-primavera-21';
      var prog = L.program(progId, A.P());
      A.startEdition(progId, date, A.ui.wMode || prog.defaultStartMode);
    }
    A.ui.wDate = A.ui.wProg = A.ui.wMode = null;
    A.toast(date === A.today() ? 'Arrancamos. Día 1: hoy.' : 'Listo: empezás el ' + U.fmtDate(date) + '.');
    A.go('/hoy');
  };
  /* Crea una edición nueva (archiva la activa si existe) */
  A.startEdition = function (programId, date, mode) {
    A.update(function (s, p) {
      var cur = p.activeEdition && p.editions[p.activeEdition];
      if (cur && cur.status !== 'done') { cur.status = 'archived'; cur.closedAt = Date.now(); cur.updatedAt = Date.now(); }
      var e = L.newEdition(programId, date, mode, Date.now());
      p.editions[e.id] = e; p.activeEdition = e.id;
    }, { meta: true });
  };

  function countdown(ctx) {
    var c = ctx.clock;
    var start = ctx.ed.startDate;
    // calendario de descenso de cafeína: a la mitad cada 2 días
    var steps = [[6, 'Tomá la mitad de tu cafeína o mate de siempre'], [4, 'Bajá otra vez a la mitad (un cuarto)'], [2, 'Solo un poquito, o ya nada'], [0, 'Día 1: sin estimulantes']];
    var cal = steps.map(function (s) {
      var d = U.addDays(start, -s[0]);
      var past = d < A.today(), isToday = d === A.today();
      return '<li class="li' + (past ? ' muted' : '') + '"><span class="tag ' + (isToday ? 'bloom' : '') + '">' + U.fmtDate(d, 'day') + '</span><span class="grow">' + esc(s[1]) + '</span></li>';
    }).join('');
    var d1 = L.planEntries(ctx.p.plan, start, U.addDays(start, 2)).map(function (e) { return e.recipeId; });
    var soaks = L.soaksForRecipes(d1, ctx.p);
    return '<section class="card tint countdown"><div class="row"><div class="grow"><h2>Faltan ' + U.plural(c.daysUntil, 'día') + '</h2><p>Empezás el ' + esc(U.fmtDate(start, 'long')) + '.</p></div><span class="big-count num" aria-hidden="true">' + c.daysUntil + '</span></div>' +
      '<h3 class="mt">Bajar la cafeína de a poco</h3><ul class="list">' + cal + '</ul>' +
      '<div class="btn-row mt"><a class="btn" href="#/compras/base">' + I('compras', 'sm') + 'Compras iniciales</a><a class="btn" href="#/cocina/plan">' + I('calendario', 'sm') + 'Planificar la primera semana</a>' + (soaks.length ? '<a class="btn" href="#/cocina/remojos">' + I('frasco', 'sm') + U.plural(soaks.length, 'remojo') + ' para empezar</a>' : '') + '</div></section>';
  }

  function closingCard(ctx) {
    var s = ctx.sum;
    return '<section class="card bloom closing"><div class="row"><div class="grow"><h2>Terminaste ' + esc(ctx.prog.name) + '</h2><p>Tu edición en números:</p></div>' + K.plant(K.plantStage(s), 90) + '</div>' +
      '<div class="stats"><div class="stat"><b>' + (s.constancy == null ? '—' : Math.round(s.constancy * 100) + ' %') + '</b><span>constancia</span></div><div class="stat"><b>' + s.completeDays + '</b><span>días completos</span></div><div class="stat"><b>' + s.bestStreak + '</b><span>mejor racha</span></div><div class="stat"><b>' + s.recipesTried.all + '</b><span>recetas probadas</span></div></div>' +
      '<div class="btn-row mt"><a class="btn primary" href="#/progreso/informe">' + I('libro', 'sm') + 'Ver informe</a><a class="btn" href="#/progreso/reintro">' + I('hoja', 'sm') + 'Reintroducir alimentos</a><button class="btn" data-action="repeatProgram">' + I('refrescar', 'sm') + 'Repetir programa</button></div></section>';
  }
  A.actions.repeatProgram = function () { var ed = A.ED(); A.go('/programas/' + (ed ? ed.programId : '')); };

  /* ---------- acciones del día ---------- */
  function withDay(fn, part, opts) {
    var ctx = A.dayCtx(A.route);
    if (!ctx || !ctx.editable) return;
    var before = ctx.sum.badges.filter(function (b) { return b.unlocked; }).map(function (b) { return b.id; });
    var wasComplete = ctx.row.complete;
    if (part === 'checkin') A.ui.checkinOpen = ctx.ed.id + ':' + ctx.idx;
    A.update(function (s, p) {
      var d = L.ensureDay(p, ctx.ed.id, ctx.idx);
      fn(d, ctx, p);
      L.touchDay(d, part);
    }, opts);
    var after = A.sum();
    var row = after.days[ctx.idx];
    if (row.complete && !wasComplete) { A.confetti(); A.toast(ctx.idx === 0 ? 'Preparación completa.' : 'Día ' + ctx.idx + ' completo.'); }
    after.badges.forEach(function (b) { if (b.unlocked && before.indexOf(b.id) < 0) { A.confetti(); A.toast('Logro: ' + b.title + ' (+' + b.points + ')'); } });
  }
  A.withDay = withDay;
  A.actions.habit = function (el) {
    var h = el.dataset.h;
    withDay(function (d) { if (d.habits[h] === 'done') delete d.habits[h]; else d.habits[h] = 'done'; }, 'habits');
  };
  A.actions.habitSkip = function (el) {
    var h = el.dataset.h;
    withDay(function (d) { if (d.habits[h] === 'skip') delete d.habits[h]; else d.habits[h] = 'skip'; }, 'habits');
  };
  A.actions.toggleDesc = function () { A.ui.descOpen = !A.ui.descOpen; A.render(); };
  A.actions.habitTip = function (el) { A.ui.tip = A.ui.tip === el.dataset.h ? null : el.dataset.h; A.render(); };
  A.actions.water = function (el) { var ml = +el.dataset.ml; withDay(function (d) { d.water.push({ t: Date.now(), ml: ml }); }, 'water'); };
  A.actions.waterUndo = function () { withDay(function (d) { d.water.pop(); }, 'water'); };
  A.actions.waterGoal = function () {
    var p = A.P(), cur = L.waterGoal(p, A.PROG());
    A.openSheet({ title: 'Meta de agua', body: '<form data-submit="waterGoalSave"><label class="field"><span>Mililitros por día</span><input class="input" name="ml" type="number" min="500" max="6000" step="50" value="' + cur + '" inputmode="numeric"></label><p class="meta">La guía sugiere agua tibia a lo largo del día. Ajustala a tu cuerpo y al clima.</p><button class="btn primary">Guardar</button></form>', focus: 'input' });
  };
  A.actions.waterGoalSave = function (f) {
    var v = Math.max(500, Math.min(6000, Math.round(+f.ml.value || 2000)));
    A.update(function (s, p) { p.settings.waterGoalMl = v; }, { settings: true });
    A.closeDialog();
  };
  A.actions.mealToggle = function (el) {
    var slot = el.dataset.slot, id = el.dataset.id;
    withDay(function (d) { d.meals[slot].forEach(function (m) { if (m.id === id) { m.done = !m.done; m.u = Date.now(); } }); }, 'meals');
  };
  A.actions.mealDelete = function (el) {
    var slot = el.dataset.slot, id = el.dataset.id, name = '';
    withDay(function (d) { d.meals[slot].forEach(function (m) { if (m.id === id) { m.deleted = true; m.u = Date.now(); name = m.name; } }); }, 'meals');
    A.toast('Quitaste «' + name + '»', { action: { label: 'Deshacer', fn: function () { withDay(function (d) { d.meals[slot].forEach(function (m) { if (m.id === id) { delete m.deleted; m.u = Date.now(); } }); }, 'meals'); } } });
  };
  function addMeal(slot, name, recipeId, done) {
    withDay(function (d, ctx) { d.meals[slot] = d.meals[slot] || []; d.meals[slot].push({ id: U.uid('m'), name: name, recipeId: recipeId || null, done: done !== false, t: Date.now(), u: Date.now() }); }, 'meals');
  }
  A.addMealToday = function (slot, recipe) {
    var p = A.P(), ed = A.ED(); if (!ed) return false;
    var c = L.clock(ed, A.PROG(), A.today());
    if (c.status === 'nodate') return false;
    var idx = c.status === 'future' ? 0 : c.idx;
    A.update(function (s, p2) { var d = L.ensureDay(p2, ed.id, idx); d.meals[slot] = d.meals[slot] || []; d.meals[slot].push({ id: U.uid('m'), name: recipe.title, recipeId: recipe.id, done: true, t: Date.now(), u: Date.now() }); L.touchDay(d, 'meals'); });
    return true;
  };
  A.actions.mealAddRecipe = function (el) {
    var r = L.recipe(el.dataset.r, A.P()); if (!r) return;
    addMeal(el.dataset.slot, r.title, r.id, true);
    A.closeDialog();
  };
  A.actions.mealAddSheet = function (el) {
    var slot = el.dataset.slot, ctx = A.dayCtx(A.route);
    var lab = (L.idx().slots[slot] || {}).label || slot;
    var sug = L.suggest({ profile: ctx.p, editionId: ctx.ed.id, program: ctx.prog, phaseId: ctx.row.phaseId, slot: slot, dayIdx: ctx.idx, dateISO: ctx.iso, n: 4 });
    A.openSheet({
      title: 'Agregar al ' + lab.toLowerCase(),
      body: '<form data-submit="mealAddFree" data-slot="' + slot + '"><div class="search">' + I('buscar') + '<input class="input" id="meal-q" name="q" data-bind="mealSearch" data-slot="' + slot + '" placeholder="Buscá una receta o escribí lo que comiste" autocomplete="off" aria-describedby="meal-hint"></div><p class="meta" id="meal-hint">Enter registra el texto como comida libre.</p></form>' +
        '<div id="meal-results" aria-live="polite"></div>' +
        '<h3 class="mt">Sugerencias para hoy</h3>' + (sug.length ? '<ul class="list">' + sug.map(function (x) { return resultRow(slot, x.recipe, x.reason, ctx.p); }).join('') + '</ul>' : '<p class="muted">No hay sugerencias aptas para tu perfil en esta fase.</p>') +
        (ctx.row.phaseId === 'monodieta' ? '<p class="note mt">En monodieta la guía indica solo las preparaciones permitidas de la fase.</p>' : ''),
      focus: '#meal-q'
    });
  };
  function resultRow(slot, r, reason, p) {
    return '<li><button class="li" data-action="mealAddRecipe" data-slot="' + slot + '" data-r="' + esc(r.id) + '"><span class="grow"><b>' + esc(r.title) + '</b><span class="meta">' + esc(reason || L.categoryLabel(r.category)) + '</span> ' + K.allergenTags(r, p) + '</span>' + I('mas', 'chev') + '</button></li>';
  }
  A.binds.mealSearch = function (el) {
    var q = el.value, slot = el.dataset.slot, p = A.P();
    var box = document.getElementById('meal-results');
    if (U.norm(q).length < 2) { box.innerHTML = ''; return; }
    var res = L.allRecipes(p).filter(function (r) { return U.matchQuery(r.title + ' ' + L.categoryLabel(r.category) + ' ' + U.arr(r.ingredients).map(function (i) { return i.text; }).join(' '), q); }).slice(0, 12);
    box.innerHTML = '<ul class="list">' + res.map(function (r) { return resultRow(slot, r, null, p); }).join('') +
      '<li><button class="li" data-action="mealAddFreeBtn" data-slot="' + slot + '"><span class="grow"><b>Registrar «' + esc(q.trim()) + '»</b><span class="meta">como comida libre</span></span>' + I('mas', 'chev') + '</button></li></ul>';
  };
  A.actions.mealAddFree = function (f) {
    var q = f.q.value.trim(); if (!q) return;
    addMeal(f.dataset.slot, q, null, true); A.closeDialog();
  };
  A.actions.mealAddFreeBtn = function (el) {
    var q = document.getElementById('meal-q').value.trim(); if (!q) return;
    addMeal(el.dataset.slot, q, null, true); A.closeDialog();
  };

  A.actions.checkin = function (el) {
    var f = el.dataset.f, v = f === 'digestion' ? el.dataset.v : +el.dataset.v;
    withDay(function (d) { d.checkin[f] = d.checkin[f] === v ? null : v; }, 'checkin');
  };
  A.actions.symptom = function (el) {
    var s = el.dataset.s;
    var ex = U.arr(L.tx().symptoms).filter(function (x) { return x.exclusive; }).map(function (x) { return x.id; });
    withDay(function (d) {
      var list = d.checkin.symptoms;
      var i = list.indexOf(s);
      if (i > -1) list.splice(i, 1);
      else if (ex.indexOf(s) > -1) { d.checkin.symptoms = [s]; d.checkin.customSymptoms = []; }
      else { d.checkin.symptoms = list.filter(function (x) { return ex.indexOf(x) < 0; }); d.checkin.symptoms.push(s); }
    }, 'checkin');
  };
  A.actions.customSymptomAdd = function (f) {
    var v = f.s.value.trim(); if (!v) return;
    withDay(function (d) { if (d.checkin.customSymptoms.indexOf(v) < 0) d.checkin.customSymptoms.push(v); }, 'checkin');
  };
  A.actions.customSymptomDel = function (el) { var v = el.dataset.s; withDay(function (d) { d.checkin.customSymptoms = d.checkin.customSymptoms.filter(function (x) { return x !== v; }); }, 'checkin'); };
  A.binds.checkinNotes = function (el) {
    var ctx = A.dayCtx(A.route); if (!ctx || !ctx.editable) return;
    A.update(function (s, p) { var d = L.ensureDay(p, ctx.ed.id, ctx.idx); d.checkin.notes = el.value; L.touchDay(d, 'checkin'); }, { render: false });
  };
  A.actions.checkinOpen = function () { var ctx = A.dayCtx(A.route); A.ui.checkinOpen = ctx.ed.id + ':' + ctx.idx; A.render(); var t = document.getElementById('h-checkin'); t && t.scrollIntoView({ block: 'start' }); };
  A.actions.checkinClose = function () { A.ui.checkinOpen = null; A.render(); };
})(typeof window !== 'undefined' ? window : globalThis);
