package com.baloise.collab.springbackend.game;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class GameLoopExecutor {

    private final CharacterController characterController;
    private final PickUpHandler pickUpHandler;
    private Long lastFrameTime;

    @Getter
    private boolean running;

    @Async
    public void run() throws InterruptedException {
        running = true;
        while (running) {
            var characters =  characterController.getActiveCharacters();
            var time = System.currentTimeMillis();
            if(!characters.isEmpty()){
                characters.forEach(character -> {
                    characterController.moveCharacter(character, time-lastFrameTime);
                    var scoreUpdate = pickUpHandler.collectPickups(character);
                    character.setScore(character.getScore() + scoreUpdate);
                });
            }
            pickUpHandler.spawnPickupsAndSendToClients();
            lastFrameTime = System.currentTimeMillis();
            Thread.sleep(30);
        }
    }

    @Async
    public void quit(){
        running = false;
        lastFrameTime = 0L;
        pickUpHandler.clearPickupsAndSendToClients();
    }



}
