"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FollowingFeed } from "@/components/following-feed"
import { getCurrentUser } from "@/lib/user-utils"
import { CustomerReviewsSection } from "@/components/customer-reviews-section"
import { RecommendedProfilesSection } from "@/components/recommended-profiles-section"
import { ArrowRight, Calendar, ShoppingBag, Truck } from "lucide-react"
import { AnimatedInfoCard } from "@/components/animated-info-card"
import {
  ContentSlider,
  AestheticCard,
  TrendingItemCardSlider,
  BundleCardSlider,
} from "@/components/home-content-slider"
import { TrendingBundlesSection } from "@/components/trending-bundles-section"

interface UpdatedHomeClientProps {
  feedType: string
  aestheticFilter: string | null
  categoryFilter: string | null
  sizeFilter: string | null
  brandFilter: string | null
  conditionFilter: string | null
  colorFilter: string | null
  priceFilter: string | null
  materialFilter: string | null
  sortOption: string
  followedAesthetics: string[]
  onFollowAesthetic: (aesthetic: string) => void
}

export default function UpdatedHomeClient({
  feedType,
  aestheticFilter,
  categoryFilter,
  sizeFilter,
  brandFilter,
  conditionFilter,
  colorFilter,
  priceFilter,
  materialFilter,
  sortOption,
  followedAesthetics,
  onFollowAesthetic,
}: UpdatedHomeClientProps) {
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Popular aesthetics in the system
  const popularAesthetics = [
    "Minimalist",
    "Vintage",
    "Streetwear",
    "Bohemian",
    "Preppy",
    "Athleisure",
    "Cottagecore",
    "Y2K",
    "Grunge",
    "Romantic",
  ]

  const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Orange", "Gray", "Brown"]

  const [trendingItems, setTrendingItems] = useState([
    {
      id: "1",
      name: "Silk Dress",
      rentalPrice: 45,
      media: [{ url: "/placeholder.svg?height=400&width=300&text=Silk Dress" }],
    },
    {
      id: "2",
      name: "Leather Jacket",
      rentalPrice: 60,
      media: [{ url: "/placeholder.svg?height=400&width=300&text=Leather Jacket" }],
    },
    {
      id: "3",
      name: "Denim Jeans",
      rentalPrice: 30,
      media: [{ url: "/placeholder.svg?height=400&width=300&text=Denim Jeans" }],
    },
    {
      id: "4",
      name: "Cashmere Sweater",
      rentalPrice: 50,
      media: [{ url: "/placeholder.svg?height=400&width=300&text=Cashmere Sweater" }],
    },
  ])

  const [featuredBundles, setFeaturedBundles] = useState([
    {
      id: "1",
      name: "Summer Essentials",
      price: 120,
      items: [
        { name: "Sun Hat", media: [{ url: "/placeholder.svg?height=300&width=400&text=Sun Hat" }] },
        { name: "Sunglasses", media: [{ url: "/placeholder.svg?height=300&width=400&text=Sunglasses" }] },
        { name: "Linen Dress", media: [{ url: "/placeholder.svg?height=300&width=400&text=Linen Dress" }] },
        { name: "Sandals", media: [{ url: "/placeholder.svg?height=300&width=400&text=Sandals" }] },
      ],
    },
    {
      id: "2",
      name: "Winter Warmers",
      price: 150,
      items: [
        { name: "Wool Scarf", media: [{ url: "/placeholder.svg?height=300&width=400&text=Wool Scarf" }] },
        { name: "Gloves", media: [{ url: "/placeholder.svg?height=300&width=400&text=Gloves" }] },
        { name: "Beanie", media: [{ url: "/placeholder.svg?height=300&width=400&text=Beanie" }] },
        { name: "Puffer Jacket", media: [{ url: "/placeholder.svg?height=300&width=400&text=Puffer Jacket" }] },
      ],
    },
    {
      id: "3",
      name: "Business Meeting",
      price: 200,
      items: [
        { name: "Tailored Blazer", media: [{ url: "/placeholder.svg?height=300&width=400&text=Tailored Blazer" }] },
        { name: "Dress Shirt", media: [{ url: "/placeholder.svg?height=300&width=400&text=Dress Shirt" }] },
        { name: "Slacks", media: [{ url: "/placeholder.svg?height=300&width=400&text=Slacks" }] },
        { name: "Leather Briefcase", media: [{ url: "/placeholder.svg?height=300&width=400&text=Leather Briefcase" }] },
        { name: "Oxford Shoes", media: [{ url: "/placeholder.svg?height=300&width=400&text=Oxford Shoes" }] },
      ],
    },
    {
      id: "4",
      name: "Date Night",
      price: 180,
      items: [
        { name: "Cocktail Dress", media: [{ url: "/placeholder.svg?height=300&width=400&text=Cocktail Dress" }] },
        {
          name: "Statement Earrings",
          media: [{ url: "/placeholder.svg?height=300&width=400&text=Statement Earrings" }],
        },
        { name: "Clutch Purse", media: [{ url: "/placeholder.svg?height=300&width=400&text=Clutch Purse" }] },
        { name: "Heels", media: [{ url: "/placeholder.svg?height=300&width=400&text=Heels" }] },
      ],
    },
    {
      id: "5",
      name: "Weekend Getaway",
      price: 160,
      items: [
        { name: "Casual Jeans", media: [{ url: "/placeholder.svg?height=300&width=400&text=Casual Jeans" }] },
        { name: "T-shirts (3)", media: [{ url: "/placeholder.svg?height=300&width=400&text=T-shirts" }] },
        { name: "Sneakers", media: [{ url: "/placeholder.svg?height=300&width=400&text=Sneakers" }] },
        { name: "Weekender Bag", media: [{ url: "/placeholder.svg?height=300&width=400&text=Weekender Bag" }] },
        { name: "Casual Jacket", media: [{ url: "/placeholder.svg?height=300&width=400&text=Casual Jacket" }] },
      ],
    },
    {
      id: "6",
      name: "Festival Ready",
      price: 140,
      items: [
        { name: "Boho Dress", media: [{ url: "/placeholder.svg?height=300&width=400&text=Boho Dress" }] },
        { name: "Fringe Vest", media: [{ url: "/placeholder.svg?height=300&width=400&text=Fringe Vest" }] },
        { name: "Ankle Boots", media: [{ url: "/placeholder.svg?height=300&width=400&text=Ankle Boots" }] },
        {
          name: "Statement Necklace",
          media: [{ url: "/placeholder.svg?height=300&width=400&text=Statement Necklace" }],
        },
        { name: "Crossbody Bag", media: [{ url: "/placeholder.svg?height=300&width=400&text=Crossbody Bag" }] },
      ],
    },
    {
      id: "7",
      name: "Luxury Evening",
      price: 350,
      items: [
        { name: "Designer Gown", media: [{ url: "/placeholder.svg?height=300&width=400&text=Designer Gown" }] },
        { name: "Diamond Earrings", media: [{ url: "/placeholder.svg?height=300&width=400&text=Diamond Earrings" }] },
        { name: "Evening Clutch", media: [{ url: "/placeholder.svg?height=300&width=400&text=Evening Clutch" }] },
        { name: "Stiletto Heels", media: [{ url: "/placeholder.svg?height=300&width=400&text=Stiletto Heels" }] },
        { name: "Wrap Shawl", media: [{ url: "/placeholder.svg?height=300&width=400&text=Wrap Shawl" }] },
      ],
    },
    {
      id: "8",
      name: "Athleisure Set",
      price: 90,
      items: [
        { name: "Premium Leggings", media: [{ url: "/placeholder.svg?height=300&width=400&text=Premium Leggings" }] },
        { name: "Sports Bra", media: [{ url: "/placeholder.svg?height=300&width=400&text=Sports Bra" }] },
        { name: "Workout Tank", media: [{ url: "/placeholder.svg?height=300&width=400&text=Workout Tank" }] },
        { name: "Athletic Shoes", media: [{ url: "/placeholder.svg?height=300&width=400&text=Athletic Shoes" }] },
        { name: "Zip-up Jacket", media: [{ url: "/placeholder.svg?height=300&width=400&text=Zip-up Jacket" }] },
      ],
    },
    {
      id: "9",
      name: "Vintage Collection",
      price: 220,
      items: [
        { name: "60s Mod Dress", media: [{ url: "/placeholder.svg?height=300&width=400&text=60s Mod Dress" }] },
        { name: "Retro Sunglasses", media: [{ url: "/placeholder.svg?height=300&width=400&text=Retro Sunglasses" }] },
        { name: "Vintage Handbag", media: [{ url: "/placeholder.svg?height=300&width=400&text=Vintage Handbag" }] },
        { name: "Mary Jane Shoes", media: [{ url: "/placeholder.svg?height=300&width=400&text=Mary Jane Shoes" }] },
        { name: "Pearl Necklace", media: [{ url: "/placeholder.svg?height=300&width=400&text=Pearl Necklace" }] },
      ],
    },
    {
      id: "10",
      name: "Beach Vacation",
      price: 130,
      items: [
        { name: "Designer Swimsuit", media: [{ url: "/placeholder.svg?height=300&width=400&text=Designer Swimsuit" }] },
        { name: "Cover-up", media: [{ url: "/placeholder.svg?height=300&width=400&text=Cover-up" }] },
        { name: "Beach Tote", media: [{ url: "/placeholder.svg?height=300&width=400&text=Beach Tote" }] },
        { name: "Flip Flops", media: [{ url: "/placeholder.svg?height=300&width=400&text=Flip Flops" }] },
        { name: "Sun Hat", media: [{ url: "/placeholder.svg?height=300&width=400&text=Sun Hat" }] },
        { name: "Beach Towel", media: [{ url: "/placeholder.svg?height=300&width=400&text=Beach Towel" }] },
      ],
    },
  ])

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  const isFollowingAesthetic = (aesthetic: string) => {
    return followedAesthetics.includes(aesthetic)
  }

  return (
    <>
      {/* Hero Section with Luxury Closet Background */}
      <section className="luxury-closet-hero relative w-full h-[70vh]">
        <div className="absolute inset-0">
          <img src="/images/luxury-closet.jpeg" alt="Luxury walk-in closet" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-playfair">
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

      {/* How It Works - Moved right below the hero */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-cinzel">How It Works</h2>
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

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        {feedType === "following" && currentUser ? (
          <FollowingFeed
            userId={currentUser.id}
            aestheticFilter={aestheticFilter}
            categoryFilter={categoryFilter}
            sizeFilter={sizeFilter}
            brandFilter={brandFilter}
            conditionFilter={conditionFilter}
            colorFilter={colorFilter}
            priceFilter={priceFilter}
            materialFilter={materialFilter}
            sortOption={sortOption}
          />
        ) : (
          <div>
            {/* Popular Aesthetics Slider */}
            <ContentSlider
              title="Popular Aesthetics"
              viewAllLink="/profile/aesthetics"
              viewAllText="Manage Aesthetics"
              className="mb-12"
            >
              {popularAesthetics.map((aesthetic) => (
                <AestheticCard
                  key={aesthetic}
                  name={aesthetic}
                  imageUrl={`/placeholder.svg?height=400&width=300&text=${aesthetic}`}
                  isFollowed={followedAesthetics.includes(aesthetic)}
                  onToggleFollow={() => onFollowAesthetic(aesthetic)}
                />
              ))}
            </ContentSlider>

            {/* Trending Items Slider */}
            <ContentSlider title="Trending Items" viewAllLink="/browse?sort=trending" className="mb-12">
              {trendingItems.map((item) => (
                <TrendingItemCardSlider
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.rentalPrice || 0}
                  imageUrl={item.media?.[0]?.url || `/placeholder.svg?height=400&width=300&text=${item.name}`}
                />
              ))}
            </ContentSlider>

            {/* Trending Bundles Section with Items */}
            <TrendingBundlesSection />

            {/* Featured Bundles Slider */}
            <ContentSlider title="Featured Bundles" viewAllLink="/bundles" className="mb-12">
              {featuredBundles.map((bundle) => (
                <BundleCardSlider
                  key={bundle.id}
                  id={bundle.id}
                  name={bundle.name}
                  price={bundle.price || 0}
                  itemCount={bundle.items?.length || 0}
                  images={
                    bundle.items?.map(
                      (item) => item.media?.[0]?.url || `/placeholder.svg?height=300&width=400&text=${item.name}`,
                    ) || [`/placeholder.svg?height=300&width=400&text=${bundle.name}`]
                  }
                />
              ))}
            </ContentSlider>

            {/* Customer Reviews Section */}
            <CustomerReviewsSection />

            {/* Recommended Profiles Section */}
            <RecommendedProfilesSection />
          </div>
        )}
      </div>
    </>
  )
}
