"use client"

import { Navbar } from "@/components/navbar"
import CameraView from "@/components/trainer/CameraView"

export default function TrainerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container flex flex-col items-center py-8">
        <h1 className="mb-4 text-3xl font-bold text-primary">AI Trainer Session</h1>
        <p className="mb-8 text-muted-foreground">
          Position your camera so your full body is visible.
        </p>
        <CameraView />
      </div>
    </div>
  )
}
