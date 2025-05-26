// Service Worker для кешування - Лабораторна робота №9

const CACHE_NAME = 'lab-work-9-v1';
const urlsToCache = [
    '/index.html',
    '/css/main.css',
    '/css/components.css',
    '/js/performance.js',
    '/js/lazy-loading.js'
];

// Встановлення та кешування файлів
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Очищення старого кешу
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Обслуговування запитів з кешу
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

// Статистика кешу
self.addEventListener('message', event => {
    if (event.data?.type === 'CACHE_STATS') {
        caches.open(CACHE_NAME).then(cache => {
            cache.keys().then(keys => {
                event.ports[0].postMessage({
                    type: 'CACHE_STATS_RESPONSE',
                    data: {
                        cachedFiles: keys.length,
                        cacheSize: keys.length * 30
                    }
                });
            });
        });
    }
});
