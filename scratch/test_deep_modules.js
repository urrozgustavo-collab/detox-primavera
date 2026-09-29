const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🧪 Starting Deep Modularization Verification Test...');

// Mock browser environment
const domMock = {
  window: {},
  location: {
    origin: 'http://localhost',
    pathname: '/index.html',
    search: '',
    hash: '',
    href: 'http://localhost/index.html'
  },
  history: {
    replaceState: () => {}
  },
  addEventListener: () => {},
  document: {
    documentElement: {
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false
      }
    },
    cookie: '',
    addEventListener: () => {},
    createElement: () => ({ select: () => {} }),
    body: { appendChild: () => {}, removeChild: () => {} }
  },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] !== undefined ? this._data[k] : null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; }
  },
  navigator: {
    clipboard: {
      writeText: async (t) => Promise.resolve()
    }
  },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  fetch: async () => ({ ok: true, status: 200, text: async () => '{}', json: async () => ({}) }),
  confetti: () => {},
  lucide: { createIcons: () => {} }
};

domMock.window = domMock;
global.window = domMock;
global.document = domMock.document;
global.localStorage = domMock.localStorage;
global.navigator = domMock.navigator;

// Minimal reactive mock for Vue 3 setup testing
const VueMock = {
  createApp: (options) => {
    return {
      setup: options.setup,
      config: { warnHandler: null, errorHandler: null },
      mount: (selector) => {
        const state = options.setup();
        return state;
      }
    };
  },
  ref: (initial) => {
    return {
      _val: initial,
      get value() { return this._val; },
      set value(v) { this._val = v; }
    };
  },
  computed: (getter) => {
    return {
      get value() { return getter(); }
    };
  },
  watch: (source, callback, options) => {
    // mock watch
  },
  onMounted: (fn) => {
    fn();
  }
};
domMock.Vue = VueMock;
global.Vue = VueMock;

const repoDir = path.resolve(__dirname, '..');
const appDir = path.join(repoDir, 'app');

// 1. Load data and fridge engine
const detoxDataCode = fs.readFileSync(path.join(appDir, 'detox-data.js'), 'utf-8');
vm.runInThisContext(detoxDataCode);

const fridgeEngineCode = fs.readFileSync(path.join(appDir, 'fridge-engine.js'), 'utf-8');
vm.runInThisContext(fridgeEngineCode);

if (!global.DETOX_DATA && !global.window.DETOX_DATA) {
  throw new Error('DETOX_DATA failed to load');
}
if (!global.FRIDGE_AND_PREP_DATA && !global.window.FRIDGE_AND_PREP_DATA) {
  throw new Error('FRIDGE_AND_PREP_DATA failed to load');
}

// 2. Load all modules in sequence
const moduleFiles = [
  path.join(appDir, 'core', 'core.js'),
  path.join(appDir, 'modules', 'dia', 'dia.js'),
  path.join(appDir, 'modules', 'recetas', 'recetas.js'),
  path.join(appDir, 'modules', 'heladera', 'heladera.js'),
  path.join(appDir, 'modules', 'batch', 'batch.js'),
  path.join(appDir, 'modules', 'remojos', 'remojos.js'),
  path.join(appDir, 'modules', 'compras', 'compras.js'),
  path.join(appDir, 'modules', 'semaforo', 'semaforo.js'),
  path.join(appDir, 'modules', 'sos', 'sos.js'),
  path.join(appDir, 'modules', 'herbolario', 'herbolario.js'),
  path.join(appDir, 'app.js')
];

moduleFiles.forEach(file => {
  const code = fs.readFileSync(file, 'utf-8');
  try {
    vm.runInThisContext(code);
    console.log(`  ✓ Loaded: ${path.relative(repoDir, file)}`);
  } catch (err) {
    console.error(`  ✗ Error loading ${file}:`, err);
    process.exit(1);
  }
});

// 3. Test App Setup & Mounting
console.log('\n🔍 Testing Vue App Setup & Module Wiring...');
const instance = app.mount('#app');

// 4. Assertions on State and Features from v1.2.1
const requiredProps = [
  // Core
  'isDarkMode', 'activeTab', 'toastMessage', 'showToast', 'triggerToast', 'syncKey', 'syncStatus',
  // Dia & Datepicker v1.2.1
  'selectedDay', 'startDate', 'tempStartDate', 'showDateSettings', 'toggleDatePicker',
  'setQuickDate', 'applySelectedDate', 'startChallengeToday', 'cancelChallengeStart',
  'challengeInfo', 'currentDailyQuote', 'dailyJournal', 'dailyMeals', 'generateReportText',
  // Recetas
  'recipeSubView', 'filteredRecipes', 'openRecipe', 'startCooking',
  // Heladera
  'fridgeSelected', 'fridgeCatalog', 'filteredFridgeMatches', 'toggleFridgeIngredient', 'selectCommonPantry',
  // Batch & Remojos
  'plannedRecipeIds', 'batchPlanResults', 'soakingScheduleResults',
  // Compras & Semáforo
  'shoppingChecked', 'filteredShopping', 'shoppingStats', 'toggleShopping', 'copyShoppingList',
  'foodSearch', 'filteredFoods',
  // SOS & Herbolario
  'sosProtocols', 'workshopInfo'
];

