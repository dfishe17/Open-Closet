"use client"

import Link from "next/link"

export function SignInLink() {
  return (
    <Link href="/auth/signin" className="underline underline-offset-4 hover:text-primary">
      Sign in
    </Link>
  )
}
