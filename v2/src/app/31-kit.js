/* Detox v2 — piezas visuales: planta que crece, anillo, gráficos SVG, mapa de la edición, tarjetas. */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic, esc = U.esc, K = A.kit = {};

  /* ---------- la planta del programa (firma visual) ---------- */
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
    var h = [10, 34, 62, 86, 96][stage];
    var top = 124 - h;
    var parts = [];
    parts.push('<path class="pl-ground" d="M14 126 Q60 118 106 126"/>');
    parts.push('<path class="pl-soil" d="M34 126 Q60 112 86 126Z"/>');
    if (stage === 0) {
      parts.push('<ellipse class="pl-seed" cx="60" cy="117" rx="7.5" ry="5" transform="rotate(-18 60 117)"/>');
      parts.push('<path class="pl-stem" d="M61 113 q2 -6 -1 -10"/>');
    } else {
      parts.push('<path class="pl-stem" d="M60 120 C 57 ' + (120 - h * .35) + ', 63 ' + (120 - h * .7) + ', 60 ' + top + '"/>');
      var leaves = [0, 2, 4, 6, 6][stage];
      if (stage === 1) {
        parts.push('<path class="pl-leaf" d="M60 ' + (top + 4) + ' c -4 -8 -15 -10 -19 -5 c 5 6 13 8 19 5z"/>');
        parts.push('<path class="pl-leaf" d="M60 ' + (top + 2) + ' c 4 -8 15 -10 19 -5 c -5 6 -13 8 -19 5z"/>');
      }
      for (var i = 0; i < leaves; i++) {
        var y = 116 - (i + 1) * (h - 14) / (leaves + 1);
        var s = 1 - i * 0.07;
        var left = i % 2 === 0;
        parts.push('<path class="pl-leaf" transform="translate(60 ' + y.toFixed(1) + ') scale(' + (left ? -s : s) + ' ' + s + ')" d="M0 0 c 5 -11 20 -15 29 -9 c -6 10 -20 14 -29 9z"/>');
        parts.push('<path class="pl-vein" transform="translate(60 ' + y.toFixed(1) + ') scale(' + (left ? -s : s) + ' ' + s + ')" d="M2 -1 Q14 -6 24 -8"/>');
      }
      if (stage === 3) parts.push('<path class="pl-bud" d="M60 ' + (top - 12) + ' c -7 4 -7 12 0 14 c 7 -2 7 -10 0 -14z"/><path class="pl-sepal" d="M53 ' + (top + 1) + ' q7 -5 14 0"/>');
      if (stage === 4) {
        var cy = top - 10;
        for (var k = 0; k < 6; k++) parts.push('<ellipse class="pl-petal" cx="60" cy="' + (cy - 9) + '" rx="5.6" ry="9.5" transform="rotate(' + (k * 60) + ' 60 ' + cy + ')"/>');
        parts.push('<circle class="pl-heart" cx="60" cy="' + cy + '" r="5"/>');
      }
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
  K.heatmap = function (sum, link) {
    var cells = sum.days.filter(function (r) { return r.idx >= 1; }).map(function (r) {
      var st = ST[r.status] || ST.future;
      var lab = 'Día ' + r.idx + ': ' + st[0] + (r.total ? ' (' + r.done + '/' + r.total + ')' : '') + (r.graced && r.status === 'partial' ? ', cubierto por un día de gracia' : '');
      var inner = st[1] ? A.icon(st[1], 'sm') : (r.graced ? A.icon('hoja', 'sm') : '<span>' + r.idx + '</span>');
      var tag = link && r.iso && !r.future ? 'a href="#/hoy/' + r.iso + '"' : 'span';
      return '<' + tag + ' class="hm hm-' + r.status + '" title="' + esc(lab) + '" aria-label="' + esc(lab) + '">' + inner + '</' + tag.split(' ')[0] + '>';
    });
    return '<div class="heatmap" role="list">' + cells.map(function (c) { return '<div role="listitem">' + c + '</div>'; }).join('') + '</div>' +
      '<div class="legend"><span><i class="hm-k hm-complete"></i>Completo</span><span><i class="hm-k hm-partial"></i>Parcial</span><span><i class="hm-k hm-grace"></i>Gracia</span><span><i class="hm-k hm-empty"></i>Sin completar</span><span><i class="hm-k hm-future"></i>Por venir</span></div>';
  };

  /* ---------- ilustración para estados vacíos ---------- */
  K.emptyArt = function () {
    return '<svg class="art" viewBox="0 0 84 84" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M42 74V34"/><path d="M42 50c-12 0-19-7-19-19 12 0 19 7 19 19zM42 40c0-12 7-19 19-19 0 12-7 19-19 19z"/><path d="M16 74h52"/></svg>';
  };
  K.empty = function (title, text, action) {
    return '<div class="empty">' + K.emptyArt() + '<h3>' + esc(title) + '</h3>' + (text ? '<p>' + esc(text) + '</p>' : '') + (action || '') + '</div>';
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
    return '<a class="rcard" id="r-' + esc(r.id) + '" href="#/cocina/receta/' + encodeURIComponent(r.id) + '">' +
      '<span class="rc-cat">' + esc(L.categoryLabel(r.category)) + (String(r.id).indexOf('my-') === 0 ? ' · propia' : '') + '</span>' +
      '<b class="rc-t">' + esc(r.title) + '</b>' +
      '<span class="rc-meta">' + (t ? A.icon('reloj', 'sm') + esc(t) : '') + (fav ? '<span class="fav" aria-label="Favorita">' + A.icon('estrella', 'sm') + '</span>' : '') + (cooked ? '<span>Cocinada ' + U.plural(cooked, 'vez', 'veces') + '</span>' : '') + '</span>' +
      (extra || '') + '<span class="rc-tags">' + K.allergenTags(r, p) + '</span></a>';
  };

  K.statusIcon = function (st) { return st === 'green' ? 'check' : st === 'yellow' ? 'alerta' : 'cerrar'; };
  K.statusTag = function (st) {
    var cls = st === 'green' ? 'accent' : st === 'yellow' ? 'pollen' : 'clay';
    return '<span class="tag ' + cls + '">' + A.icon(K.statusIcon(st), 'sm') + esc(L.statusLabel(st)) + '</span>';
  };
  K.healthNote = function () {
    return '<p class="health">' + A.icon('info', 'sm') + ' Material educativo del taller; no reemplaza la consulta médica. Si estás embarazada, en lactancia, tomás medicación o tenés una enfermedad crónica, consultá antes de empezar.</p>';
  };
  K.back = function (href, label) { return '<a class="back" href="' + href + '">' + A.icon('atras', 'sm') + esc(label || 'Volver') + '</a>'; };
  K.tabs = function (items, current, label) {
    return '<nav class="seg subnav" aria-label="' + esc(label || 'Secciones') + '">' + items.map(function (it) {
      return '<a href="' + it[0] + '"' + (it[1] === current ? ' aria-current="page"' : '') + '>' + esc(it[2]) + '</a>';
    }).join('') + '</nav>';
  };
  K.condWarnings = function (warnings, conditions) {
    return U.arr(warnings).filter(function (w) { return (conditions || []).indexOf(w.condition) > -1; });
  };
})(typeof window !== 'undefined' ? window : globalThis);
