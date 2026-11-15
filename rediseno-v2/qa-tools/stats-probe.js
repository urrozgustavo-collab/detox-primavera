const fs=require('fs'),path=require('path'),vm=require('vm');const ROOT=path.resolve(__dirname,'..','..');const sb={};sb.window=sb;vm.createContext(sb);
const dir=path.join(ROOT,'v2','src','data');fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort().forEach(f=>vm.runInContext(fs.readFileSync(path.join(dir,f),'utf8'),sb));
const R=sb.DX.recipes;
console.log('total',R.length,'sin time',R.filter(r=>!r.time||!r.time.total).length,'con servings',R.filter(r=>r.servings).length,'con qtyMax',R.filter(r=>r.ingredients.some(i=>i.qtyMax)).length,'con tip null',R.filter(r=>!r.tip).length);
console.log('sin principal (solo condimento/basico/null):',R.filter(r=>!r.ingredients.some(i=>i.item&&(i.role||'principal')==='principal')).map(r=>r.id).join(','));
console.log('verduras item null:',R.filter(r=>r.ingredients.some(i=>!i.item)).map(r=>r.id).join(','));
