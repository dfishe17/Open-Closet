import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ShopRentalsLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-56 mb-6" />

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          {[1, 2].map((i) => (
            <Card key={i} className="mb-6">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-32 mb-3" />
                    <div className="flex items-center">
                      <Skeleton className="h-6 w-6 rounded-full mr-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-4 w-56 mt-4" />
                <Skeleton className="h-4 w-48 mt-2" />
              </CardContent>
              <CardFooter className="pt-4">
                <Skeleton className="h-9 w-28 mr-2" />
                <Skeleton className="h-9 w-36" />
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
