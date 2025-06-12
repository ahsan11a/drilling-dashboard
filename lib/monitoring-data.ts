export function generateMonitoringData() {
  const data = {
    flow: {
      "flow-in": { value: 245.6, unit: "gpm", threshold: { low: 240, high: 250 }, history: [] as number[] },
      "flow-out": { value: 243.2, unit: "gpm", threshold: { low: 240, high: 250 }, history: [] as number[] },
      "flow-mud": { value: 12.5, unit: "ppg", threshold: { low: 12, high: 13 }, history: [] as number[] },
    },
    density: {
      "density-in": { value: 8.6, unit: "ppg", threshold: { low: 8.4, high: 8.8 }, history: [] as number[] },
      "density-out": { value: 8.4, unit: "ppg", threshold: { low: 8.2, high: 8.6 }, history: [] as number[] },
    },
    "surface-pressure": {
      "surface-sp": { value: 1250.4, unit: "psi", threshold: { low: 1200, high: 1300 }, history: [] as number[] },
      "surface-sbp": { value: 224.9, unit: "psi", threshold: { low: 220, high: 230 }, history: [] as number[] },
    },
    "standpipe-pressure": {
      "standpipe-sp": { value: 3500.0, unit: "psi", threshold: { low: 3450, high: 3550 }, history: [] as number[] },
      "standpipe-spp": { value: 3949.6, unit: "psi", threshold: { low: 3900, high: 4000 }, history: [] as number[] },
    },
    "bottomhole-pressure": {
      "bottomhole-sp": { value: 9628.0, unit: "psi", threshold: { low: 9600, high: 9650 }, history: [] as number[] },
      "bottomhole-bhp": { value: 9717.0, unit: "psi", threshold: { low: 9700, high: 9750 }, history: [] as number[] },
    },
    choke: {
      "choke-a": { value: 10.0, unit: "%", threshold: { low: 9, high: 11 }, history: [] as number[] },
      "choke-b": { value: 0.0, unit: "%", threshold: { low: 0, high: 0.5 }, history: [] as number[] },
      "choke-setpoint": { value: 12.5, unit: "%", threshold: { low: 12, high: 13 }, history: [] as number[] },
    },
  }

  // Initialize history arrays
  for (const panelKey in data) {
    const panel = data[panelKey as keyof typeof data]

    for (const paramKey in panel) {
      const param = panel[paramKey as keyof typeof panel]
      const history = []
      let currentVal = param.value

      for (let i = 0; i < 100; i++) {
        const variation = getVariationForParam(paramKey)
        currentVal = Number.parseFloat((currentVal + (Math.random() - 0.5) * variation).toFixed(1))
        history.unshift(currentVal)
      }

      param.history = history
    }
  }

  return data
}

export function updateMonitoringData(data: any, addNotification: any, alertsEnabled: boolean) {
  const newData = { ...data }

  for (const panelKey in newData) {
    const panel = newData[panelKey]

    for (const paramKey in panel) {
      const param = panel[paramKey]

      // Generate a new random value
      const variation = getVariationForParam(paramKey)
      let newValue = Number.parseFloat((param.value + (Math.random() - 0.5) * variation).toFixed(1))

      // Apply multiplier for Stand Pipe Pressure
      if (paramKey.includes("standpipe")) {
        newValue = Number.parseFloat((newValue * 10).toFixed(1))
      }

      // Update the value
      param.value = newValue

      // Add to history
      param.history.push(newValue)
      if (param.history.length > 100) {
        param.history.shift()
      }

      // Check thresholds
      if (newValue < param.threshold.low || newValue > param.threshold.high) {
        const deviation = Math.abs(
          newValue < param.threshold.low ? newValue - param.threshold.low : newValue - param.threshold.high,
        )

        const deviationPercent = deviation / ((param.threshold.high - param.threshold.low) / 2)

        if (deviationPercent > 0.1) {
          addNotification("alert", panelKey, paramKey, newValue, param.unit)
        } else {
          if (Math.random() > 0.7) {
            addNotification("warning", panelKey, paramKey, newValue, param.unit)
          }
        }
      } else if (Math.random() > 0.95) {
        addNotification("info", panelKey, paramKey, newValue, param.unit)
      }
    }
  }

  return newData
}

function getVariationForParam(paramKey: string) {
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
  return 1.0
}
