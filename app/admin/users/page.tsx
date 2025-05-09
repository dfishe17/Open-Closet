"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Users,
  Search,
  Filter,
  UserPlus,
  MessageSquare,
  Settings,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Shield,
  Ban,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load all users
    const loadUsers = () => {
      try {
        setLoading(true)
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
          const storedUser = localStorage.getItem("stylerent_user")
          if (storedUser) {
            const currentUser = JSON.parse(storedUser)
            if (!users.some((user) => user.id === currentUser.id)) {
              users.push(currentUser)
            }
          }

          // Save to localStorage for persistence
          localStorage.setItem("stylerent_users", JSON.stringify(users))
        }

        setUsers(users)
      } catch (error) {
        console.error("Error loading users:", error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    loadUsers()

    // Set up event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "stylerent_users" || e.key === "stylerent_user") {
        loadUsers()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((user) => user.id))
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteUser = (userId: string) => {
    try {
      // Remove from selected users
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))

      // Remove from users list
      const updatedUsers = users.filter((user) => user.id !== userId)
      setUsers(updatedUsers)

      // Update localStorage
      localStorage.setItem("stylerent_users", JSON.stringify(updatedUsers))

      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBulkDelete = () => {
    try {
      // Remove selected users
      const updatedUsers = users.filter((user) => !selectedUsers.includes(user.id))
      setUsers(updatedUsers)

      // Update localStorage
      localStorage.setItem("stylerent_users", JSON.stringify(updatedUsers))

      toast({
        title: "Users deleted",
        description: `${selectedUsers.length} users have been successfully deleted.`,
      })

      // Clear selection
      setSelectedUsers([])
    } catch (error) {
      console.error("Error deleting users:", error)
      toast({
        title: "Error",
        description: "Failed to delete users. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage and monitor platform users</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Users</CardTitle>
              <Badge variant="outline">{users.length}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>All Users</DropdownMenuItem>
                  <DropdownMenuItem>Renters</DropdownMenuItem>
                  <DropdownMenuItem>Lenders</DropdownMenuItem>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Inactive</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Recently Joined</DropdownMenuItem>
                  <DropdownMenuItem>Oldest First</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedUsers.length > 0 && (
            <div className="bg-muted p-2 rounded-md mb-4 flex items-center justify-between">
              <span className="text-sm">{selectedUsers.length} users selected</span>
              <div className="flex space-x-2">
                <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Message to Users</DialogTitle>
                      <DialogDescription>Send a message to {selectedUsers.length} selected users.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="Message subject" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Type your message here..." className="min-h-[100px]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message-type">Message Type</Label>
                        <Select defaultValue="notification">
                          <SelectTrigger>
                            <SelectValue placeholder="Select message type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="notification">Notification</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          // In a real app, this would send the message
                          setMessageDialogOpen(false)
                          toast({
                            title: "Message sent",
                            description: `Message sent to ${selectedUsers.length} users.`,
                          })
                          setSelectedUsers([])
                        }}
                      >
                        Send Message
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="outline">
                  <Ban className="mr-2 h-4 w-4" />
                  Suspend
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading users...</p>
            </div>
          ) : (
            <>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No users found</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 border-b px-4 py-3 font-medium">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedUsers.length === users.length}
                        onChange={selectAllUsers}
                      />
                      <span className="ml-3">User</span>
                    </div>
                    <div>Email</div>
                    <div>Type</div>
                    <div>Status</div>
                    <div>Joined</div>
                    <div>Activity</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="grid grid-cols-7 items-center px-4 py-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                          />
                          <div className="flex items-center ml-3">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{user.name}</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
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
                        <div className="text-sm text-muted-foreground">Last active 2h ago</div>
                        <div className="flex justify-end space-x-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                Call
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Shield className="mr-2 h-4 w-4" />
                                Make Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend Account
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={filteredUsers.length < users.length}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
