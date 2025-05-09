import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function BundleDetailLoading() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <Skeleton className="aspect-[4/3] w-full rounded-lg mb-4" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} className="aspect-square w-full rounded-md" />
                ))}
              </div>
            </div>

            <div className="md:w-1/3">
              <Skeleton className="h-6 w-20 mb-3" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>

              <Skeleton className="h-8 w-1/2 mb-1" />
              <Skeleton className="h-4 w-1/3 mb-4" />

              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />

              <div className="flex gap-2 mb-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>

              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-10 w-full mb-6" />

              <div className="flex gap-2 mb-6">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          </div>

          <Skeleton className="h-10 w-full mt-8 mb-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <Skeleton className="aspect-[3/4] w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />

              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex gap-3">
                    <Skeleton className="w-20 h-20 rounded-md flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/4 mb-2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <Skeleton className="h-6 w-40 mb-4" />

              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex gap-3">
                    <Skeleton className="w-20 h-20 rounded-md flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/4 mb-2" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
