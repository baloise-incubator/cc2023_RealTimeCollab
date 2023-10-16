package com.baloise.collab.springbackend;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;


@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final ButtonWebSocketHandler buttonHandler;

    /*@Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(stockHandler, "/stocks").setAllowedOrigins("*");
        registry.addHandler(buttonHandler, "/button").setAllowedOrigins("*");
    }
     */
   @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/connect");
        config.setApplicationDestinationPrefixes("/websocket");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
         registry.addEndpoint("/stocks");
         registry.addEndpoint("/button").withSockJS();
    }

}
