self.addEventListener('install', event => {
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', event => {
  // Puedes interceptar peticiones aquí si querés
});
