/* Preparaciones del menú de la guía que v1 no tenía como receta (auditoría §6.4) y las de la monodieta.
   Solo lo que dice la guía: si no da cantidades, qty:null. Fuente = página de la guía. */
'use strict';
// L(texto, item, qty, unit, {opt, role}) — ingrediente ya estructurado
const L = (text, item, qty, unit, o) => Object.assign({ text, item: item || null, qty: qty === undefined ? null : qty, unit: unit || null }, o || {});
const OPT = { opt: 1 };
const N = [];
function add(r) { N.push(r); }

add({ id: 'compota-manzana', title: 'Compota de manzana', cat: 'desayunos', t: null, serv: null, ph: 'mg', sl: 'dm', th: 'calido', tags: 'cocido', src: 'guía p.5', method: 'Hervido suave',
  ing: [L('Manzanas peladas y cortadas', 'manzana', null, null), L('Agua fría para cubrir', 'agua', null, null)],
  steps: ['Cortar las manzanas y ponerlas en agua fría.', 'Hervir: cuanto más rato hierven, más dulces se ponen. No lleva azúcar ni miel.'],
  tip: 'Se puede licuar la compota para el «licuado de compota» o usar el agua de la compota como bebida.', note: 'La guía no da tiempos ni cantidades.' });

add({ id: 'licuado-jugo-manzana', title: 'Licuado o jugo de manzana', cat: 'jugos', t: [5, 5, 0], ph: 'mg', sl: 'dm', th: 'fresco', tags: 'sin-coccion', src: 'guía p.5-6', method: 'Licuado o juguera',
  ing: [L('Manzanas verdes o rojas', 'manzana', null, null), L('Agua (para el licuado)', 'agua', null, null)],
  steps: ['Licuar las manzanas con agua, o pasarlas por la juguera.', 'Variante: licuar con agua de compota de manzanas en lugar de agua.'],
  tip: 'Quienes son friolentos pueden elegir las opciones cocidas (nituke o compota) en lugar del jugo.', note: null });

add({ id: 'arroz-integral-tibio', title: 'Arroz integral tibio', cat: 'almuerzos', t: [40, 5, 0], serv: null, ph: 'mg', sl: 'ac', th: 'calido', tags: 'cocido batch', src: 'guía p.5, p.6 y p.29', method: 'Cocción de granos',
  ing: [L('1 taza de arroz integral, basmati integral, largo fino o yamaní (preferentemente orgánico)', 'arroz_yamani', 1, 'taza'), L('2 tazas de agua', 'agua', 2, 'taza'), L('1 pizca de sal marina', 'sal_marina', 1, 'pizca'),
    L('Condimentar solo con sal, gomasio o salsa Shoyu MOA', 'shoyu', null, null, OPT), L('Si no lo soportás sin aceite: entre ¼ y ½ palta por comida', 'palta', 0.5, 'unidad', OPT)],
  steps: ['Si podés, dejá el arroz en remojo la noche anterior.', 'Llevar el agua con una pizca de sal a hervor, sin tapa y a fuego alto, y agregar el arroz.', 'Una vez hirviendo, bajar a fuego mínimo y tapar. No revolver. Cocinar hasta que se evapore toda el agua.',
    'Retirar y dejar reposar de 5 a 10 minutos.', 'Servir tibio, sin aceite, con sal, gomasio o shoyu MOA.'],
  tip: 'Se puede cocinar para 2 o 3 días y recalentar al vapor en cacerolita antes de comer; no comerlo frío de la heladera. Los cereales duran aproximadamente 5 días en la heladera.', note: null });

add({ id: 'gomasio', title: 'Gomasio', cat: 'alinos', t: [10, 10, 0], ph: 'mg', sl: 'ac', th: null, tags: 'sin-coccion', src: 'guía p.6', method: 'Tostado y molienda',
  ing: [L('Sésamo integral', 'semillas_sesamo', null, null), L('Sal marina', 'sal_marina', null, null)],
  steps: ['Tostar el sésamo integral.', 'Moler el sésamo tostado con sal marina.', 'Usar sobre el arroz y las comidas.'],
  tip: null, note: 'La guía define el gomasio como «sésamo integral tostado y molido con sal marina» pero no da proporciones.' });

