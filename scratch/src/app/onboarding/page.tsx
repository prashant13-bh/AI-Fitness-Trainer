"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateAnalysis, UserStats } from "@/lib/analysis"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<UserStats>({
    age: 25,
    weight: 65,
    height: 170,
    gender: "male",
    activityLevel: "moderately_active",
    goal: "build_muscle",
  })

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const handleFinish = async () => {
    if (!auth.currentUser) return;

    const analysis = calculateAnalysis(formData);
    
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        stats: formData,
        analysis: analysis,
        createdAt: new Date(),
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Step {step} of 3: {step === 1 ? "Basic Info" : step === 2 ? "Your Body" : "Goals"}
          </CardTitle>
          <CardDescription>Let's build your custom plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input 
                    type="number" 
                    value={formData.age} 
                    onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input 
                    type="number" 
                    value={formData.height} 
                    onChange={(e) => setFormData({...formData, height: parseInt(e.target.value)})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input 
                    type="number" 
                    value={formData.weight} 
                    onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Activity Level</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({...formData, activityLevel: e.target.value as any})}
                >
                  <option value="sedentary">Sedentary (Office Job)</option>
                  <option value="lightly_active">Lightly Active (1-2 days/week)</option>
                  <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                  <option value="very_active">Very Active (6-7 days/week)</option>
                </select>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label>Primary Goal</Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "lose_weight", label: "Lose Weight & Burn Fat" },
                    { id: "build_muscle", label: "Build Muscle & Strength" },
                    { id: "recomp", label: "Body Recomposition (Lose Fat + Build Muscle)" },
                  ].map((g) => (
                    <div 
                      key={g.id}
                      onClick={() => setFormData({...formData, goal: g.id as any})}
                      className={`cursor-pointer rounded-md border p-4 transition-all hover:bg-accent ${formData.goal === g.id ? "border-primary bg-accent" : "border-input"}`}
                    >
                      <p className="font-medium">{g.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleFinish} className="bg-primary text-primary-foreground">
              Generate My Plan
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
