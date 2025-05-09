"use client"

import { useEffect, useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { PaymentForm } from "@/components/payment-form"
import { createPaymentIntent } from "@/app/actions/stripe"
import { getCart, calculateCartTotal } from "@/lib/cart-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

// Load Stripe outside of component render to avoid recreating Stripe object on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<any[]>([])
  const [cartTotals, setCartTotals] = useState({ subtotal: 0, tax: 0, total: 0 })
  const router = useRouter()

  useEffect(() => {
    try {
      const cartItems = getCart()

      // Validate cart items
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        router.push("/cart")
        return
      }

      // Validate each item has price and rental days
      const invalidItems = cartItems.filter(
        (item) => isNaN(Number.parseFloat(String(item.price))) || isNaN(Number.parseInt(String(item.rentalDays))),
      )

      if (invalidItems.length > 0) {
        console.error("Invalid cart items:", invalidItems)
        setError("Some items in your cart have invalid prices or rental days")
        setIsLoading(false)
        return
      }

      setCart(cartItems)

      // Calculate cart totals
      const totals = calculateCartTotal(cartItems)
      setCartTotals(totals)

      console.log("Cart totals:", totals)

      const getClientSecret = async () => {
        try {
          setIsLoading(true)
          const { clientSecret } = await createPaymentIntent()
          setClientSecret(clientSecret)
        } catch (err: any) {
          console.error("Payment setup error:", err)
          setError(err.message || "Failed to set up payment. Please try again.")
        } finally {
          setIsLoading(false)
        }
      }

      getClientSecret()
    } catch (err: any) {
      console.error("Cart initialization error:", err)
      setError("Failed to initialize cart. Please try again.")
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Setting up payment...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-500">Payment Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
            <div className="mt-4 flex justify-center">
              <button onClick={() => router.push("/cart")} className="rounded-md bg-primary px-4 py-2 text-white">
                Return to Cart
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="grid gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              {clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#0f172a",
                      },
                    },
                  }}
                >
                  <PaymentForm
                    clientSecret={clientSecret}
                    amount={cartTotals.total}
                    items={cart}
                    shippingDetails={{}} // This would be populated from a shipping form
                  />
                </Elements>
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item, index) => {
                  const price = Number.parseFloat(String(item.price)) || 0
                  const days = Number.parseInt(String(item.rentalDays)) || 1
                  const itemTotal = price * days

                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.name} ({days} days)
                      </span>
                      <span>${itemTotal.toFixed(2)}</span>
                    </div>
                  )
                })}
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${cartTotals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${cartTotals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
