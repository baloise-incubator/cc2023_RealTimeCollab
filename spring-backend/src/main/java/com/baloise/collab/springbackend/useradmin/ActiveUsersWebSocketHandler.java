package com.baloise.collab.springbackend.useradmin;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Set;

@Controller
@RequiredArgsConstructor
public class ActiveUsersWebSocketHandler {

    @SendTo("/topic/activeUsers")
    public Set<UserDTO> updateActiveUsers(Set<UserDTO> activeUsers) {
        return activeUsers;
    }

}
