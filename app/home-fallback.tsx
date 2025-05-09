import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function HomeFallback() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Rent Designer Clothes for Any Occasion</h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Access premium fashion without the commitment. Rent, wear, return, repeat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md"
                asChild
              >
                <Link href="/browse">
                  Browse Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md hover:bg-secondary/80"
                asChild
              >
                <Link href="/auth/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Content Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Welcome to StyleRent</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            StyleRent is a premium clothing rental platform that allows you to access designer fashion without the
            commitment of purchasing.
          </p>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/browse">Explore Our Collection</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/50 border-t mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© {new Date().getFullYear()} StyleRent. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
