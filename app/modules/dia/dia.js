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

  const normalizeText = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  const selectedDay = ref(parseInt(safeStorage.get('detox_selected_day') || '1', 10));
  const startMode = ref(safeStorage.get('detox_start_mode') || 'monodieta3');
  const startDate = ref(getInitialStartDate());
  const tempStartDate = ref(startDate.value || '');
  const showDateSettings = ref(false);
  const completedMissions = ref(JSON.parse(safeStorage.get('detox_completed_missions') || '{}'));
  const unlockedBadges = ref(JSON.parse(safeStorage.get('detox_unlocked_badges') || '[]'));
  const xp = ref(parseInt(safeStorage.get('detox_xp') || '0', 10));

  // Bitácora, Comidas e Ingestas
  const dailyJournal = ref(JSON.parse(safeStorage.get('detox_daily_journal') || '{}'));
  const dailyMeals = ref(JSON.parse(safeStorage.get('detox_daily_meals') || '{}'));
  const journalView = ref('dia');
  const showExportModal = ref(false);

  // Perfil de Alergias e Intolerancias
  const userAllergies = ref(JSON.parse(safeStorage.get('detox_user_allergies') || '[]'));
  const showAllergySelector = ref(false);
  const customAllergyInput = ref('');

  // Buscador reactivo por slot de comida
  const mealSearchQueries = ref({
    desayuno: '',
    almuerzo: '',
    merienda: '',
    cena: ''
  });

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
  watch(userAllergies, (val) => {
    safeStorage.set('detox_user_allergies', JSON.stringify(val));
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
        dailyJournal.value = {};
        dailyMeals.value = {};
        userAllergies.value = [];
        safeStorage.remove('detox_completed_missions');
        safeStorage.remove('detox_streak');
        safeStorage.remove('detox_xp');
        safeStorage.remove('detox_unlocked_badges');
        safeStorage.remove('detox_daily_journal');
        safeStorage.remove('detox_daily_meals');
        safeStorage.remove('detox_user_allergies');
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

  // ==========================================
  // BITÁCORA CLÍNICA
  // ==========================================
  const currentDayJournal = computed(() => {
    const dayKey = `dia_${selectedDay.value}`;
    return dailyJournal.value[dayKey] || { energy: null, digestion: null, symptoms: [], notes: '' };
  });

  const updateCurrentJournal = (patch) => {
    const dayKey = `dia_${selectedDay.value}`;
    const current = dailyJournal.value[dayKey] || { energy: null, digestion: null, symptoms: [], notes: '' };
    
    // Si se pasa el mismo nivel de energía o digestión que ya estaba activo (deshacer acción), devolver a null
    let finalPatch = { ...patch };
    if ('energy' in patch && patch.energy !== null && current.energy !== null && (current.energy === patch.energy || Number(current.energy) === Number(patch.energy))) {
      finalPatch.energy = null;
    }
    if ('digestion' in patch && patch.digestion !== null && current.digestion !== null && current.digestion === patch.digestion) {
      finalPatch.digestion = null;
    }

    dailyJournal.value = {
      ...dailyJournal.value,
      [dayKey]: { ...current, ...finalPatch, updatedAt: Date.now() }
    };
    safeStorage.set('detox_daily_journal', JSON.stringify(dailyJournal.value));
    pushToCloud();
  };

  const setJournalEnergy = (lvlId) => {
    const current = currentDayJournal.value.energy;
    const next = (current === lvlId || Number(current) === Number(lvlId)) ? null : lvlId;
    updateCurrentJournal({ energy: next });
  };

  const setJournalDigestion = (digId) => {
    const current = currentDayJournal.value.digestion;
    const next = (current === digId) ? null : digId;
    updateCurrentJournal({ digestion: next });
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

  // ==========================================
  // PERFIL DE ALERGIAS E INTOLERANCIAS
  // ==========================================
  const defaultAllergies = [
    'Frutos secos',
    'Semillas',
    'Algas',
    'Gluten / Trigo',
    'Soja / Shoyu',
    'Cítricos',
    'Apio',
    'Sésamo',
    'Frutillas',
    'Legumbres'
  ];

  const ALLERGEN_KEYWORDS = {
    'frutos secos': ['frutos secos', 'fruto seco', 'almendra', 'almendras', 'caju', 'castana', 'castanas', 'nuez', 'nueces', 'avellana', 'avellanas', 'pistacho', 'pistachos'],
    'semillas': ['semilla', 'semillas', 'lino', 'sesamo', 'chia', 'girasol', 'zapallo', 'amapola'],
    'algas': ['alga', 'algas', 'kombu', 'nori', 'wakame', 'cochayuyo', 'espirulina', 'agar'],
    'gluten / trigo': ['gluten', 'trigo', 'centeno', 'cebada', 'avena', 'harina de trigo', 'harina de centeno'],
    'gluten/trigo': ['gluten', 'trigo', 'centeno', 'cebada', 'avena', 'harina de trigo', 'harina de centeno'],
    'gluten': ['gluten', 'trigo', 'centeno', 'cebada', 'avena'],
    'trigo': ['trigo', 'harina de trigo'],
    'soja / shoyu': ['soja', 'shoyu', 'tamari', 'tofu', 'miso', 'edamame', 'salsa shoyu'],
    'soja/shoyu': ['soja', 'shoyu', 'tamari', 'tofu', 'miso', 'edamame', 'salsa shoyu'],
    'soja': ['soja', 'shoyu', 'tamari', 'tofu', 'miso', 'edamame'],
    'shoyu': ['shoyu', 'tamari', 'salsa shoyu'],
    'citricos': ['citrico', 'citricos', 'limon', 'limones', 'naranja', 'naranjas', 'mandarina', 'mandarinas', 'pomelo', 'pomelos', 'lima'],
    'apio': ['apio', 'pencas de apio'],
    'sesamo': ['sesamo', 'tahini', 'tahin'],
    'legumbres': ['legumbre', 'legumbres', 'mung', 'aduki', 'lenteja', 'lentejas', 'garbanzo', 'garbanzos', 'poroto', 'porotos'],
    'frutillas': ['frutilla', 'frutillas', 'fresa', 'fresas']
  };

  const getRecipeAllergens = (recipe, allergies) => {
    if (!recipe || !allergies || !allergies.length) return [];
    const allergenList = Array.isArray(allergies) ? allergies : [];
    if (allergenList.length === 0) return [];

    const texts = [
      normalizeText(recipe.titulo),
      ...(recipe.ingredientes || []).map(normalizeText),
      normalizeText(recipe.tip || '')
    ];

    const detected = [];

    for (const allergy of allergenList) {
      const normAllergy = normalizeText(allergy);
      if (!normAllergy) continue;

      let keywords = ALLERGEN_KEYWORDS[normAllergy];
      if (!keywords) {
        for (const [key, list] of Object.entries(ALLERGEN_KEYWORDS)) {
          if (normAllergy.includes(key) || key.includes(normAllergy)) {
            keywords = list;
            break;
          }
        }
      }
      if (!keywords) {
        keywords = [normAllergy];
      }

      const found = keywords.some(kw => {
        const normKw = normalizeText(kw);
        return texts.some(t => t.includes(normKw));
      });

      if (found) {
        detected.push(allergy);
      }
    }

    return detected;
  };

  const isRecipeAllergic = (recipe, allergies) => {
    return getRecipeAllergens(recipe, allergies).length > 0;
  };

  const toggleAllergy = (allergyName) => {
    if (!allergyName || typeof allergyName !== 'string') return;
    const name = allergyName.trim();
    if (!name) return;
    const idx = userAllergies.value.findIndex(a => normalizeText(a) === normalizeText(name));
    if (idx >= 0) {
      userAllergies.value = userAllergies.value.filter((_, i) => i !== idx);
      triggerToast(`🌿 Alérgeno removido: ${name}`);
    } else {
      userAllergies.value = [...userAllergies.value, name];
      triggerToast(`⚠️ Alérgeno registrado: ${name}`);
    }
  };

  const addAllergy = (allergyName) => {
    if (!allergyName || typeof allergyName !== 'string') return;
    const name = allergyName.trim();
    if (!name) return;
    const exists = userAllergies.value.some(a => normalizeText(a) === normalizeText(name));
    if (!exists) {
      userAllergies.value = [...userAllergies.value, name];
      triggerToast(`⚠️ Alérgeno registrado: ${name}`);
    }
  };

  const removeAllergy = (allergyName) => {
    if (!allergyName || typeof allergyName !== 'string') return;
    const name = allergyName.trim();
    userAllergies.value = userAllergies.value.filter(a => normalizeText(a) !== normalizeText(name));
    triggerToast(`🌿 Alérgeno removido: ${name}`);
  };

  // ==========================================
  // NORMALIZACIÓN & COMIDAS E INGESTAS
  // ==========================================
  const normalizeSlot = (rawSlot) => {
    if (!rawSlot) {
      return { text: '', done: false, items: [] };
    }
    if (Array.isArray(rawSlot)) {
      const items = rawSlot.map((item, idx) => ({
        id: item.id || `meal_${Date.now()}_${idx}`,
        name: item.name || item.text || '',
        isRecipe: item.isRecipe !== undefined ? !!item.isRecipe : !!item.recipeId,
        recipeId: item.recipeId || null,
        done: !!item.done,
        timestamp: item.timestamp || Date.now()
      }));
      const text = items.map(i => i.name).filter(Boolean).join(', ');
      const done = items.length > 0 && items.every(i => i.done);
      return { text, done, items };
    }

    let items = Array.isArray(rawSlot.items) ? rawSlot.items.map((item, idx) => ({
      id: item.id || `meal_${Date.now()}_${idx}`,
      name: item.name || item.text || '',
      isRecipe: item.isRecipe !== undefined ? !!item.isRecipe : !!item.recipeId,
      recipeId: item.recipeId || null,
      done: !!item.done,
      timestamp: item.timestamp || Date.now()
    })) : [];

    // Retrocompatibilidad 100% con entradas previas { text, done }
    if (items.length === 0 && rawSlot.text && typeof rawSlot.text === 'string' && rawSlot.text.trim()) {
      items.push({
        id: 'legacy_' + Math.random().toString(36).slice(2, 8),
        name: rawSlot.text.trim(),
        isRecipe: false,
        recipeId: null,
        done: !!rawSlot.done,
        timestamp: Date.now()
      });
    }

    const text = items.length > 0 
      ? items.map(i => i.name).filter(Boolean).join(', ') 
      : (rawSlot.text || '');
    const done = items.length > 0 
      ? items.every(i => i.done) 
      : !!rawSlot.done;

    return {
      ...rawSlot,
      text,
      done,
      items
    };
  };

  const currentDayMeals = computed(() => {
    const dayKey = `dia_${selectedDay.value}`;
    const dayData = dailyMeals.value[dayKey] || {};
    return {
      desayuno: normalizeSlot(dayData.desayuno),
      almuerzo: normalizeSlot(dayData.almuerzo),
      merienda: normalizeSlot(dayData.merienda),
      cena: normalizeSlot(dayData.cena)
    };
  });

  const updateMealSlot = (slotId, patch) => {
    const dayKey = `dia_${selectedDay.value}`;
    const currentDay = dailyMeals.value[dayKey] || {};
    const currentSlot = normalizeSlot(currentDay[slotId]);
    
    let updatedSlot = { ...currentSlot, ...patch };

    // Si se pasa 'done' booleano y el slot tiene items, actualizar todos los items
    if (patch.done !== undefined && Array.isArray(currentSlot.items) && currentSlot.items.length > 0) {
      updatedSlot.items = currentSlot.items.map(i => ({ ...i, done: !!patch.done }));
    }

    // Si se pasa 'text' y no había items, registrar como item de texto libre
    if (patch.text !== undefined) {
      const trimmed = patch.text.trim();
      if ((!updatedSlot.items || updatedSlot.items.length === 0) && trimmed) {
        updatedSlot.items = [{
          id: 'legacy_' + Math.random().toString(36).slice(2, 8),
          name: trimmed,
          isRecipe: false,
          recipeId: null,
          done: !!updatedSlot.done,
          timestamp: Date.now()
        }];
      }
    }

    dailyMeals.value = {
      ...dailyMeals.value,
      [dayKey]: {
        ...currentDay,
        [slotId]: updatedSlot
      }
    };
    safeStorage.set('detox_daily_meals', JSON.stringify(dailyMeals.value));
    pushToCloud();
  };

  const addMealItem = (slotId, { name, recipeId = null, isRecipe = false, done = false }) => {
    if (!name || typeof name !== 'string' || !name.trim()) return;
    const dayKey = `dia_${selectedDay.value}`;
    const currentDay = dailyMeals.value[dayKey] || {};
    const currentSlot = normalizeSlot(currentDay[slotId]);

    const newItem = {
      id: 'meal_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      name: name.trim(),
      isRecipe: isRecipe !== undefined ? !!isRecipe : !!recipeId,
      recipeId: recipeId || null,
      done: !!done,
      timestamp: Date.now()
    };

    const nextItems = [...currentSlot.items, newItem];
    const nextText = nextItems.map(i => i.name).filter(Boolean).join(', ');
    const nextDone = nextItems.length > 0 && nextItems.every(i => i.done);

    dailyMeals.value = {
      ...dailyMeals.value,
      [dayKey]: {
        ...currentDay,
        [slotId]: {
          ...currentSlot,
          text: nextText,
          done: nextDone,
          items: nextItems
        }
      }
    };
    safeStorage.set('detox_daily_meals', JSON.stringify(dailyMeals.value));
    pushToCloud();
  };

  const removeMealItem = (slotId, itemId) => {
    const dayKey = `dia_${selectedDay.value}`;
    const currentDay = dailyMeals.value[dayKey] || {};
    const currentSlot = normalizeSlot(currentDay[slotId]);

    const nextItems = currentSlot.items.filter(i => i.id !== itemId);
    const nextText = nextItems.map(i => i.name).filter(Boolean).join(', ');
    const nextDone = nextItems.length > 0 && nextItems.every(i => i.done);

    dailyMeals.value = {
      ...dailyMeals.value,
      [dayKey]: {
        ...currentDay,
        [slotId]: {
          ...currentSlot,
          text: nextText,
          done: nextDone,
          items: nextItems
        }
      }
    };
    safeStorage.set('detox_daily_meals', JSON.stringify(dailyMeals.value));
    pushToCloud();
  };

  const toggleMealItemDone = (slotId, itemId) => {
    const dayKey = `dia_${selectedDay.value}`;
    const currentDay = dailyMeals.value[dayKey] || {};
    const currentSlot = normalizeSlot(currentDay[slotId]);

    const nextItems = currentSlot.items.map(item => {
      if (item.id === itemId) {
        return { ...item, done: !item.done };
      }
      return item;
    });
    const nextText = nextItems.map(i => i.name).filter(Boolean).join(', ');
    const nextDone = nextItems.length > 0 && nextItems.every(i => i.done);

    dailyMeals.value = {
      ...dailyMeals.value,
      [dayKey]: {
        ...currentDay,
        [slotId]: {
          ...currentSlot,
          text: nextText,
          done: nextDone,
          items: nextItems
        }
      }
    };
    safeStorage.set('detox_daily_meals', JSON.stringify(dailyMeals.value));
    pushToCloud();
  };

  const toggleSlotAllDone = (slotId) => {
    const dayKey = `dia_${selectedDay.value}`;
    const currentDay = dailyMeals.value[dayKey] || {};
    const currentSlot = normalizeSlot(currentDay[slotId]);

    if (!currentSlot.items || currentSlot.items.length === 0) {
      const nextDone = !currentSlot.done;
      dailyMeals.value = {
        ...dailyMeals.value,
        [dayKey]: {
          ...currentDay,
          [slotId]: {
            ...currentSlot,
            done: nextDone
          }
        }
      };
    } else {
      const allDone = currentSlot.items.every(i => i.done);
      const targetDone = !allDone;
      const nextItems = currentSlot.items.map(i => ({ ...i, done: targetDone }));
      dailyMeals.value = {
        ...dailyMeals.value,
        [dayKey]: {
          ...currentDay,
          [slotId]: {
            ...currentSlot,
            done: targetDone,
            items: nextItems
          }
        }
      };
    }
    safeStorage.set('detox_daily_meals', JSON.stringify(dailyMeals.value));
    pushToCloud();
  };

  // ==========================================
  // BUSCADOR REACTIVO POR SLOT
  // ==========================================
  const getMealSearchResults = (slotId) => {
    if (!data.recipes) return [];
    const query = mealSearchQueries.value?.[slotId] || '';
    const q = normalizeText(query);
    if (!q) return [];

    return data.recipes
      .filter(r => {
        const normTitle = normalizeText(r.titulo);
        const normIngs = (r.ingredientes || []).map(normalizeText);
        const normCat = normalizeText(r.categoria || '');
        return normTitle.includes(q) || normIngs.some(i => i.includes(q)) || normCat.includes(q);
      })
      .map(r => {
        const detected = getRecipeAllergens(r, userAllergies.value);
        return {
          ...r,
          hasAllergen: detected.length > 0,
          isAllergic: detected.length > 0,
          detectedAllergens: detected
        };
      });
  };

  // ==========================================
  // SUGERENCIAS INTELIGENTES CON ROTACIÓN
  // ==========================================
  const getMealSuggestions = (slotId) => {
    if (!data.recipes) return [];

    // 1. Excluir recetas con alérgenos del usuario
    const safeRecipes = data.recipes.filter(r => !isRecipeAllergic(r, userAllergies.value));
    if (safeRecipes.length === 0) return [];

    // 2. Mapear frecuencia de consumo y último día consumido en el reto
    const usage = {};
    for (let d = 1; d <= 21; d++) {
      const dayKey = `dia_${d}`;
      const dayMeals = dailyMeals.value[dayKey];
      if (dayMeals) {
        ['desayuno', 'almuerzo', 'merienda', 'cena'].forEach(slot => {
          const s = normalizeSlot(dayMeals[slot]);
          s.items.forEach(it => {
            if (it.done) {
              const matchedRecipe = safeRecipes.find(r => 
                (it.recipeId && r.id === it.recipeId) || 
                (normalizeText(it.name) === normalizeText(r.titulo))
              );
              if (matchedRecipe) {
                const rid = matchedRecipe.id;
                if (!usage[rid]) usage[rid] = { count: 0, lastDay: 0 };
                usage[rid].count++;
                if (d > usage[rid].lastDay) usage[rid].lastDay = d;
              }
            }
          });
        });
      }
    }

    // 3. Filtrar según fase del reto y momento del día
    let monodietDays = 3;
    if (startMode.value === 'monodieta2') monodietDays = 2;
    if (startMode.value === 'monodieta1') monodietDays = 1;
    if (startMode.value === 'directo') monodietDays = 0;

    let candidates = [];

    if (selectedDay.value <= monodietDays && monodietDays > 0) {
      // Fase de Monodieta
      candidates = safeRecipes.filter(r => 
        r.id === 'nituke-manzana' || 
        r.id === 'caldo-detox' || 
        r.id === 'galletas-yamani' || 
        r.categoria === 'desayunos' || 
        r.categoria === 'caldos'
      );
    } else {
      // Menú Depurativo General
      if (slotId === 'desayuno') {
        candidates = safeRecipes.filter(r => 
          r.categoria === 'desayunos' || 
          r.categoria === 'leches' || 
          r.categoria === 'panificados' || 
          r.categoria === 'dips' ||
          r.categoria === 'infusiones'
        );
      } else if (slotId === 'almuerzo') {
        candidates = safeRecipes.filter(r => 
          r.categoria === 'almuerzos' || 
          r.categoria === 'sopas' || 
          r.categoria === 'caldos' || 
          r.categoria === 'dips' || 
          r.categoria === 'alinos' || 
          r.categoria === 'panificados' || 
          r.categoria === 'fermentos'
        );
      } else if (slotId === 'merienda') {
        candidates = safeRecipes.filter(r => 
          r.categoria === 'desayunos' || 
          r.categoria === 'leches' || 
          r.categoria === 'dips' || 
          r.categoria === 'panificados' ||
          r.categoria === 'infusiones'
        );
      } else if (slotId === 'cena') {
        candidates = safeRecipes.filter(r => 
          r.categoria === 'sopas' || 
          r.categoria === 'caldos' || 
          r.categoria === 'almuerzos' || 
          r.categoria === 'dips' || 
          r.categoria === 'alinos' || 
          r.categoria === 'fermentos'
        );
      }
    }

    // Si la categoría específica tiene pocas opciones aptas, rellenar con otras recetas seguras
    if (candidates.length < 3) {
      const candidateIds = new Set(candidates.map(c => c.id));
      const remaining = safeRecipes.filter(r => !candidateIds.has(r.id));
      candidates = [...candidates, ...remaining];
    }

    // 4. Algoritmo de rotación nutricional:
    // Prioriza recetas NO consumidas aún (count === 0) con badge '🌱 Aún no probada'
    // Prioriza recetas con menor consumo y consumidas hace más tiempo con badge '🔄 Rotación recomendada'
    const scored = candidates.map(recipe => {
      const u = usage[recipe.id] || { count: 0, lastDay: 0 };
      const count = u.count;
      const lastDay = u.lastDay;
      let badge = '🌱 Aún no probada';
      if (count === 1) {
        badge = '🔄 Rotación recomendada';
      } else if (count > 1) {
        badge = `🔄 Probada ${count} veces`;
      }
      return {
        ...recipe,
        consumedCount: count,
        lastConsumedDay: lastDay || null,
        badge
      };
    });

    scored.sort((a, b) => {
      if (a.consumedCount !== b.consumedCount) {
        return a.consumedCount - b.consumedCount;
      }
      return a.lastConsumedDay - b.lastConsumedDay;
    });

    return scored.slice(0, 4);
  };

  // ==========================================
  // HISTORIAL GLOBAL & ESTADÍSTICAS
  // ==========================================
  const consumedMealsHistory = computed(() => {
    const history = [];
    const slotLabels = {
      desayuno: { label: 'Desayuno', icon: '🌅' },
      almuerzo: { label: 'Almuerzo', icon: '☀️' },
      merienda: { label: 'Merienda', icon: '🍵' },
      cena: { label: 'Cena', icon: '🌙' }
    };

    for (let d = 1; d <= 21; d++) {
      const dayKey = `dia_${d}`;
      const dayMeals = dailyMeals.value[dayKey];
      if (!dayMeals) continue;

      ['desayuno', 'almuerzo', 'merienda', 'cena'].forEach(slotId => {
        const slot = normalizeSlot(dayMeals[slotId]);
        slot.items.forEach(item => {
          if (item.done) {
            history.push({
              day: d,
              dayKey,
              slotId,
              slotLabel: slotLabels[slotId]?.label || slotId,
              slotIcon: slotLabels[slotId]?.icon || '🍽️',
              itemId: item.id,
              name: item.name,
              isRecipe: !!item.isRecipe,
              recipeId: item.recipeId || null,
              timestamp: item.timestamp || Date.now()
            });
          }
        });
      });
    }

    const slotOrder = { desayuno: 1, almuerzo: 2, merienda: 3, cena: 4 };
    history.sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      if (slotOrder[a.slotId] !== slotOrder[b.slotId]) return (slotOrder[a.slotId] || 0) - (slotOrder[b.slotId] || 0);
      return (a.timestamp || 0) - (b.timestamp || 0);
    });

    return history;
  });

  const recipeStats = computed(() => {
    const allRecipes = data.recipes || [];
    const total = allRecipes.length;
    if (total === 0) {
      return {
        totalRecipes: 0,
        preparedCount: 0,
        neverPreparedCount: 0,
        coveragePercent: 0,
        preparedRecipes: [],
        neverPreparedRecipes: [],
        uniqueRecipesPrepared: 0
      };
    }

    const preparedSet = new Set();
    const history = consumedMealsHistory.value;

    history.forEach(item => {
      const matched = allRecipes.find(r => 
        (item.recipeId && r.id === item.recipeId) ||
        (normalizeText(item.name) === normalizeText(r.titulo))
      );
      if (matched) {
        preparedSet.add(matched.id);
      }
    });

    const preparedRecipes = allRecipes.filter(r => preparedSet.has(r.id));
    const neverPreparedRecipes = allRecipes.filter(r => !preparedSet.has(r.id));
    const preparedCount = preparedRecipes.length;
    const neverPreparedCount = neverPreparedRecipes.length;
    const coveragePercent = Math.round((preparedCount / total) * 100);

    return {
      totalRecipes: total,
      preparedCount,
      neverPreparedCount,
      coveragePercent,
      preparedRecipes,
      neverPreparedRecipes,
      uniqueRecipesPrepared: preparedCount
    };
  });

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
    
    // Alergias e intolerancias declaradas
    if (userAllergies.value && userAllergies.value.length > 0) {
      report += `⚠️ Alergias e Intolerancias declaradas: ${userAllergies.value.join(', ')}\n`;
    } else {
      report += `⚠️ Alergias e Intolerancias declaradas: Ninguna registrada\n`;
    }

    // Cobertura de recetas
    const stats = recipeStats.value;
    report += `📊 Cobertura de recetas de la guía: ${stats.preparedCount} de ${stats.totalRecipes} (${stats.coveragePercent}%)\n`;
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
          if (j.energy !== null && j.energy !== undefined) {
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
          const mealLines = [];
          const slotLabels = {
            desayuno: 'Desayuno',
            almuerzo: 'Almuerzo',
            merienda: 'Merienda',
            cena: 'Cena'
          };
          ['desayuno', 'almuerzo', 'merienda', 'cena'].forEach(slotId => {
            const slotData = normalizeSlot(m[slotId]);
            const label = slotLabels[slotId] || slotId.toUpperCase();
            if (slotData.items && slotData.items.length > 0) {
              const itemsStr = slotData.items.map(it => {
                const check = it.done ? '[✓]' : '[ ]';
                const tag = it.isRecipe ? ' (Receta)' : '';
                return `${check} ${it.name}${tag}`;
              }).join(' | ');
              mealLines.push(`    - ${label}: ${itemsStr}`);
            } else if (slotData.text && slotData.text.trim()) {
              mealLines.push(`    - ${label}: ${slotData.done ? '[✓]' : '[ ]'} ${slotData.text.trim()}`);
            }
          });
          if (mealLines.length > 0) {
            report += `  • Comidas e Ingestas:\n${mealLines.join('\n')}\n`;
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
    setJournalEnergy,
    setJournalDigestion,
    toggleJournalSymptom,
    normalizeSlot,
    currentDayMeals,
    updateMealSlot,
    addMealItem,
    removeMealItem,
    toggleMealItemDone,
    toggleSlotAllDone,
    mealSearchQueries,
    getMealSearchResults,
    userAllergies,
    showAllergySelector,
    customAllergyInput,
    defaultAllergies,
    toggleAllergy,
    addAllergy,
    removeAllergy,
    isRecipeAllergic,
    getRecipeAllergens,
    getMealSuggestions,
    consumedMealsHistory,
    recipeStats,
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
