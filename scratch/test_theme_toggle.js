const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Theme Toggle & Mode Consistency Test...');

const repoDir = path.resolve(__dirname, '..');
const compiledIndex = fs.readFileSync(path.join(repoDir, 'index.html'), 'utf8');
const compiledApp = fs.readFileSync(path.join(repoDir, 'Detox-Primavera-App.html'), 'utf8');
const coreJs = fs.readFileSync(path.join(repoDir, 'app', 'core', 'core.js'), 'utf8');
const headerHtml = fs.readFileSync(path.join(repoDir, 'app', 'core', 'header.html'), 'utf8');
const indexTemplate = fs.readFileSync(path.join(repoDir, 'app', 'index.template.html'), 'utf8');

// 1. Verify body has NO transition-colors (prevents frozen dark paint bug)
if (indexTemplate.includes('<body') && indexTemplate.match(/<body[^>]*transition-colors/)) {
  throw new Error('❌ app/index.template.html <body> still contains transition-colors');
}
if (compiledIndex.match(/<body[^>]*transition-colors/)) {
  throw new Error('❌ compiled index.html <body> still contains transition-colors');
}
console.log('  ✓ <body> is free of transition-colors (prevents compositor paint freeze).');

// 2. Verify header & desktop nav unified sticky container
if (!headerHtml.includes('class="sticky top-0 z-30 w-full"')) {
  throw new Error('❌ Header and desktop nav are not wrapped in unified sticky container');
}
if (headerHtml.includes('top-[57px]')) {
  throw new Error('❌ Desktop nav still contains rigid top-[57px] offset');
}
console.log('  ✓ Header & Desktop Nav unified in coordinated sticky container (no rigid top-[57px]).');

// 3. Verify watch(isDarkMode) has immediate: true
if (!coreJs.includes('watch(isDarkMode') || !coreJs.includes('{ immediate: true }')) {
  throw new Error('❌ watch(isDarkMode) missing { immediate: true } in app/core/core.js');
}
console.log('  ✓ watch(isDarkMode) configured with { immediate: true } in core.js.');

// 4. Verify early <head> script checks both localStorage and document.cookie
if (!compiledIndex.includes('detox_dark_mode') || !compiledIndex.includes('document.cookie')) {
  throw new Error('❌ Early head script missing cookie fallback');
}
console.log('  ✓ Early <head> FOUC script verifies both localStorage and document.cookie.');

// 5. Standalone file parity
if (compiledIndex !== compiledApp) {
  throw new Error('❌ index.html and Detox-Primavera-App.html are not in exact sync');
}
console.log('  ✓ Standalone Detox-Primavera-App.html and index.html are in exact parity.');

console.log('\n🎉 ALL THEME CONSISTENCY VERIFICATIONS PASSED (100%)!');
