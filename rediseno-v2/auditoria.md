# Auditoría técnica y funcional — Detox de Primavera v1.4.2

> Auditoría de **solo lectura** hecha el 2026-11-15 sobre `app/` (fuente), los documentos del proyecto y los volcados `scratch/guia_dump.txt` / `scratch/recetas_extraidas.txt`. No se modificó ningún archivo existente, no se hizo commit ni se corrió `bundle.py`.
> Referencias en formato `archivo:línea` relativas a `app/` salvo que se indique otra cosa. «Verificado en vivo» = comprobado con el navegador integrado sobre la app publicada, sin vincular ningún código de sync ni escribir datos.
> Alcance: no se leyó `como-prepararse-para-el-detox.pdf` (no hay volcado); de ese PDF solo se conoce lo que resume `RESUMEN-OPERATIVO.md`.

---

## 0. Lo más importante (léelo primero)

**Funciones rotas hoy en producción (verificado en vivo)**

1. **«Batch Cooking» y «Remojos» se ven vacíos.** Las plantillas usan una variable `fridgeEngineData` que ningún módulo define (`modules/batch/batch.html:32`, `modules/remojos/remojos.html:21`; `heladera.js:86-101` no la devuelve). Vue avisa «Property "fridgeEngineData" was accessed during render but is not defined» y no se dibuja ninguna tarjeta. Aunque se definiera, **los nombres de campos tampoco coinciden** con los datos (ver §4.1). Son 2 de las 4 subvistas de «Menú & Recetario».
2. **La heladera solo conoce 11 de las 73 recetas** (`fridge-engine.js:815`, `recipesMapping`); 62 recetas nunca aparecen en «Recetas compatibles». Además 2 de los 16 «taps rápidos» apuntan a ids que no existen (`repollo_blanco_colorado`, `shoyu_moa`) y desaparecen en silencio, y los 7 chips de categoría no coinciden con las 19 categorías reales del catálogo.
3. **El detector de alérgenos da falsos positivos/negativos graves**: marca «Semillas» en todos los «Aliño…» (porque «alino» contiene «lino»), marca «Gluten» en el pan que dice «**sin** Gluten», «Algas» por la palabra «apagar» (contiene «agar»), «Frutos secos» por «nuez moscada». El campo `alergenos` que sí trae cada receta **no se usa** (§4.3).

**Riesgos de datos**

4. **La sincronización pisa datos locales**: el pull reemplaza el estado completo con lo que haya en la nube, no hay cola de reintentos si el push falla (sin señal en la verdulería) y la «protección» de 4 s solo se activa en 5 acciones raras (fecha de inicio/reinicios). Ediciones hechas offline o tecleadas justo antes de un pull se pierden (§2.4). **No existe protección de foco** en inputs/textarea (el pull de cada 45 s reemplaza el texto que se está escribiendo si llegó una versión de la nube).
5. **Un código por pareja = un único estado compartido.** No existe el concepto de perfil/persona: si Gustavo y Jime usan el mismo código comparten diario clínico, alergias, XP y racha (el texto del modal lo propone: `core/modals.html:335`; `ESTADO-DEL-PROYECTO.md` dice lo contrario: un código por persona).
6. **Privacidad**: bucket de kvdb fijo y público en el repo (`core.js:88`, repo público), códigos de 4 caracteres (~1 M de combinaciones), sin autenticación; el QR se genera enviando el enlace con el código a `api.qrserver.com` (`core.js:321-324`). Contenido sensible (síntomas, alergias, comidas).
7. **Cookies espejo de todo** (`core.js:16-27`): cada clave se guarda *también* como cookie (1 año). Puede inflar la cabecera de cada pedido a `*.github.io` (§4.7).

**Lógica de juego con huecos**: se puede ganar XP infinito (marcar/desmarcar la última misión suma +50 cada vez), las medallas no miden lo que dicen, la racha cambia según el día que se esté mirando (§1.4).

**Lo que sí funciona bien y hay que conservar**: bitácora de 4 vistas, comidas múltiples por momento con rotación, perfil de alergias, informe exportable, motor de scoring 80/20 con topes (el algoritmo está bien; falla la cobertura de datos), semáforo, SOS, compras por comercio con copia a WhatsApp.

**Contenido de la guía sin aprovechar**: toda la sección «Alimentos Medicina» (≈25 fichas con propiedades, naturaleza térmica, dosis y **contraindicaciones**), la lógica friolento/caluroso, el menú-modelo con frecuencias máximas, la tabla de cocción de granos y ~25 preparaciones del menú que no están como receta (§6).

---

## 1. Inventario completo de funciones

### 1.0 Estructura general

| Elemento | Qué hace | Dónde |
|---|---|---|
| Stack | Vue 3 (CDN `vue@3` sin versión fija) + Tailwind Play CDN + Lucide `@latest` (cargado, **sin uso**: 0 `data-lucide`) + canvas-confetti 1.9.3 + Google Fonts Inter. Sin build real: `bundle.py` concatena HTML y JS | `index.template.html:20,46,82,85,88`; `bundle.py` |
| Salidas | `index.html` y `Detox-Primavera-App.html` son idénticos byte a byte (484 400 B). `abrir_detox.bat` abre `app/index.html` desde disco (`file://`, origen distinto al de GitHub Pages) | raíz |
| Navegación | 6 pestañas (`activeTab`): `dia`, `recetas`, `compras`, `semaforo`, `sos`, `taller`. Escritorio: barra superior con las 6. Móvil: barra inferior de 5; «SOS & Guía» abre `sos` o `taller` y entre ambas se alterna con un conmutador segmentado dentro de cada vista. Persiste en `detox_active_tab` | `core/header.html:82-135`, `core/mobile-nav.html`, `core.js:50-52` |
| Cabecera fija | Logo (vuelve a Mi Día) + etiqueta de día («Día N • Hoy», «Previa • Inicia en Nd»); botón de sync (📲 sin vincular, ☁️+código vinculado, 🔄 sincronizando); racha 🔥Nd; XP (solo ≥sm); buscador; tema | `core/header.html:2-79` |
| Tema | Claro/oscuro con clase `dark`, persiste en `detox_dark_mode`; script anti-parpadeo en `<head>` lee localStorage y cookie; si no hay valor sigue `prefers-color-scheme` | `index.template.html:23-43`, `core.js:44-59` |
| Toast | Mensaje flotante 3,5 s (`triggerToast`), con `animate-bounce` | `core.js:62-70`, `core/modals.html:399-404` |
| Confeti | `canvas-confetti` (80 partículas) al completar día, medalla, receta y vincular | `core.js:72-81` |
| Pie | «v1.4.2 • Material de referencia Septiembre 2026» + «Reiniciar Progreso de la App» | `core/footer.html` |
| Modales | Receta (bottom-sheet móvil), Modo Cocina (pantalla completa), Buscador global, Sincronización, Exportar informe | `core/modals.html` |
| Atajos | `Cmd/Ctrl+K` abre/cierra buscador; `Esc` cierra buscador y receta (no cierra sync, exportar ni modo cocina) | `app.js:254-263` |

### 1.1 Mi Día (`modules/dia/dia.html`, `dia.js`)

Orden de tarjetas: (1) estado del reto/fecha, (2) cita diaria, (3) línea de tiempo + selector de monodieta, (4) banner de fase, (5) misiones, (6) alergias, (7) comidas, (8) bitácora (4 vistas), (9) medallas.

**(1) Fecha de inicio** (`dia.js:106-270`, `dia.html:7-225`)
- Sin fecha: «Empezar Hoy (Día 1)» (`startChallengeToday`, fija hoy y confetti) o «Elegir otra fecha» (input `date` + atajos Hoy/Mañana/Próx. Lunes + «Confirmar fecha»). El desacople `tempStartDate`/`startDate` evita calcular con fechas a medio tipear.
- Con fecha: badge Programado ⏳ / Reto en Curso 🔥 / Completado 🏆, «Faltan N días», «Hoy es tu Día N de 21», botón «Ir a Hoy», «Cancelar inicio» (vuelve a foja cero sin tocar hábitos), «Fecha» (editar), «Borrar todo y empezar de cero».
- **Regla** `challengeInfo` (`dia.js:106-152`): `diffDays = round((hoy00:00 − inicio00:00)/86400000)`. `<0` → futuro (`currentDay 0`, `daysUntil`); `0..20` → en curso, `currentDay = diffDays+1`; `>20` → finalizado, `currentDay 21`. Al montar, `selectedDay` salta al día de hoy (o 0 si es futuro) (`app.js:231-237`).
- `isValidDateString`: formato `YYYY-MM-DD`, año 2024–2035, mes 1–12, día 1–31 (no valida por mes: acepta 2026-02-31) (`dia.js:3-15`).
- Sin fecha el usuario puede explorar y tildar libremente cualquier día (no hay bloqueo de días futuros/pasados).

**(2) Cita diaria** (`dia.js:272-286`): una por `selectedDay` (0..21, 22 citas) con tema, frase, autor, contexto y botón copiar (`“frase” — autor (tema)`). Fallback a la primera.

**(3) Línea de tiempo** (`dia.html:247-311`): carrusel con snap: «Paso 0 · Previa» + días 1–21. Marca HOY, punto verde si el día tiene las 6 misiones, borde verde en d≤3 solo si `startMode==='monodieta3'`. Progreso global = `round(díasCompletos/21*100)`. Selector «Monodieta inicial»: `monodieta3` (3 días, recomendado), `monodieta2`, `monodieta1`, `directo` (0). Persiste en `detox_start_mode`.

