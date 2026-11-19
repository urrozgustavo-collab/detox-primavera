/* Detox v2 — arranque: carga o migra el estado, aplica tema, enlaza la sync y pinta. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic;

  A.applyTheme = function () {
    var d = A.state.device, h = document.documentElement;
    var t = d.theme === 'system' ? (root.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : d.theme;
    h.setAttribute('data-theme', t);
    if (d.textScale > 1) h.setAttribute('data-text', 'large'); else h.removeAttribute('data-text');
    if (d.reduceMotion) h.setAttribute('data-motion', 'reduce'); else h.removeAttribute('data-motion');
    var m = document.getElementById('meta-theme');
    if (m) m.setAttribute('content', t === 'dark' ? '#181413' : '#FCF8F6');
  };

  function lsGet(k) { try { return root.localStorage.getItem(k); } catch (e) { return null; } }

  function boot() {
    var raw = lsGet(L.STATE_KEY), state = null, report = null;
    if (raw) {
      try { state = L.normalizeState(JSON.parse(raw)); }
      catch (e) {
        var key = 'detox2_state_corrupt_' + Date.now();
        try { root.localStorage.setItem(key, raw); } catch (x) { /* sin espacio */ }
        A.notices.corrupt = key; state = null;
      }
    }
    if (!state) {
      var v1 = L.readV1Raw(lsGet, document.cookie);
      // Si la v1 ya se importó alguna vez (marcador fuera del estado), no se re-migra sola: queda la opción manual en Ajustes.
      var already = !!lsGet(L.MIGRATED_KEY);
      if (Object.keys(v1).length && !already) {
        try {
          var r = L.migrateV1(v1, A.dx(), Date.now(), A.today()); state = r.state; report = r.report;
          if (report.warnings.length) state.device.v1Warnings = report.warnings.slice(0, 50);
          if (report.migrated) try { root.localStorage.setItem(L.MIGRATED_KEY, String(Date.now())); } catch (e) { /* sin almacenamiento */ }
        } catch (e) { console.error(e); A.reportError(e); state = null; }
      }
      if (!state) state = L.newState();
      if (!Object.keys(state.profiles).length) { var p = L.newProfile('', Date.now(), 0); state.profiles[p.id] = p; state.activeProfile = p.id; }
    }
    A.state = state;
    A.closeFinishedEditions();
    A.saveNow();
    A.applyTheme();
    if (root.matchMedia) try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { if (A.state.device.theme === 'system') A.applyTheme(); }); } catch (e) { /* navegadores viejos */ }

    // ?sync=CÓDIGO o #sync=CÓDIGO: se lee, se guarda para vincular y se quita de la URL
    var m = /[?&#]sync=([A-Za-z0-9_-]{4,40})/.exec(location.search + location.hash);
    if (m) {
      A.ui.pendingSync = m[1];
      var clean = location.pathname + location.search.replace(/[?&]sync=[^&]*/, '').replace(/^&/, '?') + location.hash.replace(/[#&]?sync=[^&]*/, '');
      try { history.replaceState(null, '', clean || location.pathname); } catch (e) { /* file: */ }
    }

    ['cocina', 'compras', 'guia', 'progreso', 'programas', 'ajustes', 'vos'].forEach(function (n) {
      if (!A.screens[n]) A.screens[n] = { render: function () { return '<p class="muted">Sección en preparación.</p>'; } };
    });
    A.route = A.parseHash();
    A.render();
    A.renderBanners();
    if (A.timers.list().length) { A.timers.paint(); A.timers.loop(); }

    if (!A.state.device.onboarded && A.onboarding) A.onboarding(report);
    else if (report && report.migrated) A.toast('Importamos tu progreso del Detox (' + U.plural(report.days, 'día') + ' con registros)' + (report.warnings.length ? '; ' + U.plural(report.warnings.length, 'dato no se pudo leer', 'datos no se pudieron leer') + ' (detalle en Ajustes › Datos).' : '.'), { ms: 7000 });
    if (A.ui.pendingSync && A.state.device.onboarded && A.openSyncLink) A.openSyncLink(A.ui.pendingSync);

    if (location.protocol === 'https:') {
      var link = document.createElement('link'); link.rel = 'manifest'; link.href = 'manifest.webmanifest'; document.head.appendChild(link);
      var ati = document.createElement('link'); ati.rel = 'apple-touch-icon'; ati.href = 'icon-192.png'; document.head.appendChild(ati);
      if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () { /* sin SW */ });
    }
    A.Sync && A.Sync.start();
    A.booted = true;
  }

  /* Ediciones cuya fecha ya pasó: se marcan terminadas (con su tarjeta de cierre). */
  A.closeFinishedEditions = function () {
    Object.keys(A.state.profiles).forEach(function (pid) {
      var p = A.state.profiles[pid];
      L.settleEditions(p, A.today());
      Object.keys(p.editions).forEach(function (id) {
        var e = p.editions[id];
        if (e.status !== 'active' && e.status !== 'planned') return;
        var c = L.clock(e, L.program(e.programId, p), A.today());
        var want = c.status === 'finished' ? 'done' : c.status === 'future' || c.status === 'nodate' ? 'planned' : 'active';
        if (want !== e.status) { e.status = want; e.updatedAt = Date.now(); if (want === 'done') e.closedAt = Date.now(); }
      });
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(typeof window !== 'undefined' ? window : globalThis);
