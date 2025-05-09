"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"

export default function InsuranceSettingsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [autoInsurance, setAutoInsurance] = useState(true)
  const [refundPreference, setRefundPreference] = useState("bank")
  const [bankAccount, setBankAccount] = useState("")
  const [bankRouting, setBankRouting] = useState("")
  const [paypalEmail, setPaypalEmail] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("opencloset_logged_in") === "true"

    if (!isLoggedIn) {
      router.push("/auth/signin")
      return
    }

    // Get user data
    try {
      const storedUser = localStorage.getItem("opencloset_user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUserData(parsedUser)

        // Set insurance preferences from saved data
        const userInsurance = localStorage.getItem(`opencloset_insurance_${parsedUser.id}`)
        if (userInsurance) {
          const insurance = JSON.parse(userInsurance)
          setAutoInsurance(insurance.autoInsurance !== false)
          setRefundPreference(insurance.refundPreference || "bank")
          setBankAccount(insurance.bankAccount || "")
          setBankRouting(insurance.bankRouting || "")
          setPaypalEmail(insurance.paypalEmail || "")
          setNotifications(insurance.notifications !== false)
        }
      } else {
        router.push("/auth/signin")
      }
    } catch (error) {
      console.error("Error retrieving user data:", error)
      router.push("/auth/signin")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleSaveSettings = () => {
    if (!userData) return

    // Save insurance preferences to localStorage
    const insuranceSettings = {
      autoInsurance,
      refundPreference,
      bankAccount,
      bankRouting,
      paypalEmail,
      notifications,
    }

    localStorage.setItem(`opencloset_insurance_${userData.id}`, JSON.stringify(insuranceSettings))

    // Show success message
    toast({
      title: "Settings saved",
      description: "Your insurance preferences have been updated.",
    })
  }

  if (!isClient || isLoading) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Loading your insurance settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile/settings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Link>
        </Button>
      </div>

      <div className="grid gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insurance Settings</h1>
          <p className="text-muted-foreground">Manage your insurance preferences and refund settings.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Insurance Coverage
            </CardTitle>
            <CardDescription>Configure how insurance is applied to your rentals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
              <h4 className="font-medium mb-2">How the 25% Insurance Deposit Works</h4>
              <p className="text-sm">
                A 25% insurance fee is added to all rentals to cover potential damages. This amount is fully refunded
                when you return the item in its original condition, according to your refund preferences below.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto-insurance"
                checked={autoInsurance}
                onCheckedChange={(checked) => setAutoInsurance(checked === true)}
              />
              <div>
                <Label htmlFor="auto-insurance">Automatically add insurance to my rentals (recommended)</Label>
                <p className="text-xs text-muted-foreground">
                  If disabled, you'll be liable for the full replacement value of any damaged items
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Refund Preferences</CardTitle>
            <CardDescription>Choose how you want to receive your insurance refunds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={refundPreference} onValueChange={setRefundPreference} className="space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="original" id="refund-original" />
                <Label htmlFor="refund-original">Refund to original payment method</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="refund-bank" />
                <Label htmlFor="refund-bank">Refund to bank account</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="refund-paypal" />
                <Label htmlFor="refund-paypal">Refund to PayPal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit" id="refund-credit" />
                <Label htmlFor="refund-credit">Store as account credit</Label>
              </div>
            </RadioGroup>

            {refundPreference === "bank" && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid gap-2">
                  <Label htmlFor="bank-account">Bank Account Number</Label>
                  <Input
                    id="bank-account"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="Enter your bank account number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bank-routing">Routing Number</Label>
                  <Input
                    id="bank-routing"
                    value={bankRouting}
                    onChange={(e) => setBankRouting(e.target.value)}
                    placeholder="Enter your routing number"
                  />
                </div>
              </div>
            )}

            {refundPreference === "paypal" && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid gap-2">
                  <Label htmlFor="paypal-email">PayPal Email</Label>
                  <Input
                    id="paypal-email"
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    placeholder="Enter your PayPal email address"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your insurance-related notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifications"
                checked={notifications}
                onCheckedChange={(checked) => setNotifications(checked === true)}
              />
              <Label htmlFor="notifications">Receive notifications about insurance refunds and claims</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save Insurance Settings</Button>
        </div>
      </div>
    </div>
  )
}
