package com.baloise.collab.springbackend.eventlisteners;

import com.baloise.collab.springbackend.useradmin.ActiveUserAdministration;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

import java.security.Principal;
import java.util.*;

@Component
@RequiredArgsConstructor
@Log
public class WebsocketConnectEventListener implements ApplicationListener<SessionConnectedEvent> {

    private final ActiveUserAdministration userAdministration;

    @Override
    @EventListener
    public void onApplicationEvent(SessionConnectedEvent event) {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        var user = Optional.ofNullable(event.getUser());
        var name = user.map(Principal::getName).orElse("Dummy");
        log.info(name + " has connected");
        userAdministration.addToActiveUsers(name);
    }
}
