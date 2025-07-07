import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function NutritionLoading() {
  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-64 mx-auto mb-4 bg-gray-700" />
          <Skeleton className="h-6 w-96 mx-auto bg-gray-700" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Summary */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-8 w-16 mx-auto mb-2 bg-gray-700" />
                      <Skeleton className="h-4 w-20 mx-auto bg-gray-700" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Progress */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-gray-700" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20 bg-gray-700" />
                      <Skeleton className="h-4 w-16 bg-gray-700" />
                    </div>
                    <Skeleton className="h-2 w-full bg-gray-700" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Meal Entries */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <Skeleton className="h-5 w-24 bg-gray-700" />
                      <Skeleton className="h-8 w-8 bg-gray-700 rounded" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full bg-gray-700" />
                      <Skeleton className="h-4 w-3/4 bg-gray-700" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Water Intake */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <Skeleton className="h-24 w-24 mx-auto bg-gray-700 rounded-full" />
                  <Skeleton className="h-4 w-20 mx-auto bg-gray-700" />
                  <div className="flex justify-center gap-2">
                    <Skeleton className="h-8 w-8 bg-gray-700 rounded" />
                    <Skeleton className="h-8 w-8 bg-gray-700 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Add */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-24 bg-gray-700" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-700 rounded">
                    <Skeleton className="h-4 w-32 bg-gray-700" />
                    <Skeleton className="h-6 w-6 bg-gray-700 rounded" />
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