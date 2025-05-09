import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "List Item API Route is working" })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    return NextResponse.json({
      message: "Item created successfully",
      item: data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error creating item",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
