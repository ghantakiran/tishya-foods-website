import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function LoyaltyLoading() {
  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Tier Status */}
        <Card className="bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <Skeleton className="h-16 w-16 bg-gray-600 rounded-full" />
              <div>
                <Skeleton className="h-8 w-48 mb-2 bg-gray-600" />
                <Skeleton className="h-4 w-32 bg-gray-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-6 w-12 mx-auto mb-1 bg-gray-600" />
                  <Skeleton className="h-3 w-16 mx-auto bg-gray-600" />
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-4 w-32 bg-gray-600" />
              <Skeleton className="h-4 w-24 bg-gray-600" />
            </div>
            <Skeleton className="h-2 w-full bg-gray-600" />
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <div className="flex space-x-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 bg-gray-700" />
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Benefits Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <Skeleton className="h-4 w-4 bg-gray-700 rounded-full mt-0.5" />
                  <Skeleton className="h-4 flex-1 bg-gray-700" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-gray-700" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 bg-gray-700 rounded" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 bg-gray-600 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1 bg-gray-600" />
                      <Skeleton className="h-3 w-24 bg-gray-600" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-12 bg-gray-600 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}