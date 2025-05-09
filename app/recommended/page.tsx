"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Search, Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RecommendedProfilesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")

  // Filter profiles based on search, category, and rating
  const filteredProfiles = recommendedProfiles.filter((profile) => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || profile.specialties.includes(selectedCategory)

    const matchesRating =
      selectedRating === "all" ||
      (selectedRating === "5" && profile.rating === 5) ||
      (selectedRating === "4+" && profile.rating >= 4) ||
      (selectedRating === "3+" && profile.rating >= 3)

    return matchesSearch && matchesCategory && matchesRating
  })

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recommended Profiles</h1>
          <p className="text-muted-foreground">Discover top-rated lenders with amazing collections</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search profiles..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* Filters */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Category</h4>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Dresses">Dresses</SelectItem>
                    <SelectItem value="Formal Wear">Formal Wear</SelectItem>
                    <SelectItem value="Vintage">Vintage</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Streetwear">Streetwear</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Rating</h4>
                <Select value={selectedRating} onValueChange={setSelectedRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars Only</SelectItem>
                    <SelectItem value="4+">4+ Stars</SelectItem>
                    <SelectItem value="3+">3+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Location</h4>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="new-york">New York</SelectItem>
                    <SelectItem value="los-angeles">Los Angeles</SelectItem>
                    <SelectItem value="chicago">Chicago</SelectItem>
                    <SelectItem value="miami">Miami</SelectItem>
                    <SelectItem value="san-francisco">San Francisco</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedRating("all")
                }}
              >
                Reset Filters
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Lenders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedProfiles.slice(0, 3).map((profile) => (
                <div key={profile.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{profile.name}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < profile.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                      <span className="text-xs ml-1 text-muted-foreground">({profile.reviewCount})</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Profiles Grid */}
        <div>
          <Tabs defaultValue="grid">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
              <Select defaultValue="recommended">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="rating-high">Rating: High to Low</SelectItem>
                  <SelectItem value="rating-low">Rating: Low to High</SelectItem>
                  <SelectItem value="items-high">Most Items</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="space-y-4">
                {filteredProfiles.map((profile) => (
                  <ProfileListItem key={profile.id} profile={profile} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No profiles match your filters</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedRating("all")
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileCard({ profile }) {
  const router = useRouter()

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative">
        <div className="aspect-[3/2] bg-muted">
          <img
            src={profile.coverImage || "/placeholder.svg?height=300&width=450"}
            alt={`${profile.name}'s collection`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center gap-3">
            <Avatar className="border-2 border-white">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-white">{profile.name}</h3>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < profile.rating ? "fill-primary text-primary" : "fill-muted text-white/50"
                    }`}
                  />
                ))}
                <span className="text-xs ml-1 text-white/80">({profile.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {profile.specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
          {profile.specialties.length > 3 && <Badge variant="outline">+{profile.specialties.length - 3} more</Badge>}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{profile.bio}</p>
        <div className="flex items-center justify-between text-sm">
          <span>{profile.itemCount} items</span>
          <span>{profile.location}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button className="flex-1" onClick={() => router.push(`/profile/${profile.id}`)}>
          View Profile
        </Button>
        <Button variant="outline" size="icon">
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">Message</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

function ProfileListItem({ profile }) {
  const router = useRouter()

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{profile.name}</h3>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < profile.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                  />
                ))}
                <span className="text-xs ml-1 text-muted-foreground">({profile.reviewCount})</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{profile.location}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.specialties.slice(0, 4).map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {profile.specialties.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{profile.specialties.length - 4} more
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{profile.bio}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm font-medium">{profile.itemCount} items</span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => router.push(`/profile/${profile.id}`)}>
                View Profile
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Message</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
  {
    id: "emma-rodriguez",
    name: "Emma Rodriguez",
    avatar: "/placeholder.svg?height=100&width=100&text=ER",
    coverImage: "/placeholder.svg?height=300&width=450&text=Emma's+Collection",
    bio: "Vintage fashion collector specializing in unique pieces from the 60s, 70s, and 80s. Each item tells a story and adds character to any outfit.",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviewCount: 98,
    itemCount: 52,
    specialties: ["Vintage", "Retro", "Bohemian", "Accessories"],
    featured: true,
  },
  {
    id: "david-kim",
    name: "David Kim",
    avatar: "/placeholder.svg?height=100&width=100&text=DK",
    coverImage: "/placeholder.svg?height=300&width=450&text=David's+Collection",
    bio: "Streetwear enthusiast with a collection of limited edition sneakers, designer hoodies, and urban fashion pieces. Stay ahead of the trends.",
    location: "Chicago, IL",
    rating: 4.7,
    reviewCount: 87,
    itemCount: 41,
    specialties: ["Streetwear", "Sneakers", "Urban", "Casual"],
  },
  {
    id: "olivia-wilson",
    name: "Olivia Wilson",
    avatar: "/placeholder.svg?height=100&width=100&text=OW",
    coverImage: "/placeholder.svg?height=300&width=450&text=Olivia's+Collection",
    bio: "Luxury accessories specialist offering high-end handbags, jewelry, and statement pieces to elevate any outfit. Perfect for special events.",
    location: "Miami, FL",
    rating: 5,
    reviewCount: 112,
    itemCount: 38,
    specialties: ["Accessories", "Handbags", "Jewelry", "Luxury"],
  },
  {
    id: "james-taylor",
    name: "James Taylor",
    avatar: "/placeholder.svg?height=100&width=100&text=JT",
    coverImage: "/placeholder.svg?height=300&width=450&text=James'+Collection",
    bio: "Formal wear expert specializing in tuxedos, suits, and evening attire. Make a statement at your next black-tie event or wedding.",
    location: "Boston, MA",
    rating: 4.9,
    reviewCount: 76,
    itemCount: 29,
    specialties: ["Formal Wear", "Tuxedos", "Suits", "Evening Attire"],
  },
  {
    id: "sophia-lee",
    name: "Sophia Lee",
    avatar: "/placeholder.svg?height=100&width=100&text=SL",
    coverImage: "/placeholder.svg?height=300&width=450&text=Sophia's+Collection",
    bio: "Fashion blogger with a curated collection of trendy pieces, statement outfits, and Instagram-worthy looks. Refresh your wardrobe with the latest styles.",
    location: "Seattle, WA",
    rating: 4.8,
    reviewCount: 92,
    itemCount: 45,
    specialties: ["Trendy", "Instagram", "Casual", "Statement Pieces"],
  },
  {
    id: "alex-martinez",
    name: "Alex Martinez",
    avatar: "/placeholder.svg?height=100&width=100&text=AM",
    coverImage: "/placeholder.svg?height=300&width=450&text=Alex's+Collection",
    bio: "Sustainable fashion advocate offering eco-friendly, ethically-made clothing and accessories. Look good while doing good for the planet.",
    location: "Portland, OR",
    rating: 4.7,
    reviewCount: 68,
    itemCount: 33,
    specialties: ["Sustainable", "Eco-Friendly", "Ethical", "Minimalist"],
  },
]
