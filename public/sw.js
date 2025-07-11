// Service Worker for Performance Optimization
// Tishya Foods Website - Advanced Caching Strategy

const CACHE_NAME = 'tishya-foods-v2'
const STATIC_CACHE = `${CACHE_NAME}-static`
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`
const IMAGE_CACHE = `${CACHE_NAME}-images`
const API_CACHE = `${CACHE_NAME}-api`

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
}

// Resource patterns and their caching strategies
const CACHE_PATTERNS = [
  // Static assets - Cache First (long-term caching)
  {
    pattern: /\/_next\/static\/.*/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    maxEntries: 100
  },
  
  // Images - Stale While Revalidate
  {
    pattern: /.*\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: IMAGE_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 200
  },
  
  // Fonts - Cache First
  {
    pattern: /.*\.(woff|woff2|ttf|eot)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    maxEntries: 20
  },
  
  // API routes - Network First with short cache
  {
    pattern: /\/api\/.*/,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: API_CACHE,
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 50
  },
  
  // Product data - Stale While Revalidate
  {
    pattern: /\/products\/.*/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: DYNAMIC_CACHE,
    maxAge: 60 * 60 * 1000, // 1 hour
    maxEntries: 100
  }
]

// Essential resources to cache immediately
const PRECACHE_URLS = [
  '/',
  '/products',
  '/about',
  '/contact',
  '/nutrition',
  '/recipes',
  '/manifest.json',
  '/offline.html'
]

// Install event - Cache essential resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    Promise.all([
      // Cache essential pages
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(PRECACHE_URLS)
      })
    ]).then(() => {
      console.log('[SW] Installation complete')
      return self.skipWaiting()
    })
  )
})

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (!cacheName.startsWith(CACHE_NAME)) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('[SW] Activation complete')
      return self.clients.claim()
    })
  )
})

// Fetch event - Handle all network requests
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests and external URLs (except allowed domains)
  if (request.method !== 'GET' || !shouldHandleRequest(url)) {
    return
  }
  
  // Find matching cache pattern
  const cachePattern = CACHE_PATTERNS.find(pattern => 
    pattern.pattern.test(request.url)
  )
  
  if (cachePattern) {
    event.respondWith(handleRequest(request, cachePattern))
  } else {
    // Default strategy for unmatched requests
    event.respondWith(
      handleRequest(request, {
        strategy: CACHE_STRATEGIES.NETWORK_FIRST,
        cache: DYNAMIC_CACHE,
        maxAge: 60 * 60 * 1000, // 1 hour
        maxEntries: 50
      })
    )
  }
})

// Request handler based on caching strategy
async function handleRequest(request, cacheConfig) {
  const { strategy, cache: cacheName, maxAge, maxEntries } = cacheConfig
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cacheName, maxAge, maxEntries)
      
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cacheName, maxAge, maxEntries)
      
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cacheName, maxAge, maxEntries)
      
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request)
      
    case CACHE_STRATEGIES.CACHE_ONLY:
      return caches.match(request)
      
    default:
      return networkFirst(request, cacheName, maxAge, maxEntries)
  }
}

// Cache First strategy
async function cacheFirst(request, cacheName, maxAge, maxEntries) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      await cleanupCache(cache, maxEntries)
      const responseToCache = networkResponse.clone()
      responseToCache.headers.set('sw-cached-date', new Date().toISOString())
      await cache.put(request, responseToCache)
    }
    return networkResponse
  } catch (error) {
    // Return stale cache if network fails
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Network First strategy
async function networkFirst(request, cacheName, maxAge, maxEntries) {
  const cache = await caches.open(cacheName)
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      await cleanupCache(cache, maxEntries)
      const responseToCache = networkResponse.clone()
      responseToCache.headers.set('sw-cached-date', new Date().toISOString())
      await cache.put(request, responseToCache)
    }
    return networkResponse
  } catch (error) {
    const cachedResponse = await cache.match(request)
    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests only if there's no cached response
    if (request.mode === 'navigate') {
      // Only show offline page if we truly have no cached version
      const fallbackResponse = await caches.match('/') || await caches.match('/offline.html')
      if (fallbackResponse) {
        return fallbackResponse
      }
      return new Response('Offline', { status: 503 })
    }
    
    throw error
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request, cacheName, maxAge, maxEntries) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  // Always try to update in the background
  const networkPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      await cleanupCache(cache, maxEntries)
      const responseToCache = networkResponse.clone()
      responseToCache.headers.set('sw-cached-date', new Date().toISOString())
      await cache.put(request, responseToCache)
    }
    return networkResponse
  }).catch(() => {
    // Silent fail for background updates
  })
  
  // Return cached version immediately if available
  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    // Don't await the network promise
    networkPromise
    return cachedResponse
  }
  
  // Wait for network if no cache or expired
  return networkPromise
}

// Check if cached response is expired
function isExpired(response, maxAge) {
  if (!maxAge) return false
  
  const cachedDate = response.headers.get('sw-cached-date')
  if (!cachedDate) return true
  
  return Date.now() - new Date(cachedDate).getTime() > maxAge
}

// Clean up old cache entries
async function cleanupCache(cache, maxEntries) {
  if (!maxEntries) return
  
  const keys = await cache.keys()
  if (keys.length > maxEntries) {
    // Remove oldest entries
    const entriesToDelete = keys.length - maxEntries
    for (let i = 0; i < entriesToDelete; i++) {
      await cache.delete(keys[i])
    }
  }
}

// Determine if request should be handled by SW
function shouldHandleRequest(url) {
  // Handle same-origin requests
  if (url.origin === self.location.origin) {
    return true
  }
  
  // Handle allowed external domains
  const allowedDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'images.unsplash.com',
    'api.placeholder.com'
  ]
  
  return allowedDomains.some(domain => url.hostname === domain)
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Retry failed API requests
  const cache = await caches.open('failed-requests')
  const requests = await cache.keys()
  
  for (const request of requests) {
    try {
      await fetch(request)
      await cache.delete(request)
      console.log('[SW] Retried request successfully:', request.url)
    } catch (error) {
      console.log('[SW] Retry failed for:', request.url)
    }
  }
}

// Periodic cache cleanup
setInterval(async () => {
  const cacheNames = await caches.keys()
  
  for (const cacheName of cacheNames) {
    if (cacheName.startsWith(CACHE_NAME)) {
      const cache = await caches.open(cacheName)
      const pattern = CACHE_PATTERNS.find(p => p.cache === cacheName)
      
      if (pattern) {
        await cleanupCache(cache, pattern.maxEntries)
      }
    }
  }
}, 60 * 60 * 1000) // Every hour

// Push notification event handlers
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received')
  
  let notificationData = {
    title: 'Tishya Foods',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    tag: 'default',
    requireInteraction: false,
    actions: []
  }
  
  if (event.data) {
    try {
      const payload = event.data.json()
      notificationData = {
        ...notificationData,
        ...payload,
        actions: payload.actions || []
      }
    } catch (error) {
      console.error('[SW] Error parsing push payload:', error)
      notificationData.body = event.data.text() || notificationData.body
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      actions: notificationData.actions,
      data: notificationData.data || {},
      timestamp: Date.now(),
      silent: false,
      vibrate: [200, 100, 200]
    })
  )
})

// Notification click event handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received')
  
  event.notification.close()
  
  const notification = event.notification
  const action = event.action
  const data = notification.data || {}
  
  event.waitUntil(
    handleNotificationClick(action, data, notification)
  )
})

// Notification close event handler
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed')
  
  // Track notification dismissal
  const notification = event.notification
  const data = notification.data || {}
  
  // Send analytics if needed
  if (data.trackDismissal) {
    sendAnalyticsEvent('notification_dismissed', {
      tag: notification.tag,
      title: notification.title
    })
  }
})

// Handle notification click actions
async function handleNotificationClick(action, data, notification) {
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  
  let targetUrl = '/'
  
  // Determine target URL based on action or data
  if (action) {
    switch (action) {
      case 'view_order':
        targetUrl = `/orders/${data.orderId || ''}`
        break
      case 'view_product':
        targetUrl = `/products/${data.productId || ''}`
        break
      case 'view_cart':
        targetUrl = '/cart'
        break
      case 'track_order':
        targetUrl = `/orders/${data.orderId || ''}/track`
        break
      default:
        targetUrl = data.url || '/'
    }
  } else if (data.url) {
    targetUrl = data.url
  }
  
  // Focus existing tab or open new one
  for (const client of clients) {
    if (client.url.includes(targetUrl) && 'focus' in client) {
      return client.focus()
    }
  }
  
  // Open new tab if no existing tab found
  if (clients.openWindow) {
    return clients.openWindow(targetUrl)
  }
}

// Enhanced background sync with specific sync tags
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag)
  
  switch (event.tag) {
    case 'background-sync':
      event.waitUntil(doBackgroundSync())
      break
    case 'cart-sync':
      event.waitUntil(syncCartData())
      break
    case 'order-sync':
      event.waitUntil(syncOrderData())
      break
    case 'user-preferences-sync':
      event.waitUntil(syncUserPreferences())
      break
    case 'analytics-sync':
      event.waitUntil(syncAnalyticsData())
      break
    default:
      event.waitUntil(doBackgroundSync())
  }
})

// Sync cart data when back online
async function syncCartData() {
  try {
    const db = await openIndexedDB()
    const tx = db.transaction(['cart'], 'readonly')
    const store = tx.objectStore('cart')
    const cartData = await store.getAll()
    
    if (cartData.length > 0) {
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartData })
      })
      
      if (response.ok) {
        console.log('[SW] Cart data synced successfully')
        // Clear synced data from IndexedDB
        const clearTx = db.transaction(['cart'], 'readwrite')
        const clearStore = clearTx.objectStore('cart')
        await clearStore.clear()
      }
    }
  } catch (error) {
    console.error('[SW] Cart sync failed:', error)
  }
}

// Sync order data when back online
async function syncOrderData() {
  try {
    const db = await openIndexedDB()
    const tx = db.transaction(['orders'], 'readonly')
    const store = tx.objectStore('orders')
    const orderData = await store.getAll()
    
    for (const order of orderData) {
      if (order.status === 'pending_sync') {
        try {
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(order)
          })
          
          if (response.ok) {
            console.log('[SW] Order synced successfully:', order.id)
            // Update order status in IndexedDB
            const updateTx = db.transaction(['orders'], 'readwrite')
            const updateStore = updateTx.objectStore('orders')
            order.status = 'submitted'
            await updateStore.put(order)
          }
        } catch (error) {
          console.error('[SW] Order sync failed:', order.id, error)
        }
      }
    }
  } catch (error) {
    console.error('[SW] Order sync failed:', error)
  }
}

// Sync user preferences when back online
async function syncUserPreferences() {
  try {
    const db = await openIndexedDB()
    const tx = db.transaction(['user_preferences'], 'readonly')
    const store = tx.objectStore('user_preferences')
    const preferences = await store.getAll()
    
    if (preferences.length > 0) {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences })
      })
      
      if (response.ok) {
        console.log('[SW] User preferences synced successfully')
      }
    }
  } catch (error) {
    console.error('[SW] User preferences sync failed:', error)
  }
}

// Sync analytics data when back online
async function syncAnalyticsData() {
  try {
    const db = await openIndexedDB()
    const tx = db.transaction(['analytics'], 'readonly')
    const store = tx.objectStore('analytics')
    const analyticsData = await store.getAll()
    
    if (analyticsData.length > 0) {
      const response = await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: analyticsData })
      })
      
      if (response.ok) {
        console.log('[SW] Analytics data synced successfully')
        // Clear synced data from IndexedDB
        const clearTx = db.transaction(['analytics'], 'readwrite')
        const clearStore = clearTx.objectStore('analytics')
        await clearStore.clear()
      }
    }
  } catch (error) {
    console.error('[SW] Analytics sync failed:', error)
  }
}

// IndexedDB helper
async function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TishyaFoodsDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('cart')) {
        db.createObjectStore('cart', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('orders')) {
        db.createObjectStore('orders', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('user_preferences')) {
        db.createObjectStore('user_preferences', { keyPath: 'key' })
      }
      if (!db.objectStoreNames.contains('analytics')) {
        db.createObjectStore('analytics', { keyPath: 'id' })
      }
    }
  })
}

// Send analytics event
async function sendAnalyticsEvent(eventName, data) {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        data,
        timestamp: Date.now(),
        source: 'service-worker'
      })
    })
  } catch (error) {
    console.error('[SW] Analytics event failed:', error)
  }
}

// Message event handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_CLIENT_ID') {
    event.ports[0].postMessage({ clientId: event.source.id })
  }
})

console.log('[SW] Service worker script loaded with enhanced PWA features')