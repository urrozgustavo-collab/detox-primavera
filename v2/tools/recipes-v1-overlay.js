/* Capa de curación para las 73 recetas de v1: asigna cada línea de ingredientes a un item del catálogo,
   tiempos numéricos, fases, momentos, térmica, etiquetas y fuente. El texto, los pasos y el tip vienen de app/detox-data.js.
   Sintaxis de `ing` (alineada, línea por línea, con los ingredientes de v1):
     'item'                       → qty/unidad se leen del texto
     ['item', {opt, qty, unit, text, role}]
     {split:[ 'item' | ['item',{text,...}], … ]}  → una línea de v1 se parte en varias
     null                         → línea sin ingrediente de catálogo (p. ej. «elegir 3 vegetales») */
'use strict';
const o = (item, opts) => [item, opts || {}];
const S = (...parts) => ({ split: parts });
const OPT = { opt: 1 };

// V(id, categoría, [total, activo, espera] en minutos, fases m/g, momentos d/a/m/c, térmica, tags, fuente, ingredientes, extra)
const V = {};
function add(id, cat, t, ph, sl, th, tags, src, ing, extra) { V[id] = Object.assign({ cat, t, ph, sl, th, tags, src, ing }, extra || {}); }

// ───────────────────────────── Caldos / desayunos / dips ─────────────────────────────
add('caldo-detox', 'caldos', [35, 10, 0], 'mg', 'amc', 'calido', 'cocido batch', 'guía p.7 y p.30', [
  'apio', 'ajo', 'puerro', o('alcaucil', OPT), 'repollo', 'zanahoria', 'perejil', 'manzana', 'sal_marina'], { serv: null });
add('nituke-manzana', 'desayunos', [40, 5, 0], 'mg', 'dm', 'calido', 'cocido', 'guía p.5 y p.9', [
  'manzana', 'agua', 'sal_marina', o('almendras', { opt: 1, text: 'Opcional para acompañar: almendras tostadas picadas, semillas de lino molidas o nueces picadas' })]);
add('hummus-mung', 'dips', [15, 15, 0], 'g', 'dam', null, 'sin-coccion batch', 'guía p.31', [
  'porotos_mung', 'ajo', 'albahaca', 'aceite_oliva', 'limon', 'sal_marina', 'liquido_coccion']);
add('mayonesa-zanahoria', 'dips', [20, 10, 0], 'g', 'dam', null, 'cocido batch', 'guía p.31', [
  'zanahoria', 'calabaza_anco', 'puerro', 'ajo', 'aceite_oliva', 'limon', 'sal_marina',
  S(o('aceitunas_negras', { opt: 1 }), o('pasas_uva', { opt: 1, text: 'Alternativa a las aceitunas: 1 puñado de pasas de uva', qty: 1, unit: 'puñado' }))],
  { note: 'La guía acepta «pasas de uva o aceitunas negras»; la v1 solo listaba aceitunas.' });
add('babaganoush', 'dips', [25, 15, 0], 'g', 'dam', null, 'cocido', 'guía p.32', [
  'berenjena', 'ajo', 'limon', 'aceite_oliva',
  S(o('sal_marina', { text: 'Sal marina a gusto' }), o('comino', { text: '1 pizca de comino', qty: 1, unit: 'pizca' }))]);
add('queso-caju', 'dips', [10, 10, 480], 'g', 'dam', null, 'sin-coccion', 'guía p.33', [
  'castanas_caju', 'agua', 'sal_marina', 'limon', o('levadura_nutricional', OPT)]);
add('galletas-yamani', 'panificados', [30, 15, 0], 'g', 'dm', null, 'cocido', 'guía p.36', [
  'arroz_yamani', 'harina_arroz_integral', 'semillas_lino', 'aceite_oliva', 'agua',
  S(o('sal_marina', { text: 'Sal marina a gusto' }), o('oregano', { opt: 1, text: 'Hierbas secas a gusto (orégano, tomillo) o cúrcuma' }))]);
add('pan-centeno-masamadre', 'panificados', [50, 20, 900], 'g', 'dm', null, 'cocido fermento', 'guía p.37-38', [
  'harina_centeno_integral', 'masa_madre', 'sal_marina', 'agua'],
  { note: 'La guía lo ofrece «solo para curiosos»; la masa madre se prepara aparte (3 a 7 días).' });
