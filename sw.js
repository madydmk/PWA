const PREFIX = 'V7.4'
const CACHED_FILE = ["https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",]

self.addEventListener('install', (evt)=>{
    self.skipWaiting()
    evt.waitUntil((async()=>{
       const cache = await caches.open(PREFIX)
       cache.add(new Request("/offline.html")) 
       await Promise.all([...CACHED_FILE, '/offline.html'].map((path)=>{
           return cache.add(new Request(path))
       }
       ))
    console.log(PREFIX, '${PREFIX} Install')
    })())
})
self.addEventListener('activate', (evt)=>{
    clients.claim()
    evt.waitUntil((async()=>{
        const keys = await caches.keys()
        await Promise.all(
            keys.map((key)=>{
                if(!key.includes(PREFIX)){
                    return caches.delete(key)
                }
            })
        )
     })())
    console.log(PREFIX, '${PREFIX} Activate')
})


self.addEventListener('fetch',(evt)=>{console.log(PREFIX,' Fetching: ', evt.request.url, ' Mode: ', evt.request.mode)
    if(evt.request.mode == 'navigate'){
        evt.respondWith((
            async()=>{
            try{
                const preloadResp = await evt.preloadResponse
                if(preloadResp){
                    return preloadResp
                }
             return await fetch(evt.request)
        }catch(e){
            const cache = await caches.open(PREFIX)
            return await cache.match("/offline.html")
        }
    })())

}else if(CACHED_FILE.includes(evt.request.url)){
    evt.respondWith(caches.match(evt.request))
}
})