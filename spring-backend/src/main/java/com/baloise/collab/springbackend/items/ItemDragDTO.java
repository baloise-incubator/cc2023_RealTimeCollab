package com.baloise.collab.springbackend.items;

public record ItemDragDTO (
    String name,
    Long id,
    int posX,
    int posY,

    boolean finished){
}
