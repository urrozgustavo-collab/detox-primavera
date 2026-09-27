// Test del algoritmo de scoring de Heladera Inteligente
function calculateScore(recipe, availableIds) {
  // Ingredientes obligatorios
  const principalesObligatorios = recipe.principales.filter(p => !p.opcional);
  const condimentosObligatorios = recipe.condimentos.filter(c => !c.opcional);

  const totalP = principalesObligatorios.length;
  const totalC = condimentosObligatorios.length;

  const presentP = principalesObligatorios.filter(p => availableIds.includes(p.id)).length;
  const presentC = condimentosObligatorios.filter(c => availableIds.includes(c.id)).length;

  const ratioP = totalP > 0 ? (presentP / totalP) : 1;
  const ratioC = totalC > 0 ? (presentC / totalC) : 1;

  // Fórmula base: 80% principales + 20% condimentos
  let rawScore = (ratioP * 80) + (ratioC * 20);

  // Regla clínica estricta:
  // Si no tiene los principales (0 principales o menos de la mitad),
  // NUNCA puede superar el 40% aunque tenga todos los condimentos.
  let finalScore = rawScore;
  if (presentP === 0) {
    // Si no tiene NINGÚN alimento principal, el plato no existe
    finalScore = Math.min(finalScore, 20); // máximo 20% (solo condimentos)
  } else if (ratioP < 0.5) {
    // Si tiene menos de la mitad de los alimentos principales, capped a 40%
    finalScore = Math.min(finalScore, 40);
  }

  const scoreRounded = Math.round(finalScore);

  return {
    recipeId: recipe.id,
    titulo: recipe.titulo,
    score: scoreRounded,
    rawScore: Math.round(rawScore),
    ratioP: Math.round(ratioP * 100),
    ratioC: Math.round(ratioC * 100),
    presentP,
    totalP,
    presentC,
    totalC,
    faltanPrincipales: principalesObligatorios.filter(p => !availableIds.includes(p.id)).map(p => p.nombre),
    faltanCondimentos: condimentosObligatorios.filter(c => !availableIds.includes(c.id)).map(c => c.nombre),
    canCook: presentP === totalP && presentC === totalC,
    canCookBase: presentP === totalP
  };
}

// Simulacion 1: Usuario solo tiene condimentos (aceite, sal, limon, comino, ajo)
const pantryOnlyCondiments = ['aceite_oliva', 'sal_marina', 'limon', 'comino', 'ajo'];

const testRecipeBabaganoush = {
  id: 'babaganoush',
  titulo: 'Babaganoush',
  principales: [{ id: 'berenjena', nombre: 'Berenjenas' }],
  condimentos: [
    { id: 'ajo', nombre: 'Ajo' },
    { id: 'limon', nombre: 'Limón' },
    { id: 'aceite_oliva', nombre: 'Aceite de oliva' },
    { id: 'sal_marina', nombre: 'Sal marina' },
    { id: 'comino', nombre: 'Comino' }
  ]
};

console.log("TEST 1 (Solo condimentos en Babaganoush):");
console.log(calculateScore(testRecipeBabaganoush, pantryOnlyCondiments));

console.log("\nTEST 2 (Berenjena + Sal marina, sin los demás condimentos):");
console.log(calculateScore(testRecipeBabaganoush, ['berenjena', 'sal_marina']));

console.log("\nTEST 3 (Berenjena + todos los condimentos = 100%):");
console.log(calculateScore(testRecipeBabaganoush, ['berenjena', 'ajo', 'limon', 'aceite_oliva', 'sal_marina', 'comino']));
