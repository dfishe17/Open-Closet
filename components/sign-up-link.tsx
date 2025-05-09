"use client"

import { useEffect, useRef } from "react"

export function SignUpLink() {
  const linkRef = useRef<HTMLAnchorElement>(null)

  // Force the link to be a regular HTML link with no JavaScript interference
  useEffect(() => {
    if (linkRef.current) {
      // Ensure the link has the correct href
      linkRef.current.setAttribute("href", "/auth/signup")

      // Add a click handler that forces navigation
      linkRef.current.onclick = (e) => {
        e.preventDefault()
        window.location.href = "/auth/signup"
        return false
      }
    }
  }, [])

  return (
    <a
      ref={linkRef}
      href="/auth/signup"
      className="underline underline-offset-4 hover:text-primary"
      onClick={(e) => {
        e.preventDefault()
        window.location.href = "/auth/signup"
      }}
    >
      Sign up
    </a>
  )
}
