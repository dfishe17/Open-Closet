"use client"

// Types
export interface Transaction {
  id: string
  buyerId: string
  sellerId: string
  itemId: string
  itemName: string
  itemImage: string
  price: number
  rentalDays: number
  startDate: string
  endDate: string
  status: "pending" | "active" | "completed" | "cancelled"
  timestamp: number
}

// Get all transactions from localStorage
export const getTransactions = (): Transaction[] => {
  try {
    const transactions = localStorage.getItem("opencloset_transactions")
    return transactions ? JSON.parse(transactions) : []
  } catch (error) {
    console.error("Error getting transactions:", error)
    return []
  }
}

// Save transactions to localStorage
export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem("opencloset_transactions", JSON.stringify(transactions))
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent("opencloset-transactions-updated"))
  } catch (error) {
    console.error("Error saving transactions:", error)
  }
}

// Create a new transaction
export const createTransaction = (transaction: Omit<Transaction, "id" | "timestamp">): Transaction => {
  try {
    const transactions = getTransactions()

    const newTransaction: Transaction = {
      ...transaction,
      id: `transaction-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
    }

    transactions.push(newTransaction)
    saveTransactions(transactions)
    return newTransaction
  } catch (error) {
    console.error("Error creating transaction:", error)
    throw error
  }
}

// Update a transaction status
export const updateTransactionStatus = (transactionId: string, status: Transaction["status"]): boolean => {
  try {
    const transactions = getTransactions()

    const updatedTransactions = transactions.map((t) => {
      if (t.id === transactionId) {
        return { ...t, status }
      }
      return t
    })

    saveTransactions(updatedTransactions)
    return true
  } catch (error) {
    console.error("Error updating transaction:", error)
    return false
  }
}

// Get transactions for a user (either as buyer or seller)
export const getUserTransactions = (userId: string): Transaction[] => {
  try {
    const transactions = getTransactions()
    return transactions.filter((t) => t.buyerId === userId || t.sellerId === userId)
  } catch (error) {
    console.error("Error getting user transactions:", error)
    return []
  }
}

// Get buyer transactions
export const getBuyerTransactions = (userId: string): Transaction[] => {
  try {
    const transactions = getTransactions()
    return transactions.filter((t) => t.buyerId === userId)
  } catch (error) {
    console.error("Error getting buyer transactions:", error)
    return []
  }
}

// Get seller transactions
export const getSellerTransactions = (userId: string): Transaction[] => {
  try {
    const transactions = getTransactions()
    return transactions.filter((t) => t.sellerId === userId)
  } catch (error) {
    console.error("Error getting seller transactions:", error)
    return []
  }
}
