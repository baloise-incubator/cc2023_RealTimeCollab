package com.baloise.collab.springbackend.items;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemsRepository extends CrudRepository<ItemEntity, Long> {
    List<ItemEntity> findByUserLock(String userLock);
}
