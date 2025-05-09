"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload } from "lucide-react"
import { toast } from "sonner"
import { InsuranceOptions, type InsuranceOption } from "@/components/insurance-options"

export default function AddNewItemPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])

  // Form state
  const [name, setName] = useState("")
  const [designer, setDesigner] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [size, setSize] = useState("")
  const [condition, setCondition] = useState("")
  const [color, setColor] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [material, setMaterial] = useState("")
  const [style, setStyle] = useState("")

  // Add a new state for insurance
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceOption | null>(null)

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newFiles])

      // Create URLs for preview
      const newUrls = newFiles.map((file) => URL.createObjectURL(file))
      setImageUrls((prev) => [...prev, ...newUrls])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    const newUrls = [...imageUrls]

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newUrls[index])

    newImages.splice(index, 1)
    newUrls.splice(index, 1)

    setImages(newImages)
    setImageUrls(newUrls)
  }

  const calculateRentalPrices = (basePrice: number) => {
    const dailyRate = basePrice * 0.05
    const weeklyRate = dailyRate * 5 // 5 days price for a week (discount)
    const monthlyRate = dailyRate * 15 // 15 days price for a month (discount)

    return {
      dailyRate: Number.parseFloat(dailyRate.toFixed(2)),
      weeklyRate: Number.parseFloat(weeklyRate.toFixed(2)),
      monthlyRate: Number.parseFloat(monthlyRate.toFixed(2)),
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get current user
      const userJSON = localStorage.getItem("stylerent_user")
      if (!userJSON) {
        toast.error("You must be logged in to list an item")
        router.push("/auth/signin")
        return
      }

      const user = JSON.parse(userJSON)
      const basePriceNum = Number.parseFloat(basePrice)

      if (isNaN(basePriceNum) || basePriceNum <= 0) {
        toast.error("Please enter a valid base price")
        setIsSubmitting(false)
        return
      }

      // Calculate rental prices
      const rentalPrices = calculateRentalPrices(basePriceNum)

      // Calculate insurance options based on base price
      const insuranceOption = selectedInsurance
        ? {
            id: selectedInsurance.id,
            name: selectedInsurance.name,
            price: selectedInsurance.price,
            description: selectedInsurance.description,
            coverage: selectedInsurance.coverage,
          }
        : null

      // Process images - in a real app, you'd upload these to a server
      // For now, we'll just use the file objects and create URLs
      const mediaItems =
        images.length > 0
          ? images.map((file, index) => ({
              id: `media-${Date.now()}-${index}`,
              url: URL.createObjectURL(file),
              type: file.type.startsWith("image") ? "image" : "video",
              name: file.name,
            }))
          : [
              {
                id: `media-${Date.now()}-placeholder`,
                url: "/placeholder.svg?height=300&width=300",
                type: "image",
                name: "placeholder",
              },
            ]

      // Create new item object
      const newItem = {
        id: `item-${Date.now()}`,
        name,
        designer,
        description,
        category,
        size,
        condition,
        color,
        material,
        style,
        basePrice: basePriceNum,
        rentalPrice: rentalPrices.dailyRate,
        weeklyPrice: rentalPrices.weeklyRate,
        monthlyPrice: rentalPrices.monthlyRate,
        media: mediaItems,
        ownerId: user.id,
        ownerName: user.name,
        status: "Available",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        insurance: insuranceOption,
      }

      // Get existing items
      const existingItemsJSON = localStorage.getItem("stylerent_items") || "[]"
      const existingItems = JSON.parse(existingItemsJSON)

      // Add new item
      const updatedItems = [...existingItems, newItem]

      // Save to localStorage
      localStorage.setItem("stylerent_items", JSON.stringify(updatedItems))

      // Trigger update event
      window.dispatchEvent(new Event("itemsUpdated"))

      // Show success message
      toast.success("Item listed successfully!")

      // Redirect to profile and scroll to top
      router.push("/profile")
      window.scrollTo(0, 0)
    } catch (error) {
      console.error("Error listing item:", error)
      toast.error("Failed to list item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const basePriceNum = Number.parseFloat(basePrice)

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight font-serif">List a New Item</h1>
          <p className="text-muted-foreground">Share your fashion items with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Item Details</h2>

            <div className="flex flex-col gap-6 w-full">
              {/* Item Name */}
              <div className="w-full">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder=""
                  className="w-full mt-1"
                />
              </div>

              {/* Brand */}
              <div className="w-full">
                <Label htmlFor="designer">Brand *</Label>
                <Input
                  id="designer"
                  value={designer}
                  onChange={(e) => setDesigner(e.target.value)}
                  required
                  placeholder=""
                  className="w-full mt-1"
                />
              </div>

              {/* Category */}
              <div className="w-full">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category" className="w-full mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dresses">Dresses</SelectItem>
                    <SelectItem value="Tops">Tops</SelectItem>
                    <SelectItem value="Bottoms">Bottoms</SelectItem>
                    <SelectItem value="Outerwear">Outerwear</SelectItem>
                    <SelectItem value="Activewear">Activewear</SelectItem>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Shoes">Shoes</SelectItem>
                    <SelectItem value="Bags">Bags</SelectItem>
                    <SelectItem value="Jewelry">Jewelry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Size */}
              <div className="w-full">
                <Label htmlFor="size">Size *</Label>
                <Select value={size} onValueChange={setSize} required>
                  <SelectTrigger id="size" className="w-full mt-1">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XS">XS</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                    <SelectItem value="XXL">XXL</SelectItem>
                    <SelectItem value="One Size">One Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Condition */}
              <div className="w-full">
                <Label htmlFor="condition">Condition *</Label>
                <Select value={condition} onValueChange={setCondition} required>
                  <SelectTrigger id="condition" className="w-full mt-1">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New with tags">New with tags</SelectItem>
                    <SelectItem value="Like new">Like new</SelectItem>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color */}
              <div className="w-full">
                <Label htmlFor="color">Color *</Label>
                <Input
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  required
                  placeholder=""
                  className="w-full mt-1"
                />
              </div>

              {/* Material */}
              <div className="w-full">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder=""
                  className="w-full mt-1"
                />
              </div>

              {/* Style */}
              <div className="w-full">
                <Label htmlFor="style">Style</Label>
                <Input
                  id="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder=""
                  className="w-full mt-1"
                />
              </div>

              {/* Base Price */}
              <div className="w-full">
                <Label htmlFor="basePrice">Base Price ($) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  required
                  placeholder=""
                  className="w-full mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This is the estimated value of your item. We'll use this to calculate fair rental rates.
                </p>

                {basePrice && !isNaN(Number.parseFloat(basePrice)) && Number.parseFloat(basePrice) > 0 && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h3 className="font-medium mb-2">Estimated Rental Rates:</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium">Days 1-3: 5% of base price per day</p>
                        <p className="ml-4">${(Number.parseFloat(basePrice) * 0.05).toFixed(2)} per day</p>
                      </div>
                      <div>
                        <p className="font-medium">Days 4-7: 4% of base price per day</p>
                        <p className="ml-4">${(Number.parseFloat(basePrice) * 0.04).toFixed(2)} per day</p>
                      </div>
                      <div>
                        <p className="font-medium">Days 8-14: 3% of base price per day</p>
                        <p className="ml-4">${(Number.parseFloat(basePrice) * 0.03).toFixed(2)} per day</p>
                      </div>
                      <div>
                        <p className="font-medium">Days 15+: 2% of base price per day</p>
                        <p className="ml-4">${(Number.parseFloat(basePrice) * 0.02).toFixed(2)} per day</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="w-full">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder=""
                  rows={4}
                  className="w-full mt-1"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Insurance Options</h2>
            <p className="text-muted-foreground mb-6">
              Offer insurance options to protect your items when they're rented out. Insurance fees are refundable if
              the item is returned in the same condition.
            </p>

            <InsuranceOptions itemValue={basePriceNum || 0} onSelect={setSelectedInsurance} />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Product Images</h2>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop images here, or click to browse</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Upload up to 6 high-quality images. First image will be the cover.
                </p>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById("images")?.click()}>
                  Select Images
                </Button>
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1"
                        onClick={() => removeImage(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                          Cover Image
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                router.back()
                window.scrollTo(0, 0)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Listing Item...
                </>
              ) : (
                "List Item"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
