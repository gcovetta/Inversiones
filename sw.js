// Service worker: la app abre rápido y sin señal.
// - Archivos con versión (portafolio.js?v=N, datos.js?d=N y librerías del CDN con versión fija): se guardan en el
//   teléfono la primera vez y después se sirven desde ahí (nunca quedan viejos: cada versión nueva tiene otra URL).
// - Páginas (HTML): siempre se piden a la red; si no hay señal o tarda más de 4 s, se usa la última copia guardada.
// - Datos (Supabase, cotizaciones): no se tocan; sin señal la app muestra lo último guardado en el navegador.
var CACHE='inv-app-v1';
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(K){return Promise.all(K.filter(function(k){return k.indexOf('inv-app-')===0&&k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();})); });
function _sinConexion(){
  return new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sin conexión</title><body style="margin:0;background:#0b1120;color:#e8f0ff;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px"><div><div style="font-size:2.4rem">📡</div><h2 style="margin:.6rem 0 .3rem">Sin conexión</h2><p style="color:#7a9cc5;margin:0 0 1.2rem">Las cotizaciones y los datos necesitan internet.</p><button onclick="location.reload()" style="background:#172035;color:#e8f0ff;border:1px solid #264070;border-radius:8px;padding:.6rem 1.2rem;font-size:1rem">Reintentar</button></div></body>',{headers:{'Content-Type':'text/html; charset=utf-8'}});
}
function _esFijo(u){
  if(u.origin===self.location.origin) return /\/comun\/(portafolio(\.min)?|datos)\.js$/.test(u.pathname)&&/[?&](v|d)=\d/.test(u.search);
  return (u.hostname==='cdn.jsdelivr.net'&&/@\d+\.\d+\.\d+/.test(u.pathname))||(u.hostname==='cdn.sheetjs.com'&&/xlsx-\d/.test(u.pathname));
}
self.addEventListener('fetch', function(e){
  var req=e.request;if(req.method!=='GET')return;
  var u;try{u=new URL(req.url);}catch(x){return;}
  if(req.mode==='navigate'){
    e.respondWith(new Promise(function(res){
      var listo=false,fin=function(r){if(!listo){listo=true;res(r);}};
      var deCache=function(){return caches.open(CACHE).then(function(c){return c.match(req,{ignoreSearch:true});});};
      var t=setTimeout(function(){deCache().then(function(r){if(r)fin(r);});},4000);
      fetch(req).then(function(r){clearTimeout(t);if(r&&r.ok){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(u.origin+u.pathname,cp);});}fin(r);})
        .catch(function(){clearTimeout(t);deCache().then(function(r){fin(r||_sinConexion());});});
    }));
    return;
  }
  if(_esFijo(u)){
    e.respondWith(caches.open(CACHE).then(function(c){return c.match(req).then(function(hit){
      if(hit)return hit;
      return fetch(req).then(function(r){
        if(r&&(r.ok||r.type==='opaque')){
          var cp=r.clone();
          // borrar versiones anteriores del mismo archivo
          c.keys().then(function(K){K.forEach(function(k){var ku=new URL(k.url);if(ku.origin===u.origin&&ku.pathname===u.pathname&&ku.search!==u.search)c.delete(k);});});
          c.put(req,cp);
        }
        return r;});
    });}));
  }
});

// Avisos push: los manda la función "avisos" de Supabase; acá se muestran y, al tocarlos, abren la app
self.addEventListener('push', function(e){
  var d={};try{d=e.data?e.data.json():{};}catch(x){d={title:'Inversiones',body:e.data?e.data.text():''};}
  e.waitUntil(self.registration.showNotification(d.title||'Inversiones',{body:d.body||'',tag:d.tag||undefined,icon:'app/icon-192.png',badge:'app/icon-192.png',data:{url:d.url||self.registration.scope}}));
});
self.addEventListener('notificationclick', function(e){
  e.notification.close();var u=(e.notification.data&&e.notification.data.url)||self.registration.scope;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(function(L){for(var i=0;i<L.length;i++){if(L[i].url.indexOf(u)===0&&'focus' in L[i])return L[i].focus();}return clients.openWindow(u);}));
});