**(4) Fases** (`dia.js:1009-1038`, `dia.html:313-348`) — depende solo de `selectedDay` y `startMode`, no de la fecha real:

| Condición | Fase | Texto |
|---|---|---|
| `d === 0` | «Fase 0: Preparación previa» | bajar cafeína/mateína a la mitad cada 2 días |
| `1 ≤ d ≤ N` (N = 3/2/1/0 según modo) | «Fase 1: Monodieta Purificadora (Día d de N)» | solo manzana y «arroz integral» |
| resto | «Fase 2: Menú Depurativo General (Día d de 21)» | crucíferas, yamaní, mung, quinoa, fermentos, caldos |

Atajos: en monodieta «Ver receta de Nituke», en general «Ver Caldo Détox» (ponen `recipeSearch`, no cambian de subvista).

**(5) Misiones / hábitos** (`dia.js:1040-1072`, datos `detox-data.js:28-47`): 6 misiones por día (`limon`, `masticacion`, `infusion`, `no_estimulantes`, `hidratacion`, `plato_verde`), clic en la tarjeta o en el checkbox. Estado en `completedMissions["day_N"][id]=bool`.
- **XP**: `xpPerMission = 15` y `xpPerDayComplete = 50` (`detox-data.js:29-30`; fallback del código 10/50, `dia.js:1048-1049`). Marcar: `+15`; desmarcar: `−15` (mín. 0). Si al marcar quedan las 6 → `+50` bonus + confeti. **El bonus no se revierte al desmarcar** → marcar/desmarcar la última misión suma +50 cada ciclo.
- % del día = `round(hechas/6*100)`; banner de felicitación y «Pasar al Día N+1».
- Día completo = las 6 hechas. `totalDaysCompleted` cuenta de d=1..21 (el día 0 da XP pero no cuenta).

**Racha** (`dia.js:993-1007`): desde `selectedDay` hacia atrás cuenta días completos; el día seleccionado, si está incompleto, **no corta** la racha (se salta); cualquier otro día incompleto corta. Depende del día que se esté mirando, no de la fecha de hoy. Se muestra en cabecera y en el informe.

**Medallas** (`dia.js:1074-1094`, datos `detox-data.js:36-47`; ver tabla en §3.2). Se evalúan solo al tildar una misión (`checkBadges()` en `toggleMission`). Al desbloquear: `+xp` de la medalla, confeti y toast. Nunca se revocan. El ícono de la tarjeta es un mapa de emojis fijo por `id` en el HTML (`dia.html:1210-1218`); los campos `icon` (lucide) del dato no se usan.

**(6) Alergias** (`dia.js:346-457`, `dia.html:421-538`): píldoras activas, panel «Gestionar» con 10 etiquetas rápidas (`defaultAllergies`: Frutos secos, Semillas, Algas, Gluten / Trigo, Soja / Shoyu, Cítricos, Apio, Sésamo, Frutillas, Legumbres) + campo libre. Detección por palabras clave (`ALLERGEN_KEYWORDS`, 17 grupos) sobre título + ingredientes + tip, sin acentos (`getRecipeAllergens`, `dia.js:380-421`); alérgeno libre sin grupo busca el texto literal. Efectos: excluye de sugerencias y marca «⚠️ Contiene …» en el desplegable. **No** se propaga al recetario, heladera, compras ni semáforo (pendiente en `ESTADO-DEL-PROYECTO.md`).

**(7) Comidas por momento** (`dia.js:459-717`, `dia.html:540-773`): 4 momentos (`desayuno`, `almuerzo`, `merienda`, `cena`; datos `journalOptions.mealSlots`). Por momento:
- lista de ítems (`items[]`) con checkbox «consumido», etiqueta 📖 Receta / Libre, borrar; «Marcar todo ✓ / Desmarcar» (`toggleSlotAllDone`); contador «x/y consumidos». El slot está «hecho» si hay ítems y todos `done`.
- **Autocompletado**: input busca en título, ingredientes y categoría de las 73 recetas (sin acentos) y muestra todas las coincidencias (sin tope) con aviso de alérgenos; última fila «➕ Registrar “texto” como comida libre»; Enter o botón «Agregar» también agrega libre.
- **Sugerencias con rotación** (`getMealSuggestions`, `dia.js:722-848`): excluye recetas con alérgenos del usuario; cuenta por receta cuántas veces se marcó consumida y en qué día fue la última (cruzando por `recipeId` o por título normalizado, días 1–21); candidatas según fase/momento:
  - monodieta (`selectedDay ≤ N`): `nituke-manzana`, `caldo-detox`, `galletas-yamani` + todas las de `desayunos` y `caldos` (**incluye licuados, hot cakes, pudding**, contradice «solo manzana y arroz»);
  - general: desayuno = desayunos+leches+panificados+dips+infusiones; almuerzo = almuerzos+sopas+caldos+dips+alinos+panificados+fermentos; merienda = desayunos+leches+dips+panificados+infusiones; cena = sopas+caldos+almuerzos+dips+alinos+fermentos;
  - si hay <3 candidatas, rellena con cualquier receta segura; orden por menos veces consumida y luego por día de último consumo más antiguo; muestra las 4 primeras con insignia «🌱 Aún no probada» (0), «🔄 Rotación recomendada» (1), «🔄 Probada N veces» (>1).
- Normalización de formatos viejos (`normalizeSlot`, `dia.js:462-514`): acepta slot como array, `{text,done}` (legacy v1.1/1.2) o `{text,done,items}`.

**(8) Bitácora** (`dia.js:288-343`, `dia.html:776-1185`) — son **4 vistas**, no 3:
- **Día**: energía 1–5 (5 niveles con emoji), digestión (4 estados), síntomas (8 opciones; «Despejado / Cero síntomas» es excluyente, comparado por string literal en `dia.js:332`), notas libres con autoguardado por tecla. Tocar de nuevo la opción activa la deselecciona. Cada día guarda `updatedAt`.
- **Semana**: 7 días de la semana en curso (1–7, 8–14, 15–21) con energía, digestión, nº de señales, nota truncada y «x/4 comidas» (cuenta slots `done`); tocar un día lo abre.
- **Comidas** («Cobertura culinaria»): % de recetas oficiales probadas = `round(distintas/73*100)`, probadas, pendientes, total de ingestas, barra y línea de tiempo cronológica de ingestas consumidas (solo `done`, días 1–21).
- **Global**: los 21 días apilados (diario + comidas) con acceso a «Editar día».
- Botón **Exportar** → modal con vista previa del informe de texto plano (`generateReportText`, `dia.js:1100-1180`): cabecera con fecha, día actual, inicio, XP, racha, alergias, cobertura; y por día 1–21: energía, digestión, síntomas, notas y comidas con `[✓]/[ ]` y «(Receta)». Acciones: «Copiar Texto Formateado» y «Imprimir / Guardar PDF» (= `window.print()` de **toda** la página; ver §4.6). El pie del informe dice «WebApp v1.2.1» (desactualizado).

### 1.2 Menú & Recetario (`modules/recetas/`, `heladera/`, `batch/`, `remojos/`)

Conmutador de 4 subvistas (`recipeSubView`, persiste en `detox_recipe_subview`): Recetario, Mi Heladera (+contador), Batch Cooking, Remojos.

**Recetario** (`recetas.js`, `recetas.html`): 73 recetas; búsqueda en título, ingredientes y método (`toLowerCase().includes`, **sensible a tildes**: «limon» no encuentra «limón»); filtros por 10 categorías + «todas» (`almuerzos`=Platos & Guisos, `sopas`, `caldos`, `desayunos`=Desayunos & Meriendas, `dips`, `alinos`, `panificados`, `fermentos`, `leches`, `infusiones`); 4 tarjetas «métodos de cocción» (`data.cookingMethods`); cada tarjeta muestra categoría, tiempo, método, 3 ingredientes + «+N más»; botones «Ver Detalles» (modal con ingredientes, pasos numerados, tip del taller) y «Cocinar».

**Modo Cocina** (`recetas.js:32-57`, `core/modals.html:59-113`): pantalla completa, un paso a la vez, barra de progreso, Anterior/Siguiente, tip solo en el paso 1, confeti y toast al terminar. Sin temporizadores, sin lista de ingredientes, sin escalado de porciones, sin `wakeLock` (la pantalla del celular se apaga).

**Heladera inteligente** (`heladera.js`, `heladera.html`, motor `fridge-engine.js:1929-2006`): el usuario marca ingredientes (54 del catálogo) con taps rápidos (14 válidos de 16), buscador (nombre y sinónimos), chips de categoría y atajo «Despensa básica» (aceite_oliva, sal_marina, limon, agua_filtro). Persiste en `detox_fridge_selected` y se sincroniza.
- **Scoring** (`matchFridge`): para cada una de las **11** recetas mapeadas: `principales/condimentos` = solo los `esencial !== false`; `ratioP = presentes/totalP` (1 si no hay), `ratioC` idem; `raw = ratioP·80 + ratioC·20` (config `principalesWeight 80`, `condimentosWeight 20`, `basicosWeight 0`); **topes**: si `countP === 0` → `score = min(raw, 20)`; si `ratioP < 0.5` → `min(raw, 40)`. Tier: `lista` si `score === 100`; `casi_lista` si `score ≥ 70`; si no `incompleta`. `canCook` = sin faltantes (base ni condimento). Resultado ordenado por score descendente, con faltantes y cantidades.
- UI: pestañas Todas/Listas/Casi listas, barra de %, «Te faltan de base», «Faltan de condimento», «Cocinar Ya» (abre Modo Cocina) o «Ver Receta», y botón «🛒 Faltantes» que **solo muestra un toast** (`heladera.js:76-84`; el título dice «Anotar faltantes en la lista»).

