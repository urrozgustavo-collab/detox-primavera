# Detox Primavera v2.0.0 — Especificación de construcción

> Autor: sesión orquestadora (Claude Opus 5.5) · 15/11/2026
> Insumos: `rediseno-v2/auditoria.md` (código viejo) y `rediseno-v2/investigacion.md` (mercado).
> Este documento es el **contrato** entre las sesiones de construcción. Si algo no está definido acá, decidí con criterio propio, anotalo en `rediseno-v2/DECISIONES.md` (una línea por decisión) y seguí. No preguntes a Gustavo.

---

## 0. Qué se construye

Una web-app **de un solo archivo HTML, sin dependencias externas** (ni CDN, ni Google Fonts, ni íconos remotos, ni generadores de QR remotos), en castellano rioplatense, para seguir programas de alimentación consciente. El primer programa, y foco actual, es el **Detox de Primavera de 21 días de Isabel Caparra**. La usan Gustavo y su pareja (Jime) en celular y PC; se publica en GitHub Pages (`https://urrozgustavo-collab.github.io/detox-primavera/`) y también funciona abriendo el archivo suelto.

Principios no negociables:
1. **Nada se pierde**: migración automática y no destructiva de los datos v1 (claves `detox_*`), copia de seguridad exportable/importable, guardado robusto.
2. **Todo lo que v1 hacía, v2 lo hace mejor** (ver inventario en la auditoría §1). Las 4 funciones rotas de v1 (Batch, Remojos, heladera con 11 recetas, alérgenos ruidosos) quedan arregladas.
3. **Calma y claridad**: una cosa principal por pantalla, sin culpa (racha con gracia), sin promesas médicas, accesible (zoom permitido, contraste AA, foco visible, `<dialog>` nativo, `aria-live`).
4. **Rápida**: < 600 KB el HTML final, arranque < 300 ms en un celular medio, sin re-render al tipear.

---

## 1. Estructura de archivos

```
detox-primavera/
├── v2/
│   ├── build.py                 # sin dependencias externas (solo stdlib)
│   ├── src/
│   │   ├── shell.html           # esqueleto: <!-- INLINE:CSS --> y <!-- INLINE:JS -->
│   │   ├── styles/              # tokens.css, base.css, components.css, screens.css, print.css
│   │   ├── data/                # SESIÓN DE DATOS (únicamente)
│   │   │   ├── 00-namespace.js  # window.DX = window.DX || {}
│   │   │   ├── taxonomy.js      # categorías, comercios, alérgenos, condiciones, momentos, síntomas…
│   │   │   ├── ingredients.js
│   │   │   ├── recipes.js
│   │   │   ├── foods.js         # semáforo
│   │   │   ├── herbs.js         # «Alimentos Medicina»
│   │   │   ├── sos.js
│   │   │   ├── shopping.js
│   │   │   ├── methods.js       # métodos de cocción + tabla de granos + legumbres
│   │   │   ├── prep.js          # remojos + bases de batch cooking + fermentos
│   │   │   ├── quotes.js
│   │   │   ├── programs.js
│   │   │   ├── taller.js        # info de Isa, encuentros, videos, productores
│   │   │   └── READY.md         # se crea al terminar: resumen + conteos
│   │   └── app/                 # SESIÓN DE APP (únicamente)
│   │       ├── 00-util.js … (orden por prefijo numérico)
│   └── tests/
│       ├── run.js               # `node v2/tests/run.js` — sin dependencias
│       ├── data.test.js         # integridad referencial de DX (lo escribe la sesión de datos)
│       ├── *.test.js            # lógica (lo escribe la sesión de app)
│       └── fixtures/            # datos v1 sintéticos para migración, etc.
├── index.html                   # SALIDA de build.py (GitHub Pages)
├── Detox-Primavera-App.html     # SALIDA idéntica (copia suelta)
├── manifest.webmanifest         # SALIDA (opcional en Pages)
└── sw.js                        # SALIDA (service worker, solo actúa en https)
```

`build.py`: concatena CSS (orden alfabético dentro de `styles/`, pero `tokens.css` primero y `print.css` último) y JS (todos los `data/*.js` en orden alfabético, luego `app/*.js` en orden alfabético) dentro de `shell.html`; inserta `VERSION = "2.0.0"` y fecha de build; escribe las salidas; imprime tamaños. Nada de minificación obligatoria (si se agrega, que sea stdlib y segura). Debe fallar con error claro si falta un archivo.

Los archivos de `app/` cargan **después** de `data/` y nunca modifican `DX`. Todo bajo un IIFE o `'use strict'`; un único global de app: `window.DXApp` (para tests y depuración).

---

## 2. Contrato de datos (`window.DX`)

Ids en `kebab-case` o `snake_case` estables; **conservar todos los ids de v1** (recetas, ítems de compras `v1..pr3`, misiones `limon…plato_verde`, medallas `inicio…detox_champion`, ingredientes del catálogo de la heladera).

