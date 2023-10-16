package com.baloise.collab.springbackend;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.List;
import java.util.Random;
import java.util.stream.Stream;

@RequiredArgsConstructor
@Service
@Log
public class StockWebSocketHandler extends TextWebSocketHandler {

    private final SuperRepository superRepository;

    private final String iconLocation = "https://cdn.cdnlogo.com/logos/a/77/amazon-dark.svg";
    private final ObjectMapper objectMapper;
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info(session.getId() + " connected");
        var oldPrice = 0.0f;
        var stockPrice = 0.0f;
        while(true){
            oldPrice = stockPrice;
            stockPrice = superRepository.count();
            var stock = new Stock("SuperStock", iconLocation, stockPrice, stockPrice > oldPrice);

            var message = new TextMessage(objectMapper.writeValueAsString(stock));
            session.sendMessage(message);
            Thread.sleep(100);
        }
    }
}
