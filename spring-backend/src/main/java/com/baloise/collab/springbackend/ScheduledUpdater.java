package com.baloise.collab.springbackend;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@Log
@RequiredArgsConstructor
public class ScheduledUpdater {

    private final ButtonWebSocketHandler controller;

    @Scheduled(fixedRate = 5000)
    public void sendMessage(SimpMessagingTemplate simpMessagingTemplate) throws Exception {
        simpMessagingTemplate.convertAndSend("/topic/stocks",
                controller.doThing());
    }
}
