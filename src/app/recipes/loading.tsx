import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function RecipesLoading() {
  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4 bg-gray-700" />
          <Skeleton className="h-6 w-96 mx-auto bg-gray-700" />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Skeleton className="h-10 flex-1 bg-gray-700" />
          <Skeleton className="h-10 w-32 bg-gray-700" />
          <Skeleton className="h-10 w-32 bg-gray-700" />
        </div>

        {/* Recipe Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <Skeleton className="h-48 w-full bg-gray-700" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-full bg-gray-700" />
                <Skeleton className="h-4 w-3/4 bg-gray-700" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20 bg-gray-700" />
                  <Skeleton className="h-4 w-16 bg-gray-700" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 bg-gray-700 rounded-full" />
                  <Skeleton className="h-6 w-20 bg-gray-700 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Skeleton className="h-10 w-32 mx-auto bg-gray-700" />
        </div>
      </div>
    </div>
  )
}