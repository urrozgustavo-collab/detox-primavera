# QA v2.3.0 — «A · Un paso a la vez»

> Sesión de QA (Claude Sonnet 5.5) · 18/11/2026 · Solo lectura: no se modificó código.
> Alcance: `index.html` armado con `python v2/build.py` (v2.3.0) y `node v2/tests/run.js` (**101 ok, 0 con error**).
> Cómo se probó: servidor local `http://127.0.0.1:8793`, navegador integrado (Chromium), viewports 360×800, 390×844, 800×900 y 1366×860, claro y oscuro, «Letra grande» activada y desactivada. Datos v1 sembrados con `rediseno-v2/qa-tools/seed.html` (variantes A, B-cookies, C-rotos, D-fecha inválida, E-terminado, F-futuro, Z-vacío). Ayudante propio: `rediseno-v2/qa-tools/qa23-helpers.js`.
> Nota de proceso: al armar, `build.py` reescribió `index.html` y `Detox-Primavera-App.html` (cambia la marca de fecha/hora del armado; ambos quedan idénticos entre sí).

## Resumen

| Severidad | Cantidad |
|---|---|
| Crítica | 0 |
| Alta | 0 |
| Media | 5 |
| Baja | 14 |

**Veredicto:** la reorganización cumple lo pedido: no se perdió ninguna función (ninguna acción de la interfaz desapareció respecto de la v2.2; todas las rutas viejas siguen vivas), no hay errores de consola, no hay pedidos de red al abrir (solo `index.html`) y la migración v1 funciona en todas las variantes. Los hallazgos son de pulido, de estados poco comunes y de accesibilidad.

---

## Hallazgos

