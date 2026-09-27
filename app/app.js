// Logica Reactiva de la WebApp - Detox de Primavera
// Powered by Vue 3 (CDN), LocalStorage y Canvas-Confetti

const { createApp, ref, computed, watch, onMounted } = Vue;

const app = createApp({
  setup() {
    // 1. Datos base
    const data = (typeof window !== 'undefined' && window.DETOX_DATA) ? window.DETOX_DATA : DETOX_DATA;

    // 2. Estado de Navegacion y Tema
    const getInitialDarkMode = () => {
      const saved = localStorage.getItem('detox_dark_mode');
      if (saved !== null) return saved === 'true';
      return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    };
    const isDarkMode = ref(getInitialDarkMode());
    const activeTab = ref(localStorage.getItem('detox_active_tab') || 'dia');

    // 3. Estado de Gamificacion y Seguimiento
    const selectedDay = ref(parseInt(localStorage.getItem('detox_selected_day') || '1', 10));
    const startMode = ref(localStorage.getItem('detox_start_mode') || 'monodieta3'); // monodieta3, monodieta2, monodieta1, directo
    const completedMissions = ref(JSON.parse(localStorage.getItem('detox_completed_missions') || '{}'));
    const shoppingChecked = ref(JSON.parse(localStorage.getItem('detox_shopping_checked') || '{}'));
    const unlockedBadges = ref(JSON.parse(localStorage.getItem('detox_unlocked_badges') || '[]'));
    const xp = ref(parseInt(localStorage.getItem('detox_xp') || '0', 10));

    // 4. Filtros de Recetas
    const recipeSearch = ref('');
    const recipeFilterCategory = ref('todas');
    const activeRecipe = ref(null);
    const activeCookingRecipe = ref(null);
    const cookingStepIndex = ref(0);

    // 5. Filtros de Compras
    const shoppingFilterCategory = ref('todas');
    const shoppingOnlyPending = ref(false);

    // 6. Semáforo de Alimentos
    const foodSearch = ref('');
    const foodStatusFilter = ref('todos');

    // 7. Buscador Global (Cmd+K)
    const globalSearchOpen = ref(false);
    const globalSearchQuery = ref('');

    // 8. Notificaciones Toast
    const toastMessage = ref('');
    const showToast = ref(false);

    // Persistencia reactiva a LocalStorage
    watch(activeTab, (val) => localStorage.setItem('detox_active_tab', val));
    watch(isDarkMode, (val) => {
      localStorage.setItem('detox_dark_mode', val);
      if (val) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
    watch(selectedDay, (val) => localStorage.setItem('detox_selected_day', val));
    watch(startMode, (val) => localStorage.setItem('detox_start_mode', val));
    watch(completedMissions, (val) => localStorage.setItem('detox_completed_missions', JSON.stringify(val)), { deep: true });
    watch(shoppingChecked, (val) => localStorage.setItem('detox_shopping_checked', JSON.stringify(val)), { deep: true });
    watch(unlockedBadges, (val) => localStorage.setItem('detox_unlocked_badges', JSON.stringify(val)), { deep: true });
    watch(xp, (val) => localStorage.setItem('detox_xp', val));

    // Funciones auxiliares
    const triggerToast = (msg) => {
      toastMessage.value = msg;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 3500);
    };

    const fireConfetti = () => {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    };

    // Computados de Gamificación
    const dayMissionsStatus = computed(() => {
      const dayKey = `day_${selectedDay.value}`;
      return completedMissions.value[dayKey] || {};
    });

    const currentDayCompletionPercent = computed(() => {
      const total = data.gamification.dailyMissions.length;
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
      const totalM = data.gamification.dailyMissions.length;
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
      const totalM = data.gamification.dailyMissions.length;
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

    // Misiones y Checkboxes
    const toggleMission = (missionId) => {
      const dayKey = `day_${selectedDay.value}`;
      if (!completedMissions.value[dayKey]) {
        completedMissions.value[dayKey] = {};
      }
      const current = !!completedMissions.value[dayKey][missionId];
      completedMissions.value[dayKey][missionId] = !current;

      if (!current) {
        xp.value += data.gamification.xpPerMission;
        triggerToast(`+${data.gamification.xpPerMission} XP ¡Hábito cumplido!`);
      } else {
        xp.value = Math.max(0, xp.value - data.gamification.xpPerMission);
      }

      // Chequeo si completó el día entero
      const totalM = data.gamification.dailyMissions.length;
      const done = Object.values(completedMissions.value[dayKey]).filter(Boolean).length;
      if (done === totalM && !current) {
        xp.value += data.gamification.xpPerDayComplete;
        fireConfetti();
        triggerToast(`🎉 ¡Día ${selectedDay.value} completado al 100%! (+${data.gamification.xpPerDayComplete} XP bonus)`);
      }

      checkBadges();
    };

    const isMissionDone = (missionId) => {
      const dayKey = `day_${selectedDay.value}`;
      return !!(completedMissions.value[dayKey] && completedMissions.value[dayKey][missionId]);
    };

    // Badges / Medallas
    const checkBadges = () => {
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

    // Computados de Recetas
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

    // Modo Cocina Pantalla Completa
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

    // Computados de Semáforo
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

    // Computados de Compras
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
      const completed = Object.values(shoppingChecked.value).filter(Boolean).length;
      const pending = Math.max(0, total - completed);
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { total, completed, pending, percent };
    });

    const toggleShopping = (itemId) => {
      shoppingChecked.value[itemId] = !shoppingChecked.value[itemId];
    };

    const copyShoppingList = async () => {
      const pendingItems = data.shoppingList.filter(item => !shoppingChecked.value[item.id]);

      if (pendingItems.length === 0) {
        triggerToast("✅ ¡Ya compraste todo! No hay pendientes.");
        return;
      }

      // Agrupar por categoría / comercio
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
        await navigator.clipboard.writeText(text);
        triggerToast("📋 ¡Copiado al portapapeles! Listo para pegar en WhatsApp.");
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        triggerToast("📋 ¡Copiado al portapapeles!");
      }
    };

    // Buscador Global (Cmd+K)
    const globalSearchResults = computed(() => {
      const q = globalSearchQuery.value.trim().toLowerCase();
      if (!q || q.length < 2) return [];

      const results = [];

      // Buscar en recetas
      data.recipes.forEach(r => {
        if (r.titulo.toLowerCase().includes(q) || r.ingredientes.some(i => i.toLowerCase().includes(q))) {
          results.push({
            tipo: "Receta",
            icono: "utensils",
            titulo: r.titulo,
            subtitulo: `${r.categoria} • ${r.tiempo}`,
            action: () => {
              activeTab.value = 'recetas';
              openRecipe(r);
              globalSearchOpen.value = false;
            }
          });
        }
      });

      // Buscar en semáforo
      data.foodTrafficLight.forEach(f => {
        if (f.nombre.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q)) {
          const badge = f.estado === 'green' ? '🟢 PERMITIDO' : f.estado === 'yellow' ? '🟡 MODERACIÓN' : '🔴 RESTRINGIDO';
          results.push({
            tipo: "Semáforo",
            icono: "shield",
            titulo: f.nombre,
            subtitulo: `${badge} • ${f.desc}`,
            action: () => {
              activeTab.value = 'semaforo';
              foodSearch.value = f.nombre;
              globalSearchOpen.value = false;
            }
          });
        }
      });

      // Buscar en SOS
      data.sosProtocols.forEach(s => {
        if (s.sintoma.toLowerCase().includes(q) || s.causa.toLowerCase().includes(q) || s.pasos.some(p => p.toLowerCase().includes(q))) {
          results.push({
            tipo: "Botiquín SOS",
            icono: "alert-triangle",
            titulo: s.sintoma,
            subtitulo: s.causa,
            action: () => {
              activeTab.value = 'sos';
              globalSearchOpen.value = false;
            }
          });
        }
      });

      // Buscar en compras
      data.shoppingList.forEach(s => {
        if (s.item.toLowerCase().includes(q)) {
          results.push({
            tipo: "Compras",
            icono: "shopping-bag",
            titulo: s.item,
            subtitulo: `${s.cat} • Cantidad: ${s.cant}`,
            action: () => {
              activeTab.value = 'compras';
              shoppingFilterCategory.value = s.cat;
              globalSearchOpen.value = false;
            }
          });
        }
      });

      return results.slice(0, 10);
    });

    const resetAllData = () => {
      if (confirm("¿Estás seguro de que querés reiniciar todo tu progreso, racha y listas de compras?")) {
        completedMissions.value = {};
        shoppingChecked.value = {};
        unlockedBadges.value = [];
        xp.value = 0;
        selectedDay.value = 1;
        localStorage.clear();
        triggerToast("🔄 Progreso reiniciado con éxito.");
      }
    };

    // Hotkey listener para Cmd+K / Ctrl+K
    onMounted(() => {
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
      }

      window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          globalSearchOpen.value = !globalSearchOpen.value;
        }
        if (e.key === 'Escape') {
          globalSearchOpen.value = false;
          activeRecipe.value = null;
        }
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }
    });

    watch([activeTab, activeRecipe, activeCookingRecipe, globalSearchOpen], () => {
      setTimeout(() => {
        if (window.lucide) window.lucide.createIcons();
      }, 50);
    });

    return {
      data,
      activeTab,
      isDarkMode,
      selectedDay,
      startMode,
      completedMissions,
      shoppingChecked,
      unlockedBadges,
      xp,
      recipeSearch,
      recipeFilterCategory,
      activeRecipe,
      activeCookingRecipe,
      cookingStepIndex,
      shoppingFilterCategory,
      shoppingOnlyPending,
      foodSearch,
      foodStatusFilter,
      globalSearchOpen,
      globalSearchQuery,
      toastMessage,
      showToast,
      // Computados
      dayMissionsStatus,
      currentDayCompletionPercent,
      isCurrentDayFullyCompleted,
      totalDaysCompleted,
      overallProgressPercent,
      streakDays,
      currentPhaseInfo,
      filteredRecipes,
      filteredFoods,
      filteredShopping,
      shoppingStats,
      globalSearchResults,
      // Metodos
      toggleMission,
      isMissionDone,
      isBadgeUnlocked,
      openRecipe,
      closeRecipe,
      startCooking,
      nextCookingStep,
      prevCookingStep,
      exitCooking,
      toggleShopping,
      copyShoppingList,
      resetAllData,
      triggerToast
    };
  }
});

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
