package com.baloise.collab.springbackend;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Log
@RequiredArgsConstructor
public class CronUpdater {


    private final ButtonWebSocketHandler controller;

    @Scheduled(fixedRate = 1000)
    public void reportCurrentTime() throws Exception {
        log.info("Updating info on clients");
        controller.doThing();
    }
}
