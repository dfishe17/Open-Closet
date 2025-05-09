"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, Filter, ChevronDown, ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { getFollowing } from "@/lib/follow-system"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FollowingFeedProps {
  userId: string
  aestheticFilter: string | null
  categoryFilter: string | null
  sizeFilter: string | null
  brandFilter: string | null
  conditionFilter: string | null
  colorFilter: string | null
  priceFilter: string | null
  materialFilter: string | null
  sortOption: string
}

export function FollowingFeed({
  userId,
  aestheticFilter,
  categoryFilter,
  sizeFilter,
  brandFilter,
  conditionFilter,
  colorFilter,
  priceFilter,
  materialFilter,
  sortOption,
}: FollowingFeedProps) {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<any[]>([])
  const [followedUsers, setFollowedUsers] = useState<any[]>([])
  const [followedAesthetics, setFollowedAesthetics] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState(0)

  // Filter options
  const categories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Accessories", "Shoes"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"]
  const brands = ["Zara", "H&M", "Nike", "Adidas", "Gucci", "Prada", "Levi's", "Other"]
  const conditions = ["New with tags", "Like new", "Good", "Fair", "Worn"]
  const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Pink", "Brown", "Gray"]
  const priceRanges = ["Under $25", "$25-$50", "$50-$100", "$100-$200", "$200+"]
  const materials = ["Cotton", "Polyester", "Wool", "Silk", "Leather", "Denim", "Linen", "Cashmere"]
  const aesthetics = ["Minimalist", "Vintage", "Streetwear", "Bohemian", "Preppy", "Athleisure", "Cottagecore", "Y2K"]
  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Most Popular", value: "popular" },
    { label: "Top Rated", value: "rating" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call to get followed users and aesthetics
        const followingData = await getFollowing(userId)
        setFollowedUsers(followingData.users || [])
        setFollowedAesthetics(followingData.aesthetics || [])

        // Simulate API call to get items from followed users/aesthetics
        // In a real app, you would filter by the followed users and aesthetics
        setTimeout(() => {
          // Generate mock items
          const mockItems = Array.from({ length: 12 }, (_, i) => ({
            id: `item-${i}`,
            name: `Fashion Item ${i + 1}`,
            brand: brands[Math.floor(Math.random() * brands.length)],
            price: Math.floor(Math.random() * 200) + 20,
            rating: (Math.random() * 2 + 3).toFixed(1),
            size: sizes[Math.floor(Math.random() * sizes.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            material: materials[Math.floor(Math.random() * materials.length)],
            aesthetic: aesthetics[Math.floor(Math.random() * aesthetics.length)],
            image: `/placeholder.svg?height=400&width=300&text=Item ${i + 1}`,
            seller: {
              id: `user-${Math.floor(Math.random() * 5) + 1}`,
              name: `User ${Math.floor(Math.random() * 5) + 1}`,
              avatar: `/placeholder.svg?height=50&width=50&text=U${Math.floor(Math.random() * 5) + 1}`,
            },
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          }))

          setItems(mockItems)
          setLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error fetching following data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  // Apply filters
  useEffect(() => {
    let count = 0
    if (aestheticFilter) count++
    if (categoryFilter) count++
    if (sizeFilter) count++
    if (brandFilter) count++
    if (conditionFilter) count++
    if (colorFilter) count++
    if (priceFilter) count++
    if (materialFilter) count++
    setActiveFilters(count)
  }, [
    aestheticFilter,
    categoryFilter,
    sizeFilter,
    brandFilter,
    conditionFilter,
    colorFilter,
    priceFilter,
    materialFilter,
  ])

  // Filter the items based on selected filters
  const filteredItems = items.filter((item) => {
    if (aestheticFilter && item.aesthetic !== aestheticFilter) return false
    if (categoryFilter && item.category !== categoryFilter) return false
    if (sizeFilter && item.size !== sizeFilter) return false
    if (brandFilter && item.brand !== brandFilter) return false
    if (conditionFilter && item.condition !== conditionFilter) return false
    if (colorFilter && item.color !== colorFilter) return false
    if (materialFilter && item.material !== materialFilter) return false
    if (priceFilter) {
      const price = item.price
      if (priceFilter === "Under $25" && price >= 25) return false
      if (priceFilter === "$25-$50" && (price < 25 || price > 50)) return false
      if (priceFilter === "$50-$100" && (price < 50 || price > 100)) return false
      if (priceFilter === "$100-$200" && (price < 100 || price > 200)) return false
      if (priceFilter === "$200+" && price < 200) return false
    }
    return true
  })

  // Sort the filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case "price_asc":
        return a.price - b.price
      case "price_desc":
        return b.price - a.price
      case "popular":
        return Number.parseFloat(b.rating) - Number.parseFloat(a.rating)
      case "rating":
        return Number.parseFloat(b.rating) - Number.parseFloat(a.rating)
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  // Render loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Following Feed</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[3/4] relative">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Render empty state if no followed users or aesthetics
  if (followedUsers.length === 0 && followedAesthetics.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Your Following Feed is Empty</h2>
        <p className="text-muted-foreground mb-8">Follow users and aesthetics to see their items in your feed.</p>
        <Button>Discover Users to Follow</Button>
      </div>
    )
  }

  // Render empty state if no items match filters
  if (filteredItems.length === 0 && activeFilters > 0) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Following Feed</h2>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-16 z-10 bg-background py-2 border-b flex items-center gap-2 overflow-x-auto scrollbar-hide w-full -mx-4 px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs flex items-center gap-1">
                <Filter className="h-3 w-3" />
                All
                {activeFilters > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Clear Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Clear All Filters</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={aestheticFilter ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs flex items-center gap-1"
              >
                Style
                {aestheticFilter && <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Aesthetic</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-72">
                {aesthetics.map((aesthetic) => (
                  <DropdownMenuItem key={aesthetic}>{aesthetic}</DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={categoryFilter ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs flex items-center gap-1"
              >
                Category
                {categoryFilter && <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuItem key={category}>{category}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={sizeFilter ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs flex items-center gap-1"
              >
                Size
                {sizeFilter && <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Size</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sizes.map((size) => (
                <DropdownMenuItem key={size}>{size}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={brandFilter ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs flex items-center gap-1"
              >
                Brand
                {brandFilter && <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Brand</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-72">
                {brands.map((brand) => (
                  <DropdownMenuItem key={brand}>{brand}</DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={conditionFilter ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs flex items-center gap-1"
              >
                Condition
                {conditionFilter && <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Condition</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {conditions.map((condition) => (
                <DropdownMenuItem key={condition}>{condition}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={colorFilter ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs flex items-center gap-1"
              >
                Color
                {colorFilter && <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Color</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-72">
                {colors.map((color) => (
                  <DropdownMenuItem key={color}>{color}</DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={priceFilter ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs flex items-center gap-1"
              >
                Price
                {priceFilter && <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Price Range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {priceRanges.map((range) => (
                <DropdownMenuItem key={range}>{range}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={materialFilter ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs flex items-center gap-1"
              >
                Material
                {materialFilter && <ChevronDown className="h-3 w-3 ml-1" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Material</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-72">
                {materials.map((material) => (
                  <DropdownMenuItem key={material}>{material}</DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs flex items-center gap-1 ml-auto">
                <ArrowUpDown className="h-3 w-3 mr-1" />
                {sortOptions.find((option) => option.value === sortOption)?.label || "Sort"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuItem key={option.value}>{option.label}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">No Items Match Your Filters</h2>
          <p className="text-muted-foreground mb-8">Try adjusting your filters to see more items.</p>
          <Button>Clear All Filters</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Following Feed</h2>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-10 bg-background py-2 border-b flex items-center gap-2 overflow-x-auto scrollbar-hide w-full -mx-4 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs flex items-center gap-1">
              <Filter className="h-3 w-3" />
              All
              {activeFilters > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Clear Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Clear All Filters</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={aestheticFilter ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs flex items-center gap-1"
            >
              Style
              {aestheticFilter && <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Aesthetic</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-72">
              {aesthetics.map((aesthetic) => (
                <DropdownMenuItem key={aesthetic}>{aesthetic}</DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={categoryFilter ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs flex items-center gap-1"
            >
              Category
              {categoryFilter && <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuItem key={category}>{category}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={sizeFilter ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs flex items-center gap-1"
            >
              Size
              {sizeFilter && <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Size</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sizes.map((size) => (
              <DropdownMenuItem key={size}>{size}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={brandFilter ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs flex items-center gap-1"
            >
              Brand
              {brandFilter && <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Brand</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-72">
              {brands.map((brand) => (
                <DropdownMenuItem key={brand}>{brand}</DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={conditionFilter ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs flex items-center gap-1"
            >
              Condition
              {conditionFilter && <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Condition</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {conditions.map((condition) => (
              <DropdownMenuItem key={condition}>{condition}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={colorFilter ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs flex items-center gap-1"
            >
              Color
              {colorFilter && <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Color</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-72">
              {colors.map((color) => (
                <DropdownMenuItem key={color}>{color}</DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={priceFilter ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs flex items-center gap-1"
            >
              Price
              {priceFilter && <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Price Range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {priceRanges.map((range) => (
              <DropdownMenuItem key={range}>{range}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={materialFilter ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs flex items-center gap-1"
            >
              Material
              {materialFilter && <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Material</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-72">
              {materials.map((material) => (
                <DropdownMenuItem key={material}>{material}</DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs flex items-center gap-1 ml-auto">
              <ArrowUpDown className="h-3 w-3 mr-1" />
              {sortOptions.find((option) => option.value === sortOption)?.label || "Sort"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {sortOptions.map((option) => (
              <DropdownMenuItem key={option.value}>{option.label}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedItems.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-[3/4] bg-muted relative overflow-hidden">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-3 right-3 bg-background/80 hover:bg-background rounded-full h-8 w-8"
              >
                <Heart className="h-4 w-4" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={item.seller.avatar || "/placeholder.svg"}
                  alt={item.seller.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-sm text-muted-foreground">{item.seller.name}</span>
              </div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.brand}</p>
              <div className="mt-2 flex justify-between items-center">
                <p className="font-medium">${item.price}/day</p>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                  <span className="text-sm">{item.rating}</span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">
                  {item.size}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {item.aesthetic}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {item.color}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
