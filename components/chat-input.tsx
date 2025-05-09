"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import { Paperclip, Send, Smile, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatInputProps {
  onSendMessage: (text: string, attachments?: any[]) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSendMessage, disabled = false, placeholder = "Type a message..." }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<{ file: File; preview: string; type: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (message.trim() || attachments.length > 0) {
      const attachmentData = attachments.map((attachment) => ({
        type: attachment.type.startsWith("image/") ? "image" : "video",
        url: attachment.preview,
        // In a real app, you would upload the file and get a URL from your server
      }))

      onSendMessage(message, attachmentData.length > 0 ? attachmentData : undefined)
      setMessage("")
      setAttachments([])
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newAttachments: { file: File; preview: string; type: string }[] = []

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const preview = URL.createObjectURL(file)
        newAttachments.push({ file, preview, type: file.type })
      }
    })

    setAttachments((prev) => [...prev, ...newAttachments])

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const newAttachments = [...prev]
      URL.revokeObjectURL(newAttachments[index].preview)
      newAttachments.splice(index, 1)
      return newAttachments
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {attachments.length > 0 && (
        <div className="p-2 border-t flex gap-2 overflow-x-auto">
          {attachments.map((attachment, index) => (
            <div key={index} className="relative h-16 w-16 flex-shrink-0">
              {attachment.type.startsWith("image/") ? (
                <img
                  src={attachment.preview || "/placeholder.svg"}
                  alt={`Attachment ${index}`}
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted rounded-md">
                  <span className="text-xs text-center">Video</span>
                </div>
              )}
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="h-5 w-5 absolute -top-2 -right-2 rounded-full p-0"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 p-2 border-t">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Attach files</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach photos or videos</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          disabled={disabled}
        />

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder=""
          className="flex-1"
          disabled={disabled}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full" disabled={disabled}>
                <Smile className="h-5 w-5" />
                <span className="sr-only">Add emoji</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add emoji</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                className="h-9 w-9 rounded-full"
                disabled={disabled || (message.trim() === "" && attachments.length === 0)}
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </form>
  )
}
