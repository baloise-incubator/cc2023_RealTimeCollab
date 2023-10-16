package com.baloise.collab.springbackend;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Log
@RequiredArgsConstructor
public class ScheduledUpdater {

    private final ButtonWebSocketHandler controller;

    private final SimpMessagingTemplate messageSender;

    @Scheduled(fixedRate = 1000)
    public void sendMessage() throws Exception {
        messageSender.convertAndSend("/topic/stocks",
                controller.doThing());
    }
}
