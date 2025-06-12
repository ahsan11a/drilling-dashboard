"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useDashboard } from "@/components/dashboard-provider"
import { ArrowUp, ArrowDown, Equal } from "lucide-react"

type ValueDisplayProps = {
  paramKey: string
  label: string
  icon: React.ReactNode
  color?: string
  panelType: string
}

export function ValueDisplay({ paramKey, label, icon, color, panelType }: ValueDisplayProps) {
  const { monitoringData } = useDashboard()
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable")
  const [alert, setAlert] = useState(false)
  const [warning, setWarning] = useState(false)

  useEffect(() => {
    if (!monitoringData[panelType] || !monitoringData[panelType][paramKey]) return

    const param = monitoringData[panelType][paramKey]
    const history = param.history

    // Determine trend
    if (history.length >= 3) {
      const lastValue = history[history.length - 1]
      const prevValue = history[history.length - 3]
      const variation = getVariationForParam(paramKey)

      if (lastValue > prevValue + variation * 0.2) {
        setTrend("up")
      } else if (lastValue < prevValue - variation * 0.2) {
        setTrend("down")
      } else {
        setTrend("stable")
      }
    }

    // Check thresholds
    const value = param.value
    const threshold = param.threshold

    if (value < threshold.low || value > threshold.high) {
      const deviation = Math.abs(value < threshold.low ? value - threshold.low : value - threshold.high)

      const deviationPercent = deviation / ((threshold.high - threshold.low) / 2)

      if (deviationPercent > 0.1) {
        setAlert(true)
        setWarning(false)
      } else {
        setAlert(false)
        setWarning(true)
      }
    } else {
      setAlert(false)
      setWarning(false)
    }
  }, [monitoringData, paramKey, panelType])

  const getVariationForParam = (paramKey: string) => {
    // Different parameters have different variation ranges
    if (paramKey.includes("flow")) {
      return 1.5
    } else if (paramKey.includes("density")) {
      return 0.1
    } else if (paramKey.includes("surface")) {
      return paramKey.includes("sp") ? 5 : 2
    } else if (paramKey.includes("standpipe")) {
      return 10
    } else if (paramKey.includes("bottomhole")) {
      return 15
    } else if (paramKey.includes("choke")) {
      return paramKey.includes("setpoint") ? 0.1 : 0.5
    }
    return 1.0 // Default variation
  }

  if (!monitoringData[panelType] || !monitoringData[panelType][paramKey]) {
    return null
  }

  const param = monitoringData[panelType][paramKey]

  return (
    <div
      className={`flex justify-between py-2 px-2.5 border-b border-border-color relative z-2 value-display ${alert ? "bg-alert-bg animate-pulse-alert" : ""} ${warning ? "bg-warning-bg" : ""}`}
      data-param={paramKey}
    >
      <div className="text-xs text-text-dim flex items-center gap-1.5 value-label">
        {icon}
        {label}:
      </div>
      <div className={`text-sm font-bold flex items-center gap-1.5 value ${color ? color : ""}`}>
        {param.value.toFixed(1)} {param.unit}
        <span className={`text-[10px] opacity-70 value-trend ${trend}`}>
          {trend === "up" && <ArrowUp className="w-2.5 h-2.5" />}
          {trend === "down" && <ArrowDown className="w-2.5 h-2.5" />}
          {trend === "stable" && <Equal className="w-2.5 h-2.5" />}
        </span>
      </div>
    </div>
  )
}
