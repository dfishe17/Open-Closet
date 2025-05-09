"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ShippingFormProps {
  onSubmit: (data: any) => void
}

export function ShippingForm({ onSubmit }: ShippingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zip">ZIP Code</Label>
          <Input id="zip" name="zip" value={formData.zip} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full">
          Continue to Payment
        </Button>
      </div>
    </form>
  )
}
