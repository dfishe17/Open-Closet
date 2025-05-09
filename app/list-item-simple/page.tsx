"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SimpleListItemPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create a simple item
      const newItem = {
        id: `item-${Date.now()}`,
        name,
        description,
        category: "Other",
        size: "One Size",
        condition: "Good",
        rentalPrice: 10,
        images: ["/placeholder.svg?height=300&width=300"],
        media: [{ type: "image", url: "/placeholder.svg?height=300&width=300" }],
        userId: "demo-user",
        createdAt: new Date().toISOString(),
        status: "Available",
      }

      // Store in localStorage
      const existingItems = JSON.parse(localStorage.getItem("stylerent_items") || "[]")
      localStorage.setItem("stylerent_items", JSON.stringify([...existingItems, newItem]))

      // Notify listeners
      window.dispatchEvent(new Event("itemsUpdated"))

      alert("Item successfully listed!")
      router.push("/profile")
    } catch (error) {
      console.error("Error listing item:", error)
      alert("Failed to list item. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>List an Item (Simple)</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>
            Item Name*
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
            required
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label htmlFor="description" style={{ display: "block", marginBottom: "5px" }}>
            Description*
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your item"
            required
            rows={4}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <Link
            href="/profile"
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Back to Profile
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4F46E5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Listing..." : "List Item"}
          </button>
        </div>
      </form>
    </div>
  )
}
