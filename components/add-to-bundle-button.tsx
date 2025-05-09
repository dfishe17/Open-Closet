"use client"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { ShoppingBag, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { BundleSelector } from "@/components/bundle-selector"

interface AddToBundleButtonProps extends ButtonProps {
  itemId: string
  itemName: string
  itemDetails?: any // Additional item details to store
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
}

export function AddToBundleButton({
  itemId,
  itemName,
  itemDetails = {},
  variant = "default",
  size = "default",
  showIcon = true,
  className,
  ...props
}: AddToBundleButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const addToBundle = (bundleId: string, bundleName: string) => {
    setIsLoading(true)

    try {
      // Get all bundles from localStorage
      const storedBundles = localStorage.getItem("stylerent_bundles") || localStorage.getItem("opencloset_bundles")
      const bundles = storedBundles ? JSON.parse(storedBundles) : []

      // Find the selected bundle
      const bundleIndex = bundles.findIndex((bundle: any) => bundle.id === bundleId)

      if (bundleIndex === -1) {
        toast.error("Selected bundle not found")
        setIsLoading(false)
        return
      }

      // Check if item is already in the bundle
      if (bundles[bundleIndex].items.some((item: any) => item.id === itemId)) {
        toast.info(`${itemName} is already in "${bundleName}"`)
        setIsLoading(false)
        return
      }

      // Add item to the bundle
      bundles[bundleIndex].items.push({
        id: itemId,
        name: itemName,
        addedAt: new Date().toISOString(),
        quantity: 1,
        ...itemDetails,
      })

      // Save updated bundles to localStorage
      localStorage.setItem("stylerent_bundles", JSON.stringify(bundles))
      localStorage.setItem("opencloset_bundles", JSON.stringify(bundles))

      // Dispatch event to notify other components
      window.dispatchEvent(
        new CustomEvent("stylerent-bundles-updated", {
          detail: { bundles },
        }),
      )

      toast.success(`${itemName} added to "${bundleName}"`)

      // Ask if user wants to view their bundle
      toast.message(`Item added to "${bundleName}"`, {
        action: {
          label: "View Bundle",
          onClick: () => router.push(`/bundles/${bundleId}`),
        },
      })
    } catch (error) {
      console.error("Error adding item to bundle:", error)
      toast.error("Failed to add item to bundle")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BundleSelector
      onBundleSelect={addToBundle}
      itemName={itemName}
      trigger={
        <Button variant={variant} size={size} disabled={isLoading} className={className} {...props}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            showIcon && <ShoppingBag className="h-4 w-4 mr-2" />
          )}
          {isLoading ? "Adding..." : "Add to Bundle"}
        </Button>
      }
    />
  )
}
