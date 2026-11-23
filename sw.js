// sw.js — roda em segundo plano no celular: mostra a notificação de venda mesmo com o app fechado.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || '💰 Venda aprovada', {
    body: d.body || '',
    icon: '/api/icon?s=192',
    badge: '/api/icon?s=96&b=1',
    tag: d.tag || 'venda',
    renotify: true,
    vibrate: [180, 80, 180],
    data: { url: d.url || '/' },
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if ('focus' in c) return c.focus();
    return self.clients.openWindow(url);
  }));
});
