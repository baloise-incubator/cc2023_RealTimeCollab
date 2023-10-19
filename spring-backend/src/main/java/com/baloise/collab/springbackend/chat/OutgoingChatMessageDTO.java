package com.baloise.collab.springbackend.chat;

import com.baloise.collab.springbackend.useradmin.UserDTO;

public record OutgoingChatMessageDTO(
    String text,
    UserDTO user,
    String timestamp
) {}