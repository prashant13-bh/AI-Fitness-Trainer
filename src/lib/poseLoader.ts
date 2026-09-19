/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

export interface PoseDetectorInstance {
  estimatePoses: (video: HTMLVideoElement | HTMLCanvasElement) => Promise<
    Array<{
      keypoints: Array<{ x: number; y: number; score?: number; name?: string }>;
    }>
  >;
}

declare global {
  interface Window {
    tf?: any;
    poseDetection?: any;
  }
}

// Track loading promise to avoid duplicate script injection
let loadScriptsPromise: Promise<void> | null = null;
let detectorCache: PoseDetectorInstance | null = null;

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already injected
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Loads TensorFlow.js & MoveNet Lightning dynamically in the browser
 */
export async function loadMoveNetDetector(): Promise<PoseDetectorInstance> {
  if (typeof window === 'undefined') {
    throw new Error('MoveNet can only be loaded in the browser environment.');
  }

  if (detectorCache) {
    return detectorCache;
  }

  if (!loadScriptsPromise) {
    loadScriptsPromise = (async () => {
      // 1. Load TF Core & Converter
      await injectScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.22.0/dist/tf-core.min.js');
      await injectScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@4.22.0/dist/tf-converter.min.js');
      
      // 2. Load WebGL backend for high FPS hardware acceleration
      await injectScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.22.0/dist/tf-backend-webgl.min.js');

      // 3. Load MoveNet / Pose Detection
      await injectScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.min.js');
    })();
  }

  await loadScriptsPromise;

  const tf = window.tf;
  const poseDetection = window.poseDetection;

  if (!tf || !poseDetection) {
    throw new Error('TensorFlow.js or PoseDetection library failed to initialize on window.');
  }

  await tf.ready();
  if (tf.getBackend() !== 'webgl') {
    try {
      await tf.setBackend('webgl');
    } catch (e) {
      console.warn('WebGL backend not available, defaulting to standard backend', e);
    }
  }

  // Create MoveNet SinglePose Lightning detector
  const detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      enableSmoothing: true,
      minPoseScore: 0.25,
    }
  );

  detectorCache = detector;
  return detector;
}
