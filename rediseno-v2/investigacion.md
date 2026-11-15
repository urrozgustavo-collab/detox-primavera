# Investigación de mercado — Detox Primavera v2

> Fecha: 15/11/2026 · Alcance: lectura + este informe. No se tocó ningún otro archivo ni se instaló nada.
> Destino: web-app de **un solo archivo HTML**, sin servidor, datos en el dispositivo, uso por 2 personas en celular y PC, publicada en GitHub Pages.

## 0. Cómo leer este informe

- **Factibilidad** (en HTML/JS puro, sin servidor): ✅ factible · 🟡 parcial (con límites que se explican) · ❌ imposible.
- **Calidad de las fuentes.** La búsqueda devolvió sobre todo reseñas, listados de tiendas y blogs de terceros; casi nada oficial de las apps. Los datos de **MDN** (documentación técnica de navegadores) y los de **Mobbin / UCL / Polivy-Herman** (rachas) son los más sólidos. Las funciones de cada app están marcadas «según reseñas» cuando no se pudieron cotejar con la web oficial. Precios: las fuentes se contradicen; no los uso para decidir nada.
- **Lo que viene de mi conocimiento general** (no de una página leída hoy) está marcado con 🧠 para que se pueda verificar.
- **Inyección en páginas web:** ninguna de las páginas leídas completas (MDN, Mobbin, Can I Use) traía texto dirigido a una IA. Sí aparecieron resultados de búsqueda basura/irrelevantes (una página titulada «Find the Best Cosmetic Hospitals» que listaba apps de compras; otra de un sitio funerario austríaco con listado de apps de agua; otra con afirmaciones sin respaldo sobre «biofeedback con IA»). Se descartaron como fuente.
- **Traducción de jerga** la primera vez que aparece: *PWA* = web que se «instala» en la pantalla de inicio como una app; *Service Worker* = pequeño programa del navegador que permite funcionar sin internet; *localStorage* = cajón de datos del navegador (5 MB aprox.); *IndexedDB* = base de datos del navegador, mucho más grande; *heatmap* = calendario de cuadraditos coloreados según intensidad.

---

## 1. Programas guiados y retos de N días (detox, reset, ayuno, antiinflamatorio)

### 1.1 Qué hacen las apps de referencia

| App | Qué la distingue (según reseñas) |
|---|---|
| **Zero** | Temporizador de ayuno con fases, rachas, estadísticas; comunidad. Considerada la mejor gratuita de ayuno por Fortune. |
| **Yazio** | Temporizador de ayuno con protocolos 16:8, 18:6, 20:4 dentro de un registrador nutricional. |
| **Noom** | Enfoque psicológico/coaching en lecciones cortas diarias; según un competidor no trae temporizador de ayuno. |
| **Cara Care** | Programa estructurado de 12 semanas para dieta baja en FODMAP (IBS), con diario de comida + síntomas y reporte exportable para el médico. |
| **Fabulous** | «Viajes» (journeys): cursos guiados donde **cada paso se desbloquea cada ~3 días** y se apila sobre el anterior (hábito encadenado); sesión de coaching de 2-3 min cada mañana. |

