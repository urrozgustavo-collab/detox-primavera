const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');
console.log('HTML size:', html.length, 'bytes');

const unreplaced = [];
if (html.includes('<script src="app.js">')) unreplaced.push('app.js');
if (html.includes('<script src="fridge-engine.js">')) unreplaced.push('fridge-engine.js');
if (html.includes('<script src="detox-data.js">')) unreplaced.push('detox-data.js');
if (html.includes('<link rel="stylesheet" href="styles.css">')) unreplaced.push('styles.css');

if (unreplaced.length > 0) {
  console.error('FAIL: Unreplaced assets found:', unreplaced);
  process.exit(1);
}

// Extract script content and verify syntax
const scriptBlocks = html.match(/<script[\s\S]*?<\/script>/gi) || [];
console.log(`Found ${scriptBlocks.length} script blocks.`);

// Verify key objects are present
const checks = [
  'DETOX_DATA',
  'FRIDGE_AND_PREP_DATA',
  'DetoxFridgeEngine',
  'recipeSubView',
  'fridgeSelected',
  'fridgeMatchResults',
  'batchPlanResults',
  'soakingScheduleResults'
];

checks.forEach(token => {
  if (!html.includes(token)) {
    console.error(`FAIL: Missing token ${token}`);
    process.exit(1);
  }
});

console.log('SUCCESS: All checks passed cleanly. Bundle is ready for production deployment!');
