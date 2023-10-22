import {Component, Input, OnInit} from '@angular/core';
import {Item, ItemDragInfo} from "../../../model";
import store from "../../../store";
import {Client} from "@stomp/stompjs/esm6";

@Component({
  selector: 'app-inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.scss']
})
export class InventoryItemComponent implements OnInit {
  @Input()
  item!: Item

  @Input() client!: Client;

  get currentUser(): string {
    return store.currentUser;
  }



  onDragStart(event: DragEvent) {
    if (this.item.userLock !== this.currentUser) {
      console.warn("EEEEEEEEEEEEEEEEEEEEEEEE!!!")
      event.preventDefault();
    }
    event.dataTransfer?.clearData()
    event.dataTransfer?.setData("application/json", JSON.stringify(this.item))
  }

  onDragging(event : DragEvent) {
    this.sendDragInfo(event, false)
  }

  onDragEnd(event : DragEvent) {
    this.sendDragInfo(event, true)
  }

  sendDragInfo(event : DragEvent, finished : boolean) {
    if (this.item.userLock !== this.currentUser) {
      console.warn("Nein -doch - oohhhhhh")
    } else {
      const itemDragInfo : ItemDragInfo = {
        name : this.item.name,
        posX: event.pageX,
        posY : event.pageY,
        id:this.item.id,
        draggingPlayer: this.item.userLock,
        finished: finished
      }
      this.client?.publish({destination: "/app/item-dragging", body: JSON.stringify(itemDragInfo)
      });
    }
  }


  ngOnInit(): void {
    console.log("hey?")
  }

  protected readonly store = store;
}
