"use client"

import type { LucideIcon } from "lucide-react"

interface AnimatedInfoCardProps {
  title: string
  description: string
  icon: LucideIcon
  color: "black" | "gray" | "dark-gray" | "blush" | "sage" | "taupe"
}

export function AnimatedInfoCard({ title, description, icon: Icon, color }: AnimatedInfoCardProps) {
  return (
    <div className={`animated-card ${color}`}>
      <div className="card-content">
        <div className="icon-container">
          <Icon className="h-6 w-6" />
        </div>
        <p className="tip font-cinzel">{title}</p>
        <p className="second-text font-alegreya">{description}</p>
      </div>
    </div>
  )
}
