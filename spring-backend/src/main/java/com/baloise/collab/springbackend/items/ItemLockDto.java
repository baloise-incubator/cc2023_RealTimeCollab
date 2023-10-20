package com.baloise.collab.springbackend.items;

public record ItemLockDto(
        long id,
        boolean lock
) {}
