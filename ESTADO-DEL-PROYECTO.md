# 🌿 Detox Primavera — Estado del Proyecto & Guía de Continuidad

> **Última actualización:** 19 de noviembre de 2026  
> **Versión Actual:** `v2.4.0` — «texto y líneas finas» en una columna central (rama git `rediseno-v2`, sin publicar todavía)  
> **Versión anterior publicada:** `v1.4.2` (rama `main`, GitHub Pages)  

---

## v2.4.0 — «Texto y líneas finas» en una columna central (19/11/2026)

Gustavo aprobó las maquetas `rediseno-v2/maquetas/maquetas-centro.html` (computadora) y `maquetas-detalle.html` (detalles «después»). Cambia solo la presentación; funciones, rutas, datos guardados (`detox2_state`, `schema: 2`), migración v1, sincronización y modo claro/oscuro quedan igual (103 tests en verde). Detalle de cada decisión en `rediseno-v2/DECISIONES.md` (prefijo `[v2.4]`).

- **Letra Geist** para todo el texto, incrustada dentro del HTML (sin internet; el armado verifica su huella SHA-256). Los títulos grandes siguen en Segoe UI Variable Display.
- **Computadora:** todo en una sola columna central angosta (620 px; 700 en Compras), con los costados vacíos y mucho aire. La barra de arriba (marca · Hoy/Cocina/Vos con puntito coral · buscar) ocupa el mismo ancho centrado. La receta se abre sola, con «‹ Recetas» para volver (se fue la vista lista + receta lado a lado).
- **Paneles centrados** en la computadora (fondo apagado y un poco desenfocado); en el celular siguen subiendo desde abajo.
- **Botón principal = barra verde** (una sola por pantalla); lo demás, texto gris debajo o al lado.
- **Sin tildes ni casillas:** lo marcado lleva un punto verde; ingredientes y compras hechos se tachan suave. Sin píldoras, chips ni recuadros con fondo: renglones separados por líneas finas.
- **Opciones como palabras:** categorías de recetas en texto + un único «Filtrar» (panel con «Mostrar» y «Ordenar por»), filtros activos como frase con ✕; fecha de inicio, orden y porciones en palabras con puntito coral; energía y ánimo como fila de números 1–5; señales y digestión como palabras con punto verde; semáforo con un grupo por vez (Libre · Con moderación · Evitar).
- **Celular:** mismo sistema; la barra de abajo pasa a ser plana con línea fina (sin cápsula).
- **Tamaño:** el HTML queda en ≈740 KB (la fuente suma ≈93 KB): supera el tope de 600 KB del contrato; ver la última decisión `[v2.4]`.
- Archivos: `v2/build.py` (fuente y versión), `v2/src/styles/tokens.css`, `sutil.css` (se quitaron panel lateral y columnas dobles), `texto.css` (nueva), `v2/src/app/00-util.js`, `30-core.js`, `31-kit.js`, `40-hoy.js`, `41-cocina.js`, `42-compras.js`, `43-guia.js`, `44-progreso.js`, `45-programas.js`, `46-ajustes.js`, `47-search.js`, `48-vos.js`, `v2/tests/fuente.test.js` (nuevo), `v2/README.md`.

## v2.3.0 — Organización «A · Un paso a la vez» (18/11/2026)

Gustavo eligió la organización A de las maquetas de calma (`rediseno-v2/maquetas/maquetas-calma.html` y `maquetas-a-computadora.html`). Cambia solo la presentación y la navegación; lógica, datos, datos guardados, migración v1 y sincronización quedan igual (101 tests en verde). Detalle de cada decisión en `rediseno-v2/DECISIONES.md` (prefijo `[v2.3]`).

