// Motor de Heladera Inteligente, Batch Cooking y Tiempos Previos
// Detox de Primavera - Isabel Caparra (Septiembre 2026)
// Compilado por Blair Vance (COO)

const FRIDGE_AND_PREP_DATA = {
  "meta": {
    "nombre": "Motor Clínico de Heladera Inteligente, Batch Cooking y Gestor de Remojos",
    "proyecto": "Detox de Primavera - Isabel Caparra",
    "version": "1.2.0",
    "actualizado": "2026-09-27",
    "autor": "Blair Vance (COO)"
  },
  "scoringConfig": {
    "principalesWeight": 80,
    "condimentosWeight": 20,
    "basicosWeight": 0,
    "zeroPrincipalesMaxScore": 20,
    "underHalfPrincipalesMaxScore": 40,
    "formula": "Score = (principales_presentes / total_principales) * 80 + (condimentos_presentes / total_condimentos) * 20",
    "businessRules": [
      "Los ingredientes 'principales' representan el 80% del valor total del plato.",
      "Los ingredientes 'condimento' representan el 20% del valor restante.",
      "Los ingredientes 'básicos' (agua, líquidos de cocción de la casa) no penalizan el score si no están explícitamente marcados.",
      "Si el usuario tiene 0 ingredientes principales, el score máximo posible es de 20%, aun si cuenta con el 100% de los condimentos.",
      "Si el usuario cuenta con menos del 50% de los ingredientes principales, el score nunca puede superar el 40%.",
      "Los condimentos marcados como opcionales no penalizan la completitud pero suman ponderación si están presentes.",
      "Clasificación visual de recetas: 100% (Lista para cocinar), 70-99% (Casi lista: falta 1 condimento o toque menor), <70% (Incompleta: faltan alimentos base)."
    ]
  },
  "ingredientsCatalog": [
    {
      "id": "arroz_yamani",
      "nombre": "Arroz Yamaní integral",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "granos",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "arroz yamani",
        "arroz yamaní",
        "yamani",
        "arroz integral",
        "arroz integral largo fino"
      ],
      "requiereActivacion": true,
      "activacionId": "arroz_yamani"
    },
    {
      "id": "quinoa",
      "nombre": "Quinoa real",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "granos",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "quinoa",
        "quinua",
        "quinoa real"
      ],
      "requiereActivacion": true,
      "activacionId": "quinoa"
    },
    {
      "id": "mijo",
      "nombre": "Mijo pelado",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "granos",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "mijo",
        "mijo pelado"
      ],
      "requiereActivacion": true,
      "activacionId": "mijo"
    },
    {
      "id": "porotos_mung",
      "nombre": "Porotos Mung",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "legumbres",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "mung",
        "poroto mung",
        "porotos mung",
        "mungo",
        "poroto verde"
      ],
      "requiereActivacion": true,
      "activacionId": "porotos_mung"
    },
    {
      "id": "porotos_aduki",
      "nombre": "Porotos Aduki o negros",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "legumbres",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "aduki",
        "azuki",
        "poroto aduki",
        "porotos negros"
      ],
      "requiereActivacion": true,
      "activacionId": "porotos_aduki"
    },
    {
      "id": "manzana",
      "nombre": "Manzana verde o roja (agroecológica)",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "frutas",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "manzana",
        "manzanas",
        "manzana verde",
        "manzana roja",
        "manzana deliciosa",
        "manzana gala"
      ],
      "requiereActivacion": false
    },
    {
      "id": "apio",
      "nombre": "Apio fresco (pencas y hojas)",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "apio",
        "pencas de apio",
        "varas de apio",
        "planta de apio"
      ],
      "requiereActivacion": false
    },
    {
      "id": "puerro",
      "nombre": "Puerro",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "puerro",
        "puerros"
      ],
      "requiereActivacion": false
    },
    {
      "id": "repollo",
      "nombre": "Repollo blanco o morado",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "repollo",
        "repollo blanco",
        "repollo morado",
        "repollo colorado",
        "col"
      ],
      "requiereActivacion": false
    },
    {
      "id": "zanahoria",
      "nombre": "Zanahoria",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "zanahoria",
        "zanahorias"
      ],
      "requiereActivacion": false
    },
    {
      "id": "calabaza_anco",
      "nombre": "Zapallo anco o cabutiá",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "zapallo anco",
        "calabaza",
        "zapallo",
        "cabutia",
        "cabutiá",
        "butternut"
      ],
      "requiereActivacion": false
    },
    {
      "id": "berenjena",
      "nombre": "Berenjena",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "berenjena",
        "berenjenas"
      ],
      "requiereActivacion": false
    },
    {
      "id": "brocoli",
      "nombre": "Brócoli",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "brocoli",
        "brócoli",
        "ramilletes de brocoli"
      ],
      "requiereActivacion": false
    },
    {
      "id": "coliflor",
      "nombre": "Coliflor",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "coliflor",
        "ramilletes de coliflor"
      ],
      "requiereActivacion": false
    },
    {
      "id": "palta",
      "nombre": "Palta madura",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "grasas_frutas",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "palta",
        "paltas",
        "aguacate"
      ],
      "requiereActivacion": false
    },
    {
      "id": "remolacha",
      "nombre": "Remolacha con hojas",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "remolacha",
        "remolachas",
        "betarraga"
      ],
      "requiereActivacion": false
    },
    {
      "id": "zucchini",
      "nombre": "Zucchini",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "zucchini",
        "zucchinis",
        "zapallito verde",
        "calabacín"
      ],
      "requiereActivacion": false
    },
    {
      "id": "espinaca",
      "nombre": "Espinaca o Kale",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "espinaca",
        "espinacas",
        "kale",
        "col rizada"
      ],
      "requiereActivacion": false
    },
    {
      "id": "alcaucil",
      "nombre": "Alcaucil (estacional)",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "alcaucil",
        "alcauciles",
        "alcachofa",
        "alcachofas"
      ],
      "requiereActivacion": false
    },
    {
      "id": "repollitos_bruselas",
      "nombre": "Repollitos de Bruselas",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "repollitos de bruselas",
        "bruselas",
        "col de bruselas"
      ],
      "requiereActivacion": false
    },
    {
      "id": "esparragos",
      "nombre": "Espárragos frescos",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "verduras",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "esparragos",
        "espárragos"
      ],
      "requiereActivacion": false
    },
    {
      "id": "almendras",
      "nombre": "Almendras crudas sin tostar",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "frutos_secos",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "almendras",
        "almendra",
        "almendras crudas"
      ],
      "requiereActivacion": true,
      "activacionId": "almendras"
    },
    {
      "id": "castanas_caju",
      "nombre": "Castañas de Cajú crudas (sin sal)",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "frutos_secos",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "caju",
        "castañas de cajú",
        "castañas caju",
        "anacardos"
      ],
      "requiereActivacion": true,
      "activacionId": "castanas_caju"
    },
    {
      "id": "harina_arroz_integral",
      "nombre": "Harina de arroz integral",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "harinas",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "harina de arroz",
        "harina arroz integral",
        "harina integral de arroz"
      ],
      "requiereActivacion": false
    },
    {
      "id": "harina_centeno_integral",
      "nombre": "Harina de centeno integral pura",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "harinas",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "harina de centeno",
        "centeno integral",
        "harina centeno"
      ],
      "requiereActivacion": false
    },
    {
      "id": "masa_madre",
      "nombre": "Fermento de masa madre activo",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "fermentos",
      "rubroCompra": "Panadería",
      "sinonimos": [
        "masa madre",
        "fermento natural",
        "masa madre de centeno"
      ],
      "requiereActivacion": true,
      "activacionId": "masa_madre"
    },
    {
      "id": "tofu",
      "nombre": "Tofu orgánico firme (Soyana)",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "proteinas",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "tofu",
        "tofu organico",
        "tofu soyana"
      ],
      "requiereActivacion": false
    },
    {
      "id": "pescado",
      "nombre": "Pescado blanco fresco (merluza/abadejo)",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "proteinas",
      "rubroCompra": "Pescadería",
      "sinonimos": [
        "pescado",
        "pescado blanco",
        "merluza",
        "abadejo"
      ],
      "requiereActivacion": false
    },
    {
      "id": "huevos",
      "nombre": "Huevos de campo pastoriles",
      "clasificacion": "principal",
      "pesoScore": 80,
      "categoria": "proteinas",
      "rubroCompra": "Granja",
      "sinonimos": [
        "huevos",
        "huevo",
        "huevos pastoriles"
      ],
      "requiereActivacion": false
    },
    {
      "id": "aceite_oliva",
      "nombre": "Aceite de Oliva Extra Virgen (1ra prensión fría)",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "grasas",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "oliva",
        "aceite de oliva",
        "aceite de oliva virgen extra",
        "aceite oliva crudo"
      ],
      "requiereActivacion": false
    },
    {
      "id": "sal_marina",
      "nombre": "Sal marina fina o del Himalaya",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "condimentos",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "sal marina",
        "sal de mar",
        "sal del himalaya",
        "sal rosada"
      ],
      "requiereActivacion": false
    },
    {
      "id": "limon",
      "nombre": "Limón fresco",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "citricos",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "limon",
        "limones",
        "jugo de limon",
        "jugo de limón"
      ],
      "requiereActivacion": false
    },
    {
      "id": "ajo",
      "nombre": "Diente de ajo",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "aromaticos",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "ajo",
        "dientes de ajo",
        "ajo picado",
        "cabeza de ajo"
      ],
      "requiereActivacion": false
    },
    {
      "id": "cebolla",
      "nombre": "Cebolla o verdeo",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "aromaticos",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "cebolla",
        "cebolla de verdeo",
        "verdeo",
        "cebolla morada"
      ],
      "requiereActivacion": false
    },
    {
      "id": "shoyu",
      "nombre": "Salsa de soja Shoyu MOA (fermento natural)",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "fermentos",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "shoyu",
        "salsa de soja",
        "shoyu moa",
        "soja fermentada"
      ],
      "requiereActivacion": false
    },
    {
      "id": "chucrut",
      "nombre": "Chucrut vivo artesanal",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "fermentos",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "chucrut",
        "sauerkraut",
        "chucrut vivo"
      ],
      "requiereActivacion": false
    },
    {
      "id": "semillas_lino",
      "nombre": "Semillas de Lino (dorado o marrón)",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "semillas",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "lino",
        "semillas de lino",
        "linaza"
      ],
      "requiereActivacion": true,
      "activacionId": "semillas_lino"
    },
    {
      "id": "semillas_chia",
      "nombre": "Semillas de Chía",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "semillas",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "chia",
        "semillas de chia",
        "semillas de chía"
      ],
      "requiereActivacion": true,
      "activacionId": "semillas_chia"
    },
    {
      "id": "semillas_sesamo",
      "nombre": "Semillas de Sésamo integral",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "semillas",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "sesamo",
        "sésamo",
        "semillas de sésamo",
        "ajonjolí"
      ],
      "requiereActivacion": true,
      "activacionId": "semillas_sesamo"
    },
    {
      "id": "semillas_girasol",
      "nombre": "Semillas de Girasol crudas",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "semillas",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "girasol",
        "semillas de girasol",
        "pipas"
      ],
      "requiereActivacion": true,
      "activacionId": "semillas_girasol"
    },
    {
      "id": "albahaca",
      "nombre": "Albahaca fresca",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "hierbas",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "albahaca",
        "albahaca fresca",
        "hojas de albahaca"
      ],
      "requiereActivacion": false
    },
    {
      "id": "perejil",
      "nombre": "Perejil fresco",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "hierbas",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "perejil",
        "perejil fresco"
      ],
      "requiereActivacion": false
    },
    {
      "id": "comino",
      "nombre": "Comino en polvo",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "especias",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "comino",
        "comino molido"
      ],
      "requiereActivacion": false
    },
    {
      "id": "curcuma",
      "nombre": "Cúrcuma molida o en raíz",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "especias",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "curcuma",
        "cúrcuma",
        "turmeric"
      ],
      "requiereActivacion": false
    },
    {
      "id": "canela",
      "nombre": "Canela en polvo o rama",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "especias",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "canela",
        "canela molida"
      ],
      "requiereActivacion": false
    },
    {
      "id": "jengibre",
      "nombre": "Jengibre fresco",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "especias",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "jengibre",
        "raíz de jengibre"
      ],
      "requiereActivacion": false
    },
    {
      "id": "laurel",
      "nombre": "Hojas de laurel seco",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "hierbas",
      "rubroCompra": "Herboristería",
      "sinonimos": [
        "laurel",
        "hojas de laurel"
      ],
      "requiereActivacion": false
    },
    {
      "id": "oregano",
      "nombre": "Orégano o tomillo seco",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "hierbas",
      "rubroCompra": "Herboristería",
      "sinonimos": [
        "oregano",
        "orégano",
        "tomillo",
        "hierbas secas"
      ],
      "requiereActivacion": false
    },
    {
      "id": "kombu",
      "nombre": "Alga Kombu",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "algas",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "kombu",
        "alga kombu"
      ],
      "requiereActivacion": false
    },
    {
      "id": "vinagre_manzana",
      "nombre": "Vinagre de sidra de manzana vivo",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "fermentos",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "vinagre de manzana",
        "vinagre vivo",
        "vinagre de sidra"
      ],
      "requiereActivacion": false
    },
    {
      "id": "levadura_nutricional",
      "nombre": "Levadura nutricional virgen",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "suplementos",
      "rubroCompra": "Dietética",
      "sinonimos": [
        "levadura nutricional",
        "levadura virgen"
      ],
      "requiereActivacion": false
    },
    {
      "id": "aceitunas_negras",
      "nombre": "Aceitunas negras descarozadas",
      "clasificacion": "condimento",
      "pesoScore": 20,
      "categoria": "encurtidos",
      "rubroCompra": "Verdulería",
      "sinonimos": [
        "aceitunas negras",
        "aceituna negra",
        "olivas negras"
      ],
      "requiereActivacion": false
    },
    {
      "id": "agua",
      "nombre": "Agua de filtro limpia o tibia",
      "clasificacion": "basico",
      "pesoScore": 0,
      "categoria": "basicos",
      "rubroCompra": "Hogar",
      "sinonimos": [
        "agua",
        "agua tibia",
        "agua de filtro",
        "agua filtrada"
      ],
      "requiereActivacion": false
    },
    {
      "id": "liquido_coccion",
      "nombre": "Líquido de cocción reservado",
      "clasificacion": "basico",
      "pesoScore": 0,
      "categoria": "basicos",
      "rubroCompra": "Hogar",
      "sinonimos": [
        "liquido de coccion",
        "agua de coccion",
        "caldo de coccion"
      ],
      "requiereActivacion": false
    }
  ],
  "recipesMapping": [
    {
      "id": "caldo-detox",
      "titulo": "Caldo Détox Alcalinizante",
      "categoria": "caldos",
      "tiempoEstimado": "35 min",
      "metodo": "Hervido suave tapado",
      "principales": [
        {
          "id": "apio",
          "nombre": "Apio",
          "cantidad": "4 pencas cortadas",
          "esencial": true
        },
        {
          "id": "puerro",
          "nombre": "Puerro",
          "cantidad": "1 a 2 puerros cortados",
          "esencial": true
        },
        {
          "id": "repollo",
          "nombre": "Repollo",
          "cantidad": "1 taza en tiras",
          "esencial": true
        },
        {
          "id": "zanahoria",
          "nombre": "Zanahoria",
          "cantidad": "1 o 2 en rodajas",
          "esencial": true
        },
        {
          "id": "manzana",
          "nombre": "Manzana",
          "cantidad": "1 entera con corazón y semillas",
          "esencial": true
        },
        {
          "id": "alcaucil",
          "nombre": "Alcaucil",
          "cantidad": "1/2 unidad",
          "esencial": false,
          "nota": "Opcional según estación"
        }
      ],
      "condimentos": [
        {
          "id": "ajo",
          "nombre": "Ajo",
          "cantidad": "2 dientes enteros aplastados",
          "esencial": true
        },
        {
          "id": "perejil",
          "nombre": "Perejil fresco",
          "cantidad": "1 puñado",
          "esencial": true
        },
        {
          "id": "sal_marina",
          "nombre": "Sal marina",
          "cantidad": "A gusto",
          "esencial": true
        }
      ],
      "basicos": [
        {
          "id": "agua",
          "nombre": "Agua limpia",
          "cantidad": "Agua fría que duplique volumen"
        }
      ],
      "basesRequeridas": [
        "base-caldo-detox"
      ],
      "rolBatch": "Base productora de caldo para múltiples días y recetas"
    },
    {
      "id": "nituke-manzana",
      "titulo": "Nituke de Manzana (Desayuno / Merienda)",
      "categoria": "desayunos",
      "tiempoEstimado": "40 min",
      "metodo": "Nituke",
      "principales": [
        {
          "id": "manzana",
          "nombre": "Manzanas rojas o verdes",
          "cantidad": "3 o 4 en cubos",
          "esencial": true
        }
      ],
      "condimentos": [
        {
          "id": "sal_marina",
          "nombre": "Sal marina",
          "cantidad": "1 pizca",
          "esencial": true
        },
        {
          "id": "almendras",
          "nombre": "Almendras tostadas",
          "cantidad": "1 puñadito picado",
          "esencial": false,
          "nota": "Opcional topping"
        },
        {
          "id": "semillas_lino",
          "nombre": "Semillas de lino molidas",
          "cantidad": "1 cucharadita",
          "esencial": false,
          "nota": "Opcional topping"
        }
      ],
      "basicos": [
        {
          "id": "agua",
          "nombre": "Agua",
          "cantidad": "2 cucharadas soperas"
        }
      ],
      "basesRequeridas": [
        "base-verduras-vapor-nituke"
      ],
      "rolBatch": "Se puede cocinar por triplicado para tener desayunos listos 3 días"
    },
    {
      "id": "hummus-mung",
      "titulo": "Hummus de Porotos Mung",
      "categoria": "dips",
      "tiempoEstimado": "15 min (con porotos ya cocidos)",
      "metodo": "Procesado en frío",
      "principales": [
        {
          "id": "porotos_mung",
          "nombre": "Porotos mung cocidos y tiernos",
          "cantidad": "2 tazas",
          "esencial": true
        }
      ],
      "condimentos": [
        {
          "id": "ajo",
          "nombre": "Ajo",
          "cantidad": "1 diente pequeño",
          "esencial": true
        },
        {
          "id": "albahaca",
          "nombre": "Albahaca fresca",
          "cantidad": "1 puñado de hojas",
          "esencial": true
        },
        {
          "id": "aceite_oliva",
          "nombre": "Aceite de oliva extra virgen",
          "cantidad": "1 cucharada",
          "esencial": true
        },
        {
          "id": "limon",
          "nombre": "Limón",
          "cantidad": "Gotitas de jugo fresco",
          "esencial": true
        },
        {
          "id": "sal_marina",
          "nombre": "Sal marina",
          "cantidad": "A gusto",
          "esencial": true
        }
      ],
      "basicos": [
        {
          "id": "liquido_coccion",
          "nombre": "Líquido de cocción del mung",
          "cantidad": "1/4 a 1/2 taza"
        }
      ],
      "basesRequeridas": [
        "base-porotos-mung"
      ],
      "rolBatch": "Consume 2 tazas de la base de porotos mung cocidos en batch"
    },
    {
      "id": "mayonesa-zanahoria",
      "titulo": "Mayonesa Suave de Zanahoria",
      "categoria": "dips",
      "tiempoEstimado": "20 min",
      "metodo": "Hervido + Procesado",
      "principales": [
        {
          "id": "zanahoria",
          "nombre": "Zanahorias peladas",
          "cantidad": "4 unidades",
          "esencial": true
        },
        {
          "id": "calabaza_anco",
          "nombre": "Zapallo anco",
          "cantidad": "1 trozo pequeño para cremosidad",
          "esencial": true
        }
      ],
      "condimentos": [
        {
          "id": "puerro",
          "nombre": "Puerro o cebolla",
          "cantidad": "1/2 puerro o trozo cebolla",
          "esencial": true
        },
        {
          "id": "ajo",
          "nombre": "Ajo",
          "cantidad": "1 diente",
          "esencial": true
        },
        {
          "id": "aceite_oliva",
          "nombre": "Aceite de oliva crudo",
          "cantidad": "1 cucharada",
          "esencial": true
        },
        {
          "id": "limon",
          "nombre": "Limón",
          "cantidad": "Abundante jugo fresco",
          "esencial": true
        },
        {
          "id": "sal_marina",
          "nombre": "Sal marina",
          "cantidad": "A gusto",
          "esencial": true
        },
        {
          "id": "aceitunas_negras",
          "nombre": "Aceitunas negras",
          "cantidad": "3 o 4 descarozadas",
          "esencial": false,
          "nota": "Opcional"
        }
      ],
      "basicos": [
        {
          "id": "liquido_coccion",
          "nombre": "Líquido de cocción de las verduras",
          "cantidad": "Cantidad necesaria para emulsionar"
        }
      ],
      "basesRequeridas": [
        "base-verduras-vapor-nituke"
      ],
      "rolBatch": "Rinde 1 frasco de emulsión fresca para aderezar platos por 4 días"
    },
    {
      "id": "babaganoush",
      "titulo": "Babaganoush Ahumado sin Aceite Cocido",
      "categoria": "dips",
      "tiempoEstimado": "25 min",
      "metodo": "Asado a la hornalla",
      "principales": [
        {
          "id": "berenjena",
          "nombre": "Berenjenas medianas",
          "cantidad": "2 unidades enteras",
          "esencial": true
        }
      ],
      "condimentos": [
        {
          "id": "ajo",
          "nombre": "Ajo",
          "cantidad": "1/2 diente rallado",
          "esencial": true
        },
        {
          "id": "limon",
          "nombre": "Limón",
          "cantidad": "Jugo de 1/2 limón",
          "esencial": true
        },
        {
          "id": "aceite_oliva",
          "nombre": "Aceite de oliva virgen extra en crudo",
          "cantidad": "1 cucharada",
          "esencial": true
        },
        {
          "id": "sal_marina",
          "nombre": "Sal marina",
          "cantidad": "A gusto",
          "esencial": true
        },
        {
          "id": "comino",
          "nombre": "Comino",
          "cantidad": "Pizca",
          "esencial": true
        }
      ],
      "basicos": [],
      "basesRequeridas": [],
      "rolBatch": "Se pueden asar 4 a 6 berenjenas juntas a la llama y guardarlas peladas"
    },
    {
      "id": "queso-caju",
      "titulo": "Queso Untable de Castañas de Cajú",
      "categoria": "dips",
      "tiempoEstimado": "10 min + 8h remojo",
      "metodo": "Remojo + Licuado de alta potencia",
      "principales": [
        {
          "id": "castanas_caju",
          "nombre": "Castañas de cajú crudas",
          "cantidad": "1 taza (remojada 8 hs)",
          "esencial": true
        }
      ],
      "condimentos": [
        {
          "id": "sal_marina",
          "nombre": "Sal marina",
          "cantidad": "1 pizca",
          "esencial": true
        },
        {
          "id": "limon",
          "nombre": "Limón",
          "cantidad": "Gotitas de limón",
          "esencial": true
        },
        {
          "id": "levadura_nutricional",
          "nombre": "Levadura nutricional o hierbas",
          "cantidad": "1 cucharadita",
          "esencial": false,
          "nota": "Opcional sabor queso"
        }
      ],
      "basicos": [
        {
          "id": "agua",
          "nombre": "Agua limpia de filtro",
          "cantidad": "1/4 a 1/2 taza"
        }
      ],
      "basesRequeridas": [
        "base-frutos-secos-activados"
      ],
      "rolBatch": "Se elabora en 10 min tras activar y dura 5 días en frasco hermético"
    },
    {
      "id": "galletas-yamani",
      "titulo": "Maravillosas Galletas de Arroz Yamaní",
      "categoria": "panificados",
      "tiempoEstimado": "30 min",
      "metodo": "Horno 180°C",
      "principales": [
        {
          "id": "arroz_yamani",
          "nombre": "Arroz yamaní cocido pasado",
          "cantidad": "1 taza (1 taza arroz x 3 de agua)",
          "esencial": true
        },
        {
          "id": "harina_arroz_integral",
          "nombre": "Harina de arroz integral",
          "cantidad": "1 taza",
          "esencial": true
        }
      ],
      "condimentos": [
        {
          "id": "semillas_lino",
          "nombre": "Semillas de lino",
          "cantidad": "4 cucharadas (ligue)",
          "esencial": true
        },
        {
          "id": "aceite_oliva",
          "nombre": "Aceite de oliva",
          "cantidad": "2 cucharadas",
          "esencial": true
        },
        {
          "id": "sal_marina",
          "nombre": "Sal marina",
          "cantidad": "1 cdita",
          "esencial": true
        },
        {
          "id": "oregano",
          "nombre": "Hierbas secas / orégano / cúrcuma",
          "cantidad": "A gusto",
          "esencial": true
        }
      ],
      "basicos": [
        {
          "id": "agua",
          "nombre": "Agua tibia",
          "cantidad": "Chorrito apenas para unir"
        }
      ],
      "basesRequeridas": [
        "base-arroz-yamani"
      ],
      "rolBatch": "Aprovecha la porción sobrecocinada de la base semanal de arroz yamaní"
    },
    {
      "id": "pan-centeno-masamadre",
      "titulo": "Pan de Centeno 100% de Masa Madre",
      "categoria": "panificados",
      "tiempoEstimado": "Leudado 8-12h + 50 min horno",
      "metodo": "Fermentación natural y horneado",
      "principales": [
        {
          "id": "harina_centeno_integral",
          "nombre": "Harina de centeno integral pura",
          "cantidad": "1 kg",
          "esencial": true
        },
        {
          "id": "masa_madre",
          "nombre": "Fermento de masa madre activo",
          "cantidad": "2 tazas",
          "esencial": true
        }
      ],
      "condimentos": [
        {
          "id": "sal_marina",
          "nombre": "Sal marina",
          "cantidad": "1 cucharada colmada",
          "esencial": true
        }
      ],
      "basicos": [
        {
          "id": "agua",
          "nombre": "Agua tibia",
          "cantidad": "800 ml"
        }
      ],
      "basesRequeridas": [
        "base-fermentos-activos"
      ],
      "rolBatch": "Rinde 2 panes de molde. Se corta en rodajas y se freeza para 21 días"
    },
    {
      "id": "chucrut-casero",
      "titulo": "Chucrut Probiótico Vivo",
      "categoria": "fermentos",
      "tiempoEstimado": "20 min prep + 21 días fermento",
      "metodo": "Fermentación láctica anaeróbica",
      "principales": [
        {
          "id": "repollo",
          "nombre": "Repollo agroecológico (blanco o morado)",
          "cantidad": "1 unidad grande",
          "esencial": true
        }
      ],
      "condimentos": [
        {
          "id": "sal_marina",
          "nombre": "Sal marina",
          "cantidad": "20 a 25 g por kilo de repollo (2% a 2.5%)",
          "esencial": true
        }
      ],
      "basicos": [],
      "basesRequeridas": [
        "base-fermentos-activos"
      ],
      "rolBatch": "Un solo frasco inicial provee lactobacilos vivos diarios para todo el detox"
    },
    {
      "id": "leche-almendras",
      "titulo": "Leche Fresca de Almendras",
      "categoria": "leches",
      "tiempoEstimado": "10 min + 8-12h remojo",
      "metodo": "Licuado + Filtrado en tela",
      "principales": [
        {
          "id": "almendras",
          "nombre": "Almendras crudas",
          "cantidad": "100 g (remojadas 8 a 12 hs)",
          "esencial": true
        }
      ],
      "condimentos": [
        {
          "id": "sal_marina",
          "nombre": "Sal marina",
          "cantidad": "Pizca",
          "esencial": false,
          "nota": "Opcional"
        },
        {
          "id": "canela",
          "nombre": "Canela en polvo",
          "cantidad": "Pizca",
          "esencial": false,
          "nota": "Opcional"
        }
      ],
      "basicos": [
        {
          "id": "agua",
          "nombre": "Agua de filtro limpia",
          "cantidad": "1 litro"
        }
      ],
      "basesRequeridas": [
        "base-frutos-secos-activados"
      ],
      "rolBatch": "Genera 1 litro de leche para la semana y bagazo para sumar a las galletas"
    },
    {
      "id": "bowl-yamani-cruciferas",
      "titulo": "Bowl Alcalino de Yamaní y Crucíferas",
      "categoria": "almuerzos",
      "tiempoEstimado": "25 min (o 5 min con batch pre-cocido)",
      "metodo": "Vapor + Ensamble clínico",
      "principales": [
        {
          "id": "arroz_yamani",
          "nombre": "Arroz yamaní cocido caliente",
          "cantidad": "1 taza",
          "esencial": true
        },
        {
          "id": "brocoli",
          "nombre": "Ramilletes de brócoli al vapor",
          "cantidad": "1 taza",
          "esencial": true
        },
        {
          "id": "coliflor",
          "nombre": "Ramilletes de coliflor al vapor",
          "cantidad": "1 taza",
          "esencial": true
        },
        {
          "id": "porotos_mung",
          "nombre": "Porotos mung cocidos",
          "cantidad": "1/2 taza",
          "esencial": true
        },
        {
          "id": "palta",
          "nombre": "Palta en láminas",
          "cantidad": "1/4 de unidad",
          "esencial": true
        }
      ],
      "condimentos": [
        {
          "id": "chucrut",
          "nombre": "Chucrut vivo",
          "cantidad": "1 cucharadita",
          "esencial": true
        },
        {
          "id": "aceite_oliva",
          "nombre": "Aceite de oliva crudo",
          "cantidad": "1 cucharada",
          "esencial": true
        },
        {
          "id": "shoyu",
          "nombre": "Salsa Shoyu MOA",
          "cantidad": "Gotas",
          "esencial": true
        },
        {
          "id": "limon",
          "nombre": "Jugo de limón",
          "cantidad": "A gusto",
          "esencial": true
        }
      ],
      "basicos": [],
      "basesRequeridas": [
        "base-arroz-yamani",
        "base-porotos-mung",
        "base-verduras-vapor-nituke",
        "base-fermentos-activos"
      ],
      "rolBatch": "El plato cumbre del detox: ensambla 4 bases cocinadas previamente en solo 3 minutos"
    }
  ],
  "batchCookingBases": [
    {
      "id": "base-arroz-yamani",
      "nombre": "Base Arroz Yamaní Cocido & Pasado",
      "icono": "🍚",
      "descripcion": "Cereal madre del detox. Cocido al dente para bowls o pasado para galletas de masa ligada.",
      "metodoCoccion": "Cocción lenta con difusor a fuego pelusa",
      "proporcionAgua": "1 taza de arroz por 2.5 tazas de agua (para grano entero) o 1:3 (para galletas)",
      "rendimiento": "Rinde 4 a 6 porciones (800g a 1 kg cocido)",
      "vidaUtilHeladeraDias": 5,
      "aptoFreezer": true,
      "freezerDias": 60,
      "instruccionesBatch": [
        "Poner en remojo 500g de arroz yamaní la noche previa (8-12 hs).",
        "Enjuagar bien y colocar en olla pesada con el doble y medio de agua fría y pizca de sal marina.",
        "Hervir tapado a fuego mínimo con difusor durante 35-40 minutos hasta absorber todo el líquido.",
        "Separar 2 tazas y pasarlas unos minutos más con agua tibia si se planea hacer galletas de arroz.",
        "Distribuir en recipientes herméticos de vidrio y enfriar antes de tapar."
      ],
      "recetasQueLaUsan": [
        {
          "recipeId": "bowl-yamani-cruciferas",
          "porcionRequerida": "1 taza caliente",
          "rol": "Base carbohidrato de asimilación lenta"
        },
        {
          "recipeId": "galletas-yamani",
          "porcionRequerida": "1 taza pisada pegajosa",
          "rol": "Masa ligada sin gluten"
        }
      ],
      "insumosCompartidos": [
        "arroz_yamani",
        "sal_marina",
        "agua"
      ],
      "ahorroTiempoMinutosSemanal": 80
    },
    {
      "id": "base-porotos-mung",
      "nombre": "Base Porotos Mung Tiernos con Kombu",
      "icono": "🫘",
      "descripcion": "Legumbre reina depurativa. Muy digerible, libre de purinas densas y rica en aminoácidos.",
      "metodoCoccion": "Hervido digestivo con descarte de saponinas",
      "proporcionAgua": "1 taza de porotos por 3 tazas de agua fresca",
      "rendimiento": "Rinde 4 porciones (aprox. 600g cocidos)",
      "vidaUtilHeladeraDias": 4,
      "aptoFreezer": true,
      "freezerDias": 90,
      "instruccionesBatch": [
        "Remojo prolongado obligatorio de 12 a 24 horas con cambio de agua a mitad del proceso.",
        "Descartar completamente el agua de remojo espumosa.",
        "Cocinar en olla con agua fresca y un trozo de alga kombu o 2 hojas de laurel.",
        "Espumar intensamente durante los primeros 10 minutos para remover antinutrientes.",
        "Bajar a fuego suave 30-35 minutos hasta que el grano ceda fácil a la presión.",
        "Agregar sal marina únicamente al final. Reservar parte del líquido de cocción para hummus."
      ],
      "recetasQueLaUsan": [
        {
          "recipeId": "hummus-mung",
          "porcionRequerida": "2 tazas + 1/3 taza líquido",
          "rol": "Base untable proteica"
        },
        {
          "recipeId": "bowl-yamani-cruciferas",
          "porcionRequerida": "1/2 taza",
          "rol": "Aporte proteico vegetal del bowl"
        }
      ],
      "insumosCompartidos": [
        "porotos_mung",
        "kombu",
        "laurel",
        "sal_marina"
      ],
      "ahorroTiempoMinutosSemanal": 60
    },
    {
      "id": "base-caldo-detox",
      "nombre": "Base Caldo Détox Alcalinizante Concentrado",
      "icono": "🥣",
      "descripcion": "Solvente maestro de toxinas. Aporta potasio y minerales orgánicos sin digestión.",
      "metodoCoccion": "Extracción lenta a baja temperatura en olla tapada",
      "proporcionAgua": "Agua fría que cubra holgadamente 5 cm por sobre los vegetales",
      "rendimiento": "Rinde 3.5 a 4.5 litros de caldo colado puro",
      "vidaUtilHeladeraDias": 5,
      "aptoFreezer": true,
      "freezerDias": 60,
      "instruccionesBatch": [
        "Picar apio, puerro, repollo, zanahoria, ajo y perejil en trozos medianos.",
        "Lavar 1 manzana entera con cáscara e incorporarla partida al medio.",
        "Llenar con agua de filtro y cocinar a fuego mínimo tapado durante 40 minutos.",
        "Colar inmediatamente en caliente para separar el líquido límpido de los vegetales.",
        "Embotellar en frascos o botellas de vidrio templadas y dejar enfriar antes de heladera.",
        "Separar 1 cubetera para congelar caldos concentrados en cubos."
      ],
      "recetasQueLaUsan": [
        {
          "recipeId": "caldo-detox",
          "porcionRequerida": "Toma directa libre",
          "rol": "Termo de hidratación y pre-comidas"
        },
        {
          "recipeId": "mayonesa-zanahoria",
          "porcionRequerida": "1/4 taza",
          "rol": "Líquido de emulsión aromático"
        },
        {
          "recipeId": "hummus-mung",
          "porcionRequerida": "1/4 taza",
          "rol": "Sustituto de agua para textura suave"
        }
      ],
      "insumosCompartidos": [
        "apio",
        "puerro",
        "repollo",
        "zanahoria",
        "manzana",
        "ajo",
        "perejil",
        "sal_marina"
      ],
      "ahorroTiempoMinutosSemanal": 70
    },
    {
      "id": "base-verduras-vapor-nituke",
      "nombre": "Base Verduras al Vapor & Nituke Concentrado",
      "icono": "🥦",
      "descripcion": "Verduras cocidas al dente que conservan sulforafano, pectinas y clorofila activa.",
      "metodoCoccion": "Vaporera 5-7 min para crucíferas / Nituke 35 min para tubérculos y manzana",
      "rendimiento": "Rinde guarniciones listas para 4 comidas",
      "vidaUtilHeladeraDias": 4,
      "aptoFreezer": false,
      "freezerDias": 0,
      "instruccionesBatch": [
        "Cocinar al vapor brócoli y coliflor por tandas separadas (5 min brócoli, 6 min coliflor) para dejarlos crocantes y verde brillante.",
        "Enfriar sobre bandeja limpia para cortar la cocción por calor residual.",
        "Hacer un nituke simultáneo de zanahorias y zapallo anco con 2 cucharadas de agua en olla pesada.",
        "Almacenar en tuppers de vidrio con servilleta absorbente en la base para evitar condensación."
      ],
      "recetasQueLaUsan": [
        {
          "recipeId": "bowl-yamani-cruciferas",
          "porcionRequerida": "1 taza brócoli + 1 taza coliflor",
          "rol": "Crucíferas depurativas de fase 2"
        },
        {
          "recipeId": "mayonesa-zanahoria",
          "porcionRequerida": "Zanahoria cocida + zapallo anco",
          "rol": "Cuerpo emulsionable del dip"
        },
        {
          "recipeId": "nituke-manzana",
          "porcionRequerida": "Manzanas en cubos cocidas",
          "rol": "Compota natural sin azúcar"
        }
      ],
      "insumosCompartidos": [
        "brocoli",
        "coliflor",
        "zanahoria",
        "calabaza_anco",
        "manzana",
        "sal_marina"
      ],
      "ahorroTiempoMinutosSemanal": 50
    },
    {
      "id": "base-frutos-secos-activados",
      "nombre": "Base Frutos Secos Activados, Leches & Untables",
      "icono": "🥛",
      "descripcion": "Grasas nobles y leches vegetales sin conservantes ni aditivos industriales.",
      "metodoCoccion": "Remojo desinhibidor + Licuado y prensado en tela",
      "rendimiento": "1 litro de leche + 1 taza de bagazo + 1 pote de queso untable",
      "vidaUtilHeladeraDias": 5,
      "aptoFreezer": true,
      "freezerDias": 30,
      "instruccionesBatch": [
        "Poner en remojo paralelo: 100g de almendras y 150g de castañas de cajú en recipientes con agua filtrada y pizca de sal.",
        "A la mañana siguiente, descartar ambas aguas de remojo y enjuagar bien.",
        "Licuar las almendras con 1 litro de agua y filtrar con bolsa para leche vegetal. Embotellar la leche.",
        "Reservar la pulpa sólida húmeda (bagazo) para hornear con las galletas de arroz yamaní.",
        "Licuar las castañas de cajú con gotas de limón, sal marina y 1/3 taza de agua para lograr el queso crema."
      ],
      "recetasQueLaUsan": [
        {
          "recipeId": "leche-almendras",
          "porcionRequerida": "Almendras activadas",
          "rol": "Bebida vegetal alcalina"
        },
        {
          "recipeId": "queso-caju",
          "porcionRequerida": "Cajú activado",
          "rol": "Queso untable probiótico"
        },
        {
          "recipeId": "nituke-manzana",
          "porcionRequerida": "Almendras picadas",
          "rol": "Topping crocante"
        }
      ],
      "insumosCompartidos": [
        "almendras",
        "castanas_caju",
        "limon",
        "sal_marina",
        "agua"
      ],
      "ahorroTiempoMinutosSemanal": 45
    },
    {
      "id": "base-fermentos-activos",
      "nombre": "Base Fermentos Vivos Probióticos (Chucrut & Masa Madre)",
      "icono": "🫙",
      "descripcion": "Bacterias lácticas vivas y levaduras simbióticas para regenerar la barrera intestinal.",
      "metodoCoccion": "Fermentación láctica y anaeróbica natural a temperatura ambiente",
      "rendimiento": "1 frasco de chucrut (dura 21 días) + 1 pan de molde centeno",
      "vidaUtilHeladeraDias": 30,
      "aptoFreezer": true,
      "freezerDias": 90,
      "instruccionesBatch": [
        "Preparar el chucrut durante la fase previa al detox: masajear 1 kg de repollo con 22g de sal marina hasta soltar abundante salmuera.",
        "Envasar prensando hermético y dejar fermentar 21 a 28 días en oscuridad.",
        "Para el pan: alimentar la masa madre de centeno 8-12 hs antes, amasar con 1 kg de harina de centeno y sal, leudar 8-12 hs y hornear 50 min.",
        "Rebanar el pan frío y freezarlo en bolsitas de 2 rodajas para tostar a diario en el desayuno."
      ],
      "recetasQueLaUsan": [
        {
          "recipeId": "chucrut-casero",
          "porcionRequerida": "Frasco completo",
          "rol": "Bacterias lácticas puras"
        },
        {
          "recipeId": "bowl-yamani-cruciferas",
          "porcionRequerida": "1 cucharadita",
          "rol": "Inóculo probiótico del almuerzo"
        },
        {
          "recipeId": "pan-centeno-masamadre",
          "porcionRequerida": "2 hogazas horneadas",
          "rol": "Tostadas aptas de la mañana"
        }
      ],
      "insumosCompartidos": [
        "repollo",
        "harina_centeno_integral",
        "masa_madre",
        "sal_marina"
      ],
      "ahorroTiempoMinutosSemanal": 60
    }
  ],
  "soakingAndPreTimes": [
    {
      "ingredienteId": "almendras",
      "nombre": "Almendras crudas",
      "categoria": "frutos_secos",
      "tiempoMinimoHoras": 8,
      "tiempoOptimoHoras": 12,
      "tiempoMaximoHoras": 24,
      "tiempoLabel": "8 a 12 horas (Noche previa)",
      "anticipacionRecomendada": "Al ir a dormir la noche anterior",
      "medio": "Agua de filtro a temperatura ambiente con una pizca de sal marina",
      "descartarAgua": true,
      "razonDescarte": "El agua contiene taninos amargos, antinutrientes e inhibidores de tripsina que sobrecargan la vesícula y el páncreas.",
      "propositoClinico": "Despierta la semilla viva, multiplica su biodisponibilidad vitamínica y emulsiona con extrema facilidad para leches y quesos.",
      "recetasAsociadas": [
        "leche-almendras",
        "nituke-manzana"
      ],
      "alertas": "Si se dejan más de 24 horas a temperatura ambiente pueden fermentar o volverse agrias; en ese caso guardar en heladera tapadas."
    },
    {
      "ingredienteId": "castanas_caju",
      "nombre": "Castañas de Cajú crudas (sin tostar)",
      "categoria": "frutos_secos",
      "tiempoMinimoHoras": 6,
      "tiempoOptimoHoras": 8,
      "tiempoMaximoHoras": 12,
      "tiempoLabel": "6 a 8 horas",
      "anticipacionRecomendada": "Noche previa o a primera hora de la mañana",
      "medio": "Agua pura limpia",
      "descartarAgua": true,
      "razonDescarte": "Elimina residuos de procesamiento y polvo de cáscara exterior.",
      "propositoClinico": "Hidrata los ácidos grasos internos logrando una pasta ultra cremosa que simula queso mascarpone o queso crema sin grumos.",
      "recetasAsociadas": [
        "queso-caju"
      ],
      "alertas": "No sobrepasar las 12 horas porque la pulpa se deshace en exceso y pierde firmeza."
    },
    {
      "ingredienteId": "porotos_mung",
      "nombre": "Porotos Mung",
      "categoria": "legumbres",
      "tiempoMinimoHoras": 12,
      "tiempoOptimoHoras": 16,
      "tiempoMaximoHoras": 24,
      "tiempoLabel": "12 a 24 horas",
      "anticipacionRecomendada": "Noche previa (al menos 16 hs antes de cocinar)",
      "medio": "Abundante agua tibia o templada (triplican su tamaño)",
      "descartarAgua": true,
      "razonDescarte": "CRÍTICO: En el agua de remojo se liberan las saponinas y oligosacáridos no digeribles causantes de fermentación colónica y gases.",
      "propositoClinico": "Inicia el proceso de germinación desactivando el ácido fítico, garantizando una digestión liviana y absorción óptima de hierro y zinc.",
      "recetasAsociadas": [
        "hummus-mung",
        "bowl-yamani-cruciferas"
      ],
      "alertas": "Cambiar el agua al menos una vez si la temperatura ambiente supera los 22°C para evitar fermentaciones anaeróbicas."
    },
    {
      "ingredienteId": "arroz_yamani",
      "nombre": "Arroz Yamaní integral",
      "categoria": "granos",
      "tiempoMinimoHoras": 8,
      "tiempoOptimoHoras": 12,
      "tiempoMaximoHoras": 18,
      "tiempoLabel": "8 a 12 horas (Noche previa)",
      "anticipacionRecomendada": "Noche previa",
      "medio": "Agua tibia de filtro con unas gotitas de limón o vinagre vivo",
      "descartarAgua": true,
      "razonDescarte": "Remueve impurezas de la cáscara y ácido fítico quelante de minerales.",
      "propositoClinico": "Pre-hidrata el salvado exterior reduciendo el tiempo de cocción en un 30% y facilitando la gelatinización pareja del almidón.",
      "recetasAsociadas": [
        "bowl-yamani-cruciferas",
        "galletas-yamani"
      ],
      "alertas": "Enjuagar sobre colador fino antes de mandar a la olla hasta que el agua salga translúcida."
    },
    {
      "ingredienteId": "quinoa",
      "nombre": "Quinoa real",
      "categoria": "granos",
      "tiempoMinimoHoras": 2,
      "tiempoOptimoHoras": 4,
      "tiempoMaximoHoras": 8,
      "tiempoLabel": "2 a 4 horas + Lavado intenso",
      "anticipacionRecomendada": "2 horas previas a la cocción",
      "medio": "Agua fría con frotado manual enérgico",
      "descartarAgua": true,
      "razonDescarte": "La cáscara de quinoa está impregnada de saponina, un jabón natural de sabor fuertemente amargo y agresivo para la pared estomacal.",
      "propositoClinico": "Remoción total de saponinas e hidratación rápida del embrión espiralado para una cocción esponjosa en solo 15 minutos.",
      "recetasAsociadas": [
        "bowl-yamani-cruciferas"
      ],
      "alertas": "Frotar entre las manos bajo el chorro de la canilla al menos 5 veces hasta que el agua no genere espuma alguna."
    },
    {
      "ingredienteId": "semillas_lino",
      "nombre": "Semillas de Lino (Linaza)",
      "categoria": "semillas",
      "tiempoMinimoHoras": 0.33,
      "tiempoOptimoHoras": 0.5,
      "tiempoMaximoHoras": 12,
      "tiempoLabel": "20 a 30 minutos (o noche previa)",
      "anticipacionRecomendada": "30 minutos antes de armar masas o noche previa para constipación",
      "medio": "Agua tibia (relación 1 cda de semillas por 3 cdas de agua)",
      "descartarAgua": false,
      "razonDescarte": "PROHIBIDO DESCARTAR: El líquido resultante es mucílago curativo rico en fibra soluble y omega 3 protector de la mucosa intestinal.",
      "propositoClinico": "Forma un gel viscoelástico ('huevo de lino') que reemplaza al huevo para ligar las galletas de arroz yamaní, o hidrata el colon ante constipación.",
      "recetasAsociadas": [
        "galletas-yamani",
        "nituke-manzana"
      ],
      "alertas": "Evitar el consumo de lino entero o agua de lino si se cursa un episodio de flojera intestinal o diarrea."
    },
    {
      "ingredienteId": "semillas_chia",
      "nombre": "Semillas de Chía",
      "categoria": "semillas",
      "tiempoMinimoHoras": 0.33,
      "tiempoOptimoHoras": 0.5,
      "tiempoMaximoHoras": 8,
      "tiempoLabel": "20 a 30 minutos",
      "anticipacionRecomendada": "30 minutos antes de consumir",
      "medio": "Agua, leche vegetal o infusión fría",
      "descartarAgua": false,
      "razonDescarte": "PROHIBIDO DESCARTAR: Todo el beneficio biológico reside en la matriz coloidal gelatinosa que retiene 12 veces su peso en agua.",
      "propositoClinico": "Genera saciedad mecánica suave, retrasa la absorción glucémica y lubrica el tránsito del bolo fecal.",
      "recetasAsociadas": [
        "desayunos-chia"
      ],
      "alertas": "Revolver bien a los 5 minutos de sumergidas para evitar que se apelmacen en el fondo del vaso."
    },
    {
      "ingredienteId": "semillas_sesamo",
      "nombre": "Semillas de Sésamo integral",
      "categoria": "semillas",
      "tiempoMinimoHoras": 4,
      "tiempoOptimoHoras": 6,
      "tiempoMaximoHoras": 8,
      "tiempoLabel": "4 a 6 horas (o tostado suave en sartén)",
      "anticipacionRecomendada": "Media jornada antes o tostar 2 minutos al momento",
      "medio": "Agua con pizca de sal marina",
      "descartarAgua": true,
      "razonDescarte": "Desprende oxalatos y compuestos que restringen la absorción de calcio bioactivo.",
      "propositoClinico": "Potencia la asimilación del calcio vegetal y abre la cutícula del grano para permitir su molienda (Gomasio).",
      "recetasAsociadas": [
        "bowl-yamani-cruciferas"
      ],
      "alertas": "Si se opta por tostar, hacerlo a fuego mínimo en sartén de hierro sin aceite, removiendo sin pausa para que no se quemen."
    },
    {
      "ingredienteId": "kefir_agua",
      "nombre": "Nódulos de Kéfir de Agua",
      "categoria": "fermentos",
      "tiempoMinimoHoras": 24,
      "tiempoOptimoHoras": 48,
      "tiempoMaximoHoras": 72,
      "tiempoLabel": "48 horas de fermentación",
      "anticipacionRecomendada": "2 días de anticipación",
      "medio": "Agua de filtro + azúcar mascabo (alimento de los nódulos) + higo seco/pasa + limón",
      "descartarAgua": false,
      "razonDescarte": "El agua fermentada es el producto final probiótico; el azúcar fue predigerida por las levaduras y bacterias lácticas.",
      "propositoClinico": "Genera una bebida tónica enzimática con miles de millones de UFC que colonizan la microbiota y desplazan cándidas.",
      "recetasAsociadas": [
        "hidratacion-probiotica"
      ],
      "alertas": "Nunca manipular con cucharas, filtros o recipientes metálicos; usar exclusivamente madera, vidrio y plástico para no alterar la carga bacteriana."
    },
    {
      "ingredienteId": "chucrut_vivo",
      "nombre": "Chucrut casero de repollo",
      "categoria": "fermentos",
      "tiempoMinimoHoras": 504,
      "tiempoOptimoHoras": 672,
      "tiempoMaximoHoras": 840,
      "tiempoLabel": "21 a 28 días a temperatura ambiente",
      "anticipacionRecomendada": "3 a 4 semanas previas al inicio del detox",
      "medio": "Su propia salmuera (2% a 2.5% de sal marina sobre peso de repollo)",
      "descartarAgua": false,
      "razonDescarte": "La salmuera ácida contiene la máxima concentración de ácido láctico, bacteriocinas y bacterias vivas Leuconostoc y Lactobacillus.",
      "propositoClinico": "Restablece el pH ácido saludable del colon, estimula la secreción de ácido clorhídrico estomacal y regenera la flora autóctona.",
      "recetasAsociadas": [
        "chucrut-casero",
        "bowl-yamani-cruciferas"
      ],
      "alertas": "Las primeras 48 horas son decisivas: todo el repollo debe permanecer absolutamente sumergido para prevenir el desarrollo de mohos aerobios."
    },
    {
      "ingredienteId": "masa_madre",
      "nombre": "Refresco de Masa Madre de Centeno",
      "categoria": "fermentos",
      "tiempoMinimoHoras": 6,
      "tiempoOptimoHoras": 8,
      "tiempoMaximoHoras": 12,
      "tiempoLabel": "8 a 12 horas previas al amasado",
      "anticipacionRecomendada": "Noche anterior a la jornada de horneado",
      "medio": "Harina de centeno pura + agua tibia (relación 1:1)",
      "descartarAgua": false,
      "razonDescarte": "Es la levadura viva silvestre que elevará el pan de centeno.",
      "propositoClinico": "Predigiere el gluten del cereal y descompone el ácido fítico, haciendo que el pan de centeno resulte altamente digerible y de índice glucémico bajo.",
      "recetasAsociadas": [
        "pan-centeno-masamadre"
      ],
      "alertas": "Usar en el momento exacto en que duplica su volumen y tiene domo redondeado con aroma afrutado antes de que comience a colapsar."
    },
    {
      "ingredienteId": "mijo",
      "nombre": "Mijo pelado",
      "categoria": "granos",
      "tiempoMinimoHoras": 6,
      "tiempoOptimoHoras": 8,
      "tiempoMaximoHoras": 12,
      "tiempoLabel": "6 a 8 horas (o escaldado con agua hirviendo)",
      "anticipacionRecomendada": "Noche previa",
      "medio": "Agua tibia de filtro",
      "descartarAgua": true,
      "razonDescarte": "Desactiva inhibidores enzimáticos y remueve polvo amargo superficial.",
      "propositoClinico": "Cereal alcalinizante por excelencia; el remojo ablanda el grano permitiendo una cocción untuosa para cremas y sopas sin pesadez.",
      "recetasAsociadas": [
        "sopas-cremas-mijo"
      ],
      "alertas": "Escurrir bien antes de cocinar; si se busca sabor más almendrado, secar en sartén un minuto antes de agregar el agua de cocción."
    },
    {
      "ingredienteId": "porotos_aduki",
      "nombre": "Porotos Aduki o negros",
      "categoria": "legumbres",
      "tiempoMinimoHoras": 12,
      "tiempoOptimoHoras": 18,
      "tiempoMaximoHoras": 24,
      "tiempoLabel": "12 a 18 horas",
      "anticipacionRecomendada": "Noche previa",
      "medio": "Abundante agua fresca",
      "descartarAgua": true,
      "razonDescarte": "Concentra oligosacáridos fermentables que deben eliminarse por completo.",
      "propositoClinico": "Tónico por excelencia del elemento agua y riñones según la Medicina Tradicional China. Cocinar siempre con alga kombu.",
      "recetasAsociadas": [
        "pasta-remolacha-aduki"
      ],
      "alertas": "Requiere cocción más larga que el mung (45 a 60 minutos)."
    },
    {
      "ingredienteId": "semillas_girasol",
      "nombre": "Semillas de Girasol crudas",
      "categoria": "semillas",
      "tiempoMinimoHoras": 4,
      "tiempoOptimoHoras": 6,
      "tiempoMaximoHoras": 8,
      "tiempoLabel": "4 a 6 horas",
      "anticipacionRecomendada": "Media jornada previa",
      "medio": "Agua de filtro con pizca de sal marina",
      "descartarAgua": true,
      "razonDescarte": "Elimina antinutrientes de la semilla oleaginosa.",
      "propositoClinico": "Activa la vitamina E y zinc vegetal, dejándolas suaves para patés o cremas untables.",
      "recetasAsociadas": [
        "pates-vegetales"
      ],
      "alertas": "Secar sobre repasador limpio si se van a consumir enteras o tostadas."
    }
  ]
};


