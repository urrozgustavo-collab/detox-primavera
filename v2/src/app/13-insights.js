/* Detox v2 — correlaciones honestas, series para gráficos, informe de texto y recordatorios .ics. */
(function (root) {
  'use strict';
  var A = root.DXApp, U = A.util, L = A.logic;

  /* ---------- correlaciones (§4.8) ---------- */
  L.correlations = function (sum, opts) {
    opts = opts || {};
    var minDays = opts.minDays || 6, minGroup = opts.minGroup || 3, max = opts.max || 3;
    var rows = sum.days.filter(function (r) { return r.idx >= 1 && (r.past || r.today) && r.day && r.day.checkin && (r.day.checkin.energy || r.day.checkin.mood); });
    if (rows.length < minDays) return { enough: false, n: rows.length, findings: [] };
    var factors = [];
    var habitMap = Object.create(null);
    rows.forEach(function (r) { r.habits.forEach(function (h) { habitMap[h.id] = h; }); });
    Object.keys(habitMap).forEach(function (id) {
      factors.push({ id: 'h:' + id, label: habitMap[id].text, test: function (r) { return r.day.habits && r.day.habits[id] === 'done'; } });
    });
    factors.push({ id: 'water', label: 'Cumplir la meta de agua', test: function (r) { return r.waterMet; } });
    factors.push({ id: 'mono', label: 'Estar en monodieta', test: function (r) { return r.phaseId === 'monodieta'; } });
    var out = [];
    ['energy', 'mood'].forEach(function (metric) {
      var withM = rows.filter(function (r) { return Number(r.day.checkin[metric]) > 0; });
      if (withM.length < minDays) return;
      factors.forEach(function (f) {
        var yes = withM.filter(f.test), no = withM.filter(function (r) { return !f.test(r); });
        if (yes.length < minGroup || no.length < minGroup) return;
        var avg = function (a) { return U.sum(a.map(function (r) { return Number(r.day.checkin[metric]); })) / a.length; };
        var ay = avg(yes), an = avg(no);
        out.push({ factor: f.id, label: f.label, metric: metric, withAvg: ay, withoutAvg: an, diff: ay - an, nWith: yes.length, nWithout: no.length });
      });
    });
    out = out.filter(function (x) { return Math.abs(x.diff) >= 0.3; }).sort(function (a, b) { return Math.abs(b.diff) - Math.abs(a.diff); });
    var seen = new Set(), top = [];
    out.forEach(function (x) { if (top.length < max && !seen.has(x.factor)) { seen.add(x.factor); top.push(x); } });
    return { enough: true, n: rows.length, findings: top };
  };

  /* ---------- series ---------- */
  L.series = function (sum, metric) {
    return sum.days.filter(function (r) { return r.idx >= 1; }).map(function (r) {
      var c = r.day && r.day.checkin, v = null;
      if (metric === 'water') v = r.water || null;
      else if (metric === 'digestion') v = c && c.digestion ? ({ optima: 4, liviano: 3, gases: 2, lenta: 1 })[c.digestion] || null : null;
      else if (c && Number(c[metric]) > 0) v = Number(c[metric]);
      return { idx: r.idx, v: v };
    });
  };
  L.symptomFreq = function (sum) {
    var f = Object.create(null);
    sum.days.forEach(function (r) {
      var c = r.day && r.day.checkin; if (!c) return;
      U.arr(c.symptoms).forEach(function (s) { f[s] = (f[s] || 0) + 1; });
      U.arr(c.customSymptoms).forEach(function (s) { var k = '~' + s; f[k] = (f[k] || 0) + 1; });
    });
    return Object.keys(f).map(function (k) { return { id: k, n: f[k] }; }).sort(function (a, b) { return b.n - a.n; });
  };
  L.avg = function (vals) { var v = vals.filter(function (x) { return x != null; }); return v.length ? U.sum(v) / v.length : null; };
  L.weekAvg = function (series, from, to) { return L.avg(series.filter(function (p) { return p.idx >= from && p.idx <= to; }).map(function (p) { return p.v; })); };

  /* ---------- recordatorio de copia (§3.2): solo con datos y más de 14 días sin copia ---------- */
  L.backupStatus = function (profile, lastBackupAt, now) {
    now = now || Date.now();
    var first = null;
    Object.keys(profile.editions || {}).forEach(function (eid) {
      var e = profile.editions[eid], days = (profile.days && profile.days[eid]) || {};
      Object.keys(days).forEach(function (k) {
        if (!L.dayHasData(days[k])) return;
        var t = days[k].updatedAt || (U.isValidISO(e.startDate) ? U.dateObj(L.dayDate(e, +k)).getTime() : now);
        var iso = U.isValidISO(e.startDate) ? L.dayDate(e, +k) : null;
        var ts = iso ? Math.min(t, U.dateObj(iso).getTime()) : t;
        if (first == null || ts < first) first = ts;
      });
    });
    if (first == null) return { hasData: false, due: false, days: null };
    var since = lastBackupAt || first;
    var days = Math.floor((now - since) / 86400000);
    return { hasData: true, due: days > 14, days: days, never: !lastBackupAt };
  };

  /* ---------- informe de texto ---------- */
  L.reportText = function (profile, sum, dx) {
    var tx = L.tx(dx), ed = sum.edition, p = sum.program || {};
    var lab = function (list, key, v) { var x = U.arr(list).filter(function (o) { return o[key] === v; })[0]; return x ? x.label : v; };
    var L1 = [];
    L1.push('INFORME DE SEGUIMIENTO — ' + (p.name || 'Programa'));
    L1.push('Persona: ' + (profile.name || '—'));
    L1.push('Inicio: ' + (ed.startDate ? U.fmtDate(ed.startDate, 'long') : 'sin fecha') + ' · Modo: ' + (ed.startMode || '—'));
    L1.push('Constancia: ' + (sum.constancy == null ? '—' : Math.round(sum.constancy * 100) + ' %') + ' · Días completos: ' + sum.completeDays + '/' + sum.clock.days + ' · Mejor racha: ' + sum.bestStreak);
    var s = profile.settings || {};
    var al = (s.allergies || []).map(function (a) { return L.allergenLabel(a, dx); }).concat(s.customAllergies || []);
    if (al.length) L1.push('Alergias o intolerancias: ' + al.join(', '));
    L1.push('Recetas distintas probadas: ' + sum.recipesTried.all);
    L1.push('');
    sum.days.forEach(function (r) {
      if (r.idx === 0 && !L.dayHasData(r.day)) return;
      if (r.future && !L.dayHasData(r.day)) return;
      var head = (r.idx === 0 ? 'Preparación' : 'Día ' + r.idx) + (r.iso ? ' (' + U.fmtDate(r.iso, 'short') + ')' : '') + ' — ' + L.phase(p, r.phaseId).name + ' — hábitos ' + r.done + '/' + r.total;
      L1.push(head);
      var c = r.day && r.day.checkin;
      if (c) {
        var bits = [];
        if (c.energy) bits.push('energía ' + c.energy + '/5 (' + lab(tx.energyLevels, 'v', Number(c.energy)) + ')');
        if (c.mood) bits.push('ánimo ' + c.mood + '/5');
        if (c.digestion) bits.push('digestión: ' + lab(tx.digestionStates, 'id', c.digestion));
        if (bits.length) L1.push('  ' + bits.join(' · '));
        var sy = U.arr(c.symptoms).map(function (x) { return lab(tx.symptoms, 'id', x); }).concat(U.arr(c.customSymptoms));
        if (sy.length) L1.push('  Síntomas: ' + sy.join(', '));
        if (c.notes) L1.push('  Notas: ' + String(c.notes).replace(/\s+/g, ' ').trim());
      }
      if (r.water) L1.push('  Agua: ' + r.water + ' ml');
      L.slots(dx).forEach(function (sl) {
        var items = L.mealItems(r.day, sl.id);
        if (items.length) L1.push('  ' + sl.label + ': ' + items.map(function (m) { return (m.done ? '[✓] ' : '[ ] ') + m.name; }).join('; '));
      });
    });
    L1.push('');
    L1.push('Detox de Primavera v' + A.version + ' — registro personal, no es un documento médico.');
    return L1.join('\n');
  };

  /* ---------- .ics (RFC 5545) ---------- */
  function icsEsc(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
  function fold(line) {
    // líneas de máx. 75 octetos (aproximado por caracteres; los textos son cortos)
    var out = [], s = line;
    while (s.length > 74) { out.push(s.slice(0, 74)); s = ' ' + s.slice(74); }
    out.push(s);
    return out.join('\r\n');
  }
  function dt(iso, hhmm) { return iso.replace(/-/g, '') + 'T' + hhmm.replace(':', '') + '00'; }
  /* events: [{ title, desc, date:'YYYY-MM-DD', time:'08:00', count:n|null, minutes:15 }] */
  L.buildICS = function (events, opts) {
    opts = opts || {};
    var tz = opts.tz || 'America/Argentina/Buenos_Aires';
    var stamp = new Date(opts.now || Date.now()).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Detox de Primavera//v' + A.version + '//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    // VTIMEZONE (RFC 5545 §3.6.5): desfase fijo del lugar (exacto para Argentina, sin horario de verano).
    var off = opts.offsetMin != null ? opts.offsetMin : -new Date(opts.now || Date.now()).getTimezoneOffset();
    var sign = off < 0 ? '-' : '+', ao = Math.abs(off);
    var hhmm = sign + ('0' + Math.floor(ao / 60)).slice(-2) + ('0' + ao % 60).slice(-2);
    lines.push('BEGIN:VTIMEZONE', 'TZID:' + tz, 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:' + hhmm, 'TZOFFSETTO:' + hhmm, 'TZNAME:' + hhmm.slice(0, 3), 'END:STANDARD', 'END:VTIMEZONE');
    events.forEach(function (e, i) {
      var end = e.time.split(':'); var mins = (+end[0]) * 60 + (+end[1]) + (e.minutes || 15);
      var endT = ('0' + Math.floor(mins / 60) % 24).slice(-2) + ':' + ('0' + mins % 60).slice(-2);
      lines.push('BEGIN:VEVENT');
      lines.push('UID:' + (e.uid || ('dx2-' + U.hash(e.title + e.date + e.time + i) + '@detox-primavera')));
      lines.push('DTSTAMP:' + stamp);
      lines.push('DTSTART;TZID=' + tz + ':' + dt(e.date, e.time));
      lines.push('DTEND;TZID=' + tz + ':' + dt(e.date, endT));
      if (e.count && e.count > 1) lines.push('RRULE:FREQ=DAILY;COUNT=' + e.count);
      lines.push(fold('SUMMARY:' + icsEsc(e.title)));
      if (e.desc) lines.push(fold('DESCRIPTION:' + icsEsc(e.desc)));
      lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', fold('DESCRIPTION:' + icsEsc(e.title)), 'TRIGGER:PT0M', 'END:VALARM');
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n') + '\r\n';
  };
  /* Recordatorios de la edición: agua (diario), check-in (diario), remojos (sueltos según el plan). */
  L.reminderEvents = function (profile, sum, times, todayISO, dx) {
    var ev = [], ed = sum.edition;
    var start = ed.startDate && ed.startDate > todayISO ? ed.startDate : todayISO;
    var end = U.addDays(ed.startDate || todayISO, sum.clock.days - 1);
    var n = Math.max(1, U.diffDays(start, end) + 1);
    if (times.water) ev.push({ title: 'Agua tibia con limón', desc: 'Detox: un vaso de agua tibia en ayunas.', date: start, time: times.water, count: n });
    if (times.checkin) ev.push({ title: 'Check-in del día', desc: 'Detox: ¿cómo te sentiste hoy? 10 segundos.', date: start, time: times.checkin, count: n });
    if (times.soak) {
      for (var d = start; d <= end; d = U.addDays(d, 1)) {
        var next = U.addDays(d, 1);
        var ids = L.planEntries(profile.plan, next, next).map(function (e) { return e.recipeId; });
        var soaks = L.soaksForRecipes(ids, profile, dx);
        if (soaks.length) ev.push({ title: 'Remojo para mañana', desc: soaks.map(function (s) { return s.soak.name + ' (' + (s.soak.label || s.soak.optH + ' h') + ')'; }).join(', '), date: d, time: times.soak });
      }
    }
    return ev;
  };
})(typeof window !== 'undefined' ? window : globalThis);
