"use client"

import { useDashboard } from "@/components/dashboard-provider"
import { Button } from "@/components/ui/button"

export function ButtonsConfirmPopup() {
  const { currentAction, setCurrentAction, addNotification } = useDashboard()

  const handleApply = () => {
    if (currentAction) {
      // Apply the action
      addNotification(
        "info",
        "Controls",
        currentAction.action,
        `Applied ${currentAction.category} action: ${currentAction.text}`,
      )
      setCurrentAction(null)
    }
  }

  const handleCancel = () => {
    setCurrentAction(null)
  }

  if (!currentAction) return null

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-popup-bg border border-border-color rounded-lg p-5 shadow-lg z-[1001] w-[300px] buttons-confirm-popup show">
      <div className="text-base font-bold mb-4 text-center buttons-confirm-title">
        Apply {currentAction.category} Action?
      </div>
      <div className="mb-5 text-center buttons-confirm-content">
        Do you want to apply the "{currentAction.text}" action?
      </div>
      <div className="flex justify-between buttons-confirm-buttons">
        <Button onClick={handleApply} className="bg-green text-white hover:bg-green/90 buttons-confirm-btn apply">
          Apply
        </Button>
        <Button onClick={handleCancel} variant="destructive" className="buttons-confirm-btn cancel">
          Cancel
        </Button>
      </div>
    </div>
  )
}
