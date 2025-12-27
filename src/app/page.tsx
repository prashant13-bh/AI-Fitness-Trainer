"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container px-4 md:px-6"
      >
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Your Personal <span className="text-primary animate-pulse">AI Trainer</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Get customized workout plans, diet schedules, and real-time form correction using just your camera.
        </p>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Link href="/login">
            <Button size="lg" className="shadow-lg shadow-primary/20">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">Log In</Button>
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
    </div>
  )
}
