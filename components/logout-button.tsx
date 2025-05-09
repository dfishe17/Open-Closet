"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
  showIcon?: boolean
  redirectTo?: string
}

export function LogoutButton({
  variant = "default",
  className = "",
  showIcon = false,
  redirectTo = "/profile/logout",
}: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = () => {
    try {
      // Clear all auth state
      localStorage.setItem("opencloset_logged_in", "false")
      localStorage.setItem("stylerent_logged_in", "false")

      // Clear current user data (but keep it in users array for history)
      localStorage.removeItem("opencloset_user")
      localStorage.removeItem("stylerent_user")

      // Clear session data
      localStorage.removeItem("opencloset_session")
      localStorage.removeItem("stylerent_session")

      // Clear cart and active rentals
      localStorage.removeItem("opencloset_cart")
      localStorage.removeItem("stylerent_cart")

      // Trigger auth changed event
      window.dispatchEvent(new CustomEvent("opencloset-auth-changed"))
      window.dispatchEvent(new CustomEvent("stylerent-auth-changed"))

      toast.success("Logged out successfully")

      // Redirect to logout page
      router.push(redirectTo)
    } catch (error) {
      console.error("Error logging out:", error)
      toast.error("Failed to log out")
    }
  }

  return (
    <Button variant={variant} className={className} onClick={handleLogout}>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      Logout
    </Button>
  )
}
