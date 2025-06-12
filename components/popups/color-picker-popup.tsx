"use client"

import { useState } from "react"
import { useDashboard } from "@/components/dashboard-provider"
import { Button } from "@/components/ui/button"

const colorOptions = [
  { name: "blue", color: "rgba(51, 153, 255, 0.8)" },
  { name: "green", color: "rgba(51, 204, 51, 0.8)" },
  { name: "red", color: "rgba(255, 51, 51, 0.8)" },
  { name: "purple", color: "rgba(153, 102, 255, 0.8)" },
  { name: "orange", color: "rgba(255, 153, 0, 0.8)" },
]

export function ColorPickerPopup() {
  const { currentPanelForColorPicker, setCurrentPanelForColorPicker, selectedColor, setSelectedColor } = useDashboard()
  const [tempSelectedColor, setTempSelectedColor] = useState<string | null>(null)

  const handleColorSelect = (colorName: string) => {
    setTempSelectedColor(colorName)
  }

  const handleApply = () => {
    if (tempSelectedColor && currentPanelForColorPicker) {
      const colorOption = colorOptions.find((c) => c.name === tempSelectedColor)
      if (colorOption) {
        localStorage.setItem(`grid-color-${currentPanelForColorPicker}`, colorOption.color)
        setSelectedColor(tempSelectedColor)
      }
    }

    setCurrentPanelForColorPicker(null)
    setTempSelectedColor(null)
  }

  const handleCancel = () => {
    setCurrentPanelForColorPicker(null)
    setTempSelectedColor(null)
  }

  if (!currentPanelForColorPicker) return null

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-popup-bg border border-border-color rounded-lg p-5 shadow-lg z-[1000] w-[300px] color-picker-popup show">
      <div className="text-base font-bold mb-4 text-center color-picker-title">Grid Color Settings</div>
      <div className="flex flex-wrap gap-2.5 justify-center mb-5 color-picker-content">
        {colorOptions.map((option) => (
          <div
            key={option.name}
            className={`flex flex-col items-center gap-1.5 cursor-pointer p-1.5 rounded transition-colors hover:bg-button-hover color-option ${tempSelectedColor === option.name ? "bg-button-active selected" : ""}`}
            onClick={() => handleColorSelect(option.name)}
            data-color={option.name}
          >
            <div
              className="w-[30px] h-[30px] rounded-full border border-border-color color-preview"
              style={{ backgroundColor: option.color }}
            />
            <div className="text-xs text-text-dim color-label">
              {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between color-picker-buttons">
        <Button onClick={handleApply} className="bg-green text-white hover:bg-green/90 color-picker-btn apply">
          Apply
        </Button>
        <Button onClick={handleCancel} variant="destructive" className="color-picker-btn cancel">
          Cancel
        </Button>
      </div>
    </div>
  )
}
