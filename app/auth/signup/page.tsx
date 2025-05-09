"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SignInLink } from "@/components/sign-in-link"
import { toast } from "sonner"

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to create a user
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // if (!response.ok) throw new Error('Signup failed');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a unique user ID
      const userId = `user_${Date.now()}`

      // Generate initials for avatar
      const nameParts = formData.name.split(" ")
      const initials =
        nameParts.length > 1 ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}` : formData.name.charAt(0)

      // Create a more detailed user profile with combined capabilities
      const userProfile = {
        id: userId,
        name: formData.name,
        email: formData.email,
        avatar: `/placeholder.svg?height=40&width=40&text=${initials}`,
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

      // Store user data in localStorage with both keys for compatibility
      localStorage.setItem("stylerent_user", JSON.stringify(userProfile))
      localStorage.setItem("opencloset_user", JSON.stringify(userProfile))

      // Store user ID separately for easy access
      localStorage.setItem("stylerent_user_id", userId)
      localStorage.setItem("opencloset_user_id", userId)

      // Set login status with both keys
      localStorage.setItem("stylerent_logged_in", "true")
      localStorage.setItem("opencloset_logged_in", "true")

      // Dispatch event to notify other components
      window.dispatchEvent(new Event("storage"))
      window.dispatchEvent(new CustomEvent("user-login", { detail: { user: userProfile } }))

      toast.success("Account created successfully!")

      // Redirect to the unified profile page
      setTimeout(() => {
        router.push("/profile")
      }, 300)
    } catch (error) {
      console.error("Signup error:", error)
      toast.error("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to render the sign-in link section
  const renderSignInLink = () => {
    return (
      <p className="mt-4 text-center text-sm text-muted-foreground font-alegreya">
        Already have an account? <SignInLink />
      </p>
    )
  }

  return (
    <div className="container flex min-h-screen w-full flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
        <div className="flex flex-col space-y-3 text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight font-cinzel">Create an account</h1>
          <p className="text-sm text-muted-foreground font-alegreya">Join OpenCloset to rent and list clothes</p>
        </div>

        <Card>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl font-cinzel">Sign Up</CardTitle>
            <CardDescription className="font-alegreya text-sm">
              Create an account to rent and list designer clothes
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-playfair">
                  Full Name
                </Label>
                <Input id="name" required value={formData.name} onChange={handleInputChange} placeholder="" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-playfair">
                  Email
                </Label>
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
                  <Label htmlFor="password" className="font-playfair">
                    Password
                  </Label>
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
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
              {renderSignInLink()}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
