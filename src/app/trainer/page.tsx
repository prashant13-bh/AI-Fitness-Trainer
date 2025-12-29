"use client"

import dynamic from 'next/dynamic';
import { Navbar } from "@/components/navbar"

const CameraView = dynamic(
  () => import("@/components/trainer/CameraView"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading AI Trainer...</p>
      </div>
    )
  }
);

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
