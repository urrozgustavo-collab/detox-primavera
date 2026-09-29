const fs = require('fs');

console.log('🧪 Testing Recipes Catalog Integration...');

const detoxDataCode = fs.readFileSync('app/detox-data.js', 'utf8');
eval(detoxDataCode + '; global.DETOX_DATA = DETOX_DATA;');

const recipes = global.DETOX_DATA.recipes;
console.log(`✓ Loaded DETOX_DATA with ${recipes.length} recipes.`);
if (recipes.length !== 73) {
  throw new Error(`Expected 73 recipes, but found ${recipes.length}`);
}

// Check IDs are unique
const ids = new Set();
recipes.forEach(r => {
  if (!r.id || !r.titulo || !r.categoria || !Array.isArray(r.ingredientes) || !Array.isArray(r.pasos)) {
    throw new Error(`Invalid recipe structure for ${JSON.stringify(r)}`);
  }
  if (ids.has(r.id)) {
    throw new Error(`Duplicate recipe id found: ${r.id}`);
  }
  ids.add(r.id);
});
console.log(`✓ All ${ids.size} recipe IDs are unique and well-structured.`);

// Check categories
const expectedCategories = ['desayunos', 'almuerzos', 'sopas', 'caldos', 'dips', 'alinos', 'panificados', 'fermentos', 'leches', 'infusiones'];
const foundCategories = new Set(recipes.map(r => r.categoria));
expectedCategories.forEach(cat => {
  if (!foundCategories.has(cat)) {
    throw new Error(`Expected category ${cat} was not found in any recipe!`);
  }
});
console.log(`✓ All 10 recipe categories are represented across the catalog:`, Array.from(foundCategories));

// Check allergen tags
const allergicRecipes = recipes.filter(r => Array.isArray(r.alergenos) && r.alergenos.length > 0);
console.log(`✓ ${allergicRecipes.length} recipes mapped with potential allergen tags.`);

console.log('\n🎉 ALL RECIPES CATALOG TESTS PASSED CLEANLY (100%)!');
process.exit(0);