add({ id: 'ensalada-porotos-negros', title: 'Ensalada de porotos negros', cat: 'ensaladas', t: [15, 15, 0], ph: 'g', sl: 'ac', th: null, tags: 'cocido', src: 'guía p.12', method: 'Ensamble',
  ing: [L('Un par de puñados de porotos negros cocidos', 'porotos_negros', 2, 'puñado'), L('Palta', 'palta', 1, 'unidad'), L('Pepino o brócoli blanqueado', 'pepino', null, null), L('Apio cortado finito', 'apio', null, null),
    L('Un puñado de cherrys', 'tomate_cherry', 1, 'puñado'), L('Albahaca o perejil', 'albahaca', null, null), L('Sal', 'sal_marina', null, null), L('Limón', 'limon', null, null), L('Aceite de oliva o de lino', 'aceite_oliva', null, null)],
  steps: ['Mezclar los porotos negros cocidos con la palta y abundantes verduras: pepino o brócoli blanqueado, apio cortado finito y los cherrys.', 'Condimentar con albahaca o perejil, sal, limón y aceite de oliva o de lino.'],
  tip: 'Podés usar un poco del líquido de cocción de los porotos para humedecerlos: es rico y tonificante.', note: null });

add({ id: 'ensalada-garbanzos-palta-cherrys', title: 'Ensalada de garbanzos con palta y cherrys', cat: 'ensaladas', t: [15, 15, 0], ph: 'g', sl: 'ac', th: null, tags: 'cocido', src: 'guía p.13', method: 'Ensamble',
  ing: [L('Un par de puñados de garbanzos cocidos', 'garbanzos', 2, 'puñado'), L('Palta', 'palta', 1, 'unidad'), L('Tomates cherry', 'tomate_cherry', null, null), L('Hojas de albahaca cortadas finitas', 'albahaca', null, null),
    L('Para acompañar: espárragos, chauchas o brócoli blanqueados', 'esparragos', null, null, OPT)],
  steps: ['Mezclar los garbanzos con la palta, los tomates cherry y la albahaca cortada finita.', 'Acompañar con espárragos, chauchas o brócoli blanqueados.'], tip: null, note: null });

add({ id: 'ensalada-quinoa-palta-cherry', title: 'Ensalada de quinoa con palta, cherry y morrón', cat: 'ensaladas', t: [25, 15, 0], ph: 'g', sl: 'ac', th: null, tags: 'cocido', src: 'guía p.13', method: 'Ensamble',
  ing: [L('Quinoa (blanca, morada o mix) cocida tibia', 'quinoa', null, null), L('Palta en cubitos', 'palta', null, null), L('Tomates cherry cortados al medio', 'tomate_cherry', null, null), L('Morrón picado chico', 'morron', null, null),
    L('Cebolla colorada picada', 'cebolla_morada', null, null), L('Sal', 'sal_marina', null, null), L('Limón', 'limon', null, null), L('Cilantro', 'cilantro', null, null),
    L('Para acompañar: espinaca, espárragos, chauchas o brócoli al vapor', 'espinaca', null, null, OPT)],
  steps: ['Cocinar la quinoa (1 taza por 2 de agua) y dejarla tibia.', 'Mezclar con la palta en cubitos, los cherry, el morrón y la cebolla colorada.', 'Condimentar con sal, limón y cilantro.', 'Acompañar con espinaca, espárragos, chauchas o brócoli al vapor.'], tip: null, note: null });

add({ id: 'alcauciles-con-alino', title: 'Alcauciles con aliño de limón', cat: 'almuerzos', t: null, ph: 'g', sl: 'ac', th: null, tags: 'cocido', src: 'guía p.13 y p.18', method: 'Vapor + aliño',
  ing: [L('2 alcauciles', 'alcaucil', 2, 'unidad'), L('Abundante limón', 'limon', null, null), L('Sal', 'sal_marina', null, null), L('Aceite de oliva', 'aceite_oliva', null, null), L('Vinagre de manzana sin pasteurizar (alternativa al limón)', 'vinagre_manzana', null, null, OPT)],
  steps: ['Cocinar los alcauciles (la guía no detalla el método: se aplica el vapor, pág. 27).', 'Aliñar o dejar remojar en un aliño de abundante limón, sal y oliva, o de vinagre de manzana sin pasteurizar.', 'Acompañar con alguna sopa, con bowl de arroz integral o con mayonesa de zanahorias. Otra opción es el aliño de zanahoria rebajado con limón.'],
  tip: null, note: 'La guía no indica cantidades ni tiempos de cocción del alcaucil.' });

