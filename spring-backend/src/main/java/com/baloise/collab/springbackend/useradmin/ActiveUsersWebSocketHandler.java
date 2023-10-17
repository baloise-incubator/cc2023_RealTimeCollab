package com.baloise.collab.springbackend.useradmin;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Set;

@Controller
@RequiredArgsConstructor
public class ActiveUsersWebSocketHandler {

    private final SimpMessagingTemplate messageSender;

    public void updateActiveUsers(Set<UserDTO> activeUsers) {
        messageSender.convertAndSend("/topic/activeUsers",
                activeUsers);
    }

}
