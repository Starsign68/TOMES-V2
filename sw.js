// Files to cache
const cacheName = 'TOMES-V2';
const appFiles = [
    'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/',
];

// Installing Service Worker
self.addEventListener('install', (e) => {
    alert('[Service Worker] Install');
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        alert('[Service Worker] Caching all: app shell and content');
        await cache.addAll(contentToCache);
    })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const r = await caches.match(e.request);
        alert(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) return r;
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        alert(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());
});