**Batch Cooking** (`batch.js`, `batch.html`): pensado como planificador semanal + 6 bases (arroz yamaní, mung con kombu, caldo concentrado, verduras vapor/nituke, frutos secos activados, fermentos). `weeklyPlan` (`detox_weekly_plan`) existe y se sincroniza pero **ninguna pantalla lo edita** (`toggleRecipeInBatch` no está conectado); sin plan usa por defecto 5 recetas (`batch.js:18-20`). Calcula «tiempo ahorrado» sumando `ahorroTiempoMinutosSemanal` de las bases que usan esas recetas. **Hoy no se ve nada** (§0.1).

**Remojos** (`remojos.js`, `remojos.html`): lista reglas de activación (almendras, cajú, mung, arroz, quinua, lino, chía, sésamo, kéfir, chucrut, masa madre, mijo, aduki, girasol) filtradas por las recetas del plan (`getSoakingScheduleForRecipes`, orden por anticipación mayor a menor). Tarjeta: tiempo, temperatura, método, aviso «DESCARTAR / NO DESCARTAR EL AGUA», fundamento. **Hoy no se ve nada** (§0.1). El título dice «11 reglas» y hay 14.

### 1.3 Compras, Semáforo, SOS, Taller

**Compras** (`compras.js`, `compras.html`): 50 ítems de `shoppingList`, filtro por comercio (6 chips fijos en el HTML: Verdulería, Dietética, Herboristería, Panadería, Farmacia, Pescadería — faltan «Granja» y «Carnicería pastura», 2 ítems solo visibles en «Todos»), casilla «Ocultar ya comprados», marca ★ Esencial (27 ítems), barra de % comprado y contadores. Estado `shoppingChecked = {id: bool}` (`detox_shopping_checked`, sincroniza). «Copiar pendientes a WhatsApp» arma texto con `*MAYÚSCULAS*` por comercio y viñetas `• item (cant)` y lo copia (con fallback `execCommand`). La **insignia de pendientes** de la barra de navegación muestra `total − hechos` (50 al arrancar). `completed` cuenta todas las claves verdaderas del mapa, aun si el id ya no existe en la lista (`compras.js:22-29`).

**Semáforo «¿Puedo comer esto?»** (`semaforo.js`): 37 alimentos, buscador (nombre, categoría, descripción; sensible a tildes) y 4 filtros (Todos, 🟢 Permitidos 16, 🟡 Moderación 11, 🔴 Prohibidos 10). La etiqueta de la tarjeta roja dice «EXCLUIDO», el filtro «Prohibidos» y el buscador global «RESTRINGIDO» (tres palabras para un mismo estado).

**Botiquín SOS** (`sos.html`): 7 protocolos (síntoma, causa, pasos numerados) + aviso «Pauta médica». Sin buscador propio ni filtro.

**Herbolario & Taller** (`herbolario.html`, datos `info`): botón a Meet, 2 fechas de encuentros (28/09 y 14/10/2026 — **ya pasadas**), 2 videos de YouTube, enlace al grupo de WhatsApp, contacto de Isa (WhatsApp y email) y 4 proveedores. **No tiene herbolario** (ninguna ficha de hierbas, a pesar del nombre y de lo que dice `ESTADO-DEL-PROYECTO.md`).

### 1.4 Buscador global Cmd+K (`app.js:114-185`, `core/modals.html:115-160`)
Mínimo 2 caracteres, máximo 10 resultados, busca (`toLowerCase().includes`, sensible a tildes) en: recetas (título + ingredientes; abre el modal), semáforo (nombre + desc; filtra la pestaña), SOS (síntoma, causa, pasos; **solo cambia de pestaña, no lleva al protocolo**) y compras (filtra por comercio). **No busca** en cita, misiones, productores, herbolario ni bitácora. El input tiene `autofocus` pero no se enfoca al abrirse (el `ref="globalInput"` no se usa).

### 1.5 Sincronización (UI en `core/modals.html:162-343`, lógica en `core.js:87-376`)
Ver §2.4. Funciones de usuario: «Activar sincronización» (genera `GUS-XXXX`), ingresar código existente (campo con enter), copiar enlace, copiar código, enviar por WhatsApp, compartir nativo (`navigator.share`), QR, «Forzar sincronización», «Desvincular». Vinculación directa por URL `?sync=CÓDIGO` o `#sync=CÓDIGO` (muestra «¡Dispositivo vinculado!» + confeti).

### 1.6 Textos con nombres propios fijos
«Jime» aparece en `core/modals.html:229,293,335`; Isa/Isabel Caparra, su WhatsApp, email, link de Meet y de grupo están en `detox-data.js:5-27`. La app es de uso personal; para v2 conviene separar «datos del taller» de «datos de la pareja».

---

## 2. Persistencia y sincronización — esquema exacto

### 2.1 Capa de almacenamiento (`core.js:2-40`, `safeStorage`)
- `get(key)`: lee `localStorage`; si no hay, lee la **cookie** del mismo nombre (decodeURIComponent).
- `set(key,val)`: escribe en `localStorage` **y** en `document.cookie = key=<encodeURIComponent(val)>;max-age=31536000;path=/;SameSite=Lax` (sin `Secure`).
- `remove(key)`: borra ambas.
- Todo se guarda como **string**; los objetos se serializan con `JSON.stringify` y se leen con `JSON.parse(... || 'default')` **sin try/catch** (un JSON corrupto rompe el arranque del módulo; p. ej. `dia.js:36-47`, `heladera.js:3`, `compras.js:3`, `batch.js:3`).
- Los watchers de cada módulo escriben en cada cambio (`{deep:true}`); además algunas funciones escriben de forma redundante antes del watcher.
- **Origen**: la versión publicada vive en `https://urrozgustavo-collab.github.io` (el origen es el *usuario* de GitHub, compartido con cualquier otro proyecto Pages suyo). La copia local (`abrir_detox.bat` → `file://`) tiene un localStorage **distinto**: los datos de uno no se ven en el otro (solo vía sync).

### 2.2 Claves `detox_*` (ejemplos **construidos a partir del código**, no volcados de un usuario real)

| Clave | Tipo guardado | Forma | Ejemplo | ¿Va en sync? |
|---|---|---|---|---|
| `detox_start_date` | string | `YYYY-MM-DD` válido (2024–2035); ausente = sin iniciar | `2026-09-28` | sí (`startDate`) |
| `detox_selected_day` | string entero | `0..21`; **día en pantalla**, no «día de hoy» | `"7"` | sí (`selectedDay`), pero solo se aplica si no hay `startDate` o es sync forzado (`app.js:87`) |
| `detox_start_mode` | string | `monodieta3` \| `monodieta2` \| `monodieta1` \| `directo` (default `monodieta3`) | `monodieta3` | sí (`startMode`) |
| `detox_completed_missions` | JSON objeto | `{ "day_<N>": { "<idMisión>": bool } }`, N=0..21; ids: `limon, masticacion, infusion, no_estimulantes, hidratacion, plato_verde` | `{"day_1":{"limon":true,"masticacion":true,"infusion":true,"no_estimulantes":true,"hidratacion":true,"plato_verde":true},"day_2":{"limon":true,"plato_verde":false}}` | sí |
| `detox_xp` | string entero | acumulado; se guarda aparte (no se deriva) | `"430"` | sí |
| `detox_unlocked_badges` | JSON array | ids de medallas: `inicio, monodieta, adios_cafeina, semana1, maestro_nituke, detox_champion` | `["inicio","adios_cafeina"]` | sí |
| `detox_daily_journal` | JSON objeto | `{ "dia_<N>": { "energy": 1..5\|null, "digestion": "liviano"\|"gases"\|"lenta"\|"optima"\|null, "symptoms": [string], "notes": string, "updatedAt": epoch_ms } }`. `energy` puede venir número o string en datos viejos (el código compara con `Number()`) | `{"dia_3":{"energy":4,"digestion":"optima","symptoms":["Sed intensa","Cefalea leve"],"notes":"Dormí bien","updatedAt":1790611200000}}` | sí |
| `detox_daily_meals` | JSON objeto | `{ "dia_<N>": { "desayuno"\|"almuerzo"\|"merienda"\|"cena": Slot } }`. **Slot** vigente: `{ "text": "a, b", "done": bool, "items": [ { "id", "name", "isRecipe": bool, "recipeId": string\|null, "done": bool, "timestamp": epoch_ms } ] }`. **Formatos legados que hay que tolerar**: slot como *array* de ítems (ítem con `text` en vez de `name`) y slot `{ "text", "done" }` sin `items` | `{"dia_3":{"desayuno":{"text":"Nituke de Manzana (Desayuno / Merienda)","done":true,"items":[{"id":"meal_1790611200000_ab3cd","name":"Nituke de Manzana (Desayuno / Merienda)","isRecipe":true,"recipeId":"nituke-manzana","done":true,"timestamp":1790611200000}]},"cena":{"text":"sopa de la abuela","done":false}}}` | sí |
| `detox_user_allergies` | JSON array | **nombres de visualización** (no ids): de la lista rápida o texto libre | `["Frutos secos","Gluten / Trigo","palta"]` | sí |
| `detox_shopping_checked` | JSON objeto | `{ "<idÍtem>": bool }`, ids `v1..v19, d1..d15, h1..h7, p1..p2, s1..s4, pr1..pr3` | `{"v1":true,"v2":true,"d4":false}` | sí |
| `detox_fridge_selected` | JSON array | ids del catálogo de la heladera (puede contener ids inexistentes como `agua_filtro`) | `["manzana","arroz_yamani","aceite_oliva","agua_filtro"]` | sí |
| `detox_weekly_plan` | JSON objeto | solo se usa la clave `"1"`: `{ "1": { "desayuno"\|"almuerzo"\|"cena": recipeId } }`; sin UI que lo llene | `{"1":{"almuerzo":"bowl-yamani-cruciferas","cena":"caldo-detox"}}` | sí |
| `detox_sync_key` | string | mayúsculas `[A-Z0-9_-]`; generado `GUS-` + 4 de `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` | `GUS-7Q4K` | no (es el vínculo) |
| `detox_dark_mode` | string | `"true"`/`"false"` (ausente = sistema) | `true` | no |
| `detox_active_tab` | string | `dia\|recetas\|compras\|semaforo\|sos\|taller` | `recetas` | no |
| `detox_recipe_subview` | string | `catalogo\|heladera\|batch\|remojos` | `catalogo` | no |
| `detox_streak` | — | **obsoleta**: solo se intenta borrar (`dia.js:257`); la racha se calcula | — | — |

