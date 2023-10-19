package com.baloise.collab.springbackend.chat;

import com.baloise.collab.springbackend.useradmin.ActiveUserAdministration;
import com.baloise.collab.springbackend.useradmin.UserDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.util.Date;
import java.util.Optional;

@RequiredArgsConstructor
@Log
@Controller
public class ChatWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final ActiveUserAdministration userAdministration;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public OutgoingChatMessageDTO handleChatMessage(Message<String> message) throws Exception {
        var optionalToken = Optional.ofNullable((UsernamePasswordAuthenticationToken) message.getHeaders().get("simpUser"));
        String userName = optionalToken.map(AbstractAuthenticationToken::getName).orElse("dummyUser");

        var dto =  objectMapper.readValue(message.getPayload(), IncomingChatMessageDTO.class);
        log.info(dto.toString());
        var userDTO = userAdministration.getActiveUserForName(userName)
            .orElse(new UserDTO("incognito", "default"));
        return new OutgoingChatMessageDTO(dto.text(), userDTO, dto.clientTimestamp());
    }

    public void sendSystemChatMessage(String chatMessage) {
        var systemUserDTO = new UserDTO("System", "danger");
        var message = new OutgoingChatMessageDTO(chatMessage, systemUserDTO, new Date().toString());
        messagingTemplate.convertAndSend("/topic/chat", message);
    }

}
