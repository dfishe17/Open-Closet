"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      // For demo purposes, we'll make it easier to access the admin dashboard
      // In a real app, this would check against a backend API with proper authentication

      const storedUser = localStorage.getItem("stylerent_user")
      const isLoggedIn = localStorage.getItem("stylerent_logged_in") === "true"

      if (!storedUser || !isLoggedIn) {
        // If not logged in, redirect to sign in
        router.push("/auth/signin?redirect=/admin")
        return
      }

      try {
        const userData = JSON.parse(storedUser)

        // For demo purposes, we'll consider any logged-in user as an admin
        // This is ONLY for demonstration - in a real app, you would check proper admin roles
        setIsAdmin(true)
        setLoading(false)
      } catch (error) {
        console.error("Error checking admin status:", error)
        router.push("/")
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying admin access...</span>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect in useEffect
  }

  return <div className="min-h-screen bg-muted/30">{children}</div>
}
