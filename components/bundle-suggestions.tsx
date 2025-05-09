"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Plus } from "lucide-react"
import { getAllItems } from "@/lib/item-utils"
import { toast } from "sonner"

interface Item {
  id: string
  name: string
  designer: string
  price?: number
  rentalPrice?: number
  retailPrice?: number
  media?: Array<{ url: string; type?: string }>
  size?: string
  aesthetic?: string
  category?: string
}

interface BundleSuggestionsProps {
  currentItem?: Item
  onAddToBundle: (item: Item) => void
}

export function BundleSuggestions({ currentItem, onAddToBundle }: BundleSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generateSuggestions()
  }, [currentItem])

  const generateSuggestions = () => {
    setIsLoading(true)

    // Simulate AI processing delay
    setTimeout(() => {
      const allItems = getAllItems()

      // Filter out the current item if it exists
      const availableItems = currentItem ? allItems.filter((item) => item.id !== currentItem.id) : allItems

      if (availableItems.length === 0) {
        setSuggestions([])
        setIsLoading(false)
        return
      }

      // If we have a current item, use its properties to generate relevant suggestions
      if (currentItem) {
        // Get items with similar aesthetic or from the same designer
        let matchingItems = availableItems.filter(
          (item) => item.aesthetic === currentItem.aesthetic || item.designer === currentItem.designer,
        )

        // If we don't have enough matching items, add some complementary items
        if (matchingItems.length < 3) {
          // Define complementary categories
          const complementaryCategories: Record<string, string[]> = {
            Dress: ["Accessories", "Shoes", "Outerwear"],
            Top: ["Bottoms", "Accessories", "Outerwear"],
            Bottoms: ["Top", "Accessories", "Shoes"],
            Outerwear: ["Dress", "Top", "Bottoms"],
            Shoes: ["Dress", "Bottoms", "Accessories"],
            Accessories: ["Dress", "Top", "Bottoms"],
          }

          const complementary = complementaryCategories[currentItem.category || ""] || []

          const complementaryItems = availableItems.filter((item) => complementary.includes(item.category || ""))

          // Combine matching and complementary items, removing duplicates
          const combinedItems = [...matchingItems]

          for (const item of complementaryItems) {
            if (!combinedItems.some((i) => i.id === item.id)) {
              combinedItems.push(item)
            }
          }

          matchingItems = combinedItems
        }

        // If we still don't have enough items, add random items
        if (matchingItems.length < 3) {
          const randomItems = availableItems
            .filter((item) => !matchingItems.some((i) => i.id === item.id))
            .sort(() => 0.5 - Math.random())

          matchingItems = [...matchingItems, ...randomItems]
        }

        // Take the first 4 items
        setSuggestions(matchingItems.slice(0, 4))
      } else {
        // If no current item, just return random items
        setSuggestions(availableItems.sort(() => 0.5 - Math.random()).slice(0, 4))
      }

      setIsLoading(false)
    }, 1000)
  }

  const handleAddToBundle = (item: Item) => {
    onAddToBundle(item)
    toast.success(`Added ${item.name} to your bundle`)
  }

  if (suggestions.length === 0 && !isLoading) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          <CardTitle>AI Bundle Suggestions</CardTitle>
        </div>
        <CardDescription>Items that would pair well with your current selection</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-[3/4] bg-muted animate-pulse rounded-md" />
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suggestions.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="aspect-[3/4] bg-muted rounded-md overflow-hidden relative group">
                  <img
                    src={(item.media && item.media[0]?.url) || "/placeholder.svg?height=300&width=225"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center"
                      onClick={() => handleAddToBundle(item)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add to Bundle
                    </Button>
                  </div>
                </div>
                <h3 className="font-medium text-sm truncate">{item.name}</h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{item.designer}</span>
                  <span className="font-medium">${item.rentalPrice || item.price}/day</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" className="w-full mt-4" onClick={generateSuggestions} disabled={isLoading}>
          {isLoading ? "Generating..." : "Refresh Suggestions"}
        </Button>
      </CardContent>
    </Card>
  )
}
