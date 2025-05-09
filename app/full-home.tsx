"use client"

import Link from "next/link"
import { ArrowRight, Calendar, Heart, ShoppingBag, Star, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { AnimatedInfoCard } from "@/components/animated-info-card"
import { PulsatingButton } from "@/components/pulsating-button"

// Sample data
const featuredItems = [
  {
    id: "1",
    name: "Floral Summer Dress",
    designer: "Zimmermann",
    price: 45,
    retailPrice: 595,
    rating: 4.8,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "2",
    name: "Tailored Blazer",
    designer: "Theory",
    price: 35,
    retailPrice: 425,
    rating: 4.7,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "3",
    name: "Evening Gown",
    designer: "Marchesa",
    price: 75,
    retailPrice: 1200,
    rating: 4.9,
    image: "/placeholder.svg?height=400&width=300",
  },
]

export default function FullHome() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Rent Designer Clothes for Any Occasion</h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Access premium fashion without the commitment. Rent, wear, return, repeat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md"
                asChild
              >
                <Link href="/browse">
                  Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md hover:bg-secondary/80"
                asChild
              >
                <Link href="/auth/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="cards-container">
            <AnimatedInfoCard
              title="Browse & Select"
              description="Explore our curated collection of designer clothes and accessories. Filter by size, style, or occasion."
              icon={ShoppingBag}
              color="blush"
            />
            <AnimatedInfoCard
              title="Book Your Dates"
              description="Choose your rental period with our easy-to-use calendar. Select delivery and return dates that work for you."
              icon={Calendar}
              color="sage"
            />
            <AnimatedInfoCard
              title="Wear & Return"
              description="Receive your items, enjoy wearing them, and return using our prepaid shipping label. No cleaning necessary!"
              icon={Truck}
              color="taupe"
            />
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Items</h2>
            <Button
              variant="outline"
              className="transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
              asChild
            >
              <Link href="/browse">View All</Link>
            </Button>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {featuredItems.map((item) => (
                <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Link href={`/items/${item.id}`}>
                    <Card className="overflow-hidden h-full border-none shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                      <div className="relative aspect-[3/4] bg-muted">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                          <div className="text-white">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm opacity-90">{item.designer}</p>
                          </div>
                        </div>
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                        >
                          <Heart className="h-4 w-4" />
                          <span className="sr-only">Add to wishlist</span>
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">${item.price}/day</p>
                            <p className="text-sm text-muted-foreground">Retail: ${item.retailPrice}</p>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                            <span className="text-sm">{item.rating}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-center">
                          <PulsatingButton className="text-xs">RENT NOW</PulsatingButton>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/50 border-t mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© {new Date().getFullYear()} OpenCloset. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
