package com.baloise.collab.springbackend.items;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoriesRepository extends CrudRepository<InventoryEntity, Long> {
    Optional<InventoryEntity> findByOwner(String user);
}
