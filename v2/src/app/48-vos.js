/* Detox v2 — «Vos» (v2.3): portada tranquila de tu avance y puerta a todo lo demás
   (progreso, diario, logros, historial, informe, reintroducción, guía, programas y ajustes). */
(function (root) {
  'use strict';
  if (typeof document === 'undefined') return;
  var A = root.DXApp, U = A.util, L = A.logic, K = A.kit, esc = U.esc, I = A.icon;

  A.screens.vos = {
    render: function () {
      var p = A.P();
      if (!p) return '';
      var ed = A.ED(), s = ed && U.isValidISO(ed.startDate) ? A.sum() : null;
      var h = [];
      h.push(A.backupChip ? A.backupChip() : '');
      h.push('<section class="vos-top">' + (s ? '<div class="vos-plant" title="' + esc(K.STAGE_NAMES[K.plantStage(s)]) + '">' + K.plant(K.plantStage(s), 44) + '</div>' : '') + '<h1 class="vos-sentence">' + sentence(s) + '</h1></section>');
      if (s) {
        // v2.4: una columna: el mapa de días, los números, la curva y abajo los accesos como renglones.
        var en = L.series(s, 'energy'), mo = L.series(s, 'mood');
        var hasCk = en.some(function (x) { return x.v; }) || mo.some(function (x) { return x.v; });
        var won = s.badges.filter(function (b) { return b.unlocked; }).length;
        var wd = s.days.filter(function (r) { return r.idx >= 1 && r.water > 0; });
        var wAvg = wd.length ? wd.reduce(function (a, r) { return a + r.water; }, 0) / wd.length / 1000 : 0;
        var st = [];
        if (s.constancy != null) st.push([Math.round(s.constancy * 100) + ' %', 'constancia']);
        st.push([String(s.streak || 0), s.streak === 1 ? 'día seguido' : 'días seguidos']);
        if (wAvg) st.push([(Math.round(wAvg * 10) / 10).toString().replace('.', ',') + ' l', 'agua por día']);
        st.push([won + ' de ' + s.badges.length, 'logros']);
        h.push('<section class="vos-block" aria-labelledby="vos-dias"><p class="lab sr-only" id="vos-dias">Tus ' + s.clock.days + ' días</p>' + K.heatmap(s, true) + '</section>' +
          '<div class="stats3 big">' + st.map(function (x) { return '<p><b>' + esc(x[0]) + '</b><small>' + esc(x[1]) + '</small></p>'; }).join('') + '</div>' +
          '<section class="vos-block" aria-labelledby="vos-en"><div class="lab-row"><p class="lab" id="vos-en">Energía y ánimo</p>' + (hasCk ? '<span class="legend"><span><i style="background:var(--accent)"></i>Energía</span><span><i style="background:var(--faint)"></i>Ánimo</span></span>' : '') + '</div>' +
          (hasCk ? K.lineChart([{ pts: en, cls: 'l1' }, { pts: mo, cls: 'l2' }], { label: 'Energía y ánimo por día', n: s.clock.days, w: 620, h: 140 })
            : '<p class="muted">Aparece cuando registres cómo te sentís, desde Hoy.</p>') + '</section>' +
          '<p class="vos-points c">' + U.plural(s.points, 'punto') + '</p>');
      }
      h.push(groups(s));
      return h.join('');
    }
  };

  function sentence(s) {
    if (!s) return 'Todavía no empezaste un programa. <a href="#/hoy">Elegí cuándo empezar</a>.';
    var c = s.clock, out = [];
    if (c.status === 'future') out.push('Empezás en <b>' + U.plural(c.daysUntil, 'día') + '</b>.');
    else if (c.status === 'finished') out.push('Terminaste <b>' + esc((s.program && s.program.name) || 'tu programa') + '</b>.');
    else out.push('Vas por el <b>día ' + c.idx + '</b>.');
    var tail = [];
    if (c.status !== 'future' && s.constancy != null) {
      if (s.constancy >= 1) tail.push(c.status === 'finished' ? 'Cumpliste <b>todos</b> los días' : 'Cumpliste <b>todos</b> los días hasta hoy');
      else tail.push('Tu constancia es del <b>' + Math.round(s.constancy * 100) + '&nbsp;%</b>');
    }
    var t = trend(s);
    if (t) tail.push((tail.length ? 'tu' : 'Tu') + ' energía ' + t);
    if (tail.length) out.push(tail.join(' y ') + '.');
    return out.join(' ');
  }
  function trend(s) {
    var v = L.series(s, 'energy').map(function (x) { return x.v; }).filter(function (x) { return x != null && x !== 0; });
    if (v.length < 4) return '';
    var h = Math.floor(v.length / 2), a = L.avg(v.slice(0, h)), b = L.avg(v.slice(v.length - h));
    if (a == null || b == null) return '';
    return b - a >= 0.4 ? 'viene subiendo' : a - b >= 0.4 ? 'viene bajando' : 'se mantiene pareja';
  }

  /* Accesos tranquilos a todo lo demás. */
  function groups(s) {
    var G = [
      ['Tu avance', [
        ['#/progreso', 'progreso', 'Progreso y logros', 'Constancia, gráficos, síntomas y logros'],
        ['#/progreso/diario', 'libro', 'Diario', 'Lo que anotaste cada día'],
        ['#/progreso/historial', 'calendario', 'Historial de ediciones', 'Y comparar una con otra'],
        ['#/progreso/informe', 'imprimir', 'Informe', 'Para imprimir o compartir'],
        ['#/progreso/reintro', 'hoja', 'Reintroducción', 'Volver a sumar alimentos de a uno']
      ]],
      ['Guía', [
        ['#/guia/semaforo', 'semaforo', '¿Puedo comer…?', 'Semáforo de alimentos'],
        ['#/guia/sos', 'botiquin', 'SOS', 'Qué hacer ante cada síntoma'],
        ['#/guia/herbario', 'flor', 'Herbario', 'Alimentos medicina'],
        ['#/guia/taller', 'personas', 'El taller', 'Encuentros, videos y contacto']
      ]],
      ['Tu cuenta', [
        ['#/programas', 'planta', 'Programas', 'Repetir, cambiar o crear uno'],
        ['#/ajustes', 'ajustes', 'Ajustes', 'Perfiles, salud, copia y sincronización']
      ]]
    ];
    return '<div class="vos-groups">' + G.map(function (g) {
      return '<section class="vos-group" aria-label="' + esc(g[0]) + '"><p class="lab">' + esc(g[0]) + '</p><ul class="list">' + g[1].map(function (x) {
        return '<li><a class="qlink" href="' + x[0] + '"' + (x[4] ? ' data-action="' + x[4] + '"' : '') + '><span class="grow"><b>' + esc(x[2]) + '</b><small>' + esc(x[3]) + '</small></span>' + I('chev', 'sm chev') + '</a></li>';
      }).join('') + '</ul></section>';
    }).join('') + '</div>';
  }
})(typeof window !== 'undefined' ? window : globalThis);
