"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [shopName, setShopName] = useState("")
  const [hasShop, setHasShop] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("opencloset_logged_in") === "true"

    if (!isLoggedIn) {
      router.push("/auth/signin")
      return
    }

    // Get user data
    try {
      const storedUser = localStorage.getItem("opencloset_user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUserData(parsedUser)

        // Initialize settings from user data or defaults
        setDisplayName(parsedUser.name || "")
        setBio(parsedUser.bio || "")

        // Get user settings if they exist
        const userSettings = localStorage.getItem(`opencloset_settings_${parsedUser.id}`)
        if (userSettings) {
          const settings = JSON.parse(userSettings)
          setEmailNotifications(settings.emailNotifications ?? true)
          setDarkMode(settings.darkMode ?? false)
        }

        // Get user shop settings if they exist
        const userShopSettings = localStorage.getItem(`stylerent_shop_${parsedUser.id}`)
        if (userShopSettings) {
          const shopSettings = JSON.parse(userShopSettings)
          setShopName(shopSettings.name || "")
          setHasShop(shopSettings.hasShop || false)
        }
      } else {
        router.push("/auth/signin")
      }
    } catch (error) {
      console.error("Error retrieving user data:", error)
      router.push("/auth/signin")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const saveSettings = () => {
    if (!userData) return

    // Save user profile updates
    const updatedUser = {
      ...userData,
      name: displayName,
      bio: bio,
    }

    localStorage.setItem("opencloset_user", JSON.stringify(updatedUser))

    // Save settings
    const settings = {
      emailNotifications,
      darkMode,
    }

    localStorage.setItem(`opencloset_settings_${userData.id}`, JSON.stringify(settings))

    // Save shop settings
    const shopSettings = {
      name: shopName,
      hasShop: hasShop,
    }
    localStorage.setItem(`stylerent_shop_${userData.id}`, JSON.stringify(shopSettings))

    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })
  }

  if (!isClient || isLoading) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="shop">Shop</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details and public profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={userData?.email || ""} disabled />
                <p className="text-sm text-muted-foreground">Your email address cannot be changed.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about yourself..."
                />
              </div>
            </CardContent>
          </Card>
          {/* Aesthetics Settings */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Style Preferences</h3>
              <p className="text-sm text-muted-foreground">Manage your followed aesthetics and style preferences.</p>
            </div>
            <div className="grid gap-2">
              <Button variant="outline" asChild>
                <Link href="/profile/aesthetics">Manage Followed Aesthetics</Link>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications and updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about your rentals, messages, and account updates.
                  </p>
                </div>
                <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how OpenCloset looks for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark theme.</p>
                </div>
                <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shop">
          <Card>
            <CardHeader>
              <CardTitle>Shop Settings</CardTitle>
              <CardDescription>Configure your shop preferences and details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="shop-mode">Enable Shop Mode</Label>
                  <p className="text-sm text-muted-foreground">Turn on shop mode to list and rent out your items.</p>
                </div>
                <Switch id="shop-mode" checked={hasShop} onCheckedChange={setHasShop} />
              </div>

              {hasShop && (
                <div className="space-y-2 mt-4 pt-4 border-t">
                  <Label htmlFor="shop-name">Shop Name</Label>
                  <Input
                    id="shop-name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Enter your shop name"
                  />
                  <p className="text-sm text-muted-foreground">
                    This name will be displayed to others when they view your items.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance">
          <Card>
            <CardHeader>
              <CardTitle>Rental Insurance</CardTitle>
              <CardDescription>Manage your rental insurance preferences and refund settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <div>
                  <p className="font-medium">Insurance Protection</p>
                  <p className="text-sm text-muted-foreground">
                    Configure your rental insurance options, refund preferences, and coverage settings.
                  </p>
                </div>
              </div>
              <Button onClick={() => router.push("/profile/settings/insurance")} className="mt-2">
                Manage Insurance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={saveSettings}>Save Settings</Button>
      </div>
    </div>
  )
}
