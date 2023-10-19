package com.baloise.collab.springbackend.game;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class GameLoopExecutor {

    private final CharacterController characterController;
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
                characters.forEach(character -> characterController.moveCharacter(character, time-lastFrameTime));
            }
            lastFrameTime = System.currentTimeMillis();
            Thread.sleep(50);
        }
    }

    @Async
    public void quit(){
        running = false;
        lastFrameTime = 0L;
    }



}