add('chucrut-casero', 'fermentos', [20, 20, 30240], 'g', 'ac', null, 'crudo fermento batch', 'guía p.35-36', [
  'repollo', o('sal_marina', { text: 'Sal marina o rosa, no yodada: 20 a 25 g por cada kilo de repollo picado (2 a 2,5 %)', qty: null })]);
add('leche-almendras', 'leches', [10, 10, 480], 'g', 'dm', null, 'sin-coccion batch', 'guía p.30', [
  'almendras', 'agua', S(o('sal_marina', { opt: 1, text: 'Opcional: pizca de sal marina', qty: 1, unit: 'pizca' }), o('canela', { opt: 1, text: 'Opcional: canela' }))]);
add('bowl-yamani-cruciferas', 'almuerzos', [25, 10, 0], 'g', 'ac', 'calido', 'cocido batch', 'guía p.6, p.25 y p.29', [
  'arroz_yamani', 'brocoli', 'coliflor', 'porotos_mung', 'palta', 'chucrut',
  S(o('aceite_oliva', { text: '1 cucharada de aceite de oliva crudo', qty: 1, unit: 'cda' }), o('shoyu', { text: 'Gotas de salsa Shoyu MOA', qty: null }), o('limon', { text: 'Jugo de limón a gusto', qty: null }))],
  { serv: 1 });
add('leche-caju', 'leches', [5, 5, 0], 'g', 'dm', null, 'sin-coccion', 'guía p.30', [
  'castanas_caju', 'agua', S(o('sal_marina', { opt: 1, text: 'Opcional: 1 pizca de sal marina', qty: 1, unit: 'pizca' }), o('canela', { opt: 1, text: 'Opcional: canela pura' }))]);
add('queso-crema-tofu', 'dips', [35, 15, 0], 'g', 'dam', null, 'cocido', 'guía p.31', [
  'tofu', 'aceite_oliva', 'agua', 'semillas_sesamo',
  S(o('sal_marina', { text: '1 cucharadita de sal marina', qty: 1, unit: 'cdita' }), o('shoyu', { opt: 1, text: 'O bien 1 cucharada de salsa de soja natural (Shoyu MOA) en lugar de la sal', qty: 1, unit: 'cda' })),
  S(o('cebolla_verdeo', { opt: 1, text: 'Opcional: cebollín fresco picado fino', qty: null }), o('pimenton', { opt: 1, text: 'Opcional: pimentón dulce', qty: null }), o('levadura_cerveza', { opt: 1, text: 'Opcional: 1 cucharada de levadura de cerveza', qty: 1, unit: 'cda' }))],
  { limits: { perWeek: 3 }, note: 'La guía aclara que el tofu «no se usa diariamente». El tope semanal es un criterio editorial (3 veces).' });
add('untable-hinojo-citricos', 'dips', [10, 10, 0], 'g', 'dam', null, 'sin-coccion', 'guía p.31', [
  'hinojo', 'puerro', 'castanas_caju', 'aceite_oliva', 'lima', 'ajo', 'sal_marina',
  S(o('levadura_nutricional', { opt: 1, text: 'Opcional: 1 cucharadita de levadura nutricional', qty: 1, unit: 'cdita' }), o('shoyu', { opt: 1, text: 'Opcional: unas gotas de salsa de soja', qty: null })),
  S(o('cilantro', { opt: 1, text: 'Variación: ½ taza de hojas frescas de cilantro', qty: 0.5, unit: 'taza' }), o('menta', { opt: 1, text: 'Variación: ½ taza de hojas frescas de menta', qty: 0.5, unit: 'taza' }))]);
add('pasta-remolacha-aduki', 'dips', [15, 15, 0], 'g', 'dam', null, 'cocido', 'guía p.32', [
  'porotos_aduki', 'remolacha', 'ajo', 'aceite_oliva', 'shoyu', 'comino', 'liquido_coccion']);
add('pesto-hongos', 'dips', [15, 15, 0], 'g', 'dam', null, 'cocido', 'guía p.32', [
  'hongos_champi', 'rucula', 'ajo', 'aceite_oliva',
  S(o('sal_marina', { text: 'Sal marina a gusto' }), o('pimienta', { text: 'Pimienta negra recién molida a gusto' }))]);
