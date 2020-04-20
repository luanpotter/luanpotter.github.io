'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/assets/fonts/Chonkly.otf": "d798ff9eabad6d7c4bc7e8b0fa8738d1",
"assets/FontManifest.json": "08ce1b3b2184a269062e7d64c07de9e7",
"assets/AssetManifest.json": "1b89573fa5a30281e1273e4ebeedbab9",
"assets/LICENSE": "65a84aefcc0d59ed02da4f4dc733070a",
"manifest.json": "9af27539b7a61934c4c730b2d65140ed",
"index.html": "458052334b0532513c16b4c28f5d769a",
"/": "458052334b0532513c16b4c28f5d769a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"main.dart.js": "e2bdd282ce48482d397d0eda28e71e73",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
