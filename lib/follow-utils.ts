"use client"

// Types
export interface Follow {
  id: string
  followerId: string
  followedId: string
  timestamp: number
}

// Get all follows from localStorage
export const getFollows = (): Follow[] => {
  try {
    const follows = localStorage.getItem("stylerent_following")
    return follows ? JSON.parse(follows) : []
  } catch (error) {
    console.error("Error getting follows:", error)
    return []
  }
}

// Save follows to localStorage
export const saveFollows = (follows: Follow[]): void => {
  try {
    localStorage.setItem("stylerent_following", JSON.stringify(follows))
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent("stylerent-follows-updated"))
  } catch (error) {
    console.error("Error saving follows:", error)
  }
}

// Get all users that a user is following
export const getUserFollowing = (userId: string): string[] => {
  try {
    const follows = getFollows()
    return follows.filter((f) => f.followerId === userId).map((f) => f.followedId)
  } catch (error) {
    console.error("Error getting following:", error)
    return []
  }
}

// Get all users that follow a user
export const getFollowers = (userId: string): string[] => {
  try {
    const follows = getFollows()
    return follows.filter((f) => f.followedId === userId).map((f) => f.followerId)
  } catch (error) {
    console.error("Error getting followers:", error)
    return []
  }
}

// Follow a user
export const followUser = (followedId: string): boolean => {
  try {
    const followerId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
    if (!followerId) return false

    // Don't allow following yourself
    if (followerId === followedId) return false

    const follows = getFollows()

    // Check if already following
    const alreadyFollowing = follows.some((f) => f.followerId === followerId && f.followedId === followedId)

    if (alreadyFollowing) return false

    // Add new follow
    const newFollow: Follow = {
      id: `follow_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      followerId,
      followedId,
      timestamp: Date.now(),
    }

    follows.push(newFollow)

    saveFollows(follows)

    return true
  } catch (error) {
    console.error("Error following user:", error)
    return false
  }
}

// Unfollow a user
export const unfollowUser = (followedId: string): boolean => {
  try {
    const followerId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
    if (!followerId) return false

    const follows = getFollows()

    const filteredFollows = follows.filter((f) => !(f.followerId === followerId && f.followedId === followedId))

    if (filteredFollows.length === follows.length) return false

    saveFollows(filteredFollows)

    return true
  } catch (error) {
    console.error("Error unfollowing user:", error)
    return false
  }
}

// Check if a user is following another user
export const isFollowing = (followedId: string): boolean => {
  try {
    const followerId = localStorage.getItem("stylerent_user_id") || localStorage.getItem("opencloset_user_id")
    if (!followerId) return false

    const follows = getFollows()
    return follows.some((f) => f.followerId === followerId && f.followedId === followedId)
  } catch (error) {
    console.error("Error checking follow status:", error)
    return false
  }
}
