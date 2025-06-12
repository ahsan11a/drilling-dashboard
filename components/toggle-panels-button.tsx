"use client"

import { useDashboard } from "@/components/dashboard-provider"
import { EyeOff, Eye } from "lucide-react"

export function TogglePanelsButton() {
  const { panelsVisible, setPanelsVisible } = useDashboard()

  const togglePanels = () => {
    setPanelsVisible(!panelsVisible)
  }

  return (
    <button
      className={`fixed top-5 right-5 bg-button-bg border border-border-color text-text-light p-2.5 rounded cursor-pointer z-[1000] flex items-center justify-center hover:bg-button-hover toggle-panels-btn ${!panelsVisible ? "bottom-5 top-auto show" : ""}`}
      onClick={togglePanels}
    >
      {panelsVisible ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
    </button>
  )
}
