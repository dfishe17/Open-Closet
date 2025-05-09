"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Upload, ImagePlus } from "lucide-react"

export default function ListItemPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  // Form fields
  const [name, setName] = useState("")
  const [designer, setDesigner] = useState("")
  const [category, setCategory] = useState("")
  const [condition, setCondition] = useState("")
  const [aesthetic, setAesthetic] = useState("")
  const [basePrice, setBasePrice] = useState("")
  const [description, setDescription] = useState("")

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem("stylerent_user")
      if (user) {
        const userData = JSON.parse(user)
        setIsLoggedIn(true)
        setUserId(userData.id)
        setUserName(userData.name)
      } else {
        setIsLoggedIn(false)
        // Redirect to login page if not logged in
        router.push("/login")
      }
    }

    checkLoginStatus()
  }, [router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPreviewImages: string[] = []
    const newImages: string[] = []

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result) {
          newPreviewImages.push(reader.result.toString())
          newImages.push(reader.result.toString())
          setPreviewImages([...previewImages, ...newPreviewImages])
          setImages([...images, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn) {
      toast.error("Please log in to list an item")
      return
    }

    if (!name || !category || !condition || !basePrice) {
      toast.error("Please fill in all required fields")
      return
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image")
      return
    }

    setIsSubmitting(true)

    try {
      // Create media array from images
      const media = images.map((image) => ({
        url: image,
        type: "image",
      }))

      // Create new item object
      const newItem = {
        id: `item-${Date.now()}`,
        name,
        designer: designer || undefined,
        category,
        condition,
        aesthetic: aesthetic || undefined,
        basePrice: Number.parseFloat(basePrice),
        description: description || undefined,
        media,
        ownerId: userId,
        ownerName: userName,
        createdAt: new Date().toISOString(),
        status: "Available",
      }

      // Get existing items from localStorage
      const existingItemsJSON = localStorage.getItem("stylerent_items") || "[]"
      const existingItems = JSON.parse(existingItemsJSON)

      // Add new item
      const updatedItems = [...existingItems, newItem]

      // Save back to localStorage
      localStorage.setItem("stylerent_items", JSON.stringify(updatedItems))

      // Show success message
      toast.success("Item listed successfully!")

      // Redirect to profile page
      router.push("/profile")
    } catch (error) {
      console.error("Error listing item:", error)
      toast.error("Failed to list item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">List an Item</h1>
          <p className="text-muted-foreground">Share your fashion items with others and earn money from rentals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* CARD 1: Photos Upload */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5" />
                Add Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your images here, or click to browse
                  </p>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" onClick={() => document.getElementById("images")?.click()}>
                    Select Images
                  </Button>
                </div>

                {previewImages.length > 0 && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {previewImages.map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                            onClick={() => {
                              const newImages = [...images]
                              const newPreviewImages = [...previewImages]
                              newImages.splice(index, 1)
                              newPreviewImages.splice(index, 1)
                              setImages(newImages)
                              setPreviewImages(newPreviewImages)
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: Basic Information */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardTitle className="flex items-center gap-2">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Title*</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Describe your item</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Share details about your item that will help renters make a decision..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dresses">Dresses</SelectItem>
                      <SelectItem value="Tops">Tops</SelectItem>
                      <SelectItem value="Bottoms">Bottoms</SelectItem>
                      <SelectItem value="Outerwear">Outerwear</SelectItem>
                      <SelectItem value="Activewear">Activewear</SelectItem>
                      <SelectItem value="Swimwear">Swimwear</SelectItem>
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Shoes">Shoes</SelectItem>
                      <SelectItem value="Bags">Bags</SelectItem>
                      <SelectItem value="Jewelry">Jewelry</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 3: Enhance Your Listing */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardTitle className="flex items-center gap-2">Enhance Your Listing</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="designer">Designer/Brand</Label>
                  <Input id="designer" value={designer} onChange={(e) => setDesigner(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition*</Label>
                  <Select value={condition} onValueChange={setCondition} required>
                    <SelectTrigger id="condition">
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
            </CardContent>
          </Card>

          {/* CARD 4: Pricing */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardTitle className="flex items-center gap-2">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price ($)*</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This is the base price used to calculate rental rates:
                </p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Daily Rate: 10% of base price</li>
                  <li>Weekly Rate: 30% of base price</li>
                  <li>Monthly Rate: 60% of base price</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Listing...
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
