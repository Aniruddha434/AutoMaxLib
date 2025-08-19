// Service Worker for AutoMaxLib
const CACHE_NAME = 'automaxlib-v1'
const STATIC_CACHE = 'automaxlib-static-v1'
const DYNAMIC_CACHE = 'automaxlib-dynamic-v1'

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/logo.svg',
  '/og-image.svg'
]

// Static assets to cache
const STATIC_ASSETS = [
  '/images/Frameweb.png',
  '/images/Framemobile.png',
  '/placeholder.svg'
]

// Install event - cache critical resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching critical resources...')
        return cache.addAll(CRITICAL_RESOURCES)
      }),
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('Caching static assets...')
        return cache.addAll(STATIC_ASSETS.filter(asset => asset))
      })
    ]).then(() => {
      console.log('Service Worker installed successfully')
      return self.skipWaiting()
    }).catch(error => {
      console.error('Service Worker installation failed:', error)
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service Worker activated')
      return self.clients.claim()
    })
  )
})

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests (except for critical CDNs)
  if (url.origin !== location.origin && !isCriticalCDN(url.origin)) {
    return
  }

  // Handle different types of requests
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request))
  } else if (isAPIRequest(request.url)) {
    event.respondWith(networkFirst(request))
  } else {
    event.respondWith(staleWhileRevalidate(request))
  }
})

// Cache strategies
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('Cache first strategy failed:', error)
    return new Response('Offline', { status: 503 })
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    const cachedResponse = await caches.match(request)
    return cachedResponse || new Response('Offline', { status: 503 })
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)

  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(() => cachedResponse)

  return cachedResponse || fetchPromise
}

// Helper functions
function isStaticAsset(url) {
  return /\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/i.test(url)
}

function isAPIRequest(url) {
  return url.includes('/api/') || url.includes('api.')
}

function isCriticalCDN(origin) {
  const criticalCDNs = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://api.clerk.dev'
  ]
  return criticalCDNs.includes(origin)
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle offline actions when back online
  console.log('Background sync triggered')
}

// Push notifications (if needed in future)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      data: data.data
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  )
})

// Error handling
self.addEventListener('error', event => {
  console.error('Service Worker error:', event.error)
})

self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker unhandled rejection:', event.reason)
})
