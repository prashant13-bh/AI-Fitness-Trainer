"""
FastAPI & WebSocket Bridge Server for AI Fitness Trainer
Run with:
    python python_trainer/server.py
"""

import os
import sys
import time
import asyncio
from typing import Set

# Ensure UTF-8 output encoding on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import cv2
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from pose_engine import PoseEngine

app = FastAPI(title="AI Fitness Trainer - Python MediaPipe Bridge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = PoseEngine()
active_connections: Set[WebSocket] = set()
camera = None


def get_camera():
    global camera
    if camera is None or not camera.isOpened():
        camera = cv2.VideoCapture(0)
        camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    return camera


class ExerciseRequest(BaseModel):
    exercise: str


@app.get("/")
def health():
    return {
        "status": "online",
        "engine": "MediaPipe Pose (Python)",
        "current_exercise": engine.status.exercise,
        "reps": engine.status.reps,
    }


@app.get("/stats")
def get_stats():
    """Returns current real-time exercise telemetry via REST."""
    return {
        "exercise": engine.status.exercise,
        "reps": engine.status.reps,
        "stage": engine.status.stage,
        "angle": engine.status.angle,
        "feedback": engine.status.feedback,
        "form_quality": engine.status.form_quality,
        "hold_seconds": engine.status.hold_seconds,
    }



@app.post("/set_exercise")
def set_exercise(req: ExerciseRequest):
    engine.set_exercise(req.exercise)
    return {"status": "updated", "exercise": engine.status.exercise}


@app.post("/reset")
def reset_reps():
    engine.reset_reps()
    return {"status": "reset", "reps": 0}


def generate_frames():
    """Generates MJPEG video stream from camera processed by MediaPipe."""
    cap = get_camera()
    while True:
        success, frame = cap.read()
        if not success:
            time.sleep(0.05)
            continue

        # Mirror horizontally
        frame = cv2.flip(frame, 1)

        # Process with MediaPipe
        annotated_frame, status, _ = engine.process_frame(frame)

        # Encode frame as JPEG
        ret, buffer = cv2.imencode('.jpg', annotated_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
        if not ret:
            continue

        frame_bytes = buffer.tobytes()
        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
        )


@app.get("/video_feed")
def video_feed():
    """Returns live MJPEG video stream with skeleton overlay and HUD."""
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)
    try:
        while True:
            # Broadcast current engine state every 100ms
            payload = {
                "exercise": engine.status.exercise,
                "reps": engine.status.reps,
                "stage": engine.status.stage,
                "angle": engine.status.angle,
                "feedback": engine.status.feedback,
                "form_quality": engine.status.form_quality,
                "hold_seconds": engine.status.hold_seconds,
            }
            await websocket.send_json(payload)
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        active_connections.remove(websocket)
    except Exception:
        if websocket in active_connections:
            active_connections.remove(websocket)


if __name__ == "__main__":
    print("=" * 65)
    print("   AI FITNESS TRAINER - PYTHON STREAMING SERVER")
    print("=" * 65)
    print("HTTP Server:     http://localhost:8000")
    print("MJPEG Stream:    http://localhost:8000/video_feed")
    print("WebSocket Data:  ws://localhost:8000/ws")
    print("=" * 65)
    uvicorn.run(app, host="0.0.0.0", port=8000)
