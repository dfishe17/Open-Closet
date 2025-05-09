"use client"

import { PulsatingButton } from "./pulsating-button"

interface TrendingItemCardProps {
  id: string
  name: string
  price: number
  image: string
}

export function TrendingItemCard({ id, name, price, image }: TrendingItemCardProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
      <div
        className="w-full h-64 bg-gray-300 bg-center bg-cover rounded-t-lg"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <div className="w-56 -mt-10 overflow-hidden bg-ivory rounded-lg shadow-lg md:w-64 border border-taupe">
        <h3 className="py-2 font-bold tracking-wide text-center text-charcoal uppercase">{name}</h3>
        <div className="flex items-center justify-between px-3 py-2 bg-blush/20">
          <span className="font-bold text-charcoal">${price}</span>
          <PulsatingButton className="text-xs py-1 px-3">RENT</PulsatingButton>
        </div>
      </div>
    </div>
  )
}
