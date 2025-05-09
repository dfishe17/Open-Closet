"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Users,
  ShoppingBag,
  Package,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  UserPlus,
  DollarSign,
  Calendar,
  AlertTriangle,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LogoutButton } from "@/components/logout-button"
import { getAllItems } from "@/lib/item-utils"

export default function AdminDashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [allItems, setAllItems] = useState<any[]>([])
  const [allBundles, setAllBundles] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    totalItems: 0,
    totalRentals: 0,
    totalRevenue: 0,
    activeListings: 0,
    pendingReviews: 0,
    openDisputes: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem("stylerent_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUserData(userData)
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    // Load all users
    const loadUsers = () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll create some sample users plus the logged-in user
        const storedUsers = localStorage.getItem("stylerent_users")
        let users = []

        if (storedUsers) {
          users = JSON.parse(storedUsers)
        } else {
          // If no users in storage, create sample data
          users = [
            {
              id: "1",
              name: "Emma Wilson",
              email: "emma@example.com",
              userType: "renter",
              status: "Active",
              memberSince: "Mar 15, 2023",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            {
              id: "2",
              name: "Michael Chen",
              email: "michael@example.com",
              userType: "lender",
              status: "Active",
              memberSince: "Jan 8, 2023",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            {
              id: "3",
              name: "Sarah Johnson",
              email: "sarah@example.com",
              userType: "both",
              status: "Active",
              memberSince: "Nov 22, 2022",
              avatar: "/placeholder.svg?height=40&width=40",
            },
          ]

          // Add the current user if they exist and aren't already in the list
          if (storedUser) {
            const currentUser = JSON.parse(storedUser)
            if (!users.some((user) => user.id === currentUser.id)) {
              users.push(currentUser)
            }
          }

          // Save to localStorage for persistence
          localStorage.setItem("stylerent_users", JSON.stringify(users))
        }

        setAllUsers(users)
        return users
      } catch (error) {
        console.error("Error loading users:", error)
        return []
      }
    }

    // Load all items
    const loadItems = () => {
      try {
        const items = getAllItems()
        setAllItems(items)
        return items
      } catch (error) {
        console.error("Error loading items:", error)
        return []
      }
    }

    // Load all bundles
    const loadBundles = () => {
      try {
        const storedBundles = localStorage.getItem("stylerent_bundles")
        let bundles = []

        if (storedBundles) {
          bundles = JSON.parse(storedBundles)
        }

        setAllBundles(bundles)
        return bundles
      } catch (error) {
        console.error("Error loading bundles:", error)
        return []
      }
    }

    // Load data and calculate statistics
    const users = loadUsers()
    const items = loadItems()
    const bundles = loadBundles()

    // Calculate statistics based on real data
    const calculateStats = () => {
      // Count new users (joined in the last 7 days)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      const newUsersCount = users.filter((user) => {
        // This is a simplification - in a real app, you'd parse the date properly
        return user.memberSince && user.memberSince.includes("2023")
      }).length

      // Count active listings
      const activeListings = items.filter((item) => !item.status || item.status === "Active").length

      // For demo purposes, we'll generate some reasonable numbers for other stats
      const totalRentals = Math.floor(items.length * 0.8) // Assume 80% of items have been rented
      const avgRentalPrice = items.reduce((sum, item) => sum + (item.rentalPrice || 0), 0) / (items.length || 1)
      const totalRevenue = Math.floor(totalRentals * avgRentalPrice * 3) // Assume each rental lasts 3 days on average

      setStats({
        totalUsers: users.length,
        newUsers: newUsersCount,
        totalItems: items.length,
        totalRentals: totalRentals,
        totalRevenue: totalRevenue,
        activeListings: activeListings,
        pendingReviews: Math.floor(totalRentals * 0.1), // Assume 10% of rentals have pending reviews
        openDisputes: Math.floor(totalRentals * 0.02), // Assume 2% of rentals have disputes
      })
    }

    // Generate recent activity based on real data
    const generateRecentActivity = () => {
      const activities = []

      // Add recent user registrations
      users.slice(0, 2).forEach((user) => {
        activities.push({
          type: "user_registered",
          icon: UserPlus,
          text: "New user registered",
          time: "2 days ago",
          user: user.name,
        })
      })

      // Add recent item listings
      items.slice(0, 3).forEach((item, index) => {
        activities.push({
          type: "item_listed",
          icon: ShoppingBag,
          text: "New item listed",
          time: `${index + 1} days ago`,
          user: item.designer || "Unknown Designer",
          details: item.name,
        })
      })

      // Add recent bundle creations
      bundles.slice(0, 2).forEach((bundle, index) => {
        activities.push({
          type: "bundle_created",
          icon: Package,
          text: "New bundle created",
          time: `${index + 3} days ago`,
          user: bundle.ownerName || "Unknown User",
          details: bundle.title,
        })
      })

      // Sort by "time" (this is simplified)
      activities.sort((a, b) => {
        const aTime = Number.parseInt(a.time.split(" ")[0])
        const bTime = Number.parseInt(b.time.split(" ")[0])
        return aTime - bTime
      })

      setRecentActivity(activities.slice(0, 5))
    }

    calculateStats()
    generateRecentActivity()

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      loadUsers()
      loadItems()
      loadBundles()
      calculateStats()
      generateRecentActivity()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Calculate user type distribution
  const userTypeDistribution = {
    renters: (allUsers.filter((user) => user.userType === "renter").length / (allUsers.length || 1)) * 100,
    lenders: (allUsers.filter((user) => user.userType === "lender").length / (allUsers.length || 1)) * 100,
    both: (allUsers.filter((user) => user.userType === "both").length / (allUsers.length || 1)) * 100,
  }

  // Calculate top categories
  const categoryCount = allItems.reduce((acc, item) => {
    const category = item.category || "Uncategorized"
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const topCategories = Object.entries(categoryCount)
    .map(([category, count]) => ({
      category,
      percentage: Math.round(((count as number) / (allItems.length || 1)) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-card border-r">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">StyleRent Admin</h1>
          <p className="text-sm text-muted-foreground">Management Dashboard</p>
        </div>

        <div className="flex-1 py-6 px-4">
          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
            >
              <Users className="mr-3 h-5 w-5" />
              Users
            </Link>
            <Link
              href="/admin/items"
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
            >
              <ShoppingBag className="mr-3 h-5 w-5" />
              Items
            </Link>
            <Link
              href="/admin/bundles"
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
            >
              <Package className="mr-3 h-5 w-5" />
              Bundles
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              Messages
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t">
          {userData && (
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{userData.name}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
          )}
          <LogoutButton className="w-full mt-4 justify-center">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </LogoutButton>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-card border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="w-64 pl-8" />
              </div>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+{stats.newUsers} new users this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeListings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{stats.totalItems.toLocaleString()} total items</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{stats.totalRentals.toLocaleString()} completed rentals</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.openDisputes}</div>
                <p className="text-xs text-muted-foreground">{stats.pendingReviews} pending reviews</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue for the current year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-end justify-between">
                      {/* Simplified chart representation based on item count per month */}
                      {Array.from({ length: 12 }).map((_, i) => {
                        // Generate a height based on the number of items (simplified)
                        const itemsPerMonth =
                          allItems.length > 0
                            ? Math.floor(allItems.length / 12) + (i < allItems.length % 12 ? 1 : 0)
                            : 0
                        const height = itemsPerMonth * 20 + 30 // Scale for visibility

                        return (
                          <div key={i} className="w-full max-w-[30px] mx-auto">
                            <div
                              className="bg-primary/80 rounded-t hover:bg-primary transition-all"
                              style={{ height: `${height}px` }}
                            ></div>
                            <p className="text-xs text-center mt-2 text-muted-foreground">
                              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest platform activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.length > 0 ? (
                        recentActivity.map((activity, i) => (
                          <div key={i} className="flex items-start">
                            <div className="rounded-full bg-primary/10 p-2 mr-3">
                              <activity.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.text}</p>
                              <p className="text-xs text-muted-foreground">
                                {activity.user} • {activity.time}
                              </p>
                              {activity.details && (
                                <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>New user registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">This Week</span>
                        </div>
                        <span className="text-sm font-medium">{stats.newUsers} new users</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>vs last week (estimated)</span>
                        <span className="text-green-500">+{Math.floor(Math.random() * 30 + 20)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Types</CardTitle>
                    <CardDescription>Distribution of user roles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Renters</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(userTypeDistribution.renters)}%
                          </span>
                        </div>
                        <Progress value={userTypeDistribution.renters} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Lenders</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(userTypeDistribution.lenders)}%
                          </span>
                        </div>
                        <Progress value={userTypeDistribution.lenders} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Both</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(userTypeDistribution.both)}%
                          </span>
                        </div>
                        <Progress value={userTypeDistribution.both} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Categories</CardTitle>
                    <CardDescription>Most popular item categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topCategories.length > 0 ? (
                        topCategories.map((item, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{item.category}</span>
                              <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                            </div>
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">No categories found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Newly registered users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {allUsers.length > 0 ? (
                        allUsers.slice(0, 5).map((user, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">
                                {user.userType === "renter" ? "Renter" : user.userType === "lender" ? "Lender" : "Both"}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">{user.memberSince || "Recently"}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">No users found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/admin/users">View All Users</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Items</CardTitle>
                    <CardDescription>Recently listed items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {allItems.length > 0 ? (
                        allItems.slice(0, 5).map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">by {item.designer || "Unknown"}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">${item.rentalPrice}/day</p>
                              <Badge
                                variant={!item.status || item.status === "Active" ? "default" : "outline"}
                                className="mt-1"
                              >
                                {item.status || "Active"}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">No items found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/admin/items">View All Items</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>Detailed platform analytics and statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                      Detailed analytics would be displayed here, including user growth, revenue trends, platform usage
                      statistics, and conversion rates.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage platform users</CardDescription>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/admin/users">
                      <UserPlus className="mr-2 h-4 w-4" />
                      View All Users
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 border-b px-4 py-3 font-medium">
                      <div className="col-span-2">User</div>
                      <div>Type</div>
                      <div>Status</div>
                      <div>Joined</div>
                      <div className="text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      {allUsers.length > 0 ? (
                        allUsers.slice(0, 5).map((user, i) => (
                          <div key={i} className="grid grid-cols-6 items-center px-4 py-3">
                            <div className="col-span-2 flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div>
                              <Badge variant="outline">
                                {user.userType === "renter" ? "Renter" : user.userType === "lender" ? "Lender" : "Both"}
                              </Badge>
                            </div>
                            <div>
                              <Badge
                                variant={user.status === "Active" ? "default" : "secondary"}
                                className={
                                  user.status === "Active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                    : ""
                                }
                              >
                                {user.status || "Active"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">{user.memberSince || "Recently"}</div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4" />
                                <span className="sr-only">Message</span>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <AlertTriangle className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center text-sm text-muted-foreground">No users found</div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {Math.min(5, allUsers.length)} of {allUsers.length} users
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={allUsers.length <= 5}>
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="items">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Item Management</CardTitle>
                    <CardDescription>Manage platform items and listings</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" asChild>
                      <Link href="/admin/items">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        View All Items
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-7 border-b px-4 py-3 font-medium">
                      <div className="col-span-2">Item</div>
                      <div>Owner</div>
                      <div>Price</div>
                      <div>Status</div>
                      <div>Category</div>
                      <div className="text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      {allItems.length > 0 ? (
                        allItems.slice(0, 5).map((item, i) => (
                          <div key={i} className="grid grid-cols-7 items-center px-4 py-3">
                            <div className="col-span-2 flex items-center">
                              <div className="h-10 w-10 rounded bg-muted overflow-hidden mr-3">
                                {item.media && item.media[0] ? (
                                  <img
                                    src={item.media[0].url || "/placeholder.svg"}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                                    <ShoppingBag className="h-5 w-5 text-primary" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">ID: #{item.id.substring(0, 8)}</p>
                              </div>
                            </div>
                            <div className="text-sm">{item.ownerName || "Unknown"}</div>
                            <div className="text-sm font-medium">${item.rentalPrice}/day</div>
                            <div>
                              <Badge
                                variant={!item.status || item.status === "Active" ? "default" : "secondary"}
                                className={
                                  !item.status || item.status === "Active" ? "bg-green-100 text-green-800" : ""
                                }
                              >
                                {item.status || "Active"}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">{item.category || "Uncategorized"}</div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <AlertTriangle className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center text-sm text-muted-foreground">No items found</div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {Math.min(5, allItems.length)} of {allItems.length} items
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={allItems.length <= 5}>
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports & Analytics</CardTitle>
                  <CardDescription>Generate and view platform reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { title: "User Growth Report", description: "Monthly user registration statistics", icon: Users },
                      { title: "Revenue Report", description: "Financial performance and earnings", icon: DollarSign },
                      { title: "Listing Activity", description: "Item listing and rental metrics", icon: ShoppingBag },
                      {
                        title: "User Engagement",
                        description: "Platform usage and interaction data",
                        icon: TrendingUp,
                      },
                      {
                        title: "Dispute Resolution",
                        description: "Issue tracking and resolution times",
                        icon: AlertTriangle,
                      },
                      { title: "Seasonal Trends", description: "Seasonal rental patterns and trends", icon: Calendar },
                    ].map((report, i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{report.title}</CardTitle>
                            <report.icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <CardDescription>{report.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex justify-between items-center">
                            <Button variant="outline" size="sm">
                              Generate
                            </Button>
                            <Button variant="ghost" size="sm">
                              View History <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
