self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("weather-cache").then((cache) => {
      return cache.addAll(["/index.html", "/manifest.json", "/script.js"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("push", (event) => {
  const { title, body, url } = event.data.json();

  const options = {
    body,
    icon: "/icons/weather.png",
    badge: "/icons/weather.png",
    data: { url },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data.url;
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
