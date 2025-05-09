"use client"

import { useState, useEffect } from "react"
import { Loader2, Trash2, Clock, Tag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { BundleItemSlider } from "@/components/bundle-item-slider"

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

interface CreateBundleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateBundleModal({ open, onOpenChange, onSuccess }: CreateBundleModalProps) {
  const router = useRouter()
  const [newBundleName, setNewBundleName] = useState("")
  const [newBundleDescription, setNewBundleDescription] = useState("")
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [isCreatingBundle, setIsCreatingBundle] = useState(false)
  const [selectedAesthetic, setSelectedAesthetic] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [suggestedPrice, setSuggestedPrice] = useState<string>("")

  // Time-based discounts
  const [timeDiscounts, setTimeDiscounts] = useState([
    { days: 7, percentage: 5 },
    { days: 14, percentage: 10 },
    { days: 30, percentage: 15 },
  ])

  // Item quantity-based discounts
  const [itemDiscounts, setItemDiscounts] = useState([
    { quantity: 2, percentage: 5 },
    { quantity: 3, percentage: 10 },
    { quantity: 5, percentage: 15 },
  ])

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      resetForm()
    }
  }, [open])

  const resetForm = () => {
    setNewBundleName("")
    setNewBundleDescription("")
    setSelectedAesthetic("")
    setSelectedSize("")
    setSuggestedPrice("")
    setSelectedItems([])
    setTimeDiscounts([
      { days: 7, percentage: 5 },
      { days: 14, percentage: 10 },
      { days: 30, percentage: 15 },
    ])
    setItemDiscounts([
      { quantity: 2, percentage: 5 },
      { quantity: 3, percentage: 10 },
      { quantity: 5, percentage: 15 },
    ])
  }

  const updateTimeDiscount = (index: number, field: "days" | "percentage", value: number) => {
    const updatedDiscounts = [...timeDiscounts]
    updatedDiscounts[index][field] = value
    setTimeDiscounts(updatedDiscounts)
  }

  const updateItemDiscount = (index: number, field: "quantity" | "percentage", value: number) => {
    const updatedDiscounts = [...itemDiscounts]
    updatedDiscounts[index][field] = value
    setItemDiscounts(updatedDiscounts)
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
        size: selectedSize || undefined,
        suggestedPrice: suggestedPrice ? Number.parseFloat(suggestedPrice) : undefined,
        createdAt: new Date().toISOString(),
        items: selectedItems,
        userId: userId,
        ownerId: userId,
        ownerName: userName,
        ownerAvatar: "/placeholder.svg?height=40&width=40",
        isPublished: true,
        timeDiscounts: timeDiscounts,
        itemDiscounts: itemDiscounts,
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

      // Close dialog and reset form
      onOpenChange(false)
      resetForm()

      // Show success message
      toast.success(`Created new bundle: ${newBundle.name}`)

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error creating bundle:", error)
      toast.error("Failed to create bundle")
    } finally {
      setIsCreatingBundle(false)
    }
  }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create New Bundle</DialogTitle>
          <DialogDescription>
            Group your items together to create attractive complete looks for renters.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4 overflow-y-auto">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bundle-name">Bundle Name</Label>
              <Input id="bundle-name" value={newBundleName} onChange={(e) => setNewBundleName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bundle-description">Description</Label>
              <Textarea
                id="bundle-description"
                value={newBundleDescription}
                onChange={(e) => setNewBundleDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bundle-aesthetic">Aesthetic</Label>
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

              <div className="space-y-2">
                <Label htmlFor="bundle-size">Size</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger id="bundle-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XS">XS</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bundle-price">Suggested Price ($/day)</Label>
              <Input
                id="bundle-price"
                type="text"
                inputMode="decimal"
                value={suggestedPrice}
                onChange={(e) => setSuggestedPrice(e.target.value)}
              />
            </div>

            {/* Time-based Discount Sliders */}
            <div className="space-y-4 p-4 border rounded-md">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Time-Based Discounts</h3>
              </div>
              <p className="text-sm text-muted-foreground">Set discounts based on rental duration</p>

              {timeDiscounts.map((discount, index) => (
                <div key={`time-${index}`} className="space-y-2 pt-2 border-t first:border-t-0 first:pt-0">
                  <div className="flex justify-between">
                    <Label>For rentals {discount.days}+ days</Label>
                    <Badge variant="outline">{discount.percentage}% off</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Days</Label>
                      <Slider
                        value={[discount.days]}
                        min={1}
                        max={90}
                        step={1}
                        onValueChange={(value) => updateTimeDiscount(index, "days", value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1</span>
                        <span>30</span>
                        <span>90</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Discount %</Label>
                      <Slider
                        value={[discount.percentage]}
                        min={0}
                        max={50}
                        step={5}
                        onValueChange={(value) => updateTimeDiscount(index, "percentage", value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Item Quantity-based Discount Sliders */}
            <div className="space-y-4 p-4 border rounded-md">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Item Quantity Discounts</h3>
              </div>
              <p className="text-sm text-muted-foreground">Set discounts based on number of items rented</p>

              {itemDiscounts.map((discount, index) => (
                <div key={`item-${index}`} className="space-y-2 pt-2 border-t first:border-t-0 first:pt-0">
                  <div className="flex justify-between">
                    <Label>For {discount.quantity}+ items</Label>
                    <Badge variant="outline">{discount.percentage}% off</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Items</Label>
                      <Slider
                        value={[discount.quantity]}
                        min={2}
                        max={10}
                        step={1}
                        onValueChange={(value) => updateItemDiscount(index, "quantity", value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>2</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Discount %</Label>
                      <Slider
                        value={[discount.percentage]}
                        min={0}
                        max={50}
                        step={5}
                        onValueChange={(value) => updateItemDiscount(index, "percentage", value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Add Items to Bundle</Label>
              <div className="max-h-[300px] overflow-y-auto pr-2">
                <BundleItemSlider onAddItem={handleAddItemToBundle} />
              </div>
            </div>

            {selectedItems.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Items ({selectedItems.length})</Label>
                <ScrollArea className="h-[200px] border rounded-md p-2">
                  <div className="space-y-2">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex items-center p-2 rounded-md hover:bg-muted">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          <img
                            src={(item.media && item.media[0]?.url) || "/placeholder.svg?height=48&width=48"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-3 flex-1 overflow-hidden">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">${item.rentalPrice || item.price}/day</p>
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
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
              "Create Bundle"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
