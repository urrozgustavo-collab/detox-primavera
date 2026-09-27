// Módulo: Gestor de Remojos y Tiempos Previos
function useRemojosModule({ computed, plannedRecipeIds }) {
  const soakingScheduleResults = computed(() => {
    if (typeof window !== 'undefined' && window.DetoxFridgeEngine) {
      return window.DetoxFridgeEngine.getSoakingScheduleForRecipes(plannedRecipeIds.value);
    }
    return { recetas: [], remojosRequeridos: [] };
  });

  return {
    soakingScheduleResults
  };
}
