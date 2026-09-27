// Módulo: Herbolario & Hub del Taller Isa Caparra
function useHerbolarioModule({ computed, data }) {
  const workshopInfo = computed(() => data.info || {});
  return {
    workshopInfo
  };
}
