package com.baloise.collab.springbackend.chat;

import com.baloise.collab.springbackend.useradmin.UserDTO;

record OutgoingChatMessageDTO(
    String text,
    UserDTO user,
    String timestamp
) {}