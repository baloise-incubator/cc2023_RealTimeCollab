package com.baloise.collab.springbackend.game;

import com.baloise.collab.springbackend.useradmin.UserDTO;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Log
public class CharacterController {

    @Getter
    private final Set<Character> activeCharacters = new HashSet<>();

    private final SimpMessagingTemplate messageSender;

    private final int spawnX = 500;
    private final int spawnY = 500;

    public CharacterDTO createCharacterForUser(UserDTO user) {
        var characterForUser = getActiveCharacterForName(user.name());
        if (characterForUser.isEmpty()) {
            var character = Character.builder().name(user.name())
                    .color(user.color())
                    .posX(spawnX)
                    .posY(spawnY)
                    .pressedKeys(new HashSet<>())
                    .build();
            activeCharacters.add(character);
            return new CharacterDTO(character.getName(), character.getColor(), character.getPosXRounded(), character.getPosYRounded());
        } else {
            var character = characterForUser.get();
            return new CharacterDTO(character.getName(), character.getColor(), character.getPosXRounded(), character.getPosYRounded());
        }
    }

    public Optional<Character> getActiveCharacterForName(String name) {
        return activeCharacters.stream()
                .filter(character -> Objects.equals(character.getName(), name))
                .findFirst();
    }

    public void removeFromActiveCharacters(String name) {
        var charToRemove = getActiveCharacterForName(name);
        if (charToRemove.isPresent()) {
            sendRemoveCharacter(charToRemove.get());
            var result = activeCharacters.remove(charToRemove.get());
            log.info(name + " removed from active Users: " + result);
        }
    }

    public void moveCharacter(Character character, long frametime) {
        character.move(frametime);
        CharacterDTO characterDTO = new CharacterDTO(character.getName(), character.getColor(), character.getPosXRounded(), character.getPosYRounded());
        messageSender.convertAndSend("/topic/game/character", characterDTO);
    }

    private void sendRemoveCharacter(Character character) {
        CharacterDTO characterDTO = new CharacterDTO(character.getName(), character.getColor(), character.getPosXRounded(), character.getPosYRounded());
        messageSender.convertAndSend("/topic/game/character_removal", characterDTO);
    }

}
