"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Star,
  Truck,
  Package,
  CheckCircle2,
  Info,
  Store,
  CalendarIcon,
} from "lucide-react"
import Link from "next/link"
import { getOrdersAsLister } from "@/lib/storage-utils"
import { getCurrentUser } from "@/lib/user-utils"
import type { Order } from "@/lib/models/order"
import { useToast } from "@/components/ui/use-toast"

export default function ShopRentalsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [rentals, setRentals] = useState<Order[]>([])
  const [activeRentals, setActiveRentals] = useState<Order[]>([])
  const [reservedRentals, setReservedRentals] = useState<Order[]>([])
  const [completedRentals, setCompletedRentals] = useState<Order[]>([])
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Get current user
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Get shop rentals
    const userId = currentUser?.id || "current_user"
    const shopRentals = getOrdersAsLister(userId)
    setRentals(shopRentals)

    // Filter rentals by status
    const now = new Date()

    const active = shopRentals.filter(
      (rental) => (rental.status === "active" || rental.status === "shipped") && new Date(rental.endDate) >= now,
    )

    const reserved = shopRentals.filter(
      (rental) => (rental.status === "pending" || rental.status === "processing") && rental.status !== "cancelled",
    )

    const completed = shopRentals.filter(
      (rental) =>
        rental.status === "completed" ||
        rental.status === "returned" ||
        rental.status === "cancelled" ||
        new Date(rental.endDate) < now,
    )

    setActiveRentals(active)
    setReservedRentals(reserved)
    setCompletedRentals(completed)

    // Listen for storage events to update rentals when they change
    const handleStorageChange = () => {
      const updatedRentals = getOrdersAsLister(userId)
      setRentals(updatedRentals)

      // Re-filter rentals
      const now = new Date()

      const active = updatedRentals.filter(
        (rental) => (rental.status === "active" || rental.status === "shipped") && new Date(rental.endDate) >= now,
      )

      const reserved = updatedRentals.filter(
        (rental) => (rental.status === "pending" || rental.status === "processing") && rental.status !== "cancelled",
      )

      const completed = updatedRentals.filter(
        (rental) =>
          rental.status === "completed" ||
          rental.status === "returned" ||
          rental.status === "cancelled" ||
          new Date(rental.endDate) < now,
      )

      setActiveRentals(active)
      setReservedRentals(reserved)
      setCompletedRentals(completed)
    }

    window.addEventListener("ordersUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("ordersUpdated", handleStorageChange)
    }
  }, [])

  // For demo purposes, let's create some sample data if no rentals exist
  useEffect(() => {
    if (rentals.length === 0) {
      const sampleRentals = [
        {
          id: "order_active1",
          userId: "customer1",
          status: "active",
          paymentStatus: "paid",
          startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          total: 120,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              id: "item1",
              name: "Designer Dress",
              price: 40,
              quantity: 1,
              days: 7,
              image: "/placeholder.svg?height=300&width=300&text=Designer+Dress",
              listerId: "current_user",
              customerName: "Emily Johnson",
              customerAvatar: "/placeholder.svg?height=40&width=40&text=EJ",
              customerId: "customer1",
              reviewCount: 12,
            },
          ],
          shippingDetails: {
            name: "Emily Johnson",
            email: "emily@example.com",
            address: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
            phone: "555-123-4567",
          },
        },
        {
          id: "order_reserved1",
          userId: "customer2",
          status: "processing",
          paymentStatus: "paid",
          startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
          endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(), // 17 days from now
          total: 90,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              id: "item2",
              name: "Luxury Handbag",
              price: 30,
              quantity: 1,
              days: 7,
              image: "/placeholder.svg?height=300&width=300&text=Luxury+Handbag",
              listerId: "current_user",
              customerName: "Michael Smith",
              customerAvatar: "/placeholder.svg?height=40&width=40&text=MS",
              customerId: "customer2",
              reviewCount: 5,
            },
          ],
          shippingDetails: {
            name: "Michael Smith",
            email: "michael@example.com",
            address: "456 Park Ave",
            city: "New York",
            state: "NY",
            zip: "10022",
            phone: "555-987-6543",
          },
        },
        {
          id: "order_completed1",
          userId: "customer3",
          status: "completed",
          paymentStatus: "paid",
          startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
          endDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), // 13 days ago
          total: 150,
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              id: "item3",
              name: "Designer Suit",
              price: 50,
              quantity: 1,
              days: 7,
              image: "/placeholder.svg?height=300&width=300&text=Designer+Suit",
              listerId: "current_user",
              customerName: "Sarah Williams",
              customerAvatar: "/placeholder.svg?height=40&width=40&text=SW",
              customerId: "customer3",
              reviewCount: 8,
            },
          ],
          shippingDetails: {
            name: "Sarah Williams",
            email: "sarah@example.com",
            address: "789 Broadway",
            city: "New York",
            state: "NY",
            zip: "10003",
            phone: "555-456-7890",
          },
        },
      ] as Order[]

      // Store sample rentals in localStorage
      sampleRentals.forEach((rental) => {
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]")
        if (!allOrders.some((order: Order) => order.id === rental.id)) {
          allOrders.push(rental)
          localStorage.setItem("orders", JSON.stringify(allOrders))
        }
      })

      // Trigger a refresh
      window.dispatchEvent(new Event("ordersUpdated"))
    }
  }, [rentals.length, user])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const handleMessageRenter = (rental: Order) => {
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${rental.items[0].customerName}.`,
      duration: 3000,
    })
  }

  const handleViewDetails = (rental: Order) => {
    toast({
      title: "Details view",
      description: "Viewing detailed information for this rental.",
      duration: 3000,
    })
  }

  const handleModifyDates = (rental: Order) => {
    toast({
      title: "Dates modified",
      description: "The rental dates have been updated successfully.",
      duration: 3000,
    })
  }

  const handleLeaveReview = (rental: Order) => {
    toast({
      title: "Review form opened",
      description: `Write a review for ${rental.items[0].customerName}.`,
      duration: 3000,
    })
  }

  const getStatusIcon = (type: "active" | "reserved" | "completed") => {
    if (type === "active") return <Package className="h-5 w-5 text-green-500" />
    if (type === "reserved") return <Clock className="h-5 w-5 text-blue-500" />
    return <CheckCircle2 className="h-5 w-5 text-gray-500" />
  }

  const getStatusColor = (type: "active" | "reserved" | "completed") => {
    if (type === "active") return "bg-green-100 text-green-800 border-green-200"
    if (type === "reserved") return "bg-blue-100 text-blue-800 border-blue-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const RentalCard = ({ rental, type }: { rental: Order; type: "active" | "reserved" | "completed" }) => {
    const item = rental.items[0] // For simplicity, showing the first item
    const statusColor = getStatusColor(type)

    return (
      <Card
        className="mb-6 overflow-hidden border-t-4 hover:shadow-md transition-shadow duration-200"
        style={{ borderTopColor: type === "active" ? "#10b981" : type === "reserved" ? "#3b82f6" : "#6b7280" }}
      >
        <CardHeader className="relative pb-2 bg-gradient-to-r from-white to-gray-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {getStatusIcon(type)}
              <h3 className="text-lg font-medium ml-2">Order #{rental.id.slice(-6)}</h3>
            </div>
            <Badge className={statusColor}>
              {type === "active" ? "Active" : type === "reserved" ? "Reserved" : "Completed"}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
          </div>
        </CardHeader>
        <CardContent className="pb-2 pt-4">
          <div className="flex gap-4">
            <div className="w-28 h-28 bg-muted rounded-md overflow-hidden">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-lg">{item.name}</h4>
              <div className="text-sm text-muted-foreground mt-1">
                ${item.price}/day × {item.days} days
              </div>
              <div className="mt-2 text-sm font-medium">Total: ${rental.total}</div>
              <div className="flex items-center mt-2">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={item.customerAvatar || "/placeholder.svg"} />
                  <AvatarFallback>{item.customerName?.charAt(0) || "C"}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{item.customerName}</span>
                <div className="flex items-center ml-2 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                  <span>{item.reviewCount} reviews</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">
                Shipping to: {rental.shippingDetails?.city}, {rental.shippingDetails?.state}
              </span>
            </div>

            {type === "active" && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Truck className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">Return expected by: {formatDate(rental.endDate)}</span>
              </div>
            )}

            {type === "reserved" && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">
                  Ship by: {formatDate(new Date(new Date(rental.startDate).getTime() - 2 * 24 * 60 * 60 * 1000))}
                </span>
              </div>
            )}

            {type === "completed" && (
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">Completed on {formatDate(rental.endDate)}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-4 flex flex-wrap gap-2 bg-gray-50">
          {type === "active" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMessageRenter(rental)}
                className="bg-white hover:bg-gray-100"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Renter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails(rental)}
                className="bg-white hover:bg-gray-100"
              >
                <Info className="h-4 w-4 mr-2" />
                Details
              </Button>
            </>
          )}

          {type === "reserved" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMessageRenter(rental)}
                className="bg-white hover:bg-gray-100"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Renter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleModifyDates(rental)}
                className="bg-white hover:bg-gray-100"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Modify Dates
              </Button>
            </>
          )}

          {type === "completed" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLeaveReview(rental)}
                className="bg-white hover:bg-gray-100"
              >
                <Star className="h-4 w-4 mr-2" />
                Leave a Review
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails(rental)}
                className="bg-white hover:bg-gray-100"
              >
                <Info className="h-4 w-4 mr-2" />
                Details
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    )
  }

  const EmptyState = ({ type }: { type: "active" | "reserved" | "completed" }) => {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100">
          {type === "active" ? (
            <Package className="h-8 w-8 text-gray-400" />
          ) : type === "reserved" ? (
            <Clock className="h-8 w-8 text-gray-400" />
          ) : (
            <CheckCircle2 className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-medium mb-2">
          {type === "active"
            ? "No active rentals"
            : type === "reserved"
              ? "No reserved rentals"
              : "No completed rentals"}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {type === "active"
            ? "You don't have any active rentals from your shop at the moment."
            : type === "reserved"
              ? "You don't have any reserved rentals scheduled."
              : "You haven't completed any rentals yet."}
        </p>
        <Button asChild>
          <Link href="/list-item">
            <Store className="h-4 w-4 mr-2" />
            List an Item
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Store's Rentals</h1>
        <p className="text-muted-foreground">Manage your active, reserved, and completed rentals all in one place.</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-8 border border-blue-100">
        <div className="flex items-start">
          <div className="bg-white p-2 rounded-full mr-4">
            <Store className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium text-blue-700">Managing Your Rentals</h3>
            <p className="text-sm text-blue-600">
              Remember to ship reserved items promptly and communicate with your renters for a great experience!
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full md:w-auto">
          <TabsTrigger value="active" className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>Active</span>
            {activeRentals.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeRentals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reserved" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Reserved</span>
            {reservedRentals.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {reservedRentals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Completed</span>
            {completedRentals.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {completedRentals.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          {activeRentals.length === 0 ? (
            <EmptyState type="active" />
          ) : (
            activeRentals.map((rental) => <RentalCard key={rental.id} rental={rental} type="active" />)
          )}
        </TabsContent>

        <TabsContent value="reserved" className="mt-0">
          {reservedRentals.length === 0 ? (
            <EmptyState type="reserved" />
          ) : (
            reservedRentals.map((rental) => <RentalCard key={rental.id} rental={rental} type="reserved" />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          {completedRentals.length === 0 ? (
            <EmptyState type="completed" />
          ) : (
            completedRentals.map((rental) => <RentalCard key={rental.id} rental={rental} type="completed" />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
