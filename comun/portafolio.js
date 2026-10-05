// ═══════════════════════════════════════════════════════════════════════════
// portafolio.js — código común de los portafolios (Etapa 1 de la unificación, 2026-10-03)
// Por ahora contiene el script principal de GDC tal cual estaba inline en PortafolioGDC.html.
// Etapa 2: Ana, Hilda, Juli y Omar pasan a usar este mismo archivo con una configuración
// por portafolio (window.PORTFOLIO_CONFIG). Los cambios de versión se siguen anotando en el
// changelog de cada HTML; el ?v= de la etiqueta <script> evita que el navegador use una copia vieja.
// ═══════════════════════════════════════════════════════════════════════════

// ─── Versión de la app (única para los 5 portafolios) ───────────────────────
// En cada cambio: subir APP_VERSION, agregar una línea arriba en APP_CHANGELOG y subir el ?v=
// de la etiqueta <script src="../comun/portafolio.js?v=N"> en los 5 HTML.
var APP_VERSION=109, APP_VERSION_FECHA='04/10/2026';
var APP_CHANGELOG=[
  'v109 | 2026-10-04 | UI: la foto del encabezado de cada portafolio lleva el borde del color de su cartera.',
  'v108 | 2026-10-04 | Feat: el resumen para Carteras administradas guarda los cobros confirmados por mes en USD (para el tablero "Tus ingresos").',
  'v107 | 2026-10-04 | UI: se saca el chip con foto y nombre de arriba a la derecha (el encabezado fijo ya muestra la foto y el nombre de la cartera). Quedan el marco de color, la marca de agua, la pestaña y la confirmación de compra/venta.',
  'v106 | 2026-10-04 | UI: Inv. Inicial pasa al lado de la Liquidez en la barra superior (el chip de la cartera la tapaba) y la barra queda en una sola línea, con scroll horizontal si no entra.',
  'v105 | 2026-10-04 | UI: identidad de cada cartera — marco y color propios (GDC verde, Ana violeta, Hilda naranja, Juli celeste, Omar amarillo), chip fijo arriba a la derecha con foto y nombre, nombre en marca de agua, pestaña "Nombre · Inversiones" con ícono de color, y confirmación grande de compras y ventas que dice en qué cartera se opera (Enter confirma, Esc cancela).',
  'v104 | 2026-10-04 | Feat: botón 💼 Honorario en Evolución (Ana y Juli): se carga el valor final según el broker, calcula ganancia y el 20% (sin ganancia, 0), y registra lo cobrado en config honorarios; viaja en el resumen para el acumulado de Carteras administradas.',
  'v103 | 2026-10-04 | Fix: los dividendos no tenían la protección de los movimientos — se guardaban sin reintentos ni aviso y podían escribirse antes de terminar de leer la nube (pisándola con una lista vacía). Ahora: reintentos, snapshot pendiente que se sube al volver a abrir, no se escribe antes del init y barra roja fija "No se guardó en la nube" con Reintentar (también para movimientos).',
  'v102 | 2026-10-04 | UI: orden de campos — Comprar: Ticker, Precio, Cantidad, Fecha, Mercado (automático); Vender: Ticker, Precio, Cantidad, Fecha. Se saca el campo CCL de Vender: el tipo de cambio sale siempre de la tabla (CCL o MEP según el activo).',
  'v101 | 2026-10-04 | Feat: al escribir el ticker en 🛒 Comprar y en Movimientos se elige solo el mercado (el de la última operación de ese ticker, la tabla de sectores o las listas de BYMA: bonos, ON, acciones, Cedears con su país) y se muestra de dónde salió; en Comprar también se precarga el precio de mercado. Sugerencias con los tickers ya operados. Se puede cambiar a mano.',
  'v100 | 2026-10-04 | Fix: las fechas precargadas (compra, venta, movimientos, cobros) usaban la hora UTC — después de las 21 h aparecía la fecha de mañana — y no se actualizaban si la app quedaba abierta de un día para otro. Ahora usan la fecha local, se refrescan solas al volver a la app, se marcan en ámbar si no son hoy y al confirmar una compra o venta con otra fecha se pide confirmación.',
  'v99 | 2026-10-04 | Feat: control de precio al cargar compras y ventas (si se aleja más de 10% del mercado pide confirmación, con pista de cero de más/menos). Papelera: movimientos y cobros borrados o editados quedan 30 días (config papelera, en Supabase) con "↶ Deshacer" al momento y tarjeta 🗑 Papelera en Movimientos para restaurar.',
  'v98 | 2026-10-04 | Feat (GDC): Ratios → "Auditar tabla completa": compara cada Cedear de la tabla con NYSE y el CCL, lista los que no cierran (primero los que están en cartera 📌) con "Usar" / "Usar todos" y "Sync a las demás carteras". Marca datos dudosos y tickers sin precio NYSE.',
  'v97 | 2026-10-04 | UI: vista celular — en pantallas angostas cada posición de la cartera se muestra como tarjeta (ticker y Δ arriba; inversión, mercado, PPC, % anual, P. Venta y cantidad con su etiqueta) en vez de la tabla ancha.',
  'v96 | 2026-10-04 | UI: el aviso de ratio desactualizado va al final de la página Portafolio. Ratios menores a 1 se muestran como "0,33 (1 Cedear = 3 acciones)" en vez de redondear a 0,5.',
  'v95 | 2026-10-04 | UI: atajo C lleva al recuadro 🛒 Comprar del Portafolio con el cursor en Ticker; V lleva al recuadro 💸 Vender con el foco en el combo de tickers (los despliega si estaban plegados y los resalta un instante).',
  'v94 | 2026-10-04 | UI: botón ? arriba a la derecha (barra superior) que abre la lista de atajos de teclado.',
  'v93 | 2026-10-04 | Feat: atajos C (cargar compra) y V (cargar venta): van a Movimientos con el tipo ya elegido y el cursor en Ticker.',
  'v92 | 2026-10-04 | Feat: atajos de teclado — P portafolio, M cargar movimiento, D dividendos, T tipo de cambio, R refrescar cotizaciones, / buscar ticker, I informe, H inicio, Esc cerrar, ? ayuda. No actúan mientras se escribe en un campo.',
  'v91 | 2026-10-04 | Feat: control de ratios de Cedears — una vez por día compara el precio del Cedear con NYSE (Finnhub) y el CCL; si el ratio que surge del mercado difiere más de 25% del cargado, avisa arriba con el ratio sugerido (ignorar / verificar ahora). No cambia nada solo; se corrige en GDC → Ratios y Sync.',
  'v90 | 2026-10-04 | Feat: aviso "Desde tu última visita" al abrir el portafolio (variación del total, activos que más subieron y bajaron, cobros cargados, posiciones nuevas o cerradas; se guarda por dispositivo). El resumen para Carteras administradas guarda la variación del día de cada posición (para "Lo que más se movió").',
  'v89 | 2026-10-04 | Feat: el resumen para Carteras administradas guarda el P. Venta y la distancia al P. Venta de cada posición (para el buscador de tickers del index).',
  'v88 | 2026-10-04 | Fix: si el CCL/MEP de hoy no estaba en la tabla (fin de semana o antes de traerlo) se usaba un valor fijo viejo (1487) y los Cedears quedaban valuados con ese dólar — en Juli MSFT daba −2% al P. Venta y en GDC +7%. Ahora se usa el último CCL/MEP cargado, se refresca al leer la tabla de Supabase y la cartera se recalcula cuando llega el dólar del día (también el real, para las acciones brasileñas).',
  'v87 | 2026-10-04 | Feat: informe — el perfil de inversor sale del mismo puntaje de Recomendaciones (composición, países y sectores, 0 a 100) y muestra el puntaje de los tres perfiles.',
  'v86 | 2026-10-04 | UI: Tipo de cambio — al cargar CCL o MEP las barras de la fecha se ponen solas (se escribe 03102026 y queda 03/10/2026), Enter en la fecha pasa al valor y Enter en el valor guarda. La fecha se normaliza a dd/mm/aaaa y se avisa si está incompleta.',
  'v85 | 2026-10-04 | Feat: informe — perfil de inversor al que más se parece la cartera (Conservador, Moderado o Agresivo, por cercanía a los rangos de renta variable, renta fija y liquidez), con la comparación hoy vs. perfil.',
  'v84 | 2026-10-04 | Fix: la liquidez en pesos se pasa a USD al MEP (como bonos y ON) en el total, la distribución, el resumen familiar, el historial y el informe; antes iba al CCL. También la liquidez en USD expresada en pesos usa el MEP.',
  'v83 | 2026-10-04 | Feat: Dividendos — tarjeta "Importar cobros desde Cocos": se pega el listado de Movimientos (Dividendos / Rentas y Amortización) y los nuevos quedan en Pendientes de revisión (saltea montos 0, filas sin ticker y los ya cargados ±10 días). Botón "✓ Cargar todos" en Pendientes. Ana ahora tiene la tarjeta de Pendientes.',
  'v82 | 2026-10-04 | Feat: informe nuevo — valor total, ganancia del período (en curso, último año completo o último mes), ganancia total compuesta desde el inicio, estado del ciclo actual (rendimiento y cuánto falta para el cierre), cantidad de activos, movimientos de los últimos 3 meses, evolución desde el inicio con inversión inicial de cada período y cierres, distribución RF/RV/liquidez, posiciones más grandes, mapa por país (comun/mapa_mundo.js, se carga al generar) y las que más ganan.',
  'v81 | 2026-10-04 | Feat: botón 📄 Informe en la card Evolución (Ana, Hilda, Juli, Omar; no GDC): informe para el cliente del período anual, del período cerrado o del último mes, con valor, rendimiento, ganancia, cobros, gráfico, distribución, próximos cobros, movimientos y comentario. Se imprime o guarda como PDF; el envío queda a criterio de Garo.',
  'v80 | 2026-10-04 | Feat: app instalable en el celular (manifiesto + ícono + service worker sin caché en la raíz). Dentro de la app instalada aparece abajo a la izquierda el botón ⌂ para volver a Carteras administradas.',
  'v79 | 2026-10-04 | Feat: Evolución de Omar suma solo la cartera principal (Portafolio2/Cocos y Portafolio3/VetaJeep quedan afuera, también en los puntos ya guardados). En Carteras administradas (index v7) Cocos aparece como "Cristian" y VetaJeep como "Jeep", como dos carteras más.',
  'v78 | 2026-10-04 | Feat: Evolución activada en Hilda desde el período en curso (07/12/25→), sin años anteriores.',
  'v77 | 2026-10-03 | Feat: Evolución activada en Juli y Omar (primer período en curso, sin años anteriores; el historial arranca a registrarse desde hoy).',
  'v76 | 2026-10-03 | UI: Distribución, Evolución y Rendimiento por período en una misma fila (se acomodan hacia abajo en pantallas chicas), las tres plegables con ▾ y el estado plegado se recuerda.',
  'v75 | 2026-10-03 | Feat: Evolución — con histDesdeRA los años anteriores salen de la solapa Rendimiento anual (columna TOTAL, sin el 20%), valores de inicio y cierre de cada período incluidos. Activado en Ana.',
  'v74 | 2026-10-03 | Feat: Evolución — valores en USD de años anteriores (inicio y cierre de cada período, cargados en la configuración) se suman al gráfico en "Todo"; GDC 2023–2025 con su inversión inicial de cada año. Rendimiento 2025 de GDC: 22,91%.',
  'v73 | 2026-10-03 | Feat: card Evolución — rendimiento por período (años anteriores cargados en la configuración + cierres futuros + período en curso) y acumulado; con menos de 2 puntos de historial muestra el valor actual en vez de un gráfico vacío. GDC: 2023 +300%, 2024 +70%, 2025 +23%.',
  'v72 | 2026-10-03 | Feat: historial diario del portafolio (config historial: valor por cartera, liquidez, inversión inicial y rendimiento del período, un punto por día) para ver la evolución real. En GDC: card "Evolución" con gráfico (Período actual / 1M / 3M / 6M / 1A / Todo), marcas de cada corte anual y aviso para cerrar el período en la fecha de corte (nueva inversión inicial = valor total del día, con confirmación). Fechas de corte: GDC 1/1, Ana 15/8, Juli 11/5. El resumen para el index ahora incluye el Rendimiento del Resumen.',
  'v71 | 2026-10-03 | Feat: backup diario automático — al abrir cada portafolio (una vez por día) se guarda en su Supabase una copia completa de movimientos, dividendos y configuración (config backup_AAAA-MM-DD); se conservan los últimos 14 días. Botón "Backups" en el encabezado: lista las copias y permite descargarlas o restaurarlas (antes de restaurar guarda una copia del estado actual). (bkDaily / bkOpen / bkRestore)',
  'v70 | 2026-10-03 | Chore: el botón Sync queda solo en GDC (el principal, que empuja ratios, targets, rubros y CCL/MEP a los demás); se quita del HTML de Ana, Hilda, Juli y Omar (ya estaba oculto y desactivado).',
  'v69 | 2026-10-03 | Seguridad: Ana, Hilda, Juli y Omar piden iniciar sesión con Google (solo gcovetta@gmail.com), igual que GDC. Las lecturas y escrituras a Supabase usan el token de la sesión.',
  'v68 | 2026-10-03 | Prep seguridad: Ana, Hilda, Juli y Omar ya traen la pantalla de login con Google (todavía desactivada, se activa por configuración cuando esté configurado Supabase); el Sync de GDC y el resumen del index usan la sesión de cada proyecto si existe, para seguir funcionando cuando se activen las reglas de acceso (RLS).',
  'v67 | 2026-10-03 | Fix (Omar): la alerta de P. Venta y la card "Distribución de la cartera" habían quedado adentro de la barra fija "Posiciones abiertas" (al pie de la pantalla); ahora están arriba de las tablas, como en los otros portafolios.',
  'v66 | 2026-10-03 | Feat: cada portafolio guarda un resumen (posiciones, valores, distribución, liquidez y cobros de 30 días) en su Supabase para la nueva vista familiar (Familia/), como mucho cada 3 minutos. Con carteras (Omar) se guarda una por cartera. (famQueueSnapshot / famSaveSnapshot)',
  'v65 | 2026-10-03 | Versión unificada: desde ahora los 5 portafolios comparten un único número de versión (el del código común comun/portafolio.js). El badge de abajo a la derecha lo toma del código que realmente cargó el navegador, así se puede contrastar que todos estén en la misma versión.'
];
(function(){
  function setBadge(){var b=document.getElementById('claude-version-badge');if(!b)return;b.textContent='v'+APP_VERSION+' · '+APP_VERSION_FECHA;b.title=APP_CHANGELOG[0].split(' | ').slice(2).join(' | ');}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setBadge);else setBadge();
})();

// ─── Configuración por portafolio ──────────────────────────────────────────
// Cada HTML define window.PORTFOLIO_CONFIG antes de cargar este archivo. Los valores de abajo
// son los de GDC (referencia); cada portafolio pisa los que le corresponden.
var CFG=Object.assign({
  id:'gdc', nombre:'GDC',
  lsPrefix:(PFX+''),            // prefijo de claves localStorage
  trkSuffix:'_gdc',              // sufijo de claves del tracker de dividendos
  supabaseUrl:'https://wstnseufzyavgdovrehu.supabase.co',
  supabaseKey:'',
  auth:true, allowedEmail:'gcovetta@gmail.com',   // login con Google + RLS
  dataVersion:'v19_ghost_fix',
  perfilDefault:'agresivo',
  sync:true,                     // botón Sync que empuja datos a los otros portafolios
  rsi:true,                      // columna RSI/TIR en las tablas
  broker:'veta',                 // comparación de posiciones: 'veta' (GDC) o 'bull'
  brokerNombre:'Veta',
  wlKey:'wl_gdc_v1',
  periodoInicio:'01-01',          // corte anual (MM-DD); null = sin corte
  historial:true                  // muestra la card Evolución
}, window.PORTFOLIO_CONFIG||{});
var PFX=CFG.lsPrefix;

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
// GITHUB SYNC CONFIG
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

// Token de sesión de otro proyecto Supabase (si ya iniciaste sesión en ese portafolio en este
// navegador — las sesiones de los 5 proyectos conviven en el mismo origen). Sin sesión → anon key.
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
    // Borrar entrada existente
    await fetch(baseUrl + '/rest/v1/config?key=eq.' + encodeURIComponent(configKey), {
      method: 'DELETE', headers: headers
    });
    // Insertar nueva
    var r = await fetch(baseUrl + '/rest/v1/config', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ key: configKey, value: JSON.stringify(value) })
    });
    return r.ok;
  } catch(e) { return false; }
}

async function syncDataToOthers(statusCallback) {
  // Lee los valores actuales en memoria de GDC
  // También intenta leer ccl_override y mep_override de Supabase
  var cclOvr = await sbGetConfig('ccl_override');
  var mepOvr = await sbGetConfig('mep_override');

  // Filtrar TARGET_TABLE: solo tickers con precio real (no null)
  var realTargets = {};
  Object.keys(TARGET_TABLE).forEach(function(t){ if(TARGET_TABLE[t]!=null) realTargets[t]=TARGET_TABLE[t]; });

  var tables = [
    // Los otros 4 portafolios ya leen 'ratios' de su propia Supabase en el init (sbGetConfig('ratios')) —
    // sólo faltaba que GDC se lo empuje.
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

// El paso de "Sync HTML" (dispara un GitHub Action que reconstruye los 5 HTML) está
// desactivado a propósito: GH_TOKEN es un placeholder sin reemplazar, así que ese paso
// siempre tiraba error — y tapaba que el sync de datos (CCL/MEP/Ratios/Targets/Rubros)
// SÍ funciona. Poné esto en true (y un token real en GH_TOKEN) para reactivarlo.
var SYNC_HTML_ENABLED = false;

async function syncPortfolios() {
  if(!CFG.sync) return;
  var btn   = document.getElementById('sync-btn');
  var icon  = document.getElementById('sync-icon');
  var label = document.getElementById('sync-label');

  // Estado: cargando
  btn.disabled = true;
  icon.style.display = 'inline-block';
  icon.style.animation = 'spin360 1s linear infinite';
  label.textContent = 'Sync...';
  btn.style.borderColor = 'var(--amber)';
  btn.style.color = 'var(--amber)';

  // 1. Sincronizar datos (Ratios, Targets, Rubros, CCL, MEP) a Omar, Ana, Hilda y Juli
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
// SUPABASE CONFIG
// ════════════════════════════════════════════════════════
var SUPABASE_URL = CFG.supabaseUrl;
var SUPABASE_KEY = CFG.supabaseKey||'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdG5zZXVmenlhdmdkb3ZyZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NzU0MTYsImV4cCI6MjA5MTM1MTQxNn0.0mmKvfCM_HoBJjbIhFzM5TeKEc-LphQwEXNjHqV_CfU';

// ════════════════════════════════════════════════════════
// AUTH — login con Google, restringido a un email. La protección real
// vive en las políticas RLS de Supabase (ver SQL aparte); esto es la
// puerta de entrada + el token que hace que esas políticas te reconozcan.
// ════════════════════════════════════════════════════════
var ALLOWED_EMAIL = CFG.allowedEmail;
var sbAuth = CFG.auth ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
window._sbAccessToken = null; // token del usuario logueado; sbHeaders() lo usa en vez de la anon key sola

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

// Se llama al boot y cada vez que cambia el estado de auth. Devuelve true/false
// según si el usuario logueado es el permitido. Muestra/oculta el gate visual.
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
      // Logueado pero con una cuenta que no es la permitida → afuera
      if(errEl){errEl.textContent='Esa cuenta de Google no tiene acceso a este portfolio.';errEl.style.display='block';}
      await sbAuth.auth.signOut();
      window._sbAccessToken=null;
    }
  }catch(e){}
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
// Hace un ping liviano cada 3 días para evitar que el proyecto se pause
(function sbKeepalive(){
  var KEY = 'sb_keepalive_' + (SUPABASE_URL.match(/\/\/([^.]+)/)||[])[1];
  var last = 0;
  try{ last = parseInt(localStorage.getItem(KEY)||'0'); }catch(e){}
  var now = Date.now();
  if(now - last < 3 * 24 * 60 * 60 * 1000) return; // menos de 3 días, no hacer nada
  fetch(SUPABASE_URL + '/rest/v1/config?limit=1', {
    headers: {'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY}
  }).then(function(r){
    if(r.ok){ try{ localStorage.setItem(KEY, String(now)); }catch(e){} }
  }).catch(function(){});
})();

function sbHeaders(){
  // apikey siempre es la clave pública (anon); Authorization usa el token de la
  // sesión logueada cuando existe, para que las políticas RLS te reconozcan.
  // Sin sesión válida, cae a la anon key y RLS te bloquea (comportamiento correcto).
  var token = window._sbAccessToken || SUPABASE_KEY;
  return {'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+token};
}

// Upsert un registro en una tabla por PK "key" (tabla config)
async function sbSetConfig(key, value){
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

async function sbGetConfig(key){
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/config?key=eq.'+encodeURIComponent(key)+'&select=value',{headers:sbHeaders()});
    var d=await r.json();
    if(!d||!d[0]) return null;
    var val=d[0].value;
    if(typeof val==='string'){try{val=JSON.parse(val);}catch(e){}}
    return val;
  }catch(e){ return null; }
}

// Guardar array completo en tabla (borra todo y reinserta)
async function sbSaveArray(table, arr){
  try{
    var delRes=await fetch(SUPABASE_URL+'/rest/v1/'+table+'?id=gte.0',{method:'DELETE',headers:sbHeaders()});
    if(!delRes.ok) throw new Error('DEL '+delRes.status);
    if(!arr||!arr.length) return true;
    // Usar IDs secuenciales enteros para evitar problemas con bigint en Supabase
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
// Reintenta sbSaveArray hasta 3 veces (backoff 1.2s/2.4s) antes de darse por vencido —
// mitiga cortes de red momentáneos o cierres de pestaña justo después de guardar.
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
  // Retorna: array (ok, puede ser vacío), null (error de red/parse)
  // El llamador puede distinguir: null → Supabase inalcanzable → usar localStorage
  //                               []   → tabla vacía legítima → NO usar localStorage contaminado
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/'+table+'?select=data&order=id.asc',{headers:sbHeaders()});
    if(!r.ok) return null; // error HTTP → tratar como inalcanzable
    var d=await r.json();
    if(!Array.isArray(d)) return null;
    return d.map(function(row){return row.data;});
  }catch(e){ return null; }
}

// Status de conexión
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
// PORTAFOLIO ORIGINAL
// ════════════════════════════════════════════════════════
var FKEY = 'd7ar4v9r01qtpbh9hs60d7ar4v9r01qtpbh9hs6g';
var FBASE = 'https://finnhub.io/api/v1';


var CCL_TABLE = {"19/04/2026": 1462.0, "20/04/2026": 1463.0, "21/04/2026": 1464.0, "22/04/2026": 1465.0, "23/04/2026": 1465.0, "24/04/2026": 1466.0, "25/04/2026": 1467.0, "26/04/2026": 1468.0, "27/04/2026": 1469.0, "28/04/2026": 1470.0, "29/04/2026": 1471.0, "30/04/2026": 1471.0, "01/05/2026": 1472.0, "02/05/2026": 1473.0, "03/05/2026": 1474.0, "04/05/2026": 1475.0, "05/05/2026": 1476.0, "06/05/2026": 1477.0, "07/05/2026": 1478.0, "08/05/2026": 1478.0, "09/05/2026": 1479.0, "10/05/2026": 1480.0, "11/05/2026": 1481.0, "12/05/2026": 1482.0, "13/05/2026": 1483.0, "14/05/2026": 1484.0, "15/05/2026": 1484.0, "16/05/2026": 1485.0, "17/05/2026": 1486.0, "18/05/2026": 1487.0, "27/12/2023": 973.0, "24/11/2025": 1518.0, "07/04/2026": 1483.0, "08/04/2026": 1475.0, "09/04/2026": 1475.0, "10/04/2026": 1473.0, "11/04/2026": 1473.0, "12/04/2026": 1473.0, "13/04/2026": 1467.0, "14/04/2026": 1467.0, "15/04/2026": 1466.0, "16/04/2026": 1460.0, "17/04/2026": 1453.0, "18/04/2026": 1453.0, "06/04/2026": 1483.0, "05/04/2026": 1495.0, "04/04/2026": 1495.0, "03/04/2026": 1495.0, "02/04/2026": 1495.0, "01/04/2026": 1486.0, "31/03/2026": 1473.0, "30/03/2026": 1483.0, "29/03/2026": 1476.0, "28/03/2026": 1476.0, "27/03/2026": 1476.0, "26/03/2026": 1448.0, "25/03/2026": 1449.0, "24/03/2026": 1463.0, "23/03/2026": 1465.0, "22/03/2026": 1473.0, "21/03/2026": 1473.0, "20/03/2026": 1473.0, "19/03/2026": 1469.0, "18/03/2026": 1469.0, "17/03/2026": 1469.0, "16/03/2026": 1469.0, "15/03/2026": 1467.0, "14/03/2026": 1467.0, "13/03/2026": 1467.0, "12/03/2026": 1460.0, "11/03/2026": 1453.0, "10/03/2026": 1464.0, "09/03/2026": 1474.0, "08/03/2026": 1482.0, "07/03/2026": 1482.0, "06/03/2026": 1482.0, "05/03/2026": 1462.0, "04/03/2026": 1464.0, "03/03/2026": 1484.0, "02/03/2026": 1456.0, "01/03/2026": 1455.0, "28/02/2026": 1455.0, "27/02/2026": 1455.0, "26/02/2026": 1478.0, "25/02/2026": 1464.0, "24/02/2026": 1444.0, "23/02/2026": 1436.0, "22/02/2026": 1442.0, "21/02/2026": 1442.0, "20/02/2026": 1442.0, "19/02/2026": 1451.0, "18/02/2026": 1449.0, "12/02/2026": 1486.0, "11/02/2026": 1478.0, "30/01/2026": 1502.0, "29/01/2026": 1505.0, "28/01/2026": 1513.0, "27/01/2026": 1511.0, "26/01/2026": 1516.0, "22/01/2026": 1508.0, "21/01/2026": 1516.0, "20/01/2026": 1523.0, "16/01/2026": 1519.0, "15/01/2026": 1523.0, "14/01/2026": 1522.0, "13/01/2026": 1528.0, "12/01/2026": 1534.0, "09/01/2026": 1527.0, "08/01/2026": 1526.0, "06/01/2026": 1536.0, "05/01/2026": 1536.0, "02/01/2026": 1550.0, "30/12/2025": 1522.0, "26/12/2025": 1520.0, "24/12/2025": 1528.0, "23/12/2025": 1529.0, "22/12/2025": 1548.0, "19/12/2025": 1545.0, "18/12/2025": 1550.0, "17/12/2025": 1564.0, "16/12/2025": 1549.0, "15/12/2025": 1523.0, "12/12/2025": 1515.0, "11/12/2025": 1508.0, "10/12/2025": 1496.0, "09/12/2025": 1514.0, "05/12/2025": 1516.0, "04/12/2025": 1510.0, "03/12/2025": 1518.0, "02/12/2025": 1528.0, "01/12/2025": 1516.0, "28/11/2025": 1518.0, "27/11/2025": 1524.0, "26/11/2025": 1534.0, "25/11/2025": 1523.0, "22/11/2025": 1510.0, "21/11/2025": 1510.0, "20/11/2025": 1513.0, "19/11/2025": 1466.0, "18/11/2025": 1485.0, "17/11/2025": 1480.0, "16/11/2025": 1502.0, "15/11/2025": 1502.0, "14/11/2025": 1502.0, "13/11/2025": 1475.0, "12/11/2025": 1477.0, "11/11/2025": 1480.0, "10/11/2025": 1481.0, "09/11/2025": 1473.0, "08/11/2025": 1473.0, "07/11/2025": 1473.0, "06/11/2025": 1506.0, "05/11/2025": 1500.0, "04/11/2025": 1522.0, "03/11/2025": 1518.0, "02/11/2025": 1502.0, "01/11/2025": 1502.0, "31/10/2025": 1502.0, "30/10/2025": 1494.0, "29/10/2025": 1474.0, "28/10/2025": 1474.0, "27/10/2025": 1458.0, "25/10/2025": 1568.0, "24/10/2025": 1568.0, "23/10/2025": 1551.0, "22/10/2025": 1608.0, "21/10/2025": 1608.0, "20/10/2025": 1570.0, "19/10/2025": 1540.0, "18/10/2025": 1540.0, "17/10/2025": 1540.0, "16/10/2025": 1484.0, "15/10/2025": 1455.0, "14/10/2025": 1469.0, "13/10/2025": 1440.0, "12/10/2025": 1497.0, "11/10/2025": 1497.0, "10/10/2025": 1497.0, "09/10/2025": 1451.0, "08/10/2025": 1545.0, "07/10/2025": 1558.0, "06/10/2025": 1516.0, "05/10/2025": 1523.0, "04/10/2025": 1523.0, "03/10/2025": 1523.0, "02/10/2025": 1554.0, "01/10/2025": 1571.0, "30/09/2025": 1538.0, "29/09/2025": 1489.0, "28/09/2025": 1468.0, "27/09/2025": 1468.0, "26/09/2025": 1468.0, "25/09/2025": 1399.0, "24/09/2025": 1394.0, "23/09/2025": 1418.0, "22/09/2025": 1438.0, "21/09/2025": 1557.0, "20/09/2025": 1557.0, "19/09/2025": 1557.0, "18/09/2025": 1552.0, "17/09/2025": 1494.0, "16/09/2025": 1475.0, "15/09/2025": 1495.0, "14/09/2025": 1478.0, "13/09/2025": 1478.0, "12/09/2025": 1478.0, "11/09/2025": 1447.0, "10/09/2025": 1435.0, "09/09/2025": 1438.0, "08/09/2025": 1446.0, "07/09/2025": 1388.0, "06/09/2025": 1388.0, "05/09/2025": 1388.0, "04/09/2025": 1379.0, "03/09/2025": 1373.0, "02/09/2025": 1370.0, "01/09/2025": 1351.0, "31/08/2025": 1354.0, "30/08/2025": 1354.0, "29/08/2025": 1354.0, "28/08/2025": 1346.0, "27/08/2025": 1355.0, "26/08/2025": 1358.0, "25/08/2025": 1362.0, "24/08/2025": 1335.0, "23/08/2025": 1335.0, "22/08/2025": 1335.0, "21/08/2025": 1321.0, "20/08/2025": 1308.0, "19/08/2025": 1302.0, "18/08/2025": 1303.0, "17/08/2025": 1319.0, "16/08/2025": 1319.0, "15/08/2025": 1319.0, "14/08/2025": 1306.0, "13/08/2025": 1319.0, "12/08/2025": 1320.0, "11/08/2025": 1324.0, "10/08/2025": 1331.0, "09/08/2025": 1331.0, "08/08/2025": 1331.0, "07/08/2025": 1327.0, "06/08/2025": 1334.0, "05/08/2025": 1346.0, "04/08/2025": 1356.0, "03/08/2025": 1365.0, "02/08/2025": 1365.0, "01/08/2025": 1365.0, "31/07/2025": 1359.0, "30/07/2025": 1316.0, "29/07/2025": 1293.0, "28/07/2025": 1299.0, "27/07/2025": 1289.0, "26/07/2025": 1289.0, "25/07/2025": 1289.0, "24/07/2025": 1276.0, "23/07/2025": 1266.0, "22/07/2025": 1263.0, "21/07/2025": 1286.0, "20/07/2025": 1295.0, "19/07/2025": 1295.0, "18/07/2025": 1295.0, "17/07/2025": 1283.0, "16/07/2025": 1277.0, "15/07/2025": 1279.0, "14/07/2025": 1295.0, "13/07/2025": 1273.0, "12/07/2025": 1273.0, "11/07/2025": 1273.0, "10/07/2025": 1270.0, "09/07/2025": 1272.0, "08/07/2025": 1260.0, "07/07/2025": 1277.0, "06/07/2025": 1237.0, "05/07/2025": 1237.0, "04/07/2025": 1237.0, "03/07/2025": 1234.0, "02/07/2025": 1237.0, "01/07/2025": 1235.0, "30/06/2025": 1210.0, "29/06/2025": 1202.0, "28/06/2025": 1202.0, "27/06/2025": 1202.0, "26/06/2025": 1201.0, "25/06/2025": 1203.0, "24/06/2025": 1188.0, "23/06/2025": 1189.0, "22/06/2025": 1182.0, "21/06/2025": 1182.0, "20/06/2025": 1182.0, "19/06/2025": 1172.0, "18/06/2025": 1175.0, "17/06/2025": 1183.0, "16/06/2025": 1182.0, "15/06/2025": 1192.0, "14/06/2025": 1192.0, "13/06/2025": 1192.0, "12/06/2025": 1191.0, "11/06/2025": 1196.0, "10/06/2025": 1195.0, "09/06/2025": 1200.0, "08/06/2025": 1199.0, "07/06/2025": 1199.0, "06/06/2025": 1199.0, "05/06/2025": 1195.0, "04/06/2025": 1202.0, "03/06/2025": 1200.0, "02/06/2025": 1194.0, "01/06/2025": 1203.0, "31/05/2025": 1203.0, "30/05/2025": 1203.0, "29/05/2025": 1196.0, "28/05/2025": 1177.0, "27/05/2025": 1175.0, "26/05/2025": 1169.0, "25/05/2025": 1165.0, "24/05/2025": 1165.0, "23/05/2025": 1165.0, "22/05/2025": 1161.0, "21/05/2025": 1166.0, "20/05/2025": 1170.0, "19/05/2025": 1163.0, "18/05/2025": 1175.0, "17/05/2025": 1175.0, "16/05/2025": 1175.0, "15/05/2025": 1165.0, "14/05/2025": 1153.0, "13/05/2025": 1161.0, "12/05/2025": 1161.0, "11/05/2025": 1155.0, "10/05/2025": 1155.0, "09/05/2025": 1155.0, "08/05/2025": 1160.0, "07/05/2025": 1167.0, "06/05/2025": 1212.0, "05/05/2025": 1217.0, "04/05/2025": 1219.0, "03/05/2025": 1219.0, "02/05/2025": 1219.0, "01/05/2025": 1214.0, "30/04/2025": 1194.0, "29/04/2025": 1187.0, "28/04/2025": 1193.0, "27/04/2025": 1198.0, "26/04/2025": 1198.0, "25/04/2025": 1198.0, "24/04/2025": 1200.0, "23/04/2025": 1181.0, "22/04/2025": 1159.0, "21/04/2025": 1132.0, "20/04/2025": 1169.0, "19/04/2025": 1169.0, "18/04/2025": 1169.0, "17/04/2025": 1169.0, "16/04/2025": 1183.0, "15/04/2025": 1248.0, "14/04/2025": 1258.0, "13/04/2025": 1339.0, "12/04/2025": 1339.0, "11/04/2025": 1339.0, "10/04/2025": 1364.0, "09/04/2025": 1343.0, "08/04/2025": 1374.0, "07/04/2025": 1361.0, "06/04/2025": 1338.0, "05/04/2025": 1338.0, "04/04/2025": 1338.0, "03/04/2025": 1322.0, "02/04/2025": 1301.0, "01/04/2025": 1310.0, "31/03/2025": 1316.0, "30/03/2025": 1305.0, "29/03/2025": 1305.0, "28/03/2025": 1305.0, "27/03/2025": 1297.0, "26/03/2025": 1296.0, "25/03/2025": 1297.0, "24/03/2025": 1264.0, "23/03/2025": 1292.0, "22/03/2025": 1292.0, "21/03/2025": 1292.0, "20/03/2025": 1289.0, "19/03/2025": 1293.0, "18/03/2025": 1301.0, "17/03/2025": 1258.0, "16/03/2025": 1241.0, "15/03/2025": 1241.0, "14/03/2025": 1241.0, "13/03/2025": 1235.0, "12/03/2025": 1230.0, "11/03/2025": 1229.0, "10/03/2025": 1228.0, "09/03/2025": 1220.0, "08/03/2025": 1220.0, "07/03/2025": 1220.0, "06/03/2025": 1235.0, "05/03/2025": 1234.0, "04/03/2025": 1250.0, "03/03/2025": 1232.0, "02/03/2025": 1215.0, "01/03/2025": 1215.0, "28/02/2025": 1215.0, "27/02/2025": 1231.0, "26/02/2025": 1211.0, "25/02/2025": 1216.0, "24/02/2025": 1223.0, "23/02/2025": 1217.0, "22/02/2025": 1217.0, "21/02/2025": 1217.0, "20/02/2025": 1211.0, "19/02/2025": 1214.0, "18/02/2025": 1213.0, "17/02/2025": 1184.0, "16/02/2025": 1201.0, "15/02/2025": 1201.0, "14/02/2025": 1201.0, "13/02/2025": 1197.0, "12/02/2025": 1196.0, "11/02/2025": 1197.0, "10/02/2025": 1191.0, "09/02/2025": 1205.0, "08/02/2025": 1205.0, "07/02/2025": 1205.0, "06/02/2025": 1192.0, "05/02/2025": 1205.0, "04/02/2025": 1193.0, "03/02/2025": 1194.0, "02/02/2025": 1191.0, "01/02/2025": 1191.0, "31/01/2025": 1191.0, "30/01/2025": 1186.0, "29/01/2025": 1179.0, "28/01/2025": 1177.0, "27/01/2025": 1166.0, "26/01/2025": 1173.0, "25/01/2025": 1173.0, "24/01/2025": 1173.0, "23/01/2025": 1192.0, "22/01/2025": 1198.0, "21/01/2025": 1181.0, "20/01/2025": 1201.0, "19/01/2025": 1188.0, "18/01/2025": 1188.0, "17/01/2025": 1188.0, "16/01/2025": 1196.0, "15/01/2025": 1189.0, "14/01/2025": 1191.0, "13/01/2025": 1190.0, "12/01/2025": 1195.0, "11/01/2025": 1195.0, "10/01/2025": 1195.0, "09/01/2025": 1208.0, "08/01/2025": 1193.0, "07/01/2025": 1191.0, "06/01/2025": 1190.0, "05/01/2025": 1180.0, "04/01/2025": 1180.0, "03/01/2025": 1180.0, "02/01/2025": 1174.0, "01/01/2025": 1197.0, "31/12/2024": 1197.0, "30/12/2024": 1189.0, "29/12/2024": 1186.0, "28/12/2024": 1186.0, "27/12/2024": 1186.0, "26/12/2024": 1190.0, "25/12/2024": 1173.0, "24/12/2024": 1173.0, "23/12/2024": 1171.0, "22/12/2024": 1172.0, "21/12/2024": 1172.0, "20/12/2024": 1172.0, "19/12/2024": 1157.0, "18/12/2024": 1188.0, "17/12/2024": 1150.0, "16/12/2024": 1115.0, "15/12/2024": 1090.0, "14/12/2024": 1090.0, "13/12/2024": 1090.0, "12/12/2024": 1073.0, "11/12/2024": 1066.0, "10/12/2024": 1077.0, "09/12/2024": 1071.0, "08/12/2024": 1070.0, "07/12/2024": 1070.0, "06/12/2024": 1070.0, "05/12/2024": 1088.0, "04/12/2024": 1102.0, "03/12/2024": 1106.0, "02/12/2024": 1101.0, "01/12/2024": 1111.0, "30/11/2024": 1111.0, "29/11/2024": 1111.0, "28/11/2024": 1112.0, "27/11/2024": 1107.0, "26/11/2024": 1109.0, "25/11/2024": 1113.0, "24/11/2024": 1113.0, "23/11/2024": 1113.0, "22/11/2024": 1113.0, "21/11/2024": 1113.0, "20/11/2024": 1111.0, "19/11/2024": 1113.0, "18/11/2024": 1090.0, "17/11/2024": 1129.0, "16/11/2024": 1129.0, "15/11/2024": 1129.0, "14/11/2024": 1155.0, "13/11/2024": 1157.0, "12/11/2024": 1164.0, "11/11/2024": 1160.0, "10/11/2024": 1157.0, "09/11/2024": 1157.0, "08/11/2024": 1157.0, "07/11/2024": 1167.0, "06/11/2024": 1165.0, "05/11/2024": 1181.0, "04/11/2024": 1185.0, "03/11/2024": 1177.0, "02/11/2024": 1177.0, "01/11/2024": 1177.0, "31/10/2024": 1158.0, "30/10/2024": 1159.0, "29/10/2024": 1155.0, "28/10/2024": 1158.0, "27/10/2024": 1165.0, "26/10/2024": 1165.0, "25/10/2024": 1165.0, "24/10/2024": 1181.0, "23/10/2024": 1188.0, "22/10/2024": 1194.0, "21/10/2024": 1195.0, "20/10/2024": 1197.0, "19/10/2024": 1197.0, "18/10/2024": 1197.0, "17/10/2024": 1194.0, "16/10/2024": 1190.0, "15/10/2024": 1179.0, "14/10/2024": 1181.0, "13/10/2024": 1175.0, "12/10/2024": 1175.0, "11/10/2024": 1175.0, "10/10/2024": 1179.0, "09/10/2024": 1195.0, "08/10/2024": 1213.0, "07/10/2024": 1222.0, "06/10/2024": 1226.0, "05/10/2024": 1226.0, "04/10/2024": 1226.0, "03/10/2024": 1230.0, "02/10/2024": 1239.0, "01/10/2024": 1246.0, "30/09/2024": 1239.0, "28/09/2024": 1229.0, "27/09/2024": 1229.0, "26/09/2024": 1228.0, "25/09/2024": 1228.0, "24/09/2024": 1224.0, "23/09/2024": 1227.0, "22/09/2024": 1224.0, "21/09/2024": 1224.0, "20/09/2024": 1224.0, "19/09/2024": 1219.0, "18/09/2024": 1235.0, "17/09/2024": 1242.0, "16/09/2024": 1244.0, "15/09/2024": 1252.0, "14/09/2024": 1252.0, "13/09/2024": 1252.0, "12/09/2024": 1256.0, "11/09/2024": 1252.0, "10/09/2024": 1251.0, "09/09/2024": 1244.0, "08/09/2024": 1263.0, "07/09/2024": 1263.0, "06/09/2024": 1263.0, "05/09/2024": 1274.0, "04/09/2024": 1295.0, "03/09/2024": 1309.0, "02/09/2024": 1311.0, "01/09/2024": 1296.0, "31/08/2024": 1296.0, "30/08/2024": 1296.0, "29/08/2024": 1288.0, "28/08/2024": 1295.0, "27/08/2024": 1297.0, "26/08/2024": 1291.0, "25/08/2024": 1290.0, "24/08/2024": 1290.0, "23/08/2024": 1290.0, "22/08/2024": 1291.0, "21/08/2024": 1292.0, "20/08/2024": 1295.0, "19/08/2024": 1287.0, "18/08/2024": 1288.0, "17/08/2024": 1288.0, "16/08/2024": 1288.0, "15/08/2024": 1270.0, "14/08/2024": 1269.0, "13/08/2024": 1267.0, "12/08/2024": 1284.0, "11/08/2024": 1287.0, "10/08/2024": 1287.0, "09/08/2024": 1287.0, "08/08/2024": 1295.0, "07/08/2024": 1319.0, "06/08/2024": 1332.0, "05/08/2024": 1337.0, "04/08/2024": 1324.0, "03/08/2024": 1324.0, "02/08/2024": 1324.0, "01/08/2024": 1299.0, "31/07/2024": 1282.0, "30/07/2024": 1258.0, "29/07/2024": 1289.0, "28/07/2024": 1312.0, "27/07/2024": 1312.0, "26/07/2024": 1312.0, "25/07/2024": 1322.0, "24/07/2024": 1333.0, "23/07/2024": 1331.0, "22/07/2024": 1330.0, "21/07/2024": 1326.0, "20/07/2024": 1326.0, "19/07/2024": 1326.0, "18/07/2024": 1322.0, "17/07/2024": 1303.0, "16/07/2024": 1283.0, "15/07/2024": 1306.0, "14/07/2024": 1427.0, "13/07/2024": 1427.0, "12/07/2024": 1427.0, "11/07/2024": 1411.0, "10/07/2024": 1388.0, "09/07/2024": 1376.0, "08/07/2024": 1383.0, "07/07/2024": 1389.0, "06/07/2024": 1398.0, "05/07/2024": 1398.0, "04/07/2024": 1398.0, "03/07/2024": 1382.0, "02/07/2024": 1435.0, "01/07/2024": 1413.0, "30/06/2024": 1359.0, "29/06/2024": 1359.0, "28/06/2024": 1359.0, "27/06/2024": 1355.0, "26/06/2024": 1353.0, "25/06/2024": 1322.0, "24/06/2024": 1310.0, "23/06/2024": 1295.0, "22/06/2024": 1295.0, "21/06/2024": 1295.0, "20/06/2024": 1295.0, "19/06/2024": 1295.0, "18/06/2024": 1269.0, "17/06/2024": 1272.0, "16/06/2024": 1272.0, "15/06/2024": 1272.0, "14/06/2024": 1272.0, "13/06/2024": 1278.0, "12/06/2024": 1309.0, "11/06/2024": 1311.0, "10/06/2024": 1308.0, "09/06/2024": 1307.0, "08/06/2024": 1307.0, "07/06/2024": 1307.0, "06/06/2024": 1301.0, "05/06/2024": 1307.0, "04/06/2024": 1313.0, "03/06/2024": 1291.0, "02/06/2024": 1247.0, "01/06/2024": 1247.0, "31/05/2024": 1247.0, "30/05/2024": 1213.0, "29/05/2024": 1214.0, "28/05/2024": 1239.0, "27/05/2024": 1266.0, "26/05/2024": 1235.0, "25/05/2024": 1235.0, "24/05/2024": 1235.0, "23/05/2024": 1256.0, "22/05/2024": 1253.0, "21/05/2024": 1194.0, "20/05/2024": 1137.0, "19/05/2024": 1104.0, "18/05/2024": 1104.0, "17/05/2024": 1104.0, "16/05/2024": 1100.0, "15/05/2024": 1094.0, "14/05/2024": 1086.0, "13/05/2024": 1076.0, "12/05/2024": 1079.0, "11/05/2024": 1079.0, "10/05/2024": 1079.0, "09/05/2024": 1083.0, "08/05/2024": 1078.0, "07/05/2024": 1096.0, "06/05/2024": 1111.0, "05/05/2024": 1121.0, "04/05/2024": 1121.0, "03/05/2024": 1121.0, "02/05/2024": 1122.0, "01/05/2024": 1104.0, "30/04/2024": 1095.0, "29/04/2024": 1093.0, "28/04/2024": 1086.0, "27/04/2024": 1086.0, "26/04/2024": 1086.0, "25/04/2024": 1082.0, "24/04/2024": 1058.0, "23/04/2024": 1055.0, "22/04/2024": 1060.0, "21/04/2024": 1068.0, "20/04/2024": 1068.0, "19/04/2024": 1068.0, "18/04/2024": 1070.0, "17/04/2024": 1065.0, "16/04/2024": 1076.0, "15/04/2024": 1074.0, "14/04/2024": 1052.0, "13/04/2024": 1052.0, "12/04/2024": 1052.0, "11/04/2024": 1050.0, "10/04/2024": 1047.0, "09/04/2024": 1043.0, "08/04/2024": 1039.0, "07/04/2024": 1050.0, "06/04/2024": 1050.0, "05/04/2024": 1050.0, "04/04/2024": 1057.0, "03/04/2024": 1074.0, "02/04/2024": 1113.0, "01/04/2024": 1095.0, "31/03/2024": 1098.0, "30/03/2024": 1098.0, "29/03/2024": 1098.0, "28/03/2024": 1098.0, "27/03/2024": 1085.0, "26/03/2024": 1101.0, "25/03/2024": 1083.0, "24/03/2024": 1096.0, "23/03/2024": 1096.0, "22/03/2024": 1096.0, "21/03/2024": 1101.0, "20/03/2024": 1098.0, "19/03/2024": 1084.0, "18/03/2024": 1080.0, "17/03/2024": 1074.0, "16/03/2024": 1074.0, "15/03/2024": 1074.0, "14/03/2024": 1059.0, "13/03/2024": 1054.0, "12/03/2024": 1073.0, "11/03/2024": 1025.0, "10/03/2024": 1053.0, "08/03/2024": 1053.0, "07/03/2024": 1030.0, "06/03/2024": 1022.0, "05/03/2024": 1043.0, "04/03/2024": 1070.0, "03/03/2024": 1085.0, "02/03/2024": 1085.0, "01/03/2024": 1085.0, "29/02/2024": 1066.0, "28/02/2024": 1071.0, "27/02/2024": 1090.0, "26/02/2024": 1097.0, "25/02/2024": 1121.0, "24/02/2024": 1121.0, "23/02/2024": 1121.0, "22/02/2024": 1105.0, "21/02/2024": 1108.0, "20/02/2024": 1127.0, "19/02/2024": 1134.0, "18/02/2024": 1118.0, "17/02/2024": 1118.0, "16/02/2024": 1118.0, "15/02/2024": 1161.0, "14/02/2024": 1178.0, "13/02/2024": 1252.0, "12/02/2024": 1240.0, "11/02/2024": 1235.0, "10/02/2024": 1235.0, "09/02/2024": 1235.0, "08/02/2024": 1255.0, "07/02/2024": 1263.0, "06/02/2024": 1253.0, "05/02/2024": 1294.0, "04/02/2024": 1298.0, "03/02/2024": 1298.0, "02/02/2024": 1298.0, "01/02/2024": 1286.0, "31/01/2024": 1267.0, "30/01/2024": 1273.0, "29/01/2024": 1260.0, "28/01/2024": 1235.0, "27/01/2024": 1235.0, "26/01/2024": 1264.0, "25/01/2024": 1323.0, "24/01/2024": 1294.0, "23/01/2024": 1290.0, "22/01/2024": 1314.0, "21/01/2024": 1304.0, "20/01/2024": 1304.0, "19/01/2024": 1304.0, "18/01/2024": 1282.0, "17/01/2024": 1272.0, "16/01/2024": 1212.0, "15/01/2024": 1171.0, "14/01/2024": 1148.0, "13/01/2024": 1148.0, "12/01/2024": 1148.0, "11/01/2024": 1164.0, "10/01/2024": 1190.0, "09/01/2024": 1206.0, "08/01/2024": 1201.0, "07/01/2024": 1144.0, "06/01/2024": 1144.0, "05/01/2024": 1144.0, "04/01/2024": 1099.0, "03/01/2024": 1052.0, "02/01/2024": 997.0, "01/01/2024": 973.0, "01/06/2026": 1490.0, "01/07/2026": 1567.0, "03/06/2026": 1514.0, "03/07/2026": 1596.0, "04/12/2023": 890.0, "05/06/2026": 1511.0, "05/12/2023": 909.0, "06/07/2026": 1572.0, "06/12/2023": 937.0, "07/12/2023": 991.0, "11/06/2026": 1493.0, "12/12/2023": 1032.0, "13/07/2026": 1568.0, "14/12/2023": 1016.0, "15/12/2023": 997.0, "18/12/2023": 946.0, "19/01/2026": 1512.0, "19/12/2023": 951.0, "20/07/2026": 1572.0, "20/12/2023": 945.0, "21/05/2026": 1478.0, "21/07/2026": 1565.0, "21/12/2023": 944.0, "22/05/2026": 1487.0, "22/06/2026": 1529.0, "22/07/2026": 1564.0, "22/12/2023": 941.0, "23/01/2026": 1507.0, "23/06/2026": 1553.0, "24/06/2026": 1580.0, "25/06/2026": 1546.0, "26/05/2026": 1488.0, "26/12/2023": 901.0, "27/05/2026": 1481.0, "27/11/2023": 858.0, "28/05/2026": 1485.0, "28/11/2023": 848.0, "28/12/2023": 945.0, "29/05/2026": 1487.0, "29/06/2026": 1554.0, "29/11/2023": 820.0, "29/12/2023": 973.0, "29/12/2025": 1508.0, "30/06/2026": 1557.0, "30/11/2023": 836.0};
var MEP_TABLE = {"09/09/2026": 1531.0, "19/04/2026": 1412.0, "20/04/2026": 1411.0, "21/04/2026": 1410.0, "22/04/2026": 1409.0, "23/04/2026": 1408.0, "24/04/2026": 1407.0, "25/04/2026": 1406.0, "26/04/2026": 1405.0, "27/04/2026": 1405.0, "28/04/2026": 1404.0, "29/04/2026": 1403.0, "30/04/2026": 1402.0, "01/05/2026": 1401.0, "02/05/2026": 1400.0, "03/05/2026": 1399.0, "04/05/2026": 1398.0, "05/05/2026": 1397.0, "06/05/2026": 1396.0, "07/05/2026": 1395.0, "08/05/2026": 1394.0, "09/05/2026": 1393.0, "10/05/2026": 1392.0, "11/05/2026": 1392.0, "12/05/2026": 1391.0, "13/05/2026": 1390.0, "14/05/2026": 1389.0, "15/05/2026": 1388.0, "16/05/2026": 1387.0, "17/05/2026": 1386.0, "18/05/2026": 1385.0, "24/11/2025": 1470.0, "07/04/2026": 1429.0, "08/04/2026": 1425.0, "09/04/2026": 1422.0, "10/04/2026": 1422.0, "11/04/2026": 1420.0, "12/04/2026": 1412.0, "13/04/2026": 1412.0, "14/04/2026": 1412.0, "15/04/2026": 1412.0, "16/04/2026": 1408.0, "17/04/2026": 1404.0, "18/04/2026": 1404.0, "06/04/2026": 1429.0, "05/04/2026": 1434.0, "04/04/2026": 1434.0, "03/04/2026": 1434.0, "02/04/2026": 1434.0, "01/04/2026": 1434.0, "31/03/2026": 1423.0, "30/03/2026": 1432.0, "29/03/2026": 1428.0, "28/03/2026": 1428.0, "27/03/2026": 1428.0, "26/03/2026": 1399.0, "25/03/2026": 1403.0, "24/03/2026": 1415.0, "23/03/2026": 1415.0, "22/03/2026": 1418.0, "21/03/2026": 1418.0, "20/03/2026": 1418.0, "19/03/2026": 1421.0, "18/03/2026": 1419.0, "17/03/2026": 1417.0, "16/03/2026": 1424.0, "15/03/2026": 1422.0, "14/03/2026": 1422.0, "13/03/2026": 1422.0, "12/03/2026": 1410.0, "11/03/2026": 1413.0, "10/03/2026": 1420.0, "09/03/2026": 1430.0, "08/03/2026": 1436.0, "07/03/2026": 1436.0, "06/03/2026": 1436.0, "05/03/2026": 1433.0, "04/03/2026": 1428.0, "03/03/2026": 1434.0, "02/03/2026": 1418.0, "01/03/2026": 1418.0, "28/02/2026": 1418.0, "27/02/2026": 1418.0, "26/02/2026": 1438.0, "25/02/2026": 1425.0, "24/02/2026": 1403.0, "23/02/2026": 1394.0, "22/02/2026": 1402.0, "21/02/2026": 1402.0, "20/02/2026": 1402.0, "19/02/2026": 1408.0, "18/02/2026": 1412.0, "12/02/2026": 1414.0, "11/02/2026": 1430.0, "30/01/2026": 1460.0, "29/01/2026": 1458.0, "28/01/2026": 1463.0, "27/01/2026": 1463.0, "26/01/2026": 1469.0, "22/01/2026": 1459.0, "21/01/2026": 1468.0, "16/01/2026": 1472.0, "15/01/2026": 1472.0, "13/01/2026": 1487.0, "08/01/2026": 1494.0, "06/01/2026": 1497.0, "30/12/2025": 1481.0, "24/12/2025": 1481.0, "22/12/2025": 1493.0, "19/12/2025": 1494.0, "18/12/2025": 1498.0, "17/12/2025": 1514.0, "16/12/2025": 1504.0, "15/12/2025": 1492.0, "03/12/2025": 1470.0, "26/11/2025": 1487.0, "20/11/2025": 1452.0, "19/11/2025": 1441.0, "17/11/2025": 1448.0, "04/11/2025": 1495.0, "31/10/2025": 1477.0, "02/09/2025": 1365.0, "01/09/2025": 1376.0, "29/08/2025": 1357.0, "28/08/2025": 1344.0, "27/08/2025": 1358.0, "13/08/2025": 1310.0, "08/08/2025": 1332.0, "06/08/2025": 1336.0, "18/07/2025": 1292.0, "17/07/2025": 1280.0, "16/07/2025": 1269.0, "15/07/2025": 1276.0, "14/07/2025": 1295.0, "10/07/2025": 1267.0, "09/07/2025": 1259.0, "08/07/2025": 1259.0, "07/07/2025": 1276.0, "04/07/2025": 1246.0, "30/06/2025": 1211.0, "27/06/2025": 1198.0, "26/06/2025": 1199.0, "25/06/2025": 1196.0, "24/06/2025": 1184.0, "18/06/2025": 1167.0, "22/05/2025": 1143.0, "21/05/2025": 1148.0, "19/05/2025": 1148.0, "12/05/2025": 1141.0, "05/05/2025": 1202.0, "30/04/2025": 1183.0, "22/04/2025": 1140.0, "01/04/2025": 1314.0, "20/03/2025": 1287.0, "19/03/2025": 1286.0, "14/03/2025": 1237.0, "13/03/2025": 1233.0, "12/03/2025": 1229.0, "10/03/2025": 1228.0, "07/03/2025": 1221.0, "06/03/2025": 1237.0, "05/03/2025": 1235.0, "10/02/2025": 1184.0, "28/01/2025": 1161.0, "16/01/2025": 1166.0, "02/01/2025": 1162.0, "25/11/2024": 1077.0, "20/11/2024": 1074.0, "14/11/2024": 1105.0, "11/11/2024": 1131.0, "06/11/2024": 1145.0, "28/10/2024": 1134.0, "25/10/2024": 1141.0, "09/10/2024": 1147.0, "08/10/2024": 1169.0, "09/09/2024": 1226.0, "30/08/2024": 1279.0, "29/08/2024": 1271.0, "20/08/2024": 1287.0, "15/08/2024": 1276.0, "06/08/2024": 1336.0, "24/07/2024": 1337.0, "10/07/2024": 1377.0, "30/05/2024": 1182.0, "16/05/2024": 1062.0, "08/05/2024": 1038.0, "11/04/2024": 994.0, "09/04/2024": 1000.0, "26/03/2024": 1027.0, "01/02/2024": 1250.9, "01/03/2024": 1055.4, "01/06/2026": 1443.1, "01/07/2025": 1233.2, "01/07/2026": 1521.2, "01/08/2024": 1304.8, "01/08/2025": 1366.2, "01/10/2025": 1530.5, "01/11/2024": 1147.3, "01/12/2025": 1479, "02/01/2024": 991.77, "02/02/2024": 1244.3, "02/05/2024": 1069.1, "02/06/2025": 1185.3, "02/06/2026": 1450.7, "02/07/2025": 1238.6, "02/09/2024": 1289.4, "02/10/2024": 1210.8, "02/12/2025": 1481.3, "03/01/2024": 1032.2, "03/01/2025": 1167.1, "03/04/2024": 1001.5, "03/04/2025": 1315.2, "03/06/2026": 1462, "03/07/2024": 1402.5, "03/07/2025": 1238, "03/07/2026": 1532.4, "03/09/2024": 1292.3, "03/10/2024": 1192.5, "04/01/2024": 1047.6, "04/03/2024": 1033.9, "04/04/2024": 997.59, "04/06/2026": 1458.3, "04/07/2024": 1402.5, "04/08/2025": 1355.2, "04/09/2024": 1284.3, "04/09/2025": 1379.9, "04/10/2024": 1187.3, "04/12/2023": 913.0, "04/12/2025": 1473.4, "05/01/2024": 1116.1, "05/03/2024": 1012.8, "05/04/2024": 1004.9, "05/06/2024": 1281.4, "05/06/2025": 1193.6, "05/07/2024": 1397.2, "05/09/2024": 1253.6, "05/09/2025": 1388.6, "05/11/2024": 1150, "05/12/2023": 934.0, "06/01/2025": 1170, "06/02/2024": 1188.6, "06/02/2025": 1187.4, "06/03/2024": 989.32, "06/05/2024": 1064.5, "06/06/2024": 1280, "06/09/2024": 1246.6, "06/10/2025": 1507.9, "06/11/2025": 1481.7, "06/12/2023": 936.0, "07/01/2025": 1172.4, "07/02/2024": 1205.4, "07/02/2025": 1193.4, "07/03/2024": 996.58, "07/05/2024": 1052.2, "07/06/2024": 1283.9, "07/10/2024": 1185.4, "07/10/2025": 1541, "07/11/2024": 1136, "07/12/2023": 986.0, "08/01/2024": 1142.6, "08/02/2024": 1194.7, "08/03/2024": 1006.7, "08/04/2024": 982.9, "08/04/2025": 1373.4, "08/05/2025": 1147.1, "08/07/2024": 1390.4, "08/07/2026": 1531.3, "08/08/2024": 1307.7, "08/09/2025": 1436.5, "09/01/2024": 1160.5, "09/01/2025": 1167.6, "09/02/2024": 1172, "09/04/2025": 1363.8, "09/05/2024": 1048.4, "09/05/2025": 1147.5, "09/08/2024": 1303, "09/10/2025": 1458, "09/12/2024": 1048.5, "09/12/2025": 1472.7, "10/01/2024": 1147.6, "10/04/2025": 1359, "10/05/2024": 1039.8, "10/06/2024": 1272.8, "10/09/2024": 1233.6, "10/09/2025": 1427.7, "10/10/2024": 1131.2, "10/11/2023": 887.0, "10/11/2025": 1459.9, "10/12/2024": 1062.1, "10/12/2025": 1475, "11/01/2024": 1129.2, "11/02/2025": 1182.9, "11/03/2024": 985.03, "11/03/2025": 1229.7, "11/04/2025": 1326.8, "11/06/2026": 1454.2, "11/07/2024": 1399.3, "11/07/2025": 1269, "11/12/2024": 1056.2, "11/12/2025": 1480.8, "12/02/2025": 1186.1, "12/03/2024": 1030.3, "12/04/2024": 1000.6, "12/07/2024": 1417.7, "12/09/2024": 1239, "12/09/2025": 1476, "12/11/2024": 1127.2, "12/11/2025": 1454.7, "12/12/2023": 1011.0, "12/12/2024": 1059, "12/12/2025": 1480.2, "13/01/2025": 1162.5, "13/02/2025": 1187.4, "13/03/2024": 1016.9, "13/05/2024": 1036.3, "13/06/2024": 1244.3, "13/07/2026": 1523.3, "13/08/2024": 1270.4, "13/09/2024": 1225.9, "13/11/2024": 1119.6, "13/12/2023": 1037.0, "14/01/2025": 1162.7, "14/01/2026": 1482.7, "14/02/2024": 1122.6, "14/02/2025": 1185.2, "14/03/2024": 1012.6, "14/05/2024": 1045.4, "14/05/2025": 1139.7, "14/06/2024": 1245.5, "14/10/2024": 1140.1, "14/10/2025": 1474.1, "14/11/2025": 1456.1, "15/01/2024": 1129.6, "15/01/2025": 1162.6, "15/03/2024": 1031.3, "15/04/2024": 1000.6, "15/04/2025": 1255.3, "15/07/2024": 1305.3, "15/10/2024": 1140.2, "15/12/2023": 993.0, "16/01/2024": 1167.5, "16/02/2024": 1064.2, "16/04/2024": 1038.5, "16/04/2025": 1175.4, "16/07/2024": 1279.1, "16/09/2024": 1218.8, "16/10/2024": 1164.9, "17/01/2024": 1226.8, "17/02/2025": 1209.5, "17/03/2025": 1252.7, "17/04/2024": 1030.7, "17/09/2024": 1223.5, "17/10/2024": 1159.6, "17/10/2025": 1542.1, "17/12/2024": 1134.2, "18/01/2024": 1232.1, "18/02/2025": 1204.6, "18/03/2024": 1027.1, "18/04/2024": 1021.6, "18/07/2024": 1316.1, "18/08/2025": 1303.9, "18/11/2025": 1443.6, "18/12/2023": 963.0, "19/01/2024": 1258.8, "19/02/2025": 1198.8, "19/03/2024": 1030.9, "19/04/2024": 1026.3, "19/06/2024": 1276.4, "19/06/2026": 1478.2, "19/07/2024": 1330.4, "19/08/2025": 1299.9, "19/09/2024": 1198.3, "19/12/2023": 964.0, "19/12/2024": 1143.1, "20/02/2024": 1088.1, "20/02/2025": 1199.7, "20/03/2024": 1043.2, "20/05/2024": 1101.7, "20/07/2026": 1514.7, "20/08/2025": 1315, "20/09/2024": 1201.5, "21/01/2025": 1167.2, "21/02/2024": 1071.6, "21/02/2025": 1205.5, "21/04/2025": 1125.6, "21/05/2024": 1173.7, "21/05/2026": 1428.5, "21/07/2025": 1287, "21/07/2026": 1514.7, "21/08/2024": 1295.8, "21/08/2025": 1322.3, "21/10/2024": 1164.9, "21/11/2025": 1473.8, "21/12/2023": 971.0, "22/01/2024": 1241.8, "22/01/2025": 1168.7, "22/02/2024": 1053.9, "22/04/2024": 1017.5, "22/05/2026": 1434.3, "22/06/2026": 1485.8, "22/07/2024": 1335.6, "22/07/2026": 1521.9, "22/08/2024": 1287.8, "22/08/2025": 1331.2, "22/09/2025": 1431.6, "22/10/2024": 1163.7, "22/10/2025": 1598.3, "22/11/2024": 1081.7, "22/12/2023": 954.0, "23/01/2024": 1231.5, "23/01/2025": 1166.4, "23/02/2024": 1076.3, "23/04/2024": 1012.9, "23/04/2025": 1166.5, "23/05/2024": 1233.6, "23/05/2025": 1144.1, "23/06/2025": 1185.4, "23/07/2024": 1325.3, "23/07/2025": 1264.5, "23/08/2024": 1286.6, "23/09/2024": 1204.7, "23/09/2025": 1408.4, "23/10/2024": 1164.9, "23/12/2024": 1155.4, "23/12/2025": 1501.5, "24/02/2025": 1203.6, "24/04/2024": 1015.7, "24/04/2025": 1185.8, "24/07/2025": 1273.2, "24/09/2024": 1203.3, "24/09/2025": 1384, "24/10/2024": 1159.5, "24/10/2025": 1555.2, "25/01/2024": 1230.5, "25/02/2025": 1207.3, "25/03/2024": 1023.1, "25/03/2025": 1295.8, "25/04/2024": 1036.1, "25/04/2025": 1186.3, "25/06/2026": 1501.8, "25/07/2025": 1290.2, "25/08/2025": 1362, "25/09/2024": 1210.3, "25/09/2025": 1381.7, "25/11/2025": 1484.7, "26/01/2024": 1189, "26/02/2024": 1055.1, "26/04/2024": 1036.6, "26/05/2025": 1145.6, "26/05/2026": 1435.9, "26/06/2024": 1333.7, "26/08/2024": 1290.2, "26/09/2024": 1209.6, "26/11/2024": 1078.4, "26/12/2023": 939.0, "26/12/2024": 1175.4, "26/12/2025": 1501.5, "27/01/2025": 1161.2, "27/02/2024": 1047.4, "27/03/2024": 1020.5, "27/08/2024": 1292.6, "27/10/2025": 1449.3, "27/11/2024": 1075.6, "27/12/2023": 932.0, "27/12/2024": 1170.9, "28/02/2024": 1033.3, "28/03/2025": 1304.9, "28/05/2024": 1205, "28/05/2026": 1432.8, "28/08/2024": 1284.9, "28/11/2023": 867.0, "28/12/2023": 950.0, "29/01/2024": 1219.4, "29/01/2025": 1163.4, "29/02/2024": 1031, "29/04/2024": 1039, "29/04/2025": 1173.9, "29/05/2024": 1181.6, "29/05/2025": 1183.8, "29/05/2026": 1434.8, "29/06/2026": 1508.7, "29/07/2024": 1296.8, "29/09/2025": 1452.9, "29/10/2024": 1138.8, "29/11/2023": 838.0, "29/12/2023": 995.0, "30/01/2024": 1198.2, "30/01/2025": 1166.2, "30/04/2024": 1044.7, "30/06/2026": 1519, "30/07/2025": 1324, "30/09/2025": 1503.2, "30/10/2024": 1135.7, "30/10/2025": 1474.7, "30/11/2023": 858.0, "30/12/2024": 1169.5, "31/01/2024": 1177, "31/03/2025": 1319.6, "31/05/2024": 1215.5, "31/07/2024": 1307.7, "31/07/2025": 1363.8, "06/07/2026": 1531.3, "24/06/2026": 1485.8, "23/06/2026": 1485.8, "27/05/2026": 1431.1, "23/01/2026": 1471.9, "07/08/2025": 1332.0, "27/02/2025": 1215.1, "05/02/2025": 1197.5, "04/02/2025": 1186.2, "31/01/2025": 1168.2, "17/01/2025": 1163.8, "18/10/2024": 1161.9, "27/09/2024": 1209.3, "18/09/2024": 1209.4, "19/08/2024": 1292.5, "16/08/2024": 1281.6, "02/08/2024": 1337.1, "30/07/2024": 1265.2, "12/01/2024": 1097.3, "20/12/2023": 947.17, "27/11/2023": 893.78, "16/06/2026": 1456.0, "09/06/2026": 1460.6, "19/05/2026": 1432.3, "09/02/2026": 1440.6, "19/01/2026": 1471.3, "12/01/2026": 1491.0, "28/11/2025": 1482.9, "11/11/2025": 1457.3, "05/11/2025": 1481.0, "03/11/2025": 1501.7, "29/10/2025": 1472.0, "18/09/2025": 1572.7, "17/09/2025": 1497.3, "11/08/2025": 1328.5, "05/08/2025": 1347.3, "29/07/2025": 1293.4, "04/06/2025": 1193.4, "28/05/2025": 1166.7, "15/05/2025": 1144.9, "10/01/2025": 1166.7, "13/12/2024": 1075.6, "02/12/2024": 1069.1, "28/11/2024": 1076.4, "15/11/2024": 1099.3, "08/11/2024": 1130.1, "04/11/2024": 1148.6, "11/09/2024": 1237.8, "03/05/2024": 1076.9, "22/03/2024": 1042.5, "21/03/2024": 1039.4, "19/02/2024": 1112.5, "14/12/2023": 1010.5, "11/12/2023": 997.5, "01/12/2023": 907.67};

function fmtKey(fecha){var p=fecha.split('/');return p[0].padStart(2,'0')+'/'+p[1].padStart(2,'0')+'/'+p[2];}
function getCCL(fecha){return CCL_TABLE[fmtKey(fecha)]||null;}
function getMEP(fecha){return MEP_TABLE[fmtKey(fecha)]||null;}
// Helper: tipo de cambio apropiado según mercado. Bonos/ONs usan MEP (con fallback a CCL), resto usa CCL.
function getTC(fecha, mercado){
  var esBonoON=(mercado==='BONOS'||mercado==='ON'||mercado==='FCI');
  return esBonoON ? (getMEP(fecha)||getCCL(fecha)||MEP_HOY||CCL_HOY) : (getCCL(fecha)||CCL_HOY);
}
var _HOY_KEY=(function(){var d=new Date();return(d.getDate()<10?'0':'')+d.getDate()+'/'+(d.getMonth()<9?'0':'')+(d.getMonth()+1)+'/'+d.getFullYear();})();
// Si hoy no está en la tabla (fin de semana, feriado o todavía no se trajo), se usa el último valor
// cargado — nunca un número fijo viejo, que distorsiona precios de Cedears y el % al P. Venta.
function _tcUltimoValor(T){var hoy=_HOY_KEY.split('/').reverse().join(''),best=null,bk='';
  Object.keys(T||{}).forEach(function(k){var p=k.split('/');if(p.length!==3)return;var kk=p[2]+p[1].padStart(2,'0')+p[0].padStart(2,'0');if(kk<=hoy&&kk>bk&&T[k]>0){bk=kk;best=T[k];}});return best;}
var CCL_HOY=CCL_TABLE[_HOY_KEY]||_tcUltimoValor(CCL_TABLE)||1487;
var MEP_HOY=MEP_TABLE[_HOY_KEY]||_tcUltimoValor(MEP_TABLE)||CCL_HOY;
function tcRefrescarHoy(){
  CCL_HOY=CCL_TABLE[_HOY_KEY]||_tcUltimoValor(CCL_TABLE)||CCL_HOY;
  MEP_HOY=MEP_TABLE[_HOY_KEY]||_tcUltimoValor(MEP_TABLE)||MEP_HOY||CCL_HOY;
}
var BRL_HOY=5.80; // BRL por USD — se actualiza con fetchTopbarRates()
var BRL_TICKERS=new Set([]); // tickers que cotizan en BRL (B3 directo, no NYSE/CEDEAR). BBAS3/PETR3 sacados 2026-09-13: Garo confirmó que los compra en pesos como CEDEAR, no tenencia directa en Brasil.

var movimientos = [];
var quotes = {};
// Id incremental de la última corrida de fetchAllQuotes(). Cada cotización exitosa se estampa
// con el runId vigente al momento de guardarse — renderPortfolio compara contra el runId actual
// para saber si ese precio se refrescó en el último intento o quedó "viejo" (ver indicador de
// fuente/salud de cotizaciones, badge junto al precio en la tabla de Portafolio).
var _quoteRunId=0;
// Estampa fuente/corrida/hora en una cotización recién guardada — alimenta el indicador de
// salud de cotizaciones (puntito de color junto al precio en la tabla de Portafolio).
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
// Puntito de color junto al precio en Portafolio: de dónde salió la cotización y si se
// refrescó en el último "Actualizar precios" o quedó vieja (stale). No cambia ningún precio
// ni cálculo — es la misma capa informativa que el badge "F" de Próximos Cobros.
function quoteHealthDot(q){
  if(!q||q.price==null||!q.source) return '';
  var stale=q.runId!=null&&q.runId!==_quoteRunId;
  var colorVar=stale?'var(--red)':q.source==='data912'?'var(--accent)':q.source==='yahoo'?'var(--blue)':q.source==='finnhub'?'var(--orange)':'var(--blue)';
  var label=stale?'No se pudo refrescar en el último intento':q.source==='data912'?'Fuente: data912 (primaria)':q.source==='yahoo'?'Fuente: Yahoo Finance (fallback)':q.source==='finnhub'?'Fuente: Finnhub (fallback)':'Fuente: CAFCI / ArgentinaDatos';
  var age=q.ts?_quoteAgeTxt(q.ts):'';
  var title=label+(age?' — '+(stale?'último precio conocido '+age:'actualizado '+age):'');
  return '<span class="qhelp" style="width:6px;height:6px;border-radius:50%;margin-left:5px;vertical-align:middle;background:'+colorVar+(stale?';animation:pulse 1.4s infinite':'')+'"><span class="qhelp-tip">'+title.replace(/</g,'&lt;')+'</span></span>';
}
var RSI_CACHE = {}; // ticker -> {value, ts}. RSI(14) diario, no aplica a bonos/ONs
var TIR_CACHE = {}; // ticker -> {value, ts}. TIR% desde EcoValores, solo Bonos (cobertura parcial, no cubre ONs)

var PRELOADED = [];

var RATIOS_TABLE = {"BBAR":3.0,"EWZ":2.0,"ETHA":5.0,"ABT":4.0,"HWM":1.0,"AEG":1.0,"MO":4.0,"AEM":6.0,"AMX":1.0,"AXP":15.0,"AIG":5.0,"AMGN":30.0,"ADI":15.0,"AAPL":20.0,"AMAT":5.0,"T":3.0,"ADP":6.0,"AVY":18.0,"CAR":26.0,"AZN":2.0,"BBVA":1.0,"BBD":1.0,"BSBR":1.0,"BAC":4.0,"BCS":1.0,"B":2.0,"BAS GR":2.0,"BAYN GR":3.0,"BHP":2.0,"BA":24.0,"BP":5.0,"BMY":3.0,"BG":5.0,"CAH":3.0,"CAT":20.0,"CX":1.0,"CVX":16.0,"CSCO":5.0,"C":3.0,"KO":5.0,"KOF":2.0,"CDE":1.0,"CL":3.0,"VALE":2.0,"GLW":4.0,"COST":48.0,"MBG GR":4.0,"DE":40.0,"DTEA GR":3.0,"DEO":6.0,"DIS":12.0,"DD":5.0,"EBAY":2.0,"EOAN GR":6.0,"LLY":56.0,"E":4.0,"XOM":10.0,"FNMA":1.0,"FDX":10.0,"FSLR":18.0,"FMX":6.0,"ORANY":1.0,"FMCC":1.0,"FCX":3.0,"GE":8.0,"GSK":4.0,"GFI":1.0,"GOOGL":58.0,"PAC":16.0,"ASR":20.0,"TV":3.0,"BSN GR":20.0,"HOG":3.0,"HMY":1.0,"HDB":2.0,"HL":1.0,"HPQ":1.0,"HMC":1.0,"HHPD LI":2.0,"HON":8.0,"HSBC":2.0,"IBM":15.0,"IBN":1.0,"INFY":1.0,"ING":3.0,"INTC":5.0,"IFF":12.0,"IP":4.0,"JPM":15.0,"JNJ":15.0,"KMB":6.0,"KGC":1.0,"KB":2.0,"KEP":1.0,"LVS":2.0,"LYG":2.0,"ERIC":2.0,"LMT":20.0,"MRSH":16.0,"MCD":24.0,"MDT":4.0,"MELI":120.0,"MRK":5.0,"MSFT":30.0,"MMM":10.0,"MUFG":1.0,"MFG":1.0,"MBT":2.0,"MSI":20.0,"NGG":2.0,"NEC1 GR":1.0,"NEM":3.0,"NKE":12.0,"NSANY":1.0,"NOK":1.0,"NMR":1.0,"NVS":4.0,"NUE":16.0,"OGZD":2.0,"LKOD":4.0,"ATAD":4.0,"NLMK LI":2.1,"ORCL":3.1,"PCAR":3.0,"PSO":1.0,"PEP":18.0,"PFE":4.0,"PHG":5.0,"PBI":1.0,"PKX":3.0,"PG":15.0,"QCOM":11.0,"BB":3.0,"RIO":8.0,"SHEL":2.0,"SMSN LI":14.0,"SAP":6.0,"SLB":3.0,"SIEGY":3.0,"SNA":6.0,"SONY":8.0,"SCCO":2.0,"SBUX":12.0,"SYY":8.0,"TSM":9.0,"TIIAY":1.0,"TELFY":8.0,"TX":4.0,"TXN":5.0,"BK":2.0,"HSY":21.0,"HD":32.0,"TTE":3.0,"TM":15.0,"TRV":6.0,"JCI":2.0,"USB":5.0,"UL":3.0,"RTX":5.0,"VZ":4.0,"VOD":1.0,"WMT":18.0,"WFC":5.0,"AABA":3.0,"YZCAY":2.0,"META":24.0,"AMZN":144.0,"NVDA":24.0,"ADBE":44.0,"BIIB":13.0,"GILD":4.0,"NFLX":48.0,"TMO":22.0,"PYPL":8.0,"CRM":18.0,"TSLA":15.0,"AMD":10.0,"NG":1.0,"TRIP":2.0,"ANF":1.0,"URBN":2.0,"GRMN":3.0,"SNAP":1.0,"VRSN":6.0,"XRX":1.0,"YELP":2.0,"ROST":4.0,"TGT":24.0,"GS":13.0,"V":18.0,"ARCO":1.0,"AGRO":1.0,"GLOB":18.0,"BABA":9.0,"BIDU":11.0,"ABEV":3.0,"VIV":1.0,"JD":4.0,"NTES":14.0,"TCOM":2.0,"JOYY":5.0,"GGB":1.0,"CBD":1.0,"SBS":1.0,"WB":6.0,"ITUB":1.0,"ERJ":1.0,"UGP":1.0,"SUZ":1.0,"AXIA":1.0,"ELPC":1.0,"TIMB":1.0,"SID":0.125,"TS":1.0,"SAN":1.0,"PBR":1.0,"VIST":3.0,"ABBV":10.0,"BRK/B":22.0,"BIOX":1.0,"AVGO":39.0,"CAAP":1.0,"DOCU":22.0,"ETSY":16.0,"GPRK":1.0,"HAL":2.0,"MA":33.0,"PAAS":3.0,"PSX":6.0,"UNP":20.0,"UNH":33.0,"ZM":47.0,"EFX":16.0,"XYZ":20.0,"SHOP":107.0,"SPOT":28.0,"SNOW":30.0,"TWLO":36.0,"COIN":27.0,"SPGI":45.0,"AAL":2.0,"LRCX":56.0,"EA":14.0,"XP":4.0,"GM":6.0,"DOW":6.0,"AKO.B":1.0,"NIO":4.0,"SE":32.0,"ADS":22.0,"LND":1.0,"BAK":2.0,"AAP":14.0,"LAC":1.0,"MRVL":14.0,"MUX":2.0,"NU":2.0,"PAGS":3.0,"PLTR":3.0,"SHPW":1.0,"STNE":3.0,"SDA":2.0,"PM":18.0,"CVS":15.0,"MDLZ":15.0,"DAL":8.0,"CCL":3.0,"ACN":75.0,"SCHW":13.0,"MRNA":19.0,"STLA":5.0,"BKNG":700.0,"TMUS":33.0,"SPCE":1.0,"RIOT":3.0,"ROKU":13.0,"RACE":83.0,"SWKS":21.0,"PINS":7.0,"BKR":7.0,"DHR":54.0,"GT":2.0,"ISRG":90.0,"LAR":1.0,"NXE":1.0,"ORLY":222.0,"TJX":22.0,"EQNR":6.0,"ARM":27.0,"IBIT":10.0,"RBLX":2.0,"FXI":5.0,"IEUR":11.0,"IBB":27.0,"VEA":10.0,"IVE":40.0,"IVW":20.0,"XLC":19.0,"XLY":43.0,"XLB":18.0,"XLI":28.0,"XLK":46.0,"XLV":29.0,"XLP":16.0,"XLRE":9.0,"IJH":12.0,"EWJ":14.0,"SLV":6.0,"PSQ":8.0,"VIG":39.0,"PDD":25.0,"XPEV":4.0,"ASML":146.0,"TEAM":47.0,"AI":5.0,"CLS":20.0,"CEG":45.0,"DECK":25.1,"RGTI":2.0,"NOW":172.0,"TEM":12.0,"PATH":2.0,"VRTX":101.0,"VST":26.0,"USO":15.0,"EFA":18.0,"IEMG":12.0,"ACWI":26.0,"GDX":10.0,"IWDA":24.0,"SPHQ":14.0,"HOOD":29.0,"CRWV":27.0,"OKLO":28.0,"RKLB":12.0,"ALAB":44.0,"ASTS":15.1,"IREN":12.0,"ECL":56.0,"DJNJ3-XD004":1.0,"BMNR":8.0,"BX":30.0,"COPX":14.0,"ILF":6.0,"ESGU":30.0,"IVV":692.0,"CRWD":79.0,"ANET":29.0,"O":13.0,"GLNG":10.0,"SNDK":170.0,"NBIS":27.0,"HIMS":4.0,"ONDS":2.0,"COP":25.0,"NEE":19.0,"MP":10.0,"CCJ":23.0,"FISV":11.0,"BC37D":1,"BB37D":1,"BB37":1,"CUAP":1,"DICP":1,"ERF25":1,"GD29":1,"GD38":1,"GD41":1,"PARP":1,"PBY26":1,"SA24D":1,"TVPA":1,"TX31":1,"TZXM7":1,"TZXS7":1,"TZXS8":1,"CLSIO":1,"LECAO":1,"LECHO":1,"MR36O":1,"MRCAO":1,"MRCPO":1,"MRCZO":1,"SNEAO":1,"TZV26":1,"TZV27":1,"A3":1,"BHIP":1,"BOLT":1,"CADO":1,"CAPX":1,"CARC":1,"CECO2":1,"CELU":1,"COME":1,"CTIO":1,"DGCE":1,"EDN":1,"FERR":1,"FIPL":1,"HARG":1,"LONG":1,"METR":1,"MIRG":1,"MOLI":1,"OEST":1,"PATA":1,"TXAR":1,"UBER":2,"UPST":5,"URA":5};
var RATIOS_META = {"ABT":{"nombre":"ABBOTT LABORATORIES","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"HWM":{"nombre":"HOWMET AEROSPACE INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Industrial"},"AEG":{"nombre":"AEGON LTD NPV","mercado":"NYSE","pais":"Paises Bajos","rubro":"Financial"},"MO":{"nombre":"ALTRIA GROUP, INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"AEM":{"nombre":"AGNICO EAGLE MINES LIMITED","mercado":"NYSE","pais":"Canadá","rubro":"Basic Materials"},"AMX":{"nombre":"AMERICA MOVIL-SPN ADR","mercado":"NYSE","pais":"México","rubro":"Communications"},"AXP":{"nombre":"AMERICAN EXPRESS Co.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"AIG":{"nombre":"AMERICAN INTERNATIONAL GROUP INC (AIG)","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"AMGN":{"nombre":"AMGEN INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"ADI":{"nombre":"ANALOG DEVICES INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"AAPL":{"nombre":"APPLE INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"AMAT":{"nombre":"APPLIED MATERIALS INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"T":{"nombre":"AT&T INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Communications"},"ADP":{"nombre":"AUTOMATIC DATA PROCESSING INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"AVY":{"nombre":"AVERY DENNISON CORPORATION","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"CAR":{"nombre":"AVIS BUDGET GROUP INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"AZN":{"nombre":"ASTRAZENECA PLC","mercado":"NYSE","pais":"Reino Unido","rubro":"Consumer"},"BBVA":{"nombre":"BANCO BILBAO VIZCAYA-SP ADR","mercado":"NYSE","pais":"España","rubro":"Financial"},"BBD":{"nombre":"BANCO BRADESCO, S.A.","mercado":"NYSE","pais":"Brasil","rubro":"Financial"},"BSBR":{"nombre":"BANCO SANTANDER (BRASIL) S.A.","mercado":"NYSE","pais":"Brasil","rubro":"Financial"},"BAC":{"nombre":"BANK OF AMERICA CORPORATION","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"BCS":{"nombre":"BARCLAYS BANK plc ADR","mercado":"NYSE","pais":"Reino Unido","rubro":"Financial"},"B":{"nombre":"BARRICK GOLD CORP.","mercado":"NYSE","pais":"Canadá","rubro":"Basic Materials"},"BAS GR":{"nombre":"BASF SE","mercado":"OTC US","pais":"Alemania","rubro":"Basic Materials"},"BAYN GR":{"nombre":"BAYER AG","mercado":"OTC US","pais":"Alemania","rubro":"Consumer"},"BHP":{"nombre":"BHP GROUP LTD","mercado":"NYSE","pais":"Australia","rubro":"Basic Materials"},"BA":{"nombre":"BOEING Co.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Industrial"},"BP":{"nombre":"BP  plc. ADR","mercado":"NYSE","pais":"Reino Unido","rubro":"Energy"},"BMY":{"nombre":"BRISTOL MYERS SQUIBB COMPANY","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"BG":{"nombre":"BUNGE GLOBAL SA NPV","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"CAH":{"nombre":"CARDINAL HEALTH INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"CAT":{"nombre":"CATERPILLAR Inc.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Industrial"},"CX":{"nombre":"CEMEX S.A.B. de C.V. ADR","mercado":"NYSE","pais":"México","rubro":"Industrial"},"CVX":{"nombre":"CHEVRON CORP","mercado":"NYSE","pais":"Estados Unidos","rubro":"Energy"},"CSCO":{"nombre":"CISCO SYSTEMS  Inc.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"C":{"nombre":"CITIGROUP INCORPORATED","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"KO":{"nombre":"COCA COLA Co.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"KOF":{"nombre":"COCA-COLA FEMSA, S.A.B DE CV","mercado":"NYSE","pais":"México","rubro":"Consumer"},"CDE":{"nombre":"COEUR MINING INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Basic Materials"},"CL":{"nombre":"COLGATE PALMOLIVE COMPANY","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"VALE":{"nombre":"VALE S.A.","mercado":"NYSE","pais":"Brasil","rubro":"Basic Materials"},"GLW":{"nombre":"CORNING INCORPORATED","mercado":"NYSE","pais":"Estados Unidos","rubro":"Communications"},"COST":{"nombre":"COSTCO WHOLSALE CORP","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"MBG GR":{"nombre":"MERCEDES-BENZ AG","mercado":"OTC US","pais":"Alemania","rubro":"Consumer"},"DE":{"nombre":"DEERE & COMPANY","mercado":"NYSE","pais":"Estados Unidos","rubro":"Industrial"},"DTEA GR":{"nombre":"DEUTSCHE TELEKOM AG ADR","mercado":"OTC US","pais":"Alemania","rubro":"Communications"},"DEO":{"nombre":"DIAGEO PLC ADR","mercado":"NYSE","pais":"Reino Unido","rubro":"Consumer"},"DIS":{"nombre":"DISNEY COMMON STOCK","mercado":"NYSE","pais":"Estados Unidos","rubro":"Communications"},"DD":{"nombre":"DUPONT DE NOMOURS INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Basic Materials"},"EBAY":{"nombre":"EBAY INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"EOAN GR":{"nombre":"E.ON SE","mercado":"OTC US","pais":"Alemania","rubro":"Utilities"},"LLY":{"nombre":"ELI LILLY AND COMPANY","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"E":{"nombre":"ENI SPA - ADR","mercado":"NYSE","pais":"Italia","rubro":"Energy"},"XOM":{"nombre":"EXXON MOBIL CORPORATION","mercado":"NYSE","pais":"Estados Unidos","rubro":"Energy"},"FNMA":{"nombre":"FED. NATL, MORT - FANNIE MAE","mercado":"OTC US","pais":"Estados Unidos","rubro":"Financial"},"FDX":{"nombre":"FEDEX CORP","mercado":"NYSE","pais":"Estados Unidos","rubro":"Industrial"},"FSLR":{"nombre":"FIRST SOLAR INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Energy"},"FMX":{"nombre":"FOMENTO ECONOMICO MEXICANO - FEMSA ADR","mercado":"NYSE","pais":"México","rubro":"Consumer"},"ORANY":{"nombre":"ORANGE**","mercado":"OTC US","pais":"Francia","rubro":"Communications"},"FMCC":{"nombre":"FREDDIE MAC (FEDERAL HOME LOAN MORTGAGE CORP.)","mercado":"OTC US","pais":"Estados Unidos","rubro":"Financial"},"FCX":{"nombre":"FREEPORT MCMORAN INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Basic Materials"},"GE":{"nombre":"GE AEROSPACE.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Industrial"},"GSK":{"nombre":"GSK plc","mercado":"NYSE","pais":"Reino Unido","rubro":"Consumer"},"GFI":{"nombre":"GOLD FIELDS LTD.","mercado":"NYSE","pais":"Sudáfrica","rubro":"Basic Materials"},"GOOGL":{"nombre":"Alphabet Inc. CL  \"A\"","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"PAC":{"nombre":"GRUPO AEROPORTUARIO DEL PACIFICO, S.A.B. de C.V.","mercado":"NYSE","pais":"México","rubro":"Industrial"},"ASR":{"nombre":"GRUPO AEROPORTUARIO DEL SURESTE , S.A.B. de C.V.","mercado":"NYSE","pais":"México","rubro":"Industrial"},"TV":{"nombre":"GRUPO TELEVISA S.A. ADR","mercado":"NYSE","pais":"México","rubro":"Communications"},"BSN GR":{"nombre":"DANONE","mercado":"OTC US","pais":"Francia","rubro":"Consumer"},"HOG":{"nombre":"HARLEY DAVIDSON INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"HMY":{"nombre":"HARMONY GOLD MINING COMPANY LTD.","mercado":"NYSE","pais":"Sudáfrica","rubro":"Basic Materials"},"HDB":{"nombre":"HDFC BANK LIMITED","mercado":"NYSE","pais":"India","rubro":"Financial"},"HL":{"nombre":"HECLA MINING CO","mercado":"NYSE","pais":"Estados Unidos","rubro":"Basic Materials"},"HPQ":{"nombre":"HP Inc","mercado":"NYSE","pais":"Estados Unidos","rubro":"Technology"},"HMC":{"nombre":"HONDA MOTOR  CO. LTD","mercado":"NYSE","pais":"Japón","rubro":"Consumer"},"HHPD LI":{"nombre":"HON HAI PRECISION INDUSTRY CO. LTD.","mercado":"OTC US","pais":"Taiwan","rubro":"Industrial"},"HON":{"nombre":"HONEYWELL INTERNATIONAL INC. (ex Allied S.)","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Industrial"},"HSBC":{"nombre":"HSBC HOLDINGS plc ADR","mercado":"NYSE","pais":"Reino Unido","rubro":"Financial"},"IBM":{"nombre":"IBM Corp.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Technology"},"IBN":{"nombre":"ICICI BANK LTD","mercado":"NYSE","pais":"India","rubro":"Financial"},"INFY":{"nombre":"INFOSYS LIMITED","mercado":"NYSE","pais":"India","rubro":"Technology"},"ING":{"nombre":"ING Group NV ADR","mercado":"NYSE","pais":"Paises Bajos","rubro":"Financial"},"INTC":{"nombre":"INTEL  Corporation","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"IFF":{"nombre":"INTERNATIONAL FLAVORS & FRAGRANCE INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Basic Materials"},"IP":{"nombre":"INTERNATIONAL PAPER Co.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Basic Materials"},"JPM":{"nombre":"J.P. MORGAN & CHASE Co.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"JNJ":{"nombre":"JOHNSON & JOHNSON","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"KMB":{"nombre":"KIMBERLY CLARK CORPORATION","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"KGC":{"nombre":"KINROSS GOLD CORP.","mercado":"NYSE","pais":"Canadá","rubro":"Basic Materials"},"KB":{"nombre":"KB FINANCIAL GROUP INC.","mercado":"NYSE","pais":"Corea del Sur","rubro":"Financial"},"KEP":{"nombre":"KOREA ELECTRIC POWER CORP.","mercado":"NYSE","pais":"Corea del Sur","rubro":"Utilities"},"LVS":{"nombre":"LAS VEGAS SANDS CORP.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"LYG":{"nombre":"LLOYDS BANKING GROUP plc.","mercado":"NYSE","pais":"Reino Unido","rubro":"Financial"},"ERIC":{"nombre":"LM ERICSSON TELEPHONE Co. ADR","mercado":"NASDAQ GS","pais":"SW","rubro":"Communications"},"LMT":{"nombre":"LOCKHEED MARTIN CORPORATION","mercado":"NYSE","pais":"Estados Unidos","rubro":"Industrial"},"MRSH":{"nombre":"MARSH","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"MCD":{"nombre":"Mc DONALD'S Corp.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"MDT":{"nombre":"MEDTRONIC PLC","mercado":"NYSE","pais":"Irlanda","rubro":"Consumer"},"MELI":{"nombre":"MERCADOLIBRE INC.","mercado":"NASDAQ GS","pais":"UR","rubro":"Communications"},"MRK":{"nombre":"MERCK & Co. Inc.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"MSFT":{"nombre":"MICROSOFT CORPORATION","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"MMM":{"nombre":"3M COMPANY","mercado":"NYSE","pais":"Estados Unidos","rubro":"Industrial"},"MUFG":{"nombre":"MITSUBISHI UFJ FINANCIAL GROUP","mercado":"NYSE","pais":"Japón","rubro":"Financial"},"MFG":{"nombre":"MIZUHO FINANCIAL GROUP","mercado":"NYSE","pais":"Japón","rubro":"Financial"},"MBT":{"nombre":"MOBILE TELESYSTEMS***","mercado":"NYSE","pais":"Rusia","rubro":"Communications"},"MSI":{"nombre":"MOTOROLA SOLUTIONS Inc.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Communications"},"NGG":{"nombre":"NATIONAL GRID PLC-SP  ADR","mercado":"NYSE","pais":"Reino Unido","rubro":"Utilities"},"NEC1 GR":{"nombre":"NEC CORPORATION","mercado":"OTC US","pais":"Japón","rubro":"Technology"},"NEM":{"nombre":"NEWMONT  CORPORATION","mercado":"NYSE","pais":"Estados Unidos","rubro":"Basic Materials"},"NKE":{"nombre":"NIKE Inc.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"NSANY":{"nombre":"NISSAN MOTOR CO.","mercado":"OTC US","pais":"Japón","rubro":"Consumer"},"NOK":{"nombre":"NOKIA CORPORATION ADR","mercado":"NYSE","pais":"Finlandia","rubro":"Communications"},"NMR":{"nombre":"NOMURA HOLDINGS INC.","mercado":"NYSE","pais":"Japón","rubro":"Financial"},"NVS":{"nombre":"NOVARTIS AG - ADR","mercado":"NYSE","pais":"Suiza","rubro":"Consumer"},"NUE":{"nombre":"NUCOR CORPORATION","mercado":"NYSE","pais":"Estados Unidos","rubro":"Basic Materials"},"OGZD":{"nombre":"GAZPROM PJSC***","mercado":"OTC US","pais":"Rusia","rubro":"Energy"},"LKOD":{"nombre":"LUKOIL PJSC**","mercado":"OTC US","pais":"Rusia","rubro":"Energy"},"ATAD":{"nombre":"TATNEFT PAO**","mercado":"OTC US","pais":"Rusia","rubro":"Energy"},"NLMK LI":{"nombre":"NOVOLIPETSK STEEL PJSC**","mercado":"London Intl","pais":"Rusia","rubro":"Basic Materials"},"ORCL":{"nombre":"ORACLE CORPORATION","mercado":"NYSE","pais":"Estados Unidos","rubro":"Technology"},"PCAR":{"nombre":"PACCAR INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"PSO":{"nombre":"PEARSON PLC.","mercado":"NYSE","pais":"Reino Unido","rubro":"Communications"},"PEP":{"nombre":"PEPSICO INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"PFE":{"nombre":"PFIZER INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"PHG":{"nombre":"KONINKLIJKE PHILIPS N.V","mercado":"NYSE","pais":"Paises Bajos","rubro":"Consumer"},"PBI":{"nombre":"PITNEY BOWES INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Technology"},"PKX":{"nombre":"POSCO HOLDINGS INC","mercado":"NYSE","pais":"Corea del Sur","rubro":"Basic Materials"},"PG":{"nombre":"PROCTER & GAMBLE Co.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"QCOM":{"nombre":"QUALCOMM INCORPORATED","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"BB":{"nombre":"BLACKBERRY LIMITED","mercado":"NYSE","pais":"Canadá","rubro":"Technology"},"RIO":{"nombre":"RIO TINTO PLC - ADR","mercado":"NYSE","pais":"Reino Unido","rubro":"Basic Materials"},"SHEL":{"nombre":"SHELL PLC","mercado":"NYSE","pais":"GB","rubro":"Energy"},"SMSN LI":{"nombre":"SAMSUNG ELECTRONICS CO. LTD.","mercado":"OTC US","pais":"Corea del Sur","rubro":"Technology"},"SAP":{"nombre":"SAP SE","mercado":"NYSE","pais":"Alemania","rubro":"Technology"},"SLB":{"nombre":"SLB LTD","mercado":"NYSE","pais":"Estados Unidos","rubro":"Energy"},"SIEGY":{"nombre":"SIEMENS AG ADR","mercado":"OTC US","pais":"Alemania","rubro":"Industrial"},"SNA":{"nombre":"SNAP-ON INCORPORATED","mercado":"NYSE","pais":"Estados Unidos","rubro":"Industrial"},"SONY":{"nombre":"SONY GROUP CORPORATION","mercado":"NYSE","pais":"Japón","rubro":"Consumer"},"SCCO":{"nombre":"SOUTHERN COPPER CORP.","mercado":"NYSE","pais":"Perú","rubro":"Basic Materials"},"SBUX":{"nombre":"STARBUCKS CORPORATION","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"SYY":{"nombre":"SYSCO CORPORATION","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"TSM":{"nombre":"TAIWAN SEMICONDUCTOR MANUFACTURING","mercado":"NYSE","pais":"Taiwán","rubro":"Technology"},"TIIAY":{"nombre":"TELECOM ITALIA SPA ADR","mercado":"OTC US","pais":"Italia","rubro":"Communications"},"TELFY":{"nombre":"TELEFONICA S.A. ADR**","mercado":"NYSE","pais":"España","rubro":"Communications"},"TX":{"nombre":"TERNIUM S.A.","mercado":"NYSE","pais":"Luxemburgo","rubro":"Basic Materials"},"TXN":{"nombre":"TEXAS INSTRUMENTS INCORPORATED","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"BK":{"nombre":"BANK OF NEW YORK MELLON CORP","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"HSY":{"nombre":"THE HERSHEY COMPANY","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"HD":{"nombre":"HOME DEPOT INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer, Cyclical"},"TTE":{"nombre":"TotalEnergies SE - ADR","mercado":"NYSE","pais":"Francia","rubro":"Energy"},"TM":{"nombre":"TOYOTA MOTOR CORPORATION ADR","mercado":"NYSE","pais":"Japón","rubro":"Consumer"},"TRV":{"nombre":"The Travelers Companies, Inc.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"JCI":{"nombre":"JOHNSON CONTROLS INTERNATIONAL","mercado":"NYSE","pais":"Estados Unidos","rubro":"Industrial"},"USB":{"nombre":"U.S. BANCORP","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"UL":{"nombre":"UNILEVER PLC-SPONSORED ADR","mercado":"NYSE","pais":"Reino Unido","rubro":"Consumer"},"RTX":{"nombre":"RTX CORPORATION","mercado":"NYSE","pais":"Estados Unidos","rubro":"Industrial"},"VZ":{"nombre":"VERIZON COMMUNICATIONS INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Communications"},"VOD":{"nombre":"VODAFONE GROUP plc. ADR","mercado":"NASDAQ GS","pais":"Reino Unido","rubro":"Communications"},"WMT":{"nombre":"WALMART Inc.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"WFC":{"nombre":"WELLS FARGO & COMPANY","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"AABA":{"nombre":"ALTABA INC***","mercado":"N/A","pais":"US","rubro":"Financial"},"YZCAY":{"nombre":"YANKUANG ENERGY GROUP CO. LTD.","mercado":"OTC US","pais":"China","rubro":"Energy"},"META":{"nombre":"META PLATFORMS INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"AMZN":{"nombre":"AMAZON.COM, INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"NVDA":{"nombre":"NVIDIA CORPORATION","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"ADBE":{"nombre":"ADOBE SYSTEMS INCORPORATED","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"BIIB":{"nombre":"BIOGEN INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"GILD":{"nombre":"GILEAD SCIENCES, INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"NFLX":{"nombre":"NETFLIX, INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"TMO":{"nombre":"THERMO FISHER SCIENTIFIC INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"PYPL":{"nombre":"PAYPAL HOLDINGS, INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"CRM":{"nombre":"SALESFORCE INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Technology"},"TSLA":{"nombre":"TESLA, INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"AMD":{"nombre":"ADVANCED MICRO DEVICES, INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"NG":{"nombre":"NOVAGOLD RESOURCES INC.","mercado":"NYSEAmerican","pais":"Canadá","rubro":"Basic Materials"},"TRIP":{"nombre":"TRIPADVISOR, INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"ANF":{"nombre":"ABERCROMBIE & FITCH CO.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"URBN":{"nombre":"URBAN OUTFITTERS, INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"GRMN":{"nombre":"GARMIN LTD.","mercado":"NYSE","pais":"Suiza","rubro":"Industrial"},"SNAP":{"nombre":"SNAP INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Communications"},"VRSN":{"nombre":"VERISIGN, INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"XRX":{"nombre":"XEROX HOLDING CORPORATION","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"YELP":{"nombre":"YELP INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Communications"},"ROST":{"nombre":"ROSS STORES, INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"TGT":{"nombre":"TARGET CORPORATION","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"GS":{"nombre":"THE GOLDMAN SACHS GROUP, INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"V":{"nombre":"VISA INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"ARCO":{"nombre":"ARCOS DORADOS HOLDINGS INC.","mercado":"NYSE","pais":"Uruguay","rubro":"Consumer"},"AGRO":{"nombre":"ADECOAGRO S.A.","mercado":"NYSE","pais":"Argentina","rubro":"Consumer"},"GLOB":{"nombre":"GLOBANT S.A.","mercado":"NYSE","pais":"Uruguay","rubro":"Technology"},"BABA":{"nombre":"ALIBABA GROUP HOLDING LIMITED*","mercado":"NYSE","pais":"China","rubro":"Communications"},"BIDU":{"nombre":"BAIDU, INC.","mercado":"NASDAQ GS","pais":"China","rubro":"Communications"},"ABEV":{"nombre":"AMBEV S.A.","mercado":"NYSE","pais":"Brasil","rubro":"Consumer"},"VIV":{"nombre":"TELEFÔNICA BRASIL S.A.","mercado":"NYSE","pais":"Brasil","rubro":"Communications"},"JD":{"nombre":"JD.COM, INC.","mercado":"NASDAQ GS","pais":"China","rubro":"Communications"},"NTES":{"nombre":"NETEASE, INC.","mercado":"NASDAQ GS","pais":"China","rubro":"Technology"},"TCOM":{"nombre":"TRIP.COM Group Ltd.","mercado":"NASDAQ GS","pais":"China","rubro":"Communications"},"JOYY":{"nombre":"JOYY Inc.","mercado":"NASDAQ GS","pais":"China","rubro":"Communications"},"GGB":{"nombre":"GERDAU S.A.","mercado":"NYSE","pais":"Brasil","rubro":"Basic Materials"},"CBD":{"nombre":"COMPANHIA BRASILEIRA DE DISTRIBUIÇÃO**","mercado":"OTC US","pais":"Brasil","rubro":"Consumer"},"SBS":{"nombre":"COMPANHIA DE SANEAMENTO BÁSICO DO ESTADO DE SÃO PAULO–SABESP","mercado":"NYSE","pais":"Brasil","rubro":"Utilities"},"WB":{"nombre":"WEIBO CORPORATION","mercado":"NASDAQ GS","pais":"China","rubro":"Communications"},"ITUB":{"nombre":"ITAÚ UNIBANCO HOLDING S.A.","mercado":"NYSE","pais":"Brasil","rubro":"Financial"},"ERJ":{"nombre":"EMBRAER-EMPRESA BRASILEIRA DE AERONÁUTICA S.A.","mercado":"NYSE","pais":"Brasil","rubro":"Industrial"},"UGP":{"nombre":"ULTRAPAR PARTICIPAÇÕES S.A.","mercado":"NYSE","pais":"Brasil","rubro":"Energy"},"SUZ":{"nombre":"SUZANO SA","mercado":"NYSE","pais":"Brasil","rubro":"Basic Materials"},"AXIA":{"nombre":"CENTRAIS ELÉTRICAS BRASILEIRAS S.A. - ELETROBRÁS","mercado":"NYSE","pais":"Brasil","rubro":"Utilities"},"ELPC":{"nombre":"COMPANHIA PARANAENSE DE ENERGIA-COPEL - PREF","mercado":"NYSE","pais":"Brasil","rubro":"Utilities"},"TIMB":{"nombre":"TIM PARTICIPAÇÕES S.A.","mercado":"NYSE","pais":"Brasil","rubro":"Communications"},"SID":{"nombre":"COMPANHIA SIDERÚRGICA NACIONAL","mercado":"NYSE","pais":"Brasil","rubro":"Basic Materials"},"TS":{"nombre":"TENARIS S.A. (ADS)","mercado":"NYSE","pais":"Luxemburgo","rubro":"Industrial"},"SAN":{"nombre":"BANCO SANTANDER  S.A. (ADR)","mercado":"NYSE","pais":"España","rubro":"Financial"},"PBR":{"nombre":"PETROLEO BRASILEIRO - PETROBRAS (ADR)","mercado":"NYSE","pais":"Brasil","rubro":"Energy"},"VIST":{"nombre":"VISTA ENERGY S.A.B. de C.V (ADS)","mercado":"NYSE","pais":"México","rubro":"Energy"},"ABBV":{"nombre":"ABBVIE INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"BRK/B":{"nombre":"BERKSHIRE HATHAWAY INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"BIOX":{"nombre":"BIOCERES CROP SOLUTIONS CORP","mercado":"NASDAQ GS","pais":"Argentina","rubro":"Consumer"},"AVGO":{"nombre":"BROADCOM INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"CAAP":{"nombre":"CORP AMERICA AIRPORTS SA","mercado":"NYSE","pais":"Argentina","rubro":"Consumer"},"DOCU":{"nombre":"DOCUSIGN INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"ETSY":{"nombre":"ETSY INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"GPRK":{"nombre":"GEOPARK LTD","mercado":"NYSE","pais":"Chile","rubro":"Energy"},"HAL":{"nombre":"HALLIBURTON CO","mercado":"NYSE","pais":"Estados Unidos","rubro":"Energy"},"MA":{"nombre":"MASTERCARD INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"PAAS":{"nombre":"PAN AMERICAN SILVER CORP","mercado":"NYSE","pais":"Canadá","rubro":"Basic Materials"},"PSX":{"nombre":"PHILLIPS 66","mercado":"NYSE","pais":"Estados Unidos","rubro":"Energy"},"UNP":{"nombre":"UNION PACIFIC CORP","mercado":"NYSE","pais":"Estados Unidos","rubro":"Industrial"},"UNH":{"nombre":"UNITEDHEALTH GROUP INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"ZM":{"nombre":"ZOOM COMMUNICATIONS INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"EFX":{"nombre":"EQUIFAX INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"XYZ":{"nombre":"BLOCK, INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer"},"SHOP":{"nombre":"SHOPIFY INC","mercado":"NYSE","pais":"Canadá","rubro":"Communications"},"SPOT":{"nombre":"SPOTIFY TECHNOLOGY SA","mercado":"NYSE","pais":"Suecia","rubro":"Communications"},"SNOW":{"nombre":"SNOWFLAKE INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Technology"},"TWLO":{"nombre":"TWILIO INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Technology"},"COIN":{"nombre":"COINBASE GLOBAL INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Financial"},"SPGI":{"nombre":"S&P GLOBAL INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer, Non-cyclical"},"AAL":{"nombre":"AMERICAN AIRLINES GROUP INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer"},"LRCX":{"nombre":"LAM RESEARCH CORP","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"EA":{"nombre":"ELECTRONIC ARTS INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"XP":{"nombre":"XP INC","mercado":"NASDAQ GS","pais":"Brasil","rubro":"Financial"},"GM":{"nombre":"GENERAL MOTORS CO","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer, Cyclical"},"DOW":{"nombre":"DOW INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Basic Materials"},"AKO.B":{"nombre":"EMBOTELLADORA ANDINA S.A.","mercado":"NYSE","pais":"Chile","rubro":"Consumer, Non-cyclical"},"NIO":{"nombre":"NIO INC","mercado":"NYSE","pais":"China","rubro":"Consumer, Cyclical"},"SE":{"nombre":"SEA LTD","mercado":"NYSE","pais":"Islas Caimán","rubro":"Communications"},"ADS":{"nombre":"ADIDAS AG","mercado":"XETRA","pais":"Alemania","rubro":"Consumer"},"LND":{"nombre":"BRASILAGRO - CO BRASILEIRA DE PROPRIEDADES AGRICOLAS","mercado":"NYSE","pais":"Brasil","rubro":"Basic Materials"},"BAK":{"nombre":"BRASKEM SA","mercado":"NYSE","pais":"Brasil","rubro":"Industrial"},"AAP":{"nombre":"ADVANCE AUTO PARTS INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"LAC":{"nombre":"LITHIUM AMERICAS CORP","mercado":"NYSE","pais":"Canadá","rubro":"Technology"},"MRVL":{"nombre":"MARVELL TECHNOLOGY INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Basic Materials"},"MUX":{"nombre":"MCEWEN  INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Basic Materials"},"NU":{"nombre":"NU HOLDINGS LTD/CAYMAN ISLANDS","mercado":"NYSE","pais":"Reino Unido","rubro":"Consumer, Cyclical"},"PAGS":{"nombre":"PAGSEGURO DIGITAL LTD","mercado":"NYSE","pais":"Reino Unido","rubro":"Technology"},"PLTR":{"nombre":"PALANTIR TECHNOLOGIES INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"SHPW":{"nombre":"SHAPEWAYS HOLDINGS INC***","mercado":"OTC US","pais":"Estados Unidos","rubro":"Communications"},"STNE":{"nombre":"STONECO LTD","mercado":"NASDAQ GS","pais":"Islas Caimán","rubro":"Financial"},"SDA":{"nombre":"SUNCAR TECHNOLOGY GROUP INC","mercado":"NASDAQ CM","pais":"Islas Caimán","rubro":"Consumer, Non-cyclical"},"PM":{"nombre":"PHILIP MORRIS INTERNATIONAL INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer, Non-cyclical"},"CVS":{"nombre":"CVS HEALTH CORP.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer, Non-cyclical"},"MDLZ":{"nombre":"MONDELEZ INTERNATIONAL, INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer, Non-cyclical"},"DAL":{"nombre":"DELTA AIR LINES INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer, Cyclical"},"CCL":{"nombre":"CARNIVAL CORP.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer, Cyclical"},"ACN":{"nombre":"ACCENTURE PLC","mercado":"NYSE","pais":"Irlanda","rubro":"Technology"},"SCHW":{"nombre":"CHARLES SCHWAB CORP.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"MRNA":{"nombre":"MODERNA INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer, Non-cyclical"},"STLA":{"nombre":"STELLANTIS NV","mercado":"NYSE","pais":"Paises Bajos","rubro":"Consumer, Cyclical"},"BKNG":{"nombre":"BOOKING HOLDINGS INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"TMUS":{"nombre":"T-MOBILE US INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"SPCE":{"nombre":"VIRGIN GALACTIC HOLDINGS INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer, Cyclical"},"RIOT":{"nombre":"RIOT PLATFORMS INC.","mercado":"NASDAQ CM","pais":"Estados Unidos","rubro":"Consumer, Non-cyclical"},"ROKU":{"nombre":"ROKU INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"RACE":{"nombre":"FERRARI NV","mercado":"NYSE","pais":"ITALIA","rubro":"Consumer, Cyclical"},"SWKS":{"nombre":"SKYWORKS SOLUTIONS INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"PINS":{"nombre":"PINTEREST INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Communications"},"BKR":{"nombre":"BAKER HUGHES CO.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Energy"},"DHR":{"nombre":"DANAHER CORP.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer, Non-cyclical"},"GT":{"nombre":"GOODYEAR TIRE & RUBBER CO./THE","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer, Cyclical"},"ISRG":{"nombre":"INTUITIVE SURGICAL INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer, Non-cyclical"},"LAR":{"nombre":"LITHIUM ARGENTINA AG.","mercado":"NYSE","pais":"Canadá","rubro":"Basic Materials"},"NXE":{"nombre":"NEXGEN ENERGY LTD","mercado":"NYSE","pais":"Canadá","rubro":"Basic Materials"},"ORLY":{"nombre":"O'REILLY AUTOMOTIVE INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer, Cyclical"},"TJX":{"nombre":"TJX COMPANIES INC./THE","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer, Cyclical"},"EQNR":{"nombre":"EQUINOR ASA","mercado":"NYSE","pais":"NORUEGA","rubro":"Energy"},"ARM":{"nombre":"ARM HOLDINGS PLC","mercado":"NASDAQ GS","pais":"GRAN BRETAÑA","rubro":"Technology"},"IBIT":{"nombre":"ISHARES BITCOIN TRUST","mercado":"NASDAQ GM","pais":"Estados Unidos","rubro":"Funds"},"FXI":{"nombre":"ISHARES CHINA LARGE-CAP ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"IEUR":{"nombre":"iShares Core MSCI Europe ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"IBB":{"nombre":"iShares Nasdaq Biotechnology ETF","mercado":"NASDAQ GM","pais":"Estados Unidos","rubro":"ETF"},"VEA":{"nombre":"Vanguard FTSE Developed Markets ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"IVE":{"nombre":"iShares S&P 500 Value ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"IVW":{"nombre":"iShares S&P 500 Growth ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"XLC":{"nombre":"State Street Communication Services Select Sector SPDR ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"XLY":{"nombre":"State Street Consumer Discretionary Select Sector SPDR ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"XLB":{"nombre":"State Street Materials Select Sector SPDR ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"XLI":{"nombre":"State Street Industrials Select Sector SPDR ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"XLK":{"nombre":"State Street Technology Select Sector SPDR ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"XLV":{"nombre":"State Street Health Care Select Sector SPDR ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"XLP":{"nombre":"State Street Consumer Staples Select Sector SPDR ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"XLRE":{"nombre":"State Street Real Estate Select Sector SPDR ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"IJH":{"nombre":"iShares CORE S&P MID-CAP ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"EWJ":{"nombre":"iShares MSCI JAPAN ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"SLV":{"nombre":"iShares SILVER TRUST","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"PSQ":{"nombre":"PROSHARES SHORT QQQ","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"VIG":{"nombre":"VANGUARD DIVIDEND APPRECIATION","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"PDD":{"nombre":"PDD HOLDINGS INC","mercado":"NASDAQ GS","pais":"Irlanda","rubro":"Communications"},"XPEV":{"nombre":"XPENG INC","mercado":"New York","pais":"China","rubro":"Consumer, Cyclical"},"ASML":{"nombre":"ASML HOLDING NV","mercado":"NASDAQ GS","pais":"Paises Bajos","rubro":"Technology"},"TEAM":{"nombre":"ATLASSIAN CORPORATION","mercado":"NASDAQ GS","pais":"Australia","rubro":"Technology"},"AI":{"nombre":"C3.AI INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Technology"},"CLS":{"nombre":"CELESTICA INC","mercado":"NYSE","pais":"Canada","rubro":"Industrial"},"CEG":{"nombre":"CONSTELLATION ENERGY CORPORATION","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Utilities"},"DECK":{"nombre":"DECKERS OUTDOOR CORPORATION","mercado":"NYSE","pais":"Estados Unidos","rubro":"Consumer, Cyclical"},"RGTI":{"nombre":"RIGETTI COMPUTING INC","mercado":"NASDAQ CM","pais":"Estados Unidos","rubro":"Technology"},"NOW":{"nombre":"SERVICENOW INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Technology"},"TEM":{"nombre":"TEMPUS AI INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"PATH":{"nombre":"UIPATH INC","mercado":"NYSE","pais":"Estados Unidos","rubro":"Technology"},"VRTX":{"nombre":"VERTEX PHARMACEUTICALS INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Consumer, Cyclical"},"VST":{"nombre":"VISTRA CORPORATION","mercado":"NYSE","pais":"Estados Unidos","rubro":"Utilities"},"USO":{"nombre":"United States Oil Fund, LP","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"EFA":{"nombre":"iShares MSCI EAFE ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"IEMG":{"nombre":"iShares Core MSCI Emerging Markets ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"ACWI":{"nombre":"iShares MSCI ACWI ETF","mercado":"NASDAQ GM","pais":"Estados Unidos","rubro":"ETF"},"GDX":{"nombre":"Van Eck Gold Miners ETF/USA","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"IWDA":{"nombre":"iShares Core MSCI World UCITS ETF","mercado":"London Stock Exchange","pais":"Irlanda","rubro":"ETF"},"SPHQ":{"nombre":"Invesco S&P 500 Quality ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"HOOD":{"nombre":"ROBINHOOD MARKETS INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"CRWV":{"nombre":"COREWEAVE INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"OKLO":{"nombre":"OKLO INC","mercado":"New York","pais":"Estados Unidos","rubro":"Utilities"},"RKLB":{"nombre":"ROCKET LAB CORP","mercado":"NASDAQ CM","pais":"Estados Unidos","rubro":"Industrial"},"ALAB":{"nombre":"ASTERA LABS INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"ASTS":{"nombre":"AST SPACEMOBILE INC","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Communications"},"IREN":{"nombre":"IREN LTD","mercado":"NASDAQ GS","pais":"Australia","rubro":"Financial"},"ECL":{"nombre":"ECOLAB INC","mercado":"New York","pais":"Estados Unidos","rubro":"Basic Materials"},"DJNJ3-XD004":{"nombre":"JNJ6.95","mercado":"NYSE","pais":"Estados Unidos","rubro":"Corp"},"BMNR":{"nombre":"BITMINE INMERSION TECHNOLOGIES, INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"BX":{"nombre":"BLACKSTONE INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"COPX":{"nombre":"GLOBAL X COPPER MINERS ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"ILF":{"nombre":"ISHARES LATIN AMERICA 40 ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"ESGU":{"nombre":"ISHARES ESG AWARE MSCI USA ETF","mercado":"NASDAQ GM","pais":"Estados Unidos","rubro":"ETF"},"IVV":{"nombre":"ISHARES CORE S&P 500 ETF","mercado":"NYSE Arca","pais":"Estados Unidos","rubro":"ETF"},"CRWD":{"nombre":"CROWDSTRIKE HOLDINGS, INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"ANET":{"nombre":"ARISTA NETWORKS INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Communications"},"O":{"nombre":"REALTY INCOME CORP.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Financial"},"GLNG":{"nombre":"GOLAR LNG LTD.","mercado":"NASDAQ GS","pais":"Bermuda","rubro":"Energy"},"SNDK":{"nombre":"SANDISK CORPORATION","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"NBIS":{"nombre":"NEBIUS GROUP N.V.","mercado":"NASDAQ GS","pais":"PAÍSES BAJOS","rubro":"Technology"},"HIMS":{"nombre":"HIMS & HERS HEALTH, INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Communications"},"ONDS":{"nombre":"ONDAS HOLDINGS INC.","mercado":"NASDAQ CM","pais":"Estados Unidos","rubro":"Industrial"},"COP":{"nombre":"CONOCOPHILLIPS","mercado":"NYSE","pais":"Estados Unidos","rubro":"Energy"},"NEE":{"nombre":"NEXTERA ENERGY, INC.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Utilities"},"MP":{"nombre":"MP MATERIALS CORP.","mercado":"NYSE","pais":"Estados Unidos","rubro":"Basic Materials"},"CCJ":{"nombre":"CAMECO CORPORATION","mercado":"NYSE","pais":"Canada","rubro":"Basic Materials"},"FISV":{"nombre":"FISERV, INC.","mercado":"NASDAQ GS","pais":"Estados Unidos","rubro":"Technology"},"BC37D":{"nombre":"BC37D","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"CUAP":{"nombre":"CUAP","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"DICP":{"nombre":"DICP","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"ERF25":{"nombre":"ERF25","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"GD29":{"nombre":"GD29","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"GD38":{"nombre":"GD38","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"GD41":{"nombre":"GD41","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"PARP":{"nombre":"PARP","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"PBY26":{"nombre":"PBY26","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"SA24D":{"nombre":"SA24D","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"TVPA":{"nombre":"TVPA","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"TX31":{"nombre":"TX31","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"TZXM7":{"nombre":"TZXM7","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"TZXS7":{"nombre":"TZXS7","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"TZXS8":{"nombre":"TZXS8","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"CLSIO":{"nombre":"CLSIO","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"LECAO":{"nombre":"LECAO","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"LECHO":{"nombre":"LECHO","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"MR36O":{"nombre":"MR36O","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"MRCAO":{"nombre":"MRCAO","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"MRCPO":{"nombre":"MRCPO","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"MRCZO":{"nombre":"MRCZO","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"SNEAO":{"nombre":"SNEAO","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"TZV26":{"nombre":"TZV26","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"TZV27":{"nombre":"TZV27","mercado":"BCBA","pais":"Argentina","rubro":"Corp"},"A3":{"nombre":"A3","mercado":"BCBA","pais":"Argentina","rubro":""},"BHIP":{"nombre":"BHIP","mercado":"BCBA","pais":"Argentina","rubro":""},"BOLT":{"nombre":"BOLT","mercado":"BCBA","pais":"Argentina","rubro":""},"CADO":{"nombre":"CADO","mercado":"BCBA","pais":"Argentina","rubro":""},"CAPX":{"nombre":"CAPX","mercado":"BCBA","pais":"Argentina","rubro":""},"CARC":{"nombre":"CARC","mercado":"BCBA","pais":"Argentina","rubro":""},"CECO2":{"nombre":"CECO2","mercado":"BCBA","pais":"Argentina","rubro":""},"CELU":{"nombre":"CELU","mercado":"BCBA","pais":"Argentina","rubro":""},"COME":{"nombre":"COME","mercado":"BCBA","pais":"Argentina","rubro":""},"CTIO":{"nombre":"CTIO","mercado":"BCBA","pais":"Argentina","rubro":""},"DGCE":{"nombre":"DGCE","mercado":"BCBA","pais":"Argentina","rubro":""},"EDN":{"nombre":"EDN","mercado":"BCBA","pais":"Argentina","rubro":""},"FERR":{"nombre":"FERR","mercado":"BCBA","pais":"Argentina","rubro":""},"FIPL":{"nombre":"FIPL","mercado":"BCBA","pais":"Argentina","rubro":""},"HARG":{"nombre":"HARG","mercado":"BCBA","pais":"Argentina","rubro":""},"LONG":{"nombre":"LONG","mercado":"BCBA","pais":"Argentina","rubro":""},"METR":{"nombre":"METR","mercado":"BCBA","pais":"Argentina","rubro":""},"MIRG":{"nombre":"MIRG","mercado":"BCBA","pais":"Argentina","rubro":""},"MOLI":{"nombre":"MOLI","mercado":"BCBA","pais":"Argentina","rubro":""},"OEST":{"nombre":"OEST","mercado":"BCBA","pais":"Argentina","rubro":""},"PATA":{"nombre":"PATA","mercado":"BCBA","pais":"Argentina","rubro":""},"TXAR":{"nombre":"TXAR","mercado":"BCBA","pais":"Argentina","rubro":""},"UBER":{"nombre":"UBER","mercado":"NYSE","pais":"Estados Unidos","rubro":"Technology"},"UPST":{"nombre":"UPST","mercado":"NYSE","pais":"Estados Unidos","rubro":"Technology"}};
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
  // Fallback: derivar del mercado del movimiento más reciente para este ticker
  for(var _i=movimientos.length-1;_i>=0;_i--){
    var _mv=movimientos[_i];
    if(_mv&&_mv.ticker===ticker&&_mv.mercado){
      return _MKT_TO_SECTOR[_mv.mercado]||'nyse';
    }
  }
  return 'nyse';
}

// Bonos comprados directo en USD (dólar cable "C" o dólares directo "D"): el PPC/valuación ya
// está en dólares, no corresponde convertir vía MEP (ver claude/convenciones.md del proyecto).
// Excepción: BB37D, BC37D y SA24D terminan en "C"/"D" pero son bonos en PESOS — esa letra es
// parte del código del bono, no indica que se haya comprado directo en dólares.
var BONOS_USD_DIRECTO_EXCEPCIONES=new Set(['BB37D','BC37D','SA24D']);
function isBonoUSDDirecto(ticker){
  if(getSector(ticker)!=='bonos')return false;
  if(BONOS_USD_DIRECTO_EXCEPCIONES.has(ticker))return false;
  return /[CD]$/.test(ticker);
}

var FLUJOS_BONOS={
  'BB37D':{moneda:'USD',flujos:[
    {f:'2027-03-01',r:2.94,a:0.0},
    {f:'2027-09-01',r:2.94,a:0.0},
    {f:'2028-03-01',r:2.94,a:0.0},
    {f:'2028-09-01',r:2.94,a:0.75},
    {f:'2029-03-01',r:2.92,a:0.75},
    {f:'2029-09-01',r:2.89,a:0.75},
    {f:'2030-03-01',r:2.87,a:6.15},
    {f:'2030-09-01',r:2.69,a:6.15},
    {f:'2031-03-01',r:2.51,a:6.35},
    {f:'2031-09-01',r:2.32,a:6.35},
    {f:'2032-03-01',r:2.14,a:6.35},
    {f:'2032-09-01',r:1.95,a:6.35},
    {f:'2033-03-01',r:1.76,a:6.35},
    {f:'2033-09-01',r:1.58,a:6.35},
    {f:'2034-03-01',r:1.39,a:5.9},
    {f:'2034-09-01',r:1.22,a:5.9},
    {f:'2035-03-01',r:1.04,a:5.9},
    {f:'2035-09-01',r:0.87,a:5.9},
    {f:'2036-03-01',r:0.7,a:5.9},
    {f:'2036-09-01',r:0.52,a:5.9},
    {f:'2037-03-01',r:0.35,a:5.98},
    {f:'2037-09-01',r:0.18,a:5.97},
  ]},
  'BC37D':{moneda:'USD',flujos:[
    {f:'2027-03-01',r:2.62,a:0.0},
    {f:'2027-09-01',r:2.62,a:0.0},
    {f:'2028-03-01',r:2.62,a:0.0},
    {f:'2028-09-01',r:2.62,a:0.75},
    {f:'2029-03-01',r:2.61,a:0.75},
    {f:'2029-09-01',r:2.59,a:0.75},
    {f:'2030-03-01',r:2.57,a:6.15},
    {f:'2030-09-01',r:2.4,a:6.15},
    {f:'2031-03-01',r:2.24,a:6.35},
    {f:'2031-09-01',r:2.08,a:6.35},
    {f:'2032-03-01',r:1.91,a:6.35},
    {f:'2032-09-01',r:1.74,a:6.35},
    {f:'2033-03-01',r:1.58,a:6.35},
    {f:'2033-09-01',r:1.41,a:6.35},
    {f:'2034-03-01',r:1.24,a:5.9},
    {f:'2034-09-01',r:1.09,a:5.9},
    {f:'2035-03-01',r:0.93,a:5.9},
    {f:'2035-09-01',r:0.78,a:5.9},
    {f:'2036-03-01',r:0.62,a:5.9},
    {f:'2036-09-01',r:0.47,a:5.9},
    {f:'2037-03-01',r:0.31,a:5.98},
    {f:'2037-09-01',r:0.16,a:5.97},
  ]},
  'AO27':{moneda:'USD',flujos:[
    {f:'2026-09-30',r:0.5,a:0.0},
    {f:'2026-10-30',r:0.5,a:0.0},
    {f:'2026-11-30',r:0.5,a:0.0},
    {f:'2026-12-30',r:0.5,a:0.0},
    {f:'2027-01-29',r:0.48,a:0.0},
    {f:'2027-02-26',r:0.45,a:0.0},
    {f:'2027-03-31',r:0.57,a:0.0},
    {f:'2027-04-30',r:0.5,a:0.0},
    {f:'2027-05-31',r:0.5,a:0.0},
    {f:'2027-06-30',r:0.5,a:0.0},
    {f:'2027-07-30',r:0.5,a:0.0},
    {f:'2027-08-31',r:0.5,a:0.0},
    {f:'2027-09-30',r:0.5,a:0.0},
    {f:'2027-10-29',r:0.48,a:100.0},
  ]},
  'AO28':{moneda:'USD',flujos:[
    {f:'2026-09-30',r:0.5,a:0.0},
    {f:'2026-10-30',r:0.5,a:0.0},
    {f:'2026-11-30',r:0.5,a:0.0},
    {f:'2026-12-30',r:0.5,a:0.0},
    {f:'2027-01-29',r:0.48,a:0.0},
    {f:'2027-02-26',r:0.45,a:0.0},
    {f:'2027-03-31',r:0.57,a:0.0},
    {f:'2027-04-30',r:0.5,a:0.0},
    {f:'2027-05-31',r:0.5,a:0.0},
    {f:'2027-06-30',r:0.5,a:0.0},
    {f:'2027-07-30',r:0.5,a:0.0},
    {f:'2027-08-31',r:0.5,a:0.0},
    {f:'2027-09-30',r:0.5,a:0.0},
    {f:'2027-10-29',r:0.48,a:0.0},
    {f:'2027-11-30',r:0.52,a:0.0},
    {f:'2027-12-30',r:0.5,a:0.0},
    {f:'2028-01-31',r:0.5,a:0.0},
    {f:'2028-02-29',r:0.48,a:0.0},
    {f:'2028-03-31',r:0.52,a:0.0},
    {f:'2028-04-28',r:0.47,a:0.0},
    {f:'2028-05-31',r:0.53,a:0.0},
    {f:'2028-06-30',r:0.5,a:0.0},
    {f:'2028-07-31',r:0.5,a:0.0},
    {f:'2028-08-31',r:0.5,a:0.0},
    {f:'2028-09-29',r:0.48,a:0.0},
    {f:'2028-10-31',r:0.52,a:100.0},
  ]},
  'AO29':{moneda:'USD',flujos:[
    {f:'2026-09-30',r:0.5,a:0.0},
    {f:'2026-10-30',r:0.5,a:0.0},
    {f:'2026-11-30',r:0.5,a:0.0},
    {f:'2026-12-30',r:0.5,a:0.0},
    {f:'2027-01-29',r:0.48,a:0.0},
    {f:'2027-02-26',r:0.45,a:0.0},
    {f:'2027-03-31',r:0.57,a:0.0},
    {f:'2027-04-30',r:0.5,a:0.0},
    {f:'2027-05-31',r:0.5,a:0.0},
    {f:'2027-06-30',r:0.5,a:0.0},
    {f:'2027-07-30',r:0.5,a:0.0},
    {f:'2027-08-31',r:0.5,a:0.0},
    {f:'2027-09-30',r:0.5,a:0.0},
    {f:'2027-10-29',r:0.48,a:0.0},
    {f:'2027-11-30',r:0.52,a:0.0},
    {f:'2027-12-30',r:0.5,a:0.0},
    {f:'2028-01-31',r:0.5,a:0.0},
    {f:'2028-02-29',r:0.48,a:0.0},
    {f:'2028-03-31',r:0.52,a:0.0},
    {f:'2028-04-28',r:0.47,a:0.0},
    {f:'2028-05-31',r:0.53,a:0.0},
    {f:'2028-06-30',r:0.5,a:0.0},
    {f:'2028-07-31',r:0.5,a:0.0},
    {f:'2028-08-31',r:0.5,a:0.0},
    {f:'2028-09-29',r:0.48,a:0.0},
    {f:'2028-10-31',r:0.52,a:0.0},
    {f:'2028-11-30',r:0.5,a:0.0},
    {f:'2028-12-29',r:0.48,a:0.0},
    {f:'2029-01-31',r:0.52,a:0.0},
    {f:'2029-02-28',r:0.47,a:0.0},
    {f:'2029-03-28',r:0.5,a:0.0},
    {f:'2029-04-30',r:0.53,a:0.0},
    {f:'2029-05-31',r:0.5,a:0.0},
    {f:'2029-06-29',r:0.48,a:0.0},
    {f:'2029-07-31',r:0.52,a:0.0},
    {f:'2029-08-31',r:0.5,a:0.0},
    {f:'2029-09-28',r:0.47,a:0.0},
    {f:'2029-10-31',r:0.53,a:100.0},
  ]},
  'DICP':{moneda:'ARS',flujos:[
    {f:'2026-12-30',r:1587.96,a:3631.71},
    {f:'2027-06-30',r:1482.1,a:3631.71},
    {f:'2027-12-30',r:1376.24,a:3631.71},
    {f:'2028-06-30',r:1270.37,a:3631.71},
    {f:'2028-12-30',r:1164.51,a:3631.71},
    {f:'2029-06-30',r:1058.64,a:3631.71},
    {f:'2029-12-30',r:952.78,a:3631.71},
    {f:'2030-06-30',r:846.91,a:3631.71},
    {f:'2030-12-30',r:741.05,a:3631.71},
    {f:'2031-06-30',r:635.19,a:3631.71},
    {f:'2031-12-30',r:529.32,a:3631.71},
    {f:'2032-06-30',r:423.46,a:3631.71},
    {f:'2032-12-30',r:317.59,a:3631.71},
    {f:'2033-06-30',r:211.73,a:3631.71},
    {f:'2033-12-30',r:105.86,a:3631.71},
  ]},
  'TX31':{moneda:'ARS',flujos:[
    {f:'2026-11-30',r:22.0,a:0.0},
    {f:'2027-05-30',r:22.0,a:175.99},
    {f:'2027-11-30',r:19.8,a:175.99},
    {f:'2028-05-30',r:17.6,a:175.99},
    {f:'2028-11-30',r:15.4,a:175.99},
    {f:'2029-05-30',r:13.2,a:175.99},
    {f:'2029-11-30',r:11.0,a:175.99},
    {f:'2030-05-30',r:8.8,a:175.99},
    {f:'2030-11-30',r:6.6,a:175.99},
    {f:'2031-05-30',r:4.4,a:175.99},
    {f:'2031-11-30',r:2.2,a:175.99},
  ]},
  'PARP':{moneda:'ARS',flujos:[
    {f:'2026-09-30',r:506.19,a:0.0},
    {f:'2027-03-31',r:506.19,a:0.0},
    {f:'2027-09-30',r:506.19,a:0.0},
    {f:'2028-03-31',r:506.19,a:0.0},
    {f:'2028-09-30',r:506.19,a:0.0},
    {f:'2029-03-31',r:506.19,a:0.0},
    {f:'2029-09-30',r:709.24,a:2859.84},
    {f:'2030-03-31',r:673.78,a:2859.84},
    {f:'2030-09-30',r:638.32,a:2859.84},
    {f:'2031-03-31',r:602.85,a:2859.84},
    {f:'2031-09-30',r:567.39,a:2859.84},
    {f:'2032-03-31',r:531.93,a:2859.84},
    {f:'2032-09-30',r:496.47,a:2859.84},
    {f:'2033-03-31',r:461.01,a:2859.84},
    {f:'2033-09-30',r:425.54,a:2859.84},
    {f:'2034-03-31',r:390.08,a:2859.84},
    {f:'2034-09-30',r:354.62,a:2859.84},
    {f:'2035-03-31',r:319.16,a:2859.84},
    {f:'2035-09-30',r:283.7,a:2859.84},
    {f:'2036-03-31',r:248.23,a:2859.84},
    {f:'2036-09-30',r:212.77,a:2859.84},
    {f:'2037-03-31',r:177.31,a:2859.84},
    {f:'2037-09-30',r:141.85,a:2859.84},
    {f:'2038-03-31',r:106.39,a:2859.84},
    {f:'2038-09-30',r:70.92,a:2859.84},
    {f:'2038-12-31',r:17.73,a:2859.84},
  ]},
  'SNEAO':{moneda:'ARS',flujos:[
    {f:'2027-01-14',r:5177.3,a:0.0},
    {f:'2027-07-14',r:5092.89,a:6418.87},
    {f:'2028-01-14',r:4918.43,a:6418.87},
    {f:'2028-07-14',r:4608.92,a:12837.73},
    {f:'2029-01-14',r:4141.84,a:12837.73},
    {f:'2029-07-14',r:3565.02,a:89864.13},
  ]},
  // MRCAO (ON GEMSA): Garo tiene dudas de que efectivamente pague — se carga el flujo tal cual
  // lo muestra Bull igual, sin "corregir" nada (el total de amortización no da 100 como en los
  // bonos soberanos, es un ON con amortizaciones ya parciales antes de este tramo del flujo).
  'MRCAO':{moneda:'USD',flujos:[
    {f:'2026-12-01',r:1.68,a:10.00},
    {f:'2027-06-01',r:1.19,a:10.00},
    {f:'2027-12-01',r:0.69,a:14.00},
  ]},
  'ERF25':{moneda:'USD',flujos:[
    {f:'2027-02-08',r:1.49,a:9.0},
    {f:'2027-08-08',r:1.11,a:9.0},
    {f:'2028-02-08',r:0.74,a:9.0},
    {f:'2028-08-08',r:0.37,a:9.0},
  ]},
  'PBA27':{moneda:'ARS',flujos:[
    {f:'2026-10-30',r:7.56,a:0.0},
    {f:'2027-01-30',r:7.56,a:0.0},
    {f:'2027-04-30',r:7.4,a:100.0},
  ]},
  'PBA28':{moneda:'ARS',flujos:[
    {f:'2026-10-30',r:5.02,a:0.0},
    {f:'2027-04-30',r:5.02,a:0.0},
    {f:'2027-10-30',r:5.02,a:0.0},
    {f:'2028-04-28',r:4.96,a:111.52},
  ]},
  'DEC2O':{moneda:'USD',flujos:[
    {f:'2027-02-24',r:4.28,a:100.0},
  ]},
  'D30S6':{moneda:'ARS',flujos:[
    {f:'2026-09-30',r:0.0,a:151032.16},
  ]},
  'D31M7':{moneda:'ARS',flujos:[
    {f:'2027-03-31',r:0.0,a:151032.16},
  ]},
  'DNC3O':{moneda:'USD',flujos:[
    {f:'2026-11-22',r:4.92,a:100.0},
  ]},
  'SA24D':{moneda:'USD',flujos:[
    {f:'2026-12-01',r:1.59,a:12.5},
    {f:'2027-06-01',r:1.06,a:12.5},
    {f:'2027-12-01',r:0.53,a:12.5},
  ]},
};
// ── Próximos Cobros: calendario de renta/amortización de bonos y ON ──────
// FLUJOS_BONOS se carga a mano por ticker (fecha, renta y amortización "por
// cada 100 nominales", igual al formato del calculador de flujos de Bull
// Market) — ver claude/flujos_bonos.md en el Project para la fuente de cada
// bono y cómo pedirle a Garo el flujo de uno nuevo que falte.
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
// A diferencia de TIR_CACHE (EcoValores, solo Bonos, cobertura parcial), esto
// calcula la TIR exacta de CUALQUIER ticker con flujo cargado en FLUJOS_BONOS
// (bonos y ON) descontando su cronograma futuro real contra el precio de
// mercado de hoy. XIRR actual/365, sin asumir reinversión de cupones.
// Validado 2026-09-18 contra la planilla de Garo (fuente distinta, con
// actualización online): BB37D 11,77% vs 11,77% (exacto), AO29 10,22% vs
// 10,24% (a la par, la diferencia es sub-decimal por timing del precio).
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
  if(isNaN(flo)||isNaN(fhi)||flo*fhi>0) return null; // sin raíz en el rango esperado (dato raro)
  for(var i=0;i<100;i++){
    var mid=(lo+hi)/2;var fm=_xirrNPV(precio,flujos,hoyUTC,mid);
    if(Math.abs(fm)<1e-9) return mid;
    if(flo*fm<0){hi=mid;fhi=fm;} else {lo=mid;flo=fm;}
  }
  return (lo+hi)/2;
}
// Devuelve {tir, moneda} en % o null si falta cotización o el ticker no tiene
// flujo cargado. Bonos/ON en USD: precio ARS de mercado ÷ MEP_HOY (mismo TC
// que usa el resto del portafolio para estos sectores — ver isBonoUSDDirecto
// y getTC). Bonos en ARS (CER, dólar-linked ya expresado en pesos, etc.): se
// compara el precio ARS directo contra el flujo ARS, sin conversión — el
// resultado queda en términos nominales de pesos, igual que la calculan la
// mayoría de las planillas/calculadoras para bonos peso.
function calcularTIRReal(ticker){
  var tabla=FLUJOS_BONOS[ticker];
  if(!tabla) return null;
  var q=quotes[ticker];
  if(!q||q.price==null) return null;
  var ratio=getRatio(ticker)||1;
  var precio;
  if(tabla.moneda==='USD'){
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
// Recorre las posiciones abiertas de bonos/ON, busca el flujo cargado de cada
// ticker y lo escala por qty/100. No toca ningún cálculo de valuación del
// portafolio — es una capa informativa aparte.
function calcularCalendarioCobros(){
  var hoy=_flujosHoyStr();
  var pos=(typeof getPositionsPrincipal==='function'?getPositionsPrincipal():getPositions()).filter(function(p){return p.qty>0.000001;});
  var items=[],sinFlujo=[];
  pos.forEach(function(p){
    var tabla=FLUJOS_BONOS[p.ticker];
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
// items ya viene ordenado por fecha — agrupa TODOS los que caen el mismo día que el primero.
// Antes "Próximo cobro" mostraba solo cal.items[0] (ej. solo AO27 el 30/09), aunque AO28/AO29/PARP
// paguen ese mismo día — Garo lo reportó viendo que la card solo listaba uno de los cuatro.
function _flujosProximoGrupo(items){
  if(!items.length) return null;
  var fecha=items[0].fecha;
  return {fecha:fecha,items:items.filter(function(it){return it.fecha===fecha;})};
}
// ── Badge "D": estimación de próximo dividendo por historial (solo acciones/CEDEARs) ──────
// A pedido de Garo: en bonos/ON NO se usa (ya tienen el flujo exacto cargado — badge F). En
// acciones/CEDEARs no hay flujo exacto conocido, así que D se muestra SOLO cuando el historial
// sugiere que el próximo pago cae dentro de 30 días (no "alguna vez pagó", como antes).
function _parseFechaDDMMYYYY(s){
  if(!s) return null;
  var p=String(s).split('/');
  if(p.length!==3) return null;
  var d=new Date(p[2]+'-'+p[1].padStart(2,'0')+'-'+p[0].padStart(2,'0')+'T00:00:00');
  return isNaN(d.getTime())?null:d;
}
// Con 2+ pagos históricos usa el intervalo promedio entre ellos; con 1 solo pago asume anual
// (365 días — el patrón más común en ADRs/CEDEARs de pago único). No es un flujo exacto como
// el de los bonos (no existe ese dato para acciones) — es una estimación, por eso D nunca
// muestra monto, a diferencia de F.
function _estimarProximoDividendo(fechasOrdenadas){
  if(!fechasOrdenadas.length) return null;
  var intervaloDias=365;
  if(fechasOrdenadas.length>=2){
    var diffs=[];
    for(var i=1;i<fechasOrdenadas.length;i++) diffs.push((fechasOrdenadas[i]-fechasOrdenadas[i-1])/86400000);
    intervaloDias=diffs.reduce(function(a,b){return a+b;},0)/diffs.length;
    if(intervaloDias<30) intervaloDias=30; // evita estimaciones/loops absurdos con datos sucios
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
    if(sector==='bonos'||sector==='on') return; // ya tienen F — no duplicar con D
    var fechas=registros[ticker].sort(function(a,b){return a-b;});
    var prox=_estimarProximoDividendo(fechas);
    if(prox&&prox<=lim) set.add(ticker);
  });
  return set;
}
// Mapa ticker→próximo evento dentro de 30 días, para el puntito "F" en la tabla de Portafolio.
function _flujosMapaProx30(cal){
  var lim=_flujosFechaLimiteStr(30);
  var map={};
  cal.items.forEach(function(it){
    if(it.fecha<=lim && !map[it.ticker]) map[it.ticker]=it;
  });
  return map;
}
// Card chica al pie de "Portafolio" (Próximo cobro / 30 días / 90 días).
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
// Página completa "Flujos" (Herramientas → Flujos): calendario detallado.
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
  // Normalizar fecha a dd/mm/aaaa
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
  sbSetConfig('ccl_override', CCL_TABLE);
  sbSetConfig('mep_override', MEP_TABLE);
}
function tcLoadPersist(){
  try{
    var sc=localStorage.getItem((PFX+'ccl_override'));
    if(sc) Object.assign(CCL_TABLE,JSON.parse(sc));
    var sm=localStorage.getItem((PFX+'mep_override'));
    if(sm) Object.assign(MEP_TABLE,JSON.parse(sm));
  }catch(e){}
  tcRefrescarHoy();
}
function cardToggle(btn){
  var card=btn.closest('.card');
  var collapsed=card.classList.toggle('card-collapsed');
  btn.textContent=collapsed?'▸':'▾';
  if(card.getAttribute('data-persist')){try{localStorage.setItem(PFX+'col_'+card.id,collapsed?'1':'0');}catch(e){}}
  if(!collapsed&&card.id==='hist-card'&&typeof _histChart!=='undefined'&&_histChart){try{_histChart.resize();}catch(e){}}
}
// Fila superior: Distribución · Evolución · Rendimiento por período, lado a lado y plegables
// (el estado plegado se recuerda por portafolio).
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
  if(id==='tipocambio') tcRender();
  if(btn)btn.classList.add('active');
  if(id==='tracker') initTracker();
  if(id==='dividendos') divPopulateSelect();
  if(id==='movimientos') resetMFechaHoy();
  if(id==='arbitraje') arbRender();
  if(id==='noticias') nwsLoad(false);
  if(id==='flujos') setTimeout(renderFlujosPage, 50);
  if(id==='portafolio'){ setTimeout(renderPortfolio, 50); setTimeout(vsellPopulateSelect, 50); setTimeout(vsellResetFecha, 50); setTimeout(vbuyResetFecha, 50); }
  if(id==='dashboard') setTimeout(renderDashboard, 50);
  if(id==='rubros') renderRubros();
  if(id==='vigilancia') vigRender();
  if(id==='recomendaciones'){ renderPerfilComparacion(); }
  if(id==='ventaestad'){ renderVentaEstadisticas(); }
  if(id==='ventahist'){ renderVentaHistorica(); }
  // Sidebar: colapsado en portafolio, abierto en el resto
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
  // FCI: cuotapartes se cargan como las muestra Adcap (x1000) → dividir para los totales
  if(document.getElementById('m-mkt').value==='FCI')qty=qty/1000;
  document.getElementById('m-precio-usd').value=(ars&&ccl)?(arsCalc*rt/ccl).toFixed(4):'—';
  // Calcular comisión $ y totales
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
  // Bonos/ONs: el usuario ingresa precio por 100 nominales → dividir por 100 para almacenar por nominal
  var precioARS=(mkt==='BONOS'||mkt==='ON')?(precioARSInput/100):precioARSInput;
  // FCI: Adcap muestra cuotapartes x1000 respecto del VCP de CAFCI/ArgentinaDatos → dividir por 1000
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
  // Calcular comisión absoluta: (qty * precioARS * % / 100)
  var comisionAbsoluta=(qty*precioARS*comisionPct/100);
  var finishEl=document.getElementById('m-finish');
  movimientos.push({id:Date.now(),fecha:fecha,tipo:tipo,mercado:mkt,ticker:ticker,qty:qty,precioARS:precioARS,ccl:cclVal,ratio:ratio,precioUSD:precioUSD,comision:comisionAbsoluta,comisionPct:comisionPct,notas:document.getElementById('m-notas').value,finish:finishEl&&finishEl.checked||false,loteMethod:(tipo==='venta'?'promedio':undefined)});
  (function(){var _cs=document.getElementById('m-cartera');if(_cs)movimientos[movimientos.length-1].cartera=_cs.value||'principal';})();
  saveAndRender();
  // Guardar TC del día en tablas si no existe aún — usa cclVal (el valor real usado en ESTE
  // movimiento, ya sea de la tabla o del día en curso), no CCL_HOY/MEP_HOY a secas: si `fecha`
  // es una fecha pasada, CCL_HOY de "hoy" no es el valor correcto para esa fecha.
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
    // Solo tiene punto: si todos los segmentos post-punto tienen exactamente 3 dígitos
    // es separador de miles (ej: "15.478" → 15478, "1.234.567" → 1234567)
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
    // Saltar fila de encabezado (primera columna no empieza con dígito)
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
  var okCount=_impMovRows.filter(function(r){return r.ok;}).length;
  label.textContent=_impMovRows.length+' fila'+((_impMovRows.length!==1)?'s':'')+' · '+okCount+' válida'+(okCount!==1?'s':'')+' para importar'+(_impMovRows.length-okCount?' · '+(_impMovRows.length-okCount)+' con error':'');
  tbody.innerHTML=_impMovRows.map(function(r){
    var statusCell=r.ok
      ?'<span style="color:var(--accent)">✓</span>'
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
    // v may come in already as raw number or as formatted string — normalize
    var raw = typeof v === 'string' ? (parseFloat(v.replace(/\./g,'').replace(/,/g,'.'))||0) : (parseFloat(v)||0);
    localStorage.setItem((PFX+'inv_inicial'), raw);
    sbSetConfig('inv_inicial', raw);
    // actualizar display en metric card
    var disp=document.getElementById('inv-inicial-usd-display');
    if(disp) disp.textContent=raw?'$'+Math.round(raw).toLocaleString('es-AR'):'—';
    // sincronizar campo topbar con formato
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
  var raw = el.value.replace(/\./g,'').replace(/,/g,'.'); // strip dots, normalize comma
  var num = parseFloat(raw);
  if(isNaN(num)){ return; }
  var pos = el.selectionStart;
  var oldLen = el.value.length;
  if(decimals>0){
    el.value = num.toLocaleString('es-AR',{minimumFractionDigits:0,maximumFractionDigits:decimals});
  } else {
    el.value = Math.round(num).toLocaleString('es-AR',{maximumFractionDigits:0});
  }
  // restore cursor position approximately
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
function rvSave(){}
function rvLoad(){}
function rvConfirm(){ renderPortfolio(); perfCalcUpdate(); }
function invConfirm(){
  var v=getRawNum('inv-sidebar-usd');
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

async function loadMarks(){
  try{
    // Intentar cargar desde Supabase
    var d = await sbGetConfig('marks');
    if(d && typeof d === 'object' && !Array.isArray(d)){
      MARKS = d;
      return;
    }
    // Migración: si hay datos en localStorage, migrarlos a Supabase y borrarlos
    var s = localStorage.getItem((PFX+'marks'));
    if(s){
      MARKS = JSON.parse(s);
      await sbSetConfig('marks', MARKS);
      localStorage.removeItem((PFX+'marks'));
      console.log('[marks] migrado de localStorage a Supabase');
    }
  }catch(e){ console.warn('[marks] loadMarks error', e); }
}

async function saveMarks(){
  try{
    await sbSetConfig('marks', MARKS);
  }catch(e){ console.warn('[marks] saveMarks error', e); }
}

function openMarkPopover(ticker, el){
  closeMarkPopover();
  _markPopTicker = ticker;
  var m = MARKS[ticker]||{};
  var pop = document.createElement('div');
  pop.className='mark-popover';
  pop.id='mark-popover';

  // Título
  var title = document.createElement('div');
  title.style.cssText='margin-bottom:6px;font-weight:600;font-size:.8rem';
  title.textContent = ticker;
  pop.appendChild(title);

  // Botones de tipo
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

  // Textarea nota
  var ta = document.createElement('textarea');
  ta.id='mark-note-input';
  ta.placeholder='Nota (opcional)...';
  ta.style.cssText='width:100%;box-sizing:border-box;height:52px;resize:none;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:4px;padding:4px 6px;font-size:.78rem';
  ta.value = m.note||'';
  pop.appendChild(ta);

  // Botones acción
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

  // Posición
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
  if(type){ MARKS[_markPopTicker]={type:type,note:note.trim()}; }
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
      // Primera vez: guardar hash
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
  var btn=document.getElementById('port-eye-btn');
  if(btn)btn.style.color='var(--accent)';
}

function portBlur(){
  _portBlurred=true;
  var c=document.getElementById('port-content');
  if(c)c.classList.add('port-blurred');
  var btn=document.getElementById('port-eye-btn');
  if(btn)btn.style.color='var(--text3)';
}

function portToggleSummary(){
  var el=document.getElementById('port-summary-section');
  var btn=document.getElementById('port-summary-toggle-btn');
  if(!el||!btn) return;
  var collapsed=el.style.display==='none';
  el.style.display=collapsed?'flex':'none';
  btn.textContent=collapsed?'▲ Ocultar resumen':'▼ Mostrar resumen';
  try{localStorage.setItem('port_summary_collapsed',collapsed?'0':'1');}catch(e){}
}
(function(){
  try{
    if(localStorage.getItem('port_summary_collapsed')==='1'){
      var el=document.getElementById('port-summary-section');
      var btn=document.getElementById('port-summary-toggle-btn');
      if(el) el.style.display='none';
      if(btn) btn.textContent='▼ Mostrar resumen';
    }
  }catch(e){}
})();

function portToggleWatchzone(){
  var el=document.getElementById('port-watchzone-section');
  var el2=document.getElementById('port-smallinv-section');
  var btn=document.getElementById('port-watchzone-toggle-btn');
  if(!el||!btn) return;
  var collapsed=el.style.display==='none';
  el.style.display=collapsed?'flex':'none';
  if(el2) el2.style.display=collapsed?'':'none';
  btn.textContent=collapsed?'▲ Ocultar mira':'▼ Mostrar mira';
  try{localStorage.setItem('port_watchzone_collapsed',collapsed?'0':'1');}catch(e){}
}
(function(){
  try{
    if(localStorage.getItem('port_watchzone_collapsed')==='1'){
      var el=document.getElementById('port-watchzone-section');
      var el2=document.getElementById('port-smallinv-section');
      var btn=document.getElementById('port-watchzone-toggle-btn');
      if(el) el.style.display='none';
      if(el2) el2.style.display='none';
      if(btn) btn.textContent='▼ Mostrar mira';
    }
  }catch(e){}
})();

function portToggleBlur(){
  if(!_portBlurred){portBlur();return;}
  // Verificar sesión activa
  var sess=parseInt(localStorage.getItem(PORT_SESSION_KEY)||'0');
  var age=(Date.now()-sess)/1000/3600;
  if(age<PORT_SESSION_HOURS&&localStorage.getItem(PORT_PIN_KEY)){
    portUnblur();
  } else {
    portShowOverlay();
  }
}

loadMarks();
function portCheckSession(){portUnblur();return; // PIN desactivado
  var stored=localStorage.getItem(PORT_PIN_KEY);
  // Actualizar título del overlay según si es primera vez o no
  var titleEl=document.getElementById('port-pin-title');
  if(titleEl) titleEl.textContent = stored ? '🔒 Ingresá tu PIN' : '🔑 Configurá tu PIN';
  if(!stored){portShowOverlay();return;} // Primera vez: configurar PIN
  var sess=parseInt(localStorage.getItem(PORT_SESSION_KEY)||'0');
  var age=(Date.now()-sess)/1000/3600;
  if(age<PORT_SESSION_HOURS){portUnblur();}
  else{portShowOverlay();} // Sesión expirada: pedir PIN
}
// ─────────────────────────────────────────────────────────────────────────

var _gdcInitDone = false;
// Si sbSaveArray falla (red, Supabase caído, etc.) el guardado quedaba SOLO local y en el próximo
// reload initFromSupabase() pisa todo con la versión vieja de Supabase — el movimiento "desaparece".
// Antes esto era silencioso (sbSaveArray traga el error y devuelve false). Ahora se avisa en #lupd.
// Aviso de "no se guardó en la nube": barra roja fija arriba con Reintentar (queda hasta que se guarde).
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
  // Snapshot de "lo que debería estar en la nube" — si sbSaveArrayRetry falla (red caída,
  // pestaña cerrada antes de terminar), este snapshot sobrevive al reload e initFromSupabase()
  // lo usa para no pisar movimientos reales con una versión vieja de Supabase.
  // (Incidente: compra de MO cargada y perdida silenciosamente — 2026-09-01, GDC.)
  try{localStorage.setItem((PFX+'pending_sync'),JSON.stringify(movimientos));}catch(e){}
  if(_gdcInitDone){ sbSaveArrayRetry('movimientos', movimientos).then(function(ok){ if(!ok){ warnSaveFailed('movimientos'); } else { try{localStorage.removeItem((PFX+'pending_sync'));}catch(e){} saveFailClear('movimientos'); } }); }
  else { console.warn('[saveAndRender] init no terminó — skip sbSaveArray (movimientos:'+movimientos.length+')'); }
  renderMovimientos();renderPortfolio();renderDivsCard();vsellPopulateSelect();
  (function(){var _d=document.getElementById('page-dashboard');if(_d&&_d.classList.contains('active'))setTimeout(renderDashboard,80);})();
  document.getElementById('lupd').textContent=new Date().toLocaleTimeString('es-AR');
}

// Estado del modal de edición
var MOV_EDIT_ID = null;
var _movWasFiltered = false; // controla el auto-scroll de renderMovimientos(): sólo salta al header la primera vez que se activa un filtro

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
  // Evento para recalcular USD al cambiar ARS/CCL/ticker
  ['me-ars','me-ccl','me-ticker'].forEach(function(eid){
    var el=document.getElementById(eid);
    if(el)el.addEventListener('input',movModalCalcUSD);
  });
  // Al cambiar mercado: actualizar label (MEP vs CCL) y auto-completar TC según mercado/fecha
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
    // Propagar mercado a todos los movimientos del mismo ticker para que el sector sea consistente
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
  // Calcular comisión absoluta desde porcentaje: (qty * precioARS * % / 100)
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
// SIMULADOR DE VENTA
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
// Mismos campos y mismo motor (lote más barato) que el Simulador de Venta,
// pero ejecuta la venta real: crea el movimiento y actualiza la cartera.
function vsellPopulateSelect(){
  var sel = document.getElementById('vsell-ticker');
  if(!sel) return;
  var current = sel.value;
  var allPos = getPositions(); // una sola pasada por el historial, reusada abajo (antes se llamaba
                                // de nuevo dentro del .map, una vez por ticker)
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

  // Promedio ponderado: se toma directo de getPositions(), que ya deja costUSDpuro/qty
  // netos de toda la historia (compras y ventas previas, sea cual sea el método usado en cada una).
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
// Usa gananciaUSD/gananciaPct/costBasisUSD que getPositions() guarda en cada
// movimiento de venta (tanto ventas legado con promedio ponderado como ventas
// nuevas con lote más barato). U$S = símbolo de dólar usado en toda esta vista.
function vestadTipoTicker(ticker){
  var s=getSector(ticker);
  if(s==='bonos')return 'Bono';
  if(s==='on')return 'ON';
  if(s==='fci')return 'FCI';
  if(s==='argentina')return 'Acción Arg.';
  if(s==='brasil')return 'Brasil';
  if(s==='cripto')return 'Cripto';
  return 'Cedear'; // nyse, europa, china
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
  getPositions(); // fuerza el recálculo/annotate de gananciaUSD en cada venta antes de leer
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
var _ventahistDivs = []; // dividendos/rentas cobradas, persistidos aparte (identifican por ticker corto)
var _ventahistAportes = []; // aportes/retiros de dinero (cuenta corriente pesos), persistidos aparte

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
  return null; // VTTR, COTR, transferencias u otros códigos no se tratan como operación de mercado
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

// Clasifica el activo en Bonos / Argentina / Brasil / Cedear a partir del texto de Especie.
// Se usa solo para el desglose de Estadísticas Venta Histórica (no toca la clasificación real por ticker).
var VHIST_BRASIL_RE=/ITAU|BANCO DO BRASIL|BRADESCO|VALE S\.A|GERDAU|EMBRAER|PETROLEO BRASILEIRO|SIDERURGICA|AMBEV|STONECO|PAGSEGURO|NU HOLDINGS|XP INC|BRASKEM|BRF S\.A|MERC\.?LIB|MSCI BRAZIL/i;
function ventahistClasificarTipo(idRaw,esBonoON){
  if(esBonoON) return 'Bonos';
  if(/^CED/i.test(idRaw)) return VHIST_BRASIL_RE.test(idRaw)?'Brasil':'Cedear';
  return 'Argentina';
}
function ventahistEsBonoON(idRaw){
  return /BONO|BONTE|OBLIGAC|LETRA|LECAP|LECER|BOTE|BOPREAL|VALORES NEGOCIABLES|^ON\s|^L\.\s*T|^LT\s|^B\.\s*TES|^T\.D\./i.test(idRaw);
}
// Activos con split conocido dentro del período cargado: la variación de precio "por split" contamina
// el promedio ponderado y da ganancias/pérdidas ficticias. Se excluyen por completo de la base histórica.
var VHIST_EXCLUIDOS_RE=/^LONGVIE|^CELULOSA|^FERRUM/i;
// Tickers cortos equivalentes (usados en el archivo de Dividendos/Rentas, que identifica por ticker y no por nombre completo).
var VHIST_EXCLUIDOS_TICKERS=new Set(['LONG','CELU','FERR','ECOG']);
function ventahistEstaExcluido(idRaw){
  if(VHIST_EXCLUIDOS_TICKERS.has(String(idRaw||'').trim().toUpperCase())) return true;
  return VHIST_EXCLUIDOS_RE.test(idRaw)||cmpNorm(idRaw).indexOf('ecogas')>=0;
}

// Parsea la matriz de filas (como la devuelve XLSX.utils.sheet_to_json({header:1})).
// Soporta dos formatos:
//  1) Formato simple: Ticker, Fecha, Tipo, Cantidad, Precio, Mercado (opcional)
//  2) Formato de exportación de broker: Especie (nombre completo, no ticker), Operado/Liquida (fechas),
//     Operación (CPRA/VTAS), Cantidad, Importe. En este caso el precio por unidad se calcula como
//     Importe/Cantidad, así no hace falta adivinar si "Precio" viene cada 100 nominales o por unidad.
function ventahistParseRows(rows){
  // Requiere Especie/Ticker Y Cantidad en la misma fila: algunos exports de broker traen una
  // mini-tabla de "filtros aplicados" antes de la tabla real que también menciona "Especie"
  // pero sin columna Cantidad, y no queremos confundirla con el encabezado de datos.
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
  // 1) intenta como Excel/CSV real
  try{
    var wb=XLSX.read(new Uint8Array(ab),{type:'array'});
    for(var i=0;i<wb.SheetNames.length;i++){
      var ws=wb.Sheets[wb.SheetNames[i]];
      var rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
      if(rows.some(function(r){return r.some(function(c){var n=cmpNorm(c);return n==='especie'||n==='ticker';});})) return rows;
    }
  }catch(ex){}
  // 2) fallback: muchos brokers exportan un .xls que en realidad es HTML (ej. Portfolio Personal).
  //    Reusa el mismo parser que ya usa Comparación de Portafolios para el formato viejo de Veta.
  return cmpParseHTML(ab);
}

// ─── Dividendos y Rentas cobradas (archivo separado del broker, identifica por ticker corto) ───
// Formato: Fecha, Cpbt (DIV/RTA/CANJ/RESC), Especie (ticker), Moneda (vacío=USD, "PESOS"=ARS), Divi/renta (monto).
// Solo DIV y RTA se cuentan como ingreso: CANJ es un canje sin movimiento de caja, y RESC es un rescate/
// redención total del bono (devolución de capital, no ganancia) — sumarlo como renta sobreestimaría la ganancia.
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

// Traduce el sector real (getSector, el mismo que usa toda la cartera) a los 4 baldes de este desglose.
function vhistSectorToTipo(sector){
  if(sector==='bonos'||sector==='on') return 'Bonos';
  if(sector==='argentina') return 'Argentina';
  if(sector==='brasil') return 'Brasil';
  return 'Cedear';
}

// Convierte cada cobro de dividendo/renta a USD y lo clasifica, usando getSector real (ticker corto → sector).
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
      usd=r.monto; // ya viene en USD
    }
    var anio=parseInt((r.fecha.split('/')[2])||'0',10);
    return {ticker:r.ticker,fecha:r.fecha,anio:anio,tipoActivo:tipoActivo,usd:usd};
  });
}

function ventahistResetFecha(){
  var el=document.getElementById('vhist-add-fecha');
  if(el){el.value=_hoyLocalISO();el.dataset.auto=el.value;fechaMarcar(el);}
}

// Persiste la base histórica (localStorage + Supabase), igual patrón que ccl_override/mep_override.
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

// Agrega un movimiento nuevo a mano, sin tener que resubir el Excel entero.
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

// Persiste los dividendos/rentas cobrados (mismo patrón que vhistPersist).
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
// Formato: Liquida/Operado, Operación, Especie, Cantidad, Precio, Importe, Saldo, Referencia.
// Señal confiable: el CÓDIGO de Operación (no el texto de Referencia, que es inconsistente:
// "TRF VALO A ICBC" contiene "TRF" pero es un retiro). PAGO = retiro (Importe siempre negativo),
// COBR = aporte (Importe siempre positivo). El resto de los códigos (CCTE/CCCD, COTR/VTTR, TCCD/TOCT,
// ARAN/ARPF, DECU, DEIN/NCIN, NOCR, DEME, CPRA/VTAS, etc.) son transferencias internas, comisiones,
// retenciones o los movimientos de mercado ya cubiertos por el archivo de compras/ventas — se ignoran.
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

// Convierte cada aporte/retiro a USD con el MEP del día (mismo criterio que bonos/ON: la plata
// entra/sale de la cuenta en pesos y se dolariza al tipo de cambio implícito de ese día).
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

// Capital neto acumulado (aportes-retiros) al cierre de cada año, en USD. Sparse: solo tiene entrada
// para años con al menos un movimiento; los años sin movimiento se resuelven arrastrando el último
// valor conocido (ver vhistDenseYearMap).
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

// Capital en cartera A COSTO (posiciones abiertas) por grupo (Tipo o RF/RV), al cierre de cada año.
// Mismo motor de promedio ponderado que calcularVentaHistorica, pero acumulando por grupo en vez de
// por ticker, y snapshotenado en cada corte de año calendario. Las ventas sin compra registrada (activos
// que ya se tenían antes del rango del archivo, ver ⚠️ en "Por Ticker") no restan capital de ningún
// grupo porque no hay costo base que restarles — quedan afuera del cálculo, tal como se pidió.
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

// Arrastra hacia adelante el último valor conocido para cubrir sin huecos el rango [minY,maxY].
// isObj=true para snapshots {grupo:valor} (vhistCapitalPorGrupoAnio), false para números sueltos
// (vhistCapitalSnapshotsAportes).
function vhistDenseYearMap(snapshots,minY,maxY,isObj){
  var dense={}, last=isObj?{}:0;
  for(var y=minY;y<=maxY;y++){
    if(snapshots[y]!==undefined) last=isObj?Object.assign({},snapshots[y]):snapshots[y];
    dense[y]=isObj?Object.assign({},last):last;
  }
  return dense;
}

// Reemplaza el "costo" de una matriz de vhistBuildMatrix por el capital promedio (inicio/fin de año)
// de cada grupo, para que vhistRenderMatrix calcule el % de ganancia sobre capital invertido en vez de
// sobre costo-base-de-lo-vendido-ese-año (que se infla con la rotación de cartera).
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
  var ventas=[]; // log de cada operación de venta individual, para desgloses por tipo/año
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
    // Bonos/ON: siempre MEP (sin caer a CCL); resto: CCL. Solo se usa el valor de HOY si falta directamente en la tabla.
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

// Arma la matriz {years, groups:{label:{perYear:{año:{cost,gan}}, totalCost, totalGan}}} a partir del log de ventas.
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

// Renderiza la matriz como tabla: filas=grupo (según rowOrder), columnas=años + Total.
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

// Ganancia total por año calendario (todos los tipos combinados), como fila de métricas.
// Si se pasa capSnapshotsAportes (aportes-retiros acumulados, ver vhistCapitalSnapshotsAportes), el %
// se calcula contra el capital promedio invertido ese año (inicio/fin) en vez del costo-base-de-lo-vendido
// (que compara mal: infla el % cuando hay mucha rotación de cartera dentro del año). Sin esa base
// (todavía no se subió el archivo de Movimientos de Pesos) cae al cálculo anterior.
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

// Tabla compacta de dividendos/rentas por ticker corto (no se puede mergear con la tabla por Especie
// descriptiva de arriba porque son dos sistemas de identificación distintos).
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

  // Los dividendos/rentas se suman como "ganancia" sin costo asociado (costBasis=0), así entran en los
  // mismos baldes de año/tipo/RF-RV que las ventas, sin tocar la tabla por Ticker (que usa Especie descriptiva).
  var ventasConDivs=ventas.concat(divEventos.map(function(d){
    return {ticker:d.ticker,fecha:d.fecha,anio:d.anio,tipoActivo:d.tipoActivo,gananciaUSD:d.usd,costBasis:0};
  }));

  // Capital invertido: para el total se usa la plata real que entró/salió de la cuenta (aportes-retiros,
  // ver ⚙️ tarjeta "Aportes y Retiros"); para Tipo/RF-RV (que no se puede prorratear desde los aportes,
  // porque un depósito no dice a qué activo va) se usa el capital en cartera a costo de cada grupo.
  // Las ventas sin compra registrada (activos ya tenidos antes del archivo) no entran en ninguno de los
  // dos cálculos porque no tienen costo base que restar/sumar — quedan afuera, tal como se pidió.
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

// Guarda `valor` en CCL_TABLE o MEP_TABLE (según esBonoON) para `fecha`, solo si esa fecha
// todavía no está en la tabla — nunca pisa un valor ya cargado. Persiste en localStorage +
// Supabase (config), igual que el resto de los overrides de TC. La llaman addMov/
// vbuyConfirmar/vsellConfirmar justo después de cargar el movimiento, para que la tabla
// histórica se autocomplete con el CCL/MEP que el usuario ya vio/tipeó en cada operación —
// antes solo addMov() lo hacía (y encima con el CCL_HOY de "hoy" en vez del valor real de la
// fecha del movimiento), así que todo lo cargado desde el módulo rápido de Comprar/Vender
// nunca completaba la tabla, y esas fechas quedaban con el ⚠ para siempre (reportado por Garo
// 2026-09-18: ~30 fechas de jul-sep/2026, todas "Cargado/Vendido desde módulo rápido").
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
  sbSetConfig('ccl_override',CCL_TABLE);
  sbSetConfig('mep_override',MEP_TABLE);
}
// Backfill: recorre TODOS los movimientos ya cargados y completa los huecos de CCL_TABLE/
// MEP_TABLE con lo que cada uno ya tiene guardado en m.ccl (promedio si un mismo día hay
// varios movimientos con el mismo valor o valores parecidos — el dólar se mueve un poco
// durante el día, es normal). No pisa ninguna fecha que ya esté en la tabla.
// Si un día tiene valores MUY dispares entre sí (más de BACKFILL_DISPERSION_MAX de diferencia
// entre el mínimo y el máximo — ej. 09/09/2026: TX31 cargado con 1487 vs el resto ~1525-1531,
// un solo movimiento con el CCL/MEP mal tipeado) NO se promedia a ciegas: se deja esa fecha
// sin completar y se reporta aparte, para que la carga a mano después de revisar cuál de los
// valores está mal (caso real reportado por Garo 2026-09-18, MEP correcto de esa fecha: 1531).
var BACKFILL_DISPERSION_MAX = 15; // diferencia absoluta máxima entre min y max de un mismo día
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
      if(tabla[fk]) return; // ya está cargada, no tocar
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
    sbSetConfig('ccl_override',CCL_TABLE);
    sbSetConfig('mep_override',MEP_TABLE);
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
  
  // Guardar valores actuales de filtros y elemento con focus
  var currentFilterVal=(filterEl?(filterEl.value||'').trim().toUpperCase():'');
  var filterTipo=(document.getElementById('mov-filter-tipo')||{value:''}).value.toLowerCase();
  var filterMkt=(document.getElementById('mov-filter-mkt')||{value:''}).value.toUpperCase();
  var filterFecha=(document.getElementById('mov-filter-fecha')||{value:''}).value.trim();
  var filterNotas=(document.getElementById('mov-filter-notas')||{value:''}).value.trim().toLowerCase();
  var filterNoCCL=(document.getElementById('mov-filter-noccl')||{checked:false}).checked;
  var filterNoMEP=(document.getElementById('mov-filter-nomep')||{checked:false}).checked;
  var activeFocusId=document.activeElement?document.activeElement.id:null;

  var filterVal=currentFilterVal;

  var lista=movimientos.slice().sort(function(a,b){var fa=(a.fecha||'').split('/'),fb=(b.fecha||'').split('/');var da=fa.length===3?fa[2]+fa[1]+fa[0]:'0',db=fb.length===3?fb[2]+fb[1]+fb[0]:'0';return db.localeCompare(da);});
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
  // Sin CCL en tabla: sólo mercados que NO usan MEP (bonos/ON/FCI usan MEP — ver filtro de abajo)
  if(filterNoCCL) lista=lista.filter(function(m){
    if(m.tipo!=='compra'&&m.tipo!=='venta')return false;
    var usaMep=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI');
    if(usaMep)return false;
    return !getCCL(m.fecha);
  });
  // Sin MEP en tabla: bonos/ON/FCI. Chequea el MEP puntual, aunque haya caído a CCL como aproximación
  if(filterNoMEP) lista=lista.filter(function(m){
    if(m.tipo!=='compra'&&m.tipo!=='venta')return false;
    var usaMep=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI');
    if(!usaMep)return false;
    return !getMEP(m.fecha);
  });

  var anyFilter=filterVal||filterTipo||filterMkt||filterFecha||filterNotas||filterCartera||filterNoCCL||filterNoMEP;
  document.getElementById('mov-count').textContent=movimientos.length+(anyFilter?' ('+lista.length+' filtrados)':'');
  // Mostrar/ocultar botón "Borrar ticker" solo cuando hay filtro exacto de ticker
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
    // CCL/MEP efectivo: la tabla histórica tiene prioridad sobre el valor guardado
    var _mEsBonoON=(m.mercado==='BONOS'||m.mercado==='ON');
    var _mEsFci=(m.mercado==='FCI');
    var _mEsARS=(m.mercado==='ARGENTINA'||_mEsBonoON||_mEsFci);
    var _mUsaMep=(_mEsBonoON||_mEsFci);
    var _mMepTabla=_mUsaMep?getMEP(m.fecha):null;
    var _mCclTabla=getCCL(m.fecha);
    var _mTcTabla=_mUsaMep?(_mMepTabla||_mCclTabla):_mCclTabla;
    var _mTcEfectivo=_mTcTabla||m.ccl||null;
    // precioUSD: para mercados ARS recalcular desde precioARS/tc_tabla; para USD usar el guardado
    var _mPrecioUSD=(_mEsARS&&(m.precioARS||0)>0&&_mTcEfectivo>0)
      ?(m.precioARS/_mTcEfectivo)
      :(m.precioUSD||null);
    // Alertas sobre la fuente del TC: bonos/ON/FCI sin MEP puntual (⚠MEP — puede haber caído a CCL como aproximación) vs resto sin CCL puntual (⚠ rojo)
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
      '<td style="font-weight:600">'+m.ticker+((m.cartera==='cocos')?' <span style="font-size:.55rem;font-weight:600;padding:1px 5px;border-radius:8px;background:#2a1650;color:#c9a6ff;border:1px solid #5b2f8f">COCOS</span>':(m.cartera==='vetajeep')?' <span style="font-size:.55rem;font-weight:600;padding:1px 5px;border-radius:8px;background:#2b2410;color:#e0c674;border:1px solid #5c4a1f">VETAJEEP</span>':'')+'</td>'+
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

  // Restaurar valores de filtros y focus en el elemento que estaba enfocado
  requestAnimationFrame(function(){
    // Restaurar valores de filtros (después de que el HTML fue regenerado)
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
    
    // Restaurar focus en el elemento que estaba enfocado
    if(activeFocusId){
      var elToFocus=document.getElementById(activeFocusId);
      if(elToFocus)elToFocus.focus();
    }
    
    // Scroll para que wrap quede visible SOLO al activar un filtro (no en cada re-render
    // mientras el filtro sigue activo, porque eso te pisa el scroll manual — p.ej. al
    // editar/borrar movimientos uno por uno dentro de una lista filtrada larga).
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
  var lots={}; // ticker -> lotes de compra abiertos [{qtyOpen,unitUSD,unitUSDpuro,unitARS,fecha,id}]

  // Procesar en orden CRONOLÓGICO (no orden de carga) para que el consumo de lotes
  // por venta respete qué compras existían efectivamente a esa fecha.
  // Portafolios con varias carteras (Omar): sólo los movimientos de la cartera activa
  var ordenados = movimientos.filter(function(m){return m&&(typeof CARTERA_ACTIVA==='undefined'||(m.cartera||'principal')===CARTERA_ACTIVA);}).sort(function(a,b){
    var fa=(a&&a.fecha||'').split('/'), fb=(b&&b.fecha||'').split('/');
    var da = fa.length===3? fa[2]+fa[1].padStart(2,'0')+fa[0].padStart(2,'0') : '0';
    var db = fb.length===3? fb[2]+fb[1].padStart(2,'0')+fb[0].padStart(2,'0') : '0';
    if(da!==db) return da<db?-1:1;
    return (a&&a.id||0)-(b&&b.id||0);
  });

  ordenados.forEach(function(m){
    if(!m||m.tipo==='aporte')return;
    if(m.owner==='cristian')return; // movimientos viejos marcados "Cristian" (función eliminada 2026-10-03) quedan fuera
    var key=m.ticker;
    if(!pos[key])pos[key]={ticker:m.ticker,mercado:m.mercado,qty:0,costUSD:0,costARS:0,costUSDpuro:0,realizedPnl:0,dividendsUSD:0};
    else if(m.mercado)pos[key].mercado=m.mercado; // actualizar con cada mov para que el último editado gane
    var p=pos[key];
    if(!lots[key])lots[key]=[];
    var priceUSD=m.precioUSD||0;
    var comUSD=m.comision||0;
    if(m.tipo==='dividendo'){p.dividendsUSD+=priceUSD;}
    else if(m.tipo==='compra'){
      // Bonos y ONs: dividir por MEP del día; resto: por CCL
      // La tabla histórica (Tipo de cambio) tiene PRIORIDAD sobre el CCL guardado en el movimiento
      // Fallback: CCL_HOY como último recurso para no tratar ARS como USD
      var _tc=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI')
        ?(getMEP(m.fecha)||getCCL(m.fecha)||m.ccl||MEP_HOY||CCL_HOY)
        :(getCCL(m.fecha)||m.ccl||CCL_HOY);
      var usdPuro=isBonoUSDDirecto(m.ticker)?(m.precioARS||0)*m.qty:(_tc>0&&(m.precioARS||0)>0?(m.precioARS||0)*m.qty/_tc:priceUSD*m.qty);
      p.costUSD+=usdPuro+comUSD;  // consistente con costUSDpuro: usa precioARS/tc_dia
      p.costARS+=(m.precioARS||0)*m.qty;
      p.costUSDpuro+=usdPuro;  // USD real pagado: precioARS*qty/MEP o CCL según mercado
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
      // La tabla histórica tiene PRIORIDAD sobre el CCL guardado en el movimiento
      var _tcV=(m.mercado==='BONOS'||m.mercado==='ON'||m.mercado==='FCI')
        ?(getMEP(m.fecha)||getCCL(m.fecha)||m.ccl||MEP_HOY||CCL_HOY)
        :(getCCL(m.fecha)||m.ccl||CCL_HOY);
      var ventaUSDpuro=isBonoUSDDirecto(m.ticker)?(m.precioARS||0):(_tcV>0?(m.precioARS||0)/_tcV:(m.precioUSD||0));
      var openLots=lots[key]||[];
      var qtyTotalOpen=openLots.reduce(function(s,l){return s+l.qtyOpen;},0);

      if(m.loteMethod==='barato'&&qtyTotalOpen>0.000001){
        // Método nuevo (Laboratorio de Ventas validado): descontar primero del lote
        // de MENOR costo en USD, no del promedio ponderado — deja el costo restante
        // más alto (cartera más pesimista), tal como se probó en el laboratorio.
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
        var qtyVendidaEfectiva=m.qty-restante; // por si pide más de lo abierto en lotes
        var proceedsPuro=ventaUSDpuro*qtyVendidaEfectiva-comUSD;
        p.realizedPnl+=proceedsPuro-costBasisUSDpuro;
        p.costUSD-=costBasisUSD;
        p.costARS-=costBasisARS;
        p.costUSDpuro-=costBasisUSDpuro;
        p.qty-=qtyVendidaEfectiva;
        // Guardar ganancia realizada en el propio movimiento para estadísticas (x ticker, tipo, RF/RV)
        m.gananciaUSD=proceedsPuro-costBasisUSDpuro;
        m.costBasisUSD=costBasisUSDpuro;
        m.gananciaPct=costBasisUSDpuro>0?(m.gananciaUSD/costBasisUSDpuro*100):null;
      } else {
        // Método legado (histórico, sin tocar): promedio ponderado de todas las compras
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
        // Guardar ganancia realizada en el propio movimiento para estadísticas (x ticker, tipo, RF/RV)
        m.gananciaUSD=proceedsPuro-costBasisPuro;
        m.costBasisUSD=costBasisPuro;
        m.gananciaPct=costBasisPuro>0?(m.gananciaUSD/costBasisPuro*100):null;
        // Reducir todos los lotes abiertos proporcionalmente para no romper el
        // tracking de lotes futuros (mantiene el promedio ponderado intacto).
        if(qtyTotalOpen>0.000001){
          var frac=m.qty/qtyTotalOpen;
          openLots.forEach(function(l){ l.qtyOpen-=l.qtyOpen*frac; });
        }
      }
    }
  });

  // Dividendos del Tracker (TRK.divs) confirmados para afectar PPC o ganancia de venta
  // (ver trkAddDiv). Se recalcula siempre en vivo desde TRK.divs, así que borrar un
  // dividendo del tracker revierte el efecto automáticamente. No se aplica al desglose
  // 'cristian' porque el dividendo del tracker no tiene owner asociado.
  if(typeof TRK!=='undefined'&&TRK.divs&&TRK.divs.length){
    TRK.divs.forEach(function(d){
      // montoPPC (si existe) = parte del dividendo que corresponde a nominales que todavía tenés (histórico Veta, v41)
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
// renderPortfolio() y las cards que dispara (inversiones chicas, perfil, próximos cobros, etc.)
// pedían las posiciones por separado → el historial completo se recorría 4-5 veces por render
// (y durante la actualización de precios hay un render por frame). Mientras dura un render se
// reutiliza el resultado (clave: owner + cartera activa + cantidad de movimientos); fuera de un
// render, getPositions() se comporta exactamente igual que antes (sin caché).
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
  // Próximos Cobros: calendario de flujos de bonos/ON (no depende de cotizaciones).
  var _calCobros=calcularCalendarioCobros();
  var _flujoProx30Map=_flujosMapaProx30(_calCobros);
  renderFlujosMiniResumen(_calCobros);
  // Badge "D": solo acciones/CEDEARs (los bonos/ON ya tienen F con el flujo exacto, no hace
  // falta duplicar), y solo cuando el historial estima que el próximo dividendo cae dentro de
  // 30 días — ver calcularDivHistUpcoming30 (mira dividendos + TRK.divs confirmados).
  var _divHistorySet=calcularDivHistUpcoming30();
  var empty=document.getElementById('pos-empty');
  var totalVal=0,totalCost=0;
  var totalRpnl=all.reduce(function(a,p){return a+p.realizedPnl;},0);
  var totalDivs=dividendos.reduce(function(a,d){return a+(d.usd||0);},0);
  if(!open.length){
    empty.style.display='';
    document.getElementById('panels-grid').style.display='none';
    ['panel-nyse','panel-bonos','panel-argentina','panel-brasil','panel-europa','panel-on','panel-china','panel-cripto','panel-fci'].forEach(function(id){var el=document.getElementById(id);if(el)el.style.display='none';});
    ['m-val','m-ganancia','m-divs','m-count'].forEach(function(id){document.getElementById(id).textContent='—';});document.getElementById('m-rend').innerHTML='—';
    renderDivsCard();
    return;
  }
  empty.style.display='none';
  document.getElementById('panels-grid').style.display='';
  var sectors={nyse:[],bonos:[],argentina:[],brasil:[],europa:[],on:[],china:[],cripto:[],fci:[]};
  var sectorCost={nyse:0,bonos:0,argentina:0,brasil:0,europa:0,on:0,china:0,cripto:0,fci:0};
  var sectorVal={nyse:0,bonos:0,argentina:0,brasil:0,europa:0,on:0,china:0,cripto:0,fci:0};
  // Tickers marcados "a finish" en algún movimiento
  var finishTickers=new Set(movimientos.filter(function(m){return m.finish;}).map(function(m){return m.ticker;}));
  // Pasada 1: acumular totales globales y por sector
  open.forEach(function(p){
    var q=quotes[p.ticker];var price=q?q.price:null;
    var ratio=getRatio(p.ticker);var sector=getSector(p.ticker);
    // Para Argentina: price ya viene en ARS. Para NYSE: price en USD → convertir
    // Para Bonos/ON: price es por 100 nominales → qty se divide por 100 para el total
    var _sectorIsARS=(getSector(p.ticker)==='argentina'||getSector(p.ticker)==='bonos'||getSector(p.ticker)==='on');
    var _isBonoON=(sector==='bonos'||sector==='on');
    var _isBRL=BRL_TICKERS.has(p.ticker);
    var fromByma=q&&q.fromByma;
    var mercadoCedearARS=price!=null?(_sectorIsARS||_isBRL?price:fromByma?price:(price/ratio)*CCL_HOY):null;
    var inversionCedearARS=isBonoUSDDirecto(p.ticker)?p.costUSDpuro*100:(mercadoCedearARS!=null?(_isBonoON?mercadoCedearARS*p.qty/100:mercadoCedearARS*p.qty):p.costARS);
    var valueUSD=price!=null?(sector==='fci'?(price/(MEP_HOY||CCL_HOY))*p.qty:_sectorIsARS?(_isBonoON?(price/MEP_HOY)*p.qty/100:(price/CCL_HOY)*p.qty):_isBRL?(price/CCL_HOY)*p.qty:fromByma?(price/CCL_HOY)*p.qty:(price/ratio)*p.qty):null;
    if(valueUSD!=null){totalVal+=valueUSD;sectorVal[sector]=(sectorVal[sector]||0)+valueUSD;}p._valueUSD=valueUSD;
    totalCost+=p.costUSDpuro;
    sectorCost[sector]=(sectorCost[sector]||0)+p.costUSDpuro;
    p._mktARS=mercadoCedearARS;
    p._invARS=inversionCedearARS;
  });

  // Totales de Valor Mercado ARS por sector (para concentración)
  var sectorTotalMktARS={nyse:0,bonos:0,argentina:0,brasil:0,europa:0,on:0,china:0,cripto:0,fci:0};
  open.forEach(function(p){
    var sec=getSector(p.ticker);
    sectorTotalMktARS[sec]=(sectorTotalMktARS[sec]||0)+(p._invARS||0);
  });

  // ── Auto-cálculo RV (NYSE + Argentina + Brasil + Europa + China + Cripto) ──
  var rvSectors=['nyse','argentina','brasil','europa','china','cripto'];
  // Total RV y RF a valor de mercado (ARS) — base de los colores 2%/3% y de la columna % Tipo
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

  // Función color % — <0 rojo, 0-10 naranja, >10 verde
  function pctColor(pct){
    if(pct===null||isNaN(pct)) return 'var(--text3)';
    if(pct<0) return 'var(--red)';
    if(pct<10) return '#eab308';
    return 'var(--accent)';
  }
  function pctCell(pct,sign){
    if(pct===null||isNaN(pct)) return '<span style="color:var(--text3)">—</span>';
    var s=sign&&pct>0?'+':'';
    return '<span style="color:'+pctColor(pct)+'">'+s+Math.round(pct)+'%</span>';
  }
  function deltaCellFn(pct){
    if(pct===null||isNaN(pct)) return '<span style="color:var(--text3);font-size:.75rem">—</span>';
    var col=pctColor(pct);
    var s=pct>0?'+':'';
    var val=Math.round(pct)+'%';
    // Badge con fondo semitransparente y fuente más grande
    var bg=pct<0?'rgba(248,113,113,.13)':pct<10?'rgba(249,115,22,.13)':'rgba(126,232,162,.13)';
    return '<span style="display:inline-block;color:'+col+';background:'+bg+';border:1px solid '+col+';border-radius:5px;padding:2px 7px;font-size:.82rem;font-weight:700;letter-spacing:-.01em;font-family:var(--mono)">'+s+val+'</span>';
  }
  // Recuadro combinado Δ% / ΔUP — fondo y borde según Δ%, texto interno con color propio
  function deltaUpCellFn(pnlPct, upside){
    var hasPnl=pnlPct!==null&&!isNaN(pnlPct);
    var hasUp=upside!==null&&!isNaN(upside);
    if(!hasPnl&&!hasUp) return '<span style="color:var(--text3);font-size:.75rem">—</span>';
    // Color del recuadro basado en Δ% (si existe), si no en ΔUP
    var baseRef=hasPnl?pnlPct:upside;
    var baseCol=pctColor(baseRef);
    var baseBg=baseRef<0?'rgba(248,113,113,.13)':baseRef<10?'rgba(249,115,22,.13)':'rgba(126,232,162,.13)';
    var pnlInner=hasPnl
      ?'<span style="color:'+pctColor(pnlPct)+';font-size:.82rem;font-weight:700">'+(pnlPct>0?'+':'')+Math.round(pnlPct)+'%</span>'
      :'<span style="color:var(--text3);font-size:.82rem">—</span>';
    var upInner=hasUp
      ?'<span style="color:'+pctColor(upside)+';font-size:.7rem;font-weight:700">'+(upside>0?'+':'')+Math.round(upside)+'%</span>'
      :'<span style="color:var(--text3);font-size:.7rem">—</span>';
    return '<span style="display:inline-block;background:'+baseBg+';border:1px solid '+baseCol+';border-radius:5px;padding:2px 7px;font-family:var(--mono);letter-spacing:-.01em">'
      +pnlInner
      +'<span style="color:var(--text3);font-size:.65rem;margin:0 3px">/</span>'
      +upInner
      +'</span>';
  }

  // Filtro por ticker y color Δ% (inputs en header)
  var _portTkFilterEl=document.getElementById('port-ticker-filter');
  var _portTkFilter=_portTkFilterEl?_portTkFilterEl.value.trim().toUpperCase():'';
  var _fGreen=document.getElementById('port-filter-green');
  var _fYellow=document.getElementById('port-filter-yellow');
  var _fRed=document.getElementById('port-filter-red');
  var _colorFilterOn=(_fGreen&&_fGreen.checked)||(_fYellow&&_fYellow.checked)||(_fRed&&_fRed.checked);
  var _fRVRed=document.getElementById('port-filter-rv-red');
  var _fRVYellow=document.getElementById('port-filter-rv-yellow');
  var _fRVWhite=document.getElementById('port-filter-rv-white');
  var _rvFilterOn=(_fRVRed&&_fRVRed.checked)||(_fRVYellow&&_fRVYellow.checked)||(_fRVWhite&&_fRVWhite.checked);

  var _panelTot={};var _pvAlerts=[];var _rbPlan=[];
  var _paFlows={};try{_paFlows=paBuildFlows();}catch(_e){console.warn('paBuildFlows',_e);}
  // Pasada 2: construir filas
  open.forEach(function(p){
    var q=quotes[p.ticker];var price=q?q.price:null;
    var ratio=getRatio(p.ticker);var sector=getSector(p.ticker);
    var _isARS2=(sector==='argentina'||sector==='bonos'||sector==='on'||sector==='fci');
    var _isBonoON=(sector==='bonos'||sector==='on');
    var ppcUSD=p.qty>0?p.costUSDpuro/p.qty:0;
    // Para bonos/ONs: auto-detectar bono dólar vs bono peso comparando PPC vs precio de mercado
    // Bono dólar (BC37D, GD29…): costARS guardado a CCL histórico muy bajo → PPC/mercado << 0.15
    // Bono peso (CUAP, DICP, TX31…): PPC/mercado ≈ 0.4-1.0 (precio en ARS real)
    var ppcFromARS=p.qty>0?p.costARS/p.qty*100:0;
    // Bonos/ON/FCI: convertir USD→ARS con MEP_HOY. Resto: CCL_HOY
    var _tcHoy=(_isBonoON||sector==='fci')?(MEP_HOY||CCL_HOY):CCL_HOY;
    var ppcFromUSD=ppcUSD*_tcHoy*100;
    var mkt=p._mktARS||0;  // usar _mktARS de Pasada 1 (mercadoCedearARS aún no está declarada)
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
    // ΔUP: (P.Venta USD - Precio mercado USD) / Precio mercado USD
    // bonos/ON: ARS→USD via MEP; argentina: ARS→USD via CCL; NYSE: ya está en USD
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
    p._pv=targetUSD;p._upside=upside; // para el resumen (buscador de Carteras administradas)

    // Recuadro combinado Δ% / ΔUP (mismo badge, colores internos independientes)
    var deltaCell=deltaUpCellFn(pnlPct,upside);

    // P. Venta
    var targetCell=targetARS!=null?'$'+Math.round(targetARS).toLocaleString('es-AR'):'<span style="color:var(--text3)">—</span>';

    // Inversión $ con color por concentración en el sector
    var sectorTotal=sectorTotalMktARS[sector]||0;
    // Comparación directa: inversionCedearARS vs umbrales en ARS auto-calculados
    var invColor=(rv3pctARS>0&&inversionCedearARS>rv3pctARS)?'var(--red)':
                 (rv2pctARS>0&&inversionCedearARS>rv2pctARS)?'#eab308':'var(--text)';
    var invARS='<span class="port-sensitive" style="color:'+invColor+'">$'+Math.round(inversionCedearARS).toLocaleString('es-AR')+'</span>';

    var mktARS=mercadoCedearARS!=null?'$'+Math.round(mercadoCedearARS).toLocaleString('es-AR'):null;
    var ppcARS='$'+Math.round(ppcCedearARS).toLocaleString('es-AR');
    var _qHealth=quoteHealthDot(q);

    var finishFlag=finishTickers.has(p.ticker)?'<span title="A finish" style="font-size:.7rem;margin-left:4px">🏁</span>':'';
    var _flujoEv=_flujoProx30Map[p.ticker];
    var _flujoTitle=_flujoEv?('Próximo cobro: '+_flujosFechaDDMM(_flujoEv.fecha)+' — '+_flujosFmtMoneda(_flujoEv.moneda,_flujoEv.total)):'';
    var flujoFlag=_flujoEv?'<span class="qhelp" style="color:var(--accent);font-size:.62rem;font-weight:800;margin-left:3px">F<span class="qhelp-tip">'+_flujoTitle.replace(/</g,'&lt;')+'</span></span>':'';
    var divHistFlag=_divHistorySet.has(p.ticker)?'<span class="qhelp" style="color:var(--blue);font-size:.62rem;font-weight:800;margin-left:3px">D<span class="qhelp-tip">Por tu historial, estimamos un dividendo dentro de 30 días</span></span>':'';
    var _mark=MARKS[p.ticker];
    var _markClass=_mark?' marked-'+_mark.type:'';
    var _markIcon=_mark?(_mark.type==='sell'?'🔴':_mark.type==='buy'?'🟢':'⭐'):'🏷';
    var _markBtnCls='mark-btn'+(_mark?' active':'');
    var _markNote=_mark&&_mark.note?'<span class="mark-note-tag" title="'+_mark.note.replace(/"/g,'&quot;')+'">'+_mark.note.replace(/</g,'&lt;')+'</span>':'';

    // RSI (14) para todo menos Bonos/ONs. Para Bonos/ON con flujo cargado en FLUJOS_BONOS: TIR real
    // (XIRR exacto contra el cronograma, ver calcularTIRReal). Si no hay flujo cargado todavía,
    // fallback a TIR de EcoValores (solo Bonos, cobertura parcial). Sin ninguna de las dos: '—'.
    var rsiCell;
    if(_isBonoON){
      var _tirReal=(typeof FLUJOS_BONOS!=='undefined'&&FLUJOS_BONOS[p.ticker])?calcularTIRReal(p.ticker):null;
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

    // % Tipo: peso a valor de mercado sobre el total de renta variable o renta fija (FCI sin columna)
    var ptipoCell='';
    if(sector!=='fci'){
      var _ptDen=(sector==='bonos'||sector==='on')?rfMktARS:(rvSectors.indexOf(sector)!==-1?rvMktARS:0);
      var _ptPct=_ptDen>0&&inversionCedearARS!=null?inversionCedearARS/_ptDen*100:null;
      var _ptCol=_ptPct==null?'var(--text)':_ptPct>3?'var(--red)':_ptPct>2?'#eab308':'var(--text)';
      ptipoCell='<td class="mono col-ptipo">'+(_ptPct!=null?'<span style="color:'+_ptCol+'">'+_ptPct.toLocaleString('es-AR',{minimumFractionDigits:1,maximumFractionDigits:1})+'%</span>':'<span style="color:var(--text3)">—</span>')+'</td>';
    }
    // Rebalanceo: vender hasta el 2% del tipo si supera el 2%; comprar hasta el umbral de inversiones chicas (solo RV)
    var rebalCell='';
    if(sector!=='fci'){
      var _rbTxt='<span style="color:var(--text3)">—</span>',_rbTip='';
      var _isBonoU=(sector==='bonos'||sector==='on');
      var _unitARS=mercadoCedearARS!=null&&mercadoCedearARS>0&&!isBonoUSDDirecto(p.ticker)?(_isBonoU?mercadoCedearARS/100:mercadoCedearARS):null;
      var _uLbl=_isBonoU?' VN':' u.';
      var _fmtU=function(ars){if(!_unitARS)return '';var u=Math.round(ars/_unitARS);return u>0?' <span style="font-size:.64rem;color:var(--text3)">· '+u.toLocaleString('es-AR')+_uLbl+'</span>':'';};
      var _ptLbl=_isBonoU?'la RF':'la RV';
      if(_ptPct!=null&&_ptPct>2&&_ptDen>0){
        var _objARS=_ptDen*0.02,_sellARS=inversionCedearARS-_objARS;
        _rbPlan.push({tk:p.ticker,acc:'vender',ars:_sellARS,u:_unitARS?Math.round(_sellARS/_unitARS):null,uL:_uLbl,tipo:_isBonoU?'RF':'RV',pct:_ptPct});
        _rbTxt='<span style="color:'+_ptCol+'">vender <span class="port-sensitive">$'+Math.round(_sellARS).toLocaleString('es-AR')+'</span>'+_fmtU(_sellARS)+'</span>';
        _rbTip=p.ticker+' · '+_ptPct.toFixed(1)+'% de '+_ptLbl+' (total $'+Math.round(_ptDen).toLocaleString('es-AR')+')\nObjetivo 2% → $'+Math.round(_objARS).toLocaleString('es-AR')+'\nVender $'+Math.round(_sellARS).toLocaleString('es-AR')+(_unitARS?' ≈ '+Math.round(_sellARS/_unitARS).toLocaleString('es-AR')+_uLbl+' a $'+Math.round(_isBonoU?_unitARS*100:_unitARS).toLocaleString('es-AR')+(_isBonoU?' c/100 VN':''):'');
      } else if(!_isBonoU&&_ptPct!=null&&_ptDen>0&&typeof SI_THRESHOLD!=='undefined'&&SI_THRESHOLD>0&&_ptPct<SI_THRESHOLD){
        var _thrARS=_ptDen*SI_THRESHOLD/100,_buyARS=_thrARS-inversionCedearARS;
        if(_buyARS>0){
          _rbPlan.push({tk:p.ticker,acc:'comprar',ars:_buyARS,u:_unitARS?Math.round(_buyARS/_unitARS):null,uL:_uLbl,tipo:'RV',pct:_ptPct});
          _rbTxt='<span style="color:var(--accent)">comprar <span class="port-sensitive">$'+Math.round(_buyARS).toLocaleString('es-AR')+'</span>'+_fmtU(_buyARS)+'</span>';
          _rbTip=p.ticker+' · '+_ptPct.toFixed(2)+'% de la RV, debajo del umbral de inversiones chicas ('+SI_THRESHOLD+'%)\nUmbral → $'+Math.round(_thrARS).toLocaleString('es-AR')+'\nComprar $'+Math.round(_buyARS).toLocaleString('es-AR')+(_unitARS?' ≈ '+Math.round(_buyARS/_unitARS).toLocaleString('es-AR')+_uLbl+' a $'+Math.round(_unitARS).toLocaleString('es-AR'):'');
        }
      }
      rebalCell='<td class="mono col-rebal"'+(_rbTip?' title="'+_rbTip.replace(/"/g,'&quot;')+'"':'')+'>'+_rbTxt+'</td>';
    }
    // % Anual (XIRR USD)
    var _paRes=null;try{var _paF=_paFlows[p.ticker];_paRes=_paF?paCalc(_paF.flows,p._valueUSD):null;if(_paRes){_paRes.titulo=p.ticker;PA_LAST[p.ticker]=_paRes;}}catch(_e){}
    var panualCell='<td class="mono col-panual" style="line-height:1.15">'+paCellHTML(p.ticker,_paRes,_paFlows[p.ticker]?_paFlows[p.ticker].compras:null)+'</td>';
    var row='<tr class="'+_markClass+'">' +
      '<td style="font-weight:700">'+
        '<button class="'+_markBtnCls+'" data-ticker="'+p.ticker.replace(/"/g,'&quot;')+'" onclick="event.stopPropagation();openMarkPopover(this.dataset.ticker,this)" title="Marcar activo">'+_markIcon+'</button>'+
        p.ticker+(_pvHit?'<span class="qhelp" style="font-size:.68rem;margin-left:3px">🎯<span class="qhelp-tip">Alcanzó su P. Venta</span></span>':'')+finishFlag+flujoFlag+divHistFlag+_markNote+
      '</td>'+
      '<td style="text-align:center;padding:.38rem .5rem">'+deltaCell+'</td>'+
      panualCell+
      '<td class="mono">'+invARS+'</td>'+
      '<td class="mono">'+(mktARS?mktARS+_qHealth:'<span style="color:var(--text3)">—</span>')+'</td>'+
      '<td class="mono muted">'+ppcARS+'</td>'+
      '<td class="mono col-pventa">'+targetCell+'</td>'+
      ptipoCell+
      rebalCell+
      (CFG.rsi?'<td class="mono col-rsi">'+rsiCell+'</td>':'')+
      '<td class="mono port-sensitive col-qty">'+(p.qty%1===0?p.qty.toFixed(0):p.qty.toFixed(2))+'</td>'+
    '</tr>';
    // Los activos sin cotización (pnlPct===null) siempre pasan el filtro de color: no se
    // pueden clasificar en verde/amarillo/rojo, y ocultarlos los hacía desaparecer de la
    // tabla en vez de mostrarse con el precio vacío.
    var _passColor=!!_portTkFilter||!_colorFilterOn||pnlPct===null||((_fGreen&&_fGreen.checked)&&pnlPct>=10)||((_fYellow&&_fYellow.checked)&&pnlPct>=0&&pnlPct<10)||((_fRed&&_fRed.checked)&&pnlPct<0);
    var _passRV=!_rvFilterOn||((_fRVRed&&_fRVRed.checked)&&invColor==='var(--red)')||((_fRVYellow&&_fRVYellow.checked)&&invColor==='#eab308')||((_fRVWhite&&_fRVWhite.checked)&&invColor==='var(--text)');
    if((!_portTkFilter||p.ticker.toUpperCase().indexOf(_portTkFilter)!==-1)&&_passColor&&_passRV){ sectors[sector].push(row);
      // Acumular totales del recuadro (filas visibles)
      var _tt=_panelTot[sector]||(_panelTot[sector]={inv:0,cost:0,costInv:0,pt:0,ptOk:false,paFlows:[],paVal:0});
      _tt.inv+=inversionCedearARS||0;
      if(pnlPct!=null&&inversionCedearARS>0){_tt.costInv+=inversionCedearARS;_tt.cost+=inversionCedearARS/(1+pnlPct/100);}
      if(_paFlows[p.ticker]&&p._valueUSD>0){_tt.paFlows=_tt.paFlows.concat(_paFlows[p.ticker].flows);_tt.paVal+=p._valueUSD;}
      if(typeof _ptPct!=='undefined'&&_ptPct!=null&&sector!=='fci'){_tt.pt+=_ptPct;_tt.ptOk=true;}
    }
  });
  var panelDefs=[{id:'nyse',key:'nyse'},{id:'bonos',key:'bonos'},{id:'argentina',key:'argentina'},{id:'brasil',key:'brasil'},{id:'europa',key:'europa'},{id:'on',key:'on'},{id:'china',key:'china'},{id:'cripto',key:'cripto'},{id:'fci',key:'fci'}];
  panelDefs.forEach(function(def){
    var rows=sectors[def.key];var panel=document.getElementById('panel-'+def.id);var body=document.getElementById('body-'+def.id);var meta=document.getElementById('panel-'+def.id+'-meta');
    if(!panel||!body){return;}
    if(!rows||!rows.length){panel.style.display='none';return;}
    panel.style.display='';body.innerHTML=rows.join('');
    try{
      var _tb=body.parentNode,_tf=_tb.tFoot||_tb.createTFoot(),_t=_panelTot[def.key];
      if(_t&&rows.length>1){
        var _dPct=_t.cost>0?(_t.costInv/_t.cost-1)*100:null;
        var _isRF=(def.key==='bonos'||def.key==='on');
        var _wTxt=(_t.ptOk&&def.key!=='fci')?'<div style="font-size:.6rem;color:var(--text2);font-weight:500">'+_t.pt.toLocaleString('es-AR',{minimumFractionDigits:1,maximumFractionDigits:1})+'% de '+(_isRF?'la RF':'la RV')+'</div>':'';
        _tf.innerHTML='<tr><td>TOTAL'+_wTxt+'</td>'+
          '<td style="text-align:center;padding:.38rem .5rem">'+deltaUpCellFn(_dPct,null)+'</td>'+
          (function(){var _r=null;try{if(_t.paFlows.length){_r=paCalc(_t.paFlows.slice().sort(function(a,b){return a.d-b.d;}),_t.paVal);if(_r){_r.titulo='Total '+def.id.toUpperCase();PA_LAST['__tot_'+def.key]=_r;}}}catch(_e){}return '<td class="mono col-panual" style="line-height:1.15">'+paCellHTML('__tot_'+def.key,_r,null,'recuadro')+'</td>';})()+
          '<td class="mono"><span class="port-sensitive">$'+Math.round(_t.inv).toLocaleString('es-AR')+'</span></td>'+
          '<td class="mono"><span style="color:var(--text3)">—</span></td>'+
          '<td class="mono muted"><span class="port-sensitive" title="Costo total de las posiciones con cotización">$'+Math.round(_t.cost).toLocaleString('es-AR')+'</span></td>'+
          (def.key==='fci'?'<td></td><td></td><td></td>':
          '<td class="col-pventa"></td>'+
          '<td class="mono col-ptipo">'+(_t.ptOk?_t.pt.toLocaleString('es-AR',{minimumFractionDigits:1,maximumFractionDigits:1})+'%':'')+'</td>'+
          '<td class="col-rebal"></td>'+(CFG.rsi?'<td class="col-rsi"></td>':'')+'<td></td>')+
        '</tr>';
      } else { _tf.innerHTML=''; }
    }catch(_e){console.warn('panel totales',_e);}panelSortApply(body);
    var val=sectorVal[def.key];
    var _tc=(def.key==='bonos'||def.key==='on'||def.key==='fci')?MEP_HOY:CCL_HOY;
    var valARS=val>0&&_tc>0?Math.round(val*_tc):null;
    meta.innerHTML=rows.length+' posiciones'+(valARS?' · <span class="port-sensitive">$'+valARS.toLocaleString('es-AR')+'</span>':'');
  });
  // Liquidez del sidebar
  var liqARS=getRawNum('liq-ars');
  var liqUSD=getRawNum('liq-usd');
  // Liquidez en pesos → USD al MEP (como bonos y ON), no al CCL
  var _tcLiq=(typeof MEP_HOY!=='undefined'&&MEP_HOY>0)?MEP_HOY:CCL_HOY;
  var liqTotalUSD=liqUSD+(_tcLiq>0?liqARS/_tcLiq:0);
  var valConLiq=totalVal+liqTotalUSD;
  // Distribución de la cartera (card arriba de las tablas)
  try{distRender({rv:['nyse','argentina','brasil','europa','china','cripto'].reduce(function(s,k){return s+(sectorVal[k]||0);},0),rf:(sectorVal.bonos||0)+(sectorVal.on||0),fci:sectorVal.fci||0,hasFci:('fci' in sectorVal),liq:liqTotalUSD,plan:_rbPlan});}catch(_e){console.warn('distRender',_e);}
  try{pvAlertRender(_pvAlerts);}catch(_e){}
  try{negAlertRender(all.filter(function(p){return p.qty<-0.000001;}).map(function(p){return p.ticker+' ('+(Math.round(p.qty*100)/100).toLocaleString('es-AR')+')';}));}catch(_e){}

  document.getElementById('m-val').textContent='$'+Math.round(valConLiq).toLocaleString('es-AR');
  document.getElementById('m-count').textContent=open.length;

  // Mini pie distribución — liquidez ARS convertida con MEP
  var _liqMEP=liqUSD+((MEP_HOY||CCL_HOY)>0?liqARS/(MEP_HOY||CCL_HOY):0);
  var _fija=(sectorVal.bonos||0)+(sectorVal.on||0)+(sectorVal.fci||0);
  var _variable=totalVal-_fija;
  renderMiniPie(_fija,_variable>0?_variable:0,_liqMEP>0?_liqMEP:0);
  // Sector pie desglose
  renderSectorPie(sectorVal);
  // RV pie por país
  renderRVPie(sectorVal);

  // Dividendos: leer el total del tracker + movimientos (calculado en renderDivsCard)
  var trkDivsTotal=0;
  try{var td=TRK.divs||[];try{var _lsTrkP=localStorage.getItem(TRK.DKEY);if(_lsTrkP){var _lsTrkPD=JSON.parse(_lsTrkP);if(_lsTrkPD.length>td.length)td=_lsTrkPD;}}catch(_e){}
  if(true){td.forEach(function(d){var u=d.moneda==='USD'?(d.montoUSD||d.monto||0):(d.monto||0)/(CCL_TABLE[d.fecha]||CCL_HOY);trkDivsTotal+=u||0;});}}catch(e){}
  var movDivsTotal=movimientos.filter(function(m){return m.tipo==='dividendo';}).reduce(function(a,m){return a+(m.precioUSD||0);},0);
  var regDivsTotal=(dividendos||[]).reduce(function(a,d){return a+(d.usd||0);},0);
  var allDivs=trkDivsTotal+movDivsTotal+regDivsTotal;
  document.getElementById('m-divs').textContent=allDivs>0?'$'+Math.round(allDivs).toLocaleString('es-AR'):'—';

  // Rendimiento = (ValTotal - CostoTotal) / CostoTotal * 100
  // Rendimiento: usa inversión inicial si está cargada, si no usa costUSD
  var invInicialEl=document.getElementById('inv-sidebar-usd');
  var invInicial=getRawNum('inv-sidebar-usd');
  var baseRend=invInicial>0?invInicial:totalCost;
  var rendPct=baseRend>0?(valConLiq-baseRend)/baseRend*100:null;
  var rendEl=document.getElementById('m-rend');
  if(rendPct!==null){
    var rendColor=rendPct<0?'var(--red)':rendPct<10?'#eab308':'var(--accent)';
    var rendSign=rendPct>=0?'+':'';
    rendEl.innerHTML='<span style="color:'+rendColor+';font-weight:700">'+rendSign+Math.round(rendPct)+'%</span>';
  } else { rendEl.textContent='—'; }

  // % Dolarizado
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
  // Resumen para la vista familiar (Familia/): se guarda en el Supabase de este portafolio
  try{famQueueSnapshot({
    sectorVal:sectorVal, dolzPct:dolzPct, liqUSD:liqUSD, liqARS:liqARS, liqTotalUSD:liqTotalUSD,
    totalVal:totalVal, rendPct:rendPct, invInicial:invInicial,
    totalCost:open.reduce(function(a,p){return a+(p._valueUSD!=null?(p.costUSDpuro||0):0);},0),
    pos:open.filter(function(p){return p._valueUSD!=null;}).map(function(p){var r=PA_LAST[p.ticker];return {t:p.ticker,s:getSector(p.ticker),q:Math.round(p.qty*10000)/10000,v:Math.round(p._valueUSD*100)/100,c:Math.round((p.costUSDpuro||0)*100)/100,pnl:p._pnlPct!=null?Math.round(p._pnlPct*10)/10:null,an:(r&&r.anual!=null)?Math.round(r.anual*10)/10:null,pv:p._pv!=null?p._pv:null,up:p._upside!=null?Math.round(p._upside*10)/10:null,ch:(quotes[p.ticker]&&quotes[p.ticker].changePct!=null&&isFinite(quotes[p.ticker].changePct))?Math.round(quotes[p.ticker].changePct*100)/100:null};}),
    cobros:_calCobros.items.filter(function(it){return it.fecha<=_flujosFechaLimiteStr(30);}).map(function(it){return {f:it.fecha,t:it.ticker,m:it.moneda,x:it.total};})
  });}catch(_e){console.warn('famQueueSnapshot',_e);}

  // Ganancia Neta = Valor Total USD - Inv. Inicial USD
  var gananciaEl=document.getElementById('m-ganancia');
  var invInicialG=getRawNum('inv-sidebar-usd');
  if(invInicialG>0){
    var gananciaNeta=valConLiq-invInicialG;
    var gananciaPct=gananciaNeta/invInicialG*100;
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

  renderDivsCard();
  renderNearTarget();
  renderSmallInv();
  renderPerfilComparacion();
}

// ─── Exportar portafolio a XLS ───
function exportPortfolioXLS(){
  var all=getPositions();
  var open=all.filter(function(p){return p.qty>0.000001;}).sort(function(a,b){return a.ticker.localeCompare(b.ticker);});
  var rows=[['Ticker','Sector','Cantidad','PPC ARS','Mercado ARS','Inversión ARS','Δ%']];
  open.forEach(function(p){
    var q=quotes[p.ticker];var price=q?q.price:null;
    var ratio=getRatio(p.ticker);var sector=getSector(p.ticker);
    var _isBonoON=(sector==='bonos'||sector==='on');
    var _sectorIsARS=(sector==='argentina'||_isBonoON);
    var _isBRL=BRL_TICKERS.has(p.ticker);
    var fromByma=q&&q.fromByma;
    var mktARS=price!=null?(_sectorIsARS||_isBRL?price:fromByma?price:(price/ratio)*CCL_HOY):null;
    var invARS=mktARS!=null?(_isBonoON?mktARS*p.qty/100:mktARS*p.qty):p.costARS;
    var ppcUSD=p.qty>0?p.costUSDpuro/p.qty:0;
    var _tc=_isBonoON?(MEP_HOY||CCL_HOY):CCL_HOY;
    var ppcARS=_isBonoON?ppcUSD*_tc*100:(sector==='fci'?ppcUSD*(MEP_HOY||CCL_HOY):ppcUSD*CCL_HOY);
    var pnl=mktARS!=null&&ppcARS>0?(mktARS-ppcARS)/ppcARS*100:null;
    rows.push([p.ticker,sector,p.qty,ppcARS>0?Math.round(ppcARS):null,mktARS!=null?Math.round(mktARS):null,Math.round(invARS),pnl!=null?Math.round(pnl*10)/10:null]);
  });
  var ws=XLSX.utils.aoa_to_sheet(rows);
  var wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Portafolio');
  var d=new Date(),ds=d.getFullYear()+'-'+(d.getMonth()+1).toString().padStart(2,'0')+'-'+d.getDate().toString().padStart(2,'0');
  XLSX.writeFile(wb,'Portafolio_'+ds+'.xlsx');
}

// ─── Comparación de portafolios ───
// ─── Noticias de la cartera (v44) ─────────────────────────────────────────────
// Fuente: Finnhub /company-news + /quote (variación del subyacente en USA).
// Solo sectores con cobertura en Finnhub (CEDEAR/NYSE). Argentina, bonos, ON y FCI quedan afuera.
var NWS_SECTORS={nyse:1,europa:1,china:1,cripto:1,brasil:1};
var NWS_TTL=3*3600*1000, NWS_LS='gdc_nws_v1';
var nwsFiltro='hi', nwsExpand={}, nwsBusy=false;
var nwsCache=(function(){try{return JSON.parse(localStorage.getItem(NWS_LS)||'null')||{};}catch(e){return {};}})();
var NWS_JUNK=/(stocks? to (buy|watch|own|hold)|\btop \d+|best stocks|\b\d+ (stocks|reasons|things)|should you (buy|sell)|is it (time|too late)|motley fool|zacks rank|millionaire|here'?s why|what to know|prediction:|\bcould (rise|soar|double|triple|jump|surge|climb)|\bhow (this|these|to)\b|\d+% upside|beaten[- ]down|is .{1,40} a buy\b|buy the dip|forever stock|no-brainer|screaming buy|smartest .* buy|(stock|shares) .{0,20}vs\.? )/i;
var NWS_HI=/(\bearnings\b|quarterly results|\bq[1-4] (results|revenue|profit|sales)|\bbeats?\b|\bmiss(es|ed)?\b|\bguidance\b|\boutlook\b|\bforecasts?\b|downgrad|upgrad|\bacquir|\bacquisition|\bmerger\b|\bbuyout\b|\btakeover\b|lawsuit|\bsued\b|\bprobe\b|investigat|\bsec\b|\bdoj\b|\bftc\b|antitrust|\bfda\b|\brecall\b|bankrupt|\bceo (steps|resign|out|exit)|names? .{1,30} ceo|\blayoffs?\b|job cuts|dividend (cut|suspen|hike|increase|raise)|\bbuyback\b|repurchase|stock split|\btariffs?\b|export (ban|curb|restriction|control)|trading halt|\bplunge|\bsoars?\b|\btumbles?\b|\bsurges?\b|\bcrash|\brate (cut|hike)s?|\bcuts? rates|raises? rates|central bank|\bselic\b|\belections?\b|\binflation\b|\bfiscal\b|\bdefault\b|\bimpeach)/i;
var NWS_MD=/(\banalysts?\b|price target|\b(raises|lifts|cuts|lowers|boosts) .{0,30}targets?\b|\brating\b|partner|\bdeal\b|contract|\blaunch|\bunveil|dividend|regulat|sanction|\bstake\b|insider|expan|\binvest|approv|\bchips?\b|\bai\b)/i;
// Símbolo alternativo para buscar noticias en Finnhub (ADR en USA) cuando el ticker de cartera no es US
var NWS_SYM={'BBAS3':'BDORY'};
// Contexto país/sector: si ≥2 posiciones del mismo sector se mueven fuerte en la misma dirección
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
// Valor USD de una posición (misma lógica que vigRender)
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
  // Si el ticker se movió fuerte, lo reciente (24 h) sube un nivel: probablemente explica el movimiento
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
// Siempre visible: noticias macro de cada país donde hay exposición, ordenado por peso.
// Fuente: Finnhub /news (general + crypto) filtrado por palabras clave del país. Como /news trae solo
// las últimas ~100 notas, se guarda un registro local de 72 h para no perder el dato de la mañana.
var NWS_MACRO=/(inflation|\bcpi\b|\bpce\b|\bppi\b|consumer prices|\bfed\b|federal reserve|\bfomc\b|powell|rate (cut|hike)s?|interest rates?|jobs report|payrolls|jobless|unemployment|\bgdp\b|recession|central bank|\becb\b|lagarde|\bselic\b|\bbcra\b|\bpboc\b|elections?|fiscal|budget|deficit|tariffs?|treasury yields?|\bimf\b|\bdefault\b|stimulus|shutdown|retail sales|consumer (spending|confidence)|\bpmi\b)/i;
// Datos "de primera línea" (pesan más) y sorpresa vs. lo esperado
var NWS_TOP=/(inflation|\bcpi\b|\bpce\b|consumer prices|jobs report|payrolls|unemployment rate|\bgdp\b|rate (cut|hike|decision)s?|holds? rates|\bfomc\b|\bselic\b|interest rates?)/i;
var NWS_SURPRISE=/(than expected|expectations|forecasts?|surprise|unexpected|cooler|hotter|estimates)/i;
// Marcadores propios de EE.UU.: una nota de otro país (BCE, Brasil…) solo cuenta para EE.UU. si también los menciona
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
// Google Translate (endpoint público gtx, en lotes) con fallback a MyMemory por titular.
// Las traducciones se guardan en localStorage: cada titular se traduce una sola vez.
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
  // lotes de ~1500 caracteres para no pasarse del largo de URL
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
  // Agrupar movimientos fuertes por sector y dirección
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
// Se llama al final de fetchAllQuotes: marca en el menú cuántas posiciones se movieron ≥ umbral
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

function vigAdd(){
  var ticker=document.getElementById('vig-ticker').value.trim().toUpperCase();
  var qty=parseFloat(document.getElementById('vig-qty').value)||0;
  if(!ticker)return;
  var ex=vigItems.find(function(v){return v.ticker===ticker;});
  if(ex){ex.qty=qty;}else{vigItems.push({ticker:ticker,qty:qty});}
  try{localStorage.setItem(VIG_KEY,JSON.stringify(vigItems));}catch(e){}
  document.getElementById('vig-ticker').value='';
  document.getElementById('vig-qty').value='';
  vigRender();
}

function vigRemove(ticker){
  vigItems=vigItems.filter(function(v){return v.ticker!==ticker;});
  try{localStorage.setItem(VIG_KEY,JSON.stringify(vigItems));}catch(e){}
  vigRender();
}

function vigRender(){
  var body=document.getElementById('vig-body');
  var empty=document.getElementById('vig-empty');
  var table=document.getElementById('vig-table');
  if(!vigItems.length){empty.style.display='';table.style.display='none';return;}
  empty.style.display='none';table.style.display='';
  var totARS=0,totUSD=0;
  body.innerHTML=vigItems.map(function(v){
    var q=quotes[v.ticker];
    var price=q?q.price:null;
    var sector=getSector(v.ticker);
    var ratio=getRatio(v.ticker);
    var isBonoON=(sector==='bonos'||sector==='on');
    var isFci=(sector==='fci');
    var isARS=(sector==='argentina'||isBonoON||isFci);
    var _vTc=(isBonoON||isFci)?(MEP_HOY||CCL_HOY):CCL_HOY;
    var priceARS=null,priceUSD=null,valARS=null,valUSD=null;
    if(price!=null){
      if(isARS){
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
    return '<tr>'+
      '<td style="font-weight:600">'+v.ticker+'</td>'+
      '<td class="mono">'+(v.qty||'—')+'</td>'+
      '<td class="mono">'+(priceARS!=null?'$'+Math.round(priceARS).toLocaleString('es-AR'):'—')+'</td>'+
      '<td class="mono">'+fmt(valARS,'$')+'</td>'+
      '<td class="mono">'+fmtD(priceUSD,'u$s ')+'</td>'+
      '<td class="mono">'+fmt(valUSD,'u$s ')+'</td>'+
      '<td class="mono" style="color:'+chgColor+'">'+chgStr+'</td>'+
      '<td><button class="btn btn-d btn-sm" onclick="vigRemove(\''+v.ticker+'\')">✕</button></td>'+
    '</tr>';
  }).join('');
  document.getElementById('vig-tot-ars').textContent=totARS?'$'+Math.round(totARS).toLocaleString('es-AR'):'—';
  document.getElementById('vig-tot-usd').textContent=totUSD?'u$s '+Math.round(totUSD).toLocaleString('es-AR'):'—';
}

var _cmpData={gdc:null,veta:null,portafolio:null,broker:null};
var _cmpNombres={gdc:{},veta:{},portafolio:{},broker:{}};
var _cmpLiqVeta=null; // {ars,usd,usdc} de la hoja Liquidez del xlsx de Veta Capital
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
// Formato nuevo de Veta Capital (xlsx real, hojas Liquidez/Inversiones/Futuros/Opciones,
// header en la 3ra fila de cada hoja). Devuelve null si no es este formato (para poder
// caer al parser viejo del .xls disfrazado de HTML).
function cmpReadVetaWorkbook(ab){
  var wb;
  try{wb=XLSX.read(new Uint8Array(ab),{type:'array'});}catch(ex){return null;}
  var invName=cmpFindSheetName(wb,/inversiones/i);
  if(!invName)return null;
  var invRows=XLSX.utils.sheet_to_json(wb.Sheets[invName],{header:1,defval:''});
  // El ticker viene en "Codigo" (o, en formatos viejos de Veta, "TituloEspecie");
  // "TipoEspecie" es solo la categoría (Cedears/Títulos Públicos/Moneda) y no sirve como header-anchor.
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
      if(tipoCol>=0&&cmpNorm(r[tipoCol])==='moneda')return; // efectivo, ya comparado vía Liquidez
      var ticker=String(r[tCol]||'').trim().toUpperCase();
      if(!ticker)return;
      var q=cmpParseArgNum(r[totCol]);
      if(isNaN(q)||q<=0)return;
      map[ticker]=(map[ticker]||0)+q; // suma Disponible + Garantia
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
      // Veta Capital (formato nuevo): xlsx real con hojas Liquidez/Inversiones/Futuros/Opciones
      var vw=cmpReadVetaWorkbook(ab);
      if(vw){
        _cmpData.veta=vw.positions;
        _cmpNombres.veta=vw.nombres;
        _cmpLiqVeta=vw.liq;
        return;
      }
      _cmpLiqVeta=null;
    }
    // Fallback: formato viejo de Veta (.xls disfrazado de HTML) o archivo GDC (.xlsx con columna Ticker)
    var rows=(who==='veta')?cmpParseHTML(ab):cmpParseRows(ab);
    if(!rows||!rows.length){alert('No se pudo leer el archivo.');return;}
    var isVeta=(who==='veta');
    var hdrIdx=rows.findIndex(function(r){
      return r.some(function(c){
        var s=cmpNorm(c);
        return s==='ticker'||s.includes('nombre de la especie');
      });
    });
    // Fallback Veta: primera fila con 4+ celdas no vacías
    if(hdrIdx<0&&isVeta){
      hdrIdx=rows.findIndex(function(r){
        return r.filter(function(c){return String(c).trim();}).length>=4;
      });
    }
    if(hdrIdx<0){alert('No se encontró la cabecera del archivo.');return;}
    var hdr=rows[hdrIdx].map(cmpNorm);
    var tCol=hdr.indexOf('ticker');
    var nCol=hdr.findIndex(function(c){return c.includes('nombre de la especie');});
    if(isVeta&&nCol<0)nCol=1; // columna fija confirmada del broker
    // Para Veta: Cantidad siempre en col 3 (estructura fija del broker)
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
function calcCCLI(){
  var ars = parseFloat((document.getElementById('ccli-ars').value||'').replace(',','.'));
  var usd = parseFloat((document.getElementById('ccli-usd').value||'').replace(',','.'));
  var el  = document.getElementById('ccli-resultado');
  if(!isNaN(ars) && !isNaN(usd) && usd > 0){
    var ccl = ars / usd;
    el.textContent = '$' + ccl.toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2});
  } else {
    el.textContent = '—';
  }
}

// ─── Tickers cerca del objetivo ───
var NT_THRESHOLD=(function(){
  try{var s=localStorage.getItem((PFX+'ntThreshold'));if(s){var v=parseFloat(s);if(!isNaN(v)&&v>0)return v;}}catch(e){}
  return 4;
})();
function ntSavePersist(){try{localStorage.setItem((PFX+'ntThreshold'),String(NT_THRESHOLD));}catch(e){}}
function ntOnSlider(v){
  var n=parseFloat(v);if(isNaN(n)||n<=0)return;
  NT_THRESHOLD=n;ntSavePersist();
  var inp=document.getElementById('nt-input');if(inp)inp.value=n;
  var lbl=document.getElementById('nt-pct-label');if(lbl)lbl.textContent=(n%1===0?n.toFixed(0):n.toFixed(1))+'%';
  renderNearTarget();
}
function ntOnInput(v){
  var n=parseFloat(String(v).replace(',','.'));if(isNaN(n)||n<=0)return;
  NT_THRESHOLD=n;ntSavePersist();
  var sl=document.getElementById('nt-slider');if(sl&&n<=parseFloat(sl.max))sl.value=n;
  var lbl=document.getElementById('nt-pct-label');if(lbl)lbl.textContent=(n%1===0?n.toFixed(0):n.toFixed(1))+'%';
  renderNearTarget();
}
function renderNearTarget(){
  var card=document.getElementById('near-target-card');
  var grid=document.getElementById('nt-grid');
  if(!card||!grid)return;
  // Sync UI with current threshold
  var inp=document.getElementById('nt-input');if(inp&&parseFloat(inp.value)!==NT_THRESHOLD)inp.value=NT_THRESHOLD;
  var sl=document.getElementById('nt-slider');if(sl&&parseFloat(sl.max)>=NT_THRESHOLD&&parseFloat(sl.value)!==NT_THRESHOLD)sl.value=NT_THRESHOLD;
  var lbl=document.getElementById('nt-pct-label');if(lbl)lbl.textContent=(NT_THRESHOLD%1===0?NT_THRESHOLD.toFixed(0):NT_THRESHOLD.toFixed(1))+'%';

  var all=getPositions();
  var open=all.filter(function(p){return p.qty>0.000001;});
  var items=[];
  open.forEach(function(p){
    var q=quotes[p.ticker];if(!q||q.price==null)return;
    var targetUSD=getTarget(p.ticker);if(targetUSD==null||!(targetUSD>0))return;
    var ratio=getRatio(p.ticker);
    var sector=getSector(p.ticker);
    var _isBonoON=(sector==='bonos'||sector==='on');
    var _isARS=(sector==='argentina'||sector==='bonos'||sector==='on'||sector==='fci');
    var _tcHoy=(_isBonoON||sector==='fci')?(MEP_HOY||CCL_HOY):CCL_HOY;
    // bonos/ON/FCI: ARS→USD via MEP; argentina: ARS→USD via CCL; NYSE: ya en USD
    var _ntFromByma=q.fromByma;
    var priceUSD=_isBonoON?(q.price*ratio/(_tcHoy||1)):(sector==='fci'?q.price/(_tcHoy||1):sector==='argentina'?q.price*ratio/(CCL_HOY||1):BRL_TICKERS.has(p.ticker)?q.price/(CCL_HOY||1):_ntFromByma?q.price*ratio/(CCL_HOY||1):q.price);
    if(!(priceUSD>0))return;
    var upside=(targetUSD-priceUSD)/priceUSD*100;
    if(!(upside>=0)||upside>NT_THRESHOLD)return;
    var mercadoARS=_isARS?q.price:BRL_TICKERS.has(p.ticker)?q.price:_ntFromByma?q.price:(q.price/ratio)*_tcHoy;
    var targetARS=(targetUSD/ratio)*_tcHoy;
    items.push({ticker:p.ticker,priceARS:mercadoARS,targetARS:targetARS,upside:upside});
  });
  items.sort(function(a,b){return a.upside-b.upside;});
  if(!items.length){
    card.style.display='';
    grid.innerHTML='<div class="nt-empty">No hay tickers dentro del umbral configurado</div>';
    return;
  }
  card.style.display='';
  var html=items.map(function(it){
    var pct=it.upside;
    var fill=Math.max(0,Math.min(100,(it.priceARS/it.targetARS)*100));
    var fmt=function(n){return '$'+Math.round(n).toLocaleString('es-AR');};
    var pctStr=(pct%1===0?pct.toFixed(0):pct.toFixed(1))+'%';
    return '<div class="nt-ticker-card">'+
      '<span class="nt-tk-sym">'+it.ticker+'</span>'+
      '<div class="nt-tk-body">'+
        '<div class="nt-tk-progress">'+
          '<div class="nt-tk-pbar"><div class="nt-tk-pbar-fill" style="width:'+fill.toFixed(1)+'%"></div></div>'+
          '<span class="nt-tk-falta">Falta '+pctStr+'</span>'+
        '</div>'+
      '</div>'+
    '</div>';
  }).join('');
  grid.innerHTML=html;
}

// ─── Inversiones Pequeñas ───
var SI_THRESHOLD=(function(){
  try{var s=localStorage.getItem((PFX+'siThreshold'));if(s){var v=parseFloat(s);if(!isNaN(v)&&v>=0)return v;}}catch(e){}
  return 0.5;
})();
function siSavePersist(){try{localStorage.setItem((PFX+'siThreshold'),String(SI_THRESHOLD));}catch(e){}}
function siOnSlider(v){
  var n=parseFloat(v);if(isNaN(n)||n<0)return;
  SI_THRESHOLD=n;siSavePersist();
  var inp=document.getElementById('si-input');if(inp)inp.value=n;
  var lbl=document.getElementById('si-pct-label');if(lbl)lbl.textContent=(n%1===0?n.toFixed(0):n.toFixed(1))+'%';
  renderSmallInv();
}
function siOnInput(v){
  var n=parseFloat(String(v).replace(',','.'));if(isNaN(n)||n<0)return;
  SI_THRESHOLD=n;siSavePersist();
  var sl=document.getElementById('si-slider');if(sl&&n<=parseFloat(sl.max))sl.value=n;
  var lbl=document.getElementById('si-pct-label');if(lbl)lbl.textContent=(n%1===0?n.toFixed(0):n.toFixed(1))+'%';
  renderSmallInv();
}
function renderSmallInv(){
  var card=document.getElementById('small-inv-card');
  var grid=document.getElementById('si-grid');
  if(!card||!grid)return;
  // Sync UI con el umbral actual
  var inp=document.getElementById('si-input');if(inp&&parseFloat(inp.value)!==SI_THRESHOLD)inp.value=SI_THRESHOLD;
  var sl=document.getElementById('si-slider');if(sl&&parseFloat(sl.max)>=SI_THRESHOLD&&parseFloat(sl.value)!==SI_THRESHOLD)sl.value=SI_THRESHOLD;
  var lbl=document.getElementById('si-pct-label');if(lbl)lbl.textContent=(SI_THRESHOLD%1===0?SI_THRESHOLD.toFixed(0):SI_THRESHOLD.toFixed(1))+'%';

  var all=getPositions();
  var open=all.filter(function(p){return p.qty>0.000001;});
  var rvSectors=['nyse','argentina','brasil','europa','china','cripto'];
  var rvSet={};rvSectors.forEach(function(s){rvSet[s]=true;});

  // Total RV a valor de mercado en ARS (misma base que renderPortfolio: colores 2%/3% y % Tipo)
  // Sin cotización → se usa costARS, igual que la columna Inversión $
  var totalRVars=0;
  open.forEach(function(p){
    var sector=getSector(p.ticker);
    if(!rvSet[sector])return;
    var q=quotes[p.ticker];var price=q?q.price:null;
    if(price==null){totalRVars+=(p.costARS||0);return;}
    var ratio=getRatio(p.ticker);
    var _isBRL=BRL_TICKERS.has(p.ticker);
    var fromByma=q&&q.fromByma;
    var mkt=(sector==='argentina'||_isBRL||fromByma)?price:(price/ratio)*CCL_HOY;
    totalRVars+=mkt*p.qty;
  });
  var thresholdARS=totalRVars*(SI_THRESHOLD/100);

  var items=[];
  open.forEach(function(p){
    var sector=getSector(p.ticker);
    if(!rvSet[sector])return;
    var q=quotes[p.ticker];var price=q?q.price:null;
    if(price==null)return;
    var ratio=getRatio(p.ticker);
    var _isBRL=BRL_TICKERS.has(p.ticker);
    var fromByma=q&&q.fromByma;
    var mercadoCedearARS=(sector==='argentina'||_isBRL||fromByma)?price:(price/ratio)*CCL_HOY;
    var inversionARS=mercadoCedearARS*p.qty;
    if(!(inversionARS>0))return;
    if(inversionARS>thresholdARS)return;
    var pctOfRV=totalRVars>0?(inversionARS/totalRVars*100):0;
    items.push({ticker:p.ticker,invARS:inversionARS,pct:pctOfRV});
  });
  items.sort(function(a,b){return a.invARS-b.invARS;});
  if(!items.length){
    card.style.display='';
    grid.innerHTML='<div class="nt-empty">No hay tickers por debajo del umbral configurado</div>';
    return;
  }
  card.style.display='';
  var html=items.map(function(it){
    var fill=thresholdARS>0?Math.max(2,Math.min(100,(it.invARS/thresholdARS)*100)):100;
    var pctStr=(it.pct%1===0?it.pct.toFixed(0):it.pct.toFixed(2))+'%';
    var valStr='$'+Math.round(it.invARS).toLocaleString('es-AR');
    return '<div class="nt-ticker-card">'+
      '<span class="nt-tk-sym">'+it.ticker+'</span>'+
      '<div class="nt-tk-body">'+
        '<div class="nt-tk-progress">'+
          '<div class="nt-tk-pbar"><div class="nt-tk-pbar-fill" style="width:'+fill.toFixed(1)+'%"></div></div>'+
          '<span class="nt-tk-falta">'+valStr+' · '+pctStr+'</span>'+
        '</div>'+
      '</div>'+
    '</div>';
  }).join('');
  grid.innerHTML=html;
}

// ─── Perfil objetivo (comparación cartera vs. composición sugerida) ───
// rubroMap: cómo se agrupa cada Rubro (de la pestaña Rubros) dentro de los baldes de
// sector que define CADA perfil (los tres perfiles usan baldes distintos). Lo que no
// aparece mapeado para un perfil queda afuera de las metas y se muestra como "Otros"
// informativo (sin objetivo) al pie de la tabla de sectores.
// PERFIL_UTILITY_TICKERS: asociación exclusiva de ESTA comparación (no modifica los
// Rubros del portafolio, que quedan con su clasificación original más detallada,
// p.ej. HARG sigue siendo "Construcción" y T/VZ/TECO2 siguen siendo "Telecomunicaciones"
// en la pestaña Rubros). Acá simplemente se los trata como "Utilities" al armar
// la tabla de sectores de Perfil objetivo.
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
    // Original: RF 70-80% incluía "Plazo fijo/Liquidez inmediata: 10-15%" adentro.
    // Se separó en Renta Fija (bonos+ONs+FCI money market, 60-80%) + Liquidez (10-15%)
    // para que sea comparable con cómo la app mide caja (liq-ars/liq-usd) aparte de bonos/ON.
    composicion:{'Renta Variable':[20,30],'Renta Fija':[60,80],'Liquidez':[10,15]},
    // Internacional incluye CEDEARs defensivos (10-15%) + ETFs diversificados (0-5%)
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
      // FCI: renta variable si el fondo está catalogado como tal (FCI_AD_FONDOS), sino renta fija por defecto
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

// Puntaje 0-100 de una categoría contra su rango sugerido:
// 100 si cae adentro del rango; si queda afuera, penaliza según qué tan lejos
// está en relación al ancho del rango (a más ancho el rango, más tolerante).
function _perfilRowScore(val,range){
  if(val>=range[0]&&val<=range[1]) return 100;
  var dist=val<range[0]?range[0]-val:val-range[1];
  var width=Math.max(range[1]-range[0],5);
  return Math.max(0,100-(dist/width)*100);
}
// Puntaje total de un perfil contra la cartera actual (d = computePerfilActual()).
// Promedia por grupo (Composición / Geográfica / Sectores) y luego promedia los
// grupos entre sí, para que un perfil con más filas de sectores no pese de más.
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
function toggleQtyCol(show){
  var grid=document.getElementById('panels-grid');
  if(!grid)return;
  if(show){grid.classList.remove('hide-qty');}else{grid.classList.add('hide-qty');}
  try{localStorage.setItem((PFX+'showQty'),show?'1':'0');}catch(e){}
}
(function initQtyToggle(){
  var show='0';
  try{var s=localStorage.getItem((PFX+'showQty'));if(s!==null)show=s;}catch(e){}
  function apply(){
    var cb=document.getElementById('qty-toggle');var grid=document.getElementById('panels-grid');
    if(cb)cb.checked=(show==='1');
    if(grid&&show!=='1')grid.classList.add('hide-qty');
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',apply);}else{apply();}
})();

// ─── Toggle columna P. Venta (oculta por defecto) ───
// ─── Orden de las tablas del Portafolio al hacer click en el título de la columna ───
var PANEL_SORT={}; // tbodyId -> {col, dir}  (dir 1 = asc, -1 = desc)
function _psNum(txt){
  if(txt==null)return null;
  txt=String(txt).replace(/−/g,'-');
  var m=txt.match(/-?\d[\d.,]*/);if(!m)return null;
  var s=m[0].replace(/[.,]$/,'');
  if(s.indexOf(',')!==-1)s=s.replace(/\./g,'').replace(',','.');
  else if(/^-?\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');
  var n=parseFloat(s);return isNaN(n)?null:n;
}
function _psKey(td,col){
  if(!td)return null;
  if(col===0){var b=td.querySelector('[data-ticker]');var t=(b?b.getAttribute('data-ticker'):td.textContent)||'';t=t.trim().toUpperCase();return t||null;}
  if(col===1){var sp=td.querySelector('span>span');return _psNum(sp?sp.textContent:td.textContent);}
  return _psNum(td.textContent);
}
function panelSortApply(tbody){
  if(!tbody||!tbody.id)return;
  var table=tbody.parentNode;
  var st=PANEL_SORT[tbody.id];
  var ths=(table&&table.tHead&&table.tHead.rows[0])?table.tHead.rows[0].cells:[];
  for(var i=0;i<ths.length;i++){
    var th=ths[i];
    if(tbody.id==='body-fci'&&i>4)continue;
    var a=th.querySelector('.ps-arrow');
    if(!a){a=document.createElement('span');a.className='ps-arrow';th.appendChild(a);th.classList.add('ps-sortable');if(!th.title)th.title='Click para ordenar';}
    a.textContent=(st&&st.col===i)?(st.dir>0?' ▲':' ▼'):'';
  }
  var rows=Array.prototype.slice.call(tbody.rows);
  rows.forEach(function(r,i){if(r.dataset.psIdx==null)r.dataset.psIdx=i;});
  rows.sort(function(a,b){
    var ia=+a.dataset.psIdx,ib=+b.dataset.psIdx;
    if(!st)return ia-ib;
    var ka=_psKey(a.cells[st.col],st.col),kb=_psKey(b.cells[st.col],st.col);
    if(ka==null&&kb==null)return ia-ib;
    if(ka==null)return 1;if(kb==null)return -1;
    var c=(typeof ka==='string'||typeof kb==='string')?String(ka).localeCompare(String(kb)):(ka-kb);
    return (c*st.dir)||(ia-ib);
  });
  rows.forEach(function(r){tbody.appendChild(r);});
}
function panelSortClick(th){
  var table=th.closest('table');var tbody=table&&table.tBodies[0];
  if(!tbody||!tbody.id)return;
  var col=th.cellIndex;
  if(tbody.id==='body-fci'&&col>4)return;
  var firstDir=col===0?1:-1;
  var st=PANEL_SORT[tbody.id];
  if(!st||st.col!==col)PANEL_SORT[tbody.id]={col:col,dir:firstDir};
  else if(st.dir===firstDir)st.dir=-firstDir;
  else delete PANEL_SORT[tbody.id];
  panelSortApply(tbody);
}
document.addEventListener('click',function(e){
  var th=e.target&&e.target.closest?e.target.closest('#panels-grid .panel-table thead th'):null;
  if(th)panelSortClick(th);
});

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
  // Barra objetivo: centro de cada rango, normalizado a 100%
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
  // Plan de rebalanceo (órdenes de la columna Rebalanceo + lo que pide el perfil por tipo)
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
// Flujos por ticker del ciclo de tenencia actual
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
    var com=directo?(m.comision||0):((m.comision||0)/(tc>0?tc:1)); // la comisión se guarda en ARS (en USD solo para bonos comprados en dólares)
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
  // Dividendos registrados (sección Dividendos)
  try{if(typeof dividendos!=='undefined')(dividendos||[]).forEach(function(dv){
    var t=dv&&dv.ticker;if(!t||!res[t])return;var d=_paParseFecha(dv.fecha);if(!d||d<res[t].start)return;
    var usd=dv.usd||0;if(!usd&&(dv.ars||0)>0){var tc=getCCL(dv.fecha)||dv.ccl||CCL_HOY;if(tc>0)usd=dv.ars/tc;}
    if(usd>0)res[t].flows.push({d:d,v:usd,lbl:'Dividendo'});
  });}catch(e){}
  // Dividendos / rentas CCL (TRK.divs confirmados)
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
// Calcula % anual (o simple si < 90 días) para un conjunto de flujos + valor de hoy
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
function _paDur(days){var a=Math.floor(days/365),m=Math.floor((days%365)/30.4);if(a>0)return a+'a'+(m>0?' '+m+'m':'');if(m>0)return m+'m';return days+' día'+(days!==1?'s':'');}
function paCellHTML(ticker,r,compras,tag){
  if(!r||(r.anual==null&&r.simple==null))return '<span style="color:var(--text3)">—</span>';
  var f1=function(n){return (n>0?'+':'')+n.toLocaleString('es-AR',{minimumFractionDigits:1,maximumFractionDigits:1})+'%';};
  var txt,col;
  if(r.anual!=null){txt=f1(r.anual);col=r.anual>10?'var(--accent)':r.anual<0?'var(--red)':'var(--text2)';}
  else{txt=f1(r.simple)+' <span style="font-size:.6rem">s/anualizar</span>';col='var(--text3)';}
  var sub=tag||(_paDur(r.days)+(compras!=null?' · '+compras+' compra'+(compras!==1?'s':''):''));
  var _sd=paSpyDiff(r);
  if(_sd!=null)sub+='<div style="font-size:.58rem;color:'+(_sd>=0?'var(--accent)':'var(--red)')+'">vs SPY '+(_sd>=0?'+':'')+_sd.toLocaleString('es-AR',{minimumFractionDigits:1,maximumFractionDigits:1})+' pp</div>';
  return '<span class="pa-cell" data-ticker="'+String(ticker).replace(/"/g,'&quot;')+'" onclick="event.stopPropagation();paShowDetalle(this.dataset.ticker,this)" style="cursor:pointer;color:'+col+';font-weight:700">'+txt+'</span>'+
    '<div style="font-size:.6rem;color:var(--text3);font-weight:400">'+sub+'</div>';
}
function paShowDetalle(key,anchor){
  if(!SPY_HIST)fetchSPYHist();
  var r=PA_LAST[key];var old=document.getElementById('pa-pop');if(old){var same=old.dataset.key===key;old.remove();if(same)return;}
  if(!r)return;
  var pop=document.createElement('div');pop.id='pa-pop';pop.dataset.key=key;
  pop.style.cssText='position:fixed;z-index:9999;max-width:440px;width:calc(100vw - 32px);background:var(--surface);border:1px solid var(--border2);border-radius:8px;padding:.7rem .85rem;font-family:var(--mono);font-size:.7rem;color:var(--text2);box-shadow:0 8px 24px rgba(0,0,0,.45)';
  var usd=function(v){return (v>0?'+':v<0?'−':'')+Math.abs(Math.round(v)).toLocaleString('es-AR');};
  var rows=r.flows.map(function(f){return '<tr><td style="padding:.2rem .4rem">'+f.d.toLocaleDateString('es-AR')+'</td><td style="padding:.2rem .4rem">'+f.lbl+'</td><td style="padding:.2rem .4rem;text-align:right;color:'+(f.v<0?'var(--red)':'var(--accent)')+'"><span class="port-sensitive">'+usd(f.v)+'</span></td></tr>';}).join('');
  var res=r.anual!=null?'<b style="color:'+(r.anual>10?'var(--accent)':r.anual<0?'var(--red)':'var(--text)')+'">'+(r.anual>0?'+':'')+r.anual.toFixed(1).replace('.',',')+'% anual</b>':(r.simple!=null?'<b>'+(r.simple>0?'+':'')+r.simple.toFixed(1).replace('.',',')+'% (sin anualizar, menos de 90 días)</b>':'—');
  pop.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b style="color:var(--text);font-size:.78rem">'+(r.titulo||key)+' · rendimiento en USD</b><span style="cursor:pointer;color:var(--text3)" onclick="document.getElementById(\'pa-pop\').remove()">✕</span></div>'+
    '<div style="max-height:260px;overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:.2rem .4rem;color:var(--text3);font-size:.6rem">FECHA</th><th style="text-align:left;padding:.2rem .4rem;color:var(--text3);font-size:.6rem">MOVIMIENTO</th><th style="text-align:right;padding:.2rem .4rem;color:var(--text3);font-size:.6rem">USD</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '<div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:6px;border-top:1px solid var(--border)"><span>Ganancia USD <span class="port-sensitive">'+usd(r.gan)+'</span> · '+_paDur(r.days)+'</span>'+res+'</div>'+
    (function(){var sd=paSpyDiff(r);if(!r.spy)return '<div style="margin-top:6px;font-size:.62rem;color:var(--text3)">Comparación con SPY: '+(SPY_KEYS?'sin datos de SPY para esas fechas':'cargando historial de SPY…')+'</div>';var sv=r.anual!=null?r.spy.anual:r.spy.simple;if(sv==null)return '';return '<div style="margin-top:6px;font-size:.66rem">Mismo dinero y fechas en SPY: <b>'+(sv>0?'+':'')+sv.toFixed(1).replace('.',',')+'%'+(r.anual!=null?' anual':'')+'</b>'+(sd!=null?' → <b style="color:'+(sd>=0?'var(--accent)':'var(--red)')+'">'+(sd>=0?'le ganaste por ':'perdiste por ')+Math.abs(sd).toFixed(1).replace('.',',')+' pp</b>':'')+'</div>';})()+
    '<div style="margin-top:6px;font-size:.6rem;color:var(--text3)">Compras/ventas a USD con el CCL de cada fecha (MEP para Bonos, ON y FCI); valor de hoy a mercado.</div>';
  document.body.appendChild(pop);
  var rc=anchor.getBoundingClientRect(),ph=pop.offsetHeight,pw=pop.offsetWidth;
  var top=rc.bottom+6;if(top+ph>window.innerHeight-8)top=Math.max(8,rc.top-ph-6);
  var left=Math.min(Math.max(8,rc.left),window.innerWidth-pw-8);
  pop.style.top=top+'px';pop.style.left=left+'px';
}
document.addEventListener('click',function(e){var p=document.getElementById('pa-pop');if(p&&!p.contains(e.target)&&!(e.target.closest&&e.target.closest('.pa-cell')))p.remove();});

// ─── Carga diferida de librerías (mapa mundial) ───
function loadScriptOnce(src){
  window._lsoP=window._lsoP||{};
  if(!window._lsoP[src])window._lsoP[src]=new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=res;s.onerror=function(){delete window._lsoP[src];rej(new Error('No se pudo cargar '+src));};document.head.appendChild(s);});
  return window._lsoP[src];
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
async function fetchSPYHist(force){
  var hoy=_hoyLocalISO();
  if(_spyLoading)return;if(!force&&SPY_HIST&&window._spyDay===hoy)return;
  _spyLoading=true;
  var url='https://query2.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=10y';
  var tries=[
    function(){return fetchWithTimeout('https://api.allorigins.win/get?url='+encodeURIComponent(url),{},12000).then(function(r){return r.ok?r.json():Promise.reject('!ok');}).then(function(j){return JSON.parse(j.contents||'{}');});},
    function(){return fetchWithTimeout('https://corsproxy.io/?url='+encodeURIComponent(url),{},12000).then(function(r){return r.ok?r.json():Promise.reject('!ok');});},
    function(){return fetchWithTimeout('https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(url),{},12000).then(function(r){return r.ok?r.json():Promise.reject('!ok');});}
  ];
  try{
    for(var i=0;i<tries.length;i++){
      try{
        var j=await tries[i]();var res=j&&j.chart&&j.chart.result&&j.chart.result[0];if(!res||!res.timestamp)continue;
        var adj=res.indicators&&res.indicators.adjclose&&res.indicators.adjclose[0]&&res.indicators.adjclose[0].adjclose;
        var cl=adj||(res.indicators&&res.indicators.quote&&res.indicators.quote[0]&&res.indicators.quote[0].close);if(!cl)continue;
        var data={};res.timestamp.forEach(function(t,k){if(cl[k]!=null)data[new Date(t*1000).toISOString().slice(0,10)]=Math.round(cl[k]*100)/100;});
        if(Object.keys(data).length<200)continue;
        SPY_HIST=data;SPY_KEYS=Object.keys(data).sort();window._spyDay=hoy;
        try{localStorage.setItem(SPY_LS_KEY,JSON.stringify({day:hoy,data:data}));}catch(e){}
        try{renderPortfolio();}catch(e){}
        return;
      }catch(e){}
    }
    console.warn('[SPY] no se pudo obtener el historial');
  } finally {_spyLoading=false;}
}
function _spyAt(d){
  if(!SPY_KEYS||!SPY_KEYS.length)return null;
  var k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  if(k<SPY_KEYS[0])return null;
  var lo=0,hi=SPY_KEYS.length-1;while(lo<hi){var mid=(lo+hi+1)>>1;if(SPY_KEYS[mid]<=k)lo=mid;else hi=mid-1;}
  return SPY_HIST[SPY_KEYS[lo]];
}
// Mismo dinero, mismas fechas, en SPY: devuelve {anual|simple}
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
function paSpyDiff(r){
  if(!r||!r.spy)return null;
  if(r.anual!=null&&r.spy.anual!=null)return r.anual-r.spy.anual;
  if(r.anual==null&&r.simple!=null&&r.spy.simple!=null)return r.simple-r.spy.simple;
  return null;
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
  var tickerRe=/^[A-Z][A-Z0-9]{1,7}$/;
  var map={};
  for(var i=0;i<lines.length;i++){
    var line=lines[i].trim();
    if(!tickerRe.test(line))continue;
    var ticker=line;
    var j=i+1;
    while(j<lines.length&&!lines[j].trim())j++;
    if(j>=lines.length)continue;
    if(lines[j].indexOf('\t')===-1){
      // Bull siempre agrega una línea de descripción del activo entre el ticker y la
      // fila de datos (ej: 'ABEV' / 'CEDEAR AMBEV S.A.' / '106,00\tUSD 8,98\t...') — saltarla.
      j++;
      while(j<lines.length&&!lines[j].trim())j++;
    }
    if(j>=lines.length)continue;
    var dataLine=lines[j];
    if(dataLine.indexOf('\t')===-1)continue;
    var cols=dataLine.trim().split('\t');
    if(cols.length<2)continue;
    // La primera columna de la fila de datos es la Cantidad (no la segunda).
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
    // Serial Excel (días desde 1899-12-30) — mismo criterio que el importador de movimientos Bull Market
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
// Después de cada render (con cotizaciones cargadas) se guarda en config 'resumen_familia' un
// resumen de lo calculado. Familia/index.html lee los 5 resúmenes. Se guarda como mucho cada
// 3 minutos salvo que el total cambie más de 0,5%. Con varias carteras (Omar) se guarda una
// entrada por cartera.
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
    doc.carteras[cart]={ts:now,totalVal:d.totalVal,totalCost:d.totalCost,sectorVal:d.sectorVal,dolzPct:d.dolzPct,pos:d.pos,rend:d.rendPct};
    if(cart==='principal'||doc.rend==null){doc.rend=d.rendPct;doc.invInicial=d.invInicial||null;}
    doc.periodoInicio=CFG.periodoInicio||null;
    if(CFG.honorario){try{await honCargar();doc.honorarios=HON_LIST||[];}catch(e){}}
    // cobros (dividendos, rentas, amortizaciones) confirmados por mes, en USD — para "Tus ingresos" del index
    try{var _cm={};(TRK.divs||[]).forEach(function(x){if(x.estado==='pendiente'||(x.cartera&&x.cartera!==cart))return;var f=_infISO(x.fecha);if(!f)return;
      var u=x.montoUSD!=null&&x.montoUSD!==''?+x.montoUSD:(x.moneda==='USD'?+x.monto:(+x.monto)/((x.cclUsado||CCL_HOY)||1));if(!(u>0))return;var k=f.slice(0,7);_cm[k]=Math.round(((_cm[k]||0)+u)*100)/100;});
      if(cart==='principal')doc.cobradosMes=_cm;}catch(e){}
    _famPrev=doc;
    var ok=await sbSetConfig('resumen_familia',doc);
    if(ok){_famLastSave=now;_famLastTotal=tot;}
    try{await histRecord(d,cart);}catch(e){console.warn('histRecord',e);}
  }catch(e){console.warn('famSaveSnapshot',e);}
}

// ─── Backups (plan Free de Supabase no tiene backups descargables) ─────────────
// Copia completa diaria en config 'backup_AAAA-MM-DD' (+ 'backup_AAAA-MM-DD_HHMM_prerestore' antes de
// restaurar). Se conservan los últimos BK_KEEP backups diarios.
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
// Botón "Backups" en el encabezado
document.addEventListener('DOMContentLoaded',function(){
  if(document.getElementById('bk-btn'))return;
  var ref=document.querySelector('[onclick="exportPortfolioXLS()"]')||document.getElementById('sync-btn')||document.querySelector('[onclick*="EnComparacion()"]');
  if(!ref)return;
  var b=document.createElement('button');b.id='bk-btn';b.className='btn-sidebar-toggle';b.title='Backups diarios: descargar o restaurar';b.textContent='💾';
  b.style.cssText='width:auto;padding:0 8px;font-size:.72rem';b.onclick=bkOpen;ref.parentNode.insertBefore(b,ref.nextSibling);
});

// ─── Historial diario y corte anual ───────────────────────────────────────────
// config 'historial' = {v:1, puntos:[{d:'AAAA-MM-DD', c:{cartera:{v,cost}}, liq, inv, rend}], cierres:[{d, valor, invAnterior}]}
var HIST=null,_histLoaded=false,HIST_RANGO=null,_histChart=null;
function _hHoy(){return _bkHoy();}
async function histLoad(){
  // Sólo se da por cargado si Supabase respondió bien: si falla, no se crea un historial vacío
  // (que después pisaría el guardado).
  if(_histLoaded)return HIST;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/config?key=eq.historial&select=value',{headers:sbHeaders()});
    if(!r.ok)return null;
    var d=await r.json();if(!Array.isArray(d))return null;
    var h=d[0]?d[0].value:null;if(typeof h==='string'){try{h=JSON.parse(h);}catch(e){h=null;}}
    HIST=(h&&typeof h==='object'&&Array.isArray(h.puntos))?h:{v:1,puntos:[],cierres:[]};
    if(!HIST.cierres)HIST.cierres=[];
    if(CFG.histDesdeRA)await histCargarRA();
    _histLoaded=true;return HIST;
  }catch(e){return null;}
}
async function histRecord(d,cart){
  if(!(await histLoad()))return;
  var hoy=_hHoy(),pts=HIST.puntos,p=pts.length&&pts[pts.length-1].d===hoy?pts[pts.length-1]:null;
  if(!p){p={d:hoy,c:{}};pts.push(p);}
  p.c[cart]={v:Math.round(d.totalVal*100)/100,cost:Math.round(d.totalCost*100)/100};
  p.liq=Math.round((d.liqTotalUSD||0)*100)/100;
  if(cart==='principal'||p.rend==null){p.rend=d.rendPct!=null?Math.round(d.rendPct*100)/100:null;p.inv=d.invInicial||null;}
  await sbSetConfig('historial',HIST);
  histRender();
}
// Serie de valor total por día (con carteras que no se abrieron ese día arrastrando su último valor)
function histSerie(){
  if(!HIST)return [];
  var last={},out=[];
  // Puntos de años anteriores cargados a mano (CFG.histPrevio: [[fecha, valorTotal, inversionInicial], ...])
  var primero=HIST.puntos.length?HIST.puntos[0].d:'9999';
  (CFG.histPrevio||[]).slice().sort(function(a,b){return a[0]<b[0]?-1:1;}).forEach(function(x){if(x[0]<primero)out.push({d:x[0],v:x[1],pos:x[1],cost:null,inv:x[2]||null,rend:null,previo:true});});
  // CFG.histCarteras: qué carteras suman al gráfico (Omar: solo 'principal'; Cocos y VetaJeep no)
  var incl=CFG.histCarteras||null;
  HIST.puntos.forEach(function(p){Object.keys(p.c||{}).forEach(function(k){if(!incl||incl.indexOf(k)>=0)last[k]=p.c[k];});
    var v=0,cost=0;Object.keys(last).forEach(function(k){v+=last[k].v;cost+=last[k].cost;});
    out.push({d:p.d,v:v+(p.liq||0),pos:v,cost:cost,inv:p.inv,rend:p.rend});});
  return out;
}
// Fecha del último corte anual <= hoy (AAAA-MM-DD) según CFG.periodoInicio ('MM-DD')
// Años anteriores tomados de la solapa "Rendimiento anual" (config rendanual_periodos), columna TOTAL:
// % = (tenés − pusiste) / pusiste, sin descontar el 20%. El último período es el que está en curso
// (su "pusiste" es la inversión inicial actual), así que se usan los anteriores. Cada período se ubica
// contando hacia atrás desde el último corte (CFG.periodoInicio).
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
  // aviso de cierre de período
  var ci=document.getElementById('hist-cierre');
  var pend=corte&&!HIST.cierres.some(function(x){return x.d===corte;})&&(new Date(_hHoy())-new Date(corte))/86400000<=20&&ult;
  ci.innerHTML=pend?'<div style="margin:.6rem 1rem 0;padding:.5rem .7rem;border:1px solid var(--amber);border-radius:var(--rsm);background:rgba(234,179,8,.08);font-family:var(--mono);font-size:.72rem">📅 Se cumplió el corte anual ('+corte.split('-').reverse().join('/')+'). <button class="btn btn-sm" onclick="histCerrarPeriodo()" style="margin-left:6px">Cerrar período</button> <span style="color:var(--text3)">nueva inversión inicial = valor total de hoy</span></div>':'';
  // cortes dentro del rango
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
  if(typeof Chart==='undefined')return;
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
// Rendimiento por período: años anteriores (CFG.rendAnual {'2023':300,...}, el año es el del INICIO del
// período) + cierres registrados + período en curso; y el acumulado compuesto.
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
    '<div style="margin-left:auto;text-align:right;font-family:var(--mono)"><div style="font-size:.58rem;color:var(--text3);text-transform:uppercase;letter-spacing:.07em">Acumulado desde '+lbl(ys[0])+'</div><div style="font-size:1.15rem;font-weight:700;color:'+(acc>=1?'var(--accent)':'var(--red)')+'">'+(acc>=1?'+':'')+Math.round((acc-1)*100).toLocaleString('es-AR')+'%</div><div style="font-size:.62rem;color:var(--text2)">×'+acc.toFixed(2).replace('.',',')+' lo invertido</div></div></div>'+
    '<div style="font-family:var(--mono);font-size:.6rem;color:var(--text3);margin-top:6px">Barras en escala √ para que se vean los años chicos al lado de los grandes. El año en curso usa el Rendimiento del Resumen.</div>';
}
async function histCerrarPeriodo(){
  var corte=histUltimoCorte();var serie=histSerie();var ult=serie[serie.length-1];
  if(!corte||!ult)return;
  var nueva=Math.round(ult.v);var ant=getRawNum('inv-sidebar-usd');
  if(!confirm('Cerrar el período al '+corte.split('-').reverse().join('/')+'?\n\nInversión inicial actual: USD '+Math.round(ant).toLocaleString('es-AR')+'\nNueva inversión inicial: USD '+nueva.toLocaleString('es-AR')+' (valor total de hoy)\n\nEl rendimiento empieza a contarse de nuevo desde acá.'))return;
  HIST.cierres.push({d:corte,valor:nueva,invAnterior:ant,rendFinal:ult.rend,fechaCierre:_hHoy()});
  await sbSetConfig('historial',HIST);
  setFmtNum('inv-sidebar-usd',nueva,0);saveInvInicial(nueva);
  var di=document.getElementById('inv-inicial-usd-display');if(di)di.textContent='$'+nueva.toLocaleString('es-AR');
  renderPortfolio();histRender();
}
(function _histBoot(n){setTimeout(function(){if(typeof _gdcInitDone!=='undefined'&&_gdcInitDone){if(CFG.historial)histLoad().then(function(h){if(h)histRender();});}else if(n<30)_histBoot(n+1);},2000);})(0);

function togglePVentaCol(show){
  var grid=document.getElementById('panels-grid');
  if(!grid)return;
  if(show){grid.classList.remove('hide-pventa');}else{grid.classList.add('hide-pventa');}
  try{localStorage.setItem((PFX+'showPVenta'),show?'1':'0');}catch(e){}
}
(function initPVentaToggle(){
  var show='0';
  try{var s=localStorage.getItem((PFX+'showPVenta'));if(s!==null)show=s;}catch(e){}
  function apply(){
    var cb=document.getElementById('pventa-toggle');var grid=document.getElementById('panels-grid');
    if(cb)cb.checked=(show==='1');
    if(grid&&show!=='1')grid.classList.add('hide-pventa');
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',apply);}else{apply();}
})();

// ─── Toggle columna % Tipo (oculta por defecto) ───
function togglePTipoCol(show){
  var grid=document.getElementById('panels-grid');
  if(!grid)return;
  if(show){grid.classList.remove('hide-ptipo');}else{grid.classList.add('hide-ptipo');}
  try{localStorage.setItem((PFX+'showPTipo'),show?'1':'0');}catch(e){}
}
(function initPTipoToggle(){
  var show='0';
  try{var s=localStorage.getItem((PFX+'showPTipo'));if(s!==null)show=s;}catch(e){}
  function apply(){
    var cb=document.getElementById('ptipo-toggle');var grid=document.getElementById('panels-grid');
    if(cb)cb.checked=(show==='1');
    if(grid){if(show==='1')grid.classList.remove('hide-ptipo');else grid.classList.add('hide-ptipo');}
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',apply);}else{apply();}
})();

// ─── Toggle columna Rebalanceo (oculta por defecto) ───
function toggleRebalCol(show){
  var grid=document.getElementById('panels-grid');
  if(!grid)return;
  if(show){grid.classList.remove('hide-rebal');}else{grid.classList.add('hide-rebal');}
  try{localStorage.setItem((PFX+'showRebal'),show?'1':'0');}catch(e){}
}
(function initRebalToggle(){
  var show='0';
  try{var s=localStorage.getItem((PFX+'showRebal'));if(s!==null)show=s;}catch(e){}
  function apply(){
    var cb=document.getElementById('rebal-toggle');var grid=document.getElementById('panels-grid');
    if(cb)cb.checked=(show==='1');
    if(grid){if(show==='1')grid.classList.remove('hide-rebal');else grid.classList.add('hide-rebal');}
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',apply);}else{apply();}
})();

// ─── Toggle columna % Anual (oculta por defecto) ───
function togglePAnualCol(show){
  var grid=document.getElementById('panels-grid');
  if(!grid)return;
  if(show){grid.classList.remove('hide-panual');try{fetchSPYHist();}catch(e){}}else{grid.classList.add('hide-panual');}
  try{localStorage.setItem((PFX+'showPAnual'),show?'1':'0');}catch(e){}
}
(function initPAnualToggle(){
  var show='0';
  try{var s=localStorage.getItem((PFX+'showPAnual'));if(s!==null)show=s;}catch(e){}
  function apply(){
    var cb=document.getElementById('panual-toggle');var grid=document.getElementById('panels-grid');
    if(cb)cb.checked=(show==='1');
    if(grid){if(show==='1'){grid.classList.remove('hide-panual');setTimeout(function(){try{fetchSPYHist();}catch(e){}},3000);}else grid.classList.add('hide-panual');}
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',apply);}else{apply();}
})();

// ─── VetaMovim (laboratorio de importación de movimientos, NO impacta portafolio) ───
var VM_ROWS=[];
function vmAddRow(){
  VM_ROWS.push({fecha:'',ticker:'',tipo:'',cant:'',precio:'',moneda:'USD',total:'',notas:''});
  vmRender();
}
function vmDelRow(i){
  if(i<0||i>=VM_ROWS.length)return;
  VM_ROWS.splice(i,1);
  vmRender();
}
function vmEditRow(i,field,val){
  if(!VM_ROWS[i])return;
  VM_ROWS[i][field]=val;
}
function vmClearAll(){
  if(!VM_ROWS.length)return;
  if(!confirm('¿Vaciar toda la tabla VetaMovim?'))return;
  VM_ROWS=[];
  vmRender();
}
function vmRender(){
  var body=document.getElementById('vm-body');
  if(!body)return;
  if(!VM_ROWS.length){
    body.innerHTML='<tr><td colspan="10" class="empty-state" style="padding:1.5rem">Sin movimientos cargados — usá "+ Fila" o esperá a que mapeemos la estructura de importación</td></tr>';
    return;
  }
  var inp=function(i,field,val,w){
    return '<input class="arb-input" style="width:'+(w||'100%')+';text-align:left;padding:3px 5px;font-size:.72rem" value="'+(val||'')+'" oninput="vmEditRow('+i+',\''+field+'\',this.value)">';
  };
  var html=VM_ROWS.map(function(r,i){
    return '<tr>'+
      '<td class="mono muted" style="font-size:.7rem">'+(i+1)+'</td>'+
      '<td>'+inp(i,'fecha',r.fecha,'95px')+'</td>'+
      '<td>'+inp(i,'ticker',r.ticker,'80px')+'</td>'+
      '<td>'+inp(i,'tipo',r.tipo,'90px')+'</td>'+
      '<td>'+inp(i,'cant',r.cant,'80px')+'</td>'+
      '<td>'+inp(i,'precio',r.precio,'90px')+'</td>'+
      '<td>'+inp(i,'moneda',r.moneda,'65px')+'</td>'+
      '<td>'+inp(i,'total',r.total,'100px')+'</td>'+
      '<td>'+inp(i,'notas',r.notas,'140px')+'</td>'+
      '<td><button class="btn btn-d btn-sm" onclick="vmDelRow('+i+')" title="Eliminar">✕</button></td>'+
    '</tr>';
  }).join('');
  body.innerHTML=html;
}

function renderDivsCard(){} // card "Dividendos cobrados" eliminada de la portada (2026-10-03)


// fetchWithTimeout: fetch con AbortController, timeout en ms
function fetchWithTimeout(url, opts, ms){
  ms=ms||7000;
  var ctrl=new AbortController();
  var tid=setTimeout(function(){ctrl.abort();},ms);
  return fetch(url,Object.assign({},opts||{},{signal:ctrl.signal}))
    .finally(function(){clearTimeout(tid);});
}

// Parsea respuesta Yahoo chart/meta
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
    // arg_cedears/arg_notes no traen prev_close/prevClose/etc, pero sí pct_change — se usa
    // para derivar el cierre anterior en vez de caer a "sin variación" (prev=price).
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
// Bonos soberanos: arg_bonds
async function fetchBonosAPI(){
  var r=await fetchWithTimeout('https://data912.com/live/arg_bonds',{headers:{'Accept':'application/json'}},8000);
  if(!r.ok)throw new Error('HTTP '+r.status);
  return parseData912Response(await r.json());
}
// ONs corporativas: arg_corp
async function fetchONsAPI(){
  var r=await fetchWithTimeout('https://data912.com/live/arg_corp',{headers:{'Accept':'application/json'}},8000);
  if(!r.ok)throw new Error('HTTP '+r.status);
  return parseData912Response(await r.json());
}
// Acciones argentinas: arg_eq
async function fetchArgEqAPI(){
  var r=await fetchWithTimeout('https://data912.com/live/arg_stocks',{headers:{'Accept':'application/json'}},8000);
  if(!r.ok)throw new Error('HTTP '+r.status);
  return parseData912Response(await r.json());
}
// CEDEARs en BYMA (acciones extranjeras listadas como CEDEAR, ej. GLOB, BIOX — data912 las separa
// de arg_stocks, que es solo para acciones nativas argentinas). Fallback para 'argentina' cuando
// arg_stocks no cubre el ticker.
async function fetchArgCedearsAPI(){
  var r=await fetchWithTimeout('https://data912.com/live/arg_cedears',{headers:{'Accept':'application/json'}},8000);
  if(!r.ok)throw new Error('HTTP '+r.status);
  return parseData912Response(await r.json());
}
// ONs/notas que data912 no clasifica en arg_corp (ej. D31M7). Fallback adicional para ON.
async function fetchArgNotesAPI(){
  var r=await fetchWithTimeout('https://data912.com/live/arg_notes',{headers:{'Accept':'application/json'}},8000);
  if(!r.ok)throw new Error('HTTP '+r.status);
  return parseData912Response(await r.json());
}

async function fetchYahooAR(ticker,suffix){
  var symbol=ticker+(suffix||'.BA');
  var chartUrl='https://query2.finance.yahoo.com/v8/finance/chart/'+encodeURIComponent(symbol)+'?interval=1d&range=2d';
  var quoteUrl='https://query2.finance.yahoo.com/v7/finance/quote?symbols='+encodeURIComponent(symbol)+'&corsDomain=finance.yahoo.com&formatted=false&lang=en-US&region=AR';

  // Lanzar todos los proxies en PARALELO y tomar el primero que responda bien
  var proxies=[
    // directo v7
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
    // allorigins
    fetchWithTimeout('https://api.allorigins.win/get?url='+encodeURIComponent(chartUrl),{},7000)
      .then(function(r){return r.ok?r.json():Promise.reject('!ok');})
      .then(function(j){var d=JSON.parse(j.contents||'{}');var q=parseYahooChart(d);return q||Promise.reject('no price');}),
    // codetabs (reemplaza a thingproxy.freeboard.io, que dejo de resolver DNS — ERR_NAME_NOT_RESOLVED)
    fetchWithTimeout('https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(chartUrl),{},7000)
      .then(function(r){return r.ok?r.json():Promise.reject('!ok');})
      .then(function(j){var q=parseYahooChart(j);return q||Promise.reject('no price');}),
    // allorigins /raw (endpoint alternativo, bucket de rate-limit distinto al /get de arriba —
    // reemplaza a jsonp.afeld.me, que tambien dejo de resolver DNS)
    fetchWithTimeout('https://api.allorigins.win/raw?url='+encodeURIComponent(chartUrl),{},7000)
      .then(function(r){return r.ok?r.json():Promise.reject('!ok');})
      .then(function(j){var q=parseYahooChart(j);return q||Promise.reject('no price');})
  ];

  // Promise.any: primer éxito gana
  if(typeof Promise.any==='function'){
    return Promise.any(proxies).catch(function(){throw new Error('Sin datos para '+ticker);});
  }
  // Fallback para browsers viejos: manual race de éxitos
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
  _quoteRunId++; // nueva corrida: lo que no se refresque en este ciclo queda marcado "stale"
  // NO limpiar quotes — mantener cotizaciones viejas hasta que lleguen las nuevas
  try{localStorage.removeItem((PFX+'q3'));localStorage.removeItem((PFX+'q3_ts'));}catch(e){}
  var icon=document.getElementById('ref-icon');var status=document.getElementById('ref-status');var prog=document.getElementById('pos-prog');var pfill=document.getElementById('pfill');
  icon.innerHTML='<span class="spinner"></span>';prog.style.display='';pfill.style.width='0%';

  // Estrategia de cotizaciones:
  // FASE 1 (paralelo): Yahoo .BA para TODO (acciones argentinas, CEDEARs USA/Brasil/Europa/China/Cripto)
  //   - argentina: precio ARS directo, sin normalizar
  //   - todos los demás no-BRL: normalizar ARS→USD-equiv (price*ratio/CCL_HOY) para que
  //     renderPortfolio pueda hacer (price/ratio)*CCL_HOY y recuperar el precio BYMA real
  // FASE 2 (secuencial): Finnhub fallback SOLO para tickers donde Yahoo falló
  //   - aplica a nyse/brasil/europa/china/cripto (no a argentina: no tiene equiv. NYSE)
  //   - Finnhub devuelve USD por acción subyacente, renderPortfolio lo convierte igual
  // Bonos/ONs: data912 como siempre (paralelo con Fase 1)

  // 'argentina' se maneja aparte (fetchArgAll): antes dependía únicamente de Yahoo .BA a
  // través de la cadena de proxies públicos (allorigins/corsproxy/thingproxy/jsonp.afeld),
  // que suele fallar entera y dejaba las acciones locales sin cotización nueva. data912
  // expone /live/arg_stocks (misma familia de API ya usada y confiable para bonos/ONs) — se usa como
  // fuente primaria y Yahoo .BA queda de fallback por ticker.
  var bymaPos=pos.filter(function(p){var s=getSector(p.ticker);return s!=='bonos'&&s!=='on'&&s!=='fci'&&s!=='argentina';});
  var argPos=pos.filter(function(p){return getSector(p.ticker)==='argentina';});
  var bonosPos=pos.filter(function(p){return getSector(p.ticker)==='bonos';});
  var onPos=pos.filter(function(p){return getSector(p.ticker)==='on';});
  var fciPos=pos.filter(function(p){return getSector(p.ticker)==='fci';});
  // 'argentina' incluido: Finnhub tiene datos BYMA para acciones locales (CECO2.BA, HARG.BA, etc.)
  // y puede ser más fresco que el cache de Yahoo para small-caps
  // 'argentina' se sacó del fallback a Finnhub: Finnhub es un proveedor de EEUU y, para un
  // ticker sin mapeo explícito (getFinnhubTicker devuelve el ticker "pelado"), puede resolverlo
  // a una acción/ADR de otro mercado que casualmente comparte el símbolo — pasó con LOMA (Loma
  // Negra): al fallar Yahoo .BA, cayó a Finnhub con 'LOMA' pelado, que devolvió el ADR de NYSE
  // (~USD 10) en vez del precio real en ARS de BYMA (~3227), y ese valor se usó tal cual como si
  // fuera ARS. Para 'argentina' no hay fallback confiable → si Yahoo .BA falla, se mantiene la
  // última cotización cargada (ver 'no limpiar quotes viejas' más arriba) en vez de mostrar un
  // precio de otro mercado.
  var finnhubFallbackSectors=new Set(['nyse','brasil','europa','china','cripto']);

  var total=pos.length,done=0,errors=0;

  // Coalescer de renders: renderPortfolio() recalcula getPositions() (recorre TODO el historial
  // de movimientos, ordena, etc.) y reconstruye la tabla entera — carísimo para llamarlo una vez
  // por cada ticker que llega (70-100+ veces por actualización). Se agrupa a lo sumo 1 render por
  // frame con requestAnimationFrame: varias respuestas que llegan casi juntas comparten un solo
  // render en vez de una cada una. La barra de progreso (texto/ancho) sigue actualizándose al toque.
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

  // Limita cuántos fetchYahooAR() concurrentes se disparan a la vez. Probado en vivo (2026-09-11):
  // api.allorigins.win (el único proxy vivo hoy, ver changelog) responde bien a 1 pedido (~2.5s)
  // pero falla los 30 pedidos si se lo bombardea en paralelo ("Failed to fetch" en los 30, confirmado
  // con Promise.all de 30 tickers reales). fetchBymaAll/fetchArgAll/etc lanzaban TODOS los tickers
  // (60-90+) al mismo tiempo — de ahí que BBAS3/PETR3 (sin fallback a Finnhub, ver nota abajo) y
  // GLOB/D31M7 (sin cobertura en data912) se quedaran sin cotización: su único intento a Yahoo caía
  // en medio de esa ráfaga. Se acota a `limit` pedidos en vuelo por vez.
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
    // data912 arg_cedears cubre la enorme mayoría de CEDEARs (probado en vivo: AAPL, MSFT, ABEV,
    // BBD, ITUB, MELI, VALE, TSLA, GOOGL, BBAS3, PETR3... 1000+ tickers) — mucho más confiable que
    // Yahoo vía proxy gratuito. Se consulta una sola vez acá y se usa como fuente primaria; Yahoo
    // queda de fallback solo para lo que data912 no tenga.
    var mapCedears={};
    try{mapCedears=await fetchArgCedearsAPI();}catch(e){}
    await mapWithConcurrency(bymaPos, YAHOO_CONCURRENCY, async function(p){
      var s=getSector(p.ticker);
      try{
        var esBRLDirecto=BRL_TICKERS.has(p.ticker);
        var cq=esBRLDirecto?null:mapCedears[p.ticker.toUpperCase()];
        var _esData912=cq&&cq.price>0;
        var fbq=_esData912?cq:await fetchYahooAR(p.ticker,esBRLDirecto?'.SA':'.BA');
        // argentina: ya viene en ARS → guardar directo
        // BRL_TICKERS (B3 directo): guardar en ARS sin normalizar
        // Todo lo demás (nyse/brasil/europa/china/cripto CEDEAR): guardar ARS directo
        if(s!=='argentina'&&!esBRLDirecto){
          fbq.fromByma=true; // precio en ARS/CEDEAR — renderPortfolio lo usa directamente (sin CCL race)
        }
        quotes[p.ticker]=fbq;
        _stampQuote(p.ticker,_esData912?'data912':'yahoo');
      }catch(e){
        // No contar error todavía: Finnhub fallback cubre todos los sectores
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
        // Sin dato nuevo: se mantiene la última cotización cargada (mismo criterio
        // que antes — para 'argentina' no hay fallback a Finnhub, ver nota arriba)
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
        // Finnhub: USD por acción subyacente → renderPortfolio hace (price/ratio)*CCL_HOY
        quotes[p.ticker]=await fetchFinnhub(getFinnhubTicker(p.ticker));
        _stampQuote(p.ticker,'finnhub');
        renderPortfolio(); // actualizar UI al llegar cada precio
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

  // FCI: ArgentinaDatos (fuente CAFCI) — mapa ticker → categoría + nombre del fondo
  // Verificado 02/07/2026: "Adcap Gestión Estratégica III - Clase A" en /v1/finanzas/fci/rentaFija
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
          // VCP en ARS por cuotaparte — igual que argentina (fromByma=true)
          quotes[p.ticker]={price:parseFloat(cur.vcp),prevClose:prev?parseFloat(prev.vcp):parseFloat(cur.vcp),fromByma:true,fromFci:true};
          _stampQuote(p.ticker,'cafci');
        }
      }catch(e){/* ArgentinaDatos no disponible — sin precio actualizado */}
      updateProgress();
    }));
  }

  // Fase 1: Yahoo .BA + data912 para bonos/ON + CAFCI para FCI en paralelo
  await Promise.all([fetchBymaAll(),fetchArgAll(),fetchBonosAll(),fetchONsAll(),fetchFCIAll()]);
  // Fase 2: Finnhub fallback para los que Yahoo no pudo resolver
  await fetchFinnhubFallback();

  // Render final con todos los datos listos
  renderPortfolio();
  (function(){var _d=document.getElementById('page-dashboard');if(_d&&_d.classList.contains('active'))setTimeout(renderDashboard,80);})();

  icon.textContent='⟳';prog.style.display='none';
  status.className=errors>0?'emsg':'smsg';
  status.textContent=errors>0?errors+' sin datos':'Actualizado';
  setTimeout(function(){status.textContent='';},5000);
  document.getElementById('lupd').textContent=new Date().toLocaleTimeString('es-AR');
  try{localStorage.setItem((PFX+'q3'),JSON.stringify(quotes));localStorage.setItem((PFX+'q3_ts'),Date.now());}catch(e){}

  // RSI: refresco oportunista (no bloquea el render de precios; cada ticker respeta su propio TTL)
  if(CFG.rsi&&typeof fetchAllRSI==='function') fetchAllRSI();
  // TIR de Bonos: idem, oportunista
  if(CFG.rsi&&typeof fetchAllTIR==='function') fetchAllTIR();
  // Noticias: badge de movimientos fuertes (v44)
  if(typeof nwsAfterQuotes==='function') nwsAfterQuotes();
}

// ─── RSI (14, método Wilder) ───────────────────────────────────────────────
// No aplica a Bonos/ONs (ahí va TIR). Símbolo Yahoo: Argentina usa .BA, el resto ticker directo
// (así matchea el gráfico "de fábrica" de TradingView, que es lo que la gente compara).
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

// Colores según rangos pedidos: >75 rojo, 67-75 naranja, 33-67 neutro, 25-33 verde suave, <25 verde fuerte
function rsiColor(v){
  if(v==null||isNaN(v)) return 'var(--text3)';
  if(v>75) return 'var(--red)';
  if(v>67) return 'var(--orange)';
  if(v<25) return 'var(--accent)';
  if(v<33) return 'var(--green-soft)';
  return 'var(--text2)';
}

// Trae cierres diarios (3 meses) vía la misma cadena de proxies que ya usa fetchYahooAR
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

// Recalcula RSI para todos los tickers abiertos (excepto bonos/ONs), respetando un TTL
// de 12hs por ticker para no golpear los proxies gratuitos en cada auto-refresh de precios.
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
        var closes=await fetchRSICloses(getRsiSymbol(p.ticker));
        var val=wilderRSI(closes,14);
        if(val!=null) RSI_CACHE[p.ticker]={value:val,ts:Date.now()};
      }catch(e){ /* se deja el valor cacheado previo, si había */ }
      if(i%5===4) renderPortfolio();
      if(i<pending.length-1) await new Promise(function(r){setTimeout(r,600);});
    }
    try{localStorage.setItem((PFX+'rsi'),JSON.stringify(RSI_CACHE));}catch(e){}
    renderPortfolio();
  } finally {
    _fetchAllRSIRunning=false;
  }
}

// ─── Toggle columna RSI (oculta por defecto) ───
function toggleRSICol(show){
  var grid=document.getElementById('panels-grid');
  if(!grid)return;
  if(show){grid.classList.remove('hide-rsi');}else{grid.classList.add('hide-rsi');}
  try{localStorage.setItem((PFX+'showRSI'),show?'1':'0');}catch(e){}
}
(function initRSIToggle(){
  var show='0';
  try{var s=localStorage.getItem((PFX+'showRSI'));if(s!==null)show=s;}catch(e){}
  function apply(){
    var cb=document.getElementById('rsi-toggle');var grid=document.getElementById('panels-grid');
    if(cb)cb.checked=(show==='1');
    if(grid&&show!=='1')grid.classList.add('hide-rsi');
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',apply);}else{apply();}
})();

// ─── TIR de Bonos (fuente: EcoValores research, cobertura parcial) ────────
// Parsea TODAS las tablas de la página: para cada tabla busca la columna
// cuyo header sea "% TIR" (o "TIR"), y para cada fila con un link a
// ticker.php?t=XXX toma el valor de esa columna. Tablas sin columna TIR
// (Acciones, Cedears, Commodities, etc.) se ignoran solas al no matchear.
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

// Trae TIR para todos los Bonos abiertos en un solo fetch (EcoValores no pagina).
// TTL de 12hs igual que RSI. Tickers no presentes en EcoValores quedan en '—'.
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
        TIR_CACHE[p.ticker]={value:null,ts:now}; // marcado "consultado, sin cobertura" para no reintentar cada render
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
        if(i<8)return; // skip headers
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
  renderDividendos();renderPortfolio();renderDivsCard();
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
  renderDividendos();renderPortfolio();renderDivsCard();
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
  renderDividendos();renderPortfolio();renderDivsCard();
}

function renderDividendos(){
  var empty=document.getElementById('d-empty');var wrap=document.getElementById('d-wrap');var body=document.getElementById('d-body');var totalEl=document.getElementById('d-total');
  if(!empty||!wrap||!body)return; // portafolios sin la solapa Dividendos manual (vieja)
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
  // Solo mostrar tickers que están en cartera (qty > 0)
  var allTickers=Object.keys(pos_map).sort();
  // Agregar también los que tienen target seteado aunque hayan salido de cartera temporalmente
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
  // Si hay USD, recalcular ARS; si solo hay ARS, recalcular USD
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
// TRACKER DE DIVIDENDOS CCL — con PIN + ojo privacidad
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

// Migración única: las claves de localStorage del tracker de dividendos eran
// idénticas en los 5 portafolios (trk_divs_v1 / trk_pin_v1 / etc.), y como los 5
// se publican bajo el mismo origen (gcovetta.github.io, solo cambia la carpeta),
// localStorage se compartía entre todos — un navegador que hubiera abierto otro
// portafolio antes podía terminar mostrando (o incluso guardando) sus dividendos
// acá. Cada app ahora usa una clave propia (sufijo _gdc/_omar/_juli/_hilda/_ana);
// esto borra las claves viejas compartidas para que dejen de filtrarse.
['trk_divs_v1','trk_pin_v1','trk_session_v1','trk_ccl_v1'].forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});

function trkHsh(s){return s.split('').reduce(function(a,c){return(((a<<5)-a)+c.charCodeAt(0))|0;},0).toString(36);}
function trkSave(){
  try{localStorage.setItem(TRK.DKEY,JSON.stringify(TRK.divs));}catch(e){}
  // Igual que los movimientos: snapshot "pendiente de subir" + reintentos + aviso si falla. Y nunca
  // escribir antes de terminar de leer Supabase (si no, una lista vacía o parcial pisaba la de la nube).
  try{localStorage.setItem((PFX+'trk_pending'),JSON.stringify(TRK.divs));}catch(e){}
  if(typeof _gdcInitDone==='undefined'||!_gdcInitDone){console.warn('[trkSave] init no terminó — no se sube todavía ('+TRK.divs.length+' cobros)');return;}
  sbSaveArrayRetry('trk_divs', TRK.divs).then(function(ok){
    if(ok){try{localStorage.removeItem((PFX+'trk_pending'));}catch(e){}saveFailClear('trk_divs');}
    else warnSaveFailed('trk_divs');
  });
}
function trkLoad(){
  // TRK.divs ya fue cargado desde Supabase en el init.
  // Solo usar localStorage como fallback si está vacío.
  if(!TRK.divs||!TRK.divs.length){
    try{var d=localStorage.getItem(TRK.DKEY);if(d)TRK.divs=JSON.parse(d);}catch(e){TRK.divs=[];}
  }
}
function trkGetPin(){try{return localStorage.getItem(TRK.PKEY)||null;}catch(e){return null;}}
function trkSavePin(p){try{localStorage.setItem(TRK.PKEY,trkHsh(p));}catch(e){}}
function trkCheckPin(p){return trkHsh(p)===trkGetPin();}
function trkSaveCCL(v){
  try{localStorage.setItem(TRK.CKEY,String(v));}catch(e){}
  sbSetConfig('trk_ccl', v);
}
function trkLoadCCL(){try{var v=localStorage.getItem(TRK.CKEY);return v?parseFloat(v):null;}catch(e){return null;}}
function trkSetSession(){try{localStorage.setItem(TRK.SKEY,Date.now()+'');}catch(e){}}
function trkHasSession(){try{var t=localStorage.getItem(TRK.SKEY);return t&&(Date.now()-parseInt(t))<8*60*60*1000;}catch(e){return false;}}
function trkClearSession(){try{localStorage.removeItem(TRK.SKEY);}catch(e){}}

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
  // actualizar topbar si no viene de dolarapi (para no sobreescribir el live)
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
  // fallback a tabla embebida
  var hoy=new Date();
  var k=(hoy.getDate()<10?'0':'')+hoy.getDate()+'/'+(hoy.getMonth()<9?'0':'')+(hoy.getMonth()+1)+'/'+hoy.getFullYear();
  var fromTable=CCL_TABLE[k];
  if(fromTable){trkSetCCL(fromTable,'tabla embebida');}
  else{document.getElementById('trk-ccl-display').textContent='No disponible';document.getElementById('trk-ccl-src').textContent='— ingresá manualmente';}
}


// ════════════════════════════════════════════════════════
// CALCULADORA DE ARBITRAJE
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
    // par-level field
    if(field==='a'||field==='b') ARB_PAIRS[pi][field]=val.trim().toUpperCase();
    else if(field==='pctObj') ARB_PAIRS[pi].pctObj=parseFloat(val)||100;
  } else {
    var r=ARB_PAIRS[pi].rows[ri];
    if(field==='precioA'||field==='precioB') r[field]=parseFloat(val)||0;
    else r[field]=val;
  }
  arbSave();
  // Re-render just the ratio cells
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
    // arrow direction
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
    // Header row - ticker names + obj editable
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
    html+='</div>'; // end header

    // Data rows
    pair.rows.forEach(function(row, ri){
      var ratio=row.precioB>0?(row.precioA/row.precioB*100):0;
      var cls=arbRatioClass(ratio, pair.pctObj);
      var above=ratio>=(pair.pctObj||100);
      var isLast=(ri===pair.rows.length-1)&&true;
      var rowBg=ri%2===0?'':'background:rgba(255,255,255,.025)';
      html+='<div class="arb-row" style="'+rowBg+'">';
      // Plazo
      html+='<div class="arb-cell arb-plazo"><input class="arb-input" value="'+row.plazo+'" style="width:36px;font-weight:700;color:var(--text2)" oninput="arbUpdate('+pi+','+ri+',\'plazo\',this.value)"></div>';
      // Precio A
      html+='<div class="arb-cell"><input class="arb-input" value="'+(row.precioA||'')+'" placeholder="$0" oninput="arbUpdate('+pi+','+ri+',\'precioA\',this.value)" style="color:#a78bfa"></div>';
      // Precio B
      html+='<div class="arb-cell"><input class="arb-input" value="'+(row.precioB||'')+'" placeholder="$0" oninput="arbUpdate('+pi+','+ri+',\'precioB\',this.value)" style="color:#448aff"></div>';
      // Ratio calculado
      html+='<div class="arb-cell" id="arb-ratio-'+pi+'-'+ri+'"><span class="'+cls+'">'+(ratio>0?ratio.toFixed(2)+'%':'—')+'</span></div>';
      // Flecha
      html+='<div class="arb-cell arb-op '+(above?'sell':'buy')+'" id="arb-arrow-'+pi+'-'+ri+'">'+(ratio>0?(above?'>':'<'):'')+'</div>';
      // Condición
      html+='<div class="arb-cell"><input class="arb-input" value="'+(row.condicion||'')+'" placeholder="$1.00" oninput="arbUpdate('+pi+','+ri+',\'condicion\',this.value)"></div>';
      // Voy
      html+='<div class="arb-cell"><input class="arb-input" value="'+(row.voy||'')+'" placeholder="ticker" oninput="arbUpdate('+pi+','+ri+',\'voy\',this.value)" style="text-transform:uppercase;font-weight:600"></div>';
      // Nominales
      html+='<div class="arb-cell"><input class="arb-input" value="'+(row.nominales||'')+'" placeholder="—" oninput="arbUpdate('+pi+','+ri+',\'nominales\',this.value)"></div>';
      html+='</div>'; // end row
    });

    // Add row button
    html+='<div style="text-align:right;margin-top:3px;margin-bottom:2px">';
    html+='<button class="btn btn-sm" onclick="arbAddRow('+pi+')" style="font-size:.6rem;padding:2px 8px">+ plazo</button>';
    html+='</div>';

    html+='</div>'; // end arb-wrap
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
    // si cambió el dólar de hoy, recalcular la cartera (precios de Cedears, P. Venta, totales)
    if((Math.abs(CCL_HOY-_cclAntes)>0.5||Math.abs(MEP_HOY-_mepAntes)>0.5||Math.abs(BRL_HOY-_brlAntes)>0.01)&&typeof _gdcInitDone!=='undefined'&&_gdcInitDone&&typeof renderPortfolio==='function'){try{renderPortfolio();}catch(e){}}
  }
}
async function _fetchTopbarRates(){
  // Update RC CCL tag
  var rcTag=document.getElementById('rc-ccl-tag');
  if(rcTag&&typeof CCL_HOY!=='undefined') rcTag.textContent='CCL: $'+Math.round(CCL_HOY).toLocaleString('es-AR');
  // CCL
  try{
    var rc=await fetch('https://dolarapi.com/v1/dolares/contadoconliqui');
    var dc=await rc.json();
    var vc=parseFloat(dc.venta);
    if(vc>0){
      CCL_HOY=vc;CCL_TABLE[_HOY_KEY]=vc;try{localStorage.setItem((PFX+'ccl_override'),JSON.stringify(CCL_TABLE));}catch(e){}sbSetConfig('ccl_override',CCL_TABLE);
      document.getElementById('tb-ccl').textContent='$'+vc.toLocaleString('es-AR',{minimumFractionDigits:0,maximumFractionDigits:0});
      document.getElementById('tb-ccl-src').textContent='venta';
      var rcTag2=document.getElementById('rc-ccl-tag');
      if(rcTag2) rcTag2.textContent='CCL: $'+Math.round(vc).toLocaleString('es-AR');
      // Variación: buscar día hábil anterior en CCL_TABLE, fallback a argentinadatos
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
          var rh=await fetchWithTimeout('https://api.argentinadatos.com/v1/cotizaciones/dolares/ccl',{},5000);
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
  // MEP
  try{
    var rm=await fetch('https://dolarapi.com/v1/dolares/bolsa');
    var dm=await rm.json();
    var vm=parseFloat(dm.venta);
    if(vm>0){
      MEP_HOY=vm;MEP_TABLE[_HOY_KEY]=vm;try{localStorage.setItem((PFX+'mep_override'),JSON.stringify(MEP_TABLE));}catch(e){}sbSetConfig('mep_override',MEP_TABLE);
      document.getElementById('tb-mep').textContent='$'+vm.toLocaleString('es-AR',{minimumFractionDigits:0,maximumFractionDigits:0});
      document.getElementById('tb-mep-src').textContent='venta';
    }
  }catch(e){
    // fallback bluelytics
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
  // BRL/USD (frankfurter.app — gratuito, sin key)
  try{
    var rb=await fetch('https://api.frankfurter.app/latest?from=USD&to=BRL');
    var db=await rb.json();
    var vb=parseFloat(db.rates&&db.rates.BRL);
    if(vb>0){ BRL_HOY=vb; }
  }catch(e){}
}

function trkShowPin(){ trkShowApp(); }

function trkShowApp(){
  var app=document.getElementById('trk-app');
  if(app) app.style.display='block';
  trkFetchCCL();
  fetchTopbarRates();
  trkRender();
}

function trkBuildPad(){}

function trkUpdateDots(){}

function trkHandleKey(k){}

function trkTryLogin(){ trkShowApp(); }

function trkConfirmNew(){}

function trkDoConfirm(){}

function trkResetAll(){
  if(!confirm('Esto borrará todos los dividendos del tracker y el PIN. ¿Seguro?'))return;
  [TRK.DKEY,TRK.PKEY,TRK.CKEY,TRK.SKEY].forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});
  sbSaveArray('trk_divs', []);
  sbSetConfig('trk_ccl', null);
  TRK.divs=[];TRK.ccl=null;TRK.inited=false;
  initTracker();
}

function trkDeleteDiv(id){
  var idx=TRK.divs.findIndex(function(d){return d.id===id;});
  if(idx<0) return;
  var _d=TRK.divs[idx];papAgregar({k:'div',acc:'borrado',d:_d,desc:'Borrado cobro: '+_d.ticker+' '+(_d.moneda||'')+' '+_d.monto+' del '+_d.fecha});
  TRK.divs.splice(idx,1);
  trkSave();
  trkRender();
  renderDivsCard();
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
      if(d.moneda==='ARS'&&d.fecha){var _fp=d.fecha.split('-');if(_fp.length===3){var _fk=_fp[2]+'/'+_fp[1]+'/'+_fp[0];_cclHist=CCL_TABLE[_fk]||null;if(!_cclHist){var _ddt=new Date(d.fecha+'T12:00:00');for(var _di=1;_di<=7&&!_cclHist;_di++){for(var _sg=-1;_sg<=1;_sg+=2){var _dd2=new Date(_ddt);_dd2.setDate(_dd2.getDate()+_sg*_di);var _fk2=String(_dd2.getDate()).padStart(2,'0')+'/'+String(_dd2.getMonth()+1).padStart(2,'0')+'/'+_dd2.getFullYear();if(CCL_TABLE[_fk2]){_cclHist=CCL_TABLE[_fk2];break;}}}}}}
      var _cclEf=d.moneda==='ARS'?(_cclHist||d.cclUsado):null;
      var _mUSD=d.moneda==='USD'?d.monto:(_cclEf?d.monto/_cclEf:d.montoUSD);
      var mUSD='USD '+trkFmt2(_mUSD);
      var cclF=_cclEf?'$'+Math.round(_cclEf).toLocaleString('es-AR'):'—';
      var accF=d.acciones?d.acciones.toLocaleString('es-AR'):'—';
      var fechaF=d.fecha.split('-').reverse().join('/');
      tr.innerHTML='<td style="font-weight:700">'+d.ticker+'</td><td class="mono">'+fechaF+'</td><td><span class="badge '+(d.moneda==='USD'?'badge-usd':'badge-ars')+'">'+d.moneda+'</span></td><td class="mono trk-sensitive" style="text-align:right">'+mOrig+'</td><td class="mono trk-sensitive pos" style="text-align:right;font-weight:600">'+mUSD+'</td><td class="mono trk-sensitive muted" style="text-align:right">'+cclF+'</td><td class="mono trk-sensitive muted" style="text-align:right">'+accF+'</td><td><button class="btn btn-d btn-sm" onclick="trkDeleteDiv('+d.id+')">x</button></td>';
      tbody.appendChild(tr);
    });
    // Footer con totales
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
// Agrupa TRK.divs confirmados (dividendos + renta/amortización de bonos y ON) por
// año y mes, en USD con la misma conversión que el historial (CCL de la fecha ±7
// días → cclUsado → montoUSD). Usa el monto completo cobrado (no montoPPC).
var TRK_FLUJO={anio:null,chart:null};
var TRK_FLUJO_TOPN=8; // tickers que muestra el tooltip del gráfico, de mayor a menor
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
  var cclFecha=(moneda==='ARS')?(CCL_TABLE[fecha.split('-').reverse().join('/')]||TRK.ccl||null):null;
  if(moneda==='ARS'&&!cclFecha){flash(sel,'Necesitás el CCL para convertir (no hay CCL cargado para esa fecha ni CCL del día)',true);return;}
  var cclUsado=cclFecha;
  var montoUSD=moneda==='USD'?monto:monto/cclFecha;

  // Impacto en PPC / ganancia de venta: si el activo está en cartera, baja el PPC;
  // si ya no está (se vendió todo), suma como ganancia realizada de la venta.
  // Requiere confirmación manual mostrando el efecto exacto antes de aplicarlo.
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
// Rentas Cobradas" .xls = HTML disfrazado). Toma DIV y RTA en efectivo (renta +
// amortización − gastos), y solo resta del PPC si: (a) el activo sigue en cartera hoy,
// (b) según los movimientos de la app lo tenías a la fecha del cobro, y (c) en proporción
// a las nominales de ese momento que todavía conservás (mínimo de tenencia desde el cobro
// hasta hoy / tenencia del broker a esa fecha). Nada se aplica sin confirmar; se revierte
// con hvRevert(). Los registros quedan en TRK.divs con fuente:'veta_hist' y montoPPC.
var HVETA={rows:[],excl:[]};
function _hvYMD(fechaAR){var f=(fechaAR||'').split('/');return f.length===3?f[2]+f[1].padStart(2,'0')+f[0].padStart(2,'0'):'0';}
function _hvIsoYMD(iso){return (iso||'').replace(/-/g,'');}
function _hvDays(a,b){return Math.abs((new Date(a+'T12:00:00')-new Date(b+'T12:00:00'))/86400000);}
function _hvFmt(n,d){return (n||0).toLocaleString('es-AR',{minimumFractionDigits:d,maximumFractionDigits:d});}
function _hvTC(iso,mercado){
  // TC de la fecha del cobro, o el día anterior más cercano (hasta 7 días). Nunca el de hoy.
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
  // Línea de tiempo de tenencia por ticker (solo posiciones propias, igual que getPositions())
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
    // ¿Ya está en el tracker? (mismo ticker y moneda, ±7 días)
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
  // Importador genérico (GDC: un solo archivo)
  var _f=document.getElementById('trk-imp-file');
  if(_f&&!_f._trkBound){_f._trkBound=true;_f.addEventListener('change', function(e){
    var file = e.target.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(ev){ trkImpParse(ev.target.result, file.name); };
    reader.readAsArrayBuffer(file);
    this.value = ''; // reset input para poder subir el mismo archivo de nuevo
  });}
  // Importador Bull Market (Juli/Hilda/Omar: un archivo por moneda)
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
  // "48.047,05" → 48047.05 | "1,52" → 1.52 | "3.325,00" → 3325
  if(!s || s.trim()==='' || s.trim()==='0,00') return 0;
  var c = s.trim().replace(/\./g,'').replace(',','.');
  return parseFloat(c)||0;
}

function trkImpParseDate(s){
  // "02/01/26" → "2026-01-02"
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
  // Quitar BOM si existe
  if(html.charCodeAt(0)===0xFEFF) html=html.slice(1);

  // Estrategia: en vez de capturar <tr>...</tr> con multilinea (que falla en JS),
  // extraemos todos los <td> del documento en orden y los agrupamos por <tr>
  // Para eso detectamos los límites de <tr> y reconstruimos los grupos.

  // 1. Limpiar el HTML dejando solo la estructura de tabla
  // Reemplazar saltos de línea y tabs para aplanar
  var flat = html.replace(/[\r\n\t]+/g, ' ');

  // 2. Extraer grupos de celdas por fila: partir por <tr
  var trBlocks = flat.split(/<tr[\s>]/i);
  var tagRe = /<[^>]+>/g;
  var tdRe  = /<td[^>]*>(.*?)<\/td>/gi;

  var rows = [];

  for(var b=0; b<trBlocks.length; b++){
    var block = trBlocks[b];
    // Extraer todas las <td> de este bloque
    var cells = [];
    var m;
    tdRe.lastIndex = 0;
    while((m = tdRe.exec(block)) !== null){
      var raw = m[1].replace(tagRe,'').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').trim();
      cells.push(raw);
    }

    // Estructura real del broker:
    // [0]=vacío(checkbox) [1]=fecha [2]=tipo [3]=nro [4]=especie [5]=moneda|portafolio [6]=portafolio|divi [7]=divi|%divi
    // Si hay columna moneda (PESOS): [5]=PESOS [6]=portafolio [7]=divi/renta
    // Si no hay columna moneda (USD): [5]=portafolio [6]=divi/renta

    if(cells.length < 7) continue;

    // La fecha está en cells[1] (cells[0] es el td vacío)
    var fecha = trkImpParseDate(cells[1]);
    if(!fecha) continue;

    var cpbt    = (cells[2]||'').trim().toUpperCase();
    var especie = (cells[4]||'').trim().toUpperCase();

    if(!especie) continue;
    if(cpbt === 'RESC' || cpbt === 'RES') continue;

    // Estructura fija del broker:
    // [0]=vacío [1]=fecha [2]=tipo [3]=nro.cpbt [4]=especie
    // [5]=moneda (vacío=USD, 'PESOS'=ARS, o nombre especie en casos raros)
    // [6]=portafolio (acciones) [7]=Divi/Renta ← monto real [8]=%divi ...
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
// (hoja "Movimientos", filas de metadata + cabecera Liquidación/Concertación/
// Concepto/Especie/Cantidad/Precio/Importe/Estado/Comprobante/Referencia).
// El ticker y la descripción del instrumento vienen como texto libre dentro
// de "Referencia": "Liquidación de Caja de Valores - Especie [NNNNN] TICKER -
// DESCRIPCION: Rta. X%. Posiciones al DATE." Se incluyen tanto dividendos de
// acciones/CEDEARs como cupones (renta) de bonos/ONs — se etiquetan por
// palabras clave en la descripción ('RENTA' para bonos/ON, 'DIV' para el
// resto) pero no se descartan; el usuario decide fila por fila en el panel.
// Devuelve null si el archivo no matchea este formato (para poder caer al
// parser viejo del .xls disfrazado de HTML).
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
    if(concepto.indexOf('liquidaci')<0 || concepto.indexOf('cv')<0) continue; // solo "Liquidación de CV"

    var referencia=String(r[cReferencia]||'');
    var m=referencia.match(refRe);
    if(!m) continue;
    var descr=m[2].trim();
    var tipo=cuponRe.test(descr)?'RENTA':'DIV'; // bono/ON vs accion/CEDEAR — solo etiqueta, no filtra

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

// Convierte el monto de una fila pendiente de importación a USD, usando el
// mismo criterio que la carga manual (trkAddDiv): CCL de la fecha del
// dividendo en CCL_TABLE, y si no está, el CCL de referencia (TRK.ccl).
function _trkImpMontoUSD(row){
  if(row.moneda==='USD') return {montoUSD:row.monto,cclUsado:null,ok:true};
  var cclFecha=CCL_TABLE[(row.fecha||'').split('-').reverse().join('/')]||TRK.ccl||null;
  if(!cclFecha) return {montoUSD:null,cclUsado:null,ok:false};
  return {montoUSD:row.monto/cclFecha,cclUsado:cclFecha,ok:true};
}

// Calcula el impacto en el PPC del activo que tendría cargar esta fila,
// sin aplicarlo — para mostrarlo en el panel antes de que el usuario confirme.
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

    // 1) Intentar como xlsx real: nuevo formato Veta Capital (hoja "Movimientos",
    // export de Detalles > Movimientos > Actividad)
    try{
      var wb=XLSX.read(new Uint8Array(input),{type:'array'});
      rows=trkImpParseVetaMovimientos(wb);
      if(rows) isNewFormat=true;
    }catch(exWb){ rows=null; }

    // 2) Fallback: formato viejo del broker (.xls disfrazado de HTML)
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

// Punto de entrada único para carga manual (input file) y automática (tarea programada):
// dedupea contra TRK.divs (confirmados + pendientes) y encola las filas nuevas con
// estado:'pendiente' — persistidas en Supabase igual que cualquier dividendo, listas
// para que el usuario las confirme una por una en el panel "Pendientes de revisión".
function trkQueuePendingRows(rows){
  var existKeys = {};
  TRK.divs.forEach(function(d){ existKeys[trkImpBuildKey(d)] = true; });

  var added=0, dup=0;
  rows.forEach(function(r){
    var key=trkImpBuildKey(r);
    if(existKeys[key]){ dup++; return; }
    existKeys[key]=true; // evita duplicados dentro del mismo archivo
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
  if(!card||!tbody)return; // portafolios sin la tarjeta de dividendos pendientes
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
  delete d.estado; // confirmado

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

// Punto de entrada para la tarea programada (vía javascript_tool en el navegador de Claude):
// recibe el xlsx de Veta como base64 y hace exactamente lo mismo que subirlo a mano —
// las filas nuevas quedan pendientes de revisión, nunca se confirman solas.
window.trkAutoImportFromXLSX = function(base64, fname){
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
    document.getElementById('lupd').textContent='Cargando desde Supabase...';
    await sbPing();

    // 1. Movimientos
    // sbMov === null  → Supabase inalcanzable (error de red) → usar localStorage como fallback
    // sbMov === []    → tabla vacía legítima (portfolio nuevo) → NO usar localStorage (puede estar contaminado)
    // sbMov.length>0  → datos reales → usar y cachear
    var sbMov = await sbLoadArray('movimientos');
    // Reconciliar cambios locales sin confirmar en la nube (ver saveAndRender/ptNYSE_pending_sync).
    // Si hay un snapshot pendiente con movimientos que Supabase no tiene, reintentar guardarlos
    // ANTES de aceptar la versión de Supabase como fuente de verdad — evita perder compras/ventas
    // cargadas justo antes de un corte de red o un reload.
    try{
      var _pendingRaw=localStorage.getItem((PFX+'pending_sync'));
      if(_pendingRaw){
        var _pending=JSON.parse(_pendingRaw);
        var _cloudIds={};(sbMov||[]).forEach(function(m){if(m&&m.id!=null)_cloudIds[m.id]=true;});
        var _missing=_pending.filter(function(m){return m&&m.id!=null&&!_cloudIds[m.id];});
        // Protección: si la nube ya tiene movimientos y el snapshot pendiente no comparte NINGUNO con ella,
        // el snapshot no es de este portafolio (localStorage compartido entre portafolios del mismo origen) → se descarta.
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
      // Supabase tiene datos → fuente de verdad
      movimientos = sbMov.filter(function(m){return m!=null;});
      try{localStorage.setItem((PFX+'mov2'),JSON.stringify(movimientos));localStorage.setItem((PFX+'version'),DATA_VERSION);}catch(e){}
    } else if(sbMov === null){
      // Supabase inalcanzable → fallback localStorage (solo si versión coincide)
      var storedVersion=null;try{storedVersion=localStorage.getItem((PFX+'version'));}catch(e){}
      var saved=null;try{saved=localStorage.getItem((PFX+'mov2'));}catch(e){}
      if(saved&&storedVersion===DATA_VERSION){
        try{movimientos=JSON.parse(saved).filter(function(m){return m!=null;});}catch(e){}
      }
      // Si no coincide versión → movimientos=[] y el usuario verá portafolio vacío hasta que Supabase vuelva
    } else {
      // sbMov === [] → tabla vacía
      // PRELOADED deshabilitado: los datos reales viven en Supabase.
      // Si la tabla queda vacía, el portfolio muestra vacío hasta que se restituyan los datos.
    }

    // 2. Dividendos
    var sbDivs = await sbGetConfig('dividendos');
    if(sbDivs && sbDivs.length){
      dividendos = sbDivs;
      try{localStorage.setItem((PFX+'divs'),JSON.stringify(dividendos));}catch(e){}
    } else {
      try{var sd=localStorage.getItem((PFX+'divs'));if(sd)dividendos=JSON.parse(sd);}catch(e){}
      // Sincronizar a Supabase si hay datos en localStorage que nunca se guardaron
      if(dividendos.length) sbSetConfig('dividendos', dividendos);
    }
    // Aplicar borrados pendientes (protección ante datos stale de Supabase)
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

    // 3. Tracker divs CCL
    var sbTrkDivs = await sbLoadArray('trk_divs');
    // Cobros cargados que no llegaron a subirse (falló la red o se cerró la pestaña): tienen prioridad
    var _trkPend=null;try{_trkPend=JSON.parse(localStorage.getItem((PFX+'trk_pending'))||'null');}catch(e){}
    if(Array.isArray(_trkPend)&&sbTrkDivs!==null){
      TRK.divs=_trkPend;try{localStorage.setItem(TRK.DKEY,JSON.stringify(TRK.divs));}catch(e){}
      sbSaveArrayRetry('trk_divs',TRK.divs).then(function(ok){if(ok){try{localStorage.removeItem((PFX+'trk_pending'));}catch(e){}}else warnSaveFailed('trk_divs');});
    } else if(sbTrkDivs && sbTrkDivs.length){
      TRK.divs = sbTrkDivs;
      // Recuperar desde localStorage si tiene más entradas (Supabase pudo haber sido limpiado)
      try{var _lsTrk=localStorage.getItem(TRK.DKEY);if(_lsTrk){var _lsTrkData=JSON.parse(_lsTrk);if(_lsTrkData.length>TRK.divs.length){TRK.divs=_lsTrkData;sbSaveArray('trk_divs',TRK.divs);}}}catch(e){}
      try{localStorage.setItem(TRK.DKEY,JSON.stringify(TRK.divs));}catch(e){}
    } else {
      try{var td=localStorage.getItem(TRK.DKEY);if(td)TRK.divs=JSON.parse(td);}catch(e){}
    }

    // 4. Ratios
    var sbRatios = await sbGetConfig('ratios');
    if(sbRatios){Object.keys(sbRatios).forEach(function(t){RATIOS_TABLE[t]=sbRatios[t];});try{localStorage.setItem((PFX+'ratios'),JSON.stringify(RATIOS_TABLE));}catch(e){}}
    else{try{var sr=localStorage.getItem((PFX+'ratios'));if(sr){var lsr=JSON.parse(sr);Object.keys(lsr).forEach(function(t){RATIOS_TABLE[t]=lsr[t];});}}catch(e){}}

    // Ratios meta (nombre, mercado, país, rubro)
    var sbRatiosMeta = await sbGetConfig('ratios_meta');
    if(sbRatiosMeta){Object.keys(sbRatiosMeta).forEach(function(t){RATIOS_META[t]=sbRatiosMeta[t];});}
    else{if(Object.keys(RATIOS_META).length>0){sbSetConfig('ratios_meta',RATIOS_META);}}

    // 5. Targets
    var sbTargets = await sbGetConfig('targets');
    if(sbTargets){Object.assign(TARGET_TABLE, sbTargets);try{localStorage.setItem((PFX+'targets'),JSON.stringify(TARGET_TABLE));}catch(e){}}
    else{try{var st=localStorage.getItem((PFX+'targets'));if(st){Object.assign(TARGET_TABLE,JSON.parse(st));}}catch(e){}}

    // 5b. Rubros override
    var sbRubros = await sbGetConfig('rubros');
    if(sbRubros){Object.assign(USER_RUBRO_TABLE, sbRubros);try{localStorage.setItem((PFX+'rubros'),JSON.stringify(USER_RUBRO_TABLE));}catch(e){}}
    else{try{var sru=localStorage.getItem((PFX+'rubros'));if(sru){Object.assign(USER_RUBRO_TABLE,JSON.parse(sru));}}catch(e){}}

    // 5c. Watchlist
    var sbWl = await sbGetConfig('wl_gdc');
    if(sbWl && Array.isArray(sbWl) && sbWl.length){
      try{localStorage.setItem(WL_KEY, JSON.stringify(sbWl));}catch(e){}
      wlRender();
    } else {
      var _lsWl = wlLoad();
      if(_lsWl.length){ sbSetConfig('wl_gdc', _lsWl); }
    }



    // 6. CCL/MEP override
    var sbCclOvr = await sbGetConfig('ccl_override');
    if(sbCclOvr){Object.assign(CCL_TABLE, sbCclOvr);}
    else{try{var sc=localStorage.getItem((PFX+'ccl_override'));if(sc)Object.assign(CCL_TABLE,JSON.parse(sc));}catch(e){}}
    var sbMepOvr = await sbGetConfig('mep_override');
    if(sbMepOvr){Object.assign(MEP_TABLE, sbMepOvr);}
    else{try{var sm=localStorage.getItem((PFX+'mep_override'));if(sm)Object.assign(MEP_TABLE,JSON.parse(sm));}catch(e){}}
    tcRefrescarHoy();

    // 7. Liquidez
    var sbLiq = await sbGetConfig('liquidez');
    if(sbLiq){
      if(sbLiq.ars) setFmtNum('liq-ars', sbLiq.ars, 0);
      if(sbLiq.usd) setFmtNum('liq-usd', sbLiq.usd, 2);
      try{localStorage.setItem((PFX+'liq'),JSON.stringify(sbLiq));}catch(e){}
    } else { loadLiquidez(); }

    // 8. Inversión inicial
    var sbInv = await sbGetConfig('inv_inicial');
    if(sbInv){
      setFmtNum('inv-sidebar-usd', sbInv, 0);
      var di=document.getElementById('inv-inicial-usd-display');
      if(di)di.textContent='$'+Math.round(parseFloat(sbInv)).toLocaleString('es-AR');
      try{localStorage.setItem((PFX+'inv_inicial'),String(sbInv));}catch(e){}
    } else{loadInvInicial();}
    // Objetivo de rendimiento (si el portafolio tiene la calculadora)
    if(document.getElementById('perf-target-usd')){
      var sbPerfTarget = await sbGetConfig('perf_target');
      var _pt=sbPerfTarget||(function(){try{return localStorage.getItem(PFX+'perf_target');}catch(e){return null;}})();
      if(_pt){document.getElementById('perf-target-usd').value=_pt;perfCalcUpdate();}
    }

    // 9. Quotes cache (solo localStorage - datos volátiles)
    try{
      var sq=localStorage.getItem((PFX+'q3'));
      var sqTs=parseInt(localStorage.getItem((PFX+'q3_ts'))||'0');
      var sqAge=(Date.now()-sqTs)/1000/3600;
      if(sq && sqAge < 4){ quotes=JSON.parse(sq); }
      else { localStorage.removeItem((PFX+'q3')); localStorage.removeItem((PFX+'q3_ts')); }
    }catch(e){}

    // 9e. RSI cache (solo localStorage - el TTL de 12hs por ticker se valida dentro de fetchAllRSI)
    try{
      var srsi=localStorage.getItem((PFX+'rsi'));
      if(srsi) RSI_CACHE=JSON.parse(srsi)||{};
    }catch(e){}

    // 9f. TIR cache (Bonos, EcoValores) - mismo esquema que RSI
    try{
      var stir=localStorage.getItem((PFX+'tir'));
      if(stir) TIR_CACHE=JSON.parse(stir)||{};
    }catch(e){}

    // 9b. Base histórica de Estadísticas Venta Histórica (persistida, no toca movimientos reales)
    var sbVhist = await sbGetConfig('vhist_movs');
    if(sbVhist && Array.isArray(sbVhist)){
      _ventahistRows=sbVhist;
      try{localStorage.setItem((PFX+'vhist_movs'),JSON.stringify(_ventahistRows));}catch(e){}
    } else {
      try{var svh=localStorage.getItem((PFX+'vhist_movs')); if(svh){_ventahistRows=JSON.parse(svh);}}catch(e){}
    }
    // 9c. Dividendos/Rentas cobrados de Estadísticas Venta Histórica (persistido aparte)
    var sbVhistDivs = await sbGetConfig('vhist_divs');
    if(sbVhistDivs && Array.isArray(sbVhistDivs)){
      _ventahistDivs=sbVhistDivs;
      try{localStorage.setItem((PFX+'vhist_divs'),JSON.stringify(_ventahistDivs));}catch(e){}
    } else {
      try{var svhd=localStorage.getItem((PFX+'vhist_divs')); if(svhd){_ventahistDivs=JSON.parse(svhd);}}catch(e){}
    }
    // 9d. Aportes/Retiros de Estadísticas Venta Histórica (persistido aparte)
    var sbVhistAportes = await sbGetConfig('vhist_aportes');
    if(sbVhistAportes && Array.isArray(sbVhistAportes)){
      _ventahistAportes=sbVhistAportes;
      try{localStorage.setItem((PFX+'vhist_aportes'),JSON.stringify(_ventahistAportes));}catch(e){}
    } else {
      try{var svha=localStorage.getItem((PFX+'vhist_aportes')); if(svha){_ventahistAportes=JSON.parse(svha);}}catch(e){}
    }
    if(typeof renderVentaHistorica==='function') renderVentaHistorica();

    // 10a. Migración una-sola-vez: bonos/ONs deben usar MEP (no CCL) para la conversión a USD
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

    // 10b. Migración una-sola-vez: rellenar CCL y precioUSD faltantes en cualquier movimiento
    var MIG_KEY_FILL=(PFX+'mig_fillCCL_v1');
    var _fillDone=false;
    try{if(localStorage.getItem(MIG_KEY_FILL)==='1')_fillDone=true;}catch(e){}
    if(!_fillDone){
      var _fillCount=0;
      movimientos.forEach(function(m){
        if(!m||m.tipo==='aporte'||!m.ticker||!m.fecha)return;
        if(m.ccl&&m.ccl>0)return; // ya tiene CCL
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

    // 10. Recalcular precioUSD si ratios cambiaron
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

    // Dolz extra desde Supabase
    var sbDolz = await sbGetConfig('dolz_extra');
    if(Array.isArray(sbDolz)) DOLZ_EXTRA = new Set(sbDolz);

    renderMovimientos();renderPortfolio();renderRatios();renderTargets();renderDividendos();renderDivsCard();trkRender();portUnblur();vsellPopulateSelect();vsellResetFecha();vbuyResetFecha();ventahistResetFecha();
    document.getElementById('lupd').textContent='Datos cargados ✓';
    _gdcInitDone = true;
    if(SB_STATUS&&SB_STATUS.ok!==false)setTimeout(function(){bkDaily();},6000);
    if(initFromSupabase._done) initFromSupabase._done();

    // Si no hay quotes en caché, lanzar fetch inmediato (no esperar 5 min)
    if(Object.keys(quotes).length === 0){
      setTimeout(function(){ if(typeof fetchAllQuotes==='function') fetchAllQuotes(); }, 500);
    }
    // RSI: dispara siempre al cargar; internamente sólo pide lo que esté vencido (>12hs) o falte
    setTimeout(function(){ if(CFG.rsi&&typeof fetchAllRSI==='function') fetchAllRSI(); }, 1500);
    // TIR de Bonos (EcoValores): mismo criterio, un solo fetch para toda la cartera
    setTimeout(function(){ if(CFG.rsi&&typeof fetchAllTIR==='function') fetchAllTIR(); }, 2000);
  }

  window.initFromSupabase = initFromSupabase; // expuesta para el listener de auth (login/logout)
  initFromSupabase();

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

  // Al terminar fetchAllQuotes reiniciar el ciclo y guardar timestamp
  var _origFetch = fetchAllQuotes;
  fetchAllQuotes = async function(){
    var r = await _origFetch();
    var el = document.getElementById('lupd');
    if(el) el.dataset.lastupd = new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
    // Render final garantizado después de completar fetch
    setTimeout(renderPortfolio, 100);
    // Si el dashboard está activo, re-renderizarlo con datos frescos
    if(document.getElementById('page-dashboard') && document.getElementById('page-dashboard').classList.contains('active')){
      setTimeout(renderDashboard, 150);
    }
    _startCycle();
    return r;
  };

  _startCycle();

  // Render inicial con delay — solo si initFromSupabase aún no terminó
  // (evita mostrar datos del localStorage antes de que Supabase cargue)
  var _sbInitDone = false;
  initFromSupabase._done = function(){ _sbInitDone = true; };
  setTimeout(function(){ if(!_sbInitDone) renderPortfolio(); }, 800);

  // ── Market data: BTC, EWZ, IMV/CCL ──────────────────────────────────────
  async function fetchMarketExtras(){
    // BTC via CoinGecko (no key needed)
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

    // EWZ via Finnhub (con fallback a Yahoo proxies)
    try {
      var ewzQ;
      try {
        ewzQ = await fetchFinnhub('EWZ');
      } catch(e1) {
        // fallback: Yahoo con proxies (mismo mecanismo que fetchYahooAR)
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

    // IMV/CCL (MERVAL ÷ CCL) — Yahoo ^MERV con proxies
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

    // S&P (SPY) y QQQ — Finnhub con fallback Yahoo proxies
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

// Sidebar toggle — global scope so onclick can reach it
function toggleSidebar(){
  var main = document.getElementById('main') || document.querySelector('.main');
  if(main) main.classList.toggle('sidebar-open');
}


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
  if(typeof Chart==='undefined') return;
  var canvas=document.getElementById('m-pie-sector');
  if(!canvas) return;
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
  if(typeof Chart==='undefined') return;
  var canvas=document.getElementById('m-pie-rv');
  if(!canvas) return;
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

var MINI_PIE_INST=null;
function renderMiniPie(){} // torta RF/RV/Liquidez eliminada del Resumen (2026-10-03), reemplazada por "Distribución de la cartera"

// ─── DashBoard ───────────────────────────────────────────────
var RUBRO_MAP={
  // Tecnología
  'AAPL':'Tecnología','MSFT':'Tecnología','NVDA':'Tecnología','GOOGL':'Tecnología','GOOG':'Tecnología',
  'META':'Tecnología','ADBE':'Tecnología','CRM':'Tecnología','ORCL':'Tecnología','INTC':'Tecnología',
  'AMD':'Tecnología','QCOM':'Tecnología','AVGO':'Tecnología','SNOW':'Tecnología','SPOT':'Tecnología',
  'TEAM':'Tecnología','NOW':'Tecnología','INTU':'Tecnología','PANW':'Tecnología','ZS':'Tecnología',
  'CRWD':'Tecnología','HPQ':'Tecnología','IBM':'Tecnología','CSCO':'Tecnología','AMAT':'Tecnología',
  'LRCX':'Tecnología','KLAC':'Tecnología','MU':'Tecnología','WDC':'Tecnología','NXPI':'Tecnología',
  'GLOB':'Tecnología','BIGO':'Tecnología','SAP':'Tecnología','ASML':'Tecnología','SONY':'Tecnología',
  'TSM':'Tecnología','SSNLF':'Tecnología','BIDU':'Tecnología','MRVL':'Tecnología','PLTR':'Tecnología',
  'ARM':'Tecnología','ALAB':'Tecnología','CRWV':'Tecnología','NBIS':'Tecnología','SNDK':'Tecnología',
  // E-commerce / Retail
  'AMZN':'E-commerce','MELI':'E-commerce','BABA':'E-commerce','JD':'E-commerce','PDD':'E-commerce',
  'SHOP':'E-commerce','WMT':'E-commerce','TGT':'E-commerce','COST':'E-commerce','EBAY':'E-commerce',
  // Finanzas
  'JPM':'Finanzas','GS':'Finanzas','BAC':'Finanzas','C':'Finanzas','WFC':'Finanzas',
  'MS':'Finanzas','BLK':'Finanzas','V':'Finanzas','MA':'Finanzas','AXP':'Finanzas',
  'PYPL':'Finanzas','SQ':'Finanzas','NU':'Finanzas','ITUB':'Finanzas','GGAL':'Finanzas',
  'BMA':'Finanzas','SUPV':'Finanzas','BBAR':'Finanzas','VALO':'Finanzas','BHIP':'Finanzas',
  'BPAT':'Finanzas','BYMA':'Finanzas','BRIO':'Finanzas',
  // Energía
  'XOM':'Energía','CVX':'Energía','SLB':'Energía','COP':'Energía','PBR':'Energía',
  'YPF':'Energía','CEPU':'Energía','PAM':'Energía','TGS':'Energía','OXY':'Energía',
  'MPC':'Energía','PSX':'Energía','VLO':'Energía','VISTA':'Energía','VISTD':'Energía',
  'BP':'Energía','SHEL':'Energía','EOG':'Energía','DVN':'Energía','HAL':'Energía',
  // Salud
  'JNJ':'Salud','PFE':'Salud','MRK':'Salud','ABBV':'Salud','LLY':'Salud',
  'UNH':'Salud','CVS':'Salud','GILD':'Salud','AMGN':'Salud','BMY':'Salud',
  'ISRG':'Salud','MDT':'Salud','ABT':'Salud','TMO':'Salud','DHR':'Salud',
  'MRNA':'Salud','BNTX':'Salud','REGN':'Salud','VRTX':'Salud',
  // Consumo masivo
  'KO':'Consumo','PEP':'Consumo','MCD':'Consumo','SBUX':'Consumo','NKE':'Consumo',
  'PM':'Consumo','MO':'Consumo','PG':'Consumo','KHC':'Consumo','GIS':'Consumo',
  'MDLZ':'Consumo','CL':'Consumo','EL':'Consumo','CRES':'Consumo',
  // Entretenimiento / Streaming
  'NFLX':'Entretenimiento','DIS':'Entretenimiento','PARA':'Entretenimiento',
  'WBD':'Entretenimiento','CMCSA':'Entretenimiento','RBLX':'Entretenimiento',
  'TTWO':'Entretenimiento','EA':'Entretenimiento',
  // Telecomunicaciones
  'T':'Telecomunicaciones','VZ':'Telecomunicaciones','TECO2':'Telecomunicaciones','COME':'Telecomunicaciones',
  // Automotriz
  'TSLA':'Automotriz','F':'Automotriz','GM':'Automotriz','STLA':'Automotriz','TM':'Automotriz',
  // Aerolíneas / Transporte
  'DAL':'Aerolíneas','UAL':'Aerolíneas','AAL':'Aerolíneas','LUV':'Aerolíneas',
  'GLOB':'Tecnología',
  // Industrial / Defensa
  'CAT':'Industrial','DE':'Industrial','BA':'Industrial','GE':'Industrial',
  'HON':'Industrial','MMM':'Industrial','RTX':'Industrial','LMT':'Industrial',
  'NOC':'Industrial','GD':'Industrial','UPS':'Industrial','FDX':'Industrial',
  // Materiales / Siderurgia
  'ALUA':'Materiales','TXAR':'Materiales','FCX':'Materiales','NEM':'Materiales',
  'GOLD':'Materiales','NUE':'Materiales','X':'Materiales',
  // Construcción / Cemento
  'LOMA':'Construcción','HARG':'Construcción',
  // Inmobiliario
  'IRSA':'Inmobiliario','IRCP':'Inmobiliario',
  // Agro / Materiales básicos
  'BRF':'Agro','BRFS':'Agro','MOS':'Agro','GGB':'Materiales','BBD':'Finanzas','BBAS3':'Finanzas',
  'PETR3':'Energía','PAGS':'Tecnología','STNE':'Tecnología','ARCO':'Consumo','HOG':'Automotriz',
  'EWZ':'ETF','UNP':'Industrial',
  // Cripto / Exchange
  'COIN':'Cripto'
};

// Overrides de rubro por usuario (prevalecen sobre RUBRO_MAP)
var USER_RUBRO_TABLE={};

var RUBRO_OPTIONS_DEFAULT=[
  'Tecnología','E-commerce','Finanzas','Energía','Salud','Consumo',
  'Entretenimiento','Telecomunicaciones','Automotriz','Aerolíneas',
  'Industrial','Materiales','Construcción','Inmobiliario','Agro',
  'Cripto','Bonos','ON','Otros'
];
var RUBRO_OPTIONS=RUBRO_OPTIONS_DEFAULT.slice(); // se puede extender por el usuario

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
  renderRubros(); // refrescar selects
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
    // Asegurar que el rubro actual esté en el catálogo (puede ser uno legado)
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
  // Reaplicar filtro si había texto
  rubroFilterTable();
}

function rubroUpdateRowLabel(ticker){
  // Actualiza el data-rubro para que el filtro funcione en tiempo real
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
  // Actualizar la celda "Rubro actual"
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
  // Destruir instancia previa en ese canvas (por si quedó huérfana fuera de DB_CHARTS)
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
    setTimeout(renderDashboard,400);
    return;
  }
  dbDestroyAll();

  var positions=getPositions();
  var open=positions.filter(function(p){return p.qty>0;});
  var tcHoy=CCL_HOY||1;
  var mepHoy=MEP_HOY||tcHoy;

  // Construir datos por posición con valor USD y ganancia USD
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
      // Misma lógica que renderPortfolio:
      // NYSE/Brasil/Europa/China/Cripto: price en USD, qty en CEDEARs → (price/ratio)*qty
      // Argentina: price en ARS → (price/CCL)*qty
      // Bonos/ON: price en ARS por 100 nominales → (price/MEP)*qty/100
      // BRL: price en Reales → (price/CCL)*qty
      valUSD=isBonoON ? (q.price/mep)*p.qty/100
            :sector==='fci' ? (q.price/mep)*p.qty
            :isArgentina ? (q.price/tcHoy)*p.qty
            :_isBRL ? (q.price/tcHoy)*p.qty
            :q.fromByma ? (q.price/tcHoy)*p.qty
            :(q.price/ratio)*p.qty;
    } else {
      // Sin cotización: usar costo USD como proxy para que la distribución sea correcta
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
  // Acumulo valor actual e invertido por separado para el cálculo exacto
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
    // (Σ valor actual USD − Σ invertido USD) / Σ invertido USD × 100
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
  // Solo Renta Variable (excluye Bonos y ONs) · Top 10 + Otros
  var rubroRawData=posData.filter(function(d){return d.sector!=='bonos'&&d.sector!=='on';});
  var rubroVal={};
  rubroRawData.forEach(function(d){
    var rubro=getRubro(d.ticker);
    rubroVal[rubro]=(rubroVal[rubro]||0)+d.valUSD;
  });
  // Ordenar y tomar top 10; el resto va a "Otros"
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

  // Función para mostrar detalle al hacer clic
  function dbShowRubroDetail(rubroName, color){
    DB_LAST_RUBRO = {name: rubroName, color: color};
    var detail=document.getElementById('db-rubros-detail');
    var title=document.getElementById('db-rubros-detail-title');
    var tbody=document.getElementById('db-rubros-detail-tbody');
    if(!detail||!title||!tbody) return;

    // Tickers que pertenecen a este rubro (para "Otros": los que quedaron fuera del top 10)
    var tickers;
    if(rubroName==='Otros'){
      tickers=rubroRawData.filter(function(d){return rubroOtrosKeys.indexOf(getRubro(d.ticker))>=0;});
    } else {
      tickers=rubroRawData.filter(function(d){return getRubro(d.ticker)===rubroName;});
    }
    // Ordenar por valUSD desc
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

  // Destroy previous instance
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

  // Region → ISO country codes
  var regionCountries = {
    usa: ['US'],
    arg: ['AR'],
    bra: ['BR'],
    chn: ['CN'],
    eur: ['DE','GB','FR','NL','ES','IT','CH','SE','NO','DK','BE','AT','FI','PT','IE','PL']
  };

  // Build countryCode → numeric value (for color scale)
  var countryValues = {};
  var regionLookup = {};
  Object.keys(regionCountries).forEach(function(region) {
    var val = regionVal[region] || 0;
    regionCountries[region].forEach(function(code) {
      regionLookup[code] = region;
      if (val > 0) countryValues[code] = Math.round(val);
    });
  });

  // Region display labels
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

  // Color invested countries directly on SVG paths (jsvectormap uses lowercase codes)
  var _vals = Object.keys(regionCountries).map(function(r){ return regionVal[r]||0; });
  var _maxV = Math.max.apply(null, _vals) || 1;
  var _svgEl = container.querySelector('svg');
  if (_svgEl) {
    Object.keys(regionCountries).forEach(function(region) {
      var val = regionVal[region] || 0;
      if (val <= 0) return;
      var t = Math.pow(val / _maxV, 0.5);
      // Gradient: #1a3060 (26,48,96) → #1a4ee8 (26,78,232)
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
  if (!canvas || typeof Chart === 'undefined') return;

  // Portfolio returns provided by user
  var myReturns = [300, 70, 23, null]; // 2023, 2024, 2025, 2026 YTD

  // Read current portfolio rendimiento for 2026 YTD
  var rendEl = document.getElementById('m-rend');
  if (rendEl) {
    var txt = (rendEl.innerText || rendEl.textContent || '').replace(/[+%\s]/g, '');
    var n = parseFloat(txt);
    if (!isNaN(n)) myReturns[3] = n;
  }

  // S&P 500: 2023-2025 hardcoded; 2026 YTD fetched en vivo
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

  // Fetch S&P 500 2026 YTD: Dec 30 2025 → hoy
  var p1 = 1767052800; // 2025-12-30 UTC
  var p2 = Math.floor(Date.now() / 1000);
  var yUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?interval=1d&period1=' + p1 + '&period2=' + p2;

  fetch(yUrl)
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var res = d.chart && d.chart.result && d.chart.result[0];
      if (!res) { draw(); return; }
      var ts = res.timestamp || [];
      var cl = (res.indicators && res.indicators.quote && res.indicators.quote[0] && res.indicators.quote[0].close) || [];

      // Primer precio del año 2026 (primer día hábil desde Jan 1)
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

/* ── Watchlist "Tickers en la mira" ─────────────────────────────── */
const WL_KEY = CFG.wlKey;
function wlLoad(){ try{ return JSON.parse(localStorage.getItem(WL_KEY))||[]; }catch(e){ return []; } }
function wlSave(arr){
  try{ localStorage.setItem(WL_KEY, JSON.stringify(arr)); }catch(e){}
  sbSetConfig('wl_gdc', arr);
}
function wlRender(){
  const arr = wlLoad();
  const el = document.getElementById('wl-list');
  if(!el) return;
  if(!arr.length){ el.innerHTML='<div class="wl-empty">Sin tickers cargados</div>'; return; }
  el.innerHTML = arr.map((item,i)=>`
    <div class="wl-item">
      <span class="wl-item-sym">${item.tk}</span>
      <span class="wl-item-note" title="${item.cm||''}">${item.cm||'<span style="color:var(--text3);font-style:italic">sin comentario</span>'}</span>
      <button class="wl-del" onclick="wlDel(${i})" title="Eliminar">✕</button>
    </div>`).join('');
}
function wlAdd(){
  const tkEl = document.getElementById('wl-ticker');
  const cmEl = document.getElementById('wl-comment');
  const tk = (tkEl.value||'').trim().toUpperCase();
  if(!tk) { tkEl.focus(); return; }
  const arr = wlLoad();
  arr.push({ tk, cm: (cmEl.value||'').trim() });
  wlSave(arr);
  tkEl.value=''; cmEl.value=''; tkEl.focus();
  wlRender();
}
function wlDel(i){
  const arr = wlLoad();
  arr.splice(i,1);
  wlSave(arr);
  wlRender();
}
wlRender();

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
// En la app instalada no hay botón "atrás" del navegador: se agrega ⌂ para volver a Carteras administradas.
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
// Botón "📄 Informe" en la card Evolución: arma un informe con los datos ya calculados (último render),
// el historial (con años anteriores), las posiciones y los movimientos. Se ve en pantalla, se imprime o
// se guarda como PDF y el envío lo decide Garo. Solo con CFG.informe (Ana, Hilda, Juli, Omar; no GDC).
// El mapa se carga aparte (comun/mapa_mundo.js) recién al generar el informe.
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
// Inicio del período anual de la inversión inicial actual: si ya pasó el corte pero todavía no se cerró
// (hasta 45 días), el período que se está terminando empezó un año antes.
function infInicioAnual(){
  var corte=histUltimoCorte();if(!corte)return null;
  var cerrado=(HIST&&HIST.cierres||[]).some(function(c){return c.d===corte;});
  var dias=(new Date(_hHoy())-new Date(corte))/86400000;
  if(!cerrado&&dias<=45)return (parseInt(corte.slice(0,4),10)-1)+corte.slice(4);
  return corte;
}
// Períodos con rendimiento (años anteriores cargados o leídos de Rendimiento anual + cierres), clave = año de inicio
function infPeriodos(){
  var per={},pi=CFG.periodoInicio||'01-01';
  Object.keys(CFG.rendAnual||{}).forEach(function(y){per[y]={r:+CFG.rendAnual[y],src:'cargado'};});
  (HIST&&HIST.cierres||[]).forEach(function(cz){if(cz.rendFinal!=null){per[String(parseInt(cz.d.slice(0,4),10)-1)]={r:cz.rendFinal,src:'cierre',cz:cz};}});
  Object.keys(per).forEach(function(y){per[y].ini=y+'-'+pi;per[y].fin=(parseInt(y,10)+1)+'-'+pi;});
  return per;
}
// Valores de inicio y cierre de un período cerrado (del cierre registrado o de los puntos de años anteriores)
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
    rend=d.rendPct!=null?d.rendPct:null;base=d.invInicial||null;gan=(base&&rend!=null)?base*rend/100:null;
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
  // perfil de inversor según la cartera: el mismo puntaje que Recomendaciones (composición, geografía y sectores)
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
// En Cocos → Movimientos se copia el listado (Dividendos / Rentas y Amortización) y se pega acá.
// Cada registro viene en líneas: [etiqueta "2 de oct"], fecha ejecución, fecha liquidación, operación,
// especie, estado, nominales, total ("US$6,05" o "$14.523,28"). Las filas nuevas quedan en
// "Pendientes de revisión" (no impactan hasta confirmarlas). Se saltean montos 0 (bajas de nominales),
// filas sin ticker (ARS, USD, EXT) y las que ya están cargadas (mismo ticker, moneda y monto ±10 días).
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
  // bonos/ON que Cocos a veces informa como "Dividendos": si el ticker tiene alguna renta, todo es RENTA
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
// UI: tarjeta "Importar desde Cocos" y, si el portafolio no la tiene, la de "Pendientes de revisión"
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
// Se escriben solo los números (03102026) y queda 03/10/2026. Enter en la fecha pasa al valor;
// Enter en el valor guarda.
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
// Al abrir un portafolio compara con cómo estaba la vez anterior que lo abriste en este dispositivo:
// variación del total, los activos que más se movieron y los cobros cargados desde entonces.
// Se guarda en este navegador (PFX+'uv_act' = la visita actual, PFX+'uv_prev' = la anterior); una
// visita nueva empieza si pasaron más de 30 minutos desde la última vez que se vio la cartera.
var _uvCerrado=false;
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
  var ref=document.getElementById('pventa-alert')||document.getElementById('top-cards-row');if(!ref||!ref.parentNode)return;
  var cuando=(function(){var s=(Date.now()-prev.ts)/1000;if(s<86400){var h=Math.round(s/3600);return h<=1?'hace un rato':'hace '+h+' horas';}var dd=Math.round(s/86400);
    if(dd===1)return 'ayer';if(dd<7)return 'el '+['domingo','lunes','martes','miércoles','jueves','viernes','sábado'][new Date(prev.ts).getDay()];return 'hace '+dd+' días';})();
  var dv=prev.tot>0?(tot/prev.tot-1)*100:null,du=tot-prev.tot;
  var mv=Object.keys(pr).filter(function(t){return prev.pr&&prev.pr[t]>0;}).map(function(t){return {t:t,c:(pr[t]/prev.pr[t]-1)*100};}).filter(function(x){return Math.abs(x.c)>=1;});
  var up=mv.filter(function(x){return x.c>0;}).sort(function(a,b){return b.c-a.c;}).slice(0,3),dn=mv.filter(function(x){return x.c<0;}).sort(function(a,b){return a.c-b.c;}).slice(0,3);
  var nuevos=Object.keys(pr).filter(function(t){return !prev.pr||!prev.pr[t];}),vend=Object.keys(prev.pr||{}).filter(function(t){return !pr[t];});
  var desde=new Date(prev.ts).toISOString().slice(0,10),cob=0,ncob=0;
  (TRK.divs||[]).forEach(function(x){if(x.estado==='pendiente')return;var f=String(x.fecha||'');if(f.indexOf('/')>0){var a=f.split('/');f=a[2]+'-'+a[1].padStart(2,'0')+'-'+a[0].padStart(2,'0');}
    if(f>=desde&&(!x.cartera||x.cartera==='principal')){var u=x.montoUSD!=null?+x.montoUSD:(x.moneda==='USD'?+x.monto:0);if(u>0){cob+=u;ncob++;}}});
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
// Si un Cedear cambia de ratio y la tabla no se actualiza, la app lo valúa mal sin avisar.
// Una vez por día (y con el botón "verificar ahora") compara, para cada Cedear en cartera, el precio
// del Cedear en pesos con el precio de la acción en NYSE (Finnhub) y el CCL de hoy:
//   ratio que surge del mercado = precio NYSE × CCL / precio Cedear
// Si difiere más de 25% del ratio cargado, avisa. No cambia nada solo.
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
  setTimeout(function(){ratiosVerificar(false);},20000); // después de que terminen de llegar las cotizaciones
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
    await new Promise(function(res){setTimeout(res,1100);}); // límite gratuito de Finnhub
  }
  if(ok){RT_SOSP=nuevo;try{localStorage.setItem(PFX+'rt_sosp',JSON.stringify({d:_hHoy(),s:RT_SOSP}));localStorage.setItem(PFX+'rt_check',_hHoy());}catch(e){}}
  _rtCorriendo=false;rtBanner(manual?(ok?'Verificados '+ok+' Cedears':'No se pudo consultar NYSE'):null);
}
function rtIgnorar(t){try{var ig=JSON.parse(localStorage.getItem(PFX+'rt_ign')||'{}');ig[t]=getRatio(t);localStorage.setItem(PFX+'rt_ign',JSON.stringify(ig));}catch(e){}rtBanner();}
function rtBanner(msg){
  var pg=document.getElementById('page-portafolio');if(!pg)return; // va al final de la página Portafolio
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
// P portafolio · C compra · V venta · M movimiento · D dividendos · T tipo de cambio · R refrescar cotizaciones ·
// / buscar ticker · I informe · H inicio · Esc cerrar · ? ayuda. No actúan mientras se escribe en un campo.
function _kbIr(ids){
  for(var i=0;i<ids.length;i++){var id=ids[i];if(!document.getElementById('page-'+id))continue;
    var nav=Array.prototype.find.call(document.querySelectorAll('.nav-item'),function(n){return (n.getAttribute('onclick')||'').indexOf("'"+id+"'")>=0;});
    if(nav)nav.click();else if(typeof showPage==='function')showPage(id,null);return true;}
  return false;
}
function _kbFoco(id){setTimeout(function(){var e=document.getElementById(id);if(e){e.focus();if(e.select)e.select();}},60);}
// C / V: van al recuadro Comprar / Vender del Portafolio (más abajo), lo despliegan si estaba
// plegado, lo centran en pantalla y dejan el cursor en el ticker (en Vender, el combo de tickers).
function kbOperar(id){
  _kbIr(['portafolio']);
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
  if(k!=='?'&&k!=='h'&&k!=='H'&&(typeof _gdcInitDone==='undefined'||!_gdcInitDone))return; // todavía sin login / cargando
  var hecho=true;
  if(k==='?'){kbAyuda();}
  else if(k==='p'||k==='P'){_kbIr(['portafolio']);}
  else if(k==='m'||k==='M'){if(_kbIr(['movimientos']))_kbFoco('m-ticker');}
  else if(k==='c'||k==='C'){kbOperar('vbuy-ticker');}
  else if(k==='v'||k==='V'){kbOperar('vsell-ticker');}
  else if(k==='d'||k==='D'){_kbIr(['dividendos','tracker']);}
  else if(k==='t'||k==='T'){if(_kbIr(['tipocambio']))_kbFoco('tc-ccl-fecha');}
  else if(k==='r'||k==='R'){if(typeof fetchAllQuotes==='function')fetchAllQuotes();}
  else if(k==='/'){if(_kbIr(['portafolio']))_kbFoco('port-ticker-filter');}
  else if((k==='i'||k==='I')&&CFG.informe&&typeof infAbrir==='function'){infAbrir();}
  else if(k==='h'||k==='H'){location.href='../index.html';}
  else hecho=false;
  if(hecho)e.preventDefault();
});

// Botón "?" arriba a la derecha (en la barra superior) que abre la lista de atajos
(function(){function add(){var tb=document.querySelector('.topbar');if(!tb||document.getElementById('kb-btn'))return;
  var b=document.createElement('button');b.id='kb-btn';b.type='button';b.textContent='?';b.title='Atajos de teclado (tecla ?)';b.onclick=function(){kbAyuda();};
  b.style.cssText='margin-left:auto;width:24px;height:24px;flex-shrink:0;border-radius:50%;border:1px solid var(--border2);background:var(--surface2);color:var(--text2);font-family:var(--mono);font-size:.78rem;font-weight:700;cursor:pointer;line-height:1;padding:0';
  b.onmouseenter=function(){b.style.borderColor='var(--accent)';b.style.color='var(--accent)';};b.onmouseleave=function(){b.style.borderColor='var(--border2)';b.style.color='var(--text2)';};
  tb.appendChild(b);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();})();

// ─── Vista celular: en pantallas angostas cada posición se ve como tarjeta ───────────────────
(function(){if(document.getElementById('mob-cards-css'))return;var st=document.createElement('style');st.id='mob-cards-css';
  var P='#panels-grid .panel-table ';
  st.textContent='@media (max-width:640px){'+
    P+'thead{display:none}'+P+'table,'+P+'tbody,'+P+'tfoot{display:block;width:100%}'+
    P+'tr{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px 10px;padding:.6rem .7rem;border-bottom:1px solid var(--border)}'+
    P+'tbody tr:last-child{border-bottom:none}'+
    P+'td{border:none!important;padding:0!important;text-align:left!important;white-space:normal;min-width:0}'+
    P+'td:nth-child(1){grid-column:1/3;font-size:.92rem;align-self:center}'+
    P+'td:nth-child(2){grid-column:3;justify-self:end;text-align:right!important;align-self:center}'+
    P+'td:nth-child(n+3)::before{display:block;font-size:.54rem;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;font-family:var(--mono);font-weight:400;margin-bottom:1px}'+
    P+'td:nth-child(4)::before{content:"Inversión $"}'+P+'td:nth-child(5)::before{content:"Mercado $"}'+P+'td:nth-child(6)::before{content:"PPC $"}'+
    P+'td.col-panual::before{content:"% anual"}'+P+'td.col-pventa::before{content:"P. Venta"}'+P+'td.col-ptipo::before{content:"% tipo"}'+
    P+'td.col-rebal::before{content:"Rebalanceo"}'+P+'td.col-rsi::before{content:"RSI"}'+P+'td.col-qty::before{content:"Cant."}'+
    P+'td.col-rebal{grid-column:1/-1}'+P+'tfoot tr{background:var(--surface2)}'+
    P+'td:empty{display:none}'+
  '}';
  document.head.appendChild(st);})();

// ─── Auditoría de la tabla completa de ratios (solo GDC, que es la que se sincroniza) ─────────
// Para cada Cedear de RATIOS_TABLE con precio en BYMA: ratio que surge del mercado =
// precio NYSE (Finnhub) × CCL ÷ precio del Cedear. Lista los que difieren más de 25%, con "Usar"
// para corregirlos (igual que editarlo a mano) y "Sync" para mandar la tabla a las demás carteras.
var RA_AUD={res:[],corriendo:false,hechos:0,total:0,cancel:false};
// ratios típicos: enteros (20, 144) o fracciones 1/n (0,3333 = 1 Cedear cada 3 acciones)
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
// Si la operación es de los últimos 7 días y el precio cargado se aleja más de 10% del de mercado,
// pide confirmación (típico: un cero de más o de menos). Se compara en la misma unidad que se carga
// (pesos por Cedear/acción, o por 100 nominales en bonos y ON).
function _precioMercadoARS(t){
  var q=quotes[t];if(!q||!(q.price>0))return null;
  if(isBonoUSDDirecto(t))return null;
  var s=getSector(t);
  if(q.fromByma||['argentina','bonos','on','fci'].indexOf(s)>=0||BRL_TICKERS.has(t))return q.price;
  return CCL_HOY>0?q.price*CCL_HOY/getRatio(t):null; // cotización en USD de la acción → precio del Cedear
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
// Lo que se borra o edita (movimientos y cobros) queda 30 días en config 'papelera' (Supabase, se ve
// desde cualquier dispositivo). Después de cada borrado/edición aparece "↶ Deshacer" unos segundos,
// y en Movimientos está la tarjeta 🗑 Papelera para restaurar cualquier cosa de la lista.
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
      trkSave();try{trkRender();}catch(_e){}try{renderDivsCard();}catch(_e){}try{renderPortfolio();}catch(_e){}}
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
// Antes se usaba new Date().toISOString() (UTC): en Argentina, después de las 21 h ya daba la fecha
// de MAÑANA. Además, si la app quedaba abierta de un día para otro, la fecha precargada seguía siendo
// la de ayer. Ahora: fecha local, se actualiza sola al volver a la app (si no la cambiaste a mano),
// el campo se marca en ámbar cuando la fecha no es hoy, y al confirmar una compra o venta con otra
// fecha se pide confirmación.
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
// Al escribir el ticker en 🛒 Comprar (o en el formulario de Movimientos) se elige solo el mercado:
//  1) el que usaste la última vez que operaste ese ticker en esta cartera,
//  2) la tabla de sectores de la app,
//  3) las listas de BYMA (data912): bonos, ON, acciones argentinas o Cedears (con su país),
// y, en Comprar, se precarga el precio de mercado si el campo está vacío. Todo se puede cambiar a mano.
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
  // datalist con los tickers que ya operaste en esta cartera
  var dl=document.getElementById(tkId+'-dl');if(!dl){dl=document.createElement('datalist');dl.id=tkId+'-dl';document.body.appendChild(dl);tk.setAttribute('list',dl.id);}
  tk.addEventListener('focus',function(){var seen={},o='';for(var i=movimientos.length-1;i>=0;i--){var m=movimientos[i];if(m&&m.ticker&&m.ticker!=='APORTE'&&!seen[m.ticker]){seen[m.ticker]=1;o+='<option value="'+m.ticker+'">';}}dl.innerHTML=o;});
  // al limpiar el formulario (después de guardar) vuelve a detectar
  tk.addEventListener('input',function(){if(!tk.value){manual=false;ult='';_mktHint(sel,'');var pe=precioId&&document.getElementById(precioId);if(pe&&pe.dataset.auto){pe.value='';delete pe.dataset.auto;}}});
}
(function(){var go=function(){try{mktEnlazar('vbuy-ticker','vbuy-mkt','vbuy-precio-ars',function(){if(typeof vbuyOnMktChange==='function')vbuyOnMktChange();});mktEnlazar('m-ticker','m-mkt',null,null);}catch(e){console.warn('mktEnlazar',e);}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();})();

// ─── Orden de campos en Comprar y Vender ──────────────────────────────────────
// Comprar: Ticker · Precio · Cantidad · Fecha · Mercado (se autoselecciona).
// Vender:  Ticker · Precio · Cantidad · Fecha. El CCL/MEP no se pide: sale de la tabla de Tipo de
// cambio según el activo (CCL para acciones/Cedears, MEP para bonos/ON/FCI).
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
// Al cierre de cada período: honorario = % × (valor final según el broker − inversión inicial del
// período); sin ganancia, 0. Se registra lo cobrado en config 'honorarios' y viaja en el resumen
// para que Carteras administradas muestre el acumulado.
var HON_LIST=null;
async function honCargar(){if(HON_LIST)return HON_LIST;var v=null;try{v=await sbGetConfig('honorarios');}catch(e){}if(typeof v==='string'){try{v=JSON.parse(v);}catch(e){v=null;}}HON_LIST=Array.isArray(v)?v:[];return HON_LIST;}
function _honPeriodoDefault(){
  // el último período cerrado (si ya pasó el corte) o el que está en curso
  var corte=histUltimoCorte();if(!corte)return {ini:'',fin:''};
  var ini=(parseInt(corte.slice(0,4),10)-1)+corte.slice(4);return {ini:ini,fin:corte};
}
async function honAbrir(){
  await honCargar();
  var pd=_honPeriodoDefault(),inv=getRawNum('inv-sidebar-usd')||'';
  var ov=document.getElementById('hon-dlg');if(ov)ov.remove();
  ov=document.createElement('div');ov.id='hon-dlg';ov.onclick=function(e){if(e.target===ov)ov.remove();};
  ov.style.cssText='position:fixed;inset:0;z-index:100002;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px';
  var inp='width:100%;background:var(--surface2);color:var(--text);border:1px solid var(--border2);border-radius:6px;padding:.4rem .5rem;font-family:var(--mono);font-size:.84rem';
  var lb='font-family:var(--mono);font-size:.6rem;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin:.55rem 0 .2rem';
  var pct=Math.round(CFG.honorario*100);
  ov.innerHTML='<div style="background:var(--surface);border:1px solid var(--border2);border-radius:12px;max-width:480px;width:100%;padding:1rem 1.1rem;font-family:var(--sans);color:var(--text);max-height:92vh;overflow:auto">'+
    '<div style="font-weight:700;font-size:.95rem">💼 Honorario de '+CFG.nombre+'</div>'+
    '<div style="font-family:var(--mono);font-size:.64rem;color:var(--text3);margin-top:2px">'+pct+'% de (valor final según el broker − inversión inicial del período). Sin ganancia, 0.</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 10px">'+
      '<div><div style="'+lb+'">Inicio del período</div><input id="hon-ini" type="date" value="'+pd.ini+'" style="'+inp+'"></div>'+
      '<div><div style="'+lb+'">Cierre del período</div><input id="hon-fin" type="date" value="'+pd.fin+'" style="'+inp+'"></div>'+
      '<div><div style="'+lb+'">Inversión inicial USD</div><input id="hon-inv" type="number" step="any" value="'+(inv?Math.round(inv*100)/100:'')+'" style="'+inp+'" oninput="honCalc()"></div>'+
      '<div><div style="'+lb+'">Valor final USD (broker)</div><input id="hon-val" type="number" step="any" placeholder="el que muestra el broker" style="'+inp+'" oninput="honCalc()"></div>'+
    '</div>'+
    '<div id="hon-res" style="margin-top:.7rem;padding:.55rem .7rem;background:var(--surface2);border:1px solid var(--border);border-radius:8px;font-family:var(--mono);font-size:.78rem">Cargá el valor final del broker.</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 10px">'+
      '<div><div style="'+lb+'">Monto cobrado USD</div><input id="hon-cob" type="number" step="any" style="'+inp+'" oninput="this.dataset.man=1"></div>'+
      '<div><div style="'+lb+'">Fecha de cobro</div><input id="hon-fecha" type="date" value="'+_hoyLocalISO()+'" style="'+inp+'"></div>'+
    '</div>'+
    '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:.8rem"><button class="btn btn-sm" onclick="document.getElementById(\'hon-dlg\').remove()">Cerrar</button><button class="btn btn-a btn-sm" onclick="honGuardar()">Registrar cobro</button></div>'+
    '<div style="'+lb+';margin-top:1rem">Honorarios registrados</div><div id="hon-lista"></div></div>';
  document.body.appendChild(ov);honLista();
}
function honCalc(){
  var inv=parseFloat(document.getElementById('hon-inv').value),val=parseFloat(document.getElementById('hon-val').value),r=document.getElementById('hon-res'),c=document.getElementById('hon-cob');
  if(!(inv>0)||!(val>0)){r.textContent='Cargá la inversión inicial y el valor final del broker.';return;}
  var g=val-inv,h=Math.max(0,g*CFG.honorario),pc=g/inv*100;
  r.innerHTML='Ganancia: <b style="color:'+(g>=0?'var(--accent)':'var(--red)')+'">'+(g>=0?'+':'−')+'USD '+Math.abs(g).toLocaleString('es-AR',{maximumFractionDigits:2})+'</b> ('+(pc>=0?'+':'')+pc.toFixed(2).replace('.',',')+'%)<br>'+
    'Honorario '+Math.round(CFG.honorario*100)+'%: <b style="color:var(--accent);font-size:.95rem">USD '+h.toLocaleString('es-AR',{maximumFractionDigits:2})+'</b>'+(g<=0?' <span style="color:var(--text3)">(sin ganancia, no se cobra)</span>':'');
  if(c&&!c.dataset.man)c.value=Math.round(h*100)/100;
}
async function honGuardar(){
  var g=function(id){return document.getElementById(id).value;};
  var inv=parseFloat(g('hon-inv')),val=parseFloat(g('hon-val')),cob=parseFloat(g('hon-cob'));
  if(!(inv>0)||!(val>0)){alert('Falta la inversión inicial o el valor final.');return;}
  if(!g('hon-fin')){alert('Falta la fecha de cierre del período.');return;}
  if(isNaN(cob))cob=Math.max(0,(val-inv)*CFG.honorario);
  var e={ini:g('hon-ini'),fin:g('hon-fin'),anio:g('hon-fin').slice(0,4),inv:inv,valorFinal:val,ganancia:Math.round((val-inv)*100)/100,pct:CFG.honorario,honorario:Math.round(Math.max(0,(val-inv)*CFG.honorario)*100)/100,cobrado:Math.round(cob*100)/100,fechaCobro:g('hon-fecha'),ts:Date.now()};
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
// Marco del color de la cartera, chip fijo arriba a la derecha con foto y nombre, nombre en marca
// de agua, título de la pestaña "Nombre · Inversiones" con ícono de color, y confirmación grande de
// compras y ventas que dice en qué cartera se opera.
var CART_COLOR={gdc:'#22c55e',ana:'#e879f9',hilda:'#fb923c',juli:'#38bdf8',omar:'#facc15'};
var CART_FOTO={gdc:'PerfilGaston.png',ana:'PerfilAna.png',hilda:'PerfilHilda.png',juli:'Juli.png',omar:'perfilOmar.png'};
function cartColor(){return CFG.color||CART_COLOR[CFG.id]||'#7a9cc5';}
function cartNombre(){var n=CFG.nombre;if(typeof CARTERA_ACTIVA!=='undefined'&&CARTERA_ACTIVA&&CARTERA_ACTIVA!=='principal'){n+=' · '+({cocos:'Cristian (Cocos)',vetajeep:'Jeep'}[CARTERA_ACTIVA]||CARTERA_ACTIVA);}return n;}
function _cartAv(sz){var c=cartColor(),f=CFG.foto||CART_FOTO[CFG.id];
  return '<span style="width:'+sz+'px;height:'+sz+'px;border-radius:50%;background:'+c+';display:inline-flex;align-items:center;justify-content:center;font-weight:800;color:#0b1120;font-size:'+Math.round(sz*.45)+'px;overflow:hidden;flex-shrink:0;border:2px solid '+c+'">'+
    (f?'<img src="'+f+'" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.replaceWith(document.createTextNode(\''+CFG.nombre.charAt(0)+'\'))">':CFG.nombre.charAt(0))+'</span>';}
function cartIdentidad(){
  var c=cartColor();
  document.title=CFG.nombre+' · Inversiones';
  // ícono de la pestaña: círculo del color con la inicial
  try{var cv=document.createElement('canvas');cv.width=cv.height=64;var x=cv.getContext('2d');x.fillStyle=c;x.beginPath();x.arc(32,32,30,0,Math.PI*2);x.fill();
    x.fillStyle='#0b1120';x.font='bold 36px Inter,system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(CFG.nombre.charAt(0),32,35);
    var l=document.querySelector('link[rel="icon"]');if(!l){l=document.createElement('link');l.rel='icon';document.head.appendChild(l);}l.type='image/png';l.href=cv.toDataURL('image/png');}catch(e){}
  if(!document.getElementById('cart-frame')){
    var fr=document.createElement('div');fr.id='cart-frame';fr.style.cssText='position:fixed;inset:0;border:2px solid '+c+';pointer-events:none;z-index:99990;box-shadow:inset 0 0 0 1px '+c+'26';document.body.appendChild(fr);
    var wm=document.createElement('div');wm.id='cart-wm';wm.textContent=CFG.nombre.toUpperCase();
    wm.style.cssText='position:fixed;right:24px;bottom:40px;font-family:Inter,system-ui,sans-serif;font-size:7rem;font-weight:900;letter-spacing:-.04em;color:'+c+';opacity:.05;pointer-events:none;z-index:-1;user-select:none';document.body.appendChild(wm);
    var ch=document.createElement('div');ch.id='cart-chip';ch.title='Estás en la cartera de '+CFG.nombre;
    ch.style.cssText='display:flex;align-items:center;gap:7px;background:'+c+'1f;border:1px solid '+c+';border-radius:999px;padding:1px 11px 1px 1px;font-family:Inter,system-ui,sans-serif;font-weight:700;font-size:.8rem;color:'+c+';white-space:nowrap';
    // va en la barra superior (siempre visible), anclado a la derecha junto al botón ? (la barra tiene
    // altura fija y, si se agregaba al final, quedaba en una segunda línea oculta)
    var tb0=document.querySelector('.topbar');
    if(tb0){if(getComputedStyle(tb0).position==='static')tb0.style.position='relative';
      var box=document.createElement('div');box.id='tb-right';box.style.cssText='position:absolute;right:10px;top:50%;transform:translateY(-50%);display:flex;align-items:center;gap:8px;background:var(--bg);padding-left:10px;z-index:5';
      var kb=document.getElementById('kb-btn');if(kb){kb.style.marginLeft='0';box.appendChild(kb);}tb0.appendChild(box);}
    else{ch.style.position='fixed';ch.style.top='8px';ch.style.right='12px';ch.style.zIndex='99991';document.body.appendChild(ch);}
  }
  // la foto del encabezado con el borde del color de la cartera
  try{var hi=document.querySelector('header img');if(hi){hi.style.borderColor=c;hi.style.boxShadow='0 0 0 3px '+c+'33';}}catch(e){}
  // Inv. Inicial al lado de la Liquidez (antes iba al final de la barra con margin-left:auto y quedaba
  // tapada por el chip o en una segunda línea oculta). La barra queda en una sola línea con scroll.
  try{var inv=document.getElementById('inv-sidebar-usd'),lu=document.getElementById('liq-usd');
    if(inv&&lu&&!inv._mov){inv._mov=1;var invBox=inv.closest('div');while(invBox&&invBox.parentNode&&!invBox.parentNode.classList.contains('topbar'))invBox=invBox.parentNode;
      var liqItem=lu.closest('.topbar-item');
      if(invBox&&liqItem&&invBox!==liqItem){invBox.style.marginLeft='.6rem';invBox.style.paddingLeft='.8rem';invBox.style.paddingRight='.8rem';invBox.style.borderRight='1px solid var(--border)';invBox.style.flexShrink='0';invBox.querySelectorAll('.topbar-label').forEach(function(l){l.style.whiteSpace='nowrap';});liqItem.style.flexShrink='0';
        // Liquidez + Inv. Inicial al principio de la barra (siempre a la vista; las cotizaciones siguen después)
        var tbp=liqItem.parentNode,ub=document.getElementById('auth-user-box'),ref=ub&&ub.parentNode===tbp?ub.nextSibling:tbp.firstChild;
        liqItem.style.borderLeft='none';liqItem.style.marginLeft='0';liqItem.style.paddingLeft='0';
        tbp.insertBefore(liqItem,ref);tbp.insertBefore(invBox,liqItem.nextSibling);}}
    var tbx=document.querySelector('.topbar'),tr=document.getElementById('tb-right');
    if(tbx){tbx.style.flexWrap='nowrap';tbx.style.overflowX='auto';tbx.style.overflowY='hidden';tbx.style.scrollbarWidth='none';if(tr)tbx.style.paddingRight=(tr.offsetWidth+24)+'px';}
    // fijo a la derecha de la barra (fuera del scroll horizontal)
    if(tr&&tbx){var rr=tbx.getBoundingClientRect();tr.style.position='fixed';tr.style.top=(rr.top+rr.height/2)+'px';tr.style.right='10px';tr.style.zIndex='99992';}
  }catch(e){console.warn('inv inicial',e);}
}
// Confirmación grande de compra / venta
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
    if(!o||!o.ticker||!(o.qty>0)||!(o.precio>0))return orig.apply(self,args); // datos incompletos: que valide el original
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
  // Omar: al cambiar de cartera (Cocos / Jeep) se actualiza el nombre del chip
  setInterval(function(){var n=document.getElementById('cart-chip-n');if(n&&n.textContent!==cartNombre())n.textContent=cartNombre();},1500);
})();
