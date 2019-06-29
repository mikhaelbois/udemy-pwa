// App

if ('serviceWorker' in navigator) {
    // Register SW in all pages
    navigator.serviceWorker
        .register('/sw.js', {/*scope: '/help/'*/})
        .then(function() {
            // console.log('Registered')
        }).catch(function (error) {
            // console.error(error);
        });
}

