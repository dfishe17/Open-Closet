"use client"

import Link from "next/link"

interface AnimatedCardProps {
  id: string
  title: string
  description: string
  price: number
  image: string
  color?: "red" | "blue" | "green" | "purple" | "orange"
}

export function AnimatedCard({ id, title, description, price, image, color = "blue" }: AnimatedCardProps) {
  return (
    <Link href={`/items/${id}`} className="no-underline">
      <div className={`animated-card ${color}`} style={{ backgroundImage: `url(${image})` }}>
        <div className="content">
          <p className="title">{title}</p>
          <p className="description">{description}</p>
          <p className="price">${price}</p>
        </div>
      </div>
    </Link>
  )
}
