const fs=require('fs'),path=require('path'),vm=require('vm');const ROOT=path.resolve(__dirname,'..','..');const sb={};sb.window=sb;vm.createContext(sb);
const dir=path.join(ROOT,'v2','src','data');fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort().forEach(f=>vm.runInContext(fs.readFileSync(path.join(dir,f),'utf8'),sb));
for(const q of sb.DX.quotes) console.log(q.day,'|',q.attribution,'|',q.author,'|',q.text.slice(0,110),'||',(q.context||'').slice(0,110));
