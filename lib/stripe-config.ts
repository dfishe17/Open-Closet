// Client-side configuration - only uses publishable key
export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""

// This function would be called from a server component or API route
export const createPaymentIntent = async (amount: number): Promise<{ clientSecret: string }> => {
  try {
    // In a real app, this would be a server API call to your own backend
    // NEVER call the Stripe API directly with your secret key from the client
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    })

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw error
  }
}

// Format helpers remain unchanged
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100)
}

export const formatAmountFromStripe = (amount: number): string => {
  return (amount / 100).toFixed(2)
}