add({ id: 'ensalada-rucula-cilantro-rabanitos', title: 'Ensalada de rúcula, cilantro y rabanitos', cat: 'ensaladas', t: [10, 10, 0], ph: 'g', sl: 'ac', th: null, tags: 'crudo', src: 'guía p.13', method: 'Ensamble',
  ing: [L('Rúcula', 'rucula', null, null), L('Cilantro', 'cilantro', null, null), L('Rabanitos', 'rabanitos', null, null), L('Cebolla morada fileteada', 'cebolla_morada', null, null), L('Sal', 'sal_marina', null, null), L('Vinagre de manzana sin pasteurizar', 'vinagre_manzana', null, null), L('Jugo de ralladura de jengibre', 'jengibre', null, null)],
  steps: ['Mezclar la rúcula, el cilantro, los rabanitos y la cebolla morada fileteada.', 'Condimentar con sal, vinagre de manzana sin pasteurizar y jugo de ralladura de jengibre.', 'Acompañar con cereal o legumbres.'], tip: null, note: null });

add({ id: 'ensalada-remolacha-palta-menta-pepino', title: 'Ensalada de remolacha, palta, menta y pepino', cat: 'ensaladas', t: [30, 10, 0], ph: 'g', sl: 'ac', th: null, tags: 'cocido', src: 'guía p.13', method: 'Vapor + ensamble',
  ing: [L('Remolacha al vapor', 'remolacha', null, null), L('Palta', 'palta', null, null), L('Menta', 'menta', null, null), L('Pepino (con un poco de cáscara) cortado finito', 'pepino', null, null), L('Arroz integral largo o quinoa', 'arroz_yamani', null, null, OPT)],
  steps: ['Cocinar la remolacha al vapor.', 'Mezclar con la palta, la menta y el pepino cortado finito, con un poco de cáscara.', 'Servir con arroz integral largo o quinoa.'], tip: null, note: 'La guía dice 30 minutos de vapor para una remolacha (pág. 27).' });

add({ id: 'esparragos-blanqueados-dijon', title: 'Espárragos blanqueados con dijon', cat: 'almuerzos', t: [10, 10, 0], ph: 'g', sl: 'ac', th: 'calido', tags: 'cocido', src: 'guía p.14', method: 'Blanqueado',
  ing: [L('Espárragos', 'esparragos', null, null), L('Mostaza de Dijon', 'mostaza_dijon', null, null), L('½ cucharadita de aceite de oliva', 'aceite_oliva', 0.5, 'cdita'), L('Sal', 'sal_marina', null, null), L('Un toque de agua', 'agua', null, null), L('Limón', 'limon', null, null),
    L('Para acompañar: arroz basmati o porotos mung', 'arroz_yamani', null, null, OPT)],
  steps: ['Blanquear los espárragos: sumergirlos 1 a 3 minutos en agua hirviendo, hasta que estén cocidos pero aún crocantes.', 'Preparar el aderezo con mostaza de Dijon, ½ cdita de aceite de oliva, sal, un toque de agua y limón.', 'Servir con una porción de arroz basmati o de porotos mung.'], tip: null, note: null });

add({ id: 'ensalada-esparragos-rabanitos', title: 'Ensalada de espárragos, rabanitos y arvejas', cat: 'ensaladas', t: [15, 15, 0], ph: 'g', sl: 'ac', th: null, tags: 'cocido', src: 'guía p.14', method: 'Ensamble',
  ing: [L('Espárragos cortados en diagonales (cocidos)', 'esparragos', null, null), L('Rabanitos fileteados', 'rabanitos', null, null), L('Arvejas hervidas', 'arvejas', null, null), L('Aderezo a elección (aliño del recetario)', null, null, null, OPT)],
  steps: ['Cortar los espárragos en diagonales y blanquearlos.', 'Mezclar con los rabanitos fileteados y las arvejas hervidas.', 'Aderezar a elección con alguno de los aliños del recetario.'], tip: null, note: null });

