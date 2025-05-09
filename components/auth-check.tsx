"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthCheckProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export function AuthCheck({ children, redirectTo = "/auth/signin", requireAuth = true }: AuthCheckProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    try {
      const isLoggedIn =
        localStorage.getItem("opencloset_logged_in") === "true" ||
        localStorage.getItem("stylerent_logged_in") === "true"
      setIsAuthenticated(isLoggedIn)

      if (requireAuth && !isLoggedIn) {
        localStorage.setItem("opencloset_redirect_after_login", pathname)
        router.push(redirectTo)
      }

      if (!requireAuth && isLoggedIn && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error checking authentication:", error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }

    const handleAuthChange = () => {
      try {
        const isLoggedIn =
          localStorage.getItem("opencloset_logged_in") === "true" ||
          localStorage.getItem("stylerent_logged_in") === "true"
        setIsAuthenticated(isLoggedIn)
      } catch (error) {
        console.error("Error handling auth change:", error)
      }
    }

    window.addEventListener("opencloset-auth-changed", handleAuthChange)
    window.addEventListener("stylerent-auth-changed", handleAuthChange)

    return () => {
      window.removeEventListener("opencloset-auth-changed", handleAuthChange)
      window.removeEventListener("stylerent-auth-changed", handleAuthChange)
    }
  }, [pathname, redirectTo, requireAuth, router, isClient])

  if (!isClient || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return <>{children}</>
}
