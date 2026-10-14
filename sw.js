// Service Worker — إشعارات رحلاتي (Web Push)
// ضعه في نفس المجلد الذي فيه ملف التطبيق (index.html)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; }
  catch (e) { d = { body: event.data ? event.data.text() : '' }; }
  const title = d.title || 'رحلاتي';
  event.waitUntil(self.registration.showNotification(title, {
    body: d.body || '',
    dir: 'rtl',
    lang: 'ar',
    tag: d.tag || 'trip-alert',
    renotify: true,
    vibrate: [120, 60, 120],
    data: { url: d.url || './' }
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if (c.url === url && 'focus' in c) return c.focus();
    }
    return self.clients.openWindow(url);
  })());
});