Notas para la migración:
- Convivencia de prefijos de día: misiones `day_N`, diario/comidas `dia_N`. Día 0 («Previa») existe en misiones y diario pero **no entra en informe, historial ni % global** (bucles 1..21).
- Claves existentes solo si el usuario cambió algo (los watchers no son `immediate`): un perfil recién abierto puede tener solo `detox_dark_mode`/`detox_active_tab`.
- El usuario puede tener los datos **en cookie y no en localStorage** (si localStorage falló); la lectura prioriza localStorage.
- Los ids de recetas (`recipeId`) y de ítems de compras deben conservarse; la v2 debe poder resolver también ítems libres cuyo `name` coincide con un título (la app cruza por `recipeId` **o** por título normalizado, `dia.js:739-742, 917-920`).
- `xp`, `unlockedBadges` y `streak` son derivables de `completedMissions`; conviene recalcular y comparar en la migración (el XP almacenado puede estar inflado por el bug de bonus).

### 2.3 Payload de sync en kvdb.io
- **Endpoint**: `https://kvdb.io/EE7impjfrWvHaAhuDDuBvU/<CÓDIGO>` (`core.js:88-89`; bucket `EE7impjfrWvHaAhuDDuBvU` en el código público; **sin** token de autenticación).
- **Escritura**: `POST` con `Content-Type: text/plain` y cuerpo JSON (`core.js:167-171`). **Lectura**: `GET ...?_t=<Date.now()>` (anti-caché). `404` = clave nueva.
- **Cuerpo** (`core.js:161-164` + `app.js:65-80`):
```json
{
  "version": 1,
  "updatedAt": 1790611200000,
  "startDate": "2026-09-28",
  "selectedDay": 7,
  "startMode": "monodieta3",
  "completedMissions": { "day_1": { "limon": true } },
  "shoppingChecked": { "v1": true },
  "dailyJournal": { "dia_3": { "energy": 4, "digestion": "optima", "symptoms": [], "notes": "", "updatedAt": 1790611200000 } },
  "dailyMeals": { "dia_3": { "desayuno": { "text": "", "done": false, "items": [] } } },
  "userAllergies": ["Frutos secos"],
  "fridgeSelected": ["manzana"],
  "weeklyPlan": { "1": { "almuerzo": "caldo-detox" } },
  "streakDays": 3,
  "xp": 430,
  "unlockedBadges": ["inicio"]
}
```
  `version` **nunca se valida** al leer; `streakDays` se envía pero **no se aplica** (es derivado); `updatedAt` es `Date.now()` del dispositivo que empujó.
- **Aplicación al leer** (`app.js:81-111`): cada campo presente reemplaza el valor local completo (sin fusionar); `selectedDay` solo si no hay `startDate` o si es forzado; `startDate` inválida → `null`. Luego regraba el estado local.

### 2.4 Lógica push / pull — comportamiento real y fallas
- **Push** (`core.js:151-191`): `syncStatus='syncing'`; no inmediato → `setTimeout(700 ms)` (anti-rebote) **salvo que `isPulling` sea verdadero, en cuyo caso se descarta sin reprogramar** (línea 188). Inmediato (`pushToCloud(true)`) en: cambiar/cancelar fecha, reinicios, abrir el modal de sync, y 404 forzado. Si falla (`!res.ok` o excepción) → `syncStatus='error'` y **no hay reintento ni cola**.
- **Pull** (`core.js:193-238`): al montar (si hay código), en `focus` de ventana, en `visibilitychange→visible` y cada **45 s** si la pestaña está visible (`app.js:240-252`); manual con «Forzar sincronización» y al vincular (forzado). Se omite si `!force && now − lastLocalMutationTime < 4000`. Si `!force && cloud.updatedAt < lastLocalMutationTime` se descarta. `isPulling` se libera 400 ms después.
- **«Protección» real**: `lastLocalMutationTime` solo se actualiza con `recordMutation()`, y solo se llama en 5 lugares: iniciar hoy, fijar fecha, cancelar inicio, reiniciar y reiniciar todo (`dia.js:191,204,224,243`; `app.js:189`). **Tildar misiones, escribir notas, marcar comidas o compras no la activan.**
- **No existe «protección de foco»** (ningún `document.activeElement` en el código): un pull que aplica datos más viejos mientras se escribe una nota reemplaza `dailyJournal` y el `<textarea :value>` se re-pinta.
- Consecuencias:
  1. **Edición offline perdida**: sin señal el push falla (`error`); al recuperar foco el pull baja la versión vieja de la nube, `updatedAt(nube) ≥ 0` → se aplica → se pisa lo local.
  2. **Último que escribe gana, con estado completo**: dos dispositivos que modifican campos distintos (compras vs bitácora) se pisan entre sí porque cada push envía todo el objeto.
  3. Cada pull que aplica dispara los watchers (`deep`), que llaman `pushToCloud()`; el «anti-bucle» es solo `isPulling` + 400 ms, lo que además descarta ediciones legítimas hechas en esa ventana.
  4. Sin detección de colisión al crear código (`pairWithKey(..., true)` hace push sin comprobar si la clave ya existe: sobrescribe datos ajenos si coincide).
- **Seguridad del vínculo**: 4 caracteres de un alfabeto de 32 → 32⁴ ≈ 1,05 M de claves, prefijo `GUS-` conocido; el bucket es público y sin credenciales. Quien lea el JS puede intentar leer/escribir claves ajenas. (No se probó contra datos reales; ver §5.)
- **Enlaces/URL**: el código queda en la barra de direcciones (`?sync=`), se reescribe con `history.replaceState` (`core.js:113-121,258-264`), se comparte por WhatsApp (`wa.me`) y se envía al generador de QR de un tercero.
- **Tamaño**: el JSON crece con 21 días × 4 momentos × ítems + notas; no se midió el límite de valor de kvdb (verificar antes de reutilizarlo).
- Para v2: la migración debería poder **leer una vez** el valor de kvdb del usuario (por su código) como respaldo y luego dejar de depender del servicio.

---

## 3. Estructura de datos

### 3.1 `DETOX_DATA` (`detox-data.js`, 2 490 líneas, `window.DETOX_DATA`)

| Clave top-level | Línea | Tipo / cantidad | Forma de cada entrada |
|---|---|---|---|
| `info` | 5 | objeto | `title, guia, contactoEmail, contactoWhatsApp, grupoWhatsAppUrl, meetUrl, meetFechas[2] {fecha,hora,motivo}, videos[2] {id,titulo,url}, productores[4] {nombre,tel,nota,ig?}` |
| `gamification` | 28 | objeto | `xpPerMission:15, xpPerDayComplete:50, dailyMissions[6], badges[6]` |
| `cookingMethods` | 49 | 4 | `{id, nombre, desc, pasos[]}` — `nituke`, `vapor`, `salteado_agua`, `legumbres_digestivas` |
| `recipes` | 97 | **73** | `{id, titulo, categoria, tiempo (texto libre), metodo (texto libre), ingredientes[string], pasos[string], tip, alergenos[string]}` |
| `foodTrafficLight` | 2042 | **37** | `{nombre, estado: green\|yellow\|red, cat, desc}` |
| `sosProtocols` | 2087 | **7** | `{sintoma, icono, causa, pasos[string con «1. » incluido]}` |
| `shoppingList` | 2170 | **50** | `{id, item, cat, cant, esencial}` |
| `dailyQuotes` | 2233 | **22** (día 0..21) | `{dia, fase, tema, frase, autor, contexto}` |
| `journalOptions` | 2412 | objeto | `energyLevels[5] {id,label,icon,desc}`, `digestionStates[4] {id,label,icon}`, `commonSymptoms[8] (strings)`, `mealSlots[4] {id,label,icon}` |

