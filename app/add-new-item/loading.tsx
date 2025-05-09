export default function Loading() {
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="space-y-8">
          <div className="p-6 border rounded-lg shadow-sm">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-24 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg shadow-sm">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
