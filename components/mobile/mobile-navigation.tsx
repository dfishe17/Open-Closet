"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, ShoppingBag, Heart, User, Info } from "lucide-react"

export function MobileNavigation() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check login status
    const loggedIn = localStorage.getItem("stylerent_logged_in") === "true"
    setIsLoggedIn(loggedIn)

    // Listen for storage events (in case user logs in/out in another tab)
    window.addEventListener("storage", () => {
      const loggedIn = localStorage.getItem("stylerent_logged_in") === "true"
      setIsLoggedIn(loggedIn)
    })

    return () => {
      window.removeEventListener("storage", () => {})
    }
  }, [])

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/mobile"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === "/mobile" ? "text-primary" : "text-gray-500"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/mobile/browse"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname.startsWith("/mobile/browse") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Browse</span>
        </Link>

        <Link
          href="/mobile/how-it-works"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname.startsWith("/mobile/how-it-works") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Info className="h-5 w-5" />
          <span className="text-xs mt-1">How It Works</span>
        </Link>

        <Link
          href="/mobile/wishlist"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname.startsWith("/mobile/wishlist") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Heart className="h-5 w-5" />
          <span className="text-xs mt-1">Wishlist</span>
        </Link>

        <Link
          href="/mobile/cart"
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname.startsWith("/mobile/cart") ? "text-primary" : "text-gray-500"
          }`}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-xs mt-1">Cart</span>
        </Link>

        <Link
          href={isLoggedIn ? "/mobile/profile" : "/mobile/auth/signin"}
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname.startsWith("/mobile/profile") || pathname.startsWith("/mobile/auth")
              ? "text-primary"
              : "text-gray-500"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">{isLoggedIn ? "Profile" : "Sign In"}</span>
        </Link>
      </div>
    </nav>
  )
}