- **3 pestañas: Hoy · Cocina · Vos.** En el celular, una cápsula flotante abajo; en la computadora, arriba al centro (sin barra lateral), con «Buscar Ctrl K» y el avatar a la derecha. El avatar: cambiar o sumar persona, tema, Programas y Ajustes.
- **Hoy:** fecha, «Día N de 21» grande, fase en coral y una línea de 21 tramos (tocar uno lleva a ese día). Una tarjeta «Ahora» con el próximo hábito («Hecho» / «Hoy no»; «ver todos» despliega la lista con consejos y avisos). Debajo, renglones tranquilos que se abren en una hoja (celular) o panel lateral (computadora): Agua (con + rápido), Comidas, ¿Cómo te sentís?, Para mañana y Nota del día. Constancia y racha en una línea discreta; puntos, logros y la planta pasan a Vos.
- **Cocina:** pestañas de texto Recetas · Plan · Compras (con los pendientes) · Heladera · Batch y remojos · Métodos. En la computadora, lista de recetas y receta abierta lado a lado.
- **Vos (nueva, `#/vos`):** frase de avance, mapa de los 21 días, energía y ánimo, puntos y logros, y accesos a Progreso, Diario, Logros, Historial, Informe, Reintroducción, Guía (semáforo, SOS, herbario, taller), Programas y Ajustes.
- **Todos los enlaces viejos siguen andando** (`#/compras`, `#/guia/...`, `#/progreso/...`, etc.); solo cambia en qué pestaña aparecen.
- **Ronda de QA (`rediseno-v2/QA-v2.3.md`, 19 hallazgos, todos corregidos):** la tarjeta de Hoy cambia según el día (hoy / pendiente / por venir / terminado), «¿Cómo te sentís?» con 5 puntos numerados y etiquetas cortas, Comidas con una sugerencia por momento, Cocina con «Más» en el celular y buscador fijo en computadora, Guía/Progreso/Ajustes/Programas con la misma calma (sin cajas; semáforo en renglones que se despliegan), mapa de días con formas además de colores, la planta también en el celular, bienvenida sin fecha preelegida y mejoras de accesibilidad.
- Archivos: `v2/src/app/30-core.js` (cabecera, cápsula, hojas «vivas»), `40-hoy.js`, `41-cocina.js`, `48-vos.js` (nuevo), `v2/src/styles/sutil.css` (capa «calma» reescrita); retoques menores en compras, guía, progreso, programas, ajustes y búsqueda.

## v2.2.0 — Estética «Primavera sutil» (18/11/2026)

Gustavo pidió una estética mucho más minimalista que la v2.1 sin perder funciones. Se armaron 4 maquetas (`rediseno-v2/maquetas/maquetas-minimalistas.html`) y eligió **C · Primavera sutil**. Cambios (solo visuales; lógica, datos y 101 tests intactos):
- Paleta nueva en `v2/src/styles/tokens.css`: blanco rosado `#FCF8F6`, tinta cálida, verde oliva `#446650` para lo hecho y coral `#C9542F` solo para la fase, el día actual y los hitos; modo oscuro equivalente.
- Capa `v2/src/styles/sutil.css` (se carga después de las demás): sin sombras ni degradés, sin mayúsculas sostenidas, sin cajas de colores; tarjetas blancas con borde finísimo; hábitos como lista; resumen del día con anillo + cifras en dos columnas.
- La planta de Hoy pasa a ser una ramita de trazo fino que crece por etapas y florece en coral (`K.plant` en `31-kit.js`).
- Ícono, color de la barra del celular y manifest con la paleta nueva.

## v2.1.0 — Rediseño estético y ergonómico (16/11/2026)

Sobre la base funcional y de datos `v2.0.0` creada por Claude (15/11/2026), se realizó un rediseño integral del sistema visual, la tipografía y la jerarquía de pantallas inspirado en las portadas ilustradas del PDF de **Isabel Caparra** (págs. 1, 26 y 40), conservando intactos el motor de lógica, la migración v1, la sincronización cifrada y los 101 tests:

