import { Suspense } from 'react'
import HeroSection from '@/components/home/hero-section'
import ProductCategories from '@/components/home/product-categories'
import { Skeleton } from '@/components/loading/loading-skeleton'
import { LazyValuesSection, LazyTestimonials, LazyInstagramFeed } from '@/components/performance/lazy-component'
import { TrustSignals, SocialProofNumbers, CustomerTestimonials } from '@/components/trust/trust-signals'

export default function Home() {
  return (
    <div className="pt-16 lg:pt-20 bg-gray-900 min-h-screen">
      {/* Above the fold - Load immediately */}
      <HeroSection />
      <ProductCategories />
      
      {/* Trust signals - Load immediately for credibility */}
      <TrustSignals />
      
      {/* Social proof numbers */}
      <SocialProofNumbers />
      
      {/* Below the fold - Lazy load with suspense */}
      <Suspense fallback={<div className="py-20"><Skeleton className="h-64 w-full" /></div>}>
        <LazyValuesSection />
      </Suspense>
      
      {/* Customer testimonials - enhanced version */}
      <CustomerTestimonials />
      
      <Suspense fallback={<div className="py-20"><Skeleton className="h-64 w-full" /></div>}>
        <LazyInstagramFeed />
      </Suspense>
    </div>
  )
}
