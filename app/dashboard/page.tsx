"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("opencloset_logged_in") === "true"

    if (!isLoggedIn) {
      router.push("/auth/signin")
      return
    }

    // Get user data
    try {
      const storedUser = localStorage.getItem("opencloset_user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        // Redirect to the appropriate profile page based on user type
        if (userData.userType === "lender") {
          router.push("/profile/seller")
        } else {
          router.push("/profile/buyer")
        }
      } else {
        router.push("/auth/signin")
      }
    } catch (error) {
      console.error("Error retrieving user data:", error)
      router.push("/auth/signin")
    }
  }, [router])

  return (
    <div className="container flex items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Redirecting to your profile...</p>
      </div>
    </div>
  )
}