- **Paleta del PDF y tipografía sans-serif moderna:** fondo durazno cálido (`#FADFD0`), tarjetas crema (`#FFF7F2`), texto carbón (`#222221`), mancha salvia (`#C9CEC3`), verde eucalipto (`#446650`), terracota coral (`#D4512A`), mandarina (`#E68A20`) y canela (`#9A5D24`), más su variante nocturna (`#171413`). Tipografía 100 % sans-serif sin dependencias externas (títulos geométricos pesados con el guión firma debajo de cada `h1` y cuerpo limpio).
- **Sistema de controles y geometría:** reemplazo de botones tipo píldora por botones arquitectónicos (`11px`) con sombras y biseles calibrados; diferenciación clara entre botones primarios (`--accent`), chips de filtro activos (`--ink`/`--surface`), chips secundarios (`.chip.soft` en salvia/terracota) y controles segmentados modernos.
- **Navegación y cromo:** cabecera y barra inferior móvil translúcidas (`backdrop-filter`) con indicador tipo píldora en el ícono activo; barra lateral de escritorio refinada con buscador estilo comando.
- **Pantalla Hoy & Collage botánico:** encabezado Hero editorial en tarjeta dedicada, ilustración `K.plant` redibujada en estilo *collage* orgánico de Isa Caparra, franja de días estilizada sin barra de scroll visible, 3 tarjetas métricas con los colores del PDF (salvia, mandarina y terracota), hábitos en tarjetas táctiles individuales, barra de hidratación e íconos por momento del día.
- **Pantallas secundarias y espaciado:** tarjetas `.rcard` con bordes superiores rotativos (eucalipto, mandarina, terracota), bloques `.toolbar-card` con separación garantizada (`>= 12px`) entre buscadores y filas de chips (corrigiendo el solapamiento en Cocina y Compras), cabeceras `.recipe-hero` en detalles y separadores editoriales en Ajustes.

---

## v2.0.0 — Qué cambió y cómo se trabaja ahora (15/11/2026)

Reescritura total hecha por Claude (orquestador Opus 5.5 + sesiones de investigación, auditoría, datos, app y QA). Documentos de respaldo en `rediseno-v2/`:
`ESPEC-V2.md` (contrato), `auditoria.md` (v1), `investigacion.md` (mercado), `DECISIONES.md` (cada decisión tomada), `QA.md` (pruebas y correcciones).

**Qué es:** un único HTML autónomo (`index.html` = `Detox-Primavera-App.html`, ~550 KB), JavaScript propio, **sin ninguna dependencia externa** (sin Vue, Tailwind, fuentes ni íconos remotos). Funciona sin internet.

**Funciones principales:** pantalla Hoy (día y fase, planta que crece, hábitos con «hoy no», agua, comidas con sugerencias que rotan y respetan alergias/fase, check-in de 10 segundos, «para mañana»), Cocina (105 recetas con ingredientes estructurados, escalado de porciones, modo cocina con temporizadores y pantalla siempre encendida, heladera sobre todas las recetas, plan semanal, batch cooking y remojos —arreglados—, métodos de cocción, recetas propias), Compras (desde el plan, por comercio, «ya tenés», compartir por WhatsApp), Guía (semáforo de 99 alimentos, SOS ampliado con escalera de constipación, herbario «Alimentos Medicina» con contraindicaciones según tus condiciones, info del taller), Progreso (constancia, racha con 2 días de gracia, logros medibles, gráficos, correlaciones honestas, diario, historial y comparación de ediciones, informe imprimible, reintroducción de alimentos), Programas (Detox de Primavera 21, Semana limpia 7, Reset 14, programas propios; repetir = nueva edición con historial), Ajustes (perfiles por persona, alergias/condiciones/constitución, tema, copia de seguridad, sincronización cifrada, recordatorios .ics para el calendario), búsqueda global.

