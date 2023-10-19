package com.baloise.collab.springbackend.useradmin;

import com.baloise.collab.springbackend.ColorProvider;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
@Log
public class ActiveUserAdministration {

    @Getter
    private final Set<UserDTO> activeUsers = new HashSet<>();
    private Random random = new Random();

    public void addToActiveUsers(String name) {
        var userToAdd = getActiveUserForName(name);
        if (userToAdd.isEmpty()) {
            var userDTO = new UserDTO(name, ColorProvider.getColors()[random.nextInt(0, 4)]);
            activeUsers.add(userDTO);
            log.info(userDTO.name() + " added to active Users");
        }
    }

    public Optional<UserDTO> getActiveUserForName(String name) {
        return activeUsers.stream()
                .filter(userDTO -> Objects.equals(userDTO.name(), name))
                .findFirst();
    }

    public void removeFromActiveUsers(String name) {
        var userToRemove = getActiveUserForName(name);
        if (userToRemove.isPresent()) {
            activeUsers.remove(userToRemove.get());
            log.info(name + " removed from active Users");
        }
    }

}
