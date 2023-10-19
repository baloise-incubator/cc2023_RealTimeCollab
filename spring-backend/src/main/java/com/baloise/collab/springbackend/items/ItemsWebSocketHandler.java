package com.baloise.collab.springbackend.items;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RequiredArgsConstructor
@Log
@Controller
public class ItemsWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final InventoriesWebSocketHandler inventoriesWebSocketHandler;
    private final InventoriesRepository inventoriesRepository;
    private final ItemBasesRepository itemBasesRepository;
    private final ItemsRepository itemsRepository;
    private final SimpMessagingTemplate messageSender;

    @MessageMapping("/itemcreation")
    @SendTo("/topic/inventory")
    public List<InventoryDto> handleItemCreation(Message<String> message) throws Exception {
        var newItem = objectMapper.readValue(message.getPayload(), CreateItemDto.class);
        var inventory = inventoriesRepository.findById(newItem.targetInventoryId()).orElseThrow();
        var itemBase = itemBasesRepository.findById(newItem.name()).orElseThrow();
        var itemEntity = new ItemEntity()
                .withItemBase(itemBase)
                .withInventory(inventory);
        itemsRepository.save(itemEntity);
        return inventoriesWebSocketHandler.fetchAllInventories();
    }

    @MessageMapping("/itemlock")
    public void handleItemLock(Message<String> message) throws JsonProcessingException {
        var dto = objectMapper.readValue(message.getPayload(), ItemLockDto.class);
        var item = itemsRepository.findById(dto.id()).orElseThrow();
        var optionalToken = Optional.ofNullable((UsernamePasswordAuthenticationToken) message.getHeaders().get("simpUser"));
        String userName = optionalToken.map(AbstractAuthenticationToken::getName).orElse("dummyUser");
        if (dto.lock()) {
            if (item.getUserLock() == null) {
                item.setUserLock(userName);
                itemsRepository.save(item);
                notifyInventoryChange();
            }
        } else {
            if (Objects.equals(item.getUserLock(), userName)) {
                item.setUserLock(null);
                itemsRepository.save(item);
                notifyInventoryChange();
            }
        }
    }

    @MessageMapping("/itemtransfer")
    public void handleItemTransfer(Message<String> message) throws JsonProcessingException {
        var dto = objectMapper.readValue(message.getPayload(), ItemTransferDto.class);
        var item = itemsRepository.findById(dto.id()).orElseThrow();
        var optionalToken = Optional.ofNullable((UsernamePasswordAuthenticationToken) message.getHeaders().get("simpUser"));
        String userName = optionalToken.map(AbstractAuthenticationToken::getName).orElse("dummyUser");

        if (Objects.equals(item.getUserLock(), userName)) {
            var targetInventory = inventoriesRepository.findById(dto.targetInventoryId()).orElseThrow();
            item.setInventory(targetInventory);
            item.setUserLock(null);
            itemsRepository.save(item);
            notifyInventoryChange();
        }
    }

    private void notifyInventoryChange() {
        messageSender.convertAndSend("/topic/inventory", inventoriesWebSocketHandler.fetchAllInventories());
    }
}
