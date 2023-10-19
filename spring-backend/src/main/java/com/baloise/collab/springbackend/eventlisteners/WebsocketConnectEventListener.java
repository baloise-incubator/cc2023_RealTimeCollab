package com.baloise.collab.springbackend.eventlisteners;

import com.baloise.collab.springbackend.items.InventoriesWebSocketHandler;
import com.baloise.collab.springbackend.useradmin.ActiveUsersWebSocketHandler;
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

    private final ActiveUsersWebSocketHandler webSocketHandler;
    private final InventoriesWebSocketHandler inventoriesWebSocketHandler;

    @Override
    @EventListener
    public void onApplicationEvent(SessionConnectedEvent event) {
        var user = Optional.ofNullable(event.getUser());
        var name = user.map(Principal::getName).orElse("Dummy");
        log.info(name + " has connected");
        webSocketHandler.addToActiveUsers(name);
        inventoriesWebSocketHandler.handleInventoryCreation(name);
    }
}
