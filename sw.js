/* ============================================================
   StoreSync POS — Service Worker
   Strategy: Cache First + Network Fallback
   ============================================================ */

const CACHE_NAME = 'storesync-v1.0.0';
const DYNAMIC_CACHE = 'storesync-dynamic-v1.0.0';

// Assets yang di-cache saat install
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
];

// External resources to cache
const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700;800;900&display=swap',
];

/* ===== INSTALL ===== */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing StoreSync v1.0.0...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      // Cache local assets (required)
      return cache.addAll(STATIC_ASSETS)
        .then(() => {
          // Cache external assets (optional, don't fail if unavailable)
          return Promise.allSettled(
            EXTERNAL_ASSETS.map(url =>
              fetch(url, { mode: 'cors' })
                .then(res => res.ok ? cache.put(url, res) : null)
                .catch(() => null)
            )
          );
        });
    }).then(() => {
      console.log('[SW] Install complete');
      return self.skipWaiting();
    })
  );
});

/* ===== ACTIVATE ===== */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activated, claiming clients');
      return self.clients.claim();
    })
  );
});

/* ===== FETCH ===== */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) return;

  event.respondWith(handleFetch(request, url));
});

async function handleFetch(request, url) {
  // Strategy: Cache First → Network → Dynamic Cache
  try {
    // 1. Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Refresh cache in background for HTML/API
      if (url.pathname.endsWith('.html') || url.pathname === '/') {
        refreshCache(request);
      }
      return cachedResponse;
    }

    // 2. Try network
    const networkResponse = await fetch(request);

    // 3. Cache successful responses dynamically
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;

  } catch (error) {
    // 4. Offline fallback
    console.log('[SW] Fetch failed, serving offline fallback:', request.url);

    // For navigation requests, serve cached index.html
    if (request.mode === 'navigate') {
      const cached = await caches.match('./index.html');
      if (cached) return cached;
    }

    // Return offline page for other requests
    return new Response(
      JSON.stringify({ error: 'Offline - data tidak tersedia' }),
      { headers: { 'Content-Type': 'application/json' }, status: 503 }
    );
  }
}

async function refreshCache(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response);
    }
  } catch (e) {
    // Network unavailable, silently fail
  }
}

/* ===== MESSAGE HANDLER ===== */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

/* ===== BACKGROUND SYNC (untuk future use) ===== */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    console.log('[SW] Background sync: transactions');
    // Future: sync pending transactions to server
  }
});

/* ===== PUSH NOTIFICATIONS (untuk future use) ===== */
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Ada notifikasi baru dari StoreSync',
      icon: './icons/icon-192.png',
      badge: './icons/icon-72.png',
      vibrate: [100, 50, 100],
      data: { url: data.url || './' },
      actions: [
        { action: 'open', title: 'Buka Aplikasi' },
        { action: 'dismiss', title: 'Tutup' }
      ]
    };
    event.waitUntil(
      self.registration.showNotification(data.title || 'StoreSync POS', options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || './')
    );
  }
});
