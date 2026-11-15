const fs=require('fs'),path=require('path'),vm=require('vm');const ROOT=path.resolve(__dirname,'..','..');const sb={};sb.window=sb;vm.createContext(sb);
const dir=path.join(ROOT,'v2','src','data');fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort().forEach(f=>vm.runInContext(fs.readFileSync(path.join(dir,f),'utf8'),sb));
const D=sb.DX,R=id=>D.recipes.find(r=>r.id===id);
for(const id of ['babaganoush','caldo-detox','caldo-de-miso','pesto-hongos']){const r=R(id);console.log(id,JSON.stringify(r.ingredients.map(i=>({t:i.text.slice(0,50),...Object.fromEntries(Object.entries(i).filter(([k])=>!['text','qty','unit','item','role','optional'].includes(k)))}))),'\n  steps:',r.steps.map(s=>s.text.slice(0,90)).join(' / '),'\n  note:',r.note,'| tip:',r.tip)}
const s=D.prep.soaking.find(x=>x.id==='remojo-sarraceno');console.log(JSON.stringify(s));
console.log(Object.keys(D.recipes[0]).join(','));
