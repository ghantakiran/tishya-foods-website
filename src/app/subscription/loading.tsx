import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function SubscriptionLoading() {
  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-96 mx-auto mb-4 bg-gray-700" />
          <Skeleton className="h-6 w-[600px] mx-auto bg-gray-700" />
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className={`bg-gray-800 border-gray-700 relative ${i === 1 ? 'ring-2 ring-green-500' : ''}`}>
              {i === 1 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Skeleton className="h-6 w-24 bg-green-500 rounded-full" />
                </div>
              )}
              <CardHeader className="text-center">
                <Skeleton className="h-8 w-32 mx-auto mb-2 bg-gray-700" />
                <Skeleton className="h-12 w-24 mx-auto mb-4 bg-gray-700" />
                <Skeleton className="h-4 w-48 mx-auto bg-gray-700" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 bg-gray-700 rounded-full" />
                      <Skeleton className="h-4 flex-1 bg-gray-700" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full bg-gray-700 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="bg-gray-800 border-gray-700 mb-12">
          <CardHeader className="text-center">
            <Skeleton className="h-8 w-48 mx-auto bg-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-16 w-16 mx-auto mb-4 bg-gray-700 rounded-full" />
                  <Skeleton className="h-6 w-24 mx-auto mb-2 bg-gray-700" />
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 mx-auto bg-gray-700" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <Skeleton className="h-8 w-64 mx-auto bg-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Skeleton className="h-12 w-12 bg-gray-600 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1 bg-gray-600" />
                      <Skeleton className="h-3 w-20 bg-gray-600" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2 bg-gray-600" />
                  <Skeleton className="h-4 w-full mb-2 bg-gray-600" />
                  <Skeleton className="h-4 w-3/4 bg-gray-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}