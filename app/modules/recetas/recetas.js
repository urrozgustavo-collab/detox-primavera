// Módulo: Catálogo de Recetas y Modo Cocina
function useRecetasModule({ ref, computed, watch, data, safeStorage, triggerToast, fireConfetti }) {
  const recipeSubView = ref(safeStorage.get('detox_recipe_subview') || 'catalogo');
  const recipeSearch = ref('');
  const recipeFilterCategory = ref('todas');
  const activeRecipe = ref(null);
  const activeCookingRecipe = ref(null);
  const cookingStepIndex = ref(0);

  watch(recipeSubView, (val) => safeStorage.set('detox_recipe_subview', val));

  const filteredRecipes = computed(() => {
    if (!data.recipes) return [];
    return data.recipes.filter((r) => {
      const matchCat = recipeFilterCategory.value === 'todas' || r.categoria === recipeFilterCategory.value;
      const q = recipeSearch.value.trim().toLowerCase();
      const matchQ = !q || r.titulo.toLowerCase().includes(q) ||
        r.ingredientes.some(i => i.toLowerCase().includes(q)) ||
        r.metodo.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  });

  const openRecipe = (recipe) => {
    activeRecipe.value = recipe;
  };

  const closeRecipe = () => {
    activeRecipe.value = null;
  };

  const startCooking = (recipe) => {
    activeCookingRecipe.value = recipe;
    cookingStepIndex.value = 0;
    activeRecipe.value = null;
  };

  const nextCookingStep = () => {
    if (activeCookingRecipe.value && cookingStepIndex.value < activeCookingRecipe.value.pasos.length - 1) {
      cookingStepIndex.value++;
    } else {
      fireConfetti();
      triggerToast("👨‍🍳 ¡Plato listo! A disfrutar sentado y con presencia.");
      exitCooking();
    }
  };

  const prevCookingStep = () => {
    if (cookingStepIndex.value > 0) {
      cookingStepIndex.value--;
    }
  };

  const exitCooking = () => {
    activeCookingRecipe.value = null;
    cookingStepIndex.value = 0;
  };

  return {
    recipeSubView,
    recipeSearch,
    recipeFilterCategory,
    activeRecipe,
    activeCookingRecipe,
    cookingStepIndex,
    filteredRecipes,
    openRecipe,
    closeRecipe,
    startCooking,
    nextCookingStep,
    prevCookingStep,
    exitCooking
  };
}
