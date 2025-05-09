"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { clearCart } from "@/lib/cart-utils"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get("status") || "success"
  const [orderNumber, setOrderNumber] = useState<string>("")

  useEffect(() => {
    // Generate a random order number
    const generateOrderNumber = () => {
      const timestamp = new Date().getTime()
      const random = Math.floor(Math.random() * 1000)
      return `ORD-${timestamp}-${random}`
    }

    setOrderNumber(generateOrderNumber())

    // Clear the cart on successful payment
    if (status === "success") {
      clearCart()
    }
  }, [status])

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {status === "success"
              ? "Order Confirmed!"
              : status === "processing"
                ? "Payment Processing"
                : "Payment Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {status === "success" ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : status === "processing" ? (
            <Loader2 className="h-16 w-16 animate-spin text-amber-500" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500" />
          )}

          <div className="text-center">
            {status === "success" && (
              <>
                <p className="mb-2">Thank you for your order!</p>
                <p className="text-sm text-muted-foreground">
                  Your order number is: <span className="font-medium">{orderNumber}</span>
                </p>
                <p className="mt-4 text-sm">We've sent a confirmation email with your order details.</p>
              </>
            )}

            {status === "processing" && <p>Your payment is being processed. We'll update you once it's complete.</p>}

            {status === "failed" && <p>There was an issue processing your payment. Please try again.</p>}
          </div>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            {status === "success" ? (
              <>
                <Button asChild>
                  <Link href="/browse">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/profile">View Order History</Link>
                </Button>
              </>
            ) : status === "processing" ? (
              <Button asChild>
                <Link href="/profile">Check Order Status</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/cart">Return to Cart</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
