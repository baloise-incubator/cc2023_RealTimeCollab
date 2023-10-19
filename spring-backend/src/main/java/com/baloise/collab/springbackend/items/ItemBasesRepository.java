package com.baloise.collab.springbackend.items;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemBasesRepository extends CrudRepository<ItemBaseEntity, String> {
    
}
