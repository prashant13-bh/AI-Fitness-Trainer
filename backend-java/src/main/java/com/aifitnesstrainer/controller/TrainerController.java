package com.aifitnesstrainer.controller;

import com.aifitnesstrainer.model.ExerciseRequest;
import com.aifitnesstrainer.model.ExerciseStatus;
import com.aifitnesstrainer.service.ExerciseEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class TrainerController {

    private final ExerciseEngineService engineService;

    public TrainerController(ExerciseEngineService engineService) {
        this.engineService = engineService;
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> health() {
        ExerciseStatus status = engineService.getStatus();
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "online");
        resp.put("engine", "Java Spring Boot Exercise Engine");
        resp.put("current_exercise", status.getExercise());
        resp.put("reps", status.getReps());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/stats")
    public ResponseEntity<ExerciseStatus> getStats() {
        return ResponseEntity.ok(engineService.getStatus());
    }

    @PostMapping("/set_exercise")
    public ResponseEntity<Map<String, Object>> setExercise(@RequestBody ExerciseRequest req) {
        engineService.setExercise(req.getExercise());
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "updated");
        resp.put("exercise", engineService.getStatus().getExercise());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> resetReps() {
        engineService.resetReps();
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "reset");
        resp.put("reps", 0);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/rep")
    public ResponseEntity<Map<String, Object>> addRep() {
        int newCount = engineService.incrementReps();
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "success");
        resp.put("reps", newCount);
        return ResponseEntity.ok(resp);
    }
}
