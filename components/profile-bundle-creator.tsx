"use client"

import { useState } from "react"
import { Loader2, Trash2, Package, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BundleItemSlider } from "@/components/bundle-item-slider"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Item {
  id: string
  name: string
  designer?: string
  price?: number
  rentalPrice?: number
  retailPrice?: number
  media?: Array<{ url: string; type?: string }>
  size?: string
  aesthetic?: string
  category?: string
}

export function ProfileBundleCreator() {
  const router = useRouter()
  const [newBundleName, setNewBundleName] = useState("")
  const [newBundleDescription, setNewBundleDescription] = useState("")
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [isCreatingBundle, setIsCreatingBundle] = useState(false)
  const [selectedAesthetic, setSelectedAesthetic] = useState("")
  const [suggestedPrice, setSuggestedPrice] = useState<string>("")

  const handleAddItemToBundle = (item: Item) => {
    if (!selectedItems.some((selectedItem) => selectedItem.id === item.id)) {
      setSelectedItems([...selectedItems, item])
    } else {
      toast.info(`${item.name} is already in this bundle`)
    }
  }

  const handleRemoveItemFromBundle = (itemId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId))
  }

  const handleCreateBundle = () => {
    if (!newBundleName.trim()) {
      toast.error("Please enter a bundle name")
      return
    }

    if (selectedItems.length === 0) {
      toast.error("Please add at least one item to your bundle")
      return
    }

    setIsCreatingBundle(true)

    try {
      // Get user information
      const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
      const userName = localStorage.getItem("stylerent_user_name") || "User"

      // Create new bundle object
      const newBundle = {
        id: `bundle-${Date.now()}`,
        name: newBundleName.trim(),
        description: newBundleDescription.trim() || undefined,
        aesthetic: selectedAesthetic || undefined,
        suggestedPrice: suggestedPrice ? Number.parseFloat(suggestedPrice) : undefined,
        createdAt: new Date().toISOString(),
        items: selectedItems,
        userId: userId,
        ownerId: userId,
        ownerName: userName,
        ownerAvatar: "/placeholder.svg?height=40&width=40",
        isPublished: true,
      }

      // Get existing bundles
      const storedBundles =
        localStorage.getItem("stylerent_bundles") || localStorage.getItem("opencloset_bundles") || "[]"
      const existingBundles = JSON.parse(storedBundles)

      // Add new bundle
      const updatedBundles = [...existingBundles, newBundle]

      // Save to both storage keys for compatibility
      localStorage.setItem("stylerent_bundles", JSON.stringify(updatedBundles))
      localStorage.setItem("opencloset_bundles", JSON.stringify(updatedBundles))

      // Dispatch event to notify other components
      window.dispatchEvent(
        new CustomEvent("stylerent-bundles-updated", {
          detail: { bundles: updatedBundles },
        }),
      )

      // Reset form
      resetForm()

      // Show success message
      toast.success(`Created new bundle: ${newBundle.name}`)

      // Navigate to bundles page
      router.push("/bundles")
    } catch (error) {
      console.error("Error creating bundle:", error)
      toast.error("Failed to create bundle")
    } finally {
      setIsCreatingBundle(false)
    }
  }

  const resetForm = () => {
    setNewBundleName("")
    setNewBundleDescription("")
    setSelectedAesthetic("")
    setSuggestedPrice("")
    setSelectedItems([])
  }

  return (
    <div className="py-12">
      <div className="container">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create New Bundle</h1>
              <p className="text-muted-foreground">Group your items together to create attractive looks for renters</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/bundles")}>
              View All Bundles
            </Button>
          </div>

          <div className="space-y-8">
            {/* CARD 1: Items, Name, Description */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardTitle className="flex items-center gap-2">Bundle Items & Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {/* Items Selection */}
                <div className="space-y-4">
                  <Label>Add Items to Bundle</Label>
                  <div className="border rounded-md p-4">
                    <BundleItemSlider onAddItem={handleAddItemToBundle} clickToAdd={true} />
                  </div>

                  {/* Selected Items */}
                  <div className="space-y-2">
                    <Label>Selected Items ({selectedItems.length})</Label>
                    {selectedItems.length === 0 ? (
                      <div className="text-center py-8 border rounded-md">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Add items from above to include in your bundle</p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[250px] w-full rounded-md border">
                        <div className="p-4 space-y-2">
                          {selectedItems.map((item) => (
                            <div key={item.id} className="flex items-center p-3 rounded-md border hover:bg-muted">
                              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                <img
                                  src={(item.media && item.media[0]?.url) || "/placeholder.svg?height=64&width=64"}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="ml-3 flex-1 overflow-hidden">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.designer && `${item.designer} • `}${item.rentalPrice || item.price}/day
                                </p>
                                {item.size && (
                                  <Badge variant="outline" className="mt-1">
                                    Size {item.size}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemoveItemFromBundle(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </div>

                {/* Bundle Name & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bundle-name">Bundle Name*</Label>
                    <Input
                      id="bundle-name"
                      value={newBundleName}
                      onChange={(e) => setNewBundleName(e.target.value)}
                      placeholder="Summer Vacation Essentials"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bundle-description">Bundle Description</Label>
                    <Textarea
                      id="bundle-description"
                      value={newBundleDescription}
                      onChange={(e) => setNewBundleDescription(e.target.value)}
                      rows={3}
                      placeholder="Describe your bundle and what makes it special..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CARD 2: Aesthetics */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardTitle className="flex items-center gap-2">Aesthetics</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="bundle-aesthetic">Select Aesthetic Style</Label>
                  <Select value={selectedAesthetic} onValueChange={setSelectedAesthetic}>
                    <SelectTrigger id="bundle-aesthetic">
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
              </CardContent>
            </Card>

            {/* CARD 3: Bundle Price */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardTitle className="flex items-center gap-2">Bundle Price</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="bundle-price">Suggested Price ($/day)</Label>
                  <Input
                    id="bundle-price"
                    type="text"
                    inputMode="decimal"
                    value={suggestedPrice}
                    onChange={(e) => setSuggestedPrice(e.target.value)}
                    placeholder="25.00"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Note: Bundle discounts are managed in your profile settings.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateBundle}
                disabled={isCreatingBundle || !newBundleName.trim() || selectedItems.length === 0}
              >
                {isCreatingBundle ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Bundle
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
