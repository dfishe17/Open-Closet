"use client"

import { useState, useEffect } from "react"
import { Calculator } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

export function RentalPriceCalculator({ basePrice = 0, currency = "$" }) {
  const [days, setDays] = useState(3)
  const [totalPrice, setTotalPrice] = useState(0)
  const [daysRange, setDaysRange] = useState("1-3")
  const [dailyRate, setDailyRate] = useState(0)
  const [percentRate, setPercentRate] = useState("5%")

  // Calculate daily rental rate based on the rental duration
  const calculateDailyRate = (days: number, basePrice: number) => {
    let rate: number

    if (days >= 1 && days <= 3) {
      rate = basePrice * 0.05 // 5% of base price per day
      setDaysRange("1-3")
      setPercentRate("5%")
    } else if (days >= 4 && days <= 7) {
      rate = basePrice * 0.04 // 4% of base price per day
      setDaysRange("4-7")
      setPercentRate("4%")
    } else if (days >= 8 && days <= 14) {
      rate = basePrice * 0.03 // 3% of base price per day
      setDaysRange("8-14")
      setPercentRate("3%")
    } else {
      rate = basePrice * 0.02 // 2% of base price per day
      setDaysRange("15+")
      setPercentRate("2%")
    }

    return rate
  }

  useEffect(() => {
    if (!basePrice || basePrice <= 0) return

    const dailyRate = calculateDailyRate(days, basePrice)
    setDailyRate(dailyRate)
    setTotalPrice(dailyRate * days)
  }, [days, basePrice])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Rental Price Calculator</CardTitle>
            <CardDescription>Estimate your rental earnings</CardDescription>
          </div>
          <Calculator className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="basePrice">Base Price</Label>
            <div className="text-sm font-medium">
              {currency}
              {basePrice.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="days">Rental Duration</Label>
            <div className="flex items-center">
              <div className="text-sm font-medium">{days} days</div>
              <Badge variant="outline" className="ml-2 text-xs">
                {daysRange} days
              </Badge>
            </div>
          </div>
          <Slider id="days" min={1} max={30} step={1} value={[days]} onValueChange={(value) => setDays(value[0])} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>7</span>
            <span>14</span>
            <span>30</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Base Price:</div>
            <div className="text-right font-medium">
              {currency}
              {basePrice.toFixed(2)}
            </div>

            <div className="text-muted-foreground">Daily Rate:</div>
            <div className="text-right font-medium">
              {currency}
              {dailyRate.toFixed(2)}/day
              <span className="text-xs text-muted-foreground ml-1">({percentRate})</span>
            </div>

            <div className="text-muted-foreground">Duration:</div>
            <div className="text-right font-medium">{days} days</div>

            <div className="border-t pt-1 text-muted-foreground font-medium">Total Earnings:</div>
            <div className="border-t pt-1 text-right font-bold text-primary">
              {currency}
              {totalPrice.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="text-xs text-muted-foreground space-y-1 w-full">
          <p>Daily rates based on rental duration:</p>
          <ul className="list-disc list-inside space-y-0.5 pl-1">
            <li>Days 1-3: 5% of base price per day</li>
            <li>Days 4-7: 4% of base price per day</li>
            <li>Days 8-14: 3% of base price per day</li>
            <li>Days 15+: 2% of base price per day</li>
          </ul>
        </div>
      </CardFooter>
    </Card>
  )
}
