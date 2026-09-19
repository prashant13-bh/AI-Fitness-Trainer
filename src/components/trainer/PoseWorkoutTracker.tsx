'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Keypoint,
  RepState,
  ExerciseType,
  countExerciseRep,
} from '@/lib/rep-counter';
import { loadMoveNetDetector, PoseDetectorInstance } from '@/lib/poseLoader';
import {
  playRepBeep,
  playWarningTick,
  playCelebrationSound,
  speakVoiceCue,
} from '@/lib/audioFeedback';
import {
  Volume2,
  VolumeX,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Timer,
  Award,
  VideoOff,
} from 'lucide-react';

interface PoseWorkoutTrackerProps {
  initialExercise?: ExerciseType;
  onComplete?: (summary: {
    exercise: ExerciseType;
    reps: number;
    durationSecs: number;
    xp: number;
  }) => void;
  onClose?: () => void;
}

const EXERCISES: { id: ExerciseType; name: string; icon: string; targetUnit: string }[] = [
  { id: 'pushups', name: 'Push-ups', icon: '💪', targetUnit: 'reps' },
  { id: 'squats', name: 'Squats', icon: '🦵', targetUnit: 'reps' },
  { id: 'lunges', name: 'Lunges', icon: '🏃', targetUnit: 'reps' },
  { id: 'plank', name: 'Plank', icon: '🧘', targetUnit: 'sec' },
  { id: 'jumping_jacks', name: 'Jumping Jacks', icon: '⭐', targetUnit: 'reps' },
];

const SKELETON_PAIRS: [string, string][] = [
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
];

