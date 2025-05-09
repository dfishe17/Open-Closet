"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Star, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { getAllItems } from "@/lib/item-utils"

export default function MobileBrowsePage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  const [items, setItems] = useState<any[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchQuery)

  // Filter states
  const [price, setPrice] = useState<number[]>([0, 100])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDesigners, setSelectedDesigners] = useState<string[]>([])
  const [sortOption, setSortOption] = useState("newest")

  useEffect(() => {
    // Load items
    try {
      const allItems = getAllItems()
      setItems(allItems)
      setFilteredItems(allItems)

      // Apply search filter if provided in URL
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const filtered = allItems.filter(
          (item) =>
            (item.name && item.name.toLowerCase().includes(query)) ||
            (item.designer && item.designer.toLowerCase().includes(query)) ||
            (item.category && item.category.toLowerCase().includes(query)),
        )
        setFilteredItems(filtered)
      }
    } catch (error) {
      console.error("Error loading items:", error)
      // Fallback to demo items
      const demoItems = [
        {
          id: "item1",
          name: "Designer Dress",
          designer: "Gucci",
          price: 45,
          rentalPrice: 45,
          image: "/placeholder.svg?height=300&width=225&text=Designer+Dress",
          media: [{ url: "/placeholder.svg?height=300&width=225&text=Designer+Dress" }],
          rating: 4.8,
          category: "Dresses",
          size: "M",
        },
        {
          id: "item2",
          name: "Luxury Handbag",
          designer: "Prada",
          price: 35,
          rentalPrice: 35,
          image: "/placeholder.svg?height=300&width=225&text=Luxury+Handbag",
          media: [{ url: "/placeholder.svg?height=300&width=225&text=Luxury+Handbag" }],
          rating: 4.7,
          category: "Accessories",
          size: "One Size",
        },
        {
          id: "item3",
          name: "Formal Suit",
          designer: "Armani",
          price: 50,
          rentalPrice: 50,
          image: "/placeholder.svg?height=300&width=225&text=Formal+Suit",
          media: [{ url: "/placeholder.svg?height=300&width=225&text=Formal+Suit" }],
          rating: 4.9,
          category: "Suits",
          size: "L",
        },
        {
          id: "item4",
          name: "Casual Jacket",
          designer: "Burberry",
          price: 30,
          rentalPrice: 30,
          image: "/placeholder.svg?height=300&width=225&text=Casual+Jacket",
          media: [{ url: "/placeholder.svg?height=300&width=225&text=Casual+Jacket" }],
          rating: 4.6,
          category: "Outerwear",
          size: "S",
        },
      ]
      setItems(demoItems)
      setFilteredItems(demoItems)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

  // Apply filters
  const applyFilters = () => {
    let filtered = [...items]

    // Apply search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(query)) ||
          (item.designer && item.designer.toLowerCase().includes(query)) ||
          (item.category && item.category.toLowerCase().includes(query)),
      )
    }

    // Apply price filter
    filtered = filtered.filter((item) => {
      const itemPrice = item.rentalPrice || item.price || 0
      return itemPrice >= price[0] && itemPrice <= price[1]
    })

    // Apply size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((item) => selectedSizes.includes(item.size))
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) => selectedCategories.includes(item.category))
    }

    // Apply designer filter
    if (selectedDesigners.length > 0) {
      filtered = filtered.filter((item) => selectedDesigners.includes(item.designer))
    }

    // Apply sort
    if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    } else if (sortOption === "price-low") {
      filtered.sort((a, b) => (a.rentalPrice || a.price || 0) - (b.rentalPrice || b.price || 0))
    } else if (sortOption === "price-high") {
      filtered.sort((a, b) => (b.rentalPrice || b.price || 0) - (a.rentalPrice || a.price || 0))
    } else if (sortOption === "popular") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    setFilteredItems(filtered)
  }

  const resetFilters = () => {
    setPrice([0, 100])
    setSelectedSizes([])
    setSelectedCategories([])
    setSelectedDesigners([])
    setSortOption("newest")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleDesignerChange = (designer: string) => {
    setSelectedDesigners((prev) => (prev.includes(designer) ? prev.filter((d) => d !== designer) : [...prev, designer]))
  }

  return (
    <div className="container px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Browse Items</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Items</SheetTitle>
              <SheetDescription>Refine your search with these filters</SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Price Range ($/day)</h3>
                <Slider defaultValue={price} max={100} step={1} onValueChange={(value) => setPrice(value)} />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>${price[0]}</span>
                  <span>${price[1]}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Size</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["XS", "S", "M", "L", "XL", "One Size"].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => handleSizeChange(size)}
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <div className="grid grid-cols-1 gap-2">
                  {["Dresses", "Tops", "Bottoms", "Outerwear", "Accessories", "Suits"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Designer</h3>
                <div className="grid grid-cols-1 gap-2">
                  {["Gucci", "Prada", "Armani", "Burberry", "Chanel", "Dior"].map((designer) => (
                    <div key={designer} className="flex items-center space-x-2">
                      <Checkbox
                        id={`designer-${designer}`}
                        checked={selectedDesigners.includes(designer)}
                        onCheckedChange={() => handleDesignerChange(designer)}
                      />
                      <Label htmlFor={`designer-${designer}`} className="text-sm">
                        {designer}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Sort By</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sort-newest"
                      checked={sortOption === "newest"}
                      onCheckedChange={() => setSortOption("newest")}
                    />
                    <Label htmlFor="sort-newest" className="text-sm">
                      Newest First
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sort-price-low"
                      checked={sortOption === "price-low"}
                      onCheckedChange={() => setSortOption("price-low")}
                    />
                    <Label htmlFor="sort-price-low" className="text-sm">
                      Price: Low to High
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sort-price-high"
                      checked={sortOption === "price-high"}
                      onCheckedChange={() => setSortOption("price-high")}
                    />
                    <Label htmlFor="sort-price-high" className="text-sm">
                      Price: High to Low
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sort-popular"
                      checked={sortOption === "popular"}
                      onCheckedChange={() => setSortOption("popular")}
                    />
                    <Label htmlFor="sort-popular" className="text-sm">
                      Most Popular
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <SheetFooter className="flex-row gap-3 sm:justify-between">
              <Button variant="outline" onClick={resetFilters} className="flex-1">
                Reset
              </Button>
              <SheetClose asChild>
                <Button onClick={applyFilters} className="flex-1">
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <form onSubmit={handleSearch} className="relative mb-6">
        <Input
          type="text"
          placeholder="Search for items, designers..."
          className="pl-10 pr-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </form>

      {searchQuery && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing results for "{searchQuery}" ({filteredItems.length} items)
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters or search for something else</p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <Link href={`/mobile/items/${item.id}`} key={item.id}>
              <Card className="overflow-hidden border-none shadow-sm">
                <div className="aspect-[3/4] bg-muted">
                  <img
                    src={(item.media && item.media[0]?.url) || item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.designer}</p>
                  <div className="mt-1 flex justify-between items-center">
                    <p className="font-medium text-sm">${item.rentalPrice || item.price}/day</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                      <span className="text-xs">{item.rating || "New"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
