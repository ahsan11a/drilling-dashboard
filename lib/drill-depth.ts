export function generateDrillDepthData() {
  return {
    currentDepth: 14978,
    targetDepth: 16500,
    rate: 2.3,
    unit: "ft",
  }
}

export function updateDrillDepth(data: any, addNotification: any) {
  const newData = { ...data }

  // Update drill depth with small random changes
  if (Math.random() > 0.5) {
    newData.currentDepth += newData.rate / 60 // Convert hourly rate to per-update rate

    // Occasionally add notification about depth
    if (Math.random() > 0.9) {
      addNotification(
        "info",
        "Drill Depth",
        "depth",
        `Current depth: ${Math.floor(newData.currentDepth)} ${newData.unit}`,
      )
    }
  }

  // Occasionally change drill rate
  if (Math.random() > 0.8) {
    newData.rate = Number.parseFloat((2 + Math.random() * 2).toFixed(1))
  }

  return newData
}
