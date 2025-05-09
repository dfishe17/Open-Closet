"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface BundleSetting {
  allowRenterBundles: boolean
}

export function LenderBundleExclusivity() {
  const [bundleSettings, setBundleSettings] = useState<BundleSetting>({
    allowRenterBundles: true,
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Load saved bundle settings from localStorage
    try {
      const savedSettings = localStorage.getItem("opencloset_lender_bundle_settings")
      if (savedSettings) {
        setBundleSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error("Error loading bundle settings:", error)
    }
  }, [])

  const handleSettingChange = (value: boolean) => {
    setBundleSettings({
      ...bundleSettings,
      allowRenterBundles: value,
    })
  }

  const saveBundleSettings = () => {
    try {
      localStorage.setItem("opencloset_lender_bundle_settings", JSON.stringify(bundleSettings))
      // Also save with stylerent prefix for compatibility
      localStorage.setItem("stylerent_lender_bundle_settings", JSON.stringify(bundleSettings))
      toast.success("Bundle settings saved successfully")
    } catch (error) {
      console.error("Error saving bundle settings:", error)
      toast.error("Failed to save bundle settings")
    }
  }

  if (!isClient) {
    return <div className="animate-pulse h-[150px] bg-muted rounded-md"></div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bundle Exclusivity Settings</CardTitle>
        <CardDescription>Control how renters can use your items in their custom bundles.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allow-renter-bundles">Allow renters to add my items to their bundles</Label>
            <p className="text-sm text-muted-foreground">
              When disabled, your items can only be rented individually or in bundles you create
            </p>
          </div>
          <Switch
            id="allow-renter-bundles"
            checked={bundleSettings.allowRenterBundles}
            onCheckedChange={handleSettingChange}
          />
        </div>
        <Button onClick={saveBundleSettings} className="w-full mt-4">
          Save Bundle Settings
        </Button>
      </CardContent>
    </Card>
  )
}
