// Módulo: Heladera Inteligente ("¿Qué cocino hoy con lo que tengo?")
function useHeladeraModule({ ref, computed, watch, safeStorage, pushToCloud, triggerToast, data }) {
  const fridgeSelected = ref(JSON.parse(safeStorage.get('detox_fridge_selected') || '[]'));
  const fridgeFilterCategory = ref('todas');
  const fridgeSearch = ref('');
  const fridgeTierFilter = ref('todas');

  watch(fridgeSelected, (val) => {
    safeStorage.set('detox_fridge_selected', JSON.stringify(val));
    pushToCloud();
  }, { deep: true });

  const fridgeData = computed(() => {
    if (typeof window !== 'undefined' && window.FRIDGE_AND_PREP_DATA) return window.FRIDGE_AND_PREP_DATA;
    if (typeof FRIDGE_AND_PREP_DATA !== 'undefined') return FRIDGE_AND_PREP_DATA;
    return null;
  });

  const fridgeCatalog = computed(() => fridgeData.value?.ingredientsCatalog || []);

  const filteredFridgeIngredients = computed(() => {
    const q = fridgeSearch.value.trim().toLowerCase();
    const cat = fridgeFilterCategory.value;
    return fridgeCatalog.value.filter(ing => {
      const matchCat = cat === 'todas' || ing.categoria === cat;
      const matchQ = !q || ing.nombre.toLowerCase().includes(q) || (ing.sinonimos && ing.sinonimos.some(s => s.toLowerCase().includes(q)));
      return matchCat && matchQ;
    });
  });

  const fridgeQuickTags = computed(() => {
    const topIds = [
      'manzana', 'arroz_yamani', 'porotos_mung', 'calabaza_anco', 'zanahoria',
      'brocoli', 'repollo_blanco_colorado', 'apio', 'palta', 'almendras',
      'aceite_oliva', 'sal_marina', 'limon', 'ajo', 'jengibre', 'shoyu_moa'
    ];
    return fridgeCatalog.value.filter(ing => topIds.includes(ing.id));
  });

  const fridgeMatchResults = computed(() => {
    if (typeof window !== 'undefined' && window.DetoxFridgeEngine) {
      return window.DetoxFridgeEngine.matchFridge(fridgeSelected.value);
    }
    return { totalRecetas: 0, listasParaCocinar: [], casiListas: [], incompletas: [], todas: [] };
  });

  const filteredFridgeMatches = computed(() => {
    const res = fridgeMatchResults.value;
    if (fridgeTierFilter.value === 'lista') return res.listasParaCocinar;
    if (fridgeTierFilter.value === 'casi_lista') return res.casiListas;
    return res.todas;
  });

  const toggleFridgeIngredient = (id) => {
    if (fridgeSelected.value.includes(id)) {
      fridgeSelected.value = fridgeSelected.value.filter(x => x !== id);
    } else {
      fridgeSelected.value.push(id);
    }
  };

  const isFridgeIngredientSelected = (id) => fridgeSelected.value.includes(id);

  const clearFridge = () => {
    fridgeSelected.value = [];
    triggerToast('🧊 Heladera vaciada.');
  };

  const selectCommonPantry = () => {
    const basicIds = ['aceite_oliva', 'sal_marina', 'limon', 'agua_filtro'];
    const set = new Set([...fridgeSelected.value, ...basicIds]);
    fridgeSelected.value = Array.from(set);
    triggerToast('🧂 Despensa básica añadida (aceite, sal marina, limón)');
  };

  const addMissingToShoppingList = (recipeMatch) => {
    const allMissing = [...(recipeMatch.missingPrincipales || []), ...(recipeMatch.missingCondimentos || [])];
    if (allMissing.length === 0) {
      triggerToast('✅ ¡Ya tenés todos los ingredientes de esta receta!');
      return;
    }
    const names = allMissing.map(m => m.nombre).join(', ');
    triggerToast(`🛒 Faltantes para ${recipeMatch.titulo}: ${names}`);
  };

  return {
    fridgeSelected,
    fridgeFilterCategory,
    fridgeSearch,
    fridgeTierFilter,
    fridgeCatalog,
    filteredFridgeIngredients,
    fridgeQuickTags,
    fridgeMatchResults,
    filteredFridgeMatches,
    toggleFridgeIngredient,
    isFridgeIngredientSelected,
    clearFridge,
    selectCommonPantry,
    addMissingToShoppingList
  };
}
