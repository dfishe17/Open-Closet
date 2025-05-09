"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronRight, Star, Calendar, ShoppingBag, Truck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { MobileHero } from "@/components/mobile/mobile-hero"

export default function MobileHomePage() {
  const router = useRouter()
  const [featuredItems, setFeaturedItems] = useState<any[]>([])
  const [trendingBundles, setTrendingBundles] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading featured items
    setTimeout(() => {
      setFeaturedItems([
        {
          id: "item1",
          name: "Designer Dress",
          designer: "Gucci",
          price: 45,
          image: "/placeholder.svg?height=300&width=225&text=Designer+Dress",
          rating: 4.8,
        },
        {
          id: "item2",
          name: "Luxury Handbag",
          designer: "Prada",
          price: 35,
          image: "/placeholder.svg?height=300&width=225&text=Luxury+Handbag",
          rating: 4.7,
        },
        {
          id: "item3",
          name: "Formal Suit",
          designer: "Armani",
          price: 50,
          image: "/placeholder.svg?height=300&width=225&text=Formal+Suit",
          rating: 4.9,
        },
        {
          id: "item4",
          name: "Casual Jacket",
          designer: "Burberry",
          price: 30,
          image: "/placeholder.svg?height=300&width=225&text=Casual+Jacket",
          rating: 4.6,
        },
      ])

      setTrendingBundles([
        {
          id: "bundle1",
          name: "Weekend Getaway",
          items: 4,
          price: 120,
          image: "/placeholder.svg?height=300&width=225&text=Weekend+Bundle",
        },
        {
          id: "bundle2",
          name: "Formal Event",
          items: 3,
          price: 150,
          image: "/placeholder.svg?height=300&width=225&text=Formal+Bundle",
        },
      ])

      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/mobile/browse?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <div className="container px-4 py-4">
      {/* Hero Section */}
      <MobileHero
        imageUrl="/images/mobile-hero.png"
        title="OpenCloset"
        subtitle="Rent designer clothes for any occasion"
        buttonText="Browse Collection"
        buttonLink="/mobile/browse"
      />

      <form onSubmit={handleSearch} className="relative mb-6">
        <Input
          type="text"
          placeholder="Search for items, designers..."
          className="pl-10 pr-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </form>

      {/* How It Works Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 font-cinzel">How It Works</h2>
        <div className="grid gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex items-start">
              <div className="bg-sage/20 p-2 rounded-full mr-4">
                <ShoppingBag className="h-5 w-5 text-sage" />
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">Browse & Select</h3>
                <p className="text-xs text-muted-foreground">
                  Explore our curated collection of designer clothes and accessories.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex items-start">
              <div className="bg-blush/20 p-2 rounded-full mr-4">
                <Calendar className="h-5 w-5 text-blush" />
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">Book Your Dates</h3>
                <p className="text-xs text-muted-foreground">
                  Choose your rental period with our easy-to-use calendar.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex items-start">
              <div className="bg-taupe/20 p-2 rounded-full mr-4">
                <Truck className="h-5 w-5 text-taupe" />
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">Wear & Return</h3>
                <p className="text-xs text-muted-foreground">
                  Receive your items, enjoy wearing them, and return using our prepaid shipping label.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Featured Items</h2>
          <Button variant="link" size="sm" asChild className="p-0">
            <Link href="/mobile/browse" className="flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-lg mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {featuredItems.map((item) => (
              <Link href={`/mobile/items/${item.id}`} key={item.id}>
                <Card className="overflow-hidden border-none shadow-sm">
                  <div className="aspect-[3/4] bg-muted">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.designer}</p>
                    <div className="mt-1 flex justify-between items-center">
                      <p className="font-medium text-sm">${item.price}/day</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                        <span className="text-xs">{item.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Trending Bundles</h2>
          <Button variant="link" size="sm" asChild className="p-0">
            <Link href="/mobile/bundles" className="flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/9] bg-muted rounded-lg mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {trendingBundles.map((bundle) => (
              <Link href={`/mobile/bundles/${bundle.id}`} key={bundle.id}>
                <Card className="overflow-hidden border-none shadow-sm">
                  <div className="aspect-[16/9] bg-muted relative">
                    <img
                      src={bundle.image || "/placeholder.svg"}
                      alt={bundle.name}
                      className="object-cover w-full h-full"
                    />
                    <Badge className="absolute top-2 left-2">Bundle</Badge>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium">{bundle.name}</h3>
                    <div className="mt-1 flex justify-between items-center">
                      <p className="font-medium">${bundle.price}/day</p>
                      <p className="text-xs text-muted-foreground">{bundle.items} items</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <h3 className="font-medium mb-2">Install Our App</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Add OpenCloset to your home screen for a better experience
          </p>
          <Button size="sm" className="w-full">
            Add to Home Screen
          </Button>
        </div>
      </div>
    </div>
  )
}
