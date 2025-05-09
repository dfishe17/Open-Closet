"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Plus, Loader2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getUserListedItems } from "@/lib/item-utils"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Item {
  id: string
  name: string
  designer?: string
  price?: number
  rentalPrice?: number
  retailPrice?: number
  media?: Array<{ url: string; type?: string }>
  size?: string
  aesthetic?: string
  category?: string
  allowInRenterBundles?: boolean
}

interface BundleSearchProps {
  onAddItem: (item: Item) => void
}

export function BundleSearch({ onAddItem }: BundleSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Item[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [userItems, setUserItems] = useState<Item[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Check if user is logged in and get their items
  useEffect(() => {
    const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
    setIsLoggedIn(!!userId)

    if (userId) {
      const items = getUserListedItems()
      setUserItems(items)
      console.log("User's listed items:", items)
    }
  }, [])

  // Listen for item updates
  useEffect(() => {
    const handleItemsUpdated = () => {
      const items = getUserListedItems()
      setUserItems(items)
      console.log("User's listed items updated:", items)
    }

    window.addEventListener("stylerent-items-updated", handleItemsUpdated)
    window.addEventListener("opencloset-items-updated", handleItemsUpdated)

    return () => {
      window.removeEventListener("stylerent-items-updated", handleItemsUpdated)
      window.removeEventListener("opencloset-items-updated", handleItemsUpdated)
    }
  }, [])

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Search for items when query changes
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    setShowResults(true)

    // Simulate search delay
    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase()

      // Filter items based on search query
      const filteredItems = userItems.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          (item.designer && item.designer.toLowerCase().includes(query)) ||
          (item.category && item.category.toLowerCase().includes(query)) ||
          (item.aesthetic && item.aesthetic.toLowerCase().includes(query)),
      )

      setSearchResults(filteredItems.slice(0, 8)) // Limit to 8 results
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, userItems])

  const handleAddItem = (item: Item) => {
    if (item.allowInRenterBundles === false) {
      toast.error(`${item.name} cannot be added to custom bundles`)
      return
    }

    onAddItem(item)
    setSearchQuery("")
    setShowResults(false)
    toast.success(`Added ${item.name} to your bundle`)
  }

  if (!isLoggedIn) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>You need to be logged in to add your items to a bundle.</AlertDescription>
      </Alert>
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
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search your listed items to add to bundle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10"
          onFocus={() => {
            if (searchQuery.trim().length >= 2) {
              setShowResults(true)
            }
          }}
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {showResults && (searchResults.length > 0 || isSearching) && (
        <Card className="absolute z-10 w-full mt-1 shadow-lg">
          <CardContent className="p-2">
            {isSearching ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <ul className="space-y-1">
                {searchResults.map((item) => (
                  <li key={item.id} className="rounded-md hover:bg-muted">
                    <div className="flex items-center p-2">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <img
                          src={(item.media && item.media[0]?.url) || "/placeholder.svg?height=40&width=40"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.designer} • ${item.rentalPrice || item.price}/day
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-2 flex-shrink-0"
                        onClick={() => handleAddItem(item)}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add to bundle</span>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">No matching items found</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
