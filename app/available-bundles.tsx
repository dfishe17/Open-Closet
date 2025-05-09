"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Item {
  id: string
  name: string
  media?: Array<{ url: string; type?: string }>
}

interface Bundle {
  id: string
  name: string
  description?: string
  aesthetic?: string
  size?: string
  suggestedPrice?: number
  createdAt: string
  items: Item[]
  ownerId?: string
  ownerName?: string
  isPublished?: boolean
}

export default function AvailableBundles() {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [filteredBundles, setFilteredBundles] = useState<Bundle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAesthetic, setFilterAesthetic] = useState("")
  const [filterSize, setFilterSize] = useState("")
  const [sortOption, setSortOption] = useState("newest")

  // Load bundles on component mount
  useEffect(() => {
    loadBundles()
  }, [])

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters()
  }, [bundles, searchQuery, filterAesthetic, filterSize, sortOption])

  const loadBundles = async () => {
    setIsLoading(true)
    try {
      // Get current user ID
      const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")

      // Get all bundles from localStorage
      const bundlesJson = localStorage.getItem("stylerent_bundles") || localStorage.getItem("opencloset_bundles")

      if (bundlesJson) {
        const allBundles = JSON.parse(bundlesJson)

        // Filter for published bundles not owned by current user
        const availableBundles = allBundles.filter((bundle) => bundle.isPublished && bundle.ownerId !== userId)

        console.log(`Loaded ${availableBundles.length} available bundles`)

        if (availableBundles.length === 0) {
          // Create demo bundles if none exist
          const demoBundles = createDemoBundles()
          setBundles(demoBundles)
        } else {
          setBundles(availableBundles)
        }
      } else {
        // No bundles in localStorage, create demo bundles
        const demoBundles = createDemoBundles()
        setBundles(demoBundles)
      }
    } catch (error) {
      console.error("Error loading bundles:", error)
      // Create demo bundles as fallback
      const demoBundles = createDemoBundles()
      setBundles(demoBundles)
    } finally {
      setIsLoading(false)
    }
  }

  const createDemoBundles = () => {
    console.log("Creating demo bundles")

    const demoBundles = [
      {
        id: "demo-bundle-1",
        name: "Summer Casual Collection",
        description: "Perfect for warm weather and casual outings",
        aesthetic: "Casual",
        size: "M",
        suggestedPrice: 25,
        createdAt: new Date().toISOString(),
        items: [
          { id: "demo-item-1", name: "Summer Dress" },
          { id: "demo-item-2", name: "Straw Hat" },
          { id: "demo-item-3", name: "Sandals" },
        ],
        ownerId: "demo-user-1",
        ownerName: "Style Expert",
        isPublished: true,
      },
      {
        id: "demo-bundle-2",
        name: "Formal Event Package",
        description: "Elegant attire for special occasions",
        aesthetic: "Formal",
        size: "S",
        suggestedPrice: 45,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        items: [
          { id: "demo-item-4", name: "Evening Gown" },
          { id: "demo-item-5", name: "Clutch Purse" },
          { id: "demo-item-6", name: "Heels" },
        ],
        ownerId: "demo-user-2",
        ownerName: "Fashion Forward",
        isPublished: true,
      },
      {
        id: "demo-bundle-3",
        name: "Vintage Inspired Collection",
        description: "Classic styles with a modern twist",
        aesthetic: "Vintage",
        size: "L",
        suggestedPrice: 35,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        items: [
          { id: "demo-item-7", name: "Retro Blouse" },
          { id: "demo-item-8", name: "High-Waisted Pants" },
          { id: "demo-item-9", name: "Vintage Accessories" },
        ],
        ownerId: "demo-user-3",
        ownerName: "Retro Rentals",
        isPublished: true,
      },
    ]

    // Save demo bundles to localStorage for future use
    try {
      const existingBundlesJson = localStorage.getItem("stylerent_bundles") || "[]"
      const existingBundles = JSON.parse(existingBundlesJson)

      // Add demo bundles to existing bundles
      const updatedBundles = [...existingBundles, ...demoBundles]

      localStorage.setItem("stylerent_bundles", JSON.stringify(updatedBundles))
      localStorage.setItem("opencloset_bundles", JSON.stringify(updatedBundles))
    } catch (error) {
      console.error("Error saving demo bundles:", error)
    }

    return demoBundles
  }

  const applyFilters = () => {
    let filtered = [...bundles]

    // Apply search query filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (bundle) =>
          bundle.name.toLowerCase().includes(query) ||
          (bundle.description && bundle.description.toLowerCase().includes(query)),
      )
    }

    // Apply aesthetic filter
    if (filterAesthetic !== "") {
      filtered = filtered.filter((bundle) => bundle.aesthetic === filterAesthetic)
    }

    // Apply size filter
    if (filterSize !== "") {
      filtered = filtered.filter((bundle) => bundle.size === filterSize)
    }

    // Apply sorting
    if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortOption === "price-low") {
      filtered.sort((a, b) => (a.suggestedPrice || 0) - (b.suggestedPrice || 0))
    } else if (sortOption === "price-high") {
      filtered.sort((a, b) => (b.suggestedPrice || 0) - (a.suggestedPrice || 0))
    } else if (sortOption === "items-count") {
      filtered.sort((a, b) => b.items.length - a.items.length)
    }

    setFilteredBundles(filtered)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-pulse h-6 w-48 bg-muted rounded mx-auto mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 space-y-4">
                <div className="animate-pulse h-5 w-3/4 bg-muted rounded"></div>
                <div className="animate-pulse h-4 w-full bg-muted rounded"></div>
                <div className="animate-pulse h-4 w-2/3 bg-muted rounded"></div>
                <div className="flex space-x-2">
                  <div className="animate-pulse h-6 w-16 bg-muted rounded"></div>
                  <div className="animate-pulse h-6 w-16 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-playfair">Available Bundles</h1>
        <p className="text-muted-foreground mt-1">Discover bundles created by other users</p>
      </div>

      <div className="grid gap-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search bundles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterAesthetic} onValueChange={setFilterAesthetic}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Aesthetic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Aesthetics</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Bohemian">Bohemian</SelectItem>
                <SelectItem value="Vintage">Vintage</SelectItem>
                <SelectItem value="Streetwear">Streetwear</SelectItem>
                <SelectItem value="Minimalist">Minimalist</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSize} onValueChange={setFilterSize}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="XS">XS</SelectItem>
                <SelectItem value="S">S</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="XL">XL</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="items-count">Most Items</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredBundles.length === 0 ? (
        <Card className="text-center p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-medium">No bundles available</h2>
            <p className="text-muted-foreground">
              There are no published bundles matching your criteria. Try adjusting your filters.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBundles.map((bundle) => (
            <Card key={bundle.id} className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-cinzel">{bundle.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {bundle.description && <p className="text-sm text-muted-foreground mb-3">{bundle.description}</p>}

                <div className="flex flex-wrap gap-2 mb-3">
                  {bundle.aesthetic && <Badge variant="secondary">{bundle.aesthetic}</Badge>}
                  {bundle.size && <Badge variant="outline">Size {bundle.size}</Badge>}
                </div>

                <div className="text-sm mb-3">
                  <p>
                    <span className="font-medium">Created by:</span> {bundle.ownerName || "User"}
                  </p>
                  {bundle.suggestedPrice && (
                    <p>
                      <span className="font-medium">Price:</span> ${bundle.suggestedPrice}/day
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Items:</span> {bundle.items.length}
                  </p>
                </div>

                <div className="flex -space-x-2 overflow-hidden mb-3">
                  {bundle.items.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="inline-block h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-muted"
                    >
                      <img
                        src={(item.media && item.media[0]?.url) || "/placeholder.svg?height=40&width=40"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  {bundle.items.length > 5 && (
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                      +{bundle.items.length - 5}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end">
                <Button size="sm" variant="secondary" asChild>
                  <Link href={`/bundles/${bundle.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
