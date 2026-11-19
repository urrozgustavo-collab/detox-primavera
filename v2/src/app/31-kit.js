/* Detox v2 — piezas visuales: planta botánica editorial, anillo, gráficos SVG, mapa de la edición, tarjetas. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic, esc = U.esc, K = A.kit = {};

  /* ---------- la planta del programa (medallón botánico editorial) ---------- */
  K.plantStage = function (sum) {
    if (!sum) return 0;
    var days = sum.clock.days;
    var g = days ? (sum.completeDays + sum.graceUsed * 0.5) / days : 0;
    if (sum.clock.status === 'finished') g = Math.max(g, (sum.constancy || 0));
    if (g >= 0.85) return 4;
    if (g >= 0.55) return 3;
    if (g >= 0.25) return 2;
    if (g > 0 || (sum.clock.status === 'active' && sum.days.some(function (r) { return r.done > 0; }))) return 1;
    return 0;
  };
  K.STAGE_NAMES = ['Semilla', 'Brote', 'Hojas', 'Capullo', 'Flor'];
  K.plant = function (stage, size, label) {
    size = size || 140;
    var parts = [];
    // «Primavera sutil»: una sola ramita de trazo fino que crece por etapas; el coral aparece solo al florecer.
    parts.push('<path class="pl-ground" d="M34 128 H86"/>');
    if (stage === 0) {
      parts.push('<path class="pl-seed" d="M54 124 C54 117, 66 117, 66 124 Z"/>');
      parts.push('<path class="pl-line" d="M60 118 C60 113, 62 110, 65 108"/>');
    }
    if (stage >= 1) {
      var top = [100, 100, 74, 52, 38][stage];
      parts.push('<path class="pl-line" d="M60 128 C60 ' + (top + 30) + ', 59 ' + (top + 12) + ', 60 ' + top + '"/>');
      parts.push('<path class="pl-leaf" d="M60 110 C50 110, 42 104, 40 96 C49 95, 57 100, 60 110 Z"/>');
    }
    if (stage >= 2) {
      parts.push('<path class="pl-leaf" d="M60 96 C70 95, 78 88, 80 80 C71 80, 63 86, 60 96 Z"/>');
      parts.push('<path class="pl-leaf" d="M60 84 C52 83, 46 77, 45 70 C52 70, 58 75, 60 84 Z"/>');
    }
    if (stage >= 3) {
      parts.push('<path class="pl-leaf" d="M60 68 C67 66, 73 60, 74 53 C67 54, 62 59, 60 68 Z"/>');
      if (stage === 3) parts.push('<path class="pl-bud" d="M60 52 C55 46, 57 40, 60 37 C63 40, 65 46, 60 52 Z"/>');
    }
    if (stage >= 4) {
      parts.push('<path class="pl-leaf" d="M60 58 C53 57, 48 52, 47 46 C53 46, 58 50, 60 58 Z"/>');
      [0, 72, 144, 216, 288].forEach(function (a) {
        parts.push('<ellipse class="pl-petal" cx="60" cy="27" rx="4.6" ry="8.5" transform="rotate(' + a + ' 60 36)"/>');
      });
      parts.push('<circle class="pl-heart" cx="60" cy="36" r="3.4"/>');
    }
    return '<svg class="plant stage-' + stage + '" viewBox="0 0 120 140" width="' + size + '" height="' + Math.round(size * 140 / 120) + '" role="img" aria-label="' + esc(label || ('Tu planta: ' + K.STAGE_NAMES[stage])) + '">' + parts.join('') + '</svg>';
  };
  A.plantMark = function (size) { return '<span class="plant-mark" aria-hidden="true">' + K.plant(3, size || 32) + '</span>'; };

  /* ---------- anillo ---------- */
  K.ring = function (ratio, size, inner, label) {
    size = size || 120; var sw = Math.max(8, size / 11), r = (size - sw) / 2, c = 2 * Math.PI * r;
    var off = c * (1 - Math.max(0, Math.min(1, ratio || 0)));
    return '<div class="ring" style="width:' + size + 'px;height:' + size + 'px" role="img" aria-label="' + esc(label || Math.round((ratio || 0) * 100) + ' %') + '">' +
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '"><circle class="track" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="' + sw + '"/>' +
      '<circle class="bar" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="' + sw + '" stroke-linecap="round" stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + off.toFixed(2) + '"/></svg>' +
      '<div class="lbl" aria-hidden="true">' + (inner || '') + '</div></div>';
  };

  /* ---------- gráfico de líneas: series [{ pts:[{idx,v}], cls, label }] ---------- */
  K.lineChart = function (series, o) {
    o = o || {};
    var W = 340, H = o.h || 150, pl = 26, pr = 8, pt = 10, pb = 22;
    var n = o.n || Math.max.apply(null, series.map(function (s) { return s.pts.length; }).concat([1]));
    var y0 = o.min != null ? o.min : 1, y1 = o.max != null ? o.max : 5;
    var x = function (i) { return pl + (n <= 1 ? 0 : (i - 1) * (W - pl - pr) / (n - 1)); };
    var y = function (v) { return pt + (1 - (v - y0) / (y1 - y0)) * (H - pt - pb); };
    var g = [];
    for (var v = y0; v <= y1; v += (o.step || 1)) g.push('<line class="axis" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '" stroke-width="1"/><text x="' + (pl - 6) + '" y="' + (y(v) + 4).toFixed(1) + '" text-anchor="end">' + (o.yLabel ? o.yLabel(v) : v) + '</text>');
    var every = n > 14 ? 5 : n > 7 ? 2 : 1;
    for (var i = 1; i <= n; i++) if (i === 1 || i % every === 0 || (i === n && n % every > 1)) g.push('<text x="' + x(i).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + i + '</text>');
    series.forEach(function (s, si) {
      var segs = [], cur = [];
      s.pts.forEach(function (p) { if (p.v == null) { if (cur.length) segs.push(cur); cur = []; } else cur.push(x(p.idx).toFixed(1) + ',' + y(p.v).toFixed(1)); });
      if (cur.length) segs.push(cur);
      segs.forEach(function (sg) { g.push(sg.length > 1 ? '<polyline class="' + (s.cls || 'l1') + '" points="' + sg.join(' ') + '" stroke-linejoin="round" stroke-linecap="round"/>' : ''); });
      s.pts.forEach(function (p) { if (p.v != null) g.push('<circle class="' + (si ? 'dot2' : 'dot1') + '" cx="' + x(p.idx).toFixed(1) + '" cy="' + y(p.v).toFixed(1) + '" r="3"/>'); });
      if (s.avg != null) g.push('<line class="avg" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(s.avg).toFixed(1) + '" y2="' + y(s.avg).toFixed(1) + '" stroke-width="1.5"/>');
    });
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.label || 'Gráfico') + '">' + g.join('') + '</svg>';
  };
  /* barras verticales por día: pts [{idx,v}] */
  K.barChart = function (pts, o) {
    o = o || {};
    var W = 340, H = o.h || 140, pl = 34, pr = 8, pt = 10, pb = 22;
    var n = Math.max(1, pts.length);
    var max = Math.max(o.goal || 0, Math.max.apply(null, pts.map(function (p) { return p.v || 0; }).concat([1])));
    var bw = (W - pl - pr) / n;
    var y = function (v) { return pt + (1 - v / max) * (H - pt - pb); };
    var g = ['<line class="axis" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(0) + '" y2="' + y(0) + '"/>', '<text x="' + (pl - 6) + '" y="' + (y(max) + 4) + '" text-anchor="end">' + (o.fmt ? o.fmt(max) : max) + '</text>'];
    pts.forEach(function (p, i) {
      if (p.v) g.push('<rect class="' + (o.goal && p.v >= o.goal ? 'bar' : 'bar2') + '" x="' + (pl + i * bw + bw * .18).toFixed(1) + '" y="' + y(p.v).toFixed(1) + '" width="' + (bw * .64).toFixed(1) + '" height="' + (y(0) - y(p.v)).toFixed(1) + '" rx="2"/>');
      var every = n > 14 ? 5 : n > 7 ? 2 : 1;
      if (i === 0 || (i + 1) % every === 0 || (i === n - 1 && n % every > 1)) g.push('<text x="' + (pl + i * bw + bw / 2).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + (p.label || p.idx) + '</text>');
    });
    if (o.goal) g.push('<line class="bar-goal" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(o.goal).toFixed(1) + '" y2="' + y(o.goal).toFixed(1) + '" stroke-width="1.5"/>');
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.label || 'Gráfico de barras') + '">' + g.join('') + '</svg>';
  };
  /* barras horizontales simples [{label, n}] */
  K.hbars = function (rows, total) {
    var max = Math.max.apply(null, rows.map(function (r) { return r.n; }).concat([1]));
    return '<ul class="list hbars">' + rows.map(function (r) {
      return '<li class="li"><span class="grow">' + esc(r.label) + '</span><span class="bar-h" style="width:40%"><i style="width:' + Math.round(r.n / max * 100) + '%"></i></span><span class="num" style="min-width:2.5ch;text-align:right">' + r.n + '</span></li>';
    }).join('') + '</ul>';
  };

  /* ---------- mapa de la edición (heatmap con ícono + color) ---------- */
  var ST = {
    complete: ['Completo', 'check'], partial: ['Parcial', ''], grace: ['Día de gracia', 'hoja'], empty: ['Sin completar', ''], today: ['Hoy', ''], future: ['Por venir', '']
  };
  /* v2.3: un solo dibujo del mapa (Vos y Progreso). Cada estado se distingue por forma además del color:
     completo = círculo lleno con tilde · parcial = medio lleno · gracia = aro punteado con hoja ·
     sin completar = aro con raya · hoy = aro coral · por venir = punto chico. */
  var HD_MARK = { complete: 'check', grace: 'hoja', empty: 'menos' };
  K.heatmap = function (sum, link) {
    var cells = sum.days.filter(function (r) { return r.idx >= 1; }).map(function (r) {
      var st = (ST[r.status] || ST.future)[0];
      var lab = 'Día ' + r.idx + ': ' + st.toLowerCase() + (r.total ? ' (' + r.done + ' de ' + r.total + ')' : '') + (r.graced && r.status === 'partial' ? ', cubierto por un día de gracia' : '');
      var kind = r.graced && r.status === 'partial' ? 'grace' : r.status;
      var inner = HD_MARK[kind] ? A.icon(HD_MARK[kind], 'sm') : '';
      var cls = 'hd hd-' + kind + (r.iso === A.today() && kind !== 'today' ? ' is-today' : '');
      return link && r.iso && !r.future ? '<a class="' + cls + '" href="#/hoy/' + r.iso + '" aria-label="' + esc(lab) + '" title="' + esc(lab) + '">' + inner + '</a>'
        : '<span class="' + cls + '" role="img" aria-label="' + esc(lab) + '" title="' + esc(lab) + '">' + inner + '</span>';
    }).join('');
    var key = function (k, t) { return '<span><i class="hd hd-' + k + ' key" aria-hidden="true">' + (HD_MARK[k] ? A.icon(HD_MARK[k], 'sm') : '') + '</i>' + t + '</span>'; };
    return '<div class="heat-dots">' + cells + '</div>' +
      '<div class="legend dots-legend">' + key('complete', 'Completo') + key('partial', 'Parcial') + key('grace', 'Gracia') + key('empty', 'Sin completar') + key('today', 'Hoy') + key('future', 'Por venir') + '</div>';
  };

  /* ---------- ilustración para estados vacíos ---------- */
  K.emptyArt = function () {
    return '<svg class="art" viewBox="0 0 84 84" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M42 74V34"/><path d="M42 50c-12 0-19-7-19-19 12 0 19 7 19 19zM42 40c0-12 7-19 19-19 0 12-7 19-19 19z"/><path d="M16 74h52"/></svg>';
  };
  K.empty = function (title, text, action, tag) {
    tag = tag === 'h1' ? 'h1' : 'h3';
    return '<div class="empty">' + K.emptyArt() + '<' + tag + ' class="empty-h">' + esc(title) + '</' + tag + '>' + (text ? '<p>' + esc(text) + '</p>' : '') + (action || '') + '</div>';
  };

  /* ---------- recetas ---------- */
  K.allergenTags = function (recipe, profile) {
    var hits = L.recipeAllergyHits(recipe, profile);
    var out = hits.ids.map(function (a) { return '<span class="tag alert">' + A.icon('alerta', 'sm') + 'Contiene ' + esc(L.allergenLabel(a).toLowerCase()) + '</span>'; });
    hits.custom.forEach(function (c) { out.push('<span class="tag alert">' + A.icon('alerta', 'sm') + 'Contiene ' + esc(c) + '</span>'); });
    var conds = (profile && profile.settings && profile.settings.conditions) || [];
    var ch = L.recipeCondHits(recipe, conds);
    var cs = U.uniq(ch.map(function (x) { return x.condition; }));
    cs.forEach(function (c) { var lab = (L.idx().conditions[c] || {}).label || c; out.push('<span class="tag warn" title="' + esc(ch.filter(function (x) { return x.condition === c; }).map(function (x) { return x.text; }).join(' ')) + '">' + A.icon('alerta', 'sm') + 'Precaución: ' + esc(lab.split(' (')[0].split(',')[0].toLowerCase()) + '</span>'); });
    return out.join('');
  };
  K.recipeCard = function (r, p, extra) {
    var fav = p && p.recipeLog.favorites.indexOf(r.id) > -1;
    var cooked = p && p.recipeLog.cooked[r.id] ? p.recipeLog.cooked[r.id].length : 0;
    var t = r.time && r.time.total ? U.fmtMin(r.time.total) : '';
    var tags = K.allergenTags(r, p);
    return '<a class="rcard" id="r-' + esc(r.id) + '" href="#/cocina/receta/' + encodeURIComponent(r.id) + '">' +
      '<div class="rc-top"><span class="rc-cat">' + esc(L.categoryLabel(r.category)) + (String(r.id).indexOf('my-') === 0 ? ' · propia' : '') + '</span>' +
      (fav ? '<span class="fav" aria-label="Favorita">' + A.icon('estrella', 'sm') + '</span>' : '') + '</div>' +
      '<b class="rc-t">' + esc(r.title) + '</b>' +
      (extra || '') +
      (tags ? '<span class="rc-tags">' + tags + '</span>' : '') +
      '<div class="rc-foot">' +
      (t ? '<span class="rc-m">' + A.icon('reloj', 'sm') + esc(t) + '</span>' : '') +
      (r.method ? '<span class="rc-m">' + esc(r.method) + '</span>' : '') +
      (cooked ? '<span class="rc-m">Cocinada ' + U.plural(cooked, 'vez', 'veces') + '</span>' : '') +
      '</div></a>';
  };

  K.statusIcon = function (st) { return st === 'green' ? 'check' : st === 'yellow' ? 'alerta' : 'cerrar'; };
  K.statusTag = function (st) {
    var cls = st === 'green' ? 'accent' : st === 'yellow' ? 'pollen' : 'clay';
    return '<span class="tag ' + cls + '">' + A.icon(K.statusIcon(st), 'sm') + esc(L.statusLabel(st)) + '</span>';
  };
  K.healthNote = function () {
    return '<p class="health">' + A.icon('info', 'sm') + '<span>Material educativo del taller; no reemplaza la consulta médica. Si estás embarazada, en lactancia, tomás medicación o tenés una enfermedad crónica, consultá antes de empezar.</span></p>';
  };
  K.back = function (href, label) { return '<a class="back" href="' + href + '">' + A.icon('atras', 'sm') + esc(label || 'Volver') + '</a>'; };
  K.tabs = function (items, current, label) {
    return '<nav class="tabs-t" aria-label="' + esc(label || 'Secciones') + '">' + items.map(function (it) {
      return '<a href="' + it[0] + '"' + (it[1] === current ? ' aria-current="page"' : '') + '>' + esc(it[2]) + (it[3] || '') + '</a>';
    }).join('') + '</nav>';
  };
  /* Migas tranquilas: las pantallas que viven dentro de «Vos» llevan un regreso a su portada. */
  K.crumb = function (href, label) { return '<a class="back crumb" href="' + (href || '#/vos') + '">' + A.icon('chev-izq', 'sm') + esc(label || 'Vos') + '</a>'; };
  K.condWarnings = function (warnings, conditions) {
    return U.arr(warnings).filter(function (w) { return (conditions || []).indexOf(w.condition) > -1; });
  };
})(typeof window !== 'undefined' ? window : globalThis);
