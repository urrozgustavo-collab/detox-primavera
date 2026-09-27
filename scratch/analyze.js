const d = require('../app/detox-data.js');

console.log("TOTAL RECETAS:", d.recipes.length);
d.recipes.forEach((r, idx) => {
  console.log(`\n[${idx + 1}] ID: ${r.id} | Titulo: ${r.titulo} | Categoria: ${r.categoria} | Tiempo: ${r.tiempo} | Metodo: ${r.metodo}`);
  r.ingredientes.forEach(ing => console.log('   - ' + ing));
});
