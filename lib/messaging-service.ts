"use client"

import { useEffect, useState } from "react"

// Types for our messaging system
export interface Message {
  id: string
  conversationId: string
  senderId: string
  recipientId: string
  text: string
  timestamp: number
  read: boolean
  attachments?: {
    type: "image" | "video"
    url: string
    thumbnailUrl?: string
  }[]
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: number
}

export interface User {
  id: string
  name: string
  avatar?: string
  online: boolean
  lastActive?: string
}

// Mock WebSocket connection
class MockWebSocket {
  private callbacks: Record<string, Function[]> = {}
  private connected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 2000

  constructor(private url: string) {
    this.connect()
  }

  private connect() {
    // Simulate connection delay
    setTimeout(() => {
      this.connected = true
      this.trigger("open", {})
      console.log(`[WebSocket] Connected to ${this.url}`)
      this.reconnectAttempts = 0
    }, 500)
  }

  public send(data: any) {
    if (!this.connected) {
      console.error("[WebSocket] Cannot send message, not connected")
      return
    }

    // Simulate server processing
    setTimeout(() => {
      // Echo back the message with a server-generated ID
      try {
        const message = JSON.parse(data)
        if (message.type === "message") {
          this.trigger("message", {
            data: JSON.stringify({
              ...message.data,
              id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              timestamp: Date.now(),
            }),
          })
        }
      } catch (error) {
        console.error("[WebSocket] Error processing message:", error)
      }
    }, 300)
  }

  public close() {
    this.connected = false
    this.trigger("close", {})
    console.log("[WebSocket] Connection closed")
  }

  public on(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
    return () => {
      if (this.callbacks[event]) {
        this.callbacks[event] = this.callbacks[event].filter((cb) => cb !== callback)
      }
    }
  }

  private trigger(event: string, data: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach((callback) => callback(data))
    }
  }
}

// Real-time messaging service
export class MessagingService {
  private socket: MockWebSocket | null = null
  private listeners: Record<string, Function[]> = {}
  private connected = false
  private userId: string | null = null

  constructor() {
    // In a real app, this would connect to your WebSocket server
    this.socket = new MockWebSocket("wss://api.stylerent.example/messaging")

    this.socket.on("open", () => {
      this.connected = true
      this.emit("connectionChange", true)
    })

    this.socket.on("close", () => {
      this.connected = false
      this.emit("connectionChange", false)
    })

    this.socket.on("message", (event: any) => {
      try {
        const data = JSON.parse(event.data)
        this.emit("message", data)

        // Store message in localStorage
        this.storeMessage(data)
      } catch (error) {
        console.error("[MessagingService] Error parsing message:", error)
      }
    })
  }

  public connect(userId: string) {
    this.userId = userId
    if (this.socket && this.connected) {
      this.socket.send(
        JSON.stringify({
          type: "connect",
          userId,
        }),
      )
    }
  }

  public sendMessage(conversationId: string, recipientId: string, text: string, attachments?: any[]) {
    if (!this.socket || !this.connected || !this.userId) {
      console.error("Cannot send message: not connected")
      return
    }

    const message = {
      conversationId,
      senderId: this.userId,
      recipientId,
      text,
      attachments,
      timestamp: Date.now(),
      read: false,
    }

    // Store message in localStorage first
    this.storeMessage(message)

    this.socket.send(
      JSON.stringify({
        type: "message",
        data: message,
      }),
    )
  }

