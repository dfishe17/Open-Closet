"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function MobileSignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // For demo purposes, we'll just simulate a successful login
      // In a real app, you would validate credentials with your backend
      setTimeout(() => {
        // Store user data in localStorage
        localStorage.setItem("stylerent_logged_in", "true")
        localStorage.setItem(
          "stylerent_user",
          JSON.stringify({
            id: "user-123",
            name: "Jane Doe",
            email: email,
            avatar: "/placeholder.svg?height=200&width=200&text=JD",
            rating: 4.8,
          }),
        )

        // Redirect to profile page
        router.push("/mobile/profile")
      }, 1500)
    } catch (error) {
      setError("Invalid email or password")
      setIsLoading(false)
    }
  }

  return (
    <div className="container px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold font-cinzel mb-2">OpenCloset Mobile</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/mobile/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/mobile/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
