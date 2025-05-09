"use client"

import { useState } from "react"
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

export default function ListItem() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [designer, setDesigner] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [size, setSize] = useState("")
  const [condition, setCondition] = useState("Like New")
  const [color, setColor] = useState("")
  const [rentalPrice, setRentalPrice] = useState("")
  const [retailPrice, setRetailPrice] = useState("")
  const [aesthetic, setAesthetic] = useState("")
  const [images, setImages] = useState([])
  const [availableForRent, setAvailableForRent] = useState(true)
  const [availableForSale, setAvailableForSale] = useState(false)
  const [salePrice, setSalePrice] = useState("")

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
      // Get user data
      const userData = JSON.parse(localStorage.getItem("stylerent_user") || '{"id":"demo-user"}')

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
        rentalPrice: Number.parseFloat(rentalPrice) || 0,
        retailPrice: Number.parseFloat(retailPrice) || 0,
        salePrice: availableForSale ? Number.parseFloat(salePrice) || 0 : null,
        aesthetic,
        status: availableForRent ? "Available" : "Not Available",
        forRent: availableForRent,
        forSale: availableForSale,
        media: images.length > 0 ? images : [{ type: "image", url: "/placeholder.svg?height=400&width=300" }],
        images: images.length > 0 ? images.map((img) => img.url) : ["/placeholder.svg?height=400&width=300"],
        userId: userData.id,
        ownerId: userData.id,
        listerId: userData.id,
        createdAt: new Date().toISOString(),
        ownerName: userData.name || "Demo User",
        ownerAvatar: userData.avatar || "/placeholder.svg?height=40&width=40",
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
                  <h3 className="font-medium mb-2">Pricing Options</h3>

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
                      <div className="space-y-2 pl-8">
                        <Label htmlFor="rental-price">Rental Price per Day ($)*</Label>
                        <Input
                          id="rental-price"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          value={rentalPrice}
                          onChange={(e) => setRentalPrice(e.target.value)}
                          placeholder="0.00"
                          required={availableForRent}
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="available-for-sale"
                        checked={availableForSale}
                        onCheckedChange={setAvailableForSale}
                      />
                      <Label htmlFor="available-for-sale">Available for Sale</Label>
                    </div>

                    {availableForSale && (
                      <div className="space-y-2 pl-8">
                        <Label htmlFor="sale-price">Sale Price ($)*</Label>
                        <Input
                          id="sale-price"
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.01"
                          value={salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                          placeholder="0.00"
                          required={availableForSale}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="retail-price">Original Retail Price ($)</Label>
                    <Input
                      id="retail-price"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      value={retailPrice}
                      onChange={(e) => setRetailPrice(e.target.value)}
                      placeholder="0.00"
                    />
                    <p className="text-xs text-muted-foreground">
                      Original retail price helps renters understand the value
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-md border border-primary/20">
                  <h3 className="font-medium mb-2">Pricing Tips</h3>
                  <p className="text-sm text-muted-foreground">
                    Most items rent for 5-15% of their retail price per day. For example, a $100 dress might rent for
                    $5-15 per day.
                  </p>
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