Ejemplos reales:
- Misión: `{"id":"limon","text":"Agua tibia con 1/2 limón en ayunas","icon":"citrus","tip":"Si sos friolento, agregale pizca de jengibre."}`; `icon` no se usa.
- Medalla: `{"id":"semana1","title":"Semana Impecable","desc":"Completaste los primeros 7 días de detox","icon":"flame","requiredDays":7,"xp":200}`
- Semáforo: `{"nombre":"Café de cualquier tipo","estado":"red","cat":"Estimulantes","desc":"Sobrecarga la fase 1 hepática, …"}`
- SOS: `{"sintoma":"Acidez / Reflujo gástrico","icono":"flame","causa":"…","pasos":["1. Beber infusión templada …", "…"]}`
- Compra: `{"id":"v1","item":"Manzanas rojas o verdes (agroecológicas)","cat":"Verdulería","cant":"3 a 5 kg","esencial":true}`
- Receta: `{"id":"caldo-detox","titulo":"Caldo Détox Alcalinizante","categoria":"caldos","tiempo":"35 min","metodo":"Hervido suave tapado","ingredientes":["4 pencas de apio cortadas", …],"pasos":[…],"tip":"…","alergenos":["apio"]}`

**Recetas por categoría (73)**: almuerzos 17, desayunos 10, dips 10, sopas 10, alinos 8, panificados 5, fermentos 5, infusiones 4, caldos 2, leches 2. Sin ids ni títulos duplicados. `alergenos` presente en las 73 (51 con al menos un valor): `apio 9, citricos 26, frutos_secos 17, gluten 2, soja 8, sesamo 2` (no se usa).

**Semáforo**: 16 verdes, 11 amarillos, 10 rojos. **SOS (7)**: constipación; flojera/diarrea; frío corporal; dolor de cabeza; debilidad extrema; acidez/reflujo; mareos/hipotensión. **Compras por comercio**: Verdulería 19, Dietética 16, Herboristería 7, Farmacia 3, Panadería 2, Pescadería 1, Granja 1, «Carnicería pastura» 1; 27 esenciales. **Bitácora**: energía `1 Baja/En crisis · 2 Tranquila · 3 Estable · 4 Buena · 5 Radiante`; digestión `liviano, gases, lenta, optima`; síntomas `Cefalea leve, Lengua saburral, Sed intensa, Hambre emocional, Dolor muscular, Frío en extremidades, Náuseas leves, Despejado / Cero síntomas`.

### 3.2 Reglas de negocio — tablas

**Medallas** (`dia.js:1079-1084`; el texto visible dice «Requiere día N» con `requiredDays`):

| id | Título | `requiredDays` / XP | Condición **real** del código | Desajuste con la descripción |
|---|---|---|---|---|
| `inicio` | Primer Paso | 1 / 50 | `totalDaysCompleted ≥ 1` | cualquier día completo, no «Día 1» |
| `monodieta` | Purificación Inicial | 3 / 100 | `selectedDay > 3 && totalDaysCompleted ≥ 3` | no mira `startMode` ni que fueran los días de monodieta; «arroz integral» vs yamaní |
| `adios_cafeina` | Libre de Estimulantes | 3 / 100 | `streakDays ≥ 3` | no mira la misión `no_estimulantes` |
| `semana1` | Semana Impecable | 7 / 200 | `totalDaysCompleted ≥ 7` | no exige que sean los primeros 7 ni consecutivos |
| `maestro_nituke` | Chef Consciente | 14 / 300 | `totalDaysCompleted ≥ 14` | nada que ver con nituke/cocina |
| `detox_champion` | Renacimiento de Primavera | 21 / 500 | `totalDaysCompleted ≥ 21` | — |

Total posible de XP: misiones 21×(6×15+50)=2 940 + medallas 1 250 = 4 190 (más el día 0).

**Citas — fases etiquetadas** (`dailyQuotes[].fase`): Previa (0), «Fase 1» días 1–7, «Fase 2» días 8–14, «Fase 3» días 15–20, «Graduación» 21 → **no coincide** con las fases de la lógica (monodieta N días / general).

### 3.3 `fridge-engine.js` (2 070 líneas)
Define `FRIDGE_AND_PREP_DATA` y expone `window.FRIDGE_AND_PREP_DATA` y `window.DetoxFridgeEngine = { data, matchFridge, getBatchPlanForRecipes, getSoakingScheduleForRecipes }` (`fridge-engine.js:2052-2060`).

| Clave | Línea | Cantidad | Forma |
|---|---|---|---|
| `meta` | 6 | — | `{nombre, proyecto, version:"1.2.0", actualizado, autor}` |
| `scoringConfig` | 13 | — | `{principalesWeight:80, condimentosWeight:20, basicosWeight:0, zeroPrincipalesMaxScore:20, underHalfPrincipalesMaxScore:40, formula, businessRules[7]}` |
| `ingredientsCatalog` | 30 | **54** (29 `principal`, 23 `condimento`, 2 `basico`) | `{id, nombre, clasificacion, pesoScore, categoria, rubroCompra, sinonimos[], requiereActivacion, activacionId}`; 19 categorías (`granos, legumbres, frutas, verduras, grasas_frutas, frutos_secos, harinas, fermentos, proteinas, grasas, condimentos, citricos, aromaticos, semillas, hierbas, especias, algas, suplementos, encurtidos, basicos`); `pesoScore` no se usa |
| `recipesMapping` | 815 | **11** | `{id, titulo, categoria, tiempoEstimado, metodo, principales[{id,nombre,cantidad,esencial,nota?}], condimentos[…], basicos[{id,nombre,cantidad}], basesRequeridas[], rolBatch}` |
| `batchCookingBases` | 1409 | 6 | `{id, nombre, icono, descripcion, metodoCoccion, proporcionAgua?, rendimiento, vidaUtilHeladeraDias, aptoFreezer, freezerDias, instruccionesBatch[], recetasQueLaUsan[{recipeId, porcionRequerida, rol}], insumosCompartidos[], ahorroTiempoMinutosSemanal}` (ahorro 80/60/70/50/45/60 min) |
| `soakingAndPreTimes` | 1662 | **14** | `{ingredienteId, nombre, categoria, tiempoMinimoHoras, tiempoOptimoHoras, tiempoMaximoHoras, tiempoLabel, anticipacionRecomendada, medio, descartarAgua, razonDescarte, propositoClinico, recetasAsociadas[], alertas}` |

**Cómo mapea a recetas**: por `recipesMapping[].id` = `recipes[].id` (las 11 existen). Los ingredientes se mapean a mano a ids del catálogo (los 11 mapeos usan solo ids del catálogo). Las recetas se **vuelven a describir** (principales/condimentos con cantidad) en vez de derivarse de `recipes[].ingredientes`, por eso hay duplicación y deriva (p. ej. `queso-caju` tiene 1 principal y 3 condimentos; `leche-almendras` tiene 0 condimentos esenciales). Mapeadas: `caldo-detox, nituke-manzana, hummus-mung, mayonesa-zanahoria, babaganoush, queso-caju, galletas-yamani, pan-centeno-masamadre, chucrut-casero, leche-almendras, bowl-yamani-cruciferas`.

**API pública**:
- `matchFridge(ids, options?) → { totalRecetas, listasParaCocinar[], casiListas[], incompletas[], todas[] }`; cada resultado `{recipeId, titulo, categoria, score, rawScore, ratioPrincipalesPct, ratioCondimentosPct, countPrincipales, totalPrincipales, countCondimentos, totalCondimentos, missingPrincipales[], missingCondimentos[], canCook, canCookBase, tier: lista|casi_lista|incompleta, basesRequeridas}`. Compara ids en minúsculas; `options` no se usa.
- `getBatchPlanForRecipes(recipeIds) → { recetasSeleccionadas, basesSugeridas[], totalTiempoAhorradoMinutos }`.
- `getSoakingScheduleForRecipes(recipeIds) → { recetas[{id,titulo}], remojosRequeridos[] }` (reglas cuyo `ingredienteId` aparece entre principales/condimentos de las recetas **mapeadas**; ordenadas por `tiempoOptimoHoras` descendente).

---

## 4. Bugs, inconsistencias y deudas

Prioridad: **C** crítico (rompe función o datos), **A** alto, **M** medio, **B** bajo.

### 4.1 Heladera / Batch / Remojos
| # | Prio | Hallazgo | Dónde |
|---|---|---|---|
| 1 | **C** | `fridgeEngineData` no definido → Batch y Remojos vacíos (verificado en vivo; 5+ warnings de Vue). | `batch.html:32`, `remojos.html:21`, `heladera.js:86-101` |
| 2 | **C** | Aun definiéndola, la plantilla de **Batch** espera `rendimiento` ✓, `ahorroTiempoMinutosSemanal` ✓, **`almacenamiento.{heladera,freezer,consejo}` ✗** (el dato tiene `vidaUtilHeladeraDias`, `aptoFreezer`, `freezerDias`) y `recetasQueLaUsan[].titulo`/`porcentajeAprovechamiento` ✗ (el dato tiene `recipeId`, `porcionRequerida`, `rol`). | `batch.html:36-73` vs `fridge-engine.js:1409+` |
| 3 | **C** | **Remojos**: plantilla usa `rule.id, alimento, icono, tiempoRemojoTexto, temperatura, metodo, motivoBioquimico, recetasAsociadas.join`; el dato tiene `ingredienteId, nombre, tiempoLabel, medio, propositoClinico`, sin `icono` ni `temperatura`. | `remojos.html:21-72` vs `fridge-engine.js:1662+` |
| 4 | **A** | Solo 11/73 recetas tienen mapeo; la UI promete «qué cocino con lo que tengo» sobre todo el recetario. | `fridge-engine.js:815` |
| 5 | **M** | Taps rápidos con ids inexistentes: `repollo_blanco_colorado` (id real `repollo`), `shoyu_moa` (real `shoyu`); `agua_filtro` en «Despensa básica» tampoco existe y queda guardado en `fridgeSelected` (infla el contador). | `heladera.js:32-37,69-74` |
| 6 | **M** | Chips de categoría: `todas, granos, legumbres, verduras, frutas, semillas_frutos, condimentos` (`semillas_frutos` no existe) vs 19 categorías del catálogo: hierbas, especias, frutos secos, semillas, proteínas, etc. solo se alcanzan con «Todos» o buscando. | `heladera.html:72` |
| 7 | **M** | «Casi lista» = `score ≥ 70`, pero la UI dice «Falta 1 o 2 ingredientes» (con 5 principales, faltar 1 da 84; con 10, faltar 3 da 76). | `fridge-engine.js:1972-1974`, `heladera.html:161` |
| 8 | **M** | Botón «🛒 Faltantes» solo emite un toast; no agrega nada a Compras (la lista de Compras es estática y no admite ítems propios). | `heladera.js:76-84` |
| 9 | **M** | `weeklyPlan` sin UI; título «Planificador Semanal» pero solo se usa el día `1`; el fallback fijo de 5 recetas hace que «Remojos» muestre reglas aunque el usuario no haya planificado nada. | `batch.js:10-48` |
| 10 | **B** | Textos desactualizados: «11 reglas bioquímicas» (hay 14), «estas 6 bases … de 45 a 3 minutos» (afirmación sin fuente). Reglas de remojo que citan recetas inexistentes: `desayunos-chia`, `hidratacion-probiotica`, `sopas-cremas-mijo`, `pates-vegetales`; reglas cuyo `ingredienteId` no está en el catálogo (`kefir_agua`, `chucrut_vivo`). | `fridge-engine.js:1662+` |
| 11 | **B** | `scratch/fridge_and_prep_engine.js` es copia idéntica de `app/fridge-engine.js` (65 064 B) y `scratch/` guarda ~30 archivos de apoyo (builders, tests, dumps). | `scratch/` |

