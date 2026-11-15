/* Detox v2 — núcleo de interfaz: estado + guardado, router por hash, delegación de eventos,
   diálogos, avisos, temporizadores, Wake Lock, confeti, descargas. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic, esc = U.esc;
  A.screens = {}; A.actions = {}; A.binds = {}; A.changes = {}; A.ui = {}; A.ver = 0;

  /* ================= estado y guardado ================= */
  A.storageOk = true;
  A.memoryOnly = false;
  function lsGet(k) { try { return root.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { root.localStorage.setItem(k, v); }
  A.saveNow = function () {
    A._saveT && clearTimeout(A._saveT); A._saveT = null;
    if (!A.state) return;
    try { lsSet(L.STATE_KEY, JSON.stringify(A.state)); if (!A.storageOk) { A.storageOk = true; A.renderBanners(); } }
    catch (e) { if (A.storageOk) { A.storageOk = false; A.renderBanners(); } }
  };
  A.save = function () { clearTimeout(A._saveT); A._saveT = setTimeout(A.saveNow, 400); };
  root.addEventListener('pagehide', A.saveNow);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') A.saveNow(); });

  A.P = function () { var s = A.state; return s && s.profiles[s.activeProfile]; };
  A.ED = function () { var p = A.P(); return p && p.activeEdition ? p.editions[p.activeEdition] || null : null; };
  A.PROG = function (ed) { ed = ed || A.ED(); return ed ? L.program(ed.programId, A.P()) : null; };
  A.debugToday = null;
  A.today = function () { return A.debugToday || U.today(); };
  A.now = function () { return Date.now(); };

  /* Cambia el estado. opts: { render:false, sync:false, meta:true (toca metadatos del perfil), settings:true } */
  A.update = function (fn, opts) {
    opts = opts || {};
    var p = A.P();
    var r = fn(A.state, p);
    A.ver++;
    var now = Date.now();
    if (p && opts.meta) p.updatedAt = now;
    if (p && opts.settings) p.settings.updatedAt = now;
    if (p && opts.sync !== false && p.settings && p.settings.sync && p.settings.sync.code) { p.settings.sync.dirty = true; A.Sync && A.Sync.schedule(); }
    A.save();
    A.askPersist();
    if (opts.render !== false) A.scheduleRender();
    return r;
  };
  var persistAsked = false;
  A.askPersist = function () {
    if (persistAsked) return; persistAsked = true;
    try { navigator.storage && navigator.storage.persist && navigator.storage.persist().catch(function () {}); } catch (e) { /* sin soporte */ }
  };

  /* Resumen memorizado por versión del estado */
  var sumMemo = {};
  A.sum = function (edId) {
    var p = A.P(); edId = edId || (p && p.activeEdition);
    if (!p || !edId || !p.editions[edId]) return null;
    var key = A.ver + '|' + A.today() + '|' + p.id + '|' + edId;
    if (sumMemo[edId] && sumMemo[edId].key === key) return sumMemo[edId].v;
    var v = L.summary(p, edId, A.today());
    sumMemo[edId] = { key: key, v: v };
    return v;
  };

  /* ================= router ================= */
  A.route = { name: 'hoy', parts: [], path: '/hoy' };
  A.parseHash = function () {
    var h = String(location.hash || '').replace(/^#\/?/, '');
    var q = h.indexOf('?'); if (q > -1) h = h.slice(0, q);
    var parts = h.split('/').filter(Boolean).map(function (x) { try { return decodeURIComponent(x); } catch (e) { return x; } });
    var name = parts[0] || 'hoy';
    if (!A.screens[name]) name = 'hoy';
    return { name: name, parts: parts.slice(1), path: '/' + [name].concat(parts.slice(1)).join('/') };
  };
  A.href = function (path) { return '#' + path.split('/').map(function (s) { return s ? encodeURIComponent(s) : s; }).join('/'); };
  A.go = function (path, opts) {
    if (opts && opts.replace) { history.replaceState(null, '', A.href(path)); onRoute(); }
    else if (location.hash === A.href(path)) onRoute();
    else location.hash = A.href(path);
  };
  var scrollMem = {};
  function onRoute() {
    var prev = A.route.path;
    scrollMem[prev] = root.scrollY;
    A.route = A.parseHash();
    A.ui.routeChanged = prev !== A.route.path;
    A.closeAllDialogs(true);
    A.render();
    if (A.ui.routeChanged) {
      var y = scrollMem[A.route.path];
      root.scrollTo(0, A.route.parts.length && /receta|sos|herbario|edicion|informe/.test(A.route.path) ? 0 : (y || 0));
      // El foco va al título de la pantalla nueva (lo anuncia el lector de pantalla).
      var h1 = document.querySelector('#main h1') || document.getElementById('main');
      if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1');
      if (A.booted && !A.anyDialogOpen()) h1.focus({ preventScroll: true });
      var target = A.ui.scrollTo; A.ui.scrollTo = null;
      if (target) setTimeout(function () { var el = document.getElementById(target); if (el) { el.scrollIntoView({ block: 'center' }); el.classList.add('flash'); setTimeout(function () { el.classList.remove('flash'); }, 1600); } }, 30);
    }
  }
  root.addEventListener('hashchange', onRoute);

  /* ================= render ================= */
  var rq = false;
  /* rAF para pintar junto al próximo cuadro; el temporizador cubre pestañas en segundo plano (rAF se pausa). */
  A.scheduleRender = function () {
    if (rq) return; rq = true;
    var done = false, run = function () { if (done) return; done = true; rq = false; A.render(); };
    if (root.requestAnimationFrame) root.requestAnimationFrame(run);
    setTimeout(run, 60);
  };
  A.render = function () {
    if (!A.state) return;
    var main = document.getElementById('main');
    var scr = A.screens[A.route.name];
    var active = document.activeElement, fk = null, sel = null;
    if (active && main.contains(active)) {
      fk = active.id ? '#' + active.id : (active.dataset && active.dataset.fk ? '[data-fk="' + active.dataset.fk + '"]' : null);
      try { if (active.selectionStart != null) sel = [active.selectionStart, active.selectionEnd]; } catch (e) { /* no aplica */ }
    }
    A.renderChrome();
    var html;
    try { html = scr.render(A.route); }
    catch (e) { console.error(e); html = '<div class="card warn"><b>Esta pantalla tuvo un problema.</b><p>' + esc(e.message) + '</p><a class="btn" href="#/hoy">Volver a Hoy</a></div>'; A.reportError(e); }
    main.innerHTML = html;
    try { scr.mount && scr.mount(main, A.route); } catch (e) { console.error(e); A.reportError(e); }
    if (fk) { var el = main.querySelector(fk); if (el) { el.focus({ preventScroll: true }); if (sel && el.setSelectionRange) try { el.setSelectionRange(sel[0], sel[1]); } catch (e) { /* tipo sin selección */ } } }
    var prog = A.PROG();
    document.documentElement.setAttribute('data-program-theme', (prog && prog.theme) || 'primavera');
    var h1 = main.querySelector('h1');
    var names = { hoy: 'Hoy', cocina: 'Cocina', compras: 'Compras', guia: 'Guía', progreso: 'Progreso', programas: 'Programas', ajustes: 'Ajustes' };
    var t = names[A.route.name] || '';
    if (h1 && A.route.parts.length && h1.textContent.trim() !== t) t = h1.textContent.trim() + ' · ' + t;
    document.title = (t ? t + ' · ' : '') + 'Detox de Primavera';
    A.markOverflow(main);
  };
  /* Pista de que una fila de chips o pestañas sigue hacia la derecha (difuminado del borde). */
  A.markOverflow = function (root) {
    (root || document).querySelectorAll('.seg, .chips.scroll').forEach(function (el) {
      var more = el.scrollWidth > el.clientWidth + 2;
      el.classList.toggle('overflowing', more && el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
      if (more && !el.dataset.ovl) { el.dataset.ovl = 1; el.addEventListener('scroll', function () { el.classList.toggle('overflowing', el.scrollLeft + el.clientWidth < el.scrollWidth - 2); }, { passive: true }); }
    });
  };
  root.addEventListener('resize', U.debounce(function () { A.markOverflow(); }, 200));
  /* Re-render parcial: elementos con data-part="nombre" usan screen.parts[nombre](route). */
  A.refresh = function (name) {
    var scr = A.screens[A.route.name];
    if (!scr.parts || !scr.parts[name]) return A.render();
    document.querySelectorAll('[data-part="' + name + '"]').forEach(function (el) { el.innerHTML = scr.parts[name](A.route, el); });
  };

  /* ================= cromo: cabecera, riel, barra ================= */
  A.icon = function (name, cls) { return '<svg class="i' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; };
  var NAV = [['hoy', 'Hoy', 'hoy'], ['cocina', 'Cocina', 'cocina'], ['compras', 'Compras', 'compras'], ['guia', 'Guía', 'guia'], ['progreso', 'Progreso', 'progreso']];
  A.isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  A.renderChrome = function () {
    var p = A.P(), ed = A.ED(), prog = A.PROG(), r = A.route.name;
    var badge = A.shoppingBadge ? A.shoppingBadge() : 0;
    var bHtml = badge ? '<span class="badge" aria-label="' + badge + ' pendientes">' + (badge > 99 ? '99+' : badge) + '</span>' : '';
    var tab = NAV.map(function (n) {
      return '<a href="#/' + n[0] + '"' + (r === n[0] ? ' aria-current="page"' : '') + '>' + A.icon(n[2]) + '<span>' + n[1] + '</span>' + (n[0] === 'compras' ? bHtml : '') + '</a>';
    }).join('');
    document.getElementById('tabbar').innerHTML = tab;
    var rail = '<a class="brand" href="#/hoy">' + A.plantMark(36) + '<span><b>' + esc(prog ? prog.name : 'Detox de Primavera') + '</b><small class="meta">' + esc(A.dayLabel()) + '</small></span></a>' +
      NAV.concat([['programas', 'Programas', 'flor'], ['ajustes', 'Ajustes', 'ajustes']]).map(function (n, i) {
        return (i === 5 ? '<div class="sep"></div>' : '') + '<a class="nav" href="#/' + n[0] + '"' + (r === n[0] ? ' aria-current="page"' : '') + '>' + A.icon(n[2]) + '<span>' + n[1] + '</span>' + (n[0] === 'compras' ? bHtml : '') + '</a>';
      }).join('') +
      '<button class="nav-search btn ghost" data-action="openSearch" style="justify-content:flex-start;margin-top:8px">' + A.icon('buscar') + 'Buscar <kbd class="meta" style="margin-left:auto">' + (A.isMac ? '⌘K' : 'Ctrl K') + '</kbd></button>' +
      '<div class="foot">v' + esc(A.version) + (p ? ' · ' + esc(p.name || 'Sin nombre') : '') + '</div>';
    document.getElementById('rail').innerHTML = rail;
    var sync = A.Sync ? A.Sync.indicator() : '';
    document.getElementById('topbar').innerHTML =
      '<div class="title"><b>' + esc(prog ? prog.name : 'Detox de Primavera') + '</b><span>' + esc(A.dayLabel()) + '</span></div>' + sync +
      '<button class="icon-btn" data-action="openSearch" aria-label="Buscar (' + (A.isMac ? '⌘K' : 'Ctrl+K') + ')">' + A.icon('buscar') + '</button>' +
      '<button class="icon-btn avatar-btn" data-action="openProfileSheet" aria-label="Perfil, programas y ajustes">' + A.avatar(p, 34) + '</button>';
  };
  A.avatar = function (p, size) {
    size = size || 34;
    var c = (p && p.color) || '#3D6B4F';
    var t = p && p.emoji ? p.emoji : (p && p.name ? p.name.charAt(0).toUpperCase() : '·');
    return '<span class="avatar" style="width:' + size + 'px;height:' + size + 'px;background:' + esc(c) + '" aria-hidden="true">' + esc(t) + '</span>';
  };
  A.dayLabel = function () {
    var ed = A.ED(), prog = A.PROG();
    if (!ed) return 'Sin programa en curso';
    var c = L.clock(ed, prog, A.today());
    if (c.status === 'nodate') return 'Sin fecha de inicio';
    if (c.status === 'future') return 'Empieza en ' + U.plural(c.daysUntil, 'día');
    if (c.status === 'finished') return 'Terminado · ' + c.days + ' días';
    return 'Día ' + c.idx + ' de ' + c.days;
  };

  /* ================= banners persistentes ================= */
  A.notices = {};
  A.renderBanners = function () {
    var out = [];
    if (!A.storageOk) out.push('<div class="banner danger" role="alert">' + A.icon('alerta') + '<div class="grow"><b>No se puede guardar en este navegador.</b>Tus cambios viven solo en esta pestaña: exportá una copia antes de cerrarla.</div><button class="btn sm" data-action="exportBackup">Exportar</button></div>');
    if (A.notices.corrupt) out.push('<div class="banner danger" role="alert">' + A.icon('alerta') + '<div class="grow"><b>Encontramos datos dañados y arrancamos de cero.</b>Los datos originales quedaron guardados aparte (' + esc(A.notices.corrupt) + ') por si hay que recuperarlos.</div><button class="icon-btn sm" data-action="dismissNotice" data-k="corrupt" aria-label="Cerrar aviso">' + A.icon('cerrar', 'sm') + '</button></div>');
    if (A.notices.error) out.push('<div class="banner" role="alert">' + A.icon('alerta') + '<div class="grow"><b>Algo falló, pero tus datos están a salvo.</b>' + esc(A.notices.error) + '</div><button class="btn sm" data-action="exportBackup">Exportar copia</button><button class="icon-btn sm" data-action="dismissNotice" data-k="error" aria-label="Cerrar aviso">' + A.icon('cerrar', 'sm') + '</button></div>');
    if (location.protocol === 'file:' && A.state && !A.state.device.fileNoticeSeen) out.push('<div class="banner info">' + A.icon('info') + '<div class="grow"><b>Abierto como archivo.</b>Estos datos viven solo en este archivo y navegador. Usá la versión web o exportá copias seguido.</div><button class="icon-btn sm" data-action="dismissFileNotice" aria-label="Entendido">' + A.icon('cerrar', 'sm') + '</button></div>');
    document.getElementById('banners').innerHTML = out.join('');
  };
  A.actions.dismissNotice = function (el) { A.notices[el.dataset.k] = null; A.renderBanners(); };
  A.actions.dismissFileNotice = function () { A.update(function (s) { s.device.fileNoticeSeen = true; }, { sync: false, render: false }); A.renderBanners(); };
  var errCount = 0;
  A.reportError = function (e) {
    if (++errCount > 20) return;
    A.notices.error = (e && e.message ? e.message : String(e)).slice(0, 160);
    try { A.renderBanners(); } catch (x) { /* nada */ }
  };
  root.addEventListener('error', function (ev) { if (ev && ev.error) A.reportError(ev.error); });
  root.addEventListener('unhandledrejection', function (ev) { if (ev && ev.reason && !(ev.reason && ev.reason.quiet)) A.reportError(ev.reason); });

  /* ================= eventos delegados ================= */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el || el.closest('[aria-disabled="true"]')) return;
    var fn = A.actions[el.dataset.action];
    if (!fn) return;
    if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.dataset.prevent) e.preventDefault();
    try { fn(el, e); } catch (err) { console.error(err); A.reportError(err); }
  });
  document.addEventListener('input', function (e) {
    var el = e.target.closest('[data-bind]');
    if (el && A.binds[el.dataset.bind]) try { A.binds[el.dataset.bind](el, e); } catch (err) { console.error(err); A.reportError(err); }
  });
  document.addEventListener('change', function (e) {
    var el = e.target.closest('[data-change]');
    if (el && A.changes[el.dataset.change]) try { A.changes[el.dataset.change](el, e); } catch (err) { console.error(err); A.reportError(err); }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target.closest('form[data-submit]');
    if (!f) return;
    e.preventDefault();
    var fn = A.actions[f.dataset.submit];
    if (fn) try { fn(f, e); } catch (err) { console.error(err); A.reportError(err); }
  });
  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    var typing = /INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable);
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); A.actions.openSearch(); return; }
    if (e.key === '/' && !typing && !anyDialogOpen()) { e.preventDefault(); A.actions.openSearch(); return; }
    if (A.onKey) A.onKey(e, typing);
  });
  root.addEventListener('scroll', function () {
    var tb = document.getElementById('topbar'); if (tb) tb.classList.toggle('scrolled', root.scrollY > 4);
  }, { passive: true });

  /* ================= diálogos ================= */
  function anyDialogOpen() { return !!document.querySelector('dialog[open]'); }
  A.anyDialogOpen = anyDialogOpen;
  var dlgState = {};
  A.openSheet = function (o) {
    var id = o.id || 'sheet';
    var d = document.getElementById(id);
    var prevRet = d.open && dlgState[id] ? dlgState[id].ret : null;
    var prevSel = d.open && dlgState[id] ? dlgState[id].sel : null;
    if (d.open) d.close();
    var tid = id + '-title';
    d.innerHTML = '<div class="grabber" aria-hidden="true"></div><div class="sheet-h"><h2 id="' + tid + '">' + esc(o.title || '') + '</h2>' +
      (o.headExtra || '') + '<button class="icon-btn" data-action="closeDialog" data-dlg="' + id + '" aria-label="Cerrar">' + A.icon('cerrar') + '</button></div>' +
      '<div class="sheet-b">' + (o.body || '') + '</div>' + (o.foot ? '<div class="sheet-f">' + o.foot + '</div>' : '');
    d.className = 'sheet' + (o.cls ? ' ' + o.cls : '');
    var opener = prevRet || document.activeElement;
    dlgState[id] = { onClose: o.onClose, ret: opener, sel: prevSel || selectorFor(opener) };
    d.showModal();
    var f = o.focus ? d.querySelector(o.focus) : null;
    if (f) f.focus(); else { var b = d.querySelector('.sheet-b'); b && b.setAttribute('tabindex', '-1'); }
    o.mount && o.mount(d);
    return d;
  };
  A.closeDialog = function (id) { var d = document.getElementById(id || 'sheet'); if (d && d.open) d.close(); };
  A.closeAllDialogs = function (keepCook) {
    ['sheet2', 'sheet'].concat(keepCook ? [] : ['cook']).forEach(function (id) { var d = document.getElementById(id); if (d && d.open) d.close(); });
  };
  A.actions.closeDialog = function (el) { A.closeDialog(el.dataset.dlg); };
  ['sheet', 'sheet2', 'cook'].forEach(function (id) {
    var d = document.getElementById(id);
    d.addEventListener('close', function () {
      if (d.open) return;   // se volvió a abrir con otro contenido antes de que llegara el evento
      var st = dlgState[id] || {}; dlgState[id] = null;
      st.onClose && st.onClose();
      var back = st.ret && st.ret.isConnected ? st.ret : (st.sel ? document.querySelector(st.sel) : null);
      if (back) try { back.focus({ preventScroll: true }); } catch (e) { /* nada */ }
    });
    d.addEventListener('click', function (e) { if (e.target === d && id !== 'cook') d.close(); });
  });
  /* Selector estable del botón que abrió un diálogo (la cabecera se repinta y el nodo cambia). */
  function selectorFor(el) {
    if (!el || el === document.body || !el.getAttribute) return null;
    if (el.id) return '#' + CSS.escape(el.id);
    var a = el.getAttribute('data-action'); if (!a) return null;
    var sel = '[data-action="' + a + '"]';
    ['data-r', 'data-p', 'data-slot', 'data-d', 'data-s', 'data-id', 'data-e'].forEach(function (k) { var v = el.getAttribute(k); if (v != null) sel += '[' + k + '="' + CSS.escape(v) + '"]'; });
    return sel;
  }
  /* Confirmación accesible (no confirm()). typed: palabra que hay que escribir. */
  A.confirm = function (o) {
    return new Promise(function (resolve) {
      var done = false;
      A.openSheet({
        id: 'sheet2', title: o.title,
        body: '<p>' + (o.html || esc(o.text || '')) + '</p>' + (o.typed ? '<label class="field"><span>Escribí <b>' + esc(o.typed) + '</b> para confirmar</span><input class="input" id="confirm-typed" autocomplete="off"></label>' : '') +
          (o.checkbox ? '<label class="check"><input type="checkbox" id="confirm-check"><span>' + esc(o.checkbox) + '</span></label>' : ''),
        foot: '<button class="btn" data-action="closeDialog" data-dlg="sheet2">' + esc(o.cancel || 'Cancelar') + '</button><button class="btn ' + (o.danger ? 'danger solid' : 'primary') + '" id="confirm-ok">' + esc(o.ok || 'Aceptar') + '</button>',
        focus: o.typed ? '#confirm-typed' : '#confirm-ok',
        onClose: function () { if (!done) resolve(false); },
        mount: function (d) {
          d.querySelector('#confirm-ok').addEventListener('click', function () {
            if (o.typed) { var v = d.querySelector('#confirm-typed').value.trim(); if (U.norm(v) !== U.norm(o.typed)) { A.toast('Escribí «' + o.typed + '» para confirmar'); return; } }
            var cb = d.querySelector('#confirm-check'); A.ui.confirmChecked = cb ? cb.checked : false;
            done = true; d.close(); resolve(true);
          });
        }
      });
    });
  };

  /* ================= avisos ================= */
  /* Un <dialog> modal tapa todo lo demás: si hay uno abierto, el aviso se muestra adentro. */
  function toastHost() {
    var d = ['sheet2', 'sheet', 'cook'].map(function (id) { return document.getElementById(id); }).filter(function (x) { return x && x.open; })[0];
    if (!d) return document.getElementById('toasts');
    var h = d.querySelector(':scope > .toast-host');
    if (!h) { h = document.createElement('div'); h.className = 'toast-host'; h.setAttribute('role', 'status'); h.setAttribute('aria-live', 'polite'); d.appendChild(h); }
    return h;
  }
  A.toast = function (msg, o) {
    o = o || {};
    var box = toastHost();
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<div class="grow">' + (o.html ? msg : esc(msg)) + '</div>' + (o.action ? '<button type="button">' + esc(o.action.label) + '</button>' : '');
    var kill = function () { if (!t.isConnected) return; t.classList.add('out'); setTimeout(function () { t.remove(); }, 200); };
    if (o.action) t.querySelector('button').addEventListener('click', function () { kill(); o.action.fn(); });
    box.appendChild(t);
    while (box.children.length > 3) box.firstChild.remove();
    if (!o.sticky) setTimeout(kill, o.ms || (o.action ? 6000 : 3200));
    return kill;
  };

  /* ================= confeti propio (≤ 1,2 s) ================= */
  A.reduceMotion = function () {
    return (A.state && A.state.device.reduceMotion) || (root.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  };
  A.confetti = function () {
    if (A.reduceMotion() || (A.state && A.state.device.confetti === false)) return;
    var c = document.createElement('canvas'); c.id = 'confetti';
    var dpr = Math.min(2, root.devicePixelRatio || 1);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr; c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px';
    document.body.appendChild(c);
    var ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
    var cs = getComputedStyle(document.documentElement);
    var cols = ['--accent', '--bloom', '--pollen', '--accent-soft'].map(function (v) { return cs.getPropertyValue(v).trim() || '#3D6B4F'; });
    var parts = [];
    for (var i = 0; i < 70; i++) parts.push({ x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .45, vx: (Math.random() - .5) * 9, vy: -Math.random() * 9 - 3, r: Math.random() * Math.PI, w: 5 + Math.random() * 5, h: 8 + Math.random() * 6, c: cols[i % cols.length], leaf: i % 3 === 0 });
    var t0 = performance.now();
    (function frame(t) {
      var k = (t - t0) / 1200;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(function (p) {
        p.vy += .32; p.x += p.vx; p.y += p.vy; p.r += .12;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.max(0, 1 - k); ctx.fillStyle = p.c;
        if (p.leaf) { ctx.beginPath(); ctx.ellipse(0, 0, p.w * .5, p.h * .8, 0, 0, Math.PI * 2); ctx.fill(); } else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * .6);
        ctx.restore();
      });
      if (k < 1) requestAnimationFrame(frame); else c.remove();
    })(t0);
  };

  /* ================= descargas, copiar, compartir ================= */
  A.download = function (name, text, mime) {
    var blob = text instanceof Blob ? text : new Blob([text], { type: mime || 'application/octet-stream' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; a.rel = 'noopener';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  };
  A.copy = function (text) {
    if (navigator.clipboard && root.isSecureContext) return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    return Promise.resolve(fallbackCopy(text));
  };
  function fallbackCopy(text) {
    var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove(); return ok;
  }
  /* Compartir: Web Share si existe; si no, copia. */
  A.share = function (o) {
    if (navigator.share && root.isSecureContext) {
      var data = { title: o.title, text: o.text };
      if (o.files && navigator.canShare && navigator.canShare({ files: o.files })) data = { title: o.title, files: o.files };
      return navigator.share(data).then(function () { return 'shared'; }, function (e) { if (e && e.name === 'AbortError') return 'cancel'; return copyIt(); });
    }
    return copyIt();
    function copyIt() { return A.copy(o.text || '').then(function (ok) { A.toast(ok ? 'Copiado: pegalo donde quieras' : 'No se pudo copiar'); return ok ? 'copied' : 'fail'; }); }
  };

  /* ================= sonido, vibración ================= */
  var actx = null;
  function audio() {
    if (!actx) { var C = root.AudioContext || root.webkitAudioContext; if (C) try { actx = new C(); } catch (e) { actx = null; } }
    if (actx && actx.state === 'suspended') actx.resume().catch(function () {});
    return actx;
  }
  document.addEventListener('pointerdown', function () { if (actx) audio(); }, { passive: true });
  A.chime = function () {
    if (A.state && A.state.device.sound === false) return;
    var c = audio(); if (!c) return;
    [0, .35, .7].forEach(function (d, i) {
      var o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.value = [880, 1046, 1318][i];
      g.gain.setValueAtTime(0.0001, c.currentTime + d); g.gain.exponentialRampToValueAtTime(0.25, c.currentTime + d + .02); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + d + .3);
      o.connect(g); g.connect(c.destination); o.start(c.currentTime + d); o.stop(c.currentTime + d + .32);
    });
  };
  A.primeAudio = function () { audio(); };

  /* ================= temporizadores persistentes (por hora de fin) ================= */
  var tick = null;
  A.timers = {
    list: function () { return A.state ? (A.state.device.timers || []).filter(function (t) { return !t.deleted; }) : []; },
    start: function (label, sec, recipe) {
      A.primeAudio();
      if (root.Notification && Notification.permission === 'default' && root.isSecureContext) try { Notification.requestPermission(); } catch (e) { /* sin soporte */ }
      var t = { id: U.uid('t'), label: label, endAt: Date.now() + sec * 1000, dur: sec, recipe: recipe || null, fired: false, u: Date.now() };
      A.update(function (s) { s.device.timers.push(t); }, { render: false, sync: false });
      A.timers.paint(); A.timers.loop();
      A.toast('Temporizador: ' + label + ' · ' + U.fmtDuration(sec));
      return t;
    },
    remove: function (id) { A.update(function (s) { s.device.timers = s.device.timers.filter(function (t) { return t.id !== id; }); }, { render: false, sync: false }); A.timers.paint(); },
    add: function (id, sec) {
      A.update(function (s) { s.device.timers.forEach(function (t) { if (t.id === id) { var base = t.fired ? Date.now() : t.endAt; t.endAt = base + sec * 1000; t.fired = false; t.u = Date.now(); } }); }, { render: false, sync: false });
      A.timers.paint(); A.timers.loop();
    },
    loop: function () {
      if (tick) return;
      tick = setInterval(function () {
        var list = A.timers.list();
        if (!list.length) { clearInterval(tick); tick = null; }
        list.forEach(function (t) { if (!t.fired && t.endAt <= Date.now()) A.timers.fire(t); });
        A.timers.paint();
      }, 1000);
    },
    fire: function (t) {
      t.fired = true; A.save();
      A.chime();
      try { navigator.vibrate && navigator.vibrate([300, 150, 300, 150, 300]); } catch (e) { /* sin vibración */ }
      if (root.Notification && Notification.permission === 'granted' && document.visibilityState !== 'visible') try { new Notification('¡Listo! ' + t.label, { body: 'Terminó el temporizador.', tag: t.id }); } catch (e) { /* móviles sin soporte */ }
      A.toast('¡Listo! ' + t.label, { sticky: true, action: { label: 'Ok', fn: function () { A.timers.remove(t.id); } } });
    },
    paint: function () {
      var boxes = [document.getElementById('timers'), document.querySelector('#cook .cook-timers')].filter(Boolean);
      var list = A.timers.list();
      if (!list.length) { boxes.forEach(function (b) { b.innerHTML = ''; }); return; }
      var now = Date.now();
      var html = list.map(function (t) {
        var left = Math.max(0, Math.round((t.endAt - now) / 1000)), ring = left === 0;
        return '<div class="timer-pill' + (ring ? ' ring-now' : '') + '">' + A.icon('timer', 'sm') + '<span class="ellipsis" style="max-width:40vw">' + esc(t.label) + '</span><span class="num" aria-label="' + (ring ? 'Terminado' : 'Quedan ' + U.fmtDuration(left)) + '">' + (ring ? '¡Listo!' : U.fmtDuration(left)) + '</span>' +
          '<button class="icon-btn sm" data-action="timerAdd" data-id="' + t.id + '" aria-label="Sumar un minuto">+1</button><button class="icon-btn sm" data-action="timerRemove" data-id="' + t.id + '" aria-label="Quitar temporizador">' + A.icon('cerrar', 'sm') + '</button></div>';
      }).join('');
      boxes.forEach(function (b) { b.innerHTML = html; });
    }
  };
  A.actions.timerAdd = function (el) { A.timers.add(el.dataset.id, 60); };
  A.actions.timerRemove = function (el) { A.timers.remove(el.dataset.id); };
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') { A.timers.paint(); A.wake.reacquire(); } });

  /* ================= Wake Lock ================= */
  A.wake = {
    sentinel: null, wanted: false,
    supported: function () { return 'wakeLock' in navigator && root.isSecureContext; },
    request: function () {
      A.wake.wanted = true;
      if (!A.wake.supported()) return Promise.resolve(false);
      return navigator.wakeLock.request('screen').then(function (s) {
        A.wake.sentinel = s; s.addEventListener('release', function () { A.wake.sentinel = null; A.wake.onchange && A.wake.onchange(); });
        A.wake.onchange && A.wake.onchange(); return true;
      }, function () { return false; });
    },
    release: function () { A.wake.wanted = false; if (A.wake.sentinel) A.wake.sentinel.release().catch(function () {}); A.wake.sentinel = null; },
    reacquire: function () { if (A.wake.wanted && !A.wake.sentinel) A.wake.request(); },
    active: function () { return !!A.wake.sentinel; }
  };

  /* ================= archivos ================= */
  A.pickFile = function (accept) {
    return new Promise(function (resolve) {
      var inp = document.createElement('input'); inp.type = 'file'; inp.accept = accept || '';
      inp.addEventListener('change', function () { var f = inp.files && inp.files[0]; if (!f) return resolve(null); f.text().then(function (t) { resolve({ name: f.name, text: t }); }, function () { resolve(null); }); });
      inp.click();
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
