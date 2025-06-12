"use client"

import { useEffect, useRef, useState } from "react"

type ChartContainerProps = {
  panelType: string
  data: any
}

export function ChartContainer({ panelType, data }: ChartContainerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const rulerMarkerRef = useRef<HTMLDivElement>(null)
  const rulerValueRef = useRef<HTMLDivElement>(null)
  const [gridColor, setGridColor] = useState<string>("rgba(255, 255, 255, 0.1)")

  useEffect(() => {
    // Load saved grid color if available
    const savedColor = localStorage.getItem(`grid-color-${panelType}`)
    if (savedColor) {
      setGridColor(savedColor)
    }

    // Draw chart
    drawChart()

    // Add event listeners for cursor ruler
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener("mousemove", handleMouseMove)
      canvas.addEventListener("mouseenter", handleMouseEnter)
      canvas.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mouseenter", handleMouseEnter)
        canvas.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [panelType, data, gridColor])

  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 300
    canvas.height = (canvas.parentElement?.clientHeight || 200) - 35 // Account for ruler

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height)

    // Draw lines for each parameter
    let index = 0
    for (const paramKey in data) {
      const param = data[paramKey]
      const history = param.history

      // Skip if no history
      if (!history || history.length === 0) continue

      // Get color for this line
      let lineColor
      switch (index % 3) {
        case 0:
          lineColor = getComputedStyle(document.documentElement).getPropertyValue("--line-color-1").trim()
          break
        case 1:
          lineColor = getComputedStyle(document.documentElement).getPropertyValue("--line-color-2").trim()
          break
        case 2:
          lineColor = getComputedStyle(document.documentElement).getPropertyValue("--line-color-3").trim()
          break
      }

      // Draw the line
      drawChartLine(ctx, canvas.width, canvas.height, history, lineColor)

      index++
    }
  }

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.beginPath()
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 0.5

    // Horizontal gri lines
    for (let y = 0; y <= height; y += height / 10) {
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }

    // Vertical grid lines
    for (let x = 0; x <= width; x += width / 5) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }

    ctx.stroke()
  }

  const drawChartLine = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: number[],
    color: string,
  ) => {
    // Find min and max values for scaling
    const min = Math.min(...data) * 0.9
    const max = Math.max(...data) * 1.1
    const range = max - min

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    // Calculate step size for vertical spacing (time)
    const stepY = height / (data.length - 1)

    // Draw from bottom to top
    for (let i = 0; i < data.length; i++) {
      // Calculate x position based on data value
      const normalizedValue = (data[i] - min) / range
      const x = normalizedValue * width

      // Calculate y position based on time (newest data at top)
      const y = i * stepY

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()
  }

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current
    const rulerMarker = rulerMarkerRef.current
    const rulerValue = rulerValueRef.current

    if (!canvas || !rulerMarker || !rulerValue) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left

    // Update ruler marker position
    rulerMarker.style.left = `${x}px`
    rulerMarker.style.display = "block"

    // Update ruler value
    const percentage = (x / canvas.width) * 100
    rulerValue.style.left = `${x}px`
    rulerValue.style.display = "block"
    rulerValue.textContent = `${percentage.toFixed(1)}%`
  }

  const handleMouseEnter = () => {
    const rulerMarker = rulerMarkerRef.current
    const rulerValue = rulerValueRef.current

    if (rulerMarker) rulerMarker.style.display = "block"
    if (rulerValue) rulerValue.style.display = "block"
  }

  const handleMouseLeave = () => {
    const rulerMarker = rulerMarkerRef.current
    const rulerValue = rulerValueRef.current

    if (rulerMarker) rulerMarker.style.display = "none"
    if (rulerValue) rulerValue.style.display = "none"
  }

  return (
    <div className="relative w-full h-full p-1.5 chart-container">
      <canvas ref={canvasRef} className="w-full h-full relative z-1 chart-canvas" id={`${panelType}-chart`} />

      <div
        ref={tooltipRef}
        className="absolute bg-tooltip-bg border border-tooltip-border rounded p-2 text-xs pointer-events-none z-[100] shadow-md opacity-0 transition-opacity max-w-[200px] chart-tooltip"
        id={`${panelType}-tooltip`}
      />

      <div className="absolute bottom-0 left-0 w-full h-[35px] bg-ruler-bg border-t border-ruler-color z-[3] overflow-hidden flex items-center justify-between px-2.5 cursor-ruler">
        <div
          ref={rulerMarkerRef}
          className="absolute top-0 w-0.5 h-full bg-ruler-color z-[4] hidden cursor-ruler-marker"
          id={`${panelType}-ruler-marker`}
        />
        <div
          ref={rulerValueRef}
          className="absolute top-0.5 transform -translate-x-1/2 text-[10px] text-ruler-color font-bold z-[5] hidden cursor-ruler-value"
          id={`${panelType}-ruler-value`}
        />

        {/* Ruler ticks and labels */}
        <div className="absolute bottom-1.5 left-0 w-px h-2.5 bg-ruler-color ruler-tick" />
        <div className="absolute bottom-[18px] left-0 transform -translate-x-1/2 text-[10px] text-ruler-color ruler-label">
          0
        </div>

        <div className="absolute bottom-1.5 left-[20%] w-px h-2.5 bg-ruler-color ruler-tick" />
        <div className="absolute bottom-[18px] left-[20%] transform -translate-x-1/2 text-[10px] text-ruler-color ruler-label">
          100
        </div>

        <div className="absolute bottom-1.5 left-[40%] w-px h-2.5 bg-ruler-color ruler-tick" />
        <div className="absolute bottom-[18px] left-[40%] transform -translate-x-1/2 text-[10px] text-ruler-color ruler-label">
          200
        </div>

        <div className="absolute bottom-1.5 left-[60%] w-px h-2.5 bg-ruler-color ruler-tick" />
        <div className="absolute bottom-[18px] left-[60%] transform -translate-x-1/2 text-[10px] text-ruler-color ruler-label">
          300
        </div>

        <div className="absolute bottom-1.5 left-[80%] w-px h-2.5 bg-ruler-color ruler-tick" />
        <div className="absolute bottom-[18px] left-[80%] transform -translate-x-1/2 text-[10px] text-ruler-color ruler-label">
          400
        </div>

        <div className="absolute bottom-1.5 right-0 w-px h-2.5 bg-ruler-color ruler-tick" />
        <div className="absolute bottom-[18px] right-0 transform translate-x-1/2 text-[10px] text-ruler-color ruler-label">
          500
        </div>
      </div>
    </div>
  )
}
