package com.baloise.collab.springbackend.chat;

public record IncomingChatMessageDTO(
    String text,
    String clientTimestamp
) {}
