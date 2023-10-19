package com.baloise.collab.springbackend.items;

public record CreateItemDto (
    String name,
    Long targetInventoryId
) {}
