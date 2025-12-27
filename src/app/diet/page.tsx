"use client"

import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateDietPlan, DietPlan } from "@/lib/plans"
import { UserStats, AnalysisResult } from "@/lib/analysis"

export default function DietPage() {
  const [plan, setPlan] = useState<DietPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlan = async () => {
      if (!auth.currentUser) return
      
      const docRef = doc(db, "users", auth.currentUser.uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setPlan(generateDietPlan(data.stats as UserStats, (data.analysis as AnalysisResult).dailyCalories))
      }
      setLoading(false)
    }
    fetchPlan()
  }, [])

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>
  if (!plan) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="mb-8 text-3xl font-bold">Your Nutrition Plan</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(plan).map(([mealType, meal]: [string, any]) => (
            <Card key={mealType} className="border-primary/20">
              <CardHeader>
                <CardTitle className="capitalize">{mealType}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-primary">{meal.name}</h3>
                  <p className="text-sm text-muted-foreground">{meal.description}</p>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div className="rounded bg-secondary p-2">
                    <div className="font-bold">{meal.calories}</div>
                    <div className="text-xs text-muted-foreground">Kcal</div>
                  </div>
                  <div className="rounded bg-secondary p-2">
                    <div className="font-bold">{meal.protein}g</div>
                    <div className="text-xs text-muted-foreground">Pro</div>
                  </div>
                  <div className="rounded bg-secondary p-2">
                    <div className="font-bold">{meal.carbs}g</div>
                    <div className="text-xs text-muted-foreground">Carb</div>
                  </div>
                  <div className="rounded bg-secondary p-2">
                    <div className="font-bold">{meal.fats}g</div>
                    <div className="text-xs text-muted-foreground">Fat</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
