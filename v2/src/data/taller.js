/* Detox de Primavera v2 — información del taller de Isabel Caparra (contacto, encuentros, videos, productores).
   Fuente: INFO-TALLER-ISA-CAPARRA.md y LISTA-DE-COMPRAS.md. Los encuentros son de la edición de septiembre 2026: la app marca los pasados como «realizado». */
(function (root) {
  'use strict';
  root.DX = root.DX || {};

  root.DX.taller = {
    guide: {
      name: 'Isabel Caparra',
      email: 'isabelcaparramtc@gmail.com',
      whatsapp: '+54 9 11 5709-5441',
      groupUrl: 'https://chat.whatsapp.com/DkP14EhdEqk0A7rFz6jcap?s=cl&p=a&mlu=4&ilr=4',
      meetUrl: 'https://meet.google.com/jgi-psdh-aak',
      edition: 'Septiembre 2026',
      readingNote: 'Isa pide leer la guía desde el inicio hasta la página 25 (es el eje rector de los 21 días) y tenerla a mano. La sección «Alimentos Medicina» (desde la pág. 41) es de consulta sobre fitoterapia y contraindicaciones de los suplementos.'
    },
    meetings: [
      { date: '2026-09-28', time: '18:30', topic: 'Resolución de dudas iniciales antes de arrancar', recorded: false },
      { date: '2026-10-14', time: '18:30', topic: 'Encuentro de seguimiento y consultas en vivo', recorded: false }
    ],
    meetingsNote: 'Los encuentros en vivo no quedan grabados. Quien no pueda asistir debe enviar sus dudas por el grupo de WhatsApp.',
    videos: [
      { id: '4-anhQirqug', title: 'Primer encuentro grabado (Isa pide verlo antes de empezar)', url: 'https://youtu.be/4-anhQirqug' },
      { id: 'ap8eZGPi4-Y', title: 'Segundo encuentro grabado', url: 'https://youtu.be/ap8eZGPi4-Y' }
    ],
    producers: [
      { id: 'enzo', name: 'Enzo (verduras orgánicas y salsa Shoyu MOA)', phone: '11 4065-0088', instagram: null, note: 'Venta directa del productor; según el taller, a la mitad de precio que en las dietéticas.' },
      { id: 'kalimera', name: 'Soledad · Kalimera Alimentos', phone: '+54 9 11 5881-2907', instagram: null, note: 'Panes de sarraceno aptos, chucrut y vinagre de manzana vivo, a domicilio.' },
      { id: 'levenson', name: 'Tienda macrobiótica Mario Levenson', phone: '11 7365-8388', instagram: '@genmail.tiendanatural', note: 'Barrio de Almagro. Shoyu MOA y alimentos macrobióticos.' },
      { id: 'circulo-once', name: 'Círculo Once', phone: '11 5134-6546', instagram: '@circuloonce', note: 'Alimentos naturales y fermentos seleccionados.' }
    ],
    mateReplacement: {
      title: 'Cómo reemplazar el mate y la cafeína',
      items: [
        'Si necesitás bombillear, armá el mate solo con hierbas: menta, cola de caballo, lavanda, ortiga, manzanilla, llantén, diente de león, pétalos de rosa, cáscaras de cítricos y cedrón. Para un toque dulce, pequeñas dosis de hojas de stevia.',
        'Si sentís abstinencia de cafeína o dolor de cabeza, podés tomar té verde, banchá o matcha en taza durante los primeros días.',
        'El agua tibia a lo largo del día ayuda a mitigar el dolor de cabeza.'
      ]
    },
    breadSuppliers: 'Centeno de masa madre: Hausbrot, Le Pain Quotidien, Atelier Fuerza, Pampa Madre, Waikery, Compa Pan, El Café Silvestre. Sarraceno o sin gluten: Kalimera Alimentos, Pampa Madre.'
  };
})(typeof window !== 'undefined' ? window : globalThis);
