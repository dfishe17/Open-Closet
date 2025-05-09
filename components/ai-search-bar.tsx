"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Sparkles, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getAllItems } from "@/lib/item-utils"

// Simulated AI suggestions based on input and available items
const getAISuggestions = (input: string) => {
  if (!input.trim()) return []

  const lowercaseInput = input.toLowerCase()

  // Get all items (both test and user-added)
  const allItems = getAllItems()
  console.log("Getting suggestions from items:", allItems.length)

  // Extract unique aesthetics, designers, and categories from all items
  const aesthetics = [...new Set(allItems.map((item) => item.aesthetic).filter(Boolean))]
  const designers = [...new Set(allItems.map((item) => item.designer).filter(Boolean))]
  const categories = [...new Set(allItems.map((item) => item.category).filter(Boolean))]

  // Add some additional options for better search experience
  const additionalAesthetics = [
    "Y2K",
    "Cottagecore",
    "Dark Academia",
    "Minimalist",
    "Bohemian",
    "Streetwear",
    "Vintage",
    "Preppy",
    "Grunge",
    "Coastal Grandmother",
  ]

  const additionalDesigners = [
    "Zimmermann",
    "Theory",
    "Marchesa",
    "AllSaints",
    "Equipment",
    "Self-Portrait",
    "Reformation",
    "Ganni",
    "Staud",
    "Ulla Johnson",
  ]

  // Combine and deduplicate
  const allAesthetics = [...new Set([...aesthetics, ...additionalAesthetics])]
  const allDesigners = [...new Set([...designers, ...additionalDesigners])]

  // Item name suggestions (directly from items)
  const itemSuggestions = allItems
    .filter((item) => item.name.toLowerCase().includes(lowercaseInput))
    .map((item) => ({ type: "Item", value: item.name, id: item.id }))

  // Filter suggestions based on input
  const filteredAesthetics = allAesthetics
    .filter((item) => item && item.toLowerCase().includes(lowercaseInput))
    .map((item) => ({ type: "Aesthetic", value: item }))

  const filteredDesigners = allDesigners
    .filter((item) => item && item.toLowerCase().includes(lowercaseInput))
    .map((item) => ({ type: "Designer", value: item }))

  const filteredCategories = categories
    .filter((item) => item && item.toLowerCase().includes(lowercaseInput))
    .map((item) => ({ type: "Category", value: item }))

  // Combine all suggestions
  return [...itemSuggestions, ...filteredAesthetics, ...filteredDesigners, ...filteredCategories].slice(0, 8)
}

export function AISearchBar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<Array<{ type: string; value: string; id?: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // Use a key to force refresh
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Handle click outside to collapse search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  // Update suggestions when search term changes or when refreshKey changes
  useEffect(() => {
    if (searchTerm) {
      setIsLoading(true)
      // Simulate AI processing delay
      const timer = setTimeout(() => {
        const newSuggestions = getAISuggestions(searchTerm)
        console.log("Generated suggestions:", newSuggestions.length)
        setSuggestions(newSuggestions)
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
      setIsLoading(false)
    }
  }, [searchTerm, refreshKey])

  // Listen for item updates to refresh suggestions
  useEffect(() => {
    // Function to handle item updates
    const handleItemsUpdated = () => {
      console.log("Items updated, refreshing suggestions")
      setRefreshKey((prev) => prev + 1) // Force refresh

      // If search is active, immediately update suggestions
      if (searchTerm) {
        const newSuggestions = getAISuggestions(searchTerm)
        setSuggestions(newSuggestions)
      }
    }

    // Listen for our custom event
    window.addEventListener("opencloset-items-updated", handleItemsUpdated)

    // Also listen for storage events (for cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "opencloset_items") {
        handleItemsUpdated()
      }
    }
    window.addEventListener("storage", handleStorageChange)

    // Refresh suggestions periodically (every 2 seconds)
    const intervalId = setInterval(() => {
      if (searchTerm && isExpanded) {
        const newSuggestions = getAISuggestions(searchTerm)
        setSuggestions(newSuggestions)
      }
    }, 2000)

    return () => {
      window.removeEventListener("opencloset-items-updated", handleItemsUpdated)
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(intervalId)
    }
  }, [searchTerm, isExpanded])

  const handleSearch = (term: string) => {
    if (!term.trim()) return
    router.push(`/browse?search=${encodeURIComponent(term)}`)
    // Dispatch an event so other components can react to the search
    window.dispatchEvent(new CustomEvent("opencloset-search", { detail: { term } }))
    setIsExpanded(false)
    setSearchTerm("")
  }

  const handleSuggestionClick = (suggestion: { type: string; value: string; id?: string }) => {
    if (suggestion.type === "Item" && suggestion.id) {
      router.push(`/items/${suggestion.id}`)
    } else if (suggestion.type === "Aesthetic") {
      router.push(`/browse?aesthetic=${encodeURIComponent(suggestion.value)}`)
    } else if (suggestion.type === "Designer") {
      router.push(`/browse?designer=${encodeURIComponent(suggestion.value)}`)
    } else if (suggestion.type === "Category") {
      router.push(`/browse?category=${encodeURIComponent(suggestion.value)}`)
    } else {
      handleSearch(suggestion.value)
    }
    setIsExpanded(false)
    setSearchTerm("")
  }

  const toggleSearch = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      // Reset search when opening
      setSearchTerm("")
      setSuggestions([])
      // Force a refresh of available items
      setRefreshKey((prev) => prev + 1)
    }
  }

  return (
    <div
      ref={searchRef}
      className={cn(
        "relative transition-all duration-300 z-50",
        isExpanded ? "w-full md:w-[500px]" : "w-10 md:w-[200px]",
      )}
    >
      <div className="relative flex items-center">
        {!isExpanded ? (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-0"
            onClick={toggleSearch}
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        ) : (
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        )}

        <Input
          ref={inputRef}
          type="search"
          placeholder=""
          className={cn(
            "transition-all duration-300 pl-10 pr-10 h-10",
            isExpanded ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchTerm)
            } else if (e.key === "Escape") {
              setIsExpanded(false)
            }
          }}
        />

        {isExpanded && (
          <div className="absolute right-0 top-0 flex items-center h-full pr-2">
            {isLoading ? (
              <Sparkles className="h-4 w-4 text-primary animate-pulse mr-1" />
            ) : (
              searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )
            )}
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isExpanded && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg overflow-hidden z-50">
          <div className="p-2">
            <div className="flex items-center mb-2">
              <Sparkles className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium">AI Suggestions</span>
            </div>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded-md flex justify-between items-center"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span>{suggestion.value}</span>
                    <span className="text-xs text-muted-foreground">{suggestion.type}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
