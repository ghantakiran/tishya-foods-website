import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function ProfileLoading() {
  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2 bg-gray-700" />
          <Skeleton className="h-6 w-96 bg-gray-700" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <Skeleton className="h-24 w-24 mx-auto mb-4 bg-gray-700 rounded-full" />
              <Skeleton className="h-6 w-32 mx-auto mb-2 bg-gray-700" />
              <Skeleton className="h-4 w-24 mx-auto bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <Skeleton className="h-6 w-12 mx-auto mb-1 bg-gray-700" />
                  <Skeleton className="h-4 w-16 mx-auto bg-gray-700" />
                </div>
                <div>
                  <Skeleton className="h-6 w-12 mx-auto mb-1 bg-gray-700" />
                  <Skeleton className="h-4 w-16 mx-auto bg-gray-700" />
                </div>
              </div>
              <Skeleton className="h-10 w-full bg-gray-700 rounded" />
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-gray-700" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20 bg-gray-700" />
                      <Skeleton className="h-10 w-full bg-gray-700 rounded" />
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Skeleton className="h-10 w-32 bg-gray-700 rounded" />
                </div>
              </CardContent>
            </Card>

            {/* Order History */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <Skeleton className="h-5 w-32 mb-1 bg-gray-700" />
                        <Skeleton className="h-4 w-24 bg-gray-700" />
                      </div>
                      <Skeleton className="h-6 w-20 bg-gray-700 rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full bg-gray-700" />
                      <Skeleton className="h-4 w-3/4 bg-gray-700" />
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <Skeleton className="h-4 w-16 bg-gray-700" />
                      <Skeleton className="h-8 w-24 bg-gray-700 rounded" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-48 bg-gray-700" />
                    <Skeleton className="h-6 w-12 bg-gray-700 rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}