export default function PoseWorkoutTracker({
  initialExercise = 'pushups',
  onComplete,
  onClose,
}: PoseWorkoutTrackerProps) {
  const [exercise, setExercise] = useState<ExerciseType>(initialExercise);
  const [detector, setDetector] = useState<PoseDetectorInstance | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Workout state
  const [repState, setRepState] = useState<RepState>({
    count: 0,
    stage: 'up',
    feedback: 'Get into position',
    angle: 0,
    formQuality: 'idle',
    holdSeconds: 0,
  });

  const [currentSet, setCurrentSet] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [soundMode, setSoundMode] = useState<'voice' | 'chime' | 'mute'>('voice');
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(30);
  const [elapsedWorkoutSeconds, setElapsedWorkoutSeconds] = useState(0);

  // Simulation mode fallback
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const repStateRef = useRef<RepState>(repState);
  const exerciseRef = useRef<ExerciseType>(exercise);
  const isPausedRef = useRef<boolean>(isPaused);
  const isRestingRef = useRef<boolean>(isResting);
  const soundModeRef = useRef(soundMode);

  useEffect(() => {
    repStateRef.current = repState;
    exerciseRef.current = exercise;
    isPausedRef.current = isPaused;
    isRestingRef.current = isResting;
    soundModeRef.current = soundMode;
  }, [repState, exercise, isPaused, isResting, soundMode]);

  // 1. Initialize TensorFlow & MoveNet
  useEffect(() => {
    let mounted = true;
    async function initModel() {
      try {
        setIsLoadingModel(true);
        setModelError(null);
        const det = await loadMoveNetDetector();
        if (mounted) {
          setDetector(det);
          setIsLoadingModel(false);
        }
      } catch (err) {
        console.warn('Could not load MoveNet, offering simulation fallback:', err);
        if (mounted) {
          setModelError('Could not load camera AI model. You can use Simulation Mode to test.');
          setIsLoadingModel(false);
        }
      }
    }
    initModel();
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Start Camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraActive(true);
        };
      }
    } catch (err: unknown) {
      console.warn('Camera access error:', err);
      const errMsg = err instanceof Error ? err.message : 'Camera access error';
      setCameraError(
        errMsg.includes('Permission')
          ? 'Camera permission denied. Please allow camera access in browser settings.'
          : 'Unable to connect to camera device. You can test in simulation mode.'
      );
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [startCamera]);

  // 3. Overall workout clock
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setElapsedWorkoutSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // 4. Plank hold timer or Rest countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResting && restTime > 0 && !isPaused) {
      timer = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            if (soundModeRef.current !== 'mute') {
              playCelebrationSound();
              speakVoiceCue('Rest over! Next set.', true);
            }
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (exercise === 'plank' && repState.stage === 'hold' && !isPaused && !isResting) {
      timer = setInterval(() => {
        setRepState((prev) => {
          const nextHold = (prev.holdSeconds || 0) + 1;
          if (nextHold % 10 === 0 && soundModeRef.current === 'voice') {
            speakVoiceCue(`${nextHold} seconds`);
          }
          return { ...prev, count: nextHold, holdSeconds: nextHold };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isResting, restTime, exercise, repState.stage, isPaused]);

  // 5. Pose Detection & Canvas Rendering Loop
  useEffect(() => {
    if (!detector || !isCameraActive || isSimulatedMode) return;

    let isDetecting = false;

    const detectLoop = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || video.readyState < 2 || isPausedRef.current) {
        animationFrameRef.current = requestAnimationFrame(detectLoop);
        return;
      }

      if (isDetecting) {
        animationFrameRef.current = requestAnimationFrame(detectLoop);
        return;
      }

      isDetecting = true;
      try {
        const videoWidth = video.videoWidth || 640;
        const videoHeight = video.videoHeight || 480;

        if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
          canvas.width = videoWidth;
          canvas.height = videoHeight;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Clear previous drawings
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Mirror context for intuitive tracking
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-canvas.width, 0);

          // Draw the video frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          if (!isRestingRef.current) {
            // Run MoveNet inference
            const poses = await detector.estimatePoses(video);

            if (poses.length > 0 && poses[0].keypoints) {
              const rawKeypoints = poses[0].keypoints as Keypoint[];

              // Draw Skeleton Bones
              ctx.lineWidth = 3.5;
              ctx.strokeStyle = '#0085FF';

              SKELETON_PAIRS.forEach(([p1Name, p2Name]) => {
                const kp1 = rawKeypoints.find((k) => k.name === p1Name);
                const kp2 = rawKeypoints.find((k) => k.name === p2Name);
                if (kp1 && kp2 && (kp1.score || 0) > 0.3 && (kp2.score || 0) > 0.3) {
                  ctx.beginPath();
                  ctx.moveTo(kp1.x, kp1.y);
                  ctx.lineTo(kp2.x, kp2.y);
                  ctx.stroke();
                }
              });

              // Draw Keypoint Joints
              rawKeypoints.forEach((kp) => {
                if ((kp.score || 0) > 0.3) {
                  ctx.beginPath();
                  ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI);
                  ctx.fillStyle = '#FF7A00';
                  ctx.fill();
                  ctx.lineWidth = 2;
                  ctx.strokeStyle = '#FFFFFF';
                  ctx.stroke();
                }
              });

              // Calculate Rep & Form Logic
              const previousState = repStateRef.current;
              const nextState = countExerciseRep(exerciseRef.current, rawKeypoints, previousState);

              // Sound / Voice triggering on rep count change
              if (nextState.count > previousState.count) {
                if (soundModeRef.current !== 'mute') {
                  playRepBeep();
                  if (soundModeRef.current === 'voice') {
                    speakVoiceCue(`${nextState.count}`);
                  }
                }
              } else if (nextState.formQuality === 'warning' && previousState.formQuality !== 'warning') {
                if (soundModeRef.current !== 'mute') {
                  playWarningTick();
                  if (soundModeRef.current === 'voice') {
                    speakVoiceCue(nextState.feedback);
                  }
                }
              }

              // Update state if anything changed
              if (
                nextState.count !== previousState.count ||
                nextState.feedback !== previousState.feedback ||
                nextState.formQuality !== previousState.formQuality ||
                nextState.angle !== previousState.angle
              ) {
                setRepState(nextState);
              }
            }
          } else {
            // Resting overlay on canvas
            ctx.fillStyle = 'rgba(10, 25, 47, 0.75)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.restore();
        }
      } catch (err) {
        console.debug('Frame detection warning:', err);
      } finally {
        isDetecting = false;
        animationFrameRef.current = requestAnimationFrame(detectLoop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(detectLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [detector, isCameraActive, isSimulatedMode]);

  // Exercise switch handler
  const handleExerciseChange = (newExercise: ExerciseType) => {
    setExercise(newExercise);
    setRepState({
      count: 0,
      stage: 'up',
      feedback: 'Get into position',
      angle: 0,
      formQuality: 'idle',
      holdSeconds: 0,
    });
  };

  // Switch facing mode (Front / Back camera)
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Complete workout & award XP
  const handleFinishWorkout = () => {
    if (soundMode !== 'mute') {
      playCelebrationSound();
    }
    const xp = Math.max(15, Math.round(repState.count * 2.5 + elapsedWorkoutSeconds * 0.1));
    if (onComplete) {
      onComplete({
        exercise,
        reps: repState.count,
        durationSecs: elapsedWorkoutSeconds,
        xp,
      });
    }
  };

  // Simulation Mode Rep Trigger (for testing when webcam is absent)
  const triggerSimulatedRep = () => {
    setRepState((prev) => {
      const newCount = prev.count + 1;
      if (soundMode !== 'mute') {
        playRepBeep();
        if (soundMode === 'voice') speakVoiceCue(`${newCount}`);
      }
      return {
        ...prev,
        count: newCount,
        stage: 'up',
        feedback: 'Good rep! (Simulated)',
        formQuality: 'good',
        angle: 165,
      };
    });
  };

  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const currentExerciseMeta = EXERCISES.find((e) => e.id === exercise)!;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-4 animate-fade-in text-[#0A192F]">
      {/* ── Top Bar: Exercise Switcher & Status ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E8EEF5] shadow-sm">
        {/* Exercise Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {EXERCISES.map((ex) => (
            <button
              key={ex.id}
              onClick={() => handleExerciseChange(ex.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                exercise === ex.id
                  ? 'bg-[#0085FF] text-white shadow-sm'
                  : 'bg-slate-100 text-[#64748B] hover:text-[#0A192F] hover:bg-slate-200'
              }`}
            >
              <span>{ex.icon}</span>
              <span>{ex.name}</span>
            </button>
          ))}
        </div>

        {/* Audio Mode & Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const nextMode =
                soundMode === 'voice' ? 'chime' : soundMode === 'chime' ? 'mute' : 'voice';
              setSoundMode(nextMode);
              if (nextMode === 'voice') speakVoiceCue('Voice coach on');
              else if (nextMode === 'chime') playRepBeep();
            }}
            title="Toggle Sound Mode"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#64748B] flex items-center gap-1"
          >
            {soundMode === 'mute' ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-[#0085FF]" />}
            <span className="capitalize">{soundMode}</span>
          </button>

          <button
            onClick={toggleFacingMode}
            title="Switch Camera (Front/Rear)"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#64748B]"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#64748B]"
            >
              ✕ Exit
            </button>
          )}
        </div>
      </div>

      {/* ── Main Viewport: Video Feed + Canvas Overlay + Real-time HUD ── */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0A192F] border-2 border-slate-800 shadow-2xl aspect-[4/3] sm:aspect-[16/10] max-h-[520px] flex items-center justify-center">
        {/* Hidden video element supplying stream to canvas */}
        <video
          ref={videoRef}
          playsInline
          muted
          className="hidden"
        />

        {/* Real-time Render Canvas */}
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
        />

        {/* Fallback Camera Off / Loading State */}
        {(!isCameraActive || isLoadingModel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white bg-[#0A192F]/95 z-20 space-y-4">
            {isLoadingModel ? (
              <>
                <div className="w-12 h-12 rounded-full border-3 border-[#0085FF] border-t-transparent animate-spin" />
                <div>
                  <h3 className="text-base font-bold">Initializing MoveNet AI Model...</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Loading computer vision pose detector with WebGL acceleration
                  </p>
                </div>
              </>
            ) : cameraError || modelError ? (
              <div className="max-w-sm space-y-3">
                <VideoOff className="w-12 h-12 text-orange-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Camera Access Required</h3>
                <p className="text-xs text-slate-300">{cameraError || modelError}</p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={startCamera}
                    className="btn-sunset py-2.5 px-4 text-xs font-bold rounded-xl"
                  >
                    Retry Camera Access
                  </button>
                  <button
                    onClick={() => {
                      setIsSimulatedMode(true);
                      setIsCameraActive(true);
                    }}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                  >
                    Enter Simulation / Demo Mode
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin mx-auto" />
                <p className="text-xs text-slate-300">Connecting webcam feed...</p>
              </div>
            )}
          </div>
        )}

        {/* Rest Timer Overlay */}
        {isResting && (
          <div className="absolute inset-0 bg-[#0A192F]/85 backdrop-blur-sm flex flex-col items-center justify-center text-white z-30 animate-fade-in p-6">
            <Timer className="w-12 h-12 text-[#FF7A00] mb-2 animate-bounce" />
            <span className="text-xs font-black tracking-widest text-[#FF7A00] uppercase">
              REST PERIOD
            </span>
            <div className="font-mono text-7xl font-black my-2 text-white">
              {restTime}s
            </div>
            <p className="text-xs text-slate-300">Catch your breath. Next set in a moment.</p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setIsResting(false)}
                className="py-2 px-5 rounded-xl bg-white text-[#0A192F] font-bold text-xs hover:bg-slate-100"
              >
                Skip Rest →
              </button>
              <button
                onClick={() => setRestTime((prev) => prev + 15)}
                className="py-2 px-4 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700"
              >
                +15s
              </button>
            </div>
          </div>
        )}

        {/* ── Overlay HUD (Top-Left / Top-Right / Bottom) ── */}
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-10">
          {/* Top HUD Row */}
          <div className="flex items-start justify-between">
            {/* Live Rep Counter Card */}
            <div className="bg-black/60 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-2.5 text-white flex items-center gap-3.5 shadow-lg">
              <div className="text-center">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 block">
                  {exercise === 'plank' ? 'HOLD TIME' : 'REPS'}
                </span>
                <span className="font-mono text-4xl sm:text-5xl font-black text-[#FF7A00] leading-none">
                  {exercise === 'plank' ? `${repState.count}s` : repState.count}
                </span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-xs">
                <div className="font-bold text-slate-300">Set {currentSet}</div>
                <div className="text-[10px] text-slate-400">
                  {formatSeconds(elapsedWorkoutSeconds)} elapsed
                </div>
              </div>
            </div>

            {/* Target Joint Angle Badge */}
            {repState.angle > 0 && (
              <div className="bg-black/60 backdrop-blur-md border border-white/15 rounded-2xl px-3 py-2 text-right text-white shadow-lg">
                <span className="text-[9px] font-black uppercase text-slate-400 block">
                  ANGLE
                </span>
                <span className="font-mono text-xl font-black text-[#0085FF]">
                  {repState.angle}°
                </span>
              </div>
            )}
          </div>

          {/* Bottom HUD: Live Form Coaching Feedback */}
          <div className="flex flex-col items-center gap-2">
            <div
              className={`px-4 py-2 rounded-2xl backdrop-blur-md border text-xs sm:text-sm font-extrabold shadow-xl transition-all flex items-center gap-2 ${
                repState.formQuality === 'good'
                  ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                  : repState.formQuality === 'warning'
                  ? 'bg-amber-500/90 text-white border-amber-400/50 animate-pulse'
                  : 'bg-black/70 text-slate-200 border-white/15'
              }`}
            >
              {repState.formQuality === 'good' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{repState.feedback}</span>
            </div>

            {/* Simulated Mode Banner */}
            {isSimulatedMode && (
              <div className="bg-blue-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-blue-400/50">
                Demo Mode Active (Webcam Bypassed)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Control Console ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Pause / Resume */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`p-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition ${
            isPaused
              ? 'bg-emerald-500 text-white shadow-md hover:bg-emerald-600'
              : 'bg-white border border-[#E8EEF5] text-[#0A192F] hover:bg-slate-50'
          }`}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          <span>{isPaused ? 'Resume Session' : 'Pause Workout'}</span>
        </button>

        {/* Start Rest Period */}
        <button
          onClick={() => {
            setIsResting(true);
            setRestTime(30);
            setCurrentSet((prev) => prev + 1);
            if (soundMode !== 'mute') {
              speakVoiceCue('Rest 30 seconds');
            }
          }}
          disabled={isResting}
          className="p-3.5 rounded-2xl bg-white border border-[#E8EEF5] hover:border-[#0085FF] text-[#0085FF] font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <Timer className="w-4 h-4" />
          <span>Rest / Next Set</span>
        </button>

        {/* Reset Counter */}
        <button
          onClick={() => {
            setRepState({
              count: 0,
              stage: 'up',
              feedback: 'Counter reset. Go when ready!',
              angle: 0,
              formQuality: 'idle',
              holdSeconds: 0,
            });
          }}
          className="p-3.5 rounded-2xl bg-white border border-[#E8EEF5] text-[#64748B] hover:text-[#0A192F] font-bold text-xs flex items-center justify-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Reps</span>
        </button>

        {/* Finish & Save Workout */}
        <button
          onClick={handleFinishWorkout}
          className="p-3.5 rounded-2xl btn-sunset text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
        >
          <Award className="w-4 h-4" />
          <span>Finish Workout →</span>
        </button>
      </div>

      {/* Manual / Simulation test triggers */}
      <div className="arc-card p-3.5 bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-[#64748B]">
          <span className="font-bold text-[#0A192F]">Quick Test / Manual Count:</span>
          <span>Exercising away from camera? You can manually tap reps or toggle demo mode.</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={triggerSimulatedRep}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-[#0085FF] text-[#0085FF] font-bold text-xs transition"
          >
            +1 {currentExerciseMeta.name} Rep
          </button>
        </div>
      </div>
    </div>
  );
}
