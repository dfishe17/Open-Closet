"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { formatAmountForStripe } from "@/lib/stripe-config"
import { saveOrder } from "@/lib/storage-utils"
import type { Order } from "@/lib/models/order"

interface PaymentFormProps {
  amount: number
  items: any[]
  shippingDetails: any
}

export function PaymentForm({ amount, items, shippingDetails }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Create a payment intent on the server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: formatAmountForStripe(amount),
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const { clientSecret } = await response.json()

      // Confirm the payment with the card element
      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        throw new Error("Card element not found")
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingDetails.name,
            email: shippingDetails.email,
            address: {
              line1: shippingDetails.address,
              city: shippingDetails.city,
              state: shippingDetails.state,
              postal_code: shippingDetails.zip,
              country: "US",
            },
          },
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      if (paymentIntent.status === "succeeded") {
        // Create and save the order
        const newOrder: Order = {
          id: `order_${Date.now()}`,
          userId: "current_user", // In a real app, get this from auth
          items: items,
          total: amount,
          status: "processing",
          paymentStatus: "paid",
          paymentId: paymentIntent.id,
          shippingDetails: shippingDetails,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        saveOrder(newOrder)

        // Redirect to confirmation page
        router.push(`/checkout/confirmation?orderId=${newOrder.id}`)
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      setErrorMessage(error.message || "An error occurred during payment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Payment Information</h3>
        <div className="border rounded-md p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Total: ${amount.toFixed(2)}</div>
        <Button type="submit" disabled={!stripe || isLoading} className="w-1/3">
          {isLoading ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  )
}
