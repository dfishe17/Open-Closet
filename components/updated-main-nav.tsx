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

export function UpdatedMainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  // Find the profileLinks array and update the "My Shop's Rentals" entry to replace "My Listings":
  const profileLinks = [
    {
      href: "/profile?tab=listed",
      label: "My Shop",
      // icon: <Store className="mr-2 h-4 w-4" />, // Assuming Store is an icon component
    },
    {
      href: "/purchases",
      label: "My Purchases",
      // icon: <ShoppingBag className="mr-2 h-4 w-4" />, // Assuming ShoppingBag is an icon component
    },
    {
      href: "/shop-rentals",
      label: "My Shop's Rentals",
      // icon: <Package className="mr-2 h-4 w-4" />, // Assuming Package is an icon component
    },
    {
      href: "/profile/settings",
      label: "Settings",
      // icon: <Settings className="mr-2 h-4 w-4" />, // Assuming Settings is an icon component
    },
    {
      // action: handleLogout, // Assuming handleLogout is a function
      label: "Log Out",
      // icon: <LogOut className="mr-2 h-4 w-4" />, // Assuming LogOut is an icon component
      className: "text-red-500",
    },
  ]

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
