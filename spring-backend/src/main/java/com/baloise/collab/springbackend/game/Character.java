package com.baloise.collab.springbackend.game;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.extern.java.Log;

import java.util.*;

@Data
@Builder
@Log
public class Character {

    private String name;
    private String color;
    private long posX;
    private long posY;
    private Set<String> pressedKeys;

    private final float speed = 0.1f;

    public void addToPressedKeys(String keyCode) {
        pressedKeys.add(keyCode);
    }

    public void removeFromPressedKeys(String keyCode) {
            pressedKeys.remove(keyCode);
    }

    public int getPosXRounded() {
        return Math.round(posX);
    }

    public int getPosYRounded() {
        return Math.round(posY);
    }

    @Override
    public boolean equals(Object o){
        return o.getClass() == this.getClass()
                && Objects.equals(((Character) o).name, this.name);
    }

    @AllArgsConstructor
    private static class MovementDirection {

        public int dirX = 0;
        public int dirY = 0;

        public static MovementDirection add(MovementDirection a, MovementDirection b) {
            return new MovementDirection(a.dirX + b.dirX, a.dirY + b.dirY);
        }
    }

    public void move(Long frameTime) {
        MovementDirection movementDirection;
        if (pressedKeys != null && !pressedKeys.isEmpty()) {
            var directions = pressedKeys.stream().map(this::getMovementDirforKey);
            movementDirection = directions.reduce(new MovementDirection(0, 0), MovementDirection::add);
        } else {
            movementDirection = new MovementDirection(0, 0);
        }
        this.posX = Math.round(posX + movementDirection.dirX * frameTime * speed);
        this.posY = Math.round(posY + movementDirection.dirY * frameTime * speed);
    }

    private MovementDirection getMovementDirforKey(String key) {
        return switch (key) {
            case "ArrowLeft" -> new MovementDirection(-1, 0);
            case "ArrowRight" -> new MovementDirection(1, 0);
            case "ArrowDown" -> new MovementDirection(0, 1);
            case "ArrowUp" -> new MovementDirection(0, -1);
            default -> new MovementDirection(0, 0);
        };
    }


}
