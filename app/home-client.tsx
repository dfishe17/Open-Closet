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
  {
    id: "4",
    name: "Leather Jacket",
    designer: "AllSaints",
    price: 50,
    retailPrice: 450,
    rating: 4.6,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "5",
    name: "Silk Blouse",
    designer: "Equipment",
    price: 25,
    retailPrice: 280,
    rating: 4.5,
    image: "/placeholder.svg?height=400&width=300",
  },
]

const testimonials = [
  {
    name: "Sarah J.",
    location: "New York, NY",
    rating: 5,
    text: "StyleRent has completely changed how I dress for special events. The quality of the clothes is amazing and the process is so simple!",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Michael T.",
    location: "Los Angeles, CA",
    rating: 5,
    text: "I needed a suit for a wedding and didn't want to buy one. StyleRent delivered a perfect fit and saved me hundreds of dollars.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Emma R.",
    location: "Chicago, IL",
    rating: 4,
    text: "Love the concept and the execution. The only reason I'm not giving 5 stars is because I wish they had even more selection!",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

const recommendedProfiles = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=100&width=100&text=SJ",
    coverImage: "/placeholder.svg?height=300&width=450&text=Sarah's+Collection",
    bio: "Fashion enthusiast sharing my premium designer collection. All items are carefully maintained and professionally cleaned between rentals.",
    location: "New York, NY",
    rating: 5,
    reviewCount: 167,
    itemCount: 48,
    specialties: ["Designer", "Dresses", "Formal Wear"],
    featured: true,
  },
  {
    id: "michael-chen",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=100&width=100&text=MC",
    coverImage: "/placeholder.svg?height=300&width=450&text=Michael's+Collection",
    bio: "Menswear specialist with a focus on high-quality suits, designer streetwear, and accessories. Perfect for business events and special occasions.",
    location: "San Francisco, CA",
    rating: 4.9,
    reviewCount: 124,
    itemCount: 36,
    specialties: ["Menswear", "Suits", "Streetwear"],
    featured: true,
  },
  {
    id: "emma-rodriguez",
    name: "Emma Rodriguez",
    avatar: "/placeholder.svg?height=100&width=100&text=ER",
    coverImage: "/placeholder.svg?height=300&width=450&text=Emma's+Collection",
    bio: "Vintage fashion collector specializing in unique pieces from the 60s, 70s, and 80s. Each item tells a story and adds character to any outfit.",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviewCount: 98,
    itemCount: 52,
    specialties: ["Vintage", "Retro", "Bohemian"],
    featured: true,
  },
  {
    id: "olivia-wilson",
    name: "Olivia Wilson",
    avatar: "/placeholder.svg?height=100&width=100&text=OW",
    coverImage: "/placeholder.svg?height=300&width=450&text=Olivia's+Collection",
    bio: "Luxury accessories specialist offering high-end handbags, jewelry, and statement pieces to elevate any outfit. Perfect for special events.",
    location: "Miami, FL",
    rating: 5,
    reviewCount: 112,
    itemCount: 38,
    specialties: ["Accessories", "Handbags", "Jewelry"],
  },
]

