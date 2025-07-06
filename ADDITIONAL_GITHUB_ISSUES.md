# 🎫 Additional GitHub Issue Templates (Issues #5-14)

## ISSUE #5 - MEDIUM PRIORITY

**Title:** 📱 PWA Implementation incomplete - Missing service worker and offline functionality

**Labels:** `feature`, `medium`, `pwa`, `performance`, `mobile`, `offline`

**Issue Body:**
```markdown
## PWA Implementation Gaps

### Problem Description
The website references PWA features in the codebase but lacks complete Progressive Web App implementation. This prevents users from installing the app and using it offline.

### Current State
- ✅ PWA manifest.json exists in public folder
- ✅ PWAInit component referenced in layout
- ❌ Service worker not implemented
- ❌ Offline functionality missing
- ❌ App install prompts not working
- ❌ Background sync missing
- ❌ Push notifications not implemented

### Missing PWA Features

#### 1. Service Worker Implementation
**File:** `public/sw.js`
```javascript
const CACHE_NAME = 'tishya-foods-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/static/media/logo.png',
  '/products',
  '/about',
  '/contact'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})
```

#### 2. Offline Fallback Pages
- Offline product browsing
- Cached cart functionality
- Offline contact form storage
- Network status indicators

#### 3. App Install Prompts
- Custom install button
- Install banner handling
- iOS Safari install instructions

### Implementation Plan

#### Phase 1: Service Worker (Days 1-2)
- [ ] Create service worker with caching strategy
- [ ] Implement network-first for API calls
- [ ] Add cache-first for static assets
- [ ] Handle offline scenarios gracefully

#### Phase 2: Offline Functionality (Days 3-4)
- [ ] Offline page for when no cache exists
- [ ] Store form data locally when offline
- [ ] Sync data when connection restored
- [ ] Show network status to users

#### Phase 3: Install Experience (Day 5)
- [ ] Custom install prompt
- [ ] Track install events
- [ ] iOS specific install instructions
- [ ] App shortcuts for common actions

### Priority: 🟠 Medium
### Estimated Effort: 1 week
```

---

## ISSUE #6 - MEDIUM PRIORITY

**Title:** 📈 SEO optimization incomplete for Next.js App Router

**Labels:** `enhancement`, `medium`, `seo`, `metadata`, `app-router`, `sitemap`

**Issue Body:**
```markdown
## SEO Implementation Gaps

### Problem Description
While basic SEO metadata exists, the implementation is incomplete for a modern e-commerce site targeting organic search traffic.

### Current SEO Issues
- ❌ Missing page-specific metadata for products/blogs
- ❌ No dynamic sitemap generation
- ❌ Missing structured data for products
- ❌ No Open Graph images for social sharing
- ❌ Missing breadcrumb markup
- ❌ No robots.txt optimization for app router

### Required SEO Implementations

#### 1. Dynamic Metadata (`src/app/products/[id]/page.tsx`)
```typescript
import { Metadata } from 'next'
import { getProduct } from '@/lib/products'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  return {
    title: `${product.name} - Protein Rich Food | Tishya Foods`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        }
      ],
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  }
}
```

#### 2. Product Structured Data
```typescript
// components/seo/product-structured-data.tsx
export function ProductStructuredData({ product }: { product: Product }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: 'Tishya Foods'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

#### 3. Dynamic Sitemap (`src/app/sitemap.ts`)
```typescript
import { MetadataRoute } from 'next'
import { getProducts, getBlogPosts } from '@/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tishyafoods.com'
  
  // Static pages
  const staticPages = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/products`, priority: 0.9 },
    { url: `${baseUrl}/about`, priority: 0.8 },
    { url: `${baseUrl}/contact`, priority: 0.7 },
    { url: `${baseUrl}/blog`, priority: 0.8 },
  ]

  // Dynamic product pages
  const products = await getProducts()
  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: product.updatedAt,
    priority: 0.7,
  }))

  // Dynamic blog pages
  const posts = await getBlogPosts()
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...blogPages]
}
```

### Implementation Steps
- [ ] Add dynamic metadata to all routes
- [ ] Implement product structured data
- [ ] Create dynamic sitemap generation
- [ ] Add breadcrumb structured data
- [ ] Optimize robots.txt for app router
- [ ] Add social media meta tags
- [ ] Implement Open Graph images
- [ ] Add canonical URLs

### Priority: 🟠 Medium
### Estimated Effort: 1 week
```

---

## ISSUE #7 - MEDIUM PRIORITY

**Title:** ♿ Accessibility improvements needed for WCAG 2.1 AA compliance

**Labels:** `enhancement`, `medium`, `accessibility`, `a11y`, `wcag`, `compliance`

