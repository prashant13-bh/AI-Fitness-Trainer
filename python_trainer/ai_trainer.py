"""
AI Fitness Trainer - Standalone OpenCV & MediaPipe Desktop Application
Run with:
    python python_trainer/ai_trainer.py
"""

import os
import sys
import cv2

# Ensure UTF-8 output encoding on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from pose_engine import PoseEngine


def print_banner():
    print("=" * 65)
    print("   AI FITNESS TRAINER - PYTHON MEDIAPIPE BODY RECOGNITION")
    print("=" * 65)
    print("Controls:")
    print("  [p] : Push-ups")
    print("  [s] : Squats")
    print("  [c] : Bicep Curls")
    print("  [l] : Lunges")
    print("  [k] : Plank")
    print("  [j] : Jumping Jacks")
    print("  [r] : Reset Rep Count")
    print("  [q] : Quit Application")
    print("=" * 65)


def main():
    print_banner()
    print("[1/2] Initializing MediaPipe Pose Engine...")
    engine = PoseEngine()

    print("[2/2] Connecting to Webcam...")
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("ERROR: Could not open camera device. Please ensure a webcam is connected and accessible.")
        return

    # Set camera resolution to 720p or 480p
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    window_name = "AI Fitness Trainer - MediaPipe Pose Engine"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(window_name, 1080, 720)

    print("\nTrainer is LIVE! Stand in front of your camera to begin.\n")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Warning: Dropped camera frame")
                continue

            # Mirror frame horizontally so movements feel natural
            frame = cv2.flip(frame, 1)

            # Process frame with MediaPipe & Kinematics
            processed_frame, status, _ = engine.process_frame(frame)

            # Show interactive controls hint at top-right
            cv2.putText(
                processed_frame,
                "Keys: [P]ushup [S]quat [C]url [L]unge [K]Plank [R]eset [Q]uit",
                (processed_frame.shape[1] - 580, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.45,
                (148, 163, 184),
                1,
                cv2.LINE_AA,
            )

            cv2.imshow(window_name, processed_frame)

            key = cv2.waitKey(1) & 0xFF
            if key in [ord('q'), ord('Q'), 27]:  # 'q' or ESC
                print("\nExiting AI Trainer. Great workout session!")
                break
            elif key in [ord('p'), ord('P')]:
                engine.set_exercise("pushups")
            elif key in [ord('s'), ord('S')]:
                engine.set_exercise("squats")
            elif key in [ord('c'), ord('C')]:
                engine.set_exercise("bicep_curls")
            elif key in [ord('l'), ord('L')]:
                engine.set_exercise("lunges")
            elif key in [ord('k'), ord('K')]:
                engine.set_exercise("plank")
            elif key in [ord('j'), ord('J')]:
                engine.set_exercise("jumping_jacks")
            elif key in [ord('r'), ord('R')]:
                engine.reset_reps()

    finally:
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
