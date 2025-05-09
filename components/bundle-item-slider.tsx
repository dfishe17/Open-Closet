"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Loader2, AlertCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUserListedItems, createDemoItemsForUser } from "@/lib/item-utils"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

interface Item {
  id: string
  name: string
  designer?: string
  price?: number
  rentalPrice?: number
  media?: Array<{ url: string; type?: string }>
  size?: string
  aesthetic?: string
  category?: string
  allowInRenterBundles?: boolean
}

interface BundleItemSliderProps {
  onAddItem: (item: any) => void
  clickToAdd?: boolean
}

export function BundleItemSlider({ onAddItem, clickToAdd }: BundleItemSliderProps) {
  const [userItems, setUserItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState<Item[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const itemsPerPage = 6 // Increased from 3 to show more items

  // Check if user is logged in and get their items
  useEffect(() => {
    const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
    setIsLoggedIn(!!userId)

    if (userId) {
      setIsLoading(true)
      loadUserItems()
    } else {
      setIsLoading(false)
    }
  }, [])

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(userItems)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = userItems.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          (item.designer && item.designer.toLowerCase().includes(query)) ||
          (item.category && item.category.toLowerCase().includes(query)) ||
          (item.aesthetic && item.aesthetic.toLowerCase().includes(query)),
      )
      setFilteredItems(filtered)
    }
  }, [searchQuery, userItems])

  // Update visible items when filteredItems or currentIndex changes
  useEffect(() => {
    if (filteredItems.length > 0) {
      const endIndex = Math.min(currentIndex + itemsPerPage, filteredItems.length)
      setVisibleItems(filteredItems.slice(currentIndex, endIndex))
    }
  }, [filteredItems, currentIndex])

  const loadUserItems = async () => {
    try {
      // Create demo items if needed
      await createDemoItemsForUser()

      // Get user's items
      const items = getUserListedItems()
      setUserItems(items)
      setFilteredItems(items)
      console.log("User's listed items loaded:", items.length)
    } catch (error) {
      console.error("Error loading user items:", error)
      toast.error("Failed to load your items")
    } finally {
      setIsLoading(false)
    }
  }

  // Listen for item updates
  useEffect(() => {
    const handleItemsUpdated = () => {
      loadUserItems()
    }

    window.addEventListener("stylerent-items-updated", handleItemsUpdated)
    window.addEventListener("opencloset-items-updated", handleItemsUpdated)

    return () => {
      window.removeEventListener("stylerent-items-updated", handleItemsUpdated)
      window.removeEventListener("opencloset-items-updated", handleItemsUpdated)
    }
  }, [])

  const handleAddItem = (item: Item) => {
    if (item.allowInRenterBundles === false) {
      toast.error(`${item.name} cannot be added to custom bundles`)
      return
    }

    onAddItem(item)
    toast.success(`Added ${item.name} to your bundle`)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(filteredItems.length - itemsPerPage, prev + itemsPerPage))
  }

  if (!isLoggedIn) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>You need to be logged in to add your items to a bundle.</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (userItems.length === 0) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You don't have any listed items yet.{" "}
          <a href="/list-item" className="underline font-medium">
            List an item
          </a>{" "}
          to add it to your bundle.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your items..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium">Your Available Items ({filteredItems.length})</Label>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex + itemsPerPage >= filteredItems.length}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className={`border rounded-md overflow-hidden hover:shadow-md transition-shadow ${clickToAdd ? "cursor-pointer" : ""}`}
            onClick={clickToAdd ? () => handleAddItem(item) : undefined}
          >
            <div className="aspect-square bg-muted relative">
              {item.media && item.media[0] ? (
                <img
                  src={item.media[0].url || "/placeholder.svg?height=100&width=100"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium line-clamp-1">{item.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {item.designer && `${item.designer} • `}${item.category || "Clothing"}
              </p>
              <div className="flex justify-between items-center mt-2">
                <p className="font-medium">${item.rentalPrice || item.price}/day</p>
                {!clickToAdd && (
                  <Button size="sm" variant="outline" onClick={() => handleAddItem(item)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length > itemsPerPage && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, index) => (
              <Button
                key={index}
                variant={Math.floor(currentIndex / itemsPerPage) === index ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentIndex(index * itemsPerPage)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
