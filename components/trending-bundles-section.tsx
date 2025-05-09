"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ContentSlider } from "@/components/home-content-slider"

interface BundleItem {
  id: string
  name: string
  designer?: string
  media?: { url: string }[]
  rentalPrice?: number
  imageUrl?: string
}

interface Bundle {
  id: string
  name: string
  description?: string
  items: BundleItem[]
  price?: number
  discount?: number
  aesthetic?: string
  size?: string
  sizes?: string[]
}

export function TrendingBundlesSection() {
  // Sample data - in a real app, this would come from an API or props
  const mockBundles = [
    {
      id: "bundle1",
      name: "Summer Wedding Guest",
      description: "Perfect for summer weddings and formal events",
      price: 175,
      items: [
        {
          id: "item1",
          name: "Floral Maxi Dress",
          imageUrl: "/placeholder.svg?height=300&width=300&text=Floral+Maxi+Dress",
        },
        {
          id: "item2",
          name: "Strappy Sandals",
          imageUrl: "/placeholder.svg?height=300&width=300&text=Strappy+Sandals",
        },
        {
          id: "item3",
          name: "Statement Earrings",
          imageUrl: "/placeholder.svg?height=300&width=300&text=Statement+Earrings",
        },
        { id: "item4", name: "Clutch Purse", imageUrl: "/placeholder.svg?height=300&width=300&text=Clutch+Purse" },
        { id: "item5", name: "Bracelet Set", imageUrl: "/placeholder.svg?height=300&width=300&text=Bracelet+Set" },
      ],
      aesthetic: "Romantic",
      sizes: ["S", "M", "L"],
    },
    {
      id: "bundle2",
      name: "Business Conference",
      description: "Professional attire for multi-day business events",
      price: 220,
      items: [
        {
          id: "item6",
          name: "Tailored Blazer",
          imageUrl: "/placeholder.svg?height=300&width=300&text=Tailored+Blazer",
        },
        { id: "item7", name: "Pencil Skirt", imageUrl: "/placeholder.svg?height=300&width=300&text=Pencil+Skirt" },
        { id: "item8", name: "Silk Blouse", imageUrl: "/placeholder.svg?height=300&width=300&text=Silk+Blouse" },
        { id: "item9", name: "Leather Pumps", imageUrl: "/placeholder.svg?height=300&width=300&text=Leather+Pumps" },
        { id: "item10", name: "Laptop Bag", imageUrl: "/placeholder.svg?height=300&width=300&text=Laptop+Bag" },
        { id: "item11", name: "Pearl Earrings", imageUrl: "/placeholder.svg?height=300&width=300&text=Pearl+Earrings" },
      ],
      aesthetic: "Minimalist",
      sizes: ["XS", "S", "M"],
    },
    {
      id: "bundle3",
      name: "Festival Weekend",
      description: "Boho chic looks for music festivals",
      price: 150,
      items: [
        { id: "item12", name: "Crochet Top", imageUrl: "/placeholder.svg?height=300&width=300&text=Crochet+Top" },
        { id: "item13", name: "Denim Shorts", imageUrl: "/placeholder.svg?height=300&width=300&text=Denim+Shorts" },
        { id: "item14", name: "Fringe Vest", imageUrl: "/placeholder.svg?height=300&width=300&text=Fringe+Vest" },
        { id: "item15", name: "Ankle Boots", imageUrl: "/placeholder.svg?height=300&width=300&text=Ankle+Boots" },
        {
          id: "item16",
          name: "Layered Necklaces",
          imageUrl: "/placeholder.svg?height=300&width=300&text=Layered+Necklaces",
        },
        { id: "item17", name: "Fedora Hat", imageUrl: "/placeholder.svg?height=300&width=300&text=Fedora+Hat" },
      ],
      aesthetic: "Bohemian",
      sizes: ["XS", "S", "M", "L"],
    },
    {
      id: "bundle4",
      name: "Winter Ski Trip",
      description: "Stylish and functional ski apparel",
      price: 280,
      items: [
        {
          id: "item18",
          name: "Designer Ski Jacket",
          imageUrl: "/placeholder.svg?height=300&width=300&text=Designer+Ski+Jacket",
        },
        {
          id: "item19",
          name: "Insulated Ski Pants",
          imageUrl: "/placeholder.svg?height=300&width=300&text=Insulated+Ski+Pants",
        },
        {
          id: "item20",
          name: "Thermal Base Layer",
          imageUrl: "/placeholder.svg?height=300&width=300&text=Thermal+Base+Layer",
        },
        {
          id: "item21",
          name: "Cashmere Beanie",
          imageUrl: "/placeholder.svg?height=300&width=300&text=Cashmere+Beanie",
        },
        {
          id: "item22",
          name: "Waterproof Gloves",
          imageUrl: "/placeholder.svg?height=300&width=300&text=Waterproof+Gloves",
        },
        { id: "item23", name: "Wool Socks", imageUrl: "/placeholder.svg?height=300&width=300&text=Wool+Socks" },
      ],
      aesthetic: "Athleisure",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: "bundle5",
      name: "Y2K Party",
      description: "Nostalgic 2000s inspired outfits",
      price: 135,
      items: [
        { id: "item24", name: "Low-Rise Jeans", imageUrl: "/placeholder.svg?height=300&width=300&text=Low-Rise+Jeans" },
        { id: "item25", name: "Baby Tee", imageUrl: "/placeholder.svg?height=300&width=300&text=Baby+Tee" },
        {
          id: "item26",
          name: "Platform Sandals",
          imageUrl: "/placeholder.svg?height=300&width=300&text=Platform+Sandals",
        },
        {
          id: "item27",
          name: "Butterfly Clips",
          imageUrl: "/placeholder.svg?height=300&width=300&text=Butterfly+Clips",
        },
        { id: "item28", name: "Baguette Bag", imageUrl: "/placeholder.svg?height=300&width=300&text=Baguette+Bag" },
      ],
      aesthetic: "Y2K",
      sizes: ["XS", "S", "M"],
    },
  ]

  return (
    <ContentSlider title="Trending Bundles" viewAllLink="/bundles" className="mb-12">
      {mockBundles.map((bundle) => (
        <BundleWithItemsCard key={bundle.id} bundle={bundle} />
      ))}
    </ContentSlider>
  )
}

