/* Ronda 2: excepciones y datos editoriales que se aplican encima de la heurística de guide-check.js.
   Claves: línea de ingrediente = 'idReceta|item' · paso = 'idReceta#n' (n desde 1). */
'use strict';

// La guía SÍ trae la cantidad (la heurística no la reconoce): no se marca como sugerida.
const GUIDE_OK_LINES = new Set(['caldo-detox|alcaucil', 'alino-palta|shoyu', 'pan-quinoa-amaranto|harina_amaranto']);
// La guía NO trae la cantidad (la heurística la dio por buena): se marca como sugerida.
const FORCE_SUGGEST = new Set([]);
// Pasos cuyos tiempos/temperaturas sí vienen de la guía.
const GUIDE_OK_STEPS = new Set([]);
// Pasos editoriales aunque no tengan números (el método lo propone el equipo; la guía no lo detalla).
const FORCE_EDITORIAL_STEPS = new Set(['alcauciles-con-alino#1', 'batata-al-horno#1', 'fideos-integrales-tomate-brocoli#1', 'caldo-de-miso#1']);

// Pasos de v1 reescritos para sacar afirmaciones que la guía no hace.
const STEP_TEXT = {
  'caldo-de-miso#1': 'Calentar el agua de filtro, sin llegar a hervor.',
  'caldo-de-miso#6': 'Beber tibio, a sorbos, antes de las comidas o como colación.'
};

// Porciones estimadas por el equipo (la guía no las da). null explícito = aliños, condimentos y conservas.
const SERVINGS = {
  'caldo-detox': 4, 'nituke-manzana': 2, 'hummus-mung': 4, 'mayonesa-zanahoria': 6, 'babaganoush': 4, 'queso-caju': 6, 'galletas-yamani': 4, 'pan-centeno-masamadre': 12,
  'chucrut-casero': null, 'leche-almendras': 4, 'bowl-yamani-cruciferas': 1, 'leche-caju': 4, 'queso-crema-tofu': 6, 'untable-hinojo-citricos': 6, 'pasta-remolacha-aduki': 6,
  'pesto-hongos': 4, 'queso-caju-tomillo': 4, 'untable-caju-basico': 6, 'untable-caju-fermentado': 6, 'pickle-expres-rabanitos': null, 'pickle-remolacha-nabo-lima': null,
  'kimchi-artesanal': null, 'galletas-harina-arroz': 6, 'pan-quinoa-amaranto': 12, 'pan-trigo-sarraceno': 10, 'mix-rawmesan': null, 'pesto-cilantro-albahaca-hinojo': null,
  'alino-miel-mostaza': null, 'alino-zanahoria': null, 'alino-palta': null, 'alino-caju': null, 'alino-zucchini': null, 'criolla-con-tutti': null,
  'temakis-nori': 2, 'risotto-yamani-hongos': 2, 'risotto-remolacha-brocoli': 2, 'ensalada-quinoa-habas-brocoli': 1, 'guiso-mung-calabaza': 4, 'papa-burguers-horno': 4,
  'papa-horno-alino-caju': 1, 'arroz-coliflor-salteado': 2, 'salteado-hongos-brotes-mung': 2, 'ensalada-repollo-jengibre-macerada': 2, 'coleslaw-detox-macerado': 2,
  'trio-verduras-vapor-semillas': 2, 'zanahorias-a-la-india': 2, 'tabule-quinoa-coliflor': 3, 'zucchinis-a-la-menta': 2, 'colchon-de-arvejas': 2,
  'sopa-fria-pepino-cilantro': 2, 'sopa-fria-apio-palta': 3, 'gazpacho-verde': 3, 'sopa-kale-brocoli-castanas': 3, 'borsch-depurativo-caju': 6, 'sopa-crema-coliflor-caju': 4,
  'sopa-zanahoria-jengibre-curcuma': 4, 'sopa-berro-leche-caju': 3, 'sopa-apio-eneldo-curry': 4, 'sopa-crema-porotos-mung': 3, 'caldo-de-miso': 1, 'pudding-chia-compota': 1,
  'licuado-rojo-pasion': 1, 'licuado-verde-depurativo': 1, 'crema-tibia-mijo-canela': 2, 'manzanas-asadas-canela': 2, 'bastones-crocantes-dips': 2, 'jugo-amo-mi-higado': 1,
  'compota-manzana-clavo-canela': 3, 'hot-cakes-avena-coco': 3, 'infusion-quelante-ortiga-diente-leon': 2, 'mate-medicinal-hierbas': 1, 'infusion-digestiva-albahaca-jengibre': 4,
  'infusion-calmante-triple-flor': 4,
  // preparaciones nuevas
  'compota-manzana': 3, 'licuado-jugo-manzana': 1, 'arroz-integral-tibio': 2, 'gomasio': null, 'ensalada-porotos-negros': 2, 'ensalada-garbanzos-palta-cherrys': 2,
  'ensalada-quinoa-palta-cherry': 2, 'alcauciles-con-alino': 1, 'ensalada-rucula-cilantro-rabanitos': 2, 'ensalada-remolacha-palta-menta-pepino': 2, 'esparragos-blanqueados-dijon': 2,
  'ensalada-esparragos-rabanitos': 2, 'nituke-repollo-colorado-manzana': 2, 'ensalada-pepino-palta': 1, 'ensaladas-remolacha': 2, 'ensalada-libre': 1, 'hamburguesa-legumbres': 1,
  'batata-al-horno': 1, 'fideos-integrales-tomate-brocoli': 1, 'compota-manzana-frutillas-arandanos': 2, 'ensalada-frutillas-pomelo': 1, 'ensalada-manzana-frutillas-mandarina': 1,
  'ensalada-rucula-frutillas-pepino': 1, 'ensalada-hinojo-zanahoria-naranja': 1, 'jugo-manzana-mentolado': 2, 'licuado-verde-khalo': 1, 'licuado-refrescante': 1,
  'jugo-antioxidante': 1, 'tostadas-con-topes': 1, 'anana-con-menta': 2, 'bowl-arroz-rawmesan': 1, 'agua-de-lino': 1
};

