import os
import re

repo_dir = r'c:\Users\urroz\Proyectos\04_productividad_herramientas\salud-recetas\detox-primavera'
app_dir = os.path.join(repo_dir, 'app')
core_dir = os.path.join(app_dir, 'core')
modules_dir = os.path.join(app_dir, 'modules')

# 1. core.js
core_js = """// Módulo Core: Almacenamiento Seguro, Tema, Sincronización Nube y Utilidades
const safeStorage = {
  get(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        const val = localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {}
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^|;\\\\s*)' + key + '=([^;]*)'));
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

  const getInitialSyncKey = () => {
    let key = null;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlKey = urlParams.get('sync');
      if (urlKey && urlKey.trim()) {
        key = urlKey.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
      }
      if (!key && window.location.hash) {
        const hashMatch = window.location.hash.match(/sync=([A-Z0-9_-]+)/i);
        if (hashMatch && hashMatch[1]) {
          key = hashMatch[1].trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
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
    if (!syncKey.value || typeof window === 'undefined') return '';
    return `${window.location.origin}${window.location.pathname}?sync=${syncKey.value}`;
  });

  const qrCodeUrl = computed(() => {
    if (!syncShareUrl.value) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(syncShareUrl.value)}`;
  });

  const copySyncLink = () => {
    if (!syncShareUrl.value) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(syncShareUrl.value).then(() => {
        triggerToast('📋 Enlace de sincronización copiado.');
      });
    } else {
      triggerToast(`Enlace: ${syncShareUrl.value}`);
    }
  };

  return {
    isDarkMode,
    activeTab,
    toastMessage,
    showToast,
    triggerToast,
    fireConfetti,
    globalSearchOpen,
    globalSearchQuery,
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
    recordMutation,
    registerSyncHandlers
  };
}
"""

