import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SeeAllBundlesButton() {
  return (
    <div className="flex justify-center mt-8">
      <Button asChild size="lg" className="gap-2">
        <Link href="/bundles">
          See All Bundles
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
