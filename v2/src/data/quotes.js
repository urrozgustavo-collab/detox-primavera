/* Detox de Primavera v2 — una cita por día (0 = preparación, 1…21).
   attribution: 'verificada' (fuente identificable) | 'atribuida' (se la cita a ese autor, sin fuente primaria comprobada o parafraseada) | 'popular' (dicho o proverbio).
   Criterio: cero citas con nombre propio sin fuente primaria. «verificada» = textual de la guía de Isabel Caparra (página en `context`) u obra identificable (Newton, Paracelso, Durant). La UI muestra «atribuida a …» cuando no es 'verificada'. context: nota editorial del equipo sobre el programa; no contiene afirmaciones médicas. */
(function (root) {
  'use strict';
  root.DX = root.DX || {};

  function Q(day, theme, text, author, attribution, context) {
    return { day: day, theme: theme, text: text, author: author, attribution: attribution, context: context };
  }

  root.DX.quotes = [
    Q(0, 'Lo que puedas', 'Si así lo sentís podés hacerlo 1, 2 o 3 días, lo que puedas va a estar bien.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 5. Hoy se prepara el terreno: bajar a la mitad el café, el mate o el té cada 2 días y hacer las compras iniciales.'),
    Q(1, 'El inicio depurativo', 'La idea es los primeros 3 días entrar en depuración con una alimentación a base de manzanas y arroz yamaní.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 5. Podés hacerlo 1, 2 o 3 días; lo que puedas va a estar bien.'),
    Q(2, 'Hidratación', 'Mantenerte hidratado/a ayuda a mitigar los síntomas que pueden surgir durante la desintoxicación.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 6. Si aparece dolor de cabeza o desgano al dejar la cafeína, mirá el botiquín SOS y tomá agua tibia durante el día.'),
    Q(3, 'Una cosa a la vez', 'Ir sumando de a una alguna o varias de estas opciones.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 7. Es la regla de la escalera de constipación del SOS: se prueba un escalón por vez.'),
    Q(4, 'Los verdes', 'Los alimentos que más trabajan el hígado y vamos a estar consumiendo diariamente en todas las comidas son los verdes en mayor cantidad y también violetas y naranjas.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 25. Desde acá el plato lleva los verdes en mayor cantidad.'),
    Q(5, 'Remojar la noche anterior', 'Si podés ponerlas en remojo la noche anterior, es lo ideal para sacar el ácido fítico.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 29. Habla de los granos: en la app, Cocina → Remojos te dice qué dejar en remojo para mañana.'),
    Q(6, 'La sal, al final', 'Agregar sal al final de la cocción cuando la legumbre ya está cocida.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 29. Hoy mirá cómo te cayeron los alimentos del plan y anotalo en el check-in.'),
    Q(7, 'Primera semana', 'Una vez pasado los primeros 7 días podrías incorporar en ayunas el agua de mar si quisieras en vez del limón.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 8. Es opcional: las dosis y contraindicaciones están en el herbario.'),
    Q(8, 'Más verduras', 'Incentivá más el consumo de poroto mung, quinoa y arroz integral y siempre mejor usar más proporción de verduras que de cereales o legumbres.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 16. Segunda semana: seguí con crucíferas, porotos mung, quinoa, fermentos y caldos.'),
    Q(9, 'A ojo, pero con receta', 'Yo soy muy de hacer todo a ojo, pero esta receta siempre me queda mejor cuando la hago tal cómo está ahí.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 34. Lo dice Isa del kimchi. En el check-in podés anotar si el hambre de hoy fue física o emocional.'),
    Q(10, 'La simplicidad', 'La naturaleza se complace en la simplicidad y no se jacta de la pompa de causas superfluas.', 'Isaac Newton, Principia, regla I (traducción)', 'verificada',
      'Newton lo escribió sobre las causas en la ciencia; acá se lo usa en sentido figurado. La guía propone platos simples: un cereal o legumbre, un dip o aliño y verduras.'),
    Q(11, 'La dosis', 'Todas las cosas son veneno, y nada hay sin veneno; solo la dosis hace que una cosa no sea veneno.', 'Paracelso, Septem Defensiones (1538, traducción)', 'verificada',
      'Por eso la guía da dosis para cada hierba y suplemento y avisa cuándo no usarlos. Leelas antes de sumar algo.'),
    Q(12, 'Libertad en el plato', 'Podes usar la cantidad que desees en el plato.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 20. Lo dice Isa de los aliños del recetario.'),
    Q(13, 'Agua tibia', 'Al sistema digestivo siempre le hace bien el agua tibia, tonifica el sistema digestivo, lo recomiendo siempre no es cosa de estar haciendo un détox.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 6. Tomá agua tibia a lo largo del día y 2 a 4 tazas de infusión sin endulzar.'),
    Q(14, 'Sin endulzar', 'No endulzar las infusiones.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 23. Mitad del camino. Mirá tu constancia en la pantalla de Progreso.'),
    Q(15, 'Con paciencia', 'Cuanto más tiempo lo dejes más dulce va a estar, inclusive puede llegar a consistencia mermelada.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 5. Lo dice Isa del nituke de manzana. Tercera semana: si tendés a la humedad o la flema, la guía sugiere cebolla o ajo con rabanitos y jugo de jengibre (salvo gastritis o acidez).'),
    Q(16, 'La constancia', 'Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto, sino un hábito.', 'Will Durant, La historia de la filosofía (1926; no es de Aristóteles)', 'verificada',
      'Lo que cuenta es la constancia, no la perfección: tu racha tiene días de gracia.'),
    Q(17, 'Comer con atención', 'Masticar un mínimo de 20 veces por bocado. Comer sentado, no parado, caminando o manejando.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 7. Anotá en el check-in cómo te cae cada comida.'),
    Q(18, 'Cocido y caliente', 'Si sos muy friolentx sólo come cosas cocidas y calientes y si comes crudas que sea por la mañana o al mediodía.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 25. Probá cenar liviano y anotá cómo dormís.'),
    Q(19, 'Sin límite de cantidades', 'No hay límite de cantidades, come lo que necesites para saciarte.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 7. Saber por qué comés lo que comés vuelve cada comida una decisión consciente.'),
    Q(20, 'A sorbitos', 'Tomar el agua de a sorbitos y caliente a cada rato durante el día.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 41. Lo dice Isa del agua ionizada. Mañana termina el programa: pensá qué hábitos querés conservar.'),
    Q(21, 'Para seguir', 'A todos nos sientan bien sus acciones relajantes si se agregan unas pocas flores a un té o al mate.', 'Isabel Caparra', 'verificada',
      'Guía del Detox de Primavera, pág. 46. Lo dice Isa de la lavanda. Terminaste los 21 días: mirá tu informe y planificá la reintroducción de alimentos de a uno.')
  ];
})(typeof window !== 'undefined' ? window : globalThis);
