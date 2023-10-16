package com.baloise.collab.springbackend;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Log
@Controller
public class ButtonWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final SuperRepository superRepository;
    private final String iconLocation = "https://cdn.cdnlogo.com/logos/a/77/amazon-dark.svg";

    @MessageMapping("/button")
    @SendTo("/topic/stocks")
    public Stock handleTextMessage(Message<String> message) throws Exception {
        log.info(message.getPayload().toString());
        var dto =  objectMapper.readValue(message.getPayload().toString(), ButtonMessageDTO.class);
        var entity = new ButtonMessageEntity();
        entity.setUserName(dto.user);
        superRepository.save(entity);
        return updateStockPrice();
    }

    @SendTo("/topic/stocks")
    public Stock doThing() throws Exception {
        return updateStockPrice();
    }

    public Stock updateStockPrice() throws Exception {
        var oldPrice = 0.0f;
        var stockPrice = 0.0f;
        oldPrice = stockPrice;
        stockPrice = superRepository.count();
        return new Stock("SuperStock", iconLocation, stockPrice, stockPrice > oldPrice);
    }
}
