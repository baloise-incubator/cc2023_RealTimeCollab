package com.baloise.collab.springbackend.game;

import com.baloise.collab.springbackend.useradmin.ActiveUserAdministration;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.util.Optional;

@RequiredArgsConstructor
@Log
@Controller
public class GameWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final CharacterController characterController;
    private final ActiveUserAdministration userAdministration;
    private final GameLoopExecutor loopExecutor;

    @MessageMapping("/game/match_join")
    @SendTo("/topic/game/character")
    public CharacterDTO handlePlayerJoin(Message<String> message) throws Exception {
        var optionalToken = Optional.ofNullable((UsernamePasswordAuthenticationToken) message.getHeaders().get("simpUser"));
        String userName = optionalToken.map(AbstractAuthenticationToken::getName).orElse("dummyUser");

        log.info( "User joining Match: " + userName);
        var userDTO = userAdministration.getActiveUserForName(userName);
        if(userDTO.isPresent()){
            if(!loopExecutor.isRunning()){
                loopExecutor.run();
                log.info( "Match started ");
            }
            return characterController.createCharacterForUser(userDTO.get());
        } else {
            throw new IllegalCallerException("No active User found to attach Character");
        }
    }

    @MessageMapping("/game/match_leave")
    public void handlePlayerLeave(Message<String> message) throws Exception {
        var optionalToken = Optional.ofNullable((UsernamePasswordAuthenticationToken) message.getHeaders().get("simpUser"));
        String userName = optionalToken.map(AbstractAuthenticationToken::getName).orElse("dummyUser");

        log.info("User leaving Match: " + userName);
        characterController.removeFromActiveCharacters(userName);
        if (loopExecutor.isRunning() && characterController.getActiveCharacters().isEmpty()) {
            loopExecutor.quit();
            log.info("Match ended ");
        }
    }

    @MessageMapping("/game/character_control")
    public void controlCharacter(Message<String> message) throws JsonProcessingException {
        var optionalToken = Optional.ofNullable((UsernamePasswordAuthenticationToken) message.getHeaders().get("simpUser"));
        String userName = optionalToken.map(AbstractAuthenticationToken::getName).orElse("dummyUser");

        Optional<Character> character = characterController.getActiveCharacterForName(userName);
        if(character.isPresent()){

            var inputDTO =  objectMapper.readValue(message.getPayload(), InputDTO.class);
            var key = inputDTO.keyCode();
            key = key.replaceAll("\"", "");
            if(inputDTO.pressed()){
                log.info(userName + " pressed " + key);
                character.get().addToPressedKeys(key);
            } else {
                log.info(userName + " released " + key);
                character.get().removeFromPressedKeys(key);
            }


        }
    }
}
