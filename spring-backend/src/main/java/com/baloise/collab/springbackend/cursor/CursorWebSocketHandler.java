package com.baloise.collab.springbackend.cursor;

import com.baloise.collab.springbackend.useradmin.ActiveUserAdministration;
import com.baloise.collab.springbackend.useradmin.UserDTO;
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
public class CursorWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final ActiveUserAdministration userAdministration;

    @MessageMapping("/cursor")
    @SendTo("/topic/cursor")
    public OutgoingCursorDTO handleCursorUpdate(Message<String> message) throws Exception {
        var optionalToken = Optional.ofNullable((UsernamePasswordAuthenticationToken) message.getHeaders().get("simpUser"));
        String userName = optionalToken.map(AbstractAuthenticationToken::getName).orElse("dummyUser");

        var dto =  objectMapper.readValue(message.getPayload(), IncomingCursorDTO.class);
        var userDTO = userAdministration.getActiveUserForName(userName);
        var color = userDTO.map(UserDTO::color).orElse("default");
        return new OutgoingCursorDTO(userName, color, dto.posX(), dto.posY());
    }
}
