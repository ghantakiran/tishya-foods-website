import { Suspense } from 'react'
import HeroSection from '@/components/home/hero-section'
import ProductCategories from '@/components/home/product-categories'
import { Skeleton } from '@/components/loading/loading-skeleton'
import { LazyValuesSection, LazyTestimonials, LazyInstagramFeed } from '@/components/performance/lazy-component'

export default function Home() {
  return (
    <div className="pt-16 lg:pt-20 bg-gray-900 min-h-screen">
      {/* Above the fold - Load immediately */}
      <HeroSection />
      <ProductCategories />
      
      {/* Below the fold - Lazy load with suspense */}
      <Suspense fallback={<div className="py-20"><Skeleton className="h-64 w-full" /></div>}>
        <LazyValuesSection />
      </Suspense>
      
      <Suspense fallback={<div className="py-20"><Skeleton className="h-64 w-full" /></div>}>
        <LazyTestimonials />
      </Suspense>
      
      <Suspense fallback={<div className="py-20"><Skeleton className="h-64 w-full" /></div>}>
        <LazyInstagramFeed />
      </Suspense>
    </div>
  )
}
