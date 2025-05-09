import { Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export function InsuranceInfoBanner() {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Shield className="h-4 w-4 text-blue-500" />
      <AlertTitle className="text-blue-700">Automatic Insurance Protection</AlertTitle>
      <AlertDescription className="text-blue-600">
        A 25% refundable insurance fee is applied to all rentals. This is fully refunded when you return the item in its
        original condition.{" "}
        <Link href="/profile/settings/insurance" className="font-medium underline underline-offset-4">
          Manage your insurance preferences
        </Link>
      </AlertDescription>
    </Alert>
  )
}
