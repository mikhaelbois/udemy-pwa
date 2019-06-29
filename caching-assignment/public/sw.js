// Service Workers

const CACHE_STATIC_NAME = 'static-v3';
const CACHE_DYNAMIC_NAME = 'dynamic-v3';

self.addEventListener('install', function(event) {
    event.waitUntil(caches.open(CACHE_STATIC_NAME).then(function (cache) {
        // Precache App Shell manually
        cache.addAll([
            '/',
            '/index.html',
            'https://fonts.googleapis.com/css?family=Roboto:400,700',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
            '/src/css/app.css',
            '/src/css/main.css',
            '/src/js/main.js',
            '/src/js/material.min.js'
        ]);
    }));
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                    // Deletes unused cache
                    return caches.delete(key);
                }
            }));
        })
    );

    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    // Check if element exists in cache
    event.respondWith(caches.match(event.request).then(function (response) {
        if (response) {
            return response;
        } else {
            return fetch(event.request).then((res) => {
                caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
                    // Dynamically cache elements
                    cache.put(event.request.url, res.clone()); // Response is consumed only once, need to clone

                    return res;
                });
            }).catch((error) => {
                // console.error(error);
            });
        } 
    }));

});
