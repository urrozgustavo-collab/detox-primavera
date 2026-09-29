const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Responsive Layout & Mobile Audit Verification...');

const repoDir = path.resolve(__dirname, '..');
const compiledIndex = fs.readFileSync(path.join(repoDir, 'index.html'), 'utf8');
const compiledApp = fs.readFileSync(path.join(repoDir, 'Detox-Primavera-App.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(repoDir, 'app', 'styles.css'), 'utf8');

// 1. Verify CSS containment
if (!stylesCss.includes('main, section') || !stylesCss.includes('min-width: 0') || !stylesCss.includes('max-width: 100%')) {
  throw new Error('❌ styles.css missing responsive containment rules for main/section');
}
console.log('  ✓ styles.css responsive containment confirmed.');

// 2. Verify <main> layout
if (!compiledIndex.includes('<main class="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-8 sm:pb-12 min-w-0">')) {
  throw new Error('❌ <main> missing w-full min-w-0 in compiled bundle');
}
console.log('  ✓ <main> correctly configured with w-full min-w-0.');

// 3. Verify footer clearance & SemVer version
if (!compiledIndex.includes('pb-28 md:pb-8') || !compiledIndex.includes('pb-safe')) {
  throw new Error('❌ <footer> missing bottom clearance (pb-28 md:pb-8 pb-safe) for mobile nav');
}
if (!compiledIndex.includes('v1.4.1')) {
  throw new Error('❌ <footer> version not bumped to v1.4.1');
}
console.log('  ✓ <footer> bottom clearance (pb-28 pb-safe) & version v1.4.1 confirmed.');

// 4. Verify Dia Carousel containment
if (!compiledIndex.includes('min-w-0 max-w-full overflow-hidden')) {
  throw new Error('❌ Day carousel containment wrapper missing');
}
console.log('  ✓ Day selector carousel contained within overflow-hidden.');

// 5. Verify Recetas Switcher 2x2 grid on mobile
if (!compiledIndex.includes('grid grid-cols-2 sm:flex p-1 bg-stone-100')) {
  throw new Error('❌ Recetas segmented switcher missing grid-cols-2 sm:flex responsive layout');
}
if (compiledIndex.includes('min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold')) {
  throw new Error('❌ Recetas switcher still contains rigid min-w-[130px] that breaks mobile');
}
console.log('  ✓ Recetas switcher mobile 2x2 grid verified (no fixed min-width overflow).');

// 6. Verify Compras filter responsive wrapping
if (!compiledIndex.includes('flex flex-col sm:flex-row sm:items-center justify-between gap-2.5')) {
  throw new Error('❌ Compras filter bar missing flex-col sm:flex-row responsive wrapping');
}
console.log('  ✓ Compras category filter bar responsive flex verified.');

// 7. Verify all sections have min-w-0 containment
const sections = ['dia', 'recetas', 'compras', 'semaforo', 'sos', 'taller'];
for (const s of sections) {
  if (s === 'recetas') {
    if (!compiledIndex.includes(`section v-show="activeTab === '${s}'" class="w-full min-w-0 max-w-full`)) {
      throw new Error(`❌ Section ${s} missing responsive containment classes`);
    }
  } else {
    if (!compiledIndex.includes(`section v-show="activeTab === '${s}'" class="w-full min-w-0 max-w-full`)) {
      throw new Error(`❌ Section ${s} missing responsive containment classes`);
    }
  }
}
console.log('  ✓ All 6 sections confirmed with w-full min-w-0 max-w-full.');

// 8. Standalone file parity
if (compiledIndex !== compiledApp) {
  throw new Error('❌ index.html and Detox-Primavera-App.html are not in exact sync');
}
console.log('  ✓ Standalone Detox-Primavera-App.html and index.html are in exact parity.');

console.log('\n🎉 ALL RESPONSIVE AUDIT VERIFICATIONS PASSED WITH 100% SUCCESS!');
