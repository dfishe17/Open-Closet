"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAdminLogin = async () => {
    setIsLoading(true)

    try {
      // Create a mock admin user
      const adminUser = {
        id: "admin_" + Date.now(),
        name: "Admin User",
        email: "admin@stylerent.com",
        userType: "admin",
        avatar: `/placeholder.svg?height=40&width=40&text=A`,
        createdAt: new Date().toISOString(),
        memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        isAdmin: true,
        // Add other required fields
        totalRentals: 0,
        savedAmount: 0,
        creditBalance: 0,
        wishlist: [],
        sizes: [],
        preferredStyles: [],
        favoriteDesigners: [],
      }

      // Store admin user data in localStorage
      localStorage.setItem("stylerent_user", JSON.stringify(adminUser))
      localStorage.setItem("stylerent_logged_in", "true")

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Logged in as admin successfully!")
      router.push("/admin")
    } catch (error) {
      console.error("Admin login error:", error)
      toast.error("Failed to log in as admin. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Access</h1>
          <p className="text-sm text-muted-foreground">Quick access to the admin dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>One-click access to the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-center text-sm text-muted-foreground mb-4">
              This is a demo login that creates a temporary admin user for testing purposes.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleAdminLogin} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login as Admin"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
