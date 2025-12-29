"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateAnalysis, UserStats } from "@/lib/analysis"
import { motion } from "framer-motion"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<UserStats>({
    age: 25,
    weight: 65,
    height: 170,
    gender: "male",
    activityLevel: "moderately_active",
    goal: "build_muscle",
  })

  // Check if user is authenticated
  useEffect(() => {
    if (!auth) {
      router.push("/login")
      return
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const handleFinish = async () => {
    if (!auth || !auth.currentUser || !db) {
      setError("Firebase not initialized. Please refresh the page.")
      return
    }

    setLoading(true)
    setError("")

    const analysis = calculateAnalysis(formData);
    
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        email: auth.currentUser.email,
        stats: formData,
        analysis: analysis,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Error saving profile:", err)
      setError("Failed to save your profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-secondary/10 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="border-primary/20 bg-card/50 backdrop-blur-md shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 w-16 rounded-full transition-all ${
                      s <= step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{step}/3</span>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              Step {step} of 3: {step === 1 ? "Basic Info" : step === 2 ? "Your Body" : "Goals"}
            </CardTitle>
            <CardDescription>Let's build your custom plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 min-h-[280px]">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input 
                      type="number" 
                      value={formData.age} 
                      onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                      className="bg-background/50 border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input 
                      type="number" 
                      value={formData.height} 
                      onChange={(e) => setFormData({...formData, height: parseInt(e.target.value) || 0})}
                      className="bg-background/50 border-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input 
                      type="number" 
                      value={formData.weight} 
                      onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value) || 0})}
                      className="bg-background/50 border-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.activityLevel}
                    onChange={(e) => setFormData({...formData, activityLevel: e.target.value as any})}
                  >
                    <option value="sedentary">Sedentary (Office Job)</option>
                    <option value="lightly_active">Lightly Active (1-2 days/week)</option>
                    <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                    <option value="very_active">Very Active (6-7 days/week)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-2"
              >
                <Label>Primary Goal</Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "lose_weight", label: "Lose Weight & Burn Fat" },
                    { id: "build_muscle", label: "Build Muscle & Strength" },
                    { id: "recomp", label: "Body Recomposition (Lose Fat + Build Muscle)" },
                  ].map((g) => (
                    <div 
                      key={g.id}
                      onClick={() => setFormData({...formData, goal: g.id as any})}
                      className={`cursor-pointer rounded-md border p-4 transition-all hover:bg-accent ${formData.goal === g.id ? "border-primary bg-accent/50" : "border-primary/20"}`}
                    >
                      <p className="font-medium">{g.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20"
              >
                {error}
              </motion.p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t border-primary/10 pt-6">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={step === 1 || loading}
              className="border-primary/20"
            >
              Back
            </Button>
            {step < 3 ? (
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleFinish} 
                disabled={loading}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </div>
                ) : (
                  "Generate My Plan"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
