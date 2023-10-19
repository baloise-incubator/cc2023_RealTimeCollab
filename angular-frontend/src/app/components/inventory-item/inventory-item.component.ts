import {Component, Input, OnInit} from '@angular/core';
import {Item} from "../../../model";
import store from "../../../store";

@Component({
  selector: 'app-inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.scss']
})
export class InventoryItemComponent implements OnInit {
  @Input()
  item!: Item
  get currentUser(): string {
    return store.currentUser;
  }

  onDragStart(event: DragEvent) {
    event.dataTransfer?.clearData()
    event.dataTransfer?.setData("application/json", JSON.stringify(this.item))
  }

  ngOnInit(): void {
    console.log("hey?")
  }
}
