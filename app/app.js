// Detox de Primavera — App Core Assembly
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
        userAllergies: dia.userAllergies.value,
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
        if (cloudData.userAllergies !== undefined) dia.userAllergies.value = cloudData.userAllergies;
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
        safeStorage.set('detox_user_allergies', JSON.stringify(dia.userAllergies.value));
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
        dia.userAllergies.value = [];
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
          'detox_user_allergies',
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
        if (core.isDirectUrlPairing) {
          await core.pullFromCloud(true);
          core.triggerToast(`📱 ¡Dispositivo vinculado con éxito a ${core.syncKey.value}!`);
          core.fireConfetti();
        } else {
          await core.pullFromCloud();
        }
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
