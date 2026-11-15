import re,sys
p='QA.md'
t=open(p,encoding='utf-8').read()
R={
1:"**Corregido** — `hasWords` ya cubre plural/singular (zanahoria↔zanahorias, almendra↔almendras, nuez↔nueces, frutilla↔frutillas); con `zanahoria`, `almendra` y `nuez` quedan 30 recetas marcadas y ninguna con zanahoria se escapa. Sin falsos positivos (`sal`≠salsa, `cebolla`≠cebollín).",
2:"**Corregido** — chip y fecha 8,7:1 (oscuro) y 6,2:1 (claro).",
3:"**Corregido** — con Diarrea `agua-de-lino` ya no se sugiere y las recetas muestran «Precaución: diarrea…» (`recipeCondHits`); con Embarazo desaparece `infusion-calmante-triple-flor`. `mate-medicinal-hierbas` sigue sugerido (lleva manzanilla, solo contraindicada en dosis terapéuticas).",
4:"**Corregido** — heladera vacía: 0 recetas en «Te falta poco»; el trío vital queda en 20 % («lejos»).",
5:"**Corregido** — `normUnit('puñado')=puñado`; «1 ½ puñados» en Compras y en el texto compartido; `parseIngredientLine` conserva la unidad.",
6:"**Corregido** — el diálogo ofrece «Fusionar en mi perfil» / «Crear perfil nuevo»; fusionó en el perfil activo (1 perfil, 2 ediciones). Backup v2 «como perfiles nuevos» ahora agrega «(copia)». Ver QA-36.",
7:"**Corregido** — 0 px a 360 (claro/oscuro).",
8:"**Corregido** — la tabla «Día por día» va en `.table-wrap` con scroll interno (442 px dentro de 282). En el recorrido automático apareció 13 px de desborde solo durante la animación de entrada; en reposo es 0.",
9:"**Corregido** — foco al `h1` al navegar, `document.title` por ruta («Compras · Detox de Primavera») y el foco vuelve al botón que abrió el diálogo.",
10:"**Corregido** — «nadie empezó» ahora es `e e e…` (sin gracia); con registros la gracia cubre huecos entre días hechos.",
11:"**Corregido** — Compras: «Del 15/11 al 15/11 (semana de lunes a domingo, como el Plan)». Observación: un domingo «esta semana» es un solo día (queda «Próximos 3 días»).",
12:"**Corregido** — `VTIMEZONE` con `STANDARD` presente; CRLF, `RRULE`, `VALARM` intactos.",
13:"**Corregido** — Enter avanza; nombre vacío muestra «Escribí tu nombre… o tocá Saltar».",
14:"**Corregido** — con 3 días de datos y sin copia ya no aparece el aviso.",
15:"**Corregido** — los temporizadores pasan al nivel dispositivo: el timer iniciado en el perfil A se ve y suena en el B.",
16:"**Corregido** — letra grande = 20 px (+25 %). El desborde de Ajustes a 360 persiste por otra causa: QA-35.",
17:"**Corregido** — (a) «Agregar faltantes»; (b) un solo «Buscar» visible; (c) filas con scroll tienen degradado de aviso; (d) «Lunes siguiente 23/11» (domingo).",
18:"**Corregido** — el paso 1 lista todas las verduras y el título no se corta. (El tamaño de letra del paso no se volvió a medir.)",
19:"**Corregido** — Ajustes › Datos: «Al importar la versión anterior, 2 datos no se pudieron leer» con detalle («Día 2: la energía guardada («9») no es válida…»); también en el onboarding y el aviso inicial.",
20:"**Corregido** — `step=50`, 1800 ml válido; `plato_verde` conserva `['general']`.",
21:"**Corregido** — «Puerro ½ a 1 unidad», «1 ½ a 3 unidades» (usa `qtyMax`).",
22:"**Corregido** — «leche» sigue trayendo Azúcar y Té negro, pero ahora por sinónimos legítimos («dulce de leche», «té con leche»), ya no por el texto `why`.",
23:"**Corregido** — casilla «Borrar también los datos guardados por la versión anterior» (si no, quedan y se pueden reimportar).",
24:"**Corregido** — los ítems en heladera muestran «ya tenés»; sin doble paréntesis.",
25:"**Corregido** — `icon-192.png`/`icon-512.png` en manifest y caché, `apple-touch-icon`, SW con la página «red primero» (versión nueva al primer recargar). No probado en https.",
26:"**Corregido** — `legumbres` en `colchon-de-arvejas`, `ensalada-esparragos-rabanitos`, `arroz-coliflor-salteado`, `temakis-nori`; `caldo-de-miso` con `mayContain:gluten`; `frutillas` en `mayContain` de pudding, compota y hot cakes.",
27:"**Corregido** — cantidades añadidas por el equipo quedan marcadas «≈ sugerida» (comino, ajo, limón, aceite, 250 g, 3 cdas…) y los pasos como «sugerencia», con aviso «no vienen de la guía»; el «60-70 °C» del miso se quitó. (El comino sigue, pero marcado.)",
28:"**Corregido** — 92 de 105 recetas con porciones (`servingsEstimated`): Compras escala («Puerro ½ a 1 unidad» con 2 porciones).",
29:"**Parcial** — el trío vital ya tiene sus verduras como `principal`, pero con `item:null`: la heladera lo manda a «lejos» (20 %) en lugar de mostrarlo bien; «mix rawmesan» sigue mapeado a `semillas_lino`. Sin principal queda solo esa receta.",
30:"**Parcial** — Newton, Paracelso y Durant ahora con fuente concreta y se sumaron 4 citas de la guía (Isabel Caparra); siguen como «atribuida» Hipócrates (d21), Sydenham, Maimónides, Kneipp, Bach, Carrel y Bragg con el mismo texto sin fuente comprobable.",
31:"**Corregido** — cada línea dice «Según la guía…»; la albahaca aclara «solo el aceite» y el uso fresco ya no sale como contraindicación.",
32:"**Corregido** — `hoursEditorial` y notas en pantalla: «Las horas son orientativas del equipo: la guía solo dice…».",
33:"**Corregido** — sin mayúsculas; `liquido_coccion` ya no es básico de alacena.",
34:"**Corregido** — 0 recetas sin `time`; 36 `tip:null` (declarado).",
}
def tag(m):
    return m
out=[]
for line in t.split('\n'):
    m=re.match(r'^\| (QA-\d+) \|',line)
    if line.startswith('| ID |'):
        line=line.rstrip()[:-1].rstrip()+' | Ronda 2 |'
    elif re.match(r'^\|---\|',line) and 'Sev' not in line and line.count('|')>=7 and ('---|---|---|---|---|---|' in line):
        line=line+'---|'
    elif m:
        n=int(m.group(1)[3:])
        line=line.rstrip()[:-1].rstrip()+' | '+R[n]+' |'
    out.append(line)
open(p,'w',encoding='utf-8').write('\n'.join(out))
print('ok')