/**
 * Motor de Cálculo para Heladera Inteligente, Batch Cooking y Remojos
 * Taller Detox de Primavera - Isabel Caparra
 */

function matchFridge(availableIngredientIds, options = {}) {
  const catalog = FRIDGE_AND_PREP_DATA.ingredientsCatalog;
  const recipes = FRIDGE_AND_PREP_DATA.recipesMapping;
  const config = FRIDGE_AND_PREP_DATA.scoringConfig;

  const normalizedAvailable = (availableIngredientIds || []).map(id => id.toLowerCase().trim());

  const results = recipes.map(recipe => {
    // Filtrar principales esenciales vs opcionales
    const requiredPrincipales = recipe.principales.filter(p => p.esencial !== false);
    const requiredCondimentos = recipe.condimentos.filter(c => c.esencial !== false);

    const totalP = requiredPrincipales.length;
    const totalC = requiredCondimentos.length;

    const presentPrincipales = requiredPrincipales.filter(p => normalizedAvailable.includes(p.id.toLowerCase()));
    const presentCondimentos = requiredCondimentos.filter(c => normalizedAvailable.includes(c.id.toLowerCase()));

    const countP = presentPrincipales.length;
    const countC = presentCondimentos.length;

    const ratioP = totalP > 0 ? (countP / totalP) : 1;
    const ratioC = totalC > 0 ? (countC / totalC) : 1;

    // Fórmula base 80/20
    let rawScore = (ratioP * config.principalesWeight) + (ratioC * config.condimentosWeight);

    // Regla clínica estricta:
    // Si no tiene los principales, NUNCA supera el 40%
    let score = rawScore;
    if (countP === 0) {
      score = Math.min(score, config.zeroPrincipalesMaxScore); // Max 20%
    } else if (ratioP < 0.5) {
      score = Math.min(score, config.underHalfPrincipalesMaxScore); // Max 40%
    }

    const missingPrincipales = requiredPrincipales.filter(p => !normalizedAvailable.includes(p.id.toLowerCase()));
    const missingCondimentos = requiredCondimentos.filter(c => !normalizedAvailable.includes(c.id.toLowerCase()));

    const canCook = missingPrincipales.length === 0 && missingCondimentos.length === 0;
    const canCookBase = missingPrincipales.length === 0;

    let tier = 'incompleta';
    if (score === 100) tier = 'lista';
    else if (score >= 70) tier = 'casi_lista';

    return {
      recipeId: recipe.id,
      titulo: recipe.titulo,
      categoria: recipe.categoria,
      score: Math.round(score),
      rawScore: Math.round(rawScore),
      ratioPrincipalesPct: Math.round(ratioP * 100),
      ratioCondimentosPct: Math.round(ratioC * 100),
      countPrincipales: countP,
      totalPrincipales: totalP,
      countCondimentos: countC,
      totalCondimentos: totalC,
      missingPrincipales: missingPrincipales.map(m => ({ id: m.id, nombre: m.nombre, cantidad: m.cantidad })),
      missingCondimentos: missingCondimentos.map(m => ({ id: m.id, nombre: m.nombre, cantidad: m.cantidad })),
      canCook,
      canCookBase,
      tier,
      basesRequeridas: recipe.basesRequeridas
    };
  });

  // Ordenar de mayor a menor score de completitud
  results.sort((a, b) => b.score - a.score);

  return {
    totalRecetas: recipes.length,
    listasParaCocinar: results.filter(r => r.tier === 'lista'),
    casiListas: results.filter(r => r.tier === 'casi_lista'),
    incompletas: results.filter(r => r.tier === 'incompleta'),
    todas: results
  };
}