### 2.1 `DX.taxonomy`
```js
{
  recipeCategories: [{ id:'almuerzos', label:'Platos y guisos', icon:'bowl' }, …],   // los 10 de v1 + 'ensaladas', 'jugos' si hacen falta
  mealSlots: [{ id:'desayuno', label:'Desayuno', icon:'sunrise' }, {id:'almuerzo'…}, {id:'merienda'…}, {id:'cena'…}],
  stores: [{ id:'verduleria', label:'Verdulería', order:1 }, 'dietetica', 'herboristeria', 'panaderia', 'farmacia', 'pescaderia', 'granja', 'carniceria', 'super'],
  allergens: [{ id:'frutos_secos', label:'Frutos secos', v1:['Frutos secos'], keywords:[…] }, 'semillas','sesamo','gluten','soja','citricos','apio','algas','legumbres','frutillas','huevo','pescado','lacteos'],
  conditions: [{ id:'embarazo', label:'Embarazo' }, 'lactancia','anticoagulantes','hipertiroidismo','obstruccion_biliar','ulcera_gastritis','diarrea','hipotension'],
  constitutions: [{ id:'friolento', label:'Friolento/a', desc:'manos y pies fríos, poca sed…' }, { id:'caluroso', … }],
  energyLevels: [{ v:1, label:'En crisis', emoji:'…' } … v:5],            // de v1
  moodLevels:   [{ v:1, label:'Muy bajo' } … v:5],                          // NUEVO
  digestionStates: [{ id:'liviano'…}, {id:'gases'}, {id:'lenta'}, {id:'optima'}],  // ids de v1
  symptoms: [{ id:'cefalea', label:'Cefalea leve', v1:'Cefalea leve', sos:'dolor-cabeza' }, … incluir los 8 de v1 (id 'despejado' es excluyente) + constipacion, acidez, mareos, hinchazon, insomnio, antojos, irritabilidad ],
  thermal: [{ id:'calido' }, { id:'neutro' }, { id:'fresco' }, { id:'frio' }]
}
```
`v1` = string exacto que usaba v1 (para migrar).

### 2.2 `DX.ingredients` — catálogo (≥ 120)
```js
{ id:'apio', name:'Apio', category:'verduras', store:'verduleria', role:'principal'|'condimento'|'basico',
  synonyms:['apio','pencas de apio'], allergens:['apio'], soak:'id-de-remojo'|null, food:'id-del-semaforo'|null,
  pantry:false /* true = básico de alacena: sal, aceite, agua */ }
```
Incluye los 54 de v1 (mismos ids) y todo ingrediente usado en cualquier receta.

### 2.3 `DX.recipes` — recetario (73 de v1 + preparaciones del menú que faltan; meta ≥ 95)
```js
{
  id:'caldo-detox', title:'Caldo Détox Alcalinizante', category:'caldos',
  time:{ total:35, active:10 }|null,       // minutos (número); derivado del texto de v1
  method:'Hervido suave tapado', servings:4|null,
  ingredients:[ { text:'4 pencas de apio cortadas', qty:4, unit:'penca', item:'apio', role:'principal'|'condimento'|'basico', optional:false } ],
  steps:[ { text:'…', timer:600|null } ],  // timer en segundos cuando el paso dice «X minutos»
  tip:'…', allergens:['apio'],             // CURADO (ids de taxonomy.allergens), sin heurística de texto
  phases:['monodieta','general'],          // en qué fases es apropiada (monodieta = solo lo que la guía permite)
  slots:['almuerzo','cena'], thermal:'calido'|null,
  tags:['crudo'|'cocido'|'sin-coccion'|'batch'|'fermento'|'friolento-ok'|'caluroso-ok'|'rapida'],
  limits:{ perWeek:1 }|null,               // frecuencias máximas de la guía (papa, batata, fideos, tofu)
  source:'guía p.33', note:'…'|null        // p.ej. kimchi: «la guía dice 3000 g; se usa 300 g, verificar con Isa»
}
```
`qty` puede ser fracción decimal (0.5) o `null` («a gusto»). `item` debe existir en `DX.ingredients` (excepto `null` para agua del grifo, etc.).

### 2.4 `DX.foods` — semáforo (≥ 90)
`{ id, name, status:'green'|'yellow'|'red', category, why, howTo?|null, synonyms:[], phases?:{monodieta:'red'} }`
Resolver contradicciones de la auditoría §4.4 con la guía como autoridad (aceite: amarillo «1 cdita en salteado con agua, nunca freír»; miel: según guía; avena/gluten; etc.). Una sola palabra por estado en toda la app: **Libre / Con moderación / Evitar**.

### 2.5 `DX.herbs` — «Alimentos Medicina» (≈ 25 fichas de la guía págs. 41–52 + infusiones págs. 23–24)
`{ id, name, kind:'hierba'|'alimento'|'suplemento'|'agua', thermal, taste, properties:[…], howTo:[…], dose, contraindications:[{ condition:'embarazo', text:'…' }], unlockDay?:7, source:'guía p.44' }`

### 2.6 `DX.sos` — protocolos (los 7 de v1 + los que cubran síntomas del diario)
`{ id, symptom, icon, cause, steps:[{ text, ladder:true|false }], whenToConsult:'…', relatedSymptoms:[ids], relatedHerbs:[ids], relatedRecipes:[ids], warnings:[{condition,text}] }`
La constipación lleva la **escalera de 8 pasos «ir sumando de a una»** (`ladder:true`).

### 2.7 `DX.shopping` — catálogo base de compras
`{ id:'v1', item, store, qty, essential, ingredient:'manzana'|null, stage:'previa'|'general' }` — los 50 de v1 con sus ids + los faltantes de la auditoría §4.4 (ids nuevos `x1…`).

### 2.8 `DX.methods`
`{ methods:[{ id, name, desc, steps:[] }] /* los 8 de la guía */, grains:[{ grain, ratio, time, notes }], legumes:[…reglas] }`

