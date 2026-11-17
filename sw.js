// Modificare CACHE_VERSION ad ogni pubblicazione per aggiornare i file offline.
const CACHE_VERSION = 'ginny-v1-20261117';
const APP_FILES = ['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE_VERSION).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
 event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_VERSION).map(k=>caches.delete(k)))),self.clients.claim()]));
});
self.addEventListener('fetch', event => {
 const request=event.request;
 if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
 if(request.mode === 'navigate') {
  event.respondWith(fetch(request).then(response => {if(response.ok){let copy=response.clone();caches.open(CACHE_VERSION).then(cache=>cache.put('./index.html',copy));}return response;}).catch(()=>caches.match('./index.html')));
  return;
 }
 event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response=>{if(response.ok){let copy=response.clone();caches.open(CACHE_VERSION).then(cache=>cache.put(request,copy));}return response;})));
});
