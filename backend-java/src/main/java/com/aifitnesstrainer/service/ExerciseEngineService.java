package com.aifitnesstrainer.service;

import com.aifitnesstrainer.model.ExerciseStatus;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class ExerciseEngineService {

    private final AtomicReference<String> currentExercise = new AtomicReference<>("pushups");
    private final AtomicInteger reps = new AtomicInteger(0);
    private final AtomicReference<String> stage = new AtomicReference<>("up");
    private final AtomicReference<Double> angle = new AtomicReference<>(180.0);
    private final AtomicReference<String> feedback = new AtomicReference<>("Get into starting position");
    private final AtomicReference<String> formQuality = new AtomicReference<>("good");
    private final AtomicReference<Double> holdSeconds = new AtomicReference<>(0.0);

    public ExerciseStatus getStatus() {
        return new ExerciseStatus(
                currentExercise.get(),
                reps.get(),
                stage.get(),
                angle.get(),
                feedback.get(),
                formQuality.get(),
                holdSeconds.get()
        );
    }

    public void setExercise(String exercise) {
        if (exercise != null && !exercise.trim().isEmpty()) {
            this.currentExercise.set(exercise.toLowerCase());
            this.reps.set(0);
            this.stage.set("up");
            this.feedback.set("Exercise switched to " + exercise + ". Begin when ready.");
        }
    }

    public void resetReps() {
        this.reps.set(0);
        this.holdSeconds.set(0.0);
        this.feedback.set("Rep count reset. Start fresh!");
    }

    public int incrementReps() {
        int updated = this.reps.incrementAndGet();
        this.feedback.set("Good rep! Count: " + updated);
        return updated;
    }

    public void updateTelemetry(String newStage, double newAngle, String newFeedback, String newFormQuality) {
        if (newStage != null) this.stage.set(newStage);
        this.angle.set(newAngle);
        if (newFeedback != null) this.feedback.set(newFeedback);
        if (newFormQuality != null) this.formQuality.set(newFormQuality);
    }
}
