/* Detox v2 — Cocina: recetas, detalle con escalado, modo cocina, heladera, plan, batch, remojos, métodos, recetas propias. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic, K = A.kit, esc = U.esc, I = A.icon;
  var TABS = [['#/cocina/recetas', 'recetas', 'Recetas'], ['#/cocina/heladera', 'heladera', 'Heladera'], ['#/cocina/plan', 'plan', 'Plan'], ['#/cocina/batch', 'batch', 'Batch'], ['#/cocina/remojos', 'remojos', 'Remojos'], ['#/cocina/metodos', 'metodos', 'Métodos']];
  var MEAL_TIME = { desayuno: '08:00', almuerzo: '13:00', merienda: '17:00', cena: '21:00' };

  A.screens.cocina = {
    render: function (route) {
      var sub = route.parts[0] || 'recetas';
      if (sub === 'receta') return detail(route.parts[1]);
      if (sub === 'nueva' || sub === 'editar') return recipeForm(route.parts[1], sub === 'nueva' ? route.parts[1] : null);
      var head = '<header class="page-h"><h1>Cocina</h1></header>' + K.tabs(TABS, sub, 'Secciones de cocina');
      var body = ({ recetas: recipes, heladera: fridge, plan: plan, batch: batch, remojos: soaks, metodos: methods })[sub] || recipes;
      return head + body();
    },
    parts: { rlist: function () { return recipeList(); }, fing: function () { return fridgeIngredients(); } }
  };

  /* ================= recetas ================= */
  var FILTERS = [['hoy', 'Aptas para hoy'], ['safe', 'Aptas para mí'], ['fav', 'Favoritas'], ['quick', 'Rápidas (≤ 20 min)'], ['own', 'Propias']];
  function curPhase() {
    var ed = A.ED(), prog = A.PROG(); if (!ed || !prog) return null;
    var c = L.clock(ed, prog, A.today()); if (c.status === 'nodate') return null;
    var id = L.phaseId(prog, ed.startMode, c.status === 'future' ? 0 : c.idx);
    return L.phase(prog, id);
  }
  function recipeFits(r, ph) {
    if (!ph) return true;
    if (ph.allowedRecipes && ph.allowedRecipes.length) return ph.allowedRecipes.indexOf(r.id) > -1;
    return !r.phases || !r.phases.length || r.phases.indexOf(ph.id) > -1 || (ph.id === 'previa' && r.phases.indexOf('general') > -1);
  }
  function filteredRecipes() {
    var p = A.P(), q = A.ui.rq || '', cat = A.ui.rcat || '', f = A.ui.rf || {};
    var ph = curPhase();
    var list = L.allRecipes(p).filter(function (r) {
      if (cat && r.category !== cat) return false;
      if (f.hoy && !recipeFits(r, ph)) return false;
      if (f.safe && (L.recipeAllergyHits(r, p).any || L.recipeCondHits(r, p.settings.conditions).length)) return false;
      if (f.fav && p.recipeLog.favorites.indexOf(r.id) < 0) return false;
      if (f.quick && !(r.time && r.time.total && r.time.total <= 20)) return false;
      if (f.own && String(r.id).indexOf('my-') !== 0) return false;
      if (q && !U.matchQuery(r.title + ' ' + L.categoryLabel(r.category) + ' ' + (r.tags || []).join(' ') + ' ' + (r.method || '') + ' ' + U.arr(r.ingredients).map(function (i) { return i.text; }).join(' '), q)) return false;
      return true;
    });
    var sort = A.ui.rsort || 'sug';
    if (sort === 'az') list.sort(function (a, b) { return a.title.localeCompare(b.title, 'es'); });
    else if (sort === 'time') list.sort(function (a, b) { return ((a.time && a.time.total) || 999) - ((b.time && b.time.total) || 999); });
    else {
      var ed = A.ED(); var use = ed ? L.recipeUsage(p, ed.id) : {};
      list.sort(function (a, b) {
        var fa = recipeFits(a, ph) ? 0 : 1, fb = recipeFits(b, ph) ? 0 : 1;
        var ua = (use[a.id] || { count: 0 }).count, ub = (use[b.id] || { count: 0 }).count;
        return (fa - fb) || (ua - ub) || a.title.localeCompare(b.title, 'es');
      });
    }
    return list;
  }
  function recipeList() {
    var list = filteredRecipes(), p = A.P();
    if (!list.length) return K.empty('No hay recetas con esos filtros', 'Probá con menos filtros o con otra palabra.', '<button class="btn" data-action="rClear">Limpiar filtros</button>');
    return '<p class="meta" aria-live="polite">' + U.plural(list.length, 'receta') + '</p><div class="grid-cards">' + list.map(function (r) { return K.recipeCard(r, p); }).join('') + '</div>';
  }
  function recipes() {
    var cats = U.arr(L.tx().recipeCategories), f = A.ui.rf || {};
    var used = new Set(L.allRecipes(A.P()).map(function (r) { return r.category; }));
    return '<section class="toolbar-card">' +
      '<div class="search big">' + I('buscar') + '<input class="input" id="rq" type="search" data-bind="rq" value="' + esc(A.ui.rq || '') + '" placeholder="Buscar por nombre, ingrediente o etiqueta" aria-label="Buscar recetas" autocomplete="off"></div>' +
      '<div class="chips scroll mt-s" role="group" aria-label="Categorías"><button class="chip' + (!A.ui.rcat ? ' on' : '') + '" data-action="rCat" data-c="" aria-pressed="' + !A.ui.rcat + '">Todas</button>' +
      cats.filter(function (c) { return used.has(c.id); }).map(function (c) { var on = A.ui.rcat === c.id; return '<button class="chip' + (on ? ' on' : '') + '" data-action="rCat" data-c="' + c.id + '" aria-pressed="' + on + '">' + esc(c.label) + '</button>'; }).join('') + '</div>' +
      '<div class="chips mt-s" role="group" aria-label="Filtros">' + FILTERS.map(function (x) { var on = !!f[x[0]]; return '<button class="chip soft' + (on ? ' on' : '') + '" data-action="rFilter" data-f="' + x[0] + '" aria-pressed="' + on + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>' +
      '</section>' +
      '<div class="row between mt"><label class="row"><span class="meta">Orden</span><select class="input" style="min-height:40px;width:auto" data-change="rSort"><option value="sug"' + ((A.ui.rsort || 'sug') === 'sug' ? ' selected' : '') + '>Sugeridas</option><option value="az"' + (A.ui.rsort === 'az' ? ' selected' : '') + '>A-Z</option><option value="time"' + (A.ui.rsort === 'time' ? ' selected' : '') + '>Tiempo</option></select></label>' +
      '<a class="btn primary sm" href="#/cocina/nueva">' + I('mas', 'sm') + 'Receta propia</a></div>' +
      '<div data-part="rlist" class="mt">' + recipeList() + '</div>';
  }
  A.binds.rq = U.debounce(function (el) { A.ui.rq = el.value; A.refresh('rlist'); }, 120);
  A.actions.rCat = function (el) { A.ui.rcat = el.dataset.c || ''; A.render(); };
  A.actions.rFilter = function (el) { A.ui.rf = A.ui.rf || {}; A.ui.rf[el.dataset.f] = !A.ui.rf[el.dataset.f]; A.render(); };
  A.changes.rSort = function (el) { A.ui.rsort = el.value; A.refresh('rlist'); };
  A.actions.rClear = function () { A.ui.rq = ''; A.ui.rcat = ''; A.ui.rf = {}; A.render(); };

  /* ================= detalle ================= */
  function scaled(i, k) {
    if (i.qty == null) return '';
    var q = i.qty * k, qm = i.qtyMax != null ? i.qtyMax * k : null;
    return U.frac(q) + (qm != null ? ' a ' + U.frac(qm) : '') + (i.unit && i.unit !== 'unidad' ? ' ' + U.unitLabel(i.unit, qm || q) : '');
  }
  function ingText(i, k) {
    if (k === 1 || i.qty == null) return esc(i.text);
    return '<span class="qty">' + esc(scaled(i, k)) + '</span> <span class="was">(' + esc(i.text) + ')</span>';
  }
  function detail(id) {
    var p = A.P(), r = L.recipe(id, p);
    if (!r) return K.back('#/cocina/recetas', 'Recetas') + K.empty('No encontramos esa receta', 'Puede que la hayas borrado.', '<a class="btn" href="#/cocina/recetas">Ver recetas</a>');
    var k = (A.ui.scale && A.ui.scale[id]) || 1;
    var checks = (A.ui.ingChk && A.ui.ingChk[id]) || {};
    var fav = p.recipeLog.favorites.indexOf(id) > -1;
    var rating = p.recipeLog.rating[id] || 0;
    var cooked = (p.recipeLog.cooked[id] || []).length;
    var own = String(id).indexOf('my-') === 0;
    var t = r.time || {};
    var ph = curPhase();
    var hits = L.recipeAllergyHits(r, p);
    var h = [K.back('#/cocina/recetas', 'Recetas')];
    h.push('<article class="recipe"><section class="recipe-hero"><header class="recipe-h"><p class="rc-cat">' + esc(L.categoryLabel(r.category)) + (own ? ' · receta propia' : '') + '</p><h1 class="serif">' + esc(r.title) + '</h1>' +
      '<div class="recipe-meta">' + (t.total ? '<span>' + I('reloj', 'sm') + (r.timeEstimated ? 'aprox. ' : '') + U.fmtMin(t.total) + (t.active && t.active !== t.total ? ' (' + U.fmtMin(t.active) + ' activos)' : '') + '</span>' : '') +
      (t.wait ? '<span>' + I('frasco', 'sm') + 'espera ' + U.fmtMin(t.wait) + '</span>' : '') + (r.method ? '<span>' + I('olla', 'sm') + esc(r.method) + '</span>' : '') +
      (r.servings ? '<span>' + I('personas', 'sm') + U.plural(r.servings, 'porción', 'porciones') + (r.servingsEstimated ? ' aprox.' : '') + '</span>' : '') + (cooked ? '<span>' + I('check', 'sm') + 'Cocinada ' + U.plural(cooked, 'vez', 'veces') + '</span>' : '') + '</div>' +
      '<div class="rc-tags mt-s">' + K.allergenTags(r, p) + (ph && !recipeFits(r, ph) ? '<span class="tag warn">' + I('info', 'sm') + 'No es de la fase actual</span>' : '') +
      U.arr(r.tags).filter(function (x) { return /friolento|caluroso|crudo|cocido|batch|fermento/.test(x); }).map(function (x) { return '<span class="tag">' + esc(x.replace('-ok', ': bien').replace('-', ' ')) + '</span>'; }).join('') + '</div>' +
      (r.allergens && r.allergens.length && !hits.any ? '<p class="meta mt-s">Contiene: ' + esc(r.allergens.map(function (a) { return L.allergenLabel(a).toLowerCase(); }).join(', ')) + (r.mayContain && r.mayContain.length ? ' · opcionales: ' + esc(r.mayContain.map(function (a) { return L.allergenLabel(a).toLowerCase(); }).join(', ')) : '') + '</p>' : '') +
      '</header>' +
      '<div class="btn-row mt"><button class="btn primary" data-action="cook" data-r="' + esc(id) + '">' + I('play', 'sm') + 'Cocinar</button>' +
      '<button class="btn fav-btn' + (fav ? ' on' : '') + '" data-action="fav" data-r="' + esc(id) + '" aria-pressed="' + fav + '">' + I('estrella', 'sm') + (fav ? 'Favorita' : 'Guardar') + '</button>' +
      '<button class="btn" data-action="planSheet" data-r="' + esc(id) + '">' + I('calendario', 'sm') + 'Al plan</button>' +
      '<button class="btn" data-action="logMealSheet" data-r="' + esc(id) + '">' + I('check', 'sm') + 'Comí esto hoy</button></div></section>');
    var mult = [[0.5, '×½'], [1, '×1'], [2, '×2'], [3, '×3']];
    h.push('<div class="grid2 mt"><section class="card"><div class="card-h"><h2>Ingredientes</h2><div class="seg" role="group" aria-label="Cantidad">' + mult.map(function (m) { return '<button data-action="scale" data-r="' + esc(id) + '" data-k="' + m[0] + '" aria-pressed="' + (k === m[0]) + '">' + m[1] + '</button>'; }).join('') + '</div></div>' +
      (r.servings && k !== 1 ? '<p class="meta">Para ' + U.frac(r.servings * k) + ' porciones.</p>' : '') +
      '<ul class="list ing-list">' + U.arr(r.ingredients).map(function (i, n) {
        var on = !!checks[n];
        var ah = L.textAllergyHits(i.text, i.item, p);
        return '<li class="' + (on ? 'is-done' : '') + '"><button class="tick sq' + (on ? ' on' : '') + '" data-action="ingChk" data-r="' + esc(id) + '" data-n="' + n + '" aria-pressed="' + on + '" aria-label="Tengo: ' + esc(i.text) + '">' + I('check') + '</button><span class="txt grow">' + ingText(i, k) + (i.suggested ? ' <span class="sug-mark" title="Cantidad sugerida: la guía no la indica">≈ sugerida</span>' : '') + (i.optional ? ' <span class="meta">(opcional)</span>' : '') + (ah.any ? ' <span class="tag alert">' + I('alerta', 'sm') + 'alérgeno</span>' : '') + '</span></li>';
      }).join('') + '</ul>' +
      '<div class="btn-row mt"><button class="btn sm" data-action="ingsToShop" data-r="' + esc(id) + '">' + I('compras', 'sm') + 'Agregar a compras</button></div></section>' +
      '<section class="card"><h2 class="mb">Preparación</h2><ol class="steps">' + U.arr(r.steps).map(function (s, n) {
        return '<li><p>' + esc(s.text) + (s.editorial ? ' <span class="tag" title="Paso o dato que no está en la guía">sugerencia</span>' : '') + '</p>' + (s.timer ? '<button class="btn sm" data-action="timerStep" data-r="' + esc(id) + '" data-n="' + n + '">' + I('timer', 'sm') + 'Temporizador ' + U.fmtDuration(s.timer) + '</button>' : '') + '</li>';
      }).join('') + '</ol>' + (r.tip ? '<p class="note">' + I('hoja', 'sm') + ' ' + esc(r.tip) + '</p>' : '') + (r.note ? '<p class="note mt-s">' + I('info', 'sm') + ' ' + esc(r.note) + '</p>' : '') + (r.editorialNote ? '<p class="note mt-s">' + I('info', 'sm') + ' ' + esc(r.editorialNote) + '</p>' : '') +
      (U.arr(r.ingredients).some(function (i) { return i.suggested; }) ? '<p class="meta mt-s">≈ sugerida: cantidad propuesta por la app; la guía no la indica.</p>' : '') +
      (r.source ? '<p class="meta mt-s">Fuente: ' + esc(r.source) + '</p>' : '') + '</section></div>');
    h.push('<section class="card mt"><div class="card-h"><h2>Tu nota</h2><div class="stars" role="group" aria-label="Valoración">' + [1, 2, 3, 4, 5].map(function (n) { return '<button class="' + (n <= rating ? 'on' : '') + '" data-action="rate" data-r="' + esc(id) + '" data-v="' + n + '" aria-pressed="' + (n <= rating) + '" aria-label="' + n + ' de 5">' + I('estrella', 'sm') + '</button>'; }).join('') + '</div></div>' +
      '<textarea class="input" id="rnote" data-bind="rnote" data-r="' + esc(id) + '" rows="3" placeholder="Variantes, qué le cambiarías, con qué la acompañaste…">' + esc(p.recipeLog.notes[id] || '') + '</textarea>' +
      '<div class="btn-row mt">' + (own ? '<a class="btn sm" href="#/cocina/editar/' + encodeURIComponent(id) + '">' + I('editar', 'sm') + 'Editar</a><button class="btn sm danger" data-action="delRecipe" data-r="' + esc(id) + '">' + I('borrar', 'sm') + 'Borrar</button>' : '') +
      '<a class="btn sm" href="#/cocina/nueva/' + encodeURIComponent(id) + '">' + I('copiar', 'sm') + 'Duplicar como propia</a>' +
      (U.arr(A.dx().prep && A.dx().prep.ferments).some(function (f) { return f.recipe === id; }) ? '<button class="btn sm" data-action="startFerment" data-r="' + esc(id) + '">' + I('frasco', 'sm') + 'Empecé un frasco hoy</button>' : '') + '</div></section>');
    return h.join('');
  }
  A.actions.scale = function (el) { A.ui.scale = A.ui.scale || {}; A.ui.scale[el.dataset.r] = +el.dataset.k; A.render(); };
  A.actions.ingChk = function (el) { var r = el.dataset.r, n = el.dataset.n; A.ui.ingChk = A.ui.ingChk || {}; var m = A.ui.ingChk[r] = A.ui.ingChk[r] || {}; m[n] = !m[n]; A.render(); };
  A.actions.fav = function (el) {
    var id = el.dataset.r;
    A.update(function (s, p) { var f = p.recipeLog.favorites, i = f.indexOf(id); if (i > -1) f.splice(i, 1); else f.push(id); });
  };
  A.actions.rate = function (el) { var id = el.dataset.r, v = +el.dataset.v; A.update(function (s, p) { p.recipeLog.rating[id] = p.recipeLog.rating[id] === v ? 0 : v; }); };
  A.binds.rnote = function (el) { var id = el.dataset.r; A.update(function (s, p) { p.recipeLog.notes[id] = el.value; }, { render: false }); };
  A.actions.timerStep = function (el) { var r = L.recipe(el.dataset.r, A.P()); var s = r.steps[+el.dataset.n]; A.timers.start(r.title + ' · paso ' + (+el.dataset.n + 1), s.timer, r.id); };
  A.actions.startFerment = function (el) {
    var id = el.dataset.r;
    A.update(function (s, p) { p.ferments.push({ id: U.uid('f'), recipe: id, startedAt: Date.now(), notes: '', u: Date.now() }); });
    A.toast('Anotado: te avisamos en «Para mañana» cada hito del fermento.');
  };
  A.actions.delRecipe = function (el) {
    var id = el.dataset.r;
    A.confirm({ title: 'Borrar receta', text: 'La receta propia se borra de este perfil. ¿Seguimos?', ok: 'Borrar', danger: true }).then(function (ok) {
      if (!ok) return;
      A.update(function (s, p) { p.customRecipes.forEach(function (r) { if (r.id === id) { r.deleted = true; r.updatedAt = Date.now(); } }); });
      A.go('/cocina/recetas'); A.toast('Receta borrada');
    });
  };
  A.addToShopping = function (items, from) {
    var added = 0;
    A.update(function (s, p) {
      items.forEach(function (it) {
        var exists = p.shopping.custom.some(function (c) { return !c.deleted && !c.checked && (c.ingredient && c.ingredient === it.ingredient || U.norm(c.text) === U.norm(it.text)); });
        if (exists) return;
        p.shopping.custom.push({ id: U.uid('c'), text: it.text, store: it.store || 'super', qty: it.qty || '', checked: false, from: from, t: Date.now(), updatedAt: Date.now(), ingredient: it.ingredient || null });
        added++;
      });
    });
    return added;
  };
  A.actions.ingsToShop = function (el) {
    var r = L.recipe(el.dataset.r, A.P()); var k = (A.ui.scale && A.ui.scale[r.id]) || 1;
    var items = U.arr(r.ingredients).filter(function (i) { var ing = i.item && L.ingredient(i.item); return !(ing && ing.pantry) && !i.optional; }).map(function (i) {
      var ing = i.item && L.ingredient(i.item);
      return { text: ing ? ing.name : i.text, store: ing ? ing.store : 'super', qty: scaled(i, k), ingredient: i.item || null };
    });
    var n = A.addToShopping(items, 'receta');
    A.toast(n ? 'Agregaste ' + U.plural(n, 'ingrediente') + ' a Compras' : 'Ya estaban todos en Compras', { action: { label: 'Ver', fn: function () { A.go('/compras'); } } });
  };

  /* comer hoy / al plan */
  A.actions.logMealSheet = function (el) {
    var r = L.recipe(el.dataset.r, A.P());
    if (!A.ED() || L.clock(A.ED(), A.PROG(), A.today()).status === 'nodate') { A.toast('Primero empezá un programa en Hoy.'); return; }
    A.openSheet({ title: 'Registrar en tus comidas de hoy', body: '<p>' + esc(r.title) + '</p><div class="chips">' + L.slots().map(function (s) { return '<button class="chip" data-action="logMeal" data-r="' + esc(r.id) + '" data-slot="' + s.id + '">' + esc(s.label) + '</button>'; }).join('') + '</div>' });
  };
  A.actions.logMeal = function (el) {
    var r = L.recipe(el.dataset.r, A.P());
    if (A.addMealToday(el.dataset.slot, r)) { A.closeDialog(); A.toast('Registrada en ' + (L.idx().slots[el.dataset.slot] || {}).label + '.', { action: { label: 'Ver Hoy', fn: function () { A.go('/hoy'); } } }); }
  };
  A.actions.planSheet = function (el) {
    var id = el.dataset.r, r = L.recipe(id, A.P()), today = A.today();
    var days = []; for (var i = 0; i < 10; i++) days.push(U.addDays(today, i));
    A.ui.planPick = { r: id, date: today, slot: (r.slots && r.slots[0]) || 'almuerzo' };
    A.openSheet({ title: 'Agregar al plan', body: planPickBody(), foot: '<button class="btn primary" data-action="planPickSave">Agregar</button>' });
  };
  function planPickBody() {
    var pp = A.ui.planPick, today = A.today(), days = [];
    for (var i = 0; i < 10; i++) days.push(U.addDays(today, i));
    return '<p><b>' + esc(L.recipe(pp.r, A.P()).title) + '</b></p><p class="label">Día</p><div class="chips">' + days.map(function (d) { return '<button class="chip' + (pp.date === d ? ' on' : '') + '" data-action="planPick" data-k="date" data-v="' + d + '" aria-pressed="' + (pp.date === d) + '">' + (d === today ? 'Hoy' : U.fmtDate(d, 'day')) + '</button>'; }).join('') + '</div>' +
      '<p class="label mt">Momento</p><div class="chips">' + L.slots().map(function (s) { return '<button class="chip' + (pp.slot === s.id ? ' on' : '') + '" data-action="planPick" data-k="slot" data-v="' + s.id + '" aria-pressed="' + (pp.slot === s.id) + '">' + esc(s.label) + '</button>'; }).join('') + '</div>';
  }
  A.actions.planPick = function (el) { A.ui.planPick[el.dataset.k] = el.dataset.v; document.querySelector('#sheet .sheet-b').innerHTML = planPickBody(); };
  A.actions.planPickSave = function () {
    var pp = A.ui.planPick;
    if (pp.move) { A.planRemove(pp.move.date, pp.move.slot, pp.move.i); }
    A.planAdd(pp.date, pp.slot, pp.r);
    A.closeDialog();
    A.toast((pp.move ? 'Movida al ' : 'Agregada al plan: ') + U.fmtDate(pp.date, 'day') + ', ' + (L.idx().slots[pp.slot] || {}).label.toLowerCase());
  };
  A.planAdd = function (date, slot, rid) {
    A.update(function (s, p) { var d = p.plan[date] = p.plan[date] || {}; d[slot] = d[slot] || []; d[slot].push(rid); d.u = Date.now(); });
  };
  A.planRemove = function (date, slot, i) {
    A.update(function (s, p) { var d = p.plan[date]; if (!d || !d[slot]) return; d[slot].splice(i, 1); d.u = Date.now(); });
  };

  /* ================= modo cocina ================= */
  A.actions.cook = function (el) { openCook(el.dataset.r, 0); };
  function openCook(id, step) {
    var r = L.recipe(id, A.P()); if (!r) return;
    A.ui.cook = { id: id, step: step || 0 };
    var d = document.getElementById('cook');
    paintCook();
    if (!d.open) {
      d.showModal();
      if (A.state.device.cookingLock !== false) A.wake.request().then(paintCook);
      A.wake.onchange = paintCook;
      d.addEventListener('close', closeCookOnce, { once: true });
    }
  }
  function closeCookOnce() { A.wake.release(); A.wake.onchange = null; A.ui.cook = null; }
  function paintCook() {
    var c = A.ui.cook; if (!c) return;
    var r = L.recipe(c.id, A.P()), steps = U.arr(r.steps), n = steps.length;
    var d = document.getElementById('cook');
    var k = (A.ui.scale && A.ui.scale[r.id]) || 1;
    var body;
    if (c.step >= n) {
      body = '<p class="cook-step-n">Terminaste</p><p class="cook-text">¡Buen provecho! ' + esc(r.title) + ' quedó anotada como cocinada.</p>' +
        '<div class="btn-row">' + L.slots().map(function (s) { return '<button class="btn" data-action="cookLog" data-slot="' + s.id + '">' + I('check', 'sm') + 'Comí esto en ' + esc(s.label.toLowerCase()) + '</button>'; }).join('') + '</div>';
    } else {
      var s = steps[c.step];
      var txt = esc(s.text);
      var used = L.stepIngredients(r, s.text);
      used.forEach(function (i) { var ing = i.item && L.ingredient(i.item); if (!ing) return; L.ingredientNames(ing).forEach(function (nm) { if (nm && nm.length > 2) { var re = new RegExp('(^|[^\\wáéíóúñ])(' + nm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?=$|[^\\wáéíóúñ])', 'i'); txt = txt.replace(re, '$1<mark>$2</mark>'); } }); });
      body = '<p class="cook-step-n">Paso ' + (c.step + 1) + ' de ' + n + '</p><p class="cook-text">' + txt + '</p>' +
        (used.length ? '<p class="label">Ingredientes de este paso</p><ul class="list">' + used.map(function (i) { return '<li class="li">' + I('hoja', 'sm') + '<span class="grow">' + ingText(i, k) + '</span></li>'; }).join('') + '</ul>' : '') +
        (s.timer ? '<button class="btn primary mt" data-action="cookTimer">' + I('timer', 'sm') + 'Temporizador ' + U.fmtDuration(s.timer) + '</button>' : '') +
        (c.step === 0 && r.tip ? '<p class="note mt">' + esc(r.tip) + '</p>' : '') +
        (c.step === 0 ? '<details class="mt"><summary>Todos los ingredientes</summary><ul class="list">' + U.arr(r.ingredients).map(function (i) { return '<li class="li"><span class="grow">' + ingText(i, k) + '</span></li>'; }).join('') + '</ul></details>' : '');
    }
    var wl = A.wake.supported() ? '<button class="wake' + (A.wake.active() ? ' on' : '') + ' btn ghost sm" data-action="cookWake" aria-pressed="' + A.wake.active() + '"><span class="dot"></span>' + (A.wake.active() ? 'Pantalla siempre encendida' : 'Mantener pantalla encendida') + '</button>' : '<span class="meta">La pantalla puede apagarse (este navegador no permite evitarlo)</span>';
    d.innerHTML = '<div class="cook"><div class="cook-top"><button class="icon-btn" data-action="closeDialog" data-dlg="cook" aria-label="Salir del modo cocina">' + I('cerrar') + '</button><h2 class="cook-title">' + esc(r.title) + '</h2>' + wl + '</div>' +
      '<div class="cook-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + Math.min(c.step, n) + '"><i style="width:' + Math.round(Math.min(c.step, n) / n * 100) + '%"></i></div>' +
      '<div class="cook-body" aria-live="polite">' + body + '</div><div class="cook-timers" aria-label="Temporizadores"></div>' +
      '<div class="cook-nav"><button class="btn" data-action="cookPrev"' + (c.step === 0 ? ' disabled' : '') + '>' + I('chev-izq') + 'Anterior</button>' +
      (c.step < n ? '<button class="btn primary" data-action="cookNext">' + (c.step === n - 1 ? 'Terminar' : 'Siguiente') + I('chev') + '</button>' : '<button class="btn primary" data-action="closeDialog" data-dlg="cook">Cerrar</button>') + '</div></div>';
    A.timers.paint();
  }
  A.actions.cookPrev = function () { if (A.ui.cook.step > 0) { A.ui.cook.step--; paintCook(); } };
  A.actions.cookNext = function () {
    var c = A.ui.cook, r = L.recipe(c.id, A.P());
    c.step++;
    if (c.step === U.arr(r.steps).length) {
      A.update(function (s, p) { (p.recipeLog.cooked[c.id] = p.recipeLog.cooked[c.id] || []).push(Date.now()); }, { render: false });
      A.confetti();
    }
    paintCook();
  };
  A.actions.cookTimer = function () { var c = A.ui.cook, r = L.recipe(c.id, A.P()); A.timers.start(r.title + ' · paso ' + (c.step + 1), r.steps[c.step].timer, r.id); };
  A.actions.cookWake = function () { if (A.wake.active()) A.wake.release(); else A.wake.request(); setTimeout(paintCook, 50); };
  A.actions.cookLog = function (el) { var r = L.recipe(A.ui.cook.id, A.P()); if (A.addMealToday(el.dataset.slot, r)) { A.toast('Registrada en tus comidas de hoy'); A.closeDialog('cook'); } else A.toast('Primero empezá un programa en Hoy.'); };
  A.onKey = function (e, typing) {
    var d = document.getElementById('cook');
    if (d.open && !typing) { if (e.key === 'ArrowRight') { e.preventDefault(); if (A.ui.cook.step < L.recipe(A.ui.cook.id, A.P()).steps.length) A.actions.cookNext(); } else if (e.key === 'ArrowLeft') { e.preventDefault(); A.actions.cookPrev(); } }
  };
  // gestos: deslizar para cambiar de paso
  (function () {
    var x0 = null, d = document.getElementById('cook');
    d.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    d.addEventListener('touchend', function (e) {
      if (x0 == null || !A.ui.cook) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 70) { if (dx < 0 && A.ui.cook.step < L.recipe(A.ui.cook.id, A.P()).steps.length) A.actions.cookNext(); else if (dx > 0) A.actions.cookPrev(); }
    }, { passive: true });
  })();

  /* ================= heladera ================= */
  function quickIngredients() {
    var count = Object.create(null);
    L.allRecipes(A.P()).forEach(function (r) { U.arr(r.ingredients).forEach(function (i) { if (i.item && i.role === 'principal') count[i.item] = (count[i.item] || 0) + 1; }); });
    return Object.keys(count).filter(function (id) { var g = L.ingredient(id); return g && !g.pantry; }).sort(function (a, b) { return count[b] - count[a]; }).slice(0, 16);
  }
  function fridgeIngredients() {
    var p = A.P(), have = new Set(p.fridge), q = A.ui.fq || '', cat = A.ui.fcat || '';
    var list = U.arr(A.dx().ingredients).filter(function (i) {
      if (i.pantry) return false;
      if (cat && i.category !== cat) return false;
      if (q && !U.matchQuery([i.name].concat(i.synonyms || []).join(' '), q)) return false;
      return true;
    }).sort(function (a, b) { return a.name.localeCompare(b.name, 'es'); });
    if (!q && !cat) list = quickIngredients().map(function (id) { return L.ingredient(id); });
    return (!q && !cat ? '<p class="meta">Los más usados en las recetas:</p>' : '') + '<div class="ing-grid">' + list.map(function (i) { var on = have.has(i.id); return '<button class="chip' + (on ? ' on' : '') + '" data-action="fridgeToggle" data-i="' + esc(i.id) + '" aria-pressed="' + on + '">' + (on ? I('check', 'sm') : '') + esc(i.name) + '</button>'; }).join('') + (list.length ? '' : '<p class="muted">Nada con ese nombre.</p>') + '</div>';
  }
  function fridge() {
    var p = A.P(), have = p.fridge;
    var cats = U.uniq(U.arr(A.dx().ingredients).filter(function (i) { return !i.pantry; }).map(function (i) { return i.category; }));
    var pantry = U.arr(A.dx().ingredients).filter(function (i) { return i.pantry; }).map(function (i) { return i.name; });
    var res = L.fridgeMatch(L.allRecipes(p), have);
    var ready = res.filter(function (x) { return x.tier === 'lista'; }), near = res.filter(function (x) { return x.tier === 'casi'; });
    function item(x) {
      var miss = x.missing.length ? '<p class="meta">Te ' + (x.missing.length === 1 ? 'falta' : 'faltan') + ' ' + x.missing.length + ': ' + esc(x.missing.map(function (m) { return m.name; }).join(', ')) + '</p>' : '';
      return '<li class="li"><span class="score num" aria-label="' + x.score + ' por ciento">' + x.score + '</span><span class="grow"><a href="#/cocina/receta/' + encodeURIComponent(x.recipe.id) + '"><b>' + esc(x.recipe.title) + '</b></a>' + miss + '</span>' +
        (x.missing.length ? '<button class="btn sm" data-action="fridgeMissing" data-r="' + esc(x.recipe.id) + '">' + I('compras', 'sm') + '<span class="sr-only">Agregar faltantes de ' + esc(x.recipe.title) + ' a Compras</span><span aria-hidden="true">Agregar faltantes</span></button>' : '<button class="btn sm primary" data-action="cook" data-r="' + esc(x.recipe.id) + '">' + I('play', 'sm') + 'Cocinar</button>') + '</li>';
    }
    return '<p class="muted">Marcá lo que tenés y te mostramos qué cocinar. Los básicos de alacena (' + esc(pantry.join(', ') || 'sal, aceite, agua') + ') se cuentan siempre.</p>' +
      '<section class="toolbar-card mt-s">' +
      '<div class="search">' + I('buscar') + '<input class="input" type="search" id="fq" data-bind="fq" value="' + esc(A.ui.fq || '') + '" placeholder="Buscar ingrediente (también por sinónimo)" aria-label="Buscar ingrediente" autocomplete="off"></div>' +
      '<div class="chips scroll mt-s"><button class="chip' + (!A.ui.fcat ? ' on' : '') + '" data-action="fCat" data-c="">Más usados</button>' + cats.map(function (c) { var on = A.ui.fcat === c; return '<button class="chip' + (on ? ' on' : '') + '" data-action="fCat" data-c="' + esc(c) + '" aria-pressed="' + on + '">' + esc(((U.arr(L.tx().ingredientCategories).filter(function (x) { return x.id === c; })[0]) || {}).label || U.cap(c.replace(/_/g, ' '))) + '</button>'; }).join('') + '</div>' +
      '<div data-part="fing" class="mt-s">' + fridgeIngredients() + '</div>' +
      '</section>' +
      (have.length ? '<p class="meta mt-s">Tenés ' + U.plural(have.length, 'ingrediente') + ' marcados · <button class="btn ghost sm" data-action="fridgeClear">Vaciar</button></p>' : '') +
      '<div class="tier-h"><h2>Listas para cocinar</h2><span class="meta">' + ready.length + '</span></div>' + (ready.length ? '<ul class="list card">' + ready.map(item).join('') + '</ul>' : '<p class="muted">Todavía ninguna. Marcá más ingredientes.</p>') +
      '<div class="tier-h"><h2>Te falta poco</h2><span class="meta">' + near.length + '</span></div>' + (near.length ? '<ul class="list card">' + near.map(item).join('') + '</ul>' : '<p class="muted">Ninguna a 1 o 2 ingredientes.</p>');
  }
  A.binds.fq = U.debounce(function (el) { A.ui.fq = el.value; A.refresh('fing'); }, 120);
  A.actions.fCat = function (el) { A.ui.fcat = el.dataset.c; A.render(); };
  A.actions.fridgeToggle = function (el) {
    var id = el.dataset.i;
    A.update(function (s, p) { var i = p.fridge.indexOf(id); if (i > -1) p.fridge.splice(i, 1); else p.fridge.push(id); p.fridgeU = Date.now(); });
  };
  A.actions.fridgeClear = function () { var old = A.P().fridge.slice(); A.update(function (s, p) { p.fridge = []; p.fridgeU = Date.now(); }); A.toast('Heladera vacía', { action: { label: 'Deshacer', fn: function () { A.update(function (s, p) { p.fridge = old; p.fridgeU = Date.now(); }); } } }); };
  A.actions.fridgeMissing = function (el) {
    var p = A.P(), r = L.recipe(el.dataset.r, p);
    var x = L.fridgeMatch([r], p.fridge)[0];
    var n = A.addToShopping(x.missing.filter(function (m) { return m.item; }).map(function (m) { var g = L.ingredient(m.item); return { text: g ? g.name : m.name, store: g ? g.store : 'super', ingredient: m.item }; }), 'heladera');
    A.toast(n ? 'Agregaste ' + U.plural(n, 'faltante') + ' a Compras' : 'Ya estaban en Compras', { action: { label: 'Ver', fn: function () { A.go('/compras'); } } });
  };

  /* ================= plan semanal ================= */
  function weekStart() { return A.ui.week || U.mondayOf(A.today()); }
  function plan() {
    var p = A.P(), w = weekStart(), today = A.today();
    var days = []; for (var i = 0; i < 7; i++) days.push(U.addDays(w, i));
    var cards = days.map(function (d) {
      var pd = p.plan[d] || {};
      return '<section class="wd' + (d === today ? ' today' : '') + '" aria-label="' + esc(U.fmtDate(d)) + '"><h3><span>' + esc(U.cap(U.fmtDate(d, 'day'))) + '</span>' + (d === today ? '<span class="tag bloom">hoy</span>' : '') + '</h3>' +
        L.slots().map(function (s) {
          var ids = U.arr(pd[s.id]);
          return '<div class="ws"><span>' + esc(s.label) + '</span>' + ids.map(function (rid, n) {
            var r = L.recipe(rid, p);
            return '<div class="plan-item">' + (r ? '<a href="#/cocina/receta/' + encodeURIComponent(rid) + '">' + esc(r.title) + '</a>' : '<span class="grow muted">Receta borrada</span>') +
              '<button class="icon-btn sm" data-action="planMove" data-d="' + d + '" data-s="' + s.id + '" data-n="' + n + '" aria-label="Mover ' + esc(r ? r.title : '') + ' a otro día">' + I('calendario', 'sm') + '</button>' +
              '<button class="icon-btn sm" data-action="planDel" data-d="' + d + '" data-s="' + s.id + '" data-n="' + n + '" aria-label="Quitar ' + esc(r ? r.title : '') + '">' + I('cerrar', 'sm') + '</button></div>';
          }).join('') + '<button class="btn ghost sm" data-action="planAddSheet" data-d="' + d + '" data-s="' + s.id + '" aria-label="Agregar a ' + esc(s.label) + ' del ' + esc(U.fmtDate(d)) + '">' + I('mas', 'sm') + 'Agregar</button></div>';
        }).join('') + '</section>';
    }).join('');
    var n = L.planEntries(p.plan, w, U.addDays(w, 6)).length;
    return '<section class="toolbar-card"><div class="row wrap between"><div class="row"><button class="icon-btn" data-action="weekNav" data-n="-7" aria-label="Semana anterior">' + I('chev-izq') + '</button><h2 class="serif">' + esc(U.fmtDate(w, 'short')) + ' al ' + esc(U.fmtDate(U.addDays(w, 6), 'short')) + '</h2><button class="icon-btn" data-action="weekNav" data-n="7" aria-label="Semana siguiente">' + I('chev') + '</button>' +
      (w !== U.mondayOf(today) ? '<button class="btn ghost sm" data-action="weekNav" data-n="0">Esta semana</button>' : '') + '</div>' +
      '<div class="btn-row"><button class="btn sm" data-action="planCopyPrev">' + I('copiar', 'sm') + 'Copiar semana anterior</button>' + (n ? '<button class="btn sm danger" data-action="planClear">' + I('borrar', 'sm') + 'Limpiar</button>' : '') + '</div></div></section>' +
      (n ? '<div class="banner info mt-s">' + I('compras') + '<div class="grow"><b>' + U.plural(n, 'comida planificada', 'comidas planificadas') + '.</b>La lista de compras y los remojos se arman solos con este plan.</div><a class="btn sm" href="#/compras">Compras</a><a class="btn sm" href="#/cocina/remojos">Remojos</a></div>' : '<p class="muted mt-s">Planificá tocando «Agregar» en cada momento o desde una receta con «Al plan».</p>') +
      '<div class="week mt">' + cards + '</div>';
  }
  A.actions.weekNav = function (el) { var n = +el.dataset.n; A.ui.week = n === 0 ? null : U.addDays(weekStart(), n); A.render(); };
  A.actions.planDel = function (el) { A.planRemove(el.dataset.d, el.dataset.s, +el.dataset.n); };
  A.actions.planMove = function (el) {
    var d = el.dataset.d, s = el.dataset.s, n = +el.dataset.n, rid = A.P().plan[d][s][n];
    A.ui.planPick = { r: rid, date: d, slot: s, move: { date: d, slot: s, i: n } };
    A.openSheet({ title: 'Mover a…', body: planPickBody(), foot: '<button class="btn primary" data-action="planPickSave">Mover</button>' });
  };
  A.actions.planAddSheet = function (el) {
    A.ui.planAdd = { d: el.dataset.d, s: el.dataset.s };
    var ph = curPhase();
    A.openSheet({ title: 'Agregar al ' + (L.idx().slots[el.dataset.s] || {}).label.toLowerCase() + ' · ' + U.fmtDate(el.dataset.d, 'day'),
      body: '<div class="search">' + I('buscar') + '<input class="input" id="pq" data-bind="planSearch" placeholder="Buscar receta" autocomplete="off" aria-label="Buscar receta"></div><div id="plan-results" class="mt-s">' + planResults('') + '</div>', focus: '#pq' });
  };
  function planResults(q) {
    var p = A.P(), slot = A.ui.planAdd.s;
    var list = L.allRecipes(p).filter(function (r) { return q ? U.matchQuery(r.title + ' ' + U.arr(r.ingredients).map(function (i) { return i.text; }).join(' '), q) : (!r.slots || r.slots.indexOf(slot) > -1); });
    list = list.filter(function (r) { return !L.recipeAllergyHits(r, p).any; }).concat(list.filter(function (r) { return L.recipeAllergyHits(r, p).any; }));
    return '<ul class="list">' + list.slice(0, 30).map(function (r) { return '<li><button class="li" data-action="planAddPick" data-r="' + esc(r.id) + '"><span class="grow"><b>' + esc(r.title) + '</b> ' + K.allergenTags(r, p) + '</span>' + I('mas', 'chev') + '</button></li>'; }).join('') + '</ul>';
  }
  A.binds.planSearch = U.debounce(function (el) { document.getElementById('plan-results').innerHTML = planResults(el.value); }, 100);
  A.actions.planAddPick = function (el) { A.planAdd(A.ui.planAdd.d, A.ui.planAdd.s, el.dataset.r); A.closeDialog(); };
  A.actions.planCopyPrev = function () {
    var w = weekStart();
    A.update(function (s, p) {
      for (var i = 0; i < 7; i++) {
        var from = p.plan[U.addDays(w, i - 7)]; if (!from) continue;
        var to = p.plan[U.addDays(w, i)] = p.plan[U.addDays(w, i)] || {};
        L.slotIds().forEach(function (sl) { if (from[sl] && from[sl].length) to[sl] = U.arr(to[sl]).concat(from[sl]); });
        to.u = Date.now();
      }
    });
    A.toast('Copiamos la semana anterior');
  };
  A.actions.planClear = function () {
    var w = weekStart();
    A.confirm({ title: 'Limpiar la semana', text: 'Se quitan todas las comidas planificadas de esta semana.', ok: 'Limpiar', danger: true }).then(function (ok) {
      if (!ok) return;
      A.update(function (s, p) { for (var i = 0; i < 7; i++) { var d = U.addDays(w, i); if (p.plan[d]) p.plan[d] = { u: Date.now() }; } });
    });
  };

  /* ================= batch ================= */
  function batch() {
    var p = A.P(), list = U.arr(A.dx().prep && A.dx().prep.batch);
    var w = U.mondayOf(A.today());
    var planned = new Set(L.planEntries(p.plan, w, U.addDays(w, 6)).map(function (e) { return e.recipeId; }));
    var total = 0;
    var cards = list.map(function (b) {
      var uses = U.arr(b.recipes).filter(function (id) { return planned.has(id); });
      if (uses.length) total += b.savesMin || 0;
      return '<section class="card" id="b-' + esc(b.id) + '"><div class="card-h"><h2>' + esc(b.name) + '</h2>' + (uses.length ? '<span class="tag accent">en tu plan</span>' : '') + '</div>' +
        (b.desc ? '<p>' + esc(b.desc) + '</p>' : '') +
        '<div class="recipe-meta"><span>' + I('heladera', 'sm') + 'Heladera: ' + U.plural(b.fridgeDays || 0, 'día') + '</span><span>' + I('frasco', 'sm') + (b.freezer ? 'Freezer: ' + U.plural(b.freezerDays || 0, 'día') : 'No apta para freezer') + '</span>' + (b.yield ? '<span>' + I('bowl', 'sm') + esc(b.yield) + '</span>' : '') + (b.savesMin ? '<span>' + I('reloj', 'sm') + 'ahorra ~' + U.fmtMin(b.savesMin) + ' por semana</span>' : '') + '</div>' +
        (b.method ? '<p class="meta mt-s">' + esc(b.method) + '</p>' : '') +
        (U.arr(b.steps).length ? '<details class="mt-s"><summary>Cómo hacerla</summary><ol class="steps mt-s">' + b.steps.map(function (s) { return '<li><p>' + esc(s) + '</p></li>'; }).join('') + '</ol></details>' : '') +
        (U.arr(b.recipes).length ? '<p class="label mt">Recetas que la usan</p><div class="chips">' + b.recipes.map(function (id) { var r = L.recipe(id, p); return r ? '<a class="chip' + (planned.has(id) ? ' on' : '') + '" href="#/cocina/receta/' + encodeURIComponent(id) + '">' + esc(r.title) + '</a>' : ''; }).join('') + '</div>' : '') + '</section>';
    }).join('');
    if (!list.length) return K.empty('Sin bases cargadas', 'Faltan los datos de batch cooking.', '');
    return '<p class="muted">Cociná una vez y resolvé varias comidas de la semana.</p>' + (total ? '<div class="banner info">' + I('reloj') + '<div class="grow"><b>Con tu plan de esta semana ahorrás ~' + U.fmtMin(total) + '.</b>Hacé estas bases el fin de semana.</div></div>' : '<div class="banner info">' + I('calendario') + '<div class="grow">Planificá la semana y te decimos cuánto tiempo ahorrás con cada base.</div><a class="btn sm" href="#/cocina/plan">Ir al plan</a></div>') + '<div class="stack">' + cards + '</div>';
  }

  /* ================= remojos ================= */
  function soaks() {
    var p = A.P(), today = A.today(), list = U.arr(A.dx().prep && A.dx().prep.soaking);
    var upcoming = [];
    for (var i = 0; i <= 3; i++) {
      var d = U.addDays(today, i);
      L.planEntries(p.plan, d, d).forEach(function (e) {
        L.soaksForRecipes([e.recipeId], p).forEach(function (s) {
          var meal = U.dateObj(e.date); var hm = MEAL_TIME[e.slot].split(':'); meal.setHours(+hm[0], +hm[1], 0, 0);
          var start = new Date(meal.getTime() - (s.soak.optH || s.soak.minH || 8) * 3600000);
          if (start.getTime() < Date.now() - 6 * 3600000 && i === 0) return;
          upcoming.push({ s: s.soak, r: L.recipe(e.recipeId, p), e: e, start: start });
        });
      });
    }
    upcoming.sort(function (a, b) { return a.start - b.start; });
    var top = upcoming.length ? '<section class="card tint"><h2 class="mb">Para tu plan de los próximos días</h2><ul class="list">' + upcoming.map(function (u) {
      var when = U.isoFromTs(u.start.getTime()) === today ? 'hoy' : U.fmtDate(U.isoFromTs(u.start.getTime()), 'day');
      return '<li class="li">' + I('frasco') + '<span class="grow"><b>' + esc(u.s.name) + '</b><span class="meta">Poner en remojo ' + esc(when) + ' a las ' + U.fmtTime(u.start.getTime()) + ' · para ' + esc(u.r.title) + ' (' + esc(U.fmtDate(u.e.date, 'day')) + ', ' + esc((L.idx().slots[u.e.slot] || {}).label.toLowerCase()) + ')</span></span>' +
        '<span class="tag ' + (u.s.discardWater ? 'clay' : 'accent') + '">' + (u.s.discardWater ? 'Descartar el agua' : 'No descartar el agua') + '</span></li>';
    }).join('') + '</ul></section>' : '<div class="banner info">' + I('calendario') + '<div class="grow">Cuando planifiques comidas, acá aparece qué poner en remojo y a qué hora.</div><a class="btn sm" href="#/cocina/plan">Ir al plan</a></div>';
    return top + '<h2 class="section-title">Todas las reglas</h2><div class="grid-cards">' + list.map(function (s) {
      return '<section class="card" id="s-' + esc(s.id) + '"><h3>' + esc(s.name) + '</h3><p class="recipe-meta mt-s"><span>' + I('reloj', 'sm') + esc(s.label || (s.minH + ' a ' + s.optH + ' h')) + '</span>' + (s.medium ? '<span>' + I('agua', 'sm') + esc(s.medium) + '</span>' : '') + '</p>' +
        '<p class="mt-s"><span class="tag ' + (s.discardWater ? 'clay' : 'accent') + '">' + I(s.discardWater ? 'borrar' : 'check', 'sm') + (s.discardWater ? 'Descartar el agua' : 'No descartar el agua') + '</span></p>' +
        (s.purpose ? '<p class="meta">' + esc(s.purpose) + '</p>' : '') + (s.why ? '<p class="meta">' + esc(s.why) + '</p>' : '') + (s.alerts ? '<p class="note">' + esc(s.alerts) + '</p>' : '') + (s.note ? '<p class="meta">' + esc(s.note) + '</p>' : '') + (s.hoursEditorial ? '<p class="meta">Las horas son una referencia; la guía dice «la noche anterior».</p>' : '') + '</section>';
    }).join('') + '</div>';
  }

  /* ================= métodos ================= */
  function methods() {
    var m = A.dx().methods || {};
    return '<div class="grid-cards">' + U.arr(m.methods).map(function (x) {
      return '<section class="card" id="m-' + esc(x.id) + '"><h2 class="mb">' + esc(x.name) + '</h2><p>' + esc(x.desc || '') + '</p>' + (U.arr(x.steps).length ? '<ol class="steps mt-s">' + x.steps.map(function (s) { return '<li><p>' + esc(s) + '</p></li>'; }).join('') + '</ol>' : '') + (x.source ? '<p class="meta">' + esc(x.source) + '</p>' : '') + '</section>';
    }).join('') + '</div>' +
      (U.arr(m.grains).length ? '<h2 class="section-title">Cocción de granos</h2><div class="card table-wrap"><table class="cmp-table"><thead><tr><th>Grano</th><th>Proporción</th><th>Tiempo</th><th>Notas</th></tr></thead><tbody>' + m.grains.map(function (g) { return '<tr><td><b>' + esc(g.grain) + '</b></td><td>' + esc(g.ratio || '') + '</td><td>' + esc(g.time || '—') + '</td><td>' + esc(g.notes || '') + '</td></tr>'; }).join('') + '</tbody></table></div>' : '') +
      (U.arr(m.legumes).length ? '<h2 class="section-title">Legumbres digestivas</h2><section class="card"><ul class="list">' + m.legumes.map(function (l) { return '<li class="li">' + I('hoja', 'sm') + '<span class="grow">' + esc(typeof l === 'string' ? l : l.text || '') + '</span></li>'; }).join('') + '</ul></section>' : '');
  }

  /* ================= receta propia ================= */
  function recipeForm(editId, fromId) {
    var p = A.P();
    var src = editId && !fromId ? L.recipe(editId, p) : fromId ? L.recipe(fromId, p) : null;
    var isEdit = !!(editId && !fromId && src);
    var r = src || { title: '', category: 'almuerzos', time: { total: 30 }, servings: 2, ingredients: [], steps: [], allergens: [], slots: ['almuerzo', 'cena'], tags: [] };
    var cats = U.arr(L.tx().recipeCategories), algs = U.arr(L.tx().allergens);
    return K.back(isEdit ? '#/cocina/receta/' + encodeURIComponent(editId) : '#/cocina/recetas', 'Volver') +
      '<h1 class="page-h">' + (isEdit ? 'Editar receta' : fromId ? 'Duplicar como receta propia' : 'Nueva receta propia') + '</h1>' +
      '<form class="card" data-submit="saveRecipe" data-edit="' + (isEdit ? esc(editId) : '') + '">' +
      '<label class="field"><span>Nombre</span><input class="input" name="title" required maxlength="90" value="' + esc(fromId ? r.title + ' (mi versión)' : r.title) + '"></label>' +
      '<div class="grid2"><label class="field"><span>Categoría</span><select class="input" name="category">' + cats.map(function (c) { return '<option value="' + c.id + '"' + (c.id === r.category ? ' selected' : '') + '>' + esc(c.label) + '</option>'; }).join('') + '</select></label>' +
      '<div class="grid2"><label class="field"><span>Minutos</span><input class="input" name="time" type="number" min="1" max="1440" inputmode="numeric" value="' + ((r.time && r.time.total) || '') + '"></label><label class="field"><span>Porciones</span><input class="input" name="servings" type="number" min="1" max="50" inputmode="numeric" value="' + (r.servings || '') + '"></label></div></div>' +
      '<label class="field"><span>Ingredientes (uno por línea, ej.: «2 tazas de arroz yamaní»)</span><textarea class="input" name="ings" rows="7" data-bind="ingsPreview">' + esc(U.arr(r.ingredients).map(function (i) { return i.text; }).join('\n')) + '</textarea></label><div id="ings-preview" class="meta mb"></div>' +
      '<label class="field"><span>Pasos (uno por línea)</span><textarea class="input" name="steps" rows="6">' + esc(U.arr(r.steps).map(function (s) { return s.text; }).join('\n')) + '</textarea></label>' +
      '<fieldset class="field"><legend class="label">Alérgenos</legend><div class="chips">' + algs.map(function (a) { var on = U.arr(r.allergens).indexOf(a.id) > -1; return '<label class="chip soft"><input type="checkbox" name="al" value="' + a.id + '"' + (on ? ' checked' : '') + '> ' + esc(a.label) + '</label>'; }).join('') + '</div><p class="meta">Se marcan solos al guardar según los ingredientes reconocidos; revisalos.</p></fieldset>' +
      '<fieldset class="field"><legend class="label">Momentos</legend><div class="chips">' + L.slots().map(function (s) { var on = U.arr(r.slots).indexOf(s.id) > -1; return '<label class="chip soft"><input type="checkbox" name="slot" value="' + s.id + '"' + (on ? ' checked' : '') + '> ' + esc(s.label) + '</label>'; }).join('') + '</div></fieldset>' +
      '<fieldset class="field"><legend class="label">Tipo</legend><div class="chips">' + [['cocido', 'Cocida'], ['crudo', 'Cruda'], ['rapida', 'Rápida'], ['batch', 'Para batch']].map(function (t) { var on = U.arr(r.tags).indexOf(t[0]) > -1; return '<label class="chip soft"><input type="checkbox" name="tag" value="' + t[0] + '"' + (on ? ' checked' : '') + '> ' + t[1] + '</label>'; }).join('') + '</div></fieldset>' +
      '<button class="btn primary">' + I('check', 'sm') + 'Guardar receta</button></form>';
  }
  A.binds.ingsPreview = U.debounce(function (el) {
    var lines = el.value.split('\n').filter(function (x) { return x.trim(); });
    var rec = lines.map(function (l) { return L.parseIngredientLine(l); }).filter(function (x) { return x && x.item; });
    var box = document.getElementById('ings-preview');
    if (box) box.textContent = lines.length ? 'Reconocemos ' + rec.length + ' de ' + lines.length + ' ingredientes del catálogo (sirven para la heladera y las compras).' : '';
  }, 250);
  A.actions.saveRecipe = function (f) {
    var title = f.elements.title.value.trim(); if (!title) return A.toast('Poné un nombre');
    var ings = f.ings.value.split('\n').map(function (l) { return L.parseIngredientLine(l); }).filter(Boolean);
    if (!ings.length) return A.toast('Agregá al menos un ingrediente');
    var steps = f.steps.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean).map(function (t) { var m = /(\d+)\s*(?:a\s*\d+\s*)?min/i.exec(t); return { text: t, timer: m ? +m[1] * 60 : null }; });
    if (!steps.length) return A.toast('Agregá al menos un paso');
    var vals = function (n) { return Array.prototype.slice.call(f.querySelectorAll('input[name="' + n + '"]:checked')).map(function (x) { return x.value; }); };
    var al = vals('al');
    ings.forEach(function (i) { var g = i.item && L.ingredient(i.item); if (g && !i.optional) U.arr(g.allergens).forEach(function (a) { if (al.indexOf(a) < 0) al.push(a); }); });
    var editId = f.dataset.edit;
    var id = editId || ('my-' + U.norm(title).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) + '-' + Date.now().toString(36).slice(-4));
    var tags = vals('tag');
    var rec = { id: id, title: title, category: f.category.value, time: f.time.value ? { total: +f.time.value, active: null } : null, method: '', servings: f.servings.value ? +f.servings.value : null,
      ingredients: ings, steps: steps, tip: '', allergens: U.uniq(al), phases: ['general'], slots: vals('slot'), thermal: tags.indexOf('cocido') > -1 ? 'calido' : null, tags: tags, limits: null, source: 'receta propia', note: null, updatedAt: Date.now() };
    A.update(function (s, p) {
      var i = p.customRecipes.findIndex(function (r) { return r.id === id; });
      if (i > -1) p.customRecipes[i] = rec; else p.customRecipes.push(rec);
    });
    A.toast('Receta guardada');
    A.go('/cocina/receta/' + id);
  };
})(typeof window !== 'undefined' ? window : globalThis);
