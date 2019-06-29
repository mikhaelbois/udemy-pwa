
const CACHE_STATIC_NAME = 'static-v2';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/css/app.css',
  '/src/css/main.css',
  '/src/js/main.js',
  '/src/js/material.min.js',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];
const fetchUrl = 'https://httpbin.org/ip';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll(STATIC_FILES);
      })
  )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );
});

self.addEventListener('fetch', function(event) {
  // "Cache with network fallback" Strategy (With optinal dynamic caching)
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     if (response) {
  //       return response;
  //     } else {
  //       return fetch(event.request).then((res) => {
  //         return caches.open(CACHE_DYNAMIC_NAME)
  //           .then((cache) => {
  //             cache.put(event.request.url, res.clone());
  //             return res;
  //           });
  //       }).catch((err) => {
  //         //
  //       });
  //     }
  //   })
  // );

  // "Network only" Strategy
  // event.respondWith(fetch(event.request));

  // "Cache only" Strategy
  // event.respondWith(caches.match(event.request));

  // "Network, cache fallback" Strategy (With optinal dynamic caching)
  // event.respondWith(fetch(event.request).then((res) => {
  //     return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
  //       // Dynamically cache elements
  //       cache.put(event.request.url, res.clone()); // Response is consumed only once, need to clone

  //       return res;
  //     });
  //   }).catch((error) => {
  //     return caches.match(event.request);
  // }));

  // "Cache, then network" Strategy
  // Frontend side - main.js
  // event.respondWith(
  //   caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
  //     return fetch(event.request).then((res) => {
  //       cache.put(event.request, res.clone());

  //       return res;
  //     });
  //   })
  // );
  
  // const isInArray = (string, array) => {
  //   return array.includes(string);
  // }
  // Alternate version
  const isInArray = (string, array) => {
    let cachePath;
    if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
      // console.log('matched ', string);
      cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
    } else {
      cachePath = string; // store the full request (for CDNs)
    }

    return array.indexOf(cachePath) > -1;
  }

  // "Cache, then network", "Cache with network fallback" and "Cache only"
  if (event.request.url.indexOf(fetchUrl) > -1) {
    // "Cache, then network" Strategy with url parsing
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
        return fetch(event.request).then((res) => {
          cache.put(event.request, res.clone());

          return res;
        });
      })
    );
  } else if (isInArray(event.request.url, STATIC_FILES)) {
    // "Cache only" Strategy with url parsing
    event.respondWith(caches.match(event.request));
  } else {
    // "Cache with network fallback" Strategy (With optinal dynamic caching)
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        } else {
          return fetch(event.request).then((res) => {
            return caches.open(CACHE_DYNAMIC_NAME)
              .then((cache) => {
                cache.put(event.request.url, res.clone());
                return res;
              });
          }).catch((err) => {
            //
          });
        }
      })
    );
  }

});