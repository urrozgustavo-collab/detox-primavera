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

## 🛠️ Reglas Técnicas de Construcción y Empaquetado

1. **Arquitectura Modular Desacoplada:**
   - La lógica vive en `app/modules/<modulo>/` y `app/core/`.
   - La base de datos vive en `app/detox-data.js` y motores en `app/fridge-engine.js`.
2. **Bundling Determinista:**
   - Tras modificar archivos fuente en `app/`, es mandatario ejecutar `python bundle.py`.
   - Esto recompila `app/index.html` (dev) y genera los archivos producción: `Detox-Primavera-App.html` e `index.html`.
3. **Suite de Verificación:**
   - Ejecutar siempre:
     * `node -c app/detox-data.js`
     * `node scratch/test_deep_modules.js`
     * `node scratch/test_recipes_catalog.js`
4. **Respeto Estricto a Git:**
   - Nunca descartar cambios ajenos del working tree.
   - Nunca hacer push a `origin/main` sin ratificación explícita de Gustavo.
   - Firma obligatoria en commits: `Co-Authored-By: Blair Vance (Antigravity) <noreply@google.com>`
