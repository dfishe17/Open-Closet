export type OrderStatus =
  | "pending" // Created but not paid
  | "processing" // Payment received, being prepared
  | "shipped" // Items shipped to renter
  | "active" // Items currently being rented
  | "returned" // Items returned to lister
  | "completed" // Order fully completed
  | "cancelled" // Order cancelled
  | "disputed" // Order in dispute

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  days: number
  image?: string
}

export interface ShippingDetails {
  name: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
}

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentId?: string
  shippingDetails: ShippingDetails
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  orderId: string
  userId: string
  userName: string
  amount: number
  fee: number
  netAmount: number
  type: "payment" | "refund" | "payout"
  status: "pending" | "succeeded" | "failed"
  description: string
  metadata?: Record<string, any>
  createdAt: number
}
