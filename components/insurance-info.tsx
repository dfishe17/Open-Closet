"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

export function InsuranceInfo({ compact = false }: { compact?: boolean }) {
  const [dismissed, setDismissed] = useState(false)
  const router = useRouter()

  if (dismissed) return null

  if (compact) {
    return (
      <div className="mb-4 flex items-center justify-between bg-amber-50 text-amber-800 p-2 rounded-md text-sm">
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>25% refundable insurance deposit applied</span>
        </div>
        <Button
          size="sm"
          variant="link"
          className="text-amber-800 p-0 h-auto"
          onClick={() => router.push("/profile/settings/insurance")}
        >
          Learn more
        </Button>
      </div>
    )
  }

  return (
    <Alert className="bg-amber-50 border-amber-200 text-amber-800 mb-6 relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-2 text-amber-600 hover:text-amber-900"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      <Shield className="h-4 w-4" />
      <AlertTitle>Insurance Protection</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          A 25% insurance deposit is added to all rentals and is fully refunded when items are returned in good
          condition.
        </p>
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            className="border-amber-300 bg-amber-100/50 hover:bg-amber-100"
            onClick={() => router.push("/profile/settings/insurance")}
          >
            Manage Insurance Settings
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