### 2.9 `DX.prep`
```js
{ soaking:[{ id, ingredient, name, minH, optH, maxH, label, medium, discardWater:bool, why, purpose, alerts }],
  batch:[{ id, name, icon, desc, method, yield, fridgeDays, freezer:bool, freezerDays, steps:[], recipes:[recipeIds válidos], savesMin }],
  ferments:[{ id, recipe, readyDaysMin, readyDaysMax, milestones:[{ day, text }] }] }
```

### 2.10 `DX.quotes`
`{ day:0..21, theme, text, author, attribution:'verificada'|'atribuida'|'popular', context }` — si la autoría no es segura, `attribution:'atribuida'` (la UI muestra «atribuida a …»). Quitar afirmaciones médicas del `context` que no estén en la guía.

### 2.11 `DX.programs`
```js
{
  id:'detox-primavera-21', name:'Detox de Primavera', subtitle:'21 días · guía de Isabel Caparra',
  season:'primavera', days:21, prepDay:true, theme:'primavera',
  startModes:[{ id:'monodieta3', label:'3 días de monodieta (recomendado)', monoDays:3 }, …'monodieta2','monodieta1','directo'],
  defaultStartMode:'monodieta3',
  phases:[ { id:'previa', name:'Preparación', desc, tips:[] },
           { id:'monodieta', name:'Monodieta purificadora', desc, allowedRecipes:[ids], tips:[] },
           { id:'general', name:'Menú depurativo', desc, tips:[] } ],
  habits:[ { id:'limon', text, tip, icon, phases:['monodieta','general'], warnFor:['ulcera_gastritis'] }, … ],  // ids de v1
  prepHabits:[ … cafeína a la mitad cada 2 días, compras iniciales, etc. ],
  waterGoalMl:2000,
  dayNotes:[ { day, text } ],          // «nota del día» breve sacada de la guía (≤ 2 frases)
  badges:[ { id:'inicio', title, desc, rule:{ type:'daysComplete', n:1 }, points:50 }, … ]   // ver §4.6
}
```
Además: `semana-limpia-7` (7 días, solo fase general, mismos hábitos) y `reset-14` (14 días, monodieta opcional) — **basados solo en el contenido de la guía**, y la plantilla vacía `custom` que usa el editor de programas.

### 2.12 `DX.taller`
`{ guide:{ name, email, whatsapp, groupUrl, meetUrl }, meetings:[{ date:'2026-09-28', time:'18:30', topic }], videos:[{ id, title, url }], producers:[…] }`

### 2.13 Integridad (lo verifica `v2/tests/data.test.js`)
Toda referencia cruzada existe (ingredient.item, soak, food, recipes en batch/fases/sos, herbs en sos, allergens, conditions, stores, categories, symptoms); ids únicos; ningún `undefined`; cada receta con ≥1 ingrediente y ≥1 paso; los ids de v1 están todos.

---

## 3. Estado persistente (app)

Clave única de `localStorage`: **`detox2_state`** (JSON). **Nunca** escribir cookies. Nunca borrar ni modificar claves `detox_*` de v1. Copia espejo opcional en IndexedDB **no** es necesaria en v2.0.0; sí pedir `navigator.storage.persist()` tras la primera interacción.

```js
{
  schema: 2,
  device: { id, theme:'system'|'light'|'dark', textScale:1, reduceMotion:false, sound:true, lastBackupAt:null, migratedFromV1At:null, onboarded:false },
  activeProfile: 'p_ab12',
  profiles: {
    p_ab12: {
      id, name:'Gustavo', color:'#…', emoji:'🌿', createdAt, updatedAt,
      settings: { allergies:[ids], customAllergies:[strings], conditions:[ids], constitution:null|'friolento'|'caluroso', servings:2, waterGoalMl:2000, sync:{ code:null, legacyCode:null, lastPushAt:null, lastPullAt:null, dirty:false } },
      activeEdition: 'e_xy' | null,
      editions: { e_xy: { id, programId, startDate:'YYYY-MM-DD'|null, startMode, status:'planned'|'active'|'done'|'archived', createdAt, closedAt:null, note:'' } },
      days: { e_xy: { '0': Day, '1': Day, … } },
      recipeLog: { favorites:[ids], notes:{ [id]: text }, rating:{ [id]: 1-5 }, cooked:{ [id]: [timestamps] } },
      customRecipes: [Recipe],          // mismo esquema que DX.recipes, id 'my-…'
      customPrograms: [Program],        // mismo esquema que DX.programs, id 'my-…'
      plan: { 'YYYY-MM-DD': { desayuno:[recipeIds], almuerzo:[], merienda:[], cena:[] } },
      fridge: [ingredientIds],
      shopping: { checked:{ [id]: ts }, custom:[{ id, text, store, qty, checked:false, from:'manual'|'heladera'|'plan' , t }], removed:{ [id]: ts } },
      reintro: [{ id, food, date, editionId, notes, verdict:null|'bien'|'dudoso'|'mal' }],
      ferments: [{ id, recipe, startedAt, notes }],
      timers: [{ id, label, endAt, recipe }]
    }
  }
}
Day = { updatedAt,
  habits: { [habitId]: 'done'|'skip' },            // ausente = pendiente
  water: [{ t, ml }],
  checkin: { energy:null|1-5, mood:null|1-5, digestion:null|id, symptoms:[ids], customSymptoms:[], notes:'', updatedAt } ,
  meals: { desayuno:[{ id, name, recipeId:null|id, done:bool, t, deleted?:true }], almuerzo:[], merienda:[], cena:[] } }
```
- Guardado: debounce 400 ms + `pagehide`/`visibilitychange→hidden` inmediato; `try/catch`; si `localStorage` falla, seguir en memoria y mostrar aviso persistente «No se puede guardar en este navegador: exportá una copia».
- `schema` permite migraciones futuras (`migrations[2→3]`).
- Si el protocolo es `file:` mostrar una sola vez (y en Ajustes) el aviso: «Abierto como archivo: estos datos viven solo en este archivo y navegador. Usá la versión web o exportá copias».

