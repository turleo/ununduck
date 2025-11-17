const addResourcesToCache = async (resources) => {
  const version = await (await fetch("/version")).text();
  const cache = await caches.open(version);
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/src/global.css",
      "/src/main.js",
      "/assets/bangs.json",
      "/assets/clipboard-check.svg",
      "/assets/clipboard.svg",
      "/assets/search.svg",
    ]),
  );
});

self.addEventListener("fetch", async (event) => {
  event.respondWith(caches.match(event.request, { ignoreSearch: true }));
});
