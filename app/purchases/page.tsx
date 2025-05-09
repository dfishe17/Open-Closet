"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Package, ShoppingBag, User } from "lucide-react"
import { getOrdersByUserId } from "@/lib/storage-utils"

export default function PurchasesPage() {
  const [activeRentals, setActiveRentals] = useState([])
  const [completedRentals, setCompletedRentals] = useState([])
  const [userData, setUserData] = useState(null)
  const [activeTab, setActiveTab] = useState("active")

  useEffect(() => {
    // Get user data
    const storedUser = localStorage.getItem("stylerent_user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUserData(parsedUser)

      // Get orders for rentals
      try {
        // For items the user is renting from others
        const renterOrders = getOrdersByUserId(parsedUser.id)

        // Split into active and completed rentals
        const active = renterOrders.filter(
          (order) => order.status === "active" || order.status === "processing" || order.status === "shipped",
        )
        const completed = renterOrders.filter(
          (order) => order.status === "completed" || order.status === "returned" || order.status === "cancelled",
        )

        // Enhance orders with additional information for display
        const enhancedActive = active.map((order) => ({
          ...order,
          items: order.items.map((item) => ({
            ...item,
            location: item.location || "New York, NY",
            returnDue: item.returnDue || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            renter: item.renter || "StyleRent Verified Lender",
          })),
        }))

        const enhancedCompleted = completed.map((order) => ({
          ...order,
          items: order.items.map((item) => ({
            ...item,
            location: item.location || "New York, NY",
            returnDue: item.returnDue || new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            renter: item.renter || "StyleRent Verified Lender",
          })),
        }))

        setActiveRentals(enhancedActive)
        setCompletedRentals(enhancedCompleted)
      } catch (error) {
        console.error("Error retrieving rental data:", error)
      }
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif">My Purchases</h1>
          <p className="text-muted-foreground">Manage your active and completed rentals</p>
        </div>
        <Button asChild>
          <Link href="/browse">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse More Items
          </Link>
        </Button>
      </div>

      {/* Main Tabs: Active Rentals and Completed Rentals */}
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="active">Active Rentals</TabsTrigger>
          <TabsTrigger value="completed">Completed Rentals</TabsTrigger>
        </TabsList>

        {/* Active Rentals Tab */}
        <TabsContent value="active">
          {activeRentals.length > 0 ? (
            <div className="space-y-6">
              {activeRentals.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.substring(0, 8)}</CardTitle>
                        <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
                      </div>
                      <Badge className="bg-primary">{order.status.toUpperCase()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-1 md:grid-cols-4 gap-6 border-b pb-6 last:border-0 last:pb-0"
                        >
                          {/* Item Info */}
                          <div className="md:col-span-1">
                            <div className="flex gap-4 items-center">
                              <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium">{item.name}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <User className="h-3 w-3 mr-1" />
                                  <span>{item.renter}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="md:col-span-1 flex items-center">
                            <div>
                              <p className="text-sm font-medium mb-1">Location</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{item.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Return Due */}
                          <div className="md:col-span-1 flex items-center">
                            <div>
                              <p className="text-sm font-medium mb-1">Return Due</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{new Date(item.returnDue).toLocaleDateString()}</span>
                              </div>
                              <div className="mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {Math.ceil((new Date(item.returnDue) - new Date()) / (1000 * 60 * 60 * 24))} days left
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="md:col-span-1 flex items-center">
                            <div>
                              <p className="text-sm font-medium mb-1">Price</p>
                              <p className="text-lg font-bold">${item.price}/day</p>
                              <p className="text-xs text-muted-foreground">
                                {item.days} days: ${(item.price * item.days).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 flex justify-between">
                    <div>
                      <p className="text-sm font-medium">Total: ${order.total?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/profile/orders/${order.id}`}>View Details</Link>
                      </Button>
                      <Button size="sm">
                        <Package className="mr-2 h-4 w-4" />
                        Track Shipment
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Active Rentals</h3>
              <p className="text-muted-foreground mb-6">You don't have any active rentals at the moment.</p>
              <Button asChild>
                <Link href="/browse">Browse Collection</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Completed Rentals Tab */}
        <TabsContent value="completed">
          {completedRentals.length > 0 ? (
            <div className="space-y-6">
              {completedRentals.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.substring(0, 8)}</CardTitle>
                        <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
                      </div>
                      <Badge variant="outline">{order.status.toUpperCase()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-1 md:grid-cols-4 gap-6 border-b pb-6 last:border-0 last:pb-0"
                        >
                          {/* Item Info */}
                          <div className="md:col-span-1">
                            <div className="flex gap-4 items-center">
                              <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium">{item.name}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <User className="h-3 w-3 mr-1" />
                                  <span>{item.renter}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="md:col-span-1 flex items-center">
                            <div>
                              <p className="text-sm font-medium mb-1">Location</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{item.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Return Date */}
                          <div className="md:col-span-1 flex items-center">
                            <div>
                              <p className="text-sm font-medium mb-1">Returned On</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{new Date(item.returnDue).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="md:col-span-1 flex items-center">
                            <div>
                              <p className="text-sm font-medium mb-1">Price</p>
                              <p className="text-lg font-bold">${item.price}/day</p>
                              <p className="text-xs text-muted-foreground">
                                {item.days} days: ${(item.price * item.days).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 flex justify-between">
                    <div>
                      <p className="text-sm font-medium">Total: ${order.total?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/profile/orders/${order.id}`}>View Details</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/items/${order.items[0]?.id}?rent=true`}>Rent Again</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Rental History</h3>
              <p className="text-muted-foreground mb-6">You haven't completed any rentals yet.</p>
              <Button asChild>
                <Link href="/browse">Browse Collection</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
