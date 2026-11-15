# Detox Primavera — Directivas del Proyecto & Protocolo Concurrente

> **Ámbito:** `c:\Users\urroz\Proyectos\04_productividad_herramientas\salud-recetas\detox-primavera`  
> **Líder Operativa:** Blair Vance (COO) — Psiquis Susie Glass (*The Gentlemen*).  
> **Doctrina Troncal:** Supeditado a `C:\Users\urroz\Proyectos\AGENTS.md` y `00_panopticon\panopticon\TEAM.md`.

---

## ⚠️ Protocolo Obligatorio: Versionado Semántico y Trabajo Concurrente por Módulos

### 1. Contexto Operativo
El CEO (Gustavo Urroz) opera en **múltiples sesiones de trabajo concurrentes en paralelo**, dedicando cada sesión a un módulo específico:
* **Módulo 1:** Mi Día (Tracker, hábitos, línea de tiempo, comidas, bitácora y perfil de alergias).
* **Módulo 2:** Recetario & Cocina Inteligente (Catálogo de 73 recetas, Heladera inteligente, Batch cooking, Remojos).
* **Módulo 3:** Compras (Lista interactiva clasificada por rubro, exportación a WhatsApp).
* **Módulo 4:** Semáforo Nutricional (Buscador "¿Puedo comer esto?", alimentos permitidos y prohibidos).
* **Módulo 5:** SOS & Botiquín Clínico (Crisis curativas, fichas de hierbas y fitoterapia).

### 2. Regla de Oro: Revisión Previa Obligatoria Antes de Tocar Versiones
**Está terminantemente prohibido asumir o proponer un número de versión a ciegas o acumular trabajo nuevo en una versión ya asignada a otro hito.**

Antes de proponer, estampar o modificar cualquier versión, el agente DEBE ejecutar sin excepción la siguiente rutina de auditoría:
1. **Inspección de Git:** Ejecutar `git status` y `git log -n 5` para contrastar el estado del árbol de trabajo local (*working tree*) contra `origin/main`.
2. **Auditoría Documental:** Leer `ESTADO-DEL-PROYECTO.md` y verificar qué hito y funcionalidades cubre la versión declarada.
3. **Criterio SemVer (No pisar sesiones):**
   - Si la versión que figura en disco ya fue cerrada por otra sesión para un módulo (ej. `v1.3.0` para Módulo 1), cualquier feature o carga relevante de otro módulo (ej. Módulo 2) **exige un incremento de versión independiente** (ej. `v1.4.0`), en lugar de sobreescribir o empaquetar todo dentro del mismo número.
   - Si se trata de fixes o ajustes menores de un mismo módulo en curso, se evalúa Patch (`v1.3.1`). Si es una funcionalidad sustantiva, Minor (`v1.4.0`).
4. **Declaración Explícita al CEO:** Informar con frialdad contable:
   - Versión base detectada en disco y su autoría/hito.
   - Versión destino propuesta con su justificación SemVer.
   - Esperar confirmación antes de sellar releases o pushear a GitHub.

---

## 🛠️ Reglas Técnicas de Construcción y Empaquetado (desde v2.0.0)

1. **Fuente única en `v2/`** (la carpeta `app/` y `bundle.py` son la v1 histórica: NO se usan para construir):
   - Contenido de la guía: `v2/src/data/*.js` (contrato en `rediseno-v2/ESPEC-V2.md` §2).
   - Lógica y pantallas: `v2/src/app/*.js` (orden por prefijo numérico). Estética: `v2/src/styles/*.css`.
2. **Construcción:** `python v2/build.py` genera `index.html`, `Detox-Primavera-App.html` (idénticos), `sw.js`, `manifest.webmanifest` e íconos. Nunca editar las salidas a mano.
3. **Pruebas:** `node v2/tests/run.js` debe dar 0 con error antes de cualquier entrega.
4. **Cero dependencias externas:** no agregar CDN, fuentes ni scripts remotos. Toda decisión nueva se anota en `rediseno-v2/DECISIONES.md`.
5. **Datos del usuario:** nunca romper la migración ni el esquema `detox2_state` sin una migración `schema N→N+1` con tests.
4. **Respeto Estricto a Git:**
   - Nunca descartar cambios ajenos del working tree.
   - Nunca hacer push a `origin/main` sin ratificación explícita de Gustavo.
   - Firma obligatoria en commits: `Co-Authored-By: Blair Vance (Antigravity) <noreply@google.com>`
