// Verificación y tests automatizados del motor clínico
const engine = require('./fridge_and_prep_engine.js');
const detoxData = require('../app/detox-data.js');

console.log("=== 1. VERIFICACIÓN DE INTEGRIDAD DE DATOS ===");
const data = engine.data;

// Check 1: 11 recipes present
console.log("Total recetas en DETOX_DATA:", detoxData.recipes.length);
console.log("Total recetas en Motor:", data.recipesMapping.length);
if (detoxData.recipes.length !== data.recipesMapping.length) {
  throw new Error("Discrepancia en cantidad de recetas!");
}

// Check 2: Ingredient IDs in catalog
const catalogIds = new Set(data.ingredientsCatalog.map(i => i.id));
console.log("Total ingredientes en catálogo:", catalogIds.size);

data.recipesMapping.forEach(r => {
  r.principales.forEach(p => {
    if (!catalogIds.has(p.id)) throw new Error(`Ingrediente principal ${p.id} en ${r.id} no existe en catálogo!`);
  });
  r.condimentos.forEach(c => {
    if (!catalogIds.has(c.id)) throw new Error(`Condimento ${c.id} en ${r.id} no existe en catálogo!`);
  });
});
console.log("✓ Todos los ingredientes de recetas existen en el catálogo.");

// Check 3: Soaking IDs
const soakingIds = new Set(data.soakingAndPreTimes.map(s => s.ingredienteId));
data.ingredientsCatalog.filter(i => i.requiereActivacion).forEach(i => {
  if (!soakingIds.has(i.activacionId)) {
    throw new Error(`Activación ${i.activacionId} de ${i.id} no existe en soakingAndPreTimes!`);
  }
});
console.log("✓ Todas las reglas de activación de ingredientes están mapeadas.");

// Check 4: Batch bases
const baseIds = new Set(data.batchCookingBases.map(b => b.id));
data.recipesMapping.forEach(r => {
  r.basesRequeridas.forEach(baseId => {
    if (!baseIds.has(baseId)) throw new Error(`Base ${baseId} en ${r.id} no existe en batchCookingBases!`);
  });
});
console.log("✓ Todas las bases requeridas existen en batchCookingBases.");

console.log("\n=== 2. TESTS DE SCORING Y REGLAS CLÍNICAS ===");

// Test A: Solo condimentos
const allCondiments = data.ingredientsCatalog.filter(i => i.clasificacion === 'condimento').map(i => i.id);
const resOnlyCondiments = engine.matchFridge(allCondiments);
console.log("Test A (Heladera llena SÓLO con condimentos):");
let maxScoreOnlyCondiments = 0;
resOnlyCondiments.todas.forEach(r => {
  if (r.score > maxScoreOnlyCondiments) maxScoreOnlyCondiments = r.score;
});
console.log(` -> Max score obtenido: ${maxScoreOnlyCondiments}% (Debe ser <= 20% y nunca superar 40%)`);
if (maxScoreOnlyCondiments > 20) throw new Error("Violación: Score con solo condimentos superó el 20%!");
console.log("✓ Regla cumplida: Sin alimentos principales nunca supera el 40% (máximo obtenido: " + maxScoreOnlyCondiments + "%).");

// Test B: Hummus de Mung completo
const hummusIngredients = ['porotos_mung', 'ajo', 'albahaca', 'aceite_oliva', 'limon', 'sal_marina'];
const resHummus = engine.matchFridge(hummusIngredients);
const hummusResult = resHummus.todas.find(r => r.recipeId === 'hummus-mung');
console.log("\nTest B (Ingredientes completos de Hummus de Mung):");
console.log(` -> Score Hummus: ${hummusResult.score}% | CanCook: ${hummusResult.canCook} | Tier: ${hummusResult.tier}`);
if (hummusResult.score !== 100 || !hummusResult.canCook) throw new Error("Fallo en completitud de Hummus de Mung!");
console.log("✓ Hummus al 100% y listo para cocinar.");

// Test C: Batch Cooking Plan
console.log("\nTest C (Batch Cooking para Bowl Alcalino + Galletas Yamaní):");
const batchPlan = engine.getBatchPlanForRecipes(['bowl-yamani-cruciferas', 'galletas-yamani']);
console.log(" -> Bases detectadas:", batchPlan.basesSugeridas.map(b => b.nombre));
console.log(` -> Ahorro semanal estimado: ${batchPlan.totalTiempoAhorradoMinutos} minutos`);
if (!batchPlan.basesSugeridas.some(b => b.id === 'base-arroz-yamani')) {
  throw new Error("Base de arroz yamaní no detectada!");
}
console.log("✓ Planificador de Batch Cooking asoció correctamente las bases compartidas.");

// Test D: Gestor de Remojos
console.log("\nTest D (Gestor de Remojos para Leche de Almendras + Hummus de Mung):");
const soakingSchedule = engine.getSoakingScheduleForRecipes(['leche-almendras', 'hummus-mung']);
console.log(" -> Remojos requeridos:", soakingSchedule.remojosRequeridos.map(s => `${s.nombre} (${s.tiempoLabel})`));
if (soakingSchedule.remojosRequeridos.length !== 2) throw new Error("Cantidad de remojos incorrecta!");
console.log("✓ Gestor de Remojos listó con precisión los tiempos previos.");

console.log("\n==============================================");
console.log(" TODOS LOS TESTS PASARON EXITOSAMENTE (100%) ");
console.log("==============================================");
