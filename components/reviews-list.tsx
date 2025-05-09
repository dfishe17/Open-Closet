"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { getReviewsForTarget } from "@/lib/review-service"

interface ReviewsListProps {
  targetId: string
  targetType: "user" | "bundle" | "item"
  refreshTrigger?: number
}

export function ReviewsList({ targetId, targetType, refreshTrigger = 0 }: ReviewsListProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        const fetchedReviews = await getReviewsForTarget(targetId, targetType)
        setReviews(fetchedReviews)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [targetId, targetType, refreshTrigger])

  // Don't render reviews for individual items
  if (targetType === "item") {
    return null
  }

  if (loading) {
    return <p className="text-center py-4 text-muted-foreground">Loading reviews...</p>
  }

  if (reviews.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">No reviews yet.</p>
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="transition-all hover:shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={review.userAvatar} alt={review.userName} />
                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center">
                  <p className="font-medium">{review.userName}</p>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-muted-foreground">{review.comment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
