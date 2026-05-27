// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-8-starter-v3';
const RECIPE_URLS = [
  './recipes/1_50-thanksgiving-side-dishes.json',
  './recipes/2_roasting-turkey-breast-with-stuffing.json',
  './recipes/3_moms-cornbread-stuffing.json',
  './recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  './recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  './recipes/6_one-pot-thanksgiving-dinner.json',
];
const APP_SHELL_URLS = [
  './',
  './index.html',
  './manifest.json',
  './assets/styles/main.css',
  './assets/scripts/main.js',
  './assets/scripts/RecipeCard.js',
  './assets/images/icons/0-star.svg',
  './assets/images/icons/1-star.svg',
  './assets/images/icons/2-star.svg',
  './assets/images/icons/3-star.svg',
  './assets/images/icons/4-star.svg',
  './assets/images/icons/5-star.svg',
  './assets/images/icons/icon-192x192.png',
  './assets/images/icons/icon-256x256.png',
  './assets/images/icons/icon-384x384.png',
  './assets/images/icons/icon-512x512.png',
];

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // B6. Add all of the URLs from RECIPE_URLs here so that they are
      //            added to the cache when the ServiceWorker is installed
      return cache.addAll([...APP_SHELL_URLS, ...RECIPE_URLS]);
    })
  );
  self.skipWaiting();
});

// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  // We added some known URLs to the cache above, but tracking down every
  // subsequent network request URL and adding it manually would be very taxing.
  // We will be adding all of the resources not specified in the intiial cache
  // list to the cache as they come in.
  /*******************************/
  // This article from Google will help with this portion. Before asking ANY
  // questions about this section, read this article.
  // NOTE: In the article's code REPLACE fetch(event.request.url) with
  //       fetch(event.request)
  // https://developer.chrome.com/docs/workbox/caching-strategies-overview/
  /*******************************/
  // B7. Respond to the event by opening the cache using the name we gave
  //            above (CACHE_NAME)
  // B8. If the request is in the cache, return with the cached version.
  //            Otherwise fetch the resource, add it to the cache, and return
  //            network response.
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
    )
  );
});
