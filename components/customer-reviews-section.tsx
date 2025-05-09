import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample data for testimonials
const testimonials = [
  {
    name: "Sarah J.",
    location: "New York, NY",
    rating: 5,
    text: "StyleRent has completely changed how I dress for special events. The quality of the clothes is amazing and the process is so simple!",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Michael T.",
    location: "Los Angeles, CA",
    rating: 5,
    text: "I needed a suit for a wedding and didn't want to buy one. StyleRent delivered a perfect fit and saved me hundreds of dollars.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Emma R.",
    location: "Chicago, IL",
    rating: 4,
    text: "Love the concept and the execution. The only reason I'm not giving 5 stars is because I wish they had even more selection!",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export function CustomerReviewsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-playfair text-center mb-12">What Our Customers Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="font-cinzel">{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-playfair font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground font-alegreya">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground font-alegreya">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
