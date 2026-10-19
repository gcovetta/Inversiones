// ─── 🩺 Registro de errores (captura desde el primer momento; se guarda en Supabase al terminar la carga) ───
var _ERR_Q=[],_ERR_N=0;
function _errAnotar(msg,src,ctx){
  try{
    msg=String(msg||'').slice(0,300);if(!msg)return;
    if(/^(chrome|moz|safari)(-web)?-extension:/.test(String(src||'')))return;
    if(/^Script error\.?$|Failed to fetch|NetworkError|Load failed|network error|AbortError|The user aborted|ResizeObserver loop/i.test(msg))return;
    if(window._errGuardando)return;
    if(++_ERR_N>25)return;
    var pg=(document.querySelector('.page.active')||{}).id||'';
    _ERR_Q.push({ts:Date.now(),msg:msg,src:String(src||'').replace(/^https?:\/\/[^\/]+/,'').replace(/\?[^:]*/,'').slice(0,120),ctx:String(ctx||'').slice(0,60),pag:pg.replace('page-',''),dev:/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)?'cel':'pc',ver:(typeof APP_VERSION!=='undefined'?APP_VERSION:null)});
    if(typeof _errProgramar==='function')_errProgramar();
  }catch(e){}
}
window.addEventListener('error',function(e){if(e&&e.message)_errAnotar(e.message,(e.filename||'')+':'+(e.lineno||'')+':'+(e.colno||''),'error');});
window.addEventListener('unhandledrejection',function(e){var r=e&&e.reason;_errAnotar(r&&r.message?r.message:String(r),r&&r.stack?String(r.stack).split('\n')[1]:'','promesa');});
(function(){var w=console.warn;console.warn=function(){try{for(var i=0;i<arguments.length;i++){var a=arguments[i];if(a instanceof Error){_errAnotar(a.message,a.stack?String(a.stack).split('\n')[1]:'',typeof arguments[0]==='string'?arguments[0]:'aviso');break;}}}catch(e){}return w.apply(console,arguments);};})();
// ─── Ajustes para celular (sin scroll horizontal, menú compacto, todo un poco más chico) ───
(function(){try{var st=document.createElement('style');st.id='mobile-fix-css';st.textContent="@media(max-width:680px){\n  html{font-size:14px}\n  .panels-grid{grid-template-columns:minmax(0,1fr)!important}\n  .panels-grid>*{min-width:0}\n  #panels-grid .panel-table table{min-width:0!important;width:100%!important}\n  #panels-grid .tw{overflow-x:hidden!important}\n  .main:not(.sidebar-open) .sidebar{display:none!important}\n  .main.sidebar-open .sidebar{display:flex!important;flex-direction:column!important;position:fixed!important;left:8px;right:8px;top:64px;max-height:72vh;overflow-y:auto!important;overflow-x:hidden!important;z-index:9000;border:1px solid var(--border2)!important;border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,.6);padding:.3rem 0!important;width:auto!important}\n  .sidebar>div:not(.nav-sec){display:none!important}\n  .main.sidebar-open .nav-item{width:100%!important;flex-direction:row!important;justify-content:flex-start!important;font-size:.85rem!important;padding:.7rem 1rem!important;gap:10px!important}\n  .nav-item>div{display:none!important}\n  #port-summary-section{gap:8px!important}\n  #port-summary-section>div{flex:1 1 100%!important;width:auto!important;min-width:0;max-width:100%}\n  #port-summary-section>div[style*=\"grid-template-columns:1fr 1fr 1fr\"]{grid-template-columns:repeat(3,minmax(0,1fr))!important}\n  #port-summary-section>div[style*=\"flex-direction:column\"][style*=\"width:155px\"]{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))}\n  #port-summary-section>div[style*=\"flex:1;flex-wrap:wrap\"]{flex-wrap:nowrap!important}\n  #port-summary-section>div[style*=\"flex:1;flex-wrap:wrap\"]>div{flex:1 1 50%!important;min-width:0!important;padding:.3rem!important}\n  #port-summary-section>div[style*=\"flex:1;flex-wrap:wrap\"]>div>div{height:150px!important}\n  #port-summary-section .metric{padding:.5rem .6rem}\n  #top-cards-row>.card{flex:1 1 100%!important}\n  #port-watchzone-section{flex-direction:column!important}\n  #port-watchzone-section>*{flex:1 1 auto!important;width:auto!important;min-width:0!important}\n  #pos-footer-bar{position:static!important;box-shadow:none!important;padding:.35rem .6rem!important}\n  #pos-footer-bar .qty-toggle{font-size:.6rem!important}\n  #claude-version-badge{font-size:.55rem!important;padding:2px 6px!important;opacity:.75;bottom:4px!important;right:4px!important}\n}\n";(document.head||document.documentElement).appendChild(st);}catch(e){}})();
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════

// ─── Versión de la app (única para los 5 portafolios) ───────────────────────
var APP_VERSION=242, APP_VERSION_FECHA='20/10/2026';
var APP_CHANGELOG=[
  'v242 | 2026-10-20 | Comparación con Bull: ahora reconoce tickers de una sola letra (ej. O · Realty Income). Antes el lector pedía al menos 2 letras y lo salteaba.',
  'v241 | 2026-10-19 | Vista familiar: de las operaciones de los últimos 30 días solo se publica la cantidad y el total operado en USD (sin detalle de activos ni compras/ventas).',
  'v240 | 2026-10-19 | La vista familiar (lo que ven Hilda, Omar y los demás) ahora recibe las operaciones de los últimos 30 días en USD: cantidad, compras, ventas y el detalle por día y activo.',
  'v239 | 2026-10-19 | Rotaciones: resumen arriba con las 5 que más sumaron y las 5 que más restaron (tocando una te lleva a su detalle).',
  'v238 | 2026-10-19 | Rotaciones: el resultado ahora suma lo cobrado desde la rotación en los dos lados (cupones y amortizaciones de bonos según sus flujos, p. ej. AO29 mensual, y dividendos cargados). En el detalle se ve cuántos cobros y cuánto.',
  'v237 | 2026-10-19 | Nueva sección ↔ Rotaciones (en el menú, debajo de Movimientos): detecta sola cuando vendiste algo y en los 5 días siguientes compraste otra cosa con esa plata, y muestra si la rotación te sumó (lo comprado hoy vs. lo vendido si te lo quedabas, en USD). Tocando una fila se ve el detalle; ✕ para descartar una que no fue rotación.',
  'v236 | 2026-10-16 | GDC vuelve a guardar sus datos del navegador con su prefijo propio (ptNYSE_; desde hace un tiempo usaba "undefined" y quedaban duplicados). La primera vez que abrís GDC se mudan solos y se borra la copia vieja: libera ~2 MB. Además, aviso en ⚠️ si el espacio del navegador pasa del 80%.',
  'v235 | 2026-10-16 | "Desde tu última visita": ahora también aparece si dejás la cartera abierta en una pestaña y volvés a mirarla después de 30 minutos (antes solo contaba como visita nueva al abrir la página de cero, por eso en GDC casi nunca salía).',
  'v234 | 2026-10-16 | Movimientos: siempre del más nuevo al más viejo. Antes las fechas con día o mes de un dígito (ej. 1/10) quedaban mal ordenadas, y dentro del mismo día el orden era el de carga al revés; ahora el último cargado va primero.',
  'v233 | 2026-10-15 | Portafolio: nuevo recuadro al lado de los filtros con el % de la cartera en Bono CER, Bono HD (dólares), RV y Otros (pesos a tasa, dólar linked, FCI). Pasando el mouse se ve el monto en USD.',
  'v232 | 2026-10-15 | El resumen que lee el index ahora incluye cuánto se operó en los últimos 30 días (compras y ventas en USD, todas las carteras de la persona).',
  'v231 | 2026-10-15 | Dividendos más seguros: antes de guardar se mira la nube y, si otro equipo cargó cobros que acá no están, se suman en lugar de pisarse. Además nunca se sube una lista vacía si en la nube hay más de un cobro (protege contra borrados por una carga fallida).',
  'v230 | 2026-10-15 | Arreglo importante: las marcas (Comprar / Vender / Seguir / nota) se pedían a la nube antes de iniciar sesión, así que la app arrancaba sin marcas y al poner una nueva se borraban las anteriores. Ahora se cargan después de iniciar sesión y, al guardar, se combinan con lo que hay en la nube: un cambio en el celular ya no pisa las marcas puestas en la PC.',
  'v229 | 2026-10-15 | Nuevo gráfico 🧭 Línea de vida financiera al final del Portafolio (cerrado; se abre tocando el título): lo que entra por año hasta el último vencimiento. Muestra la renta (cupones + dividendos) y el capital que vuelve (amortizaciones y vencimientos), con una marca en el último pago de cada bono u ON.',
  'v228 | 2026-10-14 | Arreglo: en GDC y Ana aparecía el error "Cannot read properties of null (trkCalcCCL)" al actualizarse el CCL, porque esas carteras no tienen la calculadora de CCL implícito. Ahora se saltea si la calculadora no está.',
  'v227 | 2026-10-13 | GDC · Simulador de retiro: nuevo recuadro 💼 Sueldo de la cartera. Muestra la renta mensual sin vender nada (cupones + dividendos), el retiro que no achica el capital, el retiro que dura 30 años y cuánto haría falta para tu meta. Incluye un gráfico de lo que entra mes a mes en los próximos 12 meses y botones para probar cada monto en el simulador.',
  'v226 | 2026-10-13 | Nuevo recuadro 📊 ¿Cara o barata? en el Portafolio: para cada acción de EE.UU. (y Cedear) muestra el P/E de hoy contra su mediana de 5 años (barata / normal / cara), el rango de 52 semanas y cuánto está abajo del máximo. También aparece al abrir una fila y en el Modo foco. Datos de Finnhub, una vez por día.',
  'v225 | 2026-10-13 | El botón ⇔ "Cargar posiciones actuales en Comparación" aparece en la barra de las 5 carteras (antes solo en GDC; en las otras quedaba escondido).',
  'v224 | 2026-10-13 | Guardado seguro también en movimientos y dividendos (se actualizan las filas y después se borran las sobrantes: la nube nunca queda vacía si se corta la conexión) y en la sincronización GDC → Omar/Ana. Si una tabla no lo admite, vuelve solo al método anterior.',
  'v223 | 2026-10-13 | Revisión general: (1) los proxies gratuitos caídos (allorigins, codetabs, corsproxy) ya no se reintentan en cada carga: si fallan se saltean 6 h (antes cada uno esperaba 7–12 s); (2) el RSI se calcula con el historial de data912 (sin proxy) y los que no se consiguen se reintentan a las 12 h; (3) el historial se pide una sola vez (antes 3 a la vez); (4) guardar configuración es una sola operación (antes borrar + insertar, con riesgo de perder el dato si fallaba en el medio); (5) se borra código de la vista vieja (toggles de columnas, orden de tablas, estilos) y fetchSPYHist.',
  'v222 | 2026-10-13 | Se elimina VetaMovim del Laboratorio (pantalla y código), no se usaba. La importación de Veta en Dividendos CCL sigue igual.',
  'v221 | 2026-10-13 | Fotos de perfil livianas: versiones de 128 px en webp (~4 KB cada una en vez de 30 a 400 KB).',
  'v220 | 2026-10-13 | El resumen para el index suma los cobros de los próximos 12 meses (con la parte de capital) para la nueva pestaña Cobros. Historial de precios: un cambio de ratio del Cedear (ej. SPY el 29/05/2026) ya no se ve como una caída del 66%; se reescala lo anterior (afecta Modo foco, gráfico de precios y comparación con el S&P).',
  'v219 | 2026-10-13 | (1) Abre sin señal y más rápido: el service worker guarda en el equipo los archivos con versión (código, datos y librerías) y la última copia de cada página; sin conexión se ve lo último guardado. (2) 🩺 Registro de errores: los errores de la app se guardan solos en Supabase (config "errores", con versión, equipo y pantalla) y aparece un aviso ⚠️ junto a la hora de actualización para verlos. (3) Los HTML cargan portafolio.min.js (versión compacta generada con tools/minificar.js).',
  'v218 | 2026-10-13 | Carga más rápida: (1) la carga desde Supabase corre una sola vez (antes 3 veces: 68 consultas → ~25, y sin riesgo de que se pisen guardados); (2) la configuración llega en una sola consulta y movimientos/dividendos en paralelo; (3) Chart.js se baja después de mostrar la cartera; (4) tablas fijas (CCL/MEP históricos, ratios, flujos de bonos) pasan a comun/datos.js, que queda en caché entre versiones; (5) al abrir se muestra al instante la última visita guardada en el navegador mientras llegan los datos nuevos.',
  'v217 | 2026-10-12 | Más liviana al abrir: la librería de Excel (SheetJS, ~860 KB) ya no se carga al abrir el portafolio. Se baja sola al entrar a una pantalla con importación (Movimientos, Dividendos CCL, Ratios, Comparación, Venta histórica) o, como mucho, al elegir el archivo; la importación funciona igual.',
  'v216 | 2026-10-12 | Limpieza 3 (más liviana, sin cambios visibles): el cálculo del Portafolio ya no arma la tabla de la vista vieja que nadie veía (render ~20% más rápido, mismos datos), se borran 52 funciones sin uso (lista de seguimiento, toggles de columnas, PIN viejo del tracker, etc.), los comentarios del código, ~6,5 KB de CSS sin uso en cada HTML y la consulta a Supabase de la lista de seguimiento que se hacía en cada carga.',
  'v215 | 2026-10-12 | GDC Modo foco: recuadro Dividendos/Rentas cobrados desde que lo tenés (USD, % de lo invertido, cantidad y último cobro) y comparación con su referencia (S&P 500 o EWZ para Brasil): línea punteada en el gráfico en la misma escala y si le ganaste en el período elegido.',
  'v214 | 2026-10-12 | GDC: Modo foco suma "Lo tenés desde" (fecha de la primera compra de la tenencia actual, cuánto tiempo y promedio ponderado de tus compras). Las noticias de Modo foco y de Explicame se muestran traducidas al castellano (el original queda al pasar el mouse).',
  'v213 | 2026-10-12 | GDC: Tu cartera ideal se puede colapsar tocando el título y arranca colapsada (muestra solo el desvío y cuántos grupos están en rango).',
  'v212 | 2026-10-12 | GDC: 🔍 Modo foco (tocando el ticker: gráfico en USD con tus compras/ventas, PPC y P. Venta, datos clave, historia de la posición con cobros, noticias y nota editable, botones Comprar/Vender) y 🎯 Tu cartera ideal (% objetivo por grupo editable, guardado en Supabase config cartera_ideal; desvío y movimientos sugeridos con botón cargar).',
  'v211 | 2026-10-12 | Vista nueva: el Calendario de ganancias queda alineado con el recuadro de Comprar/Vender (misma altura, arriba a la par) y el título en la letra de los demás recuadros.',
  'v210 | 2026-10-12 | Fix celular: con la vista nueva el Portafolio quedaba en blanco en pantallas chicas (la vista simple del celular y la vista nueva se ocultaban mutuamente). Ahora en el celular abre la Vista simple y "Ver todo" muestra la vista nueva.',
  'v209 | 2026-10-12 | Vista nueva: el Calendario de ganancias queda bajo y a lo ancho (cuadritos a la izquierda, título y números a la derecha), para no estirar la fila de Comprar/Vender.',
  'v208 | 2026-10-12 | GDC: ❓ Explicame este movimiento — en los activos que se movieron ±3% o más hoy (columna Hoy) y en los grupos de "Cómo se movió hoy", un ? que muestra el motivo probable (resultados, recomendación, fusión, dividendo…) con los titulares de Finnhub de los últimos 3 días y el contexto del grupo e índice. Argentina/bonos/ON: contexto del Merval/CCL + Google Noticias. Sin IA.',
  'v207 | 2026-10-12 | Vista nueva: el Calendario de ganancias va al lado del panel Comprar/Vender (abajo si no entra).',
  'v206 | 2026-10-12 | Vista nueva: el panel Comprar/Vender ocupa solo el ancho que necesita.',
  'v205 | 2026-10-12 | Vista nueva: 🗺️ Cómo se movió hoy — un recuadro por grupo (USA, Brasil, Argentina, Bonos, ONs, Europa, China, Cripto, FCI) con su variación del día en USD ponderada, el monto, mini mapa de calor, el que más subió/bajó y su referencia (S&P/Nasdaq, EWZ, Merval/CCL, Bitcoin) con si le ganaste o no; tocando un grupo se abre la lista de sus activos. Va al final, arriba del Plan de salida. Solo GDC.',
  'v204 | 2026-10-12 | Vista nueva (GDC): 🏖️ Plan de salida al final — renta anual de la cartera actual (cupones de bonos/ON de los próximos 12 meses + dividendos de los últimos 12 meses de lo que tenés) contra un objetivo editable (config plan_salida, por defecto USD 100.000/año), con barra de progreso, faltante, rendimiento por renta y capital necesario.',
  'v203 | 2026-10-11 | Vista nueva: Calendario de ganancias más compacto (el texto se acomoda al ancho de las semanas; mínimo 8 semanas visibles).',
  'v202 | 2026-10-11 | Vista nueva: el Calendario de ganancias ocupa solo el ancho que necesita.',
  'v201 | 2026-10-11 | Vista nueva: 🌡 Termómetro de la cartera (eufórica / neutral / deprimida según % en verde hoy, cerca del P. Venta y RSI≥70); 🌙 Repaso nocturno (tarjetas de a un activo con marcas y nota, teclado → C V S N Esc); 📅 Calendario de ganancias de los últimos 12 meses (verde/rojo por día, descontando aportes y retiros).',
  'v200 | 2026-10-11 | Vista nueva: etiqueta 🏷 al lado de cada ticker para marcar 🟢 Comprar / 🔴 Vender / ⭐ Seguir y/o dejar una nota (se ve al lado del ticker; completa al pasar el mouse). Se guarda en Supabase. Filtro 🏷 Marcados. Ahora se puede guardar solo la nota, sin tipo (📝).',
  'v199 | 2026-10-11 | Vista nueva: selector $ / US$ junto al buscador para ver la tabla (precio, PPC, inversión y totales de sección) en pesos o en dólares (CCL para acciones/Cedears, MEP para bonos/ON/FCI).',
  'v198 | 2026-10-11 | Vista nueva: marcas D (dividendo estimado en 30 días según tu historial) y 🏁 (A finish) al lado del ticker, con explicación al pasar el mouse o tocar.',
  'v197 | 2026-10-11 | Vista nueva: columna Hoy con la variación del día de cada activo (▲ verde / ▼ rojo), ordenable.',
  'v196 | 2026-10-11 | Vista nueva: marca F al lado del ticker para los bonos/ON que cobran en los próximos 30 días; pasando el mouse (o tocándola) muestra fecha y monto del próximo cobro.',
  'v195 | 2026-10-11 | Fix (v193): en las carteras sin lista "en la mira" guardada (Ana, Hilda, Juli, Omar) la carga se cortaba a mitad de camino (wlLoad vacío devolvía nada) — no cargaba liquidez, Inv. Inicial ni precios hasta tocar Actualizar.',
  'v194 | 2026-10-11 | Omar: recuadro % USD con ⚙️ para elegir activos dolarizados, como en las otras carteras.',
  'v193 | 2026-10-11 | Limpieza 2: se borra el HTML de la vista anterior del Portafolio en las 5 carteras (resumen, zona de seguimiento, inversiones chicas, tablas por mercado, barra de columnas); lo que el cálculo todavía usa se crea vacío y oculto al cargar (nv-sink). Las funciones que solo dibujaban esa vista quedan vacías. Omar: la etiqueta de cartera activa pasa junto a Supabase/Sync.',
  'v192 | 2026-10-11 | Limpieza 1: el historial de cambios viejo sale del código (comun/CHANGELOG.md); se quita el changelog en comentario de los 5 HTML.',
  'v191 | 2026-10-11 | Vista nueva: cada ticker en una sola línea — columnas separadas Δ% · ΔUp · Precio · PPC · Inversión · % tipo (cada una ordenable); el P. Venta de la fila desplegada se edita en USD (como en la página P. Venta). Dos mitades solo desde 1500px de ancho.',
  'v190 | 2026-10-11 | Vista nueva: P. Venta editable en la fila desplegada (en el mismo valor que se muestra; Enter guarda, Escape cancela, vacío lo saca). Se guarda igual que en la página P. Venta (localStorage + Supabase) y se recalculan ΔUp y filtros.',
  'v189 | 2026-10-11 | Vista nueva: el aviso "Desde tu última visita" se muestra arriba, entre los recuadros de totales y los filtros (antes quedaba abajo, sobre Distribución/Evolución).',
  'v188 | 2026-10-11 | Ana, Hilda, Juli y Omar pasan a la vista nueva del portafolio (vistaNueva en cada HTML). Si la cartera no tiene % USD (Omar), ese recuadro no se muestra.',
  'v187 | 2026-10-11 | GDC pasa a la vista nueva del portafolio (PortafolioGDC.html con vistaNueva); la página de prueba ya no hace falta. Ana, Hilda, Juli y Omar siguen con la vista anterior.'
];
(function(){
  function setBadge(){var b=document.getElementById('claude-version-badge');if(!b)return;b.textContent='v'+APP_VERSION+' · '+APP_VERSION_FECHA;b.title=APP_CHANGELOG[0].split(' | ').slice(2).join(' | ');}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setBadge);else setBadge();
})();

// ─── Compatibilidad con la vista anterior (v193) ──────────────────────────────
(function(){var L=[["body-argentina","tbody"],["body-bonos","tbody"],["body-brasil","tbody"],["body-china","tbody"],["body-cripto","tbody"],["body-europa","tbody"],["body-fci","tbody"],["body-nyse","tbody"],["body-on","tbody"],["ccli-ars","input","text"],["ccli-resultado","div"],["ccli-usd","input","text"],["flujo-mini-content","div"],["m-divs","div"],["m-ganancia","div"],["m-rend","div"],["m-val","div"],["near-target-card","div"],["nt-grid","div"],["nt-input","input","number","4"],["nt-pct-label","span"],["nt-slider","input","range","4"],["panel-argentina","div"],["panel-argentina-meta","span"],["panel-bonos","div"],["panel-bonos-meta","span"],["panel-brasil","div"],["panel-brasil-meta","span"],["panel-china","div"],["panel-china-meta","span"],["panel-cripto","div"],["panel-cripto-meta","span"],["panel-europa","div"],["panel-europa-meta","span"],["panel-fci","div"],["panel-fci-meta","span"],["panel-nyse","div"],["panel-nyse-meta","span"],["panel-on","div"],["panel-on-meta","span"],["panels-grid","div"],["panual-toggle","input","checkbox"],["pfill","div"],["port-content","div"],["port-smallinv-section","div"],["port-summary-section","div"],["port-summary-toggle-btn","button"],["port-watchzone-section","div"],["port-watchzone-toggle-btn","button"],["pos-empty","div"],["pos-footer-bar","div"],["pos-prog","div"],["ptipo-toggle","input","checkbox"],["pventa-alert","div"],["pventa-toggle","input","checkbox"],["qty-toggle","input","checkbox"],["rebal-toggle","input","checkbox"],["ref-status","span"],["rsi-toggle","input","checkbox"],["si-grid","div"],["si-input","input","number","0.5"],["si-pct-label","span"],["si-slider","input","range","0.5"],["small-inv-card","div"],["stat-best-ticker","span"],["stat-best-val","span"],["stat-pos-ticker","span"],["stat-pos-val","span"],["stat-worst-ticker","span"],["stat-worst-val","span"],["watchlist-card","div"],["wl-comment","input","text"],["wl-list","div"],["wl-ticker","input","text"]];
 function mk(){if(!document.body)return;var box=document.getElementById('nv-sink');if(!box){box=document.createElement('div');box.id='nv-sink';box.style.display='none';document.body.appendChild(box);}var tb=null;
  L.forEach(function(x){if(document.getElementById(x[0]))return;var e;if(x[1]==='tbody'){if(!tb){tb=document.createElement('table');box.appendChild(tb);}e=document.createElement('tbody');tb.appendChild(e);}else{e=document.createElement(x[1]);if(x[2])e.type=x[2];if(x[3]!=null)e.value=x[3];box.appendChild(e);}e.id=x[0];});}
 if(document.body)mk();else document.addEventListener('DOMContentLoaded',mk);})();
// ─── Configuración por portafolio ──────────────────────────────────────────
var CFG=Object.assign({
  id:'gdc', nombre:'GDC',
  lsPrefix:'ptNYSE_',
  trkSuffix:'_gdc',
  supabaseUrl:'https://wstnseufzyavgdovrehu.supabase.co',
  supabaseKey:'',
  auth:true, allowedEmail:'gcovetta@gmail.com',
  dataVersion:'v19_ghost_fix',
  perfilDefault:'agresivo',
  sync:true,
  rsi:true,
  broker:'veta',
  brokerNombre:'Veta',
  wlKey:'wl_gdc_v1',
  periodoInicio:'01-01',
  historial:true
}, window.PORTFOLIO_CONFIG||{});
var PFX=CFG.lsPrefix||('pt'+String(CFG.id||'x')+'_');
// v236: hasta v235 GDC guardaba en el navegador con el prefijo "undefined" (se había perdido su prefijo "ptNYSE_").
// Una sola vez: se pasan esos datos (más nuevos) al prefijo correcto, pisando la copia vieja; después se borran los restos.
(function(){try{if(PFX!=='ptNYSE_')return;var ks=[],i,k;for(i=0;i<localStorage.length;i++){k=localStorage.key(i);if(k&&k.indexOf('undefined')===0&&k.length>9)ks.push(k);}
  var hecho=localStorage.getItem('ptNYSE_mig_pfx');
  ks.forEach(function(k){var v=localStorage.getItem(k);localStorage.removeItem(k);if(hecho||v==null)return;var nk='ptNYSE_'+k.slice(9);try{localStorage.removeItem(nk);localStorage.setItem(nk,v);}catch(e){}});
  if(!hecho)localStorage.setItem('ptNYSE_mig_pfx','1');}catch(e){}})();
// Aviso si el espacio del navegador (compartido por las 5 carteras y el index) pasa del 80% de lo habitual (~5 millones de caracteres).
setTimeout(function(){try{var n=0,i,k;for(i=0;i<localStorage.length;i++){k=localStorage.key(i);n+=k.length+(localStorage.getItem(k)||'').length;}
  if(n>4e6)_errAnotar('Espacio del navegador casi lleno: '+(n/1e6).toFixed(1).replace('.',',')+' millones de caracteres de ~5. Puede dejar de guardar copias locales.','almacenamiento');}catch(e){}},15000);

// ── Soporte coma como separador decimal ──────────────────────────────────
(function(){
  function convertNumInputs(root){
    (root||document).querySelectorAll('input[type="number"]').forEach(function(el){
      el.setAttribute('type','text');
      el.setAttribute('inputmode','decimal');
    });
  }
  document.addEventListener('input',function(e){
    var el=e.target;
    if(el.tagName!=='INPUT'||el.value.indexOf(',')===-1)return;
    if((el.getAttribute('oninput')||'').indexOf('fmtNumInput')!==-1)return;
    var p=el.selectionStart;
    el.value=el.value.replace(/,/g,'.');
    try{el.setSelectionRange(p,p);}catch(x){}
  },true);
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){convertNumInputs();});
  }else{convertNumInputs();}
  new MutationObserver(function(muts){
    muts.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)convertNumInputs(n);});});
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
// ════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════
var GH_TOKEN  = 'GITHUB_TOKEN_AQUI';
var GH_REPO   = 'gcovetta/Inversiones';
var GH_BRANCH = 'main';
var GH_WORKFLOW = 'sync.yml';

// ── Sync GDC → Ana + Omar via GitHub Actions ─────────────────────────────
// ── Sync de datos GDC → Omar + Ana ──────────────────────────────────────
var SYNC_OTHERS = [
  { name: 'Omar',  url: 'https://opbbnvfmgdmdsmbhmgsc.supabase.co', key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wYmJudmZtZ2RtZHNtYmhtZ3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDExNDYsImV4cCI6MjA5Mjg3NzE0Nn0.tpqr2XVrcJuwPsiuonFeBbUrRG7Vt9RzRzIv7uHDCng' },
  { name: 'Ana',   url: 'https://arxntlqhtrtskabzihlf.supabase.co',  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeG50bHFodHJ0c2thYnppaGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTEyMDMsImV4cCI6MjA5MjM2NzIwM30.q3qnU2rkLDF4xwaKXvu8FvknJBIbhxWj01GRzY6l4dg' },
  { name: 'Hilda', url: 'https://zqlpfvxgtxfnqztiudzc.supabase.co',  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbHBmdnhndHhmbnF6dGl1ZHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNzY0MDAsImV4cCI6MjA5Mzg1MjQwMH0.2ICcVeG1ed95T_ZVO-EwqQYP1HQi58l7DCGA5q45EE4' },
  { name: 'Juli',  url: 'https://ujgkiuqvehidcnbtwrqn.supabase.co',  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZ2tpdXF2ZWhpZGNuYnR3cnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NDEyODIsImV4cCI6MjA5NDExNzI4Mn0.RIFerRYa-jKzNOBv59bxeWAnzhtvSLSc1sdRR2-uRyk' }
];
if(!CFG.sync)SYNC_OTHERS=[];
document.addEventListener('DOMContentLoaded',function(){if(!CFG.sync){var b=document.getElementById('sync-btn');if(b)b.style.display='none';}});

var _sbOtherClients={};
async function sbTokenFor(url,key){
  try{
    if(!window.supabase||!window.supabase.createClient)return null;
    var c=_sbOtherClients[url]||(_sbOtherClients[url]=window.supabase.createClient(url,key));
    var r=await c.auth.getSession();var s=r&&r.data&&r.data.session;
    return (s&&s.user&&s.user.email===ALLOWED_EMAIL)?s.access_token:null;
  }catch(e){return null;}
}
async function _sbSetOther(baseUrl, apiKey, configKey, value) {
  try {
    var _tok = await sbTokenFor(baseUrl, apiKey);
    var headers = {
      'apikey': apiKey,
      'Authorization': 'Bearer ' + (_tok || apiKey),
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    };
    var _body=JSON.stringify({ key: configKey, value: JSON.stringify(value) });
    var ru=await fetch(baseUrl+'/rest/v1/config?on_conflict=key',{method:'POST',headers:Object.assign({},headers,{'Prefer':'resolution=merge-duplicates,return=minimal'}),body:_body});
    if(ru.ok)return true;
    if(!(ru.status===400||ru.status===409||ru.status===422))return false;
    await fetch(baseUrl + '/rest/v1/config?key=eq.' + encodeURIComponent(configKey), {
      method: 'DELETE', headers: headers
    });
    var r = await fetch(baseUrl + '/rest/v1/config', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ key: configKey, value: JSON.stringify(value) })
    });
    return r.ok;
  } catch(e) { return false; }
}

async function syncDataToOthers(statusCallback) {
  var cclOvr = await sbGetConfig('ccl_override');
  var mepOvr = await sbGetConfig('mep_override');

  var realTargets = {};
  Object.keys(TARGET_TABLE).forEach(function(t){ if(TARGET_TABLE[t]!=null) realTargets[t]=TARGET_TABLE[t]; });

  var tables = [
    { key: 'ratios',        value: Object.keys(RATIOS_TABLE).length ? RATIOS_TABLE : null },
    { key: 'targets',       value: Object.keys(realTargets).length ? realTargets : null },
    { key: 'rubros',        value: Object.keys(USER_RUBRO_TABLE).length ? USER_RUBRO_TABLE : null },
    { key: 'ccl_override',  value: cclOvr || CCL_TABLE },
    { key: 'mep_override',  value: mepOvr || MEP_TABLE }
  ];

  var errors = [];
  for (var pi = 0; pi < SYNC_OTHERS.length; pi++) {
    var p = SYNC_OTHERS[pi];
    if (statusCallback) statusCallback('Sincronizando datos → ' + p.name + '...');
    for (var ti = 0; ti < tables.length; ti++) {
      var t = tables[ti];
      if (!t.value || (typeof t.value === 'object' && Object.keys(t.value).length === 0)) continue;
      var ok = await _sbSetOther(p.url, p.key, t.key, t.value);
      if (!ok) errors.push(p.name + '/' + t.key);
    }
  }
  return errors;
}

var SYNC_HTML_ENABLED = false;

async function syncPortfolios() {
  if(!CFG.sync) return;
  var btn   = document.getElementById('sync-btn');
  var icon  = document.getElementById('sync-icon');
  var label = document.getElementById('sync-label');

  btn.disabled = true;
  icon.style.display = 'inline-block';
  icon.style.animation = 'spin360 1s linear infinite';
  label.textContent = 'Sync...';
  btn.style.borderColor = 'var(--amber)';
  btn.style.color = 'var(--amber)';

  var dataErrors = await syncDataToOthers(function(msg){ label.textContent = msg; });
  if (dataErrors.length) {
    console.warn('syncDataToOthers errores:', dataErrors);
    icon.style.animation = '';
    icon.textContent = '⚠';
    label.textContent = 'Parcial (' + dataErrors.length + ' error' + (dataErrors.length!==1?'es':'') + ')';
    btn.style.borderColor = 'var(--red)';
    btn.style.color = 'var(--red)';
    console.error('Detalle de errores de sync:', dataErrors.join(', '));
    setTimeout(function() {
      icon.textContent = '⟳';
      label.textContent = 'Sync';
      btn.style.borderColor = '#4a5568';
      btn.style.color = '';
      btn.disabled = false;
    }, 5000);
    return;
  }

  icon.style.animation = '';
  icon.textContent = '✓';
  label.textContent = 'Synced!';
  btn.style.borderColor = 'var(--accent)';
  btn.style.color = 'var(--accent)';
  var _resetSync = function() {
    icon.textContent = '⟳';
    icon.style.animation = '';
    label.textContent = 'Sync';
    btn.style.borderColor = '#4a5568';
    btn.style.color = '';
    btn.disabled = false;
  };

  if (!SYNC_HTML_ENABLED) { setTimeout(_resetSync, 4000); return; }

  // ── Sync HTML vía GitHub Actions (opcional, ver SYNC_HTML_ENABLED arriba) ──
  var token = GH_TOKEN;
  if (!token || token === 'GITHUB_TOKEN_AQUI') {
    token = prompt('GitHub Token para Sync HTML:');
    if (!token) { _resetSync(); return; }
  }
  GH_TOKEN = token.trim();
  label.textContent = 'Sync HTML...';

  var url = 'https://api.github.com/repos/' + GH_REPO +
            '/actions/workflows/' + GH_WORKFLOW + '/dispatches';
  try {
    var res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept':        'application/vnd.github+json',
        'Authorization': 'Bearer ' + GH_TOKEN,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type':  'application/json'
      },
      body: JSON.stringify({ ref: GH_BRANCH })
    });

    if (res.status === 204) {
      setTimeout(_resetSync, 4000);
    } else {
      var body = await res.json().catch(function(){ return {}; });
      throw new Error('HTTP ' + res.status + ': ' + (body.message || 'Error desconocido'));
    }
  } catch(e) {
    icon.style.animation = '';
    icon.textContent = '✗';
    label.textContent = 'Datos OK, HTML falló';
    btn.style.borderColor = 'var(--red)';
    btn.style.color = 'var(--red)';
    console.error('Sync HTML error:', e);
    setTimeout(_resetSync, 5000);
  }
}

// ════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════
var SUPABASE_URL = CFG.supabaseUrl;
var SUPABASE_KEY = CFG.supabaseKey||'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdG5zZXVmenlhdmdkb3ZyZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzU0MTYsImV4cCI6MjA5MTM1MTQxNn0.0mmKvfCM_HoBJjbIhFzM5TeKEc-LphQwEXNjHqV_CfU';

// ════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════
var ALLOWED_EMAIL = CFG.allowedEmail;
var sbAuth = CFG.auth ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
window._sbAccessToken = null;

function authSignInGoogle(){
  sbAuth.auth.signInWithOAuth({
    provider:'google',
    options:{redirectTo: window.location.origin + window.location.pathname}
  });
}

function authSignOut(){
  sbAuth.auth.signOut().then(function(){ window._sbAccessToken=null; location.reload(); });
}

function authUpdateUI(user){
  var box=document.getElementById('auth-user-box');
  var emailEl=document.getElementById('auth-user-email');
  if(box) box.style.display='flex';
  if(emailEl) emailEl.textContent=user.email;
}

async function authEnsureSession(){
  if(!CFG.auth){var _g=document.getElementById('auth-gate');if(_g)_g.style.display='none';return true;}
  var gate=document.getElementById('auth-gate');
  var errEl=document.getElementById('auth-gate-error');
  try{
    var res=await sbAuth.auth.getSession();
    var session=res&&res.data&&res.data.session;
    if(session&&session.user&&session.user.email===ALLOWED_EMAIL){
      window._sbAccessToken=session.access_token;
      if(gate) gate.style.display='none';
      authUpdateUI(session.user);
      return true;
    }
    if(session){
      if(errEl){errEl.textContent='Esa cuenta de Google no tiene acceso a este portfolio.';errEl.style.display='block';}
      await sbAuth.auth.signOut();
      window._sbAccessToken=null;
    }
  }catch(e){}
  // Sin señal (token vencido y no se puede renovar): si la sesión guardada en este equipo es la tuya, se muestra lo guardado.
  try{if(navigator.onLine===false){for(var _i=0;_i<localStorage.length;_i++){var _k=localStorage.key(_i);if(!/^sb-.*-auth-token$/.test(_k))continue;var _s=JSON.parse(localStorage.getItem(_k)||'null');var _u=_s&&(_s.user||(_s.currentSession&&_s.currentSession.user));if(_u&&_u.email===ALLOWED_EMAIL){if(gate)gate.style.display='none';window._sinSenal=true;return true;}}}}catch(e){}
  if(gate) gate.style.display='flex';
  var box=document.getElementById('auth-user-box');
  if(box) box.style.display='none';
  return false;
}

if(sbAuth)sbAuth.auth.onAuthStateChange(function(_event,_session){
  authEnsureSession().then(function(ok){
    if(ok && typeof window.initFromSupabase==='function') window.initFromSupabase();
  });
});

// ── Helpers REST Supabase ─────────────────────────────────────────────────

// ── Supabase Keepalive ─────────────────────────────────────────────────────
(function sbKeepalive(){
  var KEY = 'sb_keepalive_' + (SUPABASE_URL.match(/\/\/([^.]+)/)||[])[1];
  var last = 0;
  try{ last = parseInt(localStorage.getItem(KEY)||'0'); }catch(e){}
  var now = Date.now();
  if(now - last < 3 * 24 * 60 * 60 * 1000) return;
  fetch(SUPABASE_URL + '/rest/v1/config?limit=1', {
    headers: {'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY}
  }).then(function(r){
    if(r.ok){ try{ localStorage.setItem(KEY, String(now)); }catch(e){} }
  }).catch(function(){});
})();

function sbHeaders(){
  var token = window._sbAccessToken || SUPABASE_KEY;
  return {'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+token};
}

var _sbUpsertNo=false;
async function sbSetConfig(key, value){
  _sbCfgInv[key]=true;
  if(!_sbUpsertNo){try{
    var ru=await fetch(SUPABASE_URL+'/rest/v1/config?on_conflict=key',{method:'POST',headers:Object.assign({},sbHeaders(),{'Prefer':'resolution=merge-duplicates,return=minimal'}),body:JSON.stringify({key:key,value:value,updated_at:new Date().toISOString()})});
    if(ru.ok)return true;
    if(ru.status===400||ru.status===409||ru.status===422)_sbUpsertNo=true;else return false;
  }catch(e){console.warn('sbSetConfig error',key,e);return false;}}
  try{
    await fetch(SUPABASE_URL+'/rest/v1/config?key=eq.'+encodeURIComponent(key),{
      method:'DELETE', headers:sbHeaders()
    });
    var r=await fetch(SUPABASE_URL+'/rest/v1/config',{
      method:'POST',
      headers:Object.assign({},sbHeaders(),{'Prefer':'return=minimal'}),
      body:JSON.stringify({key:key, value:value, updated_at:new Date().toISOString()})
    });
    return r.ok;
  }catch(e){ console.warn('sbSetConfig error',key,e); return false; }
}

var _SB_CFG_PRE=['dividendos','ratios','ratios_meta','targets','rubros','ccl_override','mep_override','liquidez','vigilancia','inv_inicial','perf_target','vhist_movs','vhist_divs','vhist_aportes','dolz_extra','perfil_inversor','cartera_ideal','plan_salida','flujos_capital','papelera','sim_retiro','historial','saltos_ok','honorarios','marks','rendanual_periodos','errores'];
var _sbCfgP=null,_sbCfgTs=0,_sbCfgInv={};
function _sbCfgPrefetch(){
  _sbCfgInv={};_sbCfgTs=Date.now();
  _sbCfgP=fetch(SUPABASE_URL+'/rest/v1/config?select=key,value&key=in.('+_SB_CFG_PRE.join(',')+')',{headers:sbHeaders()})
    .then(function(r){return r.ok?r.json():null;})
    .then(function(d){if(!Array.isArray(d))return null;var m={};d.forEach(function(x){if(x&&x.key)m[x.key]=x.value;});return m;})
    .catch(function(){return null;});
}
async function _sbCfgDePrecarga(key){
  if(!_sbCfgP||_sbCfgInv[key]||_SB_CFG_PRE.indexOf(key)<0||Date.now()-_sbCfgTs>180000)return null;
  var m=await _sbCfgP;if(!m||_sbCfgInv[key])return null;
  if(!(key in m))return {v:null};
  var v=m[key];if(typeof v==='string'){try{v=JSON.parse(v);}catch(e){}}else if(v!=null){v=JSON.parse(JSON.stringify(v));}
  return {v:v==null?null:v};
}
async function sbGetConfig(key){
  var _pc=await _sbCfgDePrecarga(key);if(_pc)return _pc.v;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/config?key=eq.'+encodeURIComponent(key)+'&select=value',{headers:sbHeaders()});
    var d=await r.json();
    if(!d||!d[0]) return null;
    var val=d[0].value;
    if(typeof val==='string'){try{val=JSON.parse(val);}catch(e){}}
    return val;
  }catch(e){ return null; }
}

// Guardado de tablas (movimientos, trk_divs): primero se escriben/actualizan las filas (upsert por id) y recién
// después se borran las que sobran, así la nube nunca queda vacía si la conexión se corta en el medio.
// Si la tabla no admite upsert, vuelve al método anterior (borrar todo + insertar).
var _sbArrUpsertNo={};
async function sbSaveArray(table, arr){
  var n=(arr||[]).length;
  if(n&&!_sbArrUpsertNo[table]){try{
    var rowsU=arr.map(function(item,i){return{id:i+1,data:item,updated_at:new Date().toISOString()};});
    var up=await fetch(SUPABASE_URL+'/rest/v1/'+table+'?on_conflict=id',{method:'POST',headers:Object.assign({},sbHeaders(),{'Prefer':'resolution=merge-duplicates,return=minimal'}),body:JSON.stringify(rowsU)});
    if(up.ok){var dx=await fetch(SUPABASE_URL+'/rest/v1/'+table+'?id=gt.'+n,{method:'DELETE',headers:sbHeaders()});if(!dx.ok)throw new Error('DEL extra '+dx.status);return true;}
    if(up.status===400||up.status===409||up.status===422)_sbArrUpsertNo[table]=true;else throw new Error('UPS '+up.status);
  }catch(e){console.warn('sbSaveArray error',table,e);return false;}}
  try{
    var delRes=await fetch(SUPABASE_URL+'/rest/v1/'+table+'?id=gte.0',{method:'DELETE',headers:sbHeaders()});
    if(!delRes.ok) throw new Error('DEL '+delRes.status);
    if(!arr||!arr.length) return true;
    var rows=arr.map(function(item,i){return{id:i+1,data:item,updated_at:new Date().toISOString()};});
    var insRes=await fetch(SUPABASE_URL+'/rest/v1/'+table,{
      method:'POST',
      headers:Object.assign({},sbHeaders(),{'Prefer':'return=minimal'}),
      body:JSON.stringify(rows)
    });
    if(!insRes.ok) throw new Error('INS '+insRes.status);
    return true;
  }catch(e){ console.warn('sbSaveArray error',table,e); return false; }
}
async function sbSaveArrayRetry(table, arr, tries){
  tries = tries || 3;
  for(var i=0;i<tries;i++){
    var ok = await sbSaveArray(table, arr);
    if(ok) return true;
    if(i<tries-1) await new Promise(function(r){setTimeout(r, 1200*(i+1));});
  }
  return false;
}

async function sbLoadArray(table){
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/'+table+'?select=data&order=id.asc',{headers:sbHeaders()});
    if(!r.ok) return null;
    var d=await r.json();
    if(!Array.isArray(d)) return null;
    return d.map(function(row){return row.data;});
  }catch(e){ return null; }
}

var SB_STATUS = { ok: false };
async function sbPing(){
  try{
    var r = await fetch(SUPABASE_URL+'/rest/v1/config?limit=1',{headers:sbHeaders()});
    SB_STATUS.ok = r.ok;
  }catch(e){ SB_STATUS.ok=false; }
  var el=document.getElementById('sb-status');
  if(el){
    el.textContent = SB_STATUS.ok ? '🟢 Supabase conectado' : '🔴 Supabase sin conexión';
    el.style.color = SB_STATUS.ok ? 'var(--accent)' : 'var(--red)';
  }
}

// ════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════
var FKEY = 'd7ar4v9r01qtpbh9hs60d7ar4v9r01qtpbh9hs6g';
var FBASE = 'https://finnhub.io/api/v1';


function fmtKey(fecha){var p=fecha.split('/');return p[0].padStart(2,'0')+'/'+p[1].padStart(2,'0')+'/'+p[2];}
function getCCL(fecha){return CCL_TABLE[fmtKey(fecha)]||null;}
function getMEP(fecha){return MEP_TABLE[fmtKey(fecha)]||null;}
function getTC(fecha, mercado){
  var esBonoON=(mercado==='BONOS'||mercado==='ON'||mercado==='FCI');
  return esBonoON ? (getMEP(fecha)||getCCL(fecha)||MEP_HOY||CCL_HOY) : (getCCL(fecha)||CCL_HOY);
}
var _HOY_KEY=(function(){var d=new Date();return(d.getDate()<10?'0':'')+d.getDate()+'/'+(d.getMonth()<9?'0':'')+(d.getMonth()+1)+'/'+d.getFullYear();})();
function _tcUltimoValor(T){var hoy=_HOY_KEY.split('/').reverse().join(''),best=null,bk='';
  Object.keys(T||{}).forEach(function(k){var p=k.split('/');if(p.length!==3)return;var kk=p[2]+p[1].padStart(2,'0')+p[0].padStart(2,'0');if(kk<=hoy&&kk>bk&&T[k]>0){bk=kk;best=T[k];}});return best;}
var CCL_HOY=CCL_TABLE[_HOY_KEY]||_tcUltimoValor(CCL_TABLE)||1487;
var MEP_HOY=MEP_TABLE[_HOY_KEY]||_tcUltimoValor(MEP_TABLE)||CCL_HOY;
function tcRefrescarHoy(){
  CCL_HOY=CCL_TABLE[_HOY_KEY]||_tcUltimoValor(CCL_TABLE)||CCL_HOY;
  MEP_HOY=MEP_TABLE[_HOY_KEY]||_tcUltimoValor(MEP_TABLE)||MEP_HOY||CCL_HOY;
}
var BRL_HOY=5.80;
var BRL_TICKERS=new Set([]);

var movimientos = [];
var quotes = {};
var _quoteRunId=0;
function _stampQuote(ticker,source){
  var q=quotes[ticker];
  if(!q) return;
  q.source=source;q.runId=_quoteRunId;q.ts=Date.now();
}
function _quoteAgeTxt(ts){
  var s=Math.round((Date.now()-ts)/1000);
  if(s<5) return 'recién';
  if(s<60) return 'hace '+s+'s';
  var m=Math.round(s/60);
  if(m<60) return 'hace '+m+'m';
  var h=Math.round(m/60);
  return 'hace '+h+'h';
}
function quoteHealthDot(q){
  if(!q||q.price==null||!q.source) return '';
  var stale=q.runId!=null&&q.runId!==_quoteRunId;
  var colorVar=stale?'var(--red)':q.source==='data912'?'var(--accent)':q.source==='yahoo'?'var(--blue)':q.source==='finnhub'?'var(--orange)':'var(--blue)';
  var label=stale?'No se pudo refrescar en el último intento':q.source==='data912'?'Fuente: data912 (primaria)':q.source==='yahoo'?'Fuente: Yahoo Finance (fallback)':q.source==='finnhub'?'Fuente: Finnhub (fallback)':'Fuente: CAFCI / ArgentinaDatos';
  var age=q.ts?_quoteAgeTxt(q.ts):'';
  var title=label+(age?' — '+(stale?'último precio conocido '+age:'actualizado '+age):'');
  return '<span class="qhelp" style="width:6px;height:6px;border-radius:50%;margin-left:5px;vertical-align:middle;background:'+colorVar+(stale?';animation:pulse 1.4s infinite':'')+'"><span class="qhelp-tip">'+title.replace(/</g,'&lt;')+'</span></span>';
}
var RSI_CACHE = {};
var TIR_CACHE = {};

var RATIOS_TABLE_DEFAULT = Object.assign({}, RATIOS_TABLE);
var BYMA_TO_NYSE = {'DISN':'DIS'};
function getRatio(ticker){return RATIOS_TABLE[BYMA_TO_NYSE[ticker]||ticker]||1;}

var SECTOR_MAP = {
  'A3':'argentina','AGRO':'argentina','BHIP':'argentina','BIOX':'argentina','BOLT':'argentina','CADO':'argentina','CAPX':'argentina','CARC':'argentina','CECO2':'argentina','CELU':'argentina','COME':'argentina','CTIO':'argentina','DGCE':'argentina','EDN':'argentina','FERR':'argentina','FIPL':'argentina','GLOB':'argentina','HARG':'argentina','LONG':'argentina','METR':'argentina','MIRG':'argentina','MOLI':'argentina','OEST':'argentina','PATA':'argentina','TXAR':'argentina','ALUA':'argentina','TGSU2':'argentina',
  'BC37D':'bonos','CUAP':'bonos','DICP':'bonos','ERF25':'bonos','GD29':'bonos','GD38':'bonos','GD41':'bonos','PARP':'bonos','PBY26':'bonos','SA24D':'bonos','TVPA':'bonos','TX31':'bonos','TZXM7':'bonos','TZXS7':'bonos','TZXS8':'bonos','TZX28':'bonos',
  'CLSIO':'on','DNC3O':'on','MR37O':'on','LECAO':'on','LECHO':'on','MR36O':'on','MRCAO':'on','MRCPO':'on','MRCZO':'on','SNEAO':'on','TZV26':'on','TZV27':'on',
  'ADBE':'nyse','AMZN':'nyse','AVGO':'nyse','CRM':'nyse','DOCU':'nyse','FSLR':'nyse','HOG':'nyse','LAC':'nyse','META':'nyse','MSFT':'nyse','NFLX':'nyse','NKE':'nyse','NVDA':'nyse','TEAM':'nyse','UBER':'nyse','UNH':'nyse','UPST':'nyse','CCL':'nyse','LVS':'nyse','MCD':'nyse','ARCO':'nyse',
  'DEO':'europa','SPOT':'europa','STLA':'europa',
  'JD':'china',
  'IBIT':'cripto','COIN':'cripto','ETHA':'cripto',
  'ABEV':'brasil','EWZ':'brasil','GGB':'brasil','MELI':'brasil','NU':'brasil','PAGS':'brasil','SID':'brasil','STNE':'brasil','XP':'brasil',
  'AGE3':'fci',
};
var _MKT_TO_SECTOR={BONOS:'bonos',ON:'on',ARGENTINA:'argentina',BRASIL:'brasil',ETF:'nyse',USA:'nyse',FCI:'fci'};
function getSector(ticker){
  if(SECTOR_MAP[ticker])return SECTOR_MAP[ticker];
  for(var _i=movimientos.length-1;_i>=0;_i--){
    var _mv=movimientos[_i];
    if(_mv&&_mv.ticker===ticker&&_mv.mercado){
      return _MKT_TO_SECTOR[_mv.mercado]||'nyse';
    }
  }
  return 'nyse';
}

var BONOS_USD_DIRECTO_EXCEPCIONES=new Set(['BB37D','BC37D','SA24D']);
function isBonoUSDDirecto(ticker){
  if(getSector(ticker)!=='bonos')return false;
  if(BONOS_USD_DIRECTO_EXCEPCIONES.has(ticker))return false;
  return /[CD]$/.test(ticker);
}

// ── Próximos Cobros: calendario de renta/amortización de bonos y ON ──────
function _flujosHoyStr(){
  var d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function _flujosFechaLimiteStr(dias){
  var lim=new Date();lim.setHours(0,0,0,0);lim.setDate(lim.getDate()+dias);
  return lim.getFullYear()+'-'+String(lim.getMonth()+1).padStart(2,'0')+'-'+String(lim.getDate()).padStart(2,'0');
}
function _flujosDiasHasta(fechaISO){
  var hoy=new Date();hoy.setHours(0,0,0,0);
  var f=new Date(fechaISO+'T00:00:00');
  return Math.round((f-hoy)/86400000);
}
function _flujosFechaDDMM(fechaISO){
  var p=fechaISO.split('-');return p[2]+'/'+p[1]+'/'+p[0];
}
// ── TIR real (YTM) con el flujo exacto de FLUJOS_BONOS ───────────────────
function _xirrNPV(precio,flujos,hoyUTC,r){
  var total=-precio;
  for(var i=0;i<flujos.length;i++){
    var d=new Date(flujos[i].f+'T00:00:00Z');
    var t=(d-hoyUTC)/86400000/365;
    if(t<0) continue;
    total+=flujos[i].m/Math.pow(1+r,t);
  }
  return total;
}
function _xirrCalc(precio,flujos){
  if(!precio||precio<=0||!flujos||!flujos.length) return null;
  var hoy=new Date();
  var hoyUTC=new Date(Date.UTC(hoy.getFullYear(),hoy.getMonth(),hoy.getDate()));
  var lo=-0.9,hi=5.0;
  var flo=_xirrNPV(precio,flujos,hoyUTC,lo),fhi=_xirrNPV(precio,flujos,hoyUTC,hi);
  if(isNaN(flo)||isNaN(fhi)||flo*fhi>0) return null;
  for(var i=0;i<100;i++){
    var mid=(lo+hi)/2;var fm=_xirrNPV(precio,flujos,hoyUTC,mid);
    if(Math.abs(fm)<1e-9) return mid;
    if(flo*fm<0){hi=mid;fhi=fm;} else {lo=mid;flo=fm;}
  }
  return (lo+hi)/2;
}
var FLUJOS_ALIAS={'AO29C':'AO29','AO29D':'AO29'};
function flujoBase(t){if(FLUJOS_BONOS[t])return t;var b=FLUJOS_ALIAS[t]||(isBonoUSDDirecto(t)?t.slice(0,-1):null);return b&&FLUJOS_BONOS[b]?b:null;}
function flujoDe(t){var b=flujoBase(t);return b?FLUJOS_BONOS[b]:null;}
function calcularTIRReal(ticker){
  var tabla=flujoDe(ticker);
  if(!tabla) return null;
  var _b=flujoBase(ticker);
  if(_b!==ticker&&quotes[_b]&&quotes[_b].price!=null) return calcularTIRReal(_b);
  var q=quotes[ticker];
  if(!q||q.price==null) return null;
  var ratio=getRatio(ticker)||1;
  var precio;
  if(tabla.moneda==='USD'&&isBonoUSDDirecto(ticker)){
    precio=q.price*ratio;
  } else if(tabla.moneda==='USD'){
    var tc=MEP_HOY||CCL_HOY;
    if(!tc) return null;
    precio=q.price*ratio/tc;
  } else {
    precio=q.price*ratio;
  }
  if(!precio||precio<=0) return null;
  var hoyISO=_flujosHoyStr();
  var flujosFuturos=tabla.flujos.filter(function(x){return x.f>hoyISO;}).map(function(x){return {f:x.f,m:(x.r||0)+(x.a||0)};});
  if(!flujosFuturos.length) return null;
  var r=_xirrCalc(precio,flujosFuturos);
  return r==null?null:{tir:r*100,moneda:tabla.moneda};
}
function calcularCalendarioCobros(){
  var hoy=_flujosHoyStr();
  var pos=(typeof getPositionsPrincipal==='function'?getPositionsPrincipal():getPositions()).filter(function(p){return p.qty>0.000001;});
  var items=[],sinFlujo=[];
  pos.forEach(function(p){
    var tabla=flujoDe(p.ticker);
    var sector=getSector(p.ticker);
    if(!tabla){
      if(sector==='bonos'||sector==='on') sinFlujo.push(p.ticker);
      return;
    }
    var factor=p.qty/100;
    tabla.flujos.filter(function(fl){return fl.f>=hoy;}).forEach(function(fl){
      var renta=Math.round(fl.r*factor*100)/100;
      var amort=Math.round(fl.a*factor*100)/100;
      items.push({
        fecha:fl.f,ticker:p.ticker,moneda:tabla.moneda,
        renta:renta,amort:amort,total:Math.round((renta+amort)*100)/100
      });
    });
  });
  items.sort(function(a,b){return a.fecha<b.fecha?-1:a.fecha>b.fecha?1:a.ticker.localeCompare(b.ticker);});
  return {items:items,sinFlujo:sinFlujo,hoy:hoy};
}
function _flujosSumaEnRango(items,dias){
  var lim=_flujosFechaLimiteStr(dias);
  var tot={USD:0,ARS:0};
  items.forEach(function(it){if(it.fecha<=lim){tot[it.moneda]=(tot[it.moneda]||0)+it.total;}});
  return tot;
}
function _flujosFmtMoneda(mon,val){
  if(!val) return null;
  return mon+' '+val.toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2});
}
function _flujosFmtTotales(tot){
  var partes=[];
  if(tot.USD) partes.push(_flujosFmtMoneda('USD',tot.USD));
  if(tot.ARS) partes.push(_flujosFmtMoneda('ARS',tot.ARS));
  return partes.length?partes.join(' + '):'<span style="color:var(--text3)">—</span>';
}
function _flujosProximoGrupo(items){
  if(!items.length) return null;
  var fecha=items[0].fecha;
  return {fecha:fecha,items:items.filter(function(it){return it.fecha===fecha;})};
}
// ── Badge "D": estimación de próximo dividendo por historial (solo acciones/CEDEARs) ──────
function _parseFechaDDMMYYYY(s){
  if(!s) return null;
  var p=String(s).split('/');
  if(p.length!==3) return null;
  var d=new Date(p[2]+'-'+p[1].padStart(2,'0')+'-'+p[0].padStart(2,'0')+'T00:00:00');
  return isNaN(d.getTime())?null:d;
}
function _estimarProximoDividendo(fechasOrdenadas){
  if(!fechasOrdenadas.length) return null;
  var intervaloDias=365;
  if(fechasOrdenadas.length>=2){
    var diffs=[];
    for(var i=1;i<fechasOrdenadas.length;i++) diffs.push((fechasOrdenadas[i]-fechasOrdenadas[i-1])/86400000);
    intervaloDias=diffs.reduce(function(a,b){return a+b;},0)/diffs.length;
    if(intervaloDias<30) intervaloDias=30;
  }
  var hoy=new Date();hoy.setHours(0,0,0,0);
  var next=new Date(fechasOrdenadas[fechasOrdenadas.length-1].getTime());
  var guard=0;
  while(next<hoy&&guard<60){next=new Date(next.getTime()+intervaloDias*86400000);guard++;}
  return next;
}
function calcularDivHistUpcoming30(){
  var registros={};
  function agregar(ticker,fechaStr){
    var d=_parseFechaDDMMYYYY(fechaStr);
    if(!d||!ticker) return;
    (registros[ticker]=registros[ticker]||[]).push(d);
  }
  dividendos.forEach(function(x){agregar(x.ticker,x.fecha);});
  if(typeof TRK!=='undefined'&&TRK.divs&&TRK.divs.length){
    TRK.divs.forEach(function(x){if(x.estado!=='pendiente')agregar(x.ticker,x.fecha);});
  }
  var lim=new Date();lim.setHours(0,0,0,0);lim.setDate(lim.getDate()+30);
  var set=new Set();
  Object.keys(registros).forEach(function(ticker){
    var sector=getSector(ticker);
    if(sector==='bonos'||sector==='on') return;
    var fechas=registros[ticker].sort(function(a,b){return a-b;});
    var prox=_estimarProximoDividendo(fechas);
    if(prox&&prox<=lim) set.add(ticker);
  });
  return set;
}
function _flujosMapaProx30(cal){
  var lim=_flujosFechaLimiteStr(30);
  var map={};
  cal.items.forEach(function(it){
    if(it.fecha<=lim && !map[it.ticker]) map[it.ticker]=it;
  });
  return map;
}
function renderFlujosMiniResumen(cal){
  var el=document.getElementById('flujo-mini-content');
  if(!el) return;
  if(!cal.items.length){
    el.innerHTML='<span style="color:var(--text3)">Sin cobros de bonos/ON pendientes con flujo cargado.</span>';
    return;
  }
  var grupo=_flujosProximoGrupo(cal.items);
  var t30=_flujosSumaEnRango(cal.items,30);
  var t90=_flujosSumaEnRango(cal.items,90);
  function bloque(label,val,sub){
    return '<div><div style="color:var(--text3);font-size:.6rem;text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px">'+label+'</div>'+
      '<div style="font-weight:700;font-size:.95rem;color:var(--text);font-family:var(--mono)">'+val+'</div>'+
      (sub?'<div style="color:var(--text2);font-size:.68rem;margin-top:2px">'+sub+'</div>':'')+
    '</div>';
  }
  var proxSub=grupo.items.map(function(it){return it.ticker+' '+_flujosFmtMoneda(it.moneda,it.total);}).join(' · ');
  el.innerHTML=bloque('Próximo cobro',_flujosFechaDDMM(grupo.fecha)+' <span style="color:var(--text3);font-weight:400;font-size:.78rem">('+_flujosDiasHasta(grupo.fecha)+' días)</span>',proxSub)+
    bloque('Próximos 30 días',_flujosFmtTotales(t30))+
    bloque('Próximos 90 días',_flujosFmtTotales(t90));
}
function renderFlujosPage(){
  var cal=calcularCalendarioCobros();
  var elRes=document.getElementById('flujo-page-resumen');
  if(elRes){
    var grupo=_flujosProximoGrupo(cal.items);
    var t30=_flujosSumaEnRango(cal.items,30);
    var t90=_flujosSumaEnRango(cal.items,90);
    function card(label,val,sub){
      return '<div class="card" style="min-width:170px;flex:1;padding:.7rem 1rem">'+
        '<div style="color:var(--text3);font-size:.62rem;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">'+label+'</div>'+
        '<div style="font-family:var(--mono);font-size:1.05rem;font-weight:700">'+val+'</div>'+
        (sub?'<div style="color:var(--text3);font-size:.66rem;margin-top:3px;font-family:var(--mono)">'+sub+'</div>':'')+
      '</div>';
    }
    elRes.innerHTML=grupo
      ?card('Próximo cobro',_flujosFechaDDMM(grupo.fecha),'en '+_flujosDiasHasta(grupo.fecha)+' días · '+grupo.items.map(function(it){return it.ticker+' '+_flujosFmtMoneda(it.moneda,it.total);}).join(', '))+
       card('Próximos 30 días',_flujosFmtTotales(t30))+
       card('Próximos 90 días',_flujosFmtTotales(t90))
      :card('Próximo cobro','—','sin cobros pendientes');
  }
  var tbody=document.getElementById('flujo-page-tbody');
  if(tbody){
    if(!cal.items.length){
      tbody.innerHTML='<tr><td colspan="5" style="text-align:center;padding:16px;color:var(--text3)">No hay bonos/ON en cartera con flujo cargado.</td></tr>';
    } else {
      var lastFecha=null;
      tbody.innerHTML=cal.items.map(function(it){
        var esNuevaFecha=it.fecha!==lastFecha;lastFecha=it.fecha;
        var dias=_flujosDiasHasta(it.fecha);
        var tipo=it.amort>0?'<span style="font-size:.63rem;padding:1px 6px;border-radius:4px;background:rgba(68,138,255,.13);color:var(--blue)">Cupón+Amort.</span>':'<span style="font-size:.63rem;padding:1px 6px;border-radius:4px;background:rgba(0,230,118,.13);color:var(--accent)">Cupón</span>';
        var badgeDias='<span style="display:inline-block;background:'+(dias<=30?'rgba(0,230,118,.13)':'rgba(68,138,255,.13)')+';color:'+(dias<=30?'var(--accent)':'var(--blue)')+';border:1px solid '+(dias<=30?'var(--accent)':'var(--blue)')+';border-radius:5px;padding:1px 7px;font-size:.66rem;font-weight:700">'+dias+' días</span>';
        return '<tr style="'+(esNuevaFecha?'border-top:2px solid var(--border2)':'')+'">'+
          '<td class="mono" style="font-weight:700">'+(esNuevaFecha?_flujosFechaDDMM(it.fecha):'')+'</td>'+
          '<td>'+(esNuevaFecha?badgeDias:'')+'</td>'+
          '<td style="font-weight:700">'+it.ticker+'</td>'+
          '<td>'+tipo+'</td>'+
          '<td class="mono">'+_flujosFmtMoneda(it.moneda,it.total)+'</td>'+
        '</tr>';
      }).join('');
    }
  }
  var elWarn=document.getElementById('flujo-page-sinflujo');
  if(elWarn){
    elWarn.style.display=cal.sinFlujo.length?'':'none';
    if(cal.sinFlujo.length) elWarn.textContent='Tenés bonos/ON en cartera sin flujo cargado todavía: '+cal.sinFlujo.join(', ')+'. Pasame el flujo (formato Bull, 100 nominales) y lo agrego.';
  }
  try{renderCicloVida();}catch(e){console.warn('ciclo',e);}
}

var TICKER_MAP = {'DISN':'DIS','GGB':'GGB','MELI':'MELI','NU':'NU','PAGS':'PAGS','SID':'SID','XP':'XP','A3':'A3.BA','AGRO':'AGRO.BA','BHIP':'BHIP.BA','BIOX':'BIOX.BA','BOLT':'BOLT.BA','CADO':'CADO.BA','CAPX':'CAPX.BA','CARC':'CARC.BA','CECO2':'CECO2.BA','CELU':'CELU.BA','COME':'COME.BA','CTIO':'CTIO.BA','DGCE':'DGCE.BA','EDN':'EDN.BA','FERR':'FERR.BA','FIPL':'FIPL.BA','GLOB':'GLOB.BA','HARG':'HARG.BA','LONG':'LONG.BA','METR':'METR.BA','MIRG':'MIRG.BA','MOLI':'MOLI.BA','OEST':'OEST.BA','PATA':'PATA.BA','TXAR':'TXAR.BA'};
function getFinnhubTicker(ticker){if(BYMA_TO_NYSE[ticker])return BYMA_TO_NYSE[ticker];return TICKER_MAP[ticker]||ticker;}

var TARGET_TABLE = {"CLSIO": null,"LECAO": null,"LECHO": null,"MR36O": null,"MRCAO": null,"MRCPO": null,"MRCZO": null,"SNEAO": null,"TZV26": null,"TZV27": null, "BC37D": null,"CUAP": null,"DICP": null,"ERF25": null,"GD29": null,"GD38": null,"GD41": null,"PARP": null,"PBY26": null,"SA24D": null,"TVPA": null,"TX31": null,"TZXM7": null,"TZXS7": null,"TZXS8": null, "ADBE": 573, "AMZN": 258.6, "AVGO": null, "CRM": null, "DEO": null, "DOCU": null, "FSLR": null, "HOG": null, "IBIT": null, "JD": null, "LAC": null, "META": null, "MSFT": null, "NFLX": null, "NKE": null, "NVDA": null, "SPOT": null, "STLA": null, "TEAM": null, "UBER": null, "UNH": null, "UPST": null, "GGB": null, "MELI": null, "NU": null, "PAGS": null, "SID": null, "XP": null};
function getTarget(ticker){return TARGET_TABLE[ticker]||null;}

// ── Tipo de Cambio: CCL y MEP editables ──────────────────────────────────
function tcRender(){
  ['ccl','mep'].forEach(function(tipo){
    var table = tipo==='ccl' ? CCL_TABLE : MEP_TABLE;
    var body = document.getElementById('tc-'+tipo+'-body');
    if(!body) return;
    var filterEl = document.getElementById('tc-'+tipo+'-filter');
    var filterVal = filterEl ? filterEl.value.trim().toLowerCase() : '';
    var keys = Object.keys(table).sort(function(a,b){
      var pa=a.split('/'), pb=b.split('/');
      var da=new Date(pa[2],pa[1]-1,pa[0]), db=new Date(pb[2],pb[1]-1,pb[0]);
      return db-da;
    });
    if(filterVal){
      keys=keys.filter(function(k){
        return k.toLowerCase().includes(filterVal)||String(table[k]).includes(filterVal);
      });
    }
    body.innerHTML = keys.map(function(k){
      var t=tipo, f=k;
      return '<tr>'+
        '<td class="mono">'+f+'</td>'+
        '<td class="mono" style="text-align:right">'+
          '<input type="number" step="0.01" value="'+table[f]+'"'+
          ' style="width:80px;background:var(--bg);border:1px solid var(--border2);border-radius:4px;color:var(--text);font-family:var(--mono);font-size:.72rem;padding:2px 5px;height:24px;text-align:right"'+
          ' onchange="tcEdit(\''+t+'\',\''+f+'\',this.value)">'+
        '</td>'+
        '<td><button class="btn btn-d btn-sm" onclick="tcDel(\''+t+'\',\''+f+'\')">✕</button></td>'+
      '</tr>';
    }).join('');
  });
}
function tcSave(tipo){
  var fecha = document.getElementById('tc-'+tipo+'-fecha').value.trim();
  var valor = parseFloat(document.getElementById('tc-'+tipo+'-valor').value);
  if(!fecha||!valor) return;
  if(fecha.indexOf('-')>0){var p=fecha.split('-');fecha=p[2]+'/'+p[1]+'/'+p[0];}
  if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha)){alert('Fecha incompleta: usá dd/mm/aaaa');return;}
  fecha=fmtKey(fecha);
  if(tipo==='ccl') CCL_TABLE[fecha]=valor;
  else MEP_TABLE[fecha]=valor;
  tcSavePersist();
  document.getElementById('tc-'+tipo+'-fecha').value='';
  document.getElementById('tc-'+tipo+'-valor').value='';
  tcRender();
}
function tcEdit(tipo,fecha,val){
  var v=parseFloat(val);
  if(!v) return;
  if(tipo==='ccl') CCL_TABLE[fecha]=v;
  else MEP_TABLE[fecha]=v;
  tcSavePersist();
}
function tcDel(tipo,fecha){
  if(!confirm('Eliminar '+fecha+' del '+tipo.toUpperCase()+'?')) return;
  if(tipo==='ccl') delete CCL_TABLE[fecha];
  else delete MEP_TABLE[fecha];
  tcSavePersist();
  tcRender();
}
function tcSavePersist(){
  try{
    localStorage.setItem((PFX+'ccl_override'),JSON.stringify(CCL_TABLE));
    localStorage.setItem((PFX+'mep_override'),JSON.stringify(MEP_TABLE));
  }catch(e){}
  _tcSbPersist();
}
var _tcOvrLoaded=false,_tcOvrPend=false;
function _tcSbPersist(){if(!_tcOvrLoaded){_tcOvrPend=true;return;}sbSetConfig('ccl_override',CCL_TABLE);sbSetConfig('mep_override',MEP_TABLE);}
function cardToggle(btn){
  var card=btn.closest('.card');
  var collapsed=card.classList.toggle('card-collapsed');
  btn.textContent=collapsed?'▸':'▾';
  if(card.getAttribute('data-persist')){try{localStorage.setItem(PFX+'col_'+card.id,collapsed?'1':'0');}catch(e){}}
  if(!collapsed&&card.id==='hist-card'&&typeof _histChart!=='undefined'&&_histChart){try{_histChart.resize();}catch(e){}}
}
function topCardPrep(card,flex){
  if(!card||card.getAttribute('data-persist'))return;
  card.setAttribute('data-persist','1');card.style.maxWidth='';card.style.marginBottom='0';card.style.flex=flex;card.style.minWidth='0';
  var h=card.querySelector('.card-header');
  if(h&&!h.querySelector('.card-toggle')){var b=document.createElement('button');b.className='card-toggle';b.textContent='▾';b.setAttribute('onclick','cardToggle(this)');h.appendChild(b);}
  var col=false;try{col=localStorage.getItem(PFX+'col_'+card.id)==='1';}catch(e){}
  if(col){card.classList.add('card-collapsed');var t=h&&h.querySelector('.card-toggle');if(t)t.textContent='▸';}
}
function topCardsRow(){
  var dc=document.getElementById('dist-card');if(!dc||!dc.parentNode)return null;
  var row=document.getElementById('top-cards-row');
  if(!row){row=document.createElement('div');row.id='top-cards-row';
    row.style.cssText='display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-start;margin-bottom:1rem';
    if(!document.getElementById('top-cards-css')){var st=document.createElement('style');st.id='top-cards-css';
      st.textContent='#top-cards-row>.card.card-collapsed{flex:0 1 auto!important}';document.head.appendChild(st);}
    dc.parentNode.insertBefore(row,dc);row.appendChild(dc);}
  topCardPrep(dc,'1 1 380px');
  return row;
}
// ─────────────────────────────────────────────────────────────────────────
function showPage(id,btn){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.nav-item').forEach(function(b){b.classList.remove('active');});
  document.getElementById('page-'+id).classList.add('active');
  if(['tracker','comparacion','ventahist','ventaestad','ratios','movimientos'].indexOf(id)>=0)_xlsxPrecargar();
  if(CFG.vistaNueva)document.body.classList.toggle('nv-port',id==='portafolio');
  if(id==='tipocambio') tcRender();
  if(btn)btn.classList.add('active');
  if(id==='tracker') initTracker();
  if(id==='dividendos') divPopulateSelect();
  if(id==='movimientos') resetMFechaHoy();
  if(id==='arbitraje') arbRender();
  if(id==='rotaciones') rotRender();
  if(id==='noticias') nwsLoad(false);
  if(id==='flujos') setTimeout(renderFlujosPage, 50);
  if(id==='portafolio'){ setTimeout(renderPortfolio, 50); setTimeout(vsellPopulateSelect, 50); setTimeout(vsellResetFecha, 50); setTimeout(vbuyResetFecha, 50); }
  if(id==='dashboard') setTimeout(renderDashboard, 50);
  if(id==='rubros') renderRubros();
  if(id==='vigilancia') vigRender();
  if(id==='recomendaciones'){ renderPerfilComparacion(); }
  if(id==='ventaestad'){ renderVentaEstadisticas(); }
  if(id==='ventahist'){ renderVentaHistorica(); }
  var main=document.getElementById('main');
  if(main){
    if(id==='portafolio') main.classList.remove('sidebar-open');
    else main.classList.add('sidebar-open');
  }
}

function isBonoONForm(){var mkt=document.getElementById('m-mkt');return mkt&&(mkt.value==='BONOS'||mkt.value==='ON');}
function onTipo(){
  var t=document.getElementById('m-tipo').value;
  var isA=t==='aporte';
  document.getElementById('row-normal').style.display=isA?'none':'';
  document.getElementById('row-aporte').style.display=isA?'':'none';
  document.getElementById('g-mkt').style.display=isA?'none':'';
  document.getElementById('g-ticker').style.display=isA?'none':'';
  document.getElementById('lbl-precio').textContent=t==='dividendo'?'Monto ARS':(isBonoONForm()?'Precio / 100N':'Precio ARS');
}

function resetMFechaHoy(){
  var el=document.getElementById('m-fecha');
  if(el){el.value=_hoyLocalISO();el.dataset.auto=el.value;fechaMarcar(el);}
}
resetMFechaHoy();
document.getElementById('m-fecha').addEventListener('change',function(){
  var fecha=this.value.split('-').reverse().join('/');
  var mkt=document.getElementById('m-mkt').value;
  var tc=getTC(fecha,mkt);
  if(tc){document.getElementById('m-ccl').value=tc;calcUSD();}
  updateTCLabel();
});
document.getElementById('m-mkt').addEventListener('change',function(){
  var fechaInput=document.getElementById('m-fecha').value;
  if(fechaInput){
    var fecha=fechaInput.split('-').reverse().join('/');
    var tc=getTC(fecha,this.value);
    if(tc){document.getElementById('m-ccl').value=tc;calcUSD();}
  }
  updateTCLabel();
  var t=document.getElementById('m-tipo').value;
  document.getElementById('lbl-precio').textContent=t==='dividendo'?'Monto ARS':(isBonoONForm()?'Precio / 100N':'Precio ARS');
  calcUSD();
});
document.getElementById('m-precio-ars').addEventListener('input',calcUSD);
document.getElementById('m-ccl').addEventListener('input',calcUSD);
document.getElementById('m-qty').addEventListener('input',calcUSD);
function updateTCLabel(){
  var lbl=document.getElementById('m-ccl-label');
  if(!lbl)return;
  var mkt=document.getElementById('m-mkt').value;
  var esBonoON=(mkt==='BONOS'||mkt==='ON'||mkt==='FCI');
  lbl.textContent=esBonoON?'MEP del día':'CCL del día';
}
function calcUSD(){
  var ars=parseFloat(document.getElementById('m-precio-ars').value);
  var ccl=parseFloat(document.getElementById('m-ccl').value);
  var qty=parseFloat(document.getElementById('m-qty').value)||0;
  var comPct=parseFloat(document.getElementById('m-comision').value)||0;
  var rt=getRatio(document.getElementById('m-ticker').value.trim().toUpperCase()||'');
  var arsCalc=isBonoONForm()?(ars/100):ars;
  if(document.getElementById('m-mkt').value==='FCI')qty=qty/1000;
  document.getElementById('m-precio-usd').value=(ars&&ccl)?(arsCalc*rt/ccl).toFixed(4):'—';
  var resumen=document.getElementById('row-calc-resumen');
  if(ars>0&&qty>0){
    var comAbs=qty*arsCalc*comPct/100;
    var totalARS=qty*arsCalc+comAbs;
    var totalUSD=(ccl&&ccl>0)?totalARS/ccl:null;
    document.getElementById('m-comision-abs').value=comAbs>0?'$'+comAbs.toLocaleString('es-AR',{maximumFractionDigits:0}):'$0';
    document.getElementById('m-total-ars').value='$'+totalARS.toLocaleString('es-AR',{maximumFractionDigits:0});
    document.getElementById('m-total-usd').value=totalUSD?'U$S '+totalUSD.toFixed(2):'—';
    if(resumen)resumen.style.display='';
  } else {
    if(resumen)resumen.style.display='none';
  }
}

function addMov(){
  var tipo=document.getElementById('m-tipo').value;
  var sel=document.getElementById('m-status');
  if(tipo==='aporte'){
    var monto=parseFloat(document.getElementById('m-monto').value);
    if(!monto||monto<=0){flash(sel,'Ingresa un monto',true);return;}
    movimientos.push({id:Date.now(),fecha:document.getElementById('m-fecha').value.split('-').reverse().join('/'),tipo:tipo,mercado:'—',ticker:'APORTE',qty:0,precioARS:monto,ccl:null,precioUSD:monto,comision:0,notas:''});
    (function(){var _cs=document.getElementById('m-cartera');if(_cs)movimientos[movimientos.length-1].cartera=_cs.value||'principal';})();
    saveAndRender();flash(sel,'Aporte registrado',false);return;
  }
  var ticker=document.getElementById('m-ticker').value.trim().toUpperCase();
  var fechaInput=document.getElementById('m-fecha').value;
  var fecha=fechaInput.split('-').reverse().join('/');
  var qty=parseFloat(document.getElementById('m-qty').value);
  var precioARSInput=parseFloat(document.getElementById('m-precio-ars').value);
  var mkt=document.getElementById('m-mkt').value;
  var precioARS=(mkt==='BONOS'||mkt==='ON')?(precioARSInput/100):precioARSInput;
  if(mkt==='FCI'&&!isNaN(qty))qty=qty/1000;
  var cclVal=parseFloat(document.getElementById('m-ccl').value)||getTC(fecha,mkt);
  var comisionPct=parseFloat(document.getElementById('m-comision').value)||0;
  if(!ticker){flash(sel,'Ingresa un ticker',true);return;}
  if(isNaN(qty)||qty===0){flash(sel,'Cantidad invalida',true);return;}
  if(isNaN(precioARSInput)||precioARSInput<0){flash(sel,'Precio invalido',true);return;}
  if(!cclVal||cclVal<=0){flash(sel,'⚠️ Sin CCL/MEP — revisá el tipo de cambio',true);return;}
  if((tipo==='compra'||tipo==='venta')&&(!fechaGuard(fecha,tipo)||!precioGuard(ticker,precioARSInput,fecha)))return;
  var ratio=getRatio(ticker);
  var precioUSD=cclVal?precioARS*ratio/cclVal:null;
  var comisionAbsoluta=(qty*precioARS*comisionPct/100);
  var finishEl=document.getElementById('m-finish');
  movimientos.push({id:Date.now(),fecha:fecha,tipo:tipo,mercado:mkt,ticker:ticker,qty:qty,precioARS:precioARS,ccl:cclVal,ratio:ratio,precioUSD:precioUSD,comision:comisionAbsoluta,comisionPct:comisionPct,notas:document.getElementById('m-notas').value,finish:finishEl&&finishEl.checked||false,loteMethod:(tipo==='venta'?'promedio':undefined)});
  (function(){var _cs=document.getElementById('m-cartera');if(_cs)movimientos[movimientos.length-1].cartera=_cs.value||'principal';})();
  saveAndRender();
  tcStampearFecha(fecha,(mkt==='BONOS'||mkt==='ON'||mkt==='FCI'),cclVal);
  ['m-qty','m-precio-ars','m-ccl','m-precio-usd','m-notas'].forEach(function(id){document.getElementById(id).value='';});
  resetMFechaHoy();
  if(finishEl)finishEl.checked=false;
  flash(sel,'Movimiento registrado',false);
}

function flash(el,msg,isErr){el.className=isErr?'emsg':'smsg';el.textContent=msg;setTimeout(function(){el.textContent='';},3000);}

// ── Importar movimientos en tabla ──────────────────────────────────────────
var _impMovRows=[];
function impMovToggle(){
  var body=document.getElementById('imp-mov-body');
  var arrow=document.getElementById('imp-mov-arrow');
  var open=body.style.display==='none';
  body.style.display=open?'':'none';
  arrow.textContent=open?'▾':'▸';
}
function _parseArgNum(s){
  if(!s&&s!==0)return NaN;
  s=String(s).trim().replace(/\$/g,'').replace(/\s/g,'');
  if(!s)return NaN;
  var hasDot=s.indexOf('.')>=0, hasCom=s.indexOf(',')>=0;
  if(hasDot&&hasCom){
    if(s.indexOf('.')<s.indexOf(','))s=s.replace(/\./g,'').replace(',','.');
    else s=s.replace(/,/g,'');
  } else if(hasCom){
    s=s.replace(',','.');
  } else if(hasDot){
    var parts=s.split('.');
    if(parts.length>=2&&/^\d+$/.test(parts[0])&&parts.slice(1).every(function(p){return /^\d{3}$/.test(p);})){
      s=parts.join('');
    }
  }
  return parseFloat(s);
}
function _normFecha(s){
  s=(s||'').trim();
  var parts=s.split('/');
  if(parts.length!==3)return null;
  var d=parts[0].padStart(2,'0');
  var m=parts[1].padStart(2,'0');
  var y=parts[2].length===2?'20'+parts[2]:parts[2];
  if(!/^\d{2}$/.test(d)||!/^\d{2}$/.test(m)||!/^\d{4}$/.test(y))return null;
  return d+'/'+m+'/'+y;
}
function _impPrecioRaro(r,filas){
  if(!(r.precioARSInput>0)||!r.ticker||(r.tipo!=='compra'&&r.tipo!=='venta'))return null;
  var f2=function(x){return '$'+x.toLocaleString('es-AR',{maximumFractionDigits:2});},ref=null,de='';
  var p=String(r.fecha||'').split('/');var reciente=p.length===3&&(Date.now()-new Date(p[2]+'-'+p[1].padStart(2,'0')+'-'+p[0].padStart(2,'0')))/86400000<=7;
  if(reciente){var m=_precioMercadoARS(r.ticker);if(m>0){ref=m;de='del mercado';}}
  if(!ref){var o=filas.filter(function(x){return x!==r&&x.ticker===r.ticker&&x.precioARSInput>0&&(x.tipo==='compra'||x.tipo==='venta');}).map(function(x){return x.precioARSInput;}).sort(function(a,b){return a-b;});
    if(o.length>=2){ref=o[Math.floor(o.length/2)];de='de tus otras filas de '+r.ticker;}}
  if(!ref)return null;
  var k=r.precioARSInput/ref;if(k>=0.75&&k<=1.33)return null;
  var pista=(k>0.0007&&k<0.0013)?' ¿Faltan los miles?':(k>700&&k<1300)?' ¿Sobran los miles?':(k>7&&k<13)||(k>70&&k<130)?' ¿Te sobró un cero?':(k>0.07&&k<0.13)||(k>0.007&&k<0.013)?' ¿Te faltó un cero?':'';
  return f2(r.precioARSInput)+' vs '+f2(ref)+' '+de+' ('+(k>1?'+':'')+Math.round((k-1)*100)+'%).'+pista;
}
function impMovParse(){
  var raw=document.getElementById('imp-mov-text').value;
  var preview=document.getElementById('imp-mov-preview');
  var tbody=document.getElementById('imp-mov-tbody');
  var label=document.getElementById('imp-mov-preview-label');
  _impMovRows=[];
  if(!raw.trim()){preview.style.display='none';return;}
  var validMkt=['USA','ETF','ARGENTINA','BONOS','ON','BRASIL','EUROPA','CHINA','CRIPTO'];
  var lines=raw.trim().split('\n').filter(function(l){return l.trim();});
  lines.forEach(function(line){
    var cols=line.split('\t');
    if(cols.length<4)cols=line.split(';');
    var fechaRaw=(cols[0]||'').trim();
    if(!/^\d/.test(fechaRaw))return;
    var fecha=_normFecha(fechaRaw);
    var tipo=(cols[1]||'').trim().toLowerCase();
    var mercado=(cols[2]||'').trim().toUpperCase();
    var ticker=(cols[3]||'').trim().toUpperCase();
    var qty=_parseArgNum(cols[4]);
    var precioARSInput=_parseArgNum(cols[5]);
    var ccl=cols[6]?(isNaN(_parseArgNum(cols[6]))?null:_parseArgNum(cols[6])):null;
    var comPct=cols[7]?(_parseArgNum(cols[7])||0):0;
    var notas=(cols[8]||'').trim();
    var errors=[];
    if(!fecha)errors.push('fecha (D/M/AA o DD/MM/AAAA)');
    if(['compra','venta','dividendo'].indexOf(tipo)<0)errors.push('tipo');
    if(validMkt.indexOf(mercado)<0)errors.push('mercado');
    if(!ticker)errors.push('ticker');
    if(isNaN(qty)||qty===0)errors.push('cantidad');
    if(isNaN(precioARSInput)||precioARSInput<0)errors.push('precio');
    _impMovRows.push({fecha:fecha||fechaRaw,tipo:tipo,mercado:mercado,ticker:ticker,qty:qty,precioARSInput:precioARSInput,ccl:ccl,comPct:comPct,notas:notas,ok:errors.length===0,errors:errors});
  });
  _impMovRows.forEach(function(r){if(r.ok){try{r.raro=_impPrecioRaro(r,_impMovRows);}catch(e){r.raro=null;}}});
  var okCount=_impMovRows.filter(function(r){return r.ok;}).length,nRaro=_impMovRows.filter(function(r){return r.raro;}).length;
  label.textContent=_impMovRows.length+' fila'+((_impMovRows.length!==1)?'s':'')+' · '+okCount+' válida'+(okCount!==1?'s':'')+' para importar'+(_impMovRows.length-okCount?' · '+(_impMovRows.length-okCount)+' con error':'')+(nRaro?' · ⚠ '+nRaro+' con precio raro':'');
  tbody.innerHTML=_impMovRows.map(function(r){
    var statusCell=r.ok
      ?(r.raro?'<span style="color:var(--amber,#eab308);font-size:.65rem">⚠ precio raro: '+r.raro+'</span>':'<span style="color:var(--accent)">✓</span>')
      :'<span style="color:var(--red);font-size:.65rem" title="'+r.errors.join(', ')+'">✕ '+r.errors.join(', ')+'</span>';
    return '<tr style="'+(r.ok?'':'opacity:.5')+'">'+
      '<td class="mono">'+r.fecha+'</td>'+
      '<td><span class="badge badge-'+(r.tipo||'compra')+'">'+r.tipo+'</span></td>'+
      '<td><span class="mkt">'+r.mercado+'</span></td>'+
      '<td style="font-weight:600">'+r.ticker+'</td>'+
      '<td class="mono">'+(isNaN(r.qty)?'—':r.qty)+'</td>'+
      '<td class="mono">'+(isNaN(r.precioARSInput)?'—':'$'+r.precioARSInput.toLocaleString('es-AR'))+'</td>'+
      '<td class="mono muted">'+(r.ccl?Math.round(r.ccl):'auto')+'</td>'+
      '<td class="mono muted">'+(r.comPct?r.comPct+'%':'0%')+'</td>'+
      '<td class="muted" style="max-width:80px;overflow:hidden;text-overflow:ellipsis">'+r.notas+'</td>'+
      '<td>'+statusCell+'</td>'+
    '</tr>';
  }).join('');
  preview.style.display='';
  var btn=document.getElementById('imp-mov-confirm-btn');
  if(btn)btn.disabled=(okCount===0);
}
function impMovConfirm(){
  var valid=_impMovRows.filter(function(r){return r.ok;});
  if(!valid.length)return;
  var raros=valid.filter(function(r){return r.raro;});
  if(raros.length&&!confirm('⚠ Revisá el precio de '+raros.length+' fila'+(raros.length>1?'s':'')+':\n\n'+raros.slice(0,8).map(function(r){return r.fecha+' '+r.ticker+': '+r.raro;}).join('\n')+(raros.length>8?'\n…':'')+'\n\n¿Importar igual?'))return;
  var base=Date.now();
  valid.forEach(function(r,i){
    var esBonoON=(r.mercado==='BONOS'||r.mercado==='ON');
    var precioARS=esBonoON?(r.precioARSInput/100):r.precioARSInput;
    var cclEff=r.ccl||getTC(r.fecha,r.mercado);
    var ratio=getRatio(r.ticker);
    var precioUSD=cclEff?precioARS*ratio/cclEff:null;
    var comAbsoluta=r.qty*precioARS*r.comPct/100;
    movimientos.push({id:base+i,fecha:r.fecha,tipo:r.tipo,mercado:r.mercado,ticker:r.ticker,qty:r.qty,precioARS:precioARS,ccl:cclEff,ratio:ratio,precioUSD:precioUSD,comision:comAbsoluta,comisionPct:r.comPct,notas:r.notas,finish:false});
  });
  saveAndRender();
  flash(document.getElementById('imp-mov-status'),valid.length+' movimiento'+(valid.length!==1?'s':'')+' importado'+(valid.length!==1?'s':''),false);
  document.getElementById('imp-mov-text').value='';
  document.getElementById('imp-mov-preview').style.display='none';
  _impMovRows=[];
}
function impMovCancel(){
  document.getElementById('imp-mov-text').value='';
  document.getElementById('imp-mov-preview').style.display='none';
  _impMovRows=[];
}

function deleteMov(id){
  var m=movimientos.find(function(x){return x.id==id;});
  if(!m)return;
  var label=m.ticker+(m.qty?' ('+m.qty+' u.)':'');
  if(!confirm('Borrar movimiento: '+m.tipo.toUpperCase()+' '+label+'?\n\nQueda 30 días en la Papelera (Movimientos) por si lo querés recuperar.'))return;
  papAgregar({k:'mov',acc:'borrado',d:m,desc:'Borrado: '+m.tipo+' '+label+' del '+m.fecha});
  movimientos=movimientos.filter(function(x){return x.id!=id;});
  saveAndRender();
}

function purgarTicker(){
  var filterEl=document.getElementById('mov-filter');
  var ticker=(filterEl?filterEl.value:'').trim().toUpperCase();
  if(!ticker){alert('Escribí un ticker en el filtro primero.');return;}
  var afectados=movimientos.filter(function(m){return (m.ticker||'').toUpperCase()===ticker;});
  if(!afectados.length){alert('No hay movimientos para '+ticker+'.');return;}
  var resumen=afectados.reduce(function(acc,m){acc[m.tipo]=(acc[m.tipo]||0)+1;return acc;},{});
  var detalle=Object.keys(resumen).map(function(t){return resumen[t]+' '+t+'(s)';}).join(', ');
  if(!confirm('⚠️ Borrar TODOS los movimientos de '+ticker+'?\n\n'+detalle+' — '+afectados.length+' total\n\nQuedan 30 días en la Papelera (Movimientos) por si los querés recuperar.'))return;
  papAgregar({k:'movs',acc:'borrado',d:afectados,desc:'Borrados todos los movimientos de '+ticker+' ('+afectados.length+')'});
  movimientos=movimientos.filter(function(m){return (m.ticker||'').toUpperCase()!==ticker;});
  saveAndRender();
}

function toggleFinish(id){
  var m=movimientos.find(function(x){return x.id==id;});
  if(!m)return;
  m.finish=!m.finish;
  saveAndRender();
}

function reduceMov(id){
  var m=movimientos.find(function(x){return x.id==id;});
  if(!m||!m.qty)return;
  var input=document.getElementById('red-qty-'+id);
  var val=parseFloat(input?input.value:0);
  if(!val||val<=0||val>=m.qty){flash(document.getElementById('m-status'),'Cantidad inválida (debe ser menor a '+m.qty+')',true);return;}
  m.qty=Math.round((m.qty-val)*1e8)/1e8;
  saveAndRender();
}

function saveInvInicial(v){
  try{
    if(v===undefined){
      v=getRawNum('inv-sidebar-usd');
    }
    var raw = typeof v === 'string' ? (parseFloat(v.replace(/\./g,'').replace(/,/g,'.'))||0) : (parseFloat(v)||0);
    localStorage.setItem((PFX+'inv_inicial'), raw);
    sbSetConfig('inv_inicial', raw);
    var disp=document.getElementById('inv-inicial-usd-display');
    if(disp) disp.textContent=raw?'$'+Math.round(raw).toLocaleString('es-AR'):'—';
    setFmtNum('inv-sidebar-usd', raw, 0);
    renderPortfolio();
  }catch(e){}
}
function loadInvInicial(){
  try{
    var v=localStorage.getItem((PFX+'inv_inicial'));
    var disp=document.getElementById('inv-inicial-usd-display');
    if(v){ setFmtNum('inv-sidebar-usd', v, 0); }
    if(disp){disp.textContent=v?'$'+Math.round(parseFloat(v)).toLocaleString('es-AR'):'—';}
  }catch(e){}
}
// ── Thousand-separator formatting for text inputs ──────────────────────────
function fmtNumInput(el, decimals){
  var raw = el.value.replace(/\./g,'').replace(/,/g,'.');
  var num = parseFloat(raw);
  if(isNaN(num)){ return; }
  var pos = el.selectionStart;
  var oldLen = el.value.length;
  if(decimals>0){
    el.value = num.toLocaleString('es-AR',{minimumFractionDigits:0,maximumFractionDigits:decimals});
  } else {
    el.value = Math.round(num).toLocaleString('es-AR',{maximumFractionDigits:0});
  }
  var newLen = el.value.length;
  el.selectionStart = el.selectionEnd = Math.max(0, pos + (newLen - oldLen));
}
function getRawNum(id){
  var el = document.getElementById(id);
  if(!el) return 0;
  var v = el.value.replace(/\./g,'').replace(/,/g,'.');
  return parseFloat(v)||0;
}
function setFmtNum(id, num, decimals){
  var el = document.getElementById(id);
  if(!el) return;
  if(num===null||num===undefined||num==='') { el.value=''; return; }
  var n = parseFloat(num)||0;
  el.value = decimals>0
    ? n.toLocaleString('es-AR',{minimumFractionDigits:0,maximumFractionDigits:decimals})
    : Math.round(n).toLocaleString('es-AR',{maximumFractionDigits:0});
}

function saveLiquidez(){
  try{
    var ars=getRawNum('liq-ars');
    var usd=getRawNum('liq-usd');
    localStorage.setItem((PFX+'liq'),JSON.stringify({ars:ars,usd:usd}));
    sbSetConfig('liquidez', {ars:ars,usd:usd});
  }catch(e){}
}
function liqConfirm(){
  saveLiquidez();
  renderPortfolio();
  var btns=document.querySelectorAll('[onclick="liqConfirm()"]');
  btns.forEach(function(b){
    var orig=b.textContent;b.textContent='✓';b.style.color='var(--accent)';
    setTimeout(function(){b.textContent=orig;},1000);
  });
}
function invConfirm(){
  var v=getRawNum('inv-sidebar-usd');
  var prev=0;try{prev=parseFloat(localStorage.getItem(PFX+'inv_inicial'))||0;}catch(e){}
  if(Math.round(v)===Math.round(prev)||invConfirm._ask)return;
  var f=function(x){return 'USD '+Math.round(x||0).toLocaleString('es-AR');};
  invConfirm._ask=true;var _ok=true;try{_ok=!(prev>0)||confirm('⚠️ Vas a cambiar la INVERSIÓN INICIAL (no la liquidez).\n\nAntes: '+f(prev)+'\nAhora: '+f(v)+'\n\nCambia el rendimiento del período y el honorario. ¿Confirmás?');}finally{setTimeout(function(){invConfirm._ask=false;},0);}
  if(!_ok){setFmtNum('inv-sidebar-usd',prev,0);return;}
  saveInvInicial(v);
  var btn=document.querySelector('[onclick="invConfirm()"]');
  if(btn){var orig=btn.textContent;btn.textContent='✓';btn.style.color='var(--accent)';setTimeout(function(){btn.textContent=orig;},1000);}
  perfCalcUpdate();
}
function loadLiquidez(){
  try{
    var l=localStorage.getItem((PFX+'liq'));
    if(l){
      var d=JSON.parse(l);
      if(d.ars) setFmtNum('liq-ars', d.ars, 0);
      if(d.usd) setFmtNum('liq-usd', d.usd, 2);
    }
  }catch(e){}
}
// ── Marcas de activos ────────────────────────────────────────────────────
var MARKS = {};
var _markPopTicker = null;

var _marksBase=null;
function _marksClon(o){return JSON.parse(JSON.stringify(o||{}));}
async function loadMarks(){
  try{
    var d = await sbGetConfig('marks');
    if(d && typeof d === 'object' && !Array.isArray(d)){
      Object.keys(MARKS).forEach(function(t){if(!(t in d))d[t]=MARKS[t];});
      MARKS = d;_marksBase=_marksClon(d);
      return;
    }
    _marksBase={};
    var s = localStorage.getItem((PFX+'marks'));
    if(s){
      MARKS = JSON.parse(s);
      await sbSetConfig('marks', MARKS);
      localStorage.removeItem((PFX+'marks'));
      console.log('[marks] migrado de localStorage a Supabase');
    }
  }catch(e){ console.warn('[marks] loadMarks error', e); }
}

var _marksT=0;
async function saveMarks(){
  clearTimeout(_marksT);
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/config?key=eq.marks&select=value',{headers:sbHeaders()});
    if(!r.ok)throw new Error('HTTP '+r.status);
    var d=await r.json(),nube=d&&d[0]?d[0].value:{};if(typeof nube==='string'){try{nube=JSON.parse(nube);}catch(e){nube={};}}
    if(!nube||typeof nube!=='object'||Array.isArray(nube))nube={};
    var base=_marksBase||{},cambio=false;
    Object.keys(Object.assign({},base,MARKS)).forEach(function(t){
      if(JSON.stringify(MARKS[t])===JSON.stringify(base[t]))return;
      if(MARKS[t])nube[t]=MARKS[t];else delete nube[t];});
    Object.keys(nube).forEach(function(t){if(JSON.stringify(nube[t])!==JSON.stringify(MARKS[t]))cambio=true;});
    MARKS=nube;
    var ok=await sbSetConfig('marks', MARKS);
    if(ok===false)throw new Error('no se pudo guardar');
    _marksBase=_marksClon(MARKS);
    if(cambio){try{renderPortfolio();}catch(e){}}
  }catch(e){ console.warn('[marks] saveMarks error, reintento en 15 s', e); _marksT=setTimeout(saveMarks,15000); }
}

function openMarkPopover(ticker, el){
  closeMarkPopover();
  _markPopTicker = ticker;
  var m = MARKS[ticker]||{};
  var pop = document.createElement('div');
  pop.className='mark-popover';
  pop.id='mark-popover';

  var title = document.createElement('div');
  title.style.cssText='margin-bottom:6px;font-weight:600;font-size:.8rem';
  title.textContent = ticker;
  pop.appendChild(title);

  var btnRow = document.createElement('div');
  btnRow.style.cssText='display:flex;gap:4px;margin-bottom:8px';
  [['sell','🔴 Vender'],['buy','🟢 Comprar'],['watch','⭐ Seguir']].forEach(function(pair){
    var b = document.createElement('button');
    b.className = 'mark-type-btn' + (m.type===pair[0] ? ' sel-'+pair[0] : '');
    b.textContent = pair[1];
    b.onclick = function(){ setMarkType(b, pair[0]); };
    btnRow.appendChild(b);
  });
  pop.appendChild(btnRow);

  var ta = document.createElement('textarea');
  ta.id='mark-note-input';
  ta.placeholder='Nota (opcional)...';
  ta.style.cssText='width:100%;box-sizing:border-box;height:52px;resize:none;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:4px;padding:4px 6px;font-size:.78rem';
  ta.value = m.note||'';
  pop.appendChild(ta);

  var actRow = document.createElement('div');
  actRow.style.cssText='display:flex;justify-content:flex-end;gap:6px;margin-top:6px';
  var btnQ = document.createElement('button');
  btnQ.textContent='Quitar';
  btnQ.style.cssText='font-size:.72rem;padding:3px 8px;background:none;border:1px solid var(--border);border-radius:4px;cursor:pointer;color:var(--text-muted)';
  btnQ.onclick = clearMark;
  var btnG = document.createElement('button');
  btnG.textContent='Guardar';
  btnG.style.cssText='font-size:.72rem;padding:3px 8px;background:var(--accent);border:none;border-radius:4px;cursor:pointer;color:#fff';
  btnG.onclick = confirmMark;
  actRow.appendChild(btnQ);
  actRow.appendChild(btnG);
  pop.appendChild(actRow);

  var r = el.getBoundingClientRect();
  var left = Math.min(r.left, window.innerWidth-200);
  var top  = r.bottom + 4;
  if(top + 210 > window.innerHeight) top = r.top - 214;
  pop.style.left = left + 'px';
  pop.style.top  = top  + 'px';
  document.body.appendChild(pop);
  setTimeout(function(){document.addEventListener('click',_markOutsideClick);},10);
}

function _markOutsideClick(e){
  var pop=document.getElementById('mark-popover');
  if(pop && !pop.contains(e.target)) closeMarkPopover();
}

function setMarkType(btnEl, type, silent){
  var pop=document.getElementById('mark-popover');
  if(!pop) return;
  pop.querySelectorAll('.mark-type-btn').forEach(function(b){ b.className='mark-type-btn'; });
  if(btnEl){ btnEl.className='mark-type-btn sel-'+type; }
  pop.dataset.type=type;
}

function confirmMark(){
  var pop=document.getElementById('mark-popover');
  if(!pop||!_markPopTicker) return;
  var type=pop.dataset.type||(MARKS[_markPopTicker]&&MARKS[_markPopTicker].type)||'';
  var note=(document.getElementById('mark-note-input')||{}).value||'';
  if(type||note.trim()){ MARKS[_markPopTicker]={type:type||'note',note:note.trim()}; }
  else { delete MARKS[_markPopTicker]; }
  saveMarks();
  closeMarkPopover();
  renderPortfolio();
}

function clearMark(){
  if(_markPopTicker) delete MARKS[_markPopTicker];
  saveMarks();
  closeMarkPopover();
  renderPortfolio();
}

function closeMarkPopover(){
  document.removeEventListener('click',_markOutsideClick);
  var pop=document.getElementById('mark-popover');
  if(pop) pop.remove();
  _markPopTicker=null;
}

// ── PIN y blur del portafolio ────────────────────────────────────────────
var PORT_PIN_KEY='ptSHARED_pin_hash';
var PORT_SESSION_KEY='ptSHARED_pin_sess';
var PORT_SESSION_HOURS=8;
var _portPinBuf='';
var _portBlurred=true;

async function sha256(str){
  var buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
}

function portPinDots(){
  for(var i=0;i<4;i++){
    var d=document.getElementById('port-pd'+i);
    if(d)d.className='pin-dot'+(_portPinBuf.length>i?' filled':'');
  }
}

async function portPinKey(k){
  var err=document.getElementById('port-pin-error');
  if(k==='del'){_portPinBuf=_portPinBuf.slice(0,-1);portPinDots();return;}
  if(k==='esc'){portHideOverlay();return;}
  if(_portPinBuf.length>=4)return;
  _portPinBuf+=k;
  portPinDots();
  if(_portPinBuf.length===4){
    var hash=await sha256(_portPinBuf);
    var stored=localStorage.getItem(PORT_PIN_KEY);
    if(!stored){
      localStorage.setItem(PORT_PIN_KEY,hash);
      localStorage.setItem(PORT_SESSION_KEY,Date.now().toString());
      portHideOverlay();portUnblur();
    } else if(hash===stored){
      localStorage.setItem(PORT_SESSION_KEY,Date.now().toString());
      portHideOverlay();portUnblur();
    } else {
      if(err)err.textContent='PIN incorrecto';
      _portPinBuf='';portPinDots();
      setTimeout(function(){if(err)err.textContent='';},1500);
    }
  }
}

function portPinReset(){
  if(confirm('¿Cambiar PIN? Se pedirá uno nuevo la próxima vez.')){
    localStorage.removeItem(PORT_PIN_KEY);
    localStorage.removeItem(PORT_SESSION_KEY);
  }
}

function portHideOverlay(){
  var ov=document.getElementById('port-pin-overlay');
  if(ov)ov.style.display='none';
  _portPinBuf='';portPinDots();
}

function portShowOverlay(){
  var ov=document.getElementById('port-pin-overlay');
  if(ov)ov.style.display='flex';
  _portPinBuf='';portPinDots();
}

function portUnblur(){
  _portBlurred=false;
  var c=document.getElementById('port-content');
  if(c)c.classList.remove('port-blurred');
  var _nr=document.getElementById('nv-root');if(_nr)_nr.classList.remove('port-blurred');
  var btn=document.getElementById('port-eye-btn');
  if(btn)btn.style.color='var(--accent)';
}

function portBlur(){
  _portBlurred=true;
  var c=document.getElementById('port-content');
  if(c)c.classList.add('port-blurred');
  var _nr=document.getElementById('nv-root');if(_nr)_nr.classList.add('port-blurred');
  var btn=document.getElementById('port-eye-btn');
  if(btn)btn.style.color='var(--text3)';
}

function portToggleBlur(){
  if(!_portBlurred){portBlur();return;}
  var sess=parseInt(localStorage.getItem(PORT_SESSION_KEY)||'0');
  var age=(Date.now()-sess)/1000/3600;
  if(age<PORT_SESSION_HOURS&&localStorage.getItem(PORT_PIN_KEY)){
    portUnblur();
  } else {
    portShowOverlay();
  }
}

// ─────────────────────────────────────────────────────────────────────────

var _gdcInitDone = false;
var _SAVE_FAIL={};
function saveFailClear(tabla){delete _SAVE_FAIL[tabla];_saveFailRender();}
function _saveFailRender(){
  var ks=Object.keys(_SAVE_FAIL),b=document.getElementById('save-fail-bar');
  if(!ks.length){if(b)b.remove();return;}
  if(!b){b=document.createElement('div');b.id='save-fail-bar';document.body.appendChild(b);}
  b.style.cssText='position:fixed;top:0;left:0;right:0;z-index:100005;background:var(--red,#ff5252);color:#fff;font-family:var(--mono);font-size:.78rem;padding:.5rem .9rem;display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;box-shadow:0 2px 12px rgba(0,0,0,.4)';
  var nom={movimientos:'movimientos',trk_divs:'dividendos'};
  b.innerHTML='<span>⚠️ No se guardaron en la nube los '+ks.map(function(k){return nom[k]||k;}).join(' y ')+' — quedaron solo en este navegador. No cierres la página.</span>'+
    '<button onclick="saveFailRetry()" style="background:#fff;color:#b00020;border:none;border-radius:6px;padding:4px 12px;font-weight:700;cursor:pointer">Reintentar</button>';
}
async function saveFailRetry(){
  var b=document.getElementById('save-fail-bar');if(b){var bt=b.querySelector('button');if(bt)bt.textContent='Guardando…';}
  for(var k in _SAVE_FAIL){var arr=k==='movimientos'?movimientos:k==='trk_divs'?TRK.divs:null;if(!arr)continue;
    var ok=await sbSaveArrayRetry(k,arr);if(ok){delete _SAVE_FAIL[k];try{localStorage.removeItem(PFX+(k==='movimientos'?'pending_sync':'trk_pending'));}catch(e){}}}
  _saveFailRender();
  var l=document.getElementById('lupd');if(l&&!Object.keys(_SAVE_FAIL).length){l.style.color='var(--accent)';l.textContent='✓ Guardado en la nube';setTimeout(function(){l.style.color='';},4000);}
}
function warnSaveFailed(tabla){
  _SAVE_FAIL[tabla||'movimientos']=1;_saveFailRender();
  var el=document.getElementById('lupd');
  if(!el)return;
  el.textContent='⚠️ No se guardó en la nube — reintentá o revisá tu conexión';
  el.style.color='var(--red)';
  console.error('[saveAndRender] sbSaveArray devolvió false — el movimiento NO llegó a Supabase, sólo quedó local en este dispositivo/navegador.');
  setTimeout(function(){ el.style.color=''; el.textContent=new Date().toLocaleTimeString('es-AR'); },10000);
}
function saveAndRender(){
  try{localStorage.setItem((PFX+'mov2'),JSON.stringify(movimientos));}catch(e){}
  try{localStorage.setItem((PFX+'pending_sync'),JSON.stringify(movimientos));}catch(e){}
  if(_gdcInitDone){ sbSaveArrayRetry('movimientos', movimientos).then(function(ok){ if(!ok){ warnSaveFailed('movimientos'); } else { try{localStorage.removeItem((PFX+'pending_sync'));}catch(e){} saveFailClear('movimientos'); } }); }
  else { console.warn('[saveAndRender] init no terminó — skip sbSaveArray (movimientos:'+movimientos.length+')'); }
  renderMovimientos();renderPortfolio();vsellPopulateSelect();
  (function(){var _d=document.getElementById('page-dashboard');if(_d&&_d.classList.contains('active'))setTimeout(renderDashboard,80);})();
  document.getElementById('lupd').textContent=new Date().toLocaleTimeString('es-AR');
}

var MOV_EDIT_ID = null;
var _movWasFiltered = false;

function movModalOpen(id){
  var m=movimientos.find(function(x){return x.id==id;});
  if(!m)return;
  MOV_EDIT_ID=id;
  var fields=document.getElementById('mov-edit-fields');
  var fechaISO=m.fecha?m.fecha.split('/').reverse().join('-'):'';
  fields.innerHTML=
    '<div class="fgrp"><label>Fecha</label><input type="date" id="me-fecha" value="'+fechaISO+'"></div>'+
    '<div class="fgrp"><label>Tipo</label><select id="me-tipo">'+
      ['compra','venta','dividendo','aporte'].map(function(t){return '<option value="'+t+'"'+(m.tipo===t?' selected':'')+'>'+t+'</option>';}).join('')+
    '</select></div>'+
    '<div class="fgrp"><label>Mercado</label><select id="me-mkt">'+
      ['USA','BONOS','ON','ARGENTINA','BRASIL','ETF'].map(function(mk){return '<option value="'+mk+'"'+(m.mercado===mk?' selected':'')+'>'+mk+'</option>';}).join('')+
    '</select></div>'+
    '<div class="fgrp"><label>Ticker</label><input type="text" id="me-ticker" value="'+(m.ticker||'')+'" style="text-transform:uppercase"></div>'+
    '<div class="fgrp"><label>Cantidad</label><input type="number" id="me-qty" value="'+(m.qty||'')+'" min="0" step="any"></div>'+
    '<div class="fgrp"><label id="me-precio-label">'+((m.mercado==='BONOS'||m.mercado==='ON')?'Precio / 100N':'Precio ARS')+'</label><input type="number" id="me-ars" value="'+((m.mercado==='BONOS'||m.mercado==='ON')?(m.precioARS*100||''):(m.precioARS||''))+'" min="0" step="any"></div>'+
    '<div class="fgrp"><label id="me-ccl-label">'+((m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI')?'MEP':'CCL')+'</label><input type="number" id="me-ccl" value="'+(m.ccl||'')+'" min="0" step="any"></div>'+
    '<div class="fgrp"><label>Comisión %</label><input type="number" id="me-com" value="'+(m.comisionPct||0)+'" min="0" max="100" step="0.01"></div>'+
    '<div class="fgrp" style="grid-column:1/-1"><label>Notas</label><input type="text" id="me-notas" value="'+(m.notas||'')+'"></div>'+
    '<div class="fgrp" style="grid-column:1/-1;display:flex;align-items:center"><label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-family:var(--mono);font-size:.72rem;color:var(--text2);user-select:none"><input type="checkbox" id="me-finish"'+(m.finish?' checked':'')+' style="accent-color:var(--accent);width:13px;height:13px;cursor:pointer;margin:0"> 🏁 A finish</label></div>';
  ['me-ars','me-ccl','me-ticker'].forEach(function(eid){
    var el=document.getElementById(eid);
    if(el)el.addEventListener('input',movModalCalcUSD);
  });
  var mktEl=document.getElementById('me-mkt');
  if(mktEl){
    mktEl.addEventListener('change',function(){
      var lbl=document.getElementById('me-ccl-label');
      var esBonoON=(this.value==='BONOS'||this.value==='ON');
      if(lbl)lbl.textContent=esBonoON?'MEP':'CCL';
      var lblP=document.getElementById('me-precio-label');
      if(lblP)lblP.textContent=esBonoON?'Precio / 100N':'Precio ARS';
      var fechaVal=document.getElementById('me-fecha').value;
      if(fechaVal){
        var fecha=fechaVal.split('-').reverse().join('/');
        var tc=getTC(fecha,this.value);
        if(tc)document.getElementById('me-ccl').value=tc;
      }
      movModalCalcUSD();
    });
  }
  movModalCalcUSD();
  var overlay=document.getElementById('mov-modal-overlay');
  overlay.style.display='flex';
}

function movModalCalcUSD(){
  var ars=parseFloat(document.getElementById('me-ars').value);
  var ccl=parseFloat(document.getElementById('me-ccl').value);
  var ticker=(document.getElementById('me-ticker').value||'').trim().toUpperCase();
  var rt=getRatio(ticker)||1;
  var mktEl=document.getElementById('me-mkt');
  var esBonoON=mktEl&&(mktEl.value==='BONOS'||mktEl.value==='ON');
  var arsCalc=esBonoON?(ars/100):ars;
  var _usdDirecto=isBonoUSDDirecto(ticker);
  var hint=document.getElementById('me-usd-hint');
  if(hint){hint.textContent=_usdDirecto?(ars?'≈ USD '+arsCalc.toFixed(4)+' (directo, sin MEP)':''):((ars&&ccl)?'≈ USD '+(arsCalc*rt/ccl).toFixed(4):'');}
}

function movModalSave(){
  var m=movimientos.find(function(x){return x.id==MOV_EDIT_ID;});
  var sel=document.getElementById('mov-edit-status');
  if(!m){flash(sel,'Movimiento no encontrado',true);return;}
  var fechaVal=document.getElementById('me-fecha').value;
  var ticker=(document.getElementById('me-ticker').value||'').trim().toUpperCase();
  var qty=parseFloat(document.getElementById('me-qty').value);
  var ars=parseFloat(document.getElementById('me-ars').value);
  var ccl=parseFloat(document.getElementById('me-ccl').value);
  var com=parseFloat(document.getElementById('me-com').value)||0;
  var notas=document.getElementById('me-notas').value||'';
  var tipo=document.getElementById('me-tipo').value;
  if(!fechaVal){flash(sel,'Ingresá la fecha',true);return;}
  var _antes=JSON.parse(JSON.stringify(m));
  m.fecha=fechaVal.split('-').reverse().join('/');
  m.tipo=tipo;
  var mkt=document.getElementById('me-mkt');
  if(mkt&&mkt.value){
    var newMkt=mkt.value;
    movimientos.forEach(function(x){if(x.ticker===m.ticker)x.mercado=newMkt;});
  }
  if(ticker)m.ticker=ticker;
  if(!isNaN(qty)&&qty!==0)m.qty=qty;
  var mktSaveEl=document.getElementById('me-mkt');
  var esBonoONSave=mktSaveEl&&(mktSaveEl.value==='BONOS'||mktSaveEl.value==='ON');
  if(!isNaN(ars)&&ars>=0)m.precioARS=esBonoONSave?(ars/100):ars;
  if(!isNaN(ccl)&&ccl>0){m.ccl=ccl;}
  if(isBonoUSDDirecto(m.ticker)&&m.precioARS){
    m.precioUSD=m.precioARS;
    m.ratio=getRatio(m.ticker)||1;
  } else if(m.ccl&&m.precioARS){
    var rt=getRatio(m.ticker)||1;
    m.precioUSD=m.precioARS*rt/m.ccl;
    m.ratio=rt;
  }
  m.comision=(m.qty*m.precioARS*com/100);
  m.comisionPct=com;
  m.notas=notas;
  var meFinish=document.getElementById('me-finish');
  if(meFinish)m.finish=meFinish.checked;
  if(JSON.stringify(_antes)!==JSON.stringify(m))papAgregar({k:'mov',acc:'editado',d:_antes,desc:'Editado: '+_antes.tipo+' '+_antes.ticker+' del '+_antes.fecha});
  saveAndRender();
  flash(sel,'Guardado',false);
  setTimeout(movModalClose,800);
}

function movModalClose(){
  document.getElementById('mov-modal-overlay').style.display='none';
  MOV_EDIT_ID=null;
}

// ════════════════════════════════════════════════════════
document.addEventListener('change',function(e){if(!e.target||e.target.id!=='vsell-ticker')return;var t=e.target.value,q=document.getElementById('vsell-qty');if(!t||!q)return;
  try{var p=getPositions().filter(function(x){return x.ticker===t&&x.qty>0;})[0];if(p){q.value=Math.round(p.qty*100)/100;vsellPreview();}}catch(err){}});
document.addEventListener('keydown',function(e){var el=e.target;if(!el||(el.id!=='vbuy-precio-ars'&&el.id!=='vsell-precio-ars'))return;if(e.key!=='ArrowUp'&&e.key!=='ArrowDown')return;
  e.preventDefault();var v=parseFloat(String(el.value).replace(',','.'))||0;v=Math.max(0,Math.round((v+(e.key==='ArrowUp'?5:-5))*100)/100);el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},true);
// ════════════════════════════════════════════════════════
function divPopulateSelect(){
  var sel = document.getElementById('d-ticker');
  if(!sel) return;
  var current = sel.value;
  var tickers = [];
  var seen = {};
  movimientos.forEach(function(m){ if(m&&m.ticker&&!seen[m.ticker]&&m.tipo!=='aporte'){seen[m.ticker]=true;tickers.push(m.ticker);} });
  tickers.sort();
  sel.innerHTML = '<option value="">— seleccioná ticker —</option>' +
    tickers.map(function(t){
      return '<option value="'+t+'"'+(t===current?' selected':'')+'>'+t+'</option>';
    }).join('');
}

// ─── Comprar rápido (módulo en Home/Portafolio) ───
function vbuyOnMktChange(){
  var mkt=document.getElementById('vbuy-mkt').value;
  var lbl=document.getElementById('vbuy-lbl-precio');
  if(lbl) lbl.textContent=(mkt==='BONOS'||mkt==='ON')?'Precio /100N':'Precio ARS';
}

function vbuyResetFecha(){
  var el=document.getElementById('vbuy-fecha');
  if(el){el.value=_hoyLocalISO();el.dataset.auto=el.value;fechaMarcar(el);}
}

function vbuyClear(){
  ['vbuy-ticker','vbuy-qty','vbuy-precio-ars'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
  var f=document.getElementById('vbuy-finish'); if(f)f.checked=false;
  var mktEl=document.getElementById('vbuy-mkt'); if(mktEl)mktEl.value='USA';
  vbuyOnMktChange();
  vbuyResetFecha();
}

function vbuyConfirmar(){
  var mktEl=document.getElementById('vbuy-mkt');
  var tickerEl=document.getElementById('vbuy-ticker');
  var fechaEl=document.getElementById('vbuy-fecha');
  var qtyEl=document.getElementById('vbuy-qty');
  var arsEl=document.getElementById('vbuy-precio-ars');
  var finishEl=document.getElementById('vbuy-finish');
  var statusEl=document.getElementById('vbuy-status');
  if(!mktEl) return;

  var mkt=mktEl.value;
  var ticker=tickerEl.value.trim().toUpperCase();
  var fecha=fechaEl.value?fechaEl.value.split('-').reverse().join('/'):'';
  var qty=parseFloat(qtyEl.value);
  var precioARSInput=parseFloat(arsEl.value);

  if(!ticker){flash(statusEl,'Ingresá un ticker',true);return;}
  if(!fecha){flash(statusEl,'Falta la fecha',true);return;}
  if(isNaN(qty)||qty<=0){flash(statusEl,'Cantidad inválida',true);return;}
  if(isNaN(precioARSInput)||precioARSInput<0){flash(statusEl,'Precio inválido',true);return;}

  var precioARS=(mkt==='BONOS'||mkt==='ON')?(precioARSInput/100):precioARSInput;
  if(mkt==='FCI')qty=qty/1000;
  var cclVal=getTC(fecha,mkt);
  if(!cclVal||cclVal<=0){flash(statusEl,'⚠️ Sin CCL/MEP para esa fecha',true);return;}
  if(!fechaGuard(fecha,'compra')||!precioGuard(ticker,precioARSInput,fecha))return;
  var ratio=getRatio(ticker);
  var precioUSD=isBonoUSDDirecto(ticker)?precioARS:(cclVal?precioARS*ratio/cclVal:null);

  movimientos.push({
    id:Date.now(), fecha:fecha, tipo:'compra', mercado:mkt, ticker:ticker, qty:qty,
    precioARS:precioARS, ccl:cclVal, ratio:ratio, precioUSD:precioUSD,
    comision:0, comisionPct:0, notas:'Cargado desde módulo rápido (Portafolio)',
    finish:finishEl&&finishEl.checked||false, cartera:(typeof CARTERA_ACTIVA!=='undefined'?CARTERA_ACTIVA:undefined)
  });
  saveAndRender();
  tcStampearFecha(fecha,(mkt==='BONOS'||mkt==='ON'||mkt==='FCI'),cclVal);
  flash(statusEl,'Compra registrada ✓',false);
  vbuyClear();
}

// ─── Vender rápido (módulo en Home/Portafolio) ───
function vsellPopulateSelect(){
  var sel = document.getElementById('vsell-ticker');
  if(!sel) return;
  var current = sel.value;
  var allPos = getPositions();
  var posByTicker = {};
  allPos.forEach(function(p){ if(!posByTicker[p.ticker]) posByTicker[p.ticker]=p; });
  var tickers = [];
  var seen = {};
  allPos.forEach(function(p){ if(p.qty>0.000001 && !seen[p.ticker]){seen[p.ticker]=true;tickers.push(p.ticker);} });
  tickers.sort();
  sel.innerHTML = '<option value="">— ticker —</option>' +
    tickers.map(function(t){
      var pos = posByTicker[t];
      var label = t + (pos && pos.qty > 0 ? ' ('+Math.round(pos.qty)+')' : '');
      return '<option value="'+t+'"'+(t===current?' selected':'')+'>'+label+'</option>';
    }).join('');
}

function vsellResetFecha(){
  var el=document.getElementById('vsell-fecha');
  if(el){el.value=_hoyLocalISO();el.dataset.auto=el.value;fechaMarcar(el);}
}

function vsellGetLastMercado(ticker){
  for(var i=movimientos.length-1;i>=0;i--){
    var m=movimientos[i];
    if(m&&m.ticker===ticker&&m.mercado) return m.mercado;
  }
  return 'USA';
}

function vsellPreview(){
  var tickerEl=document.getElementById('vsell-ticker');
  var qtyEl=document.getElementById('vsell-qty');
  var fechaEl=document.getElementById('vsell-fecha');
  var arsEl=document.getElementById('vsell-precio-ars');
  var cclEl=document.getElementById('vsell-ccl');
  var prevEl=document.getElementById('vsell-preview');
  var btnConfirm=document.getElementById('vsell-btn-confirmar');
  var lblPrecioEl=document.getElementById('vsell-lbl-precio');
  if(!tickerEl||!prevEl) return;
  var ticker=tickerEl.value.trim().toUpperCase();
  if(!ticker){ if(lblPrecioEl)lblPrecioEl.textContent='Precio ARS'; prevEl.innerHTML='<span style="color:var(--text3)">Elegí un ticker para ver el preview.</span>'; if(btnConfirm)btnConfirm.disabled=true; return; }

  var sector=getSector(ticker);
  var esBonoON=(sector==='bonos'||sector==='on');
  if(lblPrecioEl) lblPrecioEl.textContent = esBonoON ? 'Precio /100N' : 'Precio ARS';
  var cclManual=parseFloat(cclEl.value);
  var fechaStr=fechaEl.value?fechaEl.value.split('-').reverse().join('/'):'';
  var cclTabla=fechaStr?(esBonoON?(getMEP(fechaStr)||getCCL(fechaStr)):getCCL(fechaStr)):null;
  var ccl=cclManual>0?cclManual:(cclTabla||(esBonoON?(MEP_HOY||CCL_HOY):CCL_HOY));
  if(!cclManual&&ccl)cclEl.placeholder=Math.round(ccl);

  var precioARSInput=parseFloat(arsEl.value);
  var precioARS=esBonoON&&precioARSInput>0?precioARSInput/100:precioARSInput;
  var qtyVender=parseFloat(qtyEl.value);
  var ventaUSDxUnit=isBonoUSDDirecto(ticker)?(precioARS>0?precioARS:null):((precioARS>0&&ccl>0)?precioARS/ccl:null);

  var posActual=getPositions().find(function(p){return p.ticker===ticker;});
  if(!posActual||posActual.qty<=0.000001){ prevEl.innerHTML='<span style="color:var(--red)">No quedan unidades abiertas en '+ticker+'.</span>'; if(btnConfirm)btnConfirm.disabled=true; return; }

  var qtyTotalAbierta=posActual.qty;
  var avgCostoUSD=posActual.costUSDpuro/posActual.qty;

  if(!(qtyVender>0)){
    prevEl.innerHTML='<span style="color:var(--text3)">Abierto: '+qtyTotalAbierta.toFixed(2)+' u. a un promedio de U$S '+avgCostoUSD.toFixed(4)+' · Ingresá cantidad y precio para ver el preview.</span>';
    if(btnConfirm)btnConfirm.disabled=true;
    return;
  }
  if(qtyVender>qtyTotalAbierta+0.000001){
    prevEl.innerHTML='<span style="color:var(--red)">Pediste vender '+qtyVender+' pero solo hay '+qtyTotalAbierta.toFixed(2)+' abiertas.</span>';
    if(btnConfirm)btnConfirm.disabled=true;
    return;
  }

  var costoBaseTotal=avgCostoUSD*qtyVender;
  var ingresoTotal=ventaUSDxUnit!==null?ventaUSDxUnit*qtyVender:null;
  var pnl=ingresoTotal!==null?ingresoTotal-costoBaseTotal:null;
  var pct=(pnl!==null&&costoBaseTotal>0)?(pnl/costoBaseTotal*100):null;

  var cl=pnl===null?'':(pnl>=0?'pos':'neg');
  var sg=pnl===null?'':(pnl>=0?'+':'');
  prevEl.innerHTML=
    '<span style="color:var(--text2)">Promedio: <b style="color:var(--text)">U$S '+avgCostoUSD.toFixed(4)+'/u</b></span>&nbsp;&nbsp;·&nbsp;&nbsp;'+
    '<span style="color:var(--text2)">G/P: <b class="'+cl+'">'+(pnl!==null?sg+'U$S '+pnl.toFixed(2)+' ('+sg+pct.toFixed(2)+'%)':'—')+'</b></span>';

  if(btnConfirm)btnConfirm.disabled=(ingresoTotal===null);
}

function vsellClear(){
  ['vsell-qty','vsell-precio-ars','vsell-ccl'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
  var tEl=document.getElementById('vsell-ticker'); if(tEl)tEl.value='';
  vsellResetFecha();
  vsellPreview();
}

function vsellConfirmar(){
  var tickerEl=document.getElementById('vsell-ticker');
  var qtyEl=document.getElementById('vsell-qty');
  var fechaEl=document.getElementById('vsell-fecha');
  var arsEl=document.getElementById('vsell-precio-ars');
  var cclEl=document.getElementById('vsell-ccl');
  var statusEl=document.getElementById('vsell-status');
  var ticker=tickerEl.value.trim().toUpperCase();
  var qty=parseFloat(qtyEl.value);
  var fecha=fechaEl.value?fechaEl.value.split('-').reverse().join('/'):'';
  var precioARSInput=parseFloat(arsEl.value);
  if(!ticker){flash(statusEl,'Elegí un ticker',true);return;}
  if(isNaN(qty)||qty<=0){flash(statusEl,'Cantidad inválida',true);return;}
  if(!fecha){flash(statusEl,'Falta la fecha',true);return;}
  if(isNaN(precioARSInput)||precioARSInput<=0){flash(statusEl,'Precio inválido',true);return;}
  if(!fechaGuard(fecha,'venta')||!precioGuard(ticker,precioARSInput,fecha))return;

  var mkt=vsellGetLastMercado(ticker);
  var sector=getSector(ticker);
  var esBonoON=(sector==='bonos'||sector==='on');
  var precioARS=esBonoON?precioARSInput/100:precioARSInput;
  var cclManual=parseFloat(cclEl.value);
  var cclVal=cclManual>0?cclManual:getTC(fecha,mkt);
  if(!cclVal||cclVal<=0){flash(statusEl,'⚠️ Sin CCL/MEP para esa fecha — cargalo en Tipo de cambio (tecla T)',true);return;}
  var ratio=getRatio(ticker);
  var precioUSD=isBonoUSDDirecto(ticker)?precioARS:(cclVal?precioARS*ratio/cclVal:null);

  var posActual=getPositions().find(function(p){return p.ticker===ticker;});
  if(!posActual||qty>posActual.qty+0.000001){
    flash(statusEl,'No tenés '+qty+' unidades abiertas de '+ticker,true);
    return;
  }

  movimientos.push({
    id:Date.now(), fecha:fecha, tipo:'venta', mercado:mkt, ticker:ticker, qty:qty,
    precioARS:precioARS, ccl:cclVal, ratio:ratio, precioUSD:precioUSD,
    comision:0, comisionPct:0, notas:'Vendido desde módulo rápido (Portafolio)',
    finish:false, loteMethod:'promedio', cartera:(typeof CARTERA_ACTIVA!=='undefined'?CARTERA_ACTIVA:undefined)
  });
  saveAndRender();
  tcStampearFecha(fecha,(esBonoON||sector==='fci'),cclVal);
  flash(statusEl,'Venta registrada ✓',false);
  vsellClear();
  vsellPopulateSelect();
}

// ─── Estadísticas de Ganancia realizada (x ticker, x tipo, x RF/RV) ───
function vestadTipoTicker(ticker){
  var s=getSector(ticker);
  if(s==='bonos')return 'Bono';
  if(s==='on')return 'ON';
  if(s==='fci')return 'FCI';
  if(s==='argentina')return 'Acción Arg.';
  if(s==='brasil')return 'Brasil';
  if(s==='cripto')return 'Cripto';
  return 'Cedear';
}
function vestadEsRF(ticker){
  var s=getSector(ticker);
  if(s==='bonos'||s==='on')return true;
  if(s==='fci'){
    var cfg=(typeof FCI_AD_FONDOS!=='undefined'&&FCI_AD_FONDOS[ticker])||null;
    return !(cfg&&cfg.cat==='rentaVariable');
  }
  return false;
}
function vestadFmtUSD(n){ return (n>=0?'+':'')+'U$S '+n.toFixed(2); }
function vestadFmtPct(n){ return n===null?'—':(n>=0?'+':'')+n.toFixed(2)+'%'; }
function vestadCl(n){ return n===null?'':(n>=0?'pos':'neg'); }

function vestadAgrupar(ventas, keyFn){
  var grupos={};
  ventas.forEach(function(v){
    var k=keyFn(v);
    if(!grupos[k])grupos[k]={key:k,cant:0,gananciaUSD:0,costBasisUSD:0};
    grupos[k].cant++;
    grupos[k].gananciaUSD+=v.gananciaUSD;
    grupos[k].costBasisUSD+=v.costBasisUSD;
  });
  return Object.values(grupos).map(function(g){
    g.gananciaPct=g.costBasisUSD>0?(g.gananciaUSD/g.costBasisUSD*100):null;
    return g;
  }).sort(function(a,b){ return b.gananciaUSD-a.gananciaUSD; });
}

function vestadTabla(grupos, labelHeader){
  if(!grupos.length) return '<div class="ibox">Todavía no hay ventas registradas con datos de ganancia.</div>';
  var filas=grupos.map(function(g){
    return '<tr>'+
      '<td class="mono">'+g.key+'</td>'+
      '<td class="mono">'+g.cant+'</td>'+
      '<td class="mono muted">U$S '+g.costBasisUSD.toFixed(2)+'</td>'+
      '<td class="mono '+vestadCl(g.gananciaUSD)+'">'+vestadFmtUSD(g.gananciaUSD)+'</td>'+
      '<td class="mono '+vestadCl(g.gananciaPct)+'">'+vestadFmtPct(g.gananciaPct)+'</td>'+
    '</tr>';
  }).join('');
  return '<div class="tw panel-table"><table>'+
    '<thead><tr><th>'+labelHeader+'</th><th># Ventas</th><th>Costo base</th><th>Ganancia neta</th><th>Ganancia %</th></tr></thead>'+
    '<tbody>'+filas+'</tbody></table></div>';
}

function renderVentaEstadisticas(){
  getPositions();
  var ventas=movimientos.filter(function(m){ return m&&m.tipo==='venta'&&m.gananciaUSD!==undefined&&m.gananciaUSD!==null; });

  var resumenEl=document.getElementById('vestad-resumen');
  if(!ventas.length){
    resumenEl.innerHTML='<div class="ibox">Todavía no hay ventas registradas con datos de ganancia.</div>';
    document.getElementById('vestad-ticker').innerHTML='';
    document.getElementById('vestad-tipo').innerHTML='';
    document.getElementById('vestad-rfrv').innerHTML='';
    return;
  }

  var totalGanancia=ventas.reduce(function(s,v){return s+v.gananciaUSD;},0);
  var totalCostBasis=ventas.reduce(function(s,v){return s+v.costBasisUSD;},0);
  var totalPct=totalCostBasis>0?(totalGanancia/totalCostBasis*100):null;
  resumenEl.innerHTML=
    '<div style="display:flex;flex-wrap:wrap;gap:6px">'+
      '<div class="metric" style="padding:.4rem .6rem;flex:0 1 auto">'+
        '<div class="metric-label" style="font-size:.56rem"># Ventas</div>'+
        '<div class="metric-value" style="font-size:.8rem">'+ventas.length+'</div>'+
      '</div>'+
      '<div class="metric" style="padding:.4rem .6rem;flex:0 1 auto">'+
        '<div class="metric-label" style="font-size:.56rem">Costo base total</div>'+
        '<div class="metric-value" style="font-size:.8rem">U$S '+totalCostBasis.toFixed(2)+'</div>'+
      '</div>'+
      '<div class="metric" style="padding:.4rem .6rem;flex:0 1 auto">'+
        '<div class="metric-label" style="font-size:.56rem">Ganancia neta total</div>'+
        '<div class="metric-value '+vestadCl(totalGanancia)+'" style="font-size:.8rem">'+vestadFmtUSD(totalGanancia)+'</div>'+
      '</div>'+
      '<div class="metric" style="padding:.4rem .6rem;flex:0 1 auto">'+
        '<div class="metric-label" style="font-size:.56rem">Ganancia % total</div>'+
        '<div class="metric-value '+vestadCl(totalPct)+'" style="font-size:.8rem">'+vestadFmtPct(totalPct)+'</div>'+
      '</div>'+
    '</div>';

  var porTicker=vestadAgrupar(ventas, function(v){ return v.ticker; });
  document.getElementById('vestad-ticker').innerHTML=vestadTabla(porTicker,'Ticker');

  var porTipo=vestadAgrupar(ventas, function(v){ return vestadTipoTicker(v.ticker); });
  document.getElementById('vestad-tipo').innerHTML=vestadTabla(porTipo,'Tipo');

  var porRFRV=vestadAgrupar(ventas, function(v){ return vestadEsRF(v.ticker)?'Renta Fija':'Renta Variable'; });
  document.getElementById('vestad-rfrv').innerHTML=vestadTabla(porRFRV,'Clase');
}

// ─── Estadísticas Venta Histórica (prueba standalone, no toca movimientos reales) ───
var _ventahistRows = [];
var _ventahistDivs = [];
var _ventahistAportes = [];

function ventahistParseFecha(v){
  if(v==null||v==='') return null;
  if(typeof v==='number'){
    var d=new Date(Math.round((v-25569)*86400*1000));
    var dd=d.getUTCDate(), mm=d.getUTCMonth()+1, yyyy=d.getUTCFullYear();
    return (dd<10?'0':'')+dd+'/'+(mm<10?'0':'')+mm+'/'+yyyy;
  }
  var s=String(v).trim();
  var m=s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if(m){
    var dd2=m[1].padStart(2,'0'), mm2=m[2].padStart(2,'0'), yyyy2=m[3].length===2?('20'+m[3]):m[3];
    return dd2+'/'+mm2+'/'+yyyy2;
  }
  m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if(m) return m[3].padStart(2,'0')+'/'+m[2].padStart(2,'0')+'/'+m[1];
  return null;
}

function ventahistParseTipo(v){
  var s=cmpNorm(v);
  if(s==='compra'||s==='c'||s==='buy'||s==='cpra') return 'compra';
  if(s==='venta'||s==='v'||s==='sell'||s==='vtas'||s==='vta') return 'venta';
  return null;
}

function ventahistParseNum(v){
  if(v==null||v==='') return NaN;
  if(typeof v==='number') return v;
  return cmpParseArgNum(v);
}

function ventahistFechaKey(f){
  var p=f.split('/');
  return p.length===3 ? p[2]+p[1].padStart(2,'0')+p[0].padStart(2,'0') : '0';
}

var VHIST_BRASIL_RE=/ITAU|BANCO DO BRASIL|BRADESCO|VALE S\.A|GERDAU|EMBRAER|PETROLEO BRASILEIRO|SIDERURGICA|AMBEV|STONECO|PAGSEGURO|NU HOLDINGS|XP INC|BRASKEM|BRF S\.A|MERC\.?LIB|MSCI BRAZIL/i;
function ventahistClasificarTipo(idRaw,esBonoON){
  if(esBonoON) return 'Bonos';
  if(/^CED/i.test(idRaw)) return VHIST_BRASIL_RE.test(idRaw)?'Brasil':'Cedear';
  return 'Argentina';
}
function ventahistEsBonoON(idRaw){
  return /BONO|BONTE|OBLIGAC|LETRA|LECAP|LECER|BOTE|BOPREAL|VALORES NEGOCIABLES|^ON\s|^L\.\s*T|^LT\s|^B\.\s*TES|^T\.D\./i.test(idRaw);
}
var VHIST_EXCLUIDOS_RE=/^LONGVIE|^CELULOSA|^FERRUM/i;
var VHIST_EXCLUIDOS_TICKERS=new Set(['LONG','CELU','FERR','ECOG']);
function ventahistEstaExcluido(idRaw){
  if(VHIST_EXCLUIDOS_TICKERS.has(String(idRaw||'').trim().toUpperCase())) return true;
  return VHIST_EXCLUIDOS_RE.test(idRaw)||cmpNorm(idRaw).indexOf('ecogas')>=0;
}

function ventahistParseRows(rows){
  var hdrIdx=rows.findIndex(function(r){
    var n=r.map(cmpNorm);
    var hasId=n.indexOf('especie')>=0||n.indexOf('ticker')>=0;
    var hasQty=n.some(function(c){return c==='cantidad'||c==='qty'||c==='nominales';});
    return hasId&&hasQty;
  });
  if(hdrIdx<0) return {error:'No se encontró la columna Especie o Ticker.'};
  var hdr=rows[hdrIdx].map(cmpNorm);

  var especieCol=hdr.indexOf('especie');
  var tickerCol=hdr.indexOf('ticker');
  var opCol=hdr.findIndex(function(c){return c==='operado';});
  var liqCol=hdr.findIndex(function(c){return c==='liquida'||c==='liquidacion'||c==='liquidación';});
  var fCol=hdr.indexOf('fecha');
  var tipoOpCol=hdr.findIndex(function(c){return c==='operacion'||c==='operación';});
  var tipoCol=hdr.indexOf('tipo');
  var qCol=hdr.findIndex(function(c){return c==='cantidad'||c==='qty'||c==='nominales';});
  var impCol=hdr.findIndex(function(c){return c==='importe'||c==='monto';});
  var pCol=hdr.findIndex(function(c){return c.indexOf('precio')===0||c==='price';});
  var mCol=hdr.indexOf('mercado');

  var idCol=especieCol>=0?especieCol:tickerCol;
  var dateCol=opCol>=0?opCol:(liqCol>=0?liqCol:fCol);
  var typeCol=tipoOpCol>=0?tipoOpCol:tipoCol;

  if(idCol<0||dateCol<0||typeCol<0||qCol<0){
    return {error:'Faltan columnas necesarias. Necesito: (Especie o Ticker) + (Operado, Liquida o Fecha) + (Operación o Tipo) + Cantidad, y para el precio Importe o Precio.'};
  }
  if(impCol<0&&pCol<0){
    return {error:'Necesito la columna Importe o la columna Precio para calcular el costo.'};
  }

  var parsed=[], errores=0, ignoradas=0;
  rows.slice(hdrIdx+1).forEach(function(r,idx){
    var idRaw=String(r[idCol]||'').trim();
    if(!idRaw) return;
    var fecha=ventahistParseFecha(r[dateCol]);
    var tipo=ventahistParseTipo(r[typeCol]);
    if(!tipo){ ignoradas++; return; }
    var qty=Math.abs(ventahistParseNum(r[qCol]));
    var precioARS=NaN;
    if(impCol>=0){
      var importe=Math.abs(ventahistParseNum(r[impCol]));
      precioARS=(!isNaN(importe)&&qty>0)?(importe/qty):NaN;
    }
    if(isNaN(precioARS)&&pCol>=0){
      precioARS=ventahistParseNum(r[pCol]);
    }
    var esBonoON=ventahistEsBonoON(idRaw);
    var mercado=(mCol>=0&&r[mCol])?String(r[mCol]).trim().toUpperCase():(esBonoON?'BONOS':'');
    var tipoActivo=ventahistClasificarTipo(idRaw,esBonoON);
    if(!fecha||isNaN(qty)||qty<=0||isNaN(precioARS)||precioARS<0){errores++;return;}
    parsed.push({ticker:idRaw,fecha:fecha,tipo:tipo,qty:qty,precioARS:precioARS,mercado:mercado,tipoActivo:tipoActivo,_idx:idx});
  });

  return {parsed:parsed,errores:errores,ignoradas:ignoradas};
}

function ventahistReadRows(ab){
  try{
    var wb=XLSX.read(new Uint8Array(ab),{type:'array'});
    for(var i=0;i<wb.SheetNames.length;i++){
      var ws=wb.Sheets[wb.SheetNames[i]];
      var rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
      if(rows.some(function(r){return r.some(function(c){var n=cmpNorm(c);return n==='especie'||n==='ticker';});})) return rows;
    }
  }catch(ex){}
  return cmpParseHTML(ab);
}

// ─── Dividendos y Rentas cobradas (archivo separado del broker, identifica por ticker corto) ───
function ventahistParseDivRows(rows){
  var hdrIdx=rows.findIndex(function(r){
    var n=r.map(cmpNorm);
    return n.indexOf('fecha')>=0&&n.indexOf('especie')>=0&&n.indexOf('cpbt')>=0;
  });
  if(hdrIdx<0) return {error:'No se encontró la tabla de Dividendos/Rentas (columnas Fecha, Cpbt, Especie, Divi/renta).'};
  var hdr=rows[hdrIdx].map(cmpNorm);
  var fCol=hdr.indexOf('fecha');
  var cpbtCol=hdr.indexOf('cpbt');
  var idCol=hdr.indexOf('especie');
  var monCol=hdr.indexOf('moneda');
  var montoCol=hdr.indexOf('divi/renta');
  if(fCol<0||cpbtCol<0||idCol<0||montoCol<0){
    return {error:'Faltan columnas necesarias. Necesito: Fecha, Cpbt, Especie y Divi/renta.'};
  }
  var parsed=[], ignoradas=0, errores=0;
  rows.slice(hdrIdx+1).forEach(function(r,idx){
    var cpbt=cmpNorm(r[cpbtCol]);
    if(cpbt!=='div'&&cpbt!=='rta'){ ignoradas++; return; }
    var ticker=String(r[idCol]||'').trim().toUpperCase();
    if(!ticker) return;
    var fecha=ventahistParseFecha(r[fCol]);
    var monto=ventahistParseNum(r[montoCol]);
    var moneda=String(r[monCol]||'').trim().toUpperCase();
    if(!fecha||isNaN(monto)||monto===0){ errores++; return; }
    parsed.push({ticker:ticker,fecha:fecha,monto:monto,moneda:moneda,cpbt:cpbt,_idx:idx});
  });
  return {parsed:parsed,ignoradas:ignoradas,errores:errores};
}

function vhistSectorToTipo(sector){
  if(sector==='bonos'||sector==='on') return 'Bonos';
  if(sector==='argentina') return 'Argentina';
  if(sector==='brasil') return 'Brasil';
  return 'Cedear';
}

function calcularDividendosHistoricos(rows){
  return rows.map(function(r){
    var sector=(typeof getSector==='function')?getSector(r.ticker):'nyse';
    var tipoActivo=vhistSectorToTipo(sector);
    var esBonoON=(sector==='bonos'||sector==='on');
    var usd;
    if(r.moneda==='PESOS'){
      var tc=esBonoON?(getMEP(r.fecha)||MEP_HOY):(getCCL(r.fecha)||CCL_HOY);
      usd=tc>0?(r.monto/tc):0;
    } else {
      usd=r.monto;
    }
    var anio=parseInt((r.fecha.split('/')[2])||'0',10);
    return {ticker:r.ticker,fecha:r.fecha,anio:anio,tipoActivo:tipoActivo,usd:usd};
  });
}

function ventahistResetFecha(){
  var el=document.getElementById('vhist-add-fecha');
  if(el){el.value=_hoyLocalISO();el.dataset.auto=el.value;fechaMarcar(el);}
}

function vhistPersist(){
  try{ localStorage.setItem((PFX+'vhist_movs'), JSON.stringify(_ventahistRows)); }catch(e){}
  sbSetConfig('vhist_movs', _ventahistRows);
}

function ventahistOnFile(input){
  var f=input.files[0];
  if(!f) return;
  document.getElementById('vhist-file-name').textContent=f.name;
  var reader=new FileReader();
  reader.onload=function(e){
    try{
      var rows=ventahistReadRows(e.target.result);
      var res=ventahistParseRows(rows);
      if(res.error){ alert(res.error); return; }
      if(!res.parsed.length){ alert('No se pudo leer ninguna fila válida. Revisá el formato del archivo.'); return; }
      var excluidas=res.parsed.filter(function(r){return ventahistEstaExcluido(r.ticker);}).length;
      var limpio=res.parsed.filter(function(r){return !ventahistEstaExcluido(r.ticker);});
      if(_ventahistRows.length && !confirm('Ya tenés una base histórica guardada con '+_ventahistRows.length+' movimientos.\n¿Reemplazarla con este archivo ('+limpio.length+' movimientos)?')){ return; }
      _ventahistRows=limpio;
      vhistPersist();
      var statusTxt=limpio.length+' operaciones guardadas como base histórica';
      if(excluidas) statusTxt+=' · '+excluidas+' excluidas (splits: LONGVIE/ECOGAS/CELULOSA/FERRUM)';
      if(res.ignoradas) statusTxt+=' · '+res.ignoradas+' filas ignoradas (transferencias u otros códigos)';
      if(res.errores) statusTxt+=' · '+res.errores+' filas con error';
      document.getElementById('vhist-file-status').textContent=statusTxt;
      renderVentaHistorica();
    }catch(ex){
      alert('Error leyendo el archivo: '+ex.message);
    }
  };
  reader.readAsArrayBuffer(f);
}

function ventahistAddManual(){
  var especieEl=document.getElementById('vhist-add-especie');
  var fechaEl=document.getElementById('vhist-add-fecha');
  var tipoEl=document.getElementById('vhist-add-tipo');
  var qtyEl=document.getElementById('vhist-add-qty');
  var precioEl=document.getElementById('vhist-add-precio');
  var especie=(especieEl.value||'').trim();
  var fecha=ventahistParseFecha(fechaEl.value);
  var tipo=tipoEl.value;
  var qty=ventahistParseNum(qtyEl.value);
  var precio=ventahistParseNum(precioEl.value);
  if(!especie){ alert('Falta el ticker/especie.'); return; }
  if(ventahistEstaExcluido(especie)){ alert('Este activo está excluido de la base histórica (split conocido).'); return; }
  if(!fecha){ alert('Fecha inválida.'); return; }
  if(isNaN(qty)||qty<=0){ alert('Cantidad inválida.'); return; }
  if(isNaN(precio)||precio<0){ alert('Precio inválido.'); return; }
  var esBonoON=ventahistEsBonoON(especie);
  var mercado=esBonoON?'BONOS':'';
  var tipoActivo=ventahistClasificarTipo(especie,esBonoON);
  var maxIdx=_ventahistRows.reduce(function(m,r){return Math.max(m,r._idx||0);},-1);
  _ventahistRows.push({ticker:especie,fecha:fecha,tipo:tipo,qty:qty,precioARS:precio,mercado:mercado,tipoActivo:tipoActivo,_idx:maxIdx+1});
  vhistPersist();
  especieEl.value=''; qtyEl.value=''; precioEl.value='';
  ventahistResetFecha();
  document.getElementById('vhist-file-status').textContent=_ventahistRows.length+' movimientos en la base histórica';
  renderVentaHistorica();
}

function ventahistClearBase(){
  if(!_ventahistRows.length){ alert('La base histórica ya está vacía.'); return; }
  if(!confirm('¿Vaciar toda la base histórica guardada ('+_ventahistRows.length+' movimientos)? Esta acción no se puede deshacer.')) return;
  _ventahistRows=[];
  vhistPersist();
  document.getElementById('vhist-file-status').textContent='';
  document.getElementById('vhist-file-name').textContent='Sin archivo';
  renderVentaHistorica();
}

function vhistDivsPersist(){
  try{ localStorage.setItem((PFX+'vhist_divs'), JSON.stringify(_ventahistDivs)); }catch(e){}
  sbSetConfig('vhist_divs', _ventahistDivs);
}

function ventahistOnDivFile(input){
  var f=input.files[0];
  if(!f) return;
  document.getElementById('vhist-div-file-name').textContent=f.name;
  var reader=new FileReader();
  reader.onload=function(e){
    try{
      var rows=ventahistReadRows(e.target.result);
      var res=ventahistParseDivRows(rows);
      if(res.error){ alert(res.error); return; }
      if(!res.parsed.length){ alert('No se pudo leer ninguna fila de Dividendos/Renta válida. Revisá el formato del archivo.'); return; }
      var excluidas=res.parsed.filter(function(r){return ventahistEstaExcluido(r.ticker);}).length;
      var limpio=res.parsed.filter(function(r){return !ventahistEstaExcluido(r.ticker);});
      if(_ventahistDivs.length && !confirm('Ya tenés dividendos/rentas guardados ('+_ventahistDivs.length+').\n¿Reemplazarlos con este archivo ('+limpio.length+' cobros)?')){ return; }
      _ventahistDivs=limpio;
      vhistDivsPersist();
      var statusTxt=limpio.length+' cobros guardados (dividendos + rentas)';
      if(excluidas) statusTxt+=' · '+excluidas+' excluidos (splits)';
      if(res.ignoradas) statusTxt+=' · '+res.ignoradas+' filas ignoradas (canjes/rescates, no son renta)';
      if(res.errores) statusTxt+=' · '+res.errores+' filas con error';
      document.getElementById('vhist-div-file-status').textContent=statusTxt;
      renderVentaHistorica();
    }catch(ex){
      alert('Error leyendo el archivo: '+ex.message);
    }
  };
  reader.readAsArrayBuffer(f);
}

function ventahistClearDivs(){
  if(!_ventahistDivs.length){ alert('No hay dividendos/rentas guardados.'); return; }
  if(!confirm('¿Vaciar los dividendos/rentas guardados ('+_ventahistDivs.length+')? Esta acción no se puede deshacer.')) return;
  _ventahistDivs=[];
  vhistDivsPersist();
  document.getElementById('vhist-div-file-status').textContent='';
  document.getElementById('vhist-div-file-name').textContent='Sin archivo';
  renderVentaHistorica();
}

// ─── Aportes y Retiros (export "Movimientos de Pesos", cuenta corriente completa) ───
function ventahistParseAportesRows(rows){
  var hdrIdx=rows.findIndex(function(r){
    var n=r.map(cmpNorm);
    var hasOp=n.indexOf('operacion')>=0||n.indexOf('operación')>=0;
    return hasOp&&n.indexOf('importe')>=0&&n.indexOf('saldo')>=0;
  });
  if(hdrIdx<0) return {error:'No se encontró la tabla de Movimientos de Pesos (columnas Operación, Importe, Saldo).'};
  var hdr=rows[hdrIdx].map(cmpNorm);
  var opCol=hdr.findIndex(function(c){return c==='operacion'||c==='operación';});
  var impCol=hdr.indexOf('importe');
  var fCol=hdr.indexOf('operado')>=0?hdr.indexOf('operado'):hdr.indexOf('liquida');
  if(opCol<0||impCol<0||fCol<0){
    return {error:'Faltan columnas necesarias. Necesito: Operado/Liquida, Operación e Importe.'};
  }
  var parsed=[], ignoradas=0, errores=0;
  rows.slice(hdrIdx+1).forEach(function(r,idx){
    var op=cmpNorm(r[opCol]);
    if(op!=='pago'&&op!=='cobr'){ ignoradas++; return; }
    var fecha=ventahistParseFecha(r[fCol]);
    var importe=ventahistParseNum(r[impCol]);
    if(!fecha||isNaN(importe)||importe===0){ errores++; return; }
    var anio=parseInt(fecha.split('/')[2],10);
    parsed.push({fecha:fecha,anio:anio,tipo:(op==='pago'?'retiro':'aporte'),montoARS:Math.abs(importe),_idx:idx});
  });
  return {parsed:parsed,ignoradas:ignoradas,errores:errores};
}

function calcularAportesHistoricos(rows){
  return rows.map(function(r){
    var tc=getMEP(r.fecha)||MEP_HOY;
    var usd=tc>0?(r.montoARS/tc):0;
    return {fecha:r.fecha,anio:r.anio,tipo:r.tipo,usd:(r.tipo==='retiro'?-usd:usd)};
  });
}

function vhistAportesPersist(){
  try{ localStorage.setItem((PFX+'vhist_aportes'), JSON.stringify(_ventahistAportes)); }catch(e){}
  sbSetConfig('vhist_aportes', _ventahistAportes);
}

function ventahistOnAportesFile(input){
  var f=input.files[0];
  if(!f) return;
  document.getElementById('vhist-aportes-file-name').textContent=f.name;
  var reader=new FileReader();
  reader.onload=function(e){
    try{
      var rows=ventahistReadRows(e.target.result);
      var res=ventahistParseAportesRows(rows);
      if(res.error){ alert(res.error); return; }
      if(!res.parsed.length){ alert('No se encontraron movimientos PAGO/COBR válidos. Revisá el formato del archivo.'); return; }
      if(_ventahistAportes.length && !confirm('Ya tenés aportes/retiros guardados ('+_ventahistAportes.length+').\n¿Reemplazarlos con este archivo ('+res.parsed.length+' movimientos)?')){ return; }
      _ventahistAportes=res.parsed;
      vhistAportesPersist();
      var statusTxt=res.parsed.length+' movimientos de dinero guardados (PAGO/COBR)';
      if(res.ignoradas) statusTxt+=' · '+res.ignoradas+' filas ignoradas (otros códigos: transferencias internas, comisiones, mercado, etc.)';
      if(res.errores) statusTxt+=' · '+res.errores+' filas con error';
      document.getElementById('vhist-aportes-file-status').textContent=statusTxt;
      renderVentaHistorica();
    }catch(ex){
      alert('Error leyendo el archivo: '+ex.message);
    }
  };
  reader.readAsArrayBuffer(f);
}

function ventahistClearAportes(){
  if(!_ventahistAportes.length){ alert('No hay aportes/retiros guardados.'); return; }
  if(!confirm('¿Vaciar los aportes/retiros guardados ('+_ventahistAportes.length+')? Esta acción no se puede deshacer.')) return;
  _ventahistAportes=[];
  vhistAportesPersist();
  document.getElementById('vhist-aportes-file-status').textContent='';
  document.getElementById('vhist-aportes-file-name').textContent='Sin archivo';
  renderVentaHistorica();
}

function vhistCapitalSnapshotsAportes(aportesEventos){
  var ordenados=aportesEventos.slice().sort(function(a,b){
    var da=ventahistFechaKey(a.fecha), db=ventahistFechaKey(b.fecha);
    return da<db?-1:(da>db?1:0);
  });
  var cum=0, currentYear=null, snapshots={};
  ordenados.forEach(function(a){
    if(currentYear===null) currentYear=a.anio;
    while(currentYear<a.anio){ snapshots[currentYear]=cum; currentYear++; }
    cum+=a.usd;
  });
  if(currentYear!==null) snapshots[currentYear]=cum;
  return snapshots;
}

function vhistCapitalPorGrupoAnio(rows, groupOf){
  var pos={}, capitalPorGrupo={}, snapshots={}, currentYear=null;
  var ordenados=rows.slice().sort(function(a,b){
    var da=ventahistFechaKey(a.fecha), db=ventahistFechaKey(b.fecha);
    if(da!==db) return da<db?-1:1;
    return a._idx-b._idx;
  });
  ordenados.forEach(function(r){
    var anio=parseInt((r.fecha.split('/')[2])||'0',10);
    if(currentYear===null) currentYear=anio;
    while(currentYear<anio){ snapshots[currentYear]=Object.assign({},capitalPorGrupo); currentYear++; }
    var key=r.ticker;
    if(!pos[key]) pos[key]={qty:0,costUSDpuro:0};
    var p=pos[key];
    var esBonoON=(r.mercado==='BONOS'||r.mercado==='ON');
    var tc=esBonoON?(getMEP(r.fecha)||MEP_HOY):(getCCL(r.fecha)||CCL_HOY);
    var usdPuro=tc>0?(r.precioARS*r.qty/tc):0;
    var grupo=groupOf(r);
    if(capitalPorGrupo[grupo]===undefined) capitalPorGrupo[grupo]=0;
    if(r.tipo==='compra'){
      p.costUSDpuro+=usdPuro; p.qty+=r.qty;
      capitalPorGrupo[grupo]+=usdPuro;
    } else {
      var avgUSDpuro=p.qty>0.000001?p.costUSDpuro/p.qty:0;
      var qtyVendida=Math.min(r.qty,p.qty);
      var costBasis=avgUSDpuro*qtyVendida;
      p.costUSDpuro-=costBasis; p.qty-=qtyVendida;
      capitalPorGrupo[grupo]-=costBasis;
    }
  });
  if(currentYear!==null) snapshots[currentYear]=Object.assign({},capitalPorGrupo);
  return snapshots;
}

function vhistDenseYearMap(snapshots,minY,maxY,isObj){
  var dense={}, last=isObj?{}:0;
  for(var y=minY;y<=maxY;y++){
    if(snapshots[y]!==undefined) last=isObj?Object.assign({},snapshots[y]):snapshots[y];
    dense[y]=isObj?Object.assign({},last):last;
  }
  return dense;
}

function vhistApplyCapitalBase(matrix,capSnapshots){
  var years=matrix.years;
  var minY=years.length?Math.min.apply(null,years)-1:0;
  var maxY=years.length?Math.max.apply(null,years):0;
  var dense=vhistDenseYearMap(capSnapshots,minY,maxY,true);
  var out={years:years,groups:{}};
  Object.keys(matrix.groups).forEach(function(g){
    var src=matrix.groups[g];
    var perYear={}, totalCost=0;
    years.forEach(function(y){
      var capIni=(dense[y-1]&&dense[y-1][g])||0;
      var capFin=(dense[y]&&dense[y][g])||0;
      var capProm=(capIni+capFin)/2;
      var gan=(src.perYear[y]&&src.perYear[y].gan)||0;
      perYear[y]={cost:capProm,gan:gan};
      totalCost+=capProm;
    });
    out.groups[g]={perYear:perYear,totalCost:totalCost,totalGan:src.totalGan};
  });
  return out;
}

function calcularVentaHistorica(rows){
  var pos={};
  var ventas=[];
  var ordenados=rows.slice().sort(function(a,b){
    var da=ventahistFechaKey(a.fecha), db=ventahistFechaKey(b.fecha);
    if(da!==db) return da<db?-1:1;
    return a._idx-b._idx;
  });
  ordenados.forEach(function(r){
    var key=r.ticker;
    if(!pos[key]) pos[key]={ticker:key,qty:0,costUSDpuro:0,gananciaUSD:0,costBasisVendido:0,ventasCount:0,_sobreventa:0,tipoActivo:r.tipoActivo};
    var p=pos[key];
    var esBonoON=(r.mercado==='BONOS'||r.mercado==='ON');
    var tc=esBonoON?(getMEP(r.fecha)||MEP_HOY):(getCCL(r.fecha)||CCL_HOY);
    var usdPuro=tc>0?(r.precioARS*r.qty/tc):0;
    if(r.tipo==='compra'){
      p.costUSDpuro+=usdPuro;
      p.qty+=r.qty;
    } else {
      var avgUSDpuro=p.qty>0.000001?p.costUSDpuro/p.qty:0;
      var qtyVendida=Math.min(r.qty,p.qty);
      var costBasis=avgUSDpuro*qtyVendida;
      var proceeds=tc>0?(r.precioARS*qtyVendida/tc):0;
      var gananciaVenta=proceeds-costBasis;
      p.gananciaUSD+=gananciaVenta;
      p.costBasisVendido+=costBasis;
      p.costUSDpuro-=costBasis;
      p.qty-=qtyVendida;
      p.ventasCount++;
      if(r.qty>qtyVendida) p._sobreventa+=(r.qty-qtyVendida);
      if(qtyVendida>0.000001){
        var anio=parseInt((r.fecha.split('/')[2])||'0',10);
        ventas.push({ticker:key,fecha:r.fecha,anio:anio,tipoActivo:r.tipoActivo,gananciaUSD:gananciaVenta,costBasis:costBasis});
      }
    }
  });
  return {porTicker:Object.values(pos),ventas:ventas};
}

function vhistBuildMatrix(ventas, groupOf){
  var years=Array.from(new Set(ventas.map(function(v){return v.anio;}))).sort();
  var groups={};
  ventas.forEach(function(v){
    var g=groupOf(v);
    if(!groups[g]) groups[g]={perYear:{},totalCost:0,totalGan:0};
    var gr=groups[g];
    if(!gr.perYear[v.anio]) gr.perYear[v.anio]={cost:0,gan:0};
    gr.perYear[v.anio].cost+=v.costBasis;
    gr.perYear[v.anio].gan+=v.gananciaUSD;
    gr.totalCost+=v.costBasis;
    gr.totalGan+=v.gananciaUSD;
  });
  return {years:years,groups:groups};
}

function vhistRenderMatrix(matrix,rowOrder,rowHeaderLabel){
  var years=matrix.years, groups=matrix.groups;
  var rows=rowOrder.filter(function(k){return groups[k];});
  if(!rows.length) return '<div class="ibox">Sin datos.</div>';
  var cl=function(n){return n===null?'':(n>=0?'pos':'neg');};
  var fmtPct=function(n){return n===null?'—':(n>=0?'+':'')+n.toFixed(1)+'%';};
  var thead='<tr><th>'+rowHeaderLabel+'</th>'+years.map(function(y){return '<th class="mono" style="text-align:center">'+y+'</th>';}).join('')+'<th class="mono" style="text-align:center">Total</th></tr>';
  var totalsPerYear={}; years.forEach(function(y){totalsPerYear[y]={cost:0,gan:0};});
  var grandCost=0, grandGan=0;
  var bodyRows=rows.map(function(k){
    var gr=groups[k];
    var cells=years.map(function(y){
      var c=gr.perYear[y];
      if(c){totalsPerYear[y].cost+=c.cost;totalsPerYear[y].gan+=c.gan;}
      if(!c||c.cost<=0.000001) return '<td class="mono muted" style="text-align:center">—</td>';
      var pct=c.gan/c.cost*100;
      return '<td class="mono '+cl(pct)+'" style="text-align:center">'+fmtPct(pct)+'</td>';
    }).join('');
    var totalPct=gr.totalCost>0.000001?(gr.totalGan/gr.totalCost*100):null;
    grandCost+=gr.totalCost; grandGan+=gr.totalGan;
    return '<tr><td class="mono">'+k+'</td>'+cells+'<td class="mono '+cl(totalPct)+'" style="text-align:center;font-weight:600">'+fmtPct(totalPct)+'</td></tr>';
  }).join('');
  var totalCells=years.map(function(y){
    var t=totalsPerYear[y];
    if(t.cost<=0.000001) return '<td class="mono muted" style="text-align:center">—</td>';
    var pct=t.gan/t.cost*100;
    return '<td class="mono '+cl(pct)+'" style="text-align:center;font-weight:600">'+fmtPct(pct)+'</td>';
  }).join('');
  var grandPct=grandCost>0.000001?(grandGan/grandCost*100):null;
  var footRow='<tr style="border-top:1px solid var(--border)"><td class="mono" style="font-weight:600">Total</td>'+totalCells+'<td class="mono '+cl(grandPct)+'" style="text-align:center;font-weight:700">'+fmtPct(grandPct)+'</td></tr>';
  return '<div class="tw panel-table"><table><thead>'+thead+'</thead><tbody>'+bodyRows+footRow+'</tbody></table></div>';
}

function vhistRenderAnioTotal(ventas,capSnapshotsAportes){
  var years=Array.from(new Set(ventas.map(function(v){return v.anio;}))).sort();
  var cl=function(n){return n===null?'':(n>=0?'pos':'neg');};
  var fmtUSD=function(n){return (n>=0?'+':'')+'U$S '+n.toFixed(2);};
  var fmtPct=function(n){return n===null?'—':(n>=0?'+':'')+n.toFixed(2)+'%';};
  var porAnio={};
  years.forEach(function(y){porAnio[y]={cost:0,gan:0};});
  ventas.forEach(function(v){porAnio[v.anio].cost+=v.costBasis;porAnio[v.anio].gan+=v.gananciaUSD;});
  var denseCap=null;
  if(capSnapshotsAportes){
    var minY=years.length?Math.min.apply(null,years)-1:0;
    var maxY=years.length?Math.max.apply(null,years):0;
    denseCap=vhistDenseYearMap(capSnapshotsAportes,minY,maxY,false);
  }
  var cards=years.map(function(y){
    var a=porAnio[y];
    var pct, baseLabel='';
    if(denseCap){
      var capProm=((denseCap[y-1]||0)+(denseCap[y]||0))/2;
      pct=capProm>0.000001?(a.gan/capProm*100):null;
      baseLabel='<div class="metric-label" style="font-size:.5rem;opacity:.7">cap. prom. U$S '+capProm.toFixed(0)+'</div>';
    } else {
      pct=a.cost>0.000001?(a.gan/a.cost*100):null;
    }
    return '<div class="metric" style="padding:.4rem .6rem;flex:0 1 auto">'+
      '<div class="metric-label" style="font-size:.56rem">'+y+'</div>'+
      '<div class="metric-value '+cl(a.gan)+'" style="font-size:.8rem">'+fmtUSD(a.gan)+'</div>'+
      '<div class="metric-value '+cl(pct)+'" style="font-size:.68rem">'+fmtPct(pct)+'</div>'+
      baseLabel+
    '</div>';
  }).join('');
  return '<div style="display:flex;flex-wrap:wrap;gap:6px">'+cards+'</div>';
}

function vhistRenderDivsPorTicker(divEventos){
  if(!divEventos.length) return '';
  var porTicker={};
  divEventos.forEach(function(d){
    if(!porTicker[d.ticker]) porTicker[d.ticker]={usd:0,n:0,tipoActivo:d.tipoActivo};
    porTicker[d.ticker].usd+=d.usd;
    porTicker[d.ticker].n++;
  });
  var sorted=Object.keys(porTicker).map(function(k){return Object.assign({ticker:k},porTicker[k]);}).sort(function(a,b){return b.usd-a.usd;});
  var filas=sorted.map(function(p){
    return '<tr><td class="mono">'+p.ticker+'</td><td class="mono muted">'+p.tipoActivo+'</td><td class="mono">'+p.n+'</td><td class="mono pos">+U$S '+p.usd.toFixed(2)+'</td></tr>';
  }).join('');
  return '<div class="tw panel-table"><table><thead><tr><th>Ticker</th><th>Tipo</th><th># Cobros</th><th>Total USD</th></tr></thead><tbody>'+filas+'</tbody></table></div>';
}

function renderVentaHistorica(){
  var resumenEl=document.getElementById('vhist-resumen');
  var tablaEl=document.getElementById('vhist-ticker');
  var anioEl=document.getElementById('vhist-anio');
  var tipoEl=document.getElementById('vhist-tipo-anio');
  var rfrvEl=document.getElementById('vhist-rfrv-anio');
  var divsTickerEl=document.getElementById('vhist-divs-ticker');
  if(!resumenEl||!tablaEl) return;
  document.getElementById('vhist-count').textContent=_ventahistRows.length?(_ventahistRows.length+' movimientos guardados'):'Sin movimientos guardados';
  var vhDivCount=document.getElementById('vhist-div-count');
  if(vhDivCount) vhDivCount.textContent=_ventahistDivs.length?(_ventahistDivs.length+' cobros guardados'):'Sin dividendos/rentas guardados';
  var vhAportesCount=document.getElementById('vhist-aportes-count');
  if(vhAportesCount) vhAportesCount.textContent=_ventahistAportes.length?(_ventahistAportes.length+' movimientos guardados'):'Sin aportes/retiros guardados';

  var divEventos=calcularDividendosHistoricos(_ventahistDivs);
  if(divsTickerEl) divsTickerEl.innerHTML=vhistRenderDivsPorTicker(divEventos);

  if(!_ventahistRows.length && !divEventos.length){
    resumenEl.innerHTML='<div class="ibox">Subí un archivo o agregá movimientos a mano para ver el análisis.</div>';
    tablaEl.innerHTML='';
    if(anioEl) anioEl.innerHTML='';
    if(tipoEl) tipoEl.innerHTML='';
    if(rfrvEl) rfrvEl.innerHTML='';
    return;
  }
  var calc=calcularVentaHistorica(_ventahistRows);
  var resultados=calc.porTicker.filter(function(p){return p.ventasCount>0;});
  var ventas=calc.ventas;
  if(!resultados.length && !divEventos.length){
    resumenEl.innerHTML='<div class="ibox">No se detectaron ventas en la base guardada (¿solo cargaste compras?).</div>';
    tablaEl.innerHTML='';
    if(anioEl) anioEl.innerHTML='';
    if(tipoEl) tipoEl.innerHTML='';
    if(rfrvEl) rfrvEl.innerHTML='';
    return;
  }
  var totalGananciaCapital=resultados.reduce(function(s,p){return s+p.gananciaUSD;},0);
  var totalDivs=divEventos.reduce(function(s,d){return s+d.usd;},0);
  var totalGanancia=totalGananciaCapital+totalDivs;
  var totalCostBasis=resultados.reduce(function(s,p){return s+p.costBasisVendido;},0);
  var totalVentas=resultados.reduce(function(s,p){return s+p.ventasCount;},0);
  var totalPct=totalCostBasis>0?(totalGanancia/totalCostBasis*100):null;
  var cl=function(n){return n===null?'':(n>=0?'pos':'neg');};
  var fmtUSD=function(n){return (n>=0?'+':'')+'U$S '+n.toFixed(2);};
  var fmtPct=function(n){return n===null?'—':(n>=0?'+':'')+n.toFixed(2)+'%';};

  resumenEl.innerHTML=
    '<div style="display:flex;flex-wrap:wrap;gap:6px">'+
      '<div class="metric" style="padding:.4rem .6rem;flex:0 1 auto"><div class="metric-label" style="font-size:.56rem"># Ventas</div><div class="metric-value" style="font-size:.8rem">'+totalVentas+'</div></div>'+
      '<div class="metric" style="padding:.4rem .6rem;flex:0 1 auto"><div class="metric-label" style="font-size:.56rem">Costo base total</div><div class="metric-value" style="font-size:.8rem">U$S '+totalCostBasis.toFixed(2)+'</div></div>'+
      '<div class="metric" style="padding:.4rem .6rem;flex:0 1 auto"><div class="metric-label" style="font-size:.56rem">Dividendos/Rentas cobrados</div><div class="metric-value pos" style="font-size:.8rem">+U$S '+totalDivs.toFixed(2)+'</div></div>'+
      '<div class="metric" style="padding:.4rem .6rem;flex:0 1 auto"><div class="metric-label" style="font-size:.56rem">Ganancia neta total</div><div class="metric-value '+cl(totalGanancia)+'" style="font-size:.8rem">'+fmtUSD(totalGanancia)+'</div></div>'+
      '<div class="metric" style="padding:.4rem .6rem;flex:0 1 auto"><div class="metric-label" style="font-size:.56rem">Ganancia % total</div><div class="metric-value '+cl(totalPct)+'" style="font-size:.8rem">'+fmtPct(totalPct)+'</div></div>'+
    '</div>';

  var ventasConDivs=ventas.concat(divEventos.map(function(d){
    return {ticker:d.ticker,fecha:d.fecha,anio:d.anio,tipoActivo:d.tipoActivo,gananciaUSD:d.usd,costBasis:0};
  }));

  var capSnapshotsAportes=_ventahistAportes.length?vhistCapitalSnapshotsAportes(calcularAportesHistoricos(_ventahistAportes)):null;
  if(anioEl){
    anioEl.innerHTML=vhistRenderAnioTotal(ventasConDivs,capSnapshotsAportes);
  }
  if(tipoEl){
    var tipoMatrix=vhistBuildMatrix(ventasConDivs,function(v){return v.tipoActivo||'Argentina';});
    if(_ventahistRows.length){
      var capTipo=vhistCapitalPorGrupoAnio(_ventahistRows,function(r){return r.tipoActivo||'Argentina';});
      tipoMatrix=vhistApplyCapitalBase(tipoMatrix,capTipo);
    }
    tipoEl.innerHTML=vhistRenderMatrix(tipoMatrix,['Bonos','Argentina','Brasil','Cedear'],'Tipo');
  }
  if(rfrvEl){
    var rfrvMatrix=vhistBuildMatrix(ventasConDivs,function(v){return v.tipoActivo==='Bonos'?'RF':'RV';});
    if(_ventahistRows.length){
      var capRfrv=vhistCapitalPorGrupoAnio(_ventahistRows,function(r){return r.tipoActivo==='Bonos'?'RF':'RV';});
      rfrvMatrix=vhistApplyCapitalBase(rfrvMatrix,capRfrv);
    }
    rfrvEl.innerHTML=vhistRenderMatrix(rfrvMatrix,['RF','RV'],'RF/RV');
  }

  var sorted=resultados.slice().sort(function(a,b){return b.gananciaUSD-a.gananciaUSD;});
  var filas=sorted.map(function(p){
    var pct=p.costBasisVendido>0?(p.gananciaUSD/p.costBasisVendido*100):null;
    return '<tr>'+
      '<td class="mono">'+p.ticker+(p._sobreventa>0.000001?' ⚠️':'')+'</td>'+
      '<td class="mono muted">'+(p.tipoActivo||'')+'</td>'+
      '<td class="mono">'+p.ventasCount+'</td>'+
      '<td class="mono muted">U$S '+p.costBasisVendido.toFixed(2)+'</td>'+
      '<td class="mono '+cl(p.gananciaUSD)+'">'+fmtUSD(p.gananciaUSD)+'</td>'+
      '<td class="mono '+cl(pct)+'">'+fmtPct(pct)+'</td>'+
      '<td class="mono muted">'+(p.qty>0.000001?p.qty.toFixed(2):'—')+'</td>'+
    '</tr>';
  }).join('');
  tablaEl.innerHTML='<div class="tw panel-table"><table>'+
    '<thead><tr><th>Ticker</th><th>Tipo</th><th># Ventas</th><th>Costo base</th><th>Ganancia neta</th><th>Ganancia %</th><th>Qty restante</th></tr></thead>'+
    '<tbody>'+filas+'</tbody></table></div>'+
    (sorted.some(function(p){return p._sobreventa>0.000001;})?'<div class="ibox" style="margin-top:8px;font-size:.68rem">⚠️ Los tickers marcados vendieron más cantidad de la que compraron dentro del archivo — probablemente ya tenías posición antes del rango de fechas subido, así que esa parte no tiene costo base cargado y no entra en el cálculo de ganancia.</div>':'');
}

function tcStampearFecha(fecha,esBonoON,valor){
  if(!fecha||!(valor>0)) return;
  var _fk=fmtKey(fecha);
  var tabla=esBonoON?MEP_TABLE:CCL_TABLE;
  if(tabla[_fk]) return;
  tabla[_fk]=valor;
  try{
    localStorage.setItem((PFX+'ccl_override'),JSON.stringify(CCL_TABLE));
    localStorage.setItem((PFX+'mep_override'),JSON.stringify(MEP_TABLE));
  }catch(e){}
  _tcSbPersist();
}
var BACKFILL_DISPERSION_MAX = 15;
function backfillTCDesdeMovimientos(){
  var grupos={ccl:{},mep:{}};
  movimientos.forEach(function(m){
    if((m.tipo!=='compra'&&m.tipo!=='venta')||!(m.ccl>0)) return;
    var esBonoON=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI');
    var g=esBonoON?grupos.mep:grupos.ccl;
    var fk=fmtKey(m.fecha);
    if(!g[fk]) g[fk]={suma:0,n:0,min:m.ccl,max:m.ccl};
    g[fk].suma+=m.ccl;g[fk].n++;
    if(m.ccl<g[fk].min)g[fk].min=m.ccl;
    if(m.ccl>g[fk].max)g[fk].max=m.ccl;
  });
  var completados=0,revisar=[];
  [['ccl',CCL_TABLE,'CCL'],['mep',MEP_TABLE,'MEP']].forEach(function(par){
    var grupo=grupos[par[0]],tabla=par[1],label=par[2];
    Object.keys(grupo).forEach(function(fk){
      if(tabla[fk]) return;
      var g=grupo[fk];
      if((g.max-g.min)>BACKFILL_DISPERSION_MAX){
        revisar.push(fk+' ('+label+': min '+g.min+' / max '+g.max+')');
        return;
      }
      tabla[fk]=Math.round((g.suma/g.n)*10)/10;completados++;
    });
  });
  if(completados>0){
    try{
      localStorage.setItem((PFX+'ccl_override'),JSON.stringify(CCL_TABLE));
      localStorage.setItem((PFX+'mep_override'),JSON.stringify(MEP_TABLE));
    }catch(e){}
    _tcSbPersist();
  }
  return {completados:completados,revisar:revisar};
}
function backfillTCDesdeMovimientosUI(){
  var r=backfillTCDesdeMovimientos();
  renderMovimientos();
  var msg=r.completados>0
    ? ('Se completaron '+r.completados+' fecha'+(r.completados!==1?'s':'')+' en la tabla histórica de CCL/MEP, usando lo que ya estaba guardado en tus movimientos.')
    : 'No había nada para completar automáticamente: o ya estaba todo en la tabla, o ningún movimiento pendiente tiene un CCL/MEP guardado para usar de base.';
  if(r.revisar.length){
    msg+='\n\n⚠️ '+r.revisar.length+' fecha'+(r.revisar.length!==1?'s':'')+' con valores muy distintos entre sí ese mismo día (probable error de tipeo en alguno) — no se completaron solas, revisalas a mano en la solapa "$ Tipo de Cambio":\n'+r.revisar.join('\n');
  }
  alert(msg);
}

// ─── ⚠️ Errores de carga en movimientos ───────────────────────────────────────
var _movSoloProb=false,_movProbCache=null,_movProbKey='';
function _movUnitUSD(m){
  var bo=(m.mercado==='BONOS'||m.mercado==='ON'),mep=bo||m.mercado==='FCI',ars=(m.mercado==='ARGENTINA'||mep);
  if(ars&&(m.precioARS||0)>0){if(isBonoUSDDirecto(m.ticker))return m.precioARS;var tc=(mep?(getMEP(m.fecha)||getCCL(m.fecha)):getCCL(m.fecha))||m.ccl;return tc>0?m.precioARS/tc:null;}
  return (m.precioUSD||0)>0?m.precioUSD:null;
}
function movProblemas(){
  var key=movimientos.length+'|'+(movimientos.length?movimientos[movimientos.length-1].id:'');
  if(_movProbCache&&_movProbKey===key)return _movProbCache;
  var P={},add=function(m,t){(P[m.id]=P[m.id]||[]).push(t);},hoy=_flujosHoyStr();
  var ops=movimientos.filter(function(m){return m&&(m.tipo==='compra'||m.tipo==='venta');});
  ops.forEach(function(m){
    var iso=_phIso(m.fecha);
    if(!iso||isNaN(Date.parse(iso)))add(m,'fecha inválida ('+(m.fecha||'vacía')+')');else if(iso>hoy)add(m,'fecha futura ('+m.fecha+')');
    if(!m.ticker||!String(m.ticker).trim())add(m,'sin ticker');
    if(!(+m.qty>0))add(m,'cantidad en 0 o negativa');
    if(!((m.precioARS||0)>0)&&!((m.precioUSD||0)>0))add(m,'sin precio');
  });
  var vis={};ops.forEach(function(m){var k=[m.fecha,m.tipo,m.ticker,m.qty,m.precioARS||m.precioUSD,m.cartera||'principal'].join('|');(vis[k]=vis[k]||[]).push(m);});
  Object.keys(vis).forEach(function(k){if(vis[k].length>1)vis[k].forEach(function(m){add(m,'posible duplicado ('+vis[k].length+' iguales: misma fecha, cantidad y precio)');});});
  var q={};ops.slice().sort(function(a,b){var x=_phIso(a.fecha)||'',y=_phIso(b.fecha)||'';return x<y?-1:x>y?1:(a.tipo==='compra'?-1:1);}).forEach(function(m){
    if(m.owner==='cristian')return;var k=(m.cartera||'principal')+'|'+m.ticker,n=+m.qty||0;
    if(m.tipo==='compra')q[k]=(q[k]||0)+n;else{var ten=q[k]||0;if(n>ten*1.0001+0.0001)add(m,'vende '+n+' y a esa fecha tenías '+Math.round(ten*10000)/10000);q[k]=ten-n;}});
  var byT={};ops.forEach(function(m){var u=_movUnitUSD(m),i=_phIso(m.fecha);if(u>0&&i)(byT[m.ticker]=byT[m.ticker]||[]).push({m:m,u:u,t:Date.parse(i)});});
  Object.keys(byT).forEach(function(t){var L=byT[t];if(L.length<3)return;
    L.forEach(function(a){var o=L.filter(function(b){return b!==a&&Math.abs(b.t-a.t)<=180*86400000;}).map(function(b){return b.u;}).sort(function(x,y){return x-y;});if(o.length<2)return;
      var med=o[Math.floor(o.length/2)],r=a.u/med;
      if(r>2.5||r<0.4)add(a.m,'precio USD '+a.u.toFixed(a.u<10?3:2)+' muy distinto a tus otras operaciones de '+t+' (en torno a '+med.toFixed(med<10?3:2)+'): ¿tipo de cambio, precio por 100 o split?');});});
  _movProbCache=P;_movProbKey=key;return P;
}
function _movProbIcon(m){var p=movProblemas()[m.id];if(!p)return '';var txt=p.join(' · ').replace(/</g,'&lt;');
  return ' <span onclick="event.stopPropagation();var n=this.nextElementSibling;n.style.display=n.style.display===\'none\'?\'block\':\'none\'" title="Tocá para ver el motivo" style="color:var(--amber,#eab308);cursor:pointer">⚠️</span>'+
    '<span style="display:'+(_movSoloProb?'block':'none')+';font-weight:400;font-size:.66rem;color:var(--amber,#eab308);white-space:normal;max-width:320px;margin-top:3px;line-height:1.35">'+txt+'</span>';}
function movProbBanner(){
  var wrap=document.getElementById('mov-wrap');if(!wrap)return;var el=document.getElementById('mov-prob');
  if(!el){el=document.createElement('div');el.id='mov-prob';wrap.parentNode.insertBefore(el,wrap);}
  var n=Object.keys(movProblemas()).length;
  if(!n){el.innerHTML='';_movSoloProb=false;return;}
  el.innerHTML='<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:6px 0 8px;padding:7px 12px;border:1px solid rgba(234,179,8,.4);background:rgba(234,179,8,.08);border-radius:8px;font-size:.74rem;color:var(--amber,#eab308)">⚠️ <b>'+n+' movimiento'+(n>1?'s':'')+' para revisar</b><span style="color:var(--text3)">(tocá el ⚠️ de cada uno para ver el motivo; con "Ver solo esos" se muestran todos)</span>'+
    '<button class="btn btn-sm" style="margin-left:auto" onclick="_movSoloProb=!_movSoloProb;renderMovimientos()">'+(_movSoloProb?'Ver todos':'Ver solo esos')+'</button></div>';
}

function checkMovSinTC(){
  var warn=document.getElementById('warn-sin-tc');
  if(!warn) return;
  var malos=movimientos.filter(function(m){
    return (m.tipo==='compra'||m.tipo==='venta') && !(m.ccl&&m.ccl>0);
  });
  if(!malos.length){warn.style.display='none';warn.innerHTML='';return;}
  warn.style.display='';
  var lista=malos.slice(0,8).map(function(m){return m.ticker+' ('+m.fecha+')'}).join(', ')+(malos.length>8?' y '+(malos.length-8)+' más':'');
  warn.innerHTML='⚠️ '+malos.length+' movimiento'+(malos.length!==1?'s':'')+' sin CCL/MEP: <span style="opacity:.85">'+lista+'</span>';
}

function renderMovimientos(){
  var body=document.getElementById('mov-body');
  var empty=document.getElementById('mov-empty');
  var wrap=document.getElementById('mov-wrap');
  var filterEl=document.getElementById('mov-filter');
  
  var currentFilterVal=(filterEl?(filterEl.value||'').trim().toUpperCase():'');
  var filterTipo=(document.getElementById('mov-filter-tipo')||{value:''}).value.toLowerCase();
  var filterMkt=(document.getElementById('mov-filter-mkt')||{value:''}).value.toUpperCase();
  var filterFecha=(document.getElementById('mov-filter-fecha')||{value:''}).value.trim();
  var filterNotas=(document.getElementById('mov-filter-notas')||{value:''}).value.trim().toLowerCase();
  var filterNoCCL=(document.getElementById('mov-filter-noccl')||{checked:false}).checked;
  var filterNoMEP=(document.getElementById('mov-filter-nomep')||{checked:false}).checked;
  var activeFocusId=document.activeElement?document.activeElement.id:null;

  var filterVal=currentFilterVal;

  var _fk=function(m){var f=String(m.fecha||'');if(/^\d{4}-\d{2}-\d{2}/.test(f))return f.slice(0,10).replace(/-/g,'');var p=f.split('/');return p.length===3?p[2]+String(p[1]).padStart(2,'0')+String(p[0]).padStart(2,'0'):'0';};
  var lista=movimientos.slice().sort(function(a,b){var c=_fk(b).localeCompare(_fk(a));if(c)return c;return (+b.id||0)-(+a.id||0);});
  var filterCartera=(document.getElementById('mov-filter-cartera')||{value:''}).value;
  if(filterCartera) lista=lista.filter(function(m){return (m.cartera||'principal')===filterCartera;});
  if(filterVal) lista=lista.filter(function(m){return (m.ticker||'').toUpperCase().indexOf(filterVal)>=0;});
  if(filterTipo) lista=lista.filter(function(m){return (m.tipo||'').toLowerCase()===filterTipo;});
  if(filterMkt) lista=lista.filter(function(m){
    var mLabel=(m.mercado==='USA'?'NYSE':m.mercado==='ETF'?'ETF':(m.mercado||'')).toUpperCase();
    return mLabel===filterMkt;
  });
  if(filterFecha) lista=lista.filter(function(m){return (m.fecha||'').indexOf(filterFecha)>=0;});
  if(filterNotas) lista=lista.filter(function(m){return (m.notas||'').toLowerCase().indexOf(filterNotas)>=0;});
  if(filterNoCCL) lista=lista.filter(function(m){
    if(m.tipo!=='compra'&&m.tipo!=='venta')return false;
    var usaMep=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI');
    if(usaMep)return false;
    return !getCCL(m.fecha);
  });
  if(filterNoMEP) lista=lista.filter(function(m){
    if(m.tipo!=='compra'&&m.tipo!=='venta')return false;
    var usaMep=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI');
    if(!usaMep)return false;
    return !getMEP(m.fecha);
  });

  _movProbCache=null;try{movProbBanner();}catch(e){}
  if(_movSoloProb){var _pp=movProblemas();lista=lista.filter(function(m){return !!_pp[m.id];});}
  var anyFilter=_movSoloProb||filterVal||filterTipo||filterMkt||filterFecha||filterNotas||filterCartera||filterNoCCL||filterNoMEP;
  document.getElementById('mov-count').textContent=movimientos.length+(anyFilter?' ('+lista.length+' filtrados)':'');
  var btnPurgar=document.getElementById('btn-purgar-ticker');
  if(btnPurgar)btnPurgar.style.display=(filterVal&&!filterTipo&&!filterMkt&&!filterFecha&&!filterNotas)?'':'none';
  checkMovSinTC();
  if(!lista.length){empty.style.display='';wrap.style.display='none';return;}
  empty.style.display='none';wrap.style.display='';

  body.innerHTML=lista.map(function(m){
    var mLabel=m.mercado==='USA'?'NYSE':m.mercado==='ETF'?'ETF':(m.mercado||'—');
    var sid="'"+String(m.id)+"'";
    var canReduce=m.tipo==='compra'&&m.qty>0;
    var reduceHtml=canReduce
      ? '<span style="display:inline-flex;align-items:center;gap:3px">'+
          '<input id="red-qty-'+m.id+'" type="number" min="0.001" step="any" placeholder="-qty" style="width:54px;background:var(--bg);border:1px solid var(--border2);border-radius:4px;color:var(--text);font-family:var(--mono);font-size:.65rem;padding:2px 4px;height:22px">'+
          '<button class="btn btn-sm" style="color:var(--amber);border-color:#3e2c10" onclick="reduceMov('+sid+')">−</button>'+
        '</span>'
      : '';
    var _mEsBonoON=(m.mercado==='BONOS'||m.mercado==='ON');
    var _mEsFci=(m.mercado==='FCI');
    var _mEsARS=(m.mercado==='ARGENTINA'||_mEsBonoON||_mEsFci);
    var _mUsaMep=(_mEsBonoON||_mEsFci);
    var _mMepTabla=_mUsaMep?getMEP(m.fecha):null;
    var _mCclTabla=getCCL(m.fecha);
    var _mTcTabla=_mUsaMep?(_mMepTabla||_mCclTabla):_mCclTabla;
    var _mTcEfectivo=_mTcTabla||m.ccl||null;
    var _mPrecioUSD=(_mEsARS&&(m.precioARS||0)>0&&_mTcEfectivo>0)
      ?(m.precioARS/_mTcEfectivo)
      :(m.precioUSD||null);
    var _mSinMEP=_mUsaMep&&!_mMepTabla;
    var _mCCLstr;
    if(_mTcTabla){
      var _mWarnInline=_mSinMEP?' <span style="color:var(--amber)" title="No hay MEP en la tabla histórica para '+m.fecha+'. Se está usando el CCL de esa fecha ('+Math.round(_mCclTabla)+') como aproximación.">⚠MEP</span>':'';
      _mCCLstr=String(Math.round(_mTcTabla))+(_mTcTabla===m.ccl?'':' ✓')+_mWarnInline;
    } else {
      _mCCLstr=m.ccl?'<span style="color:var(--red)" title="No hay '+(_mUsaMep?'MEP':'CCL')+' en la tabla histórica para '+m.fecha+'. Se está usando '+m.ccl+' cargado a mano en el movimiento, que puede no ser el valor real de ese día.">⚠ '+m.ccl+'</span>':'—';
    }
    return '<tr>'+
      '<td class="mono">'+m.fecha+'</td>'+
      '<td><span class="badge badge-'+m.tipo+'">'+m.tipo+'</span></td>'+
      '<td><span class="mkt">'+mLabel+'</span></td>'+
      '<td style="font-weight:600">'+m.ticker+_movProbIcon(m)+((m.cartera==='cocos')?' <span style="font-size:.55rem;font-weight:600;padding:1px 5px;border-radius:8px;background:#2a1650;color:#c9a6ff;border:1px solid #5b2f8f">COCOS</span>':(m.cartera==='vetajeep')?' <span style="font-size:.55rem;font-weight:600;padding:1px 5px;border-radius:8px;background:#2b2410;color:#e0c674;border:1px solid #5c4a1f">VETAJEEP</span>':'')+'</td>'+
      '<td class="mono">'+(m.qty||'')+'</td>'+
      '<td class="mono">'+(m.precioARS?'$'+(_mEsBonoON?m.precioARS*100:m.precioARS).toLocaleString('es-AR'):'')+'</td>'+
      '<td class="mono muted">'+_mCCLstr+'</td>'+
      '<td class="mono">'+(_mPrecioUSD?'$'+_mPrecioUSD.toFixed(4):'—')+'</td>'+
      '<td class="mono muted">'+(m.comisionPct?m.comisionPct.toFixed(2)+'%':'0%')+'</td>'+
      (function(){
        var comAbs=m.comision||0;
        var totalARS=(m.qty||0)*(m.precioARS||0)+comAbs;
        var tcRow=_mTcEfectivo||_mTcTabla||m.ccl||0;
        var totalUSD=tcRow>0?totalARS/tcRow:null;
        return '<td class="mono" style="color:var(--amber)">'+(comAbs>0?'$'+Math.round(comAbs).toLocaleString('es-AR'):'—')+'</td>'+
               '<td class="mono" style="color:var(--accent)">'+(totalARS>0?'$'+Math.round(totalARS).toLocaleString('es-AR'):'—')+'</td>'+
               '<td class="mono" style="color:var(--accent)">'+(totalUSD&&totalUSD>0?'U$S '+totalUSD.toFixed(0):'—')+'</td>';
      })()+
      '<td class="muted" style="max-width:100px;overflow:hidden;text-overflow:ellipsis">'+(m.notas||'')+'</td>'+
      '<td style="white-space:nowrap">'+
        '<div style="display:flex;align-items:center;gap:4px;flex-wrap:nowrap">'+
          reduceHtml+
          '<button class="btn btn-sm" onclick="toggleFinish('+sid+')" title="A finish" style="'+(m.finish?'color:var(--amber);border-color:#3e2c10':'opacity:.3')+'">🏁</button>'+
          '<button class="btn btn-sm" onclick="movModalOpen('+sid+')" title="Editar">✎</button>'+
          '<button class="btn btn-d btn-sm" onclick="deleteMov('+sid+')" title="Borrar">✕</button>'+
        '</div>'+
      '</td>'+
    '</tr>';
  }).join('');

  requestAnimationFrame(function(){
    var filterElNew=document.getElementById('mov-filter');
    var filterTipoNew=document.getElementById('mov-filter-tipo');
    var filterMktNew=document.getElementById('mov-filter-mkt');
    var filterFechaNew=document.getElementById('mov-filter-fecha');
    var filterNotasNew=document.getElementById('mov-filter-notas');
    
    if(filterElNew&&currentFilterVal)filterElNew.value=currentFilterVal;
    if(filterTipoNew&&filterTipo)filterTipoNew.value=filterTipo;
    if(filterMktNew&&filterMkt)filterMktNew.value=filterMkt;
    if(filterFechaNew&&filterFecha)filterFechaNew.value=filterFecha;
    if(filterNotasNew&&filterNotas)filterNotasNew.value=filterNotas;
    
    if(activeFocusId){
      var elToFocus=document.getElementById(activeFocusId);
      if(elToFocus)elToFocus.focus();
    }
    
    if(anyFilter&&!_movWasFiltered){
      wrap.scrollTop=0;
      var content=document.querySelector('.content');
      var cardHeader=document.querySelector('#mov-card .card-header');
      var headerH=cardHeader?cardHeader.getBoundingClientRect().bottom:0;
      var wrapTop=wrap.getBoundingClientRect().top;
      if(content&&wrapTop>headerH+4){
        content.scrollTop+=wrapTop-headerH;
      }
    }
    _movWasFiltered=anyFilter;
  });
}

function getPositions(){
  var pos={};
  var lots={};

  var ordenados = movimientos.filter(function(m){return m&&(typeof CARTERA_ACTIVA==='undefined'||(m.cartera||'principal')===CARTERA_ACTIVA);}).sort(function(a,b){
    var fa=(a&&a.fecha||'').split('/'), fb=(b&&b.fecha||'').split('/');
    var da = fa.length===3? fa[2]+fa[1].padStart(2,'0')+fa[0].padStart(2,'0') : '0';
    var db = fb.length===3? fb[2]+fb[1].padStart(2,'0')+fb[0].padStart(2,'0') : '0';
    if(da!==db) return da<db?-1:1;
    return (a&&a.id||0)-(b&&b.id||0);
  });

  ordenados.forEach(function(m){
    if(!m||m.tipo==='aporte')return;
    if(m.owner==='cristian')return;
    var key=m.ticker;
    if(!pos[key])pos[key]={ticker:m.ticker,mercado:m.mercado,qty:0,costUSD:0,costARS:0,costUSDpuro:0,realizedPnl:0,dividendsUSD:0};
    else if(m.mercado)pos[key].mercado=m.mercado;
    var p=pos[key];
    if(!lots[key])lots[key]=[];
    var priceUSD=m.precioUSD||0;
    var comUSD=m.comision||0;
    if(m.tipo==='dividendo'){p.dividendsUSD+=priceUSD;}
    else if(m.tipo==='compra'){
      var _tc=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI')
        ?(getMEP(m.fecha)||getCCL(m.fecha)||m.ccl||MEP_HOY||CCL_HOY)
        :(getCCL(m.fecha)||m.ccl||CCL_HOY);
      var usdPuro=isBonoUSDDirecto(m.ticker)?(m.precioARS||0)*m.qty:(_tc>0&&(m.precioARS||0)>0?(m.precioARS||0)*m.qty/_tc:priceUSD*m.qty);
      p.costUSD+=usdPuro+comUSD;
      p.costARS+=(m.precioARS||0)*m.qty;
      p.costUSDpuro+=usdPuro;
      p.qty+=m.qty;
      if(m.qty>0)lots[key].push({
        qtyOpen:m.qty,
        unitUSD:(usdPuro+comUSD)/m.qty,
        unitUSDpuro:usdPuro/m.qty,
        unitARS:(m.precioARS||0),
        fecha:m.fecha, id:m.id
      });
    }
    else if(m.tipo==='venta'){
      var _tcV=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI')
        ?(getMEP(m.fecha)||getCCL(m.fecha)||m.ccl||MEP_HOY||CCL_HOY)
        :(getCCL(m.fecha)||m.ccl||CCL_HOY);
      var ventaUSDpuro=isBonoUSDDirecto(m.ticker)?(m.precioARS||0):(_tcV>0?(m.precioARS||0)/_tcV:(m.precioUSD||0));
      var openLots=lots[key]||[];
      var qtyTotalOpen=openLots.reduce(function(s,l){return s+l.qtyOpen;},0);

      if(m.loteMethod==='barato'&&qtyTotalOpen>0.000001){
        var ordenLotes=openLots.slice().sort(function(a,b){return a.unitUSDpuro-b.unitUSDpuro;});
        var restante=Math.min(m.qty,qtyTotalOpen);
        var costBasisUSD=0,costBasisUSDpuro=0,costBasisARS=0;
        for(var i=0;i<ordenLotes.length&&restante>0.000001;i++){
          var lot=ordenLotes[i];
          if(lot.qtyOpen<=0.000001)continue;
          var take=Math.min(lot.qtyOpen,restante);
          costBasisUSD+=take*lot.unitUSD;
          costBasisUSDpuro+=take*lot.unitUSDpuro;
          costBasisARS+=take*lot.unitARS;
          lot.qtyOpen-=take;
          restante-=take;
        }
        var qtyVendidaEfectiva=m.qty-restante;
        var proceedsPuro=ventaUSDpuro*qtyVendidaEfectiva-comUSD;
        p.realizedPnl+=proceedsPuro-costBasisUSDpuro;
        p.costUSD-=costBasisUSD;
        p.costARS-=costBasisARS;
        p.costUSDpuro-=costBasisUSDpuro;
        p.qty-=qtyVendidaEfectiva;
        m.gananciaUSD=proceedsPuro-costBasisUSDpuro;
        m.costBasisUSD=costBasisUSDpuro;
        m.gananciaPct=costBasisUSDpuro>0?(m.gananciaUSD/costBasisUSDpuro*100):null;
      } else {
        var avg=p.qty>0?p.costUSD/p.qty:0;
        var avgARS=p.qty>0?p.costARS/p.qty:0;
        var avgUSDpuro=p.qty>0?p.costUSDpuro/p.qty:0;
        var costBasisPuro=avgUSDpuro*m.qty;
        var proceedsPuro=ventaUSDpuro*m.qty-comUSD;
        p.realizedPnl+=proceedsPuro-costBasisPuro;
        p.costUSD-=avg*m.qty;
        p.costARS-=avgARS*m.qty;
        p.costUSDpuro-=costBasisPuro;
        p.qty-=m.qty;
        m.gananciaUSD=proceedsPuro-costBasisPuro;
        m.costBasisUSD=costBasisPuro;
        m.gananciaPct=costBasisPuro>0?(m.gananciaUSD/costBasisPuro*100):null;
        if(qtyTotalOpen>0.000001){
          var frac=m.qty/qtyTotalOpen;
          openLots.forEach(function(l){ l.qtyOpen-=l.qtyOpen*frac; });
        }
      }
    }
  });

  if(typeof TRK!=='undefined'&&TRK.divs&&TRK.divs.length){
    TRK.divs.forEach(function(d){
      var _mPPC=(d.montoPPC!=null)?d.montoPPC:d.montoUSD;
      if(!d.pncApplied||!_mPPC)return;
      var p=pos[d.ticker];
      if(!p)return;
      if(d.pncTarget==='ppc'){p.costUSDpuro-=_mPPC;}
      else if(d.pncTarget==='venta'){p.realizedPnl+=d.montoUSD;}
    });
  }

  return Object.values(pos);
}

// ─── Perf: getPositions() se calcula UNA vez por render de Portafolio ───
var _GP_ON=0,_GP_CACHE={};
var _getPositionsRaw=getPositions;
getPositions=function(){
  if(!_GP_ON)return _getPositionsRaw.apply(this,arguments);
  var k=(typeof CARTERA_ACTIVA!=='undefined'?CARTERA_ACTIVA:'')+'|'+((typeof movimientos!=='undefined'&&movimientos)?movimientos.length:0);
  if(!_GP_CACHE[k])_GP_CACHE[k]=_getPositionsRaw.apply(this,arguments);
  return _GP_CACHE[k];
};
var _renderPortfolioRaw=renderPortfolio;
renderPortfolio=function(){
  _GP_ON++;
  try{return _renderPortfolioRaw.apply(this,arguments);}
  finally{_GP_ON--;if(!_GP_ON)_GP_CACHE={};}
};

function renderPortfolio(){
  var all=getPositions();
  var open=all.filter(function(p){return p.qty>0.000001;}).sort(function(a,b){return a.ticker.localeCompare(b.ticker);});
  var _calCobros=calcularCalendarioCobros();
  var _flujoProx30Map=_flujosMapaProx30(_calCobros);
  renderFlujosMiniResumen(_calCobros);
  var _divHistorySet=calcularDivHistUpcoming30();
  var empty=document.getElementById('pos-empty');
  var totalVal=0,totalCost=0;
  var totalRpnl=all.reduce(function(a,p){return a+p.realizedPnl;},0);
  var totalDivs=dividendos.reduce(function(a,d){return a+(d.usd||0);},0);
  if(!open.length){
    empty.style.display='';
    ['m-val','m-ganancia','m-divs','m-count'].forEach(function(id){document.getElementById(id).textContent='—';});document.getElementById('m-rend').innerHTML='—';
    
    return;
  }
  empty.style.display='none';
  var sectorCost={nyse:0,bonos:0,argentina:0,brasil:0,europa:0,on:0,china:0,cripto:0,fci:0};
  var sectorVal={nyse:0,bonos:0,argentina:0,brasil:0,europa:0,on:0,china:0,cripto:0,fci:0};
  var finishTickers=new Set(movimientos.filter(function(m){return m.finish;}).map(function(m){return m.ticker;}));
  open.forEach(function(p){
    var q=quotes[p.ticker];var price=q?q.price:null;
    var ratio=getRatio(p.ticker);var sector=getSector(p.ticker);
    var _sectorIsARS=(getSector(p.ticker)==='argentina'||getSector(p.ticker)==='bonos'||getSector(p.ticker)==='on');
    var _isBonoON=(sector==='bonos'||sector==='on');
    var _isBRL=BRL_TICKERS.has(p.ticker);
    var fromByma=q&&q.fromByma;
    var mercadoCedearARS=price!=null?(_sectorIsARS||_isBRL?price:fromByma?price:(price/ratio)*CCL_HOY):null;
    var inversionCedearARS=isBonoUSDDirecto(p.ticker)?p.costUSDpuro*100:(mercadoCedearARS!=null?(_isBonoON?mercadoCedearARS*p.qty/100:mercadoCedearARS*p.qty):p.costARS);
    var _tcVal=(CFG.valuarMEP!==false&&MEP_HOY>0)?MEP_HOY:CCL_HOY;
    var valueUSD=price!=null?(sector==='fci'?(price/(MEP_HOY||CCL_HOY))*p.qty:_sectorIsARS?(_isBonoON?(price/MEP_HOY)*p.qty/100:(price/_tcVal)*p.qty):_isBRL?(price/_tcVal)*p.qty:fromByma?(price/_tcVal)*p.qty:(price/ratio)*p.qty*(CCL_HOY/_tcVal)):null;
    if(valueUSD!=null){totalVal+=valueUSD;sectorVal[sector]=(sectorVal[sector]||0)+valueUSD;}p._valueUSD=valueUSD;
    totalCost+=p.costUSDpuro;
    sectorCost[sector]=(sectorCost[sector]||0)+p.costUSDpuro;
    p._mktARS=mercadoCedearARS;
    p._invARS=inversionCedearARS;
  });

  var sectorTotalMktARS={nyse:0,bonos:0,argentina:0,brasil:0,europa:0,on:0,china:0,cripto:0,fci:0};
  open.forEach(function(p){
    var sec=getSector(p.ticker);
    sectorTotalMktARS[sec]=(sectorTotalMktARS[sec]||0)+(p._invARS||0);
  });

  // ── Auto-cálculo RV (NYSE + Argentina + Brasil + Europa + China + Cripto) ──
  var rvSectors=['nyse','argentina','brasil','europa','china','cripto'];
  var rvMktARS=rvSectors.reduce(function(s,sec){return s+(sectorTotalMktARS[sec]||0);},0);
  var rfMktARS=(sectorTotalMktARS.bonos||0)+(sectorTotalMktARS.on||0);
  var cclHoyRV=CCL_HOY>0?CCL_HOY:1;
  var totalRVusd=rvMktARS/cclHoyRV;
  var rv2pctARS=Math.round(rvMktARS*0.02);
  var rv3pctARS=Math.round(rvMktARS*0.03);
  var elRVtotal=document.getElementById('rv-total-usd');
  var elRV2=document.getElementById('rv-auto-naranja');
  var elRV3=document.getElementById('rv-auto-rojo');
  if(elRVtotal) elRVtotal.textContent='$'+Math.round(totalRVusd).toLocaleString('es-AR');
  if(elRV2) elRV2.textContent='$'+rv2pctARS.toLocaleString('es-AR');
  if(elRV3) elRV3.textContent='$'+rv3pctARS.toLocaleString('es-AR');

  var _pvAlerts=[];var _rbPlan=[];
  var _paFlows={};try{_paFlows=paBuildFlows();}catch(_e){console.warn('paBuildFlows',_e);}
  NV_ROWS=[];
  open.forEach(function(p){
    var q=quotes[p.ticker];var price=q?q.price:null;
    var ratio=getRatio(p.ticker);var sector=getSector(p.ticker);
    var _isARS2=(sector==='argentina'||sector==='bonos'||sector==='on'||sector==='fci');
    var _isBonoON=(sector==='bonos'||sector==='on');
    var ppcUSD=p.qty>0?p.costUSDpuro/p.qty:0;
    var ppcFromARS=p.qty>0?p.costARS/p.qty*100:0;
    var _tcHoy=(_isBonoON||sector==='fci')?(MEP_HOY||CCL_HOY):CCL_HOY;
    var ppcFromUSD=ppcUSD*_tcHoy*100;
    var mkt=p._mktARS||0;
    var ppcCedearARS=isBonoUSDDirecto(p.ticker)
      ?ppcUSD*100
      :(_isBonoON
        ?ppcFromUSD
        :(sector==='fci'?ppcUSD*(MEP_HOY||CCL_HOY):ppcUSD*CCL_HOY));
    var mercadoCedearARS=p._mktARS;
    var inversionCedearARS=p._invARS;
    var pnlPct=mercadoCedearARS!=null&&ppcCedearARS>0?(mercadoCedearARS-ppcCedearARS)/ppcCedearARS*100:null;p._pnlPct=pnlPct;
    var targetUSD=getTarget(p.ticker);
    var targetARS=targetUSD!=null?(targetUSD/ratio)*_tcHoy:null;
    var _rawPrice=q?q.price:null;
    var _isArgentina=(sector==='argentina');
    var fromByma=q&&q.fromByma;
    var priceUSD=_rawPrice!=null?(
      _isBonoON    ? _rawPrice*ratio/(_tcHoy||1) :
      sector==='fci' ? _rawPrice/(_tcHoy||1) :
      _isArgentina ? _rawPrice*ratio/(CCL_HOY||1) :
      BRL_TICKERS.has(p.ticker) ? _rawPrice/(CCL_HOY||1) :
      fromByma ? _rawPrice*ratio/(CCL_HOY||1) :
      _rawPrice
    ):null;
    var upside=targetUSD!=null&&priceUSD!=null&&priceUSD>0?(targetUSD-priceUSD)/priceUSD*100:null;
    var _pvHit=upside!=null&&upside<=0;if(_pvHit)_pvAlerts.push(p.ticker);
    p._pv=targetUSD;p._upside=upside;

    var invColor=(rv3pctARS>0&&inversionCedearARS>rv3pctARS)?'var(--red)':
                 (rv2pctARS>0&&inversionCedearARS>rv2pctARS)?'#eab308':'var(--text)';
    var _qHealth=quoteHealthDot(q);

    var _flujoEv=_flujoProx30Map[p.ticker];
    var _flujoTitle=_flujoEv?('Próximo cobro: '+_flujosFechaDDMM(_flujoEv.fecha)+' — '+_flujosFmtMoneda(_flujoEv.moneda,_flujoEv.total)):'';
    var rsiCell;
    if(_isBonoON){
      var _tirReal=(typeof FLUJOS_BONOS!=='undefined'&&flujoDe(p.ticker))?calcularTIRReal(p.ticker):null;
      if(_tirReal){
        var _tirTip='TIR real: XIRR (act/365) del flujo exacto de FLUJOS_BONOS contra el precio de mercado de hoy, en '+_tirReal.moneda;
        rsiCell='<span style="color:var(--text);font-weight:600" title="'+_tirTip+'">'+_tirReal.tir.toFixed(2)+'%</span>';
      } else {
        var _tirEntry=(sector==='bonos')?TIR_CACHE[p.ticker]:null;
        rsiCell=_tirEntry&&_tirEntry.value!=null
          ?'<span style="color:var(--text2);font-weight:600" title="TIR EcoValores (estimación externa, cobertura parcial)">'+_tirEntry.value.toFixed(2)+'%</span>'
          :'<span style="color:var(--text3)">—</span>';
      }
    } else {
      var _rsiEntry=RSI_CACHE[p.ticker];
      rsiCell=_rsiEntry&&_rsiEntry.value!=null
        ?'<span style="color:'+rsiColor(_rsiEntry.value)+';font-weight:600">'+_rsiEntry.value.toFixed(1)+'</span>'
        :'<span style="color:var(--text3)">—</span>';
    }

    if(sector!=='fci'){
      var _ptDen=(sector==='bonos'||sector==='on')?rfMktARS:(rvSectors.indexOf(sector)!==-1?rvMktARS:0);
      var _ptPct=_ptDen>0&&inversionCedearARS!=null?inversionCedearARS/_ptDen*100:null;
    }
    if(sector!=='fci'){
      var _isBonoU=(sector==='bonos'||sector==='on');
      var _unitARS=mercadoCedearARS!=null&&mercadoCedearARS>0&&!isBonoUSDDirecto(p.ticker)?(_isBonoU?mercadoCedearARS/100:mercadoCedearARS):null;
      var _uLbl=_isBonoU?' VN':' u.';
      if(_ptPct!=null&&_ptPct>2&&_ptDen>0){
        var _sellARS=inversionCedearARS-_ptDen*0.02;
        _rbPlan.push({tk:p.ticker,acc:'vender',ars:_sellARS,u:_unitARS?Math.round(_sellARS/_unitARS):null,uL:_uLbl,tipo:_isBonoU?'RF':'RV',pct:_ptPct});
      } else if(!_isBonoU&&_ptPct!=null&&_ptDen>0&&typeof SI_THRESHOLD!=='undefined'&&SI_THRESHOLD>0&&_ptPct<SI_THRESHOLD){
        var _buyARS=_ptDen*SI_THRESHOLD/100-inversionCedearARS;
        if(_buyARS>0)_rbPlan.push({tk:p.ticker,acc:'comprar',ars:_buyARS,u:_unitARS?Math.round(_buyARS/_unitARS):null,uL:_uLbl,tipo:'RV',pct:_ptPct});
      }
    }
    var _paRes=null;try{var _paF=_paFlows[p.ticker];_paRes=_paF?paCalc(_paF.flows,p._valueUSD):null;if(_paRes){_paRes.titulo=p.ticker;PA_LAST[p.ticker]=_paRes;}}catch(_e){}
    if(CFG.vistaNueva){try{var _nvRv=['nyse','argentina','brasil','europa','china','cripto'].indexOf(sector)>=0,_nvDen=_nvRv?rvMktARS:rfMktARS,_nvRsi=null;
      if(!_isBonoON&&typeof _rsiEntry!=='undefined'&&_rsiEntry&&_rsiEntry.value!=null)_nvRsi=+_rsiEntry.value;
      NV_ROWS.push({t:p.ticker,s:sector,rv:_nvRv,usdD:isBonoUSDDirecto(p.ticker),d:pnlPct,up:upside,inv:inversionCedearARS||0,invCol:invColor,pt:_nvDen>0?(inversionCedearARS||0)/_nvDen*100:0,
        px:mercadoCedearARS,ppc:ppcCedearARS,pv:targetARS,q:p.qty,rsi:_nvRsi,rsiH:rsiCell,usd:p._valueUSD||0,ch:(q&&q.changePct!=null&&isFinite(q.changePct))?q.changePct:null,pvU:targetUSD,tc:_tcHoy,fl:_flujoTitle||'',dh:_divHistorySet.has(p.ticker),fin:finishTickers.has(p.ticker),qh:_qHealth||'',ph:(sector!=='fci'&&!(typeof BRL_TICKERS!=='undefined'&&BRL_TICKERS.has(p.ticker))),ppcU:ppcUSD||0});}catch(_e){}}
  });
  var liqARS=getRawNum('liq-ars');
  var liqUSD=getRawNum('liq-usd');
  var _tcLiq=(typeof MEP_HOY!=='undefined'&&MEP_HOY>0)?MEP_HOY:CCL_HOY;
  var liqTotalUSD=liqUSD+(_tcLiq>0?liqARS/_tcLiq:0);
  var valConLiq=totalVal+liqTotalUSD;
  try{distRender({rv:['nyse','argentina','brasil','europa','china','cripto'].reduce(function(s,k){return s+(sectorVal[k]||0);},0),rf:(sectorVal.bonos||0)+(sectorVal.on||0),fci:sectorVal.fci||0,hasFci:('fci' in sectorVal),liq:liqTotalUSD,plan:_rbPlan});}catch(_e){console.warn('distRender',_e);}
  try{pvAlertRender(_pvAlerts);}catch(_e){}
  try{negAlertRender(all.filter(function(p){return p.qty<-0.000001;}).map(function(p){return p.ticker+' ('+(Math.round(p.qty*100)/100).toLocaleString('es-AR')+')';}));}catch(_e){}

  document.getElementById('m-val').textContent='$'+Math.round(valConLiq).toLocaleString('es-AR');
  document.getElementById('m-count').textContent=open.length;

  renderSectorPie(sectorVal);
  renderRVPie(sectorVal);

  var trkDivsTotal=0;
  try{var td=TRK.divs||[];try{var _lsTrkP=localStorage.getItem(TRK.DKEY);if(_lsTrkP){var _lsTrkPD=JSON.parse(_lsTrkP);if(_lsTrkPD.length>td.length)td=_lsTrkPD;}}catch(_e){}
  if(true){td.forEach(function(d){if(d.estado==='pendiente')return;trkDivsTotal+=divUSD(d)||0;});}}catch(e){}
  var movDivsTotal=movimientos.filter(function(m){return m.tipo==='dividendo';}).reduce(function(a,m){return a+(m.precioUSD||0);},0);
  var regDivsTotal=(dividendos||[]).reduce(function(a,d){return a+(d.usd||0);},0);
  var allDivs=trkDivsTotal+movDivsTotal+regDivsTotal;
  document.getElementById('m-divs').textContent=allDivs>0?'$'+Math.round(allDivs).toLocaleString('es-AR'):'—';

  var invInicialEl=document.getElementById('inv-sidebar-usd');
  var invInicial=getRawNum('inv-sidebar-usd');
  var baseRend=invInicial>0?invInicial:totalCost;
  var rendPct=baseRend>0?(valConLiq-baseRend)/baseRend*100:null;
  var _apc=(CFG.aportes&&typeof aporCalc==='function')?aporCalc(valConLiq,invInicial):null;
  if(CFG.aportes){_aporUlt=_apc?Object.assign({inv:invInicial},_apc):null;try{aporSumRender();}catch(e){}}
  if(_apc&&_apc.rend!=null)rendPct=_apc.rend;
  if(CFG.vistaNueva){try{var _hoy=0,_base=0;NV_ROWS.forEach(function(r){if(r.ch!=null&&r.usd>0){var b=r.usd/(1+r.ch/100);_hoy+=r.usd-b;_base+=b;}});
    NV_K={val:valConLiq,valARS:valConLiq*(CCL_HOY||0),rend:rendPct,gan:(_apc&&_apc.gan!=null)?_apc.gan:(baseRend>0?valConLiq-baseRend:null),hoy:_hoy,hoyP:_base>0?_hoy/_base*100:null};
    nvRender();}catch(_e){console.warn('nvRender',_e);}}
  var rendEl=document.getElementById('m-rend');
  if(rendPct!==null){
    var rendColor=rendPct<0?'var(--red)':rendPct<10?'#eab308':'var(--accent)';
    var rendSign=rendPct>=0?'+':'';
    rendEl.innerHTML='<span style="color:'+rendColor+';font-weight:700">'+rendSign+Math.round(rendPct)+'%</span>';
  } else { rendEl.textContent='—'; }

  var dolzAutoSectors=['nyse','brasil','europa','cripto'];
  var dolzInv=dolzAutoSectors.reduce(function(s,sec){return s+(sectorTotalMktARS[sec]||0);},0);
  var allInv=Object.keys(sectorTotalMktARS).reduce(function(s,sec){return s+(sectorTotalMktARS[sec]||0);},0);
  open.forEach(function(p){
    var sec=getSector(p.ticker);
    if(DOLZ_EXTRA.has(p.ticker)&&dolzAutoSectors.indexOf(sec)===-1) dolzInv+=(p._invARS||0);
  });
  var dolzPct=allInv>0?dolzInv/allInv*100:null;
  var dolzEl=document.getElementById('m-dolz');
  if(dolzEl){
    if(dolzPct!==null){
      var dolzColor=dolzPct>=70?'var(--accent)':dolzPct>=50?'#eab308':'var(--red)';
      dolzEl.innerHTML='<span style="color:'+dolzColor+';font-weight:700">'+Math.round(dolzPct)+'%</span>';
    } else { dolzEl.textContent='—'; }
  }
  dolzBuildList(open);
  try{famQueueSnapshot({
    sectorVal:sectorVal, dolzPct:dolzPct, liqUSD:liqUSD, liqARS:liqARS, liqTotalUSD:liqTotalUSD,
    totalVal:totalVal, rendPct:rendPct, invInicial:invInicial,
    totalCost:open.reduce(function(a,p){return a+(p._valueUSD!=null?(p.costUSDpuro||0):0);},0),
    pos:open.filter(function(p){return p._valueUSD!=null;}).map(function(p){var r=PA_LAST[p.ticker];return {t:p.ticker,s:getSector(p.ticker),q:Math.round(p.qty*10000)/10000,v:Math.round(p._valueUSD*100)/100,c:Math.round((p.costUSDpuro||0)*100)/100,pnl:p._pnlPct!=null?Math.round(p._pnlPct*10)/10:null,an:(r&&r.anual!=null)?Math.round(r.anual*10)/10:null,pv:p._pv!=null?p._pv:null,up:p._upside!=null?Math.round(p._upside*10)/10:null,ch:(quotes[p.ticker]&&quotes[p.ticker].changePct!=null&&isFinite(quotes[p.ticker].changePct))?Math.round(quotes[p.ticker].changePct*100)/100:null};}),
    sinPrecio:open.filter(function(p){return p._valueUSD==null;}).map(function(p){return p.ticker;}),
    cobros:_calCobros.items.filter(function(it){return it.fecha<=_flujosFechaLimiteStr(30);}).map(function(it){return {f:it.fecha,t:it.ticker,m:it.moneda,x:it.total};}),
    cobros12:_calCobros.items.filter(function(it){return it.fecha<=_flujosFechaLimiteStr(366);}).map(function(it){return {f:it.fecha,t:it.ticker,m:it.moneda,x:it.total,a:it.amort||0};})
  });}catch(_e){console.warn('famQueueSnapshot',_e);}
  if(CFG.simRetiro){_simrCapHoy=valConLiq;try{simrRender();}catch(_e){}}
  try{mobRender({open:open,valConLiq:valConLiq,rendPct:rendPct,liq:liqTotalUSD,dolzPct:dolzPct,sectorVal:sectorVal,cobros:(_calCobros&&_calCobros.items)||[],pv:(typeof _pvAlerts!=='undefined'?_pvAlerts:[])});}catch(_e){console.warn('mobRender',_e);}

  var gananciaEl=document.getElementById('m-ganancia');
  var invInicialG=getRawNum('inv-sidebar-usd');
  if(invInicialG>0){
    var gananciaNeta=_apc?_apc.gan:valConLiq-invInicialG;
    var gananciaPct=(_apc&&_apc.rend!=null)?_apc.rend:gananciaNeta/invInicialG*100;
    var gananciaColor=gananciaPct<0?'var(--red)':gananciaPct<=10?'#f97316':'var(--accent)';
    var gananciaSign=gananciaNeta>=0?'+':'';
    gananciaEl.innerHTML='<span style="color:'+gananciaColor+';font-weight:700">'+gananciaSign+'$'+Math.round(Math.abs(gananciaNeta)).toLocaleString('es-AR')+'</span>';
  } else {
    gananciaEl.textContent='—';
  }

  // ── Stat cards: mayor posición / mejor / peor rendimiento ──
  var _openWithVal=open.filter(function(p){return p._valueUSD!=null&&p._valueUSD>0;});
  var _openWithPnl=open.filter(function(p){return p._pnlPct!=null&&!isNaN(p._pnlPct);});
  var _statTopPos=_openWithVal.slice().sort(function(a,b){return b._valueUSD-a._valueUSD;})[0]||null;
  var _statBest=_openWithPnl.slice().sort(function(a,b){return b._pnlPct-a._pnlPct;})[0]||null;
  var _statWorst=_openWithPnl.slice().sort(function(a,b){return a._pnlPct-b._pnlPct;})[0]||null;
  var _elPosTk=document.getElementById('stat-pos-ticker');
  var _elPosVal=document.getElementById('stat-pos-val');
  var _elBestTk=document.getElementById('stat-best-ticker');
  var _elBestVal=document.getElementById('stat-best-val');
  var _elWorstTk=document.getElementById('stat-worst-ticker');
  var _elWorstVal=document.getElementById('stat-worst-val');
  if(_elPosTk){_elPosTk.textContent=_statTopPos?_statTopPos.ticker:'—';}
  if(_elPosVal){_elPosVal.textContent=_statTopPos?'$'+Math.round(_statTopPos._valueUSD).toLocaleString('es-AR'):'—';}
  if(_elBestTk){_elBestTk.textContent=_statBest?_statBest.ticker:'—';}
  if(_elBestVal){_elBestVal.innerHTML=_statBest?'<span style="color:var(--accent)">+'+(Math.round(_statBest._pnlPct))+'%</span>':'—';}
  if(_elWorstTk){_elWorstTk.textContent=_statWorst?_statWorst.ticker:'—';}
  if(_elWorstVal){_elWorstVal.innerHTML=_statWorst?'<span style="color:#ff6b6b;font-weight:600;background:rgba(255,107,107,0.08);border-radius:3px;padding:1px 3px">'+(Math.round(_statWorst._pnlPct))+'%</span>':'—';}

  
  
  
  renderPerfilComparacion();
}

// ─── Comparación de portafolios ───
// ─── Noticias de la cartera (v44) ─────────────────────────────────────────────
var NWS_SECTORS={nyse:1,europa:1,china:1,cripto:1,brasil:1};
var NWS_TTL=3*3600*1000, NWS_LS='gdc_nws_v1';
var nwsFiltro='hi', nwsExpand={}, nwsBusy=false;
var nwsCache=(function(){try{return JSON.parse(localStorage.getItem(NWS_LS)||'null')||{};}catch(e){return {};}})();
var NWS_JUNK=/(stocks? to (buy|watch|own|hold)|\btop \d+|best stocks|\b\d+ (stocks|reasons|things)|should you (buy|sell)|is it (time|too late)|motley fool|zacks rank|millionaire|here'?s why|what to know|prediction:|\bcould (rise|soar|double|triple|jump|surge|climb)|\bhow (this|these|to)\b|\d+% upside|beaten[- ]down|is .{1,40} a buy\b|buy the dip|forever stock|no-brainer|screaming buy|smartest .* buy|(stock|shares) .{0,20}vs\.? )/i;
var NWS_HI=/(\bearnings\b|quarterly results|\bq[1-4] (results|revenue|profit|sales)|\bbeats?\b|\bmiss(es|ed)?\b|\bguidance\b|\boutlook\b|\bforecasts?\b|downgrad|upgrad|\bacquir|\bacquisition|\bmerger\b|\bbuyout\b|\btakeover\b|lawsuit|\bsued\b|\bprobe\b|investigat|\bsec\b|\bdoj\b|\bftc\b|antitrust|\bfda\b|\brecall\b|bankrupt|\bceo (steps|resign|out|exit)|names? .{1,30} ceo|\blayoffs?\b|job cuts|dividend (cut|suspen|hike|increase|raise)|\bbuyback\b|repurchase|stock split|\btariffs?\b|export (ban|curb|restriction|control)|trading halt|\bplunge|\bsoars?\b|\btumbles?\b|\bsurges?\b|\bcrash|\brate (cut|hike)s?|\bcuts? rates|raises? rates|central bank|\bselic\b|\belections?\b|\binflation\b|\bfiscal\b|\bdefault\b|\bimpeach)/i;
var NWS_MD=/(\banalysts?\b|price target|\b(raises|lifts|cuts|lowers|boosts) .{0,30}targets?\b|\brating\b|partner|\bdeal\b|contract|\blaunch|\bunveil|dividend|regulat|sanction|\bstake\b|insider|expan|\binvest|approv|\bchips?\b|\bai\b)/i;
var NWS_SYM={'BBAS3':'BDORY'};
var NWS_GRUPO_MIN=2;
var NWS_PAIS={
  brasil:{label:'Brasil',flag:'🇧🇷',proxy:'EWZ',cat:'general',q:'Brasil Ibovespa bolsa',kw:/(brazil|brasil|ibovespa|bovespa|\blula\b|haddad|\bselic\b|banco central do brasil|\bbcb\b|\breais?\b|petrobras|\bvale\b|\bb3\b|itau|bradesco|banco do brasil)/i},
  china:{label:'China',flag:'🇨🇳',proxy:'FXI',cat:'general',q:'China bolsa acciones',kw:/(china|chinese|beijing|\bpboc\b|yuan|hang seng|xi jinping|shanghai|shenzhen)/i},
  europa:{label:'Europa',flag:'🇪🇺',proxy:'VGK',cat:'general',q:'bolsas europeas',kw:/(europe|european|\becb\b|lagarde|euro ?zone|stoxx|\bdax\b|\bftse\b|germany|france|britain|\buk\b)/i},
  cripto:{label:'Cripto',flag:'🪙',proxy:'IBIT',cat:'crypto',q:'bitcoin ethereum',kw:null},
  argentina:{label:'Argentina',flag:'🇦🇷',proxy:'ARGT',cat:'general',q:'Argentina economía Merval',kw:/(argentin|\bmilei\b|\bcaputo\b|\bbcra\b|merval|buenos aires|\bypf\b|galicia|\bperonis)/i},
  nyse:{label:'EE.UU.',flag:'🇺🇸',proxy:'SPY',cat:'general',q:'Wall Street acciones',kw:/(\bfed\b|federal reserve|powell|inflation|\bcpi\b|\bpce\b|jobs report|payrolls|treasur|\byields?\b|s&p 500|nasdaq|wall street|dow jones|recession|tariff|shutdown)/i}
};
var nwsSecBusy={};
function nwsGLink(q){return 'https://news.google.com/search?q='+encodeURIComponent(q+' when:2d')+'&hl=es-419&gl=AR&ceid=AR:es-419';}
async function nwsLoadSector(sec){
  var cfg=NWS_PAIS[sec];if(!cfg||nwsSecBusy[sec])return;nwsSecBusy[sec]=true;
  var dias=nwsDias(),fromTs=Date.now()/1000-dias*86400,to=new Date(),from=new Date(fromTs*1000);
  var out={news:[],q:null},seen={};
  function add(arr,tag){(Array.isArray(arr)?arr:[]).forEach(function(n){
    if(!n||!n.headline||!n.datetime||n.datetime<fromTs)return;
    if(tag==='gen'&&cfg.kw&&!cfg.kw.test(n.headline+' '+(n.summary||'')))return;
    var k=n.headline.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,60);if(seen[k])return;seen[k]=1;
    out.news.push({headline:n.headline,source:n.source,url:n.url,datetime:n.datetime,summary:(n.summary||'').slice(0,280)});});}
  try{add(await nwsFetchJSON(FBASE+'/company-news?symbol='+cfg.proxy+'&from='+nwsYmd(from)+'&to='+nwsYmd(to)+'&token='+FKEY),'etf');}catch(e){}
  try{
    nwsCache.gen=nwsCache.gen||{};
    if(!nwsCache.gen[cfg.cat])nwsCache.gen[cfg.cat]=await nwsFetchJSON(FBASE+'/news?category='+cfg.cat+'&token='+FKEY);
    add(nwsCache.gen[cfg.cat],'gen');
    add(nwsLog.filter(function(n){return cfg.cat==='crypto'?n.cat==='crypto':n.cat!=='crypto';}),'gen');
  }catch(e){}
  try{var q=await nwsFetchJSON(FBASE+'/quote?symbol='+cfg.proxy+'&token='+FKEY);if(q&&q.c)out.q={c:q.c,chg:q.pc?(q.c-q.pc)/q.pc*100:0};}catch(e){}
  out.news.sort(function(a,b){return b.datetime-a.datetime;});out.news=out.news.slice(0,30);
  nwsCache.sec=nwsCache.sec||{};nwsCache.sec[sec]=out;
  try{var c=Object.assign({},nwsCache);delete c.gen;localStorage.setItem(NWS_LS,JSON.stringify(c));}catch(e){}
  nwsSecBusy[sec]=false;nwsRender();
}
function nwsEsc(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function nwsAgo(ts){var m=Math.max(0,Math.round((Date.now()-ts*1000)/60000));if(m<60)return 'hace '+m+' min';var h=Math.round(m/60);if(h<24)return 'hace '+h+' h';return 'hace '+Math.round(h/24)+' d';}
function nwsYmd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function nwsUmbral(){var v=parseFloat((document.getElementById('nws-umbral')||{}).value);return v>0?v:3;}
function nwsDias(){var v=parseInt((document.getElementById('nws-dias')||{}).value,10);return v>0?v:2;}
function nwsValUSD(p){
  var q=quotes[p.ticker];if(!q||q.price==null||!p.qty)return 0;
  var sector=getSector(p.ticker),isBonoON=(sector==='bonos'||sector==='on'),isFci=(sector==='fci');
  if(sector==='argentina'||isBonoON||isFci){var tc=(isBonoON||isFci)?(MEP_HOY||CCL_HOY):CCL_HOY;if(!(tc>0))return 0;var ars=isBonoON?q.price*p.qty/100:q.price*p.qty;return ars/tc;}
  var pu=q.fromByma?q.price/(CCL_HOY||1):q.price/getRatio(p.ticker);return pu*p.qty;
}
function nwsCartera(){
  var pos=getPositions().filter(function(p){return p.qty>0.000001;});
  var tot=0;pos.forEach(function(p){p._v=nwsValUSD(p);tot+=p._v;});
  return pos.filter(function(p){return NWS_SECTORS[getSector(p.ticker)];})
    .map(function(p){return {ticker:p.ticker,sector:getSector(p.ticker),sym:NWS_SYM[p.ticker]||getFinnhubTicker(p.ticker),w:tot>0?p._v/tot*100:0,localChg:quotes[p.ticker]?quotes[p.ticker].changePct:null};})
    .sort(function(a,b){return b.w-a.w;});
}
function nwsClasif(n,chgAbs,umbral){
  var h=n.headline||'';
  if(NWS_JUNK.test(h))return 'lo';
  var lvl=NWS_HI.test(h)?'hi':(NWS_MD.test(h)?'md':'lo');
  if(chgAbs>=umbral&&(Date.now()/1000-n.datetime)<86400){if(lvl==='md')lvl='hi';else if(lvl==='lo')lvl='md';}
  return lvl;
}
async function nwsFetchJSON(url){
  for(var k=0;k<2;k++){
    var r=await fetchWithTimeout(url,{},10000);
    if(r.status===429){await new Promise(function(ok){setTimeout(ok,2500);});continue;}
    if(!r.ok)throw new Error('HTTP '+r.status);
    return await r.json();
  }
  throw new Error('Límite de Finnhub');
}
async function nwsPool(items,limit,worker){
  var idx=0;
  async function run(){while(idx<items.length){var it=items[idx++];try{await worker(it);}catch(e){}}}
  var ws=[];for(var k=0;k<Math.min(limit,items.length);k++)ws.push(run());
  await Promise.all(ws);
}
async function nwsLoad(force){
  var cart=nwsCartera();
  var st=document.getElementById('nws-status');
  var dias=nwsDias();
  var fresh=nwsCache.ts&&(Date.now()-nwsCache.ts<NWS_TTL)&&nwsCache.dias===dias;
  if(!force&&fresh){nwsRender();return;}
  if(nwsBusy)return;nwsBusy=true;
  try{await nwsLoadPanorama(force);}catch(e){}
  var to=new Date(),from=new Date(Date.now()-dias*86400000);
  var data={},done=0,errs=0;
  if(st)st.textContent='Buscando noticias… 0/'+cart.length;
  await nwsPool(cart,3,async function(p){
    var ent={news:[],q:null};
    try{
      var arr=await nwsFetchJSON(FBASE+'/company-news?symbol='+encodeURIComponent(p.sym)+'&from='+nwsYmd(from)+'&to='+nwsYmd(to)+'&token='+FKEY);
      var seen={};
      ent.news=(Array.isArray(arr)?arr:[]).filter(function(n){
        if(!n||!n.headline||!n.datetime)return false;
        if(n.datetime*1000<from.getTime())return false;
        var k=n.headline.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,60);if(seen[k])return false;seen[k]=1;return true;
      }).slice(0,40).map(function(n){return {headline:n.headline,source:n.source,url:n.url,datetime:n.datetime,summary:(n.summary||'').slice(0,280)};});
    }catch(e){errs++;}
    try{var q=await nwsFetchJSON(FBASE+'/quote?symbol='+encodeURIComponent(p.sym)+'&token='+FKEY);if(q&&q.c)ent.q={c:q.c,chg:q.pc?(q.c-q.pc)/q.pc*100:0};}catch(e){}
    data[p.ticker]=ent;done++;
    if(st)st.textContent='Buscando noticias… '+done+'/'+cart.length;
  });
  nwsCache={ts:Date.now(),dias:dias,data:data,gen:(nwsCache&&nwsCache.gen)||{}};
  try{var _c=Object.assign({},nwsCache);delete _c.gen;localStorage.setItem(NWS_LS,JSON.stringify(_c));}catch(e){}
  nwsBusy=false;
  if(st)st.textContent=errs?(errs+' tickers sin respuesta de Finnhub'):'';
  nwsRender();nwsAfterQuotes();
}
function nwsGrupoHTML(g,umbral){
  var cfg=NWS_PAIS[g.sec],d=nwsCache.sec&&nwsCache.sec[g.sec];
  if(!d&&!nwsSecBusy[g.sec])setTimeout(function(){nwsLoadSector(g.sec);},0);
  var col=g.up?'var(--accent)':'var(--red)';
  var tks=g.rows.map(function(r){return r.p.ticker+' '+(r.chg>=0?'+':'')+r.chg.toFixed(2).replace('.',',')+'%';}).join(' · ');
  var h='<div style="border:1px solid var(--amber);border-radius:var(--radius);background:var(--surface2);padding:.65rem .9rem;margin-bottom:.6rem">'
    +'<div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:3px"><span style="font-weight:600;font-size:.92rem">'+cfg.flag+' '+cfg.label+'</span>'
    +'<span style="font-size:.72rem;color:'+col+'">'+g.rows.length+' posiciones '+(g.up?'suben':'bajan')+' fuerte</span>'
    +'<span style="font-size:.68rem;color:var(--text3);font-family:var(--mono)">'+nwsEsc(tks)+'</span>'
    +(d&&d.q?'<span style="font-size:.72rem;font-family:var(--mono);color:'+(d.q.chg>=0?'var(--accent)':'var(--red)')+'">'+cfg.proxy+' '+(d.q.chg>=0?'+':'')+d.q.chg.toFixed(2).replace('.',',')+'%</span>':'')
    +'<span style="font-size:.6rem;font-family:var(--mono);color:var(--amber);border:1px solid var(--amber);border-radius:20px;padding:1px 7px">CONTEXTO PAÍS / SECTOR</span>'
    +'<span style="flex:1"></span><a href="'+nwsGLink(cfg.q)+'" target="_blank" rel="noopener" style="font-size:.68rem;color:var(--blue)">Google News ↗</a></div>';
  if(!d){return h+'<div style="font-size:.75rem;color:var(--text3);padding:6px 0;border-top:1px solid var(--border)">Buscando noticias de '+cfg.label+'…</div></div>';}
  var avg=g.rows.reduce(function(a,r){return a+Math.abs(r.chg);},0)/g.rows.length;
  var rank={hi:0,md:1,lo:2};
  var items=d.news.map(function(n){var o=Object.assign({},n);o.lvl=nwsClasif(n,avg,umbral);return o;}).filter(function(n){return n.lvl!=='lo';})
    .sort(function(a,b){return rank[a.lvl]-rank[b.lvl]||b.datetime-a.datetime;});
  if(!items.length)h+='<div style="font-size:.75rem;color:var(--text3);padding:6px 0;border-top:1px solid var(--border)">Finnhub no trae noticias relevantes de '+cfg.label+' en la ventana. Probá con Google News ↗</div>';
  var key='sec:'+g.sec,lim=nwsExpand[key]?items.length:5;
  items.slice(0,lim).forEach(function(n){h+=nwsItemHTML(n);});
  if(items.length>5)h+='<button class="btn btn-sm" style="margin-top:6px" onclick="nwsToggle(\''+key+'\')">'+(nwsExpand[key]?'Ver menos':'+'+(items.length-5)+' más')+'</button>';
  return h+'</div>';
}

// ─── Panorama por país (v46) ───────────────────────────────────────────────
var NWS_MACRO=/(inflation|\bcpi\b|\bpce\b|\bppi\b|consumer prices|\bfed\b|federal reserve|\bfomc\b|powell|rate (cut|hike)s?|interest rates?|jobs report|payrolls|jobless|unemployment|\bgdp\b|recession|central bank|\becb\b|lagarde|\bselic\b|\bbcra\b|\bpboc\b|elections?|fiscal|budget|deficit|tariffs?|treasury yields?|\bimf\b|\bdefault\b|stimulus|shutdown|retail sales|consumer (spending|confidence)|\bpmi\b)/i;
var NWS_TOP=/(inflation|\bcpi\b|\bpce\b|consumer prices|jobs report|payrolls|unemployment rate|\bgdp\b|rate (cut|hike|decision)s?|holds? rates|\bfomc\b|\bselic\b|interest rates?)/i;
var NWS_SURPRISE=/(than expected|expectations|forecasts?|surprise|unexpected|cooler|hotter|estimates)/i;
var NWS_US_OWN=/(\bus\b|\bu\.s\.|american|\bfed\b|federal reserve|powell|wall street|treasur|\bs&p\b|nasdaq|dow jones|white house|washington|trump)/i;
function nwsPanScore(n){var m=NWS_MACRO.test(n.headline),t=NWS_TOP.test(n.headline);return (t?3:m?2:NWS_HI.test(n.headline)?1:0)+((m||t)&&NWS_SURPRISE.test(n.headline)?1:0);}
var NWS_PAN_LS='gdc_nws_pan_v1',NWS_LOG_LS='gdc_nws_log_v1',NWS_PAN_TTL=30*60*1000;
var nwsPan=(function(){try{return JSON.parse(localStorage.getItem(NWS_PAN_LS)||'null');}catch(e){return null;}})();
var nwsLog=(function(){try{return JSON.parse(localStorage.getItem(NWS_LOG_LS)||'[]')||[];}catch(e){return [];}})();
var nwsPanBusy=false;
function nwsExposicion(){
  var tot=0,by={};
  getPositions().filter(function(p){return p.qty>0.000001;}).forEach(function(p){
    var v=nwsValUSD(p);if(!v)return;tot+=v;
    var sc=getSector(p.ticker),k=(sc==='argentina'||sc==='bonos'||sc==='on'||sc==='fci')?'argentina':sc;
    by[k]=(by[k]||0)+v;
  });
  return Object.keys(by).filter(function(k){return NWS_PAIS[k];}).map(function(k){return {sec:k,w:tot>0?by[k]/tot*100:0};}).sort(function(a,b){return b.w-a.w;});
}
function nwsLogMerge(arr,cat){
  var lim=Date.now()/1000-72*3600,seen={};
  nwsLog.forEach(function(n){seen[n.k]=1;});
  (Array.isArray(arr)?arr:[]).forEach(function(n){
    if(!n||!n.headline||!n.datetime||n.datetime<lim)return;
    var k=n.headline.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,60);if(seen[k])return;seen[k]=1;
    nwsLog.push({k:k,cat:cat,headline:n.headline,source:n.source,url:n.url,datetime:n.datetime,summary:(n.summary||'').slice(0,280)});
  });
  nwsLog=nwsLog.filter(function(n){return n.datetime>=lim;}).sort(function(a,b){return b.datetime-a.datetime;}).slice(0,500);
  try{localStorage.setItem(NWS_LOG_LS,JSON.stringify(nwsLog));}catch(e){}
}
async function nwsLoadPanorama(force){
  if(nwsPanBusy)return;
  if(!force&&nwsPan&&Date.now()-nwsPan.ts<NWS_PAN_TTL)return;
  nwsPanBusy=true;
  try{
    var exp=nwsExposicion();
    nwsCache.gen=nwsCache.gen||{};
    try{var g=await nwsFetchJSON(FBASE+'/news?category=general&token='+FKEY);nwsCache.gen.general=g;nwsLogMerge(g,'general');}catch(e){}
    if(exp.some(function(e){return e.sec==='cripto';})){try{var c=await nwsFetchJSON(FBASE+'/news?category=crypto&token='+FKEY);nwsCache.gen.crypto=c;nwsLogMerge(c,'crypto');}catch(e){}}
    var q={};
    await nwsPool(exp,3,async function(e){try{var d=await nwsFetchJSON(FBASE+'/quote?symbol='+NWS_PAIS[e.sec].proxy+'&token='+FKEY);if(d&&d.c)q[e.sec]={c:d.c,chg:d.pc?(d.c-d.pc)/d.pc*100:0};}catch(x){}});
    nwsPan={ts:Date.now(),q:q};
    try{localStorage.setItem(NWS_PAN_LS,JSON.stringify(nwsPan));}catch(e){}
  }finally{nwsPanBusy=false;}
}
function nwsPaisNews(sec,fromTs){
  var cfg=NWS_PAIS[sec];
  return nwsLog.filter(function(n){
    if(n.datetime<fromTs)return false;
    if(cfg.cat==='crypto')return n.cat==='crypto';
    var txt=n.headline+' '+(n.summary||'');
    if(n.cat==='crypto'||!cfg.kw||!cfg.kw.test(txt))return false;
    if(sec==='nyse'){for(var k in NWS_PAIS){var o=NWS_PAIS[k];if(k!=='nyse'&&o.kw&&o.kw.test(txt)&&!NWS_US_OWN.test(txt))return false;}}
    return true;
  });
}
function nwsPanoramaHTML(){
  var stale=!nwsPan||(Date.now()-nwsPan.ts>NWS_PAN_TTL);
  if(stale&&!nwsPanBusy)setTimeout(function(){nwsLoadPanorama(false).then(nwsRender);},0);
  var h='<div style="border:1px solid var(--border2);border-radius:var(--radius);background:var(--surface);padding:.65rem .9rem;margin-bottom:.9rem">'
    +'<div style="display:flex;align-items:baseline;gap:10px;margin-bottom:.35rem"><span style="font-weight:600;font-size:.92rem">🌎 Panorama por país</span>'
    +'<span style="font-size:.65rem;color:var(--text3)">noticias macro de los países donde tenés exposición · ordenado por peso</span><span style="flex:1"></span>'
    +(nwsPanBusy||!nwsPan?'<span style="font-size:.65rem;color:var(--text3);font-family:var(--mono)">actualizando…</span>':'')+'</div>';
  if(!nwsPan&&!nwsLog.length)return h+'<div style="font-size:.75rem;color:var(--text3)">Cargando panorama…</div></div>';
  var fromTs=Date.now()/1000-nwsDias()*86400,rank={hi:0,md:1,lo:2};
  nwsExposicion().forEach(function(e,idx){
    var cfg=NWS_PAIS[e.sec],q=nwsPan&&nwsPan.q&&nwsPan.q[e.sec];
    var items=nwsPaisNews(e.sec,fromTs).filter(function(n){return !NWS_JUNK.test(n.headline);}).map(function(n){
      var o=Object.assign({},n);o.macro=NWS_MACRO.test(n.headline)||NWS_TOP.test(n.headline);o.score=nwsPanScore(n);
      o.lvl=(o.macro||NWS_HI.test(n.headline))?'hi':'md';
      if(o.macro)o.tag='Macro';return o;
    }).sort(function(a,b){return (b.score-a.score)||(b.datetime-a.datetime);});
    var key='pan:'+e.sec,lim=nwsExpand[key]?Math.min(items.length,10):3;
    h+='<div style="padding:.45rem 0;'+(idx?'border-top:1px solid var(--border2)':'')+'">'
      +'<div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap"><span style="font-weight:600;font-size:.84rem">'+cfg.flag+' '+cfg.label+'</span>'
      +'<span style="font-size:.68rem;color:var(--text3)">'+e.w.toFixed(1).replace('.',',')+'% de la cartera</span>'
      +(q?'<span style="font-size:.72rem;font-family:var(--mono);color:'+(q.chg>=0?'var(--accent)':'var(--red)')+'">'+cfg.proxy+' '+(q.chg>=0?'+':'')+q.chg.toFixed(2).replace('.',',')+'%</span>':'')
      +'<span style="flex:1"></span><a href="'+nwsGLink(cfg.q)+'" target="_blank" rel="noopener" style="font-size:.66rem;color:var(--blue)">Google News ↗</a></div>';
    if(!items.length)h+='<div style="font-size:.72rem;color:var(--text3);padding:4px 0 0">Sin noticias macro en Finnhub para esta ventana.</div>';
    items.slice(0,lim).forEach(function(n){h+=nwsItemHTML(n);});
    if(items.length>3)h+='<button class="btn btn-sm" style="margin-top:4px" onclick="nwsToggle(\''+key+'\')">'+(nwsExpand[key]?'Ver menos':'+'+(Math.min(items.length,10)-3)+' más')+'</button>';
    h+='</div>';
  });
  return h+'</div>';
}

// ─── Traducción de titulares al español (v47) ──────────────────────────────
var NWS_TR_LS='gdc_nws_tr_v1';
var nwsTrMap=(function(){try{return JSON.parse(localStorage.getItem(NWS_TR_LS)||'{}')||{};}catch(e){return {};}})();
var nwsTrOn=(function(){try{return localStorage.getItem('gdc_nws_tr_on')!=='0';}catch(e){return true;}})();
var nwsTrPend={},nwsTrTried={},nwsTrBusy=false;
document.addEventListener('DOMContentLoaded',function(){var c=document.getElementById('nws-tr');if(c)c.checked=nwsTrOn;});
function nwsTr(t){if(!nwsTrOn||!t)return t;var k=t.trim();if(nwsTrMap[k])return nwsTrMap[k];if(!nwsTrTried[k])nwsTrPend[k]=1;return t;}
function nwsTrToggle(el){nwsTrOn=!!el.checked;try{localStorage.setItem('gdc_nws_tr_on',nwsTrOn?'1':'0');}catch(e){}nwsRender();}
function nwsTrSave(){
  try{var ks=Object.keys(nwsTrMap);if(ks.length>2000)ks.slice(0,ks.length-2000).forEach(function(k){delete nwsTrMap[k];});localStorage.setItem(NWS_TR_LS,JSON.stringify(nwsTrMap));}catch(e){}
}
async function nwsTrGoogle(list){
  var url='https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q='+encodeURIComponent(list.join('\n'));
  var r=await fetchWithTimeout(url,{},10000);if(!r.ok)throw new Error('HTTP '+r.status);
  var d=await r.json();var out=(d&&d[0]||[]).map(function(x){return x&&x[0]||'';}).join('').split('\n');
  if(out.length!==list.length)throw new Error('lote desalineado');
  return out;
}
async function nwsTrMyMemory(t){
  var r=await fetchWithTimeout('https://api.mymemory.translated.net/get?q='+encodeURIComponent(t)+'&langpair=en|es',{},8000);
  if(!r.ok)throw new Error('HTTP '+r.status);var d=await r.json();
  var tr=d&&d.responseData&&d.responseData.translatedText;if(!tr||/MYMEMORY WARNING/i.test(tr))throw new Error('sin cupo');return tr;
}
async function nwsTrFlush(){
  if(nwsTrBusy||!nwsTrOn)return;
  var ks=Object.keys(nwsTrPend);if(!ks.length)return;
  nwsTrBusy=true;nwsTrPend={};ks.forEach(function(k){nwsTrTried[k]=1;});
  var lotes=[],cur=[],len=0;
  ks.forEach(function(k){var l=encodeURIComponent(k).length+3;if(cur.length&&len+l>1500){lotes.push(cur);cur=[];len=0;}cur.push(k.replace(/\n/g,' '));len+=l;});
  if(cur.length)lotes.push(cur);
  var n=0;
  for(var i=0;i<lotes.length;i++){
    var L=lotes[i];
    try{var out=await nwsTrGoogle(L);L.forEach(function(k,j){if(out[j]&&out[j].trim())nwsTrMap[k]=out[j].trim();});n+=L.length;}
    catch(e){
      for(var j=0;j<L.length&&j<15;j++){try{nwsTrMap[L[j]]=await nwsTrMyMemory(L[j]);n++;}catch(x){break;}}
    }
  }
  nwsTrSave();nwsTrBusy=false;
  if(n)nwsRender();
}
function nwsSetFiltro(f,btn){nwsFiltro=f;document.querySelectorAll('#nws-filtros .nws-chip').forEach(function(b){b.classList.remove('on');});if(btn)btn.classList.add('on');nwsRender();}
function nwsToggle(t){nwsExpand[t]=!nwsExpand[t];nwsRender();}
function nwsItemHTML(n){
  var col=n.tag?'var(--blue)':{hi:'var(--red)',md:'var(--amber)',lo:'var(--text3)'}[n.lvl],lab=n.tag||{hi:'Alto',md:'Medio',lo:'Bajo'}[n.lvl];
  return '<div style="display:flex;gap:10px;padding:7px 0;border-top:1px solid var(--border)">'
    +'<span style="font-size:.6rem;font-family:var(--mono);color:'+col+';border:1px solid '+col+';border-radius:20px;padding:1px 7px;height:fit-content;white-space:nowrap">'+lab+'</span>'
    +'<div style="flex:1;min-width:0"><a href="'+nwsEsc(n.url)+'" target="_blank" rel="noopener" title="'+nwsEsc((nwsTrOn?'Original: '+n.headline+(n.summary?'\n\n':''):'')+(n.summary||''))+'" style="color:var(--text);text-decoration:none;font-size:.8rem;line-height:1.4">'+nwsEsc(nwsTr(n.headline))+'</a>'
    +'<div style="font-size:.65rem;color:var(--text3);font-family:var(--mono)">'+nwsEsc(n.source)+' · '+nwsAgo(n.datetime)+'</div></div></div>';
}
function nwsRender(){
  var list=document.getElementById('nws-list');if(!list)return;
  var kp=document.getElementById('nws-kpis');
  if(!nwsCache.data){list.innerHTML='<div style="color:var(--text3);font-size:.8rem">Tocá ⟳ Actualizar para traer las noticias.</div>';return;}
  var umbral=nwsUmbral(),rank={hi:0,md:1,lo:2},maxR=nwsFiltro==='hi'?0:nwsFiltro==='md'?1:2;
  var cart=nwsCartera(),tot=0,nHi=0,conNov=0,movs=[],rest=[];
  cart.forEach(function(p){
    var e=nwsCache.data[p.ticker];if(!e)return;
    var chg=e.q?e.q.chg:p.localChg;var abs=Math.abs(chg||0);
    var items=e.news.map(function(n){var o=Object.assign({},n);o.lvl=nwsClasif(n,abs,umbral);return o;})
      .sort(function(a,b){return rank[a.lvl]-rank[b.lvl]||b.datetime-a.datetime;});
    tot+=items.length;if(items.length)conNov++;
    items.forEach(function(n){if(n.lvl==='hi')nHi++;});
    var row={p:p,chg:chg,items:items,big:abs>=umbral};
    (row.big?movs:rest).push(row);
  });
  var grupos=[],gk={};
  movs.forEach(function(r){var k=r.p.sector+(r.chg>=0?'+':'-');(gk[k]=gk[k]||{sec:r.p.sector,up:r.chg>=0,rows:[]}).rows.push(r);});
  Object.keys(gk).forEach(function(k){var g=gk[k];if(g.rows.length>=NWS_GRUPO_MIN&&NWS_PAIS[g.sec]){grupos.push(g);g.rows.forEach(function(r){r.grupo=g;});}});
  if(kp)kp.innerHTML=[['Noticias',tot],['Alto impacto',nHi],['Tickers con novedades',conNov+' de '+cart.length],['Movimiento ≥ '+umbral+'%',movs.length]]
    .map(function(k,i){return '<div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--rsm);padding:.55rem .75rem"><div style="font-size:.62rem;color:var(--text3);font-family:var(--mono)">'+k[0]+'</div><div style="font-size:1.1rem;font-weight:600;color:'+(i===1&&k[1]?'var(--red)':i===3&&k[1]?'var(--amber)':'var(--text)')+'">'+k[1]+'</div></div>';}).join('');
  function card(r,forceAll){
    var shown=r.items.filter(function(n){return forceAll||rank[n.lvl]<=maxR;});
    if(!shown.length&&!r.big)return '';
    var lim=nwsExpand[r.p.ticker]?shown.length:5;
    var chgTxt=r.chg==null?'':'<span style="font-size:.72rem;font-family:var(--mono);color:'+(r.chg>=0?'var(--accent)':'var(--red)')+'">'+(r.chg>=0?'+':'')+r.chg.toFixed(2).replace('.',',')+'% hoy</span>';
    var h='<div style="border:1px solid '+(r.big?'var(--amber)':'var(--border)')+';border-radius:var(--radius);background:var(--surface);padding:.65rem .9rem;margin-bottom:.6rem">'
      +'<div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:3px"><span style="font-weight:600;font-size:.92rem">'+nwsEsc(r.p.ticker)+'</span>'
      +(r.p.sym!==r.p.ticker?'<span style="font-size:.65rem;color:var(--text3);font-family:var(--mono)">'+nwsEsc(r.p.sym)+'</span>':'')
      +'<span style="font-size:.68rem;color:var(--text3)">'+r.p.w.toFixed(1).replace('.',',')+'% de la cartera</span>'+chgTxt
      +(r.big?'<span style="font-size:.6rem;font-family:var(--mono);color:var(--amber);border:1px solid var(--amber);border-radius:20px;padding:1px 7px">MOVIMIENTO FUERTE</span>':'')
      +'<span style="flex:1"></span><span style="font-size:.65rem;color:var(--text3)">'+r.items.length+' noticias</span></div>';
    if(r.big&&!r.items.length)h+='<div style="font-size:.75rem;color:var(--text3);padding:6px 0;border-top:1px solid var(--border)">Sin noticias propias'+(r.grupo?': ver contexto de '+NWS_PAIS[r.grupo.sec].label+' arriba':': probablemente movimiento de sector o de mercado')+' · <a href="'+nwsGLink(r.p.ticker+' acciones')+'" target="_blank" rel="noopener" style="color:var(--blue)">buscar en Google News ↗</a></div>';
    shown.slice(0,lim).forEach(function(n){h+=nwsItemHTML(n);});
    if(shown.length>5)h+='<button class="btn btn-sm" style="margin-top:6px" onclick="nwsToggle(\''+nwsEsc(r.p.ticker)+'\')">'+(nwsExpand[r.p.ticker]?'Ver menos':'+'+(shown.length-5)+' más')+'</button>';
    return h+'</div>';
  }
  var html=nwsPanoramaHTML();
  if(movs.length){html+='<div style="font-size:.7rem;font-family:var(--mono);color:var(--amber);margin:.2rem 0 .45rem">¿POR QUÉ SE MOVIERON HOY? (variación ≥ '+umbral+'%)</div>';
    grupos.forEach(function(g){html+=nwsGrupoHTML(g,umbral);});
    movs.sort(function(a,b){return Math.abs(b.chg)-Math.abs(a.chg);}).forEach(function(r){html+=card(r,true);});
    html+='<div style="font-size:.7rem;font-family:var(--mono);color:var(--text3);margin:.9rem 0 .45rem">RESTO DE LA CARTERA · por peso</div>';}
  var restH=rest.map(function(r){return card(r,false);}).join('');
  html+=restH||'<div style="color:var(--text3);font-size:.8rem">Sin noticias para este filtro.</div>';
  var ts=new Date(nwsCache.ts);
  html+='<div style="font-size:.65rem;color:var(--text3);margin-top:.6rem">Actualizado '+ts.toLocaleString('es-AR')+' · la variación es la del subyacente en USA (Finnhub). Pasá el mouse por un titular para ver el resumen.</div>';
  list.innerHTML=html;
  setTimeout(nwsTrFlush,0);
}
function nwsAfterQuotes(){
  try{
    var umbral=nwsUmbral(),n=0;
    nwsCartera().forEach(function(p){
      var e=nwsCache.data&&nwsCache.data[p.ticker];
      var fresh=nwsCache.ts&&(Date.now()-nwsCache.ts<NWS_TTL);
      var chg=(fresh&&e&&e.q)?e.q.chg:p.localChg;
      if(chg!=null&&Math.abs(chg)>=umbral)n++;
    });
    var b=document.getElementById('nws-navbadge');
    if(b){b.textContent=n?String(n):'';b.style.display=n?'':'none';b.title=n?(n+' posiciones se movieron ≥ '+umbral+'% hoy'):'';}
    var pg=document.getElementById('page-noticias');if(pg&&pg.classList.contains('active')&&nwsCache.data)nwsRender();
  }catch(e){}
}

// ─── Vigilancia ──────────────────────────────────────────────────────────────
var VIG_KEY=(PFX+'vigilancia');
var vigItems=[];
try{vigItems=JSON.parse(localStorage.getItem(VIG_KEY))||[];}catch(e){vigItems=[];}

var _vigLoaded=false;
function vigSave(){try{localStorage.setItem(VIG_KEY,JSON.stringify(vigItems));}catch(e){}try{sbSetConfig('vigilancia',vigItems);}catch(e){}}
async function vigLoad(){
  if(_vigLoaded||!document.getElementById('page-vigilancia'))return;
  try{var c=await sbGetConfig('vigilancia');if(typeof c==='string'){try{c=JSON.parse(c);}catch(e){c=null;}}
    if(Array.isArray(c)&&c.length){vigItems=c;try{localStorage.setItem(VIG_KEY,JSON.stringify(vigItems));}catch(e){}}
    else if(vigItems.length){await sbSetConfig('vigilancia',vigItems);}
    _vigLoaded=true;}catch(e){}
}
function vigSet(t,campo,val){var v=vigItems.find(function(x){return x.ticker===t;});if(!v)return;
  if(campo==='obj'){var n=parseFloat(String(val).replace(',','.'));if(n>0)v.obj=n;else delete v.obj;}else if(campo==='nota'){val=String(val||'').trim();if(val)v.nota=val.slice(0,120);else delete v.nota;}
  vigSave();vigRender();}
var VIG_SECT={},_vigQts=0,_vigQBusy=false;
function _vigSect(t){return SECTOR_MAP[t]||VIG_SECT[t]||getSector(t);}
async function vigCotizar(forzar){
  if(_vigQBusy||!vigItems.length)return false;
  var falta=vigItems.filter(function(v){return !quotes[v.ticker]||VIG_SECT[v.ticker];});if(!falta.length)return false;
  if(!forzar&&Date.now()-_vigQts<5*60000)return false;
  _vigQBusy=true;_vigQts=Date.now();var hubo=false;
  try{
    var panels=[['arg_bonds','bonos'],['arg_notes','bonos'],['arg_corp','on'],['arg_stocks','argentina'],['arg_cedears','nyse']];
    var res=await Promise.all(panels.map(function(pn){return fetchWithTimeout('https://data912.com/live/'+pn[0],{headers:{'Accept':'application/json'}},9000).then(function(r){return r.ok?r.json():null;}).then(function(j){return j?parseData912Response(j):{};}).catch(function(){return {};});}));
    falta.forEach(function(v){var t=v.ticker.toUpperCase();
      for(var i=0;i<panels.length;i++){var q=res[i][t];if(q&&q.price>0){if(!SECTOR_MAP[t])VIG_SECT[t]=panels[i][1];
        quotes[v.ticker]={price:q.price,prevClose:q.prevClose,changePct:q.changePct,fromByma:true};hubo=true;break;}}});
  }catch(e){}finally{_vigQBusy=false;}
  return hubo;
}
function _vigPrecioUSD(t){var q=quotes[t];if(!q||q.price==null)return null;var s=_vigSect(t),bo=(s==='bonos'||s==='on'),fci=s==='fci',ars=(s==='argentina'||bo||fci),tc=(bo||fci)?(MEP_HOY||CCL_HOY):CCL_HOY;
  if(bo&&isBonoUSDDirecto(t))return q.price;if(ars)return tc>0?q.price/tc:null;return q.fromByma?q.price/(CCL_HOY||1):q.price/(getRatio(t)||1);}
function vigAdd(){
  var ticker=document.getElementById('vig-ticker').value.trim().toUpperCase();
  var _q=document.getElementById('vig-qty'),qty=_q?(parseFloat(_q.value)||0):0;
  if(!ticker)return;
  var ex=vigItems.find(function(v){return v.ticker===ticker;});
  if(ex){ex.qty=qty;}else{vigItems.push({ticker:ticker,qty:qty});}
  vigSave();_vigQts=0;
  document.getElementById('vig-ticker').value='';
  if(_q)_q.value='';
  vigRender();
}

function vigRemove(ticker){
  vigItems=vigItems.filter(function(v){return v.ticker!==ticker;});
  vigSave();
  vigRender();
}

function vigRender(){
  var body=document.getElementById('vig-body');
  var empty=document.getElementById('vig-empty');
  var table=document.getElementById('vig-table');
  if(!_vigLoaded){vigLoad().then(function(){if(_vigLoaded)vigRender();});}
  vigCotizar().then(function(h){if(h)vigRender();});
  if(!vigItems.length){empty.style.display='';table.style.display='none';return;}
  empty.style.display='none';table.style.display='';
  var totARS=0,totUSD=0;
  body.innerHTML=vigItems.map(function(v){
    var q=quotes[v.ticker];
    var price=q?q.price:null;
    var sector=_vigSect(v.ticker);
    var ratio=getRatio(v.ticker);
    var isBonoON=(sector==='bonos'||sector==='on');
    var isFci=(sector==='fci');
    var isARS=(sector==='argentina'||isBonoON||isFci);
    var _vTc=(isBonoON||isFci)?(MEP_HOY||CCL_HOY):CCL_HOY;
    var priceARS=null,priceUSD=null,valARS=null,valUSD=null;
    if(price!=null){
      if(isBonoON&&isBonoUSDDirecto(v.ticker)){
        priceUSD=price;priceARS=_vTc>0?price*_vTc:null;
        if(v.qty){valUSD=price*v.qty/100;valARS=_vTc>0?valUSD*_vTc:null;}
      }else if(isARS){
        priceARS=price;
        priceUSD=_vTc>0?price/_vTc:null;
        if(v.qty){valARS=isBonoON?price*v.qty/100:price*v.qty;valUSD=_vTc>0?valARS/_vTc:null;}
      }else{
        var _vigFromByma=q&&q.fromByma;
        priceUSD=_vigFromByma?price/(CCL_HOY||1):price/ratio;
        priceARS=_vigFromByma?price:(CCL_HOY>0?priceUSD*CCL_HOY:null);
        if(v.qty){valUSD=priceUSD*v.qty;valARS=CCL_HOY>0?valUSD*CCL_HOY:null;}
      }
    }
    if(valARS)totARS+=valARS;
    if(valUSD)totUSD+=valUSD;
    var chg=q?q.changePct:null;
    var chgColor=chg==null?'var(--text3)':chg>=0?'var(--accent)':'var(--red)';
    var chgStr=chg==null?'—':(chg>=0?'+':'')+chg.toFixed(1)+'%';
    var fmt=function(n,prefix){return n==null?'—':prefix+(Math.round(n)).toLocaleString('es-AR');};
    var fmtD=function(n,prefix){return n==null?'—':prefix+n.toFixed(2);};
    var _pu=_vigPrecioUSD(v.ticker);
    return '<tr>'+
      '<td style="font-weight:600" title="'+(_pu?'Precio hoy: USD '+_pu.toFixed(_pu<10?3:2)+(priceARS!=null?' · $ '+Math.round(priceARS).toLocaleString('es-AR'):''):'Sin cotización')+'">'+v.ticker+'</td>'+
      '<td class="mono" style="color:'+chgColor+'">'+chgStr+'</td>'+
      (function(){var _d=(v.obj>0&&_pu)?(_pu/v.obj-1)*100:null,_ok=_d!=null&&_d<=0;
        return '<td style="white-space:nowrap"><input type="text" inputmode="decimal" value="'+(v.obj||'')+'" placeholder="objetivo" title="Precio de compra objetivo en USD, en la misma escala que el precio en USD del activo (pasá el mouse por el ticker para verlo; bonos: cada 100 VN). Al llegar se marca 🎯 y te llega un aviso." onchange="vigSet(\''+v.ticker+'\',\'obj\',this.value)" style="width:68px;background:var(--surface2);border:1px solid var(--border2);border-radius:4px;color:var(--text);font-family:var(--mono);font-size:.72rem;padding:2px 5px;text-align:right"> '+
          '<span class="mono" style="color:'+(_ok?'var(--accent)':_d!=null&&_d<=5?'#eab308':'var(--text3)')+';font-weight:'+(_ok?700:400)+';margin-left:6px">'+(_d==null?(v.obj>0?'sin precio':''):_ok?'🎯 llegó':'−'+_d.toFixed(1).replace('.',',')+'%')+'</span></td>'+
          '<td><input type="text" value="'+String(v.nota||'').replace(/"/g,'&quot;')+'" placeholder="nota…" maxlength="120" onchange="vigSet(\''+v.ticker+'\',\'nota\',this.value)" style="width:160px;background:var(--surface2);border:1px solid var(--border2);border-radius:4px;color:var(--text2);font-size:.72rem;padding:2px 5px"></td>';})()+
      '<td><button class="btn btn-d btn-sm" onclick="vigRemove(\''+v.ticker+'\')">✕</button></td>'+
    '</tr>';
  }).join('');
}

var _cmpData={gdc:null,veta:null,portafolio:null,broker:null};
var _cmpNombres={gdc:{},veta:{},portafolio:{},broker:{}};
var _cmpLiqVeta=null;
function cargarGDCEnComparacion(){
  var pos=getPositions().filter(function(p){return p.qty>0.000001;});
  if(!pos.length){alert('El portafolio no tiene posiciones.');return;}
  var map={};
  pos.forEach(function(p){map[p.ticker]=p.qty;});
  _cmpData.gdc=map;
  _cmpNombres.gdc={};
  var el=document.getElementById('cmp-gdc-name');
  if(el)el.textContent='Portafolio actual';
  showPage('comparacion',document.querySelector('[onclick*="comparacion"]'));
}
function cmpNorm(s){return String(s).replace(/[\s ​]+/g,' ').toLowerCase().trim();}
function cmpParseHTML(ab){
  var txt=new TextDecoder('utf-8').decode(ab);
  var doc=new DOMParser().parseFromString(txt,'text/html');
  var rows=[];
  doc.querySelectorAll('tr').forEach(function(tr){
    var row=[];tr.querySelectorAll('td,th').forEach(function(td){row.push(td.textContent.trim());});
    if(row.some(function(c){return c;}))rows.push(row);
  });
  return rows;
}
function cmpParseRows(ab){
  try{
    var wb=XLSX.read(new Uint8Array(ab),{type:'array'});
    for(var i=0;i<wb.SheetNames.length;i++){
      var ws=wb.Sheets[wb.SheetNames[i]];
      var rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
      if(rows.some(function(r){return r.some(function(c){return cmpNorm(c)==='ticker'});}))return rows;
    }
  }catch(ex){}
  return cmpParseHTML(ab);
}
function cmpParseArgNum(s){
  if(s==null)return NaN;
  var t=String(s).replace(/US\$|\$|\s/g,'').trim();
  if(!t)return NaN;
  t=t.replace(/\./g,'').replace(',','.');
  return parseFloat(t);
}
function cmpFindSheetName(wb,re){
  for(var i=0;i<wb.SheetNames.length;i++){if(re.test(wb.SheetNames[i]))return wb.SheetNames[i];}
  return null;
}
function cmpReadVetaWorkbook(ab){
  var wb;
  try{wb=XLSX.read(new Uint8Array(ab),{type:'array'});}catch(ex){return null;}
  var invName=cmpFindSheetName(wb,/inversiones/i);
  if(!invName)return null;
  var invRows=XLSX.utils.sheet_to_json(wb.Sheets[invName],{header:1,defval:''});
  var hdrIdx=invRows.findIndex(function(r){return r.some(function(c){var n=cmpNorm(c);return n==='codigo'||n==='tituloespecie';});});
  var map={},nombres={};
  if(hdrIdx>=0){
    var hdr=invRows[hdrIdx].map(cmpNorm);
    var tCol=hdr.indexOf('codigo');
    if(tCol<0)tCol=hdr.indexOf('tituloespecie');
    var dCol=hdr.indexOf('denominacion');
    if(dCol<0)dCol=hdr.indexOf('descripcionespecie');
    var totCol=hdr.indexOf('total');
    var tipoCol=hdr.indexOf('tipoespecie');
    invRows.slice(hdrIdx+1).forEach(function(r){
      if(tipoCol>=0&&cmpNorm(r[tipoCol])==='moneda')return;
      var ticker=String(r[tCol]||'').trim().toUpperCase();
      if(!ticker)return;
      var q=cmpParseArgNum(r[totCol]);
      if(isNaN(q)||q<=0)return;
      map[ticker]=(map[ticker]||0)+q;
      var desc=String(r[dCol]||'').trim();
      if(desc)nombres[ticker]=desc;
    });
  }
  var liq={ars:0,usd:0,usdc:0};
  var liqName=cmpFindSheetName(wb,/liquidez/i);
  if(liqName){
    var liqRows=XLSX.utils.sheet_to_json(wb.Sheets[liqName],{header:1,defval:''});
    var lHdrIdx=liqRows.findIndex(function(r){return r.some(function(c){return cmpNorm(c)==='denominacion';});});
    if(lHdrIdx>=0){
      var lHdr=liqRows[lHdrIdx].map(cmpNorm);
      var mCol=lHdr.indexOf('moneda');
      var lTotCol=lHdr.indexOf('total');
      liqRows.slice(lHdrIdx+1).forEach(function(r){
        var mon=cmpNorm(r[mCol]);
        var v=cmpParseArgNum(r[lTotCol]);
        if(isNaN(v))return;
        if(mon==='ars')liq.ars+=v;
        else if(mon==='usd')liq.usd+=v;
        else if(mon==='usdc')liq.usdc+=v;
      });
    }
  }
  return {positions:map,nombres:nombres,liq:liq};
}
function cmpLoadFile(who,input){
  var f=input.files[0];if(!f)return;
  document.getElementById('cmp-'+who+'-name').textContent=f.name;
  var reader=new FileReader();
  reader.onload=function(e){
    var ab=e.target.result;
    if(who==='veta'){
      var vw=cmpReadVetaWorkbook(ab);
      if(vw){
        _cmpData.veta=vw.positions;
        _cmpNombres.veta=vw.nombres;
        _cmpLiqVeta=vw.liq;
        return;
      }
      _cmpLiqVeta=null;
    }
    var rows=(who==='veta')?cmpParseHTML(ab):cmpParseRows(ab);
    if(!rows||!rows.length){alert('No se pudo leer el archivo.');return;}
    var isVeta=(who==='veta');
    var hdrIdx=rows.findIndex(function(r){
      return r.some(function(c){
        var s=cmpNorm(c);
        return s==='ticker'||s.includes('nombre de la especie');
      });
    });
    if(hdrIdx<0&&isVeta){
      hdrIdx=rows.findIndex(function(r){
        return r.filter(function(c){return String(c).trim();}).length>=4;
      });
    }
    if(hdrIdx<0){alert('No se encontró la cabecera del archivo.');return;}
    var hdr=rows[hdrIdx].map(cmpNorm);
    var tCol=hdr.indexOf('ticker');
    var nCol=hdr.findIndex(function(c){return c.includes('nombre de la especie');});
    if(isVeta&&nCol<0)nCol=1;
    var qCol=isVeta?3:hdr.findIndex(function(c){return c.includes('cantidad');});
    if(!isVeta&&qCol<0){alert('No se encontró columna Cantidad.');return;}
    var map={},nombres={};
    rows.slice(hdrIdx+1).forEach(function(r){
      var raw=String(r[isVeta?nCol:tCol]||'').trim();
      if(!raw)return;
      var ticker,nombre='';
      if(isVeta){
        var parts=raw.split(/\s+/);
        var first=parts[0].toUpperCase();
        if(/^(SUBTOTAL|USD|VENCIMIENTO|VENCIDO|GTIA)/i.test(first))return;
        ticker=first;
        nombre=parts.slice(1).join(' ');
      }else{
        ticker=raw.toUpperCase();
      }
      var q=parseFloat(String(r[qCol]||'').trim().replace(/\./g,'').replace(',','.'));
      if(ticker&&!isNaN(q)&&q>0){map[ticker]=q;if(nombre)nombres[ticker]=nombre;}
    });
    _cmpData[who]=map;
    _cmpNombres[who]=nombres;
  };
  reader.readAsArrayBuffer(f);
}
var _cmpChecked=new Set();
function cmpToggleCheck(t,cb){
  if(cb.checked)_cmpChecked.add(t);else _cmpChecked.delete(t);
  var row=cb.closest('tr');
  row.style.opacity=cb.checked?'0.35':'';
  row.style.textDecoration=cb.checked?'line-through':'';
  var total=document.querySelectorAll('#cmp-result input[type=checkbox]').length;
  var el=document.getElementById('cmp-resolved-count');
  if(el)el.textContent=_cmpChecked.size+' / '+total+' resueltos';
}
function cmpLiqRow(label,box,veta,decimals){
  var diff=box-veta;
  var ok=Math.abs(diff)<(decimals?0.01:1);
  var opts={minimumFractionDigits:decimals,maximumFractionDigits:decimals};
  var sc=ok?'var(--accent)':'#f59e0b';
  return '<tr><td class="mono">'+label+'</td>'
    +'<td class="mono">'+box.toLocaleString('es-AR',opts)+'</td>'
    +'<td class="mono">'+veta.toLocaleString('es-AR',opts)+'</td>'
    +'<td class="mono" style="color:'+sc+'">'+(diff>0?'+':'')+diff.toLocaleString('es-AR',opts)+'</td>'
    +'<td><span style="font-size:.65rem;color:'+sc+'">'+(ok?'✓ Igual':'Diferente')+'</span></td>'
    +'</tr>';
}
function runComparacion(){
  if(CFG.broker!=='veta') return runComparacionBroker();
  var el=document.getElementById('cmp-result');
  var html='';
  if(_cmpLiqVeta){
    var liqArsBox=getRawNum('liq-ars');
    var liqUsdBox=getRawNum('liq-usd');
    var vetaArs=_cmpLiqVeta.ars||0;
    var vetaUsdTotal=(_cmpLiqVeta.usd||0)+(_cmpLiqVeta.usdc||0);
    html+='<div style="font-size:.65rem;font-family:var(--mono);color:var(--text3);margin-bottom:4px">Liquidez</div>';
    html+='<div class="tw panel-table" style="margin-bottom:1rem"><table><thead><tr>'
      +'<th>Moneda</th><th>Recuadro</th>'
      +'<th><img src="../Veta.png" style="height:13px;vertical-align:middle;opacity:.85"></th>'
      +'<th>Diferencia</th><th>Estado</th>'
      +'</tr></thead><tbody>'
      +cmpLiqRow('ARS (Pesos)',liqArsBox,vetaArs,0)
      +cmpLiqRow('USD (Dólares+cable)',liqUsdBox,vetaUsdTotal,2)
      +'</tbody></table></div>';
  }
  if(!_cmpData.gdc||!_cmpData.veta){
    if(!html)html='<div style="font-size:.8rem;color:var(--text3);padding:.6rem 0">Cargá los dos archivos primero.</div>';
    el.innerHTML=html;return;
  }
  var gdc=_cmpData.gdc,veta=_cmpData.veta;
  var tickers=new Set(Object.keys(gdc).concat(Object.keys(veta)));
  var diffs=[];
  tickers.forEach(function(t){
    var g=gdc[t]||0,v=veta[t]||0;
    var diff=g-v;
    var status=g>0&&!veta[t]?'Solo GDC':!gdc[t]&&v>0?'Solo Veta':Math.abs(diff)<0.0001?'Igual':'Diferente';
    if(status!=='Igual')diffs.push({t:t,g:g,v:v,diff:diff,status:status});
  });
  var order={'Solo Veta':0,'Solo GDC':1,'Diferente':2};
  diffs.sort(function(a,b){return (order[a.status]-order[b.status])||a.t.localeCompare(b.t);});
  if(!diffs.length){
    html+='<div style="font-size:.82rem;color:var(--accent);padding:.6rem 0">✓ Sin diferencias en posiciones — los portafolios coinciden.</div>';
    el.innerHTML=html;return;
  }
  html+='<div style="display:flex;align-items:center;gap:14px;margin-bottom:8px">'
    +'<span style="font-size:.65rem;font-family:var(--mono);color:var(--text3)">'+diffs.length+' diferencia(s)</span>'
    +'<span id="cmp-resolved-count" style="font-size:.65rem;font-family:var(--mono);color:var(--accent)">'+_cmpChecked.size+' / '+diffs.length+' resueltos</span>'
    +'</div>';
  html+='<div class="tw panel-table"><table><thead><tr>'
    +'<th style="width:28px"></th>'
    +'<th>Ticker</th><th>GDC</th>'
    +'<th><img src="../Veta.png" style="height:13px;vertical-align:middle;opacity:.85"></th>'
    +'<th>Diferencia</th><th>Estado</th>'
    +'</tr></thead><tbody>';
  diffs.forEach(function(d){
    var sc=d.status==='Solo GDC'?'var(--accent)':d.status==='Solo Veta'?'#448aff':'#f59e0b';
    var diffStr=d.g>0&&d.v>0?(d.diff>0?'+':'')+d.diff.toLocaleString('es-AR'):'—';
    var done=_cmpChecked.has(d.t);
    var nombre=(_cmpNombres.veta&&_cmpNombres.veta[d.t])||(_cmpNombres.gdc&&_cmpNombres.gdc[d.t])||'';
    html+='<tr style="'+(done?'opacity:.35;text-decoration:line-through':'')+'">'
      +'<td style="text-align:center;padding:.25rem .35rem">'
      +'<input type="checkbox"'+(done?' checked':'')+' onchange="cmpToggleCheck(\''+d.t+'\',this)" style="accent-color:var(--accent);cursor:pointer;width:13px;height:13px">'
      +'</td>'
      +'<td><span style="font-weight:700;font-family:var(--mono)">'+d.t+'</span>'
      +(nombre?'<br><span style="font-size:.6rem;color:var(--text3);font-family:var(--mono)">'+nombre+'</span>':'')
      +'</td>'
      +'<td class="mono">'+(d.g?d.g.toLocaleString('es-AR'):'—')+'</td>'
      +'<td class="mono">'+(d.v?d.v.toLocaleString('es-AR'):'—')+'</td>'
      +'<td class="mono" style="color:'+sc+'">'+diffStr+'</td>'
      +'<td><span style="font-size:.65rem;color:'+sc+'">'+d.status+'</span></td>'
      +'</tr>';
  });
  html+='</tbody></table></div>';
  el.innerHTML=html;
}

// ─── CCL Implícito ───

// ─── Tickers cerca del objetivo ───
var NT_THRESHOLD=(function(){
  try{var s=localStorage.getItem((PFX+'ntThreshold'));if(s){var v=parseFloat(s);if(!isNaN(v)&&v>0)return v;}}catch(e){}
  return 4;
})();

// ─── Inversiones Pequeñas ───
var SI_THRESHOLD=(function(){
  try{var s=localStorage.getItem((PFX+'siThreshold'));if(s){var v=parseFloat(s);if(!isNaN(v)&&v>=0)return v;}}catch(e){}
  return 0.5;
})();

// ─── Perfil objetivo (comparación cartera vs. composición sugerida) ───
var PERFIL_UTILITY_TICKERS=new Set(['PAMP','TRAN','CECO2','HARG','TGSU2','TGNO4','METR','TECO2','NEE','DUK','SO','D','AEP','EXC','T','VZ']);
var PERFIL_TARGETS={
  Agresivo:{
    composicion:{'Renta Variable':[80,90],'Renta Fija':[10,20],'Liquidez':[5,10]},
    geografica:{'Internacional (CEDEARs)':[50,60],'Argentina':[20,30],'Bonos/Liquidez':[15,25]},
    sectores:{
      'Tecnología':[25,30],
      'Finanzas':[15,20],
      'Consumo Discrecional':[10,15],
      'Energías Renovables':[8,12],
      'Salud/Biotech':[8,10],
      'Industriales/Materiales':[5,8],
      'Consumo Básico/Utilities':[2,5]
    },
    rubroMap:{
      'Tecnología':'Tecnología',
      'Finanzas':'Finanzas',
      'E-commerce':'Consumo Discrecional',
      'Energía':'Energías Renovables',
      'Salud':'Salud/Biotech',
      'Industrial':'Industriales/Materiales','Materiales':'Industriales/Materiales','Construcción':'Industriales/Materiales',
      'Consumo':'Consumo Básico/Utilities','Telecomunicaciones':'Consumo Básico/Utilities','Utilities':'Consumo Básico/Utilities'
    }
  },
  Moderado:{
    composicion:{'Renta Variable':[50,60],'Renta Fija':[40,50],'Liquidez':[5,10]},
    geografica:{'Internacional (CEDEARs)':[30,40],'Argentina':[15,20],'Bonos/Liquidez':[45,60]},
    sectores:{
      'Tecnología':[15,20],
      'Finanzas':[12,15],
      'Salud':[10,12],
      'Consumo Básico':[8,10],
      'Industriales':[5,8],
      'Energía':[5,7],
      'Utilities/Telecom':[5,8]
    },
    rubroMap:{
      'Tecnología':'Tecnología',
      'Finanzas':'Finanzas',
      'Salud':'Salud',
      'Consumo':'Consumo Básico',
      'Industrial':'Industriales','Materiales':'Industriales','Construcción':'Industriales',
      'Energía':'Energía',
      'Telecomunicaciones':'Utilities/Telecom','Utilities':'Utilities/Telecom'
    }
  },
  Conservador:{
    composicion:{'Renta Variable':[20,30],'Renta Fija':[60,80],'Liquidez':[10,15]},
    geografica:{'Internacional (CEDEARs)':[10,20],'Argentina':[10,15],'Bonos/Liquidez':[70,95]},
    sectores:{
      'Consumo Básico':[8,10],
      'Utilities':[6,8],
      'Finanzas':[4,6],
      'Salud':[3,5],
      'Tecnología':[0,3]
    },
    rubroMap:{
      'Consumo':'Consumo Básico',
      'Telecomunicaciones':'Utilities','Utilities':'Utilities',
      'Finanzas':'Finanzas',
      'Salud':'Salud',
      'Tecnología':'Tecnología'
    }
  }
};

function computePerfilActual(){
  var all=getPositions();
  var open=all.filter(function(p){return p.qty>0.000001;});
  var rvSectors=['nyse','argentina','brasil','europa','china','cripto'];
  var rvSet={};rvSectors.forEach(function(s){rvSet[s]=true;});
  var rfSet={bonos:true,on:true};

  var rvARS=0, rfARS=0, argARS=0, intlARS=0;
  var sectorARS={};

  open.forEach(function(p){
    var sector=getSector(p.ticker);
    var q=quotes[p.ticker];var price=q?q.price:null;
    if(price==null)return;
    var ratio=getRatio(p.ticker);
    var _isBRL=BRL_TICKERS.has(p.ticker);
    var fromByma=q&&q.fromByma;
    var _isBonoON=(sector==='bonos'||sector==='on');
    var _isFci=(sector==='fci');
    var mercadoARS;
    if(sector==='argentina'||_isBRL||fromByma){ mercadoARS=price; }
    else if(_isBonoON||_isFci){ mercadoARS=price; }
    else { mercadoARS=(price/ratio)*CCL_HOY; }
    var invARS=_isBonoON?mercadoARS*p.qty/100:mercadoARS*p.qty;
    if(!(invARS>0))return;

    if(rvSet[sector]){
      rvARS+=invARS;
      if(sector==='argentina'){ argARS+=invARS; } else { intlARS+=invARS; }
      var grp=PERFIL_UTILITY_TICKERS.has(p.ticker)?'Utilities':getRubro(p.ticker);
      sectorARS[grp]=(sectorARS[grp]||0)+invARS;
    } else if(rfSet[sector]){
      rfARS+=invARS;
    } else if(_isFci){
      var _fciCfg=(typeof FCI_AD_FONDOS!=='undefined'&&FCI_AD_FONDOS[p.ticker])||null;
      var _fciCat=_fciCfg?_fciCfg.cat:'rentaFija';
      if(_fciCat==='rentaVariable'){
        rvARS+=invARS;
        var grpFci=PERFIL_UTILITY_TICKERS.has(p.ticker)?'Utilities':getRubro(p.ticker);
        sectorARS[grpFci]=(sectorARS[grpFci]||0)+invARS;
      } else {
        rfARS+=invARS;
      }
    }
  });

  var liqARS=getRawNum('liq-ars');
  var liqUSD=getRawNum('liq-usd');
  var liqTotalARS=liqARS+(liqUSD*((typeof MEP_HOY!=='undefined'&&MEP_HOY>0)?MEP_HOY:(CCL_HOY||0)));
  var totalARS=rvARS+rfARS+liqTotalARS;

  return{
    totalARS:totalARS, rvARS:rvARS, rfARS:rfARS, liqARS:liqTotalARS,
    argARS:argARS, intlARS:intlARS, sectorARS:sectorARS
  };
}

function _perfilRowScore(val,range){
  if(val>=range[0]&&val<=range[1]) return 100;
  var dist=val<range[0]?range[0]-val:val-range[1];
  var width=Math.max(range[1]-range[0],5);
  return Math.max(0,100-(dist/width)*100);
}
function computePerfilScore(perfil,d){
  function avg(arr){return arr.length?arr.reduce(function(a,b){return a+b;},0)/arr.length:null;}
  var compScores=Object.keys(perfil.composicion).map(function(k){
    var val=k==='Renta Variable'?(d.totalARS>0?d.rvARS/d.totalARS*100:0)
          :k==='Renta Fija'?(d.totalARS>0?d.rfARS/d.totalARS*100:0)
          :(d.totalARS>0?d.liqARS/d.totalARS*100:0);
    return _perfilRowScore(val,perfil.composicion[k]);
  });
  var geoScores=Object.keys(perfil.geografica).map(function(k){
    var val=k==='Internacional (CEDEARs)'?(d.totalARS>0?d.intlARS/d.totalARS*100:0)
          :k==='Argentina'?(d.totalARS>0?d.argARS/d.totalARS*100:0)
          :(d.totalARS>0?(d.rfARS+d.liqARS)/d.totalARS*100:0);
    return _perfilRowScore(val,perfil.geografica[k]);
  });
  var secScores=[];
  if(perfil.sectores){
    var rubroMap=perfil.rubroMap||{};
    var bucketARS={};
    Object.keys(d.sectorARS).forEach(function(rawRubro){
      var bucket=rubroMap[rawRubro];
      if(bucket&&perfil.sectores[bucket]!==undefined){ bucketARS[bucket]=(bucketARS[bucket]||0)+d.sectorARS[rawRubro]; }
    });
    secScores=Object.keys(perfil.sectores).map(function(k){
      var val=d.rvARS>0?((bucketARS[k]||0)/d.rvARS*100):0;
      return _perfilRowScore(val,perfil.sectores[k]);
    });
  }
  var compAvg=avg(compScores),geoAvg=avg(geoScores),secAvg=avg(secScores);
  var groups=[compAvg,geoAvg,secAvg].filter(function(v){return v!=null;});
  return{composicion:compAvg,geografica:geoAvg,sectores:secAvg,total:avg(groups)};
}
function renderPerfilScores(d){
  var wrap=document.getElementById('perfil-score-summary');
  var emptyEl=document.getElementById('perfil-score-empty');
  if(!wrap)return;
  if(!(d.totalARS>0)){
    wrap.style.display='none';
    if(emptyEl)emptyEl.style.display='';
    return;
  }
  wrap.style.display='';
  if(emptyEl)emptyEl.style.display='none';
  var results=Object.keys(PERFIL_TARGETS).map(function(n){
    return{nombre:n,score:computePerfilScore(PERFIL_TARGETS[n],d).total||0};
  }).sort(function(a,b){return b.score-a.score;});
  var best=results[0];
  var html='<div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin-bottom:.7rem">'+
    '<span style="font-size:.75rem;color:var(--text2)">Tu cartera se parece más a:</span>'+
    '<span style="font-size:1rem;font-weight:800;color:var(--accent)">'+best.nombre.toUpperCase()+'</span>'+
    '<span style="font-size:.65rem;color:var(--text3);font-family:var(--mono)">('+Math.round(best.score)+'/100)</span>'+
  '</div>';
  html+='<div style="display:flex;gap:10px;flex-wrap:wrap">'+
    results.map(function(r){
      var pct=Math.round(r.score);
      var isBest=r.nombre===best.nombre;
      var color=isBest?'var(--accent)':'var(--text2)';
      return '<div style="flex:1;min-width:130px;background:var(--surface2);border:1px solid '+(isBest?'var(--accent)':'var(--border2)')+';border-radius:var(--rsm);padding:8px 10px">'+
        '<div style="font-size:.65rem;color:var(--text3);font-family:var(--mono);margin-bottom:3px">'+r.nombre+'</div>'+
        '<div style="display:flex;align-items:baseline;gap:5px">'+
          '<span style="font-size:1.15rem;font-weight:800;color:'+color+'">'+pct+'</span>'+
          '<span style="font-size:.62rem;color:var(--text3)">/100</span>'+
        '</div>'+
        '<div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin-top:5px"><div style="height:100%;width:'+pct+'%;background:'+color+'"></div></div>'+
      '</div>';
    }).join('')+
  '</div>';
  wrap.innerHTML=html;
}
function _perfilStatusColor(val,range){
  if(val>=range[0]&&val<=range[1]) return 'var(--accent)';
  var margin=(range[1]-range[0])*0.25||2;
  if(val>=range[0]-margin&&val<=range[1]+margin) return '#eab308';
  return 'var(--red)';
}
function _perfilStatusLabel(val,range){
  if(val>=range[0]&&val<=range[1]) return '✓ En rango';
  return val<range[0]?'↑ Bajo':'↓ Alto';
}
function renderPerfilComparacion(){
  var wrap=document.getElementById('perfil-cmp-groups');
  var emptyEl=document.getElementById('perfil-cmp-empty');
  var sel=document.getElementById('perfil-select');
  if(!wrap||!sel)return;
  var perfil=PERFIL_TARGETS[sel.value];
  if(!perfil){wrap.innerHTML='';return;}
  var d=computePerfilActual();
  renderPerfilScores(d);
  if(!(d.totalARS>0)){
    wrap.style.display='none';
    if(emptyEl)emptyEl.style.display='';
    return;
  }
  wrap.style.display='';
  if(emptyEl)emptyEl.style.display='none';

  function fmtPct(n){return (Math.round(n*10)/10)+'%';}
  function rangeStr(r){return r[0]+'–'+r[1]+'%';}
  function row(label,val,range){
    var color=_perfilStatusColor(val,range);
    var status=_perfilStatusLabel(val,range);
    return '<tr>'+
      '<td style="padding:5px 8px;font-weight:600">'+label+'</td>'+
      '<td class="mono" style="padding:5px 8px;color:var(--text2)">'+rangeStr(range)+'</td>'+
      '<td class="mono" style="padding:5px 8px;font-weight:700">'+fmtPct(val)+'</td>'+
      '<td style="padding:5px 8px"><span style="color:'+color+';font-weight:700">'+status+'</span></td>'+
    '</tr>';
  }
  function table(rows){
    return '<div class="tw panel-table"><table><thead><tr><th>Categoría</th><th>Rango sugerido</th><th>Tu cartera</th><th>Estado</th></tr></thead><tbody>'+rows.join('')+'</tbody></table></div>';
  }

  var html='';
  html+='<div style="font-size:.68rem;color:var(--text3);font-family:var(--mono);margin:.2rem 0 .4rem">Composición (% del total)</div>';
  html+=table([
    row('Renta Variable', d.totalARS>0?d.rvARS/d.totalARS*100:0, perfil.composicion['Renta Variable']),
    row('Renta Fija', d.totalARS>0?d.rfARS/d.totalARS*100:0, perfil.composicion['Renta Fija']),
    row('Liquidez', d.totalARS>0?d.liqARS/d.totalARS*100:0, perfil.composicion['Liquidez'])
  ]);
  html+='<div style="font-size:.68rem;color:var(--text3);font-family:var(--mono);margin:.85rem 0 .4rem">Distribución geográfica (% del total)</div>';
  html+=table([
    row('Internacional (CEDEARs)', d.totalARS>0?d.intlARS/d.totalARS*100:0, perfil.geografica['Internacional (CEDEARs)']),
    row('Argentina', d.totalARS>0?d.argARS/d.totalARS*100:0, perfil.geografica['Argentina']),
    row('Bonos/Liquidez', d.totalARS>0?(d.rfARS+d.liqARS)/d.totalARS*100:0, perfil.geografica['Bonos/Liquidez'])
  ]);
  if(perfil.sectores){
    html+='<div style="font-size:.68rem;color:var(--text3);font-family:var(--mono);margin:.85rem 0 .4rem">Sectores (% de la Renta Variable)</div>';
    var rubroMap=perfil.rubroMap||{};
    var bucketARS={};
    Object.keys(d.sectorARS).forEach(function(rawRubro){
      var bucket=rubroMap[rawRubro];
      if(bucket&&perfil.sectores[bucket]!==undefined){
        bucketARS[bucket]=(bucketARS[bucket]||0)+d.sectorARS[rawRubro];
      }
    });
    var mappedARS=0;
    var sectorRows=Object.keys(perfil.sectores).map(function(k){
      var ars=bucketARS[k]||0;
      mappedARS+=ars;
      var val=d.rvARS>0?(ars/d.rvARS*100):0;
      return row(k, val, perfil.sectores[k]);
    });
    html+=table(sectorRows);
    var leftoverARS=d.rvARS-mappedARS;
    if(leftoverARS>1){
      var leftoverPct=d.rvARS>0?(leftoverARS/d.rvARS*100):0;
      html+='<div style="font-size:.62rem;color:var(--text3);font-family:var(--mono);margin-top:5px">+ '+fmtPct(leftoverPct)+' en rubros sin objetivo definido para este perfil (Otros)</div>';
    }
  } else {
    html+='<div style="font-size:.66rem;color:var(--text3);font-family:var(--mono);margin:.85rem 0 0;font-style:italic">Este perfil todavía no tiene desglose por sector cargado.</div>';
  }

  wrap.innerHTML=html;
}

// ─── Toggle columna Cantidad (oculta por defecto para layout compacto) ───

// ─── Toggle columna P. Venta (oculta por defecto) ───
// ─── Orden de las tablas del Portafolio al hacer click en el título de la columna ───

// ─── Distribución de la cartera (RV / RF / Liquidez) vs rango objetivo del perfil (solapa Recomendaciones) ───
var DIST_LS_KEY=(PFX+'distPerfil');
var DIST_PERFIL=(function(){try{var s=localStorage.getItem(DIST_LS_KEY);if(s==='agresivo'||s==='moderado')return s;}catch(e){}return CFG.perfilDefault||'moderado';})();
var DIST_LAST=null,DIST_SB_LOADED=false,DIST_OPEN=false,DIST_PLAN_OPEN=false;
function distTogglePlan(){DIST_PLAN_OPEN=!DIST_PLAN_OPEN;distRender();}
function distSetPerfil(p){
  if(p!=='agresivo'&&p!=='moderado')return;
  DIST_PERFIL=p;
  try{localStorage.setItem(DIST_LS_KEY,p);}catch(e){}
  try{if(typeof sbSetConfig==='function')sbSetConfig('perfil_inversor',p);}catch(e){}
  distRender();
}
function distToggleDetalle(){DIST_OPEN=!DIST_OPEN;distRender();}
function distRender(data){
  if(data)DIST_LAST=data;
  var d=DIST_LAST;
  topCardsRow();
  var card=document.getElementById('dist-card'),body=document.getElementById('dist-body'),meta=document.getElementById('dist-meta');
  if(!card||!body||!d)return;
  if(!DIST_SB_LOADED&&typeof sbGetConfig==='function'){
    DIST_SB_LOADED=true;
    sbGetConfig('perfil_inversor').then(function(v){if((v==='agresivo'||v==='moderado')&&v!==DIST_PERFIL){DIST_PERFIL=v;try{localStorage.setItem(DIST_LS_KEY,v);}catch(e){}distRender();}}).catch(function(){});
  }
  var cm=document.getElementById('dist-perfil-moderado'),ca=document.getElementById('dist-perfil-agresivo');
  if(cm)cm.checked=DIST_PERFIL==='moderado';if(ca)ca.checked=DIST_PERFIL==='agresivo';
  var vals={rv:d.rv||0,rf:(d.rf||0)+(d.fci||0),liq:d.liq||0};
  var total=vals.rv+vals.rf+vals.liq;
  if(!(total>0)){card.style.display='none';return;}
  card.style.display='';
  var pName=DIST_PERFIL==='agresivo'?'Agresivo':'Moderado';
  var comp=(typeof PERFIL_TARGETS!=='undefined'&&PERFIL_TARGETS[pName]&&PERFIL_TARGETS[pName].composicion)||{};
  var ccl=CCL_HOY||0,mep=(typeof MEP_HOY!=='undefined'&&MEP_HOY)||ccl;
  var cats=[
    {k:'rv',n:'Renta variable',c:'var(--accent)',s:'RV',r:comp['Renta Variable'],tc:ccl,tcN:'CCL'},
    {k:'rf',n:'Renta fija (Bonos + ON + FCI)',c:'var(--blue)',s:'RF',r:comp['Renta Fija'],tc:mep,tcN:'MEP'},
    {k:'liq',n:'Liquidez (ARS + USD)',c:'#7a9cc5',s:'Liq',r:comp['Liquidez'],tc:mep,tcN:'MEP'}
  ];
  function f1(n){return n.toLocaleString('es-AR',{minimumFractionDigits:1,maximumFractionDigits:1});}
  function num(n){return Math.round(n).toLocaleString('es-AR');}
  function seg(w,c,lbl){return '<div style="width:'+w+'%;background:'+c+';display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:.66rem;font-weight:700;color:#0b1120;white-space:nowrap;overflow:hidden">'+(w>=7?lbl:'')+'</div>';}
  var mids=cats.map(function(x){return x.r?(x.r[0]+x.r[1])/2:0;});
  var midSum=mids.reduce(function(a,b){return a+b;},0)||1;
  var barA=cats.map(function(x){var p=vals[x.k]/total*100;return p>0?seg(p,x.c,x.s+' '+Math.round(p)+'%'):'';}).join('');
  var barO=cats.map(function(x,i){var p=mids[i]/midSum*100;return p>0?seg(p,x.c,x.s+' '+(x.r?x.r[0]+'–'+x.r[1]+'%':'')):'';}).join('');
  var nFuera=0;
  var rows=cats.map(function(x){
    var v=vals[x.k],pa=v/total*100,acc,diff;
    if(!x.r){diff=null;acc='<span style="color:var(--text3)">—</span>';}
    else if(pa<x.r[0]){
      nFuera++;diff=pa-x.r[0];var gU=x.r[0]/100*total-v;
      acc='<span style="color:var(--accent)" title="USD '+num(gU)+' × '+x.tcN+' '+num(x.tc)+'">'+(x.k==='liq'?'faltan':'comprar')+' <span class="port-sensitive">$'+num(gU*x.tc)+'</span></span>';
    } else if(pa>x.r[1]){
      nFuera++;diff=pa-x.r[1];var sU=v-x.r[1]/100*total;
      acc='<span style="color:#eab308" title="USD '+num(sU)+' × '+x.tcN+' '+num(x.tc)+'">sobran <span class="port-sensitive">$'+num(sU*x.tc)+'</span></span>';
    } else {diff=0;acc='<span style="color:var(--text2)">en rango ✓</span>';}
    return '<tr><td style="text-align:left"><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:'+x.c+';margin-right:7px;vertical-align:middle"></span>'+x.n+'</td>'+
      '<td class="mono port-sensitive">'+num(v)+'</td><td class="mono">'+f1(pa)+'%</td><td class="mono">'+(x.r?x.r[0]+'–'+x.r[1]+'%':'—')+'</td>'+
      '<td class="mono" style="color:var(--text2)">'+(diff==null?'—':diff===0?'0 pp':(diff>0?'+':'')+f1(diff)+' pp')+'</td><td class="mono">'+acc+'</td></tr>';
  }).join('');
  var L='font-family:var(--mono);font-size:.58rem;color:var(--text3);text-transform:uppercase;letter-spacing:.07em;margin:0 0 4px';
  body.innerHTML=
    '<div style="'+L+'">Actual</div><div style="display:flex;height:24px;border-radius:6px;overflow:hidden;gap:2px;background:var(--surface2)">'+barA+'</div>'+
    '<div style="'+L+';margin-top:9px">Objetivo · perfil '+pName+' (rangos de Recomendaciones)</div><div style="display:flex;height:16px;border-radius:5px;overflow:hidden;gap:2px;background:var(--surface2);opacity:.75">'+barO+'</div>'+
    '<div style="margin-top:10px;display:flex;align-items:center;gap:10px"><button class="btn btn-sm" onclick="distToggleDetalle()" style="font-size:.68rem">'+(DIST_OPEN?'▾ Ocultar detalle':'▸ Ver detalle')+'</button>'+
      '<span style="font-family:var(--mono);font-size:.66rem;color:'+(nFuera?'#eab308':'var(--text2)')+'">'+(nFuera?nFuera+' tipo'+(nFuera>1?'s':'')+' fuera de rango':'Todo dentro del rango ✓')+'</span></div>'+
    (DIST_OPEN?'<div class="tw" style="margin-top:10px"><table><thead><tr><th style="text-align:left">Tipo</th><th>USD</th><th>Actual</th><th>Objetivo</th><th>Diferencia</th><th>Para llegar ($)</th></tr></thead><tbody>'+rows+'</tbody></table>'+
      '<div style="font-family:var(--mono);font-size:.62rem;color:var(--text3);margin-top:6px">Pesos = USD × CCL ('+num(ccl)+') en renta variable · USD × MEP ('+num(mep)+') en renta fija y liquidez</div></div>':'');
  var plan=(d.plan||[]).slice();
  if(plan.length){
    var tv=0,tc=0;plan.forEach(function(o){if(o.acc==='vender')tv+=o.ars;else tc+=o.ars;});
    var neto=tv-tc;
    var html='<div style="margin-top:10px;display:flex;align-items:center;gap:10px"><button class="btn btn-sm" onclick="distTogglePlan()" style="font-size:.68rem">'+(DIST_PLAN_OPEN?'▾ Ocultar plan de rebalanceo':'▸ Plan de rebalanceo')+'</button>'+
      '<span style="font-family:var(--mono);font-size:.66rem;color:var(--text2)">'+plan.length+(plan.length>1?' órdenes':' orden')+' · neto <span class="port-sensitive" style="color:'+(neto>=0?'var(--accent)':'#eab308')+'">'+(neto>=0?'+':'−')+'$'+num(Math.abs(neto))+'</span></span></div>';
    if(DIST_PLAN_OPEN){
      var grp=function(tipo,titulo){
        var os=plan.filter(function(o){return o.tipo===tipo;}).sort(function(a,b){return (a.acc===b.acc?b.ars-a.ars:(a.acc==='vender'?-1:1));});
        if(!os.length)return '';
        return '<tr><td colspan="4" style="text-align:left;color:var(--text3);font-size:.6rem;letter-spacing:.06em;padding-top:.5rem">'+titulo+'</td></tr>'+os.map(function(o){
          return '<tr><td style="text-align:left;font-weight:700">'+o.tk+'</td><td class="mono" style="color:'+(o.acc==='vender'?'#eab308':'var(--accent)')+'">'+o.acc+'</td>'+
            '<td class="mono"><span class="port-sensitive">$'+num(o.ars)+'</span></td><td class="mono" style="color:var(--text3)">'+(o.u!=null&&o.u>0?num(o.u)+o.uL:'—')+'</td></tr>';
        }).join('');
      };
      var perfilTxt=cats.map(function(x){var v=vals[x.k],pa=v/total*100;if(!x.r)return '';
        if(pa<x.r[0])return x.s+': faltan $'+num((x.r[0]/100*total-v)*x.tc);
        if(pa>x.r[1])return x.s+': sobran $'+num((v-x.r[1]/100*total)*x.tc);return '';}).filter(Boolean).join(' · ');
      html+='<div class="tw" style="margin-top:8px"><table><thead><tr><th style="text-align:left">Ticker</th><th>Orden</th><th>Monto $</th><th>Unidades</th></tr></thead><tbody>'+
        grp('RV','RENTA VARIABLE')+grp('RF','RENTA FIJA')+'</tbody></table>'+
        '<div style="font-family:var(--mono);font-size:.66rem;color:var(--text2);margin-top:8px;line-height:1.6">Ventas <span class="port-sensitive">$'+num(tv)+'</span> · Compras <span class="port-sensitive">$'+num(tc)+'</span> · Neto <span class="port-sensitive" style="color:'+(neto>=0?'var(--accent)':'#eab308')+'">'+(neto>=0?'+':'−')+'$'+num(Math.abs(neto))+'</span>'+(neto>=0?' (queda en liquidez)':' (sale de liquidez)')+
        (perfilTxt?'<br>Perfil '+pName+' → '+perfilTxt:'')+
        '<br><span style="color:var(--text3)">Ventas: llevar al 2% de su tipo · Compras: llegar al umbral de inversiones chicas. Orientativo, no incluye comisiones.</span></div></div>';
    }
    body.insertAdjacentHTML('beforeend',html);
  }
  if(meta)meta.innerHTML='Total USD <span class="port-sensitive">'+num(total)+'</span> · a valor de mercado';
}

// ─── % Anual por posición (XIRR en USD con compras, ventas, dividendos y valor de hoy) ───
var PA_LAST={};
function _paParseFecha(f){
  if(!f)return null;var p;
  if(f.indexOf('/')>0){p=f.split('/');if(p.length!==3)return null;var y=p[2].length===2?2000+parseInt(p[2],10):parseInt(p[2],10);return new Date(y,parseInt(p[1],10)-1,parseInt(p[0],10),12);}
  if(f.indexOf('-')>0){p=f.split('-');if(p.length!==3)return null;return new Date(parseInt(p[0],10),parseInt(p[1],10)-1,parseInt(p[2],10),12);}
  return null;
}
function _paCCLnear(dt){
  if(!dt)return null;
  for(var i=0;i<=7;i++){for(var sg=-1;sg<=1;sg+=2){var d2=new Date(dt);d2.setDate(d2.getDate()+sg*i);var k=String(d2.getDate()).padStart(2,'0')+'/'+String(d2.getMonth()+1).padStart(2,'0')+'/'+d2.getFullYear();if(CCL_TABLE[k])return CCL_TABLE[k];if(i===0)break;}}
  return null;
}
function paBuildFlows(){
  var res={},qty={};
  var ord=(movimientos||[]).filter(function(m){return m&&m.ticker&&(m.tipo==='compra'||m.tipo==='venta'||m.tipo==='dividendo')&&m.owner!=='cristian'&&(typeof CARTERA_ACTIVA==='undefined'||(m.cartera||'principal')===CARTERA_ACTIVA);})
    .map(function(m){return {m:m,d:_paParseFecha(m.fecha)};}).filter(function(x){return x.d;})
    .sort(function(a,b){return (a.d-b.d)||((a.m.id||0)-(b.m.id||0));});
  ord.forEach(function(x){
    var m=x.m,t=m.ticker;
    var esBono=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI');
    var tc=esBono?(getMEP(m.fecha)||getCCL(m.fecha)||m.ccl||MEP_HOY||CCL_HOY):(getCCL(m.fecha)||m.ccl||CCL_HOY);
    var directo=isBonoUSDDirecto(t);
    var unitUSD=directo?(m.precioARS||0):(tc>0&&(m.precioARS||0)>0?(m.precioARS||0)/tc:(m.precioUSD||0));
    var com=directo?(m.comision||0):((m.comision||0)/(tc>0?tc:1));
    if(m.tipo==='compra'){
      if(!res[t]||(qty[t]||0)<=0.000001){res[t]={flows:[],start:x.d,compras:0};qty[t]=0;}
      res[t].flows.push({d:x.d,v:-(unitUSD*(m.qty||0)+com),lbl:'Compra '+(+(m.qty||0)).toLocaleString('es-AR')});
      res[t].compras++;qty[t]+=(m.qty||0);
    } else if(m.tipo==='venta'){
      if(!res[t])return;
      res[t].flows.push({d:x.d,v:unitUSD*(m.qty||0)-com,lbl:'Venta '+(+(m.qty||0)).toLocaleString('es-AR')});
      qty[t]-=(m.qty||0);
      if(qty[t]<=0.000001){delete res[t];qty[t]=0;}
    } else if(m.tipo==='dividendo'){
      if(res[t]&&x.d>=res[t].start&&(m.precioUSD||0)>0)res[t].flows.push({d:x.d,v:m.precioUSD,lbl:'Dividendo'});
    }
  });
  try{if(typeof dividendos!=='undefined')(dividendos||[]).forEach(function(dv){
    var t=dv&&dv.ticker;if(!t||!res[t])return;var d=_paParseFecha(dv.fecha);if(!d||d<res[t].start)return;
    var usd=dv.usd||0;if(!usd&&(dv.ars||0)>0){var tc=getCCL(dv.fecha)||dv.ccl||CCL_HOY;if(tc>0)usd=dv.ars/tc;}
    if(usd>0)res[t].flows.push({d:d,v:usd,lbl:'Dividendo'});
  });}catch(e){}
  try{(TRK.divs||[]).forEach(function(dv){
    if(!dv||dv.estado==='pendiente')return;var t=dv.ticker;if(!t||!res[t])return;
    var d=_paParseFecha(dv.fecha);if(!d||d<res[t].start)return;
    var usd;if(dv.moneda==='USD')usd=dv.montoUSD||dv.monto||0;else{var c=_paCCLnear(d)||dv.cclUsado;usd=c?(dv.monto||0)/c:(dv.montoUSD||0);}
    if(usd>0)res[t].flows.push({d:d,v:usd,lbl:(dv.tipo==='RENTA'?'Renta':'Dividendo')});
  });}catch(e){}
  Object.keys(res).forEach(function(t){res[t].flows.sort(function(a,b){return a.d-b.d;});});
  return res;
}
function paXIRR(flows){
  if(!flows||flows.length<2)return null;
  var t0=flows[0].d.getTime();
  var ts=flows.map(function(f){return (f.d.getTime()-t0)/864e5/365;});
  function npv(r){var s=0;for(var i=0;i<flows.length;i++)s+=flows[i].v/Math.pow(1+r,ts[i]);return s;}
  var hasNeg=flows.some(function(f){return f.v<0;}),hasPos=flows.some(function(f){return f.v>0;});
  if(!hasNeg||!hasPos)return null;
  var lo=-0.9999,hi=10,flo=npv(lo),fhi=npv(hi);
  if(!isFinite(flo)||!isFinite(fhi)||flo*fhi>0){hi=100;fhi=npv(hi);if(flo*fhi>0)return null;}
  for(var k=0;k<200;k++){var mid=(lo+hi)/2,fm=npv(mid);if(Math.abs(fm)<1e-7||(hi-lo)<1e-9)return mid;if(flo*fm<0){hi=mid;fhi=fm;}else{lo=mid;flo=fm;}}
  return (lo+hi)/2;
}
function paCalc(flows,valorHoy){
  if(!flows||!flows.length||valorHoy==null||!(valorHoy>0))return null;
  var hoy=new Date();hoy.setHours(12,0,0,0);
  var all=flows.concat([{d:hoy,v:valorHoy,lbl:'Valor hoy',hoy:true}]).sort(function(a,b){return a.d-b.d;});
  var first=all[0].d,days=Math.max(0,Math.round((hoy-first)/864e5));
  var inv=0,ret=0;all.forEach(function(f){if(f.v<0)inv+=-f.v;else ret+=f.v;});
  var simple=inv>0?(ret/inv-1)*100:null;
  var anual=null;if(days>=90){var r=paXIRR(all);anual=r!=null&&isFinite(r)?r*100:null;}
  var _res={flows:all,days:days,simple:simple,anual:anual,gan:ret-inv};
  try{_res.spy=paSpy(flows.slice().sort(function(a,b){return a.d-b.d;}),days);}catch(e){}
  return _res;
}
document.addEventListener('click',function(e){var p=document.getElementById('pa-pop');if(p&&!p.contains(e.target)&&!(e.target.closest&&e.target.closest('.pa-cell')))p.remove();});

// ─── Carga diferida de librerías (mapa mundial) ───
function loadScriptOnce(src){
  window._lsoP=window._lsoP||{};
  if(!window._lsoP[src])window._lsoP[src]=new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=res;s.onerror=function(){delete window._lsoP[src];rej(new Error('No se pudo cargar '+src));};document.head.appendChild(s);});
  return window._lsoP[src];
}
var XLSX_SRC=window.XLSX_SRC||'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
function xlsxListo(){return typeof XLSX!=='undefined'?Promise.resolve():loadScriptOnce(XLSX_SRC);}
function _xlsxPrecargar(){if(typeof XLSX!=='undefined')return;var f=function(){xlsxListo().catch(function(){});};if(window.requestIdleCallback)requestIdleCallback(f,{timeout:3000});else setTimeout(f,500);}
window.addEventListener('change',function(e){var t=e.target;
 if(!t||t.type!=='file'||t._xlsxRe||typeof XLSX!=='undefined'||!t.files||!t.files.length)return;
 if(!Array.prototype.some.call(t.files,function(f){return /\.(xlsx|xls|xlsm|ods|csv)$/i.test(f.name||'');}))return;
 e.stopImmediatePropagation();
 xlsxListo().then(function(){t._xlsxRe=true;try{t.dispatchEvent(new Event('change',{bubbles:true}));}finally{t._xlsxRe=false;}})
  .catch(function(){alert('No se pudo cargar el lector de Excel. Revisá la conexión y volvé a elegir el archivo.');});
},true);
var CHART_SRC=window.CHART_SRC||'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js';
function chartListo(){return typeof Chart!=='undefined'?Promise.resolve():loadScriptOnce(CHART_SRC);}
var _chartPend=new Map(),_chartTmr=null,_chartYa=false;
function _chartCargar(){
  if(_chartYa)return;_chartYa=true;clearTimeout(_chartTmr);
  chartListo().then(function(){var L=Array.from(_chartPend.entries());_chartPend.clear();L.forEach(function(x){try{x[0].apply(null,x[1]);}catch(e){console.warn('chart',e);}});}).catch(function(){_chartPend.clear();_chartYa=false;});
}
// Si Chart.js no está, anota el gráfico para dibujarlo cuando llegue. tarde=true (gráfico oculto): espera 2,5 s para no competir con la carga.
function _chartLuego(fn,args,tarde){
  if(typeof Chart!=='undefined')return false;
  _chartPend.set(fn,Array.prototype.slice.call(args||[]));
  if(!tarde)_chartCargar();else if(!_chartYa&&!_chartTmr)_chartTmr=setTimeout(_chartCargar,2500);
  return true;
}
window._jvmReady=false;
function loadVectorMap(){
  if(window._jvmP)return window._jvmP;
  window._jvmP=loadScriptOnce('https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/js/jsvectormap.min.js')
    .then(function(){return loadScriptOnce('https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/maps/world.js');})
    .then(function(){window._jvmReady=true;})
    .catch(function(e){window._jvmP=null;console.warn(e);});
  return window._jvmP;
}
window.addEventListener('load',function(){setTimeout(loadVectorMap,1500);});

// ─── Alerta P. Venta alcanzado ───
function pvAlertRender(list){
  var el=document.getElementById('pventa-alert');if(!el)return;
  if(!list||!list.length){el.style.display='none';el.innerHTML='';return;}
  var fEl=document.getElementById('port-ticker-filter');var fOn=fEl&&fEl.value.trim();
  el.style.display='';
  el.innerHTML='🎯 <b>'+list.length+' activo'+(list.length>1?'s':'')+' alcanz'+(list.length>1?'aron':'ó')+' su P. Venta:</b> '+
    list.map(function(t){return '<span onclick="pvAlertFiltrar(this.dataset.t)" data-t="'+t.replace(/"/g,'&quot;')+'" style="cursor:pointer;text-decoration:underline dotted;margin-right:8px">'+t+'</span>';}).join('')+
    (fOn?'<span onclick="pvAlertFiltrar(\'\')" style="cursor:pointer;color:var(--text3);margin-left:6px">✕ quitar filtro</span>':'');
}
function negAlertRender(list){
  var el=document.getElementById('neg-alert');
  if(!el){var pv=document.getElementById('pventa-alert');if(!pv||!pv.parentNode)return;el=document.createElement('div');el.id='neg-alert';
    el.style.cssText='display:none;margin-bottom:.7rem;padding:.45rem .8rem;border:1px solid var(--red);border-radius:var(--rsm);background:rgba(255,82,82,.08);font-size:.74rem;color:var(--text);font-family:var(--mono);max-width:720px';
    pv.parentNode.insertBefore(el,pv);}
  if(!list||!list.length){el.style.display='none';return;}
  el.style.display='';
  el.innerHTML='⚠️ <b>Cantidad negativa</b> (se vendió más de lo cargado como compra, no se muestra en las tablas): '+list.join(' · ')+' — revisá esos movimientos.';
}
function pvAlertFiltrar(t){var fEl=document.getElementById('port-ticker-filter');if(!fEl)return;fEl.value=t;renderPortfolio();}

// ─── SPY: historial diario (ajustado por dividendos) para comparar el % Anual ───
var SPY_HIST=null,SPY_KEYS=null,_spyLoading=false;
var SPY_LS_KEY=(PFX+'spyHist');
(function(){try{var c=JSON.parse(localStorage.getItem(SPY_LS_KEY)||'null');if(c&&c.data){SPY_HIST=c.data;SPY_KEYS=Object.keys(c.data).sort();window._spyDay=c.day;}}catch(e){}})();
function _spyAt(d){
  if(!SPY_KEYS||!SPY_KEYS.length)return null;
  var k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  if(k<SPY_KEYS[0])return null;
  var lo=0,hi=SPY_KEYS.length-1;while(lo<hi){var mid=(lo+hi+1)>>1;if(SPY_KEYS[mid]<=k)lo=mid;else hi=mid-1;}
  return SPY_HIST[SPY_KEYS[lo]];
}
function paSpy(flowsSinHoy,days){
  if(!SPY_KEYS||!flowsSinHoy||!flowsSinHoy.length)return null;
  var sh=0,out=[];
  for(var i=0;i<flowsSinHoy.length;i++){var f=flowsSinHoy[i],px=_spyAt(f.d);if(!px)return null;sh+=-f.v/px;out.push({d:f.d,v:f.v});}
  var last=SPY_HIST[SPY_KEYS[SPY_KEYS.length-1]];var val=sh*last;
  var hoy=new Date();hoy.setHours(12,0,0,0);out.push({d:hoy,v:val});
  var inv=0,ret=0;out.forEach(function(f){if(f.v<0)inv+=-f.v;else ret+=f.v;});
  var simple=inv>0?(ret/inv-1)*100:null,anual=null;
  if(days>=90){var r=paXIRR(out);anual=r!=null&&isFinite(r)?r*100:null;}
  return {anual:anual,simple:simple};
}

// ─── Funciones de portafolios con broker Bull Market (antes solo en Juli/Hilda/Omar) ───
function runComparacionBroker(){
  var el=document.getElementById('cmp-result');
  if(!_cmpData.portafolio||!_cmpData.broker){
    el.innerHTML='<div style="font-size:.8rem;color:var(--text3);padding:.6rem 0">Cargá los dos archivos primero.</div>';return;
  }
  var port=_cmpData.portafolio,broker=_cmpData.broker;
  var tickers=new Set(Object.keys(port).concat(Object.keys(broker)));
  var diffs=[];
  tickers.forEach(function(t){
    var p=port[t]||0,b=broker[t]||0,diff=p-b;
    var status=p>0&&!broker[t]?'Solo '+CFG.nombre:!port[t]&&b>0?'Solo '+CFG.brokerNombre:Math.abs(diff)<0.0001?'Igual':'Diferente';
    if(status!=='Igual')diffs.push({t:t,p:p,b:b,diff:diff,status:status});
  });
  var order={};order['Solo '+CFG.brokerNombre]=0;order['Solo '+CFG.nombre]=1;order['Diferente']=2;
  diffs.sort(function(a,b){return (order[a.status]-order[b.status])||a.t.localeCompare(b.t);});
  if(!diffs.length){
    el.innerHTML='<div style="font-size:.82rem;color:var(--accent);padding:.6rem 0">✓ Sin diferencias — los portafolios coinciden.</div>';return;
  }
  var html='<div style="display:flex;align-items:center;gap:14px;margin-bottom:8px">'
    +'<span style="font-size:.65rem;font-family:var(--mono);color:var(--text3)">'+diffs.length+' diferencia(s)</span>'
    +'<span id="cmp-resolved-count" style="font-size:.65rem;font-family:var(--mono);color:var(--accent)">'+_cmpChecked.size+' / '+diffs.length+' resueltos</span>'
    +'</div>';
  html+='<div class="tw panel-table"><table><thead><tr>'
    +'<th style="width:28px"></th>'
    +'<th>Ticker</th><th>'+CFG.nombre+'</th>'
    +'<th><img src="../Bull.png" style="height:13px;vertical-align:middle;opacity:.85"></th>'
    +'<th>Diferencia</th><th>Estado</th>'
    +'</tr></thead><tbody>';
  diffs.forEach(function(d){
    var sc=d.status===('Solo '+CFG.nombre)?'var(--accent)':d.status===('Solo '+CFG.brokerNombre)?'#448aff':'#f59e0b';
    var diffStr=d.p>0&&d.b>0?(d.diff>0?'+':'')+d.diff.toLocaleString('es-AR'):'—';
    var done=_cmpChecked.has(d.t);
    html+='<tr style="'+(done?'opacity:.35;text-decoration:line-through':'')+'">'
      +'<td style="text-align:center;padding:.25rem .35rem">'
      +'<input type="checkbox"'+(done?' checked':'')+' onchange="cmpToggleCheck(\''+d.t+'\',this)" style="accent-color:var(--accent);cursor:pointer;width:13px;height:13px">'
      +'</td>'
      +'<td><span style="font-weight:700;font-family:var(--mono)">'+d.t+'</span></td>'
      +'<td class="mono">'+(d.p?d.p.toLocaleString('es-AR'):'—')+'</td>'
      +'<td class="mono">'+(d.b?d.b.toLocaleString('es-AR'):'—')+'</td>'
      +'<td class="mono" style="color:'+sc+'">'+diffStr+'</td>'
      +'<td><span style="font-size:.65rem;color:'+sc+'">'+d.status+'</span></td>'
      +'</tr>';
  });
  html+='</tbody></table></div>';
  el.innerHTML=html;
}
function cmpParseRowsBroker(ab){
  try{
    var wb=XLSX.read(new Uint8Array(ab),{type:'array'});
    for(var i=0;i<wb.SheetNames.length;i++){
      var ws=wb.Sheets[wb.SheetNames[i]];
      var rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
      if(rows.length>1)return rows;
    }
  }catch(ex){}
  var txt=new TextDecoder('utf-8').decode(ab);
  var doc=new DOMParser().parseFromString(txt,'text/html');
  var rows=[];
  doc.querySelectorAll('tr').forEach(function(tr){
    var row=[];tr.querySelectorAll('td,th').forEach(function(td){row.push(td.textContent.trim());});
    if(row.some(function(c){return c;}))rows.push(row);
  });
  return rows;
}
function cargarJuliEnComparacion(){
  var pos=getPositions().filter(function(p){return Math.abs(p.qty)>0.000001;});
  if(!pos.length){alert('El portafolio no tiene posiciones.');return;}
  var map={};pos.forEach(function(p){map[p.ticker]=p.qty;});
  _cmpData.portafolio=map;_cmpNombres.portafolio={};
  var el=document.getElementById('cmp-port-name');
  if(el)el.textContent='Portafolio actual';
  showPage('comparacion',document.querySelector('[onclick*="comparacion"]'));
}
function cmpLoadPortfolio(input){
  var f=input.files[0];if(!f)return;
  document.getElementById('cmp-port-name').textContent=f.name;
  var reader=new FileReader();
  reader.onload=function(e){
    var rows=cmpParseRowsBroker(e.target.result);
    if(!rows||!rows.length){alert('No se pudo leer el archivo.');return;}
    var hdrIdx=rows.findIndex(function(r){return r.some(function(c){return cmpNorm(c)==='ticker';});});
    if(hdrIdx<0){alert('No se encontró columna Ticker.');return;}
    var hdr=rows[hdrIdx].map(cmpNorm);
    var tCol=hdr.indexOf('ticker');
    var qCol=hdr.findIndex(function(c){return c.includes('cantidad');});
    if(qCol<0){alert('No se encontró columna Cantidad.');return;}
    var map={};
    rows.slice(hdrIdx+1).forEach(function(r){
      var t=String(r[tCol]||'').trim().toUpperCase();
      var q=parseFloat(String(r[qCol]||'').trim().replace(/\./g,'').replace(',','.'));
      if(t&&!isNaN(q)&&q>0)map[t]=q;
    });
    _cmpData.portafolio=map;_cmpNombres.portafolio={};
  };
  reader.readAsArrayBuffer(f);
}
function cmpParseBullText(txt){
  var lines=txt.split(/\r?\n/);
  var tickerRe=/^[A-Z][A-Z0-9]{0,7}$/;
  var map={};
  for(var i=0;i<lines.length;i++){
    var line=lines[i].trim();
    if(!tickerRe.test(line))continue;
    var ticker=line;
    var j=i+1;
    while(j<lines.length&&!lines[j].trim())j++;
    if(j>=lines.length)continue;
    if(lines[j].indexOf('\t')===-1){
      j++;
      while(j<lines.length&&!lines[j].trim())j++;
    }
    if(j>=lines.length)continue;
    var dataLine=lines[j];
    if(dataLine.indexOf('\t')===-1)continue;
    var cols=dataLine.trim().split('\t');
    if(cols.length<2)continue;
    var qty=parseFloat(cols[0].trim().replace(/\./g,'').replace(',','.'));
    if(!isNaN(qty)&&qty>0){map[ticker]=qty;i=j;}
  }
  return map;
}
function cmpBullTextChanged(){
  var txt=document.getElementById('cmp-bull-textarea').value;
  var m=cmpParseBullText(txt);
  var n=Object.keys(m).length;
  var el=document.getElementById('cmp-bull-status');
  if(n>0){
    _cmpData.broker=m;
    el.textContent='✓ '+n+' posiciones cargadas';
    el.style.color='var(--accent)';
  }else{
    _cmpData.broker=null;
    el.textContent=txt.trim()?'Sin posiciones detectadas':'';
    el.style.color='var(--text3)';
  }
}
function trkImpParseBMNum(v){
  if(typeof v==='number') return v;
  return trkImpParseNum(String(v==null?'':v));
}
function trkImpParseBMDate(v){
  if(v instanceof Date){
    var y=v.getFullYear(),mo=String(v.getMonth()+1).padStart(2,'0'),d=String(v.getDate()).padStart(2,'0');
    return y+'-'+mo+'-'+d;
  }
  if(typeof v==='number'){
    var ms=(v-25569)*86400000;
    var d2=new Date(ms);
    if(isNaN(d2.getTime())) return null;
    var y2=d2.getUTCFullYear(),mo2=String(d2.getUTCMonth()+1).padStart(2,'0'),dd2=String(d2.getUTCDate()).padStart(2,'0');
    return y2+'-'+mo2+'-'+dd2;
  }
  return trkImpParseDate(String(v==null?'':v));
}
function trkImpParseBullMarket(wb, moneda){
  var shName = wb.SheetNames[0];
  if(!shName) return null;
  var ws = wb.Sheets[shName];

  var range={s:{r:0,c:0},e:{r:0,c:0}};
  Object.keys(ws).filter(function(k){return k[0]!=='!';}).forEach(function(k){
    var coord=XLSX.utils.decode_cell(k);
    if(coord.r>range.e.r)range.e.r=coord.r;
    if(coord.c>range.e.c)range.e.c=coord.c;
  });
  if(range.e.r<1) return null;

  function gc(r,c){
    var cell=ws[XLSX.utils.encode_cell({r:r,c:c})];
    return cell?(cell.v!==undefined?cell.v:''):'';
  }
  function norm(s){return String(s==null?'':s).trim().toLowerCase();}

  var hdr=[];
  for(var c=0;c<=range.e.c;c++) hdr.push(norm(gc(0,c)));
  var cLiq     = hdr.findIndex(function(h){return h.indexOf('liquida')>=0;});
  var cComp    = hdr.indexOf('comprobante');
  var cEspecie = hdr.indexOf('especie');
  var cImporte = hdr.indexOf('importe');
  if(cLiq<0||cComp<0||cEspecie<0||cImporte<0) return null;

  var out=[];
  for(var r=1;r<=range.e.r;r++){
    var comp=norm(gc(r,cComp));
    var tipo=null;
    if(comp==='dividendos') tipo='DIV';
    else if(comp.indexOf('renta')>=0 && comp.indexOf('amortiz')>=0) tipo='RENTA';
    else continue;

    var ticker=String(gc(r,cEspecie)||'').trim().toUpperCase();
    if(!ticker) continue;

    var fecha=trkImpParseBMDate(gc(r,cLiq));
    if(!fecha) continue;

    var monto=trkImpParseBMNum(gc(r,cImporte));
    if(!monto||monto<=0) continue;

    out.push({fecha:fecha,ticker:ticker,tipo:tipo,moneda:moneda,monto:monto,acciones:null,descr:ticker+' — '+gc(r,cComp)});
  }
  return out.length?out:null;
}
function trkImpParseBM(input, fname, moneda){
  var status = document.getElementById('trk-imp-status');
  status.className='smsg';
  status.textContent = 'Procesando...';

  try{
    var wb=XLSX.read(new Uint8Array(input),{type:'array'});
    var rows=trkImpParseBullMarket(wb, moneda);

    if(!rows||!rows.length){
      status.className='emsg';
      status.textContent='No se encontraron filas de dividendos/renta en el archivo.';
      return;
    }

    var res=trkQueuePendingRows(rows);
    document.getElementById('trk-imp-badge').textContent = fname||'';
    status.className='smsg';
    status.textContent = res.added
      ? (res.added+' fila(s) nueva(s) agregadas a "Pendientes de revisión" ↓ ('+res.dup+' ya existían)')
      : ('Sin filas nuevas — las '+res.dup+' encontradas ya estaban cargadas o pendientes.');
    setTimeout(function(){status.textContent='';},8000);

  } catch(err){
    status.className='emsg';
    status.textContent = 'Error al procesar: ' + err.message;
    console.error('trkImpParseBM error:', err);
  }
}
function perfCalcUpdate(){
  var inp = document.getElementById('perf-target-usd');
  var el  = document.getElementById('perf-result-usd');
  if(!inp||!el) return;
  try{localStorage.setItem(PFX+'perf_target', inp.value);}catch(e){}
  if(typeof sbSetConfig==='function') sbSetConfig('perf_target', inp.value||null);
  var target     = parseFloat(inp.value)||0;
  var invInicial = getRawNum('inv-sidebar-usd');
  if(!target||!invInicial){el.textContent='—';el.style.color='var(--text2)';return;}
  var result = (target - invInicial) * 0.20;
  el.textContent = (result>=0?'+':'')+Math.round(result).toLocaleString('es-AR')+' USD';
  el.style.color = result>=0?'var(--accent)':'var(--red)';
}
function cargarPortafolioEnComparacion(){return cargarJuliEnComparacion();}

// ─── Resumen para la vista familiar ───────────────────────────────────────────
var _famPrev=null,_famTimer=null,_famLastSave=0,_famLastTotal=0,_famLoaded=false;
function famQueueSnapshot(d){
  if(d&&d.totalVal>0){INF_LAST=d;if(typeof _gdcInitDone!=='undefined'&&_gdcInitDone){try{uvActualizar(d);}catch(e){console.warn('uv',e);}try{ratiosAuto();}catch(e){}}}
  if(typeof _gdcInitDone==='undefined'||!_gdcInitDone)return;
  if(!d||!(d.totalVal>0)||!d.pos.length)return;
  clearTimeout(_famTimer);
  _famTimer=setTimeout(function(){famSaveSnapshot(d);},4000);
}
async function famSaveSnapshot(d){
  try{
    var now=Date.now(),tot=d.totalVal+d.liqTotalUSD;
    if(now-_famLastSave<180000&&_famLastTotal>0&&Math.abs(tot/_famLastTotal-1)<0.005)return;
    if(!_famLoaded){_famLoaded=true;try{_famPrev=await sbGetConfig('resumen_familia');}catch(e){}}
    var cart=(typeof CARTERA_ACTIVA!=='undefined')?CARTERA_ACTIVA:'principal';
    var doc=(_famPrev&&typeof _famPrev==='object'&&_famPrev.carteras)?_famPrev:{carteras:{}};
    doc.v=1;doc.id=CFG.id;doc.nombre=CFG.nombre;doc.ts=now;doc.appVersion=APP_VERSION;
    doc.ccl=CCL_HOY;doc.mep=MEP_HOY;
    doc.liq={usd:d.liqUSD||0,ars:d.liqARS||0,totalUSD:d.liqTotalUSD||0};
    if(cart==='principal'||!doc.cobros)doc.cobros=d.cobros;
    if(cart==='principal'&&d.cobros12)doc.cobros12=d.cobros12;
    doc.carteras[cart]={ts:now,totalVal:d.totalVal,totalCost:d.totalCost,sectorVal:d.sectorVal,dolzPct:d.dolzPct,pos:d.pos,rend:d.rendPct};
    if(cart==='principal'||doc.rend==null){doc.rend=d.rendPct;doc.invInicial=d.invInicial||null;}
    doc.periodoInicio=CFG.periodoInicio||null;
    if(CFG.honorario){try{await honCargar();doc.honorarios=HON_LIST||[];}catch(e){}}
    try{var _cm={},_ct={};(TRK.divs||[]).forEach(function(x){if(x.estado==='pendiente'||(x.cartera&&x.cartera!==cart))return;var f=_infISO(x.fecha);if(!f)return;
      var u=divUSD(x);if(!(u>0))return;var k=f.slice(0,7);_cm[k]=Math.round(((_cm[k]||0)+u)*100)/100;var tp=divTipo(x),b=_ct[k]||(_ct[k]={div:0,renta:0,amort:0});b[tp==='DIV'?'div':tp==='AMORT'?'amort':'renta']=Math.round((b[tp==='DIV'?'div':tp==='AMORT'?'amort':'renta']+u)*100)/100;});
      if(cart==='principal'){doc.cobradosMes=_cm;doc.cobradosTipo=_ct;}}catch(e){}
    try{doc.salud=saludCalc(d);}catch(e){}
    try{doc.ops30=_ops30();}catch(e){}
    if(cart==='principal'&&CFG.vistaFamiliar){try{await vistaPublicar(d);}catch(e){}}
    if(cart==='principal'&&CFG.push){try{await pushWatchPublicar(d);}catch(e){}}
    if(cart==='principal'){try{doc.sist={vista:CFG.vistaFamiliar?Date.now():null,aportes:(CFG.aportes&&_aporLoaded)?APOR.length:null,avisos:CFG.push?true:null,bk:(function(){try{return localStorage.getItem(PFX+'bk_last')||null;}catch(e){return null;}})()};}catch(e){}}
    if(cart==='principal'){try{if(CFG.historial&&typeof histLoad==='function')await histLoad();var rp=rendPeriodos();if(Object.keys(rp).length)doc.rendPer=rp;else delete doc.rendPer;}catch(e){}
    if(cart==='principal'){try{if(typeof histLoad==='function')await histLoad();var _bs=b100Serie();if(_bs)doc.b100=_bs;else delete doc.b100;delete doc.b100cov;
      var _br=_b100Ref();if(_br&&_br.spx)doc.b100ref={spx:_br.spx};if(CFG.id==='gdc'&&(!_br||_br.d!==_flujosHoyStr()))b100RefBg();}catch(e){}}
      try{await saltosOkLoad();doc.salud=doc.salud||{};doc.salud.saltos=saltosDetectar();var _c=histUltimoCorte();doc.salud.cierrePend=(_c&&HIST&&!HIST.cierres.some(function(x){return x.d===_c;})&&HIST.puntos.length&&HIST.puntos[0].d<_c&&_aporDias(_c,_hHoy())<=60)?_c:null;}catch(e){}}
    if(CFG.aportes&&_aporLoaded&&cart==='principal'){try{doc.aporNeto=Math.round(aporNeto()*100)/100;}catch(e){}}else if(!CFG.aportes)delete doc.aporNeto;
    _famPrev=doc;
    var ok=await sbSetConfig('resumen_familia',doc);
    if(ok){_famLastSave=now;_famLastTotal=tot;}
    try{await histRecord(d,cart);}catch(e){console.warn('histRecord',e);}
  }catch(e){console.warn('famSaveSnapshot',e);}
}

// ─── Backups (plan Free de Supabase no tiene backups descargables) ─────────────
var BK_KEEP=14,_bkRunning=false;
function _bkHoy(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
async function _bkList(){
  try{var r=await fetch(SUPABASE_URL+'/rest/v1/config?select=key,updated_at&key=like.backup_*',{headers:sbHeaders()});if(!r.ok)return null;var d=await r.json();
    return d.map(function(x){return x.key;}).sort().reverse();}catch(e){return null;}
}
async function _bkSnapshot(){
  var r=await fetch(SUPABASE_URL+'/rest/v1/config?select=key,value&key=not.like.backup_*',{headers:sbHeaders()});
  if(!r.ok)throw new Error('config '+r.status);
  var rows=await r.json(),cfg={};
  rows.forEach(function(x){if(x.key!=='resumen_familia')cfg[x.key]=x.value;});
  var mv=await sbLoadArray('movimientos'),td=await sbLoadArray('trk_divs');
  if(mv===null||td===null)throw new Error('sin conexión');
  return {v:1,portafolio:CFG.id,ts:Date.now(),appVersion:APP_VERSION,movimientos:mv,trk_divs:td,config:cfg};
}
async function _bkDel(key){try{await fetch(SUPABASE_URL+'/rest/v1/config?key=eq.'+encodeURIComponent(key),{method:'DELETE',headers:sbHeaders()});}catch(e){}}
async function bkDaily(){
  if(_bkRunning)return;_bkRunning=true;
  try{
    if(!movimientos||!movimientos.length)return;
    var key='backup_'+_bkHoy();
    try{if(localStorage.getItem(PFX+'bk_last')===key)return;}catch(e){}
    var list=await _bkList();if(list===null)return;
    if(list.indexOf(key)<0){
      var snap=await _bkSnapshot();
      if(!snap.movimientos.length)return;
      var ok=await sbSetConfig(key,snap);if(!ok)return;
      list.unshift(key);
    }
    try{localStorage.setItem(PFX+'bk_last',key);}catch(e){}
    var diarios=list.filter(function(k){return /^backup_\d{4}-\d{2}-\d{2}$/.test(k);}).sort().reverse();
    var pre=list.filter(function(k){return /_prerestore$/.test(k);}).sort().reverse();
    for(var i=BK_KEEP;i<diarios.length;i++)await _bkDel(diarios[i]);
    for(var k2=5;k2<pre.length;k2++)await _bkDel(pre[k2]);
  }catch(e){console.warn('[backup]',e);}
  finally{_bkRunning=false;}
}
async function _bkGet(key){var v=await sbGetConfig(key);return (v&&typeof v==='object')?v:null;}
function _bkDownload(obj,name){
  var blob=new Blob([JSON.stringify(obj)],{type:'application/json'});var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);
}
async function bkOpen(){
  var ov=document.getElementById('bk-overlay');
  if(!ov){ov=document.createElement('div');ov.id='bk-overlay';ov.style.cssText='position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.55);display:flex;align-items:flex-start;justify-content:center;padding:8vh 16px';
    ov.onclick=function(e){if(e.target===ov)ov.remove();};document.body.appendChild(ov);}
  ov.innerHTML='<div style="background:var(--surface);border:1px solid var(--border2);border-radius:10px;width:100%;max-width:620px;max-height:80vh;overflow:auto;font-family:var(--mono);font-size:.75rem"><div style="padding:.7rem 1rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px"><b style="font-family:var(--sans);font-size:.9rem">💾 Backups — '+CFG.nombre+'</b><span style="margin-left:auto;cursor:pointer;color:var(--text3)" onclick="document.getElementById(\'bk-overlay\').remove()">✕</span></div><div id="bk-body" style="padding:.8rem 1rem;color:var(--text2)">Cargando…</div></div>';
  var list=await _bkList();var body=document.getElementById('bk-body');
  if(list===null){body.textContent='No se pudo leer la lista de backups (¿sesión iniciada?).';return;}
  var html='<div style="margin-bottom:10px;line-height:1.5">Copia automática diaria al abrir el portafolio (se guardan '+BK_KEEP+' días). Restaurar reemplaza movimientos, dividendos y configuración por los de esa fecha; antes se guarda una copia del estado actual.</div>'+
    '<div style="display:flex;gap:8px;margin-bottom:10px"><button class="btn btn-sm" onclick="bkNow()">Hacer backup ahora</button><button class="btn btn-sm" onclick="bkDownloadNow()">Descargar estado actual</button></div>';
  if(!list.length)html+='<div>Todavía no hay backups.</div>';
  else html+='<table style="width:100%;border-collapse:collapse">'+list.map(function(k){
      var lbl=k.replace('backup_','').replace('_prerestore',' (antes de restaurar)').replace(/_(\d{2})(\d{2})/,' $1:$2');
      return '<tr style="border-top:1px solid var(--border)"><td style="padding:.4rem .2rem;color:var(--text)">'+lbl+'</td><td style="text-align:right;padding:.4rem .2rem;white-space:nowrap"><button class="btn btn-sm" onclick="bkDownload(\''+k+'\')">Descargar</button> <button class="btn btn-sm" style="border-color:var(--red);color:var(--red)" onclick="bkRestore(\''+k+'\')">Restaurar</button></td></tr>';}).join('')+'</table>';
  body.innerHTML=html;
}
async function bkNow(){try{localStorage.removeItem(PFX+'bk_last');}catch(e){}var key='backup_'+_bkHoy();await _bkDel(key);await bkDaily();bkOpen();}
async function bkDownload(key){var b=await _bkGet(key);if(!b){alert('No se pudo leer ese backup.');return;}_bkDownload(b,CFG.id+'_'+key+'.json');}
async function bkDownloadNow(){try{var s=await _bkSnapshot();_bkDownload(s,CFG.id+'_backup_'+_bkHoy()+'.json');}catch(e){alert('No se pudo generar: '+e.message);}}
async function bkRestore(key){
  var b=await _bkGet(key);
  if(!b||!Array.isArray(b.movimientos)){alert('No se pudo leer ese backup.');return;}
  if(!confirm('Restaurar '+CFG.nombre+' al backup '+key.replace('backup_','')+'?\n\n'+b.movimientos.length+' movimientos y '+(b.trk_divs||[]).length+' dividendos reemplazan a los actuales ('+movimientos.length+' movimientos).\nAntes se guarda una copia del estado actual.'))return;
  try{
    var cur=await _bkSnapshot();var d=new Date();
    var preKey='backup_'+_bkHoy()+'_'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+'_prerestore';
    if(!await sbSetConfig(preKey,cur)){alert('No se pudo guardar la copia previa. No se restauró nada.');return;}
    var ok1=await sbSaveArrayRetry('movimientos',b.movimientos);
    var ok2=await sbSaveArray('trk_divs',b.trk_divs||[]);
    var keys=Object.keys(b.config||{});for(var i=0;i<keys.length;i++){await sbSetConfig(keys[i],b.config[keys[i]]);}
    try{localStorage.removeItem(PFX+'pending_sync');localStorage.removeItem(PFX+'mov2');localStorage.removeItem(TRK.DKEY);}catch(e){}
    alert((ok1&&ok2)?'Restaurado. La página se recarga.':'Restauración con errores — revisá los datos. La copia previa quedó como '+preKey);
    location.reload();
  }catch(e){alert('Error al restaurar: '+e.message);}
}
document.addEventListener('DOMContentLoaded',function(){
  if(document.getElementById('bk-btn'))return;
  var ref=document.getElementById('sync-btn')||document.querySelector('[onclick*="EnComparacion()"]');
  if(!ref)return;
  var b=document.createElement('button');b.id='bk-btn';b.className='btn-sidebar-toggle';b.title='Backups diarios: descargar o restaurar';b.textContent='💾';
  b.style.cssText='width:auto;padding:0 8px;font-size:.72rem';b.onclick=bkOpen;ref.parentNode.insertBefore(b,ref.nextSibling);
});

// ─── Historial diario y corte anual ───────────────────────────────────────────
var HIST=null,_histLoaded=false,HIST_RANGO=null,_histChart=null;
function _hHoy(){return _bkHoy();}
var FERIADOS_AR=new Set(['2025-01-01','2025-03-03','2025-03-04','2025-03-24','2025-04-02','2025-04-17','2025-04-18','2025-05-01','2025-05-02','2025-06-16','2025-06-20','2025-07-09','2025-08-15','2025-10-10','2025-11-21','2025-11-24','2025-12-08','2025-12-25',
  '2026-01-01','2026-02-16','2026-02-17','2026-03-23','2026-03-24','2026-04-02','2026-04-03','2026-05-01','2026-05-25','2026-06-15','2026-07-09','2026-07-10','2026-08-17','2026-10-12','2026-11-23','2026-12-07','2026-12-08','2026-12-25']);
function esDiaHabil(iso){var p=String(iso||'').split('-');if(p.length!==3)return true;var dw=new Date(+p[0],+p[1]-1,+p[2]).getDay();return dw!==0&&dw!==6&&!FERIADOS_AR.has(iso);}
var _histP=null;
function histLoad(){
  if(_histLoaded)return Promise.resolve(HIST);
  if(!_histP)_histP=_histLoadReal().then(function(x){_histP=null;return x;},function(){_histP=null;return null;});
  return _histP;
}
async function _histLoadReal(){
  try{
    var h,_pc=await _sbCfgDePrecarga('historial');
    if(_pc)h=_pc.v;
    else{var r=await fetch(SUPABASE_URL+'/rest/v1/config?key=eq.historial&select=value',{headers:sbHeaders()});
      if(!r.ok)return null;
      var d=await r.json();if(!Array.isArray(d))return null;
      h=d[0]?d[0].value:null;if(typeof h==='string'){try{h=JSON.parse(h);}catch(e){h=null;}}}
    HIST=(h&&typeof h==='object'&&Array.isArray(h.puntos))?h:{v:1,puntos:[],cierres:[]};
    if(!HIST.cierres)HIST.cierres=[];
    if(CFG.histDesdeRA)await histCargarRA();
    _histLoaded=true;return HIST;
  }catch(e){return null;}
}
async function histRecord(d,cart){
  if(!(await histLoad()))return;
  if(!esDiaHabil(_hHoy()))return;
  var hoy=_hHoy(),pts=HIST.puntos,p=pts.length&&pts[pts.length-1].d===hoy?pts[pts.length-1]:null;
  if(!p){p={d:hoy,c:{}};pts.push(p);}
  p.c[cart]={v:Math.round(d.totalVal*100)/100,cost:Math.round(d.totalCost*100)/100};
  p.liq=Math.round((d.liqTotalUSD||0)*100)/100;
  if(cart==='principal'||p.rend==null){p.rend=d.rendPct!=null?Math.round(d.rendPct*100)/100:null;p.inv=d.invInicial?Math.round(d.invInicial+(CFG.aportes&&typeof aporNeto==='function'&&cart==='principal'?aporNeto():0)):null;}
  await sbSetConfig('historial',HIST);
  histRender();
}
function histSerie(){
  if(!HIST)return [];
  var last={},out=[];
  var primero=HIST.puntos.length?HIST.puntos[0].d:'9999';
  (CFG.histPrevio||[]).slice().sort(function(a,b){return a[0]<b[0]?-1:1;}).forEach(function(x){if(x[0]<primero)out.push({d:x[0],v:x[1],pos:x[1],cost:null,inv:x[2]||null,rend:null,previo:true});});
  var incl=CFG.histCarteras||null;
  HIST.puntos.forEach(function(p){Object.keys(p.c||{}).forEach(function(k){if(!incl||incl.indexOf(k)>=0)last[k]=p.c[k];});
    if(!esDiaHabil(p.d))return;
    var v=0,cost=0;Object.keys(last).forEach(function(k){v+=last[k].v;cost+=last[k].cost;});
    out.push({d:p.d,v:v+(p.liq||0),pos:v,cost:cost,inv:p.inv,rend:p.rend});});
  try{if(CFG.aportes&&_aporLoaded){var inv0=getRawNum('inv-sidebar-usd'),ini=aporIni();
    if(inv0>0)out.forEach(function(x){if(x.previo||x.d<ini)return;var n=0;(APOR||[]).forEach(function(a){if(a.fecha>=ini&&a.fecha<=x.d)n+=(a.tipo==='retiro'?-1:1)*(+a.usd||0);});x.inv=Math.round(inv0+n);});}}catch(e){}
  return out;
}
function _raNum(x){var t=String(x==null?'':x).replace(/[^0-9.,\-]/g,'');
  if(/^-?\d{1,3}([.,]\d{3})+$/.test(t))t=t.replace(/[.,]/g,'');else t=t.replace(',','.');
  return parseFloat(t);}
async function histCargarRA(){
  try{
    var d=await sbGetConfig('rendanual_periodos');if(typeof d==='string')d=JSON.parse(d);
    if(!Array.isArray(d)||d.length<2)return;
    var corte=histUltimoCorte();if(!corte)return;
    var yC=parseInt(corte.slice(0,4),10),md=corte.slice(5);
    var ra={},prev=[],n=d.length;
    d.slice(0,n-1).forEach(function(p,i){
      var pu=_raNum(p.pusiste),te=_raNum(p.tenes);if(!(pu>0)||isNaN(te))return;
      var y0=yC-(n-1-i),fin=new Date(Date.UTC(y0+1,parseInt(md.slice(0,2),10)-1,parseInt(md.slice(3),10)-1));
      var ini=y0+'-'+md,mes=parseInt(p.meses,10);
      if(mes>0&&mes<12){var di=new Date(fin);di.setUTCMonth(di.getUTCMonth()-mes);ini=di.toISOString().slice(0,10);}
      ra[String(y0)]=Math.round((te-pu)/pu*10000)/100;
      prev.push([ini,pu,pu],[fin.toISOString().slice(0,10),te,pu]);
    });
    CFG.rendAnual=Object.assign(ra,CFG.rendAnual||{});
    CFG.histPrevio=(CFG.histPrevio||[]).concat(prev);
  }catch(e){}
}
function histUltimoCorte(){
  if(!CFG.periodoInicio)return null;
  var hoy=_hHoy(),y=parseInt(hoy.slice(0,4),10),c=y+'-'+CFG.periodoInicio;
  return c<=hoy?c:(y-1)+'-'+CFG.periodoInicio;
}
function histSetRango(r){HIST_RANGO=r;try{localStorage.setItem(PFX+'hist_rango',r);}catch(e){}histRender();}
function histRender(){
  if(!CFG.historial)return;
  var card=document.getElementById('hist-card');
  if(!card){var row=topCardsRow();if(!row)return;
    card=document.createElement('div');card.className='card';card.id='hist-card';
    card.innerHTML='<div class="card-header" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span class="card-title">📈 Evolución</span><span id="hist-rangos" style="display:flex;gap:4px;flex-wrap:wrap"></span><span id="hist-meta" class="tag" style="margin-left:auto"></span>'+(CFG.informe?'<button class="btn btn-sm" onclick="infAbrir()" title="Informe para mandarle a '+CFG.nombre+'" style="font-size:.66rem;padding:2px 8px">📄 Informe</button>':'')+(CFG.honorario?'<button class="btn btn-sm" onclick="honAbrir()" title="Registrar el honorario cobrado al cierre del período" style="font-size:.66rem;padding:2px 8px">💼 Honorario</button>':'')+'</div><div id="hist-cierre"></div><div style="padding:.6rem 1rem 1rem"><div style="position:relative;height:220px"><canvas id="hist-canvas"></canvas></div><div id="hist-nota" style="font-family:var(--mono);font-size:.64rem;color:var(--text3);margin-top:6px"></div></div>';
    row.appendChild(card);topCardPrep(card,'1 1 420px');
    var ca=document.createElement('div');ca.className='card';ca.id='hist-anual-card';
    ca.innerHTML='<div class="card-header" style="display:flex;align-items:center;gap:8px"><span class="card-title">📅 Rendimiento por período</span><span style="margin-left:auto"></span></div><div id="hist-anual" style="padding:.7rem 1rem 1rem"></div>';
    row.appendChild(ca);topCardPrep(ca,'1 1 300px');}
  if(!HIST)return;
  try{if(CFG.vistaNueva)nvCalendario();}catch(e){}
  var serie=histSerie();var corte=histUltimoCorte();
  if(!HIST_RANGO){try{HIST_RANGO=localStorage.getItem(PFX+'hist_rango');}catch(e){}HIST_RANGO=HIST_RANGO||(corte?'periodo':'todo');}
  var rangos=(corte?[['periodo','Período actual']]:[]).concat([['1m','1M'],['3m','3M'],['6m','6M'],['1a','1A'],['todo','Todo']]);
  document.getElementById('hist-rangos').innerHTML=rangos.map(function(r){var on=HIST_RANGO===r[0];return '<button class="btn btn-sm" onclick="histSetRango(\''+r[0]+'\')" style="font-size:.64rem;padding:2px 8px;'+(on?'border-color:var(--accent);color:var(--accent)':'')+'">'+r[1]+'</button>';}).join('');
  var desde=null,hoy=new Date();
  if(HIST_RANGO==='periodo')desde=corte;
  else if(HIST_RANGO!=='todo'){var m={'1m':1,'3m':3,'6m':6,'1a':12}[HIST_RANGO]||0;var dd=new Date(hoy);dd.setMonth(dd.getMonth()-m);desde=dd.toISOString().slice(0,10);}
  var s=serie.filter(function(x){return !desde||x.d>=desde;});
  var meta=document.getElementById('hist-meta'),nota=document.getElementById('hist-nota');
  var ult=serie.length?serie[serie.length-1]:null;
  if(HIST_RANGO==='periodo'&&ult&&ult.rend!=null){meta.innerHTML='Rendimiento del período <b style="color:'+(ult.rend>=0?'var(--accent)':'var(--red)')+'">'+(ult.rend>=0?'+':'')+ult.rend.toFixed(1).replace('.',',')+'%</b> · desde '+corte.split('-').reverse().join('/');}
  else if(s.length>1&&!s[0].previo){var r0=(s[s.length-1].v/s[0].v-1)*100;meta.innerHTML='Variación <b style="color:'+(r0>=0?'var(--accent)':'var(--red)')+'">'+(r0>=0?'+':'')+r0.toFixed(1).replace('.',',')+'%</b> · incluye aportes/retiros';}
  else meta.textContent='';
  meta.style.display=meta.textContent.trim()?'':'none';
  var primero=HIST.puntos.length?HIST.puntos[0].d.split('-').reverse().join('/'):null;
  nota.textContent=serie.length<2?('El historial empieza '+(primero?'el '+primero:'hoy')+': se agrega un punto por día cada vez que abrís el portafolio.'):'Valor total = posiciones a mercado + liquidez, en USD. Línea punteada = inversión inicial del período. Marcas verticales = cortes anuales.';
  var ci=document.getElementById('hist-cierre');
  var pend=corte&&!HIST.cierres.some(function(x){return x.d===corte;})&&(new Date(_hHoy())-new Date(corte))/86400000<=60&&ult&&HIST.puntos.length&&HIST.puntos[0].d<corte;
  var _prox=null;if(corte){var _pc=(parseInt(corte.slice(0,4),10)+1)+corte.slice(4),_dd=_aporDias(_hHoy(),_pc);if(_dd>=0&&_dd<=15)_prox={d:_pc,n:_dd};}
  ci.innerHTML=(!pend&&_prox)?'<div style="margin:.6rem 1rem 0;padding:.5rem .7rem;border:1px solid var(--border2);border-radius:var(--rsm);font-family:var(--mono);font-size:.72rem">📅 El período cierra el <b>'+_prox.d.split('-').reverse().join('/')+'</b> (en '+_prox.n+' día'+(_prox.n!==1?'s':'')+'). Ese día te va a aparecer el botón para cerrarlo.</div>':pend?'<div style="margin:.6rem 1rem 0;padding:.5rem .7rem;border:1px solid var(--amber);border-radius:var(--rsm);background:rgba(234,179,8,.08);font-family:var(--mono);font-size:.72rem">📅 Se cumplió el corte anual ('+corte.split('-').reverse().join('/')+'). <button class="btn btn-sm" onclick="cierreAbrir()" style="margin-left:6px">Cerrar período</button> <span style="color:var(--text3)">calcula ganancia y rendimiento con aportes, guarda el resultado y actualiza la Inv. Inicial</span></div>':'';
  var cortes=[];if(CFG.periodoInicio&&s.length){var y0=parseInt(s[0].d.slice(0,4),10),y1=parseInt(s[s.length-1].d.slice(0,4),10);for(var y=y0;y<=y1;y++){var cd=y+'-'+CFG.periodoInicio;if(cd>=s[0].d&&cd<=s[s.length-1].d)cortes.push(cd);}}
  histRenderAnual(ult);
  var cv=document.getElementById('hist-canvas'),wrapC=cv.parentNode;
  if(s.length<2){
    if(_histChart){try{_histChart.destroy();}catch(e){}_histChart=null;}
    cv.style.display='none';
    var ph=document.getElementById('hist-ph');if(!ph){ph=document.createElement('div');ph.id='hist-ph';ph.style.cssText='height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-family:var(--mono);color:var(--text2);font-size:.75rem;text-align:center';wrapC.appendChild(ph);}
    ph.style.display='flex';
    ph.innerHTML=ult?'<div style="font-size:.6rem;color:var(--text3);text-transform:uppercase;letter-spacing:.07em">Valor total hoy</div><div style="font-size:1.6rem;font-weight:700;color:var(--text)">USD '+Math.round(ult.v).toLocaleString('es-AR')+'</div><div>'+(serie.length>=2?'En este rango todavía hay un solo punto: probá con <b>Todo</b>.':'El gráfico se arma a partir de mañana, con un punto por día.')+'</div>':'<div>Esperando la primera actualización de precios…</div>';
    return;
  }
  cv.style.display='';var ph2=document.getElementById('hist-ph');if(ph2)ph2.style.display='none';
  if(_chartLuego(histRender,arguments,!cv||cv.offsetParent===null))return;
  var lab=s.map(function(x){return x.d.slice(8,10)+'/'+x.d.slice(5,7)+(HIST_RANGO==='todo'||HIST_RANGO==='1a'?'/'+x.d.slice(2,4):'');});
  var cortesIdx=cortes.map(function(cd){return s.findIndex(function(x){return x.d>=cd;});});
  var plug={id:'histCortes',afterDraw:function(ch){var xs=ch.scales.x,ys=ch.scales.y,ctx=ch.ctx;cortesIdx.forEach(function(i){if(i<0)return;var x=xs.getPixelForValue(i);ctx.save();ctx.strokeStyle='rgba(234,179,8,.6)';ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(x,ys.top);ctx.lineTo(x,ys.bottom);ctx.stroke();ctx.restore();});}};
  if(_histChart){try{_histChart.destroy();}catch(e){}}
  _histChart=new Chart(document.getElementById('hist-canvas').getContext('2d'),{type:'line',
    data:{labels:lab,datasets:[
      {label:'Valor total',data:s.map(function(x){return Math.round(x.v);}),borderColor:'#00e676',backgroundColor:'rgba(0,230,118,.08)',fill:true,tension:.25,pointRadius:s.length<40?3:0,borderWidth:2},
      {label:'Inversión inicial',data:s.map(function(x){return x.inv||null;}),borderColor:'#7a9cc5',borderDash:[5,4],pointRadius:0,borderWidth:1.5,stepped:true,spanGaps:true}]},
    options:{responsive:true,maintainAspectRatio:false,animation:false,interaction:{mode:'index',intersect:false},
      plugins:{legend:{labels:{color:'#7a9cc5',font:{family:'JetBrains Mono',size:10},boxWidth:10}},tooltip:{callbacks:{label:function(c){return c.dataset.label+': USD '+Math.round(c.parsed.y).toLocaleString('es-AR');}}}},
      scales:{x:{ticks:{color:'#3d5a80',font:{size:9},maxTicksLimit:8},grid:{color:'rgba(30,48,80,.4)'}},y:{ticks:{color:'#3d5a80',font:{size:9},callback:function(v){return Math.round(v/1000)+'k';}},grid:{color:'rgba(30,48,80,.4)'}}}},
    plugins:[plug]});
}
function histRenderAnual(ult){
  var el=document.getElementById('hist-anual');if(!el)return;
  var per={};
  Object.keys(CFG.rendAnual||{}).forEach(function(y){per[y]={r:CFG.rendAnual[y],src:'cargado'};});
  (HIST&&HIST.cierres||[]).forEach(function(cz){if(cz.rendFinal!=null){var y=String(parseInt(cz.d.slice(0,4),10)-(CFG.periodoInicio==='01-01'?1:1));per[y]={r:cz.rendFinal,src:'cierre'};}});
  var corte=histUltimoCorte(),yAct=corte?corte.slice(0,4):null;
  if(yAct&&ult&&ult.rend!=null)per[yAct]={r:ult.rend,src:'curso'};
  var ys=Object.keys(per).sort();if(!ys.length){el.innerHTML='';return;}
  var acc=1;ys.forEach(function(y){acc*=1+per[y].r/100;});
  var lbl=function(y){if(CFG.periodoInicio==='01-01'||!CFG.periodoInicio)return y;var p=CFG.periodoInicio.split('-');return p[1]+'/'+p[0]+'/'+y.slice(2)+'→';};
  var max=Math.max.apply(null,ys.map(function(y){return Math.abs(per[y].r);}))||1;
  el.innerHTML=
    '<div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap">'+ys.map(function(y){var r=per[y].r,h=Math.max(4,Math.round(Math.sqrt(Math.abs(r)/max)*56));var col=r>=0?(per[y].src==='curso'?'rgba(0,230,118,.45)':'var(--accent)'):'var(--red)';
      return '<div style="text-align:center;min-width:54px;font-family:var(--mono)"><div style="font-size:.7rem;font-weight:700;color:'+(r>=0?'var(--accent)':'var(--red)')+'">'+(r>=0?'+':'')+(Math.abs(r)>=100?Math.round(r):r.toFixed(1).replace('.',','))+'%</div><div style="height:56px;display:flex;align-items:flex-end;justify-content:center"><div style="width:26px;height:'+h+'px;background:'+col+';border-radius:3px 3px 0 0"></div></div><div style="font-size:.62rem;color:var(--text2);margin-top:3px">'+lbl(y)+(per[y].src==='curso'?' <span style="color:var(--text3)">(en curso)</span>':'')+'</div></div>';}).join('')+
    '<div style="margin-left:auto;text-align:right;font-family:var(--mono)"><div style="font-size:.58rem;color:var(--text3);text-transform:uppercase;letter-spacing:.07em">Acumulado desde '+lbl(ys[0])+'</div><div style="font-size:1.15rem;font-weight:700;color:'+(acc>=1?'var(--accent)':'var(--red)')+'">'+(acc>=1?'+':'')+Math.round((acc-1)*100).toLocaleString('es-AR')+'%</div><div style="font-size:.62rem;color:var(--text2)">×'+acc.toFixed(2).replace('.',',')+' lo invertido</div></div></div>';
}
(function _histBoot(n){setTimeout(function(){if(typeof _gdcInitDone!=='undefined'&&_gdcInitDone){if(CFG.historial)histLoad().then(function(h){if(h)histRender();});}else if(n<30)_histBoot(n+1);},2000);})(0);


// ─── Toggle columna % Tipo (oculta por defecto) ───

// ─── Toggle columna Rebalanceo (oculta por defecto) ───

// ─── Toggle columna % Anual (oculta por defecto) ───

var _PROX_RE=/^https:\/\/(api\.allorigins\.win|api\.codetabs\.com|corsproxy\.io)\//;
function _proxKo(h){try{var o=JSON.parse(localStorage.getItem('prox_ko')||'{}');return o[h]&&Date.now()-o[h]<6*3600e3;}catch(e){return false;}}
function _proxMarca(h,ko){try{var o=JSON.parse(localStorage.getItem('prox_ko')||'{}');if(ko)o[h]=Date.now();else delete o[h];localStorage.setItem('prox_ko',JSON.stringify(o));}catch(e){}}
function fetchWithTimeout(url, opts, ms){
  var _pm=_PROX_RE.exec(String(url));
  if(_pm){var _h=_pm[1];if(_proxKo(_h))return Promise.reject(new Error('proxy caído: '+_h));
    return _fetchWT(url,opts,ms).then(function(r){_proxMarca(_h,!r.ok&&r.status>=500);return r;},function(e){_proxMarca(_h,true);throw e;});}
  return _fetchWT(url,opts,ms);
}
function _fetchWT(url, opts, ms){
  ms=ms||7000;
  var ctrl=new AbortController();
  var tid=setTimeout(function(){ctrl.abort();},ms);
  return fetch(url,Object.assign({},opts||{},{signal:ctrl.signal}))
    .finally(function(){clearTimeout(tid);});
}

function parseYahooChart(j){
  var meta=j&&j.chart&&j.chart.result&&j.chart.result[0]&&j.chart.result[0].meta;
  if(!meta||!meta.regularMarketPrice)return null;
  var price=meta.regularMarketPrice;
  var prev=meta.chartPreviousClose||meta.previousClose||price;
  return{price:price,prevClose:prev,changePct:prev?(price-prev)/prev*100:0};
}

// ── data912: helper genérico para parsear respuesta de la API ────────────
function parseData912Response(data){
  var map={};
  function parseItem(ticker,item){
    if(!item||typeof item!=='object')return;
    var price=item.last??item.price??item.close??item.c??item.bid??0;
    price=parseFloat(price)||0;
    var prevRaw=item.prev_close??item.prevClose??item.previous_close??item.open??item.pc??null;
    var prev;
    if(prevRaw!=null){ prev=parseFloat(prevRaw)||price; }
    else if(item.pct_change!=null&&price>0){ prev=price/(1+parseFloat(item.pct_change)/100); }
    else { prev=price; }
    if(price>0)map[ticker.toUpperCase()]={price:price,prevClose:prev,changePct:prev?(price-prev)/prev*100:0};
  }
  if(Array.isArray(data)){
    data.forEach(function(item){
      var t=item.ticker||item.symbol||item.id||item.name||'';
      if(t)parseItem(t,item);
    });
  } else if(data&&typeof data==='object'){
    Object.keys(data).forEach(function(t){parseItem(t,data[t]);});
  }
  return map;
}
async function fetchBonosAPI(){
  var r=await fetchWithTimeout('https://data912.com/live/arg_bonds',{headers:{'Accept':'application/json'}},8000);
  if(!r.ok)throw new Error('HTTP '+r.status);
  return parseData912Response(await r.json());
}
async function fetchONsAPI(){
  var r=await fetchWithTimeout('https://data912.com/live/arg_corp',{headers:{'Accept':'application/json'}},8000);
  if(!r.ok)throw new Error('HTTP '+r.status);
  return parseData912Response(await r.json());
}
async function fetchArgEqAPI(){
  var r=await fetchWithTimeout('https://data912.com/live/arg_stocks',{headers:{'Accept':'application/json'}},8000);
  if(!r.ok)throw new Error('HTTP '+r.status);
  return parseData912Response(await r.json());
}
async function fetchArgCedearsAPI(){
  var r=await fetchWithTimeout('https://data912.com/live/arg_cedears',{headers:{'Accept':'application/json'}},8000);
  if(!r.ok)throw new Error('HTTP '+r.status);
  return parseData912Response(await r.json());
}
async function fetchArgNotesAPI(){
  var r=await fetchWithTimeout('https://data912.com/live/arg_notes',{headers:{'Accept':'application/json'}},8000);
  if(!r.ok)throw new Error('HTTP '+r.status);
  return parseData912Response(await r.json());
}

async function fetchYahooAR(ticker,suffix){
  var symbol=ticker+(suffix||'.BA');
  var chartUrl='https://query2.finance.yahoo.com/v8/finance/chart/'+encodeURIComponent(symbol)+'?interval=1d&range=2d';
  var quoteUrl='https://query2.finance.yahoo.com/v7/finance/quote?symbols='+encodeURIComponent(symbol)+'&corsDomain=finance.yahoo.com&formatted=false&lang=en-US&region=AR';

  var proxies=[
    fetchWithTimeout(quoteUrl,{headers:{'Accept':'application/json','Origin':'https://finance.yahoo.com'}},6000)
      .then(function(r){return r.ok?r.json():Promise.reject('!ok');})
      .then(function(j){
        var res=j&&j.quoteResponse&&j.quoteResponse.result&&j.quoteResponse.result[0];
        if(res&&res.regularMarketPrice){
          var p=res.regularMarketPrice,pc=res.regularMarketPreviousClose||p;
          return{price:p,prevClose:pc,changePct:pc?(p-pc)/pc*100:0};
        }
        return Promise.reject('no price');
      }),
    fetchWithTimeout('https://api.allorigins.win/get?url='+encodeURIComponent(chartUrl),{},7000)
      .then(function(r){return r.ok?r.json():Promise.reject('!ok');})
      .then(function(j){var d=JSON.parse(j.contents||'{}');var q=parseYahooChart(d);return q||Promise.reject('no price');}),
    fetchWithTimeout('https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(chartUrl),{},7000)
      .then(function(r){return r.ok?r.json():Promise.reject('!ok');})
      .then(function(j){var q=parseYahooChart(j);return q||Promise.reject('no price');}),
    fetchWithTimeout('https://api.allorigins.win/raw?url='+encodeURIComponent(chartUrl),{},7000)
      .then(function(r){return r.ok?r.json():Promise.reject('!ok');})
      .then(function(j){var q=parseYahooChart(j);return q||Promise.reject('no price');})
  ];

  if(typeof Promise.any==='function'){
    return Promise.any(proxies).catch(function(){throw new Error('Sin datos para '+ticker);});
  }
  return new Promise(function(resolve,reject){
    var remaining=proxies.length;
    proxies.forEach(function(p){
      p.then(resolve).catch(function(){if(--remaining===0)reject(new Error('Sin datos para '+ticker));});
    });
  });
}
async function fetchFinnhub(ticker){
  var res=await fetchWithTimeout(FBASE+'/quote?symbol='+encodeURIComponent(ticker)+'&token='+FKEY,{},8000);
  if(!res.ok)throw new Error('HTTP '+res.status);
  var d=await res.json();
  if(!d||d.c==null||d.c===0)throw new Error('Sin datos');
  return{price:d.c,prevClose:d.pc,changePct:d.pc?(d.c-d.pc)/d.pc*100:0,high:d.h,low:d.l,open:d.o};
}

async function fetchAllQuotes(){
  fetchTopbarRates();
  var pos=getPositions().filter(function(p){return p.qty>0.000001;});
  if(!pos.length){flash(document.getElementById('ref-status'),'No hay posiciones',true);return;}
  _quoteRunId++;
  try{localStorage.removeItem((PFX+'q3'));localStorage.removeItem((PFX+'q3_ts'));}catch(e){}
  var icon=document.getElementById('ref-icon');var status=document.getElementById('ref-status');var prog=document.getElementById('pos-prog');var pfill=document.getElementById('pfill');
  icon.innerHTML='<span class="spinner"></span>';prog.style.display='';pfill.style.width='0%';

  var bymaPos=pos.filter(function(p){var s=getSector(p.ticker);return s!=='bonos'&&s!=='on'&&s!=='fci'&&s!=='argentina';});
  var argPos=pos.filter(function(p){return getSector(p.ticker)==='argentina';});
  var bonosPos=pos.filter(function(p){return getSector(p.ticker)==='bonos';});
  var onPos=pos.filter(function(p){return getSector(p.ticker)==='on';});
  var fciPos=pos.filter(function(p){return getSector(p.ticker)==='fci';});
  var finnhubFallbackSectors=new Set(['nyse','brasil','europa','china','cripto']);

  var total=pos.length,done=0,errors=0;

  var _renderPending=false;
  function updateProgress(){
    done++;
    pfill.style.width=Math.round(done/total*100)+'%';
    status.textContent=done+'/'+total+'...';
    if(!_renderPending){
      _renderPending=true;
      requestAnimationFrame(function(){_renderPending=false;renderPortfolio();});
    }
  }

  function delay(ms){return new Promise(function(r){setTimeout(r,ms);});}

  // ── FASE 1: Yahoo .BA para todas las posiciones no-bono/ON (paralelo) ───────

  var YAHOO_CONCURRENCY=5;
  function mapWithConcurrency(items, limit, worker){
    var idx=0, results=new Array(items.length);
    function next(){
      if(idx>=items.length) return Promise.resolve();
      var i=idx++;
      return Promise.resolve(worker(items[i], i)).then(function(r){results[i]=r;return next();});
    }
    var runners=[];
    for(var k=0;k<Math.min(limit, items.length);k++) runners.push(next());
    return Promise.all(runners).then(function(){return results;});
  }
  async function fetchBymaAll(){
    var mapCedears={};
    try{mapCedears=await fetchArgCedearsAPI();}catch(e){}
    await mapWithConcurrency(bymaPos, YAHOO_CONCURRENCY, async function(p){
      var s=getSector(p.ticker);
      try{
        var esBRLDirecto=BRL_TICKERS.has(p.ticker);
        var cq=esBRLDirecto?null:mapCedears[p.ticker.toUpperCase()];
        var _esData912=cq&&cq.price>0;
        var fbq=_esData912?cq:await fetchYahooAR(p.ticker,esBRLDirecto?'.SA':'.BA');
        if(s!=='argentina'&&!esBRLDirecto){
          fbq.fromByma=true;
        }
        quotes[p.ticker]=fbq;
        _stampQuote(p.ticker,_esData912?'data912':'yahoo');
      }catch(e){
      }
      updateProgress();
    });
  }

  // ── Acciones argentinas: data912 (arg_eq) → fallback Yahoo .BA por ticker ────
  async function fetchArgAll(){
    var map={};
    try{map=await fetchArgEqAPI();}catch(e){}
    var mapCedears={};
    try{mapCedears=await fetchArgCedearsAPI();}catch(e){}
    await mapWithConcurrency(argPos, YAHOO_CONCURRENCY, async function(p){
      try{
        var q=map[p.ticker.toUpperCase()]||mapCedears[p.ticker.toUpperCase()];
        if(q&&q.price>0){quotes[p.ticker]=q;_stampQuote(p.ticker,'data912');}
        else{quotes[p.ticker]=await fetchYahooAR(p.ticker);_stampQuote(p.ticker,'yahoo');}
      }catch(e){
      }
      updateProgress();
    });
  }

  // ── FASE 2: Finnhub fallback para tickers donde Yahoo .BA falló (secuencial) ─
  async function fetchFinnhubFallback(){
    var fallbackPos=bymaPos.filter(function(p){
      return finnhubFallbackSectors.has(getSector(p.ticker))&&!quotes[p.ticker]&&!BRL_TICKERS.has(p.ticker);
    });
    if(!fallbackPos.length) return;
    for(var i=0;i<fallbackPos.length;i++){
      var p=fallbackPos[i];
      try{
        quotes[p.ticker]=await fetchFinnhub(getFinnhubTicker(p.ticker));
        _stampQuote(p.ticker,'finnhub');
        renderPortfolio();
      }catch(e){ errors++; }
      if(i<fallbackPos.length-1)await delay(1100);
    }
  }

  // ── Bonos soberanos: data912 → fallback Yahoo ──────────────────────────────
  async function fetchBonosAll(){
    var map={};
    try{map=await fetchBonosAPI();}catch(e){}
    await mapWithConcurrency(bonosPos, YAHOO_CONCURRENCY, async function(p){
      try{
        var q=map[p.ticker.toUpperCase()];
        if(q&&q.price>0){quotes[p.ticker]=q;_stampQuote(p.ticker,'data912');}
        else{quotes[p.ticker]=await fetchYahooAR(p.ticker);_stampQuote(p.ticker,'yahoo');}
      }catch(e){errors++;}
      updateProgress();
    });
  }

  // ── ONs corporativas: data912 → fallback bonos → fallback Yahoo ───────────
  async function fetchONsAll(){
    var map={};
    try{map=await fetchONsAPI();}catch(e){}
    var mapBonds={};
    try{mapBonds=await fetchBonosAPI();}catch(e){}
    var mapNotes={};
    try{mapNotes=await fetchArgNotesAPI();}catch(e){}
    await mapWithConcurrency(onPos, YAHOO_CONCURRENCY, async function(p){
      try{
        var q=map[p.ticker.toUpperCase()]||mapBonds[p.ticker.toUpperCase()]||mapNotes[p.ticker.toUpperCase()];
        if(q&&q.price>0){quotes[p.ticker]=q;_stampQuote(p.ticker,'data912');}
        else{quotes[p.ticker]=await fetchYahooAR(p.ticker);_stampQuote(p.ticker,'yahoo');}
      }catch(e){errors++;}
      updateProgress();
    });
  }

  var FCI_AD_FONDOS={'AGE3':{cat:'rentaFija',nombre:'Adcap Gestión Estratégica III - Clase A'}};
  function _fciNorm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();}
  var _fciCatCache={};

  async function fetchFCIAll(){
    await Promise.all(fciPos.map(async function(p){
      var cfg=FCI_AD_FONDOS[p.ticker];
      if(!cfg){updateProgress();return;}
      try{
        if(!_fciCatCache[cfg.cat]){
          _fciCatCache[cfg.cat]=Promise.all([
            fetchWithTimeout('https://api.argentinadatos.com/v1/finanzas/fci/'+cfg.cat+'/ultimo',{},8000).then(function(r){return r.ok?r.json():[];}),
            fetchWithTimeout('https://api.argentinadatos.com/v1/finanzas/fci/'+cfg.cat+'/penultimo',{},8000).then(function(r){return r.ok?r.json():[];}).catch(function(){return [];})
          ]);
        }
        var res=await _fciCatCache[cfg.cat];
        var target=_fciNorm(cfg.nombre);
        var find=function(list){if(!list||!list.length)return null;for(var i=0;i<list.length;i++){if(_fciNorm(list[i].fondo)===target&&list[i].vcp>0)return list[i];}return null;};
        var cur=find(res[0]);
        var prev=find(res[1]);
        if(cur){
          quotes[p.ticker]={price:parseFloat(cur.vcp),prevClose:prev?parseFloat(prev.vcp):parseFloat(cur.vcp),fromByma:true,fromFci:true};
          _stampQuote(p.ticker,'cafci');
        }
      }catch(e){}
      updateProgress();
    }));
  }

  await Promise.all([fetchBymaAll(),fetchArgAll(),fetchBonosAll(),fetchONsAll(),fetchFCIAll()]);
  await fetchFinnhubFallback();

  renderPortfolio();
  (function(){var _d=document.getElementById('page-dashboard');if(_d&&_d.classList.contains('active'))setTimeout(renderDashboard,80);})();

  icon.textContent='⟳';prog.style.display='none';
  status.className=errors>0?'emsg':'smsg';
  status.textContent=errors>0?errors+' sin datos':'Actualizado';
  setTimeout(function(){status.textContent='';},5000);
  document.getElementById('lupd').textContent=new Date().toLocaleTimeString('es-AR');
  try{localStorage.setItem((PFX+'q3'),JSON.stringify(quotes));localStorage.setItem((PFX+'q3_ts'),Date.now());}catch(e){}

  if(CFG.rsi&&typeof fetchAllRSI==='function') fetchAllRSI();
  if(CFG.rsi&&typeof fetchAllTIR==='function') fetchAllTIR();
  if(typeof nwsAfterQuotes==='function') nwsAfterQuotes();
}

// ─── RSI (14, método Wilder) ───────────────────────────────────────────────
function getRsiSymbol(ticker){
  return getSector(ticker)==='argentina' ? (ticker+'.BA') : ticker;
}

function wilderRSI(closes, period){
  period = period || 14;
  if(!closes || closes.length < period+1) return null;
  var gains=0, losses=0, i;
  for(i=1;i<=period;i++){
    var d=closes[i]-closes[i-1];
    if(d>=0) gains+=d; else losses-=d;
  }
  var avgGain=gains/period, avgLoss=losses/period;
  for(i=period+1;i<closes.length;i++){
    var d2=closes[i]-closes[i-1];
    var g=d2>0?d2:0, l=d2<0?-d2:0;
    avgGain=(avgGain*(period-1)+g)/period;
    avgLoss=(avgLoss*(period-1)+l)/period;
  }
  if(avgLoss===0) return 100;
  var rs=avgGain/avgLoss;
  return 100-100/(1+rs);
}

function rsiColor(v){
  if(v==null||isNaN(v)) return 'var(--text3)';
  if(v>75) return 'var(--red)';
  if(v>67) return 'var(--orange)';
  if(v<25) return 'var(--accent)';
  if(v<33) return 'var(--green-soft)';
  return 'var(--text2)';
}

async function _rsiData912(tk){
  var cat=_phCat(getSector(tk));if(!cat)return null;
  try{var r=await fetchWithTimeout('https://data912.com/historical/'+cat+'/'+encodeURIComponent(tk),{headers:{Accept:'application/json'}},12000);
    if(!r.ok)return null;var a=await r.json();if(!Array.isArray(a))return null;
    var c=a.filter(function(x){return x&&x.date&&parseFloat(x.c)>0;}).sort(function(x,y){return x.date<y.date?-1:1;}).slice(-70).map(function(x){return parseFloat(x.c);});
    return c.length>=15?_phSplits(c.map(function(v,i){return ['',v];})).map(function(x){return x[1];}):null;}catch(e){return null;}
}
async function fetchRSICloses(symbol){
  var chartUrl='https://query2.finance.yahoo.com/v8/finance/chart/'+encodeURIComponent(symbol)+'?interval=1d&range=3mo';
  var tries=[
    function(){
      return fetchWithTimeout('https://api.allorigins.win/get?url='+encodeURIComponent(chartUrl),{},8000)
        .then(function(r){return r.ok?r.json():Promise.reject('!ok');})
        .then(function(j){return JSON.parse(j.contents||'{}');});
    },
    function(){
      return fetchWithTimeout('https://corsproxy.io/?url='+encodeURIComponent(chartUrl),{},8000)
        .then(function(r){return r.ok?r.json():Promise.reject('!ok');});
    },
    function(){
      return fetchWithTimeout('https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(chartUrl),{},8000)
        .then(function(r){return r.ok?r.json():Promise.reject('!ok');});
    }
  ];
  for(var i=0;i<tries.length;i++){
    try{
      var j=await tries[i]();
      var res=j&&j.chart&&j.chart.result&&j.chart.result[0];
      var closes=res&&res.indicators&&res.indicators.quote&&res.indicators.quote[0]&&res.indicators.quote[0].close;
      if(closes){
        closes=closes.filter(function(c){return c!=null;});
        if(closes.length>=15) return closes;
      }
    }catch(e){}
  }
  throw new Error('Sin datos RSI para '+symbol);
}

var _fetchAllRSIRunning=false;
async function fetchAllRSI(){
  if(_fetchAllRSIRunning) return;
  _fetchAllRSIRunning=true;
  try{
    var pos=getPositions().filter(function(p){return p.qty>0.000001;});
    var seen={};
    var list=pos.filter(function(p){
      var s=getSector(p.ticker);
      if(s==='bonos'||s==='on')return false;
      if(seen[p.ticker])return false;
      seen[p.ticker]=true;
      return true;
    });
    var TTL=12*60*60*1000;
    var now=Date.now();
    var pending=list.filter(function(p){
      var c=RSI_CACHE[p.ticker];
      return !c || (now-c.ts)>TTL;
    });
    for(var i=0;i<pending.length;i++){
      var p=pending[i];
      try{
        var closes=await _rsiData912(p.ticker);
        if(!closes)closes=await fetchRSICloses(getRsiSymbol(p.ticker));
        var val=wilderRSI(closes,14);
        RSI_CACHE[p.ticker]={value:val!=null?val:null,ts:Date.now()};
      }catch(e){ RSI_CACHE[p.ticker]={value:(RSI_CACHE[p.ticker]&&RSI_CACHE[p.ticker].value)||null,ts:Date.now()}; }
      if(i%15===14) renderPortfolio();
    }
    try{localStorage.setItem((PFX+'rsi'),JSON.stringify(RSI_CACHE));}catch(e){}
    renderPortfolio();
  } finally {
    _fetchAllRSIRunning=false;
  }
}

// ─── Toggle columna RSI (oculta por defecto) ───

// ─── TIR de Bonos (fuente: EcoValores research, cobertura parcial) ────────
function parseEcoValoresTIR(html){
  var map={};
  try{
    var doc=new DOMParser().parseFromString(html,'text/html');
    var tables=doc.querySelectorAll('table');
    tables.forEach(function(table){
      var headerCells=table.querySelectorAll('thead th, tr:first-child th, tr:first-child td');
      var tirIdx=-1;
      headerCells.forEach(function(th,i){
        var t=(th.textContent||'').trim().toLowerCase();
        if(tirIdx<0 && (t==='% tir'||t==='tir')) tirIdx=i;
      });
      if(tirIdx<0) return;
      var rows=table.querySelectorAll('tr');
      rows.forEach(function(tr){
        var a=tr.querySelector('a[href*="ticker.php?t="]');
        if(!a) return;
        var m=(a.getAttribute('href')||'').match(/[?&]t=([A-Za-z0-9]+)/);
        if(!m) return;
        var ticker=m[1].toUpperCase();
        var cells=tr.querySelectorAll('td');
        if(cells.length<=tirIdx) return;
        var raw=(cells[tirIdx].textContent||'').trim().replace('%','').replace(',','.');
        var val=parseFloat(raw);
        if(!isNaN(val)) map[ticker]=val;
      });
    });
  }catch(e){}
  return map;
}

async function fetchEcoValoresTIR(){
  var url='https://bonos.ecovalores.com.ar/eco/';
  var tries=[
    function(){
      return fetchWithTimeout('https://api.allorigins.win/get?url='+encodeURIComponent(url),{},9000)
        .then(function(r){return r.ok?r.json():Promise.reject('!ok');})
        .then(function(j){return j.contents||'';});
    },
    function(){
      return fetchWithTimeout('https://corsproxy.io/?url='+encodeURIComponent(url),{},9000)
        .then(function(r){return r.ok?r.text():Promise.reject('!ok');});
    },
    function(){
      return fetchWithTimeout('https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(url),{},9000)
        .then(function(r){return r.ok?r.text():Promise.reject('!ok');});
    }
  ];
  for(var i=0;i<tries.length;i++){
    try{
      var html=await tries[i]();
      var map=parseEcoValoresTIR(html);
      if(Object.keys(map).length) return map;
    }catch(e){}
  }
  throw new Error('Sin datos de TIR (EcoValores)');
}

var _fetchAllTIRRunning=false;
async function fetchAllTIR(){
  if(_fetchAllTIRRunning) return;
  _fetchAllTIRRunning=true;
  try{
    var pos=getPositions().filter(function(p){return p.qty>0.000001 && getSector(p.ticker)==='bonos';});
    if(!pos.length) return;
    var TTL=12*60*60*1000;
    var now=Date.now();
    var stale=pos.some(function(p){var c=TIR_CACHE[p.ticker];return !c||(now-c.ts)>TTL;});
    if(!stale) return;
    var map={};
    try{ map=await fetchEcoValoresTIR(); }catch(e){ return; }
    pos.forEach(function(p){
      if(map.hasOwnProperty(p.ticker)){
        TIR_CACHE[p.ticker]={value:map[p.ticker],ts:now};
      } else if(!TIR_CACHE[p.ticker]){
        TIR_CACHE[p.ticker]={value:null,ts:now};
      }
    });
    try{localStorage.setItem((PFX+'tir'),JSON.stringify(TIR_CACHE));}catch(e){}
    renderPortfolio();
  } finally {
    _fetchAllTIRRunning=false;
  }
}

function exportCSV(){
  if(!movimientos.length)return;
  var h=['Fecha','Tipo','Mercado','Ticker','Cantidad','PrecioARS','CCL','PrecioUSD','Comision','Notas'];
  var rows=movimientos.map(function(m){return[m.fecha,m.tipo,m.mercado,m.ticker,m.qty,m.precioARS,m.ccl,m.precioUSD,m.comision,m.notas].map(function(v){return'"'+(v!=null?v:'')+'"';}).join(',');});
  var csv=[h.join(',')].concat(rows).join('\n');
  var a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='portafolio_nyse_'+_hoyLocalISO()+'.csv';a.click();
}

function clearAll(){
  if(!confirm('Borrar todo? Se perderan los movimientos cargados.'))return;
  movimientos=[];quotes={};
  try{localStorage.removeItem((PFX+'mov2'));localStorage.removeItem((PFX+'q3'));}catch(e){}
  sbSaveArray('movimientos', []);
  saveAndRender();
}

function renderRatios(){
  var body=document.getElementById('ratios-body');
  var filterTicker=(document.getElementById('ratios-filter-ticker')||{}).value||'';
  var filterRatio=(document.getElementById('ratios-filter-ratio')||{}).value||'';
  var filterPais=(document.getElementById('ratios-filter-pais')||{}).value||'';
  var filterRubro=(document.getElementById('ratios-filter-rubro')||{}).value||'';
  var allTickers=Object.keys(RATIOS_TABLE).sort();
  var tickers=allTickers.filter(function(t){
    var meta=RATIOS_META[t]||{};
    var matchTicker=!filterTicker||t.toUpperCase().includes(filterTicker.toUpperCase())||(meta.nombre||'').toUpperCase().includes(filterTicker.toUpperCase());
    var matchRatio=!filterRatio||String(RATIOS_TABLE[t])===filterRatio.trim();
    var matchPais=!filterPais||(meta.pais||'').toLowerCase().includes(filterPais.toLowerCase());
    var matchRubro=!filterRubro||(meta.rubro||'').toLowerCase().includes(filterRubro.toLowerCase());
    return matchTicker&&matchRatio&&matchPais&&matchRubro;
  });
  var countEl=document.getElementById('ratios-filter-count');
  if(countEl){
    if(tickers.length<allTickers.length){countEl.textContent=tickers.length+' de '+allTickers.length+' ratios';}
    else{countEl.textContent=allTickers.length+' ratios';}
  }
  function eh(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  body.innerHTML=tickers.map(function(t){
    var meta=RATIOS_META[t]||{};
    var tk=eh(t);
    return '<tr>'+
      '<td style="font-weight:600;white-space:nowrap">'+tk+'</td>'+
      '<td style="font-size:.7rem;color:var(--text2);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="'+eh(meta.nombre||'')+'">'+eh(meta.nombre||'')+'</td>'+
      '<td><input type="number" min="0.01" step="any" value="'+RATIOS_TABLE[t]+'" id="ri-'+tk+'" style="width:65px;background:var(--bg);border:1px solid var(--border2);border-radius:4px;color:var(--text);font-family:var(--mono);font-size:.75rem;padding:3px 6px;height:26px"></td>'+
      '<td style="font-size:.65rem;color:var(--text3);white-space:nowrap">'+eh(meta.mercado||'')+'</td>'+
      '<td style="font-size:.65rem;color:var(--text3);white-space:nowrap">'+eh(meta.pais||'')+'</td>'+
      '<td style="font-size:.65rem;color:var(--text3);white-space:nowrap">'+eh(meta.rubro||'')+'</td>'+
      '<td class="gap-row" style="gap:4px;white-space:nowrap">'+
        '<button class="btn btn-a btn-sm" data-tk="'+tk+'" onclick="updateRatioInline(this.dataset.tk)">&#10003;</button>'+
        '<button class="btn btn-d btn-sm" data-tk="'+tk+'" onclick="deleteRatio(this.dataset.tk)">x</button>'+
      '</td>'+
    '</tr>';
  }).join('');
  if(tickers.length===0){body.innerHTML='<tr><td colspan="7" class="empty-state">Sin resultados para los filtros aplicados</td></tr>';}
}

function updateRatioInline(ticker){
  var input=document.getElementById('ri-'+ticker);var ratio=parseFloat(input.value);var sel=document.getElementById('ratios-status');
  if(!ratio||ratio<=0){flash(sel,'Ratio inválido para '+ticker,true);return;}
  RATIOS_TABLE[ticker]=ratio;try{localStorage.setItem((PFX+'ratios'),JSON.stringify(RATIOS_TABLE));}catch(e){}
  sbSetConfig('ratios', RATIOS_TABLE);
  renderRatios();recalcMovimientos(ticker);flash(sel,ticker+' actualizado a '+ratio,false);
}

function recalcMovimientos(ticker){
  movimientos.forEach(function(m){
    if(!m)return;
    if(ticker && m.ticker!==ticker)return;
    if(m.tipo==='aporte'||!m.ccl)return;
    var r=getRatio(m.ticker);m.ratio=r;m.precioUSD=Math.round(m.precioARS*r/m.ccl*1000000)/1000000;
  });
  saveAndRender();
}

function saveRatio(){
  var ticker=document.getElementById('r-ticker').value.trim().toUpperCase();var ratio=parseFloat(document.getElementById('r-ratio').value);var sel=document.getElementById('ratios-status');
  if(!ticker){flash(sel,'Ingresa un ticker',true);return;}
  if(!ratio||ratio<=0){flash(sel,'Ratio inválido',true);return;}
  RATIOS_TABLE[ticker]=ratio;try{localStorage.setItem((PFX+'ratios'),JSON.stringify(RATIOS_TABLE));}catch(e){}
  sbSetConfig('ratios', RATIOS_TABLE);
  document.getElementById('r-ticker').value='';document.getElementById('r-ratio').value='';
  renderRatios();recalcMovimientos(ticker);flash(sel,'Ratio actualizado',false);
}

function deleteRatio(ticker){
  delete RATIOS_TABLE[ticker];try{localStorage.setItem((PFX+'ratios'),JSON.stringify(RATIOS_TABLE));}catch(e){}
  sbSetConfig('ratios', RATIOS_TABLE);
  renderRatios();recalcMovimientos(ticker);
}

function importRatiosXLSX(input){
  var file=input.files[0];if(!file)return;
  var sel=document.getElementById('ratios-status');
  flash(sel,'Leyendo archivo...',false);
  var reader=new FileReader();
  reader.onload=function(e){
    try{
      var wb=XLSX.read(e.target.result,{type:'array'});
      var ws=wb.Sheets[wb.SheetNames[0]];
      var rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
      var added=0,updated=0;
      rows.forEach(function(row,i){
        if(i<8)return;
        var nombre=String(row[1]||'').trim();
        var ticker=String(row[2]||'').trim();
        var ratio_raw=String(row[7]||'').trim().replace(/ /g,'');
        var mercado=String(row[9]||'').trim();
        var pais=String(row[12]||'').trim();
        var rubro=String(row[13]||'').trim();
        if(!ticker||!ratio_raw)return;
        var ratio_val=ratio_raw.includes(':')?parseFloat(ratio_raw.split(':')[0]):parseFloat(ratio_raw);
        if(isNaN(ratio_val)||ratio_val<=0)return;
        if(!RATIOS_TABLE[ticker]) added++; else updated++;
        RATIOS_TABLE[ticker]=ratio_val;
        RATIOS_META[ticker]={nombre:nombre,mercado:mercado,pais:pais,rubro:rubro};
      });
      try{localStorage.setItem(typeof WL_KEY!=='undefined'?(PFX+'ratios'):(PFX+'ratios'),JSON.stringify(RATIOS_TABLE));}catch(e){}
      sbSetConfig('ratios',RATIOS_TABLE);
      sbSetConfig('ratios_meta',RATIOS_META);
      renderRatios();
      flash(sel,added+' nuevos, '+updated+' actualizados',false);
    }catch(err){flash(sel,'Error: '+err.message,true);}
    input.value='';
  };
  reader.readAsArrayBuffer(file);
}
var dividendos = [];
document.addEventListener('DOMContentLoaded',function(){
  var df=document.getElementById('d-fecha');
  if(df){
    df.value=_hoyLocalISO();df.dataset.auto=df.value;
    df.addEventListener('change',function(){var f=this.value.split('-').reverse().join('/');var c=getCCL(f);if(c){document.getElementById('d-ccl').value=c;calcDivUSD();}});
  }
  var _da=document.getElementById('d-ars'),_dc=document.getElementById('d-ccl');
  if(_da)_da.addEventListener('input',calcDivUSD);
  if(_dc)_dc.addEventListener('input',calcDivUSD);
  divPopulateSelect();
});

function calcDivUSD(){
  var ars=parseFloat(document.getElementById('d-ars').value);var ccl=parseFloat(document.getElementById('d-ccl').value);
  document.getElementById('d-usd').value=(ars&&ccl)?(ars/ccl).toFixed(2):'—';
}

function addDividendo(){
  var ticker=document.getElementById('d-ticker').value.trim().toUpperCase();
  var fechaInput=document.getElementById('d-fecha').value;var fecha=fechaInput.split('-').reverse().join('/');
  var ars=parseFloat(document.getElementById('d-ars').value);
  var ccl=parseFloat(document.getElementById('d-ccl').value)||getCCL(fecha);
  var notas=document.getElementById('d-notas').value;var sel=document.getElementById('d-status');
  if(!ticker){flash(sel,'Ingresa un ticker',true);return;}
  if(!ars||ars<=0){flash(sel,'Ingresa el monto',true);return;}
  var usd=ccl?ars/ccl:null;
  dividendos.push({id:Date.now(),fecha:fecha,ticker:ticker,ars:ars,ccl:ccl||null,usd:usd,notas:notas});
  try{localStorage.setItem((PFX+'divs'),JSON.stringify(dividendos));}catch(e){}
  sbSetConfig('dividendos', dividendos);
  renderDividendos();renderPortfolio();
  document.getElementById('d-ars').value='';document.getElementById('d-ccl').value='';document.getElementById('d-usd').value='';document.getElementById('d-notas').value='';
  flash(sel,'Dividendo registrado',false);
}

function deleteDividendo(id){
  var _st=document.getElementById('d-status');
  if(_st) flash(_st,'Eliminando...', false);
  dividendos=dividendos.filter(function(d){return String(d.id)!==String(id);});
  try{
    var pd=JSON.parse(localStorage.getItem((PFX+'divs_del'))||'[]');
    if(pd.indexOf(String(id))<0) pd.push(String(id));
    localStorage.setItem((PFX+'divs_del'),JSON.stringify(pd));
  }catch(e){}
  try{localStorage.setItem((PFX+'divs'),JSON.stringify(dividendos));}catch(e){}
  renderDividendos();renderPortfolio();
  sbSetConfig('dividendos',dividendos).then(function(ok){
    if(ok){
      try{localStorage.removeItem((PFX+'divs_del'));}catch(e){}
      if(_st) flash(_st,'Eliminado y guardado ✓',false);
    } else {
      if(_st) flash(_st,'Eliminado localmente (sin servidor)',true);
    }
  });
}

function clearDividendos(){
  if(!confirm('Borrar todos los dividendos?'))return;
  dividendos=[];try{localStorage.removeItem((PFX+'divs'));}catch(e){}
  sbSetConfig('dividendos', []);
  renderDividendos();renderPortfolio();
}

function renderDividendos(){
  var empty=document.getElementById('d-empty');var wrap=document.getElementById('d-wrap');var body=document.getElementById('d-body');var totalEl=document.getElementById('d-total');
  if(!empty||!wrap||!body)return;
  if(!dividendos.length){empty.style.display='';wrap.style.display='none';totalEl.textContent='';return;}
  empty.style.display='none';wrap.style.display='';
  var totalUSD=dividendos.reduce(function(a,d){return a+(d.usd||0);},0);
  totalEl.textContent='Total: $'+Math.round(totalUSD).toLocaleString('es-AR')+' USD';
  body.innerHTML=dividendos.slice().sort(function(a,b){return b.fecha.split('/').reverse().join('').localeCompare(a.fecha.split('/').reverse().join(''));}).map(function(d){
    return '<tr><td class="mono">'+d.fecha+'</td><td style="font-weight:700">'+d.ticker+'</td><td class="mono">$'+(d.ars||0).toLocaleString('es-AR')+'</td><td class="mono muted">'+(d.ccl||'—')+'</td><td class="mono pos">$'+Math.round(d.usd||0).toLocaleString('es-AR')+'</td><td class="muted">'+(d.notas||'')+'</td><td><button class="btn btn-d btn-sm" onclick="deleteDividendo('+d.id+')">x</button></td></tr>';
  }).join('');
}

var SECTOR_LABELS={nyse:'🇺🇸 NYSE',europa:'🇪🇺 Europa',china:'🇨🇳 China',cripto:'₿ Cripto',brasil:'🇧🇷 Brasil',fci:'📈 FCI'};
function renderTargets(){
  var body=document.getElementById('targets-body');
  var pos_map={};getPositions().forEach(function(p){if(p.qty>0)pos_map[p.ticker]=p;});
  var filterVal=((document.getElementById('targets-filter')||{}).value||'').toUpperCase().trim();
  var allTickers=Object.keys(pos_map).sort();
  Object.keys(TARGET_TABLE).forEach(function(t){ if(TARGET_TABLE[t]!=null && allTickers.indexOf(t)<0) allTickers.push(t); });
  allTickers.sort();
  var tickers=filterVal?allTickers.filter(function(t){return t.includes(filterVal);}):allTickers;
  var countEl=document.getElementById('targets-filter-count');
  if(countEl){countEl.textContent=tickers.length<allTickers.length?(tickers.length+' de '+allTickers.length+' tickers'):(allTickers.length+' tickers');}
  body.innerHTML=tickers.map(function(t){
    var targetUSD=TARGET_TABLE[t];var ratio=getRatio(t);var sector=getSector(t);var _isBonoON=(sector==='bonos'||sector==='on');var _tcHoyT=(_isBonoON||sector==='fci')?(MEP_HOY||CCL_HOY):CCL_HOY;var targetARS=targetUSD!=null?(targetUSD/ratio)*_tcHoyT:null;var pos=pos_map[t];var q=quotes[t];
    var _tIsARS=(sector==='argentina'||sector==='bonos'||sector==='on'||sector==='fci');
    var _tFromByma=q&&q.fromByma;
    var mercadoARS=q?(_tIsARS||_tFromByma?q.price:(q.price/ratio)*_tcHoyT):null;
    var targetPct=null;
    if(targetUSD!=null&&q&&q.price>0){
      if(_isBonoON){targetPct=targetARS!=null&&mercadoARS>0?((targetARS-mercadoARS)/mercadoARS*100):null;}
      else{var _tPriceUSD=_tIsARS||_tFromByma?q.price*ratio/(_tcHoyT||1):q.price;targetPct=_tPriceUSD>0?((targetUSD-_tPriceUSD)/_tPriceUSD*100):null;}
    }
    var pctHtml=targetPct!=null?'<span class="'+(targetPct>=0?'pos':'neg')+'">'+(targetPct>=0?'+':'')+targetPct.toFixed(1)+'%</span>':'—';
    var _useMEP=(sector==='bonos'||sector==='on'||sector==='fci');var _tcLabel=_useMEP?'MEP':'CCL';var _arsColor=_useMEP?'var(--blue)':'var(--text2)';
    var arsInput='<input type="number" min="0" step="any" value="'+(targetARS!=null?Math.round(targetARS):'')+'" placeholder="ARS ('+_tcLabel+')" id="ta-'+t+'" title="Conversión vía '+_tcLabel+'" style="width:110px;background:var(--bg);border:1px solid var(--border2);border-radius:4px;color:'+_arsColor+';font-family:var(--mono);font-size:.75rem;padding:3px 8px;height:26px" oninput="tgtSyncRowARS(\''+t+'\')" onkeydown="if(event.key===\'Enter\')saveTarget(\''+t+'\')">';
    return '<tr><td style="font-weight:700">'+t+'</td><td><span class="mkt" style="font-size:.6rem">'+SECTOR_LABELS[sector]+'</span></td><td><input type="number" min="0" step="any" value="'+(targetUSD!=null?targetUSD:'')+'" placeholder="USD" id="ti-'+t+'" style="width:90px;background:var(--bg);border:1px solid var(--border2);border-radius:4px;color:var(--text);font-family:var(--mono);font-size:.75rem;padding:3px 8px;height:26px" oninput="tgtSyncRowUSD(\''+t+'\')" onkeydown="if(event.key===\'Enter\')saveTarget(\''+t+'\')"></td><td class="mono">'+arsInput+'</td><td>'+pctHtml+'</td><td class="gap-row" style="gap:4px"><button class="btn btn-a btn-sm" onclick="saveTarget(\''+t+'\')">✓</button><button class="btn btn-d btn-sm" onclick="deleteTarget(\''+t+'\')" title="Eliminar">✕</button></td></tr>';
  }).join('');
  if(tickers.length===0){body.innerHTML='<tr><td colspan="6" class="empty-state">Sin resultados</td></tr>';}
}

function tgtGetCCL(ticker){
  var sector=getSector(ticker);
  var useMEP=(sector==='bonos'||sector==='on'||sector==='fci');
  return useMEP?(MEP_HOY||CCL_HOY):CCL_HOY;
}

function tgtIsMEP(ticker){
  var sector=getSector(ticker);
  return (sector==='bonos'||sector==='on'||sector==='fci');
}

function tgtUpdateLabel(ticker){
  var lbl=document.getElementById('tgt-tc-label');
  if(!lbl)return;
  if(!ticker){lbl.textContent='';return;}
  var useMEP=tgtIsMEP(ticker);
  var val=useMEP?(MEP_HOY||CCL_HOY):CCL_HOY;
  lbl.textContent=(useMEP?'MEP':'CCL')+': $'+(val?val.toLocaleString('es-AR',{maximumFractionDigits:0}):'—');
  lbl.style.color=useMEP?'var(--blue)':'var(--text3)';
}

function tgtSyncOnTickerChange(){
  var ticker=(document.getElementById('tgt-ticker').value||'').trim().toUpperCase();
  tgtUpdateLabel(ticker);
  var usd=parseFloat(document.getElementById('tgt-usd').value);
  var ars=parseFloat(document.getElementById('tgt-ars').value);
  if(usd>0) tgtSyncFromUSD();
  else if(ars>0) tgtSyncFromARS();
}

function tgtSyncRowUSD(ticker){
  var usdEl=document.getElementById('ti-'+ticker);
  var arsEl=document.getElementById('ta-'+ticker);
  if(!usdEl||!arsEl)return;
  var usd=parseFloat(usdEl.value);
  if(!usd||usd<=0){arsEl.value='';return;}
  var ratio=getRatio(ticker);var tc=tgtGetCCL(ticker);
  arsEl.value=tc&&ratio?Math.round(usd/ratio*tc):'';
}

function tgtSyncRowARS(ticker){
  var usdEl=document.getElementById('ti-'+ticker);
  var arsEl=document.getElementById('ta-'+ticker);
  if(!usdEl||!arsEl)return;
  var ars=parseFloat(arsEl.value);
  if(!ars||ars<=0){usdEl.value='';return;}
  var ratio=getRatio(ticker);var tc=tgtGetCCL(ticker);
  usdEl.value=tc&&ratio?+(ars*ratio/tc).toFixed(4):'';
}

function tgtSyncFromUSD(){
  var ticker=(document.getElementById('tgt-ticker').value||'').trim().toUpperCase();
  var usd=parseFloat(document.getElementById('tgt-usd').value);
  var arsEl=document.getElementById('tgt-ars');
  tgtUpdateLabel(ticker);
  if(!ticker||!usd||usd<=0){arsEl.value='';return;}
  var ratio=getRatio(ticker);var tc=tgtGetCCL(ticker);
  arsEl.value=tc&&ratio?Math.round(usd/ratio*tc):'';
}

function tgtSyncFromARS(){
  var ticker=(document.getElementById('tgt-ticker').value||'').trim().toUpperCase();
  var ars=parseFloat(document.getElementById('tgt-ars').value);
  var usdEl=document.getElementById('tgt-usd');
  tgtUpdateLabel(ticker);
  if(!ticker||!ars||ars<=0){usdEl.value='';return;}
  var ratio=getRatio(ticker);var tc=tgtGetCCL(ticker);
  usdEl.value=tc&&ratio?+(ars*ratio/tc).toFixed(4):'';
}

function addTarget(){
  var ticker=(document.getElementById('tgt-ticker').value||'').trim().toUpperCase();
  var usd=parseFloat(document.getElementById('tgt-usd').value);
  var sel=document.getElementById('targets-status');
  if(!ticker){flash(sel,'Ingresá un ticker',true);return;}
  if(!usd||usd<=0){flash(sel,'Ingresá un precio válido',true);return;}
  TARGET_TABLE[ticker]=usd;
  try{localStorage.setItem((PFX+'targets'),JSON.stringify(TARGET_TABLE));}catch(e){}
  sbSetConfig('targets',TARGET_TABLE);
  document.getElementById('tgt-ticker').value='';
  document.getElementById('tgt-usd').value='';
  document.getElementById('tgt-ars').value='';
  renderTargets();renderPortfolio();flash(sel,ticker+' agregado',false);
}

function deleteTarget(ticker){
  delete TARGET_TABLE[ticker];
  try{localStorage.setItem((PFX+'targets'),JSON.stringify(TARGET_TABLE));}catch(e){}
  sbSetConfig('targets',TARGET_TABLE);
  renderTargets();renderPortfolio();
}

function saveTarget(ticker){
  var input=document.getElementById('ti-'+ticker);var val=input.value.trim().replace(',','.');var sel=document.getElementById('targets-status');
  TARGET_TABLE[ticker]=val===''?null:parseFloat(val);
  try{localStorage.setItem((PFX+'targets'),JSON.stringify(TARGET_TABLE));}catch(e){}
  sbSetConfig('targets', TARGET_TABLE);
  renderTargets();renderPortfolio();flash(sel,ticker+' actualizado',false);
}

// ════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════
var TRK = {
  DKEY: 'trk_divs_v1'+CFG.trkSuffix,
  PKEY: 'trk_pin_v1'+CFG.trkSuffix,
  SKEY: 'trk_session_v1'+CFG.trkSuffix,
  CKEY: 'trk_ccl_v1'+CFG.trkSuffix,
  divs: [],
  ccl: null,
  hidden: false,
  pinBuf: '',
  pinMode: 'login',
  pendingPin: '',
  MAX_LEN: 6,
  inited: false
};

['trk_divs_v1','trk_pin_v1','trk_session_v1','trk_ccl_v1'].forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});

function trkSave(){
  try{localStorage.setItem(TRK.DKEY,JSON.stringify(TRK.divs));}catch(e){}
  try{localStorage.setItem((PFX+'trk_pending'),JSON.stringify(TRK.divs));}catch(e){}
  if(typeof _gdcInitDone==='undefined'||!_gdcInitDone){console.warn('[trkSave] init no terminó — no se sube todavía ('+TRK.divs.length+' cobros)');return;}
  _trkMezclar().then(function(r){
    if(r==='no'){try{localStorage.setItem(TRK.DKEY,JSON.stringify(TRK.divs));localStorage.removeItem((PFX+'trk_pending'));}catch(e){}return null;}
    return sbSaveArrayRetry('trk_divs', TRK.divs);}).then(function(ok){if(ok===null)return;
    if(ok){_trkBase=_trkIds(TRK.divs);try{localStorage.removeItem((PFX+'trk_pending'));}catch(e){}saveFailClear('trk_divs');}
    else warnSaveFailed('trk_divs');
  });
}
// Antes de guardar los cobros se mira la nube: si otro equipo agregó cobros que acá no están, se suman (no se pisan),
// y nunca se sube una lista vacía si en la nube hay más de un cobro (eso sería un borrado masivo por una carga fallida).
var _trkBase=null;
function _trkIds(a){var o={};(a||[]).forEach(function(d){if(d&&d.id!=null)o[String(d.id)]=1;});return o;}
async function _trkMezclar(){
  var nube=await sbLoadArray('trk_divs');if(!Array.isArray(nube))return true;
  if(!TRK.divs.length&&nube.length>1){console.warn('[trkSave] lista vacía y la nube tiene '+nube.length+' cobros: no se guarda');try{_errAnotar&&_errAnotar('trkSave: se evitó borrar '+nube.length+' cobros de la nube','dividendos');}catch(e){}
    TRK.divs=nube;try{trkRender();renderPortfolio();}catch(e){}return 'no';}
  var loc=_trkIds(TRK.divs),base=_trkBase||{},sum=0;
  nube.forEach(function(d){if(!d||d.id==null)return;var k=String(d.id);if(!loc[k]&&!base[k]){TRK.divs.push(d);sum++;}});
  if(sum){TRK.divs.sort(function(a,b){return String(b.fecha).localeCompare(String(a.fecha));});console.warn('[trkSave] se sumaron '+sum+' cobros cargados desde otro equipo');try{trkRender();renderPortfolio();}catch(e){}}
  return true;
}
// Compras y ventas de los últimos 30 días en USD (todas las carteras de la persona), para la tarjeta del index.
function _ops30(){var lim=new Date(Date.now()-30*864e5).toISOString().slice(0,10),c=0,v=0,n=0;
  (movimientos||[]).forEach(function(m){if(!m||(m.tipo!=='compra'&&m.tipo!=='venta')||m.owner==='cristian')return;var f=_phIso(m.fecha);if(!f||f<lim)return;
    var bon=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI'),tc=bon?(getMEP(m.fecha)||getCCL(m.fecha)||m.ccl||MEP_HOY||CCL_HOY):(getCCL(m.fecha)||m.ccl||CCL_HOY);
    var u=isBonoUSDDirecto(m.ticker)?(+m.precioARS||0)*m.qty:(tc>0&&(+m.precioARS||0)>0?(+m.precioARS)*m.qty/tc:(+m.precioUSD||0)*m.qty);if(!(u>0))return;
    if(m.tipo==='compra')c+=u;else v+=u;n++;});
  return {c:Math.round(c),v:Math.round(v),n:n};}
function trkLoad(){
  if(!TRK.divs||!TRK.divs.length){
    try{var d=localStorage.getItem(TRK.DKEY);if(d)TRK.divs=JSON.parse(d);}catch(e){TRK.divs=[];}
  }
}
function trkSaveCCL(v){
  try{localStorage.setItem(TRK.CKEY,String(v));}catch(e){}
  sbSetConfig('trk_ccl', v);
}
function trkLoadCCL(){try{var v=localStorage.getItem(TRK.CKEY);return v?parseFloat(v):null;}catch(e){return null;}}

function initTracker(){
  if(TRK.inited) return;
  TRK.inited=true;
  trkLoad();
  document.getElementById('trk-eye-btn').addEventListener('click',trkToggleEye);
  document.getElementById('trk-ccl-toggle').addEventListener('click',function(){
    var r=document.getElementById('trk-manual-row');
    if(r.style.display==='flex'){r.style.display='none';this.textContent='Editar';}
    else{r.style.display='flex';this.textContent='Cancelar';}
  });
  document.getElementById('trk-ccl-save-btn').addEventListener('click',function(){
    var v=parseFloat(document.getElementById('trk-ccl-inp').value);
    if(!v||v<=0){alert('Ingresá un valor válido');return;}
    trkSetCCL(v,'manual');
    document.getElementById('trk-manual-row').style.display='none';
    document.getElementById('trk-ccl-toggle').textContent='Editar';
  });
  document.getElementById('trk-add-btn').addEventListener('click',trkAddDiv);
  trkImpInit();
  ['trk-calc-ars','trk-calc-usd','trk-calc-activo'].forEach(function(id){var _e=document.getElementById(id);if(_e)_e.addEventListener('input',trkCalcCCL);});
  (function(e){e.value=_hoyLocalISO();e.dataset.auto=e.value;})(document.getElementById('trk-fecha'));
  trkShowApp();
}

function trkSetCCL(v,src){
  TRK.ccl=v;trkSaveCCL(v);
  document.getElementById('trk-ccl-display').textContent='$'+v.toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2});
  document.getElementById('trk-ccl-src').textContent='('+src+')';
  var tbCcl=document.getElementById('tb-ccl');
  if(tbCcl&&tbCcl.textContent==='—'){
    tbCcl.textContent='$'+Math.round(v).toLocaleString('es-AR');
    var tbSrc=document.getElementById('tb-ccl-src');
    if(tbSrc)tbSrc.textContent=src;
  }
  trkRender();trkCalcCCL();
}

async function trkFetchCCL(){
  var saved=trkLoadCCL();
  try{var r=await fetch('https://dolarapi.com/v1/dolares/contadoconliqui');var d=await r.json();var v=parseFloat(d.venta);if(v>0){trkSetCCL(v,'dolarapi.com');return;}}catch(e){}
  try{var r2=await fetch('https://api.bluelytics.com.ar/v2/latest');var d2=await r2.json();var v2=parseFloat(d2.blue&&d2.blue.value_sell);if(v2>0){trkSetCCL(v2,'bluelytics');return;}}catch(e){}
  if(saved&&saved>0){trkSetCCL(saved,'guardado');return;}
  var hoy=new Date();
  var k=(hoy.getDate()<10?'0':'')+hoy.getDate()+'/'+(hoy.getMonth()<9?'0':'')+(hoy.getMonth()+1)+'/'+hoy.getFullYear();
  var fromTable=CCL_TABLE[k];
  if(fromTable){trkSetCCL(fromTable,'tabla embebida');}
  else{document.getElementById('trk-ccl-display').textContent='No disponible';document.getElementById('trk-ccl-src').textContent='— ingresá manualmente';}
}

// ════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════
var ARB_PAIRS = [
  { a:'GD29', b:'AL30', pctObj:104.5,
    rows:[
      { plazo:'CI',  precioA:92310, precioB:88600, condicion:'$1.025', voy:'GD29', nominales:'' },
      { plazo:'24',  precioA:91390, precioB:88660, condicion:'$1.040', voy:'AL30', nominales:'1.213' }
    ]
  },
  { a:'GD41', b:'AE38', pctObj:107.0,
    rows:[
      { plazo:'CI',  precioA:104540, precioB:112720, condicion:'$1.085', voy:'GD41', nominales:'' },
      { plazo:'24',  precioA:104350, precioB:112900, condicion:'$1.080', voy:'AE38', nominales:'934' }
    ]
  },
  { a:'TXAR', b:'ALUA', pctObj:130.0,
    rows:[
      { plazo:'CI',  precioA:873, precioB:668, condicion:'$1.033', voy:'AE38', nominales:'284.40' },
      { plazo:'24',  precioA:878, precioB:674, condicion:'$1.270', voy:'ALUAR', nominales:'' }
    ]
  },
  { a:'GD38', b:'AE38', pctObj:104.3,
    rows:[
      { plazo:'CI',  precioA:116620, precioB:111790, condicion:'', voy:'', nominales:'' },
      { plazo:'24',  precioA:116690, precioB:111870, condicion:'$1.044', voy:'GD38', nominales:'1.000' }
    ]
  }
];

function arbSave(){ try{localStorage.setItem((PFX+'arb_pairs'),JSON.stringify(ARB_PAIRS));}catch(e){} }
function arbLoad(){
  try{
    var s=localStorage.getItem((PFX+'arb_pairs'));
    if(s){ ARB_PAIRS=JSON.parse(s); }
  }catch(e){}
}

function arbAddPair(){
  ARB_PAIRS.push({
    a:'TICKER_A', b:'TICKER_B', pctObj:100,
    rows:[
      { plazo:'CI', precioA:0, precioB:0, condicion:'', voy:'', nominales:'' },
      { plazo:'24', precioA:0, precioB:0, condicion:'', voy:'', nominales:'' }
    ]
  });
  arbSave();
  arbRender();
}

function arbRemovePair(pi){
  if(!confirm('¿Eliminar este par?'))return;
  ARB_PAIRS.splice(pi,1);
  arbSave();
  arbRender();
}

function arbUpdate(pi, ri, field, val){
  if(ri===-1){
    if(field==='a'||field==='b') ARB_PAIRS[pi][field]=val.trim().toUpperCase();
    else if(field==='pctObj') ARB_PAIRS[pi].pctObj=parseFloat(val)||100;
  } else {
    var r=ARB_PAIRS[pi].rows[ri];
    if(field==='precioA'||field==='precioB') r[field]=parseFloat(val)||0;
    else r[field]=val;
  }
  arbSave();
  arbRenderRatios(pi);
}

function arbRatioClass(ratio, target){
  if(!target) return 'arb-ratio-green';
  var diff=ratio-target;
  if(Math.abs(diff)<0.5) return 'arb-ratio-amber';
  return diff>0?'arb-ratio-green':'arb-ratio-red';
}

function arbRenderRatios(pi){
  var pair=ARB_PAIRS[pi];
  pair.rows.forEach(function(row, ri){
    var ratio=row.precioB>0?(row.precioA/row.precioB*100):0;
    var cls=arbRatioClass(ratio, pair.pctObj);
    var el=document.getElementById('arb-ratio-'+pi+'-'+ri);
    if(el){
      el.innerHTML='<span class="'+cls+'">'+ratio.toFixed(2)+'%</span>';
    }
    var arr=document.getElementById('arb-arrow-'+pi+'-'+ri);
    if(arr){
      var above=ratio>=(pair.pctObj||100);
      arr.textContent=above?'>':'<';
      arr.className='arb-cell arb-op '+(above?'sell':'buy');
    }
  });
}

function arbRender(){
  arbLoad();
  var container=document.getElementById('arb-container');
  if(!container)return;
  var html='';
  ARB_PAIRS.forEach(function(pair, pi){
    html+='<div class="arb-wrap">';
    html+='<div class="arb-pair-header">';
    html+='<div class="arb-label" style="border-radius:var(--rsm) 0 0 0"></div>';
    html+='<div class="arb-label" style="flex-direction:column;gap:2px">';
    html+='<input class="arb-input arb-input-name" value="'+pair.a+'" onchange="arbUpdate('+pi+',-1,\'a\',this.value)" style="color:#a78bfa;width:90px" oninput="arbUpdate('+pi+',-1,\'a\',this.value)">';
    html+='</div>';
    html+='<div class="arb-label" style="flex-direction:column;gap:2px">';
    html+='<input class="arb-input arb-input-name" value="'+pair.b+'" onchange="arbUpdate('+pi+',-1,\'b\',this.value)" style="color:#448aff;width:90px" oninput="arbUpdate('+pi+',-1,\'b\',this.value)">';
    html+='</div>';
    html+='<div class="arb-label" style="flex-direction:column;gap:2px">Ratio<br><input class="arb-input" value="'+pair.pctObj+'%" style="width:72px;color:#ffd600;font-weight:700" oninput="arbUpdate('+pi+',-1,\'pctObj\',this.value.replace(\'%\',\'\'))"></div>';
    html+='<div class="arb-label"></div>';
    html+='<div class="arb-label">Condición</div>';
    html+='<div class="arb-label">Voy</div>';
    html+='<div class="arb-label" style="border-radius:0 var(--rsm) 0 0;gap:4px">Nominales<button class="btn btn-d btn-sm" onclick="arbRemovePair('+pi+')" style="padding:1px 5px;font-size:.6rem;margin-left:4px" title="Eliminar par">✕</button></div>';
    html+='</div>';

    pair.rows.forEach(function(row, ri){
      var ratio=row.precioB>0?(row.precioA/row.precioB*100):0;
      var cls=arbRatioClass(ratio, pair.pctObj);
      var above=ratio>=(pair.pctObj||100);
      var isLast=(ri===pair.rows.length-1)&&true;
      var rowBg=ri%2===0?'':'background:rgba(255,255,255,.025)';
      html+='<div class="arb-row" style="'+rowBg+'">';
      html+='<div class="arb-cell arb-plazo"><input class="arb-input" value="'+row.plazo+'" style="width:36px;font-weight:700;color:var(--text2)" oninput="arbUpdate('+pi+','+ri+',\'plazo\',this.value)"></div>';
      html+='<div class="arb-cell"><input class="arb-input" value="'+(row.precioA||'')+'" placeholder="$0" oninput="arbUpdate('+pi+','+ri+',\'precioA\',this.value)" style="color:#a78bfa"></div>';
      html+='<div class="arb-cell"><input class="arb-input" value="'+(row.precioB||'')+'" placeholder="$0" oninput="arbUpdate('+pi+','+ri+',\'precioB\',this.value)" style="color:#448aff"></div>';
      html+='<div class="arb-cell" id="arb-ratio-'+pi+'-'+ri+'"><span class="'+cls+'">'+(ratio>0?ratio.toFixed(2)+'%':'—')+'</span></div>';
      html+='<div class="arb-cell arb-op '+(above?'sell':'buy')+'" id="arb-arrow-'+pi+'-'+ri+'">'+(ratio>0?(above?'>':'<'):'')+'</div>';
      html+='<div class="arb-cell"><input class="arb-input" value="'+(row.condicion||'')+'" placeholder="$1.00" oninput="arbUpdate('+pi+','+ri+',\'condicion\',this.value)"></div>';
      html+='<div class="arb-cell"><input class="arb-input" value="'+(row.voy||'')+'" placeholder="ticker" oninput="arbUpdate('+pi+','+ri+',\'voy\',this.value)" style="text-transform:uppercase;font-weight:600"></div>';
      html+='<div class="arb-cell"><input class="arb-input" value="'+(row.nominales||'')+'" placeholder="—" oninput="arbUpdate('+pi+','+ri+',\'nominales\',this.value)"></div>';
      html+='</div>';
    });

    html+='<div style="text-align:right;margin-top:3px;margin-bottom:2px">';
    html+='<button class="btn btn-sm" onclick="arbAddRow('+pi+')" style="font-size:.6rem;padding:2px 8px">+ plazo</button>';
    html+='</div>';

    html+='</div>';
  });
  container.innerHTML=html;
}

function arbAddRow(pi){
  ARB_PAIRS[pi].rows.push({ plazo:'?', precioA:0, precioB:0, condicion:'', voy:'', nominales:'' });
  arbSave();
  arbRender();
}

async function fetchTopbarRates(){
  var _cclAntes=CCL_HOY,_mepAntes=MEP_HOY,_brlAntes=BRL_HOY;
  try{await _fetchTopbarRates();}finally{
    if((Math.abs(CCL_HOY-_cclAntes)>0.5||Math.abs(MEP_HOY-_mepAntes)>0.5||Math.abs(BRL_HOY-_brlAntes)>0.01)&&typeof _gdcInitDone!=='undefined'&&_gdcInitDone&&typeof renderPortfolio==='function'){try{renderPortfolio();}catch(e){}}
  }
}
async function _fetchTopbarRates(){
  var rcTag=document.getElementById('rc-ccl-tag');
  if(rcTag&&typeof CCL_HOY!=='undefined') rcTag.textContent='CCL: $'+Math.round(CCL_HOY).toLocaleString('es-AR');
  try{
    var rc=await fetch('https://dolarapi.com/v1/dolares/contadoconliqui');
    var dc=await rc.json();
    var vc=parseFloat(dc.venta);
    if(vc>0){
      CCL_HOY=vc;CCL_TABLE[_HOY_KEY]=vc;try{localStorage.setItem((PFX+'ccl_override'),JSON.stringify(CCL_TABLE));}catch(e){}_tcSbPersist();
      document.getElementById('tb-ccl').textContent='$'+vc.toLocaleString('es-AR',{minimumFractionDigits:0,maximumFractionDigits:0});
      document.getElementById('tb-ccl-src').textContent='venta';
      var rcTag2=document.getElementById('rc-ccl-tag');
      if(rcTag2) rcTag2.textContent='CCL: $'+Math.round(vc).toLocaleString('es-AR');
      try{
        var prevCCL=null;
        var d=new Date();d.setDate(d.getDate()-1);
        for(var i=0;i<5;i++){
          var wd=d.getDay();if(wd!==0&&wd!==6){
            var k=(d.getDate()<10?'0':'')+d.getDate()+'/'+(d.getMonth()<9?'0':'')+(d.getMonth()+1)+'/'+d.getFullYear();
            prevCCL=CCL_TABLE[k]||null;if(prevCCL)break;
          }
          d.setDate(d.getDate()-1);
        }
        if(!prevCCL){
          var rh=await fetchWithTimeout('https://api.argentinadatos.com/v1/cotizaciones/dolares/contadoconliqui',{},5000);
          if(rh.ok){var dh=await rh.json();if(dh&&dh.length>=2)prevCCL=parseFloat(dh[dh.length-2].venta);}
        }
        if(prevCCL&&prevCCL>0){
          var chgCCL=(vc-prevCCL)/prevCCL*100;
          var ec=document.getElementById('tb-ccl-chg');
          if(ec){ec.textContent=(chgCCL>=0?'+':'')+chgCCL.toFixed(2)+'%';ec.style.color=chgCCL>=0?'var(--accent)':'var(--red)';}
        }
      }catch(e2){}
    }
  }catch(e){}
  try{
    var rm=await fetch('https://dolarapi.com/v1/dolares/bolsa');
    var dm=await rm.json();
    var vm=parseFloat(dm.venta);
    if(vm>0){
      MEP_HOY=vm;MEP_TABLE[_HOY_KEY]=vm;try{localStorage.setItem((PFX+'mep_override'),JSON.stringify(MEP_TABLE));}catch(e){}_tcSbPersist();
      document.getElementById('tb-mep').textContent='$'+vm.toLocaleString('es-AR',{minimumFractionDigits:0,maximumFractionDigits:0});
      document.getElementById('tb-mep-src').textContent='venta';
    }
  }catch(e){
    try{
      var rm2=await fetch('https://api.bluelytics.com.ar/v2/latest');
      var dm2=await rm2.json();
      var vm2=parseFloat(dm2.oficial&&dm2.oficial.value_sell);
      if(vm2>0){
        document.getElementById('tb-mep').textContent='$'+vm2.toLocaleString('es-AR',{minimumFractionDigits:0,maximumFractionDigits:0});
        document.getElementById('tb-mep-src').textContent='oficial ref';
      }
    }catch(e2){}
  }
  try{
    var rb=await fetch('https://api.frankfurter.app/latest?from=USD&to=BRL');
    var db=await rb.json();
    var vb=parseFloat(db.rates&&db.rates.BRL);
    if(vb>0){ BRL_HOY=vb; }
  }catch(e){}
}

function trkShowApp(){
  var app=document.getElementById('trk-app');
  if(app) app.style.display='block';
  trkFetchCCL();
  fetchTopbarRates();
  trkRender();
}

function trkDeleteDiv(id){
  var idx=TRK.divs.findIndex(function(d){return d.id===id;});
  if(idx<0) return;
  var _d=TRK.divs[idx];papAgregar({k:'div',acc:'borrado',d:_d,desc:'Borrado cobro: '+_d.ticker+' '+(_d.moneda||'')+' '+_d.monto+' del '+_d.fecha});
  TRK.divs.splice(idx,1);
  trkSave();
  trkRender();
  
}

function trkToggleEye(){
  TRK.hidden=!TRK.hidden;
  var icon=document.getElementById('trk-eye-icon');
  var lbl=document.getElementById('trk-eye-label');
  if(TRK.hidden){
    icon.innerHTML='<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
    lbl.textContent='Mostrar valores';
  } else {
    icon.innerHTML='<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    lbl.textContent='Ocultar valores';
  }
  document.querySelectorAll('.trk-sensitive').forEach(function(el){el.classList.toggle('trk-blurred',TRK.hidden);});
}

function trkFmt2(n){return parseFloat(n).toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2});}

function trkRender(){
  var tbody=document.getElementById('trk-tbody');
  var empty=document.getElementById('trk-empty');
  var wrap=document.getElementById('trk-table-wrap');
  var confirmedDivs=TRK.divs.filter(function(d){return d.estado!=='pendiente';});
  tbody.innerHTML='';
  if(!confirmedDivs.length){empty.style.display='block';wrap.style.display='none';}
  else{
    empty.style.display='none';wrap.style.display='';
    confirmedDivs.forEach(function(d){
      var tr=document.createElement('tr');
      var mOrig=d.moneda==='USD'?'USD '+trkFmt2(d.monto):'$ '+trkFmt2(d.monto);
      var _cclHist=null;
      if(d.moneda==='ARS'&&d.fecha){var _fp=d.fecha.split('-');if(_fp.length===3){var _fk=_fp[2]+'/'+_fp[1]+'/'+_fp[0];_cclHist=MEP_TABLE[_fk]||null;if(!_cclHist){var _ddt=new Date(d.fecha+'T12:00:00');for(var _di=1;_di<=7&&!_cclHist;_di++){for(var _sg=-1;_sg<=1;_sg+=2){var _dd2=new Date(_ddt);_dd2.setDate(_dd2.getDate()+_sg*_di);var _fk2=String(_dd2.getDate()).padStart(2,'0')+'/'+String(_dd2.getMonth()+1).padStart(2,'0')+'/'+_dd2.getFullYear();if(MEP_TABLE[_fk2]){_cclHist=MEP_TABLE[_fk2];break;}}}}}}
      var _cclEf=d.moneda==='ARS'?(_cclHist||d.cclUsado):null;
      var _mUSD=d.moneda==='USD'?d.monto:(_cclEf?d.monto/_cclEf:d.montoUSD);
      var mUSD='USD '+trkFmt2(_mUSD);
      var cclF=_cclEf?'$'+Math.round(_cclEf).toLocaleString('es-AR'):'—';
      var accF=d.acciones?d.acciones.toLocaleString('es-AR'):'—';
      var fechaF=d.fecha.split('-').reverse().join('/');
      var _tp=divTipo(d),_tpC={DIV:'#38bdf8',RENTA:'#00e676',AMORT:'#94a3b8'}[_tp];
      tr.innerHTML='<td style="font-weight:700">'+d.ticker+' <span onclick="divTipoCambiar('+d.id+')" title="Tipo de cobro (click para cambiar): dividendo, renta o amortización (devolución de capital)'+(d.tipo?'':' — estimado')+'" style="cursor:pointer;font-size:.55rem;font-weight:700;border:1px solid '+_tpC+';color:'+_tpC+';border-radius:4px;padding:0 4px;vertical-align:middle;'+(d.tipo?'':'border-style:dashed')+'">'+({DIV:'DIV',RENTA:'RENTA',AMORT:'AMORT'}[_tp])+'</span></td><td class="mono">'+fechaF+'</td><td><span class="badge '+(d.moneda==='USD'?'badge-usd':'badge-ars')+'">'+d.moneda+'</span></td><td class="mono trk-sensitive" style="text-align:right">'+mOrig+'</td><td class="mono trk-sensitive pos" style="text-align:right;font-weight:600">'+mUSD+'</td><td class="mono trk-sensitive muted" style="text-align:right">'+cclF+'</td><td class="mono trk-sensitive muted" style="text-align:right">'+accF+'</td><td><button class="btn btn-d btn-sm" onclick="trkDeleteDiv('+d.id+')">x</button></td>';
      tbody.appendChild(tr);
    });
    var _tfootEl=document.getElementById('trk-tfoot');
    if(_tfootEl){
      var _sumARS=0,_sumUSD=0;
      confirmedDivs.forEach(function(d){
        var _fp2=d.fecha?d.fecha.split('-'):[];
        var _cclH2=null;
        if(d.moneda==='ARS'&&_fp2.length===3){
          var _fk2=_fp2[2]+'/'+_fp2[1]+'/'+_fp2[0];
          _cclH2=CCL_TABLE[_fk2]||null;
          if(!_cclH2){var _dt2=new Date(d.fecha+'T12:00:00');for(var _di2=1;_di2<=7&&!_cclH2;_di2++){for(var _sg2=-1;_sg2<=1;_sg2+=2){var _dd2=new Date(_dt2);_dd2.setDate(_dd2.getDate()+_sg2*_di2);var _fk2b=String(_dd2.getDate()).padStart(2,'0')+'/'+String(_dd2.getMonth()+1).padStart(2,'0')+'/'+_dd2.getFullYear();if(CCL_TABLE[_fk2b]){_cclH2=CCL_TABLE[_fk2b];break;}}}}
          _sumARS+=d.monto||0;
          var _cclEf2=_cclH2||d.cclUsado;
          _sumUSD+=_cclEf2?(d.monto/_cclEf2):d.montoUSD;
        } else if(d.moneda==='USD'){
          _sumUSD+=d.monto||0;
        }
      });
      var _tfRow=document.createElement('tr');
      _tfRow.style.cssText='border-top:2px solid var(--border2);background:var(--surface2)';
      _tfRow.innerHTML='<td colspan="3" style="font-weight:700;font-size:.75rem;padding:.6rem .85rem;color:var(--text2)">TOTAL</td>'
        +'<td class="mono trk-sensitive" style="text-align:right;font-weight:700;color:var(--accent);padding:.6rem .85rem">$ '+_sumARS.toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2})+'</td>'
        +'<td class="mono trk-sensitive" style="text-align:right;font-weight:700;color:var(--accent);padding:.6rem .85rem">USD '+trkFmt2(_sumUSD)+'</td>'
        +'<td colspan="3" style="padding:.6rem .85rem"></td>';
      _tfootEl.innerHTML='';
      _tfootEl.appendChild(_tfRow);
    }
  }
  function _trkMontoUSD(d){
    if(d.moneda==='USD') return d.monto;
    var fp=d.fecha?d.fecha.split('-'):[];
    if(fp.length!==3) return d.cclUsado?d.monto/d.cclUsado:d.montoUSD;
    var fk=fp[2]+'/'+fp[1]+'/'+fp[0];
    var cclH=CCL_TABLE[fk]||null;
    if(!cclH){var dt=new Date(d.fecha+'T12:00:00');for(var di=1;di<=7&&!cclH;di++){for(var sg=-1;sg<=1;sg+=2){var d2=new Date(dt);d2.setDate(d2.getDate()+sg*di);var fk2=String(d2.getDate()).padStart(2,'0')+'/'+String(d2.getMonth()+1).padStart(2,'0')+'/'+d2.getFullYear();if(CCL_TABLE[fk2]){cclH=CCL_TABLE[fk2];break;}}}}
    var ccl=cclH||d.cclUsado;
    return ccl?d.monto/ccl:d.montoUSD;
  }
  var totalUSD=confirmedDivs.reduce(function(s,d){return s+_trkMontoUSD(d);},0);
  var now=new Date();var mes=now.getMonth();var anio=now.getFullYear();
  var mesUSD=confirmedDivs.filter(function(d){var fd=new Date(d.fecha+'T12:00:00');return fd.getMonth()===mes&&fd.getFullYear()===anio;}).reduce(function(s,d){return s+_trkMontoUSD(d);},0);
  document.getElementById('trk-m-usd').textContent='USD '+trkFmt2(totalUSD);
  document.getElementById('trk-m-mes').textContent='USD '+trkFmt2(mesUSD);
  document.getElementById('trk-m-count').textContent=confirmedDivs.length;
  if(TRK.ccl&&totalUSD>0)document.getElementById('trk-m-ars-sub').textContent='≈ $'+Math.round(totalUSD*TRK.ccl).toLocaleString('es-AR')+' ARS';
  else document.getElementById('trk-m-ars-sub').textContent='';
  document.getElementById('trk-total-badge').textContent=confirmedDivs.length?'Total: USD '+trkFmt2(totalUSD):'';
  try{trkRenderFlujo();}catch(e){console.warn('trkRenderFlujo',e);}
  trkRenderPending();
  if(TRK.hidden)document.querySelectorAll('.trk-sensitive').forEach(function(el){el.classList.add('trk-blurred');});
}

// ══ Flujo cobrado por mes / año (v42) ══════════════════════════════════════
var TRK_FLUJO={anio:null,chart:null};
var TRK_FLUJO_TOPN=8;
var TRK_MESES=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
function trkDivUSD(d){
  if(d.moneda==='USD') return d.monto||0;
  var fp=d.fecha?d.fecha.split('-'):[];
  var cclH=null;
  if(fp.length===3){
    cclH=CCL_TABLE[fp[2]+'/'+fp[1]+'/'+fp[0]]||null;
    if(!cclH){var dt=new Date(d.fecha+'T12:00:00');for(var di=1;di<=7&&!cclH;di++){for(var sg=-1;sg<=1&&!cclH;sg+=2){var d2=new Date(dt);d2.setDate(d2.getDate()+sg*di);var k=String(d2.getDate()).padStart(2,'0')+'/'+String(d2.getMonth()+1).padStart(2,'0')+'/'+d2.getFullYear();cclH=CCL_TABLE[k]||null;}}}
  }
  var ccl=cclH||d.cclUsado;
  return ccl?(d.monto||0)/ccl:(d.montoUSD||0);
}
function trkDivEsRenta(d){
  if(d.tipo==='RENTA') return true;
  var sec=null;try{sec=getSector(d.ticker);}catch(e){}
  return sec==='bonos'||sec==='on';
}
function trkFlujoData(){
  var by={};
  (TRK.divs||[]).forEach(function(d){
    if(!d||d.estado==='pendiente'||!d.fecha) return;
    var p=d.fecha.split('-'); if(p.length!==3) return;
    var y=parseInt(p[0],10), m=parseInt(p[1],10)-1;
    if(!(y>1990)||m<0||m>11) return;
    var usd=trkDivUSD(d); if(!isFinite(usd)||!usd) return;
    if(!by[y]) by[y]={div:[0,0,0,0,0,0,0,0,0,0,0,0],renta:[0,0,0,0,0,0,0,0,0,0,0,0],tk:[{},{},{},{},{},{},{},{},{},{},{},{}],n:0};
    var _esR=trkDivEsRenta(d);
    by[y][_esR?'renta':'div'][m]+=usd;
    var _tk=by[y].tk[m], _tn=(d.ticker||'?').toUpperCase();
    if(!_tk[_tn]) _tk[_tn]={usd:0,n:0,renta:_esR};
    _tk[_tn].usd+=usd; _tk[_tn].n++;
    by[y].n++;
  });
  return by;
}
function trkFlujoSelAnio(y){TRK_FLUJO.anio=y;trkRenderFlujo();if(TRK.hidden)document.querySelectorAll('#trk-flujo-card .trk-sensitive').forEach(function(el){el.classList.add('trk-blurred');});}
function trkRenderFlujo(){
  var card=document.getElementById('trk-flujo-card'); if(!card) return;
  var by=trkFlujoData();
  var years=Object.keys(by).map(Number).sort(function(a,b){return a-b;});
  if(!years.length){card.style.display='none';return;}
  card.style.display='';
  var now=new Date(), yNow=now.getFullYear(), mNow=now.getMonth();
  if(TRK_FLUJO.anio==null||!by[TRK_FLUJO.anio]) TRK_FLUJO.anio=by[yNow]?yNow:years[years.length-1];
  var ySel=TRK_FLUJO.anio;
  function sum(a){return a.reduce(function(s,v){return s+v;},0);}
  function mesT(y,m){return by[y]?by[y].div[m]+by[y].renta[m]:0;}
  function tot(y){return by[y]?sum(by[y].div)+sum(by[y].renta):0;}
  function f2(n){return 'USD '+trkFmt2(n||0);}
  function f0(n){return Math.round(n||0).toLocaleString('es-AR');}

  // ── KPIs ──
  var ytd=tot(yNow), mesesT=mNow+1, prom=ytd/mesesT;
  var prevYtd=0; for(var j=0;j<=mNow;j++) prevYtd+=mesT(yNow-1,j);
  var ult12=0; for(var i=0;i<12;i++){var dt=new Date(yNow,mNow-i,1);ult12+=mesT(dt.getFullYear(),dt.getMonth());}
  var prev=tot(yNow-1);
  var varTxt=prevYtd>0?(((ytd/prevYtd)-1)*100):null;
  var ars12=(TRK.ccl&&ult12>0)?' · ≈ $'+Math.round(ult12*TRK.ccl).toLocaleString('es-AR'):'';
  var kpi=function(lbl,val,sub){return '<div class="trk-metric"><div class="trk-metric-label">'+lbl+'</div><div class="trk-metric-val trk-sensitive">'+val+'</div><div class="trk-metric-sub trk-sensitive">'+(sub||'')+'</div></div>';};
  document.getElementById('trk-flujo-kpis').innerHTML=
    kpi('En lo que va de '+yNow,f2(ytd),varTxt!=null?('<span style="color:'+(varTxt>=0?'var(--green)':'var(--red)')+'">'+(varTxt>=0?'+':'')+varTxt.toFixed(1)+'%</span> vs mismo período '+(yNow-1)):'')
   +kpi('Promedio mensual '+yNow,f2(prom),'sobre '+mesesT+' mes'+(mesesT>1?'es':''))
   +kpi('Flujo anual (últ. 12 meses)',f2(ult12),'≈ '+f2(ult12/12)+'/mes'+ars12)
   +kpi('Total '+(yNow-1),f2(prev),by[yNow-1]?('div '+f0(sum(by[yNow-1].div))+' · renta '+f0(sum(by[yNow-1].renta))):'sin registros');
  document.getElementById('trk-flujo-badge').textContent=years.length>1?(years[0]+'–'+years[years.length-1]):String(years[0]);

  // ── Selector de año ──
  document.getElementById('trk-flujo-years').innerHTML='<span style="font-size:.6rem;font-family:var(--mono);color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-right:2px">Gráfico</span>'
    +years.slice().reverse().map(function(y){return '<button class="trk-flujo-yr'+(y===ySel?' on':'')+'" onclick="trkFlujoSelAnio('+y+')">'+y+'</button>';}).join('');

  // ── Gráfico mensual del año elegido (apilado dividendos / renta + línea año anterior) ──
  var canvas=document.getElementById('trk-flujo-chart');
  if(canvas&&_chartLuego(trkRenderFlujo,arguments,canvas.offsetParent===null))canvas=null;
  if(canvas&&typeof Chart!=='undefined'){
    try{var ex=Chart.getChart(canvas);if(ex)ex.destroy();}catch(e){}
    var ds=[
      {type:'bar',label:'Dividendos',data:by[ySel].div.map(function(v){return +v.toFixed(2);}),backgroundColor:'#448aff',stack:'s',borderRadius:3,maxBarThickness:34},
      {type:'bar',label:'Renta bonos/ON',data:by[ySel].renta.map(function(v){return +v.toFixed(2);}),backgroundColor:'#00e676',stack:'s',borderRadius:3,maxBarThickness:34}
    ];
    if(by[ySel-1]) ds.push({type:'line',label:'Total '+(ySel-1),data:TRK_MESES.map(function(_,m){return +mesT(ySel-1,m).toFixed(2);}),borderColor:'#ffd600',backgroundColor:'#ffd600',borderDash:[4,4],borderWidth:1.5,pointRadius:2,tension:.25});
    TRK_FLUJO.chart=new Chart(canvas.getContext('2d'),{
      data:{labels:TRK_MESES,datasets:ds},
      options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
        plugins:{legend:{position:'bottom',labels:{color:'#7a9cc5',boxWidth:10,font:{size:10}}},
          tooltip:{callbacks:{label:function(c){return ' '+c.dataset.label+': USD '+trkFmt2(c.parsed.y);},
            footer:function(items){
              var t=0;items.forEach(function(it){if(it.dataset.type==='bar')t+=it.parsed.y;});
              var out=['Total '+ySel+': USD '+trkFmt2(t)];
              var m=items.length?items[0].dataIndex:-1, tk=(m>=0&&by[ySel])?by[ySel].tk[m]:null;
              if(tk){
                var arr=Object.keys(tk).map(function(k){return {t:k,usd:tk[k].usd,n:tk[k].n,r:tk[k].renta};}).sort(function(a,b){return b.usd-a.usd;});
                if(arr.length){
                  out.push('');out.push('Mayores pagos:');
                  arr.slice(0,TRK_FLUJO_TOPN).forEach(function(a){
                    out.push((a.r?'◆ ':'● ')+a.t+'  USD '+trkFmt2(a.usd)+(t>0?'  ('+Math.round(a.usd/t*100)+'%)':'')+(a.n>1?'  ×'+a.n:''));
                  });
                  if(arr.length>TRK_FLUJO_TOPN){var resto=arr.slice(TRK_FLUJO_TOPN).reduce(function(s2,a){return s2+a.usd;},0);out.push('+'+(arr.length-TRK_FLUJO_TOPN)+' más  USD '+trkFmt2(resto));}
                }
              }
              return out;
            }},
            footerFont:{weight:'normal',size:11},footerColor:'#e8f0ff',footerSpacing:3}},
        scales:{x:{stacked:true,grid:{display:false},ticks:{color:'#7a9cc5',font:{size:10}}},
          y:{stacked:true,beginAtZero:true,grid:{color:'rgba(38,64,112,.45)'},ticks:{color:'#7a9cc5',font:{size:10},callback:function(v){return 'U$S '+Math.round(v).toLocaleString('es-AR');}}}}}
    });
  }

  // ── Tabla mes × año ──
  var ys=years.slice().reverse();
  var h='<thead><tr><th>Mes</th>'+ys.map(function(y){return '<th class="'+(y===ySel?'sel':'')+'">'+y+'</th>';}).join('')+'</tr></thead><tbody>';
  TRK_MESES.forEach(function(lbl,m){
    h+='<tr class="'+(m===mNow?'cur':'')+'"><td>'+lbl+'</td>'+ys.map(function(y){
      var fut=(y===yNow&&m>mNow), v=mesT(y,m);
      return '<td class="trk-sensitive'+(y===ySel?' sel':'')+'" style="'+(fut?'color:var(--text3)':'')+'">'+(fut?'':(v>0?f0(v):'—'))+'</td>';
    }).join('')+'</tr>';
  });
  h+='<tr class="tot"><td>Total USD</td>'+ys.map(function(y){return '<td class="trk-sensitive'+(y===ySel?' sel':'')+'">'+f0(tot(y))+'</td>';}).join('')+'</tr>';
  h+='<tr class="sub"><td>Dividendos</td>'+ys.map(function(y){return '<td class="trk-sensitive'+(y===ySel?' sel':'')+'">'+f0(sum(by[y].div))+'</td>';}).join('')+'</tr>';
  h+='<tr class="sub"><td>Renta bonos/ON</td>'+ys.map(function(y){return '<td class="trk-sensitive'+(y===ySel?' sel':'')+'">'+f0(sum(by[y].renta))+'</td>';}).join('')+'</tr>';
  h+='<tr class="sub"><td>Promedio mensual</td>'+ys.map(function(y){var n=(y===yNow)?mesesT:12;return '<td class="trk-sensitive'+(y===ySel?' sel':'')+'">'+f0(tot(y)/n)+'</td>';}).join('')+'</tr>';
  h+='<tr class="sub"><td>Cobros</td>'+ys.map(function(y){return '<td class="'+(y===ySel?'sel':'')+'">'+by[y].n+'</td>';}).join('')+'</tr>';
  document.getElementById('trk-flujo-table').innerHTML=h+'</tbody>';
}

function trkAddDiv(){
  var ticker=document.getElementById('trk-ticker').value.trim().toUpperCase();
  var fecha=document.getElementById('trk-fecha').value;
  var moneda=document.getElementById('trk-moneda').value;
  var monto=parseFloat(document.getElementById('trk-monto').value);
  var acc=document.getElementById('trk-acc').value?parseInt(document.getElementById('trk-acc').value):null;
  var sel=document.getElementById('trk-add-status');
  if(!ticker){flash(sel,'Ingresá el ticker',true);return;}
  if(!fecha){flash(sel,'Seleccioná la fecha',true);return;}
  if(!monto||monto<=0){flash(sel,'Ingresá el monto',true);return;}
  var cclFecha=(moneda==='ARS')?(MEP_TABLE[fecha.split('-').reverse().join('/')]||(typeof MEP_HOY!=='undefined'&&MEP_HOY)||null):null;
  if(moneda==='ARS'&&!cclFecha){flash(sel,'Necesitás el MEP para convertir (no hay MEP cargado para esa fecha ni del día)',true);return;}
  var cclUsado=cclFecha;
  var montoUSD=moneda==='USD'?monto:monto/cclFecha;

  var pncApplied=false,pncTarget=null;
  var _match=(typeof trkFindPosicionEnCualquierCartera==='function')?trkFindPosicionEnCualquierCartera(ticker):null;
  var posActual=_match?_match.pos:getPositions().find(function(p){return p.ticker===ticker;});
  if(posActual){
    if(posActual.qty>0.000001){
      var ppcActual=posActual.costUSDpuro/posActual.qty;
      var costNuevo=posActual.costUSDpuro-montoUSD;
      var ppcNuevo=costNuevo/posActual.qty;
      var deltaPct=ppcActual!==0?((ppcNuevo/ppcActual)-1)*100:0;
      var msgPPC='Vas a cobrar un dividendo de '+ticker+' por USD '+montoUSD.toFixed(2)+'.\n\n'+
        'Esto va a bajar el PPC de '+ticker+':\n'+
        'PPC actual: USD '+ppcActual.toFixed(4)+'\n'+
        'PPC nuevo: USD '+ppcNuevo.toFixed(4)+' ('+deltaPct.toFixed(2)+'%)\n\n'+
        '¿Confirmás el ajuste del PPC?';
      if(!confirm(msgPPC)){flash(sel,'Cancelado — dividendo no guardado',true);return;}
      pncApplied=true;pncTarget='ppc';
    } else {
      var msgVenta='El activo '+ticker+' ya no está en cartera.\n\n'+
        'Este dividendo (USD '+montoUSD.toFixed(2)+') se va a sumar como ganancia realizada de la venta.\n\n'+
        '¿Confirmás?';
      if(!confirm(msgVenta)){flash(sel,'Cancelado — dividendo no guardado',true);return;}
      pncApplied=true;pncTarget='venta';
    }
  }

  TRK.divs.unshift({id:Date.now(),ticker:ticker,fecha:fecha,moneda:moneda,monto:monto,montoUSD:montoUSD,cclUsado:cclUsado,acciones:acc,pncApplied:pncApplied,pncTarget:pncTarget});
  trkSave();
  document.getElementById('trk-ticker').value='';document.getElementById('trk-monto').value='';document.getElementById('trk-acc').value='';
  flash(sel,pncApplied?(pncTarget==='ppc'?'Dividendo registrado — PPC ajustado':'Dividendo registrado — sumado a ganancia de venta'):'Dividendo registrado',false);
  trkRender();
  renderPortfolio();
}

// ══ Histórico Veta → PPC (importación ÚNICA, formato viejo "Movimientos Dividendos y
var HVETA={rows:[],excl:[]};
function _hvYMD(fechaAR){var f=(fechaAR||'').split('/');return f.length===3?f[2]+f[1].padStart(2,'0')+f[0].padStart(2,'0'):'0';}
function _hvIsoYMD(iso){return (iso||'').replace(/-/g,'');}
function _hvDays(a,b){return Math.abs((new Date(a+'T12:00:00')-new Date(b+'T12:00:00'))/86400000);}
function _hvFmt(n,d){return (n||0).toLocaleString('es-AR',{minimumFractionDigits:d,maximumFractionDigits:d});}
function _hvTC(iso,mercado){
  var esBono=(mercado==='BONOS'||mercado==='ON'||mercado==='FCI');
  var d=new Date(iso+'T12:00:00');
  for(var i=0;i<=7;i++){
    var k=(d.getDate()<10?'0':'')+d.getDate()+'/'+(d.getMonth()<9?'0':'')+(d.getMonth()+1)+'/'+d.getFullYear();
    var v=esBono?(MEP_TABLE[k]||CCL_TABLE[k]):CCL_TABLE[k];
    if(v) return {tc:v,fecha:k,tipo:(esBono&&MEP_TABLE[k])?'MEP':'CCL'};
    d.setDate(d.getDate()-1);
  }
  return null;
}
function hvParse(html){
  if(html.charCodeAt(0)===0xFEFF) html=html.slice(1);
  var doc=new DOMParser().parseFromString(html,'text/html');
  var rows=[],excl=[];
  Array.prototype.forEach.call(doc.querySelectorAll('tr'),function(tr){
    var c=Array.prototype.map.call(tr.querySelectorAll('td'),function(td){return (td.textContent||'').replace(/ /g,' ').trim();});
    if(c.length<12) return;
    var fecha=trkImpParseDate(c[1]); if(!fecha) return;
    var cpbt=(c[2]||'').toUpperCase(), esp=(c[4]||'').toUpperCase(), mon=(c[5]||'').toUpperCase();
    if(!esp) return;
    var r={fecha:fecha,ticker:esp,tipo:cpbt,qtyBroker:trkImpParseNum(c[6]),divi:trkImpParseNum(c[7]),amort:trkImpParseNum(c[9]),gastos:trkImpParseNum(c[11])};
    if(cpbt!=='DIV'&&cpbt!=='RTA'){r.motivo=cpbt==='CANJ'?'Canje de especie (no es un cobro)':(cpbt==='RESC'?'Rescate / vencimiento':'Comprobante '+cpbt);excl.push(r);return;}
    if(mon!==''&&mon!=='PESOS'){r.motivo='Pago en especie ('+mon+'), no en efectivo';excl.push(r);return;}
    r.moneda=(mon==='PESOS')?'ARS':'USD';
    r.monto=r.divi+r.amort-r.gastos;
    if(!(r.monto>0)){r.motivo='Monto 0';excl.push(r);return;}
    rows.push(r);
  });
  return {rows:rows,excl:excl};
}
function hvAnalyze(parsed){
  var tl={};
  movimientos.forEach(function(m){
    if(!m||m.owner==='cristian')return;
    if(m.tipo!=='compra'&&m.tipo!=='venta')return;
    (tl[m.ticker]=tl[m.ticker]||[]).push({ymd:_hvYMD(m.fecha),d:(m.tipo==='compra'?1:-1)*(m.qty||0),id:m.id||0});
  });
  Object.keys(tl).forEach(function(k){tl[k].sort(function(a,b){return a.ymd<b.ymd?-1:(a.ymd>b.ymd?1:a.id-b.id);});});
  var posMap={};getPositions().forEach(function(p){posMap[p.ticker]=p;});
  var usados={};
  var rows=[],excl=parsed.excl.slice();
  parsed.rows.forEach(function(r){
    var ev=tl[r.ticker], p=posMap[r.ticker];
    if(!ev||!p){r.motivo='No figura en tus movimientos';excl.push(r);return;}
    var ymd=_hvIsoYMD(r.fecha), q=0;
    ev.forEach(function(e){if(e.ymd<ymd)q+=e.d;});
    r.qtyFecha=q;
    var run=q,min=q;
    ev.forEach(function(e){if(e.ymd>=ymd){run+=e.d;if(run<min)min=run;}});
    r.qtyHoy=run;r.qtyMin=Math.max(min,0);
    if(run<=0.000001){r.motivo='Ya no está en cartera';excl.push(r);return;}
    if(q<=0.000001){r.motivo='En la app no lo tenías a esa fecha'+(r.qtyBroker?' (broker: '+_hvFmt(r.qtyBroker,0)+')':'');excl.push(r);return;}
    var base=r.qtyBroker>0?r.qtyBroker:q;
    r.factor=Math.min(r.qtyMin,base)/base;
    if(r.factor<=0.000001){r.motivo='Vendiste todas las que tenías a esa fecha (después recompraste)';excl.push(r);return;}
    r.warnQty=r.qtyBroker>0&&Math.abs(q-r.qtyBroker)/r.qtyBroker>0.02;
    r.mercado=p.mercado;
    if(r.moneda==='USD'){r.tc=null;r.montoUSD=r.monto;}
    else{
      var t=_hvTC(r.fecha,p.mercado);
      if(!t){r.motivo='Sin CCL/MEP cargado para esa fecha';excl.push(r);return;}
      r.tc=t.tc;r.tcTipo=t.tipo;r.montoUSD=r.monto/t.tc;
    }
    r.montoPPC=r.montoUSD*r.factor;
    var ex=TRK.divs.find(function(d){return !usados[d.id]&&d.ticker===r.ticker&&d.moneda===r.moneda&&d.fecha&&_hvDays(d.fecha,r.fecha)<=7;});
    if(ex){
      usados[ex.id]=true;
      if(ex.fuente==='veta_hist'||ex.hvFactor!=null){r.motivo='Ya importado en una corrida anterior';excl.push(r);return;}
      if(ex.pncApplied){r.motivo='Ya estaba en el tracker y aplicado al PPC ('+ex.fecha+')';excl.push(r);return;}
      r.existId=ex.id;r.existFecha=ex.fecha;
    }
    r.sel=true;
    rows.push(r);
  });
  rows.sort(function(a,b){return a.ticker<b.ticker?-1:(a.ticker>b.ticker?1:a.fecha.localeCompare(b.fecha));});
  excl.sort(function(a,b){return a.ticker<b.ticker?-1:(a.ticker>b.ticker?1:a.fecha.localeCompare(b.fecha));});
  HVETA.rows=rows;HVETA.excl=excl;
}
function hvFile(inp){
  var f=inp.files&&inp.files[0]; if(!f)return;
  var st=document.getElementById('hv-status');
  var rd=new FileReader();
  rd.onload=function(ev){
    try{
      var parsed=hvParse(ev.target.result);
      if(!parsed.rows.length&&!parsed.excl.length){st.className='emsg';st.textContent='No reconozco el formato — ¿es el .xls viejo "Movimientos Dividendos y Rentas Cobradas"?';return;}
      hvAnalyze(parsed);
      st.className='smsg';st.textContent=f.name;
      hvRender();
    }catch(e){st.className='emsg';st.textContent='Error: '+e.message;console.error(e);}
  };
  rd.readAsText(f,'utf-8');
  inp.value='';
}
function hvToggle(i,v){HVETA.rows[i].sel=v;hvRender();}
function hvToggleTk(tk,v){HVETA.rows.forEach(function(r){if(r.ticker===tk)r.sel=v;});hvRender();}
function hvToggleAll(v){HVETA.rows.forEach(function(r){r.sel=v;});hvRender();}
function hvRender(){
  var box=document.getElementById('hv-result'); if(!box)return;
  var rows=HVETA.rows, excl=HVETA.excl;
  var posMap={};getPositions().forEach(function(p){posMap[p.ticker]=p;});
  var tks={},orden=[];
  rows.forEach(function(r){if(!tks[r.ticker]){tks[r.ticker]={n:0,nSel:0,usd:0};orden.push(r.ticker);}var t=tks[r.ticker];t.n++;if(r.sel){t.nSel++;t.usd+=r.montoPPC;}});
  var totUSD=0,totN=0;
  var sumHtml=orden.map(function(tk){
    var t=tks[tk],p=posMap[tk];totUSD+=t.usd;totN+=t.nSel;
    var ppcA=p.costUSDpuro/p.qty, ppcN=(p.costUSDpuro-t.usd)/p.qty, dp=ppcA?((ppcN/ppcA)-1)*100:0;
    var neg=ppcN<0;
    return '<tr><td><input type="checkbox" '+(t.nSel===t.n?'checked':'')+' onchange="hvToggleTk(\''+tk+'\',this.checked)"></td>'+
      '<td style="font-weight:700">'+tk+'</td><td class="mono" style="text-align:right">'+t.nSel+'/'+t.n+'</td>'+
      '<td class="mono" style="text-align:right">'+_hvFmt(t.usd,2)+'</td>'+
      '<td class="mono" style="text-align:right">'+_hvFmt(ppcA,4)+'</td>'+
      '<td class="mono" style="text-align:right'+(neg?';color:var(--red)':'')+'">'+_hvFmt(ppcN,4)+(neg?' ⚠':'')+'</td>'+
      '<td class="mono" style="text-align:right;color:'+(dp<0?'var(--red)':'var(--text2)')+'">'+dp.toFixed(2)+'%</td></tr>';
  }).join('');
  var detHtml=rows.map(function(r,i){
    return '<tr'+(r.sel?'':' style="opacity:.45"')+'><td><input type="checkbox" '+(r.sel?'checked':'')+' onchange="hvToggle('+i+',this.checked)"></td>'+
      '<td style="font-weight:700">'+r.ticker+'</td><td class="mono">'+r.fecha+'</td><td>'+r.tipo+(r.amort?' <span class="muted" title="Incluye amortización: '+_hvFmt(r.amort,2)+'">+am</span>':'')+'</td><td>'+r.moneda+'</td>'+
      '<td class="mono" style="text-align:right">'+_hvFmt(r.monto,2)+'</td>'+
      '<td class="mono" style="text-align:right">'+(r.tc?_hvFmt(r.tc,0)+' '+r.tcTipo:'—')+'</td>'+
      '<td class="mono" style="text-align:right">'+_hvFmt(r.montoUSD,2)+'</td>'+
      '<td class="mono" style="text-align:right'+(r.warnQty?';color:var(--amber)':'')+'" title="Broker a la fecha / app a la fecha / mínimo desde el cobro / hoy">'+_hvFmt(r.qtyBroker,0)+' / '+_hvFmt(r.qtyFecha,0)+' / '+_hvFmt(r.qtyMin,0)+' / '+_hvFmt(r.qtyHoy,0)+(r.warnQty?' ⚠':'')+'</td>'+
      '<td class="mono" style="text-align:right">'+(r.factor*100).toFixed(0)+'%</td>'+
      '<td class="mono" style="text-align:right;font-weight:700">'+_hvFmt(r.montoPPC,2)+'</td>'+
      '<td style="font-size:.6rem">'+(r.existId!=null?'<span style="color:var(--amber)" title="Ya estaba en el tracker sin aplicar al PPC — se marca como aplicado en vez de duplicarlo">actualiza '+r.existFecha+'</span>':'nuevo')+'</td></tr>';
  }).join('');
  var exHtml=excl.map(function(r){
    return '<tr><td style="font-weight:700">'+r.ticker+'</td><td class="mono">'+r.fecha+'</td><td>'+r.tipo+'</td><td class="mono" style="text-align:right">'+_hvFmt(r.monto!=null?r.monto:r.divi,2)+'</td><td style="font-size:.65rem">'+r.motivo+'</td></tr>';
  }).join('');
  var th='style="text-align:right"';
  box.innerHTML=
    '<div class="gap-row" style="margin:10px 0">'+
      '<b class="mono">'+totN+' cobros · USD '+_hvFmt(totUSD,2)+' a restar de PPC en '+orden.filter(function(t){return tks[t].nSel;}).length+' activos</b>'+
      '<button class="btn btn-sm" onclick="hvToggleAll(true)">Todos</button><button class="btn btn-sm" onclick="hvToggleAll(false)">Ninguno</button>'+
      '<button class="btn btn-a" onclick="hvApply()" '+(totN?'':'disabled')+'>Aplicar al PPC</button>'+
    '</div>'+
    '<div class="card-title" style="margin:6px 0">Impacto por activo</div>'+
    '<div class="tw" style="max-height:320px;overflow-y:auto"><table><thead><tr><th></th><th>Ticker</th><th '+th+'>Cobros</th><th '+th+'>USD a restar</th><th '+th+'>PPC actual</th><th '+th+'>PPC nuevo</th><th '+th+'>Var.</th></tr></thead><tbody>'+sumHtml+'</tbody></table></div>'+
    '<details style="margin-top:10px"><summary class="card-title" style="cursor:pointer">Detalle por cobro ('+rows.length+')</summary>'+
    '<div class="tw" style="max-height:420px;overflow-y:auto"><table><thead><tr><th></th><th>Ticker</th><th>Fecha</th><th>Tipo</th><th>Mon.</th><th '+th+'>Monto</th><th '+th+'>TC</th><th '+th+'>USD</th><th '+th+' title="Broker a la fecha / app a la fecha / mínimo desde el cobro / hoy">Nominales B/A/mín/hoy</th><th '+th+'>% aplica</th><th '+th+'>USD a PPC</th><th></th></tr></thead><tbody>'+detHtml+'</tbody></table></div></details>'+
    '<details style="margin-top:10px"><summary class="card-title" style="cursor:pointer">Excluidos ('+excl.length+')</summary>'+
    '<div class="tw" style="max-height:320px;overflow-y:auto"><table><thead><tr><th>Ticker</th><th>Fecha</th><th>Tipo</th><th '+th+'>Monto</th><th>Motivo</th></tr></thead><tbody>'+exHtml+'</tbody></table></div></details>';
}
function hvApply(){
  var sel=HVETA.rows.filter(function(r){return r.sel;});
  if(!sel.length)return;
  var tot=sel.reduce(function(s,r){return s+r.montoPPC;},0);
  var nTk={};sel.forEach(function(r){nTk[r.ticker]=1;});
  if(!confirm('Vas a restar USD '+tot.toFixed(2)+' del PPC de '+Object.keys(nTk).length+' activos ('+sel.length+' cobros históricos de Veta).\n\nSe puede deshacer con "Revertir importación histórica".\n\n¿Confirmás?'))return;
  sel.forEach(function(r){
    if(r.existId!=null){
      var e=TRK.divs.find(function(x){return x.id===r.existId;}); if(!e)return;
      e._hvPrev={montoUSD:e.montoUSD,cclUsado:e.cclUsado,pncApplied:e.pncApplied,pncTarget:e.pncTarget,estado:e.estado||null};
      if(e.montoUSD==null)e.montoUSD=(e.moneda==='USD')?e.monto:(r.tc?e.monto/r.tc:r.montoUSD);
      if(e.cclUsado==null&&r.tc)e.cclUsado=r.tc;
      e.montoPPC=r.montoPPC;e.hvFactor=r.factor;e.pncApplied=true;e.pncTarget='ppc';
      delete e.estado;
    } else {
      TRK.divs.push({id:Date.now()+Math.random(),ticker:r.ticker,fecha:r.fecha,moneda:r.moneda,monto:r.monto,montoUSD:r.montoUSD,montoPPC:r.montoPPC,cclUsado:r.tc||null,acciones:r.qtyBroker||null,pncApplied:true,pncTarget:'ppc',tipo:r.tipo==='RTA'?'RENTA':'DIV',fuente:'veta_hist',hvFactor:r.factor});
    }
  });
  TRK.divs.sort(function(a,b){return (b.fecha||'').localeCompare(a.fecha||'');});
  trkSave();trkRender();renderPortfolio();
  HVETA.rows=[];HVETA.excl=[];
  document.getElementById('hv-result').innerHTML='';
  var st=document.getElementById('hv-status');st.className='smsg';st.textContent='Aplicado: '+sel.length+' cobros, USD '+tot.toFixed(2)+' restados del PPC.';
}
function hvRevert(){
  var nNew=TRK.divs.filter(function(d){return d.fuente==='veta_hist';}).length;
  var nUpd=TRK.divs.filter(function(d){return d._hvPrev;}).length;
  if(!nNew&&!nUpd){alert('No hay importación histórica aplicada.');return;}
  if(!confirm('Se van a borrar '+nNew+' cobros históricos importados y restaurar '+nUpd+' que ya estaban en el tracker. El PPC vuelve a como estaba.\n\n¿Confirmás?'))return;
  TRK.divs=TRK.divs.filter(function(d){return d.fuente!=='veta_hist';});
  TRK.divs.forEach(function(d){
    if(!d._hvPrev)return;
    var p=d._hvPrev;
    d.montoUSD=p.montoUSD;d.cclUsado=p.cclUsado;d.pncApplied=p.pncApplied;d.pncTarget=p.pncTarget;
    if(p.estado)d.estado=p.estado;
    delete d.montoPPC;delete d.hvFactor;delete d._hvPrev;
  });
  trkSave();trkRender();renderPortfolio();
  var st=document.getElementById('hv-status');st.className='smsg';st.textContent='Importación histórica revertida.';
}

// ── Importación XLS del broker ────────────────────────────────────────────
function trkImpInit(){
  var _f=document.getElementById('trk-imp-file');
  if(_f&&!_f._trkBound){_f._trkBound=true;_f.addEventListener('change', function(e){
    var file = e.target.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(ev){ trkImpParse(ev.target.result, file.name); };
    reader.readAsArrayBuffer(file);
    this.value = '';
  });}
  [['trk-imp-file-ars','ARS'],['trk-imp-file-usd','USD'],['trk-imp-file-cable','USD']].forEach(function(pair){
    var el = document.getElementById(pair[0]);
    if(!el||el._trkBound) return;
    el._trkBound=true;
    var moneda = pair[1];
    el.addEventListener('change', function(e){
      var file = e.target.files[0];
      if(!file) return;
      var reader = new FileReader();
      reader.onload = function(ev){ trkImpParseBM(ev.target.result, file.name, moneda); };
      reader.readAsArrayBuffer(file);
      this.value = '';
    });
  });
}

function trkImpParseNum(s){
  if(!s || s.trim()==='' || s.trim()==='0,00') return 0;
  var c = s.trim().replace(/\./g,'').replace(',','.');
  return parseFloat(c)||0;
}

function trkImpParseDate(s){
  if(!s) return null;
  var m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if(!m) return null;
  var d=m[1].padStart(2,'0'), mo=m[2].padStart(2,'0'), y=m[3];
  if(y.length===2) y='20'+y;
  return y+'-'+mo+'-'+d;
}

function trkImpBuildKey(row){
  return (row.fecha||'')+'|'+(row.ticker||'')+'|'+(row.moneda||'')+'|'+(row.monto||0);
}

function trkImpParseOldHTML(html){
  if(html.charCodeAt(0)===0xFEFF) html=html.slice(1);

  var flat = html.replace(/[\r\n\t]+/g, ' ');

  var trBlocks = flat.split(/<tr[\s>]/i);
  var tagRe = /<[^>]+>/g;
  var tdRe  = /<td[^>]*>(.*?)<\/td>/gi;

  var rows = [];

  for(var b=0; b<trBlocks.length; b++){
    var block = trBlocks[b];
    var cells = [];
    var m;
    tdRe.lastIndex = 0;
    while((m = tdRe.exec(block)) !== null){
      var raw = m[1].replace(tagRe,'').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').trim();
      cells.push(raw);
    }

    if(cells.length < 7) continue;

    var fecha = trkImpParseDate(cells[1]);
    if(!fecha) continue;

    var cpbt    = (cells[2]||'').trim().toUpperCase();
    var especie = (cells[4]||'').trim().toUpperCase();

    if(!especie) continue;
    if(cpbt === 'RESC' || cpbt === 'RES') continue;

    var c5 = (cells[5]||'').trim();
    var moneda = (c5.toUpperCase() === 'PESOS') ? 'ARS' : 'USD';
    var portafolio = trkImpParseNum(cells[6]);
    var diviRenta  = trkImpParseNum(cells[7]);

    if(diviRenta === 0) continue;

    rows.push({
      fecha:    fecha,
      ticker:   especie,
      tipo:     cpbt,
      moneda:   moneda,
      monto:    diviRenta,
      acciones: portafolio || null
    });
  }

  return rows;
}

// ── Nuevo formato Veta Capital: export real xlsx de "Movimientos > Actividad"
function trkImpParseVetaNum(v){
  if(typeof v==='number') return v;
  return trkImpParseNum(String(v==null?'':v));
}
function trkImpParseVetaDate(v){
  if(v instanceof Date){
    var y=v.getFullYear(),mo=String(v.getMonth()+1).padStart(2,'0'),d=String(v.getDate()).padStart(2,'0');
    return y+'-'+mo+'-'+d;
  }
  return trkImpParseDate(String(v==null?'':v));
}
function trkImpParseVetaMovimientos(wb){
  var shName=cmpFindSheetName(wb,/movimientos/i);
  if(!shName) return null;
  var rows=XLSX.utils.sheet_to_json(wb.Sheets[shName],{header:1,defval:''});

  var hdrIdx=rows.findIndex(function(r){
    var norm=r.map(cmpNorm);
    return norm.indexOf('concepto')>=0 && norm.indexOf('especie')>=0 && norm.indexOf('referencia')>=0;
  });
  if(hdrIdx<0) return null;

  var hdr=rows[hdrIdx].map(cmpNorm);
  var cLiq        = hdr.findIndex(function(h){return h.indexOf('liquidac')>=0;});
  var cConcepto   = hdr.indexOf('concepto');
  var cEspecie    = hdr.indexOf('especie');
  var cCantidad   = hdr.indexOf('cantidad');
  var cReferencia = hdr.indexOf('referencia');
  if(cLiq<0||cConcepto<0||cEspecie<0||cCantidad<0||cReferencia<0) return null;

  var refRe=/Especie\s*\[\s*\d+\s*\]\s*([A-Z0-9]+)\s*-\s*([^:]+):/i;
  var cuponRe=/\b(BONO|OBLIGACI[OÓ]N|LETRA|LECAP|LEDIV|LELIQ|BOTE|TITULO\s+P[UÚ]BLICO)\b/i;

  var out=[];
  for(var i=hdrIdx+1;i<rows.length;i++){
    var r=rows[i];
    if(!r||!r.length) continue;
    var concepto=cmpNorm(r[cConcepto]);
    if(concepto.indexOf('liquidaci')<0 || concepto.indexOf('cv')<0) continue;

    var referencia=String(r[cReferencia]||'');
    var m=referencia.match(refRe);
    if(!m) continue;
    var descr=m[2].trim();
    var tipo=cuponRe.test(descr)?'RENTA':'DIV';

    var fecha=trkImpParseVetaDate(r[cLiq]);
    if(!fecha) continue;

    var ticker=m[1].trim().toUpperCase();
    var especieCol=String(r[cEspecie]||'').trim().toUpperCase();
    var moneda=(especieCol==='ARS')?'ARS':'USD';
    var monto=trkImpParseVetaNum(r[cCantidad]);
    if(!monto||monto<=0) continue;

    out.push({fecha:fecha,ticker:ticker,tipo:tipo,moneda:moneda,monto:monto,acciones:null,descr:descr});
  }
  return out.length?out:null;
}

function _trkImpMontoUSD(row){
  if(row.moneda==='USD') return {montoUSD:row.monto,cclUsado:null,ok:true};
  var cclFecha=MEP_TABLE[(row.fecha||'').split('-').reverse().join('/')]||(typeof MEP_HOY!=='undefined'&&MEP_HOY)||null;
  if(!cclFecha) return {montoUSD:null,cclUsado:null,ok:false};
  return {montoUSD:row.monto/cclFecha,cclUsado:cclFecha,ok:true};
}

function _trkImpPPCPreview(row){
  var conv=_trkImpMontoUSD(row);
  if(!conv.ok) return {ok:false};
  var _match=(typeof trkFindPosicionEnCualquierCartera==='function')?trkFindPosicionEnCualquierCartera(row.ticker):null;
  var posActual=_match?_match.pos:getPositions().find(function(p){return p.ticker===row.ticker;});
  if(!posActual) return {ok:true,montoUSD:conv.montoUSD,cclUsado:conv.cclUsado,target:null};
  if(posActual.qty>0.000001){
    var ppcActual=posActual.costUSDpuro/posActual.qty;
    var costNuevo=posActual.costUSDpuro-conv.montoUSD;
    var ppcNuevo=costNuevo/posActual.qty;
    var deltaPct=ppcActual!==0?((ppcNuevo/ppcActual)-1)*100:0;
    return {ok:true,montoUSD:conv.montoUSD,cclUsado:conv.cclUsado,target:'ppc',ppcActual:ppcActual,ppcNuevo:ppcNuevo,deltaPct:deltaPct};
  }
  return {ok:true,montoUSD:conv.montoUSD,cclUsado:conv.cclUsado,target:'venta'};
}

function trkImpParse(input, fname){
  var status = document.getElementById('trk-imp-status');
  status.className='smsg';
  status.textContent = 'Procesando...';

  try{
    var rows=null;
    var isNewFormat=false;

    try{
      var wb=XLSX.read(new Uint8Array(input),{type:'array'});
      rows=trkImpParseVetaMovimientos(wb);
      if(rows) isNewFormat=true;
    }catch(exWb){ rows=null; }

    if(!rows){
      var html=new TextDecoder('utf-8').decode(input);
      rows=trkImpParseOldHTML(html);
    }

    if(!rows||!rows.length){
      status.className='emsg';
      status.textContent='No se encontraron filas de dividendos en el archivo.';
      return;
    }

    var res=trkQueuePendingRows(rows);
    document.getElementById('trk-imp-badge').textContent = fname||'';
    status.className='smsg';
    status.textContent = res.added
      ? (res.added+' fila(s) nueva(s) agregadas a "Pendientes de revisión" ↓ ('+res.dup+' ya existían)'+(isNewFormat?'':' — formato viejo detectado'))
      : ('Sin filas nuevas — las '+res.dup+' encontradas ya estaban cargadas o pendientes.');
    setTimeout(function(){status.textContent='';},8000);

  } catch(err){
    status.className='emsg';
    status.textContent = 'Error al procesar: ' + err.message;
    console.error('trkImpParse error:', err);
  }
}

function trkQueuePendingRows(rows){
  var existKeys = {};
  TRK.divs.forEach(function(d){ existKeys[trkImpBuildKey(d)] = true; });

  var added=0, dup=0;
  rows.forEach(function(r){
    var key=trkImpBuildKey(r);
    if(existKeys[key]){ dup++; return; }
    existKeys[key]=true;
    added++;
    TRK.divs.unshift({
      id: Date.now()+Math.random(),
      ticker: r.ticker,
      fecha: r.fecha,
      moneda: r.moneda,
      monto: r.monto,
      montoUSD: null,
      cclUsado: null,
      acciones: r.acciones||null,
      pncApplied: false,
      pncTarget: null,
      tipo: r.tipo||'DIV',
      descr: r.descr||null,
      estado: 'pendiente',
      fuente: 'import'
    });
  });

  if(added){
    TRK.divs.sort(function(a,b){return b.fecha.localeCompare(a.fecha);});
    trkSave();
    trkRender();
  }
  return {added:added, dup:dup, total:rows.length};
}

function trkRenderPending(){
  var card=document.getElementById('trk-pending-card');
  var tbody=document.getElementById('trk-pending-tbody');
  var badge=document.getElementById('trk-pending-badge');
  if(!card||!tbody)return;
  var pend=TRK.divs.filter(function(d){return d.estado==='pendiente';});

  if(!pend.length){ card.style.display='none'; return; }
  card.style.display='';
  badge.textContent=pend.length+' fila(s) esperando confirmación';

  tbody.innerHTML = pend.map(function(d){
    var monLabel = d.moneda==='ARS'
      ? '<span class="badge badge-aporte">ARS</span>'
      : '<span class="badge badge-usd">USD</span>';
    var tipoLabel = d.tipo==='RENTA'
      ? '<span class="badge" style="font-size:.55rem;background:var(--surface2);color:var(--amber);border:1px solid var(--amber)">RENTA</span>'
      : '<span class="badge badge-dividendo" style="font-size:.55rem">DIV</span>';

    var ppc='<span class="muted">—</span>';
    var accionHtml='';
    var pv=_trkImpPPCPreview(d);
    if(!pv.ok){
      ppc='<span style="color:var(--red)">Sin CCL para '+d.fecha+'</span>';
      accionHtml='<button class="btn btn-sm" disabled title="Cargá el CCL de esa fecha primero">Cargar</button>';
    } else if(pv.target==='ppc'){
      ppc='<span class="mono">USD '+pv.ppcActual.toFixed(4)+' → USD '+pv.ppcNuevo.toFixed(4)+' <b style="color:'+(pv.deltaPct<0?'var(--red)':'var(--accent)')+'">('+pv.deltaPct.toFixed(2)+'%)</b></span>';
      accionHtml='<button class="btn btn-a btn-sm" onclick="trkPendingConfirm('+d.id+')">Cargar</button>';
    } else if(pv.target==='venta'){
      ppc='<span class="mono">+USD '+pv.montoUSD.toFixed(2)+' a ganancia de venta</span>';
      accionHtml='<button class="btn btn-a btn-sm" onclick="trkPendingConfirm('+d.id+')">Cargar</button>';
    } else {
      ppc='<span class="muted">Sin posición — no afecta PPC</span>';
      accionHtml='<button class="btn btn-a btn-sm" onclick="trkPendingConfirm('+d.id+')">Cargar</button>';
    }
    accionHtml += ' <button class="btn btn-d btn-sm" onclick="trkPendingDiscard('+d.id+')" title="Descartar — no es un dividendo real / no lo quiero registrar">✕</button>';

    return '<tr title="'+(d.descr?String(d.descr).replace(/"/g,'&quot;'):'')+'">'+
      '<td style="font-weight:700">'+d.ticker+'</td>'+
      '<td class="mono">'+d.fecha+'</td>'+
      '<td>'+tipoLabel+'</td>'+
      '<td>'+monLabel+'</td>'+
      '<td class="mono" style="text-align:right">'+d.monto.toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2})+'</td>'+
      '<td style="font-size:.65rem">'+ppc+'</td>'+
      '<td style="text-align:center;white-space:nowrap">'+accionHtml+'</td>'+
    '</tr>';
  }).join('');
}

function trkPendingConfirm(id){
  var d = TRK.divs.find(function(x){return x.id===id && x.estado==='pendiente';});
  if(!d) return;

  var conv = _trkImpMontoUSD(d);
  if(!conv.ok){
    alert('No se puede cargar: no hay CCL cargado para la fecha '+d.fecha+' (ni CCL de referencia). Cargá el CCL de esa fecha en la calculadora de CCL y volvé a intentar.');
    return;
  }

  var pv = _trkImpPPCPreview(d);
  d.montoUSD = conv.montoUSD;
  d.cclUsado = conv.cclUsado;
  d.pncApplied = pv.target==='ppc' || pv.target==='venta';
  d.pncTarget = pv.target;
  delete d.estado;

  trkSave();
  trkRender();
  renderPortfolio();
}

function trkPendingDiscard(id){
  var idx=TRK.divs.findIndex(function(x){return x.id===id && x.estado==='pendiente';});
  if(idx<0) return;
  var _d=TRK.divs[idx];papAgregar({k:'div',acc:'borrado',d:_d,desc:'Descartado pendiente: '+_d.ticker+' '+(_d.moneda||'')+' '+_d.monto+' del '+_d.fecha});
  TRK.divs.splice(idx,1);
  trkSave();
  trkRender();
}

window.trkAutoImportFromXLSX = function(base64, fname){
  if(typeof XLSX==='undefined'){return xlsxListo().then(function(){return window.trkAutoImportFromXLSX(base64,fname);});}
  try{
    var bin = atob(base64);
    var bytes = new Uint8Array(bin.length);
    for(var i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);

    var wb = XLSX.read(bytes, {type:'array'});
    var rows = trkImpParseVetaMovimientos(wb);
    if(!rows || !rows.length){
      return {ok:false, error:'No se encontraron filas de "Liquidación de cv" en el archivo.'};
    }
    var res = trkQueuePendingRows(rows);
    document.getElementById('trk-imp-badge').textContent = fname||'';
    return {ok:true, added:res.added, dup:res.dup, total:res.total};
  }catch(err){
    return {ok:false, error:String(err&&err.message||err)};
  }
};

function trkCalcCCL(){
  if(!document.getElementById('trk-calc-ars')||!document.getElementById('trk-ccl-result'))return;
  var ars=parseFloat(document.getElementById('trk-calc-ars').value);
  var usd=parseFloat(document.getElementById('trk-calc-usd').value);
  var activo=document.getElementById('trk-calc-activo').value.trim();
  var res=document.getElementById('trk-ccl-result');
  if(!ars||!usd||ars<=0||usd<=0){res.style.display='none';return;}
  var impl=ars/usd;
  res.style.display='block';
  document.getElementById('trk-ccl-result-label').textContent=activo?'CCL implícito — '+activo.toUpperCase():'CCL implícito';
  document.getElementById('trk-ccl-result-val').textContent='$'+impl.toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2});
  if(TRK.ccl){var diff=((impl-TRK.ccl)/TRK.ccl)*100;var signo=diff>=0?'+':'';document.getElementById('trk-ccl-result-sub').textContent=signo+diff.toFixed(1)+'% '+(diff>=0?'por encima':'por debajo')+' del CCL de referencia ($'+Math.round(TRK.ccl).toLocaleString('es-AR')+')';}
  else{document.getElementById('trk-ccl-result-sub').textContent='';}
}

// ── Init ──────────────────────────────────────────────────────────────────
(function(){
  var DATA_VERSION=CFG.dataVersion;

  // ── Carga inicial desde Supabase (con fallback a localStorage) ──
  async function initFromSupabase(){
    var _authed = await authEnsureSession();
    if(!_authed){ document.getElementById('lupd').textContent='Iniciá sesión para ver tu portfolio'; return; }
    _ifsOk=true;
    document.getElementById('lupd').textContent='Cargando desde Supabase...';
    _sbCfgPrefetch();
    await loadMarks();
    var _pingP=sbPing();
    var _movP=sbLoadArray('movimientos'),_trkDivsP=sbLoadArray('trk_divs');
    _precargaLocal();
    await _pingP;

    var sbMov = await _movP;
    try{
      var _pendingRaw=localStorage.getItem((PFX+'pending_sync'));
      if(_pendingRaw){
        var _pending=JSON.parse(_pendingRaw);
        var _cloudIds={};(sbMov||[]).forEach(function(m){if(m&&m.id!=null)_cloudIds[m.id]=true;});
        var _missing=_pending.filter(function(m){return m&&m.id!=null&&!_cloudIds[m.id];});
        var _overlap=_pending.some(function(m){return m&&m.id!=null&&_cloudIds[m.id];});
        if(sbMov&&sbMov.length&&!_overlap){console.warn('[initFromSupabase] snapshot pendiente ajeno a este portafolio — descartado.');_missing=[];}
        if(_missing.length){
          console.warn('[initFromSupabase] '+_missing.length+' movimiento(s) local(es) no estaban en Supabase — reintentando guardarlos.');
          var _resynced=await sbSaveArrayRetry('movimientos',_pending);
          sbMov=_pending;
          if(_resynced){ localStorage.removeItem((PFX+'pending_sync')); }
          else { setTimeout(function(){warnSaveFailed();},500); }
        } else {
          localStorage.removeItem((PFX+'pending_sync'));
        }
      }
    }catch(e){ console.warn('[initFromSupabase] reconciliación de pendientes falló',e); }
    if(sbMov !== null && sbMov.length){
      movimientos = sbMov.filter(function(m){return m!=null;});
      try{localStorage.setItem((PFX+'mov2'),JSON.stringify(movimientos));localStorage.setItem((PFX+'version'),DATA_VERSION);}catch(e){}
    } else if(sbMov === null){
      var storedVersion=null;try{storedVersion=localStorage.getItem((PFX+'version'));}catch(e){}
      var saved=null;try{saved=localStorage.getItem((PFX+'mov2'));}catch(e){}
      if(saved&&storedVersion===DATA_VERSION){
        try{movimientos=JSON.parse(saved).filter(function(m){return m!=null;});}catch(e){}
      }
    } else {
    }

    var sbDivs = await sbGetConfig('dividendos');
    if(sbDivs && sbDivs.length){
      dividendos = sbDivs;
      try{localStorage.setItem((PFX+'divs'),JSON.stringify(dividendos));}catch(e){}
    } else {
      try{var sd=localStorage.getItem((PFX+'divs'));if(sd)dividendos=JSON.parse(sd);}catch(e){}
      if(dividendos.length) sbSetConfig('dividendos', dividendos);
    }
    try{
      var _pd=JSON.parse(localStorage.getItem((PFX+'divs_del'))||'[]');
      if(_pd.length){
        dividendos=dividendos.filter(function(d){return _pd.indexOf(String(d.id))<0;});
        try{localStorage.setItem((PFX+'divs'),JSON.stringify(dividendos));}catch(e){}
        sbSetConfig('dividendos',dividendos).then(function(ok){
          if(ok){try{localStorage.removeItem((PFX+'divs_del'));}catch(e){}}
        });
      }
    }catch(e){}

    var sbTrkDivs = await _trkDivsP;if(Array.isArray(sbTrkDivs))_trkBase=_trkIds(sbTrkDivs);
    setTimeout(divsReparar,4000);
    var _trkPend=null;try{_trkPend=JSON.parse(localStorage.getItem((PFX+'trk_pending'))||'null');}catch(e){}
    if(Array.isArray(_trkPend)&&sbTrkDivs!==null){
      TRK.divs=_trkPend;try{localStorage.setItem(TRK.DKEY,JSON.stringify(TRK.divs));}catch(e){}
      sbSaveArrayRetry('trk_divs',TRK.divs).then(function(ok){if(ok){try{localStorage.removeItem((PFX+'trk_pending'));}catch(e){}}else warnSaveFailed('trk_divs');});
    } else if(sbTrkDivs && sbTrkDivs.length){
      TRK.divs = sbTrkDivs;
      try{var _lsTrk=localStorage.getItem(TRK.DKEY);if(_lsTrk){var _lsTrkData=JSON.parse(_lsTrk);if(_lsTrkData.length>TRK.divs.length){TRK.divs=_lsTrkData;sbSaveArray('trk_divs',TRK.divs);}}}catch(e){}
      try{localStorage.setItem(TRK.DKEY,JSON.stringify(TRK.divs));}catch(e){}
    } else {
      try{var td=localStorage.getItem(TRK.DKEY);if(td)TRK.divs=JSON.parse(td);}catch(e){}
    }

    var sbRatios = await sbGetConfig('ratios');
    if(sbRatios){Object.keys(sbRatios).forEach(function(t){RATIOS_TABLE[t]=sbRatios[t];});try{localStorage.setItem((PFX+'ratios'),JSON.stringify(RATIOS_TABLE));}catch(e){}}
    else{try{var sr=localStorage.getItem((PFX+'ratios'));if(sr){var lsr=JSON.parse(sr);Object.keys(lsr).forEach(function(t){RATIOS_TABLE[t]=lsr[t];});}}catch(e){}}

    var sbRatiosMeta = await sbGetConfig('ratios_meta');
    if(sbRatiosMeta){Object.keys(sbRatiosMeta).forEach(function(t){RATIOS_META[t]=sbRatiosMeta[t];});}
    else{if(Object.keys(RATIOS_META).length>0){sbSetConfig('ratios_meta',RATIOS_META);}}

    var sbTargets = await sbGetConfig('targets');
    if(sbTargets){Object.assign(TARGET_TABLE, sbTargets);try{localStorage.setItem((PFX+'targets'),JSON.stringify(TARGET_TABLE));}catch(e){}}
    else{try{var st=localStorage.getItem((PFX+'targets'));if(st){Object.assign(TARGET_TABLE,JSON.parse(st));}}catch(e){}}

    var sbRubros = await sbGetConfig('rubros');
    if(sbRubros){Object.assign(USER_RUBRO_TABLE, sbRubros);try{localStorage.setItem((PFX+'rubros'),JSON.stringify(USER_RUBRO_TABLE));}catch(e){}}
    else{try{var sru=localStorage.getItem((PFX+'rubros'));if(sru){Object.assign(USER_RUBRO_TABLE,JSON.parse(sru));}}catch(e){}}

    var sbCclOvr = await sbGetConfig('ccl_override');
    if(sbCclOvr){Object.assign(CCL_TABLE, sbCclOvr);}
    else{try{var sc=localStorage.getItem((PFX+'ccl_override'));if(sc)Object.assign(CCL_TABLE,JSON.parse(sc));}catch(e){}}
    var sbMepOvr = await sbGetConfig('mep_override');
    if(sbMepOvr){Object.assign(MEP_TABLE, sbMepOvr);}
    else{try{var sm=localStorage.getItem((PFX+'mep_override'));if(sm)Object.assign(MEP_TABLE,JSON.parse(sm));}catch(e){}}
    _tcOvrLoaded=true;
    if(_tcOvrPend){_tcOvrPend=false;sbSetConfig('ccl_override',CCL_TABLE);sbSetConfig('mep_override',MEP_TABLE);}
    tcRefrescarHoy();

    var sbLiq = await sbGetConfig('liquidez');
    if(sbLiq){
      if(sbLiq.ars) setFmtNum('liq-ars', sbLiq.ars, 0);
      if(sbLiq.usd) setFmtNum('liq-usd', sbLiq.usd, 2);
      try{localStorage.setItem((PFX+'liq'),JSON.stringify(sbLiq));}catch(e){}
    } else { loadLiquidez(); }

    try{await vigLoad();}catch(e){}
    var sbInv = await sbGetConfig('inv_inicial');
    if(sbInv){
      setFmtNum('inv-sidebar-usd', sbInv, 0);
      var di=document.getElementById('inv-inicial-usd-display');
      if(di)di.textContent='$'+Math.round(parseFloat(sbInv)).toLocaleString('es-AR');
      try{localStorage.setItem((PFX+'inv_inicial'),String(sbInv));}catch(e){}
    } else{loadInvInicial();}
    if(document.getElementById('perf-target-usd')){
      var sbPerfTarget = await sbGetConfig('perf_target');
      var _pt=sbPerfTarget||(function(){try{return localStorage.getItem(PFX+'perf_target');}catch(e){return null;}})();
      if(_pt){document.getElementById('perf-target-usd').value=_pt;perfCalcUpdate();}
    }

    try{
      var sq=localStorage.getItem((PFX+'q3'));
      var sqTs=parseInt(localStorage.getItem((PFX+'q3_ts'))||'0');
      var sqAge=(Date.now()-sqTs)/1000/3600;
      if(sq && sqAge < 4){ quotes=JSON.parse(sq); }
      else { localStorage.removeItem((PFX+'q3')); localStorage.removeItem((PFX+'q3_ts')); }
    }catch(e){}

    try{
      var srsi=localStorage.getItem((PFX+'rsi'));
      if(srsi) RSI_CACHE=JSON.parse(srsi)||{};
    }catch(e){}

    try{
      var stir=localStorage.getItem((PFX+'tir'));
      if(stir) TIR_CACHE=JSON.parse(stir)||{};
    }catch(e){}

    var sbVhist = await sbGetConfig('vhist_movs');
    if(sbVhist && Array.isArray(sbVhist)){
      _ventahistRows=sbVhist;
      try{localStorage.setItem((PFX+'vhist_movs'),JSON.stringify(_ventahistRows));}catch(e){}
    } else {
      try{var svh=localStorage.getItem((PFX+'vhist_movs')); if(svh){_ventahistRows=JSON.parse(svh);}}catch(e){}
    }
    var sbVhistDivs = await sbGetConfig('vhist_divs');
    if(sbVhistDivs && Array.isArray(sbVhistDivs)){
      _ventahistDivs=sbVhistDivs;
      try{localStorage.setItem((PFX+'vhist_divs'),JSON.stringify(_ventahistDivs));}catch(e){}
    } else {
      try{var svhd=localStorage.getItem((PFX+'vhist_divs')); if(svhd){_ventahistDivs=JSON.parse(svhd);}}catch(e){}
    }
    var sbVhistAportes = await sbGetConfig('vhist_aportes');
    if(sbVhistAportes && Array.isArray(sbVhistAportes)){
      _ventahistAportes=sbVhistAportes;
      try{localStorage.setItem((PFX+'vhist_aportes'),JSON.stringify(_ventahistAportes));}catch(e){}
    } else {
      try{var svha=localStorage.getItem((PFX+'vhist_aportes')); if(svha){_ventahistAportes=JSON.parse(svha);}}catch(e){}
    }
    if(typeof renderVentaHistorica==='function') renderVentaHistorica();

    var MIG_KEY=(PFX+'mig_bonosMEP_v1');
    var _migDone=false;
    try{if(localStorage.getItem(MIG_KEY)==='1')_migDone=true;}catch(e){}
    if(!_migDone){
      var _migCount=0;
      movimientos.forEach(function(m){
        if(!m||m.tipo==='aporte'||!m.ticker||!m.fecha)return;
        if(m.mercado!=='BONOS'&&m.mercado!=='ON')return;
        var mepFecha=getMEP(m.fecha);
        if(mepFecha&&mepFecha>0&&m.ccl!==mepFecha){
          m.ccl=mepFecha;
          var rt=getRatio(m.ticker)||1;
          if(m.precioARS){m.precioUSD=Math.round(m.precioARS*rt/mepFecha*1000000)/1000000;}
          _migCount++;
        }
      });
      if(_migCount>0){
        try{localStorage.setItem(MIG_KEY,'1');}catch(e){}
        saveAndRender();
        console.log('Migración bonos/ONs → MEP: '+_migCount+' movimientos actualizados');
      } else {
        try{localStorage.setItem(MIG_KEY,'1');}catch(e){}
      }
    }

    var MIG_KEY_FILL=(PFX+'mig_fillCCL_v1');
    var _fillDone=false;
    try{if(localStorage.getItem(MIG_KEY_FILL)==='1')_fillDone=true;}catch(e){}
    if(!_fillDone){
      var _fillCount=0;
      movimientos.forEach(function(m){
        if(!m||m.tipo==='aporte'||!m.ticker||!m.fecha)return;
        if(m.ccl&&m.ccl>0)return;
        var esBonoON=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI');
        var tcFecha=esBonoON?(getMEP(m.fecha)||getCCL(m.fecha)):getCCL(m.fecha);
        if(tcFecha&&tcFecha>0){
          m.ccl=tcFecha;
          var rt=getRatio(m.ticker)||1;
          if(m.precioARS){m.precioUSD=Math.round(m.precioARS*rt/tcFecha*1000000)/1000000;}
          _fillCount++;
        }
      });
      if(_fillCount>0){
        try{localStorage.setItem(MIG_KEY_FILL,'1');}catch(e){}
        saveAndRender();
        console.log('Migración fill CCL/USD: '+_fillCount+' movimientos completados');
      } else {
        try{localStorage.setItem(MIG_KEY_FILL,'1');}catch(e){}
      }
    }

    var _recalcDone=false;
    movimientos.forEach(function(m){
      if(!m||m.tipo==='aporte'||!m.ccl||!m.ticker)return;
      var rActual=getRatio(m.ticker);
      if(m.ratio!==rActual){m.ratio=rActual;m.precioUSD=Math.round(m.precioARS*rActual/m.ccl*1000000)/1000000;_recalcDone=true;}
    });
    if(_recalcDone){ saveAndRender(); }

    // ── Auto-fix: completar CCL/MEP faltantes ──
    var _cclFixed=false;
    movimientos.forEach(function(m){
      if(!m||!m.fecha) return;
      var isBono=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI');
      if(!m.ccl||m.ccl===0){
        var tcVal=isBono?(MEP_TABLE[m.fecha]||CCL_TABLE[m.fecha]):(CCL_TABLE[m.fecha]);
        if(tcVal){
          m.ccl=tcVal;
          if(m.precioARS&&tcVal>0){var rt=getRatio(m.ticker)||1;m.precioUSD=Math.round(m.precioARS*rt/tcVal*1000000)/1000000;m.ratio=rt;}
          _cclFixed=true;
          console.log('[fixCCL] '+m.id+' '+m.fecha+' '+m.ticker+' → '+(isBono?'MEP':'CCL')+'='+tcVal);
        }
      }
    });
    if(_cclFixed){ sbSaveArray('movimientos',movimientos); try{localStorage.setItem((PFX+'mov2'),JSON.stringify(movimientos));}catch(e){} }

    var sbDolz = await sbGetConfig('dolz_extra');
    if(Array.isArray(sbDolz)) DOLZ_EXTRA = new Set(sbDolz);

    renderMovimientos();renderPortfolio();renderRatios();renderTargets();renderDividendos();trkRender();portUnblur();vsellPopulateSelect();vsellResetFecha();vbuyResetFecha();ventahistResetFecha();
    document.getElementById('lupd').textContent='Datos cargados ✓';
    _gdcInitDone = true;
    if(window._sinSenal||navigator.onLine===false){var _lu=document.getElementById('lupd');if(_lu)_lu.textContent='📡 Sin conexión · mostrando lo último guardado';}
    if(SB_STATUS&&SB_STATUS.ok!==false)setTimeout(function(){bkDaily();},6000);
    if(initFromSupabase._done) initFromSupabase._done();

    if(Object.keys(quotes).length === 0){
      setTimeout(function(){ if(typeof fetchAllQuotes==='function') fetchAllQuotes(); }, 500);
    }
    setTimeout(function(){ if(CFG.rsi&&typeof fetchAllRSI==='function') fetchAllRSI(); }, 1500);
    setTimeout(function(){ if(CFG.rsi&&typeof fetchAllTIR==='function') fetchAllTIR(); }, 2000);
  }

  // Precarga: muestra al instante lo de la última visita (guardado en este navegador) mientras llega Supabase.
  // No guarda nada (los guardados esperan a _gdcInitDone) y deja todo como estaba para que la carga real decida.
  function _precargaLocal(){
    try{
      if(localStorage.getItem(PFX+'version')!==DATA_VERSION)return;
      var sm=localStorage.getItem(PFX+'mov2'),sq=localStorage.getItem(PFX+'q3');if(!sm||!sq)return;
      var mv=JSON.parse(sm);if(!Array.isArray(mv)||!mv.length)return;
      var cl=function(o){return JSON.parse(JSON.stringify(o));};
      var bk={mov:movimientos,div:dividendos,trk:TRK.divs,q:quotes,rsi:RSI_CACHE,rat:cl(RATIOS_TABLE),tgt:cl(TARGET_TABLE),apor:APOR,aporL:_aporLoaded,inp:{}};
      ['liq-ars','liq-usd','inv-sidebar-usd'].forEach(function(id){var e=document.getElementById(id);if(e)bk.inp[id]=e.value;});
      var _disp=document.getElementById('inv-inicial-usd-display');if(_disp)bk.disp=_disp.textContent;
      var rd=function(k){try{var v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;}};
      movimientos=mv.filter(function(m){return m!=null;});
      var d=rd(PFX+'divs');if(Array.isArray(d))dividendos=d;
      var td=rd(TRK.DKEY);if(Array.isArray(td))TRK.divs=td;
      var r=rd(PFX+'ratios');if(r)Object.keys(r).forEach(function(t){RATIOS_TABLE[t]=r[t];});
      var tg=rd(PFX+'targets');if(tg)Object.assign(TARGET_TABLE,tg);
      try{loadLiquidez();}catch(e){}
      try{loadInvInicial();}catch(e){}
      quotes=JSON.parse(sq)||{};
      var rs=rd(PFX+'rsi');if(rs)RSI_CACHE=rs;
      if(CFG.aportes&&!_aporLoaded){var ap=rd(PFX+'apor');if(Array.isArray(ap)){APOR=ap;_aporLoaded=true;}}
      try{renderPortfolio();}catch(e){console.warn('precarga',e);}
      movimientos=bk.mov;dividendos=bk.div;TRK.divs=bk.trk;quotes=bk.q;RSI_CACHE=bk.rsi;APOR=bk.apor;_aporLoaded=bk.aporL;
      var rr=function(T,o){Object.keys(T).forEach(function(k){delete T[k];});Object.assign(T,o);};rr(RATIOS_TABLE,bk.rat);rr(TARGET_TABLE,bk.tgt);
      Object.keys(bk.inp).forEach(function(id){var e=document.getElementById(id);if(e)e.value=bk.inp[id];});
      if(_disp&&bk.disp!=null)_disp.textContent=bk.disp;
      var l=document.getElementById('lupd');if(l)l.textContent='Mostrando tu última visita · actualizando…';
    }catch(e){console.warn('precarga',e);}
  }

  // La carga completa corre UNA vez (antes corría 3: al abrir y en cada aviso de sesión de Supabase).
  var _ifsP=null,_ifsOk=false;
  function _ifsUnaVez(){
    if(_ifsOk)return Promise.resolve();
    if(!_ifsP)_ifsP=initFromSupabase().catch(function(e){console.warn('initFromSupabase',e);}).then(function(){_ifsP=null;});
    return _ifsP;
  }
  window.initFromSupabase = _ifsUnaVez;
  _ifsUnaVez();

  // ── Auto-refresh cada 10 minutos mientras la pagina esta abierta ──
  var AUTO_MS = 10 * 60 * 1000;
  var _countdown = AUTO_MS / 1000;
  var _autoTimer = null;
  var _tickTimer = null;

  function _updateLabel(){
    var el = document.getElementById('lupd');
    if(!el) return;
    var last = el.dataset.lastupd || '';
    var m = Math.floor(_countdown / 60);
    var s = _countdown % 60;
    var next = 'próx. ' + m + ':' + (s < 10 ? '0' : '') + s;
    el.textContent = (last ? last + ' · ' : '') + next;
  }

  function _startCycle(){
    if(_autoTimer)  clearTimeout(_autoTimer);
    if(_tickTimer)  clearInterval(_tickTimer);
    _countdown = AUTO_MS / 1000;
    _updateLabel();
    _tickTimer = setInterval(function(){ if(_countdown > 0){ _countdown = Math.max(0, _countdown - 180); _updateLabel(); } }, 180000);
    _autoTimer = setTimeout(function(){
      clearInterval(_tickTimer);
      if(document.hidden){
        document.addEventListener('visibilitychange', function _onVis(){
          if(!document.hidden){ document.removeEventListener('visibilitychange', _onVis); fetchAllQuotes(); }
        });
      } else {
        fetchAllQuotes();
      }
    }, AUTO_MS);
  }

  var _origFetch = fetchAllQuotes;
  fetchAllQuotes = async function(){
    var r = await _origFetch();
    var el = document.getElementById('lupd');
    if(el) el.dataset.lastupd = new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
    setTimeout(renderPortfolio, 100);
    if(document.getElementById('page-dashboard') && document.getElementById('page-dashboard').classList.contains('active')){
      setTimeout(renderDashboard, 150);
    }
    _startCycle();
    return r;
  };

  _startCycle();

  var _sbInitDone = false;
  initFromSupabase._done = function(){ _sbInitDone = true; };
  setTimeout(function(){ if(!_sbInitDone) renderPortfolio(); }, 800);

  // ── Market data: BTC, EWZ, IMV/CCL ──────────────────────────────────────
  async function fetchMarketExtras(){
    try {
      var r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
      if(r.ok){
        var d = await r.json();
        var price = d.bitcoin.usd;
        var chg = d.bitcoin.usd_24h_change;
        var el = document.getElementById('tb-btc');
        var ec = document.getElementById('tb-btc-chg');
        if(el) el.textContent = '$' + price.toLocaleString('en-US',{maximumFractionDigits:0});
        if(ec){
          ec.textContent = (chg>=0?'+':'')+chg.toFixed(2)+'%';
          ec.style.color = chg>=0?'var(--accent)':'var(--red)';
        }
      }
    }catch(e){}

    try {
      var ewzQ;
      try {
        ewzQ = await fetchFinnhub('EWZ');
      } catch(e1) {
        var ewzUrl = 'https://query2.finance.yahoo.com/v8/finance/chart/EWZ?interval=1d&range=2d';
        var ewzProxies = [
          fetchWithTimeout('https://api.allorigins.win/get?url='+encodeURIComponent(ewzUrl),{},7000)
            .then(function(r){return r.ok?r.json():Promise.reject();})
            .then(function(j){return parseYahooChart(JSON.parse(j.contents||'{}'))||Promise.reject();}),
          fetchWithTimeout('https://corsproxy.io/?url='+encodeURIComponent(ewzUrl),{},7000)
            .then(function(r){return r.ok?r.json():Promise.reject();})
            .then(function(j){return parseYahooChart(j)||Promise.reject();})
        ];
        ewzQ = await (typeof Promise.any==='function' ? Promise.any(ewzProxies) : new Promise(function(res,rej){var n=ewzProxies.length;ewzProxies.forEach(function(p){p.then(res).catch(function(){if(--n===0)rej();});});}));
      }
      var el2 = document.getElementById('tb-ewz');
      var ec2 = document.getElementById('tb-ewz-chg');
      if(el2) el2.textContent = '$'+ewzQ.price.toFixed(2);
      if(ec2){
        ec2.textContent = (ewzQ.changePct>=0?'+':'')+ewzQ.changePct.toFixed(2)+'%';
        ec2.style.color = ewzQ.changePct>=0?'var(--accent)':'var(--red)';
      }
    }catch(e){}

    try {
      var mervUrl = 'https://query2.finance.yahoo.com/v8/finance/chart/%5EMERV?interval=1d&range=2d';
      var mervProxies = [
        fetchWithTimeout('https://api.allorigins.win/get?url='+encodeURIComponent(mervUrl),{},7000)
          .then(function(r){return r.ok?r.json():Promise.reject();})
          .then(function(j){return parseYahooChart(JSON.parse(j.contents||'{}'))||Promise.reject();}),
        fetchWithTimeout('https://corsproxy.io/?url='+encodeURIComponent(mervUrl),{},7000)
          .then(function(r){return r.ok?r.json():Promise.reject();})
          .then(function(j){return parseYahooChart(j)||Promise.reject();}),
        fetchWithTimeout('https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(mervUrl),{},7000)
          .then(function(r){return r.ok?r.json():Promise.reject();})
          .then(function(j){return parseYahooChart(j)||Promise.reject();})
      ];
      var mervQ = await (typeof Promise.any==='function'
        ? Promise.any(mervProxies)
        : new Promise(function(res,rej){var n=mervProxies.length;mervProxies.forEach(function(p){p.then(res).catch(function(){if(--n===0)rej();});});}));

      var el3 = document.getElementById('tb-imv');
      var ec3 = document.getElementById('tb-imv-chg');
      var ccl = (typeof CCL_HOY!=='undefined'&&CCL_HOY>1) ? CCL_HOY : 1;
      var imvUsd = mervQ.price / ccl;
      var imvUsdPrev = mervQ.prevClose / ccl;
      var chg3 = imvUsdPrev>0 ? (imvUsd-imvUsdPrev)/imvUsdPrev*100 : mervQ.changePct;
      if(el3) el3.textContent = '$'+Math.round(imvUsd).toLocaleString('es-AR');
      if(ec3){
        ec3.textContent = (chg3>=0?'+':'')+chg3.toFixed(2)+'%';
        ec3.style.color = chg3>=0?'var(--accent)':'var(--red)';
      }
    }catch(e){}

    async function fetchTopbarTicker(symbol, elId, chgId){
      try{
        var q;
        try{ q=await fetchFinnhub(symbol); }
        catch(e1){
          var url='https://query2.finance.yahoo.com/v8/finance/chart/'+encodeURIComponent(symbol)+'?interval=1d&range=2d';
          var proxies=[
            fetchWithTimeout('https://api.allorigins.win/get?url='+encodeURIComponent(url),{},7000)
              .then(function(r){return r.ok?r.json():Promise.reject();})
              .then(function(j){return parseYahooChart(JSON.parse(j.contents||'{}'))||Promise.reject();}),
            fetchWithTimeout('https://corsproxy.io/?url='+encodeURIComponent(url),{},7000)
              .then(function(r){return r.ok?r.json():Promise.reject();})
              .then(function(j){return parseYahooChart(j)||Promise.reject();})
          ];
          q=await(typeof Promise.any==='function'?Promise.any(proxies):new Promise(function(res,rej){var n=proxies.length;proxies.forEach(function(p){p.then(res).catch(function(){if(--n===0)rej();});});}));
        }
        var el=document.getElementById(elId);
        var ec=document.getElementById(chgId);
        if(el) el.textContent='$'+q.price.toFixed(2);
        if(ec){ec.textContent=(q.changePct>=0?'+':'')+q.changePct.toFixed(2)+'%';ec.style.color=q.changePct>=0?'var(--accent)':'var(--red)';}
      }catch(e){}
    }
    fetchTopbarTicker('SPY','tb-spy','tb-spy-chg');
    fetchTopbarTicker('QQQ','tb-qqq','tb-qqq-chg');
  }

  fetchMarketExtras();
  setInterval(fetchMarketExtras, 10*60*1000);

})();

function toggleSidebar(){
  var main = document.getElementById('main') || document.querySelector('.main');
  if(main) main.classList.toggle('sidebar-open');
}
document.addEventListener('click',function(e){
  if(window.innerWidth>680&&!document.body.classList.contains('nv-on'))return;var main=document.getElementById('main')||document.querySelector('.main');if(!main||!main.classList.contains('sidebar-open'))return;
  if(e.target.closest('.nav-item')){setTimeout(function(){main.classList.remove('sidebar-open');window.scrollTo(0,0);},50);return;}
  if(!e.target.closest('.sidebar')&&!e.target.closest('#sidebar-toggle-btn')&&!e.target.closest('#nv-menu-btn'))main.classList.remove('sidebar-open');
},true);

// ─── Mini Pie: distribución portafolio ───────────────────────
// ─── Sector Pie: desglose por cada sector ────────────────────
var SECTOR_PIE_INST=null;
var SECTOR_PIE_COLORS={
  nyse:'rgba(239,68,68,.85)',
  bonos:'rgba(249,115,22,.85)',
  on:'rgba(156,163,175,.85)',
  argentina:'rgba(56,189,248,.85)',
  brasil:'rgba(250,204,21,.85)',
  europa:'rgba(251,146,60,.85)',
  china:'rgba(248,113,113,.85)',
  cripto:'rgba(192,132,252,.85)',
  fci:'rgba(16,185,129,.85)'
};
var SECTOR_PIE_BORDER={
  nyse:'#ef4444',bonos:'#f97316',on:'#9ca3af',
  argentina:'#38bdf8',brasil:'#facc15',
  europa:'#fb923c',china:'#ff5252',cripto:'#c084fc',
  fci:'#10b981'
};
var SECTOR_PIE_LABEL={
  nyse:'USA',bonos:'Bonos',on:'ON',
  argentina:'Argentina',brasil:'Brasil',
  europa:'Europa',china:'China',cripto:'Cripto',
  fci:'FCI'
};

function renderSectorPie(sectorVal){
  var canvas=document.getElementById('m-pie-sector');
  if(!canvas) return;
  if(_chartLuego(renderSectorPie,arguments,canvas.offsetParent===null)) return;
  if(SECTOR_PIE_INST){try{SECTOR_PIE_INST.destroy();}catch(e){} SECTOR_PIE_INST=null;}
  var keys=Object.keys(sectorVal).filter(function(k){return (sectorVal[k]||0)>0;});
  keys.sort(function(a,b){return sectorVal[b]-sectorVal[a];});
  var total=keys.reduce(function(s,k){return s+(sectorVal[k]||0);},0);
  if(total<=0) return;
  var labels=keys.map(function(k){return SECTOR_PIE_LABEL[k]||k;});
  var data=keys.map(function(k){return Math.round(sectorVal[k]||0);});
  var bgColors=keys.map(function(k){return SECTOR_PIE_COLORS[k]||'rgba(139,143,168,.7)';});
  var bdColors=keys.map(function(k){return SECTOR_PIE_BORDER[k]||'#7a9cc5';});
  var pieLabelPlugin2={
    id:'pieLabels2',
    afterDatasetDraw:function(chart){
      var ctx2=chart.ctx;
      chart.data.datasets.forEach(function(_ds,di){
        var meta=chart.getDatasetMeta(di);
        meta.data.forEach(function(arc,i){
          var val=chart.data.datasets[di].data[i];
          var pct=total>0?(val/total*100):0;
          if(pct<4) return;
          var angle=(arc.startAngle+arc.endAngle)/2;
          var r=(arc.innerRadius+arc.outerRadius)/2;
          var x=arc.x+Math.cos(angle)*r;
          var y=arc.y+Math.sin(angle)*r;
          ctx2.save();
          ctx2.textAlign='center';ctx2.textBaseline='middle';
          ctx2.font='700 13px JetBrains Mono, monospace';
          ctx2.fillStyle='#fff';
          ctx2.fillText(pct.toFixed(0)+'%',x,y);
          ctx2.restore();
        });
      });
    }
  };
  SECTOR_PIE_INST=new Chart(canvas.getContext('2d'),{
    type:'doughnut',
    data:{labels:labels,datasets:[{data:data,backgroundColor:bgColors,borderColor:bdColors,borderWidth:1.5,hoverOffset:4}]},
    options:{
      responsive:true,maintainAspectRatio:false,cutout:'48%',
      plugins:{
        legend:{display:false},
        tooltip:{callbacks:{label:function(ctx){
          var v=ctx.parsed;
          var pct=(total>0?(v/total*100):0).toFixed(1);
          return ' $'+v.toLocaleString('es-AR')+' ('+pct+'%)';
        }}}
      }
    },
    plugins:[pieLabelPlugin2]
  });
}

// ─── RV Pie: renta variable desglosada por país ───────────────
var RV_PIE_INST=null;
var RV_SECTORS=['nyse','argentina','brasil','europa','china','cripto'];
var RV_PIE_LABEL={nyse:'USA',argentina:'Argentina',brasil:'Brasil',europa:'Europa',china:'China',cripto:'Cripto'};
var RV_PIE_COLORS={
  nyse:'rgba(239,68,68,.85)',argentina:'rgba(56,189,248,.85)',
  brasil:'rgba(250,204,21,.85)',europa:'rgba(251,146,60,.85)',
  china:'rgba(248,113,113,.85)',cripto:'rgba(192,132,252,.85)'
};
var RV_PIE_BORDER={
  nyse:'#ef4444',argentina:'#38bdf8',brasil:'#facc15',
  europa:'#fb923c',china:'#ff5252',cripto:'#c084fc'
};

function renderRVPie(sectorVal){
  var canvas=document.getElementById('m-pie-rv');
  if(!canvas) return;
  if(_chartLuego(renderRVPie,arguments,canvas.offsetParent===null)) return;
  if(RV_PIE_INST){try{RV_PIE_INST.destroy();}catch(e){} RV_PIE_INST=null;}
  var keys=RV_SECTORS.filter(function(k){return (sectorVal[k]||0)>0;});
  keys.sort(function(a,b){return (sectorVal[b]||0)-(sectorVal[a]||0);});
  var total=keys.reduce(function(s,k){return s+(sectorVal[k]||0);},0);
  if(total<=0) return;
  var pieLabelPluginRV={
    id:'pieLabelsRV',
    afterDatasetDraw:function(chart){
      var ctx2=chart.ctx;
      chart.data.datasets.forEach(function(_ds,di){
        var meta=chart.getDatasetMeta(di);
        meta.data.forEach(function(arc,i){
          var val=chart.data.datasets[di].data[i];
          var pct=total>0?(val/total*100):0;
          if(pct<4) return;
          var angle=(arc.startAngle+arc.endAngle)/2;
          var r=(arc.innerRadius+arc.outerRadius)/2;
          var x=arc.x+Math.cos(angle)*r;
          var y=arc.y+Math.sin(angle)*r;
          ctx2.save();
          ctx2.textAlign='center';ctx2.textBaseline='middle';
          ctx2.font='700 13px JetBrains Mono, monospace';
          ctx2.fillStyle='#fff';
          ctx2.fillText(pct.toFixed(0)+'%',x,y);
          ctx2.restore();
        });
      });
    }
  };
  RV_PIE_INST=new Chart(canvas.getContext('2d'),{
    type:'doughnut',
    data:{
      labels:keys.map(function(k){return RV_PIE_LABEL[k]||k;}),
      datasets:[{
        data:keys.map(function(k){return Math.round(sectorVal[k]||0);}),
        backgroundColor:keys.map(function(k){return RV_PIE_COLORS[k]||'rgba(139,143,168,.7)';}),
        borderColor:keys.map(function(k){return RV_PIE_BORDER[k]||'#7a9cc5';}),
        borderWidth:1.5,hoverOffset:4
      }]
    },
    options:{
      responsive:true,maintainAspectRatio:false,cutout:'48%',
      plugins:{
        legend:{display:false},
        tooltip:{callbacks:{label:function(ctx){
          var v=ctx.parsed;
          var pct=(total>0?(v/total*100):0).toFixed(1);
          return ' $'+v.toLocaleString('es-AR')+' ('+pct+'%)';
        }}}
      }
    },
    plugins:[pieLabelPluginRV]
  });
}

// ─── DashBoard ───────────────────────────────────────────────
var RUBRO_MAP={
  'AAPL':'Tecnología','MSFT':'Tecnología','NVDA':'Tecnología','GOOGL':'Tecnología','GOOG':'Tecnología',
  'META':'Tecnología','ADBE':'Tecnología','CRM':'Tecnología','ORCL':'Tecnología','INTC':'Tecnología',
  'AMD':'Tecnología','QCOM':'Tecnología','AVGO':'Tecnología','SNOW':'Tecnología','SPOT':'Tecnología',
  'TEAM':'Tecnología','NOW':'Tecnología','INTU':'Tecnología','PANW':'Tecnología','ZS':'Tecnología',
  'CRWD':'Tecnología','HPQ':'Tecnología','IBM':'Tecnología','CSCO':'Tecnología','AMAT':'Tecnología',
  'LRCX':'Tecnología','KLAC':'Tecnología','MU':'Tecnología','WDC':'Tecnología','NXPI':'Tecnología',
  'GLOB':'Tecnología','BIGO':'Tecnología','SAP':'Tecnología','ASML':'Tecnología','SONY':'Tecnología',
  'TSM':'Tecnología','SSNLF':'Tecnología','BIDU':'Tecnología','MRVL':'Tecnología','PLTR':'Tecnología',
  'ARM':'Tecnología','ALAB':'Tecnología','CRWV':'Tecnología','NBIS':'Tecnología','SNDK':'Tecnología',
  'AMZN':'E-commerce','MELI':'E-commerce','BABA':'E-commerce','JD':'E-commerce','PDD':'E-commerce',
  'SHOP':'E-commerce','WMT':'E-commerce','TGT':'E-commerce','COST':'E-commerce','EBAY':'E-commerce',
  'JPM':'Finanzas','GS':'Finanzas','BAC':'Finanzas','C':'Finanzas','WFC':'Finanzas',
  'MS':'Finanzas','BLK':'Finanzas','V':'Finanzas','MA':'Finanzas','AXP':'Finanzas',
  'PYPL':'Finanzas','SQ':'Finanzas','NU':'Finanzas','ITUB':'Finanzas','GGAL':'Finanzas',
  'BMA':'Finanzas','SUPV':'Finanzas','BBAR':'Finanzas','VALO':'Finanzas','BHIP':'Finanzas',
  'BPAT':'Finanzas','BYMA':'Finanzas','BRIO':'Finanzas',
  'XOM':'Energía','CVX':'Energía','SLB':'Energía','COP':'Energía','PBR':'Energía',
  'YPF':'Energía','CEPU':'Energía','PAM':'Energía','TGS':'Energía','OXY':'Energía',
  'MPC':'Energía','PSX':'Energía','VLO':'Energía','VISTA':'Energía','VISTD':'Energía',
  'BP':'Energía','SHEL':'Energía','EOG':'Energía','DVN':'Energía','HAL':'Energía',
  'JNJ':'Salud','PFE':'Salud','MRK':'Salud','ABBV':'Salud','LLY':'Salud',
  'UNH':'Salud','CVS':'Salud','GILD':'Salud','AMGN':'Salud','BMY':'Salud',
  'ISRG':'Salud','MDT':'Salud','ABT':'Salud','TMO':'Salud','DHR':'Salud',
  'MRNA':'Salud','BNTX':'Salud','REGN':'Salud','VRTX':'Salud',
  'KO':'Consumo','PEP':'Consumo','MCD':'Consumo','SBUX':'Consumo','NKE':'Consumo',
  'PM':'Consumo','MO':'Consumo','PG':'Consumo','KHC':'Consumo','GIS':'Consumo',
  'MDLZ':'Consumo','CL':'Consumo','EL':'Consumo','CRES':'Consumo',
  'NFLX':'Entretenimiento','DIS':'Entretenimiento','PARA':'Entretenimiento',
  'WBD':'Entretenimiento','CMCSA':'Entretenimiento','RBLX':'Entretenimiento',
  'TTWO':'Entretenimiento','EA':'Entretenimiento',
  'T':'Telecomunicaciones','VZ':'Telecomunicaciones','TECO2':'Telecomunicaciones','COME':'Telecomunicaciones',
  'TSLA':'Automotriz','F':'Automotriz','GM':'Automotriz','STLA':'Automotriz','TM':'Automotriz',
  'DAL':'Aerolíneas','UAL':'Aerolíneas','AAL':'Aerolíneas','LUV':'Aerolíneas',
  'GLOB':'Tecnología',
  'CAT':'Industrial','DE':'Industrial','BA':'Industrial','GE':'Industrial',
  'HON':'Industrial','MMM':'Industrial','RTX':'Industrial','LMT':'Industrial',
  'NOC':'Industrial','GD':'Industrial','UPS':'Industrial','FDX':'Industrial',
  'ALUA':'Materiales','TXAR':'Materiales','FCX':'Materiales','NEM':'Materiales',
  'GOLD':'Materiales','NUE':'Materiales','X':'Materiales',
  'LOMA':'Construcción','HARG':'Construcción',
  'IRSA':'Inmobiliario','IRCP':'Inmobiliario',
  'BRF':'Agro','BRFS':'Agro','MOS':'Agro','GGB':'Materiales','BBD':'Finanzas','BBAS3':'Finanzas',
  'PETR3':'Energía','PAGS':'Tecnología','STNE':'Tecnología','ARCO':'Consumo','HOG':'Automotriz',
  'EWZ':'ETF','UNP':'Industrial',
  'COIN':'Cripto'
};

var USER_RUBRO_TABLE={};

var RUBRO_OPTIONS_DEFAULT=[
  'Tecnología','E-commerce','Finanzas','Energía','Salud','Consumo',
  'Entretenimiento','Telecomunicaciones','Automotriz','Aerolíneas',
  'Industrial','Materiales','Construcción','Inmobiliario','Agro',
  'Cripto','Bonos','ON','Otros'
];
var RUBRO_OPTIONS=RUBRO_OPTIONS_DEFAULT.slice();

function _rubroLoadCatalog(){
  try{var s=localStorage.getItem((PFX+'rubro_catalog'));if(s){RUBRO_OPTIONS=JSON.parse(s);}}catch(e){}
}
function _rubroSaveCatalog(){
  try{localStorage.setItem((PFX+'rubro_catalog'),JSON.stringify(RUBRO_OPTIONS));}catch(e){}
}

function getRubro(ticker){
  return USER_RUBRO_TABLE[ticker]||RUBRO_MAP[ticker]||'Otros';
}

// ── Catálogo ──────────────────────────────────────────────────
function movFormToggle(){
  var body=document.getElementById('mov-form-body');
  var arrow=document.getElementById('mov-form-arrow');
  if(!body)return;
  var open=body.style.display==='none';
  body.style.display=open?'block':'none';
  if(arrow)arrow.textContent=open?'▾':'▸';
}
function movHistorialToggle(){
  var body=document.getElementById('mov-historial-body');
  var arrow=document.getElementById('mov-historial-arrow');
  if(!body)return;
  var open=body.style.display==='none';
  body.style.display=open?'block':'none';
  if(arrow)arrow.textContent=open?'▾':'▸';
}
function rubroToggleCatalog(){
  var body=document.getElementById('rubro-catalog-body');
  var arrow=document.getElementById('rubro-catalog-arrow');
  if(!body)return;
  var open=body.style.display==='none';
  body.style.display=open?'block':'none';
  if(arrow)arrow.textContent=open?'▾':'▸';
  if(open) rubroRenderCatalogTags();
}

function rubroRenderCatalogTags(){
  var container=document.getElementById('rubro-catalog-tags');
  if(!container)return;
  container.innerHTML='';
  RUBRO_OPTIONS.forEach(function(r){
    var tag=document.createElement('span');
    tag.style.cssText='display:inline-flex;align-items:center;gap:4px;background:var(--surface2);border:1px solid var(--border2);border-radius:20px;padding:2px 10px;font-family:var(--mono);font-size:.7rem;color:var(--text)';
    tag.innerHTML=r+'<button onclick="rubroCatalogRemove(\''+r.replace(/'/g,"\\'")+'\')" title="Eliminar" style="background:none;border:none;color:var(--text3);cursor:pointer;font-size:.8rem;padding:0;line-height:1;margin-left:2px">✕</button>';
    container.appendChild(tag);
  });
}

function rubroCatalogAdd(){
  var inp=document.getElementById('rubro-new-name');
  if(!inp)return;
  var val=(inp.value||'').trim();
  if(!val)return;
  if(RUBRO_OPTIONS.indexOf(val)>=0){inp.style.borderColor='var(--amber)';setTimeout(function(){inp.style.borderColor='var(--border2)';},800);return;}
  RUBRO_OPTIONS.push(val);
  _rubroSaveCatalog();
  inp.value='';
  rubroRenderCatalogTags();
  renderRubros();
}

function rubroCatalogRemove(r){
  var idx=RUBRO_OPTIONS.indexOf(r);
  if(idx<0)return;
  RUBRO_OPTIONS.splice(idx,1);
  _rubroSaveCatalog();
  rubroRenderCatalogTags();
  renderRubros();
}

// ── Tabla de tickers ──────────────────────────────────────────
function renderRubros(){
  _rubroLoadCatalog();
  var positions=getPositions();
  var open=positions.filter(function(p){return p.qty>0;});
  var tbody=document.getElementById('rubros-tbody');
  if(!tbody)return;
  tbody.innerHTML='';
  open.sort(function(a,b){return a.ticker.localeCompare(b.ticker);}).forEach(function(p){
    var sector=getSector(p.ticker);
    var segLabel=(DB_SECTOR_LABEL&&DB_SECTOR_LABEL[sector])||sector;
    var segColor=(DB_SECTOR_COLOR&&DB_SECTOR_COLOR[sector])||'#7a9cc5';
    var currentRubro=getRubro(p.ticker);
    var opts=RUBRO_OPTIONS.slice();
    if(opts.indexOf(currentRubro)<0) opts.unshift(currentRubro);
    var optsHtml=opts.map(function(r){
      return '<option value="'+r+'"'+(r===currentRubro?' selected':'')+'>'+r+'</option>';
    }).join('');
    var row=document.createElement('tr');
    row.setAttribute('data-ticker',p.ticker);
    row.setAttribute('data-seg',segLabel.toLowerCase());
    row.setAttribute('data-rubro',currentRubro.toLowerCase());
    row.style.borderBottom='1px solid var(--border)';
    row.innerHTML=
      '<td style="padding:5px 8px;font-weight:700;color:var(--text)">'+p.ticker+'</td>'+
      '<td style="padding:5px 8px"><span style="font-size:.65rem;background:'+segColor+'22;color:'+segColor+';border:1px solid '+segColor+'44;border-radius:3px;padding:1px 6px;font-weight:600">'+segLabel+'</span></td>'+
      '<td style="padding:5px 8px;color:var(--text2)">'+currentRubro+'</td>'+
      '<td style="padding:5px 8px">'+
        '<select id="rubro-sel-'+p.ticker+'" onchange="rubroUpdateRowLabel(\''+p.ticker+'\')" style="background:var(--surface2);border:1px solid var(--border2);border-radius:var(--rsm);color:var(--text);font-family:var(--mono);font-size:.72rem;padding:2px 6px;outline:none;width:100%;max-width:200px">'+optsHtml+'</select>'+
      '</td>'+
      '<td style="padding:5px 8px;text-align:center">'+
        '<button class="btn btn-sm" onclick="rubroSaveOne(\''+p.ticker+'\')" style="font-size:.62rem;padding:2px 8px">✓</button>'+
      '</td>';
    tbody.appendChild(row);
  });
  rubroFilterTable();
}

function rubroUpdateRowLabel(ticker){
  var sel=document.getElementById('rubro-sel-'+ticker);
  if(!sel)return;
  var row=document.querySelector('#rubros-tbody tr[data-ticker="'+ticker+'"]');
  if(row) row.setAttribute('data-rubro',sel.value.toLowerCase());
  rubroFilterTable();
}

function rubroFilterTable(){
  var q=(document.getElementById('rubro-filter').value||'').toLowerCase().trim();
  var rows=document.querySelectorAll('#rubros-tbody tr');
  rows.forEach(function(r){
    if(!q){r.style.display='';return;}
    var ticker=(r.getAttribute('data-ticker')||'').toLowerCase();
    var seg=(r.getAttribute('data-seg')||'').toLowerCase();
    var rubro=(r.getAttribute('data-rubro')||'').toLowerCase();
    r.style.display=(ticker.indexOf(q)>=0||seg.indexOf(q)>=0||rubro.indexOf(q)>=0)?'':'none';
  });
}

function rubroSaveOne(ticker){
  var sel=document.getElementById('rubro-sel-'+ticker);
  if(!sel)return;
  var rubro=sel.value;
  USER_RUBRO_TABLE[ticker]=rubro;
  var row=document.querySelector('#rubros-tbody tr[data-ticker="'+ticker+'"]');
  if(row){
    var td=row.querySelectorAll('td')[2];
    if(td)td.textContent=rubro;
    row.setAttribute('data-rubro',rubro.toLowerCase());
  }
  _rubroPersist();
  sel.style.borderColor='var(--accent)';
  setTimeout(function(){sel.style.borderColor='var(--border2)';},800);
}

function rubroSaveAll(){
  var rows=document.querySelectorAll('#rubros-tbody tr');
  rows.forEach(function(r){
    var ticker=r.getAttribute('data-ticker');
    if(!ticker)return;
    var sel=document.getElementById('rubro-sel-'+ticker);
    if(!sel)return;
    USER_RUBRO_TABLE[ticker]=sel.value;
    var td=r.querySelectorAll('td')[2];
    if(td)td.textContent=sel.value;
    r.setAttribute('data-rubro',sel.value.toLowerCase());
  });
  _rubroPersist();
  var btn=document.querySelector('button[onclick="rubroSaveAll()"]');
  if(btn){var orig=btn.textContent;btn.textContent='✓ Guardado';setTimeout(function(){btn.textContent=orig;},1400);}
}

function _rubroPersist(){
  try{localStorage.setItem((PFX+'rubros'),JSON.stringify(USER_RUBRO_TABLE));}catch(e){}
  sbSetConfig('rubros', USER_RUBRO_TABLE);
}

var DB_CHARTS={};

function dbDestroyAll(){
  Object.keys(DB_CHARTS).forEach(function(k){
    try{DB_CHARTS[k].destroy();}catch(e){}
    delete DB_CHARTS[k];
  });
}

function dbMakeChart(id,config){
  var canvas=document.getElementById(id);
  if(!canvas)return;
  try{var ex=Chart.getChart(canvas);if(ex)ex.destroy();}catch(e){}
  var ctx=canvas.getContext('2d');
  DB_CHARTS[id]=new Chart(ctx,config);
}

var DB_SECTOR_LABEL={
  nyse:'USA / ETF',bonos:'Bonos',on:'ONs',
  argentina:'Argentina',brasil:'Brasil',
  europa:'Europa',china:'China',cripto:'Cripto'
};
var DB_SECTOR_COLOR={
  nyse:'#ef4444',bonos:'#f97316',on:'#9ca3af',
  argentina:'#38bdf8',brasil:'#facc15',
  europa:'#fb923c',china:'#ff5252',cripto:'#c084fc',
  fci:'#10b981'
};

var DB_LAST_RUBRO = null;
function renderDashboard(){
  if(typeof Chart==='undefined'){
    _chartLuego(renderDashboard,arguments);
    return;
  }
  dbDestroyAll();

  var positions=getPositions();
  var open=positions.filter(function(p){return p.qty>0;});
  var tcHoy=CCL_HOY||1;
  var mepHoy=MEP_HOY||tcHoy;

  var posData=[];
  open.forEach(function(p){
    var q=quotes[p.ticker];
    var sector=getSector(p.ticker);
    var isBonoON=(sector==='bonos'||sector==='on');
    var isArgentina=(sector==='argentina');
    var ratio=RATIOS_TABLE[p.ticker]||1;
    var mep=mepHoy||tcHoy;
    var _isBRL=BRL_TICKERS.has(p.ticker);
    var valUSD;
    if(q&&q.price){
      valUSD=isBonoON ? (q.price/mep)*p.qty/100
            :sector==='fci' ? (q.price/mep)*p.qty
            :isArgentina ? (q.price/tcHoy)*p.qty
            :_isBRL ? (q.price/tcHoy)*p.qty
            :q.fromByma ? (q.price/tcHoy)*p.qty
            :(q.price/ratio)*p.qty;
    } else {
      valUSD=p.costUSDpuro||0;
    }
    if(!valUSD)return;
    var costUSDtotal=p.costUSDpuro||0;
    var gainUSD=valUSD-costUSDtotal;
    posData.push({ticker:p.ticker,sector:sector,valUSD:valUSD,gainUSD:gainUSD,costUSD:costUSDtotal,hasQuote:!!(q&&q.price)});
  });

  // ── Gráfico 1: Top 10 posiciones por valor ───────────────
  var sorted=[].concat(posData).sort(function(a,b){return b.valUSD-a.valUSD;}).slice(0,10);
  var topColors=sorted.map(function(d){return DB_SECTOR_COLOR[d.sector]||'#448aff';});

  dbMakeChart('db-chart-top',{
    type:'bar',
    data:{
      labels:sorted.map(function(d){return d.ticker;}),
      datasets:[{
        label:'Valor USD',
        data:sorted.map(function(d){return Math.round(d.valUSD);}),
        backgroundColor:topColors.map(function(c){return c+'cc';}),
        borderColor:topColors,
        borderWidth:1,borderRadius:4
      }]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:function(ctx){return ' $'+ctx.parsed.y.toLocaleString('es-AR');}}}},
      scales:{
        x:{ticks:{color:'#7a9cc5',font:{family:'JetBrains Mono, monospace',size:10}},grid:{color:'#1e3050'}},
        y:{ticks:{color:'#7a9cc5',font:{family:'JetBrains Mono, monospace',size:10},callback:function(v){return '$'+Math.round(v/1000)+'k';}},grid:{color:'#1e3050'}}
      }
    }
  });

  // ── Gráfico 1b: Top 10 posiciones por valor sin Bonos y ONs ──
  var sortedRV=[].concat(posData).filter(function(d){return d.sector!=='bonos'&&d.sector!=='on';}).sort(function(a,b){return b.valUSD-a.valUSD;}).slice(0,10);
  var topRVColors=sortedRV.map(function(d){return DB_SECTOR_COLOR[d.sector]||'#448aff';});

  dbMakeChart('db-chart-top-rv',{
    type:'bar',
    data:{
      labels:sortedRV.map(function(d){return d.ticker;}),
      datasets:[{
        label:'Valor USD',
        data:sortedRV.map(function(d){return Math.round(d.valUSD);}),
        backgroundColor:topRVColors.map(function(c){return c+'cc';}),
        borderColor:topRVColors,
        borderWidth:1,borderRadius:4
      }]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:function(ctx){return ' $'+ctx.parsed.y.toLocaleString('es-AR');}}}},
      scales:{
        x:{ticks:{color:'#7a9cc5',font:{family:'JetBrains Mono, monospace',size:10}},grid:{color:'#1e3050'}},
        y:{ticks:{color:'#7a9cc5',font:{family:'JetBrains Mono, monospace',size:10},callback:function(v){return '$'+Math.round(v/1000)+'k';}},grid:{color:'#1e3050'}}
      }
    }
  });

  // ── Gráfico 3: Top 10 ganancias ──────────────────────────
  var gainsSorted=[].concat(posData).sort(function(a,b){return b.gainUSD-a.gainUSD;}).slice(0,10);

  dbMakeChart('db-chart-gains',{
    type:'bar',
    data:{
      labels:gainsSorted.map(function(d){return d.ticker;}),
      datasets:[{
        label:'Ganancia USD',
        data:gainsSorted.map(function(d){return Math.round(d.gainUSD);}),
        backgroundColor:'rgba(126,232,162,.25)',
        borderColor:'#00e676',
        borderWidth:1,borderRadius:4
      }]
    },
    options:{
      indexAxis:'y',responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:function(ctx){
        var v=ctx.parsed.x;
        return ' '+(v>=0?'+':'')+'$'+Math.round(v).toLocaleString('es-AR');
      }}}},
      scales:{
        x:{ticks:{color:'#7a9cc5',font:{family:'JetBrains Mono, monospace',size:10},callback:function(v){return '$'+Math.round(v/1000)+'k';}},grid:{color:'#1e3050'}},
        y:{ticks:{color:'#e8f0ff',font:{family:'JetBrains Mono, monospace',size:10}},grid:{color:'#1e3050'}}
      }
    }
  });

  // ── Gráfico 4: Top 10 pérdidas ───────────────────────────
  var lossesSorted=[].concat(posData).sort(function(a,b){return a.gainUSD-b.gainUSD;}).slice(0,10);

  dbMakeChart('db-chart-losses',{
    type:'bar',
    data:{
      labels:lossesSorted.map(function(d){return d.ticker;}),
      datasets:[{
        label:'Pérdida USD',
        data:lossesSorted.map(function(d){return Math.round(d.gainUSD);}),
        backgroundColor:'rgba(248,113,113,.2)',
        borderColor:'#ff5252',
        borderWidth:1,borderRadius:4
      }]
    },
    options:{
      indexAxis:'y',responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:function(ctx){
        var v=ctx.parsed.x;
        return ' '+(v>=0?'+':'')+'$'+Math.round(v).toLocaleString('es-AR');
      }}}},
      scales:{
        x:{ticks:{color:'#7a9cc5',font:{family:'JetBrains Mono, monospace',size:10},callback:function(v){return '$'+Math.round(v/1000)+'k';}},grid:{color:'#1e3050'}},
        y:{ticks:{color:'#e8f0ff',font:{family:'JetBrains Mono, monospace',size:10}},grid:{color:'#1e3050'}}
      }
    }
  });

  // ── Gráfico 5: Rendimiento % promedio por segmento ────────
  var segDefs=[
    {key:'nyse',   label:'USA'},
    {key:'argentina', label:'Argentina'},
    {key:'bonos',  label:'Bonos'},
    {key:'brasil', label:'Brasil'},
    {key:'on',     label:'ONs'},
    {key:'fci',    label:'FCI'},
    {key:'cripto', label:'Cripto'},
    {key:'europa', label:'Europa'},
    {key:'china',  label:'China'}
  ];
  var segValMap={};var segCostMap={};
  posData.forEach(function(d){
    segValMap[d.sector]=(segValMap[d.sector]||0)+d.valUSD;
    segCostMap[d.sector]=(segCostMap[d.sector]||0)+d.costUSD;
  });
  var segLabels=[];var segVals=[];var segColors=[];
  segDefs.forEach(function(s){
    var cost=segCostMap[s.key]||0;
    var val=segValMap[s.key]||0;
    if(cost<=0) return;
    var pct=(val-cost)/cost*100;
    segLabels.push(s.label);
    segVals.push(parseFloat(pct.toFixed(2)));
    segColors.push(pct>=0?'rgba(126,232,162,.75)':'rgba(248,113,113,.75)');
  });

  dbMakeChart('db-chart-segmentos',{
    type:'bar',
    data:{
      labels:segLabels,
      datasets:[{
        label:'Rendimiento %',
        data:segVals,
        backgroundColor:segColors,
        borderColor:segColors.map(function(c){return c.replace('.75',1);}),
        borderWidth:1,borderRadius:4
      }]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{
        legend:{display:false},
        tooltip:{callbacks:{label:function(ctx){
          var v=ctx.parsed.y;
          return ' '+(v>=0?'+':'')+v.toFixed(1)+'%';
        }}}
      },
      scales:{
        x:{ticks:{color:'#e8f0ff',font:{family:'JetBrains Mono, monospace',size:11}},grid:{color:'#1e3050'}},
        y:{
          ticks:{color:'#7a9cc5',font:{family:'JetBrains Mono, monospace',size:10},callback:function(v){return v+'%';}},
          grid:{color:'#1e3050'},
          border:{dash:[4,4]}
        }
      }
    }
  });

  // ── Gráfico 1: Distribución por rubro ────────────────────
  var rubroRawData=posData.filter(function(d){return d.sector!=='bonos'&&d.sector!=='on';});
  var rubroVal={};
  rubroRawData.forEach(function(d){
    var rubro=getRubro(d.ticker);
    rubroVal[rubro]=(rubroVal[rubro]||0)+d.valUSD;
  });
  var rubroAllKeys=Object.keys(rubroVal).sort(function(a,b){return rubroVal[b]-rubroVal[a];});
  var rubroTop=rubroAllKeys.slice(0,10);
  var rubroOtrosKeys=rubroAllKeys.slice(10);
  var rubroOtrosVal=rubroOtrosKeys.reduce(function(s,k){return s+rubroVal[k];},0);
  var rubroKeys=rubroTop.slice();
  var rubroFinal={};
  rubroTop.forEach(function(k){rubroFinal[k]=rubroVal[k];});
  if(rubroOtrosVal>0){rubroKeys.push('Otros');rubroFinal['Otros']=rubroOtrosVal;}
  var rubroTotal=rubroKeys.reduce(function(s,k){return s+(rubroFinal[k]||0);},0);
  var RUBRO_COLORS=['#448aff','#f97316','#00c853','#ff5252','#facc15','#c084fc','#38bdf8',
    '#fb923c','#a78bfa','#34d399','#9ca3af'];

  function dbShowRubroDetail(rubroName, color){
    DB_LAST_RUBRO = {name: rubroName, color: color};
    var detail=document.getElementById('db-rubros-detail');
    var title=document.getElementById('db-rubros-detail-title');
    var tbody=document.getElementById('db-rubros-detail-tbody');
    if(!detail||!title||!tbody) return;

    var tickers;
    if(rubroName==='Otros'){
      tickers=rubroRawData.filter(function(d){return rubroOtrosKeys.indexOf(getRubro(d.ticker))>=0;});
    } else {
      tickers=rubroRawData.filter(function(d){return getRubro(d.ticker)===rubroName;});
    }
    tickers=tickers.slice().sort(function(a,b){return b.valUSD-a.valUSD;});
    var rubroSum=tickers.reduce(function(s,d){return s+d.valUSD;},0);

    title.innerHTML='<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:'+color+';margin-right:6px;vertical-align:middle"></span>'+rubroName+' <span style="color:var(--text3);font-weight:400">— $'+Math.round(rubroSum).toLocaleString('es-AR')+' USD</span>';
    tbody.innerHTML='';
    tickers.forEach(function(d){
      var pct=rubroSum>0?(d.valUSD/rubroSum*100):0;
      var barW=Math.max(2,Math.round(pct));
      var tr=document.createElement('tr');
      tr.style.borderBottom='1px solid var(--border)';
      tr.innerHTML=
        '<td style="padding:4px 6px;font-weight:700;color:var(--text)">'+d.ticker+'</td>'+
        '<td style="padding:4px 6px;text-align:right;color:var(--text2)">$'+Math.round(d.valUSD).toLocaleString('es-AR')+'</td>'+
        '<td style="padding:4px 6px;min-width:120px">'+
          '<div style="display:flex;align-items:center;gap:6px">'+
            '<div style="flex:1;background:var(--border);border-radius:3px;height:6px;overflow:hidden">'+
              '<div style="width:'+barW+'%;background:'+color+';height:100%;border-radius:3px"></div>'+
            '</div>'+
            '<span style="color:var(--text);font-weight:700;font-size:.7rem;min-width:36px;text-align:right">'+pct.toFixed(1)+'%</span>'+
          '</div>'+
        '</td>';
      tbody.appendChild(tr);
    });
    detail.style.display='block';
    var hint=document.getElementById('db-rubros-hint');
    if(hint) hint.style.display='none';
  }

  var pieLabelPluginRubros={
    id:'pieLabelsRubros',
    afterDatasetDraw:function(chart){
      var ctx2=chart.ctx;
      chart.data.datasets.forEach(function(_ds,di){
        var meta=chart.getDatasetMeta(di);
        meta.data.forEach(function(arc,i){
          var val=chart.data.datasets[di].data[i];
          var pct=rubroTotal>0?(val/rubroTotal*100):0;
          if(pct<3) return;
          var angle=(arc.startAngle+arc.endAngle)/2;
          var r=(arc.innerRadius+arc.outerRadius)/2;
          var x=arc.x+Math.cos(angle)*r;
          var y=arc.y+Math.sin(angle)*r;
          ctx2.save();
          ctx2.textAlign='center';ctx2.textBaseline='middle';
          ctx2.font='700 13px JetBrains Mono, monospace';
          ctx2.fillStyle='#fff';
          var label=chart.data.labels[i]||'';
          ctx2.fillText(label,x,y-7);
          ctx2.fillText(pct.toFixed(0)+'%',x,y+7);
          ctx2.restore();
        });
      });
    }
  };

  dbMakeChart('db-chart-rubros',{
    type:'doughnut',
    data:{
      labels:rubroKeys,
      datasets:[{
        data:rubroKeys.map(function(k){return Math.round(rubroFinal[k]);}),
        backgroundColor:rubroKeys.map(function(_,i){return RUBRO_COLORS[i%RUBRO_COLORS.length]+'cc';}),
        borderColor:rubroKeys.map(function(_,i){return RUBRO_COLORS[i%RUBRO_COLORS.length];}),
        borderWidth:1.5,hoverOffset:8
      }]
    },
    options:{
      responsive:true,maintainAspectRatio:false,cutout:'40%',
      onClick:function(evt,elements){
        if(!elements||!elements.length) return;
        var idx=elements[0].index;
        var rubroName=rubroKeys[idx];
        var color=RUBRO_COLORS[idx%RUBRO_COLORS.length];
        dbShowRubroDetail(rubroName, color);
      },
      plugins:{
        legend:{display:false},
        tooltip:{callbacks:{label:function(ctx){
          var v=ctx.parsed;
          var pct=(rubroTotal>0?(v/rubroTotal*100):0).toFixed(1);
          return ' $'+Math.round(v).toLocaleString('es-AR')+' ('+pct+'%)';
        }}}
      }
    },
    plugins:[pieLabelPluginRubros]
  });

  renderWorldMap(posData);
  renderPerfChart();
  if(DB_LAST_RUBRO) dbShowRubroDetail(DB_LAST_RUBRO.name, DB_LAST_RUBRO.color);
}

// ─── World Map ────────────────────────────────────────
var _dbWorldMap = null;
function renderWorldMap(posData) {
  var container = document.getElementById('db-worldmap');
  if (!container) return;

  if (typeof jsVectorMap === 'undefined' || !window._jvmReady) {
    loadVectorMap();
    setTimeout(function(){ renderWorldMap(posData); }, 600);
    return;
  }

  if (_dbWorldMap) { try { _dbWorldMap.destroy(); } catch(e){} _dbWorldMap = null; }
  container.innerHTML = '';
  container.style.height = '380px';

  var sectorToRegion = {
    nyse:'usa', cripto:'usa',
    argentina:'arg', bonos:'arg', on:'arg', fci:'arg',
    brasil:'bra', europa:'eur', china:'chn'
  };
  var regionVal = { usa:0, arg:0, bra:0, eur:0, chn:0 };
  posData.forEach(function(d) {
    var r = sectorToRegion[d.sector];
    if (r) regionVal[r] += d.valUSD;
  });

  var regionCountries = {
    usa: ['US'],
    arg: ['AR'],
    bra: ['BR'],
    chn: ['CN'],
    eur: ['DE','GB','FR','NL','ES','IT','CH','SE','NO','DK','BE','AT','FI','PT','IE','PL']
  };

  var countryValues = {};
  var regionLookup = {};
  Object.keys(regionCountries).forEach(function(region) {
    var val = regionVal[region] || 0;
    regionCountries[region].forEach(function(code) {
      regionLookup[code] = region;
      if (val > 0) countryValues[code] = Math.round(val);
    });
  });

  var regionNames = { usa:'USA', arg:'Argentina', bra:'Brasil', eur:'Europa', chn:'China' };

  _dbWorldMap = new jsVectorMap({
    selector: '#db-worldmap',
    map: 'world',
    backgroundColor: '#0b1120',
    zoomOnScroll: false,
    zoomButtons: false,
    regionStyle: {
      initial: {
        fill: '#172035',
        fillOpacity: 1,
        stroke: '#0b1120',
        strokeWidth: 0.35,
        strokeOpacity: 1
      },
      hover: { fillOpacity: 0.82, cursor: 'default' }
    },
    onRegionTooltipShow: function(event, tooltip, code) {
      var region = regionLookup[code.toUpperCase ? code.toUpperCase() : code];
      if (!region) region = regionLookup[code];
      if (region && (regionVal[region]||0) > 0) {
        var val = regionVal[region];
        var valStr = val >= 1000 ? ('$'+Math.round(val/1000)+'k') : ('$'+Math.round(val));
        tooltip.text(regionNames[region] + ' — ' + valStr + ' USD');
      } else {
        event.preventDefault();
      }
    }
  });

  var _vals = Object.keys(regionCountries).map(function(r){ return regionVal[r]||0; });
  var _maxV = Math.max.apply(null, _vals) || 1;
  var _svgEl = container.querySelector('svg');
  if (_svgEl) {
    Object.keys(regionCountries).forEach(function(region) {
      var val = regionVal[region] || 0;
      if (val <= 0) return;
      var t = Math.pow(val / _maxV, 0.5);
      var gC = Math.round(48 + t * 30);
      var bC = Math.round(96 + t * 136);
      var color = 'rgb(26,' + gC + ',' + bC + ')';
      regionCountries[region].forEach(function(code) {
        var lc = code.toLowerCase();
        _svgEl.querySelectorAll('[data-code="' + lc + '"]').forEach(function(p) {
          p.setAttribute('fill', color);
        });
      });
    });
  }
}

// ─── Rendimiento vs S&P 500 ───────────────────────────────────
function renderPerfChart() {
  var canvas = document.getElementById('perf-chart');
  if (!canvas) return;
  if (_chartLuego(renderPerfChart,arguments)) return;

  var myReturns = [300, 70, 23, null];

  var rendEl = document.getElementById('m-rend');
  if (rendEl) {
    var txt = (rendEl.innerText || rendEl.textContent || '').replace(/[+%\s]/g, '');
    var n = parseFloat(txt);
    if (!isNaN(n)) myReturns[3] = n;
  }

  var spReturns = [26.3, 25.0, 18.0, null];
  var labels = ['2023', '2024', '2025', '2026 YTD'];

  function draw() {
    dbMakeChart('perf-chart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Mi cartera',
            data: myReturns,
            borderColor: '#448aff',
            backgroundColor: 'rgba(96,165,250,.12)',
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: '#448aff',
            pointBorderColor: '#0b1120',
            pointBorderWidth: 2,
            tension: 0.35,
            fill: true,
            spanGaps: true
          },
          {
            label: 'S&P 500',
            data: spReturns,
            borderColor: '#00e676',
            backgroundColor: 'rgba(126,232,162,.08)',
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: '#00e676',
            pointBorderColor: '#0b1120',
            pointBorderWidth: 2,
            tension: 0.35,
            fill: true,
            spanGaps: true
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true, position: 'top',
            labels: { color: '#7a9cc5', font: { family: 'JetBrains Mono,monospace', size: 10 }, boxWidth: 10, padding: 10 }
          },
          tooltip: {
            callbacks: {
              label: function(ctx) {
                var v = ctx.parsed.y;
                if (v === null || v === undefined) return ' N/D';
                return ' ' + ctx.dataset.label + ': ' + (v > 0 ? '+' : '') + v.toFixed(1) + '%';
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#7a9cc5', font: { family: 'JetBrains Mono,monospace', size: 10 } },
            grid: { color: '#1e3050' }
          },
          y: {
            ticks: {
              color: '#7a9cc5', font: { family: 'JetBrains Mono,monospace', size: 10 },
              callback: function(v) { return v + '%'; }
            },
            grid: { color: '#1e3050' }
          }
        }
      }
    });
  }

  var p1 = 1767052800;
  var p2 = Math.floor(Date.now() / 1000);
  var yUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?interval=1d&period1=' + p1 + '&period2=' + p2;

  fetch(yUrl)
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var res = d.chart && d.chart.result && d.chart.result[0];
      if (!res) { draw(); return; }
      var ts = res.timestamp || [];
      var cl = (res.indicators && res.indicators.quote && res.indicators.quote[0] && res.indicators.quote[0].close) || [];

      var c2026start = null;
      for (var i = 0; i < ts.length; i++) {
        if (ts[i] >= 1767225600 && cl[i] != null) { c2026start = cl[i]; break; }
      }
      var cNow = cl.slice().reverse().find(function(v) { return v != null; });

      if (c2026start && cNow)
        spReturns[3] = Math.round((cNow / c2026start - 1) * 1000) / 10;

      draw();
    })
    .catch(function() { draw(); });
}

const WL_KEY = CFG.wlKey;
function wlLoad(){return [];}

// ── % Dolarizado ──────────────────────────────────────────────────────────
var DOLZ_EXTRA = new Set();
async function dolzSave(){
  var arr=Array.from(DOLZ_EXTRA);
  await sbSetConfig('dolz_extra', arr);
}

function dolzTogglePopover(e){
  e.stopPropagation();
  var p=document.getElementById('dolz-popover');
  if(!p) return;
  p.style.display = p.style.display==='none' ? 'block' : 'none';
}
document.addEventListener('click', function(e){
  var p=document.getElementById('dolz-popover');
  if(!p||p.style.display==='none') return;
  if(!p.parentElement.contains(e.target)) p.style.display='none';
});

function dolzBuildList(open){
  var list=document.getElementById('dolz-list');
  if(!list) return;
  var auto=new Set(['nyse','brasil','europa','cripto']);
  var seen=new Set(); var candidates=[];
  open.forEach(function(p){
    var sec=getSector(p.ticker);
    if(!auto.has(sec)&&!seen.has(p.ticker)){
      seen.add(p.ticker);
      candidates.push({ticker:p.ticker,sector:sec,inv:p._invARS||0});
    }
  });
  candidates.sort(function(a,b){return b.inv-a.inv;});
  if(!candidates.length){
    list.innerHTML='<span style="font-size:.65rem;color:var(--text3)">Sin posiciones en otros sectores</span>';
    return;
  }
  list.innerHTML=candidates.map(function(c){
    var chk=DOLZ_EXTRA.has(c.ticker)?'checked':'';
    return '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:.72rem;color:var(--text)">'
      +'<input type="checkbox" '+chk+' onchange="dolzToggleTicker(\''+c.ticker+'\')" style="accent-color:var(--accent);cursor:pointer">'
      +'<span style="font-family:var(--mono);font-weight:700;flex:0 0 auto">'+c.ticker+'</span>'
      +'<span style="color:var(--text3);font-size:.62rem">('+c.sector+')</span>'
      +'</label>';
  }).join('');
}

async function dolzToggleTicker(ticker){
  if(DOLZ_EXTRA.has(ticker)) DOLZ_EXTRA.delete(ticker); else DOLZ_EXTRA.add(ticker);
  await dolzSave();
  renderPortfolio();
}

// ─── App instalada (PWA) ──────────────────────────────────────────────────────
(function(){
  function standalone(){try{return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;}catch(e){return false;}}
  function add(){
    if(!standalone()||document.getElementById('pwa-home'))return;
    var a=document.createElement('a');a.id='pwa-home';a.href='../index.html';a.textContent='⌂';a.title='Carteras administradas';
    a.style.cssText='position:fixed;left:8px;bottom:6px;z-index:99999;font-size:1.15rem;line-height:1;text-decoration:none;color:var(--text2,#7a9cc5);background:var(--surface2,#172035);border:1px solid var(--border2,#264070);border-radius:6px;padding:6px 10px;opacity:.92';
    document.body.appendChild(a);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
  if('serviceWorker' in navigator){navigator.serviceWorker.register('../sw.js',{scope:'../'}).catch(function(){});}
})();

// ─── Informe para el cliente (CFG.informe) ────────────────────────────────────
var INF_LAST=null;
function _infISO(f){if(!f)return '';f=String(f);if(/^\d{4}-\d{2}-\d{2}/.test(f))return f.slice(0,10);var p=f.split('/');return p.length===3?p[2]+'-'+p[1].padStart(2,'0')+'-'+p[0].padStart(2,'0'):'';}
function _infDMY(iso,corto){var p=iso.split('-');return p[2]+'/'+p[1]+'/'+(corto?p[0].slice(2):p[0]);}
function _infMY(iso){var p=iso.split('-');return p[1]+'/'+p[0].slice(2);}
function _infN(v,d){return (v||0).toLocaleString('es-AR',{minimumFractionDigits:d||0,maximumFractionDigits:d||0});}
function _infPct(v){return (v>=0?'+':'−')+_infN(Math.abs(v),1)+'%';}
function _infEsc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function _infAddDays(iso,n){var d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
function _infAntig(iso){if(!iso)return '—';var m=Math.round((new Date(_hHoy())-new Date(iso))/86400000/30.44);if(m<1)return 'menos de 1 mes';var a=Math.floor(m/12),r=m%12;return (a?a+'a ':'')+(r?r+'m':'').trim();}
var _INF_SECT={nyse:'Acción / Cedear EE.UU.',argentina:'Acción argentina',brasil:'Cedear Brasil',europa:'Cedear Europa',china:'Cedear China',cripto:'Cripto',bonos:'Bono',on:'Obligación negociable',fci:'Fondo común de inversión'};
var _INF_RF=['bonos','on','fci'];
function infInicioAnual(){
  var corte=histUltimoCorte();if(!corte)return null;
  var cerrado=(HIST&&HIST.cierres||[]).some(function(c){return c.d===corte;});
  var dias=(new Date(_hHoy())-new Date(corte))/86400000;
  if(!cerrado&&dias<=45)return (parseInt(corte.slice(0,4),10)-1)+corte.slice(4);
  return corte;
}
function infPeriodos(){
  var per={},pi=CFG.periodoInicio||'01-01';
  Object.keys(CFG.rendAnual||{}).forEach(function(y){per[y]={r:+CFG.rendAnual[y],src:'cargado'};});
  (HIST&&HIST.cierres||[]).forEach(function(cz){if(cz.rendFinal!=null){per[String(parseInt(cz.d.slice(0,4),10)-1)]={r:cz.rendFinal,src:'cierre',cz:cz};}});
  Object.keys(per).forEach(function(y){per[y].ini=y+'-'+pi;per[y].fin=(parseInt(y,10)+1)+'-'+pi;});
  return per;
}
function infValoresPeriodo(p){
  if(p.cz)return {valor:p.cz.valor,base:p.cz.invAnterior||null};
  var hp=(CFG.histPrevio||[]),fin=null,ini=null;
  hp.forEach(function(x){if(x[0]<=p.fin&&x[0]>=_infAddDays(p.fin,-5))fin=x;if(x[0]>=p.ini&&x[0]<=_infAddDays(p.ini,5)&&!ini)ini=x;});
  return {valor:fin?fin[1]:null,base:fin&&fin[2]?fin[2]:(ini?ini[1]:null)};
}
function infAbrir(){
  if(typeof CARTERA_ACTIVA!=='undefined'&&CARTERA_ACTIVA!=='principal'){alert('El informe es de la cartera principal: pasá a esa cartera y volvé a tocar 📄 Informe.');return;}
  if(!INF_LAST){alert('Esperá a que terminen de cargar las cotizaciones y volvé a intentar.');return;}
  var hoy=_hHoy(),ini=infInicioAnual(),per=infPeriodos();
  var ys=Object.keys(per).sort(),ult=ys.length?per[ys[ys.length-1]]:null;
  var com='';try{com=localStorage.getItem(PFX+'inf_coment')||'';}catch(e){}
  var opts=[];
  if(ini)opts.push(['anual','Período en curso · '+_infDMY(ini,true)+' → hoy','Rendimiento del Resumen. Usalo al cierre de cada ciclo, antes de cerrar el período.']);
  if(ult)opts.push(['ultimo','Último año completo · '+_infDMY(ult.ini,true)+' → '+_infDMY(ult.fin,true)+' ('+_infPct(ult.r)+')','El período anual ya cerrado, con el valor de hoy de la cartera.']);
  opts.push(['mes','Último mes · '+_infDMY(_infAddDays(hoy,-30),true)+' → hoy','Variación del valor total según el historial (incluye aportes o retiros).']);
  var ov=document.getElementById('inf-dlg');if(ov)ov.remove();
  ov=document.createElement('div');ov.id='inf-dlg';
  ov.style.cssText='position:fixed;inset:0;z-index:100002;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px';
  ov.innerHTML='<div style="background:var(--surface);border:1px solid var(--border2);border-radius:12px;max-width:540px;width:100%;padding:1rem 1.1rem;font-family:var(--sans);color:var(--text);max-height:92vh;overflow:auto">'+
    '<div style="font-weight:700;font-size:.95rem;margin-bottom:.3rem">📄 Informe para '+_infEsc(CFG.nombre)+'</div>'+
    '<div style="font-family:var(--mono);font-size:.64rem;color:var(--text3);margin-bottom:.7rem">¿Qué período mostrás como "Ganancia del período"? El resto del informe es igual.</div>'+
    opts.map(function(o,i){return '<label style="display:flex;gap:8px;align-items:flex-start;margin-bottom:.55rem;cursor:pointer"><input type="radio" name="inf-modo" value="'+o[0]+'"'+(i===0?' checked':'')+' style="margin-top:3px"><span><span style="font-size:.84rem">'+o[1]+'</span><br><span style="font-family:var(--mono);font-size:.64rem;color:var(--text3)">'+o[2]+'</span></span></label>';}).join('')+
    '<div style="font-family:var(--mono);font-size:.62rem;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin:.8rem 0 .3rem">Comentario (opcional, lo escribís vos)</div>'+
    '<textarea id="inf-com" rows="5" style="width:100%;background:var(--surface2);color:var(--text);border:1px solid var(--border2);border-radius:6px;padding:.5rem;font-family:var(--sans);font-size:.84rem;resize:vertical" placeholder="Qué pasó en el período y qué pensás hacer… (un párrafo por línea en blanco)">'+_infEsc(com)+'</textarea>'+
    '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:.8rem"><button class="btn btn-sm" onclick="document.getElementById(\'inf-dlg\').remove()">Cancelar</button><button class="btn btn-a btn-sm" id="inf-go" onclick="infGenerar()">Generar informe</button></div></div>';
  document.body.appendChild(ov);
}
function infMapaCargar(){
  if(window.MAPA_MUNDO)return Promise.resolve(true);
  return new Promise(function(res){var s=document.createElement('script');s.src='../comun/mapa_mundo.js?v=1';s.onload=function(){res(!!window.MAPA_MUNDO);};s.onerror=function(){res(false);};document.head.appendChild(s);});
}
async function infGenerar(){
  var bt=document.getElementById('inf-go');if(bt){bt.disabled=true;bt.textContent='Armando…';}
  var modo=(document.querySelector('input[name="inf-modo"]:checked')||{}).value||'anual';
  var com=(document.getElementById('inf-com')||{}).value||'';
  try{localStorage.setItem(PFX+'inf_coment',com);}catch(e){}
  var hayMapa=await infMapaCargar();
  var dlg=document.getElementById('inf-dlg');if(dlg)dlg.remove();
  var d=INF_LAST,hoy=_hHoy(),serie=histSerie(),per=infPeriodos();
  var total=(d.totalVal||0)+(d.liqTotalUSD||0);
  var iniAct=infInicioAnual();
  // ── período en curso + ganancia total compuesta
  var yAct=iniAct?iniAct.slice(0,4):null;
  if(yAct&&d.rendPct!=null&&!per[yAct])per[yAct]={r:d.rendPct,src:'curso',ini:iniAct,fin:null};
  var ys=Object.keys(per).sort();
  var acc=1;ys.forEach(function(y){acc*=1+per[y].r/100;});
  var compTxt=ys.length?ys.map(function(y){return _infPct(per[y].r);}).join(' · '):'';
  var desdeIni=ys.length?per[ys[0]].ini:(serie.length?serie[0].d:hoy);
  // ── KPI del período
  var rend=null,gan=null,base=null,perLbl='',sub='';
  if(modo==='ultimo'){
    var yU=ys.filter(function(y){return per[y].src!=='curso';}).pop();var pu=per[yU];var vv=infValoresPeriodo(pu);
    rend=pu.r;base=vv.base;gan=(vv.valor!=null&&vv.base!=null)?vv.valor-vv.base:null;
    perLbl='Ganancia del año';sub=_infDMY(pu.ini,true)+' → '+_infDMY(pu.fin,true);
  } else if(modo==='mes'){
    var m0=_infAddDays(hoy,-30);var p0=serie.filter(function(x){return x.d<=m0;}).pop()||serie.filter(function(x){return x.d>=m0;})[0];
    if(p0&&p0.d<hoy){base=p0.v;gan=total-p0.v;rend=gan/p0.v*100;}
    perLbl='Último mes';sub='incluye aportes o retiros';
  } else {
    rend=d.rendPct!=null?d.rendPct:null;base=d.invInicial||null;gan=(CFG.aportes&&typeof _aporUlt!=='undefined'&&_aporUlt)?_aporUlt.gan:((base&&rend!=null)?base*rend/100:null);
    perLbl='Ganancia del período';sub=iniAct?'desde el '+_infDMY(iniAct):'';
  }
  // ── posiciones
  var pos=(d.pos||[]).filter(function(p){return p.v>0;});
  var nRF=pos.filter(function(p){return _INF_RF.indexOf(p.s)>=0;}).length,nRV=pos.length-nRF;
  var princ=function(x){return !x||!x.cartera||x.cartera==='principal';};
  var movs=(typeof movimientos!=='undefined'?movimientos:[]).filter(function(m){return m&&m.owner!=='cristian'&&princ(m);});
  var primera={};movs.forEach(function(m){if(m.tipo!=='compra')return;var iso=_infISO(m.fecha);if(iso&&(!primera[m.ticker]||iso<primera[m.ticker]))primera[m.ticker]=iso;});
  var d90=_infAddDays(hoy,-91),m3=movs.filter(function(m){var iso=_infISO(m.fecha);return iso>=d90&&(m.tipo==='compra'||m.tipo==='venta');});
  var nC=m3.filter(function(m){return m.tipo==='compra';}).length,nV=m3.length-nC;
  // ── distribución
  var sv=d.sectorVal||{},rv=['nyse','argentina','brasil','europa','china','cripto'].reduce(function(a,k){return a+(sv[k]||0);},0);
  var rf=(sv.bonos||0)+(sv.on||0)+(sv.fci||0),lq=d.liqTotalUSD||0,tt=rv+rf+lq||1;
  var dolz=total>0?Math.min(100,((d.dolzPct||0)/100*(d.totalVal||0)+(d.liqUSD||0))/total*100):null;
  var perfHtml='';
  try{if(typeof PERFIL_TARGETS!=='undefined'&&typeof computePerfilActual==='function'){
    var pd=computePerfilActual();
    if(pd&&pd.totalARS>0){
      var sc=['Conservador','Moderado','Agresivo'].filter(function(n){return PERFIL_TARGETS[n];}).map(function(n){return {n:n,s:computePerfilScore(PERFIL_TARGETS[n],pd).total||0};});
      var best=sc.slice().sort(function(a,b){return b.s-a.s;})[0],cm=PERFIL_TARGETS[best.n].composicion;
      var act={'Renta Variable':pd.rvARS/pd.totalARS*100,'Renta Fija':pd.rfARS/pd.totalARS*100,'Liquidez':pd.liqARS/pd.totalARS*100};
      perfHtml='<div class="perf"><div class="kl">Perfil de inversor según la cartera</div><div class="pn">'+best.n+' <span class="psc">'+Math.round(best.s)+'/100</span></div>'+
        '<div class="pbars">'+sc.map(function(x){var on=x.n===best.n;return '<div class="pbr'+(on?' on':'')+'"><span>'+x.n+'</span><div class="pbt"><i style="width:'+Math.round(x.s)+'%"></i></div><b>'+Math.round(x.s)+'</b></div>';}).join('')+'</div>'+
        '<table><thead><tr><th></th><th class="n">Hoy</th><th class="n">Perfil '+best.n.toLowerCase()+'</th></tr></thead><tbody>'+
        [['Acciones','Renta Variable'],['Renta fija','Renta Fija'],['Liquidez','Liquidez']].map(function(x){var v=act[x[1]],r=cm[x[1]],ok=v>=r[0]-0.5&&v<=r[1]+0.5;
          return '<tr><td>'+x[0]+'</td><td class="n'+(ok?'':' warn')+'">'+Math.round(v)+'%</td><td class="n mut">'+r[0]+'–'+r[1]+'%</td></tr>';}).join('')+'</tbody></table>'+
        '<div class="ps">Puntaje de 0 a 100 según qué tan cerca está la cartera de cada perfil en composición, países y sectores.</div></div>';
    }}}catch(e){console.warn('perfil informe',e);}
  var parts=[['Renta fija','Bonos, ON y FCI',rf,'#2f6fde'],['Acciones','Acciones y Cedears',rv,'#0f9d58'],['Liquidez','Efectivo en pesos y dólares',lq,'#8b5cf6']];
  var a0=-Math.PI/2,segs='';
  parts.forEach(function(p){if(!(p[2]>0))return;var b=a0+p[2]/tt*2*Math.PI,g=p[2]/tt>0.99?0:0.025,a1=a0+g,b1=b-g,lg=(b1-a1)>Math.PI?1:0,R=70,r=46,cx=80,cy=80;
    if(p[2]/tt>0.995){segs+='<circle cx="80" cy="80" r="58" fill="none" stroke="'+p[3]+'" stroke-width="24"/>';a0=b;return;}
    var P=function(an,ra){return (cx+ra*Math.cos(an)).toFixed(1)+' '+(cy+ra*Math.sin(an)).toFixed(1);};
    segs+='<path d="M'+P(a1,R)+' A'+R+' '+R+' 0 '+lg+' 1 '+P(b1,R)+' L'+P(b1,r)+' A'+r+' '+r+' 0 '+lg+' 0 '+P(a1,r)+' Z" fill="'+p[3]+'"/>';a0=b;});
  var donut='<svg viewBox="0 0 160 160" width="150" height="150" role="img" aria-label="Distribución">'+segs+'<text x="80" y="76" text-anchor="middle" font-family="Inter,system-ui" font-size="10" fill="#8a97ad">Total</text><text x="80" y="93" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="13" font-weight="700" fill="#14213d">'+_infN(total/1000,1)+'k</text></svg>';
  var dleg=parts.map(function(p){return '<div class="dl"><i style="background:'+p[3]+'"></i><span>'+p[0]+'</span><b>'+Math.round(p[2]/tt*100)+'%</b><em>US$ '+_infN(p[2])+' · '+p[1]+'</em></div>';}).join('');
  // ── gráfico de evolución desde el inicio
  var pts=serie.filter(function(x){return x.v>0;}),evo='';
  if(pts.length>=2){
    var W0=58,W1=688,Y0=26,Y1=196;
    var vs=[];pts.forEach(function(x){vs.push(x.v);if(x.inv)vs.push(x.inv);});
    var mn=Math.min.apply(null,vs),mx=Math.max.apply(null,vs),pad=(mx-mn)*0.1||mx*0.05;mn=Math.max(0,mn-pad);mx+=pad;
    var t0=new Date(pts[0].d).getTime(),t1=new Date(pts[pts.length-1].d).getTime();
    var X=function(dd){return W0+(new Date(dd).getTime()-t0)/((t1-t0)||1)*(W1-W0);},Y=function(v){return Y1-(v-mn)/(mx-mn)*(Y1-Y0);};
    var kf=function(v){return mx<20000?_infN(v/1000,1)+'k':_infN(v/1000)+'k';};
    var grid=[0,1,2,3].map(function(i){var v=mn+(mx-mn)*(i/3);return '<line x1="'+W0+'" y1="'+Y(v).toFixed(1)+'" x2="'+W1+'" y2="'+Y(v).toFixed(1)+'" stroke="#eef1f6"/><text x="'+(W0-6)+'" y="'+(Y(v)+4).toFixed(1)+'" text-anchor="end">'+kf(v)+'</text>';}).join('');
    var line=pts.map(function(x){return X(x.d).toFixed(1)+','+Y(x.v).toFixed(1);}).join(' ');
    var area='M'+X(pts[0].d).toFixed(1)+' '+Y1+' L'+line.split(' ').join(' L')+' L'+X(pts[pts.length-1].d).toFixed(1)+' '+Y1+' Z';
    var step='',lastInv=null;pts.forEach(function(x){if(!x.inv)return;var xx=X(x.d).toFixed(1);if(lastInv===null)step+='M'+xx+' '+Y(x.inv).toFixed(1)+' ';else if(x.inv!==lastInv)step+='L'+xx+' '+Y(lastInv).toFixed(1)+' L'+xx+' '+Y(x.inv).toFixed(1)+' ';else step+='L'+xx+' '+Y(x.inv).toFixed(1)+' ';lastInv=x.inv;});
    var cortes='',etis='',xl='<text x="'+W0+'" y="216" font-weight="600" fill="#14213d">'+_infMY(pts[0].d)+'</text><text x="'+W1+'" y="216" text-anchor="end" font-weight="600" fill="#14213d">'+_infMY(pts[pts.length-1].d)+'</text>';
    ys.forEach(function(y,i){var p=per[y],xa=Math.max(W0,X(p.ini)),xb=p.fin?Math.min(W1,X(p.fin)):W1;
      if(i>0&&p.ini>pts[0].d&&p.ini<pts[pts.length-1].d){cortes+='<line x1="'+X(p.ini).toFixed(1)+'" y1="'+(Y0-4)+'" x2="'+X(p.ini).toFixed(1)+'" y2="'+Y1+'" stroke="#8a97ad" stroke-dasharray="2 3"/>';
        if(X(p.ini)-W0>40&&W1-X(p.ini)>40)xl+='<text x="'+X(p.ini).toFixed(1)+'" y="216" text-anchor="middle">'+_infMY(p.ini)+'</text>';}
      if(xb-xa>70)etis+='<text x="'+((xa+xb)/2).toFixed(1)+'" y="'+(Y0+2)+'" text-anchor="middle" font-size="11" font-weight="700" fill="'+(p.r>=0?'#0f9d58':'#d93025')+'">'+(p.src==='curso'?'En curso · ':'')+_infPct(p.r)+'</text>';});
    var lx=pts[pts.length-1];
    evo='<div class="box"><div class="lg"><span><i style="border-color:#0f9d58"></i>Valor de la cartera</span><span><i style="border-color:#8a97ad;border-top-style:dashed"></i>Inversión inicial de cada período</span></div>'+
      '<svg viewBox="0 0 700 226" width="100%" role="img" aria-label="Evolución del valor total"><g font-family="Inter,system-ui,sans-serif" font-size="11" fill="#8a97ad">'+grid+xl+cortes+etis+'</g>'+
      '<path d="'+area+'" fill="#0f9d58" opacity=".07"/>'+(step?'<path d="'+step+'" fill="none" stroke="#8a97ad" stroke-width="2" stroke-dasharray="5 4"/>':'')+
      '<polyline points="'+line+'" fill="none" stroke="#0f9d58" stroke-width="2.5" stroke-linejoin="round"/>'+
      '<circle cx="'+X(lx.d).toFixed(1)+'" cy="'+Y(lx.v).toFixed(1)+'" r="5" fill="#0f9d58" stroke="#fff" stroke-width="2"/>'+
      '<text x="'+(X(lx.d)-8).toFixed(1)+'" y="'+(Y(lx.v)-10).toFixed(1)+'" text-anchor="end" font-family="JetBrains Mono,monospace" font-size="12" font-weight="700" fill="#14213d">'+_infN(lx.v)+'</text></svg></div>'+
      '<p class="mini">La distancia entre las dos líneas es lo que ganó la cartera en cada período. Las líneas punteadas verticales marcan los cierres anuales.</p>';
  } else evo='<p class="mini">El historial empezó hace poco: el gráfico se va completando a medida que pasan los días.</p>';
  // ── posiciones más grandes y las que más ganan
  var big=pos.slice().sort(function(a,b){return b.v-a.v;}).slice(0,5),bmax=big.length?big[0].v:1;
  var bigtb=big.map(function(p){return '<tr><td><b>'+_infEsc(p.t)+'</b><span class="nm">'+(_INF_SECT[p.s]||'')+'</span></td><td class="n">US$ '+_infN(p.v)+'</td><td class="bc"><div class="hb"><i style="width:'+(p.v/bmax*100).toFixed(0)+'%;background:'+(_INF_RF.indexOf(p.s)>=0?'#2f6fde':'#0f9d58')+'"></i></div><span>'+_infN(p.v/total*100,1)+'%</span></td></tr>';}).join('');
  var gana=pos.filter(function(p){return p.pnl!=null&&p.pnl>0;}).sort(function(a,b){return b.pnl-a.pnl;}).slice(0,5);
  var ganatb=gana.map(function(p){return '<tr><td><b>'+_infEsc(p.t)+'</b><span class="nm">'+(_INF_SECT[p.s]||'')+'</span></td><td class="n grn">'+_infPct(p.pnl)+'</td><td class="n">US$ '+_infN(p.v)+'</td><td class="n mut">'+_infAntig(primera[p.t])+'</td></tr>';}).join('');
  // ── mapa por país (sobre lo invertido, sin liquidez)
  var reg={usa:sv.nyse||0,arg:(sv.argentina||0)+(sv.bonos||0)+(sv.on||0)+(sv.fci||0),bra:sv.brasil||0,eur:sv.europa||0,chn:sv.china||0},cri=sv.cripto||0;
  var inv=reg.usa+reg.arg+reg.bra+reg.eur+reg.chn+cri||1,mapa='';
  if(hayMapa){
    var ramp=['#dbe6fa','#b3cbf3','#7fa7ea','#4f84de','#2a5fc2','#1a3f8c'];
    var col=function(p){return p<=0?'#e9edf3':ramp[p<2?0:p<5?1:p<15?2:p<30?3:p<50?4:5];};
    var M=window.MAPA_MUNDO,sp='<path d="'+M.otro+'" fill="#e9edf3" stroke="#fff" stroke-width=".5"/>',lb='';
    var L={usa:[173,108,'EE.UU.'],arg:[233,282,'Argentina'],bra:[262,214,'Brasil'],eur:[372,80,'Europa'],chn:[539,117,'China']};
    ['usa','arg','bra','eur','chn'].forEach(function(k){var p=reg[k]/inv*100;sp+='<path d="'+M[k]+'" fill="'+col(p)+'" stroke="#fff" stroke-width=".6"/>';
      if(p>0)lb+='<g font-family="Inter,system-ui,sans-serif" text-anchor="middle"><text x="'+L[k][0]+'" y="'+L[k][1]+'" font-size="13" font-weight="700" fill="#14213d" stroke="#fff" stroke-width="3" paint-order="stroke">'+(p<1?'<1':Math.round(p))+'%</text><text x="'+L[k][0]+'" y="'+(L[k][1]+12)+'" font-size="10" fill="#4a5a78" stroke="#fff" stroke-width="3" paint-order="stroke">'+L[k][2]+'</text></g>';});
    mapa='<h2>Dónde está invertida <small>% de lo invertido por país, sin contar la liquidez</small></h2><div class="box"><svg viewBox="0 0 700 340" width="100%" role="img" aria-label="Porcentaje invertido por país">'+sp+lb+'</svg>'+
      '<div class="ramp">menos '+ramp.map(function(c){return '<i style="background:'+c+'"></i>';}).join('')+' más</div></div>'+
      '<p class="mini">Argentina incluye bonos, obligaciones negociables, fondos y acciones locales. Los Cedears cuentan en el país de la empresa'+(cri>0?'. Cripto ('+_infN(cri/inv*100,1)+'%) no tiene país.':'.')+'</p>';
  }
  // ── estado del ciclo actual: rendimiento en curso y tiempo que falta para el cierre
  var cicloHtml='';
  if(iniAct){
    var finAct=(parseInt(iniAct.slice(0,4),10)+1)+iniAct.slice(4);
    var dTot=(new Date(finAct)-new Date(iniAct))/86400000,dPas=Math.max(0,(new Date(hoy)-new Date(iniAct))/86400000),dRes=Math.max(0,Math.round(dTot-dPas));
    var fr=Math.min(1,dPas/dTot),mRes=dRes/30.44;
    var resTxt=dRes===0?'cierra hoy':dRes<31?'faltan '+dRes+' día'+(dRes!==1?'s':''):'faltan '+_infN(mRes,1).replace(/,0$/,'')+' meses';
    var rc=d.rendPct;
    cicloHtml='<div class="ciclo"><div class="ct"><span class="kl">Ciclo actual</span><b class="'+(rc==null?'':rc>=0?'grn':'red')+'">'+(rc!=null?_infPct(rc):'—')+'</b><span class="cs">de rendimiento hasta hoy</span>'+
      '<span class="cr">'+resTxt+'<br><span class="mut">cierra el '+_infDMY(finAct)+'</span></span></div>'+
      '<div class="pb"><i style="width:'+(fr*100).toFixed(1)+'%"></i></div>'+
      '<div class="pl"><span>'+_infDMY(iniAct)+' · inicio</span><span>'+Math.round(fr*100)+'% del ciclo transcurrido</span><span>'+_infDMY(finAct)+' · cierre</span></div></div>';
  }
  var paras=com.trim()?com.trim().split(/\n\s*\n/).map(function(p){return '<p>'+_infEsc(p).replace(/\n/g,'<br>')+'</p>';}).join(''):'';
  var tc=(typeof MEP_HOY!=='undefined'&&MEP_HOY)||CCL_HOY;
  var kpi=function(l,v,s,c,h){return '<div class="k'+(h?' hero':'')+'"><div class="kl">'+l+'</div><div class="kv'+(c?' '+c:'')+'">'+v+'</div><div class="ks">'+(s||'')+'</div></div>';};
  var html='<div class="inf-page">'+
    '<header><div class="av">'+_infEsc(CFG.nombre.charAt(0))+'</div><div><h1>Tu cartera de inversiones</h1><div class="sub">'+(modo==='ultimo'?'Informe anual · '+sub:modo==='mes'?'Informe del último mes':'Informe del período '+(iniAct?_infDMY(iniAct)+' → hoy':''))+'</div></div>'+
    '<div class="right">'+_infEsc(CFG.nombre)+'<br>Datos al '+_infDMY(hoy)+'<br>Inversiones desde '+_infMY(desdeIni)+'</div></header>'+
    '<p class="hello">Hola '+_infEsc(CFG.nombre)+', este es el resumen de cómo viene tu cartera.</p>'+
    '<div class="kpis">'+
      kpi('Valor total de la cartera','US$ '+_infN(total),tc?'≈ $ '+_infN(total*tc/1e6,1)+' M al dólar MEP':'','',true)+
      kpi(perLbl,rend!=null?_infPct(rend):'—',(gan!=null?(gan>=0?'+':'−')+'US$ '+_infN(Math.abs(gan))+' · ':'')+sub,rend==null?'':rend>=0?'grn':'red')+
      kpi('Ganancia total',ys.length?_infPct((acc-1)*100):'—',ys.length?'compuesta desde '+_infMY(desdeIni)+'<br>('+compTxt+')':'',acc>=1?'grn':'red')+
      kpi('Activos en cartera',String(pos.length),nRF+' de renta fija · '+nRV+' acciones')+
      kpi('Movimientos',String(m3.length),'en los últimos 3 meses<br>'+nC+' compra'+(nC!==1?'s':'')+' · '+nV+' venta'+(nV!==1?'s':''))+
    '</div>'+cicloHtml+
    '<h2>Cómo fue evolucionando <small>desde el inicio de las inversiones, en dólares</small></h2>'+evo+
    '<div class="cols"><div><h2>En qué está invertida</h2><div class="dist">'+donut+'<div style="flex:1">'+dleg+'</div></div>'+
      (dolz!=null?'<p class="mini">El '+Math.round(dolz)+'% está en dólares o atado al dólar.</p>':'')+perfHtml+'</div>'+
      '<div><h2>Posiciones más grandes</h2>'+(bigtb?'<table><thead><tr><th>Activo</th><th class="n">Valor</th><th class="n">% cartera</th></tr></thead><tbody>'+bigtb+'</tbody></table>':'<p class="mini">Sin posiciones.</p>')+'</div></div>'+
    mapa+
    (ganatb?'<h2>Las que más están ganando <small>en %, en dólares</small></h2><table><thead><tr><th>Activo</th><th class="n">Ganancia</th><th class="n">Valor</th><th class="n">Desde hace</th></tr></thead><tbody>'+ganatb+'</tbody></table>':'')+
    (paras?'<h2>Comentario</h2><div class="note">'+paras+'</div>':'')+
    '<footer>Valores en dólares a precio de mercado del '+_infDMY(hoy)+'; los activos en pesos se pasan a dólares al tipo de cambio del día. '+
      'La ganancia de cada período se mide contra la inversión inicial de ese período y la ganancia total compone los rendimientos de todos los períodos. '+
      'Las rentabilidades pasadas no garantizan resultados futuros. Ante cualquier duda, escribime.</footer></div>';
  infMostrar(html);
}
function infMostrar(html){
  if(!document.getElementById('inf-css')){var st=document.createElement('style');st.id='inf-css';st.textContent=
    '#inf-view{position:fixed;inset:0;z-index:100001;overflow:auto;background:#f5f7fb;--ink:#14213d;--ink2:#4a5a78;--ink3:#8a97ad;--line:#e3e8f0;--grn:#0f9d58;--red:#d93025;--blue:#2f6fde;color:var(--ink);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.45;padding:16px}'+
    '#inf-bar{max-width:780px;margin:0 auto 10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}#inf-bar button{font:inherit;font-size:.82rem;border-radius:8px;padding:.45rem .9rem;cursor:pointer;border:1px solid #c9d3e3;background:#fff;color:#14213d}#inf-bar .pri{background:#14213d;color:#fff;border-color:#14213d}#inf-bar span{font-size:.72rem;color:#8a97ad;margin-left:auto}'+
    '#inf-view .inf-page{max-width:780px;margin:0 auto;background:#fff;border:1px solid var(--line);border-radius:14px;padding:30px 34px}'+
    '#inf-view header{display:flex;align-items:flex-start;gap:14px;border-bottom:2px solid var(--ink);padding-bottom:14px;margin-bottom:20px;background:none;position:static}'+
    '#inf-view .av{width:46px;height:46px;border-radius:50%;background:#e8eefb;display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--blue);font-size:1.2rem;flex-shrink:0}'+
    '#inf-view h1{font-size:1.35rem;margin:0;color:var(--ink)}#inf-view .sub{color:var(--ink2);font-size:.82rem;margin-top:2px}#inf-view .right{margin-left:auto;text-align:right;font-size:.75rem;color:var(--ink3)}'+
    '#inf-view .hello{font-size:.92rem;margin:0 0 18px}#inf-view .kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:9px;margin-bottom:8px}'+
    '#inf-view .k{border:1px solid var(--line);border-radius:10px;padding:.7rem .75rem}#inf-view .k.hero{background:#14213d;border-color:#14213d}#inf-view .k.hero .kl,#inf-view .k.hero .ks{color:#b9c4d8}#inf-view .k.hero .kv{color:#fff}'+
    '#inf-view .kl{font-size:.6rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em;font-weight:600}'+
    '#inf-view .kv{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:1.15rem;font-weight:700;margin-top:4px;color:var(--ink)}#inf-view .ks{font-size:.66rem;color:var(--ink2);margin-top:3px}'+
    '#inf-view .grn{color:var(--grn)}#inf-view .red{color:var(--red)}#inf-view .mut{color:var(--ink3)}#inf-view .kv.grn{color:var(--grn)}#inf-view .kv.red{color:var(--red)}'+
    '#inf-view h2{font-size:.98rem;margin:26px 0 8px;color:var(--ink)}#inf-view h2 small{font-weight:400;color:var(--ink3);font-size:.74rem;margin-left:6px}'+
    '#inf-view .box{border:1px solid var(--line);border-radius:10px;padding:10px 12px}#inf-view .lg{display:flex;gap:18px;flex-wrap:wrap;font-size:.74rem;color:var(--ink2);margin:2px 4px 6px}#inf-view .lg i{display:inline-block;width:16px;height:0;border-top:2.5px solid;vertical-align:middle;margin-right:6px}'+
    '#inf-view .cols{display:grid;grid-template-columns:1fr 1fr;gap:20px}#inf-view .dist{display:flex;align-items:center;gap:14px}'+
    '#inf-view .dl{display:grid;grid-template-columns:12px 1fr auto;column-gap:8px;align-items:baseline;font-size:.82rem;margin:6px 0}#inf-view .dl i{width:10px;height:10px;border-radius:2px;display:inline-block}#inf-view .dl b{font-family:"JetBrains Mono",monospace}#inf-view .dl em{grid-column:2/4;font-style:normal;font-size:.68rem;color:var(--ink3)}'+
    '#inf-view .mini{font-size:.74rem;color:var(--ink2);margin:6px 2px 0}#inf-view table{width:100%;border-collapse:collapse;font-size:.8rem}'+
    '#inf-view th{font-size:.62rem;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;text-align:left;padding:.3rem .45rem;border-bottom:1px solid var(--line);font-weight:600;background:none;position:static}'+
    '#inf-view td{padding:.42rem .45rem;border-bottom:1px solid var(--line);color:var(--ink);background:none;font-family:inherit;vertical-align:middle}#inf-view td.n,#inf-view th.n{text-align:right;font-family:"JetBrains Mono",ui-monospace,monospace;white-space:nowrap}#inf-view tr:last-child td{border-bottom:none}'+
    '#inf-view td.grn{color:var(--grn)}#inf-view td.mut{color:var(--ink3)}#inf-view .nm{display:block;font-size:.68rem;color:var(--ink3)}'+
    '#inf-view .bc{width:36%}#inf-view .bc .hb{display:inline-block;width:calc(100% - 46px);height:8px;background:#f0f3f8;border-radius:4px;vertical-align:middle;overflow:hidden}#inf-view .hb i{display:block;height:100%;border-radius:4px}#inf-view .bc span{display:inline-block;width:42px;text-align:right;font-family:"JetBrains Mono",monospace;font-size:.74rem}'+
    '#inf-view .ramp{display:flex;align-items:center;gap:6px;font-size:.68rem;color:var(--ink3);margin:4px 6px 2px}#inf-view .ramp i{width:26px;height:8px;display:inline-block}'+
    '#inf-view .ciclo{border:1px solid var(--line);border-radius:10px;padding:.7rem .85rem;margin-top:9px}#inf-view .ct{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}#inf-view .ct b{font-family:"JetBrains Mono",monospace;font-size:1.15rem}#inf-view .cs{font-size:.74rem;color:var(--ink2)}#inf-view .cr{margin-left:auto;text-align:right;font-size:.8rem;font-weight:600;line-height:1.3}#inf-view .cr .mut{font-weight:400;font-size:.68rem}'+
    '#inf-view .pb{height:8px;background:#f0f3f8;border-radius:4px;overflow:hidden;margin:8px 0 4px}#inf-view .pb i{display:block;height:100%;background:#14213d;border-radius:4px;-webkit-print-color-adjust:exact;print-color-adjust:exact}#inf-view .pl{display:flex;justify-content:space-between;gap:8px;font-size:.66rem;color:var(--ink3)}'+
    '#inf-view .perf{border:1px solid var(--line);border-radius:10px;padding:.65rem .8rem;margin-top:12px}#inf-view .perf .pn{font-size:1.1rem;font-weight:700;margin-top:2px}#inf-view .perf .ps{font-size:.66rem;color:var(--ink3);margin-top:6px}#inf-view .perf .psc{font-family:"JetBrains Mono",monospace;font-size:.78rem;color:var(--ink3);font-weight:600}#inf-view .pbars{margin:6px 0 4px}#inf-view .pbr{display:grid;grid-template-columns:86px 1fr 26px;gap:8px;align-items:center;font-size:.72rem;color:var(--ink3);margin:3px 0}#inf-view .pbr b{font-family:"JetBrains Mono",monospace;text-align:right;font-weight:600}#inf-view .pbt{height:6px;background:#f0f3f8;border-radius:3px;overflow:hidden}#inf-view .pbt i{display:block;height:100%;background:#b9c4d8;border-radius:3px;-webkit-print-color-adjust:exact;print-color-adjust:exact}#inf-view .pbr.on{color:var(--ink);font-weight:600}#inf-view .pbr.on .pbt i{background:#14213d}#inf-view .perf td,#inf-view .perf th{padding:.25rem .4rem}#inf-view td.warn{color:#b7791f;font-weight:700}'+
    '#inf-view .note{background:#f7f9fc;border-left:3px solid var(--blue);border-radius:0 8px 8px 0;padding:.75rem .95rem;font-size:.86rem}#inf-view .note p{margin:0 0 .5rem}#inf-view .note p:last-child{margin:0}'+
    '#inf-view footer{margin-top:24px;padding-top:12px;border-top:1px solid var(--line);font-size:.68rem;color:var(--ink3);line-height:1.55;background:none;position:static}'+
    '@media(max-width:700px){#inf-view .kpis{grid-template-columns:1fr 1fr}#inf-view .k.hero{grid-column:1/3}#inf-view .inf-page{padding:22px 16px}#inf-view .cols{grid-template-columns:1fr}#inf-view .right{display:none}}'+
    '@media print{body>*:not(#inf-view){display:none!important}#inf-view{position:static;overflow:visible;background:#fff;padding:0}#inf-bar{display:none!important}#inf-view .inf-page{border:none;padding:0;max-width:none}#inf-view .k.hero{-webkit-print-color-adjust:exact;print-color-adjust:exact}#inf-view .box,#inf-view tr,#inf-view .k{break-inside:avoid}@page{margin:12mm}}';
    document.head.appendChild(st);}
  var v=document.getElementById('inf-view');if(v)v.remove();
  v=document.createElement('div');v.id='inf-view';
  v.innerHTML='<div id="inf-bar"><button class="pri" onclick="infImprimir()">🖨 Imprimir / Guardar PDF</button><button onclick="infAbrir()">✎ Cambiar</button><button onclick="document.getElementById(\'inf-view\').remove()">✕ Cerrar</button><span>Revisalo y mandalo vos cuando quieras</span></div>'+html;
  document.body.appendChild(v);v.scrollTop=0;
}
function infImprimir(){var t=document.title;document.title='Informe '+CFG.nombre+' '+_hHoy();window.print();setTimeout(function(){document.title=t;},1500);}

// ─── Importar cobros desde Cocos (texto pegado) ───────────────────────────────
function cocosParseCobros(texto){
  var L=String(texto||'').split(/\r?\n/).map(function(s){return s.trim();}).filter(Boolean);
  var reF=/^(\d{2})\/(\d{2})\/(\d{4})$/,out=[],sk={cero:0,sinTicker:[],otro:0,noLiq:0};
  var num=function(s){s=String(s).replace(/[^\d,.\-]/g,'');if(s.indexOf(',')>=0)s=s.replace(/\./g,'').replace(',','.');return parseFloat(s);};
  for(var i=0;i+6<L.length;i++){
    if(!reF.test(L[i])||!reF.test(L[i+1]))continue;
    var op=L[i+2],esp=L[i+3].toUpperCase(),est=L[i+4],tot=L[i+6];
    var esDiv=/^dividendo/i.test(op),esRen=/renta|amortiz/i.test(op);
    if(!esDiv&&!esRen){sk.otro++;i+=6;continue;}
    if(!/liquidad/i.test(est)){sk.noLiq++;i+=6;continue;}
    var mon=/US\$/i.test(tot)?'USD':'ARS',monto=num(tot);
    var m=L[i+1].match(reF),fecha=m[3]+'-'+m[2]+'-'+m[1];
    i+=6;
    if(!(monto>0)){sk.cero++;continue;}
    if(esp==='ARS'||esp==='USD'||esp==='EXT'){sk.sinTicker.push({fecha:fecha,ticker:esp,moneda:mon,monto:monto});continue;}
    out.push({fecha:fecha,ticker:esp,tipo:esRen?'RENTA':'DIV',moneda:mon,monto:Math.round(monto*100)/100,acciones:null,descr:esp+' — Cocos: '+op});
  }
  var ren={};out.forEach(function(r){if(r.tipo==='RENTA')ren[r.ticker]=1;});
  out.forEach(function(r){if(ren[r.ticker])r.tipo='RENTA';});
  return {rows:out,skip:sk};
}
function _cocosYaCargado(r){
  var t=new Date(r.fecha).getTime();
  return (TRK.divs||[]).some(function(d){
    if(d.ticker!==r.ticker||d.moneda!==r.moneda||Math.abs((+d.monto||0)-r.monto)>0.005)return false;
    var f=_infISO?_infISO(d.fecha):d.fecha;return Math.abs(new Date(f).getTime()-t)<=10*86400000;});
}
function cocosImportar(){
  var ta=document.getElementById('cocos-txt'),st=document.getElementById('cocos-status');
  var res=cocosParseCobros(ta&&ta.value);
  if(!res.rows.length&&!res.skip.cero&&!res.skip.sinTicker.length){st.className='emsg';st.textContent='No encontré cobros en el texto. Copiá el listado de Movimientos de Cocos (Dividendos / Rentas y Amortización) y pegalo entero.';return;}
  var nuevos=res.rows.filter(function(r){return !_cocosYaCargado(r);}),ya=res.rows.length-nuevos.length;
  var q=trkQueuePendingRows(nuevos);
  var st2=[q.added+' nuevo(s) a "Pendientes de revisión"'];
  if(ya+q.dup)st2.push((ya+q.dup)+' ya estaban cargados');
  if(res.skip.cero)st2.push(res.skip.cero+' con monto 0 (bajas de nominales)');
  if(res.skip.sinTicker.length)st2.push(res.skip.sinTicker.length+' sin ticker (ARS/USD/EXT) no se cargan');
  st.className='smsg';st.textContent=st2.join(' · ');
  if(q.added&&ta)ta.value='';
}
function trkPendingConfirmAll(){
  var pend=TRK.divs.filter(function(d){return d.estado==='pendiente';});
  if(!pend.length)return;
  if(!confirm('¿Cargar los '+pend.length+' pendientes?\n\nLos que no tengan CCL para su fecha quedan pendientes.'))return;
  var ok=0,no=0;
  pend.forEach(function(d){var conv=_trkImpMontoUSD(d);if(!conv.ok){no++;return;}var pv=_trkImpPPCPreview(d);
    d.montoUSD=conv.montoUSD;d.cclUsado=conv.cclUsado;d.pncApplied=pv.target==='ppc'||pv.target==='venta';d.pncTarget=pv.target;delete d.estado;ok++;});
  trkSave();trkRender();renderPortfolio();
  if(no)alert(ok+' cargados. '+no+' quedaron pendientes porque falta el CCL de su fecha.');
}
function cocosUISetup(){
  var tb=document.getElementById('trk-tbody');if(!tb)return;
  var tabla=tb.closest('.card');if(!tabla||!tabla.parentNode)return;
  var pc=document.getElementById('trk-pending-card');
  if(!pc){pc=document.createElement('div');pc.className='card';pc.id='trk-pending-card';pc.style.display='none';
    pc.innerHTML='<div class="card-header"><span class="card-title">⏳ Pendientes de revisión</span><span id="trk-pending-badge" class="smsg"></span></div>'+
      '<div class="card-body" style="padding-top:0"><div class="tw" style="max-height:340px;overflow-y:auto"><table><thead><tr><th>Ticker</th><th>Fecha</th><th>Tipo</th><th>Mon.</th><th style="text-align:right">Monto</th><th>Impacto PPC</th><th style="text-align:center">Acción</th></tr></thead><tbody id="trk-pending-tbody"></tbody></table></div></div>';
    tabla.parentNode.insertBefore(pc,tabla);}
  var hd=pc.querySelector('.card-header');
  if(hd&&!document.getElementById('trk-pend-all')){var b=document.createElement('button');b.id='trk-pend-all';b.className='btn btn-a btn-sm';b.style.marginLeft='auto';b.textContent='✓ Cargar todos';b.setAttribute('onclick','trkPendingConfirmAll()');hd.appendChild(b);}
  if(!document.getElementById('cocos-card')){var c=document.createElement('div');c.className='card';c.id='cocos-card';
    c.innerHTML='<div class="card-header"><span class="card-title">📋 Importar cobros desde Cocos</span><button class="card-toggle" onclick="cardToggle(this)">▾</button></div>'+
      '<div class="card-body"><div style="font-size:.7rem;color:var(--text3);font-family:var(--mono);margin-bottom:6px">En Cocos → Movimientos, filtrá Dividendos y Rentas y Amortización, copiá el listado y pegalo acá. Los nuevos quedan en "Pendientes de revisión" para que los confirmes.</div>'+
      '<textarea id="cocos-txt" rows="4" style="width:100%;background:var(--surface2);color:var(--text);border:1px solid var(--border2);border-radius:6px;padding:.5rem;font-family:var(--mono);font-size:.72rem" placeholder="2 de oct&#10;02/10/2026&#10;02/10/2026&#10;Dividendos&#10;NKE&#10;Liquidado&#10;0,13&#10;US$0,13"></textarea>'+
      '<div style="display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap"><button class="btn btn-a btn-sm" onclick="cocosImportar()">Procesar</button><span id="cocos-status" class="smsg"></span></div></div>';
    pc.parentNode.insertBefore(c,pc);}
  if(typeof trkRenderPending==='function')trkRenderPending();
}
(function(){var go=function(){try{cocosUISetup();}catch(e){console.warn('cocosUISetup',e);}};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();

// ─── Fechas de Tipo de cambio: las barras se ponen solas ─────────────────────
function tcFechaMask(el){
  var d=el.value.replace(/\D/g,'').slice(0,8),o=d.slice(0,2);
  if(d.length>2)o+='/'+d.slice(2,4);if(d.length>4)o+='/'+d.slice(4);
  if((d.length===2||d.length===4)&&el.value.length>(el._prevLen||0))o+='/';
  el.value=o;el._prevLen=o.length;
}
(function(){
  function setup(){['ccl','mep'].forEach(function(t){
    var f=document.getElementById('tc-'+t+'-fecha'),v=document.getElementById('tc-'+t+'-valor');if(!f||f._mask)return;f._mask=1;
    f.setAttribute('inputmode','numeric');f.setAttribute('maxlength','10');f.setAttribute('autocomplete','off');
    f.addEventListener('input',function(){tcFechaMask(f);});
    f.addEventListener('keydown',function(e){if(e.key==='Enter'&&v){e.preventDefault();v.focus();}});
    if(v)v.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();tcSave(t);f.focus();}});
  });}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();

// ─── "Desde tu última visita" ─────────────────────────────────────────────────
var _uvCerrado=false,_uvHid=null;
// Si la pestaña queda abierta (GDC suele estar siempre abierta), la "visita" se corta al ocultarla: al volver después de 30 min
// se compara contra cómo estaba cuando la dejaste de mirar.
document.addEventListener('visibilitychange',function(){try{
  if(document.hidden){_uvHid={ts:Date.now(),act:JSON.parse(localStorage.getItem(PFX+'uv_act')||'null')};return;}
  var h=_uvHid;_uvHid=null;if(!h||!h.act||Date.now()-h.ts<30*60000)return;
  localStorage.setItem(PFX+'uv_prev',JSON.stringify(h.act));_uvCerrado=false;if(typeof INF_LAST!=='undefined'&&INF_LAST)uvActualizar(INF_LAST);}catch(e){}});
function uvActualizar(d){
  if(typeof CARTERA_ACTIVA!=='undefined'&&CARTERA_ACTIVA!=='principal')return;
  var now=Date.now(),tot=(d.totalVal||0)+(d.liqTotalUSD||0),pr={};
  (d.pos||[]).forEach(function(p){if(p.q>0&&p.v>0)pr[p.t]=p.v/p.q;});
  var act=null,prev=null;try{act=JSON.parse(localStorage.getItem(PFX+'uv_act')||'null');prev=JSON.parse(localStorage.getItem(PFX+'uv_prev')||'null');}catch(e){}
  var nueva=false;try{nueva=!sessionStorage.getItem(PFX+'uv_ses');sessionStorage.setItem(PFX+'uv_ses','1');}catch(e){}
  if(act&&nueva&&now-act.ts>30*60000){prev=act;try{localStorage.setItem(PFX+'uv_prev',JSON.stringify(prev));}catch(e){}}
  try{localStorage.setItem(PFX+'uv_act',JSON.stringify({ts:now,tot:tot,pr:pr}));}catch(e){}
  if(prev&&!_uvCerrado)uvMostrar(prev,tot,pr);
}
function uvMostrar(prev,tot,pr){
  var ref=(CFG.vistaNueva&&document.querySelector('#nv-root .nvdist'))||document.getElementById('pventa-alert')||document.getElementById('top-cards-row');if(!ref||!ref.parentNode)return;
  var cuando=(function(){var s=(Date.now()-prev.ts)/1000;if(s<86400){var h=Math.round(s/3600);return h<=1?'hace un rato':'hace '+h+' horas';}var dd=Math.round(s/86400);
    if(dd===1)return 'ayer';if(dd<7)return 'el '+['domingo','lunes','martes','miércoles','jueves','viernes','sábado'][new Date(prev.ts).getDay()];return 'hace '+dd+' días';})();
  var dv=prev.tot>0?(tot/prev.tot-1)*100:null,du=tot-prev.tot;
  var mv=Object.keys(pr).filter(function(t){return prev.pr&&prev.pr[t]>0;}).map(function(t){return {t:t,c:(pr[t]/prev.pr[t]-1)*100};}).filter(function(x){return Math.abs(x.c)>=1;});
  var up=mv.filter(function(x){return x.c>0;}).sort(function(a,b){return b.c-a.c;}).slice(0,3),dn=mv.filter(function(x){return x.c<0;}).sort(function(a,b){return a.c-b.c;}).slice(0,3);
  var nuevos=Object.keys(pr).filter(function(t){return !prev.pr||!prev.pr[t];}),vend=Object.keys(prev.pr||{}).filter(function(t){return !pr[t];});
  var desde=new Date(prev.ts).toISOString().slice(0,10),cob=0,ncob=0;
  (TRK.divs||[]).forEach(function(x){if(x.estado==='pendiente')return;var f=String(x.fecha||'');if(f.indexOf('/')>0){var a=f.split('/');f=a[2]+'-'+a[1].padStart(2,'0')+'-'+a[0].padStart(2,'0');}
    if(f>=desde&&(!x.cartera||x.cartera==='principal')){var u=divUSD(x);if(u>0){cob+=u;ncob++;}}});
  if(dv==null||(Math.abs(dv)<0.05&&!mv.length&&!ncob&&!nuevos.length&&!vend.length))return;
  var pc=function(v){return (v>=0?'+':'−')+Math.abs(v).toFixed(1).replace('.',',')+'%';};
  var ch=function(x){return '<b style="color:'+(x.c>=0?'var(--accent)':'var(--red)')+'">'+x.t+' '+pc(x.c)+'</b>';};
  var partes=['<b style="color:'+(dv>=0?'var(--accent)':'var(--red)')+'">'+pc(dv)+'</b> <span class="port-sensitive">('+(du>=0?'+':'−')+'USD '+Math.round(Math.abs(du)).toLocaleString('es-AR')+')</span>'];
  if(up.length)partes.push('subieron '+up.map(ch).join(', '));
  if(dn.length)partes.push('bajaron '+dn.map(ch).join(', '));
  if(ncob)partes.push('cobró <span class="port-sensitive">USD '+(Math.round(cob*100)/100).toLocaleString('es-AR')+'</span> ('+ncob+' cobro'+(ncob>1?'s':'')+')');
  if(nuevos.length)partes.push('nuevas: '+nuevos.slice(0,4).join(', ')+(nuevos.length>4?'…':''));
  if(vend.length)partes.push('ya no están: '+vend.slice(0,4).join(', ')+(vend.length>4?'…':''));
  var el=document.getElementById('uv-banner');if(el)el.remove();
  el=document.createElement('div');el.id='uv-banner';
  el.style.cssText='margin-bottom:.7rem;padding:.5rem .8rem;border:1px solid var(--border2);border-radius:var(--rsm);background:var(--surface2);font-size:.76rem;color:var(--text2);font-family:var(--mono);display:flex;gap:10px;align-items:flex-start;max-width:1100px';
  el.innerHTML='<span style="flex:1;line-height:1.6">🕑 <span style="color:var(--text)">Desde tu última visita ('+cuando+'):</span> '+partes.join(' · ')+'</span><span onclick="_uvCerrado=true;this.parentNode.remove()" style="cursor:pointer;color:var(--text3)" title="Cerrar">✕</span>';
  ref.parentNode.insertBefore(el,ref);
}

// ─── Control de ratios de Cedears ─────────────────────────────────────────────
var RT_SOSP={},_rtCorriendo=false,_rtProgramado=false;
try{var _rtS=JSON.parse(localStorage.getItem(PFX+'rt_sosp')||'null');if(_rtS&&_rtS.d)RT_SOSP=_rtS.s||{};}catch(e){}
function _rtCedears(){
  var out=[];try{getPositions().forEach(function(p){if(!(p.qty>0.000001))return;var s=getSector(p.ticker);
    if(['nyse','brasil','europa','china','cripto'].indexOf(s)<0||BRL_TICKERS.has(p.ticker))return;
    var q=quotes[p.ticker];if(q&&q.fromByma&&q.price>0)out.push(p.ticker);});}catch(e){}
  return out;
}
function ratiosAuto(){
  if(_rtProgramado)return;_rtProgramado=true;
  var hoy=_hHoy?_hHoy():new Date().toISOString().slice(0,10),ult='';try{ult=localStorage.getItem(PFX+'rt_check')||'';}catch(e){}
  rtBanner();
  if(ult===hoy)return;
  setTimeout(function(){ratiosVerificar(false);},20000);
}
async function ratiosVerificar(manual){
  if(_rtCorriendo)return;_rtCorriendo=true;
  var bt=document.getElementById('rt-btn');if(bt)bt.textContent='verificando…';
  var tks=_rtCedears(),nuevo={},ok=0;
  for(var i=0;i<tks.length;i++){
    var t=tks[i];
    try{
      var f=await fetchFinnhub(getFinnhubTicker(t));var usd=f&&f.price,ars=quotes[t]&&quotes[t].price,r=getRatio(t);
      if(usd>0&&ars>0&&CCL_HOY>0){ok++;var sug=usd*CCL_HOY/ars,dev=r/sug-1;
        if(Math.abs(dev)>0.25)nuevo[t]={r:r,sug:sug,ars:ars,usd:usd,ccl:CCL_HOY};}
    }catch(e){}
    await new Promise(function(res){setTimeout(res,1100);});
  }
  if(ok){RT_SOSP=nuevo;try{localStorage.setItem(PFX+'rt_sosp',JSON.stringify({d:_hHoy(),s:RT_SOSP}));localStorage.setItem(PFX+'rt_check',_hHoy());}catch(e){}}
  _rtCorriendo=false;rtBanner(manual?(ok?'Verificados '+ok+' Cedears':'No se pudo consultar NYSE'):null);
}
function rtIgnorar(t){try{var ig=JSON.parse(localStorage.getItem(PFX+'rt_ign')||'{}');ig[t]=getRatio(t);localStorage.setItem(PFX+'rt_ign',JSON.stringify(ig));}catch(e){}rtBanner();}
function rtBanner(msg){
  var pg=document.getElementById('page-portafolio');if(!pg)return;
  var ig={};try{ig=JSON.parse(localStorage.getItem(PFX+'rt_ign')||'{}');}catch(e){}
  var L=Object.keys(RT_SOSP).filter(function(t){return ig[t]!==getRatio(t)&&RT_SOSP[t].r===getRatio(t);});
  var el=document.getElementById('rt-alert');
  if(!L.length&&!msg){if(el)el.remove();return;}
  if(!el){el=document.createElement('div');el.id='rt-alert';}
  if(el.parentNode!==pg||pg.lastElementChild!==el)pg.appendChild(el);
  el.style.cssText='margin:1rem 0 .7rem;padding:.5rem .8rem;border:1px solid '+(L.length?'var(--amber,#eab308)':'var(--border2)')+';border-radius:var(--rsm);background:'+(L.length?'rgba(234,179,8,.08)':'var(--surface2)')+';font-size:.74rem;color:var(--text);font-family:var(--mono);max-width:1100px;line-height:1.7';
  var nice=function(x){if(x<1){var n=Math.round(1/x);return (Math.round(x*100)/100).toString().replace('.',',')+' (1 Cedear = '+n+' acciones)';}return x<2?(Math.round(x*10)/10).toString().replace('.',','):Math.round(x);};
  var esGDC=CFG.id==='gdc';
  el.innerHTML=(L.length?'⚠ <b>Posible ratio desactualizado</b> — el precio del Cedear no cierra con NYSE y el CCL:<br>'+
    L.map(function(t){var x=RT_SOSP[t];return '<span style="display:inline-block;margin-right:14px"><b>'+t+'</b>: la app usa <b>'+x.r+'</b>, el mercado indica <b>≈'+nice(x.sug)+'</b> '+
      '<span style="color:var(--text3)">(Cedear $'+Math.round(x.ars).toLocaleString('es-AR')+' · NYSE USD '+x.usd.toLocaleString('es-AR',{maximumFractionDigits:2})+' · CCL '+Math.round(x.ccl)+')</span> '+
      '<span onclick="rtIgnorar(\''+t+'\')" style="cursor:pointer;color:var(--text3);text-decoration:underline dotted" title="El ratio está bien, no avisar más mientras no cambie">ignorar</span></span>';}).join('')+
    '<br><span style="color:var(--text3)">'+(esGDC?'Corregilo en <span onclick="showPage(\'ratios\')" style="cursor:pointer;text-decoration:underline">Ratios</span> y después hacé Sync para los demás.':'Los ratios se corrigen en GDC (Ratios) y llegan acá con el Sync.')+'</span> ':'✓ Ratios de Cedears OK. ')+
    (msg?'<span style="color:var(--text3)">'+msg+'</span> ':'')+
    '<span id="rt-btn" onclick="ratiosVerificar(true)" style="cursor:pointer;color:var(--text3);text-decoration:underline dotted">verificar ahora</span>'+
    (!L.length?' <span onclick="this.parentNode.remove()" style="cursor:pointer;color:var(--text3)">✕</span>':'');
}

// ─── Atajos de teclado ────────────────────────────────────────────────────────
function _kbIr(ids){
  for(var i=0;i<ids.length;i++){var id=ids[i];if(!document.getElementById('page-'+id))continue;
    var nav=Array.prototype.find.call(document.querySelectorAll('.nav-item'),function(n){return (n.getAttribute('onclick')||'').indexOf("'"+id+"'")>=0;});
    if(nav)nav.click();else if(typeof showPage==='function')showPage(id,null);return true;}
  return false;
}
function _kbFoco(id){setTimeout(function(){var e=document.getElementById(id);if(e){e.focus();if(e.select)e.select();}},60);}
function kbOperar(id){
  _kbIr(['portafolio']);
  if(CFG.vistaNueva&&document.getElementById('nv-ops')&&typeof nvModo==='function')nvModo(id==='vsell-ticker'?'v':'c');
  setTimeout(function(){
    var el=document.getElementById(id);if(!el)return;
    if(id==='vsell-ticker'&&typeof vsellPopulateSelect==='function'){try{vsellPopulateSelect();}catch(e){}}
    var card=el.closest('.card');
    if(card&&card.classList.contains('card-collapsed')){var tg=card.querySelector('.card-toggle');if(tg)cardToggle(tg);else card.classList.remove('card-collapsed');}
    var p=el.parentNode;while(p&&p!==document.body){if(p.style&&p.style.display==='none')p.style.display='';p=p.parentNode;}
    (card||el).scrollIntoView({behavior:'smooth',block:'center'});
    setTimeout(function(){el.focus({preventScroll:true});if(el.select)el.select();
      if(card){card.style.transition='box-shadow .3s';card.style.boxShadow='0 0 0 2px var(--accent)';setTimeout(function(){card.style.boxShadow='';},1200);}},350);
  },80);
}
function kbAyuda(){
  var ov=document.getElementById('kb-help');if(ov){ov.remove();return;}
  var L=[['P','Portafolio'],['C','Comprar (recuadro Comprar, en el ticker)'],['V','Vender (recuadro Vender, en el combo de ticker)'],['M','Cargar un movimiento (otro tipo)'],['D','Dividendos'],['T','Tipo de cambio (CCL / MEP)'],['R','Refrescar cotizaciones'],['/','Buscar un ticker en la cartera']]
    .concat(CFG.informe?[['I','Informe para '+CFG.nombre]]:[]).concat([['H','Volver a Carteras administradas'],['Esc','Cerrar / limpiar búsqueda'],['?','Esta ayuda']]);
  ov=document.createElement('div');ov.id='kb-help';ov.onclick=function(e){if(e.target===ov)ov.remove();};
  ov.style.cssText='position:fixed;inset:0;z-index:100003;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px';
  ov.innerHTML='<div style="background:var(--surface);border:1px solid var(--border2);border-radius:12px;padding:1rem 1.2rem;min-width:300px;font-family:var(--sans);color:var(--text)">'+
    '<div style="font-weight:700;margin-bottom:.6rem">⌨️ Atajos de teclado</div>'+
    L.map(function(x){return '<div style="display:flex;gap:12px;align-items:center;margin:.35rem 0;font-size:.84rem"><kbd style="min-width:34px;text-align:center;font-family:var(--mono);font-size:.78rem;background:var(--surface2);border:1px solid var(--border2);border-bottom-width:2px;border-radius:5px;padding:2px 6px">'+x[0]+'</kbd><span>'+x[1]+'</span></div>';}).join('')+
    '<div style="font-family:var(--mono);font-size:.62rem;color:var(--text3);margin-top:.6rem">No funcionan mientras estás escribiendo en un campo.</div></div>';
  document.body.appendChild(ov);
}
document.addEventListener('keydown',function(e){
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  var a=document.activeElement,tag=a&&a.tagName;
  if(e.key==='Escape'){
    var c=document.getElementById('kb-help')||document.getElementById('inf-dlg')||document.getElementById('inf-view');if(c){c.remove();return;}
    if(a&&a.id==='port-ticker-filter'&&a.value){a.value='';a.dispatchEvent(new Event('input'));a.blur();return;}
    if(a&&(tag==='INPUT'||tag==='TEXTAREA'))a.blur();return;
  }
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT'||(a&&a.isContentEditable))return;
  if(document.getElementById('inf-view')||document.getElementById('inf-dlg'))return;
  var k=e.key;
  if(k!=='?'&&k!=='h'&&k!=='H'&&(typeof _gdcInitDone==='undefined'||!_gdcInitDone))return;
  var hecho=true;
  if(k==='?'){kbAyuda();}
  else if(k==='p'||k==='P'){_kbIr(['portafolio']);}
  else if(k==='m'||k==='M'){if(_kbIr(['movimientos']))_kbFoco('m-ticker');}
  else if(k==='c'||k==='C'){kbOperar('vbuy-ticker');}
  else if(k==='v'||k==='V'){kbOperar('vsell-ticker');}
  else if(k==='d'||k==='D'){_kbIr(['dividendos','tracker']);}
  else if(k==='t'||k==='T'){if(_kbIr(['tipocambio']))_kbFoco('tc-ccl-fecha');}
  else if(k==='r'||k==='R'){if(typeof fetchAllQuotes==='function')fetchAllQuotes();}
  else if(k==='/'){if(_kbIr(['portafolio']))_kbFoco(CFG.vistaNueva&&document.getElementById('nv-q')?'nv-q':'port-ticker-filter');}
  else if((k==='i'||k==='I')&&CFG.informe&&typeof infAbrir==='function'){infAbrir();}
  else if(k==='h'||k==='H'){location.href='../index.html';}
  else hecho=false;
  if(hecho)e.preventDefault();
});

(function(){function add(){var tb=document.querySelector('.topbar');if(!tb||document.getElementById('kb-btn'))return;
  var b=document.createElement('button');b.id='kb-btn';b.type='button';b.textContent='?';b.title='Atajos de teclado (tecla ?)';b.onclick=function(){kbAyuda();};
  b.style.cssText='margin-left:auto;width:24px;height:24px;flex-shrink:0;border-radius:50%;border:1px solid var(--border2);background:var(--surface2);color:var(--text2);font-family:var(--mono);font-size:.78rem;font-weight:700;cursor:pointer;line-height:1;padding:0';
  b.onmouseenter=function(){b.style.borderColor='var(--accent)';b.style.color='var(--accent)';};b.onmouseleave=function(){b.style.borderColor='var(--border2)';b.style.color='var(--text2)';};
  tb.appendChild(b);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();})();

// ─── Vista celular: en pantallas angostas cada posición se ve como tarjeta ───────────────────

// ─── Auditoría de la tabla completa de ratios (solo GDC, que es la que se sincroniza) ─────────
var RA_AUD={res:[],corriendo:false,hechos:0,total:0,cancel:false};
function _raNice(x){if(x<1){return Math.round(10000/Math.round(1/x))/10000;}var r=Math.round(x);return Math.abs(x/r-1)<0.03?r:Math.round(x*10)/10;}
function _raFmt(x){return String(x).replace('.',',');}
function raAudUI(){
  var pg=document.getElementById('page-ratios');if(!pg||!CFG.sync)return;
  var c=document.getElementById('ra-aud-card');
  if(!c){c=document.createElement('div');c.className='card';c.id='ra-aud-card';c.style.marginBottom='1rem';pg.insertBefore(c,pg.firstChild);}
  var A=RA_AUD,h='<div class="card-header" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span class="card-title">🔍 Auditoría de ratios</span>'+
    '<span class="smsg" style="font-size:.66rem">compara cada Cedear con NYSE y el CCL ('+(CCL_HOY?'$'+Math.round(CCL_HOY).toLocaleString('es-AR'):'—')+')</span>'+
    (A.corriendo?'<span class="smsg">'+A.hechos+' / '+A.total+'…</span><button class="btn btn-sm" style="margin-left:auto" onclick="RA_AUD.cancel=true">Detener</button>'
      :'<button class="btn btn-a btn-sm" style="margin-left:auto" onclick="raAuditar()">'+(A.fecha?'Volver a auditar':'Auditar tabla completa')+'</button>')+'</div>';
  if(A.fecha){
    var mal=A.res.filter(function(r){return r.estado==='mal';}),dud=A.res.filter(function(r){return r.estado==='dudoso';}),err=A.res.filter(function(r){return r.estado==='error';});
    h+='<div class="card-body" style="padding-top:.4rem">';
    h+='<div class="smsg" style="margin-bottom:6px">'+A.fecha+' · '+A.ok+' coinciden (±25%) · <b style="color:'+(mal.length?'var(--amber,#eab308)':'var(--accent)')+'">'+mal.length+' a corregir</b>'+(dud.length?' · '+dud.length+' con dato dudoso':'')+(err.length?' · '+err.length+' sin precio NYSE':'')+'</div>';
    if(mal.length){
      h+='<div class="tw"><table><thead><tr><th>Ticker</th><th>Ratio cargado</th><th>Según mercado</th><th>Cedear $</th><th>NYSE USD</th><th></th></tr></thead><tbody>'+
        mal.map(function(r){var n=_raNice(r.sug);return '<tr><td style="font-weight:700">'+r.t+(r.enCartera?' <span title="Lo tenés en cartera">📌</span>':'')+'</td><td class="mono">'+_raFmt(r.r)+'</td><td class="mono" style="color:var(--amber,#eab308);font-weight:700">'+_raFmt(n)+(r.sug<1?' <span class="muted" style="font-weight:400">(1 Cedear = '+Math.round(1/r.sug)+' acciones)</span>':'')+'</td>'+
          '<td class="mono">'+Math.round(r.ars).toLocaleString('es-AR')+'</td><td class="mono">'+r.usd.toLocaleString('es-AR',{maximumFractionDigits:2})+'</td>'+
          '<td>'+(r.aplicado?'<span style="color:var(--accent)">✓ '+_raFmt(r.aplicado)+'</span>':'<button class="btn btn-a btn-sm" onclick="raAudUsar(\''+r.t+'\','+n+')">Usar '+_raFmt(n)+'</button>')+'</td></tr>';}).join('')+'</tbody></table></div>';
      var pend=mal.filter(function(r){return !r.aplicado;}).length,apl=mal.length-pend;
      h+='<div style="display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap">'+(pend?'<button class="btn btn-sm" onclick="raAudUsarTodos()">Usar todos ('+pend+')</button>':'')+
        (apl?'<button class="btn btn-a btn-sm" onclick="raAudSync()">⟳ Sync a las demás carteras</button><span class="smsg" id="ra-aud-sync"></span>':'')+'</div>';
    }
    if(dud.length)h+='<div class="smsg" style="margin-top:8px">Dato dudoso (no se propone cambio): '+dud.map(function(r){return r.t+' (Cedear $'+r.ars+')';}).join(', ')+'</div>';
    if(err.length)h+='<div class="smsg" style="margin-top:4px">Sin precio en NYSE: '+err.map(function(r){return r.t;}).join(', ')+'</div>';
    h+='</div>';
  }
  c.innerHTML=h;
}
async function raAuditar(){
  if(RA_AUD.corriendo)return;
  var mapa={};try{mapa=await fetchArgCedearsAPI();}catch(e){alert('No se pudieron traer los precios de BYMA');return;}
  var enCartera={};try{getPositions().forEach(function(p){if(p.qty>0.000001)enCartera[p.ticker]=1;});}catch(e){}
  var tks=Object.keys(RATIOS_TABLE).filter(function(t){var q=mapa[t];var s=getSector(t);return q&&q.price>0&&['argentina','bonos','on','fci'].indexOf(s)<0&&!BRL_TICKERS.has(t);}).sort();
  RA_AUD={res:[],corriendo:true,hechos:0,total:tks.length,cancel:false};raAudUI();
  var ok=0;
  for(var i=0;i<tks.length&&!RA_AUD.cancel;i++){
    var t=tks[i],ars=mapa[t].price,r=RATIOS_TABLE[t];
    try{var f=await fetchFinnhub(getFinnhubTicker(t)),usd=f.price,sug=usd*CCL_HOY/ars;
      var est=(ars<50||sug<0.02||sug>5000)?'dudoso':Math.abs(r/sug-1)>0.25?'mal':'ok';if(est==='ok')ok++;
      RA_AUD.res.push({t:t,r:r,sug:sug,ars:ars,usd:usd,estado:est,enCartera:!!enCartera[t]});
    }catch(e){RA_AUD.res.push({t:t,r:r,ars:ars,estado:'error'});}
    RA_AUD.hechos=i+1;if(i%5===0)raAudUI();
    await new Promise(function(res){setTimeout(res,1100);});
  }
  RA_AUD.res.sort(function(a,b){return (b.enCartera?1:0)-(a.enCartera?1:0)||a.t.localeCompare(b.t);});
  RA_AUD.corriendo=false;RA_AUD.ok=ok;RA_AUD.fecha=new Date().toLocaleString('es-AR')+(RA_AUD.cancel?' (detenida)':'');
  raAudUI();
}
function raAudUsar(t,v,silencioso){
  if(!silencioso&&!confirm('¿Cambiar el ratio de '+t+' de '+RATIOS_TABLE[t]+' a '+v+'?\n\nSe recalculan los movimientos de '+t+' con el ratio nuevo.'))return;
  RATIOS_TABLE[t]=v;try{localStorage.setItem((PFX+'ratios'),JSON.stringify(RATIOS_TABLE));}catch(e){}
  sbSetConfig('ratios',RATIOS_TABLE);
  RA_AUD.res.forEach(function(r){if(r.t===t)r.aplicado=v;});
  try{renderRatios();}catch(e){}try{recalcMovimientos(t);}catch(e){}
  raAudUI();
}
function raAudUsarTodos(){
  var L=RA_AUD.res.filter(function(r){return r.estado==='mal'&&!r.aplicado;});if(!L.length)return;
  if(!confirm('¿Aplicar los '+L.length+' ratios sugeridos?\n\n'+L.map(function(r){return r.t+': '+r.r+' → '+_raNice(r.sug);}).join('\n')))return;
  L.forEach(function(r){raAudUsar(r.t,_raNice(r.sug),true);});
}
async function raAudSync(){
  var el=document.getElementById('ra-aud-sync');if(el)el.textContent='Sincronizando…';
  try{var errs=await syncDataToOthers(function(m){if(el)el.textContent=m;});if(el)el.textContent=errs.length?'Con errores: '+errs.join(', '):'✓ Enviado a Omar, Ana, Hilda y Juli';}
  catch(e){if(el)el.textContent='Error: '+e.message;}
}
(function(){var go=function(){try{raAudUI();}catch(e){}};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();

// ─── Control de precio al cargar compras y ventas ─────────────────────────────
function _precioMercadoARS(t){
  var q=quotes[t];if(!q||!(q.price>0))return null;
  if(isBonoUSDDirecto(t))return null;
  var s=getSector(t);
  if(q.fromByma||['argentina','bonos','on','fci'].indexOf(s)>=0||BRL_TICKERS.has(t))return q.price;
  return CCL_HOY>0?q.price*CCL_HOY/getRatio(t):null;
}
function precioGuard(t,precio,fecha){
  try{
    if(!t||!(precio>0))return true;
    var p=String(fecha||'').split('/');if(p.length===3){var f=new Date(p[2]+'-'+p[1].padStart(2,'0')+'-'+p[0].padStart(2,'0'));if((Date.now()-f)/86400000>7)return true;}
    var m=_precioMercadoARS(t);if(!(m>0))return true;
    var r=precio/m;if(r>=0.9&&r<=1.1)return true;
    var f2=function(x){return '$'+x.toLocaleString('es-AR',{maximumFractionDigits:2});};
    var pista=(r>7&&r<13)||(r>70&&r<130)?'\n\n¿Te sobró un cero?':(r>0.07&&r<0.13)||(r>0.007&&r<0.013)?'\n\n¿Te faltó un cero?':'';
    return confirm('⚠ Revisá el precio de '+t+'\n\nCargaste '+f2(precio)+' y el mercado está en '+f2(m)+' ('+(r>1?'+':'')+Math.round((r-1)*100)+'%).'+pista+'\n\n¿Guardar igual?');
  }catch(e){return true;}
}

// ─── Papelera y deshacer ──────────────────────────────────────────────────────
var PAP=null,_papCargando=null;
function _papCargar(){
  if(PAP)return Promise.resolve(PAP);
  if(!_papCargando)_papCargando=(typeof sbGetConfig==='function'?sbGetConfig('papelera'):Promise.resolve(null)).then(function(v){
    if(typeof v==='string'){try{v=JSON.parse(v);}catch(e){v=null;}}PAP=Array.isArray(v)?v:[];return PAP;}).catch(function(){PAP=[];return PAP;});
  return _papCargando;
}
function _papPodar(){var lim=Date.now()-30*86400000;PAP=PAP.filter(function(x){return x.ts>=lim;}).slice(0,300);}
function papAgregar(e){
  e=JSON.parse(JSON.stringify(e));e.ts=Date.now();e.id=e.ts+'_'+Math.floor(Math.random()*1e6);
  if(typeof CARTERA_ACTIVA!=='undefined')e.cartera=CARTERA_ACTIVA;
  _papCargar().then(function(){PAP.unshift(e);_papPodar();sbSetConfig('papelera',PAP);papRender();});
  papToast(e);
}
function papRestaurar(id){
  _papCargar().then(function(){
    var i=PAP.findIndex(function(x){return x.id===id;});if(i<0)return;var e=PAP[i];
    if(e.k==='mov'&&e.acc==='editado'){var j=movimientos.findIndex(function(m){return m.id==e.d.id;});
      if(j>=0){var actual=JSON.parse(JSON.stringify(movimientos[j]));movimientos[j]=e.d;PAP.splice(i,1);
        PAP.unshift({k:'mov',acc:'editado',d:actual,desc:'Antes de deshacer: '+actual.tipo+' '+actual.ticker+' del '+actual.fecha,ts:Date.now(),id:Date.now()+'_r'});}
      else{movimientos.push(e.d);PAP.splice(i,1);}
      saveAndRender();}
    else if(e.k==='mov'){if(!movimientos.some(function(m){return m.id==e.d.id;}))movimientos.push(e.d);PAP.splice(i,1);saveAndRender();}
    else if(e.k==='movs'){e.d.forEach(function(x){if(!movimientos.some(function(m){return m.id==x.id;}))movimientos.push(x);});PAP.splice(i,1);saveAndRender();}
    else if(e.k==='div'){if(!TRK.divs.some(function(d){return d.id===e.d.id;}))TRK.divs.push(e.d);TRK.divs.sort(function(a,b){return String(b.fecha).localeCompare(String(a.fecha));});PAP.splice(i,1);
      trkSave();try{trkRender();}catch(_e){}try{}catch(_e){}try{renderPortfolio();}catch(_e){}}
    sbSetConfig('papelera',PAP);papRender();
    var t=document.getElementById('pap-toast');if(t)t.remove();
  });
}
function papToast(e){
  var t=document.getElementById('pap-toast');if(t)t.remove();
  t=document.createElement('div');t.id='pap-toast';
  t.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:100004;background:var(--surface);border:1px solid var(--border2);border-radius:10px;padding:.55rem .8rem;font-family:var(--mono);font-size:.74rem;color:var(--text);box-shadow:0 6px 24px rgba(0,0,0,.45);display:flex;gap:12px;align-items:center;max-width:92vw';
  t.innerHTML='<span>'+String(e.desc||'Cambio guardado').replace(/</g,'&lt;')+'</span><button class="btn btn-a btn-sm" onclick="papRestaurar(\''+e.id+'\')">↶ Deshacer</button>';
  document.body.appendChild(t);setTimeout(function(){if(t.parentNode)t.remove();},10000);
}
function papRender(){
  var pg=document.getElementById('page-movimientos');if(!pg)return;
  var c=document.getElementById('pap-card');
  if(!c){c=document.createElement('div');c.className='card card-collapsed';c.id='pap-card';c.style.marginTop='1rem';pg.appendChild(c);}
  var L=(PAP||[]);
  var ag=function(ts){var s=(Date.now()-ts)/1000;return s<3600?'hace '+Math.max(1,Math.round(s/60))+' min':s<86400?'hace '+Math.round(s/3600)+' h':'hace '+Math.round(s/86400)+' d';};
  var col=c.classList.contains('card-collapsed');
  c.innerHTML='<div class="card-header"><span class="card-title">🗑 Papelera</span><span class="smsg">'+L.length+' elemento'+(L.length!==1?'s':'')+' · se guardan 30 días</span><button class="card-toggle" onclick="cardToggle(this)">'+(col?'▸':'▾')+'</button></div>'+
    '<div class="card-body" style="padding-top:0">'+(L.length?'<div class="tw" style="max-height:300px;overflow-y:auto"><table><tbody>'+
      L.map(function(x){return '<tr><td style="font-size:.74rem">'+String(x.desc||'').replace(/</g,'&lt;')+(x.cartera&&x.cartera!=='principal'?' <span class="muted">('+x.cartera+')</span>':'')+'</td><td class="muted" style="white-space:nowrap;font-size:.68rem">'+ag(x.ts)+'</td><td style="text-align:right"><button class="btn btn-sm" onclick="papRestaurar(\''+x.id+'\')">Restaurar</button></td></tr>';}).join('')+
      '</tbody></table></div>':'<div class="empty-state" style="padding:1rem">No hay nada en la papelera.</div>')+'</div>';
}
(function(){var go=function(){var tr=function(){if(typeof _gdcInitDone!=='undefined'&&_gdcInitDone){_papCargar().then(papRender);}else setTimeout(tr,1500);};tr();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();

// ─── Fecha de hoy en los formularios ──────────────────────────────────────────
function _hoyLocalISO(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
var _FECHA_IDS=['m-fecha','vbuy-fecha','vsell-fecha','d-fecha','trk-fecha','vhist-add-fecha'];
function fechaMarcar(el){
  if(!el)return;var dist=el.value&&el.value!==_hoyLocalISO();
  el.style.borderColor=dist?'var(--amber,#eab308)':'';el.style.color=dist?'var(--amber,#eab308)':'';
  el.title=dist?'Ojo: esta fecha no es hoy':'';
}
function fechasHoyRefrescar(){
  var hoy=_hoyLocalISO();
  _FECHA_IDS.forEach(function(id){var el=document.getElementById(id);if(!el)return;
    if(!el.value||(el.dataset.auto&&el.value===el.dataset.auto&&el.dataset.auto!==hoy)){el.value=hoy;el.dataset.auto=hoy;try{el.dispatchEvent(new Event('change'));}catch(e){}}
    fechaMarcar(el);});
}
function fechaGuard(fechaDMY,tipo){
  try{var p=String(fechaDMY||'').split('/');if(p.length!==3)return true;
    var iso=p[2]+'-'+p[1].padStart(2,'0')+'-'+p[0].padStart(2,'0'),hoy=_hoyLocalISO();if(iso===hoy)return true;
    return confirm('📅 La fecha de esta '+(tipo||'operación')+' es '+p[0].padStart(2,'0')+'/'+p[1].padStart(2,'0')+'/'+p[2]+', no es hoy ('+hoy.split('-').reverse().join('/')+').\n\n¿Es correcta?');
  }catch(e){return true;}
}
(function(){
  function setup(){
    _FECHA_IDS.forEach(function(id){var el=document.getElementById(id);if(!el||el._fm)return;el._fm=1;
      if(!el.dataset.auto&&el.value===_hoyLocalISO())el.dataset.auto=el.value;
      el.addEventListener('input',function(){fechaMarcar(el);});el.addEventListener('change',function(){fechaMarcar(el);});});
    fechasHoyRefrescar();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
  document.addEventListener('visibilitychange',function(){if(!document.hidden)fechasHoyRefrescar();});
  window.addEventListener('focus',fechasHoyRefrescar);
  setInterval(fechasHoyRefrescar,60000);
})();

// ─── Mercado automático al cargar una compra ──────────────────────────────────
var _MKT_LISTAS=null,_mktListasCargando=null;
var _SECT_A_MKT={nyse:'USA',argentina:'ARGENTINA',brasil:'BRASIL',europa:'EUROPA',china:'CHINA',cripto:'CRIPTO',bonos:'BONOS',on:'ON',fci:'FCI'};
var _MKT_NOMBRE={USA:'NYSE / NASDAQ',ETF:'ETF (USA)',ARGENTINA:'Argentina',BONOS:'Bonos',ON:'ON',FCI:'FCI',BRASIL:'Brasil',EUROPA:'Europa',CHINA:'China',CRIPTO:'Cripto'};
function _mktListas(){
  if(_MKT_LISTAS)return Promise.resolve(_MKT_LISTAS);
  if(!_mktListasCargando)_mktListasCargando=Promise.all([fetchBonosAPI().catch(function(){return {};}),fetchONsAPI().catch(function(){return {};}),fetchArgNotesAPI().catch(function(){return {};}),fetchArgEqAPI().catch(function(){return {};}),fetchArgCedearsAPI().catch(function(){return {};})])
    .then(function(r){_MKT_LISTAS={bonos:r[0],on:Object.assign({},r[2],r[1]),arg:r[3],ced:r[4]};return _MKT_LISTAS;});
  return _mktListasCargando;
}
function _mktPais(t){var m=(typeof RATIOS_META!=='undefined'&&RATIOS_META[t])||{};var p=String(m.pais||'').toLowerCase();
  if(/brasil|brazil/.test(p))return 'BRASIL';if(/china|hong/.test(p))return 'CHINA';
  if(/alemania|francia|espa|reino|holanda|pa[ií]ses bajos|suiza|italia|b[eé]lgica|irlanda|suecia|dinamarca|noruega|finlandia|luxemburgo|europa/.test(p))return 'EUROPA';return null;}
async function mktDetectar(t){
  t=String(t||'').trim().toUpperCase();if(!t)return null;
  for(var i=movimientos.length-1;i>=0;i--){var m=movimientos[i];if(m&&m.ticker===t&&m.mercado&&m.mercado!=='—')return {mkt:m.mercado,por:'lo que usaste antes'};}
  if(SECTOR_MAP[t]&&_SECT_A_MKT[SECTOR_MAP[t]])return {mkt:_SECT_A_MKT[SECTOR_MAP[t]],por:'la tabla de la app'};
  var L=await _mktListas();
  if(L.bonos[t])return {mkt:'BONOS',por:'BYMA'};
  if(L.on[t])return {mkt:'ON',por:'BYMA'};
  if(L.arg[t])return {mkt:'ARGENTINA',por:'BYMA'};
  if(L.ced[t])return {mkt:_mktPais(t)||'USA',por:'BYMA (Cedear)'};
  return null;
}
function _mktHint(sel,txt,ok){
  var id=sel.id+'-hint',h=document.getElementById(id);
  if(!h){h=document.createElement('div');h.id=id;h.style.cssText='font-family:var(--mono);font-size:.6rem;margin-top:2px';sel.parentNode.appendChild(h);}
  h.style.color=ok?'var(--accent)':'var(--text3)';h.textContent=txt||'';
}
function mktEnlazar(tkId,mktId,precioId,onMkt){
  var tk=document.getElementById(tkId),sel=document.getElementById(mktId);if(!tk||!sel||tk._mktAuto)return;tk._mktAuto=1;
  var manual=false,tmr=null,ult='';
  sel.addEventListener('change',function(e){if(e.isTrusted)manual=true;});
  var correr=async function(){
    var t=tk.value.trim().toUpperCase();if(t===ult)return;ult=t;
    if(!t){_mktHint(sel,'');manual=false;return;}
    if(manual)return;
    var r=null;try{r=await mktDetectar(t);}catch(e){}
    if(tk.value.trim().toUpperCase()!==t)return;
    if(r&&sel.querySelector('option[value="'+r.mkt+'"]')){
      if(sel.value!==r.mkt){sel.value=r.mkt;try{sel.dispatchEvent(new Event('change'));}catch(e){}if(onMkt)try{onMkt();}catch(e){}}
      _mktHint(sel,'✓ '+(_MKT_NOMBRE[r.mkt]||r.mkt)+' — según '+r.por,true);
    } else _mktHint(sel,'No reconocí '+t+': elegí el mercado',false);
    if(precioId){var pe=document.getElementById(precioId);if(pe&&!pe.value){var pm=null;try{pm=_precioMercadoARS(t);}catch(e){}
      if(!(pm>0)&&_MKT_LISTAS){var e2=_MKT_LISTAS.bonos[t]||_MKT_LISTAS.on[t]||_MKT_LISTAS.arg[t]||_MKT_LISTAS.ced[t];if(e2&&e2.price>0)pm=e2.price;}
      if(pm>0){pe.value=Math.round(pm*100)/100;pe.dataset.auto='1';try{pe.dispatchEvent(new Event('input'));}catch(e){}}}}
  };
  tk.addEventListener('input',function(){clearTimeout(tmr);tmr=setTimeout(correr,450);});
  tk.addEventListener('change',correr);tk.addEventListener('blur',correr);
  var dl=document.getElementById(tkId+'-dl');if(!dl){dl=document.createElement('datalist');dl.id=tkId+'-dl';document.body.appendChild(dl);tk.setAttribute('list',dl.id);}
  tk.addEventListener('focus',function(){var seen={},o='';for(var i=movimientos.length-1;i>=0;i--){var m=movimientos[i];if(m&&m.ticker&&m.ticker!=='APORTE'&&!seen[m.ticker]){seen[m.ticker]=1;o+='<option value="'+m.ticker+'">';}}dl.innerHTML=o;});
  tk.addEventListener('input',function(){if(!tk.value){manual=false;ult='';_mktHint(sel,'');var pe=precioId&&document.getElementById(precioId);if(pe&&pe.dataset.auto){pe.value='';delete pe.dataset.auto;}}});
}
(function(){var go=function(){try{mktEnlazar('vbuy-ticker','vbuy-mkt','vbuy-precio-ars',function(){if(typeof vbuyOnMktChange==='function')vbuyOnMktChange();});mktEnlazar('m-ticker','m-mkt',null,null);}catch(e){console.warn('mktEnlazar',e);}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();

// ─── Orden de campos en Comprar y Vender ──────────────────────────────────────
(function(){
  function ordenar(ids){var gs=ids.map(function(id){var e=document.getElementById(id);return e?e.closest('.fgrp'):null;});
    if(gs.some(function(g){return !g;}))return;var cont=gs[0].parentNode;gs.forEach(function(g){cont.appendChild(g);});}
  function setup(){
    try{ordenar(['vbuy-ticker','vbuy-precio-ars','vbuy-qty','vbuy-fecha','vbuy-mkt']);}catch(e){}
    try{ordenar(['vsell-ticker','vsell-precio-ars','vsell-qty','vsell-fecha']);
      var c=document.getElementById('vsell-ccl');if(c){c.value='';var g=c.closest('.fgrp');if(g)g.style.display='none';}}catch(e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();

// ─── Honorarios (CFG.honorario, ej. 0.2 en Ana y Juli) ────────────────────────
var HON_LIST=null;
async function honCargar(){if(HON_LIST)return HON_LIST;var v=null;try{v=await sbGetConfig('honorarios');}catch(e){}if(typeof v==='string'){try{v=JSON.parse(v);}catch(e){v=null;}}HON_LIST=Array.isArray(v)?v:[];return HON_LIST;}
function _honPeriodoDefault(){
  var corte=histUltimoCorte();if(!corte)return {ini:'',fin:''};
  var ini=(parseInt(corte.slice(0,4),10)-1)+corte.slice(4);return {ini:ini,fin:corte};
}
async function honAbrir(pre){
  await honCargar();pre=(pre&&typeof pre==='object'&&pre.fin)?pre:null;
  var pd=pre?{ini:pre.ini,fin:pre.fin}:_honPeriodoDefault(),inv=pre?pre.inv:(getRawNum('inv-sidebar-usd')||'');
  var ov=document.getElementById('hon-dlg');if(ov)ov.remove();
  ov=document.createElement('div');ov.id='hon-dlg';ov.onclick=function(e){if(e.target===ov)ov.remove();};
  ov.style.cssText='position:fixed;inset:0;z-index:100002;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px';
  var inp='width:100%;background:var(--surface2);color:var(--text);border:1px solid var(--border2);border-radius:6px;padding:.4rem .5rem;font-family:var(--mono);font-size:.84rem';
  var lb='font-family:var(--mono);font-size:.6rem;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin:.55rem 0 .2rem';
  var pct=Math.round(CFG.honorario*100);
  ov.innerHTML='<div style="background:var(--surface);border:1px solid var(--border2);border-radius:12px;max-width:480px;width:100%;padding:1rem 1.1rem;font-family:var(--sans);color:var(--text);max-height:92vh;overflow:auto">'+
    '<div style="font-weight:700;font-size:.95rem">💼 Honorario de '+CFG.nombre+'</div>'+
    '<div style="font-family:var(--mono);font-size:.64rem;color:var(--text3);margin-top:2px">'+pct+'% de (valor final según el broker − inversión inicial − aportes + retiros del período). Sin ganancia, 0.</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 10px">'+
      '<div><div style="'+lb+'">Inicio del período</div><input id="hon-ini" type="date" value="'+pd.ini+'" style="'+inp+'"></div>'+
      '<div><div style="'+lb+'">Cierre del período</div><input id="hon-fin" type="date" value="'+pd.fin+'" style="'+inp+'"></div>'+
      '<div><div style="'+lb+'">Inversión inicial USD</div><input id="hon-inv" type="number" step="any" value="'+(inv?Math.round(inv*100)/100:'')+'" style="'+inp+'" oninput="honCalc()"></div>'+
      '<div><div style="'+lb+'">Valor final USD (broker)</div><input id="hon-val" type="number" step="any" placeholder="el que muestra el broker" value="'+(pre?Math.round(pre.val*100)/100:'')+'" style="'+inp+'" oninput="honCalc()"></div>'+
      '<div style="grid-column:1/-1"><div style="'+lb+'">Aportes − retiros del período USD</div><input id="hon-apn" type="number" step="any" value="'+(Math.round((pre?pre.apn:_honApn(pd.ini,pd.fin))*100)/100)+'" style="'+inp+'" oninput="honCalc()"><div style="font-family:var(--mono);font-size:.58rem;color:var(--text3);margin-top:2px">Se toma de 💵 Aportes y retiros (se recalcula al cambiar las fechas). La plata que puso o sacó no es ganancia.</div></div>'+
    '</div>'+
    '<div id="hon-res" style="margin-top:.7rem;padding:.55rem .7rem;background:var(--surface2);border:1px solid var(--border);border-radius:8px;font-family:var(--mono);font-size:.78rem">Cargá el valor final del broker.</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 10px">'+
      '<div><div style="'+lb+'">Monto cobrado USD</div><input id="hon-cob" type="number" step="any" style="'+inp+'" oninput="this.dataset.man=1"></div>'+
      '<div><div style="'+lb+'">Fecha de cobro</div><input id="hon-fecha" type="date" value="'+_hoyLocalISO()+'" style="'+inp+'"></div>'+
    '</div>'+
    '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:.8rem"><button class="btn btn-sm" onclick="document.getElementById(\'hon-dlg\').remove()">Cerrar</button><button class="btn btn-a btn-sm" onclick="honGuardar()">Registrar cobro</button></div>'+
    '<div style="'+lb+';margin-top:1rem">Honorarios registrados</div><div id="hon-lista"></div></div>';
  document.body.appendChild(ov);honLista();if(pre)honCalc();
  ['hon-ini','hon-fin'].forEach(function(id){var e=document.getElementById(id);if(e)e.addEventListener('change',function(){var a=document.getElementById('hon-apn');if(a)a.value=Math.round(_honApn(document.getElementById('hon-ini').value,document.getElementById('hon-fin').value)*100)/100;honCalc();});});
}
function _honApn(ini,fin){if(!CFG.aportes||!_aporLoaded||!ini)return 0;var n=0;(APOR||[]).forEach(function(a){if(a.fecha>=ini&&(!fin||a.fecha<fin))n+=(a.tipo==='retiro'?-1:1)*(+a.usd||0);});return n;}
function _honApnInput(){var e=document.getElementById('hon-apn');var v=e?parseFloat(e.value):0;return isNaN(v)?0:v;}
function honCalc(){
  var inv=parseFloat(document.getElementById('hon-inv').value),val=parseFloat(document.getElementById('hon-val').value),r=document.getElementById('hon-res'),c=document.getElementById('hon-cob');
  if(!(inv>0)||!(val>0)){r.textContent='Cargá la inversión inicial y el valor final del broker.';return;}
  var apn=_honApnInput(),g=val-inv-apn,h=Math.max(0,g*CFG.honorario),pc=g/inv*100;
  r.innerHTML='Ganancia: <b style="color:'+(g>=0?'var(--accent)':'var(--red)')+'">'+(g>=0?'+':'−')+'USD '+Math.abs(g).toLocaleString('es-AR',{maximumFractionDigits:2})+'</b> ('+(pc>=0?'+':'')+pc.toFixed(2).replace('.',',')+'%)<br>'+
    'Honorario '+Math.round(CFG.honorario*100)+'%: <b style="color:var(--accent);font-size:.95rem">USD '+h.toLocaleString('es-AR',{maximumFractionDigits:2})+'</b>'+(g<=0?' <span style="color:var(--text3)">(sin ganancia, no se cobra)</span>':'');
  if(c&&!c.dataset.man)c.value=Math.round(h*100)/100;
}
async function honGuardar(){
  var g=function(id){return document.getElementById(id).value;};
  var inv=parseFloat(g('hon-inv')),val=parseFloat(g('hon-val')),cob=parseFloat(g('hon-cob'));
  if(!(inv>0)||!(val>0)){alert('Falta la inversión inicial o el valor final.');return;}
  if(!g('hon-fin')){alert('Falta la fecha de cierre del período.');return;}
  var apn=_honApnInput(),gan=val-inv-apn;
  if(isNaN(cob))cob=Math.max(0,gan*CFG.honorario);
  var e={ini:g('hon-ini'),fin:g('hon-fin'),anio:g('hon-fin').slice(0,4),inv:inv,aportesNetos:Math.round(apn*100)/100,valorFinal:val,ganancia:Math.round(gan*100)/100,pct:CFG.honorario,honorario:Math.round(Math.max(0,gan*CFG.honorario)*100)/100,cobrado:Math.round(cob*100)/100,fechaCobro:g('hon-fecha'),ts:Date.now()};
  await honCargar();
  var i=HON_LIST.findIndex(function(x){return x.fin===e.fin;});
  if(i>=0){if(!confirm('Ya hay un honorario registrado para el cierre '+e.fin.split('-').reverse().join('/')+'. ¿Reemplazarlo?'))return;HON_LIST[i]=e;}else HON_LIST.push(e);
  HON_LIST.sort(function(a,b){return a.fin<b.fin?-1:1;});
  var ok=await sbSetConfig('honorarios',HON_LIST);
  if(!ok){alert('No se pudo guardar en la nube. Probá de nuevo.');return;}
  honLista();_famLastSave=0;try{renderPortfolio();}catch(x){}
  var r=document.getElementById('hon-res');if(r)r.innerHTML='✓ Registrado: USD '+e.cobrado.toLocaleString('es-AR')+' del período que cerró el '+e.fin.split('-').reverse().join('/');
}
async function honBorrar(i){
  if(!HON_LIST||!HON_LIST[i])return;var x=HON_LIST[i];
  if(!confirm('¿Borrar el honorario del cierre '+x.fin.split('-').reverse().join('/')+' (USD '+x.cobrado+')?'))return;
  HON_LIST.splice(i,1);await sbSetConfig('honorarios',HON_LIST);honLista();_famLastSave=0;try{renderPortfolio();}catch(e){}
}
function honLista(){
  var el=document.getElementById('hon-lista');if(!el)return;var L=HON_LIST||[];
  if(!L.length){el.innerHTML='<div style="font-family:var(--mono);font-size:.7rem;color:var(--text3)">Todavía no registraste ninguno.</div>';return;}
  var tot=L.reduce(function(a,x){return a+(x.cobrado||0);},0);
  el.innerHTML='<table style="width:100%;font-size:.74rem"><thead><tr><th style="text-align:left">Período</th><th>Ganancia</th><th>Cobrado</th><th></th></tr></thead><tbody>'+
    L.map(function(x,i){return '<tr><td>'+(x.ini?x.ini.split('-').reverse().join('/').slice(0,10)+' → ':'')+x.fin.split('-').reverse().join('/')+'</td><td class="mono">'+(x.ganancia>=0?'+':'')+Math.round(x.ganancia).toLocaleString('es-AR')+'</td><td class="mono" style="color:var(--accent)">USD '+(x.cobrado||0).toLocaleString('es-AR')+'</td><td style="text-align:right"><span onclick="honBorrar('+i+')" style="cursor:pointer;color:var(--text3)" title="Borrar">✕</span></td></tr>';}).join('')+
    '</tbody><tfoot><tr><td><b>Total</b></td><td></td><td class="mono" style="color:var(--accent)"><b>USD '+tot.toLocaleString('es-AR')+'</b></td><td></td></tr></tfoot></table>';
}

// ─── Identidad de cada cartera (para no cargar en la equivocada) ──────────────
var CART_COLOR={gdc:'#22c55e',ana:'#e879f9',hilda:'#fb923c',juli:'#38bdf8',omar:'#facc15'};
var CART_FOTO={gdc:'PerfilGaston_s.webp',ana:'PerfilAna_s.webp',hilda:'PerfilHilda_s.webp',juli:'Juli_s.webp',omar:'perfilOmar_s.webp'};
function cartColor(){return CFG.color||CART_COLOR[CFG.id]||'#7a9cc5';}
function cartNombre(){var n=CFG.nombre;if(typeof CARTERA_ACTIVA!=='undefined'&&CARTERA_ACTIVA&&CARTERA_ACTIVA!=='principal'){n+=' · '+({cocos:'Cristian (Cocos)',vetajeep:'Jeep'}[CARTERA_ACTIVA]||CARTERA_ACTIVA);}return n;}
function _cartAv(sz){var c=cartColor(),f=CFG.foto||CART_FOTO[CFG.id];
  return '<span style="width:'+sz+'px;height:'+sz+'px;border-radius:50%;background:'+c+';display:inline-flex;align-items:center;justify-content:center;font-weight:800;color:#0b1120;font-size:'+Math.round(sz*.45)+'px;overflow:hidden;flex-shrink:0;border:2px solid '+c+'">'+
    (f?'<img src="'+f+'" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.replaceWith(document.createTextNode(\''+CFG.nombre.charAt(0)+'\'))">':CFG.nombre.charAt(0))+'</span>';}
function cartIdentidad(){
  var c=cartColor();
  document.title=CFG.nombre+' · Inversiones';
  try{var cv=document.createElement('canvas');cv.width=cv.height=64;var x=cv.getContext('2d');x.fillStyle=c;x.beginPath();x.arc(32,32,30,0,Math.PI*2);x.fill();
    x.fillStyle='#0b1120';x.font='bold 36px Inter,system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(CFG.nombre.charAt(0),32,35);
    var l=document.querySelector('link[rel="icon"]');if(!l){l=document.createElement('link');l.rel='icon';document.head.appendChild(l);}l.type='image/png';l.href=cv.toDataURL('image/png');}catch(e){}
  if(!document.getElementById('cart-frame')){
    var fr=document.createElement('div');fr.id='cart-frame';fr.style.cssText='position:fixed;inset:0;border:2px solid '+c+';pointer-events:none;z-index:99990;box-shadow:inset 0 0 0 1px '+c+'26';document.body.appendChild(fr);
    var wm=document.createElement('div');wm.id='cart-wm';wm.textContent=CFG.nombre.toUpperCase();
    wm.style.cssText='position:fixed;right:24px;bottom:40px;font-family:Inter,system-ui,sans-serif;font-size:7rem;font-weight:900;letter-spacing:-.04em;color:'+c+';opacity:.05;pointer-events:none;z-index:-1;user-select:none';document.body.appendChild(wm);
    var ch=document.createElement('div');ch.id='cart-chip';ch.title='Estás en la cartera de '+CFG.nombre;
    ch.style.cssText='display:flex;align-items:center;gap:7px;background:'+c+'1f;border:1px solid '+c+';border-radius:999px;padding:1px 11px 1px 1px;font-family:Inter,system-ui,sans-serif;font-weight:700;font-size:.8rem;color:'+c+';white-space:nowrap';
    var tb0=document.querySelector('.topbar');
    if(tb0){if(getComputedStyle(tb0).position==='static')tb0.style.position='relative';
      var box=document.createElement('div');box.id='tb-right';box.style.cssText='position:absolute;right:10px;top:50%;transform:translateY(-50%);display:flex;align-items:center;gap:8px;background:var(--bg);padding-left:10px;z-index:5';
      var kb=document.getElementById('kb-btn');if(kb){kb.style.marginLeft='0';box.appendChild(kb);}tb0.appendChild(box);}
    else{ch.style.position='fixed';ch.style.top='8px';ch.style.right='12px';ch.style.zIndex='99991';document.body.appendChild(ch);}
  }
  try{var hi=document.querySelector('header img');if(hi){hi.style.borderColor=c;hi.style.boxShadow='0 0 0 3px '+c+'33';}}catch(e){}
  try{var _iv=document.getElementById('inv-sidebar-usd');if(_iv&&!_iv._sty){_iv._sty=1;_iv.style.borderColor='var(--amber,#f59e0b)';_iv.style.color='var(--amber,#f59e0b)';_iv.style.background='rgba(245,158,11,.08)';_iv.title='Inversión inicial del período (USD). Al cambiarla pide confirmación.';
    var _lb=_iv.closest('div')&&_iv.closest('div').parentNode&&_iv.closest('div').parentNode.querySelector('.topbar-label');if(_lb){_lb.textContent='🔒 Inv. Inicial';_lb.style.color='var(--amber,#f59e0b)';}}}catch(e){}
  try{var inv=document.getElementById('inv-sidebar-usd'),lu=document.getElementById('liq-usd');
    if(inv&&lu&&!inv._mov){inv._mov=1;var invBox=inv.closest('div');while(invBox&&invBox.parentNode&&!invBox.parentNode.classList.contains('topbar'))invBox=invBox.parentNode;
      var liqItem=lu.closest('.topbar-item');
      if(invBox&&liqItem&&invBox!==liqItem){invBox.style.marginLeft='.6rem';invBox.style.paddingLeft='.8rem';invBox.style.paddingRight='.8rem';invBox.style.borderRight='1px solid var(--border)';invBox.style.flexShrink='0';invBox.querySelectorAll('.topbar-label').forEach(function(l){l.style.whiteSpace='nowrap';});liqItem.style.flexShrink='0';
        var tbp=liqItem.parentNode,ub=document.getElementById('auth-user-box'),ref=ub&&ub.parentNode===tbp?ub.nextSibling:tbp.firstChild;
        liqItem.style.borderLeft='none';liqItem.style.marginLeft='0';liqItem.style.paddingLeft='0';
        tbp.insertBefore(liqItem,ref);tbp.insertBefore(invBox,liqItem.nextSibling);}}
    var tbx=document.querySelector('.topbar'),tr=document.getElementById('tb-right');
    if(tbx){tbx.style.flexWrap='nowrap';tbx.style.overflowX='auto';tbx.style.overflowY='hidden';tbx.style.scrollbarWidth='none';if(tr)tbx.style.paddingRight=(tr.offsetWidth+24)+'px';}
    if(tr&&tbx){var rr=tbx.getBoundingClientRect();tr.style.position='fixed';tr.style.top=(rr.top+rr.height/2)+'px';tr.style.right='10px';tr.style.zIndex='99992';}
  }catch(e){console.warn('inv inicial',e);}
}
function opModal(o){
  return new Promise(function(res){
    var c=cartColor(),v=o.tipo==='venta',col=v?'var(--red,#ff5252)':'var(--accent,#00e676)';
    var ov=document.createElement('div');ov.id='op-dlg';ov.style.cssText='position:fixed;inset:0;z-index:100006;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px';
    var f2=function(x){return (+x).toLocaleString('es-AR',{maximumFractionDigits:2});};
    ov.innerHTML='<div style="background:var(--surface,#111927);border:2px solid '+c+';border-radius:12px;padding:14px 16px;width:360px;max-width:100%;font-family:Inter,system-ui,sans-serif;color:var(--text,#e8f0ff)">'+
      '<div style="background:'+c+';color:#0b1120;font-weight:800;border-radius:7px;padding:7px 10px;margin:-4px -6px 12px;display:flex;align-items:center;gap:8px;font-size:.88rem">'+_cartAv(26)+(v?'💸 VENTA':'🛒 COMPRA')+' EN LA CARTERA DE '+cartNombre().toUpperCase()+'</div>'+
      '<div style="font-size:1rem">'+(v?'Vender':'Comprar')+' <b>'+f2(o.qty)+' '+o.ticker+'</b> a $'+f2(o.precio)+(o.unidad?' <span style="font-size:.75rem;color:var(--text3)">'+o.unidad+'</span>':'')+'</div>'+
      '<div style="font-family:var(--mono);font-size:.7rem;color:var(--text2,#7a9cc5);line-height:1.7;margin-top:6px">'+(o.total?'Total $'+f2(o.total)+' · ':'')+o.fecha+(o.mkt?' · '+o.mkt:'')+(o.extra?'<br>'+o.extra:'')+'</div>'+
      '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px"><button id="op-no" class="btn">Cancelar</button><button id="op-si" class="btn" style="background:'+col+';border-color:'+col+';color:'+(v?'#fff':'#0b1120')+';font-weight:700">'+(v?'Vender':'Comprar')+' en '+CFG.nombre+'</button></div></div>';
    var fin=function(r){document.removeEventListener('keydown',kd,true);ov.remove();res(r);};
    var kd=function(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();fin(false);}else if(e.key==='Enter'){e.preventDefault();e.stopPropagation();fin(true);}};
    document.addEventListener('keydown',kd,true);
    document.body.appendChild(ov);
    ov.querySelector('#op-no').onclick=function(){fin(false);};ov.querySelector('#op-si').onclick=function(){fin(true);};
    ov.onclick=function(e){if(e.target===ov)fin(false);};
    setTimeout(function(){var b=ov.querySelector('#op-si');if(b)b.focus();},30);
  });
}
var _opBypass=false;
function _opEnvolver(nombre,leer){
  var orig=window[nombre];if(typeof orig!=='function'||orig._op)return;
  var w=function(){var self=this,args=arguments;if(_opBypass)return orig.apply(self,args);
    var o=null;try{o=leer();}catch(e){}
    if(!o||!o.ticker||!(o.qty>0)||!(o.precio>0))return orig.apply(self,args);
    opModal(o).then(function(ok){if(!ok)return;_opBypass=true;try{orig.apply(self,args);}finally{_opBypass=false;}});};
  w._op=1;window[nombre]=w;
}
function _opVal(id){var e=document.getElementById(id);return e?e.value:'';}
function _opFecha(id){var v=_opVal(id);return v?v.split('-').reverse().join('/'):'';}
function _opMktNom(id){var e=document.getElementById(id);return e&&e.selectedIndex>=0?e.options[e.selectedIndex].text:'';}
(function(){
  function setup(){
    try{cartIdentidad();}catch(e){console.warn('cartIdentidad',e);}
    _opEnvolver('vbuyConfirmar',function(){var mk=_opVal('vbuy-mkt'),bo=(mk==='BONOS'||mk==='ON'),q=parseFloat(_opVal('vbuy-qty')),p=parseFloat(_opVal('vbuy-precio-ars'));
      return {tipo:'compra',ticker:_opVal('vbuy-ticker').trim().toUpperCase(),qty:q,precio:p,unidad:bo?'c/100 nominales':'',total:bo?q*p/100:q*p,fecha:_opFecha('vbuy-fecha'),mkt:_opMktNom('vbuy-mkt')};});
    _opEnvolver('vsellConfirmar',function(){var t=_opVal('vsell-ticker').trim().toUpperCase(),q=parseFloat(_opVal('vsell-qty')),p=parseFloat(_opVal('vsell-precio-ars'));
      var pos=null;try{pos=getPositions().find(function(x){return x.ticker===t;});}catch(e){}
      var s=getSector(t),bo=(s==='bonos'||s==='on');var pv=document.getElementById('vsell-preview');
      var ext=(pos?'Te quedan '+Math.max(0,Math.round((pos.qty-q)*100)/100).toLocaleString('es-AR')+' '+t:'')+(pv&&pv.innerText&&pv.innerText.length<260?'<br><span style="color:var(--text3)">'+pv.innerText.replace(/</g,'&lt;').replace(/\n+/g,' · ')+'</span>':'');
      return {tipo:'venta',ticker:t,qty:q,precio:p,unidad:bo?'c/100 nominales':'',total:bo?q*p/100:q*p,fecha:_opFecha('vsell-fecha'),extra:ext};});
    _opEnvolver('addMov',function(){var tp=_opVal('m-tipo');if(tp!=='compra'&&tp!=='venta')return null;var mk=_opVal('m-mkt'),bo=(mk==='BONOS'||mk==='ON'),q=Math.abs(parseFloat(_opVal('m-qty'))),p=parseFloat(_opVal('m-precio-ars'));
      return {tipo:tp,ticker:_opVal('m-ticker').trim().toUpperCase(),qty:q,precio:p,unidad:bo?'c/100 nominales':'',total:bo?q*p/100:q*p,fecha:_opFecha('m-fecha'),mkt:_opMktNom('m-mkt')};});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
  setInterval(function(){var n=document.getElementById('cart-chip-n');if(n&&n.textContent!==cartNombre())n.textContent=cartNombre();},1500);
})();

// ─── Monto en USD de un cobro ─────────────────────────────────────────────────
function _divTC(x){var f=String(x.fecha||''),dmy=f.indexOf('-')>0?f.split('-').reverse().join('/'):f;return getMEP(dmy)||(typeof MEP_HOY!=='undefined'&&MEP_HOY)||+x.cclUsado||CCL_HOY||0;}
function _divUSDMal(x){return x&&x.moneda==='ARS'&&x.montoUSD!=null&&x.montoUSD!==''&&(+x.montoUSD)>0.5*(+x.monto||0)&&(+x.monto)>0;}
function divUSD(x){
  if(!x)return 0;if(x.moneda==='USD')return +(x.montoUSD!=null&&x.montoUSD!==''?x.montoUSD:x.monto)||0;
  var tc=_divTC(x);return tc>0?(+x.monto||0)/tc:0;
}
function divsReparar(){
  if(typeof _gdcInitDone==='undefined'||!_gdcInitDone){setTimeout(divsReparar,3000);return;}
  var n=0;(TRK.divs||[]).forEach(function(x){if(!x||x.moneda!=='ARS'||!(+x.monto>0))return;var tc=_divTC(x);if(!(tc>0))return;
    var nuevo=Math.round((+x.monto)/tc*100)/100;
    var mal=_divUSDMal(x),ajustaPPC=x.pncApplied&&x.pncTarget==='ppc'&&x.montoPPC==null;
    if(!mal&&(ajustaPPC||Math.abs((+x.montoUSD||0)-nuevo)<=Math.max(0.01,nuevo*0.005)))return;
    x._montoUSDantes=x.montoUSD;x.montoUSD=nuevo;x.cclUsado=tc;n++;});
  if(n){console.warn('[divsReparar] '+n+' cobros en pesos recalculados en USD al MEP de su fecha');trkSave();try{trkRender();}catch(e){}try{}catch(e){}_famLastSave=0;try{renderPortfolio();}catch(e){}}
}

// ─── Tipo de cada cobro: dividendo, renta o amortización ──────────────────────
var _divTipoCache=null;
function _divTipoUltimos(){
  if(_divTipoCache&&_divTipoCache.n===TRK.divs.length)return _divTipoCache;
  var ult={},abiertos={};try{getPositions().forEach(function(p){if(p.qty>0.000001)abiertos[p.ticker]=1;});}catch(e){}
  (TRK.divs||[]).forEach(function(x){if(x.estado==='pendiente')return;var f=_infISO(x.fecha);if(!ult[x.ticker]||f>ult[x.ticker].f)ult[x.ticker]={f:f,id:x.id};});
  _divTipoCache={n:TRK.divs.length,ult:ult,ab:abiertos};return _divTipoCache;
}
function divTipo(x){
  if(x.tipo==='DIV'||x.tipo==='RENTA'||x.tipo==='AMORT')return x.tipo;
  var s=getSector(x.ticker);if(['bonos','on'].indexOf(s)<0&&!/^(S|X|LE|T)\d|^[A-Z]{2,4}\d{2}[A-Z]?$/.test(x.ticker)&&s!=='bonos')return 'DIV';
  var c=_divTipoUltimos();if(!c.ab[x.ticker]&&c.ult[x.ticker]&&c.ult[x.ticker].id===x.id)return 'AMORT';
  return 'RENTA';
}
function divTipoCambiar(id){
  var x=(TRK.divs||[]).find(function(d){return d.id===id;});if(!x)return;
  var sig={DIV:'RENTA',RENTA:'AMORT',AMORT:'DIV'}[divTipo(x)];x.tipo=sig;_divTipoCache=null;
  trkSave();try{trkRender();}catch(e){}_famLastSave=0;try{renderPortfolio();}catch(e){}
}

// ─── Chequeo de salud (lo lee el index en "🩺 Chequeo") ───────────────────────
function saludCalc(d){
  var out={ts:Date.now(),pend:0,faltaTC:[],neg:[],sinPrecio:(d&&d.sinPrecio)||[],bk:null};
  var lim=Date.now()-400*86400000,falta={};
  var _t=function(dmy){var p=String(dmy||'').split('/');return p.length===3?new Date(+p[2],+p[1]-1,+p[0]).getTime():0;};
  (TRK.divs||[]).forEach(function(x){
    if(x.estado==='pendiente'){out.pend++;return;}
    if(x.moneda!=='ARS')return;var f=_infISO(x.fecha);if(!f)return;var dmy=f.split('-').reverse().join('/');
    if(_t(dmy)>=lim&&!MEP_TABLE[dmy])falta[dmy]='MEP';});
  (movimientos||[]).forEach(function(m){
    if((m.tipo!=='compra'&&m.tipo!=='venta')||!(+m.precioARS>0)||m.ccl)return;
    try{if(_t(m.fecha)>=lim&&!getCCL(m.fecha))falta[fmtKey(m.fecha)]=(falta[fmtKey(m.fecha)]?'CCL y MEP':'CCL');}catch(e){}});
  out.faltaTC=Object.keys(falta).sort(function(a,b){return _t(b)-_t(a);}).slice(0,10).map(function(k){return k+' ('+falta[k]+')';});
  out.faltaN=Object.keys(falta).length;
  try{getPositions().forEach(function(p){if(p.qty<-0.000001)out.neg.push(p.ticker);});}catch(e){}
  try{out.bk=localStorage.getItem(PFX+'bk_last')||null;}catch(e){}
  return out;
}

// ─── Aportes y retiros de dinero (CFG.aportes) — rendimiento por el método de Dietz modificado ─────
var APOR=null,_aporLoaded=false;
async function aporLoad(){
  if(_aporLoaded)return APOR;
  var _pc=await _sbCfgDePrecarga('flujos_capital');if(_pc){APOR=Array.isArray(_pc.v)?_pc.v:[];_aporLoaded=true;try{localStorage.setItem(PFX+'apor',JSON.stringify(APOR));}catch(e){}return APOR;}
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/config?key=eq.flujos_capital&select=value',{headers:sbHeaders()});
    if(!r.ok)return null;var d=await r.json();if(!Array.isArray(d))return null;
    var v=d[0]?d[0].value:null;if(typeof v==='string'){try{v=JSON.parse(v);}catch(e){v=null;}}
    APOR=Array.isArray(v)?v:[];_aporLoaded=true;try{localStorage.setItem(PFX+'apor',JSON.stringify(APOR));}catch(e){}return APOR;
  }catch(e){return null;}
}
async function aporSave(){
  if(!_aporLoaded)return false;
  APOR.sort(function(a,b){return a.fecha<b.fecha?-1:a.fecha>b.fecha?1:a.id-b.id;});
  var ok=await sbSetConfig('flujos_capital',APOR);
  if(!ok)alert('No se pudo guardar en Supabase. Revisá la conexión y volvé a intentar (lo cargado sigue en pantalla).');
  return ok;
}
function _aporDias(a,b){var p=a.split('-'),q=b.split('-');return Math.round((new Date(+q[0],+q[1]-1,+q[2])-new Date(+p[0],+p[1]-1,+p[2]))/86400000);}
function aporIni(){var c=(typeof histUltimoCorte==='function')?histUltimoCorte():null;return c||(_hHoy().slice(0,4)+'-01-01');}
function aporDelPeriodo(){var ini=aporIni(),hoy=_hHoy();return (APOR||[]).filter(function(x){return x.fecha>=ini&&x.fecha<=hoy;});}
function _aporCartOk(){return typeof CARTERA_ACTIVA==='undefined'||!CARTERA_ACTIVA||CARTERA_ACTIVA==='principal';}
function aporCalc(val,inv){
  if(!CFG.aportes||!_aporLoaded||!(inv>0)||!_aporCartOk())return null;
  var ini=aporIni(),hoy=_hHoy(),T=Math.max(1,_aporDias(ini,hoy)),ap=0,re=0,pond=0;
  aporDelPeriodo().forEach(function(x){var u=+x.usd||0,w=Math.max(0,Math.min(1,_aporDias(x.fecha,hoy)/T));
    if(x.tipo==='retiro'){re+=u;pond-=u*w;}else{ap+=u;pond+=u*w;}});
  var neto=ap-re,gan=val-inv-neto,base=inv+pond;
  return {ini:ini,ap:ap,re:re,neto:neto,gan:gan,base:base,rend:base>0?gan/base*100:null,rendSimple:(inv+neto)>0?gan/(inv+neto)*100:null,n:aporDelPeriodo().length};
}
function aporNeto(){var c=_aporCartOk()?aporCalc(1,1):null;if(!c&&CFG.aportes&&_aporLoaded){var ini=aporIni(),hoy=_hHoy(),n=0;(APOR||[]).forEach(function(a){if(a.fecha>=ini&&a.fecha<=hoy)n+=(a.tipo==='retiro'?-1:1)*(+a.usd||0);});return n;}return c?c.neto:0;}
function _aporTC(iso){var dmy=iso.split('-').reverse().join('/');return getMEP(dmy)||(iso===_hHoy()&&MEP_HOY>0?MEP_HOY:null);}
function aporAgregar(fecha,tipo,moneda,monto,nota){
  if(!_aporLoaded){alert('Todavía no se cargaron los aportes guardados. Esperá unos segundos y probá de nuevo.');return false;}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(fecha)||!(monto>0)){alert('Fecha o monto inválido.');return false;}
  if(fecha>_hHoy()){alert('La fecha es futura.');return false;}
  var tc=null,usd=monto;
  if(moneda==='ARS'){tc=_aporTC(fecha);
    if(!tc){var dmy=fecha.split('-').reverse().join('/'),v=prompt('No hay MEP cargado para el '+dmy+' en este portafolio.\nIngresá el MEP de ese día (se guarda también en Tipo de cambio):','');
      v=parseFloat(String(v||'').replace(/\./g,'').replace(',','.'));
      if(v>0){MEP_TABLE[fmtKey(dmy)]=v;try{tcSavePersist();}catch(e){}try{tcRender();}catch(e){}tc=v;}
      else{alert('Falta el MEP del '+dmy+'. Cargalo en Tipo de cambio y volvé a intentar.');return false;}}
    usd=Math.round(monto/tc*100)/100;}
  APOR.push({id:Date.now()+Math.floor(Math.random()*1000),fecha:fecha,tipo:tipo==='retiro'?'retiro':'aporte',moneda:moneda,monto:monto,usd:usd,tc:tc,nota:nota||''});
  return true;
}
async function aporAgregarForm(){
  var g=function(id){return document.getElementById(id);};
  var monto=parseFloat(String(g('apor-monto').value).replace(/\./g,'').replace(',','.'));
  if(!aporAgregar(g('apor-fecha').value,g('apor-tipo').value,g('apor-mon').value,monto,g('apor-nota').value))return;
  g('apor-monto').value='';g('apor-nota').value='';
  await aporSave();aporRefrescar();
}
async function aporPegar(){
  var ta=document.getElementById('apor-txt'),st=document.getElementById('apor-st'),L=String(ta.value||'').split(/\r?\n/).map(function(x){return x.trim();}).filter(Boolean);
  var ok=0,err=[],prev=(APOR||[]).slice();
  L.forEach(function(l,i){var c=l.split(/[;\t]/).map(function(x){return x.trim();});
    var m=(c[0]||'').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!m){err.push('línea '+(i+1)+': fecha');return;}
    var f=m[3]+'-'+('0'+m[2]).slice(-2)+'-'+('0'+m[1]).slice(-2),t=/^r/i.test(c[1]||'')?'retiro':'aporte',mo=/ars|\$|peso/i.test(c[2]||'')&&!/us/i.test(c[2]||'')?'ARS':'USD';
    var s=String(c[3]||'').replace(/[^\d,.\-]/g,'');if(s.indexOf(',')>=0||/^-?\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'').replace(',','.');var n=parseFloat(s);
    if(prev.some(function(x){return x.fecha===f&&x.tipo===t&&x.moneda===mo&&Math.abs(x.monto-n)<0.005;})){err.push('línea '+(i+1)+': ya estaba');return;}
    var a0=window.alert;window.alert=function(msg){err.push('línea '+(i+1)+': '+msg);};
    try{if(aporAgregar(f,t,mo,n,c[4]||''))ok++;}finally{window.alert=a0;}});
  if(ok){await aporSave();ta.value='';}
  _aporMsg=ok+' cargado(s)'+(err.length?' · '+err.join(' · '):'');_aporMsgErr=!!err.length;aporRefrescar();
}
async function aporBorrar(id){
  var x=(APOR||[]).find(function(a){return a.id===id;});if(!x)return;
  if(!confirm('¿Borrar el '+x.tipo+' del '+x.fecha.split('-').reverse().join('/')+' por USD '+Math.round(x.usd).toLocaleString('es-AR')+'?'))return;
  APOR=APOR.filter(function(a){return a.id!==id;});await aporSave();aporRefrescar();
}
function aporAjustarInv(){
  var c=aporCalc(1,1);if(!c||!c.neto)return;var inv=getRawNum('inv-sidebar-usd');if(!(inv>0))return;var nueva=Math.round(inv-c.neto);
  if(!confirm('Si ya habías sumado estos aportes a mano en la Inv. Inicial:\n\nInv. Inicial USD '+Math.round(inv).toLocaleString('es-AR')+' − aportes netos USD '+Math.round(c.neto).toLocaleString('es-AR')+' = USD '+nueva.toLocaleString('es-AR')+'\n\n¿La cambio?'))return;
  setFmtNum('inv-sidebar-usd',nueva,0);if(typeof saveInvInicial==='function')saveInvInicial(nueva);aporRefrescar();
}
function aporRefrescar(){try{renderPortfolio();}catch(e){}aporRender();try{histRender();}catch(e){}}
var _aporUlt=null,_aporMsg='',_aporMsgErr=false;
function aporSumHTML(){
  var c=_aporUlt,ini=aporIni(),fd=function(i){return i.split('-').reverse().join('/');},n0=function(v){return Math.round(v).toLocaleString('es-AR');};
  var pc=function(v){return v==null?'—':'<b style="color:'+(v>=0?'var(--accent)':'var(--red)')+'">'+(v>=0?'+':'')+v.toFixed(1).replace('.',',')+'%</b>';};
  return '<div style="font-family:var(--mono);font-size:.7rem;color:var(--text2);line-height:1.7">Período desde <b>'+fd(ini)+'</b>'+
    (c?' · Inv. inicial USD '+n0(c.inv)+' · Aportes USD '+n0(c.ap)+(c.re?' · Retiros USD '+n0(c.re):'')+
      '<br>Ganancia <b style="color:'+(c.gan>=0?'var(--accent)':'var(--red)')+'">USD '+n0(c.gan)+'</b> · Rendimiento '+pc(c.rend)+
      (c.n?' <span style="color:var(--text3)" title="Lo que daba sumando los aportes a la Inv. Inicial (como si hubieran estado todo el período)">(sin ponderar '+(c.rendSimple==null?'—':c.rendSimple.toFixed(1).replace('.',','))+'%)</span>':''):' · cargá la Inv. Inicial')+'</div>';
}
function aporSumRender(){var e=document.getElementById('apor-sum');if(e)e.innerHTML=aporSumHTML();else aporRender();}
function aporRender(){
  if(!CFG.aportes)return;
  var _ac=document.getElementById('apor-card');if(!_aporCartOk()){if(_ac)_ac.style.display='none';return;}else if(_ac)_ac.style.display='';
  var card=document.getElementById('apor-card');
  if(!card){var row=(typeof topCardsRow==='function')?topCardsRow():null;if(!row)return;
    card=document.createElement('div');card.className='card';card.id='apor-card';
    card.innerHTML='<div class="card-header" style="display:flex;align-items:center;gap:8px"><span class="card-title">💵 Aportes y retiros</span><span style="margin-left:auto"></span></div><div id="apor-body" style="padding:.7rem 1rem 1rem"></div>';
    row.appendChild(card);topCardPrep(card,'1 1 340px');}
  var b=document.getElementById('apor-body');if(!b)return;
  if(!_aporLoaded){b.innerHTML='<div class="smsg">Cargando…</div>';return;}
  var c=_aporUlt,ini=aporIni(),fd=function(i){return i.split('-').reverse().join('/');},n0=function(v){return Math.round(v).toLocaleString('es-AR');};
  var pc=function(v){return v==null?'—':'<b style="color:'+(v>=0?'var(--accent)':'var(--red)')+'">'+(v>=0?'+':'')+v.toFixed(1).replace('.',',')+'%</b>';};
  var mono='font-family:var(--mono);font-size:.7rem';
  var h='<div id="apor-sum">'+aporSumHTML()+'</div>'+saltosHTML();
  h+='<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;align-items:center">'+
    '<input type="date" id="apor-fecha" value="'+_hHoy()+'" style="'+mono+';width:128px">'+
    '<select id="apor-tipo" style="'+mono+'"><option value="aporte">Aporte</option><option value="retiro">Retiro</option></select>'+
    '<select id="apor-mon" style="'+mono+'"><option>USD</option><option value="ARS">ARS (al MEP)</option></select>'+
    '<input id="apor-monto" placeholder="Monto" inputmode="decimal" style="'+mono+';width:100px">'+
    '<input id="apor-nota" placeholder="Nota" style="'+mono+';width:110px">'+
    '<button class="btn btn-a btn-sm" onclick="aporAgregarForm()">Agregar</button></div>';
  var L=(APOR||[]).slice().sort(function(a,b){return a.fecha<b.fecha?1:-1;});
  if(L.length)h+='<div class="tw" style="max-height:220px;overflow-y:auto;margin-top:8px"><table><thead><tr><th>Fecha</th><th>Tipo</th><th style="text-align:right">Monto</th><th style="text-align:right">USD</th><th></th></tr></thead><tbody>'+
    L.map(function(x){var fuera=x.fecha<ini;return '<tr style="'+(fuera?'opacity:.45':'')+'" title="'+(fuera?'Período anterior (ya forma parte de la Inv. Inicial)':'')+(x.nota?' '+x.nota.replace(/"/g,''):'')+'"><td class="mono">'+fd(x.fecha)+'</td><td style="color:'+(x.tipo==='retiro'?'var(--red)':'var(--accent)')+'">'+x.tipo+'</td><td class="mono" style="text-align:right">'+(x.moneda==='ARS'?'$ '+n0(x.monto)+'<span style="color:var(--text3)"> /'+n0(x.tc)+'</span>':'US$ '+n0(x.monto))+'</td><td class="mono" style="text-align:right">'+(x.tipo==='retiro'?'−':'')+n0(x.usd)+'</td><td><button class="btn btn-d btn-sm" onclick="aporBorrar('+x.id+')">x</button></td></tr>';}).join('')+'</tbody></table></div>';
  h+='<details style="margin-top:8px"'+(_aporMsg?' open':'')+'><summary style="'+mono+';color:var(--text3);cursor:pointer">Carga masiva / ajustar Inv. Inicial</summary>'+
    '<div style="'+mono+';color:var(--text3);margin:6px 0">Una línea por movimiento: <b>dd/mm/aaaa;aporte o retiro;USD o ARS;monto;nota</b> (los ARS se pasan al MEP de esa fecha).</div>'+
    '<textarea id="apor-txt" rows="4" style="width:100%;background:var(--surface2);color:var(--text);border:1px solid var(--border2);border-radius:6px;padding:.4rem;'+mono+'" placeholder="15/03/2026;aporte;ARS;5.000.000;sueldo&#10;02/07/2026;retiro;USD;1000"></textarea>'+
    '<div style="display:flex;gap:6px;align-items:center;margin-top:6px;flex-wrap:wrap"><button class="btn btn-a btn-sm" onclick="aporPegar()">Cargar</button>'+
    (c&&c.neto?'<button class="btn btn-sm" onclick="aporAjustarInv()" title="Usalo una sola vez si los aportes de este período ya los habías sumado a mano en la Inv. Inicial">Restar aportes de la Inv. Inicial</button>':'')+
    '<span id="apor-st" class="'+(_aporMsgErr?'emsg':'smsg')+'" style="'+(_aporMsgErr?'color:var(--red)':'')+'">'+String(_aporMsg).replace(/</g,'&lt;')+'</span></div></details>';
  h+='<div style="'+mono+';font-size:.6rem;color:var(--text3);margin-top:6px">Ganancia = valor − Inv. inicial − aportes + retiros. Rendimiento = ganancia ÷ capital promedio (cada aporte pesa según los días que estuvo invertido).</div>';
  var foc=document.activeElement&&document.activeElement.id,keep={};['apor-fecha','apor-tipo','apor-mon','apor-monto','apor-nota','apor-txt'].forEach(function(id){var e=document.getElementById(id);if(e)keep[id]=e.value;});
  b.innerHTML=h;
  Object.keys(keep).forEach(function(id){var e=document.getElementById(id);if(e&&keep[id]!=null&&keep[id]!=='')e.value=keep[id];});if(foc&&document.getElementById(foc))document.getElementById(foc).focus();
}
(function _aporBoot(n){setTimeout(function(){if(!CFG.aportes)return;if(typeof _gdcInitDone!=='undefined'&&_gdcInitDone){aporLoad().then(async function(a){if(a){await saltosOkLoad();if(CFG.historial)await histLoad();try{renderPortfolio();}catch(e){}aporRender();try{histRender();}catch(e){}}else if(n<40)_aporBoot(n+1);});}else if(n<40)_aporBoot(n+1);},1500);})(0);

function rendPeriodos(){
  var per={};Object.keys(CFG.rendAnual||{}).forEach(function(y){var r=+CFG.rendAnual[y];if(isFinite(r))per[y]=Math.round(r*100)/100;});
  ((typeof HIST!=='undefined'&&HIST&&HIST.cierres)||[]).forEach(function(cz){if(cz.rendFinal!=null)per[String(parseInt(cz.d.slice(0,4),10)-1)]=Math.round(cz.rendFinal*100)/100;});
  var corte=(typeof histUltimoCorte==='function')?histUltimoCorte():null;if(corte)delete per[corte.slice(0,4)];
  return per;
}

// ─── Detector de aportes/retiros sin cargar ───────────────────────────────────
var SALTOS_OK=null;
async function saltosOkLoad(){if(SALTOS_OK)return SALTOS_OK;try{var v=await sbGetConfig('saltos_ok');SALTOS_OK=Array.isArray(v)?v:[];}catch(e){SALTOS_OK=[];}return SALTOS_OK;}
function saltosDetectar(){
  if(!CFG.aportes||!_aporLoaded||typeof histSerie!=='function'||!HIST)return [];
  var s=histSerie().filter(function(x){return !x.previo&&x.v>0;});
  var lim=new Date();lim.setDate(lim.getDate()-90);var limS=lim.getFullYear()+'-'+('0'+(lim.getMonth()+1)).slice(-2)+'-'+('0'+lim.getDate()).slice(-2);
  var ok=SALTOS_OK||[],out=[];
  for(var i=1;i<s.length;i++){var a=s[i-1],b=s[i];if(b.d<limS||ok.indexOf(b.d)>=0)continue;
    var fl=0;(APOR||[]).forEach(function(x){if(x.fecha>a.d&&x.fecha<=b.d)fl+=(x.tipo==='retiro'?-1:1)*(+x.usd||0);});
    var res=b.v-a.v-fl,dias=_aporDias(a.d,b.d),th=Math.max(500,a.v*(dias<=4?0.06:0.10));
    if(Math.abs(res)>th)out.push({d:b.d,desde:a.d,dif:Math.round(res),pct:Math.round(res/a.v*1000)/10});}
  return out.slice(-6);
}
async function saltoEsMercado(d){await saltosOkLoad();if(SALTOS_OK.indexOf(d)<0)SALTOS_OK.push(d);await sbSetConfig('saltos_ok',SALTOS_OK);_famLastSave=0;aporRender();try{renderPortfolio();}catch(e){}}
function saltoCargar(d,dif){
  var f=document.getElementById('apor-fecha'),t=document.getElementById('apor-tipo'),m=document.getElementById('apor-mon'),mo=document.getElementById('apor-monto');
  if(f)f.value=d;if(t)t.value=dif<0?'retiro':'aporte';if(m)m.value='USD';if(mo){mo.value=String(Math.abs(dif));mo.focus();}
}
function saltosHTML(){
  var L=saltosDetectar();if(!L.length)return '';
  var fd=function(i){return i.split('-').reverse().join('/');};
  return '<div style="margin-top:8px;padding:.45rem .6rem;border:1px solid var(--amber);border-radius:6px;background:rgba(234,179,8,.08);font-family:var(--mono);font-size:.66rem;line-height:1.7">'+
    '⚠ <b>¿Entró o salió plata?</b> El valor saltó más de lo que se mueve el mercado:'+
    L.map(function(x){return '<div>'+fd(x.desde)+' → <b>'+fd(x.d)+'</b>: <b style="color:'+(x.dif>=0?'var(--accent)':'var(--red)')+'">'+(x.dif>=0?'+':'−')+'USD '+Math.abs(x.dif).toLocaleString('es-AR')+'</b> ('+(x.pct>=0?'+':'')+String(x.pct).replace('.',',')+'%) '+
      '<button class="btn btn-sm" style="font-size:.6rem;padding:0 6px" onclick="saltoCargar(\''+x.d+'\','+x.dif+')">Cargar</button> '+
      '<button class="btn btn-sm" style="font-size:.6rem;padding:0 6px" onclick="saltoEsMercado(\''+x.d+'\')">Es mercado</button></div>';}).join('')+
    '<div style="color:var(--text3)">"Cargar" completa el formulario con fecha y monto aproximado: corregí el monto real antes de agregar.</div></div>';
}

// ─── Cierre de período asistido ───────────────────────────────────────────────
function _cierreRango(corte){var y=parseInt(corte.slice(0,4),10)-1;return {ini:y+corte.slice(4),fin:corte};}
function cierreCalc(V,inv,ini,fin){
  var T=Math.max(1,_aporDias(ini,fin)),ap=0,re=0,pond=0;
  (CFG.aportes&&_aporLoaded?APOR:[]).forEach(function(x){if(x.fecha<ini||x.fecha>=fin)return;var u=+x.usd||0,w=Math.max(0,Math.min(1,_aporDias(x.fecha,fin)/T));
    if(x.tipo==='retiro'){re+=u;pond-=u*w;}else{ap+=u;pond+=u*w;}});
  var neto=ap-re,gan=V-inv-neto,base=inv+pond;return {ap:ap,re:re,neto:neto,gan:gan,rend:base>0?gan/base*100:null};
}
function cierreAbrir(){
  var corte=histUltimoCorte();if(!corte)return;var r=_cierreRango(corte);
  var serie=histSerie().filter(function(x){return !x.previo&&x.d<=corte;}),p=serie[serie.length-1];
  var inv=getRawNum('inv-sidebar-usd')||0,V=p?Math.round(p.v*100)/100:'';
  var fd=function(i){return i.split('-').reverse().join('/');};
  var ov=document.getElementById('cierre-dlg');if(ov)ov.remove();
  ov=document.createElement('div');ov.id='cierre-dlg';ov.onclick=function(e){if(e.target===ov)ov.remove();};
  ov.style.cssText='position:fixed;inset:0;z-index:100002;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px';
  var inp='width:100%;background:var(--surface2);color:var(--text);border:1px solid var(--border2);border-radius:6px;padding:.4rem .5rem;font-family:var(--mono);font-size:.84rem';
  var lb='font-family:var(--mono);font-size:.6rem;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin:.55rem 0 .2rem';
  ov.innerHTML='<div style="background:var(--surface);border:1px solid var(--border2);border-radius:12px;max-width:460px;width:100%;padding:1rem 1.1rem;font-family:var(--sans);color:var(--text)">'+
    '<div style="font-weight:700;font-size:.95rem">📅 Cerrar período de '+CFG.nombre+'</div>'+
    '<div style="font-family:var(--mono);font-size:.64rem;color:var(--text3);margin-top:2px">'+fd(r.ini)+' → '+fd(r.fin)+'</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 10px">'+
      '<div><div style="'+lb+'">Inv. inicial del período</div><input id="cie-inv" type="number" step="any" value="'+(Math.round(inv*100)/100)+'" style="'+inp+'" oninput="cierreRecalc()"></div>'+
      '<div><div style="'+lb+'">Valor al '+fd(r.fin)+' USD</div><input id="cie-val" type="number" step="any" value="'+V+'" style="'+inp+'" oninput="cierreRecalc()"></div>'+
    '</div>'+
    '<div style="font-family:var(--mono);font-size:.58rem;color:var(--text3);margin-top:3px">'+(p?'Propuesto: el valor de la app del '+fd(p.d)+'. Si tenés el del broker al cierre, usá ese.':'Cargá el valor del broker al cierre.')+'</div>'+
    '<div id="cie-res" style="margin-top:.7rem;padding:.55rem .7rem;background:var(--surface2);border:1px solid var(--border);border-radius:8px;font-family:var(--mono);font-size:.76rem;line-height:1.6"></div>'+
    '<div style="font-family:var(--mono);font-size:.6rem;color:var(--text3);margin-top:.5rem">Al confirmar: se guarda el resultado del período, la nueva Inv. Inicial pasa a ser el valor al cierre y los aportes del período nuevo empiezan en cero.'+(CFG.honorario?' Después se abre 💼 Honorario con estos datos.':'')+'</div>'+
    '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:.8rem"><button class="btn btn-sm" onclick="document.getElementById(\'cierre-dlg\').remove()">Cancelar</button><button class="btn btn-a btn-sm" onclick="cierreGuardar()">Cerrar período</button></div></div>';
  document.body.appendChild(ov);cierreRecalc();
}
function cierreRecalc(){
  var corte=histUltimoCorte(),r=_cierreRango(corte),inv=parseFloat(document.getElementById('cie-inv').value),V=parseFloat(document.getElementById('cie-val').value),el=document.getElementById('cie-res');
  if(!(inv>0)||!(V>0)){el.textContent='Falta la Inv. inicial o el valor al cierre.';return null;}
  var c=cierreCalc(V,inv,r.ini,r.fin),n0=function(v){return Math.round(v).toLocaleString('es-AR');};
  el.innerHTML='Aportes USD '+n0(c.ap)+(c.re?' · Retiros USD '+n0(c.re):'')+'<br>Ganancia del período: <b style="color:'+(c.gan>=0?'var(--accent)':'var(--red)')+'">'+(c.gan>=0?'+':'−')+'USD '+n0(Math.abs(c.gan))+'</b><br>Rendimiento: <b style="color:'+(c.rend>=0?'var(--accent)':'var(--red)')+'">'+(c.rend==null?'—':(c.rend>=0?'+':'')+c.rend.toFixed(2).replace('.',',')+'%')+'</b>'+
    (CFG.honorario?'<br>Honorario '+Math.round(CFG.honorario*100)+'%: <b>USD '+n0(Math.max(0,c.gan*CFG.honorario))+'</b>':'');
  return c;
}
async function cierreGuardar(){
  var corte=histUltimoCorte();if(!corte)return;var r=_cierreRango(corte);
  var inv=parseFloat(document.getElementById('cie-inv').value),V=parseFloat(document.getElementById('cie-val').value);
  var c=cierreRecalc();if(!c)return;
  if(HIST.cierres.some(function(x){return x.d===corte;})&&!confirm('Ya hay un cierre guardado para el '+corte.split('-').reverse().join('/')+'. ¿Reemplazarlo?'))return;
  HIST.cierres=HIST.cierres.filter(function(x){return x.d!==corte;});
  HIST.cierres.push({d:corte,valor:Math.round(V*100)/100,invAnterior:inv,aportesNetos:Math.round(c.neto*100)/100,ganancia:Math.round(c.gan*100)/100,rendFinal:c.rend!=null?Math.round(c.rend*100)/100:null,fechaCierre:_hHoy()});
  var ok=await sbSetConfig('historial',HIST);if(!ok){alert('No se pudo guardar el cierre en la nube. Probá de nuevo.');return;}
  var nueva=Math.round(V*100)/100;setFmtNum('inv-sidebar-usd',nueva,0);saveInvInicial(nueva);
  var di=document.getElementById('inv-inicial-usd-display');if(di)di.textContent='$'+Math.round(nueva).toLocaleString('es-AR');
  var dl=document.getElementById('cierre-dlg');if(dl)dl.remove();
  _famLastSave=0;try{renderPortfolio();}catch(e){}try{histRender();}catch(e){}try{aporRender();}catch(e){}
  if(CFG.honorario&&typeof honAbrir==='function')honAbrir({ini:r.ini,fin:r.fin,inv:inv,val:V,apn:c.neto});
}

// ─── Modo celular simplificado ────────────────────────────────────────────────
var _mobFull=false;try{_mobFull=sessionStorage.getItem(PFX+'mob_full')==='1';}catch(e){}
function mobActivo(){return window.innerWidth<=680&&!_mobFull;}
(function(){try{var st=document.createElement('style');st.id='mob-simple-css';st.textContent=
  'body.mob-simple #page-portafolio>*:not(#mob-view){display:none!important}'+
  'body.mob-simple #mobile-filters{display:none!important}'+
  '#mob-view{display:none}body.mob-simple #mob-view{display:flex;flex-direction:column;gap:10px;padding:.6rem .7rem 1.2rem}'+
  '#mob-view .mb{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:11px 12px}'+
  '#mob-view .ml{font-family:var(--mono);font-size:.58rem;color:var(--text3);text-transform:uppercase;letter-spacing:.07em}'+
  '#mob-view .mbig{font-family:var(--mono);font-size:1.6rem;font-weight:700;letter-spacing:-.02em}'+
  '#mob-view .mkp{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:8px}'+
  '#mob-view .mkp>div{background:var(--surface2);border-radius:8px;padding:6px 7px;min-width:0}'+
  '#mob-view .mkv{font-family:var(--mono);font-weight:700;font-size:.86rem;margin-top:2px}'+
  '#mob-view .msub{font-size:.6rem;color:var(--text2)}'+
  '#mob-view .mal{display:flex;gap:8px;align-items:flex-start;font-size:.76rem;padding:6px 0;border-bottom:1px solid var(--border)}#mob-view .mal:last-child{border-bottom:none;padding-bottom:0}'+
  '#mob-view .mrow{display:flex;justify-content:space-between;gap:8px;font-family:var(--mono);font-size:.76rem;padding:2px 0}'+
  '#mob-view .mmv{display:grid;grid-template-columns:1fr 1fr;gap:12px}'+
  '#mob-view .mbar{display:flex;height:16px;border-radius:5px;overflow:hidden;gap:2px;margin-top:6px}#mob-view .mbar span{display:flex;align-items:center;justify-content:center;font-size:.56rem;font-weight:700;color:#0b1120;white-space:nowrap;overflow:hidden}'+
  '#mob-view .mpos{display:grid;grid-template-columns:1fr auto auto;gap:4px 12px;font-family:var(--mono);font-size:.76rem;margin-top:6px}'+
  '#mob-view .mbtn{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}#mob-view .mbtn button{background:var(--surface2);border:1px solid var(--border2);border-radius:10px;padding:8px 2px;color:var(--text2);font-size:.64rem;font-family:var(--sans)}#mob-view .mbtn button b{display:block;font-size:1.05rem;margin-bottom:2px}'+
  '#mob-view .mlink{text-align:center;font-family:var(--mono);font-size:.72rem;color:var(--blue,#448aff);padding:6px 0;cursor:pointer}'+
  '#mob-simple-btn{position:fixed;left:8px;bottom:8px;z-index:9600;background:var(--surface2);border:1px solid var(--border2);color:var(--text2);border-radius:16px;font-size:.64rem;padding:5px 10px;font-family:var(--mono);display:none}'+
  '@media(max-width:680px){body:not(.mob-simple) #mob-simple-btn{display:block}}';
  (document.head||document.documentElement).appendChild(st);}catch(e){}})();
function mobAplicar(){var on=mobActivo();document.body.classList.toggle('mob-simple',on);
  if(!document.getElementById('mob-simple-btn')){var b=document.createElement('button');b.id='mob-simple-btn';b.textContent='📱 Vista simple';b.onclick=mobVistaSimple;document.body.appendChild(b);}}
function mobVerTodo(){_mobFull=true;try{sessionStorage.setItem(PFX+'mob_full','1');}catch(e){}mobAplicar();window.scrollTo(0,0);}
function mobVistaSimple(){_mobFull=false;try{sessionStorage.removeItem(PFX+'mob_full');}catch(e){}
  var nb=document.querySelector('.nav-item');if(typeof showPage==='function'&&nb)try{showPage('portafolio',nb);}catch(e){}mobAplicar();window.scrollTo(0,0);}
window.addEventListener('resize',function(){try{mobAplicar();}catch(e){}});
function mobIr(que){
  mobVerTodo();
  if(que==='compra'&&typeof kbOperar==='function')return kbOperar('vbuy-ticker');
  if(que==='venta'&&typeof kbOperar==='function')return kbOperar('vsell-ticker');
  if(que==='cobro'){var b=[].slice.call(document.querySelectorAll('.nav-item')).find(function(x){return /Dividendos/.test(x.textContent);});if(b)b.click();return;}
  if(que==='aporte'){setTimeout(function(){var c=document.getElementById('apor-card');if(!c)return;if(c.classList.contains('card-collapsed')){var t=c.querySelector('.card-toggle');if(t)cardToggle(t);}c.scrollIntoView({behavior:'smooth',block:'start'});},120);}
}
var _mobPosTodas=false;
function mobRender(d){
  var page=document.getElementById('page-portafolio');if(!page)return;
  var v=document.getElementById('mob-view');if(!v){v=document.createElement('div');v.id='mob-view';page.insertBefore(v,page.firstChild);}
  mobAplicar();if(!mobActivo())return;
  var n0=function(x){return Math.round(x||0).toLocaleString('es-AR');},pc=function(x,dec){if(x==null||!isFinite(x))return '—';return (x>0?'+':x<0?'−':'')+Math.abs(x).toFixed(dec==null?1:dec).replace('.',',')+'%';};
  var cl=function(x){return x==null?'':x>0?'color:var(--accent)':x<0?'color:var(--red)':'color:var(--text2)';};
  var fd=function(i){return i.split('-').reverse().slice(0,2).join('/');};
  var open=(d.open||[]).filter(function(p){return p._valueUSD!=null&&p._valueUSD>0;});
  var chOf=function(p){var q=(typeof quotes!=='undefined')&&quotes[p.ticker];return q&&q.changePct!=null&&isFinite(q.changePct)?q.changePct:null;};
  var hoyUSD=0;open.forEach(function(p){var c=chOf(p);if(c!=null)hoyUSD+=p._valueUSD-p._valueUSD/(1+c/100);});
  var tot=d.valConLiq||0,hoyPct=tot>0?hoyUSD/(tot-hoyUSD)*100:null;
  var ini=(typeof aporIni==='function')?aporIni():null,inv=getRawNum('inv-sidebar-usd');
  var gan=(CFG.aportes&&_aporUlt)?_aporUlt.gan:(inv>0?tot-inv:null);
  var h='<div class="mb"><div class="ml">Valor total</div><div class="mbig">USD '+n0(tot)+'</div><div class="mkp">'+
    '<div><div class="ml">Hoy</div><div class="mkv" style="'+cl(hoyPct)+'">'+pc(hoyPct)+'</div><div class="msub">'+(hoyUSD>=0?'+':'−')+'USD '+n0(Math.abs(hoyUSD))+'</div></div>'+
    '<div><div class="ml">Período</div><div class="mkv" style="'+cl(d.rendPct)+'">'+pc(d.rendPct)+'</div><div class="msub">'+(ini?'desde '+fd(ini):'')+'</div></div>'+
    '<div><div class="ml">Ganancia</div><div class="mkv" style="'+cl(gan)+'">'+(gan==null?'—':(gan<0?'−':'')+n0(Math.abs(gan)))+'</div><div class="msub">USD del período</div></div></div></div>';
  var al=[];
  if(d.pv&&d.pv.length)al.push('🎯<div><b>'+d.pv.length+' llegaron a su P. Venta:</b> <span style="font-family:var(--mono);font-weight:700">'+d.pv.slice(0,6).join(' · ')+(d.pv.length>6?'…':'')+'</span></div>');
  try{(typeof saltosDetectar==='function'?saltosDetectar():[]).slice(-2).forEach(function(x){al.push('⚠️<div>¿Entró o salió plata el <b>'+fd(x.d)+'</b>? El valor saltó '+(x.dif>=0?'+':'−')+'USD '+n0(Math.abs(x.dif))+'</div>');});}catch(e){}
  try{var pend=(TRK.divs||[]).filter(function(x){return x.estado==='pendiente';}).length;if(pend)al.push('💰<div><b>'+pend+'</b> cobro'+(pend>1?'s':'')+' sin confirmar en Dividendos</div>');}catch(e){}
  try{var corte=histUltimoCorte();if(corte){var prox=(parseInt(corte.slice(0,4),10)+1)+corte.slice(4),dd=_aporDias(_hHoy(),prox);
    if(HIST&&!HIST.cierres.some(function(x){return x.d===corte;})&&HIST.puntos.length&&HIST.puntos[0].d<corte&&_aporDias(corte,_hHoy())<=60)al.push('📅<div>Pasó el corte del <b>'+fd(corte)+'</b>: cerrá el período</div>');
    else if(dd>=0&&dd<=15)al.push('📅<div>El período cierra en <b>'+dd+' día'+(dd!==1?'s':'')+'</b> ('+fd(prox)+')</div>');}}catch(e){}
  h+='<div class="mb"><div class="ml" style="margin-bottom:4px">Alertas</div>'+(al.length?al.map(function(a){return '<div class="mal">'+a+'</div>';}).join(''):'<div class="msub" style="font-size:.74rem">Sin alertas ✓</div>')+'</div>';
  var conCh=open.map(function(p){return {t:p.ticker,c:chOf(p)};}).filter(function(x){return x.c!=null&&x.c!==0;});
  var up=conCh.filter(function(x){return x.c>0;}).sort(function(a,b){return b.c-a.c;}).slice(0,3),dn=conCh.filter(function(x){return x.c<0;}).sort(function(a,b){return a.c-b.c;}).slice(0,3);
  var lst=function(a){return a.length?a.map(function(x){return '<div class="mrow"><span>'+x.t+'</span><span style="'+cl(x.c)+'">'+pc(x.c)+'</span></div>';}).join(''):'<div class="msub">—</div>';};
  h+='<div class="mb"><div class="ml" style="margin-bottom:6px">Lo que más se movió hoy</div><div class="mmv"><div>'+lst(up)+'</div><div>'+lst(dn)+'</div></div></div>';
  var lim=new Date();lim.setDate(lim.getDate()+7);var limS=lim.getFullYear()+'-'+('0'+(lim.getMonth()+1)).slice(-2)+'-'+('0'+lim.getDate()).slice(-2);
  var cob=(d.cobros||[]).filter(function(it){return it.fecha<=limS;});
  h+='<div class="mb"><div class="ml" style="margin-bottom:4px">Próximos cobros · 7 días</div>'+(cob.length?cob.slice(0,8).map(function(it){return '<div class="mrow"><span>'+fd(it.fecha)+' · '+it.ticker+'</span><span style="color:var(--accent)">'+(it.moneda==='USD'?'USD ':'$ ')+(it.total||0).toLocaleString('es-AR',{maximumFractionDigits:it.moneda==='USD'?0:0})+'</span></div>';}).join(''):'<div class="msub" style="font-size:.74rem">Nada en los próximos 7 días</div>')+'</div>';
  var sv=d.sectorVal||{},rf=0,rv=0;Object.keys(sv).forEach(function(k){if(['bonos','on','fci','letras'].indexOf(k)>=0)rf+=sv[k]||0;else rv+=sv[k]||0;});
  var lq=d.liq||0,T=rf+rv+lq||1,w=function(x){return Math.round(x/T*100);};
  h+='<div class="mb"><div class="ml">Distribución</div><div class="mbar">'+(rv>0?'<span style="width:'+w(rv)+'%;background:#00e676">RV '+w(rv)+'%</span>':'')+(rf>0?'<span style="width:'+w(rf)+'%;background:#448aff;color:#fff">RF '+w(rf)+'%</span>':'')+(lq>0?'<span style="width:'+Math.max(3,w(lq))+'%;background:#7a9cc5">'+w(lq)+'%</span>':'')+'</div>'+
    '<div class="msub" style="font-size:.66rem;margin-top:5px">'+(d.dolzPct!=null?'Dolarizado '+Math.round(d.dolzPct)+'% · ':'')+'Liquidez USD '+n0(lq)+'</div></div>';
  var ord=open.slice().sort(function(a,b){return b._valueUSD-a._valueUSD;}),most=_mobPosTodas?ord:ord.slice(0,5);
  h+='<div class="mb"><div class="ml">Mis posiciones</div><div class="mpos"><span class="ml">Ticker</span><span class="ml" style="text-align:right">USD</span><span class="ml" style="text-align:right">Hoy / Total</span>'+
    most.map(function(p){var c=chOf(p),t=p._pnlPct;return '<span>'+p.ticker+'</span><span style="text-align:right">'+n0(p._valueUSD)+'</span><span style="text-align:right"><span style="'+cl(c)+'">'+(c==null?'—':pc(c))+'</span> / <span style="'+cl(t)+'">'+(t==null?'—':pc(t,0))+'</span></span>';}).join('')+'</div>'+
    (ord.length>5?'<div class="mlink" onclick="_mobPosTodas=!_mobPosTodas;renderPortfolio()">'+(_mobPosTodas?'ver menos':'ver las '+ord.length+' posiciones ›')+'</div>':'')+'</div>';
  if(CFG.id==='gdc'){try{var hace=new Date();hace.setFullYear(hace.getFullYear()-1);var hS=hace.toISOString().slice(0,10),ing=0;
    (TRK.divs||[]).forEach(function(x){if(x.estado==='pendiente')return;var f=_infISO(x.fecha);if(!f||f<hS)return;if(divTipo(x)==='AMORT')return;ing+=divUSD(x)||0;});
    var mes=ing/12,meta=100000/12,pm=Math.min(100,mes/meta*100);
    h+='<div class="mb"><div style="display:flex;justify-content:space-between;align-items:baseline"><span class="ml">🎯 Meta USD '+n0(meta)+' / mes</span><span style="font-family:var(--mono);font-size:.72rem">hoy <b style="color:var(--accent)">USD '+n0(mes)+'</b></span></div>'+
      '<div style="height:8px;background:var(--surface2);border-radius:4px;overflow:hidden;margin-top:7px"><i style="display:block;height:100%;width:'+pm+'%;background:linear-gradient(90deg,#38bdf8,#00e676)"></i></div>'+
      '<div class="msub" style="margin-top:5px">'+pm.toFixed(1).replace('.',',')+'% de la meta · rentas y dividendos, promedio de 12 meses (los honorarios están en el index)</div></div>';}catch(e){}}
  h+='<div class="mb" style="padding:9px"><div class="mbtn"><button onclick="mobIr(\'compra\')"><b>🛒</b>Comprar</button><button onclick="mobIr(\'venta\')"><b>💸</b>Vender</button><button onclick="mobIr(\'cobro\')"><b>💰</b>Cobro</button><button onclick="mobIr(\'aporte\')"><b>💵</b>Aporte</button></div></div>';
  h+='<div class="mlink" style="font-size:.8rem" onclick="mobVerTodo()">Ver todo (vista completa) ›</div>';
  v.innerHTML=h;
}

// ─── Vista familiar (solo lectura) ────────────────────────────────────────────
async function vistaPublicar(d){
  try{
    if(!CFG.vistaFamiliar)return;
    var hoy=_hHoy(),ini=(typeof aporIni==='function')?aporIni():null;
    var tot=(d.totalVal||0)+(d.liqTotalUSD||0);
    var per=(typeof rendPeriodos==='function')?rendPeriodos():{};
    var rend=d.rendPct!=null?Math.round(d.rendPct*100)/100:null;
    var acc=1;Object.keys(per).forEach(function(y){acc*=1+per[y]/100;});if(rend!=null)acc*=1+rend/100;
    var apor=(CFG.aportes&&_aporLoaded?APOR:[]).map(function(x){return {f:x.fecha,t:x.tipo,u:Math.round((+x.usd||0)*100)/100};});
    var capital=null;if(CFG.capitalInicio>0){capital=CFG.capitalInicio;apor.forEach(function(x){if(ini&&x.f>=ini)capital+=(x.t==='retiro'?-1:1)*x.u;});}
    var serie=[];try{var s=histSerie(),pts=[],byW={};
      s.forEach(function(x){if(x.previo){pts.push(x);return;}var dt=new Date(x.d+'T12:00:00'),wk=x.d.slice(0,4)+'-'+Math.floor((dt-new Date(dt.getFullYear(),0,1))/604800000);byW[wk]=x;});
      pts=pts.concat(Object.keys(byW).map(function(k){return byW[k];})).sort(function(a,b){return a.d<b.d?-1:1;});
      serie=pts.map(function(x){var cap=null;
        if(x.previo)cap=x.inv||null;else if(CFG.capitalInicio>0){cap=CFG.capitalInicio;apor.forEach(function(a){if(ini&&a.f>=ini&&a.f<=x.d)cap+=(a.t==='retiro'?-1:1)*a.u;});}
        return [x.d,Math.round(x.v),cap!=null?Math.round(cap):null];});}catch(e){}
    var sv=d.sectorVal||{},rf=0,rv=0;Object.keys(sv).forEach(function(k){if(['bonos','on','fci','letras'].indexOf(k)>=0)rf+=sv[k]||0;else rv+=sv[k]||0;});
    var lim=new Date();lim.setDate(lim.getDate()+30);var limS=lim.getFullYear()+'-'+('0'+(lim.getMonth()+1)).slice(-2)+'-'+('0'+lim.getDate()).slice(-2);
    var cob=[];try{cob=(calcularCalendarioCobros().items||[]).filter(function(it){return it.fecha<=limS;}).slice(0,12).map(function(it){return {f:it.fecha,t:it.ticker,m:it.moneda,x:Math.round(it.total*100)/100};});}catch(e){}
    var y0=hoy.slice(0,4)+'-01-01',cobAnio=0;try{(TRK.divs||[]).forEach(function(x){if(x.estado==='pendiente'||(x.cartera&&x.cartera!=='principal'))return;var f=_infISO(x.fecha);if(f&&f>=y0)cobAnio+=divUSD(x)||0;});}catch(e){}
    var doc={v:1,ts:Date.now(),nombre:CFG.persona||CFG.nombre,cartera:CFG.nombre,valor:Math.round(tot),mep:MEP_HOY||null,
      periodoIni:ini,rend:rend,ganPer:(typeof _aporUlt!=='undefined'&&_aporUlt)?Math.round(_aporUlt.gan):null,
      per:per,acum:Math.round((acc-1)*10000)/100,capital:capital!=null?Math.round(capital):null,
      dist:{rf:Math.round(rf),rv:Math.round(rv),liq:Math.round(d.liqTotalUSD||0),dolz:d.dolzPct!=null?Math.round(d.dolzPct):null},
      cobros:cob,cobradoAnio:Math.round(cobAnio),aportes:apor,serie:serie,wa:CFG.whatsapp||null};
    try{var _o3=_ops30();doc.ops30={n:_o3.n,u:(_o3.c||0)+(_o3.v||0)};}catch(e){}
    await sbSetConfig('vista_familiar',doc);
  }catch(e){console.warn('vistaPublicar',e);}
}

// ─── 🏖️ Simulador de retiro (CFG.simRetiro, solo GDC) ─────────────────────────
var SIMR=null,_simrLoaded=false,_simrCapAuto=true,_simrSaveT=null;
async function simrLoad(){if(_simrLoaded)return;try{var v=await sbGetConfig('sim_retiro');if(v&&typeof v==='object')SIMR=v;}catch(e){}
  SIMR=SIMR||{};SIMR.in=SIMR.in||{ret:8333,ren:10,inf:3,apo:0,ani:0};SIMR.esc=SIMR.esc||[];_simrLoaded=true;}
function simrSave(){clearTimeout(_simrSaveT);_simrSaveT=setTimeout(function(){sbSetConfig('sim_retiro',SIMR);},800);}
function simrCalc(cap,ret,ren,inf,apo,ani){
  var rm=Math.pow(1+ren/100,1/12)-1,c=cap,pts=[[0,c]],r=ret,dura=null;
  for(var m=1;m<=960;m++){c*=1+rm;if(m<=ani*12)c+=apo;else c-=r;if(m%12===0)r*=1+inf/100;
    if(c<=0&&dura==null){dura=m/12;c=0;}if(m%3===0)pts.push([m/12,Math.max(0,c)]);if(dura!=null&&m/12>=Math.max(dura+2,10))break;}
  return {pts:pts,dura:dura};
}
function _simrVals(){var g=function(i){var e=document.getElementById('simr-'+i);return e?(parseFloat(String(e.value).replace(/\./g,'').replace(',','.'))||0):0;};
  return {cap:g('cap'),ret:g('ret'),ren:g('ren'),inf:g('inf'),apo:g('apo'),ani:g('ani')};}
function simrInput(id){if(id==='cap')_simrCapAuto=false;var v=_simrVals();SIMR.in={ret:v.ret,ren:v.ren,inf:v.inf,apo:v.apo,ani:v.ani};simrSave();simrResultado();}
function simrUsarRen(r){var e=document.getElementById('simr-ren');if(e){e.value=r;simrInput('ren');}}
function simrGuardarEsc(){var n=prompt('Nombre del escenario (ej. "Retiro en 5 años"):','');if(!n)return;var v=_simrVals();
  SIMR.esc=SIMR.esc.filter(function(x){return x.n!==n;});SIMR.esc.unshift({n:n,v:v});SIMR.esc=SIMR.esc.slice(0,8);simrSave();simrRender(true);}
function simrCargarEsc(i){var x=SIMR.esc[i];if(!x)return;['cap','ret','ren','inf','apo','ani'].forEach(function(k){var e=document.getElementById('simr-'+k);if(e)e.value=x.v[k];});
  _simrCapAuto=false;SIMR.in={ret:x.v.ret,ren:x.v.ren,inf:x.v.inf,apo:x.v.apo,ani:x.v.ani};simrSave();simrResultado();}
function simrBorrarEsc(i){SIMR.esc.splice(i,1);simrSave();simrRender(true);}
function _sdDatos(){
  var tc=(typeof MEP_HOY!=='undefined'&&MEP_HOY>0?MEP_HOY:CCL_HOY)||1,d=new Date(),M=[],idx={},src={},nDiv={};
  for(var k=0;k<12;k++){var x=new Date(d.getFullYear(),d.getMonth()+k,1),key=x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0');idx[key]=k;M.push({k:key,l:['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][x.getMonth()],r:0,a:0,det:[]});}
  var hoy=d.toISOString().slice(0,10),lim=new Date(d.getTime()+365*864e5).toISOString().slice(0,10),desde=new Date(d.getTime()-365*864e5).toISOString().slice(0,10);
  var add=function(key,t,r,a){var i=idx[key];if(i==null)return;M[i].r+=r;M[i].a+=a;M[i].det.push(t);};
  try{calcularCalendarioCobros().items.forEach(function(it){if(it.fecha<hoy||it.fecha>lim)return;var f=it.moneda==='ARS'?1/tc:1,r=(it.renta||0)*f,a=(it.amort||0)*f;
    add(it.fecha.slice(0,7),it.ticker,r,a);src[it.ticker]=src[it.ticker]||{r:0,a:0};src[it.ticker].r+=r;src[it.ticker].a+=a;});}catch(e){}
  var Q={};(NV_ROWS||[]).forEach(function(o){if(o.rv&&o.q>0)Q[o.t]=(Q[o.t]||0)+o.q;});
  var div=function(iso,t,u,ac){if(!iso||iso<desde||iso>hoy||!(u>0)||!Q[t])return;if(ac>0)u=u*Q[t]/ac;var p=iso.split('-'),key=(+p[0]+1)+'-'+p[1];if(idx[key]==null)key=M[11].k;add(key,t,u,0);nDiv[t]=(nDiv[t]||0)+u;};
  (TRK.divs||[]).forEach(function(x){if(x.estado==='pendiente')return;var f=String(x.fecha||''),iso=f.indexOf('/')>0?_phIso(f):f;div(iso,x.ticker,divUSD(x)||0,+x.acciones||0);});
  (movimientos||[]).forEach(function(m){if(!m||m.tipo!=='dividendo')return;div(_phIso(m.fecha),m.ticker,+m.precioUSD||0,0);});
  var dv=Object.keys(nDiv).reduce(function(s,t){return s+nDiv[t];},0);
  return {M:M,src:src,dv:dv,nd:Object.keys(nDiv).length,tc:tc};
}
function sdUsar(v){var e=document.getElementById('simr-ret');if(e){e.value=Math.round(v);simrInput('ret');}}
function sueldoRender(){
  if(!CFG.simRetiro)return;var pg=document.getElementById('page-simretiro'),sc=document.getElementById('simr-card');if(!pg||!sc)return;
  var card=document.getElementById('sd-card');if(!card){card=document.createElement('div');card.className='card';card.id='sd-card';card.style.marginBottom='1rem';}
  if(card.nextSibling!==sc)pg.insertBefore(card,sc);
  var v=_simrVals(),cap=v.cap||_simrCapHoy||0;if(!(cap>0)){card.style.display='none';return;}card.style.display='';
  var D=_sdDatos(),n0=function(x){return Math.round(x).toLocaleString('es-AR');},mono='font-family:var(--mono)';
  var renta=D.M.reduce(function(s,m){return s+m.r;},0),amort=D.M.reduce(function(s,m){return s+m.a;},0),real=4.5,ru=v.ren-v.inf;
  var ip=function(r){return Math.pow(1+r/100,1/12)-1;},i=ip(real),perp=cap*i,a30=cap*i/(1-Math.pow(1+i,-360)),p3=cap*ip(3),pu=ru>0?cap*ip(ru):0,nec=v.ret>0?v.ret/i:Infinity;
  var kp=function(l,val,sub,c,btn){return '<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:9px 11px;min-width:0"><div style="'+mono+';font-size:.56rem;color:var(--text3);text-transform:uppercase;letter-spacing:.06em">'+l+'</div><div class="port-sensitive" style="'+mono+';font-size:1.2rem;font-weight:800;margin:3px 0 2px;color:'+(c||'var(--text)')+'">'+val+'</div><div style="'+mono+';font-size:.62rem;color:var(--text2);line-height:1.4">'+sub+'</div>'+(btn||'')+'</div>';};
  var ub=function(x){return '<button class="btn btn-sm" style="font-size:.6rem;padding:1px 7px;margin-top:5px" onclick="sdUsar('+Math.round(x)+')">probar en el simulador ↓</button>';};
  var rs='4,5',rus=String(Math.round(ru*10)/10).replace('.',',');
  var K='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px">'+
    kp('Renta sin vender nada','USD '+n0(renta/12),'por mes · cupones + dividendos<br>'+(renta/cap*100).toFixed(1).replace('.',',')+'% de la cartera por año')+
    kp('Sueldo que no come capital','USD '+n0(perp),'por mes · con 4,5% real<br>conservador 3%: USD '+n0(p3)+(ru>0&&Math.abs(ru-4.5)>.4?' · con tu simulador ('+rus+'%): USD '+n0(pu):''),'var(--accent)',ub(perp))+
    kp('Sueldo a 30 años','USD '+n0(a30),'por mes · a los 30 años queda en cero','#f59e0b',ub(a30))+
    kp('Tu meta de retiro',v.ret>0?'USD '+n0(v.ret):'—',v.ret>0?(isFinite(nec)?'por mes · harían falta USD '+(nec>=1e6?(nec/1e6).toFixed(2).replace('.',',')+' M':n0(nec))+' con 4,5% real':'')+'<br>hoy cubre el '+Math.round(perp/v.ret*100)+'%':'cargala en el simulador')+'</div>';
  var mx=Math.max.apply(null,D.M.map(function(m){return m.r+m.a;}).concat([v.ret||0,1]))*1.08,H=140;
  var bars=D.M.map(function(m){var t='<b>'+m.l+'</b>: renta USD '+n0(m.r)+(m.a?' · amortización USD '+n0(m.a):'')+(m.det.length?' · '+m.det.filter(function(x,j,a){return a.indexOf(x)===j;}).join(', '):'');
    return '<div title="'+t.replace(/<[^>]+>/g,'')+'" style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;height:100%;position:relative;min-width:0">'+
      '<i style="display:block;height:'+(m.a/mx*100)+'%;background:var(--border2);border-radius:3px 3px 0 0"></i><i style="display:block;height:'+(m.r/mx*100)+'%;background:var(--blue);border-radius:'+(m.a?'0':'3px 3px 0 0')+'"></i>'+
      '<em style="position:absolute;bottom:-16px;left:0;right:0;text-align:center;font-style:normal;font-size:.56rem;color:var(--text3);'+mono+'">'+m.l+'</em></div>';}).join('');
  var line=v.ret>0?'<div style="position:absolute;left:0;right:0;bottom:'+(v.ret/mx*100)+'%;border-top:1px dashed #f59e0b;z-index:2"><span style="position:absolute;right:0;top:-15px;'+mono+';font-size:.58rem;color:#f59e0b">tu retiro USD '+n0(v.ret)+'</span></div>':'';
  var rows=Object.keys(D.src).filter(function(t){return D.src[t].r>0.5;}).sort(function(a,b){return D.src[b].r-D.src[a].r;}).map(function(t){return [t,D.src[t].r];});
  if(D.dv>0)rows.unshift(['Dividendos ('+D.nd+' acciones)',D.dv]);
  var tb='<table style="width:100%;border-collapse:collapse;font-size:.76rem;'+mono+'"><tr style="color:var(--text3);font-size:.6rem;text-transform:uppercase"><td style="padding:4px">Fuente</td><td style="text-align:right;padding:4px">Por año</td><td style="text-align:right;padding:4px">Por mes</td></tr>'+
    rows.map(function(r){return '<tr style="border-top:1px solid var(--border)"><td style="padding:5px 4px">'+r[0]+'</td><td class="port-sensitive" style="text-align:right;padding:5px 4px">'+n0(r[1])+'</td><td class="port-sensitive" style="text-align:right;padding:5px 4px">'+n0(r[1]/12)+'</td></tr>';}).join('')+
    '<tr style="border-top:1px solid var(--border2);font-weight:700"><td style="padding:5px 4px">Total renta</td><td class="port-sensitive" style="text-align:right;padding:5px 4px">'+n0(renta)+'</td><td class="port-sensitive" style="text-align:right;padding:5px 4px">'+n0(renta/12)+'</td></tr></table>';
  card.innerHTML='<div class="card-header" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span class="card-title">💼 Sueldo de la cartera</span><span class="tag">cuánto podés retirar por mes · en dólares de hoy</span></div>'+
    '<div style="padding:.7rem 1rem 1rem">'+K+
    '<div style="display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:16px;margin-top:14px" class="sd-g">'+
      '<div><div style="'+mono+';font-size:.58rem;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;display:flex;gap:12px;flex-wrap:wrap">Qué entra mes a mes · próximos 12 meses<span><i style="display:inline-block;width:8px;height:8px;background:var(--blue);border-radius:2px"></i> renta</span><span><i style="display:inline-block;width:8px;height:8px;background:var(--border2);border-radius:2px"></i> amortización (capital que vuelve)</span></div>'+
        '<div class="port-sensitive" style="display:flex;align-items:flex-end;gap:5px;height:'+H+'px;margin:10px 0 22px;position:relative">'+bars+line+'</div>'+
        (amort>0?'<div style="font-size:.7rem;color:var(--text3);line-height:1.5">Las amortizaciones (USD <span class="port-sensitive">'+n0(amort)+'</span> en el año) no son sueldo: es tu capital que vuelve. Conviene reinvertirlas o usarlas solo si el retiro lo necesita.</div>':'')+'</div>'+
      '<div>'+tb+'</div></div>'+
    '<div style="'+mono+';font-size:.58rem;color:var(--text3);margin-top:10px;line-height:1.5">Cupones y amortizaciones salen de los flujos de tus bonos (los de pesos pasados a dólares a $ '+n0(D.tc)+'). Dividendos: los cobrados en los últimos 12 meses, suponiendo que se repiten en el mismo mes. "No come capital" = cartera × 4,5% real ÷ 12 (mezcla de la TIR de bonos en dólares menos inflación y el histórico real de acciones). "A 30 años" = cuota fija que deja la cartera en cero al año 30. Un año malo al principio del retiro pesa más que uno al final: mirá también el conservador.</div></div>';
}
var _simrCapHoy=0;
function simrRender(force){
  if(!CFG.simRetiro||!_simrLoaded)return;
  var row=document.getElementById('top-cards-row');if(!row)return;
  var card=document.getElementById('simr-card');
  if(!card){card=document.createElement('div');card.className='card';card.id='simr-card';card.style.marginBottom='1rem';
    card.innerHTML='<div class="card-header" style="display:flex;align-items:center;gap:8px"><span class="card-title">🏖️ Simulador de retiro</span><span class="tag" style="margin-left:6px">¿cuánto dura tu capital?</span><button class="card-toggle" onclick="cardToggle(this)">▾</button></div><div id="simr-body" style="padding:.7rem 1rem 1rem"></div>';
    card.setAttribute('data-persist','1');try{if(localStorage.getItem(PFX+'col_simr-card')!=='0'){card.classList.add('card-collapsed');card.querySelector('.card-toggle').textContent='▸';}}catch(e){}
    var _sp=document.getElementById('page-simretiro');if(_sp){_sp.appendChild(card);card.classList.remove('card-collapsed');}else row.parentNode.insertBefore(card,row.nextSibling);force=true;}
  var b=document.getElementById('simr-body');
  if(!force&&document.getElementById('simr-cap')){if(_simrCapAuto){document.getElementById('simr-cap').value=Math.round(_simrCapHoy);simrResultado();}return;}
  var I=SIMR.in,mono='font-family:var(--mono)';
  var inp=function(id,lbl,val,help,step){return '<label style="display:block"><span style="'+mono+';font-size:.58rem;color:var(--text3);text-transform:uppercase;letter-spacing:.06em">'+lbl+'</span>'+
    '<input id="simr-'+id+'" type="number" step="'+(step||'any')+'" value="'+val+'" oninput="simrInput(\''+id+'\')" style="width:100%;margin-top:4px;background:var(--surface2);border:1px solid var(--border2);border-radius:6px;color:var(--text);'+mono+';font-size:.85rem;padding:.35rem .5rem">'+
    '<span style="display:block;font-size:.58rem;color:var(--text3);margin-top:2px">'+help+'</span></label>';};
  var per={};try{per=rendPeriodos();}catch(e){}var ys=Object.keys(per).sort();
  var chips=ys.map(function(y){return '<button class="btn btn-sm" style="font-size:.62rem;padding:1px 7px" onclick="simrUsarRen('+per[y]+')">'+y+': '+(per[y]>=0?'+':'')+String(Math.round(per[y]*10)/10).replace('.',',')+'%</button>';}).join(' ');
  try{var _ra=(typeof _aporUlt!=='undefined'&&_aporUlt&&_aporUlt.rend!=null)?Math.round(_aporUlt.rend*10)/10:null;if(_ra!=null)chips+=' <button class="btn btn-sm" style="font-size:.62rem;padding:1px 7px" onclick="simrUsarRen('+_ra+')">'+_hHoy().slice(0,4)+' en curso: '+(_ra>=0?'+':'')+String(_ra).replace('.',',')+'%</button>';}catch(e){}
  var rec=ys.filter(function(y){return +y>=2024;});if(rec.length){var acc=1;rec.forEach(function(y){acc*=1+per[y]/100;});var prom=Math.round((Math.pow(acc,1/rec.length)-1)*1000)/10;
    chips+=' <button class="btn btn-sm" style="font-size:.62rem;padding:1px 7px;border-color:var(--accent);color:var(--accent)" onclick="simrUsarRen('+prom+')">promedio '+rec[0]+'–'+rec[rec.length-1]+': '+String(prom).replace('.',',')+'% anual</button>';}
  b.innerHTML='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">'+
    inp('cap','Capital hoy (USD)',Math.round(_simrCapHoy||0),'valor actual de GDC (si lo cambiás, queda fijo)')+
    inp('ret','Retiro por mes (USD)',I.ret,'tu meta: 100.000 por año')+
    inp('ren','Rendimiento anual (%)',I.ren,'tocá un año de abajo para usarlo','0.5')+
    inp('inf','Inflación del dólar (%)',I.inf,'el retiro sube cada año','0.5')+
    inp('apo','Aporte por mes (USD)',I.apo,'hasta que empieces a retirar')+
    inp('ani','Años hasta retirarte',I.ani,'0 = empezás hoy','1')+'</div>'+
    (chips?'<div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap;align-items:center"><span style="'+mono+';font-size:.58rem;color:var(--text3)">TUS AÑOS:</span>'+chips+'</div>':'')+
    '<div id="simr-res" style="margin-top:10px"></div>'+
    '<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;align-items:center"><button class="btn btn-a btn-sm" onclick="simrGuardarEsc()">Guardar escenario</button>'+
      SIMR.esc.map(function(x,i){return '<span style="display:inline-flex;align-items:center;gap:2px"><button class="btn btn-sm" style="font-size:.66rem" onclick="simrCargarEsc('+i+')">'+String(x.n).replace(/</g,'&lt;')+'</button><button class="btn btn-sm" style="font-size:.6rem;padding:0 5px;color:var(--text3)" onclick="simrBorrarEsc('+i+')" title="Borrar">×</button></span>';}).join('')+'</div>'+
    '<div style="'+mono+';font-size:.58rem;color:var(--text3);margin-top:8px;line-height:1.5">Mes a mes: el capital rinde la tasa anual, suma el aporte hasta retirarte y después resta el retiro, que sube cada año por la inflación. Capital para no tocarlo = retiro anual ÷ (rendimiento − inflación). Proyección con supuestos fijos: la realidad tiene años buenos y malos.</div>';
  simrResultado();
}
function simrResultado(){
  var el=document.getElementById('simr-res');if(!el)return;try{sueldoRender();}catch(e){console.warn('sueldo',e);}var v=_simrVals(),s=simrCalc(v.cap,v.ret,v.ren,v.inf,v.apo,v.ani),real=v.ren-v.inf;
  var nec=real>0?v.ret*12/(real/100):Infinity,et=real>0?v.cap*(real/100)/12:0,n0=function(x){return Math.round(x).toLocaleString('es-AR');};
  var capRet=(s.pts.filter(function(p){return p[0]<=v.ani;}).pop()||[0,v.cap])[1];
  var dur=s.dura==null?null:s.dura-v.ani,cl=dur==null?'var(--accent)':dur<15?'var(--red)':'#eab308';
  var k=function(l,val,sub,c){return '<div style="background:var(--surface2);border-radius:8px;padding:8px 10px"><div style="font-family:var(--mono);font-size:.56rem;color:var(--text3);text-transform:uppercase;letter-spacing:.06em">'+l+'</div><div style="font-family:var(--mono);font-size:1.15rem;font-weight:700;margin-top:2px;'+(c?'color:'+c:'')+'">'+val+'</div><div style="font-size:.64rem;color:var(--text2);margin-top:2px">'+sub+'</div></div>';};
  var W=760,H=180,P=34,xs=s.pts[s.pts.length-1][0]||1,ys=Math.max.apply(null,s.pts.map(function(p){return p[1];}).concat([isFinite(nec)?nec:0]))*1.08||1;
  var X=function(x){return P+x/xs*(W-P-8);},Y=function(y){return H-20-y/ys*(H-28);};
  var g='';for(var i=0;i<=4;i++){var yv=ys*i/4;g+='<line x1="'+P+'" x2="'+(W-8)+'" y1="'+Y(yv)+'" y2="'+Y(yv)+'" stroke="var(--border)"/><text x="'+(P-4)+'" y="'+(Y(yv)+3)+'" text-anchor="end" font-size="9" fill="#3d5a80">'+(yv>=1e6?(yv/1e6).toFixed(1)+'M':Math.round(yv/1000)+'k')+'</text>';}
  var st=xs>40?10:xs>20?5:xs>8?2:1;for(var t=0;t<=xs;t+=st)g+='<text x="'+X(t)+'" y="'+(H-6)+'" text-anchor="middle" font-size="9" fill="#3d5a80">'+(t===0?'hoy':'+'+t+'a')+'</text>';
  if(isFinite(nec)&&nec<ys)g+='<line x1="'+P+'" x2="'+(W-8)+'" y1="'+Y(nec)+'" y2="'+Y(nec)+'" stroke="#eab308" stroke-dasharray="5 4"/><text x="'+(W-10)+'" y="'+(Y(nec)-4)+'" text-anchor="end" font-size="9" fill="#eab308">capital para no tocarlo</text>';
  if(v.ani>0)g+='<line x1="'+X(v.ani)+'" x2="'+X(v.ani)+'" y1="6" y2="'+(H-20)+'" stroke="#448aff" stroke-dasharray="3 3"/><text x="'+(X(v.ani)+4)+'" y="14" font-size="9" fill="#448aff">empezás a retirar</text>';
  var path=s.pts.map(function(p,i){return (i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1);}).join(' ');
  var esc=[5,8,10,12,15,20].map(function(rr){var x=simrCalc(v.cap,v.ret,rr,v.inf,v.apo,v.ani),re=rr-v.inf,ne=re>0?v.ret*12/(re/100):Infinity,d=x.dura==null?null:x.dura-v.ani;
    return '<tr'+(rr===v.ren?' style="background:rgba(68,138,255,.1)"':'')+'><td style="text-align:left">'+rr+'%</td><td style="color:'+(d==null?'var(--accent)':d<15?'var(--red)':'#eab308')+'">'+(d==null?'siempre':d.toFixed(1).replace('.',',')+' años')+'</td><td>'+(isFinite(ne)?'USD '+n0(ne):'—')+'</td><td>USD '+n0(re>0?v.cap*(re/100)/12:0)+'/mes</td></tr>';}).join('');
  el.innerHTML='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px">'+
    k('Tu capital alcanza para',dur==null?'para siempre':dur.toFixed(1).replace('.',',')+' años',dur==null?'el rendimiento cubre retiro e inflación':'sacando USD '+n0(v.ret)+'/mes'+(v.ani?' desde dentro de '+v.ani+' años':' desde hoy'),cl)+
    k('Capital para no tocarlo',isFinite(nec)?'USD '+n0(nec):'—',isFinite(nec)?(capRet>=nec?'<span style="color:var(--accent)">ya lo tenés ✓</span>':'te faltan USD '+n0(nec-capRet)+(v.ani?' al retirarte':'')):'el rendimiento no supera la inflación')+
    k('Retiro "eterno" hoy','USD '+n0(et)+'/mes','sin achicar el capital (ajustado por inflación)')+'</div>'+
    '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="margin-top:8px;max-height:220px;display:block">'+g+'<path d="'+path+'" fill="none" stroke="#00e676" stroke-width="2.5"/></svg>'+
    '<div class="tw" style="margin-top:6px"><table style="font-family:var(--mono);font-size:.72rem;width:100%"><thead><tr><th style="text-align:left">Rendimiento</th><th>¿Cuánto dura?</th><th>Capital para no tocarlo</th><th>Retiro eterno</th></tr></thead><tbody>'+esc+'</tbody></table></div>';
}
(function _simrBoot(n){setTimeout(function(){if(!CFG.simRetiro)return;if(typeof _gdcInitDone!=='undefined'&&_gdcInitDone){simrLoad().then(function(){if(CFG.historial&&typeof histLoad==='function')return histLoad();}).then(function(){simrRender(true);});}else if(n<40)_simrBoot(n+1);},1800);})(0);

// ─── 📈 Historial de precios por activo ─────────────────────────────────────
var PH_SB={url:'https://wstnseufzyavgdovrehu.supabase.co',key:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdG5zZXVmenlhdmdkb3ZyZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzU0MTYsImV4cCI6MjA5MTM1MTQxNn0.0mmKvfCM_HoBJjbIhFzM5TeKEc-LphQwEXNjHqV_CfU'};
var _phFx={},_phSer={},_phChart=null,_phSt=null;
function _phFxLoad(t){
  if(!_phFx[t])_phFx[t]=fetchWithTimeout('https://api.argentinadatos.com/v1/cotizaciones/dolares/'+t,{},12000)
    .then(function(r){return r.ok?r.json():[];}).then(function(a){var m={};(a||[]).forEach(function(x){var v=parseFloat(x.venta);if(x.fecha&&v>0)m[x.fecha]=v;});return m;})
    .catch(function(){delete _phFx[t];return {};});
  return _phFx[t];
}
function _phCat(s){if(s==='bonos')return 'bonds';if(s==='argentina')return 'stocks';if(s==='on'||s==='fci')return null;return 'cedears';}
function _phIso(f){var p=String(f||'').split('/');return p.length===3?p[2]+'-'+p[1].padStart(2,'0')+'-'+p[0].padStart(2,'0'):null;}
// Cambio de ratio del Cedear (o split): un salto de un día a otro mayor a ×1,8 o menor a ×0,55 se toma como cambio
// de unidad y se reescala todo lo anterior a la unidad de hoy (ej. SPY 29/05/2026: ×0,335). Así los rendimientos no saltan.
function _phSplits(ser){
  if(!ser||ser.length<2)return ser;var out=ser.map(function(x){return [x[0],x[1]];});
  for(var i=out.length-1;i>0;i--){var r=out[i][1]/out[i-1][1];if(r>1.8||r<0.55){for(var j=0;j<i;j++)out[j][1]*=r;}}
  return out;
}
async function _phSerie(tk,s){
  if(_phSer[tk])return _phSer[tk];
  var raw={},src={d912:0,propio:0},cat=_phCat(s);
  if(cat){try{var r=await fetchWithTimeout('https://data912.com/historical/'+cat+'/'+encodeURIComponent(tk),{headers:{Accept:'application/json'}},15000);
    if(r.ok){var a=await r.json();(Array.isArray(a)?a:[]).forEach(function(x){var c=parseFloat(x.c);if(x.date&&c>0){raw[x.date]=c;src.d912++;}});}}catch(e){}}
  try{var r2=await fetchWithTimeout(PH_SB.url+'/rest/v1/precios_hist?select=fecha,px:precios->>'+encodeURIComponent(String(tk).toUpperCase())+'&order=fecha.asc',{headers:{apikey:PH_SB.key,Authorization:'Bearer '+PH_SB.key}},12000);
    if(r2.ok){(await r2.json()||[]).forEach(function(x){var v=parseFloat(x.px);if(x.fecha&&v>0&&raw[x.fecha]==null){raw[x.fecha]=v;src.propio++;}});}}catch(e){}
  var usdDir=isBonoUSDDirecto(tk),fx=usdDir?{}:await _phFxLoad((s==='bonos'||s==='on')?'bolsa':'contadoconliqui');
  var fxK=Object.keys(fx).sort(),ser=[],j=0,lastFx=null;
  Object.keys(raw).sort().forEach(function(d){
    if(usdDir){ser.push([d,raw[d]]);return;}
    while(j<fxK.length&&fxK[j]<=d){lastFx=fx[fxK[j]];j++;}
    if(lastFx>0)ser.push([d,raw[d]/lastFx]);
  });
  if(s!=='bonos'&&s!=='on')ser=_phSplits(ser);
  var res={ser:ser,src:src,fxOk:usdDir||fxK.length>0};
  if(ser.length)_phSer[tk]=res;
  return res;
}
function phCerrar(){var o=document.getElementById('ph-modal');if(o)o.style.display='none';if(_phChart){try{_phChart.destroy();}catch(e){}_phChart=null;}}
async function phAbrir(tk,ppc){
  var s=getSector(tk),bono=(s==='bonos'||s==='on');
  var o=document.getElementById('ph-modal');
  if(!o){o=document.createElement('div');o.id='ph-modal';o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9999;display:flex;align-items:center;justify-content:center;padding:12px';
    o.onclick=function(e){if(e.target===o)phCerrar();};document.body.appendChild(o);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')phCerrar();});}
  o.style.display='flex';
  var btn=function(k,l){return '<button class="btn btn-sm" data-r="'+k+'" onclick="phRango(\''+k+'\')" style="padding:3px 9px">'+l+'</button>';};
  o.innerHTML='<div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;width:min(780px,100%);max-height:94vh;overflow:auto;padding:14px 16px;color:var(--text)">'+
    '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><b style="font-size:1.05rem">📈 '+String(tk).replace(/[<>&"]/g,'')+'</b><span style="color:var(--text3);font-size:.75rem">precio en USD'+(bono?' cada 100 VN':'')+'</span>'+
    '<span style="margin-left:auto;display:flex;gap:4px;flex-wrap:wrap" id="ph-rg">'+btn('3m','3M')+btn('1a','1A')+btn('compra','Desde la compra')+btn('todo','Todo')+'</span>'+
    '<button class="btn btn-sm" onclick="phCerrar()" style="padding:3px 9px">✕</button></div>'+
    '<div id="ph-info" style="font-family:var(--mono);font-size:.78rem;margin:10px 0 6px;color:var(--text2)">Cargando historia…</div>'+
    '<div style="position:relative;height:min(320px,48vh)"><canvas id="ph-cv"></canvas></div>'+
    '<div id="ph-nota" style="font-size:.66rem;color:var(--text3);margin-top:8px"></div></div>';
  var mov=movimientos.filter(function(m){return m&&m.ticker===tk&&(m.tipo==='compra'||m.tipo==='venta')&&(typeof CARTERA_ACTIVA==='undefined'||(m.cartera||'principal')===CARTERA_ACTIVA);})
    .map(function(m){return {d:_phIso(m.fecha),t:m.tipo};}).filter(function(m){return m.d;}).sort(function(a,b){return a.d<b.d?-1:1;});
  var ppc100=ppc>0?(bono?ppc*100:ppc):null;
  _phSt={tk:tk,ppc:ppc100,mov:mov,rango:mov.length?'compra':'1a',data:null};
  var r=await _phSerie(tk,s);
  if(!_phSt||_phSt.tk!==tk)return;
  _phSt.data=r;
  var nota=[];
  if(r.src.d912)nota.push('Historia de data912 (cierre diario)');
  if(r.src.propio)nota.push(r.src.propio+' día'+(r.src.propio>1?'s':'')+' del historial propio');
  nota.push(isBonoUSDDirecto(tk)?'cotiza directo en dólares':'pasado a USD con el '+(bono?'MEP':'CCL')+' de cada día');
  if(bono)nota.push('el precio baja cuando paga cupón o amortiza: eso no es pérdida, ya lo cobraste');
  nota.push('▲ compras ▼ ventas · línea punteada = tu PPC');
  document.getElementById('ph-nota').textContent=nota.join(' · ')+'.';
  if(!r.ser.length){document.getElementById('ph-info').innerHTML=s==='on'?'Todavía no hay historia para esta ON: se empieza a guardar todos los días al cierre (17:30) desde que se activó el historial.':'No se encontró historia para este activo.'+(r.fxOk?'':' (no se pudo bajar el tipo de cambio)');return;}
  phRango(_phSt.rango);
}
function phRango(k){
  if(!_phSt||!_phSt.data)return;_phSt.rango=k;
  document.querySelectorAll('#ph-rg button').forEach(function(b){var on=b.dataset.r===k;b.style.background=on?'var(--accent)':'';b.style.color=on?'#04150b':'';});
  var ser=_phSt.data.ser,last=ser[ser.length-1][0],dd=new Date(last+'T12:00:00'),desde='0000';
  if(k==='3m'){dd.setMonth(dd.getMonth()-3);desde=dd.toISOString().slice(0,10);}
  else if(k==='1a'){dd.setFullYear(dd.getFullYear()-1);desde=dd.toISOString().slice(0,10);}
  else if(k==='compra'&&_phSt.mov.length){var d0=new Date(_phSt.mov[0].d+'T12:00:00');d0.setDate(d0.getDate()-20);desde=d0.toISOString().slice(0,10);}
  var pts=ser.filter(function(x){return x[0]>=desde;});if(pts.length<2)pts=ser.slice(-60);
  var mk={};_phSt.mov.forEach(function(m){for(var i=0;i<pts.length;i++){if(pts[i][0]>=m.d){mk[i]=mk[i]||{c:0,v:0};mk[i][m.t==='compra'?'c':'v']++;break;}}});
  var step=Math.max(1,Math.ceil(pts.length/500)),idx=[];
  for(var i=0;i<pts.length;i++){if(i%step===0||i===pts.length-1||mk[i])idx.push(i);}
  var lab=idx.map(function(i){return pts[i][0];}),val=idx.map(function(i){return pts[i][1];});
  var cpr=idx.map(function(i){return mk[i]&&mk[i].c?pts[i][1]:null;}),vta=idx.map(function(i){return mk[i]&&mk[i].v?pts[i][1]:null;});
  var hoy=pts[pts.length-1][1],ini=pts[0][1],mx=Math.max.apply(null,val),mn=Math.min.apply(null,val);
  var dec=hoy<20?3:2,f=function(x){return x.toLocaleString('es-AR',{minimumFractionDigits:dec,maximumFractionDigits:dec});};
  var pc=function(x){return '<b style="color:'+(x>=0?'var(--green)':'var(--red)')+'">'+(x>=0?'+':'−')+Math.abs(x).toFixed(1).replace('.',',')+'%</b>';};
  var fdm=function(iso){return iso.slice(8,10)+'/'+iso.slice(5,7)+'/'+iso.slice(2,4);};
  document.getElementById('ph-info').innerHTML='Último cierre ('+fdm(pts[pts.length-1][0])+') <b style="color:var(--text)">USD '+f(hoy)+'</b>'+
    (_phSt.ppc?' · vs tu PPC (USD '+f(_phSt.ppc)+') '+pc((hoy/_phSt.ppc-1)*100):'')+
    ' · en el período '+pc((hoy/ini-1)*100)+' · máx '+f(mx)+' · mín '+f(mn);
  if(_phChart){try{_phChart.destroy();}catch(e){}_phChart=null;}
  if(_chartLuego(phRango,arguments))return;
  var cs=getComputedStyle(document.documentElement),cv=function(n,d){return (cs.getPropertyValue(n)||'').trim()||d;};
  var txt=cv('--text3','#7a9cc5'),grid=cv('--border','#1e3050'),acc=cv('--accent','#00e676'),red=cv('--red','#ff5252'),blue=cv('--blue','#448aff');
  var ds=[{label:'Precio USD',data:val,borderColor:blue,borderWidth:1.6,pointRadius:0,tension:.15,fill:false},
    {label:'Compra',data:cpr,showLine:false,pointStyle:'triangle',pointRadius:7,pointBackgroundColor:acc,pointBorderColor:acc},
    {label:'Venta',data:vta,showLine:false,pointStyle:'triangle',pointRotation:180,pointRadius:7,pointBackgroundColor:red,pointBorderColor:red}];
  if(_phSt.ppc)ds.push({label:'Tu PPC',data:lab.map(function(){return _phSt.ppc;}),borderColor:cv('--amber','#f59e0b'),borderDash:[5,4],borderWidth:1.2,pointRadius:0,fill:false});
  _phChart=new Chart(document.getElementById('ph-cv'),{type:'line',data:{labels:lab,datasets:ds},
    options:{responsive:true,maintainAspectRatio:false,animation:false,interaction:{mode:'index',intersect:false},
      plugins:{legend:{display:false},tooltip:{filter:function(it){return it.raw!=null;},callbacks:{title:function(it){return it.length?fdm(it[0].label):'';},label:function(it){return it.dataset.label+': USD '+f(it.raw);}}}},
      scales:{x:{ticks:{color:txt,maxTicksLimit:7,maxRotation:0,callback:function(v){var l=this.getLabelForValue(v);return l?l.slice(5,7)+'/'+l.slice(2,4):'';}},grid:{color:grid,display:false}},
        y:{ticks:{color:txt,maxTicksLimit:6},grid:{color:grid}}}}});
}

// ─── 📊 Base 100: rendimiento acumulado para comparar carteras en el index ──
function b100Serie(){
  if(typeof HIST==='undefined'||!HIST||!CFG.periodoInicio)return null;
  var PI=CFG.periodoInicio,corte=histUltimoCorte();if(!corte)return null;
  var cDe=function(d){var c=d.slice(0,4)+'-'+PI;return c<=d?c:(parseInt(d.slice(0,4),10)-1)+'-'+PI;};
  var per={};try{per=rendPeriodos()||{};}catch(e){}
  var ys=Object.keys(per).sort(),anc={},out=[],idx=100;
  if(ys.length){var d0=ys[0]+'-'+PI;out.push([d0,100]);anc[d0]=100;
    ys.forEach(function(y){idx*=1+per[y]/100;var f=(parseInt(y,10)+1)+'-'+PI;if(f>corte)return;idx=Math.round(idx*100)/100;out.push([f,idx]);anc[f]=idx;});}
  if(anc[corte]==null){if(out.length&&out[out.length-1][0]<corte){anc[corte]=out[out.length-1][1];out.push([corte,anc[corte]]);}else if(!out.length){anc[corte]=100;out.push([corte,100]);}}
  (HIST.puntos||[]).forEach(function(p){if(!p||p.rend==null||!esDiaHabil(p.d))return;var b=anc[cDe(p.d)];if(b==null||p.d<=cDe(p.d))return;
    out.push([p.d,Math.round(b*(1+p.rend/100)*100)/100]);});
  out.sort(function(a,b){return a[0]<b[0]?-1:a[0]>b[0]?1:0;});
  return out.length>1?out:null;
}
var _b100RefRun=false;
function _b100Ref(){try{return JSON.parse(localStorage.getItem(PFX+'b100ref')||'null');}catch(e){return null;}}
function b100RefBg(){
  if(_b100RefRun||CFG.id!=='gdc')return;_b100RefRun=true;
  setTimeout(async function(){
    try{var sp=await _phSerie('SPY','nyse');if(sp&&sp.ser.length){var lim=new Date();lim.setFullYear(lim.getFullYear()-3);var li=lim.toISOString().slice(0,10);
      var c={d:_flujosHoyStr(),spx:sp.ser.filter(function(x){return x[0]>=li;}).map(function(x){return [x[0],Math.round(x[1]*1000)/1000];})};
      try{localStorage.setItem(PFX+'b100ref',JSON.stringify(c));}catch(e){}
      _famLastSave=0;if(typeof INF_LAST!=='undefined'&&INF_LAST)famQueueSnapshot(INF_LAST);}
    }catch(e){console.warn('b100ref',e);}finally{_b100RefRun=false;}
  },9000);
}

// ─── ⏳ Ciclo de vida de bonos y ONs (en Próximos Cobros) ─────────────────
function _xirrFechas(fl){
  if(!fl.length)return null;var t0=Date.parse(fl[0].d);
  var npv=function(r){var s=0;fl.forEach(function(x){s+=x.m/Math.pow(1+r,(Date.parse(x.d)-t0)/31557600000);});return s;};
  var lo=-0.95,hi=3,a=npv(lo),b=npv(hi);if(!isFinite(a)||!isFinite(b)||a*b>0)return null;
  for(var i=0;i<100;i++){var mid=(lo+hi)/2,v=npv(mid);if(Math.abs(v)<1e-7)return mid;if(a*v<0){hi=mid;b=v;}else{lo=mid;a=v;}}
  return (lo+hi)/2;
}
var CICLO_TIR_BAJA=6;
function renderCicloVida(){
  var el=document.getElementById('flujo-ciclo');
  if(!el){var sc=document.getElementById('flujos-scroll');if(!sc)return;el=document.createElement('div');el.id='flujo-ciclo';el.style.marginTop='1rem';sc.appendChild(el);}
  var h=_flujosHoyStr(),tc=MEP_HOY||CCL_HOY||0,cart=(typeof CARTERA_ACTIVA==='undefined'||!CARTERA_ACTIVA)?'principal':CARTERA_ACTIVA;
  var pos=(typeof getPositionsPrincipal==='function'?getPositionsPrincipal():getPositions()).filter(function(p){var s=getSector(p.ticker);return p.qty>0.000001&&(s==='bonos'||s==='on')&&flujoDe(p.ticker);});
  if(!pos.length){el.innerHTML='';return;}
  var tenidos={};pos.forEach(function(p){tenidos[p.ticker]=1;});
  var L=pos.map(function(p){var t=p.ticker,tb=flujoDe(t),base=flujoBase(t),q=p.qty,usd=function(m){return tb.moneda==='USD'?m:(tc?m/tc:0);};
    var fut=tb.flujos.filter(function(x){return x.f>h;}),falta=0;fut.forEach(function(x){falta+=usd(((x.r||0)+(x.a||0))*q/100);});
    var sumar=function(ok){var c=0,fs={};(TRK.divs||[]).forEach(function(x){if(x.estado==='pendiente'||(x.cartera&&x.cartera!==cart)||!ok(x.ticker))return;var u=0;try{u=divUSD(x)||0;}catch(e){}if(u>0){c+=u;fs[_infISO(x.fecha)]=1;}});return {c:c,n:Object.keys(fs).length};};
    var cc=sumar(function(k){return k===t;});
    if(!cc.c&&base!==t&&!tenidos[base])cc=sumar(function(k){return k===base;});
    var cob=cc.c,pas=cc.n;
    var aplic=0;(TRK.divs||[]).forEach(function(d){if(d.ticker!==t||!d.pncApplied||d.pncTarget!=='ppc')return;var m=(d.montoPPC!=null)?d.montoPPC:d.montoUSD;if(m>0)aplic+=m;});
    var pag=(p.costUSDpuro||0)+aplic,tot=cob+falta;
    var anual=null;try{var sq=0,sd=0;movimientos.forEach(function(m){if(m&&m.tipo==='compra'&&m.ticker===t&&(m.cartera||'principal')===cart&&+m.qty>0){var i=_phIso(m.fecha);if(i){sq+=+m.qty;sd+=+m.qty*Date.parse(i);}}});
      if(sq>0&&pag>0){var d0=new Date(sd/sq).toISOString().slice(0,10),fl=[{d:d0,m:-pag}];
        (TRK.divs||[]).forEach(function(x){if(x.estado==='pendiente'||(x.cartera&&x.cartera!==cart)||x.ticker!==t)return;var u=0;try{u=divUSD(x)||0;}catch(e){}var f=_infISO(x.fecha);if(u>0&&f)fl.push({d:f<d0?d0:f,m:u});});
        fut.forEach(function(x){fl.push({d:x.f,m:usd(((x.r||0)+(x.a||0))*q/100)});});
        var r=_xirrFechas(fl);if(r!=null)anual=r*100;}}catch(e){}
    var anio=0,y=h.slice(0,4);fut.forEach(function(x){if(x.f.slice(0,4)===y)anio+=usd(((x.r||0)+(x.a||0))*q/100);});
    var hoyV=null,qt=quotes[t];if(qt&&qt.price>0&&tb.moneda==='USD'){var rt=getRatio(t)||1,p100=isBonoUSDDirecto(t)?qt.price*rt:(tc?qt.price*rt/tc:null);if(p100)hoyV=p100*q/100;}
    var tirHoy=null;try{var tr=calcularTIRReal(t);if(tr&&isFinite(tr.tir))tirHoy=tr.tir;}catch(e){}
    return {t:t,vto:tb.flujos[tb.flujos.length-1].f,fut:fut,cob:cob,falta:falta,pag:pag,tot:tot,pct:pag>0?(tot/pag-1)*100:null,pas:pas,anual:anual,anio:anio,hoyV:hoyV,tirHoy:tirHoy,mon:tb.moneda};});
  L.sort(function(a,b){return a.vto<b.vto?-1:1;});
  var f0=function(x){return Math.round(x).toLocaleString('es-AR');},MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  el.innerHTML='<div class="card"><div class="card-header"><span class="card-title">⏳ Ciclo de vida</span><span style="font-size:.66rem;color:var(--text3);margin-left:8px">cuánto ya cobraste y cuánto falta de cada bono/ON</span></div><div class="card-body" style="padding:.8rem 1rem">'+
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px">'+L.map(function(x){var w=x.tot>0?x.cob/x.tot*100:0;
      return '<div style="background:var(--surface2);border-radius:10px;padding:10px 12px;font-family:var(--mono)">'+
        '<div style="display:flex;justify-content:space-between;align-items:baseline;font-family:var(--sans)"><b>'+x.t+'</b><span style="font-size:.64rem;color:var(--text3)">vence '+MES[+x.vto.slice(5,7)-1]+'-'+x.vto.slice(2,4)+'</span></div>'+
        '<div style="height:11px;border-radius:6px;background:var(--bg);overflow:hidden;display:flex;margin:8px 0 5px"><span style="width:'+w+'%;background:var(--accent)"></span><span style="width:'+(100-w)+'%;background:rgba(56,189,248,.55)"></span></div>'+
        '<div style="display:flex;justify-content:space-between;font-size:.7rem"><span style="color:var(--accent)" class="port-sensitive">cobrado USD '+f0(x.cob)+'</span><span style="color:#38bdf8" class="port-sensitive">falta USD '+f0(x.falta)+'</span></div>'+
        '<div style="display:flex;justify-content:space-between;font-size:.7rem;color:var(--text2);margin-top:2px"><span class="port-sensitive">pagaste USD '+f0(x.pag)+'</span><span>'+(x.pct!=null?'<b style="color:'+(x.pct>=0?'var(--accent)':'var(--red)')+'">'+(x.pct>=0?'+':'−')+Math.abs(x.pct).toFixed(0)+'%</b>':'')+'</span></div>'+
        '<div style="display:flex;justify-content:space-between;font-size:.7rem;color:var(--text2);margin-top:2px"><span>'+(x.anual!=null?'≈ <b style="color:'+(x.anual>=0?'var(--accent)':'var(--red)')+'">'+(x.anual>=0?'+':'−')+Math.abs(x.anual).toFixed(1).replace('.',',')+'% anual</b>':'')+'</span><span class="port-sensitive">'+(x.anio>0?'en '+h.slice(0,4)+' cobrás USD '+f0(x.anio):'')+'</span></div>'+
        (function(){var v='';if(x.hoyV!=null||x.tirHoy!=null){
          var vende=x.hoyV!=null&&x.mon==='USD'&&x.hoyV>=x.falta,baja=!vende&&x.tirHoy!=null&&x.tirHoy<CICLO_TIR_BAJA;
          v='<div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border);font-size:.68rem;color:var(--text2)">'+(x.hoyV!=null?'<span class="port-sensitive">Hoy vale USD '+f0(x.hoyV)+'</span>':'')+(x.tirHoy!=null?(x.hoyV!=null?' · ':'')+'desde hoy rinde '+x.tirHoy.toFixed(1).replace('.',',')+'% anual':'')+
            (vende?'<div style="margin-top:4px;color:var(--red);font-weight:700;font-family:var(--sans)">🔁 Venderlo hoy te da más que todo lo que falta cobrar</div>':baja?'<div style="margin-top:4px;color:#eab308;font-weight:700;font-family:var(--sans)">🔁 Rinde poco si lo mantenés: evaluá venderlo y rotar</div>':'')+'</div>';}return v;})()+
        '<div style="display:flex;justify-content:space-between;font-size:.66rem;color:var(--text3);margin-top:2px"><span>'+(x.pas?x.pas+' cobro'+(x.pas>1?'s':'')+' registrado'+(x.pas>1?'s':'')+' · ':'')+(x.fut.length?x.fut.length+' por cobrar':'')+'</span><span>'+(x.fut.length?'próximo '+x.fut[0].f.slice(8,10)+'/'+x.fut[0].f.slice(5,7):'terminado')+'</span></div></div>';}).join('')+'</div>'+
    '<div style="font-size:.64rem;color:var(--text3);margin-top:8px;line-height:1.5">Cobrado = cobros registrados de ese bono (incluye los de nominales que ya vendiste). Falta = renta + amortización futuras del flujo cargado para la cantidad que tenés hoy (bonos en pesos, pasados al MEP de hoy). Pagaste = lo que pagaste por lo que tenés hoy (sin restarle los cobros que achican el PPC, para no contarlos dos veces). El % compara cobrado + falta contra lo pagado: es lo que ganarías manteniéndolo hasta el final; "anual" es ese resultado por año, desde tus compras hasta el vencimiento. Abajo, "hoy vale" es lo que recibirías vendiendo hoy y "desde hoy rinde" es la TIR de mantenerlo desde el precio actual: si vender hoy da más que lo que falta cobrar, o si rinde menos de '+CICLO_TIR_BAJA+'% anual, se marca para que evalúes venderlo y rotar a algo que rinda más.</div></div></div>';
}
function tipoVista(){try{return localStorage.getItem(PFX+'tipo_vista')||'ambas';}catch(e){return 'ambas';}}
function tipoVistaSet(v){try{localStorage.setItem(PFX+'tipo_vista',v);}catch(e){}tipoVistaPintar();try{renderPortfolio();}catch(e){}}
function tipoVistaPintar(){var w=document.getElementById('tipo-vista');if(!w)return;var v=tipoVista();w.querySelectorAll('button').forEach(function(b){var on=b.dataset.v===v;b.style.background=on?'var(--accent)':'var(--surface2)';b.style.color=on?'#04150b':'var(--text2)';b.style.fontWeight=on?'700':'400';});}
(function(){function add(){var mf=document.getElementById('mobile-filters');if(!mf||document.getElementById('tipo-vista'))return;
  var w=document.createElement('span');w.id='tipo-vista';w.style.cssText='display:inline-flex;border:1px solid var(--border2);border-radius:6px;overflow:hidden;flex-shrink:0;margin-right:4px';
  w.innerHTML=[['ambas','Todo'],['rf','R. Fija'],['rv','R. Variable']].map(function(x){return '<button data-v="'+x[0]+'" onclick="tipoVistaSet(\''+x[0]+'\')" title="Mostrar en la tabla: '+(x[0]==='ambas'?'todos los activos':x[0]==='rf'?'solo bonos, ONs y FCI':'solo acciones y Cedears')+'" style="border:none;padding:3px 8px;font-size:.66rem;cursor:pointer;font-family:var(--mono)">'+x[1]+'</button>';}).join('');
  mf.insertBefore(w,mf.firstChild);tipoVistaPintar();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();})();

// ─── 🧪 Vista nueva del portafolio (CFG.vistaNueva, página de prueba) ─────────
var NV_ROWS=[],NV_K={};
var NV=(function(){var d={ts:{},df:{},dg:{},dm:{},sk:'inv',sd:-1,modo:'c',op:{},dfv:0,mon:'ars',ic:true};try{var x=JSON.parse(localStorage.getItem(PFX+'nv')||'null');if(x)for(var k in d)if(x[k]!=null)d[k]=x[k];}catch(e){}return d;})();
if(NV.dfv!==2){(function(){var o=NV.df||{},n={};[0,1,2].forEach(function(i){if(o[i])n[i]=1;});if(o[4])n[3]=1;NV.df=n;NV.dfv=2;})();}
function nvSave(){try{localStorage.setItem(PFX+'nv',JSON.stringify(NV));}catch(e){}}
var NV_FD=[['🎯 llegó',function(o){return o.up!=null&&o.up<=0;},'#e3b341'],['≤ 5%',function(o){return o.up>0&&o.up<=5;},'#e3b341'],['5% a 30%',function(o){return o.up>5&&o.up<=30;},'#5b8def'],['sin P. Venta',function(o){return o.up==null;},'#64779c']];
var NV_GD=[['Ganando',function(o){return o.d!=null&&o.d>0;},'#5cc06e'],['0% a −2%',function(o){return o.d!=null&&o.d<=0&&o.d>-2;},'#8a94a6'],['Pérdida',function(o){return o.d!=null&&o.d<=-2;},'#e05a52']];
var NV_MD=[['más de 3%',function(o){return o.pt>3;},'#e05a52'],['2% a 3%',function(o){return o.pt>2&&o.pt<=3;},'#e3b341'],['menos de 2%',function(o){return o.pt<=2;},'#5b8def']];
function _nvSel(m){return Object.keys(m||{}).filter(function(k){return m[k];}).map(Number);}
function _nvEn(m,B,o){var L=_nvSel(m);return !L.length||L.some(function(i){return B[i]&&B[i][1](o);});}
var NV_TS=[['nyse','🇺🇸 USA'],['argentina','🇦🇷 Argentina'],['brasil','🇧🇷 Brasil'],['europa','🇪🇺 Europa'],['china','🇨🇳 China'],['cripto','₿ Cripto'],['bonos','📜 Bonos'],['on','🏢 ONs'],['fci','📈 FCI']];
var _nvFlag={nyse:'🇺🇸',argentina:'🇦🇷',brasil:'🇧🇷',europa:'🇪🇺',china:'🇨🇳',cripto:'₿'},_nvPaisN={nyse:'USA',argentina:'Argentina',brasil:'Brasil',europa:'Europa',china:'China',cripto:'Cripto'};
function _nvPaisI(s){for(var i=0;i<NV_TS.length;i++)if(NV_TS[i][0]===s)return i;return 99;}
function _nvTsSel(){return Object.keys(NV.ts||{}).filter(function(k){return NV.ts[k];});}
function nvTs(k){if(!NV.ts)NV.ts={};NV.ts[k]=!NV.ts[k];nvSave();nvRender();}
function _nvBase(o){NV.tipo='ambas';if(NV.mk&&!MARKS[o.t])return false;var ts=_nvTsSel();if(ts.length&&ts.indexOf(o.s)<0)return false;if(NV.tipo==='rv'&&!o.rv)return false;if(NV.tipo==='rf'&&o.rv)return false;return true;}
function _nvOk(o,sin){if(NV.q)return o.t.indexOf(NV.q)>=0;return _nvBase(o)&&(sin==='f'||_nvEn(NV.df,NV_FD,o))&&(sin==='g'||_nvEn(NV.dg,NV_GD,o))&&(sin==='m'||_nvEn(NV.dm,NV_MD,o));}
function _nvN(x){return Math.round(x||0).toLocaleString('es-AR');}
function _nvP(x){return x==null||!isFinite(x)?'—':(x>0?'+':x<0?'−':'')+Math.abs(x).toFixed(1).replace('.',',')+'%';}
function _nvF(x,o){if(x==null||!isFinite(x))return '<span style="color:var(--text3)">—</span>';var u=NV.mon==='usd';if(u&&!o.usdD){if(!(o.tc>0))return '<span style="color:var(--text3)">—</span>';x=x/o.tc;}return (o.usdD||u?'US$ ':'$ ')+(x<200?x.toLocaleString('es-AR',{maximumFractionDigits:2}):_nvN(x));}
function _nvInv(o){return NV.mon==='usd'?o.usd:o.inv;}
function _nvM(){return NV.mon==='usd'?'US$ ':'$ ';}
function nvMon(){NV.mon=NV.mon==='usd'?'ars':'usd';nvSave();nvRender();}
function _nvCss(){if(document.getElementById('nv-css'))return;var st=document.createElement('style');st.id='nv-css';st.textContent=
 '#nv-root{margin-bottom:14px}#nv-root .nvlbl{font-size:.6rem;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;font-family:var(--mono)}'+
 '#nv-root .nvtop{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px}#nv-root .nvtop img{width:54px;height:54px;border-radius:50%;object-fit:cover;object-position:center top;border:2.5px solid var(--nvc);box-shadow:0 0 0 4px color-mix(in srgb,var(--nvc) 18%,transparent)}'+
 '#nv-root .nvk{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:7px 14px}#nv-root .nvk .v{font-family:var(--mono);font-weight:800;font-size:1.2rem;margin-top:2px}#nv-root .nvk .s{font-family:var(--mono);font-size:.68rem;color:var(--text2)}'+
 '#nv-root .nvseg{display:inline-flex;border:1px solid var(--border2);border-radius:9px;overflow:hidden;margin-bottom:8px}#nv-root .nvseg span{padding:6px 14px;font-size:.8rem;cursor:pointer;color:var(--text2);background:var(--surface2)}#nv-root .nvseg span.on{font-weight:700;color:#04150b;background:var(--accent)}#nv-root .nvseg span.on.v{background:var(--red);color:#fff}'+
 '#nv-root .nvbar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;padding:7px 8px;background:var(--surface2);border-radius:10px;margin:10px 0;font-size:.76rem}'+
 '#nv-root .nvchip{display:inline-flex;align-items:center;gap:5px;background:var(--bg);border:1px solid var(--border2);color:var(--text2);border-radius:999px;padding:3px 10px;font-size:.72rem;cursor:pointer;user-select:none}#nv-root .nvchip.on{background:var(--text);color:var(--bg);border-color:var(--text);font-weight:700}'+
 '#nv-root .nvsw{display:inline-flex;align-items:center;gap:6px;font-size:.74rem;color:var(--text2);cursor:pointer;padding:3px 8px;border-radius:8px;border:1px solid var(--border2);background:var(--bg)}#nv-root .nvsw i{width:24px;height:13px;border-radius:7px;background:var(--border2);position:relative;display:inline-block}#nv-root .nvsw i::after{content:"";position:absolute;left:2px;top:2px;width:9px;height:9px;border-radius:50%;background:var(--text3)}#nv-root .nvsw.on{color:var(--text);border-color:var(--red)}#nv-root .nvsw.on i{background:rgba(240,82,82,.6)}#nv-root .nvsw.on i::after{left:13px;background:#fff}'+
 '#nv-root .nvdist{display:grid;grid-template-columns:repeat(4,minmax(0,270px));justify-content:start;gap:10px;margin-bottom:8px}#nv-root .nvbox{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:10px 12px}'+
 '#nv-root .nvbk{display:grid;grid-template-columns:92px 1fr 26px;gap:8px;align-items:center;padding:4px 7px;border-radius:7px;cursor:pointer;font-size:.78rem;border:1px solid transparent}#nv-root .nvbk:hover{background:var(--surface2)}#nv-root .nvbk.on{background:var(--surface2);border-color:var(--text)}#nv-root .nvbk.dim{opacity:.4}#nv-root .nvbk .tr{height:12px;background:var(--bg);border-radius:4px;overflow:hidden}#nv-root .nvbk .tr span{display:block;height:100%;border-radius:0 4px 4px 0}#nv-root .nvbk .c{font-family:var(--mono);text-align:right;color:var(--text2)}'+
 '#nv-root .nvsum{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:.76rem;color:var(--text2);margin:4px 0 6px}#nv-root .nvclr{color:var(--blue);cursor:pointer;font-size:.72rem}'+
 '#nv-root .nvtw{max-height:70vh;overflow:auto;border:1px solid var(--border);border-radius:10px}#nv-root table{width:100%;border-collapse:collapse;font-size:.78rem}'+
 '#nv-root th{position:sticky;top:0;background:var(--surface2);color:var(--text3);font-weight:600;text-align:right;padding:6px 8px;border-bottom:1px solid var(--border);font-size:.6rem;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;z-index:1}#nv-root th .s{cursor:pointer;padding:2px 3px;border-radius:4px}#nv-root th .s:hover,#nv-root th .s.act{color:var(--text)}#nv-root th .sep{opacity:.5}'+
 '#nv-root td{padding:4px 8px;text-align:right;font-family:var(--mono);border-bottom:1px solid var(--border);white-space:nowrap;height:40px}#nv-root th.l,#nv-root td.l{text-align:left}#nv-root tr.sec td{background:var(--surface2);font-family:var(--sans);font-weight:700;text-align:left;height:30px}#nv-root tr.pick{cursor:pointer}#nv-root tr.pick:hover td{background:var(--surface2)}'+
 '#nv-root .c2{display:flex;flex-direction:column;align-items:flex-end;line-height:1.2}#nv-root .c2 small{color:var(--text3);font-size:.66rem}#nv-root .pt{display:inline-flex;align-items:center;gap:5px}#nv-root .pt .b{width:40px;height:5px;background:var(--bg);border-radius:3px;overflow:hidden}#nv-root .pt .b span{display:block;height:100%}'+
 '#nv-root .nvtb{height:auto;min-height:0;flex-wrap:wrap;overflow:visible;padding:6px 10px;row-gap:6px;background:var(--surface);border:1px solid var(--border);border-radius:12px;margin:0 0 10px;font-size:.68rem}#nv-root .nvtb>div{display:flex;flex-shrink:0;height:24px;margin-left:0!important}#nv-root .nvtb>div:last-child{border-right:none}'+
 '#nv-root .car{display:inline-block;width:14px;color:var(--text3);font-size:.7rem}#nv-root tr.abierta td{background:var(--surface2);border-bottom:none}#nv-root tr.det td{background:var(--surface2);text-align:left;font-family:var(--sans);height:auto;padding:6px 10px 10px 30px}#nv-root .nvdet{display:flex;gap:26px;flex-wrap:wrap;align-items:flex-start}#nv-root .nvdet b{font-family:var(--mono);font-size:.86rem}#nv-root .nvdet td{all:unset}'+
 '#nv-root .nvcv{display:flex;flex-direction:column;gap:3px}#nv-root .nvcv span{width:26px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-family:var(--mono);font-weight:800;font-size:.74rem;cursor:pointer;border:1px solid var(--accent);color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent)}#nv-root .nvcv span.v{border-color:var(--red);color:var(--red);background:color-mix(in srgb,var(--red) 10%,transparent)}#nv-root .nvcv span:hover{filter:brightness(1.3)}'+
 '#nv-root .flg{display:inline-block;width:20px;font-size:.9rem;font-family:var(--sans)}'+
 '#nv-root small.ptb{font-size:.78rem;font-weight:700;margin-top:2px}#nv-root small.ptb .b{width:52px;height:6px}#nv-root #nv-cards #top-cards-row{margin-bottom:0}'+
 'body.nv-on #page-portafolio>*:not(#nv-root):not(#port-pin-overlay):not(#mob-view){display:none!important}body.nv-port #sidebar-toggle-btn{display:none!important}#nv-root .nvfb{display:flex;flex-wrap:wrap;gap:5px;align-items:center;max-width:430px}#nv-root .nvtb #nv-q{margin-left:4px}@media(min-width:681px){body.nv-on .main{position:relative}body.nv-on .sidebar{position:absolute;top:0;left:0;bottom:0;z-index:950;will-change:width;box-shadow:6px 0 24px rgba(0,0,0,.45)}}body.nv-on #auth-user-box{display:none!important}body.nv-port .topbar:not(.nvtb){display:none!important}#nv-root .nvtb{justify-content:center}'+
 '#nv-root .dp{font-size:.92rem;font-weight:800;color:var(--dc);background:color-mix(in srgb,var(--dc) 14%,transparent);border:1px solid color-mix(in srgb,var(--dc) 35%,transparent);border-radius:6px;padding:1px 7px;margin-bottom:2px;min-width:62px;text-align:right}'+
 '#nv-root .nv2col{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start}#nv-root .nv2col .nvtw{max-height:78vh}'+
 '#nv-root .nvpv{width:105px;background:var(--surface);border:1px solid var(--border2);border-radius:6px;color:var(--text);font-family:var(--mono);font-size:.86rem;font-weight:700;padding:3px 7px;outline:none}#nv-root .nvpv:focus{border-color:var(--accent)}'+
 '#nv-root td.mut{color:var(--text3)}#nv-root td.up{font-size:.74rem}#nv-root td.ptb .b{width:46px;height:6px}#nv-root td.ptb{font-size:.8rem;font-weight:700}#nv-root td{height:34px}'+
 '#nv-root .nvf{display:inline-block;margin-left:5px;color:var(--accent);font-size:.66rem;font-weight:800;font-family:var(--mono);border:1px solid color-mix(in srgb,var(--accent) 45%,transparent);border-radius:4px;padding:0 4px;line-height:1.35;cursor:help;vertical-align:1px}'+
 '#nv-root .nvf.nvd{color:var(--blue);border-color:color-mix(in srgb,var(--blue) 45%,transparent)}#nv-root .nvf.nvfin{border:none;padding:0;font-size:.74rem}'+
 '#nv-root .nvmon{display:inline-flex;margin-left:6px;border:1px solid var(--border2);border-radius:999px;overflow:hidden;cursor:pointer;font-family:var(--mono);font-size:.68rem}#nv-root .nvmon b{padding:2px 8px;color:var(--text3);font-weight:700}#nv-root .nvmon b.on{background:var(--accent);color:#04120a}'+
 '#nv-root .mark-btn{font-size:.78rem;margin-right:3px}#nv-root .nvnote{display:inline-block;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle;margin-left:6px;font-size:.66rem;font-style:italic;color:var(--text2);font-family:var(--sans);cursor:help}'+
 '#nv-root .nvcal{display:flex;gap:6px;padding:.6rem 1rem 1rem}#nv-root .nvcal .dl{display:flex;flex-direction:column;gap:3px;margin-top:17px;font-size:.55rem;color:var(--text3);font-family:var(--mono)}#nv-root .nvcal .dl span{height:12px;line-height:12px}'+
 '#nv-root .nvcal .ml{display:flex;gap:3px;height:14px;font-size:.58rem;color:var(--text3);font-family:var(--mono)}#nv-root .nvcal .ml span{width:12px;white-space:nowrap}#nv-root .nvcal .gr{display:flex;gap:3px}#nv-root .nvcal .cc{display:flex;flex-direction:column;gap:3px}#nv-root .nvcal i{display:block;width:12px;height:12px;border-radius:2px;background:var(--surface2)}#nv-root .nvcal i.e{opacity:.4}#nv-root .nvcal i.nvf-cal{cursor:help}'+
 '#nv-root #nv-rep{align-self:center}'+
 '#nv-rep-ov{position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;padding:16px}#nv-rep-ov .rpc{background:var(--surface);border:1px solid var(--border2);border-radius:14px;padding:16px 18px;width:min(560px,100%);box-shadow:0 12px 40px rgba(0,0,0,.5)}'+
 '#nv-rep-ov .rph{display:flex;align-items:center;gap:10px;margin-bottom:12px}#nv-rep-ov .rpx{background:none;border:none;color:var(--text3);font-size:1rem;cursor:pointer}#nv-rep-ov .rpg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 14px;margin-bottom:12px}#nv-rep-ov .rpg b{font-family:var(--mono);font-size:.9rem}'+
 '#nv-rep-ov .nvlbl{font-size:.58rem;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;font-family:var(--mono)}#nv-rep-ov .rpm{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}#nv-rep-ov .rpb{background:var(--surface2);border:1px solid var(--border2);border-radius:999px;padding:4px 11px;color:var(--text2);cursor:pointer;font-size:.75rem}'+
 '#nv-rep-ov .rpb.on.buy{border-color:var(--accent);color:var(--accent)}#nv-rep-ov .rpb.on.sell{border-color:var(--red);color:var(--red)}#nv-rep-ov .rpb.on.watch{border-color:#f59e0b;color:#f59e0b}#nv-rep-ov textarea{width:100%;box-sizing:border-box;height:58px;resize:vertical;background:var(--bg);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:6px 8px;font-size:.8rem}'+
 '#nv-rep-ov .rpf{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:10px;flex-wrap:wrap}@media(max-width:560px){#nv-rep-ov .rpg{grid-template-columns:repeat(2,1fr)}}'+
 '#nv-mov .up{color:#22c55e}#nv-mov .dn{color:#ef4444}#nv-mov .mu{color:var(--text3)}#nv-mov .mg{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:10px;padding:.8rem 1rem}'+
 '#nv-mov .mt{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:9px 11px;cursor:pointer}#nv-mov .mt:hover{border-color:var(--border2)}#nv-mov .mt.sel{border-color:var(--blue);box-shadow:0 0 0 1px var(--blue)}'+
 '#nv-mov .th{display:flex;align-items:center;gap:6px;font-size:.84rem}#nv-mov .w{margin-left:auto;font-family:var(--mono);font-size:.6rem;color:var(--text3)}#nv-mov .tv{font-family:var(--mono);font-size:1.4rem;font-weight:800;margin-top:5px}#nv-mov .tu{font-family:var(--mono);font-size:.72rem;font-weight:700}'+
 '#nv-mov .heat{display:flex;gap:2px;height:10px;margin:8px 0 6px;border-radius:3px;overflow:hidden}#nv-mov .heat i{display:block;height:100%}#nv-mov .bw{display:flex;justify-content:space-between;gap:6px;font-family:var(--mono);font-size:.64rem;color:var(--text2)}'+
 '#nv-mov .bm{display:flex;gap:6px;align-items:center;font-family:var(--mono);font-size:.64rem;color:var(--text2);border-top:1px dashed var(--border);margin-top:6px;padding-top:5px}#nv-mov .bm .vs{margin-left:auto;font-weight:700}'+
 '#nv-mov .det{margin:0 1rem 1rem;background:var(--surface2);border:1px solid var(--border2);border-radius:10px;padding:10px 12px}#nv-mov table{width:100%;border-collapse:collapse;font-family:var(--mono);font-size:.76rem}#nv-mov td{padding:5px 4px;border-bottom:1px solid var(--border);text-align:left;height:auto}#nv-mov td.r{text-align:right}#nv-mov tr.hh td{color:var(--text3);font-size:.6rem;text-transform:uppercase}'+
 '.nvwhy{display:inline-flex;align-items:center;justify-content:center;margin-left:5px;width:16px;height:16px;border-radius:50%;border:1px solid var(--blue);color:var(--blue);font-size:.6rem;font-weight:800;cursor:pointer;vertical-align:1px;font-family:var(--sans)}.nvwhy:hover{background:var(--blue);color:#fff}'+
 '#nv-why{position:fixed;z-index:9500;display:none;background:#0d1420;border:1px solid var(--border2);border-radius:12px;padding:11px 13px;box-shadow:0 10px 30px rgba(0,0,0,.55);font-family:var(--sans);color:var(--text)}#nv-why .up{color:#22c55e}#nv-why .dn{color:#ef4444}'+
 '#nv-why .wh{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:7px;font-size:.88rem}#nv-why .wt{font-family:var(--mono);font-size:.6rem;border:1px solid var(--border2);color:var(--text2);border-radius:999px;padding:1px 8px}'+
 '#nv-why .wr{font-size:.82rem;line-height:1.45;margin:0 0 7px}#nv-why .ws{display:block;font-size:.72rem;color:var(--text2);border-left:2px solid var(--border2);padding-left:8px;margin:6px 0;line-height:1.4;text-decoration:none}#nv-why .ws:hover{color:var(--text)}#nv-why .ws small{display:block;color:var(--text3);font-family:var(--mono);font-size:.6rem;margin-top:2px}'+
 '#nv-why .wc{font-size:.7rem;color:var(--text2);background:var(--surface2);border-radius:8px;padding:6px 8px;margin-top:7px}#nv-why .wf{display:flex;justify-content:space-between;gap:8px;margin-top:8px;font-size:.62rem;font-family:var(--mono);color:var(--text3)}#nv-why .wf a{color:var(--blue);text-decoration:none}'+
 '#nv-root .nvtk[onclick]{cursor:pointer}#nv-root .nvtk[onclick]:hover{color:var(--blue);text-decoration:underline}'+
 '#nv-foco{position:fixed;inset:0;z-index:9400;background:rgba(0,0,0,.6);display:none;align-items:flex-start;justify-content:center;padding:24px 12px;overflow:auto}#nv-foco .fm{background:var(--surface);border:1px solid var(--border2);border-radius:16px;width:min(1080px,100%);box-shadow:0 20px 60px rgba(0,0,0,.6);color:var(--text)}'+
 '#nv-foco .fh{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 16px;border-bottom:1px solid var(--border)}#nv-foco .fg{display:grid;grid-template-columns:1.7fr 1fr;gap:12px;padding:12px 16px}@media(max-width:820px){#nv-foco .fg{grid-template-columns:1fr}}'+
 '#nv-foco .fb{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px 12px}#nv-foco .fl{font-family:var(--mono);font-size:.58rem;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}'+
 '#nv-foco .fk{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}#nv-foco .fk>div{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:7px 9px;min-width:0}#nv-foco .fv{font-family:var(--mono);font-weight:800;font-size:.9rem}#nv-foco .fs{font-size:.62rem;color:var(--text3);margin-top:2px}'+
 '#nv-foco .fseg{display:flex;gap:4px;font-family:var(--mono);font-size:.64rem}#nv-foco .fseg b{padding:2px 8px;border:1px solid var(--border2);border-radius:999px;color:var(--text3);font-weight:600;cursor:pointer}#nv-foco .fseg b.on{background:var(--blue);color:#fff;border-color:var(--blue)}'+
 '#nv-foco .fev{display:grid;grid-template-columns:auto auto 1fr;gap:5px 10px;font-size:.72rem;font-family:var(--mono)}#nv-foco .fev>span:nth-child(3n+1){color:var(--text3)}#nv-foco .fnw{display:block;font-size:.72rem;color:var(--text2);border-left:2px solid var(--border2);padding-left:8px;margin:6px 0;line-height:1.35;text-decoration:none}#nv-foco .fnw small{display:block;color:var(--text3);font-family:var(--mono);font-size:.6rem}'+
 '#nv-foco textarea{width:100%;box-sizing:border-box;min-height:60px;resize:vertical;background:var(--bg);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:6px 8px;font-size:.78rem}'+
 '#nv-ideal .itb{width:100%;border-collapse:collapse;font-size:.78rem}#nv-ideal .itb td{padding:7px 12px;border-bottom:1px solid var(--border);text-align:left;height:auto}#nv-ideal .itb td.r{text-align:right;font-family:var(--mono)}#nv-ideal .hh td{color:var(--text3);font-family:var(--mono);font-size:.58rem;text-transform:uppercase}'+
 '#nv-ideal .itr{position:relative;height:10px;background:var(--bg);border-radius:5px}#nv-ideal .itr i{position:absolute;left:0;top:0;bottom:0;border-radius:5px}#nv-ideal .itr b{position:absolute;top:-4px;bottom:-4px;width:2px;background:#fff}#nv-ideal .ied{cursor:pointer;border-bottom:1px dotted var(--text3)}'+
 '#nv-ideal .isug{margin:0 1rem 1rem;background:var(--surface2);border:1px solid var(--border2);border-radius:10px;padding:10px 12px}#nv-ideal .iop{display:grid;grid-template-columns:auto 1fr auto auto;gap:6px 14px;font-family:var(--mono);font-size:.74rem;align-items:center}#nv-ideal .iop small{color:var(--text3);font-family:var(--sans)}#nv-ideal .iv{color:#ef4444;font-weight:800}#nv-ideal .ic{color:#22c55e;font-weight:800}'+
 '#nv-root td.hoy{font-size:.74rem;font-weight:700}'+
 '#nv-val .vtb{width:100%;border-collapse:collapse;font-size:.78rem}#nv-val .vtb td{padding:7px 10px;border-bottom:1px solid var(--border);text-align:left;height:auto;white-space:nowrap}#nv-val .vtb td.r{text-align:right;font-family:var(--mono)}#nv-val .hh td{color:var(--text3);font-family:var(--mono);font-size:.58rem;text-transform:uppercase}@media(max-width:760px){#nv-val .vhm{display:none}}'+
 '.vpl{display:inline-block;border-radius:999px;padding:1px 8px;font-size:.66rem;font-weight:700;white-space:nowrap}.vbarata{background:rgba(34,197,94,.13);color:#22c55e}.vcara{background:rgba(239,68,68,.13);color:#ef4444}.vnormal,.vsn{background:rgba(122,156,197,.13);color:var(--text2)}.vrg{position:relative;width:100px;height:6px;border-radius:3px;background:linear-gradient(90deg,#22c55e55,#7a9cc555,#ef444455);display:inline-block;vertical-align:middle}.vrg i{position:absolute;top:-3px;width:4px;height:12px;margin-left:-2px;border-radius:2px;background:var(--text)}'+
 '#nv-root #nv-ops>.card{margin:0;width:fit-content!important;max-width:100%;display:block}#nv-root #nv-opw{width:fit-content;max-width:100%}@media(max-width:860px){#nv-root .nvdist{grid-template-columns:1fr}#sd-card .sd-g{grid-template-columns:1fr!important}}';document.head.appendChild(st);}
function nvModo(m){NV.modo=m;nvSave();var b=document.getElementById('vbuy-card'),s=document.getElementById('vsell-card');if(b)b.style.display=m==='c'?'':'none';if(s)s.style.display=m==='v'?'':'none';
 var sg=document.getElementById('nv-seg');if(sg)sg.innerHTML='<span class="'+(m==='c'?'on':'')+'" onclick="nvModo(\'c\')">🛒 Comprar</span><span class="'+(m==='v'?'on v':'')+'" onclick="nvModo(\'v\')">💸 Vender</span>';}
function nvVender(t){nvModo('v');try{if(typeof vsellPopulateSelect==='function')vsellPopulateSelect();}catch(e){}var sel=document.getElementById('vsell-ticker');if(sel){sel.value=t;var o=NV_ROWS.filter(function(x){return x.t===t;})[0];var q=document.getElementById('vsell-qty');if(q&&o)q.value=o.q;try{vsellPreview();}catch(e){}}
 var r=document.getElementById('nv-opw');if(r)r.scrollIntoView({behavior:'smooth',block:'start'});var pz=document.getElementById('vsell-precio-ars');if(pz)setTimeout(function(){try{pz.focus({preventScroll:true});pz.select();}catch(e){}},400);}
function nvBuscar(v){NV.q=(v||'').toUpperCase().trim();nvRender();}
function nvAbrir(t){if(!NV.op)NV.op={};if(NV.op[t])delete NV.op[t];else NV.op[t]=1;nvSave();nvRender();}
function _nvMover(){try{
 var kd=document.getElementById('nv-kd'),kc=document.getElementById('nv-kc');if(kd&&!document.getElementById('m-dolz'))kd.style.display='none';
 [['m-dolz',kd],['dolz-popover',kd],['m-count',kc]].forEach(function(x){var e=document.getElementById(x[0]);if(e&&x[1]&&e.parentNode!==x[1]){x[1].appendChild(e);if(x[0]!=='dolz-popover'){e.className='v';e.style.cssText='';}}});
 if(CFG.simRetiro&&!document.getElementById('page-simretiro')){var pp=document.getElementById('page-portafolio');if(pp){var sp=document.createElement('div');sp.className='page';sp.id='page-simretiro';pp.parentNode.appendChild(sp);
   var rb=document.querySelector('.nav-item[onclick*="recomendaciones"]');if(rb){var nb=document.createElement('button');nb.className='nav-item';nb.setAttribute('onclick',"showPage('simretiro',this)");nb.innerHTML='<span>🏖️</span>Simulador de retiro';rb.parentNode.insertBefore(nb,rb.nextSibling);}}}
 var sc=document.getElementById('simr-card'),spg=document.getElementById('page-simretiro');if(sc&&spg&&sc.parentNode!==spg){spg.appendChild(sc);sc.classList.remove('card-collapsed');var tg=sc.querySelector('.card-toggle');if(tg)tg.textContent='▾';}
 var uvb=document.getElementById('uv-banner'),nvd=document.querySelector('#nv-root .nvdist');if(uvb&&nvd&&uvb.nextSibling!==nvd)nvd.parentNode.insertBefore(uvb,nvd);
 var cw=document.getElementById('nv-cards'),tr=document.getElementById('top-cards-row');if(cw&&tr&&tr.parentNode!==cw)cw.appendChild(tr);
 var pie=document.getElementById('m-pie-sector'),db=document.getElementById('db-scroll');
 if(pie&&db&&!document.getElementById('nv-pies')){var box=pie.parentNode.parentNode.parentNode;var c=document.createElement('div');c.className='card';c.id='nv-pies';c.style.cssText='margin-bottom:1rem';
  c.innerHTML='<div class="card-header"><span class="card-title">🥧 Composición de la cartera</span></div>';c.appendChild(box);db.insertBefore(c,db.firstChild);}
}catch(e){console.warn('nv mover',e);}}
var _NV_MKT={nyse:'USA',argentina:'ARGENTINA',bonos:'BONOS',on:'ON',fci:'FCI',brasil:'BRASIL',europa:'EUROPA',china:'CHINA',cripto:'CRIPTO'};
function nvComprar(t){nvModo('c');var o=NV_ROWS.filter(function(x){return x.t===t;})[0],mk=document.getElementById('vbuy-mkt'),tk=document.getElementById('vbuy-ticker');
 if(mk&&o&&_NV_MKT[o.s]){mk.value=_NV_MKT[o.s];try{vbuyOnMktChange();}catch(e){}}if(tk)tk.value=t;
 var r=document.getElementById('nv-opw');if(r)r.scrollIntoView({behavior:'smooth',block:'start'});var q=document.getElementById('vbuy-precio-ars');if(q)setTimeout(function(){try{q.focus({preventScroll:true});q.select();}catch(e){}},400);}
function nvSetPV(t,v){var o=NV_ROWS.filter(function(x){return x.t===t;})[0];if(!o)return;
 var s=String(v||'').trim(),n=null;if(s){n=parseFloat(s.replace(/\./g,'').replace(',','.'));if(!(n>0)){alert('P. Venta inválido');nvRender();return;}}
 TARGET_TABLE[t]=n;
 try{localStorage.setItem((PFX+'targets'),JSON.stringify(TARGET_TABLE));}catch(e){}
 try{sbSetConfig('targets',TARGET_TABLE);}catch(e){}
 try{if(typeof renderTargets==='function')renderTargets();}catch(e){}
 renderPortfolio();}
function nvTip(el,tog){var t=document.getElementById('nv-tipbox');if(!t){t=document.createElement('div');t.id='nv-tipbox';t.style.cssText='position:fixed;z-index:9999;background:#0d1420;border:1px solid var(--border2);border-radius:6px;padding:5px 9px;font-size:.7rem;font-family:var(--mono);color:var(--text);box-shadow:0 4px 16px rgba(0,0,0,.5);pointer-events:none;white-space:nowrap;display:none';document.body.appendChild(t);}
 if(!el||(tog&&t.style.display!=='none'&&t._el===el)){t.style.display='none';t._el=null;return;}
 t.textContent=el.getAttribute('data-tip');t.style.display='block';t._el=el;var r=el.getBoundingClientRect();t.style.left=Math.max(6,Math.min(window.innerWidth-t.offsetWidth-6,r.left+r.width/2-t.offsetWidth/2))+'px';t.style.top=(r.top-t.offsetHeight-6<4?r.bottom+6:r.top-t.offsetHeight-6)+'px';}
document.addEventListener('mouseover',function(e){var f=e.target.closest&&e.target.closest('.nvf,.nvnote,.nvf-cal,#nv-kt');if(f)nvTip(f);});
document.addEventListener('mouseout',function(e){var f=e.target.closest&&e.target.closest('.nvf,.nvnote,.nvf-cal,#nv-kt');if(f&&!(e.relatedTarget&&f.contains(e.relatedTarget)))nvTip(null);});
document.addEventListener('scroll',function(){nvTip(null);},true);
function nvSort(k){NV.sd=NV.sk===k?-NV.sd:(k==='t'||k==='pais'?1:-1);NV.sk=k;nvSave();nvRender();}
function nvTog(key,i){NV[key][i]=!NV[key][i];nvSave();nvRender();}
function nvRender(){
 if(!CFG.vistaNueva)return;var pg=document.getElementById('page-portafolio');if(!pg)return;_nvCss();
 var root=document.getElementById('nv-root');
 if(!root){root=document.createElement('div');root.id='nv-root';var ov=document.getElementById('port-pin-overlay');pg.insertBefore(root,ov?ov.nextSibling:pg.firstChild);
  var hi=document.querySelector('header img'),col=hi?getComputedStyle(hi).borderColor:'#22c55e';root.style.setProperty('--nvc',col);
  root.innerHTML='<div class="topbar nvtb" id="nv-tb0"><span style="display:flex;align-items:center;gap:4px"><input id="nv-q" type="text" placeholder="🔍 Ticker" autocomplete="off" oninput="nvBuscar(this.value)" onkeydown="if(event.key===\'Escape\'){this.value=\'\';nvBuscar(\'\')}" style="width:110px;background:var(--surface);border:1px solid var(--border2);border-radius:999px;color:var(--text);font-family:var(--mono);font-size:.72rem;padding:3px 10px;outline:none;text-transform:uppercase"><span id="nv-qx" class="nvclr" style="display:none" onclick="var i=document.getElementById(\'nv-q\');i.value=\'\';nvBuscar(\'\')">✕</span><span id="nv-mon" class="nvmon" onclick="nvMon()" title="Ver la tabla en pesos o en dólares"></span></span></div><div class="nvtop"><img id="nv-img" src="'+(hi?hi.src:'')+'" alt=""><div class="nvk"><div class="nvlbl">Valor total</div><div class="v port-sensitive" id="nv-kv"></div><div class="s" id="nv-kva"></div></div><div class="nvk"><div class="v" id="nv-kr"></div><div class="s port-sensitive" id="nv-krs"></div></div><div class="nvk"><div class="v" id="nv-kh"></div><div class="s port-sensitive" id="nv-khs"></div></div><div class="nvk" id="nv-kd" style="position:relative"><div class="nvlbl" style="display:flex;justify-content:space-between;gap:8px"><span>% USD</span><span onclick="dolzTogglePopover(event)" title="Configurar activos dolarizados" style="cursor:pointer;opacity:.7">⚙️</span></div></div><div class="nvk" id="nv-kc"><div class="nvlbl">Posiciones</div></div><div class="nvk" id="nv-kt" style="cursor:help"></div><button class="btn" id="nv-rep" onclick="nvRepaso()" title="Repasar de a uno los activos marcados, cerca del P. Venta y los que más se movieron hoy">🌙 Repaso</button><div id="nv-fbar" class="nvfb"></div></div>'+
   '<div class="nvdist"><div class="nvbox"><div id="nv-dF"></div></div><div class="nvbox"><div id="nv-dG"></div></div><div class="nvbox"><div id="nv-dM"></div></div><div class="nvbox" title="Cuánto de lo invertido hay en cada tipo de activo (sin liquidez)"><div id="nv-dT"></div></div></div>'+
   '<div id="nv-tw2"></div><div id="nv-row2" style="display:flex;gap:14px;align-items:stretch;flex-wrap:wrap;margin-top:14px"><div id="nv-opw"><div class="nvseg" id="nv-seg"></div><div id="nv-ops"></div></div><div id="nv-calw" style="min-width:0;max-width:100%;padding-top:41px;display:flex"></div></div><div id="nv-cards" style="margin-top:14px"></div>';
  var ops=document.getElementById('nv-ops');['vbuy-card','vsell-card'].forEach(function(id){var c=document.getElementById(id);if(c){ops.appendChild(c);var h=c.querySelector('.card-header');if(h)h.style.display='none';}});
  try{var tb0=document.querySelector('.topbar'),nb=document.getElementById('nv-tb0');if(tb0&&nb)Array.prototype.slice.call(tb0.children).forEach(function(c){if(c.id!=='auth-user-box'&&c.id!=='tb-right')nb.appendChild(c);});}catch(e){}
  try{var stb=document.getElementById('sidebar-toggle-btn'),nimg=document.getElementById('nv-img');if(stb&&nimg){var mb=stb.cloneNode(true);mb.id='nv-menu-btn';mb.style.width='34px';mb.style.height='34px';mb.style.fontSize='1.05rem';nimg.parentNode.insertBefore(mb,nimg);}}catch(e){}
  try{var nt=root.querySelector('.nvtop'),tw=document.createElement('div');tw.id='nv-tools';tw.style.cssText='margin-left:auto;display:flex;align-items:center;gap:8px;flex-wrap:wrap';nt.appendChild(tw);
   var mv=function(){var kb=document.getElementById('kb-btn'),nb0=document.getElementById('nv-tb0');var qw=document.getElementById('nv-q');qw=qw&&qw.parentNode;if(nb0&&qw&&nb0.lastElementChild!==(kb||qw)){nb0.appendChild(qw);if(kb){kb.style.marginLeft='6px';nb0.appendChild(kb);}}
    ['cartera-activa-badge','port-eye-btn','lupd','sb-status','push-btn','sync-btn','bk-btn'].forEach(function(id){var e=document.getElementById(id);if(e&&e.parentNode!==tw)tw.appendChild(e);});
    var cb=document.querySelector('.hright button[onclick$="EnComparacion()"]');if(cb&&cb.parentNode!==tw)tw.appendChild(cb);
    var ab=document.querySelector('button[onclick="fetchAllQuotes()"]');if(ab&&ab.parentNode!==tw){tw.appendChild(ab);Array.prototype.slice.call(ab.childNodes).forEach(function(n){if(n.nodeType===3)n.remove();});ab.title='Actualizar precios';ab.className='btn btn-a';ab.style.cssText='padding:0 9px;font-size:.95rem;min-width:0';}};
   mv();setTimeout(mv,1500);setTimeout(mv,5000);}catch(e){}
  try{var stb0=document.getElementById('sidebar-toggle-btn'),tbo=document.querySelector('.topbar');if(stb0&&tbo){stb0.style.marginRight='10px';tbo.insertBefore(stb0,tbo.firstChild);}
   var hd=document.querySelector('header');if(hd)hd.style.display='none';document.body.classList.add('nv-port');document.body.classList.add('nv-on');document.documentElement.classList.remove('nv-pre');}catch(e){}
  var main=document.getElementById('main');if(main){main.style.outline='2px solid '+col;main.style.outlineOffset='-2px';main.style.borderRadius='14px';}
  nvModo(NV.modo);}
 _nvMover();try{nvTermo();nvCalendario();nvMov();nvIdeal();nvPlanSalida();nvVal();nvLinea();}catch(e){console.warn('nv extras',e);}
 var k=NV_K;document.getElementById('nv-kv').textContent=k.val!=null?'USD '+_nvN(k.val):'—';
 var kr=document.getElementById('nv-kr');kr.textContent=_nvP(k.rend);kr.style.color=k.rend>=0?'var(--accent)':'var(--red)';document.getElementById('nv-krs').textContent=k.gan!=null?((k.gan>=0?'+':'−')+'USD '+_nvN(Math.abs(k.gan))):'';
 var kh=document.getElementById('nv-kh');kh.textContent=_nvP(k.hoyP);kh.style.color=(k.hoyP||0)>=0?'var(--accent)':'var(--red)';document.getElementById('nv-khs').textContent=k.hoy!=null?((k.hoy>=0?'+':'−')+'USD '+_nvN(Math.abs(k.hoy))):'';
 var tsel=_nvTsSel(),tl=NV_ROWS.filter(function(o){return NV.tipo==='rv'?o.rv:NV.tipo==='rf'?!o.rv:true;});
 var _nmk=NV_ROWS.filter(function(o){return MARKS[o.t];}).length;document.getElementById('nv-fbar').innerHTML=(_nmk||NV.mk?'<span class="nvchip'+(NV.mk?' on':'')+'" onclick="NV.mk=!NV.mk;nvSave();nvRender()" title="Ver solo los activos marcados">🏷 Marcados <span style="font-family:var(--mono);font-size:.64rem;color:var(--text3)">'+_nmk+'</span></span>':'')+NV_TS.map(function(x){var n=tl.filter(function(o){return o.s===x[0];}).length;if(!n&&!(NV.ts||{})[x[0]])return '';var on=!!(NV.ts||{})[x[0]];return '<span class="nvchip'+(on?' on':'')+'"'+(tsel.length&&!on?' style="opacity:.5"':'')+' onclick="nvTs(\''+x[0]+'\')">'+x[1]+' <span style="font-family:var(--mono);font-size:.64rem;color:var(--text3)">'+n+'</span></span>';}).join('')+'';
 var dist=function(id,B,key,sin){var L=NV_ROWS.filter(function(o){return _nvOk(o,sin);}),cnt=B.map(function(b){return L.filter(b[1]).length;}),mx=Math.max.apply(null,cnt)||1,anySel=_nvSel(NV[key]).length;
  document.getElementById(id).innerHTML=B.map(function(b,i){var on=!!NV[key][i];return '<div class="nvbk'+(on?' on':'')+(anySel&&!on?' dim':'')+'" onclick="nvTog(\''+key+'\','+i+')"><span>'+b[0]+'</span><div class="tr"><span style="width:'+(cnt[i]/mx*100)+'%;background:'+b[2]+'"></span></div><span class="c">'+cnt[i]+'</span></div>';}).join('');};
 dist('nv-dF',NV_FD,'df','f');dist('nv-dG',NV_GD,'dg','g');dist('nv-dM',NV_MD,'dm','m');try{nvTipos();}catch(e){}
 var nm=document.getElementById('nv-mon');if(nm)nm.innerHTML='<b'+(NV.mon!=='usd'?' class="on"':'')+'>$</b><b'+(NV.mon==='usd'?' class="on"':'')+'>US$</b>';
 var qx=document.getElementById('nv-qx');if(qx)qx.style.display=NV.q?'':'none';
 var L=NV_ROWS.filter(function(o){return _nvOk(o);}),desc=[],nom=function(m,B){return _nvSel(m).map(function(i){return B[i][0];}).join(' o ');};
 if(NV.q)desc=['búsqueda "'+NV.q+'" (sin filtros)'];else if(_nvTsSel().length)desc.push('tipo '+NV_TS.filter(function(x){return NV.ts[x[0]];}).map(function(x){return x[1];}).join(' o '));if(_nvSel(NV.df).length)desc.push('distancia '+nom(NV.df,NV_FD));if(_nvSel(NV.dg).length)desc.push('ganancia '+nom(NV.dg,NV_GD));if(_nvSel(NV.dm).length)desc.push('inversión '+nom(NV.dm,NV_MD));
 var sh=function(k,t){return '<span class="s'+(NV.sk===k?' act':'')+'" onclick="nvSort(\''+k+'\')">'+t+(NV.sk===k?(NV.sd>0?' ▲':' ▼'):'')+'</span>';};
 var srt=function(a,b){if(NV.sk==='pais'){var ia=_nvPaisI(a.s),ib=_nvPaisI(b.s);return ia!==ib?(ia-ib)*NV.sd:a.t.localeCompare(b.t);}var x=a[NV.sk],y=b[NV.sk];if(NV.sk==='up'){x=x==null?9999:x;y=y==null?9999:y;}else{if(x==null)return 1;if(y==null)return -1;}return (typeof x==='string'?x.localeCompare(y):x-y)*NV.sd;};
 var upC=function(u){return u==null?'<span style="color:var(--text3)">—</span>':u<=0?'<span style="color:#e3b341;font-weight:700">🎯 llegó</span>':'<span style="color:'+(u<=5?'#e3b341':u<=15?'var(--blue)':'var(--text3)')+'">↑ '+u.toFixed(1).replace('.',',')+'%</span>';};
 if(['pais','t','d','up','px','ch','ppc','inv','pt'].indexOf(NV.sk)<0){NV.sk='inv';NV.sd=-1;}
 var op=NV.op||(NV.op={});
 var it=[],h='<thead><tr><th class="l">'+sh('pais','País')+'<span class="sep"> / </span>'+sh('t','Ticker')+'</th><th>'+sh('d','Δ%')+'</th><th>'+sh('up','ΔUp')+'</th><th>'+sh('px','Precio')+'</th><th>'+sh('ch','Hoy')+'</th><th>'+sh('ppc','PPC')+'</th><th>'+sh('inv','Inversión')+'</th><th>'+sh('pt','% tipo')+'</th></tr></thead><tbody>';
 [['rv','Renta variable'],['rf','Renta fija']].forEach(function(sg){var X=L.filter(function(o){return o.rv===(sg[0]==='rv');}).sort(srt);if(!X.length)return;
  var sh0='<tr class="sec"><td colspan="8">'+sg[1]+' <span style="color:var(--text3);font-weight:400">· '+X.length+' activos · <span class="port-sensitive">'+_nvM()+_nvN(X.reduce(function(s,o){return s+(_nvInv(o)||0);},0))+'</span></span></td></tr>';it.push({s:sh0,n:sg[1]});
  X.forEach(function(o){var pc=o.pt>3?'var(--red)':o.pt>2?'#eab308':'var(--blue)',ab=!!op[o.t];
   var mk=MARKS[o.t],mki=mk?({sell:'🔴',buy:'🟢',watch:'⭐',note:'📝'})[mk.type]||'🏷':'🏷';
   var r='<tr class="pick'+(ab?' abierta':'')+(mk&&mk.type!=='note'?' marked-'+mk.type:'')+'" onclick="nvAbrir(\''+o.t+'\')" title="Ver más"><td class="l"><span class="car">'+(ab?'▾':'▸')+'</span>'+(o.rv?'<span class="flg" title="'+(_nvPaisN[o.s]||'')+'">'+(_nvFlag[o.s]||'')+'</span>':'')+'<button class="mark-btn'+(mk?' active':'')+'" data-ticker="'+o.t+'" onclick="event.stopPropagation();openMarkPopover(this.dataset.ticker,this)" title="Marcar: Comprar, Vender, Seguir o nota">'+mki+'</button><b class="nvtk" style="font-family:var(--sans);font-size:.84rem"'+(_focoOn()?' onclick="event.stopPropagation();nvFoco(\''+o.t+'\')" title="Ver todo de '+o.t+'"':'')+'>'+o.t+'</b>'+(mk&&mk.note?'<span class="nvnote" data-tip="'+mk.note.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')+'">'+mk.note.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span>':'')+(o.fl?'<span class="nvf" data-tip="'+o.fl.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')+'" onclick="event.stopPropagation();nvTip(this,true)">F</span>':'')+(o.dh?'<span class="nvf nvd" data-tip="Por tu historial, estimamos un dividendo dentro de 30 días" onclick="event.stopPropagation();nvTip(this,true)">D</span>':'')+(o.fin?'<span class="nvf nvfin" data-tip="A finish" onclick="event.stopPropagation();nvTip(this,true)">🏁</span>':'')+(o.ph?'<button class="ph-btn" data-tk="'+o.t+'" data-ppc="'+o.ppcU+'" onclick="event.stopPropagation();phAbrir(this.dataset.tk,+this.dataset.ppc)" title="Ver historial de precio" style="background:none;border:none;cursor:pointer;padding:0 0 0 5px;font-size:.74rem;opacity:.8">📈</button>':'')+'</td>'+
    '<td><span class="dp" style="'+(o.d==null?'color:var(--text3)':'--dc:'+(o.d>=10?'var(--accent)':o.d>=0?'#eab308':'var(--red)'))+'">'+(o.d==null?'—':(Math.round(o.d)>0?'+':Math.round(o.d)<0?'−':'')+Math.abs(Math.round(o.d))+'%')+'</span></td>'+
    '<td class="up">'+upC(o.up)+'</td>'+
    '<td>'+_nvF(o.px,o)+(o.qh||'')+'</td>'+
    '<td class="hoy">'+(o.ch==null||!isFinite(o.ch)?'<span style="color:var(--text3)">—</span>':'<span style="color:'+(o.ch>0?'var(--accent)':o.ch<0?'var(--red)':'var(--text3)')+'">'+(o.ch>0?'▲ ':o.ch<0?'▼ ':'')+Math.abs(o.ch).toFixed(1).replace('.',',')+'%</span>'+(_whyOn()&&Math.abs(o.ch)>=3?'<span class="nvwhy" title="¿Por qué se movió?" onclick="event.stopPropagation();nvWhy(\''+o.t+'\',this)">?</span>':''))+'</td>'+
    '<td class="mut">'+_nvF(o.ppc,o)+'</td>'+
    '<td><span class="port-sensitive" style="color:'+o.invCol+';font-weight:'+(o.invCol!=='var(--text)'?700:400)+'">'+_nvM()+_nvN(_nvInv(o))+'</span></td>'+
    '<td class="ptb"><span class="pt"><span class="b"><span style="width:'+Math.min(100,o.pt/6*100)+'%;background:'+pc+'"></span></span><span style="color:'+(o.pt>2?pc:'var(--text2)')+'">'+o.pt.toFixed(1).replace('.',',')+'%</span></span></td></tr>';
   if(ab)r+='<tr class="det"><td colspan="8"><div class="nvdet">'+
    '<div onclick="event.stopPropagation()"><div class="nvlbl">P. Venta USD ✎</div><input class="nvpv" type="text" inputmode="decimal" value="'+(o.pvU!=null&&isFinite(o.pvU)?String(o.pvU).replace('.',','):'')+'" placeholder="sin P. Venta" title="Escribí el nuevo P. Venta y Enter (vacío = sacarlo)" onkeydown="if(event.key===\'Enter\'){this.blur();}else if(event.key===\'Escape\'){this.value=this.defaultValue;this.blur();}" onblur="if(this.value!==this.defaultValue)nvSetPV(\''+o.t+'\',this.value)"></div>'+
    '<div title="Vender todos los nominales" style="cursor:pointer" onclick="event.stopPropagation();nvVender(\''+o.t+'\')"><div class="nvlbl">Nominales ↓</div><b class="port-sensitive" style="text-decoration:underline dotted;text-underline-offset:3px">'+(o.q%1===0?_nvN(o.q):o.q.toLocaleString('es-AR',{maximumFractionDigits:2}))+'</b></div>'+
    '<div><div class="nvlbl">'+(o.rv?'RSI':'TIR')+'</div><b>'+(o.rsiH||'<span style="color:var(--text3)">—</span>')+'</b></div>'+
    (function(){var x=_valOn()&&_valOk(o)?_valDe(o.t):null;if(!x)return '';var nf=function(v){return v.toLocaleString('es-AR',{maximumFractionDigits:v<100?2:0});};
     return (x.pe>0?'<div><div class="nvlbl">P/E vs mediana 5 años</div><b>'+x.pe.toFixed(1).replace('.',',')+'</b> '+_valPill(x)+'</div>':'')+(x.pos!=null?'<div><div class="nvlbl">52 semanas (USD)</div><b>'+nf(x.lo)+' – '+nf(x.hi)+'</b> <span style="font-size:.7rem;color:var(--text2)">'+(x.dmax<0?'−':'')+Math.abs(x.dmax).toFixed(1).replace('.',',')+'% del máx.</span></div>':'');})()+
    '<div style="margin-left:auto;align-self:center;display:flex;gap:6px"><span class="nvchip" onclick="event.stopPropagation();nvComprar(\''+o.t+'\')">🛒 Comprar</span><span class="nvchip" onclick="event.stopPropagation();nvVender(\''+o.t+'\')">💸 Vender</span></div>'+
    '</div></td></tr>';
   it.push({r:r});});});
 var tb=function(arr){return '<div class="nvtw"><table>'+h+arr.join('')+'</tbody></table></div>';},nA=it.filter(function(x){return x.r;}).length;
 var dos=window.innerWidth>=1500&&nA>12,out;try{if(_portBlurred)root.classList.add('port-blurred');}catch(e){}
 if(!dos)out=tb(it.map(function(x){return x.s||x.r;}));
 else{var half=Math.ceil(nA/2),A=[],B=[],c=0,curS=null;it.forEach(function(x){if(x.s){curS=x;(c<half?A:B).push(x.s);return;}
   if(c<half)A.push(x.r);else{if(!B.length&&curS)B.push(curS.s.replace(curS.n,curS.n+' (cont.)'));B.push(x.r);}c++;});
  out='<div class="nv2col">'+tb(A)+tb(B)+'</div>';}
 document.getElementById('nv-tw2').innerHTML=out;
 if(!window._nvRz){window._nvRz=1;var _w=window.innerWidth>=1500;window.addEventListener('resize',function(){var w=window.innerWidth>=1500;if(w!==_w){_w=w;nvRender();}});}
}

// ─── 🌡 Termómetro · 📅 Calendario de ganancias · 🌙 Repaso nocturno (vista nueva) ─────────────
function nvTermo(){var el=document.getElementById('nv-kt');if(!el)return;var L=NV_ROWS,n=0,v=0,cerca=0,rsiN=0,rsiA=0;
 L.forEach(function(o){if(o.ch!=null&&isFinite(o.ch)){n++;if(o.ch>0)v++;}if(o.up!=null&&o.up<=5)cerca++;if(o.rv&&o.rsi!=null){rsiN++;if(o.rsi>=70)rsiA++;}});
 var pv=n?v/n*100:null,pr=rsiN?rsiA/rsiN*100:0,est,col;
 if(pv==null){est='—';col='var(--text3)';}else if(pv>=70||pr>=25){est='Eufórica';col='#f59e0b';}else if(pv<=30){est='Deprimida';col='var(--blue)';}else{est='Neutral';col='var(--text2)';}
 el.innerHTML='<div class="nvlbl">Termómetro</div><div class="v" style="color:'+col+';font-size:1rem">'+est+'</div><div class="s">'+(pv==null?'—':Math.round(pv)+'% en verde')+' · 🎯 '+cerca+' · RSI≥70 '+rsiA+'</div>';
 el.setAttribute('data-tip',(pv==null?'Sin variación del día todavía':Math.round(pv)+'% de tus activos suben hoy')+' · '+cerca+' a 5% o menos del P. Venta · '+rsiA+' de '+rsiN+' con RSI ≥ 70 (sobrecomprados)');}
var _calKey='';
function nvCalendario(){if(!CFG.historial||typeof histSerie!=='function'||!HIST)return;var cw=document.getElementById('nv-calw')||document.getElementById('nv-cards');if(!cw)return;
 var S=histSerie().filter(function(x){return !x.previo;});if(S.length<2)return;var key=S.length+'|'+S[S.length-1].d+'|'+S[S.length-1].v;
 var card=document.getElementById('nv-cal');if(card&&card.parentNode!==cw)cw.insertBefore(card,cw.firstChild);if(card&&key===_calKey)return;_calKey=key;
 if(!card){card=document.createElement('div');card.className='card';card.id='nv-cal';card.style.cssText='margin:0;overflow-x:auto;width:fit-content;max-width:100%;display:flex;align-items:center';cw.insertBefore(card,cw.firstChild);}
 var D={};for(var i=1;i<S.length;i++){var a=S[i-1],b=S[i];if(!(a.v>0))continue;var flujo=(b.inv!=null&&a.inv!=null)?(b.inv-a.inv):0,g=(b.v-a.v)-flujo;D[b.d]={u:g,p:g/a.v*100};}
 var hoy=new Date(),ini=new Date(hoy),f0=new Date(S[0].d+'T12:00:00'),min=new Date(hoy);min.setDate(min.getDate()-56);ini.setDate(ini.getDate()-364);if(f0>ini)ini=f0<min?f0:min;while(ini.getDay()!==1)ini.setDate(ini.getDate()-1);
 var iso=function(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
 var MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],cols=[],mesLbl=[],d=new Date(ini),pos=0,neg=0,best=null,worst=null;
 while(d<=hoy){var col=[],lbl='';for(var k=0;k<5;k++){var x=new Date(d);x.setDate(d.getDate()+k);if(x>hoy){col.push('<i class="e"></i>');continue;}var s=iso(x),r=D[s];if(x.getDate()<=7&&k===0)lbl=MES[x.getMonth()];
   if(!r){col.push('<i class="e" ></i>');continue;}if(r.u>0)pos++;else if(r.u<0)neg++;if(!best||r.u>best.u)best={d:s,u:r.u,p:r.p};if(!worst||r.u<worst.u)worst={d:s,u:r.u,p:r.p};
   var t=Math.min(1,Math.abs(r.p)/2),c=r.u>=0?'rgba(34,197,94,'+(0.18+0.8*t).toFixed(2)+')':'rgba(239,68,68,'+(0.18+0.8*t).toFixed(2)+')';
   col.push('<i class="nvf-cal" style="background:'+c+'" data-tip="'+s.split('-').reverse().join('/')+': '+(r.p>=0?'+':'−')+Math.abs(r.p).toFixed(2).replace('.',',')+'% ('+(r.u>=0?'+':'−')+'USD '+Math.round(Math.abs(r.u)).toLocaleString('es-AR')+')"></i>');}
  cols.push('<div class="cc">'+col.join('')+'</div>');mesLbl.push('<span>'+lbl+'</span>');d.setDate(d.getDate()+7);}
 var f=function(x){return x?x.d.split('-').reverse().slice(0,2).join('/')+' '+(x.u>=0?'+':'−')+'USD '+Math.round(Math.abs(x.u)).toLocaleString('es-AR'):'—';};
 card.innerHTML='<div style="display:flex;gap:16px;align-items:flex-start;padding:.7rem .9rem"><div class="nvcal" style="padding:0"><div class="dl"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span></div><div><div class="ml">'+mesLbl.join('')+'</div><div class="gr">'+cols.join('')+'</div></div><div style="min-width:150px;max-width:210px;font-family:var(--mono);font-size:.66rem;color:var(--text2);line-height:1.6"><div class="card-title" style="font-size:.84rem;margin-bottom:6px;font-family:var(--sans);white-space:nowrap">📅 Ganancias por día</div><span class="tag">'+(S.length<60?'desde '+S[0].d.split('-').reverse().slice(0,2).join('/'):'12 meses')+'</span><div style="margin-top:6px"><b style="color:var(--accent)">'+pos+'</b> en verde · <b style="color:var(--red)">'+neg+'</b> en rojo</div><div>mejor <span class="port-sensitive">'+f(best)+'</span></div><div>peor <span class="port-sensitive">'+f(worst)+'</span></div></div></div>';}
var _rp={L:[],i:0};
function _rpPri(o){if(MARKS[o.t])return 0;if(o.up!=null&&o.up<=5)return 1;if(o.ch!=null&&Math.abs(o.ch)>=3)return 2;return 3;}
function nvRepaso(){var L=NV_ROWS.filter(function(o){return _rpPri(o)<3;}).sort(function(a,b){return _rpPri(a)-_rpPri(b)||(b.inv||0)-(a.inv||0);});
 if(!L.length)L=NV_ROWS.slice().sort(function(a,b){return (b.inv||0)-(a.inv||0);});if(!L.length)return;_rp={L:L,i:0,cambio:false};
 var ov=document.getElementById('nv-rep-ov');if(!ov){ov=document.createElement('div');ov.id='nv-rep-ov';document.body.appendChild(ov);}ov.style.display='flex';_rpShow();}
function _rpCerrar(){var ov=document.getElementById('nv-rep-ov');if(ov)ov.style.display='none';if(_rp.cambio){saveMarks();renderPortfolio();}}
function _rpIr(k){_rpNota();_rp.i=Math.max(0,Math.min(_rp.L.length-1,_rp.i+k));_rpShow();}
function _rpNota(){var ta=document.getElementById('rp-nota');if(!ta)return;var o=_rp.L[_rp.i],m=MARKS[o.t],n=ta.value.trim();if((m&&m.note||'')===n)return;
 if(m){m.note=n;if(!n&&m.type==='note')delete MARKS[o.t];}else if(n)MARKS[o.t]={type:'note',note:n};_rp.cambio=true;}
function _rpMarca(tp){_rpNota();var o=_rp.L[_rp.i],m=MARKS[o.t];if(!tp){if(m&&m.note)m.type='note';else delete MARKS[o.t];}else if(m&&m.type===tp){if(m.note)m.type='note';else delete MARKS[o.t];}else MARKS[o.t]={type:tp,note:m&&m.note||''};_rp.cambio=true;_rpShow();}
function _rpShow(){var ov=document.getElementById('nv-rep-ov');if(!ov)return;var o=_rp.L[_rp.i],m=MARKS[o.t]||{},pri=_rpPri(o);
 var por=['🏷 marcado','🎯 cerca del P. Venta','⚡ se movió fuerte hoy','📋 posición'][pri];
 var cel=function(l,v){return '<div><div class="nvlbl">'+l+'</div><b>'+v+'</b></div>';};
 var pc=function(x,dec){return x==null||!isFinite(x)?'—':'<span style="color:'+(x>=0?'var(--accent)':'var(--red)')+'">'+(x>=0?'+':'−')+Math.abs(x).toFixed(dec||1).replace('.',',')+'%</span>';};
 var bt=function(tp,txt){return '<button class="rpb'+(m.type===tp?' on '+tp:'')+'" onclick="_rpMarca(\''+tp+'\')">'+txt+'</button>';};
 ov.innerHTML='<div class="rpc"><div class="rph"><span style="font-size:1.1rem">'+(_nvFlag[o.s]||'')+'</span><b style="font-size:1.5rem;font-family:var(--sans)">'+o.t+'</b><span class="tag">'+por+'</span><span style="margin-left:auto;font-family:var(--mono);font-size:.75rem;color:var(--text3)">'+(_rp.i+1)+' / '+_rp.L.length+'</span><button class="rpx" onclick="_rpCerrar()" title="Cerrar (Esc)">✕</button></div>'+
  '<div class="rpg">'+cel('Δ%',pc(o.d,0))+cel('ΔUp',o.up==null?'—':(o.up<=0?'🎯 llegó':'↑ '+o.up.toFixed(1).replace('.',',')+'%'))+cel('Hoy',pc(o.ch))+cel('Precio',_nvF(o.px,o))+cel('PPC',_nvF(o.ppc,o))+cel('Inversión','<span class="port-sensitive">'+_nvM()+_nvN(_nvInv(o))+'</span>')+cel('% tipo',(o.pt||0).toFixed(1).replace('.',',')+'%')+cel('P. Venta USD',o.pvU!=null?String(o.pvU).replace('.',','):'—')+cel(o.rv?'RSI':'TIR',o.rsiH||'—')+'</div>'+
  '<div class="rpm">'+bt('buy','🟢 Comprar')+bt('sell','🔴 Vender')+bt('watch','⭐ Seguir')+(MARKS[o.t]?'<button class="rpb" onclick="_rpMarca(\'\')">Quitar marca</button>':'')+'</div>'+
  '<textarea id="rp-nota" placeholder="Nota para mañana…" onblur="_rpNota()">'+(m.note||'').replace(/</g,'&lt;')+'</textarea>'+
  '<div class="rpf"><button class="btn" onclick="_rpIr(-1)" '+(_rp.i?'':'disabled')+'>← Anterior</button><span style="color:var(--text3);font-size:.68rem;font-family:var(--mono)">→ / espacio: siguiente · C V S: marcar · N: nota · Esc: cerrar</span><button class="btn btn-a" onclick="'+(_rp.i<_rp.L.length-1?'_rpIr(1)':'_rpCerrar()')+'">'+(_rp.i<_rp.L.length-1?'Siguiente →':'Terminar ✓')+'</button></div></div>';}
document.addEventListener('keydown',function(e){var ov=document.getElementById('nv-rep-ov');if(!ov||ov.style.display==='none')return;var inTa=e.target&&e.target.id==='rp-nota';
 if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(inTa){e.target.blur();return;}_rpCerrar();return;}if(inTa)return;
 var k=e.key.toLowerCase(),h=true;if(k==='arrowright'||k===' ')_rpIr(1);else if(k==='arrowleft')_rpIr(-1);else if(k==='c')_rpMarca('buy');else if(k==='v')_rpMarca('sell');else if(k==='s')_rpMarca('watch');else if(k==='n'){var t=document.getElementById('rp-nota');if(t)t.focus();}else h=false;
 if(h){e.preventDefault();e.stopPropagation();}},true);

var _trC=(function(){try{return JSON.parse(localStorage.getItem('tr_es_v1')||'{}')||{};}catch(e){return {};}})();
function _trT(h){return _trC[h]||h;}
function _trN(L){var miss=(L||[]).filter(function(h){return h&&!_trC[h];});if(!miss.length)return Promise.resolve();
 return Promise.all(miss.slice(0,8).map(function(h){return fetchWithTimeout('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q='+encodeURIComponent(h),{},6000).then(function(r){return r.ok?r.json():null;}).then(function(j){var t=j&&j[0]?j[0].map(function(x){return x&&x[0]||'';}).join(''):'';if(t)_trC[h]=t;}).catch(function(){});}))
  .then(function(){try{var k=Object.keys(_trC);if(k.length>400)k.slice(0,k.length-400).forEach(function(x){delete _trC[x];});localStorage.setItem('tr_es_v1',JSON.stringify(_trC));}catch(e){}});}
// ─── ❓ Explicame este movimiento (GDC): noticia probable + contexto del grupo, sin IA ─────────────────────
var _whyC={},_WHY_BM={nyse:['spy','S&P 500'],brasil:['ewz','EWZ'],argentina:['imv','Merval/CCL'],cripto:['btc','Bitcoin']};
var _WHY_PAIS={nyse:['🇺🇸','USA'],brasil:['🇧🇷','Brasil'],argentina:['🇦🇷','Argentina'],europa:['🇪🇺','Europa'],china:['🇨🇳','China'],cripto:['₿','Cripto'],bonos:['📜','Bonos'],on:['🏢','ONs'],fci:['📈','FCI']};
function _whyOn(){return !!(CFG.simRetiro||CFG.explicame);}
function _whyMotivo(h){h=h||'';
 if(/(\bearnings\b|quarterly results|\bq[1-4]\b|revenue|profit|\bbeats?\b|\bmiss(es|ed)?\b|results)/i.test(h))return ['📊','resultados','sus resultados'];
 if(/(upgrad|raises? .{0,25}target|lifts? .{0,25}target|boosts? .{0,25}target|outperform|\bbuy rating)/i.test(h))return ['⬆️','recomendación','una mejora de recomendación de analistas'];
 if(/(downgrad|cuts? .{0,25}target|lowers? .{0,25}target|underperform|\bsell rating)/i.test(h))return ['⬇️','recomendación','una baja de recomendación de analistas'];
 if(/(acquir|acquisition|merger|buyout|takeover|\bbid\b|to buy\b)/i.test(h))return ['🤝','fusión','una fusión o compra'];
 if(/dividend|buyback|repurchase/i.test(h))return ['💵','dividendo','un anuncio de dividendo o recompra'];
 if(/(guidance|outlook|forecast)/i.test(h))return ['🔮','perspectivas','un cambio en sus perspectivas'];
 if(/(lawsuit|probe|investigation|\bsec\b|fine|regulat|ban\b|sanction)/i.test(h))return ['⚖️','regulación','un tema regulatorio o judicial'];
 if(/(contract|deal|partner|launch|unveil|approv|agreement)/i.test(h))return ['📰','negocio','una noticia de negocio (acuerdo, lanzamiento o aprobación)'];
 return ['📰','noticia','una noticia de la empresa'];}
function _whyGrupo(sec,excl){var L=NV_ROWS.filter(function(o){return o.s===sec&&o.ch!=null&&isFinite(o.ch);}),d=0,b=0,up=0,dn=0;
 L.forEach(function(o){var u=o.usd||0;if(u>0){var bb=u/(1+o.ch/100);d+=u-bb;b+=bb;}if(o.t!==excl){if(o.ch>=1)up++;else if(o.ch<=-1)dn++;}});
 var bm=_WHY_BM[sec],bv=bm?_nvBm(bm[0]):null;return {n:L.length,p:b>0?d/b*100:null,up:up,dn:dn,bm:bm?bm[1]:null,bv:bv,L:L};}
function _whyP(x){return x==null||!isFinite(x)?'—':'<b class="'+(x>=0?'up':'dn')+'">'+(x>=0?'+':'−')+Math.abs(x).toFixed(1).replace('.',',')+'%</b>';}
function _whyBox(el,html){var b=document.getElementById('nv-why');if(!b){b=document.createElement('div');b.id='nv-why';document.body.appendChild(b);
  document.addEventListener('click',function(e){var bx=document.getElementById('nv-why');if(bx&&bx.style.display!=='none'&&!bx.contains(e.target)&&!(e.target.closest&&e.target.closest('.nvwhy')))bx.style.display='none';},true);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){var bx=document.getElementById('nv-why');if(bx)bx.style.display='none';}});}
 b.innerHTML=html;b.style.display='block';var r=el.getBoundingClientRect(),w=Math.min(440,window.innerWidth-16);b.style.width=w+'px';
 b.style.left=Math.max(8,Math.min(window.innerWidth-w-8,r.right-w))+'px';var h=b.offsetHeight;b.style.top=(r.bottom+6+h>window.innerHeight&&r.top-h-6>4?r.top-h-6:Math.min(r.bottom+6,window.innerHeight-h-8))+'px';b._el=el;}
function _whyEsc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function _whyAgo(ts){var m=Math.max(0,Math.round((Date.now()/1000-ts)/60));return m<60?'hace '+m+' min':m<1440?'hace '+Math.round(m/60)+' h':'hace '+Math.round(m/1440)+' d';}
async function nvWhy(t,el){var o=NV_ROWS.filter(function(x){return x.t===t;})[0];if(!o)return;var bx=document.getElementById('nv-why');if(bx&&bx.style.display!=='none'&&bx._el===el){bx.style.display='none';return;}
 var pais=_WHY_PAIS[o.s]||['',''],g=_whyGrupo(o.s,t),sube=o.ch>=0;
 var head='<div class="wh"><b>'+t+' '+(sube?'▲':'▼')+' '+Math.abs(o.ch).toFixed(1).replace('.',',')+'% hoy</b>';
 var ctx='<div class="wc">Contexto: tus '+g.n+' activos de '+pais[1]+' promediaron '+_whyP(g.p)+(g.bm&&g.bv!=null?' · '+g.bm+' '+_whyP(g.bv):'')+'</div>';
 var bloque=(sube?g.up:g.dn)>=2&&(g.p!=null&&(sube?g.p>0.5:g.p<-0.5));
 var cubre=NWS_SECTORS&&NWS_SECTORS[o.s];
 if(!cubre){var bmTxt=g.bm&&g.bv!=null?'El '+g.bm+' '+(g.bv>=0?'subió':'bajó')+' '+Math.abs(g.bv).toFixed(1).replace('.',',')+'%':'';
  _whyBox(el,head+'<span class="wt">sin noticias en la fuente</span></div><p class="wr">'+(bloque?'Se movió junto con tus otros activos de '+pais[1]+': parece un movimiento de mercado más que de la empresa. ':'No hay noticias de este activo en la fuente que usamos. ')+bmTxt+(bmTxt?'.':'')+'</p>'+ctx+
   '<div class="wf"><span>Finnhub no cubre '+pais[1]+'</span><a href="'+nwsGLink(t+' '+(o.s==='argentina'?'acción':''))+'" target="_blank" rel="noopener">Buscar en Google Noticias →</a></div>');return;}
 _whyBox(el,head+'</div><p class="wr" style="color:var(--text3)">Buscando noticias…</p>');
 var arr=_whyC[t];
 if(!arr){try{var to=new Date(),from=new Date(Date.now()-2*86400000),sym=(typeof NWS_SYM!=='undefined'&&NWS_SYM[t])||getFinnhubTicker(t);
   var raw=await nwsFetchJSON(FBASE+'/company-news?symbol='+encodeURIComponent(sym)+'&from='+nwsYmd(from)+'&to='+nwsYmd(to)+'&token='+FKEY),seen={};
   arr=(Array.isArray(raw)?raw:[]).filter(function(n){if(!n||!n.headline||!n.datetime)return false;var k=n.headline.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,60);if(seen[k])return false;seen[k]=1;return Date.now()/1000-n.datetime<72*3600;});
   _whyC[t]=arr;}catch(e){arr=null;}}
 if(document.getElementById('nv-why')._el!==el)return;
 var rank={hi:0,md:1,lo:2},N=(arr||[]).map(function(n){return {h:n.headline,s:n.source,u:n.url,d:n.datetime,l:nwsClasif(n,Math.abs(o.ch),3)};}).filter(function(n){return n.l!=='lo';}).sort(function(a,b){return rank[a.l]-rank[b.l]||b.d-a.d;}).slice(0,2);
 var res,tags='';
 if(N.length){var m=_whyMotivo(N[0].h);tags='<span class="wt" style="color:var(--accent);border-color:var(--accent)">'+m[0]+' '+m[1]+'</span>';
  res='Probablemente por <b>'+m[2]+'</b>'+(bloque?', en un día en que <b>tus activos de '+pais[1]+' '+(sube?'subieron':'bajaron')+' en bloque</b>':'')+'.';}
 else res=arr==null?'No pude consultar las noticias ahora (límite de la fuente). Probá en un rato.':(bloque?'Sin noticia propia relevante: se movió junto con tus otros activos de '+pais[1]+', así que parece un movimiento del mercado.':'No encontré una noticia relevante en los últimos 3 días.');
 if(bloque)tags+='<span class="wt" style="color:#f59e0b;border-color:#f59e0b">'+pais[0]+' '+pais[1]+' '+(sube?'sube':'baja')+'</span>';
 await _trN(N.map(function(n){return n.h;}));if(document.getElementById('nv-why')._el!==el)return;
 _whyBox(el,head+tags+'</div><p class="wr">'+res+'</p>'+N.map(function(n){return '<a class="ws" href="'+_whyEsc(n.u)+'" target="_blank" rel="noopener" title="'+_whyEsc(n.h)+'">“'+_whyEsc(_trT(n.h))+'”<small>'+_whyEsc(n.s)+' · '+_whyAgo(n.d)+'</small></a>';}).join('')+ctx+
  '<div class="wf"><span>Fuente: Finnhub · últimos 3 días</span><a href="'+nwsGLink(t)+'" target="_blank" rel="noopener">Google Noticias →</a></div>');}
async function nvWhyG(sec,el){var bx=document.getElementById('nv-why');if(bx&&bx.style.display!=='none'&&bx._el===el){bx.style.display='none';return;}
 var pais=_WHY_PAIS[sec]||['',''],g=_whyGrupo(sec,null),sube=(g.p||0)>=0,L=g.L.slice().sort(function(a,b){return sube?b.ch-a.ch:a.ch-b.ch;}).filter(function(o){return sube?o.ch>=1:o.ch<=-1;}).slice(0,4);
 var head='<div class="wh"><b>'+pais[0]+' '+pais[1]+' '+_whyP(g.p)+' hoy</b></div>';
 var res=(L.length?'Lo empujaron <b>'+L.map(function(o){return o.t+' '+(o.ch>=0?'+':'−')+Math.abs(o.ch).toFixed(1).replace('.',',')+'%';}).join(', ')+'</b>. ':'Ningún activo se movió más de 1%. ');
 if(g.bm&&g.bv!=null&&g.p!=null){var df=g.p-g.bv;res+='El '+g.bm+' '+(g.bv>=0?'subió':'bajó')+' '+Math.abs(g.bv).toFixed(1).replace('.',',')+'%: '+(Math.abs(df)<0.5?'tu grupo acompañó al índice.':df>0?'te fue mejor que al índice por tus activos puntuales.':'te fue peor que al índice por tus activos puntuales.');}
 var cfg=typeof NWS_PAIS!=='undefined'&&NWS_PAIS[sec],d=cfg&&nwsCache.sec&&nwsCache.sec[sec],N=[];
 var pinta=function(){var rank={hi:0,md:1,lo:2};N=d?(d.news||[]).map(function(n){return {h:n.headline,s:n.source,u:n.url,d:n.datetime,l:nwsClasif(n,Math.abs(g.p||0),1)};}).filter(function(n){return n.l!=='lo';}).sort(function(a,b){return rank[a.l]-rank[b.l]||b.d-a.d;}).slice(0,2):[];
  _whyBox(el,head+'<p class="wr">'+res+'</p>'+(cfg?(N.length?'<div class="wc" style="background:none;padding:0;margin-top:2px">Noticias del país:</div>'+N.map(function(n){return '<a class="ws" href="'+_whyEsc(n.u)+'" target="_blank" rel="noopener" title="'+_whyEsc(n.h)+'">“'+_whyEsc(_trT(n.h))+'”<small>'+_whyEsc(n.s)+' · '+_whyAgo(n.d)+'</small></a>';}).join(''):(d?'':'<p class="wr" style="color:var(--text3)">Buscando noticias del país…</p>')):'')+
   '<div class="wf"><span>'+(cfg?'Fuente: Finnhub':'Sin fuente de noticias para este grupo')+'</span>'+(cfg?'<a href="'+nwsGLink(cfg.q)+'" target="_blank" rel="noopener">Google Noticias →</a>':'')+'</div>');};
 pinta();if(N.length&&N.some(function(n){return !_trC[n.h];}))_trN(N.map(function(n){return n.h;})).then(function(){var b3=document.getElementById('nv-why');if(b3&&b3._el===el&&b3.style.display!=='none')pinta();});
 if(cfg&&!d){try{await nwsLoadSector(sec);}catch(e){}d=nwsCache.sec&&nwsCache.sec[sec];var b2=document.getElementById('nv-why');if(b2&&b2._el===el&&b2.style.display!=='none'){pinta();if(N.length)_trN(N.map(function(n){return n.h;})).then(function(){var b4=document.getElementById('nv-why');if(b4&&b4._el===el&&b4.style.display!=='none')pinta();});}}}
// ─── 🔍 Modo foco: todo de un activo en una pantalla (GDC) ─────────────────────────────────────
var _foco={t:null,rg:'6m',ser:null};
var _FOCO_BM={nyse:['SPY','S&P 500'],europa:['SPY','S&P 500'],china:['SPY','S&P 500'],cripto:['SPY','S&P 500'],brasil:['EWZ','EWZ (Brasil)']};
function _focoOn(){return !!(CFG.simRetiro||CFG.modoFoco);}
function focoCerrar(){var o=document.getElementById('nv-foco');if(o)o.style.display='none';_foco.t=null;}
function _focoNota(){var ta=document.getElementById('foco-nota');if(!ta||!_foco.t)return;var t=_foco.t,m=MARKS[t],n=ta.value.trim();if((m&&m.note||'')===n)return;
 if(m){m.note=n;if(!n&&m.type==='note')delete MARKS[t];}else if(n)MARKS[t]={type:'note',note:n};saveMarks();try{renderPortfolio();}catch(e){}}
function _focoDesde(mv){var q=0,st=null;mv.forEach(function(m){if(m.t==='compra'){if(q<=1e-6)st=m.d;q+=m.q;}else{q-=m.q;if(q<=1e-6){q=0;st=null;}}});if(!st)return null;
 var hoy=Date.now(),dias=function(d){return Math.max(0,Math.round((hoy-new Date(d+'T12:00:00').getTime())/86400000));},sq=0,sw=0;mv.forEach(function(m){if(m.t==='compra'&&m.d>=st){sq+=m.q;sw+=m.q*dias(m.d);}});
 return {st:st,d:dias(st),prom:sq>0?Math.round(sw/sq):null};}
function _focoDur(d){if(d==null)return '—';if(d<45)return d+' días';var m=Math.round(d/30.44);if(m<24)return m+' meses';var a=Math.floor(m/12),r=m%12;return a+' años'+(r?' y '+r+(r>1?' meses':' mes'):'');}
function focoRango(r){_foco.rg=r;_focoChart();}
function _focoMovs(t){return movimientos.filter(function(m){return m&&m.ticker===t&&(m.tipo==='compra'||m.tipo==='venta')&&(typeof CARTERA_ACTIVA==='undefined'||(m.cartera||'principal')===CARTERA_ACTIVA);})
 .map(function(m){var d=_phIso(m.fecha),usdD=isBonoUSDDirecto(t),px=usdD?(+m.precioUSD||0):(m.ccl>0?(+m.precioARS||0)/m.ccl:null);return {d:d,f:m.fecha,t:m.tipo,q:+m.qty||0,px:px,pxu:+m.precioUSD||0};}).filter(function(m){return m.d;}).sort(function(a,b){return a.d<b.d?-1:1;});}
function _focoChart(){var box=document.getElementById('foco-ch');if(!box||!_foco.ser)return;var o=_foco.o,S=_foco.ser,t=_foco.t;
 document.querySelectorAll('#foco-rg b').forEach(function(b){b.className=b.getAttribute('data-r')===_foco.rg?'on':'';});
 if(!S.length){box.innerHTML='<div style="padding:40px 0;text-align:center;color:var(--text3);font-size:.8rem">Sin historial de precios para este activo (la fuente no lo cubre).</div>';return;}
 var hoy=new Date(),dd={'1m':31,'3m':92,'6m':183,'1a':366}[_foco.rg],desde=dd?new Date(hoy-dd*86400000).toISOString().slice(0,10):'0000';
 var mv=_foco.mv;if(_foco.rg==='todo'&&mv.length&&mv[0].d<S[0][0])desde=S[0][0];
 var P=S.filter(function(x){return x[0]>=desde;});if(P.length<2)P=S.slice(-60);
 var ppc=o.ppcU>0?(o.s==='bonos'||o.s==='on'?o.ppcU*100:o.ppcU):null,pv=(o.pvU>0&&o.s!=='bonos'&&o.s!=='on'&&o.rat>0)?o.pvU/o.rat:null;
 var M=mv.filter(function(m){return m.d>=P[0][0]&&m.px>0;});
 var BM=null,bmTxt='';if(_foco.bm&&_foco.bm.ser.length){var bs=_foco.bm.ser,b0=null;for(var bi=0;bi<bs.length;bi++){if(bs[bi][0]<=P[0][0])b0=bs[bi][1];else break;}if(!b0&&bs[0][0]<=P[P.length-1][0])b0=bs[0][1];
  if(b0>0){var f=P[0][1]/b0;BM=bs.filter(function(x){return x[0]>=P[0][0]&&x[0]<=P[P.length-1][0];}).map(function(x){return [x[0],x[1]*f];});var bl=bs.filter(function(x){return x[0]<=P[P.length-1][0];}),bch=bl.length?(bl[bl.length-1][1]/b0-1)*100:null,ach=(P[P.length-1][1]/P[0][1]-1)*100;
   if(bch!=null){var df=ach-bch;bmTxt=' · '+_foco.bm.n+' '+(bch>=0?'+':'−')+Math.abs(bch).toFixed(1).replace('.',',')+'% → <b style="color:'+(df>=0?'#22c55e':'#ef4444')+'">'+(df>=0?'le ganaste':'te ganó')+' por '+Math.abs(df).toFixed(1).replace('.',',')+' pts</b>';}}}
 var vals=P.map(function(x){return x[1];}).concat(M.map(function(m){return m.px;})).concat(BM?BM.map(function(x){return x[1];}):[]);if(ppc)vals.push(ppc);if(pv)vals.push(pv);
 var lo=Math.min.apply(null,vals)*0.97,hi=Math.max.apply(null,vals)*1.03,W=760,H=260,L=52,T=12,R=12,B=22,n=P.length;
 var t0=new Date(P[0][0]).getTime(),t1=new Date(P[n-1][0]).getTime()||t0+1,X=function(d){return L+(W-L-R)*((new Date(d).getTime()-t0)/Math.max(1,t1-t0));},Y=function(v){return T+(H-T-B)*(1-(v-lo)/(hi-lo));};
 var fm=function(v){return v>=100?Math.round(v).toLocaleString('es-AR'):v.toFixed(2).replace('.',',');};
 var g='';for(var k=0;k<=4;k++){var v=lo+(hi-lo)*k/4;g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(v).toFixed(1)+'" y2="'+Y(v).toFixed(1)+'" stroke="#1e3050"/><text x="'+(L-6)+'" y="'+(Y(v)+3).toFixed(1)+'" text-anchor="end" font-size="10" fill="#4b6a92">'+fm(v)+'</text>';}
 var pts=P.map(function(x){return X(x[0]).toFixed(1)+','+Y(x[1]).toFixed(1);}).join(' ');
 var ln=function(v,c,l){return v?'<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(v).toFixed(1)+'" y2="'+Y(v).toFixed(1)+'" stroke="'+c+'" stroke-dasharray="5 4"/><text x="'+(W-R-2)+'" y="'+(Y(v)-4).toFixed(1)+'" text-anchor="end" font-size="10" fill="'+c+'">'+l+' '+fm(v)+'</text>':'';};
 var mk=M.map(function(m){var c=m.t==='compra'?'#22c55e':'#ef4444';return '<circle cx="'+X(m.d).toFixed(1)+'" cy="'+Y(m.px).toFixed(1)+'" r="5" fill="'+c+'" stroke="#0b1120" stroke-width="2"><title>'+m.f+' '+m.t+' '+m.q+' a USD '+fm(m.px)+'</title></circle><text x="'+X(m.d).toFixed(1)+'" y="'+(Y(m.px)-9).toFixed(1)+'" text-anchor="middle" font-size="10" fill="'+c+'" font-family="monospace">'+(m.t==='compra'?'C':'V')+'</text>';}).join('');
 var MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],ax='',last='';P.forEach(function(x,i){var mm=x[0].slice(0,7);if(mm!==last&&(i===0||x[0].slice(8)<='07')){last=mm;ax+='<text x="'+X(x[0]).toFixed(1)+'" y="'+(H-6)+'" text-anchor="middle" font-size="10" fill="#4b6a92">'+MES[+x[0].slice(5,7)-1]+'</text>';}});
 var ch=(P[n-1][1]/P[0][1]-1)*100;
 box.innerHTML='<div style="font-family:var(--mono);font-size:.72rem;color:var(--text2);margin-bottom:2px">USD '+fm(P[n-1][1])+(o.s==='bonos'||o.s==='on'?' c/100 VN':(o.rat>1?' por Cedear (1 acción = '+o.rat+' Cedears)':''))+' · en el período <b style="color:'+(ch>=0?'#22c55e':'#ef4444')+'">'+(ch>=0?'+':'−')+Math.abs(ch).toFixed(1).replace('.',',')+'%</b>'+bmTxt+'</div><svg viewBox="0 0 '+W+' '+H+'" width="100%">'+g+(BM&&BM.length>1?'<polyline points="'+BM.map(function(x){return X(x[0]).toFixed(1)+','+Y(x[1]).toFixed(1);}).join(' ')+'" fill="none" stroke="#9aa6bd" stroke-width="1.3" stroke-dasharray="3 3" opacity=".8"/><text x="'+(L+4)+'" y="'+(T+10)+'" font-size="10" fill="#9aa6bd">- - '+_foco.bm.n+' (misma escala)</text>':'')+'<polygon points="'+pts+' '+X(P[n-1][0]).toFixed(1)+','+(H-B)+' '+L+','+(H-B)+'" fill="rgba(68,138,255,.10)"/><polyline points="'+pts+'" fill="none" stroke="#448aff" stroke-width="2"/>'+ln(ppc,'#f59e0b','PPC')+ln(pv,'#22c55e','P. Venta')+mk+ax+'</svg>';}
async function nvFoco(t){if(!_focoOn())return;var o=NV_ROWS.filter(function(x){return x.t===t;})[0];if(!o)return;o.rat=getRatio(t)||1;_foco={t:t,rg:_foco.rg||'6m',ser:null,o:o,mv:_focoMovs(t)};
 var ov=document.getElementById('nv-foco');if(!ov){ov=document.createElement('div');ov.id='nv-foco';document.body.appendChild(ov);ov.addEventListener('click',function(e){if(e.target===ov){_focoNota();focoCerrar();}});
  document.addEventListener('keydown',function(e){var x=document.getElementById('nv-foco');if(e.key==='Escape'&&x&&x.style.display!=='none'){if(e.target&&e.target.id==='foco-nota'){e.target.blur();return;}_focoNota();focoCerrar();}});}
 ov.style.display='flex';var m=MARKS[t]||{},P=function(x,d){return x==null||!isFinite(x)?'—':'<span style="color:'+(x>=0?'#22c55e':'#ef4444')+'">'+(x>=0?'+':'−')+Math.abs(x).toFixed(d==null?1:d).replace('.',',')+'%</span>';};
 var mki={sell:'🔴 Vender',buy:'🟢 Comprar',watch:'⭐ Seguir',note:'📝 Nota'}[m.type];
 var ev=_foco.mv.map(function(x){return {d:x.d,h:'<span>'+x.f+'</span><b style="color:'+(x.t==='compra'?'#22c55e':'#ef4444')+'">'+x.t.toUpperCase()+'</b><span>'+(x.q%1?x.q.toLocaleString('es-AR'):x.q)+' a USD '+(x.px>=100?Math.round(x.px).toLocaleString('es-AR'):(x.px||0).toFixed(2).replace('.',','))+'</span>'};});
 (TRK.divs||[]).forEach(function(x){if(x.ticker!==t||x.estado==='pendiente')return;var f=String(x.fecha||''),iso=f.indexOf('/')>0?_phIso(f):f;var u=divUSD(x)||0;if(u>0)ev.push({d:iso,h:'<span>'+(f.indexOf('/')>0?f:f.split('-').reverse().join('/'))+'</span><b style="color:#448aff">'+(x.tipo==='RENTA'?'RENTA':'DIVIDENDO')+'</b><span>USD '+u.toFixed(2).replace('.',',')+'</span>'});});
 ev.sort(function(a,b){return a.d<b.d?1:-1;});
 var kp=function(l,v,s){return '<div><div class="fl">'+l+'</div><div class="fv">'+v+'</div><div class="fs">'+(s||'')+'</div></div>';};
 var tot=NV_ROWS.reduce(function(a,x){return a+(x.usd||0);},0);
 ov.innerHTML='<div class="fm"><div class="fh"><span style="font-size:1.2rem">'+(_nvFlag[o.s]||'')+'</span><b style="font-size:1.45rem">'+t+'</b>'+(mki?'<span class="tag">'+mki+(m.note?' · '+_whyEsc(m.note).slice(0,60):'')+'</span>':'')+
  '<span style="font-family:var(--mono);font-weight:800">'+_nvF(o.px,o)+' <span style="font-size:.8rem">'+P(o.d,0)+' total · '+P(o.ch)+' hoy</span></span>'+
  '<span style="margin-left:auto;display:flex;gap:6px"><button class="btn" style="color:#22c55e;border-color:#22c55e" onclick="focoCerrar();nvComprar(\''+t+'\')">🛒 Comprar</button><button class="btn" style="color:#ef4444;border-color:#ef4444" onclick="focoCerrar();nvVender(\''+t+'\')">💸 Vender</button><button class="btn" onclick="_focoNota();focoCerrar()">✕</button></span></div>'+
  '<div class="fg"><div><div class="fb"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px"><span class="fl" style="margin:0">Precio en USD · tus operaciones marcadas</span><span class="fseg" id="foco-rg">'+[['1m','1M'],['3m','3M'],['6m','6M'],['1a','1A'],['todo','Todo']].map(function(r){return '<b data-r="'+r[0]+'" onclick="focoRango(\''+r[0]+'\')">'+r[1]+'</b>';}).join('')+'</span></div><div id="foco-ch"><div style="padding:40px 0;text-align:center;color:var(--text3);font-size:.8rem">Cargando historia…</div></div></div>'+
  '<div class="fk">'+kp('Tenés','<span class="port-sensitive">'+(o.q%1?o.q.toLocaleString('es-AR',{maximumFractionDigits:2}):_nvN(o.q))+' nom.</span>','<span class="port-sensitive">$ '+_nvN(o.inv)+' · USD '+_nvN(o.usd)+'</span>')+kp('% tipo / total',(o.pt||0).toFixed(1).replace('.',',')+'% / '+(tot>0?(o.usd/tot*100).toFixed(1).replace('.',','):'—')+'%',o.rv?'de renta variable':'de renta fija')+
   kp('ΔUp',o.up==null?'—':(o.up<=0?'🎯 llegó':'↑ '+o.up.toFixed(1).replace('.',',')+'%'),o.pvU?'P. Venta USD '+String(o.pvU).replace('.',','):'sin P. Venta')+kp(o.rv?'RSI':'TIR',o.rsiH||'—','')+(function(){var z=_focoDesde(_foco.mv);return kp('Lo tenés desde',z?_focoDur(z.d):'—',z?z.st.split('-').reverse().join('/')+(z.prom!=null&&Math.abs(z.prom-z.d)>20?' · promedio de tus compras: '+_focoDur(z.prom):''):'sin compras cargadas')+(function(){var st=z?z.st:'0000',cob=0,nc=0,ult=null,inv=0;
   (TRK.divs||[]).forEach(function(x){if(x.ticker!==t||x.estado==='pendiente')return;var f=String(x.fecha||''),iso=f.indexOf('/')>0?_phIso(f):f;if(!iso||iso<st)return;var u=divUSD(x)||0;if(u>0){cob+=u;nc++;if(!ult||iso>ult)ult=iso;}});
   movimientos.forEach(function(m){if(!m||m.ticker!==t||m.tipo!=='dividendo')return;var iso=_phIso(m.fecha);if(!iso||iso<st)return;var u=+m.precioUSD||0;if(u>0){cob+=u;nc++;if(!ult||iso>ult)ult=iso;}});
   inv=(o.tc>0&&o.inv>0)?o.inv/o.tc:0;
   return kp(o.rv?'Dividendos cobrados':'Rentas cobradas',nc?'<span class="port-sensitive">USD '+cob.toLocaleString('es-AR',{maximumFractionDigits:0})+'</span>':'—',nc?(inv>0?(cob/inv*100).toFixed(1).replace('.',',')+'% de lo invertido · ':'')+nc+' cobro'+(nc>1?'s':'')+' · último '+ult.split('-').reverse().join('/'):'sin cobros desde que lo tenés');})();})()+(function(){var x=_valOn()&&_valOk(o)?_valDe(t):null;if(!x)return '';var nf=function(v){return v.toLocaleString('es-AR',{maximumFractionDigits:v<100?2:0});};
   return (x.pe>0?kp('P/E',x.pe.toFixed(1).replace('.',','),x.med?_valPill(x)+' mediana 5 años '+x.med.toFixed(1).replace('.',','):'sin historia de P/E'):'')+(x.pos!=null?kp('52 semanas',nf(x.lo)+' – '+nf(x.hi),'hoy '+nf(x.px)+' · '+(x.dmax<0?'−':'')+Math.abs(x.dmax).toFixed(1).replace('.',',')+'% del máximo'):'');})()+'</div></div>'+
  '<div style="display:flex;flex-direction:column;gap:10px"><div class="fb"><div class="fl">Historia de la posición</div><div class="fev">'+(ev.length?ev.slice(0,14).map(function(x){return x.h;}).join(''):'<span style="grid-column:1/-1;color:var(--text3)">Sin movimientos cargados</span>')+'</div></div>'+
  '<div class="fb"><div class="fl">Noticias</div><div id="foco-nw" style="font-size:.74rem;color:var(--text3)">'+(NWS_SECTORS&&NWS_SECTORS[o.s]?'Buscando…':'La fuente no cubre este activo · <a href="'+nwsGLink(t)+'" target="_blank" rel="noopener" style="color:var(--blue)">Google Noticias →</a>')+'</div></div>'+
  '<div class="fb"><div class="fl">Tu nota</div><textarea id="foco-nota" placeholder="Escribí una nota para este activo…" onblur="_focoNota()">'+_whyEsc(m.note||'')+'</textarea></div></div></div></div>';
 try{var r=await _phSerie(t,o.s);if(_foco.t!==t)return;_foco.ser=r&&r.ser||[];}catch(e){_foco.ser=[];}_focoChart();
 var bmi=_FOCO_BM[o.s];if(bmi&&bmi[0]!==t){try{var rb=await _phSerie(bmi[0],'nyse');if(_foco.t!==t)return;_foco.bm={ser:rb&&rb.ser||[],n:bmi[1]};_focoChart();}catch(e){}}
 if(NWS_SECTORS&&NWS_SECTORS[o.s]){var arr=_whyC[t];if(!arr){try{var to=new Date(),from=new Date(Date.now()-3*86400000),sym=(typeof NWS_SYM!=='undefined'&&NWS_SYM[t])||getFinnhubTicker(t);
   var raw=await nwsFetchJSON(FBASE+'/company-news?symbol='+encodeURIComponent(sym)+'&from='+nwsYmd(from)+'&to='+nwsYmd(to)+'&token='+FKEY),seen={};
   arr=(Array.isArray(raw)?raw:[]).filter(function(n){if(!n||!n.headline||!n.datetime)return false;var k=n.headline.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,60);if(seen[k])return false;seen[k]=1;return Date.now()/1000-n.datetime<72*3600;});_whyC[t]=arr;}catch(e){arr=null;}}
  if(_foco.t!==t)return;var nw=document.getElementById('foco-nw');if(!nw)return;var rank={hi:0,md:1,lo:2};
  var N=(arr||[]).map(function(n){return {h:n.headline,s:n.source,u:n.url,d:n.datetime,l:nwsClasif(n,Math.abs(o.ch||0),3)};}).filter(function(n){return n.l!=='lo';}).sort(function(a,b){return rank[a.l]-rank[b.l]||b.d-a.d;}).slice(0,3);
  await _trN(N.map(function(n){return n.h;}));if(_foco.t!==t)return;
  nw.innerHTML=N.length?N.map(function(n){return '<a class="fnw" href="'+_whyEsc(n.u)+'" target="_blank" rel="noopener" title="'+_whyEsc(n.h)+'">“'+_whyEsc(_trT(n.h))+'”<small>'+_whyEsc(n.s)+' · '+_whyAgo(n.d)+'</small></a>';}).join(''):(arr==null?'No pude consultar ahora.':'Sin noticias relevantes en los últimos 3 días.')+' <a href="'+nwsGLink(t)+'" target="_blank" rel="noopener" style="color:var(--blue)">Google Noticias →</a>';}}
// ─── 🎯 Tu cartera ideal: % objetivo por grupo, desvío y movimientos sugeridos (GDC) ─────────────────
var IDEAL=null,_idealLoading=false,_IDEAL_DEF={nyse:40,brasil:12,argentina:10,europa:3,china:0,cripto:5,rf:30};
var _IDEAL_G=[['nyse','🇺🇸','USA'],['brasil','🇧🇷','Brasil'],['argentina','🇦🇷','Argentina'],['europa','🇪🇺','Europa'],['china','🇨🇳','China'],['cripto','₿','Cripto'],['rf','📜','Renta fija']];
function _idealG(s){return (s==='bonos'||s==='on'||s==='fci')?'rf':s;}
function _idealLoad(){if(IDEAL||_idealLoading)return;_idealLoading=true;Promise.resolve(sbGetConfig('cartera_ideal')).then(function(v){IDEAL=(v&&typeof v==='object'&&v.p)?v:{p:Object.assign({},_IDEAL_DEF),ejemplo:true};}).catch(function(){IDEAL={p:Object.assign({},_IDEAL_DEF),ejemplo:true};}).then(function(){_idealLoading=false;try{nvIdeal();}catch(e){}});}
// ─── 📊 ¿Cara o barata? P/E de hoy vs su mediana de 5 años y rango de 52 semanas (Finnhub, 1 vez por día) ───
var _valT=0,VAL=(function(){try{return JSON.parse(localStorage.getItem('val_v1')||'{}')||{};}catch(e){return {};}})(),_valRun=false,_valProg=null;
function _valOn(){return CFG.valuacion!==false;}
function _valOk(o){return o&&o.rv&&['nyse','europa','china','brasil'].indexOf(o.s)>=0;}
function _valMed(a){a=a.filter(function(v){return v!=null&&isFinite(v)&&v>0;}).sort(function(x,y){return x-y;});if(!a.length)return null;var m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;}
function _valDe(t){var v=VAL[t];if(!v||v.px==null)return null;var r={pe:v.pe,med:v.med,hi:v.hi,lo:v.lo,px:v.px,dy:v.dy,dif:null,est:'sin',pos:null,dmax:null};
  if(v.pe>0&&v.med>0){r.dif=(v.pe/v.med-1)*100;r.est=r.dif<=-15?'barata':r.dif>=15?'cara':'normal';}
  if(v.hi>0&&v.lo>0&&v.hi>v.lo&&v.px>=v.lo*.8&&v.px<=v.hi*1.25){r.pos=Math.max(0,Math.min(100,(v.px-v.lo)/(v.hi-v.lo)*100));r.dmax=(v.px/v.hi-1)*100;}return r;}
function _valPill(x){if(!x)return '<span style="color:var(--text3)">—</span>';var f=function(n){return (n>0?'+':'−')+Math.abs(Math.round(n))+'%';};
  if(x.est==='sin')return '<span class="vpl vsn" title="Sin P/E: ETF o empresa sin ganancias">sin P/E</span>';
  return '<span class="vpl v'+x.est+'" title="P/E '+x.pe.toFixed(1).replace('.',',')+' contra su mediana de 5 años '+x.med.toFixed(1).replace('.',',')+'">'+(x.est==='barata'?'barata ':x.est==='cara'?'cara ':'normal ')+f(x.dif)+'</span>';}
async function valCargar(){if(_valRun||!_valOn())return;_valRun=true;
  try{var seen={},L=NV_ROWS.filter(function(o){if(!_valOk(o)||seen[o.t])return false;seen[o.t]=1;return true;}).map(function(o){return o.t;});
    var P=L.filter(function(t){return !VAL[t]||Date.now()-VAL[t].ts>20*3600e3;});_valProg=P.length?[0,P.length]:null;
    for(var i=0;i<P.length;i++){var t=P[i],s=getFinnhubTicker(t);
      try{var m=await (await fetchWithTimeout(FBASE+'/stock/metric?symbol='+encodeURIComponent(s)+'&metric=all&token='+FKEY,{},10000)).json();
        var q=await (await fetchWithTimeout(FBASE+'/quote?symbol='+encodeURIComponent(s)+'&token='+FKEY,{},10000)).json();
        var M=(m&&m.metric)||{},ser=((m&&m.series&&m.series.annual&&m.series.annual.pe)||[]).slice(0,5).map(function(x){return x.v;});
        VAL[t]={ts:Date.now(),s:s,pe:M.peTTM||M.peBasicExclExtraTTM||null,med:_valMed(ser),hi:M['52WeekHigh']||null,lo:M['52WeekLow']||null,px:(q&&q.c>0)?q.c:null,dy:M.currentDividendYieldTTM||null};
      }catch(e){VAL[t]={ts:Date.now(),s:s,px:null};}
      _valProg=[i+1,P.length];if(i%4===3){try{localStorage.setItem('val_v1',JSON.stringify(VAL));}catch(e){}nvVal();}
      await new Promise(function(r){setTimeout(r,2500);});}
  }finally{_valRun=false;_valProg=null;try{localStorage.setItem('val_v1',JSON.stringify(VAL));}catch(e){}nvVal();}}
function valTog(){NV.vc=!NV.vc;nvSave();nvVal();}
function nvVal(){if(!_valOn())return;var cw=document.getElementById('nv-cards');if(!cw||!NV_ROWS.length)return;
  var card=document.getElementById('nv-val');if(!card){card=document.createElement('div');card.className='card';card.id='nv-val';card.style.cssText='margin-top:1rem';}cw.insertBefore(card,document.getElementById('nv-linea'));
  var seen={},R=NV_ROWS.filter(function(o){if(!_valOk(o)||seen[o.t])return false;seen[o.t]=1;return true;});if(!R.length){card.style.display='none';return;}card.style.display='';
  var falta=R.some(function(o){return !VAL[o.t]||Date.now()-VAL[o.t].ts>20*3600e3;});if(falta&&!_valRun&&!_valT)_valT=setTimeout(function(){_valT=0;valCargar();},4000);
  var X=R.map(function(o){return {o:o,x:_valDe(o.t)};}),n={barata:0,cara:0};X.forEach(function(z){if(z.x&&n[z.x.est]!=null)n[z.x.est]++;});
  X.sort(function(a,b){var da=a.x&&a.x.dif!=null?a.x.dif:999,db=b.x&&b.x.dif!=null?b.x.dif:999;return da-db;});
  var nf=function(v,d){return v==null?'—':v.toLocaleString('es-AR',{minimumFractionDigits:d,maximumFractionDigits:d});};
  var col=NV.vc===true;
  var rows=X.map(function(z){var x=z.x,o=z.o;return '<tr><td><b class="nvtk"'+(typeof _focoOn==='function'&&_focoOn()?' style="cursor:pointer" onclick="nvFoco(\''+o.t+'\')"':'')+'>'+o.t+'</b>'+(VAL[o.t]&&VAL[o.t].s&&VAL[o.t].s!==o.t?' <span style="color:var(--text3);font-size:.62rem">'+VAL[o.t].s+'</span>':'')+'</td>'+
    '<td class="r">'+(x?nf(x.px,2):'<span style="color:var(--text3)">…</span>')+'</td><td class="r">'+(x&&x.pe>0?nf(x.pe,1):'—')+'</td><td class="r vhm">'+(x&&x.med?nf(x.med,1):'—')+'</td><td>'+_valPill(x)+'</td>'+
    '<td>'+(x&&x.pos!=null?'<span class="vrg" title="52 semanas: '+nf(x.lo,2)+' – '+nf(x.hi,2)+'"><i style="left:'+x.pos.toFixed(0)+'%"></i></span>':'—')+'</td>'+
    '<td class="r" style="color:'+(x&&x.dmax!=null?(x.dmax<=-20?'#ef4444':x.dmax<=-5?'var(--text2)':'#f59e0b'):'var(--text3)')+'">'+(x&&x.dmax!=null?(x.dmax<0?'−':'')+Math.abs(x.dmax).toFixed(1).replace('.',',')+'%':'—')+'</td>'+
    '<td class="r vhm port-sensitive">USD '+_nvN(o.usd||0)+'</td></tr>';}).join('');
  card.innerHTML='<div class="card-header" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;cursor:pointer" onclick="valTog()"><span style="color:var(--text3);font-size:.8rem;width:12px">'+(col?'▸':'▾')+'</span><span class="card-title">📊 ¿Cara o barata?</span><span class="tag">P/E de hoy vs su mediana de 5 años · rango de 52 semanas</span>'+
    '<span style="margin-left:auto;font-family:var(--mono);font-size:.74rem;color:var(--text2)">'+(_valProg?'actualizando '+_valProg[0]+' de '+_valProg[1]+'… · ':'')+'<b style="color:#22c55e">'+n.barata+' baratas</b> · <b style="color:#ef4444">'+n.cara+' caras</b> de '+R.length+'</span></div>'+(col?'':
    '<div style="padding:.3rem 0 .2rem;overflow-x:auto"><table class="itb vtb"><tr class="hh"><td>Acción</td><td class="r">Precio USD</td><td class="r">P/E hoy</td><td class="r vhm">Mediana 5 años</td><td>Valuación</td><td>Rango 52 sem.</td><td class="r">Desde el máx.</td><td class="r vhm">Tu posición</td></tr>'+rows+'</table></div>'+
    '<div style="font-size:.7rem;color:var(--text3);line-height:1.5;padding:.2rem 0 .5rem">El P/E compara precio con ganancias: <b>"barata" no quiere decir "comprá"</b>, quiere decir que hoy se paga menos por cada dólar de ganancia que lo habitual para esa empresa (±15% = normal). Rayita: izquierda = cerca del mínimo del año, derecha = cerca del máximo. Precio de la acción en EE.UU. (no del Cedear). Datos de Finnhub, se actualizan una vez por día. Sin P/E = ETF o empresa sin ganancias.</div>');}
// Tipo de activo: Bono CER (ajusta por inflación), Bono HD (paga en dólares), RV (acciones y Cedears), Otros (pesos a tasa, dólar linked, FCI).
function _nvTipo(o){if(o.rv)return 'rv';var t=String(o.t||'');
  if(/^(TX\d|TZX|TC\d|DICP|PARP|CUAP|DIP0|PR13)/.test(t))return 'cer';
  if(/^(TZV|TV\d|D\d)/.test(t))return 'otro';
  var f=null;try{f=flujoDe(t);}catch(e){}
  if(f&&f.moneda==='USD')return 'hd';if(f&&f.moneda==='ARS')return 'otro';
  if(o.s==='on'||/^(AL|GD|AE|AO|BB|BC|BP|BA|GE|CO)\d/.test(t))return 'hd';
  return 'otro';}
function nvTipos(){var el=document.getElementById('nv-dT');if(!el)return;
  var B=[['cer','Bono CER','#a78bfa'],['hd','Bono HD','#38bdf8'],['rv','RV','#22c55e'],['otro','Otros','#64748b']],S={},tot=0;
  NV_ROWS.forEach(function(o){var u=o.usd||0;if(!(u>0))return;var k=_nvTipo(o);S[k]=(S[k]||0)+u;tot+=u;});
  el.innerHTML=B.filter(function(b){return b[0]!=='otro'||S.otro>0;}).map(function(b){var u=S[b[0]]||0,p=tot>0?u/tot*100:0;
    return '<div class="nvbk" style="cursor:default" title="USD '+_nvN(u)+'"><span>'+b[1]+'</span><div class="tr"><span style="width:'+p.toFixed(1)+'%;background:'+b[2]+'"></span></div><span class="c">'+Math.round(p)+'%</span></div>';}).join('');}
// ─── ↔ Rotaciones: ventas seguidas de compras con esa plata (detectadas solas) y si la rotación sumó ───
var ROT_OCU=null,_rotCalc={};
function _rotUSD(m){var bon=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI'),tc=bon?(getMEP(m.fecha)||getCCL(m.fecha)||m.ccl||MEP_HOY||CCL_HOY):(getCCL(m.fecha)||m.ccl||CCL_HOY);
  return isBonoUSDDirecto(m.ticker)?(+m.precioARS||0)*m.qty:(tc>0&&(+m.precioARS||0)>0?(+m.precioARS)*m.qty/tc:(+m.precioUSD||0)*m.qty);}
function rotDetectar(){var lim=new Date(Date.now()-200*864e5).toISOString().slice(0,10),T=[];
  (movimientos||[]).forEach(function(m){if(!m||(m.tipo!=='compra'&&m.tipo!=='venta')||m.owner==='cristian')return;var f=_phIso(m.fecha);if(!f||f<lim)return;var u=_rotUSD(m);if(!(u>0)||!(m.qty>0))return;
    T.push({id:m.id,f:f,tp:m.tipo,t:m.ticker,q:+m.qty,u:u,c:m.cartera||'principal',s:getSector(m.ticker)});});
  T.sort(function(a,b){return a.f<b.f?-1:a.f>b.f?1:(+a.id||0)-(+b.id||0);});
  var usada={},R=[],dias=function(a,b){return (new Date(b)-new Date(a))/864e5;};
  T.forEach(function(v,i){if(v.tp!=='venta'||usada[v.id])return;
    var V=T.filter(function(x){return x.tp==='venta'&&!usada[x.id]&&x.c===v.c&&x.f===v.f;}),tv=V.reduce(function(s,x){return s+x.u;},0),vt={};V.forEach(function(x){vt[x.t]=1;});
    var C=[],tc=0;T.forEach(function(x){if(x.tp!=='compra'||usada[x.id]||x.c!==v.c||vt[x.t])return;var d=dias(v.f,x.f);if(d<0||d>5)return;if(tc+x.u>tv*1.3&&tc>=tv*0.4)return;C.push(x);tc+=x.u;});
    if(!C.length||tc<tv*0.4){return;}
    V.forEach(function(x){usada[x.id]=1;});C.forEach(function(x){usada[x.id]=1;});
    R.push({id:String(V[0].id),f:v.f,c:v.c,V:V,C:C,tv:tv,tc:tc});});
  return R.reverse();}
function _rotAgr(L){var o={};L.forEach(function(x){var g=o[x.t]||(o[x.t]={t:x.t,s:x.s,q:0,u:0,f:x.f});g.q+=x.q;g.u+=x.u;});return Object.keys(o).map(function(k){return o[k];}).sort(function(a,b){return b.u-a.u;});}
var _rotLiveP=null;
function _rotLive(){if(_rotLiveP)return _rotLiveP;var M={};
  _rotLiveP=Promise.all(['arg_stocks','arg_cedears','arg_bonds','arg_corp','arg_notes'].map(function(k){return fetchWithTimeout('https://data912.com/live/'+k,{},12000).then(function(r){return r.ok?r.json():[];}).then(function(a){(Array.isArray(a)?a:[]).forEach(function(x){var c=parseFloat(x.c);if(x.symbol&&c>0)M[x.symbol]=c;});}).catch(function(){});})).then(function(){return M;});
  return _rotLiveP;}
// Cobros por unidad (USD) entre la fecha de la operación y hoy: cupones y amortizaciones de bonos/ON (FLUJOS_BONOS)
// y dividendos cargados (TRK.divs con cantidad de acciones). Se suman al precio de hoy para comparar rendimiento total.
function _rotCobros(g){var hoy=_flujosHoyStr(),u=0,n=0;
  try{var fl=flujoDe(g.t);if(fl&&fl.flujos)fl.flujos.forEach(function(x){if(x.f<=g.f||x.f>hoy)return;var v=((+x.r||0)+(+x.a||0))/100;if(fl.moneda==='ARS'){var tc=getMEP(x.f.split('-').reverse().join('/'))||MEP_HOY||CCL_HOY;v=v/tc;}u+=v;n++;});}catch(e){}
  if(!n)(TRK.divs||[]).forEach(function(x){if(x.ticker!==g.t||x.estado==='pendiente'||!(+x.acciones>0))return;var f=String(x.fecha||'');if(f.indexOf('/')>0)f=_phIso(f);if(!f||f<=g.f)return;var d=divUSD(x);if(d>0){u+=d/(+x.acciones);n++;}});
  return {u:u,n:n};}
async function _rotRatio(g){var k=await _rotRatio0(g);if(k==null)return null;var c=_rotCobros(g);g.cob=c.u*g.q;g.ncob=c.n;return k+c.u/(g.u/g.q);}
async function _rotRatio0(g){var row=(NV_ROWS||[]).filter(function(o){return o.t===g.t&&o.q>0&&o.usd>0;})[0];
  if(row)return (row.usd/row.q)/(g.u/g.q);
  try{var r=await _phSerie(g.t,g.s),S=r&&r.ser||[];if(S.length>=2){var a=null;for(var i=0;i<S.length;i++){if(S[i][0]>=g.f){a=S[i];break;}}
    if(a&&(new Date(a[0])-new Date(g.f))/864e5<=5)return S[S.length-1][1]/a[1];}}catch(e){}
  try{if(isBonoUSDDirecto(g.t))return null;var L=await _rotLive(),c=L[g.t];if(!(c>0))return null;var bon=(g.s==='bonos'||g.s==='on'),tc=bon?(MEP_HOY||CCL_HOY):CCL_HOY;
    var k=(c/(bon?100:1)/tc)/(g.u/g.q);return (k>0.2&&k<5)?k:null;}catch(e){return null;}}
async function _rotEval(r){if(_rotCalc[r.id])return _rotCalc[r.id];
  var V=_rotAgr(r.V),C=_rotAgr(r.C),hoyV=0,hoyC=0,okV=true,okC=true;
  for(var i=0;i<V.length;i++){var k=await _rotRatio(V[i]);V[i].k=k;if(k==null)okV=false;else hoyV+=V[i].u*k;}
  for(i=0;i<C.length;i++){k=await _rotRatio(C[i]);C[i].k=k;if(k==null)okC=false;else hoyC+=C[i].u*k;}
  var x={V:V,C:C,ok:okV&&okC};
  if(x.ok){var kv=hoyV/r.tv,kc=hoyC/r.tc;x.pv=(kv-1)*100;x.pc=(kc-1)*100;x.res=r.tc*(kc-kv);x.resp=(kc-kv)*100;}
  return _rotCalc[r.id]=x;}
async function rotOcultar(id){ROT_OCU=ROT_OCU||[];if(ROT_OCU.indexOf(id)<0)ROT_OCU.push(id);try{await sbSetConfig('rot_ocultas',ROT_OCU);}catch(e){}rotRender();}
function rotIr(id){var e=document.getElementById('rotd-'+id);if(!e)return;e.style.display='';var tr=e.previousSibling;(tr||e).scrollIntoView({behavior:'smooth',block:'center'});if(tr){tr.style.outline='2px solid var(--blue)';setTimeout(function(){tr.style.outline='';},1600);}}
function _rotTop(R,P,n0,fd,nm){var el=document.getElementById('rot-top');if(!el)return;
  var ok=R.filter(function(r){return r._x&&r._x.ok;}).slice().sort(function(a,b){return b._x.res-a._x.res;});
  if(!ok.length){el.innerHTML='';return;}
  var it=function(r,i){var x=r._x;return '<div class="rti" onclick="rotIr(\''+r.id+'\')"><span class="n">'+(i+1)+'</span><span class="d">'+fd(r.f)+'</span><span class="w">'+nm(x.V)+' → '+nm(x.C)+'</span><span class="v"><span class="port-sensitive" style="color:'+(x.res>=0?'var(--accent)':'var(--red)')+'">'+(x.res>=0?'+':'−')+'USD '+n0(Math.abs(x.res))+'</span> '+P(x.resp)+'</span></div>';};
  var mej=ok.filter(function(r){return r._x.res>0;}).slice(0,5),peo=ok.filter(function(r){return r._x.res<0;}).reverse().slice(0,5);
  el.innerHTML='<div class="rtb"><h4>🏆 Las que más sumaron</h4>'+(mej.length?mej.map(it).join(''):'<div class="mu" style="font-size:.74rem">Ninguna sumó todavía.</div>')+'</div>'+
    '<div class="rtb"><h4>⚠️ Las que menos sumaron</h4>'+(peo.length?peo.map(it).join(''):'<div class="mu" style="font-size:.74rem">Ninguna restó.</div>')+'</div>';}
function rotTog(id){var e=document.getElementById('rotd-'+id);if(e)e.style.display=e.style.display==='none'?'':'none';}
async function rotRender(){var pg=document.getElementById('page-rotaciones');if(!pg)return;
  if(ROT_OCU===null){try{ROT_OCU=await sbGetConfig('rot_ocultas');}catch(e){}if(!Array.isArray(ROT_OCU))ROT_OCU=[];}
  var R=rotDetectar().filter(function(r){return ROT_OCU.indexOf(r.id)<0;}),n0=function(x){return Math.round(x).toLocaleString('es-AR');};
  var P=function(x){return x==null||!isFinite(x)?'<span class="mu">—</span>':'<span style="color:'+(x>=0.05?'var(--accent)':x<=-0.05?'var(--red)':'var(--text3)')+'">'+(x>=0?'+':'−')+Math.abs(x).toFixed(1).replace('.',',')+'%</span>';};
  var nm=function(L){return L.map(function(g){return '<b>'+g.t+'</b>';}).join(' · ');},fd=function(f){return f.split('-').reverse().slice(0,2).join('/')+'/'+f.slice(2,4);};
  var multi=R.some(function(r){return r.c!=='principal';});
  var rows=R.map(function(r){var V=_rotAgr(r.V),C=_rotAgr(r.C);return '<tr class="rotr" onclick="rotTog(\''+r.id+'\')" style="cursor:pointer"><td>'+fd(r.f)+(multi?' <span class="mu" style="font-size:.62rem">'+r.c+'</span>':'')+'</td><td>'+nm(V)+'</td><td>→</td><td>'+nm(C)+'</td><td class="r port-sensitive">'+n0(r.tv)+'</td><td class="r" id="rotres-'+r.id+'"><span class="mu">calculando…</span></td>'+
    '<td class="r"><span title="No es una rotación (ocultar)" onclick="event.stopPropagation();rotOcultar(\''+r.id+'\')" style="cursor:pointer;color:var(--text3)">✕</span></td></tr><tr id="rotd-'+r.id+'" style="display:none"><td colspan="7" id="rotdd-'+r.id+'" style="background:var(--surface2);font-size:.74rem"></td></tr>';}).join('');
  pg.innerHTML='<div class="card" style="margin-bottom:1rem"><div class="card-header" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span class="card-title">↔ Rotaciones</span><span class="tag">vendiste algo y en los 5 días siguientes compraste otra cosa con esa plata</span>'+
    '<span id="rot-tot" style="margin-left:auto;font-family:var(--mono);font-size:.78rem;color:var(--text2)"></span></div>'+
    (R.length?'<div id="rot-top" class="rot-top"><div style="color:var(--text3);font-size:.74rem;padding:.4rem 0">Calculando el ranking…</div></div>':'')+
    (R.length?'<div style="overflow-x:auto;padding:.3rem 0"><table class="rot-tb" style="width:100%;border-collapse:collapse;font-size:.8rem;font-family:var(--mono)"><tr style="color:var(--text3);font-size:.6rem;text-transform:uppercase"><td>Fecha</td><td>Vendiste</td><td></td><td>Compraste</td><td class="r">USD</td><td class="r">¿Sumó?</td><td></td></tr>'+rows+'</table></div>':'<div style="padding:1rem;color:var(--text3)">No se detectaron rotaciones en los últimos 6 meses.</div>')+
    '<div style="font-size:.7rem;color:var(--text3);line-height:1.55;padding:.4rem 0 .6rem"><b>¿Sumó?</b> compara lo que vale hoy lo que compraste contra lo que valdría hoy lo que vendiste si te lo quedabas, en dólares y <b>sumando lo cobrado desde la rotación</b> en los dos lados: cupones y amortizaciones de bonos según sus flujos, y dividendos cargados. Verde = la rotación te sumó. Tocá una fila para ver el detalle; ✕ si no fue una rotación. Se detectan solas: ventas de un día y las compras de los 5 días siguientes en la misma cartera que suman parecido.</div></div>';
  if(!document.getElementById('rot-css')){var st=document.createElement('style');st.id='rot-css';st.textContent='#page-rotaciones .rot-top{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:.4rem 0 .8rem}#page-rotaciones .rtb{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:10px 12px}#page-rotaciones .rtb h4{margin:0 0 6px;font-size:.8rem}#page-rotaciones .rti{display:flex;gap:8px;align-items:baseline;padding:5px 0;border-top:1px solid var(--border);font-size:.74rem;cursor:pointer}#page-rotaciones .rti:first-of-type{border-top:0}#page-rotaciones .rti .n{color:var(--text3);font-family:var(--mono);width:14px}#page-rotaciones .rti .d{color:var(--text3);font-family:var(--mono);font-size:.66rem;white-space:nowrap}#page-rotaciones .rti .w{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#page-rotaciones .rti .v{font-family:var(--mono);white-space:nowrap;text-align:right}@media(max-width:760px){#page-rotaciones .rot-top{grid-template-columns:1fr}}';document.head.appendChild(st);}
  pg.querySelectorAll('.rot-tb td').forEach(function(td){td.style.padding='7px 8px';td.style.borderBottom='1px solid var(--border)';td.style.textAlign=td.classList.contains('r')?'right':'left';});
  var tot=0,okn=0;
  for(var i=0;i<R.length;i++){var r=R[i],x=await _rotEval(r),el=document.getElementById('rotres-'+r.id);if(!el)return;
    el.innerHTML=x.ok?'<span class="port-sensitive" style="color:'+(x.res>=0?'var(--accent)':'var(--red)')+'">'+(x.res>=0?'+':'−')+'USD '+n0(Math.abs(x.res))+'</span> '+P(x.resp):'<span class="mu" title="Falta el precio histórico de algún activo">sin precio</span>';
    if(x.ok){tot+=x.res;okn++;}
    var leg=function(g,lbl){return '<div>'+lbl+' <b>'+g.t+'</b> · '+n0(g.q)+' a USD '+(g.u/g.q).toLocaleString('es-AR',{maximumFractionDigits:g.u/g.q<10?4:2})+' = <span class="port-sensitive">USD '+n0(g.u)+'</span> · desde entonces '+P(g.k==null?null:(g.k-1)*100)+(g.ncob?' <span class="mu">(incluye '+g.ncob+' cobro'+(g.ncob>1?'s':'')+' por <span class="port-sensitive">USD '+n0(g.cob)+'</span>)</span>':'')+'</div>';};
    var dd=document.getElementById('rotdd-'+r.id);if(dd)dd.innerHTML=x.V.map(function(g){return leg(g,'🔴 vendiste');}).join('')+x.C.map(function(g){return leg(g,'🟢 compraste');}).join('')+
      (x.ok?'<div style="margin-top:4px;color:var(--text2)">Si te quedabas con lo vendido: '+P(x.pv)+' · lo que compraste: '+P(x.pc)+'</div>':'');
    r._x=x;if(i===R.length-1)_rotTop(R,P,n0,fd,nm);
    var tt=document.getElementById('rot-tot');if(tt)tt.innerHTML=R.length+' rotaciones · resultado '+(okn?'<b class="port-sensitive" style="color:'+(tot>=0?'var(--accent)':'var(--red)')+'">'+(tot>=0?'+':'−')+'USD '+n0(Math.abs(tot))+'</b>':'…');}
}
function rotInit(){if(document.getElementById('page-rotaciones'))return;var pp=document.getElementById('page-portafolio'),mb=document.querySelector('.nav-item[onclick*="\'movimientos\'"]');if(!pp||!mb)return;
  var pg=document.createElement('div');pg.className='page';pg.id='page-rotaciones';pp.parentNode.appendChild(pg);
  var b=document.createElement('button');b.className='nav-item';b.setAttribute('onclick',"showPage('rotaciones',this)");b.innerHTML='<span>↔</span>Rotaciones';mb.parentNode.insertBefore(b,mb.nextSibling);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',rotInit);else setTimeout(rotInit,0);
function lvTog(){NV.lv=!NV.lv;nvSave();nvLinea();}
function nvLinea(){var cw=document.getElementById('nv-cards');if(!cw||!NV_ROWS.length)return;
  var card=document.getElementById('nv-linea');if(!card){card=document.createElement('div');card.className='card';card.id='nv-linea';card.style.cssText='margin-top:1rem';}cw.appendChild(card);
  var tc=(typeof MEP_HOY!=='undefined'&&MEP_HOY>0?MEP_HOY:CCL_HOY)||1,hoy=new Date(),y0=hoy.getFullYear(),Y={},fin={},it=[];
  try{it=calcularCalendarioCobros().items;}catch(e){}
  it.forEach(function(x){var y=+x.fecha.slice(0,4),f=x.moneda==='ARS'?1/tc:1;if(y>y0+15)return;Y[y]=Y[y]||{r:0,a:0,d:{}};Y[y].r+=(x.renta||0)*f;var a=(x.amort||0)*f;Y[y].a+=a;if(a>0)Y[y].d[x.ticker]=(Y[y].d[x.ticker]||0)+a;if(!fin[x.ticker]||x.fecha>fin[x.ticker])fin[x.ticker]=x.fecha;});
  var dv=0;try{dv=_sdDatos().dv||0;}catch(e){}
  var ys=Object.keys(Y).map(Number);if(!ys.length&&!dv){card.style.display='none';return;}card.style.display='';
  var yN=Math.max(y0+3,ys.length?Math.max.apply(null,ys):y0);var L=[];for(var y=y0;y<=yN;y++){var o=Y[y]||{r:0,a:0,d:{}};L.push({y:y,r:o.r+dv*(y===y0?(11-hoy.getMonth())/12:1),a:o.a,d:o.d});}
  var n0=function(x){return Math.round(x).toLocaleString('es-AR');},col=!NV.lv;
  var head='<div class="card-header" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;cursor:pointer" onclick="lvTog()"><span style="color:var(--text3);font-size:.8rem;width:12px">'+(col?'▸':'▾')+'</span><span class="card-title">🧭 Línea de vida financiera</span><span class="tag">lo que entra por año · '+y0+' → '+yN+'</span>'+
    '<span class="port-sensitive" style="margin-left:auto;font-family:var(--mono);font-size:.74rem;color:var(--text2)">renta '+y0+'–'+yN+': USD '+n0(L.reduce(function(s,o){return s+o.r;},0))+' · capital que vuelve: USD '+n0(L.reduce(function(s,o){return s+o.a;},0))+'</span></div>';
  if(col){card.innerHTML=head;return;}
  var W=1100,H=320,Lm=56,B=62,T=20,bw=(W-Lm-16)/L.length,mx=Math.max.apply(null,L.map(function(o){return o.r+o.a;}).concat([1]))*1.12;
  var st=mx>40000?10000:mx>16000?5000:mx>6000?2000:mx>2500?1000:500,yv=function(v){return T+(1-v/mx)*(H-T-B);},g='';
  for(var v=0;v<=mx;v+=st)g+='<line x1="'+Lm+'" x2="'+(W-10)+'" y1="'+yv(v)+'" y2="'+yv(v)+'" stroke="var(--border)"/><text x="'+(Lm-6)+'" y="'+(yv(v)+3)+'" fill="var(--text3)" font-size="10" text-anchor="end">'+(v>=1000?(v/1000)+'k':v)+'</text>';
  L.forEach(function(o,k){var x=Lm+k*bw+bw*.18,w=bw*.64,t1=yv(o.r),t2=yv(o.r+o.a),dd=Object.keys(o.d).map(function(t){return t+' '+n0(o.d[t]);}).join(', ');
    g+='<rect x="'+x+'" y="'+t1+'" width="'+w+'" height="'+Math.max(0,yv(0)-t1)+'" rx="2" fill="var(--blue)"><title>'+o.y+' · renta USD '+n0(o.r)+'</title></rect>';
    if(o.a>0)g+='<rect x="'+x+'" y="'+t2+'" width="'+w+'" height="'+Math.max(0,t1-t2)+'" rx="2" fill="#f59e0b"><title>'+o.y+' · vuelve USD '+n0(o.a)+(dd?': '+dd:'')+'</title></rect>';
    var tot=o.r+o.a;g+='<text x="'+(x+w/2)+'" y="'+(t2-5)+'" fill="var(--text2)" font-size="9.5" text-anchor="middle">'+(tot>=1000?(tot/1000).toFixed(tot>=10000?0:1).replace('.',',')+'k':n0(tot))+'</text>';
    g+='<text x="'+(x+w/2)+'" y="'+(H-B+15)+'" fill="var(--text3)" font-size="11" text-anchor="middle">'+o.y+'</text>';});
  var mk=Object.keys(fin).filter(function(t){var y=+fin[t].slice(0,4);return y>=y0&&y<=yN;}).sort(function(a,b){return fin[a]<fin[b]?-1:1;}),fila=[];
  mk.forEach(function(t){var f=fin[t],p=(+f.slice(0,4)-y0)+(+f.slice(5,7)-.5)/12,x=Lm+p*bw,r=0;while(fila[r]!=null&&x-fila[r]<90)r++;fila[r]=x;if(r>2)return;
    g+='<text x="'+x+'" y="'+(H-B+32+r*12)+'" fill="#f59e0b" font-size="9.5" text-anchor="middle">▲ '+t+' '+f.slice(5,7)+'/'+f.slice(2,4)+'</text>';});
  card.innerHTML=head+'<div style="padding:.4rem 0 .6rem"><div style="display:flex;gap:14px;flex-wrap:wrap;font-size:.66rem;color:var(--text2);font-family:var(--mono);margin:0 0 6px">'+
    '<span><i style="display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--blue);margin-right:4px;vertical-align:-1px"></i>renta (cupones + dividendos)</span>'+
    '<span><i style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#f59e0b;margin-right:4px;vertical-align:-1px"></i>capital que vuelve (amortizaciones y vencimientos)</span>'+
    '<span style="color:#f59e0b">▲ último pago de cada bono / ON</span></div>'+
    '<svg class="port-sensitive" viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="Lo que entra por año" style="font-family:var(--mono)">'+g+'</svg>'+
    '<div style="font-size:.66rem;color:var(--text3);line-height:1.5">Flujos de tus bonos y ONs (los de pesos pasados a dólares a $ '+n0(tc)+', así que dependen de la inflación y del dólar) + dividendos de los últimos 12 meses repetidos cada año. Pasá el mouse por una barra para ver el detalle.</div></div>';}
function idealTog(){NV.ic=!NV.ic;nvSave();nvIdeal();}
function idealEditar(k){var g=_IDEAL_G.filter(function(x){return x[0]===k;})[0],v=prompt('% ideal para '+g[2]+' (sobre el total de la cartera):',String(IDEAL.p[k]||0));if(v==null)return;var n=parseFloat(String(v).replace(',','.'));if(!(n>=0&&n<=100)){alert('Ingresá un % entre 0 y 100');return;}
 IDEAL.p[k]=Math.round(n*10)/10;delete IDEAL.ejemplo;try{sbSetConfig('cartera_ideal',IDEAL);}catch(e){}nvIdeal();}
function idealCargar(t,tipo,usd){var o=NV_ROWS.filter(function(x){return x.t===t;})[0];if(!o)return;var unit=o.q>0?(o.usd||0)/o.q:0,q=unit>0?Math.max(1,Math.round(usd/unit)):0;
 if(tipo==='v'){nvVender(t);var qe=document.getElementById('vsell-qty');if(qe&&q){qe.value=Math.min(q,o.q);try{vsellPreview();}catch(e){}}}
 else{nvComprar(t);var qb=document.getElementById('vbuy-qty');if(qb&&q)qb.value=q;}}
function nvIdeal(){if(!CFG.simRetiro&&!CFG.carteraIdeal)return;var cw=document.getElementById('nv-cards');if(!cw||!NV_ROWS.length)return;_idealLoad();if(!IDEAL)return;
 var card=document.getElementById('nv-ideal');if(!card){card=document.createElement('div');card.className='card';card.id='nv-ideal';card.style.cssText='margin-top:1rem';}cw.appendChild(card);
 var tot=0,G={};NV_ROWS.forEach(function(o){var k=_idealG(o.s);(G[k]=G[k]||{usd:0,L:[]}).usd+=o.usd||0;G[k].L.push(o);tot+=o.usd||0;});if(!(tot>0))return;
 var n0=function(v){return Math.round(Math.abs(v)).toLocaleString('es-AR');},sumI=0,desv=0,enR=0,cnt=0,rows='',ops=[];
 _IDEAL_G.forEach(function(g){var k=g[0],i=+IDEAL.p[k]||0,c=G[k]?G[k].usd/tot*100:0;if(!i&&!c)return;sumI+=i;cnt++;var d=c-i,usd=(i-c)/100*tot,ok=Math.abs(d)<2;if(ok)enR++;desv+=Math.abs(d);
  var col=ok?'#22c55e':(d>0?'#ef4444':'#448aff');
  rows+='<tr><td><b>'+g[1]+' '+g[2]+'</b></td><td class="r">'+c.toFixed(1).replace('.',',')+'%</td><td style="width:40%"><div class="itr"><i style="width:'+Math.min(100,c)+'%;background:'+col+'"></i><b style="left:'+Math.min(100,i)+'%"></b></div></td><td class="r"><span class="ied" onclick="idealEditar(\''+k+'\')" title="Cambiar">'+i+'% ✎</span></td><td class="r" style="color:'+col+'">'+(ok?'en rango':(usd>0?'▲ comprar ':'▼ vender ')+'<span class="port-sensitive">USD '+n0(usd)+'</span>')+'</td></tr>';
  if(ok||!G[k]&&usd<0)return;
  if(usd<0){var L=G[k].L.slice().sort(function(a,b){var pa=(a.up!=null&&a.up<=5)?0:1,pb=(b.up!=null&&b.up<=5)?0:1;return pa-pb||(b.usd||0)-(a.usd||0);}),falta=-usd,sel=[];
   L.forEach(function(o){if(falta<=0||sel.length>=3)return;var u=Math.min(falta,(o.usd||0)*0.9);if(u<100)return;sel.push([o,u]);falta-=u;});
   sel.forEach(function(x){var o=x[0];ops.push({ty:'v',t:o.t,u:x[1],g:g,why:(o.up!=null&&o.up<=5?'🎯 cerca o en su P. Venta':'de los más pesados de '+g[2])+' · '+g[2]+' '+c.toFixed(0)+'% vs '+i+'%'});});}
  else{var C=(G[k]?G[k].L:[]).filter(function(o){var mk=MARKS[o.t];return !(mk&&mk.type==='sell')&&(o.pt||0)<2;}).sort(function(a,b){var ma=MARKS[a.t]&&MARKS[a.t].type==='buy'?0:1,mb=MARKS[b.t]&&MARKS[b.t].type==='buy'?0:1;return ma-mb||(b.up==null?-1:b.up)-(a.up==null?-1:a.up);});
   var rest=usd,np=0;C.forEach(function(o){if(rest<100||np>=6)return;var pt=Math.max(o.pt||0,0.05),cap=Math.max(0,(2.5-pt)/pt*(o.usd||0)),u=Math.min(rest,cap);if(u<100)return;np++;rest-=u;
    ops.push({ty:'c',t:o.t,u:u,g:g,why:(MARKS[o.t]&&MARKS[o.t].type==='buy'?'🟢 marcado Comprar · ':'')+'ΔUp '+(o.up==null?'—':o.up.toFixed(0)+'%')+' · lo lleva a ~'+Math.min(2.5,pt*(1+u/(o.usd||1))).toFixed(1).replace('.',',')+'% del tipo'});});
   if(rest>=100)ops.push({ty:'c',t:null,u:rest,g:g,why:np?'el resto en activos nuevos de '+g[2]+' (sin pasar 2,5% del tipo cada uno; ideas en Vigilancia)':'no tenés activos de '+g[2]+' con lugar: elegí nuevos (Vigilancia)'});}});
 ops.sort(function(a,b){return (a.ty===b.ty?0:a.ty==='v'?-1:1)||b.u-a.u;});
 var opH=ops.length?ops.slice(0,10).map(function(x){return '<span class="'+(x.ty==='v'?'iv':'ic')+'">'+(x.ty==='v'?'VENDER':'COMPRAR')+'</span><span><b>'+(x.t||x.g[1]+' '+x.g[2])+'</b> <small>'+x.why+'</small></span><span class="port-sensitive">USD '+n0(x.u)+'</span>'+(x.t?'<button class="btn btn-sm" onclick="idealCargar(\''+x.t+'\',\''+x.ty+'\','+Math.round(x.u)+')">cargar</button>':'<span></span>');}).join(''):'<span style="grid-column:1/-1;color:#22c55e">✓ Tu cartera está dentro del ideal en todos los grupos.</span>';
 var col=NV.ic!==false;card.innerHTML='<div class="card-header" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;cursor:pointer" onclick="if(!event.target.closest(\'.ied\'))idealTog()"><span style="color:var(--text3);font-size:.8rem;width:12px">'+(col?'▸':'▾')+'</span><span class="card-title">🎯 Tu cartera ideal</span><span class="tag">% objetivo sobre el total · tocá ✎ para cambiarlo</span>'+(IDEAL.ejemplo?'<span class="tag" style="color:#f59e0b;border-color:#f59e0b">valores de ejemplo: cargá los tuyos</span>':'')+(Math.abs(sumI-100)>0.5?'<span class="tag" style="color:#ef4444;border-color:#ef4444">los % suman '+sumI+'%</span>':'')+
  '<span style="margin-left:auto;font-family:var(--mono);font-size:.74rem;color:var(--text2)">Desvío <b style="color:'+(desv/2<5?'#22c55e':'#ef4444')+'">'+Math.round(desv/2)+' pts</b> · '+enR+' de '+cnt+' en rango (±2)</span></div>'+(col?'':
  '<div style="padding:.3rem 0 .4rem"><table class="itb"><tr class="hh"><td>Grupo</td><td class="r">Hoy</td><td>barra = hoy · raya blanca = ideal</td><td class="r">Ideal</td><td class="r">Para llegar</td></tr>'+rows+'</table></div>'+
  '<div class="isug"><div style="font-weight:700;font-size:.8rem;margin-bottom:6px">Movimientos sugeridos <span style="font-weight:400;color:var(--text3);font-size:.7rem">· primero lo que sobra (cerca del P. Venta o más pesado), después lo que falta (marcados 🟢, debajo de 2% del tipo y con más ΔUp) · "cargar" lo deja listo en el panel, no ejecuta nada</span></div><div class="iop">'+opH+'</div></div>');}
// ─── 🗺️ Cómo se movió hoy: resumen por grupo (en USD, ponderado por lo que tenés) con su índice de referencia ───
var _NV_MOVG=[['nyse','🇺🇸','USA',[['spy','S&P 500'],['qqq','Nasdaq']]],['brasil','🇧🇷','Brasil',[['ewz','EWZ']]],['argentina','🇦🇷','Argentina',[['imv','Merval/CCL']]],['bonos','📜','Bonos',[]],['on','🏢','ONs',[]],['europa','🇪🇺','Europa',[]],['china','🇨🇳','China',[]],['cripto','₿','Cripto',[['btc','Bitcoin']]],['fci','📈','FCI',[]]];
function _nvBm(k){var e=document.getElementById('tb-'+k+'-chg');if(!e)return null;var v=parseFloat(String(e.textContent||'').replace('%','').replace(',','.'));return isFinite(v)?v:null;}
function nvMovSel(k){NV.movSel=NV.movSel===k?null:k;nvSave();nvMov();}
function nvMov(){if(!CFG.simRetiro&&!CFG.movGrupos)return;var cw=document.getElementById('nv-cards');if(!cw||!NV_ROWS.length)return;
 var card=document.getElementById('nv-mov');if(!card){card=document.createElement('div');card.className='card';card.id='nv-mov';card.style.cssText='margin-top:1rem';}
 cw.appendChild(card);
 var P=function(x,d){if(x==null||!isFinite(x))return '<span class="mu">—</span>';x=+x.toFixed(d==null?2:d);return '<span class="'+(x>0?'up':x<0?'dn':'mu')+'">'+(x>0?'+':x<0?'−':'')+Math.abs(x).toFixed(d==null?2:d).replace('.',',')+'%</span>';};
 var U=function(x){x=Math.round(x);return '<span class="port-sensitive">'+(x>0?'+':x<0?'−':'')+'USD '+Math.round(Math.abs(x)).toLocaleString('es-AR')+'</span>';};
 var tot=0,totD=0,totB=0,tiles='',G={};
 NV_ROWS.forEach(function(o){var g=G[o.s]||(G[o.s]={usd:0,d:0,b:0,L:[]});var u=o.usd||0;g.usd+=u;tot+=u;g.L.push(o);if(o.ch!=null&&isFinite(o.ch)&&u>0){var b=u/(1+o.ch/100);g.d+=u-b;g.b+=b;totD+=u-b;totB+=b;}});
 _NV_MOVG.forEach(function(x){var g=G[x[0]];if(!g||!g.L.length)return;var p=g.b>0?g.d/g.b*100:null,w=tot>0?g.usd/tot*100:0;
  var L=g.L.filter(function(o){return o.ch!=null&&isFinite(o.ch);}).sort(function(a,b){return b.ch-a.ch;});
  var heat=g.L.slice().sort(function(a,b){return (b.usd||0)-(a.usd||0);}).map(function(o){var c=o.ch,col=c==null?'#26324a':c>0?'rgba(34,197,94,'+(0.25+0.7*Math.min(1,c/3)).toFixed(2)+')':c<0?'rgba(239,68,68,'+(0.25+0.7*Math.min(1,-c/3)).toFixed(2)+')':'#26324a';
   return '<i class="nvf-cal" style="flex:'+Math.max(o.usd||0,tot/400)+';background:'+col+'" data-tip="'+o.t+(c==null?'':' '+(c>0?'+':'')+c.toFixed(2).replace('.',',')+'%')+'"></i>';}).join('');
  var bw=L.length?'<div class="bw"><span>▲ '+L[0].t+' '+P(L[0].ch)+'</span>'+(L.length>1?'<span>▼ '+L[L.length-1].t+' '+P(L[L.length-1].ch)+'</span>':'')+'</div>':'';
  var bms=x[3].map(function(b){var v=_nvBm(b[0]);if(v==null)return '';var df=p==null?null:p-v;return '<div class="bm"><span>'+b[1]+'</span>'+P(v)+(df==null?'':'<span class="vs '+(df>=0?'up':'dn')+'">'+(df>=0?'▲ le ganás':'▼ te gana')+' por '+Math.abs(df).toFixed(2).replace('.',',')+' pts</span>')+'</div>';}).join('');
  tiles+='<div class="mt'+(NV.movSel===x[0]?' sel':'')+'" onclick="nvMovSel(\''+x[0]+'\')"><div class="th"><span>'+x[1]+'</span><b>'+x[2]+'</b>'+(p!=null&&Math.abs(p)>=0.5?'<span class="nvwhy" title="¿Por qué se movió?" onclick="event.stopPropagation();nvWhyG(\''+x[0]+'\',this)">?</span>':'')+'<span class="w">'+Math.round(w)+'% de la cartera</span></div><div class="tv">'+P(p)+'</div><div class="tu">'+(g.b>0?U(g.d):'<span class="mu">sin variación del día</span>')+'</div><div class="heat">'+heat+'</div>'+bw+bms+'</div>';});
 var det='';var sg=NV.movSel&&G[NV.movSel];if(sg){var gi=_NV_MOVG.filter(function(x){return x[0]===NV.movSel;})[0];
  det='<div class="det"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><b>'+gi[1]+' '+gi[2]+'</b><span class="tag">'+sg.L.length+' activos</span><span class="nvclr" style="margin-left:auto" onclick="nvMovSel(null)">cerrar ✕</span></div><table><tr class="hh"><td>Símbolo</td><td>Cambio</td><td class="r">Tenés</td><td class="r">Movió hoy</td></tr>'+
   sg.L.slice().sort(function(a,b){return (b.ch==null?-99:b.ch)-(a.ch==null?-99:a.ch);}).map(function(o){var m=o.ch!=null&&isFinite(o.ch)&&o.usd>0?o.usd-o.usd/(1+o.ch/100):null;return '<tr><td><b>'+o.t+'</b></td><td>'+P(o.ch)+'</td><td class="r mu"><span class="port-sensitive">USD '+_nvN(o.usd)+'</span></td><td class="r">'+(m==null?'<span class="mu">—</span>':'<span class="'+(m>=0?'up':'dn')+'">'+U(m)+'</span>')+'</td></tr>';}).join('')+'</table></div>';}
 var tp=totB>0?totD/totB*100:null;
 card.innerHTML='<div class="card-header" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><span class="card-title">🗺️ Cómo se movió hoy</span><span class="tag">en dólares · ponderado por lo que tenés</span><span style="margin-left:auto;font-family:var(--mono);font-size:.8rem">Total cartera <b>'+P(tp)+'</b> <b class="'+(totD>=0?'up':'dn')+'">'+U(totD)+'</b></span></div><div class="mg">'+tiles+'</div>'+det;}
// ─── 🏖️ Plan de salida: renta anual (cupones de bonos/ON + dividendos) contra un objetivo editable ──────
var PLANS={obj:100000},_plansLoaded=false,_plansLoading=false;
function _plansLoad(){if(_plansLoaded||_plansLoading)return;_plansLoading=true;
 Promise.resolve(sbGetConfig('plan_salida')).then(function(v){if(v&&v.obj>0)PLANS=v;}).catch(function(){}).then(function(){_plansLoaded=true;try{nvPlanSalida();}catch(e){}});}
function nvPlanObj(){var v=prompt('Objetivo de renta anual en USD (cupones + dividendos):',String(PLANS.obj||100000));if(v==null)return;
 var n=parseFloat(String(v).replace(/\./g,'').replace(',','.'));if(!(n>0)){alert('Monto inválido');return;}PLANS.obj=Math.round(n);try{sbSetConfig('plan_salida',PLANS);}catch(e){}nvPlanSalida();}
function _planCalc(){var hoy=_flujosHoyStr(),lim=new Date();lim.setFullYear(lim.getFullYear()+1);var limS=lim.toISOString().slice(0,10),tc=MEP_HOY||CCL_HOY||0;
 var r={renta:0,amort:0,div:0,cobrado:0,porTk:{}},usd=function(m,mon){return mon==='USD'?m:(tc>0?m/tc:0);};
 try{calcularCalendarioCobros().items.forEach(function(it){if(it.fecha<hoy||it.fecha>limS)return;var a=usd(it.renta,it.moneda),b=usd(it.amort,it.moneda);r.renta+=a;r.amort+=b;r.porTk[it.ticker]=(r.porTk[it.ticker]||0)+a;});}catch(e){}
 var hace=new Date();hace.setFullYear(hace.getFullYear()-1);var haceS=hace.toISOString().slice(0,10),abiertos={};
 NV_ROWS.forEach(function(o){if(o.s!=='bonos'&&o.s!=='on')abiertos[o.t]=1;});
 (TRK.divs||[]).forEach(function(x){if(x.estado==='pendiente')return;var f=String(x.fecha||'');if(f.indexOf('/')>0){var a=f.split('/');f=a[2]+'-'+a[1].padStart(2,'0')+'-'+a[0].padStart(2,'0');}
  if(f<haceS||(x.cartera&&x.cartera!=='principal'))return;var u=divUSD(x)||0;r.cobrado+=u;if(abiertos[x.ticker]&&x.tipo!=='RENTA'){r.div+=u;r.porTk[x.ticker]=(r.porTk[x.ticker]||0)+u;}});
 r.total=r.renta+r.div;return r;}
function nvPlanSalida(){if(!CFG.simRetiro&&!CFG.planSalida)return;var cw=document.getElementById('nv-cards');if(!cw||!NV_ROWS.length)return;_plansLoad();
 var card=document.getElementById('nv-plan');if(!card){card=document.createElement('div');card.className='card';card.id='nv-plan';card.style.cssText='margin-top:1rem';}
 cw.appendChild(card);
 var c=_planCalc(),obj=PLANS.obj||100000,pct=Math.min(100,c.total/obj*100),val=(NV_K&&NV_K.val)||0,yld=val>0?c.total/val*100:0,falta=Math.max(0,obj-c.total);
 var n0=function(v){return Math.round(v).toLocaleString('es-AR');};
 var top=Object.keys(c.porTk).map(function(t){return [t,c.porTk[t]];}).sort(function(a,b){return b[1]-a[1];}).slice(0,6).map(function(x){return '<b>'+x[0]+'</b> '+n0(x[1]);}).join(' · ');
 var cap=yld>0?obj/(yld/100):null;
 card.innerHTML='<div class="card-header" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span class="card-title">🏖️ Plan de salida</span><span class="tag">renta de los próximos 12 meses con la cartera actual</span>'+
  '<span style="margin-left:auto;font-family:var(--mono);font-size:.74rem;color:var(--text2)">Objetivo <b class="port-sensitive" style="color:var(--text)">USD '+n0(obj)+'/año</b> <button class="btn btn-sm" onclick="nvPlanObj()" title="Cambiar objetivo">✎</button></span></div>'+
  '<div style="padding:.6rem 1rem 1rem">'+
  '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px"><span style="font-family:var(--mono);font-size:1.25rem;font-weight:800"><span class="port-sensitive">USD '+n0(c.total)+'</span> <span style="font-size:.8rem;color:var(--text2);font-weight:600">/ año · <span class="port-sensitive">USD '+n0(c.total/12)+'</span> / mes</span></span>'+
  '<span style="font-family:var(--mono);font-size:1rem;font-weight:800;color:'+(pct>=100?'var(--accent)':pct>=50?'#eab308':'var(--red)')+'">'+pct.toFixed(1).replace('.',',')+'% del objetivo</span></div>'+
  '<div style="height:16px;background:var(--bg);border:1px solid var(--border);border-radius:8px;overflow:hidden;display:flex">'+
   '<div title="Cupones de bonos/ON" style="width:'+Math.min(100,c.renta/obj*100)+'%;background:var(--blue)"></div><div title="Dividendos" style="width:'+Math.min(100-Math.min(100,c.renta/obj*100),c.div/obj*100)+'%;background:var(--accent)"></div></div>'+
  '<div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:8px;font-family:var(--mono);font-size:.72rem;color:var(--text2)">'+
   '<span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:var(--blue);margin-right:5px"></i>Cupones bonos/ON <b class="port-sensitive" style="color:var(--text)">USD '+n0(c.renta)+'</b></span>'+
   '<span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:var(--accent);margin-right:5px"></i>Dividendos (últimos 12 meses de lo que tenés) <b class="port-sensitive" style="color:var(--text)">USD '+n0(c.div)+'</b></span>'+
   '<span>Te faltan <b class="port-sensitive" style="color:'+(falta?'var(--red)':'var(--accent)')+'">USD '+n0(falta)+'/año</b></span></div>'+
  '<div style="margin-top:8px;font-size:.72rem;color:var(--text2);line-height:1.6">La cartera hoy rinde en renta un <b>'+yld.toFixed(2).replace('.',',')+'%</b> anual sobre su valor'+(cap?'; a ese ritmo necesitarías una cartera de <b class="port-sensitive">USD '+n0(cap)+'</b> para llegar al objetivo':'')+'. '+
   'Con una renta del 7% anual harían falta <b class="port-sensitive">USD '+n0(obj/0.07)+'</b>.'+
   (c.amort>0?' Aparte, en los próximos 12 meses te devuelven <b class="port-sensitive">USD '+n0(c.amort)+'</b> de capital (amortizaciones), que no cuentan como renta.':'')+
   (top?'<br><span style="color:var(--text3)">Mayores aportes:</span> <span class="port-sensitive">'+top+'</span>':'')+'</div></div>';}

// ─── 🔔 Avisos push (CFG.push) ─────────────────────────────────────────────────
var VAPID_PUB='BP6CJHf5i2nKacdBN9fVoFcjZ51gozu_-YY8Xg1fZPD-GaGezoyGrzARFUz9k6KzWlytWcssXGCFyOT7CyXyR2w';
function _b64u(s){var p='='.repeat((4-s.length%4)%4),b=(s+p).replace(/-/g,'+').replace(/_/g,'/'),r=atob(b),o=new Uint8Array(r.length);for(var i=0;i<r.length;i++)o[i]=r.charCodeAt(i);return o;}
function pushSoportado(){return 'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;}
function _esIOS(){return /iPad|iPhone|iPod/.test(navigator.userAgent);}
async function pushEstado(){if(!pushSoportado())return 'no';try{var reg=await navigator.serviceWorker.getRegistration('../');if(!reg)reg=await navigator.serviceWorker.ready;var s=await reg.pushManager.getSubscription();return s?'on':'off';}catch(e){return 'off';}}
async function pushBtnPintar(){var b=document.getElementById('push-btn');if(!b)return;var e=await pushEstado();b.textContent=e==='on'?'🔔':'🔕';b.title=e==='on'?'Avisos activados en este dispositivo (click: probar o desactivar)':'Activar avisos en este dispositivo';}
async function pushClick(){
  if(!pushSoportado()){alert(_esIOS()?'Para recibir avisos en el iPhone:\n\n1. Abrí esta página en Safari\n2. Compartir → "Agregar a inicio"\n3. Abrí la app desde ese ícono y tocá 🔕 de nuevo.\n\n(Necesita iOS 16.4 o más nuevo.)':'Este navegador no permite notificaciones push.');return;}
  var est=await pushEstado();
  if(est==='on'){
    if(confirm('Los avisos están activados en este dispositivo.\n\nAceptar = mandar un aviso de prueba\nCancelar = ver opción para desactivarlos'))return pushProbar();
    if(confirm('¿Desactivar los avisos en este dispositivo?'))return pushDesactivar();return;}
  var perm=await Notification.requestPermission();if(perm!=='granted'){alert('No se dieron permisos de notificación. Podés habilitarlos en Ajustes del teléfono → Notificaciones.');return;}
  try{
    var reg=await navigator.serviceWorker.register('../sw.js',{scope:'../'});await navigator.serviceWorker.ready;
    var sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:_b64u(VAPID_PUB)});
    var j=sub.toJSON(),L=(await sbGetConfig('push_subs'))||[];if(!Array.isArray(L))L=[];
    L=L.filter(function(x){return x.endpoint!==j.endpoint;});L.push({endpoint:j.endpoint,keys:j.keys,ua:navigator.userAgent.slice(0,80),ts:Date.now()});
    var ok=await sbSetConfig('push_subs',L);if(!ok){alert('No se pudo guardar la suscripción. Probá de nuevo.');return;}
    _famLastSave=0;try{renderPortfolio();}catch(e){}
    await pushBtnPintar();
    if(confirm('✓ Avisos activados en este dispositivo.\n\n¿Mandar un aviso de prueba?'))pushProbar();
  }catch(e){alert('No se pudieron activar los avisos: '+(e&&e.message||e));}
}
async function pushProbar(){
  try{var tok=window._sbAccessToken||'';
    var r=await fetch(SUPABASE_URL+'/functions/v1/avisos?test=1',{method:'POST',headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+(tok||SUPABASE_KEY),'x-user-token':tok,'Content-Type':'application/json'},body:'{}'});
    var t=await r.text();if(!r.ok){alert('La prueba falló ('+r.status+'): '+t.slice(0,200)+'\n\n¿Ya subiste la función "avisos" a Supabase?');return;}
    var d={};try{d=JSON.parse(t);}catch(e){}alert('Aviso de prueba enviado a '+(d.enviados!=null?d.enviados:'?')+' dispositivo(s). Debería llegarte en unos segundos.');
  }catch(e){alert('No se pudo llamar a la función de avisos: '+(e&&e.message||e));}
}
async function pushDesactivar(){
  try{var reg=await navigator.serviceWorker.ready,s=await reg.pushManager.getSubscription();if(s){var ep=s.endpoint;await s.unsubscribe();
    var L=(await sbGetConfig('push_subs'))||[];if(Array.isArray(L)){await sbSetConfig('push_subs',L.filter(function(x){return x.endpoint!==ep;}));}}}catch(e){}
  pushBtnPintar();
}
async function pushWatchPublicar(d){
  if(!CFG.push)return;
  try{
    var tg=[];(d.pos||[]).forEach(function(p){if(!(p.pv>0))return;var s=p.s,k;
      if(s==='fci'||(typeof BRL_TICKERS!=='undefined'&&BRL_TICKERS.has(p.t)))return;
      if((s==='bonos'||s==='on')&&typeof isBonoUSDDirecto==='function'&&isBonoUSDDirecto(p.t))k='usd';else if(s==='bonos'||s==='on')k='bono';else k='ccl';
      var last=(p.up!=null&&isFinite(p.up))?p.pv/(1+p.up/100):null;
      tg.push({t:p.t,sym:p.t,k:k,r:(typeof getRatio==='function'?getRatio(p.t):1)||1,pv:p.pv,last:last?Math.round(last*1000)/1000:null});});
    var lim=new Date();lim.setDate(lim.getDate()+10);var limS=lim.getFullYear()+'-'+('0'+(lim.getMonth()+1)).slice(-2)+'-'+('0'+lim.getDate()).slice(-2);
    var cob=[];try{cob=(calcularCalendarioCobros().items||[]).filter(function(it){return it.fecha<=limS;}).map(function(it){return {f:it.fecha,t:it.ticker,m:it.moneda,x:Math.round(it.total*100)/100};});}catch(e){}
    var cortes=[];try{var c=histUltimoCorte();if(c)cortes.push({nombre:CFG.persona||CFG.nombre,fecha:(parseInt(c.slice(0,4),10)+1)+c.slice(4)});
      if(c&&HIST&&!HIST.cierres.some(function(x){return x.d===c;})&&_aporDias(c,_hHoy())<=1)cortes.push({nombre:CFG.persona||CFG.nombre,fecha:c});}catch(e){}
    var pos=(d.pos||[]).filter(function(p){return p.v>0;}).map(function(p){return {t:p.t,sym:p.t,v:Math.round(p.v)};});
    var compras=[];try{await vigLoad();vigItems.forEach(function(v){if(!(v.obj>0))return;var s=_vigSect(v.ticker),k=((s==='bonos'||s==='on')&&isBonoUSDDirecto(v.ticker))?'usd':(s==='bonos'||s==='on'||s==='fci')?'bono':'ccl';var u=_vigPrecioUSD(v.ticker);
      compras.push({t:v.ticker,sym:v.ticker,k:k,r:1,obj:v.obj,last:u?Math.round(u*1000)/1000:null});});}catch(e){}
    await sbSetConfig('push_watch',{ts:Date.now(),cartera:CFG.nombre,url:location.href.split('#')[0],targets:tg,cobros:cob,cortes:cortes,compras:compras,pos:pos,liq:Math.round(d.liqTotalUSD||0)});
  }catch(e){console.warn('pushWatchPublicar',e);}
}
(function(){function add(){if(!CFG.push)return;var hr=document.querySelector('.hright');if(!hr||document.getElementById('push-btn'))return;
  var b=document.createElement('button');b.id='push-btn';b.className='btn-sidebar-toggle';b.style.cssText='width:auto;padding:0 8px;font-size:.85rem';b.textContent='🔕';b.onclick=pushClick;
  hr.insertBefore(b,hr.firstChild);pushBtnPintar();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();})();

// ─── 🩺 Registro de errores: guardado (config 'errores', últimos 60) y aviso ⚠️ en la barra ───
var _errTmr=null,_ERR_VISTO_K=PFX+'err_visto';
function _errProgramar(){if(typeof _gdcInitDone==='undefined'||!_gdcInitDone||!_ERR_Q.length)return;clearTimeout(_errTmr);_errTmr=setTimeout(_errGuardar,5000);}
async function _errGuardar(){
  if(!_ERR_Q.length||window._errGuardando)return;window._errGuardando=true;
  try{
    var nuevos=_ERR_Q.splice(0,_ERR_Q.length);
    var L=await sbGetConfig('errores');if(!Array.isArray(L))L=[];
    nuevos.forEach(function(n){var x=L.filter(function(e){return e.msg===n.msg&&e.src===n.src;})[0];
      if(x){x.n=(x.n||1)+1;x.ts=n.ts;x.ver=n.ver;x.pag=n.pag;x.dev=n.dev;}else{n.n=1;L.push(n);}});
    L.sort(function(a,b){return b.ts-a.ts;});L=L.slice(0,60);
    await sbSetConfig('errores',L);_errPintar(L);
  }catch(e){}finally{window._errGuardando=false;}
}
function _errVisto(){var v=0;try{v=+localStorage.getItem(_ERR_VISTO_K)||0;}catch(e){}return v;}
function _errPintar(L){
  _ERR_LISTA=L||[];var nv=_ERR_LISTA.filter(function(e){return e.ts>_errVisto()&&e.ts>Date.now()-7*864e5;});
  var b=document.getElementById('err-chip');
  if(!nv.length){if(b)b.style.display='none';return;}
  if(!b){var ref=document.getElementById('lupd');if(!ref||!ref.parentNode)return;b=document.createElement('button');b.id='err-chip';b.onclick=errAbrir;
    b.style.cssText='background:rgba(245,158,11,.12);color:#f59e0b;border:1px solid rgba(245,158,11,.5);border-radius:999px;padding:1px 9px;font-size:.68rem;font-family:var(--mono);cursor:pointer;margin-right:6px;white-space:nowrap';
    ref.parentNode.insertBefore(b,ref);}
  var tot=nv.reduce(function(a,e){return a+(e.n||1);},0);
  b.textContent='⚠️ '+tot+' error'+(tot>1?'es':'');b.title='Errores de la app en los últimos 7 días (tocá para ver)';b.style.display='';
}
var _ERR_LISTA=[];
function errAbrir(){
  var ov=document.getElementById('err-ov');if(!ov){ov=document.createElement('div');ov.id='err-ov';ov.style.cssText='position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.6);display:flex;align-items:flex-start;justify-content:center;padding:6vh 12px;overflow:auto';ov.onclick=function(e){if(e.target===ov)ov.remove();};document.body.appendChild(ov);}
  var esc=function(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
  var f=function(ts){var d=new Date(ts);return d.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'})+' '+d.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});};
  var vis=_errVisto();
  var rows=_ERR_LISTA.map(function(e){return '<div style="border-top:1px solid var(--border);padding:8px 0;'+(e.ts>vis?'':'opacity:.55')+'"><div style="display:flex;justify-content:space-between;gap:10px;font-family:var(--mono);font-size:.66rem;color:var(--text3)"><span>'+f(e.ts)+' · v'+esc(e.ver)+' · '+esc(e.dev)+(e.pag?' · '+esc(e.pag):'')+'</span><span>'+((e.n||1)>1?'×'+e.n:'')+'</span></div><div style="font-size:.8rem;margin-top:2px">'+esc(e.msg)+'</div><div style="font-family:var(--mono);font-size:.62rem;color:var(--text3);margin-top:2px">'+esc(e.ctx)+(e.src?' · '+esc(e.src):'')+'</div></div>';}).join('');
  ov.innerHTML='<div style="background:var(--surface);border:1px solid var(--border2);border-radius:12px;max-width:640px;width:100%;padding:14px 16px"><div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><b>🩺 Errores de la app</b><span style="font-size:.7rem;color:var(--text3)">últimos '+_ERR_LISTA.length+' · se guardan solos</span><span style="margin-left:auto;display:flex;gap:6px"><button class="btn btn-sm" onclick="errVistos()">Marcar vistos</button><button class="btn btn-sm" onclick="errBorrar()">Borrar todo</button><button class="btn btn-sm" onclick="document.getElementById(\'err-ov\').remove()">✕</button></span></div>'+(rows||'<div style="padding:12px 0;color:var(--text3);font-size:.8rem">Sin errores registrados 🎉</div>')+'<div style="font-size:.66rem;color:var(--text3);margin-top:8px">Si algo se repite, pasale esta lista a Claude: dice versión, equipo, pantalla y dónde falló.</div></div>';
}
function errVistos(){try{localStorage.setItem(_ERR_VISTO_K,String(Date.now()));}catch(e){}_errPintar(_ERR_LISTA);var o=document.getElementById('err-ov');if(o)o.remove();}
async function errBorrar(){if(!confirm('¿Borrar el registro de errores de esta cartera?'))return;await sbSetConfig('errores',[]);_ERR_LISTA=[];_errPintar([]);var o=document.getElementById('err-ov');if(o)o.remove();}
(function _errBoot(n){setTimeout(function(){if(typeof _gdcInitDone==='undefined'||!_gdcInitDone){if(n<40)_errBoot(n+1);return;}
  sbGetConfig('errores').then(function(L){_errPintar(Array.isArray(L)?L:[]);_errProgramar();}).catch(function(){});},1500);})(0);