### 4.2 Lógica de Mi Día
| # | Prio | Hallazgo | Dónde |
|---|---|---|---|
| 12 | **A** | **XP infinito**: el bono de +50 se otorga cada vez que se marca la última misión y nunca se descuenta al desmarcar (desmarcar solo resta 15). Las medallas tampoco se revocan; `xp` se guarda aparte y puede divergir. | `dia.js:1040-1067` |
| 13 | **A** | Medallas con condiciones distintas de lo que prometen (tabla §3.2) y evaluadas solo al tildar una misión; si se cambia `startMode` o se edita un día pasado no se reevalúan. | `dia.js:1074-1094` |
| 14 | **A** | Racha calculada desde `selectedDay`: cambia al navegar por la línea de tiempo (mirar el día 3 muestra otra racha); no usa la fecha real. | `dia.js:993-1007` |
| 15 | **M** | `resetChallenge(true)` dice borrar «la lista de compras tachada» pero no la toca (ni heladera ni plan); además intenta borrar la clave inexistente `detox_streak`. | `dia.js:236-270` |
| 16 | **M** | Día 0 y días futuros/pasados son editables sin restricción; el día 0 da XP pero no cuenta para progreso ni aparece en informe/historial (los bucles van de 1 a 21). | `dia.js:1120, 862, 731` |
| 17 | **M** | Sugerencias en monodieta incluyen licuados, hot cakes, pudding, etc. (todas las `desayunos`), contrario a la fase «solo manzana + arroz». | `dia.js:763-771` |
| 18 | **M** | `normalizeSlot` genera ids aleatorios para el formato legado en **cada** llamada (`legacy_`+random): los botones de ese ítem (marcar/borrar) pueden no encontrar el id. Solo afecta datos v1.1–1.2, justo los que hay que migrar. | `dia.js:492, 544` |
| 19 | **M** | `isValidDateString` no valida días por mes ni años fuera de 2024–2035; `new Date(2026,1,31)` desplaza al 3/3. | `dia.js:3-15` |
| 20 | **M** | Fases definidas solo por `selectedDay` y `startMode`: si el usuario cambia el modo a mitad de reto, el banner de fase y las sugerencias cambian retroactivamente. El texto dice «arroz integral» y la guía «arroz yamaní». | `dia.js:1009-1038` |
| 21 | **B** | Cita y misión `infusion` recomiendan ortiga/diente de león 2–4 tazas a todos; la guía (p. 48) contraindica la ortiga con anticoagulantes y la lavanda/caléndula/carqueja/manzanilla en embarazo (dosis terapéuticas); el hábito no trae esa advertencia. | `detox-data.js:36+` |
| 22 | **B** | Informe: pie «WebApp v1.2.1»; título «INFORME CLÍNICO» sugiere validez clínica que la propia app no tiene. | `dia.js:1178` |
| 23 | **B** | Numeración `day_N` vs `dia_N` inconsistente; el síntoma «Despejado / Cero síntomas» está acoplado por string en JS y HTML. | `dia.js:332`, `dia.html:902` |

### 4.3 Alérgenos (detección por palabras clave)
Probado ejecutando el algoritmo real sobre las 73 recetas:

| Alérgeno | Falsos positivos concretos |
|---|---|
| Semillas | «lino» dentro de «a**lino**» → marca los 7 «Aliño…» y `papa-horno-alino-caju`; «zapallo» (la verdura) en `mayonesa-zanahoria`, `guiso-mung-calabaza`; «semillas» en «manzana con semillas» (`caldo-detox`) |
| Gluten / Trigo | `pan-quinoa-amaranto` («**sin** Gluten» en el título), `pan-trigo-sarraceno` («trigo sarraceno» no es trigo), `bastones-crocantes-dips` |
| Algas | `arroz-coliflor-salteado` por «**apagar**» (contiene «agar») |
| Frutos secos | `sopa-kale-brocoli-castanas`, `manzanas-asadas-canela` por «nuez moscada» |
Falsos negativos probables: «levadura de cerveza» (gluten) no se detecta; alérgenos libres sin grupo (p. ej. «huevo», «pescado») solo buscan el texto literal. Además `hummus-mung` sale como «Cítricos» por unas gotas de limón (correcto, pero sin matiz).
El campo `recipes[].alergenos` ya contiene una clasificación curada (apio, cítricos, frutos secos, gluten, soja, sésamo) y la heurística de texto es un **superconjunto** ruidoso: se descartó lo mejor que había. Raíz: coincidencia por subcadena sin límites de palabra (`texts.some(t => t.includes(kw))`, `dia.js:410-413`).

### 4.4 Contradicciones y huecos en los datos
- **Semáforo vs recetas**: `alino-miel-mostaza`, `pan-trigo-sarraceno` y `borsch-depurativo-caju` usan **miel** (y el borsch «azúcar mascabo»); «Azúcar» está en rojo y «miel» no existe en el semáforo. `galletas-harina-arroz` y `hot-cakes-avena-coco` usan avena (gluten) sin entrada en el semáforo. «Cocinar con aceite» está en rojo/verde («jamás») mientras `pan-quinoa-amaranto` hornea con ½ taza de aceite y `colchon-de-arvejas`, `sopa-apio-eneldo-curry` saltean con 1 cdita (la guía, p. 28, permite «salteado en aceite y agua» con 1 cdita). Conviene decidir una regla única.
- **Cobertura del semáforo**: 37 entradas; no cubre miel, avena, papa, batata, tomate, hongos, tofu, kéfir, banana, pasas, nueces, garbanzo, lenteja, aduki, sarraceno, pepino, rabanitos, levadura, miso, coco, pimienta, mostaza, vinagre, té negro, entre otros usados en recetas o en la guía. El buscador devuelve vacío para esas consultas.
- **Compras vs recetas**: la lista (50 ítems) no incluye ingredientes usados en muchas recetas: rabanitos (5 recetas), hinojo (5), rúcula (5), mostaza (5), cúrcuma (8), pimienta (11), nueces/pistachos (9), levadura (6), canela (5), comino (4), pepino (4), hongos (3), papa (3), mijo (2), nabo (2), nori, kombu, miso, agar, berenjena, avena, coco, banana… El `LISTA-DE-COMPRAS.md` tiene más rubros que `shoppingList`. No hay cantidades por personas ni por días.
- **Filtros de compras**: 8 comercios en los datos vs 6 chips (`compras.html:43`).
- **SOS vs bitácora**: la bitácora ofrece 8 síntomas pero SOS solo cubre 3 (cefalea, frío, y parcialmente los demás); no hay protocolo para lengua saburral, sed intensa, hambre emocional, dolor muscular ni náuseas; en sentido inverso SOS trata constipación, acidez y mareos que la bitácora no permite registrar.
- **Fases**: tres esquemas distintos (monodieta/general de la lógica, Fase 1-2-3 de las citas, Fase 1-2 del texto de la guía).
- **Kimchi**: la guía dice «3000 gr de manzana rallada» por 1 kg de akusay; `RESUMEN-OPERATIVO.md` advierte que parece un error y pide confirmar con Isa. La receta (`kimchi-artesanal`) trae **«300 g»** sin ninguna nota de que se corrigió por decisión propia.
- **Mayonesa de zanahoria**: la guía acepta «pasas de uva o aceitunas negras»; la receta solo lista aceitunas.
- **Fechas del taller**: Meet 28/09 y 14/10/2026 ya vencieron (hoy es 15/11/2026); pie «Material de referencia Septiembre 2026».
- **Citas (revisar antes de publicar)**: varias atribuciones son parafraseadas o de origen dudoso (p. ej. la de «Edison» sobre el médico del futuro y «el microbio no es nada, el terreno lo es todo» atribuida a Claude Bernard son muy difundidas sin fuente primaria; la de Hipócrates «antes de curar a alguien…» tampoco tiene fuente clara). No se verificó cita por cita; hay que hacerlo o presentarlas como «inspiración» sin autor firme. También el campo `contexto` contiene afirmaciones de salud («activa la autofagia nocturna», «limpia la matriz extracelular») que son opinión del autor del dato, no de la guía.
- **Afirmaciones terapéuticas**: semáforo/SOS/citas incluyen frases como «ablanda posibles cálculos», dosis (agua de mar, carbón, chlorella) y consejos médicos (sal bajo la lengua en hipotensión). `RESUMEN-OPERATIVO.md` aclara que no validan afirmaciones terapéuticas; la app solo trae un aviso breve en SOS. Falta aviso general y filtro por condiciones (embarazo/lactancia, anticoagulantes, tiroides, úlcera, diarrea).
- **Recetas**: `tiempo` y `metodo` son texto libre no ordenable ni filtrable (33 valores de tiempo, ~63 de método); no hay porciones, ni orden de pasos con tiempos, ni fotos, ni etiquetas de fase/constitución. No se auditó cada receta línea por línea contra el PDF.

