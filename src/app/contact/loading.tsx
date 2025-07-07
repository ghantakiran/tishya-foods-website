import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function ContactLoading() {
  return (
    <div className="pt-20 min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4 bg-gray-700" />
          <Skeleton className="h-6 w-96 mx-auto bg-gray-700" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Skeleton className="h-6 w-32 bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 bg-gray-700" />
                  <Skeleton className="h-10 w-full bg-gray-700 rounded" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 bg-gray-700" />
                  <Skeleton className="h-10 w-full bg-gray-700 rounded" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-12 bg-gray-700" />
                <Skeleton className="h-10 w-full bg-gray-700 rounded" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 bg-gray-700" />
                <Skeleton className="h-10 w-full bg-gray-700 rounded" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 bg-gray-700" />
                <Skeleton className="h-32 w-full bg-gray-700 rounded" />
              </div>

              <Skeleton className="h-10 w-32 bg-gray-700 rounded" />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-5 w-5 bg-gray-700 rounded" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24 bg-gray-700" />
                      <Skeleton className="h-4 w-36 bg-gray-700" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-gray-700" />
                    <Skeleton className="h-4 w-24 bg-gray-700" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10 bg-gray-700 rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="bg-gray-800 border-gray-700 mt-12">
          <CardHeader className="text-center">
            <Skeleton className="h-6 w-64 mx-auto bg-gray-700" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border border-gray-700 rounded-lg p-4">
                <Skeleton className="h-5 w-full mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-3/4 bg-gray-700" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}