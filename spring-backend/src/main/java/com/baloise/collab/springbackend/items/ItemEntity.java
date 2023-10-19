package com.baloise.collab.springbackend.items;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name="item")
@NoArgsConstructor
@With
@AllArgsConstructor
public class ItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String userLock;

    private String name;

    @ManyToOne
    @JoinColumn(name = "inventoryId")
    private InventoryEntity inventory;
}
