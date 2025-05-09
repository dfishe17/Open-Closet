import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Package } from "lucide-react"

interface OpenClosetSummaryProps {
  currentRentals?: Array<{
    id: string
    name: string
    designer: string
    image: string
    rentalStart: string
    rentalEnd: string
    daysLeft: number
  }>
}

export function OpenClosetSummary({ currentRentals = [] }: OpenClosetSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My OpenCloset</CardTitle>
        <CardDescription>Manage your current rentals and returns</CardDescription>
      </CardHeader>
      <CardContent>
        {currentRentals.length > 0 ? (
          <div className="space-y-4">
            {currentRentals.slice(0, 2).map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">{item.designer}</p>
                  <div className="flex items-center mt-1">
                    <Package className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Return in {item.daysLeft} day{item.daysLeft !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <Badge className="flex-shrink-0">{item.daysLeft} days</Badge>
              </div>
            ))}

            {currentRentals.length > 2 && (
              <p className="text-sm text-center text-muted-foreground">
                +{currentRentals.length - 2} more active rentals
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No active rentals</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href="/open-closet">View My OpenCloset</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
