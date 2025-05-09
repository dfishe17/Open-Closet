export default function ListingsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Listings</h1>
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded w-full"></div>
        <div className="h-64 bg-muted rounded w-full"></div>
        <div className="h-64 bg-muted rounded w-full"></div>
      </div>
    </div>
  )
}
