"use client"

export interface Item {
  id: string
  name: string
  description: string
  category: string
  size: string
  condition: string
  rentalPrice?: number
  images?: string[]
  media?: Array<{ type: string; url: string }>
  userId?: string
  createdAt: string
  status?: string
}

// Simplified function to save an item to localStorage
export function saveItem(item) {
  try {
    // Get existing items
    const existingItems = localStorage.getItem("stylerent_items")
    let items = []

    if (existingItems) {
      items = JSON.parse(existingItems)
    }

    // Add the new item
    items.push(item)

    // Save back to localStorage
    localStorage.setItem("stylerent_items", JSON.stringify(items))

    return item
  } catch (error) {
    console.error("Error saving item:", error)
    return null
  }
}

// Simplified function to get all items from localStorage
export function getItems(): Item[] {
  try {
    const itemsJSON = localStorage.getItem("stylerent_items")
    return itemsJSON ? JSON.parse(itemsJSON) : []
  } catch (error) {
    console.error("Error getting items:", error)
    return []
  }
}
