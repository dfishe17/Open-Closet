"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Star, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getAllItems } from "@/lib/item-utils"
import { DebugItems } from "@/components/debug-items"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SharedFilterBar } from "@/components/shared-filter-bar"

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const aestheticQuery = searchParams.get("aesthetic") || ""
  const designerQuery = searchParams.get("designer") || ""
  const categoryQuery = searchParams.get("category") || ""
  const sizeQuery = searchParams.get("size") || ""
  const brandQuery = searchParams.get("brand") || ""
  const conditionQuery = searchParams.get("condition") || ""
  const colorQuery = searchParams.get("color") || ""
  const priceQuery = searchParams.get("price") || ""
  const materialQuery = searchParams.get("material") || ""
  const sortQuery = searchParams.get("sort") || "newest"

  const [price, setPrice] = useState<number[]>([20, 80])
  const [allItems, setAllItems] = useState([])
  const [allBundles, setAllBundles] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [filteredBundles, setFilteredBundles] = useState([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedAesthetics, setSelectedAesthetics] = useState<string[]>([])
  const [selectedDesigners, setSelectedDesigners] = useState<string[]>([])
  const [refreshKey, setRefreshKey] = useState(0) // Use a key to force refresh
  const [showDebug, setShowDebug] = useState(false) // Toggle debug panel
  const [activeTab, setActiveTab] = useState("items")

  // Load all items (user-created + test items)
  useEffect(() => {
    const loadItems = () => {
      try {
        // Use our utility function to get all items
        const combinedItems = getAllItems()
        console.log("Loaded items:", combinedItems.length)
        setAllItems(combinedItems)
      } catch (error) {
        console.error("Error loading items:", error)
      }
    }

    const loadBundles = () => {
      try {
        const storedBundles = localStorage.getItem("stylerent_bundles") || localStorage.getItem("opencloset_bundles")
        if (storedBundles) {
          const parsedBundles = JSON.parse(storedBundles)
          // Only show published bundles
          const publishedBundles = parsedBundles.filter((bundle) => bundle.isPublished)
          setAllBundles(publishedBundles)
          console.log("Loaded bundles:", publishedBundles.length)
        } else {
          setAllBundles([])
        }
      } catch (error) {
        console.error("Error loading bundles:", error)
        setAllBundles([])
      }
    }

    loadItems()
    loadBundles()

    // Set up event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "stylerent_items" || e.key === "opencloset_items") {
        console.log("Storage event detected, reloading items")
        loadItems()
      }
      if (e.key === "stylerent_bundles" || e.key === "opencloset_bundles") {
        console.log("Storage event detected, reloading bundles")
        loadBundles()
      }
    }

    // Listen for our custom events
    const handleItemsUpdated = () => {
      console.log("Items updated event detected, reloading items")
      loadItems()
    }

    const handleBundlesUpdated = () => {
      console.log("Bundles updated event detected, reloading bundles")
      loadBundles()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("itemsUpdated", handleItemsUpdated)
    window.addEventListener("bundlesUpdated", handleBundlesUpdated)

    // Check for changes periodically (for same-tab updates)
    const intervalId = setInterval(() => {
      loadItems()
      loadBundles()
    }, 3000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("itemsUpdated", handleItemsUpdated)
      window.removeEventListener("bundlesUpdated", handleBundlesUpdated)
      clearInterval(intervalId)
    }
  }, [refreshKey])

  // Initialize selected sizes from URL
  useEffect(() => {
    if (sizeQuery) {
      setSelectedSizes([sizeQuery])
    } else {
      setSelectedSizes([])
    }
  }, [sizeQuery])

  // Initialize selected aesthetics from URL
  useEffect(() => {
    if (aestheticQuery) {
      setSelectedAesthetics([aestheticQuery])
    } else {
      setSelectedAesthetics([])
    }
  }, [aestheticQuery])

  // Filter items based on search query and filters
  useEffect(() => {
    let filtered = [...allItems]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(query)) ||
          (item.designer && item.designer.toLowerCase().includes(query)) ||
          (item.aesthetic && item.aesthetic.toLowerCase().includes(query)) ||
          (item.category && item.category.toLowerCase().includes(query)) ||
          (item.description && item.description.toLowerCase().includes(query)),
      )
    }

    // Apply aesthetic filter from URL
    if (aestheticQuery) {
      filtered = filtered.filter(
        (item) => item.aesthetic && item.aesthetic.toLowerCase() === aestheticQuery.toLowerCase(),
      )
    }

    // Apply designer filter from URL
    if (designerQuery) {
      filtered = filtered.filter((item) => item.designer && item.designer.toLowerCase() === designerQuery.toLowerCase())
    }

    // Apply category filter from URL
    if (categoryQuery) {
      filtered = filtered.filter((item) => item.category && item.category.toLowerCase() === categoryQuery.toLowerCase())
    }

    // Apply size filter from URL
    if (sizeQuery) {
      filtered = filtered.filter((item) => item.size && item.size.toLowerCase() === sizeQuery.toLowerCase())
    }

    // Apply brand filter from URL
    if (brandQuery) {
      filtered = filtered.filter((item) => item.designer && item.designer.toLowerCase() === brandQuery.toLowerCase())
    }

    // Apply condition filter from URL
    if (conditionQuery) {
      filtered = filtered.filter(
        (item) => item.condition && item.condition.toLowerCase() === conditionQuery.toLowerCase(),
      )
    }

    // Apply color filter from URL
    if (colorQuery) {
      filtered = filtered.filter((item) => item.color && item.color.toLowerCase() === colorQuery.toLowerCase())
    }

    // Apply material filter from URL
    if (materialQuery) {
      filtered = filtered.filter((item) => item.material && item.material.toLowerCase() === materialQuery.toLowerCase())
    }

    // Apply price filter
    filtered = filtered.filter((item) => {
      const itemPrice = item.rentalPrice || item.baseRentalPrice || item.price || 0
      return itemPrice >= price[0] && itemPrice <= price[1]
    })

    // Apply size filter from checkboxes
    if (selectedSizes.length > 0 && !selectedSizes.includes("all")) {
      filtered = filtered.filter((item) => selectedSizes.includes(item.size))
    }

    // Apply aesthetic filter from checkboxes
    if (selectedAesthetics.length > 0 && !selectedAesthetics.includes("all")) {
      filtered = filtered.filter((item) => selectedAesthetics.includes(item.aesthetic))
    }

    // Apply designer filter from checkboxes
    if (selectedDesigners.length > 0 && !selectedDesigners.includes("all")) {
      filtered = filtered.filter((item) => selectedDesigners.includes(item.designer))
    }

    // Apply sort
    if (sortQuery) {
      switch (sortQuery) {
        case "newest":
          filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          break
        case "oldest":
          filtered.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
          break
        case "price-low":
          filtered.sort((a, b) => (a.rentalPrice || a.price || 0) - (b.rentalPrice || b.price || 0))
          break
        case "price-high":
          filtered.sort((a, b) => (b.rentalPrice || b.price || 0) - (a.rentalPrice || a.price || 0))
          break
        case "popular":
          filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
          break
      }
    }

    setFilteredItems(filtered)
  }, [
    allItems,
    searchQuery,
    aestheticQuery,
    designerQuery,
    categoryQuery,
    sizeQuery,
    brandQuery,
    conditionQuery,
    colorQuery,
    priceQuery,
    materialQuery,
    sortQuery,
    price,
    selectedSizes,
    selectedAesthetics,
    selectedDesigners,
  ])

  // Filter bundles based on search query and filters
  useEffect(() => {
    let filtered = [...allBundles]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (bundle) =>
          (bundle.name && bundle.name.toLowerCase().includes(query)) ||
          (bundle.description && bundle.description.toLowerCase().includes(query)) ||
          (bundle.aesthetic && bundle.aesthetic.toLowerCase().includes(query)),
      )
    }

    // Apply aesthetic filter from URL
    if (aestheticQuery) {
      filtered = filtered.filter(
        (bundle) => bundle.aesthetic && bundle.aesthetic.toLowerCase() === aestheticQuery.toLowerCase(),
      )
    }

    // Apply size filter
    if (selectedSizes.length > 0 && !selectedSizes.includes("all")) {
      filtered = filtered.filter((bundle) => selectedSizes.includes(bundle.size))
    }

    // Apply aesthetic filter from checkboxes
    if (selectedAesthetics.length > 0 && !selectedAesthetics.includes("all")) {
      filtered = filtered.filter((bundle) => selectedAesthetics.includes(bundle.aesthetic))
    }

    // Apply price filter
    filtered = filtered.filter((bundle) => {
      const bundlePrice = bundle.price || bundle.suggestedPrice || 0
      return bundlePrice >= price[0] && bundlePrice <= price[1]
    })

    // Apply sort
    if (sortQuery) {
      switch (sortQuery) {
        case "newest":
          filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          break
        case "oldest":
          filtered.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
          break
        case "price-low":
          filtered.sort((a, b) => (a.price || a.suggestedPrice || 0) - (b.price || b.suggestedPrice || 0))
          break
        case "price-high":
          filtered.sort((a, b) => (b.price || b.suggestedPrice || 0) - (a.price || a.suggestedPrice || 0))
          break
        case "popular":
          filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
          break
      }
    }

    setFilteredBundles(filtered)
  }, [allBundles, searchQuery, aestheticQuery, price, selectedSizes, selectedAesthetics, sortQuery])

  // Listen for custom search events from other components
  useEffect(() => {
    const handleSearchEvent = (e: CustomEvent) => {
      // Force a re-render when a search is performed elsewhere
      if (e.detail && e.detail.term) {
        console.log("Search event detected:", e.detail.term)
        setRefreshKey((prev) => prev + 1)
      }
    }

    window.addEventListener("stylerent-search", handleSearchEvent as EventListener)

    return () => {
      window.removeEventListener("stylerent-search", handleSearchEvent as EventListener)
    }
  }, [])

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) => {
      if (size === "all") {
        return ["all"]
      }

      const newSizes = prev.includes(size) ? prev.filter((s) => s !== size) : [...prev.filter((s) => s !== "all"), size]

      return newSizes.length ? newSizes : ["all"]
    })
  }

  // Toggle debug panel with keyboard shortcut (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault()
        setShowDebug((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="container py-10">
      {/* Add the shared filter bar */}
      <SharedFilterBar />

      {searchQuery && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Search Results for "{searchQuery}"</h1>
          <p className="text-muted-foreground">
            Found {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} and {filteredBundles.length}{" "}
            {filteredBundles.length === 1 ? "bundle" : "bundles"}
          </p>
        </div>
      )}

      {aestheticQuery && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Aesthetic: {aestheticQuery}</h1>
          <p className="text-muted-foreground">
            Found {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} and {filteredBundles.length}{" "}
            {filteredBundles.length === 1 ? "bundle" : "bundles"}
          </p>
        </div>
      )}

      {categoryQuery && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Category: {categoryQuery}</h1>
          <p className="text-muted-foreground">
            Found {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
          </p>
        </div>
      )}

      {/* Debug toggle button */}
      <div className="mb-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setShowDebug((prev) => !prev)}>
          {showDebug ? "Hide Debug" : "Show Debug"}
        </Button>
      </div>

      {/* Debug panel */}
      {showDebug && <DebugItems />}

      <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="items">Individual Items</TabsTrigger>
          <TabsTrigger value="bundles">Bundles</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {/* Desktop filters */}
          <div className="hidden md:block space-y-4">
            <div>
              <h4 className="font-medium mb-3">Price</h4>
              <Slider defaultValue={price} max={100} step={1} onValueChange={(value) => setPrice(value)} />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${price[0]}</span>
                <span>${price[1]}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Size</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="size-all"
                    checked={selectedSizes.includes("all") || selectedSizes.length === 0}
                    onCheckedChange={() => handleSizeChange("all")}
                  />
                  <Label htmlFor="size-all" className="text-sm cursor-pointer">
                    All Sizes
                  </Label>
                </div>

                <Separator className="my-2" />
                <p className="text-xs text-muted-foreground mb-1">Letter Sizes</p>

                <div className="grid grid-cols-3 gap-1">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <div key={`size-${size.toLowerCase()}`} className="flex items-center space-x-1">
                      <Checkbox
                        id={`size-${size.toLowerCase()}`}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => handleSizeChange(size)}
                      />
                      <Label htmlFor={`size-${size.toLowerCase()}`} className="text-xs cursor-pointer">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>

                <Separator className="my-2" />
                <p className="text-xs text-muted-foreground mb-1">Other Sizes</p>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="size-one-size"
                      checked={selectedSizes.includes("One Size")}
                      onCheckedChange={() => handleSizeChange("One Size")}
                    />
                    <Label htmlFor="size-one-size" className="text-xs cursor-pointer">
                      One Size
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile filters */}
          <div className="md:hidden">
            <Collapsible>
              <CollapsibleTrigger className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                Filters
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Price</h4>
                  <Slider defaultValue={price} max={100} step={1} onValueChange={(value) => setPrice(value)} />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${price[0]}</span>
                    <span>${price[1]}</span>
                  </div>
                </div>

                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <h4 className="font-medium">Size</h4>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2 pb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mobile-size-all"
                          checked={selectedSizes.includes("all") || selectedSizes.length === 0}
                          onCheckedChange={() => handleSizeChange("all")}
                        />
                        <Label htmlFor="mobile-size-all" className="text-sm cursor-pointer">
                          All Sizes
                        </Label>
                      </div>

                      <Separator className="my-2" />
                      <p className="text-xs text-muted-foreground mb-1">Letter Sizes</p>

                      <div className="grid grid-cols-3 gap-1">
                        {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                          <div key={`mobile-size-${size.toLowerCase()}`} className="flex items-center space-x-1">
                            <Checkbox
                              id={`mobile-size-${size.toLowerCase()}`}
                              checked={selectedSizes.includes(size)}
                              onCheckedChange={() => handleSizeChange(size)}
                            />
                            <Label htmlFor={`mobile-size-${size.toLowerCase()}`} className="text-xs cursor-pointer">
                              {size}
                            </Label>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-2" />
                      <p className="text-xs text-muted-foreground mb-1">Other Sizes</p>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="mobile-size-one-size"
                            checked={selectedSizes.includes("One Size")}
                            onCheckedChange={() => handleSizeChange("One Size")}
                          />
                          <Label htmlFor="mobile-size-one-size" className="text-xs cursor-pointer">
                            One Size
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Products */}
          <div className="col-span-1 md:col-span-3">
            <TabsContent value="items">
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No items found</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    We couldn't find any items matching your search criteria. Try adjusting your filters or search
                    terms.
                  </p>
                  <Button asChild>
                    <Link href="/browse">Clear Filters</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map((item) => (
                    <Link href={`/items/${item.id}`} key={item.id}>
                      <Card className="overflow-hidden h-full border-none shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="relative aspect-[3/4] bg-muted">
                          <img
                            src={item.media?.[0]?.url || "/placeholder.svg?height=400&width=300"}
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
                            <p className="font-medium">${item.rentalPrice || item.baseRentalPrice || item.price}/day</p>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                              <span className="text-sm">{item.rating || "New"}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.size && (
                              <Badge variant="outline" className="text-xs">
                                Size {item.size}
                              </Badge>
                            )}
                            {item.aesthetic && (
                              <Badge variant="secondary" className="text-xs">
                                {item.aesthetic}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="bundles">
              {filteredBundles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Package className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No bundles found</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    We couldn't find any bundles matching your search criteria. Try adjusting your filters or search
                    terms.
                  </p>
                  <Button asChild>
                    <Link href="/browse">Clear Filters</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBundles.map((bundle) => (
                    <Link href={`/bundles/${bundle.id}`} key={bundle.id}>
                      <Card className="overflow-hidden h-full border-none shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="relative aspect-[3/4] bg-muted">
                          {bundle.items &&
                          bundle.items.length > 0 &&
                          bundle.items[0].media &&
                          bundle.items[0].media[0] ? (
                            <img
                              src={bundle.items[0].media[0].url || "/placeholder.svg?height=400&width=300"}
                              alt={bundle.name}
                              className="object-cover w-full h-full"
                            />
                          ) : bundle.image ? (
                            <img
                              src={bundle.image || "/placeholder.svg?height=400&width=300"}
                              alt={bundle.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-muted">
                              <Package className="h-16 w-16 text-muted-foreground" />
                            </div>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                          >
                            <Heart className="h-4 w-4" />
                            <span className="sr-only">Add to wishlist</span>
                          </Button>
                          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">Bundle</Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{bundle.name || bundle.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {bundle.description || "Bundle of items"}
                          </p>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="font-medium">${bundle.price || bundle.suggestedPrice || "Varies"}/day</p>
                            <div className="flex items-center">
                              <span className="text-sm">{bundle.items?.length || 0} items</span>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {bundle.size && (
                              <Badge variant="outline" className="text-xs">
                                Size {bundle.size}
                              </Badge>
                            )}
                            {bundle.aesthetic && (
                              <Badge variant="secondary" className="text-xs">
                                {bundle.aesthetic}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
