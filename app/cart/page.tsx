"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash2, ShoppingBag, Info } from "lucide-react"
import { getCart, removeFromCart, getCartTotal, type CartItem, getCartInsuranceAmount } from "@/lib/cart-utils"
import { isUserLoggedIn } from "@/lib/user-utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const insuranceAmount = getCartInsuranceAmount()
  const subtotal = getCartTotal() - insuranceAmount

  useEffect(() => {
    const loadCart = () => {
      const items = getCart()
      setCartItems(items)
      setIsLoading(false)
      setIsLoggedIn(isUserLoggedIn())
    }

    loadCart()

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId)
    setCartItems(getCart())
  }

  const handleCheckout = () => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/checkout")
    } else {
      router.push("/checkout")
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex animate-pulse flex-col space-y-8">
          <div className="h-8 w-1/4 rounded bg-muted"></div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 rounded bg-muted"></div>
            ))}
          </div>
          <div className="h-32 rounded bg-muted"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <div className="w-20"></div> {/* Spacer for alignment */}
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="text-center text-muted-foreground">Looks like you haven't added any items to your cart yet.</p>
          <Button onClick={() => router.push("/browse")}>Browse Items</Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="aspect-square h-40 w-40 shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Rental period: {item.rentalDays} {item.rentalDays === 1 ? "day" : "days"}
                        </p>
                      </div>
                      <div className="mt-4 text-right">
                        <p className="font-medium">
                          ${item.price}/day × {item.rentalDays} days = ${(item.price * item.rentalDays).toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-base">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-base">
                    <span className="flex items-center">
                      Insurance Deposit (refundable)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              This deposit is fully refunded when items are returned in good condition.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                    <span>${insuranceAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>${(subtotal + insuranceAmount).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  {isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
