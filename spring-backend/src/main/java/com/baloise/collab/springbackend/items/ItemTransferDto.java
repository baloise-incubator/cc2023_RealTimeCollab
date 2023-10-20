package com.baloise.collab.springbackend.items;

public record ItemTransferDto(
        long id,
        long targetInventoryId
) {}
