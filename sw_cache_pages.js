const cacheName = 'v1';

const cacheAssets = [
    'index.html',
    'contact.html',
    'menu.html',
    'today-special.html',
    '/css/font-awesome.min.css',
    '/css/templatemo-style.css',
    '/css/bootstrap.min.css',
    '/js/jquery-1.11.2.min.js',
    '/js/main.js',
    '/js/templatemo-script.js'
];

// call install event
self.addEventListener('install', e=> {
    console.log('Service Worker: Installed');

    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
});

// call activate event
self.addEventListener('activate', e =>{
    console.log('Service Worker: Activated');
    //Removee unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames =>{
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName){
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cache);
                    }
                })
                
            )
        })
    );
});

//Call fetch event

self.addEventListener('fetch', e =>{
    console.log('Service Worker: Fetching');

    e.respondWith(
        fetch(e.request).catch(()=> caches.match(e.request))
    );
});

