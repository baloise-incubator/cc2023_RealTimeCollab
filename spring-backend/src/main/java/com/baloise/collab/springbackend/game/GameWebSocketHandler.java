package com.baloise.collab.springbackend.game;

import com.baloise.collab.springbackend.useradmin.ActiveUserAdministration;
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

    @MessageMapping("/match_join")
    @SendTo("/topic/game/character")
    public CharacterDTO handlePlayerJoin(Message<String> message) throws Exception {
        var optionalToken = Optional.ofNullable((UsernamePasswordAuthenticationToken) message.getHeaders().get("simpUser"));
        String userName = optionalToken.map(AbstractAuthenticationToken::getName).orElse("dummyUser");

        log.info( "User joining Match: " + userName);
        var userDTO = userAdministration.getActiveUserForName(userName);
        if(userDTO.isPresent()){
            return characterController.createCharacterForUser(userDTO.get());
        } else {
            throw new IllegalCallerException("No active User found to attach Character");
        }


    }
}
