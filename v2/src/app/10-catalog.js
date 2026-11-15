/* Detox v2 — acceso tolerante al catálogo de datos (DX) + elementos propios del perfil. */
(function (root) {
  'use strict';
  var A = root.DXApp, U = A.util, L = A.logic;

  var memo = { dx: null, idx: null };
  /* Índices de DX (se recalculan solo si cambia el objeto DX). */
  L.idx = function (dx) {
    dx = dx || A.dx();
    if (memo.dx === dx && memo.idx) return memo.idx;
    var tx = dx.taxonomy || {};
    var idx = {
      recipes: U.index(dx.recipes), ingredients: U.index(dx.ingredients), foods: U.index(dx.foods),
      herbs: U.index(dx.herbs), sos: U.index(dx.sos), shopping: U.index(dx.shopping), programs: U.index(dx.programs),
      allergens: U.index(tx.allergens), conditions: U.index(tx.conditions), stores: U.index(tx.stores),
      categories: U.index(tx.recipeCategories), symptoms: U.index(tx.symptoms), slots: U.index(tx.mealSlots),
      soaking: U.index(dx.prep && dx.prep.soaking), batch: U.index(dx.prep && dx.prep.batch)
    };
    var bySyn = Object.create(null);
    U.arr(dx.ingredients).forEach(function (i) {
      [i.name].concat(i.synonyms || []).forEach(function (s) { var k = U.norm(s); if (k && !bySyn[k]) bySyn[k] = i.id; });
    });
    idx.ingredientBySyn = bySyn;
    memo.dx = dx; memo.idx = idx;
    return idx;
  };

  L.tx = function (dx) { return (dx || A.dx()).taxonomy || {}; };
  L.slots = function (dx) {
    var s = U.arr(L.tx(dx).mealSlots);
    return s.length ? s : [{ id: 'desayuno', label: 'Desayuno' }, { id: 'almuerzo', label: 'Almuerzo' }, { id: 'merienda', label: 'Merienda' }, { id: 'cena', label: 'Cena' }];
  };
  L.slotIds = function (dx) { return L.slots(dx).map(function (s) { return s.id; }); };
  L.stores = function (dx) {
    return U.arr(L.tx(dx).stores).slice().sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
  };

  /* Recetas del recetario + propias del perfil */
  L.allRecipes = function (profile, dx) {
    var base = U.arr((dx || A.dx()).recipes);
    var own = profile && profile.customRecipes ? profile.customRecipes.filter(function (r) { return r && !r.deleted; }) : [];
    return own.length ? base.concat(own) : base;
  };
  L.recipe = function (id, profile, dx) {
    var r = L.idx(dx).recipes[id];
    if (r) return r;
    if (profile && profile.customRecipes) for (var i = 0; i < profile.customRecipes.length; i++) if (profile.customRecipes[i].id === id && !profile.customRecipes[i].deleted) return profile.customRecipes[i];
    return null;
  };
  L.allPrograms = function (profile, dx) {
    var base = U.arr((dx || A.dx()).programs).filter(function (p) { return !p.template && p.id !== 'custom'; });
    var own = profile && profile.customPrograms ? profile.customPrograms.filter(function (p) { return p && !p.deleted; }) : [];
    return base.concat(own);
  };
  L.programTemplate = function (dx) { return L.idx(dx).programs.custom || null; };
  L.program = function (id, profile, dx) {
    var p = L.idx(dx).programs[id];
    if (p) return p;
    if (profile && profile.customPrograms) for (var i = 0; i < profile.customPrograms.length; i++) if (profile.customPrograms[i].id === id) return profile.customPrograms[i];
    return null;
  };
  L.ingredient = function (id, dx) { return L.idx(dx).ingredients[id] || null; };
  /* Busca un ingrediente del catálogo por texto (nombre o sinónimo exacto, luego por palabras). */
  L.findIngredient = function (text, dx) {
    var ix = L.idx(dx), k = U.norm(text);
    if (!k) return null;
    if (ix.ingredientBySyn[k]) return ix.ingredientBySyn[k];
    var best = null, bestLen = 0;
    Object.keys(ix.ingredientBySyn).forEach(function (syn) {
      if (syn.length > bestLen && U.hasWords(k, syn)) { best = ix.ingredientBySyn[syn]; bestLen = syn.length; }
    });
    return best;
  };
  L.categoryLabel = function (id, dx) { var c = L.idx(dx).categories[id]; return c ? c.label : U.cap(String(id || '').replace(/_/g, ' ')); };
  L.storeLabel = function (id, dx) { var s = L.idx(dx).stores[id]; return s ? s.label : (id ? U.cap(id) : 'Otros'); };
  L.allergenLabel = function (id, dx) { var a = L.idx(dx).allergens[id]; return a ? a.label : id; };
  L.statusLabel = function (st, dx) {
    var m = L.tx(dx).statusLabels || {};
    return m[st] || ({ green: 'Libre', yellow: 'Con moderación', red: 'Evitar' })[st] || st;
  };
})(typeof window !== 'undefined' ? window : globalThis);
