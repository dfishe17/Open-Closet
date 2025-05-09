"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function ListItemNewPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState(null)

  // Form state
  const [name, setName] = useState("")
  const [designer, setDesigner] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [size, setSize] = useState("")
  const [condition, setCondition] = useState("Like New")
  const [color, setColor] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [aesthetic, setAesthetic] = useState("")
  const [images, setImages] = useState([])
  const [availableForRent, setAvailableForRent] = useState(true)

  useEffect(() => {
    // Get user data
    try {
      const storedUser = localStorage.getItem("stylerent_user")
      if (storedUser) {
        setUserData(JSON.parse(storedUser))
      } else {
        router.push("/auth/signin")
      }
    } catch (error) {
      console.error("Error retrieving user data:", error)
    }
  }, [router])

  // Mock image upload
  const handleImageUpload = (e) => {
    e.preventDefault()
    const newImage = {
      id: `img-${Date.now()}`,
      url: "/placeholder.svg?height=400&width=300",
      type: "image",
    }
    setImages([...images, newImage])
    toast.success("Image uploaded successfully!")
  }

  const removeImage = (imageId) => {
    setImages(images.filter((img) => img.id !== imageId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create a new item
      const newItem = {
        id: `item-${Date.now()}`,
        name,
        designer,
        description,
        category,
        size,
        condition,
        color,
        basePrice: Number.parseFloat(basePrice) || 0,
        pricingTiers: {
          tier1: (Number.parseFloat(basePrice) || 0) * 0.05, // Days 1-3: 5%
          tier2: (Number.parseFloat(basePrice) || 0) * 0.04, // Days 4-7: 4%
          tier3: (Number.parseFloat(basePrice) || 0) * 0.03, // Days 8-14: 3%
          tier4: (Number.parseFloat(basePrice) || 0) * 0.02, // Days 15+: 2%
        },
        aesthetic,
        status: availableForRent ? "Available" : "Not Available",
        forRent: availableForRent,
        forSale: false,
        media: images.length > 0 ? images : [{ type: "image", url: "/placeholder.svg?height=400&width=300" }],
        images: images.length > 0 ? images.map((img) => img.url) : ["/placeholder.svg?height=400&width=300"],
        userId: userData?.id || "demo-user",
        ownerId: userData?.id || "demo-user",
        listerId: userData?.id || "demo-user",
        createdAt: new Date().toISOString(),
        ownerName: userData?.name || "Demo User",
        ownerAvatar: userData?.avatar || "/placeholder.svg?height=40&width=40",
      }

      // Store in localStorage
      const existingItems = JSON.parse(localStorage.getItem("stylerent_items") || "[]")
      localStorage.setItem("stylerent_items", JSON.stringify([...existingItems, newItem]))

      // Notify listeners
      window.dispatchEvent(new Event("itemsUpdated"))

      toast.success("Item successfully listed!")
      setTimeout(() => {
        router.push("/profile")
      }, 1000)
    } catch (error) {
      console.error("Error listing item:", error)
      toast.error("Failed to list item. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate example rental prices based on a sample base price
  const sampleBasePrice = 200
  const examplePrices = {
    tier1: (sampleBasePrice * 0.05).toFixed(2),
    tier2: (sampleBasePrice * 0.04).toFixed(2),
    tier3: (sampleBasePrice * 0.03).toFixed(2),
    tier4: (sampleBasePrice * 0.02).toFixed(2),
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">List an Item</h1>
          <p className="text-muted-foreground">Share your style with the community</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/profile">Back to Profile</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name*</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vintage Denim Jacket"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designer">Designer/Brand</Label>
                  <Input
                    id="designer"
                    value={designer}
                    onChange={(e) => setDesigner(e.target.value)}
                    placeholder="Levi's, Gucci, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description*</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your item in detail..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category*</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tops">Tops</SelectItem>
                        <SelectItem value="Bottoms">Bottoms</SelectItem>
                        <SelectItem value="Dresses">Dresses</SelectItem>
                        <SelectItem value="Outerwear">Outerwear</SelectItem>
                        <SelectItem value="Activewear">Activewear</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Shoes">Shoes</SelectItem>
                        <SelectItem value="Formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Size*</Label>
                    <Select value={size} onValueChange={setSize} required>
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XXS">XXS</SelectItem>
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                        <SelectItem value="XXXL">XXXL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition*</Label>
                    <Select value={condition} onValueChange={setCondition} required>
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New with tags">New with tags</SelectItem>
                        <SelectItem value="Like New">Like New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Worn">Worn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Primary Color</Label>
                    <Select value={color} onValueChange={setColor}>
                      <SelectTrigger id="color">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="White">White</SelectItem>
                        <SelectItem value="Red">Red</SelectItem>
                        <SelectItem value="Blue">Blue</SelectItem>
                        <SelectItem value="Green">Green</SelectItem>
                        <SelectItem value="Yellow">Yellow</SelectItem>
                        <SelectItem value="Purple">Purple</SelectItem>
                        <SelectItem value="Pink">Pink</SelectItem>
                        <SelectItem value="Brown">Brown</SelectItem>
                        <SelectItem value="Gray">Gray</SelectItem>
                        <SelectItem value="Orange">Orange</SelectItem>
                        <SelectItem value="Multi">Multi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aesthetic">Aesthetic</Label>
                  <Select value={aesthetic} onValueChange={setAesthetic}>
                    <SelectTrigger id="aesthetic">
                      <SelectValue placeholder="Select aesthetic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Bohemian">Bohemian</SelectItem>
                      <SelectItem value="Vintage">Vintage</SelectItem>
                      <SelectItem value="Streetwear">Streetwear</SelectItem>
                      <SelectItem value="Minimalist">Minimalist</SelectItem>
                      <SelectItem value="Preppy">Preppy</SelectItem>
                      <SelectItem value="Athleisure">Athleisure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column - Images & Pricing */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative rounded-md overflow-hidden border">
                        <img src={image.url || "/placeholder.svg"} alt="Product" className="w-full h-40 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {images.length < 4 && (
                      <div
                        className="border-2 border-dashed rounded-md flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-muted transition-colors"
                        onClick={handleImageUpload}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-8 w-8 text-muted-foreground mb-2"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <p className="text-sm text-muted-foreground">Upload Image</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Pricing</h3>

                  <div className="space-y-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="available-for-rent"
                        checked={availableForRent}
                        onCheckedChange={setAvailableForRent}
                      />
                      <Label htmlFor="available-for-rent">Available for Rent</Label>
                    </div>

                    {availableForRent && (
                      <div className="space-y-4 pl-8">
                        <div className="space-y-2">
                          <Label htmlFor="base-price">Base Price ($)*</Label>
                          <Input
                            id="base-price"
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="0.01"
                            value={basePrice}
                            onChange={(e) => setBasePrice(e.target.value)}
                            placeholder="0.00"
                            required={availableForRent}
                          />
                          <p className="text-xs text-muted-foreground">
                            This is the base value of your item for calculating rental rates
                          </p>
                        </div>

                        {basePrice && Number(basePrice) > 0 && (
                          <div className="bg-background p-3 rounded-md border">
                            <h4 className="text-sm font-medium mb-2">Daily Rate Breakdown</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex justify-between">
                                <span>Days 1-3:</span>
                                <span className="font-medium">${(Number(basePrice) * 0.05).toFixed(2)}/day (5%)</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Days 4-7:</span>
                                <span className="font-medium">${(Number(basePrice) * 0.04).toFixed(2)}/day (4%)</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Days 8-14:</span>
                                <span className="font-medium">${(Number(basePrice) * 0.03).toFixed(2)}/day (3%)</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Days 15+:</span>
                                <span className="font-medium">${(Number(basePrice) * 0.02).toFixed(2)}/day (2%)</span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-md border border-primary/20">
                  <h3 className="font-medium mb-2">Pricing Guide</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium text-foreground">How to Set Your Base Price</h4>
                      <p className="mt-1 text-muted-foreground">
                        Your base price should reflect the current market value of your item. Consider factors like:
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                        <li>Brand/designer prestige</li>
                        <li>Current condition</li>
                        <li>Seasonality and demand</li>
                        <li>Uniqueness and rarity</li>
                        <li>Original purchase price (typically 50-100% of original cost)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground">Recommended Base Prices by Category</h4>
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Designer dresses:</span>
                          <span className="font-medium">$200-800</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Casual tops:</span>
                          <span className="font-medium">$30-100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Premium denim:</span>
                          <span className="font-medium">$80-200</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Luxury handbags:</span>
                          <span className="font-medium">$500-2000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Statement jewelry:</span>
                          <span className="font-medium">$100-400</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Designer shoes:</span>
                          <span className="font-medium">$150-600</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Outerwear:</span>
                          <span className="font-medium">$100-500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Formal attire:</span>
                          <span className="font-medium">$200-1000</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground">Understanding Our Tiered Pricing Model</h4>
                      <p className="mt-1 text-muted-foreground">
                        Our pricing model encourages longer rentals by offering lower daily rates for extended periods:
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                        <li>
                          <span className="font-medium">Short rentals (1-3 days):</span> 5% of base price per day -
                          ideal for weekend events
                        </li>
                        <li>
                          <span className="font-medium">Medium rentals (4-7 days):</span> 4% of base price per day -
                          perfect for week-long trips
                        </li>
                        <li>
                          <span className="font-medium">Longer rentals (8-14 days):</span> 3% of base price per day -
                          great for vacations
                        </li>
                        <li>
                          <span className="font-medium">Extended rentals (15+ days):</span> 2% of base price per day -
                          best for seasonal needs
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground">Example Calculation</h4>
                      <p className="mt-1 text-muted-foreground">
                        For a designer dress with a base price of ${sampleBasePrice}:
                      </p>
                      <ul className="mt-2 space-y-1 text-muted-foreground">
                        <li>
                          3-day weekend rental: ${examplePrices.tier1}/day × 3 days = $
                          {(Number(examplePrices.tier1) * 3).toFixed(2)}
                        </li>
                        <li>
                          7-day vacation rental: ${examplePrices.tier1}/day × 3 days + ${examplePrices.tier2}/day × 4
                          days = ${(Number(examplePrices.tier1) * 3 + Number(examplePrices.tier2) * 4).toFixed(2)}
                        </li>
                        <li>
                          30-day seasonal rental: ${examplePrices.tier1}/day × 3 days + ${examplePrices.tier2}/day × 4
                          days + ${examplePrices.tier3}/day × 7 days + ${examplePrices.tier4}/day × 16 days = $
                          {(
                            Number(examplePrices.tier1) * 3 +
                            Number(examplePrices.tier2) * 4 +
                            Number(examplePrices.tier3) * 7 +
                            Number(examplePrices.tier4) * 16
                          ).toFixed(2)}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground">Pricing Strategy Tips</h4>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                        <li>Items in excellent condition can command higher base prices</li>
                        <li>Seasonal items (like winter coats) may rent better with lower off-season rates</li>
                        <li>Unique or rare pieces often justify premium pricing</li>
                        <li>Consider your target renter's budget when setting prices</li>
                        <li>Monitor rental activity and adjust pricing as needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Listing Item..." : "List Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