add('queso-caju-tomillo', 'dips', [20, 20, 180], 'g', 'dam', null, 'cocido', 'guía p.32-33', [
  'castanas_caju', 'agua', 'sal_marina', o('ajo', { text: '1 cucharadita de ajo en polvo', qty: 1, unit: 'cdita' }), 'levadura_cerveza', 'agar_agar', 'limon', 'aceite_oliva', 'tomillo']);
add('untable-caju-basico', 'dips', [10, 10, 480], 'g', 'dam', null, 'sin-coccion batch', 'guía p.33', [
  'castanas_caju', 'agua', 'agua', 'sal_marina']);
add('untable-caju-fermentado', 'fermentos', [10, 10, 360], 'g', 'dam', null, 'sin-coccion fermento', 'guía p.33', [
  'castanas_caju', 'agua', 'sal_marina', 'iniciador_probiotico']);
add('pickle-expres-rabanitos', 'fermentos', [15, 15, 120], 'g', 'ac', 'fresco', 'crudo', 'guía p.33', [
  'rabanitos', 'vinagre_manzana', 'sal_marina', 'curcuma', 'pimienta']);
add('pickle-remolacha-nabo-lima', 'fermentos', [15, 15, 0], 'g', 'ac', 'fresco', 'crudo', 'guía p.34', [
  'nabo', 'remolacha', 'lima', 'sal_marina']);
add('kimchi-artesanal', 'fermentos', [30, 30, 4380], 'g', 'ac', null, 'crudo fermento', 'guía p.34', [
  'akusay', 'sal_marina', 'morron', 'manzana', 'pimenton', 'cebolla', 'hinojo', 'ajo', 'jengibre', 'aji_picante', 'cilantro', 'perejil'],
  { note: 'Atención: la guía dice «3000 gr de manzana rallada» para 1 kg de akusay; parece un error de tipeo. Se usan 300 g como valor razonable. Verificar con Isa antes de preparar.' });
add('galletas-harina-arroz', 'panificados', [30, 15, 0], 'g', 'dm', null, 'cocido', 'guía p.36-37', [
  'harina_arroz_integral', 'harina_sarraceno', 'semillas_varias', 'aceite_oliva', 'sal_marina', 'agua',
  S(o('curcuma', { opt: 1, text: 'A gusto: cúrcuma', qty: null }), o('pimienta', { opt: 1, text: 'A gusto: pimienta negra', qty: null }), o('eneldo', { opt: 1, text: 'A gusto: eneldo o romero', qty: null }))],
  { note: 'La guía permite harina de trigo sarraceno o de avena; con avena contiene gluten.' });
add('pan-quinoa-amaranto', 'panificados', [75, 20, 480], 'g', 'dm', null, 'cocido', 'guía p.37', [
  'quinoa', 'semillas_chia', 'agua', 'aceite_oliva', 'bicarbonato', 'sal_marina', 'limon', 'harina_amaranto', 'semillas_varias']);
add('pan-trigo-sarraceno', 'panificados', [30, 20, 1140], 'g', 'dm', null, 'cocido', 'guía p.38-39', [
  'trigo_sarraceno', 'agua', 'aceite_oliva', 'miel', 'psyllium', 'levadura_panaderia', 'sal_marina', o('semillas_varias', OPT)]);

// ───────────────────────────── Aliños y toppings ─────────────────────────────
add('mix-rawmesan', 'alinos', [5, 5, 0], 'g', 'ac', null, 'sin-coccion batch', 'guía p.20', [
  'semillas_lino', 'semillas_zapallo', 'levadura_cerveza', 'curcuma', 'sal_marina', o('semillas_sesamo', OPT)]);
add('pesto-cilantro-albahaca-hinojo', 'alinos', [5, 5, 0], 'g', 'ac', null, 'sin-coccion', 'guía p.21', [
  'cilantro', 'ajo', 'aceite_oliva', 'lima', 'agua', o('castanas_caju', OPT),
  S(o('sal_marina', { text: 'Sal marina fina a gusto' }), o('pimienta', { text: 'Pimienta negra a gusto' }))]);
