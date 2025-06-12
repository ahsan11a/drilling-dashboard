export type Notification = {
  id: string
  type: "info" | "warning" | "alert"
  time: string
  source: string
  content: string
}

export type MonitoringParam = {
  value: number
  unit: string
  threshold: {
    low: number
    high: number
  }
  history: number[]
}

export type EquipmentStatus = {
  status: "active" | "warning" | "error"
  efficiency?: number
  issue?: string
}
