"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { ListItemButton } from "@/components/list-item-button"
import { UserReviewsSection } from "@/components/user-reviews-section"
import type React from "react"

import {
  Calendar,
  Clock,
  Star,
  ShoppingBag,
  Package,
  CheckCircle2,
  Users,
  FileText,
  LayoutGrid,
  X,
  Sparkles,
  FolderPlus,
} from "lucide-react"
import { getOrdersByUserId, getOrdersAsLister } from "@/lib/storage-utils"
import { getUserItems } from "@/lib/item-utils"
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
import { Loader2 } from "lucide-react"
import { getUserFollowing, getFollowers } from "@/lib/follow-utils"

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userData, setUserData] = useState<any>(null)
  const [listedItems, setListedItems] = useState<any[]>([])
  const [bundles, setBundles] = useState<any[]>([])
  const [draftItems, setDraftItems] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])
  const [rentedItems, setRentedItems] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([])
  const [followers, setFollowers] = useState<any[]>([])
  const [followingContent, setFollowingContent] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)
  const [activeTab, setActiveTab] = useState("shop")
  const [activeShopTab, setActiveShopTab] = useState("all")
  const [activeRentalsTab, setActiveRentalsTab] = useState("active")
  const [activeTransactionsTab, setActiveTransactionsTab] = useState("current")
  const [currentRentals, setCurrentRentals] = useState<any[]>([])
  const [completedRentals, setCompletedRentals] = useState<any[]>([])
  const [activeRentedTab, setActiveRentedTab] = useState("active")
  const [currentlyRenting, setCurrentlyRenting] = useState<any[]>([])
  const [previouslyRented, setPreviouslyRented] = useState<any[]>([])
  const [totalSales, setTotalSales] = useState(0)
  const [totalItemsRented, setTotalItemsRented] = useState(0)

  // Popup state
  const [showFollowersPopup, setShowFollowersPopup] = useState(false)
  const [showFollowingPopup, setShowFollowingPopup] = useState(false)
  const [showRatingPopup, setShowRatingPopup] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState("")

  // Initialize tab state based on URL params - only run once on mount
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, []) // Empty dependency array to run only once on mount

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
  }, [router]) // Only depend on router, not searchParams

  // Separate useEffect for loading user content
  useEffect(() => {
    if (!userData) return

    // Get listed items
    try {
      // Use the getUserItems function to get user's items
      const userItems = getUserItems(userData.id)
      setListedItems(userItems)

      // For demo purposes, set some items as drafts
      const drafts = userItems
        .filter((item, index) => index % 5 === 0)
        .map((item) => ({
          ...item,
          status: "Draft",
        }))
      setDraftItems(drafts)
    } catch (error) {
      console.error("Error retrieving items:", error)
    }

    // Get bundles
    try {
      const storedBundles = localStorage.getItem("stylerent_bundles")
      if (storedBundles) {
        const allBundles = JSON.parse(storedBundles)
        // Filter bundles by the current user
        const userBundles = allBundles.filter((bundle) => bundle.ownerId === userData.id)
        setBundles(userBundles)
      }
    } catch (error) {
      console.error("Error retrieving bundles:", error)
    }

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

    // Get following data
    try {
      const userFollowing = getUserFollowing(userData.id)
      setFollowing(userFollowing)

      // Get followers
      const userFollowers = getFollowers(userData.id)
      setFollowers(userFollowers)
    } catch (error) {
      console.error("Error retrieving following/followers data:", error)
    }

    // Get orders for rentals
    try {
      // For items the user is renting from others
      const renterOrders = getOrdersByUserId(userData.id)

      // Split into current and completed rentals
      const current = renterOrders.filter((order) => order.status === "active" || order.status === "processing")
      const completedRenterOrders = renterOrders.filter(
        (order) => order.status === "completed" || order.status === "returned",
      )

      setCurrentlyRenting(current)
      setPreviouslyRented(completedRenterOrders)

      // For items others are renting from the user
      const listerOrders = getOrdersAsLister(userData.id)

      // Split into current and completed rentals
      const currentRentals = listerOrders.filter((order) => order.status === "active" || order.status === "processing")
      const completedRentals = listerOrders.filter(
        (order) => order.status === "completed" || order.status === "returned",
      )

      setCurrentRentals(currentRentals)
      setCompletedRentals(completedRentals)

      // Calculate total sales and items rented
      const allCompletedRentals = [...completedRentals]
      setTotalSales(allCompletedRentals.reduce((sum, order) => sum + (order.totalAmount || 0), 0))
      setTotalItemsRented(allCompletedRentals.reduce((sum, order) => sum + (order.items?.length || 0), 0))
    } catch (error) {
      console.error("Error retrieving rental data:", error)
    }

    // Listen for storage events to update the UI when items or bundles change
    const handleStorageChange = (e) => {
      if (e.key === "stylerent_items") {
        try {
          const userItems = getUserItems(userData.id)
          setListedItems(userItems)

          // For demo purposes, set some items as drafts
          const drafts = userItems
            .filter((item, index) => index % 5 === 0)
            .map((item) => ({
              ...item,
              status: "Draft",
            }))
          setDraftItems(drafts)
        } catch (error) {
          console.error("Error updating items:", error)
        }
      } else if (e.key === "stylerent_bundles") {
        try {
          const allBundles = JSON.parse(e.newValue)
          const userBundles = allBundles.filter((bundle) => bundle.ownerId === userData?.id)
          setBundles(userBundles)
        } catch (error) {
          console.error("Error updating bundles:", error)
        }
      } else if (e.key === "stylerent_wishlist") {
        try {
          const wishlistData = JSON.parse(e.newValue)
          const userWishlist = wishlistData.filter((item) => item.userId === userData?.id)
          setWishlist(userWishlist)
        } catch (error) {
          console.error("Error updating wishlist:", error)
        }
      } else if (e.key === "stylerent_following") {
        try {
          const userFollowing = getUserFollowing(userData.id)
          setFollowing(userFollowing)

          const userFollowers = getFollowers(userData.id)
          setFollowers(userFollowers)
        } catch (error) {
          console.error("Error updating following/followers:", error)
        }
      } else if (e.key === "orders") {
        // Update rental data when orders change
        try {
          const renterOrders = getOrdersByUserId(userData.id)
          const current = renterOrders.filter((order) => order.status === "active" || order.status === "processing")
          const completed = renterOrders.filter((order) => order.status === "completed" || order.status === "returned")

          setCurrentlyRenting(current)
          setPreviouslyRented(completed)

          const listerOrders = getOrdersAsLister(userData.id)
          const currentRentals = listerOrders.filter(
            (order) => order.status === "active" || order.status === "processing",
          )
          const completedRentals = listerOrders.filter(
            (order) => order.status === "completed" || order.status === "returned",
          )

          setCurrentRentals(currentRentals)
          setCompletedRentals(completedRentals)

          // Calculate total sales and items rented
          const allCompletedRentals = [...completedRentals]
          setTotalSales(allCompletedRentals.reduce((sum, order) => sum + (order.totalAmount || 0), 0))
          setTotalItemsRented(allCompletedRentals.reduce((sum, order) => sum + (order.items?.length || 0), 0))
        } catch (error) {
          console.error("Error updating rental data:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("itemsUpdated", handleStorageChange)
    window.addEventListener("bundlesUpdated", handleStorageChange)
    window.addEventListener("wishlistUpdated", handleStorageChange)
    window.addEventListener("followingUpdated", handleStorageChange)
    window.addEventListener("ordersUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("itemsUpdated", handleStorageChange)
      window.removeEventListener("bundlesUpdated", handleStorageChange)
      window.removeEventListener("wishlistUpdated", handleStorageChange)
      window.removeEventListener("followingUpdated", handleStorageChange)
      window.removeEventListener("ordersUpdated", handleStorageChange)
    }
  }, [userData])

  const deleteItem = (itemId) => {
    try {
      const storedItems = localStorage.getItem("stylerent_items")
      if (storedItems) {
        const allItems = JSON.parse(storedItems)
        const updatedItems = allItems.filter((item) => item.id !== itemId)
        localStorage.setItem("stylerent_items", JSON.stringify(updatedItems))

        // Update the state
        const userItems = getUserItems(userData?.id)
        setListedItems(userItems)

        // Dispatch an event to notify other components
        window.dispatchEvent(new Event("itemsUpdated"))

        toast.success("Item deleted successfully")
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Failed to delete item")
    }
  }

  const deleteBundle = (bundleId) => {
    try {
      const storedBundles = localStorage.getItem("stylerent_bundles")
      if (storedBundles) {
        const allBundles = JSON.parse(storedBundles)
        const updatedBundles = allBundles.filter((bundle) => bundle.id !== bundleId)
        localStorage.setItem("stylerent_bundles", JSON.stringify(updatedBundles))

        // Update the state
        const userBundles = updatedBundles.filter((bundle) => bundle.ownerId === userData?.id)
        setBundles(userBundles)

        // Dispatch an event to notify other components
        window.dispatchEvent(new Event("bundlesUpdated"))

        toast.success("Bundle deleted successfully")
      }
    } catch (error) {
      console.error("Error deleting bundle:", error)
      toast.error("Failed to delete bundle")
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create a new item object
      const newItem = {
        id: `item-${Date.now()}`,
        name,
        description,
        createdAt: new Date().toISOString(),
        ownerId: userData?.id || "unknown",
        status: "Available",
      }

      // Get existing items from localStorage
      const existingItemsJSON = localStorage.getItem("stylerent_items") || "[]"
      const existingItems = JSON.parse(existingItemsJSON)

      // Add new item
      const updatedItems = [...existingItems, newItem]

      // Save back to localStorage
      localStorage.setItem("stylerent_items", JSON.stringify(updatedItems))

      setResponse(JSON.stringify(newItem, null, 2))

      // Reset form
      setName("")
      setDescription("")

      // Show success message
      alert("Item created successfully!")
    } catch (error) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to get user details
  const getUserDetails = (userId) => {
    const storedUsers = localStorage.getItem("stylerent_users")
    if (storedUsers) {
      const allUsers = JSON.parse(storedUsers)
      return allUsers.find((user) => user.id === userId) || null
    }
    return null
  }

  if (!isClient || !userData) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-serif">My Shop</h1>
            <p className="text-muted-foreground">Manage your items, rentals, and account</p>
          </div>
          <div className="flex gap-4">
            <ListItemButton />
            <Button asChild variant="outline">
              <Link href="/profile/create-bundle">Create Bundle</Link>
            </Button>
          </div>
        </div>

        {/* User Info Card with Reviews */}
        <div className="grid grid-cols-1 gap-6">
          {/* User Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left side - User info */}
                <div className="flex flex-col items-center text-center md:w-1/3">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold font-serif">{userData.name}</h2>
                  <p className="text-sm text-muted-foreground mb-2">{userData.email}</p>

                  {/* Compact Social Stats - Followers and Following row */}
                  <div className="flex justify-between w-full mt-2 mb-2">
                    <div
                      className="flex flex-col items-center cursor-pointer hover:opacity-80"
                      onClick={() => setShowFollowersPopup(true)}
                    >
                      <span className="text-lg font-bold">{followers.length}</span>
                      <span className="text-xs text-muted-foreground">Followers</span>
                    </div>
                    <div
                      className="flex flex-col items-center cursor-pointer hover:opacity-80"
                      onClick={() => setShowFollowingPopup(true)}
                    >
                      <span className="text-lg font-bold">{following.length}</span>
                      <span className="text-xs text-muted-foreground">Following</span>
                    </div>
                  </div>

                  {/* Rating in a separate row */}
                  <div
                    className="flex justify-center w-full mt-2 mb-4 cursor-pointer hover:opacity-80"
                    onClick={() => setShowRatingPopup(true)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center">
                        <span className="text-lg font-bold mr-1">
                          {userData.rating ? userData.rating.toFixed(1) : "N/A"}
                        </span>
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                      <span className="text-xs text-muted-foreground">Rating</span>
                    </div>
                  </div>

                  {/* Settings link - replacing logout and messages buttons */}
                  <div className="w-full mt-6 space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/profile/settings">Account Settings</Link>
                    </Button>
                  </div>
                </div>

                {/* Right side - Items and Bundles */}
                <div className="md:w-2/3 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6 mt-6 md:mt-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">My Closet</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => setShowFollowersPopup(true)}
                      >
                        <span>{followers.length} followers</span>
                      </div>
                      <span>•</span>
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => setShowFollowingPopup(true)}
                      >
                        <span>{following.length} following</span>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="items" className="w-full">
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="items" className="flex-1">
                        Items ({listedItems.length})
                      </TabsTrigger>
                      <TabsTrigger value="bundles" className="flex-1">
                        Bundles ({bundles.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="items">
                      {listedItems.length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {listedItems.slice(0, 6).map((item) => (
                              <Link href={`/items/${item.id}`} key={item.id} className="block group">
                                <div className="aspect-square rounded-md overflow-hidden bg-muted relative">
                                  {item.media && item.media[0] ? (
                                    <img
                                      src={item.media[0].url || "/placeholder.svg"}
                                      alt={item.name}
                                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                      <Package className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                    <p className="text-xs text-white font-medium truncate">{item.name}</p>
                                    <p className="text-xs text-white/80">${item.rentalPrice}/day</p>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                          {listedItems.length > 6 && (
                            <div className="mt-4 text-center">
                              <Button variant="outline" size="sm" asChild>
                                <Link href="/profile?tab=listings">View All Items</Link>
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 bg-muted/30 rounded-lg">
                          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No items listed yet</p>
                          <Button className="mt-4" size="sm" asChild>
                            <Link href="/list-item">List Your First Item</Link>
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="bundles">
                      {bundles.length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            {bundles.slice(0, 4).map((bundle) => (
                              <Link href={`/bundles/${bundle.id}`} key={bundle.id} className="block group">
                                <div className="aspect-video rounded-md overflow-hidden bg-muted relative">
                                  {bundle.image ? (
                                    <img
                                      src={bundle.image || "/placeholder.svg"}
                                      alt={bundle.title}
                                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                      <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                    <p className="text-xs text-white font-medium truncate">{bundle.title}</p>
                                    <div className="flex justify-between">
                                      <p className="text-xs text-white/80">${bundle.price}/day</p>
                                      <p className="text-xs text-white/80">{bundle.items?.length || 0} items</p>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                          {bundles.length > 4 && (
                            <div className="mt-4 text-center">
                              <Button variant="outline" size="sm" asChild>
                                <Link href="/profile?tab=shop&shopTab=bundles">View All Bundles</Link>
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 bg-muted/30 rounded-lg">
                          <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No bundles created yet</p>
                          <Button className="mt-4" size="sm" asChild>
                            <Link href="/profile/create-bundle">Create Your First Bundle</Link>
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  {/* Reviews section - now below items and bundles */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-medium mb-4">Reviews</h3>
                    <UserReviewsSection userId={userData.id} userName={userData.name} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="shop" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="rented">Rented Items</TabsTrigger>
            <TabsTrigger value="rentals">My Rentals</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* SHOP TAB */}
          <TabsContent value="shop" className="space-y-6">
            {/* Shop Profile Summary */}
            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Shop Stats */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Shop Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold">{listedItems.length}</p>
                        <p className="text-sm text-muted-foreground">Listed Items</p>
                      </div>
                      <div className="bg-background p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold">{bundles.length}</p>
                        <p className="text-sm text-muted-foreground">Bundles</p>
                      </div>
                      <div className="bg-background p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold">${totalSales.toFixed(0)}</p>
                        <p className="text-sm text-muted-foreground">Total Sales</p>
                      </div>
                      <div className="bg-background p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold">{totalItemsRented}</p>
                        <p className="text-sm text-muted-foreground">Items Rented</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Stats */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Social</h3>
                    <div className="bg-background p-4 rounded-lg">
                      <div className="flex justify-between mb-4">
                        <div
                          className="text-center cursor-pointer hover:opacity-80"
                          onClick={() => setShowFollowersPopup(true)}
                        >
                          <p className="text-2xl font-bold">{followers.length}</p>
                          <p className="text-sm text-muted-foreground">Followers</p>
                        </div>
                        <div
                          className="text-center cursor-pointer hover:opacity-80"
                          onClick={() => setShowFollowingPopup(true)}
                        >
                          <p className="text-2xl font-bold">{following.length}</p>
                          <p className="text-sm text-muted-foreground">Following</p>
                        </div>
                      </div>
                      <div
                        className="flex items-center justify-center cursor-pointer hover:opacity-80"
                        onClick={() => setShowRatingPopup(true)}
                      >
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <p className="text-2xl font-bold mr-1">
                              {userData.rating ? userData.rating.toFixed(1) : "N/A"}
                            </p>
                            <Star className="h-5 w-5 text-yellow-500" />
                          </div>
                          <p className="text-sm text-muted-foreground">Rating</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button className="w-full" asChild>
                        <Link href="/list-item">
                          <Package className="mr-2 h-4 w-4" />
                          List New Item
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/profile/create-bundle">
                          <FolderPlus className="mr-2 h-4 w-4" />
                          Create Bundle
                        </Link>
                      </Button>
                      <Button variant="secondary" className="w-full" asChild>
                        <Link href="/profile/settings">
                          <Users className="mr-2 h-4 w-4" />
                          Manage Shop Settings
                        </Link>
                      </Button>
                      <Button variant="secondary" className="w-full" asChild>
                        <Link href="/shop-rentals">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          My Shop's Rentals
                        </Link>
                      </Button>
                      <Button variant="secondary" className="w-full" asChild>
                        <Link href="/profile/aesthetics">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Manage Style Preferences
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shop Items Tabs */}
            <Tabs defaultValue="all" value={activeShopTab} onValueChange={setActiveShopTab}>
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="all" className="flex items-center gap-1">
                  <LayoutGrid className="h-4 w-4" />
                  <span>All</span>
                </TabsTrigger>
                <TabsTrigger value="items" className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>Items</span>
                </TabsTrigger>
                <TabsTrigger value="bundles" className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Bundles</span>
                </TabsTrigger>
                <TabsTrigger value="drafts" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Drafts</span>
                </TabsTrigger>
              </TabsList>

              {/* All Items Tab */}
              <TabsContent value="all" className="space-y-6 mt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">All Listed Items</h2>
                  <ListItemButton />
                </div>

                {listedItems.length === 0 && bundles.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">You haven't listed any items or bundles yet.</p>
                      <ListItemButton>List Your First Item</ListItemButton>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listedItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="aspect-[4/3] relative">
                          {item.media && item.media[0] ? (
                            <img
                              src={item.media[0].url || "/placeholder.svg"}
                              alt={item.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <p className="text-muted-foreground">No image</p>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge variant={item.status === "Available" ? "default" : "secondary"}>
                              {item.status || "Available"}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.designer}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="font-medium">${item.rentalPrice}/day</p>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex gap-2">
                          <Button variant="outline" className="flex-1" asChild>
                            <Link href={`/items/${item.id}`}>View</Link>
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
                                <AlertDialogTitle>Delete Item</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this item? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteItem(item.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardFooter>
                      </Card>
                    ))}

                    {bundles.map((bundle) => (
                      <Card key={bundle.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          {bundle.image ? (
                            <img
                              src={bundle.image || "/placeholder.svg"}
                              alt={bundle.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <p className="text-muted-foreground">No image</p>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{bundle.title}</h3>
                          <p className="text-sm text-muted-foreground">{bundle.description}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="font-medium">${bundle.price}/day</p>
                            <p className="text-sm text-muted-foreground">{bundle.items?.length || 0} items</p>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex gap-2">
                          <Button variant="outline" className="flex-1" asChild>
                            <Link href={`/bundles/${bundle.id}`}>View</Link>
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
                                <AlertDialogTitle>Delete Bundle</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this bundle? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteBundle(bundle.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Individual Items Tab */}
              <TabsContent value="items" className="space-y-6 mt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Listed Items</h2>
                  <ListItemButton />
                </div>

                {listedItems.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">You haven't listed any items yet.</p>
                      <ListItemButton>List Your First Item</ListItemButton>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listedItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="aspect-[4/3] relative">
                          {item.media && item.media[0] ? (
                            <img
                              src={item.media[0].url || "/placeholder.svg"}
                              alt={item.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <p className="text-muted-foreground">No image</p>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge variant={item.status === "Available" ? "default" : "secondary"}>
                              {item.status || "Available"}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.designer}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="font-medium">${item.rentalPrice}/day</p>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex gap-2">
                          <Button variant="outline" className="flex-1" asChild>
                            <Link href={`/items/${item.id}`}>View</Link>
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
                                <AlertDialogTitle>Delete Item</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this item? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteItem(item.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Bundles Tab */}
              <TabsContent value="bundles" className="space-y-6 mt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Bundles</h2>
                  <Button asChild>
                    <Link href="/bundles">
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Manage Bundles
                    </Link>
                  </Button>
                </div>

                {bundles.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">You haven't created any bundles yet.</p>
                      <Button asChild>
                        <Link href="/bundles">Create Your First Bundle</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bundles.map((bundle) => (
                      <Card key={bundle.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          {bundle.image ? (
                            <img
                              src={bundle.image || "/placeholder.svg"}
                              alt={bundle.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <p className="text-muted-foreground">No image</p>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{bundle.title}</h3>
                          <p className="text-sm text-muted-foreground">{bundle.description}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="font-medium">${bundle.price}/day</p>
                            <p className="text-sm text-muted-foreground">{bundle.items?.length || 0} items</p>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex gap-2">
                          <Button variant="outline" className="flex-1" asChild>
                            <Link href={`/bundles/${bundle.id}`}>View</Link>
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
                                <AlertDialogTitle>Delete Bundle</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this bundle? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteBundle(bundle.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Drafts Tab */}
              <TabsContent value="drafts" className="space-y-6 mt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Your Draft Items</h2>
                  <ListItemButton />
                </div>

                {draftItems.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">You don't have any draft items.</p>
                      <ListItemButton>Create a New Item</ListItemButton>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {draftItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="aspect-[4/3] relative">
                          {item.media && item.media[0] ? (
                            <img
                              src={item.media[0].url || "/placeholder.svg"}
                              alt={item.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <p className="text-muted-foreground">No image</p>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary">Draft</Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.designer}</p>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="font-medium">${item.rentalPrice}/day</p>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex gap-2">
                          <Button variant="outline" className="flex-1" asChild>
                            <Link href={`/items/${item.id}/edit`}>Edit</Link>
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
                                <AlertDialogTitle>Delete Draft</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this draft? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteItem(item.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* My Listings Tab */}
          <TabsContent value="listings">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">My Listings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listedItems.length === 0 ? (
                  <Card className="col-span-full">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">You haven't listed any items yet.</p>
                      <ListItemButton>List Your First Item</ListItemButton>
                    </CardContent>
                  </Card>
                ) : (
                  listedItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-[4/3] relative">
                        {item.media && item.media[0] ? (
                          <img
                            src={item.media[0].url || "/placeholder.svg"}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">No image</p>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant={item.status === "Available" ? "default" : "secondary"}>
                            {item.status || "Available"}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.designer}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <p className="font-medium">${item.rentalPrice}/day</p>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button variant="outline" className="flex-1" asChild>
                          <Link href={`/items/${item.id}`}>View</Link>
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
                              <AlertDialogTitle>Delete Item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this item? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteItem(item.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rented">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Items You've Rented</h2>
              {/* Rented items content would go here */}
            </div>
          </TabsContent>

          <TabsContent value="rentals">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Rentals</h2>
                <Button asChild variant="outline">
                  <Link href="/my-rentals">
                    <Package className="h-4 w-4 mr-2" />
                    View All Rentals
                  </Link>
                </Button>
              </div>

              <Tabs defaultValue="active">
                <TabsList className="w-full md:w-auto">
                  <TabsTrigger value="active" className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span>Active</span>
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Upcoming</span>
                  </TabsTrigger>
                  <TabsTrigger value="past" className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Past</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentlyRenting.length > 0 ? (
                      currentlyRenting.slice(0, 2).map((rental) => (
                        <Card key={rental.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex gap-3">
                              <div className="w-20 h-20 bg-muted rounded-md overflow-hidden">
                                {rental.items && rental.items[0] && (
                                  <img
                                    src={rental.items[0].image || "/placeholder.svg"}
                                    alt={rental.items[0].name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{rental.items?.[0]?.name || "Item"}</h4>
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Active
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Return by: {new Date(rental.endDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="bg-gray-50 p-3 flex justify-end">
                            <Button asChild size="sm" variant="ghost">
                              <Link href={`/my-rentals?tab=active`}>View Details</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <Card className="col-span-full">
                        <CardContent className="p-6 text-center">
                          <p className="text-muted-foreground">You don't have any active rentals.</p>
                          <Button asChild className="mt-4">
                            <Link href="/browse">Browse Items</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  {currentlyRenting.length > 2 && (
                    <div className="mt-4 text-center">
                      <Button asChild variant="outline">
                        <Link href="/my-rentals?tab=active">View All Active Rentals</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upcoming" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Similar structure to active rentals but with upcoming rentals */}
                    {/* For brevity, I'm not including the full implementation */}
                    <Card className="col-span-full">
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">View your upcoming rentals in the My Rentals page.</p>
                        <Button asChild className="mt-4">
                          <Link href="/my-rentals?tab=upcoming">View Upcoming Rentals</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="past" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Similar structure to active rentals but with past rentals */}
                    {/* For brevity, I'm not including the full implementation */}
                    <Card className="col-span-full">
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">View your rental history in the My Rentals page.</p>
                        <Button asChild className="mt-4">
                          <Link href="/my-rentals?tab=past">View Rental History</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your Reviews</h2>
              {/* Reviews content would go here */}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Followers Popup */}
      {showFollowersPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Followers ({followers.length})</h3>
              <button
                onClick={() => setShowFollowersPopup(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginTop: "16px" }}>
              {followers.length > 0 ? (
                followers.map((follower) => {
                  // Get user details
                  const userDetails = getUserDetails(follower.followerId)

                  return userDetails ? (
                    <div
                      key={follower.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          marginRight: "12px",
                        }}
                      >
                        <img
                          src={userDetails.avatar || "/placeholder.svg"}
                          alt={userDetails.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: "bold" }}>{userDetails.name}</div>
                        <div style={{ fontSize: "0.875rem", color: "#666" }}>{userDetails.email}</div>
                      </div>
                    </div>
                  ) : null
                })
              ) : (
                <p style={{ textAlign: "center", color: "#666" }}>No followers yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Popup */}
      {showFollowingPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Following ({following.length})</h3>
              <button
                onClick={() => setShowFollowingPopup(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginTop: "16px" }}>
              {following.length > 0 ? (
                following.map((follow) => {
                  // Get user details
                  const userDetails = getUserDetails(follow.followedId)

                  return userDetails ? (
                    <div
                      key={follow.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          marginRight: "12px",
                        }}
                      >
                        <img
                          src={userDetails.avatar || "/placeholder.svg"}
                          alt={userDetails.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: "bold" }}>{userDetails.name}</div>
                        <div style={{ fontSize: "0.875rem", color: "#666" }}>{userDetails.email}</div>
                      </div>
                      <button
                        onClick={() => unfollowUser(userDetails.id)}
                        style={{
                          marginLeft: "auto",
                          padding: "4px 12px",
                          backgroundColor: "#f9f9f9",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Unfollow
                      </button>
                    </div>
                  ) : null
                })
              ) : (
                <p style={{ textAlign: "center", color: "#666" }}>Not following anyone yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rating Popup */}
      {showRatingPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Rating Details</h3>
              <button
                onClick={() => setShowRatingPopup(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <div
                style={{
                  fontSize: "3rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                <span>{userData.rating ? userData.rating.toFixed(1) : "N/A"}</span>
                <Star size={42} style={{ color: "#f59e0b", marginLeft: "8px" }} />
              </div>

              <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: "24px" }}>
                Based on {userData.totalReviews || 0} reviews
              </p>

              <div style={{ marginTop: "24px" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "12px" }}>Rating Breakdown</h4>

                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ width: "24px" }}>5</span>
                  <Star size={16} style={{ color: "#f59e0b", marginRight: "8px" }} />
                  <div
                    style={{
                      flex: 1,
                      height: "8px",
                      backgroundColor: "#eee",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "70%",
                        height: "100%",
                        backgroundColor: "#f59e0b",
                      }}
                    ></div>
                  </div>
                  <span style={{ marginLeft: "8px" }}>70%</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ width: "24px" }}>4</span>
                  <Star size={16} style={{ color: "#f59e0b", marginRight: "8px" }} />
                  <div
                    style={{
                      flex: 1,
                      height: "8px",
                      backgroundColor: "#eee",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "20%",
                        height: "100%",
                        backgroundColor: "#f59e0b",
                      }}
                    ></div>
                  </div>
                  <span style={{ marginLeft: "8px" }}>20%</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ width: "24px" }}>3</span>
                  <Star size={16} style={{ color: "#f59e0b", marginRight: "8px" }} />
                  <div
                    style={{
                      flex: 1,
                      height: "8px",
                      backgroundColor: "#eee",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "5%",
                        height: "100%",
                        backgroundColor: "#f59e0b",
                      }}
                    ></div>
                  </div>
                  <span style={{ marginLeft: "8px" }}>5%</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ width: "24px" }}>2</span>
                  <Star size={16} style={{ color: "#f59e0b", marginRight: "8px" }} />
                  <div
                    style={{
                      flex: 1,
                      height: "8px",
                      backgroundColor: "#eee",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "3%",
                        height: "100%",
                        backgroundColor: "#f59e0b",
                      }}
                    ></div>
                  </div>
                  <span style={{ marginLeft: "8px" }}>3%</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ width: "24px" }}>1</span>
                  <Star size={16} style={{ color: "#f59e0b", marginRight: "8px" }} />
                  <div
                    style={{
                      flex: 1,
                      height: "8px",
                      backgroundColor: "#eee",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "2%",
                        height: "100%",
                        backgroundColor: "#f59e0b",
                      }}
                    ></div>
                  </div>
                  <span style={{ marginLeft: "8px" }}>2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
