export default function TestPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Test Page</h1>
      <p>This is a test page to see if new routes are working correctly.</p>
      <div className="mt-4">
        <a href="/profile/seller" className="text-blue-500 underline">
          Back to Profile
        </a>
      </div>
    </div>
  )
}
