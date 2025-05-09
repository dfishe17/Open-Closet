"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function InstallPage() {
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if the app is already installed (running in standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true)
    }

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(userAgent))
    setIsAndroid(/android/.test(userAgent))
  }, [])

  if (isStandalone) {
    return (
      <div className="container px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>App Already Installed</CardTitle>
            <CardDescription>You're already using the installed app!</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">You're currently using OpenCloset as an installed app.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/mobile">Go to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold font-cinzel mb-2">OpenCloset Mobile</h1>
        <p className="text-sm text-muted-foreground">Install our app for the best experience</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Install OpenCloset</CardTitle>
          <CardDescription>Add our app to your home screen for easy access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isIOS && (
            <div className="space-y-4">
              <h3 className="font-medium">iOS Installation Steps:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Tap the Share button <span className="inline-block w-6 h-6 text-center border rounded">↑</span> at the
                  bottom of the screen
                </li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" in the top right corner</li>
              </ol>
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-sm">
                  After installation, you'll have the full app experience with offline capabilities.
                </p>
              </div>
            </div>
          )}

          {isAndroid && (
            <div className="space-y-4">
              <h3 className="font-medium">Android Installation Steps:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Tap the menu button (⋮) in the top right of your browser</li>
                <li>Tap "Add to Home screen" or "Install app"</li>
                <li>Follow the on-screen instructions</li>
              </ol>
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-sm">
                  After installation, you'll have the full app experience with offline capabilities.
                </p>
              </div>
            </div>
          )}

          {!isIOS && !isAndroid && (
            <div className="space-y-4">
              <h3 className="font-medium">Installation Steps:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Click on the install icon in your browser's address bar</li>
                <li>Follow the on-screen instructions to install</li>
              </ol>
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-sm">
                  After installation, you'll have the full app experience with offline capabilities.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" disabled>
            <Download className="mr-2 h-4 w-4" />
            Install App
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/mobile">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue to Website
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