add('alino-miel-mostaza', 'alinos', [3, 3, 0], 'g', 'ac', null, 'sin-coccion', 'guía p.21', [
  'vinagre_manzana', 'aceite_oliva', 'miel', 'mostaza_dijon', 'sal_marina']);
add('alino-zanahoria', 'alinos', [15, 10, 0], 'g', 'ac', null, 'cocido', 'guía p.22', [
  'zanahoria', 'liquido_coccion', 'ajo', 'limon', 'aceite_oliva', 'sal_marina']);
add('alino-palta', 'alinos', [5, 5, 0], 'g', 'ac', null, 'sin-coccion', 'guía p.22', [
  'palta', 'limon', 'shoyu', o('cilantro', { text: '1 puñado de hojas verdes a elección (cilantro, albahaca, espinaca o rúcula)', qty: 1, unit: 'puñado' }), o('ajo', { opt: 1 }), 'agua']);
add('alino-caju', 'alinos', [5, 5, 0], 'g', 'ac', null, 'sin-coccion', 'guía p.22', [
  'castanas_caju', 'limon', 'ajo', 'mostaza_dijon', 'perejil', 'agua', 'sal_marina']);
add('alino-zucchini', 'alinos', [7, 7, 0], 'g', 'ac', null, 'sin-coccion', 'guía p.22', [
  'zucchini', 'puerro', 'lima', 'aceite_oliva', 'sal_marina']);
add('criolla-con-tutti', 'alinos', [10, 10, 0], 'g', 'ac', null, 'crudo', 'guía p.22', [
  'cebolla_verdeo', 'rabanitos', o('limon', { text: 'Ralladura de 1 limón limpio', qty: 1, unit: 'unidad' }), 'limon', 'cilantro', 'sal_marina']);

// ───────────────────────────── Almuerzos y cenas ─────────────────────────────
add('temakis-nori', 'almuerzos', [20, 20, 0], 'g', 'ac', null, '', 'guía p.13', [
  'nori', 'arroz_yamani', 'palta', 'pepino', 'brotes', o('tofu', { opt: 1 }), o('rabanitos', { opt: 1 }), 'shoyu']);
add('risotto-yamani-hongos', 'almuerzos', [45, 30, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.13-14', [
  'arroz_yamani', 'hongos_pino', 'hongos_champi', 'cebolla', 'ajo', 'agua', 'sal_marina', 'albahaca', o('brocoli', OPT)]);
add('risotto-remolacha-brocoli', 'almuerzos', [45, 30, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.14', [
  'arroz_yamani', 'remolacha', 'cebolla', 'puerro', 'agua', 'brocoli', 'sal_marina', o('aceite_oliva', { opt: 1, text: 'Para terminar: pesto verde fresco o 1 cucharada de aceite de oliva crudo' })]);
add('ensalada-quinoa-habas-brocoli', 'ensaladas', [25, 15, 0], 'g', 'ac', null, 'cocido', 'guía p.15', [
  'quinoa', 'habas', 'brocoli', 'palta', 'albahaca', o('castanas_caju', { opt: 1 }),
  S(o('sal_marina', { text: 'Sal marina a gusto' }), o('limon', { text: 'Jugo de limón a gusto' }))], { serv: 1 });
add('guiso-mung-calabaza', 'almuerzos', [40, 15, 480], 'g', 'ac', 'calido', 'cocido', 'guía p.15', [
  'porotos_mung', 'calabaza_anco', 'puerro', 'apio', 'zanahoria', 'ajo', 'curry', 'agua', 'sal_marina', o('espinaca', { opt: 1, text: 'Para acompañar: salsa criolla con tutti y verduras verdes al vapor (espinaca, espárragos, chauchas, Bruselas, brócoli)' })]);
add('papa-burguers-horno', 'almuerzos', [35, 20, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.15', [
  'papa', 'zanahoria', 'zucchini', 'ajo', 'cebolla',
  S(o('sal_marina', { text: 'Sal marina a gusto' }), o('pimienta', { text: 'Pimienta negra molida a gusto' })), o('brocoli', OPT)],
  { limits: { perWeek: 1 }, serv: null });
add('papa-horno-alino-caju', 'almuerzos', [45, 5, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.15', [
  'papa', 'castanas_caju', 'sal_marina', o('hojas_verdes', OPT)], { limits: { perWeek: 1 }, serv: 1, alExtra: ['citricos'], note: 'El aliño de cajú de la guía (pág. 22) lleva jugo de limón: por eso se marca Cítricos.' });
