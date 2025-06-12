"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useDashboard } from "@/components/dashboard-provider"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Moon, Sun, FileOutputIcon as FileExport, Bell, BellOff, DrillIcon as OilWell } from "lucide-react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { alertsEnabled, setAlertsEnabled, addNotification } = useDashboard()
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      // Format time as HH:MM:SS
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      const timeString = `${hours}:${minutes}:${seconds}`

      // Format date as MM/DD/YYYY
      const month = (now.getMonth() + 1).toString().padStart(2, "0")
      const day = now.getDate().toString().padStart(2, "0")
      const year = now.getFullYear()
      const dateString = `${month}/${day}/${year}`

      setCurrentTime(timeString)
      setCurrentDate(dateString)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    addNotification("info", "System", "system", `Theme changed to ${newTheme} mode.`)
  }

  const exportData = () => {
    addNotification("info", "System", "export", "Data exported successfully.")
  }

  const toggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled)
    addNotification("info", "System", "alerts", `Alerts ${!alertsEnabled ? "enabled" : "disabled"}.`)
  }

  return (
    <header className="flex flex-col bg-panel-bg p-4 border-b border-border-color mb-2.5 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2.5 header-top">
        <div className="flex items-center text-red font-bold logo">
          <OilWell className="mr-2 h-[18px] w-[18px]" />
          <span>
            DrillPro<sup>TM</sup>
          </span>
        </div>
        <div className="text-base text-text-dim font-medium title">Professional Drilling Monitoring Dashboard</div>
        <div className="flex items-center gap-4 header-right">
          <div className="flex flex-col items-end text-xs time-display-mini">
            <div className="text-sm font-bold text-blue current-time-mini">{currentTime}</div>
            <div className="text-[10px] text-text-dim current-date-mini">{currentDate}</div>
          </div>
          <div className="flex items-center gap-2.5 controls">
            <Button
              variant="outline"
              size="sm"
              className="h-9 bg-button-bg border-border-color text-text-light hover:bg-button-hover transition-all"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-yellow mr-1.5" />
              ) : (
                <Sun className="h-4 w-4 text-yellow mr-1.5" />
              )}
              <span className="hidden sm:inline">Theme</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 bg-button-bg border-border-color text-text-light hover:bg-button-hover transition-all"
              onClick={exportData}
            >
              <FileExport className="h-4 w-4 text-green mr-1.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 bg-button-bg border-border-color text-text-light hover:bg-button-hover transition-all"
              onClick={toggleAlerts}
            >
              {alertsEnabled ? (
                <Bell className="h-4 w-4 text-red mr-1.5" />
              ) : (
                <BellOff className="h-4 w-4 text-red mr-1.5" />
              )}
              <span className="hidden sm:inline">Alerts</span>
            </Button>
          </div>
        </div>
      </div>

      <Navbar />
    </header>
  )
}
