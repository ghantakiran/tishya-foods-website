import { Skeleton } from '@/components/ui/skeleton'

export default function AboutLoading() {
  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-96 mx-auto mb-4 bg-gray-700" />
          <Skeleton className="h-6 w-[600px] mx-auto bg-gray-700" />
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48 bg-gray-700" />
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
            </div>
            <Skeleton className="h-80 w-full bg-gray-700 rounded-lg" />
          </div>

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-16 w-16 mx-auto mb-4 bg-gray-700 rounded-full" />
                <Skeleton className="h-6 w-32 mx-auto mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-3/4 mx-auto bg-gray-700" />
              </div>
            ))}
          </div>

          {/* Team Section */}
          <div className="text-center">
            <Skeleton className="h-8 w-48 mx-auto mb-8 bg-gray-700" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-48 w-full bg-gray-700 rounded-lg mb-4" />
                  <Skeleton className="h-5 w-32 mx-auto mb-1 bg-gray-700" />
                  <Skeleton className="h-4 w-24 mx-auto bg-gray-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}