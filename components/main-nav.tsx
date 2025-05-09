"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description: "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description: "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const isLoggedIn = true // Assuming isLoggedIn is always true for this example

  return (
    <NavigationMenu className={cn("hidden md:flex", className)} {...props}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/browse" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Browse</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/profile"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">Profile</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      View and manage your profile, listings, and purchases.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <Link href="/profile/settings" legacyBehavior passHref>
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Settings</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Manage your account settings and preferences.
                    </p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link href="/shop-rentals" legacyBehavior passHref>
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">My Shop's Rentals</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Manage rentals of your items to other users.
                    </p>
                  </NavigationMenuLink>
                </Link>
              </li>
              <li>
                <Link href="/purchases" legacyBehavior passHref>
                  <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">My Purchases</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      View your purchase history and active rentals.
                    </p>
                  </NavigationMenuLink>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/bundles" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Bundles</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
