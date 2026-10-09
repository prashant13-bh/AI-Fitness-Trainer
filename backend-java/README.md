# 🏋️ AI Fitness Trainer — Java Spring Boot Backend

Production-ready Java backend for **MaxxDaddy.ai (AI Fitness Trainer)**, replacing the prototype Python backend.

## 🚀 Features
- **Spring Boot 3.3.4 (Java 17/21)**
- **REST Telemetry API**:
  - `GET /` — Health check & engine status
  - `GET /stats` — Real-time exercise telemetry (exercise, reps, form quality, angle, feedback)
  - `POST /set_exercise` — Switch active exercise (pushups, squats, bicep curls, lunges, plank)
  - `POST /reset` — Reset rep count
  - `POST /rep` — Increment rep count
- **WebSocket Streaming**:
  - `ws://localhost:8080/ws` — Real-time telemetry broadcast to mobile and web frontend clients
- **Workout Logging**:
  - `GET /api/workouts` — Retrieve logged workouts
  - `POST /api/workouts/log` — Record completed workout session
- **CORS Configured**: Ready to accept requests from web, Capacitor Android, and iOS clients.

---

## 🛠️ How to Run Locally

### Requirements:
- Java JDK 17 or higher
- Maven (or use `./mvnw`)

### Start the Server:
```bash
cd backend-java
mvn spring-boot:run
```

Server starts on `http://localhost:8080`.

---

## 🚢 Free Cloud Hosting Options

| Provider | Free Tier | Deployment Method |
| :--- | :--- | :--- |
| **Render** | Free Web Service (512MB RAM) | Connect GitHub repo, specify Dockerfile / Maven |
| **Railway** | $5 free monthly credit | Automatic Spring Boot detection |
| **Oracle Cloud** | Always Free 4 ARM cores + 24GB RAM | Best free tier for Java workloads |