| ID | Sev. | Ruta | Pasos | Esperado | Obtenido |
|---|---|---|---|---|---|
| QA23-01 | Media | `#/vos` (celular) | Abrir Vos en ≤ 520 px de ancho. | La planta (firma visual del programa; ESTADO v2.3 y DECISIONES: «la planta, chica, junto a la frase de avance») se ve también en el celular, que es el uso principal. | `sutil.css:335` la oculta con `@media (max-width:520px){.vos-plant{display:none}}`. En el celular la planta no aparece en ninguna pantalla (Hoy ya no la tiene): se perdió el indicador de crecimiento. Solo se ve en PC. |
| QA23-02 | Media | `#/hoy` con programa que empieza en el futuro (seed F: empieza en 4 días) | Abrir Hoy. | Se entiende que es «hoy» y que faltan 4 días; «Para mañana» habla de mañana. | La cabecera muestra la fecha del día de Preparación («Sábado 21 de noviembre», cuando hoy es miércoles 18) sin la marca «hoy»; «Preparación» aparece repetido (número grande y fase). El renglón «Para mañana» dice «Mañana empieza: Monodieta purificadora» aunque la monodieta empieza en 4 días. |
| QA23-03 | Media | `#/progreso/informe` y `#/ajustes` a 360 px con «Letra grande» | Ajustes → Letra grande; 360×800; abrir Informe y Ajustes. | Sin scroll horizontal (ESPEC §8.2). | Informe: la tabla mide 392 px y el documento hace scroll lateral (`scrollWidth` 392/360). Ajustes: el botón «Más porciones» (`data-action=servings`) queda en 326–366 px, scroll 366/360. Con texto normal a 360 px no pasa. |
| QA23-04 | Media | `#/cocina/receta/<id>` en PC (≥ 960 px) | Abrir una receta del final de la lista. | El buscador y los filtros siguen accesibles al lado de la receta (maqueta de computadora). | Buscador y filtros viven dentro de la lista con scroll propio (`.ks-list`, 8217 px de alto). Al abrir una receta la lista se desplaza hasta la seleccionada (scrollTop 7453) y el buscador queda a −7245 px: para filtrar hay que volver a subir toda la lista. |
| QA23-05 | Media | Hoy, hojas y tarjeta «Ahora» (accesibilidad) | Con teclado o lector de pantalla, tocar «Hecho» / «Hoy no». | El cambio de hábito se anuncia (región `aria-live`) y el foco no se pierde. | No hay ninguna región `aria-live` en la pantalla (0 en `#main`): el texto del hábito cambia en silencio. Al marcar el último hábito, `#focus-done` desaparece y el foco cae a `BODY`. (Con hábitos intermedios el foco sí se conserva.) |
| QA23-06 | Baja | Búsqueda → «Hábitos» estando ya en `#/hoy` | Ctrl K → «masticar» → resultado «En Hoy», desde Hoy. | Se despliega la lista y se resalta/desplaza al hábito (decisión `[v2.3]` de búsqueda). | Se despliega la lista, pero no hay desplazamiento ni resaltado: `onRoute` solo atiende `A.ui.scrollTo` cuando cambia la ruta, y aquí no cambia. Además `A.ui.scrollTo='h-habitos'` queda pendiente y se aplicaría en la próxima navegación. |
| QA23-07 | Baja | `#/hoy/<día pasado>`, `<día futuro>` y edición terminada | Tocar un tramo de la línea de 21 (pasado/futuro) o abrir Hoy con la edición terminada (seed E). | Etiqueta acorde al día («Pendiente», «Por venir»); el estado terminado no repite «Ahora». | Todos los días muestran «Ahora» + «Hecho / Hoy no»; en un día futuro los botones aparecen deshabilitados. En edición terminada se ve «Terminaste Detox de Primavera» y debajo «Jueves 29 de octubre · Día 21 de 21 · Ahora · Agua tibia con limón…» como si siguiera en curso. |
| QA23-08 | Baja | Hoy, heladera, compras | Ver renglón Comidas con merienda/cena sugerida; heladera con 1 ingrediente; badge de Compras. | Concordancia correcta. | «merienda sugerido» (`40-hoy.js:163`, siempre masculino); «Tenés 1 ingrediente marcados»; `aria-label="1 pendientes"`; resumen del check-in «digestión evacuación óptima». |
| QA23-09 | Baja | `#/vos`, `#/progreso` | Ver el mapa de días. | Estados distinguibles (ESPEC §8.7: contraste AA / no solo color). | Parcial, gracia y sin completar son grises casi iguales (2,15 : 1 en claro, 3 : 1 en oscuro); solo el aria-label los distingue. El mismo dato se dibuja dos veces con estilos distintos (círculos en Vos, cuadros con íconos en Progreso). |
| QA23-10 | Baja | `#/guia/...`, `#/progreso`, `#/ajustes` | Comparar con Hoy / Cocina / Vos. | Misma calma visual en toda la app. | Guía, Progreso, Ajustes y Programas conservan tarjetas con borde y cajas de la v2.2 (semáforo con tarjetas grandes de 8 líneas), mientras Hoy, Cocina y Vos son listas planas. Se nota el salto al entrar a Vos › algo. |
| QA23-11 | Baja | Hoja «Comidas» (celular) | Tocar el renglón Comidas. | Maqueta A: una línea tranquila («Almuerzo sugerido: bowl de yamaní»). | 2 sugerencias por momento (8 en total) y «· Aún no la probaste» repetido 8 veces, cada chip a 2–3 líneas en 390 px: bastante ruido para una hoja «calma». |
| QA23-12 | Baja | `#/cocina` (celular) | Mirar la fila de pestañas. | Maqueta: 4 pestañas visibles. | Hay 6; «Batch y remojos» queda cortada y «Métodos» fuera de pantalla; solo hay un degradé como pista de scroll. Descubrir Métodos requiere deslizar. |
| QA23-13 | Baja | `#/cocina` (390 px) | Mirar el buscador. | Placeholder completo. | «Buscar por nombre, ingrediente o etique…» truncado. |
| QA23-14 | Baja | Varias rutas | Abrir `#/programas/detox-primavera-21`, `#/guia/sos/zzz`, `#/vos/algo`. | Título de pestaña sensato y un `h1` por pantalla. | Título «Detox de Primavera · Programas · Detox de Primavera» (nombre repetido); pantallas «No encontramos esa receta/protocolo/ficha» sin `h1` (el foco cae en `#main`); `#/vos/algo` usa la frase entera de Vos como título. |
| QA23-15 | Baja | `#/cocina` orden «Sugeridas» | Con alergias cargadas, ver la lista. | Las recetas con «tu alergia» no encabezan «Sugeridas». | El orden es fase → veces cocinada → alfabético: «Aliño Cremoso de Palta…» (tu alergia) sale 3.º. Lógica de la v2.2, no de la v2.3. |
| QA23-16 | Baja | Check-in (hoja) | Abrir «¿Cómo te sentís?». | Maqueta A: puntos numerados limpios, chips de texto. | Escalas y chips con emoji y etiquetas largas («Evacuación óptima», «Despejado / cero síntomas»…): más recargado que la maqueta (contenido de datos, no del layout). |
| QA23-17 | Baja | `#/vos` | Ver encabezado. | Un solo acceso a Logros. | «190 puntos · 1 de 9 logros · ver logros» y, más abajo, la fila «Logros 1 de 9» van al mismo lugar (`#/progreso`); la fila «Progreso y gráficos» también. Tres entradas a lo mismo. |
| QA23-18 | Baja | Onboarding (Z o migrado) | Pasar el asistente con «Siguiente» sin tocar nada. | ESPEC §5.9: «o después». | «Hoy» y «3 días de monodieta» vienen preseleccionados y «Listo» crea la edición con inicio hoy sin que la persona lo haya elegido. |
| QA23-19 | Baja | `index.html` | Buscar `rel="manifest"`. | ESPEC §7: manifest enlazado. | No hay `<link rel="manifest">` en el HTML (tampoco en la v2.2); el manifest se genera pero no se usa. Preexistente. |

