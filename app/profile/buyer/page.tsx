"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Package, ShoppingBag, MessageSquare } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ReviewSection } from "@/components/review-section"
import { getUserFollowing } from "@/lib/follow-utils"
import { getOrdersByUserId } from "@/lib/storage-utils"

export default function BuyerProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [wishlist, setWishlist] = useState<any[]>([])
  const [rentedItems, setRentedItems] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([])
  const [followingContent, setFollowingContent] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("wishlist")
  const [orderCount, setOrderCount] = useState(0)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("stylerent_logged_in") === "true"

    if (!isLoggedIn) {
      router.push("/auth/signin")
      return
    }

    // Get user data
    try {
      const storedUser = localStorage.getItem("stylerent_user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUserData(parsedUser)

        // Initialize data storage if needed
        if (typeof window !== "undefined") {
          // Use dynamic import instead of require
          import("@/lib/data-init")
            .then((module) => {
              module.initializeDataStorage()
            })
            .catch((error) => {
              console.error("Error initializing data storage:", error)
            })
        }
      } else {
        router.push("/auth/signin")
      }
    } catch (error) {
      console.error("Error retrieving user data:", error)
      router.push("/auth/signin")
    }
  }, [router])

  // Separate useEffect for loading user content
  useEffect(() => {
    if (!userData) return

    // Get wishlist
    try {
      const storedWishlist = localStorage.getItem("stylerent_wishlist")
      if (storedWishlist) {
        const wishlistData = JSON.parse(storedWishlist)
        // Filter wishlist by the current user
        const userWishlist = wishlistData.filter((item) => item.userId === userData.id)
        setWishlist(userWishlist)
      }
    } catch (error) {
      console.error("Error retrieving wishlist:", error)
    }

    // In a real app, we would fetch rented items from the backend
    // For now, we'll use an empty array
    setRentedItems([])

    // Get following data
    try {
      const following = getUserFollowing(userData.id)
      setFollowing(following)

      // Get content from followed users
      if (following.length > 0) {
        const followedUserIds = following.map((follow) => follow.followedId)

        const storedItems = localStorage.getItem("stylerent_items")
        const storedBundles = localStorage.getItem("stylerent_bundles")

        if (storedItems && storedBundles) {
          const items = JSON.parse(storedItems)
          const bundles = JSON.parse(storedBundles)

          // Get content from followed users
          const followedItems = items.filter((item) => followedUserIds.includes(item.ownerId))
          const followedBundles = bundles.filter((bundle) => followedUserIds.includes(bundle.ownerId))

          // Combine and sort by date
          const combinedContent = [
            ...followedItems.map((item) => ({ ...item, type: "item", date: item.createdAt || Date.now() })),
            ...followedBundles.map((bundle) => ({ ...bundle, type: "bundle", date: bundle.createdAt || Date.now() })),
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

          setFollowingContent(combinedContent)
        }
      }
    } catch (error) {
      console.error("Error retrieving following data:", error)
    }

    // Add fetching order count
    if (userData) {
      const renterOrders = getOrdersByUserId(userData.id)
      setOrderCount(renterOrders.length)
    }
  }, [userData])

  const removeFromWishlist = (itemId) => {
    try {
      const storedWishlist = localStorage.getItem("stylerent_wishlist")
      if (storedWishlist) {
        const wishlistData = JSON.parse(storedWishlist)
        const updatedWishlist = wishlistData.filter((item) => !(item.itemId === itemId && item.userId === userData?.id))
        localStorage.setItem("stylerent_wishlist", JSON.stringify(updatedWishlist))

        // Update the state
        const userWishlist = updatedWishlist.filter((item) => item.userId === userData?.id)
        setWishlist(userWishlist)

        // Dispatch an event to notify other components
        window.dispatchEvent(new Event("wishlistUpdated"))

        toast.success("Item removed from wishlist")
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove item from wishlist")
    }
  }

  const unfollowUser = (followedId) => {
    try {
      const storedFollowing = localStorage.getItem("stylerent_following")
      if (storedFollowing) {
        const followingData = JSON.parse(storedFollowing)
        const updatedFollowing = followingData.filter(
          (follow) => !(follow.followerId === userData?.id && follow.followedId === followedId),
        )
        localStorage.setItem("stylerent_following", JSON.stringify(updatedFollowing))

        // Update the state
        const userFollowing = updatedFollowing.filter((follow) => follow.followerId === userData?.id)
        setFollowing(userFollowing)

        // Dispatch an event to notify other components
        window.dispatchEvent(new Event("followingUpdated"))

        toast.success("Unfollowed successfully")
      }
    } catch (error) {
      console.error("Error unfollowing user:", error)
      toast.error("Failed to unfollow user")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("stylerent_logged_in")
    localStorage.removeItem("stylerent_user")
    router.push("/auth/signin")
  }

  if (!isClient || !userData) {
    return (
      <div className="container py-10">
        <p className="text-center">Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-serif">Renter Profile</h1>
            <p className="text-muted-foreground">Manage your wishlist and rentals</p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/browse">Browse Items</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold font-serif">{userData.name}</h2>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                  <div className="flex items-center mt-2">
                    <Badge>Renter</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-cinzel">Renter Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wishlist Items</span>
                    <span className="font-medium">{wishlist.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Following</span>
                    <span className="font-medium">{following.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rentals Completed</span>
                    <span className="font-medium">{rentedItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Rental Duration</span>
                    <span className="font-medium">N/A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Rating</span>
                    <span className="font-medium">N/A</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-cinzel">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/messages">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/profile/seller">Switch to Lender Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="rentals">Rentals</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="wishlist" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold font-cinzel">Your Wishlist</h2>
                  <Button asChild>
                    <Link href="/browse">Browse More Items</Link>
                  </Button>
                </div>

                {wishlist.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
                      <Button asChild>
                        <Link href="/browse">Browse Items</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((wishlistItem) => {
                      // Get the item details from localStorage
                      const storedItems = localStorage.getItem("stylerent_items")
                      let itemDetails = null
                      if (storedItems) {
                        const allItems = JSON.parse(storedItems)
                        itemDetails = allItems.find((item) => item.id === wishlistItem.itemId)
                      }

                      if (!itemDetails) return null

                      return (
                        <Card key={wishlistItem.id} className="overflow-hidden">
                          <div className="aspect-[4/3] relative">
                            {itemDetails.media && itemDetails.media[0] ? (
                              <img
                                src={itemDetails.media[0].url || "/placeholder.svg"}
                                alt={itemDetails.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground">No image</p>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium">{itemDetails.name}</h3>
                            <p className="text-sm text-muted-foreground">{itemDetails.designer}</p>
                            <div className="mt-2 flex justify-between items-center">
                              <p className="font-medium">${itemDetails.rentalPrice}/day</p>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex gap-2">
                            <Button variant="outline" className="flex-1" asChild>
                              <Link href={`/items/${itemDetails.id}`}>View</Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4"
                                  >
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                  </svg>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove from Wishlist</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove this item from your wishlist?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => removeFromWishlist(wishlistItem.itemId)}>
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </CardFooter>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rentals" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold font-cinzel">Your Rentals</h2>
                  <Button asChild>
                    <Link href="/browse">Rent More Items</Link>
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">You haven't rented any items yet.</p>
                    <Button asChild>
                      <Link href="/browse">Browse Items to Rent</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="following" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold font-cinzel">People You Follow</h2>
                  <Button asChild>
                    <Link href="/browse">Discover People</Link>
                  </Button>
                </div>

                {following.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">You're not following anyone yet.</p>
                      <Button asChild>
                        <Link href="/browse">Discover People to Follow</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-cinzel">Following</CardTitle>
                        <CardDescription>People you're following</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {following.map((follow) => {
                            // Get user details
                            const storedUsers = localStorage.getItem("stylerent_users")
                            let userDetails = null
                            if (storedUsers) {
                              const allUsers = JSON.parse(storedUsers)
                              userDetails = allUsers.find((user) => user.id === follow.followedId)
                            }

                            if (!userDetails) return null

                            return (
                              <Card key={follow.id} className="overflow-hidden">
                                <CardContent className="p-4 flex items-center gap-4">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage src={userDetails.avatar} alt={userDetails.name} />
                                    <AvatarFallback>{userDetails.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <h3 className="font-medium">{userDetails.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {userDetails.userType === "lender" ? "Lender" : "Renter"}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                      <Link href={`/profile/${userDetails.id}`}>View</Link>
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => unfollowUser(userDetails.id)}>
                                      Unfollow
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="font-cinzel">Recent Content</CardTitle>
                        <CardDescription>Recent items and bundles from people you follow</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {followingContent.length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">
                            No recent content from people you follow.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {followingContent.slice(0, 6).map((content) => {
                              // Get user details
                              const storedUsers = localStorage.getItem("stylerent_users")
                              let userDetails = null
                              if (storedUsers) {
                                const allUsers = JSON.parse(storedUsers)
                                userDetails = allUsers.find((user) => user.id === content.ownerId)
                              }

                              return (
                                <Card key={`${content.type}-${content.id}`} className="overflow-hidden">
                                  <div className="aspect-[4/3] relative">
                                    {content.type === "item" && content.media && content.media[0] ? (
                                      <img
                                        src={content.media[0].url || "/placeholder.svg"}
                                        alt={content.name}
                                        className="object-cover w-full h-full"
                                      />
                                    ) : content.type === "bundle" && content.image ? (
                                      <img
                                        src={content.image || "/placeholder.svg"}
                                        alt={content.title}
                                        className="object-cover w-full h-full"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <p className="text-muted-foreground">No image</p>
                                      </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                      <Badge>{content.type === "item" ? "Item" : "Bundle"}</Badge>
                                    </div>
                                  </div>
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={userDetails?.avatar} alt={userDetails?.name} />
                                        <AvatarFallback>{userDetails?.name?.charAt(0) || "U"}</AvatarFallback>
                                      </Avatar>
                                      <p className="text-sm font-medium">{userDetails?.name}</p>
                                    </div>
                                    <h3 className="font-medium">
                                      {content.type === "item" ? content.name : content.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {content.type === "item" ? content.designer : content.description}
                                    </p>
                                    <div className="mt-2">
                                      <p className="font-medium">
                                        ${content.type === "item" ? content.rentalPrice : content.price}/day
                                      </p>
                                    </div>
                                  </CardContent>
                                  <CardFooter className="p-4 pt-0">
                                    <Button variant="outline" className="w-full" asChild>
                                      <Link
                                        href={
                                          content.type === "item" ? `/items/${content.id}` : `/bundles/${content.id}`
                                        }
                                      >
                                        View {content.type === "item" ? "Item" : "Bundle"}
                                      </Link>
                                    </Button>
                                  </CardFooter>
                                </Card>
                              )
                            })}
                          </div>
                        )}
                      </CardContent>
                      {followingContent.length > 6 && (
                        <CardFooter>
                          <Button variant="outline" className="w-full">
                            View More
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold font-cinzel">Your Reviews</h2>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-cinzel">Reviews from Lenders</CardTitle>
                    <CardDescription>See what lenders are saying about you</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReviewSection
                      targetId={userData.id}
                      targetName={userData.name}
                      targetType="user"
                      currentUserId={userData.id}
                      currentUserName={userData.name}
                      currentUserAvatar={userData.avatar}
                      viewOnly={true}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-cinzel">Reviews You've Written</CardTitle>
                    <CardDescription>Reviews you've left for items and lenders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-4">
                      You haven't written any reviews yet. After renting items, you can leave reviews for the items and
                      lenders.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Browse Items</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Discover clothing items available for rent</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => router.push("/browse")}>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Now
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Your Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  You have {orderCount} {orderCount === 1 ? "order" : "orders"}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => router.push("/profile/orders")}>
                  <Package className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
              </CardFooter>
            </Card>

            {/* Logout Card */}
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Logout</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Sign out of your account</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
