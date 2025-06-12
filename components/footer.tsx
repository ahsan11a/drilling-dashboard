"use client"

import { useDashboard } from "@/components/dashboard-provider"
import { Button } from "@/components/ui/button"
import { Settings, Network, SlidersHorizontal, Wrench, Play, Square } from "lucide-react"

export function Footer() {
  const { simulationRunning, setSimulationRunning, addNotification, panelsVisible } = useDashboard()

  const handleButtonClick = (buttonName: string) => {
    addNotification("info", "System", "button", `${buttonName} button clicked`)
  }

  const startSimulation = () => {
    if (!simulationRunning) {
      setSimulationRunning(true)
      addNotification("info", "System", "simulation", "Simulation started")
    }
  }

  const stopSimulation = () => {
    if (simulationRunning) {
      setSimulationRunning(false)
      addNotification("info", "System", "simulation", "Simulation stopped")
    }
  }

  if (!panelsVisible) return null

  return (
    <div className="bg-footer-bg border-t border-border-color p-2.5 flex justify-between items-center mt-2.5 rounded-b-lg footer">
      <div className="flex gap-2.5 footer-buttons">
        <Button
          variant="outline"
          size="sm"
          className="bg-button-bg border-border-color text-text-light hover:bg-button-hover footer-btn"
          onClick={() => handleButtonClick("Settings")}
        >
          <Settings className="w-3.5 h-3.5 mr-1.5" />
          Settings
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-button-bg border-border-color text-text-light hover:bg-button-hover footer-btn"
          onClick={() => handleButtonClick("Network")}
        >
          <Network className="w-3.5 h-3.5 mr-1.5" />
          Network
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-button-bg border-border-color text-text-light hover:bg-button-hover footer-btn"
          onClick={() => handleButtonClick("Valve Configuration")}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
          Valve Configuration
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-button-bg border-border-color text-text-light hover:bg-button-hover footer-btn"
          onClick={() => handleButtonClick("Equipment")}
        >
          <Wrench className="w-3.5 h-3.5 mr-1.5" />
          Equipment
        </Button>
      </div>

      <div className="flex gap-2.5 simulation-controls">
        <Button
          variant="outline"
          size="sm"
          className="bg-button-bg border-border-color text-text-light hover:bg-button-hover footer-btn"
          onClick={startSimulation}
        >
          <Play className="w-3.5 h-3.5 mr-1.5" />
          Start
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-button-bg border-border-color text-text-light hover:bg-button-hover footer-btn"
          onClick={stopSimulation}
        >
          <Square className="w-3.5 h-3.5 mr-1.5" />
          Stop
        </Button>
      </div>
    </div>
  )
}
