package com.aifitnesstrainer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FitnessTrainerApplication {

    public static void main(String[] args) {
        SpringApplication.run(FitnessTrainerApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  AI FITNESS TRAINER - JAVA BACKEND (ACTIVE)     ");
        System.out.println("=================================================");
        System.out.println("  HTTP Server:    http://localhost:8080          ");
        System.out.println("  Health Check:   http://localhost:8080/         ");
        System.out.println("  Telemetry API:  http://localhost:8080/stats    ");
        System.out.println("  WebSocket:      ws://localhost:8080/ws         ");
        System.out.println("=================================================");
    }
}