add({ id: 'nituke-repollo-colorado-manzana', title: 'Nituke de repollo colorado y manzana', cat: 'almuerzos', t: null, ph: 'g', sl: 'ac', th: 'calido', tags: 'cocido', src: 'guía p.19', method: 'Nituke',
  ing: [L('Repollo colorado', 'repollo', null, null), L('Manzana (igual cantidad que de repollo)', 'manzana', null, null), L('Rodajas de jengibre picado finito', 'jengibre', null, null), L('Un poco de sal', 'sal_marina', null, null), L('Un fondito mínimo de agua', 'agua', null, null)],
  steps: ['Cortar el repollo y la manzana en iguales partes.', 'Calentar la cacerola con un fondito mínimo de agua.', 'Cuando esté caliente, incorporar los ingredientes con un poco de sal y el jengibre picado finito.', 'Tapar bien y cocinar a fuego mínimo (pelusa o con difusor) hasta que estén tiernos. Revolver al rato si es necesario.'],
  tip: null, note: 'La guía no da el tiempo exacto.' });

add({ id: 'ensalada-pepino-palta', title: 'Ensalada de pepino y palta', cat: 'ensaladas', t: [5, 5, 0], ph: 'g', sl: 'ac', th: 'fresco', tags: 'crudo', src: 'guía p.19', method: 'Ensamble',
  ing: [L('1 pepino', 'pepino', 1, 'unidad'), L('Palta', 'palta', null, null), L('Sal', 'sal_marina', null, null), L('Limón', 'limon', null, null), L('Cilantro', 'cilantro', null, null)],
  steps: ['Cortar el pepino y la palta.', 'Condimentar con sal, limón y cilantro.'], tip: null, note: null });

add({ id: 'ensaladas-remolacha', title: 'Ensaladas combinadas con remolacha, chauchas y choclo', cat: 'ensaladas', t: [20, 15, 0], ph: 'g', sl: 'ac', th: null, tags: 'cocido', src: 'guía p.19', method: 'Ensamble',
  ing: [L('Remolacha cocida o cruda rallada', 'remolacha', null, null), L('Chauchas', 'chauchas', null, null, OPT), L('Choclo', 'choclo', null, null, OPT), L('Arvejas', 'arvejas', null, null, OPT), L('Habas peladas', 'habas', null, null, OPT),
    L('Zanahoria cruda', 'zanahoria', null, null, OPT), L('Nabo rallado crudo', 'nabo', null, null, OPT), L('Albahaca, espinaca o perejil cortados finitos', 'albahaca', null, null, OPT), L('Brócoli', 'brocoli', null, null, OPT), L('Tomates cherry', 'tomate_cherry', null, null, OPT)],
  steps: ['Elegir una de las combinaciones de la guía: chaucha y remolacha cocida; choclo y remolacha cocidas; arvejas y remolacha cocida; habas peladas y remolacha cocidas; zanahoria y remolacha cruda con albahaca, espinaca o perejil cortados finitos; zanahoria y nabo rallados crudos con perejil; brócoli, choclo y cherrys.', 'Cortar o rallar y mezclar. Condimentar con algún aliño del recetario.'],
  tip: null, note: 'Son 7 combinaciones en una sola ficha. Todos los ingredientes figuran como opcionales porque se elige una combinación.' });

