const CACHE_NAME = "esila-nurse-studio-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./training.html",
  "./simulation.html",
  "./profile.html",
  "./styles.css",
  "./app-core.js",
  "./home.js",
  "./training.js",
  "./simulation.js",
  "./profile.js",
  "./manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
