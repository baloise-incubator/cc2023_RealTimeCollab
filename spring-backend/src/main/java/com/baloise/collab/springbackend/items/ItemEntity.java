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

    @Column(nullable = true)
    private String userLock;

    @ManyToOne
    @JoinColumn(name = "inventoryId")
    private InventoryEntity inventory;

    @ManyToOne
    @JoinColumn(name = "name")
    private ItemBaseEntity itemBase;
}
