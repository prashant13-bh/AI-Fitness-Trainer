"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { 
  Dumbbell, Brain, TrendingUp, Calendar, Target, Zap, 
  Activity, Trophy, Sparkles, ArrowRight, Check, Star
} from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: "AI Pose Detection",
      description: "Real-time form correction using computer vision to ensure perfect technique",
      color: "text-primary"
    },
    {
      icon: Target,
      title: "Personalized Plans",
      description: "Custom workout and diet plans tailored to your body type and goals",
      color: "text-secondary"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Visualize your transformation with detailed analytics and insights",
      color: "text-accent"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Adaptive daily schedules that fit your lifestyle and optimize results",
      color: "text-primary"
    }
  ]

  const steps = [
    { number: "01", title: "Sign Up", description: "Create your account in seconds" },
    { number: "02", title: "Set Goals", description: "Tell us about your fitness aspirations" },
    { number: "03", title: "Start Training", description: "Begin your AI-guided workout journey" },
    { number: "04", title: "Track Progress", description: "Watch your transformation unfold" }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content: "The AI form correction is a game-changer! My squat technique improved dramatically.",
      rating: 5,
      image: null
    },
    {
      name: "Mike Chen",
      role: "Busy Professional",
      content: "Finally, a fitness app that adapts to my schedule. Lost 15 lbs in 2 months!",
      rating: 5,
      image: null
    },
    {
      name: "Emily Davis",
      role: "Marathon Runner",
      content: "The personalized plans helped me achieve my first sub-4 hour marathon. Incredible!",
      rating: 5,
      image: null
    }
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-secondary/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Fitness</span>
            </motion.div>

            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-6">
              Your Personal{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
                AI Trainer
              </span>
            </h1>

            <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl mb-8">
              Get customized workout plans, AI-powered form correction, and diet tracking. 
              Transform your fitness journey with cutting-edge technology.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
            >
              <Link href="/signup">
                <Button size="lg" className="group bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-lg shadow-primary/30 text-lg h-12 px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </ Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 text-lg h-12 px-8">
                  Sign In
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Free forever plan</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 md:px-6 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by <span className="text-primary">Advanced AI</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
              Experience fitness training like never before with our intelligent features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 h-full">
                  <CardHeader>
                    <div className={`inline-flex p-3 rounded-lg bg-background/50 w-fit mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 md:px-6 bg-primary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
              Start your transformation in four simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-6xl font-bold text-primary/20 mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/4 -right-4 w-8 h-0.5 bg-primary/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 md:px-6">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by <span className="text-primary">Thousands</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
              See what our community has to say about their transformation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="border-primary/20 bg-card/50 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="flex gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <CardDescription className="text-base italic">"{testimonial.content}"</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 md:px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[150px]" />
        
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-[800px] mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your <span className="text-primary">Fitness Journey?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of users who are achieving their fitness goals with AI-powered training
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg h-14 px-10">
                Start Free Today
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-12 px-4 md:px-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">AI Fitness Trainer</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 AI Fitness Trainer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
