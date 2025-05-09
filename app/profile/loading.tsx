export default function Loading() {
  return (
    <div className="container py-10">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin mx-auto mb-4 text-primary border-2 border-current border-t-transparent rounded-full" />
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    </div>
  )
}
