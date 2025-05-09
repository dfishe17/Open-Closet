"\"use client"

// Types
export interface User {
  id: string
  name: string
  email: string
  userType: "renter" | "lender" | "admin"
  avatar?: string
  createdAt: string
  memberSince: string
  bio?: string
  location?: string
  // Lender specific fields
  totalItems?: number
  activeItems?: number
  totalRentals?: number
  totalEarnings?: number
  thisMonthEarnings?: number
  rating?: number
  reviewCount?: number
  // Renter specific fields
  totalRentals?: number
  savedAmount?: number
  creditBalance?: number
  wishlist?: string[]
  sizes?: string[]
  preferredStyles?: string[]
  favoriteDesigners?: string[]
  notifications?: boolean
  marketing?: boolean
  profileVisible?: boolean
  locationSharing?: boolean
  shop?: {
    name: string
    description: string
    policies: string
  }
  discounts?: {
    timeEnabled: boolean
    timePercentage: number
    timeDays: number
  }
}

// Type definition for user profile
export interface UserProfile {
  id: string
  name: string
  email: string
  isAdmin?: boolean
}

// Get all users from localStorage
export const getUsers = (): User[] => {
  try {
    const usersJson = localStorage.getItem("stylerent_users")
    if (usersJson) {
      return JSON.parse(usersJson)
    }
  } catch (error) {
    console.error("Error fetching users:", error)
  }
  return []
}

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  try {
    const userJson = localStorage.getItem("stylerent_user")
    if (userJson) {
      return JSON.parse(userJson)
    }
  } catch (error) {
    console.error("Error fetching current user:", error)
  }
  return null
}

// Get user by ID
export const getUserById = (id: string): User | null => {
  // First check if it's the current user
  const currentUser = getCurrentUser()
  if (currentUser && currentUser.id === id) {
    return currentUser
  }

  // Otherwise check all users
  const users = getUsers()
  return users.find((user) => user.id === id) || null
}

// Save user to localStorage
export const saveUser = (user: User): User => {
  try {
    // Get existing users
    const users = getUsers()

    // Find if user already exists
    const existingIndex = users.findIndex((u) => u.id === user.id)

    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }

    // Save back to localStorage
    localStorage.setItem("stylerent_users", JSON.stringify(users))

    // If this is the current user, update that too
    const currentUser = getCurrentUser()
    if (currentUser && currentUser.id === user.id) {
      localStorage.setItem("stylerent_user", JSON.stringify(user))
    }

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("stylerent-users-updated", {
        detail: { user },
      }),
    )

    return user
  } catch (error) {
    console.error("Error saving user:", error)
    return user
  }
}

// Update current user
export const updateCurrentUser = (userData: Partial<User>): User | null => {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) return null

    const updatedUser = { ...currentUser, ...userData }

    // Save to localStorage
    localStorage.setItem("stylerent_user", JSON.stringify(updatedUser))

    // Also update in users list
    saveUser(updatedUser)

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("stylerent-user-updated", {
        detail: { user: updatedUser },
      }),
    )

    return updatedUser
  } catch (error) {
    console.error("Error updating current user:", error)
    return null
  }
}

// Initialize user data storage
export const initializeUserStorage = () => {
  try {
    // Check if users array exists
    if (!localStorage.getItem("stylerent_users")) {
      localStorage.setItem("stylerent_users", JSON.stringify([]))
    }

    // Check if current user exists and add to users array if needed
    const currentUser = getCurrentUser()
    if (currentUser) {
      saveUser(currentUser)
    }
  } catch (error) {
    console.error("Error initializing user storage:", error)
  }
}

// Get user profile from localStorage
export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null

  const profileJson = localStorage.getItem("stylerent_user")
  if (!profileJson) return null

  try {
    const user = JSON.parse(profileJson) as User
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.userType === "admin",
    }
  } catch (error) {
    console.error("Error parsing user profile:", error)
    return null
  }
}

// Save user profile to localStorage
export function saveUserProfile(profile: UserProfile | null): void {
  if (typeof window === "undefined") return

  if (profile === null) {
    localStorage.removeItem("stylerent_user")
  } else {
    localStorage.setItem("stylerent_user", JSON.stringify(profile))
  }
}

// Check if user is logged in
export function isUserLoggedIn(): boolean {
  return !!getUserProfile()
}

// Check if user is an admin
export function isAdmin(): boolean {
  const profile = getUserProfile()
  return !!profile?.isAdmin
}

export const updateUserProfile = (updatedProfile: any) => {
  try {
    localStorage.setItem("stylerent_user", JSON.stringify(updatedProfile))
    return updatedProfile
  } catch (error) {
    console.error("Error updating user profile:", error)
    return null
  }
}
