/* Detox de Primavera v2 — espacio de nombres de datos.
   Todos los archivos de data/ asignan window.DX.<clave>. La app nunca los modifica. */
(function (root) {
  'use strict';
  root.DX = root.DX || {};
  root.DX.dataVersion = '2.0.0';
})(typeof window !== 'undefined' ? window : globalThis);
