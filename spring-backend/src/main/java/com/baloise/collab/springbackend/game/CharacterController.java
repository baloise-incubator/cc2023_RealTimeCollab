package com.baloise.collab.springbackend.game;

import com.baloise.collab.springbackend.useradmin.UserDTO;
import lombok.Getter;
import lombok.extern.java.Log;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

@Component
@Log
public class CharacterController {

    @Getter
    private final Set<CharacterDTO> activeCharacters = new HashSet<>();

    private final int spawnX = 500;
    private final int spawnY = 500;

    public CharacterDTO createCharacterForUser(UserDTO user) {
        var characterForUser = getActiveCharacterForName(user.name());
        if (characterForUser.isEmpty()) {
            var character = new CharacterDTO(user.name(), user.color(), spawnX, spawnY);
            activeCharacters.add(character);
            return character;
        } else {
            return characterForUser.get();
        }
    }

    public Optional<CharacterDTO> getActiveCharacterForName(String name) {
        return activeCharacters.stream()
                .filter(charDTO -> Objects.equals(charDTO.name(), name))
                .findFirst();
    }

    public void removeFromActiveCharacters(String name) {
        var charToRemove = getActiveCharacterForName(name);
        if (charToRemove.isPresent()) {
            activeCharacters.remove(charToRemove.get());
            log.info(name + " removed from active Users");
        }
    }

}