**Issue Body:**
```markdown
## Accessibility Compliance Issues

### Problem Description
The website needs accessibility improvements to meet WCAG 2.1 AA standards and provide equal access to all users.

### Accessibility Audit Results

#### ❌ Critical Issues
1. **Missing alt text** for decorative images
2. **Insufficient color contrast** in some UI elements
3. **Missing skip navigation** links (partially implemented)
4. **Keyboard navigation** issues in complex components
5. **Screen reader** incompatible elements

#### ⚠️ Moderate Issues
1. **Form labels** not properly associated
2. **Focus indicators** insufficient in dark theme
3. **ARIA attributes** missing in interactive components
4. **Semantic HTML** improvements needed

### Required Accessibility Implementations

#### 1. Color Contrast Fixes
```css
/* Update insufficient contrast ratios */
.text-gray-400 { 
  color: #a3a3a3; /* Was #9ca3af - insufficient contrast */
}

.text-gray-500 { 
  color: #8a8a8a; /* Improved contrast for gray-900 background */
}
```

#### 2. Skip Navigation Enhancement
```tsx
// Already partially implemented, needs completion
<div className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50">
  <a href="#main-content" className="bg-blue-600 text-white px-4 py-2 rounded">
    Skip to main content
  </a>
  <a href="#main-navigation" className="bg-blue-600 text-white px-4 py-2 rounded ml-2">
    Skip to navigation
  </a>
  <a href="#product-search" className="bg-blue-600 text-white px-4 py-2 rounded ml-2">
    Skip to search
  </a>
</div>
```

#### 3. Enhanced Form Accessibility
```tsx
// Example: Improved product search form
<form role="search" aria-label="Product search">
  <label htmlFor="product-search" className="sr-only">
    Search products
  </label>
  <input
    id="product-search"
    type="search"
    placeholder="Search products..."
    aria-describedby="search-help"
    aria-expanded={showSuggestions}
    aria-haspopup="listbox"
    role="combobox"
  />
  <div id="search-help" className="sr-only">
    Type to search for products. Use arrow keys to navigate suggestions.
  </div>
  
  {showSuggestions && (
    <ul role="listbox" aria-label="Search suggestions">
      {suggestions.map((suggestion, index) => (
        <li key={index} role="option" aria-selected={index === selectedIndex}>
          {suggestion}
        </li>
      ))}
    </ul>
  )}
</form>
```

#### 4. ARIA Landmarks and Regions
```tsx
// Enhanced page structure
<body>
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      {/* Navigation content */}
    </nav>
  </header>
  
  <main role="main" id="main-content">
    <section aria-labelledby="products-heading">
      <h1 id="products-heading">Our Products</h1>
      {/* Products content */}
    </section>
  </main>
  
  <aside role="complementary" aria-label="Product filters">
    {/* Sidebar filters */}
  </aside>
  
  <footer role="contentinfo">
    {/* Footer content */}
  </footer>
</body>
```

### Keyboard Navigation Improvements

#### Product Cards Enhancement
```tsx
<div 
  className="product-card"
  tabIndex={0}
  role="article"
  aria-labelledby={`product-${product.id}-name`}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleProductSelect(product)
    }
  }}
>
  <h3 id={`product-${product.id}-name`}>{product.name}</h3>
  <button
    className="add-to-cart-btn"
    aria-describedby={`product-${product.id}-description`}
  >
    Add to Cart
  </button>
</div>
```

### Screen Reader Optimizations

#### Live Regions for Dynamic Content
```tsx
// Cart updates
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {cartMessage}
</div>

// Search results
<div aria-live="polite" aria-atomic="false">
  {searchResults.length} products found
</div>

// Loading states
<div aria-live="polite" className="sr-only">
  {isLoading ? 'Loading products...' : 'Products loaded'}
</div>
```

### Implementation Checklist

#### Critical Fixes (Week 1)
- [ ] Fix color contrast ratios
- [ ] Add missing alt text for all images
- [ ] Enhance skip navigation links
- [ ] Fix form label associations
- [ ] Add focus indicators

#### Moderate Improvements (Week 2)
- [ ] Add ARIA landmarks to all pages
- [ ] Enhance keyboard navigation
- [ ] Add ARIA attributes to interactive components
- [ ] Implement live regions for dynamic content
- [ ] Add descriptive text for screen readers

#### Testing and Validation
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)
- [ ] Keyboard-only navigation testing
- [ ] Color contrast validation with tools
- [ ] Automated accessibility testing (axe-core)
- [ ] User testing with accessibility users

### Accessibility Testing Tools
```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/react
npm install --save-dev jest-axe
```

### Priority: 🟠 Medium
### Estimated Effort: 2 weeks
### Compliance Target: WCAG 2.1 AA
```

---

## ISSUE #8 - MEDIUM PRIORITY

**Title:** 📱 Mobile experience optimization and touch interactions

**Labels:** `enhancement`, `medium`, `mobile`, `responsive`, `touch`, `ux`

