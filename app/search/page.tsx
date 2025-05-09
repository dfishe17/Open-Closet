"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Package, ShoppingBag, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getTestItems, getUserItems } from "@/lib/item-utils"
import { getBundles } from "@/lib/bundle-utils"
import { SharedFilterBar } from "@/components/shared-filter-bar"

// Helper function to get users from localStorage
const getUsers = () => {
  try {
    const usersJson = localStorage.getItem("opencloset_users")
    if (usersJson) {
      return JSON.parse(usersJson)
    }
  } catch (error) {
    console.error("Error fetching users:", error)
  }
  return []
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const type = searchParams.get("type") || "all"

  // Get filter values from URL
  const categoryFilter = searchParams.get("category")
  const sizeFilter = searchParams.get("size")
  const brandFilter = searchParams.get("brand")
  const conditionFilter = searchParams.get("condition")
  const colorFilter = searchParams.get("color")
  const priceFilter = searchParams.get("price")
  const materialFilter = searchParams.get("material")
  const aestheticFilter = searchParams.get("aesthetic")
  const sortOption = searchParams.get("sort") || "newest"

  const [results, setResults] = useState<{
    items: any[]
    bundles: any[]
    users: any[]
  }>({
    items: [],
    bundles: [],
    users: [],
  })

  const [activeTab, setActiveTab] = useState(type)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!query) {
      setResults({ items: [], bundles: [], users: [] })
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    // Perform search
    const searchResults = performSearch(query)

    // Apply filters
    let filteredItems = searchResults.items
    let filteredBundles = searchResults.bundles

    // Apply category filter
    if (categoryFilter) {
      filteredItems = filteredItems.filter(
        (item) => item.category && item.category.toLowerCase() === categoryFilter.toLowerCase(),
      )
    }

    // Apply size filter
    if (sizeFilter) {
      filteredItems = filteredItems.filter((item) => item.size && item.size.toLowerCase() === sizeFilter.toLowerCase())
      filteredBundles = filteredBundles.filter(
        (bundle) => bundle.size && bundle.size.toLowerCase() === sizeFilter.toLowerCase(),
      )
    }

    // Apply brand/designer filter
    if (brandFilter) {
      filteredItems = filteredItems.filter(
        (item) => item.designer && item.designer.toLowerCase() === brandFilter.toLowerCase(),
      )
    }

    // Apply condition filter
    if (conditionFilter) {
      filteredItems = filteredItems.filter(
        (item) => item.condition && item.condition.toLowerCase() === conditionFilter.toLowerCase(),
      )
    }

    // Apply color filter
    if (colorFilter) {
      filteredItems = filteredItems.filter(
        (item) => item.color && item.color.toLowerCase() === colorFilter.toLowerCase(),
      )
    }

    // Apply aesthetic filter
    if (aestheticFilter) {
      filteredItems = filteredItems.filter(
        (item) => item.aesthetic && item.aesthetic.toLowerCase() === aestheticFilter.toLowerCase(),
      )
      filteredBundles = filteredBundles.filter(
        (bundle) => bundle.aesthetic && bundle.aesthetic.toLowerCase() === aestheticFilter.toLowerCase(),
      )
    }

    // Apply sort
    if (sortOption) {
      const sortItems = (items) => {
        switch (sortOption) {
          case "newest":
            return items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          case "oldest":
            return items.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
          case "price-low":
            return items.sort((a, b) => (a.rentalPrice || a.price || 0) - (b.rentalPrice || b.price || 0))
          case "price-high":
            return items.sort((a, b) => (b.rentalPrice || b.price || 0) - (a.rentalPrice || a.price || 0))
          default:
            return items
        }
      }

      filteredItems = sortItems(filteredItems)
      filteredBundles = sortItems(filteredBundles)
    }

    setResults({
      items: filteredItems,
      bundles: filteredBundles,
      users: searchResults.users,
    })
    setIsLoading(false)
  }, [
    query,
    type,
    categoryFilter,
    sizeFilter,
    brandFilter,
    conditionFilter,
    colorFilter,
    priceFilter,
    materialFilter,
    aestheticFilter,
    sortOption,
  ])

  const performSearch = (term: string) => {
    const lowercaseTerm = term.toLowerCase()

    // Get data
    const testItems = getTestItems()
    const userItems = getUserItems()
    const allItems = [...userItems, ...testItems]
    const bundles = getBundles()
    const users = getUsers()

    // Filter items
    const filteredItems = allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowercaseTerm) ||
        (item.designer && item.designer.toLowerCase().includes(lowercaseTerm)) ||
        (item.category && item.category.toLowerCase().includes(lowercaseTerm)) ||
        (item.aesthetic && item.aesthetic.toLowerCase().includes(lowercaseTerm)),
    )

    // Filter bundles
    const filteredBundles = bundles.filter(
      (bundle) =>
        bundle.name.toLowerCase().includes(lowercaseTerm) ||
        (bundle.description && bundle.description.toLowerCase().includes(lowercaseTerm)),
    )

    // Filter users
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercaseTerm) ||
        (user.username && user.username.toLowerCase().includes(lowercaseTerm)),
    )

    return {
      items: filteredItems,
      bundles: filteredBundles,
      users: filteredUsers,
    }
  }

  const totalResults = results.items.length + results.bundles.length + results.users.length

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Add the shared filter bar */}
      <SharedFilterBar />

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Results ({totalResults})</TabsTrigger>
          <TabsTrigger value="items">Items ({results.items.length})</TabsTrigger>
          <TabsTrigger value="bundles">Bundles ({results.bundles.length})</TabsTrigger>
          <TabsTrigger value="users">Users ({results.users.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {totalResults === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found. Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {results.items.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5" /> Items
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.items.slice(0, 6).map((item) => (
                      <Card key={item.id}>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">{item.name}</CardTitle>
                          <CardDescription>{item.designer}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="aspect-square relative bg-muted rounded-md overflow-hidden">
                            <img
                              src={item.image || "/placeholder.svg?height=200&width=200"}
                              alt={item.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button asChild className="w-full">
                            <Link href={`/items/${item.id}`}>View Item</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  {results.items.length > 6 && (
                    <div className="text-center mt-4">
                      <Button variant="outline" onClick={() => setActiveTab("items")}>
                        View All {results.items.length} Items
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {results.bundles.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Package className="mr-2 h-5 w-5" /> Bundles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.bundles.slice(0, 6).map((bundle) => (
                      <Card key={bundle.id}>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">{bundle.name}</CardTitle>
                          <CardDescription>{bundle.items?.length || 0} items</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="aspect-square relative bg-muted rounded-md overflow-hidden">
                            <img
                              src={bundle.image || "/placeholder.svg?height=200&width=200"}
                              alt={bundle.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button asChild className="w-full">
                            <Link href={`/bundles/${bundle.id}`}>View Bundle</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  {results.bundles.length > 6 && (
                    <div className="text-center mt-4">
                      <Button variant="outline" onClick={() => setActiveTab("bundles")}>
                        View All {results.bundles.length} Bundles
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {results.users.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <User className="mr-2 h-5 w-5" /> Users
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.users.slice(0, 6).map((user) => (
                      <Card key={user.id}>
                        <CardHeader className="p-4">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} />
                              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{user.name}</CardTitle>
                              <CardDescription>{user.username}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter className="p-4">
                          <Button asChild className="w-full">
                            <Link href={`/profile/${user.id}`}>View Profile</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  {results.users.length > 6 && (
                    <div className="text-center mt-4">
                      <Button variant="outline" onClick={() => setActiveTab("users")}>
                        View All {results.users.length} Users
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="items">
          {results.items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items found. Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.items.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <CardDescription>{item.designer}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="aspect-square relative bg-muted rounded-md overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg?height=200&width=200"}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/items/${item.id}`}>View Item</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bundles">
          {results.bundles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No bundles found. Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.bundles.map((bundle) => (
                <Card key={bundle.id}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{bundle.name}</CardTitle>
                    <CardDescription>{bundle.items?.length || 0} items</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="aspect-square relative bg-muted rounded-md overflow-hidden">
                      <img
                        src={bundle.image || "/placeholder.svg?height=200&width=200"}
                        alt={bundle.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/bundles/${bundle.id}`}>View Bundle</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="users">
          {results.users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found. Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.users.map((user) => (
                <Card key={user.id}>
                  <CardHeader className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} />
                        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{user.name}</CardTitle>
                        <CardDescription>{user.username}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="p-4">
                    <Button asChild className="w-full">
                      <Link href={`/profile/${user.id}`}>View Profile</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
