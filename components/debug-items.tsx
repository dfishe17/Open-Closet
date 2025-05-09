"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTestItems, getUserItems, saveItem } from "@/lib/item-utils"

export function DebugItems() {
  const [testItems, setTestItems] = useState([])
  const [userItems, setUserItems] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setTestItems(getTestItems())
    setUserItems(getUserItems())
  }, [refreshKey])

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleAddTestItem = () => {
    const newItem = {
      name: `Test Item ${Date.now()}`,
      designer: "Debug Designer",
      rentalPrice: Math.floor(Math.random() * 100) + 20,
      price: Math.floor(Math.random() * 500) + 100,
      rating: (Math.random() * 2 + 3).toFixed(1),
      size: ["XS", "S", "M", "L", "XL"][Math.floor(Math.random() * 5)],
      aesthetic: ["Bohemian", "Minimalist", "Edgy", "Casual", "Vintage"][Math.floor(Math.random() * 5)],
      media: [{ url: "/placeholder.svg?height=400&width=300" }],
      description: "This is a debug test item.",
    }

    saveItem(newItem)
    handleRefresh()
  }

  const handleClearUserItems = () => {
    localStorage.removeItem("stylerent_items")
    window.dispatchEvent(new CustomEvent("stylerent-items-updated"))
    handleRefresh()
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Debug Items</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleRefresh}>
              Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={handleAddTestItem}>
              Add Test Item
            </Button>
            <Button size="sm" variant="destructive" onClick={handleClearUserItems}>
              Clear User Items
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="user">
          <TabsList>
            <TabsTrigger value="user">User Items ({userItems.length})</TabsTrigger>
            <TabsTrigger value="test">Test Items ({testItems.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            {userItems.length === 0 ? (
              <p className="text-muted-foreground">No user items found.</p>
            ) : (
              <div className="space-y-2 mt-2">
                {userItems.map((item, index) => (
                  <div key={index} className="border p-2 rounded-md text-sm">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {item.id} | Designer: {item.designer} | Price: ${item.rentalPrice}/day
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="test">
            <div className="space-y-2 mt-2">
              {testItems.map((item, index) => (
                <div key={index} className="border p-2 rounded-md text-sm">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ID: {item.id} | Designer: {item.designer} | Price: ${item.rentalPrice}/day
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
