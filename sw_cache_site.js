const cacheName='v2';

self.addEventListener('install', function (event) {
    console.log('Service Worker: Installed');
});

self.addEventListener('activate', function (event) {
        console.log('Service Worker: Activated');
        //remove unwanted cache
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if(cache !== cacheName){
                            console.log('Service Worker: Clearing Old Cache');
                            return caches.delete(cache);
                        }
                    })
                )
            })
        );
    }
);

self.addEventListener('fetch', function (event)  {
    console.log('Service Worker: Fetching');
    event.respondWith(
        fetch(event.request)
        .then(res => {
            //make copy of response
            const resClone=res.clone();
            //open cache
            caches
            .open(cacheName)
            .then(cache => {
                //add response to cache
                cache.put(event.request, resClone);
            });
            return res;
        }).catch(err => caches.match(event.request).then(res => res))
    );
});