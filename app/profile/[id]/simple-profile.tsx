"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, Plus, Star, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function SimpleProfilePage({ params }) {
  const [activeTab, setActiveTab] = useState("items")
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [hasListedItems, setHasListedItems] = useState(false)

  // Popup states
  const [showFollowersPopup, setShowFollowersPopup] = useState(false)
  const [showFollowingPopup, setShowFollowingPopup] = useState(false)
  const [showRatingPopup, setShowRatingPopup] = useState(false)

  // Mock profile data
  const profile = {
    id: "demo-user",
    name: "Demo User",
    email: "user@example.com",
    avatar: "/placeholder.svg?height=100&width=100&text=User",
    rating: "N/A",
    itemCount: 0,
  }

  // Mock followers and following
  const followers = [
    {
      id: "user1",
      name: "User One",
      avatar: "/placeholder.svg?height=40&width=40&text=U1",
    },
    {
      id: "user2",
      name: "User Two",
      avatar: "/placeholder.svg?height=40&width=40&text=U2",
    },
  ]

  const following = [
    {
      id: "user3",
      name: "User Three",
      avatar: "/placeholder.svg?height=40&width=40&text=U3",
    },
    {
      id: "user4",
      name: "User Four",
      avatar: "/placeholder.svg?height=40&width=40&text=U4",
    },
  ]

  // Mock ratings
  const ratings = [
    { id: 1, user: "Alex M.", rating: 5, comment: "Great items, fast shipping!", date: "2 weeks ago" },
    { id: 2, user: "Jamie L.", rating: 4, comment: "Good quality clothes, would rent again.", date: "1 month ago" },
  ]

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
            className="flex-1 text-center px-4 py-2 rounded-l-md cursor-pointer border border-gray-200 bg-gray-50 hover:bg-gray-200"
            onClick={() => setShowFollowersPopup(true)}
            style={{ transition: "all 0.2s" }}
          >
            <p className="font-bold">0</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>

          <div
            className="flex-1 text-center px-4 py-2 rounded-r-md cursor-pointer border border-gray-200 bg-gray-50 hover:bg-gray-200"
            onClick={() => setShowFollowingPopup(true)}
            style={{ transition: "all 0.2s" }}
          >
            <p className="font-bold">0</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>

        {/* Rating */}
        <div
          className="flex items-center justify-center mb-4 py-1 px-3 rounded-md cursor-pointer border border-gray-200 bg-gray-50 hover:bg-gray-200"
          onClick={() => setShowRatingPopup(true)}
          style={{ transition: "all 0.2s" }}
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Followers</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowFollowersPopup(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {followers.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No followers yet</p>
              ) : (
                <div className="space-y-4">
                  {followers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/profile/${user.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Popup */}
      {showFollowingPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Following</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowFollowingPopup(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {following.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Not following anyone yet</p>
              ) : (
                <div className="space-y-4">
                  {following.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/profile/${user.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rating Popup */}
      {showRatingPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Ratings & Reviews</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowRatingPopup(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">N/A</p>
                  <div className="flex items-center justify-center my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-muted text-muted" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">No ratings yet</p>
                </div>
              </div>

              {ratings.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {ratings.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{review.user}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm mb-1">{review.comment}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
