package com.baloise.collab.springbackend;

import lombok.Getter;

public class ColorProvider {

    @Getter
    private static final String[] colors =
            {
                    "primary", "grey", "success", "warning", "danger"
            };
}
