package com.baloise.collab.springbackend.eventlisteners;

import com.baloise.collab.springbackend.useradmin.ActiveUserAdministration;
import com.baloise.collab.springbackend.useradmin.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.security.Principal;
import java.util.*;

@Component
@RequiredArgsConstructor
@Log
public class WebsocketConnectEventListener implements ApplicationListener<SessionSubscribeEvent> {

    private final ActiveUserAdministration userAdministration;

    @Override
    @EventListener
    public void onApplicationEvent(SessionSubscribeEvent event) {
        var user = Optional.ofNullable(event.getUser());
        var name = user.map(Principal::getName).orElse("Dummy");
        log.info(name + " has connected");
        userAdministration.addToActiveUsers(name);
    }
}
