// Genera comun/portafolio.min.js (+ .map) a partir de comun/portafolio.js.
// Uso: node tools/minificar.js   (requiere terser: npm i terser, o NODE_PATH apuntando a donde esté instalado)
// Los 5 HTML cargan la versión .min; se edita SIEMPRE portafolio.js y se vuelve a correr esto.
const fs=require('fs'),path=require('path');
const {minify}=require(process.env.TERSER_PATH||'terser');
const dir=path.join(__dirname,'..','comun');
const src=fs.readFileSync(path.join(dir,'portafolio.js'),'utf8');
minify({'portafolio.js':src},{
  compress:{passes:2},mangle:true,format:{comments:false},
  sourceMap:{filename:'portafolio.min.js',url:'portafolio.min.js.map'}
}).then(r=>{
  fs.writeFileSync(path.join(dir,'portafolio.min.js'),r.code);
  fs.writeFileSync(path.join(dir,'portafolio.min.js.map'),r.map);
  console.log('portafolio.min.js',r.code.length,'bytes (fuente',src.length,')');
}).catch(e=>{console.error(e);process.exit(1);});