### 4.5 Sincronización y privacidad (resumen; detalle en §2.4)
| # | Prio | Hallazgo | Dónde |
|---|---|---|---|
| 24 | **C** | Pull reemplaza estado local; sin reintento ni cola; sin protección real; sin protección de foco; versión de esquema sin validar. | `core.js:151-238`, `app.js:81-111` |
| 25 | **C** | Estado único por código (sin perfiles); documentación y UI se contradicen sobre si la pareja comparte código. | `modals.html:335` vs `ESTADO-DEL-PROYECTO.md` §3.C |
| 26 | **A** | Bucket público + clave de 4 caracteres + sin auth sobre datos de salud. | `core.js:88`, `core.js:240-248` |
| 27 | **A** | El QR se genera enviando el link con el código a `api.qrserver.com`. | `core.js:321-324` |
| 28 | **M** | Dependencia de un servicio gratuito de terceros; hoy responde (§5), sin garantía. | — |

### 4.6 Dependencias, privacidad web, accesibilidad, rendimiento
| # | Prio | Hallazgo | Dónde |
|---|---|---|---|
| 29 | **A** | **Dependencias CDN sin fijar**: `unpkg.com/vue@3/dist/vue.global.js` (flota en 3.x), `unpkg.com/lucide@latest` (nunca se usa: 0 íconos), `cdn.tailwindcss.com` (CDN de *desarrollo*: compila en el navegador, aviso oficial de no usar en producción, sin versión). `canvas-confetti@1.9.3` sí está fijado. Google Fonts (Inter) envía la IP a Google. | `index.template.html:20,46,82,88` |
| 30 | **A** | Sin conexión la app **no arranca** (sin Vue ni Tailwind la página queda en blanco por `[v-cloak]`). No existe `manifest` ni service worker (grep sin resultados) pese a llamarse PWA y a que `README-MODULOS.md`/`ESTADO-DEL-PROYECTO.md` afirman «cero dependencias externas / offline». | `index.html`, docs |
| 31 | **A** | `viewport` con `maximum-scale=1.0, user-scalable=no`: impide hacer zoom (falla WCAG 1.4.4). | `index.template.html:5` |
| 32 | **A** | **0 atributos `aria-*`/`role`** en toda la app: modales sin `role="dialog"`/`aria-modal`, sin trampa ni retorno de foco; botones solo-emoji (🗑️, ✕, 🔍) sin etiqueta accesible; tarjetas clicables (`div @click`) no enfocables; toasts sin `aria-live`; cierre con Esc solo para 2 de 5 modales; texto de 8–11 px frecuente (`text-[8px]`, `text-[9px]`, `text-[10px]`) con colores `stone-400/500` de bajo contraste. | `core/modals.html`, `dia.html` |
| 33 | **M** | `animate-bounce` en el toast y `animate-badge`; sin `prefers-reduced-motion`. | `core/modals.html:401`, `styles.css` |
| 34 | **M** | Clases de Tailwind inexistentes: breakpoint `xs:` (no definido) → en celulares se oculta la palabra «Primavera» y el código de sync del botón; `py-0.2`, `stone-750` no existen (sin efecto). | `core/header.html:13,43` |
| 35 | **M** | Imprimir/«Guardar PDF» llama `window.print()` sobre toda la página: el CSS de impresión solo oculta `header, nav, .no-print` y `.no-print` no se usa en ningún lado (0 usos); saldrá la app entera, la barra móvil y no el informe. | `dia.js:1193-1195`, `styles.css:185-193` |
| 36 | **M** | Búsqueda inconsistente: Mi Día normaliza tildes (`normalizeText`), pero recetario, semáforo y buscador global solo usan `toLowerCase()` («limon» no encuentra «limón»). | `recetas.js:17`, `semaforo.js:11`, `app.js:121` |
| 37 | **M** | Atajos de Mi Día («Ver receta de Nituke/Caldo») ponen `recipeSearch` pero no cambian a la subvista `catalogo` ni limpian el filtro de categoría: pueden aterrizar en Heladera/Batch o con 0 resultados. | `dia.html:337,342` |
| 38 | **M** | Rendimiento: toda Mi Día se re-renderiza con cada tecla de los inputs de comidas; `getMealSuggestions` (barre 21 días × 4 momentos y vuelve a normalizar slots) y `normalizeSlot` (llamado ~10 veces por slot) se recalculan en cada render ×4 momentos; en celulares modestos puede notarse. Tailwind CDN añade ~300 KB de JS y compilación en cada carga; el HTML pesa 484 KB. | `dia.js:722-848`, `dia.html:547-770` |
| 39 | **M** | `JSON.parse` de localStorage sin `try/catch` en el arranque de 6 módulos. | `dia.js:36-47`, `heladera.js:3`, `compras.js:3`, `batch.js:3` |
| 40 | **B** | `window.confirm/alert` nativos para reinicios; «⌘K» se muestra también en Windows. | `app.js:188`, `header.html:65` |
| 41 | **B** | Datos con campos sin uso (`icon` de misiones/medallas, `icono` de SOS, `pesoScore`, `basicosWeight`, `options` de `matchFridge`). | datos |
| 42 | **B** | Documentación desactualizada: `ESTADO-DEL-PROYECTO.md` da una ruta de `bundle.py` inexistente (`.gemini\antigravity\...`), `README-MODULOS.md` cita v1.2.1 y «11 reglas»; ESTADO afirma «fichas de hierbas» (pestaña SOS & Guía) que no existen. | docs |

### 4.7 Riesgo de las cookies espejo (no verificado)
`safeStorage.set` replica cada valor como cookie sin límite lógico (`core.js:22-27`). Los navegadores descartan cookies de >4 KB y envían **todas** las cookies del host en cada pedido; `detox_daily_meals` y `detox_daily_journal` superan fácil esos 4 KB con uso normal (quedan guardadas solo en localStorage), pero `detox_completed_missions`, `detox_shopping_checked`, `detox_user_allergies`, etc. suman varios KB codificados. Cabeceras >8–16 KB suelen provocar error 400/431 en el servidor de GitHub Pages, y como el origen es `urrozgustavo-collab.github.io`, afectaría también a **otros** proyectos Pages del usuario. No se reprodujo; recomendable no replicar en cookies en la v2 (o limitarlas a 2 claves chicas).

---

## 5. Chequeo de kvdb.io (un solo GET, sin leer ni escribir claves)

```
GET https://kvdb.io/  →  HTTP 200  (2,16 s)   [2026-11-15 ~22:00 UTC]
server: Fly/…  ·  access-control-allow-origin: *  ·  set-cookie: session=… (HttpOnly)
```
kvdb.io **responde hoy**. También respondió 200 la app en `https://urrozgustavo-collab.github.io/detox-primavera/` y el repo `urrozgustavo-collab/detox-primavera` es **público** (consulta a la API de GitHub). No se tocó el bucket `EE7imp…` ni ninguna clave de usuario; por lo tanto **no está comprobado** si el bucket permite listar claves o escribir sin credenciales (alto riesgo probable por diseño; verificar en el panel del servicio, no probando contra datos reales). Observación en vivo de la app publicada (navegador integrado, sin código de sync): arranca sin claves salvo `detox_dark_mode`, confirma el warning de `fridgeEngineData`, 0 tarjetas en Batch/Remojos y los 7 chips de categoría de la heladera.

---

## 6. Contenido de las guías que la app **no** aprovecha todavía

Fuente: `scratch/guia_dump.txt` (guía completa, ≈52 págs.). `scratch/recetas_extraidas.txt` es una re-extracción de las mismas páginas 5–22 y 30–40 por secciones: **no aporta nada adicional**. Del PDF «Cómo prepararse» solo existe el resumen de `RESUMEN-OPERATIVO.md`.

### 6.1 «Alimentos Medicina» (págs. 41–52) — **0 % usado**
Fichas con propiedades, sabor, naturaleza térmica, dosis y **contraindicaciones** de: agua ionizada, agua de mar, albahaca, caléndula, chía, carqueja, cúrcuma, clorofila, chlorella, espirulina, jengibre, lavanda, limón, lino, manzanilla, menta, ortiga, wheatgrass, semillas de zapallo, vinagre de manzana (20) y de los alimentos arroz integral, centeno, manzana, porotos mung, quinoa (5). La pestaña «Herbolario» no las tiene. Contraindicaciones clave de la guía (hoy ausentes como filtro): embarazo/lactancia (albahaca, caléndula, carqueja, jengibre, menta, manzanilla en dosis altas), anticoagulantes/antiagregantes (ortiga, cúrcuma), hipertiroidismo (chlorella, espirulina), obstrucción biliar (cúrcuma), úlcera (jengibre), diarrea (lino, chía, menta, agua de mar pura, vinagre en dosis), friolentos (wheatgrass, espirulina).

