"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  designer?: string
  category?: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    loadWishlistItems()

    // Listen for storage events
    window.addEventListener("storage", loadWishlistItems)
    return () => {
      window.removeEventListener("storage", loadWishlistItems)
    }
  }, [])

  const loadWishlistItems = () => {
    try {
      const storedWishlist = localStorage.getItem("stylerent_wishlist")
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist))
      } else {
        setWishlistItems([])
      }
    } catch (error) {
      console.error("Error loading wishlist:", error)
      setWishlistItems([])
    }
  }

  const removeFromWishlist = (id: string) => {
    try {
      const updatedWishlist = wishlistItems.filter((item) => item.id !== id)
      localStorage.setItem("stylerent_wishlist", JSON.stringify(updatedWishlist))
      setWishlistItems(updatedWishlist)
    } catch (error) {
      console.error("Error removing from wishlist:", error)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Save items you love to your wishlist to rent them later.</p>
          <Button asChild>
            <Link href="/browse">Browse Items</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden group">
              <div className="relative">
                <Link href={`/items/${item.id}`}>
                  <div
                    className="aspect-[3/4] bg-muted bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image || "/placeholder.svg?height=400&width=300"})` }}
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white rounded-full"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                  <span className="sr-only">Remove from wishlist</span>
                </Button>
              </div>
              <div className="p-4">
                <Link href={`/items/${item.id}`} className="block">
                  <h3 className="font-medium mb-1 hover:underline">{item.name}</h3>
                </Link>
                {item.designer && <p className="text-sm text-muted-foreground mb-1">{item.designer}</p>}
                <div className="flex justify-between items-center mt-2">
                  <p className="font-medium">${item.price}</p>
                  <Button size="sm" asChild>
                    <Link href={`/items/${item.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
