# 🌿 Detox Primavera — Estado del Proyecto & Guía de Continuidad

> **Última actualización:** 27 de septiembre de 2026  
> **Versión Actual:** `v1.2.1` *(SemVer: 1 Major, 2 Minor, 1 Patch)*  
> **Líder Operativa:** Blair Vance (COO)  
> **Repositorio GitHub:** [`urrozgustavo-collab/detox-primavera`](https://github.com/urrozgustavo-collab/detox-primavera)  
> **Enlace de Producción (Webapp PWA):** [https://urrozgustavo-collab.github.io/detox-primavera/](https://urrozgustavo-collab.github.io/detox-primavera/)

---

## 1. Resumen Ejecutivo & Contexto

Este proyecto digitaliza y gamifica el programa **"Detox de Primavera (21 Días)"** guiado por **Isabel Caparra**, transformando un conjunto de guías y PDFs estáticos en una **aplicación web interactiva móvil de primera categoría (PWA)** para **Gustavo Urroz** y su novia **Jime**.

El sistema fue diseñado con ergonomía nativa de celular (no una pantalla de PC reducida) para ser utilizado con una sola mano en la cocina, en la verdulería y en la mesa.

---

## 2. Arquitectura de Archivos y Repositorio

El proyecto vive en:  
`C:\Users\urroz\Proyectos\04_productividad_herramientas\salud-recetas\detox-primavera`

### Estructura del Proyecto:
```text
detox-primavera/
├── index.html                   # Servido por GitHub Pages (bundle empaquetado)
├── Detox-Primavera-App.html     # Copia bundled standalone (autónoma y offline)
├── app/                         # Código fuente modular de desarrollo
│   ├── index.html               # Estructura Vue 3 y layout semántico
│   ├── app.js                   # Lógica reactiva Vue 3, sincronización y estado
│   ├── styles.css               # Estilos Tailwind CSS + ergonomía móvil + safe-areas
│   └── detox-data.js            # Base de datos clínica estructurada (recetas, compras, etc.)
├── RESUMEN-OPERATIVO.md         # Fases, menú general, botiquín SOS y reglas clínicas
├── LISTA-DE-COMPRAS.md          # Compras organizadas por comercio
├── INFO-TALLER-ISA-CAPARRA.md   # Fechas en vivo, Meet, grabaciones de YouTube y contactos
├── ESTADO-DEL-PROYECTO.md       # Este documento de continuidad y traspaso
├── guia-detox-primavera.pdf     # Documento fuente original
└── como-prepararse-para-el-detox.pdf # Documento fuente original
```

### Script de Bundling / Compilación:
Para unir los archivos modulares de `app/` en un único archivo standalone (`Detox-Primavera-App.html`):
```powershell
python C:\Users\urroz\.gemini\antigravity\brain\6f82fc43-934a-47b4-9b61-122bcfbe0566\scratch\bundle.py
Copy-Item -Path "Detox-Primavera-App.html" -Destination "index.html" -Force
git add . ; git commit -m "feat: actualización" ; git push origin main
```

---

## 3. Funcionalidades Operativas Implementadas

### A. Experiencia Móvil de Aplicación Nativa
- **Bottom Navigation Bar fija (5 pestañas):**
  1. 📅 **Mi Día:** Tracker diario, hábitos, línea de tiempo de 21 días y fase activa.
  2. 🥗 **Recetas:** Catálogo de preparaciones limpias con filtros y modo cocina paso a paso.
  3. 🛒 **Compras:** Lista clasificada por rubro (verdulería, dietética, etc.) con badge de pendientes y botón de exportación limpia a WhatsApp.
  4. 🚦 **Semáforo:** Buscador "¿Puedo comer esto?" con estados Verde (libre), Amarillo (moderado) y Rojo (prohibido).
  5. 🆘 **SOS & Guía:** Botiquín clínico ante crisis curativas (cefalea, estreñimiento, diarrea, mareos) y fichas de hierbas.
- **Microinteracciones y Ergonomía:** Modales tipo *Bottom Sheet* deslizables desde abajo, carrusel de días con *snap scroll* táctil, soporte de *safe-area-insets* para iPhone/Android, y tema Claro / Oscuro con persistencia.

### B. Gestión Temporal y Planificación
- **Control Desacoplado de Fecha de Inicio:**
  - Botón directo *"Empezar Hoy (Día 1)"* o selector desacoplado con atajos rápidos (*Hoy*, *Mañana*, *Próximo Lunes*) y confirmación obligatoria (*"✓ Confirmar fecha"*), evitando que el tipeo parcial dispare cálculos prematuros de reto finalizado.
  - La aplicación calcula automáticamente en qué día del reto te encontrás (`Día X de 21`), destacando el día actual en el carrusel con la etiqueta `HOY`.
- **Botón Directo "Cancelar inicio (volver a foja cero)":**
  - Permite ante cualquier error o cambio de planes cancelar inmediatamente la vinculación de fecha, devolviendo la interfaz al estado original sin perder configuraciones.
- **Botones de Reinicio Seguro & Blindaje Cloud:**
  - *Reprogramar fecha / Foja cero:* Permite desvincular o cambiar el día de arranque conservando los hábitos tildados.
  - *Borrar todo a cero:* Resetea de foja cero misiones, compras, rachas y puntos.
  - *Blindaje de concurrencia:* Escudo temporal en el evento de foco para evitar que modales de confirmación del navegador disparen un pull que pise los reseteos locales con datos viejos de la nube.

### C. Sincronización Universal en la Nube (Multi-Dispositivo)
- **100% gratuita y sin registros:** No requiere emails, usuarios ni contraseñas.
- **Edge Key-Value Store (`kvdb.io`):** Bucket dedicado de latencia ultrabaja con soporte CORS.
- **Esquema de Vinculación:**
  - Código personal corto (ej. `GUS-XXXX`).
  - Código QR dinámico en pantalla: se apunta con la cámara del celular y se auto-vincula.
  - Enlace directo con parámetro: `https://urrozgustavo-collab.github.io/detox-primavera/?sync=GUS-XXXX`.
- **Dinámica Multi-Usuario:**
  - Gustavo usa su propio código en su celular, en la compu de Jime y en la compu de su casa.
  - Jime genera su propio código en su dispositivo para tener su seguimiento individualizado sin pisarse con Gustavo.

---

## 4. Aislamiento Clínico Estricto

> [!IMPORTANT]
> En la carpeta padre `C:\Users\urroz\Proyectos\04_productividad_herramientas\salud-recetas` reside el archivo `PROTOCOLO-SUPLEMENTOS-MAYO-2026.md`.
> **Ese archivo pertenece a un tratamiento médico previo e independiente** (metilfolato, B12, colágeno, etc.).
> **No debe ser mezclado** con el Detox estacional de Isabel Caparra, que maneja sus propias pautas depurativas limpias y sin suplementos de laboratorio.

---

## 5. Backlog de Mejoras y Roadmap de Escalado

A continuación se consolidan los requerimientos estratégicos y funcionales solicitados por el CEO para evolucionar la herramienta hacia un producto robusto y comercializable para profesionales de salud/nutrición (B2B2C):

### A. Inspiración & Mentalidad
1. **Frase Motivacional Diaria:** `[COMPLETADO EN v1.1.0]`
   - Una píldora de sabiduría y enfoque al comenzar cada jornada ("Mi Día").
   - 22 citas célebres y profundas de autores alineados a la medicina natural, depuración y salud digestiva/holística (Hipócrates, Paracelso, Ann Wigmore, Bernard Jensen, Arnold Ehret, Alexis Carrel, Gandhi, etc.).
   - Tono sobrio, inspirador y sin clichés de autoayuda genérica, con botón de copia rápida.

### B. Seguimiento Clínico y Registro Personal
2. **Diario de a Bordo / Bitácora de Sensaciones & Síntomas:** `[COMPLETADO EN v1.1.0]`
   - Registro cualitativo diario: nivel de energía vital (1 a 5), estado digestivo (4 categorías), señales depurativas frecuentes (píldoras interactivas) y notas libres.
   - **Tres vistas ergonómicas:**
     - *Vista Diaria:* Foco exclusivo en la jornada en curso con edición inmediata y autoguardado.
     - *Vista Semanal:* Panorama compacto de los 7 días de la fase para correlacionar avances.
     - *Vista Global / Historial:* Registro cronológico completo apilado de los 21 días.
   - **Exportación Universal:** Generador de reportes clínicos estructurados para compartir con el terapeuta/nutricionista en formato WhatsApp / Google Docs / Word o imprimir en PDF.

3. **Historial de Ingestas & Registro Libre de Comidas:** `[COMPLETADO EN v1.1.0]`
   - Trazabilidad de 4 momentos diarios (desayuno, almuerzo, merienda, cena).
   - Checkbox de confirmación de ingesta pautada.
   - Input de texto libre con sugerencias de recetas de la guía con un solo clic.

### C. Inteligencia en la Cocina y Optimización de Compras
4. **Heladera / Despensa Inteligente ("¿Qué cocino hoy con lo que tengo?"):** `[COMPLETADO EN v1.2.0]`
   - Buscador por selección interactiva o tipeo de alimentos disponibles en la cocina del usuario (54 ingredientes normalizados).
   - **Matching porcentual sensato:** Ponderación diferenciada de ingredientes principales (80% del score) vs. condimentos básicos (20% del score). Salvaguarda estricta: sin alimentos principales nunca supera el 40% de completitud.
   - Indicador visual claro de recetas "🟢 100% Cocinable ya", "🟡 Casi listas (falta 1 o 2 ingredientes)" y lista explícita de faltantes con cantidades.
   - Botón directo para enviar los faltantes a la lista de compras o iniciar el modo cocina.

5. **Planificador Semanal de Menús & Batch Cooking:** `[COMPLETADO EN v1.2.0]`
   - 6 módulos de cocción unificada en bloque: Base Arroz Yamaní, Base Porotos Mung con Kombu, Base Caldo Concentrado, Base Verduras al Vapor/Nituke, Base Frutos Secos/Bagazo y Base Fermentos Vivos.
   - Cálculo automático de horas de ahorro semanal (~210 a 250 minutos semanales) y pautas de almacenamiento seguro en heladera y freezer.

6. **Gestor de Tiempos Previos, Activación y Remojos:** `[COMPLETADO EN v1.2.0]`
   - Matriz clínica de activación para 11 insumos críticos (Almendras, Castañas de cajú, Porotos mung, Arroz yamaní, Quinoa, Lino, Chía, Sésamo, Kéfir, Chucrut y Masa madre).
   - Indicador visual de alerta de agua: cuándo es obligatorio **descartar el agua** (para eliminar antinutrientes y fitatos) vs. cuándo está terminantemente prohibido descartarla (como en el mucílago protector de lino y chía).

---

## 6. Historial de Versiones (SemVer 2.0.0)

- **`v1.2.0` (27/09/2026):**
  - **Heladera Inteligente ("¿Qué cocino con lo que tengo?"):** Catálogo de 54 ingredientes clasificados clínicamente, taps rápidos de insumos frecuentes, buscador y selector por categorías.
  - **Motor de Scoring Clínico Anti-Falsos Positivos:** Ponderación 80% insumos base / 20% condimentos. Si faltan los principales, la receta nunca supera el 40% de coincidencia aunque se tengan todas las especias.
  - **Tiers de Compatibilidad & Faltantes:** Clasificación en tiempo real entre listas para cocinar (100%), casi listas (70-99%) e incompletas, con detalle exacto de faltantes y botón para enviarlos a compras.
  - **Planificador Semanal & Batch Cooking:** 6 bases de preparación en bloque con cálculo en tiempo real de minutos y horas ahorradas en la semana, y pautas de preservación en heladera y freezer.
  - **Gestor de Remojos y Tiempos Previos:** 11 reglas bioquímicas de activación celular con alertas explícitas de descarte o conservación de agua y fundamento clínico.
  - **Arquitectura de Subvistas:** Integración en pestaña Recetas mediante control segmentado táctil fluido (Recetario, Mi Heladera, Batch Cooking, Remojos).
  - **Sincronización en la Nube Ampliada:** Los ingredientes seleccionados en la heladera y el plan semanal se sincronizan en caliente entre celular y computadoras (`kvdb.io`).
- **`v1.1.0` (27/09/2026):**
  - **Inspiración Clínica Diaria:** 22 citas de autores célebres y profundos de la medicina natural e higienismo (Día 0 al 21), sincronizadas con cada jornada y botón de copia rápida.
  - **Bitácora Clínica & Diario de Sensaciones:** Registro de vitalidad (1 a 5), estado digestivo (4 niveles), síntomas/crisis curativas frecuentes y notas libres.
  - **Tres Vistas Ergonómicas de Bitácora:** Modo Día (foco diario), Modo Semana (resumen de 7 días) y Modo Global (historial clínico completo apilado).
  - **Modal de Exportación Universal:** Previsualización en texto estructurado, copiado directo para WhatsApp / Docs e impresión / guardado en PDF para nutricionistas.
  - **Registro de Comidas & Ingestas:** 4 momentos diarios (desayuno, almuerzo, merienda, cena) con tilde de consumido, texto libre y sugerencias directas de recetas de la guía.
  - **Persistencia y Sincronización:** Registro y comidas completamente integrados en el esquema de persistencia local y sincronización universal en la nube (`kvdb.io`).
  - **Script de Compilación Autónomo:** Incorporación de `bundle.py` en la raíz del repositorio para empaquetado standalone determinista.
- **`v1.0.1` (27/09/2026):**
  - Fix crítico: Restauración del scroll estándar en la versión web de escritorio (ajuste de ancho de barra a 10px, estados hover y eliminación de restricciones `100vw`).
  - Fix crítico: Persistencia de sincronización en caliente ante cierres de navegador móvil (triple capa con LocalStorage, Cookies, prevención de sobreescritura prematura y retención de `?sync=` en URL).
  - Fix visual: Corrección de solapamiento en la barra de navegación de escritorio (`md:hidden` en botones secundarios de Botiquín/Herbolario).
  - Fix móvil: Adaptación de la botonera del Semáforo Nutricional a una grilla táctil 2x2 para evitar el desborde del botón rojo.
- **`v1.0.0` (26/09/2026):**
  - Lanzamiento inicial de la WebApp PWA interactiva: Tracker 21 días, Menú y recetas con Modo Cocina, Lista de compras clasificada, Semáforo Nutricional, Botiquín SOS y sincronización multi-dispositivo sin contraseñas (Edge KV).

---

## 7. Instrucciones para Retomar en un Nuevo Chat

Si abrís una nueva conversación con Blair / Antigravity, podés arrancar simplemente diciendo:

> *"Leé `ESTADO-DEL-PROYECTO.md` en `04_productividad_herramientas/salud-recetas/detox-primavera` y decime qué tenemos."*
