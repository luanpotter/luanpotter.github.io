'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/FontManifest.json": "580ff1a5d08679ded8fcf5c6848cece7",
"assets/AssetManifest.json": "99914b932bd37a50b983c5e7c90ae93b",
"assets/LICENSE": "65a84aefcc0d59ed02da4f4dc733070a",
"manifest.json": "b5a73da24426a12011ab1373ccb037f2",
"index.html": "e2c4015457c201e564a93e3a6fb6a474",
"/": "e2c4015457c201e564a93e3a6fb6a474",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"main.dart.js": "c4597747f457d052e686b80191e0d8d8",
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
