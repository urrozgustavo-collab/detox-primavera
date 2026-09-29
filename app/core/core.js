// Módulo Core: Almacenamiento Seguro, Tema, Sincronización Nube y Utilidades
const safeStorage = {
  get(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        const val = localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {}
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^|;\\s*)' + key + '=([^;]*)'));
      return match ? decodeURIComponent(match[2]) : null;
    }
    return null;
  },
  set(key, val) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val);
      }
    } catch (e) {}
    if (typeof document !== 'undefined') {
      try {
        document.cookie = `${key}=${encodeURIComponent(val)};max-age=31536000;path=/;SameSite=Lax`;
      } catch (e) {}
    }
  },
  remove(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (e) {}
    if (typeof document !== 'undefined') {
      try {
        document.cookie = `${key}=;max-age=0;path=/;SameSite=Lax`;
      } catch (e) {}
    }
  }
};

function useCoreModule({ ref, computed, watch, onMounted, data }) {
  // Estado de Tema y Navegación
  const getInitialDarkMode = () => {
    const saved = safeStorage.get('detox_dark_mode');
    if (saved !== null) return saved === 'true';
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  const isDarkMode = ref(getInitialDarkMode());
  const activeTab = ref(safeStorage.get('detox_active_tab') || 'dia');

  watch(activeTab, (val) => safeStorage.set('detox_active_tab', val));
  watch(isDarkMode, (val) => {
    safeStorage.set('detox_dark_mode', String(val));
    if (typeof document !== 'undefined') {
      if (val) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  });

  // Notificaciones Toast
  const toastMessage = ref('');
  const showToast = ref(false);
  const triggerToast = (msg) => {
    toastMessage.value = msg;
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 3500);
  };

  // Confetti
  const fireConfetti = () => {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Buscador Global Cmd+K
  const globalSearchOpen = ref(false);
  const globalSearchQuery = ref('');

  // Sincronización en la Nube
  const KV_BUCKET = 'EE7impjfrWvHaAhuDDuBvU';
  const KV_BASE_URL = `https://kvdb.io/${KV_BUCKET}/`;
  const PRODUCTION_URL = 'https://urrozgustavo-collab.github.io/detox-primavera/';

  let isDirectUrlPairing = false;

  const getInitialSyncKey = () => {
    let key = null;
    if (typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search || '');
      const urlKey = urlParams.get('sync');
      if (urlKey && urlKey.trim()) {
        key = urlKey.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
        isDirectUrlPairing = true;
      }
      if (!key && window.location.hash) {
        const hashMatch = window.location.hash.match(/sync=([A-Z0-9_-]+)/i);
        if (hashMatch && hashMatch[1]) {
          key = hashMatch[1].trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
          isDirectUrlPairing = true;
        }
      }
      if (!key) {
        key = safeStorage.get('detox_sync_key');
      }
      if (key) {
        safeStorage.set('detox_sync_key', key);
        try {
          const currentUrl = new URL(window.location.href);
          if (currentUrl.searchParams.get('sync') !== key) {
            currentUrl.searchParams.set('sync', key);
            window.history.replaceState({ path: currentUrl.href }, '', currentUrl.href);
          }
        } catch (e) {}
        return key;
      }
    }
    return safeStorage.get('detox_sync_key') || null;
  };

  const syncKey = ref(getInitialSyncKey());
  const syncStatus = ref(syncKey.value ? 'synced' : 'local');
  const lastSyncTime = ref(null);
  const showSyncModal = ref(false);
  const syncCodeInput = ref('');
  const syncErrorMsg = ref('');
  let syncDebounceTimer = null;
  let isPulling = false;
  let lastLocalMutationTime = 0;

  const recordMutation = () => {
    lastLocalMutationTime = Date.now();
  };

  // Sync Registry for Modules
  let getPayloadHandler = () => ({});
  let applyCloudDataHandler = () => {};

  const registerSyncHandlers = ({ getPayload, applyCloudData }) => {
    getPayloadHandler = getPayload;
    applyCloudDataHandler = applyCloudData;
  };

  const pushToCloud = (immediate = false) => {
    if (!syncKey.value) return;
    syncStatus.value = 'syncing';
    if (syncDebounceTimer) {
      clearTimeout(syncDebounceTimer);
      syncDebounceTimer = null;
    }

    const executePush = async () => {
      try {
        const payload = {
          version: 1,
          updatedAt: Date.now(),
          ...getPayloadHandler()
        };

        const res = await fetch(`${KV_BASE_URL}${syncKey.value}`, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          syncStatus.value = 'synced';
          lastSyncTime.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
          syncStatus.value = 'error';
        }
      } catch (err) {
        console.warn('Sync push error:', err);
        syncStatus.value = 'error';
      }
    };

    if (immediate) {
      return executePush();
    } else {
      if (isPulling) return;
      syncDebounceTimer = setTimeout(executePush, 700);
    }
  };

  const pullFromCloud = async (force = false) => {
    if (!syncKey.value) return;
    if (!force && (Date.now() - lastLocalMutationTime < 4000)) {
      return;
    }
    isPulling = true;
    try {
      syncStatus.value = 'syncing';
      const res = await fetch(`${KV_BASE_URL}${syncKey.value}?_t=${Date.now()}`);
      if (res.status === 404) {
        syncStatus.value = 'synced';
        isPulling = false;
        if (force) {
          pushToCloud(true);
        }
        return;
      }
      if (!res.ok) {
        syncStatus.value = 'error';
        isPulling = false;
        return;
      }
      const text = await res.text();
      if (!text || text.trim() === '') {
        isPulling = false;
        return;
      }
      const cloudData = JSON.parse(text);

      if (!force && cloudData.updatedAt && cloudData.updatedAt < lastLocalMutationTime) {
        isPulling = false;
        syncStatus.value = 'synced';
        return;
      }

      applyCloudDataHandler(cloudData, force);

      syncStatus.value = 'synced';
      lastSyncTime.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (err) {
      console.warn('Sync pull error:', err);
      syncStatus.value = 'error';
    } finally {
      setTimeout(() => { isPulling = false; }, 400);
    }
  };

  const generateNewSyncKey = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newKey = `GUS-${rand}`;
    pairWithKey(newKey, true);
  };

  const pairWithKey = async (key, isNew = false) => {
    if (!key || !key.trim()) return;
    const cleanKey = key.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    syncKey.value = cleanKey;
    safeStorage.set('detox_sync_key', cleanKey);
    syncCodeInput.value = '';
    syncErrorMsg.value = '';

    if (typeof window !== 'undefined') {
      try {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('sync', cleanKey);
        window.history.replaceState({ path: currentUrl.href }, '', currentUrl.href);
      } catch (e) {}
    }

    if (isNew) {
      pushToCloud();
      triggerToast(`☁️ ¡Código creado: ${cleanKey}! Sincronizado en la nube.`);
    } else {
      triggerToast(`🔄 Conectando con la nube...`);
      await pullFromCloud(true);
      triggerToast(`✅ ¡Dispositivo vinculado a ${cleanKey}!`);
    }
    showSyncModal.value = false;
  };

  const disconnectSync = () => {
    if (typeof window !== 'undefined' && window.confirm('¿Desvincular la sincronización en la nube? Este dispositivo volverá a funcionar en modo local independiente.')) {
      syncKey.value = null;
      safeStorage.remove('detox_sync_key');
      syncStatus.value = 'local';
      showSyncModal.value = false;
      try {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete('sync');
        window.history.replaceState({ path: currentUrl.href }, '', currentUrl.href);
      } catch (e) {}
      triggerToast('Dispositivo desvinculado de la nube.');
    }
  };

  const syncShareUrl = computed(() => {
    if (!syncKey.value) return '';
    if (typeof window === 'undefined' || !window.location) {
      return `${PRODUCTION_URL}?sync=${syncKey.value}`;
    }

    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const origin = window.location.origin;

    // Detectar si estamos en un entorno local (file://, localhost, 127.0.0.1, origin null)
    // En cualquiera de estos casos, un celular externo jamás podrá abrir la ruta local de la PC.
    // Apuntamos indefectiblemente a la PWA de producción en GitHub Pages:
    const isLocal = protocol === 'file:' ||
                    origin === 'null' ||
                    !hostname ||
                    hostname === 'localhost' ||
                    hostname === '127.0.0.1';

    if (isLocal) {
      return `${PRODUCTION_URL}?sync=${syncKey.value}`;
    }

    // Si estamos en un servidor web real, normalizar la ruta base (remover index.html si está presente)
    const base = `${origin}${window.location.pathname}`.replace(/\/index\.html$/i, '/');
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    return `${cleanBase}?sync=${syncKey.value}`;
  });

  const qrCodeUrl = computed(() => {
    if (!syncShareUrl.value) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(syncShareUrl.value)}`;
  });

  const copySyncLink = () => {
    if (!syncShareUrl.value) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(syncShareUrl.value).then(() => {
        triggerToast('📋 Enlace web de vinculación copiado.');
      });
    } else {
      triggerToast(`Enlace: ${syncShareUrl.value}`);
    }
  };

  const copySyncCode = () => {
    if (!syncKey.value) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(syncKey.value).then(() => {
        triggerToast(`📋 Código copiado: ${syncKey.value}`);
      });
    } else {
      triggerToast(`Código: ${syncKey.value}`);
    }
  };

  const shareViaWhatsApp = () => {
    if (!syncShareUrl.value) return;
    const text = `🌿 ¡Hola! Acá tenés el enlace para vincularte a mi seguimiento del Detox de Primavera (Código: ${syncKey.value}):\n${syncShareUrl.value}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  const shareNative = async () => {
    if (typeof navigator !== 'undefined' && navigator.share && syncShareUrl.value) {
      try {
        await navigator.share({
          title: 'Detox de Primavera — Sincronización',
          text: `Vinculate a mi seguimiento del Detox de Primavera con el código ${syncKey.value}`,
          url: syncShareUrl.value
        });
      } catch (e) {}
    } else {
      copySyncLink();
    }
  };

  watch(showSyncModal, (isOpen) => {
    if (isOpen && syncKey.value) {
      // Empuje preventivo de datos locales a la nube antes de escanear el QR
      pushToCloud(true);
    }
  });

  return {
    isDarkMode,
    activeTab,
    toastMessage,
    showToast,
    triggerToast,
    fireConfetti,
    globalSearchOpen,
    globalSearchQuery,
    isDirectUrlPairing,
    syncKey,
    syncStatus,
    lastSyncTime,
    showSyncModal,
    syncCodeInput,
    syncErrorMsg,
    syncShareUrl,
    qrCodeUrl,
    generateNewSyncKey,
    pairWithKey,
    disconnectSync,
    pullFromCloud,
    pushToCloud,
    copySyncLink,
    copySyncCode,
    shareViaWhatsApp,
    shareNative,
    recordMutation,
    registerSyncHandlers
  };
}
