"use client"
import { useDashboard } from "@/components/dashboard-provider"
import { PanelHeader } from "@/components/panels/panel-header"
import { ValueDisplay } from "@/components/panels/value-display"
import { ChartContainer } from "@/components/charts/chart-container"
import {
  GlassWaterIcon as Water,
  WeightIcon as WeightScale,
  GaugeIcon as GaugeHigh,
  GaugeIcon as GaugeSimpleHigh,
  ArrowDownToLine,
  AnvilIcon as Valve,
  ArrowDown,
  ArrowUp,
  Droplet,
  Gauge,
  GaugeIcon as GaugeSimple,
  TargetIcon as Bullseye,
} from "lucide-react"

type ChartPanelProps = {
  title: string
  icon: string
  panelType: string
  className: string
  params: {
    key: string
    label: string
    icon: string
    color?: string
  }[]
}

export function ChartPanel({ title, icon, panelType, className, params }: ChartPanelProps) {
  const { monitoringData, focusedPanel, setFocusedPanel } = useDashboard()

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "water":
        return <Water className="w-3.5 h-3.5 opacity-80" />
      case "weight-scale":
        return <WeightScale className="w-3.5 h-3.5 opacity-80" />
      case "gauge-high":
        return <GaugeHigh className="w-3.5 h-3.5 opacity-80" />
      case "gauge-simple-high":
        return <GaugeSimpleHigh className="w-3.5 h-3.5 opacity-80" />
      case "arrow-down-long":
        return <ArrowDownToLine className="w-3.5 h-3.5 opacity-80" />
      case "valve":
        return <Valve className="w-3.5 h-3.5 opacity-80" />
      case "arrow-down":
        return <ArrowDown className="w-2.5 h-2.5" />
      case "arrow-up":
        return <ArrowUp className="w-2.5 h-2.5" />
      case "droplet":
        return <Droplet className="w-2.5 h-2.5" />
      case "gauge":
        return <Gauge className="w-2.5 h-2.5" />
      case "gauge-simple":
        return <GaugeSimple className="w-2.5 h-2.5" />
      case "bullseye":
        return <Bullseye className="w-2.5 h-2.5" />
      case "a":
        return <span className="text-xs">A</span>
      case "b":
        return <span className="text-xs">B</span>
      default:
        return null
    }
  }

  const toggleFocus = () => {
    if (focusedPanel === panelType) {
      setFocusedPanel(null)
    } else {
      setFocusedPanel(panelType)
    }
  }

  return (
    <div
      className={`bg-panel-bg border border-border-color rounded-lg flex flex-col relative overflow-hidden shadow-md transition-all min-h-[200px] w-full panel chart-panel ${className} ${focusedPanel === panelType ? "z-10 shadow-lg bg-panel-bg-focus border-border-focus focused" : ""}`}
      data-panel={panelType}
      onDoubleClick={toggleFocus}
    >
      <PanelHeader title={title} icon={getIcon(icon)} onExpand={toggleFocus} panelType={panelType} />

      {params.map((param) => (
        <ValueDisplay
          key={param.key}
          paramKey={param.key}
          label={param.label}
          icon={getIcon(param.icon)}
          color={param.color}
          panelType={panelType}
        />
      ))}

      <div className="flex-1 relative overflow-hidden z-1 panel-content">
        <ChartContainer panelType={panelType} data={monitoringData[panelType]} />
      </div>
    </div>
  )
}