### 3.1 Migración v1 → v2 (crítica)
En el arranque, si **no** existe `detox2_state` y existe cualquier `detox_*` (localStorage primero, si no cookie del mismo nombre), construir el estado así (todas las lecturas con `try/catch`, toleran JSON roto):
- Perfil único (nombre vacío → onboarding corto pide «¿Cómo te llamás?» con «Gustavo» como sugerencia **no** preseleccionada).
- Edición `detox-primavera-21` con `startDate = detox_start_date` (validar fecha real; inválida → null, status `planned`), `startMode = detox_start_mode || 'monodieta3'`, status según la fecha (pasada >21 días → `done`).
- `detox_completed_missions.day_N[id]=true` → `days[e][N].habits[id]='done'`.
- `detox_daily_journal.dia_N` → `checkin` (energy `Number()`, digestion id, symptoms por `taxonomy.symptoms[].v1`, el resto a `customSymptoms`; notes; updatedAt).
- `detox_daily_meals.dia_N.<slot>` en sus 3 formatos (array; `{text,done}`; `{text,done,items}` con ítems `name` o `text`) → `meals[slot]` (para `{text,done}` sin items: un ítem libre con ese texto si no está vacío). Ids estables: `m_<N>_<slot>_<índice>`.
- `detox_user_allergies` (nombres) → ids por `taxonomy.allergens[].v1`/label sin tildes; el resto a `customAllergies`.
- `detox_shopping_checked` → `shopping.checked` (solo `true`, ts = ahora). `detox_fridge_selected` → `fridge` (solo ids válidos). `detox_weekly_plan` → ignorar si no mapea a fechas (anotar en DECISIONES).
- `detox_sync_key` → `settings.sync.legacyCode`.
- `detox_dark_mode` → `device.theme`.
- XP/medallas/racha **no se migran**: se recalculan (§4.6).
- Al terminar: toast/tarjeta «Importamos tu progreso del Detox (N días con registros)». `device.migratedFromV1At = now`.
Tests obligatorios con fixtures de los 3 formatos de comidas, JSON roto, cookie sin localStorage, fecha inválida.

### 3.2 Copia de seguridad
- **Exportar**: descarga `detox-backup-AAAA-MM-DD.json` (todo el estado o un perfil). Con `navigator.share` y archivos si está disponible, ofrecer «Compartir».
- **Importar**: `<input type=file>`; validar `schema`; previsualizar (perfiles, ediciones, días con datos); opciones «Reemplazar todo» o «Fusionar» (usa la misma función de fusión que la sync). Acepta también un JSON de payload v1 (el de kvdb) y lo migra.
- Recordatorio suave en Progreso/Ajustes: «Última copia hace N días» (si > 14 días y hay datos, chip ámbar).

### 3.3 Sincronización entre dispositivos (rediseñada)
Mantener kvdb.io (bucket `EE7impjfrWvHaAhuDDuBvU`, `https://kvdb.io/<bucket>/<key>`), pero:
- **Por perfil** (cada persona su código).
- **Cifrado de extremo a extremo** con WebCrypto: clave = PBKDF2-SHA256(código normalizado, salt aleatoria 16 B, 150 000 iteraciones) → AES-GCM 256; payload `{ v:2, salt, iv, ct, at }` (base64). El código nunca sale del dispositivo salvo en el enlace que el usuario comparte.
- **Clave KV** = `dx2_` + primeros 32 hex de SHA-256(`'dx2:' + código`).
- **Códigos nuevos**: 12 caracteres del alfabeto `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`, mostrados `XXXX-XXXX-XXXX` (`crypto.getRandomValues`). Antes de crear, GET de la clave: si existe, regenerar.
- **Código viejo `GUS-XXXX`**: al vincular, primero intenta la clave v2; si 404, GET legado `https://kvdb.io/<bucket>/<CÓDIGO>` (JSON plano v1) → migrar con la misma función de §3.1 y fusionar; luego seguir usando el código pero **recomendar** con un banner pasar a un código nuevo (un toque: crea código nuevo, sube, muestra el enlace).
- **Fusión** (`mergeProfile(local, remote)`), determinística y testeada: por edición y por día, cada parte (`habits`, `water`, `checkin`, `meals`) gana la de `updatedAt` más reciente — guardar `updatedAt` por parte (`day._u = { habits, water, checkin, meals }`); listas de comidas fusionadas por `id` con lápidas `deleted`; `shopping.checked/removed` por ts; `recipeLog` por unión; `settings` por `updatedAt` de settings; ediciones por id.
- Push con debounce 1,5 s tras cambios + al ocultar la página; **cola persistente** (`settings.sync.dirty=true`) con reintento exponencial (5 s → 5 min) y al volver `online`. Pull al abrir, al volver a la pestaña y cada 60 s visible; nunca aplicar un pull mientras un `input/textarea` tiene foco (posponer).
- Estado visible en la cabecera: punto discreto (sin sync / sincronizado hace X / pendiente / error con acción).
- Vincular: código tipeado, enlace `?sync=CÓDIGO` (leerlo, guardarlo y **quitarlo de la URL** con `history.replaceState`), o **QR generado localmente** (implementación propia de QR, byte mode, corrección M; si no se puede verificar con confianza, ocultar el QR y dejar enlace + código: decisión a registrar).
- Si `crypto.subtle` no existe (contexto no seguro), deshabilitar sync con explicación.

