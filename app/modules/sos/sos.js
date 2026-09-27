// Módulo: Botiquín SOS & Manejo de Crisis Depurativa
function useSosModule({ computed, data }) {
  const sosProtocols = computed(() => data.sosProtocols || []);
  return {
    sosProtocols
  };
}
