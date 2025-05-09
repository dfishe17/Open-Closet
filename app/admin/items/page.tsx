"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  Settings,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { getAllItems } from "@/lib/item-utils"

export default function ItemsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Load all items
    const loadItems = () => {
      try {
        setLoading(true)
        const allItems = getAllItems()
        setItems(allItems)
      } catch (error) {
        console.error("Error loading items:", error)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    loadItems()

    // Set up event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "stylerent_items") {
        loadItems()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also check for changes every few seconds (for same-tab updates)
    const intervalId = setInterval(() => {
      loadItems()
    }, 5000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(intervalId)
    }
  }, [])

  const toggleItemSelection = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  const selectAllItems = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
    }
  }

  // Filter items based on search query and active tab
  const getFilteredItems = () => {
    let filtered = items

    // Filter by tab
    if (activeTab === "active") {
      filtered = filtered.filter((item) => !item.status || item.status === "Active")
    } else if (activeTab === "pending") {
      filtered = filtered.filter((item) => item.status === "Pending")
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((item) => item.status === "Inactive")
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.designer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }

  const filteredItems = getFilteredItems()

  const handleDeleteItem = (itemId: string) => {
    try {
      // Remove from selected items
      setSelectedItems(selectedItems.filter((id) => id !== itemId))

      // Remove from items list
      const updatedItems = items.filter((item) => item.id !== itemId)
      setItems(updatedItems)

      // Update localStorage
      localStorage.setItem("stylerent_items", JSON.stringify(updatedItems))

      toast({
        title: "Item deleted",
        description: "The item has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = () => {
    try {
      // Remove selected items
      const updatedItems = items.filter((item) => !selectedItems.includes(item.id))
      setItems(updatedItems)

      // Update localStorage
      localStorage.setItem("stylerent_items", JSON.stringify(updatedItems))

      toast({
        title: "Items deleted",
        description: `${selectedItems.length} items have been successfully deleted.`,
      })

      // Clear selection
      setSelectedItems([])
    } catch (error) {
      console.error("Error deleting items:", error)
      toast({
        title: "Error",
        description: "Failed to delete items. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = (itemId: string, newStatus: string) => {
    try {
      // Update item status
      const updatedItems = items.map((item) => {
        if (item.id === itemId) {
          return { ...item, status: newStatus }
        }
        return item
      })

      setItems(updatedItems)

      // Update localStorage
      localStorage.setItem("stylerent_items", JSON.stringify(updatedItems))

      toast({
        title: "Status updated",
        description: `Item status changed to ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating item status:", error)
      toast({
        title: "Error",
        description: "Failed to update item status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Item Management</h1>
          <p className="text-muted-foreground">Manage and monitor platform items</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Button size="sm" asChild>
            <Link href="/list-item">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search items..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Categories</DropdownMenuItem>
                <DropdownMenuItem>Dresses</DropdownMenuItem>
                <DropdownMenuItem>Accessories</DropdownMenuItem>
                <DropdownMenuItem>Suits</DropdownMenuItem>
                <DropdownMenuItem>Outerwear</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Most Rented</DropdownMenuItem>
                <DropdownMenuItem>Newest First</DropdownMenuItem>
                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Items</CardTitle>
                  <Badge variant="outline">{filteredItems.length}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedItems.length > 0 && (
                <div className="bg-muted p-2 rounded-md mb-4 flex items-center justify-between">
                  <span className="text-sm">{selectedItems.length} items selected</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading items...</p>
                </div>
              ) : (
                <>
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">No items found</p>
                      <Button asChild className="mt-4">
                        <Link href="/list-item">Add New Item</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <div className="grid grid-cols-8 border-b px-4 py-3 font-medium">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                            onChange={selectAllItems}
                          />
                          <span className="ml-3">Item</span>
                        </div>
                        <div>Category</div>
                        <div>Designer</div>
                        <div>Price</div>
                        <div>Status</div>
                        <div>Size</div>
                        <div>Aesthetic</div>
                        <div className="text-right">Actions</div>
                      </div>
                      <div className="divide-y">
                        {filteredItems.map((item) => (
                          <div key={item.id} className="grid grid-cols-8 items-center px-4 py-3">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleItemSelection(item.id)}
                              />
                              <div className="flex items-center ml-3">
                                <div className="h-10 w-10 rounded bg-muted overflow-hidden mr-3">
                                  {item.media && item.media[0] ? (
                                    <img
                                      src={item.media[0].url || "/placeholder.svg"}
                                      alt={item.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                                      <ShoppingBag className="h-5 w-5 text-primary" />
                                    </div>
                                  )}
                                </div>
                                <span className="text-sm font-medium">{item.name}</span>
                              </div>
                            </div>
                            <div className="text-sm">{item.category || "Uncategorized"}</div>
                            <div className="text-sm">{item.designer || "Unknown"}</div>
                            <div className="text-sm font-medium">${item.rentalPrice}/day</div>
                            <div>
                              <Badge
                                variant={
                                  !item.status || item.status === "Active"
                                    ? "default"
                                    : item.status === "Pending"
                                      ? "outline"
                                      : "secondary"
                                }
                                className={
                                  !item.status || item.status === "Active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                    : item.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
                                      : ""
                                }
                              >
                                {item.status || "Active"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">{item.size || "N/A"}</div>
                            <div className="text-sm text-muted-foreground">{item.aesthetic || "N/A"}</div>
                            <div className="flex justify-end space-x-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Settings className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <Link href={`/items/${item.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Item
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleStatusChange(item.id, "Active")}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(item.id, "Inactive")}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Item
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredItems.length} of {items.length} items
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={filteredItems.length === items.length}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Active Items</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  This tab displays only active items that are currently available for rent.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Pending Items</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  This tab displays items that are pending approval before they can be listed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Inactive Items</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  This tab displays items that have been deactivated or removed from listings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
