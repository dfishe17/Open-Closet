"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Check, CheckCheck, Play } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Message, User } from "@/lib/messaging-service"

interface ChatMessageProps {
  message: Message
  sender: User
  isCurrentUser: boolean
  showAvatar?: boolean
}

export function ChatMessage({ message, sender, isCurrentUser, showAvatar = true }: ChatMessageProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")

  // Safely check for attachments
  const hasAttachments = message.attachments && message.attachments.length > 0

  // Format timestamp safely
  const formattedTime = message.timestamp ? format(new Date(message.timestamp), "h:mm a") : format(new Date(), "h:mm a")

  const handleImageClick = (url: string) => {
    setSelectedImage(url)
    setImageModalOpen(true)
  }

  return (
    <div className={`flex items-start gap-2 max-w-[85%] ${isCurrentUser ? "ml-auto flex-row-reverse" : ""}`}>
      {showAvatar && !isCurrentUser ? (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={sender?.avatar} alt={sender?.name || "User"} />
          <AvatarFallback>{(sender?.name || "U").charAt(0)}</AvatarFallback>
        </Avatar>
      ) : null}

      <div className="flex flex-col gap-1">
        <div className={`p-3 rounded-lg ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>

          {hasAttachments && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="relative rounded-md overflow-hidden">
                  {attachment.type === "image" ? (
                    <button onClick={() => handleImageClick(attachment.url)} className="w-full h-full">
                      <img
                        src={attachment.url || "/placeholder.svg"}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                    </button>
                  ) : attachment.type === "video" ? (
                    <div className="relative">
                      <img
                        src={attachment.thumbnailUrl || "/placeholder.svg?height=128&width=128&text=Video"}
                        alt={`Video thumbnail ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute inset-0 m-auto bg-black/50 hover:bg-black/70 h-10 w-10 rounded-full"
                      >
                        <Play className="h-5 w-5 text-white" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`flex items-center text-xs text-muted-foreground ${isCurrentUser ? "justify-end" : ""}`}>
          <span>{formattedTime}</span>
          {isCurrentUser && (
            <span className="ml-1 flex items-center">
              {message.read ? <CheckCheck className="h-3 w-3 ml-1" /> : <Check className="h-3 w-3 ml-1" />}
            </span>
          )}
        </div>
      </div>

      {showAvatar && isCurrentUser ? (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={sender?.avatar} alt={sender?.name || "User"} />
          <AvatarFallback>{(sender?.name || "U").charAt(0)}</AvatarFallback>
        </Avatar>
      ) : null}

      {/* Image Modal */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Enlarged attachment"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <Button variant="secondary" className="absolute top-2 right-2" onClick={() => setImageModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
