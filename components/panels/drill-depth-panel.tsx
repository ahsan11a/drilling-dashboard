"use client"

import { useEffect, useRef } from "react"
import { useDashboard } from "@/components/dashboard-provider"
import { PanelHeader } from "@/components/panels/panel-header"
import { RulerIcon as RulerVertical } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function DrillDepthPanel() {
  const { drillDepthData, focusedPanel, setFocusedPanel } = useDashboard()
  const depthMarkerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    updateDepthMarker()
  }, [drillDepthData.currentDepth, isMobile])

  const updateDepthMarker = () => {
    if (!depthMarkerRef.current) return

    const position = (drillDepthData.currentDepth / 20000) * 100

    if (isMobile) {
      depthMarkerRef.current.style.left = `${position}%`
      depthMarkerRef.current.style.top = "0"
    } else {
      depthMarkerRef.current.style.top = `${position}%`
      depthMarkerRef.current.style.left = "0"
    }
  }

  const toggleFocus = () => {
    if (focusedPanel === "drill-depth") {
      setFocusedPanel(null)
    } else {
      setFocusedPanel("drill-depth")
    }
  }

  return (
    <div
      className={`bg-panel-bg border border-border-color rounded-lg flex flex-col relative overflow-hidden shadow-md transition-all min-h-[200px] w-full panel drill-depth-panel col-start-1 col-end-2 row-start-1 row-end-3 ${focusedPanel === "drill-depth" ? "z-10 shadow-lg bg-panel-bg-focus border-border-focus focused" : ""}`}
      onDoubleClick={toggleFocus}
    >
      <PanelHeader
        title="Drill Depth Visualization"
        icon={<RulerVertical className="w-3.5 h-3.5 opacity-80" />}
        onExpand={toggleFocus}
      />

      <div className="flex-1 relative p-2.5 flex items-center depth-visualization">
        <div className="w-10 h-full bg-gradient-to-b from-blue to-purple rounded relative depth-scale">
          <div
            ref={depthMarkerRef}
            className="absolute left-0 w-full h-0.5 bg-yellow transition-all duration-1000 ease-in-out depth-marker"
          />
        </div>

        <div className="ml-2.5 flex flex-col justify-between h-full depth-labels">
          <div className="text-xs text-text-dim depth-label">0 ft</div>
          <div className="text-xs text-text-dim depth-label">5000 ft</div>
          <div className="text-xs text-text-dim depth-label">10000 ft</div>
          <div className="text-xs text-text-dim depth-label">15000 ft</div>
          <div className="text-xs text-text-dim depth-label">20000 ft</div>
        </div>

        <div className="ml-5 flex flex-col gap-1.5 depth-info">
          <div className="text-lg font-bold text-blue depth-value">
            {Math.floor(drillDepthData.currentDepth)} {drillDepthData.unit}
          </div>
          <div className="text-sm text-green depth-rate">
            +{drillDepthData.rate} {drillDepthData.unit}/hr
          </div>
          <div className="text-xs text-text-dim depth-target">
            Target: {drillDepthData.targetDepth} {drillDepthData.unit}
          </div>
        </div>
      </div>
    </div>
  )
}
