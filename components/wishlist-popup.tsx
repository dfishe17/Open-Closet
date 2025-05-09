"use client"

import { useState, useEffect } from "react"
import { Heart, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
}

export function WishlistPopup() {
  const [open, setOpen] = useState(false)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const router = useRouter()

  // Load wishlist items when component mounts or popover opens
  useEffect(() => {
    if (open) {
      loadWishlistItems()
    }
  }, [open])

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Heart className="h-5 w-5" />
          {wishlistItems.length > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
              {wishlistItems.length}
            </span>
          )}
          <span className="sr-only">Wishlist</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 font-medium border-b">Your Wishlist ({wishlistItems.length})</div>

        {wishlistItems.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Heart className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
            <p>Your wishlist is empty</p>
            <Button variant="link" asChild className="mt-2" onClick={() => setOpen(false)}>
              <Link href="/browse">Browse items</Link>
            </Button>
          </div>
        ) : (
          <div className="max-h-[300px] overflow-auto">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex items-center p-2 hover:bg-muted/50 border-b last:border-0">
                <div
                  className="w-12 h-12 rounded bg-muted mr-2 bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.image || "/placeholder.svg?height=48&width=48"})` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium text-sm">{item.name}</div>
                  <div className="text-sm text-muted-foreground">${item.price}</div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromWishlist(item.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Remove</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      router.push(`/items/${item.id}`)
                      setOpen(false)
                    }}
                  >
                    <span className="sr-only">View</span>→
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t p-2">
          <Button variant="default" className="w-full" asChild onClick={() => setOpen(false)}>
            <Link href="/wishlist">View All Wishlist</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
