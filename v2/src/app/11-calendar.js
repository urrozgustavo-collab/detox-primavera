/* Detox v2 — calendario de la edición, fases, hábitos, racha con gracia, constancia, puntos y logros.
   Todo puro y derivado: nada de esto se guarda. */
(function (root) {
  'use strict';
  var A = root.DXApp, U = A.util, L = A.logic;

  L.GRACE_DAYS = 2;
  L.POINTS_HABIT = 15;
  L.POINTS_DAY = 50;

  /* ---------- calendario ---------- */
  L.monoDays = function (program, startMode) {
    if (!program) return 0;
    var hasMono = U.arr(program.phases).some(function (p) { return p.id === 'monodieta'; });
    if (!hasMono) return 0;
    var mode = U.arr(program.startModes).filter(function (m) { return m.id === startMode; })[0];
    if (mode && mode.monoDays != null) return Math.max(0, Number(mode.monoDays) || 0);
    var m = /monodieta(\d+)/.exec(String(startMode || ''));
    if (m) return +m[1];
    if (startMode === 'directo') return 0;
    var def = U.arr(program.startModes).filter(function (x) { return x.id === program.defaultStartMode; })[0];
    return def && def.monoDays != null ? def.monoDays : 0;
  };

  L.programDays = function (program) { return Math.max(1, Number(program && program.days) || 21); };

  /* Índice del día de la edición para una fecha: null sin fecha; 0 = preparación; 1..days; days si ya terminó. */
  L.dayIndex = function (edition, program, todayISO) {
    if (!edition || !U.isValidISO(edition.startDate)) return null;
    var days = L.programDays(program);
    var diff = U.diffDays(edition.startDate, todayISO);
    if (diff < 0) return 0;
    if (diff < days) return diff + 1;
    return days;
  };

  L.clock = function (edition, program, todayISO) {
    var days = L.programDays(program);
    if (!edition || !U.isValidISO(edition.startDate)) return { status: 'nodate', idx: null, days: days, daysUntil: null };
    var diff = U.diffDays(edition.startDate, todayISO);
    if (diff < 0) return { status: 'future', idx: 0, days: days, daysUntil: -diff };
    if (diff < days) return { status: 'active', idx: diff + 1, days: days, daysUntil: 0 };
    return { status: 'finished', idx: days, days: days, daysUntil: 0, daysSinceEnd: diff - days + 1 };
  };

  /* Fecha de un día de la edición (día 0 = la víspera del inicio). */
  L.dayDate = function (edition, idx) {
    if (!edition || !U.isValidISO(edition.startDate)) return null;
    return U.addDays(edition.startDate, idx - 1);
  };

  L.phaseId = function (program, startMode, idx) {
    if (!program) return 'general';
    var ids = U.arr(program.phases).map(function (p) { return p.id; });
    if (idx === 0 && (program.prepDay || ids.indexOf('previa') > -1)) return 'previa';
    var mono = L.monoDays(program, startMode);
    if (idx >= 1 && idx <= mono) return 'monodieta';
    if (ids.indexOf('general') > -1 || !ids.length) return 'general';
    var rest = ids.filter(function (i) { return i !== 'previa' && i !== 'monodieta'; });
    return rest[0] || ids[ids.length - 1];
  };
  L.phase = function (program, phaseId) {
    var p = U.arr(program && program.phases).filter(function (x) { return x.id === phaseId; })[0];
    return p || { id: phaseId, name: phaseId === 'previa' ? 'Preparación' : phaseId === 'monodieta' ? 'Monodieta' : 'Menú depurativo', desc: '', tips: [] };
  };

  /* ---------- hábitos ---------- */
  L.habitsFor = function (program, phaseId, idx) {
    if (!program) return [];
    if (idx === 0) {
      var prep = U.arr(program.prepHabits);
      var extra = U.arr(program.habits).filter(function (h) { return h.phases && h.phases.indexOf('previa') > -1; });
      return prep.concat(extra);
    }
    return U.arr(program.habits).filter(function (h) { return !h.phases || !h.phases.length || h.phases.indexOf(phaseId) > -1; });
  };
  L.habitWarnings = function (habit, conditions) {
    return U.arr(habit && habit.warnFor).filter(function (c) { return (conditions || []).indexOf(c) > -1; });
  };
  L.dayStats = function (day, habits) {
    var hs = (day && day.habits) || {};
    var done = 0, skip = 0;
    habits.forEach(function (h) { if (hs[h.id] === 'done') done++; else if (hs[h.id] === 'skip') skip++; });
    var total = habits.length;
    return { done: done, skip: skip, total: total, ratio: total ? done / total : 0, complete: total > 0 && done === total };
  };
  L.waterTotal = function (day) { return U.sum(U.arr(day && day.water).map(function (w) { return w.ml; })); };
  L.hasCheckin = function (day) {
    var c = day && day.checkin;
    return !!(c && (c.energy || c.mood || c.digestion || (c.symptoms && c.symptoms.length) || (c.customSymptoms && c.customSymptoms.length) || (c.notes && String(c.notes).trim())));
  };
  L.mealItems = function (day, slot) {
    var m = day && day.meals && day.meals[slot];
    return U.arr(m).filter(function (x) { return x && !x.deleted; });
  };
  L.dayHasData = function (day) {
    if (!day) return false;
    if (day.habits && Object.keys(day.habits).length) return true;
    if (day.water && day.water.length) return true;
    if (L.hasCheckin(day)) return true;
    return !!(day.meals && Object.keys(day.meals).some(function (s) { return L.mealItems(day, s).length; }));
  };

  L.waterGoal = function (profile, program) {
    return (profile && profile.settings && Number(profile.settings.waterGoalMl)) || (program && program.waterGoalMl) || 2000;
  };

  /* Nunca dos ediciones «en curso» (activa o planificada) del mismo programa: queda la edición activa del
     perfil (o la de inicio más reciente) y las demás pasan a «done» si su fecha ya terminó, o a «archived».
     Devuelve los ids que cambiaron. */
  L.settleEditions = function (profile, todayISO, dx) {
    var changed = [];
    var eds = Object.keys(profile.editions || {}).map(function (k) { return profile.editions[k]; });
    var running = function (e) { return e.status === 'active' || e.status === 'planned'; };
    U.uniq(eds.map(function (e) { return e.programId; })).forEach(function (pid) {
      var list = eds.filter(function (e) { return e.programId === pid && running(e); });
      if (list.length < 2) return;
      var keep = list.filter(function (e) { return e.id === profile.activeEdition; })[0] ||
        list.slice().sort(function (a, b) { return String(b.startDate || '').localeCompare(String(a.startDate || '')) || (b.createdAt || 0) - (a.createdAt || 0); })[0];
      list.forEach(function (e) {
        if (e === keep) return;
        var c = L.clock(e, L.program(e.programId, profile, dx), todayISO);
        e.status = c.status === 'finished' ? 'done' : 'archived';
        e.closedAt = e.closedAt || Date.now(); e.updatedAt = Date.now();
        var why = 'archivada porque había otra edición en curso del mismo programa';
        if (String(e.note || '').indexOf(why) < 0) e.note = e.note ? e.note + ' · ' + why : U.cap(why);
        changed.push(e.id);
      });
    });
    return changed;
  };

  /* ---------- resumen de una edición ---------- */
  L.summary = function (profile, editionId, todayISO, dx) {
    var ed = profile && profile.editions && profile.editions[editionId];
    if (!ed) return null;
    var program = L.program(ed.programId, profile, dx);
    var days = L.programDays(program);
    var clock = L.clock(ed, program, todayISO);
    // T = índice del día "hoy" (los anteriores ya transcurrieron). Terminada: todos transcurrieron.
    var T = clock.status === 'active' ? clock.idx : clock.status === 'finished' ? days + 1 : 0;
    var store = (profile.days && profile.days[editionId]) || {};
    var goal = L.waterGoal(profile, program);
    var mono = L.monoDays(program, ed.startMode);
    var out = [];
    var graceDays = program && program.graceDays != null ? program.graceDays : L.GRACE_DAYS;
    for (var d = 0; d <= days; d++) {
      var day = store[String(d)] || null;
      var phaseId = L.phaseId(program, ed.startMode, d);
      var habits = L.habitsFor(program, phaseId, d);
      var st = L.dayStats(day, habits);
      var row = {
        idx: d, iso: L.dayDate(ed, d), phaseId: phaseId, habits: habits, day: day,
        done: st.done, skip: st.skip, total: st.total, ratio: st.ratio, complete: st.complete, hasData: L.dayHasData(day), graced: false,
        water: L.waterTotal(day), checkin: L.hasCheckin(day), past: d > 0 && d < T, today: d === T && clock.status === 'active', future: d > T || clock.status === 'nodate'
      };
      row.waterMet = row.water >= goal;
      out.push(row);
    }
    /* Gracia (§4.3, criterio de la ronda de QA): recién existe a partir del primer día con algún registro
       (si nunca empezaste, no se «gasta») y se usa en el orden en que pasan los días, como ocurriría en el
       momento (no se «mueve» hacia atrás). Un día de gracia sostiene la racha pero no la suma; si ese día
       tuvo registros se sigue viendo «parcial» (con la hoja), si no, «gracia». */
    var firstActive = 0;
    for (var f = 1; f <= days; f++) if (out[f].hasData) { firstActive = f; break; }
    var graceUsed = 0;
    if (firstActive) {
      for (var g = firstActive; g <= Math.min(T - 1, days) && graceUsed < graceDays; g++) {
        if (out[g].past && !out[g].complete) { out[g].graced = true; graceUsed++; }
      }
    }
    out.forEach(function (r) {
      if (r.idx === 0) r.status = r.complete ? 'complete' : (r.done ? 'partial' : (clock.status === 'future' ? 'today' : 'empty'));
      else if (r.complete) r.status = 'complete';
      else if (r.today) r.status = 'today';
      else if (r.past) r.status = r.graced && !r.done ? 'grace' : (r.done ? 'partial' : 'empty');
      else r.status = 'future';
    });
    // Racha y mejor racha (hoy incompleto no corta).
    function okDay(r) { return r.complete || r.graced; }
    var streak = 0;
    var lastIdx = Math.min(T, days);
    if (lastIdx >= 1) {
      var start = lastIdx;
      if (out[lastIdx] && out[lastIdx].today && !out[lastIdx].complete) start = lastIdx - 1;
      for (var i = start; i >= 1; i--) {
        if (!okDay(out[i])) break;
        if (out[i].complete) streak++;
      }
    }
    var best = 0, run = 0;
    for (var j = 1; j <= Math.min(lastIdx, days); j++) {
      if (okDay(out[j])) { if (out[j].complete) run++; best = Math.max(best, run); }
      else if (!out[j].today) run = 0;
    }
    best = Math.max(best, streak);
    // Constancia: % de días transcurridos con >= 80 % de hábitos; hoy solo cuenta si ya llegó al 80 %.
    var elapsed = 0, good = 0;
    for (var k = 1; k <= days; k++) {
      var r = out[k];
      if (r.past || (r.today && r.ratio >= 0.8)) { elapsed++; if (r.ratio >= 0.8) good++; }
    }
    var completeDays = out.filter(function (r) { return r.idx >= 1 && r.complete; }).length;
    var res = {
      edition: ed, program: program, clock: clock, monoDays: mono, days: out, streak: streak, bestStreak: best,
      constancy: elapsed ? good / elapsed : null, elapsed: elapsed, completeDays: completeDays, graceUsed: graceUsed,
      waterGoal: goal
    };
    res.recipesTried = L.editionRecipes(profile, ed, out, dx);
    var habitPts = 0;
    out.forEach(function (r) { habitPts += r.done * L.POINTS_HABIT + (r.complete ? L.POINTS_DAY : 0); });
    res.badges = L.badges(program, res, ed);
    res.points = habitPts + res.badges.filter(function (b) { return b.unlocked; }).reduce(function (s, b) { return s + (b.points || 0); }, 0);
    res.habitPoints = habitPts;
    return res;
  };

  /* Recetas distintas cocinadas/registradas como hechas durante la edición. */
  L.editionRecipes = function (profile, ed, rows, dx) {
    var guide = new Set(), all = new Set();
    var ix = L.idx(dx);
    rows.forEach(function (r) {
      if (!r.day || !r.day.meals) return;
      Object.keys(r.day.meals).forEach(function (s) {
        L.mealItems(r.day, s).forEach(function (m) {
          if (m.done && m.recipeId) { all.add(m.recipeId); if (ix.recipes[m.recipeId]) guide.add(m.recipeId); }
        });
      });
    });
    var cooked = profile.recipeLog && profile.recipeLog.cooked;
    if (cooked && U.isValidISO(ed.startDate)) {
      var from = ed.startDate, to = U.addDays(ed.startDate, L.programDays(L.program(ed.programId, profile, dx)) - 1);
      Object.keys(cooked).forEach(function (id) {
        (cooked[id] || []).forEach(function (ts) {
          var d = U.isoFromTs(ts);
          if (d >= U.addDays(from, -1) && d <= to) { all.add(id); if (ix.recipes[id]) guide.add(id); }
        });
      });
    }
    return { guide: guide.size, all: all.size, ids: Array.from(all) };
  };

  /* ---------- logros ---------- */
  function rangeOk(sum, from, to, grace) {
    var n = 0, total = 0;
    for (var d = from; d <= to; d++) {
      var r = sum.days[d]; if (!r) return { ok: false, cur: n, n: to - from + 1 };
      total++;
      if (r.complete || (grace && r.graced)) n++;
    }
    return { ok: total > 0 && n === total, cur: n, n: total };
  }
  function habitStreak(sum, habitId, n) {
    var best = 0, run = 0;
    for (var d = 1; d < sum.days.length; d++) {
      var r = sum.days[d];
      if (r.day && r.day.habits && r.day.habits[habitId] === 'done') { run++; best = Math.max(best, run); } else run = 0;
    }
    return { ok: best >= n, cur: Math.min(best, n), n: n };
  }
  function count(sum, pred, n) {
    var c = sum.days.filter(function (r) { return r.idx >= 1 && pred(r); }).length;
    return { ok: c >= n, cur: Math.min(c, n), n: n };
  }
  var BY_ID = {
    inicio: { type: 'daysComplete', n: 1 },
    monodieta: { type: 'phaseComplete', phase: 'monodieta' },
    adios_cafeina: { type: 'habitStreak', habit: 'no_estimulantes', n: 3 },
    semana1: { type: 'rangeComplete', from: 1, to: 7, grace: true },
    maestro_nituke: { type: 'recipesCooked', n: 10, source: 'guide' },
    detox_champion: { type: 'rangeComplete', from: 1, to: 21, grace: true },
    hidratacion: { type: 'waterDays', n: 7 },
    bitacora: { type: 'checkinDays', n: 7 },
    explorador: { type: 'recipesTried', n: 20 }
  };
  L.evalRule = function (rule, sum) {
    var days = sum.days.length - 1;
    switch (rule && rule.type) {
      case 'daysComplete': return count(sum, function (r) { return r.complete || (rule.grace && r.graced); }, rule.n || 1);
      case 'daysCompleteRange':
      case 'rangeComplete': return rangeOk(sum, rule.from || 1, Math.min(rule.to || days, days), rule.grace !== false);
      case 'allDays': return rangeOk(sum, 1, days, rule.grace !== false);
      case 'phaseComplete':
        var ids = sum.days.filter(function (r) { return r.idx >= 1 && r.phaseId === rule.phase; }).map(function (r) { return r.idx; });
        if (!ids.length) return { ok: false, cur: 0, n: 0, hidden: true };
        return rangeOk(sum, ids[0], ids[ids.length - 1], !!rule.grace);
      case 'habitStreak': return habitStreak(sum, rule.habit, rule.n || 3);
      case 'distinctRecipesCooked':
        var anyR = rule.source ? rule.source === 'any' : rule._id !== 'maestro_nituke';
        var cnt = anyR ? sum.recipesTried.all : sum.recipesTried.guide;
        return { ok: cnt >= rule.n, cur: Math.min(cnt, rule.n), n: rule.n };
      case 'recipesCooked': var g = rule.source === 'any' ? sum.recipesTried.all : sum.recipesTried.guide; return { ok: g >= rule.n, cur: Math.min(g, rule.n), n: rule.n };
      case 'recipesTried': var a = sum.recipesTried.all; return { ok: a >= rule.n, cur: Math.min(a, rule.n), n: rule.n };
      case 'waterGoalDays':
      case 'waterDays': return count(sum, function (r) { return r.waterMet; }, rule.n || 7);
      case 'checkinDays': return count(sum, function (r) { return r.checkin; }, rule.n || 7);
      default: return { ok: false, cur: 0, n: 1, unknown: true };
    }
  };
  L.badges = function (program, sum, ed) {
    return U.arr(program && program.badges).map(function (b) {
      var rule = (b.rule && b.rule.type) ? b.rule : BY_ID[b.id];
      if (!rule && b.requiredDays) rule = { type: 'daysComplete', n: b.requiredDays };
      if (rule) { rule = Object.assign({}, rule); rule._id = b.id; }
      var r = rule ? L.evalRule(rule, sum) : { ok: false, cur: 0, n: 1, unknown: true };
      if (rule && rule.type === 'phaseComplete' && rule.phase === 'monodieta' && sum.monoDays === 0) r.hidden = true;
      if (b.hiddenWhen && b.hiddenWhen.startMode && ed && ed.startMode === b.hiddenWhen.startMode) r.hidden = true;
      return { id: b.id, title: b.title || b.id, desc: b.desc || '', points: Number(b.points != null ? b.points : b.xp) || 0, unlocked: !!r.ok && !r.hidden, progress: r, hidden: !!r.hidden, icon: b.icon };
    }).filter(function (b) { return !b.hidden; });
  };
})(typeof window !== 'undefined' ? window : globalThis);
