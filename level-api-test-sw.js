self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (!['api.1games.io','api2.1games.io'].includes(u.hostname) || !u.pathname.startsWith('/level/')) return;
  const proxy = new URL('/dash-api' + u.pathname + u.search, self.location.origin);
  e.respondWith((async () => {
    try {
      const headers = new Headers(e.request.headers);
      headers.delete('host'); headers.delete('origin');
      const res = await fetch(proxy, {method:e.request.method, headers, body: ['GET','HEAD'].includes(e.request.method) ? undefined : await e.request.clone().arrayBuffer(), redirect:'follow', credentials:'omit'});
      console.log('[Dashmetry proxy]', u.pathname, res.status);
      return res;
    } catch (err) { console.error('[Dashmetry proxy]', err); return Response.error(); }
  })());
});