# 2. dia.js
dia_js = """// Módulo: Mi Día, Tracker 21 Días, Bitácora y Citas Clínicas
function useDiaModule({ ref, computed, watch, data, safeStorage, pushToCloud, triggerToast, fireConfetti, recordMutation }) {
  const isValidDateString = (str) => {
    if (!str || typeof str !== 'string') return false;
    const parts = str.split('-');
    if (parts.length !== 3) return false;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
    if (y < 2024 || y > 2035) return false;
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    return true;
  };

  const getInitialStartDate = () => {
    const saved = safeStorage.get('detox_start_date');
    return isValidDateString(saved) ? saved : null;
  };

  const selectedDay = ref(parseInt(safeStorage.get('detox_selected_day') || '1', 10));
  const startMode = ref(safeStorage.get('detox_start_mode') || 'monodieta3');
  const startDate = ref(getInitialStartDate());
  const tempStartDate = ref(startDate.value || '');
  const showDateSettings = ref(false);
  const completedMissions = ref(JSON.parse(safeStorage.get('detox_completed_missions') || '{}'));
  const unlockedBadges = ref(JSON.parse(safeStorage.get('detox_unlocked_badges') || '[]'));
  const xp = ref(parseInt(safeStorage.get('detox_xp') || '0', 10));

  // Bitácora y Comidas
  const dailyJournal = ref(JSON.parse(safeStorage.get('detox_daily_journal') || '{}'));
  const dailyMeals = ref(JSON.parse(safeStorage.get('detox_daily_meals') || '{}'));
  const journalView = ref('dia');
  const showExportModal = ref(false);

  // Watchers de persistencia y nube
  watch(selectedDay, (val) => {
    safeStorage.set('detox_selected_day', String(val));
    pushToCloud();
  });
  watch(startMode, (val) => {
    safeStorage.set('detox_start_mode', val);
    pushToCloud();
  });
  watch(startDate, (val) => {
    if (val) safeStorage.set('detox_start_date', val);
    else safeStorage.remove('detox_start_date');
    pushToCloud();
  });
  watch(completedMissions, (val) => {
    safeStorage.set('detox_completed_missions', JSON.stringify(val));
    pushToCloud();
  }, { deep: true });
  watch(unlockedBadges, (val) => {
    safeStorage.set('detox_unlocked_badges', JSON.stringify(val));
    pushToCloud();
  }, { deep: true });
  watch(xp, (val) => {
    safeStorage.set('detox_xp', String(val));
    pushToCloud();
  });
  watch(dailyJournal, (val) => {
    safeStorage.set('detox_daily_journal', JSON.stringify(val));
    pushToCloud();
  }, { deep: true });
  watch(dailyMeals, (val) => {
    safeStorage.set('detox_daily_meals', JSON.stringify(val));
    pushToCloud();
  }, { deep: true });

  const todayStr = computed(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const challengeInfo = computed(() => {
    if (!startDate.value || !isValidDateString(startDate.value)) {
      return { started: false, daysDiff: 0, currentDay: null, formattedStartDate: '' };
    }
    const parts = startDate.value.split('-').map(Number);
    const start = new Date(parts[0], parts[1] - 1, parts[2]);
    start.setHours(0, 0, 0, 0);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const diffMs = now.getTime() - start.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    const [y, m, d] = startDate.value.split('-');
    const formattedStartDate = `${d}/${m}/${y}`;

    if (diffDays < 0) {
      return {
        started: true,
        isFuture: true,
        isFinished: false,
        daysUntil: Math.abs(diffDays),
        currentDay: 0,
        daysPassed: diffDays,
        formattedStartDate
      };
    } else if (diffDays <= 20) {
      return {
        started: true,
        isFuture: false,
        isFinished: false,
        currentDay: diffDays + 1,
        daysPassed: diffDays,
        formattedStartDate
      };
    } else {
      return {
        started: true,
        isFuture: false,
        isFinished: true,
        currentDay: 21,
        daysPassed: diffDays,
        formattedStartDate
      };
    }
  });

  const toggleDatePicker = () => {
    showDateSettings.value = !showDateSettings.value;
    if (showDateSettings.value) {
      tempStartDate.value = startDate.value || todayStr.value;
    }
  };

  const setQuickDate = (type) => {
    const d = new Date();
    if (type === 'today') {
      // hoy
    } else if (type === 'tomorrow') {
      d.setDate(d.getDate() + 1);
    } else if (type === 'nextMonday') {
      const dayOfWeek = d.getDay();
      const daysUntilMonday = (8 - dayOfWeek) % 7 || 7;
      d.setDate(d.getDate() + daysUntilMonday);
    }
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    tempStartDate.value = `${y}-${m}-${day}`;
  };

  const applySelectedDate = async () => {
    if (!tempStartDate.value) {
      triggerToast('⚠️ Por favor seleccioná una fecha.');
      return;
    }
    if (!isValidDateString(tempStartDate.value)) {
      triggerToast('⚠️ Formato de fecha inválido.');
      return;
    }
    await setStartDate(tempStartDate.value);
  };

  const startChallengeToday = async () => {
    if (recordMutation) recordMutation();
    startDate.value = todayStr.value;
    selectedDay.value = 1;
    showDateSettings.value = false;
    safeStorage.set('detox_start_date', todayStr.value);
    safeStorage.set('detox_selected_day', '1');
    await pushToCloud(true);
    triggerToast('🚀 ¡Reto iniciado con éxito! Hoy es tu Día 1.');
    fireConfetti();
  };

  const setStartDate = async (dateString) => {
    if (!isValidDateString(dateString)) return;
    if (recordMutation) recordMutation();
    startDate.value = dateString;
    safeStorage.set('detox_start_date', dateString);
    
    const info = challengeInfo.value;
    if (info.isFuture) {
      selectedDay.value = 0;
      triggerToast(`📅 Inicio programado para el ${info.formattedStartDate} (en ${info.daysUntil} días).`);
    } else if (!info.isFinished) {
      selectedDay.value = info.currentDay;
      triggerToast(`📅 Fecha fijada: hoy es tu Día ${info.currentDay}.`);
    } else {
      selectedDay.value = 21;
      triggerToast(`📅 Fecha fijada: reto finalizado el ${info.formattedStartDate}.`);
    }
    showDateSettings.value = false;
    await pushToCloud(true);
  };

  const cancelChallengeStart = async () => {
    if (recordMutation) recordMutation();
    startDate.value = null;
    selectedDay.value = 1;
    showDateSettings.value = false;
    safeStorage.remove('detox_start_date');
    safeStorage.set('detox_selected_day', '1');
    await pushToCloud(true);
    triggerToast('↩️ Inicio cancelado. Volviste a foja cero para elegir cuándo arrancar.');
  };

  const resetStartDate = cancelChallengeStart;

  const resetChallenge = async (resetAll = false) => {
    const msg = resetAll 
      ? '¿Reiniciar TODO el reto a foja cero? Se borrará la fecha de inicio, los hábitos/misiones completadas y la lista de compras tachada.'
      : '¿Reiniciar la fecha del reto y volver a foja cero? Podrás elegir cuándo empezar de nuevo manteniendo tus hábitos guardados.';
    
    if (window.confirm(msg)) {
      if (recordMutation) recordMutation();
      startDate.value = null;
      selectedDay.value = 1;
      showDateSettings.value = false;
      safeStorage.remove('detox_start_date');
      safeStorage.set('detox_selected_day', '1');
      
      if (resetAll) {
        completedMissions.value = {};
        xp.value = 0;
        unlockedBadges.value = [];
        safeStorage.remove('detox_completed_missions');
        safeStorage.remove('detox_streak');
        safeStorage.remove('detox_xp');
        safeStorage.remove('detox_unlocked_badges');
        await pushToCloud(true);
        triggerToast('🔄 Reto reiniciado por completo a foja cero.');
      } else {
        await pushToCloud(true);
        triggerToast('🔄 Fecha reiniciada. Ya podés elegir una nueva fecha de arranque.');
      }
    }
  };

  const currentDailyQuote = computed(() => {
    if (!data.dailyQuotes) return null;
    const day = selectedDay.value !== undefined ? selectedDay.value : 1;
    return data.dailyQuotes.find(q => q.dia === day) || data.dailyQuotes[0];
  });

  const copyQuote = (q) => {
    if (!q) return;
    const text = `“${q.frase}” — ${q.autor} (${q.tema})`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => triggerToast('📋 Frase copiada al portapapeles.'));
    } else {
      triggerToast('📋 ' + text);
    }
  };

  const currentDayJournal = computed(() => {
    const dayKey = `dia_${selectedDay.value}`;
    return dailyJournal.value[dayKey] || { energy: null, digestion: null, symptoms: [], notes: '' };
  });

  const updateCurrentJournal = (patch) => {
    const dayKey = `dia_${selectedDay.value}`;
    const current = dailyJournal.value[dayKey] || { energy: null, digestion: null, symptoms: [], notes: '' };
    dailyJournal.value = {
      ...dailyJournal.value,
      [dayKey]: { ...current, ...patch, updatedAt: Date.now() }
    };
    safeStorage.set('detox_daily_journal', JSON.stringify(dailyJournal.value));
    pushToCloud();
  };

  const toggleJournalSymptom = (sym) => {
    const current = currentDayJournal.value.symptoms || [];
    let next = [];
    if (sym === 'Despejado / Cero síntomas') {
      next = current.includes(sym) ? [] : [sym];
    } else {
      next = current.filter(s => s !== 'Despejado / Cero síntomas');
      if (next.includes(sym)) {
        next = next.filter(s => s !== sym);
      } else {
        next.push(sym);
      }
    }
    updateCurrentJournal({ symptoms: next });
  };

  const currentDayMeals = computed(() => {
    const dayKey = `dia_${selectedDay.value}`;
    return dailyMeals.value[dayKey] || {
      desayuno: { text: '', done: false },
      almuerzo: { text: '', done: false },
      merienda: { text: '', done: false },
      cena: { text: '', done: false }
    };
  });

  const updateMealSlot = (slotId, patch) => {
    const dayKey = `dia_${selectedDay.value}`;
    const currentDay = dailyMeals.value[dayKey] || {};
    const currentSlot = currentDay[slotId] || { text: '', done: false };
    dailyMeals.value = {
      ...dailyMeals.value,
      [dayKey]: {
        ...currentDay,
        [slotId]: { ...currentSlot, ...patch }
      }
    };
    safeStorage.set('detox_daily_meals', JSON.stringify(dailyMeals.value));
    pushToCloud();
  };

  const getMealSuggestions = (slotId) => {
    if (!data.recipes) return [];
    if (selectedDay.value <= 3 && startMode.value === 'monodieta3') {
      return data.recipes.filter(r => r.id === 'r1' || r.id === 'r2' || r.id === 'r5');
    }
    if (slotId === 'desayuno') {
      return data.recipes.filter(r => r.categoria === 'Desayunos' || r.id === 'r1' || r.id === 'r4').slice(0, 3);
    }
    if (slotId === 'almuerzo') {
      return data.recipes.filter(r => r.categoria === 'Almuerzos y Cenas').slice(0, 3);
    }
    if (slotId === 'merienda') {
      return data.recipes.filter(r => r.categoria === 'Desayunos' || r.categoria === 'Dips y Aderezos').slice(0, 3);
    }
    if (slotId === 'cena') {
      return data.recipes.filter(r => r.categoria === 'Caldos y Sopas' || r.categoria === 'Almuerzos y Cenas').slice(2, 5);
    }
    return data.recipes.slice(0, 3);
  };

  const currentWeekDays = computed(() => {
    const currentDay = selectedDay.value || 1;
    let startDay = 1;
    if (currentDay <= 7) startDay = 1;
    else if (currentDay <= 14) startDay = 8;
    else startDay = 15;

    const days = [];
    for (let i = startDay; i < startDay + 7 && i <= 21; i++) {
      const dayKey = `dia_${i}`;
      const journal = dailyJournal.value[dayKey] || null;
      const meals = dailyMeals.value[dayKey] || null;
      days.push({ day: i, journal, meals });
    }
    return days;
  });

  const dayMissionsStatus = computed(() => {
    const dayKey = `day_${selectedDay.value}`;
    return completedMissions.value[dayKey] || {};
  });

  const currentDayCompletionPercent = computed(() => {
    const total = data.gamification?.dailyMissions?.length || 0;
    if (total === 0) return 0;
    const status = dayMissionsStatus.value;
    const done = Object.values(status).filter(Boolean).length;
    return Math.round((done / total) * 100);
  });

  const isCurrentDayFullyCompleted = computed(() => {
    return currentDayCompletionPercent.value === 100;
  });

  const totalDaysCompleted = computed(() => {
    let count = 0;
    const totalM = data.gamification?.dailyMissions?.length || 0;
    for (let d = 1; d <= 21; d++) {
      const dayKey = `day_${d}`;
      const status = completedMissions.value[dayKey] || {};
      const done = Object.values(status).filter(Boolean).length;
      if (done === totalM) count++;
    }
    return count;
  });

  const overallProgressPercent = computed(() => {
    return Math.round((totalDaysCompleted.value / 21) * 100);
  });

  const streakDays = computed(() => {
    let streak = 0;
    const totalM = data.gamification?.dailyMissions?.length || 0;
    for (let d = selectedDay.value; d >= 1; d--) {
      const dayKey = `day_${d}`;
      const status = completedMissions.value[dayKey] || {};
      const done = Object.values(status).filter(Boolean).length;
      if (done === totalM) {
        streak++;
      } else if (d !== selectedDay.value) {
        break;
      }
    }
    return streak;
  });

  const currentPhaseInfo = computed(() => {
    const d = selectedDay.value;
    let monodietDays = 3;
    if (startMode.value === 'monodieta2') monodietDays = 2;
    if (startMode.value === 'monodieta1') monodietDays = 1;
    if (startMode.value === 'directo') monodietDays = 0;

    if (d === 0) {
      return {
        fase: "Fase 0: Preparación previa",
        desc: "Baja gradual de cafeína/mateína a la mitad cada 2 días para amortiguar la abstinencia.",
        color: "amber",
        tipo: "preparacion"
      };
    } else if (d <= monodietDays) {
      return {
        fase: `Fase 1: Monodieta Purificadora (Día ${d} de ${monodietDays})`,
        desc: "Alimentación basada exclusivamente en manzana (cruda, compota o nituke) y arroz integral caliente con agua tibia y sal marina.",
        color: "emerald",
        tipo: "monodieta"
      };
    } else {
      return {
        fase: `Fase 2: Menú Depurativo General (Día ${d} de 21)`,
        desc: "Abundancia de crucíferas, verduras verdes, arroz yamaní, porotos mung, quinoa, fermentos y caldos calientes.",
        color: "teal",
        tipo: "general"
      };
    }
  });

  const toggleMission = (missionId) => {
    const dayKey = `day_${selectedDay.value}`;
    if (!completedMissions.value[dayKey]) {
      completedMissions.value[dayKey] = {};
    }
    const current = !!completedMissions.value[dayKey][missionId];
    completedMissions.value[dayKey][missionId] = !current;

    const xpPerMission = data.gamification?.xpPerMission || 10;
    const xpPerDayComplete = data.gamification?.xpPerDayComplete || 50;

    if (!current) {
      xp.value += xpPerMission;
      triggerToast(`+${xpPerMission} XP ¡Hábito cumplido!`);
    } else {
      xp.value = Math.max(0, xp.value - xpPerMission);
    }

    const totalM = data.gamification?.dailyMissions?.length || 0;
    const done = Object.values(completedMissions.value[dayKey]).filter(Boolean).length;
    if (done === totalM && !current) {
      xp.value += xpPerDayComplete;
      fireConfetti();
      triggerToast(`🎉 ¡Día ${selectedDay.value} completado al 100%! (+${xpPerDayComplete} XP bonus)`);
    }

    checkBadges();
  };

  const isMissionDone = (missionId) => {
    const dayKey = `day_${selectedDay.value}`;
    return !!(completedMissions.value[dayKey] && completedMissions.value[dayKey][missionId]);
  };

  const checkBadges = () => {
    if (!data.gamification?.badges) return;
    data.gamification.badges.forEach((b) => {
      if (!unlockedBadges.value.includes(b.id)) {
        let unlocked = false;
        if (b.id === 'inicio' && totalDaysCompleted.value >= 1) unlocked = true;
        if (b.id === 'monodieta' && selectedDay.value > 3 && totalDaysCompleted.value >= 3) unlocked = true;
        if (b.id === 'adios_cafeina' && streakDays.value >= 3) unlocked = true;
        if (b.id === 'semana1' && totalDaysCompleted.value >= 7) unlocked = true;
        if (b.id === 'maestro_nituke' && totalDaysCompleted.value >= 14) unlocked = true;
        if (b.id === 'detox_champion' && totalDaysCompleted.value >= 21) unlocked = true;

        if (unlocked) {
          unlockedBadges.value.push(b.id);
          xp.value += b.xp;
          fireConfetti();
          triggerToast(`🏆 ¡MEDALLA DESBLOQUEADA!: ${b.title} (+${b.xp} XP)`);
        }
      }
    });
  };

  const isBadgeUnlocked = (badgeId) => {
    return unlockedBadges.value.includes(badgeId);
  };

  const generateReportText = () => {
    let report = `🌿 INFORME CLÍNICO & REGISTRO PERSONAL — DETOX DE PRIMAVERA\\n`;
    report += `Fecha de generación: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\\n`;
    report += `Día actual del reto: Día ${selectedDay.value} de 21\\n`;
    report += `Inicio: ${challengeInfo.value.formattedStartDate || 'No fijada'}\\n`;
    report += `Puntos acumulados: ${xp.value} XP | Racha: ${streakDays.value} días\\n`;
    report += `--------------------------------------------------\\n\\n`;

    let entriesFound = false;
    for (let d = 1; d <= 21; d++) {
      const dayKey = `dia_${d}`;
      const j = dailyJournal.value[dayKey];
      const m = dailyMeals.value[dayKey];
      if (j || m) {
        entriesFound = true;
        report += `📅 DÍA ${d}:\\n`;
        if (j) {
          if (j.energy) {
            const eObj = data.journalOptions?.energyLevels?.find(x => x.id === Number(j.energy));
            report += `  • Nivel de energía: ${eObj ? eObj.icon + ' ' + eObj.label : j.energy + '/5'}\\n`;
          }
          if (j.digestion) {
            const dObj = data.journalOptions?.digestionStates?.find(x => x.id === j.digestion);
            report += `  • Digestión: ${dObj ? dObj.icon + ' ' + dObj.label : j.digestion}\\n`;
          }
          if (j.symptoms && j.symptoms.length > 0) {
            report += `  • Síntomas / Señales: ${j.symptoms.join(', ')}\\n`;
          }
          if (j.notes && j.notes.trim()) {
            report += `  • Sensaciones / Notas: "${j.notes.trim()}"\\n`;
          }
        }
        if (m) {
          const mealParts = [];
          ['desayuno', 'almuerzo', 'merienda', 'cena'].forEach(slot => {
            if (m[slot] && m[slot].text) {
              mealParts.push(`${slot.toUpperCase()}: ${m[slot].text} ${m[slot].done ? '(✓)' : ''}`);
            }
          });
          if (mealParts.length > 0) {
            report += `  • Comidas: ${mealParts.join(' | ')}\\n`;
          }
        }
        report += `\\n`;
      }
    }

    if (!entriesFound) {
      report += `(Todavía no hay entradas registradas en la bitácora o comidas. Completá tus primeras notas en la pestaña 'Mi Día' para verlas reflejadas acá.)\\n`;
    }

    report += `--------------------------------------------------\\n`;
    report += `Detox de Primavera • Guía de Isabel Caparra • WebApp v1.2.1\\n`;
    return report;
  };

  const copyJournalReport = () => {
    const text = generateReportText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        triggerToast('📋 ¡Informe copiado al portapapeles! Listo para pegar en WhatsApp o Docs.');
      });
    } else {
      triggerToast('📋 Informe generado.');
    }
  };

  const printJournalReport = () => {
    window.print();
  };

  return {
    isValidDateString,
    selectedDay,
    startMode,
    startDate,
    tempStartDate,
    showDateSettings,
    completedMissions,
    unlockedBadges,
    xp,
    dailyJournal,
    dailyMeals,
    journalView,
    showExportModal,
    todayStr,
    challengeInfo,
    toggleDatePicker,
    setQuickDate,
    applySelectedDate,
    startChallengeToday,
    setStartDate,
    cancelChallengeStart,
    resetStartDate,
    resetChallenge,
    currentDailyQuote,
    copyQuote,
    currentDayJournal,
    updateCurrentJournal,
    toggleJournalSymptom,
    currentDayMeals,
    updateMealSlot,
    getMealSuggestions,
    currentWeekDays,
    dayMissionsStatus,
    currentDayCompletionPercent,
    isCurrentDayFullyCompleted,
    totalDaysCompleted,
    overallProgressPercent,
    streakDays,
    currentPhaseInfo,
    toggleMission,
    isMissionDone,
    checkBadges,
    isBadgeUnlocked,
    generateReportText,
    copyJournalReport,
    printJournalReport
  };
}
"""

