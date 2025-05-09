"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { getOrderById, clearCart } from "@/lib/storage-utils"
import type { Order } from "@/lib/models/order"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (orderId) {
      const orderData = getOrderById(orderId)
      setOrder(orderData)

      // Clear the cart after successful order
      clearCart()
    }
  }, [orderId])

  if (!order) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="mb-6">We couldn't find the order you're looking for.</p>
        <Link href="/browse">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your order. We've sent a confirmation to your email.</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order #{order.id.replace("order_", "")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Order Details</h3>
              <div className="text-sm">
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Status: {order.status}</p>
                <p>Payment: {order.paymentStatus}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Shipping Information</h3>
              <div className="text-sm">
                <p>{order.shippingDetails.name}</p>
                <p>{order.shippingDetails.address}</p>
                <p>
                  {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.zip}
                </p>
                <p>{order.shippingDetails.email}</p>
                <p>{order.shippingDetails.phone}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Items</h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.quantity} × ${item.price.toFixed(2)} × {item.days} days
                      </div>
                    </div>
                    <div className="font-medium">${(item.price * item.quantity * item.days).toFixed(2)}</div>
                  </div>
                ))}

                <div className="border-t pt-2 flex justify-between font-bold">
                  <div>Total</div>
                  <div>${order.total.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Link href="/profile/orders">
          <Button variant="outline">View All Orders</Button>
        </Link>
        <Link href="/browse">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
