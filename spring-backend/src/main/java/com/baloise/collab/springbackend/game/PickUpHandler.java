package com.baloise.collab.springbackend.game;

import com.baloise.collab.springbackend.ColorProvider;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class PickUpHandler {


    private final SimpMessagingTemplate messageSender;
    private long lastSpawn;
    private final List<Pickup> pickups = new ArrayList<>();

    @Getter
    private static final String[] icons =
            {
                    "star-shape", "star-full", "web", "twitter"
            };

    Random random = new Random();

    public int collectPickups(Character character) {
        var pickupsToCollect = new ArrayList<Pickup>();
        pickups.forEach(pickup -> {
            var distance = Math.abs(character.getPosX() - pickup.posX())
                    + Math.abs(character.getPosY() - pickup.posY());
            if(distance < 10) {
                pickupsToCollect.add(pickup);
            }
        });

        pickups.removeAll(pickupsToCollect);
        return pickupsToCollect.size();
    }

    public void spawnPickupsAndSendToClients() {
        var currentTime = System.currentTimeMillis();
        if (currentTime - lastSpawn > 3000) {
            lastSpawn = currentTime;
            pickups.add(
                    new Pickup(
                            icons[random.nextInt(0, icons.length)],
                            ColorProvider.getColors()[random.nextInt(0, icons.length)],
                            random.nextInt(0, 1000),
                            random.nextInt(0, 300)
                    )
            );
        }
        sendPickupsToClients();
    }

    public void clearPickupsAndSendToClients() {
        pickups.clear();
        sendPickupsToClients();
    }

    public void sendPickupsToClients() {
        messageSender.convertAndSend("/topic/game/pickups", pickups);
    }

}
