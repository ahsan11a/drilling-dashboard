"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { generateMonitoringData, updateMonitoringData } from "@/lib/monitoring-data"
import { generateEquipmentStatus, updateEquipmentStatus } from "@/lib/equipment-status"
import { generateDrillDepthData, updateDrillDepth } from "@/lib/drill-depth"
import type { Notification } from "@/types/dashboard"

type DashboardContextType = {
  monitoringData: any
  setMonitoringData: (data: any) => void
  drillDepthData: any
  setDrillDepthData: (data: any) => void
  equipmentStatus: any
  setEquipmentStatus: (data: any) => void
  alertsEnabled: boolean
  setAlertsEnabled: (enabled: boolean) => void
  simulationRunning: boolean
  setSimulationRunning: (running: boolean) => void
  notifications: Notification[]
  addNotification: (type: string, panel: string, param: string, message: string | number, unit?: string) => void
  clearNotifications: () => void
  currentAction: any
  setCurrentAction: (action: any) => void
  currentPanelForColorPicker: string | null
  setCurrentPanelForColorPicker: (panel: string | null) => void
  selectedColor: string | null
  setSelectedColor: (color: string | null) => void
  panelsVisible: boolean
  setPanelsVisible: (visible: boolean) => void
  focusedPanel: string | null
  setFocusedPanel: (panel: string | null) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [monitoringData, setMonitoringData] = useState(generateMonitoringData())
  const [drillDepthData, setDrillDepthData] = useState(generateDrillDepthData())
  const [equipmentStatus, setEquipmentStatus] = useState(generateEquipmentStatus())
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [simulationRunning, setSimulationRunning] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [currentAction, setCurrentAction] = useState(null)
  const [currentPanelForColorPicker, setCurrentPanelForColorPicker] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [panelsVisible, setPanelsVisible] = useState(true)
  const [focusedPanel, setFocusedPanel] = useState<string | null>(null)

  // Add notification function
  const addNotification = (type: string, panel: string, param: string, message: string | number, unit?: string) => {
    const now = new Date()
    const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`

    let notificationMessage = ""
    const panelName = formatPanelName(panel)

    if (typeof message === "string") {
      notificationMessage = message
    } else {
      const paramName = formatParamName(param)
      const value = message

      if (type === "alert") {
        notificationMessage = `${paramName} value of ${value.toFixed(1)} ${unit} is outside acceptable range!`
      } else if (type === "warning") {
        notificationMessage = `${paramName} value of ${value.toFixed(1)} ${unit} is approaching threshold limits.`
      } else {
        notificationMessage = `${paramName} value of ${value.toFixed(1)} ${unit} is within normal parameters.`
      }
    }

    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      time: timeString,
      source: panelName,
      content: notificationMessage,
    }

    setNotifications((prev) => [newNotification, ...prev.slice(0, 19)])
  }

  // Clear notifications function
  const clearNotifications = () => {
    const now = new Date()
    const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`

    const systemNotification: Notification = {
      id: Date.now().toString(),
      type: "info",
      time: timeString,
      source: "System",
      content: "Notifications cleared. System monitoring continues.",
    }

    setNotifications([systemNotification])
  }

  // Format panel name
  const formatPanelName = (panel: string) => {
    return panel
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Format parameter name
  const formatParamName = (param: string) => {
    const parts = param.split("-")
    const paramPart = parts[parts.length - 1].toUpperCase()
    return paramPart
  }

  // Simulation effect
  useEffect(() => {
    // Add initial notification
    addNotification("info", "System", "system", "Dashboard initialized. All systems operational.")

    const simulationInterval = setInterval(() => {
      if (simulationRunning) {
        // Update monitoring data
        setMonitoringData((prev) => updateMonitoringData(prev, addNotification, alertsEnabled))

        // Update drill depth
        setDrillDepthData((prev) => updateDrillDepth(prev, addNotification))

        // Update equipment status
        setEquipmentStatus((prev) => updateEquipmentStatus(prev, addNotification, alertsEnabled))
      }
    }, 3000)

    return () => clearInterval(simulationInterval)
  }, [simulationRunning, alertsEnabled])

  return (
    <DashboardContext.Provider
      value={{
        monitoringData,
        setMonitoringData,
        drillDepthData,
        setDrillDepthData,
        equipmentStatus,
        setEquipmentStatus,
        alertsEnabled,
        setAlertsEnabled,
        simulationRunning,
        setSimulationRunning,
        notifications,
        addNotification,
        clearNotifications,
        currentAction,
        setCurrentAction,
        currentPanelForColorPicker,
        setCurrentPanelForColorPicker,
        selectedColor,
        setSelectedColor,
        panelsVisible,
        setPanelsVisible,
        focusedPanel,
        setFocusedPanel,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
