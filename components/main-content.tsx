"use client"

import { DrillDepthPanel } from "@/components/panels/drill-depth-panel"
import { ChartPanel } from "@/components/panels/chart-panel"
import { StatusPanel } from "@/components/panels/status-panel"
import { EquipmentPanel } from "@/components/panels/equipment-panel"
import { NotificationArea } from "@/components/panels/notification-area"
import { useDashboard } from "@/components/dashboard-provider"

export function MainContent() {
  const { panelsVisible, focusedPanel } = useDashboard()

  return (
    <div className="grid grid-cols-7 auto-rows-[minmax(200px,1fr)] gap-2.5 flex-1 overflow-hidden main-content">
      <DrillDepthPanel />

      <ChartPanel
        title="Flow"
        icon="water"
        panelType="flow"
        className="col-start-2 col-end-3 row-start-1 row-end-3"
        params={[
          { key: "flow-in", label: "IN", icon: "arrow-down", color: "blue" },
          { key: "flow-out", label: "OUT", icon: "arrow-up", color: "red" },
          { key: "flow-mud", label: "MUD", icon: "droplet" },
        ]}
      />

      <ChartPanel
        title="Density"
        icon="weight-scale"
        panelType="density"
        className="col-start-3 col-end-4 row-start-1 row-end-3"
        params={[
          { key: "density-in", label: "IN", icon: "arrow-down", color: "blue" },
          { key: "density-out", label: "OUT", icon: "arrow-up" },
        ]}
      />

      <ChartPanel
        title="Surface Back Pressure"
        icon="gauge-high"
        panelType="surface-pressure"
        className="col-start-4 col-end-5 row-start-1 row-end-3"
        params={[
          { key: "surface-sp", label: "SP", icon: "gauge", color: "blue" },
          { key: "surface-sbp", label: "SBP", icon: "gauge-simple" },
        ]}
      />

      <ChartPanel
        title="Stand Pipe Pressure"
        icon="gauge-simple-high"
        panelType="standpipe-pressure"
        className="col-start-5 col-end-6 row-start-1 row-end-3"
        params={[
          { key: "standpipe-sp", label: "SP", icon: "gauge", color: "blue" },
          { key: "standpipe-spp", label: "SPP", icon: "gauge-simple" },
        ]}
      />

      <ChartPanel
        title="Bottom Hole Pressure"
        icon="arrow-down-long"
        panelType="bottomhole-pressure"
        className="col-start-6 col-end-7 row-start-1 row-end-3"
        params={[
          { key: "bottomhole-sp", label: "SP", icon: "gauge", color: "blue" },
          { key: "bottomhole-bhp", label: "BHP", icon: "gauge-simple" },
        ]}
      />

      <ChartPanel
        title="Choke"
        icon="valve"
        panelType="choke"
        className="col-start-7 col-end-8 row-start-1 row-end-3"
        params={[
          { key: "choke-a", label: "A", icon: "a", color: "blue" },
          { key: "choke-b", label: "B", icon: "b" },
          { key: "choke-setpoint", label: "Set point", icon: "bullseye", color: "green" },
        ]}
      />

      {panelsVisible && (
        <>
          <StatusPanel />
          <EquipmentPanel />
          <NotificationArea />
        </>
      )}
    </div>
  )
}
