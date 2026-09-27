# Arquitectura Modular — Detox de Primavera WebApp

> **Versión base:** v1.2.1  
> **Patrón:** Componentes Modulares Desacoplados (Snippets HTML + Composables JS)  
> **Compilador / Bundler:** `bundle.py`

---

## 🎯 Objetivo de la Arquitectura
Permitir el trabajo en **múltiples sesiones o chats paralelos e independientes**, de modo que una sesión pueda corregir o mejorar una sección específica de la aplicación sin tocar el código de las demás y **sin riesgo de pisar archivos, generar conflictos de Git o romper el build general**.

---

## 📁 Mapa de Directorios

```
salud-recetas/detox-primavera/
├── app/
│   ├── index.template.html        # Plantilla maestra con directivas <!-- INCLUDE: ... -->
│   ├── index.html                 # HTML de desarrollo ensamblado automáticamente
│   ├── app.js                     # Integrador raíz Vue 3 (monta y orquesta los módulos)
│   ├── detox-data.js              # Base de datos clínica del taller
│   ├── fridge-engine.js           # Motor de scoring y matching culinario
│   ├── styles.css                 # Reglas CSS personalizadas
│   │
│   ├── core/                      # Componentes transversales del sistema
│   │   ├── header.html            # Topbar, racha, badges, dark mode, sync nube y navegación desktop
│   │   ├── footer.html            # Pie de página con SemVer v1.2.1 y reinicio
│   │   ├── modals.html            # Modales (Receta, Modo Cocina, Cmd+K, Sync Cloud, Reporte Clínico, Toasts)
│   │   ├── mobile-nav.html        # Barra inferior fija de 5 pestañas para celular
│   │   └── core.js                # Shell reactivo: safeStorage, sync multi-dispositivo, tema, búsqueda
│   │
│   └── modules/                   # Módulos 100% aislados por sección funcional
│       ├── dia/                   # Pestaña 1: Mi Día & Tracker 21 Días
│       │   ├── dia.html           # Template: Tracker, selector de fecha, hábitos, bitácora, comidas
│       │   └── dia.js             # Lógica: Fecha de inicio, misiones, XP, medallas, citas, informe
│       │
│       ├── recetas/               # Pestaña 2 (Subvista 1): Catálogo de Recetas
│       │   ├── recetas.html       # Template: Switcher de cocina y catálogo con filtros
│       │   └── recetas.js         # Lógica: Filtros, búsqueda, apertura y modo cocina paso a paso
│       │
│       ├── heladera/              # Pestaña 2 (Subvista 2): Heladera Inteligente
│       │   ├── heladera.html      # Template: Taps rápidos, selector de ingredientes y matching
│       │   └── heladera.js        # Lógica: Selección de ingredientes, despensa básica y faltantes
│       │
│       ├── batch/                 # Pestaña 2 (Subvista 3): Batch Cooking
│       │   ├── batch.html         # Template: Planificador semanal y bases compartidas
│       │   └── batch.js           # Lógica: Cálculo de ahorro de tiempo y asignación de platos
│       │
│       ├── remojos/               # Pestaña 2 (Subvista 4): Gestor de Remojos
│       │   ├── remojos.html       # Template: 11 reglas de activación enzimática y tiempos
│       │   └── remojos.js         # Lógica: Cronograma de activación según recetas planificadas
│       │
│       ├── compras/               # Pestaña 3: Lista de Compras Interactiva
│       │   ├── compras.html       # Template: Lista clasificada por rubro comercial y checks
│       │   └── compras.js         # Lógica: Toggles, contador de pendientes y copia limpia para WhatsApp
│       │
│       ├── semaforo/              # Pestaña 4: Semáforo Nutricional
│       │   ├── semaforo.html      # Template: Buscador y filtros Verde/Amarillo/Rojo
│       │   └── semaforo.js        # Lógica: Filtrado reactivo por categoría y estado clínico
│       │
│       ├── sos/                   # Pestaña 5: Botiquín SOS & Crisis Depurativa
│       │   ├── sos.html           # Template: Protocolos paso a paso por síntoma
│       │   └── sos.js             # Lógica: Exposición de protocolos clínicos
│       │
│       └── herbolario/            # Pestaña 6: Herbolario & Hub del Taller
│           ├── herbolario.html    # Template: Encuentros Meet, videos, hierbas y proveedores
│           └── herbolario.js      # Lógica: Datos de sesiones y recursos
│
├── Detox-Primavera-App.html       # Bundle standalone de producción (cero dependencias externas)
├── index.html                     # Copia exacta para distribución web y GitHub Pages
└── bundle.py                      # Script de compilación y empaquetado
```

---

## 🛠️ Reglas para Trabajar en Sesiones Simultáneas

1. **Editar solo el módulo asignado:**
   - Si una sesión va a corregir o mejorar la **Heladera**, únicamente debe tocar archivos dentro de `app/modules/heladera/` (`heladera.html` y/o `heladera.js`).
   - Si otra sesión va a trabajar en el **Semáforo**, únicamente toca `app/modules/semaforo/`.
   - Si otra sesión va a ajustar el **Botiquín SOS**, únicamente toca `app/modules/sos/`.

2. **Compilar y validar:**
   Una vez terminadas las modificaciones en el módulo, ejecutar:
   ```bash
   python bundle.py
   node scratch/test_deep_modules.js
   ```
   Esto compila automáticamente `app/index.html`, `Detox-Primavera-App.html` e `index.html`, y corre la suite de verificación con cobertura total de los módulos.

3. **Cero conflictos de Git:**
   Como los archivos de código fuente (`.html` y `.js`) están separados por carpetas físicas, las ramas o sesiones paralelas nunca entran en conflicto entre sí.