### 6.2 Personalización por constitución («friolento» / «caluroso»)
Págs. 6, 11, 24, 25: preferir cocido y caliente si se es friolento (manos/pies fríos, no sed, no sudor, hinchazón baja con crudos); crudos solo a la mañana/mediodía y con clima; los jugos no son para friolentos; wheatgrass y espirulina para calurosos, chlorella más templada; consejo según «humedad/mocos/flemas» (cebolla o ajo + rabanitos o nabo + jugo de jengibre en cada comida, salvo gastritis). La app solo menciona «friolento» en 2–3 textos sueltos; no hay perfil que filtre recetas, sugerencias o suplementos.

### 6.3 Menú-modelo y frecuencias (págs. 8–19)
- «Plato de **cereal o legumbre + dip/aliño + una de las 19 opciones**» (lista de 19 + ensaladas variantes) y «**Ensalada libre** de 3 a 5 ingredientes + 2 a 5 cdas de cereal» → no hay generador de plato.
- Reglas: «más proporción de verduras que de cereal/legumbre», incentivar mung/quinoa/arroz integral, «no hay límite de cantidades», masticar 20 veces, comer sentado.
- **Frecuencias máximas** sin implementar: papa (burgers/papa al horno) ≤ 1 vez por semana; batata ≤ 1 vez por semana; fideos integrales de trigo 1–2 veces en todo el détox y los de otros granos 1 vez por semana; tofu «no usarlo diariamente».
- Desayunos modelo: 10 opciones sólidas (tostadas con palta+chucrut, lámina de miel, pan y tomaquet, untables…; ensaladas de fruta con combinaciones concretas; compotas de frutillas/arándanos; etc.).

### 6.4 Preparaciones del menú que **no están como receta** (≈25)
Del bloque almuerzos/cenas y desayunos: ensalada de porotos negros; ensalada de garbanzos con palta y cherrys; ensalada de quinoa con palta/cherry/morrón; alcauciles con aliño (2 variantes); ensalada de rúcula, cilantro y rabanitos; ensalada de remolacha, palta, menta y pepino; espárragos blanqueados con dijon; ensalada de espárragos y rabanitos; nituke de repollo colorado y manzana; ensalada de pepino y palta; ensaladas con remolacha (6 variantes); ensalada libre; hamburguesa de legumbres; batata al horno; fideos integrales/soba con tomate y brócoli; compota de manzanas con frutillas/arándanos; ensaladas de frutas (frutillas+pomelo, manzana+frutillas+mandarina+menta, rúcula+frutillas+pepino, hinojo+zanahoria+naranja); jugo de manzana mentolado; licuado verde Khalo; licuado refrescante; jugo antioxidante; tostadas con topes; ananá con menta; bowl de arroz con rawmesan/gomasio; gomasio. El `ESTADO-DEL-PROYECTO.md` dice «integración del 100 % de las recetas»: es cierto para el recetario (págs. 30–39) y los aliños, **no** para el menú.

### 6.5 Métodos de cocción y técnica (págs. 27–30)
La app trae 4 de los 8 métodos. Faltan: **salteado en aceite y agua**, **verduras blanqueadas** (1–3 min; usado en espárragos y brócoli), **verduras hervidas**, y la **tabla de cocción de granos** (trigo candeal 1:4, arroz 1:2, trigo sarraceno 1:1 salteando antes 3–5 min, cebada 1:4, quinoa 1:2, mijo 1:3¼; sin revolver, reposo 5–10 min, remojo nocturno, quinoa con varios lavados). Legumbres: faltan espumar 10 min, laurel/kombu, **sal al final**, germinado si cuesta digerir, no cocinar junto a carne. Tip del arroz cocido (dura ~5 días en heladera, recalentar al vapor, no comerlo frío) solo está parcialmente en Batch.

### 6.6 Constipación, diarrea y SOS (págs. 7–8)
La guía da **8 opciones escalonadas «ir sumando de a una»**; SOS tiene 5 pasos. Faltan: 2–3 cdas de lino molido y aceite de lino en las comidas (opción 4), **cataplasma de aceite de ricino** (7) y **aloe vera líquido** con límite de 3 semanas sin supervisión médica y no apto friolentos (8). Falta la lógica «sumar de a una» (una escalera con registro de cuál probó). Diarrea: falta mencionar evitar lino/chía.

### 6.7 Fitoterapia y suplementos (págs. 23–24)
- 7 infusiones con dosis y **naturaleza térmica** (manzanilla neutra/fresca, albahaca+jengibre cálida, menta+jengibre, manzanilla/caléndula/lavanda neutra, ortiga fresca «super hepática», carqueja fría y amarga, diente de león fría), 2–4 tazas/día, «no endulzar»; el app trae 4 infusiones como recetas y ninguna carqueja.
- Suplementos opcionales con dosis/condiciones: clorofila 1 tapita/día; lavanda si hay irritabilidad; **agua de mar solo desde el día 7**, ¼ mar – ¾ dulce, empezar con 2 cdas 5 días y subir; wheatgrass/espirulina/chlorella (empezar ¼ cdita → 1 cdita). La app sólo los lista en el semáforo («Suplementos») sin dosis ni desbloqueo por día.
- Mención de un protocolo de **«quelación y desparasitación»** (ortiga + diente de león 2 tazas/día durante todo el proceso; chlorella/espirulina hasta 3 meses): `RESUMEN-OPERATIVO.md` recomienda **no** automatizarlo sin profesional; decidir si se muestra y con qué aviso.

### 6.8 Condimentos que «mueven el hígado» (pág. 21) y aliños
Lista de toppings (cebolla morada/verdeo, ajo, 4–8 rabanitos o nabo, chucrut/kimchi, jugo de jengibre, hierbas, cáscara de cítricos, criolla con tutti, brotes) como «topping del día» no existe; tampoco la guía de dosis de aceite de lino («1 cda por comida = dosis terapéutica» o 2 cdas de semillas molidas).

### 6.9 Preparación previa y hábitos
Reducir cafeína/mateína a la mitad cada 2 días (PDF de preparación): hoy es solo un texto en Fase 0; falta un **calendario de descenso** con la dosis base del usuario. «Agua ionizada» (hervir 15–20 min y tomar de a sorbitos) no es hábito ni receta (la misión dice «termo de agua tibia»). Compras iniciales sugeridas («arroz integral, manzanas, limones, sal natural; opcional sésamo, shoyu, té verde») para la Fase 0 no están separadas del resto.

### 6.10 Fermentos
Chucrut: procedimiento de 14 pasos (esterilizar frascos, pesar sal 2–2,5 %, peso, rotular, revisar a las 24–48 h, burbujas a los ~10 días, listo a 21–28 días) con hitos; la app guarda 7 pasos y no tiene temporizador/recordatorio de fermentación. Masa madre (3–7 días, alimentación, reactivación 1 h antes) casi sin cubrir. Pickles y kimchi: tiempos de conservación (2 semanas / 1 mes).

### 6.11 Material propio del proyecto sin aprovechar
`LISTA-DE-COMPRAS.md` (dos vistas, por comercio y por categoría, con más rubros que la app); `RESUMEN-OPERATIVO.md` (ofrece menú semanal, escala por personas y registro diario, y cuestiones a confirmar con Isa); `scratch/clinical_quotes.json` (idéntico a `dailyQuotes`); `scratch/test_*.js` (suite de pruebas de reglas: scoring, módulos, catálogo; reaprovechable como casos de regresión para la v2).

---

## 7. Puntos a resolver antes de escribir la v2 (derivados de esta auditoría)

1. **Perfiles**: decidir si hay 1 o 2 personas y qué se comparte (compras sí; bitácora/alergias/XP no). El modelo actual no lo permite.
2. **Migración sin pérdida**: leer `detox_*` (localStorage, luego cookie) en el mismo origen de GitHub Pages; tolerar los 3 formatos de comidas; recalcular XP/medallas/racha desde `completedMissions`; opcionalmente importar una vez desde kvdb con el código del usuario; ofrecer exportar/importar JSON para el caso `file://`. Usar prefijo nuevo (`detox2_*`) para no pisar claves de otros proyectos del mismo origen.
3. **Sincronización**: sin kvdb de bucket público; si se mantiene alguna nube, fusión por campo/fecha, cola de reintentos, claves largas, sin generar QR vía terceros (QR local), y sin cookies.
4. **Reglas de juego**: XP derivado, medallas medibles, racha por fecha real, día 0 contado (o excluido a propósito).
5. **Datos**: unificar fases; mapear las 73 recetas a ingredientes estructurados (de ahí salen heladera, compras, alérgenos y semáforo); usar `alergenos` curados; completar semáforo y compras; resolver el criterio del aceite y de la miel; confirmar con Isa el dato del kimchi.
6. **Contenido de guía a incorporar**: fichas «Alimentos Medicina» con contraindicaciones, perfil friolento/caluroso, frecuencias máximas, métodos de cocción faltantes, escalera de constipación, suplementos con desbloqueo por día.
7. **Autónomo**: un único HTML sin CDN (Vue/Tailwind/íconos/fuentes embebidos o reemplazados por CSS propio), con `manifest`/service worker si se quiere offline real, accesibilidad básica (zoom, roles de diálogo, foco, contraste, `aria-live`).
