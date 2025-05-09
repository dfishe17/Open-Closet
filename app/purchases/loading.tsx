import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PurchasesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="active" disabled>
            Active Rentals
          </TabsTrigger>
          <TabsTrigger value="completed" disabled>
            Completed Rentals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden mb-6">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-center">
                  <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {[1, 2].map((j) => (
                    <div
                      key={j}
                      className="grid grid-cols-1 md:grid-cols-4 gap-6 border-b pb-6 last:border-0 last:pb-0"
                    >
                      <div className="md:col-span-1">
                        <div className="flex gap-4 items-center">
                          <Skeleton className="w-20 h-20 rounded-md" />
                          <div>
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-1 flex items-center">
                        <div>
                          <Skeleton className="h-4 w-16 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>

                      <div className="md:col-span-1 flex items-center">
                        <div>
                          <Skeleton className="h-4 w-20 mb-2" />
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      </div>

                      <div className="md:col-span-1 flex items-center">
                        <div>
                          <Skeleton className="h-4 w-12 mb-2" />
                          <Skeleton className="h-6 w-20 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 flex justify-between">
                <Skeleton className="h-5 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-9 w-36" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
