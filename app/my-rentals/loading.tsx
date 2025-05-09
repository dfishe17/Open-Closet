import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Loading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-48 mb-2" />
      <Skeleton className="h-5 w-96 mb-8" />

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg mb-8 border border-pink-100">
        <div className="flex items-start">
          <Skeleton className="h-9 w-9 rounded-full mr-4" />
          <div className="w-full">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active" disabled>
            <Skeleton className="h-4 w-16" />
          </TabsTrigger>
          <TabsTrigger value="upcoming" disabled>
            <Skeleton className="h-4 w-20" />
          </TabsTrigger>
          <TabsTrigger value="past" disabled>
            <Skeleton className="h-4 w-12" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="mb-6">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex gap-4">
                  <Skeleton className="w-28 h-28 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <div className="flex items-center mt-2">
                      <Skeleton className="h-6 w-6 rounded-full mr-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
              <CardFooter className="pt-4 flex gap-2 bg-gray-50">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-40" />
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
