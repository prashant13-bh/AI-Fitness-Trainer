"use client"

import dynamic from 'next/dynamic';
import { Navbar } from "@/components/navbar"

const BodyAnalysis = dynamic(
  () => import("@/components/trainer/BodyAnalysis"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading Body Analysis...</p>
      </div>
    )
  }
);

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
