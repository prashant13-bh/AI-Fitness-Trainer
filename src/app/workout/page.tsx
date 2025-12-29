"use client"

import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateWorkoutPlan, WorkoutDay } from "@/lib/plans"
import { UserStats } from "@/lib/analysis"

export default function WorkoutPage() {
  const [plan, setPlan] = useState<WorkoutDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlan = async () => {
      if (!auth.currentUser) return
      
      const docRef = doc(db, "users", auth.currentUser.uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const stats = docSnap.data().stats as UserStats
        setPlan(generateWorkoutPlan(stats))
      }
      setLoading(false)
    }
    fetchPlan()
  }, [])

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="mb-8 text-3xl font-bold">Your Weekly Training Plan</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plan.map((day, index) => (
            <Card key={index} className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{day.day}</span>
                  <span className="text-sm font-normal text-muted-foreground">{day.focus}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {day.exercises.length > 0 ? (
                  <ul className="space-y-3">
                    {day.exercises.map((ex, i) => (
                      <li key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <span className="font-medium">{ex.name}</span>
                        <span className="text-sm text-muted-foreground">{ex.sets} x {ex.reps}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex h-20 items-center justify-center text-muted-foreground">
                    Rest & Recover
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
