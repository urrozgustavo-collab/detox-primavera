/* Detox v2 — Compras: lista de la semana (desde el plan + propios) y lista base del programa. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic, K = A.kit, esc = U.esc, I = A.icon;

  function range(which) {
    var r = L.shopRange(A.today(), which || A.ui.shopRange || 'esta');
    return [r.from, r.to, r.label];
  }
  function isChecked(p, id) { return (p.shopping.checked[id] || 0) > 0; }
  function storeOrder(p) {
    var def = L.stores().map(function (s) { return s.id; });
    var o = U.arr(p.shopping.storeOrder).filter(function (id) { return def.indexOf(id) > -1; });
    def.forEach(function (id) { if (o.indexOf(id) < 0) o.push(id); });
    return o;
  }
  /* Ítems de la vista «semana»: plan + propios */
  function weekItems(p, which) {
    var r = range(which);
    var agg = L.aggregateIngredients(L.planEntries(p.plan, r[0], r[1]), p, p.settings.servings);
    var items = agg.map(function (g) {
      var names = g.recipes.map(function (id) { var x = L.recipe(id, p); return x ? x.title : ''; }).filter(Boolean);
      return { id: 'plan:' + g.item, text: g.name, qty: L.fmtParts(g), store: g.store, src: 'Para ' + names.slice(0, 2).join(', ') + (names.length > 2 ? ' y ' + (names.length - 2) + ' más' : ''), ingredient: g.item, kind: 'plan', optional: g.optional, have: p.fridge.indexOf(g.item) > -1 };
    });
    p.shopping.custom.filter(function (c) { return !c.deleted; }).forEach(function (c) {
      items.push({ id: c.id, text: c.text, qty: c.qty, store: c.store || 'super', src: c.from === 'heladera' ? 'Faltante de la heladera' : c.from === 'receta' ? 'Desde una receta' : '', ingredient: c.ingredient, kind: 'custom', checkedCustom: !!c.checked });
    });
    return items;
  }
  function baseItems(p) {
    return U.arr(A.dx().shopping).map(function (s) { return { id: s.id, text: s.item, qty: s.qty, store: s.store, essential: s.essential, stage: s.stage, ingredient: s.ingredient, kind: 'base' }; });
  }
  function done(p, it) { return it.kind === 'custom' ? it.checkedCustom : isChecked(p, it.id); }

  var badgeMemo = { k: null, v: 0 };
  A.shoppingBadge = function () {
    var p = A.P(); if (!p) return 0;
    var k = A.ver + '|' + A.today();
    if (badgeMemo.k === k) return badgeMemo.v;
    var v = weekItems(p, 'esta').filter(function (it) { return !done(p, it) && !it.have; }).length;
    badgeMemo = { k: k, v: v };
    return v;
  };

  A.screens.compras = {
    render: function (route) {
      var p = A.P(), view = route.parts[0] === 'base' ? 'base' : 'semana';
      var items = view === 'base' ? baseItems(p) : weekItems(p);
      if (view === 'base' && A.ui.onlyEss) items = items.filter(function (x) { return x.essential; });
      var order = storeOrder(p);
      var groups = order.map(function (sid) { return { id: sid, label: L.storeLabel(sid), items: items.filter(function (x) { return x.store === sid; }) }; });
      var others = items.filter(function (x) { return order.indexOf(x.store) < 0; });
      if (others.length) groups.push({ id: 'otros', label: 'Otros', items: others });
      groups = groups.filter(function (g) { return g.items.length; });
      var pending = items.filter(function (x) { return !done(p, x) && !x.have; }).length;
      var r = range();
      var h = ['<header class="page-h"><h1>Compras</h1></header>'];
      h.push('<nav class="seg subnav" aria-label="Listas"><a href="#/compras"' + (view === 'semana' ? ' aria-current="page"' : '') + '>Para esta semana</a><a href="#/compras/base"' + (view === 'base' ? ' aria-current="page"' : '') + '>Lista base del programa</a></nav>');
      if (view === 'semana') {
        var cur = A.ui.shopRange || 'esta';
        h.push('<div class="row wrap between"><div class="seg" role="group" aria-label="Rango">' + [['esta', 'Esta semana'], ['proxima', 'Próxima semana'], ['3', 'Próximos 3 días']].map(function (o) { return '<button data-action="shopRange" data-v="' + o[0] + '" aria-pressed="' + (cur === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div><span class="meta">Del ' + esc(U.fmtDate(r[0], 'short')) + ' al ' + esc(U.fmtDate(r[1], 'short')) + ' (semana de lunes a domingo, como el Plan)</span></div>');
        if (!L.planEntries(p.plan, r[0], r[1]).length) h.push('<div class="banner info mt-s">' + I('calendario') + '<div class="grow"><b>No hay comidas planificadas para ' + esc(r[2]) + '.</b>Planificá en Cocina y los ingredientes aparecen acá sumados por comercio.</div><a class="btn sm" href="#/cocina/plan">Planificar</a></div>');
      } else {
        h.push('<p class="muted">El listado de la guía para todo el programa. Los esenciales están marcados.</p>');
      }
      h.push('<form class="row mt" data-submit="shopAdd"><input class="input" name="t" list="ing-dl" placeholder="Agregar algo a la lista…" aria-label="Agregar a la lista" autocomplete="off" maxlength="80"><button class="btn primary">' + I('mas', 'sm') + '<span class="sr-only">Agregar</span></button></form>' +
        '<datalist id="ing-dl">' + U.arr(A.dx().ingredients).map(function (i) { return '<option value="' + esc(i.name) + '">'; }).join('') + '</datalist>');
      var stores = groups.map(function (g) { return g.id; });
      h.push('<div class="chips scroll mt"><button class="chip' + (!A.ui.shopStore ? ' on' : '') + '" data-action="shopStore" data-s="" aria-pressed="' + !A.ui.shopStore + '">Todos <span class="meta">' + pending + '</span></button>' +
        groups.map(function (g) { var n = g.items.filter(function (x) { return !done(p, x) && !x.have; }).length, on = A.ui.shopStore === g.id; return '<button class="chip' + (on ? ' on' : '') + '" data-action="shopStore" data-s="' + g.id + '" aria-pressed="' + on + '">' + esc(g.label) + ' <span class="meta">' + n + '</span></button>'; }).join('') + '</div>');
      h.push('<div class="row wrap mt-s"><label class="switch" style="min-height:40px;gap:8px"><input type="checkbox" data-change="hideBought"' + (A.ui.hideBought ? ' checked' : '') + '><span>Ocultar comprados</span></label>' +
        (view === 'base' ? '<label class="switch" style="min-height:40px;gap:8px"><input type="checkbox" data-change="onlyEss"' + (A.ui.onlyEss ? ' checked' : '') + '><span>Solo esenciales</span></label>' : '') + '</div>');
      if (!items.length) h.push(K.empty(view === 'base' ? 'La lista base está vacía' : 'Nada para comprar', view === 'base' ? '' : 'Agregá algo arriba o planificá comidas.', ''));
      var shown = groups.filter(function (g) { return !A.ui.shopStore || g.id === A.ui.shopStore; });
      if (A.ui.shopStore && stores.indexOf(A.ui.shopStore) < 0) shown = groups;
      shown.forEach(function (g) {
        var rank = function (x) { return done(p, x) ? 2 : x.have ? 1 : 0; };
        var list = g.items.slice().sort(function (a, b) { return rank(a) - rank(b); });
        if (A.ui.hideBought) list = list.filter(function (x) { return !done(p, x); });
        var n = g.items.filter(function (x) { return !done(p, x) && !x.have; }).length;
        h.push('<section class="shop-store" aria-label="' + esc(g.label) + '"><h3><span class="serif">' + esc(g.label) + '</span><span class="meta">' + (n ? n + ' por comprar' : 'todo comprado') + '</span></h3>' +
          (list.length ? '<ul class="list card" style="padding:4px 14px">' + list.map(function (it) { return row(p, it); }).join('') + '</ul>' : '') + '</section>');
      });
      h.push('<div class="btn-row mt"><button class="btn" data-action="shopShare" data-v="' + view + '">' + I('compartir', 'sm') + 'Compartir pendientes</button>' +
        (view === 'semana' ? '<button class="btn" data-action="shopClearDone">' + I('borrar', 'sm') + 'Quitar comprados propios</button>' : '<button class="btn" data-action="shopResetBase">' + I('refrescar', 'sm') + 'Desmarcar todo</button>') +
        '<button class="btn ghost" data-action="shopOrder">' + I('lista', 'sm') + 'Ordenar comercios</button></div>');
      return h.join('');
    }
  };
  function row(p, it) {
    var d = done(p, it);
    var hit = L.textAllergyHits(it.text, it.ingredient, p);
    return '<li class="shop-item' + (d ? ' is-done' : it.have ? ' is-have' : '') + '" id="sh-' + esc(it.id) + '"><button class="tick sq' + (d ? ' on' : '') + '" data-action="shopToggle" data-id="' + esc(it.id) + '" data-k="' + it.kind + '" aria-pressed="' + d + '" aria-label="' + (d ? 'Desmarcar ' : 'Marcar como comprado: ') + esc(it.text) + '">' + I('check') + '</button>' +
      '<span class="grow"><b>' + esc(it.text) + '</b>' + (it.qty ? ' <span class="meta">· ' + esc(it.qty) + '</span>' : '') + (it.have && !d ? ' <span class="tag accent">' + I('heladera', 'sm') + 'ya tenés</span>' : '') + (it.essential ? ' <span class="tag accent">esencial</span>' : '') + (it.stage === 'previa' ? ' <span class="tag bloom">para empezar</span>' : '') +
      (hit.any ? ' <span class="tag alert">' + I('alerta', 'sm') + 'tu alergia</span>' : '') + (it.src ? '<span class="src">' + esc(it.src) + '</span>' : '') + '</span>' +
      (it.kind === 'custom' ? '<button class="icon-btn sm" data-action="shopDel" data-id="' + esc(it.id) + '" aria-label="Quitar ' + esc(it.text) + '">' + I('cerrar', 'sm') + '</button>' : '') + '</li>';
  }
  A.actions.shopRange = function (el) { A.ui.shopRange = el.dataset.v; A.render(); };
  A.actions.shopStore = function (el) { A.ui.shopStore = el.dataset.s || null; A.render(); };
  A.changes.hideBought = function (el) { A.ui.hideBought = el.checked; A.render(); };
  A.changes.onlyEss = function (el) { A.ui.onlyEss = el.checked; A.render(); };
  A.actions.shopToggle = function (el) {
    var id = el.dataset.id, kind = el.dataset.k;
    A.update(function (s, p) {
      if (kind === 'custom') p.shopping.custom.forEach(function (c) { if (c.id === id) { c.checked = !c.checked; c.updatedAt = Date.now(); } });
      else { var cur = p.shopping.checked[id] || 0; p.shopping.checked[id] = cur > 0 ? -Date.now() : Date.now(); }
    });
  };
  A.actions.shopDel = function (el) {
    var id = el.dataset.id;
    A.update(function (s, p) { p.shopping.custom.forEach(function (c) { if (c.id === id) { c.deleted = true; c.updatedAt = Date.now(); } }); });
    A.toast('Quitado', { action: { label: 'Deshacer', fn: function () { A.update(function (s, p) { p.shopping.custom.forEach(function (c) { if (c.id === id) { delete c.deleted; c.updatedAt = Date.now(); } }); }); } } });
  };
  A.actions.shopAdd = function (f) {
    var t = f.t.value.trim(); if (!t) return;
    var parsed = L.parseIngredientLine(t);
    var ing = parsed && parsed.item ? L.ingredient(parsed.item) : null;
    var qty = parsed && parsed.qty != null ? U.fmtQty(parsed.qty, parsed.unit === 'unidad' ? '' : parsed.unit) : '';
    var text = ing && U.norm(t).indexOf(U.norm(ing.name)) > -1 && qty ? ing.name : t;
    A.update(function (s, p) { p.shopping.custom.push({ id: U.uid('c'), text: qty && text !== t ? text : t, store: ing ? ing.store : 'super', qty: qty && text !== t ? qty : '', checked: false, from: 'manual', t: Date.now(), updatedAt: Date.now(), ingredient: ing ? ing.id : null }); });
    var inp = document.querySelector('form[data-submit="shopAdd"] input'); if (inp) inp.focus();
  };
  A.actions.shopClearDone = function () {
    var ids = A.P().shopping.custom.filter(function (c) { return c.checked && !c.deleted; }).map(function (c) { return c.id; });
    if (!ids.length) return A.toast('No hay ítems propios comprados');
    A.update(function (s, p) { p.shopping.custom.forEach(function (c) { if (ids.indexOf(c.id) > -1) { c.deleted = true; c.updatedAt = Date.now(); } }); });
    A.toast('Quitaste ' + U.plural(ids.length, 'ítem'), { action: { label: 'Deshacer', fn: function () { A.update(function (s, p) { p.shopping.custom.forEach(function (c) { if (ids.indexOf(c.id) > -1) { delete c.deleted; c.updatedAt = Date.now(); } }); }); } } });
  };
  A.actions.shopResetBase = function () {
    A.confirm({ title: 'Desmarcar la lista base', text: 'Todos los ítems de la lista base vuelven a quedar pendientes.', ok: 'Desmarcar' }).then(function (ok) {
      if (!ok) return;
      A.update(function (s, p) { U.arr(A.dx().shopping).forEach(function (x) { if ((p.shopping.checked[x.id] || 0) > 0) p.shopping.checked[x.id] = -Date.now(); }); });
    });
  };
  A.actions.shopShare = function (el) {
    var p = A.P(), view = el.dataset.v;
    var items = (view === 'base' ? baseItems(p) : weekItems(p)).filter(function (x) { return !done(p, x) && !x.have; });
    var groups = storeOrder(p).map(function (sid) { return { label: L.storeLabel(sid), items: items.filter(function (x) { return x.store === sid; }).map(function (x) { return { text: x.text, qty: x.qty }; }) }; });
    var text = L.shoppingText(groups, view === 'base' ? 'Lista base del detox' : 'Compras ' + range()[2]);
    if (!text) return A.toast('No hay pendientes para compartir');
    A.share({ title: 'Lista de compras', text: text });
  };
  A.actions.shopOrder = function () {
    A.openSheet({ title: 'Ordenar comercios', body: orderBody() });
  };
  function orderBody() {
    var o = storeOrder(A.P());
    return '<p class="muted">En el orden en que recorrés los comercios.</p><ul class="list">' + o.map(function (id, i) {
      return '<li class="li"><span class="grow">' + esc(L.storeLabel(id)) + '</span><button class="icon-btn sm" data-action="storeMove" data-i="' + i + '" data-d="-1" aria-label="Subir ' + esc(L.storeLabel(id)) + '"' + (i === 0 ? ' disabled' : '') + '>' + I('arriba', 'sm') + '</button><button class="icon-btn sm" data-action="storeMove" data-i="' + i + '" data-d="1" aria-label="Bajar ' + esc(L.storeLabel(id)) + '"' + (i === o.length - 1 ? ' disabled' : '') + '>' + I('abajo', 'sm') + '</button></li>';
    }).join('') + '</ul>';
  }
  A.actions.storeMove = function (el) {
    var i = +el.dataset.i, d = +el.dataset.d;
    A.update(function (s, p) { var o = storeOrder(p); var x = o[i]; o[i] = o[i + d]; o[i + d] = x; p.shopping.storeOrder = o; p.shopping.storeOrderU = Date.now(); });
    document.querySelector('#sheet .sheet-b').innerHTML = orderBody();
    var b = document.querySelector('#sheet [data-i="' + (i + d) + '"][data-d="' + d + '"]') || document.querySelector('#sheet [data-i="' + (i + d) + '"]'); if (b) b.focus();
  };
})(typeof window !== 'undefined' ? window : globalThis);
