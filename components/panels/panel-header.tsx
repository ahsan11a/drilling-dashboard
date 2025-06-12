"use client"

import type React from "react"
import { useDashboard } from "@/components/dashboard-provider"
import { Expand, Settings } from "lucide-react"

type PanelHeaderProps = {
  title: string
  icon: React.ReactNode
  onExpand: () => void
  panelType?: string
}

export function PanelHeader({ title, icon, onExpand, panelType }: PanelHeaderProps) {
  const { setCurrentPanelForColorPicker } = useDashboard()

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (panelType) {
      setCurrentPanelForColorPicker(panelType)
    }
  }

  return (
    <div className="p-2.5 border-b border-border-color text-sm flex justify-between relative z-2 bg-black bg-opacity-10 panel-header">
      <div className="font-bold uppercase flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis panel-title">
        {icon}
        {title}
      </div>
      <div className="flex gap-1.5 panel-controls">
        <div
          className="cursor-pointer text-xs opacity-70 transition-opacity hover:opacity-100 p-1.5 min-w-6 min-h-6 flex items-center justify-center panel-control"
          title="Maximize"
          onClick={(e) => {
            e.stopPropagation()
            onExpand()
          }}
        >
          <Expand className="w-3 h-3" />
        </div>
        {panelType && (
          <div
            className="cursor-pointer text-xs opacity-70 transition-opacity hover:opacity-100 p-1.5 min-w-6 min-h-6 flex items-center justify-center panel-control panel-settings"
            title="Settings"
            data-panel={panelType}
            onClick={handleSettingsClick}
          >
            <Settings className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  )
}
