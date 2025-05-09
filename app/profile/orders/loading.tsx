import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function OrdersLoading() {
  return (
    <div className="container max-w-4xl py-10">
      <Skeleton className="h-10 w-48 mb-6" />

      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-5 w-16 mb-2" />
                  <div className="space-y-2">
                    {[1, 2].map((j) => (
                      <div key={j} className="flex justify-between">
                        <div>
                          <Skeleton className="h-5 w-40 mb-1" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-2 flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>

                <div className="pt-2">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
