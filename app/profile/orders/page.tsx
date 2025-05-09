"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getOrdersByUserId } from "@/lib/storage-utils"
import type { Order } from "@/lib/models/order"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // In a real app, this would use the authenticated user's ID
    const userOrders = getOrdersByUserId("current_user")
    setOrders(userOrders)
  }, [])

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

  if (orders.length === 0) {
    return (
      <div className="container py-10 text-center">
        <div className="flex justify-center mb-4">
          <Package className="h-16 w-16 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
        <p className="mb-6">You haven't placed any orders yet.</p>
        <Link href="/browse">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order #{order.id.replace("order_", "")}</CardTitle>
                <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                  </div>
                </div>

                <div className="border-t pt-2 flex justify-between font-bold">
                  <div>Total</div>
                  <div>${order.total.toFixed(2)}</div>
                </div>

                <div className="pt-2">
                  <Link href={`/profile/orders/${order.id}`}>
                    <Button variant="outline" className="w-full">
                      View Order Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
