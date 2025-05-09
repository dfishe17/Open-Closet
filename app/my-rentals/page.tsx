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
  ShoppingBag,
  Package,
  CheckCircle2,
  AlertCircle,
  Heart,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { getOrdersByUserId } from "@/lib/storage-utils"
import { getCurrentUser } from "@/lib/user-utils"
import type { Order } from "@/lib/models/order"
import { useToast } from "@/components/ui/use-toast"

export default function MyRentalsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [rentals, setRentals] = useState<Order[]>([])
  const [activeRentals, setActiveRentals] = useState<Order[]>([])
  const [upcomingRentals, setUpcomingRentals] = useState<Order[]>([])
  const [pastRentals, setPastRentals] = useState<Order[]>([])
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Get current user
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Get user rentals
    const userId = currentUser?.id || "current_user"
    const userRentals = getOrdersByUserId(userId)
    setRentals(userRentals)

    // Filter rentals by status
    const now = new Date()

    const active = userRentals.filter(
      (rental) => (rental.status === "active" || rental.status === "shipped") && new Date(rental.endDate) >= now,
    )

    const upcoming = userRentals.filter(
      (rental) => (rental.status === "pending" || rental.status === "processing") && rental.status !== "cancelled",
    )

    const past = userRentals.filter(
      (rental) =>
        rental.status === "completed" ||
        rental.status === "returned" ||
        rental.status === "cancelled" ||
        new Date(rental.endDate) < now,
    )

    setActiveRentals(active)
    setUpcomingRentals(upcoming)
    setPastRentals(past)

    // Listen for storage events to update rentals when they change
    const handleStorageChange = () => {
      const updatedRentals = getOrdersByUserId(userId)
      setRentals(updatedRentals)

      // Re-filter rentals
      const now = new Date()

      const active = updatedRentals.filter(
        (rental) => (rental.status === "active" || rental.status === "shipped") && new Date(rental.endDate) >= now,
      )

      const upcoming = updatedRentals.filter(
        (rental) => (rental.status === "pending" || rental.status === "processing") && rental.status !== "cancelled",
      )

      const past = updatedRentals.filter(
        (rental) =>
          rental.status === "completed" ||
          rental.status === "returned" ||
          rental.status === "cancelled" ||
          new Date(rental.endDate) < now,
      )

      setActiveRentals(active)
      setUpcomingRentals(upcoming)
      setPastRentals(past)
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
          userId: user?.id || "current_user",
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
              listerId: "seller1",
              listerName: "Fashion Boutique",
              listerAvatar: "/placeholder.svg?height=40&width=40&text=FB",
              reviewCount: 42,
            },
          ],
          shippingDetails: {
            name: "Jane Doe",
            email: "jane@example.com",
            address: "123 Main St",
            city: "New York",
            state: "NY",
            zip: "10001",
            phone: "555-123-4567",
          },
        },
        {
          id: "order_upcoming1",
          userId: user?.id || "current_user",
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
              listerId: "seller2",
              listerName: "Luxury Accessories",
              listerAvatar: "/placeholder.svg?height=40&width=40&text=LA",
              reviewCount: 128,
            },
          ],
          shippingDetails: {
            name: "Jane Doe",
            email: "jane@example.com",
            address: "456 Park Ave",
            city: "New York",
            state: "NY",
            zip: "10022",
            phone: "555-123-4567",
          },
        },
        {
          id: "order_past1",
          userId: user?.id || "current_user",
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
              listerId: "seller3",
              listerName: "Men's Fashion",
              listerAvatar: "/placeholder.svg?height=40&width=40&text=MF",
              reviewCount: 76,
            },
          ],
          shippingDetails: {
            name: "Jane Doe",
            email: "jane@example.com",
            address: "789 Broadway",
            city: "New York",
            state: "NY",
            zip: "10003",
            phone: "555-123-4567",
          },
        },
      ] as Order[]

      // Store sample rentals in localStorage
      sampleRentals.forEach((rental) => {
        const orders = getOrdersByUserId(user?.id || "current_user")
        if (!orders.some((order) => order.id === rental.id)) {
          const allOrders = JSON.parse(localStorage.getItem("orders") || "[]")
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

  const handleReturnEarly = (rentalId: string) => {
    toast({
      title: "Return request submitted",
      description: "We've sent a return label to your email. Please ship the item back within 3 days.",
      duration: 5000,
    })
  }

  const handleContactSeller = (rentalId: string) => {
    toast({
      title: "Message sent",
      description: "Your message has been sent to the seller. They'll respond shortly.",
      duration: 3000,
    })
  }

  const handleModifyDates = (rentalId: string) => {
    toast({
      title: "Modification requested",
      description: "Your request to modify dates has been sent to the seller for approval.",
      duration: 3000,
    })
  }

  const handleCancel = (rentalId: string) => {
    toast({
      title: "Cancellation requested",
      description: "Your cancellation request has been submitted. We'll process it within 24 hours.",
      duration: 3000,
    })
  }

  const handleLeaveReview = (rentalId: string) => {
    // Navigate to review page
    // For now, just show a toast
    toast({
      title: "Review form opened",
      description: "Thank you for sharing your experience!",
      duration: 3000,
    })
  }

  const handleRentAgain = (item: any) => {
    toast({
      title: "Item added to cart",
      description: `${item.name} has been added to your cart.`,
      duration: 3000,
    })
  }

  const getStatusIcon = (type: "active" | "upcoming" | "past") => {
    if (type === "active") return <Package className="h-5 w-5 text-green-500" />
    if (type === "upcoming") return <Clock className="h-5 w-5 text-blue-500" />
    return <CheckCircle2 className="h-5 w-5 text-gray-500" />
  }

  const getStatusColor = (type: "active" | "upcoming" | "past") => {
    if (type === "active") return "bg-green-100 text-green-800 border-green-200"
    if (type === "upcoming") return "bg-blue-100 text-blue-800 border-blue-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const RentalCard = ({ rental, type }: { rental: Order; type: "active" | "upcoming" | "past" }) => {
    const item = rental.items[0] // For simplicity, showing the first item
    const statusColor = getStatusColor(type)

    return (
      <Card
        className="mb-6 overflow-hidden border-t-4 hover:shadow-md transition-shadow duration-200"
        style={{ borderTopColor: type === "active" ? "#10b981" : type === "upcoming" ? "#3b82f6" : "#6b7280" }}
      >
        <CardHeader className="relative pb-2 bg-gradient-to-r from-white to-gray-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {getStatusIcon(type)}
              <h3 className="text-lg font-medium ml-2">Order #{rental.id.slice(-6)}</h3>
            </div>
            <Badge className={statusColor}>
              {type === "active" ? "Active" : type === "upcoming" ? "Upcoming" : "Completed"}
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
                  <AvatarImage src={item.listerAvatar || "/placeholder.svg"} />
                  <AvatarFallback>{item.listerName?.charAt(0) || "S"}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{item.listerName}</span>
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
                <span className="truncate">Return by: {formatDate(rental.endDate)}</span>
              </div>
            )}

            {type === "upcoming" && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">Processing - Will ship soon</span>
              </div>
            )}

            {type === "past" && (
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
                onClick={() => handleReturnEarly(rental.id)}
                className="bg-white hover:bg-gray-100"
              >
                <Truck className="h-4 w-4 mr-2" />
                Return Early
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContactSeller(rental.id)}
                className="bg-white hover:bg-gray-100"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
            </>
          )}

          {type === "upcoming" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleModifyDates(rental.id)}
                className="bg-white hover:bg-gray-100"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Modify Dates
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-600 bg-white hover:bg-gray-100"
                onClick={() => handleCancel(rental.id)}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}

          {type === "past" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLeaveReview(rental.id)}
                className="bg-white hover:bg-gray-100"
              >
                <Star className="h-4 w-4 mr-2" />
                Leave a Review
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRentAgain(item)}
                className="bg-white hover:bg-gray-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Rent Again
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    )
  }

  const EmptyState = ({ type }: { type: "active" | "upcoming" | "past" }) => {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100">
          {type === "active" ? (
            <Package className="h-8 w-8 text-gray-400" />
          ) : type === "upcoming" ? (
            <Clock className="h-8 w-8 text-gray-400" />
          ) : (
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-medium mb-2">
          {type === "active" ? "No active rentals" : type === "upcoming" ? "No upcoming rentals" : "No rental history"}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {type === "active"
            ? "You don't have any active rentals at the moment."
            : type === "upcoming"
              ? "You don't have any upcoming rentals scheduled."
              : "You haven't rented any items yet."}
        </p>
        <Button asChild>
          <Link href="/browse">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Browse Items
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Rentals</h1>
        <p className="text-muted-foreground">Track your active, upcoming, and past rentals all in one place.</p>
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg mb-8 border border-pink-100">
        <div className="flex items-start">
          <div className="bg-white p-2 rounded-full mr-4">
            <Heart className="h-5 w-5 text-pink-500" />
          </div>
          <div>
            <h3 className="font-medium text-pink-700">Enjoy Your Rentals</h3>
            <p className="text-sm text-pink-600">
              Remember to take care of your rented items. Return them in the same condition to get your insurance
              deposit back!
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
          <TabsTrigger value="upcoming" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Upcoming</span>
            {upcomingRentals.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {upcomingRentals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Past</span>
            {pastRentals.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {pastRentals.length}
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

        <TabsContent value="upcoming" className="mt-0">
          {upcomingRentals.length === 0 ? (
            <EmptyState type="upcoming" />
          ) : (
            upcomingRentals.map((rental) => <RentalCard key={rental.id} rental={rental} type="upcoming" />)
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          {pastRentals.length === 0 ? (
            <EmptyState type="past" />
          ) : (
            pastRentals.map((rental) => <RentalCard key={rental.id} rental={rental} type="past" />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