add({ id: 'ensalada-libre', title: 'Ensalada libre', cat: 'ensaladas', t: [15, 15, 0], ph: 'g', sl: 'ac', th: null, tags: 'cocido', src: 'guía p.12', method: 'Ensamble',
  ing: [L('2 a 5 cucharadas de arroz o quinoa', 'arroz_yamani', 2, 'cda', { qtyMax: 5 }), L('Champiñones o portobellos crudos o a la plancha sin aceite', 'hongos_champi', null, null, OPT), L('Cebolla morada cortada finita', 'cebolla_morada', null, null, OPT), L('Hojas de verdeo cortadas finitas', 'cebolla_verdeo', null, null, OPT),
    L('Rabanitos rallados o en láminas', 'rabanitos', null, null, OPT), L('Pepino', 'pepino', null, null, OPT), L('Zanahoria rallada cruda o al vapor en cubos', 'zanahoria', null, null, OPT), L('Puntas de espárragos cocidos', 'esparragos', null, null, OPT),
    L('Zucchinis a la plancha sin aceite', 'zucchini', null, null, OPT), L('Berenjenas a la plancha sin aceite', 'berenjena', null, null, OPT), L('Kale u hojas de espinaca', 'espinaca', null, null, OPT), L('Arvejas al vapor', 'arvejas', null, null, OPT), L('Habas al vapor, peladas', 'habas', null, null, OPT),
    L('Chauchas al vapor', 'chauchas', null, null, OPT), L('Brócoli blanqueado', 'brocoli', null, null, OPT), L('Morrón en tiritas', 'morron', null, null, OPT), L('Apio cortado finito', 'apio', null, null, OPT), L('Repollo colorado cortado finito', 'repollo', null, null, OPT),
    L('Nabo rallado crudo', 'nabo', null, null, OPT), L('Rúcula, achicoria o radicheta', 'rucula', null, null, OPT), L('Tomates cherry', 'tomate_cherry', null, null, OPT), L('Albahaca, cilantro o perejil', 'albahaca', null, null, OPT),
    L('Brotes de alfalfa, soja, rabanitos o fenogreco', 'brotes', null, null, OPT), L('Cáscara de cítricos rallada', 'limon', null, null, OPT), L('Flores comestibles', null, null, null, OPT)],
  steps: ['Elegir de 3 a 5 ingredientes de la lista, crudos y cocidos.', 'Mezclar con 2 a 5 cucharadas de arroz o quinoa.', 'Agregar, si querés, albahaca, cilantro, perejil, brotes o cáscara de cítricos rallada. Se puede acompañar con humus de porotos mung.'],
  tip: 'Todos los ingredientes figuran como opcionales: la receta es «elegí 3 a 5».', note: null });

add({ id: 'hamburguesa-legumbres', title: 'Hamburguesa de legumbres con ensalada', cat: 'almuerzos', t: [20, 10, 0], ph: 'g', sl: 'ac', th: 'calido', tags: 'cocido', src: 'guía p.14', method: 'Horno o sartén antiadherente',
  ing: [L('Hamburguesas de legumbres de dietética (sin harinas blancas 000 ni huevo)', 'hamburguesa_legumbres', null, null), L('Brócoli o chauchas al vapor', 'brocoli', null, null), L('Hojas frescas de espinaca', 'espinaca', null, null), L('Cebolla morada cruda finita', 'cebolla_morada', null, null),
    L('Zanahoria o hinojo rallado', 'zanahoria', null, null), L('Champiñones', 'hongos_champi', null, null)],
  steps: ['Chequear en la etiqueta que no tengan harinas blancas 000 ni huevo.', 'Cocinar directo, sin aceite, al horno o en sartén antiadherente.', 'Servir con ensalada de brócoli o chauchas al vapor, hojas frescas de espinaca, cebolla morada cruda finita, zanahoria o hinojo rallado y champiñones.'],
  tip: null, note: 'La guía no da el tiempo de cocción; depende de la marca.' });

add({ id: 'batata-al-horno', title: 'Batata al horno con brócoli y coliflor', cat: 'almuerzos', t: null, ph: 'g', sl: 'ac', th: 'calido', tags: 'cocido', src: 'guía p.14', method: 'Horno',
  ing: [L('Batata entera con cáscara, cortada a la mitad', 'batata', 1, 'unidad'), L('Brócoli hervido al vapor o blanqueado', 'brocoli', null, null), L('Coliflor', 'coliflor', null, null), L('Espinaca', 'espinaca', null, null), L('Rúcula', 'rucula', null, null), L('Rabanitos', 'rabanitos', null, null), L('Cebolla morada', 'cebolla_morada', null, null), L('Champiñones', 'hongos_champi', null, null)],
  steps: ['Hornear la batata entera, con cáscara, hasta que esté tierna; cortarla a la mitad.', 'Acompañar con brócoli y coliflor hervidos al vapor o blanqueados.', 'Servir con una pequeña ensalada de espinaca, rúcula, rabanitos, cebolla morada y champiñones.'],
  tip: null, limits: { perWeek: 1 }, note: 'Máximo 1 vez por semana, según la guía. No indica temperatura ni tiempo de horno.' });

