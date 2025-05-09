"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, Home, LogOut } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  // Ensure user is logged out when this page loads
  useEffect(() => {
    // Double-check logout status
    const isLoggedIn =
      localStorage.getItem("opencloset_logged_in") === "true" || localStorage.getItem("stylerent_logged_in") === "true"

    if (isLoggedIn) {
      // If somehow still logged in, clear everything
      localStorage.setItem("opencloset_logged_in", "false")
      localStorage.setItem("stylerent_logged_in", "false")
      localStorage.removeItem("opencloset_user")
      localStorage.removeItem("stylerent_user")

      // Trigger auth changed event
      window.dispatchEvent(new CustomEvent("opencloset-auth-changed"))
      window.dispatchEvent(new CustomEvent("stylerent-auth-changed"))
    }
  }, [])

  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">You've Been Logged Out</CardTitle>
          <CardDescription>
            Thank you for using OpenCloset. You have been successfully logged out of your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We hope you enjoyed your experience with us. For security reasons, we've ended your session.
          </p>
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center">
              <LogOut className="h-8 w-8 text-sage" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/auth/signin">
              <LogIn className="mr-2 h-4 w-4" />
              Sign Back In
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
