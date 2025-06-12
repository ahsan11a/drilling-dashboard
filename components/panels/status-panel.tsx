"use client"

import { useState } from "react"
import { useDashboard } from "@/components/dashboard-provider"
import { InfoIcon, AnvilIcon as Valve, Gauge, Thermometer } from "lucide-react"

export function StatusPanel() {
  const { monitoringData, focusedPanel, setFocusedPanel, addNotification } = useDashboard()
  const [blinking, setBlinking] = useState(true)

  const toggleFocus = () => {
    if (focusedPanel === "status") {
      setFocusedPanel(null)
    } else {
      setFocusedPanel("status")
    }
  }

  const toggleBlinking = () => {
    setBlinking(!blinking)
    addNotification("info", "System", "screen", `Blinking screen ${!blinking ? "started" : "stopped"}`)
  }

  const handleControlAction = (category: string, action: string) => {
    addNotification("info", "Controls", action, `${category} action selected: ${action}`)
  }

  return (
    <div
      className={`bg-panel-bg border border-border-color rounded-lg flex flex-col relative overflow-hidden shadow-md transition-all min-h-[200px] w-full panel status-panel col-start-1 col-end-3 row-start-3 ${focusedPanel === "status" ? "z-10 shadow-lg bg-panel-bg-focus border-border-focus focused" : ""}`}
      onDoubleClick={toggleFocus}
    >
      <div className="p-2.5 border-b border-border-color text-sm flex justify-between relative z-2 bg-black bg-opacity-10 panel-header">
        {/* Blinking Screen */}
        <div
          className="absolute bottom-2.5 right-1.5 w-[35px] h-5 bg-panel-bg border border-border-color rounded overflow-hidden z-10 blink-screen"
          onClick={toggleBlinking}
        >
          <div className={`w-full h-full bg-green opacity-70 blink-screen-inner ${blinking ? "animate-blink" : ""}`} />
        </div>

        <div className="font-bold uppercase flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis panel-title">
          <InfoIcon className="w-3.5 h-3.5 opacity-80" />
          Status
        </div>
        <div className="flex gap-1.5 panel-controls">
          <div
            className="cursor-pointer text-xs opacity-70 transition-opacity hover:opacity-100 p-1.5 min-w-6 min-h-6 flex items-center justify-center panel-control"
            title="Maximize"
            onClick={(e) => {
              e.stopPropagation()
              toggleFocus()
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-1 status-panel-content">
        {/* Left side: Chokes */}
        <div className="flex-1 p-2.5 flex flex-col border-r border-border-color status-left-panel">
          <div className="flex justify-between mb-2 text-xs p-1.5 rounded bg-highlight-color status-item">
            <div className="text-text-dim flex items-center gap-1.5 status-label">
              <Valve className="w-2.5 h-2.5" />
              Choke A:
            </div>
            <div className="font-bold status-value">{monitoringData.choke["choke-a"].value.toFixed(1)}%</div>
          </div>

          <div className="flex justify-between mb-2 text-xs p-1.5 rounded bg-highlight-color status-item">
            <div className="text-text-dim flex items-center gap-1.5 status-label">
              <Valve className="w-2.5 h-2.5" />
              Choke B:
            </div>
            <div className="font-bold status-value">{monitoringData.choke["choke-b"].value.toFixed(1)}%</div>
          </div>

          <div className="flex justify-between mb-2 text-xs p-1.5 rounded bg-highlight-color status-item">
            <div className="text-text-dim flex items-center gap-1.5 status-label">
              <Gauge className="w-2.5 h-2.5" />
              Pressure:
            </div>
            <div className="font-bold status-value">
              {monitoringData["standpipe-pressure"]["standpipe-sp"].value.toFixed(1)} psi
            </div>
          </div>

          <div className="flex justify-between mb-2 text-xs p-1.5 rounded bg-highlight-color status-item">
            <div className="text-text-dim flex items-center gap-1.5 status-label">
              <Thermometer className="w-2.5 h-2.5" />
              Temp:
            </div>
            <div className="font-bold status-value">185.4 °F</div>
          </div>
        </div>

        {/* Right side: Controls */}
        <div className="flex-1 p-2.5 flex flex-col status-right-panel">
          <div className="flex flex-col gap-2.5 mt-2.5 control-buttons">
            <ControlDropdown
              id="control"
              label="Control"
              options={["Control 1", "Control 2", "Control 3", "Control 4"]}
              onSelect={(option) => handleControlAction("Control", option)}
            />

            <ControlDropdown
              id="chokes"
              label="Chokes"
              options={["Choke 1", "Choke 2", "Choke 3", "Choke 4"]}
              onSelect={(option) => handleControlAction("Chokes", option)}
            />

            <ControlDropdown
              id="limits"
              label="Limits"
              options={["Limit 1", "Limit 2", "Limit 3", "Limit 4"]}
              onSelect={(option) => handleControlAction("Limits", option)}
            />

            <ControlDropdown
              id="detection"
              label="Detection"
              options={["Detection 1", "Detection 2", "Detection 3", "Detection 4"]}
              onSelect={(option) => handleControlAction("Detection", option)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

type ControlDropdownProps = {
  id: string
  label: string
  options: string[]
  onSelect: (option: string) => void
}

function ControlDropdown({ id, label, options, onSelect }: ControlDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { setCurrentAction } = useDashboard()

  const handleSelect = (option: string) => {
    setIsOpen(false)

    // Store current action
    setCurrentAction({
      action: `${id}-${options.indexOf(option) + 1}`,
      text: option,
      category: label,
    })

    onSelect(option)
  }

  return (
    <div className="relative control-dropdown">
      <button
        className="w-full py-2 px-3 bg-button-bg border border-border-color text-text-light rounded cursor-pointer flex justify-between items-center control-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
        id={`${id}-btn`}
      >
        {label}{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div
            className="absolute top-full left-0 w-full bg-popup-bg border border-border-color rounded shadow-lg z-20 control-dropdown-content show"
            id={`${id}-dropdown`}
          >
            {options.map((option, index) => (
              <div
                key={index}
                className="py-2 px-3 cursor-pointer border-b border-border-color last:border-b-0 hover:bg-button-hover control-dropdown-item"
                data-action={`${id}-${index + 1}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
