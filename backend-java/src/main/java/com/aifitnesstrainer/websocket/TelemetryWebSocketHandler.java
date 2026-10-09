package com.aifitnesstrainer.websocket;

import com.aifitnesstrainer.model.ExerciseStatus;
import com.aifitnesstrainer.service.ExerciseEngineService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class TelemetryWebSocketHandler extends TextWebSocketHandler {

    private final ExerciseEngineService engineService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    public TelemetryWebSocketHandler(ExerciseEngineService engineService) {
        this.engineService = engineService;
        startBroadcast();
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        // Echo or process client command if needed
    }

    private void startBroadcast() {
        scheduler.scheduleAtFixedRate(() -> {
            if (sessions.isEmpty()) {
                return;
            }
            try {
                ExerciseStatus status = engineService.getStatus();
                String json = objectMapper.writeValueAsString(status);
                TextMessage textMessage = new TextMessage(json);

                for (WebSocketSession session : sessions) {
                    if (session.isOpen()) {
                        synchronized (session) {
                            try {
                                session.sendMessage(textMessage);
                            } catch (IOException e) {
                                // connection might have closed
                            }
                        }
                    }
                }
            } catch (Exception e) {
                // Ignore transient write errors
            }
        }, 0, 100, TimeUnit.MILLISECONDS);
    }
}
