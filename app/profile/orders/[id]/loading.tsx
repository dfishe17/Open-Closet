import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function OrderDetailLoading() {
  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <Skeleton className="h-10 w-32" />
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <Skeleton className="h-5 w-16 mb-2" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b last:border-0">
                    <Skeleton className="w-16 h-16 rounded-md" />

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-40 mb-1" />
                        <Skeleton className="h-5 w-16" />
                      </div>

                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}

                <div className="border-t pt-2 flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  )
}
