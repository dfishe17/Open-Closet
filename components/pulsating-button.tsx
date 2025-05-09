"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface PulsatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export const PulsatingButton = forwardRef<HTMLButtonElement, PulsatingButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center px-4 py-2 overflow-hidden font-medium text-white bg-sage rounded-md shadow-md group hover:scale-105 transition-all duration-300",
          className,
        )}
        {...props}
      >
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sage to-sage/70 rounded-md opacity-50 group-hover:opacity-0 transition-opacity duration-300"></span>
        <span className="absolute top-0 left-0 w-full h-full rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse bg-gradient-to-br from-sage/80 to-sage/50"></span>
        <span className="relative">{children}</span>
      </button>
    )
  },
)

PulsatingButton.displayName = "PulsatingButton"