> Los hallazgos 15 y 19 son preexistentes a la v2.3; se listan porque aparecieron en el recorrido.

---

## Lo verificado OK

**Build y pruebas**
- `python v2/build.py` arma v2.3.0 (609 187 B); `node v2/tests/run.js`: 101 ok, 0 con error.

**1. Funciones (ninguna perdida)**
- Comparación de acciones `data-action` entre `HEAD` (v2.2) y la versión de trabajo en los 9 archivos de pantalla: solo se quitan `checkinOpen`/`checkinClose` (reemplazadas por `openLive`/`closeDialog`); se agrega `toggleAllHabits`. Ninguna función de interfaz desaparece.
- Alcanzables en ≤ 2 toques desde Hoy / Cocina / Vos: Recetas, Plan, Compras, Heladera, Batch y remojos (selector Bases/Remojos), Métodos, Receta propia (`#/cocina/nueva`), Progreso, Diario, Logros, Historial, Informe, Reintroducción, Semáforo, SOS, Herbario, Taller, Programas, Ajustes (perfiles, alergias, condiciones, constitución, porciones, meta de agua, tema, letra grande, reducir movimiento, sonidos, celebraciones, copia, sincronización, .ics, edición actual: cambiar fecha o modo / terminar / reiniciar, importación v1, borrar todo, acerca), búsqueda y menú del avatar (cambiar/sumar persona, tema, Programas, Ajustes).
- Receta: escalado ×½/×1/×2/×3, favoritos, «Al plan», «Comí esto hoy», ingredientes tildables, «Agregar a compras», temporizador por paso, valoración, nota, «Duplicar como propia» (enlace), «Cocinar paso a paso».
- Modo cocina: pantalla completa 390×844; temporizador del paso 3 (35:00) arranca, aparece en la bandeja del modo cocina y, al cerrar, en la bandeja flotante sobre la cápsula sin taparla.
- Heladera: marcar ingredientes → «Listas / Te falta poco» con faltantes; «Agregar faltantes» agrega al listado y muestra aviso con «Ver»; badge de pendientes en la pestaña Compras.
- «Para mañana» con plan de mañana (almendras): renglón, hoja y enlace «Ver» → Remojos.
- Perfiles: «Sumar persona» crea perfil nuevo (Hoy muestra bienvenida) y «Cambiar a este perfil» restituye el anterior.

**2. Rutas y navegación** (390 px y 1366 px, 28 rutas, sin errores)
- Viejas: `#/compras`, `#/compras/base`, `#/guia`, `#/guia/semaforo|sos|sos/<id>|herbario|herbario/<id>|taller`, `#/progreso`, `#/progreso/diario|historial|informe|reintro|edicion/<id>`, `#/programas`, `#/programas/<id>|nuevo|nuevo/<id>`, `#/ajustes`, `#/cocina/...`, `#/hoy/<fecha>`. Nueva: `#/vos`. Rutas desconocidas caen en Hoy; ids inexistentes muestran «No encontramos…» con enlace de vuelta.
- Pestaña activa de la cápsula correcta (compras → Cocina; guía, progreso, programas, ajustes → Vos); migas «‹ Vos» en las pantallas que viven en Vos.
- Botón atrás: Hoy ↔ día, y entre rutas, con `history.back()`.
- Búsqueda global: se abre y enfoca el campo (`#gs`), agrupa por tipo; recetas → receta; semáforo → alimento resaltado; ingrediente → heladera filtrada; SOS, herbario → ficha; compras → ítem resaltado (`sh-x31`); diario → día correcto con la hoja «¿Cómo te sentís?»; hábitos → lista desplegada. Ctrl K funciona (etiqueta «Ctrl K»). La tecla `/` no se pudo probar (la herramienta no envía eventos de teclado para ese carácter).

