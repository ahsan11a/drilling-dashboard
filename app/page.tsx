"use client"

import { useEffect, useState } from "react"
import { Dashboard } from "@/components/dashboard"
import { DashboardProvider } from "@/components/dashboard-provider"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  )
}
