"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Package, ShoppingBag, Settings, LogOut, Heart, MessageSquare } from "lucide-react"
import { getUserItems } from "@/lib/item-utils"

export default function MobileProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [listedItems, setListedItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("stylerent_logged_in") === "true"

    if (!isLoggedIn) {
      router.push("/mobile/auth/signin")
      return
    }

    // Get user data
    try {
      const storedUser = localStorage.getItem("stylerent_user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUserData(parsedUser)

        // Get user's items
        const userItems = getUserItems(parsedUser.id)
        setListedItems(userItems)
      } else {
        router.push("/mobile/auth/signin")
      }
    } catch (error) {
      console.error("Error retrieving user data:", error)
      router.push("/mobile/auth/signin")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("stylerent_logged_in")
    localStorage.removeItem("stylerent_user")
    router.push("/mobile/auth/signin")
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-muted"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-3 w-32 bg-muted rounded"></div>
            </div>
          </div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="container px-4 py-6 text-center">
        <p className="mb-4">Please sign in to view your profile</p>
        <Button asChild>
          <Link href="/mobile/auth/signin">Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">My Profile</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-lg">{userData.name}</h2>
              <p className="text-sm text-muted-foreground">{userData.email}</p>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm">{userData.rating || "4.8"} Rating</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button asChild variant="outline" className="h-auto py-3">
          <Link href="/mobile/shop-rentals" className="flex flex-col items-center">
            <ShoppingBag className="h-5 w-5 mb-1" />
            <span className="text-xs">My Shop's Rentals</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-3">
          <Link href="/mobile/wishlist" className="flex flex-col items-center">
            <Heart className="h-5 w-5 mb-1" />
            <span className="text-xs">Wishlist</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-3">
          <Link href="/mobile/messages" className="flex flex-col items-center">
            <MessageSquare className="h-5 w-5 mb-1" />
            <span className="text-xs">Messages</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-3">
          <Link href="/mobile/profile/settings" className="flex flex-col items-center">
            <Settings className="h-5 w-5 mb-1" />
            <span className="text-xs">Settings</span>
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="rentals">My Rentals</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-4">
          {listedItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No listings yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Start listing your items to earn money</p>
              <Button asChild>
                <Link href="/mobile/list-item">List an Item</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {listedItems.map((item) => (
                <Link href={`/mobile/items/${item.id}`} key={item.id}>
                  <Card className="overflow-hidden border-none shadow-sm">
                    <div className="aspect-[3/4] bg-muted relative">
                      <img
                        src={(item.media && item.media[0]?.url) || item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                      <Badge
                        className="absolute top-2 right-2"
                        variant={item.status === "Available" ? "default" : "secondary"}
                      >
                        {item.status || "Available"}
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.designer}</p>
                      <div className="mt-1">
                        <p className="font-medium text-sm">${item.rentalPrice || item.price}/day</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rentals" className="mt-4">
          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No active rentals</h3>
            <p className="text-sm text-muted-foreground mb-6">Browse items to rent designer clothes</p>
            <Button asChild>
              <Link href="/mobile/browse">Browse Items</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
