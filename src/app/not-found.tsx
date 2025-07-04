import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-earth-900">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-cream-100 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-earth-700 mb-4">Page Not Found</h2>
          <p className="text-earth-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">
              Return Home
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="w-full">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}