---

## 4. Lógica de dominio (pura, testeada en Node)

### 4.1 Calendario de la edición
- `dayIndex(edition, hoy)`: sin fecha → null; `diff = díasEntre(startDate, hoy)` (fechas locales, sin horas, robusto a DST); `diff < 0` → 0 («Preparación, faltan −diff días»); `0..days-1` → `diff+1`; `≥ days` → terminado (`days`, status `done` automático con tarjeta de cierre).
- Fases: día 0 `previa`; `1..monoDays` `monodieta`; resto `general` (programas sin monodieta: `general`). Cambiar el modo **no** reescribe registros pasados.
- Validación de fechas real (`2026-02-31` inválida).
- Se puede navegar y editar cualquier día ya transcurrido y el de hoy («reparar»); días futuros: solo lectura salvo plan de comidas.

### 4.2 Hábitos del día
Aplicables = `program.habits` filtrados por fase (y `prepHabits` en día 0). Estados: pendiente / hecho / «hoy no» (skip consciente). Día **completo** = todos los aplicables `done`. Hábitos con `warnFor` que coinciden con `settings.conditions` muestran aviso (no se ocultan).

### 4.3 Racha y constancia (sin culpa)
- **Racha**: días consecutivos completos hasta hoy (hoy incompleto no corta). **2 días de gracia por edición** que se aplican automáticamente a días pasados incompletos (se ven con ícono de hoja, no como hueco). Mejor racha guardada como derivado.
- **Constancia**: % de días transcurridos con ≥ 80 % de hábitos hechos. Es la cifra principal; la racha es secundaria.
- Siempre calculadas con la **fecha real**, nunca con el día que se está mirando.

### 4.4 Sugerencias de comidas
Candidatas por fase y momento (`recipe.phases` y `recipe.slots`); en monodieta **solo** `phase.allowedRecipes`. Excluir recetas con alérgenos del perfil (por `recipe.allergens`) y con `customAllergies` (coincidencia por **palabra completa** sin tildes sobre ingredientes). Aplicar `limits.perWeek`. Constitución: friolento → priorizar `cocido`/`calido`, bajar `crudo` a la noche; caluroso al revés. Rotación: menos veces consumida → más antigua. Mostrar 4 con motivo («Aún no la probaste», «Hace 6 días», «Buena para friolentos»).

### 4.5 Heladera
Motor 80/20 de v1 conservado (principales 80, condimentos 20; topes: 0 principales → máx 20; < 50 % principales → máx 40; `pantry` cuenta como presente siempre), aplicado a **todas** las recetas con ingredientes estructurados (y las propias). Tiers: «Lista» = 100; «Te falta poco» = faltan ≤ 2 ingredientes **y** score ≥ 70 (el texto dice exactamente cuántos faltan). Botón «Agregar faltantes a Compras» que **sí** los agrega (`from:'heladera'`).

### 4.6 Puntos y logros (derivados, nunca almacenados)
Puntos = 15 por hábito hecho + 50 por día completo + puntos de logros desbloqueados (por edición). Logros (reglas medibles, mismos ids de v1 + nuevos):
`inicio` primer día completo · `monodieta` todos los días de monodieta completos (oculto si `directo`) · `adios_cafeina` 3 días seguidos con `no_estimulantes` hecho · `semana1` días 1–7 completos (la gracia vale) · `maestro_nituke` 10 recetas distintas de la guía cocinadas (modo cocina terminado o comida registrada como hecha) · `detox_champion` 21 días completos (gracia vale) · `hidratacion` meta de agua 7 días · `bitacora` check-in 7 días · `explorador` 20 recetas distintas probadas.

### 4.7 Compras
Lista = catálogo base del programa + ítems propios + **generados desde el plan** (rango elegido: «esta semana» / «próximos 3 días»): ingredientes agregados por `item`, sumando `qty` cuando la unidad coincide, si no se listan juntas («2 unidades + 300 g»); multiplicar por `settings.servings / recipe.servings` cuando ambos existen. Agrupado por comercio en el orden de `stores` (reordenable por el usuario). Tildar → baja al final atenuado (deshacer con toque). Filtro por comercio, «ocultar comprados», «solo esenciales», contador por comercio. Compartir: Web Share si existe, si no copiar; formato WhatsApp `*COMERCIO*` + `• ítem (cant)`. Las alergias marcan con aviso los ítems que las contienen.

### 4.8 Correlaciones honestas (Progreso)
Para cada factor (cada hábito, meta de agua cumplida, fase monodieta) comparar energía/ánimo media en días con vs sin, **solo si** hay ≥ 6 días con check-in y ≥ 3 en cada grupo; mostrar n y la frase «no implica causa». Máximo 3 hallazgos, ordenados por diferencia.

### 4.9 Reintroducción
Herramienta en Progreso (destacada cuando la edición terminó): «Hoy reintroduzco ____» (sugerencias: alimentos `red/yellow` del semáforo); muestra los check-ins de las 72 h siguientes y pide un veredicto (bien / dudoso / mal). Historial de reintroducciones.

