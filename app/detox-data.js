// Base de datos oficial del Taller Detox de Primavera - Isa Caparra
// Extraído de las guías y comunicaciones oficiales (Septiembre 2026)

const DETOX_DATA = {
  info: {
    title: "Detox de Primavera",
    guia: "Isabel Caparra",
    contactoEmail: "isabelcaparramtc@gmail.com",
    contactoWhatsApp: "+54 9 11 5709-5441",
    grupoWhatsAppUrl: "https://chat.whatsapp.com/DkP14EhdEqk0A7rFz6jcap?s=cl&p=a&mlu=4&ilr=4",
    meetUrl: "https://meet.google.com/jgi-psdh-aak",
    meetFechas: [
      { fecha: "Lunes 28 de Septiembre 2026", hora: "18:30 hs", motivo: "Resolución de dudas antes de empezar" },
      { fecha: "Miércoles 14 de Octubre 2026", hora: "18:30 hs", motivo: "Encuentro de seguimiento y consultas en vivo" }
    ],
    videos: [
      { id: "4-anhQirqug", titulo: "Primer encuentro grabado (Esencial antes de empezar)", url: "https://youtu.be/4-anhQirqug" },
      { id: "ap8eZGPi4-Y", titulo: "Segundo encuentro grabado", url: "https://youtu.be/ap8eZGPi4-Y" }
    ],
    productores: [
      { nombre: "Enzo (Verduras orgánicas y Salsa Shoyu MOA)", tel: "11 4065-0088", nota: "Venta directa del productor, mitad de precio que en dietéticas." },
      { nombre: "Soledad - Kalimera Alimentos", tel: "+54 9 11 5881-2907", nota: "Panes de sarraceno aptos, chucrut y vinagre de manzana vivo a domicilio." },
      { nombre: "Tienda Macrobiótica Mario Levenson", tel: "11 7365-8388", ig: "@genmail.tiendanatural", nota: "Barrio Almagro. Shoyu MOA y alimentos macrobióticos." },
      { nombre: "Círculo Once", tel: "11 5134-6546", ig: "@circuloonce", nota: "Alimentos naturales y fermentos seleccionados." }
    ]
  },

  gamification: {
    xpPerMission: 15,
    xpPerDayComplete: 50,
    dailyMissions: [
      { id: "limon", text: "Agua tibia con 1/2 limón en ayunas", icon: "citrus", tip: "Si sos friolento, agregale pizca de jengibre." },
      { id: "masticacion", text: "Masticar al menos 20 veces por bocado", icon: "utensils", tip: "Comer siempre sentado, tranquilo, no parado ni manejando." },
      { id: "infusion", text: "2 a 4 tazas de infusión depurativa (ortiga/diente de león)", icon: "coffee", tip: "Sin endulzar nunca." },
      { id: "no_estimulantes", text: "Cero café, yerba mate tradicional, alcohol ni azúcar", icon: "shield-alert", tip: "Si necesitás bombillear, usá mate 100% de yuyos." },
      { id: "hidratacion", text: "Termo de agua tibia a lo largo del día", icon: "droplet", tip: "Tonifica el sistema digestivo y drena toxinas." },
      { id: "plato_verde", text: "Al menos una comida abundante en crucíferas o verdes", icon: "leaf", tip: "Brócoli, coliflor, espinaca o repollitos al vapor/nituke." }
    ],
    badges: [
      { id: "inicio", title: "Primer Paso", desc: "Completaste las misiones del Día 1", icon: "seedling", requiredDays: 1, xp: 50 },
      { id: "monodieta", title: "Purificación Inicial", desc: "Superaste los días de manzana y arroz integral", icon: "apple", requiredDays: 3, xp: 100 },
      { id: "adios_cafeina", title: "Libre de Estimulantes", desc: "3 días consecutivos sin café ni yerba mate tradicional", icon: "zap-off", requiredDays: 3, xp: 100 },
      { id: "semana1", title: "Semana Impecable", desc: "Completaste los primeros 7 días de detox", icon: "flame", requiredDays: 7, xp: 200 },
      { id: "maestro_nituke", title: "Chef Consciente", desc: "14 días comiendo platos limpios y masticando con presencia", icon: "chef-hat", requiredDays: 14, xp: 300 },
      { id: "detox_champion", title: "Renacimiento de Primavera", desc: "Completaste los 21 días de detox con éxito", icon: "trophy", requiredDays: 21, xp: 500 }
    ]
  },

  cookingMethods: [
    {
      id: "nituke",
      nombre: "Cocimiento sin agua (Nituke)",
      desc: "Cocción tradicional en cacerola pesada tapada herméticamente a fuego pelusa o con difusor.",
      pasos: [
        "Poner 2 cucharadas soperas de agua en una cacerola de fondo grueso.",
        "Agregar las verduras cortadas (ej. manzanas, zanahorias, cebollas) con una pizca de sal marina.",
        "Tapar bien y cocinar a fuego ultra bajo (fuego pelusa) durante 35-40 minutos.",
        "El vapor generado en el fondo cocina los alimentos concentrando sus azúcares naturales."
      ]
    },
    {
      id: "vapor",
      nombre: "Cocción al Vapor",
      desc: "La técnica reina para conservar vitaminas hidrosolubles y clorofila.",
      pasos: [
        "Usar vaporera de bambú, canasta de acero o rejilla sobre agua hirviendo sin que toque los vegetales.",
        "Crucíferas (brócoli, coliflor): 5 a 7 minutos para que queden crocantes y de verde brillante.",
        "Hojas verdes (espinaca, kale): 2 a 3 minutos apenas ablandadas.",
        "Aliñar una vez servido con aceite de oliva crudo y sal marina."
      ]
    },
    {
      id: "salteado_agua",
      nombre: "Salteado en Agua (Sin Aceite)",
      desc: "Prohibido saltear en aceite caliente durante el detox; se saltea con cucharadas de agua o caldo.",
      pasos: [
        "Calentar sartén o wok a fuego medio-alto.",
        "Agregar los vegetales picados y 2 cucharadas de agua o caldo.",
        "Revolver constantemente para que no se pegue; si se seca antes de dorar, agregar otra cucharada de agua.",
        "Al retirar del fuego y servir en el plato, agregar un hilo de aceite de oliva crudo prensado en frío."
      ]
    },
    {
      id: "legumbres_digestivas",
      nombre: "Cocción Digestiva de Legumbres",
      desc: "Protocolo para evitar gases y digestiones pesadas con porotos mung o aduki.",
      pasos: [
        "Remojo obligatorio: dejar las legumbres en abundante agua entre 8 y 12 horas.",
        "Desechar completamente el agua de remojo y enjuagar bien.",
        "Cocinar en olla con agua fresca que duplique el volumen, agregando un trozo de alga kombu o laurel.",
        "Espumar continuamente los primeros 10 minutos de hervor para retirar saponinas.",
        "Agregar la sal SIEMPRE al final de la cocción, cuando el grano ya esté tierno."
      ]
    }
  ],

  recipes: [
    {
      id: "caldo-detox",
      titulo: "Caldo Détox Alcalinizante",
      categoria: "caldos",
      tiempo: "35 min",
      metodo: "Hervido suave tapado",
      ingredientes: [
        "4 pencas de apio cortadas",
        "2 dientes de ajo enteros aplastados",
        "1 a 2 puerros cortados",
        "1/2 alcaucil (si hay en estación)",
        "1 taza de repollo blanco en tiras",
        "1 o 2 zanahorias en rodajas",
        "1 puñado de perejil fresco",
        "1 manzana entera con corazón y semillas",
        "Sal marina a gusto"
      ],
      pasos: [
        "Colocar todas las verduras y la manzana en una olla grande.",
        "Llenar con agua fría duplicando holgadamente el volumen de los vegetales (unos 5 cm por encima).",
        "Hervir tapado a fuego mínimo durante 35-40 minutos hasta que el caldo tome color y sabor profundo.",
        "Colar el líquido y descartar las verduras (o usarlas para compost).",
        "Tomar caliente o tibio a lo largo del día o antes de las comidas."
      ],
      tip: "La manzana aporta pectina y equilibra la acidez mineral del caldo."
    },
    {
      id: "nituke-manzana",
      titulo: "Nituke de Manzana (Desayuno / Merienda)",
      categoria: "desayunos",
      tiempo: "40 min",
      metodo: "Nituke",
      ingredientes: [
        "3 o 4 manzanas rojas o verdes peladas y en cubos",
        "2 cucharadas soperas de agua",
        "1 pizca de sal marina",
        "Opcional: Almendras tostadas picadas o semillas de lino molidas"
      ],
      pasos: [
        "Calentar cacerola de fondo grueso con las 2 cucharadas de agua.",
        "Agregar las manzanas y la pizca de sal.",
        "Tapar herméticamente y dejar 40 minutos a fuego pelusa.",
        "Cuanto más tiempo cocine, más dulce se vuelve por concentración natural.",
        "Servir tibio espolvoreado con almendras picadas."
      ],
      tip: "Es el desayuno ideal para la monodieta y para personas friolentas."
    },
    {
      id: "hummus-mung",
      titulo: "Hummus de Porotos Mung",
      categoria: "dips",
      tiempo: "15 min (con porotos ya cocidos)",
      metodo: "Procesado en frío",
      ingredientes: [
        "2 tazas de porotos mung cocidos y tiernos",
        "1/4 a 1/2 taza del líquido de cocción del mung",
        "1 diente de ajo pequeño",
        "1 puñado de hojas frescas de albahaca",
        "1 cucharada de aceite de oliva extra virgen",
        "Gotitas de jugo de limón",
        "Sal marina a gusto"
      ],
      pasos: [
        "Colocar los porotos mung tibios en procesadora o vaso de minipimmer.",
        "Sumar el ajo, albahaca, aceite de oliva, limón y sal.",
        "Procesar agregando de a poco el líquido de cocción hasta lograr una textura cremosa y untable.",
        "Servir con un chorrito de oliva crudo y páprika o sésamo por encima."
      ],
      tip: "El poroto mung no genera flatulencias como otras legumbres y es altamente depurativo."
    },
    {
      id: "mayonesa-zanahoria",
      titulo: "Mayonesa Suave de Zanahoria",
      categoria: "dips",
      tiempo: "20 min",
      metodo: "Hervido + Procesado",
      ingredientes: [
        "4 zanahorias peladas",
        "1 trozo pequeño de zapallo anco (aporta cremosidad)",
        "1/2 puerro o trozo de cebolla",
        "1 diente de ajo",
        "1 cucharada de aceite de oliva crudo",
        "Abundante jugo de limón fresco",
        "Sal marina a gusto",
        "Opcional: 3 o 4 aceitunas negras descarozadas"
      ],
      pasos: [
        "Hervir las zanahorias, zapallo y puerro desde agua fría hasta que estén super tiernos.",
        "Reservar el líquido de cocción (¡es muy dulce y sabroso!).",
        "Procesar las verduras con el ajo, aceite de oliva, limón, sal y el líquido de cocción necesario para emulsionar.",
        "Guardar en frasco de vidrio en heladera hasta por 4 días."
      ],
      tip: "Excelente aliño diluido con más limón para ensaladas de hojas amargas."
    },
    {
      id: "babaganoush",
      titulo: "Babaganoush Ahumado sin Aceite Cocido",
      categoria: "dips",
      tiempo: "25 min",
      metodo: "Asado a la llama",
      ingredientes: [
        "2 berenjenas medianas enteras",
        "1/2 diente de ajo rallado",
        "Jugo de 1/2 limón",
        "1 cucharada de aceite de oliva virgen extra en crudo",
        "Sal marina y pizca de comino"
      ],
      pasos: [
        "Colocar las berenjenas directo sobre el fuego de la hornalla, rotándolas con pinza hasta carbonizar la piel por completo y sentirlas blandas.",
        "Meter en una bolsa limpia cerrada unos 10 minutos para que el vapor ayude a desprender la piel.",
        "Pelar retirando los restos carbonizados y quedándose con la pulpa suave.",
        "Pisar con tenedor junto con el ajo, limón, sal marina y oliva crudo."
      ],
      tip: "El sabor ahumado reemplaza la necesidad de salsas pesadas."
    },
    {
      id: "queso-caju",
      titulo: "Queso Untable de Castañas de Cajú",
      categoria: "dips",
      tiempo: "10 min + remojo",
      metodo: "Remojo + Licuado",
      ingredientes: [
        "1 taza de castañas de cajú crudas sin sal (remojadas 8 hs)",
        "1/4 a 1/2 taza de agua limpia de filtro",
        "1 pizca de sal marina",
        "Gotitas de limón",
        "Opcional: Levadura nutricional o hierbas frescas picadas"
      ],
      pasos: [
        "Desechar el agua de remojo de las castañas de cajú.",
        "Licuar a potencia máxima con el agua fresca, sal y limón hasta que no queden grumos y parezca queso crema.",
        "Guardar en frasco cerrado en la heladera hasta por 5 días."
      ],
      tip: "Si le agregás 1 cápsula de probiótico y lo dejás 12 hs a temperatura ambiente, fermenta en queso probiótico ácido."
    },
    {
      id: "galletas-yamani",
      titulo: "Maravillosas Galletas de Arroz Yamaní",
      categoria: "panificados",
      tiempo: "30 min",
      metodo: "Horno 180°C",
      ingredientes: [
        "1 taza de arroz yamaní cocido pasado (1 taza arroz x 3 de agua)",
        "1 taza de harina de arroz integral",
        "4 cucharadas de semillas de lino",
        "2 cucharadas de aceite de oliva",
        "Chorrito de agua tibia (apenas para unir)",
        "Sal marina y hierbas secas (orégano, tomillo o cúrcuma)"
      ],
      pasos: [
        "Amasar el arroz cocido con las manos para que libere el almidón y se pegotee.",
        "Mezclar con la harina de arroz, lino, aceite, sal y condimentos.",
        "Agregar apenas el agua necesaria para armar una masa unida.",
        "Formar bolitas pequeñas y aplastarlas bien finitas sobre placa para horno con papel o silicona.",
        "Hornear a 180°C durante 10-12 minutos hasta que estén doradas y crocantes."
      ],
      tip: "Reemplazo crujiente ideal para las tostadas industriales de paquete."
    },
    {
      id: "pan-centeno-masamadre",
      titulo: "Pan de Centeno 100% de Masa Madre",
      categoria: "panificados",
      tiempo: "Leudado largo + 50 min horno",
      metodo: "Fermentación natural y horneado",
      ingredientes: [
        "1 kg de harina de centeno integral pura",
        "2 tazas de fermento de masa madre activo",
        "1 cucharada colmada de sal marina",
        "800 ml de agua tibia"
      ],
      pasos: [
        "Mezclar la harina con la sal marina e integrar el fermento y el agua.",
        "Amasar (queda una textura pegajosa típica del centeno).",
        "Dejar levar entre 8 y 12 horas en bowl cubierto a temperatura ambiente.",
        "Dar forma a dos panes de molde aceitados y dejar reposar 2 horas más.",
        "Hornear a fuego medio (180°C) durante 50 minutos. Está listo cuando suena hueco al golpear la base."
      ],
      tip: "Si no tenés tiempo para hornearlo, compralo en locales como Hausbrot o Le Pain Quotidien, cortalo en rodajas y freezalo."
    },
    {
      id: "chucrut-casero",
      titulo: "Chucrut Probiótico Vivo",
      categoria: "fermentos",
      tiempo: "20 min prep + 21 días fermento",
      metodo: "Fermentación láctica anaeróbica",
      ingredientes: [
        "1 repollo agroecológico (blanco o morado)",
        "Sal marina (20 a 25 g por cada kilo de repollo picado, aprox 2% a 2.5%)"
      ],
      pasos: [
        "Retirar y reservar intactas un par de hojas externas limpias del repollo.",
        "Picar el repollo muy finito en tiras y pesarlo.",
        "Pesar el 2% de sal marina correspondiente y mezclar con el repollo picado.",
        "Amasar intensamente con las manos durante 5-8 minutos hasta que libere abundante líquido (salmuera propia).",
        "Envasar en frasco de vidrio bien limpio, empujando con el puño para que no queden burbujas de aire.",
        "Cubrir con las hojas exteriores reservadas y poner un peso para que todo quede sumergido bajo el líquido.",
        "Tapar y dejar fermentar en oscuridad a temperatura ambiente por 21 a 28 días antes de llevar a heladera."
      ],
      tip: "1 cucharadita diaria antes de almorzar aporta billones de lactobacilos para restaurar la microbiota."
    },
    {
      id: "leche-almendras",
      titulo: "Leche Fresca de Almendras",
      categoria: "leches",
      tiempo: "10 min + remojo previo",
      metodo: "Licuado + Filtrado en tela",
      ingredientes: [
        "100 g de almendras crudas (remojadas 8 a 12 hs)",
        "1 litro de agua de filtro limpia",
        "Opcional: pizca de sal marina o canela"
      ],
      pasos: [
        "Tirar el agua de remojo de las almendras.",
        "Poner las almendras en licuadora con el litro de agua fresca.",
        "Licuar a potencia máxima durante 2 minutos hasta que el líquido quede blanco y cremoso.",
        "Colar a través de una bolsa de tela para leches vegetales o colador ultra fino, apretando bien la pulpa.",
        "Guardar en botella de vidrio tapada en la heladera por 4 a 5 días."
      ],
      tip: "La pulpa sobrante (bagazo) se puede hornear para hacer galletas o sumar a masas."
    },
    {
      id: "bowl-yamani-cruciferas",
      titulo: "Bowl Alcalino de Yamaní y Crucíferas",
      categoria: "almuerzos",
      tiempo: "25 min",
      metodo: "Vapor + Ensamble",
      ingredientes: [
        "1 taza de arroz yamaní cocido caliente",
        "1 taza de ramilletes de brócoli al vapor (5 min)",
        "1 taza de coliflor al vapor (6 min)",
        "1/2 taza de porotos mung cocidos",
        "1/4 de palta en láminas",
        "1 cucharadita de chucrut vivo",
        "Aliño: 1 cda de aceite de oliva crudo, gotas de salsa Shoyu MOA y jugo de limón"
      ],
      pasos: [
        "Disponer el arroz yamaní tibio en la base de un bowl amplio.",
        "Acomodar a los lados el brócoli, coliflor y porotos mung.",
        "Sumar la palta fresca y la cucharada de chucrut vivo al costado.",
        "Rociar con el aceite de oliva, la salsa Shoyu MOA y el jugo de limón antes de servir."
      ],
      tip: "El plato perfecto que reúne carbohidrato complejo, proteína vegetal, verde amargo y probiótico."
    }
  ],

  foodTrafficLight: [
    // VERDE: LIBRE Y PROMOVIDO
    { nombre: "Arroz Yamaní e Integral", estado: "green", cat: "Granos", desc: "Base energética del plan. Sin gluten, drena toxinas y calma el tracto digestivo." },
    { nombre: "Porotos Mung", estado: "green", cat: "Legumbres", desc: "La legumbre estrella del detox. Muy digestiva, alta en proteínas y de fácil asimilación." },
    { nombre: "Brócoli y Coliflor", estado: "green", cat: "Verduras", desc: "Crucíferas ricas en sulforafano, compuesto clave para la fase 2 de detoxificación hepática." },
    { nombre: "Repollitos de Bruselas", estado: "green", cat: "Verduras", desc: "Estimulante del hígado y la vesícula. Consumir al vapor o salteado en agua." },
    { nombre: "Manzana verde y roja", estado: "green", cat: "Frutas", desc: "Rica en ácido málico y pectina; ablanda posibles cálculos y limpia el colon." },
    { nombre: "Limón", estado: "green", cat: "Cítricos", desc: "Alcalinizante sistémico. Tomar en ayunas con agua tibia para activar el peristaltismo." },
    { nombre: "Aceite de Oliva Extra Virgen", estado: "green", cat: "Grasas", desc: "Solo en crudo prensado en frío. Jamás cocinar con él durante el detox." },
    { nombre: "Quinoa", estado: "green", cat: "Granos", desc: "Pseudocereal completo rico en aminoácidos. Lavar bien antes de hervir." },
    { nombre: "Espinaca y Kale", estado: "green", cat: "Verduras", desc: "Clorofila pura para oxigenar la sangre. Preferir cocidas si sos friolento." },
    { nombre: "Apio y Puerro", estado: "green", cat: "Verduras", desc: "Diuréticos y limpiadores renales por excelencia. Base infalible del caldo detox." },
    { nombre: "Remolacha", estado: "green", cat: "Verduras", desc: "Tónico hepático y hematopoyético. Consumir al vapor, en sopa o en pickles." },
    { nombre: "Chucrut y Kimchi vivos", estado: "green", cat: "Fermentos", desc: "Aporte de bacterias vivas sin pasteurizar para regenerar la flora intestinal." },
    { nombre: "Infusión de Ortiga y Diente de León", estado: "green", cat: "Bebidas", desc: "El dúo fitoterápico maestro: riñón e hígado trabajando al unísono." },
    { nombre: "Mate 100% de Hierbas (Yuyos)", estado: "green", cat: "Bebidas", desc: "Apto para bombillear. Menta, cedrón, manzanilla, llantén, cola de caballo, ortiga, cáscaras secas de cítricos y stevia pura en hoja. Cero yerba mate." },
    { nombre: "Salsa Shoyu MOA", estado: "green", cat: "Condimentos", desc: "Fermentación natural de soja sin azúcar ni agregados químicos." },
    { nombre: "Semillas de Lino y Chía", estado: "green", cat: "Semillas", desc: "Aporte de omega 3 y mucílago para regular el tránsito intestinal. Precaución: Evitar el lino en caso de flojera intestinal o diarrea aguda." },

    // AMARILLO: MODERACIÓN O SITUACIONES PUNTUALES
    { nombre: "Té verde, Banchá o Matcha", estado: "yellow", cat: "Bebidas", desc: "Permitido los primeros 2 o 3 días para mitigar abstinencia de café. No abusar." },
    { nombre: "Pescado fresco (blanco o azul)", estado: "yellow", cat: "Proteínas", desc: "Válvula de escape: al mediodía al vapor si sentís debilidad o fatiga marcada." },
    { nombre: "Huevos pastoriles", estado: "yellow", cat: "Proteínas", desc: "Máximo 1 o 2 al mediodía si no podés sostener el régimen vegetal estricto." },
    { nombre: "Caldo de Huesos pastoril", estado: "yellow", cat: "Proteínas", desc: "Opción reconstituyente si hay frío interno o debilidad extrema." },
    { nombre: "Pan 100% centeno masa madre", estado: "yellow", cat: "Panificados", desc: "Apto solo si es puro centeno con fermento natural, tostado en desayuno." },
    { nombre: "Palta", estado: "yellow", cat: "Grasas", desc: "Grasa saludable pero concentrada. Limitar a 1/4 o 1/2 unidad por comida." },
    { nombre: "Castañas de Cajú y Almendras", estado: "yellow", cat: "Frutos Secos", desc: "Para leches o quesos caseros. Siempre activadas/remojadas previamente." },
    { nombre: "Agua de Mar", estado: "yellow", cat: "Suplementos", desc: "Solo a partir del día 7 y diluida (1/4 vaso de mar, 3/4 dulce). No al inicio." },
    { nombre: "Chlorella y Espirulina", estado: "yellow", cat: "Suplementos", desc: "Microalgas depurativas opcionales. Empezar con 1/4 cdita. Contraindicadas en hipertiroidismo; chlorella es más templada y apta para friolentos." },
    { nombre: "Carbón Activado", estado: "yellow", cat: "Suplementos", desc: "Uso puntual para gases, diarrea o crisis depurativa. Tomar antes de dormir, separado al menos 2 horas de cualquier medicación o suplemento para no anular su absorción." },
    { nombre: "Wheatgrass (Pasto de Trigo)", estado: "yellow", cat: "Suplementos", desc: "Depurativo alcalinizante potente. De naturaleza muy fría: contraindicado si tenés síntomas de frío o manos/pies fríos." },

    // ROJO: TOTALMENTE RESTRINGIDO / PROHIBIDO
    { nombre: "Café de cualquier tipo", estado: "red", cat: "Estimulantes", desc: "Sobrecarga la fase 1 hepática, irrita la mucosa gástrica y agota suprarrenales." },
    { nombre: "Yerba Mate tradicional", estado: "red", cat: "Estimulantes", desc: "Contiene mateína y acidez. Reemplazar por mate 100% de yuyos o té verde." },
    { nombre: "Alcohol (vino, cerveza, licores)", estado: "red", cat: "Bebidas", desc: "Tóxico celular directo. Bloquea la autofagia y la depuración hepática." },
    { nombre: "Lácteos y derivados animales", estado: "red", cat: "Lácteos", desc: "Leche, quesos, yogur, manteca. Generan mucosidad, inflamación y congestión biliar." },
    { nombre: "Harinas blancas refinadas", estado: "red", cat: "Harinas", desc: "Pastas comunes, galletitas, panadería tradicional. Provocan picos glucémicos y fermentación intestinal." },
    { nombre: "Azúcar y edulcorantes artificiales", estado: "red", cat: "Dulces", desc: "Alimentan bacterias patógenas y saturan el hígado graso. Las infusiones van sin endulzar." },
    { nombre: "Carnes rojas, embutidos y pollo industrial", estado: "red", cat: "Proteínas", desc: "Sobrecargan el filtro hepatorrenal con purinas y ácido úrico. Si requerís proteína animal por debilidad, recurrí exclusivamente a pescado fresco o huevos pastoriles." },
    { nombre: "Cocinar con aceite (Frituras)", estado: "red", cat: "Cocción", desc: "El aceite caliente genera acroleínas tóxicas. Solo cocinar con vapor, agua o nituke." },
    { nombre: "Ultraprocesados y Margarinas", estado: "red", cat: "Industriales", desc: "Grasas trans y conservantes químicos que saturan el filtro del hígado." },
    { nombre: "Gaseosas y jugos envasados", estado: "red", cat: "Bebidas", desc: "Cargados de jarabe de maíz de alta fructosa (JMAF) y químicos." }
  ],

  sosProtocols: [
    {
      sintoma: "Constipación / Estreñimiento",
      icono: "alert-circle",
      causa: "Reacción típica al retirar la cafeína y estimulantes irritantes del intestino.",
      pasos: [
        "1. Tomar 2 vasos de agua tibia al despertarte antes de cualquier alimento.",
        "2. Probar 1 vaso de agua tibia con 1 cucharada sopera de vinagre de manzana vivo.",
        "3. Tomar 1 cucharada sopera de aceite de oliva con limón antes del almuerzo.",
        "4. Agua de lino: dejar 1 cda de semillas de lino en remojo en 1 taza de agua caliente toda la noche; beber a la mañana con semillas incluidas.",
        "5. Si persiste: 1 cdita de semillas de psyllium en un vaso grande de agua en ayunas."
      ]
    },
    {
      sintoma: "Flojera intestinal / Diarrea",
      icono: "wind",
      causa: "Eliminación acelerada de toxinas o adaptación al brusco incremento de fibra.",
      pasos: [
        "1. Tomar 1 cucharadita de polvo de psyllium en 1/2 vaso de agua al levantarte (absorbe líquido y da volumen).",
        "2. Tomar 1 comprimido de carbón activado antes de dormir (al menos 2 hs lejos de remedios o suplementos).",
        "3. Reponer minerales: agua mineral con una pizca de sal marina o electrolitos naturales.",
        "4. Beber infusiones templadas de manzanilla o hinojo para relajar la musculatura entérica."
      ]
    },
    {
      sintoma: "Sensación de frío corporal / Manos frías",
      icono: "thermometer-snowflake",
      causa: "Descenso de grasas densas y carnes; constitución 'Yin' o viento frío digestivo.",
      pasos: [
        "1. Cero jugos crudos ni ensaladas frías: todo lo que ingieras debe ser caliente o tibio.",
        "2. Agregar una puntita de jengibre seco o canela al agua con limón matutina.",
        "3. Basar las comidas en caldos espesos, sopas con mijo o arroz yamaní caliente y verduras al vapor/nituke.",
        "4. Mantener un termo de agua caliente con infusión de albahaca y jengibre fresco a mano todo el día."
      ]
    },
    {
      sintoma: "Dolor de cabeza / Jaqueca / Mal humor",
      icono: "frown",
      causa: "Síndrome de abstinencia a la cafeína y movilización masiva de toxinas en sangre.",
      pasos: [
        "1. Tomar una taza de té verde suave, té banchá o matcha (amortigua el shock sin irritar).",
        "2. Tomar infusión de menta fresca con jengibre o flores de lavanda para despejar la tensión.",
        "3. Aumentar drásticamente la ingesta de agua tibia; la deshidratación agrava el dolor de cabeza.",
        "4. Si es muy molesto, aplicar una toalla húmeda fría en la nuca y descansar en penumbra 20 minutos."
      ]
    },
    {
      sintoma: "Debilidad extrema / Falta de energía",
      icono: "battery-low",
      causa: "Falta de costumbre al déficit de grasa animal o aporte calórico bajo.",
      pasos: [
        "1. No pasar hambre: podés repetir las porciones de arroz yamaní, quinoa o porotos mung.",
        "2. Sumar al mediodía un filete de pescado fresco cocido al vapor o a la plancha con espárragos.",
        "3. Como alternativa, incorporar 1 o 2 huevos pastoriles pasados por agua o en revuelto sin aceite.",
        "4. Tomar una taza de caldo de huesos largo antes de almorzar."
      ]
    },
    {
      sintoma: "Acidez / Reflujo gástrico",
      icono: "flame",
      causa: "Reajuste del pH gástrico al retirar estimulantes o consumo inadecuado de líquidos fríos durante las comidas.",
      pasos: [
        "1. Beber infusión templada de manzanilla, llantén o hinojo (efecto emoliente y calmante de la mucosa).",
        "2. Evitar beber agua fría o exceso de líquido durante el almuerzo o cena (diluye el ácido clorhídrico).",
        "3. Priorizar preparaciones cocidas y calientes (caldos alcalinos, verduras al vapor o nituke de manzana); suspender crudos.",
        "4. Masticar religiosamente un mínimo de 20 veces por bocado para predigerir con saliva alcalina.",
        "5. Si el ardor es matutino: suspender temporalmente el limón en ayunas y reemplazarlo por 1 taza de caldo detox tibio o infusión de manzanilla."
      ]
    },
    {
      sintoma: "Mareos / Baja de presión / Hipotensión",
      icono: "compass",
      causa: "Descenso abrupto de sodio industrial, corte de cafeína y relajación del tono vascular periférico.",
      pasos: [
        "1. Sentarse o recostarse de inmediato, elevando las piernas a 45° durante 10 a 15 minutos.",
        "2. Poner una pizca de sal marina pura bajo la lengua o disolver 1/4 cdita en 1/2 vaso de agua tibia.",
        "3. Tomar una taza de caldo vegetal tibio o infusión tonificante de jengibre fresco con albahaca.",
        "4. Asegurar que las porciones de arroz yamaní o quinoa en las comidas principales sean suficientes para estabilizar la glucemia.",
        "5. Evitar incorporarse bruscamente de la cama o la silla; realizar respiraciones profundas y lentas."
      ]
    }
  ],

  shoppingList: [
    // VERDULERÍA
    { id: "v1", item: "Manzanas rojas o verdes (agroecológicas)", cat: "Verdulería", cant: "3 a 5 kg", esencial: true },
    { id: "v2", item: "Limones frescos", cat: "Verdulería", cant: "1 a 2 docenas", esencial: true },
    { id: "v3", item: "Jengibre fresco", cat: "Verdulería", cant: "2 raíces", esencial: true },
    { id: "v4", item: "Brócoli fresco", cat: "Verdulería", cant: "2 plantas", esencial: true },
    { id: "v5", item: "Coliflor", cat: "Verdulería", cant: "1 planta", esencial: true },
    { id: "v6", item: "Repollitos de Bruselas o Repollo", cat: "Verdulería", cant: "1 bandeja / 1 repollo", esencial: true },
    { id: "v7", item: "Zanahorias", cat: "Verdulería", cant: "2 kg", esencial: true },
    { id: "v8", item: "Remolachas con hojas", cat: "Verdulería", cant: "2 atados", esencial: true },
    { id: "v9", item: "Espinacas frescas", cat: "Verdulería", cant: "2 atados", esencial: true },
    { id: "v10", item: "Kale", cat: "Verdulería", cant: "1 atado", esencial: false },
    { id: "v11", item: "Espárragos y Alcauciles", cat: "Verdulería", cant: "1 atado / 3 unidades", esencial: false },
    { id: "v12", item: "Apio entero", cat: "Verdulería", cant: "1 planta grande", esencial: true },
    { id: "v13", item: "Zapallo cabutiá o anco", cat: "Verdulería", cant: "1 mediano", esencial: true },
    { id: "v14", item: "Zucchinis", cat: "Verdulería", cant: "3 o 4 unidades", esencial: true },
    { id: "v15", item: "Cebollas y Cebolla de verdeo", cat: "Verdulería", cant: "1 kg cebolla / 2 atados verdeo", esencial: true },
    { id: "v16", item: "Puerro y Ajo", cat: "Verdulería", cant: "1 atado puerro / 2 cabezas ajo", esencial: true },
    { id: "v17", item: "Hierbas: Cilantro, Perejil, Albahaca", cat: "Verdulería", cant: "1 atado de c/u", esencial: true },
    { id: "v18", item: "Paltas maduras", cat: "Verdulería", cant: "3 a 4 unidades", esencial: false },
    { id: "v19", item: "Frutillas, arándanos o pomelos", cat: "Verdulería", cant: "1 a 2 bandejas", esencial: false },

    // DIETÉTICA
    { id: "d1", item: "Arroz Yamaní o Basmati integral", cat: "Dietética", cant: "2 kg", esencial: true },
    { id: "d2", item: "Arroz integral largo fino", cat: "Dietética", cant: "1 kg", esencial: false },
    { id: "d3", item: "Quinoa real", cat: "Dietética", cant: "1 kg", esencial: true },
    { id: "d4", item: "Porotos Mung", cat: "Dietética", cant: "1 kg", esencial: true },
    { id: "d5", item: "Porotos negros o aduki", cat: "Dietética", cant: "500 g", esencial: false },
    { id: "d6", item: "Aceite de Oliva Extra Virgen (1ra prensión)", cat: "Dietética", cant: "1 botella oscura", esencial: true },
    { id: "d7", item: "Aceite o Semillas de Lino", cat: "Dietética", cant: "1 botellita / 250 g", esencial: true },
    { id: "d8", item: "Semillas de Sésamo integral y Chía", cat: "Dietética", cant: "250 g de c/u", esencial: true },
    { id: "d9", item: "Castañas de Cajú crudas (sin sal)", cat: "Dietética", cant: "250 a 500 g", esencial: false },
    { id: "d10", item: "Almendras crudas", cat: "Dietética", cant: "250 g", esencial: false },
    { id: "d11", item: "Sal marina fina o del Himalaya", cat: "Dietética", cant: "500 g", esencial: true },
    { id: "d12", item: "Vinagre de sidra de manzana vivo (sin pasteurizar)", cat: "Dietética", cant: "1 botella", esencial: true },
    { id: "d13", item: "Salsa de soja Shoyu MOA (fermento natural)", cat: "Dietética", cant: "1 botella", esencial: true },
    { id: "d14", item: "Chucrut o Kimchi vivo en heladera", cat: "Dietética", cant: "1 frasco", esencial: false },
    { id: "d15", item: "Tofu orgánico firme (Soyana)", cat: "Dietética", cant: "1 bloque", esencial: false },

    // HERBORISTERÍA
    { id: "h1", item: "Ortiga seca en hojas", cat: "Herboristería", cant: "100 g", esencial: true },
    { id: "h2", item: "Diente de león seco", cat: "Herboristería", cant: "100 g", esencial: true },
    { id: "h3", item: "Flores secas de Manzanilla", cat: "Herboristería", cant: "100 g", esencial: true },
    { id: "h4", item: "Menta fresca o seca", cat: "Herboristería", cant: "100 g", esencial: false },
    { id: "h5", item: "Flores de Lavanda y Caléndula", cat: "Herboristería", cant: "50 g de c/u", esencial: false },
    { id: "h6", item: "Té verde, té Banchá o Matcha", cat: "Herboristería", cant: "1 paquete", esencial: false },
    { id: "h7", item: "Yuyos para mate: Cedrón, cola de caballo, stevia en hoja", cat: "Herboristería", cant: "50 g de c/u", esencial: false },

    // PANADERÍA ARTESANAL
    { id: "p1", item: "Pan 100% puro centeno de masa madre", cat: "Panadería", cant: "1 hogaza (freezar en rodajas)", esencial: false },
    { id: "p2", item: "Pan de trigo sarraceno puro masa madre", cat: "Panadería", cant: "1 unidad", esencial: false },

    // FARMACIA / SUPLEMENTOS (OPCIONALES)
    { id: "s1", item: "Carbón activado (comprimidos o polvo)", cat: "Farmacia", cant: "1 caja", esencial: false },
    { id: "s2", item: "Chlorella en polvo o comprimidos (Organikal)", cat: "Farmacia", cant: "1 frasco", esencial: false },
    { id: "s3", item: "Clorofila líquida", cat: "Farmacia", cant: "1 frasco", esencial: false },
    { id: "s4", item: "Psyllium en polvo o semillas", cat: "Dietética", cant: "100 g", esencial: false },

    // SOPORTE PROTEICO (OPCIONAL)
    { id: "pr1", item: "Pescado fresco (merluza o abadejo)", cat: "Pescadería", cant: "1 kg", esencial: false },
    { id: "pr2", item: "Huevos de campo pastoriles", cat: "Granja", cant: "1 docena", esencial: false },
    { id: "pr3", item: "Huesos pastoriles para caldo", cat: "Carnicería pastura", cant: "1 kg", esencial: false }
  ]
};

if (typeof window !== 'undefined') {
  window.DETOX_DATA = DETOX_DATA;
}
if (typeof module !== 'undefined') {
  module.exports = DETOX_DATA;
}
