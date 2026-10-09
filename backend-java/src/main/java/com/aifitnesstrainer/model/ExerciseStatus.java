package com.aifitnesstrainer.model;

public class ExerciseStatus {
    private String exercise;
    private int reps;
    private String stage;
    private double angle;
    private String feedback;
    private String formQuality;
    private double holdSeconds;

    public ExerciseStatus() {
        this.exercise = "pushups";
        this.reps = 0;
        this.stage = "up";
        this.angle = 180.0;
        this.feedback = "Get in position and begin your reps";
        this.formQuality = "good";
        this.holdSeconds = 0.0;
    }

    public ExerciseStatus(String exercise, int reps, String stage, double angle, String feedback, String formQuality, double holdSeconds) {
        this.exercise = exercise;
        this.reps = reps;
        this.stage = stage;
        this.angle = angle;
        this.feedback = feedback;
        this.formQuality = formQuality;
        this.holdSeconds = holdSeconds;
    }

    public String getExercise() {
        return exercise;
    }

    public void setExercise(String exercise) {
        this.exercise = exercise;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public double getAngle() {
        return angle;
    }

    public void setAngle(double angle) {
        this.angle = angle;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public String getFormQuality() {
        return formQuality;
    }

    public void setFormQuality(String formQuality) {
        this.formQuality = formQuality;
    }

    public double getHoldSeconds() {
        return holdSeconds;
    }

    public void setHoldSeconds(double holdSeconds) {
        this.holdSeconds = holdSeconds;
    }
}
