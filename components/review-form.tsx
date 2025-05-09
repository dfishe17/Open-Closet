"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { addReview } from "@/lib/review-service"

interface ReviewFormProps {
  targetId: string
  targetType: "user" | "item" | "bundle"
  targetName: string
  currentUserId: string
  currentUserName: string
  currentUserAvatar?: string
  onReviewAdded?: () => void
}

export function ReviewForm({
  targetId,
  targetType,
  targetName,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onReviewAdded,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    if (!comment.trim()) {
      toast.error("Please enter a comment")
      return
    }

    setIsSubmitting(true)

    try {
      await addReview({
        id: `review-${Date.now()}`,
        targetId,
        targetType,
        userId: currentUserId,
        userName: currentUserName,
        userAvatar: currentUserAvatar || "/placeholder.svg?height=40&width=40",
        rating,
        comment,
        date: new Date().toISOString(),
      })

      toast.success("Review submitted successfully")
      setRating(0)
      setComment("")

      if (onReviewAdded) {
        onReviewAdded()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Rate {targetName}</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoverRating || rating) ? "fill-primary text-primary" : "fill-muted text-muted"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          Your Review
        </label>
        <Textarea id="comment" placeholder="" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
