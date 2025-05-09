import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Bundle {
  id: string
  name: string
  description: string
  items: {
    id: string
    name: string
    designer?: string
    media?: { url: string }[]
    rentalPrice?: number
  }[]
  aesthetic?: string
  size?: string
}

export function CuratedBundlesSection() {
  // Sample data - in a real app, this would come from an API or props
  const bundles: Bundle[] = [
    {
      id: "formal-occasion",
      name: "Formal Occasion Bundle",
      description: "Perfect for weddings, galas, and formal events",
      aesthetic: "Formal",
      size: "M",
      items: [
        {
          id: "item1",
          name: "Designer Evening Gown",
          designer: "Vera Wang",
          rentalPrice: 85,
          media: [{ url: "/placeholder.svg?height=300&width=200&text=Evening+Gown" }],
        },
        {
          id: "item2",
          name: "Crystal Clutch",
          designer: "Jimmy Choo",
          rentalPrice: 25,
          media: [{ url: "/placeholder.svg?height=300&width=200&text=Clutch" }],
        },
        {
          id: "item3",
          name: "Diamond Earrings",
          designer: "Tiffany & Co",
          rentalPrice: 40,
          media: [{ url: "/placeholder.svg?height=300&width=200&text=Earrings" }],
        },
      ],
    },
    {
      id: "business-casual",
      name: "Business Casual Bundle",
      description: "Professional attire for the modern workplace",
      aesthetic: "Professional",
      size: "S",
      items: [
        {
          id: "item4",
          name: "Tailored Blazer",
          designer: "Theory",
          rentalPrice: 45,
          media: [{ url: "/placeholder.svg?height=300&width=200&text=Blazer" }],
        },
        {
          id: "item5",
          name: "Silk Blouse",
          designer: "Equipment",
          rentalPrice: 30,
          media: [{ url: "/placeholder.svg?height=300&width=200&text=Blouse" }],
        },
        {
          id: "item6",
          name: "Wool Trousers",
          designer: "Max Mara",
          rentalPrice: 35,
          media: [{ url: "/placeholder.svg?height=300&width=200&text=Trousers" }],
        },
      ],
    },
    {
      id: "weekend-getaway",
      name: "Weekend Getaway Bundle",
      description: "Casual chic outfits for a stylish weekend trip",
      aesthetic: "Casual",
      size: "L",
      items: [
        {
          id: "item7",
          name: "Linen Dress",
          designer: "Reformation",
          rentalPrice: 40,
          media: [{ url: "/placeholder.svg?height=300&width=200&text=Dress" }],
        },
        {
          id: "item8",
          name: "Straw Hat",
          designer: "Lack of Color",
          rentalPrice: 15,
          media: [{ url: "/placeholder.svg?height=300&width=200&text=Hat" }],
        },
        {
          id: "item9",
          name: "Leather Sandals",
          designer: "Ancient Greek Sandals",
          rentalPrice: 25,
          media: [{ url: "/placeholder.svg?height=300&width=200&text=Sandals" }],
        },
      ],
    },
  ]

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl mb-8 font-cinzel text-center">Curated Style Bundles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <Card key={bundle.id} className="overflow-hidden hover-lift">
              <div className="relative aspect-[4/3] bg-muted">
                <div className="grid grid-cols-3 h-full">
                  {bundle.items.slice(0, 3).map((item, index) => (
                    <div key={item.id} className="relative overflow-hidden">
                      <img
                        src={item.media?.[0]?.url || "/placeholder.svg?height=150&width=100"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-cinzel text-white">{bundle.name}</h3>
                  <p className="text-white/80 text-sm font-alegreya mt-1">{bundle.description}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {bundle.aesthetic && <Badge variant="secondary">{bundle.aesthetic}</Badge>}
                  {bundle.size && <Badge variant="outline">Size {bundle.size}</Badge>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-alegreya">
                    <span className="text-muted-foreground">{bundle.items.length} items</span>
                  </div>
                  <div className="font-playfair">
                    <span className="font-medium">
                      ${bundle.items.reduce((sum, item) => sum + (item.rentalPrice || 0), 0)}/day
                    </span>
                  </div>
                </div>
                <Button asChild className="w-full mt-4 font-cinzel">
                  <Link href={`/bundles/${bundle.id}`}>View Bundle</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" asChild className="font-playfair">
            <Link href="/bundles" className="inline-flex items-center">
              See All Bundles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
