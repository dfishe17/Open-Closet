"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { FolderPlus } from "lucide-react" // Change from PlusCircle to FolderPlus

interface ListItemButtonProps {
  children?: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ListItemButton({
  children = "Create a Bundle", // Change the default text
  variant = "default",
  size = "default",
}: ListItemButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    // Navigate to the bundle creation page instead of add-new-item
    router.push("/profile/create-bundle")

    // Ensure the page scrolls to the top
    window.scrollTo(0, 0)
  }

  return (
    <Button onClick={handleClick} variant={variant} size={size}>
      <FolderPlus className="mr-2 h-4 w-4" /> {/* Change from PlusCircle to FolderPlus */}
      {children}
    </Button>
  )
}
