const fs = require('fs');
const path = require('path');

const appDataPath = path.join(__dirname, '..', 'app', 'detox-data.js');
let code = fs.readFileSync(appDataPath, 'utf8');
const quotes = JSON.parse(fs.readFileSync(path.join(__dirname, 'clinical_quotes.json'), 'utf8'));

const journalConfig = {
  energyLevels: [
    { id: 1, label: 'Baja / En crisis', icon: '🌧️', desc: 'Fatiga o malestar depurativo' },
    { id: 2, label: 'Tranquila', icon: '⛅', desc: 'Cuerpo pesado o desgano' },
    { id: 3, label: 'Estable', icon: '🌤️', desc: 'Ritmo normal y sereno' },
    { id: 4, label: 'Buena', icon: '☀️', desc: 'Liviano y despejado' },
    { id: 5, label: 'Radiante', icon: '✨', desc: 'Vitalidad plena y mente lúcida' }
  ],
  digestionStates: [
    { id: 'liviano', label: 'Liviano y ágil', icon: '🪶' },
    { id: 'gases', label: 'Hinchazón / Gases', icon: '🎈' },
    { id: 'lenta', label: 'Digestión pesada', icon: '⏳' },
    { id: 'optima', label: 'Evacuación óptima', icon: '🌿' }
  ],
  commonSymptoms: [
    'Cefalea leve',
    'Lengua saburral',
    'Sed intensa',
    'Hambre emocional',
    'Dolor muscular',
    'Frío en extremidades',
    'Náuseas leves',
    'Despejado / Cero síntomas'
  ],
  mealSlots: [
    { id: 'desayuno', label: 'Desayuno', icon: '🌅' },
    { id: 'almuerzo', label: 'Almuerzo', icon: '☀️' },
    { id: 'merienda', label: 'Merienda', icon: '🍵' },
    { id: 'cena', label: 'Cena', icon: '🌙' }
  ]
};

const block = ',\n  dailyQuotes: ' + JSON.stringify(quotes, null, 2) + ',\n\n  journalOptions: ' + JSON.stringify(journalConfig, null, 2) + '\n};';

const target = '\n};\n\nif (typeof window !== \'undefined\')';
if (code.includes(target)) {
  code = code.replace(target, block + '\n\nif (typeof window !== \'undefined\')');
  fs.writeFileSync(appDataPath, code, 'utf8');
  console.log('Successfully updated detox-data.js!');
} else {
  console.error('Target string not found in detox-data.js');
}
