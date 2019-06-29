// Service Workers

// Applies to all pages in current folder
// Can be named differently

const CACHE_STATIC_NAME = 'static-v4';
const CACHE_DYNAMIC_NAME = 'dynamic-v4';
const fetchUrl = 'https://httpbin.org/get';

self.addEventListener('install', function(event) {
    // console.log('install', event);

    event.waitUntil(caches.open(CACHE_STATIC_NAME).then(function (cache) {
        // Precache App Shell manually
        // cache.add('/');
        // cache.add('/index.html');
        // cache.add('/src/js/app.js');

        cache.addAll([
            '/',
            '/index.html',
            '/offline.html',
            // '/help/index.html', // Will be cached on request
            '/src/js/app.js',
            '/src/js/feed.js',
            '/src/js/material.min.js',
            '/src/css/app.css',
            '/src/css/feed.css',
            '/src/images/main-image.jpg',
            'https://fonts.googleapis.com/css?family=Roboto:400,700',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
            //'/src/js/promise.js', // Not needed
            //'/src/js/fetch.js', // Not needed
        ]);
    }));
});

self.addEventListener('activate', function (event) {
    // console.log('activate', event);

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
    // console.log('fetch', event);

    // Cache only Strategy - NOT VIABLE
    // event.respondWith(caches.match(event.request));

    // Network only Strategy - NOT VIABLE
    // event.respondWith(fetch(event.request));

    // Network first - Cache as fallback Strategy - NOT VIABLE
    // event.respondWith(fetch(event.request).catch(function (error) {
    //     return caches.match(event.request);
    // }));

    // Cache then Network Strategy
    // Different strategy depending of request
    if (event.request.url.indexOf(fetchUrl) > -1) {
        event.respondWith(
            caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
                return fetch(event.request).then((res) => {
                    cache.put(event.request, res.clone());

                    return res;
                });
            })
        );
    } else {
        // Cache with network fallback Strategy
        caches.match(event.request).then(function (response) {
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
                    // Serve Offline page if page is not cached yet
                    return caches.open(CACHE_STATIC_NAME).then(function (cache) {
                        return cache.match('/offline.html');
                    });
                });
            } 
        });
    }

    // Check if element exists in cache
    // event.respondWith(caches.match(event.request).then(function (response) {
    //     if (response) {
    //         return response;
    //     } else {
    //         return fetch(event.request).then((res) => {
    //             caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
    //                 // Dynamically cache elements
    //                 cache.put(event.request.url, res.clone()); // Response is consumed only once, need to clone

    //                 return res;
    //             });
    //         }).catch((error) => {
    //             // Serve Offline page if page is not cached yet
    //             return caches.open(CACHE_STATIC_NAME).then(function (cache) {
    //                 return cache.match('/offline.html');
    //             });
    //         });
    //     } 
    // }));
});

// Old Install Banner setup
var deferredPrompt;

self.addEventListener('beforeinstallprompt', function (event) {
    // Before install prompt is fired
    event.preventDefault();
    deferredPrompt = event;

    return false;
});
// /

// Promises
var promise = new Promise(function(resolve, reject) {
    // Function to execute
});

promise.then(function(result) {
    reject(); // Stops chain and create error
}).then(function(afterMethod) {
    // If no error
}).catch(function (rejectError) {
    // If error
});

// Fetch API - http://httpbin.org
fetch('http://httpbin.org/ip').then(function (response) {
    // console.log(response);

    return response.json();
}).then(function (data) {
    // console.log(data);
}).catch(function (error) {
    // console.error(error);
});

fetch('http://httpbin.org/post', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    //mode: 'cors', // Origin can read response
    //mode: 'no-cors', // Origin cannot read response
    body: JSON.stringify({
        message: 'POST Request test'
    })
}).then(function (response) {
    // console.log(response);

    return response.json();
}).then(function (data) {
    // console.log(data);
}).catch(function (error) {
    // console.error(error);
});





