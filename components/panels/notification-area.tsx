"use client"

import { useDashboard } from "@/components/dashboard-provider"
import { Bell, Trash2, InfoIcon, AlertTriangle, AlertCircle } from "lucide-react"

export function NotificationArea() {
  const { notifications, clearNotifications, focusedPanel, setFocusedPanel } = useDashboard()

  const toggleFocus = () => {
    if (focusedPanel === "notifications") {
      setFocusedPanel(null)
    } else {
      setFocusedPanel("notifications")
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="w-3.5 h-3.5 text-red" />
      case "warning":
        return <AlertTriangle className="w-3.5 h-3.5 text-yellow" />
      default:
        return <InfoIcon className="w-3.5 h-3.5 text-blue" />
    }
  }

  return (
    <div
      className={`bg-panel-bg border border-border-color rounded-lg flex flex-col relative overflow-hidden shadow-md transition-all min-h-[200px] w-full panel notification-area col-start-5 col-end-8 row-start-3 ${focusedPanel === "notifications" ? "z-10 shadow-lg bg-panel-bg-focus border-border-focus focused" : ""}`}
      onDoubleClick={toggleFocus}
    >
      <div className="flex justify-between mb-1.5 relative z-2 notification-header">
        <div className="font-bold uppercase flex items-center gap-1.5 notification-title">
          <Bell className="w-3 h-3 text-blue" />
          Notifications
        </div>
        <div
          className="cursor-pointer text-text-dim text-xs flex items-center gap-0.5 py-1 px-2 rounded hover:text-text-light hover:bg-button-hover notification-clear"
          onClick={clearNotifications}
        >
          <Trash2 className="w-3 h-3" />
          Clear All
        </div>
      </div>

      <div className="overflow-y-auto flex-1 relative z-2 notification-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="py-1.5 border-b border-border-color last:border-b-0 text-xs flex items-center notification-item"
          >
            <div className={`mr-2 text-sm notification-icon ${notification.type}`}>
              {getNotificationIcon(notification.type)}
            </div>
            <div className="text-text-dim text-[10px] mr-2 whitespace-nowrap notification-time">
              {notification.time}
            </div>
            <div className="flex-1 notification-content">
              <span className="font-bold mr-1.5 notification-source">{notification.source}:</span>
              {notification.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
