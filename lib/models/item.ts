export interface Item {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  condition: string
  brand: string
  size: string
  listerId: string
  createdAt: string
  updatedAt: string
  insurance?: {
    id: string
    name: string
    description: string
    coverage: string[]
    price: number
  } | null
}