add('arroz-coliflor-salteado', 'almuerzos', [15, 15, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.15 y p.12', [
  'coliflor', 'zanahoria', 'habas', 'ajo', 'agua',
  S(o('sal_marina', { text: 'Sal marina a gusto' }), o('shoyu', { text: 'Gotas de salsa Shoyu MOA al apagar el fuego' }))]);
add('salteado-hongos-brotes-mung', 'almuerzos', [12, 12, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.18', [
  'puerro', 'ajo', 'hongos_champi', 'brotes', 'agua', 'shoyu']);
add('ensalada-repollo-jengibre-macerada', 'ensaladas', [35, 10, 0], 'g', 'ac', null, 'crudo', 'guía p.18', [
  'repollo', 'manzana', 'jengibre', 'limon', 'sal_marina', 'aceite_oliva']);
add('coleslaw-detox-macerado', 'ensaladas', [25, 10, 0], 'g', 'ac', null, 'crudo', 'guía p.18', [
  'repollo', o('repollo', { text: '1 taza de repollo morado en tiras finas', qty: 1, unit: 'taza' }), 'zanahoria', 'limon', 'mostaza_dijon', 'aceite_oliva', 'sal_marina', o('castanas_caju', { opt: 1 })]);
add('trio-verduras-vapor-semillas', 'almuerzos', [12, 10, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.12 y p.18', [
  o(null, { choice: 1, role: 'principal', choiceCategory: 'verduras' }), o('mix_rawmesan', { text: '2 cucharadas de mix rawmesan de semillas', qty: 2, unit: 'cda' }), 'aceite_oliva', 'sal_marina']);
add('zanahorias-a-la-india', 'almuerzos', [15, 15, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.12', [
  'zanahoria', 'ajo', 'curcuma', 'comino', 'pimenton', 'limon', 'agua', 'sal_marina', o('brocoli', { opt: 1 })]);
add('tabule-quinoa-coliflor', 'ensaladas', [15, 15, 0], 'g', 'ac', null, 'crudo', 'guía p.14', [
  'quinoa', 'perejil', 'menta', 'cebolla_verdeo', 'morron', 'tomate', 'limon', 'aceite_oliva',
  S(o('sal_marina', { text: 'Sal marina fina a gusto' }), o('pimienta', { text: 'Pimienta negra a gusto' }))]);
add('zucchinis-a-la-menta', 'ensaladas', [15, 10, 0], 'g', 'ac', 'fresco', 'crudo', 'guía p.19', [
  'zucchini', 'limon', 'menta', 'ajo', 'pimienta', 'sal_marina', 'aceite_oliva']);
add('colchon-de-arvejas', 'almuerzos', [20, 10, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.19', [
  'arvejas', 'cebolla', 'agua', 'aceite_oliva', 'sal_marina', 'hojas_verdes']);

// ───────────────────────────── Sopas ─────────────────────────────
add('sopa-fria-pepino-cilantro', 'sopas', [10, 10, 0], 'g', 'ac', 'fresco', 'sin-coccion', 'guía p.16', [
  'palta', 'pepino', 'limon', 'agua', 'sal_marina', 'cilantro']);
add('sopa-fria-apio-palta', 'sopas', [10, 10, 0], 'g', 'ac', 'fresco', 'sin-coccion', 'guía p.16', [
  'palta', 'apio', 'limon', 'comino', 'ajo', 'aceite_oliva', 'rucula', 'sal_marina', 'agua']);
add('gazpacho-verde', 'sopas', [10, 10, 0], 'g', 'ac', 'fresco', 'sin-coccion', 'guía p.16', [
  'tomate', 'pepino', 'cebolla', 'morron', 'ajo', 'aceite_oliva',
  S(o('sal_marina', { text: 'Sal marina a gusto' }), o('pimienta', { text: 'Pimienta negra a gusto' })), o('albahaca', { text: 'Hierbas frescas al gusto: orégano, albahaca, cilantro o perejil' }), 'agua']);
