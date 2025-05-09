"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShippingForm } from "@/components/checkout/shipping-form"
import { PaymentForm } from "@/components/checkout/payment-form"
import { getCart, clearCart, saveOrder } from "@/lib/storage-utils"
import { getCurrentUser } from "@/lib/user-utils"
import { generateId } from "@/lib/utils"
import { ShoppingBag, CreditCard, Truck, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutPage() {
  const [activeTab, setActiveTab] = useState("shipping")
  const [cart, setCart] = useState<any>({ items: [] })
  const [shippingDetails, setShippingDetails] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const cartData = getCart()
    setCart(cartData)

    // Pre-fill shipping details from user profile if available
    const user = getCurrentUser()
    if (user && user.shippingDetails) {
      setShippingDetails(user.shippingDetails)
    }
  }, [])

  const handleShippingSubmit = (data: any) => {
    setShippingDetails(data)
    setActiveTab("payment")
  }

  const handlePaymentSubmit = async () => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Get current user
      const user = getCurrentUser()
      const userId = user?.id || "guest_user"

      // Calculate rental period (default to 7 days if not specified)
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 7) // Default 7-day rental

      // Create order
      const order = {
        id: `order_${generateId()}`,
        userId,
        items: cart.items.map((item: any) => ({
          ...item,
          days: item.days || 7,
        })),
        total: cart.items.reduce((sum: number, item: any) => sum + item.price * (item.days || 7), 0),
        status: "processing",
        paymentStatus: "paid",
        paymentId: `pi_${Math.random().toString(36).substring(2, 15)}`,
        shippingDetails,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save order to localStorage
      saveOrder(order)

      // Clear cart
      clearCart()

      // Update user profile with rental information
      if (user) {
        const updatedUser = {
          ...user,
          rentals: [...(user.rentals || []), order.id],
          // Update rental stats
          totalRentals: (user.totalRentals || 0) + 1,
          activeRentals: (user.activeRentals || 0) + 1,
        }

        localStorage.setItem("stylerent_user", JSON.stringify(updatedUser))

        // Update users array
        const users = JSON.parse(localStorage.getItem("stylerent_users") || "[]")
        const userIndex = users.findIndex((u: any) => u.id === user.id)
        if (userIndex >= 0) {
          users[userIndex] = updatedUser
          localStorage.setItem("stylerent_users", JSON.stringify(users))
        }
      }

      setIsComplete(true)
      setActiveTab("confirmation")

      // Show success toast
      toast({
        title: "Order placed successfully!",
        description: "Your rental order has been confirmed.",
        duration: 5000,
      })

      // Redirect to confirmation page after a delay
      setTimeout(() => {
        router.push(`/order-confirmation?orderId=${order.id}`)
      }, 3000)
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="shipping" disabled={activeTab === "confirmation"} className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden sm:inline">Shipping</span>
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                disabled={!shippingDetails || activeTab === "confirmation"}
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Payment</span>
              </TabsTrigger>
              <TabsTrigger value="confirmation" disabled={!isComplete} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Confirmation</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="shipping">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ShippingForm onSubmit={handleShippingSubmit} defaultValues={shippingDetails} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentForm
                    onSubmit={handlePaymentSubmit}
                    isProcessing={isProcessing}
                    total={cart.items.reduce((sum: number, item: any) => sum + item.price * (item.days || 7), 0)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="confirmation">
              <Card>
                <CardHeader>
                  <CardTitle>Order Confirmed!</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="rounded-full bg-green-100 p-3 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Thank you for your order</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Your rental has been confirmed. You'll receive a confirmation email shortly.
                    </p>
                    <p className="text-sm text-center mb-6">Redirecting to order confirmation page...</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button asChild>
                    <a href="/my-rentals">View My Rentals</a>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.items.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${item.price}/day × {item.days || 7} days
                      </p>
                      <p className="text-sm font-medium mt-1">${item.price * (item.days || 7)}</p>
                    </div>
                  </div>
                ))}

                {cart.items.length === 0 && (
                  <div className="text-center py-6">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                )}
              </div>

              <div className="border-t mt-6 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cart.items.reduce((sum: number, item: any) => sum + item.price * (item.days || 7), 0)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Insurance Deposit (25%)</span>
                  <span>
                    $
                    {(
                      cart.items.reduce((sum: number, item: any) => sum + item.price * (item.days || 7), 0) * 0.25
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-medium text-lg mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>
                    $
                    {(
                      cart.items.reduce((sum: number, item: any) => sum + item.price * (item.days || 7), 0) * 1.25
                    ).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  *Insurance deposit is refunded when items are returned in good condition
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
