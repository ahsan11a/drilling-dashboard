"use client"

import type React from "react"

import { useState } from "react"
import { useDashboard } from "@/components/dashboard-provider"
import {
  File,
  FolderOpen,
  Save,
  Printer,
  ClipboardList,
  Type,
  AlignLeft,
  Table,
  ImageIcon,
  LineChart,
  Calculator,
  Superscript,
  CheckSquare,
  Database,
  Filter,
  ArrowUpDown,
  PlusCircle,
  Gauge,
  BarChart,
} from "lucide-react"

type PopupItem = {
  icon: React.ReactNode
  text: string
}

type PopupData = {
  [key: string]: PopupItem[]
}

export function Navbar() {
  const [activePopup, setActivePopup] = useState<string | null>(null)
  const { addNotification } = useDashboard()

  const popupData: PopupData = {
    "file-popup": [
      { icon: <File className="w-[14px] h-[14px]" />, text: "New" },
      { icon: <FolderOpen className="w-[14px] h-[14px]" />, text: "Open" },
      { icon: <Save className="w-[14px] h-[14px]" />, text: "Save" },
      { icon: <Printer className="w-[14px] h-[14px]" />, text: "Print" },
    ],
    "home-popup": [
      { icon: <ClipboardList className="w-[14px] h-[14px]" />, text: "Clipboard" },
      { icon: <Type className="w-[14px] h-[14px]" />, text: "Font" },
      { icon: <AlignLeft className="w-[14px] h-[14px]" />, text: "Alignment" },
    ],
    "insert-popup": [
      { icon: <Table className="w-[14px] h-[14px]" />, text: "Table" },
      { icon: <ImageIcon className="w-[14px] h-[14px]" />, text: "Image" },
      { icon: <LineChart className="w-[14px] h-[14px]" />, text: "Chart" },
    ],
    "formulas-popup": [
      { icon: <Calculator className="w-[14px] h-[14px]" />, text: "Function Library" },
      { icon: <Superscript className="w-[14px] h-[14px]" />, text: "Math" },
      { icon: <CheckSquare className="w-[14px] h-[14px]" />, text: "Logical" },
    ],
    "data-popup": [
      { icon: <Database className="w-[14px] h-[14px]" />, text: "Import" },
      { icon: <Filter className="w-[14px] h-[14px]" />, text: "Filter" },
      { icon: <ArrowUpDown className="w-[14px] h-[14px]" />, text: "Sort" },
    ],
    "add-popup": [
      { icon: <PlusCircle className="w-[14px] h-[14px]" />, text: "New Panel" },
      { icon: <Gauge className="w-[14px] h-[14px]" />, text: "New Gauge" },
      { icon: <BarChart className="w-[14px] h-[14px]" />, text: "New Chart" },
    ],
  }

  const togglePopup = (popupId: string) => {
    if (activePopup === popupId) {
      setActivePopup(null)
    } else {
      setActivePopup(popupId)
    }
  }

  const handlePopupItemClick = (text: string) => {
    addNotification("info", "System", "action", `Action triggered: ${text}`)
    setActivePopup(null)
  }

  const handleClickOutside = () => {
    setActivePopup(null)
  }

  return (
    <div className="flex bg-navbar-bg rounded overflow-hidden mt-1.5 navbar">
      {Object.keys(popupData).map((popupId) => (
        <div key={popupId} className="relative">
          <button
            className={`py-2 px-4 bg-none border-none text-text-light cursor-pointer text-sm transition-colors navbar-btn ${activePopup === popupId ? "bg-button-active" : "hover:bg-button-hover"}`}
            onClick={() => togglePopup(popupId)}
          >
            {popupId.split("-")[0].charAt(0).toUpperCase() + popupId.split("-")[0].slice(1)}
          </button>

          {activePopup === popupId && (
            <>
              <div className="fixed inset-0 z-10" onClick={handleClickOutside} />
              <div className="absolute top-full left-0 bg-popup-bg border border-border-color rounded shadow-lg z-20 min-w-[200px] p-2.5 popup show">
                {popupData[popupId].map((item, index) => (
                  <div
                    key={index}
                    className="py-2 px-3 cursor-pointer flex items-center gap-2 rounded hover:bg-button-hover popup-item"
                    onClick={() => handlePopupItemClick(item.text)}
                  >
                    <span className="w-5 text-center">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