**Datos:** se guardan en el navegador bajo `detox2_state`. La primera vez migra **automáticamente y sin borrar nada** los datos de la v1 (`detox_*`). Copia de seguridad: Ajustes → Copia de seguridad (exportar/importar JSON).
**Sincronización:** por persona, con código nuevo de 12 caracteres y cifrado de extremo a extremo (kvdb.io solo ve datos cifrados). Los códigos viejos `GUS-XXXX` siguen funcionando para traer los datos viejos; la app recomienda pasar a uno nuevo. Solo funciona desde la versión web (https).

**Cómo se modifica:**
```powershell
python v2/build.py        # arma index.html, Detox-Primavera-App.html, sw.js, manifest e íconos
node v2/tests/run.js      # pruebas (datos, lógica, migración, sync); deben dar 0 con error
```
Fuente: `v2/src/data/` (contenido de la guía), `v2/src/app/` (lógica y pantallas), `v2/src/styles/` (estética). La carpeta `app/` y `bundle.py` son la **v1 histórica** (no se usan para construir; `v2/tools/build-recipes.js` todavía lee `app/detox-data.js` como fuente de los textos de recetas).

**Pendiente de decisión de Gustavo:** publicar la v2 en GitHub Pages (unir la rama `rediseno-v2` a `main` y subir). Hasta entonces la web sigue mostrando la v1.

**Pendiente de confirmar con Isa:** cantidad de manzana del kimchi (la guía dice 3000 g; se usa 300 g con aviso).

---

## Historial v1 (referencia)

> **Líder Operativa v1:** Blair Vance (COO)  
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

- **`v1.4.2` (29/09/2026) — Shell & Core: Corrección Integral de Modo Claro en Versión Web (Escritorio):**
  - **Eliminación de Stuck Paint por Transición en `body`:** Se removió la clase `transition-colors duration-200` en la etiqueta `<body>` y contenedores clave, erradicando el bug de Chromium donde la interpolación de color se congelaba en el color oscuro (`stone-950`), dejando un fondo negro con recuadros blancos.
  - **Header & Navbar Desktop Unificados:** Se agrupó el topbar `<header>` y la barra de navegación de pestañas `<nav class="hidden md:block">` dentro de un único contenedor sticky coordinado (`sticky top-0 z-30`), eliminando el valor rígido `top-[57px]` que provocaba solapamientos y desincronizaciones de blur al scrollear en escritorio.
  - **Sincronización Reactiva Inmediata de Tema:** Se añadió `{ immediate: true }` al watcher de `isDarkMode` en `core.js` para asegurar que las clases en `<html>` y el estado reactivo de Vue coincidan desde el instante de montaje.
  - **Inicialización Robusta en `<head>`:** Sincronización del script temprano de prevención FOUC tanto con `localStorage` como con `document.cookie` y fallback explícito para evitar split-brain entre el tema del sistema operativo y las preferencias del usuario.

- **`v1.4.1` (29/09/2026) — Corrección Integral de Desbordes Horizontales Móviles y Visibilidad del Pie de Página:**
  - **Blindaje de Ancho en Contenedores (`min-w-0` & `max-w-100%`):** Se blindó la etiqueta `<main>` y cada una de las 6 secciones con clases de contención responsiva (`w-full min-w-0 max-w-full`) y en `styles.css` para evitar que elementos hijos con anchos intrínsecos desborden el layout flex y corten el margen derecho en pantallas táctiles de celulares.
  - **Contención del Carrusel de Días (Mi Día):** El carrusel de 22 botones diarios se encapsuló en un contenedor estricto con `overflow-hidden`, asegurando que el scroll horizontal táctil se mantenga confinado dentro de la tarjeta sin ensanchar el viewport general ni desbordar las tarjetas de hábitos y comidas.
  - **Grilla Táctil 2x2 en Switcher de Cocina (Recetas):** El menú segmentado de 4 botones (`Recetario`, `Mi Heladera`, `Batch Cooking`, `Remojos`) se rediseñó de una fila rígida con `min-w-[130px]` a una grilla ergonómica 2x2 en celulares y flex horizontal en escritorio, eliminando desbordes forzados en pantallas estrechas.
  - **Adaptación Responsiva en Compras y Herbolario:** Los filtros por comercio y la cabecera de llamadas de Google Meet se adaptaron para saltar de línea limpiamente en pantallas angostas.
  - **Visibilidad Completa del Pie de Página (Footer):** Se incorporó un margen inferior generoso (`pb-28 md:pb-8 pb-safe`) en el pie de página para compensar la barra de navegación inferior fija de celulares (`z-40`, ~90px). Esto permite desplazarse de manera natural hasta el fondo de la pantalla y visualizar la versión del sistema (`v1.4.1`) y el botón de reinicio sin que el scroll rebote ni quede tapado por la botonera.

