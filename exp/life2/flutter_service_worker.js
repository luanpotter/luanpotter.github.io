'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/assets/fonts/Chonkly.otf": "d798ff9eabad6d7c4bc7e8b0fa8738d1",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/FontManifest.json": "a3ae432c6bdc26c65e46b80447994d9a",
"assets/AssetManifest.json": "1b89573fa5a30281e1273e4ebeedbab9",
"assets/LICENSE": "a89da089722cd7679fa799547dd4104c",
"manifest.json": "9af27539b7a61934c4c730b2d65140ed",
"index.html": "458052334b0532513c16b4c28f5d769a",
"/": "458052334b0532513c16b4c28f5d769a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"main.dart.js": "8ba08fd846319ec345d1cf09c9b83995",
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
