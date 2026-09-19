import os
import math
import time
import threading
from dataclasses import dataclass
from typing import List, Tuple, Optional, Dict, Any

import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision

# Landmark indices for MediaPipe 33 pose landmarks
NOSE = 0
LEFT_SHOULDER = 11
RIGHT_SHOULDER = 12
LEFT_ELBOW = 13
RIGHT_ELBOW = 14
LEFT_WRIST = 15
RIGHT_WRIST = 16
LEFT_HIP = 23
RIGHT_HIP = 24
LEFT_KNEE = 25
RIGHT_KNEE = 26
LEFT_ANKLE = 27
RIGHT_ANKLE = 28

SKELETON_CONNECTIONS = [
    (LEFT_SHOULDER, RIGHT_SHOULDER),
    (LEFT_SHOULDER, LEFT_ELBOW),
    (LEFT_ELBOW, LEFT_WRIST),
    (RIGHT_SHOULDER, RIGHT_ELBOW),
    (RIGHT_ELBOW, RIGHT_WRIST),
    (LEFT_SHOULDER, LEFT_HIP),
    (RIGHT_SHOULDER, RIGHT_HIP),
    (LEFT_HIP, RIGHT_HIP),
    (LEFT_HIP, LEFT_KNEE),
    (LEFT_KNEE, LEFT_ANKLE),
    (RIGHT_HIP, RIGHT_KNEE),
    (RIGHT_KNEE, RIGHT_ANKLE),
]


def calculate_angle(a: Tuple[float, float], b: Tuple[float, float], c: Tuple[float, float]) -> float:
    """
    Calculates 2D angle in degrees formed at point b (between ray b->a and ray b->c).
    """
    radians = math.atan2(c[1] - b[1], c[0] - b[0]) - math.atan2(a[1] - b[1], a[0] - b[0])
    angle = abs(radians * 180.0 / math.pi)
    if angle > 180.0:
        angle = 360.0 - angle
    return round(angle, 1)


@dataclass
class ExerciseStatus:
    exercise: str = "pushups"
    reps: int = 0
    stage: str = "up"  # "up", "down", "hold"
    angle: float = 0.0
    feedback: str = "Get into position"
    form_quality: str = "idle"  # "good", "warning", "idle"
    hold_seconds: float = 0.0


class VoiceCoach:
    """Thread-safe, non-blocking text-to-speech feedback using pyttsx3."""
    def __init__(self):
        self._last_spoken_time = 0.0
        self._last_spoken_text = ""
        self._queue: List[str] = []
        self._lock = threading.Lock()
        self._running = True
        self._worker = threading.Thread(target=self._process_speech, daemon=True)
        self._worker.start()

    def speak(self, text: str, force: bool = False, min_interval: float = 2.0):
        now = time.time()
        if not force:
            if now - self._last_spoken_time < min_interval:
                return
            if text == self._last_spoken_text and (now - self._last_spoken_time < 4.0):
                return

        self._last_spoken_time = now
        self._last_spoken_text = text
        with self._lock:
            self._queue.append(text)

    def _process_speech(self):
        try:
            import pyttsx3
            engine = pyttsx3.init()
            engine.setProperty('rate', 165)
            engine.setProperty('volume', 0.9)
            while self._running:
                text_to_speak = None
                with self._lock:
                    if self._queue:
                        text_to_speak = self._queue.pop(0)
                if text_to_speak:
                    engine.say(text_to_speak)
                    engine.runAndWait()
                else:
                    time.sleep(0.05)
        except Exception as e:
            print(f"[VoiceCoach] Note: pyttsx3 audio disabled ({e})")