- **`v1.4.0` (28/09/2026) — Módulo 2: Catálogo Culinario Exhaustivo:**
  - **Expansión a 73 Recetas Oficiales:** Integración del 100% de las recetas de la guía de Isabel Caparra y del documento preparatorio (de 11 iniciales a 73 preparaciones completas).
  - **10 Categorías Clínicas:** Clasificación estructurada en Almuerzos/Cenas (17), Sopas Clínicas (10), Dips/Untables (10), Desayunos/Meriendas (10), Aliños/Condimentos (8), Panificados (5), Fermentos/Pickles (5), Infusiones/Fitoterapia (4), Caldos (2) y Leches Vegetales (2).
  - **Filtros Ergonómicos en Interfaz:** Navegación por selector segmentado en `recetas.html` con etiquetas claras y descriptivas para las 10 categorías.
  - **Integración con Algoritmo de Rotación:** Distribución equilibrada de sopas, aliños e infusiones en los 4 momentos del día en `dia.js`.
  - **Alérgenos y Modo Cocina:** Cada receta cuenta con tiempos, métodos de cocción, ingredientes con cantidades exactas, pasos secuenciales, tips clínicos de Isa Caparra y alérgenos mapeados.

- **`v1.3.0` (28/09/2026) — Módulo 1: Tracker, Múltiples Comidas, Alergias & Rotación:**
  - **Múltiples Alimentos por Sección:** La estructura de comidas ahora admite listas completas de preparaciones por momento (desayuno, almuerzo, merienda, cena), con distinción entre recetas oficiales y comidas libres manuales, checkboxes individuales y eliminación.
  - **Buscador con Autocompletado Culinario:** Búsqueda reactiva por nombre e ingredientes con desplegable flotante, detección en tiempo real de alérgenos y registro rápido de comidas manuales.
  - **Perfil de Alergias e Intolerancias:** Selector ergonómico con alérgenos predeterminados (frutos secos, semillas, algas, gluten, soja, cítricos, apio, etc.) y campo libre. Exclusión automática de recetas comprometidas en las sugerencias y sincronización en la nube.
  - **Algoritmo de Rotación Nutricional:** Motor de sugerencias que prioriza recetas nunca probadas en el reto (`🌱 Aún no probada`) o consumidas hace más tiempo (`🔄 Rotación recomendada`), dinamizando la variedad en fases avanzadas.
  - **Historial Global Culinario:** Nueva subvista en Bitácora con balance de recetas oficiales probadas vs pendientes, cobertura porcentual de la guía y línea de tiempo detallada de ingestas.
  - **Bitácora — Deselección Ergonómica:** Corrección que permite desactivar tanto el nivel de energía (1-5) como el estado de digestión y asimilación tocando nuevamente sobre la opción ya activa (retorno a estado neutral).
  - *Backlog Pendiente:* Propagar el perfil de Alergias e Intolerancias a los módulos restantes (Módulo 2: Recetas y Heladera con badges de advertencia, Módulo 3: Lista de Compras, Módulo 4: Semáforo Nutricional).

- **`v1.2.1` (27/09/2026):**
  - **Arquitectura Modular Desacoplada:** División física del código en snippets HTML y composables JS bajo `app/modules/` para habilitar trabajo concurrente con subagentes sin conflictos.

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
