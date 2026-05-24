// FillFormEZ Service Worker — app shell caching only.
//
// Safety rules:
//   - PDF files are NEVER cached (they are generated on-demand per session).
//   - No form answers or personal data pass through this cache.
//   - localStorage is inaccessible to service workers by design.
//   - Only the app shell (HTML, JS, CSS, SVG assets) is cached.

const CACHE_NAME = 'fillformeez-shell-v1'

// ── Install: cache the app entry point ───────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(['/', '/index.html']))
  )
  // Activate immediately without waiting for old tabs to close
  self.skipWaiting()
})

// ── Activate: remove stale caches from previous versions ─────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// ── Fetch: selective caching strategy ────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 1. Never intercept cross-origin requests
  if (url.origin !== self.location.origin) return

  // 2. Never cache or intercept PDF files — they are generated per session
  if (url.pathname.endsWith('.pdf')) return

  // 3. Navigation requests (HTML pages): network first, fall back to cached shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/index.html').then((cached) => cached ?? caches.match('/'))
      )
    )
    return
  }

  // 4. Static assets (JS, CSS, SVG, images): cache first, populate cache on miss
  const isStaticAsset =
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.webmanifest')

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          // Only cache valid successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return response
        })
      })
    )
    return
  }

  // 5. Everything else (API calls, etc.): network only — no caching
})
