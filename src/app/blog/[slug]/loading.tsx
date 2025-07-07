import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function BlogPostLoading() {
  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Skeleton className="h-4 w-48 bg-gray-700" />
          </div>

          {/* Article Header */}
          <article className="space-y-8">
            <header className="space-y-6">
              <Skeleton className="h-12 w-full bg-gray-700" />
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 bg-gray-700 rounded-full" />
                  <Skeleton className="h-4 w-24 bg-gray-700" />
                </div>
                <Skeleton className="h-4 w-20 bg-gray-700" />
                <Skeleton className="h-4 w-16 bg-gray-700" />
              </div>

              {/* Tags */}
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 bg-gray-700 rounded-full" />
                ))}
              </div>

              {/* Featured Image */}
              <Skeleton className="h-64 md:h-96 w-full bg-gray-700 rounded-lg" />
            </header>

            {/* Article Content */}
            <div className="prose prose-invert max-w-none space-y-6">
              {/* Paragraphs */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 bg-gray-700" />
                </div>
              ))}

              {/* Section Heading */}
              <Skeleton className="h-8 w-2/3 bg-gray-700" />
              
              {/* More Paragraphs */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-2/3 bg-gray-700" />
                </div>
              ))}

              {/* Quote Block */}
              <Card className="bg-gray-800/50 border-l-4 border-green-500">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 bg-gray-700" />
                </CardContent>
              </Card>

              {/* Final Paragraphs */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700" />
                </div>
              ))}
            </div>

            {/* Share Buttons */}
            <div className="border-t border-gray-700 pt-8">
              <Skeleton className="h-6 w-32 mb-4 bg-gray-700" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 bg-gray-700 rounded" />
                ))}
              </div>
            </div>

            {/* Related Posts */}
            <div className="border-t border-gray-700 pt-8">
              <Skeleton className="h-6 w-32 mb-6 bg-gray-700" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i} className="bg-gray-800 border-gray-700">
                    <Skeleton className="h-32 w-full bg-gray-700" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-5 w-full bg-gray-700" />
                      <Skeleton className="h-4 w-3/4 bg-gray-700" />
                      <Skeleton className="h-3 w-20 bg-gray-700" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}