package com.baloise.collab.springbackend.chat;

import java.util.Date;

import com.baloise.collab.springbackend.useradmin.UserDTO;

public record OutgoingChatMessageDTO(
    String text,
    UserDTO user,
    Date timestamp
) {}