package com.baloise.collab.springbackend;

public record Stock(
        String name,
        String icon,
        float price,
        boolean increased
) {
}