# 3. compras.js (bulletproof copyShoppingList)
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

    let text = "🛒 *LISTA DE COMPRAS - DETOX DE PRIMAVERA*\\n\\n";
    for (const [cat, items] of Object.entries(grouped)) {
      text += `📍 *${cat.toUpperCase()}*\\n${items.join('\\n')}\\n\\n`;
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
"""

# 4. semaforo.js
semaforo_js = """// Módulo: Semáforo Nutricional ("¿Puedo comer esto?")
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
"""

# 5. recetas.js
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
"""

# 6. heladera.js
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

# 7. batch.js
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

# 8. remojos.js
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

# 9. sos.js
sos_js = """// Módulo: Botiquín SOS & Manejo de Crisis Depurativa
function useSosModule({ computed, data }) {
  const sosProtocols = computed(() => data.sosProtocols || []);
  return {
    sosProtocols
  };
}
"""

# 10. herbolario.js
herbolario_js = """// Módulo: Herbolario & Hub del Taller Isa Caparra
function useHerbolarioModule({ computed, data }) {
  const workshopInfo = computed(() => data.info || {});
  return {
    workshopInfo
  };
}
"""

# 11. app.js (integrator)
app_js = """// Detox de Primavera — App Core Assembly
// Vue 3 Root Component & Module Integrator

const { createApp, ref, computed, watch, onMounted } = Vue;

const app = createApp({
  setup() {
    const data = (typeof window !== 'undefined' && window.DETOX_DATA) ? window.DETOX_DATA : (typeof DETOX_DATA !== 'undefined' ? DETOX_DATA : {});

    // 1. Core Shell Module
    const core = useCoreModule({ ref, computed, watch, onMounted, data });

    // 2. Feature Modules
    const dia = useDiaModule({
      ref, computed, watch, data, safeStorage,
      pushToCloud: core.pushToCloud,
      triggerToast: core.triggerToast,
      fireConfetti: core.fireConfetti,
      recordMutation: core.recordMutation
    });

    const recetas = useRecetasModule({
      ref, computed, watch, data, safeStorage,
      triggerToast: core.triggerToast,
      fireConfetti: core.fireConfetti
    });

    const heladera = useHeladeraModule({
      ref, computed, watch, safeStorage,
      pushToCloud: core.pushToCloud,
      triggerToast: core.triggerToast,
      data
    });

    const batch = useBatchModule({
      ref, computed, watch, safeStorage,
      pushToCloud: core.pushToCloud,
      triggerToast: core.triggerToast
    });

    const remojos = useRemojosModule({
      computed,
      plannedRecipeIds: batch.plannedRecipeIds
    });

    const compras = useComprasModule({
      ref, computed, watch, data, safeStorage,
      pushToCloud: core.pushToCloud,
      triggerToast: core.triggerToast
    });

    const semaforo = useSemaforoModule({
      ref, computed, data
    });

    const sos = useSosModule({
      computed, data
    });

    const herbolario = useHerbolarioModule({
      computed, data
    });

    // Cloud Sync Handlers Binding
    core.registerSyncHandlers({
      getPayload: () => ({
        startDate: dia.startDate.value,
        selectedDay: dia.selectedDay.value,
        startMode: dia.startMode.value,
        completedMissions: dia.completedMissions.value,
        shoppingChecked: compras.shoppingChecked.value,
        dailyJournal: dia.dailyJournal.value,
        dailyMeals: dia.dailyMeals.value,
        fridgeSelected: heladera.fridgeSelected.value,
        weeklyPlan: batch.weeklyPlan.value,
        streakDays: dia.streakDays.value,
        xp: dia.xp.value,
        unlockedBadges: dia.unlockedBadges.value
      }),
      applyCloudData: (cloudData, force) => {
        if (cloudData.startDate !== undefined) {
          if (cloudData.startDate === null) dia.startDate.value = null;
          else if (dia.isValidDateString ? dia.isValidDateString(cloudData.startDate) : true) dia.startDate.value = cloudData.startDate;
          else dia.startDate.value = null;
        }
        if (cloudData.selectedDay !== undefined && (!dia.startDate.value || force)) dia.selectedDay.value = cloudData.selectedDay;
        if (cloudData.startMode !== undefined) dia.startMode.value = cloudData.startMode;
        if (cloudData.completedMissions !== undefined) dia.completedMissions.value = cloudData.completedMissions;
        if (cloudData.shoppingChecked !== undefined) compras.shoppingChecked.value = cloudData.shoppingChecked;
        if (cloudData.dailyJournal !== undefined) dia.dailyJournal.value = cloudData.dailyJournal;
        if (cloudData.dailyMeals !== undefined) dia.dailyMeals.value = cloudData.dailyMeals;
        if (cloudData.fridgeSelected !== undefined) heladera.fridgeSelected.value = cloudData.fridgeSelected;
        if (cloudData.weeklyPlan !== undefined) batch.weeklyPlan.value = cloudData.weeklyPlan;
        if (cloudData.unlockedBadges !== undefined) dia.unlockedBadges.value = cloudData.unlockedBadges;
        if (cloudData.xp !== undefined) dia.xp.value = cloudData.xp;

        // Persist local safe copies
        if (dia.startDate.value) safeStorage.set('detox_start_date', dia.startDate.value);
        else safeStorage.remove('detox_start_date');
        safeStorage.set('detox_completed_missions', JSON.stringify(dia.completedMissions.value));
        safeStorage.set('detox_shopping_checked', JSON.stringify(compras.shoppingChecked.value));
        safeStorage.set('detox_daily_journal', JSON.stringify(dia.dailyJournal.value));
        safeStorage.set('detox_daily_meals', JSON.stringify(dia.dailyMeals.value));
        safeStorage.set('detox_fridge_selected', JSON.stringify(heladera.fridgeSelected.value));
        safeStorage.set('detox_weekly_plan', JSON.stringify(batch.weeklyPlan.value));
        safeStorage.set('detox_unlocked_badges', JSON.stringify(dia.unlockedBadges.value));
        safeStorage.set('detox_xp', String(dia.xp.value));
      }
    });

    // Global Search Cmd+K Results
    const globalSearchResults = computed(() => {
      const q = core.globalSearchQuery.value.trim().toLowerCase();
      if (!q || q.length < 2) return [];
      const results = [];

      data.recipes?.forEach(r => {
        if (r.titulo.toLowerCase().includes(q) || r.ingredientes.some(i => i.toLowerCase().includes(q))) {
          results.push({
            tipo: "Receta",
            icono: "utensils",
            titulo: r.titulo,
            subtitulo: `${r.categoria} • ${r.tiempo}`,
            action: () => {
              core.activeTab.value = 'recetas';
              recetas.openRecipe(r);
              core.globalSearchOpen.value = false;
            }
          });
        }
      });

      data.foodTrafficLight?.forEach(f => {
        if (f.nombre.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q)) {
          const badge = f.estado === 'green' ? '🟢 PERMITIDO' : f.estado === 'yellow' ? '🟡 MODERACIÓN' : '🔴 RESTRINGIDO';
          results.push({
            tipo: "Semáforo",
            icono: "shield",
            titulo: f.nombre,
            subtitulo: `${badge} • ${f.desc}`,
            action: () => {
              core.activeTab.value = 'semaforo';
              semaforo.foodSearch.value = f.nombre;
              core.globalSearchOpen.value = false;
            }
          });
        }
      });

      data.sosProtocols?.forEach(s => {
        if (s.sintoma.toLowerCase().includes(q) || s.causa.toLowerCase().includes(q) || s.pasos.some(p => p.toLowerCase().includes(q))) {
          results.push({
            tipo: "Botiquín SOS",
            icono: "alert-triangle",
            titulo: s.sintoma,
            subtitulo: s.causa,
            action: () => {
              core.activeTab.value = 'sos';
              core.globalSearchOpen.value = false;
            }
          });
        }
      });

      data.shoppingList?.forEach(s => {
        if (s.item.toLowerCase().includes(q)) {
          results.push({
            tipo: "Compras",
            icono: "shopping-bag",
            titulo: s.item,
            subtitulo: `${s.cat} • Cantidad: ${s.cant}`,
            action: () => {
              core.activeTab.value = 'compras';
              compras.shoppingFilterCategory.value = s.cat;
              core.globalSearchOpen.value = false;
            }
          });
        }
      });

      return results.slice(0, 10);
    });

    const resetAllData = async () => {
      if (confirm("¿Estás seguro de que querés reiniciar todo tu progreso, racha y listas de compras?")) {
        core.recordMutation();
        dia.completedMissions.value = {};
        compras.shoppingChecked.value = {};
        dia.unlockedBadges.value = [];
        dia.dailyJournal.value = {};
        dia.dailyMeals.value = {};
        heladera.fridgeSelected.value = [];
        batch.weeklyPlan.value = {};
        dia.xp.value = 0;
        dia.selectedDay.value = 1;
        dia.startDate.value = null;
        [
          'detox_completed_missions',
          'detox_shopping_checked',
          'detox_unlocked_badges',
          'detox_daily_journal',
          'detox_daily_meals',
          'detox_fridge_selected',
          'detox_weekly_plan',
          'detox_xp',
          'detox_selected_day',
          'detox_start_date',
          'detox_start_mode'
        ].forEach(k => safeStorage.remove(k));
        await core.pushToCloud(true);
        core.triggerToast("🔄 Progreso reiniciado con éxito.");
      }
    };

    onMounted(async () => {
      if (core.syncKey.value) {
        await core.pullFromCloud();
      }

      if (dia.startDate.value && dia.challengeInfo.value.started) {
        if (!dia.challengeInfo.value.isFuture && !dia.challengeInfo.value.isFinished) {
          dia.selectedDay.value = dia.challengeInfo.value.currentDay;
        } else if (dia.challengeInfo.value.isFuture) {
          dia.selectedDay.value = 0;
        }
      }

      if (typeof window !== 'undefined') {
        window.addEventListener('focus', () => {
          if (core.syncKey.value) core.pullFromCloud();
        });
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible' && core.syncKey.value) {
            core.pullFromCloud();
          }
        });
        setInterval(() => {
          if (document.visibilityState === 'visible' && core.syncKey.value) {
            core.pullFromCloud();
          }
        }, 45000);

        window.addEventListener('keydown', (e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            core.globalSearchOpen.value = !core.globalSearchOpen.value;
          }
          if (e.key === 'Escape') {
            core.globalSearchOpen.value = false;
            recetas.activeRecipe.value = null;
          }
        });

        if (window.lucide) {
          window.lucide.createIcons();
        }
      }
    });

    watch([core.activeTab, recetas.activeRecipe, recetas.activeCookingRecipe, core.globalSearchOpen], () => {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.lucide) window.lucide.createIcons();
      }, 50);
    });

    return {
      data,
      globalSearchResults,
      resetAllData,
      ...core,
      ...dia,
      ...recetas,
      ...heladera,
      ...batch,
      ...remojos,
      ...compras,
      ...semaforo,
      ...sos,
      ...herbolario
    };
  }
});

if (typeof window !== 'undefined') {
  window.__VUE_LOGS__ = [];
  app.config.warnHandler = (msg, vm, trace) => {
    window.__VUE_LOGS__.push({ type: 'warn', msg, trace });
    console.warn('VUE WARN:', msg, trace);
  };
  app.config.errorHandler = (err, vm, info) => {
    window.__VUE_LOGS__.push({ type: 'error', msg: err.message, stack: err.stack, info });
    console.error('VUE ERROR:', err, info);
  };

  try {
    app.mount('#app');
  } catch (e) {
    window.__VUE_LOGS__.push({ type: 'mount_error', msg: e.message, stack: e.stack });
    console.error('MOUNT CATCH:', e);
  }
}
"""

# Write all JS files
with open(os.path.join(core_dir, 'core.js'), 'w', encoding='utf-8') as f:
    f.write(core_js.strip() + '\n')
with open(os.path.join(modules_dir, 'dia', 'dia.js'), 'w', encoding='utf-8') as f:
    f.write(dia_js.strip() + '\n')
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
with open(os.path.join(modules_dir, 'sos', 'sos.js'), 'w', encoding='utf-8') as f:
    f.write(sos_js.strip() + '\n')
with open(os.path.join(modules_dir, 'herbolario', 'herbolario.js'), 'w', encoding='utf-8') as f:
    f.write(herbolario_js.strip() + '\n')
with open(os.path.join(app_dir, 'app.js'), 'w', encoding='utf-8') as f:
    f.write(app_js.strip() + '\n')

# Clean duplicate comment in recetas.html
recetas_html_path = os.path.join(modules_dir, 'recetas', 'recetas.html')
with open(recetas_html_path, 'r', encoding='utf-8') as f:
    rec_c = f.read()
if rec_c.startswith("<!-- Segmented Switcher de Cocina Inteligente -->\n<!-- Segmented Switcher de Cocina Inteligente -->"):
    rec_c = rec_c.replace("<!-- Segmented Switcher de Cocina Inteligente -->\n<!-- Segmented Switcher de Cocina Inteligente -->", "<!-- Segmented Switcher de Cocina Inteligente -->", 1)
    with open(recetas_html_path, 'w', encoding='utf-8') as f:
        f.write(rec_c)

print("All JS modules written successfully!")
