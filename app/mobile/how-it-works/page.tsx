import { MobileHowItWorks } from "@/components/mobile/mobile-how-it-works"

export default function MobileHowItWorksPage() {
  return (
    <div className="container px-4 py-6">
      <h1 className="text-2xl font-bold font-cinzel mb-6">How It Works</h1>

      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-6">
          OpenCloset makes it easy to rent designer clothes for any occasion. Follow these simple steps to get started:
        </p>

        <MobileHowItWorks />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm mb-1">How long can I rent items?</h3>
            <p className="text-sm text-muted-foreground">
              You can rent items for 4, 8, or 16 days. Need longer? Contact us for extended rental options.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-1">What if something gets damaged?</h3>
            <p className="text-sm text-muted-foreground">
              All rentals include basic insurance. For additional coverage, you can add premium protection during
              checkout.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-1">Do I need to clean items before returning?</h3>
            <p className="text-sm text-muted-foreground">
              No need to clean! Just return items in the provided packaging, and we'll handle the professional cleaning.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
