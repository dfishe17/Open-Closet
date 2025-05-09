"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Sparkles, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getTestItems, getUserItems } from "@/lib/item-utils"

export function SearchPopup() {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<Array<{ type: string; value: string; id?: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  // Get suggestions based on input
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([])
      return
    }

    setIsLoading(true)

    // Simulate AI processing delay
    const timer = setTimeout(() => {
      const newSuggestions = getAISuggestions(searchTerm)
      setSuggestions(newSuggestions)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Get AI suggestions based on input and available items
  const getAISuggestions = (input: string) => {
    if (!input.trim()) return []

    const lowercaseInput = input.toLowerCase()

    // Get all items (both test and user-added)
    const testItems = getTestItems()
    const userItems = getUserItems()
    const allItems = [...userItems, ...testItems]

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

  const handleSearch = (term: string) => {
    if (!term.trim()) return
    router.push(`/browse?search=${encodeURIComponent(term)}`)
    setOpen(false)
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
    setOpen(false)
    setSearchTerm("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center p-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder=""
              className="pl-8 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchTerm)
                }
              }}
            />
            {isLoading ? (
              <Sparkles className="absolute right-2 top-2.5 h-4 w-4 text-primary animate-pulse" />
            ) : (
              searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear</span>
                </Button>
              )
            )}
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="border-t pt-2 pb-2">
            <div className="flex items-center px-3 mb-1">
              <Sparkles className="h-3 w-3 text-primary mr-1" />
              <span className="text-xs font-medium">AI Suggestions</span>
            </div>
            <div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-1.5 hover:bg-muted flex justify-between items-center text-sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span>{suggestion.value}</span>
                  <span className="text-xs text-muted-foreground">{suggestion.type}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t p-2">
          <Button variant="default" className="w-full" onClick={() => handleSearch(searchTerm)}>
            Search
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
