/* Detox de Primavera v2 — catálogo base de compras del programa «Detox de Primavera».
   Los 50 ítems de v1 conservan su id (v1…pr3); los faltantes que usan las recetas y que figuran en LISTA-DE-COMPRAS.md tienen ids x1…
   stage: 'previa' = compra inicial de la preparación (arroz, manzanas, limones, sal; opcionales: sésamo, shoyu, té verde) · 'general' = el resto. */
(function (root) {
  'use strict';
  root.DX = root.DX || {};

  // S(id, ítem, comercio, cantidad, esencial, ingrediente, etapa)
  function S(id, item, store, qty, essential, ingredient, stage) {
    return { id: id, item: item, store: store, qty: qty, essential: !!essential, ingredient: ingredient || null, stage: stage || 'general' };
  }

  root.DX.shopping = [
    // ───────── Verdulería (v1) ─────────
    S('v1', 'Manzanas rojas o verdes (agroecológicas)', 'verduleria', '3 a 5 kg', true, 'manzana', 'previa'),
    S('v2', 'Limones frescos', 'verduleria', '1 a 2 docenas', true, 'limon', 'previa'),
    S('v3', 'Jengibre fresco', 'verduleria', '2 raíces', true, 'jengibre'),
    S('v4', 'Brócoli fresco', 'verduleria', '2 plantas', true, 'brocoli'),
    S('v5', 'Coliflor', 'verduleria', '1 planta', true, 'coliflor'),
    S('v6', 'Repollitos de Bruselas o repollo', 'verduleria', '1 bandeja / 1 repollo', true, 'repollitos_bruselas'),
    S('v7', 'Zanahorias', 'verduleria', '2 kg', true, 'zanahoria'),
    S('v8', 'Remolachas con hojas', 'verduleria', '2 atados', true, 'remolacha'),
    S('v9', 'Espinacas frescas', 'verduleria', '2 atados', true, 'espinaca'),
    S('v10', 'Kale', 'verduleria', '1 atado', false, 'espinaca'),
    S('v11', 'Espárragos y alcauciles', 'verduleria', '1 atado / 3 unidades', false, 'esparragos'),
    S('v12', 'Apio entero', 'verduleria', '1 planta grande', true, 'apio'),
    S('v13', 'Zapallo cabutiá o anco', 'verduleria', '1 mediano', true, 'calabaza_anco'),
    S('v14', 'Zucchinis', 'verduleria', '3 o 4 unidades', true, 'zucchini'),
    S('v15', 'Cebollas y cebolla de verdeo', 'verduleria', '1 kg cebolla / 2 atados verdeo', true, 'cebolla'),
    S('v16', 'Puerro y ajo', 'verduleria', '1 atado puerro / 2 cabezas ajo', true, 'puerro'),
    S('v17', 'Hierbas: cilantro, perejil, albahaca', 'verduleria', '1 atado de cada uno', true, null),
    S('v18', 'Paltas maduras', 'verduleria', '3 a 4 unidades', false, 'palta'),
    S('v19', 'Frutillas, arándanos o pomelos', 'verduleria', '1 a 2 bandejas', false, 'frutillas'),

    // ───────── Dietética (v1) ─────────
    S('d1', 'Arroz yamaní o basmati integral', 'dietetica', '2 kg', true, 'arroz_yamani', 'previa'),
    S('d2', 'Arroz integral largo fino', 'dietetica', '1 kg', false, 'arroz_yamani', 'previa'),
    S('d3', 'Quinoa real', 'dietetica', '1 kg', true, 'quinoa'),
    S('d4', 'Porotos mung', 'dietetica', '1 kg', true, 'porotos_mung'),
    S('d5', 'Porotos negros o aduki', 'dietetica', '500 g', false, 'porotos_aduki'),
    S('d6', 'Aceite de oliva extra virgen (1.ª presión en frío)', 'dietetica', '1 botella oscura', true, 'aceite_oliva'),
    S('d7', 'Aceite o semillas de lino', 'dietetica', '1 botellita / 250 g', true, 'aceite_lino'),
    S('d8', 'Semillas de sésamo integral y chía', 'dietetica', '250 g de cada una', true, 'semillas_sesamo', 'previa'),
    S('d9', 'Castañas de cajú crudas (sin sal)', 'dietetica', '250 a 500 g', false, 'castanas_caju'),
    S('d10', 'Almendras crudas', 'dietetica', '250 g', false, 'almendras'),
    S('d11', 'Sal marina fina o del Himalaya', 'dietetica', '500 g', true, 'sal_marina', 'previa'),
    S('d12', 'Vinagre de sidra de manzana vivo (sin pasteurizar)', 'dietetica', '1 botella', true, 'vinagre_manzana'),
    S('d13', 'Salsa de soja Shoyu MOA (fermento natural)', 'dietetica', '1 botella', true, 'shoyu', 'previa'),
    S('d14', 'Chucrut o kimchi vivo en heladera', 'dietetica', '1 frasco', false, 'chucrut'),
    S('d15', 'Tofu orgánico firme (Soyana)', 'dietetica', '1 bloque', false, 'tofu'),

    // ───────── Herboristería (v1) ─────────
    S('h1', 'Ortiga seca en hojas', 'herboristeria', '100 g', true, 'ortiga'),
    S('h2', 'Diente de león seco', 'herboristeria', '100 g', true, 'diente_leon'),
    S('h3', 'Flores secas de manzanilla', 'herboristeria', '100 g', true, 'manzanilla'),
    S('h4', 'Menta fresca o seca', 'herboristeria', '100 g', false, 'menta'),
    S('h5', 'Flores de lavanda y caléndula', 'herboristeria', '50 g de cada una', false, 'lavanda'),
    S('h6', 'Té verde, banchá o matcha', 'herboristeria', '1 paquete', false, 'te_verde', 'previa'),
    S('h7', 'Yuyos para mate: cedrón, cola de caballo, stevia en hoja', 'herboristeria', '50 g de cada uno', false, 'yuyos_mate'),

    // ───────── Panadería (v1) ─────────
    S('p1', 'Pan 100 % puro centeno de masa madre', 'panaderia', '1 hogaza (freezar en rodajas)', false, 'pan_centeno'),
    S('p2', 'Pan de trigo sarraceno puro de masa madre', 'panaderia', '1 unidad', false, 'pan_sarraceno'),

    // ───────── Farmacia y suplementos opcionales (v1) ─────────
    S('s1', 'Carbón activado (comprimidos o polvo)', 'farmacia', '1 caja', false, 'carbon_activado'),
    S('s2', 'Chlorella en polvo o comprimidos', 'farmacia', '1 frasco', false, 'chlorella'),
    S('s3', 'Clorofila líquida', 'farmacia', '1 frasco', false, 'clorofila'),
    S('s4', 'Psyllium en polvo o semillas', 'dietetica', '100 g', false, 'psyllium'),

    // ───────── Proteína animal de apoyo, opcional (v1) ─────────
    S('pr1', 'Pescado fresco (merluza o abadejo)', 'pescaderia', '1 kg', false, 'pescado'),
    S('pr2', 'Huevos de campo pastoriles', 'granja', '1 docena', false, 'huevos'),
    S('pr3', 'Huesos pastoriles para caldo', 'carniceria', '1 kg', false, 'huesos_caldo'),

    // ───────── Faltantes: ingredientes que usan las recetas y figuran en LISTA-DE-COMPRAS.md ─────────
    S('x1', 'Rabanitos', 'verduleria', '1 o 2 atados', false, 'rabanitos'),
    S('x2', 'Nabo', 'verduleria', '2 unidades', false, 'nabo'),
    S('x3', 'Hinojo', 'verduleria', '2 bulbos', false, 'hinojo'),
    S('x4', 'Rúcula', 'verduleria', '1 atado', false, 'rucula'),
    S('x5', 'Pepinos', 'verduleria', '3 unidades', false, 'pepino'),
    S('x6', 'Hongos portobello o champiñones frescos', 'verduleria', '300 g', false, 'hongos_champi'),
    S('x7', 'Tomates cherry y perita', 'verduleria', '1 bandeja', false, 'tomate_cherry'),
    S('x8', 'Morrón rojo o verde', 'verduleria', '1 unidad', false, 'morron'),
    S('x9', 'Papa (máximo 1 vez por semana)', 'verduleria', '1 kg', false, 'papa'),
    S('x10', 'Batata (máximo 1 vez por semana)', 'verduleria', '2 unidades', false, 'batata'),
    S('x11', 'Berenjenas', 'verduleria', '2 unidades', false, 'berenjena'),
    S('x12', 'Arvejas, habas y chauchas', 'verduleria', '500 g', false, 'arvejas'),
    S('x13', 'Berro', 'verduleria', '1 atado', false, 'berro'),
    S('x14', 'Menta y eneldo frescos', 'verduleria', '1 atado de cada uno', false, 'eneldo'),
    S('x15', 'Naranjas y mandarinas', 'verduleria', '4 unidades de cada una', false, 'naranja'),
    S('x16', 'Ananá', 'verduleria', '1 unidad', false, 'anana'),
    S('x17', 'Kiwi', 'verduleria', '2 unidades', false, 'kiwi'),
    S('x18', 'Limas', 'verduleria', '4 unidades', false, 'lima'),
    S('x19', 'Banana (solo para los hot cakes)', 'verduleria', '2 unidades', false, 'banana'),
    S('x20', 'Akusay (repollo chino, solo para kimchi)', 'verduleria', '1 kg', false, 'akusay'),
    S('x21', 'Pimienta negra', 'dietetica', '1 frasco', false, 'pimienta'),
    S('x22', 'Cúrcuma (en polvo o raíz)', 'dietetica', '1 frasco / 1 raíz', false, 'curcuma'),
    S('x23', 'Comino, curry y pimentón dulce', 'dietetica', '1 frasco de cada uno', false, 'comino'),
    S('x24', 'Canela (rama o en polvo) y clavo de olor', 'dietetica', '1 frasco', false, 'canela'),
    S('x25', 'Mostaza antigua o de Dijon', 'dietetica', '1 frasco', false, 'mostaza_dijon'),
    S('x26', 'Nueces y pistachos', 'dietetica', '200 g', false, 'nueces'),
    S('x27', 'Levadura de cerveza o nutricional', 'dietetica', '1 frasco', false, 'levadura_cerveza'),
    S('x28', 'Mijo pelado', 'dietetica', '500 g', false, 'mijo'),
    S('x29', 'Avena arrollada (solo para los hot cakes)', 'dietetica', '500 g', false, 'avena'),
    S('x30', 'Alga nori', 'dietetica', '1 paquete', false, 'nori'),
    S('x31', 'Alga kombu', 'dietetica', '1 trozo', false, 'kombu'),
    S('x32', 'Miso sin pasteurizar', 'dietetica', '1 pote', false, 'miso'),
    S('x33', 'Agar-agar', 'dietetica', '1 sobre', false, 'agar_agar'),
    S('x34', 'Pasas de uva o aceitunas negras', 'dietetica', '1 paquete / 1 frasco', false, 'pasas_uva'),
    S('x35', 'Hongos de pino secos', 'dietetica', '50 g', false, 'hongos_pino'),
    S('x36', 'Lentejas y garbanzos', 'dietetica', '500 g de cada uno', false, 'lentejas'),
    S('x37', 'Brotes de alfalfa o de mung', 'dietetica', '1 bandeja', false, 'brotes'),
    S('x38', 'Semillas de zapallo y de girasol', 'dietetica', '200 g de cada una', false, 'semillas_zapallo'),
    S('x39', 'Coco rallado (solo para los hot cakes)', 'dietetica', '100 g', false, 'coco_rallado'),
    S('x40', 'Miel pura (opcional: aliño y tostadas)', 'dietetica', '1 frasco chico', false, 'miel'),
    S('x41', 'Bicarbonato de sodio', 'dietetica', '1 sobre', false, 'bicarbonato'),
    S('x42', 'Esencia de vainilla natural (pudding de chía)', 'dietetica', '1 frasquito', false, 'vainilla'),
    S('x43', 'Tomillo, orégano y laurel secos', 'herboristeria', '1 frasco de cada uno', false, 'laurel'),
    S('x44', 'Harina de arroz integral y de trigo sarraceno (si hacés galletas o pan)', 'panaderia', '500 g de cada una', false, 'harina_arroz_integral'),
    S('x45', 'Harina de centeno integral y masa madre (solo para el pan de centeno)', 'panaderia', '1 kg', false, 'harina_centeno_integral'),
    S('x46', 'Trigo sarraceno en grano, harina de amaranto y levadura de panadería (pan de sarraceno o de quinoa)', 'dietetica', '500 g de cada uno', false, 'trigo_sarraceno'),
    S('x47', 'Hamburguesas de legumbres (sin harinas blancas ni huevo)', 'dietetica', '1 caja', false, 'hamburguesa_legumbres'),
    S('x48', 'Fideos integrales o soba', 'dietetica', '1 paquete', false, 'fideos_integrales'),
    S('x49', 'Espirulina o wheatgrass (opcional, según constitución)', 'farmacia', '1 frasco', false, 'espirulina'),
    S('x50', 'Aloe vera líquido y aceite de ricino (solo escalera de constipación)', 'farmacia', '1 frasco de cada uno', false, 'aloe_vera'),
    S('x51', 'Agua de mar para tomar (opcional, desde el día 7)', 'farmacia', '1 botella', false, 'agua_mar')
  ];
})(typeof window !== 'undefined' ? window : globalThis);
