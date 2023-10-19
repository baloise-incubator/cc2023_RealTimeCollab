import { Component, OnDestroy, HostListener } from '@angular/core';
import { Client } from '@stomp/stompjs';
import {Button, Credentials, Cursor, Stock, User, Inventory, Character, Item} from "../model";
import { HttpService } from 'src/http.service';
import {CreateItemEvent} from "../events";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  client: Client;
  httpService: HttpService;
  users: User[] = [];
  currentUser = "";
  cursors: Cursor[] = [];
  inventories?: Inventory[];

  // Game stuff
  characters: Character[] = []

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
      this.client.subscribe("/app/inventory", (payload => this.updateInventory(JSON.parse(payload.body))));
      this.client.subscribe("/topic/inventory", (payload => this.updateInventory(JSON.parse(payload.body))));
      this.client.subscribe("/topic/game/character", (payload => this.updateCharacter(JSON.parse(payload.body))))
      this.client.subscribe("/topic/game/character_removal", (payload => this.removeCharacter(JSON.parse(payload.body))))
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

  private updateInventory(inventories: Inventory[]) {
    console.log("inventory update", inventories)
    if (!this.inventories) {
      this.inventories = inventories;
      return;
    }

    var newExceptEx = inventories.filter(x => !this.inventories!.find(y => x.id === y.id))
    var exExceptNew = this.inventories.filter(x => !inventories!.find(y => x.id === y.id))
    var toUpdate = this.inventories
        .map(exInventory => ({ exInventory, newInventory: inventories!.find(x => exInventory.id === x.id) }))
        .filter(x => !!x.newInventory)

    for (const newInventory of newExceptEx) {
      this.inventories.push(newInventory)
    }
    for (const exInventory of exExceptNew) {
      this.inventories.splice(this.inventories.indexOf(exInventory), 1)
    }
    for (const inventories of toUpdate) {
      this.updateItemsForInventory(inventories.exInventory, inventories.newInventory!.items)
    }
  }

  private updateItemsForInventory(exInventory: Inventory, newItems: Item[]) {
    if (!exInventory.items) {
      exInventory.items = newItems;
      return;
    }

    var newExceptEx = newItems.filter(x => !exInventory.items!.find(y => x.id === y.id))
    var exExceptNew = exInventory.items.filter(x => !newItems!.find(y => x.id === y.id))
    var toUpdate = exInventory.items
        .map(exItem => ({ exItem, newItem: newItems!.find(x => exInventory.id === x.id) }))
        .filter(x => !!x.newItem)

    for (const newItem of newExceptEx) {
      exInventory.items.push(newItem)
    }
    for (const exItem of exExceptNew) {
      exInventory.items.splice(exInventory.items.indexOf(exItem), 1)
    }
    for (const items of toUpdate) {
      items.exItem.name = items.newItem!.name
    }
  }

  onItemCreated(event: CreateItemEvent, inventory: Inventory) {
    this.client?.publish({destination: "/app/itemcreation", body: JSON.stringify({
        name: event.name,
        targetInventoryId: inventory.id})
    });
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
}
