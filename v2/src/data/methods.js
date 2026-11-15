/* Detox de Primavera v2 — métodos de cocción (guía págs. 27-30): los 8 métodos, tabla de cocción de granos y reglas de legumbres. */
(function (root) {
  'use strict';
  root.DX = root.DX || {};

  root.DX.methods = {
    methods: [
      { id: 'vapor', name: 'Cocimiento al vapor', source: 'guía p.27',
        desc: 'Las verduras se cocinan sobre el agua, sin sumergirlas. Es el método que más conserva sus propiedades nutricionales.',
        steps: [
          'Llenar una cacerola que cierre bien su tapa con 5 cm de agua y ponerla a hervir.',
          'Cuando el agua llegue al primer hervor, poner las verduras cortadas adentro (cuanto más pequeñas, más rápido se cocinan). Bajar el fuego y tapar.',
          'Cocer hasta que cambien de color pero no lleguen a ablandarse demasiado (entre 10 minutos para una arveja o un choclo y 30 para una remolacha).',
          'El agua de cocción es útil como caldo o como base para sopas y risottos: contiene vitaminas y minerales.'
        ], tip: 'Sirve la vaporera metálica en forma de flor o la de bambú, pero también se puede sin ellas.' },
      { id: 'nituke', name: 'Cocimiento sin agua (nituke)', source: 'guía p.27',
        desc: 'Una de las técnicas favoritas de la guía: concentra el sabor de las frutas y verduras, que se cuecen en sus propios jugos.',
        steps: [
          'Precalentar una olla de fondo grueso que tape bien y poner 2 cucharadas soperas de agua; calentarla a punto de hervir.',
          'Agregar una pizca de sal a los alimentos (ayuda a que larguen su jugo) e incorporarlos.',
          'Bajar el fuego a pelusa o poner un difusor, tapar y cocinar al vapor en su propio jugo hasta que estén a medio cocer y con color brillante.',
          'Con verduras, poner en la base las más duras por capas (cebolla, zanahoria) y arriba las más blandas (espinaca, Bruselas).'
        ], tip: 'Con frutas, cuanto más tiempo se dejen, más dulces serán: hasta una hora se hace casi una mermelada natural. Normalmente se le agrega una lámina de aceite, pero durante el détox se evita.' },
      { id: 'salteado_agua', name: 'Salteado en agua', source: 'guía p.28',
        desc: 'Se saltea con un poco de agua en lugar de aceite.',
        steps: [
          'Poner un par de cucharadas de agua en una cacerola, calentar casi al punto de ebullición y mantenerla así, sin llegar al hervor.',
          'Agregar los condimentos y luego los ingredientes.',
          'Bajar el fuego y cocinar las verduras hasta que tengan un color brillante y estén cocidas.'
        ], tip: null },
      { id: 'salteado_aceite_agua', name: 'Salteado en aceite y agua', source: 'guía p.28',
        desc: 'La excepción de la guía para el aceite durante el détox: 1 cdita sobre un fondo de agua.',
        steps: [
          'Cubrir el fondo de una sartén o cacerola con agua y calentarla.',
          'Agregar 1 cucharadita de aceite de oliva.',
          'Saltear como es usual, con fuego moderado para no sobrecalentar el aceite.'
        ], tip: null },
      { id: 'blanqueado', name: 'Verduras blanqueadas', source: 'guía p.28',
        desc: 'Recomendado para espárragos y brócoli: mantienen una textura más agradable. También sirve para precocer una verdura y usarla más tarde.',
        steps: [
          'Llenar una cacerola con agua y esperar a que hierva.',
          'Incorporar las verduras y dejarlas de 1 a 3 minutos, hasta que estén cocidas pero aún crocantes, con un color verde vivo.'
        ], tip: null },
      { id: 'hervido', name: 'Verduras hervidas', source: 'guía p.28',
        desc: 'Útil para caldos y compotas, donde se toma el líquido. Si no, la guía prefiere vapor o nituke, porque en el hervor se pierden más propiedades.',
        steps: [
          'Para un caldo o una compota, poner las frutas o verduras desde que el agua está fría: así dejan su sabor en el agua. Hervir un rato hasta que esté sabroso (en la compota, cuanto más hierve, más dulce).',
          'Si querés comer las verduras hervidas sin su líquido, incorporarlas al agua que ya está hirviendo hasta que estén tiernas.'
        ], tip: null },
      { id: 'granos', name: 'Cocción de granos', source: 'guía p.29',
        desc: 'Método general para cereales y pseudocereales: remojar si se puede, cocinar sin revolver y dejar reposar.',
        steps: [
          'Si podés, ponerlos en remojo la noche anterior: es lo ideal para sacar el ácido fítico. La quinoa requiere muchos lavados, hasta que el agua deje de ensuciarse.',
          'Llevar a hervor sin tapa, con una pizca de sal y fuego alto, en una cacerola.',
          'Una vez hirviendo, bajar a mínimo y tapar. No revolver. Cocinar hasta que se evapore toda el agua.',
          'Retirar y dejar reposar de 5 a 10 minutos.'
        ], tip: 'Se puede cocinar arroz para dos o tres días y recalentarlo al vapor; no comerlo frío de la heladera. Los cereales duran aproximadamente 5 días en la heladera.' },
      { id: 'legumbres_digestivas', name: 'Cocción de legumbres y cómo hacerlas más digeribles', source: 'guía p.29-30',
        desc: 'Protocolo de la guía para porotos (negros, aduki, mung, pallares), lentejas negras o turcas, garbanzos y arvejas secas.',
        steps: [
          'Dejar en reposo (remojo) durante la noche siempre, salvo la lenteja turca.',
          'Desechar el agua de remojo (o usarla para regar las plantas). Poner en una cacerola con agua unos 4 cm por encima de las legumbres y agregar laurel o un pedacito de alga kombu.',
          'Cocinar sin sal: la sal hace coagular las proteínas y el grano queda duro. Llevar a hervor y cocinar unos 10 minutos sin tapa, quitando el exceso de espuma.',
          'Luego cocinar tapado hasta que estén tiernos y blandos por dentro. Controlar que no se queden sin agua.',
          'Recién ahí agregar sal (1 pizca o media cdita por cada taza de legumbre) y cocinar 5 minutos más para que se integren los sabores.',
          'Para una ensalada, colar y reservar el jugo por separado y cortar la cocción con las legumbres tiernas por dentro pero aún bien formadas. Para un paté o dip, dejarlas unos minutos más y reservar el agua para usar al procesarlas.'
        ], tip: 'Si aun así cuesta digerirlas, se pueden germinar: pasada la noche del remojo, sacar el agua, dejarlas toda la mañana o más y después cocinarlas con agua como siempre. No cocinarlas junto con carne: «legumbre y carne fermenta muchísimo».' }
    ],

    /* Tabla de cocción de granos: 1 taza de grano por N tazas de agua. La guía no da tiempos de cocción. */
    grains: [
      { grain: 'Arroz', ratio: '1 taza de arroz : 2 tazas de agua', water: 2, time: null, notes: 'Remojo nocturno si se puede. Reposo de 5 a 10 minutos.' },
      { grain: 'Quinoa', ratio: '1 taza de quinoa : 2 tazas de agua', water: 2, time: null, notes: 'Requiere muchos lavados, hasta que el agua deje de ensuciarse.' },
      { grain: 'Trigo sarraceno', ratio: '1 taza : 1 taza de agua', water: 1, time: null, notes: 'Primero saltear en un poco de agua de 3 a 5 minutos.' },
      { grain: 'Mijo', ratio: '1 taza : 3 ¼ tazas de agua', water: 3.25, time: null, notes: null },
      { grain: 'Trigo candeal entero', ratio: '1 taza : 4 tazas de agua', water: 4, time: null, notes: null },
      { grain: 'Cebada', ratio: '1 taza : 4 tazas de agua', water: 4, time: null, notes: null }
    ],

    /* Reglas de legumbres (guía págs. 29-30). */
    legumes: [
      'Dejarlas en remojo durante la noche, siempre (salvo la lenteja turca).',
      'Desechar el agua del remojo o usarla para regar las plantas.',
      'Cocinarlas con agua unos 4 cm por encima y con laurel o un pedacito de alga kombu.',
      'Cocinar sin sal; la sal va recién al final, cuando la legumbre ya está cocida (1 pizca o media cdita por taza).',
      'Hervir unos 10 minutos sin tapa, sacando la espuma; después tapar hasta que estén tiernas.',
      'No cocinarlas con carne: la combinación fermenta muchísimo.',
      'Si cuesta digerirlas: germinarlas después del remojo antes de cocinarlas.'
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
