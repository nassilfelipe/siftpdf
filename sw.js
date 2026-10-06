const CACHE_NAME = 'simulador-pwa-v1';

// Recursos necessários para a app funcionar offline
const ASSETS_TO_CACHE = [
'./',
'./index.html',
'./manifest.json',
// Cache das bibliotecas externas
'https://cdn.tailwindcss.com',
'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];

// Instalação: guarda os ficheiros na cache
self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => {
console.log('A fazer cache dos recursos...');
return cache.addAll(ASSETS_TO_CACHE);
})
.then(() => self.skipWaiting())
);
});

// Ativação: limpa caches antigas se a versão (CACHE_NAME) mudar
self.addEventListener('activate', event => {
event.waitUntil(
caches.keys().then(cacheNames => {
return Promise.all(
cacheNames.map(cache => {
if (cache !== CACHE_NAME) {
console.log('A apagar cache antiga:', cache);
return caches.delete(cache);
}
})
);
})
);
self.clients.claim();
});

// Interceção de pedidos (Estratégia: Cache First, Fallback to Network)
self.addEventListener('fetch', event => {
event.respondWith(
caches.match(event.request)
.then(cachedResponse => {
// Retorna a versão em cache, se existir
if (cachedResponse) {
return cachedResponse;
}
// Se não estiver na cache, faz o pedido à rede
return fetch(event.request).then(networkResponse => {
return networkResponse;
}).catch(erro => {
console.log('Falha na rede e recurso não encontrado na cache.', erro);
});
})
);
});