let missing = [];
requiredProps.forEach(prop => {
  if (instance[prop] === undefined) {
    missing.push(prop);
  }
});

if (missing.length > 0) {
  console.error('❌ FAIL: Missing required properties on Vue root instance:', missing);
  process.exit(1);
}
console.log(`  ✓ All ${requiredProps.length} core and feature properties verified on root instance.`);

// 5. Test Date Picker logic from v1.2.1
console.log('\n🔍 Testing v1.2.1 Date Picker behavior...');
instance.cancelChallengeStart();
if (instance.startDate.value !== null) {
  throw new Error(`Expected startDate to be null after cancelChallengeStart, got: ${instance.startDate.value}`);
}
console.log('  ✓ cancelChallengeStart correctly returns state to null (foja cero).');

instance.toggleDatePicker();
if (!instance.showDateSettings.value) {
  throw new Error('Expected showDateSettings to be true after toggleDatePicker');
}
console.log('  ✓ toggleDatePicker opens date settings modal.');

instance.setQuickDate('tomorrow');
if (!instance.tempStartDate.value || instance.tempStartDate.value.length !== 10) {
  throw new Error(`Expected tempStartDate to be set, got: ${instance.tempStartDate.value}`);
}
console.log(`  ✓ setQuickDate('tomorrow') set tempStartDate to: ${instance.tempStartDate.value}`);

instance.applySelectedDate();
if (instance.startDate.value !== instance.tempStartDate.value) {
  throw new Error(`Expected startDate to match tempStartDate, got: ${instance.startDate.value}`);
}
console.log(`  ✓ applySelectedDate correctly applied start date: ${instance.startDate.value}`);

// 6. Test Heladera Matching
console.log('\n🔍 Testing Heladera Matching Engine...');
instance.clearFridge();
instance.toggleFridgeIngredient('manzana');
instance.toggleFridgeIngredient('arroz_yamani');
const matches = instance.filteredFridgeMatches.value;
console.log(`  ✓ Heladera match returned ${matches.length} recipes for apple + brown rice.`);
if (matches.length === 0) {
  throw new Error('Expected matches for apple + brown rice');
}

// 7. Test Compras
console.log('\n🔍 Testing Compras Module...');
instance.toggleShopping('v1');
if (!instance.shoppingChecked.value['v1']) {
  throw new Error('Expected shoppingChecked[v1] to be true');
}
console.log('  ✓ toggleShopping updated reactive state.');

// 8. Test Bitácora Energy and Digestion Toggle-off
console.log('\n🔍 Testing Bitácora Energy & Digestion Deselection...');
instance.setJournalEnergy(4);
if (instance.currentDayJournal.value.energy !== 4) {
  throw new Error(`Expected energy to be 4, got: ${instance.currentDayJournal.value.energy}`);
}
instance.setJournalEnergy(4);
if (instance.currentDayJournal.value.energy !== null) {
  throw new Error(`Expected energy to be null after toggle-off, got: ${instance.currentDayJournal.value.energy}`);
}
console.log('  ✓ setJournalEnergy correctly toggles selection off to null.');

instance.setJournalDigestion('liviana');
if (instance.currentDayJournal.value.digestion !== 'liviana') {
  throw new Error(`Expected digestion to be 'liviana', got: ${instance.currentDayJournal.value.digestion}`);
}
instance.setJournalDigestion('liviana');
if (instance.currentDayJournal.value.digestion !== null) {
  throw new Error(`Expected digestion to be null after toggle-off, got: ${instance.currentDayJournal.value.digestion}`);
}
console.log('  ✓ setJournalDigestion correctly toggles selection off to null.');

// 9. Test Core QR & Sync Share URL Resolution
console.log('\n🔍 Testing Core QR & Sync Share URL Resolution...');
instance.syncKey.value = 'GUS-TEST';
const shareUrl = instance.syncShareUrl.value;
console.log(`  ✓ syncShareUrl resolved in local context: ${shareUrl}`);
if (!shareUrl.startsWith('https://urrozgustavo-collab.github.io/detox-primavera/?sync=GUS-TEST')) {
  throw new Error(`Expected shareUrl to point to production GitHub Pages, got: ${shareUrl}`);
}

const qrUrl = instance.qrCodeUrl.value;
console.log(`  ✓ qrCodeUrl generated: ${qrUrl}`);
if (!qrUrl.includes('api.qrserver.com') || !qrUrl.includes(encodeURIComponent(shareUrl))) {
  throw new Error(`Expected qrCodeUrl to properly encode production shareUrl, got: ${qrUrl}`);
}

console.log('  ✓ Core QR and Sync Share URL verified successfully.');

console.log('\n🎉 ALL DEEP INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
process.exit(0);
