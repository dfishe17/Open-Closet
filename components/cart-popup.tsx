"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  rentalPeriod?: string
  size?: string
  quantity: number
}

export function CartPopup() {
  const [open, setOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const router = useRouter()

  // Load cart items when component mounts or popover opens
  useEffect(() => {
    if (open) {
      loadCartItems()
    }
  }, [open])

  const loadCartItems = () => {
    try {
      const storedCart = localStorage.getItem("stylerent_cart")
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      } else {
        setCartItems([])
      }
    } catch (error) {
      console.error("Error loading cart:", error)
      setCartItems([])
    }
  }

  const removeFromCart = (id: string) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== id)
      localStorage.setItem("stylerent_cart", JSON.stringify(updatedCart))
      setCartItems(updatedCart)
    } catch (error) {
      console.error("Error removing from cart:", error)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <ShoppingBag className="h-5 w-5" />
          {cartItems.length > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
              {cartItems.length}
            </span>
          )}
          <span className="sr-only">Cart</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 font-medium border-b">Your Cart ({cartItems.length})</div>

        {cartItems.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <ShoppingBag className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
            <p>Your cart is empty</p>
            <Button variant="link" asChild className="mt-2" onClick={() => setOpen(false)}>
              <Link href="/browse">Browse items</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-[250px] overflow-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center p-2 hover:bg-muted/50 border-b last:border-0">
                  <div
                    className="w-12 h-12 rounded bg-muted mr-2 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image || "/placeholder.svg?height=48&width=48"})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.rentalPeriod && " · "}
                      {item.rentalPeriod && `${item.rentalPeriod}`}
                    </div>
                    <div className="text-sm">
                      ${item.price} × {item.quantity}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
            </div>
            <div className="border-t p-3">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <Button variant="default" className="w-full" asChild onClick={() => setOpen(false)}>
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
