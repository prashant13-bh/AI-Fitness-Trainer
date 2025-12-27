"use client"

import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Timestamp } from "firebase/firestore"

interface WorkoutLog {
  id: string;
  exercise: string;
  reps: number;
  timestamp: Timestamp;
}

export default function HistoryPage() {
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      if (!auth.currentUser) return
      
      try {
        const q = query(
          collection(db, "workouts"),
          where("userId", "==", auth.currentUser.uid),
          orderBy("timestamp", "desc")
        )
        const querySnapshot = await getDocs(q)
        const fetchedLogs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WorkoutLog[]
        setLogs(fetchedLogs)
      } catch (err) {
        console.error("Error fetching logs:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <h1 className="mb-8 text-3xl font-bold">Workout History</h1>
        
        {logs.length === 0 ? (
          <Card>
            <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
              No workouts recorded yet. Start training!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <Card key={log.id} className="border-primary/10">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="text-lg font-bold capitalize text-primary">{log.exercise}</h3>
                    <p className="text-sm text-muted-foreground">
                      {log.timestamp?.toDate().toLocaleDateString()} at {log.timestamp?.toDate().toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{log.reps}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Reps</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