### 4.10 Recordatorios (.ics)
Ajustes → «Agregar recordatorios a mi calendario»: genera un `.ics` (RFC 5545, `TZID` local, `RRULE:FREQ=DAILY;COUNT=n`) con: agua con limón (8:00), check-in (21:00), remojo de la noche (20:30, solo días con plan que lo requiera → eventos sueltos). Horas editables antes de descargar.

---

## 5. Pantallas y navegación

Rutas por hash (el botón «atrás» del celular funciona): `#/hoy`, `#/hoy/2026-11-20`, `#/cocina`, `#/cocina/recetas`, `#/cocina/receta/<id>`, `#/cocina/heladera`, `#/cocina/plan`, `#/cocina/batch`, `#/cocina/remojos`, `#/cocina/metodos`, `#/compras`, `#/guia` (+ `/semaforo`, `/sos`, `/sos/<id>`, `/herbario`, `/herbario/<id>`, `/taller`), `#/progreso` (+ `/diario`, `/historial`, `/edicion/<id>`, `/reintro`, `/informe`), `#/programas` (+ `/<id>`, `/nuevo`), `#/ajustes`.

**Celular**: barra inferior de 5 destinos (Hoy · Cocina · Compras · Guía · Progreso) con ícono + texto, insignia de pendientes en Compras (pendientes de **la semana**, no del catálogo entero). Cabecera mínima: nombre del programa y día, botón de búsqueda, avatar del perfil (abre hoja con: cambiar perfil, Programas, Ajustes, tema).
**PC (≥ 960 px)**: riel lateral izquierdo con los mismos destinos + Programas + Ajustes; contenido máx. 1080 px; Hoy en dos columnas (izquierda: anillo, hábitos, agua; derecha: comidas, check-in, nota del día).

### 5.1 Hoy (pantalla estrella)
1. **Encabezado editorial**: «Día 7 de 21» en serif grande, fase (chip de color), fecha; la **planta del programa** (ilustración SVG propia que crece por etapas según constancia/días completos: semilla → brote → hojas → capullo → flor) — es la firma visual; sobria, no infantil.
2. **Anillo del día** (hábitos hechos / aplicables) + constancia + racha (secundaria) .
3. **Hábitos**: filas grandes de un toque (hecho), mantener/menú para «hoy no»; tip desplegable; aviso por condición.
4. **Agua**: botones +250 / +500 ml, deshacer, anillo o vaso con nivel, meta editable.
5. **Comidas por momento**: ítems con check, receta o libre; buscador con autocompletado sin tildes, alérgenos marcados; 4 sugerencias con motivo; «del plan» si hay plan para ese día (un toque las agrega).
6. **Check-in de 10 segundos**: energía, ánimo, digestión, chips de síntomas (con enlace al SOS del síntoma), nota; autoguardado; resumen compacto cuando ya se hizo.
7. **Nota del día / cita** (atribución honesta) + «Para mañana»: remojos necesarios según el plan de mañana, fermentos que maduran, fase que cambia.
8. Selector de día (franja horizontal con los días de la edición, hoy marcado, puntos de estado) para «reparar» días pasados.
Estados especiales: sin edición → tarjeta de bienvenida (elegir programa / empezar hoy / elegir fecha con atajos Hoy · Mañana · Próximo lunes, modo de inicio); edición futura → cuenta regresiva + checklist de preparación (cafeína a la mitad cada 2 días con su calendario, compras iniciales, remojos); edición terminada → tarjeta de cierre («Tu detox en números», ir al informe, reintroducción, repetir programa).

### 5.2 Cocina
Pestañas internas: **Recetas · Heladera · Plan · Batch · Remojos · Métodos**.
- Recetas: búsqueda sin tildes (título, ingredientes, tags), chips de categoría, filtros (apta para hoy/fase, sin mis alérgenos, favoritas, rápidas ≤ 20 min, propias), orden (sugeridas, A-Z, tiempo). Tarjetas con categoría, tiempo, alérgenos, favorito, «la cocinaste N veces».
- Detalle de receta: porciones con escalado (×½, ×1, ×2, ×3 sobre `qty` numéricas; fracciones legibles ½ ¼ ¾), ingredientes tildables, pasos, tip, nota personal, valoración, favorito, «Agregar al plan», «Agregar ingredientes a compras», «Registrar como comida de hoy», «Duplicar como receta propia», «Cocinar».
- **Modo cocina**: pantalla completa, letra grande (≥ 22 px), un paso por vez, ingredientes del paso resaltados, **temporizadores** del paso (varios simultáneos, por hora de fin, sonido WebAudio + vibración + notificación si hay permiso; bandeja flotante de timers persistentes en toda la app), **Wake Lock** con indicador (re-pedir en `visibilitychange`), navegación por gestos/teclas (←/→), al terminar registra «cocinada».
- Heladera: catálogo por categorías (todas las reales), buscador con sinónimos, taps rápidos válidos, «básicos de alacena», resultados por tier con faltantes y acciones.
- Plan: semana (lun–dom) con 4 momentos; agregar desde receta o desde el plan (selector), mover con botón «mover a…», copiar semana anterior, limpiar; vista lista en celular; genera compras y remojos.
- Batch: las bases (arreglado) con vida útil en heladera/freezer, recetas que la usan (con enlace), minutos ahorrados según el plan de la semana.
- Remojos: reglas (arreglado) con tiempo mínimo/óptimo, «descartar el agua / no descartarla» bien visible; arriba «Para tu plan de los próximos días» con hora sugerida de inicio.
- Métodos: 8 métodos + tabla de granos + reglas de legumbres.
- Recetas propias: formulario simple (título, categoría, tiempo, porciones, ingredientes uno por línea con detección de cantidad/unidad/ingrediente, pasos uno por línea, alérgenos, momentos).

