"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SliderProps {
  title: string
  viewAllLink?: string
  viewAllText?: string
  className?: string
  children: React.ReactNode
}

export function ContentSlider({ title, viewAllLink, viewAllText = "View All", className, children }: SliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollButtons = () => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    setCanScrollLeft(scrollContainer.scrollLeft > 0)
    setCanScrollRight(scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth - 10)
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    checkScrollButtons()
    scrollContainer.addEventListener("scroll", checkScrollButtons)
    window.addEventListener("resize", checkScrollButtons)

    return () => {
      scrollContainer.removeEventListener("scroll", checkScrollButtons)
      window.removeEventListener("resize", checkScrollButtons)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const scrollAmount = scrollContainer.clientWidth * 0.75
    const newScrollLeft =
      direction === "left" ? scrollContainer.scrollLeft - scrollAmount : scrollContainer.scrollLeft + scrollAmount

    scrollContainer.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold font-serif">{title}</h2>
        {viewAllLink && (
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href={viewAllLink}>
              {viewAllText}
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        )}
      </div>

      <div className="relative group">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity",
            !canScrollLeft && "hidden",
          )}
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Scroll left</span>
        </Button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory"
          onScroll={checkScrollButtons}
        >
          {children}
        </div>

        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity",
            !canScrollRight && "hidden",
          )}
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Scroll right</span>
        </Button>
      </div>
    </div>
  )
}

// Aesthetic Card Component
interface AestheticCardProps {
  name: string
  imageUrl: string
  isFollowed?: boolean
  onToggleFollow?: () => void
}

export function AestheticCard({ name, imageUrl, isFollowed, onToggleFollow }: AestheticCardProps) {
  return (
    <div className="min-w-[180px] w-[180px] snap-start">
      <div className="relative group overflow-hidden rounded-lg">
        <div className="aspect-[3/4] bg-muted overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
          <div className="w-full">
            <h3 className="text-white font-medium mb-1">{name}</h3>
            {onToggleFollow && (
              <Button
                variant={isFollowed ? "default" : "secondary"}
                size="sm"
                className="w-full text-xs"
                onClick={onToggleFollow}
              >
                {isFollowed ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Trending Item Card Component
interface TrendingItemCardProps {
  id: string
  name: string
  price: number
  imageUrl: string
}

export function TrendingItemCardSlider({ id, name, price, imageUrl }: TrendingItemCardProps) {
  return (
    <div className="min-w-[220px] w-[220px] snap-start">
      <Link href={`/items/${id}`}>
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="aspect-[4/5] bg-muted overflow-hidden">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardContent className="p-3">
            <h3 className="font-medium text-sm line-clamp-1">{name}</h3>
            <p className="text-primary font-bold">${price}/day</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

// Bundle Card Component with Image Carousel
interface BundleCardProps {
  id: string
  name: string
  price: number
  images: string[]
  itemCount: number
}

export function BundleCardSlider({ id, name, price, images, itemCount }: BundleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-w-[280px] w-[280px] snap-start">
      <Link href={`/bundles/${id}`}>
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="aspect-[3/2] bg-muted overflow-hidden relative group">
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />

            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous image</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next image</span>
                </Button>

                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        index === currentImageIndex ? "w-3 bg-white" : "w-1.5 bg-white/60",
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground">
              {itemCount} items
            </Badge>
          </div>
          <CardContent className="p-3">
            <h3 className="font-medium text-sm line-clamp-1">{name}</h3>
            <p className="text-primary font-bold">${price}/day</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
