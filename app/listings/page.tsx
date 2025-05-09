"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, Plus } from "lucide-react"

export default function ListingsPage() {
  const [activeListings, setActiveListings] = useState([])
  const [archivedListings, setArchivedListings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Create demo items for testing
    const demoItems = [
      {
        id: "demo-item-1",
        name: "Designer Dress",
        description: "Elegant designer dress perfect for formal occasions",
        price: 120,
        rentalPrice: 25,
        images: ["/placeholder.svg?height=300&width=300"],
        status: "Available",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Dresses",
      },
      {
        id: "demo-item-2",
        name: "Luxury Handbag",
        description: "Premium leather handbag from top designer",
        price: 350,
        rentalPrice: 40,
        images: ["/placeholder.svg?height=300&width=300"],
        status: "Available",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Accessories",
      },
      {
        id: "demo-item-3",
        name: "Vintage Jacket",
        description: "Rare vintage leather jacket in excellent condition",
        price: 200,
        rentalPrice: 30,
        images: ["/placeholder.svg?height=300&width=300"],
        status: "Archived",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Outerwear",
      },
    ]

    setActiveListings(demoItems.filter((item) => item.status === "Available"))
    setArchivedListings(demoItems.filter((item) => item.status === "Archived"))
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">My Listings</h1>
        <p>Loading your listings...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Button asChild>
          <Link href="/list-item">
            <Plus className="mr-2 h-4 w-4" />
            List New Item
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active">Active Listings</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid gap-4">
            {activeListings.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{item.name}</CardTitle>
                    <Badge>{item.status || "Available"}</Badge>
                  </div>
                  <CardDescription>Listed on {new Date(item.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <img
                        src={item.images?.[0] || "/placeholder.svg?height=200&width=200"}
                        alt={item.name}
                        className="w-full h-auto rounded-md"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <p className="text-sm mb-2">{item.description}</p>
                      <div className="flex flex-wrap gap-4 mt-4">
                        <div>
                          <p className="text-sm font-medium">Category</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Price</p>
                          <p className="text-sm text-muted-foreground">${item.rentalPrice}/day</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Purchase Price</p>
                          <p className="text-sm text-muted-foreground">${item.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/items/${item.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="archived">
          <div className="grid gap-4">
            {archivedListings.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{item.name}</CardTitle>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                  <CardDescription>Listed on {new Date(item.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <img
                        src={item.images?.[0] || "/placeholder.svg?height=200&width=200"}
                        alt={item.name}
                        className="w-full h-auto rounded-md"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <p className="text-sm mb-2">{item.description}</p>
                      <div className="flex flex-wrap gap-4 mt-4">
                        <div>
                          <p className="text-sm font-medium">Category</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Price</p>
                          <p className="text-sm text-muted-foreground">${item.rentalPrice}/day</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Purchase Price</p>
                          <p className="text-sm text-muted-foreground">${item.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/items/${item.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
