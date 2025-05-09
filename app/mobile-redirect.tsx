"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function MobileRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Check if the user is on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    // If on mobile and not already on the mobile path, redirect
    if (isMobile && !window.location.pathname.startsWith("/mobile")) {
      router.push("/mobile")
    }
  }, [router])

  return null
}
