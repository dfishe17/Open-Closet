import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Sample data for recommended profiles
const recommendedProfiles = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=100&width=100&text=SJ",
    coverImage: "/placeholder.svg?height=300&width=450&text=Sarah's+Collection",
    bio: "Fashion enthusiast sharing my premium designer collection. All items are carefully maintained and professionally cleaned between rentals.",
    location: "New York, NY",
    rating: 5,
    reviewCount: 167,
    itemCount: 48,
    specialties: ["Designer", "Dresses", "Formal Wear"],
    featured: true,
  },
  {
    id: "michael-chen",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=100&width=100&text=MC",
    coverImage: "/placeholder.svg?height=300&width=450&text=Michael's+Collection",
    bio: "Menswear specialist with a focus on high-quality suits, designer streetwear, and accessories. Perfect for business events and special occasions.",
    location: "San Francisco, CA",
    rating: 4.9,
    reviewCount: 124,
    itemCount: 36,
    specialties: ["Menswear", "Suits", "Streetwear"],
    featured: true,
  },
  {
    id: "emma-rodriguez",
    name: "Emma Rodriguez",
    avatar: "/placeholder.svg?height=100&width=100&text=ER",
    coverImage: "/placeholder.svg?height=300&width=450&text=Emma's+Collection",
    bio: "Vintage fashion collector specializing in unique pieces from the 60s, 70s, and 80s. Each item tells a story and adds character to any outfit.",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviewCount: 98,
    itemCount: 52,
    specialties: ["Vintage", "Retro", "Bohemian"],
    featured: true,
  },
]

export function RecommendedProfilesSection() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-cinzel">Top Lenders</h2>
            <p className="text-muted-foreground font-playfair">Discover our most trusted fashion providers</p>
          </div>
          <Button variant="link" asChild className="p-0">
            <Link href="/recommended" className="flex items-center gap-2 font-playfair">
              See All Lenders
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedProfiles.map((profile) => (
            <Link href={`/profile/${profile.id}`} key={profile.id}>
              <Card className="overflow-hidden h-full border-none shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-video bg-muted">
                  <img
                    src={profile.coverImage || "/placeholder.svg"}
                    alt={`${profile.name}'s collection`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="border-2 border-white h-10 w-10">
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                        <AvatarFallback className="font-cinzel">{profile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-cinzel text-white">{profile.name}</h3>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(profile.rating) ? "fill-primary text-primary" : "text-white/50"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs ml-1 text-white/80 font-alegreya">({profile.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="font-alegreya">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3 font-alegreya">{profile.bio}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-playfair">{profile.location}</span>
                    <span className="text-sm font-playfair">{profile.itemCount} items</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button asChild size="lg" className="gap-2">
            <Link href="/recommended" className="font-playfair">
              See All Lenders
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
