"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package, ShoppingBag, DollarSign, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateBundleModal } from "@/components/create-bundle-modal"

export default function NewLenderProfile() {
  const router = useRouter()
  const [createBundleOpen, setCreateBundleOpen] = useState(false)

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Lender Dashboard</h1>
          <p className="text-muted-foreground">Start earning by renting out your clothes and accessories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                List Your Items
              </CardTitle>
              <CardDescription>Add your clothing items to the marketplace</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Start by listing your first item. Add photos, details, and set your rental price.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push("/list-item")}>
                List Your First Item
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                Create Bundles
              </CardTitle>
              <CardDescription>Group items together for complete looks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create bundles to offer complete outfits and increase your rental potential.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setCreateBundleOpen(true)}>
                Create Your First Bundle
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
                  <h3 className="font-medium">List Your Items</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add photos and details of your clothing items and set your rental price.
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
                  <h3 className="font-medium">Receive Rental Requests</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Renters will request your items for specific dates. You can approve or decline.
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
                  <h3 className="font-medium">Earn Money</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Get paid for each rental. We handle payments and security deposits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lender Benefits</CardTitle>
            <CardDescription>Why you should rent out your clothes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <DollarSign className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <h4 className="font-medium">Extra Income</h4>
                  <p className="text-sm text-muted-foreground">
                    Earn money from clothes you don't wear often. Most lenders earn $200-500 per month.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <h4 className="font-medium">Community</h4>
                  <p className="text-sm text-muted-foreground">
                    Join a community of fashion enthusiasts sharing their style.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Package className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <h4 className="font-medium">Sustainability</h4>
                  <p className="text-sm text-muted-foreground">
                    Extend the lifecycle of your clothes and reduce fashion waste.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/list-item")}>
              Get Started Now
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
