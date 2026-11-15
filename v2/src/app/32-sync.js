/* Detox v2 — motor de sincronización: cola persistente, reintentos, pull al abrir/volver/cada 60 s,
   nunca aplica cambios mientras escribís. La lógica pura está en 16-crypto.js (L.syncOnce). */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic, esc = U.esc, I = A.icon;

  var S = A.Sync = { busy: false, error: null, backoff: 0, timer: null, interval: null };
  function sync() { var p = A.P(); return p && p.settings.sync; }
  S.enabled = function () { var s = sync(); return !!(s && s.code && L.syncAvailable() && root.fetch); };
  S.kv = function () { return L.kvClient(root.fetch.bind(root)); };

  function typing() {
    var a = document.activeElement;
    return a && /INPUT|TEXTAREA/.test(a.tagName) && a.type !== 'checkbox' && a.type !== 'radio' && a.type !== 'button';
  }
  S.schedule = function (ms) {
    if (!S.enabled()) return;
    clearTimeout(S.timer);
    S.timer = setTimeout(S.run, ms == null ? 1500 : ms);
  };
  S.run = function (force) {
    if (!S.enabled() || S.busy) return Promise.resolve(false);
    if (!force && typing()) { S.schedule(3000); return Promise.resolve(false); }
    if (!navigator.onLine) { S.error = 'Sin conexión: se envía cuando vuelva.'; A.renderChrome(); return Promise.resolve(false); }
    S.busy = true; A.renderChrome();
    var p = A.P(), pid = p.id, code = p.settings.sync.code, ver0 = A.ver;
    var snapshot = U.clone(p);
    return L.syncOnce({ kv: S.kv(), code: code, local: snapshot, dx: A.dx(), now: Date.now(), today: A.today() }).then(function (res) {
      S.busy = false; S.error = null; S.backoff = 0;
      var changedMeanwhile = A.ver !== ver0;
      A.update(function (s) {
        var cur = s.profiles[pid]; if (!cur) return;
        var merged = L.mergeProfile(cur, res.profile);   // lo editado durante el envío gana por su marca
        merged.settings.sync = cur.settings.sync;
        merged.settings.sync.lastPushAt = Date.now();
        if (res.pulled) merged.settings.sync.lastPullAt = Date.now();
        merged.settings.sync.dirty = changedMeanwhile;
        merged.settings.sync.error = null;
        L.settleEditions(merged, A.today());
        s.profiles[pid] = L.normalizeProfile(merged);
      }, { sync: false, render: !typing() });
      if (res.legacyImported) A.toast('Recuperamos ' + U.plural(res.legacyDays || 0, 'día') + ' de tu código viejo. Te conviene pasar a un código nuevo.', { ms: 7000 });
      if (changedMeanwhile) S.schedule();
      return true;
    }, function (e) {
      S.busy = false;
      S.error = e && e.message ? e.message : 'No se pudo sincronizar';
      S.backoff = Math.min(300000, S.backoff ? S.backoff * 2 : 5000);
      A.update(function (s, p2) { p2.settings.sync.dirty = true; p2.settings.sync.error = S.error; }, { sync: false, render: false });
      A.renderChrome();
      clearTimeout(S.timer); S.timer = setTimeout(S.run, S.backoff);
      return false;
    });
  };
  S.start = function () {
    clearInterval(S.interval);
    S.interval = setInterval(function () { if (document.visibilityState === 'visible') S.run(); }, 60000);
    if (S.enabled()) S.run();
  };
  document.addEventListener('visibilitychange', function () {
    if (!S.enabled()) return;
    if (document.visibilityState === 'visible') S.run();
    else if (sync().dirty) S.run(true);
  });
  root.addEventListener('online', function () { if (S.enabled()) S.run(); });

  /* Punto de estado en la cabecera */
  S.indicator = function () {
    var s = sync();
    if (!s || !s.code) return '';
    var cls = 'ok', txt = 'Sincronizado ' + U.ago(s.lastPushAt);
    if (!L.syncAvailable()) { cls = 'error'; txt = 'Sync no disponible aquí'; }
    else if (S.busy) { cls = 'pending'; txt = 'Sincronizando…'; }
    else if (S.error || s.error) { cls = 'error'; txt = 'Error de sync'; }
    else if (s.dirty) { cls = 'pending'; txt = 'Cambios por enviar'; }
    return '<a class="sync-dot ' + cls + '" href="#/ajustes/sync" title="' + esc(txt) + '" aria-label="' + esc(txt) + '"><i aria-hidden="true"></i><span>' + esc(txt) + '</span></a>';
  };

  /* ---------- acciones de vinculación ---------- */
  S.link = function (code, opts) {
    code = L.canonicalCode(code);
    A.update(function (s, p) { p.settings.sync.code = code; p.settings.sync.dirty = true; p.settings.sync.error = null; if (L.isLegacyCode(code)) p.settings.sync.legacyCode = code; }, { sync: false });
    S.error = null;
    return S.run(true).then(function (ok) { if (ok && !(opts && opts.quiet)) { A.toast('Dispositivo vinculado'); A.confetti(); } return ok; });
  };
  S.createCode = function () {
    var kv = S.kv(), tries = 0;
    function attempt() {
      var code = L.newSyncCode();
      return L.kvKey(code).then(function (k) { return kv.get(k); }).then(function (exists) {
        if (exists && ++tries < 5) return attempt();
        if (exists) throw new Error('No pudimos generar un código libre');
        return code;
      });
    }
    return attempt().then(function (code) { return S.link(code, { quiet: true }).then(function (ok) { if (!ok) throw new Error(S.error || 'No se pudo subir'); return code; }); });
  };
  S.unlink = function () {
    A.update(function (s, p) { p.settings.sync.code = null; p.settings.sync.dirty = false; p.settings.sync.error = null; }, { sync: false });
    S.error = null; clearTimeout(S.timer);
  };
  S.shareLink = function (code) {
    var base = location.protocol === 'https:' ? location.origin + location.pathname : 'https://urrozgustavo-collab.github.io/detox-primavera/';
    return base + '?sync=' + L.canonicalCode(code);
  };

  /* Enlace ?sync= abierto: pedir confirmación antes de vincular */
  A.openSyncLink = function (code) {
    A.ui.pendingSync = null;
    if (!L.syncAvailable()) { A.toast('Abrí la versión web (https) para vincular este dispositivo.'); return; }
    var p = A.P();
    if (p.settings.sync.code && L.canonicalCode(p.settings.sync.code) === L.canonicalCode(code)) return;
    A.confirm({ title: 'Vincular este dispositivo', html: 'Vas a sincronizar el perfil <b>' + esc(p.name || 'actual') + '</b> con el código <b class="code">' + esc(L.fmtCode(code)) + '</b>. Tus datos de este dispositivo y los de la nube se fusionan; no se pierde nada.', ok: 'Vincular' })
      .then(function (ok) { if (ok) S.link(code); });
  };
})(typeof window !== 'undefined' ? window : globalThis);
