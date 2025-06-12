"use client"

import type React from "react"

import { useState } from "react"
import { useDashboard } from "@/components/dashboard-provider"
import { PanelHeader } from "@/components/panels/panel-header"
import { Wrench, PowerIcon as Pump, Fan } from "lucide-react"

export function EquipmentPanel() {
  const { equipmentStatus, focusedPanel, setFocusedPanel } = useDashboard()
  const [sliderValue, setSliderValue] = useState(50)

  const toggleFocus = () => {
    if (focusedPanel === "equipment") {
      setFocusedPanel(null)
    } else {
      setFocusedPanel("equipment")
    }
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number.parseInt(e.target.value))
  }

  const getEquipmentIcon = (equipment: string) => {
    switch (equipment) {
      case "mud-pump-1":
      case "mud-pump-2":
        return <Pump className="w-3 h-3" />
      case "shale-shaker":
        return <Fan className="w-3 h-3" />
      default:
        return <Wrench className="w-3 h-3" />
    }
  }

  return (
    <div
      className={`bg-panel-bg border border-border-color rounded-lg flex flex-col relative overflow-hidden shadow-md transition-all min-h-[200px] w-full panel equipment-panel col-start-3 col-end-5 row-start-3 ${focusedPanel === "equipment" ? "z-10 shadow-lg bg-panel-bg-focus border-border-focus focused" : ""}`}
      onDoubleClick={toggleFocus}
    >
      <PanelHeader title="Pump Status" icon={<Wrench className="w-3.5 h-3.5 opacity-80" />} onExpand={toggleFocus} />

      <div className="flex flex-col h-full">
        {/* Pump Status (Half-size) */}
        <div className="flex-[0.5] overflow-y-auto pump-status-panel">
          <div className="grid grid-cols-3 gap-2 p-2.5 h-full overflow-y-auto equipment-grid">
            {Object.entries(equipmentStatus)
              .slice(0, 3)
              .map(([key, status]) => (
                <div
                  key={key}
                  className="bg-black bg-opacity-10 rounded p-2 flex items-center gap-2 cursor-pointer transition-colors hover:bg-black hover:bg-opacity-20 equipment-item"
                  data-equipment={key}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full bg-panel-bg equipment-icon ${status.status}`}
                  >
                    {getEquipmentIcon(key)}
                  </div>
                  <div className="flex-1 equipment-info">
                    <div className="text-xs font-bold equipment-name">
                      {key
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </div>
                    <div className="text-[11px] text-text-dim equipment-status">
                      {status.status === "active"
                        ? `Running - ${status.efficiency}% efficiency`
                        : `${status.status === "warning" ? "Warning" : "Error"} - ${status.issue}`}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Choke Action Control Panel */}
        <div className="flex-[0.5] border-t border-border-color p-2.5 flex flex-col choke-action-panel">
          <div className="font-bold mb-2.5 text-sm choke-action-title">Choke Action Control</div>
          <div className="flex-1 flex flex-col justify-left items-left choke-action-slider-container">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-[30%] mb-4 choke-action-slider"
              id="flow-control-slider"
            />
            <div className="text-base font-bold text-blue choke-action-value" id="flow-control-value">
              Flow: {sliderValue}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
