"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Heart, ShoppingCart, Share2, Ruler, Star, MessageSquare } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getItemById } from "@/lib/item-utils"
import { addToCart } from "@/lib/cart-utils"
import { RentalPriceCalculator } from "@/components/rental-price-calculator"
import { FollowButton } from "@/components/follow-button"
import Link from "next/link"
import { InsuranceOptions, type InsuranceOption } from "@/components/insurance-options"
import { InsuranceInfo } from "@/components/insurance-info"

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [rentalDays, setRentalDays] = useState(3)
  const [rentalPrice, setRentalPrice] = useState(0)
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceOption | null>(null)

  useEffect(() => {
    const fetchItem = () => {
      try {
        const fetchedItem = getItemById(params.id)
        if (fetchedItem) {
          setItem(fetchedItem)
          // Set the first image as selected by default
          if (fetchedItem.images && fetchedItem.images.length > 0) {
            setSelectedImage(fetchedItem.images[0])
          } else if (fetchedItem.media && fetchedItem.media.length > 0) {
            const firstImage = fetchedItem.media.find((m: any) => m.type === "image")
            if (firstImage) {
              setSelectedImage(firstImage.url)
            }
          }
        } else {
          toast({
            title: "Error",
            description: "Item not found",
            variant: "destructive",
          })
          router.push("/browse")
        }
      } catch (error) {
        console.error("Error fetching item:", error)
        toast({
          title: "Error",
          description: "Error loading item details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [params.id, router])

  function handleAddToCart() {
    if (item) {
      const cartItem = {
        ...item,
        rentalDays,
        insurance: selectedInsurance,
      }
      addToCart(cartItem, rentalDays)
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      })
    }
  }

  const handleRentNow = () => {
    if (item) {
      const cartItem = {
        ...item,
        rentalDays,
        insurance: selectedInsurance,
      }
      addToCart(cartItem, rentalDays)
      router.push("/checkout")
    }
  }

  const handlePriceCalculated = (price: number, days: number) => {
    setRentalDays(days)
    setRentalPrice(price)
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex animate-pulse flex-col space-y-8">
          <div className="h-8 w-1/4 rounded bg-muted"></div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="aspect-square rounded bg-muted"></div>
            <div className="space-y-4">
              <div className="h-8 rounded bg-muted"></div>
              <div className="h-4 w-1/2 rounded bg-muted"></div>
              <div className="h-24 rounded bg-muted"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Item not found</h1>
          <p className="mt-4 text-muted-foreground">The item you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-6" onClick={() => router.push("/browse")}>
            Browse Items
          </Button>
        </div>
      </div>
    )
  }

  // Extract media from the item
  const images = item.images || []
  const mediaImages = item.media?.filter((m: any) => m.type === "image").map((m: any) => m.url) || []
  const allImages = [...images, ...mediaImages]

  // If no images are available, use a placeholder
  if (allImages.length === 0) {
    allImages.push("/placeholder.svg?height=600&width=600")
  }

  // If no selected image, use the first one
  if (!selectedImage && allImages.length > 0) {
    setSelectedImage(allImages[0])
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" size="sm" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={selectedImage || "/placeholder.svg?height=600&width=600"}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>

          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {allImages.map((image: string, index: number) => (
                <div
                  key={index}
                  className={`aspect-square cursor-pointer overflow-hidden rounded-md border-2 ${
                    selectedImage === image ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${item.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <div className="mt-4 space-y-2">
              <div className="text-2xl font-bold">${item.price} / day</div>

              {/* Add insurance info */}
              <InsuranceInfo compact />

              {/* Rest of the pricing section */}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.category && (
              <Badge variant="secondary" className="font-normal">
                {item.category}
              </Badge>
            )}
            {item.condition && (
              <Badge variant="outline" className="font-normal">
                {item.condition}
              </Badge>
            )}
            {item.size && (
              <Badge variant="outline" className="flex items-center gap-1 font-normal">
                <Ruler className="h-3 w-3" />
                {item.size}
              </Badge>
            )}
            {item.aesthetic && (
              <Badge variant="outline" className="font-normal">
                {item.aesthetic}
              </Badge>
            )}
          </div>

          {item.ownerName && (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <img
                  src={item.ownerAvatar || "/placeholder.svg?height=40&width=40"}
                  alt={item.ownerName}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">Listed by {item.ownerName}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                    <span>{item.ownerRating || "4.8"}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/messages?user=${item.ownerId || "owner"}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Link>
                </Button>
                <FollowButton userId={item.ownerId || "owner"} />
              </div>
            </div>
          )}

          <Separator />

          <div>
            <h2 className="mb-2 text-lg font-semibold">Description</h2>
            <p className="text-muted-foreground">{item.description}</p>
          </div>

          <Separator />

          <div>
            <h2 className="mb-4 text-lg font-semibold">Rental Options</h2>
            <Card>
              <CardContent className="p-4">
                <RentalPriceCalculator
                  initialBasePrice={item.baseRentalPrice || item.price}
                  onPriceCalculated={handlePriceCalculated}
                />
                {item.insurance && (
                  <div className="mt-4 pt-4 border-t">
                    <InsuranceOptions itemValue={item.baseRentalPrice || item.price} onSelect={setSelectedInsurance} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex space-x-4">
            <Button className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleRentNow}>
              Rent Now
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Brand</h3>
                  <p className="text-sm text-muted-foreground">{item.designer || item.brand || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Condition</h3>
                  <p className="text-sm text-muted-foreground">{item.condition || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Size</h3>
                  <p className="text-sm text-muted-foreground">{item.size || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Category</h3>
                  <p className="text-sm text-muted-foreground">{item.category || "Not specified"}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="pt-4">
              <p className="text-sm text-muted-foreground">
                Free shipping on all rentals. Items are typically delivered within 2-3 business days. Return shipping
                label is included with your order.
              </p>
            </TabsContent>
            <TabsContent value="policies" className="pt-4">
              <p className="text-sm text-muted-foreground">
                All rentals include insurance for minor wear and tear. Significant damage or loss may incur additional
                fees. Rentals can be canceled up to 48 hours before the rental period for a full refund.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
