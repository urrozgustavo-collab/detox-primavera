const fs=require('fs'),path=require('path'),vm=require('vm');const ROOT=path.resolve(__dirname,'..','..');const sb={};sb.window=sb;vm.createContext(sb);
const dir=path.join(ROOT,'v2','src','data');fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort().forEach(f=>vm.runInContext(fs.readFileSync(path.join(dir,f),'utf8'),sb));
const D=sb.DX; console.log('GRANOS',JSON.stringify(D.methods.grains)); console.log('LEG',JSON.stringify(D.methods.legumes)); console.log('SOAK',D.prep.soaking.map(s=>[s.id,s.minH,s.optH,s.maxH,s.discardWater,s.medium].join(':')).join(' | '));
