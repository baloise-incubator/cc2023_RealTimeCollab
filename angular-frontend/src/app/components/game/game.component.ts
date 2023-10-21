import {Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';

import { Client } from '@stomp/stompjs';
import {Character, Pickup} from "../../../model";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  @Input() client!: Client;
  @Input() currentUser!: String;

  connected : boolean = false;

  // Game stuff
  characters: Character[] = [];
  pickups: Pickup[] = [];

  ngOnInit(): void {
    if (this.client.connected) {
      this.client.subscribe("/topic/game/character", (payload => this.updateCharacter(JSON.parse(payload.body))))
      this.client.subscribe("/topic/game/character_removal", (payload => this.removeCharacter(JSON.parse(payload.body))))
      this.client.subscribe("/topic/game/pickups", (payload => this.updatePickups(JSON.parse(payload.body))))

    }
  }

  ngOnDestroy(): void {
    if (this.client.connected) {
      this.client.unsubscribe("/topic/game/character")
      this.client.unsubscribe("/topic/game/character_removal")
      this.client.unsubscribe("/topic/game/pickups")
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
        event.preventDefault();
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
        event.preventDefault();
        const payload = {keyCode : keyCode, pressed : true}
        this.client?.publish({destination: "/app/game/character_control", body: JSON.stringify(payload)})
      }
    }

  }

  updateCharacter(character : Character) {
    const characterIndexToUpdate  = this.characters.findIndex((char) => char.name === character.name);
    if (characterIndexToUpdate === -1) {
      this.characters.push(character);
    } else {
      this.characters[characterIndexToUpdate] = character;
    }
  }

  removeCharacter(character : Character) {
    this.characters = this.characters.filter(char => char.name != character.name)
  }

  private updatePickups(pickups: Pickup[]) {
    this.pickups = pickups;
  }
}
