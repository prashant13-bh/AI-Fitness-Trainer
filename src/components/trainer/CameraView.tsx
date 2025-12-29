"use client"

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { countPushups, countSquats, countLunges, checkPlank, RepState, Keypoint } from "@/lib/rep-counter";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Pose detector type (loaded dynamically)
type PoseDetector = any;

export default function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<PoseDetector | null>(null);
  const [repState, setRepState] = useState<RepState>({ count: 0, stage: "up", feedback: "Get ready" });
  const repStateRef = useRef<RepState>({ count: 0, stage: "up", feedback: "Get ready" });
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(30);
  const [exerciseType, setExerciseType] = useState<"pushups" | "squats" | "lunges" | "plank">("pushups");
  const exerciseTypeRef = useRef(exerciseType);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    exerciseTypeRef.current = exerciseType;
  }, [exerciseType]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResting && restTime > 0) {
      timer = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isResting, restTime]);

  useEffect(() => {
    const initTF = async () => {
      try {
        setIsLoading(true);
        // Dynamic imports to avoid SSR issues
        const tf = await import("@tensorflow/tfjs-core");
        await import("@tensorflow/tfjs-backend-webgl");
        const poseDetection = await import("@tensorflow-models/pose-detection");
        
        await tf.ready();
        const model = poseDetection.SupportedModels.MoveNet;
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        };
        const detectorInstance = await poseDetection.createDetector(model, detectorConfig);
        setDetector(detectorInstance);
        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing TensorFlow:", err);
        setError("Failed to load AI model. Please refresh the page.");
        setIsLoading(false);
      }
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
        setError("Camera access denied. Please enable camera permissions.");
      }
    };
    startCamera();
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const detectPose = async () => {
      if (detector && videoRef.current && canvasRef.current && isCameraReady) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const poses = await detector.estimatePoses(video);
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          if (isResting) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "bold 60px Inter, sans-serif";
            ctx.fillStyle = "#00ffff";
            ctx.textAlign = "center";
            ctx.fillText(`REST: ${restTime}s`, canvas.width / 2, canvas.height / 2);
            ctx.font = "20px Inter, sans-serif";
            ctx.fillText("Catch your breath!", canvas.width / 2, canvas.height / 2 + 40);
          } else if (poses.length > 0) {
            const keypoints = poses[0].keypoints as Keypoint[];
            
            keypoints.forEach((kp) => {
                if ((kp.score || 0) > 0.3) {
                    ctx.beginPath();
                    ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = "#00ffff";
                    ctx.fill();
                }
            });

            let nextState: RepState;
            const currentType = exerciseTypeRef.current;
            
            if (currentType === "pushups") {
                nextState = countPushups(keypoints, repStateRef.current);
            } else if (currentType === "squats") {
                nextState = countSquats(keypoints, repStateRef.current);
            } else if (currentType === "lunges") {
                nextState = countLunges(keypoints, repStateRef.current);
            } else {
                nextState = checkPlank(keypoints, repStateRef.current);
            }
            
            if (nextState.count !== repStateRef.current.count || nextState.feedback !== repStateRef.current.feedback) {
                setRepState(nextState);
            }
            repStateRef.current = nextState;

            ctx.textAlign = "left";
            ctx.font = "bold 30px Inter, sans-serif";
            ctx.fillStyle = "#39FF14";
            ctx.fillText(currentType === "plank" ? "Plank Active" : `Reps: ${nextState.count}`, 30, 50);
            
            ctx.font = "20px Inter, sans-serif";
            ctx.fillStyle = "#FFD700";
            ctx.fillText(nextState.feedback, 30, 90);
          }
        }
      }
      animationFrameId = requestAnimationFrame(detectPose);
    };

    if (isCameraReady && detector) {
      detectPose();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [detector, isCameraReady, isResting, restTime]);

  const saveWorkout = async () => {
    if (!auth.currentUser) return;
    
    try {
      await addDoc(collection(db, "workouts"), {
        userId: auth.currentUser.uid,
        exercise: exerciseType,
        reps: repState.count,
        timestamp: serverTimestamp(),
      });
      
      alert(`Workout saved! ${repState.count} ${exerciseType} recorded.`);
      setRepState({ count: 0, stage: "up", feedback: "Get ready" });
      repStateRef.current = { count: 0, stage: "up", feedback: "Get ready" };
    } catch (err) {
      console.error("Error saving workout:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading AI Trainer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative overflow-hidden rounded-lg border border-primary shadow-lg shadow-primary/20">
        <video
          ref={videoRef}
          className="hidden"
          width="640"
          height="480"
          playsInline
          muted
        />
        <canvas
            ref={canvasRef}
            width="640"
            height="480"
            className="bg-black"
        />
        <div className="absolute top-4 right-4 rounded bg-black/50 p-2 text-white">
            <p className="text-xl font-bold">{isResting ? "Resting..." : "AI Trainer Active"}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
          <Button 
            variant={exerciseType === "pushups" ? "default" : "outline"}
            onClick={() => {
              setExerciseType("pushups");
              setRepState({ count: 0, stage: "up", feedback: "Get ready" });
              repStateRef.current = { count: 0, stage: "up", feedback: "Get ready" };
            }}
            disabled={isResting}
          >
              Pushups
          </Button>
          <Button 
            variant={exerciseType === "squats" ? "default" : "outline"}
            onClick={() => {
              setExerciseType("squats");
              setRepState({ count: 0, stage: "up", feedback: "Get ready" });
              repStateRef.current = { count: 0, stage: "up", feedback: "Get ready" };
            }}
            disabled={isResting}
          >
              Squats
          </Button>
          <Button 
            variant={exerciseType === "lunges" ? "default" : "outline"}
            onClick={() => {
              setExerciseType("lunges");
              setRepState({ count: 0, stage: "up", feedback: "Get ready" });
              repStateRef.current = { count: 0, stage: "up", feedback: "Get ready" };
            }}
            disabled={isResting}
          >
              Lunges
          </Button>
          <Button 
            variant={exerciseType === "plank" ? "default" : "outline"}
            onClick={() => {
              setExerciseType("plank");
              setRepState({ count: 0, stage: "up", feedback: "Get ready" });
              repStateRef.current = { count: 0, stage: "up", feedback: "Get ready" };
            }}
            disabled={isResting}
          >
              Plank
          </Button>
          <Button 
            variant="secondary"
            onClick={() => setIsResting(!isResting)}
          >
              {isResting ? "Skip Rest" : "Start Rest"}
          </Button>
          <Button 
            variant="destructive"
            onClick={saveWorkout}
            disabled={isResting}
          >
              Finish Workout
          </Button>
      </div>
    </div>
  );
}
