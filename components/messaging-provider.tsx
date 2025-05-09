"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type Conversation, type Message, type User, getMessagingService } from "@/lib/messaging-service"

interface MessagingContextType {
  connected: boolean
  messages: Message[]
  conversations: Conversation[]
  users: Record<string, User>
  activeConversation: string | null
  setActiveConversation: (id: string | null) => void
  sendMessage: (conversationId: string, recipientId: string, text: string, attachments?: any[]) => void
  markConversationAsRead: (conversationId: string) => void
  createConversation: (recipientId: string) => string
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined)

export function MessagingProvider({
  children,
  userId = "user_1", // Provide a default value to prevent undefined
}: {
  children: ReactNode
  userId?: string
}) {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [users, setUsers] = useState<Record<string, User>>({})
  const [initialized, setInitialized] = useState(false)

  // Use a ref to store the messaging service to avoid recreating it
  const messagingServiceRef = useState(() => getMessagingService())[0]

  useEffect(() => {
    if (initialized || !userId) return

    // Connect to the messaging service
    messagingServiceRef.connect(userId)
    setInitialized(true)

    const connectionListener = messagingServiceRef.on("connectionChange", (isConnected: boolean) => {
      setConnected(isConnected)
    })

    const messageListener = messagingServiceRef.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message])

      // Update conversations
      setConversations((prev) => {
        const conversationIndex = prev.findIndex((c) => c.id === message.conversationId)
        if (conversationIndex >= 0) {
          const updatedConversations = [...prev]
          const conversation = { ...updatedConversations[conversationIndex] }
          conversation.lastMessage = message
          conversation.updatedAt = message.timestamp

          // Increment unread count if the message is not from the current user
          if (message.senderId !== userId) {
            conversation.unreadCount += 1
          }

          updatedConversations[conversationIndex] = conversation
          return updatedConversations
        }
        return prev
      })
    })

    // Load messages and conversations from localStorage
    const loadStoredData = async () => {
      try {
        // Get messages from localStorage
        const storedMessages = localStorage.getItem("stylerent_messages")
        const messages = storedMessages ? JSON.parse(storedMessages) : []

        // Filter messages for this user
        const userMessages = messages.filter((msg: Message) => msg.senderId === userId || msg.recipientId === userId)

        setMessages(userMessages)

        // Get conversations from localStorage
        const storedConversations = localStorage.getItem("stylerent_conversations")
        const conversations = storedConversations ? JSON.parse(storedConversations) : []

        // Filter conversations for this user
        const userConversations = conversations.filter((conv: Conversation) => conv.participants.includes(userId))

        setConversations(userConversations)

        // Get user data
        const storedUsers = localStorage.getItem("stylerent_users")
        if (storedUsers) {
          const allUsers = JSON.parse(storedUsers)
          const usersMap: Record<string, User> = {}

          allUsers.forEach((user: any) => {
            usersMap[user.id] = {
              id: user.id,
              name: user.name,
              avatar: user.avatar,
              online: true, // Default to online for demo
            }
          })

          // Add current user
          usersMap[userId] = {
            id: userId,
            name: "Current User", // This would come from auth in a real app
            online: true,
          }

          setUsers(usersMap)
        }
      } catch (error) {
        console.error("Failed to load stored data:", error)
      }
    }

    loadStoredData()

    // Listen for storage events
    const handleMessagesUpdated = () => {
      try {
        const storedMessages = localStorage.getItem("stylerent_messages")
        if (storedMessages) {
          const messages = JSON.parse(storedMessages)
          const userMessages = messages.filter((msg: Message) => msg.senderId === userId || msg.recipientId === userId)
          setMessages(userMessages)
        }
      } catch (error) {
        console.error("Error handling messages update:", error)
      }
    }

    const handleConversationsUpdated = () => {
      try {
        const storedConversations = localStorage.getItem("stylerent_conversations")
        if (storedConversations) {
          const conversations = JSON.parse(storedConversations)
          const userConversations = conversations.filter((conv: Conversation) => conv.participants.includes(userId))
          setConversations(userConversations)
        }
      } catch (error) {
        console.error("Error handling conversations update:", error)
      }
    }

    window.addEventListener("stylerent-messages-updated", handleMessagesUpdated)
    window.addEventListener("stylerent-conversations-updated", handleConversationsUpdated)

    return () => {
      connectionListener()
      messageListener()
      window.removeEventListener("stylerent-messages-updated", handleMessagesUpdated)
      window.removeEventListener("stylerent-conversations-updated", handleConversationsUpdated)
    }
  }, [userId, initialized, messagingServiceRef])

  const sendMessage = (conversationId: string, recipientId: string, text: string, attachments?: any[]) => {
    messagingServiceRef.sendMessage(conversationId, recipientId, text, attachments)
  }

  const markConversationAsRead = (conversationId: string) => {
    messagingServiceRef.markAsRead(conversationId)

    // Update local state
    setConversations((prev) => {
      return prev.map((conv) => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 }
        }
        return conv
      })
    })
  }

  // Add a function to create a new conversation
  const createConversation = (recipientId: string) => {
    // Check if a conversation already exists with this recipient
    const existingConversation = conversations.find(
      (conv) => conv.participants.includes(userId) && conv.participants.includes(recipientId),
    )

    if (existingConversation) {
      return existingConversation.id
    }

    // Create a new conversation ID
    const newConversationId = `conv_${Date.now()}_${Math.floor(Math.random() * 1000)}`

    // Add the new conversation to state
    const newConversation: Conversation = {
      id: newConversationId,
      participants: [userId, recipientId],
      unreadCount: 0,
      updatedAt: Date.now(),
    }

    setConversations((prev) => [...prev, newConversation])

    return newConversationId
  }

  const value = {
    connected,
    messages,
    conversations,
    users,
    activeConversation,
    setActiveConversation,
    sendMessage,
    markConversationAsRead,
    createConversation,
  }

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>
}

export function useMessaging() {
  const context = useContext(MessagingContext)

  if (context === undefined) {
    // If we're outside the provider, return a minimal implementation
    // that doesn't cause infinite loops
    return {
      connected: false,
      messages: [],
      conversations: [],
      users: {},
      activeConversation: null,
      setActiveConversation: () => {},
      sendMessage: () => {},
      markConversationAsRead: () => {},
      createConversation: () => "",
    }
  }

  return context
}
