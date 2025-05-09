"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Sparkles, X, User, Package, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTestItems, getUserItems } from "@/lib/item-utils"
import { getBundles } from "@/lib/bundle-utils"

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

export function EnhancedSearch() {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [results, setResults] = useState<{
    items: any[]
    bundles: any[]
    users: any[]
  }>({
    items: [],
    bundles: [],
    users: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  // Search function
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults({ items: [], bundles: [], users: [] })
      return
    }

    setIsLoading(true)

    // Simulate search delay
    const timer = setTimeout(() => {
      const searchResults = performSearch(searchTerm)
      setResults(searchResults)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const performSearch = (term: string) => {
    const lowercaseTerm = term.toLowerCase()

    // Get data
    const testItems = getTestItems()
    const userItems = getUserItems()
    const allItems = [...userItems, ...testItems]
    const bundles = getBundles()
    const users = getUsers()

    // Filter items
    const filteredItems = allItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(lowercaseTerm) ||
          (item.designer && item.designer.toLowerCase().includes(lowercaseTerm)) ||
          (item.category && item.category.toLowerCase().includes(lowercaseTerm)) ||
          (item.aesthetic && item.aesthetic.toLowerCase().includes(lowercaseTerm)),
      )
      .slice(0, 5)

    // Filter bundles
    const filteredBundles = bundles
      .filter(
        (bundle) =>
          bundle.name.toLowerCase().includes(lowercaseTerm) ||
          (bundle.description && bundle.description.toLowerCase().includes(lowercaseTerm)),
      )
      .slice(0, 5)

    // Filter users
    const filteredUsers = users
      .filter(
        (user) =>
          user.name.toLowerCase().includes(lowercaseTerm) ||
          (user.username && user.username.toLowerCase().includes(lowercaseTerm)),
      )
      .slice(0, 5)

    return {
      items: filteredItems,
      bundles: filteredBundles,
      users: filteredUsers,
    }
  }

  const handleItemClick = (item: any) => {
    router.push(`/items/${item.id}`)
    setOpen(false)
    setSearchTerm("")
  }

  const handleBundleClick = (bundle: any) => {
    router.push(`/bundles/${bundle.id}`)
    setOpen(false)
    setSearchTerm("")
  }

  const handleUserClick = (user: any) => {
    router.push(`/profile/${user.id}`)
    setOpen(false)
    setSearchTerm("")
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) return

    if (activeTab === "all") {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    } else if (activeTab === "items") {
      router.push(`/browse?search=${encodeURIComponent(searchTerm)}`)
    } else if (activeTab === "bundles") {
      router.push(`/bundles?search=${encodeURIComponent(searchTerm)}`)
    } else if (activeTab === "users") {
      router.push(`/search?type=users&q=${encodeURIComponent(searchTerm)}`)
    }

    setOpen(false)
    setSearchTerm("")
  }

  const hasResults = results.items.length > 0 || results.bundles.length > 0 || results.users.length > 0
  const totalResults = results.items.length + results.bundles.length + results.users.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="end">
        <div className="flex items-center p-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder=""
              className="pl-8 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
            />
            {isLoading ? (
              <Sparkles className="absolute right-2 top-2.5 h-4 w-4 text-primary animate-pulse" />
            ) : (
              searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear</span>
                </Button>
              )
            )}
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-3">
            <TabsList className="h-9 bg-transparent">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="items" className="text-xs">
                Items
              </TabsTrigger>
              <TabsTrigger value="bundles" className="text-xs">
                Bundles
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs">
                Users
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            <TabsContent value="all" className="m-0">
              {!hasResults && searchTerm && !isLoading ? (
                <div className="py-6 text-center text-sm">No results found</div>
              ) : (
                <>
                  {results.items.length > 0 && (
                    <div className="py-2">
                      <h3 className="px-3 text-xs font-medium text-muted-foreground">Items</h3>
                      <div className="mt-1">
                        {results.items.map((item) => (
                          <button
                            key={item.id}
                            className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center text-sm"
                            onClick={() => handleItemClick(item)}
                          >
                            <ShoppingBag className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            <span className="flex-1 truncate">{item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.designer}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.bundles.length > 0 && (
                    <div className="py-2">
                      <h3 className="px-3 text-xs font-medium text-muted-foreground">Bundles</h3>
                      <div className="mt-1">
                        {results.bundles.map((bundle) => (
                          <button
                            key={bundle.id}
                            className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center text-sm"
                            onClick={() => handleBundleClick(bundle)}
                          >
                            <Package className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            <span className="flex-1 truncate">{bundle.name}</span>
                            <span className="text-xs text-muted-foreground">{bundle.items?.length || 0} items</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.users.length > 0 && (
                    <div className="py-2">
                      <h3 className="px-3 text-xs font-medium text-muted-foreground">Users</h3>
                      <div className="mt-1">
                        {results.users.map((user) => (
                          <button
                            key={user.id}
                            className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center text-sm"
                            onClick={() => handleUserClick(user)}
                          >
                            <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            <span className="flex-1 truncate">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.username}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="items" className="m-0">
              {results.items.length === 0 && searchTerm && !isLoading ? (
                <div className="py-6 text-center text-sm">No items found</div>
              ) : (
                <div className="py-2">
                  {results.items.map((item) => (
                    <button
                      key={item.id}
                      className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center text-sm"
                      onClick={() => handleItemClick(item)}
                    >
                      <ShoppingBag className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      <span className="flex-1 truncate">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.designer}</span>
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="bundles" className="m-0">
              {results.bundles.length === 0 && searchTerm && !isLoading ? (
                <div className="py-6 text-center text-sm">No bundles found</div>
              ) : (
                <div className="py-2">
                  {results.bundles.map((bundle) => (
                    <button
                      key={bundle.id}
                      className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center text-sm"
                      onClick={() => handleBundleClick(bundle)}
                    >
                      <Package className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      <span className="flex-1 truncate">{bundle.name}</span>
                      <span className="text-xs text-muted-foreground">{bundle.items?.length || 0} items</span>
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="users" className="m-0">
              {results.users.length === 0 && searchTerm && !isLoading ? (
                <div className="py-6 text-center text-sm">No users found</div>
              ) : (
                <div className="py-2">
                  {results.users.map((user) => (
                    <button
                      key={user.id}
                      className="w-full text-left px-3 py-1.5 hover:bg-muted flex items-center text-sm"
                      onClick={() => handleUserClick(user)}
                    >
                      <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      <span className="flex-1 truncate">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.username}</span>
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <div className="border-t p-2">
          <Button
            variant="primary"
            className="w-full bg-sage text-ivory hover:bg-sage/90 font-medium"
            onClick={handleSearch}
          >
            {searchTerm ? (
              <>
                Search {activeTab !== "all" ? activeTab : "all categories"}
                {hasResults && ` (${totalResults})`}
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
