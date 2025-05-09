"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function SellerProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const storedUser = localStorage.getItem("stylerent_user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUserData(parsedUser)
    }
  }, [])

  if (!isClient || !userData) {
    return (
      <div className="container py-10">
        <p className="text-center">Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Seller Profile</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Test Navigation</h2>
          <div className="flex flex-col space-y-2">
            <a href="/list-item-simple" className="text-blue-500 underline">
              Go to List Item Simple (a tag)
            </a>

            <a href="/add-item" className="text-blue-500 underline">
              Go to Add Item (a tag)
            </a>

            <a href="/list-item-form" className="text-blue-500 underline">
              Go to List Item Form (a tag)
            </a>

            <Button onClick={() => (window.location.href = "/list-item-simple")}>
              Go to List Item Simple (window.location)
            </Button>

            <Button onClick={() => (window.location.href = "/add-item")}>Go to Add Item (window.location)</Button>

            <Button onClick={() => (window.location.href = "/list-item-form")}>
              Go to List Item Form (window.location)
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
