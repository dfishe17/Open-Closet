"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { X, Search, Sparkles, TrendingUp } from "lucide-react"
import {
  getFollowedAesthetics,
  unfollowAesthetic,
  followAesthetic,
  getAllAesthetics,
  getPopularAesthetics,
} from "@/lib/aesthetic-utils"
import { getCurrentUser } from "@/lib/user-utils"

export default function AestheticsManagementPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [followedAesthetics, setFollowedAesthetics] = useState<string[]>([])
  const [allAesthetics, setAllAesthetics] = useState<string[]>([])
  const [popularAesthetics, setPopularAesthetics] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("followed")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/signin")
      return
    }

    setUser(currentUser)

    // Load aesthetics
    if (currentUser.id) {
      const followed = getFollowedAesthetics(currentUser.id)
      setFollowedAesthetics(followed)

      const all = getAllAesthetics()
      setAllAesthetics(all)

      const popular = getPopularAesthetics(10)
      setPopularAesthetics(popular)
    }

    // Listen for aesthetic updates
    const handleAestheticUpdate = () => {
      if (currentUser?.id) {
        const followed = getFollowedAesthetics(currentUser.id)
        setFollowedAesthetics(followed)
      }
    }

    window.addEventListener("stylerent-aesthetics-updated", handleAestheticUpdate)

    return () => {
      window.removeEventListener("stylerent-aesthetics-updated", handleAestheticUpdate)
    }
  }, [router])

  const handleUnfollow = (aesthetic: string) => {
    if (!user) return

    unfollowAesthetic(user.id, aesthetic)
    const updated = getFollowedAesthetics(user.id)
    setFollowedAesthetics(updated)
  }

  const handleFollow = (aesthetic: string) => {
    if (!user) return

    followAesthetic(user.id, aesthetic)
    const updated = getFollowedAesthetics(user.id)
    setFollowedAesthetics(updated)
  }

  const filteredAesthetics = allAesthetics.filter((aesthetic) =>
    aesthetic.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!user) {
    return (
      <div className="container py-10">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight font-serif mb-2">Style Preferences</h1>
          <p className="text-muted-foreground">
            Manage your followed aesthetics to personalize your feed and discover items that match your style.
          </p>
        </div>

        <Tabs defaultValue="followed" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="followed">Followed Aesthetics</TabsTrigger>
            <TabsTrigger value="discover">Discover Aesthetics</TabsTrigger>
            <TabsTrigger value="popular">Popular Aesthetics</TabsTrigger>
          </TabsList>

          <TabsContent value="followed">
            <Card>
              <CardHeader>
                <CardTitle>Your Followed Aesthetics</CardTitle>
                <CardDescription>
                  These aesthetics will be used to personalize your feed and recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {followedAesthetics.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No aesthetics followed yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Follow some aesthetics to personalize your feed and discover items that match your style.
                    </p>
                    <Button onClick={() => setActiveTab("discover")}>Discover Aesthetics</Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {followedAesthetics.map((aesthetic) => (
                      <Badge key={aesthetic} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-1">
                        {aesthetic}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 ml-1 -mr-1 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleUnfollow(aesthetic)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Unfollow {aesthetic}</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              {followedAesthetics.length > 0 && (
                <CardFooter className="flex justify-between border-t pt-6">
                  <div className="text-sm text-muted-foreground">
                    {followedAesthetics.length} {followedAesthetics.length === 1 ? "aesthetic" : "aesthetics"} followed
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("discover")}>
                    Discover More
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="discover">
            <Card>
              <CardHeader>
                <CardTitle>Discover Aesthetics</CardTitle>
                <CardDescription>
                  Explore different aesthetics and follow the ones that match your style.
                </CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search aesthetics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {filteredAesthetics.length === 0 ? (
                    <p className="text-muted-foreground py-4">No aesthetics found matching your search.</p>
                  ) : (
                    filteredAesthetics.map((aesthetic) => {
                      const isFollowing = followedAesthetics.includes(aesthetic)
                      return (
                        <Badge
                          key={aesthetic}
                          variant={isFollowing ? "default" : "outline"}
                          className="px-3 py-1 text-sm cursor-pointer hover:opacity-80"
                          onClick={() => (isFollowing ? handleUnfollow(aesthetic) : handleFollow(aesthetic))}
                        >
                          {aesthetic}
                          {isFollowing && <X className="h-3 w-3 ml-1" />}
                        </Badge>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="popular">
            <Card>
              <CardHeader>
                <CardTitle>Popular Aesthetics</CardTitle>
                <CardDescription>Trending aesthetics that are popular among our community.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularAesthetics.map((aesthetic) => {
                    const isFollowing = followedAesthetics.includes(aesthetic)
                    return (
                      <div
                        key={aesthetic}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <TrendingUp className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{aesthetic}</h3>
                            <p className="text-xs text-muted-foreground">
                              {Math.floor(Math.random() * 1000) + 100} followers
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={isFollowing ? "default" : "outline"}
                          size="sm"
                          onClick={() => (isFollowing ? handleUnfollow(aesthetic) : handleFollow(aesthetic))}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button onClick={() => router.push("/")}>View Personalized Feed</Button>
        </div>
      </div>
    </div>
  )
}
