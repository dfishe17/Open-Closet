import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ status: "ok", message: "Listings API endpoint is working" })
}
