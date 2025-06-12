"use client"
import { Header } from "@/components/header"
import { MainContent } from "@/components/main-content"
import { Footer } from "@/components/footer"
import { TogglePanelsButton } from "@/components/toggle-panels-button"
import { ButtonsConfirmPopup } from "@/components/popups/buttons-confirm-popup"
import { ColorPickerPopup } from "@/components/popups/color-picker-popup"
import { useDashboard } from "@/components/dashboard-provider"

export function Dashboard() {
  const { panelsVisible, setPanelsVisible } = useDashboard()

  return (
    <div className="container">
      <div className="dashboard">
        <Header />
        <TogglePanelsButton />
        <MainContent />
        <ButtonsConfirmPopup />
        <ColorPickerPopup />
        <Footer />
      </div>
    </div>
  )
}
