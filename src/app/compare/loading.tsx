import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function CompareLoading() {
  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-64 mx-auto mb-4 bg-gray-700" />
          <Skeleton className="h-6 w-96 mx-auto bg-gray-700" />
        </div>

        {/* Product Selection */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <Skeleton className="h-6 w-48 bg-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <Skeleton className="h-16 w-16 mx-auto mb-4 bg-gray-700 rounded-full" />
                  <Skeleton className="h-4 w-32 mx-auto bg-gray-700" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <Skeleton className="h-6 w-48 bg-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Header Row */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <Skeleton className="h-8 bg-gray-700" />
                  <Skeleton className="h-8 bg-gray-700" />
                  <Skeleton className="h-8 bg-gray-700" />
                  <Skeleton className="h-8 bg-gray-700" />
                </div>
                {/* Data Rows */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 mb-3">
                    <Skeleton className="h-6 bg-gray-700" />
                    <Skeleton className="h-6 bg-gray-700" />
                    <Skeleton className="h-6 bg-gray-700" />
                    <Skeleton className="h-6 bg-gray-700" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}