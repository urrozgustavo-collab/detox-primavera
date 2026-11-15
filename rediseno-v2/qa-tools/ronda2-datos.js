const fs=require('fs'),path=require('path'),vm=require('vm');const ROOT=path.resolve(__dirname,'..','..');const sb={};sb.window=sb;vm.createContext(sb);
const dir=path.join(ROOT,'v2','src','data');fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort().forEach(f=>vm.runInContext(fs.readFileSync(path.join(dir,f),'utf8'),sb));
const D=sb.DX,R=id=>D.recipes.find(r=>r.id===id);
const al=id=>{const r=R(id);return id+' ['+(r.allergens||[])+'|may:'+(r.mayContain||[])+']'};
console.log('26',['colchon-de-arvejas','ensalada-esparragos-rabanitos','arroz-coliflor-salteado','temakis-nori','caldo-de-miso','pudding-chia-compota','compota-manzana-clavo-canela','hot-cakes-avena-coco'].map(al).join('\n   '));
const txt=id=>{const r=R(id);return r.ingredients.map(i=>i.text).join(' ; ')+' || '+r.steps.map(s=>s.text).join(' ')+' || tip:'+r.tip+' note:'+r.note};
for(const [id,re] of [['babaganoush',/comino|ajo|limón|10 min/gi],['pesto-hongos',/250|taza|cucharadas/gi],['hummus-mung',/tazas/gi],['queso-crema-tofu',/250|cucharadas|4 d/gi],['mayonesa-zanahoria',/4 días|días/gi],['leche-almendras',/días/gi],['caldo-detox',/minutos|tapado|mínimo|sugerid/gi],['caldo-de-miso',/°C|60|cebada|sugerid/gi]]) console.log('27',id,(txt(id).match(re)||[]).join(' | '), '| cantidad_sugerida:', JSON.stringify(R(id).ingredients.filter(i=>i.suggested||i.editorial||i.estimated).length));
const ex=R('babaganoush'); console.log('27 babaganoush keys',Object.keys(ex.ingredients[0]), 'note:',ex.note);
console.log('28 servings',D.recipes.filter(r=>r.servings).length,'/',D.recipes.length);
console.log('29 sin principal:',D.recipes.filter(r=>!r.ingredients.some(i=>i.item&&(i.role||'principal')==='principal')).map(r=>r.id).join(','));
console.log('29 item null:',D.recipes.filter(r=>r.ingredients.some(i=>!i.item)).map(r=>r.id+':'+r.ingredients.filter(i=>!i.item).map(i=>i.role).join('/')).join(' , '));
console.log('29 trio',R('trio-verduras-vapor-semillas').ingredients.map(i=>(i.item||'null')+':'+i.role).join(' , '));
console.log('29 rawmesan item', JSON.stringify(R('trio-verduras-vapor-semillas').ingredients.filter(i=>/rawmesan/.test(i.text)).map(i=>i.item)));
for(const q of D.quotes) console.log('30',q.day,q.attribution,'|',q.author,'|',q.text.slice(0,70));
for(const id of ['porotos-mung','limon','albahaca']){const h=D.herbs.find(x=>x.id===id);console.log('31',id,(h.properties||[]).join(' // '),'| contra:',JSON.stringify((h.contraindications||[]).map(c=>c.condition+':'+c.text.slice(0,60))))}
console.log('32',D.prep.soaking.map(s=>[s.id,s.minH,s.optH,s.maxH,s.editorial||s.source||''].join(':')).join(' | '));
const f=D.foods.find(x=>x.id==='aceite-lino');console.log('33',f.why,'| pantry:',D.ingredients.filter(i=>i.pantry).map(i=>i.id).join(','));
console.log('34 sin time',D.recipes.filter(r=>!r.time||!r.time.total).map(r=>r.id).join(','),'| tip null',D.recipes.filter(r=>!r.tip).length);
console.log('qtyMax',D.recipes.filter(r=>r.ingredients.some(i=>i.qtyMax)).length);