// Recetas que no traían tiempo: estimación del equipo [total, activo, espera] (se marca timeEstimated).
const TIME_FALLBACK = {
  'compota-manzana': [30, 5], 'alcauciles-con-alino': [40, 10], 'nituke-repollo-colorado-manzana': [35, 10],
  'batata-al-horno': [50, 5], 'compota-manzana-frutillas-arandanos': [30, 5]
};

// Roles corregidos por receta: { id: { item: 'principal' } } — para que ninguna receta quede «solo de condimentos».
const ROLE_OVERRIDES = {
  'mix-rawmesan': { semillas_lino: 'principal', semillas_zapallo: 'principal' },
  'pesto-cilantro-albahaca-hinojo': { cilantro: 'principal' },
  'alino-miel-mostaza': { vinagre_manzana: 'principal' },
  'caldo-de-miso': { miso: 'principal' },
  'infusion-digestiva-albahaca-jengibre': { jengibre: 'principal', albahaca: 'principal' },
  'gomasio': { semillas_sesamo: 'principal' },
  'agua-de-lino': { semillas_lino: 'principal' }
};

// Alérgenos que solo aparecen en alternativas, toppings o menciones del texto (→ mayContain): barrido por palabras clave de la taxonomía + revisión manual.
const AL_MAY = {
  'nituke-manzana': ['semillas'], 'hummus-mung': ['sesamo', 'semillas'], 'galletas-harina-arroz': ['gluten'], 'pesto-cilantro-albahaca-hinojo': ['semillas'],
  'alino-miel-mostaza': ['semillas'], 'alino-zucchini': ['semillas'], 'ensalada-repollo-jengibre-macerada': ['semillas'], 'coleslaw-detox-macerado': ['semillas'],
  'trio-verduras-vapor-semillas': ['legumbres'], 'sopa-crema-porotos-mung': ['semillas', 'citricos'], 'caldo-de-miso': ['gluten'],
  'pudding-chia-compota': ['frutillas'], 'crema-tibia-mijo-canela': ['frutos_secos'], 'bastones-crocantes-dips': ['legumbres', 'soja'],
  'compota-manzana-clavo-canela': ['semillas', 'frutillas'], 'hot-cakes-avena-coco': ['frutos_secos', 'frutillas'], 'arroz-integral-tibio': ['sesamo', 'semillas'],
  'ensalada-porotos-negros': ['semillas'], 'esparragos-blanqueados-dijon': ['legumbres'], 'ensalada-libre': ['soja'],
  'compota-manzana-frutillas-arandanos': ['semillas'], 'ensalada-frutillas-pomelo': ['semillas'], 'jugo-manzana-mentolado': ['frutos_secos'], 'licuado-verde-khalo': ['frutos_secos'],
  'jugo-antioxidante': ['frutos_secos'], 'tostadas-con-topes': ['frutos_secos', 'semillas', 'soja', 'legumbres'], 'bowl-arroz-rawmesan': ['sesamo', 'semillas']
};

