/* Detox v2 — pantalla «Hoy» (v2.3 «Un paso a la vez»): día, línea de días, un hábito a la vez y renglones que abren hojas. */
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

  /* ---------- render (v2.3 «Un paso a la vez») ----------
     Celular: fecha y día · línea de N tramos · tarjeta «Ahora» · renglones tranquilos.
     Computadora (≥ 960 px): la misma grilla en dos columnas (día + foco | línea + renglones). */
  A.screens.hoy = {
    render: function (route) {
      var p = A.P();
      if (!p) return '';
      var ed = A.ED();
      if (!ed) return welcome(null);
      var ctx = A.dayCtx(route);
      if (!ctx || !ctx.prog) return '<p class="calm-note">No encontramos el programa de esta edición. <a href="#/programas">Elegí otro programa</a>.</p>';
      if (ctx.nodate) return welcome(ctx);
      // Programa terminado y sin un día elegido: no hay foco, va la tarjeta de cierre.
      ctx.finishedHome = ctx.clock.status === 'finished' && !(route.parts[0] && U.isValidISO(route.parts[0]));
      var note = '';
      if (ctx.editable && ctx.idx !== ctx.todayIdx && ctx.clock.status === 'active') note = '<p class="calm-note">' + I('editar', 'sm') + '<span>Estás completando un día anterior. La racha y la constancia se calculan siempre con la fecha de hoy. <a href="' + dayHref(ctx.ed, ctx.todayIdx) + '">Volver a hoy</a></span></p>';
      return '<div class="hoy-a' + (ctx.finishedHome ? ' is-finished' : '') + '">' +
        '<div class="a-head">' + dayHead(ctx) + '</div>' +
        '<div class="a-line">' + dayLine(ctx) + '</div>' +
        '<div class="a-focus">' + note + (ctx.finishedHome ? closingCard(ctx) : focusCard(ctx)) + '</div>' +
        (ctx.finishedHome ? '' : '<div class="a-rows">' + quietRows(ctx) + '</div>') +
        (ctx.clock.status === 'future' && ctx.idx === 0 ? '<div class="a-extra">' + countdown(ctx) + '</div>' : '') +
        '</div>';
    },
    mount: function (main) {
      // Al marcar el último hábito desaparece «Hecho»: el foco pasa a «N de M · ver todos» (no cae al body).
      if (A.ui.focusAfter) {
        A.ui.focusAfter = false;
        var t = main.querySelector('#focus-done') || main.querySelector('#focus-more');
        if (t) t.focus({ preventScroll: true });
      }
    }
  };
  function noYear(t) { return String(t || '').replace(' de ' + A.today().slice(0, 4), ''); }

  /* ---------- encabezado: fecha, «Día N de M» grande y liviano, fase en coral ---------- */
  function dayHead(ctx) {
    var futurePrep = ctx.clock.status === 'future' && ctx.idx === 0;
    var isToday = (ctx.idx === ctx.todayIdx && ctx.clock.status === 'active') || futurePrep || ctx.finishedHome;
    var iso = futurePrep || ctx.finishedHome ? A.today() : ctx.iso;
    var big = ctx.finishedHome ? '<span class="num">Terminado</span><small> ' + ctx.clock.days + ' días</small>' : ctx.idx === 0 ? '<span class="num">Preparación</span>' : '<span class="num">Día ' + ctx.idx + '</span><small> de ' + ctx.clock.days + '</small>';
    var desc = ctx.phase.desc;
    var head = '<header class="day-head">' +
      '<p class="day-date">' + esc(iso ? noYear(U.cap(U.fmtDate(iso, 'long'))) : '') + (isToday ? ' · hoy' : '') + '</p>' +
      '<h1 class="day-big">' + big + '</h1>';
    if (futurePrep) {
      var st = noYear(U.fmtDate(ctx.ed.startDate, 'long'));
      return head + '<p class="day-phase">Empezás el ' + esc(st.charAt(0).toLowerCase() + st.slice(1)) + ' · ' + (ctx.clock.daysUntil === 1 ? 'falta 1 día' : 'faltan ' + ctx.clock.daysUntil + ' días') + '</p></header>';
    }
    if (ctx.finishedHome) return head + '<p class="day-phase">' + esc(ctx.prog.name) + '</p></header>';
    return head +
      (desc ? '<button class="day-phase ph-' + esc(ctx.row.phaseId) + '" data-action="toggleDesc" aria-expanded="' + !!A.ui.descOpen + '">' + esc(ctx.phase.name) + '</button>' +
        (A.ui.descOpen ? '<p class="day-desc">' + esc(desc) + '</p>' : '')
        : '<p class="day-phase ph-' + esc(ctx.row.phaseId) + '">' + esc(ctx.phase.name) + '</p>') +
      '</header>';
  }

  /* ---------- línea de N tramos (reemplaza la tira de días): tocar un tramo lleva a ese día ---------- */
  var ST_LABEL = { complete: 'completo', grace: 'día de gracia', partial: 'parcial', empty: 'sin completar', today: 'en curso', future: 'por venir' };
  function dayLine(ctx) {
    var s = ctx.sum;
    var segs = s.days.map(function (r) {
      var cls = 'sg sg-' + r.status + (r.idx === 0 ? ' prep' : '') + (r.idx === ctx.idx ? ' on' : '') + (r.idx === ctx.todayIdx && ctx.clock.status !== 'finished' ? ' today' : '');
      var lab = (r.idx === 0 ? 'Preparación' : 'Día ' + r.idx) + (r.iso ? ', ' + U.fmtDate(r.iso) : '') + (r.idx === ctx.todayIdx && ctx.clock.status !== 'finished' ? ' (hoy)' : '') + ' — ' + ST_LABEL[r.status] + (r.graced && r.status === 'partial' ? ', cubierto por un día de gracia' : '');
      // La preparación solo aparece si hay algo que mirar ahí (programa por empezar o día con registros).
      if (r.idx === 0 && !(ctx.clock.status === 'future' || ctx.idx === 0 || L.dayHasData(r.day))) return '';
      return '<a class="' + cls + '" href="' + dayHref(ctx.ed, r.idx) + '" aria-label="' + esc(lab) + '" title="' + esc(lab) + '"' + (r.idx === ctx.idx ? ' aria-current="date"' : '') + '></a>';
    }).join('');
    var bits = [];
    if (s.constancy != null) bits.push(Math.round(s.constancy * 100) + ' % de constancia');
    if (s.streak) bits.push(s.streak === 1 ? '1 día seguido' : s.streak + ' días seguidos');
    else if (ctx.clock.status === 'active' && 2 - s.graceUsed > 0 && ctx.todayIdx > 1) bits.push('te quedan ' + U.plural(2 - s.graceUsed, 'día') + ' de gracia');
    return '<div class="days-n"><p class="lab">Tus ' + ctx.clock.days + ' días</p>' +
      '<nav class="line21" aria-label="Días de la edición">' + segs + '</nav>' +
      (bits.length ? '<p class="streak"><span>' + esc(bits[0]) + '</span>' + (bits[1] ? '<span>' + esc(bits[1]) + '</span>' : '') + '</p>' : '') + '</div>';
  }

  /* ---------- tarjeta foco «Ahora»: el próximo hábito pendiente, un paso a la vez ---------- */
  function habitState(ctx, h) { var day = ctx.row.day; return day && day.habits ? day.habits[h.id] : null; }
  function condName(c) { var x = L.idx().conditions[c]; return x ? x.label.split(' (')[0].toLowerCase() : c; }
  function focusCard(ctx) {
    var hs = ctx.row.habits, conds = ctx.p.settings.conditions || [];
    if (!hs.length) return '<section class="focus-card" aria-label="Hábitos"><p class="focus-q">Este programa no tiene hábitos para esta fase.</p></section>';
    var next = hs.filter(function (h) { return !habitState(ctx, h); })[0] || null;
    var mode = ctx.clock.status === 'future' && ctx.idx === 0 ? 'prep' : !ctx.editable ? 'future' : (ctx.idx === ctx.todayIdx && ctx.clock.status === 'active') ? 'now' : 'past';
    var KLAB = { prep: 'Para prepararte', now: ctx.idx === 0 ? 'Para prepararte' : 'Ahora', past: 'Pendiente de ese día', future: 'Por venir' };
    var dis = ctx.editable ? '' : ' disabled';
    var body;
    if (mode === 'future') {
      body = '<p class="focus-k">Por venir</p><h2 class="focus-q">Este día todavía no llegó.</h2>' +
        '<p class="focus-sub">Tiene ' + U.plural(hs.length, 'hábito') + '. Podés planificar sus comidas desde <a href="#/cocina/plan">Cocina › Plan</a>.</p>';
      next = null;
    } else if (next) {
      var warn = L.habitWarnings(next, conds);
      body = '<p class="focus-k">' + KLAB[mode] + '</p>' +
        '<h2 class="focus-q">' + esc(next.text) + '</h2>' +
        (warn.length ? '<p class="focus-warn">' + I('alerta', 'sm') + '<span>Consultá antes: ' + esc(warn.map(condName).join(', ')) + (next.warn ? '. ' + esc(warn.map(function (c) { return next.warn[c] || ''; }).filter(Boolean).join(' ')) : '') + '</span></p>' : '') +
        '<div class="focus-acts"><button class="pill pri" id="focus-done" data-action="habit" data-h="' + esc(next.id) + '"' + dis + '>' + I('check', 'sm') + 'Hecho</button>' +
        '<button class="pill ghost" id="focus-skip" data-action="habitSkip" data-h="' + esc(next.id) + '"' + dis + '>Hoy no</button></div>' +
        (next.tip ? '<button class="focus-why" data-action="habitTip" data-h="' + esc(next.id) + '" aria-expanded="' + (A.ui.tip === next.id) + '">¿Por qué?</button>' + (A.ui.tip === next.id ? '<p class="focus-tip">' + esc(next.tip) + '</p>' : '') : '');
    } else {
      var past = mode === 'past';
      body = '<p class="focus-k">' + (ctx.row.complete ? 'Listo' : past ? 'Ese día' : 'Por hoy') + '</p>' +
        '<h2 class="focus-q">' + (ctx.row.complete ? (ctx.idx === 0 ? 'Preparación completa.' : past ? 'Ese día quedó completo.' : 'Día completo. Bien ahí.') : past ? 'Ya miraste todos los hábitos de ese día.' : 'Ya miraste todos los hábitos de hoy.') + '</h2>' +
        (!ctx.row.complete ? '<p class="focus-sub">Los que marcaste «hoy no» quedan registrados a conciencia.</p>' : '');
    }
    var dots = '<div class="dots" aria-hidden="true">' + hs.map(function (h) {
      var st = habitState(ctx, h);
      return '<i class="' + (st === 'done' ? 'on' : st === 'skip' ? 'skip' : next && h.id === next.id ? 'now' : '') + '"></i>';
    }).join('') + '</div>';
    var open = !!A.ui.allHabits;
    return '<section class="focus-card" aria-label="' + (ctx.idx === 0 ? 'Para prepararte' : 'Hábitos del día') + '">' + body + dots +
      '<button class="focus-more" id="focus-more" data-action="toggleAllHabits" aria-expanded="' + open + '" aria-controls="h-habitos">' + ctx.row.done + ' de ' + ctx.row.total + ' · ' + (open ? 'ocultar' : 'ver todos') + '</button>' +
      (open ? habitsList(ctx) : '') + '</section>';
  }
  A.actions.toggleAllHabits = function () { A.ui.allHabits = !A.ui.allHabits; A.render(); };

  /* Lista completa (se despliega desde la tarjeta): tips y avisos por condición. */
  function habitsList(ctx) {
    var conds = ctx.p.settings.conditions || [];
    var dis = ctx.editable ? '' : ' disabled';
    return '<ul class="list habits" id="h-habitos" tabindex="-1">' + ctx.row.habits.map(function (h) {
      var st = habitState(ctx, h);
      var warn = L.habitWarnings(h, conds);
      var warnTxt = warn.length ? '<span class="tag warn">' + I('alerta', 'sm') + 'Consultá: ' + esc(warn.map(condName).join(', ')) + '</span>' : '';
      return '<li class="habit' + (st === 'done' ? ' is-done' : st === 'skip' ? ' is-skip' : '') + '">' +
        '<button class="habit-main" data-action="habit" data-h="' + esc(h.id) + '" aria-pressed="' + (st === 'done') + '"' + dis + '><span class="tick">' + I('check') + '</span><span class="grow"><span class="h-t">' + esc(h.text) + '</span>' + (st === 'skip' ? '<span class="meta">Hoy no, a conciencia</span>' : '') + warnTxt + '</span></button>' +
        '<div class="habit-side">' + (h.tip ? '<button class="icon-btn sm" data-action="habitTip" data-h="' + esc(h.id) + '" aria-expanded="' + (A.ui.tip === h.id) + '" aria-label="Por qué: ' + esc(h.text) + '">' + I('info', 'sm') + '</button>' : '') +
        (ctx.editable && st !== 'done' ? '<button class="btn ghost sm" data-action="habitSkip" data-h="' + esc(h.id) + '">' + (st === 'skip' ? 'Deshacer' : 'Hoy no') + '</button>' : '') + '</div>' +
        (A.ui.tip === h.id && h.tip ? '<p class="habit-tip">' + esc(h.tip) + '</p>' : '') + (warn.length && h.warn ? warn.map(function (c) { return h.warn[c] ? '<p class="habit-tip warn-tip">' + I('alerta', 'sm') + ' ' + esc(h.warn[c]) + '</p>' : ''; }).join('') : '') + '</li>';
    }).join('') + '</ul>';
  }

  /* ---------- renglones tranquilos: se abren en hoja (celular) o panel lateral (computadora) ---------- */
  function qrow(kind, icon, title, small, extra) {
    return '<div class="qrow"><button class="qrow-main" data-action="openLive" data-k="' + kind + '" aria-haspopup="dialog">' + I(icon) +
      '<span class="grow"><span class="t">' + esc(title) + '</span>' + (small ? '<small>' + small + '</small>' : '') + '</span>' + (extra ? '' : I('chev', 'sm chev')) + '</button>' + (extra || '') + '</div>';
  }
  function quietRows(ctx) {
    var out = [];
    var total = ctx.row.water, goal = ctx.sum.waterGoal;
    out.push(qrow('water', 'agua', 'Agua', total + ' de ' + goal + ' ml',
      '<button class="plus" data-action="water" data-ml="250" aria-label="Sumar 250 ml de agua"' + (ctx.editable ? '' : ' disabled') + '>' + I('mas', 'sm') + '</button>'));
    out.push(qrow('meals', 'bowl', 'Comidas', esc(mealSummary(ctx))));
    out.push(qrow('checkin', 'hoja', '¿Cómo te sentís?', esc(checkinSummary(ctx))));
    var tom = tomorrowItems(ctx);
    if (tom.length) out.push(qrow('tomorrow', 'frasco', 'Para mañana', esc(tom[0].title + (tom.length > 1 ? ' y ' + U.plural(tom.length - 1, 'cosa', 'cosas') + ' más' : ''))));
    var dn = dayNote(ctx);
    if (dn.note || dn.quote) out.push(qrow('note', 'libro', 'Nota del día', esc(cut(dn.note || dn.quote.text, 72))));
    return '<div class="qrows">' + out.join('') + '</div>';
  }
  var SLOT_FEM = { merienda: true, cena: true };
  /* Etiquetas cortas para la hoja «¿Cómo te sentís?» (los ids guardados no cambian). */
  var DIG_SHORT = { liviano: 'Liviana', gases: 'Gases', lenta: 'Lenta', optima: 'Óptima' };
  var SYM_SHORT = { cefalea: 'Cefalea', sed_intensa: 'Sed', frio_extremidades: 'Frío', nauseas: 'Náuseas', despejado: 'Ninguna', diarrea: 'Diarrea', acidez: 'Acidez', mareos: 'Mareos', hinchazon: 'Hinchazón' };
  function digShort(x) { return DIG_SHORT[x.id] || String(x.label).split(' /')[0]; }
  function symShort(x) { return SYM_SHORT[x.id] || String(x.label).split(' /')[0]; }
  function cut(t, n) { t = String(t || ''); return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t; }
  function mealSummary(ctx) {
    var slots = L.slots(), day = ctx.row.day;
    var done = slots.filter(function (s) { return L.mealItems(day, s.id).some(function (m) { return m.done; }); });
    var bits = [];
    if (done.length === slots.length) return 'Los ' + slots.length + ' momentos registrados';
    if (done.length) bits.push(done.map(function (s) { return s.label.toLowerCase(); }).join(', ').replace(/^./, function (c) { return c.toUpperCase(); }) + (done.length === 1 ? ' listo' : ' listos'));
    var nextSlot = slots.filter(function (s) { return !L.mealItems(day, s.id).length; })[0];
    if (nextSlot) {
      var planned = U.arr(ctx.iso && ctx.p.plan[ctx.iso] && ctx.p.plan[ctx.iso][nextSlot.id]).map(function (rid) { return L.recipe(rid, ctx.p); }).filter(Boolean)[0];
      if (planned) bits.push(nextSlot.label.toLowerCase() + ' del plan: ' + planned.title.toLowerCase());
      else if (ctx.editable) {
        var sg = L.suggest({ profile: ctx.p, editionId: ctx.ed.id, program: ctx.prog, phaseId: ctx.row.phaseId, slot: nextSlot.id, dayIdx: ctx.idx, dateISO: ctx.iso, n: 1 })[0];
        if (sg) bits.push(nextSlot.label.toLowerCase() + (SLOT_FEM[nextSlot.id] ? ' sugerida: ' : ' sugerido: ') + sg.recipe.title.toLowerCase());
      }
    }
    var txt = bits.join(' · ');
    return txt ? txt.charAt(0).toUpperCase() + txt.slice(1) : 'Sin registrar';
  }
  function levelLabel(list, v) { return (U.arr(list).filter(function (x) { return x.v === Number(v); })[0] || {}).label || v; }
  function checkinSummary(ctx) {
    var tx = L.tx(), c = (ctx.row.day && ctx.row.day.checkin) || {};
    if (!L.hasCheckin(ctx.row.day)) return ctx.editable ? 'Todavía sin registrar' : 'Se completa ese día';
    var bits = [];
    if (c.energy) bits.push('Energía ' + String(levelLabel(tx.energyLevels, c.energy)).split(' /')[0].toLowerCase());
    if (c.mood) bits.push('ánimo ' + String(levelLabel(tx.moodLevels, c.mood)).split(' /')[0].toLowerCase());
    if (c.digestion) { var dg = U.arr(tx.digestionStates).filter(function (x) { return x.id === c.digestion; })[0]; bits.push('digestión ' + (dg ? digShort(dg) : c.digestion).toLowerCase()); }
    var n = U.arr(c.symptoms).length + U.arr(c.customSymptoms).length;
    if (n) bits.push(U.plural(n, 'señal', 'señales'));
    var t = bits.join(' · ') || 'Con una nota';
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  /* ---------- hojas vivas de Hoy ---------- */
  function hoyCtx() { if (A.route.name !== 'hoy') return null; var c = A.dayCtx(A.route); return c && !c.nodate ? c : null; }
  A.live.water = {
    title: 'Agua',
    body: function () {
      var ctx = hoyCtx(); if (!ctx) return null;
      var total = ctx.row.water, goal = ctx.sum.waterGoal, ratio = Math.min(1, total / goal);
      var dis = ctx.editable ? '' : ' disabled';
      return '<p class="big-figure"><b class="num">' + total + '</b> <span>de ' + goal + ' ml</span></p>' +
        '<div class="bar-h" style="margin:12px 0 22px"><i style="width:' + Math.round(ratio * 100) + '%"></i></div>' +
        '<div class="btn-row"><button class="btn" data-action="water" data-ml="250"' + dis + '>' + I('mas', 'sm') + '250 ml</button><button class="btn" data-action="water" data-ml="500"' + dis + '>' + I('mas', 'sm') + '500 ml</button>' +
        (ctx.row.day && ctx.row.day.water.length && ctx.editable ? '<button class="btn ghost" data-action="waterUndo" aria-label="Deshacer el último vaso">' + I('deshacer', 'sm') + 'Deshacer</button>' : '') + '</div>' +
        '<p class="meta mt">La guía sugiere agua tibia a sorbitos a lo largo del día.</p>' +
        '<button class="btn ghost sm mt-s" data-action="waterGoal">Meta: ' + (goal / 1000).toString().replace('.', ',') + ' l por día · cambiar</button>' +
        '<p class="sr-only" aria-live="polite">' + total + ' mililitros de ' + goal + '</p>';
    }
  };
  A.live.meals = {
    title: 'Comidas',
    body: function () { var ctx = hoyCtx(); return ctx ? mealsBody(ctx) : null; }
  };
  A.live.checkin = {
    title: '¿Cómo te sentís?',
    body: function () { var ctx = hoyCtx(); return ctx ? checkinBody(ctx) : null; },
    foot: function () { return '<button class="btn primary" data-action="closeDialog" data-dlg="sheet">Listo</button>'; }
  };
  A.live.tomorrow = {
    title: 'Para mañana',
    body: function () {
      var ctx = hoyCtx(); if (!ctx) return null;
      var items = tomorrowItems(ctx);
      if (!items.length) return '<p class="muted">Nada pendiente para mañana.</p>';
      return '<ul class="list">' + items.map(function (x) { return '<li class="li">' + I(x.icon) + '<span class="grow"><b>' + esc(x.title) + '</b>' + (x.meta ? '<span class="meta">' + esc(x.meta) + '</span>' : '') + '</span>' + (x.href ? '<a class="btn ghost sm" href="' + x.href + '">Ver</a>' : '') + '</li>'; }).join('') + '</ul>';
    }
  };
  A.live.note = {
    title: 'Nota del día',
    body: function () {
      var ctx = hoyCtx(); if (!ctx) return null;
      var dn = dayNote(ctx), out = [];
      if (dn.note) out.push('<p class="day-note">' + esc(dn.note) + '</p>');
      if (dn.quote) out.push('<figure class="quote"><blockquote>' + esc(dn.quote.text) + '</blockquote><figcaption>— ' + esc(dn.quote.who) + '</figcaption></figure>');
      return out.join('') || '<p class="muted">Hoy no hay nota.</p>';
    }
  };

  /* ---------- comidas ---------- */
  var SLOT_ICON = { desayuno: 'amanecer', almuerzo: 'sol', merienda: 'taza', cena: 'luna' };
  function mealsBody(ctx) {
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
        // Una sola sugerencia tranquila por momento; el resto, en «ver más opciones».
        sug = L.suggest({ profile: ctx.p, editionId: ctx.ed.id, program: ctx.prog, phaseId: ctx.row.phaseId, slot: s.id, dayIdx: ctx.idx, dateISO: ctx.iso, n: 1 }).map(function (x) {
          return '<button class="sug-line" data-action="mealAddRecipe" data-slot="' + s.id + '" data-r="' + esc(x.recipe.id) + '" aria-label="Agregar ' + esc(x.recipe.title) + ' al ' + esc(s.label.toLowerCase()) + '">' + I('mas', 'sm') + '<span class="grow"><span class="sug-title">' + esc(x.recipe.title) + '</span><small>' + esc(x.reason) + '</small></span></button>';
        }).join('') + '<button class="more-opts" data-action="mealAddSheet" data-slot="' + s.id + '">ver más opciones</button>';
      }
      return '<div class="slot"><div class="slot-h"><h3>' + I(SLOT_ICON[s.id] || 'bowl', 'sm') + ' ' + esc(s.label) + '</h3>' + (ctx.editable ? '<button class="btn ghost sm" data-action="mealAddSheet" data-slot="' + s.id + '">' + I('mas', 'sm') + 'Agregar</button>' : '') + '</div>' +
        (list ? '<ul class="list meals">' + list + '</ul>' : '') + (planChips ? '<div class="chips">' + planChips + '</div>' : '') + (sug ? '<div class="sug-box">' + sug + '</div>' : '') + (!list && !planChips && !sug ? '<p class="meta">Sin registrar.</p>' : '') + '</div>';
    }).join('');
    return body + '<p class="meta mt"><a href="#/cocina/plan">Planificar la semana en Cocina › Plan</a></p>' +
      (ctx.row.phaseId === 'monodieta' ? '<p class="note mt-s">En monodieta la guía indica solo las preparaciones permitidas de la fase.</p>' : '');
  }

  /* ---------- registro «¿Cómo te sentís?» ---------- */
  function checkinBody(ctx) {
    var tx = L.tx(), day = ctx.row.day, c = (day && day.checkin) || {};
    var done = L.hasCheckin(day);
    if (!ctx.editable) {
      if (!done) return '<p class="muted">Se completa ese día.</p>';
      var sy0 = U.arr(c.symptoms).map(function (s) { var x = L.idx().symptoms[s]; return x ? x.label : s; }).concat(U.arr(c.customSymptoms));
      return '<p>' + esc(checkinSummary(ctx)) + '</p>' + (sy0.length ? '<p class="meta">Señales: ' + esc(sy0.join(', ')) + '</p>' : '') + (c.notes ? '<p class="note">' + esc(c.notes) + '</p>' : '');
    }
    // Energía y ánimo: 5 puntos numerados; la etiqueta solo del elegido, debajo.
    function scale(field, list) {
      var name = field === 'energy' ? 'Energía' : 'Ánimo';
      var chosen = U.arr(list).filter(function (x) { return Number(c[field]) === x.v; })[0];
      return '<div class="dots5" role="group" aria-label="' + name + '">' + U.arr(list).map(function (x) {
        var on = Number(c[field]) === x.v;
        return '<button class="d5' + (on ? ' on' : '') + '" data-action="checkin" data-f="' + field + '" data-v="' + x.v + '" aria-pressed="' + on + '" aria-label="' + x.v + ' de 5: ' + esc(x.label.split(' /')[0]) + '">' + x.v + '</button>';
      }).join('') + '</div><p class="d5-lab" aria-hidden="true">' + (chosen ? esc(chosen.label.split(' /')[0]) : '&nbsp;') + '</p>';
    }
    var dig = U.arr(tx.digestionStates).map(function (x) { var on = c.digestion === x.id; return '<button class="chip' + (on ? ' on' : '') + '" data-action="checkin" data-f="digestion" data-v="' + x.id + '" aria-pressed="' + on + '" title="' + esc(x.label) + '">' + esc(digShort(x)) + '</button>'; }).join('');
    var symList = U.arr(tx.symptoms).filter(function (x) { return x.exclusive; }).concat(U.arr(tx.symptoms).filter(function (x) { return !x.exclusive; }));
    var sym = symList.map(function (x) {
      var on = U.arr(c.symptoms).indexOf(x.id) > -1;
      return '<span class="symp"><button class="chip' + (on ? ' on' : '') + '" data-action="symptom" data-s="' + x.id + '" aria-pressed="' + on + '" title="' + esc(x.label) + '">' + esc(symShort(x)) + '</button>' + (on && x.sos && L.idx().sos[x.sos] ? '<a class="sos-link" href="#/guia/sos/' + encodeURIComponent(x.sos) + '">' + I('botiquin', 'sm') + 'SOS</a>' : '') + '</span>';
    }).join('');
    var custom = U.arr(c.customSymptoms).map(function (s) { return '<button class="chip on" data-action="customSymptomDel" data-s="' + esc(s) + '" aria-label="Quitar ' + esc(s) + '">' + esc(s) + I('cerrar', 'sm x') + '</button>'; }).join('');
    return '<div class="checkin" id="h-checkin">' +
      '<p class="label">Energía</p>' + scale('energy', tx.energyLevels) +
      '<p class="label">Ánimo</p>' + scale('mood', tx.moodLevels) +
      '<p class="label">Digestión</p><div class="chips">' + dig + '</div>' +
      '<p class="label mt">Señales</p><div class="chips">' + sym + custom + '</div>' +
      '<form class="row mt-s" data-submit="customSymptomAdd"><input class="input" id="custom-symptom" name="s" placeholder="Otra señal…" aria-label="Agregar otra señal" maxlength="60"><button class="btn sm">Agregar</button></form>' +
      '<label class="field mt"><span>Nota del día</span><textarea class="input" id="checkin-notes" data-bind="checkinNotes" rows="3" placeholder="Cómo dormiste, qué notaste, qué te costó…">' + esc(c.notes || '') + '</textarea></label>' +
      '<p class="meta">Se guarda solo, mientras lo completás.</p></div>';
  }

  /* ---------- nota del día, cita y «para mañana» ---------- */
  function dayNote(ctx) {
    var notes = U.arr(ctx.prog.dayNotes).filter(function (n) { return n.day === ctx.idx; });
    var note = notes.filter(function (n) { return !n.phase || n.phase === ctx.row.phaseId; })[0] || (notes.length === 1 && !notes[0].phase ? notes[0] : null);
    var q = U.arr(A.dx().quotes).filter(function (x) { return x.day === ctx.idx; })[0];
    var quote = null;
    if (q && ctx.prog.id === 'detox-primavera-21') {
      var who = q.attribution === 'verificada' ? q.author : q.attribution === 'popular' ? 'dicho popular' : 'atribuida a ' + q.author;
      quote = { text: q.text, who: who + (q.theme ? ' · ' + q.theme : '') };
    }
    return { note: note ? note.text : null, quote: quote };
  }
  function tomorrowItems(ctx) {
    var list = [];
    if (!ctx.iso) return list;
    // Con el programa por empezar, «mañana» es mañana de verdad (no el día siguiente a la preparación).
    var base = ctx.clock.status === 'future' && ctx.idx === 0 ? A.today() : ctx.iso;
    var t = U.addDays(base, 1);
    var ids = L.planEntries(ctx.p.plan, t, t).map(function (e) { return e.recipeId; });
    L.soaksForRecipes(ids, ctx.p).forEach(function (s) {
      list.push({ icon: 'frasco', title: 'Remojar ' + s.soak.name.toLowerCase(), meta: (s.soak.label || (s.soak.optH + ' h')) + ' · ' + (s.soak.discardWater ? 'descartar el agua' : 'no descartar el agua'), href: '#/cocina/remojos' });
    });
    var next = ctx.sum.days[ctx.idx + 1];
    if (next && next.phaseId !== ctx.row.phaseId && L.dayDate(ctx.ed, ctx.idx + 1) === t) list.push({ icon: 'hoja', title: 'Mañana empieza: ' + L.phase(ctx.prog, next.phaseId).name, meta: L.phase(ctx.prog, next.phaseId).desc || '' });
    var fer = U.arr(A.dx().prep && A.dx().prep.ferments);
    U.arr(ctx.p.ferments).forEach(function (f) {
      if (f.deleted) return;
      var def = fer.filter(function (x) { return x.id === f.recipe || x.recipe === f.recipe; })[0];
      if (!def) return;
      var d = U.diffDays(U.isoFromTs(f.startedAt), t);
      U.arr(def.milestones).forEach(function (m) { if (m.day === d) list.push({ icon: 'frasco', title: 'Fermento: día ' + d, meta: m.text }); });
      if (d === def.readyDaysMin) list.push({ icon: 'chispa', title: 'Tu fermento podría estar listo', meta: 'Probalo: entre ' + def.readyDaysMin + ' y ' + def.readyDaysMax + ' días.' });
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
    return '<section class="welcome">' +
      '<h1>' + (ctx ? 'Elegí cuándo empezar' : 'Empezá tu programa') + '</h1><p class="muted">' + (ctx ? 'Tu edición importada no tiene una fecha válida. Elegila y seguimos.' : 'Un paso por vez: elegí el programa, la fecha y cómo arrancar. Podés cambiarlo después.') + '</p>' +
      (ctx ? '' : '<label class="field"><span>Programa</span><select class="input" data-change="wProg">' + progs.map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === prog.id ? ' selected' : '') + '>' + esc(x.name + (x.days ? ' · ' + x.days + ' días' : '')) + '</option>'; }).join('') + '</select></label>') +
      '<p class="label">Fecha de inicio</p><div class="chips">' + opts.map(function (o) { return '<button class="chip' + (dsel === o[2] ? ' on' : '') + '" data-action="wDate" data-d="' + o[2] + '" aria-pressed="' + (dsel === o[2]) + '">' + o[1] + ' <span class="meta">' + U.fmtDate(o[2], 'short') + '</span></button>'; }).join('') + '</div>' +
      '<label class="field mt-s"><span class="sr-only">Otra fecha</span><input type="date" class="input" data-change="wDateInput" value="' + esc(dsel) + '" aria-label="Elegir otra fecha"></label>' +
      (modes.length > 1 ? '<p class="label">Cómo empezar</p><div class="stack-s">' + modes.map(function (m) { return '<label class="check"><input type="radio" name="wmode" value="' + esc(m.id) + '" data-change="wMode"' + (m.id === mode ? ' checked' : '') + '><span>' + esc(m.label) + '</span></label>'; }).join('') + '</div>' : '') +
      '<div class="btn-row mt"><button class="btn primary" data-action="startEdition">' + (ctx ? 'Guardar fecha' : 'Empezar') + '</button><a class="btn ghost" href="#/programas">Ver programas</a></div>' +
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
      return '<li class="li' + (past ? ' muted' : '') + (isToday ? ' is-today' : '') + '"><span class="when">' + U.fmtDate(d, 'day') + (isToday ? ' · hoy' : '') + '</span><span class="grow">' + esc(s[1]) + '</span></li>';
    }).join('');
    var d1 = L.planEntries(ctx.p.plan, start, U.addDays(start, 2)).map(function (e) { return e.recipeId; });
    var soaks = L.soaksForRecipes(d1, ctx.p);
    return '<section class="calm-block countdown" aria-label="Antes de empezar"><p class="lab">Faltan ' + U.plural(c.daysUntil, 'día') + ' · empezás el ' + esc(U.fmtDate(start, 'long')) + '</p>' +
      '<h2 class="calm-h">Bajar la cafeína de a poco</h2><ul class="list">' + cal + '</ul>' +
      '<div class="quiet-links"><a class="qlink" href="#/compras/base">' + I('compras') + '<span class="grow">Compras iniciales</span>' + I('chev', 'sm chev') + '</a><a class="qlink" href="#/cocina/plan">' + I('calendario') + '<span class="grow">Planificar la primera semana</span>' + I('chev', 'sm chev') + '</a>' + (soaks.length ? '<a class="qlink" href="#/cocina/remojos">' + I('frasco') + '<span class="grow">' + U.plural(soaks.length, 'remojo') + ' para empezar</span>' + I('chev', 'sm chev') + '</a>' : '') + '</div></section>';
  }

  function closingCard(ctx) {
    var s = ctx.sum;
    var cons = s.constancy == null ? null : Math.round(s.constancy * 100);
    return '<section class="calm-block closing" aria-label="Programa terminado"><p class="lab">Tu edición en números</p>' +
      '<h2 class="calm-h">Terminaste ' + esc(ctx.prog.name) + '.</h2>' +
      '<p class="calm-sub">' + (cons != null ? cons + ' % de constancia · ' : '') + U.plural(s.completeDays, 'día completo', 'días completos') + ' · mejor racha de ' + U.plural(s.bestStreak, 'día') + ' · ' + U.plural(s.recipesTried.all, 'receta probada', 'recetas probadas') + '</p>' +
      '<div class="btn-row mt"><a class="btn primary" href="#/progreso/informe">Ver informe</a><a class="btn" href="#/progreso/reintro">Reintroducir alimentos</a><button class="btn ghost" data-action="repeatProgram">Repetir programa</button></div></section>';
  }
  A.actions.repeatProgram = function () { var ed = A.ED(); A.go('/programas/' + (ed ? ed.programId : '')); };

  /* ---------- acciones del día ---------- */
  function withDay(fn, part, opts) {
    var ctx = A.dayCtx(A.route);
    if (!ctx || !ctx.editable) return;
    var before = ctx.sum.badges.filter(function (b) { return b.unlocked; }).map(function (b) { return b.id; });
    var wasComplete = ctx.row.complete;
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
  function afterHabit(el, h, label) {
    if (el.id === 'focus-done' || el.id === 'focus-skip') A.ui.focusAfter = true;
    var ctx = A.dayCtx(A.route); if (!ctx || ctx.nodate) return;
    var hab = ctx.row.habits.filter(function (x) { return x.id === h; })[0];
    var next = ctx.row.habits.filter(function (x) { return !habitState(ctx, x); })[0];
    A.announce && A.announce(label + (hab ? ': ' + hab.text : '') + '. ' + (next ? 'Sigue: ' + next.text + '.' : ctx.row.complete ? 'Día completo.' : 'No quedan hábitos pendientes.'));
  }
  A.actions.habit = function (el) {
    var h = el.dataset.h, was = null;
    withDay(function (d) { was = d.habits[h]; if (d.habits[h] === 'done') delete d.habits[h]; else d.habits[h] = 'done'; }, 'habits');
    afterHabit(el, h, was === 'done' ? 'Desmarcado' : 'Hecho');
  };
  A.actions.habitSkip = function (el) {
    var h = el.dataset.h, was = null;
    withDay(function (d) { was = d.habits[h]; if (d.habits[h] === 'skip') delete d.habits[h]; else d.habits[h] = 'skip'; }, 'habits');
    afterHabit(el, h, was === 'skip' ? 'Deshecho' : 'Hoy no');
  };
  A.actions.toggleDesc = function () { A.ui.descOpen = !A.ui.descOpen; A.render(); };
  A.actions.habitTip = function (el) { A.ui.tip = A.ui.tip === el.dataset.h ? null : el.dataset.h; A.render(); };
  A.actions.water = function (el) { var ml = +el.dataset.ml; withDay(function (d) { d.water.push({ t: Date.now(), ml: ml }); }, 'water'); };
  A.actions.waterUndo = function () { withDay(function (d) { d.water.pop(); }, 'water'); };
  A.actions.waterGoal = function () {
    var p = A.P(), cur = L.waterGoal(p, A.PROG());
    A.openSheet({ id: A.sheetId(), title: 'Meta de agua', body: '<form data-submit="waterGoalSave"><label class="field"><span>Mililitros por día</span><input class="input" name="ml" type="number" min="500" max="6000" step="50" value="' + cur + '" inputmode="numeric"></label><p class="meta">La guía sugiere agua tibia a lo largo del día. Ajustala a tu cuerpo y al clima.</p><button class="btn primary">Guardar</button></form>', focus: 'input' });
  };
  A.actions.waterGoalSave = function (f) {
    var v = Math.max(500, Math.min(6000, Math.round(+f.ml.value || 2000)));
    A.update(function (s, p) { p.settings.waterGoalMl = v; }, { settings: true });
    A.closeOwn(f);
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
    A.closeOwn(el);
  };
  A.actions.mealAddSheet = function (el) {
    var slot = el.dataset.slot, ctx = A.dayCtx(A.route);
    var lab = (L.idx().slots[slot] || {}).label || slot;
    var sug = L.suggest({ profile: ctx.p, editionId: ctx.ed.id, program: ctx.prog, phaseId: ctx.row.phaseId, slot: slot, dayIdx: ctx.idx, dateISO: ctx.iso, n: 4 });
    A.openSheet({
      id: A.sheetId(),
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
    addMeal(f.dataset.slot, q, null, true); A.closeOwn(f);
  };
  A.actions.mealAddFreeBtn = function (el) {
    var q = document.getElementById('meal-q').value.trim(); if (!q) return;
    addMeal(el.dataset.slot, q, null, true); A.closeOwn(el);
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
  A.actions.checkinOpen = function () { A.openLive('checkin'); };
  A.actions.checkinClose = function () { A.closeDialog('sheet'); };
})(typeof window !== 'undefined' ? window : globalThis);
