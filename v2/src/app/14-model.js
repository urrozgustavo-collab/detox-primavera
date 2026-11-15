/* Detox v2 — modelo de estado (schema 2), normalización tolerante y migración v1 → v2 (§3.1). Puro. */
(function (root) {
  'use strict';
  var A = root.DXApp, U = A.util, L = A.logic;

  L.SCHEMA = 2;
  L.STATE_KEY = 'detox2_state';
  var COLORS = ['#3D6B4F', '#B85C7A', '#C98F1E', '#3E5C76', '#9A5B2A', '#2F7A78'];
  L.PROFILE_COLORS = COLORS;
  L.PROFILE_EMOJIS = ['🌿', '🌸', '🍃', '🌻', '🌱', '🍋', '🫖', '🌙'];

  L.newSettings = function (now) {
    return { allergies: [], customAllergies: [], conditions: [], constitution: null, servings: 2, waterGoalMl: 2000, updatedAt: now || 0,
      sync: { code: null, legacyCode: null, lastPushAt: null, lastPullAt: null, dirty: false, error: null } };
  };
  L.newProfile = function (name, now, i) {
    now = now || Date.now();
    return {
      id: U.uid('p'), name: name || '', color: COLORS[(i || 0) % COLORS.length], emoji: L.PROFILE_EMOJIS[(i || 0) % L.PROFILE_EMOJIS.length],
      createdAt: now, updatedAt: now, settings: L.newSettings(now), activeEdition: null, editions: {}, days: {},
      recipeLog: { favorites: [], notes: {}, rating: {}, cooked: {} }, customRecipes: [], customPrograms: [],
      plan: {}, fridge: [], fridgeU: 0, shopping: { checked: {}, custom: [], removed: {}, storeOrder: null, storeOrderU: 0 },
      reintro: [], ferments: [], timers: [], ladder: {}
    };
  };
  L.newState = function (now) {
    return {
      schema: L.SCHEMA,
      device: { id: U.uid('d'), theme: 'system', textScale: 1, reduceMotion: false, sound: true, confetti: true, lastBackupAt: null,
        migratedFromV1At: null, onboarded: false, fileNoticeSeen: false, cookingLock: true, timers: [] },
      activeProfile: null, profiles: {}
    };
  };
  L.newEdition = function (programId, startDate, startMode, now) {
    now = now || Date.now();
    return { id: U.uid('e'), programId: programId, startDate: U.isValidISO(startDate) ? startDate : null, startMode: startMode || null,
      status: U.isValidISO(startDate) ? 'active' : 'planned', createdAt: now, closedAt: null, note: '', updatedAt: now };
  };
  L.newDay = function () {
    return { updatedAt: 0, _u: {}, habits: {}, water: [], checkin: { energy: null, mood: null, digestion: null, symptoms: [], customSymptoms: [], notes: '', updatedAt: 0 },
      meals: { desayuno: [], almuerzo: [], merienda: [], cena: [] } };
  };
  L.ensureDay = function (profile, edId, idx) {
    profile.days = profile.days || {};
    var e = profile.days[edId] || (profile.days[edId] = {});
    var k = String(idx);
    if (!e[k]) e[k] = L.newDay();
    return L.normalizeDay(e[k]);
  };
  L.touchDay = function (day, part, now) {
    now = now || Date.now();
    day._u = day._u || {};
    day._u[part] = now; day.updatedAt = now;
    if (part === 'checkin') day.checkin.updatedAt = now;
  };

  function fill(target, defs) {
    Object.keys(defs).forEach(function (k) {
      if (target[k] === undefined || target[k] === null && defs[k] !== null && typeof defs[k] === 'object') target[k] = U.clone(defs[k]);
      else if (U.isObj(defs[k]) && U.isObj(target[k]) && Object.keys(defs[k]).length) fill(target[k], defs[k]);
    });
    return target;
  }
  L.normalizeDay = function (d) {
    if (!U.isObj(d)) d = {};
    fill(d, L.newDay());
    if (!Array.isArray(d.water)) d.water = [];
    if (!U.isObj(d.habits)) d.habits = {};
    if (!Array.isArray(d.checkin.symptoms)) d.checkin.symptoms = [];
    if (!Array.isArray(d.checkin.customSymptoms)) d.checkin.customSymptoms = [];
    Object.keys(d.meals).forEach(function (s) { if (!Array.isArray(d.meals[s])) d.meals[s] = []; });
    return d;
  };
  L.normalizeProfile = function (p, i) {
    if (!U.isObj(p)) return null;
    var def = L.newProfile('', p.createdAt || Date.now(), i);
    delete def.id;
    fill(p, def);
    if (!p.id) p.id = U.uid('p');
    ['customRecipes', 'customPrograms', 'fridge', 'reintro', 'ferments', 'timers'].forEach(function (k) { if (!Array.isArray(p[k])) p[k] = []; });
    if (!Array.isArray(p.recipeLog.favorites)) p.recipeLog.favorites = [];
    if (!Array.isArray(p.shopping.custom)) p.shopping.custom = [];
    ['allergies', 'customAllergies', 'conditions'].forEach(function (k) { if (!Array.isArray(p.settings[k])) p.settings[k] = []; });
    Object.keys(p.days).forEach(function (e) { if (!U.isObj(p.days[e])) p.days[e] = {}; Object.keys(p.days[e]).forEach(function (k) { p.days[e][k] = L.normalizeDay(p.days[e][k]); }); });
    Object.keys(p.editions).forEach(function (e) { if (!U.isObj(p.editions[e]) || !p.editions[e].programId) delete p.editions[e]; else if (!U.isValidISO(p.editions[e].startDate)) p.editions[e].startDate = null; });
    if (p.activeEdition && !p.editions[p.activeEdition]) p.activeEdition = null;
    return p;
  };
  /* Devuelve un estado válido o lanza si no es reconocible. */
  L.normalizeState = function (s) {
    if (!U.isObj(s) || !U.isObj(s.profiles)) throw new Error('Estado no reconocible');
    if (Number(s.schema) > L.SCHEMA) throw new Error('El estado es de una versión más nueva de la app');
    s = L.migrateSchema(s);
    fill(s, L.newState());
    var i = 0;
    Object.keys(s.profiles).forEach(function (id) {
      var p = L.normalizeProfile(s.profiles[id], i++);
      if (!p) delete s.profiles[id]; else if (p.id !== id) { delete s.profiles[id]; s.profiles[p.id] = p; }
    });
    if (!s.activeProfile || !s.profiles[s.activeProfile]) s.activeProfile = Object.keys(s.profiles)[0] || null;
    // Los temporizadores son del dispositivo (no del perfil): se mudan los que hubiera en perfiles.
    if (!Array.isArray(s.device.timers)) s.device.timers = [];
    Object.keys(s.profiles).forEach(function (id) {
      var p = s.profiles[id];
      if (p.timers && p.timers.length) { s.device.timers = s.device.timers.concat(p.timers.filter(function (t) { return !s.device.timers.some(function (x) { return x.id === t.id; }); })); }
      p.timers = [];
    });
    return s;
  };
  /* Migraciones de esquema futuras: L.schemaMigrations[n] lleva de n a n+1. */
  L.schemaMigrations = {};
  L.migrateSchema = function (s) {
    var v = Number(s.schema) || 2;
    while (v < L.SCHEMA && L.schemaMigrations[v]) { s = L.schemaMigrations[v](s); v++; }
    s.schema = L.SCHEMA;
    return s;
  };

  /* ================= Migración v1 → v2 ================= */
  /* Marcador (fuera de detox2_state) de que la v1 ya se importó alguna vez: evita re-migrar después de «Borrar todo». */
  L.MIGRATED_KEY = 'detox2_migrated';
  L.V1_KEYS = ['detox_start_date', 'detox_selected_day', 'detox_start_mode', 'detox_completed_missions', 'detox_xp', 'detox_unlocked_badges',
    'detox_daily_journal', 'detox_daily_meals', 'detox_user_allergies', 'detox_shopping_checked', 'detox_fridge_selected', 'detox_weekly_plan',
    'detox_sync_key', 'detox_dark_mode', 'detox_active_tab', 'detox_recipe_subview'];
  var V1_DATA = ['detox_start_date', 'detox_completed_missions', 'detox_daily_journal', 'detox_daily_meals', 'detox_user_allergies',
    'detox_shopping_checked', 'detox_fridge_selected', 'detox_sync_key', 'detox_weekly_plan'];

  L.parseCookies = function (str) {
    var out = {};
    String(str || '').split(';').forEach(function (part) {
      var i = part.indexOf('='); if (i < 0) return;
      var k = part.slice(0, i).trim(), v = part.slice(i + 1).trim();
      try { v = decodeURIComponent(v); } catch (e) { /* valor sin codificar */ }
      if (k) out[k] = v;
    });
    return out;
  };
  /* Lee las claves v1: localStorage primero, si no la cookie del mismo nombre. getItem puede lanzar. */
  L.readV1Raw = function (getItem, cookieStr) {
    var cookies = L.parseCookies(cookieStr);
    var raw = {};
    L.V1_KEYS.forEach(function (k) {
      var v = null;
      try { v = getItem ? getItem(k) : null; } catch (e) { v = null; }
      if (v == null && cookies[k] != null) v = cookies[k];
      if (v != null) raw[k] = String(v);
    });
    return raw;
  };
  L.hasV1Data = function (raw) { return V1_DATA.some(function (k) { return raw[k] != null && raw[k] !== '' && raw[k] !== '{}' && raw[k] !== '[]' && raw[k] !== 'null'; }); };

  function slotItems(slotVal) {
    if (Array.isArray(slotVal)) return { items: slotVal, text: '', done: false, legacy: 'array' };
    if (U.isObj(slotVal)) {
      if (Array.isArray(slotVal.items)) return { items: slotVal.items, text: slotVal.text || '', done: !!slotVal.done, legacy: 'items' };
      return { items: null, text: slotVal.text || '', done: !!slotVal.done, legacy: 'text' };
    }
    if (typeof slotVal === 'string') return { items: null, text: slotVal, done: false, legacy: 'string' };
    return { items: [], text: '', done: false };
  }

  L.migrateV1 = function (raw, dx, now, todayISO) {
    now = now || Date.now();
    todayISO = todayISO || U.iso(new Date(now));
    var warnings = [];
    function J(k, def) {
      if (raw[k] == null || raw[k] === '') return def;
      try { var v = JSON.parse(raw[k]); return v == null ? def : v; } catch (e) { warnings.push('No se pudo leer ' + k + ' (dato dañado): se omitió.'); return def; }
    }
    var state = L.newState(now);
    var dm = raw.detox_dark_mode;
    state.device.theme = dm === 'true' ? 'dark' : dm === 'false' ? 'light' : 'system';
    var p = L.newProfile('', now, 0);
    state.profiles[p.id] = p; state.activeProfile = p.id;
    var real = L.hasV1Data(raw);
    var report = { migrated: real, days: 0, warnings: warnings, editionId: null };
    if (!real) return { state: state, report: report };

    var ix = L.idx(dx);
    var prog = ix.programs['detox-primavera-21'];
    var progDays = L.programDays(prog || { days: 21 });
    var sd = String(raw.detox_start_date || '').trim();
    if (sd && !U.isValidISO(sd)) { warnings.push('La fecha de inicio guardada (' + sd + ') no es válida: quedó sin fecha.'); sd = null; }
    var modes = ['monodieta3', 'monodieta2', 'monodieta1', 'directo'];
    var mode = modes.indexOf(raw.detox_start_mode) > -1 ? raw.detox_start_mode : 'monodieta3';
    var ed = L.newEdition('detox-primavera-21', sd || null, mode, now);
    if (sd) {
      var diff = U.diffDays(sd, todayISO);
      ed.status = diff >= progDays ? 'done' : diff < 0 ? 'planned' : 'active';
      if (ed.status === 'done') ed.closedAt = now;
    }
    ed.note = 'Importada de la versión 1';
    p.editions[ed.id] = ed; p.activeEdition = ed.id; report.editionId = ed.id;
    var days = p.days[ed.id] = {};
    function dayOf(n) {
      var k = String(n);
      if (!days[k]) { days[k] = L.newDay(); }
      return days[k];
    }
    function idxFrom(key, prefix) {
      var m = new RegExp('^' + prefix + '_(\\d+)$').exec(key);
      if (!m) return null;
      var n = +m[1];
      return n >= 0 && n <= progDays ? n : null;
    }
    // misiones
    var missions = J('detox_completed_missions', {});
    if (U.isObj(missions)) Object.keys(missions).forEach(function (k) {
      var n = idxFrom(k, 'day'); if (n == null || !U.isObj(missions[k])) return;
      var d = dayOf(n), any = false;
      Object.keys(missions[k]).forEach(function (h) { if (missions[k][h] === true || missions[k][h] === 'true') { d.habits[h] = 'done'; any = true; } });
      if (any) L.touchDay(d, 'habits', now);
    });
    // bitácora
    var sym = U.arr(L.tx(dx).symptoms);
    var digIds = U.arr(L.tx(dx).digestionStates).map(function (x) { return x.id; });
    if (!digIds.length) digIds = ['liviano', 'gases', 'lenta', 'optima'];
    var journal = J('detox_daily_journal', {});
    if (U.isObj(journal)) Object.keys(journal).forEach(function (k) {
      var n = idxFrom(k, 'dia'); var e = journal[k];
      if (n == null || !U.isObj(e)) return;
      var d = dayOf(n), c = d.checkin;
      var en = Number(e.energy);
      c.energy = en >= 1 && en <= 5 ? Math.round(en) : null;
      if (e.energy != null && e.energy !== '' && c.energy == null) warnings.push('Día ' + n + ': la energía guardada («' + e.energy + '») no es válida y se omitió.');
      c.digestion = digIds.indexOf(e.digestion) > -1 ? e.digestion : null;
      if (e.digestion && c.digestion == null) warnings.push('Día ' + n + ': la digestión «' + e.digestion + '» no se reconoce y se omitió.');
      U.arr(e.symptoms).forEach(function (s) {
        if (typeof s !== 'string' || !s.trim()) return;
        var hit = sym.filter(function (x) { return (x.v1 && x.v1 === s) || U.norm(x.label) === U.norm(s) || U.norm(x.v1 || '') === U.norm(s); })[0];
        if (hit) { if (c.symptoms.indexOf(hit.id) < 0) c.symptoms.push(hit.id); } else if (c.customSymptoms.indexOf(s) < 0) c.customSymptoms.push(s);
      });
      c.notes = typeof e.notes === 'string' ? e.notes : '';
      var ts = Number(e.updatedAt) || now;
      d._u.checkin = ts; c.updatedAt = ts; d.updatedAt = Math.max(d.updatedAt || 0, ts);
    });
    // comidas (3 formatos)
    var titleIdx = Object.create(null);
    U.arr((dx || A.dx()).recipes).forEach(function (r) { titleIdx[U.norm(r.title)] = r.id; });
    var mealsV1 = J('detox_daily_meals', {});
    var slots = ['desayuno', 'almuerzo', 'merienda', 'cena'];
    if (U.isObj(mealsV1)) Object.keys(mealsV1).forEach(function (k) {
      var n = idxFrom(k, 'dia'); var e = mealsV1[k];
      if (n == null || !U.isObj(e)) return;
      var d = dayOf(n), any = false, newest = 0;
      slots.forEach(function (s) {
        if (e[s] == null) return;
        var parsed = slotItems(e[s]);
        var list = [];
        if (parsed.items) {
          parsed.items.forEach(function (it, i) {
            if (typeof it === 'string') it = { name: it };
            if (!U.isObj(it)) return;
            var name = String(it.name || it.text || '').trim();
            if (!name) return;
            var rid = it.recipeId || null;
            if (!rid && titleIdx[U.norm(name)]) rid = titleIdx[U.norm(name)];
            var t = Number(it.timestamp) || Number(it.t) || now;
            newest = Math.max(newest, t);
            list.push({ id: 'm_' + n + '_' + s + '_' + i, name: name, recipeId: rid, done: it.done === true || (it.done == null && parsed.done), t: t });
          });
        } else if (parsed.text && String(parsed.text).trim()) {
          var nm = String(parsed.text).trim();
          list.push({ id: 'm_' + n + '_' + s + '_0', name: nm, recipeId: titleIdx[U.norm(nm)] || null, done: parsed.done, t: now });
        }
        if (list.length) { d.meals[s] = list; any = true; }
      });
      if (any) L.touchDay(d, 'meals', newest || now);
    });
    report.days = Object.keys(days).filter(function (k) { return L.dayHasData(days[k]); }).length;
    // alergias
    var tAll = U.arr(L.tx(dx).allergens);
    var al = J('detox_user_allergies', []);
    U.arr(al).forEach(function (name) {
      if (typeof name !== 'string' || !name.trim()) return;
      var hit = tAll.filter(function (a) { return U.arr(a.v1).indexOf(name) > -1 || U.norm(a.label) === U.norm(name) || U.norm(a.id.replace(/_/g, ' ')) === U.norm(name); })[0];
      if (hit) { if (p.settings.allergies.indexOf(hit.id) < 0) p.settings.allergies.push(hit.id); }
      else if (p.settings.customAllergies.indexOf(name.trim()) < 0) p.settings.customAllergies.push(name.trim());
    });
    // compras
    var sc = J('detox_shopping_checked', {});
    if (U.isObj(sc)) Object.keys(sc).forEach(function (id) { if (sc[id] === true) p.shopping.checked[id] = now; });
    // heladera
    var fr = J('detox_fridge_selected', []);
    var hasCatalog = Object.keys(ix.ingredients).length > 0;
    p.fridge = U.uniq(U.arr(fr).filter(function (id) { return typeof id === 'string' && (!hasCatalog || ix.ingredients[id]); }));
    if (p.fridge.length) p.fridgeU = now;
    // sync
    if (raw.detox_sync_key && /^[A-Z0-9_-]{3,40}$/i.test(raw.detox_sync_key.trim())) p.settings.sync.legacyCode = raw.detox_sync_key.trim().toUpperCase();
    // detox_weekly_plan: no tiene fechas (solo «día 1»): se ignora a propósito (ver DECISIONES).
    p.settings.updatedAt = now;
    state.device.migratedFromV1At = now;
    return { state: state, report: report };
  };

  /* Payload de kvdb v1 (objeto plano) → estado v2 */
  L.migrateV1Payload = function (obj, dx, now, todayISO) {
    if (!U.isObj(obj)) return null;
    var map = { startDate: 'detox_start_date', startMode: 'detox_start_mode', completedMissions: 'detox_completed_missions', dailyJournal: 'detox_daily_journal',
      dailyMeals: 'detox_daily_meals', userAllergies: 'detox_user_allergies', shoppingChecked: 'detox_shopping_checked', fridgeSelected: 'detox_fridge_selected', weeklyPlan: 'detox_weekly_plan' };
    var raw = {};
    Object.keys(map).forEach(function (k) {
      if (obj[k] == null) return;
      raw[map[k]] = typeof obj[k] === 'string' ? obj[k] : JSON.stringify(obj[k]);
    });
    return L.migrateV1(raw, dx, now, todayISO);
  };
  L.isV1Payload = function (obj) {
    return U.isObj(obj) && !obj.schema && !obj.profiles && ('completedMissions' in obj || 'dailyJournal' in obj || 'dailyMeals' in obj || 'startDate' in obj);
  };
})(typeof window !== 'undefined' ? window : globalThis);
