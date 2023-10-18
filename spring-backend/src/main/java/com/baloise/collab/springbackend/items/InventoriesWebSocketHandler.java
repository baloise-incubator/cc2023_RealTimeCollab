package com.baloise.collab.springbackend.items;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Log
@Controller
public class InventoriesWebSocketHandler {

    private final InventoriesRepository inventoriesRepository;
    private final SimpMessagingTemplate messageSender;

    public void handleInventoryCreation(String username) {
        createInventoryForUser(username);
        messageSender.convertAndSend("/topic/inventory", fetchAllInventories());
    }

    private void createInventoryForUser(String username) {
        if (inventoriesRepository.findByOwner(username).isEmpty()) {
            var entity = new InventoryEntity()
                    .withOwner(username);
            inventoriesRepository.save(entity);
        }
    }

    private List<InventoryDto> fetchAllInventories() {
        var inventories = new ArrayList<InventoryEntity>();
        inventoriesRepository.findAll().forEach(inventories::add);
        return inventories.stream().map(entity -> {
            return new InventoryDto(entity.getId(), entity.getOwner(), Collections.emptyList());
        }).collect(Collectors.toList());
    }

    @SubscribeMapping("/inventory")
    public List<InventoryDto> initInventory() {
        return fetchAllInventories();
    }
}
