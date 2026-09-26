// StudyMaster Malawi - Progressive Web App Service Worker
const CACHE_NAME = 'studymaster-cache-v6';
const STATIC_ASSETS = [
  '/',
  '/admin',
  '/index.html',
  '/manifest.json',
  '/manifest.webmanifest',
  '/admin-manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/icon.png',
  '/icon.jpg',
  '/icon.svg',
  '/admin-icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

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

// Broadcast update message to client windows
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip cross-origin chrome extensions
  if (!url.protocol.startsWith('http')) return;

  // Never intercept dev requests, Vite internals, API endpoints, or manifests
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.endsWith('manifest.json') ||
    url.pathname.endsWith('manifest.webmanifest')
  ) {
    return;
  }

  // Network-First for Navigation (HTML) and Source scripts/styles so updates appear immediately
  if (event.request.mode === 'navigate' || event.request.destination === 'script' || event.request.destination === 'style') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return (await caches.match('/index.html')) || (await caches.match('/'));
          }
        })
    );
    return;
  }

  // Cache-First with background revalidation for static assets (images, fonts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
