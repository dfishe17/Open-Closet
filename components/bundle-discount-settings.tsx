"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"

export function BundleDiscountSettings() {
  // Update the discounts state to use months instead of days
  const [discounts, setDiscounts] = useState({
    oneMonth: 10,
    twoMonths: 15,
    threeMonths: 20,
    twoItems: 5,
    threeItems: 10,
    fourItems: 15,
    fiveOrMoreItems: 20,
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Load saved discounts from localStorage
    const savedDiscounts =
      localStorage.getItem("opencloset_bundle_discounts") || localStorage.getItem("stylerent_bundle_discounts")
    if (savedDiscounts) {
      try {
        setDiscounts(JSON.parse(savedDiscounts))
      } catch (error) {
        console.error("Error parsing saved discounts:", error)
      }
    }
  }, [])

  // Update the handleSaveDiscounts function to save the monthly discounts
  const handleSaveDiscounts = () => {
    if (!isClient) return

    // Save to both localStorage keys for compatibility
    localStorage.setItem("opencloset_bundle_discounts", JSON.stringify(discounts))
    localStorage.setItem("stylerent_bundle_discounts", JSON.stringify(discounts))

    // Also update any existing bundles with these discount settings
    try {
      const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
      const storedBundles = localStorage.getItem("stylerent_bundles") || localStorage.getItem("opencloset_bundles")

      if (storedBundles && userId) {
        const allBundles = JSON.parse(storedBundles)

        // Update the user's bundles with the new discount settings
        const updatedBundles = allBundles.map((bundle) => {
          if (bundle.ownerId === userId) {
            // Convert the discount settings to the bundle format
            const timeDiscounts = [
              { months: 1, percentage: discounts.oneMonth },
              { months: 2, percentage: discounts.twoMonths },
              { months: 3, percentage: discounts.threeMonths },
            ]

            const itemDiscounts = [
              { quantity: 2, percentage: discounts.twoItems },
              { quantity: 3, percentage: discounts.threeItems },
              { quantity: 4, percentage: discounts.fourItems },
              { quantity: 5, percentage: discounts.fiveOrMoreItems },
            ]

            return {
              ...bundle,
              timeDiscounts: timeDiscounts,
              itemDiscounts: itemDiscounts,
            }
          }
          return bundle
        })

        // Save the updated bundles
        localStorage.setItem("stylerent_bundles", JSON.stringify(updatedBundles))
        localStorage.setItem("opencloset_bundles", JSON.stringify(updatedBundles))

        // Dispatch event to notify other components
        window.dispatchEvent(
          new CustomEvent("stylerent-bundles-updated", {
            detail: { bundles: updatedBundles },
          }),
        )
      }
    } catch (error) {
      console.error("Error updating bundle discounts:", error)
    }

    toast({
      title: "Bundle discounts saved",
      description: "Your bundle discount settings have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-cinzel">Bundle Discount Settings</CardTitle>
        <CardDescription>Set discount percentages based on the number of items in a bundle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Rental Discounts */}
        <div className="space-y-6">
          {/* Monthly Rental Discounts */}
          <div className="space-y-4">
            <h3 className="font-medium">Monthly Rental Discounts</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="oneMonth" className="font-medium">
                  1 Month Rental
                </Label>
                <span className="text-sm font-medium">{discounts.oneMonth}% off</span>
              </div>
              <Slider
                id="oneMonth"
                min={0}
                max={30}
                step={5}
                value={[discounts.oneMonth]}
                onValueChange={(value) => setDiscounts({ ...discounts, oneMonth: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="twoMonths" className="font-medium">
                  2 Month Rental
                </Label>
                <span className="text-sm font-medium">{discounts.twoMonths}% off</span>
              </div>
              <Slider
                id="twoMonths"
                min={0}
                max={40}
                step={5}
                value={[discounts.twoMonths]}
                onValueChange={(value) => setDiscounts({ ...discounts, twoMonths: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="threeMonths" className="font-medium">
                  3 Month Rental
                </Label>
                <span className="text-sm font-medium">{discounts.threeMonths}% off</span>
              </div>
              <Slider
                id="threeMonths"
                min={0}
                max={50}
                step={5}
                value={[discounts.threeMonths]}
                onValueChange={(value) => setDiscounts({ ...discounts, threeMonths: value[0] })}
              />
            </div>
          </div>

          {/* Item Quantity Discounts - Keep this section as is */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium">Item Quantity Discounts</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="twoItems" className="font-medium">
                  2 Items
                </Label>
                <span className="text-sm font-medium">{discounts.twoItems}% off</span>
              </div>
              <Slider
                id="twoItems"
                min={0}
                max={50}
                step={1}
                value={[discounts.twoItems]}
                onValueChange={(value) => setDiscounts({ ...discounts, twoItems: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="threeItems" className="font-medium">
                  3 Items
                </Label>
                <span className="text-sm font-medium">{discounts.threeItems}% off</span>
              </div>
              <Slider
                id="threeItems"
                min={0}
                max={50}
                step={1}
                value={[discounts.threeItems]}
                onValueChange={(value) => setDiscounts({ ...discounts, threeItems: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="fourItems" className="font-medium">
                  4 Items
                </Label>
                <span className="text-sm font-medium">{discounts.fourItems}% off</span>
              </div>
              <Slider
                id="fourItems"
                min={0}
                max={50}
                step={1}
                value={[discounts.fourItems]}
                onValueChange={(value) => setDiscounts({ ...discounts, fourItems: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="fiveOrMoreItems" className="font-medium">
                  5+ Items
                </Label>
                <span className="text-sm font-medium">{discounts.fiveOrMoreItems}% off</span>
              </div>
              <Slider
                id="fiveOrMoreItems"
                min={0}
                max={50}
                step={1}
                value={[discounts.fiveOrMoreItems]}
                onValueChange={(value) => setDiscounts({ ...discounts, fiveOrMoreItems: value[0] })}
              />
            </div>
          </div>

          <Button className="w-full" onClick={handleSaveDiscounts}>
            <Save className="h-4 w-4 mr-2" />
            Save Discount Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