// Encabezado de la guía por receta cuando el título de la app no se parece al de la guía: { id: 'texto del encabezado' }
const HEADINGS = {
  'babaganoush': 'Babaganoush', 'queso-caju': 'Untable de cajú', 'untable-caju-basico': 'Untable de cajú', 'pan-centeno-masamadre': 'Pan de centeno de masamadre',
  'chucrut-casero': 'Chucrut', 'leche-almendras': 'Leches vegetales de semillas o frutos secos', 'leche-caju': 'Leches vegetales de semillas o frutos secos',
  'bowl-yamani-cruciferas': 'Arroz basmati integral, largo fino o yamaní', 'pesto-hongos': 'Pesto de hongos', 'queso-caju-tomillo': 'Queso de castañas de cajú y tomillo',
  'pickle-expres-rabanitos': 'Pickle de rabanitos', 'kimchi-artesanal': 'Kimchi', 'galletas-harina-arroz': 'Galletas de harina de arroz',
  'alino-miel-mostaza': 'Aliño a la miel y mostaza', 'alino-zanahoria': 'Aliño de zanahoria', 'alino-palta': 'Aliño de palta', 'alino-caju': 'Aliño de cajú',
  'alino-zucchini': 'Aliño de zuchinni', 'criolla-con-tutti': 'Criolla con tutti', 'papa-burguers-horno': 'Papa burguer y brócolis blanqueados',
  'salteado-hongos-brotes-mung': 'Salteado en agua de puerros, ajo, champis o portobellos', 'coleslaw-detox-macerado': 'Coleslow de zanahoria, repollo blanco y repollo colorado',
  'trio-verduras-vapor-semillas': 'Verduras al vapor. Elegir 3 de estas', 'zanahorias-a-la-india': 'Zanahorias a la india', 'zucchinis-a-la-menta': 'Zuchinnis a la menta',
  'colchon-de-arvejas': 'Colchón de arvejas', 'gazpacho-verde': 'Gazpacho verde', 'sopa-kale-brocoli-castanas': 'Sopa de Kale y Brócoli', 'borsch-depurativo-caju': 'Borsch',
  'sopa-berro-leche-caju': 'Sopa de berro', 'sopa-apio-eneldo-curry': 'Sopa de apio y eneldo', 'caldo-de-miso': 'Caldo de miso', 'bastones-crocantes-dips': 'Bastones de apio/hinojo/zanahoria/pepino con mayonesa de zanahorias',
  'hot-cakes-avena-coco': 'Hot cakes de avena', 'infusion-quelante-ortiga-diente-leon': 'Ortiga: Infusionar 2 puñados de ortiga por cada litro', 'mate-medicinal-hierbas': 'Yuyos para el mate',
  'fideos-integrales-tomate-brocoli': 'Fideos integrales/marca épicos de quinoa', 'tostadas-con-topes': 'Tostadas de pan de centeno puro de masamadre'
};

module.exports = { STEP_TEXT, HEADINGS, GUIDE_OK_LINES, FORCE_SUGGEST, GUIDE_OK_STEPS, FORCE_EDITORIAL_STEPS, SERVINGS, TIME_FALLBACK, ROLE_OVERRIDES, AL_MAY };
