export function generateEquipmentStatus() {
  return {
    "mud-pump-1": { status: "active", efficiency: 95 },
    "mud-pump-2": { status: "active", efficiency: 92 },
    "shale-shaker": { status: "warning", issue: "Vibration high" },
    "top-drive": { status: "active", efficiency: 98 },
    "mud-cooler": { status: "error", issue: "Temperature high" },
    "bop-stack": { status: "active", efficiency: 100 },
  }
}

export function updateEquipmentStatus(status: any, addNotification: any, alertsEnabled: boolean) {
  const newStatus = { ...status }

  // Occasionally change equipment status
  if (Math.random() > 0.8) {
    const equipmentKeys = Object.keys(newStatus)
    const randomEquipment = equipmentKeys[Math.floor(Math.random() * equipmentKeys.length)]

    const currentStatus = newStatus[randomEquipment].status

    let newEquipmentStatus
    if (currentStatus === "active") {
      newEquipmentStatus = Math.random() > 0.7 ? "warning" : "active"
    } else if (currentStatus === "warning") {
      newEquipmentStatus = Math.random() > 0.5 ? (Math.random() > 0.5 ? "active" : "error") : "warning"
    } else {
      newEquipmentStatus = Math.random() > 0.3 ? "warning" : "error"
    }

    newStatus[randomEquipment].status = newEquipmentStatus

    if (newEquipmentStatus === "active") {
      newStatus[randomEquipment].efficiency = Math.floor(85 + Math.random() * 15)
    } else if (newEquipmentStatus === "warning") {
      newStatus[randomEquipment].issue = getRandomIssue("warning")
    } else {
      newStatus[randomEquipment].issue = getRandomIssue("error")
    }

    const equipmentName = formatEquipmentName(randomEquipment)
    if (newEquipmentStatus === "warning") {
      addNotification(
        "warning",
        "Equipment",
        randomEquipment,
        `${equipmentName} showing warning: ${newStatus[randomEquipment].issue}`,
      )
    } else if (newEquipmentStatus === "error") {
      addNotification(
        "alert",
        "Equipment",
        randomEquipment,
        `${equipmentName} error: ${newStatus[randomEquipment].issue}`,
      )
    } else {
      addNotification(
        "info",
        "Equipment",
        randomEquipment,
        `${equipmentName} operating normally at ${newStatus[randomEquipment].efficiency}% efficiency`,
      )
    }
  }

  return newStatus
}

function getRandomIssue(type: string) {
  const warningIssues = [
    "Vibration high",
    "Temperature elevated",
    "Pressure fluctuation",
    "Efficiency reduced",
    "Maintenance due",
    "Minor leak detected",
  ]

  const errorIssues = [
    "Temperature critical",
    "Pressure exceeds limit",
    "Major leak detected",
    "Motor failure",
    "Emergency shutdown",
    "Critical malfunction",
  ]

  if (type === "warning") {
    return warningIssues[Math.floor(Math.random() * warningIssues.length)]
  } else {
    return errorIssues[Math.floor(Math.random() * errorIssues.length)]
  }
}

function formatEquipmentName(equipment: string) {
  return equipment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
