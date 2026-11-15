/* Detox de Primavera v2 — recetario (GENERADO por v2/tools/build-recipes.js; editar las capas de v2/tools/, no este archivo).
   73 recetas de v1 (mismos ids) con ingredientes estructurados + preparaciones del menú de la guía que v1 no traía.
   time.total/active en minutos; time.wait = espera pasiva (remojo, leudado, fermentación) en minutos; timeEstimated = tiempo estimado por el equipo.
   steps[].timer en segundos (rango «5 a 10 min» → el menor). allergens: curados desde los ingredientes OBLIGATORIOS del catálogo; mayContain: alérgenos que aparecen solo en ingredientes opcionales o alternativas.
   ingredients[].suggested = cantidad propuesta por el equipo (la guía no la da); steps[].editorial = paso, tiempo o temperatura que no viene de la guía;
   ingredients[].choice = «elegir entre varios» sin ingrediente de catálogo (choiceCategory = categoría de ingrediente que lo cubre en la heladera); servings siempre estimado por el equipo (servingsEstimated). */
(function (root) {
  'use strict';
  root.DX = root.DX || {};
  root.DX.recipes = [
    {
      id: "caldo-detox", title: "Caldo Détox Alcalinizante", category: "caldos",
      time: {"total":35,"active":10}, method: "Hervido suave tapado", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "4 pencas de apio cortadas", qty: 4, unit: "penca", item: "apio", role: "principal", optional: false },
        { text: "2 dientes de ajo enteros aplastados", qty: 2, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "1 a 2 puerros cortados", qty: 1, qtyMax: 2, unit: "unidad", item: "puerro", role: "principal", optional: false },
        { text: "1/2 alcaucil (si hay en estación)", qty: 0.5, unit: "unidad", item: "alcaucil", role: "principal", optional: true },
        { text: "1 taza de repollo blanco en tiras", qty: 1, unit: "taza", item: "repollo", role: "principal", optional: false },
        { text: "1 o 2 zanahorias en rodajas", qty: 1, qtyMax: 2, unit: "unidad", item: "zanahoria", role: "principal", optional: false },
        { text: "1 puñado de perejil fresco", qty: 1, unit: "puñado", item: "perejil", role: "condimento", optional: false },
        { text: "1 manzana entera con corazón y semillas", qty: 1, unit: "unidad", item: "manzana", role: "principal", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Colocar todas las verduras y la manzana en una olla grande.", timer: null },
        { text: "Llenar con agua fría duplicando holgadamente el volumen de los vegetales (unos 5 cm por encima).", timer: null },
        { text: "Hervir tapado a fuego mínimo durante 35-40 minutos hasta que el caldo tome color y sabor profundo.", timer: 2100, editorial: true },
        { text: "Colar el líquido y descartar las verduras (o usarlas para compost).", timer: null },
        { text: "Tomar caliente o tibio a lo largo del día o antes de las comidas.", timer: null }
      ],
      tip: "Se toma solo el caldo: se cuelan las verduras. También sirve de base para sopas.", allergens: ["apio"], mayContain: [],
      phases: ["monodieta","general"], slots: ["almuerzo","merienda","cena"], thermal: "calido",
      tags: ["cocido","batch","friolento-ok"], limits: null,
      source: "guía p.7 y p.30", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "nituke-manzana", title: "Nituke de Manzana (Desayuno / Merienda)", category: "desayunos",
      time: {"total":40,"active":5}, method: "Nituke", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "3 o 4 manzanas rojas o verdes peladas y en cubos", qty: 3, qtyMax: 4, unit: "unidad", item: "manzana", role: "principal", optional: false, suggested: true },
        { text: "2 cucharadas soperas de agua", qty: 2, unit: "cda", item: "agua", role: "basico", optional: false },
        { text: "1 pizca de sal marina", qty: 1, unit: "pizca", item: "sal_marina", role: "condimento", optional: false },
        { text: "Opcional para acompañar: almendras tostadas picadas, semillas de lino molidas o nueces picadas", qty: null, unit: null, item: "almendras", role: "principal", optional: true }
      ],
      steps: [
        { text: "Calentar una cacerola de fondo grueso que tape herméticamente con 2 cucharadas soperas de agua.", timer: null },
        { text: "Incorporar las manzanas peladas y cortadas con la pizca de sal marina.", timer: null },
        { text: "Tapar bien y poner a fuego mínimo pelusa (usar difusor de calor si es necesario).", timer: null },
        { text: "Cocinar durante 40 minutos sin destapar continuamente; chequear que no se pegue.", timer: 2400 },
        { text: "Cuanto más tiempo se cocine más dulce queda. Servir tibio con almendras o lino molido.", timer: null }
      ],
      tip: "Cuanto más tiempo lo dejás, más dulce queda, hasta llegar a consistencia de mermelada. Al ser una opción cocida, les va bien a las personas friolentas.", allergens: [], mayContain: ["frutos_secos","semillas"],
      phases: ["monodieta","general"], slots: ["desayuno","merienda"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.5 y p.9", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "hummus-mung", title: "Hummus de Porotos Mung", category: "dips",
      time: {"total":15,"active":15}, method: "Procesado en frío", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "2 tazas de porotos mung cocidos tiernos (remojados la noche anterior y hervidos 35 min)", qty: 2, unit: "taza", item: "porotos_mung", role: "principal", optional: false, suggested: true },
        { text: "1 diente de ajo pequeño", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "1 puñado de hojas de albahaca fresca", qty: 1, unit: "puñado", item: "albahaca", role: "condimento", optional: false },
        { text: "1 cucharada sopera de aceite de oliva crudo", qty: 1, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "Gotitas de jugo de limón fresco", qty: null, unit: null, item: "limon", role: "condimento", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Caldo de cocción de los porotos mung (cantidad necesaria)", qty: null, unit: null, item: "liquido_coccion", role: "basico", optional: false }
      ],
      steps: [
        { text: "Colocar los porotos mung cocidos en la procesadora o vaso de licuadora.", timer: null },
        { text: "Agregar el ajo, la albahaca, el aceite de oliva, el limón y la sal marina.", timer: null },
        { text: "Procesar incorporando el caldo de cocción reservado de a poco hasta obtener una pasta untable cremosa.", timer: null },
        { text: "Servir con un chorrito de oliva crudo y páprika o sésamo por encima.", timer: null }
      ],
      tip: "No tirar el líquido de cocción de los porotos mung: se usa para armar la pasta.", allergens: ["citricos","legumbres"], mayContain: ["semillas","sesamo"],
      phases: ["general"], slots: ["desayuno","almuerzo","merienda"], thermal: null,
      tags: ["sin-coccion","batch","rapida"], limits: null,
      source: "guía p.31", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "mayonesa-zanahoria", title: "Mayonesa Suave de Zanahoria", category: "dips",
      time: {"total":20,"active":10}, method: "Hervido + Procesado", servings: 6, servingsEstimated: true,
      ingredients: [
        { text: "4 zanahorias peladas", qty: 4, unit: "unidad", item: "zanahoria", role: "principal", optional: false },
        { text: "1 trozo pequeño de zapallo anco (aporta cremosidad)", qty: 1, unit: "trozo", item: "calabaza_anco", role: "principal", optional: false },
        { text: "1/2 puerro o trozo de cebolla", qty: 0.5, unit: "unidad", item: "puerro", role: "principal", optional: false, suggested: true },
        { text: "1 diente de ajo", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "1 cucharada de aceite de oliva crudo", qty: 1, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "Abundante jugo de limón fresco", qty: null, unit: null, item: "limon", role: "condimento", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Opcional: 3 o 4 aceitunas negras descarozadas", qty: 3, qtyMax: 4, unit: "unidad", item: "aceitunas_negras", role: "condimento", optional: true, suggested: true },
        { text: "Alternativa a las aceitunas: 1 puñado de pasas de uva", qty: 1, unit: "puñado", item: "pasas_uva", role: "condimento", optional: true, suggested: true }
      ],
      steps: [
        { text: "Hervir las zanahorias, zapallo y puerro desde agua fría hasta que estén super tiernos.", timer: null },
        { text: "Reservar el líquido de cocción (¡es muy dulce y sabroso!).", timer: null },
        { text: "Procesar las verduras con el ajo, aceite de oliva, limón, sal y el líquido de cocción necesario para emulsionar.", timer: null },
        { text: "Guardar en frasco de vidrio en heladera hasta por 4 días.", timer: null, editorial: true }
      ],
      tip: "Excelente aliño diluido con más limón para ensaladas de hojas amargas.", allergens: ["citricos"], mayContain: [],
      phases: ["general"], slots: ["desayuno","almuerzo","merienda"], thermal: null,
      tags: ["cocido","batch","rapida"], limits: null,
      source: "guía p.31", note: "La guía acepta «pasas de uva o aceitunas negras»; la v1 solo listaba aceitunas.",
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "babaganoush", title: "Babaganoush Ahumado sin Aceite Cocido", category: "dips",
      time: {"total":25,"active":15}, method: "Asado a la llama", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "2 berenjenas medianas enteras", qty: 2, unit: "unidad", item: "berenjena", role: "principal", optional: false },
        { text: "1/2 diente de ajo rallado", qty: 0.5, unit: "diente", item: "ajo", role: "condimento", optional: false, suggested: true },
        { text: "Jugo de 1/2 limón", qty: 0.5, unit: "unidad", item: "limon", role: "condimento", optional: false, suggested: true },
        { text: "1 cucharada de aceite de oliva virgen extra en crudo", qty: 1, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false, suggested: true },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "1 pizca de comino", qty: 1, unit: "pizca", item: "comino", role: "condimento", optional: false, suggested: true }
      ],
      steps: [
        { text: "Colocar las berenjenas directo sobre el fuego de la hornalla, rotándolas con pinza hasta carbonizar la piel por completo y sentirlas blandas.", timer: null },
        { text: "Meter en una bolsa limpia cerrada unos 10 minutos para que el vapor ayude a desprender la piel.", timer: 600, editorial: true },
        { text: "Pelar retirando los restos carbonizados y quedándose con la pulpa suave.", timer: null },
        { text: "Pisar con tenedor junto con el ajo, limón, sal marina y oliva crudo.", timer: null }
      ],
      tip: null, allergens: ["citricos"], mayContain: [],
      phases: ["general"], slots: ["desayuno","almuerzo","merienda"], thermal: null,
      tags: ["cocido"], limits: null,
      source: "guía p.32", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "queso-caju", title: "Queso Untable de Castañas de Cajú", category: "dips",
      time: {"total":10,"active":10,"wait":480}, method: "Remojo + Licuado", servings: 6, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de castañas de cajú crudas sin sal (remojadas 8 hs)", qty: 1, unit: "taza", item: "castanas_caju", role: "principal", optional: false },
        { text: "1/4 a 1/2 taza de agua limpia de filtro", qty: 0.25, qtyMax: 0.5, unit: "taza", item: "agua", role: "basico", optional: false, suggested: true },
        { text: "1 pizca de sal marina", qty: 1, unit: "pizca", item: "sal_marina", role: "condimento", optional: false },
        { text: "Gotitas de limón", qty: null, unit: null, item: "limon", role: "condimento", optional: false },
        { text: "Opcional: Levadura nutricional o hierbas frescas picadas", qty: null, unit: null, item: "levadura_nutricional", role: "condimento", optional: true }
      ],
      steps: [
        { text: "Desechar el agua de remojo de las castañas de cajú.", timer: null },
        { text: "Licuar a potencia máxima con el agua fresca, sal y limón hasta que no queden grumos y parezca queso crema.", timer: null },
        { text: "Guardar en frasco cerrado en la heladera hasta por 5 días.", timer: null, editorial: true }
      ],
      tip: "Para una versión fermentada, ver el untable de cajú fermentado.", allergens: ["frutos_secos","citricos"], mayContain: [],
      phases: ["general"], slots: ["desayuno","almuerzo","merienda"], thermal: null,
      tags: ["sin-coccion","rapida"], limits: null,
      source: "guía p.33", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "galletas-yamani", title: "Maravillosas Galletas de Arroz Yamaní", category: "panificados",
      time: {"total":30,"active":15}, method: "Horno 180°C", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de arroz yamaní cocido pasado (1 taza arroz x 3 de agua)", qty: 1, unit: "taza", item: "arroz_yamani", role: "principal", optional: false },
        { text: "1 taza de harina de arroz integral", qty: 1, unit: "taza", item: "harina_arroz_integral", role: "principal", optional: false },
        { text: "4 cucharadas de semillas de lino", qty: 4, unit: "cda", item: "semillas_lino", role: "condimento", optional: false },
        { text: "2 cucharadas de aceite de oliva", qty: 2, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "Chorrito de agua tibia (apenas para unir)", qty: null, unit: null, item: "agua", role: "basico", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Hierbas secas a gusto (orégano, tomillo) o cúrcuma", qty: null, unit: null, item: "oregano", role: "condimento", optional: true }
      ],
      steps: [
        { text: "Amasar el arroz cocido con las manos para que libere el almidón y se pegotee.", timer: null },
        { text: "Mezclar con la harina de arroz, lino, aceite, sal y condimentos.", timer: null },
        { text: "Agregar apenas el agua necesaria para armar una masa unida.", timer: null },
        { text: "Formar bolitas pequeñas y aplastarlas bien finitas sobre placa para horno con papel o silicona.", timer: null },
        { text: "Hornear a 180°C durante 10-12 minutos hasta que estén doradas y crocantes.", timer: 600, editorial: true }
      ],
      tip: "Reemplazo crujiente ideal para las tostadas industriales de paquete.", allergens: ["semillas"], mayContain: [],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: null,
      tags: ["cocido"], limits: null,
      source: "guía p.36", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "pan-centeno-masamadre", title: "Pan de Centeno 100% de Masa Madre", category: "panificados",
      time: {"total":50,"active":20,"wait":900}, method: "Fermentación natural y horneado", servings: 12, servingsEstimated: true,
      ingredients: [
        { text: "1 kg de harina de centeno integral pura", qty: 1, unit: "kg", item: "harina_centeno_integral", role: "principal", optional: false },
        { text: "2 tazas de fermento de masa madre activo", qty: 2, unit: "taza", item: "masa_madre", role: "principal", optional: false },
        { text: "1 cucharada colmada de sal marina", qty: 1, unit: "cda", item: "sal_marina", role: "condimento", optional: false },
        { text: "800 ml de agua tibia", qty: 800, unit: "ml", item: "agua", role: "basico", optional: false }
      ],
      steps: [
        { text: "Mezclar la harina con la sal marina e integrar el fermento y el agua.", timer: null },
        { text: "Amasar (queda una textura pegajosa típica del centeno).", timer: null },
        { text: "Dejar levar entre 8 y 12 horas en bowl cubierto a temperatura ambiente.", timer: null },
        { text: "Dar forma a dos panes de molde aceitados y dejar reposar 2 horas más.", timer: 7200, editorial: true },
        { text: "Hornear a fuego medio (180°C) durante 50 minutos. Está listo cuando suena hueco al golpear la base.", timer: 3000, editorial: true }
      ],
      tip: "Si no tenés tiempo para hornearlo, compralo en locales como Hausbrot o Le Pain Quotidien, cortalo en rodajas y freezalo.", allergens: ["gluten"], mayContain: [],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: null,
      tags: ["cocido","fermento"], limits: null,
      source: "guía p.37-38", note: "La guía lo ofrece «solo para curiosos»; la masa madre se prepara aparte (3 a 7 días).",
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "chucrut-casero", title: "Chucrut Probiótico Vivo", category: "fermentos",
      time: {"total":20,"active":20,"wait":30240}, method: "Fermentación láctica anaeróbica", servings: null,
      ingredients: [
        { text: "1 repollo agroecológico (blanco o morado)", qty: 1, unit: "unidad", item: "repollo", role: "principal", optional: false },
        { text: "Sal marina o rosa, no yodada: 20 a 25 g por cada kilo de repollo picado (2 a 2,5 %)", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Retirar y reservar intactas un par de hojas externas limpias del repollo.", timer: null },
        { text: "Picar el repollo muy finito en tiras y pesarlo.", timer: null },
        { text: "Pesar el 2% de sal marina correspondiente y mezclar con el repollo picado.", timer: null },
        { text: "Amasar intensamente con las manos durante 5-8 minutos hasta que libere abundante líquido (salmuera propia).", timer: null, editorial: true },
        { text: "Envasar en frasco de vidrio bien limpio, empujando con el puño para que no queden burbujas de aire.", timer: null },
        { text: "Cubrir con las hojas exteriores reservadas y poner un peso para que todo quede sumergido bajo el líquido.", timer: null },
        { text: "Tapar y dejar fermentar en oscuridad a temperatura ambiente por 21 a 28 días antes de llevar a heladera.", timer: null }
      ],
      tip: "La guía lo lista entre los toppings para sumar a las comidas, a la palta y a las tostadas. Una vez listo, se guarda en la heladera.", allergens: [], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["crudo","fermento","batch","rapida","caluroso-ok"], limits: null,
      source: "guía p.35-36", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "leche-almendras", title: "Leche Fresca de Almendras", category: "leches",
      time: {"total":10,"active":10,"wait":480}, method: "Licuado + Filtrado en tela", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "100 g de almendras crudas (remojadas 8 a 12 hs)", qty: 100, unit: "g", item: "almendras", role: "principal", optional: false, suggested: true },
        { text: "1 litro de agua de filtro limpia", qty: 1, unit: "l", item: "agua", role: "basico", optional: false },
        { text: "Opcional: pizca de sal marina", qty: 1, unit: "pizca", item: "sal_marina", role: "condimento", optional: true, suggested: true },
        { text: "Opcional: canela", qty: null, unit: null, item: "canela", role: "condimento", optional: true }
      ],
      steps: [
        { text: "Tirar el agua de remojo de las almendras.", timer: null },
        { text: "Poner las almendras en licuadora con el litro de agua fresca.", timer: null },
        { text: "Licuar a potencia máxima durante 2 minutos hasta que el líquido quede blanco y cremoso.", timer: null },
        { text: "Colar a través de una bolsa de tela para leches vegetales o colador ultra fino, apretando bien la pulpa.", timer: null },
        { text: "Guardar en botella de vidrio tapada en la heladera por 4 a 5 días.", timer: null }
      ],
      tip: "La pulpa sobrante (bagazo) se puede hornear para hacer galletas o sumar a masas.", allergens: ["frutos_secos"], mayContain: [],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: null,
      tags: ["sin-coccion","batch","rapida"], limits: null,
      source: "guía p.30", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "bowl-yamani-cruciferas", title: "Bowl Alcalino de Yamaní y Crucíferas", category: "almuerzos",
      time: {"total":25,"active":10}, method: "Vapor + Ensamble", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de arroz yamaní cocido caliente", qty: 1, unit: "taza", item: "arroz_yamani", role: "principal", optional: false, suggested: true },
        { text: "1 taza de ramilletes de brócoli al vapor (5 min)", qty: 1, unit: "taza", item: "brocoli", role: "principal", optional: false, suggested: true },
        { text: "1 taza de coliflor al vapor (6 min)", qty: 1, unit: "taza", item: "coliflor", role: "principal", optional: false, suggested: true },
        { text: "1/2 taza de porotos mung cocidos", qty: 0.5, unit: "taza", item: "porotos_mung", role: "principal", optional: false, suggested: true },
        { text: "1/4 de palta en láminas", qty: 0.25, unit: "unidad", item: "palta", role: "principal", optional: false, suggested: true },
        { text: "1 cucharadita de chucrut vivo", qty: 1, unit: "cdita", item: "chucrut", role: "condimento", optional: false, suggested: true },
        { text: "1 cucharada de aceite de oliva crudo", qty: 1, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false, suggested: true },
        { text: "Gotas de salsa Shoyu MOA", qty: null, unit: null, item: "shoyu", role: "condimento", optional: false },
        { text: "Jugo de limón a gusto", qty: null, unit: null, item: "limon", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Disponer el arroz yamaní tibio en la base de un bowl amplio.", timer: null },
        { text: "Acomodar a los lados el brócoli, coliflor y porotos mung.", timer: null },
        { text: "Sumar la palta fresca y la cucharada de chucrut vivo al costado.", timer: null },
        { text: "Rociar con el aceite de oliva, la salsa Shoyu MOA y el jugo de limón antes de servir.", timer: null }
      ],
      tip: "Siempre mejor más proporción de verduras que de cereal o legumbre.", allergens: ["soja","citricos","legumbres"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","batch","friolento-ok"], limits: null,
      source: "guía p.6, p.25 y p.29", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "leche-caju", title: "Leche Fresca de Castañas de Cajú al Instante", category: "leches",
      time: {"total":5,"active":5}, method: "Licuado en frío sin filtro", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "100 g de castañas de cajú crudas (no tostadas, sin sal)", qty: 100, unit: "g", item: "castanas_caju", role: "principal", optional: false, suggested: true },
        { text: "1 litro de agua pura de filtro a temperatura ambiente", qty: 1, unit: "l", item: "agua", role: "basico", optional: false },
        { text: "Opcional: 1 pizca de sal marina", qty: 1, unit: "pizca", item: "sal_marina", role: "condimento", optional: true, suggested: true },
        { text: "Opcional: canela pura", qty: null, unit: null, item: "canela", role: "condimento", optional: true }
      ],
      steps: [
        { text: "Colocar las castañas de cajú directamente en la licuadora (el cajú es el único fruto seco que puede prescindir del remojo previo y de la bolsa de filtrado si se dispone de una licuadora potente).", timer: null },
        { text: "Incorporar 1 litro de agua pura de filtro.", timer: null },
        { text: "Licuar a potencia máxima durante 2 minutos continuos hasta obtener una emulsión blanca, sedosa y uniforme.", timer: null },
        { text: "Verter directamente en una botella de vidrio limpia sin necesidad de pasar por filtro de tela.", timer: null },
        { text: "Tapar y conservar en la heladera durante 4 a 5 días. Agitar enérgicamente antes de servir.", timer: null }
      ],
      tip: "Es la única leche vegetal que puede prescindir del remojo y del filtro (si la licuadora es potente).", allergens: ["frutos_secos"], mayContain: [],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: null,
      tags: ["sin-coccion","rapida"], limits: null,
      source: "guía p.30", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "queso-crema-tofu", title: "Queso Crema de Tofu Orgánico", category: "dips",
      time: {"total":35,"active":15}, method: "Hervido suave + Procesado en caliente", servings: 6, servingsEstimated: true,
      ingredients: [
        { text: "250 g de tofu firme orgánico certificado (marca Soyana)", qty: 250, unit: "g", item: "tofu", role: "principal", optional: false, suggested: true },
        { text: "3 cucharadas soperas de aceite de oliva extra virgen en crudo", qty: 3, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false, suggested: true },
        { text: "2 a 3 cucharadas de agua pura o caldo de hervor del tofu", qty: 2, qtyMax: 3, unit: "cda", item: "agua", role: "basico", optional: false, suggested: true },
        { text: "1 cucharada sopera de semillas de sésamo integral tostadas", qty: 1, unit: "cda", item: "semillas_sesamo", role: "condimento", optional: false, suggested: true },
        { text: "1 cucharadita de sal marina", qty: 1, unit: "cdita", item: "sal_marina", role: "condimento", optional: false, suggested: true },
        { text: "O bien 1 cucharada de salsa de soja natural (Shoyu MOA) en lugar de la sal", qty: 1, unit: "cda", item: "shoyu", role: "condimento", optional: true, suggested: true },
        { text: "Opcional: cebollín fresco picado fino", qty: null, unit: null, item: "cebolla_verdeo", role: "condimento", optional: true },
        { text: "Opcional: pimentón dulce", qty: null, unit: null, item: "pimenton", role: "condimento", optional: true },
        { text: "Opcional: 1 cucharada de levadura de cerveza", qty: 1, unit: "cda", item: "levadura_cerveza", role: "condimento", optional: true, suggested: true }
      ],
      steps: [
        { text: "Hervir el bloque de tofu entero en abundante agua hirviendo durante 30 minutos continuos para predigerir sus proteínas vegetales y suavizar el sabor.", timer: 1800, editorial: true },
        { text: "Retirar del agua caliente y escurrir.", timer: null },
        { text: "Cortar en cubos y colocar en el vaso de la procesadora o licuadora.", timer: null },
        { text: "Incorporar el aceite de oliva extra virgen, el sésamo tostado, la sal marina (o salsa Shoyu MOA) y las cucharadas de agua.", timer: null },
        { text: "Procesar a velocidad alta hasta emulsionar en una pasta untable cremosa, lisa y homogénea.", timer: null },
        { text: "Sumar cebollín fresco, pimentón dulce o levadura nutricional según la variante elegida y revolver.", timer: null },
        { text: "Envasar en frasco de vidrio hermético y refrigerar hasta por 4 días.", timer: null, editorial: true }
      ],
      tip: "Usar tofu de soja orgánica (la guía nombra la marca Soyana) y hervirlo antes de procesarlo. No usarlo diariamente.", allergens: ["semillas","sesamo","soja"], mayContain: ["gluten"],
      phases: ["general"], slots: ["desayuno","almuerzo","merienda"], thermal: null,
      tags: ["cocido"], limits: {"perWeek":3},
      source: "guía p.31", note: "La guía aclara que el tofu «no se usa diariamente». El tope semanal es un criterio editorial (3 veces).",
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "untable-hinojo-citricos", title: "Untable Fresco de Hinojo y Cítricos", category: "dips",
      time: {"total":10,"active":10}, method: "Procesado en frío", servings: 6, servingsEstimated: true,
      ingredients: [
        { text: "1 bulbo de hinojo mediano (sin las capas externas fibrosas, trozado)", qty: 1, unit: "bulbo", item: "hinojo", role: "principal", optional: false },
        { text: "1 trozo de puerro de 7,5 cm (solo la parte blanca y verde claro, picada)", qty: 1, unit: "trozo", item: "puerro", role: "principal", optional: false },
        { text: "1/4 taza de castañas de cajú crudas", qty: 0.25, unit: "taza", item: "castanas_caju", role: "principal", optional: false, suggested: true },
        { text: "5 cucharadas soperas de aceite de oliva extra virgen", qty: 5, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "3 cucharadas soperas de jugo fresco de lima o limón", qty: 3, unit: "cda", item: "lima", role: "condimento", optional: false },
        { text: "1/2 diente de ajo fresco", qty: 0.5, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "1 cucharadita de sal marina fina", qty: 1, unit: "cdita", item: "sal_marina", role: "condimento", optional: false, suggested: true },
        { text: "Opcional: 1 cucharadita de levadura nutricional", qty: 1, unit: "cdita", item: "levadura_nutricional", role: "condimento", optional: true },
        { text: "Opcional: unas gotas de salsa de soja", qty: null, unit: null, item: "shoyu", role: "condimento", optional: true },
        { text: "Variación: ½ taza de hojas frescas de cilantro", qty: 0.5, unit: "taza", item: "cilantro", role: "condimento", optional: true, suggested: true },
        { text: "Variación: ½ taza de hojas frescas de menta", qty: 0.5, unit: "taza", item: "menta", role: "condimento", optional: true }
      ],
      steps: [
        { text: "Lavar y descartar las capas duras del hinojo, cortando el bulbo en pedazos medianos.", timer: null },
        { text: "Colocar en la licuadora el hinojo, el puerro, las castañas de cajú y el medio ajo.", timer: null },
        { text: "Agregar el aceite de oliva extra virgen, el jugo de lima y la sal marina fina.", timer: null },
        { text: "Licuar a potencia media-alta, deteniendo el motor para bajar las paredes con una espátula de silicona.", timer: null },
        { text: "Si se eligen las hierbas frescas (cilantro y menta), sumarlas al final y procesar brevemente para no recalentarlas.", timer: null },
        { text: "Trasladar a frasco de vidrio hermético y mantener en la heladera hasta por 3 días.", timer: null, editorial: true }
      ],
      tip: null, allergens: ["frutos_secos","citricos"], mayContain: ["soja"],
      phases: ["general"], slots: ["desayuno","almuerzo","merienda"], thermal: null,
      tags: ["sin-coccion","rapida"], limits: null,
      source: "guía p.31", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "pasta-remolacha-aduki", title: "Pasta de Remolachas y Porotos Aduki", category: "dips",
      time: {"total":15,"active":15}, method: "Vapor + Procesado", servings: 6, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de porotos aduki cocidos tiernos (reservando su líquido de cocción)", qty: 1, unit: "taza", item: "porotos_aduki", role: "principal", optional: false },
        { text: "1 remolacha grande cocida al vapor con cáscara hasta tiernizar y pelada", qty: 1, unit: "unidad", item: "remolacha", role: "principal", optional: false },
        { text: "1/2 diente de ajo fresco", qty: 0.5, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "1 cucharada sopera de aceite de oliva extra virgen en crudo", qty: 1, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "1 chorrito de salsa de soja natural Shoyu MOA", qty: 1, unit: "unidad", item: "shoyu", role: "condimento", optional: false },
        { text: "1 pizca de comino molido", qty: 1, unit: "pizca", item: "comino", role: "condimento", optional: false, suggested: true },
        { text: "Caldo de cocción de los aduki (cantidad necesaria para dar untuosidad)", qty: null, unit: null, item: "liquido_coccion", role: "basico", optional: false }
      ],
      steps: [
        { text: "Pelar la remolacha cocida al vapor y cortarla en cuartos.", timer: null },
        { text: "Colocar en la procesadora o jarra de minipimmer los porotos aduki escurridos y la remolacha.", timer: null },
        { text: "Sumar el ajo machacado, el comino molido, el aceite de oliva y el chorrito de Shoyu MOA.", timer: null },
        { text: "Procesar incorporando cucharadas del caldo caliente de los aduki hasta obtener una pasta untable suave y brillante.", timer: null },
        { text: "Ajustar de sal marina y reservar en frasco hermético en la heladera.", timer: null }
      ],
      tip: null, allergens: ["soja","legumbres"], mayContain: [],
      phases: ["general"], slots: ["desayuno","almuerzo","merienda"], thermal: null,
      tags: ["cocido","rapida"], limits: null,
      source: "guía p.32", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "pesto-hongos", title: "Pesto Rústico de Hongos Portobello y Rúcula", category: "dips",
      time: {"total":15,"active":15}, method: "Plancha seca + Picado rústico", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "250 g de hongos portobello o champiñones frescos cortados en mitades o cuartos", qty: 250, unit: "g", item: "hongos_champi", role: "principal", optional: false, suggested: true },
        { text: "1 taza colmada de hojas de rúcula fresca lavada y escurrida", qty: 1, unit: "taza", item: "rucula", role: "principal", optional: false, suggested: true },
        { text: "1 diente de ajo finamente picado", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "3 cucharadas soperas de aceite de oliva extra virgen en crudo", qty: 3, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false, suggested: true },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Pimienta negra recién molida a gusto", qty: null, unit: null, item: "pimienta", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Calentar una sartén o plancha a fuego medio sin agregar absolutamente nada de aceite.", timer: null },
        { text: "Dorar los portobellos en seco por ambos lados hasta que tomen color tostado y queden tiernos.", timer: null },
        { text: "Retirar del fuego y picar finamente sobre la tabla junto con el diente de ajo y la rúcula fresca (o pulsar unos segundos en minipimmer).", timer: null },
        { text: "Pasar a un recipiente, sazonar con sal marina y pimienta negra recién molida.", timer: null },
        { text: "Incorporar el aceite de oliva extra virgen crudo integrando con cuchara para emulsionar los jugos.", timer: null },
        { text: "Servir a temperatura ambiente sobre vegetales al vapor, cereales integrales o galletas aptas.", timer: null }
      ],
      tip: null, allergens: [], mayContain: [],
      phases: ["general"], slots: ["desayuno","almuerzo","merienda"], thermal: null,
      tags: ["cocido","rapida"], limits: null,
      source: "guía p.32", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "queso-caju-tomillo", title: "Queso Firme de Cajú y Tomillo al Agar-Agar", category: "dips",
      time: {"total":20,"active":20,"wait":180}, method: "Cocción suave + Gelificación natural", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "100 g de castañas de cajú crudas (remojadas en agua limpia de 4 a 8 horas)", qty: 100, unit: "g", item: "castanas_caju", role: "principal", optional: false },
        { text: "300 ml de agua pura de filtro", qty: 300, unit: "ml", item: "agua", role: "basico", optional: false },
        { text: "1 cucharadita de sal marina fina", qty: 1, unit: "cdita", item: "sal_marina", role: "condimento", optional: false },
        { text: "1 cucharadita de ajo en polvo", qty: 1, unit: "cdita", item: "ajo", role: "condimento", optional: false },
        { text: "1 cucharadita de levadura de cerveza nutricional", qty: 1, unit: "cdita", item: "levadura_cerveza", role: "condimento", optional: false },
        { text: "1 cucharadita de agar-agar en polvo (alga gelificante natural)", qty: 1, unit: "cdita", item: "agar_agar", role: "condimento", optional: false },
        { text: "Jugo recién exprimido de 1/2 limón", qty: 0.5, unit: "unidad", item: "limon", role: "condimento", optional: false },
        { text: "Unas gotas de aceite de oliva para encamisar el molde", qty: null, unit: null, item: "aceite_oliva", role: "condimento", optional: false },
        { text: "Abundante tomillo seco o fresco para recubrir", qty: null, unit: null, item: "tomillo", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Desechar el agua de remojo de las castañas de cajú y escurrirlas bien.", timer: null },
        { text: "Colocar en la licuadora las castañas de cajú con los 300 ml de agua fresca, la sal, el ajo en polvo, la levadura nutricional, el agar-agar y el jugo de limón.", timer: null },
        { text: "Licuar a potencia máxima durante 2 minutos hasta lograr un líquido blanco completamente sedoso y liso.", timer: null },
        { text: "Volcar la preparación en una cacerolita a fuego medio y revolver continuamente con batidor de alambre.", timer: null },
        { text: "Cuando rompa hervor, bajar el fuego al mínimo y continuar revolviendo sin parar durante 2 minutos exactos para activar el agar-agar.", timer: 120 },
        { text: "Pincelar un bowl individual de vidrio con unas gotas de aceite de oliva y cubrir la base y paredes con abundante tomillo seco o fresco.", timer: null },
        { text: "Verter la mezcla caliente en el molde, emparejar la superficie y dejar enfriar a temperatura ambiente.", timer: null },
        { text: "Refrigerar durante al menos 3 a 4 horas hasta que cuaje firme; desmoldar antes de servir.", timer: 10800, editorial: true }
      ],
      tip: "El agar-agar es un alga espesante que se compra en dietética.", allergens: ["frutos_secos","gluten","citricos","algas"], mayContain: [],
      phases: ["general"], slots: ["desayuno","almuerzo","merienda"], thermal: null,
      tags: ["cocido","rapida"], limits: null,
      source: "guía p.32-33", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "untable-caju-basico", title: "Untable Básico de Castañas de Cajú", category: "dips",
      time: {"total":10,"active":10,"wait":480}, method: "Remojo + Licuado en frío", servings: 6, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de castañas de cajú crudas sin tostar ni salar", qty: 1, unit: "taza", item: "castanas_caju", role: "principal", optional: false },
        { text: "Agua pura de filtro para el remojo", qty: null, unit: null, item: "agua", role: "basico", optional: false },
        { text: "1/3 a 1/2 taza de agua limpia de filtro para el licuado", qty: 0.333, qtyMax: 0.5, unit: "taza", item: "agua", role: "basico", optional: false, suggested: true },
        { text: "1 pizca generosa de sal marina fina o sal del Himalaya", qty: 1, unit: "pizca", item: "sal_marina", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Cubrir las castañas de cajú con abundante agua y dejar en remojo durante la noche (8 a 12 horas).", timer: null, editorial: true },
        { text: "A la mañana siguiente desechar por completo el agua de remojo y enjuagar los frutos.", timer: null },
        { text: "Colocar las castañas en el vaso de la licuadora con la pizca de sal marina y un chorrito inicial de agua fresca de filtro.", timer: null },
        { text: "Licuar aumentando la velocidad progresivamente, incorporando agua en hilo de a poco hasta conformar una pasta densa, tersa y untable similar a un queso blanco.", timer: null },
        { text: "Traspasar a frasco de vidrio esterilizado y guardar en heladera bien tapado por 5 días.", timer: null, editorial: true }
      ],
      tip: "Desechar el líquido de remojo y guardar en un frasco hermético en la heladera.", allergens: ["frutos_secos"], mayContain: [],
      phases: ["general"], slots: ["desayuno","almuerzo","merienda"], thermal: null,
      tags: ["sin-coccion","batch","rapida"], limits: null,
      source: "guía p.33", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "untable-caju-fermentado", title: "Untable Probiótico de Cajú Fermentado", category: "fermentos",
      time: {"total":10,"active":10,"wait":360}, method: "Fermentación láctica activa", servings: 6, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de castañas de cajú crudas remojadas 8 horas y escurridas", qty: 1, unit: "taza", item: "castanas_caju", role: "principal", optional: false, suggested: true },
        { text: "1/3 taza de agua fresca de filtro", qty: 0.333, unit: "taza", item: "agua", role: "basico", optional: false, suggested: true },
        { text: "1 pizca de sal marina", qty: 1, unit: "pizca", item: "sal_marina", role: "condimento", optional: false, suggested: true },
        { text: "Iniciador probiótico (elegir uno): 1 cápsula de probióticos en polvo abierta, o 1 cucharada de kéfir de agua vivo, o 15 gotas de probiótico líquido Kyojin, o 1 cucharada de una tanda previa", qty: null, unit: null, item: "iniciador_probiotico", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Licuar las castañas remojadas con el agua fresca, la sal marina y el inoculante probiótico elegido hasta obtener una textura completamente lisa.", timer: null },
        { text: "Colocar la crema en un frasco de vidrio limpio, dejando al menos 3 cm libres debajo de la boca.", timer: null },
        { text: "Tapar el frasco con una servilleta de tela limpia o papel absorbente sujeto con una banda elástica para permitir el escape de gases.", timer: null },
        { text: "Dejar fermentar en un rincón oscuro a temperatura ambiente durante 6 a 8 horas en días templados (o 12 a 18 horas en invierno).", timer: 21600, editorial: true },
        { text: "Comprobar que la preparación haya adquirido una textura aireada, ligeramente espumosa y un aroma limpio y agradablemente ácido.", timer: null },
        { text: "Tapar con tapa hermética y llevar a la heladera para frenar la actividad. Reservar 1 cucharada para sembrar la siguiente tanda.", timer: null }
      ],
      tip: "Para no usar una cápsula cada vez, guardá una cucharada del untable y usala en lugar de la cápsula. Con kéfir, hay que incorporarlo cada vez.", allergens: ["frutos_secos"], mayContain: [],
      phases: ["general"], slots: ["desayuno","almuerzo","merienda"], thermal: null,
      tags: ["sin-coccion","fermento","rapida"], limits: null,
      source: "guía p.33", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "pickle-expres-rabanitos", title: "Pickle Exprés de Rabanitos a la Cúrcuma", category: "fermentos",
      time: {"total":15,"active":15,"wait":120}, method: "Maceración ácida rápida", servings: null,
      ingredients: [
        { text: "1 atado de rabanitos frescos y crujientes", qty: 1, unit: "atado", item: "rabanitos", role: "principal", optional: false, suggested: true },
        { text: "6 cucharadas soperas de vinagre de sidra de manzana crudo sin pasteurizar", qty: 6, unit: "cda", item: "vinagre_manzana", role: "condimento", optional: false },
        { text: "1 cucharadita de sal marina fina", qty: 1, unit: "cdita", item: "sal_marina", role: "condimento", optional: false },
        { text: "1 trozo de 5 cm de raíz de cúrcuma fresca rallada o pelada (o 1 cdita de cúrcuma pura en polvo)", qty: 1, unit: "trozo", item: "curcuma", role: "condimento", optional: false },
        { text: "1 pizca en la punta de una cuchara de pimienta negra molida", qty: 1, unit: "pizca", item: "pimienta", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Lavar los rabanitos eliminando hojas y raicillas.", timer: null },
        { text: "Rebanar los rabanitos en rodajas casi translúcidas con mandolina o cuchillo muy afilado.", timer: null },
        { text: "En un recipiente mezclar el vinagre de manzana vivo, la sal marina, la pimienta y la cúrcuma fresca machacada o rallada.", timer: null },
        { text: "Integrar los rabanitos asegurando que todos tomen contacto con el líquido dorado.", timer: null },
        { text: "Servir de inmediato o envasar en frasco de vidrio hermético refrigerado.", timer: null },
        { text: "Invertir el frasco pasadas 1 o 2 horas para que el líquido impregne de manera pareja y la cúrcuma tiña los rabanitos uniformemente.", timer: 3600, editorial: true },
        { text: "Dura en heladera en perfecto estado hasta por 2 semanas.", timer: null }
      ],
      tip: "Se puede servir enseguida o guardar hasta 2 semanas en un frasco cerrado en la heladera.", allergens: [], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "fresco",
      tags: ["crudo","rapida","caluroso-ok"], limits: null,
      source: "guía p.33", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "pickle-remolacha-nabo-lima", title: "Pickle Vivo de Remolacha, Nabo y Lima", category: "fermentos",
      time: {"total":15,"active":15}, method: "Maceración ácida enzimática", servings: null,
      ingredients: [
        { text: "1 nabo mediano de aproximadamente 340 g pelado", qty: 1, unit: "unidad", item: "nabo", role: "principal", optional: false },
        { text: "2 remolachas pequeñas de aproximadamente 100 g peladas", qty: 2, unit: "unidad", item: "remolacha", role: "principal", optional: false },
        { text: "1/4 taza de jugo fresco de lima recién exprimido", qty: 0.25, unit: "taza", item: "lima", role: "condimento", optional: false },
        { text: "1 cucharadita de sal marina fina", qty: 1, unit: "cdita", item: "sal_marina", role: "condimento", optional: false, suggested: true }
      ],
      steps: [
        { text: "Pelar el nabo y las dos remolachas crudas.", timer: null },
        { text: "Cortar ambos vegetales con mandolina en fetas ultrafinas y parejas.", timer: null },
        { text: "Disponer los vegetales en un cuenco amplio y rociar con el cuarto de taza de jugo de lima y la sal marina.", timer: null },
        { text: "Mezclar suavemente con las manos limpias para impregnar cada lámina.", timer: null },
        { text: "Servir tras unos minutos de maceración o conservar en frasco de vidrio en la heladera hasta por 2 semanas.", timer: null },
        { text: "El color fucsia carmesí de la remolacha se intensificará y teñirá el nabo a medida que descanse en frío.", timer: null }
      ],
      tip: "Se sirve enseguida o se guarda hasta 2 semanas en un frasco en la heladera; el color se intensifica a medida que se asienta.", allergens: ["citricos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "fresco",
      tags: ["crudo","rapida","caluroso-ok"], limits: null,
      source: "guía p.34", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "kimchi-artesanal", title: "Kimchi Tradicional de Akusay y Manzana", category: "fermentos",
      time: {"total":30,"active":30,"wait":4380}, method: "Fermentación anaeróbica láctica", servings: null,
      ingredients: [
        { text: "1 kg de col akusay (repollo chino)", qty: 1, unit: "kg", item: "akusay", role: "principal", optional: false },
        { text: "2 cucharadas soperas de sal marina sin aditivos ni yodo", qty: 2, unit: "cda", item: "sal_marina", role: "condimento", optional: false },
        { text: "100 g de morrón rojo picado fino", qty: 100, unit: "g", item: "morron", role: "principal", optional: false },
        { text: "300 g de manzana fresca rallada (verde o roja)", qty: 300, unit: "g", item: "manzana", role: "principal", optional: false, suggested: true },
        { text: "1 cucharadita de pimentón dulce", qty: 1, unit: "cdita", item: "pimenton", role: "condimento", optional: false, suggested: true },
        { text: "150 g de cebolla cortada en rodajas finas", qty: 150, unit: "g", item: "cebolla", role: "condimento", optional: false },
        { text: "50 g de bulbo de hinojo picado chiquito", qty: 50, unit: "g", item: "hinojo", role: "principal", optional: false },
        { text: "4 dientes de ajo frescos picados", qty: 4, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "25 g de raíz de jengibre fresco pelado y picado fino", qty: 25, unit: "g", item: "jengibre", role: "condimento", optional: false },
        { text: "Ají picante o copos de chile seco a gusto personal", qty: null, unit: null, item: "aji_picante", role: "condimento", optional: false },
        { text: "1 puñado de hojas frescas de cilantro picadas", qty: 1, unit: "puñado", item: "cilantro", role: "condimento", optional: false },
        { text: "1 puñado de hojas frescas de perejil picadas", qty: 1, unit: "puñado", item: "perejil", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Cortar el akusay en trozos de unos 3 a 4 cm.", timer: null },
        { text: "Colocar en un cuenco grande, espolvorear las 2 cucharadas de sal marina y masajear con las manos enérgicamente durante 3 minutos.", timer: 180, editorial: true },
        { text: "Dejar reposar durante 1 hora completa a temperatura ambiente para que ablande y libere abundante agua de vegetación.", timer: 3600 },
        { text: "Agregar al cuenco el morrón picado, la manzana rallada, el pimentón, la cebolla, el hinojo, el ajo, el jengibre, el ají picante, el cilantro y el perejil.", timer: null },
        { text: "Integrar todos los ingredientes amasando suavemente para repartir los jugos y sabores de forma homogénea.", timer: null },
        { text: "Envasar en frascos de vidrio limpios presionando hacia abajo con el puño cerrado para eliminar bolsas de aire y asegurar que las verduras queden sumergidas bajo su propio líquido.", timer: null },
        { text: "Cerrar la tapa y mantener a temperatura ambiente protegido de la luz solar durante 3 días para una fermentación láctica vigorosa.", timer: null },
        { text: "Llevar a la heladera; listo para consumir de inmediato o conservar hasta por 1 mes en frío.", timer: null }
      ],
      tip: "Después de 3 días a temperatura ambiente, guardarlo en la heladera o empezar a comerlo: dura 1 mes en la heladera.", allergens: [], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["crudo","fermento","caluroso-ok"], limits: null,
      source: "guía p.34", note: "Atención: la guía dice «3000 gr de manzana rallada» para 1 kg de akusay; parece un error de tipeo. Se usan 300 g como valor razonable. Verificar con Isa antes de preparar.",
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "galletas-harina-arroz", title: "Galletas Crocantes de Harina de Arroz Integral y Semillas", category: "panificados",
      time: {"total":30,"active":15}, method: "Horno 180°C", servings: 6, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de harina de arroz integral pura", qty: 1, unit: "taza", item: "harina_arroz_integral", role: "principal", optional: false },
        { text: "1 taza de harina de trigo sarraceno (o harina de avena arrollada sin TACC)", qty: 1, unit: "taza", item: "harina_sarraceno", role: "principal", optional: false },
        { text: "6 cucharadas soperas de semillas variadas (chía, linaza, sésamo integral o amapola)", qty: 6, unit: "cda", item: "semillas_varias", role: "condimento", optional: false },
        { text: "4 cucharadas soperas de aceite de oliva extra virgen", qty: 4, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "1 cucharadita de sal marina machacada", qty: 1, unit: "cdita", item: "sal_marina", role: "condimento", optional: false },
        { text: "Agua tibia de filtro (cantidad necesaria para unir la masa)", qty: null, unit: null, item: "agua", role: "basico", optional: false },
        { text: "A gusto: cúrcuma", qty: null, unit: null, item: "curcuma", role: "condimento", optional: true },
        { text: "A gusto: pimienta negra", qty: null, unit: null, item: "pimienta", role: "condimento", optional: true },
        { text: "A gusto: eneldo o romero", qty: null, unit: null, item: "eneldo", role: "condimento", optional: true }
      ],
      steps: [
        { text: "En un bowl grande integrar los secos: harinas de arroz y sarraceno, semillas seleccionadas, sal marina y condimentos elegidos.", timer: null },
        { text: "Incorporar las 4 cucharadas de aceite de oliva extra virgen formando un arenado con espátula.", timer: null },
        { text: "Añadir agua tibia de a chorritos pequeños mientras se amasa con las manos hasta unir en una masa maleable y lisa.", timer: null },
        { text: "Tomar bolitas pequeñas y aplastarlas de forma muy delgada directamente sobre una asadera aceitada o con silicona.", timer: null },
        { text: "Pinchar la superficie de cada galleta con los dientes de un tenedor.", timer: null },
        { text: "Hornear a 180°C durante 12 a 15 minutos hasta que adquieran un tono dorado y textura crujiente.", timer: 720, editorial: true },
        { text: "Dejar enfriar completamente sobre rejilla antes de guardar en lata hermética.", timer: null }
      ],
      tip: "Mezclar primero los secos, después los aceites, y sumar el agua necesaria para formar la masa. Achatar las bolitas bien finitas.", allergens: ["semillas","sesamo"], mayContain: ["gluten"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: null,
      tags: ["cocido"], limits: null,
      source: "guía p.36-37", note: "La guía permite harina de trigo sarraceno o de avena; con avena contiene gluten.",
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "pan-quinoa-amaranto", title: "Pan Nutritivo de Quinoa y Amaranto sin Gluten", category: "panificados",
      time: {"total":75,"active":20,"wait":480}, method: "Remojo + Procesado + Horno 160°C", servings: 12, servingsEstimated: true,
      ingredients: [
        { text: "4 tazas de quinoa cruda en grano (blanca o tricolor)", qty: 4, unit: "taza", item: "quinoa", role: "principal", optional: false },
        { text: "2/3 taza de semillas de chía remojadas en 1/2 taza de agua durante 30 minutos", qty: 0.667, unit: "taza", item: "semillas_chia", role: "condimento", optional: false },
        { text: "2,5 a 3 tazas de agua pura de filtro", qty: 2.5, qtyMax: 3, unit: "taza", item: "agua", role: "basico", optional: false },
        { text: "1/2 taza de aceite de oliva extra virgen", qty: 0.5, unit: "taza", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "1 cucharadita de bicarbonato de sodio", qty: 1, unit: "cdita", item: "bicarbonato", role: "condimento", optional: false },
        { text: "1 cucharadita de sal marina fina", qty: 1, unit: "cdita", item: "sal_marina", role: "condimento", optional: false },
        { text: "6 cucharaditas de jugo de limón recién exprimido", qty: 6, unit: "cdita", item: "limon", role: "condimento", optional: false },
        { text: "1,5 tazas de harina de amaranto integral", qty: 1.5, unit: "taza", item: "harina_amaranto", role: "principal", optional: false },
        { text: "Semillas variadas para espolvorear la cubierta", qty: null, unit: null, item: "semillas_varias", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Remojar la quinoa durante una noche; al día siguiente enjuagarla bajo chorro de agua fría en colador fino hasta que el agua salga sin espuma.", timer: null },
        { text: "Hidratar la chía en la media taza de agua 30 minutos hasta obtener un gel consistente.", timer: 1800 },
        { text: "Colocar en la procesadora la quinoa bien escurrida, el gel de chía, 2,5 a 3 tazas de agua, el aceite de oliva, el bicarbonato, la sal y las 6 cucharaditas de jugo de limón.", timer: null },
        { text: "Procesar a fondo hasta lograr una masa densa y cremosa.", timer: null },
        { text: "Volcar en un recipiente e incorporar la taza y media de harina de amaranto con movimientos envolventes.", timer: null },
        { text: "Dejar reposar la masa en el recipiente durante 15 minutos mientras se precalienta el horno a 160°C.", timer: 900, editorial: true },
        { text: "Verter la masa en una budinera tipo Pyrex aceitada, emparejar y espolvorear con semillas variadas.", timer: null },
        { text: "Hornear a 160°C durante 60 a 70 minutos hasta que la corteza esté dorada y al insertar un cuchillo salga seco.", timer: 3600, editorial: true },
        { text: "Dejar enfriar totalmente antes de cortar en rebanadas.", timer: null }
      ],
      tip: "Dejar reposar la masa mientras se precalienta el horno para que la chía largue su mucílago.", allergens: ["semillas","sesamo","citricos"], mayContain: [],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: null,
      tags: ["cocido"], limits: null,
      source: "guía p.37", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "pan-trigo-sarraceno", title: "Pan Artesanal de Trigo Sarraceno y Psyllium", category: "panificados",
      time: {"total":30,"active":20,"wait":1140}, method: "Fermentación lenta en frío + Horno 220°C", servings: 10, servingsEstimated: true,
      ingredients: [
        { text: "500 g de granos enteros de trigo sarraceno crudos", qty: 500, unit: "g", item: "trigo_sarraceno", role: "principal", optional: false },
        { text: "200 g de agua templada de filtro", qty: 200, unit: "g", item: "agua", role: "basico", optional: false },
        { text: "2 cucharadas soperas de aceite de oliva extra virgen", qty: 2, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "2 cucharadas soperas de miel pura de abejas", qty: 2, unit: "cda", item: "miel", role: "condimento", optional: false },
        { text: "30 g de cáscara de psyllium en polvo molido", qty: 30, unit: "g", item: "psyllium", role: "condimento", optional: false },
        { text: "5 g de levadura de panadería seca (o 10 g de fresca)", qty: 5, unit: "g", item: "levadura_panaderia", role: "condimento", optional: false },
        { text: "5 g de sal marina fina", qty: 5, unit: "g", item: "sal_marina", role: "condimento", optional: false },
        { text: "Mix opcional para la cubierta: 1 cdita de chía, 1 cda de calabaza, 1 cda de girasol, 1 cda de lino", qty: null, unit: null, item: "semillas_varias", role: "condimento", optional: true }
      ],
      steps: [
        { text: "Colocar el trigo sarraceno en un recipiente amplio cubierto con abundante agua (que sobre un dedo por encima). Dejar en remojo un mínimo de 6 horas o toda la noche.", timer: null },
        { text: "Enjuagar exhaustivamente y escurrir en colador.", timer: null },
        { text: "Triturar el sarraceno en robot de cocina o licuadora potente con los 200 g de agua templada y la miel.", timer: null },
        { text: "Pasar la masa obtenida a un cuenco e incorporar la sal marina, el aceite de oliva y el psyllium molido, revolviendo con espátula.", timer: null },
        { text: "Añadir la levadura e integrar bien.", timer: null },
        { text: "Cubrir el recipiente con papel film y llevar a la heladera durante 12 horas continuas para un leudado lento.", timer: null },
        { text: "Aceitar y enharinar un molde de pan, verter la masa y dejar reposar 1 hora a temperatura ambiente fuera de la heladera.", timer: 3600 },
        { text: "Espolvorear con las semillas e introducir en horno precalentado a 220°C durante 30 a 35 minutos.", timer: 1800, editorial: true },
        { text: "Desmoldar y enfriar sobre rejilla.", timer: null }
      ],
      tip: "Los panes de sarraceno aptos también se consiguen hechos (Kalimera Alimentos, Pampa Madre).", allergens: [], mayContain: ["semillas","sesamo"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: null,
      tags: ["cocido"], limits: null,
      source: "guía p.38-39", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "mix-rawmesan", title: "Mix Rawmesan de Semillas y Levadura Nutricional", category: "alinos",
      time: {"total":5,"active":5}, method: "Molienda en seco", servings: null,
      ingredients: [
        { text: "1 taza de semillas de lino crudo", qty: 1, unit: "taza", item: "semillas_lino", role: "principal", optional: false },
        { text: "1 taza de semillas de calabaza tostadas suavemente en seco", qty: 1, unit: "taza", item: "semillas_zapallo", role: "principal", optional: false },
        { text: "1 cucharada sopera de levadura de cerveza nutricional", qty: 1, unit: "cda", item: "levadura_cerveza", role: "condimento", optional: false },
        { text: "1 cucharada sopera de cúrcuma en polvo pura", qty: 1, unit: "cda", item: "curcuma", role: "condimento", optional: false },
        { text: "1 cucharadita de sal marina fina o sal del Himalaya", qty: 1, unit: "cdita", item: "sal_marina", role: "condimento", optional: false },
        { text: "Opcional: Semillas de sésamo integral tostadas o semillas de chía", qty: null, unit: null, item: "semillas_sesamo", role: "condimento", optional: true }
      ],
      steps: [
        { text: "Tostar brevemente las semillas de calabaza en una sartén seca a fuego mínimo hasta que se inflen.", timer: null },
        { text: "Disponer el lino crudo y las semillas de calabaza en un molinillo de café o procesadora.", timer: null },
        { text: "Moler en pulsos breves para lograr una textura arenosa similar a queso rallado, sin recalentar.", timer: null },
        { text: "Mezclar el polvo obtenido con la levadura nutricional, la cúrcuma y la sal marina.", timer: null },
        { text: "Envasar en frasco de vidrio hermético y conservar obligatoriamente en el freezer para evitar la oxidación de los ácidos grasos poliinsaturados. Se usa directo sin congelarse.", timer: null }
      ],
      tip: "Guardar en un frasco hermético; si hacés mucha cantidad, en el freezer para que no se oxiden los aceites de las semillas. Se puede sacar al momento de usar: no se congela.", allergens: ["semillas","gluten"], mayContain: ["sesamo"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["sin-coccion","batch","rapida"], limits: null,
      source: "guía p.20", note: null
    },
    {
      id: "pesto-cilantro-albahaca-hinojo", title: "Pesto Depurativo de Cilantro, Albahaca o Hinojo", category: "alinos",
      time: {"total":5,"active":5}, method: "Procesado en crudo", servings: null,
      ingredients: [
        { text: "1 atado de cilantro fresco, o 1 atado de albahaca fresca, o 1 taza de plumitas y hojas de hinojo", qty: 1, unit: "atado", item: "cilantro", role: "principal", optional: false },
        { text: "1 diente de ajo fresco", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "2 cucharadas soperas de aceite de oliva extra virgen en frío", qty: 2, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "Jugo recién exprimido de 1 lima o 1/2 limón", qty: 1, unit: "unidad", item: "lima", role: "condimento", optional: false },
        { text: "3 a 4 cucharadas de agua pura de filtro", qty: 3, qtyMax: 4, unit: "cda", item: "agua", role: "basico", optional: false },
        { text: "1 cucharada sopera de frutos secos (cajú, pistachos, nueces, almendras o semillas)", qty: 1, unit: "cda", item: "castanas_caju", role: "principal", optional: true, suggested: true },
        { text: "Sal marina fina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Pimienta negra a gusto", qty: null, unit: null, item: "pimienta", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Lavar y secar muy bien las hierbas frescas elegidas.", timer: null },
        { text: "Colocar en la jarra de la procesadora o vaso de licuadora las hierbas con el ajo, los frutos secos y el jugo cítrico.", timer: null },
        { text: "Sumar el aceite de oliva extra virgen, las cucharadas de agua, sal marina y pimienta.", timer: null },
        { text: "Procesar hasta emulsionar; si se desea una consistencia más ligera y vertible, añadir unas cucharadas extra de agua o limón.", timer: null },
        { text: "Guardar en frasco hermético en la heladera por 4 a 5 días.", timer: null, editorial: true }
      ],
      tip: "Dura varios días en la heladera. Si queda muy espeso, agregar agua o limón según el gusto.", allergens: ["citricos"], mayContain: ["frutos_secos","semillas"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["sin-coccion","rapida"], limits: null,
      source: "guía p.21", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "alino-miel-mostaza", title: "Vinagreta Digestiva de Miel y Mostaza Antigua", category: "alinos",
      time: {"total":3,"active":3}, method: "Emulsión manual en frasco", servings: null,
      ingredients: [
        { text: "3 cucharadas soperas de vinagre de sidra de manzana crudo sin pasteurizar", qty: 3, unit: "cda", item: "vinagre_manzana", role: "principal", optional: false },
        { text: "1 cucharada sopera de aceite de oliva extra virgen", qty: 1, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "1 cucharadita de miel pura de abejas", qty: 1, unit: "cdita", item: "miel", role: "condimento", optional: false },
        { text: "1 cucharadita de mostaza de Dijón tradicional o semillas de mostaza molidas", qty: 1, unit: "cdita", item: "mostaza_dijon", role: "condimento", optional: false },
        { text: "1 pizca de sal marina fina", qty: 1, unit: "pizca", item: "sal_marina", role: "condimento", optional: false, suggested: true }
      ],
      steps: [
        { text: "Colocar el vinagre de sidra de manzana crudo, la miel pura y la mostaza en un frasco pequeño con tapa.", timer: null },
        { text: "Añadir la pizca de sal marina y la cucharada de aceite de oliva virgen extra.", timer: null },
        { text: "Cerrar la tapa y agitar vigorosamente durante 15 a 20 segundos hasta que la mezcla se vuelva homogénea y densa.", timer: null },
        { text: "Utilizar al momento sobre ensaladas de hojas amargas, espárragos blanqueados o alcauciles cocidos.", timer: null }
      ],
      tip: null, allergens: [], mayContain: ["semillas"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["sin-coccion","rapida"], limits: null,
      source: "guía p.21", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "alino-zanahoria", title: "Aliño Fluido de Zanahoria y Limón", category: "alinos",
      time: {"total":15,"active":10}, method: "Hervido + Emulsión vertible", servings: null,
      ingredients: [
        { text: "2 zanahorias tiernas cocidas en agua sin sal", qty: 2, unit: "unidad", item: "zanahoria", role: "principal", optional: false, suggested: true },
        { text: "1/2 a 3/4 taza del caldo dulce de cocción de las zanahorias", qty: 0.5, qtyMax: 0.75, unit: "taza", item: "liquido_coccion", role: "basico", optional: false, suggested: true },
        { text: "1/2 diente de ajo fresco", qty: 0.5, unit: "diente", item: "ajo", role: "condimento", optional: false, suggested: true },
        { text: "3 a 4 cucharadas soperas de jugo de limón recién exprimido", qty: 3, qtyMax: 4, unit: "cda", item: "limon", role: "condimento", optional: false, suggested: true },
        { text: "1 cucharada sopera de aceite de oliva extra virgen en crudo", qty: 1, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false, suggested: true },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Cocinar las zanahorias en agua limpia hasta que estén tiernas y reservar el caldo.", timer: null },
        { text: "Disponer las zanahorias en la licuadora con el medio ajo, la sal marina y el aceite de oliva.", timer: null },
        { text: "Incorporar el jugo de limón y el caldo de cocción tibio en mayor proporción que para un dip, buscando consistencia ligera.", timer: null },
        { text: "Licuar a alta potencia hasta conformar una salsa naranja brillante y corrediza.", timer: null },
        { text: "Rociar sobre rúcula, achicoria, radicheta o vegetales al vapor.", timer: null }
      ],
      tip: "Es la receta de mayonesa de zanahoria con más limón y más líquido de cocción o agua.", allergens: ["citricos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["cocido","rapida"], limits: null,
      source: "guía p.22", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "alino-palta", title: "Aliño Cremoso de Palta y Verdes", category: "alinos",
      time: {"total":5,"active":5}, method: "Procesado en frío", servings: null,
      ingredients: [
        { text: "1/2 palta madura y suave", qty: 0.5, unit: "unidad", item: "palta", role: "principal", optional: false },
        { text: "Jugo recién exprimido de 1 limón entero", qty: 1, unit: "unidad", item: "limon", role: "condimento", optional: false },
        { text: "1 chorro de salsa de soja natural fermentada (marca Shoyu MOA)", qty: 1, unit: "unidad", item: "shoyu", role: "condimento", optional: false },
        { text: "1 puñado de hojas verdes a elección (cilantro, albahaca, espinaca o rúcula)", qty: 1, unit: "puñado", item: "cilantro", role: "condimento", optional: false, suggested: true },
        { text: "1/2 diente de ajo fresco (opcional)", qty: 0.5, unit: "diente", item: "ajo", role: "condimento", optional: true, suggested: true },
        { text: "Agua pura de filtro fresca (la necesaria para regular la consistencia)", qty: null, unit: null, item: "agua", role: "basico", optional: false }
      ],
      steps: [
        { text: "Extraer la pulpa de la media palta con cuchara y colocarla en el vaso de la procesadora o minipimmer.", timer: null },
        { text: "Añadir el jugo de limón, la salsa Shoyu MOA y las hojas verdes seleccionadas.", timer: null },
        { text: "Sumar el medio ajo si se desea potenciar el efecto depurativo.", timer: null },
        { text: "Procesar incorporando agua de a cucharadas hasta obtener una textura de crema ligera ideal para salsear.", timer: null },
        { text: "Consumir preferentemente en el día para mantener vivos sus ácidos grasos.", timer: null }
      ],
      tip: null, allergens: ["soja","citricos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["sin-coccion","rapida"], limits: null,
      source: "guía p.22", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "alino-caju", title: "Aliño Emulsionado de Cajú y Finas Hierbas", category: "alinos",
      time: {"total":5,"active":5}, method: "Licuado ligero", servings: null,
      ingredients: [
        { text: "3 cucharadas colmadas de untable de cajú casero (o 1 puñado de castañas remojadas)", qty: 3, unit: "cda", item: "castanas_caju", role: "principal", optional: false, suggested: true },
        { text: "Jugo recién exprimido de 1/2 limón", qty: 0.5, unit: "unidad", item: "limon", role: "condimento", optional: false, suggested: true },
        { text: "1/2 diente de ajo picado", qty: 0.5, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "1 cucharadita de mostaza de Dijón tradicional", qty: 1, unit: "cdita", item: "mostaza_dijon", role: "condimento", optional: false, suggested: true },
        { text: "1 puñado de hojas frescas finamente picadas (perejil, verdeo, albahaca, menta o cilantro)", qty: 1, unit: "puñado", item: "perejil", role: "condimento", optional: false, suggested: true },
        { text: "Agua pura de filtro fresca para aligerar", qty: null, unit: null, item: "agua", role: "basico", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Colocar el untable de cajú (o las castañas remojadas) en el vaso procesador.", timer: null },
        { text: "Incorporar el jugo de limón, el ajo picado, la mostaza de Dijón y una pizca de sal marina.", timer: null },
        { text: "Procesar añadiendo agua limpia poco a poco hasta lograr una salsa ligera pero con cuerpo.", timer: null },
        { text: "Añadir las hierbas picadas e integrar con cuchara sin procesar para preservar su color y aroma.", timer: null },
        { text: "Conservar en frasco cerrado en heladera por 3 días.", timer: null, editorial: true }
      ],
      tip: "Aderezo cremoso sin lácteos ideal para bañar papas al horno, batatas asadas o granos integrales.", allergens: ["frutos_secos","citricos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["sin-coccion","rapida"], limits: null,
      source: "guía p.22", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "alino-zucchini", title: "Aliño Refrescante de Zucchini y Lima", category: "alinos",
      time: {"total":7,"active":7}, method: "Licuado en crudo", servings: null,
      ingredients: [
        { text: "1 zucchini mediano crudo lavado y trozado", qty: 1, unit: "unidad", item: "zucchini", role: "principal", optional: false },
        { text: "1 trozo de 7 cm de puerro (solo parte blanca y verde claro picada)", qty: 1, unit: "trozo", item: "puerro", role: "principal", optional: false },
        { text: "3 cucharadas soperas de jugo de lima recién exprimido", qty: 3, unit: "cda", item: "lima", role: "condimento", optional: false },
        { text: "3 cucharadas soperas de aceite de oliva extra virgen o aceite de linaza prensado en frío", qty: 3, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "1/2 cucharadita de sal marina fina", qty: 0.5, unit: "cdita", item: "sal_marina", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Disponer el zucchini trozado y el puerro en la licuadora con el jugo de lima y la sal marina.", timer: null },
        { text: "Comenzar a licuar en velocidad media, bajando los ingredientes con una espátula de goma si fuera necesario.", timer: null },
        { text: "Verter el aceite de oliva o de linaza en hilo continuo mientras la máquina está en marcha para emulsionar.", timer: null },
        { text: "Licuar hasta obtener una textura suave, homogénea y verde clara.", timer: null },
        { text: "Guardar en frasco de vidrio tapado en heladera hasta por 3 días.", timer: null, editorial: true }
      ],
      tip: "Se guarda en un frasco de vidrio con tapa en la heladera hasta tres días.", allergens: ["citricos"], mayContain: ["semillas"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["sin-coccion","rapida"], limits: null,
      source: "guía p.22", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "criolla-con-tutti", title: "Salsa Criolla Detox con Tutti", category: "alinos",
      time: {"total":10,"active":10}, method: "Maceración en crudo", servings: null,
      ingredients: [
        { text: "2 tallos de cebolla de verdeo o 1/2 cebolla colorada picada finita", qty: 2, unit: "tallo", item: "cebolla_verdeo", role: "condimento", optional: false, suggested: true },
        { text: "4 a 6 rabanitos crocantes picados chicos o cortados en finas láminas", qty: 4, qtyMax: 6, unit: "unidad", item: "rabanitos", role: "principal", optional: false, suggested: true },
        { text: "Ralladura de 1 limón limpio", qty: 1, unit: "unidad", item: "limon", role: "condimento", optional: false, suggested: true },
        { text: "Jugo recién exprimido de 1 limón grande", qty: 1, unit: "unidad", item: "limon", role: "condimento", optional: false, suggested: true },
        { text: "1 puñado generoso de hierbas frescas picadas (cilantro, perejil, albahaca y/o eneldo)", qty: 1, unit: "puñado", item: "cilantro", role: "condimento", optional: false, suggested: true },
        { text: "1 pizca de sal marina fina", qty: 1, unit: "pizca", item: "sal_marina", role: "condimento", optional: false, suggested: true }
      ],
      steps: [
        { text: "Picar en brunoise muy fina la cebolla elegida y los rabanitos.", timer: null },
        { text: "Picar finamente a cuchillo las hierbas aromáticas.", timer: null },
        { text: "Disponer todo en un frasco o bowl de vidrio con la sal marina, la ralladura y el jugo de limón.", timer: null },
        { text: "Remover bien para que todos los vegetales queden impregnados del jugo cítrico.", timer: null },
        { text: "Dejar reposar 30 minutos antes de consumir para que el limón dome la crudeza del azufre de los bulbos.", timer: 1800, editorial: true },
        { text: "Mantener tapado en la heladera durante 2 a 3 días.", timer: null, editorial: true }
      ],
      tip: "Preparar un poquito y conservar en frasco hermético con sal y limón por un par de días. Las hierbas y la cebolla se usan lavadas y picadas finas.", allergens: ["citricos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["crudo","rapida","caluroso-ok"], limits: null,
      source: "guía p.22", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "temakis-nori", title: "Temakis de Alga Nori con Palta, Pepino y Tofu", category: "almuerzos",
      time: {"total":20,"active":20}, method: "Tostado rápido + Armado manual", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "4 láminas de alga nori", qty: 4, unit: "lámina", item: "nori", role: "principal", optional: false, suggested: true },
        { text: "1 taza de arroz yamaní, mijo o quinoa cocida tibia", qty: 1, unit: "taza", item: "arroz_yamani", role: "principal", optional: false, suggested: true },
        { text: "1/2 palta cortada en tiras longitudinales", qty: 0.5, unit: "unidad", item: "palta", role: "principal", optional: false, suggested: true },
        { text: "1 pepino firme en bastones finos sin semillas", qty: 1, unit: "unidad", item: "pepino", role: "principal", optional: false, suggested: true },
        { text: "1 taza de brotes frescos de alfalfa o de poroto mung", qty: 1, unit: "taza", item: "brotes", role: "principal", optional: false, suggested: true },
        { text: "100 g de bastones de tofu dorados a la plancha sin aceite", qty: 100, unit: "g", item: "tofu", role: "principal", optional: true, suggested: true },
        { text: "Pickle de rabanitos o nabo rallado", qty: null, unit: null, item: "rabanitos", role: "principal", optional: true },
        { text: "Salsa Shoyu MOA para mojar", qty: null, unit: null, item: "shoyu", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Cortar las hojas de alga nori por la mitad a lo largo.", timer: null },
        { text: "Pasar cada lámina vuelta y vuelta muy rápido sobre la llama de la hornalla para tostarla ligeramente sin quemarla.", timer: null },
        { text: "Colocar la media lámina sobre la palma con la cara rugosa hacia arriba.", timer: null },
        { text: "Poner una cucharada del cereal tibio en una esquina diagonal.", timer: null },
        { text: "Sumar bastones de palta, pepino, tofu dorado, brotes frescos y pickle.", timer: null },
        { text: "Enrollar formando un cono y sellar el borde exterior humedeciendo con una gota de agua con el dedo.", timer: null },
        { text: "Servir inmediatamente para mantener la textura crujiente del alga, acompañado de salsa Shoyu MOA.", timer: null }
      ],
      tip: "Las algas nori se compran en el barrio chino o en la dietética. Se pasan vuelta y vuelta por la llama, se rellenan y se doblan en cono; se pueden cerrar con un poquito de agua en el borde.", allergens: ["soja","algas","legumbres"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["rapida"], limits: null,
      source: "guía p.13", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "risotto-yamani-hongos", title: "Risotto de Yamaní y Hongos de Pino al Caldo de Setas", category: "almuerzos",
      time: {"total":45,"active":30}, method: "Salteado en agua + Reducción a fuego lento", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de arroz yamaní o arroz mochi integral (o quinoa)", qty: 1, unit: "taza", item: "arroz_yamani", role: "principal", optional: false, suggested: true },
        { text: "30 g de hongos de pino secos", qty: 30, unit: "g", item: "hongos_pino", role: "condimento", optional: false, suggested: true },
        { text: "150 g de hongos portobello o champiñones frescos en cuartos", qty: 150, unit: "g", item: "hongos_champi", role: "principal", optional: false, suggested: true },
        { text: "1 cebolla mediana picada en cubitos", qty: 1, unit: "unidad", item: "cebolla", role: "condimento", optional: false, suggested: true },
        { text: "1 diente de ajo machacado", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "2 cucharadas de agua caliente para rehogar", qty: 2, unit: "cda", item: "agua", role: "basico", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Pesto de albahaca o perejil fresco para servir", qty: null, unit: null, item: "albahaca", role: "condimento", optional: false },
        { text: "Acompañamiento: ramilletes de brócoli o espárragos blanqueados", qty: null, unit: null, item: "brocoli", role: "principal", optional: true }
      ],
      steps: [
        { text: "Hidratar los hongos de pino en abundante agua hirviendo durante 15 minutos; escurrir, picar y conservar su caldo caliente.", timer: 900, editorial: true },
        { text: "En cacerola calentar las 2 cucharadas de agua y saltear la cebolla y el ajo con una pizca de sal marina hasta ablandar.", timer: null },
        { text: "Sumar los portobellos y los hongos de pino picados salteando 2 minutos.", timer: 120, editorial: true },
        { text: "Agregar el arroz y remover suavemente.", timer: null },
        { text: "Incorporar el caldo de los hongos caliente de a poco con cucharón a medida que el cereal lo absorba.", timer: null },
        { text: "Cocinar a fuego mínimo tapado durante 35 a 40 minutos hasta lograr un grano tierno y jugoso.", timer: 2100, editorial: true },
        { text: "Servir caliente salseado con una cucharada de pesto fresco y acompañado de crucíferas blanqueadas.", timer: null }
      ],
      tip: "Reservar el agua de hidratación de los hongos de pino: se agrega caliente al arroz, de a poco.", allergens: [], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.13-14", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "risotto-remolacha-brocoli", title: "Risotto Carmesí de Yamaní y Remolacha con Brócoli", category: "almuerzos",
      time: {"total":45,"active":30}, method: "Hervido de remolachas + Cocción por absorción", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de arroz mochi integral, yamaní o quinoa", qty: 1, unit: "taza", item: "arroz_yamani", role: "principal", optional: false, suggested: true },
        { text: "2 remolachas medianas en cubos pequeños", qty: 2, unit: "unidad", item: "remolacha", role: "principal", optional: false, suggested: true },
        { text: "1 cebolla picada fina", qty: 1, unit: "unidad", item: "cebolla", role: "condimento", optional: false, suggested: true },
        { text: "1 tallo de puerro picado fino", qty: 1, unit: "tallo", item: "puerro", role: "principal", optional: false, suggested: true },
        { text: "1 litro de agua pura de filtro", qty: 1, unit: "l", item: "agua", role: "basico", optional: false, suggested: true },
        { text: "1 taza de ramilletes de brócoli blanqueados al vapor", qty: 1, unit: "taza", item: "brocoli", role: "principal", optional: false, suggested: true },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Para terminar: pesto verde fresco o 1 cucharada de aceite de oliva crudo", qty: null, unit: null, item: "aceite_oliva", role: "condimento", optional: true }
      ],
      steps: [
        { text: "Hervir las remolachas en cubos en el litro de agua desde fría hasta que estén tiernas; mantener el caldo fucsia caliente a fuego mínimo.", timer: null },
        { text: "En otra cacerola calentar 2 cucharadas de agua y saltear la cebolla y el puerro.", timer: null },
        { text: "Incorporar el arroz yamaní o quinoa.", timer: null },
        { text: "Ir vertiendo de a cucharones el caldo caliente con los cubos de remolacha, revolviendo periódicamente.", timer: null },
        { text: "Cocinar a fuego lento hasta que el grano esté tierno, cremoso y de color púrpura intenso.", timer: null },
        { text: "Servir en plato hondo con los brócolis blanqueados crujientes al costado y un hilo de pesto verde fresco.", timer: null }
      ],
      tip: "El líquido de cocción de las remolachas, siempre caliente, es el que se va incorporando al arroz.", allergens: [], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.14", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "ensalada-quinoa-habas-brocoli", title: "Ensalada Tibia de Quinoa con Habas y Brócoli", category: "ensaladas",
      time: {"total":25,"active":15}, method: "Vapor + Hervido de granos + Ensamble", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de quinoa cocida tibia (blanca, roja o tricolor)", qty: 1, unit: "taza", item: "quinoa", role: "principal", optional: false, suggested: true },
        { text: "1 taza de habas cocidas al vapor y peladas de su hollejo", qty: 1, unit: "taza", item: "habas", role: "principal", optional: false, suggested: true },
        { text: "1 taza de arbolitos de brócoli cocidos al vapor al dente (4 min)", qty: 1, unit: "taza", item: "brocoli", role: "principal", optional: false, suggested: true },
        { text: "1/2 palta madura cortada en dados", qty: 0.5, unit: "unidad", item: "palta", role: "principal", optional: false, suggested: true },
        { text: "1 puñado de hojas frescas de albahaca picadas", qty: 1, unit: "puñado", item: "albahaca", role: "condimento", optional: false, suggested: true },
        { text: "Aliño de cajú con ajo o pesto casero de cilantro", qty: null, unit: null, item: "castanas_caju", role: "principal", optional: true },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Jugo de limón a gusto", qty: null, unit: null, item: "limon", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Cocer la quinoa lavada en el doble de agua durante 15 minutos; reservar tibia.", timer: 900, editorial: true },
        { text: "Cocinar las habas al vapor durante 5 a 6 minutos, enfriar y retirar la piel exterior hollejo para dejar el grano tierno y verde brillante.", timer: 300, editorial: true },
        { text: "Cocinar el brócoli al vapor 4 minutos conservando su color vivo y textura crocante.", timer: 240, editorial: true },
        { text: "En una ensaladera integrar la quinoa tibia, las habas peladas, el brócoli y los dados de palta.", timer: null },
        { text: "Espolvorear con la albahaca picada y aderezar generosamente con el aliño de cajú o pesto de cilantro.", timer: null }
      ],
      tip: "Las habas se sirven cocidas y peladas.", allergens: ["citricos","legumbres"], mayContain: ["frutos_secos"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["cocido"], limits: null,
      source: "guía p.15", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "guiso-mung-calabaza", title: "Guiso Reconfortante de Porotos Mung y Calabaza al Curry", category: "almuerzos",
      time: {"total":40,"active":15,"wait":480}, method: "Cocción lenta en olla tapada", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de porotos mung remojados previamente 8 horas y escurridos", qty: 1, unit: "taza", item: "porotos_mung", role: "principal", optional: false },
        { text: "2 tazas de calabaza o zapallo anco en cubos medianos", qty: 2, unit: "taza", item: "calabaza_anco", role: "principal", optional: false },
        { text: "1 tallo de puerro picado fino", qty: 1, unit: "tallo", item: "puerro", role: "principal", optional: false, suggested: true },
        { text: "3 varas de apio frescas picadas", qty: 3, unit: "penca", item: "apio", role: "principal", optional: false },
        { text: "1 zanahoria cortada en rodajas", qty: 1, unit: "unidad", item: "zanahoria", role: "principal", optional: false },
        { text: "1 diente de ajo machacado", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false, suggested: true },
        { text: "1 cucharadita de curry en polvo o cúrcuma pura", qty: 1, unit: "cdita", item: "curry", role: "condimento", optional: false, suggested: true },
        { text: "Agua caliente de filtro para cubrir", qty: null, unit: null, item: "agua", role: "basico", optional: false },
        { text: "Sal marina a gusto (incorporar al final de la cocción)", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Para acompañar: salsa criolla con tutti y verduras verdes al vapor (espinaca, espárragos, chauchas, Bruselas, brócoli)", qty: null, unit: null, item: "espinaca", role: "principal", optional: true }
      ],
      steps: [
        { text: "En cacerola de fondo grueso calentar 2 cucharadas de agua y rehogar el puerro, el apio, la zanahoria y el ajo machacado.", timer: null },
        { text: "Añadir el curry o cúrcuma removiendo para activar las especias aromáticas.", timer: null },
        { text: "Sumar la calabaza trozada y los porotos mung remojados.", timer: null },
        { text: "Cubrir con agua hirviendo sobrepasando 3 cm los ingredientes.", timer: null },
        { text: "Tapar y cocinar a fuego lento durante 30 a 35 minutos hasta que los porotos y la calabaza comiencen a desarmarse en un caldo espeso.", timer: 1800, editorial: true },
        { text: "Salpimentar al final para no endurecer las legumbres.", timer: null },
        { text: "Servir caliente coronado con la salsa Criolla con Tutti y hojas verdes al vapor al costado.", timer: null }
      ],
      tip: "La sal se agrega cuando los porotos ya están cocidos.", allergens: ["apio","legumbres"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.15", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "papa-burguers-horno", title: "Papa Burguers Doradas al Horno con Zucchini", category: "almuerzos",
      time: {"total":35,"active":20}, method: "Vapor + Horno sobre papel manteca", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "2 papas medianas cocidas al vapor y peladas", qty: 2, unit: "unidad", item: "papa", role: "principal", optional: false },
        { text: "2 zanahorias medianas cocidas al vapor", qty: 2, unit: "unidad", item: "zanahoria", role: "principal", optional: false },
        { text: "1 zucchini crudo rallado (bien exprimido con lienzo para retirar todo el líquido)", qty: 1, unit: "unidad", item: "zucchini", role: "principal", optional: false },
        { text: "1 cucharadita de ajo en polvo o ajo fresco picado finísimo", qty: 1, unit: "cdita", item: "ajo", role: "condimento", optional: false },
        { text: "2 cucharadas soperas de cebolla deshidratada en escamas", qty: 2, unit: "cda", item: "cebolla", role: "condimento", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Pimienta negra molida a gusto", qty: null, unit: null, item: "pimienta", role: "condimento", optional: false },
        { text: "Acompañamiento: brócolis blanqueados, ensalada de rúcula y pesto de cilantro o mostaza Dijón", qty: null, unit: null, item: "brocoli", role: "principal", optional: true }
      ],
      steps: [
        { text: "Cocer las papas y zanahorias al vapor hasta ablandar; dejar enfriar.", timer: null },
        { text: "Rallar el zucchini y estrujarlo fuertemente dentro de un lienzo limpio para escurrir todo su jugo.", timer: null },
        { text: "Pisar las papas y zanahorias en un bowl hasta formar un puré uniforme.", timer: null },
        { text: "Incorporar el zucchini bien seco, el ajo, la cebolla deshidratada, sal y pimienta negra.", timer: null },
        { text: "Amasar con las manos para unir la preparación (rinde 8 medallones).", timer: null },
        { text: "Dar forma a las hamburguesas y disponerlas en asadera con papel manteca sin nada de aceite.", timer: null },
        { text: "Hornear a 200°C durante 15 minutos; voltear con cuidado y hornear 10 minutos del otro lado hasta que doren.", timer: 900, editorial: true },
        { text: "Servir calientes con pesto de cilantro o mostaza y crucíferas al vapor.", timer: null }
      ],
      tip: "Exprimir bien el jugo del zucchini rallado es clave para que las hamburguesas se mantengan firmes sin harinas ni huevo. Las versiones con papa, no más de 1 vez por semana.", allergens: [], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: {"perWeek":1},
      source: "guía p.15", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "papa-horno-alino-caju", title: "Papa Asada Rellena con Aliño de Cajú y Mostaza", category: "almuerzos",
      time: {"total":45,"active":5}, method: "Horno en seco con piel", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "1 papa grande entera con su piel cepillada y limpia", qty: 1, unit: "unidad", item: "papa", role: "principal", optional: false, suggested: true },
        { text: "3 cucharadas soperas de aliño emulsionado de cajú (cajú, mostaza de Dijón, verdeo fino, albahaca o perejil)", qty: 3, unit: "cda", item: "castanas_caju", role: "principal", optional: false, suggested: true },
        { text: "1 pizca de sal marina", qty: 1, unit: "pizca", item: "sal_marina", role: "condimento", optional: false, suggested: true },
        { text: "Ensalada fresca de acompañamiento: hojas verdes variadas, zanahoria rallada y rabanitos en láminas", qty: null, unit: null, item: "hojas_verdes", role: "principal", optional: true }
      ],
      steps: [
        { text: "Lavar y secar muy bien la papa entera con su cáscara.", timer: null },
        { text: "Pinchar la superficie en varios puntos con la punta de un tenedor.", timer: null },
        { text: "Llevar al horno a 200°C directo sobre la rejilla o en asadera seca durante 40 a 45 minutos hasta que la piel quede crujiente y el centro blando.", timer: 2400, editorial: true },
        { text: "Retirar, hacer un corte longitudinal al medio y presionar los extremos hacia adentro para abrir el centro humeante.", timer: null },
        { text: "Espolvorear con sal marina y rellenar con las 3 cucharadas colmadas de aliño de cajú cremoso.", timer: null },
        { text: "Servir caliente junto a la ensalada fresca crujiente.", timer: null }
      ],
      tip: "Las versiones con papa, no más de 1 vez por semana.", allergens: ["frutos_secos","citricos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: {"perWeek":1},
      source: "guía p.15", note: "El aliño de cajú de la guía (pág. 22) lleva jugo de limón: por eso se marca Cítricos.",
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "arroz-coliflor-salteado", title: "Salteado de Falso Arroz de Coliflor con Habas y Zanahoria", category: "almuerzos",
      time: {"total":15,"active":15}, method: "Rallado + Salteado en agua al wok", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "1/2 cabeza de coliflor fresca limpia (incluyendo la parte tierna del tronco)", qty: 0.5, unit: "cabeza", item: "coliflor", role: "principal", optional: false, suggested: true },
        { text: "1 zanahoria cocida al vapor cortada en rodajas diagonales", qty: 1, unit: "unidad", item: "zanahoria", role: "principal", optional: false, suggested: true },
        { text: "1/2 taza de habas cocidas al vapor y peladas (o arvejas / chauchas)", qty: 0.5, unit: "taza", item: "habas", role: "principal", optional: false, suggested: true },
        { text: "1 diente de ajo picado muy fino", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false, suggested: true },
        { text: "3 cucharadas soperas de agua caliente de filtro", qty: 3, unit: "cda", item: "agua", role: "basico", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Gotas de salsa Shoyu MOA al apagar el fuego", qty: null, unit: null, item: "shoyu", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Rallar la coliflor cruda con la parte media del rallador manual o pulsar en procesadora hasta obtener granos del tamaño de arroz.", timer: null },
        { text: "Calentar las 3 cucharadas de agua en una sartén grande o wok a fuego medio-alto.", timer: null },
        { text: "Añadir el ajo picado y volcar el falso arroz de coliflor.", timer: null },
        { text: "Saltear continuamente durante 4 a 5 minutos para que el vapor lo cocine manteniéndolo suelto y al dente.", timer: 240, editorial: true },
        { text: "Sumar las rodajas de zanahoria al vapor y las habas peladas.", timer: null },
        { text: "Salar, rociar con unas gotas de salsa Shoyu MOA, saltear 1 minuto más y retirar del fuego.", timer: 60, editorial: true }
      ],
      tip: "Para el arroz de coliflor: pasar por procesadora, rallar mediano o cortar finito, y cocinar al vapor o en cacerola con tres cucharadas de agua a fuego mínimo.", allergens: ["soja","legumbres"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","rapida","friolento-ok"], limits: null,
      source: "guía p.15 y p.12", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "salteado-hongos-brotes-mung", title: "Salteado de Puerros, Setas y Brotes de Mung al Shoyu", category: "almuerzos",
      time: {"total":12,"active":12}, method: "Salteado al vapor sin materia grasa", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "2 tallos de puerro en rodajas finas", qty: 2, unit: "tallo", item: "puerro", role: "principal", optional: false, suggested: true },
        { text: "1 diente de ajo fileteado", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false, suggested: true },
        { text: "200 g de champiñones o portobellos frescos en láminas", qty: 200, unit: "g", item: "hongos_champi", role: "principal", optional: false, suggested: true },
        { text: "1 taza colmada de brotes frescos de poroto mung (brotes de soja tradicionales)", qty: 1, unit: "taza", item: "brotes", role: "principal", optional: false, suggested: true },
        { text: "2 cucharadas soperas de agua caliente", qty: 2, unit: "cda", item: "agua", role: "basico", optional: false, suggested: true },
        { text: "1 cucharada sopera de salsa de soja natural fermentada (Shoyu MOA)", qty: 1, unit: "cda", item: "shoyu", role: "condimento", optional: false, suggested: true }
      ],
      steps: [
        { text: "Calentar un wok o sartén amplia con las 2 cucharadas de agua a fuego fuerte.", timer: null },
        { text: "Añadir el puerro y el ajo salteando rápidamente durante 2 minutos.", timer: 120, editorial: true },
        { text: "Incorporar los hongos laminados y saltear durante 3 minutos dejando que liberen su propio jugo.", timer: 180, editorial: true },
        { text: "Agregar los brotes frescos de mung y bañar con la cucharada de salsa Shoyu MOA.", timer: null },
        { text: "Saltear únicamente durante 1 minuto más para que tomen temperatura sin perder su textura crujiente y viva.", timer: 60, editorial: true },
        { text: "Servir inmediatamente como guarnición caliente o sobre una base de arroz integral.", timer: null }
      ],
      tip: "Los clásicos «brotes de soja» son en realidad brotes de poroto mung.", allergens: ["soja","legumbres"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","rapida","friolento-ok"], limits: null,
      source: "guía p.18", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "ensalada-repollo-jengibre-macerada", title: "Ensalada Digestiva de Repollo Colorado y Jengibre Macerado", category: "ensaladas",
      time: {"total":35,"active":10}, method: "Maceración con masaje manual", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "2 tazas de repollo colorado cortado en juliana muy fina", qty: 2, unit: "taza", item: "repollo", role: "principal", optional: false, suggested: true },
        { text: "1 manzana verde en láminas finas o rallada gruesa", qty: 1, unit: "unidad", item: "manzana", role: "principal", optional: false, suggested: true },
        { text: "Jugo exprimido con los dedos de 1 cucharada de jengibre fresco rallado", qty: 1, unit: "unidad", item: "jengibre", role: "condimento", optional: false, suggested: true },
        { text: "Jugo de 1 limón o 2 cucharadas de vinagre de sidra de manzana crudo", qty: 1, unit: "unidad", item: "limon", role: "condimento", optional: false, suggested: true },
        { text: "1/2 cucharadita de sal marina fina", qty: 0.5, unit: "cdita", item: "sal_marina", role: "condimento", optional: false, suggested: true },
        { text: "1 cucharada sopera de aceite de oliva extra virgen o aceite de lino en crudo", qty: 1, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Cortar el repollo colorado en tiras ultrafinas con cuchillo afilado.", timer: null },
        { text: "Colocar en un bowl con la sal marina, el jugo de limón (o vinagre) y el jugo exprimido de la raíz de jengibre.", timer: null },
        { text: "Amasar y frotar el repollo con los puños limpios durante 2 minutos hasta que afloje su rigidez y desprenda jugo violeta.", timer: null, editorial: true },
        { text: "Dejar macerar a temperatura ambiente durante al menos 30 minutos.", timer: 1800, editorial: true },
        { text: "Incorporar la manzana verde cortada y el aceite de oliva o de lino en crudo.", timer: null },
        { text: "Integrar y servir junto a una porción de cereal caliente y verduras al vapor.", timer: null }
      ],
      tip: "Macerar al menos media hora con sal y limón (o vinagre de sidra de manzana) y machacar un poco el repollo para que se ablande.", allergens: ["citricos"], mayContain: ["semillas"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["crudo","caluroso-ok"], limits: null,
      source: "guía p.18", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "coleslaw-detox-macerado", title: "Coleslaw Detox Bicolor Macerado al Dijón", category: "ensaladas",
      time: {"total":25,"active":10}, method: "Maceración con prensado", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de repollo blanco en tiras finas", qty: 1, unit: "taza", item: "repollo", role: "principal", optional: false, suggested: true },
        { text: "1 taza de repollo morado en tiras finas", qty: 1, unit: "taza", item: "repollo", role: "principal", optional: false, suggested: true },
        { text: "1 zanahoria grande rallada fina", qty: 1, unit: "unidad", item: "zanahoria", role: "principal", optional: false, suggested: true },
        { text: "Jugo recién exprimido de 1 limón o 2 cdas de vinagre de sidra de manzana crudo", qty: 1, unit: "unidad", item: "limon", role: "condimento", optional: false, suggested: true },
        { text: "1 cucharadita de mostaza de Dijón antigua", qty: 1, unit: "cdita", item: "mostaza_dijon", role: "condimento", optional: false },
        { text: "1 cucharada sopera de aceite de oliva extra virgen o aceite de lino crudo", qty: 1, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "1/2 cucharadita de sal marina fina", qty: 0.5, unit: "cdita", item: "sal_marina", role: "condimento", optional: false, suggested: true },
        { text: "Opcional: Aliño de cajú con mostaza y verdeo", qty: null, unit: null, item: "castanas_caju", role: "principal", optional: true }
      ],
      steps: [
        { text: "Colocar las tiras de repollo blanco, repollo morado y zanahoria rallada en un recipiente espacioso.", timer: null },
        { text: "Espolvorear con la sal marina y rociar con el jugo de limón o vinagre de manzana.", timer: null },
        { text: "Masajear los vegetales con las manos durante 2 minutos para quebrar la fibra.", timer: null, editorial: true },
        { text: "Dejar reposar 15 a 20 minutos para que complete la maceración enzimática.", timer: 900, editorial: true },
        { text: "Mezclar el aceite de oliva con la mostaza de Dijón y verter sobre los vegetales.", timer: null },
        { text: "Revolver con pinzas y servir fresco junto a cereales o legumbres.", timer: null }
      ],
      tip: "Dejarlo macerar un rato con sal y limón (o vinagre de sidra de manzana) y machacarlo un poco para que se ablande.", allergens: ["citricos"], mayContain: ["frutos_secos","semillas"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["crudo","caluroso-ok"], limits: null,
      source: "guía p.18", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "trio-verduras-vapor-semillas", title: "Trío Vital de Verduras al Vapor con Rawmesan", category: "almuerzos",
      time: {"total":12,"active":10}, method: "Cocción al vapor cronometrada", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "Elegir 3 vegetales de estación: puerro en diagonales, zanahoria en láminas, cuñas de hinojo, espinaca tierna, ramilletes de coliflor, repollitos de Bruselas, brócoli, puntas de espárragos, chauchas o habas peladas", qty: null, unit: null, item: null, role: "principal", optional: false, choice: true, choiceCategory: "verduras" },
        { text: "2 cucharadas de mix rawmesan de semillas", qty: 2, unit: "cda", item: "mix_rawmesan", role: "condimento", optional: false, suggested: true },
        { text: "1 cucharada sopera de aceite de oliva extra virgen crudo", qty: 1, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false, suggested: true },
        { text: "1 pizca de sal marina", qty: 1, unit: "pizca", item: "sal_marina", role: "condimento", optional: false, suggested: true }
      ],
      steps: [
        { text: "Llenar la base de la vaporiera con agua limpia y llevar a hervor tapada.", timer: null },
        { text: "Cortar los vegetales elegidos en trozos uniformes.", timer: null },
        { text: "Disponer primero en la canasta los vegetales más firmes (zanahoria, hinojo, coliflor) y a los 4 minutos sumar los más delicados (brócoli, espárragos, espinaca).", timer: 240, editorial: true },
        { text: "Cocinar entre 5 y 8 minutos en total hasta que conserven un color brillante y textura crujiente al dente.", timer: 300, editorial: true },
        { text: "Servir en el plato, rociar con el aceite de oliva virgen extra en crudo, sal marina y espolvorear copiosamente con el Mix Rawmesan.", timer: null }
      ],
      tip: "Cocer hasta que cambien de color pero no se ablanden demasiado: así mantienen al máximo sus propiedades nutricionales (guía, pág. 27).", allergens: ["semillas","gluten"], mayContain: ["legumbres"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","rapida","friolento-ok"], limits: null,
      source: "guía p.12 y p.18", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "zanahorias-a-la-india", title: "Zanahorias Especiadas a la India al Comino y Cúrcuma", category: "almuerzos",
      time: {"total":15,"active":15}, method: "Salteado en agua tapado", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "2 zanahorias grandes peladas y cortadas en láminas diagonales al bies", qty: 2, unit: "unidad", item: "zanahoria", role: "principal", optional: false },
        { text: "1 a 2 dientes de ajo machacados", qty: 1, qtyMax: 2, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "1 cucharadita de cúrcuma en polvo pura", qty: 1, unit: "cdita", item: "curcuma", role: "condimento", optional: false },
        { text: "1/2 cucharadita de comino molido", qty: 0.5, unit: "cdita", item: "comino", role: "condimento", optional: false },
        { text: "1 cucharadita de pimentón dulce", qty: 1, unit: "cdita", item: "pimenton", role: "condimento", optional: false },
        { text: "2 cucharadas de jugo de limón recién exprimido", qty: 2, unit: "cda", item: "limon", role: "condimento", optional: false },
        { text: "1/4 vaso de agua tibia", qty: 0.25, unit: "vaso", item: "agua", role: "basico", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Guarnición recomendada: ensalada de brócoli o espárragos, rúcula, rabanitos y verdeo, con bowl de arroz yamaní", qty: null, unit: null, item: "brocoli", role: "principal", optional: true }
      ],
      steps: [
        { text: "Calentar una sartén con tapa con 2 cucharadas de agua pura.", timer: null },
        { text: "Agregar el ajo machacado, la cúrcuma, el comino molido, el pimentón y el jugo de limón.", timer: null },
        { text: "Saltear las especias durante 1 minuto a fuego medio para liberar sus aromas.", timer: 60 },
        { text: "Incorporar las láminas de zanahoria mezclando para que se tiñan de dorado.", timer: null },
        { text: "Añadir el cuarto de vaso de agua, tapar herméticamente y cocinar a fuego mínimo durante 8 a 10 minutos hasta que estén tiernas pero firmes.", timer: 480, editorial: true },
        { text: "Servir calientes con su propio fondo especiado junto a cereales y hojas verdes.", timer: null }
      ],
      tip: null, allergens: ["citricos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","rapida","friolento-ok"], limits: null,
      source: "guía p.12", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "tabule-quinoa-coliflor", title: "Tabulé Fresco de Quinoa o Arroz de Coliflor y Hierbas", category: "ensaladas",
      time: {"total":15,"active":15}, method: "Picado en crudo + Mezcla aromática", servings: 3, servingsEstimated: true,
      ingredients: [
        { text: "1,5 tazas de quinoa cocida fría o falso arroz de coliflor crudo", qty: 1.5, unit: "taza", item: "quinoa", role: "principal", optional: false, suggested: true },
        { text: "1 atado grande de perejil fresco picado muy chiquito", qty: 1, unit: "atado", item: "perejil", role: "condimento", optional: false, suggested: true },
        { text: "1/2 taza de hojas de menta fresca picadas finas", qty: 0.5, unit: "taza", item: "menta", role: "condimento", optional: false, suggested: true },
        { text: "2 tallos de cebolla de verdeo picada chiquita", qty: 2, unit: "tallo", item: "cebolla_verdeo", role: "condimento", optional: false, suggested: true },
        { text: "1 morrón verde o rojo picado en cubitos diminutos", qty: 1, unit: "unidad", item: "morron", role: "principal", optional: false, suggested: true },
        { text: "1 tomate perita maduro sin semillas picado chiquito", qty: 1, unit: "unidad", item: "tomate", role: "principal", optional: false, suggested: true },
        { text: "Jugo recién exprimido de 2 limones", qty: 2, unit: "unidad", item: "limon", role: "condimento", optional: false, suggested: true },
        { text: "2 cucharadas soperas de aceite de oliva extra virgen en crudo", qty: 2, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false, suggested: true },
        { text: "Sal marina fina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Pimienta negra a gusto", qty: null, unit: null, item: "pimienta", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Si se usa coliflor, rallarla cruda finita; si se utiliza quinoa, asegurarse de que esté fría y desgranada.", timer: null },
        { text: "Picar a cuchillo el perejil y la menta en hebras diminutas.", timer: null },
        { text: "Cortar el verdeo, el morrón y el tomate en concassé pequeño.", timer: null },
        { text: "Unir todos los ingredientes en un bowl amplio.", timer: null },
        { text: "Aderezar con el jugo de limón, el aceite de oliva en crudo, la sal marina y la pimienta.", timer: null },
        { text: "Mezclar bien y dejar reposar 10 minutos para amalgamar los jugos antes de servir.", timer: 600, editorial: true }
      ],
      tip: "Para el arroz de coliflor: pasar por procesadora o rallar mediano, y cocinar al vapor o en cacerola con tres cucharadas de agua a fuego mínimo.", allergens: ["citricos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["crudo","rapida","caluroso-ok"], limits: null,
      source: "guía p.14", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "zucchinis-a-la-menta", title: "Carpaccio de Zucchinis Marinados a la Menta y Lima", category: "ensaladas",
      time: {"total":15,"active":10}, method: "Laminado crudo + Marinado frío", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "1 zucchini mediano firme y muy fresco", qty: 1, unit: "unidad", item: "zucchini", role: "principal", optional: false },
        { text: "Jugo recién exprimido de 2 limones o limas", qty: 2, unit: "unidad", item: "limon", role: "condimento", optional: false },
        { text: "1 puñado generoso de hojas frescas de menta picadas", qty: 1, unit: "puñado", item: "menta", role: "condimento", optional: false, suggested: true },
        { text: "1 diente de ajo picado fino", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false, suggested: true },
        { text: "Pimienta negra recién molida", qty: null, unit: null, item: "pimienta", role: "condimento", optional: false },
        { text: "1/2 cucharadita de sal marina fina", qty: 0.5, unit: "cdita", item: "sal_marina", role: "condimento", optional: false, suggested: true },
        { text: "1 cucharada sopera de aceite de oliva extra virgen en crudo", qty: 1, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false, suggested: true }
      ],
      steps: [
        { text: "Lavar y laminar el zucchini longitudinalmente en cintas muy finas con mandolina.", timer: null },
        { text: "En un cuenco mezclar el jugo cítrico, el ajo, la menta fresca picada, la sal y la pimienta.", timer: null },
        { text: "En una fuente honda acomodar los zucchinis formando una torre o capas, bañando cada capa con el aliño cítrico.", timer: null },
        { text: "Dejar marinar en la heladera durante 1 a 3 horas hasta que las láminas adquieran textura tierna y translúcida.", timer: 3600, editorial: true },
        { text: "Rociar con el hilo de oliva virgen extra antes de servir.", timer: null }
      ],
      tip: "Se pueden dejar marinar varias horas.", allergens: ["citricos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "fresco",
      tags: ["crudo","rapida","caluroso-ok"], limits: null,
      source: "guía p.19", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "colchon-de-arvejas", title: "Colchón Tierno de Arvejas y Cebolla al Vapor", category: "almuerzos",
      time: {"total":20,"active":10}, method: "Cocción tapada al vapor con hojas", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "300 g de arvejas tiernas (frescas o congeladas)", qty: 300, unit: "g", item: "arvejas", role: "principal", optional: false, suggested: true },
        { text: "1 cebolla grande cortada en pluma muy fina", qty: 1, unit: "unidad", item: "cebolla", role: "condimento", optional: false },
        { text: "2 cucharadas soperas de agua", qty: 2, unit: "cda", item: "agua", role: "basico", optional: false },
        { text: "1 cucharadita de aceite de oliva extra virgen", qty: 1, unit: "cdita", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "2 a 3 hojas grandes y limpias de lechuga o espinaca fresca", qty: 2, qtyMax: 3, unit: "hoja", item: "hojas_verdes", role: "principal", optional: false, suggested: true }
      ],
      steps: [
        { text: "En una cacerola de fondo grueso colocar las 2 cucharadas de agua y la cucharadita de aceite de oliva.", timer: null },
        { text: "Distribuir la cebolla cortada en pluma en la base y espolvorear con sal marina.", timer: null },
        { text: "Volcar encima las arvejas emparejando la superficie.", timer: null },
        { text: "Cubrir toda la preparación con las hojas de lechuga o espinaca húmedas (esto genera una trampa de vapor hermética).", timer: null },
        { text: "Tapar la olla y cocinar a fuego mínimo pelusa (o con difusor) durante 15 a 18 minutos sin destapar.", timer: 900, editorial: true },
        { text: "Al retirar, las arvejas estarán dulces y esmeraldas, y la cebolla caramelizada en su jugo.", timer: null },
        { text: "Servir caliente retirando las hojas de lechuga o incorporándolas si son de espinaca.", timer: null }
      ],
      tip: null, allergens: ["legumbres"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","rapida","friolento-ok"], limits: null,
      source: "guía p.19", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "sopa-fria-pepino-cilantro", title: "Sopa Fría Refrescante de Pepino, Palta y Cilantro", category: "sopas",
      time: {"total":10,"active":10}, method: "Procesado en frío", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "1 palta madura pelada", qty: 1, unit: "unidad", item: "palta", role: "principal", optional: false },
        { text: "1 pepino mediano pelado y sin semillas", qty: 1, unit: "unidad", item: "pepino", role: "principal", optional: false },
        { text: "Jugo recién exprimido de 1 limón", qty: 1, unit: "unidad", item: "limon", role: "condimento", optional: false },
        { text: "1/2 taza de agua pura de filtro fría", qty: 0.5, unit: "taza", item: "agua", role: "basico", optional: false },
        { text: "1/2 cucharadita de sal marina fina", qty: 0.5, unit: "cdita", item: "sal_marina", role: "condimento", optional: false, suggested: true },
        { text: "1 puñado de hojas de cilantro fresco para servir", qty: 1, unit: "puñado", item: "cilantro", role: "condimento", optional: false, suggested: true }
      ],
      steps: [
        { text: "Cortar la palta y el pepino sin semillas en trozos medianos.", timer: null },
        { text: "Colocar en la licuadora con el jugo de limón, el medio vaso de agua fría y la sal marina.", timer: null },
        { text: "Licuar a potencia máxima durante 1 minuto hasta obtener una crema fría lisa y aterciopelada.", timer: null, editorial: true },
        { text: "Servir inmediatamente en cuenco hondo decorando con abundante cilantro fresco picado por encima.", timer: null }
      ],
      tip: null, allergens: ["citricos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "fresco",
      tags: ["sin-coccion","rapida","caluroso-ok"], limits: null,
      source: "guía p.16", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "sopa-fria-apio-palta", title: "Sopa Fría Alcalinizante de Apio y Palta", category: "sopas",
      time: {"total":10,"active":10}, method: "Procesado en frío", servings: 3, servingsEstimated: true,
      ingredients: [
        { text: "1 palta madura", qty: 1, unit: "unidad", item: "palta", role: "principal", optional: false },
        { text: "4 ramas de apio fresco lavadas y trozadas", qty: 4, unit: "penca", item: "apio", role: "principal", optional: false },
        { text: "Ralladura y jugo recién exprimido de 1 limón", qty: null, unit: null, item: "limon", role: "condimento", optional: false },
        { text: "1 cucharadita de comino en polvo", qty: 1, unit: "cdita", item: "comino", role: "condimento", optional: false },
        { text: "1 diente de ajo fresco", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "1 cucharada sopera de aceite de oliva extra virgen en crudo", qty: 1, unit: "cda", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "1 puñado de hojas tiernas de rúcula u otra hoja verde", qty: 1, unit: "puñado", item: "rucula", role: "principal", optional: false, suggested: true },
        { text: "1 cucharadita de sal marina fina", qty: 1, unit: "cdita", item: "sal_marina", role: "condimento", optional: false },
        { text: "500 ml de agua fresca de filtro", qty: 500, unit: "ml", item: "agua", role: "basico", optional: false }
      ],
      steps: [
        { text: "Trozar el apio y extraer la pulpa de la palta.", timer: null },
        { text: "Colocar en la licuadora el apio, la palta, el agua fresca, el jugo y la ralladura de limón.", timer: null },
        { text: "Sumar el ajo, el comino, el aceite de oliva, la rúcula lavada y la sal marina.", timer: null },
        { text: "Licuar a máxima velocidad durante 2 minutos hasta emulsionar en una crema pálida sedosa.", timer: null, editorial: true },
        { text: "Servir fría en platos hondos con pimienta negra recién molida opcional.", timer: null }
      ],
      tip: null, allergens: ["citricos","apio"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "fresco",
      tags: ["sin-coccion","rapida","caluroso-ok"], limits: null,
      source: "guía p.16", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "gazpacho-verde", title: "Gazpacho Verde Vivo de Pepino, Tomate y Finas Hierbas", category: "sopas",
      time: {"total":10,"active":10}, method: "Licuado en frío", servings: 3, servingsEstimated: true,
      ingredients: [
        { text: "1 tomate redondo maduro pelado", qty: 1, unit: "unidad", item: "tomate", role: "principal", optional: false },
        { text: "2 pepinos pelados a medias (dejando tiras de piel para sumar clorofila)", qty: 2, unit: "unidad", item: "pepino", role: "principal", optional: false },
        { text: "1/4 de cebolla blanca o morada", qty: 0.25, unit: "unidad", item: "cebolla", role: "condimento", optional: false },
        { text: "1 trozo pequeño de morrón verde o rojo", qty: 1, unit: "trozo", item: "morron", role: "principal", optional: false },
        { text: "1/2 diente de ajo fresco", qty: 0.5, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "1 cucharadita de aceite de oliva extra virgen", qty: 1, unit: "cdita", item: "aceite_oliva", role: "condimento", optional: false, suggested: true },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Pimienta negra a gusto", qty: null, unit: null, item: "pimienta", role: "condimento", optional: false },
        { text: "Hierbas frescas al gusto: orégano, albahaca, cilantro o perejil", qty: null, unit: null, item: "albahaca", role: "condimento", optional: false },
        { text: "Agua fría de filtro (cantidad necesaria)", qty: null, unit: null, item: "agua", role: "basico", optional: false }
      ],
      steps: [
        { text: "Trocear el tomate, los pepinos parcialmente pelados, la cebolla y el morrón.", timer: null },
        { text: "Poner en la licuadora con el medio ajo, la sal marina y las hierbas frescas seleccionadas.", timer: null },
        { text: "Añadir el aceite de oliva virgen extra y un chorrito de agua fría si se desea más líquido.", timer: null },
        { text: "Licuar a velocidad media hasta conformar una sopa ligera y homogénea.", timer: null },
        { text: "Servir en cuencos fríos decorando con cubitos pequeños de pepino crudo.", timer: null }
      ],
      tip: "La cáscara del pepino es muy buena por su contenido en clorofila, pero tiene un sabor más amargo. Anda probando las hierbas.", allergens: [], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "fresco",
      tags: ["sin-coccion","rapida","caluroso-ok"], limits: null,
      source: "guía p.16", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "sopa-kale-brocoli-castanas", title: "Crema Clorofílica de Kale y Brócoli con Castañas de Cajú", category: "sopas",
      time: {"total":30,"active":15}, method: "Salteado en agua + Hervido suave + Licuado cremoso", servings: 3, servingsEstimated: true,
      ingredients: [
        { text: "3 dientes de ajo picados", qty: 3, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "1 cebolla mediana picada", qty: 1, unit: "unidad", item: "cebolla", role: "condimento", optional: false, suggested: true },
        { text: "2 tazas de arbolitos de brócoli fresco", qty: 2, unit: "taza", item: "brocoli", role: "principal", optional: false, suggested: true },
        { text: "2 tazas de hojas de kale picadas finas (sin las nervaduras centrales duras)", qty: 2, unit: "taza", item: "espinaca", role: "principal", optional: false },
        { text: "2 puñados de castañas de cajú crudas (remojadas previamente)", qty: 2, unit: "puñado", item: "castanas_caju", role: "principal", optional: false },
        { text: "Agua caliente para cubrir 5 cm por encima de las verduras", qty: null, unit: null, item: "agua", role: "basico", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Pimienta negra a gusto", qty: null, unit: null, item: "pimienta", role: "condimento", optional: false },
        { text: "Nuez moscada a gusto", qty: null, unit: null, item: "nuez_moscada", role: "condimento", optional: false },
        { text: "Tomillo seco a gusto", qty: null, unit: null, item: "tomillo", role: "condimento", optional: false },
        { text: "1 chorrito de aceite de oliva extra virgen en crudo para servir", qty: 1, unit: "unidad", item: "aceite_oliva", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Saltear en cacerola con 2 cucharadas de agua caliente los ajos y la cebolla picada con sal marina.", timer: null },
        { text: "Sumar el brócoli, el kale desvenado, pimienta, nuez moscada y tomillo.", timer: null },
        { text: "Cubrir con agua caliente superando 5 cm los vegetales.", timer: null },
        { text: "Cocinar a hervor medio durante 20 minutos hasta que el brócoli esté dócil.", timer: 1200 },
        { text: "Verter la preparación en la licuadora junto con las castañas de cajú remojadas y escurridas.", timer: null },
        { text: "Licuar a potencia máxima durante 2 minutos hasta conformar una crema verde esmeralda sumamente sedosa.", timer: null, editorial: true },
        { text: "Servir caliente terminando con un chorrito de aceite de oliva crudo.", timer: null }
      ],
      tip: "Si las castañas estaban previamente remojadas, mejor.", allergens: ["frutos_secos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.17", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "borsch-depurativo-caju", title: "Borsch Depurativo de Remolachas con Queso de Cajú Fermentado", category: "sopas",
      time: {"total":75,"active":15}, method: "Hervido prolongado de raíces", servings: 6, servingsEstimated: true,
      ingredients: [
        { text: "1 kg de remolachas frescas enteras bien lavadas", qty: 1, unit: "kg", item: "remolacha", role: "principal", optional: false },
        { text: "1 cebolla mediana entera cortada a la mitad (con su cáscara limpia)", qty: 1, unit: "unidad", item: "cebolla", role: "condimento", optional: false },
        { text: "2 litros de agua pura de filtro", qty: 2, unit: "l", item: "agua", role: "basico", optional: false },
        { text: "Jugo recién exprimido de 1/2 limón", qty: 0.5, unit: "unidad", item: "limon", role: "condimento", optional: false },
        { text: "1 cucharadita de azúcar mascabo o miel (equilibra acidez)", qty: 1, unit: "cdita", item: "azucar_mascabo", role: "condimento", optional: false },
        { text: "Pimienta blanca molida a gusto", qty: null, unit: null, item: "pimienta", role: "condimento", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Para coronar: 1 cucharada de untable de cajú fermentado por plato", qty: 1, unit: "cda", item: "castanas_caju", role: "principal", optional: true }
      ],
      steps: [
        { text: "Lavar las remolachas con cepillo bajo agua limpia.", timer: null },
        { text: "Ponerlas enteras con piel en una olla grande con los 2 litros de agua, la cebolla cortada a la mitad y sal marina.", timer: null },
        { text: "Hervir tapado a fuego suave durante 1 hora completa.", timer: 3600 },
        { text: "Retirar y descartar las mitades de cebolla.", timer: null },
        { text: "Retirar las remolachas, dejarlas entibiar, retirarles la piel con las manos y rallarlas gruesas.", timer: null },
        { text: "Devolver las remolachas ralladas a la olla con su caldo concentrado.", timer: null },
        { text: "Agregar pimienta blanca, azúcar mascabo y el jugo de limón; hervir 10 minutos más.", timer: 600 },
        { text: "Servir tibia o fría coronando cada plato con una cucharada de queso de cajú fermentado en el centro.", timer: null }
      ],
      tip: "Se puede tomar fría en climas cálidos y caliente cuando hace frío; también se puede licuar para que quede tipo sopa crema.", allergens: ["citricos"], mayContain: ["frutos_secos"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.17", note: "La guía indica 1 cdita de azúcar mascabo; la v1 sumó «o miel». Es la única mención de azúcar de toda la guía."
    },
    {
      id: "sopa-crema-coliflor-caju", title: "Sopa Crema de Coliflor y Cajú a la Cúrcuma", category: "sopas",
      time: {"total":25,"active":15}, method: "Salteado en agua + Hervido + Licuado", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "1 cabeza de coliflor entera trozada (incluyendo el centro tierno del tronco)", qty: 1, unit: "cabeza", item: "coliflor", role: "principal", optional: false, suggested: true },
        { text: "1 diente de ajo picado", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false, suggested: true },
        { text: "1 cebolla picada", qty: 1, unit: "unidad", item: "cebolla", role: "condimento", optional: false },
        { text: "1 tallo de puerro picado", qty: 1, unit: "tallo", item: "puerro", role: "principal", optional: false, suggested: true },
        { text: "1 cucharadita de cúrcuma en polvo pura", qty: 1, unit: "cdita", item: "curcuma", role: "condimento", optional: false, suggested: true },
        { text: "1 puñado de castañas de cajú crudas remojadas", qty: 1, unit: "puñado", item: "castanas_caju", role: "principal", optional: false },
        { text: "Agua hirviendo justa para cubrir las verduras", qty: null, unit: null, item: "agua", role: "basico", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Opcional para servir: ralladura de piel de naranja limpia", qty: null, unit: null, item: "naranja", role: "principal", optional: true },
        { text: "Opcional para servir: hojas de cilantro fresco", qty: null, unit: null, item: "cilantro", role: "condimento", optional: true }
      ],
      steps: [
        { text: "Saltear en cacerola con 2 cucharadas de agua caliente el ajo, la cebolla y el puerro.", timer: null },
        { text: "Incorporar la coliflor trozada (ramilletes y tallo picado), sal marina y cúrcuma.", timer: null },
        { text: "Cubrir al ras con agua hirviendo, tapar y cocinar a fuego suave durante 15 minutos.", timer: 900, editorial: true },
        { text: "Retirar y volcar en la licuadora con el puñado de castañas de cajú remojadas y escurridas.", timer: null },
        { text: "Licuar a potencia máxima durante 2 minutos hasta lograr una textura aterciopelada dorada.", timer: null, editorial: true },
        { text: "Servir caliente espolvoreando con ralladura de naranja y cilantro fresco.", timer: null }
      ],
      tip: "Se usa también la parte central del tronco de la coliflor. Si las castañas fueron remojadas previamente, mejor.", allergens: ["frutos_secos"], mayContain: ["citricos"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.17", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "sopa-zanahoria-jengibre-curcuma", title: "Sopa Antiinflamatoria de Zanahoria, Apio y Jengibre", category: "sopas",
      time: {"total":25,"active":15}, method: "Salteado en agua + Hervido suave + Licuado", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "4 a 5 zanahorias grandes cortadas en rodajas", qty: 4, qtyMax: 5, unit: "unidad", item: "zanahoria", role: "principal", optional: false },
        { text: "1 tallo de puerro picado", qty: 1, unit: "tallo", item: "puerro", role: "principal", optional: false, suggested: true },
        { text: "3 varas de apio frescas picadas", qty: 3, unit: "penca", item: "apio", role: "principal", optional: false, suggested: true },
        { text: "1 diente de ajo machacado", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "1 cucharada sopera colmada de jengibre fresco rallado fino", qty: 1, unit: "cda", item: "jengibre", role: "condimento", optional: false },
        { text: "1 cucharadita de cúrcuma en polvo pura", qty: 1, unit: "cdita", item: "curcuma", role: "condimento", optional: false },
        { text: "Agua caliente de filtro para cubrir apenas las verduras", qty: null, unit: null, item: "agua", role: "basico", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Para terminar: hierbas frescas picadas (cilantro, albahaca, menta o verdeo)", qty: null, unit: null, item: "cilantro", role: "condimento", optional: false }
      ],
      steps: [
        { text: "En cacerola con 2 cucharadas de agua saltear el puerro, el apio, el ajo y el jengibre durante 2 minutos.", timer: 120, editorial: true },
        { text: "Añadir la cúrcuma y sal marina removiendo para activar aromas.", timer: null },
        { text: "Sumar las zanahorias cortadas y cubrir al ras con agua hirviendo.", timer: null },
        { text: "Cocinar tapado a fuego suave durante 18 minutos hasta que la zanahoria esté muy tierna.", timer: 1080, editorial: true },
        { text: "Pasar a la licuadora y triturar hasta obtener una crema sedosa de color naranja brillante.", timer: null },
        { text: "Servir caliente con una lluvia de hierbas frescas picadas en el momento.", timer: null }
      ],
      tip: null, allergens: ["apio"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.17", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "sopa-berro-leche-caju", title: "Sopa Tónica de Berro en Leche de Cajú Suave", category: "sopas",
      time: {"total":15,"active":10}, method: "Cocción corta + Licuado cremoso", servings: 3, servingsEstimated: true,
      ingredients: [
        { text: "1 atado grande de berro fresco (sin los tallos leñosos gruesos)", qty: 1, unit: "atado", item: "berro", role: "principal", optional: false },
        { text: "1 tallo de puerro picado fino", qty: 1, unit: "tallo", item: "puerro", role: "principal", optional: false, suggested: true },
        { text: "1 diente de ajo machacado", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false },
        { text: "1 taza de leche vegetal de cajú casera", qty: 1, unit: "taza", item: "castanas_caju", role: "principal", optional: false, suggested: true },
        { text: "1 taza de agua limpia de filtro", qty: 1, unit: "taza", item: "agua", role: "basico", optional: false, suggested: true },
        { text: "2 cucharadas de agua caliente para el sofrito", qty: 2, unit: "cda", item: "agua", role: "basico", optional: false, suggested: true },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Pimienta negra a gusto", qty: null, unit: null, item: "pimienta", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Saltear en cacerola con 2 cucharadas de agua caliente el puerro y el ajo picado hasta transparentar.", timer: null },
        { text: "Sumar el berro limpio y remover solo 1 minuto para que baje su volumen por calor.", timer: 60, editorial: true },
        { text: "Verter la leche de cajú y el agua en partes iguales cubriendo los vegetales.", timer: null },
        { text: "Salpimentar y dejar que rompa un hervor suave durante no más de 3 minutos para resguardar la clorofila.", timer: 180, editorial: true },
        { text: "Licuar a máxima potencia y servir caliente o tibia.", timer: null }
      ],
      tip: null, allergens: ["frutos_secos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","rapida","friolento-ok"], limits: null,
      source: "guía p.17", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "sopa-apio-eneldo-curry", title: "Sopa Purificante de Apio y Eneldo al Curry Suave", category: "sopas",
      time: {"total":25,"active":15}, method: "Salteado suave + Hervido + Licuado", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "1 cabeza entera de apio (usar tallos limpios sin hojas)", qty: 1, unit: "cabeza", item: "apio", role: "principal", optional: false },
        { text: "1 papa mediana en trozos chicos", qty: 1, unit: "unidad", item: "papa", role: "principal", optional: false },
        { text: "1 cebolla picada fina", qty: 1, unit: "unidad", item: "cebolla", role: "condimento", optional: false },
        { text: "1 cucharadita de curry en polvo o masala suave", qty: 1, unit: "cdita", item: "curry", role: "condimento", optional: false },
        { text: "1 cucharadita de aceite de oliva extra virgen y 2 cdas de agua", qty: 1, unit: "cdita", item: "aceite_oliva", role: "condimento", optional: false },
        { text: "1/4 taza de hojas frescas de eneldo picado", qty: 0.25, unit: "taza", item: "eneldo", role: "condimento", optional: false },
        { text: "Agua o caldo détox caliente (para cubrir 2 cm por encima)", qty: null, unit: null, item: "agua", role: "basico", optional: false },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Opcional cremosidad: 1 puñado de castañas de cajú o 1 cda de untable de cajú", qty: 1, unit: "puñado", item: "castanas_caju", role: "principal", optional: true }
      ],
      steps: [
        { text: "Saltear la cebolla picada con las 2 cucharadas de agua y la cucharadita de aceite de oliva.", timer: null },
        { text: "Añadir el curry o masala y la sal marina revolviendo unos segundos.", timer: null },
        { text: "Incorporar los tallos de apio trozados y los cubitos de papa.", timer: null },
        { text: "Cubrir con agua o caldo détox caliente 2 cm por encima; hervir 18 minutos hasta tiernizar la papa.", timer: 1080, editorial: true },
        { text: "Retirar del fuego y volcar en la licuadora con el eneldo fresco (y castañas si se usan).", timer: null },
        { text: "Licuar a potencia máxima hasta que el eneldo perfume la crema verde clara.", timer: null },
        { text: "Servir caliente en plato hondo.", timer: null }
      ],
      tip: "Opcional: un puñado de castañas de cajú o 1 cda de untable de cajú antes de licuar.", allergens: ["apio"], mayContain: ["frutos_secos"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.18", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "sopa-crema-porotos-mung", title: "Sopa Crema Proteica de Porotos Mung al Puerro", category: "sopas",
      time: {"total":35,"active":15,"wait":480}, method: "Hervido de legumbres + Licuado sedoso", servings: 3, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de porotos mung previamente remojados 8 horas y escurridos", qty: 1, unit: "taza", item: "porotos_mung", role: "principal", optional: false, suggested: true },
        { text: "1 tallo de puerro picado", qty: 1, unit: "tallo", item: "puerro", role: "principal", optional: false, suggested: true },
        { text: "2 varas de apio picadas", qty: 2, unit: "penca", item: "apio", role: "principal", optional: false, suggested: true },
        { text: "1 cebolla mediana picada", qty: 1, unit: "unidad", item: "cebolla", role: "condimento", optional: false, suggested: true },
        { text: "1 diente de ajo machacado", qty: 1, unit: "diente", item: "ajo", role: "condimento", optional: false, suggested: true },
        { text: "1 litro de agua caliente de filtro", qty: 1, unit: "l", item: "agua", role: "basico", optional: false, suggested: true },
        { text: "1 puñado generoso de cilantro fresco picado", qty: 1, unit: "puñado", item: "cilantro", role: "condimento", optional: false, suggested: true },
        { text: "Sal marina a gusto", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "2 cucharadas de agua caliente para el salteado", qty: 2, unit: "cda", item: "agua", role: "basico", optional: false }
      ],
      steps: [
        { text: "En cacerola amplia saltear en 2 cucharadas de agua caliente el ajo, puerro, cebolla y apio.", timer: null },
        { text: "Incorporar los porotos mung escurridos y cubrir con el litro de agua caliente.", timer: null },
        { text: "Cocinar tapado a fuego suave durante 25 a 30 minutos hasta que los porotos estén deshechos y tiernos.", timer: 1500, editorial: true },
        { text: "Añadir la sal marina y las hojas de cilantro fresco.", timer: null },
        { text: "Licuar todo el contenido en caliente hasta emulsionar en una sopa crema aterciopelada y homogénea.", timer: null },
        { text: "Servir humeante acompañada con semillas tostadas o unas gotas de limón.", timer: null }
      ],
      tip: null, allergens: ["apio","legumbres"], mayContain: ["semillas","citricos"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.18", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "caldo-de-miso", title: "Caldo Restaurador de Miso Vivo", category: "caldos",
      time: {"total":3,"active":3}, method: "Disolución en agua tibia sin hervir", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "1 cucharadita de pasta de miso orgánico no pasteurizado (miso de arroz o cebada)", qty: 1, unit: "cdita", item: "miso", role: "principal", optional: false },
        { text: "1 taza grande (250 ml) de agua caliente de filtro (a 60-70°C, nunca hirviendo)", qty: 1, unit: "taza", item: "agua", role: "basico", optional: false },
        { text: "Opcional: hebras de alga wakame hidratadas", qty: null, unit: null, item: "wakame", role: "condimento", optional: true },
        { text: "Opcional: cebolla de verdeo cruda picada finita", qty: null, unit: null, item: "cebolla_verdeo", role: "condimento", optional: true }
      ],
      steps: [
        { text: "Calentar el agua de filtro, sin llegar a hervor.", timer: null, editorial: true },
        { text: "Poner la cucharadita de pasta de miso en un cuenco o taza.", timer: null },
        { text: "Agregar unas cucharadas de agua tibia y disolver con cuchara hasta deshacer todo grumo.", timer: null },
        { text: "Completar la taza con el resto del agua tibia.", timer: null },
        { text: "Sumar si se desea unas hebras de alga wakame o cebolla de verdeo picada.", timer: null },
        { text: "Beber tibio, a sorbos, antes de las comidas o como colación.", timer: null }
      ],
      tip: null, allergens: ["soja"], mayContain: ["gluten","algas"],
      phases: ["monodieta","general"], slots: ["desayuno","almuerzo","merienda","cena"], thermal: "calido",
      tags: ["sin-coccion","rapida"], limits: null,
      source: "guía p.7", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "pudding-chia-compota", title: "Pudding de Chía en Leche de Almendras con Compota de Manzana", category: "desayunos",
      time: {"total":5,"active":5,"wait":480}, method: "Hidratación en frío + Ensamble", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "3 cucharadas soperas de semillas de chía enteras (o ligeramente molidas)", qty: 3, unit: "cda", item: "semillas_chia", role: "condimento", optional: false },
        { text: "1 taza (250 ml) de leche vegetal de almendras casera", qty: 1, unit: "taza", item: "almendras", role: "principal", optional: false },
        { text: "1/2 cucharadita de extracto natural de vainilla (marca El Castillo)", qty: 0.5, unit: "cdita", item: "vainilla", role: "condimento", optional: false, suggested: true },
        { text: "1/2 taza de compota o nituke de manzana tibio (o frutillas y kiwi)", qty: 0.5, unit: "taza", item: "manzana", role: "principal", optional: false, suggested: true },
        { text: "Para decorar: 1 cucharada de almendras tostadas picadas o nueces picadas", qty: null, unit: null, item: "almendras", role: "principal", optional: true }
      ],
      steps: [
        { text: "Colocar en un frasco de vidrio la taza de leche de almendras, las semillas de chía y la vainilla natural.", timer: null },
        { text: "Agitar muy enérgicamente durante 1 minuto para dispersar las semillas y evitar que se peguen en el fondo.", timer: null, editorial: true },
        { text: "Refrigerar durante toda la noche (mínimo 6 horas) hasta que forme un gel espeso tipo pudín.", timer: null, editorial: true },
        { text: "Servir por la mañana en un vaso o bowl coronado con una capa generosa de compota tibia de manzana.", timer: null },
        { text: "Terminar con las almendras tostadas picadas por encima para aportar crocancia.", timer: null }
      ],
      tip: "La versión con compota es mejor para quienes son friolentos. A quien le moleste la textura de la semilla entera, puede pasarla por procesadora antes de dejarla reposar.", allergens: ["frutos_secos","semillas"], mayContain: ["frutillas"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "fresco",
      tags: ["sin-coccion","rapida","caluroso-ok"], limits: null,
      source: "guía p.10", note: "La guía recomienda la versión con compota o nituke de manzana para quienes son friolentos; sin ella queda algo fría.",
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "licuado-rojo-pasion", title: "Licuado Rojo Pasión Hepático", category: "jugos",
      time: {"total":5,"active":5}, method: "Licuado en crudo", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "Jugo recién exprimido de 1 pomelo rosado (o pomelo en trozos con su parte blanca para mayor acción reductora)", qty: 1, unit: "unidad", item: "pomelo", role: "principal", optional: false },
        { text: "1 puñado generoso de frutillas agroecológicas limpias", qty: 1, unit: "puñado", item: "frutillas", role: "principal", optional: false },
        { text: "Ralladura de 1/2 naranja limpia", qty: 0.5, unit: "unidad", item: "naranja", role: "principal", optional: false },
        { text: "1 rodaja fina de jengibre fresco", qty: 1, unit: "rodaja", item: "jengibre", role: "condimento", optional: true, suggested: true },
        { text: "5 hojas de menta fresca", qty: 5, unit: "hoja", item: "menta", role: "condimento", optional: true },
        { text: "Para acompañar si rompés el ayuno con jugo: 6 almendras crudas o nueces", qty: null, unit: null, item: "almendras", role: "principal", optional: true }
      ],
      steps: [
        { text: "Exprimir el pomelo rosado (o retirarle la cáscara externa conservando el albedo blanco si se busca efecto metabólico intenso).", timer: null },
        { text: "Poner en la licuadora el pomelo, las frutillas, la ralladura de naranja, el jengibre y las hojas de menta.", timer: null },
        { text: "Licuar a potencia máxima durante 1 minuto hasta integrar completamente.", timer: null, editorial: true },
        { text: "Servir de inmediato y masticar las 6 almendras al beberlo para moderar el índice glucémico.", timer: null }
      ],
      tip: "Los jugos no son el desayuno indicado para quienes tienen síntomas de frío. Si rompés el ayuno con jugo, acompañalo con 6 almendras o nueces.", allergens: ["citricos","frutillas"], mayContain: ["frutos_secos"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "fresco",
      tags: ["sin-coccion","rapida","caluroso-ok"], limits: null,
      source: "guía p.11", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "licuado-verde-depurativo", title: "Jugo Verde Depurativo de Espinaca, Apio y Menta", category: "jugos",
      time: {"total":7,"active":7}, method: "Extractora o licuado con filtrado en tela", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "2 ramas de apio fresco con sus hojas", qty: 2, unit: "penca", item: "apio", role: "principal", optional: false },
        { text: "1 puñado grande de hojas de espinaca fresca bien lavadas", qty: 1, unit: "puñado", item: "espinaca", role: "principal", optional: false },
        { text: "1 puñado de hojas frescas de menta", qty: 1, unit: "puñado", item: "menta", role: "condimento", optional: false, suggested: true },
        { text: "1 trozo de 2 cm de raíz de jengibre fresco", qty: 1, unit: "trozo", item: "jengibre", role: "condimento", optional: false, suggested: true },
        { text: "Jugo recién exprimido de 1/2 limón", qty: 0.5, unit: "unidad", item: "limon", role: "condimento", optional: false },
        { text: "1/2 vaso de agua de filtro (si se elabora en licuadora)", qty: 0.5, unit: "vaso", item: "agua", role: "basico", optional: false, suggested: true },
        { text: "Para acompañar si rompés el ayuno con jugo: 6 almendras o nueces", qty: null, unit: null, item: "almendras", role: "principal", optional: true }
      ],
      steps: [
        { text: "Si se usa extractora lenta o centrífuga, pasar el apio, espinaca, menta y jengibre; incorporar el jugo de limón al final.", timer: null },
        { text: "Si se realiza en licuadora, colocar todos los ingredientes con el medio vaso de agua y licuar a velocidad máxima.", timer: null },
        { text: "Colar el licuado a través de una bolsa de tela para leches vegetales exprimiendo con las manos para extraer el zumo puro sin fibra.", timer: null },
        { text: "Beber fresco en el momento acompañado de las 6 almendras o nueces masticadas despacio.", timer: null }
      ],
      tip: "Se puede hacer en juguera o en licuadora con agua, pasándolo por bolsa de leches vegetales; el limón se exprime aparte. Los jugos no son para quienes tienen síntomas de frío.", allergens: ["citricos","apio"], mayContain: ["frutos_secos"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "fresco",
      tags: ["sin-coccion","rapida","caluroso-ok"], limits: null,
      source: "guía p.11", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "crema-tibia-mijo-canela", title: "Crema Tibia Reconfortante de Mijo con Canela", category: "desayunos",
      time: {"total":30,"active":10}, method: "Hervido suave prolongado", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "1/2 taza de mijo pelado orgánico bien lavado", qty: 0.5, unit: "taza", item: "mijo", role: "principal", optional: false, suggested: true },
        { text: "2 tazas de agua pura o leche de almendras casera", qty: 2, unit: "taza", item: "agua", role: "basico", optional: false, suggested: true },
        { text: "1 rama de canela entera o 1 cdita de canela pura en polvo", qty: 1, unit: "penca", item: "canela", role: "condimento", optional: false, suggested: true },
        { text: "1 manzana roja o pera rallada", qty: 1, unit: "unidad", item: "manzana", role: "principal", optional: false, suggested: true },
        { text: "1 pizca de sal marina", qty: 1, unit: "pizca", item: "sal_marina", role: "condimento", optional: false, suggested: true },
        { text: "1 cucharadita de semillas de lino molidas o nueces picadas para decorar", qty: 1, unit: "cdita", item: "semillas_lino", role: "condimento", optional: true, suggested: true }
      ],
      steps: [
        { text: "Lavar el mijo exhaustivamente en colador de malla fina con agua tibia hasta que el agua salga clara.", timer: null, editorial: true },
        { text: "Poner en una cacerola con el agua o leche vegetal, la manzana rallada, la canela y la pizca de sal.", timer: null, editorial: true },
        { text: "Llevar a ebullición, bajar el fuego al mínimo y tapar.", timer: null, editorial: true },
        { text: "Cocinar durante 20 a 25 minutos revolviendo ocasionalmente hasta que el grano se abra y forme una crema espesa.", timer: 1200, editorial: true },
        { text: "Servir caliente en un tazón espolvoreando con canela molida y semillas de lino molidas.", timer: null, editorial: true }
      ],
      tip: null, allergens: [], mayContain: ["frutos_secos","semillas"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "v1 (no figura textual en la guía)", note: "Receta agregada en la v1: la guía menciona el mijo para risottos y cremas pero no trae esta preparación. Verificar con Isa.",
      editorialNote: "Receta de la versión anterior de la app: no figura textual en la guía. Cantidades y pasos son propuesta del equipo."
    },
    {
      id: "manzanas-asadas-canela", title: "Manzanas Asadas al Horno con Canela y Frutos Secos", category: "desayunos",
      time: {"total":35,"active":5}, method: "Horno en seco", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "2 manzanas rojas o verdes agroecológicas", qty: 2, unit: "unidad", item: "manzana", role: "principal", optional: false, suggested: true },
        { text: "1 cucharadita colmada de canela pura de Ceilán", qty: 1, unit: "cdita", item: "canela", role: "condimento", optional: false, suggested: true },
        { text: "2 cucharadas soperas de agua de filtro", qty: 2, unit: "cda", item: "agua", role: "basico", optional: false, suggested: true },
        { text: "1 cucharada sopera de nueces o almendras tostadas picadas", qty: 1, unit: "cda", item: "nueces", role: "condimento", optional: false, suggested: true },
        { text: "Opcional: 1 pizca de nuez moscada", qty: 1, unit: "pizca", item: "nuez_moscada", role: "condimento", optional: true, suggested: true },
        { text: "Opcional: 2 clavos de olor", qty: 2, unit: "unidad", item: "clavo_olor", role: "condimento", optional: true, suggested: true }
      ],
      steps: [
        { text: "Lavar las manzanas y extraer el corazón con descorazonador cuidando de no perforar la base.", timer: null, editorial: true },
        { text: "Efectuar un corte circular superficial en la piel alrededor de la manzana para evitar que reviente.", timer: null, editorial: true },
        { text: "Acomodar las manzanas en una fuente para horno pequeña.", timer: null, editorial: true },
        { text: "Rellenar la cavidad central con la canela en polvo y los frutos secos picados.", timer: null, editorial: true },
        { text: "Verter las 2 cucharadas de agua en el fondo de la fuente.", timer: null, editorial: true },
        { text: "Hornear a 180°C durante 30 a 35 minutos hasta que la pulpa esté blanda y caramelizada.", timer: 1800, editorial: true },
        { text: "Servir tibias salseadas con su propio almíbar natural.", timer: null, editorial: true }
      ],
      tip: null, allergens: ["frutos_secos"], mayContain: [],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "v1 (no figura textual en la guía)", note: "Receta agregada en la v1: la guía propone manzana en nituke y compota, no al horno. Verificar con Isa.",
      editorialNote: "Receta de la versión anterior de la app: no figura textual en la guía. Cantidades y pasos son propuesta del equipo."
    },
    {
      id: "bastones-crocantes-dips", title: "Bastones Crocantes de Huerto con Dips Variados", category: "desayunos",
      time: {"total":10,"active":10}, method: "Corte crudo al bies", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "2 ramas de apio tierno limpias", qty: 2, unit: "penca", item: "apio", role: "principal", optional: false, suggested: true },
        { text: "1 bulbo de hinojo mediano", qty: 1, unit: "bulbo", item: "hinojo", role: "principal", optional: false, suggested: true },
        { text: "2 zanahorias dulces peladas", qty: 2, unit: "unidad", item: "zanahoria", role: "principal", optional: false, suggested: true },
        { text: "1 pepino firme con piel parcial", qty: 1, unit: "unidad", item: "pepino", role: "principal", optional: false, suggested: true },
        { text: "Cuencos pequeños con dips a elección: Mayonesa de Zanahoria, Hummus de Mung, Babaganoush o Pasta de Remolacha y Aduki", qty: null, unit: null, item: null, role: "condimento", optional: true }
      ],
      steps: [
        { text: "Lavar minuciosamente los vegetales bajo agua fría.", timer: null },
        { text: "Cortar el apio, hinojo, zanahoria y pepino en bastones uniformes de unos 7 a 8 cm de longitud.", timer: null },
        { text: "Disponer los bastones en un plato o vaso amplio rodeando los cuencos de los untables elegidos.", timer: null },
        { text: "Untar cada bastón en el dip deseado masticando pausadamente.", timer: null }
      ],
      tip: "Acompañar con mayonesa de zanahorias, pasta de remolachas, humus de porotos mung o babaganoush.", allergens: ["apio"], mayContain: ["soja","legumbres"],
      phases: ["general"], slots: ["merienda"], thermal: "fresco",
      tags: ["crudo","rapida","caluroso-ok"], limits: null,
      source: "guía p.19", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "jugo-amo-mi-higado", title: "Jugo Détox Amo a mi Hígado", category: "jugos",
      time: {"total":5,"active":5}, method: "Juguera / Extractora centrífuga", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "1 remolacha cruda mediana pelada", qty: 1, unit: "unidad", item: "remolacha", role: "principal", optional: false },
        { text: "2 zanahorias medianas limpias", qty: 2, unit: "unidad", item: "zanahoria", role: "principal", optional: false },
        { text: "4 varas de apio frescas", qty: 4, unit: "penca", item: "apio", role: "principal", optional: false },
        { text: "1 trocito de raíz de jengibre fresca (1 a 2 cm)", qty: 1, unit: "trozo", item: "jengibre", role: "condimento", optional: false, suggested: true },
        { text: "Para acompañar si rompés el ayuno con jugo: 6 almendras crudas o nueces", qty: null, unit: null, item: "almendras", role: "principal", optional: true }
      ],
      steps: [
        { text: "Lavar y trozar los vegetales en piezas aptas para el orificio de la máquina.", timer: null },
        { text: "Pasar en orden la remolacha, zanahorias, apio y jengibre por la juguera extractora.", timer: null },
        { text: "Mezclar con cuchara el zumo obtenido y beber inmediatamente para prevenir la degradación vitamínica.", timer: null },
        { text: "Masticar despacio 6 frutos secos junto a la ingesta del zumo.", timer: null }
      ],
      tip: "Los jugos no son el desayuno indicado para quienes tienen síntomas de frío. Si rompés el ayuno con jugo, acompañalo con 6 almendras o nueces.", allergens: ["apio"], mayContain: ["frutos_secos"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "fresco",
      tags: ["sin-coccion","rapida","caluroso-ok"], limits: null,
      source: "guía p.10", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "compota-manzana-clavo-canela", title: "Compota Tradicional de Manzanas al Clavo y Canela", category: "desayunos",
      time: {"total":25,"active":5}, method: "Hervido suave prolongado", servings: 3, servingsEstimated: true,
      ingredients: [
        { text: "3 manzanas rojas o verdes peladas y cortadas en cuartos", qty: 3, unit: "unidad", item: "manzana", role: "principal", optional: false, suggested: true },
        { text: "Agua pura de filtro suficiente para cubrir con holgura la fruta", qty: null, unit: null, item: "agua", role: "basico", optional: false },
        { text: "1 rama de canela entera", qty: 1, unit: "penca", item: "canela", role: "condimento", optional: false, suggested: true },
        { text: "2 clavos de olor aromáticos", qty: 2, unit: "unidad", item: "clavo_olor", role: "condimento", optional: false, suggested: true },
        { text: "Opcional: 1 puñado de frutos rojos (frutillas o arándanos) en los minutos finales", qty: 1, unit: "puñado", item: "arandanos", role: "principal", optional: true, suggested: true },
        { text: "Para acompañar: almendras tostadas picadas o semillas de lino molidas", qty: null, unit: null, item: "almendras", role: "principal", optional: true }
      ],
      steps: [
        { text: "Colocar los trozos de manzana en cacerola junto a la canela en rama y los clavos de olor.", timer: null },
        { text: "Cubrir con agua fría de filtro superando 2 cm las manzanas.", timer: null },
        { text: "Cocinar a hervor suave tapado durante 20 a 25 minutos; cuanto más tiempo hierva a fuego mínimo más azúcares naturales liberará sin necesidad de miel.", timer: 1200, editorial: true },
        { text: "Retirar los clavos y la canela.", timer: null },
        { text: "Servir tibia con su caldo dulce espolvoreando con almendras picadas o lino molido.", timer: null }
      ],
      tip: "Se cocina sin azúcar ni miel: cuanto más tiempo hierve, más dulce queda.", allergens: [], mayContain: ["frutos_secos","semillas","frutillas"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.9", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "hot-cakes-avena-coco", title: "Hot Cakes Sin Aceite de Avena y Coco", category: "desayunos",
      time: {"total":15,"active":15,"wait":480}, method: "Sartén antiadherente sin materia grasa", servings: 3, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de avena arrollada (remojada la noche anterior en 1,5 tazas de agua)", qty: 1, unit: "taza", item: "avena", role: "principal", optional: false },
        { text: "3 cucharadas soperas de coco rallado fino", qty: 3, unit: "cda", item: "coco_rallado", role: "condimento", optional: false },
        { text: "1/2 cucharadita de bicarbonato de sodio", qty: 0.5, unit: "cdita", item: "bicarbonato", role: "condimento", optional: false },
        { text: "Para servir: rodajas de banana, frutillas frescas o nituke de manzana, con escamas de coco y nueces picadas", qty: null, unit: null, item: "banana", role: "principal", optional: true }
      ],
      steps: [
        { text: "Dejar en remojo la avena con la taza y media de agua limpia durante toda la noche.", timer: null },
        { text: "Al día siguiente verter la avena con su líquido en la licuadora junto al coco rallado y el bicarbonato.", timer: null },
        { text: "Licuar 1 minuto hasta formar una masa espesa y homogénea.", timer: null, editorial: true },
        { text: "Calentar una sartén con revestimiento cerámico o antiadherente impecable a fuego medio (sin aceite).", timer: null },
        { text: "Volcar una porción con cucharón dándole forma redondeada.", timer: null },
        { text: "Cocinar hasta que la superficie forme burbujas y seque la capa superior; girar con espátula y dorar 1 minuto del otro lado.", timer: 60, editorial: true },
        { text: "Servir tibios con fruta fresca o nituke de manzana y nueces picadas.", timer: null }
      ],
      tip: "Dar vuelta los hot cakes cuando se cocinó la capa de arriba.", allergens: ["gluten"], mayContain: ["frutos_secos","frutillas"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: null,
      tags: ["cocido","rapida"], limits: null,
      source: "guía p.10", note: "Solo con sartén antiadherente cerámica o de teflón, porque no se usa aceite. La avena contiene gluten.",
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "infusion-quelante-ortiga-diente-leon", title: "Infusión de ortiga y diente de león", category: "infusiones",
      time: {"total":10,"active":2}, method: "Infusión tapada", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "2 cucharaditas de hojas secas de ortiga pura (Urtica dioica)", qty: 2, unit: "cdita", item: "ortiga", role: "principal", optional: false, suggested: true },
        { text: "2 cucharaditas de hojas o raíz de diente de león (Taraxacum officinale)", qty: 2, unit: "cdita", item: "diente_leon", role: "principal", optional: false, suggested: true },
        { text: "500 ml de agua pura hirviendo", qty: 500, unit: "ml", item: "agua", role: "basico", optional: false, suggested: true }
      ],
      steps: [
        { text: "Calentar el agua de filtro hasta alcanzar punto de ebullición.", timer: null },
        { text: "Apagar el fuego y colocar las hierbas secas en una tetera o termo de vidrio limpio.", timer: null },
        { text: "Volcar el agua hirviendo y tapar al instante para retener los aceites esenciales volátiles.", timer: null },
        { text: "Dejar reposar durante 10 minutos exactos.", timer: 600, editorial: true },
        { text: "Colar y tomar 2 tazas al día preferentemente entre comidas principales durante todo el protocolo detox.", timer: null },
        { text: "No endulzar con ningún tipo de azúcar ni miel.", timer: null }
      ],
      tip: "Podés elegir una infusión y tomarla todos los días o ir rotándolas. No endulzar.", allergens: [], mayContain: [],
      phases: ["monodieta","general"], slots: ["desayuno","almuerzo","merienda","cena"], thermal: "fresco",
      tags: ["cocido","rapida","caluroso-ok"], limits: null,
      source: "guía p.23", note: "Ortiga: no usar con anticoagulantes. La guía menciona un protocolo de «quelación y desparasitación» con estas dos hierbas (2 tazas por día); no se automatiza: consultalo con un profesional.",
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "mate-medicinal-hierbas", title: "Mate 100% Medicinal de Hierbas Depurativas", category: "infusiones",
      time: {"total":5,"active":5}, method: "Cebado tradicional con bombilla", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "Mezcla en partes iguales de hierbas secas: menta, cola de caballo, ortiga, manzanilla, llantén, diente de león y lavanda", qty: null, unit: null, item: "yuyos_mate", role: "principal", optional: false },
        { text: "Cáscaras secas o frescas de cítricos limpios (limón, naranja o mandarina)", qty: null, unit: null, item: "limon", role: "condimento", optional: true },
        { text: "Hojas de cedrón", qty: null, unit: null, item: "yuyos_mate", role: "principal", optional: false },
        { text: "Opcional si se busca dulzor: 2 o 3 hojas secas de estevia natural entera", qty: 2, qtyMax: 3, unit: "hoja", item: "stevia", role: "condimento", optional: true, suggested: true },
        { text: "Agua caliente en termo a 75-80°C (sin hervir)", qty: null, unit: null, item: "agua", role: "basico", optional: false }
      ],
      steps: [
        { text: "Llenar el mate hasta 3/4 de su capacidad únicamente con la mezcla de yuyos medicinales y las cáscaras de cítricos picadas (sin yerba mate tradicional).", timer: null },
        { text: "Tapar la boca del mate con la palma de la mano, invertir y sacudir suavemente para acomodar las hierbas a 45 grados.", timer: null, editorial: true },
        { text: "Echar un chorro de agua tibia en el hueco formado y dejar reposar 1 minuto para hidratar las hojas.", timer: 60, editorial: true },
        { text: "Introducir la bombilla tapando la boquilla superior con el dedo pulgar.", timer: null },
        { text: "Cebar continuamente con el agua del termo caliente a lo largo del día.", timer: null },
        { text: "Tomar a gusto para calmar el hábito de bombillear sin incorporar cafeína ni irritar el estómago.", timer: null }
      ],
      tip: "Si a falta de mate necesitás bombillear, el mate se arma solo con hierbas, sin yerba mate.", allergens: [], mayContain: ["citricos"],
      phases: ["monodieta","general"], slots: ["desayuno","almuerzo","merienda","cena"], thermal: null,
      tags: ["cocido","rapida"], limits: null,
      source: "guía p.25", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "infusion-digestiva-albahaca-jengibre", title: "Infusión Cálida de Albahaca y Jengibre Fresco", category: "infusiones",
      time: {"total":10,"active":5}, method: "Decocción corta + Infusión tapada", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "1 cucharada sopera de raíz de jengibre fresco machacado o en rodajas", qty: 1, unit: "cda", item: "jengibre", role: "principal", optional: false },
        { text: "1 puñado generoso de hojas frescas de albahaca (o 1 cda de albahaca seca)", qty: 1, unit: "puñado", item: "albahaca", role: "principal", optional: false },
        { text: "1 litro de agua pura de filtro", qty: 1, unit: "l", item: "agua", role: "basico", optional: false }
      ],
      steps: [
        { text: "Colocar el litro de agua con el jengibre machacado en una cacerolita y llevar a hervor durante 3 minutos.", timer: 180, editorial: true },
        { text: "Apagar el fuego, sumar las hojas de albahaca fresca y tapar el recipiente de inmediato.", timer: null },
        { text: "Dejar infusionar durante 7 minutos tapado.", timer: 420, editorial: true },
        { text: "Colar y traspasar a un termo para beber tibio a lo largo del día entre comidas sin endulzar.", timer: null }
      ],
      tip: "De naturaleza cálida, según la guía. No endulzar.", allergens: [], mayContain: [],
      phases: ["monodieta","general"], slots: ["desayuno","almuerzo","merienda","cena"], thermal: "calido",
      tags: ["cocido","rapida","friolento-ok"], limits: null,
      source: "guía p.23", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "infusion-calmante-triple-flor", title: "Infusión Serena de Manzanilla, Caléndula y Lavanda", category: "infusiones",
      time: {"total":8,"active":2}, method: "Infusión floral tapada", servings: 4, servingsEstimated: true,
      ingredients: [
        { text: "1 cucharada sopera de flores secas de manzanilla", qty: 1, unit: "cda", item: "manzanilla", role: "principal", optional: false, suggested: true },
        { text: "1 cucharada sopera de flores secas de caléndula medicinal", qty: 1, unit: "cda", item: "calendula", role: "principal", optional: false, suggested: true },
        { text: "1 cucharada sopera de flores secas de lavanda", qty: 1, unit: "cda", item: "lavanda", role: "principal", optional: false, suggested: true },
        { text: "1 litro de agua hirviendo", qty: 1, unit: "l", item: "agua", role: "basico", optional: false }
      ],
      steps: [
        { text: "Hervir el agua de filtro y retirar del fuego.", timer: null },
        { text: "Poner las tres flores medicinales en una tetera o termo.", timer: null },
        { text: "Verter el agua hirviendo y tapar rápidamente para atrapar los aceites volátiles.", timer: null },
        { text: "Dejar reposar de 8 a 10 minutos.", timer: 480, editorial: true },
        { text: "Colar y beber una taza tibia a media tarde o antes de dormir para inducir relajación muscular y descanso profundo.", timer: null }
      ],
      tip: "De naturaleza neutra, según la guía. Leé antes las contraindicaciones de caléndula y manzanilla en el herbario. No endulzar.", allergens: [], mayContain: [],
      phases: ["monodieta","general"], slots: ["desayuno","almuerzo","merienda","cena"], thermal: "neutro",
      tags: ["cocido","rapida"], limits: null,
      source: "guía p.23", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "compota-manzana", title: "Compota de manzana", category: "desayunos",
      time: {"total":30,"active":5}, timeEstimated: true, method: "Hervido suave", servings: 3, servingsEstimated: true,
      ingredients: [
        { text: "Manzanas peladas y cortadas", qty: null, unit: null, item: "manzana", role: "principal", optional: false },
        { text: "Agua fría para cubrir", qty: null, unit: null, item: "agua", role: "basico", optional: false }
      ],
      steps: [
        { text: "Cortar las manzanas y ponerlas en agua fría.", timer: null },
        { text: "Hervir: cuanto más rato hierven, más dulces se ponen. No lleva azúcar ni miel.", timer: null }
      ],
      tip: "Se puede licuar la compota para el «licuado de compota» o usar el agua de la compota como bebida.", allergens: [], mayContain: [],
      phases: ["monodieta","general"], slots: ["desayuno","merienda"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.5", note: "La guía no da tiempos ni cantidades."
    },
    {
      id: "licuado-jugo-manzana", title: "Licuado o jugo de manzana", category: "jugos",
      time: {"total":5,"active":5}, method: "Licuado o juguera", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "Manzanas verdes o rojas", qty: null, unit: null, item: "manzana", role: "principal", optional: false },
        { text: "Agua (para el licuado)", qty: null, unit: null, item: "agua", role: "basico", optional: false }
      ],
      steps: [
        { text: "Licuar las manzanas con agua, o pasarlas por la juguera.", timer: null },
        { text: "Variante: licuar con agua de compota de manzanas en lugar de agua.", timer: null }
      ],
      tip: "Quienes son friolentos pueden elegir las opciones cocidas (nituke o compota) en lugar del jugo.", allergens: [], mayContain: [],
      phases: ["monodieta","general"], slots: ["desayuno","merienda"], thermal: "fresco",
      tags: ["sin-coccion","rapida","caluroso-ok"], limits: null,
      source: "guía p.5-6", note: null
    },
    {
      id: "arroz-integral-tibio", title: "Arroz integral tibio", category: "almuerzos",
      time: {"total":40,"active":5}, method: "Cocción de granos", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "1 taza de arroz integral, basmati integral, largo fino o yamaní (preferentemente orgánico)", qty: 1, unit: "taza", item: "arroz_yamani", role: "principal", optional: false, suggested: true },
        { text: "2 tazas de agua", qty: 2, unit: "taza", item: "agua", role: "basico", optional: false, suggested: true },
        { text: "1 pizca de sal marina", qty: 1, unit: "pizca", item: "sal_marina", role: "condimento", optional: false, suggested: true },
        { text: "Condimentar solo con sal, gomasio o salsa Shoyu MOA", qty: null, unit: null, item: "shoyu", role: "condimento", optional: true },
        { text: "Si no lo soportás sin aceite: entre ¼ y ½ palta por comida", qty: 0.5, unit: "unidad", item: "palta", role: "principal", optional: true, suggested: true }
      ],
      steps: [
        { text: "Si podés, dejá el arroz en remojo la noche anterior.", timer: null },
        { text: "Llevar el agua con una pizca de sal a hervor, sin tapa y a fuego alto, y agregar el arroz.", timer: null },
        { text: "Una vez hirviendo, bajar a fuego mínimo y tapar. No revolver. Cocinar hasta que se evapore toda el agua.", timer: null },
        { text: "Retirar y dejar reposar de 5 a 10 minutos.", timer: 300, editorial: true },
        { text: "Servir tibio, sin aceite, con sal, gomasio o shoyu MOA.", timer: null }
      ],
      tip: "Se puede cocinar para 2 o 3 días y recalentar al vapor en cacerolita antes de comer; no comerlo frío de la heladera. Los cereales duran aproximadamente 5 días en la heladera.", allergens: [], mayContain: ["semillas","sesamo","soja"],
      phases: ["monodieta","general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","batch","friolento-ok"], limits: null,
      source: "guía p.5, p.6 y p.29", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "gomasio", title: "Gomasio", category: "alinos",
      time: {"total":10,"active":10}, method: "Tostado y molienda", servings: null,
      ingredients: [
        { text: "Sésamo integral", qty: null, unit: null, item: "semillas_sesamo", role: "principal", optional: false },
        { text: "Sal marina", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Tostar el sésamo integral.", timer: null },
        { text: "Moler el sésamo tostado con sal marina.", timer: null },
        { text: "Usar sobre el arroz y las comidas.", timer: null }
      ],
      tip: null, allergens: ["semillas","sesamo"], mayContain: [],
      phases: ["monodieta","general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["sin-coccion","rapida"], limits: null,
      source: "guía p.6", note: "La guía define el gomasio como «sésamo integral tostado y molido con sal marina» pero no da proporciones."
    },
    {
      id: "ensalada-porotos-negros", title: "Ensalada de porotos negros", category: "ensaladas",
      time: {"total":15,"active":15}, method: "Ensamble", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "Un par de puñados de porotos negros cocidos", qty: 2, unit: "puñado", item: "porotos_negros", role: "principal", optional: false, suggested: true },
        { text: "Palta", qty: 1, unit: "unidad", item: "palta", role: "principal", optional: false, suggested: true },
        { text: "Pepino o brócoli blanqueado", qty: null, unit: null, item: "pepino", role: "principal", optional: false },
        { text: "Apio cortado finito", qty: null, unit: null, item: "apio", role: "principal", optional: false },
        { text: "Un puñado de cherrys", qty: 1, unit: "puñado", item: "tomate_cherry", role: "principal", optional: false, suggested: true },
        { text: "Albahaca o perejil", qty: null, unit: null, item: "albahaca", role: "condimento", optional: false },
        { text: "Sal", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Limón", qty: null, unit: null, item: "limon", role: "condimento", optional: false },
        { text: "Aceite de oliva o de lino", qty: null, unit: null, item: "aceite_oliva", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Mezclar los porotos negros cocidos con la palta y abundantes verduras: pepino o brócoli blanqueado, apio cortado finito y los cherrys.", timer: null },
        { text: "Condimentar con albahaca o perejil, sal, limón y aceite de oliva o de lino.", timer: null }
      ],
      tip: "Podés usar un poco del líquido de cocción de los porotos para humedecerlos: es rico y tonificante.", allergens: ["citricos","apio","legumbres"], mayContain: ["semillas"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["cocido","rapida"], limits: null,
      source: "guía p.12", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "ensalada-garbanzos-palta-cherrys", title: "Ensalada de garbanzos con palta y cherrys", category: "ensaladas",
      time: {"total":15,"active":15}, method: "Ensamble", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "Un par de puñados de garbanzos cocidos", qty: 2, unit: "puñado", item: "garbanzos", role: "principal", optional: false, suggested: true },
        { text: "Palta", qty: 1, unit: "unidad", item: "palta", role: "principal", optional: false, suggested: true },
        { text: "Tomates cherry", qty: null, unit: null, item: "tomate_cherry", role: "principal", optional: false },
        { text: "Hojas de albahaca cortadas finitas", qty: null, unit: null, item: "albahaca", role: "condimento", optional: false },
        { text: "Para acompañar: espárragos, chauchas o brócoli blanqueados", qty: null, unit: null, item: "esparragos", role: "principal", optional: true }
      ],
      steps: [
        { text: "Mezclar los garbanzos con la palta, los tomates cherry y la albahaca cortada finita.", timer: null },
        { text: "Acompañar con espárragos, chauchas o brócoli blanqueados.", timer: null }
      ],
      tip: null, allergens: ["legumbres"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["cocido","rapida"], limits: null,
      source: "guía p.13", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "ensalada-quinoa-palta-cherry", title: "Ensalada de quinoa con palta, cherry y morrón", category: "ensaladas",
      time: {"total":25,"active":15}, method: "Ensamble", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "Quinoa (blanca, morada o mix) cocida tibia", qty: null, unit: null, item: "quinoa", role: "principal", optional: false },
        { text: "Palta en cubitos", qty: null, unit: null, item: "palta", role: "principal", optional: false },
        { text: "Tomates cherry cortados al medio", qty: null, unit: null, item: "tomate_cherry", role: "principal", optional: false },
        { text: "Morrón picado chico", qty: null, unit: null, item: "morron", role: "principal", optional: false },
        { text: "Cebolla colorada picada", qty: null, unit: null, item: "cebolla_morada", role: "condimento", optional: false },
        { text: "Sal", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Limón", qty: null, unit: null, item: "limon", role: "condimento", optional: false },
        { text: "Cilantro", qty: null, unit: null, item: "cilantro", role: "condimento", optional: false },
        { text: "Para acompañar: espinaca, espárragos, chauchas o brócoli al vapor", qty: null, unit: null, item: "espinaca", role: "principal", optional: true }
      ],
      steps: [
        { text: "Cocinar la quinoa (1 taza por 2 de agua) y dejarla tibia.", timer: null },
        { text: "Mezclar con la palta en cubitos, los cherry, el morrón y la cebolla colorada.", timer: null },
        { text: "Condimentar con sal, limón y cilantro.", timer: null },
        { text: "Acompañar con espinaca, espárragos, chauchas o brócoli al vapor.", timer: null }
      ],
      tip: null, allergens: ["citricos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["cocido"], limits: null,
      source: "guía p.13", note: null
    },
    {
      id: "alcauciles-con-alino", title: "Alcauciles con aliño de limón", category: "almuerzos",
      time: {"total":40,"active":10}, timeEstimated: true, method: "Vapor + aliño", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "2 alcauciles", qty: 2, unit: "unidad", item: "alcaucil", role: "principal", optional: false },
        { text: "Abundante limón", qty: null, unit: null, item: "limon", role: "condimento", optional: false },
        { text: "Sal", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Aceite de oliva", qty: null, unit: null, item: "aceite_oliva", role: "condimento", optional: false },
        { text: "Vinagre de manzana sin pasteurizar (alternativa al limón)", qty: null, unit: null, item: "vinagre_manzana", role: "condimento", optional: true }
      ],
      steps: [
        { text: "Cocinar los alcauciles (la guía no detalla el método: se aplica el vapor, pág. 27).", timer: null, editorial: true },
        { text: "Aliñar o dejar remojar en un aliño de abundante limón, sal y oliva, o de vinagre de manzana sin pasteurizar.", timer: null },
        { text: "Acompañar con alguna sopa, con bowl de arroz integral o con mayonesa de zanahorias. Otra opción es el aliño de zanahoria rebajado con limón.", timer: null }
      ],
      tip: null, allergens: ["citricos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["cocido"], limits: null,
      source: "guía p.13 y p.18", note: "La guía no indica cantidades ni tiempos de cocción del alcaucil.",
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "ensalada-rucula-cilantro-rabanitos", title: "Ensalada de rúcula, cilantro y rabanitos", category: "ensaladas",
      time: {"total":10,"active":10}, method: "Ensamble", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "Rúcula", qty: null, unit: null, item: "rucula", role: "principal", optional: false },
        { text: "Cilantro", qty: null, unit: null, item: "cilantro", role: "condimento", optional: false },
        { text: "Rabanitos", qty: null, unit: null, item: "rabanitos", role: "principal", optional: false },
        { text: "Cebolla morada fileteada", qty: null, unit: null, item: "cebolla_morada", role: "condimento", optional: false },
        { text: "Sal", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Vinagre de manzana sin pasteurizar", qty: null, unit: null, item: "vinagre_manzana", role: "condimento", optional: false },
        { text: "Jugo de ralladura de jengibre", qty: null, unit: null, item: "jengibre", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Mezclar la rúcula, el cilantro, los rabanitos y la cebolla morada fileteada.", timer: null },
        { text: "Condimentar con sal, vinagre de manzana sin pasteurizar y jugo de ralladura de jengibre.", timer: null },
        { text: "Acompañar con cereal o legumbres.", timer: null }
      ],
      tip: null, allergens: [], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["crudo","rapida","caluroso-ok"], limits: null,
      source: "guía p.13", note: null
    },
    {
      id: "ensalada-remolacha-palta-menta-pepino", title: "Ensalada de remolacha, palta, menta y pepino", category: "ensaladas",
      time: {"total":30,"active":10}, method: "Vapor + ensamble", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "Remolacha al vapor", qty: null, unit: null, item: "remolacha", role: "principal", optional: false },
        { text: "Palta", qty: null, unit: null, item: "palta", role: "principal", optional: false },
        { text: "Menta", qty: null, unit: null, item: "menta", role: "condimento", optional: false },
        { text: "Pepino (con un poco de cáscara) cortado finito", qty: null, unit: null, item: "pepino", role: "principal", optional: false },
        { text: "Arroz integral largo o quinoa", qty: null, unit: null, item: "arroz_yamani", role: "principal", optional: true }
      ],
      steps: [
        { text: "Cocinar la remolacha al vapor.", timer: null },
        { text: "Mezclar con la palta, la menta y el pepino cortado finito, con un poco de cáscara.", timer: null },
        { text: "Servir con arroz integral largo o quinoa.", timer: null }
      ],
      tip: null, allergens: [], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["cocido"], limits: null,
      source: "guía p.13", note: "La guía dice 30 minutos de vapor para una remolacha (pág. 27)."
    },
    {
      id: "esparragos-blanqueados-dijon", title: "Espárragos blanqueados con dijon", category: "almuerzos",
      time: {"total":10,"active":10}, method: "Blanqueado", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "Espárragos", qty: null, unit: null, item: "esparragos", role: "principal", optional: false },
        { text: "Mostaza de Dijon", qty: null, unit: null, item: "mostaza_dijon", role: "condimento", optional: false },
        { text: "½ cucharadita de aceite de oliva", qty: 0.5, unit: "cdita", item: "aceite_oliva", role: "condimento", optional: false, suggested: true },
        { text: "Sal", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Un toque de agua", qty: null, unit: null, item: "agua", role: "basico", optional: false },
        { text: "Limón", qty: null, unit: null, item: "limon", role: "condimento", optional: false },
        { text: "Para acompañar: arroz basmati o porotos mung", qty: null, unit: null, item: "arroz_yamani", role: "principal", optional: true }
      ],
      steps: [
        { text: "Blanquear los espárragos: sumergirlos 1 a 3 minutos en agua hirviendo, hasta que estén cocidos pero aún crocantes.", timer: 60, editorial: true },
        { text: "Preparar el aderezo con mostaza de Dijon, ½ cdita de aceite de oliva, sal, un toque de agua y limón.", timer: null },
        { text: "Servir con una porción de arroz basmati o de porotos mung.", timer: null }
      ],
      tip: null, allergens: ["citricos"], mayContain: ["legumbres"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","rapida","friolento-ok"], limits: null,
      source: "guía p.14", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "ensalada-esparragos-rabanitos", title: "Ensalada de espárragos, rabanitos y arvejas", category: "ensaladas",
      time: {"total":15,"active":15}, method: "Ensamble", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "Espárragos cortados en diagonales (cocidos)", qty: null, unit: null, item: "esparragos", role: "principal", optional: false },
        { text: "Rabanitos fileteados", qty: null, unit: null, item: "rabanitos", role: "principal", optional: false },
        { text: "Arvejas hervidas", qty: null, unit: null, item: "arvejas", role: "principal", optional: false },
        { text: "Aderezo a elección (aliño del recetario)", qty: null, unit: null, item: null, role: "condimento", optional: true }
      ],
      steps: [
        { text: "Cortar los espárragos en diagonales y blanquearlos.", timer: null },
        { text: "Mezclar con los rabanitos fileteados y las arvejas hervidas.", timer: null },
        { text: "Aderezar a elección con alguno de los aliños del recetario.", timer: null }
      ],
      tip: null, allergens: ["legumbres"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["cocido","rapida"], limits: null,
      source: "guía p.14", note: null
    },
    {
      id: "nituke-repollo-colorado-manzana", title: "Nituke de repollo colorado y manzana", category: "almuerzos",
      time: {"total":35,"active":10}, timeEstimated: true, method: "Nituke", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "Repollo colorado", qty: null, unit: null, item: "repollo", role: "principal", optional: false },
        { text: "Manzana (igual cantidad que de repollo)", qty: null, unit: null, item: "manzana", role: "principal", optional: false },
        { text: "Rodajas de jengibre picado finito", qty: null, unit: null, item: "jengibre", role: "condimento", optional: false },
        { text: "Un poco de sal", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Un fondito mínimo de agua", qty: null, unit: null, item: "agua", role: "basico", optional: false }
      ],
      steps: [
        { text: "Cortar el repollo y la manzana en iguales partes.", timer: null },
        { text: "Calentar la cacerola con un fondito mínimo de agua.", timer: null },
        { text: "Cuando esté caliente, incorporar los ingredientes con un poco de sal y el jengibre picado finito.", timer: null },
        { text: "Tapar bien y cocinar a fuego mínimo (pelusa o con difusor) hasta que estén tiernos. Revolver al rato si es necesario.", timer: null }
      ],
      tip: null, allergens: [], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.19", note: "La guía no da el tiempo exacto."
    },
    {
      id: "ensalada-pepino-palta", title: "Ensalada de pepino y palta", category: "ensaladas",
      time: {"total":5,"active":5}, method: "Ensamble", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "1 pepino", qty: 1, unit: "unidad", item: "pepino", role: "principal", optional: false },
        { text: "Palta", qty: null, unit: null, item: "palta", role: "principal", optional: false },
        { text: "Sal", qty: null, unit: null, item: "sal_marina", role: "condimento", optional: false },
        { text: "Limón", qty: null, unit: null, item: "limon", role: "condimento", optional: false },
        { text: "Cilantro", qty: null, unit: null, item: "cilantro", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Cortar el pepino y la palta.", timer: null },
        { text: "Condimentar con sal, limón y cilantro.", timer: null }
      ],
      tip: null, allergens: ["citricos"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "fresco",
      tags: ["crudo","rapida","caluroso-ok"], limits: null,
      source: "guía p.19", note: null
    },
    {
      id: "ensaladas-remolacha", title: "Ensaladas combinadas con remolacha, chauchas y choclo", category: "ensaladas",
      time: {"total":20,"active":15}, method: "Ensamble", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "Remolacha cocida o cruda rallada", qty: null, unit: null, item: "remolacha", role: "principal", optional: false },
        { text: "Chauchas", qty: null, unit: null, item: "chauchas", role: "principal", optional: true },
        { text: "Choclo", qty: null, unit: null, item: "choclo", role: "principal", optional: true },
        { text: "Arvejas", qty: null, unit: null, item: "arvejas", role: "principal", optional: true },
        { text: "Habas peladas", qty: null, unit: null, item: "habas", role: "principal", optional: true },
        { text: "Zanahoria cruda", qty: null, unit: null, item: "zanahoria", role: "principal", optional: true },
        { text: "Nabo rallado crudo", qty: null, unit: null, item: "nabo", role: "principal", optional: true },
        { text: "Albahaca, espinaca o perejil cortados finitos", qty: null, unit: null, item: "albahaca", role: "condimento", optional: true },
        { text: "Brócoli", qty: null, unit: null, item: "brocoli", role: "principal", optional: true },
        { text: "Tomates cherry", qty: null, unit: null, item: "tomate_cherry", role: "principal", optional: true }
      ],
      steps: [
        { text: "Elegir una de las combinaciones de la guía: chaucha y remolacha cocida; choclo y remolacha cocidas; arvejas y remolacha cocida; habas peladas y remolacha cocidas; zanahoria y remolacha cruda con albahaca, espinaca o perejil cortados finitos; zanahoria y nabo rallados crudos con perejil; brócoli, choclo y cherrys.", timer: null },
        { text: "Cortar o rallar y mezclar. Condimentar con algún aliño del recetario.", timer: null }
      ],
      tip: null, allergens: [], mayContain: ["legumbres"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["cocido","rapida"], limits: null,
      source: "guía p.19", note: "Son 7 combinaciones en una sola ficha. Todos los ingredientes figuran como opcionales porque se elige una combinación."
    },
    {
      id: "ensalada-libre", title: "Ensalada libre", category: "ensaladas",
      time: {"total":15,"active":15}, method: "Ensamble", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "2 a 5 cucharadas de arroz o quinoa", qty: 2, qtyMax: 5, unit: "cda", item: "arroz_yamani", role: "principal", optional: false },
        { text: "Champiñones o portobellos crudos o a la plancha sin aceite", qty: null, unit: null, item: "hongos_champi", role: "principal", optional: true },
        { text: "Cebolla morada cortada finita", qty: null, unit: null, item: "cebolla_morada", role: "condimento", optional: true },
        { text: "Hojas de verdeo cortadas finitas", qty: null, unit: null, item: "cebolla_verdeo", role: "condimento", optional: true },
        { text: "Rabanitos rallados o en láminas", qty: null, unit: null, item: "rabanitos", role: "principal", optional: true },
        { text: "Pepino", qty: null, unit: null, item: "pepino", role: "principal", optional: true },
        { text: "Zanahoria rallada cruda o al vapor en cubos", qty: null, unit: null, item: "zanahoria", role: "principal", optional: true },
        { text: "Puntas de espárragos cocidos", qty: null, unit: null, item: "esparragos", role: "principal", optional: true },
        { text: "Zucchinis a la plancha sin aceite", qty: null, unit: null, item: "zucchini", role: "principal", optional: true },
        { text: "Berenjenas a la plancha sin aceite", qty: null, unit: null, item: "berenjena", role: "principal", optional: true },
        { text: "Kale u hojas de espinaca", qty: null, unit: null, item: "espinaca", role: "principal", optional: true },
        { text: "Arvejas al vapor", qty: null, unit: null, item: "arvejas", role: "principal", optional: true },
        { text: "Habas al vapor, peladas", qty: null, unit: null, item: "habas", role: "principal", optional: true },
        { text: "Chauchas al vapor", qty: null, unit: null, item: "chauchas", role: "principal", optional: true },
        { text: "Brócoli blanqueado", qty: null, unit: null, item: "brocoli", role: "principal", optional: true },
        { text: "Morrón en tiritas", qty: null, unit: null, item: "morron", role: "principal", optional: true },
        { text: "Apio cortado finito", qty: null, unit: null, item: "apio", role: "principal", optional: true },
        { text: "Repollo colorado cortado finito", qty: null, unit: null, item: "repollo", role: "principal", optional: true },
        { text: "Nabo rallado crudo", qty: null, unit: null, item: "nabo", role: "principal", optional: true },
        { text: "Rúcula, achicoria o radicheta", qty: null, unit: null, item: "rucula", role: "principal", optional: true },
        { text: "Tomates cherry", qty: null, unit: null, item: "tomate_cherry", role: "principal", optional: true },
        { text: "Albahaca, cilantro o perejil", qty: null, unit: null, item: "albahaca", role: "condimento", optional: true },
        { text: "Brotes de alfalfa, soja, rabanitos o fenogreco", qty: null, unit: null, item: "brotes", role: "principal", optional: true },
        { text: "Cáscara de cítricos rallada", qty: null, unit: null, item: "limon", role: "condimento", optional: true },
        { text: "Flores comestibles", qty: null, unit: null, item: null, role: "condimento", optional: true }
      ],
      steps: [
        { text: "Elegir de 3 a 5 ingredientes de la lista, crudos y cocidos.", timer: null },
        { text: "Mezclar con 2 a 5 cucharadas de arroz o quinoa.", timer: null },
        { text: "Agregar, si querés, albahaca, cilantro, perejil, brotes o cáscara de cítricos rallada. Se puede acompañar con humus de porotos mung.", timer: null }
      ],
      tip: "Todos los ingredientes figuran como opcionales: la receta es «elegí 3 a 5».", allergens: [], mayContain: ["soja","citricos","apio","legumbres"],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: null,
      tags: ["cocido","rapida"], limits: null,
      source: "guía p.12", note: null
    },
    {
      id: "hamburguesa-legumbres", title: "Hamburguesa de legumbres con ensalada", category: "almuerzos",
      time: {"total":20,"active":10}, method: "Horno o sartén antiadherente", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "Hamburguesas de legumbres de dietética (sin harinas blancas 000 ni huevo)", qty: null, unit: null, item: "hamburguesa_legumbres", role: "principal", optional: false },
        { text: "Brócoli o chauchas al vapor", qty: null, unit: null, item: "brocoli", role: "principal", optional: false },
        { text: "Hojas frescas de espinaca", qty: null, unit: null, item: "espinaca", role: "principal", optional: false },
        { text: "Cebolla morada cruda finita", qty: null, unit: null, item: "cebolla_morada", role: "condimento", optional: false },
        { text: "Zanahoria o hinojo rallado", qty: null, unit: null, item: "zanahoria", role: "principal", optional: false },
        { text: "Champiñones", qty: null, unit: null, item: "hongos_champi", role: "principal", optional: false }
      ],
      steps: [
        { text: "Chequear en la etiqueta que no tengan harinas blancas 000 ni huevo.", timer: null },
        { text: "Cocinar directo, sin aceite, al horno o en sartén antiadherente.", timer: null },
        { text: "Servir con ensalada de brócoli o chauchas al vapor, hojas frescas de espinaca, cebolla morada cruda finita, zanahoria o hinojo rallado y champiñones.", timer: null }
      ],
      tip: null, allergens: ["legumbres"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","rapida","friolento-ok"], limits: null,
      source: "guía p.14", note: "La guía no da el tiempo de cocción; depende de la marca."
    },
    {
      id: "batata-al-horno", title: "Batata al horno con brócoli y coliflor", category: "almuerzos",
      time: {"total":50,"active":5}, timeEstimated: true, method: "Horno", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "Batata entera con cáscara, cortada a la mitad", qty: 1, unit: "unidad", item: "batata", role: "principal", optional: false, suggested: true },
        { text: "Brócoli hervido al vapor o blanqueado", qty: null, unit: null, item: "brocoli", role: "principal", optional: false },
        { text: "Coliflor", qty: null, unit: null, item: "coliflor", role: "principal", optional: false },
        { text: "Espinaca", qty: null, unit: null, item: "espinaca", role: "principal", optional: false },
        { text: "Rúcula", qty: null, unit: null, item: "rucula", role: "principal", optional: false },
        { text: "Rabanitos", qty: null, unit: null, item: "rabanitos", role: "principal", optional: false },
        { text: "Cebolla morada", qty: null, unit: null, item: "cebolla_morada", role: "condimento", optional: false },
        { text: "Champiñones", qty: null, unit: null, item: "hongos_champi", role: "principal", optional: false }
      ],
      steps: [
        { text: "Hornear la batata entera, con cáscara, hasta que esté tierna; cortarla a la mitad.", timer: null, editorial: true },
        { text: "Acompañar con brócoli y coliflor hervidos al vapor o blanqueados.", timer: null },
        { text: "Servir con una pequeña ensalada de espinaca, rúcula, rabanitos, cebolla morada y champiñones.", timer: null }
      ],
      tip: null, allergens: [], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: {"perWeek":1},
      source: "guía p.14", note: "Máximo 1 vez por semana, según la guía. No indica temperatura ni tiempo de horno.",
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "fideos-integrales-tomate-brocoli", title: "Fideos integrales con tomate y brócoli", category: "almuerzos",
      time: {"total":20,"active":15}, method: "Hervido", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "Fideos integrales (de quinoa, trigo sarraceno, legumbres, soba, de arroz integral o de centeno)", qty: null, unit: null, item: "fideos_integrales", role: "principal", optional: false },
        { text: "Tomates cherry o perita cortados en cubos", qty: null, unit: null, item: "tomate_cherry", role: "principal", optional: false },
        { text: "Brócoli blanqueado", qty: null, unit: null, item: "brocoli", role: "principal", optional: false },
        { text: "Rúcula", qty: null, unit: null, item: "rucula", role: "principal", optional: false },
        { text: "Ajo o pesto de cilantro o de albahaca", qty: null, unit: null, item: "ajo", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Cocinar los fideos según su paquete.", timer: null, editorial: true },
        { text: "Mezclar con tomates cherry o perita en cubos, brócoli blanqueado y rúcula.", timer: null },
        { text: "Condimentar con ajo o con pesto de cilantro o de albahaca.", timer: null }
      ],
      tip: "Los fideos soba de trigo sarraceno solo se consiguen en el barrio chino.", allergens: ["gluten"], mayContain: [],
      phases: ["general"], slots: ["almuerzo","cena"], thermal: "calido",
      tags: ["cocido","rapida","friolento-ok"], limits: {"perWeek":1},
      source: "guía p.14-15", note: "Si son de trigo integral, 1 o 2 veces durante todo el détox; los de otros granos pueden ser 1 vez por semana.",
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "compota-manzana-frutillas-arandanos", title: "Compota de manzanas con frutillas o arándanos", category: "desayunos",
      time: {"total":30,"active":5}, timeEstimated: true, method: "Hervido suave", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "Manzanas", qty: null, unit: null, item: "manzana", role: "principal", optional: false },
        { text: "Frutillas o arándanos", qty: null, unit: null, item: "frutillas", role: "principal", optional: false },
        { text: "Agua", qty: null, unit: null, item: "agua", role: "basico", optional: false },
        { text: "Para acompañar si rompés el ayuno: almendras tostadas picadas, semillas de lino molidas o nueces picadas", qty: null, unit: null, item: "almendras", role: "principal", optional: true }
      ],
      steps: [
        { text: "Cocinar las manzanas en agua como una compota, sin azúcar ni miel.", timer: null },
        { text: "Sumar las frutillas o los arándanos.", timer: null },
        { text: "Si rompés el ayuno con esta versión, acompañar con almendras tostadas picadas, semillas de lino molidas o nueces picadas.", timer: null }
      ],
      tip: null, allergens: ["frutillas"], mayContain: ["frutos_secos","semillas"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "calido",
      tags: ["cocido","friolento-ok"], limits: null,
      source: "guía p.9", note: "La guía no da cantidades ni tiempos."
    },
    {
      id: "ensalada-frutillas-pomelo", title: "Ensalada fresca de frutillas y pomelo rosado", category: "desayunos",
      time: {"total":10,"active":10}, method: "Ensamble", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "Frutillas agroecológicas o arándanos", qty: null, unit: null, item: "frutillas", role: "principal", optional: false },
        { text: "Pomelo rosado en gajos", qty: null, unit: null, item: "pomelo", role: "principal", optional: false },
        { text: "Para acompañar si rompés el ayuno: almendras tostadas, semillas de lino molidas o nueces", qty: null, unit: null, item: "almendras", role: "principal", optional: true }
      ],
      steps: [
        { text: "Cortar las frutillas y armar los gajos de pomelo rosado.", timer: null },
        { text: "Mezclar y servir. Si rompés el ayuno, acompañar con almendras tostadas picadas, semillas de lino molidas o nueces picadas.", timer: null }
      ],
      tip: "Para friolentos: la guía recomienda las versiones cocidas; las frutas crudas solo si hace calor.", allergens: ["citricos","frutillas"], mayContain: ["frutos_secos","semillas"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "fresco",
      tags: ["crudo","rapida","caluroso-ok"], limits: null,
      source: "guía p.9", note: null
    },
    {
      id: "ensalada-manzana-frutillas-mandarina", title: "Ensalada de manzana, frutillas, mandarina y menta", category: "desayunos",
      time: {"total":10,"active":10}, method: "Ensamble", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "Manzana", qty: null, unit: null, item: "manzana", role: "principal", optional: false },
        { text: "Frutillas agroecológicas", qty: null, unit: null, item: "frutillas", role: "principal", optional: false },
        { text: "Gajos de mandarina cortados a la mitad", qty: null, unit: null, item: "mandarina", role: "principal", optional: false },
        { text: "Arándanos", qty: null, unit: null, item: "arandanos", role: "principal", optional: false },
        { text: "Hojas de menta fresca", qty: null, unit: null, item: "menta", role: "condimento", optional: false },
        { text: "Jugo de jengibre rallado", qty: null, unit: null, item: "jengibre", role: "condimento", optional: true }
      ],
      steps: [
        { text: "Cortar la manzana y las frutillas; sumar los gajos de mandarina cortados a la mitad y los arándanos.", timer: null },
        { text: "Agregar hojas de menta fresca y, opcional, jugo de jengibre rallado.", timer: null }
      ],
      tip: null, allergens: ["citricos","frutillas"], mayContain: [],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "fresco",
      tags: ["crudo","rapida","caluroso-ok"], limits: null,
      source: "guía p.10", note: null
    },
    {
      id: "ensalada-rucula-frutillas-pepino", title: "Ensalada de rúcula, frutillas y pepino", category: "desayunos",
      time: {"total":10,"active":10}, method: "Ensamble", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "Rúcula", qty: null, unit: null, item: "rucula", role: "principal", optional: false },
        { text: "Frutillas", qty: null, unit: null, item: "frutillas", role: "principal", optional: false },
        { text: "Pepinos en rodajas", qty: null, unit: null, item: "pepino", role: "principal", optional: false }
      ],
      steps: [
        { text: "Mezclar la rúcula con las frutillas y el pepino en rodajas.", timer: null }
      ],
      tip: null, allergens: ["frutillas"], mayContain: [],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "fresco",
      tags: ["crudo","rapida","caluroso-ok"], limits: null,
      source: "guía p.10", note: null
    },
    {
      id: "ensalada-hinojo-zanahoria-naranja", title: "Ensalada de hinojo, limón y zanahoria con jugo de naranja", category: "desayunos",
      time: {"total":10,"active":10}, method: "Ensamble", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "Hinojos", qty: null, unit: null, item: "hinojo", role: "principal", optional: false },
        { text: "Ralladura de limón", qty: null, unit: null, item: "limon", role: "condimento", optional: false },
        { text: "Zanahoria", qty: null, unit: null, item: "zanahoria", role: "principal", optional: false },
        { text: "Jugo de naranja", qty: null, unit: null, item: "naranja", role: "principal", optional: false }
      ],
      steps: [
        { text: "Cortar el hinojo y rallar la zanahoria.", timer: null },
        { text: "Mezclar con la ralladura de limón y el jugo de naranja.", timer: null }
      ],
      tip: null, allergens: ["citricos"], mayContain: [],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "fresco",
      tags: ["crudo","rapida","caluroso-ok"], limits: null,
      source: "guía p.10", note: null
    },
    {
      id: "jugo-manzana-mentolado", title: "Jugo de manzana mentolado", category: "jugos",
      time: {"total":5,"active":5}, method: "Juguera", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "3 manzanas verdes", qty: 3, unit: "unidad", item: "manzana", role: "principal", optional: false },
        { text: "¼ de cucharadita de canela", qty: 0.25, unit: "cdita", item: "canela", role: "condimento", optional: false, suggested: true },
        { text: "Jugo de medio limón (se exprime aparte)", qty: 0.5, unit: "unidad", item: "limon", role: "condimento", optional: false },
        { text: "Hojas de menta fresca", qty: null, unit: null, item: "menta", role: "condimento", optional: false },
        { text: "3 rodajas de jengibre", qty: 3, unit: "rodaja", item: "jengibre", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Hacerlo en juguera (vale licuadora: en ese caso se usan menos manzanas y el limón se exprime aparte).", timer: null },
        { text: "También se puede pasar por la bolsa de leches vegetales exprimiéndolo.", timer: null }
      ],
      tip: "Los jugos no son el desayuno indicado para quienes tienen síntomas de frío. Si rompés el ayuno con jugo, acompañalo con 6 almendras o nueces.", allergens: ["citricos"], mayContain: ["frutos_secos"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "fresco",
      tags: ["sin-coccion","rapida","caluroso-ok"], limits: null,
      source: "guía p.11", note: "La guía escribe «1/4c de canela»: se interpretó como ¼ de cucharadita.",
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "licuado-verde-khalo", title: "Licuado verde Khalo", category: "jugos",
      time: {"total":5,"active":5}, method: "Licuado", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "1 kiwi", qty: 1, unit: "unidad", item: "kiwi", role: "principal", optional: false },
        { text: "Un puñado de cilantro", qty: 1, unit: "puñado", item: "cilantro", role: "condimento", optional: false, suggested: true },
        { text: "Un chorro de jugo de limón", qty: null, unit: null, item: "limon", role: "condimento", optional: false },
        { text: "Agua", qty: null, unit: null, item: "agua", role: "basico", optional: false }
      ],
      steps: [
        { text: "Licuar todo junto.", timer: null }
      ],
      tip: "Si rompés el ayuno con jugo, acompañalo con 6 almendras o nueces.", allergens: ["citricos"], mayContain: ["frutos_secos"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "fresco",
      tags: ["sin-coccion","rapida","caluroso-ok"], limits: null,
      source: "guía p.11", note: null,
      editorialNote: "Las cantidades y pasos marcados como «sugerido» no vienen de la guía: son una propuesta del equipo."
    },
    {
      id: "licuado-refrescante", title: "Licuado refrescante", category: "jugos",
      time: {"total":5,"active":5}, method: "Licuado", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "Un puñado de frutillas", qty: 1, unit: "puñado", item: "frutillas", role: "principal", optional: false },
        { text: "½ pepino sin cáscara", qty: 0.5, unit: "unidad", item: "pepino", role: "principal", optional: false },
        { text: "Unas hojas de menta", qty: null, unit: null, item: "menta", role: "condimento", optional: false },
        { text: "Agua si es necesario", qty: null, unit: null, item: "agua", role: "basico", optional: true }
      ],
      steps: [
        { text: "Licuar las frutillas con el pepino y la menta. Si es necesario, agregar agua.", timer: null }
      ],
      tip: null, allergens: ["frutillas"], mayContain: [],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "fresco",
      tags: ["sin-coccion","rapida","caluroso-ok"], limits: null,
      source: "guía p.11", note: null
    },
    {
      id: "jugo-antioxidante", title: "Jugo antioxidante", category: "jugos",
      time: {"total":5,"active":5}, method: "Juguera", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "2 manzanas", qty: 2, unit: "unidad", item: "manzana", role: "principal", optional: false },
        { text: "1 hinojo", qty: 1, unit: "unidad", item: "hinojo", role: "principal", optional: false },
        { text: "1 ramita de perejil", qty: 1, unit: "unidad", item: "perejil", role: "condimento", optional: false },
        { text: "1 rodaja de jengibre", qty: 1, unit: "rodaja", item: "jengibre", role: "condimento", optional: false },
        { text: "Jugo de medio limón", qty: 0.5, unit: "unidad", item: "limon", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Hacer en juguera. También puede hacerse en licuadora agregando un poco de agua, usando menos manzana o pasándolo por bolsa de leches vegetales.", timer: null }
      ],
      tip: "Si rompés el ayuno con jugo, acompañalo con 6 almendras o nueces.", allergens: ["citricos"], mayContain: ["frutos_secos"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: "fresco",
      tags: ["sin-coccion","rapida","caluroso-ok"], limits: null,
      source: "guía p.11", note: null
    },
    {
      id: "tostadas-con-topes", title: "Tostadas con topes", category: "desayunos",
      time: {"total":10,"active":10}, method: "Tostado", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "Tostadas de pan de centeno puro de masa madre", qty: null, unit: null, item: "pan_centeno", role: "principal", optional: false },
        { text: "Alternativa: pan de quinoa y amaranto o pan de trigo sarraceno", qty: null, unit: null, item: "pan_sarraceno", role: "principal", optional: true },
        { text: "Alternativa: galletitas de arroz yamaní o de harina de arroz del recetario, o de semillas", qty: null, unit: null, item: "galletas_arroz", role: "principal", optional: true },
        { text: "Palta pisada o en rodajas", qty: null, unit: null, item: "palta", role: "principal", optional: true },
        { text: "Sal y limón", qty: null, unit: null, item: "limon", role: "condimento", optional: true },
        { text: "Chucrut o kimchi", qty: null, unit: null, item: "chucrut", role: "condimento", optional: true },
        { text: "Un toque de pimienta negra", qty: null, unit: null, item: "pimienta", role: "condimento", optional: true },
        { text: "Lámina de miel", qty: null, unit: null, item: "miel", role: "condimento", optional: true },
        { text: "Tomate (pan y tomaquet)", qty: null, unit: null, item: "tomate", role: "principal", optional: true },
        { text: "Ajo (pan y tomaquet)", qty: null, unit: null, item: "ajo", role: "condimento", optional: true },
        { text: "Aceite de oliva si lo deseás", qty: null, unit: null, item: "aceite_oliva", role: "condimento", optional: true }
      ],
      steps: [
        { text: "Tostar el pan o elegir las galletas del recetario.", timer: null },
        { text: "Elegir un tope: palta pisada o en rodajas con sal, limón y chucrut o kimchi o un toque de pimienta negra; lámina de miel; pan y tomaquet; untable casero de tofu (no usarlo diariamente); humus de porotos mung; babaganoush; untable de hinojo; queso de castañas.", timer: null },
        { text: "Pan y tomaquet: tostar el pan, frotar un ajo sobre su superficie y después frotar un tomate cortado al medio para que largue su pulpa; sal, pimienta y, si querés, oliva.", timer: null }
      ],
      tip: "Galletas comerciales: marcas de semillas deshidratadas tipo pan esenio, o de arroz (no «crackines» ni «molinos»).", allergens: ["gluten"], mayContain: ["frutos_secos","semillas","soja","citricos","legumbres"],
      phases: ["general"], slots: ["desayuno","merienda"], thermal: null,
      tags: ["cocido","rapida"], limits: null,
      source: "guía p.8-9", note: "Es una ficha de combinaciones; los ingredientes son opcionales salvo el pan."
    },
    {
      id: "anana-con-menta", title: "Rodajas de ananá con menta", category: "desayunos",
      time: {"total":5,"active":5}, method: "Corte", servings: 2, servingsEstimated: true,
      ingredients: [
        { text: "Rodajas de ananá con el centro", qty: null, unit: null, item: "anana", role: "principal", optional: false },
        { text: "Menta picada finita", qty: null, unit: null, item: "menta", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Cortar el ananá en rodajas con el centro.", timer: null },
        { text: "Espolvorear con menta picada finita.", timer: null }
      ],
      tip: null, allergens: [], mayContain: [],
      phases: ["general"], slots: ["merienda"], thermal: "fresco",
      tags: ["crudo","rapida","caluroso-ok"], limits: null,
      source: "guía p.19", note: null
    },
    {
      id: "bowl-arroz-rawmesan", title: "Bowl de arroz con rawmesan o gomasio", category: "almuerzos",
      time: {"total":5,"active":5}, method: "Ensamble", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "Arroz integral cocido", qty: null, unit: null, item: "arroz_yamani", role: "principal", optional: false },
        { text: "Mix de semillas tipo rawmesan (ver receta) o gomasio", qty: null, unit: null, item: "mix_rawmesan", role: "condimento", optional: false }
      ],
      steps: [
        { text: "Servir el arroz tibio en un bowl.", timer: null },
        { text: "Espolvorear con el mix de semillas tipo rawmesan o con gomasio.", timer: null }
      ],
      tip: null, allergens: ["semillas","gluten"], mayContain: ["sesamo"],
      phases: ["general"], slots: ["merienda"], thermal: "calido",
      tags: ["cocido","rapida","friolento-ok"], limits: null,
      source: "guía p.20", note: null
    },
    {
      id: "agua-de-lino", title: "Agua de lino", category: "infusiones",
      time: {"total":5,"active":5,"wait":480}, method: "Remojo", servings: 1, servingsEstimated: true,
      ingredients: [
        { text: "1 cucharada de semillas de lino", qty: 1, unit: "cda", item: "semillas_lino", role: "principal", optional: false },
        { text: "1 taza de agua caliente", qty: 1, unit: "taza", item: "agua", role: "basico", optional: false }
      ],
      steps: [
        { text: "Poner 1 cucharada de semillas de lino en remojo con 1 taza de agua caliente.", timer: null },
        { text: "Dejar reposar durante la noche.", timer: null },
        { text: "Beber a la mañana.", timer: null }
      ],
      tip: "Es el quinto escalón de la escalera para la constipación (ver SOS). Con flojera intestinal o diarrea, evitar el lino.", allergens: ["semillas"], mayContain: [],
      phases: ["monodieta","general"], slots: ["desayuno"], thermal: "neutro",
      tags: ["sin-coccion","rapida"], limits: null,
      source: "guía p.7", note: null
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
