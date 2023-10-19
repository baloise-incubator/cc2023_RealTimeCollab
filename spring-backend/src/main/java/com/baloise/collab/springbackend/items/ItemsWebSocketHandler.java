package com.baloise.collab.springbackend.items;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;

@RequiredArgsConstructor
@Log
@Controller
public class ItemsWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final InventoriesWebSocketHandler inventoriesWebSocketHandler;
    private final InventoriesRepository inventoriesRepository;
    private final ItemsRepository itemsRepository;

    @MessageMapping("/itemcreation")
    @SendTo("/topic/inventory")
    public List<InventoryDto> handleItemCreation(Message<String> message) throws Exception {
        var newItem = objectMapper.readValue(message.getPayload(), CreateItemDto.class);
        var inventory = inventoriesRepository.findById(newItem.targetInventoryId()).orElseThrow();
        var itemEntity = new ItemEntity()
                .withName(newItem.name())
                .withInventory(inventory);
                //.withInventoryId(newItem.targetInventoryId());
        itemsRepository.save(itemEntity);
        return inventoriesWebSocketHandler.fetchAllInventories();
    }
}
