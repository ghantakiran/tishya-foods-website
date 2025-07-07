import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function WishlistLoading() {
  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-10 w-64 mb-2 bg-gray-700" />
            <Skeleton className="h-4 w-32 bg-gray-700" />
          </div>
          <Skeleton className="h-10 w-24 bg-gray-700" />
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <div className="relative">
                {/* Product Image */}
                <Skeleton className="aspect-square w-full bg-gray-700 rounded-t-lg" />
                
                {/* Product Info */}
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 bg-gray-700" />
                  
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20 bg-gray-700" />
                    <Skeleton className="h-5 w-16 bg-gray-700 rounded-full" />
                  </div>
                  
                  {/* Tags */}
                  <div className="flex gap-1">
                    <Skeleton className="h-5 w-12 bg-gray-700 rounded-full" />
                    <Skeleton className="h-5 w-16 bg-gray-700 rounded-full" />
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 bg-gray-700 rounded" />
                    <Skeleton className="h-10 w-12 bg-gray-700 rounded" />
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Skeleton className="h-10 w-40 mx-auto bg-gray-700" />
        </div>
      </div>
    </div>
  )
}