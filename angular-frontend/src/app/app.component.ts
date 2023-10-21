import {Component, OnDestroy, HostListener, Injectable} from '@angular/core';
import { Client } from '@stomp/stompjs';
import {
  Credentials,
  Cursor,
  User,
  Inventory,
  Item,
  ItemBase,
  ItemLockMessage,
  ItemTransferMessage,
  UserColor,
  ItemDragInfo
} from "../model";
import { HttpService } from 'src/http.service';
import {CreateItemEvent} from "../events";
import store from "../store";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@Injectable()
export class AppComponent implements OnDestroy {

  client: Client;
  httpService: HttpService;
  users: User[] = [];
  cursors: Cursor[] = [];
  inventories?: Inventory[];
  draggedItems : ItemDragInfo[] = [];

  get currentUser(): string {
    return store.currentUser;
  }

  set currentUser(currentUser: string) {
    store.currentUser = currentUser;
  }

  constructor(private http: HttpClient) {
    this.httpService = new HttpService(http);
    this.client = new Client();
  }

  ngOnDestroy(): void {
    this.closeWebSocketConnection();
  }

  onConnectToBackend(credentials: Credentials) {
    this.httpService.getRegistrationURL(credentials)
        .subscribe(isValid => {
          if (isValid) {
            console.log("registered user")
            sessionStorage.setItem(
                'token',
                btoa(credentials.username + ':' + credentials.password))
            this.openWebSocketConnection(credentials)
            this.currentUser = credentials.username;
          } else {
            console.log("registering user failed")
            alert("Authentication failed.")
          }
        })
  }

  openWebSocketConnection(credentials : Credentials) {
    this.client.configure({
      debug: (msg) => console.debug(msg),
      webSocketFactory: () => this.httpService.getWebSocket(credentials)
     })

    this.client.onConnect = () => {
      this.client.subscribe("/app/activeUsers", (payload) => this.updateUsers(JSON.parse(payload.body)));
      this.client.subscribe("/topic/activeUsers", (payload) => this.updateUsers(JSON.parse(payload.body)));
      this.client.subscribe("/topic/cursor", (payload => this.updateCursors(JSON.parse(payload.body))));
      this.client.subscribe("/app/inventory", (payload => this.updateInventory(JSON.parse(payload.body))));
      this.client.subscribe("/topic/inventory", (payload => this.updateInventory(JSON.parse(payload.body))));
      this.client.subscribe("/topic/itembases", (payload => this.updateItemBases(JSON.parse(payload.body))));
      this.client.subscribe("/app/itembases", (payload => this.updateItemBases(JSON.parse(payload.body))));
      this.client.subscribe("/topic/itemdrag", (payload => this.updateDraggedItems(JSON.parse(payload.body))));
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

    users.map(user => {
      const userColor : UserColor = {name : user.name, color : user.color}
      return userColor
    }).forEach(userColor => store.setUserColor(userColor))

    this.cursors = this.cursors.filter(cursor => users.find(user => user.name === cursor.name));
  }

  private updateInventory(inventories: Inventory[]) {
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

    const newExceptEx = newItems.filter(x => !exInventory.items!.find(y => x.id === y.id))
    const exExceptNew = exInventory.items.filter(x => !newItems!.find(y => x.id === y.id))
    const toUpdate = exInventory.items
        .map(exItem => ({ exItem, newItem: newItems!.find(x => exItem.id === x.id) }))
        .filter(x => !!x.newItem)

    for (const newItem of newExceptEx) {
      exInventory.items.push(newItem)
    }
    for (const exItem of exExceptNew) {
      exInventory.items.splice(exInventory.items.indexOf(exItem), 1)
    }
    for (const items of toUpdate) {
      items.exItem.name = items.newItem!.name
      items.exItem.userLock = items.newItem!.userLock;
    }
  }

  onItemCreated(event: CreateItemEvent, inventory: Inventory) {
    this.client?.publish({destination: "/app/itemcreation", body: JSON.stringify({
        name: event.name,
        targetInventoryId: inventory.id})
    });
  }

  private updateItemBases(itemBase: ItemBase[]) {
    store.itemBases = itemBase;
  }

  onHoverOverItem(item: Item) {
    if (!item.userLock) {
      this.client?.publish({
        destination: "/app/itemlock", body: JSON.stringify({
          id: item.id,
          lock: true
        } as ItemLockMessage)
      });
      console.log("lock pls")
    }
  }
  onExitItem(item: Item) {
      this.client?.publish({
        destination: "/app/itemlock", body: JSON.stringify({
          id: item.id,
          lock: false
        } as ItemLockMessage)
      });
  }

  onItemMoved(event: ItemTransferMessage) {
    console.log("moved");
    this.client?.publish({
      destination: "/app/itemtransfer", body: JSON.stringify(event)
    });
  }

  private updateDraggedItems(itemDrag: ItemDragInfo) {
    console.log("Dragging received" + itemDrag.id)
    const index = this.draggedItems.findIndex(item => item.id === itemDrag.id)
    if(index >= 0){
      if(itemDrag.finished){
        this.draggedItems.splice(index, 1);
      } else {
        this.draggedItems[index] = itemDrag;
      }
    } else {
      if(!itemDrag.finished){
        this.draggedItems.push(itemDrag);
      }
    }
  }

}