interface BundleWithItemsCardProps {
  bundle: Bundle
}

function BundleWithItemsCard({ bundle }: BundleWithItemsCardProps) {
  const [activeItemIndex, setActiveItemIndex] = useState(0)
  const maxVisibleItems = 3
  const visibleItems = bundle.items.slice(0, maxVisibleItems)

  const nextItem = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveItemIndex((prev) => (prev + 1) % bundle.items.length)
  }

  const prevItem = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveItemIndex((prev) => (prev - 1 + bundle.items.length) % bundle.items.length)
  }

  return (
    <div className="min-w-[350px] w-[350px] snap-start">
      <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">{bundle.name}</h3>
            <Badge variant="outline" className="font-normal">
              {bundle.aesthetic}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{bundle.description}</p>
          <div className="flex justify-between items-center mt-2">
            <p className="font-medium text-primary">${bundle.price}/day</p>
            <Badge variant="secondary">{bundle.items.length} items</Badge>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-3 gap-1 p-1">
            {visibleItems.map((item, index) => (
              <div key={item.id} className="aspect-square relative group overflow-hidden">
                <img
                  src={item.imageUrl || item.media?.[0]?.url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-xs font-medium text-center px-1">{item.name}</p>
                </div>
              </div>
            ))}
          </div>

          {bundle.items.length > maxVisibleItems && (
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-background/80 backdrop-blur-sm text-foreground">
                +{bundle.items.length - maxVisibleItems} more
              </Badge>
            </div>
          )}
        </div>

        <div className="p-3 flex justify-between items-center">
          <div className="text-sm">
            <span className="text-muted-foreground">Size: </span>
            <span className="font-medium">{bundle.sizes ? bundle.sizes.join(", ") : bundle.size}</span>
          </div>
          <Button size="sm" asChild>
            <Link href={`/bundles/${bundle.id}`}>
              View Bundle <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
