"use client"
import { useState } from "react"
import type React from "react"

import { PulsatingButton } from "./pulsating-button"

interface ProductCardProps {
  id: string
  name: string
  description?: string
  price: number
  image: string
  onClick?: () => void
}

export function UiverseProductCard({ id, name, description, price, image, onClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="card hover-lift bg-ivory border-taupe shadow-taupe"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        {
          "--font-color": "#2F4F4F",
          "--font-color-sub": "#483C32",
          "--bg-color": "#FFFFF0",
          "--main-color": "#483C32",
          "--main-focus": "#D8A9A9",
        } as React.CSSProperties
      }
    >
      <div className="card-img">
        <div className="img-container">
          <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover rounded-md" />
        </div>
      </div>
      <div className="card-title text-charcoal">{name}</div>
      <div className="card-subtitle line-clamp-2 text-taupe">
        {description || "Premium rental item. Perfect for your next special occasion."}
      </div>
      <hr className="card-divider border-blush" />
      <div className="card-footer">
        <div className="card-price text-charcoal">
          <span className="text-blush">$</span> {price}
        </div>
        <PulsatingButton className="text-xs py-1 px-3 bg-blush hover:bg-blush/80 text-ivory" onClick={onClick}>
          RENT
        </PulsatingButton>
      </div>
    </div>
  )
}
