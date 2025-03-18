const CACHE_NAME = "file-viewer-cache-v6";
const FILES_TO_CACHE = [
    "/index.html",
    "/manifest.json",
    "/styles/style.css",
    "/scripts/script.js",
    "/scripts/install-pwa.js",
    "/service-worker.js",
    "/favicon.png",
    "/icons/icon192x192.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log("📦 [SW] Кешируем статические файлы...");
            try {
                await cache.addAll(FILES_TO_CACHE);
                console.log("✅ [SW] Статика закеширована");
            } catch (err) {
                console.error("❌ [SW] Ошибка кеширования:", err);
            }
        })
    );
    self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (url.pathname === "/files") {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => {
                        return cache.match(event.request).then((cachedResponse) => {
                            if (cachedResponse) {
                                console.log("✅ [SW] Отдаём список файлов из кеша");
                                return cachedResponse;
                            } else {
                                console.log("❌ [SW] Нет закешированного списка, отдаём пустой массив");
                                return new Response(JSON.stringify([]), {
                                    headers: {"Content-Type": "application/json"},
                                });
                            }
                        });
                    });
            })
        );
        return;
    }
    if (url.pathname.startsWith("/files/")) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        console.log("🔖 [SW] Кеширую файл:", event.request.url);
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => {
                        console.log("📁 [SW] Офлайн режим, пробуем отдать из кеша:", event.request.url);
                        return cache.match(event.request).then((cachedResponse) => {
                            if (cachedResponse) {
                                console.log("✅ [SW] Файл найден в кеше:", event.request.url);
                                return cachedResponse;
                            } else {
                                console.error("❌ [SW] Файл не найден в кеше:", event.request.url);
                                return new Response("Файл недоступен офлайн", { status: 404 });
                            }
                        });
                    });
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request)
                .then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(() => {
                    console.log("🌑 [SW] Офлайн и нет в кеше:", event.request.url);
                    return caches.match("/index.html");
                });
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log("🗑 [SW] Удаляем старый кеш:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
