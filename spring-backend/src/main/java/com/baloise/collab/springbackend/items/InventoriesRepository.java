package com.baloise.collab.springbackend.items;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoriesRepository extends CrudRepository<InventoryEntity, UUID> {
    Optional<InventoryEntity> findByOwner(String user);
}
