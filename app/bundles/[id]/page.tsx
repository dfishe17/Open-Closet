"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Heart, MessageSquare, Share, Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ReviewSection } from "@/components/review-section"
import { FollowButton } from "@/components/follow-button"
import { useRouter } from "next/navigation"

export default function BundleDetailPage({ params }) {
  const [bundle, setBundle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Simulate fetching bundle data
    setTimeout(() => {
      setBundle({
        id: params.id,
        name: "Weekend Getaway Bundle",
        description:
          "Everything you need for a stylish weekend trip. This curated bundle includes versatile pieces that can be mixed and matched for various occasions.",
        price: 120,
        retailValue: 850,
        itemCount: 4,
        rating: 4.8,
        reviewCount: 12,
        owner: {
          id: "seller-123",
          name: "Sarah Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
          rating: 4.9,
        },
        items: [
          {
            id: "item1",
            name: "Casual Blazer",
            designer: "Theory",
            price: 40,
            image: "/placeholder.svg?height=300&width=225&text=Blazer",
          },
          {
            id: "item2",
            name: "Silk Blouse",
            designer: "Equipment",
            price: 25,
            image: "/placeholder.svg?height=300&width=225&text=Blouse",
          },
          {
            id: "item3",
            name: "Designer Jeans",
            designer: "Frame",
            price: 30,
            image: "/placeholder.svg?height=300&width=225&text=Jeans",
          },
          {
            id: "item4",
            name: "Leather Crossbody Bag",
            designer: "Coach",
            price: 25,
            image: "/placeholder.svg?height=300&width=225&text=Bag",
          },
        ],
        featured: "Most Popular",
        image: "/placeholder.svg?height=500&width=800&text=Weekend+Bundle",
        additionalImages: [
          "/placeholder.svg?height=500&width=800&text=Bundle+Image+1",
          "/placeholder.svg?height=500&width=800&text=Bundle+Image+2",
        ],
      })
      setIsLoading(false)
    }, 1000)

    // Get current user from localStorage
    try {
      const userJson = localStorage.getItem("stylerent_user")
      if (userJson) {
        setCurrentUser(JSON.parse(userJson))
      } else {
        // Mock user for demo purposes
        setCurrentUser({
          id: "user-123",
          name: "Jane Doe",
          avatar: "/placeholder.svg?height=40&width=40&text=JD",
          email: "jane@example.com",
        })
      }
    } catch (error) {
      console.error("Error getting user:", error)
    }
  }, [params.id])

  const handleAddToCart = () => {
    toast.success("Bundle added to cart!")
  }

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
  }

  const handleRentNow = () => {
    handleAddToCart()
    router.push("/checkout")
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-40 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[4/3] bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-24 bg-muted rounded mt-4"></div>
              <div className="h-10 bg-muted rounded w-full mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!bundle) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Bundle not found</h1>
        <p className="text-muted-foreground mt-2">The bundle you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="mt-4">
          <Link href="/bundles">Browse Bundles</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/bundles" className="flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Bundles
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Bundle Images */}
        <div>
          <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden mb-4">
            <img src={bundle.image || "/placeholder.svg"} alt={bundle.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {bundle.additionalImages?.map((image, index) => (
              <div key={index} className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${bundle.name} - View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bundle Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold font-serif">{bundle.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(bundle.rating) ? "fill-primary text-primary" : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm">
                {bundle.rating} ({bundle.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <div>
              <p className="text-2xl font-bold">${bundle.price}/day</p>
              <p className="text-sm text-muted-foreground">Retail Value: ${bundle.retailValue}</p>
            </div>
            <Badge variant="outline" className="ml-4">
              Save ${Math.round(((bundle.retailValue - bundle.price) / bundle.retailValue) * 100)}%
            </Badge>
          </div>

          <p className="text-muted-foreground">{bundle.description}</p>

          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Avatar>
              <AvatarImage src={bundle.owner?.avatar} alt={bundle.owner?.name} />
              <AvatarFallback>{bundle.owner?.name?.charAt(0) || "S"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Bundle by {bundle.owner?.name || "StyleRent Seller"}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                <span>{bundle.owner?.rating || "4.8"}</span>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <FollowButton userId={bundle.owner?.id || "seller-123"} />
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleRentNow}>
              Rent Now
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleWishlist}
              className={isWishlisted ? "text-primary" : ""}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-primary" : ""}`} />
              <span className="sr-only">Add to Wishlist</span>
            </Button>
            <Button variant="outline" size="icon">
              <Share className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="items">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="items">Included Items ({bundle.items?.length || 0})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="items" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bundle.items?.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-[3/4] bg-muted">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.designer}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="font-medium">${item.price}/day</p>
                    </div>
                    <Button className="w-full mt-4" variant="outline" asChild>
                      <Link href={`/items/${item.id}`}>View Item</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            {currentUser && (
              <ReviewSection
                targetId={bundle.id}
                targetName={bundle.name}
                targetType="product"
                currentUserId={currentUser.id}
                currentUserName={currentUser.name}
                currentUserAvatar={currentUser.avatar}
              />
            )}
          </TabsContent>
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Bundle Details</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Total Items: {bundle.itemCount}</li>
                      <li>Daily Rental Price: ${bundle.price}</li>
                      <li>Retail Value: ${bundle.retailValue}</li>
                      <li>Savings: ${bundle.retailValue - bundle.price} (compared to individual rentals)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Rental Information</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Minimum rental period: 3 days</li>
                      <li>All items are professionally cleaned before shipping</li>
                      <li>Free shipping and returns included</li>
                      <li>Insurance against minor damages included</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Styling Tips</h3>
                    <p className="text-muted-foreground">
                      This bundle was curated to provide maximum versatility. The pieces can be mixed and matched to
                      create multiple outfits suitable for different occasions during your weekend getaway.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold font-serif mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[4/3] bg-muted">
                <img
                  src={`/placeholder.svg?height=300&width=400&text=Similar+Bundle+${i}`}
                  alt={`Similar Bundle ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium">Similar Bundle {i}</h3>
                <p className="text-sm text-muted-foreground">4 items</p>
                <div className="mt-2 flex justify-between items-center">
                  <p className="font-medium">$95/day</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                    <span className="text-sm">4.7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
