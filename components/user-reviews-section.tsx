"use client"

import { useState, useEffect } from "react"
import { Star, ShoppingBag, Package } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getReviewsForTarget, type Review } from "@/lib/review-service"

interface UserReviewsSectionProps {
  userId: string
  userName: string
}

export function UserReviewsSection({ userId, userName }: UserReviewsSectionProps) {
  const [sellerReviews, setSellerReviews] = useState<Review[]>([])
  const [buyerReviews, setBuyerReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("seller")

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      try {
        // Get all reviews for this user
        const allReviews = await getReviewsForTarget(userId, "user")

        // Filter reviews based on context
        // For this demo, we'll use the review comment to determine if it's a buyer or seller review
        // In a real app, you would have a specific field for this
        const sellerRevs = allReviews.filter(
          (review) =>
            review.comment.toLowerCase().includes("seller") ||
            review.comment.toLowerCase().includes("lender") ||
            review.comment.toLowerCase().includes("item") ||
            review.comment.toLowerCase().includes("quality"),
        )

        const buyerRevs = allReviews.filter(
          (review) =>
            review.comment.toLowerCase().includes("buyer") ||
            review.comment.toLowerCase().includes("renter") ||
            review.comment.toLowerCase().includes("payment") ||
            review.comment.toLowerCase().includes("returned"),
        )

        setSellerReviews(sellerRevs)
        setBuyerReviews(buyerRevs)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()

    // Listen for review updates
    const handleReviewsUpdated = () => {
      fetchReviews()
    }

    window.addEventListener("reviewsUpdated", handleReviewsUpdated)
    return () => {
      window.removeEventListener("reviewsUpdated", handleReviewsUpdated)
    }
  }, [userId])

  // Calculate average seller rating
  const averageSellerRating =
    sellerReviews.length > 0 ? sellerReviews.reduce((sum, review) => sum + review.rating, 0) / sellerReviews.length : 0

  // Calculate average buyer rating
  const averageBuyerRating =
    buyerReviews.length > 0 ? buyerReviews.reduce((sum, review) => sum + review.rating, 0) / buyerReviews.length : 0

  // Calculate overall average rating
  const allReviews = [...sellerReviews, ...buyerReviews]
  const averageRating =
    allReviews.length > 0 ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length : 0

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>
  }

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-primary/10 rounded-full p-3 mr-3">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Overall Rating</h3>
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-2">{averageRating.toFixed(1)}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(averageRating) ? "fill-primary text-primary" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {allReviews.length} {allReviews.length === 1 ? "review" : "reviews"}
        </Badge>
      </div>

      {/* Reviews Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="seller" className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span>Seller Reviews</span>
          </TabsTrigger>
          <TabsTrigger value="buyer" className="flex items-center gap-1">
            <ShoppingBag className="h-4 w-4" />
            <span>Buyer Reviews</span>
          </TabsTrigger>
        </TabsList>

        {/* Seller Reviews Tab */}
        <TabsContent value="seller" className="space-y-4 mt-4">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium mr-2">Seller Rating:</span>
            <span className="text-sm font-bold mr-1">{averageSellerRating.toFixed(1)}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(averageSellerRating) ? "fill-primary text-primary" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              ({sellerReviews.length} {sellerReviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>

          {sellerReviews.length === 0 ? (
            <div className="text-center py-6 bg-muted/30 rounded-lg">
              <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No seller reviews yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Reviews will appear here when users rate their experience with items from this seller
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sellerReviews.map((review) => (
                <Card key={review.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={review.userAvatar} alt={review.userName} />
                        <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{review.userName}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Buyer Reviews Tab */}
        <TabsContent value="buyer" className="space-y-4 mt-4">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium mr-2">Buyer Rating:</span>
            <span className="text-sm font-bold mr-1">{averageBuyerRating.toFixed(1)}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(averageBuyerRating) ? "fill-primary text-primary" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              ({buyerReviews.length} {buyerReviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>

          {buyerReviews.length === 0 ? (
            <div className="text-center py-6 bg-muted/30 rounded-lg">
              <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">No buyer reviews yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Reviews will appear here when sellers rate their experience with this buyer
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {buyerReviews.map((review) => (
                <Card key={review.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={review.userAvatar} alt={review.userName} />
                        <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{review.userName}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
