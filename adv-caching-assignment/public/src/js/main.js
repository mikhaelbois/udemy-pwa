
var box = document.querySelector('.box');
var button = document.querySelector('button');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function() {
      console.log('Registered Service Worker!');
    });
}

button.addEventListener('click', function(event) {
  if (box.classList.contains('visible')) {
    box.classList.remove('visible');
  } else {
    box.classList.add('visible');
  }
});

// 1) Identify the strategy we currently use in the Service Worker (for caching)
// 2) Replace it with a "Network only" strategy => Clear Storage (in Dev Tools), reload & try using your app offline
// 3) Replace it with a "Cache only" strategy => Clear Storage (in Dev Tools), reload & try using your app offline
// 4) Replace it with "Network, cache fallback" strategy =>  => Clear Storage (in Dev Tools), reload & try using your app offline
// 5) Replace it with a "Cache, then network" strategy => Clear Storage (in Dev Tools), reload & try using your app offline
// 6) Add "Routing"/ URL Parsing to pick the right strategies: Try to implement "Cache, then network", "Cache with network fallback" and "Cache only" (all of these, with appropriate URL selection)

// Important: Clear your Application Storage first to get rid of the old SW & Cache from the Main Course Project!

const fetchUrl = 'https://httpbin.org/ip';
let networkDataReceived = false;

const updateBox = (data) => {
  console.log(data.origin);
  box.style.height = (data.origin.substr(0, 2) * 5) + 'px';
}

fetch(fetchUrl)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    networkDataReceived = true;
    updateBox(data);
  });

// "Cache, then network" strategy
// Server side - sw.js
if ('caches' in window) { // Needs to be validated on Frontend
  caches.match(fetchUrl).then((response) => {
    if (response) {
      return response.json();
    }
  }).then((data) => {
    if (!networkDataReceived && data) {
      updateBox(data);
    }
  });
}
