import type { Order, Transaction } from "./models/order"
import type { Item } from "./models/item"
import type { ItemFormData } from "../components/item-form"
import { generateId } from "./utils"

// Initialize orders in localStorage
export const initOrdersStorage = () => {
  if (typeof window === "undefined") return

  if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify([]))
  }

  if (!localStorage.getItem("transactions")) {
    localStorage.setItem("transactions", JSON.stringify([]))
  }
}

// Get all orders
export const getOrders = (): Order[] => {
  if (typeof window === "undefined") return []

  const orders = localStorage.getItem("orders")
  return orders ? JSON.parse(orders) : []
}

// Get orders by user ID
export const getOrdersByUserId = (userId: string): Order[] => {
  const orders = getOrders()
  return orders.filter((order) => order.userId === userId)
}

// Get orders where user is the lister
export const getOrdersAsLister = (userId: string): Order[] => {
  const orders = getOrders()
  return orders.filter((order) => order.items.some((item) => item.listerId === userId))
}

// Get order by ID
export const getOrderById = (orderId: string): Order | null => {
  const orders = getOrders()
  return orders.find((order) => order.id === orderId) || null
}

// Save order
export const saveOrder = (order: Order): void => {
  if (typeof window === "undefined") return

  const orders = getOrders()
  const existingOrderIndex = orders.findIndex((o) => o.id === order.id)

  if (existingOrderIndex >= 0) {
    orders[existingOrderIndex] = order
  } else {
    orders.push(order)
  }

  localStorage.setItem("orders", JSON.stringify(orders))

  // Dispatch a custom event to notify listeners
  window.dispatchEvent(new CustomEvent("ordersUpdated"))
}

// Delete order
export const deleteOrder = (orderId: string): void => {
  if (typeof window === "undefined") return

  const orders = getOrders()
  const filteredOrders = orders.filter((order) => order.id !== orderId)

  localStorage.setItem("orders", JSON.stringify(filteredOrders))

  // Dispatch a custom event to notify listeners
  window.dispatchEvent(new CustomEvent("ordersUpdated"))
}

// Get all transactions
export const getTransactions = (): Transaction[] => {
  if (typeof window === "undefined") return []

  const transactions = localStorage.getItem("transactions")
  return transactions ? JSON.parse(transactions) : []
}

// Get transaction by ID
export const getTransactionById = (transactionId: string): Transaction | null => {
  const transactions = getTransactions()
  return transactions.find((t) => t.id === transactionId) || null
}

// Save transaction
export const saveTransaction = (transaction: Transaction): void => {
  if (typeof window === "undefined") return

  const transactions = getTransactions()
  const existingTransactionIndex = transactions.findIndex((t) => t.id === transaction.id)

  if (existingTransactionIndex >= 0) {
    transactions[existingTransactionIndex] = transaction
  } else {
    transactions.push(transaction)
  }

  localStorage.setItem("transactions", JSON.stringify(transactions))

  // Dispatch a custom event to notify listeners
  window.dispatchEvent(new CustomEvent("transactionsUpdated"))
}

// Cart functions
export function getCart() {
  if (typeof window === "undefined") {
    return { items: [] }
  }

  const cart = localStorage.getItem("cart")
  return cart ? JSON.parse(cart) : { items: [] }
}

export function addToCart(item: any) {
  const cart = getCart()

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex((i: any) => i.id === item.id)

  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cart.items[existingItemIndex].quantity += item.quantity
  } else {
    // Add new item
    cart.items.push(item)
  }

  localStorage.setItem("cart", JSON.stringify(cart))
}

export function updateCartItem(id: string, updates: any) {
  const cart = getCart()

  const itemIndex = cart.items.findIndex((i: any) => i.id === id)

  if (itemIndex >= 0) {
    cart.items[itemIndex] = { ...cart.items[itemIndex], ...updates }
    localStorage.setItem("cart", JSON.stringify(cart))
  }
}

export function removeFromCart(id: string) {
  const cart = getCart()

  cart.items = cart.items.filter((i: any) => i.id !== id)

  localStorage.setItem("cart", JSON.stringify(cart))
}

export function clearCart() {
  localStorage.setItem("cart", JSON.stringify({ items: [] }))
}

// Order functions
export function updateOrder(id: string, updates: Partial<Order>) {
  const orders = getOrders()

  const orderIndex = orders.findIndex((order: Order) => order.id === id)

  if (orderIndex >= 0) {
    orders[orderIndex] = { ...orders[orderIndex], ...updates, updatedAt: new Date().toISOString() }
    localStorage.setItem("orders", JSON.stringify(orders))
  }
}

// Add this function to get orders with additional details
export const getOrdersWithDetails = (userId: string): Order[] => {
  const orders = getOrdersByUserId(userId)

  // Enhance orders with additional details
  return orders.map((order) => {
    // Add item details if not already present
    const enhancedItems = order.items.map((item) => {
      if (!item.image || !item.listerName) {
        // Try to get item details from items storage
        const allItems = localStorage.getItem("stylerent_items")
        if (allItems) {
          const items = JSON.parse(allItems)
          const fullItem = items.find((i: any) => i.id === item.id)

          if (fullItem) {
            // Get lister details
            const users = JSON.parse(localStorage.getItem("stylerent_users") || "[]")
            const lister = users.find((u: any) => u.id === fullItem.listerId)

            return {
              ...item,
              image: item.image || (fullItem.media && fullItem.media[0] ? fullItem.media[0].url : null),
              listerId: fullItem.listerId,
              listerName: lister ? lister.name : "Unknown Seller",
              listerAvatar: lister ? lister.avatar : null,
              reviewCount: lister ? lister.reviewCount || 0 : 0,
            }
          }
        }
      }
      return item
    })

    return {
      ...order,
      items: enhancedItems,
    }
  })
}

// Add this function to update user rental stats
export const updateUserRentalStats = (userId: string) => {
  if (typeof window === "undefined") return

  const user = localStorage.getItem("stylerent_user")
  if (!user) return

  const userData = JSON.parse(user)
  if (userData.id !== userId) return

  const orders = getOrdersByUserId(userId)

  // Count active rentals
  const now = new Date()
  const activeRentals = orders.filter(
    (order) => (order.status === "active" || order.status === "shipped") && new Date(order.endDate) >= now,
  ).length

  // Count total rentals
  const totalRentals = orders.length

  // Update user data
  const updatedUser = {
    ...userData,
    activeRentals,
    totalRentals,
  }

  localStorage.setItem("stylerent_user", JSON.stringify(updatedUser))

  // Update in users array
  const users = JSON.parse(localStorage.getItem("stylerent_users") || "[]")
  const userIndex = users.findIndex((u: any) => u.id === userId)
  if (userIndex >= 0) {
    users[userIndex] = updatedUser
    localStorage.setItem("stylerent_users", JSON.stringify(users))
  }
}

// Item functions
export const getItems = (): Item[] => {
  if (typeof window === "undefined") return []

  const items = localStorage.getItem("items")
  return items ? JSON.parse(items) : []
}

export const createItem = (itemData: ItemFormData, userId: string): Item => {
  const items = getItems()
  const newItem: Item = {
    id: generateId(),
    ...itemData,
    listerId: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  items.push(newItem)
  localStorage.setItem("items", JSON.stringify(items))
  return newItem
}
