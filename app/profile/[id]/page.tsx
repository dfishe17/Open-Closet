"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Filter, Heart, MapPin, Share, Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ReviewSection } from "@/components/review-section"
import { Search } from "lucide-react"
import { FollowButton } from "@/components/follow-button"
import { getFollowers, getFollowing } from "@/lib/follow-system"
import { Label } from "@/components/ui/label"

export default function ProfileDetailPage({ params }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("items")
  const [messageText, setMessageText] = useState("")
  const [showMessageForm, setShowMessageForm] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [showListItemForm, setShowListItemForm] = useState(false)

  // Find the profile based on the ID from the URL
  const profile = recommendedProfiles.find((p) => p.id === params.id)

  useEffect(() => {
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

      // Load follower and following counts
      if (profile) {
        const followers = getFollowers(profile.id)
        const following = getFollowing(profile.id)
        setFollowerCount(followers.length)
        setFollowingCount(following.length)
      }
    } catch (error) {
      console.error("Error getting user:", error)
    }
  }, [profile])

  useEffect(() => {
    const handleFollowsUpdated = () => {
      if (profile) {
        const followers = getFollowers(profile.id)
        const following = getFollowing(profile.id)
        setFollowerCount(followers.length)
        setFollowingCount(following.length)
      }
    }

    window.addEventListener("opencloset-follows-updated", handleFollowsUpdated as EventListener)

    return () => {
      window.removeEventListener("opencloset-follows-updated", handleFollowsUpdated as EventListener)
    }
  }, [profile])

  if (!profile) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <p className="text-muted-foreground mb-8">The profile you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/recommended">Back to Recommended Profiles</Link>
        </Button>
      </div>
    )
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!messageText.trim()) return

    toast.success(`Message sent to ${profile.name}`)
    setMessageText("")
    setShowMessageForm(false)
  }

  const handleListItemSubmit = (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(e.target)
    const name = formData.get("name")
    const designer = formData.get("designer")
    const description = formData.get("description")
    const category = formData.get("category")
    const size = formData.get("size")
    const condition = formData.get("condition")
    const color = formData.get("color")
    const basePrice = Number.parseFloat(formData.get("basePrice"))

    // Calculate pricing tiers
    const pricingTiers = {
      tier1: basePrice * 0.05, // Days 1-3: 5%
      tier2: basePrice * 0.04, // Days 4-7: 4%
      tier3: basePrice * 0.03, // Days 8-14: 3%
      tier4: basePrice * 0.02, // Days 15+: 2%
    }

    // Create new item
    const newItem = {
      id: `item-${Date.now()}`,
      name,
      designer,
      description,
      category,
      size,
      condition,
      color,
      basePrice,
      pricingTiers,
      status: "Available",
      forRent: true,
      forSale: false,
      media: [{ type: "image", url: "/placeholder.svg?height=400&width=300" }],
      images: ["/placeholder.svg?height=400&width=300"],
      userId: currentUser?.id || "demo-user",
      ownerId: currentUser?.id || "demo-user",
      listerId: currentUser?.id || "demo-user",
      createdAt: new Date().toISOString(),
      ownerName: currentUser?.name || "Demo User",
      ownerAvatar: currentUser?.avatar || "/placeholder.svg?height=40&width=40",
    }

    // Store in localStorage
    try {
      const existingItems = JSON.parse(localStorage.getItem("stylerent_items") || "[]")
      localStorage.setItem("stylerent_items", JSON.stringify([...existingItems, newItem]))

      // Notify listeners
      window.dispatchEvent(new Event("itemsUpdated"))

      toast.success("Item successfully listed!")
      setShowListItemForm(false)
    } catch (error) {
      console.error("Error listing item:", error)
      toast.error("Failed to list item. Please try again.")
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/recommended" className="flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Recommended Profiles
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {profile.featured && (
                    <div className="absolute bottom-4 right-0 bg-primary text-primary-foreground rounded-full p-1">
                      <Badge variant="secondary" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                        ✓
                      </Badge>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold font-serif">{profile.name}</h2>

                {profile.featured && <Badge className="mt-2 bg-primary/90 hover:bg-primary/90">Top Lender</Badge>}

                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(profile.rating) ? "fill-primary text-primary" : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm">
                    {profile.rating} ({profile.reviewCount} reviews)
                  </span>
                </div>

                <div className="flex items-center mt-4 space-x-4">
                  <div className="text-center">
                    <p className="font-bold">{followerCount}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{followingCount}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                </div>

                {currentUser && currentUser.id !== profile.id && (
                  <FollowButton currentUserId={currentUser.id} targetUserId={profile.id} className="w-full mt-4" />
                )}

                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile.location}</span>
                </div>

                <div className="w-full mt-6">
                  {/* Messages button removed */}
                  <Button variant="outline" className="w-full">
                    <Share className="mr-2 h-4 w-4" />
                    Share Profile
                  </Button>
                </div>

                {currentUser && currentUser.id === profile.id && (
                  <Button className="w-full mt-2" onClick={() => setShowListItemForm(!showListItemForm)}>
                    {showListItemForm ? "Cancel" : "List an Item"}
                  </Button>
                )}

                {showMessageForm && (
                  <div className="w-full mt-4 p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Send a Message</h4>
                    <form onSubmit={handleSendMessage}>
                      <Textarea
                        placeholder={`Message ${profile.name}...`}
                        className="mb-2"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" className="flex-1">
                          Send
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => setShowMessageForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {showListItemForm && currentUser && currentUser.id === profile.id && (
                  <div className="w-full mt-4 p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">List a New Item</h4>
                    <form onSubmit={handleListItemSubmit} className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="name">Item Name*</Label>
                        <Input id="name" name="name" placeholder="Vintage Denim Jacket" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="designer">Designer/Brand</Label>
                        <Input id="designer" name="designer" placeholder="Levi's, Gucci, etc." />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description*</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe your item..."
                          required
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category*</Label>
                          <Select name="category" defaultValue="Tops" required>
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Tops">Tops</SelectItem>
                              <SelectItem value="Bottoms">Bottoms</SelectItem>
                              <SelectItem value="Dresses">Dresses</SelectItem>
                              <SelectItem value="Outerwear">Outerwear</SelectItem>
                              <SelectItem value="Accessories">Accessories</SelectItem>
                              <SelectItem value="Shoes">Shoes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="size">Size*</Label>
                          <Select name="size" defaultValue="M" required>
                            <SelectTrigger id="size">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="XS">XS</SelectItem>
                              <SelectItem value="S">S</SelectItem>
                              <SelectItem value="M">M</SelectItem>
                              <SelectItem value="L">L</SelectItem>
                              <SelectItem value="XL">XL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="condition">Condition*</Label>
                          <Select name="condition" defaultValue="Like New" required>
                            <SelectTrigger id="condition">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="New with tags">New with tags</SelectItem>
                              <SelectItem value="Like New">Like New</SelectItem>
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Fair">Fair</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="color">Color</Label>
                          <Select name="color" defaultValue="Black">
                            <SelectTrigger id="color">
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Black">Black</SelectItem>
                              <SelectItem value="White">White</SelectItem>
                              <SelectItem value="Blue">Blue</SelectItem>
                              <SelectItem value="Red">Red</SelectItem>
                              <SelectItem value="Green">Green</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="basePrice">Base Price ($)*</Label>
                        <Input
                          id="basePrice"
                          name="basePrice"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          defaultValue="50"
                          required
                        />
                        <p className="text-xs text-muted-foreground">Set the base value of your item</p>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button type="submit" className="flex-1">
                          List Item
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowListItemForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-serif">About</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <p className="text-sm text-muted-foreground">{profile.bio}</p>

              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Items</span>
                      <span className="font-medium">{profile.itemCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response Rate</span>
                      <span className="font-medium">98%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response Time</span>
                      <span className="font-medium">Within 2 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="font-medium">March 2022</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="items">Items ({profile.itemCount})</TabsTrigger>
              <TabsTrigger value="bundles">Bundles</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            {/* Items Tab */}
            <TabsContent value="items" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search items..." className="pl-8" />
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="recommended">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="relative aspect-[3/4] bg-muted">
                      <img
                        src={item.image || "/placeholder.svg?height=400&width=300"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="sr-only">Add to wishlist</span>
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.designer}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="font-medium">${item.price}/day</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                          <span className="text-sm">{item.rating}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" asChild>
                        <Link href={`/items/${item.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Bundles Tab */}
            <TabsContent value="bundles" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileBundles.map((bundle) => (
                  <Card key={bundle.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="relative aspect-[16/9] bg-muted">
                      <img
                        src={bundle.image || "/placeholder.svg?height=300&width=500"}
                        alt={bundle.name}
                        className="object-cover w-full h-full"
                      />
                      {bundle.featured && (
                        <Badge className="absolute top-2 left-2 bg-primary/90 hover:bg-primary/90">
                          {bundle.featured}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{bundle.name}</h3>
                      <p className="text-sm text-muted-foreground">{bundle.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="font-medium">${bundle.price}/day</p>
                        <p className="text-sm text-muted-foreground">{bundle.itemCount} items</p>
                      </div>
                      <Button className="w-full mt-4" asChild>
                        <Link href={`/bundles/${bundle.id}`}>View Bundle</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              {currentUser && (
                <ReviewSection
                  targetId={profile.id}
                  targetName={profile.name}
                  targetType="user"
                  currentUserId={currentUser.id}
                  currentUserName={currentUser.name}
                  currentUserAvatar={currentUser.avatar}
                />
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">About {profile.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{profile.bio}</p>

                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Location</h3>
                    <p className="text-muted-foreground">{profile.location}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Member Since</h3>
                    <p className="text-muted-foreground">March 2022</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Sample data
const recommendedProfiles = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=100&width=100&text=SJ",
    coverImage: "/placeholder.svg?height=300&width=450&text=Sarah's+Collection",
    bio: "Fashion enthusiast sharing my premium designer collection. All items are carefully maintained and professionally cleaned between rentals.",
    location: "New York, NY",
    rating: 5,
    reviewCount: 167,
    itemCount: 48,
    specialties: ["Designer", "Dresses", "Formal Wear", "Vintage"],
    featured: true,
  },
  {
    id: "michael-chen",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=100&width=100&text=MC",
    coverImage: "/placeholder.svg?height=300&width=450&text=Michael's+Collection",
    bio: "Menswear specialist with a focus on high-quality suits, designer streetwear, and accessories. Perfect for business events and special occasions.",
    location: "San Francisco, CA",
    rating: 4.9,
    reviewCount: 124,
    itemCount: 36,
    specialties: ["Menswear", "Suits", "Streetwear", "Accessories"],
    featured: true,
  },
  // Other profiles from the previous file...
]

const profileItems = [
  {
    id: "item1",
    name: "Floral Summer Dress",
    designer: "Zimmermann",
    price: 45,
    retailPrice: 595,
    rating: 4.8,
    image: "/placeholder.svg?height=400&width=300&text=Floral+Dress",
  },
  {
    id: "item2",
    name: "Leather Jacket",
    designer: "AllSaints",
    price: 50,
    retailPrice: 450,
    rating: 4.7,
    image: "/placeholder.svg?height=400&width=300&text=Leather+Jacket",
  },
  {
    id: "item3",
    name: "Evening Gown",
    designer: "Marchesa",
    price: 75,
    retailPrice: 1200,
    rating: 4.9,
    image: "/placeholder.svg?height=400&width=300&text=Evening+Gown",
  },
  {
    id: "item4",
    name: "Silk Blouse",
    designer: "Equipment",
    price: 25,
    retailPrice: 280,
    rating: 4.6,
    image: "/placeholder.svg?height=400&width=300&text=Silk+Blouse",
  },
  {
    id: "item5",
    name: "Designer Jeans",
    designer: "Frame",
    price: 30,
    retailPrice: 250,
    rating: 4.5,
    image: "/placeholder.svg?height=400&width=300&text=Designer+Jeans",
  },
  {
    id: "item6",
    name: "Cashmere Sweater",
    designer: "Vince",
    price: 40,
    retailPrice: 320,
    rating: 4.7,
    image: "/placeholder.svg?height=400&width=300&text=Cashmere+Sweater",
  },
]

const profileBundles = [
  {
    id: "bundle1",
    name: "Weekend Getaway Bundle",
    description: "4 versatile pieces for your weekend trip",
    price: 120,
    itemCount: 4,
    featured: "Most Popular",
    image: "/placeholder.svg?height=300&width=500&text=Weekend+Bundle",
  },
  {
    id: "bundle2",
    name: "Office Chic Bundle",
    description: "Professional attire for work",
    price: 85,
    itemCount: 3,
    featured: "",
    image: "/placeholder.svg?height=300&width=500&text=Office+Bundle",
  },
  {
    id: "bundle3",
    name: "Date Night Bundle",
    description: "Make an impression",
    price: 75,
    itemCount: 2,
    featured: "",
    image: "/placeholder.svg?height=300&width=500&text=Date+Night+Bundle",
  },
  {
    id: "bundle4",
    name: "Wedding Guest Bundle",
    description: "Dress, accessories & more",
    price: 150,
    itemCount: 5,
    featured: "New",
    image: "/placeholder.svg?height=300&width=500&text=Wedding+Bundle",
  },
]

const profileReviews = [
  {
    id: "review1",
    user: {
      name: "Emily R.",
      avatar: "/placeholder.svg?height=40&width=40&text=ER",
    },
    item: "Silk Blouse",
    rating: 5,
    date: "3 days ago",
    comment:
      "The blouse was in perfect condition and exactly as described. Sarah was very responsive and made the whole rental process smooth!",
  },
  {
    id: "review2",
    user: {
      name: "Jessica T.",
      avatar: "/placeholder.svg?height=40&width=40&text=JT",
    },
    item: "Cocktail Dress",
    rating: 5,
    date: "1 week ago",
    comment:
      "Beautiful dress and excellent service. Sarah even provided styling tips for accessories. Would definitely rent from her again!",
  },
  {
    id: "review3",
    user: {
      name: "Michelle K.",
      avatar: "/placeholder.svg?height=40&width=40&text=MK",
    },
    item: "Designer Jeans",
    rating: 4,
    date: "2 weeks ago",
    comment:
      "Great jeans, good condition. Shipping was a bit delayed but Sarah kept me updated throughout the process.",
  },
  {
    id: "review4",
    user: {
      name: "David L.",
      avatar: "/placeholder.svg?height=40&width=40&text=DL",
    },
    item: "Leather Jacket",
    rating: 5,
    date: "3 weeks ago",
    comment:
      "Amazing jacket! Fit perfectly and looked brand new. Sarah was a pleasure to work with and shipping was fast.",
  },
  {
    id: "review5",
    user: {
      name: "Rachel S.",
      avatar: "/placeholder.svg?height=40&width=40&text=RS",
    },
    item: "Evening Gown",
    rating: 5,
    date: "1 month ago",
    comment:
      "The gown was absolutely stunning and fit like a dream. I received so many compliments at the event. Will definitely rent from Sarah again!",
  },
]
