import { Component, OnDestroy, HostListener } from '@angular/core';
import { Client } from '@stomp/stompjs';
import {Button, Credentials, Cursor, Stock, User, Inventory, Character} from "../model";
import { HttpService } from 'src/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  
  client: Client;
  httpService: HttpService;
  users: User[] = []
  currentUser = ""
  cursors: Cursor[] = []

  // Game stuff
  characters: Character[] = []

  alexInventory = {
    owner: "Alex",
    uuid: crypto.randomUUID(),
    items: [],
  } as Inventory

  chestInventory = {
    owner: "Chest",
    uuid: crypto.randomUUID(),
    items: [],
  } as Inventory

  constructor() {
    this.httpService = new HttpService();
    this.client = new Client();
  }

  ngOnDestroy(): void {
    this.closeWebSocketConnection();
  }

  openWebSocketConnection(credentials : Credentials) {
    this.client.configure({
      debug: (msg) => console.log(msg),
      webSocketFactory: () => this.httpService.getWebSocket(credentials)
     })

    this.client.onConnect = () => {
      this.client.subscribe("/app/activeUsers", (payload) => this.updateUsers(JSON.parse(payload.body)));
      this.client.subscribe("/topic/activeUsers", (payload) => this.updateUsers(JSON.parse(payload.body)));
      this.client.subscribe("/topic/cursor", (payload => this.updateCursors(JSON.parse(payload.body))));
      this.client.subscribe("/topic/game/character", (payload => this.updateCharacter(JSON.parse(payload.body))))
    };

    this.client.onWebSocketError = (error) => {
      console.error('Error with websocket', error);
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };
    this.client.activate();
  }

  closeWebSocketConnection() {
    if (this.client) {
      this.client.deactivate();
    }
  }

  onConnectToBackend(credentials: Credentials) {
    this.openWebSocketConnection(credentials);
    this.currentUser = credentials.username;
  }

  mouseMoved(event: MouseEvent) {
    if(this.client.connected) {
      const payload = {posX: event.pageX, posY: event.pageY};
      this.client?.publish({destination: "/app/cursor", body: JSON.stringify(payload)});
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.client.connected){
      const keyCode = event.code
      console.log("KeyEvent: " + keyCode);

      if(keyCode === "KeyJ"){
        console.log("Joining Game:");
        const payload = "joining_game"
        this.client?.publish({ destination: "/app/match_join", body: JSON.stringify(payload)});
      } else if(keyCode === "ArrowLeft"
          || keyCode === "ArrowRight"
          || keyCode === "ArrowDown"
          || keyCode === "ArrowUp") {
        this.client?.publish({destination: "/app/game_control", body: JSON.stringify(keyCode)})
      }
    }

  }

  updateCursors(newPosition: Cursor) {
    if (this.currentUser === newPosition.name) {
      return
    }
    const currentCursor = this.cursors.findIndex((cursor) => cursor.name === newPosition.name);

    if (currentCursor === -1) {
      this.cursors.push(newPosition);
    } else {
      this.cursors[currentCursor] = newPosition;
    }
  }

  updateUsers(users: User[]) {
    this.users = users;
    this.cursors = this.cursors.filter(cursor => users.find(user => user.name === cursor.name));
  }

  updateCharacter(character : Character) {
    const characterIndexToUpdate  = this.characters.findIndex((char) => char.name === character.name);

    if (characterIndexToUpdate === -1) {
      this.characters.push(character);
    } else {
      this.characters[characterIndexToUpdate] = character;
    }
  }
}
