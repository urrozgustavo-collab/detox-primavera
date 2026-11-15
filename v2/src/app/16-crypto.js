/* Detox v2 — códigos de sincronización y cifrado de extremo a extremo (WebCrypto, §3.3).
   clave = PBKDF2-SHA256(código normalizado, salt 16 B, 150 000 iteraciones) → AES-GCM 256.
   clave KV = 'dx2_' + 32 hex de SHA-256('dx2:' + código). */
(function (root) {
  'use strict';
  var A = root.DXApp, U = A.util, L = A.logic;

  L.SYNC_BUCKET = 'EE7impjfrWvHaAhuDDuBvU';
  L.SYNC_BASE = 'https://kvdb.io/' + L.SYNC_BUCKET + '/';
  L.SYNC_ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  L.PBKDF2_ITER = 150000;

  function cryptoObj() { return root.crypto || null; }
  L.syncAvailable = function () { var c = cryptoObj(); return !!(c && c.subtle && c.getRandomValues && root.isSecureContext !== false); };

  L.newSyncCode = function (randBytes) {
    var b = randBytes || (function () { var x = new Uint8Array(12); cryptoObj().getRandomValues(x); return x; })();
    var s = '';
    for (var i = 0; i < 12; i++) s += L.SYNC_ALPHA[b[i] % 32];   // 256 es múltiplo de 32: sin sesgo
    return s;
  };
  L.normCode = function (s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); };
  L.isNewCode = function (s) {
    var n = L.normCode(s);
    if (n.length !== 12) return false;
    for (var i = 0; i < n.length; i++) if (L.SYNC_ALPHA.indexOf(n[i]) < 0) return false;
    return true;
  };
  L.isLegacyCode = function (s) { var t = String(s || '').trim().toUpperCase(); return !L.isNewCode(t) && /^[A-Z0-9][A-Z0-9_-]{2,39}$/.test(t); };
  L.fmtCode = function (s) { var n = L.normCode(s); return L.isNewCode(n) ? n.slice(0, 4) + '-' + n.slice(4, 8) + '-' + n.slice(8) : String(s || '').toUpperCase(); };
  /* Código tal como se usa: los nuevos sin guiones; los viejos tal cual (GUS-XXXX). */
  L.canonicalCode = function (s) { return L.isNewCode(s) ? L.normCode(s) : String(s || '').trim().toUpperCase(); };

  var te = new TextEncoder(), td = new TextDecoder();
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  L.b64 = function (u8) { var s = ''; u8 = new Uint8Array(u8); for (var i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };
  L.unb64 = function (s) { var bin = atob(s), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };

  L.kvKey = function (code) {
    return cryptoObj().subtle.digest('SHA-256', te.encode('dx2:' + L.canonicalCode(code))).then(function (h) { return 'dx2_' + hex(h).slice(0, 32); });
  };
  function deriveKey(code, salt, iter) {
    var sub = cryptoObj().subtle;
    return sub.importKey('raw', te.encode(L.canonicalCode(code)), 'PBKDF2', false, ['deriveKey']).then(function (base) {
      return sub.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: salt, iterations: iter || L.PBKDF2_ITER }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    });
  }
  L.encrypt = function (obj, code, opts) {
    opts = opts || {};
    var c = cryptoObj();
    var salt = opts.salt || c.getRandomValues(new Uint8Array(16));
    var iv = opts.iv || c.getRandomValues(new Uint8Array(12));
    return deriveKey(code, salt, opts.iter).then(function (key) {
      return c.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, te.encode(JSON.stringify(obj)));
    }).then(function (ct) {
      return { v: 2, salt: L.b64(salt), iv: L.b64(iv), ct: L.b64(ct), at: opts.now || Date.now(), it: opts.iter || L.PBKDF2_ITER };
    });
  };
  L.decrypt = function (payload, code) {
    if (!payload || payload.v !== 2 || !payload.ct) return Promise.reject(new Error('Formato de copia en la nube desconocido'));
    return deriveKey(code, L.unb64(payload.salt), payload.it || L.PBKDF2_ITER).then(function (key) {
      return cryptoObj().subtle.decrypt({ name: 'AES-GCM', iv: L.unb64(payload.iv) }, key, L.unb64(payload.ct));
    }).then(function (pt) { return JSON.parse(td.decode(pt)); }, function () { throw new Error('No se pudo descifrar: el código no coincide'); });
  };

  /* Lo que viaja a la nube: el perfil sin los datos del dispositivo. */
  L.syncPayloadProfile = function (profile) {
    var p = U.clone(profile);
    if (p.settings) delete p.settings.sync;
    return p;
  };

  /* Cliente kvdb con fetch inyectable (los tests usan un mock). */
  L.kvClient = function (fetchFn, base) {
    base = base || L.SYNC_BASE;
    function req(method, key, body) {
      var opt = { method: method, cache: 'no-store' };
      if (body != null) { opt.body = body; opt.headers = { 'Content-Type': 'text/plain' }; }
      var url = base + encodeURIComponent(key) + (method === 'GET' ? '?_t=' + Date.now() : '');
      return fetchFn(url, opt);
    }
    return {
      get: function (key) {
        return req('GET', key).then(function (r) {
          if (r.status === 404) return null;
          if (!r.ok) throw new Error('La nube respondió ' + r.status);
          return r.text().then(function (t) { if (!t) return null; try { return JSON.parse(t); } catch (e) { throw new Error('La nube devolvió datos ilegibles'); } });
        });
      },
      put: function (key, obj) {
        return req('POST', key, JSON.stringify(obj)).then(function (r) { if (!r.ok) throw new Error('La nube respondió ' + r.status); return true; });
      },
      del: function (key) { return req('DELETE', key).then(function (r) { return r.ok || r.status === 404; }); }
    };
  };

  /* Ciclo de sincronización puro: baja, descifra, fusiona, cifra y sube. Devuelve el perfil fusionado.
     deps: { kv, code, local, dx, now, today, pushOnly } */
  L.syncOnce = function (deps) {
    var code = deps.code, kv = deps.kv;
    var legacy = L.isLegacyCode(code);
    var keyP = L.kvKey(code);
    return keyP.then(function (key) {
      return kv.get(key).then(function (remote) {
        var remoteP = Promise.resolve(null);
        if (remote && remote.v === 2) remoteP = L.decrypt(remote, code);
        else if (!remote && legacy) {
          remoteP = kv.get(L.canonicalCode(code)).then(function (old) {
            if (!old || !L.isV1Payload(old)) return null;
            var mig = L.migrateV1Payload(old, deps.dx, deps.now, deps.today);
            var p = mig && mig.state.profiles[mig.state.activeProfile];
            if (p) p.updatedAt = 0;   // que no pise los metadatos locales
            return p ? { profile: p, legacyImported: true, days: mig.report.days } : null;
          });
        }
        return remoteP.then(function (rem) {
          var remoteProfile = rem && rem.profile ? rem.profile : rem;
          var merged = remoteProfile ? L.mergeProfile(deps.local, remoteProfile) : U.clone(deps.local);
          merged.id = deps.local.id;
          return L.encrypt(L.syncPayloadProfile(merged), code, { now: deps.now }).then(function (payload) {
            return kv.put(key, payload);
          }).then(function () {
            return { profile: merged, pulled: !!remoteProfile, legacyImported: !!(rem && rem.legacyImported), legacyDays: rem && rem.days };
          });
        });
      });
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
