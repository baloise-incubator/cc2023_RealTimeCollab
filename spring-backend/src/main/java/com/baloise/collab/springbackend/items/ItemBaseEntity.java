package com.baloise.collab.springbackend.items;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@With
@AllArgsConstructor
@Table(name="item_base")
public class ItemBaseEntity {
    @Id
    private String name;

    private String label;
}