export default function HomeClient() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Luxury Closet Background */}
      <section className="relative w-full h-[70vh]">
        <div className="absolute inset-0">
          <img src="/images/luxury-closet.jpeg" alt="Luxury walk-in closet" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-cinzel">
              Rent Designer Clothes for Any Occasion
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-alegreya">
              Access premium fashion without the commitment. Rent, wear, return, repeat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md font-playfair"
                asChild
              >
                <Link href="/browse">
                  Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md hover:bg-secondary/80 bg-white/10 text-white border-white/30 hover:bg-white/20 font-playfair"
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
          <h2 className="text-3xl font-bold text-center mb-12 font-playfair">How It Works</h2>
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
            <h2 className="text-3xl font-bold font-alegreya">Featured Items</h2>
            <Button
              variant="outline"
              className="transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] font-playfair"
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
                            <p className="font-medium font-playfair">{item.name}</p>
                            <p className="text-sm opacity-90 font-alegreya">{item.designer}</p>
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
                            <p className="font-medium font-playfair">${item.price}/day</p>
                            <p className="text-sm text-muted-foreground font-alegreya">Retail: ${item.retailPrice}</p>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                            <span className="text-sm font-alegreya">{item.rating}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-center">
                          <PulsatingButton className="text-xs font-cinzel">RENT NOW</PulsatingButton>
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

      {/* Top Bundles Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-cinzel">Curated Style Bundles</h2>
            <Button
              variant="outline"
              className="transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] font-playfair"
              asChild
            >
              <Link href="/bundles">View All Bundles</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Weekend Getaway Bundle */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-video bg-muted">
                <img
                  src="/placeholder.svg?height=300&width=500&text=Weekend+Getaway"
                  alt="Weekend Getaway Bundle"
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white text-xl font-playfair">Weekend Getaway</h3>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-muted-foreground mb-3 font-alegreya">
                  Perfect casual-chic pieces for a stylish weekend trip.
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <img src="/placeholder.svg?height=80&width=80" alt="Item 1" className="rounded-md" />
                  <img src="/placeholder.svg?height=80&width=80" alt="Item 2" className="rounded-md" />
                  <img src="/placeholder.svg?height=80&width=80" alt="Item 3" className="rounded-md" />
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium font-playfair">$120/weekend</p>
                  <Button size="sm" className="font-cinzel">
                    Rent Bundle
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Trip Bundle */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-video bg-muted">
                <img
                  src="/placeholder.svg?height=300&width=500&text=Business+Trip"
                  alt="Business Trip Bundle"
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white text-xl font-playfair">Business Trip</h3>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-muted-foreground mb-3 font-alegreya">
                  Professional attire for meetings and business dinners.
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <img src="/placeholder.svg?height=80&width=80" alt="Item 1" className="rounded-md" />
                  <img src="/placeholder.svg?height=80&width=80" alt="Item 2" className="rounded-md" />
                  <img src="/placeholder.svg?height=80&width=80" alt="Item 3" className="rounded-md" />
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium font-playfair">$150/week</p>
                  <Button size="sm" className="font-cinzel">
                    Rent Bundle
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Special Occasion Bundle */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-video bg-muted">
                <img
                  src="/placeholder.svg?height=300&width=500&text=Special+Occasion"
                  alt="Special Occasion Bundle"
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white text-xl font-playfair">Special Occasion</h3>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-muted-foreground mb-3 font-alegreya">
                  Stunning formal wear and accessories for your special event.
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <img src="/placeholder.svg?height=80&width=80" alt="Item 1" className="rounded-md" />
                  <img src="/placeholder.svg?height=80&width=80" alt="Item 2" className="rounded-md" />
                  <img src="/placeholder.svg?height=80&width=80" alt="Item 3" className="rounded-md" />
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium font-playfair">$180/weekend</p>
                  <Button size="sm" className="font-cinzel">
                    Rent Bundle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recommended Profiles Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 font-alegreya">Top Lenders</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProfiles.slice(0, 4).map((profile) => (
              <Card
                key={profile.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  <img
                    src={profile.coverImage || "/placeholder.svg"}
                    alt={`${profile.name}'s collection`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={profile.avatar || "/placeholder.svg"}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium font-playfair">{profile.name}</h3>
                      <p className="text-sm text-muted-foreground font-alegreya">{profile.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(profile.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="text-sm ml-1 font-alegreya">({profile.reviewCount})</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {profile.specialties.map((specialty, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full font-alegreya"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground font-alegreya">{profile.itemCount} items</span>
                    <Button size="sm" variant="outline" asChild className="font-playfair">
                      <Link href={`/profile/${profile.id}`}>View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-cinzel">What Our Customers Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium font-playfair">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground font-alegreya">{testimonial.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="italic text-muted-foreground font-alegreya">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/50 border-t mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground font-alegreya">
            © {new Date().getFullYear()} StyleRent. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
