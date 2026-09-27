// Módulo: Semáforo Nutricional ("¿Puedo comer esto?")
function useSemaforoModule({ ref, computed, data }) {
  const foodSearch = ref('');
  const foodStatusFilter = ref('todos');

  const filteredFoods = computed(() => {
    if (!data.foodTrafficLight) return [];
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
