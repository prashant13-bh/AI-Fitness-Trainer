package com.aifitnesstrainer.model;

public class ExerciseRequest {
    private String exercise;

    public ExerciseRequest() {
    }

    public ExerciseRequest(String exercise) {
        this.exercise = exercise;
    }

    public String getExercise() {
        return exercise;
    }

    public void setExercise(String exercise) {
        this.exercise = exercise;
    }
}
