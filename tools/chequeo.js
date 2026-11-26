// Chequeo automático de Inversiones. Corre en GitHub en cada push (.github/workflows/chequeo.yml)
// y también a mano:  node tools/chequeo.js
// Revisa: que no haya errores de sintaxis en el JS (archivos y <script> de los HTML), que el
// portafolio.min.js esté regenerado con la misma versión que portafolio.js, y que los 5 HTML pidan
// esa misma versión (?v=N), el mismo tema.css y el mismo datos.js.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const HTMLS = ['GDC/PortafolioGDC.html', 'Ana/PortafolioAna2.html', 'Hilda/PortafolioHilda.html', 'Juli/PortafolioJuli.html', 'Omar/PortafolioOmar2.html'];
const OTROS_HTML = ['index.html', 'vista.html'];
const JS = ['comun/portafolio.js', 'comun/portafolio.min.js', 'comun/datos.js', 'comun/mapa_mundo.js', 'sw.js'];
const GH = !!process.env.GITHUB_ACTIONS;
let errores = 0, avisos = 0;
const ok = (m) => console.log('  ✓ ' + m);
const mal = (m, file, line) => { errores++; console.log('  ✕ ' + m); if (GH) console.log(`::error${file ? ' file=' + file + (line ? ',line=' + line : '') : ''}::${m}`); };
const ojo = (m, file) => { avisos++; console.log('  ! ' + m); if (GH) console.log(`::warning${file ? ' file=' + file : ''}::${m}`); };
const leer = (f) => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch { return null; } };
const lineaDe = (txt, idx) => txt.slice(0, idx).split('\n').length;

function compilar(src, nombre, file, lineaBase) {
  try { new vm.Script(src, { filename: nombre }); return true; }
  catch (e) {
    const m = /:(\d+)\s*$/.exec(String(e.stack || '').split('\n')[0] || '');
    const ln = m ? (+m[1] + (lineaBase || 1) - 1) : lineaBase;
    mal(`${nombre}: ${e.message}`, file, ln);
    return false;
  }
}

console.log('1) Sintaxis de los archivos JS');
for (const f of JS) {
  const s = leer(f);
  if (s == null) { if (f !== 'comun/mapa_mundo.js') ojo(`${f}: no está`, f); continue; }
  if (compilar(s, f, f, 1)) ok(f);
}

console.log('2) Sintaxis de los <script> dentro de los HTML');
for (const f of HTMLS.concat(OTROS_HTML)) {
  const h = leer(f); if (h == null) { ojo(`${f}: no está`, f); continue; }
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi; let m, n = 0, bien = true;
  while ((m = re.exec(h))) {
    const attrs = m[1] || '', code = m[2] || '';
    if (/\bsrc\s*=/.test(attrs) || !code.trim()) continue;
    const t = (/\btype\s*=\s*["']?([^"'\s>]+)/i.exec(attrs) || [])[1];
    if (t && !/^(text|application)\/(java|ecma)script$/i.test(t) && t !== 'module') continue;
    n++;
    if (!compilar(code, `${f} (script #${n})`, f, lineaDe(h, m.index + m[0].indexOf('>') + 1))) bien = false;
  }
  if (bien) ok(`${f} (${n} scripts)`);
}

console.log('3) Versión: portafolio.js, portafolio.min.js y los 5 HTML');
const src = leer('comun/portafolio.js') || '', min = leer('comun/portafolio.min.js') || '';
const vSrc = (/var APP_VERSION\s*=\s*(\d+)/.exec(src) || [])[1];
const vMin = (/APP_VERSION\s*=\s*(\d+)/.exec(min) || [])[1];
if (!vSrc) mal('No encontré APP_VERSION en comun/portafolio.js', 'comun/portafolio.js');
else {
  ok(`portafolio.js es la v${vSrc}`);
  if (vMin !== vSrc) mal(`portafolio.min.js es la v${vMin || '?'} y portafolio.js la v${vSrc}: falta regenerarlo (node tools/minificar.js)`, 'comun/portafolio.min.js');
  else ok(`portafolio.min.js también es la v${vMin}`);
  const cl = (/var APP_CHANGELOG\s*=\s*\[\s*'v(\d+)/.exec(src) || [])[1];
  if (cl && cl !== vSrc) ojo(`La primera línea de APP_CHANGELOG es la v${cl}, pero APP_VERSION es ${vSrc}`, 'comun/portafolio.js');
  if (!fs.existsSync(path.join(ROOT, 'comun/portafolio.min.js.map'))) ojo('Falta comun/portafolio.min.js.map', 'comun/portafolio.min.js.map');
  const st = (f) => { try { return fs.statSync(path.join(ROOT, f)).mtimeMs; } catch { return 0; } };
  if (!GH && st('comun/portafolio.min.js') + 1000 < st('comun/portafolio.js')) ojo('portafolio.js se modificó después de generar portafolio.min.js: revisá si falta regenerarlo');
}
const pide = (h, re) => (re.exec(h) || [])[1];
const tema = {}, datos = {};
for (const f of HTMLS) {
  const h = leer(f); if (h == null) continue;
  const v = pide(h, /portafolio\.min\.js\?v=(\d+)/);
  if (!v) mal(`${f}: no carga ../comun/portafolio.min.js?v=N`, f);
  else if (vSrc && v !== vSrc) mal(`${f} pide portafolio.min.js?v=${v} pero la versión es ${vSrc}: el navegador puede quedarse con la vieja`, f, lineaDe(h, h.indexOf('portafolio.min.js?v=')));
  else ok(`${f} pide la v${v}`);
  tema[f] = pide(h, /tema\.css\?v=(\d+)/); datos[f] = pide(h, /datos\.js\?d=(\d+)/);
}
const iguales = (obj, nombre) => {
  const vals = Object.values(obj).filter((x) => x != null), set = [...new Set(vals)];
  if (set.length > 1) ojo(`${nombre} no tiene el mismo número en los 5 HTML: ` + Object.entries(obj).map(([f, v]) => `${f.split('/')[0]}=${v}`).join(', '));
  else if (set.length) ok(`${nombre} igual en los 5 HTML (${set[0]})`);
};
iguales(tema, 'tema.css?v'); iguales(datos, 'datos.js?d');

console.log('4) Otros archivos');
const man = leer('manifest.webmanifest');
if (man != null) { try { JSON.parse(man); ok('manifest.webmanifest es JSON válido'); } catch (e) { mal('manifest.webmanifest no es JSON válido: ' + e.message, 'manifest.webmanifest'); } }

console.log('');
if (errores) { console.log(`✕ ${errores} error(es)${avisos ? ' y ' + avisos + ' aviso(s)' : ''}. Revisalo antes de que lo usen.`); process.exit(1); }
console.log(`✓ Todo bien${avisos ? ' (' + avisos + ' aviso(s) para mirar)' : ''}.`);
