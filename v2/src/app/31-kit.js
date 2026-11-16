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
    // Mancha orgánica salvia piedra + lazo botánico eucalipto (collage portada Isabel Caparra)
    parts.push('<path class="pl-blob" d="M36 22 C49 16, 67 25, 76 34 C86 43, 82 55, 68 58 C78 66, 75 84, 62 91 C48 98, 34 86, 36 70 C24 67, 22 52, 32 46 C27 36, 28 26, 36 22Z"/>');
    parts.push('<path class="pl-loop" d="M52 80 C68 62, 95 66, 98 88 C100 109, 77 124, 58 119 C43 116, 38 96, 52 80Z"/>');
    // Base de semillas canela (siempre visible, crece con el avance)
    parts.push('<path class="pl-cinnamon" d="M24 112 C21 107, 27 102, 30 106 C32 110, 27 115, 24 112Z"/>');
    parts.push('<path class="pl-cinnamon" d="M35 120 C32 115, 38 110, 41 114 C43 118, 38 123, 35 120Z"/>');
    parts.push('<ellipse class="pl-euca" cx="22" cy="100" rx="4" ry="1.5" transform="rotate(-14 22 100)"/>');
    if (stage === 0) {
      parts.push('<path class="pl-cinnamon" d="M56 105 C52 98, 63 93, 68 100 C71 106, 61 111, 56 105Z"/>');
      parts.push('<path class="pl-euca" d="M63 97 C64 91, 69 87, 73 88 C71 94, 67 98, 63 97Z"/>');
    }
    if (stage >= 1) {
      // Cintas curvas mandarina/ocre
      parts.push('<path class="pl-amber" d="M38 58 C45 55, 51 67, 57 83 C63 98, 72 108, 79 112 C74 116, 62 110, 53 96 C44 82, 36 65, 38 58Z"/>');
      parts.push('<path class="pl-amber" d="M49 54 C56 52, 62 64, 68 79 C74 93, 83 102, 90 105 C85 109, 73 103, 64 90 C55 76, 47 61, 49 54Z"/>');
    }
    if (stage >= 2) {
      // Hojas lanceoladas color canela
      parts.push('<path class="pl-cinnamon" d="M62 60 C60 46, 62 35, 67 27 C69 39, 69 50, 62 60Z"/>');
      parts.push('<path class="pl-cinnamon" d="M68 62 C70 46, 76 34, 86 24 C84 38, 77 52, 68 62Z"/>');
      parts.push('<path class="pl-cinnamon" d="M72 67 C77 54, 85 45, 95 39 C90 52, 82 61, 72 67Z"/>');
    }
    if (stage >= 3) {
      // Primer fruto terracota + hojas verde eucalipto
      parts.push('<path class="pl-euca" d="M84 58 C78 51, 78 41, 84 36 C90 42, 90 52, 84 58Z"/>');
      parts.push('<path class="pl-euca" d="M87 58 C93 52, 102 52, 106 58 C99 63, 91 63, 87 58Z"/>');
      parts.push('<path class="pl-berry" d="M76 62 C82 56, 94 58, 96 68 C97 79, 88 89, 78 86 C71 84, 70 69, 76 62Z"/>');
      parts.push('<circle class="pl-speck" cx="81" cy="70" r="2.1"/>');
      parts.push('<circle class="pl-speck" cx="87" cy="78" r="1.9"/>');
    }
    if (stage >= 4) {
      // Racimo completo de frutos terracota y follaje eucalipto
      parts.push('<path class="pl-euca" d="M98 46 C96 39, 101 32, 108 32 C107 40, 104 45, 98 46Z"/>');
      parts.push('<path class="pl-berry" d="M92 48 C100 44, 111 49, 111 59 C110 68, 100 72, 92 67 C86 63, 87 51, 92 48Z"/>');
      parts.push('<circle class="pl-speck" cx="98" cy="56" r="2"/>');
      parts.push('<path class="pl-euca" d="M100 72 C95 66, 97 59, 104 59 C106 65, 105 70, 100 72Z"/>');
      parts.push('<path class="pl-berry" d="M93 73 C101 70, 111 76, 110 86 C109 96, 98 100, 91 93 C86 87, 87 76, 93 73Z"/>');
      parts.push('<circle class="pl-speck" cx="98" cy="83" r="2"/>');
      parts.push('<circle class="pl-speck" cx="104" cy="89" r="1.8"/>');
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
    return '<nav class="seg subnav" aria-label="' + esc(label || 'Secciones') + '">' + items.map(function (it) {
      return '<a href="' + it[0] + '"' + (it[1] === current ? ' aria-current="page"' : '') + '>' + esc(it[2]) + '</a>';
    }).join('') + '</nav>';
  };
  K.condWarnings = function (warnings, conditions) {
    return U.arr(warnings).filter(function (w) { return (conditions || []).indexOf(w.condition) > -1; });
  };
})(typeof window !== 'undefined' ? window : globalThis);
