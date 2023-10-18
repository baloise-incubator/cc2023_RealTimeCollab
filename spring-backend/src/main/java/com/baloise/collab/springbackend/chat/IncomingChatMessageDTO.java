package com.baloise.collab.springbackend.chat;

record IncomingChatMessageDTO(
    String text,
    String clientTimestamp
) {}