add('sopa-kale-brocoli-castanas', 'sopas', [30, 15, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.17', [
  'ajo', 'cebolla', 'brocoli', 'espinaca', 'castanas_caju', 'agua',
  S(o('sal_marina', { text: 'Sal marina a gusto' }), o('pimienta', { text: 'Pimienta negra a gusto' }), o('nuez_moscada', { text: 'Nuez moscada a gusto' }), o('tomillo', { text: 'Tomillo seco a gusto' })), 'aceite_oliva']);
add('borsch-depurativo-caju', 'sopas', [75, 15, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.17', [
  'remolacha', 'cebolla', 'agua', 'limon', 'azucar_mascabo',
  S(o('pimienta', { text: 'Pimienta blanca molida a gusto' }), o('sal_marina', { text: 'Sal marina a gusto' })), o('castanas_caju', { opt: 1, text: 'Para coronar: 1 cucharada de untable de cajú fermentado por plato' })],
  { note: 'La guía indica 1 cdita de azúcar mascabo; la v1 sumó «o miel». Es la única mención de azúcar de toda la guía.' });
add('sopa-crema-coliflor-caju', 'sopas', [25, 15, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.17', [
  'coliflor', 'ajo', 'cebolla', 'puerro', 'curcuma', 'castanas_caju', 'agua', 'sal_marina',
  S(o('naranja', { opt: 1, text: 'Opcional para servir: ralladura de piel de naranja limpia', qty: null }), o('cilantro', { opt: 1, text: 'Opcional para servir: hojas de cilantro fresco', qty: null }))]);
add('sopa-zanahoria-jengibre-curcuma', 'sopas', [25, 15, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.17', [
  'zanahoria', 'puerro', 'apio', 'ajo', 'jengibre', 'curcuma', 'agua', 'sal_marina', o('cilantro', { text: 'Para terminar: hierbas frescas picadas (cilantro, albahaca, menta o verdeo)' })]);
add('sopa-berro-leche-caju', 'sopas', [15, 10, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.17', [
  'berro', 'puerro', 'ajo', o('castanas_caju', { text: '1 taza de leche vegetal de cajú casera', qty: 1, unit: 'taza' }), 'agua', 'agua',
  S(o('sal_marina', { text: 'Sal marina a gusto' }), o('pimienta', { text: 'Pimienta negra a gusto' }))]);
add('sopa-apio-eneldo-curry', 'sopas', [25, 15, 0], 'g', 'ac', 'calido', 'cocido', 'guía p.18', [
  'apio', 'papa', 'cebolla', 'curry', 'aceite_oliva', 'eneldo', 'agua', 'sal_marina', o('castanas_caju', OPT)]);
add('sopa-crema-porotos-mung', 'sopas', [35, 15, 480], 'g', 'ac', 'calido', 'cocido', 'guía p.18', [
  'porotos_mung', 'puerro', 'apio', 'cebolla', 'ajo', 'agua', 'cilantro', 'sal_marina', 'agua']);
add('caldo-de-miso', 'caldos', [3, 3, 0], 'mg', 'damc', 'calido', 'sin-coccion', 'guía p.7', [
  'miso', 'agua', S(o('wakame', { opt: 1, text: 'Opcional: hebras de alga wakame hidratadas', qty: null }), o('cebolla_verdeo', { opt: 1, text: 'Opcional: cebolla de verdeo cruda picada finita', qty: null }))]);

// ───────────────────────────── Desayunos y jugos ─────────────────────────────
add('pudding-chia-compota', 'desayunos', [5, 5, 480], 'g', 'dm', 'fresco', 'sin-coccion', 'guía p.10', [
  'semillas_chia', o('almendras', { text: '1 taza (250 ml) de leche vegetal de almendras casera', qty: 1, unit: 'taza' }), 'vainilla', 'manzana', o('almendras', { opt: 1, text: 'Para decorar: 1 cucharada de almendras tostadas picadas o nueces picadas' })],
  { note: 'La guía recomienda la versión con compota o nituke de manzana para quienes son friolentos; sin ella queda algo fría.' });
add('licuado-rojo-pasion', 'jugos', [5, 5, 0], 'g', 'dm', 'fresco', 'sin-coccion', 'guía p.11', [
  'pomelo', 'frutillas', 'naranja', o('jengibre', OPT), o('menta', { opt: 1 }), o('almendras', { opt: 1, text: 'Para acompañar si rompés el ayuno con jugo: 6 almendras crudas o nueces' })]);
