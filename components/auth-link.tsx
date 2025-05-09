"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function AuthLink() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check login status
    const checkLoginStatus = () => {
      try {
        const loggedIn =
          localStorage.getItem("stylerent_logged_in") === "true" ||
          localStorage.getItem("opencloset_logged_in") === "true"

        setIsLoggedIn(loggedIn)

        if (loggedIn) {
          // Get user type
          const userData = localStorage.getItem("stylerent_user") || localStorage.getItem("opencloset_user") || "{}"
          const user = JSON.parse(userData)
          setUserType(user.userType || null)
        } else {
          setUserType(null)
        }
      } catch (error) {
        console.error("Error checking login status:", error)
        setIsLoggedIn(false)
        setUserType(null)
      }
    }

    // Check on mount
    checkLoginStatus()

    // Listen for storage events (for cross-tab login/logout)
    window.addEventListener("storage", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
    }
  }, [])

  if (!isClient) {
    // Server-side or initial render
    return (
      <Button variant="ghost" className="rounded-none" asChild>
        <Link href="/auth/signin">Sign In</Link>
      </Button>
    )
  }

  if (isLoggedIn) {
    const profilePath = userType === "lender" ? "/profile/seller" : "/profile/buyer"

    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="rounded-none" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button variant="ghost" className="rounded-none" size="icon" asChild>
          <Link href={profilePath}>
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <Button variant="ghost" className="rounded-none" asChild>
      <Link href="/auth/signin">Sign In</Link>
    </Button>
  )
}
