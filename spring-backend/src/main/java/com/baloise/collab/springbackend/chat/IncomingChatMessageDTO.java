package com.baloise.collab.springbackend.chat;

import java.util.Date;

public record IncomingChatMessageDTO(
    String text,
    Date clientTimestamp
) {}
