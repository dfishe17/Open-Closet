"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { saveUserProfile } from "@/lib/user-utils"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!email || !password) {
      alert("Please enter both email and password")
      return
    }

    // Mock login - in a real app, this would validate against a backend
    const userProfile = {
      id: "user-" + Date.now(),
      email,
      name: email.split("@")[0],
      isAdmin: email.includes("admin"),
    }

    // Save user profile to localStorage
    saveUserProfile(userProfile)

    // Also save as stylerent_user for compatibility
    localStorage.setItem(
      "stylerent_user",
      JSON.stringify({
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        userType: userProfile.isAdmin ? "admin" : "renter",
        createdAt: new Date().toISOString(),
        memberSince: new Date().toISOString(),
      }),
    )

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("authChange"))

    // Redirect to home page
    router.push("/")
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">(Any password will work for this demo)</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
