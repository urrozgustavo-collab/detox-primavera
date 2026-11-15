/* Detox de Primavera v2 — catálogo de ingredientes.
   Conserva los 54 ids de la heladera de v1 y suma todo lo que usan las recetas.
   role: 'principal' (pesa 80 en la heladera) | 'condimento' (pesa 20) | 'basico' (no cuenta).
   soak → id en DX.prep.soaking · food → id en DX.foods · pantry:true = básico de alacena (siempre presente). */
(function (root) {
  'use strict';
  root.DX = root.DX || {};

  // I(id, nombre, categoría, comercio, rol, sinónimos, alérgenos, remojo, semáforo, alacena)
  function I(id, name, category, store, role, synonyms, allergens, soak, food, pantry) {
    return { id: id, name: name, category: category, store: store, role: role,
      synonyms: synonyms || [], allergens: allergens || [], soak: soak || null, food: food || null, pantry: !!pantry };
  }
  var P = 'principal', C = 'condimento', B = 'basico';

  root.DX.ingredients = [
    // ── Cereales y granos ──
    I('arroz_yamani', 'Arroz yamaní integral', 'granos', 'dietetica', P, ['arroz yamani', 'arroz yamaní', 'yamani', 'arroz integral', 'arroz integral largo fino', 'arroz basmati', 'arroz mochi', 'basmati'], [], 'remojo-arroz', 'arroz-integral'),
    I('quinoa', 'Quinoa', 'granos', 'dietetica', P, ['quinoa', 'quinua', 'quinoa real', 'quinoa tricolor'], [], 'remojo-quinoa', 'quinoa'),
    I('mijo', 'Mijo pelado', 'granos', 'dietetica', P, ['mijo', 'mijo pelado'], [], 'remojo-mijo', 'mijo'),
    I('trigo_sarraceno', 'Trigo sarraceno en grano', 'granos', 'dietetica', P, ['trigo sarraceno', 'sarraceno', 'alforfón'], [], 'remojo-sarraceno', 'trigo-sarraceno'),
    I('avena', 'Avena arrollada', 'granos', 'dietetica', P, ['avena', 'avena arrollada', 'copos de avena'], ['gluten'], 'remojo-avena', 'avena'),
    I('burgol', 'Trigo burgol', 'granos', 'dietetica', P, ['burgol', 'trigo burgol'], ['gluten'], null, null),
    I('fideos_integrales', 'Fideos integrales (trigo, quinoa, sarraceno, legumbres)', 'pastas', 'dietetica', P, ['fideos', 'fideos integrales', 'soba', 'fideos soba', 'legume', 'pasta integral'], ['gluten'], null, 'fideos-integrales'),

    // ── Legumbres y proteínas ──
    I('porotos_mung', 'Porotos mung', 'legumbres', 'dietetica', P, ['mung', 'poroto mung', 'porotos mung', 'mungo', 'poroto verde'], ['legumbres'], 'remojo-mung', 'porotos-mung'),
    I('porotos_aduki', 'Porotos aduki', 'legumbres', 'dietetica', P, ['aduki', 'azuki', 'poroto aduki'], ['legumbres'], 'remojo-aduki', 'porotos-aduki'),
    I('porotos_negros', 'Porotos negros', 'legumbres', 'dietetica', P, ['porotos negros', 'poroto negro', 'frijoles negros'], ['legumbres'], 'remojo-legumbres', 'porotos-negros'),
    I('lentejas', 'Lentejas', 'legumbres', 'dietetica', P, ['lentejas', 'lenteja', 'lentejas turcas', 'lentejas negras'], ['legumbres'], 'remojo-legumbres', 'lentejas'),
    I('garbanzos', 'Garbanzos', 'legumbres', 'dietetica', P, ['garbanzos', 'garbanzo'], ['legumbres'], 'remojo-legumbres', 'garbanzos'),
    I('tofu', 'Tofu orgánico firme (Soyana)', 'proteinas', 'dietetica', P, ['tofu', 'tofu organico', 'tofu soyana'], ['soja'], null, 'tofu'),
    I('hamburguesa_legumbres', 'Hamburguesas de legumbres (sin harinas blancas ni huevo)', 'proteinas', 'dietetica', P, ['hamburguesa de legumbres', 'hamburguesas vegetales', 'medallones de legumbres'], ['legumbres'], null, 'hamburguesa-legumbres'),
    I('pescado', 'Pescado blanco fresco (merluza/abadejo)', 'proteinas', 'pescaderia', P, ['pescado', 'pescado blanco', 'merluza', 'abadejo', 'salmón', 'trucha'], ['pescado'], null, 'pescado'),
    I('huevos', 'Huevos de campo pastoriles', 'proteinas', 'granja', P, ['huevos', 'huevo', 'huevos pastoriles'], ['huevo'], null, 'huevos'),
    I('huesos_caldo', 'Huesos pastoriles para caldo', 'proteinas', 'carniceria', P, ['huesos', 'caldo de huesos', 'hueso de pollo'], [], null, 'caldo-huesos'),

    // ── Verduras ──
    I('manzana', 'Manzana verde o roja (agroecológica)', 'frutas', 'verduleria', P, ['manzana', 'manzanas', 'manzana verde', 'manzana roja', 'manzana deliciosa', 'manzana gala'], [], null, 'manzana'),
    I('apio', 'Apio fresco (pencas y hojas)', 'verduras', 'verduleria', P, ['apio', 'pencas de apio', 'varas de apio', 'ramas de apio', 'planta de apio', 'cabeza de apio'], ['apio'], null, 'apio'),
    I('puerro', 'Puerro', 'verduras', 'verduleria', P, ['puerro', 'puerros'], [], null, 'puerro'),
    I('repollo', 'Repollo blanco o colorado', 'verduras', 'verduleria', P, ['repollo', 'repollo blanco', 'repollo morado', 'repollo colorado', 'col'], [], null, 'repollo'),
    I('akusay', 'Akusay (repollo chino)', 'verduras', 'verduleria', P, ['akusay', 'col china', 'repollo chino'], [], null, 'repollo'),
    I('zanahoria', 'Zanahoria', 'verduras', 'verduleria', P, ['zanahoria', 'zanahorias'], [], null, 'zanahoria'),
    I('calabaza_anco', 'Zapallo anco o cabutiá', 'verduras', 'verduleria', P, ['zapallo anco', 'calabaza', 'zapallo', 'cabutia', 'cabutiá', 'butternut'], [], null, 'zapallo'),
    I('berenjena', 'Berenjena', 'verduras', 'verduleria', P, ['berenjena', 'berenjenas'], [], null, 'berenjena'),
    I('brocoli', 'Brócoli', 'verduras', 'verduleria', P, ['brocoli', 'brócoli', 'brócolis', 'ramilletes de brocoli', 'arbolitos de brocoli'], [], null, 'brocoli-coliflor'),
    I('coliflor', 'Coliflor', 'verduras', 'verduleria', P, ['coliflor', 'ramilletes de coliflor'], [], null, 'brocoli-coliflor'),
    I('palta', 'Palta madura', 'grasas_frutas', 'verduleria', P, ['palta', 'paltas', 'aguacate'], [], null, 'palta'),
    I('remolacha', 'Remolacha con hojas', 'verduras', 'verduleria', P, ['remolacha', 'remolachas', 'betarraga'], [], null, 'remolacha'),
    I('zucchini', 'Zucchini', 'verduras', 'verduleria', P, ['zucchini', 'zucchinis', 'zuchinni', 'zuchinnis', 'zapallito verde', 'calabacín'], [], null, 'zapallo'),
    I('espinaca', 'Espinaca o kale', 'verduras', 'verduleria', P, ['espinaca', 'espinacas', 'kale', 'col rizada', 'acelga'], [], null, 'kale-espinaca'),
    I('alcaucil', 'Alcaucil (estacional)', 'verduras', 'verduleria', P, ['alcaucil', 'alcauciles', 'alcachofa', 'alcachofas'], [], null, 'esparragos-alcauciles'),
    I('repollitos_bruselas', 'Repollitos de Bruselas', 'verduras', 'verduleria', P, ['repollitos de bruselas', 'bruselas', 'col de bruselas'], [], null, 'bruselas'),
    I('esparragos', 'Espárragos frescos', 'verduras', 'verduleria', P, ['esparragos', 'espárragos', 'puntas de espárragos'], [], null, 'esparragos-alcauciles'),
    I('pepino', 'Pepino', 'verduras', 'verduleria', P, ['pepino', 'pepinos'], [], null, 'pepino'),
    I('rabanitos', 'Rabanitos', 'verduras', 'verduleria', P, ['rabanitos', 'rabanito', 'rábano'], [], null, 'rabanitos-nabo'),
    I('nabo', 'Nabo', 'verduras', 'verduleria', P, ['nabo', 'nabos'], [], null, 'rabanitos-nabo'),
    I('hinojo', 'Hinojo (bulbo y hojas)', 'verduras', 'verduleria', P, ['hinojo', 'bulbo de hinojo', 'hojas de hinojo'], [], null, 'hinojo'),
    I('rucula', 'Rúcula', 'verduras', 'verduleria', P, ['rucula', 'rúcula'], [], null, 'rucula-hojas'),
    I('hojas_verdes', 'Lechuga, achicoria y hojas verdes', 'verduras', 'verduleria', P, ['lechuga', 'achicoria', 'radicheta', 'mix de verdes', 'hojas verdes', 'lechuga morada'], [], null, 'rucula-hojas'),
    I('berro', 'Berro', 'verduras', 'verduleria', P, ['berro', 'berros'], [], null, 'rucula-hojas'),
    I('tomate', 'Tomate redondo o perita', 'verduras', 'verduleria', P, ['tomate', 'tomates', 'tomate perita', 'tomate redondo'], [], null, 'tomate'),
    I('tomate_cherry', 'Tomates cherry', 'verduras', 'verduleria', P, ['cherry', 'cherrys', 'tomates cherry', 'tomate cherry'], [], null, 'tomate'),
    I('morron', 'Morrón verde o rojo', 'verduras', 'verduleria', P, ['morron', 'morrón', 'pimiento'], [], null, 'morron'),
    I('choclo', 'Choclo', 'verduras', 'verduleria', P, ['choclo', 'maíz tierno'], [], null, 'choclo'),
    I('arvejas', 'Arvejas', 'verduras', 'verduleria', P, ['arvejas', 'arveja', 'guisantes'], ['legumbres'], null, 'habas-arvejas'),
    I('habas', 'Habas', 'verduras', 'verduleria', P, ['habas', 'haba'], ['legumbres'], null, 'habas-arvejas'),
    I('chauchas', 'Chauchas', 'verduras', 'verduleria', P, ['chauchas', 'chaucha', 'porotos verdes'], ['legumbres'], null, 'habas-arvejas'),
    I('papa', 'Papa', 'verduras', 'verduleria', P, ['papa', 'papas', 'patata'], [], null, 'papa'),
    I('batata', 'Batata', 'verduras', 'verduleria', P, ['batata', 'batatas', 'camote'], [], null, 'batata'),
    I('brotes', 'Brotes frescos (alfalfa, mung, rabanitos)', 'brotes', 'dietetica', P, ['brotes', 'brotes de alfalfa', 'brotes de soja', 'brotes de mung', 'brotes de poroto mung', 'germinados'], ['legumbres'], null, 'brotes'),
    I('hongos_champi', 'Champiñones y portobello frescos', 'hongos', 'verduleria', P, ['champiñones', 'champis', 'portobello', 'hongos', 'hongos portobello', 'hongos frescos'], [], null, 'hongos'),
    I('hongos_pino', 'Hongos de pino secos', 'hongos', 'dietetica', C, ['hongos de pino', 'hongos secos'], [], null, 'hongos'),

    // ── Frutas ──
    I('frutillas', 'Frutillas agroecológicas', 'frutas', 'verduleria', P, ['frutillas', 'frutilla'], ['frutillas'], null, 'frutos-rojos'),
    I('arandanos', 'Arándanos y frutos rojos', 'frutas', 'verduleria', P, ['arándanos', 'arandanos', 'frambuesas', 'frutos rojos'], [], null, 'frutos-rojos'),
    I('pomelo', 'Pomelo rosado', 'citricos', 'verduleria', P, ['pomelo', 'pomelos', 'pomelo rosado'], ['citricos'], null, 'citricos'),
    I('naranja', 'Naranja', 'citricos', 'verduleria', P, ['naranja', 'naranjas', 'ralladura de naranja', 'jugo de naranja'], ['citricos'], null, 'citricos'),
    I('mandarina', 'Mandarina', 'citricos', 'verduleria', P, ['mandarina', 'mandarinas', 'gajos de mandarina'], ['citricos'], null, 'citricos'),
    I('kiwi', 'Kiwi', 'frutas', 'verduleria', P, ['kiwi', 'kiwis'], [], null, 'anana-kiwi-pera'),
    I('anana', 'Ananá', 'frutas', 'verduleria', P, ['ananá', 'anana', 'ananas'], [], null, 'anana-kiwi-pera'),
    I('pera', 'Pera', 'frutas', 'verduleria', P, ['pera', 'peras'], [], null, 'anana-kiwi-pera'),
    I('banana', 'Banana', 'frutas', 'verduleria', P, ['banana', 'bananas'], [], null, 'banana'),
    I('limon', 'Limón fresco', 'citricos', 'verduleria', C, ['limon', 'limones', 'jugo de limon', 'jugo de limón', 'ralladura de limón'], ['citricos'], null, 'limon'),
    I('lima', 'Lima', 'citricos', 'verduleria', C, ['lima', 'limas', 'jugo de lima'], ['citricos'], null, 'limon'),
    I('coco_rallado', 'Coco rallado', 'frutas', 'dietetica', C, ['coco', 'coco rallado', 'escamas de coco'], [], null, 'coco'),
    I('pasas_uva', 'Pasas de uva', 'frutas', 'dietetica', C, ['pasas', 'pasas de uva'], [], null, 'aceitunas'),

    // ── Aromáticas, hierbas y especias ──
    I('ajo', 'Diente de ajo', 'aromaticos', 'verduleria', C, ['ajo', 'dientes de ajo', 'ajo picado', 'cabeza de ajo'], [], null, 'ajo'),
    I('cebolla', 'Cebolla', 'aromaticos', 'verduleria', C, ['cebolla', 'cebolla blanca', 'cebolla deshidratada'], [], null, 'cebolla'),
    I('cebolla_verdeo', 'Cebolla de verdeo y cebollín', 'aromaticos', 'verduleria', C, ['verdeo', 'cebolla de verdeo', 'cebollín', 'hojas de verdeo', 'nirá'], [], null, 'cebolla'),
    I('cebolla_morada', 'Cebolla morada', 'aromaticos', 'verduleria', C, ['cebolla morada', 'cebolla colorada'], [], null, 'cebolla'),
    I('albahaca', 'Albahaca fresca', 'hierbas', 'verduleria', C, ['albahaca', 'albahaca fresca', 'hojas de albahaca'], [], null, 'hierbas-especias'),
    I('perejil', 'Perejil fresco', 'hierbas', 'verduleria', C, ['perejil', 'perejil fresco'], [], null, 'hierbas-especias'),
    I('cilantro', 'Cilantro fresco', 'hierbas', 'verduleria', C, ['cilantro', 'cilantro fresco'], [], null, 'hierbas-especias'),
    I('eneldo', 'Eneldo fresco', 'hierbas', 'verduleria', C, ['eneldo'], [], null, 'hierbas-especias'),
    I('menta', 'Menta fresca o seca', 'hierbas', 'verduleria', C, ['menta', 'hojas de menta', 'menta fresca', 'menta seca'], [], null, 'hierbas-especias'),
    I('tomillo', 'Tomillo', 'hierbas', 'herboristeria', C, ['tomillo'], [], null, 'hierbas-especias'),
    I('oregano', 'Orégano o romero seco', 'hierbas', 'herboristeria', C, ['oregano', 'orégano', 'hierbas secas', 'romero'], [], null, 'hierbas-especias'),
    I('laurel', 'Hojas de laurel seco', 'hierbas', 'herboristeria', C, ['laurel', 'hojas de laurel'], [], null, 'hierbas-especias'),
    I('comino', 'Comino en polvo', 'especias', 'dietetica', C, ['comino', 'comino molido'], [], null, 'hierbas-especias'),
    I('curcuma', 'Cúrcuma molida o en raíz', 'especias', 'dietetica', C, ['curcuma', 'cúrcuma', 'turmeric'], [], null, 'hierbas-especias'),
    I('canela', 'Canela en polvo o rama', 'especias', 'dietetica', C, ['canela', 'canela molida', 'rama de canela'], [], null, 'hierbas-especias'),
    I('jengibre', 'Jengibre fresco', 'especias', 'verduleria', C, ['jengibre', 'raíz de jengibre', 'jugo de jengibre'], [], null, 'jengibre'),
    I('pimienta', 'Pimienta negra', 'especias', 'dietetica', C, ['pimienta', 'pimienta negra', 'pimienta blanca'], [], null, 'hierbas-especias'),
    I('pimenton', 'Pimentón dulce', 'especias', 'dietetica', C, ['pimenton', 'pimentón', 'páprika', 'paprika'], [], null, 'hierbas-especias'),
    I('curry', 'Curry o masala', 'especias', 'dietetica', C, ['curry', 'masala'], [], null, 'hierbas-especias'),
    I('clavo_olor', 'Clavo de olor', 'especias', 'dietetica', C, ['clavo de olor', 'clavos'], [], null, 'hierbas-especias'),
    I('nuez_moscada', 'Nuez moscada', 'especias', 'dietetica', C, ['nuez moscada'], [], null, 'hierbas-especias'),
    I('aji_picante', 'Ají picante o copos de chile', 'especias', 'dietetica', C, ['ají', 'aji', 'chile', 'ají picante'], [], null, 'hierbas-especias'),
    I('vainilla', 'Esencia de vainilla natural', 'condimentos', 'dietetica', C, ['vainilla', 'esencia de vainilla'], [], null, null),

    // ── Frutos secos y semillas ──
    I('almendras', 'Almendras crudas sin tostar', 'frutos_secos', 'dietetica', P, ['almendras', 'almendra', 'almendras crudas', 'almendras tostadas'], ['frutos_secos'], 'remojo-almendras', 'frutos-secos'),
    I('castanas_caju', 'Castañas de cajú crudas (sin sal)', 'frutos_secos', 'dietetica', P, ['caju', 'cajú', 'castañas de cajú', 'castañas caju', 'anacardos'], ['frutos_secos'], 'remojo-caju', 'frutos-secos'),
    I('nueces', 'Nueces', 'frutos_secos', 'dietetica', C, ['nueces', 'nuez'], ['frutos_secos'], null, 'frutos-secos'),
    I('pistachos', 'Pistachos', 'frutos_secos', 'dietetica', C, ['pistachos', 'pistacho'], ['frutos_secos'], null, 'frutos-secos'),
    I('semillas_lino', 'Semillas de lino (dorado o marrón)', 'semillas', 'dietetica', C, ['lino', 'semillas de lino', 'linaza', 'lino molido'], ['semillas'], 'remojo-lino', 'aceite-lino'),
    I('semillas_chia', 'Semillas de chía', 'semillas', 'dietetica', C, ['chia', 'chía', 'semillas de chia', 'semillas de chía'], ['semillas'], 'remojo-chia', 'semillas'),
    I('semillas_sesamo', 'Semillas de sésamo integral', 'semillas', 'dietetica', C, ['sesamo', 'sésamo', 'semillas de sésamo', 'ajonjolí'], ['sesamo', 'semillas'], null, 'semillas'),
    I('semillas_girasol', 'Semillas de girasol crudas', 'semillas', 'dietetica', C, ['girasol', 'semillas de girasol', 'pipas'], ['semillas'], null, 'semillas'),
    I('semillas_zapallo', 'Semillas de zapallo (calabaza)', 'semillas', 'dietetica', C, ['semillas de zapallo', 'semillas de calabaza', 'pepitas'], ['semillas'], null, 'semillas'),
    I('semillas_amapola', 'Semillas de amapola', 'semillas', 'dietetica', C, ['amapola', 'semillas de amapola'], ['semillas'], null, 'semillas'),
    I('mix_rawmesan', 'Mix de semillas tipo rawmesan (casero)', 'semillas', 'dietetica', C, ['rawmesan', 'mix rawmesan', 'mix de semillas rawmesan', 'mix de semillas tipo rawmesan'], ['semillas', 'gluten'], null, 'semillas'),
    I('semillas_varias', 'Mix de semillas variadas', 'semillas', 'dietetica', C, ['semillas variadas', 'mix de semillas', 'semillas varias'], ['semillas', 'sesamo'], null, 'semillas'),

    // ── Harinas, panes ──
    I('harina_arroz_integral', 'Harina de arroz integral', 'harinas', 'dietetica', P, ['harina de arroz', 'harina arroz integral', 'harina integral de arroz'], [], null, null),
    I('harina_centeno_integral', 'Harina de centeno integral pura', 'harinas', 'dietetica', P, ['harina de centeno', 'centeno integral', 'harina centeno'], ['gluten'], null, 'centeno-masa-madre'),
    I('harina_sarraceno', 'Harina de trigo sarraceno', 'harinas', 'dietetica', P, ['harina de trigo sarraceno', 'harina de sarraceno'], [], null, 'trigo-sarraceno'),
    I('harina_amaranto', 'Harina de amaranto integral', 'harinas', 'dietetica', P, ['harina de amaranto', 'amaranto'], [], null, null),
    I('pan_centeno', 'Pan 100 % centeno de masa madre', 'panificados', 'panaderia', P, ['pan de centeno', 'pan de centeno puro', 'tostadas de centeno', 'pan integral'], ['gluten'], null, 'centeno-masa-madre'),
    I('pan_sarraceno', 'Pan de trigo sarraceno o de quinoa y amaranto', 'panificados', 'panaderia', P, ['pan de sarraceno', 'pan de quinoa y amaranto', 'pan sin gluten', 'pan de trigo sarraceno'], [], null, 'trigo-sarraceno'),
    I('galletas_arroz', 'Galletas de arroz o de semillas aptas', 'panificados', 'dietetica', P, ['galletas de arroz', 'galletas de arroz yamaní', 'arrocitas', 'galletas de semillas', 'galletitas de arroz'], [], null, null),

    // ── Aceites, fermentos y condimentos ──
    I('aceite_oliva', 'Aceite de oliva extra virgen (1.ª presión en frío)', 'grasas', 'dietetica', C, ['oliva', 'aceite de oliva', 'aceite de oliva virgen extra', 'aceite oliva crudo'], [], null, 'aceite-oliva', true),
    I('aceite_lino', 'Aceite de lino (1.ª presión en frío)', 'grasas', 'dietetica', C, ['aceite de lino', 'aceite de linaza'], ['semillas'], null, 'aceite-lino'),
    I('sal_marina', 'Sal marina fina o del Himalaya', 'condimentos', 'dietetica', C, ['sal marina', 'sal de mar', 'sal del himalaya', 'sal rosada', 'sal'], [], null, 'sal-marina', true),
    I('shoyu', 'Salsa de soja Shoyu MOA (fermento natural)', 'fermentos', 'dietetica', C, ['shoyu', 'salsa de soja', 'shoyu moa', 'soja fermentada'], ['soja'], null, 'shoyu-moa'),
    I('miso', 'Miso (pasta fermentada sin pasteurizar)', 'fermentos', 'dietetica', C, ['miso', 'pasta de miso', 'miso de arroz'], ['soja'], null, 'miso'),
    I('chucrut', 'Chucrut vivo artesanal', 'fermentos', 'dietetica', C, ['chucrut', 'sauerkraut', 'chucrut vivo', 'kimchi'], [], null, 'chucrut-kimchi'),
    I('vinagre_manzana', 'Vinagre de sidra de manzana vivo', 'fermentos', 'dietetica', C, ['vinagre de manzana', 'vinagre vivo', 'vinagre de sidra', 'vinagre'], [], null, 'vinagre-manzana'),
    I('masa_madre', 'Fermento de masa madre activo', 'fermentos', 'panaderia', P, ['masa madre', 'fermento natural', 'masa madre de centeno', 'fermento de masa madre'], ['gluten'], null, 'centeno-masa-madre'),
    I('iniciador_probiotico', 'Iniciador probiótico (cápsula, kéfir de agua o Kyojin)', 'fermentos', 'farmacia', C, ['probiotico', 'probiótico', 'kéfir de agua', 'kefir', 'kyojin'], [], null, null),
    I('mostaza_dijon', 'Mostaza antigua o de Dijon', 'condimentos', 'dietetica', C, ['mostaza', 'mostaza de dijon', 'dijon', 'semillas de mostaza'], [], null, 'mostaza-dijon'),
    I('levadura_nutricional', 'Levadura nutricional virgen', 'condimentos', 'dietetica', C, ['levadura nutricional', 'levadura virgen'], [], null, 'levadura'),
    I('levadura_cerveza', 'Levadura de cerveza', 'condimentos', 'dietetica', C, ['levadura de cerveza'], ['gluten'], null, 'levadura'),
    I('levadura_panaderia', 'Levadura de panadería (seca o fresca)', 'condimentos', 'dietetica', C, ['levadura de panadería', 'levadura seca', 'levadura fresca'], [], null, 'levadura'),
    I('bicarbonato', 'Bicarbonato de sodio', 'condimentos', 'dietetica', C, ['bicarbonato', 'bicarbonato de sodio'], [], null, null),
    I('miel', 'Miel pura de abejas', 'endulzantes', 'dietetica', C, ['miel', 'miel pura', 'lámina de miel'], [], null, 'miel'),
    I('azucar_mascabo', 'Azúcar mascabo', 'endulzantes', 'dietetica', C, ['mascabo', 'azúcar mascabo'], [], null, 'azucar-mascabo'),
    I('aceitunas_negras', 'Aceitunas negras descarozadas', 'encurtidos', 'verduleria', C, ['aceitunas negras', 'aceituna negra', 'olivas negras', 'aceitunas'], [], null, 'aceitunas'),
    I('psyllium', 'Psyllium (semilla o polvo)', 'suplementos', 'dietetica', C, ['psyllium', 'psillium', 'cáscara de psyllium'], [], null, 'psyllium'),

    // ── Algas ──
    I('kombu', 'Alga kombu', 'algas', 'dietetica', C, ['kombu', 'alga kombu'], ['algas'], null, 'algas'),
    I('nori', 'Alga nori', 'algas', 'dietetica', P, ['nori', 'alga nori', 'láminas de nori'], ['algas'], null, 'algas'),
    I('agar_agar', 'Agar-agar en polvo', 'algas', 'dietetica', C, ['agar', 'agar agar', 'agar-agar'], ['algas'], null, 'algas'),
    I('wakame', 'Alga wakame', 'algas', 'dietetica', C, ['wakame'], ['algas'], null, 'algas'),

    // ── Hierbas para infusión ──
    I('ortiga', 'Ortiga seca en hojas', 'infusiones', 'herboristeria', P, ['ortiga', 'hojas de ortiga'], [], null, 'infusiones-hierbas'),
    I('diente_leon', 'Diente de león seco', 'infusiones', 'herboristeria', P, ['diente de león', 'diente de leon'], [], null, 'infusiones-hierbas'),
    I('manzanilla', 'Flores secas de manzanilla', 'infusiones', 'herboristeria', P, ['manzanilla', 'flores de manzanilla'], [], null, 'infusiones-hierbas'),
    I('calendula', 'Caléndula seca', 'infusiones', 'herboristeria', P, ['caléndula', 'calendula', 'flores de caléndula'], [], null, 'infusiones-hierbas'),
    I('lavanda', 'Flores de lavanda', 'infusiones', 'herboristeria', P, ['lavanda', 'flores de lavanda'], [], null, 'infusiones-hierbas'),
    I('carqueja', 'Carqueja', 'infusiones', 'herboristeria', P, ['carqueja'], [], null, 'infusiones-hierbas'),
    I('yuyos_mate', 'Yuyos para mate (cola de caballo, llantén, cedrón, cáscaras de cítricos)', 'infusiones', 'herboristeria', P, ['cola de caballo', 'llantén', 'llanten', 'cedrón', 'cedron', 'yuyos', 'pétalos de rosa'], [], null, 'mate-yuyos'),
    I('stevia', 'Stevia pura en hoja', 'infusiones', 'herboristeria', C, ['stevia', 'estevia', 'hojas de stevia'], [], null, 'stevia'),
    I('te_verde', 'Té verde, banchá o matcha', 'infusiones', 'herboristeria', C, ['té verde', 'te verde', 'banchá', 'bancha', 'matcha'], [], null, 'te-verde'),

    // ── Suplementos y complementos opcionales ──
    I('carbon_activado', 'Carbón activado', 'suplementos', 'farmacia', C, ['carbón activado', 'carbon activado'], [], null, 'carbon-activado'),
    I('clorofila', 'Clorofila líquida', 'suplementos', 'farmacia', C, ['clorofila'], [], null, 'clorofila'),
    I('chlorella', 'Chlorella en polvo o comprimidos', 'suplementos', 'farmacia', C, ['chlorella', 'clorela'], ['algas'], null, 'chlorella'),
    I('espirulina', 'Espirulina', 'suplementos', 'farmacia', C, ['espirulina'], ['algas'], null, 'espirulina'),
    I('wheatgrass', 'Pasto de trigo en polvo (wheatgrass)', 'suplementos', 'farmacia', C, ['wheatgrass', 'pasto de trigo'], [], null, 'wheatgrass'),
    I('agua_mar', 'Agua de mar (para tomar)', 'suplementos', 'farmacia', C, ['agua de mar', 'agua marina'], [], null, 'agua-mar'),
    I('aloe_vera', 'Aloe vera líquido', 'suplementos', 'farmacia', C, ['aloe vera', 'aloe', 'sábila'], [], null, 'aloe-vera'),
    I('aceite_ricino', 'Aceite de ricino (para cataplasmas)', 'suplementos', 'farmacia', C, ['aceite de ricino', 'ricino'], [], null, null),

    // ── Básicos ──
    I('agua', 'Agua de filtro limpia o tibia', 'basicos', 'super', B, ['agua', 'agua tibia', 'agua de filtro', 'agua filtrada', 'agua fría', 'agua caliente', 'agua pura'], [], null, 'agua', true),
    I('liquido_coccion', 'Líquido de cocción reservado', 'basicos', 'super', B, ['liquido de coccion', 'agua de coccion', 'caldo de coccion', 'caldo de cocción', 'líquido de cocción'], [], null, null)
  ];
})(typeof window !== 'undefined' ? window : globalThis);
