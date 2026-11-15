/* Detox v2 — fusión determinística de perfiles (sync e importación «Fusionar»).
   Reglas (§3.3): por edición y día, cada parte gana por su marca _u; comidas por id con lápidas;
   compras por marca de tiempo (valor negativo = destildado); recetario por unión; settings por updatedAt. */
(function (root) {
  'use strict';
  var A = root.DXApp, U = A.util, L = A.logic;

  function cmp(a, b) { var x = JSON.stringify(a), y = JSON.stringify(b); return x === y ? 0 : x > y ? 1 : -1; }
  /* Gana el de marca mayor; empate → comparación estable del contenido (resultado igual en ambos sentidos). */
  function pick(a, ta, b, tb) {
    if (a === undefined) return b; if (b === undefined) return a;
    ta = Number(ta) || 0; tb = Number(tb) || 0;
    if (ta !== tb) return ta > tb ? a : b;
    return cmp(a, b) >= 0 ? a : b;
  }
  function byIdLWW(la, lb, ts) {
    var m = Object.create(null), order = [];
    U.arr(la).concat(U.arr(lb)).forEach(function (x) {
      if (!x || x.id == null) return;
      if (!m[x.id]) { m[x.id] = x; order.push(x.id); }
      else m[x.id] = pick(m[x.id], ts(m[x.id]), x, ts(x));
    });
    order.sort();
    return order.map(function (id) { return U.clone(m[id]); });
  }
  function mealTs(x) { return x.u || x.t || 0; }
  L.mergeMeals = function (a, b) {
    var m = Object.create(null);
    U.arr(a).concat(U.arr(b)).forEach(function (x) {
      if (!x || x.id == null) return;
      var cur = m[x.id];
      if (!cur) { m[x.id] = x; return; }
      var tc = mealTs(cur), tx = mealTs(x);
      if (tc !== tx) m[x.id] = tx > tc ? x : cur;
      else if (!!x.deleted !== !!cur.deleted) m[x.id] = x.deleted ? x : cur;   // empate: la lápida gana
      else m[x.id] = cmp(x, cur) >= 0 ? x : cur;
    });
    return Object.keys(m).map(function (k) { return U.clone(m[k]); }).sort(function (x, y) { return (x.t || 0) - (y.t || 0) || (x.id < y.id ? -1 : 1); });
  };
  L.mergeDay = function (a, b) {
    if (!a) return U.clone(b); if (!b) return U.clone(a);
    a = L.normalizeDay(U.clone(a)); b = L.normalizeDay(U.clone(b));
    var ua = a._u || {}, ub = b._u || {};
    var out = L.newDay();
    out._u = {};
    ['habits', 'water', 'checkin'].forEach(function (part) {
      var ta = ua[part] || 0, tb = ub[part] || 0;
      out[part] = U.clone(pick(a[part], ta, b[part], tb));
      out._u[part] = Math.max(ta, tb);
    });
    var slots = U.uniq(Object.keys(a.meals).concat(Object.keys(b.meals))).sort();
    out.meals = {};
    slots.forEach(function (s) { out.meals[s] = L.mergeMeals(a.meals[s], b.meals[s]); });
    out._u.meals = Math.max(ua.meals || 0, ub.meals || 0);
    out.updatedAt = Math.max(a.updatedAt || 0, b.updatedAt || 0);
    return out;
  };
  function mergeTsMap(a, b) {
    var out = {};
    U.uniq(Object.keys(a || {}).concat(Object.keys(b || {}))).sort().forEach(function (k) {
      var x = a && a[k], y = b && b[k];
      if (x == null) out[k] = y; else if (y == null) out[k] = x;
      else out[k] = Math.abs(x) === Math.abs(y) ? Math.max(x, y) : (Math.abs(x) > Math.abs(y) ? x : y);
    });
    return out;
  }
  L.mergeProfile = function (local, remote) {
    if (!remote) return U.clone(local);
    if (!local) return U.clone(remote);
    var a = U.clone(local), b = U.clone(remote);
    var out = U.clone(pick(a, a.updatedAt, b, b.updatedAt));   // metadatos (nombre, color, emoji, edición activa)
    out.id = a.id;
    // settings por updatedAt, pero el bloque sync es del dispositivo: se conserva el local.
    var localSync = (a.settings && a.settings.sync) || L.newSettings().sync;
    out.settings = U.clone(pick(a.settings, a.settings && a.settings.updatedAt, b.settings, b.settings && b.settings.updatedAt));
    out.settings.sync = U.clone(localSync);
    // ediciones por id (gana updatedAt)
    out.editions = {};
    U.uniq(Object.keys(a.editions || {}).concat(Object.keys(b.editions || {}))).sort().forEach(function (id) {
      var x = a.editions && a.editions[id], y = b.editions && b.editions[id];
      out.editions[id] = U.clone(pick(x, x && x.updatedAt, y, y && y.updatedAt));
    });
    if (out.activeEdition && !out.editions[out.activeEdition]) out.activeEdition = a.activeEdition || null;
    // días
    out.days = {};
    U.uniq(Object.keys(a.days || {}).concat(Object.keys(b.days || {}))).sort().forEach(function (eid) {
      var da = (a.days && a.days[eid]) || {}, db = (b.days && b.days[eid]) || {};
      out.days[eid] = {};
      U.uniq(Object.keys(da).concat(Object.keys(db))).sort(function (x, y) { return x - y; }).forEach(function (k) { out.days[eid][k] = L.mergeDay(da[k], db[k]); });
    });
    // recetario: unión
    var ra = a.recipeLog || {}, rb = b.recipeLog || {};
    var cooked = {};
    U.uniq(Object.keys(ra.cooked || {}).concat(Object.keys(rb.cooked || {}))).sort().forEach(function (id) {
      cooked[id] = U.uniq(U.arr((ra.cooked || {})[id]).concat(U.arr((rb.cooked || {})[id]))).sort(function (x, y) { return x - y; });
    });
    var notes = {}, rating = {};
    U.uniq(Object.keys(ra.notes || {}).concat(Object.keys(rb.notes || {}))).sort().forEach(function (id) {
      var x = (ra.notes || {})[id] || '', y = (rb.notes || {})[id] || '';
      notes[id] = x.length >= y.length ? (x || y) : y;
    });
    U.uniq(Object.keys(ra.rating || {}).concat(Object.keys(rb.rating || {}))).sort().forEach(function (id) {
      rating[id] = Math.max(Number((ra.rating || {})[id]) || 0, Number((rb.rating || {})[id]) || 0) || undefined;
    });
    out.recipeLog = { favorites: U.uniq(U.arr(ra.favorites).concat(U.arr(rb.favorites))).sort(), notes: notes, rating: rating, cooked: cooked };
    var ts = function (x) { return x.updatedAt || x.u || x.t || x.createdAt || 0; };
    out.customRecipes = byIdLWW(a.customRecipes, b.customRecipes, ts);
    out.customPrograms = byIdLWW(a.customPrograms, b.customPrograms, ts);
    out.reintro = byIdLWW(a.reintro, b.reintro, ts);
    out.ferments = byIdLWW(a.ferments, b.ferments, ts);
    out.timers = [];   // los temporizadores viven en el dispositivo
    // plan por fecha (marca u)
    out.plan = {};
    U.uniq(Object.keys(a.plan || {}).concat(Object.keys(b.plan || {}))).sort().forEach(function (d) {
      var x = (a.plan || {})[d], y = (b.plan || {})[d];
      out.plan[d] = U.clone(pick(x, x && x.u, y, y && y.u));
    });
    out.fridge = U.clone(pick(a.fridge, a.fridgeU, b.fridge, b.fridgeU)) || [];
    out.fridgeU = Math.max(a.fridgeU || 0, b.fridgeU || 0);
    out.ladder = U.clone(pick(a.ladder, (a.ladder || {})._u, b.ladder, (b.ladder || {})._u)) || {};
    var sa = a.shopping || {}, sb = b.shopping || {};
    out.shopping = {
      checked: mergeTsMap(sa.checked, sb.checked),
      removed: mergeTsMap(sa.removed, sb.removed),
      custom: byIdLWW(sa.custom, sb.custom, ts),
      storeOrder: U.clone(pick(sa.storeOrder, sa.storeOrderU, sb.storeOrder, sb.storeOrderU)) || null,
      storeOrderU: Math.max(sa.storeOrderU || 0, sb.storeOrderU || 0)
    };
    out.updatedAt = Math.max(a.updatedAt || 0, b.updatedAt || 0);
    return out;
  };
  /* Datos de la v1 (de UNA persona) dentro de un perfil existente: la edición de la v1 se une a la del
     mismo programa y fecha si ya existe; las alergias se suman; nombre y ajustes del perfil no cambian. */
  L.mergeV1IntoProfile = function (active, v1Profile, todayISO) {
    var inc = U.clone(v1Profile);
    Object.keys(inc.editions || {}).forEach(function (eid) {
      var e = inc.editions[eid];
      var same = Object.keys(active.editions || {}).map(function (k) { return active.editions[k]; })
        .filter(function (x) { return x.programId === e.programId && x.startDate && x.startDate === e.startDate; })[0];
      if (same && same.id !== eid) {
        e.id = same.id; e.updatedAt = 0;
        inc.editions[same.id] = e; delete inc.editions[eid];
        if (inc.days && inc.days[eid]) { inc.days[same.id] = inc.days[eid]; delete inc.days[eid]; }
        if (inc.activeEdition === eid) inc.activeEdition = same.id;
      } else if (e) e.updatedAt = 0;
    });
    inc.updatedAt = 0;
    if (inc.settings) inc.settings.updatedAt = 0;
    var out = L.mergeProfile(active, inc);
    var s = out.settings, vs = inc.settings || {};
    s.allergies = U.uniq((s.allergies || []).concat(vs.allergies || []));
    s.customAllergies = U.uniq((s.customAllergies || []).concat(vs.customAllergies || []));
    if (!out.activeEdition && inc.activeEdition) out.activeEdition = inc.activeEdition;
    if (vs.sync && vs.sync.legacyCode && !s.sync.legacyCode) s.sync.legacyCode = vs.sync.legacyCode;
    L.settleEditions(out, todayISO || U.today());
    return out;
  };
  /* Fusiona un estado importado en el local: perfiles con el mismo id se fusionan, los nuevos se agregan. */
  L.mergeState = function (local, incoming) {
    var out = U.clone(local);
    Object.keys(incoming.profiles || {}).forEach(function (id) {
      out.profiles[id] = out.profiles[id] ? L.mergeProfile(out.profiles[id], incoming.profiles[id]) : U.clone(incoming.profiles[id]);
    });
    if (!out.activeProfile) out.activeProfile = incoming.activeProfile;
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);
