import type React from "react"
import { Dot } from "@/components/ui/dot"
import { Shield } from "lucide-react"

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    size: string
    quantity: number
    insurance?: {
      name: string
      price: number
    }
  }
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  return (
    <div className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-muted">
        {/* You might want to add an image here based on item.id or item.image */}
        <div className="h-full w-full bg-gray-100" />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <div className="grid gap-1">
              <h3 className="font-medium leading-none">{item.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>${item.price}/day</span>
                <Dot className="h-4 w-4" />
                <span>{item.size}</span>
              </div>
            </div>
            <p className="ml-4">${item.price}</p>
          </div>
          {item.insurance && (
            <div className="mt-2 text-sm">
              <div className="flex items-center">
                <Shield className="h-3 w-3 mr-1 text-primary" />
                <span className="font-medium">{item.insurance.name}</span>
                <span className="ml-auto">${item.insurance.price}</span>
              </div>
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
        </div>

        <div className="flex flex-1 items-end justify-between text-sm">
          <p className="text-gray-500">{/* You might want to add options here */}</p>

          <div className="flex">
            <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
