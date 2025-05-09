"use client"
import { PulsatingButton } from "./pulsating-button"

interface TrendingProductCardProps {
  id: string
  name: string
  description?: string
  price: number
  image: string
}

export function TrendingProductCard({ id, name, description, price, image }: TrendingProductCardProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <div
        className="w-full h-64 bg-gray-300 bg-center bg-cover rounded-t-lg"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <div className="w-56 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-64">
        <h3 className="py-2 font-bold tracking-wide text-center text-gray-800 uppercase">{name}</h3>
        <div className="flex items-center justify-between px-3 py-2 bg-gray-200">
          <span className="font-bold text-gray-800">${price}</span>
          <div className="z-10">
            <PulsatingButton className="text-xs py-1 px-3">RENT</PulsatingButton>
          </div>
        </div>
      </div>
    </div>
  )
}
