# Detox Primavera v2 — código fuente

| Carpeta | Qué hay |
|---|---|
| `src/data/` | Todo el contenido de la guía (recetas, ingredientes, semáforo, herbario, SOS, compras, remojos, programas, citas). Contrato: `../rediseno-v2/ESPEC-V2.md` §2. Estado: `src/data/READY.md`. |
| `src/app/` | Lógica (00–17, funciones puras con tests) y pantallas (30–47), arranque en `99-boot.js`. |
| `src/styles/` | Tokens de color/tipografía (`tokens.css`), base, componentes, pantallas, capas `sutil.css` y `texto.css` (v2.4) e impresión. |
| `src/fonts/` | Letra Geist (`Geist-Variable.woff2`), que `build.py` incrusta en base64 dentro del HTML. Procedencia y SHA-256 en `FUENTES.md`. |
| `src/shell.html` | Esqueleto HTML donde `build.py` inserta CSS y JS. |
| `tools/` | Generador de `recipes.js` a partir de la v1 + capas de corrección. |
| `tests/` | `node tests/run.js` — datos, lógica, migración v1, fusión de sync, cifrado. |
| `build.py` | Arma `../index.html`, `../Detox-Primavera-App.html`, `../sw.js`, `../manifest.webmanifest`, íconos. |

Flujo: editar `src/` → `python v2/build.py` → `node v2/tests/run.js` → abrir `Detox-Primavera-App.html`.
Decisiones tomadas: `../rediseno-v2/DECISIONES.md`.

## Licencias de terceros

- **Geist** (Vercel), letra del texto de la app: SIL Open Font License 1.1 — `src/fonts/Geist-OFL.txt`. Va incrustada en el HTML; el armado verifica su SHA-256 antes de usarla.
