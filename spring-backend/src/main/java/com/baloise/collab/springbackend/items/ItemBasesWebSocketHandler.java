package com.baloise.collab.springbackend.items;

import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Log
@Controller
public class ItemBasesWebSocketHandler {

    private final ItemBasesRepository itemBasesRepository;

    public List<ItemBaseDto> fetchAllItemBases() {
        var itemBases = new ArrayList<ItemBaseDto>();
        itemBasesRepository.findAll()
                .forEach(base -> itemBases.add(new ItemBaseDto(base.getName(), base.getLabel())));
        return itemBases;
    }

    @SubscribeMapping("/itembases")
    public List<ItemBaseDto> initItemBases() {
        return fetchAllItemBases();
    }
}
