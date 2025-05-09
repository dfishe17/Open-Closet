import Link from "next/link"

export default function AddItemNewPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Item</h1>
      <p className="mb-4">Use this page to add a new item to your collection.</p>
      <Link href="/profile" className="text-blue-600 hover:underline">
        Return to Profile
      </Link>
    </div>
  )
}
