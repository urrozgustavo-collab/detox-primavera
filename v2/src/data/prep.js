/* Detox de Primavera v2 — preparación anticipada: remojos, bases de batch cooking y fermentos con hitos.
   Reemplaza fridge-engine.js de v1 (arregla Batch y Remojos: los campos coinciden con lo que lee la app).
   Fuente: guía págs. 29-39. Los rangos de horas marcados «v1» vienen de los textos de receta de la v1; la guía solo dice «la noche anterior».
   Los días de freezer y los minutos ahorrados (savesMin) son estimaciones editoriales de la v1, no de la guía. */
(function (root) {
  'use strict';
  root.DX = root.DX || {};

  // K(id, ingrediente, nombre, minH, optH, maxH, etiqueta, medio, descartarAgua, por qué, para qué, alertas)
  function K(id, ingredient, name, minH, optH, maxH, label, medium, discardWater, why, purpose, alerts) {
    return { id: id, ingredient: ingredient, name: name, minH: minH, optH: optH, maxH: maxH, label: label, medium: medium,
      discardWater: discardWater, why: why, purpose: purpose, alerts: alerts || null };
  }

  root.DX.prep = {
    soaking: [
      K('remojo-almendras', 'almendras', 'Almendras crudas', 8, 12, 24, '8 a 12 horas (noche previa)', 'Agua de filtro', true,
        'La guía indica sacar el agua del remojo y desecharla (o usarla para regar las plantas).',
        'Para licuar la leche de almendras y para el nituke de manzana con almendras picadas.',
        'Rangos de horas de la v1: la guía solo dice «dejar en remojo». Si pasan más de 24 horas, guardarlas en la heladera.'),
      K('remojo-caju', 'castanas_caju', 'Castañas de cajú crudas', 6, 8, 12, '6 a 8 horas (noche previa)', 'Agua limpia', true,
        'La guía indica desechar el líquido de remojo.',
        'Para untables, quesos y leches. La leche de cajú es la única que puede prescindir del remojo y del filtro.',
        'Rangos de horas de la v1: la guía solo dice «remojadas previamente» o «durante la noche».'),
      K('remojo-mung', 'porotos_mung', 'Porotos mung', 8, 12, 24, '8 a 12 horas (noche previa)', 'Abundante agua', true,
        'La guía pide desechar siempre el agua del remojo de las legumbres.',
        'Hacerlas más digeribles. Después se cocinan sin sal, con kombu o laurel, y la sal va al final.',
        'Para el humus, no tirar el líquido de la cocción.'),
      K('remojo-aduki', 'porotos_aduki', 'Porotos aduki', 8, 12, 24, '8 a 12 horas (noche previa)', 'Abundante agua', true,
        'La guía pide desechar siempre el agua del remojo de las legumbres.',
        'Hacerlas más digeribles. Reservar el líquido de cocción para la pasta de remolacha y aduki.', null),
      K('remojo-legumbres', 'porotos_negros', 'Porotos negros, lentejas y garbanzos', 8, 12, 24, '8 a 12 horas (noche previa)', 'Abundante agua', true,
        'La guía pide dejarlas en reposo durante la noche siempre, salvo la lenteja turca, y desechar el agua.',
        'Hacerlas más digeribles. Si aun así cuesta digerirlas, germinarlas: pasada la noche del remojo, sacar el agua y dejarlas toda la mañana antes de cocinarlas.',
        'La lenteja turca no necesita remojo.'),
      K('remojo-arroz', 'arroz_yamani', 'Arroz yamaní y otros granos', 8, 12, null, 'Noche previa', 'Agua de filtro', true,
        'Si podés ponerlos en remojo la noche anterior, es lo ideal para sacar el ácido fítico (guía, pág. 29).',
        'Cocción más pareja del cereal.', 'Enjuagar antes de cocinar.'),
      K('remojo-quinoa', 'quinoa', 'Quinoa', null, null, null, 'Varios lavados', 'Agua fría', true,
        'La quinoa requiere muchos lavados, hasta que el agua deje de ensuciarse (guía, pág. 29). En el pan de quinoa se remoja una noche.',
        'Cocción de la quinoa y base del pan de quinoa y amaranto.', null),
      K('remojo-mijo', 'mijo', 'Mijo', 8, 12, null, 'Noche previa (si se puede)', 'Agua de filtro', true,
        'Como los demás granos, la guía sugiere el remojo nocturno cuando se puede.', 'Para risottos y cremas.', null),
      K('remojo-sarraceno', 'trigo_sarraceno', 'Trigo sarraceno en grano (para el pan)', 6, 8, 12, 'Mínimo 6 horas, mejor toda la noche', 'Agua que sobre un dedo por encima (se hincha)', true,
        'Pasadas las 6 horas (o más), la receta pide enjuagarlo muy bien y escurrirlo.', 'Base del pan de trigo sarraceno.', null),
      K('remojo-avena', 'avena', 'Avena (hot cakes)', 8, 12, null, 'Noche previa', '1 taza de avena en 1 ½ tazas de agua', false,
        'En esta receta el agua del remojo no se descarta: se licua junto con la avena.', 'Hot cakes de avena y coco.', 'Solo para quienes tengan sartén antiadherente (se cocinan sin aceite). La avena contiene gluten.'),
      K('remojo-lino', 'semillas_lino', 'Semillas de lino (agua de lino)', 8, 8, 12, 'Toda la noche', '1 cda de semillas en 1 taza de agua caliente', false,
        'El agua de lino es justamente lo que se toma: no se descarta.', 'Escalón 5 de la escalera de constipación.', 'Con flojera intestinal o diarrea, evitar el lino.'),
      K('remojo-chia', 'semillas_chia', 'Semillas de chía', 0.5, 0.5, 8, '30 minutos (para panes) o toda la noche (pudding)', 'Agua o leche vegetal', false,
        'Se consumen con su gel (mucílago): no se descarta el líquido.', 'Pudding de chía y pan de quinoa y amaranto.', 'La chía está contraindicada en diarrea aguda.')
    ],

    /* Bases de batch cooking: preparaciones grandes que se reutilizan en varias recetas durante la semana. */
    batch: [
      { id: 'base-arroz-yamani', name: 'Arroz yamaní cocido', icon: 'bowl',
        desc: 'El cereal madre del détox: se cocina para 2 o 3 días y se recalienta al vapor.',
        method: 'Cocción de granos (1 taza de arroz : 2 tazas de agua), sin revolver y con reposo de 5 a 10 minutos.',
        yield: '4 a 6 porciones', fridgeDays: 5, freezer: true, freezerDays: 60,
        steps: ['Dejar el arroz en remojo la noche anterior, si se puede.', 'Enjuagar y llevar a hervor sin tapa con una pizca de sal; bajar al mínimo, tapar y no revolver hasta que se evapore el agua.',
          'Dejar reposar de 5 a 10 minutos.', 'Guardar en recipientes herméticos. Recalentar al vapor en una cacerolita; no comerlo frío de la heladera.'],
        recipes: ['arroz-integral-tibio', 'bowl-yamani-cruciferas', 'galletas-yamani', 'bowl-arroz-rawmesan', 'temakis-nori'], savesMin: 80,
        note: 'Los cereales duran aproximadamente 5 días en la heladera (guía, pág. 6). El freezer es una estimación de la v1.' },
      { id: 'base-porotos-mung', name: 'Porotos mung cocidos', icon: 'bowl',
        desc: 'La legumbre que la guía más incentiva, lista para bowls, humus, guisos y sopas.',
        method: 'Cocción digestiva de legumbres: remojo nocturno, descarte del agua, kombu o laurel y sal al final.',
        yield: '4 porciones', fridgeDays: 4, freezer: true, freezerDays: 90,
        steps: ['Dejar en remojo la noche anterior y desechar el agua.', 'Cocinar con agua fresca (unos 4 cm por encima) y un trozo de kombu o laurel; sin sal.', 'Espumar los primeros 10 minutos y seguir tapado hasta que estén tiernos.',
          'Agregar la sal recién al final. Reservar el líquido de cocción: se usa en el humus.'],
        recipes: ['hummus-mung', 'bowl-yamani-cruciferas', 'guiso-mung-calabaza', 'sopa-crema-porotos-mung'], savesMin: 60,
        note: 'Los días de heladera y freezer son estimaciones de la v1.' },
      { id: 'base-caldo-detox', name: 'Caldo détox', icon: 'olla',
        desc: 'Para tomar solo el caldo, también durante la monodieta, y como base de sopas y dips.',
        method: 'Verduras desde agua fría, hervor suave tapado, colar.',
        yield: 'Varios litros de caldo', fridgeDays: 5, freezer: true, freezerDays: 60,
        steps: ['Picar apio, ajo, puerro, repollo blanco, zanahoria y perejil; sumar una manzana con tronco y semillas.', 'Cubrir 5 cm más con agua y hervir hasta que larguen sabor.', 'Colar y tomar solo el caldo.', 'Guardar en frascos de vidrio.'],
        recipes: ['caldo-detox', 'mayonesa-zanahoria', 'hummus-mung', 'sopa-apio-eneldo-curry'], savesMin: 70,
        note: 'Los días de conservación son estimaciones de la v1.' },
      { id: 'base-verduras-vapor-nituke', name: 'Verduras al vapor y nituke', icon: 'hoja',
        desc: 'Crucíferas al vapor y un nituke de verduras o de manzana, listos para armar platos.',
        method: 'Vapor para crucíferas; nituke (2 cdas de agua, tapado, fuego pelusa) para raíces y manzana.',
        yield: 'Guarniciones para 4 comidas', fridgeDays: 4, freezer: false, freezerDays: 0,
        steps: ['Cocinar brócoli y coliflor al vapor por tandas, hasta que cambien de color pero sigan firmes.', 'Hacer en paralelo un nituke de zanahoria y zapallo, o de manzana, con 2 cdas de agua y una pizca de sal.', 'Guardar en recipientes de vidrio.'],
        recipes: ['bowl-yamani-cruciferas', 'mayonesa-zanahoria', 'nituke-manzana', 'trio-verduras-vapor-semillas'], savesMin: 50,
        note: 'Los días de conservación son estimaciones de la v1.' },
      { id: 'base-frutos-secos-activados', name: 'Leche de almendras y untable de cajú', icon: 'frasco',
        desc: 'Las únicas leches y untables de frutos secos que usa este détox.',
        method: 'Remojo, licuado y filtrado en tela (la de cajú no necesita filtro si la licuadora es potente).',
        yield: '1 litro de leche + 1 pote de untable', fridgeDays: 5, freezer: false, freezerDays: 0,
        steps: ['Dejar en remojo, por separado, 100 g de almendras y 1 taza de castañas de cajú.', 'Al día siguiente, desechar las aguas de remojo.',
          'Licuar las almendras con 1 litro de agua durante 2 minutos y filtrar con tela para leches vegetales. Guardar en la heladera tapada (4 o 5 días).', 'Licuar las castañas con una pizca de sal y un chorro de agua para el untable; guardar en frasco hermético.'],
        recipes: ['leche-almendras', 'leche-caju', 'untable-caju-basico', 'queso-caju', 'pudding-chia-compota'], savesMin: 45,
        note: 'La leche vegetal dura 4 o 5 días en la heladera (guía, pág. 30).' },
      { id: 'base-fermentos-activos', name: 'Fermentos: chucrut, kimchi y masa madre', icon: 'frasco',
        desc: 'Probióticos de la guía para sumar a platos y tostadas. Conviene arrancarlos con anticipación.',
        method: 'Fermentación láctica a temperatura ambiente, todo sumergido en su salmuera.',
        yield: '1 frasco de chucrut o kimchi + masa madre', fridgeDays: 30, freezer: false, freezerDays: 0,
        steps: ['Chucrut: pesar el repollo y la sal (20 a 25 g por kilo), amasar, apisonar en el frasco, tapar con hojas y una pesa, rotular y dejar 21 a 28 días en la oscuridad.',
          'Kimchi: salar el akusay 1 hora, mezclar con el resto, apretar en el frasco y dejar 3 días a temperatura ambiente; luego a la heladera (dura 1 mes).', 'Masa madre: partes iguales de harina y agua, sumar 1 cda de harina por día durante 3 días (una semana en invierno).'],
        recipes: ['chucrut-casero', 'kimchi-artesanal', 'pan-centeno-masamadre', 'untable-caju-fermentado'], savesMin: 60,
        note: 'El kimchi dura 1 mes en la heladera (guía, pág. 34). Verificar con Isa la cantidad de manzana del kimchi.' }
    ],

    /* Fermentos con hitos para recordatorios. day = día desde que se arma (0 = el día de armado). */
    ferments: [
      { id: 'ferm-chucrut', recipe: 'chucrut-casero', readyDaysMin: 21, readyDaysMax: 28,
        milestones: [
          { day: 0, text: 'Armar el frasco: repollo con 2 a 2,5 % de sal, apisonado, todo bajo las hojas y la pesa. Rotular con la fecha y guardar en un lugar oscuro.' },
          { day: 1, text: 'Primeras 24 a 48 horas: revisar que los lados y la tapa estén limpios y que todo siga sumergido en la salmuera. Si hace falta, presionar la pesa con las manos limpias para liberar gases.' },
          { day: 2, text: 'Después de 48 horas deberían verse muchas burbujas.' },
          { day: 10, text: 'Hacia los 10 días las burbujas disminuyen: el fermento pasa a la tercera etapa, se vuelve turbio, cambia de color y desarrolla un olor agrio agradable.' },
          { day: 21, text: 'Desde acá (21 a 28 días) puede estar listo: retirar la pesa y las hojas exteriores, envasar en frascos y guardar en la heladera.' },
          { day: 28, text: 'Al mes ya estará listo, según la guía.' }
        ] },
      { id: 'ferm-kimchi', recipe: 'kimchi-artesanal', readyDaysMin: 3, readyDaysMax: 3,
        milestones: [
          { day: 0, text: 'Salar el akusay y masajear; dejar reposar 1 hora. Mezclar con el resto, apretar en el frasco hasta que quede cubierto por su propio jugo y cerrar.' },
          { day: 3, text: 'Pasaron los 3 días a temperatura ambiente: guardarlo en la heladera (dura 1 mes) o empezar a comerlo.' }
        ] },
      { id: 'ferm-caju', recipe: 'untable-caju-fermentado', readyDaysMin: 0.25, readyDaysMax: 0.5,
        milestones: [
          { day: 0, text: 'Licuar el cajú con el iniciador probiótico y dejar el frasco cubierto con una servilleta.' },
          { day: 0.25, text: 'A las 6 horas (o 12 o más si es invierno) probar la acidez; guardar en la heladera cuando esté a tu gusto.' }
        ] },
      { id: 'ferm-masa-madre', recipe: 'pan-centeno-masamadre', readyDaysMin: 3, readyDaysMax: 7,
        milestones: [
          { day: 0, text: 'Mezclar partes iguales de harina de centeno (o trigo integral orgánico) y agua.' },
          { day: 1, text: 'Sumar 1 cucharada de harina y revolver (se repite cada día).' },
          { day: 3, text: 'Si burbujea, duplica su tamaño y huele a fermento, ya está (en invierno puede tardar hasta una semana). Taparla y guardarla en la heladera.' },
          { day: 7, text: 'Si todavía no burbujea, seguir alimentándola; un activador (1 cda de kéfir o 2 ciruelas secas) acorta el tiempo.' }
        ] }
    ]
  };

  /* Honestidad sobre las horas (QA-32): la guía dice «la noche anterior» / «dejar en remojo». Los rangos minH/optH/maxH son criterio editorial del equipo
     (heredados de v1), salvo los que la guía fija: sarraceno mínimo 6 h (pág. 39), chía y lino con su tiempo en la receta. */
  var GUIDE_HOURS = { 'remojo-sarraceno': 'El mínimo de 6 horas es de la guía (pan de trigo sarraceno, pág. 39); el resto es orientativo.', 'remojo-chia': 'Los 30 minutos son de la guía (pan de quinoa y amaranto, pág. 37); la noche, del pudding de chía (pág. 10).',
    'remojo-quinoa': null, 'remojo-lino': 'Toda la noche es de la guía (agua de lino, pág. 7).', 'remojo-avena': 'La noche anterior es de la guía (hot cakes, pág. 10).' };
  root.DX.prep.soaking.forEach(function (s) {
    var g = Object.prototype.hasOwnProperty.call(GUIDE_HOURS, s.id) ? GUIDE_HOURS[s.id] : undefined;
    if (g === undefined) {
      s.hoursEditorial = true;
      s.note = 'Las horas son orientativas del equipo: la guía solo dice «dejar en remojo la noche anterior».';
    } else {
      s.hoursEditorial = s.id === 'remojo-sarraceno';
      s.note = g;
    }
  });
})(typeof window !== 'undefined' ? window : globalThis);