class PoseEngine:
    """MediaPipe PoseLandmarker inference and exercise kinematics engine."""
    def __init__(self, model_path: Optional[str] = None):
        if model_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            model_path = os.path.join(base_dir, "models", "pose_landmarker_lite.task")

        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Pose landmarker model not found at {model_path}. Please download pose_landmarker_lite.task"
            )

        base_options = mp_python.BaseOptions(model_asset_path=model_path)
        options = vision.PoseLandmarkerOptions(
            base_options=base_options,
            running_mode=vision.RunningMode.IMAGE,
            num_poses=1,
            min_pose_detection_confidence=0.5,
            min_pose_presence_confidence=0.5,
            min_tracking_confidence=0.5,
        )
        self.landmarker = vision.PoseLandmarker.create_from_options(options)
        self.status = ExerciseStatus()
        self.voice = VoiceCoach()
        self.plank_start_time: Optional[float] = None

    def set_exercise(self, exercise_name: str):
        self.status = ExerciseStatus(
            exercise=exercise_name.lower(),
            reps=0,
            stage="up",
            feedback="Get into position",
            form_quality="idle",
            hold_seconds=0.0,
        )
        self.plank_start_time = None
        self.voice.speak(f"Switched to {exercise_name}", force=True)

    def reset_reps(self):
        self.status.reps = 0
        self.status.stage = "up"
        self.status.feedback = "Counter reset. Go when ready!"
        self.status.form_quality = "idle"
        self.status.hold_seconds = 0.0
        self.plank_start_time = None
        self.voice.speak("Reps reset", force=True)

    def process_frame(self, frame_bgr: np.ndarray) -> Tuple[np.ndarray, ExerciseStatus, Optional[Dict[str, Any]]]:
        """
        Processes a BGR OpenCV frame, extracts pose landmarks, analyzes form,
        updates rep counters, and renders the skeleton HUD.
        """
        h, w, _ = frame_bgr.shape
        rgb_frame = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

        result = self.landmarker.detect(mp_image)
        annotated_frame = frame_bgr.copy()

        if not result.pose_landmarks or len(result.pose_landmarks) == 0:
            self.status.feedback = "Step back into camera view"
            self.status.form_quality = "idle"
            self._render_hud(annotated_frame)
            return annotated_frame, self.status, None

        landmarks = result.pose_landmarks[0]
        points: Dict[int, Tuple[float, float, float]] = {}
        pixel_points: Dict[int, Tuple[int, int]] = {}

        for idx, lm in enumerate(landmarks):
            points[idx] = (lm.x, lm.y, lm.visibility or 1.0)
            pixel_points[idx] = (int(lm.x * w), int(lm.y * h))

        # Render neon skeleton bones
        for start_idx, end_idx in SKELETON_CONNECTIONS:
            if start_idx in pixel_points and end_idx in pixel_points:
                vis1 = points[start_idx][2]
                vis2 = points[end_idx][2]
                if vis1 > 0.4 and vis2 > 0.4:
                    cv2.line(
                        annotated_frame,
                        pixel_points[start_idx],
                        pixel_points[end_idx],
                        (255, 133, 0),  # Electric cyan/blue in BGR (0x0085FF)
                        3,
                        cv2.LINE_AA,
                    )

        # Render joint dots
        for idx in [
            LEFT_SHOULDER, RIGHT_SHOULDER,
            LEFT_ELBOW, RIGHT_ELBOW,
            LEFT_WRIST, RIGHT_WRIST,
            LEFT_HIP, RIGHT_HIP,
            LEFT_KNEE, RIGHT_KNEE,
            LEFT_ANKLE, RIGHT_ANKLE,
        ]:
            if idx in pixel_points and points[idx][2] > 0.4:
                cv2.circle(annotated_frame, pixel_points[idx], 6, (0, 122, 255), -1, cv2.LINE_AA)
                cv2.circle(annotated_frame, pixel_points[idx], 8, (255, 255, 255), 2, cv2.LINE_AA)

        # Evaluate kinematics for current exercise
        self._evaluate_exercise(points, pixel_points)

        # Render HUD on top of frame
        self._render_hud(annotated_frame)

        landmark_data = {
            "landmarks": [{"x": lm.x, "y": lm.y, "z": lm.z, "visibility": lm.visibility} for lm in landmarks]
        }
        return annotated_frame, self.status, landmark_data

    def _evaluate_exercise(self, pts: Dict[int, Tuple[float, float, float]], px: Dict[int, Tuple[int, int]]):
        ex = self.status.exercise

        if ex == "pushups":
            self._evaluate_pushups(pts)
        elif ex == "squats":
            self._evaluate_squats(pts)
        elif ex in ["bicep_curls", "curls"]:
            self._evaluate_curls(pts)
        elif ex == "lunges":
            self._evaluate_lunges(pts)
        elif ex == "plank":
            self._evaluate_plank(pts)
        elif ex in ["jumping_jacks", "jacks"]:
            self._evaluate_jumping_jacks(pts)

    def _evaluate_pushups(self, pts: Dict[int, Tuple[float, float, float]]):
        # Pick side with higher visibility
        left_vis = (pts[LEFT_SHOULDER][2] + pts[LEFT_ELBOW][2] + pts[LEFT_WRIST][2]) / 3
        right_vis = (pts[RIGHT_SHOULDER][2] + pts[RIGHT_ELBOW][2] + pts[RIGHT_WRIST][2]) / 3

        if left_vis >= right_vis and left_vis > 0.35:
            s, e, w = pts[LEFT_SHOULDER], pts[LEFT_ELBOW], pts[LEFT_WRIST]
            hip, ankle = pts[LEFT_HIP], pts[LEFT_ANKLE]
        elif right_vis > 0.35:
            s, e, w = pts[RIGHT_SHOULDER], pts[RIGHT_ELBOW], pts[RIGHT_WRIST]
            hip, ankle = pts[RIGHT_HIP], pts[RIGHT_ANKLE]
        else:
            self.status.feedback = "Position camera to see your arms"
            self.status.form_quality = "idle"
            return

        arm_angle = calculate_angle((s[0], s[1]), (e[0], e[1]), (w[0], w[1]))
        self.status.angle = arm_angle

        # Back sagging check
        body_angle = calculate_angle((s[0], s[1]), (hip[0], hip[1]), (ankle[0], ankle[1]))
        if body_angle < 145:
            self.status.feedback = "Keep back straight! Do not sag hips"
            self.status.form_quality = "warning"
            self.voice.speak("Keep your back straight")
            return

        if arm_angle >= 150:
            if self.status.stage == "down":
                self.status.reps += 1
                self.status.stage = "up"
                self.status.feedback = "Good rep! Keep pushing."
                self.status.form_quality = "good"
                self.voice.speak(str(self.status.reps), force=True)
            else:
                self.status.stage = "up"
                self.status.feedback = "Lower your chest to the floor"
                self.status.form_quality = "good"
        elif arm_angle <= 95 and self.status.stage == "up":
            self.status.stage = "down"
            self.status.feedback = "Good depth! Now push up explosive!"
            self.status.form_quality = "good"
        elif 95 < arm_angle < 150:
            if self.status.stage == "up":
                self.status.feedback = "Go deeper (break 90 deg)"
            else:
                self.status.feedback = "Lock out at the top"

    def _evaluate_squats(self, pts: Dict[int, Tuple[float, float, float]]):
        left_vis = (pts[LEFT_HIP][2] + pts[LEFT_KNEE][2] + pts[LEFT_ANKLE][2]) / 3
        right_vis = (pts[RIGHT_HIP][2] + pts[RIGHT_KNEE][2] + pts[RIGHT_ANKLE][2]) / 3

        if left_vis >= right_vis and left_vis > 0.35:
            h, k, a = pts[LEFT_HIP], pts[LEFT_KNEE], pts[LEFT_ANKLE]
        elif right_vis > 0.35:
            h, k, a = pts[RIGHT_HIP], pts[RIGHT_KNEE], pts[RIGHT_ANKLE]
        else:
            self.status.feedback = "Position camera to see hips and legs"
            self.status.form_quality = "idle"
            return

        knee_angle = calculate_angle((h[0], h[1]), (k[0], k[1]), (a[0], a[1]))
        self.status.angle = knee_angle

        if knee_angle >= 160:
            if self.status.stage == "down":
                self.status.reps += 1
                self.status.stage = "up"
                self.status.feedback = "Great squat! Drive through heels."
                self.status.form_quality = "good"
                self.voice.speak(str(self.status.reps), force=True)
            else:
                self.status.stage = "up"
                self.status.feedback = "Squat down into parallel depth"
                self.status.form_quality = "good"
        elif knee_angle <= 95 and self.status.stage == "up":
            self.status.stage = "down"
            self.status.feedback = "Great depth! Drive up!"
            self.status.form_quality = "good"
        elif 95 < knee_angle < 160:
            if self.status.stage == "up":
                self.status.feedback = "Sink hips down into parallel depth"
            else:
                self.status.feedback = "Stand all the way upright"

    def _evaluate_curls(self, pts: Dict[int, Tuple[float, float, float]]):
        left_vis = (pts[LEFT_SHOULDER][2] + pts[LEFT_ELBOW][2] + pts[LEFT_WRIST][2]) / 3
        right_vis = (pts[RIGHT_SHOULDER][2] + pts[RIGHT_ELBOW][2] + pts[RIGHT_WRIST][2]) / 3

        if left_vis >= right_vis:
            s, e, w = pts[LEFT_SHOULDER], pts[LEFT_ELBOW], pts[LEFT_WRIST]
        else:
            s, e, w = pts[RIGHT_SHOULDER], pts[RIGHT_ELBOW], pts[RIGHT_WRIST]

        curl_angle = calculate_angle((s[0], s[1]), (e[0], e[1]), (w[0], w[1]))
        self.status.angle = curl_angle

        if curl_angle >= 155:
            self.status.stage = "up"
            self.status.feedback = "Curl weight up toward shoulder"
            self.status.form_quality = "good"
        elif curl_angle <= 45 and self.status.stage == "up":
            self.status.stage = "down"
            self.status.reps += 1
            self.status.feedback = "Squeeze bicep at the top!"
            self.status.form_quality = "good"
            self.voice.speak(str(self.status.reps), force=True)

    def _evaluate_lunges(self, pts: Dict[int, Tuple[float, float, float]]):
        h = pts[LEFT_HIP] if pts[LEFT_HIP][2] > pts[RIGHT_HIP][2] else pts[RIGHT_HIP]
        k = pts[LEFT_KNEE] if pts[LEFT_KNEE][2] > pts[RIGHT_KNEE][2] else pts[RIGHT_KNEE]
        a = pts[LEFT_ANKLE] if pts[LEFT_ANKLE][2] > pts[RIGHT_ANKLE][2] else pts[RIGHT_ANKLE]

        lunge_angle = calculate_angle((h[0], h[1]), (k[0], k[1]), (a[0], a[1]))
        self.status.angle = lunge_angle

        if lunge_angle >= 155:
            if self.status.stage == "down":
                self.status.reps += 1
                self.status.stage = "up"
                self.status.feedback = "Solid lunge rep!"
                self.status.form_quality = "good"
                self.voice.speak(str(self.status.reps), force=True)
            else:
                self.status.stage = "up"
                self.status.feedback = "Step forward and drop back knee"
        elif lunge_angle <= 95 and self.status.stage == "up":
            self.status.stage = "down"
            self.status.feedback = "Perfect 90 deg lunge! Drive back up."

    def _evaluate_plank(self, pts: Dict[int, Tuple[float, float, float]]):
        s = pts[LEFT_SHOULDER] if pts[LEFT_SHOULDER][2] > pts[RIGHT_SHOULDER][2] else pts[RIGHT_SHOULDER]
        hip = pts[LEFT_HIP] if pts[LEFT_HIP][2] > pts[RIGHT_HIP][2] else pts[RIGHT_HIP]
        a = pts[LEFT_ANKLE] if pts[LEFT_ANKLE][2] > pts[RIGHT_ANKLE][2] else pts[RIGHT_ANKLE]

        spine_angle = calculate_angle((s[0], s[1]), (hip[0], hip[1]), (a[0], a[1]))
        self.status.angle = spine_angle

        now = time.time()
        if 155 <= spine_angle <= 195:
            if self.plank_start_time is None:
                self.plank_start_time = now
            hold = now - self.plank_start_time
            self.status.hold_seconds = round(hold, 1)
            self.status.reps = int(hold)
            self.status.stage = "hold"
            self.status.feedback = "Core engaged! Hold ironclad."
            self.status.form_quality = "good"

            if int(hold) > 0 and int(hold) % 10 == 0:
                self.voice.speak(f"{int(hold)} seconds")
        else:
            self.plank_start_time = None
            self.status.stage = "up"
            self.status.form_quality = "warning"
            if spine_angle < 155:
                self.status.feedback = "Hips piking too high! Lower hips slightly."
                self.voice.speak("Lower hips")
            else:
                self.status.feedback = "Hips sagging! Tighten core."
                self.voice.speak("Tighten core")

    def _evaluate_jumping_jacks(self, pts: Dict[int, Tuple[float, float, float]]):
        lw, rw = pts[LEFT_WRIST], pts[RIGHT_WRIST]
        ls, rs = pts[LEFT_SHOULDER], pts[RIGHT_SHOULDER]
        la, ra = pts[LEFT_ANKLE], pts[RIGHT_ANKLE]

        hands_overhead = (lw[1] < ls[1]) and (rw[1] < rs[1])
        feet_spread = abs(la[0] - ra[0]) > abs(ls[0] - rs[0]) * 1.5

        if hands_overhead and feet_spread and self.status.stage == "up":
            self.status.stage = "down"
            self.status.feedback = "Hands up, feet wide! Return to center."
            self.status.form_quality = "good"
        elif not hands_overhead and not feet_spread and self.status.stage == "down":
            self.status.reps += 1
            self.status.stage = "up"
            self.status.feedback = "Good jack! Keep the rhythm."
            self.status.form_quality = "good"
            self.voice.speak(str(self.status.reps), force=True)

    def _render_hud(self, frame: np.ndarray):
        h, w, _ = frame.shape

        # Top Header Bar Overlay
        cv2.rectangle(frame, (0, 0), (w, 85), (10, 25, 47), -1)

        # Rep / Hold Counter Badge
        is_plank = self.status.exercise == "plank"
        counter_label = "HOLD TIME" if is_plank else "REPS"
        counter_val = f"{int(self.status.hold_seconds)}s" if is_plank else str(self.status.reps)

        cv2.putText(frame, counter_label, (25, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (148, 163, 184), 2, cv2.LINE_AA)
        cv2.putText(frame, counter_val, (25, 75), cv2.FONT_HERSHEY_SIMPLEX, 1.4, (0, 122, 255), 3, cv2.LINE_AA)

        # Vertical separator line
        cv2.line(frame, (160, 15), (160, 70), (45, 60, 85), 2)

        # Exercise Name & Angle
        cv2.putText(
            frame,
            self.status.exercise.replace("_", " ").upper(),
            (180, 32),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (255, 255, 255),
            2,
            cv2.LINE_AA,
        )
        angle_str = f"Angle: {self.status.angle} deg | Stage: {self.status.stage.upper()}"
        cv2.putText(frame, angle_str, (180, 68), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (203, 213, 225), 1, cv2.LINE_AA)

        # Bottom Feedback Bar
        feedback_color = (0, 200, 80) if self.status.form_quality == "good" else (
            (0, 140, 255) if self.status.form_quality == "warning" else (70, 90, 110)
        )
        cv2.rectangle(frame, (0, h - 55), (w, h), (10, 25, 47), -1)
        cv2.rectangle(frame, (0, h - 55), (w, h - 50), feedback_color, -1)
        cv2.putText(
            frame,
            f"COACH: {self.status.feedback}",
            (25, h - 18),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (255, 255, 255),
            2,
            cv2.LINE_AA,
        )
