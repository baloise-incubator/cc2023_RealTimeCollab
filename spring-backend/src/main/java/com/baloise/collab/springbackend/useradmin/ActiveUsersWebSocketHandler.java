package com.baloise.collab.springbackend.useradmin;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.util.Set;

@Controller
@RequiredArgsConstructor
public class ActiveUsersWebSocketHandler {

    private final SimpMessagingTemplate messageSender;
    private final ActiveUserAdministration userAdministration;

    public void addToActiveUsers(String name) {
        userAdministration.addToActiveUsers(name);
        messageSender.convertAndSend("/topic/activeUsers",
                userAdministration.getActiveUsers());
    }

    public void removeFromActiveUsers(String name) {
        userAdministration.removeFromActiveUsers(name);
        messageSender.convertAndSend("/topic/activeUsers",
                userAdministration.getActiveUsers());
    }

    @SubscribeMapping("/activeUsers")
    public Set<UserDTO> initActiveUsersWithoutTopic() {
        return userAdministration.getActiveUsers();
    }

}
