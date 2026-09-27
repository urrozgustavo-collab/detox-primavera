import os
import re

repo_dir = r'c:\Users\urroz\Proyectos\04_productividad_herramientas\salud-recetas\detox-primavera'
app_dir = os.path.join(repo_dir, 'app')
core_dir = os.path.join(app_dir, 'core')
modules_dir = os.path.join(app_dir, 'modules')

# 1. Compras JS Module
compras_js = """// Módulo: Lista de Compras Interactiva
function useComprasModule({ ref, computed, watch, data, safeStorage, pushToCloud, triggerToast }) {
  const shoppingChecked = ref(JSON.parse(safeStorage.get('detox_shopping_checked') || '{}'));
  const shoppingFilterCategory = ref('todas');
  const shoppingOnlyPending = ref(false);

  watch(shoppingChecked, (val) => {
    safeStorage.set('detox_shopping_checked', JSON.stringify(val));
    pushToCloud();
  }, { deep: true });

  const filteredShopping = computed(() => {
    return data.shoppingList.filter((item) => {
      const matchCat = shoppingFilterCategory.value === 'todas' || item.cat === shoppingFilterCategory.value;
      const isChecked = !!shoppingChecked.value[item.id];
      const matchPending = !shoppingOnlyPending.value || !isChecked;
      return matchCat && matchPending;
    });
  });

  const shoppingStats = computed(() => {
    const total = data.shoppingList.length;
    const checked = Object.values(shoppingChecked.value).filter(Boolean).length;
    return {
      total,
      checked,
      pending: Math.max(0, total - checked),
      percent: total ? Math.round((checked / total) * 100) : 0
    };
  });

  const toggleShopping = (itemId) => {
    const current = !!shoppingChecked.value[itemId];
    shoppingChecked.value = {
      ...shoppingChecked.value,
      [itemId]: !current
    };
  };

  const copyShoppingList = () => {
    const pendingItems = data.shoppingList.filter(i => !shoppingChecked.value[i.id]);
    if (pendingItems.length === 0) {
      triggerToast('🛒 ¡Lista completa! No tenés items pendientes.');
      return;
    }
    const grouped = {};
    pendingItems.forEach(i => {
      if (!grouped[i.cat]) grouped[i.cat] = [];
      grouped[i.cat].push(`• ${i.nombre} (${i.cant})`);
    });
    let text = `🛒 LISTA DE COMPRAS — DETOX DE PRIMAVERA\\n`;
    text += `Items pendientes: ${pendingItems.length} de ${data.shoppingList.length}\\n`;
    text += `--------------------------------------------------\\n`;
    for (const [cat, items] of Object.entries(grouped)) {
      text += `\\n📍 ${cat.toUpperCase()}:\\n${items.join('\\n')}\\n`;
    }
    text += `\\n--------------------------------------------------\\nDetox 21 Días • Isa Caparra`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        triggerToast('📋 ¡Lista pendiente copiada al portapapeles!');
      });
    }
  };

  return {
    shoppingChecked,
    shoppingFilterCategory,
    shoppingOnlyPending,
    filteredShopping,
    shoppingStats,
    toggleShopping,
    copyShoppingList
  };
}
"""

# 2. Semaforo JS Module
semaforo_js = """// Módulo: Semáforo Nutricional ("¿Puedo comer esto?")
function useSemaforoModule({ ref, computed, data }) {
  const foodSearch = ref('');
  const foodStatusFilter = ref('todos');

  const filteredFoods = computed(() => {
    return data.foodTrafficLight.filter((f) => {
      const matchStatus = foodStatusFilter.value === 'todos' || f.estado === foodStatusFilter.value;
      const q = foodSearch.value.trim().toLowerCase();
      const matchQ = !q || f.nombre.toLowerCase().includes(q) ||
        f.cat.toLowerCase().includes(q) ||
        f.desc.toLowerCase().includes(q);
      return matchStatus && matchQ;
    });
  });

  return {
    foodSearch,
    foodStatusFilter,
    filteredFoods
  };
}
"""

# 3. Recetas JS Module
recetas_js = """// Módulo: Catálogo de Recetas y Modo Cocina
function useRecetasModule({ ref, computed, watch, data, safeStorage, triggerToast, fireConfetti }) {
  const recipeSubView = ref(safeStorage.get('detox_recipe_subview') || 'catalogo');
  const recipeSearch = ref('');
  const recipeFilterCategory = ref('todas');
  const activeRecipe = ref(null);
  const activeCookingRecipe = ref(null);
  const cookingStepIndex = ref(0);

  watch(recipeSubView, (val) => safeStorage.set('detox_recipe_subview', val));

  const filteredRecipes = computed(() => {
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
"""

# 4. Heladera JS Module
heladera_js = """// Módulo: Heladera Inteligente ("¿Qué cocino hoy con lo que tengo?")
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
"""

# 5. Batch & Remojos JS Module
batch_js = """// Módulo: Planificador Semanal & Batch Cooking
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
"""

remojos_js = """// Módulo: Gestor de Remojos y Tiempos Previos
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
"""

# Write JS files
os.makedirs(os.path.join(modules_dir, 'compras'), exist_ok=True)
os.makedirs(os.path.join(modules_dir, 'semaforo'), exist_ok=True)
os.makedirs(os.path.join(modules_dir, 'recetas'), exist_ok=True)
os.makedirs(os.path.join(modules_dir, 'heladera'), exist_ok=True)
os.makedirs(os.path.join(modules_dir, 'batch'), exist_ok=True)
os.makedirs(os.path.join(modules_dir, 'remojos'), exist_ok=True)

with open(os.path.join(modules_dir, 'compras', 'compras.js'), 'w', encoding='utf-8') as f:
    f.write(compras_js.strip() + '\n')
with open(os.path.join(modules_dir, 'semaforo', 'semaforo.js'), 'w', encoding='utf-8') as f:
    f.write(semaforo_js.strip() + '\n')
with open(os.path.join(modules_dir, 'recetas', 'recetas.js'), 'w', encoding='utf-8') as f:
    f.write(recetas_js.strip() + '\n')
with open(os.path.join(modules_dir, 'heladera', 'heladera.js'), 'w', encoding='utf-8') as f:
    f.write(heladera_js.strip() + '\n')
with open(os.path.join(modules_dir, 'batch', 'batch.js'), 'w', encoding='utf-8') as f:
    f.write(batch_js.strip() + '\n')
with open(os.path.join(modules_dir, 'remojos', 'remojos.js'), 'w', encoding='utf-8') as f:
    f.write(remojos_js.strip() + '\n')

print("Created JS module files successfully!")