add('licuado-verde-depurativo', 'jugos', [7, 7, 0], 'g', 'dm', 'fresco', 'sin-coccion', 'guía p.11', [
  'apio', 'espinaca', 'menta', 'jengibre', 'limon', 'agua', o('almendras', { opt: 1, text: 'Para acompañar si rompés el ayuno con jugo: 6 almendras o nueces' })]);
add('crema-tibia-mijo-canela', 'desayunos', [30, 10, 0], 'g', 'dm', 'calido', 'cocido', 'v1 (no figura textual en la guía)', [
  'mijo', 'agua', 'canela', 'manzana', 'sal_marina', o('semillas_lino', { opt: 1 })],
  { note: 'Receta agregada en la v1: la guía menciona el mijo para risottos y cremas pero no trae esta preparación. Verificar con Isa.' });
add('manzanas-asadas-canela', 'desayunos', [35, 5, 0], 'g', 'dm', 'calido', 'cocido', 'v1 (no figura textual en la guía)', [
  'manzana', 'canela', 'agua', 'nueces', S(o('nuez_moscada', { opt: 1, text: 'Opcional: 1 pizca de nuez moscada', qty: 1, unit: 'pizca' }), o('clavo_olor', { opt: 1, text: 'Opcional: 2 clavos de olor', qty: 2, unit: 'unidad' }))],
  { note: 'Receta agregada en la v1: la guía propone manzana en nituke y compota, no al horno. Verificar con Isa.' });
add('bastones-crocantes-dips', 'desayunos', [10, 10, 0], 'g', 'm', 'fresco', 'crudo', 'guía p.19', [
  'apio', 'hinojo', 'zanahoria', 'pepino', o(null, OPT)]);
add('jugo-amo-mi-higado', 'jugos', [5, 5, 0], 'g', 'dm', 'fresco', 'sin-coccion', 'guía p.10', [
  'remolacha', 'zanahoria', 'apio', 'jengibre', o('almendras', { opt: 1, text: 'Para acompañar si rompés el ayuno con jugo: 6 almendras crudas o nueces' })]);
add('compota-manzana-clavo-canela', 'desayunos', [25, 5, 0], 'g', 'dm', 'calido', 'cocido', 'guía p.9', [
  'manzana', 'agua', 'canela', 'clavo_olor', o('arandanos', { opt: 1 }), o('almendras', { opt: 1 })]);
add('hot-cakes-avena-coco', 'desayunos', [15, 15, 480], 'g', 'dm', null, 'cocido', 'guía p.10', [
  'avena', 'coco_rallado', 'bicarbonato', o('banana', { opt: 1 })],
  { note: 'Solo con sartén antiadherente cerámica o de teflón, porque no se usa aceite. La avena contiene gluten.' });

// ───────────────────────────── Infusiones ─────────────────────────────
add('infusion-quelante-ortiga-diente-leon', 'infusiones', [10, 2, 0], 'mg', 'damc', 'fresco', 'cocido', 'guía p.23', [
  'ortiga', 'diente_leon', 'agua'],
  { note: 'Ortiga: no usar con anticoagulantes. La guía menciona un protocolo de «quelación y desparasitación» con estas dos hierbas (2 tazas por día); no se automatiza: consultalo con un profesional.' });
add('mate-medicinal-hierbas', 'infusiones', [5, 5, 0], 'mg', 'damc', null, 'cocido', 'guía p.25', [
  'yuyos_mate', o('limon', { opt: 1, text: 'Cáscaras secas o frescas de cítricos limpios (limón, naranja o mandarina)' }), 'yuyos_mate', o('stevia', { opt: 1 }), 'agua']);
add('infusion-digestiva-albahaca-jengibre', 'infusiones', [10, 5, 0], 'mg', 'damc', 'calido', 'cocido', 'guía p.23', [
  'jengibre', 'albahaca', 'agua']);
add('infusion-calmante-triple-flor', 'infusiones', [8, 2, 0], 'mg', 'damc', 'neutro', 'cocido', 'guía p.23', [
  'manzanilla', 'calendula', 'lavanda', 'agua']);

module.exports = { V };
