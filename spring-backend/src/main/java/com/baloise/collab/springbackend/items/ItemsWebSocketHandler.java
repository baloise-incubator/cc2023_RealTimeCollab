package com.baloise.collab.springbackend.items;

import com.baloise.collab.springbackend.SuperRepository;
import com.baloise.collab.springbackend.useradmin.ActiveUserAdministration;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Controller;

import java.util.Optional;

@RequiredArgsConstructor
@Log
@Controller
public class ItemsWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final ActiveUserAdministration userAdministration;
    private final SuperRepository superRepository;
/*
    @MessageMapping("/items")
    @SendTo("/topic/items")
    public InventoryDto handleCursorUpdate(CreateItemDto newItem) throws Exception {
        var itemEntity = new ItemEntity();
        itemEntity.setInventory();
        //var color = userDTO.map(UserDTO::color).orElse("default");
        return new OutgoingCursorDTO(userName, color, dto.posX(), dto.posY());
    }

    public*/
}