### 5.3 Compras
Ver §4.7. Arriba: «Para esta semana» (plan) vs «Lista base del programa»; agregar rápido con autocompletado del catálogo; selector de rango; compartir; vaciar tildados.

### 5.4 Guía
- **Semáforo**: buscador grande «¿Puedo comer…?» sin tildes con sinónimos, filtros Libre/Con moderación/Evitar, tarjetas con ícono + palabra (no solo color), nota de fase.
- **SOS**: lista de protocolos; detalle con pasos, escalera de constipación (tildar qué probaste), cuándo consultar, hierbas y recetas relacionadas, avisos por condición del perfil.
- **Herbario** («Alimentos Medicina»): fichas con naturaleza térmica, propiedades, cómo usar, dosis, contraindicaciones **resaltadas si coinciden con las condiciones del perfil**, desbloqueo por día (agua de mar desde día 7).
- **El taller**: guía, contacto, grupo, Meet (encuentros pasados marcados como «realizado»), videos, productores.
- Aviso de salud fijo al pie de Guía y en el onboarding: «Material educativo del taller; no reemplaza la consulta médica. Si estás embarazada, en lactancia, tomás medicación o tenés una enfermedad crónica, consultá antes de empezar.»

### 5.5 Progreso
- Resumen de la edición: constancia, racha y mejor racha, días completos, puntos, logros (desbloqueados y por desbloquear, con criterio claro).
- **Mapa de la edición**: heatmap de N cuadros (color + ícono por estado: completo, parcial, gracia, sin datos, futuro).
- **Gráficos SVG propios**: energía/ánimo/digestión por día (línea + promedio), frecuencia de síntomas (barras), agua por día, semana 1 vs semana 3.
- Correlaciones honestas (§4.8). Cobertura culinaria (recetas probadas / total, línea de tiempo).
- **Diario**: vistas Día / Semana / Todo (de v1, mejoradas) con edición.
- **Historial**: todas las ediciones (de todos los programas) con resumen; abrir una pasada; **comparar dos ediciones** (tabla + líneas superpuestas).
- **Informe**: vista imprimible dedicada (CSS de impresión que imprime **solo** el informe), copiar texto (formato v1 mejorado, título «Informe de seguimiento», versión correcta), compartir.
- Reintroducción (§4.9).

### 5.6 Programas
Catálogo: Detox de Primavera (activo), Semana limpia 7, Reset 14, programas propios. Ficha: fases, hábitos, duración. «Empezar» crea una edición nueva (si hay una activa: «terminarla y archivar» o cancelar). Editor de programa propio (nombre, duración, fases simples, hábitos de una lista + propios, meta de agua) y «duplicar y modificar». Exportar/importar programa JSON. Sugerencia por estación (hemisferio sur).

### 5.7 Ajustes
Perfiles (crear, renombrar, color/emoji, borrar con confirmación escrita), alergias e intolerancias (ids + libres), condiciones de salud, constitución (con test de 4 preguntas de la guía para friolento/caluroso), porciones del hogar, meta de agua, tema (sistema/claro/oscuro), tamaño de texto (normal/grande), reducir movimiento, sonidos, **copia de seguridad** (exportar/importar, última copia), **sincronización** (§3.3), recordatorios .ics, reiniciar edición actual (confirmación en `<dialog>`, no `confirm()`), borrar todo, «Acerca de» (versión, créditos: guía de Isabel Caparra; datos locales; privacidad).

### 5.8 Búsqueda global
Botón en cabecera + `Ctrl/⌘+K` (mostrar la tecla correcta según plataforma) + `/`. Busca sin tildes en recetas, ingredientes, semáforo, SOS, herbario, hábitos, compras y días del diario (notas). Resultados agrupados; Enter/clic navega **al elemento exacto** (no solo a la pestaña). Foco automático al abrir.

### 5.9 Onboarding (primera vez, ≤ 4 pasos, salteable)
1. Bienvenida + aviso de salud. 2. Nombre (y «¿alguien más usa este dispositivo? podés sumar perfiles después»). 3. Programa + fecha + modo de inicio (o «después»). 4. Alergias/condiciones/constitución (opcional). Si hubo migración v1, el paso 3 se reemplaza por «Importamos tu progreso: Día X».

---

## 6. Dirección estética

Concepto: **«cuaderno botánico de primavera»** — papel cálido, tinta verde bosque, serif editorial para los números y títulos, ilustración vegetal propia, mucho aire. Calma, no clínica; elegante, no infantil. Nada de gradientes chillones, glassmorphism ni emojis como íconos estructurales (los emojis pueden quedar en contenido, p. ej. escalas de energía).