Fuentes: [Fortune — mejores apps de ayuno](https://fortune.com/article/best-intermittent-fasting-apps) · [Nutrola — comparativa ayuno 2026](https://nutrola.app/en/blog/what-is-the-best-fasting-app-2026) · [Cara Care en App Store](https://apps.apple.com/us/app/cara-care-ibs-fodmap-tracker/id1133687886) · [Fabulous (reseña IU Medicine)](https://medicine.iu.edu/blogs/md-student-news/Wellness-Tips-Check-out-this-Fabulous-app) · [Fabulous (healthify.nz)](https://healthify.nz/apps/f/fabulous-self-care-app/?tab=33681).

Lifesum: la búsqueda no devolvió nada utilizable sobre sus planes; no lo cito. Simple y Welltory: no se investigaron a fondo (poco aporte probable; pendiente si se desea).

### 1.2 Funciones que realmente aportan

1. **Pantalla «Hoy» como centro del programa** (Oura rediseñó su app alrededor de *un* puntaje/insight principal; Fabulous y Noom giran en torno a «lo de hoy»). Patrón: día N de 21, una tarea principal, 3-5 secundarias. ✅
2. **Desbloqueo progresivo / fases** (Fabulous cada ~3 días; Cara Care por semanas de fase: eliminación → reintroducción). En 21 días: *Preparación (1-3) → Depuración (4-14) → Reintroducción (15-21)*. ✅
3. **Pequeña lección o «nota del día»** (2-3 min de lectura, como el coaching matutino de Fabulous). Un texto por día por programa. ✅
4. **Temporizador de ayuno / ventana de comida** (Zero, Yazio): anillo que cuenta horas, fases, hora de inicio editable. ✅ (con `Date.now()`, ver §9)
5. **Reintroducción de alimentos con registro** (Cara Care, protocolo FODMAP): al reintroducir un alimento se anota fecha + reacción; da un mapa personal de tolerancias. ✅ y muy diferenciador para un detox serio.
6. **Resumen final + reporte exportable** (Cara Care exporta para el médico). Al día 21: página «Tu detox en números» + PDF/imprimir. ✅/🟡 (PDF vía `window.print()`).

### 1.3 Advertencia de contenido (importante para un detox)

Las revisiones disponibles (J. Hum. Nutr. Diet. 2015; Front. Nutr. 2022, citadas en prensa) **no encuentran evidencia sólida** de que los «detox» eliminen toxinas más allá de lo que hacen hígado y riñones; la pérdida de peso a corto plazo es mayormente por menos calorías, y los jugos exclusivos pueden causar desbalances. Contraindicaciones señaladas: trastornos alimentarios, enfermedad cardíaca/renal, etc. ([Inquirer, ene-2026](https://www.inquirer.com/health/detox-cleanses-diets-big-business-low-reward-20260115.html) · [Choice](https://www.choice.com.au/health-and-body/diet-and-fitness/weight-loss/articles/do-detox-products-work) · [Today's Dietitian](https://www.todaysdietitian.com/cpe-monthly-examining-popular-detox-diets/)).
**Implicancia de diseño:** encuadrar la app como «programa de alimentación consciente / reset de hábitos» con aviso fijo («no reemplaza consejo médico; no usar con embarazo, trastornos alimentarios, diabetes, medicación sin consultar»), y **nunca mostrar números de «toxinas eliminadas»** ni promesas de curación. En la sección SOS/Botiquín, las hierbas deben llevar «consultá con tu médico» y alerta de interacciones. Esto protege a Gustavo y a su pareja.

---

## 2. Hábitos y rachas

### 2.1 Referencias

| App | Idea central |
|---|---|
| **Streaks** (iOS) | Pocas tareas (límite ~24), círculo-reloj minimalista, integración Apple Health. Sin social. |
| **Loop Habit Tracker** (Android, GPLv3, sin cuenta, datos locales) | **«Fuerza del hábito»**: puntaje que sube con cada repetición y baja con cada día perdido (no se reinicia a cero); gráficos, historial, exportar CSV. |
| **Habitica** | RPG: cada tilde da XP/oro. Techo de complejidad alto. |
| **Finch** | Mascota que crece con tus metas; elegís tus metas; hasta un hábito mínimo suma energía; ícono de «reparar» día perdido en vez de vacío. |
| **Fabulous / Atoms** | Apilado de hábitos (habit stacking), rutinas mañana/tarde/noche. |

Fuentes: [Resumen comparativo 2026 (TheMeaningMovement)](https://themeaningmovement.com/habit-tracker-app/) · [Loop — repositorio README](https://cdn.jsdelivr.net/gh/isoron/uhabits@dev/README.md) · [Loop — sitio](https://loophabits.org) · [Finch (screensdesign)](https://screensdesign.com/showcase/finch-self-care-pet) · [Finch (Pratt IxD)](https://ixd.prattsi.org/2025/09/design-critique-finch-ios-app-2/).

### 2.2 La evidencia sobre rachas (lo más útil de toda la investigación)

- Estudio de **859 diseños de rachas** (Mobbin): las rachas cuentan *días*, no progreso real; funcionan para *abrir la app*, no necesariamente para formar el hábito; **romper una racha puede drenar la motivación** (efecto «qué más da» de Polivy y Herman); el estudio de **Lally (UCL, 12 semanas)** halló que **un día perdido no afecta materialmente la formación del hábito**. Mecánicas de perdón cada vez más comunes: congeladores (Duolingo), modo pausa, reprogramar en vez de romper, reparar (Finch). En un test de Duolingo, bajar la exigencia (1 lección en vez de la meta completa) retuvo >40% más usuarios en racha de 7 días ([Mobbin](https://mobbin.com/blog/streaks-are-about-losing-a-study-of-859-streak-designs)).
- Cifras de impacto de Duolingo que circulan (21% menos abandono, etc.) vienen de blogs sin fuente primaria: **no usarlas como argumento**. ([resumen de búsqueda](https://dev.to/assindo/why-streaks-work-the-psychology-behind-habit-streaks-and-how-to-use-them-without-burning-out-42n0)).
- **Lo que esto implica para la app:** no una racha binaria que se reinicia a cero, sino **racha + «constancia» (% de días cumplidos) + día de gracia**; mensaje de retorno amable («un día no cambia nada, seguimos»).

### 2.3 Funciones recomendadas

1. **Check de 1 toque por hábito, en la pantalla Hoy**, con 3 estados: hecho / a medias / saltado a propósito (el «saltado» no rompe nada). ✅
2. **Anillo de progreso diario** (estilo Apple Activity: SVG con `stroke-dasharray`). ✅
3. **Calendario heatmap del programa** (21 cuadros; color por % cumplido; día de hoy resaltado; los días faltantes no se ven grises/vacíos sino neutros). Patrón estándar de Streaks/Loop. ✅
4. **«Constancia» tipo Loop** (promedio móvil ponderado que baja despacio) + **racha** + **mejor racha**, mostrando la constancia como cifra principal. ✅ (la fórmula es cálculo simple; 🧠 Loop usa un promedio exponencial).
5. **Día de gracia / «pausa»**: 1-2 por programa, que no cortan la racha (Duolingo, Paired, Alma). ✅
6. **Editar días pasados** («reparar» al estilo Finch): permitir marcar ayer hoy. ✅
7. **Hito de celebración sobrio** (día 7, 14, 21): confeti discreto o insignia; respetar `prefers-reduced-motion`. ✅
8. **Compromiso en pareja**: ❌ en vivo (no hay servidor); 🟡 con «exportar/importar» o compartir un resumen por WhatsApp (los amigos con racha compartida completan 22% más según el estudio de Duolingo citado por Mobbin; sin servidor solo se puede aproximar compartiendo una imagen/texto del progreso).
9. **Gamificación tipo Habitica/Finch**: ✅ técnicamente, pero **no recomendada** para este público/tema (la salud no es juego; riesgo de culpa). Mejor: insignias discretas.

---

## 3. Diario de síntomas, ánimo, energía y correlaciones

### 3.1 Referencias

| App | Patrón de UX |
|---|---|
| **Daylio** | Entrada de ~5 segundos: 1) ánimo con 5 caritas, 2) actividades en íconos, 3) nota opcional. Muy usable «en un mal día». Estadísticas que cruzan ánimo con actividades. |
| **How We Feel** | Check-in con matriz de color: placer (agradable/desagradable) × energía (alta/baja) y luego palabra de emoción con explicación; diario con foto/voz; sin notificaciones insistentes; opciones de reducir movimiento y apagar vibración. Diseñada con el Centro de Inteligencia Emocional de Yale. |
| **Bearable** | Registra ánimo/energía/sueño/síntomas + «factores» (cafeína, alcohol, hidratación, azúcar, actividad…) y **calcula correlaciones**. **Necesita ≥6 días de datos y 3 días con + 3 días sin el factor** para mostrarlas. «Experimentos» para probar un hábito nuevo. |
| **Cara Care** | Diario de comida + síntomas digestivos (tipo de deposición, urgencia, dolor) y exporte para el médico. |
| **mySymptoms** | No hubo resultados utilizables en la búsqueda. |

Fuentes: [Bearable en App Store](https://apps.apple.com/au/app/id1482581097) · [Bearable — symptom tracker](https://bearable.app/symptom-tracker/) · [Daylio (FoodAndNutrition review)](https://foodandnutrition.org/from-the-magazine/daylio-ios-version-1-5-1/) · [Estudio académico sobre Daylio (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5344152) · [How We Feel en App Store](https://apps.apple.com/us/app/how-we-feel/id1562706384) · [Oura — nuevo diseño](https://ouraring.com/blog/new-app-design/).

### 3.2 Funciones recomendadas

1. **Check-in de 10 segundos** diario: energía (1-5), ánimo (1-5), digestión (1-5) + chips de síntomas rápidos (dolor de cabeza, hinchazón, cansancio, antojos, insomnio…) + nota opcional. Un solo «Guardar». ✅
2. **Escalas con caritas/colores y etiqueta de texto** (no solo color: accesibilidad). ✅
3. **Línea de tiempo del día** (hora de cada comida/síntoma/hidratación), útil para ver «qué comí antes de sentirme así». ✅
4. **Gráficos de tendencia** (línea de 21 días por energía/ánimo/digestión; barras apiladas de síntomas). ✅ (SVG a mano o una librería pequeña; ver §10 sobre dependencias). 
5. **Correlaciones simples y honestas**, al estilo Bearable pero conservadoras: «los días con ≥2 L de agua tu energía promedió 3.8 vs 3.1»; requiere mínimo de datos (regla Bearable: 6 días + 3/3) y mostrar `n` (número de días). **Nunca afirmar causalidad.** ✅ (promedios por grupos; no hace falta estadística avanzada).
6. **Reintroducción como «experimento»**: marcar «hoy reintroduzco X»; la app cruza síntomas de las 24-72 h siguientes. ✅ Diferencial real para la semana de reintroducción.
7. **Informe imprimible/PDF** para el médico (Cara Care): historial 21 días + síntomas. 🟡 (`window.print()` con CSS de impresión; no genera PDF sin diálogo).
8. **Balance «Día 1 vs Día 21»**: comparar el promedio de la 1.ª y la 3.ª semana. ✅

Límites: sin servidor ni sensores, **no hay importación de datos de reloj/sueño** (Apple Health, Oura, etc.) ❌; todo es ingreso manual.

---

## 4. Recetas, modo cocina y planificador

### 4.1 Referencias

| App | Destacable (según reseñas) |
|---|---|
| **Paprika** | Modo cocina de pantalla completa que mantiene la pantalla encendida, tildado de ingredientes y de pasos, tamaño de letra ajustable, temporizadores integrados; lista de compras que fusiona ingredientes duplicados; despensa. |
| **Mela** | Varias recetas a la vez en modo cocina (cambiar entre ellas), temporizadores dentro del modo; categorías y «Quiero cocinar». |
| **Crouton** | Modo *un paso por vez*; tocar un ingrediente dentro del paso muestra su cantidad; pantalla encendida. |
| **Plan to Eat** | Calendario semanal: arrastrás recetas y arma lista consolidada; plan guardable para reutilizar; comidas congeladas; nutrición sumada. |
| **Samsung Food (ex-Whisk)** | Todo-en-uno gratis: recetario, planificador, lista; escalado de porciones (según una sola fuente); integración con tiendas (no replicable). |
| **Mealime** | Planes sencillos de 30 min, lista automática. |

Fuentes: [Comparativa Mealie/Paprika/KitchenOwl/Cooklang 2026](https://cooklang.org/blog/09-cooklang-vs-paprika-vs-mealie/) · [RecipeSage — alternativas a Crouton](https://recipesage.com/alternatives/crouton/) · [RecipeSage — alternativas a Paprika](https://recipesage.com/alternatives/paprika/) · [Mela vs otros (Deglaze)](https://www.deglaze.app/blog/deglaze-vs-paprika) · [Plan to Eat](https://www.plantoeat.com/?p=9210) · [Comparativa planificadores 2026 (Macaron)](https://macaron.im/es/blog/best-meal-planning-apps).
No encontré comparativa fiable sobre multi-temporizador simultáneo en cada app; lo tomo como buena práctica, no como dato.

### 4.2 Funciones recomendadas

1. **Modo cocina** (pantalla completa, letra grande, un paso por vez con «Siguiente/Anterior», ingredientes del paso visibles). ✅
2. **Pantalla siempre encendida** con la Screen Wake Lock API: ✅ en HTTPS/GitHub Pages; 🟡 en `file://` (ver §9). Reactivar al volver a la pestaña (la API se libera cuando la página se oculta).
3. **Temporizadores múltiples** por paso («cocinar 12 min»), con alarma sonora + vibración; calculados con hora de fin real (no con `setInterval` a secas). ✅ (alarma con la pantalla bloqueada: 🟡/❌; ver §9.5).
4. **Escalado de porciones** (×0.5, ×1, ×2) con cantidades en fracciones legibles. ✅
5. **Planificador semanal**: arrastrar o tocar «Agregar a martes/almuerzo»; vistas de 7 y 21 días; **repetir semana**. ✅ (arrastrar en celular es incómodo: usar botón «mover a…»).
6. **Heladera inteligente** (ya existe): «tengo estos ingredientes → recetas que puedo hacer» con % de coincidencia. ✅
7. **Lote de cocción (batch cooking) + remojos**: recordatorio «hoy dejá remojando las legumbres para mañana» (existe en v1; mantenerlo y vincularlo al plan). ✅ (aviso dentro de la app; notificación real 🟡).
8. **Notas y variantes por receta**, favoritos, etiquetas, «lo cociné N veces», puntuación personal. ✅
9. **Recetas propias**: formulario para crear/editar/duplicar. ✅ (clave para «más que detox»).
10. **Importar recetas desde un enlace** (Paprika, Mela, Crouton lo hacen): ❌ en HTML puro sin servidor (los sitios bloquean `fetch` por CORS, la política de seguridad cruzada del navegador). Alternativa: pegar texto y parsear ingredientes/pasos. 🟡

---

## 5. Listas de compras

### 5.1 Referencias
- **AnyList:** listas compartidas en tiempo real; **reordenar categorías para que coincidan con el pasillo del supermercado** o crear propias; conecta con recetas y planificador. ([AnyList](https://anylist.com/lists))
- **OurGroceries:** gratis, sincroniza en tiempo real entre hogares, agrupa por pasillo, tildado simple. ([ficha](https://mwm.ai/apps/our-groceries-shopping-list/325851015))
- **Bring!:** mosaicos visuales con ícono por producto, categorías, varias listas (una por comercio), sugerencias. ([comparativa Listonic](https://fpdev.listonic.com/best-grocery-list-apps) — fuente de competidor, orientativa)
Fuente de reseñas: [Chowhound](https://www.chowhound.com/1852927/grocery-list-apps/) · [TheSweetSetup](https://thesweetsetup.com/?p=3818). Algunas comparativas encontradas son de sitios de dudosa calidad y se descartaron.

### 5.2 Funciones recomendadas
1. **Lista generada desde el plan/recetas** con cantidades sumadas y unidades normalizadas (2 cebollas + 1 cebolla = 3). ✅
2. **Agrupado por rubro/pasillo** con **orden editable** según el comercio. ✅
3. **Tildar = baja al final y se atenúa**, no desaparece (se puede deshacer). ✅
4. **Varias listas** (feria, dietética, supermercado) y **«lo que ya tengo»** (despensa) que resta de la lista. ✅
5. **Agregar manual rápido** con autocompletado del catálogo propio. ✅
6. **Compartir por WhatsApp** (texto formateado por rubro) con Web Share o enlace `wa.me`. ✅ (v1 ya lo hace). Con Web Share también como archivo (🟡: depende del navegador).
7. **Sincronización en vivo entre dos celulares**: ❌ sin servidor. 🟡 Alternativa: «exportar/importar» o **código QR / enlace con la lista codificada** (el estado cabe en la URL si es chico). Aviso de que cada dispositivo tiene su copia.
8. **Escaneo de códigos de barras** (Bring!/AnyList): 🟡 existe `BarcodeDetector` solo en algunos navegadores 🧠; no recomendado.

---

## 6. Hidratación y recordatorios

### 6.1 Referencias
- **WaterMinder:** gráfico de consumo por hora y por tipo de líquido; metas editables (días de calor/entrenamiento); calendario; cronograma personalizable. 
- **Plant Nanny:** gamifica (se «riega» una planta); recordatorios **inteligentes** (solo avisa si no tomaste; si tomás a las 9:30, no avisa a las 10) y de intervalo fijo; sincroniza con Apple Health.
Fuentes: [Ficha Plant Nanny](https://apps.apple.com/gb/app/plant-nanny/id1424178757) · [Resumen Liquid IV (publicidad, orientativo)](https://www.liquid-iv.com/news/these-water-reminder-apps-keep-your-hydration-flowing). No hay documentación oficial; los detalles de WaterMinder son los menos verificados.

### 6.2 Funciones recomendadas
1. **Botones rápidos** (+1 vaso, +botella; +té/infusión) con anillo de progreso y meta (ej. 2-2,5 L; editable). ✅
2. **Deshacer** el último registro. ✅
3. **Gráfico por hora** (cuándo tomás agua) y semanal. ✅
4. **Recordatorio «inteligente» dentro de la app**: banner «hace 2 h que no registrás agua» al abrirla. ✅
5. **Recordatorio real con la app cerrada (notificación push programada)**: ❌ en HTML puro sin servidor (los navegadores no permiten programar notificaciones locales de forma fiable; el intento «Notification Triggers» no se generalizó 🧠). **Alternativa honesta:** botón «Agregar a calendario (.ics)» que crea eventos repetidos en el calendario del teléfono (Google/Apple Calendar suena con la app cerrada). ✅ — la solución más realista.
6. **Sensación de vaso lleno** (animación suave de agua, desactivable). ✅

---

## 7. Tendencias de diseño 2025-2026 para salud/bienestar

Las fuentes de tendencias son blogs de estudios de diseño con ideas repetidas; las uso como dirección, no como dato duro ([Updivision — color 2026](https://updivision.com/blog/post/ui-color-trends-to-watch-in-2026) · [Tubik — UI 2026](https://blog.tubikstudio.com/ui-design-trends-2026) · [Lyssna](https://www.lyssna.com/en/blog/app-design-trends) · [Moburst](https://www.moburst.com/blog/top-mobile-web-design-trends/) · [Merge — apps de salud bien diseñadas](https://merge.rocks/blog/8-best-designed-health-apps-weve-seen-so-far) · [Oura — rediseño](https://ouraring.com/blog/new-app-design/)). Lo concreto, filtrado:

### 7.1 Principios
- **Una cosa principal por pantalla** (Oura: «Hoy» con un solo puntaje/insight principal y el resto recortado). → La pantalla Hoy muestra *día N/21 + tarea siguiente + anillo del día*.
- **Calma por defecto:** muchos usuarios abren una app de salud cansados, con estrés o con poca luz: contraste y tamaños grandes son requisito, no lujo.
- **Dato con color de estado, pero nunca solo con color:** si el progreso solo se entiende a todo color, falla para parte de los usuarios (fuente de apps de fitness 2026). Añadir forma/texto/ícono.
- **Sin culpa:** lenguaje y diseño de perdón (ver §2.2).

### 7.2 Tipografía (propuesta concreta)
- Una **sans humanista o geométrica legible** + una **serif editorial** solo para títulos/citas: ej. *Inter* o *DM Sans* (texto) + *Fraunces* o *Newsreader* (títulos) — son de Google Fonts, pero para un archivo único conviene **fuente del sistema** (`system-ui`) + una sola serif embebida en base64 (~30-60 KB) o también sistema (`ui-serif`). 🧠 (criterio propio, no cita).
- Escala mínima: cuerpo **16-17 px**, subtítulos 20, títulos 28-34; interlineado 1.45-1.6; cifras tabulares para contadores (`font-variant-numeric: tabular-nums`).
- Modo cocina: **22-28 px** y botones ≥ 56 px.

### 7.3 Paleta
- **Base cálida neutra** (papel/crema `#F7F3EC`, carbón suave `#1F2421`) + **un acento natural** (verde salvia/oliva `#5F7A5A`; secundario terracota `#C26A4A` o ámbar `#D9A441` para energía) — coherente con «primavera» y con las paletas «naturales/terrosas» en las tendencias 2026.
- **Estados** (hecho/medio/saltado) con verde / ámbar / gris azulado **más ícono**.
- **Tokens como variables CSS** (`--bg`, `--surface`, `--text`, `--accent`…) y un `data-theme` para re-tematizar por programa (otoño = ámbar, invierno = azul pizarra, etc., ver §8).
- Contraste **≥ 4,5:1** para texto normal; 3:1 para elementos gráficos (anillos). Verificar con una herramienta.

### 7.4 Modo oscuro
- Tratarlo como un sistema completo, **gris-verde oscuro (≠ negro puro)** `#141A17`, superficies elevadas `#1D2420`, no invertir colores sin más; ajustar saturación (los acentos se desaturan en oscuro). Respeta `prefers-color-scheme` **más un interruptor manual** (3 opciones: sistema/claro/oscuro) guardado. (En v1.4.2 ya hubo bugs de modo claro/oscuro: probar ambos en cada pantalla.)

### 7.5 Movimiento
- Lento y con propósito: transiciones de 180-300 ms, `ease-out`; el anillo se llena al tocar; microinteracción de «hecho». Nada que rebote ni parpadee.
- **`@media (prefers-reduced-motion: reduce)`** (soportado en todos los navegadores desde 2020): reemplazar escalas/desplazamientos por fundidos suaves ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)). How We Feel ofrece además opción de apagar vibración.
- Vibración háptica: solo en Android (ver §9).

### 7.6 Accesibilidad
- Áreas táctiles ≥ 44×44 px (≥ 56 en cocina); foco visible; etiquetas `aria-label` en íconos; anillos con texto alternativo («7 de 10 vasos»).
- Respetar el tamaño de texto del sistema (usar `rem`, no `px` fijos en el cuerpo).
- Un solo plano de scroll vertical; **cero scroll horizontal** (v1.4.1 corrigió desbordes en móvil: dejar una prueba fija de ancho 360 px).
- Lenguaje claro en castellano rioplatense; íconos con texto.
- Navegación inferior (pulgar) en celular, lateral en PC; **5 destinos como máximo**: Hoy · Recetas · Compras · Diario · Más.

### 7.7 Patrones de visualización
- Anillo (Apple/Oura), **heatmap de 21 cuadros**, línea suavizada de 21 días con banda de «tu promedio», barras apiladas semanales, comparación «semana 1 vs semana 3». Pocos colores, leyenda con texto.

---

## 8. Generalizar de «Detox de Primavera 21 días» a una plataforma de programas

### 8.1 Idea
Pasar de «una app con un programa cableado» a **«motor + programas»**: la app es un motor que ejecuta *definiciones de programa* (datos JSON), y «Detox de Primavera» es el primer programa instalado. Foco actual intacto: al abrir la app por primera vez, se sugiere el programa vigente.

### 8.2 Modelo de datos (propuesta, cambios caros de revertir → decidir antes de construir)
```
programa      { id, nombre, estacion|tipo, duracionDias, fases[], hábitosBase[],
                plan[dia] {tareas, nota, comidas[] (ids de receta)}, meta{hidratación, ayuno...},
                tema{acento}, version, autor }
edicion       { id, programaId, fechaInicio, estado(activa|pausada|cerrada), notas,
                ajustes{} }          ← «una vez que lo corrés»
registro(día) { edicionId, fecha, hábitos{}, checkin{energía,ánimo,digestión,síntomas[]},
                agua[], comidas[], notaDiaria, ayuno{inicio,fin} }
biblioteca    { recetas[], alimentos[], hierbas[], hábitos[]  ← compartida por todos los programas }
perfil        { alergias, preferencias, unidades, tema, personas[] (Gustavo / pareja) }
```
- **Recetas, alimentos y hábitos viven en la biblioteca**, no dentro del programa (así Otoño reusa recetas de Primavera).
- **Todo registro cuelga de una «edición»**: así se puede **repetir el programa** (nueva edición con nueva fecha de inicio) y **comparar ediciones** (Primavera 2026 vs 2027).
- **Versión de esquema** (`schemaVersion`) en el almacenamiento y función de migración desde el esquema actual de la v1 (hay que auditar qué claves de `localStorage` usa el código viejo; lo hace la otra sesión).

### 8.3 Funciones de plataforma
1. **Catálogo de programas** (tarjetas): Detox Primavera 21 días (actual), Reset de Otoño, Antiinflamatorio, Mes sin azúcar, Ayuno 16:8 de 14 días, «Mi programa» (vacío). ✅
2. **Editor de programa propio** (nombre, duración, fases, hábitos, comidas por día) + **duplicar un programa** y modificarlo. ✅
3. **Repetir programa / nueva edición** conservando el historial anterior. ✅
4. **Comparar ediciones**: tabla y gráfico superpuestos (energía media, constancia, síntomas, peso si se registra) — Bearable hace algo parecido con «experimentos». ✅
5. **Programas por estación con sugerencia automática** según fecha (hemisferio sur: Primavera se inicia en septiembre). ✅
6. **Exportar/importar programa como archivo JSON** (compartir programas entre ellos o con otras personas). ✅
7. **Varias personas** (Gustavo y su pareja): perfiles separados dentro del mismo dispositivo; cada una con su historial. ✅ (cada celular tiene su propio almacenamiento; ver §10.)
8. **Línea de tiempo de «Mi historial»**: lista de ediciones con resumen (días cumplidos, constancia, mejores/peores síntomas) — responde al pedido de guardar historial y progreso. ✅

### 8.4 Cómo no perder el foco
- Primera pantalla: «Seguís en el día N de tu Detox de Primavera», el resto de la plataforma tras un botón «Programas».
- Tema/plantilla por programa pero **mismo diseño** (solo cambia el acento).
- Lanzar la plataforma en **v2.0 con solo 2 programas** (Primavera + «Mi programa»); sumar el resto después.

---

## 9. APIs del navegador (HTML local vs GitHub Pages)

### 9.1 Regla clave sobre `file://`
- MDN lista el esquema `file://` como **contexto seguro** (así que muchas APIs *funcionan en teoría*) junto con `https`, `localhost` y `127.0.0.1` ([MDN Secure Contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts)), **pero**:
  - **Service Worker no funciona desde `file://`** 🧠 (el registro solo acepta `http(s)`; MDN confirma que requiere contexto seguro y que `localhost` sirve; no menciona `file://`).
  - **`localStorage` en `file://` es impredecible:** la especificación lo deja sin definir; hoy, en los navegadores actuales, **cada archivo `file://` recibe su propio almacenamiento**; Safari históricamente lo rechaza; Firefox cambió el comportamiento en la v92 ([MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) · [bug Mozilla 1730419](https://bugzilla.mozilla.org/show_bug.cgi?id=1730419)). **Consecuencia:** si Gustavo abre el HTML descargado, sus datos viven *solo en ese archivo y esa ruta*; **renombrar o mover el archivo = «perder» los datos**.
  - La mayoría de las otras APIs de abajo se documentan como «solo HTTPS» en MDN; en `file://` el comportamiento depende del navegador y debe probarse.
- **Recomendación firme:** la versión *oficial* es la de **GitHub Pages (HTTPS)**; el archivo suelto queda como copia de emergencia/offline con aviso en pantalla («abierto como archivo: tus datos no se comparten con la versión web»). Detectar con `location.protocol === 'file:'` y mostrar el aviso.

### 9.2 Tabla de APIs

| API | Para qué | HTTPS/GitHub Pages | `file://` | Observaciones |
|---|---|---|---|---|
| **Screen Wake Lock** | Pantalla encendida en modo cocina/ayuno | ✅ Disponible (Baseline 2025). iOS Safari desde **16.4** ([Can I Use](https://caniuse.com/wake-lock)); Chrome 84+, Firefox 126+ | 🟡 probar | Se libera al ocultar la página o con batería baja → **volver a pedirla en `visibilitychange`**; mostrar un indicador y un interruptor ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)). Fallback: texto «mantené la pantalla activa». |
| **Notifications** (local) | Avisos con la app abierta/segundo plano reciente | 🟡 | 🟡/❌ | `new Notification()` **falla en la mayoría de móviles**; hay que usar `registration.showNotification()` (Service Worker) ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)). **Programar a una hora futura con la app cerrada = ❌** sin servidor push. En **iOS** las notificaciones web exigen **iOS ≥ 16.4 y la web instalada en pantalla de inicio**; pedir permiso solo tras un toque ([resumen Pushpad/MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide) — fuentes de terceros). **Sustituto fiable: archivo .ICS** al calendario del teléfono. |
| **Web Share** | Compartir lista/progreso por WhatsApp | ✅ (móvil) | 🟡 | Requiere HTTPS y un toque del usuario; soporte «limitado» (no está en todos los navegadores de escritorio); usar `navigator.canShare()` y *fallback* a copiar al portapapeles o `wa.me` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)). |
| **Vibration** | Háptica al terminar un timer | 🟡 Android | ❌ iOS | «Disponibilidad limitada»; Safari/iOS **no la implementa** 🧠; no confiar en ella: siempre acompañar con sonido y mensaje visual ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)). |
| **File System Access** | Guardar copia de seguridad en una carpeta elegida; reabrir sin diálogos | 🟡 Solo Chromium (Chrome/Edge escritorio, Android Chrome) 🧠 | 🟡 | `showSaveFilePicker`/`showOpenFilePicker`. **Fallback universal:** descargar con `<a download>` + subir con `<input type="file">` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)). **Usar el fallback como camino principal.** |
| **IndexedDB** | Historial grande, ediciones, fotos de comidas | ✅ | 🟡 (origen distinto por archivo) | Cuota de gigabytes (Chrome hasta 60% del disco; Safari ~60% en navegador). localStorage: 5 MiB. Ambas requieren `try/catch` ([MDN cuotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)). |
| **Storage persist** | Pedir que el navegador no borre los datos | ✅ `navigator.storage.persist()` | — | Chrome/Safari deciden solos según el uso del sitio; Firefox pregunta. **Safari borra datos de scripts de sitios sin interacción en 7 días de uso del navegador** (con prevención de rastreo) → instalar la web en pantalla de inicio y **ofrecer exportar copia periódica**. |
| **Service Worker** | Funcionar sin internet; «instalar» como app (PWA); caché de fuentes/imágenes | ✅ Requiere HTTPS (GitHub Pages sirve) o `localhost` | ❌ | Implica un archivo `sw.js` y un `manifest.json` **separados del HTML único** (rompe la regla «un solo archivo»; se puede minimizar con SW generado inline vía Blob, 🟡 no recomendado). |
| **Web Audio / `Audio`** | Alarma de timers | ✅ | ✅ | Hace falta un toque previo para «desbloquear» el audio en iOS 🧠. |
| **`prefers-color-scheme`, `prefers-reduced-motion`** | Temas y accesibilidad | ✅ | ✅ | Estándar. |
| **Clipboard API** | Copiar listas | ✅ | 🟡 | Requiere HTTPS y gesto del usuario. |
| **`BarcodeDetector`, cámara** | Escáner / fotos | ❌/🟡 | — | No recomendado en esta versión. |

### 9.3 Notificaciones sin servidor — resumen honesto
En una web estática **no hay forma fiable de que suene un aviso a las 18:00 con la app cerrada**. Opciones reales: (1) **.ics al calendario** (la mejor); (2) recordatorios *dentro* de la app al abrirla; (3) integración con un servicio externo (fuera de alcance «sin servidor»).

### 9.4 Persistencia y copia de seguridad (importantísimo: «guarda historial y progreso»)
- **Dónde guardar:** IndexedDB (con `localStorage` solo para preferencias pequeñas). Todo con `try/catch` (pueden fallar en modo privado o por cuota).
- **Un solo «store» con `schemaVersion`** + migraciones.
- **Botones de «Exportar copia (JSON)» e «Importar copia»**, con recordatorio mensual y **«última copia hace N días»** visible. Es la defensa contra: cambiar de celular, borrar datos del navegador, Safari y su límite de 7 días, mover el archivo local.
- **Mover datos entre celular de Gustavo y de su pareja / PC:** exportar JSON y compartir por WhatsApp/email; o QR si es chico.

### 9.5 Temporizadores confiables
Los navegadores **frenan los temporizadores en pestañas ocultas** (Chrome ~1 vez por minuto 🧠/ fuentes: [DEV](https://dev.to/sendotltd/a-multi-timer-kitchen-app-that-doesnt-drift-when-the-tab-is-backgrounded-j21), [DEV drift](https://dev.to/work_hau_cb718f47075930f9/javascript-countdown-timers-why-setinterval-drifts-and-how-to-fix-it-26fe)). Patrón correcto: **guardar la hora de fin (`Date.now()+ms`)**, calcular lo que falta en cada pintado y **recalcular en `visibilitychange`**; la alarma sonora puede programarse con Web Audio (una fuente lo midió estable, pero es un dato anecdótico). **Con la pantalla bloqueada no está garantizado** → mantener Wake Lock activo mientras corre el temporizador y probar en celulares reales.

---

## 10. Sobre el formato «un solo archivo HTML»

- La v1 usa Vue + Tailwind **por CDN** (descarga en cada carga; sin internet no abre). Para v2: **sin dependencias externas o con ellas embebidas** (JS vanilla o Preact/Alpine minificados dentro del HTML; estilos propios con variables CSS). Tailwind CDN en producción no se recomienda 🧠 (ellos mismos lo desaconsejan). Si se usa un script externo: versión exacta, origen oficial, verificar hash (regla de seguridad del equipo).
- **Tamaño:** v1 pesa ~480 KB. Objetivo v2 < 300 KB sin imágenes; recetas en datos compactos; las fotos (si hay) en IndexedDB, no dentro del HTML.
- **Gráficos:** SVG propio (anillos, líneas, heatmap) — ~150 líneas de JS; evita librerías.
- Una misma versión se publica como `index.html` en GitHub Pages y como copia descargable.

---

## 11. TOP 25 funciones recomendadas (impacto / esfuerzo)

Escala: Impacto A/M/B · Esfuerzo (S pequeño, M medio, L grande). Prioridad 1 = hacer primero.

| # | Función | Origen | Impacto | Esfuerzo | Factib. |
|---|---|---|---|---|---|
| 1 | **Pantalla «Hoy»**: día N/21, tarea principal, anillo del día, lista corta de hábitos | Oura, Fabulous | A | M | ✅ |
| 2 | **Almacenamiento robusto + exportar/importar copia JSON + «última copia hace N días»** | Loop (CSV/export) | A | M | ✅ |
| 3 | **Check-in de 10 s** (energía/ánimo/digestión + chips de síntomas + nota) | Daylio, How We Feel | A | S-M | ✅ |
| 4 | **Heatmap del programa (21 cuadros) + anillo de progreso** | Streaks, Loop | A | S-M | ✅ |
| 5 | **Racha + «constancia» (% móvil) + día de gracia** (sin reinicio a cero) | Loop, Duolingo, Finch | A | S-M | ✅ |
| 6 | **Modo cocina** (paso a paso, letra grande, ingredientes del paso) | Crouton, Paprika | A | M | ✅ |
| 7 | **Wake Lock** en modo cocina (re-activar en `visibilitychange`) | Paprika, Crouton | A | S | ✅ HTTPS |
| 8 | **Temporizadores por paso** (hora de fin + alarma sonora; múltiples) | Mela, Paprika | A | M | ✅/🟡 |
| 9 | **Hidratación con botones rápidos + anillo + deshacer + gráfico por hora** | WaterMinder | A | S | ✅ |
| 10 | **Historial de ediciones y «repetir programa»** (modelo edición/programa) | Plataforma | A | M-L | ✅ |
| 11 | **Corregir y blindar modo claro/oscuro con tokens CSS** + interruptor | Tendencias | A | M | ✅ |
| 12 | **Lista de compras generada desde el plan**, sumada y agrupada por rubro | AnyList, Paprika | A | M | ✅ |
| 13 | **Orden de rubros editable por comercio** + varias listas + tildado al final | AnyList, OurGroceries | M | S-M | ✅ |
| 14 | **Compartir por WhatsApp/Web Share** (lista y resumen de progreso) | AnyList | M | S | ✅ HTTPS |
| 15 | **Gráficos de tendencia 21 días** (energía/ánimo/digestión) | Bearable, Daylio | A | M | ✅ |
| 16 | **Correlaciones simples y honestas** (≥6 días + 3/3, muestra `n`, sin causalidad) | Bearable | A | M | ✅ |
| 17 | **Reintroducción como experimento** (alimento nuevo → síntomas 24-72 h) | Cara Care, FODMAP | A | M | ✅ |
| 18 | **Planificador semanal con «repetir semana»** (botón mover, no solo arrastrar) | Plan to Eat | M | M | ✅ |
| 19 | **Editor de recetas propias + duplicar + notas/variantes + escalado de porciones** | Paprika, Mela | M-A | M | ✅ |
| 20 | **Catálogo de programas + «Mi programa» + exportar/importar programa (JSON)** | Plataforma | M-A | L | ✅ |
| 21 | **Ayuno/ventana de comida con temporizador y fases** (opcional por programa) | Zero, Yazio | M | M | ✅ |
| 22 | **Recordatorios por .ICS** (agua, remojos, check-in) + banners dentro de la app | WaterMinder, Plant Nanny | M | S-M | ✅ |
| 23 | **Comparar ediciones** (Primavera 2026 vs 2027): tabla + curvas | Bearable | M | M | ✅ |
| 24 | **Informe imprimible / «Tu detox en números»** (día 21) y para el médico | Cara Care | M | S-M | 🟡 |
| 25 | **Aviso de salud fijo + alertas de contraindicación en SOS/hierbas** | Evidencia detox | A (riesgo) | S | ✅ |

Orden de ejecución sugerido: **Fase A (cimientos):** 2, 11, 1, 10 (modelo de datos) → **Fase B (diario y rachas):** 3, 4, 5, 9, 15 → **Fase C (cocina y compras):** 6, 7, 8, 12, 13, 14, 19 → **Fase D (plataforma e inteligencia):** 16, 17, 18, 20, 21, 22, 23, 24, 25 (25 puede ir en A: es barato).

Funciones **descartadas** por inviables o poco valiosas: sincronización en vivo entre dos celulares (❌ sin servidor); importar recetas por enlace (❌ CORS); integración Apple Health/Oura (❌); notificación programada con la app cerrada (❌ → .ics); escáner de código de barras (🟡 poco soporte); gamificación tipo RPG (✅ pero contraproducente para salud/culpa).

---

## 12. Errores comunes a evitar

1. **Rachas que se reinician a cero y castigan.** Provocan el efecto «qué más da» (Polivy/Herman) y abandono; un día perdido no daña el hábito (Lally/UCL). Usar constancia + gracia + reparar.
2. **Medir días, no resultados.** Las rachas hacen abrir la app, no mejoran la salud; mostrar también cómo se siente la persona.
3. **Afirmar causalidad o «toxinas eliminadas».** Correlación ≠ causa; mostrar `n` y mínimos de datos. Sin promesas médicas; aviso fijo y contraindicaciones (embarazo, trastornos alimentarios, enfermedades cardíacas/renales, medicación).
4. **Datos solo en `localStorage` sin copia de seguridad.** Se pierden al borrar el navegador, al cambiar de celular, por el límite de 7 días de Safari, o al mover un archivo local. → exportar/importar + recordatorio de copia.
5. **Abrir el HTML como `file://` y esperar que todo funcione** (Service Worker, almacenamiento compartido, sincronización). → versión oficial en GitHub Pages y aviso si se detecta `file:`.
6. **Confiar en notificaciones programadas** sin servidor, o en `new Notification()` en móviles. → `.ics` + banners internos.
7. **Confiar en `setInterval` para timers.** Se frenan en segundo plano; usar hora de fin + `visibilitychange`; siempre sonido + aviso visual (la vibración no existe en iOS).
8. **Wake Lock olvidado:** se libera sola al ocultar la pestaña; hay que volver a pedirla y mostrar que está activa con un interruptor (consumo de batería).
9. **Dependencias por CDN** (caída de red = app rota; riesgo de seguridad; peso). Embeber o prescindir; si es inevitable: versión exacta + verificación.
10. **Color como único indicador** de estado (daltonismo; sol fuerte). Añadir ícono/texto.
11. **Contraste flojo y letra chica** (usuarios cansados/de noche). ≥ 4,5:1, cuerpo ≥ 16 px.
12. **Animaciones decorativas** sin respetar `prefers-reduced-motion`; vibración/sonido sin interruptor.
13. **Ocultar el progreso perdido como un hueco gris** (señal de fracaso): mostrar neutro/«reparable».
14. **Arrastrar y soltar como única forma** en el planificador (mal en celular): dar botón «mover a…».
15. **Formularios largos de registro diario.** Más de ~10 s de carga de datos = abandono; empezar por lo mínimo y permitir detalle opcional.
16. **Cantidades sin normalizar en la lista de compras** (2 cebollas + 1 kg de cebollas). Normalizar unidades y fusionar duplicados.
17. **Mezclar esquema nuevo con datos viejos sin migración** (pérdida de historial de la v1). `schemaVersion` + función de migración + prueba con datos reales de la v1 antes de publicar.
18. **Cambiar de dispositivo a ciegas:** dos celulares = dos copias de datos distintas. Decirlo claramente en la interfaz y dar el camino de exportar/importar.
19. **Gamificación excesiva** (mascotas que «sufren», puntos): en salud genera culpa; si hay recompensa, que sea sobria y desactivable.
20. **Fuentes y datos del mercado sin cotejar:** varios datos de este informe vienen de reseñas; antes de copiar una función exacta de una app, verificarla en su sitio oficial.

---

## 13. Pendientes / límites de esta investigación

- No se leyeron los sitios oficiales de Zero, Yazio, Noom, Lifesum, Simple, Welltory, Habitica, Paprika, Mela, Crouton, AnyList, Bring!, OurGroceries, WaterMinder (solo reseñas/fichas de tienda). Si una función de este informe se vuelve decisiva, conviene cotejarla.
- No se verificó empíricamente (en celulares reales) el comportamiento del Wake Lock, los temporizadores con pantalla bloqueada ni el almacenamiento en iOS Safari; **probar en el celular de Gustavo y en el de su pareja** antes de comprometerse.
- Mapa de compatibilidad por navegador de File System Access y de Vibration: tomado de conocimiento general (🧠), no de la tabla de MDN (no se cargó en la lectura).
- Isabel Caparra: no se investigó el contenido de su programa (no era parte del encargo); los detalles de fases/alimentos deben salir de los datos de la v1.

## 14. Lista de fuentes

**Documentación técnica (más fiable)**
- MDN Screen Wake Lock: https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
- MDN Notifications: https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API
- MDN Web Share: https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
- MDN File System Access: https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
- MDN cuotas y desalojo de almacenamiento: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- MDN Vibration: https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
- MDN Service Worker: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- MDN contextos seguros: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts
- MDN `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- MDN localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Can I Use — Wake Lock: https://caniuse.com/wake-lock
- Bugzilla Mozilla (file:// y localStorage): https://bugzilla.mozilla.org/show_bug.cgi?id=1730419

**Rachas y hábitos**
- Mobbin, estudio de 859 diseños de rachas: https://mobbin.com/blog/streaks-are-about-losing-a-study-of-859-streak-designs
- Loop Habit Tracker: https://loophabits.org · https://cdn.jsdelivr.net/gh/isoron/uhabits@dev/README.md
- Resumen de apps de hábitos 2026: https://themeaningmovement.com/habit-tracker-app/
- Finch: https://screensdesign.com/showcase/finch-self-care-pet · https://ixd.prattsi.org/2025/09/design-critique-finch-ios-app-2/
- Psicología de las rachas (blog): https://dev.to/assindo/why-streaks-work-the-psychology-behind-habit-streaks-and-how-to-use-them-without-burning-out-42n0
- Fabulous: https://medicine.iu.edu/blogs/md-student-news/Wellness-Tips-Check-out-this-Fabulous-app · https://healthify.nz/apps/f/fabulous-self-care-app/?tab=33681

**Diario / síntomas**
- Bearable: https://bearable.app/symptom-tracker/ · https://apps.apple.com/au/app/id1482581097
- Daylio: https://foodandnutrition.org/from-the-magazine/daylio-ios-version-1-5-1/ · https://pmc.ncbi.nlm.nih.gov/articles/PMC5344152
- How We Feel: https://apps.apple.com/us/app/how-we-feel/id1562706384
- Cara Care: https://apps.apple.com/us/app/cara-care-ibs-fodmap-tracker/id1133687886

**Programas / ayuno / detox**
- Fortune, mejores apps de ayuno: https://fortune.com/article/best-intermittent-fasting-apps
- Nutrola, mejor app de ayuno 2026: https://nutrola.app/en/blog/what-is-the-best-fasting-app-2026
- Detox y evidencia: https://www.inquirer.com/health/detox-cleanses-diets-big-business-low-reward-20260115.html · https://www.choice.com.au/health-and-body/diet-and-fitness/weight-loss/articles/do-detox-products-work · https://www.todaysdietitian.com/cpe-monthly-examining-popular-detox-diets/

**Recetas / planificador / compras / agua**
- https://cooklang.org/blog/09-cooklang-vs-paprika-vs-mealie/ · https://recipesage.com/alternatives/crouton/ · https://recipesage.com/alternatives/paprika/ · https://www.deglaze.app/blog/deglaze-vs-paprika
- https://www.plantoeat.com/?p=9210 · https://macaron.im/es/blog/best-meal-planning-apps
- https://anylist.com/lists · https://mwm.ai/apps/our-groceries-shopping-list/325851015 · https://www.chowhound.com/1852927/grocery-list-apps/ · https://thesweetsetup.com/?p=3818 · https://fpdev.listonic.com/best-grocery-list-apps (competidor)
- https://apps.apple.com/gb/app/plant-nanny/id1424178757

**Diseño**
- https://updivision.com/blog/post/ui-color-trends-to-watch-in-2026 · https://blog.tubikstudio.com/ui-design-trends-2026 · https://www.lyssna.com/en/blog/app-design-trends · https://www.moburst.com/blog/top-mobile-web-design-trends/ · https://merge.rocks/blog/8-best-designed-health-apps-weve-seen-so-far · https://ouraring.com/blog/new-app-design/

**Notificaciones en iOS, temporizadores**
- https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide · https://pushpad.xyz/blog/does-safari-on-ios-support-web-push-notifications/
- https://dev.to/sendotltd/a-multi-timer-kitchen-app-that-doesnt-drift-when-the-tab-is-backgrounded-j21 · https://dev.to/work_hau_cb718f47075930f9/javascript-countdown-timers-why-setinterval-drifts-and-how-to-fix-it-26fe
