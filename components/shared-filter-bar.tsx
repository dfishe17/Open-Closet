"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  TrendingUp,
  Users,
  Heart,
  Sparkles,
  Tag,
  Ruler,
  ShoppingBag,
  Check,
  Palette,
  DollarSign,
  Layers,
  Grid,
  SlidersHorizontal,
} from "lucide-react"

export function SharedFilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get filter values from URL
  const categoryFilter = searchParams.get("category")
  const sizeFilter = searchParams.get("size")
  const brandFilter = searchParams.get("brand")
  const conditionFilter = searchParams.get("condition")
  const colorFilter = searchParams.get("color")
  const priceFilter = searchParams.get("price")
  const materialFilter = searchParams.get("material")
  const aestheticFilter = searchParams.get("aesthetic")
  const sortOption = searchParams.get("sort") || "newest"

  // Filter options
  const categories = ["Dresses", "Tops", "Bottoms", "Outerwear", "Accessories", "Shoes", "Formal", "Casual"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "0", "2", "4", "6", "8", "10", "12", "14"]
  const brands = ["Gucci", "Prada", "Zara", "H&M", "Nike", "Adidas", "Levi's", "Ralph Lauren", "Chanel", "Dior"]
  const conditions = ["New with tags", "Like new", "Gently used", "Well worn"]
  const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Pink", "Brown", "Gray"]
  const priceRanges = ["Under $25", "$25-$50", "$50-$100", "$100-$200", "Over $200"]
  const materials = ["Cotton", "Silk", "Wool", "Linen", "Polyester", "Leather", "Denim", "Cashmere"]
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
  ]

  // Popular aesthetics in the system
  const popularAesthetics = [
    "Minimalist",
    "Vintage",
    "Streetwear",
    "Bohemian",
    "Preppy",
    "Athleisure",
    "Cottagecore",
    "Y2K",
    "Grunge",
    "Romantic",
  ]

  // Helper function to update URL with filters
  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    // Preserve the search query if it exists
    const search = searchParams.get("search") || searchParams.get("q")
    if (search && !params.has("search") && !params.has("q")) {
      params.set("search", search)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetAllFilters = () => {
    const params = new URLSearchParams()

    // Preserve the search query if it exists
    const search = searchParams.get("search") || searchParams.get("q")
    if (search) {
      params.set("search", search)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  // Count active filters
  const activeFilterCount = [
    categoryFilter,
    sizeFilter,
    brandFilter,
    conditionFilter,
    colorFilter,
    priceFilter,
    materialFilter,
    aestheticFilter,
  ].filter(Boolean).length

  // Only show on browse or search pages
  if (pathname === "/" && !searchParams.has("search") && !searchParams.has("q")) {
    return null
  }

  return (
    <div className="bg-background border-b border-border py-1 px-2 sticky top-0 z-10 shadow-sm">
      <div className="flex justify-center overflow-x-auto pb-1 no-scrollbar">
        <div className="flex space-x-1.5 px-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center h-7 text-xs px-3 rounded-full whitespace-nowrap min-w-[80px]"
              >
                <Tag className="h-3 w-3 mr-1.5" />
                Category
                {categoryFilter && <span className="text-primary text-xs ml-0.5">•</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => updateFilters("category", null)}>All Categories</DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuItem key={category} onClick={() => updateFilters("category", category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center h-7 text-xs px-3 rounded-full whitespace-nowrap min-w-[60px]"
              >
                <Ruler className="h-3 w-3 mr-1.5" />
                Size
                {sizeFilter && <span className="text-primary text-xs ml-0.5">•</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => updateFilters("size", null)}>All Sizes</DropdownMenuItem>
              <DropdownMenuSeparator />
              {sizes.map((size) => (
                <DropdownMenuItem key={size} onClick={() => updateFilters("size", size)}>
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center h-7 text-xs px-3 rounded-full whitespace-nowrap min-w-[70px]"
              >
                <ShoppingBag className="h-3 w-3 mr-1.5" />
                Brand
                {brandFilter && <span className="text-primary text-xs ml-0.5">•</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => updateFilters("brand", null)}>All Brands</DropdownMenuItem>
              <DropdownMenuSeparator />
              {brands.map((brand) => (
                <DropdownMenuItem key={brand} onClick={() => updateFilters("brand", brand)}>
                  {brand}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center h-7 text-xs px-3 rounded-full whitespace-nowrap min-w-[90px]"
              >
                <Check className="h-3 w-3 mr-1.5" />
                Condition
                {conditionFilter && <span className="text-primary text-xs ml-0.5">•</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => updateFilters("condition", null)}>All Conditions</DropdownMenuItem>
              <DropdownMenuSeparator />
              {conditions.map((condition) => (
                <DropdownMenuItem key={condition} onClick={() => updateFilters("condition", condition)}>
                  {condition}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center h-7 text-xs px-3 rounded-full whitespace-nowrap min-w-[70px]"
              >
                <Palette className="h-3 w-3 mr-1.5" />
                Color
                {colorFilter && <span className="text-primary text-xs ml-0.5">•</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => updateFilters("color", null)}>All Colors</DropdownMenuItem>
              <DropdownMenuSeparator />
              {colors.map((color) => (
                <DropdownMenuItem key={color} onClick={() => updateFilters("color", color)}>
                  {color}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center h-7 text-xs px-3 rounded-full whitespace-nowrap min-w-[70px]"
              >
                <DollarSign className="h-3 w-3 mr-1.5" />
                Price
                {priceFilter && <span className="text-primary text-xs ml-0.5">•</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => updateFilters("price", null)}>All Prices</DropdownMenuItem>
              <DropdownMenuSeparator />
              {priceRanges.map((range) => (
                <DropdownMenuItem key={range} onClick={() => updateFilters("price", range)}>
                  {range}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center h-7 text-xs px-3 rounded-full whitespace-nowrap min-w-[85px]"
              >
                <Layers className="h-3 w-3 mr-1.5" />
                Material
                {materialFilter && <span className="text-primary text-xs ml-0.5">•</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => updateFilters("material", null)}>All Materials</DropdownMenuItem>
              <DropdownMenuSeparator />
              {materials.map((material) => (
                <DropdownMenuItem key={material} onClick={() => updateFilters("material", material)}>
                  {material}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center h-7 text-xs px-3 rounded-full whitespace-nowrap min-w-[70px]"
              >
                <Sparkles className="h-3 w-3 mr-1.5" />
                Style
                {aestheticFilter && <span className="text-primary text-xs ml-0.5">•</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => updateFilters("aesthetic", null)}>All Aesthetics</DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateFilters("aesthetic", "followed")}>
                Followed Aesthetics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {popularAesthetics.map((aesthetic) => (
                <DropdownMenuItem key={aesthetic} onClick={() => updateFilters("aesthetic", aesthetic)}>
                  {aesthetic}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center h-7 text-xs px-3 rounded-full whitespace-nowrap min-w-[60px]"
              >
                <Grid className="h-3 w-3 mr-1.5" />
                All
                {activeFilterCount > 0 && (
                  <span className="bg-primary/10 text-primary text-[10px] rounded-full px-1 ml-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={resetAllFilters}>Clear All Filters</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateFilters("feedType", "trending")}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateFilters("feedType", "following")}>
                <Users className="h-4 w-4 mr-2" />
                Following
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateFilters("feedType", "favorites")}>
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center h-7 text-xs px-3 rounded-full whitespace-nowrap min-w-[65px]"
              >
                <SlidersHorizontal className="h-3 w-3 mr-1.5" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map((option) => (
                <DropdownMenuItem key={option.value} onClick={() => updateFilters("sort", option.value)}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="mt-0.5 flex items-center justify-between">
          <div className="text-[10px] text-muted-foreground">
            {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} applied
          </div>
          <Button variant="ghost" size="xs" onClick={resetAllFilters} className="h-5 text-[10px] py-0">
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
