"use server"

import Stripe from "stripe"
import { getCart, calculateCartTotal } from "@/lib/cart-utils"

export async function createPaymentIntent() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2023-10-16",
    })

    const cart = getCart()

    if (cart.length === 0) {
      throw new Error("Your cart is empty")
    }

    // Validate cart items have valid prices and rental days
    cart.forEach((item, index) => {
      if (isNaN(Number.parseFloat(String(item.price))) || !item.price) {
        throw new Error(`Invalid price for item ${item.name || index}`)
      }
      if (isNaN(Number.parseInt(String(item.rentalDays))) || !item.rentalDays) {
        throw new Error(`Invalid rental days for item ${item.name || index}`)
      }
    })

    // Calculate the total amount
    const cartTotals = calculateCartTotal(cart)

    // Validate the total amount
    if (isNaN(cartTotals.total) || cartTotals.total <= 0) {
      console.error("Invalid total amount:", cartTotals.total, "Cart:", JSON.stringify(cart))
      throw new Error("Invalid cart total. Please try again.")
    }

    // Convert to cents for Stripe (Stripe requires amount in smallest currency unit)
    const amount = Math.round(cartTotals.total * 100)

    // Final validation before creating payment intent
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Invalid payment amount calculated")
    }

    console.log("Creating payment intent with amount:", amount, "cents")

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        cartItems: JSON.stringify(
          cart.map((item) => ({
            id: item.itemId,
            name: item.name,
            price: item.price,
            rentalDays: item.rentalDays,
          })),
        ),
        subtotal: cartTotals.subtotal.toString(),
        tax: cartTotals.tax.toString(),
        total: cartTotals.total.toString(),
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
    }
  } catch (error: any) {
    console.error("Error creating payment intent:", error)
    throw new Error(error.message || "Failed to create payment intent")
  }
}
