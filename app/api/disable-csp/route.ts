import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  // Set a cookie to disable CSP in middleware
  cookies().set("disable_csp", "true", {
    maxAge: 3600, // 1 hour
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })

  return NextResponse.json({
    success: true,
    message: "CSP disabled for troubleshooting",
  })
}
