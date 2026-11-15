const fs=require('fs'),path=require('path'),vm=require('vm');const ROOT=path.resolve(__dirname,'..','..');const sb={};sb.window=sb;vm.createContext(sb);
const dir=path.join(ROOT,'v2','src','data');fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort().forEach(f=>vm.runInContext(fs.readFileSync(path.join(dir,f),'utf8'),sb));
for(const i of [6,7,8,12,24]){const h=sb.DX.herbs[i];console.log(i,h.id,h.name,'|',h.source,'|',(h.properties||[]).join(' // '))}
