"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Info, Shield, ShieldCheck, ShieldX } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface InsuranceOption {
  id: string
  name: string
  description: string
  coverage: string[]
  price: number
  percentOfItemValue: number
}

interface InsuranceOptionsProps {
  itemValue: number
  onSelect: (option: InsuranceOption | null) => void
  selectedOption?: string | null
}

export function InsuranceOptions({ itemValue, onSelect, selectedOption }: InsuranceOptionsProps) {
  // Platform insurance options
  const insuranceOptions: InsuranceOption[] = [
    {
      id: "basic",
      name: "Basic Protection",
      description: "Basic coverage for minor damages",
      coverage: ["Minor stains", "Small tears", "Button replacement", "Minor alterations"],
      price: 5,
      percentOfItemValue: 0.05,
    },
    {
      id: "standard",
      name: "Standard Protection",
      description: "Comprehensive coverage for most damages",
      coverage: ["All basic coverage", "Major stains", "Tears and rips", "Zipper replacement", "Moderate alterations"],
      price: 10,
      percentOfItemValue: 0.1,
    },
    {
      id: "premium",
      name: "Premium Protection",
      description: "Full coverage including theft and loss",
      coverage: [
        "All standard coverage",
        "Theft protection",
        "Lost item coverage",
        "Full replacement value",
        "Express repairs",
      ],
      price: 15,
      percentOfItemValue: 0.15,
    },
  ]

  // Calculate actual prices based on item value
  const calculatedOptions = insuranceOptions.map((option) => ({
    ...option,
    price: Math.max(option.price, Math.round(itemValue * option.percentOfItemValue)),
  }))

  const handleChange = (value: string) => {
    if (value === "none") {
      onSelect(null)
    } else {
      const selected = calculatedOptions.find((option) => option.id === value)
      if (selected) {
        onSelect(selected)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Insurance Options</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground cursor-help">
                <Info className="h-4 w-4 mr-1" />
                About Insurance Refunds
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-4">
              <p className="font-medium mb-2">Insurance Refund Policy</p>
              <p className="text-sm mb-2">
                Renters can receive a partial or full refund of the insurance fee if they return the item in the same
                condition as when they received it.
              </p>
              <ul className="text-sm list-disc pl-4 space-y-1">
                <li>Full refund: Item returned in perfect condition with no signs of wear</li>
                <li>Partial refund (50%): Item returned with minimal wear within acceptable limits</li>
                <li>No refund: Item returned with damage or excessive wear</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <RadioGroup
        defaultValue={selectedOption || "none"}
        onValueChange={handleChange}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="overflow-hidden border-2 border-muted hover:border-muted-foreground/50 transition-colors cursor-pointer">
          <CardContent className="p-0">
            <Label htmlFor="insurance-none" className="flex flex-col h-full cursor-pointer p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <RadioGroupItem value="none" id="insurance-none" className="mr-2" />
                  <span className="font-medium">No Insurance</span>
                </div>
                <ShieldX className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Renter assumes full responsibility for any damages</p>
              <div className="mt-auto pt-4 text-right font-medium">$0</div>
            </Label>
          </CardContent>
        </Card>

        {calculatedOptions.map((option) => (
          <Card
            key={option.id}
            className={`overflow-hidden border-2 ${
              selectedOption === option.id ? "border-primary" : "border-muted hover:border-muted-foreground/50"
            } transition-colors cursor-pointer`}
          >
            <CardContent className="p-0">
              <Label htmlFor={`insurance-${option.id}`} className="flex flex-col h-full cursor-pointer p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <RadioGroupItem value={option.id} id={`insurance-${option.id}`} className="mr-2" />
                    <span className="font-medium">{option.name}</span>
                  </div>
                  {option.id === "basic" && <Shield className="h-5 w-5 text-amber-500" />}
                  {option.id === "standard" && <Shield className="h-5 w-5 text-emerald-500" />}
                  {option.id === "premium" && <ShieldCheck className="h-5 w-5 text-blue-500" />}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1 mb-4">
                  {option.coverage.slice(0, 3).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                  {option.coverage.length > 3 && <li>+{option.coverage.length - 3} more</li>}
                </ul>
                <div className="mt-auto pt-2 text-right font-medium">${option.price}</div>
              </Label>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>

      <div className="bg-muted/50 p-4 rounded-lg mt-4">
        <div className="flex items-start">
          <ShieldCheck className="h-5 w-5 text-primary mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Insurance Refund Policy</p>
            <p className="text-sm text-muted-foreground mt-1">
              Renters can receive a partial or full refund of the insurance fee if they return the item in the same
              condition as when they received it.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
