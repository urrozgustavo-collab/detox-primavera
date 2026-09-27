// Módulo: Planificador Semanal & Batch Cooking
function useBatchModule({ ref, computed, watch, safeStorage, pushToCloud, triggerToast }) {
  const weeklyPlan = ref(JSON.parse(safeStorage.get('detox_weekly_plan') || '{}'));

  watch(weeklyPlan, (val) => {
    safeStorage.set('detox_weekly_plan', JSON.stringify(val));
    pushToCloud();
  }, { deep: true });

  const plannedRecipeIds = computed(() => {
    const ids = new Set();
    Object.values(weeklyPlan.value).forEach(dayObj => {
      if (!dayObj) return;
      ['desayuno', 'almuerzo', 'cena'].forEach(slot => {
        if (dayObj[slot]) ids.add(dayObj[slot]);
      });
    });
    if (ids.size === 0) {
      ['caldo-detox', 'nituke-manzana', 'hummus-mung', 'bowl-yamani-cruciferas', 'mayonesa-zanahoria'].forEach(id => ids.add(id));
    }
    return Array.from(ids);
  });

  const batchPlanResults = computed(() => {
    if (typeof window !== 'undefined' && window.DetoxFridgeEngine) {
      return window.DetoxFridgeEngine.getBatchPlanForRecipes(plannedRecipeIds.value);
    }
    return { recetasSeleccionadas: [], basesSugeridas: [], totalTiempoAhorradoMinutos: 0 };
  });

  const isRecipeInBatch = (recipeId) => plannedRecipeIds.value.includes(recipeId);

  const toggleRecipeInBatch = (recipeId) => {
    const current = weeklyPlan.value[1] || {};
    const exists = Object.values(current).includes(recipeId);
    if (exists) {
      const next = {};
      for (const [k, v] of Object.entries(current)) {
        if (v !== recipeId) next[k] = v;
      }
      weeklyPlan.value = { ...weeklyPlan.value, 1: next };
      triggerToast('Plato retirado del plan semanal.');
    } else {
      const slot = !current.almuerzo ? 'almuerzo' : (!current.cena ? 'cena' : 'desayuno');
      weeklyPlan.value = { ...weeklyPlan.value, 1: { ...current, [slot]: recipeId } };
      triggerToast('Plato añadido al plan semanal.');
    }
  };

  return {
    weeklyPlan,
    plannedRecipeIds,
    batchPlanResults,
    isRecipeInBatch,
    toggleRecipeInBatch
  };
}
