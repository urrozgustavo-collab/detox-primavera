/* Detox v2 — Ajustes: perfiles, salud, hogar, apariencia, copia de seguridad, sincronización, recordatorios, edición, datos. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic, K = A.kit, esc = U.esc, I = A.icon;

  A.screens.ajustes = {
    render: function () {
      var p = A.P(), d = A.state.device;
      return K.crumb() + '<header class="page-h"><h1>Ajustes</h1></header>' + profileSec(p) + healthSec(p) + homeSec(p) + lookSec(d) + backupSec(d) + syncSec(p) + icsSec() + editionSec(p) + dataSec() + aboutSec();
    },
    mount: function (main, route) { if (route.parts[0] === 'sync') { var el = document.getElementById('sync'); el && el.scrollIntoView({ block: 'start' }); } }
  };
  function sec(id, title, body, extra) { return '<section class="card set-sec" id="' + id + '" aria-labelledby="' + id + '-h"><div class="card-h"><h2 id="' + id + '-h">' + title + '</h2>' + (extra || '') + '</div>' + body + '</section>'; }
  function sw(label, change, on, hint) { return '<label class="switch"><span>' + esc(label) + (hint ? '<span class="meta" style="display:block">' + esc(hint) + '</span>' : '') + '</span><input type="checkbox" data-change="' + change + '"' + (on ? ' checked' : '') + '></label>'; }

  /* ---------- perfiles ---------- */
  function profileSec(p) {
    var profs = Object.keys(A.state.profiles).map(function (k) { return A.state.profiles[k]; });
    return sec('perfil', 'Perfil',
      '<label class="field"><span>Nombre</span><input class="input" id="pf-name" data-bind="profName" value="' + esc(p.name) + '" maxlength="30" placeholder="¿Cómo te llamás?" autocomplete="given-name"></label>' +
      '<p class="label">Color</p><div class="swatches" role="group" aria-label="Color del perfil">' + L.PROFILE_COLORS.map(function (c) { return '<button class="swatch" style="background:' + c + '" data-action="profColor" data-c="' + c + '" aria-pressed="' + (p.color === c) + '" aria-label="Color ' + c + '"></button>'; }).join('') + '</div>' +
      '<p class="label mt">Ícono</p><div class="emoji-pick chips" role="group" aria-label="Ícono del perfil">' + L.PROFILE_EMOJIS.map(function (e) { return '<button data-action="profEmoji" data-e="' + e + '" aria-pressed="' + (p.emoji === e) + '">' + e + '</button>'; }).join('') + '</div>' +
      '<hr class="sep">' +
      '<p class="label">Personas en este dispositivo</p><ul class="list">' + profs.map(function (x) {
        var me = x.id === p.id;
        return '<li class="profile-row">' + A.avatar(x, 36) + '<span class="grow"><b>' + esc(x.name || 'Sin nombre') + '</b>' + (me ? '<span class="meta"> · en uso</span>' : '') + '</span>' +
          (me ? '' : '<button class="btn sm" data-action="switchProfile" data-p="' + x.id + '">Usar</button>') + (profs.length > 1 ? '<button class="icon-btn sm" data-action="delProfile" data-p="' + x.id + '" aria-label="Borrar perfil ' + esc(x.name) + '">' + I('borrar', 'sm') + '</button>' : '') + '</li>';
      }).join('') + '</ul><button class="btn sm mt-s" data-action="addProfile">' + I('mas', 'sm') + 'Sumar persona</button><p class="meta mt-s">Cada persona tiene su diario, alergias y progreso. Para usar la app en dos celulares, cada una sincroniza el suyo.</p>');
  }
  A.binds.profName = function (el) { A.update(function (s, p) { p.name = el.value.trim(); }, { render: false, meta: true }); A.renderChrome(); };
  A.actions.profColor = function (el) { A.update(function (s, p) { p.color = el.dataset.c; }, { meta: true }); };
  A.actions.profEmoji = function (el) { A.update(function (s, p) { p.emoji = el.dataset.e; }, { meta: true }); };
  A.actions.switchProfile = function (el) {
    A.update(function (s) { s.activeProfile = el.dataset.p; }, { sync: false });
    A.closeDialog(); A.ui.lastStage = null;
    A.toast('Ahora estás usando el perfil de ' + (A.P().name || 'otra persona'));
    A.Sync.start();
  };
  A.actions.addProfile = function () {
    A.openSheet({ title: 'Sumar persona', body: '<form data-submit="addProfileSave"><label class="field"><span>Nombre</span><input class="input" name="n" required maxlength="30" autocomplete="off"></label><button class="btn primary">Crear perfil</button></form>', focus: 'input' });
  };
  A.actions.addProfileSave = function (f) {
    var n = f.n.value.trim(); if (!n) return;
    var count = Object.keys(A.state.profiles).length;
    A.update(function (s) { var np = L.newProfile(n, Date.now(), count); s.profiles[np.id] = np; s.activeProfile = np.id; }, { sync: false });
    A.closeDialog(); A.toast('Perfil de ' + n + ' creado. Empezá su programa en Hoy.'); A.go('/hoy');
  };
  A.actions.delProfile = function (el) {
    var x = A.state.profiles[el.dataset.p];
    A.confirm({ title: 'Borrar el perfil de ' + (x.name || 'esta persona'), text: 'Se borran su diario, ediciones y ajustes de este dispositivo. No se puede deshacer (salvo que tengas una copia).', typed: x.name || 'BORRAR', ok: 'Borrar perfil', danger: true }).then(function (ok) {
      if (!ok) return;
      A.update(function (s) { delete s.profiles[x.id]; if (s.activeProfile === x.id) s.activeProfile = Object.keys(s.profiles)[0]; }, { sync: false });
      A.toast('Perfil borrado');
    });
  };

  /* ---------- salud ---------- */
  function healthSec(p) {
    var tx = L.tx(), s = p.settings;
    return sec('salud', 'Salud y cuerpo',
      '<p class="label">Alergias e intolerancias</p><div class="chips" role="group" aria-label="Alergias">' + U.arr(tx.allergens).map(function (a) { var on = s.allergies.indexOf(a.id) > -1; return '<button class="chip' + (on ? ' on' : '') + '" data-action="allergy" data-a="' + a.id + '" aria-pressed="' + on + '">' + esc(a.label) + '</button>'; }).join('') +
      s.customAllergies.map(function (c) { return '<button class="chip on" data-action="customAllergyDel" data-a="' + esc(c) + '" aria-label="Quitar ' + esc(c) + '">' + esc(c) + I('cerrar', 'sm x') + '</button>'; }).join('') + '</div>' +
      '<form class="row mt-s" data-submit="customAllergyAdd"><input class="input" name="a" placeholder="Otra (ej.: palta)" maxlength="40" aria-label="Otra alergia o intolerancia"><button class="btn sm">Agregar</button></form><p class="meta mt-s">Se marcan en recetas, sugerencias y compras. Las que escribas se buscan por palabra completa en los ingredientes.</p>' +
      '<hr class="sep">' +
      '<p class="label">Condiciones de salud</p><p class="meta">Activan avisos en hábitos, SOS y el herbario. No se comparten con nadie.</p>' + U.arr(tx.conditions).map(function (c) { return '<label class="check"><input type="checkbox" data-change="condition" value="' + c.id + '"' + (s.conditions.indexOf(c.id) > -1 ? ' checked' : '') + '><span>' + esc(c.label) + '</span></label>'; }).join('') +
      '<hr class="sep">' +
      '<p class="label">Constitución</p><div class="seg" role="group" aria-label="Constitución">' + [[null, 'No sé'], ['friolento', 'Friolento/a'], ['caluroso', 'Caluroso/a']].map(function (c) { return '<button data-action="constitution" data-c="' + (c[0] || '') + '" aria-pressed="' + (s.constitution === c[0]) + '">' + c[1] + '</button>'; }).join('') + '</div>' +
      (s.constitution ? '<p class="meta mt-s">' + esc((U.arr(tx.constitutions).filter(function (x) { return x.id === s.constitution; })[0] || {}).desc || '') + '</p>' : '') +
      '<button class="btn sm mt-s" data-action="constTest">' + I('info', 'sm') + 'Hacer el test de 4 preguntas</button>');
  }
  A.actions.allergy = function (el) { var a = el.dataset.a; A.update(function (s, p) { var l = p.settings.allergies, i = l.indexOf(a); if (i > -1) l.splice(i, 1); else l.push(a); }, { settings: true }); };
  A.actions.customAllergyAdd = function (f) { var v = f.a.value.trim(); if (!v) return; A.update(function (s, p) { if (p.settings.customAllergies.indexOf(v) < 0) p.settings.customAllergies.push(v); }, { settings: true }); };
  A.actions.customAllergyDel = function (el) { var v = el.dataset.a; A.update(function (s, p) { p.settings.customAllergies = p.settings.customAllergies.filter(function (x) { return x !== v; }); }, { settings: true }); };
  A.changes.condition = function (el) { var c = el.value; A.update(function (s, p) { var l = p.settings.conditions, i = l.indexOf(c); if (el.checked && i < 0) l.push(c); if (!el.checked && i > -1) l.splice(i, 1); }, { settings: true }); };
  A.actions.constitution = function (el) { A.update(function (s, p) { p.settings.constitution = el.dataset.c || null; }, { settings: true }); };
  var QUIZ = ['¿Solés tener las manos y los pies fríos?', '¿Tomás poca agua porque casi no tenés sed?', '¿Transpirás poco, incluso con calor?', '¿Se te hincha el abdomen bajo después de comer crudos?'];
  A.actions.constTest = function () {
    A.openSheet({ title: '¿Friolento/a o caluroso/a?', body: '<form data-submit="constTestSave"><p class="muted">Según la guía (págs. 6, 11 y 24). Respondé pensando en cómo sos habitualmente.</p>' + QUIZ.map(function (q, i) { return '<fieldset class="field"><legend class="label">' + esc(q) + '</legend><div class="chips"><label class="chip soft"><input type="radio" name="q' + i + '" value="1" required> Sí</label><label class="chip soft"><input type="radio" name="q' + i + '" value="0"> No</label></div></fieldset>'; }).join('') + '<button class="btn primary">Ver resultado</button></form>' });
  };
  A.actions.constTestSave = function (f) {
    var yes = 0; for (var i = 0; i < QUIZ.length; i++) { var x = f.querySelector('input[name="q' + i + '"]:checked'); if (x && x.value === '1') yes++; }
    var res = yes >= 2 ? 'friolento' : 'caluroso';
    A.update(function (s, p) { p.settings.constitution = res; }, { settings: true });
    A.closeDialog();
    A.toast(res === 'friolento' ? 'Resultado: friolento/a. Vamos a priorizar comidas cocidas y calientes.' : 'Resultado: caluroso/a. Los crudos y frescos te pueden sentar bien.', { ms: 6000 });
  };

  /* ---------- hogar ---------- */
  function homeSec(p) {
    var s = p.settings;
    return sec('hogar', 'Hogar',
      '<div class="row between"><span>Porciones que cocinás<span class="meta" style="display:block">Para calcular cantidades en Compras</span></span><div class="row"><button class="icon-btn" data-action="servings" data-d="-1" aria-label="Menos porciones">' + I('menos') + '</button><b class="num" style="font-size:1.4rem;min-width:2ch;text-align:center" aria-live="polite">' + s.servings + '</b><button class="icon-btn" data-action="servings" data-d="1" aria-label="Más porciones">' + I('mas') + '</button></div></div>' +
      '<label class="field mt"><span>Meta de agua por día (ml)</span><input class="input" type="number" min="500" max="6000" step="50" data-change="waterGoal" value="' + L.waterGoal(p, A.PROG()) + '" inputmode="numeric"></label>');
  }
  A.actions.servings = function (el) { A.update(function (s, p) { p.settings.servings = Math.max(1, Math.min(12, (p.settings.servings || 2) + (+el.dataset.d))); }, { settings: true }); };
  A.changes.waterGoal = function (el) { var v = Math.max(500, Math.min(6000, Math.round(+el.value || 2000))); A.update(function (s, p) { p.settings.waterGoalMl = v; }, { settings: true }); };

  /* ---------- apariencia ---------- */
  function lookSec(d) {
    return sec('apariencia', 'Apariencia y sonido',
      '<p class="label">Tema</p><div class="seg" role="group" aria-label="Tema">' + [['system', 'Sistema', 'sistema'], ['light', 'Claro', 'sol'], ['dark', 'Oscuro', 'luna']].map(function (t) { return '<button data-action="theme" data-t="' + t[0] + '" aria-pressed="' + (d.theme === t[0]) + '">' + I(t[2], 'sm') + t[1] + '</button>'; }).join('') + '</div>' +
      sw('Letra grande', 'textScale', d.textScale > 1) + sw('Reducir movimiento', 'reduceMotion', d.reduceMotion, 'Sin animaciones ni confeti') + sw('Sonidos', 'sound', d.sound !== false, 'Aviso de los temporizadores') + sw('Celebraciones', 'confetti', d.confetti !== false, 'Confeti discreto al completar un día o un logro') +
      sw('Pantalla encendida al cocinar', 'cookingLock', d.cookingLock !== false, 'En el modo cocina, si el navegador lo permite'));
  }
  A.actions.theme = function (el) { A.update(function (s) { s.device.theme = el.dataset.t; }, { sync: false }); A.applyTheme(); };
  ['textScale', 'reduceMotion', 'sound', 'confetti', 'cookingLock'].forEach(function (k) {
    A.changes[k] = function (el) { A.update(function (s) { s.device[k] = k === 'textScale' ? (el.checked ? 1.125 : 1) : el.checked; }, { sync: false }); A.applyTheme(); };
  });

  /* ---------- copia de seguridad ---------- */
  function backupSec(d) {
    return sec('copia', 'Copia de seguridad',
      A.backupChip(true) + '<div class="btn-row"><button class="btn primary" data-action="exportBackup">' + I('descargar', 'sm') + 'Exportar todo</button><button class="btn" data-action="exportBackup" data-scope="profile">' + I('persona', 'sm') + 'Solo este perfil</button>' +
      (navigator.share && navigator.canShare ? '<button class="btn" data-action="shareBackup">' + I('compartir', 'sm') + 'Compartir</button>' : '') + '<button class="btn" data-action="importBackup">' + I('subir', 'sm') + 'Importar</button></div>' +
      '<p class="meta mt-s">Un archivo .json con todo: perfiles, ediciones, diario, recetas propias. Guardalo en tu Drive o mandátelo por WhatsApp. También acepta copias de la versión anterior.</p>');
  }
  function backupData(scope) {
    var st = U.clone(A.state);
    if (scope === 'profile') { var pid = st.activeProfile; var one = {}; one[pid] = st.profiles[pid]; st.profiles = one; }
    Object.keys(st.profiles).forEach(function (k) { if (st.profiles[k].settings) st.profiles[k].settings.sync = L.newSettings().sync; });
    return JSON.stringify({ type: 'detox-backup', app: 'Detox de Primavera', version: A.version, exportedAt: new Date().toISOString(), scope: scope || 'all', state: st }, null, 1);
  }
  function backupName() { return 'detox-backup-' + A.today() + '.json'; }
  A.actions.exportBackup = function (el) {
    A.download(backupName(), backupData(el && el.dataset.scope), 'application/json');
    A.update(function (s) { s.device.lastBackupAt = Date.now(); }, { sync: false });
    A.toast('Copia descargada: ' + backupName());
  };
  A.actions.shareBackup = function () {
    var file = new File([backupData()], backupName(), { type: 'application/json' });
    A.share({ title: 'Copia de Detox', text: 'Copia de seguridad de Detox de Primavera', files: [file] }).then(function (r) { if (r === 'shared') A.update(function (s) { s.device.lastBackupAt = Date.now(); }, { sync: false }); });
  };
  A.actions.importBackup = function () {
    A.pickFile('.json,application/json').then(function (f) {
      if (!f) return;
      var obj; try { obj = JSON.parse(f.text); } catch (e) { return A.toast('El archivo no es un JSON válido'); }
      var incoming = null, kind = 'v2', from = '';
      try {
        if (obj && obj.type === 'detox-backup' && obj.state) { incoming = L.normalizeState(U.clone(obj.state)); from = 'copia de la versión 2'; }
        else if (obj && obj.schema && obj.profiles) { incoming = L.normalizeState(U.clone(obj)); from = 'estado de la versión 2'; }
        else if (L.isV1Payload(obj)) { var mig = L.migrateV1Payload(obj, A.dx(), Date.now(), A.today()); incoming = mig.state; kind = 'v1'; from = 'copia de la versión 1'; incoming.report = mig.report; }
      } catch (e) { return A.toast('No pudimos leer la copia: ' + e.message); }
      if (!incoming) return A.toast('El archivo no parece una copia de Detox');
      A.openImportPreview(incoming, kind, from);
    });
  };
  function profileSummary(p, local, label) {
    var eds = Object.keys(p.editions).length, days = 0;
    Object.keys(p.days).forEach(function (e) { Object.keys(p.days[e]).forEach(function (k) { if (L.dayHasData(p.days[e][k])) days++; }); });
    return '<li class="li">' + A.avatar(p, 32) + '<span class="grow"><b>' + esc(label || p.name || 'Sin nombre') + '</b><span class="meta">' + U.plural(eds, 'edición', 'ediciones') + ' · ' + U.plural(days, 'día') + ' con datos' + (local && A.state.profiles[p.id] ? ' · ya existe acá' : '') + '</span></span></li>';
  }
  /* Vista previa de importación. kind 'v1': datos de UNA persona → fusionar en el perfil activo o crear uno nuevo. */
  A.openImportPreview = function (incoming, kind, from) {
    A.ui.importing = { state: incoming, kind: kind };
    var me = A.P();
    var profs = Object.keys(incoming.profiles).map(function (k) { return incoming.profiles[k]; });
    var ws = incoming.report && incoming.report.warnings || [];
    var warn = ws.length ? '<details class="mt-s"><summary>' + U.plural(ws.length, 'dato no se pudo importar', 'datos no se pudieron importar') + '</summary><ul>' + ws.map(function (w) { return '<li class="meta">' + esc(w) + '</li>'; }).join('') + '</ul></details>' : '';
    if (kind === 'v1') {
      A.openSheet({ title: 'Importar datos de la versión anterior', body: '<p>Encontramos una ' + esc(from) + ' (es de una sola persona):</p><ul class="list">' + profileSummary(profs[0], false, 'Versión anterior') + '</ul>' + warn +
        '<p class="mt"><b>Fusionar en el perfil de ' + esc(me.name || 'este perfil') + '</b>: suma esos días a tu historial; si ya tenés la misma edición se combinan día por día y no se pierde nada.</p><p><b>Crear perfil nuevo</b>: los deja aparte, en un perfil «Importado (versión anterior)».</p>',
        foot: '<button class="btn" data-action="importDo" data-m="newv1">Crear perfil nuevo</button><button class="btn primary" data-action="importDo" data-m="mergev1">Fusionar en ' + esc(me.name || 'mi perfil') + '</button>' });
      return;
    }
    A.openSheet({ title: 'Importar copia', body: '<p>Encontramos una ' + esc(from) + ':</p><ul class="list">' + profs.map(function (p) { return profileSummary(p, true); }).join('') + '</ul>' + warn +
      '<p class="meta mt">«Fusionar» combina con lo que ya tenés (no se pierde nada). «Como perfiles nuevos» los suma aparte (con «(copia)» si el nombre se repite). «Reemplazar todo» borra lo de este dispositivo.</p>',
      foot: '<button class="btn danger" data-action="importDo" data-m="replace">Reemplazar todo</button><button class="btn" data-action="importDo" data-m="new">Como perfiles nuevos</button><button class="btn primary" data-action="importDo" data-m="merge">Fusionar</button>' });
  };
  A.uniqueProfileName = function (name, s) {
    var names = Object.keys(s.profiles).map(function (k) { return s.profiles[k].name; });
    if (names.indexOf(name) < 0) return name;
    var n = name + ' (copia)', i = 2;
    while (names.indexOf(n) > -1) n = name + ' (copia ' + (i++) + ')';
    return n;
  };
  A.actions.importDo = function (el) {
    var imp = A.ui.importing, mode = el.dataset.m;
    if (!imp) return;
    var inc = imp.state;
    var go = function () {
      A.update(function (s) {
        if (mode === 'replace') { var dev = s.device; Object.keys(s).forEach(function (k) { delete s[k]; }); Object.assign(s, U.clone(inc)); delete s.report; s.device = dev; s.device.onboarded = true; }
        else if (mode === 'mergev1') {
          var merged = L.mergeV1IntoProfile(s.profiles[s.activeProfile], inc.profiles[inc.activeProfile], A.today());
          s.profiles[s.activeProfile] = L.normalizeProfile(merged);
        } else if (mode === 'new' || mode === 'newv1') {
          Object.keys(inc.profiles).forEach(function (k) {
            var p = U.clone(inc.profiles[k]); p.id = U.uid('p'); p.settings.sync = L.newSettings().sync;
            p.name = A.uniqueProfileName(mode === 'newv1' ? 'Importado (versión anterior)' : (p.name || 'Sin nombre'), s);
            s.profiles[p.id] = p; s.activeProfile = p.id;
          });
        } else {
          var m = L.mergeState(s, inc); s.profiles = m.profiles;
        }
      }, { sync: true });
      if (imp.kind === 'v1') { try { localStorage.setItem(L.MIGRATED_KEY, String(Date.now())); } catch (e) { /* sin almacenamiento */ } }
      A.ui.importing = null; A.closeDialog(); A.closeFinishedEditions();
      A.toast(mode === 'mergev1' ? 'Datos de la versión anterior sumados a tu perfil' : 'Copia importada'); A.go('/hoy');
    };
    if (mode === 'replace') A.confirm({ title: 'Reemplazar todo', text: 'Se borra todo lo de este dispositivo y queda solo lo de la copia.', ok: 'Reemplazar', danger: true }).then(function (ok) { if (ok) go(); });
    else go();
  };
  /* Reimportación manual de las claves detox_* que siguen en este navegador */
  A.v1Raw = function () { return L.readV1Raw(function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, document.cookie); };
  A.actions.reimportV1 = function () {
    var raw = A.v1Raw();
    if (!L.hasV1Data(raw)) return A.toast('No quedan datos de la versión anterior en este navegador');
    var mig = L.migrateV1(raw, A.dx(), Date.now(), A.today());
    mig.state.report = mig.report;
    A.openImportPreview(mig.state, 'v1', 'copia guardada en este navegador por la versión anterior');
  };

  /* ---------- sincronización ---------- */
  function syncSec(p) {
    var s = p.settings.sync;
    if (!L.syncAvailable()) return sec('sync', 'Sincronizar dispositivos', '<p>La sincronización cifrada necesita abrir la app desde su dirección web segura (https), no como archivo. Mientras tanto, pasá tus datos con <b>Copia de seguridad</b>.</p>');
    if (!s.code) {
      return sec('sync', 'Sincronizar dispositivos',
        '<p>Usá tu perfil en el celular y en la compu. Los datos viajan <b>cifrados</b>: sin tu código nadie puede leerlos. Cada persona sincroniza su propio perfil.</p>' +
        (s.legacyCode ? '<div class="banner info">' + I('nube') + '<div class="grow"><b>Tenías el código ' + esc(s.legacyCode) + ' en la versión anterior.</b>Podés traer lo que quedó en la nube y fusionarlo.</div><button class="btn sm" data-action="syncLegacy">Recuperar</button></div>' : '') +
        '<div class="btn-row"><button class="btn primary" data-action="syncCreate">' + I('nube', 'sm') + 'Crear código nuevo</button></div>' +
        '<form class="row mt" data-submit="syncLinkForm"><input class="input" name="c" placeholder="XXXX-XXXX-XXXX" autocomplete="off" autocapitalize="characters" aria-label="Código de otro dispositivo" maxlength="40"><button class="btn">Vincular</button></form><p class="meta mt-s">¿Ya lo creaste en otro dispositivo? Escribí el código o abrí el enlace que te mandaste.</p>');
    }
    var legacy = L.isLegacyCode(s.code);
    var link = A.Sync.shareLink(s.code);
    return sec('sync', 'Sincronizar dispositivos',
      (legacy ? '<div class="banner">' + I('candado') + '<div class="grow"><b>Estás usando un código viejo y corto.</b>Pasá a uno nuevo de 12 caracteres: es mucho más seguro y tus datos quedan cifrados.</div><button class="btn sm" data-action="syncUpgrade">Pasar ahora</button></div>' : '') +
      '<p class="label">Tu código</p><p class="code">' + esc(L.fmtCode(s.code)) + '</p>' +
      '<p class="meta">Último envío: ' + esc(U.ago(s.lastPushAt)) + (s.lastPullAt ? ' · última recepción: ' + esc(U.ago(s.lastPullAt)) : '') + (A.Sync.error || s.error ? '<br><span style="color:var(--danger-text)">' + esc(A.Sync.error || s.error) + '</span>' : '') + (s.dirty ? '<br>Hay cambios esperando para enviarse.' : '') + '</p>' +
      '<div class="btn-row mt"><button class="btn primary" data-action="syncNow">' + I('refrescar', 'sm') + 'Sincronizar ahora</button><button class="btn" data-action="syncCopy">' + I('link', 'sm') + 'Copiar enlace</button><button class="btn" data-action="syncShare">' + I('compartir', 'sm') + 'Compartir</button><button class="btn" data-action="syncQR">' + I('qr', 'sm') + 'QR</button><button class="btn danger" data-action="syncUnlink">Desvincular</button></div>' +
      '<p class="meta mt-s">Abrí el enlace o escaneá el QR en tu otro dispositivo, <b>con el perfil de la misma persona</b>. El código es la llave: compartilo solo con vos.</p><input type="hidden" id="sync-link" value="' + esc(link) + '">');
  }
  A.actions.syncCreate = function (el) {
    el.setAttribute('aria-disabled', 'true');
    A.Sync.createCode().then(function (code) { A.toast('Código creado: ' + L.fmtCode(code)); A.render(); A.actions.syncQR(); }, function (e) { A.toast('No se pudo crear: ' + e.message); A.render(); });
  };
  A.actions.syncLinkForm = function (f) {
    var c = f.c.value.trim();
    if (!L.isNewCode(c) && !L.isLegacyCode(c)) return A.toast('Ese código no parece válido');
    A.Sync.link(c).then(function (ok) { if (!ok) A.toast('No se pudo vincular: ' + (A.Sync.error || 'probá de nuevo')); A.render(); });
  };
  A.actions.syncLegacy = function () { var c = A.P().settings.sync.legacyCode; A.Sync.link(c).then(function () { A.render(); }); };
  A.actions.syncUpgrade = function () {
    A.Sync.createCode().then(function (code) { A.toast('Listo: tu código nuevo es ' + L.fmtCode(code) + '. Vinculá tus otros dispositivos con este.', { ms: 8000 }); A.render(); A.actions.syncQR(); }, function (e) { A.toast('No se pudo: ' + e.message); });
  };
  A.actions.syncNow = function () { A.Sync.run(true).then(function (ok) { A.toast(ok ? 'Sincronizado' : 'No se pudo sincronizar: ' + (A.Sync.error || '')); A.render(); }); };
  A.actions.syncCopy = function () { A.copy(document.getElementById('sync-link').value).then(function (ok) { A.toast(ok ? 'Enlace copiado' : 'No se pudo copiar'); }); };
  A.actions.syncShare = function () { A.share({ title: 'Vincular Detox', text: 'Abrí este enlace en tu otro dispositivo para sincronizar tu Detox: ' + document.getElementById('sync-link').value }); };
  A.actions.syncQR = function () {
    var s = A.P().settings.sync; if (!s.code) return;
    var link = A.Sync.shareLink(s.code);
    var svg = L.qr.svg(link, 'QR para vincular otro dispositivo');
    A.openSheet({ title: 'Escaneá con tu otro dispositivo', body: '<div class="qr center">' + (svg ? '<div style="display:inline-block">' + svg + '</div>' : '<p>No se pudo generar el QR.</p>') + '</div><p class="code center mt">' + esc(L.fmtCode(s.code)) + '</p><p class="meta center">El QR se genera en tu dispositivo: no se envía a ningún servicio.</p>' });
  };
  A.actions.syncUnlink = function () {
    A.confirm({ title: 'Desvincular', text: 'Este dispositivo deja de sincronizar. Tus datos quedan acá y en la nube; podés volver a vincular con el mismo código.', ok: 'Desvincular' }).then(function (ok) { if (ok) { A.Sync.unlink(); A.render(); } });
  };

  /* ---------- recordatorios .ics ---------- */
  function icsSec() {
    var t = A.ui.ics || (A.ui.ics = { water: '08:00', checkin: '21:00', soak: '20:30' });
    var ed = A.ED();
    if (!ed || !U.isValidISO(ed.startDate)) return sec('recordatorios', 'Recordatorios', '<p class="muted">Empezá un programa para generar los recordatorios.</p>');
    return sec('recordatorios', 'Recordatorios en tu calendario',
      '<p>Descargá un archivo .ics y abrilo: se agregan a Google Calendar, Apple o Outlook. Funcionan aunque la app esté cerrada.</p>' +
      '<div class="grid2"><label class="field"><span>Agua con limón</span><input class="input" type="time" data-change="icsTime" data-k="water" value="' + t.water + '"></label><label class="field"><span>Check-in del día</span><input class="input" type="time" data-change="icsTime" data-k="checkin" value="' + t.checkin + '"></label></div>' +
      '<label class="field"><span>Remojos (solo los días que el plan lo necesita)</span><input class="input" type="time" data-change="icsTime" data-k="soak" value="' + t.soak + '"></label>' +
      '<button class="btn primary" data-action="downloadICS">' + I('calendario', 'sm') + 'Descargar recordatorios</button>');
  }
  A.changes.icsTime = function (el) { A.ui.ics[el.dataset.k] = el.value; };
  A.actions.downloadICS = function () {
    var p = A.P(), s = A.sum();
    var ev = L.reminderEvents(p, s, A.ui.ics, A.today());
    var tz = 'America/Argentina/Buenos_Aires';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || tz; } catch (e) { /* por defecto */ }
    A.download('detox-recordatorios.ics', L.buildICS(ev, { tz: tz }), 'text/calendar;charset=utf-8');
    A.toast(U.plural(ev.length, 'recordatorio') + ' en el archivo. Abrilo para agregarlos.');
  };

  /* ---------- edición actual ---------- */
  function editionSec(p) {
    var ed = A.ED(), prog = A.PROG();
    if (!ed) return '';
    return sec('edicion', 'Edición actual',
      '<p><b>' + esc(prog ? prog.name : ed.programId) + '</b> · ' + (ed.startDate ? 'desde el ' + esc(U.fmtDate(ed.startDate, 'long')) : 'sin fecha') + '</p>' +
      '<div class="btn-row mt"><button class="btn" data-action="editionDate">' + I('calendario', 'sm') + 'Cambiar fecha o modo</button><button class="btn" data-action="editionArchive">' + I('frasco', 'sm') + 'Terminar y archivar</button><button class="btn danger" data-action="editionReset">' + I('refrescar', 'sm') + 'Reiniciar edición</button></div>' +
      '<p class="meta mt-s">Cambiar el modo de inicio no reescribe tus registros: solo cambia qué fase corresponde a cada día.</p>');
  }
  A.actions.editionDate = function () {
    var ed = A.ED(), prog = A.PROG();
    A.openSheet({ title: 'Fecha y modo', body: '<form data-submit="editionDateSave"><label class="field"><span>Fecha de inicio</span><input class="input" type="date" name="d" value="' + esc(ed.startDate || A.today()) + '" required></label>' +
      (U.arr(prog.startModes).length > 1 ? '<p class="label">Modo de inicio</p>' + prog.startModes.map(function (m) { return '<label class="check"><input type="radio" name="m" value="' + esc(m.id) + '"' + (ed.startMode === m.id ? ' checked' : '') + '><span>' + esc(m.label) + '</span></label>'; }).join('') : '') +
      '<button class="btn primary mt">Guardar</button></form>' });
  };
  A.actions.editionDateSave = function (f) {
    var d = f.d.value; if (!U.isValidISO(d)) return A.toast('Fecha inválida');
    var m = f.querySelector('input[name="m"]:checked');
    A.update(function (s, p) { var e = p.editions[p.activeEdition]; e.startDate = d; if (m) e.startMode = m.value; e.updatedAt = Date.now(); if (e.status === 'done') e.status = 'active'; });
    A.closeFinishedEditions(); A.closeDialog(); A.toast('Edición actualizada');
  };
  A.actions.editionArchive = function () {
    A.confirm({ title: 'Terminar y archivar', text: 'La edición queda en tu historial con todos sus datos. Después podés empezar otra.', ok: 'Archivar' }).then(function (ok) {
      if (!ok) return;
      A.update(function (s, p) { var e = p.editions[p.activeEdition]; e.status = 'archived'; e.closedAt = Date.now(); e.updatedAt = Date.now(); p.activeEdition = null; }, { meta: true });
      A.go('/hoy');
    });
  };
  A.actions.editionReset = function () {
    A.confirm({ title: 'Reiniciar edición', text: 'Se borran los hábitos, el agua, las comidas y los check-ins de esta edición (no toca recetas, compras ni otras ediciones). No se puede deshacer salvo con una copia.', typed: 'REINICIAR', ok: 'Reiniciar', danger: true }).then(function (ok) {
      if (!ok) return;
      A.update(function (s, p) { var id = p.activeEdition; var now = Date.now(); var d = p.days[id] || {}; Object.keys(d).forEach(function (k) { var nd = L.newDay(); nd._u = { habits: now, water: now, checkin: now, meals: now }; Object.keys(d[k].meals || {}).forEach(function (sl) { nd.meals[sl] = d[k].meals[sl].map(function (m) { var c = U.clone(m); c.deleted = true; c.u = now; return c; }); }); d[k] = nd; }); });
      A.toast('Edición reiniciada'); A.go('/hoy');
    });
  };

  /* ---------- datos ---------- */
  function dataSec() {
    var hasV1 = L.hasV1Data(A.v1Raw());
    return sec('datos', 'Datos de este dispositivo',
      (location.protocol === 'file:' ? '<div class="banner info">' + I('info') + '<div class="grow"><b>Abierto como archivo.</b>Estos datos viven solo en este archivo y navegador. Usá la versión web o exportá copias seguido.</div></div>' : '') +
      (U.arr(A.state.device.v1Warnings).length ? '<details class="mb"><summary>Al importar la versión anterior, ' + U.plural(A.state.device.v1Warnings.length, 'dato no se pudo leer', 'datos no se pudieron leer') + '</summary><ul>' + A.state.device.v1Warnings.map(function (w) { return '<li class="meta">' + esc(w) + '</li>'; }).join('') + '</ul></details>' : '') +
      '<p class="meta">Todo se guarda en este navegador.' + (hasV1 ? ' Los datos de la versión anterior siguen guardados aparte (no se borran solos).' : '') + '</p>' +
      '<div class="btn-row mt-s">' + (hasV1 ? '<button class="btn" data-action="reimportV1">' + I('subir', 'sm') + 'Volver a importar datos de la versión anterior</button>' : '') +
      '<button class="btn danger" data-action="wipeAll">' + I('borrar', 'sm') + 'Borrar todo</button></div>');
  }
  A.wipeV1 = function () {
    L.V1_KEYS.forEach(function (k) {
      try { localStorage.removeItem(k); } catch (e) { /* nada */ }
      if (document.cookie.indexOf(k + '=') > -1) document.cookie = k + '=; max-age=0; path=/';   // solo para vencer las cookies espejo de la v1
    });
  };
  A.actions.wipeAll = function () {
    var hasV1 = L.hasV1Data(A.v1Raw());
    A.confirm({ title: 'Borrar todo', text: 'Se borran todos los perfiles y datos de esta app en este dispositivo. Exportá una copia antes si la querés conservar.', typed: 'BORRAR', ok: 'Borrar todo', danger: true,
      checkbox: hasV1 ? 'Borrar también los datos guardados por la versión anterior (si no, quedan en el navegador y podés volver a importarlos desde Ajustes)' : null }).then(function (ok) {
      if (!ok) return;
      var alsoV1 = !!A.ui.confirmChecked;
      try { localStorage.removeItem(L.STATE_KEY); localStorage.setItem(L.MIGRATED_KEY, String(Date.now())); } catch (e) { /* nada */ }
      if (alsoV1) A.wipeV1();
      var st = L.newState(); st.device.onboarded = false;
      var pnew = L.newProfile('', Date.now(), 0); st.profiles[pnew.id] = pnew; st.activeProfile = pnew.id;
      A.state = st; A.ver++; A.saveNow();
      A.go('/hoy'); if (A.onboarding) A.onboarding(null);
      A.toast(alsoV1 ? 'Se borró todo, también lo de la versión anterior.' : 'Se borró todo. Los datos de la versión anterior siguen guardados aparte.');
    });
  };
  function aboutSec() {
    var b = root.DX_BUILD || {};
    return sec('acerca', 'Acerca de',
      '<p><b>Detox de Primavera</b> · versión ' + esc(A.version) + (b.date ? ' (' + esc(b.date) + ')' : '') + '</p>' +
      '<p>Contenido: guía del taller «Detox de Primavera» de Isabel Caparra. La app es de uso personal y no reemplaza la consulta médica.</p>' +
      '<p class="meta">Privacidad: tus datos quedan en este dispositivo. Solo salen si activás la sincronización, y en ese caso viajan cifrados con tu código. Sin publicidad, sin cuentas, sin rastreo. Funciona sin conexión.</p>' +
      '<p class="meta">Atajos: ' + (A.isMac ? '⌘K' : 'Ctrl+K') + ' o / para buscar · ← → para cambiar de paso en el modo cocina · Esc para cerrar.</p>');
  }

  /* ---------- hoja del perfil (avatar) ---------- */
  A.actions.openProfileSheet = function () {
    var p = A.P(), d = A.state.device;
    var profs = Object.keys(A.state.profiles).map(function (k) { return A.state.profiles[k]; });
    A.openSheet({ title: p.name || 'Tu perfil', body:
      '<ul class="list">' + profs.map(function (x) { var me = x.id === p.id; return '<li><button class="li" data-action="' + (me ? 'closeDialog' : 'switchProfile') + '" data-p="' + x.id + '" data-dlg="sheet">' + A.avatar(x, 36) + '<span class="grow"><b>' + esc(x.name || 'Sin nombre') + '</b>' + (me ? '<span class="meta">En uso</span>' : '<span class="meta">Cambiar a este perfil</span>') + '</span>' + (me ? I('check') : I('chev', 'chev')) + '</button></li>'; }).join('') + '</ul>' +
      '<ul class="list mt-s"><li><button class="li" data-action="addProfile">' + I('mas') + '<span class="grow"><b>Sumar persona</b><span class="meta">Cada una lleva su propio diario</span></span></button></li>' +
      '<li><a class="li" href="#/programas">' + I('flor') + '<span class="grow"><b>Programas</b><span class="meta">Repetir, cambiar o crear uno</span></span>' + I('chev', 'chev') + '</a></li>' +
      '<li><a class="li" href="#/ajustes">' + I('ajustes') + '<span class="grow"><b>Ajustes</b><span class="meta">Salud, copia de seguridad, sincronizar</span></span>' + I('chev', 'chev') + '</a></li></ul>' +
      '<p class="label mt">Tema</p><div class="seg" role="group" aria-label="Tema">' + [['system', 'Sistema', 'sistema'], ['light', 'Claro', 'sol'], ['dark', 'Oscuro', 'luna']].map(function (t) { return '<button data-action="themeSheet" data-t="' + t[0] + '" aria-pressed="' + (d.theme === t[0]) + '">' + I(t[2], 'sm') + t[1] + '</button>'; }).join('') + '</div>' });
  };
  A.actions.themeSheet = function (el) {
    A.actions.theme(el);
    document.querySelectorAll('#sheet [data-action="themeSheet"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.t === el.dataset.t)); });
  };
})(typeof window !== 'undefined' ? window : globalThis);
