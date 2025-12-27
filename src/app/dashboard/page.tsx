"use client"

import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalysisResult, UserStats } from "@/lib/analysis"
import { generateWorkoutPlan, generateDietPlan } from "@/lib/plans"
import { ProgressChart } from "@/components/ProgressChart"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"

import { motion } from "framer-motion"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<{stats: UserStats, analysis: AnalysisResult} | null>(null)
  const [todaysWorkout, setTodaysWorkout] = useState<any>(null)
  const [dietPlan, setDietPlan] = useState<any>(null)
  const [chartData, setChartData] = useState<{date: string, reps: number}[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        router.push("/login")
        return
      }

      try {
        const docRef = doc(db, "users", auth.currentUser.uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const data = docSnap.data() as {stats: UserStats, analysis: AnalysisResult}
          setUserData(data)
          
          // Fetch chart data
          const q = query(
            collection(db, "workouts"),
            where("userId", "==", auth.currentUser.uid),
            orderBy("timestamp", "asc"),
            limit(7)
          )
          const querySnapshot = await getDocs(q)
          const logs = querySnapshot.docs.map(doc => {
            const d = doc.data()
            return {
              date: d.timestamp?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || "",
              reps: d.reps
            }
          })
          setChartData(logs)
        } else {
          router.push("/onboarding")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    // Wait for auth to initialize
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchUserData()
      else {
        setLoading(false)
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    if (userData) {
      const workoutPlan = generateWorkoutPlan(userData.stats)
      const diet = generateDietPlan(userData.stats, userData.analysis.dailyCalories)
      
      // Get today's day name (e.g., "Monday")
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const todayName = days[new Date().getDay()]
      
      const today = workoutPlan.find(d => d.day === todayName) || workoutPlan[0]
      setTodaysWorkout(today)
      setDietPlan(diet)
    }
  }, [userData])

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>

  if (!userData) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container py-8"
      >
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8 text-3xl font-bold"
        >
          Welcome, {userData.analysis.bodyArchetype}
        </motion.h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Archetype", value: userData.analysis.bodyArchetype, sub: "Based on your stats", color: "text-primary" },
            { title: "Daily Calories", value: `${userData.analysis.dailyCalories} kcal`, sub: "To reach your goal" },
            { title: "Protein Target", value: `${userData.analysis.protein}g`, sub: "Build that muscle" },
            { title: "BMI", value: userData.analysis.bmi, sub: userData.analysis.bmiCategory },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-primary/10 bg-primary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${item.color || ""}`}>{item.value}</div>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2 border-primary/20">
            <CardHeader>
              <CardTitle>Daily Motivation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg italic text-muted-foreground">
                "The only bad workout is the one that didn't happen. Your future self will thank you for the effort you put in today."
              </p>
              <div className="mt-4 flex gap-4">
                <Link href="/trainer" className="flex-1">
                  <Button className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20">
                    Start AI Trainer Session
                  </Button>
                </Link>
                <Link href="/analysis" className="flex-1">
                  <Button variant="outline" className="w-full h-12 text-lg font-bold">
                    Update Body Analysis
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Goal:</span>
                <span className="text-sm font-bold capitalize">{userData.stats.goal.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Experience:</span>
                <span className="text-sm font-bold capitalize">{userData.stats.experience}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Weight:</span>
                <span className="text-sm font-bold">{userData.stats.weight} kg</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <ProgressChart 
            title="Workout Progress (Last 7 Sessions)" 
            data={chartData.length > 0 ? chartData : [
              { date: "Day 1", reps: 0 },
              { date: "Day 2", reps: 0 },
              { date: "Day 3", reps: 0 },
            ]} 
          />
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Today's Workout: {todaysWorkout?.focus}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Let's crush it today.</p>
                <div className="rounded-md border p-4">
                   {todaysWorkout?.exercises.length > 0 ? (
                     <ul className="space-y-2">
                       {todaysWorkout.exercises.map((ex: any, i: number) => (
                         <li key={i} className="flex justify-between text-sm">
                           <span>{ex.name}</span>
                           <span className="text-muted-foreground">{ex.sets} x {ex.reps}</span>
                         </li>
                       ))}
                     </ul>
                   ) : (
                     <p>Rest Day! Enjoy your recovery.</p>
                   )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Nutrition Summary</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Protein ({userData.analysis.protein}g)</span>
                        <span>{Math.round((userData.analysis.protein * 4 / userData.analysis.dailyCalories) * 100)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${(userData.analysis.protein * 4 / userData.analysis.dailyCalories) * 100}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Carbs ({userData.analysis.carbs}g)</span>
                        <span>{Math.round((userData.analysis.carbs * 4 / userData.analysis.dailyCalories) * 100)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(userData.analysis.carbs * 4 / userData.analysis.dailyCalories) * 100}%` }} />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Fats ({userData.analysis.fats}g)</span>
                        <span>{Math.round((userData.analysis.fats * 9 / userData.analysis.dailyCalories) * 100)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: `${(userData.analysis.fats * 9 / userData.analysis.dailyCalories) * 100}%` }} />
                      </div>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
