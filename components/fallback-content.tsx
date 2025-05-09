import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface FallbackContentProps {
  title: string
  message: string
  actionText?: string
  actionLink?: string
}

export function FallbackContent({ title, message, actionText, actionLink }: FallbackContentProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8 text-yellow-600" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {actionText && actionLink && (
        <Button asChild>
          <Link href={actionLink}>{actionText}</Link>
        </Button>
      )}
    </div>
  )
}