**Issue Body:**
```markdown
## Mobile Experience Optimization

### Problem Description
While the website is responsive, the mobile experience needs optimization for better touch interactions and mobile-specific features.

### Current Mobile Issues
- ⚠️ Touch targets too small in some areas (< 44px)
- ❌ No swipe gestures for product galleries
- ❌ Mobile-specific loading states missing
- ❌ Poor thumb-zone optimization
- ❌ Missing pull-to-refresh functionality
- ❌ No haptic feedback for interactions

### Touch Target Improvements

#### Minimum Touch Target Sizes
```css
/* Ensure all interactive elements meet 44px minimum */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* Mobile-specific button sizing */
@media (max-width: 768px) {
  .btn-mobile {
    min-height: 48px;
    padding: 14px 20px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
```

#### Header Navigation Mobile Optimization
```tsx
// Mobile-optimized header with better touch targets
<header className="mobile-header md:hidden">
  <button
    className="hamburger-btn w-12 h-12 flex items-center justify-center"
    aria-label="Open navigation menu"
    aria-expanded={isMenuOpen}
  >
    <Menu className="w-6 h-6" />
  </button>
  
  {/* Mobile menu with thumb-zone optimization */}
  <nav className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
    <ul className="menu-items space-y-4 p-6">
      {menuItems.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            className="block py-4 px-6 text-lg touch-target"
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
</header>
```

### Swipe Gestures Implementation

#### Product Image Gallery with Swipe
```tsx
import { useState, useRef } from 'react'
import { useSwipeable } from 'react-swipeable'

export function MobileProductGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex(prev => 
      prev < images.length - 1 ? prev + 1 : prev
    ),
    onSwipedRight: () => setCurrentIndex(prev => 
      prev > 0 ? prev - 1 : prev
    ),
    trackMouse: true,
  })

  return (
    <div {...handlers} className="relative overflow-hidden">
      <div 
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Product image ${index + 1}`}
            className="w-full h-64 object-cover flex-shrink-0"
          />
        ))}
      </div>
      
      {/* Swipe indicators */}
      <div className="flex justify-center space-x-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
```

### Mobile-Specific Components

#### Pull-to-Refresh for Product Lists
```tsx
import { useState, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'

export function MobileProductList() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refreshProducts()
      // Add haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(100)
      }
    } finally {
      setIsRefreshing(false)
      setPullDistance(0)
    }
  }, [])

  return (
    <div className="mobile-product-list">
      {/* Pull-to-refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="pull-indicator flex justify-center py-4"
          style={{ transform: `translateY(${Math.min(pullDistance, 80)}px)` }}
        >
          <RefreshCw 
            className={`w-6 h-6 text-blue-500 ${
              isRefreshing ? 'animate-spin' : ''
            }`} 
          />
        </div>
      )}
      
      {/* Product grid optimized for mobile */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {products.map((product) => (
          <MobileProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

#### Mobile-Optimized Product Cards
```tsx
function MobileProductCard({ product }: { product: Product }) {
  return (
    <div className="mobile-product-card bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Quick add button - optimized for thumb reach */}
        <button
          className="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center touch-target"
          onClick={() => addToCart(product)}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-blue-600">
          ₹{product.price}
        </p>
      </div>
    </div>
  )
}
```

### Mobile Navigation Improvements

#### Bottom Navigation Bar
```tsx
export function MobileBottomNav() {
  const { pathname } = useRouter()
  
  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/products', icon: Grid, label: 'Products' },
    { href: '/cart', icon: ShoppingCart, label: 'Cart' },
    { href: '/account', icon: User, label: 'Account' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center py-2 px-1 touch-target ${
              pathname === item.href ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
```

### Performance Optimizations for Mobile

#### Image Lazy Loading with Intersection Observer
```tsx
export function LazyImage({ src, alt, className }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}
```

### Implementation Steps
- [ ] Audit and fix touch target sizes
- [ ] Implement swipe gestures for galleries
- [ ] Add mobile-specific loading states
- [ ] Create bottom navigation for mobile
- [ ] Optimize thumb-zone interactions
- [ ] Add pull-to-refresh functionality
- [ ] Implement haptic feedback where appropriate
- [ ] Test on various mobile devices

### Mobile Testing Checklist
- [ ] iPhone SE (smallest modern screen)
- [ ] iPhone 14 Pro Max (largest iPhone)
- [ ] Samsung Galaxy S23 (Android)
- [ ] iPad (tablet experience)
- [ ] Landscape orientation testing
- [ ] One-handed usage testing
- [ ] Touch accuracy testing

### Priority: 🟠 Medium
### Estimated Effort: 1 week
### Dependencies: react-swipeable package
```

I'll continue creating the remaining issue templates (Issues #9-14) to complete the comprehensive GitHub issues analysis. Each template provides detailed implementation guidance, code examples, and clear acceptance criteria for immediate actionable development.

Would you like me to:
1. Continue with the remaining issue templates (#9-14)?
2. Focus on a specific high-priority issue for immediate implementation?
3. Create a summary document for quick GitHub issue creation?