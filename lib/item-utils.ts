"\"use client"

// Define the Item interface
export interface Item {
  id: string
  name: string
  description: string
  price?: number
  baseRentalPrice?: number
  images?: string[]
  media?: Array<{ type: string; url: string }>
  category: string
  condition: string
  brand?: string
  designer?: string
  size: string
  listerId?: string
  ownerId?: string
  userId?: string
  createdAt: string
  updatedAt?: string
  ownerName?: string
  ownerAvatar?: string
  allowInRenterBundles?: boolean
  aesthetic?: string
  status?: string
  rentalPrice?: number
}

// Function to save an item to localStorage
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

    // Dispatch an event to notify other components
    window.dispatchEvent(new Event("itemsUpdated"))

    return item
  } catch (error) {
    console.error("Error saving item:", error)
    return null
  }
}

// Function to get all items from localStorage
export function getItems(): Item[] {
  try {
    const itemsJSON = localStorage.getItem("stylerent_items")
    return itemsJSON ? JSON.parse(itemsJSON) : []
  } catch (error) {
    console.error("Error getting items:", error)
    return []
  }
}

// Function to get items by user ID
export function getUserItems(userId: string): Item[] {
  try {
    const items = getItems()
    return items.filter((item) => item.userId === userId || item.ownerId === userId || item.listerId === userId)
  } catch (error) {
    console.error("Error getting user items:", error)
    return []
  }
}

// Function to get user listed items
export function getUserListedItems(): Item[] {
  try {
    const storedUser = localStorage.getItem("stylerent_user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      const items = getItems()
      return items.filter(
        (item) => item.ownerId === userData.id || item.listerId === userData.id || item.userId === userData.id,
      )
    }
    return []
  } catch (error) {
    console.error("Error getting user listed items:", error)
    return []
  }
}

// Function to get test items for sample data
export function getTestItems(): Item[] {
  return [
    {
      id: "item-1",
      name: "Vintage Denim Jacket",
      description: "Classic vintage denim jacket in excellent condition",
      baseRentalPrice: 25,
      rentalPrice: 25,
      images: ["/placeholder.svg?height=300&width=300"],
      media: [
        {
          type: "image",
          url: "/placeholder.svg?height=300&width=300",
        },
      ],
      category: "Outerwear",
      condition: "Excellent",
      brand: "Levi's",
      size: "M",
      listerId: "user-1",
      ownerId: "user-1",
      userId: "user-1",
      createdAt: new Date().toISOString(),
      ownerName: "Jane Smith",
      ownerAvatar: "/placeholder.svg?height=40&width=40",
      aesthetic: "Vintage",
      status: "Available",
    },
    {
      id: "item-2",
      name: "Designer Evening Gown",
      description: "Elegant black evening gown, perfect for formal events",
      baseRentalPrice: 75,
      rentalPrice: 75,
      images: ["/placeholder.svg?height=300&width=300"],
      media: [
        {
          type: "image",
          url: "/placeholder.svg?height=300&width=300",
        },
      ],
      category: "Dresses",
      condition: "Like New",
      designer: "Vera Wang",
      size: "S",
      listerId: "user-2",
      ownerId: "user-2",
      userId: "user-2",
      createdAt: new Date().toISOString(),
      ownerName: "Emily Johnson",
      ownerAvatar: "/placeholder.svg?height=40&width=40",
      aesthetic: "Luxury",
      status: "Available",
    },
    {
      id: "item-3",
      name: "Casual Linen Shirt",
      description: "Comfortable linen shirt for summer days",
      baseRentalPrice: 15,
      rentalPrice: 15,
      images: ["/placeholder.svg?height=300&width=300"],
      media: [
        {
          type: "image",
          url: "/placeholder.svg?height=300&width=300",
        },
      ],
      category: "Tops",
      condition: "Good",
      brand: "H&M",
      size: "L",
      listerId: "user-3",
      ownerId: "user-3",
      userId: "user-3",
      createdAt: new Date().toISOString(),
      ownerName: "Michael Brown",
      ownerAvatar: "/placeholder.svg?height=40&width=40",
      aesthetic: "Casual",
      status: "Available",
    },
  ]
}

// Function to get all items (including test items if needed)
export function getAllItems(): Item[] {
  const savedItems = getItems()
  // If there are no saved items, return test items
  if (savedItems.length === 0) {
    return getTestItems()
  }
  return savedItems
}

// Function to get item by ID
export function getItemById(id: string): Item | undefined {
  const items = getItems()
  return items.find((item) => item.id === id)
}

// Function to create demo items for a user
export const createDemoItemsForUser = async () => {
  try {
    const storedUser = localStorage.getItem("stylerent_user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)

      // Check if user already has items
      const userItems = getUserItems(userData.id)
      if (userItems.length > 0) {
        return // User already has items
      }

      // Create demo items
      const demoItems = [
        {
          id: `item-${Date.now()}-1`,
          name: "Demo Item 1",
          description: "This is a demo item",
          baseRentalPrice: 25,
          rentalPrice: 25,
          images: ["/placeholder.svg?height=300&width=300"],
          category: "Tops",
          condition: "Excellent",
          brand: "Demo Brand",
          size: "M",
          listerId: userData.id,
          ownerId: userData.id,
          userId: userData.id,
          createdAt: new Date().toISOString(),
          ownerName: userData.name || "Demo User",
          ownerAvatar: userData.avatar || "/placeholder.svg?height=40&width=40",
          aesthetic: "Casual",
          status: "Available",
        },
        {
          id: `item-${Date.now()}-2`,
          name: "Demo Item 2",
          description: "This is another demo item",
          baseRentalPrice: 35,
          rentalPrice: 35,
          images: ["/placeholder.svg?height=300&width=300"],
          category: "Bottoms",
          condition: "Good",
          brand: "Demo Brand",
          size: "L",
          listerId: userData.id,
          ownerId: userData.id,
          userId: userData.id,
          createdAt: new Date().toISOString(),
          ownerName: userData.name || "Demo User",
          ownerAvatar: "/placeholder.svg?height=40&width=40",
          aesthetic: "Streetwear",
          status: "Available",
        },
      ]

      // Save items
      const existingItems = localStorage.getItem("stylerent_items")
      let items = []

      if (existingItems) {
        items = JSON.parse(existingItems)
      }

      // Add the new items
      const updatedItems = [...items, ...demoItems]

      // Save back to localStorage
      localStorage.setItem("stylerent_items", JSON.stringify(updatedItems))

      // Dispatch an event to notify other components
      window.dispatchEvent(new Event("itemsUpdated"))
    }
  } catch (error) {
    console.error("Error creating demo items:", error)
  }
}
