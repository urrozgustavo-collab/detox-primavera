/* Detox de Primavera v2 — taxonomías compartidas (categorías, comercios, alérgenos, condiciones, síntomas…).
   Los campos `v1` guardan el texto exacto que usaba la v1 (sirven para migrar datos viejos). */
(function (root) {
  'use strict';
  root.DX = root.DX || {};

  root.DX.taxonomy = {
    recipeCategories: [
      { id: 'almuerzos',  label: 'Platos y guisos',      icon: 'bowl' },
      { id: 'ensaladas',  label: 'Ensaladas',            icon: 'hoja' },
      { id: 'sopas',      label: 'Sopas y cremas',       icon: 'olla' },
      { id: 'caldos',     label: 'Caldos',               icon: 'olla' },
      { id: 'desayunos',  label: 'Desayunos y meriendas', icon: 'amanecer' },
      { id: 'jugos',      label: 'Jugos y licuados',     icon: 'agua' },
      { id: 'dips',       label: 'Dips y untables',      icon: 'frasco' },
      { id: 'alinos',     label: 'Aliños y toppings',    icon: 'frasco' },
      { id: 'panificados', label: 'Panificados',         icon: 'trigo' },
      { id: 'fermentos',  label: 'Fermentos y pickles',  icon: 'frasco' },
      { id: 'leches',     label: 'Leches vegetales',     icon: 'taza' },
      { id: 'infusiones', label: 'Infusiones',           icon: 'taza' }
    ],

    mealSlots: [
      { id: 'desayuno', label: 'Desayuno', icon: 'amanecer' },
      { id: 'almuerzo', label: 'Almuerzo', icon: 'sol' },
      { id: 'merienda', label: 'Merienda', icon: 'taza' },
      { id: 'cena',     label: 'Cena',     icon: 'luna' }
    ],

    stores: [
      { id: 'verduleria',    label: 'Verdulería',    order: 1, v1: ['Verdulería'] },
      { id: 'dietetica',     label: 'Dietética',     order: 2, v1: ['Dietética'] },
      { id: 'herboristeria', label: 'Herboristería', order: 3, v1: ['Herboristería'] },
      { id: 'panaderia',     label: 'Panadería',     order: 4, v1: ['Panadería'] },
      { id: 'farmacia',      label: 'Farmacia',      order: 5, v1: ['Farmacia'] },
      { id: 'pescaderia',    label: 'Pescadería',    order: 6, v1: ['Pescadería'] },
      { id: 'granja',        label: 'Granja',        order: 7, v1: ['Granja'] },
      { id: 'carniceria',    label: 'Carnicería',    order: 8, v1: ['Carnicería pastura', 'Carnicería'] },
      { id: 'super',         label: 'Supermercado / almacén', order: 9, v1: [] }
    ],

    /* keywords: palabras completas (sin tildes, minúsculas) para comparar con alergias escritas a mano. */
    allergens: [
      { id: 'frutos_secos', label: 'Frutos secos', v1: ['Frutos secos'],
        keywords: ['almendra', 'almendras', 'caju', 'castana', 'castanas', 'nuez', 'nueces', 'pistacho', 'pistachos', 'avellana', 'avellanas'] },
      { id: 'semillas', label: 'Semillas', v1: ['Semillas'],
        keywords: ['semilla', 'semillas', 'lino', 'linaza', 'chia', 'girasol', 'amapola', 'pipas'] },
      { id: 'sesamo', label: 'Sésamo', v1: ['Sésamo'],
        keywords: ['sesamo', 'gomasio', 'tahini'] },
      { id: 'gluten', label: 'Gluten / trigo', v1: ['Gluten / Trigo'],
        keywords: ['gluten', 'trigo', 'centeno', 'cebada', 'avena', 'burgol', 'masamadre', 'seitan'] },
      { id: 'soja', label: 'Soja / shoyu', v1: ['Soja / Shoyu'],
        keywords: ['soja', 'shoyu', 'tofu', 'miso', 'tamari'] },
      { id: 'citricos', label: 'Cítricos', v1: ['Cítricos'],
        keywords: ['limon', 'lima', 'naranja', 'mandarina', 'pomelo', 'citrico', 'citricos'] },
      { id: 'apio', label: 'Apio', v1: ['Apio'], keywords: ['apio'] },
      { id: 'algas', label: 'Algas', v1: ['Algas'],
        keywords: ['alga', 'algas', 'nori', 'kombu', 'agar', 'espirulina', 'chlorella'] },
      { id: 'legumbres', label: 'Legumbres', v1: ['Legumbres'],
        keywords: ['mung', 'aduki', 'lenteja', 'lentejas', 'garbanzo', 'garbanzos', 'poroto', 'porotos', 'arveja', 'arvejas', 'haba', 'habas'] },
      { id: 'frutillas', label: 'Frutillas', v1: ['Frutillas'], keywords: ['frutilla', 'frutillas'] },
      { id: 'huevo', label: 'Huevo', v1: [], keywords: ['huevo', 'huevos'] },
      { id: 'pescado', label: 'Pescado', v1: [], keywords: ['pescado', 'merluza', 'salmon', 'trucha', 'abadejo'] },
      { id: 'lacteos', label: 'Lácteos', v1: [], keywords: ['leche', 'queso', 'manteca', 'yogur', 'lacteo', 'lacteos'] }
    ],

    conditions: [
      { id: 'embarazo',           label: 'Embarazo' },
      { id: 'lactancia',          label: 'Lactancia' },
      { id: 'anticoagulantes',    label: 'Anticoagulantes o antiagregantes (heparina, warfarina, aspirina…)' },
      { id: 'hipertiroidismo',    label: 'Hipertiroidismo' },
      { id: 'obstruccion_biliar', label: 'Obstrucción de vías biliares' },
      { id: 'ulcera_gastritis',   label: 'Úlcera, gastritis o acidez cotidiana' },
      { id: 'diarrea',            label: 'Diarrea o colon irritable con tendencia a la diarrea' },
      { id: 'hipotension',        label: 'Presión baja' }
    ],

    constitutions: [
      { id: 'friolento', label: 'Friolento/a',
        desc: 'Manos y pies fríos, poca sed, no transpirás, o se te hincha el abdomen bajo después de comer crudos. Te sientan mejor las comidas cocidas y calientes.' },
      { id: 'caluroso', label: 'Caluroso/a',
        desc: 'Sentís calor con facilidad, tenés sed y transpirás. Los crudos y las frutas frescas suelen sentarte bien.' }
    ],

    energyLevels: [
      { v: 1, label: 'Baja / en crisis', emoji: '🌧️', desc: 'Fatiga o malestar' },
      { v: 2, label: 'Tranquila',        emoji: '⛅', desc: 'Cuerpo pesado o desgano' },
      { v: 3, label: 'Estable',          emoji: '🌤️', desc: 'Ritmo normal y sereno' },
      { v: 4, label: 'Buena',            emoji: '☀️', desc: 'Liviano y despejado' },
      { v: 5, label: 'Radiante',         emoji: '✨', desc: 'Vitalidad plena y mente lúcida' }
    ],

    moodLevels: [
      { v: 1, label: 'Muy bajo',  emoji: '😞' },
      { v: 2, label: 'Bajo',      emoji: '😕' },
      { v: 3, label: 'Neutro',    emoji: '😐' },
      { v: 4, label: 'Bien',      emoji: '🙂' },
      { v: 5, label: 'Muy bien',  emoji: '😊' }
    ],

    digestionStates: [
      { id: 'liviano', label: 'Liviano y ágil',      emoji: '🪶' },
      { id: 'gases',   label: 'Hinchazón / gases',   emoji: '🎈' },
      { id: 'lenta',   label: 'Digestión pesada',    emoji: '⏳' },
      { id: 'optima',  label: 'Evacuación óptima',   emoji: '🌿' }
    ],

    /* sos = id de protocolo en DX.sos (sólo si la guía da pautas para ese síntoma). */
    symptoms: [
      { id: 'cefalea',       label: 'Cefalea leve',        v1: 'Cefalea leve',        sos: 'dolor-cabeza' },
      { id: 'lengua_saburral', label: 'Lengua saburral',   v1: 'Lengua saburral',     sos: null },
      { id: 'sed_intensa',   label: 'Sed intensa',         v1: 'Sed intensa',         sos: null },
      { id: 'hambre_emocional', label: 'Hambre emocional', v1: 'Hambre emocional',    sos: null },
      { id: 'dolor_muscular', label: 'Dolor muscular',     v1: 'Dolor muscular',      sos: null },
      { id: 'frio_extremidades', label: 'Frío en extremidades', v1: 'Frío en extremidades', sos: 'frio-corporal' },
      { id: 'nauseas',       label: 'Náuseas leves',       v1: 'Náuseas leves',       sos: 'nauseas' },
      { id: 'despejado',     label: 'Despejado / cero síntomas', v1: 'Despejado / Cero síntomas', sos: null, exclusive: true },
      { id: 'constipacion',  label: 'Constipación',        v1: null,                  sos: 'constipacion' },
      { id: 'diarrea',       label: 'Diarrea / flojera intestinal', v1: null,         sos: 'diarrea-flojera' },
      { id: 'acidez',        label: 'Acidez / reflujo',    v1: null,                  sos: 'acidez' },
      { id: 'mareos',        label: 'Mareos / presión baja', v1: null,                sos: 'mareos' },
      { id: 'debilidad',     label: 'Debilidad',           v1: null,                  sos: 'debilidad' },
      { id: 'hinchazon',     label: 'Hinchazón abdominal', v1: null,                  sos: null },
      { id: 'insomnio',      label: 'Insomnio',            v1: null,                  sos: null },
      { id: 'antojos',       label: 'Antojos',             v1: null,                  sos: null },
      { id: 'irritabilidad', label: 'Irritabilidad',       v1: null,                  sos: 'irritabilidad' }
    ],

    /* Categorías del catálogo de ingredientes (heladera, compras). */
    ingredientCategories: [
      { id: 'verduras',       label: 'Verduras' },
      { id: 'frutas',         label: 'Frutas' },
      { id: 'citricos',       label: 'Cítricos' },
      { id: 'grasas_frutas',  label: 'Palta y aceitunas' },
      { id: 'hongos',         label: 'Hongos' },
      { id: 'brotes',         label: 'Brotes' },
      { id: 'aromaticos',     label: 'Cebollas y ajo' },
      { id: 'hierbas',        label: 'Hierbas frescas y secas' },
      { id: 'especias',       label: 'Especias' },
      { id: 'granos',         label: 'Cereales y granos' },
      { id: 'legumbres',      label: 'Legumbres' },
      { id: 'harinas',        label: 'Harinas' },
      { id: 'pastas',         label: 'Fideos' },
      { id: 'panificados',    label: 'Panes y galletas' },
      { id: 'frutos_secos',   label: 'Frutos secos' },
      { id: 'semillas',       label: 'Semillas' },
      { id: 'grasas',         label: 'Aceites' },
      { id: 'proteinas',      label: 'Proteínas' },
      { id: 'fermentos',      label: 'Fermentos' },
      { id: 'condimentos',    label: 'Condimentos y aliños' },
      { id: 'endulzantes',    label: 'Endulzantes' },
      { id: 'encurtidos',     label: 'Encurtidos' },
      { id: 'algas',          label: 'Algas' },
      { id: 'infusiones',     label: 'Hierbas para infusión' },
      { id: 'suplementos',    label: 'Suplementos y complementos' },
      { id: 'basicos',        label: 'Básicos de alacena' }
    ],

    thermal: [
      { id: 'calido', label: 'Cálido' },
      { id: 'neutro', label: 'Neutro' },
      { id: 'fresco', label: 'Fresco' },
      { id: 'frio',   label: 'Frío' }
    ],

    /* Una sola palabra por estado en toda la app. */
    statusLabels: { green: 'Libre', yellow: 'Con moderación', red: 'Evitar' },

    phaseIds: ['previa', 'monodieta', 'general'],
    recipeTags: ['crudo', 'cocido', 'sin-coccion', 'batch', 'fermento', 'friolento-ok', 'caluroso-ok', 'rapida']
  };
})(typeof window !== 'undefined' ? window : globalThis);
