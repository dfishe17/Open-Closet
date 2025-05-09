"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Save } from "lucide-react"

export function LenderBundleSettings() {
  const [settings, setSettings] = useState({
    allowRenterBundles: true,
    allowMultipleBundles: true,
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Load saved settings from localStorage
    const savedSettings =
      localStorage.getItem("opencloset_lender_bundle_settings") ||
      localStorage.getItem("stylerent_lender_bundle_settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Error parsing saved settings:", error)
      }
    }
  }, [])

  const handleSaveSettings = () => {
    if (!isClient) return

    // Save to both localStorage keys for compatibility
    localStorage.setItem("opencloset_lender_bundle_settings", JSON.stringify(settings))
    localStorage.setItem("stylerent_lender_bundle_settings", JSON.stringify(settings))

    toast({
      title: "Bundle settings saved",
      description: "Your bundle settings have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-cinzel">Lender Bundle Settings</CardTitle>
        <CardDescription>Control how your items can be used in bundles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allowRenterBundles" className="font-medium">
              Allow renter-created bundles
            </Label>
            <p className="text-sm text-muted-foreground">Let renters add your items to their custom bundles</p>
          </div>
          <Switch
            id="allowRenterBundles"
            checked={settings.allowRenterBundles}
            onCheckedChange={(checked) => setSettings({ ...settings, allowRenterBundles: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allowMultipleBundles" className="font-medium">
              Allow items in multiple bundles
            </Label>
            <p className="text-sm text-muted-foreground">Let your items appear in more than one bundle at a time</p>
          </div>
          <Switch
            id="allowMultipleBundles"
            checked={settings.allowMultipleBundles}
            onCheckedChange={(checked) => setSettings({ ...settings, allowMultipleBundles: checked })}
          />
        </div>

        <Button className="w-full" onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Bundle Settings
        </Button>
      </CardContent>
    </Card>
  )
}
