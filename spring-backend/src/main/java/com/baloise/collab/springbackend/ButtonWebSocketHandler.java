package com.baloise.collab.springbackend;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Log
@Controller
public class ButtonWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final SuperRepository superRepository;
    private final String iconLocation = "https://cdn.cdnlogo.com/logos/a/77/amazon-dark.svg";

    @MessageMapping("/button")
    @SendTo("/stocks")
    public Message<String> handleTextMessage(Message<String> message) throws Exception {
        log.info(message.getPayload().toString());
        var dto =  objectMapper.readValue(message.getPayload().toString(), ButtonMessageDTO.class);
        var entity = new ButtonMessageEntity();
        entity.setUserName(dto.user);
        superRepository.save(entity);
        return updateStockPrice();
    }

    @SendTo("/stocks")
    public Message<String> doThing() throws Exception {
        return updateStockPrice();
    }

    public Message<String> updateStockPrice() throws Exception {
        var oldPrice = 0.0f;
        var stockPrice = 0.0f;
        oldPrice = stockPrice;
        stockPrice = superRepository.count();
        var stock = new Stock("SuperStock", iconLocation, stockPrice, stockPrice > oldPrice);

        return MessageBuilder.withPayload(objectMapper.writeValueAsString(stock)).build();
    }
}
