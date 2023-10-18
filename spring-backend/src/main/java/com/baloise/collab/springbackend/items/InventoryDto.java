package com.baloise.collab.springbackend.items;

import java.util.List;


public record InventoryDto(
    long id,
    String owner,
    List<ItemDto> items
){}
