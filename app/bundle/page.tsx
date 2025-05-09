"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarIcon,
  ChevronLeft,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash,
  PlusCircle,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { BundleSearch } from "@/components/bundle-search"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BundlePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>(undefined)
  const [bundleItems, setBundleItems] = useState<any[]>([])
  const [rentalOptions, setRentalOptions] = useState([{ id: 1, duration: 1, price: 100 }])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    const userId = localStorage.getItem("opencloset_user_id")
    setIsLoggedIn(!!userId)
  }, [])

  // Load bundle items from localStorage
  useEffect(() => {
    try {
      const storedBundle = localStorage.getItem("opencloset_bundle")
      if (storedBundle) {
        setBundleItems(JSON.parse(storedBundle))
      } else {
        setBundleItems([])
      }
    } catch (error) {
      console.error("Error loading bundle:", error)
      setBundleItems([])
    }

    // Listen for bundle updates
    const handleBundleUpdate = (event: any) => {
      if (event.detail?.bundle) {
        setBundleItems(event.detail.bundle)
      }
    }

    window.addEventListener("opencloset-bundle-updated", handleBundleUpdate)

    return () => {
      window.removeEventListener("opencloset-bundle-updated", handleBundleUpdate)
    }
  }, [])

  const handleRemoveItem = (id: string) => {
    const updatedItems = bundleItems.filter((item) => item.id !== id)
    setBundleItems(updatedItems)

    // Update localStorage
    localStorage.setItem("opencloset_bundle", JSON.stringify(updatedItems))

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("opencloset-bundle-updated", {
        detail: { bundle: updatedItems },
      }),
    )

    toast.success("Item removed from bundle")
  }

  const handleUpdateQuantity = (id: string, change: number) => {
    const updatedItems = bundleItems.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    })

    setBundleItems(updatedItems)

    // Update localStorage
    localStorage.setItem("opencloset_bundle", JSON.stringify(updatedItems))

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("opencloset-bundle-updated", {
        detail: { bundle: updatedItems },
      }),
    )
  }

  const calculateTotalDays = () => {
    if (!selectedDates || selectedDates.length < 2) return 0

    const startDate = selectedDates[0]
    const endDate = selectedDates[selectedDates.length - 1]

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    return diffDays
  }

  const totalDays = calculateTotalDays()
  const subtotal = bundleItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1) * totalDays, 0)
  const serviceFee = Math.round(subtotal * 0.1)
  const total = subtotal + serviceFee

  const handleCheckout = () => {
    if (!selectedDates || selectedDates.length < 2) {
      toast.error("Please select rental dates")
      return
    }

    if (bundleItems.length === 0) {
      toast.error("Your bundle is empty")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Bundle checkout successful!")
      router.push("/dashboard")
    }, 1500)
  }

  const handleAddRentalOption = () => {
    const newId = rentalOptions.length > 0 ? Math.max(...rentalOptions.map((option) => option.id)) + 1 : 1

    setRentalOptions([...rentalOptions, { id: newId, duration: 1, price: 100 }])
  }

  const handleRemoveRentalOption = (id: number) => {
    if (rentalOptions.length <= 1) {
      toast.error("You must have at least one rental option")
      return
    }
    setRentalOptions(rentalOptions.filter((option) => option.id !== id))
  }

  const handleRentalOptionChange = (id: number, field: "duration" | "price", value: number) => {
    setRentalOptions(
      rentalOptions.map((option) => {
        if (option.id === id) {
          return { ...option, [field]: value }
        }
        return option
      }),
    )
  }

  const handleAddItemFromSearch = (item: any) => {
    // Check if item is already in bundle
    if (bundleItems.some((bundleItem) => bundleItem.id === item.id)) {
      toast.info(`${item.name} is already in your bundle`)
      return
    }

    // Add item to bundle
    const newItem = {
      id: item.id,
      name: item.name,
      designer: item.designer,
      price: item.rentalPrice || item.price,
      retailPrice: item.retailPrice || (item.rentalPrice || item.price) * 10,
      size: item.size || "M",
      quantity: 1,
      image: item.media?.[0]?.url || "/placeholder.svg?height=200&width=150",
    }

    const updatedItems = [...bundleItems, newItem]
    setBundleItems(updatedItems)

    // Update localStorage
    localStorage.setItem("opencloset_bundle", JSON.stringify(updatedItems))

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("opencloset-bundle-updated", {
        detail: { bundle: updatedItems },
      }),
    )

    toast.success(`${item.name} added to your bundle`)
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/browse" className="flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Browse
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6 font-cinzel">Your Bundle</h1>

          {!isLoggedIn ? (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-alegreya">
                <Link href="/auth/signin" className="font-medium underline">
                  Sign in
                </Link>{" "}
                to create and manage your bundles.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2 font-playfair">Add Your Listed Items to Bundle</h2>
              <p className="text-sm text-muted-foreground mb-4 font-alegreya">
                Search and add items you've listed to create a bundle for potential renters.
              </p>
              <BundleSearch onAddItem={handleAddItemFromSearch} />
            </div>
          )}

          {bundleItems.length === 0 ? (
            <Card className="text-center p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-medium font-playfair">Your bundle is empty</h2>
                <p className="text-muted-foreground font-alegreya">
                  Add your listed items to create a bundle for potential renters.
                </p>
                <Button asChild>
                  <Link href="/list-item">List an Item</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {bundleItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-1/4 sm:w-1/5">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h3 className="font-medium font-playfair">{item.name}</h3>
                            <p className="text-sm text-muted-foreground font-alegreya">{item.designer}</p>
                            <p className="text-sm mt-1 font-alegreya">Size: {item.size}</p>
                          </div>
                          <div className="mt-2 sm:mt-0 text-right">
                            <p className="font-medium font-playfair">${item.price}/day</p>
                            <p className="text-sm text-muted-foreground font-alegreya">Retail: ${item.retailPrice}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-3 font-alegreya">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 font-cinzel">Rental Options</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {rentalOptions.map((option) => (
                    <div key={option.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium font-playfair">Rental Option {option.id}</h3>
                        {rentalOptions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveRentalOption(option.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`duration-${option.id}`} className="font-alegreya">
                            Duration (weeks)
                          </Label>
                          <Input
                            id={`duration-${option.id}`}
                            type="number"
                            min="1"
                            value={option.duration}
                            onChange={(e) =>
                              handleRentalOptionChange(option.id, "duration", Number.parseInt(e.target.value) || 1)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`price-${option.id}`} className="font-alegreya">
                            Price ($)
                          </Label>
                          <Input
                            id={`price-${option.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={option.price}
                            onChange={(e) =>
                              handleRentalOptionChange(option.id, "price", Number.parseFloat(e.target.value) || 0)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" className="w-full" onClick={handleAddRentalOption}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Another Option
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 font-cinzel">Bundle Benefits</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mr-4">
                      <span className="font-medium text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium font-playfair">Create complete looks</h3>
                      <p className="text-sm text-muted-foreground font-alegreya">
                        Bundle your items together to create attractive complete looks for renters.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mr-4">
                      <span className="font-medium text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium font-playfair">Increase rental chances</h3>
                      <p className="text-sm text-muted-foreground font-alegreya">
                        Bundles are more likely to be rented than individual items.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mr-4">
                      <span className="font-medium text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium font-playfair">Earn more</h3>
                      <p className="text-sm text-muted-foreground font-alegreya">
                        Increase your earnings by renting multiple items at once.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="font-cinzel">Bundle Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2 font-playfair">Select Availability Dates</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDates?.length === 2
                        ? `${selectedDates[0].toLocaleDateString()} - ${selectedDates[1].toLocaleDateString()}`
                        : "Select dates"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={selectedDates}
                      onSelect={setSelectedDates}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {selectedDates?.length === 2 && bundleItems.length > 0 && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-alegreya">Available Period:</span>
                    <span className="font-alegreya">{totalDays} days</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="font-alegreya">Total Items:</span>
                    <span className="font-alegreya">{bundleItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-alegreya">Bundle Value:</span>
                    <span className="font-alegreya">${subtotal}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium text-base">
                    <span className="font-playfair">Potential Earnings:</span>
                    <span className="font-playfair">${Math.round(subtotal * 0.9)}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={isLoading || bundleItems.length === 0 || !selectedDates || selectedDates.length < 2}
                onClick={handleCheckout}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Publish Bundle"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
