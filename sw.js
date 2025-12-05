
// Aquest fitxer s'encarrega de la funcionalitat offline i de fer que l'app sigui instal·lable.

// Nom i versió de la memòria cau (cache)
const CACHE_NAME = 'apa-cache-v2'; // Hem canviat la versió per forçar l'actualització

// Llista de fitxers i recursos essencials per al funcionament de l'app
const urlsToCache = [
  '/',
  '/index.html',
  '/logo.ico',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@700;800&display=swap',
  'https://unpkg.com/lucide@latest',
  'https://player.vimeo.com/api/player.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging.js'
];

// Esdeveniment 'install': S'activa quan el navegador instal·la el service worker.
// Guardem els fitxers essencials a la memòria cau.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache oberta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Esdeveniment 'fetch': S'activa cada cop que l'app demana un recurs (una imatge, un script, etc.).
// Primer busca a la memòria cau, i si no el troba, el demana a la xarxa.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna el recurs des de la memòria cau
        }
        return fetch(event.request); // Demana el recurs a la xarxa
      }
    )
  );
});

// Esdeveniment 'activate': S'activa quan el service worker nou reemplaça un d'antic.
// Serveix per netejar versions antigues de la memòria cau.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
