"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface BundleSelectorProps {
  onBundleSelect: (bundleId: string, bundleName: string) => void
  itemName: string
  trigger: React.ReactNode
}

export function BundleSelector({ onBundleSelect, itemName, trigger }: BundleSelectorProps) {
  const [bundles, setBundles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Load bundles from localStorage
  useEffect(() => {
    const loadBundles = () => {
      setIsLoading(true)
      try {
        const storedBundles = localStorage.getItem("stylerent_bundles") || localStorage.getItem("opencloset_bundles")
        if (storedBundles) {
          const parsedBundles = JSON.parse(storedBundles)
          setBundles(parsedBundles)
        } else {
          setBundles([])
        }
      } catch (error) {
        console.error("Error loading bundles:", error)
        setBundles([])
      } finally {
        setIsLoading(false)
      }
    }

    loadBundles()

    // Listen for bundle updates
    const handleBundlesUpdated = (event: any) => {
      if (event.detail?.bundles) {
        setBundles(event.detail.bundles)
      }
    }

    window.addEventListener("stylerent-bundles-updated", handleBundlesUpdated)
    window.addEventListener("opencloset-bundles-updated", handleBundlesUpdated)

    return () => {
      window.removeEventListener("stylerent-bundles-updated", handleBundlesUpdated)
      window.removeEventListener("opencloset-bundles-updated", handleBundlesUpdated)
    }
  }, [])

  const handleCreateBundle = () => {
    setOpen(false)
    router.push("/bundles")
    toast.message(`Create a new bundle to add "${itemName}"`, {
      action: {
        label: "Create Bundle",
        onClick: () => router.push("/bundles"),
      },
    })
  }

  const handleSelectBundle = (bundleId: string, bundleName: string) => {
    // Assuming 'itemName' is the item being added and it has a property 'allowInRenterBundles'
    const item = { allowInRenterBundles: true } // Replace with actual item data if available

    if (item.allowInRenterBundles === false) {
      toast.error(`This item cannot be added to custom bundles`)
      setOpen(false)
      return
    }

    onBundleSelect(bundleId, bundleName)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="p-0" align="start" side="right">
        <Command>
          <CommandInput placeholder="Search bundles..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading bundles...</span>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">No bundles found</p>
                  <Button variant="link" size="sm" onClick={handleCreateBundle} className="mt-2">
                    Create a new bundle
                  </Button>
                </div>
              )}
            </CommandEmpty>
            {bundles.length > 0 && (
              <CommandGroup heading="Your Bundles">
                {bundles.map((bundle) => (
                  <CommandItem
                    key={bundle.id}
                    onSelect={() => handleSelectBundle(bundle.id, bundle.name)}
                    className="flex items-center"
                  >
                    <div className="flex-1">
                      <p>{bundle.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {bundle.items.length} {bundle.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={handleCreateBundle}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Bundle
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
