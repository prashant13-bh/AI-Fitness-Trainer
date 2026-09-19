import os
import sys

# Ensure UTF-8 output encoding on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Add current dir to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from pose_engine import calculate_angle, ExerciseStatus, PoseEngine

def test_angle_math():
    # Right angle: (0, 10) -> (0, 0) -> (10, 0)
    angle = calculate_angle((0.0, 10.0), (0.0, 0.0), (10.0, 0.0))
    assert abs(angle - 90.0) < 0.1, f"Expected 90, got {angle}"

    # Straight line: (-10, 0) -> (0, 0) -> (10, 0)
    straight = calculate_angle((-10.0, 0.0), (0.0, 0.0), (10.0, 0.0))
    assert abs(straight - 180.0) < 0.1, f"Expected 180, got {straight}"
    print("[PASS] Angle math tests passed!")

def test_engine_init():
    engine = PoseEngine()
    assert engine.status.exercise == "pushups"
    engine.set_exercise("squats")
    assert engine.status.exercise == "squats"
    engine.reset_reps()
    assert engine.status.reps == 0
    print("[PASS] PoseEngine initialization & exercise switcher tests passed!")

if __name__ == "__main__":
    print("Running Python Pose Engine verification...")
    test_angle_math()
    test_engine_init()
    print("All Python Pose Engine unit tests passed successfully!")
