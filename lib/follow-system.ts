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

// Follow a user
export const followUser = (followerId: string, followedId: string): boolean => {
  try {
    // Don't allow following yourself
    if (followerId === followedId) return false

    const follows = getFollows()

    // Check if already following
    const alreadyFollowing = follows.some((f) => f.followerId === followerId && f.followedId === followedId)

    if (alreadyFollowing) return false

    // Add new follow
    const newFollow: Follow = {
      id: `follow_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      followerId,
      followedId,
      timestamp: Date.now(),
    }

    follows.push(newFollow)

    saveFollows(follows)

    // Dispatch specific event with details
    window.dispatchEvent(
      new CustomEvent("stylerent-follow-added", {
        detail: { follow: newFollow },
      }),
    )

    return true
  } catch (error) {
    console.error("Error following user:", error)
    return false
  }
}

// Unfollow a user
export const unfollowUser = (followerId: string, followedId: string): boolean => {
  try {
    const follows = getFollows()

    const filteredFollows = follows.filter((f) => !(f.followerId === followerId && f.followedId === followedId))

    if (filteredFollows.length === follows.length) return false

    saveFollows(filteredFollows)

    // Dispatch specific event with details
    window.dispatchEvent(
      new CustomEvent("stylerent-follow-removed", {
        detail: { followerId, followedId },
      }),
    )

    return true
  } catch (error) {
    console.error("Error unfollowing user:", error)
    return false
  }
}

// Check if a user is following another user
export const isFollowing = (followerId: string, followedId: string): boolean => {
  try {
    const follows = getFollows()
    return follows.some((f) => f.followerId === followerId && f.followedId === followedId)
  } catch (error) {
    console.error("Error checking follow status:", error)
    return false
  }
}

// Get all users that a user is following
export const getFollowing = (userId: string): string[] => {
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

// Get full follow objects for a user's following
export const getUserFollowing = (userId: string): Follow[] => {
  try {
    const follows = getFollows()
    return follows.filter((f) => f.followerId === userId)
  } catch (error) {
    console.error("Error getting user following:", error)
    return []
  }
}

// Get full follow objects for a user's followers
export const getUserFollowers = (userId: string): Follow[] => {
  try {
    const follows = getFollows()
    return follows.filter((f) => f.followedId === userId)
  } catch (error) {
    console.error("Error getting user followers:", error)
    return []
  }
}
