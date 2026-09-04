// Notice Me — service worker
//
// Deliberately conservative about what it caches. The app is a single HTML file
// that changes with every release, so serving a stale copy would be worse than
// being offline. The rules below are:
//
//   the page itself   network first, cache as a fallback  (never stale online)
//   icons, manifest   cache first                         (they rarely change)
//   the Firebase SDK  cache first, refreshed in background (pinned by version)
//   everything else   left completely alone               (Firestore, Auth)
//
// Firestore keeps its own offline cache, so data is not this worker's job.

const CACHE = 'noticeme-shell-v1';
const SHELL = ['./', './manifest.json', './icon-192.png', './icon-512.png',
               './icon-maskable-512.png', './apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // addAll fails the whole install if any single file 404s, which would
      // leave no worker at all. Failures here are not worth that.
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

const isFirebaseSdk = (url) =>
  url.origin === 'https://www.gstatic.com' && url.pathname.includes('/firebasejs/');

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never touch data traffic — Firestore and Auth manage their own caching and
  // must always see the live network.
  if (url.hostname.includes('firestore.googleapis.com') ||
      url.hostname.includes('identitytoolkit.googleapis.com') ||
      url.hostname.includes('googleapis.com')) {
    return;
  }

  // The page itself: always try the network so a new release lands immediately.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./').then((hit) => hit || caches.match(req)))
    );
    return;
  }

  // The Firebase SDK is version-pinned in the URL, so a cached copy is always
  // the right copy. Refreshed quietly in the background.
  if (isFirebaseSdk(url)) {
    event.respondWith(
      caches.match(req).then((hit) => {
        const live = fetch(req).then((res) => {
          if (res && res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone())).catch(() => {});
          return res;
        }).catch(() => hit);
        return hit || live;
      })
    );
    return;
  }

  // Our own icons and manifest.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }))
    );
  }
});
