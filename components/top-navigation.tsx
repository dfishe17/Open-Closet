"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function TopNavigation() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/browse",
      label: "Browse",
      active: pathname === "/browse",
    },
    {
      href: "/bundles",
      label: "Bundles",
      active: pathname === "/bundles",
    },
    {
      href: "/recommended",
      label: "Recommended",
      active: pathname === "/recommended",
    },
    {
      href: "/open-closet",
      label: "My OpenCloset",
      active: pathname === "/open-closet",
    },
  ]

  return (
    <div className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="mr-4 font-bold text-xl">
          OpenCloset
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                route.active ? "text-foreground" : "text-foreground/60",
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  )
}
