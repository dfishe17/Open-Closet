"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateBundleModal } from "@/components/create-bundle-modal"

export default function NewRenterProfile() {
  const router = useRouter()
  const [createBundleOpen, setCreateBundleOpen] = useState(false)

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Renter Dashboard</h1>
          <p className="text-muted-foreground">Discover and rent amazing clothes for any occasion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                Browse Items
              </CardTitle>
              <CardDescription>Explore available clothing items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Browse through thousands of unique items from lenders in your area.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push("/browse")}>
                Start Browsing
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                Explore Bundles
              </CardTitle>
              <CardDescription>Discover complete outfit bundles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Rent complete outfits curated by our community of fashion enthusiasts.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/bundles")}>
                View Bundles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mr-4">
                  <span className="font-medium text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Browse & Select</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Find the perfect items or bundles for your occasion.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mr-4">
                  <span className="font-medium text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Book Your Rental</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Select your rental dates and complete your booking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mr-4">
                  <span className="font-medium text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Enjoy & Return</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Receive your items, enjoy your event, and return when done.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Own Bundle</CardTitle>
            <CardDescription>Mix and match items to create your perfect look</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Want to create your own custom bundle? Select items from different lenders and save them together for easy
              access.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => setCreateBundleOpen(true)}>
              <Package className="h-4 w-4 mr-2" />
              Create Your First Bundle
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Bundle Creation Modal */}
      <CreateBundleModal
        open={createBundleOpen}
        onOpenChange={setCreateBundleOpen}
        onSuccess={() => router.push("/bundles")}
      />
    </div>
  )
}