add({ id: 'fideos-integrales-tomate-brocoli', title: 'Fideos integrales con tomate y brócoli', cat: 'almuerzos', t: [20, 15, 0], ph: 'g', sl: 'ac', th: 'calido', tags: 'cocido', src: 'guía p.14-15', method: 'Hervido',
  ing: [L('Fideos integrales (de quinoa, trigo sarraceno, legumbres, soba, de arroz integral o de centeno)', 'fideos_integrales', null, null), L('Tomates cherry o perita cortados en cubos', 'tomate_cherry', null, null), L('Brócoli blanqueado', 'brocoli', null, null), L('Rúcula', 'rucula', null, null),
    L('Ajo o pesto de cilantro o de albahaca', 'ajo', null, null)],
  steps: ['Cocinar los fideos según su paquete.', 'Mezclar con tomates cherry o perita en cubos, brócoli blanqueado y rúcula.', 'Condimentar con ajo o con pesto de cilantro o de albahaca.'],
  tip: 'Los fideos soba de trigo sarraceno solo se consiguen en el barrio chino.', limits: { perWeek: 1 }, note: 'Si son de trigo integral, 1 o 2 veces durante todo el détox; los de otros granos pueden ser 1 vez por semana.' });

add({ id: 'compota-manzana-frutillas-arandanos', title: 'Compota de manzanas con frutillas o arándanos', cat: 'desayunos', t: null, ph: 'g', sl: 'dm', th: 'calido', tags: 'cocido', src: 'guía p.9', method: 'Hervido suave',
  ing: [L('Manzanas', 'manzana', null, null), L('Frutillas o arándanos', 'frutillas', null, null), L('Agua', 'agua', null, null), L('Para acompañar si rompés el ayuno: almendras tostadas picadas, semillas de lino molidas o nueces picadas', 'almendras', null, null, OPT)],
  steps: ['Cocinar las manzanas en agua como una compota, sin azúcar ni miel.', 'Sumar las frutillas o los arándanos.', 'Si rompés el ayuno con esta versión, acompañar con almendras tostadas picadas, semillas de lino molidas o nueces picadas.'],
  tip: null, note: 'La guía no da cantidades ni tiempos.' });

add({ id: 'ensalada-frutillas-pomelo', title: 'Ensalada fresca de frutillas y pomelo rosado', cat: 'desayunos', t: [10, 10, 0], ph: 'g', sl: 'dm', th: 'fresco', tags: 'crudo', src: 'guía p.9', method: 'Ensamble',
  ing: [L('Frutillas agroecológicas o arándanos', 'frutillas', null, null), L('Pomelo rosado en gajos', 'pomelo', null, null), L('Para acompañar si rompés el ayuno: almendras tostadas, semillas de lino molidas o nueces', 'almendras', null, null, OPT)],
  steps: ['Cortar las frutillas y armar los gajos de pomelo rosado.', 'Mezclar y servir. Si rompés el ayuno, acompañar con almendras tostadas picadas, semillas de lino molidas o nueces picadas.'],
  tip: 'Para friolentos: la guía recomienda las versiones cocidas; las frutas crudas solo si hace calor.', note: null });

add({ id: 'ensalada-manzana-frutillas-mandarina', title: 'Ensalada de manzana, frutillas, mandarina y menta', cat: 'desayunos', t: [10, 10, 0], ph: 'g', sl: 'dm', th: 'fresco', tags: 'crudo', src: 'guía p.10', method: 'Ensamble',
  ing: [L('Manzana', 'manzana', null, null), L('Frutillas agroecológicas', 'frutillas', null, null), L('Gajos de mandarina cortados a la mitad', 'mandarina', null, null), L('Arándanos', 'arandanos', null, null), L('Hojas de menta fresca', 'menta', null, null), L('Jugo de jengibre rallado', 'jengibre', null, null, OPT)],
  steps: ['Cortar la manzana y las frutillas; sumar los gajos de mandarina cortados a la mitad y los arándanos.', 'Agregar hojas de menta fresca y, opcional, jugo de jengibre rallado.'], tip: null, note: null });

