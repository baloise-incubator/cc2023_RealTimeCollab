package com.baloise.collab.springbackend.useradmin;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.Objects;
import java.util.Random;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Log
public class ActiveUserAdministration {

    private final ActiveUsersWebSocketHandler userWebSocketHandler;

    @Getter
    private final Set<UserDTO> activeUsers = new HashSet<>();

    private final String[] colors =
            {
                    "#1b5951", "#6c2273", "#99172d", "#b24a00"
            };

    private Random random = new Random();

    public void addToActiveUsers(String name) {
        var userToRemove = activeUsers.stream()
                .filter(userDTO -> Objects.equals(userDTO.name(), name))
                .findFirst();
        if(!userToRemove.isPresent()){
            var userDTO = new UserDTO(name, colors[random.nextInt(0, 4)]);
            activeUsers.add(userDTO);
            log.info(userDTO.name() + " added to active Users");
            userWebSocketHandler.updateActiveUsers(activeUsers);
        }
    }

    public void removeFromActiveUsers(String name) {
        var userToRemove = activeUsers.stream()
                .filter(userDTO -> Objects.equals(userDTO.name(), name))
                .findFirst();
        if(userToRemove.isPresent()) {
            activeUsers.remove(userToRemove.get());
            log.info(name + " removed from active Users");
            userWebSocketHandler.updateActiveUsers(activeUsers);
        }
    }

}