function getBatchPlanForRecipes(recipeIds) {
  const bases = FRIDGE_AND_PREP_DATA.batchCookingBases;
  const targetIds = (recipeIds || []).map(id => id.toLowerCase().trim());

  const matchedBases = bases.filter(base => {
    return base.recetasQueLaUsan.some(r => targetIds.includes(r.recipeId.toLowerCase()));
  });

  let totalTiempoAhorrado = 0;
  matchedBases.forEach(b => totalTiempoAhorrado += b.ahorroTiempoMinutosSemanal);

  return {
    recetasSeleccionadas: recipeIds,
    basesSugeridas: matchedBases,
    totalTiempoAhorradoMinutos: totalTiempoAhorrado
  };
}

function getSoakingScheduleForRecipes(recipeIds) {
  const recipes = FRIDGE_AND_PREP_DATA.recipesMapping;
  const soakingRules = FRIDGE_AND_PREP_DATA.soakingAndPreTimes;
  const targetIds = (recipeIds || []).map(id => id.toLowerCase().trim());

  const selectedRecipes = recipes.filter(r => targetIds.includes(r.id.toLowerCase()));
  
  // Reunir todos los IDs de ingredientes principales y condimentos
  const allIngredientIds = new Set();
  selectedRecipes.forEach(r => {
    r.principales.forEach(p => allIngredientIds.add(p.id));
    r.condimentos.forEach(c => allIngredientIds.add(c.id));
  });

  const activeRules = soakingRules.filter(rule => allIngredientIds.has(rule.ingredienteId));

  // Ordenar por tiempo de anticipación necesario (de mayor a menor)
  activeRules.sort((a, b) => b.tiempoOptimoHoras - a.tiempoOptimoHoras);

  return {
    recetas: selectedRecipes.map(r => ({ id: r.id, titulo: r.titulo })),
    remojosRequeridos: activeRules
  };
}


if (typeof window !== 'undefined') {
  window.FRIDGE_AND_PREP_DATA = FRIDGE_AND_PREP_DATA;
  window.DetoxFridgeEngine = {
    data: FRIDGE_AND_PREP_DATA,
    matchFridge,
    getBatchPlanForRecipes,
    getSoakingScheduleForRecipes
  };
}

if (typeof module !== 'undefined') {
  module.exports = {
    data: FRIDGE_AND_PREP_DATA,
    matchFridge,
    getBatchPlanForRecipes,
    getSoakingScheduleForRecipes
  };
}
