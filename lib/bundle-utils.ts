import { v4 as uuidv4 } from "uuid"

// Types
export interface Bundle {
  id: string
  name: string
  description?: string
  items: string[] // Array of item IDs
  createdBy: string
  createdAt: number
  price?: number
  discount?: number
  imageUrl?: string
}

// Get all bundles from localStorage
export const getBundles = (): Bundle[] => {
  try {
    const bundlesJson = localStorage.getItem("opencloset_bundles")
    if (bundlesJson) {
      return JSON.parse(bundlesJson)
    }
  } catch (error) {
    console.error("Error fetching bundles:", error)
  }
  return []
}

// Get a specific bundle by ID
export const getBundleById = (id: string): Bundle | null => {
  const bundles = getBundles()
  return bundles.find((bundle) => bundle.id === id) || null
}

// Get bundles created by a specific user
export const getUserBundles = (userId: string): Bundle[] => {
  const bundles = getBundles()
  return bundles.filter((bundle) => bundle.createdBy === userId)
}

// Create a new bundle
export const createBundle = (bundle: Omit<Bundle, "id" | "createdAt">): Bundle => {
  const bundles = getBundles()

  const newBundle: Bundle = {
    ...bundle,
    id: uuidv4(),
    createdAt: Date.now(),
  }

  bundles.push(newBundle)
  localStorage.setItem("opencloset_bundles", JSON.stringify(bundles))

  return newBundle
}

// Update an existing bundle
export const updateBundle = (updatedBundle: Bundle): Bundle => {
  const bundles = getBundles()
  const index = bundles.findIndex((bundle) => bundle.id === updatedBundle.id)

  if (index !== -1) {
    bundles[index] = updatedBundle
    localStorage.setItem("opencloset_bundles", JSON.stringify(bundles))
  }

  return updatedBundle
}

// Delete a bundle
export const deleteBundle = (id: string): boolean => {
  const bundles = getBundles()
  const filteredBundles = bundles.filter((bundle) => bundle.id !== id)

  if (filteredBundles.length < bundles.length) {
    localStorage.setItem("opencloset_bundles", JSON.stringify(filteredBundles))
    return true
  }

  return false
}

// Add an item to a bundle
export const addItemToBundle = (bundleId: string, itemId: string): Bundle | null => {
  const bundle = getBundleById(bundleId)

  if (bundle) {
    if (!bundle.items.includes(itemId)) {
      bundle.items.push(itemId)
      updateBundle(bundle)
    }
    return bundle
  }

  return null
}

// Remove an item from a bundle
export const removeItemFromBundle = (bundleId: string, itemId: string): Bundle | null => {
  const bundle = getBundleById(bundleId)

  if (bundle) {
    bundle.items = bundle.items.filter((id) => id !== itemId)
    updateBundle(bundle)
    return bundle
  }

  return null
}

// Calculate bundle price (sum of all items or custom price)
export const calculateBundlePrice = (bundle: Bundle, items: any[]): number => {
  if (bundle.price !== undefined) {
    return bundle.price
  }

  // Find all items in the bundle
  const bundleItems = items.filter((item) => bundle.items.includes(item.id))

  // Sum up the prices
  const totalPrice = bundleItems.reduce((sum, item) => sum + (Number.parseFloat(item.price) || 0), 0)

  // Apply discount if available
  if (bundle.discount) {
    return totalPrice * (1 - bundle.discount / 100)
  }

  return totalPrice
}
