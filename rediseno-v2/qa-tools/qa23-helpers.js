/* QA v2.3 — ayudantes para inyectar en la página (javascript_exec: eval(await (await fetch('/rediseno-v2/qa-tools/qa23-helpers.js')).text())) */
window.__errs = window.__errs || [];
addEventListener('error', function (e) { __errs.push('E:' + e.message); });
addEventListener('unhandledrejection', function (e) { __errs.push('R:' + (e.reason && e.reason.message)); });
window.QA = {
  sleep: function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); },
  overflowX: function () { return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }; },
  state: function () {
    var a = document.activeElement;
    return { hash: location.hash, tab: document.body.dataset.tab, dlg: [].slice.call(document.querySelectorAll('dialog[open]')).map(function (d) { return d.id + ':' + ((d.querySelector('h2') || {}).textContent); }),
      h1: (document.querySelector('#main h1') || {}).textContent, title: document.title, act: a && (a.tagName + '#' + a.id + '.' + a.className) };
  },
  go: function (h) { location.hash = h; return QA.sleep(250).then(QA.state); },
  txt: function (sel) { var e = document.querySelector(sel || '#main'); return e ? e.innerText.replace(/\n+/g, ' ⏎ ') : null; }
};
