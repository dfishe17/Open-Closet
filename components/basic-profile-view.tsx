"use client"

import { useState } from "react"
import { MoreHorizontal, Plus, Star, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export function BasicProfileView({ profile }) {
  // Popup states
  const [showFollowersPopup, setShowFollowersPopup] = useState(false)
  const [showFollowingPopup, setShowFollowingPopup] = useState(false)
  const [showRatingPopup, setShowRatingPopup] = useState(false)

  // Mock data for popups
  const followers = []
  const following = []
  const ratings = []

  const handleListItem = () => {
    toast.success("Redirecting to list item page")
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
          <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <h2 className="text-xl font-bold">{profile.name}</h2>
        <p className="text-sm text-muted-foreground">{profile.email}</p>

        {/* Followers and Following */}
        <div className="flex justify-center w-full mt-4 mb-2">
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "8px 16px",
              borderTopLeftRadius: "6px",
              borderBottomLeftRadius: "6px",
              cursor: "pointer",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
            onClick={() => setShowFollowersPopup(true)}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
          >
            <p className="font-bold">0</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>

          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "8px 16px",
              borderTopRightRadius: "6px",
              borderBottomRightRadius: "6px",
              cursor: "pointer",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
            onClick={() => setShowFollowingPopup(true)}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
          >
            <p className="font-bold">0</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>

        {/* Rating */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            padding: "4px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: "#f9fafb",
            border: "1px solid #e5e7eb",
          }}
          onClick={() => setShowRatingPopup(true)}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
        >
          <span className="font-medium mr-1">N/A</span>
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-xs text-muted-foreground ml-1">Rating</span>
        </div>

        {/* Account Settings Button - ONLY button here */}
        <div className="w-full">
          <Button variant="outline" className="w-full">
            Account Settings
          </Button>
        </div>
      </div>

      {/* Tabs and Content */}
      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="items" className="text-xs">
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="4" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </TabsTrigger>
          <TabsTrigger value="list" className="text-xs">
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </TabsTrigger>
          <TabsTrigger value="columns" className="text-xs">
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="10" y="4" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="16" y="4" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </TabsTrigger>
          <TabsTrigger value="compact" className="text-xs">
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 10H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 14H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </TabsTrigger>
          <TabsTrigger value="more" className="text-xs">
            <div className="flex flex-col items-center">
              <MoreHorizontal className="h-5 w-5" />
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-0">
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground mb-4">You haven't listed any items or bundles yet.</p>
            <Button onClick={handleListItem} className="bg-green-600 hover:bg-green-700 text-white" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              List Your First Item
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">List view will display your items here.</p>
          </div>
        </TabsContent>

        <TabsContent value="columns" className="mt-0">
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">Column view will display your items here.</p>
          </div>
        </TabsContent>

        <TabsContent value="compact" className="mt-0">
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">Compact view will display your items here.</p>
          </div>
        </TabsContent>

        <TabsContent value="more" className="mt-0">
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">Additional options will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* List New Item Button (Fixed at bottom right) */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={handleListItem}
          className="rounded-full bg-green-600 hover:bg-green-700 text-white h-12 w-12 p-0"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">List New Item</span>
        </Button>
      </div>

      {/* Followers Popup */}
      {showFollowersPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "28rem",
              maxHeight: "80vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 className="font-semibold text-lg">Followers</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowFollowersPopup(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div style={{ padding: "16px", overflowY: "auto", flex: 1 }}>
              <p className="text-center py-4 text-muted-foreground">No followers yet</p>
            </div>
          </div>
        </div>
      )}

      {/* Following Popup */}
      {showFollowingPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "28rem",
              maxHeight: "80vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 className="font-semibold text-lg">Following</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowFollowingPopup(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div style={{ padding: "16px", overflowY: "auto", flex: 1 }}>
              <p className="text-center py-4 text-muted-foreground">Not following anyone yet</p>
            </div>
          </div>
        </div>
      )}

      {/* Rating Popup */}
      {showRatingPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "28rem",
              maxHeight: "80vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 className="font-semibold text-lg">Ratings & Reviews</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowRatingPopup(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div style={{ padding: "16px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "1.875rem", lineHeight: "2.25rem", fontWeight: "bold" }}>N/A</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "8px 0" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-muted" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">No ratings yet</p>
                </div>
              </div>
              <p className="text-center py-4 text-muted-foreground">No reviews yet</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
