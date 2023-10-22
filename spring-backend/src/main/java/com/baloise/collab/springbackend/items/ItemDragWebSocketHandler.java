package com.baloise.collab.springbackend.items;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.util.Optional;

@RequiredArgsConstructor
@Log
@Controller
public class ItemDragWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messageSender;

    @MessageMapping("/item-dragging")
    public void handleDraggingItem(Message<String> message) throws JsonProcessingException {
        var optionalToken = Optional.ofNullable((UsernamePasswordAuthenticationToken) message.getHeaders().get("simpUser"));
        String userName = optionalToken.map(AbstractAuthenticationToken::getName).orElse("dummyUser");

        var dto = objectMapper.readValue(message.getPayload(), ItemDragDTO.class);
        messageSender.convertAndSend("/topic/itemdrag", dto);

    }
}
