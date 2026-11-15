/* Detox de Primavera v2 — Botiquín SOS.
   Los pasos salen de la guía (págs. 6-8, 23-25, 41-52) y del material del taller. Lo que NO está en la guía se marca con
   editorial:true (o en whenToConsult/firstAid) para que la app lo muestre como criterio del equipo, no como pauta de Isa.
   ladder:true = escalera «ir sumando de a una» (la app deja tildar qué se probó). */
(function (root) {
  'use strict';
  root.DX = root.DX || {};

  function st(text, ladder, extra) { var o = { text: text, ladder: !!ladder }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function W(condition, text) { return { condition: condition, text: text }; }
  var CONSULT = 'Material educativo del taller; no reemplaza la consulta médica. Consultá con un profesional si el síntoma es intenso, no mejora, empeora, o si tomás medicación o tenés una enfermedad crónica.';

  root.DX.sos = [
    {
      id: 'constipacion', symptom: 'Constipación', icon: 'frasco',
      cause: 'Puede aparecer como resultado de la ausencia de cafeína o de comidas irritantes (guía, pág. 7).',
      intro: 'Ir sumando de a una alguna o varias de estas opciones, en este orden.',
      steps: [
        st('Tomar 2 vasos de agua tibia en ayunas.', true),
        st('Tomar 1 vaso de agua tibia en ayunas con 1 cda de vinagre de manzana sin pasteurizar.', true),
        st('Tomar 1 cucharada sopera de limón con 1 cda de aceite de oliva antes de las comidas.', true),
        st('Sumar 2 a 3 cdas de semillas de lino molidas en las comidas. Usar aceite de lino en las comidas.', true),
        st('Agua de lino: poner 1 cda de semillas de lino en remojo con 1 taza de agua caliente. Dejar reposar durante la noche y beber a la mañana.', true),
        st('1 cdita de semillas de psyllium en un vaso grande de agua, en ayunas.', true),
        st('Cataplasmas de aceite de ricino: poner un trapo o toalla embebido en aceite, con el lado embebido sobre la piel. Cubrir por encima con otra tela para evitar manchas.', true),
        st('Aloe vera líquido: 1 cda sopera a la mañana o antes de las comidas.', true, { note: 'Esta opción no es muy recomendable para friolentos. No hacerlo sin supervisión médica más de 3 semanas.' })
      ],
      whenToConsult: CONSULT + ' La guía no fija un límite de días: si pasan varios días y probaste los escalones sin resultado, consultá.',
      relatedSymptoms: ['constipacion'], relatedHerbs: ['lino', 'chia', 'vinagre-manzana', 'centeno'], relatedRecipes: ['agua-de-lino', 'mix-rawmesan'],
      warnings: [W('diarrea', 'Si tenés tendencia a la diarrea, evitá el lino (semillas, aceite y agua de lino).')]
    },
    {
      id: 'diarrea-flojera', symptom: 'Flojera intestinal o diarrea', icon: 'agua',
      cause: 'Es usual que suceda como reacción a la desintoxicación (guía, pág. 8).',
      steps: [
        st('Tomar 1 cdita de psyllium en polvo o semilla molida (se vende en dietética) en ½ vaso de agua al levantarte.'),
        st('Tomar 1 pastilla de carbón activado antes de dormir, separada una hora de remedios, suplementos o hierbas.'),
        st('Reponer minerales: agua con sal marina o electrolitos naturales, si es muy profusa.'),
        st('Tomar infusión de manzanilla o de hinojo.'),
        st('Evitar el lino y la chía mientras dure la flojera: la guía los contraindica en diarrea.')
      ],
      whenToConsult: CONSULT + ' Si la diarrea es profusa o dura varios días, no la sostengas con el plan: consultá.',
      relatedSymptoms: ['diarrea'], relatedHerbs: ['manzanilla', 'lino', 'chia', 'menta', 'agua-de-mar'], relatedRecipes: ['infusion-calmante-triple-flor'],
      warnings: [W('diarrea', 'Evitá lino, chía, menta, agua de mar pura y vinagre en dosis terapéuticas.')]
    },
    {
      id: 'frio-corporal', symptom: 'Frío corporal o manos y pies fríos', icon: 'fuego',
      cause: 'La guía los toma como señal de constitución «friolenta»: las versiones cocidas y calientes son mejores (pág. 6 y 25).',
      steps: [
        st('Comer cosas cocidas y calientes. Si comés crudos, que sea por la mañana o al mediodía, y siempre que el clima y tu temperatura corporal acompañen.'),
        st('Sumar a la mañana, junto al limón con agua tibia, una puntita de cdita de jengibre seco o canela, o el jugo exprimido con los dedos de la ralladura de 1 cda de jengibre fresco.'),
        st('Evitar los jugos: la guía los desaconseja si hay síntomas de frío. Elegir nituke o compota de manzana.'),
        st('Tomar agua tibia o ionizada y una infusión cálida, como albahaca con jengibre.'),
        st('Evitar wheatgrass y espirulina (naturaleza fría). La chlorella es algo más cálida.')
      ],
      whenToConsult: CONSULT,
      relatedSymptoms: ['frio_extremidades'], relatedHerbs: ['jengibre', 'albahaca', 'agua-ionizada', 'quinoa', 'wheatgrass', 'espirulina'],
      relatedRecipes: ['infusion-digestiva-albahaca-jengibre', 'nituke-manzana', 'compota-manzana', 'caldo-detox', 'guiso-mung-calabaza'],
      warnings: [W('ulcera_gastritis', 'El jengibre está contraindicado en úlcera gastroduodenal.'), W('embarazo', 'El jengibre medicinal está contraindicado en el embarazo.')]
    },
    {
      id: 'dolor-cabeza', symptom: 'Dolor de cabeza', icon: 'info',
      cause: 'Puede estar relacionado con la falta de cafeína. El taller sugiere amortiguarla con té verde en los primeros días.',
      steps: [
        st('Tomar té verde, banchá o matcha en taza durante los primeros días, si lo necesitás para que sea más llevadera la falta de cafeína.'),
        st('Tomar agua tibia a lo largo del día: ayuda a desinflamar y a mitigar el dolor de cabeza (material del taller).'),
        st('Probar una infusión de manzanilla (la guía la menciona para cefaleas) o de lavanda (jaquecas por tensiones emocionales).'),
        st('Para suavizar algunos dolores de cabeza: disolver 1 cdita de vinagre de sidra de manzana en ⅓ de taza de agua y tomar de a sorbitos.')
      ],
      whenToConsult: CONSULT + ' Un dolor de cabeza muy intenso, repentino o distinto de lo habitual necesita consulta médica.',
      relatedSymptoms: ['cefalea'], relatedHerbs: ['manzanilla', 'lavanda', 'vinagre-manzana', 'jengibre'], relatedRecipes: ['infusion-calmante-triple-flor', 'mate-medicinal-hierbas'],
      warnings: [W('diarrea', 'No tomes vinagre en dosis terapéuticas si tenés heces flojas.'), W('embarazo', 'Manzanilla en dosis terapéuticas: contraindicada en el embarazo.')]
    },
    {
      id: 'debilidad', symptom: 'Debilidad o falta de energía', icon: 'sol',
      cause: 'La guía lo prevé si acostumbrás a comer mucha proteína animal, si hay una deficiencia nutricional o si no querés pasar los 21 días sin proteína animal (pág. 25).',
      steps: [
        st('No hay límite de cantidades: comé lo que necesites para saciarte, sentado/a y masticando bien. Seguí tomando mucha agua.'),
        st('Podés comer pescado a la parrilla, plancha, vapor o en sopa, preferentemente al mediodía.'),
        st('También se permiten algunos huevos, preferentemente al mediodía.'),
        st('O un caldo de hueso del espinazo del pescado, o de hueso de pollo o vaca pastoril.')
      ],
      whenToConsult: CONSULT + ' Si la debilidad es marcada o te impide hacer tu día, consultá antes de seguir con el plan.',
      relatedSymptoms: ['debilidad'], relatedHerbs: ['quinoa', 'porotos-mung', 'arroz-integral'], relatedRecipes: ['bowl-yamani-cruciferas', 'caldo-detox'],
      warnings: []
    },
    {
      id: 'acidez', symptom: 'Acidez o ardor de estómago', icon: 'fuego',
      cause: 'La guía no trae un protocolo propio de acidez; se reúnen las pautas de gastritis, digestión y cocción que sí menciona.',
      steps: [
        st('Tomar una infusión de manzanilla: la guía la recomienda en alteraciones digestivas, gastritis y gases.'),
        st('Masticar un mínimo de 20 veces por bocado y comer sentado/a, sin apuro.'),
        st('Preferir preparaciones cocidas y tibias (caldos, verduras al vapor, nituke de manzana).'),
        st('Si tenés gastritis o acidez cotidiana, no uses ajo crudo todos los días en las comidas (la guía lo indica expresamente).'),
        st('Si el ardor aparece sobre todo a la mañana y el limón en ayunas te cae mal, consultalo con Isa en el grupo antes de seguir.', false, { editorial: true })
      ],
      whenToConsult: CONSULT + ' El ardor frecuente o con dolor intenso necesita consulta médica.',
      relatedSymptoms: ['acidez'], relatedHerbs: ['manzanilla', 'carqueja', 'porotos-mung', 'limon'], relatedRecipes: ['caldo-detox', 'nituke-manzana', 'infusion-calmante-triple-flor'],
      warnings: [W('ulcera_gastritis', 'El jengibre está contraindicado en úlcera gastroduodenal; el ajo crudo no se recomienda con gastritis o acidez cotidiana.')]
    },
    {
      id: 'mareos', symptom: 'Mareos o presión baja', icon: 'alerta',
      cause: 'La guía no trae un protocolo específico. Se resumen sus pautas de hidratación y de comer sin restricción de cantidades.',
      steps: [
        st('Sentate o recostate hasta que se pase, y levantate despacio.', false, { editorial: true }),
        st('Tomar agua tibia: mantenerse bien hidratado/a ayuda a mitigar los síntomas de la desintoxicación.'),
        st('Reponer minerales con agua con una pizca de sal marina o electrolitos naturales (así lo indica la guía para la flojera intestinal).'),
        st('Comer lo que necesites: no hay límite de cantidades. Arroz yamaní, quinoa y porotos mung en porciones suficientes.')
      ],
      whenToConsult: CONSULT + ' Si te desmayás, el mareo se repite o viene con dolor de pecho o palpitaciones, consultá enseguida.',
      relatedSymptoms: ['mareos'], relatedHerbs: ['calendula', 'jengibre'], relatedRecipes: ['caldo-detox', 'bowl-yamani-cruciferas'],
      warnings: [W('hipotension', 'La caléndula es hipotensora (baja la presión): evitala si tenés presión baja.')]
    },
    {
      id: 'nauseas', symptom: 'Náuseas', icon: 'agua',
      cause: 'La guía menciona hierbas que ayudan con las náuseas (jengibre y manzanilla).',
      steps: [
        st('Tomar una infusión de jengibre fresco: la guía lo indica para controlar las náuseas y los vómitos.'),
        st('O una infusión de manzanilla (la guía la menciona para náuseas y vómitos).'),
        st('Comer sentado/a, despacio y masticando bien.')
      ],
      whenToConsult: CONSULT + ' Si hay vómitos repetidos o no podés tomar líquidos, consultá.',
      relatedSymptoms: ['nauseas'], relatedHerbs: ['jengibre', 'manzanilla', 'menta'], relatedRecipes: ['infusion-digestiva-albahaca-jengibre', 'infusion-calmante-triple-flor'],
      warnings: [W('embarazo', 'El jengibre está contraindicado en el embarazo (uso medicinal); la manzanilla en dosis terapéuticas también.'),
        W('lactancia', 'El jengibre en dosis medicinal está contraindicado en la lactancia; la menta puede inhibirla.'), W('ulcera_gastritis', 'El jengibre está contraindicado en úlcera gastroduodenal.')]
    },
    {
      id: 'irritabilidad', symptom: 'Irritabilidad o estrés', icon: 'hoja',
      cause: 'La guía sugiere lavanda si te sentís muy irritable (pág. 24).',
      steps: [
        st('Tomar una infusión de lavanda, o tintura madre de lavanda (consultar a Isa cómo).'),
        st('Sumar unas pocas flores de lavanda a un té o al mate de yuyos.'),
        st('La infusión triple flor (manzanilla, caléndula y lavanda) es de naturaleza neutra.')
      ],
      whenToConsult: CONSULT + ' Dosis altas de lavanda (3 a 4 tazas por día) requieren indicación de un fitoterapeuta.',
      relatedSymptoms: ['irritabilidad', 'insomnio'], relatedHerbs: ['lavanda', 'manzanilla', 'calendula'], relatedRecipes: ['infusion-calmante-triple-flor', 'mate-medicinal-hierbas'],
      warnings: [W('embarazo', 'Caléndula y manzanilla en dosis terapéuticas están contraindicadas en el embarazo.'), W('lactancia', 'La caléndula en uso terapéutico está contraindicada en la lactancia.')]
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
