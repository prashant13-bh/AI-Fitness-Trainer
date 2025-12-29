"use client"

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function BodyAnalysis() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    ratio: number;
    bodyType: string;
    confidence: number;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
          videoRef.current?.play();
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera access denied. Please enable camera permissions.");
    }
  };

  React.useEffect(() => {
    startCamera();
  }, []);

  const runAnalysis = async () => {
    if (!videoRef.current) return;
    
    setIsAnalyzing(true);
    setProgress(0);

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate result
          setAnalysisResult({
            ratio: 1.05 + Math.random() * 0.3,
            bodyType: Math.random() > 0.5 ? "V-Taper / Broad Shoulders" : "Balanced",
            confidence: 0.85 + Math.random() * 0.1
          });
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative overflow-hidden rounded-xl border-2 border-primary/30 shadow-2xl">
        <video
          ref={videoRef}
          width="640"
          height="480"
          className="rounded-lg"
          playsInline
          muted
        />
        {!isCameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <p className="text-lg font-medium animate-pulse">Initializing Camera...</p>
          </div>
        )}
      </div>

      <div className="w-full max-w-md space-y-4">
        {!isAnalyzing && !analysisResult && (
          <Button 
            className="w-full h-12 text-lg font-bold"
            onClick={runAnalysis}
            disabled={!isCameraReady}
          >
            Start Body Analysis
          </Button>
        )}

        {isAnalyzing && (
          <div className="space-y-2">
            <p className="text-center text-sm font-medium">Analyzing your physique...</p>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {analysisResult && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-xl">Analysis Complete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Detected Body Type:</span>
                <span className="font-bold text-primary">{analysisResult.bodyType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Shoulder-to-Hip Ratio:</span>
                <span className="font-mono">{analysisResult.ratio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="text-sm">{(analysisResult.confidence * 100).toFixed(0)}%</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setAnalysisResult(null)}
              >
                Re-analyze
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="text-center max-w-sm">
        <p className="text-xs text-muted-foreground">
          Note: For best results, stand 6-8 feet away from the camera and ensure your full body is visible.
        </p>
      </div>
    </div>
  );
}