  private storeMessage(message: any) {
    try {
      // Ensure message has an ID
      if (!message.id) {
        message.id = `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      }

      // Get existing messages
      const storedMessages = localStorage.getItem("stylerent_messages")
      const messages = storedMessages ? JSON.parse(storedMessages) : []

      // Add new message
      messages.push(message)

      // Save back to localStorage
      localStorage.setItem("stylerent_messages", JSON.stringify(messages))

      // Update conversations
      this.updateConversation(message)

      // Dispatch event
      window.dispatchEvent(
        new CustomEvent("stylerent-messages-updated", {
          detail: { message },
        }),
      )
    } catch (error) {
      console.error("Error storing message:", error)
    }
  }

  private updateConversation(message: Message) {
    try {
      // Get existing conversations
      const storedConversations = localStorage.getItem("stylerent_conversations")
      const conversations = storedConversations ? JSON.parse(storedConversations) : []

      // Find conversation
      let conversation = conversations.find((c: Conversation) => c.id === message.conversationId)

      if (!conversation) {
        // Create new conversation
        conversation = {
          id: message.conversationId,
          participants: [message.senderId, message.recipientId],
          unreadCount: message.senderId !== this.userId ? 1 : 0,
          updatedAt: message.timestamp,
          lastMessage: message,
        }
        conversations.push(conversation)
      } else {
        // Update existing conversation
        conversation.lastMessage = message
        conversation.updatedAt = message.timestamp

        // Increment unread count if the message is not from the current user
        if (message.senderId !== this.userId) {
          conversation.unreadCount = (conversation.unreadCount || 0) + 1
        }
      }

      // Save back to localStorage
      localStorage.setItem("stylerent_conversations", JSON.stringify(conversations))

      // Dispatch event
      window.dispatchEvent(
        new CustomEvent("stylerent-conversations-updated", {
          detail: { conversation },
        }),
      )
    } catch (error) {
      console.error("Error updating conversation:", error)
    }
  }

  public markAsRead(conversationId: string) {
    if (!this.socket || !this.connected || !this.userId) {
      console.error("Cannot mark as read: not connected")
      return
    }

    this.socket.send(
      JSON.stringify({
        type: "markAsRead",
        data: {
          conversationId,
          userId: this.userId,
        },
      }),
    )

    // Update messages in localStorage
    try {
      const storedMessages = localStorage.getItem("stylerent_messages")
      if (storedMessages) {
        const messages = JSON.parse(storedMessages)
        const updatedMessages = messages.map((msg: Message) => {
          if (msg.conversationId === conversationId && msg.recipientId === this.userId) {
            return { ...msg, read: true }
          }
          return msg
        })

        localStorage.setItem("stylerent_messages", JSON.stringify(updatedMessages))
      }

      // Update conversation unread count
      const storedConversations = localStorage.getItem("stylerent_conversations")
      if (storedConversations) {
        const conversations = JSON.parse(storedConversations)
        const updatedConversations = conversations.map((conv: Conversation) => {
          if (conv.id === conversationId) {
            return { ...conv, unreadCount: 0 }
          }
          return conv
        })

        localStorage.setItem("stylerent_conversations", JSON.stringify(updatedConversations))

        // Dispatch event
        window.dispatchEvent(new CustomEvent("stylerent-conversations-updated"))
      }
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  }

  public on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
    return () => {
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
      }
    }
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data))
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close()
    }
  }
}

// Get messages from localStorage
export const getMessages = (): Message[] => {
  try {
    const messagesJson = localStorage.getItem("stylerent_messages")
    return messagesJson ? JSON.parse(messagesJson) : []
  } catch (error) {
    console.error("Error getting messages:", error)
    return []
  }
}

// Get conversations from localStorage
export const getConversations = (): Conversation[] => {
  try {
    const conversationsJson = localStorage.getItem("stylerent_conversations")
    return conversationsJson ? JSON.parse(conversationsJson) : []
  } catch (error) {
    console.error("Error getting conversations:", error)
    return []
  }
}

// Get messages for a specific conversation
export const getConversationMessages = (conversationId: string): Message[] => {
  try {
    const messages = getMessages()
    return messages
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => a.timestamp - b.timestamp)
  } catch (error) {
    console.error("Error getting conversation messages:", error)
    return []
  }
}

// Create a new conversation
export const createConversation = (userId: string, recipientId: string): string => {
  try {
    // Check if conversation already exists
    const conversations = getConversations()
    const existingConversation = conversations.find(
      (conv) => conv.participants.includes(userId) && conv.participants.includes(recipientId),
    )

    if (existingConversation) {
      return existingConversation.id
    }

    // Create new conversation
    const conversationId = `conv_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    const newConversation: Conversation = {
      id: conversationId,
      participants: [userId, recipientId],
      unreadCount: 0,
      updatedAt: Date.now(),
    }

    // Save to localStorage
    const updatedConversations = [...conversations, newConversation]
    localStorage.setItem("stylerent_conversations", JSON.stringify(updatedConversations))

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("stylerent-conversations-updated", {
        detail: { conversation: newConversation },
      }),
    )

    return conversationId
  } catch (error) {
    console.error("Error creating conversation:", error)
    return `conv_${Date.now()}`
  }
}

// Singleton instance
let messagingServiceInstance: MessagingService | null = null

export function getMessagingService() {
  if (!messagingServiceInstance) {
    messagingServiceInstance = new MessagingService()
  }
  return messagingServiceInstance
}

// React hook for using the messaging service
export function useMessaging(userId?: string) {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [users, setUsers] = useState<Record<string, User>>({})
  const [initialized, setInitialized] = useState(false)

  // Use a stable reference to the messaging service
  const messagingService = getMessagingService()

  useEffect(() => {
    if (!userId || initialized) return

    messagingService.connect(userId)
    setInitialized(true)

    const connectionListener = messagingService.on("connectionChange", (isConnected: boolean) => {
      setConnected(isConnected)
    })

    const messageListener = messagingService.on("message", (message: Message) => {
      // Safely add the message to state
      setMessages((prev) => {
        // Check if message already exists to prevent duplicates
        if (prev.some((m) => m.id === message.id)) {
          return prev
        }
        return [...prev, message]
      })

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
            conversation.unreadCount = (conversation.unreadCount || 0) + 1
          }

          updatedConversations[conversationIndex] = conversation
          return updatedConversations
        }
        return prev
      })
    })

    // Load messages from localStorage
    const storedMessages = getMessages()
    if (storedMessages.length > 0) {
      // Filter messages relevant to this user
      const userMessages = storedMessages.filter((msg) => msg.senderId === userId || msg.recipientId === userId)
      setMessages(userMessages)
    }

    // Load conversations from localStorage
    const storedConversations = getConversations()
    if (storedConversations.length > 0) {
      // Filter conversations relevant to this user
      const userConversations = storedConversations.filter((conv) => conv.participants.includes(userId))
      setConversations(userConversations)
    }

    // Listen for storage events
    const handleMessagesUpdated = (e: CustomEvent) => {
      const message = e.detail?.message
      if (message) {
        // Only update if message is relevant to this user
        if (message.senderId === userId || message.recipientId === userId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev
            return [...prev, message]
          })
        }
      } else {
        // Full refresh
        const storedMessages = getMessages()
        const userMessages = storedMessages.filter((msg) => msg.senderId === userId || msg.recipientId === userId)
        setMessages(userMessages)
      }
    }

    const handleConversationsUpdated = (e: CustomEvent) => {
      const conversation = e.detail?.conversation
      if (conversation) {
        // Only update if conversation is relevant to this user
        if (conversation.participants.includes(userId)) {
          setConversations((prev) => {
            const index = prev.findIndex((c) => c.id === conversation.id)
            if (index >= 0) {
              const updated = [...prev]
              updated[index] = conversation
              return updated
            }
            return [...prev, conversation]
          })
        }
      } else {
        // Full refresh
        const storedConversations = getConversations()
        const userConversations = storedConversations.filter((conv) => conv.participants.includes(userId))
        setConversations(userConversations)
      }
    }

    window.addEventListener("stylerent-messages-updated", handleMessagesUpdated as EventListener)
    window.addEventListener("stylerent-conversations-updated", handleConversationsUpdated as EventListener)

    return () => {
      connectionListener()
      messageListener()
      window.removeEventListener("stylerent-messages-updated", handleMessagesUpdated as EventListener)
      window.removeEventListener("stylerent-conversations-updated", handleConversationsUpdated as EventListener)
    }
  }, [userId, initialized, messagingService])

  const sendMessage = (conversationId: string, recipientId: string, text: string, attachments?: any[]) => {
    if (!conversationId || !recipientId || !text) {
      console.error("Missing required parameters for sendMessage")
      return
    }

    messagingService.sendMessage(conversationId, recipientId, text, attachments)
  }

  const markConversationAsRead = (conversationId: string) => {
    if (!conversationId) {
      console.error("Missing conversationId for markConversationAsRead")
      return
    }
    messagingService.markAsRead(conversationId)

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

  const createNewConversation = (recipientId: string) => {
    if (!userId || !recipientId) {
      console.error("Missing required parameters for createNewConversation")
      return ""
    }

    return createConversation(userId, recipientId)
  }

  return {
    connected,
    messages,
    conversations,
    users,
    activeConversation,
    setActiveConversation,
    sendMessage,
    markConversationAsRead,
    createNewConversation,
  }
}