Tokens (en `tokens.css`, como variables CSS; tema por `data-theme` en `<html>` + `prefers-color-scheme` cuando el usuario elige «sistema»; acento por programa con `data-program-theme`):
```
Claro:  --paper #F6F1E7  --surface #FFFDF8  --surface-2 #EFE8DA  --line #DCD2C0
        --ink #1E2A22  --ink-2 #44503F  --muted #5C6858
        --accent #3D6B4F  --accent-ink #FFFFFF  --accent-soft #DDE9DA
        --bloom #B85C7A (flor / hitos)  --pollen #C98F1E (energía, ámbar)  --clay #A9563A (Evitar)
        --ok #3D7A4F  --warn #B7791F  --danger #B3412F
Oscuro: --paper #111714  --surface #19211C  --surface-2 #212B25  --line #2E3A33
        --ink #ECE7DC  --ink-2 #C6C9BC  --muted #9BA596
        --accent #8FC19A  --accent-ink #0F1A13  --accent-soft #23362A
        --bloom #E29AB2  --pollen #E6B85C  --clay #E08A6E
Temas de programa: primavera (verde + bloom rosa), otono (--accent #9A5B2A), invierno (#3E5C76), verano (#2F7A78).
```
Verificar contraste AA de todas las combinaciones texto/fondo usadas (anotar en DECISIONES el cálculo).

Tipografía (sin fuentes externas):
- Display: `"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", "Noto Serif", Georgia, serif` — números grandes con `font-variant-numeric: lining-nums tabular-nums`.
- Texto: `system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", sans-serif`; cuerpo 16–17 px (en `rem`), interlineado 1.5.
- Escala: 12 (solo metadatos) · 14 · 16 · 18 · 22 · 28 · 36 · 52 (número del día). Nunca < 12 px.

Componentes: tarjetas con radio 18 px, borde 1 px `--line`, sombra mínima en claro y ninguna en oscuro; chips; segment control; botón primario sólido acento, secundario contorno, terciario texto; filas táctiles ≥ 48 px; hojas inferiores (`<dialog>` con estilo bottom-sheet en celular, modal centrado en PC); toasts con `aria-live="polite"`; estados vacíos con ilustración lineal pequeña y una acción.

Iconografía: set propio de íconos SVG de línea (24 px, trazo 1.75, `currentColor`) definidos como `<symbol>` en un sprite inline: hoy, cocina, compras, guía, progreso, búsqueda, ajustes, agua, hoja, flor, fuego, reloj, timer, check, más, menos, cerrar, flecha, compartir, descargar, subir, nube, alerta, info, estrella, corazón, olla, cuchillo, frasco, semáforo, botiquín, planta, calendario, lista, filtro, editar, borrar, deshacer, persona, candado, sol, luna, sistema.

Movimiento: 160–240 ms `cubic-bezier(.2,.7,.2,1)`; check con trazo animado; anillo que se llena; la planta crece con un fundido. `prefers-reduced-motion` y el ajuste «reducir movimiento» desactivan todo salvo fundidos. Confeti propio y discreto (canvas, ≤ 1,2 s) solo en hitos (día completo, logro, fin de edición), desactivable.

Impresión: `print.css` imprime solo `.print-root` (informe), tipografía serif, sin fondos.

---

## 7. Implementación de la app (guía para la sesión de app)

- JS moderno sin frameworks. Mini-librería propia: `h()`/plantillas con escape obligatorio (`esc()`) de **todo** texto de usuario o de datos; delegación de eventos con `data-action`; store con `get()`, `update(fn)`, `subscribe()`; router por hash; cada pantalla = `render(params)` que devuelve HTML + `mount()` opcional.
- **No re-renderizar mientras se tipea**: inputs actualizan el estado sin re-render (re-render parcial de la sección afectada o al `blur`). Preservar scroll y foco en re-renders.
- Persistencia y sync en módulos separados; lógica de dominio en funciones puras exportadas a `DXApp.logic` para los tests.
- Errores: `window.onerror` muestra un aviso discreto con «Exportar copia» (nunca pantalla en blanco). Si el estado está corrupto: guardar el crudo en `detox2_state_corrupt_<ts>` y arrancar limpio con aviso.
- Manifest + SW: `build.py` genera `manifest.webmanifest` (íconos SVG inline en data URI no sirven en todos: generar `icon-192.png`/`icon-512.png` está fuera de alcance → usar SVG) y `sw.js` (cache-first del propio `index.html`, versión en el nombre de caché). El HTML registra el SW solo si `location.protocol === 'https:'`. El HTML **suelto** funciona sin ellos.
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` (sin bloquear zoom); `theme-color` por tema; favicon SVG inline (la planta).
- Rendimiento: listas largas (recetas, semáforo) con render diferido por lotes si hiciera falta; cálculos pesados memorizados por versión del estado.

---

## 8. Criterios de aceptación (los verifica la sesión de QA)

1. `python v2/build.py` produce las salidas; `node v2/tests/run.js` pasa todo (datos + lógica + migración + fusión de sync + calendario/racha + heladera + compras + .ics).
2. Abre sin errores de consola en Chrome/Edge escritorio y en vista móvil 360×800 y 390×844, tema claro y oscuro; cero scroll horizontal en todas las rutas.
3. Con un fixture de datos v1 cargado en `localStorage` (y otro solo en cookies) la app migra todo sin pérdida y muestra el día correcto.
4. Recorrido completo: onboarding → empezar hoy → tildar hábitos → agua → comida desde sugerencia → check-in → receta → modo cocina con timer → heladera → faltantes a compras → plan semanal → compras desde plan → compartir → semáforo → SOS → herbario → progreso (gráficos, informe imprimible) → exportar copia → importar copia en perfil nuevo → cambiar perfil → editar programa propio → nueva edición → comparar ediciones.
5. Recargar la página conserva todo; el botón atrás navega bien; búsqueda global lleva al elemento.
6. Accesibilidad: navegable con teclado; diálogos con foco atrapado y Esc; zoom permitido; contrastes AA.
7. Sin una sola petición de red al abrir (salvo sync si está vinculada).
