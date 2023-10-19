package com.baloise.collab.springbackend.items;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemsRepository extends CrudRepository<ItemEntity, Long> {
    
}
