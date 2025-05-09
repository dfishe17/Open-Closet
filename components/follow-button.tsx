"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserCheck, Loader2 } from "lucide-react"
import { followUser, unfollowUser, isFollowing } from "@/lib/follow-utils"
import { toast } from "sonner"

interface FollowButtonProps {
  userId: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "secondary" | "outline" | "ghost"
}

export function FollowButton({ userId, size = "default", variant = "outline" }: FollowButtonProps) {
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if the current user is following this user
    const checkFollowStatus = () => {
      try {
        const status = isFollowing(userId)
        setFollowing(status)
      } catch (error) {
        console.error("Error checking follow status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkFollowStatus()

    // Listen for follow/unfollow events
    const handleFollowsUpdated = () => {
      setFollowing(isFollowing(userId))
    }

    window.addEventListener("stylerent-follows-updated", handleFollowsUpdated)

    return () => {
      window.removeEventListener("stylerent-follows-updated", handleFollowsUpdated)
    }
  }, [userId])

  const handleToggleFollow = async () => {
    try {
      setLoading(true)
      if (following) {
        const success = unfollowUser(userId)
        if (success) {
          toast.success("Unfollowed successfully")
          setFollowing(false)
        }
      } else {
        const success = followUser(userId)
        if (success) {
          toast.success("Following successfully")
          setFollowing(true)
        }
      }
    } catch (error) {
      console.error("Error toggling follow status:", error)
      toast.error("Failed to update follow status")
    } finally {
      setLoading(false)
    }
  }

  if (!isClient) return null

  return (
    <Button
      variant={variant}
      size={size}
      disabled={loading}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleToggleFollow()
      }}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : following ? (
        <>
          <UserCheck className={size === "icon" ? "h-4 w-4" : "h-4 w-4 mr-2"} />
          {size !== "icon" && (size === "sm" ? "Following" : "Following")}
        </>
      ) : (
        <>
          <UserPlus className={size === "icon" ? "h-4 w-4" : "h-4 w-4 mr-2"} />
          {size !== "icon" && (size === "sm" ? "Follow" : "Follow")}
        </>
      )}
    </Button>
  )
}
