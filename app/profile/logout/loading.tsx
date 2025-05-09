import { Loader2 } from "lucide-react"

export default function LogoutLoading() {
  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Logging you out...</p>
      </div>
    </div>
  )
}
