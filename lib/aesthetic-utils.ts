"use client"

// Types
export interface FollowedAesthetic {
  userId: string
  aesthetic: string
  timestamp: number
}

// Get all followed aesthetics from localStorage
export const getFollowedAesthetics = (userId: string): string[] => {
  try {
    const storedAesthetics = localStorage.getItem("stylerent_followed_aesthetics")
    if (!storedAesthetics) return []

    const allAesthetics: FollowedAesthetic[] = JSON.parse(storedAesthetics)
    return allAesthetics.filter((item) => item.userId === userId).map((item) => item.aesthetic)
  } catch (error) {
    console.error("Error getting followed aesthetics:", error)
    return []
  }
}

// Follow an aesthetic
export const followAesthetic = (userId: string, aesthetic: string): boolean => {
  try {
    const storedAesthetics = localStorage.getItem("stylerent_followed_aesthetics")
    const allAesthetics: FollowedAesthetic[] = storedAesthetics ? JSON.parse(storedAesthetics) : []

    // Check if already following
    const isAlreadyFollowing = allAesthetics.some((item) => item.userId === userId && item.aesthetic === aesthetic)

    if (isAlreadyFollowing) return false

    // Add new followed aesthetic
    allAesthetics.push({
      userId,
      aesthetic,
      timestamp: Date.now(),
    })

    localStorage.setItem("stylerent_followed_aesthetics", JSON.stringify(allAesthetics))

    // Dispatch event
    window.dispatchEvent(new CustomEvent("stylerent-aesthetics-updated"))

    return true
  } catch (error) {
    console.error("Error following aesthetic:", error)
    return false
  }
}

// Unfollow an aesthetic
export const unfollowAesthetic = (userId: string, aesthetic: string): boolean => {
  try {
    const storedAesthetics = localStorage.getItem("stylerent_followed_aesthetics")
    if (!storedAesthetics) return false

    const allAesthetics: FollowedAesthetic[] = JSON.parse(storedAesthetics)

    const filteredAesthetics = allAesthetics.filter((item) => !(item.userId === userId && item.aesthetic === aesthetic))

    if (filteredAesthetics.length === allAesthetics.length) return false

    localStorage.setItem("stylerent_followed_aesthetics", JSON.stringify(filteredAesthetics))

    // Dispatch event
    window.dispatchEvent(new CustomEvent("stylerent-aesthetics-updated"))

    return true
  } catch (error) {
    console.error("Error unfollowing aesthetic:", error)
    return false
  }
}

// Check if a user is following an aesthetic
export const isFollowingAesthetic = (userId: string, aesthetic: string): boolean => {
  try {
    const storedAesthetics = localStorage.getItem("stylerent_followed_aesthetics")
    if (!storedAesthetics) return false

    const allAesthetics: FollowedAesthetic[] = JSON.parse(storedAesthetics)

    return allAesthetics.some((item) => item.userId === userId && item.aesthetic === aesthetic)
  } catch (error) {
    console.error("Error checking if following aesthetic:", error)
    return false
  }
}

// Get all aesthetics in the system
export const getAllAesthetics = (): string[] => {
  return [
    "Minimalist",
    "Vintage",
    "Streetwear",
    "Bohemian",
    "Preppy",
    "Athleisure",
    "Cottagecore",
    "Y2K",
    "Grunge",
    "Romantic",
    "Casual",
    "Formal",
    "Business",
    "Retro",
    "Punk",
    "Goth",
    "Hipster",
    "Sporty",
    "Chic",
    "Elegant",
  ]
}

// Get popular aesthetics
export const getPopularAesthetics = (limit = 10): string[] => {
  const allAesthetics = getAllAesthetics()
  // In a real app, you would sort by popularity
  // For now, we'll just return a subset
  return allAesthetics.slice(0, limit)
}
