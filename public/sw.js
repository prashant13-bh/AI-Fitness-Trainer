// Service Worker for Bruce Glow-Up 2027 — Winter Arc
// Enables 100% offline gym access, route caching & instant launch

const CACHE_NAME = 'bruce-arc-v2';
const STATIC_ASSETS = [
  '/',
  '/glowup',
  '/arc',
  '/nk-diet',
  '/progress',
  '/coach',
  '/lock-in',
  '/review',
  '/profile',
  '/manifest.json',
  '/favicon.ico',
];

// Install: pre-cache critical app shell routes
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll warning (some routes may be generated dynamically):', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first for navigation/data, Cache-first / Stale-while-revalidate for static assets
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignore non-GET and browser extension requests
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // HTML Page Navigation: Network First with offline Cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match('/glowup');
          return fallback || caches.match('/');
        })
    );
    return;
  }

  // Static Assets (_next/static, images, fonts): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
