"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewForm } from "./review-form"
import { ReviewsList } from "./reviews-list"
import { hasUserReviewedTarget } from "@/lib/review-service"

interface ReviewSectionProps {
  targetId: string
  targetType: "user" | "item" | "bundle"
  targetName: string
  currentUserId: string
  currentUserName: string
  currentUserAvatar?: string
  viewOnly?: boolean
}

export function ReviewSection({
  targetId,
  targetType,
  targetName,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  viewOnly = false,
}: ReviewSectionProps) {
  const [activeTab, setActiveTab] = useState("read")
  const [hasReviewed, setHasReviewed] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const checkIfReviewed = async () => {
      const reviewed = await hasUserReviewedTarget(currentUserId, targetId, targetType)
      setHasReviewed(reviewed)
    }

    checkIfReviewed()
  }, [currentUserId, targetId, targetType, refreshTrigger])

  const handleReviewAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
    setActiveTab("read")
  }

  // Don't show the write tab if the user is viewing their own profile or has already reviewed
  const showWriteTab = !viewOnly && currentUserId !== targetId && !hasReviewed

  return (
    <div className="space-y-4">
      {showWriteTab ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="read">Read Reviews</TabsTrigger>
            <TabsTrigger value="write">Write a Review</TabsTrigger>
          </TabsList>
          <TabsContent value="read">
            <ReviewsList targetId={targetId} targetType={targetType} refreshTrigger={refreshTrigger} />
          </TabsContent>
          <TabsContent value="write">
            <Card>
              <CardHeader>
                <CardTitle className="font-cinzel">Write a Review</CardTitle>
                <CardDescription>Share your experience with {targetName}</CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewForm
                  targetId={targetId}
                  targetType={targetType}
                  targetName={targetName}
                  currentUserId={currentUserId}
                  currentUserName={currentUserName}
                  currentUserAvatar={currentUserAvatar}
                  onReviewAdded={handleReviewAdded}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <ReviewsList targetId={targetId} targetType={targetType} refreshTrigger={refreshTrigger} />
      )}
    </div>
  )
}
