"use client"

import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface EnhancedInfoCardProps {
  title: string
  description: string
  icon: LucideIcon
  color: "primary" | "secondary" | "accent"
}

export function EnhancedInfoCard({ title, description, icon: Icon, color }: EnhancedInfoCardProps) {
  const getGradient = () => {
    switch (color) {
      case "primary":
        return "from-primary/20 to-primary/10"
      case "secondary":
        return "from-secondary/20 to-secondary/10"
      case "accent":
        return "from-muted/30 to-muted/20"
      default:
        return "from-primary/20 to-primary/10"
    }
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg bg-gradient-to-br ${getGradient()}`}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4 shadow-sm">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2 font-cinzel">{title}</h3>
        <p className="text-muted-foreground font-alegreya">{description}</p>
      </CardContent>
    </Card>
  )
}
