"use client"

import React, { useRef, useEffect, useState } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function BodyAnalysis() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    ratio: number;
    bodyType: string;
    confidence: number;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const initTF = async () => {
      await tf.ready();
      const model = poseDetection.SupportedModels.MoveNet;
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER, // Thunder for better accuracy
      };
      const detector = await poseDetection.createDetector(model, detectorConfig);
      setDetector(detector);
    };
    initTF();
  }, []);

  useEffect(() => {
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
      }
    };
    startCamera();
  }, []);

  const runAnalysis = async () => {
    if (!detector || !videoRef.current || !canvasRef.current) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;

    // Run analysis over 3 seconds to get a stable reading
    let frames = 0;
    const maxFrames = 30;
    const ratios: number[] = [];
    const confidences: number[] = [];

    const analyzeFrame = async () => {
      if (frames >= maxFrames) {
        const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
        const avgConf = confidences.reduce((a, b) => a + b, 0) / confidences.length;
        
        let bodyType = "Balanced";
        if (avgRatio > 1.2) bodyType = "V-Taper / Broad Shoulders";
        else if (avgRatio < 0.9) bodyType = "Pear Shape / Broad Hips";
        
        setAnalysisResult({
          ratio: avgRatio,
          bodyType: bodyType,
          confidence: avgConf
        });
        setIsAnalyzing(false);
        return;
      }

      const poses = await detector.estimatePoses(video);
      
      if (poses.length > 0) {
        const keypoints = poses[0].keypoints;
        const leftShoulder = keypoints.find(k => k.name === "left_shoulder");
        const rightShoulder = keypoints.find(k => k.name === "right_shoulder");
        const leftHip = keypoints.find(k => k.name === "left_hip");
        const rightHip = keypoints.find(k => k.name === "right_hip");

        if (leftShoulder && rightShoulder && leftHip && rightHip &&
            (leftShoulder.score || 0) > 0.5 && (rightShoulder.score || 0) > 0.5) {
          
          const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
          const hipWidth = Math.abs(leftHip.x - rightHip.x);
          
          if (hipWidth > 0) {
            ratios.push(shoulderWidth / hipWidth);
            confidences.push((leftShoulder.score! + rightShoulder.score!) / 2);
          }
        }
      }

      frames++;
      setProgress((frames / maxFrames) * 100);
      requestAnimationFrame(analyzeFrame);
    };

    analyzeFrame();
  };

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
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
          width="640"
          height="480"
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
            disabled={!isCameraReady || !detector}
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
