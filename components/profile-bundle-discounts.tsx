"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"

export function ProfileBundleDiscounts() {
  const [monthlyDiscounts, setMonthlyDiscounts] = useState({
    oneMonth: 10,
    twoMonths: 15,
    threeMonths: 20,
  })

  const [itemDiscounts, setItemDiscounts] = useState({
    twoItems: 5,
    threeItems: 10,
    fourItems: 15,
    fiveItems: 20,
  })

  const [isLoading, setIsLoading] = useState(true)

  // Load saved discount settings
  useEffect(() => {
    try {
      const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
      if (!userId) return

      // Try to load existing discount settings
      const savedSettings = localStorage.getItem(`stylerent_discounts_${userId}`)

      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)

        // Handle monthly discounts
        if (parsed.monthlyDiscounts) {
          setMonthlyDiscounts(parsed.monthlyDiscounts)
        }

        // Handle item quantity discounts
        if (parsed.itemDiscounts) {
          setItemDiscounts(parsed.itemDiscounts)
        }
      }
    } catch (error) {
      console.error("Error loading discount settings:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveDiscountSettings = () => {
    try {
      const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
      if (!userId) {
        toast({
          title: "Error",
          description: "User ID not found. Please log in again.",
          variant: "destructive",
        })
        return
      }

      // Save the combined settings
      const settings = {
        monthlyDiscounts,
        itemDiscounts,
      }

      localStorage.setItem(`stylerent_discounts_${userId}`, JSON.stringify(settings))

      // Also update bundle discount settings for compatibility
      const bundleDiscounts = {
        oneMonth: monthlyDiscounts.oneMonth,
        twoMonths: monthlyDiscounts.twoMonths,
        threeMonths: monthlyDiscounts.threeMonths,
        twoItems: itemDiscounts.twoItems,
        threeItems: itemDiscounts.threeItems,
        fourItems: itemDiscounts.fourItems,
        fiveOrMoreItems: itemDiscounts.fiveItems,
      }

      localStorage.setItem("stylerent_bundle_discounts", JSON.stringify(bundleDiscounts))
      localStorage.setItem("opencloset_bundle_discounts", JSON.stringify(bundleDiscounts))

      // Update any existing bundles
      updateBundleDiscounts(userId)

      toast({
        title: "Success",
        description: "Discount settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving discount settings:", error)
      toast({
        title: "Error",
        description: "Failed to save discount settings",
        variant: "destructive",
      })
    }
  }

  const updateBundleDiscounts = (userId) => {
    try {
      // Get all bundles
      const bundlesJson = localStorage.getItem("stylerent_bundles") || localStorage.getItem("opencloset_bundles")
      if (!bundlesJson) return

      const bundles = JSON.parse(bundlesJson)

      // Update only the user's bundles
      const updatedBundles = bundles.map((bundle) => {
        if (bundle.ownerId === userId) {
          // Convert our settings to the format used in bundles
          return {
            ...bundle,
            timeDiscounts: [
              { months: 1, percentage: monthlyDiscounts.oneMonth },
              { months: 2, percentage: monthlyDiscounts.twoMonths },
              { months: 3, percentage: monthlyDiscounts.threeMonths },
            ],
            itemDiscounts: [
              { quantity: 2, percentage: itemDiscounts.twoItems },
              { quantity: 3, percentage: itemDiscounts.threeItems },
              { quantity: 4, percentage: itemDiscounts.fourItems },
              { quantity: 5, percentage: itemDiscounts.fiveItems },
            ],
          }
        }
        return bundle
      })

      // Save the updated bundles
      localStorage.setItem("stylerent_bundles", JSON.stringify(updatedBundles))
      localStorage.setItem("opencloset_bundles", JSON.stringify(updatedBundles))

      // Notify other components
      window.dispatchEvent(
        new CustomEvent("stylerent-bundles-updated", {
          detail: { bundles: updatedBundles },
        }),
      )
    } catch (error) {
      console.error("Error updating bundle discounts:", error)
    }
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading discount settings...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Monthly Rental Discounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* One Month Discount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="one-month">1 Month Rental</Label>
              <Badge variant="outline">{monthlyDiscounts.oneMonth}% off</Badge>
            </div>
            <Slider
              id="one-month"
              min={0}
              max={30}
              step={5}
              value={[monthlyDiscounts.oneMonth]}
              onValueChange={(value) => setMonthlyDiscounts({ ...monthlyDiscounts, oneMonth: value[0] })}
              className="py-1"
            />
          </div>

          {/* Two Month Discount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="two-months">2 Month Rental</Label>
              <Badge variant="outline">{monthlyDiscounts.twoMonths}% off</Badge>
            </div>
            <Slider
              id="two-months"
              min={0}
              max={40}
              step={5}
              value={[monthlyDiscounts.twoMonths]}
              onValueChange={(value) => setMonthlyDiscounts({ ...monthlyDiscounts, twoMonths: value[0] })}
              className="py-1"
            />
          </div>

          {/* Three Month Discount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="three-months">3 Month Rental</Label>
              <Badge variant="outline">{monthlyDiscounts.threeMonths}% off</Badge>
            </div>
            <Slider
              id="three-months"
              min={0}
              max={50}
              step={5}
              value={[monthlyDiscounts.threeMonths]}
              onValueChange={(value) => setMonthlyDiscounts({ ...monthlyDiscounts, threeMonths: value[0] })}
              className="py-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Item Quantity Discounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Two Items Discount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="two-items">2 Items</Label>
              <Badge variant="outline">{itemDiscounts.twoItems}% off</Badge>
            </div>
            <Slider
              id="two-items"
              min={0}
              max={25}
              step={5}
              value={[itemDiscounts.twoItems]}
              onValueChange={(value) => setItemDiscounts({ ...itemDiscounts, twoItems: value[0] })}
              className="py-1"
            />
          </div>

          {/* Three Items Discount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="three-items">3 Items</Label>
              <Badge variant="outline">{itemDiscounts.threeItems}% off</Badge>
            </div>
            <Slider
              id="three-items"
              min={0}
              max={30}
              step={5}
              value={[itemDiscounts.threeItems]}
              onValueChange={(value) => setItemDiscounts({ ...itemDiscounts, threeItems: value[0] })}
              className="py-1"
            />
          </div>

          {/* Four Items Discount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="four-items">4 Items</Label>
              <Badge variant="outline">{itemDiscounts.fourItems}% off</Badge>
            </div>
            <Slider
              id="four-items"
              min={0}
              max={35}
              step={5}
              value={[itemDiscounts.fourItems]}
              onValueChange={(value) => setItemDiscounts({ ...itemDiscounts, fourItems: value[0] })}
              className="py-1"
            />
          </div>

          {/* Five+ Items Discount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="five-items">5+ Items</Label>
              <Badge variant="outline">{itemDiscounts.fiveItems}% off</Badge>
            </div>
            <Slider
              id="five-items"
              min={0}
              max={40}
              step={5}
              value={[itemDiscounts.fiveItems]}
              onValueChange={(value) => setItemDiscounts({ ...itemDiscounts, fiveItems: value[0] })}
              className="py-1"
            />
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={saveDiscountSettings}>
        Save Discount Settings
      </Button>
    </div>
  )
}
