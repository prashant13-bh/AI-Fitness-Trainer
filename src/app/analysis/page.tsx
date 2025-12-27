"use client"

import { Navbar } from "@/components/navbar"
import BodyAnalysis from "@/components/trainer/BodyAnalysis"

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container flex flex-col items-center py-8">
        <h1 className="mb-4 text-3xl font-bold text-primary">Body Analysis</h1>
        <p className="mb-8 text-muted-foreground text-center max-w-lg">
          Our AI will analyze your body proportions to help tailor your fitness journey. 
          Please ensure you are in a well-lit area.
        </p>
        <BodyAnalysis />
      </div>
    </div>
  )
}
