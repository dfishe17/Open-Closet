"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to request a password reset
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      // if (!response.ok) throw new Error('Failed to send reset email');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
    } catch (error) {
      console.error("Forgot password error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Button
          variant="ghost"
          className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center"
          onClick={() => router.push("/auth/signin")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Button>

        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <Card>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Check your email</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>
              </div>
              <Button className="w-full mt-4" onClick={() => router.push("/auth/signin")}>
                Back to sign in
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
