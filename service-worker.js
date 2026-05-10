self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("spinshot-cache").then(cache => {
      return cache.addAll([
        "/spinshot-drill-manager/",
        "/spinshot-drill-manager/index.html",
        "/spinshot-drill-manager/styles.css",
        "/spinshot-drill-manager/app.js",
        "/spinshot-drill-manager/manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
