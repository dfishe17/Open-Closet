"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Edit, Trash2, Package } from "lucide-react"
import { BundleDiscountSettings } from "@/components/bundle-discount-settings"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { getUserListedItems, createDemoItemsForUser } from "@/lib/item-utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BundleItemSlider } from "@/components/bundle-item-slider"
import AvailableBundles from "@/app/available-bundles"

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

interface Bundle {
  id: string
  name: string
  description?: string
  aesthetic?: string
  size?: string
  suggestedPrice?: number
  createdAt: string
  items: Item[]
  rentalPeriods?: {
    months: number
    discountPercentage: number
  }[]
  userId?: string
  ownerId?: string
  ownerName?: string
  ownerAvatar?: string
  isPublished?: boolean
  timeDiscounts?: {
    months: number
    percentage: number
  }[]
  itemDiscounts?: {
    quantity: number
    percentage: number
  }[]
}

export default function BundlesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("my-bundles")
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [availableBundlesData, setAvailableBundlesData] = useState<Bundle[]>([])
  const [filteredAvailableBundles, setFilteredAvailableBundles] = useState<Bundle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newBundleName, setNewBundleName] = useState("")
  const [newBundleDescription, setNewBundleDescription] = useState("")
  const [isCreatingBundle, setIsCreatingBundle] = useState(false)
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // For item selection
  const [userItems, setUserItems] = useState<Item[]>([])
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [itemSearchQuery, setItemSearchQuery] = useState("")
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [isLoadingItems, setIsLoadingItems] = useState(false)

  const [selectedAesthetic, setSelectedAesthetic] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [suggestedPrice, setSuggestedPrice] = useState<string>("")

  // Time-based discounts - updated to use months
  const [timeDiscounts, setTimeDiscounts] = useState([
    { months: 1, percentage: 10 },
    { months: 2, percentage: 15 },
    { months: 3, percentage: 20 },
  ])

  // Item quantity-based discounts
  const [itemDiscounts, setItemDiscounts] = useState([
    { quantity: 2, percentage: 5 },
    { quantity: 3, percentage: 10 },
    { quantity: 5, percentage: 15 },
  ])

  const [selectedRentalPeriods, setSelectedRentalPeriods] = useState([
    { months: 1, discountPercentage: 10 },
    { months: 2, discountPercentage: 15 },
    { months: 3, discountPercentage: 20 },
  ])

  // Filter states for available bundles
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAesthetic, setFilterAesthetic] = useState("")
  const [filterSize, setFilterSize] = useState("")
  const [sortOption, setSortOption] = useState("newest")

  // Load bundles from localStorage
  useEffect(() => {
    loadBundles()
    loadUserItems()
    loadAvailableBundles()
  }, [])

  // Filter items based on search query
  useEffect(() => {
    if (itemSearchQuery.trim() === "") {
      setFilteredItems(userItems)
    } else {
      const query = itemSearchQuery.toLowerCase()
      const filtered = userItems.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          (item.designer && item.designer.toLowerCase().includes(query)) ||
          (item.category && item.category.toLowerCase().includes(query)) ||
          (item.aesthetic && item.aesthetic.toLowerCase().includes(query)),
      )
      setFilteredItems(filtered)
    }
  }, [itemSearchQuery, userItems])

  // Apply filters to available bundles
  useEffect(() => {
    if (!availableBundlesData.length) return

    let filtered = [...availableBundlesData]

    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (bundle) =>
          bundle.name.toLowerCase().includes(query) ||
          (bundle.description && bundle.description.toLowerCase().includes(query)) ||
          (bundle.aesthetic && bundle.aesthetic.toLowerCase().includes(query)),
      )
    }

    // Apply aesthetic filter
    if (filterAesthetic) {
      filtered = filtered.filter((bundle) => bundle.aesthetic === filterAesthetic)
    }

    // Apply size filter
    if (filterSize) {
      filtered = filtered.filter((bundle) => bundle.size === filterSize)
    }

    // Apply sorting
    if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortOption === "price-low") {
      filtered.sort((a, b) => (a.suggestedPrice || 0) - (b.suggestedPrice || 0))
    } else if (sortOption === "price-high") {
      filtered.sort((a, b) => (b.suggestedPrice || 0) - (a.suggestedPrice || 0))
    } else if (sortOption === "items-count") {
      filtered.sort((a, b) => b.items.length - a.items.length)
    }

    setFilteredAvailableBundles(filtered)
  }, [searchQuery, filterAesthetic, filterSize, sortOption, availableBundlesData])

  const loadUserItems = async () => {
    setIsLoadingItems(true)
    try {
      // Check if user has any items, if not create demo items
      await createDemoItemsForUser()

      // Get user's listed items
      const items = getUserListedItems()
      console.log("User's listed items loaded:", items.length)

      setUserItems(items)
      setFilteredItems(items)
    } catch (error) {
      console.error("Error loading user items:", error)
      toast.error("Failed to load your items")
    } finally {
      setIsLoadingItems(false)
    }
  }

  const loadBundles = () => {
    setIsLoading(true)
    try {
      const storedBundles = localStorage.getItem("stylerent_bundles") || localStorage.getItem("opencloset_bundles")
      if (storedBundles) {
        const parsedBundles = JSON.parse(storedBundles)

        // Get current user ID
        const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")

        // Filter bundles for the current user
        const userBundles = parsedBundles.filter((bundle) => bundle.ownerId === userId)
        setBundles(userBundles)
      } else {
        // Create a default bundle if none exist
        const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
        const userName = localStorage.getItem("stylerent_user_name") || "User"

        const defaultBundle = {
          id: `bundle-${Date.now()}`,
          name: "My First Bundle",
          description: "A collection of items I want to rent together",
          createdAt: new Date().toISOString(),
          items: [],
          userId: userId,
          ownerId: userId,
          ownerName: userName,
          ownerAvatar: "/placeholder.svg",
          isPublished: false,
          timeDiscounts: [
            { months: 1, percentage: 10 },
            { months: 2, percentage: 15 },
            { months: 3, percentage: 20 },
          ],
          itemDiscounts: [
            { quantity: 2, percentage: 5 },
            { quantity: 3, percentage: 10 },
            { quantity: 5, percentage: 15 },
          ],
        }

        localStorage.setItem("stylerent_bundles", JSON.stringify([defaultBundle]))
        setBundles([defaultBundle])
      }
    } catch (error) {
      console.error("Error loading bundles:", error)
      toast.error("Failed to load bundles")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the loadAvailableBundles function to ensure it properly loads bundles
  const loadAvailableBundles = () => {
    try {
      const storedBundles = localStorage.getItem("stylerent_bundles") || localStorage.getItem("opencloset_bundles")
      if (storedBundles) {
        const parsedBundles = JSON.parse(storedBundles)

        // Get current user ID
        const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")

        // Filter bundles that are published and not owned by the current user
        const availableBundles = parsedBundles.filter((bundle) => bundle.isPublished && bundle.ownerId !== userId)

        console.log("Available bundles loaded:", availableBundles.length)

        setAvailableBundlesData(availableBundles)
        setFilteredAvailableBundles(availableBundles)
      } else {
        // Create some demo bundles if none exist
        createDemoBundles()
      }
    } catch (error) {
      console.error("Error loading available bundles:", error)
      toast.error("Failed to load available bundles")
    }
  }

  // Add a function to create demo bundles for testing
  const createDemoBundles = () => {
    const demoBundles = [
      {
        id: `bundle-demo-1`,
        name: "Summer Casual Collection",
        description: "Perfect for warm weather and casual outings",
        aesthetic: "Casual",
        size: "M",
        suggestedPrice: 25,
        createdAt: new Date().toISOString(),
        items: [],
        ownerId: "demo-user-1",
        ownerName: "Style Expert",
        ownerAvatar: "/placeholder.svg",
        isPublished: true,
        timeDiscounts: [
          { months: 1, percentage: 10 },
          { months: 2, percentage: 15 },
          { months: 3, percentage: 20 },
        ],
        itemDiscounts: [
          { quantity: 2, percentage: 5 },
          { quantity: 3, percentage: 10 },
          { quantity: 5, percentage: 15 },
        ],
      },
      {
        id: `bundle-demo-2`,
        name: "Formal Event Package",
        description: "Elegant attire for special occasions",
        aesthetic: "Formal",
        size: "S",
        suggestedPrice: 45,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        items: [],
        ownerId: "demo-user-2",
        ownerName: "Fashion Forward",
        ownerAvatar: "/placeholder.svg",
        isPublished: true,
        timeDiscounts: [
          { months: 1, percentage: 10 },
          { months: 2, percentage: 15 },
          { months: 3, percentage: 20 },
        ],
        itemDiscounts: [
          { quantity: 2, percentage: 5 },
          { quantity: 3, percentage: 10 },
          { quantity: 5, percentage: 15 },
        ],
      },
      {
        id: `bundle-demo-3`,
        name: "Vintage Inspired Collection",
        description: "Classic styles with a modern twist",
        aesthetic: "Vintage",
        size: "L",
        suggestedPrice: 35,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        items: [],
        ownerId: "demo-user-3",
        ownerName: "Retro Rentals",
        ownerAvatar: "/placeholder.svg",
        isPublished: true,
        timeDiscounts: [
          { months: 1, percentage: 10 },
          { months: 2, percentage: 15 },
          { months: 3, percentage: 20 },
        ],
        itemDiscounts: [
          { quantity: 2, percentage: 5 },
          { quantity: 3, percentage: 10 },
          { quantity: 5, percentage: 15 },
        ],
      },
    ]

    // Get existing bundles or initialize empty array
    const existingBundlesStr = localStorage.getItem("stylerent_bundles") || "[]"
    const existingBundles = JSON.parse(existingBundlesStr)

    // Add demo bundles
    const updatedBundles = [...existingBundles, ...demoBundles]

    // Save to localStorage
    localStorage.setItem("stylerent_bundles", JSON.stringify(updatedBundles))
    localStorage.setItem("opencloset_bundles", JSON.stringify(updatedBundles))

    // Update state
    setAvailableBundlesData(demoBundles)
    setFilteredAvailableBundles(demoBundles)

    console.log("Created demo bundles:", demoBundles.length)
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
      const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
      const userName = localStorage.getItem("stylerent_user_name") || "User"

      const newBundle = {
        id: `bundle-${Date.now()}`,
        name: newBundleName.trim(),
        description: newBundleDescription.trim() || undefined,
        aesthetic: selectedAesthetic,
        size: selectedSize,
        suggestedPrice: suggestedPrice ? Number.parseFloat(suggestedPrice) : undefined,
        createdAt: new Date().toISOString(),
        items: selectedItems,
        rentalPeriods: selectedRentalPeriods,
        userId: userId,
        ownerId: userId,
        ownerName: userName,
        ownerAvatar: "/placeholder.svg",
        isPublished: true,
        timeDiscounts: timeDiscounts,
        itemDiscounts: itemDiscounts,
      }

      // Get all bundles
      const storedBundles =
        localStorage.getItem("stylerent_bundles") || localStorage.getItem("opencloset_bundles") || "[]"
      const allBundles = JSON.parse(storedBundles)

      // Add new bundle
      const updatedBundles = [...allBundles, newBundle]
      localStorage.setItem("stylerent_bundles", JSON.stringify(updatedBundles))

      // Also update opencloset_bundles for backward compatibility
      localStorage.setItem("opencloset_bundles", JSON.stringify(updatedBundles))

      // Dispatch event to notify other components
      window.dispatchEvent(
        new CustomEvent("stylerent-bundles-updated", {
          detail: { bundles: updatedBundles },
        }),
      )

      // Update user's bundles
      const userBundles = updatedBundles.filter((bundle) => bundle.ownerId === userId)
      setBundles(userBundles)

      resetForm()
      setDialogOpen(false)

      toast.success(`Created new bundle: ${newBundle.name}`)
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
    setSelectedSize("")
    setSuggestedPrice("")
    setSelectedItems([])
    setItemSearchQuery("")
    setTimeDiscounts([
      { months: 1, percentage: 10 },
      { months: 2, percentage: 15 },
      { months: 3, percentage: 20 },
    ])
    setItemDiscounts([
      { quantity: 2, percentage: 5 },
      { quantity: 3, percentage: 10 },
      { quantity: 5, percentage: 15 },
    ])
    setSelectedRentalPeriods([
      { months: 1, discountPercentage: 10 },
      { months: 2, discountPercentage: 15 },
      { months: 3, discountPercentage: 20 },
    ])
  }

  const handleUpdateBundle = () => {
    if (!editingBundle) return
    if (!editingBundle.name.trim()) {
      toast.error("Please enter a bundle name")
      return
    }

    try {
      // Get all bundles
      const storedBundles =
        localStorage.getItem("stylerent_bundles") || localStorage.getItem("opencloset_bundles") || "[]"
      const allBundles = JSON.parse(storedBundles)

      // Update the bundle
      const updatedAllBundles = allBundles.map((bundle) => (bundle.id === editingBundle.id ? editingBundle : bundle))

      localStorage.setItem("stylerent_bundles", JSON.stringify(updatedAllBundles))
      localStorage.setItem("opencloset_bundles", JSON.stringify(updatedAllBundles))

      // Dispatch event to notify other components
      window.dispatchEvent(
        new CustomEvent("stylerent-bundles-updated", {
          detail: { bundles: updatedAllBundles },
        }),
      )

      // Update user's bundles
      const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
      const userBundles = updatedAllBundles.filter((bundle) => bundle.ownerId === userId)
      setBundles(userBundles)

      setEditingBundle(null)
      setEditDialogOpen(false)

      toast.success(`Updated bundle: ${editingBundle.name}`)
    } catch (error) {
      console.error("Error updating bundle:", error)
      toast.error("Failed to update bundle")
    }
  }

  const handleDeleteBundle = (bundleId: string) => {
    try {
      const bundleToDelete = bundles.find((bundle) => bundle.id === bundleId)
      if (!bundleToDelete) return

      // Get all bundles
      const storedBundles =
        localStorage.getItem("stylerent_bundles") || localStorage.getItem("opencloset_bundles") || "[]"
      const allBundles = JSON.parse(storedBundles)

      // Remove the bundle
      const updatedAllBundles = allBundles.filter((bundle) => bundle.id !== bundleId)

      localStorage.setItem("stylerent_bundles", JSON.stringify(updatedAllBundles))
      localStorage.setItem("opencloset_bundles", JSON.stringify(updatedAllBundles))

      // Dispatch event to notify other components
      window.dispatchEvent(
        new CustomEvent("stylerent-bundles-updated", {
          detail: { bundles: updatedAllBundles },
        }),
      )

      // Update user's bundles
      const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
      const userBundles = updatedAllBundles.filter((bundle) => bundle.ownerId === userId)
      setBundles(userBundles)

      toast.success(`Deleted bundle: ${bundleToDelete.name}`)
    } catch (error) {
      console.error("Error deleting bundle:", error)
      toast.error("Failed to delete bundle")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const addItemToSelection = (item: Item) => {
    if (!selectedItems.some((selectedItem) => selectedItem.id === item.id)) {
      setSelectedItems([...selectedItems, item])
    }
  }

  const removeItemFromSelection = (itemId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId))
  }

  const handleAddItemToBundle = (item: Item) => {
    if (editingBundle) {
      // Check if item is already in the bundle
      if (!editingBundle.items.some((bundleItem) => bundleItem.id === item.id)) {
        setEditingBundle({
          ...editingBundle,
          items: [...editingBundle.items, item],
        })
      } else {
        toast.info(`${item.name} is already in this bundle`)
      }
    } else {
      addItemToSelection(item)
    }
  }

  const handleRemoveItemFromBundle = (itemId: string) => {
    if (editingBundle) {
      setEditingBundle({
        ...editingBundle,
        items: editingBundle.items.filter((item) => item.id !== itemId),
      })
    } else {
      removeItemFromSelection(itemId)
    }
  }

  const handleEditBundle = (bundle: Bundle) => {
    // Set time and item discounts from the bundle or use defaults
    if (bundle.timeDiscounts) {
      setTimeDiscounts(bundle.timeDiscounts)
    }

    if (bundle.itemDiscounts) {
      setItemDiscounts(bundle.itemDiscounts)
    }

    setEditingBundle(bundle)
    setEditDialogOpen(true)
  }

  const handlePublishBundle = (bundleId: string) => {
    try {
      // Get all bundles
      const storedBundles =
        localStorage.getItem("stylerent_bundles") || localStorage.getItem("opencloset_bundles") || "[]"
      const allBundles = JSON.parse(storedBundles)

      // Update the bundle to published
      const updatedAllBundles = allBundles.map((bundle) =>
        bundle.id === bundleId ? { ...bundle, isPublished: true } : bundle,
      )

      localStorage.setItem("stylerent_bundles", JSON.stringify(updatedAllBundles))
      localStorage.setItem("opencloset_bundles", JSON.stringify(updatedAllBundles))

      // Dispatch event to notify other components
      window.dispatchEvent(
        new CustomEvent("stylerent-bundles-updated", {
          detail: { bundles: updatedAllBundles },
        }),
      )

      // Update user's bundles
      const userId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
      const userBundles = updatedAllBundles.filter((bundle) => bundle.ownerId === userId)
      setBundles(userBundles)

      // Also update available bundles
      loadAvailableBundles()

      toast.success("Bundle published to marketplace")
    } catch (error) {
      console.error("Error publishing bundle:", error)
      toast.error("Failed to publish bundle")
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-1/2 mb-6">
          <TabsTrigger value="my-bundles">My Bundles</TabsTrigger>
          <TabsTrigger value="available-bundles">Available Bundles</TabsTrigger>
        </TabsList>

        <TabsContent value="my-bundles">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold font-playfair">My Bundles</h1>
              <p className="text-muted-foreground mt-1">Create and manage your clothing bundles</p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Bundle
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-playfair">Create New Bundle</DialogTitle>
                  <DialogDescription>
                    Group your items together to create attractive complete looks for renters.
                  </DialogDescription>
                </DialogHeader>

                {/* Reorganized layout with items on left, details on right */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  {/* Left side - Item Selection */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Add Items to Bundle</Label>
                      <div className="border rounded-md p-4">
                        <BundleItemSlider onAddItem={handleAddItemToBundle} />
                      </div>
                    </div>

                    {selectedItems.length > 0 && (
                      <div className="space-y-2">
                        <Label>Selected Items ({selectedItems.length})</Label>
                        <ScrollArea className="h-[400px] border rounded-md p-2">
                          <div className="space-y-2">
                            {selectedItems.map((item) => (
                              <div key={item.id} className="flex items-center p-2 rounded-md hover:bg-muted border">
                                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                  <img
                                    src={(item.media && item.media[0]?.url) || "/placeholder.svg?height=56&width=56"}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="ml-3 flex-1 overflow-hidden">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">${item.rentalPrice || item.price}/day</p>
                                  {item.designer && <p className="text-xs text-muted-foreground">{item.designer}</p>}
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

                  {/* Right side - Bundle Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bundle-name">Bundle Name</Label>
                      <Input
                        id="bundle-name"
                        placeholder="Enter a name for your bundle"
                        value={newBundleName}
                        onChange={(e) => setNewBundleName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bundle-description">Description</Label>
                      <Textarea
                        id="bundle-description"
                        placeholder="Describe your bundle..."
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
                            <SelectValue placeholder="Select aesthetic">Casual</SelectValue>
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
                        placeholder="Enter suggested price"
                        value={suggestedPrice}
                        onChange={(e) => setSuggestedPrice(e.target.value)}
                      />
                    </div>

                    {/* Bundle Preview */}
                    <div className="mt-6 p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Bundle Preview</h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{newBundleName || "Your Bundle Name"}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {newBundleDescription || "Bundle description will appear here"}
                            </p>
                          </div>
                          {selectedAesthetic && <Badge>{selectedAesthetic}</Badge>}
                        </div>

                        <div className="flex -space-x-2 overflow-hidden">
                          {selectedItems.slice(0, 5).map((item) => (
                            <div
                              key={item.id}
                              className="inline-block h-12 w-12 rounded-full border-2 border-background overflow-hidden bg-muted"
                            >
                              <img
                                src={(item.media && item.media[0]?.url) || "/placeholder.svg?height=48&width=48"}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                          {selectedItems.length > 5 && (
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                              +{selectedItems.length - 5}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span>Price: ${suggestedPrice || "0.00"}/day</span>
                          <span>{selectedItems.length} items</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 text-sm text-muted-foreground">
                      <p>Note: Discount settings can be managed in your profile settings.</p>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
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

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              {editingBundle && (
                <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-playfair">Edit Bundle</DialogTitle>
                    <DialogDescription>Update your bundle details and items.</DialogDescription>
                  </DialogHeader>

                  {/* Reorganized layout with items on left, details on right */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Left side - Item Selection */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Add Items to Bundle</Label>
                        <div className="border rounded-md p-4">
                          <BundleItemSlider onAddItem={handleAddItemToBundle} />
                        </div>
                      </div>

                      {editingBundle.items.length > 0 && (
                        <div className="space-y-2">
                          <Label>Bundle Items ({editingBundle.items.length})</Label>
                          <ScrollArea className="h-[400px] border rounded-md p-2">
                            <div className="space-y-2">
                              {editingBundle.items.map((item) => (
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
                                    <p className="text-sm text-muted-foreground">
                                      ${item.rentalPrice || item.price}/day
                                    </p>
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

                    {/* Right side - Bundle Details */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-bundle-name">Bundle Name</Label>
                        <Input
                          id="edit-bundle-name"
                          placeholder="Enter a name for your bundle"
                          value={editingBundle.name}
                          onChange={(e) => setEditingBundle({ ...editingBundle, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-bundle-description">Description</Label>
                        <Textarea
                          id="edit-bundle-description"
                          placeholder="Describe your bundle..."
                          value={editingBundle.description || ""}
                          onChange={(e) => setEditingBundle({ ...editingBundle, description: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-bundle-aesthetic">Aesthetic</Label>
                          <Select
                            value={editingBundle.aesthetic || "Casual"}
                            onValueChange={(value) => setEditingBundle({ ...editingBundle, aesthetic: value })}
                          >
                            <SelectTrigger id="edit-bundle-aesthetic">
                              <SelectValue placeholder="Select aesthetic">Casual</SelectValue>
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
                          <Label htmlFor="edit-bundle-size">Size</Label>
                          <Select
                            value={editingBundle.size || ""}
                            onValueChange={(value) => setEditingBundle({ ...editingBundle, size: value })}
                          >
                            <SelectTrigger id="edit-bundle-size">
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
                        <Label htmlFor="edit-bundle-price">Suggested Price ($/day)</Label>
                        <Input
                          id="edit-bundle-price"
                          type="text"
                          inputMode="decimal"
                          placeholder="Enter suggested price"
                          value={editingBundle.suggestedPrice?.toString() || ""}
                          onChange={(e) =>
                            setEditingBundle({
                              ...editingBundle,
                              suggestedPrice: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                            })
                          }
                        />
                      </div>

                      {/* Bundle Preview */}
                      <div className="mt-6 p-4 border rounded-md">
                        <h3 className="font-medium mb-2">Bundle Preview</h3>
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{editingBundle.name || "Your Bundle Name"}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {editingBundle.description || "Bundle description will appear here"}
                              </p>
                            </div>
                            {editingBundle.aesthetic && <Badge>{editingBundle.aesthetic}</Badge>}
                          </div>

                          <div className="flex -space-x-2 overflow-hidden">
                            {editingBundle.items.slice(0, 5).map((item) => (
                              <div
                                key={item.id}
                                className="inline-block h-12 w-12 rounded-full border-2 border-background overflow-hidden bg-muted"
                              >
                                <img
                                  src={(item.media && item.media[0]?.url) || "/placeholder.svg?height=48&width=48"}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))}
                            {editingBundle.items.length > 5 && (
                              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                +{editingBundle.items.length - 5}
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span>Price: ${editingBundle.suggestedPrice || "0.00"}/day</span>
                            <span>{editingBundle.items.length} items</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 text-sm text-muted-foreground">
                        <p>Note: Discount settings can be managed in your profile settings.</p>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateBundle}
                      disabled={!editingBundle.name.trim() || editingBundle.items.length === 0}
                    >
                      Update Bundle
                    </Button>
                  </DialogFooter>
                </DialogContent>
              )}
            </Dialog>
          </div>

          {bundles.length === 0 ? (
            <div className="space-y-8">
              <Card className="text-center p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Package className="h-12 w-12 text-muted-foreground" />
                  <h2 className="text-xl font-medium">No bundles yet</h2>
                  <p className="text-muted-foreground">Create your first bundle to start renting out complete looks.</p>
                  <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Bundle
                  </Button>
                </div>
              </Card>

              <div className="mt-6">
                <h3 className="text-xl font-medium mb-4">Bundle Discount Settings</h3>
                <p className="text-muted-foreground mb-4">
                  Configure your discount settings for bundles. These settings will be applied to all bundles you
                  create.
                </p>
                <BundleDiscountSettings />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.map((bundle) => (
                <Card key={bundle.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-cinzel">{bundle.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {bundle.description && <p className="text-sm text-muted-foreground mb-3">{bundle.description}</p>}

                    <div className="flex flex-wrap gap-2 mb-3">
                      {bundle.aesthetic && <Badge variant="secondary">{bundle.aesthetic}</Badge>}
                      {bundle.size && <Badge variant="outline">Size {bundle.size}</Badge>}
                      {bundle.isPublished ? (
                        <Badge variant="default" className="bg-green-500">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </div>

                    <div className="text-sm mb-3">
                      <p>
                        <span className="font-medium">Created:</span> {formatDate(bundle.createdAt)}
                      </p>
                      {bundle.suggestedPrice && (
                        <p>
                          <span className="font-medium">Price:</span> ${bundle.suggestedPrice}/day
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Items:</span> {bundle.items.length}
                      </p>
                    </div>

                    {bundle.items.length > 0 && (
                      <div className="flex -space-x-2 overflow-hidden mb-3">
                        {bundle.items.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="inline-block h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-muted"
                          >
                            <img
                              src={(item.media && item.media[0]?.url) || "/placeholder.svg?height=40&width=40"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                        {bundle.items.length > 5 && (
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                            +{bundle.items.length - 5}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditBundle(bundle)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteBundle(bundle.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>

                    {!bundle.isPublished && (
                      <Button size="sm" onClick={() => handlePublishBundle(bundle.id)}>
                        Publish
                      </Button>
                    )}

                    {bundle.isPublished && (
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/bundles/${bundle.id}`}>View</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <Separator className="my-8" />

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6 font-cinzel">Benefits of Creating Bundles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mr-4">
                      <span className="font-medium text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium font-playfair">Create Complete Looks</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Bundle your items together to create attractive complete looks for renters.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mr-4">
                      <span className="font-medium text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium font-playfair">Increase Rental Chances</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Bundles are more likely to be rented than individual items, increasing your earnings.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mr-4">
                      <span className="font-medium text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium font-playfair">Offer Special Discounts</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Create time-based and quantity-based discounts to attract more renters.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="available-bundles">
          <div className="space-y-8">
            <AvailableBundles />

            <div className="mt-6">
              <h3 className="text-xl font-medium mb-4">Bundle Discount Settings</h3>
              <p className="text-muted-foreground mb-4">
                Set global discount preferences for bundles you're interested in renting.
              </p>
              <BundleDiscountSettings />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
