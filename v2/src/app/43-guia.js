/* Detox v2 — Guía: semáforo «¿Puedo comer…?», SOS, herbario («Alimentos Medicina») y el taller. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic, K = A.kit, esc = U.esc, I = A.icon;
  var TABS = [['#/guia/semaforo', 'semaforo', 'Semáforo'], ['#/guia/sos', 'sos', 'SOS'], ['#/guia/herbario', 'herbario', 'Herbario'], ['#/guia/taller', 'taller', 'El taller']];
  var KIND = { hierba: 'Hierba', alimento: 'Alimento', suplemento: 'Suplemento', agua: 'Agua' };
  var THERMAL = { calido: 'Cálida', neutro: 'Neutra', fresco: 'Fresca', frio: 'Fría' };

  function conds() { var p = A.P(); return (p && p.settings.conditions) || []; }
  function condLabel(id) { var c = L.idx().conditions[id]; return c ? c.label : id; }
  function curDay() { var ed = A.ED(); if (!ed) return null; var c = L.clock(ed, A.PROG(), A.today()); return c.status === 'active' || c.status === 'finished' ? c.idx : c.status === 'future' ? 0 : null; }

  A.screens.guia = {
    render: function (route) {
      var sub = route.parts[0] || 'semaforo';
      if (sub === 'sos' && route.parts[1]) return sosDetail(route.parts[1]) + K.healthNote();
      if (sub === 'herbario' && route.parts[1]) return herbDetail(route.parts[1]) + K.healthNote();
      var body = ({ semaforo: semaforo, sos: sosList, herbario: herbList, taller: taller })[sub] || semaforo;
      return K.crumb() + '<header class="page-h"><h1>Guía</h1></header>' + K.tabs(TABS, sub, 'Secciones de la guía') + body() + K.healthNote();
    },
    parts: { flist: function () { return foodList(); } }
  };

  /* ---------- semáforo ---------- */
  function phaseNow() { var ed = A.ED(), prog = A.PROG(), d = curDay(); return ed && prog && d != null ? L.phaseId(prog, ed.startMode, d) : null; }
  function foodList() {
    // v2.4: un grupo por vez (Libre, Con moderación, Evitar); al buscar, se ven todos los que coinciden.
    var q = A.ui.fdq || '', st = U.norm(q).length ? '' : (A.ui.fdst || 'green');
    var ph = phaseNow();
    var list = L.foodSearch(A.dx().foods, q).filter(function (f) { return !st || f.status === st; });
    if (!list.length) return '<div class="card"><p><b>No está en el semáforo.</b></p><p class="muted">Si dudás, consultalo en el grupo del taller. Como regla, la guía prioriza verduras, frutas, cereales integrales, legumbres y semillas, sin azúcar, harinas refinadas, lácteos ni estimulantes.</p></div>';
    // v2.3: renglón compacto (nombre + estado con ícono y palabra); el detalle se despliega al tocar.
    return '<p class="meta" aria-live="polite">' + U.plural(list.length, 'alimento') + '</p><div class="food-list">' + list.map(function (f) {
      var phaseSt = ph && f.phases && f.phases[ph];
      var open = A.ui.foodOpen === f.id;
      return '<details class="food-row ' + f.status + '" id="f-' + esc(f.id) + '"' + (open ? ' open' : '') + '><summary>' +
        '<span class="grow"><b>' + esc(f.name) + '</b>' + (f._via ? '<small>por «' + esc(f._via) + '»</small>' : '') + '</span>' +
        (st ? '' : K.statusTag(f.status)) + I('abajo', 'sm chev') + '</summary>' +
        '<div class="food-body">' + (f.why ? '<p>' + esc(f.why) + '</p>' : '') + (f.howTo ? '<p class="meta">' + esc(f.howTo) + '</p>' : '') +
        (f.phases ? Object.keys(f.phases).map(function (k) { return '<p class="' + (k === ph ? 'note' : 'meta') + '">' + I('info', 'sm') + ' En ' + esc(L.phase(A.PROG(), k).name.toLowerCase()) + ': ' + esc(L.statusLabel(f.phases[k])) + (k === ph ? ' (tu fase actual)' : '') + '</p>'; }).join('') : '') +
        (!f.why && !f.howTo && !f.phases ? '<p class="meta">Sin más detalle en la guía.</p>' : '') + '</div></details>';
    }).join('') + '</div>';
  }
  function semaforo() {
    var st = A.ui.fdst || 'green';
    var opts = [['green', 'Libre'], ['yellow', 'Con moderación'], ['red', 'Evitar']];
    var ph = phaseNow(), prog = A.PROG();
    return (ph && prog ? '<p class="muted c">' + esc(L.phase(prog, ph).name) + ' · según la guía de tu programa</p>' : '') +
      '<div class="srch big">' + I('buscar') + '<input class="input" id="fdq" type="search" data-bind="fdq" value="' + esc(A.ui.fdq || '') + '" placeholder="¿Puedo comer…?" aria-label="Buscar un alimento" autocomplete="off"></div>' +
      '<div class="semtabs" role="group" aria-label="Grupo del semáforo">' + opts.map(function (o) { return '<button data-action="fdSt" data-v="' + o[0] + '" aria-pressed="' + (st === o[0]) + '">' + K.statusDot(o[0]) + o[1] + '</button>'; }).join('') + '</div>' +
      '<div data-part="flist">' + foodList() + '</div>';
  }
  A.binds.fdq = U.debounce(function (el) { A.ui.fdq = el.value; A.refresh('flist'); }, 120);
  A.actions.fdSt = function (el) { A.ui.fdst = el.dataset.v; A.ui.fdq = ''; A.render(); };

  /* ---------- SOS ---------- */
  function sosList() {
    var list = U.arr(A.dx().sos);
    return '<p class="muted">Qué hacer ante los síntomas más comunes del détox, según la guía.</p><ul class="list card">' + list.map(function (s) {
      var hit = K.condWarnings(s.warnings, conds()).length;
      return '<li><a class="li" href="#/guia/sos/' + encodeURIComponent(s.id) + '" id="sos-' + esc(s.id) + '">' + I('botiquin') + '<span class="grow"><b>' + esc(s.symptom) + '</b><span class="meta">' + esc(String(s.cause || '').slice(0, 110)) + (String(s.cause || '').length > 110 ? '…' : '') + '</span>' + (hit ? ' <span class="tag warn">' + I('alerta', 'sm') + 'aviso para vos</span>' : '') + '</span>' + I('chev', 'chev') + '</a></li>';
    }).join('') + '</ul>';
  }
  function sosDetail(id) {
    var s = L.idx().sos[id], p = A.P();
    if (!s) return K.back('#/guia/sos', 'SOS') + K.empty('No encontramos ese protocolo', '', '<a class="btn" href="#/guia/sos">Ver SOS</a>', 'h1');
    var lad = (p.ladder && p.ladder[id]) || {};
    var ladder = U.arr(s.steps).some(function (x) { return x.ladder; });
    var c = conds();
    var steps = U.arr(s.steps).map(function (x, i) {
      if (ladder && x.ladder) {
        var on = !!lad[i];
        return '<li class="' + (on ? 'is-done' : '') + '"><button class="ladder-row" data-action="ladder" data-s="' + esc(id) + '" data-i="' + i + '" aria-pressed="' + on + '" aria-label="Lo probé: paso ' + (i + 1) + '"><b>' + (i + 1) + '</b><span class="grow">' + esc(x.text) + (on ? '<span class="meta"> · lo probaste</span>' : '') + '</span><span class="mk" aria-hidden="true"></span></button></li>';
      }
      return '<li><b class="n">' + (i + 1) + '</b><div class="grow">' + esc(x.text) + '</div></li>';
    }).join('');
    var warns = U.arr(s.warnings).map(function (w) { var hit = c.indexOf(w.condition) > -1; return '<div class="contra' + (hit ? ' hit' : '') + '">' + (hit ? '<b>' + I('alerta', 'sm') + ' Para vos (' + esc(condLabel(w.condition).split(' (')[0]) + '):</b> ' : '<b>' + esc(condLabel(w.condition).split(' (')[0]) + ':</b> ') + esc(w.text) + '</div>'; }).join('');
    var herbs = U.arr(s.relatedHerbs).map(function (h) { var x = L.idx().herbs[h]; return x ? '<a class="chip" href="#/guia/herbario/' + encodeURIComponent(h) + '">' + I('hoja', 'sm') + esc(x.name) + '</a>' : ''; }).join('');
    var recs = U.arr(s.relatedRecipes).map(function (r) { var x = L.recipe(r, p); return x ? '<a class="chip" href="#/cocina/receta/' + encodeURIComponent(r) + '">' + I('olla', 'sm') + esc(x.title) + '</a>' : ''; }).join('');
    return K.back('#/guia/sos', 'SOS') + '<h1 class="page-h">' + esc(s.symptom) + '</h1>' +
      (s.cause ? '<p class="hero-desc">' + esc(s.cause) + '</p>' : '') +
      (s.whenToConsult ? '<div class="banner danger mt">' + I('alerta') + '<div class="grow"><b>Cuándo consultar</b>' + esc(s.whenToConsult) + '</div></div>' : '') +
      '<section class="card mt"><h2 class="mb">' + (ladder ? 'Ir sumando de a una' : 'Qué hacer') + '</h2>' + (s.intro ? '<p class="muted">' + esc(s.intro) + '</p>' : '') + '<ul class="list ladder">' + steps + '</ul>' +
      (ladder ? '<p class="meta">Tocá lo que ya probaste para saber dónde estás (queda con un punto verde). Se guarda en tu perfil.</p>' : '') + '</section>' +
      (warns ? '<section class="card mt"><h2 class="mb">Avisos</h2>' + warns + '</section>' : '') +
      (herbs || recs ? '<section class="card mt">' + (herbs ? '<h3>Hierbas relacionadas</h3><div class="chips mt-s">' + herbs + '</div>' : '') + (recs ? '<h3 class="mt">Recetas que ayudan</h3><div class="chips mt-s">' + recs + '</div>' : '') + '</section>' : '');
  }
  A.actions.ladder = function (el) {
    var id = el.dataset.s, i = el.dataset.i;
    A.update(function (s, p) { p.ladder = p.ladder || {}; var m = p.ladder[id] = p.ladder[id] || {}; if (m[i]) delete m[i]; else m[i] = Date.now(); p.ladder._u = Date.now(); });
  };

  /* ---------- herbario ---------- */
  function herbList() {
    var list = U.arr(A.dx().herbs), c = conds(), d = curDay(), kind = A.ui.hkind || '';
    var kinds = U.uniq(list.map(function (h) { return h.kind; }));
    var shown = list.filter(function (h) { return !kind || h.kind === kind; });
    return '<p class="muted">«Alimentos Medicina» de la guía: propiedades, cómo usarlos y contraindicaciones.' + (c.length ? ' Resaltamos las que coinciden con tus condiciones de salud.' : ' Cargá tus condiciones de salud en Ajustes para ver avisos personalizados.') + '</p>' +
      '<div class="chips mt-s"><button class="chip' + (!kind ? ' on' : '') + '" data-action="hKind" data-k="" aria-pressed="' + !kind + '">Todos</button>' + kinds.map(function (k) { return '<button class="chip' + (kind === k ? ' on' : '') + '" data-action="hKind" data-k="' + k + '" aria-pressed="' + (kind === k) + '">' + esc(KIND[k] || k) + '</button>'; }).join('') + '</div>' +
      '<div class="grid-cards mt">' + shown.map(function (h) {
        var hit = K.condWarnings(h.contraindications, c).length;
        var locked = h.unlockDay && (d == null || d < h.unlockDay);
        return '<a class="rcard' + (locked ? ' locked' : '') + '" id="h-' + esc(h.id) + '" href="#/guia/herbario/' + encodeURIComponent(h.id) + '"><span class="rc-cat">' + esc(KIND[h.kind] || h.kind) + (h.thermal ? ' · ' + esc(THERMAL[h.thermal] || h.thermal) : '') + '</span><b class="rc-t">' + esc(h.name) + '</b>' +
          '<span class="rc-tags">' + (hit ? '<span class="tag alert">' + I('alerta', 'sm') + 'Contraindicación para vos</span>' : '') + (h.unlockDay ? '<span class="tag ' + (locked ? '' : 'accent') + '">' + (locked ? I('candado', 'sm') : '') + 'Desde el día ' + h.unlockDay + '</span>' : '') + '</span></a>';
      }).join('') + '</div>';
  }
  A.actions.hKind = function (el) { A.ui.hkind = el.dataset.k; A.render(); };
  function herbDetail(id) {
    var h = L.idx().herbs[id];
    if (!h) return K.back('#/guia/herbario', 'Herbario') + K.empty('No encontramos esa ficha', '', '<a class="btn" href="#/guia/herbario">Ver herbario</a>', 'h1');
    var c = conds(), d = curDay();
    var locked = h.unlockDay && (d == null || d < h.unlockDay);
    var cons = U.arr(h.contraindications).map(function (w) { var hit = c.indexOf(w.condition) > -1; return '<div class="contra' + (hit ? ' hit' : '') + '"><b>' + (hit ? I('alerta', 'sm') + ' ' : '') + esc(condLabel(w.condition).split(' (')[0]) + (w.scope ? ', ' + esc(w.scope) : '') + (hit ? ' (tu perfil)' : '') + ':</b> ' + esc(w.text) + '</div>'; }).join('');
    var p = A.P();
    var constit = U.arr(h.constitutionWarn).map(function (w) { var hit = p.settings.constitution && (w.constitution === p.settings.constitution || w.id === p.settings.constitution); return '<div class="contra' + (hit ? ' hit' : '') + '">' + esc(w.text || w) + '</div>'; }).join('');
    return K.back('#/guia/herbario', 'Herbario') +
      '<section class="recipe-hero"><header class="recipe-h"><p class="rc-cat">' + esc(KIND[h.kind] || h.kind) + '</p><h1 class="serif">' + esc(h.name) + '</h1>' +
      '<div class="recipe-meta">' + (h.thermalText || h.thermal ? '<span>' + I('sol', 'sm') + esc(h.thermalText || THERMAL[h.thermal]) + '</span>' : '') + (h.taste ? '<span>' + I('hoja', 'sm') + 'Sabor ' + esc(String(h.taste).toLowerCase()) + '</span>' : '') + '</div>' +
      (locked ? '<div class="banner mt-s">' + I('candado') + '<div class="grow"><b>Desde el día ' + h.unlockDay + ' del programa.</b>La guía lo indica a partir de ese día. Mientras tanto podés leer la ficha.</div></div>' : '') +
      '</header></section>' +
      (cons ? '<section class="card mt"><h2 class="mb">Contraindicaciones</h2>' + cons + '</section>' : '') +
      (constit ? '<section class="card mt"><h2 class="mb">Según tu constitución</h2>' + constit + '</section>' : '') +
      '<div class="grid2 mt">' +
      (U.arr(h.properties).length ? '<section class="card"><h2 class="mb">Propiedades</h2><ul class="list">' + h.properties.map(function (x) { return '<li class="li"><span class="grow">' + esc(x) + '</span></li>'; }).join('') + '</ul></section>' : '') +
      '<section class="card"><h2 class="mb">Cómo usarlo</h2>' + (U.arr(h.howTo).length ? '<ul class="list">' + h.howTo.map(function (x) { return '<li class="li"><span class="grow">' + esc(x) + '</span></li>'; }).join('') + '</ul>' : '') + (h.dose ? '<p class="note mt-s"><b>Dosis:</b> ' + esc(h.dose) + '</p>' : '') +
      U.arr(h.cautions).map(function (x) { return '<p class="meta mt-s">' + I('info', 'sm') + ' ' + esc(x.text || x) + '</p>'; }).join('') + '</section></div>' +
      (h.source ? '<p class="meta mt">Fuente: ' + esc(h.source) + '</p>' : '');
  }

  /* ---------- el taller ---------- */
  function taller() {
    var t = A.dx().taller || {}, g = t.guide || {}, today = A.today();
    var wa = g.whatsapp ? 'https://wa.me/' + String(g.whatsapp).replace(/\D/g, '') : null;
    return '<section class="card"><div class="card-h"><h2>' + esc(g.name || 'La guía') + '</h2>' + (g.edition ? '<span class="meta">' + esc(g.edition) + '</span>' : '') + '</div>' +
      (g.readingNote ? '<p>' + esc(g.readingNote) + '</p>' : '') +
      '<div class="btn-row mt">' + (wa ? '<a class="btn" href="' + esc(wa) + '" target="_blank" rel="noopener">' + I('compartir', 'sm') + 'WhatsApp</a>' : '') + (g.email ? '<a class="btn" href="mailto:' + esc(g.email) + '">' + I('info', 'sm') + 'Email</a>' : '') +
      (g.groupUrl ? '<a class="btn" href="' + esc(g.groupUrl) + '" target="_blank" rel="noopener">' + I('personas', 'sm') + 'Grupo del taller</a>' : '') + (g.meetUrl ? '<a class="btn" href="' + esc(g.meetUrl) + '" target="_blank" rel="noopener">' + I('pantalla', 'sm') + 'Sala de Meet</a>' : '') + '</div></section>' +
      (U.arr(t.meetings).length ? '<section class="card mt"><h2 class="mb">Encuentros</h2><ul class="list">' + t.meetings.map(function (m) {
        var past = m.date < today;
        return '<li class="li' + (past ? ' muted' : '') + '">' + I('calendario') + '<span class="grow"><b>' + esc(U.fmtDate(m.date)) + ' · ' + esc(m.time || '') + '</b><span class="meta">' + esc(m.topic || '') + '</span></span><span class="tag ' + (past ? '' : 'bloom') + '">' + (past ? 'Realizado' : 'Próximo') + '</span></li>';
      }).join('') + '</ul>' + (t.meetingsNote ? '<p class="meta">' + esc(t.meetingsNote) + '</p>' : '') + '</section>' : '') +
      (U.arr(t.videos).length ? '<section class="card mt"><h2 class="mb">Videos</h2><ul class="list">' + t.videos.map(function (v) { return '<li><a class="li" href="' + esc(v.url) + '" target="_blank" rel="noopener">' + I('play') + '<span class="grow"><b>' + esc(v.title) + '</b><span class="meta">Se abre en YouTube</span></span>' + I('chev', 'chev') + '</a></li>'; }).join('') + '</ul></section>' : '') +
      (U.arr(t.producers).length ? '<section class="card mt"><h2 class="mb">Productores y comercios</h2><ul class="list">' + t.producers.map(function (p) {
        return '<li class="li">' + I('compras') + '<span class="grow"><b>' + esc(p.name) + '</b><span class="meta">' + esc(p.note || '') + '</span>' + (p.phone ? '<a href="tel:' + esc(String(p.phone).replace(/[^\d+]/g, '')) + '">' + esc(p.phone) + '</a>' : '') + (p.instagram || p.ig ? ' · <span class="meta">' + esc(p.instagram || p.ig) + '</span>' : '') + '</span></li>';
      }).join('') + '</ul></section>' : '');
  }
})(typeof window !== 'undefined' ? window : globalThis);
