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
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response('Offline', { status: 503 })
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

console.log('[SW] Service worker script loaded')