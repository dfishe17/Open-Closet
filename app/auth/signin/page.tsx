"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  })

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a demo user profile
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const userProfile = {
        id: userId,
        name: "Demo User",
        email: formData.email || "user@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=DU",
        createdAt: new Date().toISOString(),
        memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        // Combined user capabilities
        isRenter: true,
        isLender: true,
        // Renter stats
        totalRentals: 0,
        savedAmount: 0,
        creditBalance: 0,
        wishlist: [],
        sizes: [],
        preferredStyles: [],
        favoriteDesigners: [],
        // Lender stats
        totalItems: 0,
        activeItems: 0,
        totalEarnings: 0,
        thisMonthEarnings: 0,
        rating: 0,
        reviewCount: 0,
      }

      // Store the user profile and set login state
      localStorage.setItem("stylerent_user", JSON.stringify(userProfile))
      localStorage.setItem("stylerent_user_id", userProfile.id)
      localStorage.setItem("stylerent_logged_in", "true")

      // Also set for opencloset (for compatibility)
      localStorage.setItem("opencloset_user", JSON.stringify(userProfile))
      localStorage.setItem("opencloset_user_id", userProfile.id)
      localStorage.setItem("opencloset_logged_in", "true")

      // Handle session expiration
      if (!formData.rememberMe) {
        const expirationTime = Date.now() + 24 * 60 * 60 * 1000
        localStorage.setItem("stylerent_session_expires", expirationTime.toString())
        localStorage.setItem("opencloset_session_expires", expirationTime.toString())
      } else {
        localStorage.removeItem("stylerent_session_expires")
        localStorage.removeItem("opencloset_session_expires")
      }

      // Trigger auth event
      window.dispatchEvent(new CustomEvent("stylerent-auth-changed"))
      window.dispatchEvent(new CustomEvent("opencloset-auth-changed"))

      toast.success("Signed in successfully!")

      // Redirect to the unified profile page
      setTimeout(() => {
        router.push("/profile")
        // Add an additional check to make sure we get to the dashboard
        setTimeout(() => {
          window.location.href = "/profile"
        }, 1000) // Backup redirect if router.push doesn't work
      }, 500)
    } catch (error) {
      console.error("Sign-in error:", error)
      toast.error("Failed to sign in. Please check your credentials and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
        <div className="flex flex-col space-y-3 text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight font-cinzel">Welcome back</h1>
          <p className="text-sm text-muted-foreground font-alegreya">Sign in to your account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl font-playfair">Sign In / Sign Up</CardTitle>
              <CardDescription className="font-alegreya text-sm">Access your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder=""
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder=""
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" checked={formData.rememberMe} onCheckedChange={handleCheckboxChange} />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-alegreya"
                >
                  Remember me
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground font-alegreya">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
