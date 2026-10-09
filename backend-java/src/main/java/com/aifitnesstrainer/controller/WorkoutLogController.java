package com.aifitnesstrainer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "*")
public class WorkoutLogController {

    private final List<Map<String, Object>> workoutLogs = new CopyOnWriteArrayList<>();

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getLogs() {
        return ResponseEntity.ok(workoutLogs);
    }

    @PostMapping("/log")
    public ResponseEntity<Map<String, Object>> logWorkout(@RequestBody Map<String, Object> payload) {
        Map<String, Object> entry = new HashMap<>(payload);
        entry.put("id", UUID.randomUUID().toString());
        entry.put("created_at", Instant.now().toString());
        workoutLogs.add(0, entry);
        return ResponseEntity.ok(entry);
    }
}
