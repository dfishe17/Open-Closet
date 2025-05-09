// Types
export interface Review {
  id: string
  targetId: string
  targetType: "user" | "item" | "bundle"
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  date: string
}

// Helper function to get reviews from localStorage
const getReviews = (): Review[] => {
  if (typeof window === "undefined") return []

  try {
    const storedReviews = localStorage.getItem("stylerent_reviews")
    return storedReviews ? JSON.parse(storedReviews) : []
  } catch (error) {
    console.error("Error getting reviews:", error)
    return []
  }
}

// Helper function to save reviews to localStorage
const saveReviews = (reviews: Review[]): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("stylerent_reviews", JSON.stringify(reviews))
    // Dispatch an event to notify other components
    window.dispatchEvent(new Event("reviewsUpdated"))
  } catch (error) {
    console.error("Error saving reviews:", error)
  }
}

// Add a new review
export const addReview = async (review: Review): Promise<void> => {
  const reviews = getReviews()

  // Check if the user has already reviewed this target
  const existingReview = reviews.find(
    (r) => r.userId === review.userId && r.targetId === review.targetId && r.targetType === review.targetType,
  )

  if (existingReview) {
    throw new Error("You have already reviewed this item")
  }

  // Add the new review
  reviews.push(review)
  saveReviews(reviews)
}

// Get reviews for a specific target
export const getReviewsForTarget = async (
  targetId: string,
  targetType: "user" | "item" | "bundle",
): Promise<Review[]> => {
  const reviews = getReviews()
  return reviews
    .filter((review) => review.targetId === targetId && review.targetType === targetType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Get reviews by a specific user
export const getReviewsByUser = async (userId: string): Promise<Review[]> => {
  const reviews = getReviews()
  return reviews
    .filter((review) => review.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Calculate average rating for a target
export const getAverageRating = async (targetId: string, targetType: "user" | "item" | "bundle"): Promise<number> => {
  const reviews = await getReviewsForTarget(targetId, targetType)

  if (reviews.length === 0) {
    return 0
  }

  const sum = reviews.reduce((total, review) => total + review.rating, 0)
  return Number.parseFloat((sum / reviews.length).toFixed(1))
}

// Check if a user has already reviewed a target
export const hasUserReviewedTarget = async (
  userId: string,
  targetId: string,
  targetType: "user" | "item" | "bundle",
): Promise<boolean> => {
  const reviews = getReviews()
  return reviews.some(
    (review) => review.userId === userId && review.targetId === targetId && review.targetType === targetType,
  )
}
