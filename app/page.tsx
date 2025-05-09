"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { getCurrentUser } from "@/lib/user-utils"
import UpdatedHomeClient from "./updated-home-client"
import { SharedFilterBar } from "@/components/shared-filter-bar"
import { MobileRedirect } from "./mobile-redirect"

export default function Home() {
  const searchParams = useSearchParams()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [followedAesthetics, setFollowedAesthetics] = useState<string[]>([])

  // Get filter values from URL
  const feedType = searchParams.get("feedType") || "trending"
  const aestheticFilter = searchParams.get("aesthetic")
  const categoryFilter = searchParams.get("category")
  const sizeFilter = searchParams.get("size")
  const brandFilter = searchParams.get("brand")
  const conditionFilter = searchParams.get("condition")
  const colorFilter = searchParams.get("color")
  const priceFilter = searchParams.get("price")
  const materialFilter = searchParams.get("material")
  const sortOption = searchParams.get("sort") || "newest"

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)

    // Load followed aesthetics from localStorage
    try {
      const storedAesthetics = localStorage.getItem("stylerent_followed_aesthetics")
      if (storedAesthetics) {
        setFollowedAesthetics(JSON.parse(storedAesthetics))
      }
    } catch (error) {
      console.error("Error loading followed aesthetics:", error)
    }

    // Listen for aesthetic follow updates
    const handleAestheticUpdate = () => {
      try {
        const storedAesthetics = localStorage.getItem("stylerent_followed_aesthetics")
        if (storedAesthetics) {
          setFollowedAesthetics(JSON.parse(storedAesthetics))
        }
      } catch (error) {
        console.error("Error updating followed aesthetics:", error)
      }
    }

    window.addEventListener("stylerent-aesthetics-updated", handleAestheticUpdate)

    return () => {
      window.removeEventListener("stylerent-aesthetics-updated", handleAestheticUpdate)
    }
  }, [])

  const followAesthetic = (aesthetic: string) => {
    if (!currentUser) return

    try {
      let updatedAesthetics = [...followedAesthetics]

      if (followedAesthetics.includes(aesthetic)) {
        // Unfollow
        updatedAesthetics = updatedAesthetics.filter((a) => a !== aesthetic)
      } else {
        // Follow
        updatedAesthetics.push(aesthetic)
      }

      setFollowedAesthetics(updatedAesthetics)
      localStorage.setItem("stylerent_followed_aesthetics", JSON.stringify(updatedAesthetics))

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent("stylerent-aesthetics-updated"))
    } catch (error) {
      console.error("Error following/unfollowing aesthetic:", error)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Mobile redirect component */}
      <MobileRedirect />

      {/* Shared Filter Bar Component */}
      <SharedFilterBar />

      {/* Use the original UpdatedHomeClient component for the rest of the UI */}
      <div className="filter-applied-content">
        <UpdatedHomeClient
          feedType={feedType}
          aestheticFilter={aestheticFilter}
          categoryFilter={categoryFilter}
          sizeFilter={sizeFilter}
          brandFilter={brandFilter}
          conditionFilter={conditionFilter}
          colorFilter={colorFilter}
          priceFilter={priceFilter}
          materialFilter={materialFilter}
          sortOption={sortOption}
          followedAesthetics={followedAesthetics}
          onFollowAesthetic={followAesthetic}
        />
      </div>
    </main>
  )
}
