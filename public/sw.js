const CACHE_NAME = 'app-cache-v1';
// Pre-cache essential shell files. Adjust paths to your build output.
const PRECACHE_URLS = [
  '/',              // for GitHub Pages user site this is fine
  '/index.html',
  '/docs/index.html', // if you serve from /docs (see note below)
  '/vite.svg',
];

// Install: pre-cache shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for same-origin GETs; network fallback
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        // Cache successful basic/opaque responses
        const copy = res.clone();
        if (res.ok || res.type === 'opaque') {
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached); // if offline and not cached, this will still fail (OK)
    })
  );
});