add({ id: 'ensalada-rucula-frutillas-pepino', title: 'Ensalada de rúcula, frutillas y pepino', cat: 'desayunos', t: [10, 10, 0], ph: 'g', sl: 'dm', th: 'fresco', tags: 'crudo', src: 'guía p.10', method: 'Ensamble',
  ing: [L('Rúcula', 'rucula', null, null), L('Frutillas', 'frutillas', null, null), L('Pepinos en rodajas', 'pepino', null, null)],
  steps: ['Mezclar la rúcula con las frutillas y el pepino en rodajas.'], tip: null, note: null });

add({ id: 'ensalada-hinojo-zanahoria-naranja', title: 'Ensalada de hinojo, limón y zanahoria con jugo de naranja', cat: 'desayunos', t: [10, 10, 0], ph: 'g', sl: 'dm', th: 'fresco', tags: 'crudo', src: 'guía p.10', method: 'Ensamble',
  ing: [L('Hinojos', 'hinojo', null, null), L('Ralladura de limón', 'limon', null, null), L('Zanahoria', 'zanahoria', null, null), L('Jugo de naranja', 'naranja', null, null)],
  steps: ['Cortar el hinojo y rallar la zanahoria.', 'Mezclar con la ralladura de limón y el jugo de naranja.'], tip: null, note: null });

add({ id: 'jugo-manzana-mentolado', title: 'Jugo de manzana mentolado', cat: 'jugos', t: [5, 5, 0], ph: 'g', sl: 'dm', th: 'fresco', tags: 'sin-coccion', src: 'guía p.11', method: 'Juguera',
  ing: [L('3 manzanas verdes', 'manzana', 3, 'unidad'), L('¼ de cucharadita de canela', 'canela', 0.25, 'cdita'), L('Jugo de medio limón (se exprime aparte)', 'limon', 0.5, 'unidad'), L('Hojas de menta fresca', 'menta', null, null), L('3 rodajas de jengibre', 'jengibre', 3, 'rodaja')],
  steps: ['Hacerlo en juguera (vale licuadora: en ese caso se usan menos manzanas y el limón se exprime aparte).', 'También se puede pasar por la bolsa de leches vegetales exprimiéndolo.'],
  tip: 'Los jugos no son el desayuno indicado para quienes tienen síntomas de frío. Si rompés el ayuno con jugo, acompañalo con 6 almendras o nueces.', note: 'La guía escribe «1/4c de canela»: se interpretó como ¼ de cucharadita.' });

add({ id: 'licuado-verde-khalo', title: 'Licuado verde Khalo', cat: 'jugos', t: [5, 5, 0], ph: 'g', sl: 'dm', th: 'fresco', tags: 'sin-coccion', src: 'guía p.11', method: 'Licuado',
  ing: [L('1 kiwi', 'kiwi', 1, 'unidad'), L('Un puñado de cilantro', 'cilantro', 1, 'puñado'), L('Un chorro de jugo de limón', 'limon', null, null), L('Agua', 'agua', null, null)],
  steps: ['Licuar todo junto.'], tip: 'Si rompés el ayuno con jugo, acompañalo con 6 almendras o nueces.', note: null });

add({ id: 'licuado-refrescante', title: 'Licuado refrescante', cat: 'jugos', t: [5, 5, 0], ph: 'g', sl: 'dm', th: 'fresco', tags: 'sin-coccion', src: 'guía p.11', method: 'Licuado',
  ing: [L('Un puñado de frutillas', 'frutillas', 1, 'puñado'), L('½ pepino sin cáscara', 'pepino', 0.5, 'unidad'), L('Unas hojas de menta', 'menta', null, null), L('Agua si es necesario', 'agua', null, null, OPT)],
  steps: ['Licuar las frutillas con el pepino y la menta. Si es necesario, agregar agua.'], tip: null, note: null });

add({ id: 'jugo-antioxidante', title: 'Jugo antioxidante', cat: 'jugos', t: [5, 5, 0], ph: 'g', sl: 'dm', th: 'fresco', tags: 'sin-coccion', src: 'guía p.11', method: 'Juguera',
  ing: [L('2 manzanas', 'manzana', 2, 'unidad'), L('1 hinojo', 'hinojo', 1, 'unidad'), L('1 ramita de perejil', 'perejil', 1, 'unidad'), L('1 rodaja de jengibre', 'jengibre', 1, 'rodaja'), L('Jugo de medio limón', 'limon', 0.5, 'unidad')],
  steps: ['Hacer en juguera. También puede hacerse en licuadora agregando un poco de agua, usando menos manzana o pasándolo por bolsa de leches vegetales.'],
  tip: 'Si rompés el ayuno con jugo, acompañalo con 6 almendras o nueces.', note: null });

