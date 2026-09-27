// Módulo: Lista de Compras Interactiva
function useComprasModule({ ref, computed, watch, data, safeStorage, pushToCloud, triggerToast }) {
  const shoppingChecked = ref(JSON.parse(safeStorage.get('detox_shopping_checked') || '{}'));
  const shoppingFilterCategory = ref('todas');
  const shoppingOnlyPending = ref(false);

  watch(shoppingChecked, (val) => {
    safeStorage.set('detox_shopping_checked', JSON.stringify(val));
    pushToCloud();
  }, { deep: true });

  const filteredShopping = computed(() => {
    if (!data.shoppingList) return [];
    return data.shoppingList.filter((item) => {
      const matchCat = shoppingFilterCategory.value === 'todas' || item.cat === shoppingFilterCategory.value;
      const isChecked = !!shoppingChecked.value[item.id];
      const matchPending = !shoppingOnlyPending.value || !isChecked;
      return matchCat && matchPending;
    });
  });

  const shoppingStats = computed(() => {
    const list = data.shoppingList || [];
    const total = list.length;
    const completed = Object.values(shoppingChecked.value).filter(Boolean).length;
    const pending = Math.max(0, total - completed);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, percent };
  });

  const toggleShopping = (itemId) => {
    shoppingChecked.value = {
      ...shoppingChecked.value,
      [itemId]: !shoppingChecked.value[itemId]
    };
  };

  const copyShoppingList = async () => {
    const list = data.shoppingList || [];
    const pendingItems = list.filter(item => !shoppingChecked.value[item.id]);

    if (pendingItems.length === 0) {
      triggerToast("✅ ¡Ya compraste todo! No hay pendientes.");
      return;
    }

    const grouped = {};
    pendingItems.forEach(item => {
      if (!grouped[item.cat]) grouped[item.cat] = [];
      grouped[item.cat].push(`• ${item.item} (${item.cant})`);
    });

    let text = "🛒 *LISTA DE COMPRAS - DETOX DE PRIMAVERA*\n\n";
    for (const [cat, items] of Object.entries(grouped)) {
      text += `📍 *${cat.toUpperCase()}*\n${items.join('\n')}\n\n`;
    }
    text += "✨ Generado desde la WebApp del Detox de Primavera";

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        triggerToast("📋 ¡Copiado al portapapeles! Listo para pegar en WhatsApp.");
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch (err) {
      if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        triggerToast("📋 ¡Copiado al portapapeles!");
      }
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
