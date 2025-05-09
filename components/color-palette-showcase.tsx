export function ColorPaletteShowcase() {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-charcoal">Our Elegant Color Palette</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-charcoal rounded-full"></div>
          <span className="mt-2 text-sm text-charcoal">Charcoal</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-beige rounded-full border border-gray-200"></div>
          <span className="mt-2 text-sm text-charcoal">Beige</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-taupe rounded-full"></div>
          <span className="mt-2 text-sm text-charcoal">Taupe</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-ivory rounded-full border border-gray-200"></div>
          <span className="mt-2 text-sm text-charcoal">Ivory</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blush rounded-full"></div>
          <span className="mt-2 text-sm text-charcoal">Blush</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-sage rounded-full"></div>
          <span className="mt-2 text-sm text-charcoal">Sage</span>
        </div>
      </div>
    </div>
  )
}
