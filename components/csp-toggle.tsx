"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function CSPToggle() {
  const [isDisabling, setIsDisabling] = useState(false)
  const { toast } = useToast()

  const handleDisableCSP = async () => {
    setIsDisabling(true)
    try {
      const response = await fetch("/api/disable-csp")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "CSP Disabled",
          description: "Content Security Policy has been disabled for troubleshooting. Refresh the page.",
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable CSP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDisabling(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDisableCSP}
      disabled={isDisabling}
      className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm"
    >
      {isDisabling ? "Disabling..." : "Disable CSP for Testing"}
    </Button>
  )
}
