import { notFound } from "next/navigation"

async function getItem(id: string) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`)
    if (!res.ok) {
      return undefined
    }
    return await res.json()
  } catch (error) {
    return undefined
  }
}

export default async function ItemPage({ params }: { params: { id: string } }) {
  const item = await getItem(params.id)

  if (!item) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{item.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-auto rounded-lg" />
        <div>
          <p className="text-gray-600">{item.description}</p>
          <p className="text-lg font-semibold mt-2">Price: ${item.price}</p>
          <p className="text-sm text-gray-500">Category: {item.category}</p>
        </div>
      </div>
    </div>
  )
}
