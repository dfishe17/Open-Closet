"use client"

import { Calendar, ShoppingBag, Truck } from "lucide-react"
import { AnimatedInfoCard } from "@/components/animated-info-card"

export function HowItWorksSection() {
  return (
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
  )
}
