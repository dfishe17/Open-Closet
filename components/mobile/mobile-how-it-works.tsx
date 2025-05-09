"use client"

import { Calendar, ShoppingBag, Truck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function MobileHowItWorks() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4 font-cinzel">How It Works</h2>
      <div className="grid gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-start">
            <div className="bg-sage/20 p-2 rounded-full mr-4">
              <ShoppingBag className="h-5 w-5 text-sage" />
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">Browse & Select</h3>
              <p className="text-xs text-muted-foreground">
                Explore our curated collection of designer clothes and accessories.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-start">
            <div className="bg-blush/20 p-2 rounded-full mr-4">
              <Calendar className="h-5 w-5 text-blush" />
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">Book Your Dates</h3>
              <p className="text-xs text-muted-foreground">Choose your rental period with our easy-to-use calendar.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-start">
            <div className="bg-taupe/20 p-2 rounded-full mr-4">
              <Truck className="h-5 w-5 text-taupe" />
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">Wear & Return</h3>
              <p className="text-xs text-muted-foreground">
                Receive your items, enjoy wearing them, and return using our prepaid shipping label.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
