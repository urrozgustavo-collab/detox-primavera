// Módulo: Mi Día, Tracker 21 Días, Bitácora y Citas Clínicas
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
    let report = `🌿 INFORME CLÍNICO & REGISTRO PERSONAL — DETOX DE PRIMAVERA\n`;
    report += `Fecha de generación: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    report += `Día actual del reto: Día ${selectedDay.value} de 21\n`;
    report += `Inicio: ${challengeInfo.value.formattedStartDate || 'No fijada'}\n`;
    report += `Puntos acumulados: ${xp.value} XP | Racha: ${streakDays.value} días\n`;
    report += `--------------------------------------------------\n\n`;

    let entriesFound = false;
    for (let d = 1; d <= 21; d++) {
      const dayKey = `dia_${d}`;
      const j = dailyJournal.value[dayKey];
      const m = dailyMeals.value[dayKey];
      if (j || m) {
        entriesFound = true;
        report += `📅 DÍA ${d}:\n`;
        if (j) {
          if (j.energy) {
            const eObj = data.journalOptions?.energyLevels?.find(x => x.id === Number(j.energy));
            report += `  • Nivel de energía: ${eObj ? eObj.icon + ' ' + eObj.label : j.energy + '/5'}\n`;
          }
          if (j.digestion) {
            const dObj = data.journalOptions?.digestionStates?.find(x => x.id === j.digestion);
            report += `  • Digestión: ${dObj ? dObj.icon + ' ' + dObj.label : j.digestion}\n`;
          }
          if (j.symptoms && j.symptoms.length > 0) {
            report += `  • Síntomas / Señales: ${j.symptoms.join(', ')}\n`;
          }
          if (j.notes && j.notes.trim()) {
            report += `  • Sensaciones / Notas: "${j.notes.trim()}"\n`;
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
            report += `  • Comidas: ${mealParts.join(' | ')}\n`;
          }
        }
        report += `\n`;
      }
    }

    if (!entriesFound) {
      report += `(Todavía no hay entradas registradas en la bitácora o comidas. Completá tus primeras notas en la pestaña 'Mi Día' para verlas reflejadas acá.)\n`;
    }

    report += `--------------------------------------------------\n`;
    report += `Detox de Primavera • Guía de Isabel Caparra • WebApp v1.2.1\n`;
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
