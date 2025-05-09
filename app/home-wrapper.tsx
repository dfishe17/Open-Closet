"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import HomeFallback from "./home-fallback"

// Dynamically import the client component
const HomeClient = dynamic(() => import("./home-client"), {
  loading: () => <HomeFallback />,
})

export default function HomeWrapper() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeClient />
    </Suspense>
  )
}
