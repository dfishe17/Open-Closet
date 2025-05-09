"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Info, PaperclipIcon, Phone, Search, Video } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChatInput } from "@/components/chat-input"
import { ChatMessage } from "@/components/chat-message"
import { useMessaging } from "@/components/messaging-provider"
import { MessagingProvider } from "@/components/messaging-provider"

function MessagesContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // In a real app, you would get the current user ID from your auth system
  const currentUserId = "user_1"

  const {
    connected,
    messages,
    conversations,
    users,
    activeConversation,
    setActiveConversation,
    sendMessage,
    markConversationAsRead,
  } = useMessaging()

  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, activeConversation])

  // Mark messages as read when conversation becomes active
  useEffect(() => {
    if (activeConversation) {
      const conversation = conversations.find((c) => c.id === activeConversation)
      if (conversation && conversation.unreadCount > 0) {
        markConversationAsRead(activeConversation)
      }
    }
  }, [activeConversation, conversations, markConversationAsRead])

  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery.trim()) return true

    const otherParticipantId = conversation.participants.find((id) => id !== currentUserId)
    if (!otherParticipantId) return false

    const otherUser = users[otherParticipantId]
    if (!otherUser) return false

    return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const activeConversationData = activeConversation ? conversations.find((c) => c.id === activeConversation) : null

  const otherParticipantId = activeConversationData
    ? activeConversationData.participants.find((id) => id !== currentUserId)
    : null

  const otherUser = otherParticipantId ? users[otherParticipantId] : null

  const conversationMessages = messages.filter((message) => message.conversationId === activeConversation)

  const handleSendMessage = (text: string, attachments?: any[]) => {
    if (!activeConversation || !otherParticipantId) return

    sendMessage(activeConversation, otherParticipantId, text, attachments)
  }

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversation(conversationId)
    markConversationAsRead(conversationId)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-[320px_1fr] h-[calc(100vh-200px)] min-h-[600px]">
            {/* Conversations List */}
            <div className="border-r">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search messages..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-auto h-[calc(100%-73px)]">
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-start gap-4 p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => {
                    const otherParticipantId = conversation.participants.find((id) => id !== currentUserId)
                    if (!otherParticipantId) return null

                    const otherUser = users[otherParticipantId]
                    if (!otherUser) return null

                    // Find the last message for this conversation
                    const lastMessage = messages
                      .filter((m) => m.conversationId === conversation.id)
                      .sort((a, b) => b.timestamp - a.timestamp)[0]

                    return (
                      <div
                        key={conversation.id}
                        className={`flex items-start gap-4 p-4 cursor-pointer hover:bg-muted/50 ${
                          activeConversation === conversation.id ? "bg-muted" : ""
                        }`}
                        onClick={() => handleConversationSelect(conversation.id)}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {otherUser.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{otherUser.name}</p>
                            {lastMessage && (
                              <p className="text-xs text-muted-foreground whitespace-nowrap">
                                {format(new Date(lastMessage.timestamp), "h:mm a")}
                              </p>
                            )}
                          </div>
                          {lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">
                              {lastMessage.senderId === currentUserId ? "You: " : ""}
                              {lastMessage.text}
                              {lastMessage.attachments && lastMessage.attachments.length > 0 && !lastMessage.text && (
                                <span className="flex items-center">
                                  <PaperclipIcon className="h-3 w-3 mr-1" />
                                  {lastMessage.attachments.length} attachment
                                  {lastMessage.attachments.length !== 1 ? "s" : ""}
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge className="ml-auto shrink-0">{conversation.unreadCount}</Badge>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    {searchQuery ? "No conversations match your search" : "No conversations yet"}
                  </div>
                )}
              </div>
            </div>

            {/* Active Conversation */}
            <div className="flex flex-col">
              {activeConversation && otherUser ? (
                <>
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                          <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {otherUser.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{otherUser.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {otherUser.online ? (
                            <span className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span> Online
                            </span>
                          ) : (
                            `Last active ${otherUser.lastActive}`
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                              <Phone className="h-4 w-4" />
                              <span className="sr-only">Call</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Call</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                              <Video className="h-4 w-4" />
                              <span className="sr-only">Video call</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Video call</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Conversation info</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div ref={messagesContainerRef} className="flex-1 overflow-auto p-4 space-y-4">
                    {isLoading ? (
                      // Loading skeletons for messages
                      Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-2 max-w-[80%] ${
                            index % 2 === 0 ? "" : "ml-auto flex-row-reverse"
                          }`}
                        >
                          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                          <div className="space-y-2">
                            <Skeleton
                              className={`h-20 w-64 rounded-lg ${index % 2 === 0 ? "bg-muted/80" : "bg-primary/20"}`}
                            />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      ))
                    ) : conversationMessages.length > 0 ? (
                      <>
                        {conversationMessages.map((message, index) => {
                          const isCurrentUser = message.senderId === currentUserId
                          const sender = users[message.senderId] || {
                            id: message.senderId,
                            name: "Unknown User",
                            online: false,
                          }

                          // Determine if we should show the avatar
                          // Don't show avatar if consecutive messages from same sender
                          const showAvatar =
                            index === 0 || conversationMessages[index - 1].senderId !== message.senderId

                          return (
                            <ChatMessage
                              key={message.id}
                              message={message}
                              sender={sender}
                              isCurrentUser={isCurrentUser}
                              showAvatar={showAvatar}
                            />
                          )
                        })}
                        <div ref={messagesEndRef} />
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation by sending a message</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={!connected}
                    placeholder={connected ? "Type a message..." : "Connecting..."}
                  />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Select a conversation</h3>
                    <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function MessagesPage() {
  // Get the current user ID from localStorage or use a default
  const [userId, setUserId] = useState<string>("user_1")

  useEffect(() => {
    // Try to get the user from localStorage
    const storedUser = localStorage.getItem("stylerent_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        if (userData.id) {
          setUserId(userData.id)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  return (
    <MessagingProvider userId={userId}>
      <MessagesContent />
    </MessagingProvider>
  )
}
