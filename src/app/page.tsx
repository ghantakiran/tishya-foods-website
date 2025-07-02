import HeroSection from '@/components/home/hero-section'
import ProductCategories from '@/components/home/product-categories'
import ValuesSection from '@/components/home/values-section'
import Testimonials from '@/components/home/testimonials'
import InstagramFeed from '@/components/social/instagram-feed'

export default function Home() {
  return (
    <div className="pt-16 lg:pt-20">
      <HeroSection />
      <ProductCategories />
      <ValuesSection />
      <Testimonials />
      <InstagramFeed />
    </div>
  )
}
