/* Detox v2 — alérgenos, sugerencias de comidas, heladera 80/20, compras desde el plan. Lógica pura. */
(function (root) {
  'use strict';
  var A = root.DXApp, U = A.util, L = A.logic;

  /* ---------- alérgenos ---------- */
  L.recipeText = function (r) {
    return [r.title].concat(U.arr(r.ingredients).map(function (i) { return i.text || ''; })).join(' · ');
  };
  /* Devuelve { ids:[alérgenos del perfil presentes], custom:[textos libres que aparecen] } */
  L.recipeAllergyHits = function (recipe, profile) {
    var s = (profile && profile.settings) || {};
    var mine = s.allergies || [];
    var ids = U.arr(recipe && recipe.allergens).filter(function (a) { return mine.indexOf(a) > -1; });
    var custom = [];
    if (s.customAllergies && s.customAllergies.length && recipe) {
      var txt = L.recipeText(recipe);
      s.customAllergies.forEach(function (c) { if (c && U.hasWords(txt, c)) custom.push(c); });
    }
    return { ids: ids, custom: custom, any: ids.length > 0 || custom.length > 0 };
  };
  L.textAllergyHits = function (text, ingredientId, profile, dx) {
    var s = (profile && profile.settings) || {};
    var ids = [];
    var ing = ingredientId ? L.ingredient(ingredientId, dx) : null;
    if (ing) ids = U.arr(ing.allergens).filter(function (a) { return (s.allergies || []).indexOf(a) > -1; });
    else {
      (s.allergies || []).forEach(function (a) {
        var al = L.idx(dx).allergens[a];
        if (al && U.arr(al.keywords).some(function (k) { return U.hasWords(text, k); })) ids.push(a);
      });
    }
    var custom = (s.customAllergies || []).filter(function (c) { return c && U.hasWords(text, c); });
    return { ids: ids, custom: custom, any: ids.length > 0 || custom.length > 0 };
  };

  /* ---------- contraindicaciones por condición de salud (vía fichas del herbario) ---------- */
  var herbMemo = { dx: null, map: null };
  L.herbsForItem = function (item, dx) {
    dx = dx || A.dx();
    if (herbMemo.dx !== dx) {
      var map = Object.create(null);
      U.arr(dx.ingredients).forEach(function (g) {
        var names = [g.name].concat(g.synonyms || []).join(' · ');
        map[g.id] = U.arr(dx.herbs).filter(function (h) { return h.id === g.id || U.hasWords(names, h.name); });
      });
      herbMemo = { dx: dx, map: map };
    }
    return herbMemo.map[item] || [];
  };
  /* [{ condition, text, herb, item }] de los ingredientes obligatorios de la receta que la guía contraindica */
  L.recipeCondHits = function (recipe, conditions, dx) {
    var out = [], seen = {};
    if (!recipe || !conditions || !conditions.length) return out;
    U.arr(recipe.ingredients).forEach(function (i) {
      if (!i || !i.item || i.optional) return;
      L.herbsForItem(i.item, dx).forEach(function (h) {
        U.arr(h.contraindications).forEach(function (c) {
          if (c.scope) return;   // p. ej. «aceite esencial»: no aplica al uso en la cocina
          var k = c.condition + '|' + h.id;
          if (conditions.indexOf(c.condition) > -1 && !seen[k]) { seen[k] = 1; out.push({ condition: c.condition, text: c.text, herb: h.id, item: i.item }); }
        });
      });
    });
    return out;
  };

  /* ---------- uso de recetas (rotación) ---------- */
  L.recipeUsage = function (profile, editionId, upToIdx) {
    var use = Object.create(null);
    var days = (profile.days && profile.days[editionId]) || {};
    Object.keys(days).forEach(function (k) {
      var idx = +k, day = days[k];
      if (upToIdx != null && idx > upToIdx) return;
      Object.keys((day && day.meals) || {}).forEach(function (s) {
        L.mealItems(day, s).forEach(function (m) {
          if (!m.recipeId || !m.done) return;
          var u = use[m.recipeId] || (use[m.recipeId] = { count: 0, last: -Infinity, days: [] });
          u.count++; u.last = Math.max(u.last, idx); u.days.push(idx);
        });
      });
    });
    return use;
  };

  /* Puntaje por constitución (friolento: cocido/cálido; caluroso: crudo/fresco). */
  L.constitutionScore = function (recipe, constitution, slot) {
    if (!constitution) return 0;
    var tags = recipe.tags || [], th = recipe.thermal;
    var warm = tags.indexOf('cocido') > -1 || th === 'calido' || tags.indexOf('friolento-ok') > -1;
    var raw = tags.indexOf('crudo') > -1 || th === 'fresco' || th === 'frio';
    if (constitution === 'friolento') return (warm ? 2 : 0) - (raw ? (slot === 'cena' ? 3 : 1) : 0);
    if (constitution === 'caluroso') return (raw || tags.indexOf('caluroso-ok') > -1 ? 2 : 0) - (th === 'calido' && slot !== 'cena' ? 1 : 0);
    return 0;
  };

  /* Sugerencias para un momento del día. ctx: { profile, editionId, program, phaseId, slot, dayIdx, dateISO, dx, n } */
  L.suggest = function (ctx) {
    var dx = ctx.dx, profile = ctx.profile, phase = L.phase(ctx.program, ctx.phaseId);
    var all = L.allRecipes(profile, dx);
    var allowed = phase.allowedRecipes && phase.allowedRecipes.length ? phase.allowedRecipes : null;
    var cands = all.filter(function (r) {
      if (allowed) return allowed.indexOf(r.id) > -1;
      var okPhase = !r.phases || !r.phases.length || r.phases.indexOf(ctx.phaseId) > -1 || (ctx.phaseId === 'previa' && r.phases.indexOf('general') > -1);
      var okSlot = !r.slots || !r.slots.length || r.slots.indexOf(ctx.slot) > -1;
      return okPhase && okSlot;
    });
    if (allowed) {
      var bySlot = cands.filter(function (r) { return !r.slots || !r.slots.length || r.slots.indexOf(ctx.slot) > -1; });
      if (bySlot.length) cands = bySlot;
    }
    var conds = (profile.settings && profile.settings.conditions) || [];
    cands = cands.filter(function (r) { return !L.recipeAllergyHits(r, profile).any && !L.recipeCondHits(r, conds, dx).length; });
    var usage = L.recipeUsage(profile, ctx.editionId);
    // límites por semana (últimos 7 días, incluido el actual)
    cands = cands.filter(function (r) {
      var lim = r.limits && r.limits.perWeek;
      if (!lim) return true;
      var u = usage[r.id]; if (!u) return true;
      var n = u.days.filter(function (d) { return d <= ctx.dayIdx && d > ctx.dayIdx - 7; }).length;
      return n < lim;
    });
    var constitution = profile.settings && profile.settings.constitution;
    var scored = cands.map(function (r) {
      var u = usage[r.id] || { count: 0, last: -Infinity };
      return { recipe: r, count: u.count, last: u.last, cs: L.constitutionScore(r, constitution, ctx.slot), tie: U.hash(r.id + '|' + ctx.dateISO + '|' + ctx.slot) };
    });
    scored.sort(function (a, b) {
      return (a.count - b.count) || (b.cs - a.cs) || (a.last - b.last) || (a.tie - b.tie);
    });
    var label = constitution === 'friolento' ? 'friolentos' : 'calurosos';
    return scored.slice(0, ctx.n || 4).map(function (s) {
      var reason;
      if (s.cs > 0 && constitution) reason = 'Buena para ' + label;
      else if (s.count === 0) reason = 'Aún no la probaste';
      else if (isFinite(s.last) && ctx.dayIdx - s.last > 0) reason = 'Hace ' + U.plural(ctx.dayIdx - s.last, 'día');
      else reason = 'La comiste ' + U.plural(s.count, 'vez', 'veces');
      if (s.cs > 0 && constitution && s.count === 0) reason = 'Aún no la probaste · buena para ' + label;
      return { recipe: s.recipe, reason: reason, count: s.count };
    });
  };

  /* «alguna verdura», «alguna fruta»… para mostrar un faltante de categoría */
  L.someOfCategory = function (cat, dx) {
    var c = U.arr(L.tx(dx).ingredientCategories).filter(function (x) { return x.id === cat; })[0];
    var lab = String(c ? c.label : String(cat).replace(/_/g, ' ')).toLowerCase().split(/[ ,]/)[0];
    var sing = /s$/.test(lab) && lab.length > 3 ? lab.slice(0, -1) : lab;
    var fem = /a$/.test(sing) || /(legumbre|especie)$/.test(sing);
    return (fem ? 'alguna ' : 'algún ') + sing;
  };

  /* ---------- heladera 80/20 ---------- */
  L.FRIDGE = { wP: 80, wC: 20, zeroMax: 20, underHalfMax: 40, nearMissing: 2, nearScore: 70 };
  L.fridgeMatch = function (recipes, haveIds, dx) {
    var have = new Set(haveIds || []);
    var ix = L.idx(dx);
    var out = [];
    recipes.forEach(function (r) {
      var P = [], C = [];
      var seen = new Set();
      var choices = 0;
      U.arr(r.ingredients).forEach(function (i) {
        if (i && !i.item && i.choice && !i.optional) {
          if (i.choiceCategory) {   // cuenta como presente si tenés cualquier ingrediente de esa categoría
            var has = (haveIds || []).some(function (id) { var g = ix.ingredients[id]; return g && !g.pantry && g.category === i.choiceCategory; });
            P.push({ item: null, name: L.someOfCategory(i.choiceCategory, dx), present: has, choice: true, text: i.text });
          } else choices++;
          return;
        }
        if (!i || !i.item || i.optional || seen.has(i.item)) return;
        seen.add(i.item);
        var ing = ix.ingredients[i.item];
        var role = i.role || (ing && ing.role) || 'principal';
        if (role === 'basico') return;
        var present = have.has(i.item) || !!(ing && ing.pantry);
        (role === 'condimento' ? C : P).push({ item: i.item, name: ing ? ing.name : i.text, present: present, text: i.text });
      });
      // las líneas «a elegir» (choice, sin ingrediente) se ignoran (contrato de datos, ronda 2)
      // sin principales: los condimentos que no son de alacena pasan a ser la base (si no, el puntaje arrancaba en 80 con la heladera vacía)
      if (!P.length) {
        P = C.filter(function (x) { var g = ix.ingredients[x.item]; return !(g && g.pantry); });
        C = C.filter(function (x) { var g = ix.ingredients[x.item]; return g && g.pantry; });
      }
      if (!P.length && !C.length) return;
      var pp = P.filter(function (x) { return x.present; }).length, cp = C.filter(function (x) { return x.present; }).length;
      var rp = P.length ? pp / P.length : 1, rc = C.length ? cp / C.length : 1;
      var raw = rp * L.FRIDGE.wP + rc * L.FRIDGE.wC;
      var score = raw;
      if (P.length && pp === 0) score = Math.min(raw, L.FRIDGE.zeroMax);
      else if (P.length && rp < 0.5) score = Math.min(raw, L.FRIDGE.underHalfMax);
      score = Math.round(score);
      var missing = P.concat(C).filter(function (x) { return !x.present; });
      // líneas «a elegir» (sin ingrediente): no puntúan, pero la receta nunca queda «lista» sin elegirlas
      if (choices) { missing.push({ item: null, name: 'verduras a elección', present: false, choice: true }); score = Math.min(score, 99); }
      var tier = score === 100 ? 'lista' : (missing.length <= L.FRIDGE.nearMissing && score >= L.FRIDGE.nearScore ? 'casi' : 'lejos');
      out.push({ recipe: r, score: score, tier: tier, missing: missing, missingP: P.filter(function (x) { return !x.present; }), missingC: C.filter(function (x) { return !x.present; }), totalP: P.length, totalC: C.length });
    });
    out.sort(function (a, b) { return (b.score - a.score) || (a.missing.length - b.missing.length) || String(a.recipe.title).localeCompare(b.recipe.title, 'es'); });
    return out;
  };

  /* ---------- plan y compras ---------- */
  /* Rango de compras con el mismo criterio de semana que el Plan (lunes a domingo).
     which: 'esta' (hoy → domingo), 'proxima' (lunes → domingo siguientes), '3' (hoy + 2). */
  L.shopRange = function (todayISO, which) {
    var mon = U.mondayOf(todayISO), sun = U.addDays(mon, 6);
    if (which === '3') return { from: todayISO, to: U.addDays(todayISO, 2), label: 'próximos 3 días' };
    if (which === 'proxima') return { from: U.addDays(mon, 7), to: U.addDays(sun, 7), label: 'la próxima semana' };
    return { from: todayISO, to: sun, label: 'esta semana' };
  };
  L.planEntries = function (plan, fromISO, toISO, slots) {
    var out = [];
    Object.keys(plan || {}).sort().forEach(function (date) {
      if (!U.isValidISO(date) || date < fromISO || date > toISO) return;
      var p = plan[date] || {};
      (slots || ['desayuno', 'almuerzo', 'merienda', 'cena']).forEach(function (s) {
        U.arr(p[s]).forEach(function (id) { if (typeof id === 'string') out.push({ date: date, slot: s, recipeId: id }); });
      });
    });
    return out;
  };
  /* Unidad canónica PARA MOSTRAR (conserva la ñ): «puñados» → «puñado» */
  var UNIT_MAP = { gr: 'g', grs: 'g', gramos: 'g', gramo: 'g', kilo: 'kg', kilos: 'kg', cdas: 'cda', cucharada: 'cda', cucharadas: 'cda', cditas: 'cdita', cucharadita: 'cdita', cucharaditas: 'cdita',
    tazas: 'taza', unidades: 'unidad', u: 'unidad', pencas: 'penca', dientes: 'diente', hojas: 'hoja', ramas: 'rama', litros: 'l', litro: 'l', punado: 'puñado', punados: 'puñado',
    pizcas: 'pizca', atados: 'atado', plantas: 'planta', trozos: 'trozo', rodajas: 'rodaja', vasos: 'vaso' };
  L.normUnit = function (u) {
    var raw = String(u || '').trim().toLowerCase();
    var n = U.norm(raw);
    if (!n) return '';
    return UNIT_MAP[n] || raw;
  };
  /* Suma los ingredientes de las recetas planificadas. Devuelve [{ item, name, store, parts:[{qty,unit}], free:bool, recipes:[ids] }] */
  L.aggregateIngredients = function (entries, profile, servings, dx) {
    var ix = L.idx(dx);
    var by = Object.create(null), order = [];
    entries.forEach(function (e) {
      var r = L.recipe(e.recipeId, profile, dx);
      if (!r) return;
      var factor = servings && r.servings ? servings / r.servings : 1;
      U.arr(r.ingredients).forEach(function (i) {
        if (!i || !i.item) return;
        var ing = ix.ingredients[i.item];
        if (ing && ing.pantry) return;
        var g = by[i.item];
        if (!g) { g = by[i.item] = { item: i.item, name: ing ? ing.name : i.text, store: (ing && ing.store) || 'super', parts: {}, free: false, recipes: [], optional: true }; order.push(i.item); }
        if (g.recipes.indexOf(r.id) < 0) g.recipes.push(r.id);
        if (!i.optional) g.optional = false;
        if (i.qty == null || !isFinite(i.qty)) { g.free = true; return; }
        var u = L.normUnit(i.unit);
        var cur = g.parts[u] || (g.parts[u] = { qty: 0, max: 0 });
        cur.qty += i.qty * factor;
        cur.max += (i.qtyMax != null && isFinite(i.qtyMax) ? i.qtyMax : i.qty) * factor;
      });
    });
    var r2 = function (x) { return Math.round(x * 100) / 100; };
    return order.map(function (k) {
      var g = by[k];
      g.parts = Object.keys(g.parts).map(function (u) { var p = g.parts[u]; var o = { qty: r2(p.qty), unit: u }; if (r2(p.max) > r2(p.qty)) o.qtyMax = r2(p.max); return o; });
      return g;
    });
  };
  L.fmtParts = function (g) {
    var s = g.parts.map(function (p) {
      var unit = p.unit || 'unidad';
      if (p.qtyMax != null) return U.frac(p.qty) + ' a ' + U.fmtQty(p.qtyMax, unit);
      return U.fmtQty(p.qty, unit);
    });
    if (!s.length) return 'a gusto';
    return s.join(' + ') + (g.free ? ' + a gusto' : '');
  };
  /* Texto para WhatsApp: *COMERCIO* + • ítem (cant) */
  L.shoppingText = function (groups, title) {
    var lines = [];
    if (title) lines.push(title, '');
    groups.forEach(function (g) {
      if (!g.items.length) return;
      lines.push('*' + String(g.label).toUpperCase() + '*');
      g.items.forEach(function (it) { lines.push('• ' + it.text + (it.qty ? (/\)\s*$/.test(it.text) ? ': ' + it.qty : ' (' + it.qty + ')') : '')); });
      lines.push('');
    });
    return lines.join('\n').trim();
  };

  /* Remojos necesarios para recetas */
  L.soaksForRecipes = function (recipeIds, profile, dx) {
    var ix = L.idx(dx), soaks = U.arr((dx || A.dx()).prep && (dx || A.dx()).prep.soaking);
    var byIng = Object.create(null);
    soaks.forEach(function (s) { if (s.ingredient) byIng[s.ingredient] = s; });
    var res = Object.create(null);
    recipeIds.forEach(function (rid) {
      var r = L.recipe(rid, profile, dx); if (!r) return;
      U.arr(r.ingredients).forEach(function (i) {
        if (!i.item) return;
        var ing = ix.ingredients[i.item];
        var s = (ing && ing.soak && ix.soaking[ing.soak]) || byIng[i.item];
        if (!s) return;
        var e = res[s.id] || (res[s.id] = { soak: s, recipes: [] });
        if (e.recipes.indexOf(rid) < 0) e.recipes.push(rid);
      });
    });
    return Object.keys(res).map(function (k) { return res[k]; }).sort(function (a, b) { return (b.soak.optH || 0) - (a.soak.optH || 0); });
  };

  /* Búsqueda del semáforo: primero coincidencias por nombre, después por categoría y al final por sinónimo
     (indicando cuál). Nunca busca en las explicaciones. */
  L.foodSearch = function (foods, q) {
    var list = U.arr(foods).slice();
    if (!U.norm(q)) return list.sort(function (a, b) { return a.name.localeCompare(b.name, 'es'); });
    var out = [];
    list.forEach(function (f) {
      var rank = null, via = null;
      if (U.matchQuery(f.name, q)) rank = 0;
      else if (U.matchQuery(f.category || '', q)) rank = 1;
      else {
        var exact = U.arr(f.synonyms).filter(function (x) { return U.norm(x) === U.norm(q); })[0];
        var syn = exact || U.arr(f.synonyms).filter(function (x) { return U.matchQuery(x, q); })[0];
        if (syn) { rank = exact ? 1.5 : 2; via = syn; }
      }
      if (rank != null) { var c = Object.assign({}, f); c._rank = rank; c._via = via; out.push(c); }
    });
    return out.sort(function (a, b) { return (a._rank - b._rank) || a.name.localeCompare(b.name, 'es'); });
  };

  /* Ingredientes que menciona un paso (modo cocina). Nombres, sinónimos y la primera palabra del nombre;
     «todas las verduras» / «todos los ingredientes» incluyen la categoría o la receta entera. */
  L.ingredientNames = function (ing) {
    if (!ing) return [];
    var first = U.tokens(ing.name)[0];
    return U.uniq([ing.name].concat(ing.synonyms || []).concat(first && first.length > 3 ? [first] : []));
  };
  L.stepIngredients = function (recipe, text, dx) {
    var ix = L.idx(dx), t = U.norm(text);
    var all = /todos? (los|las) ingredientes|el resto de (los )?ingredientes|todo junto/.test(t);
    var veg = /(todas )?las verduras|los vegetales/.test(t);
    var fruit = /las frutas/.test(t);
    return U.arr(recipe.ingredients).filter(function (i) {
      if (!i || i.optional && !all) return false;
      var g = i.item && ix.ingredients[i.item];
      if (all && !(g && g.pantry)) return true;
      if (g && veg && /verdura|hongo|brote|aromatic/.test(g.category || '')) return true;
      if (g && fruit && /fruta/.test(g.category || '')) return true;
      if (!g) return false;
      return L.ingredientNames(g).some(function (nm) { return nm && U.hasWords(text, nm); });
    });
  };

  /* Interpreta una línea de ingrediente escrita a mano: «2 tazas de arroz yamaní» */
  var NUMW = { un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, media: 0.5, medio: 0.5 };
  var UNITS = ['taza', 'tazas', 'cda', 'cdas', 'cucharada', 'cucharadas', 'cdita', 'cditas', 'cucharadita', 'cucharaditas', 'g', 'gr', 'grs', 'gramos', 'kg', 'kilo', 'kilos', 'ml', 'l', 'litro', 'litros', 'cc', 'unidad', 'unidades', 'penca', 'pencas', 'diente', 'dientes', 'hoja', 'hojas', 'rama', 'ramas', 'puñado', 'puñados', 'pizca', 'pizcas', 'atado', 'atados', 'planta', 'plantas', 'trozo', 'trozos', 'rodaja', 'rodajas', 'vaso', 'vasos'];
  var UNITS_N = UNITS.map(function (x) { return U.norm(x); });
  L.parseIngredientLine = function (line, dx) {
    var text = String(line || '').trim();
    if (!text) return null;
    var rest = text, qty = null, unit = null;
    var m = /^(\d+(?:[.,]\d+)?)(?:\s*\/\s*(\d+))?\s*(?:y\s+(\d)\/(\d))?/.exec(rest);
    var fr = /^([½¼¾⅓⅔])/.exec(rest);
    if (m && m[0]) {
      qty = m[2] ? (+m[1].replace(',', '.')) / +m[2] : +m[1].replace(',', '.');
      if (m[3]) qty += +m[3] / +m[4];
      rest = rest.slice(m[0].length).trim();
    } else if (fr) {
      qty = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3 }[fr[1]];
      rest = rest.slice(1).trim();
    } else {
      var w = /^(\S+)\s+/.exec(rest);
      if (w && NUMW[U.norm(w[1])] != null) { qty = NUMW[U.norm(w[1])]; rest = rest.slice(w[0].length); }
    }
    var u = /^(\S+)\s*/.exec(rest);
    if (qty != null && u && UNITS_N.indexOf(U.norm(u[1]).replace(/\.$/, '')) > -1) {
      unit = L.normUnit(u[1].replace(/\.$/, ''));
      rest = rest.slice(u[0].length).replace(/^de\s+/i, '');
    } else if (qty != null) unit = 'unidad';
    var item = L.findIngredient(rest, dx) || L.findIngredient(text, dx);
    var ing = item ? L.ingredient(item, dx) : null;
    return { text: text, qty: qty, unit: unit, item: item, role: ing ? ing.role || 'principal' : 'principal', optional: /opcional/i.test(text) };
  };
})(typeof window !== 'undefined' ? window : globalThis);