add({ id: 'tostadas-con-topes', title: 'Tostadas con topes', cat: 'desayunos', t: [10, 10, 0], ph: 'g', sl: 'dm', th: null, tags: 'cocido', src: 'guía p.8-9', method: 'Tostado',
  ing: [L('Tostadas de pan de centeno puro de masa madre', 'pan_centeno', null, null), L('Alternativa: pan de quinoa y amaranto o pan de trigo sarraceno', 'pan_sarraceno', null, null, OPT), L('Alternativa: galletitas de arroz yamaní o de harina de arroz del recetario, o de semillas', 'galletas_arroz', null, null, OPT),
    L('Palta pisada o en rodajas', 'palta', null, null, OPT), L('Sal y limón', 'limon', null, null, OPT), L('Chucrut o kimchi', 'chucrut', null, null, OPT), L('Un toque de pimienta negra', 'pimienta', null, null, OPT), L('Lámina de miel', 'miel', null, null, OPT),
    L('Tomate (pan y tomaquet)', 'tomate', null, null, OPT), L('Ajo (pan y tomaquet)', 'ajo', null, null, OPT), L('Aceite de oliva si lo deseás', 'aceite_oliva', null, null, OPT)],
  steps: ['Tostar el pan o elegir las galletas del recetario.', 'Elegir un tope: palta pisada o en rodajas con sal, limón y chucrut o kimchi o un toque de pimienta negra; lámina de miel; pan y tomaquet; untable casero de tofu (no usarlo diariamente); humus de porotos mung; babaganoush; untable de hinojo; queso de castañas.',
    'Pan y tomaquet: tostar el pan, frotar un ajo sobre su superficie y después frotar un tomate cortado al medio para que largue su pulpa; sal, pimienta y, si querés, oliva.'],
  tip: 'Galletas comerciales: marcas de semillas deshidratadas tipo pan esenio, o de arroz (no «crackines» ni «molinos»).', note: 'Es una ficha de combinaciones; los ingredientes son opcionales salvo el pan.' });

add({ id: 'anana-con-menta', title: 'Rodajas de ananá con menta', cat: 'desayunos', t: [5, 5, 0], ph: 'g', sl: 'm', th: 'fresco', tags: 'crudo', src: 'guía p.19', method: 'Corte',
  ing: [L('Rodajas de ananá con el centro', 'anana', null, null), L('Menta picada finita', 'menta', null, null)],
  steps: ['Cortar el ananá en rodajas con el centro.', 'Espolvorear con menta picada finita.'], tip: null, note: null });

add({ id: 'bowl-arroz-rawmesan', title: 'Bowl de arroz con rawmesan o gomasio', cat: 'almuerzos', t: [5, 5, 0], ph: 'g', sl: 'm', th: 'calido', tags: 'cocido', src: 'guía p.20', method: 'Ensamble',
  ing: [L('Arroz integral cocido', 'arroz_yamani', null, null), L('Mix de semillas tipo rawmesan (ver receta) o gomasio', 'mix_rawmesan', null, null)],
  steps: ['Servir el arroz tibio en un bowl.', 'Espolvorear con el mix de semillas tipo rawmesan o con gomasio.'], tip: null, note: null });

add({ id: 'agua-de-lino', title: 'Agua de lino', cat: 'infusiones', t: [5, 5, 480], ph: 'mg', sl: 'd', th: 'neutro', tags: 'sin-coccion', src: 'guía p.7', method: 'Remojo',
  ing: [L('1 cucharada de semillas de lino', 'semillas_lino', 1, 'cda'), L('1 taza de agua caliente', 'agua', 1, 'taza')],
  steps: ['Poner 1 cucharada de semillas de lino en remojo con 1 taza de agua caliente.', 'Dejar reposar durante la noche.', 'Beber a la mañana.'],
  tip: 'Es el quinto escalón de la escalera para la constipación (ver SOS). Con flojera intestinal o diarrea, evitar el lino.', note: null });

module.exports = { N };
