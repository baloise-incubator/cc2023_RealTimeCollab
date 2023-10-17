package com.baloise.collab.springbackend.eventlisteners;

import com.baloise.collab.springbackend.useradmin.ActiveUserAdministration;
import com.baloise.collab.springbackend.useradmin.UserDTO;
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

    private Random random = new Random();

    private final String[] colors =
    {
        "#1b5951", "#6c2273", "#99172d", "#b24a00"
    };

    @Override
    @EventListener
    public void onApplicationEvent(SessionConnectedEvent event) {
        var user = Optional.ofNullable(event.getUser());
        var name = user.map(Principal::getName).orElse("Dummy");
        log.info(name + " has connected");
        userAdministration.addToActiveUsers(new UserDTO(name, colors[random.nextInt(0, 4)]));
    }
}
