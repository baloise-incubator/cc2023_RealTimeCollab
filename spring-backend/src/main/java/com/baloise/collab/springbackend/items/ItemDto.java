package com.baloise.collab.springbackend.items;

public record ItemDto (
    String name,
    Long id,
    String userLock
){}
