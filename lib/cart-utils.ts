"\"use client"

import type { Item } from "./item-utils"
import { toast } from "@/components/ui/use-toast"

export interface CartItem {
  id: string
  itemId: string
  name: string
  image: string
  price: number
  basePrice?: number
  size?: string
  rentalDays: number
  addedAt: string
  insuranceFee?: number // Added insurance fee field
  insurance?: any // Existing insurance object
}

// Get cart from localStorage
export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return []

  try {
    const cartJson = localStorage.getItem("stylerent_cart")
    if (cartJson) {
      return JSON.parse(cartJson)
    }
  } catch (error) {
    console.error("Error fetching cart:", error)
    return []
  }
}

// Save cart to localStorage
export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("stylerent_cart", JSON.stringify(cart))

    // Dispatch event to notify components about the cart update
    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { cartCount: cart.length },
      }),
    )
  } catch (error) {
    console.error("Error saving cart:", error)
  }
}

// Create a new cart
export const createNewCart = (): void => {
  saveCart([])
  toast({
    title: "New cart created",
    description: "Your cart has been reset.",
  })
}

// Calculate daily rate based on rental duration
export const calculateDailyRate = (basePrice: number, days: number): number => {
  if (days <= 3) {
    return basePrice * 0.05 // 5% of base price for days 1-3
  } else if (days <= 7) {
    return basePrice * 0.04 // 4% of base price for days 4-7
  } else if (days <= 14) {
    return basePrice * 0.03 // 3% of base price for days 8-14
  } else {
    return basePrice * 0.02 // 2% of base price for days 15+
  }
}

// Calculate insurance fee (25% of rental price)
export const calculateInsuranceFee = (rentalPrice: number, days: number): number => {
  return rentalPrice * days * 0.25 // 25% of rental price
}

// Add item to cart
export const addToCart = (item: Item, rentalDays: number): void => {
  const cart = getCart()

  // Calculate the daily rate based on rental duration
  const basePrice = item.basePrice || item.price || 0
  const dailyRate = calculateDailyRate(basePrice, rentalDays)

  // Calculate insurance fee (25% of rental price)
  const insuranceFee = calculateInsuranceFee(dailyRate, rentalDays)

  // Create cart item
  const cartItem: CartItem = {
    id: `cart-item-${Date.now()}`,
    itemId: item.id,
    name: item.name,
    image: item.media?.[0]?.url || item.images?.[0] || "/placeholder.svg",
    price: dailyRate,
    basePrice: basePrice,
    size: item.size,
    rentalDays,
    addedAt: new Date().toISOString(),
    insuranceFee: insuranceFee, // Add insurance fee
  }

  // Add to cart
  cart.push(cartItem)

  // Save cart
  saveCart(cart)

  // Show toast notification
  toast({
    title: "Added to cart",
    description: `${item.name} has been added to your cart.`,
  })
}

// Remove item from cart
export const removeFromCart = (cartItemId: string): void => {
  const cart = getCart()
  const updatedCart = cart.filter((item) => item.id !== cartItemId)
  saveCart(updatedCart)

  // Show toast notification
  toast({
    title: "Removed from cart",
    description: "Item has been removed from your cart.",
  })
}

// Clear cart
export const clearCart = (): void => {
  saveCart([])
}

// Get cart count
export const getCartCount = (): number => {
  return getCart().length
}

// Calculate cart subtotal
export const getCartSubtotal = (): number => {
  const cart = getCart()
  return cart.reduce((total, item) => {
    const price = Number.parseFloat(String(item.price)) || 0
    const days = Number.parseInt(String(item.rentalDays)) || 1
    return total + price * days
  }, 0)
}

// Calculate cart insurance total
export const getCartInsuranceTotal = (): number => {
  const cart = getCart()
  return cart.reduce((total, item) => {
    return total + (item.insuranceFee || 0)
  }, 0)
}

// Calculate cart total
export const getCartTotal = (): number => {
  const cartItems = getCart()
  const subtotal = cartItems.reduce((total, item) => {
    const price = Number.parseFloat(String(item.price)) || 0
    const days = Number.parseInt(String(item.rentalDays)) || 1
    return total + price * days
  }, 0)

  const insuranceFee = calculateInsuranceFeeForTotal(subtotal)

  // The total is the subtotal plus the insurance fee
  return subtotal + insuranceFee
}

// Add a function to calculate the insurance fee:

export function calculateInsuranceFeeForTotal(subtotal: number): number {
  return subtotal * 0.25 // 25% insurance fee
}

// Add a new function to get just the insurance amount:

export function getCartInsuranceAmount(): number {
  const cartItems = getCart()
  const subtotal = cartItems.reduce((total, item) => {
    const price = Number.parseFloat(String(item.price)) || 0
    const days = Number.parseInt(String(item.rentalDays)) || 1
    return total + price * days
  }, 0)

  return calculateInsuranceFeeForTotal(subtotal)
}

// Calculate cart totals with breakdown
export const calculateCartTotal = (cart: CartItem[]) => {
  // Ensure we have valid cart items
  if (!Array.isArray(cart) || cart.length === 0) {
    return { subtotal: 0, tax: 0, insuranceTotal: 0, total: 0 }
  }

  // Calculate subtotal with validation
  const subtotal = cart.reduce((sum, item) => {
    const price = Number.parseFloat(String(item.price)) || 0
    const days = Number.parseInt(String(item.rentalDays)) || 1
    return sum + price * days
  }, 0)

  // Calculate insurance total
  const insuranceTotal = cart.reduce((sum, item) => {
    return sum + (item.insuranceFee || 0)
  }, 0)

  // Calculate tax (8%)
  const tax = subtotal * 0.08

  // Calculate total
  const total = subtotal + tax + insuranceTotal

  // Return rounded values to 2 decimal places
  return {
    subtotal: Number.parseFloat(subtotal.toFixed(2)),
    tax: Number.parseFloat(tax.toFixed(2)),
    insuranceTotal: Number.parseFloat(insuranceTotal.toFixed(2)),
    total: Number.parseFloat(total.toFixed(2)),
  }
}

// Get the rate description based on rental days
export const getRateDescription = (days: number): string => {
  if (days <= 3) {
    return "5% of base price per day (1-3 days)"
  } else if (days <= 7) {
    return "4% of base price per day (4-7 days)"
  } else if (days <= 14) {
    return "3% of base price per day (8-14 days)"
  } else {
    return "2% of base price per day (15+ days)"
  }
}

export const getCartItems = getCart
