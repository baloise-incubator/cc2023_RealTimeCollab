package com.baloise.collab.springbackend.eventlisteners;

import com.baloise.collab.springbackend.cursor.CursorWebSocketHandler;
import com.baloise.collab.springbackend.game.CharacterController;
import com.baloise.collab.springbackend.useradmin.ActiveUserAdministration;
import com.baloise.collab.springbackend.useradmin.ActiveUsersWebSocketHandler;
import com.baloise.collab.springbackend.useradmin.UserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.Optional;

@Component
@Log
@RequiredArgsConstructor
public class WebsocketDisconnectEventListener implements ApplicationListener<SessionDisconnectEvent> {

    private final ActiveUsersWebSocketHandler webSocketHandler;
    private final CharacterController characterController;

    @Override
    @EventListener
    public void onApplicationEvent(SessionDisconnectEvent event) {
        var user = Optional.ofNullable(event.getUser());
        var name = user.map(Principal::getName).orElse("Dummy");
        log.info(name + " has disconnected");
        webSocketHandler.removeFromActiveUsers(name);
        characterController.removeFromActiveCharacters(name);

    }
}
