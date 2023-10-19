import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';

import { Client } from '@stomp/stompjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  @Input() client!: Client;
  @Input() currentUser!: String;

  connected : boolean = false;

  ngOnInit(): void {
    if (this.client.connected) {
      //this.client.subscribe("/topic/chat", payload => this.addMessage(payload));
    }
  }

  ngOnDestroy(): void {
    if (this.client.connected) {
      //this.client.unsubscribe("/topic/chat")
    }
  }

  joinGame() {
    const payload = "joining_game";
    this.client?.publish({ destination: "/app/game/match_join", body: JSON.stringify(payload)});
    this.connected = true;
  }

  leaveGame() {
    const payload = "leaving_game"
    this.client?.publish({ destination: "/app/game/match_leave", body: JSON.stringify(payload)});
    this.connected = false;
  }

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    if(this.client.connected){
      const keyCode = event.code
      console.log("KeyEvent: " + keyCode);

      if(keyCode === "ArrowLeft"
          || keyCode === "ArrowRight"
          || keyCode === "ArrowDown"
          || keyCode === "ArrowUp") {
        const payload = {keyCode : keyCode, pressed : false}
        this.client?.publish({destination: "/app/game/character_control", body: JSON.stringify(payload)})
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if(this.client.connected){
      const keyCode = event.code
      console.log("KeyEvent: " + keyCode);

      if(keyCode === "ArrowLeft"
          || keyCode === "ArrowRight"
          || keyCode === "ArrowDown"
          || keyCode === "ArrowUp") {
        const payload = {keyCode : keyCode, pressed : true}
        this.client?.publish({destination: "/app/game/character_control", body: JSON.stringify(payload)})
      }
    }

  }

}
