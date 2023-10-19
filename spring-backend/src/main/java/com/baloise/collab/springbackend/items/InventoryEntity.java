package com.baloise.collab.springbackend.items;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@With
@AllArgsConstructor
@Table(name="inventory")
public class InventoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String owner;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "inventory")
    private List<ItemEntity> items;
}
