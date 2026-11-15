/* Detox de Primavera v2 — semáforo «¿Puedo comer…?»
   Autoridad: guía de Isabel Caparra (págs. 5-8, 24-25 y recetario). Estados: Libre / Con moderación / Evitar.
   Campos: id, name, status, category, why (texto de la guía), howTo, synonyms, phases (override por fase), note (criterio editorial). */
(function (root) {
  'use strict';
  root.DX = root.DX || {};

  var G = 'green', Y = 'yellow', R = 'red';
  var MONO = { monodieta: 'red' };   // fuera de manzana/arroz/caldos/agua durante la monodieta

  function f(id, name, status, category, why, howTo, synonyms, extra) {
    var o = { id: id, name: name, status: status, category: category, why: why, howTo: howTo || null, synonyms: synonyms || [] };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }

  root.DX.foods = [
    // ───────── Granos y cereales ─────────
    f('arroz-integral', 'Arroz integral, yamaní o basmati integral', G, 'Granos',
      'Base de la monodieta y de los almuerzos. La guía pide arroz orgánico, condimentado solo con sal, gomasio o shoyu MOA y sin aceite.',
      'Cocinar 1 taza de arroz con 2 de agua (remojo nocturno ideal). Se puede cocinar para 2-3 días y recalentar al vapor; no comerlo frío de la heladera.',
      ['arroz', 'arroz yamani', 'arroz yamaní', 'arroz integral largo fino', 'basmati', 'arroz mochi']),
    f('quinoa', 'Quinoa', G, 'Granos', 'Cereal que la guía incentiva junto con el arroz integral y el poroto mung.',
      'Lavarla varias veces hasta que el agua deje de ensuciarse. 1 taza de quinoa por 2 de agua.', ['quinua', 'quinoa tricolor'], { phases: MONO }),
    f('mijo', 'Mijo', G, 'Granos', 'Cereal para risottos y cremas; 1 taza de mijo por 3 ¼ de agua.', 'Remojo nocturno si se puede.', ['mijo pelado'], { phases: MONO }),
    f('trigo-sarraceno', 'Trigo sarraceno (y soba de sarraceno)', G, 'Granos',
      'La guía lo usa en el pan de trigo sarraceno y en los fideos soba.', 'Para cocinarlo en grano: 1 taza por 1 de agua, salteándolo antes 3 a 5 minutos.',
      ['sarraceno', 'alforfón', 'soba', 'fideos soba'], { phases: MONO }),
    f('centeno-masa-madre', 'Pan 100 % centeno de masa madre', G, 'Panificados',
      'La guía lo propone para las tostadas del desayuno, junto con el pan de quinoa y amaranto, el de sarraceno y las galletas del recetario.',
      'Solo si es centeno puro de masa madre, sin harina blanca. Se puede cortar en rodajas y freezar.',
      ['pan de centeno', 'centeno', 'masa madre', 'pan integral de centeno', 'tostadas de centeno'], { phases: MONO,
        note: 'En la v1 figuraba «Con moderación»; la guía no le pone tope, solo pide que sea centeno puro.' }),
    f('avena', 'Avena', Y, 'Granos', 'Aparece solo en los hot cakes y como harina alternativa en las galletas. Tiene gluten.',
      'Los hot cakes se hacen con 1 taza de avena remojada la noche anterior.', ['avena arrollada', 'harina de avena', 'copos de avena'], { phases: MONO,
        note: 'No figura en la lista de alimentos prioritarios de la guía; por eso queda «Con moderación».' }),
    f('fideos-integrales', 'Fideos integrales (de trigo, quinoa, sarraceno, legumbres)', Y, 'Granos',
      'La guía permite fideos integrales de trigo 1 o 2 veces durante todo el détox; los de otros granos, 1 vez por semana.',
      'Servirlos con tomates cherry o perita en cubos, brócoli blanqueado, rúcula, ajo o pesto.',
      ['fideos', 'pasta integral', 'fideos de quinoa', 'legume', 'soba'], { phases: MONO }),
    f('fideos-comunes', 'Fideos y pastas comunes', R, 'Harinas', 'La guía cancela las harinas refinadas.', null,
      ['pastas', 'fideos blancos', 'ravioles', 'ñoquis', 'tallarines', 'harina 000'], { phases: MONO }),
    f('pan-comun', 'Pan blanco, facturas y galletitas comunes', R, 'Harinas',
      'Son harinas refinadas, que la guía cancela. Para galletas, tostadas o similares, la guía pide elegir las del recetario o marcas con semillas y arroz (no «crackines» ni «molinos»).', null,
      ['pan', 'pan blanco', 'facturas', 'medialunas', 'galletitas', 'crackers', 'pan lactal', 'tostadas comunes'], { phases: MONO }),
    f('arroz-blanco', 'Arroz blanco o pulido', R, 'Granos',
      'La guía propone solo cereales integrales y cancela las harinas refinadas.', null, ['arroz común', 'arroz pulido', 'arroz blanco'], { phases: MONO,
        note: 'La guía no nombra el arroz blanco: se marca «Evitar» por analogía con los refinados. Confirmar con Isa si surge la duda.' }),

    // ───────── Legumbres y proteínas vegetales ─────────
    f('porotos-mung', 'Porotos mung', G, 'Legumbres', 'La legumbre que la guía incentiva más: aparece en bowls, guisos, sopas y en el humus.',
      'Remojo nocturno, descartar el agua, cocinar con kombu o laurel y la sal al final.', ['mung', 'poroto mung', 'brotes de soja', 'soja verde'], { phases: MONO }),
    f('porotos-aduki', 'Porotos aduki', G, 'Legumbres', 'Legumbre del recetario (pasta de remolachas y aduki).', 'Remojo nocturno, descartar el agua; sal al final.', ['aduki', 'azuki'], { phases: MONO }),
    f('porotos-negros', 'Porotos negros', G, 'Legumbres', 'Se usan en la ensalada de porotos negros. El líquido de cocción se puede usar para humedecer.', 'Remojo nocturno y sal al final.', ['frijoles', 'porotos'], { phases: MONO }),
    f('lentejas', 'Lentejas', G, 'Legumbres', 'Legumbre permitida en el plato «cereal o legumbre».', 'Remojo nocturno (salvo la lenteja turca) y sal al final.', ['lenteja', 'lentejas turcas', 'lentejas negras'], { phases: MONO }),
    f('garbanzos', 'Garbanzos', G, 'Legumbres', 'Se usan en la ensalada de garbanzos con palta y cherrys.', 'Remojo nocturno y sal al final.', ['garbanzo'], { phases: MONO }),
    f('habas-arvejas', 'Habas, arvejas y chauchas', G, 'Verduras', 'Verduras al vapor o blanqueadas que la guía usa en muchas ensaladas.', 'Al vapor o blanqueadas.', ['arvejas', 'habas', 'chauchas', 'porotos verdes', 'guisantes'], { phases: MONO }),
    f('tofu', 'Tofu', Y, 'Legumbres', 'La guía usa tofu orgánico (marca Soyana) y aclara «no usarlo diariamente».',
      'Para el queso crema: hervirlo antes. Elegir soja orgánica.', ['tofu orgánico', 'queso de soja', 'queso crema de tofu'], { phases: MONO }),
    f('hamburguesa-legumbres', 'Hamburguesas de legumbres de dietética', Y, 'Legumbres',
      'Se permiten si no tienen harinas blancas 000 ni huevo; cocidas sin aceite.', 'Chequear la etiqueta.', ['hamburguesa vegetal', 'hamburguesas de lentejas', 'medallones'], { phases: MONO }),

    // ───────── Verduras ─────────
    f('brocoli-coliflor', 'Brócoli y coliflor', G, 'Verduras', 'Crucíferas: están entre los alimentos que la guía quiere en todas las comidas.', 'Al vapor o blanqueadas (1 a 3 minutos).', ['brocoli', 'brócoli', 'brócolis', 'coliflor', 'arroz de coliflor'], { phases: MONO }),
    f('bruselas', 'Repollitos de Bruselas', G, 'Verduras', 'Crucífera de la lista de la guía.', 'Al vapor.', ['bruselas', 'repollitos'], { phases: MONO }),
    f('repollo', 'Repollo blanco, colorado y akusay', G, 'Verduras', 'Crucífera; base del chucrut, del coleslaw y del nituke de repollo colorado.', 'Macerar con sal y limón o vinagre de manzana para ablandarlo.', ['col', 'repollo morado', 'repollo colorado', 'akusay', 'col china', 'bok choy'], { phases: MONO }),
    f('kale-espinaca', 'Kale y espinaca', G, 'Verduras', 'Verdes de la lista de la guía.', 'Al vapor, blanqueados o crudos según la constitución.', ['espinacas', 'espinaca', 'kale', 'acelga', 'hojas verdes'], { phases: MONO }),
    f('rucula-hojas', 'Rúcula, lechuga, berro y hojas verdes', G, 'Verduras', 'Hojas frescas para ensaladas. Si sos muy friolento/a, mejor al mediodía y con clima templado.', null, ['rucula', 'rúcula', 'lechuga', 'berro', 'achicoria', 'radicheta', 'mix de verdes'], { phases: MONO }),
    f('apio', 'Apio', G, 'Verduras', 'Base del caldo détox, de las sopas y de los jugos.', null, ['apio', 'pencas de apio', 'varas de apio'], { phases: MONO }),
    f('puerro', 'Puerro', G, 'Verduras', 'Base del caldo détox y de las sopas.', null, ['puerros'], { phases: MONO }),
    f('remolacha', 'Remolacha', G, 'Verduras', 'Alimento de la lista de la guía; va al vapor, en sopa, en ensaladas y en pickles.', null, ['remolachas', 'betarraga'], { phases: MONO }),
    f('zanahoria', 'Zanahoria', G, 'Verduras', 'Verdura naranja de la lista de la guía.', null, ['zanahorias'], { phases: MONO }),
    f('zapallo', 'Zapallo, calabaza y zucchini', G, 'Verduras', 'Verduras de la lista de la guía; el zapallo da cremosidad a la mayonesa de zanahoria.', null, ['calabaza', 'zapallo anco', 'cabutiá', 'zucchini', 'zapallito', 'calabacín'], { phases: MONO }),
    f('berenjena', 'Berenjena', G, 'Verduras', 'Se usa en el babaganoush (asada directo sobre la llama) y a la plancha sin aceite.', null, ['berenjenas'], { phases: MONO }),
    f('esparragos-alcauciles', 'Espárragos y alcauciles', G, 'Verduras', 'Están entre los alimentos que más trabajan el hígado, según la guía.', 'Espárragos blanqueados; alcauciles con aliño de limón, sal y oliva.', ['espárragos', 'esparragos', 'alcauciles', 'alcaucil', 'alcachofa'], { phases: MONO }),
    f('rabanitos-nabo', 'Rabanitos y nabo', G, 'Verduras', 'Crudos o en pickle; la guía los usa como topping «que mueve el hígado».', '4 a 8 rabanitos o 1 cda de nabo rallado por plato.', ['rabanitos', 'rabanito', 'nabo', 'pickle de rabanitos'], { phases: MONO }),
    f('cebolla', 'Cebolla, verdeo y cebollín', G, 'Verduras', 'Aromática de la lista de la guía.', 'Cruda en criolla o como topping (1 cda).', ['cebolla morada', 'cebolla de verdeo', 'verdeo', 'cebollín', 'cebolla colorada', 'nirá'], { phases: MONO }),
    f('ajo', 'Ajo', G, 'Verduras', 'Aromática de la lista de la guía. Si tenés gastritis o acidez cotidiana, la guía indica no usar ajo crudo en cada comida.', '1 diente picado crudo como topping.', ['dientes de ajo', 'ajo en polvo'], { phases: MONO }),
    f('hongos', 'Hongos y champiñones', G, 'Verduras', 'Se usan portobello, champiñones y hongos de pino; a la plancha sin aceite o en risotto.', null, ['champiñones', 'champis', 'portobello', 'hongos de pino', 'hongos'], { phases: MONO }),
    f('pepino', 'Pepino', G, 'Verduras', 'Se usa en ensaladas, sopas frías y gazpacho; la cáscara aporta clorofila según la guía.', null, ['pepinos'], { phases: MONO }),
    f('tomate', 'Tomate y tomates cherry', G, 'Verduras', 'Aparece en gazpacho, tabule, pan y tomaquet y fideos.', null, ['tomates', 'cherry', 'tomate cherry', 'tomate perita', 'cherrys'], { phases: MONO }),
    f('morron', 'Morrón', G, 'Verduras', 'Se usa picado en ensaladas, tabule y kimchi.', null, ['pimiento', 'morrón', 'morron'], { phases: MONO }),
    f('hinojo', 'Hinojo', G, 'Verduras', 'Se usa en untable, jugos, pickles y bastones.', null, ['hinojos'], { phases: MONO }),
    f('choclo', 'Choclo', G, 'Verduras', 'Aparece en ensaladas con remolacha y brócoli.', null, ['maíz', 'maiz'], { phases: MONO }),
    f('brotes', 'Brotes (alfalfa, soja, rabanitos, fenogreco)', G, 'Verduras', 'La guía los propone como topping fresco o en temakis.', null, ['brotes de alfalfa', 'brotes de soja', 'brotes de mung', 'germinados'], { phases: MONO }),
    f('papa', 'Papa', Y, 'Verduras', 'La guía permite las versiones con papa (burgers y papa al horno) no más de 1 vez por semana.', 'Al horno con piel o al vapor.', ['papas', 'patata'], { phases: MONO }),
    f('batata', 'Batata', Y, 'Verduras', 'La guía la permite 1 vez por semana como máximo.', 'Al horno entera con cáscara.', ['batatas', 'camote', 'boniato'], { phases: MONO }),
    f('palta', 'Palta', Y, 'Verduras', 'La guía permite entre ¼ y ½ palta por comida, por ejemplo con el arroz.', 'Pisada con sal, limón y chucrut, o en rodajas.', ['aguacate', 'paltas'],
      { note: 'En la monodieta la guía la admite junto al arroz «si no lo soportás sin aceite».' }),
    f('aceitunas', 'Aceitunas negras y pasas de uva', Y, 'Verduras', 'Se usan en pequeña cantidad en la mayonesa de zanahorias.', null, ['aceitunas', 'olivas', 'pasas', 'pasas de uva'], { phases: MONO }),

    // ───────── Frutas ─────────
    f('manzana', 'Manzana', G, 'Frutas', 'Fruta central de la monodieta: entera, en nituke, en compota o en jugo.', 'Nituke: 40 minutos a fuego mínimo con 2 cdas de agua y una pizca de sal; cuanto más tiempo, más dulce.', ['manzanas', 'manzana verde', 'manzana roja', 'compota', 'jugo de manzana']),
    f('frutos-rojos', 'Frutillas, arándanos y frambuesas', G, 'Frutas', 'Frutas de la lista de la guía (frutillas agroecológicas).', 'En ensalada o compota sin azúcar.', ['frutillas', 'arándanos', 'frambuesas', 'frutos rojos', 'berries'], { phases: MONO }),
    f('citricos', 'Pomelo, naranja y mandarina', G, 'Frutas', 'Frutas de la ensalada fresca y de los licuados de la guía; también se usa la cáscara rallada (lavada).', null, ['pomelo', 'naranja', 'mandarina', 'cáscara de cítricos', 'ralladura'], { phases: MONO }),
    f('limon', 'Limón y lima', G, 'Frutas', 'Se toma en ayunas con agua tibia (½ limón al inicio, 1 limón después) y se usa en aliños.', 'Mejor con agua para cuidar el esmalte dental.', ['limones', 'lima', 'jugo de limón', 'agua con limón']),
    f('anana-kiwi-pera', 'Ananá, kiwi y pera', G, 'Frutas', 'Frutas de la lista de la guía (ananá con menta, kiwi en licuados, peras en ensalada).', null, ['ananá', 'ananas', 'kiwi', 'peras', 'pera'], { phases: MONO }),
    f('banana', 'Banana', Y, 'Frutas', 'La guía la menciona solo en los hot cakes de avena.', null, ['bananas', 'banana madura'], { phases: MONO,
      note: 'No figura en la lista de alimentos prioritarios; queda «Con moderación» por no estar respaldada en otro lugar de la guía.' }),
    f('coco', 'Coco rallado', Y, 'Frutas', 'Aparece solo en los hot cakes (3 cdas) como cobertura.', null, ['coco', 'escamas de coco'], { phases: MONO }),
    f('otras-frutas', 'Otras frutas no mencionadas (uvas, duraznos, banana en exceso…)', Y, 'Frutas',
      'La guía enumera frutillas, arándanos, frambuesas, manzana, kiwi, peras, pomelo, mandarina, naranja y ananá; las demás no figuran en el menú.', null, ['uvas', 'durazno', 'sandía', 'melón', 'cerezas', 'ciruelas'], { phases: MONO,
        note: 'Criterio editorial: ante la duda, consultar a Isa en el grupo.' }),

    // ───────── Grasas, semillas y frutos secos ─────────
    f('aceite-oliva', 'Aceite de oliva extra virgen', Y, 'Grasas',
      'Se prioriza en crudo y de primera presión en frío. Para saltear, la guía permite 1 cdita sobre un fondo de agua; nunca freír.',
      'En crudo sobre el plato, o 1 cdita en salteado «en aceite y agua».', ['aceite de oliva', 'oliva', 'aceite oliva', 'virgen extra'], { phases: MONO,
        note: 'Decisión unificada: se mostraba verde y rojo en la v1. La guía dice «evitar cocinar con aceites» pero admite 1 cdita en el salteado con agua (pág. 28).' }),
    f('aceite-lino', 'Aceite de lino y semillas de lino', G, 'Grasas',
      '1 cda de aceite de lino por comida es la dosis terapéutica; si no usás aceite, 2 cdas de semillas molidas sobre las comidas. Con flojera intestinal o diarrea, evitar el lino.',
      'Aceite de primera presión en frío, crudo y guardado en heladera. Las semillas se muelen en el momento.', ['linaza', 'lino', 'semillas de lino', 'aceite de linaza'], { phases: MONO }),
    f('semillas', 'Semillas de chía, zapallo, girasol y sésamo', G, 'Semillas', 'Se usan en rawmesan, gomasio, panes, galletas y puddings. La chía está contraindicada en diarrea aguda.', 'Tostadas, activadas o molidas.', ['chía', 'chia', 'semillas de zapallo', 'semillas de calabaza', 'girasol', 'sésamo', 'sesamo', 'gomasio', 'rawmesan', 'amapola'], { phases: MONO }),
    f('frutos-secos', 'Almendras, cajú y nueces', Y, 'Frutos secos',
      'En este détox la guía solo usa almendras y castañas de cajú para las leches; con los jugos se acompañan 6 almendras o nueces.', 'Remojadas (8 a 12 hs) cuando se hacen leches o quesos.', ['almendras', 'castañas de cajú', 'cajú', 'nueces', 'pistachos', 'castañas', 'frutos secos'], { phases: MONO }),
    f('aceites-comunes', 'Aceites comunes de supermercado y margarinas', R, 'Grasas', 'La guía los elimina porque afectan el funcionamiento hepático.', null, ['margarina', 'aceite de girasol', 'aceite de maíz', 'aceite mezcla', 'aceite refinado', 'manteca'], { phases: MONO }),
    f('cocinar-con-aceite', 'Cocinar con aceite (frituras, horno aceitado)', R, 'Cocción', 'Durante el détox se evita cocinar con aceites. La excepción de la guía es 1 cdita en el salteado con agua.', 'Cocinar al vapor, en nituke o saltear en agua.', ['frituras', 'fritos', 'freír', 'salteado en aceite', 'milanesas'], { phases: MONO }),

    // ───────── Fermentos y condimentos ─────────
    f('chucrut-kimchi', 'Chucrut y kimchi', G, 'Fermentos', 'Fermentos de la lista de la guía; se agregan a la palta, a las tostadas y a los platos.', 'Crudos, sin pasteurizar.', ['chucrut', 'sauerkraut', 'kimchi', 'pickles', 'encurtidos', 'pickle de rabanitos'], { phases: MONO }),
    f('miso', 'Miso', G, 'Fermentos', 'Fermento probiótico; se disuelve 1 cdita en una taza de agua caliente (caldo de miso).', 'Sin hervirlo.', ['caldo de miso', 'pasta de miso']),
    f('shoyu-moa', 'Salsa de soja Shoyu MOA', G, 'Condimentos', 'La guía recomienda esta marca: orgánica, de fermento natural y sin azúcar.', null, ['shoyu', 'tamari', 'salsa de soja'], { phases: MONO }),
    f('salsa-soja-comun', 'Salsa de soja común', Y, 'Condimentos', 'La guía nombra solo el Shoyu MOA; las salsas comunes llevan azúcar y aditivos.', null, ['soja industrial', 'salsa de soja'], { phases: MONO,
      note: 'Criterio editorial: preferir Shoyu MOA, que es la marca que cita la guía.' }),
    f('vinagre-manzana', 'Vinagre de sidra de manzana', G, 'Condimentos', 'Se usa sin pasteurizar en aliños y pickles. En dosis terapéuticas la guía lo desaconseja si hay heces flojas.', '1 cdita en ⅓ de taza de agua, a sorbitos.', ['vinagre', 'vinagre de sidra', 'vinagre vivo'], { phases: MONO }),
    f('sal-marina', 'Sal marina o del Himalaya', G, 'Condimentos', 'La guía permite sal marina, marina yodada, del Himalaya o natural de salar.', null, ['sal', 'sal rosa', 'sal natural'], {}),
    f('mostaza-dijon', 'Mostaza antigua o de Dijon', G, 'Condimentos', 'Permitida entre los condimentos de la guía.', null, ['mostaza', 'dijon'], { phases: MONO }),
    f('hierbas-especias', 'Hierbas frescas y especias', G, 'Condimentos', 'Cilantro, albahaca, perejil, eneldo, pimienta negra, cúrcuma, comino y otras especias a gusto.', 'La cúrcuma se absorbe mejor con una pizca de pimienta.', ['cilantro', 'perejil', 'albahaca', 'eneldo', 'menta', 'tomillo', 'orégano', 'pimienta', 'cúrcuma', 'comino', 'canela', 'curry', 'pimentón', 'clavo de olor'], { phases: MONO }),
    f('jengibre', 'Jengibre fresco', G, 'Condimentos', 'Se usa en el agua con limón (si sos friolento/a), en jugos, aliños y caldos. Contraindicado en úlcera gastroduodenal.', 'Jugo exprimido con los dedos de la ralladura.', ['jugo de jengibre', 'jengibre rallado', 'raíz de jengibre'], {}),
    f('algas', 'Algas (nori, kombu, agar, wakame)', G, 'Condimentos', 'Se usan en temakis, para cocinar legumbres (kombu) y como espesante (agar).', null, ['nori', 'kombu', 'agar agar', 'wakame'], { phases: MONO }),
    f('levadura', 'Levadura de cerveza o nutricional', Y, 'Condimentos', 'Se usa en rawmesan, quesos y dips. La levadura de cerveza contiene gluten.', null, ['levadura nutricional', 'levadura de cerveza'], { phases: MONO,
      note: 'La guía escribe «levadura de cerveza»; en el mercado se vende como «nutricional». Si evitás gluten, chequear la etiqueta.' }),
    f('miel', 'Miel', Y, 'Dulces', 'La guía la usa en cantidades mínimas: una lámina sobre la tostada, 1 cdita en el aliño de miel y mostaza, 2 cdas en el pan de sarraceno. No es un endulzante.', 'Nunca para endulzar infusiones.', ['miel pura', 'lámina de miel'], { phases: MONO,
      note: 'La v1 no la incluía en el semáforo. Es una excepción puntual dentro de «cancelamos dulces, azúcares y derivados».' }),
    f('azucar-mascabo', 'Azúcar mascabo', Y, 'Dulces', 'Solo la cdita del borsch según la guía (o miel).', null, ['mascabo', 'azúcar integral'], { phases: MONO }),
    f('azucar', 'Azúcar, dulces y edulcorantes', R, 'Dulces', 'La guía cancela dulces, azúcares y derivados. Las infusiones no se endulzan.', null, ['azúcar blanca', 'edulcorante', 'sacarina', 'stevia líquida', 'mermeladas', 'dulce de leche', 'golosinas', 'chocolate', 'helado', 'postres'], { phases: MONO }),
    f('stevia', 'Stevia pura en hoja', Y, 'Dulces', 'Solo en el mate de yuyos, en pequeñas dosis de hojas.', null, ['estevia', 'hojas de stevia'], { phases: MONO }),

    // ───────── Bebidas ─────────
    f('agua', 'Agua natural o tibia', G, 'Bebidas', 'Mantenerse bien hidratado/a ayuda a mitigar los síntomas de la desintoxicación. El agua tibia tonifica el sistema digestivo.', 'Calentar agua de filtro a la mañana y llevarla en termo.', ['agua tibia', 'agua de filtro', 'termo']),
    f('agua-ionizada', 'Agua ionizada', G, 'Bebidas', 'Agua de filtro hervida 15 a 20 minutos y tomada caliente, de a sorbitos, durante el día.', null, ['agua hervida', 'agua caliente']),
    f('infusiones-hierbas', 'Infusiones de hierbas sin endulzar', G, 'Bebidas', 'La guía propone 2 a 4 tazas por día, sin endulzar. Leer antes las contraindicaciones de cada hierba.', 'Ver el herbario.', ['manzanilla', 'ortiga', 'diente de león', 'menta', 'infusión', 'té de hierbas', 'carqueja', 'caléndula', 'lavanda', 'hinojo']),
    f('mate-yuyos', 'Mate 100 % de yuyos (sin yerba mate)', G, 'Bebidas', 'Si necesitás bombillear: menta, cola de caballo, lavanda, ortiga, manzanilla, llantén, diente de león, pétalos de rosa, cáscaras de cítricos, cedrón.', null, ['mate de hierbas', 'mate de yuyos', 'yuyos']),
    f('caldos', 'Caldo détox y caldo de miso', G, 'Bebidas', 'Para tomar cuando haga falta, también en la monodieta. Del caldo détox se toma solo el caldo.', null, ['caldo', 'caldo de verduras', 'sopa']),
    f('jugos-caseros', 'Jugos y licuados caseros de la guía', Y, 'Bebidas', 'La guía los ofrece como desayuno y aclara que no son para quienes tienen síntomas de frío; si se rompe el ayuno con jugo, acompañar con 6 almendras o nueces.', 'No variar las combinaciones de frutas.', ['licuado', 'jugo', 'jugo verde', 'jugo de manzana'], { phases: { monodieta: 'yellow' } }),
    f('te-verde', 'Té verde, banchá o matcha', Y, 'Bebidas', 'Opcional durante los primeros días, si lo necesitás para que sea más llevadera la falta de cafeína.', null, ['té verde', 'te verde', 'banchá', 'bancha', 'matcha'], { phases: { monodieta: 'yellow' } }),
    f('cafe', 'Café de cualquier tipo', R, 'Estimulantes', 'La guía cancela el café durante el détox.', 'Bajar la dosis a la mitad cada 2 días en la preparación previa.', ['café', 'cafe', 'cafeína', 'espresso', 'descafeinado'], { phases: { monodieta: 'red' } }),
    f('mate-tradicional', 'Yerba mate tradicional', R, 'Estimulantes', 'La guía cancela el mate. Alternativa: mate de yuyos.', null, ['mate', 'yerba mate', 'yerba', 'mateína', 'tereré'], { phases: { monodieta: 'red' } }),
    f('te-negro', 'Té negro', R, 'Estimulantes', 'La guía cancela el té negro.', null, ['té', 'te negro', 'té común', 'té con leche', 'mate cocido'], { phases: { monodieta: 'red' } }),
    f('alcohol', 'Alcohol (vino, cerveza, licores)', R, 'Bebidas', 'Afecta el correcto funcionamiento hepático: la guía lo elimina durante el détox.', null, ['vino', 'cerveza', 'fernet', 'whisky', 'trago', 'licor', 'champagne'], { phases: MONO }),
    f('gaseosas', 'Gaseosas y jugos comprados', R, 'Bebidas', 'La guía elimina las gaseosas y cancela los jugos comprados.', null, ['gaseosa', 'jugos envasados', 'jugo en caja', 'agua saborizada', 'cola', 'energizantes'], { phases: MONO }),

    // ───────── Animales y lácteos ─────────
    f('lacteos', 'Lácteos y derivados', R, 'Lácteos', 'La guía cancela los lácteos y sus derivados (leche, queso, yogur, manteca). Las leches vegetales de almendras o cajú los reemplazan.', null, ['leche', 'queso', 'yogur', 'manteca', 'crema', 'ricota', 'dulce de leche', 'queso crema'], { phases: MONO }),
    f('carnes-rojas', 'Carnes rojas y embutidos', R, 'Proteínas animales', 'La guía cancela las carnes rojas. Si hace falta proteína animal, ver pescado, huevos o caldo de huesos.', null, ['carne', 'vaca', 'cerdo', 'asado', 'hamburguesa', 'salchichas', 'fiambre', 'jamón', 'embutidos', 'chorizo', 'milanesa'], { phases: MONO }),
    f('pescado', 'Pescado', Y, 'Proteínas animales', 'Si te sentís muy débil o no querés pasar 21 días sin proteína animal, la guía permite pescado a la parrilla, plancha, vapor o en sopa, preferentemente al mediodía.', null, ['merluza', 'salmón', 'trucha', 'abadejo', 'pescado blanco', 'pescado azul'], { phases: MONO }),
    f('huevos', 'Huevos', Y, 'Proteínas animales', 'En caso de debilidad la guía permite «algunos huevos», preferentemente al mediodía.', null, ['huevo', 'huevos pastoriles', 'tortilla', 'omelette'], { phases: MONO }),
    f('caldo-huesos', 'Caldo de huesos (vaca pastoril, pollo o espinazo de pescado)', Y, 'Proteínas animales', 'Alternativa de la guía ante debilidad, preferentemente al mediodía.', null, ['caldo de hueso', 'caldo de pollo', 'caldo de carne'], { phases: MONO }),
    f('ultraprocesados', 'Ultraprocesados', R, 'Industriales', 'La guía los elimina durante el détox.', null, ['snacks', 'papas fritas', 'galletitas rellenas', 'comida rápida', 'sopas instantáneas', 'cereales de caja', 'barras de cereal', 'aderezos industriales'], { phases: MONO }),

    // ───────── Suplementos y complementos (opcionales) ─────────
    f('agua-mar', 'Agua de mar', Y, 'Suplementos', 'Opcional y solo desde el día 7: ¼ de vaso de agua de mar y ¾ de agua dulce, en ayunas, en lugar del limón. Empezar con 2 cdas durante 5 días e ir subiendo de a cucharadas. Pura está contraindicada en diarrea.', null, ['agua marina', 'agua de mar isotónica'], { phases: { monodieta: 'red' }, unlockDay: 7 }),
    f('clorofila', 'Clorofila líquida', Y, 'Suplementos', 'Opcional, para ambas constituciones: 1 tapita por día. Sin contraindicaciones según la guía; usar solo durante el détox.', null, ['clorofila'], { phases: MONO }),
    f('chlorella', 'Chlorella', Y, 'Suplementos', 'Opcional: 1 cdita de té al día (empezar con ¼). No usar si hay hipertiroidismo. Es algo más cálida que la espirulina.', null, ['chlorella', 'clorela'], { phases: MONO }),
    f('espirulina', 'Espirulina', Y, 'Suplementos', 'Opcional, para personas calurosas: 1 cdita de té al día (empezar con ¼). No usar si hay hipertiroidismo, síntomas de frío o estómago frío.', null, ['espirulina'], { phases: MONO }),
    f('wheatgrass', 'Pasto de trigo en polvo (wheatgrass)', Y, 'Suplementos', 'Opcional, para personas calurosas: 1 cdita disuelta en agua. Evitar si sos muy friolento/a o tenés manos y pies fríos.', null, ['wheatgrass', 'pasto de trigo', 'polvo de trigo'], { phases: MONO }),
    f('carbon-activado', 'Carbón activado', Y, 'Suplementos', 'La guía lo menciona ante flojera intestinal: 1 pastilla antes de dormir, separada una hora de remedios, suplementos o hierbas.', null, ['carbón', 'carbon activado'], { phases: MONO }),
    f('psyllium', 'Psyllium', Y, 'Suplementos', 'La guía lo usa en dos sentidos: 1 cdita en un vaso grande de agua en ayunas (constipación) o 1 cdita en ½ vaso al levantarte (flojera intestinal).', null, ['psillium', 'plantago'], { phases: MONO }),
    f('aloe-vera', 'Aloe vera líquido', Y, 'Suplementos', 'Último escalón de la escalera de constipación: 1 cda a la mañana o antes de las comidas. No muy recomendable para friolentos; no más de 3 semanas sin supervisión médica.', null, ['aloe', 'sábila'], { phases: MONO })
  ];
})(typeof window !== 'undefined' ? window : globalThis);
