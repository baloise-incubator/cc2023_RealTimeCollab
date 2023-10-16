package com.baloise.collab.springbackend;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@RequiredArgsConstructor
@Service
@Log
public class ButtonWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final SuperRepository superRepository;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage textMessage) throws Exception {
        log.info(textMessage.toString());
        var dto =  objectMapper.readValue(textMessage.toString(), ButtonMessageDTO.class);
        var entity = new ButtonMessageEntity();
        entity.setUserName(dto.user);
        superRepository.save(entity);
    }
}
