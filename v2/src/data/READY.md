# Capa de datos v2 — lista

Estado: **completa + ronda 2**. `node v2/tests/run.js` → **101 ok, 0 con error** (28 de datos en `v2/tests/data.test.js`). Generado el 15/11/2026.
Contrato: `rediseno-v2/ESPEC-V2.md` §2. Decisiones: `rediseno-v2/DECISIONES.md` (líneas `[datos]`). **No** se tocó `app/` (v1), `v2/src/app`, `v2/src/styles` ni `build.py`; no hubo commits ni descargas.

## Conteos por archivo

| Archivo | Clave `DX.` | Contenido |
|---|---|---|
| `00-namespace.js` | — | `window.DX`, `DX.dataVersion = '2.0.0'` |
| `taxonomy.js` | `taxonomy` | 12 categorías de receta · 4 momentos · 9 comercios · 13 alérgenos · 8 condiciones · 2 constituciones · energía y ánimo 1-5 · 4 digestiones · 17 síntomas · 26 categorías de ingrediente · 4 térmicas |
| `ingredients.js` | `ingredients` | **148** ingredientes (los 54 ids de v1 + 94 nuevos) |
| `recipes.js` | `recipes` | **105** recetas (73 de v1 + 32 nuevas) · 673 líneas de ingredientes (4 sin item de catálogo) · 495 pasos, 64 con `timer` · 12 aptas para monodieta · 5 con `limits` |
| `foods.js` | `foods` | **99** alimentos: 54 Libre · 31 Con moderación · 14 Evitar |
| `herbs.js` | `herbs` | **26** fichas (aguas, hierbas, suplementos, alimentos) con contraindicaciones por condición |
| `sos.js` | `sos` | **9** protocolos (constipación con escalera `ladder:true` de **8** pasos) |
| `shopping.js` | `shopping` | **101** ítems (los 50 ids de v1 + `x1…x51`); `stage:'previa'` marca la compra inicial |
| `methods.js` | `methods` | 8 métodos · 6 granos · 7 reglas de legumbres |
| `prep.js` | `prep` | 12 remojos · 6 bases de batch · 4 fermentos con hitos |
| `quotes.js` | `quotes` | 22 citas (día 0 a 21) |
| `programs.js` | `programs` | `detox-primavera-21` (3 fases, 6 hábitos, 5 hábitos de preparación, 25 notas, 9 logros), `semana-limpia-7`, `reset-14`, `custom` |
| `taller.js` | `taller` | guía, 2 encuentros, 2 videos, 4 productores |

Recetas por categoría: almuerzos 20 · desayunos 15 · ensaladas 14 · dips 10 · sopas 10 · alinos 9 · jugos 8 · panificados 5 · fermentos 5 · infusiones 5 · caldos 2 · leches 2.
El peso de los archivos es 371 KB (recipes.js, 215 KB): si el HTML final se acerca a los 600 KB, `build.py` puede compactar espacios sin tocar el contenido.

## Cómo se regenera

`recipes.js` lo escribe `node v2/tools/build-recipes.js [--diag]` a partir de `app/detox-data.js` (texto y pasos de v1) más las capas `v2/tools/recipes-v1-overlay.js`, `recipes-new.js` y `recipe-tips.js`. Los demás archivos se editan a mano.

## Para la sesión de app: campos extra sobre el contrato (se pueden ignorar)

- `recipes[].mayContain`: alérgenos que solo aparecen en ingredientes **opcionales** (mostrar como «puede contener»). `allergens` solo cuenta ingredientes obligatorios.
- `recipes[].time.wait` (minutos de remojo/leudado/fermentación); `ingredients[].qtyMax` en rangos («3 a 4»); `ingredients[].optional`.
- `programs[].habits[].warn` (texto por condición de `warnFor`); `dayNotes[].phase` (`previa`/`monodieta`/`general`: mostrar solo si coincide con la fase del día) y `.source`; `badges[].hiddenWhen`; `startModes[].monoDays`; `prepSchedule.caffeine`; `custom.habitLibrary`.
- Reglas de logros (`badges[].rule.type`): `daysComplete{n,grace}` · `phaseComplete{phase}` · `habitStreak{habit,n}` · `daysCompleteRange{from,to,grace}` · `distinctRecipesCooked{n}` · `waterGoalDays{n}` · `checkinDays{n}`.
- `herbs[].constitutionWarn`, `.cautions`, `.thermalText`, `.unlockDay`; `sos[].steps[].editorial/note`; `foods[].phases` (override por fase, p. ej. `monodieta:'red'`) y `.unlockDay`; `taxonomy.statusLabels`, `.ingredientCategories`, `.recipeTags`.
- Íconos de los datos = nombres del sprite (`bowl`, `olla`, `hoja`, `frasco`, `amanecer`, `taza`, `trigo`, `agua`, `sol`, `luna`, `cuchillo`, `candado`, `lista`, `guia`, `reloj`, `info`, `alerta`, `fuego`).
- `taxonomy.symptoms[].sos` apunta a los ids de `DX.sos` (`dolor-cabeza`, `frio-corporal`, `nauseas`, `constipacion`, `diarrea-flojera`, `acidez`, `mareos`, `debilidad`, `irritabilidad`).

