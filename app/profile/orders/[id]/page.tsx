"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getOrderById } from "@/lib/storage-utils"
import type { Order } from "@/lib/models/order"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (params.id) {
      const orderData = getOrderById(params.id as string)
      setOrder(orderData)

      if (!orderData) {
        router.push("/profile/orders")
      }
    }
  }, [params.id, router])

  if (!order) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push("/profile/orders")} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Orders
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Order #{order.id.replace("order_", "")}</CardTitle>
            <div className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <h3 className="font-medium mb-2">Payment Information</h3>
                <div className="text-sm">
                  <p>Status: {order.paymentStatus}</p>
                  <p>Payment ID: {order.paymentId || "N/A"}</p>
                  <p>Total: ${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="font-medium">${(item.price * item.quantity * item.days).toFixed(2)}</div>
                      </div>

                      <div className="text-sm text-gray-500">
                        {item.quantity} × ${item.price.toFixed(2)} × {item.days} days
                      </div>
                    </div>
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

      <div className="flex justify-center">
        <Link href="/browse">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