**3. Hoy**
- Próximo hábito = primero sin marcar; «Hecho» y «Hoy no» avanzan al siguiente; «ver todos» despliega la lista (6 hábitos, estados hecho/skip/pendiente), tips, «Deshacer» y desmarcar funcionan; al completar los 6: «Día completo. Bien ahí.» + confeti y marca en la línea.
- Línea de 21 tramos: 22 enlaces (prep + 21), `aria-current="date"` en el día mirado, etiquetas «Día N, fecha — estado»; tocar el tramo del día 3 navega a ese día.
- Agua: «+» rápido suma 250; hoja con +250 / +500 / Deshacer / meta (segunda hoja encima); el renglón se actualiza al instante.
- Comidas: sugerencia agrega y marca como comida; tilde/destilde; «Agregar» abre hoja con buscador (conserva el foco al tipear), sin tildes («lim» → recetas con limón), alérgenos marcados, «Registrar “…” como comida libre».
- ¿Cómo te sentís?: energía, ánimo, digestión, señales con enlace SOS, nota con autoguardado que conserva el foco; el renglón resume el registro.
- Nota del día (nota + cita con atribución) y «Para mañana» (solo si hay algo).
- Estados: sin programa → «Empezá tu programa» (+ asistente de 4 pasos); fecha inválida → «Elegí cuándo empezar»; futuro → cuenta regresiva + «Bajar la cafeína de a poco» + compras iniciales; terminado → «Programa terminado» con informe, reintroducción y repetir; día futuro: solo lectura (botones y «+» deshabilitados, avisos «Todavía no llegó»); día pasado: editable con aviso y «Volver a hoy».

**4. Hojas y panel lateral**
- Celular: hoja inferior (radio 28 px, `top` 92 px en las altas), scroll interno (`.sheet-b` `overflow-y:auto`, p. ej. check-in 973/640), el fondo no se desplaza, sin scroll horizontal, también con «Letra grande» a 360 px.
- PC: panel derecho de 440 px a altura completa; scroll interno; Tab cicla solo dentro del diálogo (40 pulsaciones); Esc cierra y el foco vuelve al renglón que lo abrió (`data-k`); clic en el fondo cierra (código). Cambiar el ancho a < 960 px vuelve a pintar (lista + receta → receta sola) y sin scroll lateral a 800 px.
- Nota: con dos hojas apiladas un solo Esc cerró ambas, pero un par de `<dialog>` de control ajenos a la app se comportó igual en este navegador de pruebas: se considera un artefacto de la herramienta, no un error de la app.

**5. Fidelidad a las maquetas**
- Hoy celular: fecha, «Día N de 21» liviano, fase en coral, línea de 21, tarjeta «Ahora» con Hecho / Hoy no y puntitos, renglones Agua (+), Comidas, ¿Cómo te sentís?; cápsula de 3 destinos con la activa en tinta. Hoy PC: dos columnas (día + foco | línea + renglones), barra superior con nombre y día, cápsula al centro, «Buscar Ctrl K» y avatar a la derecha. Cocina PC: lista de 380 px + receta lado a lado con la lista que recuerda su scroll. Vos: frase de avance, mapa de días, energía y ánimo, accesos agrupados.
- Diferencias aceptadas (documentadas en DECISIONES): «Para mañana» aparece todo el día cuando hay algo (la maqueta decía «solo de noche»); Cocina con 6 pestañas (la maqueta mostraba 4).

**6. Migración y robustez**
- Seed A (localStorage), B (solo cookies), C (JSON roto + fecha 2026-02-31 + estado inventado), D (fecha inválida), E (terminado), F (futuro), Z (vacío): migra sin pérdida (inicio 12/11, modo, días 0–2 con hábitos y diario, alergias → ids + libres, heladera, código `GUS-7Q4K`, tema), muestra «Importamos tu progreso: 3 días con registros · Hoy es tu día 7 de 21» y avisos de lo omitido en Ajustes › Datos de este dispositivo; el caso C queda «sin fecha» y pide elegirla. Cero errores de consola y cero `error`/`unhandledrejection` durante todo el recorrido.
- Red: al abrir solo se pide `index.html` (sin manifest, fuentes ni íconos remotos); las únicas URL externas del HTML son enlaces (`wa.me`, kvdb para sync, repositorio).
- Sin scroll horizontal en 26 rutas × (360 px oscuro, 390 px, 800 px, 1366 px); solo los casos de QA23-03 con letra grande a 360 px.

**7. Accesibilidad básica**
- Enlace «Saltar al contenido»; puntos de referencia (`header`, `nav`, `main`) y un único `nav` visible por viewport; `lang="es-AR"`; zoom permitido; todos los botones/enlaces visibles tienen nombre accesible; anillo de foco visible (2 px verde) con teclado; diálogos con `aria-labelledby`; toasts con `aria-live="polite"`; botones con `aria-pressed`/`aria-expanded`/`aria-haspopup`.
- Contraste de texto (calculado sobre Hoy, Vos, Cocina, receta, semáforo, Progreso, Ajustes, Compras y Plan, claro y oscuro): sin ratios por debajo de 4,5 : 1 (3 : 1 en texto grande); placeholder 4,88 : 1 claro / 6,31 : 1 oscuro.

## No verificado (límite de las herramientas)
- Tecla `/` para abrir la búsqueda; botón atrás físico de Android con una hoja abierta; impresión real del informe; sincronización con kvdb (no se hacen pedidos de red); lector de pantalla real; arranque en un celular real (solo emulación de viewport).