## Advertencias

1. **Kimchi**: la guía dice 3000 g de manzana por 1 kg de akusay; se usan 300 g y la receta lo advierte. Falta confirmar con Isa.
2. **Encuentros del taller** (28/09 y 14/10/2026) ya pasaron: la app debe marcarlos «realizado».
3. **Pasos de v1**: se conservaron tal cual; algunos traen tiempos y temperaturas de horno que la guía no da. Los tips de 36 recetas quedaron en `null` (traían afirmaciones que la guía no hace).
4. Dos recetas de v1 no figuran en la guía (`crema-tibia-mijo-canela`, `manzanas-asadas-canela`): solo fase general y nota «verificar con Isa».
5. SOS de **acidez** y **mareos**: la guía no trae protocolo propio; los pasos que no son de la guía llevan `editorial:true`. `whenToConsult` es siempre texto editorial.
6. `thermal` de recetas, `limits` del tofu, `waterGoalMl`, `savesMin` y los días de freezer son criterio editorial (anotado en DECISIONES).
7. Ingredientes con `item:null` (4 líneas: «elegir 3 vegetales», dips a elección, aderezo a elección, flores comestibles): la heladera y las compras deben ignorarlas.
8. Los textos de la guía sobre suplementos incluyen dosis (agua de mar, chlorella, aloe); la app debe mostrar el aviso de salud fijo junto a esas fichas.

## Ronda 2 (correcciones tras la QA: QA-04, 21, 26 a 34)

Contrato nuevo en `recipes.js` (todo opcional para la app; ausente = falso):

- `ingredients[].suggested: true` — cantidad sugerida por el equipo (la guía no la da o dice «un poco»). 196 de 414 cantidades.
- `steps[].editorial: true` — paso, tiempo o temperatura que no viene de la guía (los `timer` de esos pasos se mantienen). 91 de 495 pasos.
- `recipe.editorialNote` — texto de aviso cuando la receta tiene marcas (80 recetas; las 2 de v1 fuera de la guía lo llevan completo).
- `servings` + `servingsEstimated: true` en 92 recetas; **13 con `null` explícito** (aliños, pickles, fermentos, rawmesan, gomasio).
- `ingredients[].choice: true` + `item:null` + `role:'principal'` — «elegir entre varios» (solo el trío de verduras al vapor); la heladera y las compras deben ignorar la línea. Las líneas `item:null` restantes son `optional`.
- `time.timeEstimated` → `recipe.timeEstimated: true` en las 5 recetas que no traían tiempo.
- `recipe.mayContain` ahora cubre toppings y alternativas (40 recetas).

Otros cambios: `herbs[].properties` atribuidas a la guía; `herbs[].contraindications[].scope` (albahaca: `'aceite esencial'`); `prep.soaking[].hoursEditorial` y `.note`; `ingredients[].pantry` solo en agua, sal marina y aceite de oliva; citas verificadas solo con fuente (Isabel Caparra con página en `context`); aceite de lino sin mayúsculas.

Para la sesión de app: (1) QA-04: con `choice` la receta no tiene principal real (`trio-verduras-vapor-semillas`); si la heladera cuenta principales, tratarla aparte. (2) QA-21: 15 recetas traen `qtyMax`; la suma de compras puede mostrar «1 a 2». (3) Mostrar «sugerido» / «propuesta del equipo» junto a las cantidades y pasos marcados; `servingsEstimated` pide un «aprox.».
Regenerar: `node v2/tools/build-recipes.js [--editorial]` (lista lo marcado; excepciones en `v2/tools/editorial-overrides.js`). Los datos pesan 392 KB (recipes.js 234 KB).

## Ronda 3

- `ingredients[].choiceCategory` (id de categoría de ingrediente) en toda línea `choice:true`: la heladera la da por cubierta si el usuario tiene cualquier ingrediente de esa categoría (hoy solo el trío de verduras: `verduras`).
- Ingrediente nuevo `mix_rawmesan` (casero; semillas + gluten) en lugar de `semillas_lino` en el trío de verduras y el bowl de arroz con rawmesan. Sin ítem de compra (se prepara con la receta `mix-rawmesan`).
- Citas: las 22 son `verificada`; 19 textuales de Isabel Caparra (página en `context`) más Newton, Paracelso y Durant. Ya no hay `atribuida`/`popular` con nombre propio (la UI puede dejar de anteponer «atribuida a…»).
- Las 7 recetas sin principal real son aliños, caldos e infusiones (categoría coherente); constan en DECISIONES.
