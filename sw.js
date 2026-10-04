// Service worker mínimo para que el sitio se pueda instalar como app.
// No guarda nada en caché: todo se pide siempre a la red (así nunca queda una versión vieja).
// Sin conexión, las páginas muestran un aviso en vez del error del navegador.
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){
  if(e.request.mode!=='navigate') return;
  e.respondWith(fetch(e.request).catch(function(){
    return new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sin conexión</title><body style="margin:0;background:#0b1120;color:#e8f0ff;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px"><div><div style="font-size:2.4rem">📡</div><h2 style="margin:.6rem 0 .3rem">Sin conexión</h2><p style="color:#7a9cc5;margin:0 0 1.2rem">Las cotizaciones y los datos necesitan internet.</p><button onclick="location.reload()" style="background:#172035;color:#e8f0ff;border:1px solid #264070;border-radius:8px;padding:.6rem 1.2rem;font-size:1rem">Reintentar</button></div></body>',{headers:{'Content-Type':'text/html; charset=utf-8'}});
  }));
});
