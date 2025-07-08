// Service Worker for Tishya Foods website
const CACHE_NAME = 'tishya-foods-v1'
const STATIC_CACHE_NAME = 'tishya-foods-static-v1'
const DYNAMIC_CACHE_NAME = 'tishya-foods-dynamic-v1'
const IMAGE_CACHE_NAME = 'tishya-foods-images-v1'

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/products',
  '/nutrition',
  '/about',
  '/contact',
  '/offline',
  '/_next/static/css/',
  '/_next/static/js/',
  '/favicon.ico',
  '/manifest.json'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS.filter(url => url !== '/_next/static/css/' && url !== '/_next/static/js/'))
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE_NAME &&
            cacheName !== DYNAMIC_CACHE_NAME &&
            cacheName !== IMAGE_CACHE_NAME
          ) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and chrome-extension URLs
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return
  }

  // Handle different types of requests with different strategies
  if (url.pathname.startsWith('/images/') || request.destination === 'image') {
    // Images: Cache First strategy
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE_NAME))
  } else if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.includes('.js') ||
    url.pathname.includes('.css') ||
    url.pathname.includes('.woff') ||
    url.pathname.includes('.woff2')
  ) {
    // Static assets: Cache First strategy
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME))
  } else if (
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/api/')
  ) {
    // API calls: Network First strategy
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME))
  } else {
    // Pages: Stale While Revalidate strategy
    event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE_NAME))
  }
})

// Cache First Strategy - good for static assets
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Cache First strategy failed:', error)
    
    // Return offline fallback for images
    if (request.destination === 'image') {
      return new Response(
        `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#f3f4f6"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">
            Image unavailable
          </text>
        </svg>`,
        { headers: { 'Content-Type': 'image/svg+xml' } }
      )
    }
    
    throw error
  }
}

// Network First Strategy - good for API calls
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Network request failed, trying cache:', error)
    
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    throw error
  }
}

// Stale While Revalidate Strategy - good for pages
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  }).catch(() => {
    // If network fails and we have no cache, return offline page
    if (!cachedResponse) {
      return caches.match('/offline') || new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Offline - Tishya Foods</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #111827; color: #f3f4f6; }
              .icon { font-size: 48px; margin-bottom: 20px; }
              h1 { color: #ffffff; }
              p { color: #9ca3af; }
              a { color: #60a5fa; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="icon">📱</div>
            <h1>You're Offline</h1>
            <p>Please check your internet connection and try again.</p>
            <a href="/">Go to Homepage</a>
          </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
          }
        }
      )
    }
    return null
  })
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse
  }
  
  // Wait for network if no cache
  return fetchPromise
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCartData())
  } else if (event.tag === 'order-sync') {
    event.waitUntil(syncOrderData())
  }
})

// Sync cart data when back online
async function syncCartData() {
  try {
    // Get pending cart actions from IndexedDB
    const pendingActions = await getPendingCartActions()
    
    for (const action of pendingActions) {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action)
      })
    }
    
    // Clear pending actions
    await clearPendingCartActions()
    console.log('Cart data synced successfully')
  } catch (error) {
    console.error('Failed to sync cart data:', error)
  }
}

// Sync order data when back online
async function syncOrderData() {
  try {
    // Get pending orders from IndexedDB
    const pendingOrders = await getPendingOrders()
    
    for (const order of pendingOrders) {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })
    }
    
    // Clear pending orders
    await clearPendingOrders()
    console.log('Order data synced successfully')
  } catch (error) {
    console.error('Failed to sync order data:', error)
  }
}

// IndexedDB helpers (simplified for demo)
async function getPendingCartActions() {
  // Implementation would use IndexedDB to get pending actions
  return []
}

async function clearPendingCartActions() {
  // Implementation would clear pending actions from IndexedDB
}

async function getPendingOrders() {
  // Implementation would use IndexedDB to get pending orders
  return []
}

async function clearPendingOrders() {
  // Implementation would clear pending orders from IndexedDB
}

// Push notifications for order updates
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  const options = {
    body: event.data ? event.data.text() : 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    actions: [
      {
        action: 'view',
        title: 'View Order',
        icon: '/icons/view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss.png'
      }
    ],
    data: {
      url: '/orders'
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('Tishya Foods', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    )
  }
})

// Periodic background sync for cache cleanup
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupOldCaches())
  }
})

// Clean up old cached items
async function cleanupOldCaches() {
  const MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days
  const now = Date.now()
  
  const cacheNames = await caches.keys()
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const requests = await cache.keys()
    
    for (const request of requests) {
      const response = await cache.match(request)
      const dateHeader = response?.headers.get('date')
      
      if (dateHeader) {
        const cacheDate = new Date(dateHeader).getTime()
        if (now - cacheDate > MAX_AGE) {
          await cache.delete(request)
          console.log('Deleted old cache entry:', request.url)
        }
      }
    }
  }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data.type === 'GET_OFFLINE_DATA') {
    // Send offline data back to main thread
    getOfflineStats().then(stats => {
      event.ports[0]?.postMessage({
        type: 'OFFLINE_DATA',
        data: stats.data,
        lastSync: stats.lastSync
      })
    })
  }
  
  if (event.data.type === 'SYNC_REQUEST') {
    // Trigger background sync
    event.waitUntil(performBackgroundSync())
  }
})

// Get offline statistics
async function getOfflineStats() {
  try {
    // Simplified stats for service worker context
    return {
      data: {
        cartItems: await getStoredCount('cart'),
        favorites: await getStoredCount('favorites'),
        recentProducts: await getStoredCount('products')
      },
      lastSync: await getLastSyncTime()
    }
  } catch (error) {
    console.error('Error getting offline stats:', error)
    return {
      data: { cartItems: 0, favorites: 0, recentProducts: 0 },
      lastSync: null
    }
  }
}

// Helper to get stored item count
async function getStoredCount(storeName) {
  try {
    // In a real implementation, this would open IndexedDB
    // For now, return mock data
    return Math.floor(Math.random() * 10)
  } catch {
    return 0
  }
}

// Helper to get last sync time
async function getLastSyncTime() {
  try {
    // In a real implementation, this would read from IndexedDB
    return localStorage.getItem('lastSync') || null
  } catch {
    return null
  }
}

// Perform background sync
async function performBackgroundSync() {
  try {
    console.log('Performing background sync...')
    
    // Sync cart data
    await syncCartData()
    
    // Sync order data  
    await syncOrderData()
    
    // Update last sync time
    localStorage.setItem('lastSync', new Date().toISOString())
    
    console.log('Background sync completed')
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}