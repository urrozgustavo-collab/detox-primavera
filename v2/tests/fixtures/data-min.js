/* Datos mínimos de prueba que respetan el contrato §2 de ESPEC-V2.md.
   Solo para tests y vistas previas (`build.py --fixture`). NUNCA va a la salida publicada. */
(function (root) {
  'use strict';
  var DX = root.DX = root.DX || {};
  DX.dataVersion = 'fixture';
  DX.taxonomy = {
    recipeCategories: [
      { id: 'almuerzos', label: 'Platos y guisos', icon: 'bowl' }, { id: 'caldos', label: 'Caldos', icon: 'pot' },
      { id: 'desayunos', label: 'Desayunos y meriendas', icon: 'sunrise' }, { id: 'dips', label: 'Dips y untables', icon: 'jar' },
      { id: 'ensaladas', label: 'Ensaladas', icon: 'leaf' }, { id: 'infusiones', label: 'Infusiones', icon: 'leaf' }
    ],
    mealSlots: [{ id: 'desayuno', label: 'Desayuno' }, { id: 'almuerzo', label: 'Almuerzo' }, { id: 'merienda', label: 'Merienda' }, { id: 'cena', label: 'Cena' }],
    stores: [{ id: 'verduleria', label: 'Verdulería', order: 1, v1: ['Verdulería'] }, { id: 'dietetica', label: 'Dietética', order: 2, v1: ['Dietética'] },
      { id: 'herboristeria', label: 'Herboristería', order: 3 }, { id: 'super', label: 'Supermercado / almacén', order: 9 }],
    allergens: [
      { id: 'frutos_secos', label: 'Frutos secos', v1: ['Frutos secos'], keywords: ['almendra', 'almendras', 'caju', 'nuez', 'nueces'] },
      { id: 'semillas', label: 'Semillas', v1: ['Semillas'], keywords: ['semillas', 'lino', 'chia'] },
      { id: 'gluten', label: 'Gluten / trigo', v1: ['Gluten / Trigo'], keywords: ['gluten', 'trigo', 'avena'] },
      { id: 'citricos', label: 'Cítricos', v1: ['Cítricos'], keywords: ['limon', 'naranja'] },
      { id: 'apio', label: 'Apio', v1: ['Apio'], keywords: ['apio'] },
      { id: 'soja', label: 'Soja / shoyu', v1: ['Soja / Shoyu'], keywords: ['soja', 'shoyu'] }
    ],
    conditions: [{ id: 'embarazo', label: 'Embarazo' }, { id: 'anticoagulantes', label: 'Anticoagulantes' }, { id: 'ulcera_gastritis', label: 'Úlcera o gastritis' }, { id: 'diarrea', label: 'Diarrea' }],
    constitutions: [{ id: 'friolento', label: 'Friolento/a', desc: 'Manos y pies fríos.' }, { id: 'caluroso', label: 'Caluroso/a', desc: 'Calor y sed.' }],
    energyLevels: [1, 2, 3, 4, 5].map(function (v) { return { v: v, label: ['Baja', 'Tranquila', 'Estable', 'Buena', 'Radiante'][v - 1], emoji: '' }; }),
    moodLevels: [1, 2, 3, 4, 5].map(function (v) { return { v: v, label: ['Muy bajo', 'Bajo', 'Neutro', 'Bien', 'Muy bien'][v - 1], emoji: '' }; }),
    digestionStates: [{ id: 'liviano', label: 'Liviano' }, { id: 'gases', label: 'Gases' }, { id: 'lenta', label: 'Lenta' }, { id: 'optima', label: 'Óptima' }],
    symptoms: [
      { id: 'cefalea', label: 'Cefalea leve', v1: 'Cefalea leve', sos: 'dolor-cabeza' },
      { id: 'sed_intensa', label: 'Sed intensa', v1: 'Sed intensa', sos: null },
      { id: 'despejado', label: 'Despejado / cero síntomas', v1: 'Despejado / Cero síntomas', sos: null, exclusive: true },
      { id: 'constipacion', label: 'Constipación', v1: null, sos: 'constipacion' }
    ],
    thermal: [{ id: 'calido', label: 'Cálido' }, { id: 'neutro', label: 'Neutro' }, { id: 'fresco', label: 'Fresco' }, { id: 'frio', label: 'Frío' }],
    statusLabels: { green: 'Libre', yellow: 'Con moderación', red: 'Evitar' }
  };
  function ing(id, name, category, store, role, extra) {
    var o = { id: id, name: name, category: category, store: store, role: role, synonyms: [name.toLowerCase()], allergens: [], soak: null, food: null, pantry: false };
    for (var k in (extra || {})) o[k] = extra[k];
    return o;
  }
  DX.ingredients = [
    ing('manzana', 'Manzana', 'frutas', 'verduleria', 'principal', { food: 'manzana' }),
    ing('arroz_yamani', 'Arroz yamaní', 'granos', 'dietetica', 'principal', { soak: 'arroz', synonyms: ['arroz integral', 'yamani'] }),
    ing('apio', 'Apio', 'verduras', 'verduleria', 'principal', { allergens: ['apio'] }),
    ing('zanahoria', 'Zanahoria', 'verduras', 'verduleria', 'principal'),
    ing('brocoli', 'Brócoli', 'verduras', 'verduleria', 'principal'),
    ing('mung', 'Porotos mung', 'legumbres', 'dietetica', 'principal', { soak: 'mung' }),
    ing('limon', 'Limón', 'citricos', 'verduleria', 'condimento', { allergens: ['citricos'] }),
    ing('jengibre', 'Jengibre', 'especias', 'verduleria', 'condimento'),
    ing('shoyu', 'Shoyu', 'condimentos', 'dietetica', 'condimento', { allergens: ['soja'] }),
    ing('almendras', 'Almendras', 'frutos_secos', 'dietetica', 'principal', { allergens: ['frutos_secos'], soak: 'almendras' }),
    ing('sal_marina', 'Sal marina', 'basicos', 'super', 'basico', { pantry: true }),
    ing('aceite_oliva', 'Aceite de oliva', 'grasas', 'super', 'condimento', { pantry: true }),
    ing('ortiga', 'Ortiga', 'hierbas', 'herboristeria', 'principal')
  ];
  function r(id, title, category, opts) {
    var o = { id: id, title: title, category: category, time: { total: 30, active: 10 }, method: 'Hervido', servings: 2,
      ingredients: [], steps: [{ text: 'Preparar.', timer: null }], tip: '', allergens: [], phases: ['general'], slots: ['almuerzo', 'cena'],
      thermal: null, tags: ['cocido'], limits: null, source: 'guía', note: null };
    for (var k in opts) o[k] = opts[k];
    return o;
  }
  function I(text, qty, unit, item, role) { return { text: text, qty: qty, unit: unit, item: item, role: role, optional: false }; }
  DX.recipes = [
    r('nituke-manzana', 'Nituke de manzana', 'desayunos', { phases: ['monodieta', 'general'], slots: ['desayuno', 'merienda'], thermal: 'calido', servings: 2,
      ingredients: [I('4 manzanas', 4, 'unidad', 'manzana', 'principal'), I('1 pizca de sal', null, null, 'sal_marina', 'basico')],
      steps: [{ text: 'Cortar las manzanas.', timer: null }, { text: 'Cocinar tapado 15 minutos.', timer: 900 }] }),
    r('arroz-yamani', 'Arroz yamaní', 'almuerzos', { phases: ['monodieta', 'general'], slots: ['almuerzo', 'cena'], tags: ['cocido', 'batch'], servings: 4,
      ingredients: [I('1 taza de arroz yamaní', 1, 'taza', 'arroz_yamani', 'principal'), I('sal', null, null, 'sal_marina', 'basico')],
      steps: [{ text: 'Remojar y cocinar 45 minutos.', timer: 2700 }] }),
    r('caldo-detox', 'Caldo Détox Alcalinizante', 'caldos', { phases: ['monodieta', 'general'], slots: ['almuerzo', 'cena'], thermal: 'calido', allergens: ['apio'], servings: 4,
      ingredients: [I('4 pencas de apio', 4, 'penca', 'apio', 'principal'), I('2 zanahorias', 2, 'unidad', 'zanahoria', 'principal'), I('1 manzana', 1, 'unidad', 'manzana', 'principal'), I('jengibre a gusto', null, null, 'jengibre', 'condimento')],
      steps: [{ text: 'Hervir 30 minutos.', timer: 1800 }] }),
    r('bowl-yamani-cruciferas', 'Bowl de yamaní y crucíferas', 'almuerzos', { servings: 2,
      ingredients: [I('1 taza de arroz yamaní cocido', 1, 'taza', 'arroz_yamani', 'principal'), I('1 brócoli', 1, 'unidad', 'brocoli', 'principal'), I('1 cda de shoyu', 1, 'cda', 'shoyu', 'condimento'), I('jugo de limón', null, null, 'limon', 'condimento')],
      allergens: ['soja', 'citricos'] }),
    r('hummus-mung', 'Hummus de mung', 'dips', { slots: ['almuerzo', 'merienda'], tags: ['batch'], servings: 4,
      ingredients: [I('1 taza de mung cocido', 1, 'taza', 'mung', 'principal'), I('jugo de 1 limón', 1, 'unidad', 'limon', 'condimento'), I('1 cda de aceite', 1, 'cda', 'aceite_oliva', 'condimento')],
      allergens: ['citricos'] }),
    r('leche-almendras', 'Leche de almendras', 'desayunos', { slots: ['desayuno', 'merienda'], tags: ['crudo', 'sin-coccion'], thermal: 'fresco', servings: 4,
      ingredients: [I('1 taza de almendras activadas', 1, 'taza', 'almendras', 'principal')], allergens: ['frutos_secos'] }),
    r('ensalada-zanahoria', 'Ensalada de zanahoria y limón', 'ensaladas', { slots: ['almuerzo', 'cena'], tags: ['crudo', 'rapida'], thermal: 'fresco', time: { total: 10, active: 10 },
      ingredients: [I('3 zanahorias', 3, 'unidad', 'zanahoria', 'principal'), I('jugo de limón', null, null, 'limon', 'condimento')], allergens: ['citricos'] }),
    r('infusion-ortiga', 'Infusión de ortiga', 'infusiones', { slots: ['desayuno', 'merienda'], tags: ['rapida'], time: { total: 10, active: 2 },
      ingredients: [I('1 cda de ortiga', 1, 'cda', 'ortiga', 'principal')] }),
    r('papa-horno', 'Papa al horno', 'almuerzos', { limits: { perWeek: 1 }, ingredients: [I('2 zanahorias', 2, 'unidad', 'zanahoria', 'principal')] })
  ];
  DX.foods = [
    { id: 'manzana', name: 'Manzana', status: 'green', category: 'Frutas', why: 'Base de la monodieta.', howTo: null, synonyms: ['manzanas'] },
    { id: 'arroz-integral', name: 'Arroz yamaní', status: 'green', category: 'Granos', why: 'Cereal integral.', howTo: null, synonyms: ['arroz integral'] },
    { id: 'aceite', name: 'Aceite', status: 'yellow', category: 'Grasas', why: 'Con medida.', howTo: '1 cdita en salteado con agua, nunca freír.', synonyms: ['aceite de oliva'] },
    { id: 'cafe', name: 'Café', status: 'red', category: 'Estimulantes', why: 'Estimulante.', howTo: null, synonyms: ['cafe'] },
    { id: 'azucar', name: 'Azúcar', status: 'red', category: 'Endulzantes', why: 'Evitar.', howTo: null, synonyms: [] },
    { id: 'tofu', name: 'Tofu', status: 'yellow', category: 'Proteínas', why: 'No a diario.', howTo: null, synonyms: [], phases: { monodieta: 'red' } }
  ];
  DX.herbs = [
    { id: 'ortiga', name: 'Ortiga', kind: 'hierba', thermal: 'fresco', taste: 'amargo', properties: ['Depurativa'], howTo: ['Infusión'], dose: '2 a 4 tazas',
      contraindications: [{ condition: 'anticoagulantes', text: 'No usar con anticoagulantes.' }], source: 'guía p.48' },
    { id: 'agua-de-mar', name: 'Agua de mar', kind: 'agua', thermal: 'neutro', taste: 'salado', properties: ['Minerales'], howTo: ['¼ de mar y ¾ dulce'], dose: '2 cdas',
      contraindications: [{ condition: 'diarrea', text: 'No pura.' }], unlockDay: 7, source: 'guía p.42' },
    { id: 'jengibre', name: 'Jengibre', kind: 'hierba', thermal: 'calido', taste: 'picante', properties: ['Digestivo'], howTo: ['Rallado'], dose: 'a gusto',
      contraindications: [{ condition: 'ulcera_gastritis', text: 'Con úlcera, evitar.' }, { condition: 'embarazo', text: 'Dosis bajas.' }], source: 'guía p.45' }
  ];
  DX.sos = [
    { id: 'constipacion', symptom: 'Constipación', icon: 'leaf', cause: 'Cambio de dieta.', steps: [
      { text: 'Agua tibia en ayunas.', ladder: true }, { text: 'Ciruelas remojadas.', ladder: true }, { text: 'Lino molido.', ladder: true }],
      whenToConsult: 'Más de 3 días sin evacuar.', relatedSymptoms: ['constipacion'], relatedHerbs: [], relatedRecipes: ['nituke-manzana'], warnings: [{ condition: 'diarrea', text: 'No aplica.' }] },
    { id: 'dolor-cabeza', symptom: 'Dolor de cabeza', icon: 'alert', cause: 'Abstinencia de cafeína.', steps: [{ text: 'Descansar.', ladder: false }],
      whenToConsult: 'Si es intenso o dura más de 2 días.', relatedSymptoms: ['cefalea'], relatedHerbs: ['jengibre'], relatedRecipes: [], warnings: [] }
  ];
  DX.shopping = [
    { id: 'v1', item: 'Manzanas', store: 'verduleria', qty: '3 a 5 kg', essential: true, ingredient: 'manzana', stage: 'previa' },
    { id: 'v2', item: 'Apio', store: 'verduleria', qty: '1 planta', essential: true, ingredient: 'apio', stage: 'general' },
    { id: 'd1', item: 'Arroz yamaní', store: 'dietetica', qty: '2 kg', essential: true, ingredient: 'arroz_yamani', stage: 'previa' },
    { id: 'd2', item: 'Porotos mung', store: 'dietetica', qty: '1 kg', essential: false, ingredient: 'mung', stage: 'general' },
    { id: 'h1', item: 'Ortiga', store: 'herboristeria', qty: '100 g', essential: false, ingredient: 'ortiga', stage: 'general' }
  ];
  DX.methods = {
    methods: [{ id: 'nituke', name: 'Nituke', desc: 'Salteado con agua.', steps: ['Cortar.', 'Tapar.'] }, { id: 'vapor', name: 'Vapor', desc: 'Al vapor.', steps: ['Hervir agua.'] }],
    grains: [{ grain: 'Arroz', ratio: '1:2', time: '45 min', notes: 'Sin revolver.' }],
    legumes: ['Remojar 8 h.', 'Sal al final.']
  };
  DX.prep = {
    soaking: [
      { id: 'mung', ingredient: 'mung', name: 'Porotos mung', minH: 8, optH: 12, maxH: 24, label: '8 a 12 h', medium: 'agua', discardWater: true, why: 'Digestibilidad.', purpose: 'Activar.', alerts: '' },
      { id: 'arroz', ingredient: 'arroz_yamani', name: 'Arroz yamaní', minH: 6, optH: 8, maxH: 12, label: '6 a 8 h', medium: 'agua', discardWater: true, why: 'Cocción pareja.', purpose: 'Activar.', alerts: '' },
      { id: 'almendras', ingredient: 'almendras', name: 'Almendras', minH: 8, optH: 12, maxH: 24, label: '12 h', medium: 'agua', discardWater: true, why: 'Activar.', purpose: 'Activar.', alerts: '' }
    ],
    batch: [{ id: 'base-yamani', name: 'Arroz yamaní', icon: 'pot', desc: 'Base de la semana.', method: 'Hervido', yield: '6 porciones', fridgeDays: 5, freezer: true, freezerDays: 30,
      steps: ['Remojar.', 'Cocinar.'], recipes: ['arroz-yamani', 'bowl-yamani-cruciferas'], savesMin: 80 }],
    ferments: [{ id: 'chucrut', recipe: 'caldo-detox', readyDaysMin: 21, readyDaysMax: 28, milestones: [{ day: 2, text: 'Revisar.' }, { day: 10, text: 'Burbujas.' }] }]
  };
  DX.quotes = [
    { day: 0, theme: 'Comienzo', text: 'Todo empieza con un paso.', author: 'Popular', attribution: 'popular', context: '' },
    { day: 1, theme: 'Calma', text: 'Que tu alimento sea tu medicina.', author: 'Hipócrates', attribution: 'atribuida', context: '' }
  ];
  function habit(id, text, extra) { var o = { id: id, text: text, tip: 'Consejo.', icon: 'leaf', phases: ['monodieta', 'general'] }; for (var k in (extra || {})) o[k] = extra[k]; return o; }
  var habits = [habit('limon', 'Agua tibia con limón', { warnFor: ['ulcera_gastritis'] }), habit('masticacion', 'Masticar 20 veces'), habit('infusion', 'Infusión depurativa', { warnFor: ['anticoagulantes'] }),
    habit('no_estimulantes', 'Sin estimulantes'), habit('hidratacion', 'Agua tibia'), habit('plato_verde', 'Plato verde')];
  DX.programs = [
    { id: 'detox-primavera-21', name: 'Detox de Primavera', subtitle: '21 días · guía de Isabel Caparra', season: 'primavera', days: 21, prepDay: true, theme: 'primavera',
      startModes: [{ id: 'monodieta3', label: '3 días de monodieta (recomendado)', monoDays: 3 }, { id: 'monodieta2', label: '2 días', monoDays: 2 }, { id: 'monodieta1', label: '1 día', monoDays: 1 }, { id: 'directo', label: 'Directo', monoDays: 0 }],
      defaultStartMode: 'monodieta3',
      phases: [{ id: 'previa', name: 'Preparación', desc: 'Preparate.', tips: [] }, { id: 'monodieta', name: 'Monodieta purificadora', desc: 'Manzana y arroz.', allowedRecipes: ['nituke-manzana', 'arroz-yamani', 'caldo-detox'], tips: [] },
        { id: 'general', name: 'Menú depurativo', desc: 'Menú general.', tips: [] }],
      habits: habits,
      prepHabits: [{ id: 'cafeina_mitad', text: 'Bajar la cafeína a la mitad', tip: 'Cada 2 días.', icon: 'cup' }, { id: 'compras_iniciales', text: 'Compras iniciales', tip: '', icon: 'cart' }],
      waterGoalMl: 2000,
      dayNotes: [{ day: 1, text: 'Hoy empieza la monodieta.' }],
      badges: [
        { id: 'inicio', title: 'Primer paso', desc: 'Primer día completo', rule: { type: 'daysComplete', n: 1 }, points: 50 },
        { id: 'monodieta', title: 'Purificación inicial', desc: 'Todos los días de monodieta completos', rule: { type: 'phaseComplete', phase: 'monodieta' }, points: 100 },
        { id: 'adios_cafeina', title: 'Libre de estimulantes', desc: '3 días seguidos sin estimulantes', rule: { type: 'habitStreak', habit: 'no_estimulantes', n: 3 }, points: 100 },
        { id: 'semana1', title: 'Semana impecable', desc: 'Días 1 a 7 completos', rule: { type: 'rangeComplete', from: 1, to: 7, grace: true }, points: 200 },
        { id: 'maestro_nituke', title: 'Chef consciente', desc: '10 recetas distintas de la guía', rule: { type: 'recipesCooked', n: 10, source: 'guide' }, points: 300 },
        { id: 'detox_champion', title: 'Renacimiento', desc: '21 días completos', rule: { type: 'rangeComplete', from: 1, to: 21, grace: true }, points: 500 },
        { id: 'hidratacion', title: 'Bien hidratado', desc: 'Meta de agua 7 días', rule: { type: 'waterDays', n: 7 }, points: 100 },
        { id: 'bitacora', title: 'Bitácora', desc: 'Check-in 7 días', rule: { type: 'checkinDays', n: 7 }, points: 100 },
        { id: 'explorador', title: 'Explorador', desc: '20 recetas distintas', rule: { type: 'recipesTried', n: 20 }, points: 150 }
      ] },
    { id: 'semana-limpia-7', name: 'Semana limpia', subtitle: '7 días', season: null, days: 7, prepDay: false, theme: 'verano',
      startModes: [{ id: 'directo', label: 'Directo', monoDays: 0 }], defaultStartMode: 'directo',
      phases: [{ id: 'general', name: 'Menú depurativo', desc: '', tips: [] }], habits: habits, prepHabits: [], waterGoalMl: 2000, dayNotes: [], badges: [] },
    { id: 'custom', name: 'Programa propio', subtitle: '', season: null, days: 14, prepDay: false, theme: 'primavera', template: true,
      startModes: [{ id: 'directo', label: 'Directo', monoDays: 0 }], defaultStartMode: 'directo',
      phases: [{ id: 'general', name: 'General', desc: '', tips: [] }], habits: [], prepHabits: [], waterGoalMl: 2000, dayNotes: [], badges: [] }
  ];
  DX.taller = {
    guide: { name: 'Isabel Caparra', email: 'isa@example.com', whatsapp: '+54 9 11 0000-0000', groupUrl: 'https://example.com/grupo', meetUrl: 'https://example.com/meet' },
    meetings: [{ date: '2026-09-28', time: '18:30', topic: 'Dudas antes de empezar' }],
    videos: [{ id: 'x', title: 'Primer encuentro', url: 'https://example.com/v' }],
    producers: [{ name: 'Productor', phone: '11 0000-0000', note: 'Verduras.' }]
  };
})(typeof window !== 'undefined' ? window : globalThis);
