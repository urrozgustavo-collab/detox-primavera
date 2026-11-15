/* Detox de Primavera v2 — programas.
   detox-primavera-21 (completo, guía de Isabel Caparra), semana-limpia-7 y reset-14 (derivados de la misma guía) y la plantilla `custom` del editor.
   Campos extra respecto del contrato (la app puede ignorarlos): habits[].warn (texto por condición), dayNotes[].phase/source,
   badges[].hiddenWhen, startModes[].monoDays, prepSchedule, habitLibrary (solo en `custom`).
   Tipos de regla de logros (los implementa la app, ver ESPEC §4.6):
     daysComplete{n,grace?} · phaseComplete{phase} · habitStreak{habit,n} · daysCompleteRange{from,to,grace?} · distinctRecipesCooked{n}
     waterGoalDays{n} · checkinDays{n}. */
(function (root) {
  'use strict';
  root.DX = root.DX || {};

  // ───────── Hábitos diarios (ids de v1) ─────────
  var HABITS = [
    { id: 'limon', text: 'Agua tibia con limón en ayunas',
      tip: 'Al inicio, el jugo de ½ limón; después, el de 1 limón. Si sos friolento/a, agregá una puntita de cdita de jengibre seco o canela (o el jugo del jengibre fresco rallado, más recomendado si tenés mucha flema). Pasada la primera semana, podés cambiarlo por agua de mar en ayunas (opcional).',
      icon: 'agua', phases: ['monodieta', 'general'], warnFor: ['ulcera_gastritis'],
      warn: { ulcera_gastritis: 'Con úlcera, el jengibre está contraindicado. Con acidez matutina, consultalo con Isa antes de seguir con el limón en ayunas.' } },
    { id: 'masticacion', text: 'Masticar al menos 20 veces por bocado y comer sentado/a',
      tip: 'Comer sentado/a, no parado, caminando ni manejando. No olvidarse de tomar mucha agua.',
      icon: 'cuchillo', phases: ['monodieta', 'general'], warnFor: [], warn: {} },
    { id: 'infusion', text: '2 a 4 tazas de infusión depurativa, sin endulzar',
      tip: 'Elegí una (manzanilla, ortiga, diente de león, albahaca con jengibre, menta, triple flor) o rotalas. Leé antes las contraindicaciones de cada hierba en el herbario. Nunca endulzar.',
      icon: 'hoja', phases: ['monodieta', 'general'], warnFor: ['anticoagulantes', 'embarazo', 'lactancia'],
      warn: { anticoagulantes: 'La ortiga no se usa con anticoagulantes (espesa la sangre). Elegí otra infusión.',
        embarazo: 'Carqueja y caléndula están contraindicadas en el embarazo; la manzanilla, en dosis terapéuticas. Consultá las fichas del herbario.',
        lactancia: 'La menta puede inhibir la lactancia y la caléndula en uso terapéutico está contraindicada. Consultá las fichas del herbario.' } },
    { id: 'no_estimulantes', text: 'Cero café, yerba mate, té negro, alcohol ni azúcar',
      tip: 'Si necesitás bombillear, usá un mate 100 % de yuyos. Los primeros días podés tomar té verde, banchá o matcha si lo necesitás para que sea más llevadera la falta de cafeína.',
      icon: 'candado', phases: ['monodieta', 'general'], warnFor: [], warn: {} },
    { id: 'hidratacion', text: 'Agua tibia durante todo el día (termo)',
      tip: 'Calentar agua de filtro a la mañana y llevarla en un termo. Si querés, agua ionizada: hervirla 15 a 20 minutos y tomarla caliente, de a sorbitos.',
      icon: 'agua', phases: ['monodieta', 'general'], warnFor: [], warn: {} },
    { id: 'plato_verde', text: 'Al menos una comida abundante en verduras verdes o crucíferas',
      tip: 'Brócoli, coliflor, espinaca, kale o repollitos de Bruselas, al vapor, blanqueados o en nituke. Siempre más proporción de verduras que de cereal o legumbre.',
      icon: 'hoja', phases: ['general'], warnFor: [], warn: {} }
  ];

  var PREP_HABITS = [
    { id: 'prep_cafeina', text: 'Bajar a la mitad el café, mate o té de hoy',
      tip: 'Si tomás café, mate o té varias veces por día, reducí la dosis a la mitad cada 2 días para llegar sin abstinencia brusca (por ejemplo: 6 → 3 → 1 o 2 → 0).',
      icon: 'candado', phases: ['previa'], warnFor: [], warn: {} },
    { id: 'prep_compras', text: 'Hacer las compras iniciales',
      tip: 'Arroz integral, manzanas, limones y sal natural. Opcional: sésamo, salsa de soja fermentada (Shoyu MOA) o té verde, banchá o matcha. La lista completa está en Compras.',
      icon: 'lista', phases: ['previa'], warnFor: [], warn: {} },
    { id: 'prep_guia', text: 'Leer la guía hasta la página 25',
      tip: 'Isa la recomienda como eje rector de los 21 días. Es bueno tenerla a mano. En esta app están las fichas del herbario y del semáforo.',
      icon: 'guia', phases: ['previa'], warnFor: [], warn: {} },
    { id: 'prep_video', text: 'Mirar el primer encuentro grabado del taller',
      tip: 'Isa pide verlo antes de empezar. Lo encontrás en Guía → El taller.',
      icon: 'reloj', phases: ['previa'], warnFor: [], warn: {} },
    { id: 'prep_remojo', text: 'Dejar el arroz en remojo para mañana',
      tip: 'Si podés ponerlo en remojo la noche anterior, es lo ideal para sacar el ácido fítico (guía, pág. 29).',
      icon: 'frasco', phases: ['previa'], warnFor: [], warn: {} }
  ];

  // ───────── Frases por fase (texto de la guía) ─────────
  var MONO_ALLOWED = ['nituke-manzana', 'compota-manzana', 'licuado-jugo-manzana', 'arroz-integral-tibio', 'caldo-detox', 'caldo-de-miso', 'gomasio', 'agua-de-lino',
    'infusion-quelante-ortiga-diente-leon', 'mate-medicinal-hierbas', 'infusion-digestiva-albahaca-jengibre', 'infusion-calmante-triple-flor'];

  var PHASE_PREVIA = { id: 'previa', name: 'Preparación',
    desc: 'Antes de empezar: bajar la cafeína a la mitad cada 2 días, hacer las compras iniciales y leer la guía.',
    tips: ['Si tomás café, mate o té varias veces por día, reducí la dosis a la mitad cada 2 días.', 'Compra inicial: arroz integral, manzanas, limones y sal natural; opcional sésamo, shoyu y té verde.', 'El mate se reemplaza por mate de yuyos (sin yerba mate).'] };
  var PHASE_MONO = { id: 'monodieta', name: 'Monodieta purificadora',
    desc: 'Los primeros días entrás en depuración con una alimentación a base de manzanas y arroz yamaní. Si así lo sentís podés hacerlo 1, 2 o 3 días; lo que puedas va a estar bien. Si no te sentís con ganas, arrancás directamente con el plan alimentario.',
    allowedRecipes: MONO_ALLOWED,
    tips: ['Desayuno y merienda: manzana entera o trozada, licuado o jugo de manzana, nituke o compota, o arroz integral tibio.',
      'Almuerzo y cena: arroz basmati integral, largo fino o yamaní, preferentemente orgánico, solo con sal, gomasio o shoyu MOA, sin aceite (si no lo soportás, entre ¼ y ½ palta por comida).',
      'No hay límite de cantidades: comé lo que necesites para saciarte.', 'Mantenete bien hidratado/a: agua natural o tibia, caldo détox o caldo de miso.'] };
  var PHASE_GENERAL = { id: 'general', name: 'Menú depurativo',
    desc: 'Plan alimentario del détox: cereal o legumbre + dips o aliños + verduras, siempre con más proporción de verduras que de cereales o legumbres. Se incentivan el poroto mung, la quinoa y el arroz integral.',
    tips: ['Los alimentos que más trabajan el hígado son los verdes en mayor cantidad, y también violetas y naranjas.', 'Aceite de oliva extra virgen de primera presión, en crudo; aceite de lino: 1 cda por comida (o 2 cdas de semillas molidas), salvo flojera intestinal o diarrea.',
      'Si te sentís muy débil, la guía permite pescado, algunos huevos o caldo de huesos, preferentemente al mediodía.', 'Si sos friolento/a, solo cosas cocidas y calientes; los crudos, a la mañana o al mediodía.'] };

  // ───────── Notas del día (texto de la guía; ≤ 2 frases) ─────────
  function N(day, phase, text, source) { return { day: day, phase: phase, text: text, source: source || 'guía' }; }
  var NOTES_21 = [
    N(0, 'previa', 'Bajá a la mitad tu dosis de café, mate o té y hacé las compras iniciales. Isa recomienda leer la guía hasta la pág. 25.', 'guía y material del taller'),
    N(1, 'monodieta', 'En ayunas: jugo de ½ limón con agua tibia. Después, manzana entera, licuado, nituke o compota, o arroz integral tibio.'),
    N(2, 'monodieta', 'Almuerzo y cena: arroz integral solo con sal, gomasio o shoyu MOA, sin aceite. Podés sumar ¼ a ½ palta por comida si no lo soportás sin aceite.'),
    N(3, 'monodieta', 'Bebidas: agua natural o tibia, agua ionizada, licuado de manzana al agua, caldo détox o de miso. El té verde es opcional los primeros días.'),
    N(1, 'general', 'Arrancás directo con el plan: cereal o legumbre, dips o aliños y verduras. No hay límite de cantidades; comé lo que necesites para saciarte.'),
    N(2, 'general', 'Mantenerte hidratado/a ayuda a mitigar los síntomas que pueden surgir durante la desintoxicación.'),
    N(3, 'general', 'Si surge constipación al dejar la cafeína, andá sumando de a una las opciones de la escalera del SOS.'),
    N(4, 'general', 'El plato: cereal o legumbre + dip o aliño + una de las opciones de verduras de la guía.'),
    N(5, 'general', 'Incentivá el consumo de poroto mung, quinoa y arroz integral, y usá más proporción de verduras que de cereal o legumbre.'),
    N(6, 'general', 'Para mover el hígado: 1 cda de cebolla morada o de verdeo, 1 diente de ajo, 4 a 8 rabanitos, chucrut o kimchi, o jugo de jengibre rallado.'),
    N(7, 'general', 'Pasada la primera semana podés sumar agua de mar en ayunas en vez del limón (opcional). Empezá con 2 cdas durante 5 días.'),
    N(8, 'general', 'Si sos muy friolento/a: solo cosas cocidas y calientes. Los crudos, a la mañana o al mediodía, si el clima y tu temperatura corporal acompañan.'),
    N(9, 'general', 'Aceite de lino: 1 cda por comida es la dosis terapéutica; sin aceite, 2 cdas de semillas molidas. Con flojera intestinal o diarrea, evitá el lino.'),
    N(10, 'general', 'Condimentos permitidos: limón, lima, vinagre de sidra de manzana, sal marina, mostaza antigua o de Dijon, pimienta negra, hierbas frescas y especias.'),
    N(11, 'general', 'Meriendas: bastones de apio, hinojo, zanahoria o pepino con dips, fruta, caldo détox, caldo de miso o un bowl de arroz con rawmesan o gomasio.'),
    N(12, 'general', 'Comé sentado/a, no parado, caminando ni manejando, y masticá un mínimo de 20 veces por bocado.'),
    N(13, 'general', 'Las legumbres se dejan en remojo la noche anterior, se cocinan sin sal y la sal va al final de la cocción.'),
    N(14, 'general', 'Si te sentís muy débil o no querés pasar 21 días sin proteína animal, la guía permite pescado, algunos huevos o caldo de huesos, preferentemente al mediodía.'),
    N(15, 'general', 'Papa y batata: no más de 1 vez por semana. Fideos integrales de trigo: 1 o 2 veces durante todo el détox; los de otros granos, 1 vez por semana.'),
    N(16, 'general', 'Si tendés a la humedad, los mocos o la flema: cebolla o ajo (salvo gastritis o acidez) y rabanitos o nabo, más jugo de jengibre, en todas las comidas.'),
    N(17, 'general', 'Si a falta de mate necesitás bombillear, usá yuyos: menta, cola de caballo, lavanda, ortiga, manzanilla, llantén, diente de león, pétalos de rosa o cedrón.'),
    N(18, 'general', 'El tofu no se usa diariamente. Para las galletas, elegí las del recetario o marcas de semillas o arroz (no «crackines»).'),
    N(19, 'general', 'La guía pide evitar durante el détox el alcohol, los aceites comunes, las margarinas, los ultraprocesados, las gaseosas, los lácteos y los jugos comprados.'),
    N(20, 'general', 'Mañana termina el programa. Pensá qué hábitos querés conservar.', 'editorial'),
    N(21, 'general', 'Terminaste. Mirá tu informe y reintroducí los alimentos de a uno, anotando cómo te cae cada uno.', 'editorial')
  ];

  // ───────── Logros (§4.6): reglas medibles ─────────
  function B(id, title, desc, rule, points, extra) { var o = { id: id, title: title, desc: desc, rule: rule, points: points }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  var BADGES_21 = [
    B('inicio', 'Primer paso', 'Completaste todos los hábitos de un día.', { type: 'daysComplete', n: 1 }, 50),
    B('monodieta', 'Purificación inicial', 'Completaste todos los días de la monodieta.', { type: 'phaseComplete', phase: 'monodieta' }, 100, { hiddenWhen: { startMode: 'directo' } }),
    B('adios_cafeina', 'Libre de estimulantes', '3 días seguidos sin café, mate, té negro, alcohol ni azúcar.', { type: 'habitStreak', habit: 'no_estimulantes', n: 3 }, 100),
    B('semana1', 'Semana impecable', 'Completaste los primeros 7 días (los días de gracia cuentan).', { type: 'daysCompleteRange', from: 1, to: 7, grace: true }, 200),
    B('maestro_nituke', 'Cocina consciente', 'Cocinaste 10 recetas distintas de la guía.', { type: 'distinctRecipesCooked', n: 10 }, 300),
    B('detox_champion', 'Renacimiento de primavera', 'Completaste los 21 días (los días de gracia cuentan).', { type: 'daysComplete', n: 21, grace: true }, 500),
    B('hidratacion', 'Buen hidratado/a', 'Llegaste a tu meta de agua 7 días.', { type: 'waterGoalDays', n: 7 }, 100),
    B('bitacora', 'Bitácora al día', 'Hiciste el check-in 7 días.', { type: 'checkinDays', n: 7 }, 100),
    B('explorador', 'Explorador/a', 'Probaste 20 recetas distintas.', { type: 'distinctRecipesCooked', n: 20 }, 150)
  ];

  var START_MODES = [
    { id: 'monodieta3', label: '3 días de monodieta (recomendado)', monoDays: 3 },
    { id: 'monodieta2', label: '2 días de monodieta', monoDays: 2 },
    { id: 'monodieta1', label: '1 día de monodieta', monoDays: 1 },
    { id: 'directo', label: 'Directo al menú depurativo (sin monodieta)', monoDays: 0 }
  ];

  // Para programas sin monodieta: los hábitos pierden la fase «monodieta» (siguen valiendo en «general»).
  function withoutMono(list) {
    return list.map(function (h) { var c = {}; for (var k in h) c[k] = h[k]; c.phases = h.phases.filter(function (p) { return p !== 'monodieta'; }); return c; });
  }
  function noteSubset(maxDay, phases) { return NOTES_21.filter(function (n) { return n.day <= maxDay && (!phases || phases.indexOf(n.phase) >= 0); }); }
  function pick(ids) { return BADGES_21.filter(function (b) { return ids.indexOf(b.id) >= 0; }); }

  root.DX.programs = [
    {
      id: 'detox-primavera-21', name: 'Detox de Primavera', subtitle: '21 días · guía de Isabel Caparra',
      description: 'Programa de alimentación depurativa de la guía de Isabel Caparra: preparación, monodieta opcional de 1 a 3 días y menú depurativo hasta completar 21 días.',
      season: 'primavera', days: 21, prepDay: true, theme: 'primavera',
      startModes: START_MODES, defaultStartMode: 'monodieta3',
      phases: [PHASE_PREVIA, PHASE_MONO, PHASE_GENERAL],
      habits: HABITS, prepHabits: PREP_HABITS, prepSchedule: { caffeine: { everyDays: 2, factor: 0.5 } },
      waterGoalMl: 2000, dayNotes: NOTES_21, badges: BADGES_21,
      source: 'guía de Isabel Caparra · septiembre 2026'
    },
    {
      id: 'semana-limpia-7', name: 'Semana limpia', subtitle: '7 días · menú depurativo de la guía',
      description: 'Una semana con el menú depurativo de la guía de Isabel Caparra y los mismos hábitos, sin monodieta. Para probar el plan o retomarlo.',
      season: 'todo el año', days: 7, prepDay: true, theme: 'verano',
      startModes: [{ id: 'directo', label: 'Directo al menú depurativo', monoDays: 0 }], defaultStartMode: 'directo',
      phases: [PHASE_PREVIA, PHASE_GENERAL],
      habits: withoutMono(HABITS), prepHabits: PREP_HABITS, prepSchedule: { caffeine: { everyDays: 2, factor: 0.5 } },
      waterGoalMl: 2000, dayNotes: noteSubset(7, ['previa', 'general']),
      badges: [B('inicio', 'Primer paso', 'Completaste todos los hábitos de un día.', { type: 'daysComplete', n: 1 }, 50), pick(['adios_cafeina'])[0],
        B('semana_limpia', 'Semana limpia', 'Completaste los 7 días (los días de gracia cuentan).', { type: 'daysComplete', n: 7, grace: true }, 250), pick(['hidratacion'])[0], pick(['bitacora'])[0]],
      source: 'basado solo en el contenido de la guía de Isabel Caparra'
    },
    {
      id: 'reset-14', name: 'Reset de 14 días', subtitle: '14 días · monodieta opcional + menú depurativo',
      description: 'Dos semanas con la estructura de la guía de Isabel Caparra: monodieta opcional de 1 a 3 días y menú depurativo.',
      season: 'todo el año', days: 14, prepDay: true, theme: 'otono',
      startModes: [START_MODES[1], START_MODES[2], START_MODES[3]], defaultStartMode: 'directo',
      phases: [PHASE_PREVIA, PHASE_MONO, PHASE_GENERAL],
      habits: HABITS, prepHabits: PREP_HABITS, prepSchedule: { caffeine: { everyDays: 2, factor: 0.5 } },
      waterGoalMl: 2000, dayNotes: noteSubset(14, null),
      badges: pick(['inicio', 'monodieta', 'adios_cafeina', 'semana1']).concat([
        B('reset_completo', 'Reset completo', 'Completaste los 14 días (los días de gracia cuentan).', { type: 'daysComplete', n: 14, grace: true }, 300), pick(['hidratacion'])[0], pick(['bitacora'])[0]]),
      source: 'basado solo en el contenido de la guía de Isabel Caparra'
    },
    {
      id: 'custom', name: 'Programa propio', subtitle: 'Armá tu programa', template: true,
      description: 'Plantilla vacía para crear un programa propio: elegí la duración, las fases simples y los hábitos de la biblioteca (o agregá los tuyos).',
      season: null, days: 7, prepDay: false, theme: 'primavera',
      startModes: [{ id: 'directo', label: 'Empezar directo', monoDays: 0 }], defaultStartMode: 'directo',
      phases: [{ id: 'general', name: 'Programa', desc: '', tips: [] }],
      habits: [], prepHabits: [], waterGoalMl: 2000, dayNotes: [],
      badges: [B('inicio', 'Primer paso', 'Completaste todos los hábitos de un día.', { type: 'daysComplete', n: 1 }, 50)],
      habitLibrary: HABITS, source: null
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
