"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ShoppingCart,
  Heart,
  Search,
  ChevronRight,
  Package,
  Store,
  Settings,
  LogOut,
  ShoppingBag,
  MessageSquare,
  Upload,
  FolderPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export function HeaderNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [cartItems, setCartItems] = useState(0)
  const [wishlistItems, setWishlistItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState({
    items: [],
    bundles: [],
    users: [],
  })

  useEffect(() => {
    // Check login status on component mount and when localStorage changes
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("opencloset_logged_in") === "true"
      setIsLoggedIn(loggedIn)

      if (loggedIn) {
        const storedUser = localStorage.getItem("opencloset_user")
        if (storedUser) {
          setUserData(JSON.parse(storedUser))
        }
      } else {
        setUserData(null)
      }
    }

    checkLoginStatus()

    // Listen for storage events (in case user logs in/out in another tab)
    window.addEventListener("storage", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
    }
  }, [])

  // Load cart items count
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const cart = localStorage.getItem("opencloset_cart")
        const cartData = cart ? JSON.parse(cart) : []
        setCartItems(cartData.length)
      } catch (error) {
        console.error("Error loading cart:", error)
        setCartItems(0)
      }
    }

    loadCartItems()

    const handleCartUpdate = () => loadCartItems()

    window.addEventListener("opencloset-cart-updated", handleCartUpdate)
    window.addEventListener("storage", handleCartUpdate)

    return () => {
      window.removeEventListener("opencloset-cart-updated", handleCartUpdate)
      window.removeEventListener("storage", handleCartUpdate)
    }
  }, [])

  // Load wishlist items count
  useEffect(() => {
    const loadWishlistItems = () => {
      try {
        const wishlist = localStorage.getItem("opencloset_wishlist")
        const wishlistData = wishlist ? JSON.parse(wishlist) : []
        setWishlistItems(wishlistData.length)
      } catch (error) {
        console.error("Error loading wishlist:", error)
        setWishlistItems(0)
      }
    }

    loadWishlistItems()

    const handleWishlistUpdate = () => loadWishlistItems()

    window.addEventListener("opencloset-wishlist-updated", handleWishlistUpdate)
    window.addEventListener("storage", handleWishlistUpdate)

    return () => {
      window.removeEventListener("opencloset-wishlist-updated", handleWishlistUpdate)
      window.removeEventListener("storage", handleWishlistUpdate)
    }
  }, [])

  // Initialize data storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@/lib/data-init")
        .then((module) => {
          module.initializeDataStorage()
        })
        .catch((error) => {
          console.error("Error initializing data storage:", error)
        })
    }
  }, [])

  // Search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    setSearchTerm("")
  }

  const handleLogout = () => {
    localStorage.removeItem("opencloset_logged_in")
    localStorage.removeItem("opencloset_user")
    router.push("/auth/signin")

    // Dispatch event to notify components about the auth change
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <div className="flex items-center justify-between bg-ivory border-b border-taupe py-4 px-6">
      <div className="flex items-center">
        {/* Logo */}
        <Link href="/" className="mr-4">
          <h1 className="text-xl font-bold text-charcoal">OpenCloset</h1>
        </Link>
      </div>

      {/* Search Bar - Centered */}
      <div className="flex-1 max-w-xl mx-auto mr-6">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder=""
            className="w-full pl-10 pr-4 py-2 border-taupe focus:border-sage placeholder:text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
          >
            <span className="sr-only">Search</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Right side icons */}
      <div className="flex items-center space-x-4">
        {/* List Item / Create Bundle Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="bg-blush text-white hover:bg-blush/80">
              <Upload className="h-5 w-5" />
              <span className="sr-only">List Options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/list-item" className="cursor-pointer flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" />
                List an Item
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile/create-bundle" className="cursor-pointer flex items-center">
                <FolderPlus className="mr-2 h-4 w-4" />
                Create a Bundle
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Shopping Cart Icon - Direct Link */}
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" />
            {isLoggedIn && cartItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary">
                {cartItems > 9 ? "9+" : cartItems}
              </Badge>
            )}
            <span className="sr-only">Cart</span>
          </Link>
        </Button>

        {/* Heart Icon (Wishlist) - Direct Link */}
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/wishlist">
            <Heart className="h-5 w-5" />
            {isLoggedIn && wishlistItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-pink-500">
                {wishlistItems > 9 ? "9+" : wishlistItems}
              </Badge>
            )}
            <span className="sr-only">Wishlist</span>
          </Link>
        </Button>

        {/* Messages Icon */}
        <Link href="/messages">
          <Button variant="ghost" size="icon" className="relative">
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Button>
        </Link>

        {/* Sign In / Profile Button with Dropdown */}
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-sage text-ivory hover:bg-sage/80 flex items-center gap-2">
                Profile
                <Avatar className="h-6 w-6 border border-taupe ml-1">
                  <AvatarImage src={userData?.avatar || "/placeholder.svg"} alt="User" />
                  <AvatarFallback className="bg-sage text-ivory">{userData?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile?tab=listed" className="cursor-pointer flex items-center">
                  <Store className="mr-2 h-4 w-4" />
                  My Shop
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/purchases" className="cursor-pointer flex items-center">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  My Purchases
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/my-rentals" className="cursor-pointer flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  My Rentals
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/shop-rentals" className="cursor-pointer flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  My Shop's Rentals
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/settings" className="cursor-pointer flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild className="bg-blush text-ivory hover:bg-blush/80">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
