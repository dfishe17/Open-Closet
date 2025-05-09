import Link from "next/link"
import { Button } from "@/components/ui/button"

interface MobileHeroProps {
  imageUrl?: string
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
}

export function MobileHero({
  imageUrl = "/placeholder.svg?height=600&width=800&text=Luxury+Clothing+Rental",
  title = "OpenCloset",
  subtitle = "Rent designer clothes for any occasion",
  buttonText = "Browse Collection",
  buttonLink = "/mobile/browse",
}: MobileHeroProps) {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-md mb-6">
      <div className="aspect-[4/3] bg-muted">
        <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent/30 flex flex-col justify-end p-5">
        <h1 className="text-3xl font-bold text-white font-cinzel mb-2 drop-shadow-md">{title}</h1>
        <p className="text-sm text-white/95 mb-4 max-w-[90%] drop-shadow-sm">{subtitle}</p>
        <Button size="sm" asChild className="w-fit bg-sage hover:bg-sage/90">
          <Link href={buttonLink}>{buttonText}</Link>
        </Button>
      </div>
    </div>
  )
}
